/* ============================================================================
 * collocations.js —— 搭配速记表（固定搭配 + 近义词辨析）
 * ----------------------------------------------------------------------------
 * 为什么单独做这一页（2026-09-12 查重得出的结论）：
 *   把 7 套整卷 + 各年真题按考点统计，**固定搭配 6/6 个年份必考、近义词辨析 4/6**，
 *   两者合起来常年占 15 道语法题里的 6-8 道（40-50%）。
 *   而这类题「背规则没用，只能一条条记」—— 是语法板块里唯一能靠纯背拿分的部分。
 *   用户今天真卷语法只考了 3/15，这里是最快的捡漏空间。
 *
 * ⚠️ 表格**不是写死的**，是每次打开从题库现抽（collocation / word-choice 且 real|mock）。
 *   以后往题库加真题，这张表自动跟着长，不用手工维护。
 *   抽取优先级：optionNotes[答案]（「对：be patient with sb＝对某人耐心」）
 *              → explanation 里的 **词组 ＝ 中文** → 兜底只显示正确项+解析。
 * ========================================================================== */

/* 把「对：be patient with sb＝对某人耐心」拆成 ['be patient with sb','对某人耐心'] */
function _cSplit(s) {
  const t = String(s || "").replace(/^[对错]：/, "").replace(/\*\*/g, "").trim();
  const i = t.search(/[=＝]/);
  if (i < 0) return [t, ""];
  return [t.slice(0, i).trim(), t.slice(i + 1).trim()];
}

/* 一道题 → 一条速记条目 */
function collocRow(q) {
  let en = "", zh = "";
  if (q.optionNotes && q.optionNotes.length === q.options.length && q.optionNotes[q.answer]) {
    const r = _cSplit(q.optionNotes[q.answer]); en = r[0]; zh = r[1];
  }
  if ((!en || !zh) && q.explanation) {
    const m = q.explanation.match(/\*\*([^*]+?)\s*[=＝]\s*([^*\n。]+)\*\*/) ||
              q.explanation.match(/\*\*([^*]+)\*\*\s*[=＝]\s*([^\n。，]+)/);
    if (m) { en = en || m[1].trim(); zh = zh || m[2].trim(); }
  }
  if (!en || !/[a-zA-Z]/.test(en)) en = q.options[q.answer];
  // 干扰项：真考的时候看到的就是这几个，认不出来照样错
  const traps = [];
  if (q.optionNotes && q.optionNotes.length === q.options.length) {
    q.optionNotes.forEach((n, i) => {
      if (i === q.answer) return;
      const t = String(n || "").replace(/^错：/, "").replace(/\*\*/g, "").trim();
      if (t) traps.push(t);
    });
  }
  return {
    q: q, en: en, zh: zh, traps: traps,
    real: !!q.real,
    from: (q.source || "").replace(/\s*·.*$/, "").replace(/（.*$/, "").trim(),
    note: zh ? "" : (q.explanation || "").split("\n")[0].replace(/\*\*/g, ""),
  };
}

/* 按「结构」归类——背搭配最有效的分法就是按结构背，不是按字母 */
const COLLOC_KINDS = [
  { key: "be", name: "be + 形容词 + 介词", tip: "考点永远是介词。看到 be + adj. 就问「后面跟哪个介词」",
    test: (en) => /\bbe\s+\w+(\s+\w+)?\s+(to|with|in|of|for|at|on|from|about|against)\b/i.test(en) },
  { key: "vp", name: "动词短语（动词 + 介副词）", tip: "同一个动词换个介副词意思全变，只能一条条记",
    test: (en) => /^\w+\s+(up|off|on|in|out|into|to|for|after|down|over|through|across|back|away|with)\b/i.test(en) },
  { key: "pat", name: "固定句型 / 结构", tip: "整句照搬，一个词都不能改",
    test: (en) => /\.{3}|…|\bas\s+\w+\s+as\b|\bno\s+choice\b|\bcannot\b|\bconcerned\b|\bnot\s+so\s+much\b/i.test(en) },
  { key: "n", name: "名词 / 形容词固定说法", tip: "中文直译会错，只能背英语的说法",
    test: () => true },
];
function collocKind(row) {
  if (row.q.topic === "word-choice") return "wc";
  return (COLLOC_KINDS.find((k) => k.test(row.en)) || COLLOC_KINDS[3]).key;
}

function collocGroups(onlyReal) {
  const pool = BANK.filter((q) =>
    ["collocation", "word-choice"].indexOf(q.topic) >= 0 && (onlyReal ? q.real : (q.real || q.mock)));
  const rows = pool.map(collocRow);
  const gs = COLLOC_KINDS.map((k) => ({ key: k.key, name: k.name, tip: k.tip, rows: [] }));
  gs.push({ key: "wc", name: "近义词辨析（四个词一起记）", tip: "四个选项中文意思差不多，区别在接什么宾语、什么语境。整组一起背才有用", rows: [] });
  rows.forEach((r) => { const g = gs.find((x) => x.key === collocKind(r)); if (g) g.rows.push(r); });
  // 同一条搭配可能多套卷都考过，去重但把出处合并
  gs.forEach((g) => {
    const seen = {};
    g.rows = g.rows.filter((r) => {
      const k = r.en.toLowerCase().replace(/[^a-z ]/g, "").trim();
      if (seen[k]) { if (r.real) seen[k].real = true; return false; }
      seen[k] = r; return true;
    });
    g.rows.sort((a, b) => (b.real ? 1 : 0) - (a.real ? 1 : 0));
  });
  return gs.filter((g) => g.rows.length);
}

/* ============================================================== 速记表页面 */
let COLLOC_MASK = "";      // "" 全显示 / "zh" 遮中文 / "en" 遮英文
let COLLOC_REAL = false;   // 只看真题

ROUTES.colloc = function () {
  const gs = collocGroups(COLLOC_REAL);
  const n = gs.reduce((a, g) => a + g.rows.length, 0);
  const nReal = gs.reduce((a, g) => a + g.rows.filter((r) => r.real).length, 0);

  const body = gs.map((g) => `
    <div class="card">
      <div class="row"><h2>${esc(g.name)}</h2><span class="tag">${g.rows.length} 条</span>
        <div class="spacer"></div>
        <button class="btn btn-sm" data-drill="${g.key}">练这一批</button></div>
      <p class="sub mb">${esc(g.tip)}</p>
      <div class="cl-list">${g.rows.map((r, i) => `
        <div class="cl" data-g="${g.key}" data-i="${i}">
          <div class="cl-main">
            <span class="cl-en">${escOpt(r.en)}</span>
            <span class="cl-zh">${esc(r.zh || r.note || "")}</span>
          </div>
          ${r.traps.length ? `<div class="cl-traps">${r.traps.map((t) => `<span>✗ ${esc(t)}</span>`).join("")}</div>` : ""}
          <div class="cl-meta">${r.real ? '<span class="tag tag-orange">真题</span>' : ""}<span class="muted">${esc(r.from)}</span></div>
        </div>`).join("")}</div>
    </div>`).join("");

  render(`
  <div class="card">
    <div class="row"><h1>搭配速记表</h1><span class="tag tag-orange">${n} 条</span>
      <div class="spacer"></div><span class="sub">距考试 ${daysToExam()} 天</span></div>
    <p class="sub">把 7 套整卷 + 历年真题里考过的<b>固定搭配</b>和<b>近义词辨析</b>全抽出来了，共 ${n} 条（其中真题 ${nReal} 条）。
      <b>固定搭配 6 个年份全考过、近义词辨析 4 个年份考过</b>，两者合起来常年占 15 道语法题里的 6-8 道。</p>
    <div class="note-box">这类题<b>背规则没用</b>，只能一条条记。每条下面的 <b>✗ 那几行是真考卷上的干扰项</b>——
      认不出干扰项照样会选错，所以正确的和错的要一起背。</div>
    <div class="qbar">
      <button class="btn ${COLLOC_MASK === "zh" ? "btn-orange" : ""}" id="cl-zh">${COLLOC_MASK === "zh" ? "✓ 正在遮中文" : "遮住中文（看英语说意思）"}</button>
      <button class="btn ${COLLOC_MASK === "en" ? "btn-orange" : ""}" id="cl-en">${COLLOC_MASK === "en" ? "✓ 正在遮英文" : "遮住英文（看中文说搭配）"}</button>
      <button class="btn ${COLLOC_REAL ? "btn-orange" : ""}" id="cl-real">${COLLOC_REAL ? "✓ 只看真题" : "只看真题"}</button>
      <div class="spacer"></div>
      <button class="btn btn-primary" id="cl-all">整批练一遍（${n} 题）</button>
    </div>
    ${COLLOC_MASK ? `<p class="sub mt">已遮住${COLLOC_MASK === "zh" ? "中文" : "英文"} —— <b>点任意一条揭开</b>，自己先想一遍再点。</p>` : ""}
  </div>
  <div class="${COLLOC_MASK ? "mask-" + COLLOC_MASK : ""}" id="cl-body">${body}</div>`);

  $("#cl-zh").onclick = () => { COLLOC_MASK = COLLOC_MASK === "zh" ? "" : "zh"; ROUTES.colloc(); };
  $("#cl-en").onclick = () => { COLLOC_MASK = COLLOC_MASK === "en" ? "" : "en"; ROUTES.colloc(); };
  $("#cl-real").onclick = () => { COLLOC_REAL = !COLLOC_REAL; ROUTES.colloc(); };
  $$(".cl").forEach((el) => (el.onclick = () => el.classList.toggle("open")));
  $$("[data-drill]").forEach((b) => (b.onclick = (e) => {
    e.stopPropagation();
    const g = gs.find((x) => x.key === b.dataset.drill);
    startQuiz(orderForPractice(g.rows.map((r) => r.q)), { title: "搭配 · " + g.name, backTo: "colloc" });
  }));
  $("#cl-all").onclick = () => {
    const all = []; gs.forEach((g) => all.push(...g.rows.map((r) => r.q)));
    startQuiz(orderForPractice(all), { title: "搭配速记 · 整批", backTo: "colloc" });
  };
};

/* 每日清单里的「背搭配」：5 分钟，滚动取，背完直接练同一批 */
function collocTask() {
  const gs = collocGroups(false);
  const all = []; gs.forEach((g) => all.push(...g.rows));
  if (!all.length) return null;
  const n = 8;
  const start = (new Date().getDate() * n) % all.length;   // 每天往后滚一批
  const batch = [];
  for (let i = 0; i < n && i < all.length; i++) batch.push(all[(start + i) % all.length]);
  return {
    id: "sp-colloc", icon: "🧷", tag: "搭配", pinned: true, same: "colloc",
    title: `背 ${n} 条搭配 + 立刻练一遍`,
    why: "固定搭配和近义词辨析常年占 15 道语法题里的 6-8 道，是语法里唯一能靠纯背拿分的。今天这批：" +
      batch.slice(0, 3).map((r) => r.en).join("、") + "…",
    min: 5,
    run: () => startQuiz(batch.map((r) => r.q), { title: "今日搭配 8 条", backTo: "today",
      onFinish: () => markTask("sp-colloc", true) }),
  };
}

/* 导航：挂在「练板块」里，紧跟语法 */
(function () {
  if (NAV.some((x) => x.route === "colloc")) return;   // 精简版 NAV 已自带，别重复加
  const g = NAV.find((x) => x.kind === "group" && x.label === "练板块");
  if (!g) return;
  const i = g.items.findIndex((x) => x.route === "grammar");
  g.items.splice(i < 0 ? g.items.length : i + 1, 0,
    { route: "colloc", label: "搭配速记表", desc: "固定搭配 + 近义词辨析，语法里唯一能纯背拿分的" });
})();
