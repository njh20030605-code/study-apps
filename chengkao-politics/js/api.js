/* ============================================================
 * api.js —— Claude API 封装
 * 直连 https://api.anthropic.com/v1/messages
 * 注意：浏览器直连需要加 anthropic-dangerous-direct-browser-access 头，
 * 否则会被 CORS 拦截。API Key 存在 localStorage，不硬编码。
 * ============================================================ */

const AI = (function () {

  // 是否具备联网调用条件（有 key）
  function ready() {
    const s = Store.get();
    return !!(s.apiKey && s.apiKey.trim());
  }

  /**
   * 调用 Claude。
   * @param {Array} messages  [{role:'user'|'assistant', content:'...'}]
   * @param {Object} opts      {system, model, maxTokens, useStrong}
   * @returns {Promise<string>} 助手回复的纯文本
   */
  async function chat(messages, opts = {}) {
    const s = Store.get();
    if (!ready()) {
      throw new Error("NO_KEY");
    }
    const model = opts.model || (opts.useStrong ? s.modelStrong : s.modelFast);
    const key = s.apiKey.trim();
    const format = s.apiFormat || "anthropic";
    // 根地址：兼容用户填了 / 结尾或带 /v1 的情况
    let base = (s.apiBaseUrl || "https://api.anthropic.com").trim().replace(/\/+$/, "");
    const hasV1 = /\/v1$/.test(base);

    let url, headers, body;
    if (format === "openai") {
      // OpenAI 兼容格式：/v1/chat/completions，system 作为一条消息
      url = (hasV1 ? base : base + "/v1") + "/chat/completions";
      headers = { "content-type": "application/json", "authorization": "Bearer " + key };
      const msgs = opts.system ? [{ role: "system", content: opts.system }, ...messages] : messages;
      body = { model, max_tokens: opts.maxTokens || 1200, messages: msgs };
    } else {
      // Anthropic 原生格式：/v1/messages
      url = (hasV1 ? base : base + "/v1") + "/messages";
      headers = {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      };
      body = { model, max_tokens: opts.maxTokens || 1200, messages };
      if (opts.system) body.system = opts.system;
    }

    // 30 秒超时
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeout || 30000);

    let resp;
    try {
      resp = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });
    } catch (err) {
      clearTimeout(timer);
      if (err.name === "AbortError") throw new Error("TIMEOUT");
      throw new Error("NETWORK");
    }
    clearTimeout(timer);

    if (!resp.ok) {
      // 把服务器返回的真实原因带出来（中转站常把"模型名不对/余额不足/无权限"也报成401/403）
      let detail = "";
      try {
        const j = await resp.json();
        detail = (j && (j.error?.message || j.message || j.error)) || "";
        if (typeof detail !== "string") detail = JSON.stringify(detail);
      } catch (e) {
        try { detail = (await resp.text()).slice(0, 200); } catch (e2) {}
      }
      const modelHint = `（当前模型：${model}；地址：${base}；格式：${format}）`;
      if (resp.status === 401 || resp.status === 403)
        throw new Error("BAD_KEY:" + (detail || "服务器未说明原因") + modelHint);
      if (resp.status === 429) throw new Error("RATE_LIMIT");
      if (resp.status === 404)
        throw new Error("API_ERROR:404 找不到接口或模型。" + (detail ? "服务器说：" + detail : "") + modelHint);
      throw new Error("API_ERROR:" + resp.status + " " + detail + modelHint);
    }

    const data = await resp.json();
    let text = "";
    if (format === "openai") {
      text = (data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content : "") || "";
    } else {
      // Anthropic：content 是块数组，取所有 text 块拼接
      text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
    }
    return (text || "").trim();
  }

  // 把错误码翻译成友好中文提示
  function friendlyError(err) {
    const msg = (err && err.message) || "";
    if (msg === "NO_KEY") return "还没填 API Key。请到「设置」里填入你的 Claude API Key 后再用 AI 功能。";
    if (msg.startsWith("BAD_KEY"))
      return "被服务器拒绝（401/403）。可能是：① API Key 填错/过期；② 模型名不对（B.AI 要用 claude-sonnet-5 / claude-haiku-4.5 这种写法）；③ 余额不足或该渠道不支持这个模型。服务器原话：" + msg.slice(8);
    if (msg === "RATE_LIMIT") return "请求太频繁（触发限流），歇几秒再试。";
    if (msg === "TIMEOUT") return "请求超时，可能是网络慢或断网。基础刷题不受影响。";
    if (msg === "NETWORK") return "网络连接失败。检查是否联网；AI 功能需要联网，基础刷题可离线用。";
    if (msg.startsWith("API_ERROR")) return "接口出错（" + msg + "）。稍后再试。";
    return "AI 调用出错：" + msg;
  }

  return { ready, chat, friendlyError };
})();
