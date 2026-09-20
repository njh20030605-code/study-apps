/* ===== ai.js  Claude API 封装（B.AI 中转，Anthropic 原生 / OpenAI 兼容可切换）===== */
(function (w) {
  'use strict';

  function cfg() {
    const s = w.DB.settings();
    return {
      key: (s.apiKey || '').trim(),
      base: (s.apiBase || 'https://api.b.ai').trim().replace(/\/+$/, ''),
      format: s.apiFormat || 'anthropic',
      modelFast: s.modelFast || 'claude-haiku-4-5',
      modelStrong: s.modelStrong || 'claude-sonnet-5'
    };
  }
  function hasKey() { return !!cfg().key; }

  // messages: [{role:'user'|'assistant', content:'...'}]
  // opts: {system, strong(布尔:用强力模型), maxTokens}
  async function chat(messages, opts) {
    opts = opts || {};
    const c = cfg();
    if (!c.key) throw new AIError('没填 API Key。请到「设置 ⚙️」填写你在 chat.b.ai 创建的 key。', 'nokey');
    const model = opts.strong ? c.modelStrong : c.modelFast;
    const maxTokens = opts.maxTokens || 1400;

    let url, headers, body;
    if (c.format === 'openai') {
      url = c.base + '/v1/chat/completions';
      headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + c.key };
      const msgs = messages.slice();
      if (opts.system) msgs.unshift({ role: 'system', content: opts.system });
      body = { model, max_tokens: maxTokens, messages: msgs, temperature: opts.temperature ?? 0.3 };
    } else {
      // anthropic 原生 /v1/messages
      url = c.base + '/v1/messages';
      headers = {
        'Content-Type': 'application/json',
        'x-api-key': c.key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      };
      body = {
        model, max_tokens: maxTokens,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: opts.temperature ?? 0.3
      };
      if (opts.system) body.system = opts.system;
    }

    let res;
    try {
      res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    } catch (e) {
      throw new AIError(
        '网络请求失败，很可能是 CORS 跨域被浏览器挡住。\n' +
        '① 到设置里把「接口格式」切成 OpenAI 兼容试试；\n' +
        '② 确认接口地址填的是 ' + c.base + '；\n' +
        '③ 仍不行可联系 B.AI 客服确认是否支持浏览器直连。', 'network');
    }
    if (!res.ok) {
      let detail = '';
      try { const j = await res.json(); detail = j.error?.message || j.message || JSON.stringify(j); } catch (e) { detail = await res.text().catch(() => ''); }
      if (res.status === 401 || res.status === 403) throw new AIError('API Key 无效或没有权限（' + res.status + '）。到设置检查 key 是否填对、账户是否有余额。', 'auth');
      if (res.status === 429) throw new AIError('请求太频繁或额度用尽（429）。歇一会儿再试，或去 chat.b.ai 充值。', 'rate');
      throw new AIError('接口返回错误（' + res.status + '）：' + (detail || '未知').slice(0, 300), 'http');
    }

    let data;
    try { data = await res.json(); } catch (e) { throw new AIError('接口返回内容无法解析。', 'parse'); }

    // 解析文本
    let text = '';
    if (c.format === 'openai') {
      text = data.choices?.[0]?.message?.content || '';
    } else {
      text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('') || '';
    }
    if (!text) throw new AIError('接口没有返回内容。', 'empty');
    return text.trim();
  }

  class AIError extends Error { constructor(msg, code) { super(msg); this.code = code; } }

  // 超时包装
  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, rej) => setTimeout(() => rej(new AIError('AI 响应超时（' + (ms / 1000) + '秒），网络可能较慢，稍后重试。', 'timeout')), ms))
    ]);
  }
  function ask(messages, opts) { return withTimeout(chat(messages, opts), (opts && opts.timeout) || 60000); }

  w.AI = { ask, hasKey, AIError, cfg };
})(window);
