/* ===== util.js 通用工具：KaTeX 渲染 / DOM / 答案归一化 ===== */
(function (w) {
  'use strict';

  // ---------- DOM 助手 ----------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k.startsWith('on') && typeof attrs[k] === 'function') e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(c => { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }

  // ---------- HTML 转义 ----------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---------- KaTeX：把含 $...$ / $$...$$ 的字符串渲染成 HTML ----------
  // 无需 CDN 的 auto-render，自己按分隔符切分。$$ 为块级，$ 为行内。
  function tex(str) {
    if (str == null) return '';
    str = String(str);
    if (typeof w.katex === 'undefined') return esc(str); // KaTeX 尚未加载则退化为纯文本
    let out = '';
    let i = 0;
    while (i < str.length) {
      // 块级 $$...$$
      if (str[i] === '$' && str[i + 1] === '$') {
        const end = str.indexOf('$$', i + 2);
        if (end !== -1) {
          out += renderTex(str.slice(i + 2, end), true);
          i = end + 2; continue;
        }
      }
      // 行内 $...$
      if (str[i] === '$') {
        const end = str.indexOf('$', i + 1);
        if (end !== -1) {
          out += renderTex(str.slice(i + 1, end), false);
          i = end + 1; continue;
        }
      }
      // 普通字符：累积到下一个 $，做转义 + 换行
      let next = str.indexOf('$', i);
      if (next === -1) next = str.length;
      out += esc(str.slice(i, next)).replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      i = next;
    }
    return out;
  }
  function renderTex(code, display) {
    try {
      return w.katex.renderToString(code, {
        displayMode: display, throwOnError: false, strict: false,
        trust: false, output: 'html'
      });
    } catch (e) {
      return '<span style="color:#d16a5a">[公式错误]</span>';
    }
  }
  // 把某个容器里带 data-tex 的元素渲染（备用）
  function mountTex(root) {
    $$('[data-tex]', root).forEach(n => { n.innerHTML = tex(n.getAttribute('data-tex')); });
  }

  // ---------- 填空答案归一化与比对 ----------
  // 尽量宽松：忽略空格/大小写；1/2==0.5；x^2==x²==x**2；π==pi 等
  function normAns(raw) {
    if (raw == null) return '';
    let s = String(raw).trim().toLowerCase();
    s = s.replace(/\s+/g, '');
    s = s.replace(/，/g, ',').replace(/。/g, '');
    // 全角/上标转普通
    s = s.replace(/²/g, '^2').replace(/³/g, '^3');
    s = s.replace(/\*\*/g, '^').replace(/·|×|\*/g, '');
    s = s.replace(/π/g, 'pi').replace(/∞/g, 'inf');
    s = s.replace(/[（）]/g, m => (m === '（' ? '(' : ')'));
    s = s.replace(/\{|\}/g, '');
    // \frac{a}{b} -> a/b
    s = s.replace(/\\frac(\w+|\([^)]*\))(\w+|\([^)]*\))/g, '$1/$2');
    s = s.replace(/\\left|\\right|\\,|\\!|\\;|\\ /g, '');
    s = s.replace(/\\/g, '');
    // 去掉结尾 +c / +C
    s = s.replace(/\+c$/i, '');
    return s;
  }
  function numVal(s) {
    // 尝试把简单分数/小数转成数字用于数值比较
    if (/^[-+]?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
    const m = s.match(/^([-+]?\d+(?:\.\d+)?)\/([-+]?\d+(?:\.\d+)?)$/);
    if (m) { const d = parseFloat(m[2]); if (d !== 0) return parseFloat(m[1]) / d; }
    return null;
  }
  function checkFill(user, accepts) {
    const u = normAns(user);
    if (!u) return false;
    const list = Array.isArray(accepts) ? accepts : [accepts];
    for (const a of list) {
      const na = normAns(a);
      if (u === na) return true;
      const nu = numVal(u), nv = numVal(na);
      if (nu != null && nv != null && Math.abs(nu - nv) < 1e-6) return true;
    }
    return false;
  }

  // ---------- 杂项 ----------
  function todayStr(d) { d = d || new Date(); return d.toISOString().slice(0, 10); }
  function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }
  function fmtMin(min) {
    min = Math.round(min || 0);
    if (min < 60) return min + ' 分钟';
    return Math.floor(min / 60) + ' 小时 ' + (min % 60) + ' 分';
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  w.U = { $, $$, el, esc, tex, renderTex, mountTex, normAns, checkFill, todayStr, daysBetween, fmtMin, shuffle, clamp };
})(window);
