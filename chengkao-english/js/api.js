/* ============================================================================
 * api.js  ——  封装对 Anthropic Claude API 的调用
 * 文档：https://docs.claude.com
 * 端点：https://api.anthropic.com/v1/messages
 *
 * 说明：
 *  - 浏览器直连需要带 header: anthropic-dangerous-direct-browser-access: true
 *  - API Key 从设置里读（STATE.settings.apiKey），不硬编码
 *  - 统一处理：无 key / 超时 / 网络失败 → 抛出友好中文错误
 * ========================================================================== */

const API_VERSION = "2023-06-01";

/* 有的中转声称兼容但 stream:true 会挂起不吐数据（B.AI 的 openai 通道踩过）。
   一旦发现流式一个字都收不到，本次会话就不再尝试流式，全部走稳的非流式。 */
let STREAM_BROKEN = false;

/* 把用户填的中转地址整理成干净的根地址（去掉结尾的 / 和 /v1） */
function apiBaseUrl() {
  let b = (STATE.settings.apiBase || "https://api.anthropic.com").trim();
  b = b.replace(/\/+$/, "");        // 去掉结尾斜杠
  b = b.replace(/\/v1$/, "");       // 若填到了 /v1 也去掉，统一由代码补
  return b;
}

/* 是否联网（离线时 AI 功能优雅降级） */
function isOnline() {
  return navigator.onLine;
}

/* 是否已配置 API Key */
function hasApiKey() {
  return !!(STATE && STATE.settings && STATE.settings.apiKey && STATE.settings.apiKey.trim());
}

/**
 * 调用 Claude
 * @param {Object} opts
 *   opts.system     系统提示（字符串）
 *   opts.messages   对话数组 [{role:'user'|'assistant', content:'...'}]
 *   opts.model      模型名；不传则用日常快速模型（Haiku 档）
 *   opts.strong     true → 用能力更强的模型（Sonnet 档），用于作文批改/诊断
 *   opts.maxTokens  最大输出 token，默认 1024
 * @returns {Promise<string>} 返回 Claude 的文本回复
 */
async function callClaude(opts) {
  if (!isOnline()) {
    throw new Error("当前没有联网，AI 功能暂时用不了。基础刷题、背模板不受影响。");
  }
  if (!hasApiKey()) {
    throw new Error("还没填 API Key。请到【设置】页填入你的 Anthropic API Key。");
  }

  const model = opts.model || (opts.strong ? STATE.settings.modelStrong : STATE.settings.modelFast);

  const isOpenAI = STATE.settings.apiFormat === "openai";
  const key = STATE.settings.apiKey.trim();

  // 流式：传了 opts.onDelta 就边收边回调（onDelta(目前收到的全文)）。
  // 中转慢的时候这是救命的：非流式要等全文写完才见字，流式 1-2 秒就出开头。
  const wantStream = typeof opts.onDelta === "function" && (opts._probe || !STREAM_BROKEN) && !opts._noStream;

  let url, headers, body;
  if (isOpenAI) {
    // OpenAI 兼容格式：/v1/chat/completions，用 Authorization: Bearer，system 作为第一条消息
    url = apiBaseUrl() + "/v1/chat/completions";
    headers = { "content-type": "application/json", "authorization": "Bearer " + key };
    const msgs = (opts.system ? [{ role: "system", content: opts.system }] : []).concat(opts.messages || []);
    body = { model: model, max_tokens: opts.maxTokens || 1024, messages: msgs, stream: wantStream };
  } else {
    // Anthropic 原生格式：/v1/messages，用 x-api-key
    url = apiBaseUrl() + "/v1/messages";
    headers = {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": API_VERSION,
      "anthropic-dangerous-direct-browser-access": "true",
    };
    body = { model: model, max_tokens: opts.maxTokens || 1024, messages: opts.messages || [], stream: wantStream };
    if (opts.system) body.system = opts.system;
  }

  // 超时控制。默认 90 秒：走第三方中转时 30 秒经常不够，超时了用户以为卡死
  const timeoutMs = opts.timeoutMs || 90000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let resp;
  try {
    resp = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    if (e.name === "AbortError") {
      throw new Error("AI 响应超时（超过 " + Math.round(timeoutMs / 1000) + " 秒）。可能是中转服务慢，稍等再点一次重试。");
    }
    throw new Error("网络请求失败，可能是网络问题或需要科学上网。请稍后重试。");
  }
  clearTimeout(timer);

  if (!resp.ok) {
    let msg = `AI 服务返回错误（${resp.status}）。`;
    try {
      const err = await resp.json();
      const detail = err && err.error && err.error.message ? err.error.message : "";
      if (resp.status === 401) msg = "API Key 无效或已过期，请到【设置】检查。";
      else if (resp.status === 429) msg = "请求太频繁或额度用完了，稍等一下再试。";
      else if (resp.status === 400) msg = "请求有误：" + detail;
      else if (detail) msg += " " + detail;
    } catch (_) {}
    throw new Error(msg);
  }

  // ---------- 流式分支：SSE 逐块读，边收边回调 ----------
  const ctype = resp.headers.get("content-type") || "";
  if (wantStream && ctype.indexOf("text/event-stream") >= 0 && resp.body) {
    // 连接已建立。第一个字给 45 秒：慢中转排队经常 20-30 秒才吐首字，
    // 给短了会把"慢"误判成"坏"（2026-08-14 踩过：误判后永远走非流式，
    // 而非流式要等整段写完才回包，长生成必超时）。出字之后 30 秒静默超时。
    let idle = setTimeout(() => controller.abort(), 45000);
    const reader = resp.body.getReader();
    const dec = new TextDecoder();
    let buf = "", full = "";
    try {
      while (true) {
        let chunk;
        try { chunk = await reader.read(); }
        catch (e) {
          if (!full) break;   // 一个字都没收到：跳出去走降级逻辑
          throw new Error("AI 输出到一半断开了（30 秒没有新内容）。已收到的部分保留在屏幕上，可重试。");
        }
        if (chunk.done) break;
        clearTimeout(idle); idle = setTimeout(() => controller.abort(), 30000);
        buf += dec.decode(chunk.value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop();
        for (const ln of lines) {
          if (ln.indexOf("data:") !== 0) continue;
          const payload = ln.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const j = JSON.parse(payload);
            let piece = "";
            if (j.type === "content_block_delta" && j.delta && j.delta.text) piece = j.delta.text;                       // anthropic 原生
            else if (j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content) piece = j.choices[0].delta.content;  // openai 兼容
            if (piece) { full += piece; try { opts.onDelta(full); } catch (e) { /* 界面回调出错不影响接收 */ } }
          } catch (e) { /* 非 JSON 行（心跳/注释）忽略 */ }
        }
      }
    } finally { clearTimeout(idle); }
    if (!full) {
      if (opts._probe) throw new Error("STREAM_UNSUPPORTED");
      // 中转的流式通道是坏的：记住，本次会话不再尝试；自动用非流式重发这一条
      STREAM_BROKEN = true;
      return callClaude(Object.assign({}, opts, { _noStream: true }));
    }
    if (opts._probe) STREAM_BROKEN = false;   // 探测成功：解除之前可能的误判
    return full.trim();
  }

  // ---------- 非流式（或中转不支持 stream，返回整包）----------
  const raw = await resp.text();
  let data = null;
  try { data = JSON.parse(raw); } catch (e) {
    // 不是 JSON：有的中转把 SSE 文本整包塞回来，把 data: 行拼起来兜住
    let full = "";
    raw.split("\n").forEach((ln) => {
      if (ln.indexOf("data:") !== 0) return;
      const payload = ln.slice(5).trim();
      if (!payload || payload === "[DONE]") return;
      try {
        const j = JSON.parse(payload);
        if (j.type === "content_block_delta" && j.delta && j.delta.text) full += j.delta.text;
        else if (j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content) full += j.choices[0].delta.content;
      } catch (e2) {}
    });
    if (full) { if (typeof opts.onDelta === "function") { try { opts.onDelta(full); } catch (e3) {} } return full.trim(); }
    throw new Error("AI 返回了无法解析的内容，请把接口格式换一种再试。");
  }
  let text = "";
  if (isOpenAI) {
    if (data && data.choices && data.choices[0] && data.choices[0].message) text = (data.choices[0].message.content || "").trim();
  } else if (data && Array.isArray(data.content)) {
    text = data.content.map((c) => (c.type === "text" ? c.text : "")).join("").trim();
  }
  if (typeof opts.onDelta === "function" && text) { try { opts.onDelta(text); } catch (e) {} }
  return text;
}
