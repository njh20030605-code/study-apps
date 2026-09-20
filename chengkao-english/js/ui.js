/* ============================================================================
 * ui.js —— 界面与交互
 * ----------------------------------------------------------------------------
 * 页面清单：首页(分数总表) / 语法7考点 / 阅读 / 补全对话 / 完形 / 写作 /
 *          地基阶梯 / 长句拆解 / 模考 / 错题本 / 设置
 * 三条硬规矩（来自 strategy.ui_rules，别改回去）：
 *   1. 错题不选归因不许进下一题
 *   2. 模考按固定顺序，板块之间不许跳
 *   3. 只显示「当前分/目标分」，不做总覆盖率进度条、不做打卡徽章
 * ========================================================================== */

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const C = S.config;

function toast(msg, ms) {
  const old = $(".toast"); if (old) old.remove();
  const d = document.createElement("div");
  d.className = "toast"; d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), ms || 2200);
}

/* ============================================================== 导航（分组） */
/* 平铺 11 个按钮找不到东西，按「干什么用」分三组：
 *   练板块 = 卷面上的 5 个板块，菜单里直接带当前分/目标分，点之前就知道该补哪块
 *   打基础 = 不直接对应某个板块、但所有板块都要用的底层能力
 *   复盘   = 做完之后回看的东西
 * 「今天」和「记分牌」是每天必进的两个入口，单独拎出来放最左边。
 */
/* 2026-09-13 只练写作模式的导航：其余页面收进「更多」。settings.writingOnly 为真时用它（见 curNav） */
const NAV_WRITE = [
  { kind: "item", route: "today", label: "今天", primary: true },
  { kind: "item", route: "writing", label: "写作" },
  { kind: "group", label: "更多", hint: "只练作文期间收起来的页面，要用还在",
    items: [
      { route: "real",   label: "真题",       desc: "按题型分组的真题 / 模拟卷" },
      { route: "colloc", label: "搭配速记表", desc: "固定搭配 + 近义词辨析" },
      { route: "mock",   label: "全真模考",   desc: "150 分钟整卷" },
      { route: "wrong",  label: "错题本",     desc: "按遗忘曲线回炉" },
    ] },
  { kind: "item", route: "settings", label: "⚙" },
];
function curNav() { return (typeof STATE !== "undefined" && STATE.settings && STATE.settings.writingOnly) ? NAV_WRITE : NAV; }
const NAV = [
  { kind: "item", route: "today", label: "今天", primary: true },
  { kind: "item", route: "real",  label: "真题" },
  { kind: "item", route: "colloc", label: "搭配" },
  { kind: "item", route: "writing", label: "写作" },
  { kind: "item", route: "mock",  label: "模考" },
  { kind: "item", route: "wrong", label: "错题" },
  { kind: "item", route: "settings", label: "⚙" },
];
/* ⚠️ 2026-09-12 用户要求「UI 做简洁一点，不要这么多选项」。
   最后一个月只保留这 6 个入口。被摘掉的页面（学习路线 / 每日一读 / 地基阶梯 / 句子拆解 /
   语法汇总 / 记分牌 / 各板块教学页）**路由都还在，没删**，直接敲 #course、#home 还能进，
   只是不再摆在导航上抢注意力。考完想恢复，把下面这份完整导航换回来即可： */
const NAV_FULL = [
  { kind: "item", route: "today", label: "今天", primary: true },
  { kind: "item", route: "home", label: "记分牌" },
  { kind: "sep" },
  { kind: "group", label: "练板块", hint: "按卷面板块练，括号里是当前分 / 目标分",
    items: [
      { route: "dialogue", sec: "dialogue", desc: "4 条判定规则 + 6 大场景固定句" },
      { route: "writing",  sec: "writing",  desc: "三套模板 + 计时写一篇 + AI 批改" },
      { route: "colloc", label: "搭配速记表", desc: "固定搭配 + 近义词辨析，语法里唯一能纯背拿分的" },
      { route: "grammar",  sec: "grammar",  desc: "只学 7 大考点，其余判超纲" },
      { route: "reading",  sec: "reading",  desc: "做题步骤 + 题型优先级 + 5 种套路" },
      { route: "cloze",    sec: "cloze",    desc: "不专项练，只背两张表" },
    ] },
  { kind: "group", label: "打基础", hint: "先走路线，路线走完再自由练",
    items: [
      { route: "course",    label: "学习路线", desc: "一条线走到底：基础 → 7考点 → 对话 → 写作，不跳级" },
      { route: "dailyread", label: "每日一读", desc: "真题阅读读不下去时来这：小短文逐句带中文" },
      { route: "basics",    label: "地基阶梯", desc: "四级难度总览（看进度用）" },
      { route: "sentence",  label: "句子拆解", desc: "备用工具：某个长句读不懂时来拆一下" },
    ] },
  { kind: "group", label: "复盘", hint: "做完之后回看",
    items: [
      { route: "wrong", label: "错题本",   desc: "按错因分类，看该补哪一类" },
      { route: "mock",  label: "全真模考", desc: "150 分钟计时，固定答题顺序" },
    ] },
  { kind: "item", route: "settings", label: "⚙" },
];

let NAV_OPEN = null;

function renderNav() {
  const left = (() => { try { return dailyLeft(); } catch (e) { return 0; } })();
  $("#nav").innerHTML = curNav().map((n, gi) => {
    if (n.kind === "sep") return `<span class="nav-sep"></span>`;
    if (n.kind === "item") {
      const badge = n.route === "today" && left ? `<span class="dot">${left}</span>` : "";
      return `<button class="nav-item ${n.primary ? "primary" : ""} ${CURRENT === n.route ? "active" : ""}"
        data-route="${n.route}" title="${esc(n.label)}">${esc(n.label)}${badge}</button>`;
    }
    const inGroup = n.items.some((i) => i.route === CURRENT);
    return `<span class="nav-group" data-gi="${gi}">
      <button class="nav-item ${inGroup ? "active" : ""}" data-open="${gi}">${esc(n.label)}</button></span>`;
  }).join("");

  $$("#nav [data-route]").forEach((b) => (b.onclick = () => { closeNavPop(); go(b.dataset.route); }));
  $$("#nav [data-open]").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); toggleNavPop(+b.dataset.open); }));
}

function closeNavPop() {
  const p = $(".nav-pop"); if (p) p.remove();
  NAV_OPEN = null;
  document.removeEventListener("mousedown", navOutside);
}
function navOutside(e) { if (!e.target.closest || !e.target.closest(".nav-group")) closeNavPop(); }

function toggleNavPop(gi) {
  if (NAV_OPEN === gi) return closeNavPop();
  closeNavPop();
  const n = curNav()[gi];
  const host = $(`.nav-group[data-gi="${gi}"]`);
  const pop = document.createElement("div");
  pop.className = "nav-pop";
  pop.innerHTML = `<div class="nav-pop-h">${esc(n.hint)}</div>` + n.items.map((it) => {
    let right = "", bar = "";
    if (it.sec) {
      const s = SEC[it.sec], sc = secScore(it.sec);
      right = `<span class="np-score"><b>${sc.none ? "—" : sc.score}</b> / ${s.target}</span>`;
      const pct = sc.none ? 0 : Math.min(100, Math.round((sc.score / s.target) * 100));
      bar = `<div class="np-bar"><i class="${!sc.none && sc.score >= s.target ? "ok" : ""}" style="width:${pct}%"></i></div>`;
    }
    const name = it.label || SEC[it.sec].name;
    const invest = it.sec && SEC[it.sec].invest;
    return `<button data-route="${it.route}" class="${CURRENT === it.route ? "active" : ""}">
      <span class="np-name">${esc(name)}${invest ? ' <span class="tag tag-orange">必投入</span>' : ""}
        <small>${esc(it.desc)}</small>${bar}</span>${right}</button>`;
  }).join("");
  host.appendChild(pop);
  NAV_OPEN = gi;
  $$("[data-route]", pop).forEach((b) => (b.onclick = () => { closeNavPop(); go(b.dataset.route); }));
  setTimeout(() => document.addEventListener("mousedown", navOutside), 0);
}

/* ============================================================== 路由 */
let CURRENT = "today";
function go(name, arg) {
  // 离开页面前先收拾计时器，否则写作的 35 分钟计时会在别的页面上弹提示
  if (name !== "writing") { clearInterval(WTIMER); WTIMER = null; }
  // 模考没交卷就切走 = 作废（考场上不许中途干别的，这里保持一致）
  if (MOCK && MOCK.running && name !== "mock") {
    if (!confirm("模考还没交卷。离开就作废这一次，确定吗？")) return;
    clearInterval(MOCK.timer); MOCK.running = false; MOCK = null;
  }
  if (!ROUTES[name]) name = "today";      // 删掉过的路由（比如老的 vocab）别把导航高亮卡住
  CURRENT = name;
  closeNavPop();
  const fn = ROUTES[name];
  $("#content").innerHTML = "";
  fn(arg);
  renderNav();            // 放在渲染页面之后：菜单里的分数和「今天」的待办数要用最新数据
  window.scrollTo(0, 0);
}

/* ============================================================== 通用组件 */
function html(s) { const d = document.createElement("div"); d.innerHTML = s; return d; }
function render(s) { $("#content").innerHTML = s; }

/* 板块小标题 + 目标提示 */
function secHead(key, extra) {
  const s = SEC[key], sc = secScore(key);
  return `<div class="card">
    <div class="row"><h1>${esc(s.name)}</h1>
      <span class="tag ${s.invest ? "tag-orange" : ""}">${s.invest ? "必投入" : "不投入"}</span>
      <div class="spacer"></div>
      <div class="num"><b style="font-size:20px">${sc.none ? "—" : sc.score}</b>
        <span class="muted">/ ${s.target} 分目标（卷面 ${s.full}）</span></div>
    </div>
    <p class="sub">${esc(s.strategy)} · 考场建议用时 ${s.time_ref} 分钟</p>
    ${extra || ""}
  </div>`;
}

/* ============================================================== 首页 */
const ROUTES = {};

ROUTES.home = function () {
  const st = currentStage();
  const d = daysToExam();
  const total = totalScore();
  const pend = pendingErrorClass().length;

  // 板块表
  let rows = "", tFull = 0, tTarget = 0;
  SECTIONS.forEach((s) => {
    const sc = secScore(s.key);
    tFull += s.full; tTarget += s.target;
    const pct = Math.min(100, Math.round((sc.score / s.target) * 100));
    const cls = sc.none ? "none" : sc.score >= s.target ? "ok" : "";
    rows += `<tr class="${s.invest ? "invest" : ""}">
      <td><b>${esc(s.name)}</b><br><span class="muted" style="font-size:12px">${esc(s.strategy)}</span></td>
      <td class="num">${s.count}题 × ${s.per}分<br><span class="muted">${s.full} 分</span></td>
      <td class="num"><b style="font-size:16px">${sc.none ? "—" : sc.score}</b> / ${s.target}</td>
      <td style="width:110px"><div class="scorebar"><i class="${cls}" style="width:${sc.none ? 0 : pct}%"></i></div>
        <span class="muted" style="font-size:11.5px">${sc.rate === null ? "还没数据" : sc.guessed ? "蒙同一字母的期望值" : "近期正确率 " + Math.round(sc.rate * 100) + "%"}</span></td>
    </tr>`;
  });

  // 分值地图
  let vm = "";
  SECTIONS.forEach((s) => {
    vm += `<div class="${s.invest ? "vm-invest" : "vm-skip"}" style="width:${(s.full / 150) * 100}%" title="${esc(s.name)} ${s.full}分">${s.full >= 15 ? esc(s.name) : ""}</div>`;
  });

  let stages = "";
  C.stages.forEach((x) => {
    stages += `<div class="stage-item ${x.stage === st.stage ? "now" : ""}"><b>${x.stage}</b>
      <div><div>${esc(x.focus)}</div><div class="muted" style="font-size:12px">${esc(x.note)}${x.timed ? " · 计时" : ""}</div></div></div>`;
  });

  render(`
  <div class="head-hero">
    <h1>成考专升本英语 · 应试策略台</h1>
    <div class="sub" style="color:rgba(255,255,255,.85)">${esc(S.meta.exam)}　满分 ${S.meta.total_score}　考试 ${esc(STATE.settings.examDate)}</div>
    <div class="hero-nums">
      <div class="hero-num"><b>${d > 0 ? "D-" + d : d === 0 ? "今天" : "已过"}</b><span>距考试</span></div>
      <div class="hero-num"><b>${total}</b><span>当前预估总分</span></div>
      <div class="hero-num"><b>${S.meta.target_score}</b><span>目标分（过线）</span></div>
      <div class="hero-num"><b>${S.meta.safe_target_score}</b><span>保险分</span></div>
      <div class="hero-num"><b>${esc(st.stage)}</b><span>当前阶段（第 ${planWeek()} 周）</span></div>
    </div>
    <div class="hero-note">本阶段该干的事：${esc(st.focus)}　|　${esc(st.note)}</div>
    <div class="row mt"><button class="btn btn-orange" id="go-today">▶ 今天的练习${dailyLeft() ? "（还剩 " + dailyLeft() + " 件）" : "（都做完了）"}</button></div>
  </div>

  ${(() => {
    // 2026-09-12 用户拍板：错题不做归因，直接复习。首页这条也从「催归因」改成「去复习」。
    const nb = Object.keys(STATE.wrong || {}).filter((i) => !STATE.wrong[i].grad && BY_ID[i]).length;
    const nd = dueWrongIds().length;
    if (!nb) return "";
    return `<div class="warnbox">📕 错题本里还有 <b>${nb}</b> 道没练熟${nd ? `，其中 <b>${nd}</b> 道今天按遗忘曲线到期` : ""}。
      <button class="btn btn-sm btn-orange" id="go-attrib">现在去复习</button></div>`;
  })()}

  <div class="card" id="coach-card">
    <div class="row"><h2>🎓 AI 教练</h2><div class="spacer"></div>
      <button class="btn btn-sm" id="coach-gen">${STATE.coach && STATE.coach.d === todayStr() ? "重新点评" : "生成今日点评"}</button></div>
    <div id="coach-comment">${STATE.coach && STATE.coach.d === todayStr() ? `<div class="ai-out">${esc(STATE.coach.text)}</div>` : `<p class="sub">它能看到你的全部学习数据（各板块分数、阶梯进度、错题分布、模考成绩），点上面按钮生成一段今日点评。</p>`}</div>
    <div id="coach-log" class="mt"></div>
    <div class="row mt">
      <input type="text" id="coach-in" placeholder="随便问：为什么我完形总错？今天该干嘛？since 什么时候用完成时？" style="flex:1">
      <button class="btn btn-primary" id="coach-send">问教练</button>
    </div>
    ${hasApiKey() ? "" : `<p class="sub mt muted">要先在【设置】填 API Key 才能用教练。</p>`}
  </div>

  ${(() => {
    const st2 = studyStats();
    const n = STATE.log.length, ok = STATE.log.filter((r) => r.ok).length;
    const cd = window.COURSE ? window.COURSE.filter(unitPassed).length : 0;
    const nu = window.COURSE ? nextCourseUnit() : null;
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = fmtDate(d);
      last7.push((i === 0 ? "今天" : key.slice(5).replace("-", "/")) + " " + Math.round((st2.perDay[key] || 0) / 60) + "′");
    }
    return `<div class="card"><h2>工作台</h2>
      <div class="wb-grid">
        <div class="wb"><b>${fmtMin(st2.today)}</b><span>今日学习（做题时段估算）</span></div>
        <div class="wb"><b>${fmtMin(st2.totalSec)}</b><span>累计学习</span></div>
        <div class="wb"><b>${n}</b><span>累计做题${n ? " · 对 " + Math.round((ok / n) * 100) + "%" : ""}</span></div>
        <div class="wb"><b>${cd} / ${window.COURSE ? window.COURSE.length : 0}</b><span>学习路线${nu ? " · " + esc(window.COURSE_CH[nu.ch]) : " · 已走完"}</span></div>
      </div>
      <p class="sub mt">近 7 天：${last7.join(" · ")}</p></div>`;
  })()}

  <div class="card">
    <h2>板块记分牌</h2>
    <p class="sub mb">当前分＝该板块最近作答正确率 × 卷面分。橙色左边线＝策略要求必须投入的板块。</p>
    <table class="sec-table">
      <thead><tr><th>板块 / 策略</th><th class="num">卷面</th><th class="num">当前 / 目标</th><th>达成度</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td>合计</td><td class="num">${tFull} 分</td><td class="num">${total} / ${tTarget}</td>
        <td class="muted" style="font-size:12px">目标 ${S.meta.target_score} 分即可过线</td></tr></tfoot>
    </table>
  </div>

  <div class="card">
    <h2>分值地图</h2>
    <div class="valuemap">${vm}</div>
    <div class="vm-legend">■ 橙＝必投入（语法15 + 阅读60 + 补全对话15 + 写作25 ＝ <b>115 分</b>）　■ 灰＝不投入（完形30 + 语音5，靠溢出和蒙）</div>
  </div>

  <div class="card">
    <h2>四阶段计划</h2>
    <div class="stage-list">${stages}</div>
    <p class="sub mt">每周英语预算 ≈ ${Math.round(C.weekly_budget_hours * C.subject_time_split.english * 10) / 10} 小时（总 ${C.weekly_budget_hours} 小时 × 英语占比 ${Math.round(C.subject_time_split.english * 100)}%）</p>
  </div>

  <div class="card">
    <h2>练板块<span class="tag tag-orange" style="margin-left:8px">卷面上的 5 个板块</span></h2>
    <div class="quick-grid mb">
      <button class="quick" data-go="dialogue">💬 补全对话<small>15 分 · 套路化，最快见效</small></button>
      <button class="quick" data-go="writing">✍️ 短文写作<small>25 分 · 三套模板背满</small></button>
      <button class="quick" data-go="grammar">🔧 语法与词汇<small>15 分 · 只学 7 个考点</small></button>
      <button class="quick" data-go="reading">📖 阅读理解<small>60 分 · 最大投入</small></button>
      <button class="quick" data-go="cloze">🧩 完形填空<small>30 分 · 只背两张表</small></button>
    </div>
    <h2>打基础<span class="tag" style="margin-left:8px">跨板块的底层能力</span></h2>
    <div class="quick-grid mb">
      <button class="quick" data-go="course">🛤️ 学习路线<small>一条线走到底，不跳级</small></button>
      <button class="quick" data-go="dailyread">📗 每日一读<small>真题读不动时先读这个</small></button>
      <button class="quick" data-go="basics">🧱 地基阶梯<small>四级难度总览</small></button>
    </div>
    <h2>复盘<span class="tag" style="margin-left:8px">做完之后回看</span></h2>
    <div class="quick-grid">
      <button class="quick" data-go="wrong">🏷️ 错题本<small>按错因分类</small></button>
      <button class="quick" data-go="mock">⏱️ 全真模考<small>150 分钟计时</small></button>
    </div>
  </div>

  <div class="card">
    <h2>考场答题顺序（固定，别临场改）</h2>
    <p class="sub">${C.answer_order.map((k, i) => `<b>${i + 1}. ${esc(SEC[k].name)}</b>（${SEC[k].time_ref}分钟）`).join(" → ")}</p>
    <p class="sub mt">先拿套路分再啃技能分。语音统一涂 <b>${C.phonetics_default_answer}</b>，不看题、不花时间。</p>
  </div>`);

  $$("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
  $("#go-today").onclick = () => go("today");
  if ($("#go-attrib")) $("#go-attrib").onclick = () => {
    const d = dueWrongIds();
    const src = d.length ? d : Object.keys(STATE.wrong || {}).filter((i) => !STATE.wrong[i].grad && BY_ID[i]);
    if (!src.length) return go("wrong");
    startQuiz(shuffle(src.map((i) => BY_ID[i])).filter(Boolean).slice(0, 12), { title: "错题复习", backTo: "home" });
  };
  bindCoach();
};

/* ============================================================== AI 教练 */
/* 两个能力：①每日点评（一天缓存一次，写进存档）②自由对话。
   每次对话的 system 里都塞进 progressBrief() —— 教练看得到你全部真实数据，
   所以「今天该干嘛」「我哪块最弱」这类问题它答得有根据，不是泛泛安慰。 */
let COACH_CHAT = [];   // 本次打开的对话，不写存档

function coachSystem() {
  return `你是这位考生的成人高考专升本英语备考教练。考生英语基础约 A2（新概念1 学到七八十课），目标 ${S.meta.target_score} 分过线（满分150）。
这是他此刻的真实学习数据（回答必须以此为据，数据之外的事实不要编）：
${progressBrief()}

规则：
- 简单中文，先给结论再给理由；默认 ≤150 字，他明确要求详细才展开
- 涉及分数/进度要引用上面的具体数字
- 他问英语知识就直接教，用 A2 能听懂的讲法举例
- 建议要落到「下一步做哪一件事」，别一次给一堆
- 语气像靠谱的私教：直接、不端着、不灌鸡汤`;
}

function coachBubble(who, text) {
  const log = $("#coach-log");
  if (!log) return null;
  const d = document.createElement("div");
  d.className = "ai-out";
  d.style.marginTop = "8px";
  d.innerHTML = `<b>${who}</b><br>${esc(text)}`;
  log.appendChild(d);
  return d;
}

function bindCoach() {
  const gen = $("#coach-gen"), send = $("#coach-send"), input = $("#coach-in");
  if (!gen) return;
  // 恢复本次会话的聊天记录（切页回来不丢）
  COACH_CHAT.forEach((m) => coachBubble(m.role === "user" ? "你" : "教练", m.content));

  gen.onclick = async () => {
    const box = $("#coach-comment");
    box.innerHTML = `<div class="ai-out">教练正在看你的数据…</div>`;
    const cEl = box.firstChild;
    try {
      const t = await callClaude({
        system: coachSystem(),
        messages: [{ role: "user", content: "给我今天的点评：现在什么水平、最大的短板是哪块（说数字）、今天最该做的一件事。120字以内。" }],
        maxTokens: 500,
        onDelta: (part) => { if (cEl && cEl.parentNode) cEl.textContent = part; },
      });
      STATE.coach = { d: todayStr(), text: t };
      saveState();
      box.innerHTML = `<div class="ai-out">${esc(t)}</div>`;
      gen.textContent = "重新点评";
    } catch (e) { box.innerHTML = `<div class="ai-out">❌ ${esc(e.message)}</div>`; }
  };

  const ask = async () => {
    const v = input.value.trim();
    if (!v) return;
    input.value = "";
    COACH_CHAT.push({ role: "user", content: v });
    coachBubble("你", v);
    const holder = coachBubble("教练", "…");
    const hs = holder ? (holder.innerHTML = `<b>教练</b><br><span data-stream>…</span>`, holder.querySelector("[data-stream]")) : null;
    try {
      // 只带最近 12 条，别把上下文越聊越贵
      const t = await callClaude({ system: coachSystem(), messages: COACH_CHAT.slice(-12), maxTokens: 900,
        onDelta: (part) => { if (hs) hs.textContent = part; } });
      COACH_CHAT.push({ role: "assistant", content: t });
      if (holder) holder.innerHTML = `<b>教练</b><br>${esc(t)}`;
    } catch (e) {
      COACH_CHAT.pop();   // 失败回滚这条提问，避免下次带着孤儿消息
      if (holder) holder.innerHTML = `<b>教练</b><br>❌ ${esc(e.message)}`;
    }
  };
  send.onclick = ask;
  input.onkeydown = (e) => { if (e.key === "Enter") ask(); };
}

/* ============================================================== 每日练习 */
/* 任务不是写死的清单，是**倒推**出来的：
 *   1. 先算今天有多少分钟（工作日 18 / 周末 54，见 core.js dailyBudgetMin）
 *   2. 欠的债先还（没归因的错题）—— 封顶，别让债吃掉一整天
 *   3. 剩下的时间按当前阶段 focus 往里塞，塞不下就不塞
 * 只有 pinned 的任务可以突破预算（策略里写死"每天必须"的那种），并且会明确标出超了。
 * 不算完成度百分比、不记连续天数 —— 这是 strategy.ui_rules 明令禁止的。
 */

function openAcc(idx) {
  const all = $$("details.acc");
  if (!all[idx]) return;
  all[idx].open = true;
  all[idx].scrollIntoView({ behavior: "smooth", block: "center" });
}
function quizTask(id, list, title) {
  startQuiz(list, { title: title, backTo: "today", onFinish: () => markTask(id, true) });
}

/* 每天那 15 分钟的阅读训练槽位 —— 2026-08-16 用户拍板：不拆句子了，直接做题。
   阅读 60 + 完形 30 = 90 分（全卷 60%），之前一天都没排进过每日任务。
   规则跟学习路线一样：一篇一篇往下走，短的先做，做完一篇才出下一篇。
   工作日只排阅读（一篇 ~10 分钟），完形一篇 15 道题太重，放周末。 */
function passageTasks(weekend) {
  const out = [];
  const mk = (secKey, id, icon, label, why) => {
    const g = nextPassageGroup(secKey);
    if (!g) return;
    const pr = passageProgress(secKey);
    const w = passageWords(g);
    out.push({
      id: id, icon: icon, tag: secKey === "reading" ? "阅读" : "完形", pinned: true,
      title: `${label}：第 ${pr.done + 1} 篇（${w} 词 · ${g.qs.length} 题）`,
      why: why + `　题库共 ${pr.total} 篇，已做完 ${pr.done} 篇——从最短的开始，一篇一篇来。`,
      min: Math.max(8, Math.round(g.qs.length * 1.6 + w / 60)),
      run: () => quizTask(id, g.qs, label + " · 整篇"),
      auto: () => { const gg = nextPassageGroup(secKey); return !gg || gg.key !== g.key; },
    });
  };
  mk("reading", "daily-reading", "📖", "阅读理解",
     "阅读是全卷最大的一块（60 分）。做题步骤：先看题干圈关键词，再回原文定位，别通读全文。");
  if (weekend) mk("cloze", "daily-cloze", "🧩", "完形填空",
     "完形 30 分，一篇 15 空，需要一整块时间——所以放周末。先通读一遍抓大意，再一空一空填。");
  return out;
}

function buildDailyPlan() {
  const budget = dailyBudgetMin();
  const weekend = isWeekendDay();
  const stage = currentStage();
  const plan = [];
  let used = 0;
  const add = (t) => { plan.push(t); used += t.min; return true; };
  const tryAdd = (t) => (used + t.min <= budget ? add(t) : false);

  /* ---------- 一、错题（每天第一件事，但封顶，别让它吃掉一整天） ----------
     ⚠️ 2026-09-12 用户拍板：「错题不做归因，直接复习就行」。
     以前这里排的是「给 N 道错题归因」，他从来不做（188 道错题里 90 道没归因），
     归因也不产生任何下一步动作。**已删，别再加回来**。
     现在只剩一件事：把错题再做一遍。曲线到期的优先；今天没到期的，
     就从还没毕业的错题里抓几道——保证每天都有得复习，而不是「今天没到期」然后空着。 */
  const dwr = dueWrongIds();
  const backlog = Object.keys(STATE.wrong || {}).filter((id) => !STATE.wrong[id].grad && BY_ID[id]);
  const pool = dwr.length ? dwr : backlog;
  if (!STATE.settings.writingOnly && (pool.length || wasPlannedToday("debt-review"))) {   // 只练作文模式不排错题
    const n = Math.min(pool.length, weekend ? 12 : 6);
    add({
      id: "debt-review", icon: "🔁", tag: "错题",
      title: pool.length ? `错题复习 ${n} 题` : "错题都复习完了",
      why: !pool.length ? "错题本清空了"
        : dwr.length
          ? `按遗忘曲线今天轮到 ${dwr.length} 题。做对间隔拉长（1→3→7→21 天）直到毕业，再错打回明天——不会把错题堆在同一天`
          : `今天没有到期的，从还没练熟的 ${backlog.length} 道里抓 ${n} 道再做一遍。每题做完有解析，看不懂就点「读懂这道题」`,
      min: Math.max(2, Math.round(n * 0.8)),
      run: () => {
        const now = dueWrongIds();
        const src = now.length ? now : backlog;
        quizTask("debt-review", shuffle(src.map((id) => BY_ID[id])).filter(Boolean).slice(0, n), "错题复习");
      },
      auto: dwr.length ? (() => dueWrongIds().length === 0) : undefined,
    });
  }

  /* ---------- 一点五、冲刺模式（2026-09-10 用户定：备战最后状态） ----------
     开关在「真题」页。开了之后主线换成【真题按题型成组练】，一次一整类，
     不再排学习路线 / 阶梯 / 自编练习题。还债（归因、错题回炉）照旧先排。 */
  if (STATE.settings.sprint && typeof sprintTasks === "function") {
    // 2026-09-13：冲刺日程是写死的（sprint.js sprintTasks），不再按「180×35%」的预算裁——
    // 那个公式算出 63′ 而日程本身 70′，每天都弹「超预算 7 分钟」的警告，纯噪音。
    // 预算 = 日程本身；optional 的任务（休息日对话）不计件数、不计时间。
    sprintTasks(weekend).forEach((t) => add(t));
    const fixed = plan.filter((t) => !t.optional).reduce((a, t) => a + t.min, 0);
    notePlanned(plan.map((t) => t.id));
    plan.forEach((t) => { if (t.auto && t.auto()) markTask(t.id, true); });
    return { plan: plan, budget: fixed, used: fixed, weekend: weekend, stage: stage };
  }

  // 阶段与轮换素材（路线模式和自由模式都要用）
  const st = stage.stage;
  const tpl = rotate(S.writing.templates);
  const scene = rotate(S.dialogue.scenes, 3);
  const point = rotate(S.grammar.points, 5);
  const weak = weakestSection();

  /* ---------- 二、主线 ----------
     用户定的规矩：前期一个板块一个板块慢慢打，基础题先做，不跳着练。
     所以路线（course.js）没走完之前，主线就是「路线的下一节」，
     每天工作日 1 节、周末最多 3 节，顺序推进；不排任何轮换任务。
     路线全部过关后，才回到按阶段自由复习的模式（else 分支）。 */
  const cu = nextCourseUnit();
  if (cu) {
    /* ⚠️ 当天窗口必须冻结（2026-08-14 用户报的 bug）：
       原来每次渲染都从 nextCourseUnit() 重新开窗，练完一节整个列表往前滑——
       做完的那条消失（永远看不到勾），底下不停冒新任务，像是白练了。
       现在：今天排过的节记在 dailyRec().planned 里，全天钉在原位（做完打勾），
       只有窗口没满 maxUnits 时才把路线下一节补进来。 */
    /* 名额制（2026-08-14 二修）：今天的路线名额 = maxUnits，做过的节占名额。
       只冻结不封顶会翻车：planned 里积了多少节就全钉出来，一天排出 121 分钟。
       现在：已做的全保留展示（原地打勾），没做的最多补到「剩余名额」为止；
       名额用完就出「做完了」卡，想多学走「继续学」按钮，不再往清单里塞。 */
    const maxUnits = weekend ? 4 : 2;
    const plannedIds = dailyRec().planned
      .filter((x) => x.indexOf("course-") === 0)
      .map((x) => x.slice(7));
    const doneCount = plannedIds.filter((uid) => isTaskDone("course-" + uid)).length;
    const slots = Math.max(0, maxUnits - doneCount);   // 今天还剩几个「没做」名额
    const win = [];
    const pendingIn = () => win.filter((x) => !isTaskDone("course-" + x.id)).length;
    plannedIds.forEach((uid) => {
      const u = window.COURSE.find((c) => c.id === uid);
      if (!u || win.indexOf(u) >= 0) return;
      if (isTaskDone("course-" + u.id)) win.push(u);           // 做过的：保留展示
      else if (pendingIn() < slots) win.push(u);               // 没做的：限量
    });
    let idx = window.COURSE.indexOf(cu);
    while (pendingIn() < slots && idx < window.COURSE.length) {
      const u = window.COURSE[idx++];
      if (unitPassed(u) || win.indexOf(u) >= 0) continue;
      win.push(u);
    }
    win.forEach((u, k) => {
      const icon = { lesson: "📖", drill: "✏️", cue: "💬", template: "📝" }[u.kind] || "📖";
      const t = {
        id: "course-" + u.id, icon: icon, tag: "路线",
        title: `${window.COURSE_CH[u.ch]} · ${unitTitle(u)}`,
        why: u.kind === "lesson" ? "先读讲解再练：连续答对 4 题才算过——讲什么练什么，练到真会"
          : u.kind === "cue" ? "每道题上方直接印着解题思路，照思路选就行"
          : u.kind === "template" ? "读懂骨架、自己填一篇，回「学习路线」页点标记完成"
          : "做题类过关线 70%：没过明天这节还在原地，练到过为止",
        min: u.kind === "lesson" ? (weekend ? 10 : 8) : 8,
        // 不跳级：前面还有没过关的节时，点后面的任务会被拉回到该过的那节
        run: ((uu) => () => {
          const nu = nextCourseUnit();
          if (nu && uu !== nu && !unitPassed(uu)) {
            toast("路线一节一节过：先把「" + unitTitle(nu) + "」过了", 3000);
            return runUnit(nu);
          }
          runUnit(uu);
        })(u),
      };
      // 已排进今天的节无条件保留（预算在首次排入时已占过）；新补位的才看预算
      if (plannedIds.indexOf(u.id) >= 0 || k === 0) add(t); else if (!tryAdd(t)) return;
    });
    // 策略的硬规定不受路线影响：W3-6 起每天 15 分钟阅读训练；W7-9 周日模考
    if (st === "W3-6" || st === "W7-9") passageTasks(weekend).forEach(add);
    if (st === "W7-9" && new Date().getDay() === 0) {
      add({ id: "w79-mock", icon: "⏱️", tag: "模考日", pinned: true,
        title: "全真模考 150 分钟", why: "策略规定每周日一次计时模考",
        min: 150, run: () => go("mock"), manual: true });
    }
  } else {
  if (st === "W1-2") {
    // 这两周主攻套路分：补全对话 + 写作模板。真题证据：补全对话是整段对话挖空，
    // 胜负手是 4 条 cue_rule（看空格后面那句定句型），不是背场景句。
    tryAdd({
      id: "w12-cue", icon: "🧭", tag: "对话", same: "cue",
      title: `补全对话 · 判定规则练 ${weekend ? 8 : 5} 题`,
      why: "先看空格后面那句 → 定句型 → 再挑选项。策略说这一步能直接把正确率拉到 80%",
      min: weekend ? 9 : 6,
      run: () => cueDrill(weekend ? 8 : 5),
    });
    if (weekend) tryAdd({
      id: "w12-write", icon: "📝", tag: "写作",
      title: "套模板计时写一篇（35 分钟）",
      why: S.writing.practice_rule,
      min: 35, run: () => go("writing", "write"), manual: true,
    });
    tryAdd({
      id: "w12-tpl-" + tpl.id, icon: "✍️", tag: "写作", same: "tpl",
      title: `把「${tpl.name}」填成一篇完整的`,
      why: "25 分的写作全靠这三套骨架，先做到看着空能填出话来。点「生成一篇完整范文」看它怎么被填满，再自己换一套词填一遍",
      min: 6, run: () => { go("writing", "template"); setTimeout(() => { const el = $("#tplcard-" + tpl.id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); }, manual: true,
    });
  }

  if (st === "W3-6") {
    // 策略原话：每天保留 15 分钟阅读训练 —— 就是真的做一篇阅读（周末加一篇完形）
    passageTasks(weekend).forEach(add);
    const reals = BANK.filter((q) => q.real);
    tryAdd({
      id: "w36-real", icon: "🔖", tag: "真题",
      title: "真题精做 10 题（不计时）",
      why: "这个阶段做真题是为了搞懂，不是为了掐表。出题从易到难排",
      min: 10,
      run: () => quizTask("w36-real", orderForPractice(byDifficulty(reals)).slice(0, 10), "真题精做"),
    });
    tryAdd({
      id: "w36-colloc", icon: "🧷", tag: "搭配", same: "colloc",
      title: `固定搭配 / 词义辨析 ${weekend ? 12 : 8} 题`,
      why: "真题证据：88 道真题里这类占语法分的 29%，比 7 大考点里任何一个都多",
      min: weekend ? 7 : 5,
      run: () => quizTask("w36-colloc", orderForPractice(BY_SEC.grammar.filter((q) => q.topic === "collocation" || q.topic === "word-choice")).slice(0, weekend ? 12 : 8), "搭配 / 辨析"),
    });
    tryAdd({
      id: "w36-point-" + point.id, icon: "🔧", tag: "语法", same: "point-" + point.id,
      title: `攻考点 ${point.id}「${point.name}」10 题`,
      why: point.rule,
      min: 8,
      run: () => quizTask("w36-point-" + point.id, orderForPractice(byDifficulty(questionsOfPoint(point.id))).slice(0, 10), "考点" + point.id + " " + point.name),
    });
  }

  if (st === "W7-9") {
    const sunday = new Date().getDay() === 0;
    if (sunday) add({
      id: "w79-mock", icon: "⏱️", tag: "模考日", pinned: true,
      title: "全真模考 150 分钟",
      why: "策略规定每周日一次计时模考 —— 注意它需要一整块时间，会占掉这个周末的大部分学习时间",
      min: 150, run: () => go("mock"), manual: true,
    });
    passageTasks(weekend).forEach(add);
    if (weak) tryAdd({
      id: "w79-weak-" + weak.key, icon: "🩹", tag: "补短板", same: "weak",
      title: `补最弱的板块：${weak.name}`,
      why: `记分牌上它离目标差得最多（当前 ${secScore(weak.key).score} / 目标 ${weak.target}）`,
      min: 12, run: () => go(weak.key === "grammar" ? "grammar" : weak.key),
      manual: true,
    });
  }

  if (st === "W10") {
    // 最后两周：把已经会的固化住，不学新东西
    tryAdd({
      id: "w10-write", icon: "📝", tag: "写作", same: "tpl",
      title: weekend ? "套模板计时写一篇（35 分钟）" : "把模板的三段开头默出来（不用写全篇）",
      why: "考前最后能稳拿的就是这 25 分，写到闭着眼能套出三段",
      min: weekend ? 35 : 12, run: () => go("writing", weekend ? "write" : "template"), manual: true,
    });
    [point, rotate(S.grammar.points, 6), rotate(S.grammar.points, 7)].slice(0, weekend ? 3 : 1)
      .forEach((p) => tryAdd({
        id: "w10-point-" + p.id, icon: "🔧", tag: "重看", same: "point-" + p.id,
        title: `重看考点 ${p.id}「${p.name}」`,
        why: "只看判定步骤和坑，不做题",
        min: 5, run: () => { go("grammar"); openAcc(p.id - 1); }, manual: true,
      }));
    if (weak) tryAdd({
      id: "w10-weak-" + weak.key, icon: "🩹", tag: "补短板", same: "weak",
      title: `补最弱的板块：${weak.name}`,
      why: `记分牌上它离目标差得最多（当前 ${secScore(weak.key).score} / 目标 ${weak.target}）`,
      min: 12, run: () => go(weak.key), manual: true,
    });
  }

  /* ---------- 三、阶梯练习（微课没学完时让位给「今日一课」，塞得下才排） ----------
     每天第一件正经事：先做几道「上一级」的题稳稳拿对找手感，紧接着练「当前级」推进度。
     一组题里先甜后咸——正反馈和提升装在同一件任务里，不用分成两件占预算。
     当前级和过级标准都来自 core.js 的四级阶梯（地基→搭桥→过渡→真题级）。 */
  {
    const cur = currentLevel();
    const prev = Math.max(1, cur - 1);
    const nEasy = weekend ? 4 : 3, nCur = weekend ? 10 : 6;
    const st1 = levelStat(cur);
    (nextLesson() ? tryAdd : add)({
      id: "ladder", icon: "🪜", tag: "阶梯",
      title: `阶梯练习：${LEVELS[cur - 1].name}级 ${nCur} 题${cur > 1 ? `（前面垫 ${nEasy} 道${LEVELS[prev - 1].name}级稳拿的）` : ""}`,
      why: cur > 1
        ? `先拿对几道${LEVELS[prev - 1].name}级找手感，再推第 ${cur} 级。这级已练 ${st1.tried}/15 次、正确率 ${st1.acc === null ? "—" : Math.round(st1.acc * 100) + "%"}，做够 15 次且 ≥80% 自动过级`
        : `从你现在的水平起步（${LEVELS[0].desc}），做够 15 次且正确率 ≥80% 就升下一级`,
      min: weekend ? 9 : 6,
      run: () => {
        let list;
        if (cur === 1) {
          list = orderForPractice(levelPool(1)).slice(0, nEasy + nCur);
        } else {
          // 垫题从上一级随机抽（都是过了级的，闭着眼也对），正餐按「没做过优先」出
          list = pick(levelPool(prev), nEasy).concat(orderForPractice(levelPool(cur)).slice(0, nCur));
        }
        quizTask("ladder", list, "阶梯练习 · " + LEVELS[cur - 1].name + "级");
      },
    });
  }

  /* ---------- 四、填空档 ----------
     阶段任务排完之后预算常常还剩一截（W3-6 工作日扣掉 15 分钟长句只剩 3 分钟，
     W10 的任务本身也短）。剩的时间不该空着，从这几件小事里挑塞得下的补上。
     用 same 标记内容，避免和上面已排的任务重复。 */
  const FILLERS = [
    { id: "fill-dquiz", icon: "🎯", tag: "加练", same: "dquiz", min: 6,
      title: "补全对话练 5 题", why: "套路分，最容易先拿到手",
      run: () => quizTask("fill-dquiz", orderForPractice(BY_SEC.dialogue).slice(0, 5), "补全对话") },
    { id: "fill-colloc", icon: "🧷", tag: "加练", same: "colloc", min: 5,
      title: "固定搭配 / 词义辨析 8 题", why: "真题里这类占语法分的 29%，策略的 7 大考点没覆盖到",
      run: () => quizTask("fill-colloc", orderForPractice(byDifficulty(BY_SEC.grammar.filter((q) => q.topic === "collocation" || q.topic === "word-choice"))).slice(0, 8), "搭配 / 辨析") },
    { id: "fill-gmix", icon: "🔧", tag: "加练", same: "gmix", min: 4,
      title: "语法混合练 5 题（7 大考点内）", why: "接近真卷的出题方式，混着考才知道认不认得出考点",
      run: () => quizTask("fill-gmix", orderForPractice(byDifficulty(grammarInScope())).slice(0, 5), "语法混合练") },
    { id: "fill-logic", icon: "🧩", tag: "加练", same: "logic", min: 3,
      title: "过一遍逻辑连接词表", why: "完形唯一值得投入的东西，转折/因果/递进认全就够",
      run: () => { go("cloze"); setTimeout(() => { const b = $("#c-logic"); if (b) b.click(); }, 40); }, manual: true },
  ];
  let guard = 0;
  while (guard++ < 8) {
    const has = plan.map((t) => t.same).filter(Boolean);
    const f = FILLERS.find((x) => used + x.min <= budget && has.indexOf(x.same) < 0);
    if (!f) break;
    add(Object.assign({}, f));
  }
  }   // ← 路线模式/自由模式的分界

  notePlanned(plan.map((t) => t.id));
  // 自动判定：能从数据看出来已经做完的（债还清了），直接记完成
  plan.forEach((t) => { if (t.auto && t.auto()) markTask(t.id, true); });
  return { plan: plan, budget: budget, used: used, weekend: weekend, stage: stage };
}

function dailyLeft() {
  const p = buildDailyPlan();
  return p.plan.filter((t) => !t.optional && !isTaskDone(t.id)).length;
}

function todayClassic() {
  const { plan, budget, used, weekend, stage } = buildDailyPlan();
  const doneN = plan.filter((t) => isTaskDone(t.id)).length;
  const over = used > budget;

  const cards = plan.map((t) => {
    const done = isTaskDone(t.id);
    return `<div class="task ${done ? "done" : ""}">
      <button class="task-check" data-check="${esc(t.id)}" title="${done ? "取消完成" : "标记完成"}">${done ? "✓" : ""}</button>
      <div class="task-main">
        <div class="task-title">${t.icon} ${esc(t.title)}
          <span class="tag ${t.tag === "还债" ? "tag-red" : t.pinned ? "tag-orange" : ""}">${esc(t.tag)}</span>
          ${t.pinned ? `<span class="tag tag-orange">必做</span>` : ""}</div>
        <div class="task-why">${esc(t.why)}</div>
      </div>
      <div class="task-min">${t.min}′</div>
      <button class="btn btn-sm ${done ? "" : "btn-primary"}" data-run="${esc(t.id)}">${done ? "再做一次" : "去做"}</button>
    </div>`;
  }).join("");

  render(`
  <div class="card">
    <div class="row"><h1>今天</h1>
      <span class="tag ${weekend ? "tag-orange" : "tag-ink"}">${weekend ? "休息日 · 长练习" : "工作日 · 短练习"}</span>
      ${STATE.settings.sprint ? `<span class="tag tag-orange">🔖 冲刺 · 只练卷子题</span>` : ""}
      <div class="spacer"></div>
      <span class="sub">${esc(stage.stage)} 阶段 · 距考试 ${daysToExam()} 天</span></div>
    ${(() => {
      const pendMin = plan.filter((t) => !isTaskDone(t.id)).reduce((a, t) => a + t.min, 0);
      const pinnedPend = plan.filter((t) => t.pinned && !isTaskDone(t.id));
      return `<p class="sub">时间预算 <b>${budget} 分钟</b>（${weekend ? S.config.weekend_minutes : S.config.weekday_minutes} 分钟 × 英语占比 ${Math.round(S.config.subject_time_split.english * 100)}%）。
        今天排了 ${plan.length} 件，已完成 <b>${doneN}</b> 件；剩下 ${plan.length - doneN} 件约 <b>${pendMin}</b> 分钟。</p>
      ${pendMin > budget ? `<div class="warnbox mt">剩下的活约 ${pendMin} 分钟，超出预算 ${pendMin - budget} 分钟${pinnedPend.length ? ` —— 其中「${esc(pinnedPend.map((t) => t.title).join("、"))}」是策略写死的必做项，先做它，其余顺延` : "，做不完顺延到明天，别硬撑"}。</div>` : ""}`;
    })()}
    ${STATE.settings.sprint
      ? `<p class="sub mt"><b>${weekend ? "休息日" : "工作日"}就这 ${plan.length} 件，按顺序做完就行</b> —— ${
           plan.map((t) => esc(t.tag)).join(" → ")}。
         放弃的板块（完形、语音、从句虚拟倒装）不会出现在这里。
         <a href="#" id="sp-goto">看全部题型 / 退出冲刺</a></p>`
      : `<p class="sub mt"><b>本阶段方针：</b>${esc(stage.focus)}　|　${esc(stage.note)}</p>`}
  </div>

  <div class="tasks">${cards}</div>

  ${doneN === plan.length ? (() => {
    const nu = nextCourseUnit();
    return `<div class="card"><h2>今天的做完了</h2>
    ${nu ? `<p class="sub mb">计划内的做完了。还有劲就<b>顺着路线继续走</b>——路线是线性的，多走一节就早一天走完，明天照常再排新的。</p>
      <div class="row"><button class="btn btn-orange" id="extra-course">▶ 继续学：${esc(window.COURSE_CH[nu.ch])} · ${esc(unitTitle(nu))}</button>
        <button class="btn" data-extra="sentence">拆一个长句</button></div>`
    : `<p class="sub mb">按计划这就够了。想再练可以自己挑一块，但别拿加练顶替明天的量。</p>
      <div class="row"><button class="btn" data-extra="reading">加练阅读</button>
        <button class="btn" data-extra="grammar">加练语法</button>
        <button class="btn" data-extra="sentence">再拆一个长句</button></div>`}
    </div>`;
  })() : ""}

`);

  $$("[data-run]").forEach((b) => (b.onclick = () => {
    const t = plan.find((x) => x.id === b.dataset.run);
    if (!t) return;
    // 只能靠人判断有没有做完的（背场景句、拆长句、写作文），去之前先给个提示
    if (t.manual && !isTaskDone(t.id)) toast("做完回「今天」页点左边的圈打勾", 3200);
    t.run();
  }));
  $$("[data-check]").forEach((b) => (b.onclick = () => {
    markTask(b.dataset.check, !isTaskDone(b.dataset.check));
    ROUTES.today();
  }));
  $$("[data-extra]").forEach((b) => (b.onclick = () => go(b.dataset.extra)));
  if ($("#sp-goto")) $("#sp-goto").onclick = (e) => { e.preventDefault(); go("real"); };
  if ($("#extra-course")) $("#extra-course").onclick = () => { const nu = nextCourseUnit(); if (nu) runUnit(nu); };
}

/* ============================================================== 今天（冲刺版） */
/* 2026-09-13 用户：「UI 简洁，不要这么多选项；工作日/休息日排得科学、精简、区分开」。
 * 冲刺模式下今天页只回答三件事：今天是哪种日子、几件事几分钟、下一件是什么。
 *   - 一个大按钮 = 下一件没做完的任务，点了直接开始，不用在 4 张卡里挑
 *   - 工作日 = 墨蓝，休息日 = 橙色，一眼分得开
 *   - 没有预算公式、没有「超预算」警告、没有阶段代号（W7-9 这种用户看不懂）
 *   - 卡片左边的圈里是序号（做完变 ✓），按顺序做就行
 * 路线模式（settings.sprint=false）仍走上面的 todayClassic，原样没动。 */
ROUTES.today = function () {
  if (!STATE.settings.sprint) return todayClassic();
  const { plan, used, weekend } = buildDailyPlan();
  const core = plan.filter((t) => !t.optional);
  const doneN = core.filter((t) => isTaskDone(t.id)).length;
  const pendMin = core.filter((t) => !isTaskDone(t.id)).reduce((a, t) => a + t.min, 0);
  const first = core.find((t) => !isTaskDone(t.id));
  const d = daysToExam();

  let n = 0;
  const cards = plan.map((t) => {
    const done = isTaskDone(t.id);
    if (!t.optional) n++;
    const isNext = first && t.id === first.id;
    return `<div class="task ${done ? "done" : ""}${t.optional ? " optional" : ""}${isNext ? " next" : ""}">
      <button class="task-check" data-check="${esc(t.id)}" title="${done ? "取消完成" : "标记完成"}">${done ? "✓" : t.optional ? "+" : n}</button>
      <div class="task-main">
        <div class="task-title">${t.icon} ${esc(t.title)}
          <span class="tag ${t.optional ? "" : t.tag === "错题" ? "tag-red" : weekend ? "tag-orange" : "tag-ink"}">${t.optional ? "选做" : esc(t.tag)}</span></div>
        <div class="task-why">${esc(t.why).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")}</div>
      </div>
      <div class="task-min">${t.min}′</div>
      <button class="btn btn-sm ${isNext ? "btn-primary" : ""}" data-run="${esc(t.id)}">${done ? "再做一次" : "去做"}</button>
    </div>`;
  }).join("");

  render(`
  <div class="td-head ${weekend ? "wk" : "wd"}">
    <div class="td-l"><h1>今天</h1><span class="td-chip">${weekend ? "休息日 · 长练" : "工作日 · 短练"}</span></div>
    <div class="td-r">距考试 <b>${d}</b> 天</div>
  </div>
  <div class="card td-card">
    <div class="td-sum">${core.length} 件 · 约 ${used} 分钟${doneN ? ` · 已完成 ${doneN} 件${first ? `，还剩约 ${pendMin} 分钟` : ""}` : ""}</div>
    ${first
      ? `<button class="td-cta" id="td-start">▶ ${doneN ? "继续" : "开始"}：${esc(first.title)}
           <small>${first.min} 分钟 · 第 ${doneN + 1} / ${core.length} 件${first.manual ? " · 做完回来点圈打勾" : ""}</small></button>`
      : `<div class="td-done">✅ 今天的做完了。明天再来——别拿加练顶明天的量。</div>
         ${STATE.settings.writingOnly
           ? `<div class="row mt"><button class="btn btn-sm" data-extra="writing">有劲？再去看一遍模板</button></div>`
           : `<div class="row mt"><button class="btn btn-sm" data-extra="colloc">有劲？再背一批搭配</button>
           <button class="btn btn-sm" id="td-more-read">再练 5 题阅读</button></div>`}`}
  </div>

  <div class="tasks">${cards}</div>

  ${STATE.settings.writingOnly ? `<div class="td-foot">
    <div><b class="td-wd">工作日 ≈ 15′</b>　默写模板骨架 → 一道真题写三段提纲（AI 扩成范文读一遍）</div>
    <div><b class="td-wk">休息日 ≈ 45′</b>　计时写一篇真题作文 → 回看上一篇批改</div>
    <div class="muted">新概念 1 和背单词在 App 外照常学，这里只管作文。<a href="#" id="wo-toggle">切回完整日程（搭配 / 阅读 / 错题）</a></div>
  </div>` : `<div class="td-foot">
    <div><b class="td-wd">工作日 ≈ 25′</b>　错题 → 默写模板开头 → 8 条搭配 → 阅读 5 题</div>
    <div><b class="td-wk">休息日 ≈ 70′</b>　错题 → 计时写一篇作文 → 8 条搭配 → 阅读 8 题（对话选做；最后 3 周的周日加一套整卷）</div>
    <div class="muted">不练：完形、语音、定从 / 名从 / 虚拟 / 倒装——考场直接蒙。<a href="#" id="sp-goto">全部题型 / 退出冲刺</a> · <a href="#" id="wo-toggle">只练作文</a></div>
  </div>`}`);

  const run = (t) => {
    if (t.manual && !isTaskDone(t.id)) toast("做完回「今天」页点左边的圈打勾", 3200);
    t.run();
  };
  $$("[data-run]").forEach((b) => (b.onclick = () => { const t = plan.find((x) => x.id === b.dataset.run); if (t) run(t); }));
  if ($("#td-start")) $("#td-start").onclick = () => run(first);
  $$("[data-check]").forEach((b) => (b.onclick = () => { markTask(b.dataset.check, !isTaskDone(b.dataset.check)); ROUTES.today(); }));
  $$("[data-extra]").forEach((b) => (b.onclick = () => go(b.dataset.extra)));
  if ($("#td-more-read")) $("#td-more-read").onclick = () => { const t = readingTask(false); if (t) t.run(); else toast("阅读题都练过了"); };
  if ($("#sp-goto")) $("#sp-goto").onclick = (e) => { e.preventDefault(); go("real"); };
  if ($("#wo-toggle")) $("#wo-toggle").onclick = (e) => {
    e.preventDefault();
    STATE.settings.writingOnly = !STATE.settings.writingOnly; saveState();
    toast(STATE.settings.writingOnly ? "已切到只练作文" : "已切回完整日程", 2400);
    go("today");
  };
};

/* ============================================================== 学习路线 */
/* 路线的执行器：一节 = 上课(lesson) / 做题(drill) / 带思路对话(cue) / 模板(template)。
   全部回到 course 页，形成「学一节 → 看到路线亮一格」的闭环。 */
function runUnit(u) {
  if (u.kind === "lesson") return go("lesson", u.ref);
  if (u.kind === "template") {
    go("writing", "template");
    setTimeout(() => { const el = $("#tplcard-" + u.tpl); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 60);
    toast("读懂骨架、点「生成一篇完整范文」看怎么填，再自己换一套词填一遍；完了回「学习路线」点标记完成", 4200);
    return;
  }
  if (u.kind === "cue") {
    const buckets = {};
    orderForPractice(BY_SEC.dialogue).forEach((q) => { const k = cueKey(q); (buckets[k] = buckets[k] || []).push(q); });
    const keys = Object.keys(buckets), list = [];
    let i = 0;
    while (list.length < u.n && keys.some((k) => buckets[k].length)) { const k = keys[i % keys.length]; i++; if (buckets[k].length) list.push(buckets[k].shift()); }
    return startQuiz(shuffle(list), { title: unitTitle(u), backTo: "course", think: true, onFinish: (r, c, n) => finishUnit(u, c, n) });
  }
  startQuiz(unitQuestions(u), { title: unitTitle(u), backTo: "course", onFinish: (r, c, n) => finishUnit(u, c, n) });
}
function finishUnit(u, c, n, passOverride) {
  const pass = recordUnit(u, c, n, passOverride);
  markTask("course-" + u.id, true);
  toast(pass ? "✅ 这一节过了！路线往前走一格"
    : u.kind === "lesson" ? "还没连对 4 题——这课明天重来一遍，讲到会为止"
    : "没到 70%——这节明天还在原地，练到过为止，不丢人", 3400);
}

/* 课程表：一条线的全景。当前节高亮，后面的锁住（不跳级），过了的可以重练。 */
ROUTES.course = function () {
  const C = window.COURSE, cur = nextCourseUnit();
  const done = C.filter(unitPassed).length;
  let rows = "", lastCh = 0;
  C.forEach((u) => {
    if (u.ch !== lastCh) { lastCh = u.ch; rows += `<h2 class="mt" style="margin:16px 2px 8px">${esc(window.COURSE_CH[u.ch])}</h2>`; }
    const r = STATE.course[u.id];
    const isCur = cur && cur.id === u.id;
    const locked = !r && !isCur;
    rows += `<div class="task ${unitPassed(u) ? "done" : ""}">
      <button class="task-check" ${unitPassed(u) ? "" : 'style="background:transparent"'}>${unitPassed(u) ? "✓" : ""}</button>
      <div class="task-main">
        <div class="task-title">${esc(unitTitle(u))}
          ${isCur ? '<span class="tag tag-orange">当前</span>' : ""}
          ${r && !r.pass ? `<span class="tag tag-red">上次 ${r.correct}/${r.total} 没过，再练</span>` : ""}</div>
        <div class="task-why">${u.kind === "lesson" ? "微课讲解 + 练到连对 4 题" : u.kind === "cue" ? "带解题思路练 " + u.n + " 题" : u.kind === "template" ? "读模板 + 自己填一篇" : u.point ? (u.n || 10) + "~15 题 · 过关线 70%（课后练错得越多这里考得越多）" : (u.n || 8) + " 题 · 过关线 70%"}${r && u.kind !== "template" ? " · 最近 " + r.correct + "/" + r.total : ""}</div>
      </div>
      ${u.kind === "template" && (isCur || (r && !r.pass)) ? `<button class="btn btn-sm" data-tdone="${u.id}">标记完成</button>` : ""}
      <button class="btn btn-sm ${isCur ? "btn-primary" : ""}" data-unit="${u.id}" ${locked ? "disabled" : ""}>${unitPassed(u) ? "重练" : isCur ? "学这节" : "🔒"}</button>
    </div>`;
  });
  render(`
  <div class="card">
    <div class="row"><h1>学习路线</h1><div class="spacer"></div>
      ${cur ? `<button class="btn btn-orange" id="c-go">▶ 继续：${esc(unitTitle(cur))}</button>` : '<span class="tag tag-green">🎉 全部走完</span>'}</div>
    <p class="sub">一条线从头走到底：<b>基础题做熟 → 7 大考点一章一章过（先上课再练）→ 对话套路 → 写作模板</b>。
      不跳级：当前节没过关，后面全锁着。做题类过关线 70%，讲课类 60%——没过的节第二天还在原地。</p>
    <p class="sub mt">已过 <b>${done}</b> / ${C.length} 节。每天「今天」页会自动排路线的下一节（工作日最多 2 节 / 周末最多 4 节）。</p>
  </div>
  ${rows}`);
  if ($("#c-go")) $("#c-go").onclick = () => runUnit(cur);
  $$("[data-unit]").forEach((btn) => (btn.onclick = () => { const u = C.find((x) => x.id === btn.dataset.unit); if (u) runUnit(u); }));
  $$("[data-tdone]").forEach((btn) => (btn.onclick = () => {
    const u = C.find((x) => x.id === btn.dataset.tdone);
    recordUnit(u, 1, 1); markTask("course-" + u.id, true);
    toast("完成，路线往前走一格"); ROUTES.course();
  }));
};
ROUTES.lessons = function () { go("course"); };
ROUTES.basics_redirect = null;

/* 讲解正文的轻排版：\n 换行、**重点** 加粗。先 esc 再插标签，注入安全。 */
function teachText(t) {
  return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
}

/* 微课页：讲解块 + 例句（可朗读）+ 课后练习入口 */
ROUTES.lesson = function (lessonId) {
  const L = window.LESSONS || [];
  let lsn = lessonId ? L.find((l) => l.id === lessonId) : null;
  if (!lsn) { const nu = nextCourseUnit(); if (nu && nu.kind === "lesson") lsn = L.find((l) => l.id === nu.ref); }
  if (!lsn) lsn = L.find((l) => !STATE.lessons[l.id]) || L[L.length - 1];
  const idx = L.indexOf(lsn);
  const unit = (window.COURSE || []).find((u) => u.kind === "lesson" && u.ref === lsn.id);
  const rec = STATE.lessons[lsn.id];
  render(`
  <div class="card">
    <div class="q-head"><button class="btn btn-sm btn-ghost" id="ls-back">← 学习路线</button>
      <b>第 ${idx + 1} / ${L.length} 课</b>
      <span class="tag tag-ink">${lsn.point && pointById(lsn.point) ? "考点" + lsn.point + " " + esc(pointById(lsn.point).name) : esc(lsn.chapter || "补充考点")}</span>
      ${rec ? `<span class="tag tag-green">学过 · 上次 ${rec.correct}/${rec.total}</span>` : ""}
      <div class="spacer"></div></div>
    <h1>${esc(lsn.title)}</h1>
    <p class="sub">慢慢读，例句点 🔊 听。读完做课后练习：连对 4 题过关，全是这一课讲的东西。</p>
  </div>
  ${lsn.teach.map((blk) => `<div class="card"><h2>${esc(blk.h)}</h2>
    <p style="font-size:15.5px;line-height:1.95">${teachText(blk.p)}</p>
    ${(blk.ex || []).map((e) => `<div class="eg mt">
      <div class="en">${esc(e[0])} <button class="spk" data-say="${esc(String(e[0]).replace(/[()]/g, ""))}">🔊</button></div>
      <div class="cn-line">${esc(e[1])}</div>
      ${e[2] ? `<div class="why">🔍 ${esc(e[2])}</div>` : ""}</div>`).join("")}</div>`).join("")}
  <div class="card">
    <h2>课后练习</h2>
    <p class="sub mb">连对制：<b>连续答对 4 题</b>这课才算过，不数题数。错一题连对清零，那道题过几题还会回来考你——直到你真的会（最多 15 题，到上限没连对就明天重来）。做错看逐项解释，还不懂点「问 AI」追问。</p>
    <div class="row"><button class="btn btn-orange" id="ls-go">开始课后练习</button></div>
  </div>`);
  $("#ls-back").onclick = () => go("course");
  $$("[data-say]").forEach((b) => (b.onclick = () => speak(b.dataset.say)));
  $("#ls-go").onclick = () => {
    const qs = unitQuestions(unit || { kind: "lesson", ref: lsn.id });
    startQuiz(qs, { title: "课后练习 · " + lsn.title, backTo: "course",
      mastery: { streak: 4, cap: 15 },
      onFinish: (rate, c, n, mastered) => {
        STATE.lessons[lsn.id] = { d: todayStr(), correct: c, total: n }; saveState();
        if (unit) finishUnit(unit, c, n, mastered);
      } });
  };
};

/* ============================================================== 答题引擎 */
let QUIZ = null;

/**
 * 开始一组题
 * @param list 题目数组
 * @param opts {title, backTo, onFinish}
 */
function startQuiz(list, opts) {
  if (!list || !list.length) { toast("这一组暂时没有题"); return; }
  QUIZ = { list: list, i: 0, correct: 0, opts: opts || {}, picked: null, ec: null, trap: null, answered: [] };
  // 连对制（opts.mastery = {streak, cap}）：不数题数，连续答对 streak 题才算过。
  // 池子循环填到 cap——题少也能一直练；错过的题还会插回来重考。
  if (QUIZ.opts.mastery) {
    const m = QUIZ.opts.mastery;
    QUIZ.mastery = { target: m.streak || 4, cap: m.cap || 15, streak: 0 };
    const base = list.slice();
    QUIZ.list = [];
    for (let i = 0; i < QUIZ.mastery.cap; i++) QUIZ.list.push(base[i % base.length]);
  }
  // 记下开练之前的分数，做完好告诉你「涨了几分」—— 这是唯一的正反馈来源。
  // ⚠️ 一组题可能跨板块（地基热身就是混着出的），这时候只报单个板块会牛头不对马嘴，
  //    要报总分。所以先看这组题到底覆盖了几个板块。
  const secs = {}; list.forEach((q) => { const k = secOf(q); if (k) secs[k] = 1; });
  const keys = Object.keys(secs);
  QUIZ.sec = keys.length === 1 ? keys[0] : null;
  QUIZ.secs = keys;
  QUIZ.before = QUIZ.sec ? secScore(QUIZ.sec).score : totalScore();

  /* 整篇模式（2026-08-16 用户报 bug：「阅读理解答题的时候不能看文章，
     也看不到前面的题，不符合试卷逻辑」）。真卷就是一篇短文配一组题摆在一起，
     所以只要这一组题共用同一篇短文，就换成整篇模式：
     短文钉在顶上一直看得见，所有题列在下面，答完一起交卷。 */
  const pid = (q) => q.passageId || (passageOf(q) ? "p:" + passageOf(q) : null);
  const k0 = pid(list[0]);
  QUIZ.paper = !QUIZ.mastery && list.length > 1 && !!k0 && list.every((q) => pid(q) === k0);
  if (QUIZ.opts.paper === false) QUIZ.paper = false;
  if (QUIZ.paper) {
    QUIZ.passage = passageOf(list.find((q) => passageOf(q)));
    QUIZ.picks = {}; QUIZ.ecs = {}; QUIZ.traps = {}; QUIZ.recorded = {};
    return renderPaperQuiz();
  }
  renderQuiz();
}

/* ---------------------------------------------------------- 整篇模式 */
/* 短文 sticky 钉在顶部（自带滚动条），题目全列在下面 —— 随时能回看原文和前面的题。
   完形填空还会把正在做的那个空在原文里高亮出来。 */
function renderPaperQuiz() {
  const isCloze = QUIZ.sec === "cloze";
  const psg = esc(QUIZ.passage).replace(/\((\d+)\)/g,
    (m, n) => `<span class="psg-blank" data-blank="${n}">${m}</span>`);
  const qs = QUIZ.list.map((q, i) => `
    <div class="pq" id="pq-${i}" data-qi="${i}">
      <div class="pq-head"><span class="pq-num">${i + 1}</span>
        <div class="stem">${esc(q.stem)}</div></div>
      <div class="opts" id="opts-${i}">
        ${q.options.map((o, k) => `<button class="opt" data-qi="${i}" data-oi="${k}"><b>${letter(k)}</b><span>${escOpt(o)}</span></button>`).join("")}
      </div>
      <div id="after-${i}"></div>
    </div>`).join("");

  render(`
  <div class="card card-tight">
    <div class="q-head"><button class="btn btn-sm btn-ghost" id="q-exit">← 退出</button>
      <b>${esc(QUIZ.opts.title || "整篇")}</b>
      <span class="tag tag-ink">整篇 ${QUIZ.list.length} 题</span>
      <span class="tag">${isCloze ? "先通读抓大意，再一空一空填" : "先看题干圈关键词，再回原文定位"}</span>
      <div class="spacer"></div>
      <button class="btn btn-sm btn-ghost" id="psg-fold">收起原文</button></div>
  </div>
  ${QUIZ.opts.ruleCard ? `<div class="card card-tight">${QUIZ.opts.ruleCard}</div>` : ""}
  <div class="card psg-card" id="psg-card">
    <div class="row mb"><b>原文</b>
      <button class="btn btn-sm" id="psg-speak">🔊 朗读</button>
      <div class="spacer"></div>
      <span class="muted" style="font-size:12px">双击单词 / 拖选短语 → 右下角出中文</span></div>
    <div class="passage" id="psg">${psg}</div>
  </div>
  <div class="card">${qs}</div>
  <div class="paperbar" id="paperbar"></div>`);

  $("#q-exit").onclick = () => exitPaper();
  $("#psg-speak").onclick = () => speak(QUIZ.passage);
  $("#psg-fold").onclick = () => {
    const c = $("#psg-card"), on = c.classList.toggle("folded");
    $("#psg-fold").textContent = on ? "展开原文" : "收起原文";
  };
  $$(".opt[data-oi]").forEach((b) => (b.onclick = () => choosePaperOpt(+b.dataset.qi, +b.dataset.oi)));
  // 完形：点到哪道题，原文里对应的那个空就亮起来
  if (isCloze) $$(".pq").forEach((el) => (el.onmouseenter = el.onclick = () => markBlank(+el.dataset.qi)));
  renderPaperBar();
  bindLookup();
  if (isCloze) markBlank(0);
}

function markBlank(qi) {
  const q = QUIZ.list[qi]; if (!q) return;
  const m = String(q.stem).match(/\((\d+)\)/);
  $$(".psg-blank").forEach((s) => s.classList.remove("on"));
  if (!m) return;
  const t = $$(".psg-blank").find((s) => s.dataset.blank === m[1]);
  if (t) t.classList.add("on");
}

function choosePaperOpt(qi, oi) {
  const q = QUIZ.list[qi];
  if (QUIZ.picks[q.id] !== undefined) return;   // 一题只答一次
  QUIZ.picks[q.id] = oi;
  const ok = oi === q.answer;
  if (ok) QUIZ.correct++;
  QUIZ.answered.push({ q: q, ok: ok });
  $$(`#opts-${qi} .opt`).forEach((b, k) => {
    const note = q.optionNotes && q.optionNotes.length === q.options.length ? q.optionNotes[k] : "";
    if (k === q.answer) b.classList.add("right");
    else if (k === oi) b.classList.add("wrong");
    else b.classList.add("dim");
    if (note) b.querySelector("span").innerHTML = escOpt(q.options[k]) + `<span class="opt-note">${esc(note)}</span>`;
    b.onclick = null;
  });
  if (!ok) prefetchExplain(q, oi);
  $("#after-" + qi).innerHTML = explainHTML(q, oi) + (ok ? "" : attribHTML(q, qi));
  if (!ok) { bindPaperAttrib(qi); bindQHelp(); }
  if (ok) { recordAnswer(q, true, "NONE", ""); QUIZ.recorded[q.id] = 1; }
  renderPaperBar();
}

function bindPaperAttrib(qi) {
  const q = QUIZ.list[qi], root = $("#after-" + qi);
  root.querySelectorAll("#ec-row-" + qi + " .ec-btn").forEach((b) => (b.onclick = () => {
    root.querySelectorAll("#ec-row-" + qi + " .ec-btn").forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
    QUIZ.ecs[q.id] = b.dataset.ec;
    const def = S.error_classes.find((e) => e.code === b.dataset.ec);
    root.querySelector("#ec-fix-" + qi).textContent = def && def.fix ? "→ 对策：" + def.fix : "";
    root.querySelector("#trap-row-" + qi).classList.toggle("hidden", b.dataset.ec !== "TRAP");
    renderPaperBar();
  }));
  root.querySelectorAll("#trap-row-" + qi + " .ec-btn").forEach((b) => (b.onclick = () => {
    root.querySelectorAll("#trap-row-" + qi + " .ec-btn").forEach((x) => x.classList.remove("on"));
    b.classList.add("on"); QUIZ.traps[q.id] = b.dataset.trap;
  }));
  root.querySelector("#q-ask-" + qi).onclick = () => askAboutQuestion(q, qi);
}

/* 底部固定条：做了几题、还差什么才能交卷 */
function renderPaperBar() {
  const n = QUIZ.list.length;
  const done = QUIZ.list.filter((q) => QUIZ.picks[q.id] !== undefined).length;
  const needEc = QUIZ.list.filter((q) => QUIZ.picks[q.id] !== undefined
    && QUIZ.picks[q.id] !== q.answer && !QUIZ.ecs[q.id]).length;
  const ready = done === n && !needEc;
  $("#paperbar").innerHTML = `
    <span class="pb-prog">已做 <b>${done}</b> / ${n}　对 ${QUIZ.correct}</span>
    <div class="spacer"></div>
    ${!ready ? `<span class="muted" style="font-size:12.5px">${done < n ? `还有 ${n - done} 题没做` : `还有 ${needEc} 道错题没选归因`}</span>` : ""}
    <button class="btn btn-primary" id="pb-submit" ${ready ? "" : "disabled"}>交卷看结果</button>`;
  if ($("#pb-submit")) $("#pb-submit").onclick = () => submitPaper();
}

/* 记账：对的在选的时候就记了，错的等归因选完统一记（归因是硬规矩） */
function flushPaper() {
  QUIZ.list.forEach((q) => {
    if (QUIZ.picks[q.id] === undefined || QUIZ.recorded[q.id]) return;
    recordAnswer(q, false, QUIZ.ecs[q.id] || "", QUIZ.traps[q.id] || "");
    QUIZ.recorded[q.id] = 1;
  });
}
function submitPaper() { flushPaper(); finishQuiz(); }
function exitPaper() {
  flushPaper();   // 半途退出也得记账，否则等于白做
  const b = QUIZ.opts.backTo || "home"; QUIZ = null; go(b);
}

/* 补全对话「先判线索」——考场上这一步就能砍掉一半选项。
 * 真题是整段对话挖空：空里要么是【问句】（线索在空格后面那句），
 * 要么是【回应】（线索在空格前面对方说了什么）。
 * 八类线索从题干/短文里自动判出来，不需要给题库打标。
 * ⚠️ 别改回「只分4种句型」的老版：题库 33 道里 32 道的答案是应答句，
 *    四分类会让第一步永远选同一个按钮，等于白练（2026-08-11 踩过）。 */
const CUE_DEFS = {
  ASK_WH:    { group: "ask", label: "特殊疑问句（问具体信息）", rule: "空里是问句。线索在空格【后面】：对方回的是具体信息（时间/地点/价钱/原因），空里就用 What / When / Where / How 开头问它" },
  ASK_YN:    { group: "ask", label: "一般疑问句（问是不是）",   rule: "空里是问句。线索在空格【后面】：对方回 Yes / No / Of course / Sure，空里就是 Do / Can / Are 开头的一般疑问句" },
  RE_YESNO:  { group: "re",  label: "先用 Yes / No 表态",      rule: "对方用 Do / Can / Are / Would you mind 开头问你——先表态（Yes, please. / Not at all.）再补内容，别上来就说别的" },
  RE_INFO:   { group: "re",  label: "直接给具体信息",           rule: "对方用 What / How / Where / When 问你——直接给信息（价钱/地点/名字），⚠️ 特殊疑问句不能用 Yes / No 回答" },
  RE_THANKS: { group: "re",  label: "回应感谢",                rule: "对方说了 Thank you —— 固定回 You're welcome / Not at all / My pleasure，别的都不对" },
  RE_SORRY:  { group: "re",  label: "回应道歉",                rule: "对方说了 Sorry —— 固定回 Never mind / That's all right / It doesn't matter" },
  RE_INVITE: { group: "re",  label: "回应邀请 / 提议",          rule: "对方在约你（Would you like / Shall we / Let's / What about）——接受用 I'd love to / Good idea；婉拒的标准结构是先接受再转折：I'd love to, but..." },
  RE_FLOW:   { group: "re",  label: "寒暄按习惯回",             rule: "问候祝福类都有固定回法：Nice to meet you → 加 too 回敬；Happy birthday → Thank you；How do you do → 原句回 How do you do" },
};
function _isWh(t) { return /^(what|when|where|why|how|which|who|whose)\b/i.test(String(t).trim()); }
function _isAux(t) { return /^(do|does|did|is|are|am|was|were|can|could|will|would|shall|should|may|might|have|has|had)\b/i.test(String(t).trim()); }
function cueKey(q) {
  const ans = String(q.options[q.answer]).trim();
  // 空里是问句？（How do you do 除外——它是寒暄的固定回敬，不是真的在提问）
  if (!/^how do you do/i.test(ans)) {
    if (_isWh(ans) || /^(what|how) about\b/i.test(ans)) return "ASK_WH";
    if (_isAux(ans)) return "ASK_YN";
  }
  // 空里是回应 → 找空格前面对方那句
  let ctx = "";
  const parts = String(q.stem).split(/[—\n]+/).map((x) => x.trim()).filter(Boolean);
  const bi = parts.findIndex((x) => /_{2,}/.test(x));
  if (bi > 0) ctx = parts[bi - 1];
  else if (passageOf(q)) {
    const m = q.stem.match(/\((\d+)\)/);
    if (m) { const p = passageOf(q); const idx = p.indexOf("(" + m[1] + ")"); if (idx > 0) ctx = p.slice(Math.max(0, idx - 90), idx); }
  }
  ctx = ctx.replace(/^excuse me[,!.]?\s*/i, "");
  if (/thank/i.test(ctx)) return "RE_THANKS";
  if (/sorry|afraid/i.test(ctx) && !/\?\s*$/.test(ctx)) return "RE_SORRY";
  if (_isWh(ctx)) return "RE_INFO";
  if (/would you like|shall we|let'?s\b|how about|what about|why not|will you (come|join)|do you want/i.test(ctx)) return "RE_INVITE";
  if (_isAux(ctx)) return "RE_YESNO";
  return "RE_FLOW";
}
/* 解题思路一句话：从 cueKey 自动生成，直接印在题目上方。
 * ⚠️ 别改回「让用户先点8个分类按钮」的交互：中文类别名歧义大，
 *    用户反馈看不懂在问什么（2026-08-11）。思路是教的，不是考的。 */
function cueThink(q) {
  const k = cueKey(q), d = CUE_DEFS[k];
  const head = k.indexOf("ASK") === 0
    ? "这个空要填【问句】，线索在空格后面。"
    : "这个空要填【回应】，线索是空格前面对方那句话。";
  return head + d.rule + "。现在从选项里找符合的那句。";
}
/* 组卷时按线索类型轮着抽，保证一组里能见到不同的类型 */
function cueDrill(n) {
  const buckets = {};
  orderForPractice(BY_SEC.dialogue).forEach((q) => { const k = cueKey(q); (buckets[k] = buckets[k] || []).push(q); });
  const keys = Object.keys(buckets), list = [];
  let i = 0;
  while (list.length < n && keys.some((k) => buckets[k].length)) {
    const k = keys[i % keys.length]; i++;
    if (buckets[k].length) list.push(buckets[k].shift());
  }
  startQuiz(shuffle(list), { title: "补全对话 · 带思路练", backTo: "today", think: true, onFinish: () => markTask("w12-cue", true) });
}

let QUIZ_BACK = "home";
function renderQuiz() {
  QUIZ_BACK = QUIZ.opts.backTo || "home";
  const q = QUIZ.list[QUIZ.i];
  const sec = secOf(q);
  // 原文一律走 passageOf()（同一篇下面常常只有第一题挂了 passage 字段）。
  // 也不能因为「跟上一题同一篇」就不渲染 —— 换题是整页重绘，不渲染 = 原文没了。
  const qPassage = passageOf(q);
  const showPassage = !!qPassage;
  const tags = [];
  if (q.real) tags.push(`<span class="tag tag-orange">🎯 真题</span>`);
  if (q.mock) tags.push(`<span class="tag">模拟卷</span>`);
  if (sec === "reading") {
    const t = readingType(q), p = READ_PRIORITY[t] || "必做";
    tags.push(`<span class="tag ${p === "必做" ? "tag-green" : p === "可放弃" ? "tag-red" : ""}">${t} · ${p}</span>`);
  }
  // 难度 / 学法 / 知识框架 —— 用户 2026-08-16 要求：每道题都标清楚
  const lb = levelBadge(q);
  tags.push(`<span class="tag" title="${esc(lb.desc)}">难度 ${esc(lb.name)}</span>`);
  if (sec === "grammar") {
    const f = frameOf(q), md = (window.FRAME_MODES || {})[f && f.mode] || {};
    if (f) {
      tags.push(`<span class="tag tag-ink" title="${esc(f.chapter || ("考点" + f.point))}">${esc(f.name)}</span>`);
      tags.push(`<span class="tag ${f.mode === "理解" ? "tag-green" : "tag-orange"}" title="${esc(f.modeWhy || md.tip || "")}">${md.icon || ""} 该${esc(f.mode)}</span>`);
    }
  }

  render(`
  <div class="card">
    <div class="q-head">
      <button class="btn btn-sm btn-ghost" id="q-exit">← 退出</button>
      <b>${esc(QUIZ.opts.title || "练习")}</b>
      ${tags.join("")}
      <div class="spacer"></div>
      <span class="qprog">${QUIZ.mastery ? `已答 ${QUIZ.answered.length} · 连对 ${QUIZ.mastery.streak}/${QUIZ.mastery.target}` : `${QUIZ.i + 1} / ${QUIZ.list.length}　已对 ${QUIZ.correct}`}</span>
    </div>
    ${QUIZ.opts.ruleCard || ""}
    ${showPassage ? `<div class="passage" id="psg">${esc(qPassage)}</div>
      <div class="row mb"><button class="btn btn-sm" id="psg-speak">🔊 朗读短文</button>
        <span class="muted" style="font-size:12px">双击单词 / 拖选短语 → 右下角出中文释义</span></div>` : ""}
    <div class="stem">${esc(q.stem)}</div>
    ${QUIZ.opts.think && secOf(q) === "dialogue" ? `<div class="explain mb"><h4>解题思路</h4>${esc(cueThink(q))}</div>` : ""}
    ${q.bridge && pointOf(q) ? `<div class="row mb"><button class="btn btn-sm btn-ghost" id="q-hint">💡 不会？先看一眼这个考点的套路</button></div><div id="hint-box"></div>` : ""}
    <div class="opts" id="opts">
      ${q.options.map((o, i) => `<button class="opt" data-i="${i}"><b>${letter(i)}</b><span>${escOpt(o)}</span></button>`).join("")}
    </div>
    <div id="after"></div>
    <div class="qbar" id="qbar"></div>
  </div>`);
  // 搭桥题的「先看套路」：第一次见一个考点不该只能靠蒙。点开显示该考点的一句话规则，
  // 看完再答不算作弊——这一级的任务就是把套路认熟。
  if ($("#q-hint")) $("#q-hint").onclick = () => {
    const pt = pointById(pointOf(q));
    $("#hint-box").innerHTML = `<div class="explain mb"><h4>考点${pt.id} ${esc(pt.name)} · 一句话</h4>${esc(pt.rule)}</div>`;
    $("#q-hint").style.display = "none";
  };

  $("#q-exit").onclick = () => {
    // 已经选了错答案但没归因就退出 —— 这题也得记账，否则等于白错（会漏进错题本）
    if (QUIZ.picked !== null && QUIZ.picked !== QUIZ.list[QUIZ.i].answer) {
      recordAnswer(QUIZ.list[QUIZ.i], false, QUIZ.ec || "", QUIZ.trap || "");
    }
    const b = QUIZ.opts.backTo || "home"; QUIZ = null; go(b);
  };
  if ($("#psg-speak")) $("#psg-speak").onclick = () => speak(qPassage);
  $$("#opts .opt").forEach((b) => (b.onclick = () => chooseOpt(+b.dataset.i)));
  bindLookup();
}

function chooseOpt(i) {
  const q = QUIZ.list[QUIZ.i];
  if (QUIZ.picked !== null) return;
  QUIZ.picked = i;
  const ok = i === q.answer;
  if (ok) QUIZ.correct++;
  QUIZ.answered.push({ q: q, ok: ok });
  if (QUIZ.mastery) {
    if (ok) QUIZ.mastery.streak++;
    else {
      QUIZ.mastery.streak = 0;
      // 错的题过 3 题再考一遍——马上重考等于抄答案，隔几题才检验记住没有
      QUIZ.list.splice(Math.min(QUIZ.i + 3, QUIZ.list.length), 0, q);
    }
  }

  $$("#opts .opt").forEach((b, idx) => {
    const notes = q.optionNotes && q.optionNotes.length === q.options.length ? q.optionNotes[idx] : "";
    if (idx === q.answer) b.classList.add("right");
    else if (idx === i) b.classList.add("wrong");
    else b.classList.add("dim");
    if (notes) b.querySelector("span").innerHTML = escOpt(q.options[idx]) + `<span class="opt-note">${esc(notes)}</span>`;
    b.onclick = null;
  });

  if (!ok) prefetchExplain(q, i);   // 答错立刻后台预取 AI 讲解，等用户点按钮时已经在路上

  $("#after").innerHTML = explainHTML(q, i) + (ok ? "" : attribHTML(q));

  if (!ok) { bindAttrib(q); bindQHelp(); }
  renderQuizBar(ok);
  if (ok) recordAnswer(q, true, "NONE", "");
}

/* 错题归因面板 —— 不选就不给过。
   qi 有值 = 整篇模式（一页里有好几个归因面板，元素 id 要带题号区分开）。 */
/* 答错之后真正该给的东西：把这道题**读懂**。
   题干中文 + 正确项中文 + 原文里答案所在那句 + 本题生词表，AI 一次出全，按 qid 缓存。 */
function qHelpHTML(q) {
  const c = (STATE.qhelp || {})[q.id];
  return `<div class="qhelp" id="qh-${esc(q.id)}">
    <div class="qh-head"><b>读懂这道题</b>
      <span class="sub">题干和选项翻成中文 + 挑出本题生词${c ? "（已存下来，不再花钱）" : ""}</span>
      <div class="spacer"></div>
      ${c ? "" : `<button class="btn btn-sm btn-orange" data-qh="${esc(q.id)}">看中文 + 生词</button>`}</div>
    <div class="qh-body">${c ? qHelpBody(c) : ""}</div>
  </div>`;
}
function qHelpBody(c) {
  return `
    ${c.stem ? `<div class="qh-line"><i>题干</i><span>${esc(c.stem)}</span></div>` : ""}
    ${c.ans ? `<div class="qh-line"><i>正确项</i><span>${esc(c.ans)}</span></div>` : ""}
    ${c.ctx ? `<div class="qh-line qh-ctx"><i>答案出处</i><span><b>${esc(c.ctx)}</b><br>${esc(c.ctxZh || "")}</span></div>` : ""}
    ${(c.words || []).length ? `<div class="qh-words"><i>本题生词</i>
      <div>${c.words.map((w) => `<span class="qh-w" data-say="${esc(w[0])}">${esc(w[0])}
        <small>${esc(w[1] || "")} ${esc(w[2] || "")}</small></span>`).join("")}</div></div>` : ""}`;
}

async function loadQHelp(q) {
  const host = $("#qh-" + q.id); if (!host) return;
  const body = $(".qh-body", host), btn = $("[data-qh]", host);
  if (btn) btn.remove();
  if (!hasApiKey()) {
    body.innerHTML = `<span class="muted">这个功能要用 AI。去【设置】填一个 API Key 就能用；
      在没有 Key 的情况下，可以双击题干里的词查单个释义。</span>`;
    return;
  }
  body.innerHTML = `<div class="lk-skel"><span></span><span></span><span></span></div>`;
  const psg = passageOf(q);
  const right = q.options[q.answer];
  try {
    const t = await callClaude({
      system: "你是成人高考英语老师，学生英语基础很弱（A2），只需要看懂题目，不需要术语。中文一律用全角引号“”。",
      messages: [{ role: "user", content:
        `下面是一道成考英语题。请严格按这个格式输出，不要多写任何别的话：
【题干】题干的中文翻译（一句话）
【答案】正确选项的中文翻译（一句话）
${psg ? "【定位】从原文里原样抄出**支持这个答案的那一句英文**\n【定位译】那一句的中文翻译\n" : ""}【生词】从题干、正确选项${psg ? "和定位句" : ""}里挑出 3-6 个 A2 学生最可能不认识的词，每个写成「单词|词性缩写|中文释义」，用分号隔开

题干：${q.stem}
选项：${q.options.map((o, i) => letter(i) + ". " + o).join("  ")}
正确答案：${letter(q.answer)}. ${right}
${psg ? "原文：" + psg.slice(0, 1800) : ""}` }],
      maxTokens: 700,
    });
    const pick = (k) => { const m = t.match(new RegExp("【" + k + "】([^\n【]*)")); return m ? m[1].trim() : ""; };
    const c = {
      stem: pick("题干"), ans: pick("答案"),
      ctx: pick("定位"), ctxZh: pick("定位译"),
      words: pick("生词").split(/[;；]/).map((x) => x.split("|").map((y) => y.trim())).filter((x) => x[0]),
    };
    STATE.qhelp = STATE.qhelp || {};
    STATE.qhelp[q.id] = c;
    // 生词顺手进划词缓存，以后双击秒出
    (c.words || []).forEach((w) => { if (w[0] && w[2]) STATE.dict[w[0].toLowerCase()] = (w[1] ? w[1] + " " : "") + w[2]; });
    // 这道题错了就是因为读不懂——直接按「不认识关键词」记账，不用再问他一遍
    if (STATE.wrong[q.id] && !STATE.wrong[q.id].ec) STATE.wrong[q.id].ec = "VOCAB";
    saveState();
    body.innerHTML = qHelpBody(c);
    $$(".qh-w", host).forEach((el) => (el.onclick = () => speak(el.dataset.say)));
  } catch (e) {
    body.innerHTML = `<span class="lk-err">出不来：${esc(e.message)}</span>`;
  }
}
function bindQHelp() {
  $$("[data-qh]").forEach((b) => (b.onclick = () => loadQHelp(BY_ID[b.dataset.qh])));
  $$(".qh-w").forEach((el) => (el.onclick = () => speak(el.dataset.say)));
}

function attribHTML(q, qi) {
  const s = qi === undefined ? "" : "-" + qi;
  return qHelpHTML(q) + `<details class="attrib acc-thin">
    <summary>顺手标一下错因（可选，不标也行）</summary>
    <div class="row mt" id="ec-row${s}">
      ${S.error_classes.filter((e) => e.code !== "NONE")
        .map((e) => `<button class="ec-btn" data-ec="${e.code}">${esc(e.name)}</button>`).join("")}
      <button class="ec-btn" data-ec="NONE">蒙的／手滑</button>
    </div>
    <div id="trap-row${s}" class="hidden mt">
      <div class="sub mb">是哪一种套路？（可选，选了才能聚类总结）</div>
      <div class="row">
        ${S.reading.trap_patterns.map((t) => `<button class="ec-btn" data-trap="${t.code}" title="${esc(t.desc)}">${esc(t.name)}</button>`).join("")}
      </div>
    </div>
    <div class="ec-fix" id="ec-fix${s}"></div>
    ${qi === undefined ? "" : `<div class="row mt"><button class="btn btn-sm" id="q-ask-${qi}">🤖 问 AI：讲到我懂</button></div>`}
  </details>`;
}

function bindAttrib(q) {
  QUIZ.ec = null; QUIZ.trap = null;
  $$("#ec-row .ec-btn").forEach((b) => (b.onclick = () => {
    $$("#ec-row .ec-btn").forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
    QUIZ.ec = b.dataset.ec;
    const def = S.error_classes.find((e) => e.code === QUIZ.ec);
    $("#ec-fix").textContent = def && def.fix ? "→ 对策：" + def.fix : "";
    $("#trap-row").classList.toggle("hidden", QUIZ.ec !== "TRAP");
    // 选了 VOCAB 就顺手提示收词
    if (QUIZ.ec === "VOCAB") $("#ec-fix").textContent += "　（双击题干里不认识的词可以直接查释义）";
    renderQuizBar(false);
  }));
  $$("#trap-row .ec-btn").forEach((b) => (b.onclick = () => {
    $$("#trap-row .ec-btn").forEach((x) => x.classList.remove("on"));
    b.classList.add("on"); QUIZ.trap = b.dataset.trap;
  }));
}

function renderQuizBar(ok) {
  const last = QUIZ.i >= QUIZ.list.length - 1;
  // ⚠️ 2026-09-12 用户反馈：以前答错必须先点一个归因才放行。但他绝大多数错题的真实原因
  //    就是「词不认识、句子读不懂」，四选一的归因点了也不产生任何下一步动作，纯添堵
  //    （188 道错题里 90 道他干脆不归）。所以**不再拦**，归因降成可选。
  $("#qbar").innerHTML = `
    <button class="btn btn-primary" id="q-next">${last ? "看结果" : "下一题"}</button>
    <div class="spacer"></div>
    ${!ok ? `<button class="btn btn-sm" id="q-ask">🤖 问 AI：讲到我懂</button>` : ""}`;
  if ($("#q-next")) $("#q-next").onclick = () => {
    const q = QUIZ.list[QUIZ.i];
    if (!ok) recordAnswer(q, false, QUIZ.ec, QUIZ.trap);
    QUIZ.i++; QUIZ.picked = null; QUIZ.ec = null; QUIZ.trap = null;
    if (QUIZ.mastery && (QUIZ.mastery.streak >= QUIZ.mastery.target || QUIZ.answered.length >= QUIZ.mastery.cap)) return finishQuiz();
    if (QUIZ.i >= QUIZ.list.length) finishQuiz(); else renderQuiz();
  };
  if ($("#q-ask")) $("#q-ask").onclick = askAboutQuestion;
}

/* ============================================================== 解析图形化 */
/* 用户 2026-08-16：「错题的解析全部加强一下，很难让我理解，最好用可视化、
   或者简单的方式」+ 指着句子拆解图说「比如像这样的方式」。
   所以答错时不再只给一段文字，而是按顺序画四块：
     ① 答案对照  —— 把空填进句子，正确的那句 vs 你选的那句并排，一眼看出差别
     ② 公式色块  —— 这个知识框架长什么样，每块下面标中文角色
     ③ 三步判断  —— 考场上眼睛看到什么就走哪一步
     ④ 口诀 / 最容易错的地方
   数据来自 frames.js，所以每道语法题都有图，不用逐题手写。 */

/* 把选项填进题干的空里。两个空的题（"moving; moved"）按分号依次填。 */
function fillBlank(stem, opt) {
  const parts = String(opt || "").split(/\s*[;；]\s*/);
  let i = 0;
  const marked = esc(String(stem || "")).replace(/_{2,}/g, () => {
    const t = parts.length > 1 ? parts[Math.min(i, parts.length - 1)] : parts[0];
    i++;
    return "\u0001" + t + "\u0002";
  });
  return marked.replace(/\u0001([^\u0002]*)\u0002/g, (m, t) => `<b class="fb">${esc(t)}</b>`);
}
function hasBlank(q) { return /_{2,}/.test(String(q.stem || "")); }

/* ① 答案对照：正确的那句 / 你选的那句 */
function compareHTML(q, picked) {
  if (!hasBlank(q)) return "";
  const right = q.options[q.answer];
  const notes = q.optionNotes && q.optionNotes.length === q.options.length ? q.optionNotes : null;
  const zh = q.zh || (String(q.explanation || "").match(/句意[：:]\s*([^。；;]+)/) || [])[1] || "";
  let h = `<div class="cmp">
    <div class="cmp-row cmp-ok"><span class="cmp-tag">✅ 正确</span>
      <div class="cmp-body"><div class="cmp-en">${fillBlank(q.stem, right)}</div>
      ${zh ? `<div class="cmp-zh">${esc(zh)}</div>` : ""}</div></div>`;
  if (picked !== null && picked !== undefined && picked !== q.answer) {
    h += `<div class="cmp-row cmp-bad"><span class="cmp-tag">❌ 你选的</span>
      <div class="cmp-body"><div class="cmp-en">${fillBlank(q.stem, q.options[picked])}</div>
      ${notes && notes[picked] ? `<div class="cmp-why">${esc(String(notes[picked]).replace(/^错[：:]\s*/, ""))}</div>` : ""}</div></div>`;
  }
  return h + "</div>";
}

/* ②③④ 知识框架卡：公式色块 + 三步判断 + 口诀 + 易错 */
function frameCardHTML(q, opts) {
  const f = frameOf(q);
  if (!f) return "";
  opts = opts || {};
  const md = (window.FRAME_MODES || {})[f.mode] || {};
  const formula = (f.formula || []).map((b) =>
    `<span class="fm-blk ${b[2] === "hl" ? "fm-hl" : b[2] === "k" ? "fm-k" : ""}">
       <b>${esc(b[0])}</b>${b[1] ? `<i>${esc(b[1])}</i>` : ""}</span>`).join("");
  const steps = (f.steps || []).map((s) => `<li>${esc(s)}</li>`).join("");
  return `<div class="frame-card">
    <div class="fc-head"><span class="tag tag-ink">${esc(f.name)}</span>
      <span class="tag ${f.mode === "理解" ? "tag-green" : "tag-orange"}">${md.icon || ""} 该${esc(f.mode)}</span>
      ${opts.hideLevel ? "" : `<span class="tag">${esc(levelBadge(q).name)}</span>`}</div>
    ${formula ? `<div class="fm-row">${formula}</div>` : ""}
    ${steps ? `<div class="fc-sub">考场上怎么判断</div><ol class="fc-steps">${steps}</ol>` : ""}
    ${f.mnemonic ? `<div class="fc-mn">🔑 ${esc(f.mnemonic)}</div>` : ""}
    ${f.trap ? `<div class="fc-trap">⚠️ ${esc(f.trap)}</div>` : ""}
  </div>`;
}

/* 答题后的完整解析块：对照图 → 框架卡 → 句子拆解图 → 原文字解析（收起） */
function explainHTML(q, picked) {
  const wrong = picked !== null && picked !== undefined && picked !== q.answer;
  const viz = vizHTML(q);
  const text = q.explanation
    ? `<details class="acc acc-thin"${wrong ? "" : " open"}><summary>文字详解${wrong ? "（看完图还不懂再点）" : ""}</summary>
       <div class="explain">${esc(q.explanation)}</div></details>` : "";
  // 语法题给知识框架卡；阅读题给「题型 + 这类题该怎么做」
  const card = secOf(q) === "grammar" ? frameCardHTML(q)
    : secOf(q) === "reading" ? readingCardHTML(q) : "";
  return compareHTML(q, picked) + card + viz + text +
    (q.source ? `<p class="sub mt">出处：${esc(q.source)}</p>` : "");
}

/* 阅读题的解析卡：这是哪种题型、要不要花力气做、这类题的做法 */
const READ_HOW = {
  "细节题":     ["把题干里的关键词（人名、数字、专有名词）圈出来", "回原文找到这个词所在的那一句", "答案就在那句话里 —— 别自己推理，原文没说的都不选"],
  "词义猜测题": ["找到这个词在原文的那一句", "看它前后有没有 but / because / that is 这类提示", "把四个选项分别代回原句，读得通的那个就是"],
  "主旨题":     ["只读首段第一句和末段最后一句", "再扫每段的第一句", "选那个能盖住全文的，太细的和太大的都不对"],
  "推断题":     ["先做完所有细节题，剩时间再回来做", "答案必须由原文某句直接推出，不能靠常识", "拿不准就跳过 —— 这类不在目标分里"],
  "态度题":     ["找作者用的形容词（好词还是坏词）", "没找到就选中性的那个", "时间不够直接蒙，这类分不要"],
};
function readingCardHTML(q) {
  const t = readingType(q), p = READ_PRIORITY[t] || "必做";
  const how = READ_HOW[t] || [];
  return `<div class="frame-card">
    <div class="fc-head"><span class="tag tag-ink">${esc(t)}</span>
      <span class="tag ${p === "必做" ? "tag-green" : p === "可放弃" ? "tag-red" : ""}">${esc(p)}</span></div>
    ${how.length ? `<div class="fc-sub">这类题的做法</div><ol class="fc-steps">${how.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` : ""}
    <div class="fc-mn">🔑 答案一定在原文里找得到出处 —— 找不到出处的选项，再顺眼也别选</div>
  </div>`;
}

/* ============================================================== 句子拆解图 */
/* 把「打括号读法」画出来：整句(从句高亮) → 主干 → 括号补充，带中文。
   数据来自 core.js sentenceViz()：手工标注(q.viz)优先，定语从句自动生成。
   自动生成的没有逐行中文，就从讲解里抽「句意：…」当整句翻译。 */
function vizHTML(q) {
  const v = sentenceViz(q);
  if (!v) return "";
  const en = esc(v.en).replace(/\(([^)]+)\)/g, '<span class="vz-c">($1)</span>');
  const hasZh = (v.rows || []).some((r) => r[2]);
  const rows = (v.rows || []).map((r) =>
    `<div class="vz-row"><span class="vz-tag">${esc(r[0])}</span><span class="vz-body">${esc(r[1])}${r[2] ? `<i>${esc(r[2])}</i>` : ""}</span></div>`).join("");
  let whole = "";
  if (!hasZh) {
    const mzh = String(q.explanation || "").match(/句意[：:]\s*([^。；;]+)/);
    if (mzh) whole = `<div class="vz-row"><span class="vz-tag">整句</span><span class="vz-body"><i>${esc(mzh[1])}</i></span></div>`;
  }
  return `<div class="viz"><div class="vz-en">${en}</div>${rows}${whole}${v.note ? `<div class="vz-note">${esc(v.note)}</div>` : ""}</div>`;
}

/* ============================================================== 问AI·讲到我懂 */
/* 提速核心：答错的瞬间就在后台把讲解请求发出去（不等用户点按钮）。
   用户通常要花 5-15 秒读解析和选归因，等他点「问 AI」时，回复已经到了
   或至少已经在路上——感知延迟直接从"整个生成时长"降到"几乎为零"。
   PRE[qid] = { text, done, err, sub }；sub 是界面挂上来的回调。 */
const PRE = {};
function prefetchExplain(q, picked) {
  if (!hasApiKey() || PRE[q.id]) return;
  const c = (PRE[q.id] = { text: "", done: false, err: null, sub: null, picked: picked });
  callClaude({
    system: "你是成人高考专升本英语的私教，学生英语基础在 A2 左右。用简单中文讲，不用术语，讲清楚为什么答案是这个、他选的那个为什么不行。最多 200 字。",
    messages: [{ role: "user", content: `题目：${q.stem}\n选项：${q.options.map((o, i) => letter(i) + ". " + o).join("  ")}\n正确答案：${letter(q.answer)}\n我选了：${letter(picked)}\n请讲清楚。` }],
    maxTokens: 600, timeoutMs: 150000,
    onDelta: (t) => { c.text = t; if (c.sub) c.sub(); },
  }).then((t) => { c.text = t; c.done = true; if (c.sub) c.sub(); })
    .catch((e) => { c.err = e.message; c.done = true; if (c.sub) c.sub(); });
}

/* 不是一次性讲解，是挂在当前题下面的小对话：讲完出现输入框，没懂接着追问，
 * AI 每轮都带着这道题的完整上下文（题干/选项/正确答案/你选了什么/参考解析）。
 * 换题即清空（按 qid 判断）。 */
let ASK = null;   // { qid, msgs } 当前题的追问对话

function askSystem(q) {
  return `你是成人高考专升本英语私教，学生英语基础 A2 左右（新概念1 七八十课）。正在给他讲下面这道题，他没懂会连着追问，你要讲到他懂为止。
题目：${q.stem}
选项：${q.options.map((o, i) => letter(i) + ". " + o).join("  ")}
正确答案：${letter(q.answer)}${q.explanation ? "\n参考解析：" + q.explanation : ""}
规则：
- 简单中文，不用语法术语；每次回答 ≤150 字
- 他追问说明上一种讲法没讲通——换一个更接地气的讲法（举生活例子、把句子拆成小块），别把原话再说一遍
- 他若问到别的语法点，也直接教`;
}

function askBubble(who, text) {
  const log = $("#ask-log");
  if (!log) return null;
  const d = document.createElement("div");
  d.className = "ai-out";
  d.style.marginTop = "8px";
  d.innerHTML = `<b>${who}</b><br>${esc(text)}`;
  log.appendChild(d);
  return d;
}

function ensureAskBox(q, boxId) {
  const box = $("#" + (boxId || "after"));
  if (!box) return null;
  let wrap = box.querySelector("#ask-box");
  if (!wrap) {
    // 整篇模式一页里有好几道题，但 ASK 对话只有一个 —— 开新的就把旧的收掉，
    // 否则页面上会出现两个 id="ask-in"，追问会打到错的那道题上
    $$("#ask-box").forEach((old) => { if (!box.contains(old)) old.remove(); });
    wrap = document.createElement("div");
    wrap.id = "ask-box";
    wrap.innerHTML = `<div id="ask-log"></div>
      <div class="row mt">
        <input type="text" id="ask-in" placeholder="还是不懂就接着问，比如：为什么 B 不行？doing 是啥意思？" style="flex:1">
        <button class="btn btn-primary btn-sm" id="ask-send">追问</button>
      </div>`;
    box.appendChild(wrap);
    $("#ask-send").onclick = () => sendAsk(q);
    $("#ask-in").onkeydown = (e) => { if (e.key === "Enter") sendAsk(q); };
  }
  return wrap;
}

async function askAboutQuestion(qArg, qi) {
  // 整篇模式会传具体的题和题号（一页里好几道题，各自挂各自的对话框）
  const q = qArg || QUIZ.list[QUIZ.i];
  const boxId = qi === undefined ? "after" : "after-" + qi;
  if (!$("#" + boxId)) return;
  if (!ASK || ASK.qid !== q.id) ASK = { qid: q.id, msgs: [] };
  ensureAskBox(q, boxId);
  if (ASK.msgs.length) {                     // 已经在对话里了：再点按钮 = 提醒去输入框追问
    const inp = $("#ask-in"); if (inp) inp.focus();
    return;
  }
  const picked = qi === undefined ? QUIZ.picked : QUIZ.picks[q.id];
  const firstMsg = `我选了 ${letter(picked)}，正确答案是 ${letter(q.answer)}。讲清楚为什么是它，以及我选的那个错在哪。`;
  const pre = PRE[q.id];
  if (pre && !pre.err) {
    // 预取的回复已经在路上/已到：直接挂到气泡上，零等待
    const holder = askBubble("AI", "");
    if (holder) holder.innerHTML = `<b>AI</b><br><span data-stream></span>`;
    const sp = holder ? holder.querySelector("[data-stream]") : null;
    const paint = () => {
      if (sp) sp.textContent = pre.text || "正在讲…";
      if (pre.done && !pre.err) {
        ASK.msgs.push({ role: "user", content: firstMsg }, { role: "assistant", content: pre.text });
        pre.sub = null;
      }
      if (pre.done && pre.err && sp) sp.textContent = "❌ " + pre.err + "　在下面输入框再问一次即可";
    };
    pre.sub = paint;
    paint();
    return;
  }
  await sendAsk(q, firstMsg);
}

async function sendAsk(q, presetText) {
  const input = $("#ask-in");
  const text = presetText || (input ? input.value.trim() : "");
  if (!text) return;
  if (!presetText) { if (input) input.value = ""; askBubble("你", text); }
  ASK.msgs.push({ role: "user", content: text });
  const holder = askBubble("AI", "正在连接…");
  if (holder) holder.innerHTML = `<b>AI</b><br><span data-stream>正在连接…（连上后会一个字一个字出）</span>`;
  const hSpan = holder ? holder.querySelector("[data-stream]") : null;
  const btn = $("#q-ask");
  if (btn) { btn.disabled = true; btn.textContent = "🤖 正在讲…"; }
  const my = (sendAsk._t = (sendAsk._t || 0) + 1);
  try {
    // 只带最近 12 条，追问再多也不会越聊越贵
    const t = await callClaude({ system: askSystem(q), messages: ASK.msgs.slice(-12), maxTokens: 700, timeoutMs: 150000,
      onDelta: (part) => { if (sendAsk._t === my && hSpan) hSpan.textContent = part; } });
    if (sendAsk._t !== my) return;
    ASK.msgs.push({ role: "assistant", content: t });
    if (holder) holder.innerHTML = `<b>AI</b><br>${esc(t)}`;
  } catch (e) {
    if (sendAsk._t !== my) return;
    ASK.msgs.pop();                          // 失败回滚这条提问，避免带着孤儿消息
    if (holder) holder.innerHTML = `<b>AI</b><br>❌ ${esc(e.message)}　再发一次即可重试`;
  } finally {
    const b = $("#q-ask");
    if (b) { b.disabled = false; b.textContent = "🤖 问 AI：讲到我懂"; }
  }
}

function finishQuiz() {
  const n = QUIZ.answered.length || QUIZ.list.length, c = QUIZ.correct;
  const rate = Math.round((c / Math.max(1, n)) * 100);
  const mastered = QUIZ.mastery ? QUIZ.mastery.streak >= QUIZ.mastery.target : undefined;
  const back = QUIZ.opts.backTo || "home";
  const wrongs = QUIZ.answered.filter((a) => !a.ok);
  const fn = QUIZ.opts.onFinish;
  // 分数变化：单板块的组报该板块，跨板块的组（阶梯练习）报总分
  let move = "";
  {
    const single = QUIZ.sec ? SEC[QUIZ.sec] : null;
    const sample = single ? secSample(single.key) : 999;
    if (single && sample < SCORE_MIN_SAMPLE) {
      // 样本没到计分门槛：显示「还差几题开分」，别给一个泄气的 0 → 0 持平
      const need = SCORE_MIN_SAMPLE - sample;
      move = `<div class="scoremove up">
        <div><b>${esc(single.name)}</b> 再做 <b style="font-size:19px">${need}</b> 题就开始计分</div>
        <div class="sub">目前 ${sample} 题、正确率 ${Math.round((STATE.log.filter((r) => r.sec === single.key && r.ok).length / sample) * 100)}%。计分后目标是 ${single.target} 分（卷面 ${single.full}）</div>
      </div>`;
    } else {
      const before = QUIZ.before;
      const after = single ? secScore(single.key).score : totalScore();
      const target = single ? single.target : S.meta.target_score;
      const label = single ? single.name : "预估总分";
      const d = after - before, gap = target - after;
      const thin = single && sample < SCORE_STABLE;
      move = `<div class="scoremove ${d > 0 ? "up" : d < 0 ? "down" : ""}">
        <div><b>${esc(label)}</b> ${before} → <b style="font-size:19px">${after}</b> 分
          ${d !== 0 ? `<span class="delta">${d > 0 ? "▲ +" + d : "▼ " + d}</span>` : `<span class="delta">持平</span>`}</div>
        <div class="sub">目标 ${target} 分　${gap > 0 ? `还差 <b>${gap}</b> 分` : "已经到目标了，保持住"}${
          thin ? "　<span class=\"muted\">（这个板块才做了 " + sample + " 题，分数还不稳，多做几组才算数）</span>" : ""}</div>
        ${!single && QUIZ.secs.length > 1 ? `<div class="sub muted">这组混着 ${QUIZ.secs.map((k) => SEC[k].name).join(" / ")}，所以看的是总分</div>` : ""}
      </div>`;
    }
  }
  render(`<div class="card">
    <h1>${mastered === undefined ? "这组做完了" : mastered ? "🎉 连对 " + QUIZ.mastery.target + " 题——过了" : "还差一点，明天这课再来一遍"}</h1>
    ${mastered === false ? `<p class="sub">做了 ${n} 题还没连出 ${QUIZ.mastery.target} 连对——说明这个套路还没长在脑子里，正常，明天重讲重练一遍。错的题都进回炉队列了。</p>` : ""}
    <div class="hero-nums" style="color:var(--text)">
      <div class="hero-num"><b>${c} / ${n}</b><span>做对</span></div>
      <div class="hero-num"><b>${rate}%</b><span>正确率</span></div>
      ${QUIZ.mastery ? `<div class="hero-num"><b>${QUIZ.mastery.streak}</b><span>最终连对</span></div>` : ""}
    </div>
    ${move}
    <p class="sub mt">${rate >= 70 ? "这个正确率放到考场是够用的，保持。" : rate >= 50 ? "过得去。错的那几道明天会自动再来一遍，看不懂的点「读懂这道题」把生词记下。" : "先别急着下一组——错的多半是词不认识。错题明天会自动回炉，回炉前把「读懂这道题」里的生词过一遍。"}</p>
    ${wrongs.length ? `<p class="sub mt">错了 ${wrongs.length} 道，已进错题本。</p>` : ""}
    <div class="qbar">
      <button class="btn btn-primary" id="f-back">回「${esc({ today: "今天", home: "记分牌", basics: "地基阶梯", grammar: "语法页", reading: "阅读页", dialogue: "对话页", cloze: "完形页", wrong: "错题本", real: "真题", colloc: "搭配", writing: "写作", mock: "模考", course: "学习路线" }[back] || "上一页")}」</button>
      ${wrongs.length ? `<button class="btn" id="f-wrong">看错题本（${wrongs.length}）</button>` : ""}
      ${QUIZ.opts.again ? `<button class="btn" id="f-again">再来一组</button>` : ""}
    </div>
  </div>`);
  $("#f-back").onclick = () => { QUIZ = null; go(back); };
  if ($("#f-wrong")) $("#f-wrong").onclick = () => { QUIZ = null; go("wrong"); };
  if ($("#f-again")) $("#f-again").onclick = () => { const again = QUIZ.opts.again; QUIZ = null; again(); };
  if (fn) fn(c / Math.max(1, n), c, n, mastered);
}

/* ============================================================== 划词词典卡 */
/* 交互约定：
 *   - 双击一个词、或拖选一个 1~3 词的短语 → 右下角弹词典卡（不跟鼠标跑，不挡正文）
 *   - 已经收过的词直接显示本地释义，不再花钱调 AI
 *   - 点卡片外面 / 按 Esc / 点 × 都能关；卡片开着时可以继续读、继续选下一个词
 */
let LK = null;

function bindLookup() {
  document.removeEventListener("dblclick", onDbl);
  document.removeEventListener("mouseup", onSelUp);
  document.addEventListener("dblclick", onDbl);
  document.addEventListener("mouseup", onSelUp);
}
function selectedTerm() {
  const s = String(window.getSelection()).trim().replace(/\s+/g, " ");
  if (!/^[A-Za-z][A-Za-z'’\- ]*$/.test(s)) return null;      // 必须是纯英文
  if (s.length < 2 || s.length > 42) return null;
  if (s.split(" ").length > 3) return null;                  // 最多 3 个词（短语搭配也常要查）
  return s.replace(/[^A-Za-z'’\- ]/g, "");
}
function onDbl() { const t = selectedTerm(); if (t) showLookup(t); }
function onSelUp(e) {
  if (LK && LK.contains(e.target)) return;                   // 在卡片里拖选文字不算查词
  const t = selectedTerm();
  if (t && t.indexOf(" ") > 0) showLookup(t);                // 拖选短语才触发；单个词交给双击，避免误弹
}

/* 只查、只读，不收藏、不进复习队列 —— 这个 App 不做背单词。
   查完就关，词记不记得住交给你自己在别处解决。 */
const LK_CACHE = {};
function showLookup(word) {
  closeLookup();
  const key = word.toLowerCase();
  const d = document.createElement("div");
  d.className = "lk";
  d.innerHTML = `
    <div class="lk-head">
      <div class="lk-word">${esc(word)}</div>
      <button class="lk-say" data-spk title="朗读">🔊</button>
      <button class="lk-x" data-close title="关闭（Esc）">×</button>
    </div>
    <div class="lk-body" id="lk-body"></div>`;
  document.body.appendChild(d);
  LK = d;
  const body = $("#lk-body", d);
  $("[data-spk]", d).onclick = () => speak(word);
  $("[data-close]", d).onclick = closeLookup;
  setTimeout(() => {
    document.addEventListener("mousedown", outsideClose);
    document.addEventListener("keydown", escClose);
  }, 0);

  const cached = LK_CACHE[key] || (STATE.dict && STATE.dict[key]);
  if (cached) { body.textContent = cached; return; }   // 查过的词直接出，不花钱
  if (!hasApiKey()) {
    body.innerHTML = `<span class="muted">查释义需要 AI，去【设置】填一个 API Key 就能用。</span>`;
    return;
  }
  body.innerHTML = `<div class="lk-skel"><span></span><span></span></div>`;
  // ⚠️ 词典指令必须写进 user 消息里，不能只放 system：
  //    第三方中转对某些模型会丢掉 system，光发一个单词过去，模型会回
  //    “你的消息好像不完整”（用户截图撞到过）。
  callClaude({
    system: "你是英汉词典。",
    messages: [{ role: "user", content: `查词典：解释英文单词或短语「${word}」的中文意思。只回一行，格式：词性缩写. 中文释义（最多两个常用义项，用；分隔）。不要音标、不要例句、不要任何多余的话。` }],
    maxTokens: 120,
    onDelta: (t) => { if (LK === d) body.textContent = t; },   // 流式：出一个字显示一个字
  }).then((t) => {
    LK_CACHE[key] = t;
    if (STATE.dict) { STATE.dict[key] = t; saveState(); }
    if (LK !== d) return;
    body.textContent = t;
  }).catch((e) => {
    if (LK !== d) return;
    body.innerHTML = `<span class="lk-err">查不到：${esc(e.message)}</span>`;
  });
}

function closeLookup() {
  if (LK) LK.remove();
  LK = null;
  document.removeEventListener("mousedown", outsideClose);
  document.removeEventListener("keydown", escClose);
}
/* ⚠️ 这两个监听器必须在 closeLookup 里成对摘掉。
   老写法用「只触发一次」的监听器：点在卡片里面也会把监听器摘掉，
   之后再点外面就关不掉了。 */
function outsideClose(e) { if (LK && !LK.contains(e.target)) closeLookup(); }
function escClose(e) { if (e.key === "Escape") closeLookup(); }

/* ============================================================== 语法 7 考点 */
ROUTES.grammar = function () {
  const inScope = grammarInScope(), outScope = grammarOutScope();
  let acc = "";
  S.grammar.points.forEach((p) => {
    const qs = questionsOfPoint(p.id);
    const done = qs.filter((q) => STATE.answers[q.id]).length;
    let coll = "";
    if (p.fixed_collocations) {
      Object.keys(p.fixed_collocations).forEach((k) => {
        const label = k === "both_diff_meaning" ? "两种都行但意思不同" : k;
        coll += `<div class="mb"><div class="sub">${esc(label)}</div>
          <div class="chips">${p.fixed_collocations[k].map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div></div>`;
      });
    }
    acc += `<details class="acc"><summary>考点 ${p.id}　${esc(p.name)}
      <span class="spacer"></span><span class="tag">${qs.length} 题 · 练过 ${done}</span></summary>
      <div>
        <p style="font-size:15px"><b>一句话规则：</b>${esc(p.rule)}</p>
        <h3 class="mt">考场怎么判</h3>
        <ol class="steps">${p.decision_steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
        ${p.extra_rules ? `<h3 class="mt">补充规则</h3><ul style="padding-left:18px;font-size:14px">${p.extra_rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        ${p.negative_words ? `<h3 class="mt">这些词放句首要倒装</h3><div class="chips">${p.negative_words.map((w) => `<span class="chip">${esc(w)}</span>`).join("")}</div>` : ""}
        ${coll ? `<h3 class="mt">固定搭配</h3>${coll}` : ""}
        <div class="trapbox"><b>坑：</b>${esc(p.trap)}</div>
        <h3>例子</h3>
        ${p.examples.map((e) => `<div class="eg"><div class="en">${esc(e.en)}</div>
          <div><span class="ans">${esc(e.answer)}</span> <span class="why">— ${esc(e.why)}</span></div></div>`).join("")}
        <div class="qbar"><button class="btn btn-orange" data-point="${p.id}" ${qs.length ? "" : "disabled"}>练这个考点（${Math.min(15, qs.length)} 题）</button></div>
      </div></details>`;
  });

  render(`
  ${secHead("grammar", `<div class="warnbox mt">${esc(S.grammar.scope_note)}<br>
     题库里在这 7 个考点范围内的有 <b>${inScope.length}</b> 题；另有 ${outScope.length} 题属于超纲考点，默认不练。</div>`)}
  <div class="card"><h2>7 大考点</h2>${acc}</div>
  <div class="card">
    <div class="row"><h2>固定搭配 / 词义辨析</h2><span class="tag tag-red">真题占 29%</span></div>
    <p class="sub mb">这一块<b>不在策略的 7 大考点里</b>，是我查真题查出来的：88 道真题里 65 道语法题，
      固定搭配 10 道 + 近义词辨析 9 道 = <b>19 道</b>，占语法题的 29%。7 大考点只覆盖其中 49%，
      光靠它们摸不到 15 分里的 9 分目标。<br>
      这类题背规则没用，只能一条一条记：<code>come to an agreement</code>、<code>patient with</code>、
      <code>break in</code>、<code>pocket money</code>。</p>
    <div class="row">
      <button class="btn btn-orange" id="g-colloc">练搭配 / 辨析 12 题</button>
      <button class="btn" id="g-colloc-real">只练真题里出现过的（${BANK.filter((q) => q.real && (q.topic === "collocation" || q.topic === "word-choice")).length} 题）</button>
    </div>
  </div>

  <div class="card">
    <h2>混合练</h2>
    <p class="sub mb">从 7 个考点里随机抽 15 题，接近真卷的出题方式。</p>
    <div class="row">
      <button class="btn btn-primary" id="g-mix">混合练 15 题</button>
      <button class="btn" id="g-wrongonly">只练我错过的</button>
    </div>
  </div>
  <details class="acc"><summary>超纲题（${outScope.length} 题）—— 只用来练排除法</summary><div>
    <p class="sub">策略明确说了：这 7 个考点之外的不学。真要练，就当作「读不懂也要用排除法蒙一个」的训练，别指望背会。</p>
    <div class="qbar"><button class="btn" id="g-out">练排除法 10 题</button></div>
  </div></details>`);

  $$("[data-point]").forEach((b) => (b.onclick = () => {
    const pid = +b.dataset.point;
    const list = orderForPractice(byDifficulty(questionsOfPoint(pid))).slice(0, 15);
    startQuiz(list, { title: "考点" + pid + " " + pointById(pid).name, backTo: "grammar", again: () => ROUTES.grammar() });
  }));
  const collocPool = BY_SEC.grammar.filter((q) => q.topic === "collocation" || q.topic === "word-choice");
  $("#g-colloc").onclick = () => startQuiz(orderForPractice(byDifficulty(collocPool)).slice(0, 12), { title: "固定搭配 / 词义辨析", backTo: "grammar", again: () => ROUTES.grammar() });
  $("#g-colloc-real").onclick = () => startQuiz(orderForPractice(collocPool.filter((q) => q.real)), { title: "真题 · 搭配 / 辨析", backTo: "grammar" });
  $("#g-mix").onclick = () => startQuiz(orderForPractice(byDifficulty(inScope)).slice(0, 15), { title: "语法混合练", backTo: "grammar" });
  $("#g-wrongonly").onclick = () => {
    const list = inScope.filter((q) => STATE.wrong[q.id]);
    if (!list.length) return toast("还没有错过的语法题");
    startQuiz(shuffle(list).slice(0, 15), { title: "语法错题重做", backTo: "grammar" });
  };
  $("#g-out").onclick = () => startQuiz(pick(outScope, 10), { title: "超纲题 · 排除法", backTo: "grammar" });
};

/* ============================================================== 地基阶梯 */
/* 为什么要这一页：你现在的水平（新概念1 前 80 课）和真题之间隔着一整个台阶。
   真题考非谓语、定语从句、虚拟语气；而你还在一般过去时。
   直接上真题＝一道都做不对＝没有任何正反馈。所以按 level 分三级，一级一级过。 */
ROUTES.basics = function () {
  const cur = currentLevel();
  const rows = LEVELS.map((L) => {
    const st = levelStat(L.n);
    const pct = st.acc === null ? 0 : Math.round(st.acc * 100);
    return `<div class="task ${st.passed ? "done" : ""}">
      <button class="task-check" ${st.passed ? "" : 'style="background:transparent;color:var(--text-2)"'}>${st.passed ? "✓" : L.n}</button>
      <div class="task-main">
        <div class="task-title">第 ${L.n} 级 · ${esc(L.name)}
          ${L.n === cur ? '<span class="tag tag-orange">现在练这级</span>' : ""}
          ${st.passed ? '<span class="tag tag-green">已过</span>' : ""}</div>
        <div class="task-why">${esc(L.desc)}　共 ${st.total} 题，做过 ${st.done} 题${st.tried ? "，正确率 " + pct + "%" : ""}</div>
        <div class="np-bar" style="margin-top:6px"><i class="${st.passed ? "ok" : ""}" style="width:${pct}%"></i></div>
      </div>
      <div class="task-min">${Math.min(st.tried, 99)}/15</div>
      <button class="btn btn-sm ${L.n === cur ? "btn-primary" : ""}" data-lv="${L.n}">练 10 题</button>
    </div>`;
  }).join("");

  render(`
  <div class="card">
    <h1>地基阶梯</h1>
    <p class="sub">真题考的是非谓语、定语从句、虚拟语气；新概念 1 学到七八十课的水平离那儿还有距离。
      硬上真题的结果是一道都做不对，那不叫训练，那叫劝退。所以按难度分四级，<b>过一级再上一级</b>。</p>
    <p class="sub mt">其中<b>第 2 级「搭桥」</b>是专门造的台阶：把 7 大考点各自削到最简单的形态——
      句子里没有生词，每道题只考一个套路，讲解按零基础写。在这一级把套路认熟，第 3、4 级才有得打。</p>
    <p class="sub mt">过级标准：该级做够 15 题、正确率 ≥ 80%，自动放行下一级，不用自己判断。
      每天「今天」页的阶梯练习就是从当前级出题的。（阅读/完形不在阶梯里，它们有自己的页面和做题步骤。）</p>
  </div>
  <div class="tasks">${rows}</div>
  <div class="card">
    <h2>每一级长什么样</h2>
    <table class="tbl"><thead><tr><th>级别</th><th>题量</th><th>典型题</th></tr></thead><tbody>
      ${LEVELS.map((L) => {
        const eg = levelPool(L.n).filter((q) => q.module === "grammar")[0];
        return `<tr><td><b>${L.n} · ${esc(L.name)}</b></td><td class="num">${levelPool(L.n).length}</td>
          <td>${eg ? esc(eg.stem) + " → <b>" + esc(eg.options[eg.answer]) + "</b>" : "—"}</td></tr>`;
      }).join("")}
    </tbody></table>
  </div>`);
  $$("[data-lv]").forEach((btn) => (btn.onclick = () => {
    const n = +btn.dataset.lv;
    startQuiz(orderForPractice(levelPool(n)).slice(0, 10), { title: "第 " + n + " 级 · " + LEVELS[n - 1].name, backTo: "basics", again: () => ROUTES.basics() });
  }));
};

/* ============================================================== 阅读 */
ROUTES.reading = function () {
  const groups = groupByPassage(BY_SEC.reading);
  const byType = {};
  BY_SEC.reading.forEach((q) => { const t = readingType(q); byType[t] = (byType[t] || 0) + 1; });

  let prio = "";
  Object.keys(C.reading_priority).forEach((k) => {
    C.reading_priority[k].forEach((t) => {
      prio += `<tr><td><span class="tag ${k === "必做" ? "tag-green" : k === "可放弃" ? "tag-red" : ""}">${k}</span></td>
        <td><b>${esc(t)}</b></td><td class="muted">题库里 ${byType[t] || 0} 题</td></tr>`;
    });
  });

  let gl = "";
  groups.forEach((g, i) => {
    const done = g.qs.filter((q) => STATE.answers[q.id]).length;
    const first = (g.passage || "").replace(/\s+/g, " ").slice(0, 70);
    gl += `<div class="phrase"><div style="flex:1">
      <div class="en">第 ${i + 1} 篇 · ${g.qs.length} 题　${done === g.qs.length ? '<span class="tag tag-green">做完</span>' : done ? `<span class="tag">做了 ${done}</span>` : ""}</div>
      <div class="use">${esc(first)}…</div></div>
      <button class="btn btn-sm" data-grp="${i}">做这篇</button></div>`;
  });

  render(`
  ${secHead("reading", `<p class="sub mt">目标正确率 <b>${Math.round(C.reading_target_rate * 100)}%</b>（20 题对 12 道 = 36 分）。
    注意：36 分不需要每题都会 —— 放弃推断题和态度题之后，剩下的题只要稳住就够了。</p>`)}

  <div class="card">
    <h2>做题步骤（就按这个顺序，别通读全文）</h2>
    <ol class="steps">${S.reading.method.map((m) => `<li>${esc(m)}</li>`).join("")}</ol>
  </div>

  <div class="card">
    <h2>题型优先级</h2>
    <table class="tbl"><tbody>${prio}</tbody></table>
    <p class="sub mt">推断题和态度题<b>不做专项训练</b>——它们最难、分值又不在目标分里。考场上时间不够就直接蒙。</p>
  </div>

  <div class="card">
    <h2>选项里的 5 种套路（错了要能对上号）</h2>
    <table class="tbl"><thead><tr><th>套路</th><th>长什么样</th></tr></thead><tbody>
      ${S.reading.trap_patterns.map((t) => `<tr><td><b>${esc(t.name)}</b></td><td>${esc(t.desc)}</td></tr>`).join("")}
    </tbody></table>
  </div>

  <div class="card">
    <h2>练习</h2>
    <div class="row mb">
      <button class="btn btn-primary" id="r-must">只练必做题型（细节 + 词义猜测）</button>
      <button class="btn" id="r-all">整篇按真卷做</button>
      <button class="btn" id="r-wrong">重做错题</button>
    </div>
    <p class="sub">题库共 ${BY_SEC.reading.length} 题 / ${groups.length} 篇。</p>
  </div>

  <div class="card"><h2>按篇选</h2>${gl || '<div class="empty">题库里还没有阅读短文</div>'}</div>`);

  $$("[data-grp]").forEach((b) => (b.onclick = () => {
    const g = groups[+b.dataset.grp];
    startQuiz(g.qs, { title: "阅读 · 整篇", backTo: "reading" });
  }));
  $("#r-must").onclick = () => {
    const list = BY_SEC.reading.filter((q) => (READ_PRIORITY[readingType(q)] || "必做") === "必做");
    startQuiz(orderForPractice(list).slice(0, 12), { title: "阅读 · 必做题型", backTo: "reading" });
  };
  $("#r-all").onclick = () => {
    const g = groups[Math.floor(Math.random() * groups.length)];
    startQuiz(g.qs, { title: "阅读 · 整篇", backTo: "reading" });
  };
  $("#r-wrong").onclick = () => {
    const list = BY_SEC.reading.filter((q) => STATE.wrong[q.id]);
    if (!list.length) return toast("还没有错过的阅读题");
    startQuiz(shuffle(list).slice(0, 12), { title: "阅读错题重做", backTo: "reading" });
  };
};

/* ============================================================== 补全对话 */
ROUTES.dialogue = function () {
  let scenes = "";
  S.dialogue.scenes.forEach((sc) => {
    scenes += `<details class="acc"><summary>${esc(sc.name)}<span class="spacer"></span><span class="tag">${sc.phrases.length} 句</span></summary><div>
      ${sc.phrases.map((p) => `<div class="phrase">
        <button class="spk" data-say="${esc(p.en)}">🔊</button>
        <div style="flex:1"><div class="en">${esc(p.en)}</div>
          <div class="cn">${esc(p.cn)}</div><div class="use">用在：${esc(p.usage)}</div></div></div>`).join("")}
      <div class="qbar"><button class="btn btn-sm" data-readall="${esc(sc.id)}">连读整组</button></div>
    </div></details>`;
  });

  render(`
  ${secHead("dialogue", `<p class="sub mt">${esc(S.dialogue.note)}</p>`)}

  <div class="card">
    <h2>四条判定规则（先定句型，再挑选项）</h2>
    <table class="tbl"><thead><tr><th>看空格后面</th><th>就填</th></tr></thead><tbody>
      ${S.dialogue.cue_rules.map((r) => `<tr><td>${esc(r.trigger)}</td><td><b>${esc(r.fill)}</b></td></tr>`).join("")}
    </tbody></table>
    <p class="sub mt">顺序不能颠倒：<b>先看空格后面那句</b>，它决定了空里该是疑问句还是陈述句；确定句型后再从选项里挑，一下就能排掉两个。</p>
  </div>

  <div class="card"><h2>六大场景固定句</h2>
    <p class="sub mb">这些句子是死的，背下来就有分。点 🔊 跟读。</p>${scenes}</div>

  <div class="card">
    <h2>练习</h2>
    <div class="row">
      <button class="btn btn-primary" id="d-quiz">做 10 题</button>
      <button class="btn" id="d-wrong">重做错题</button>
      <button class="btn" id="d-ai">🤖 AI 陪练一段对话</button>
    </div>
    <p class="sub mt">题库共 ${BY_SEC.dialogue.length} 题。</p>
    <div id="d-chat"></div>
  </div>`);

  $$("[data-say]").forEach((b) => (b.onclick = () => speak(b.dataset.say)));
  $$("[data-readall]").forEach((b) => (b.onclick = () => {
    const sc = S.dialogue.scenes.find((x) => x.id === b.dataset.readall);
    speak(sc.phrases.map((p) => p.en.split(" / ")[0]).join(". "));
  }));
  $("#d-quiz").onclick = () => startQuiz(orderForPractice(BY_SEC.dialogue).slice(0, 10), { title: "补全对话", backTo: "dialogue" });
  $("#d-wrong").onclick = () => {
    const list = BY_SEC.dialogue.filter((q) => STATE.wrong[q.id]);
    if (!list.length) return toast("还没有错过的对话题");
    startQuiz(shuffle(list), { title: "对话错题重做", backTo: "dialogue" });
  };
  $("#d-ai").onclick = startDialoguePractice;
};

let DCHAT = [];
function startDialoguePractice() {
  const scene = S.dialogue.scenes[Math.floor(Math.random() * S.dialogue.scenes.length)];
  DCHAT = [];
  $("#d-chat").innerHTML = `<div class="card-tight card mt"><b>场景：${esc(scene.name)}</b>
    <div class="sub">用这个场景里的固定句跟 AI 对话。它会先开口，你回一句，它会指出更地道的说法。</div>
    <div id="dc-log" class="mt"></div>
    <div class="row mt"><input type="text" id="dc-in" placeholder="用英文回一句…"><button class="btn btn-primary" id="dc-send">发送</button></div></div>`;
  const log = $("#dc-log");
  const push = (who, text) => {
    const d = document.createElement("div");
    d.className = "ai-out"; d.style.marginTop = "8px";
    d.innerHTML = `<b>${who}</b><br>${esc(text)}`;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  };
  const sys = `你在陪一个中国成人高考考生练英语【${scene.name}】情景对话。规则：
1. 每次只说一到两句英文，用小学到初中难度的简单句。
2. 学生回完之后，先用一句英文自然接话，再另起一行用中文给一句极简点评（他哪里说得好/该换成哪个固定说法）。
3. 优先引导他用这些固定句：${scene.phrases.map((p) => p.en).join(" | ")}`;
  const send = async (text) => {
    if (text) { push("你", text); DCHAT.push({ role: "user", content: text }); }
    const holder = document.createElement("div");
    holder.className = "ai-out"; holder.style.marginTop = "8px"; holder.textContent = "…";
    log.appendChild(holder);
    try {
      const t = await callClaude({ system: sys, messages: DCHAT.length ? DCHAT : [{ role: "user", content: "Start the conversation." }], maxTokens: 400 });
      holder.remove(); push("AI", t); DCHAT.push({ role: "assistant", content: t });
    } catch (e) { holder.textContent = "❌ " + e.message; }
  };
  $("#dc-send").onclick = () => { const v = $("#dc-in").value.trim(); if (!v) return; $("#dc-in").value = ""; send(v); };
  $("#dc-in").onkeydown = (e) => { if (e.key === "Enter") $("#dc-send").click(); };
  send("");
}

/* ============================================================== 完形 */
ROUTES.cloze = function () {
  const groups = groupByPassage(BY_SEC.cloze);
  render(`
  ${secHead("cloze", `<div class="warnbox mt">策略是<b>不做专项训练</b>：完形 30 分里目标只要 12 分，靠语法和词汇的溢出就够。
    这一页只有两张表要背 —— 逻辑连接词表和空格类型表。</div>`)}

  <div class="card">
    <h2>表一：逻辑连接词（可迁移性最高，必须背熟）</h2>
    <table class="tbl"><thead><tr><th>关系</th><th>中文</th><th>英文</th></tr></thead><tbody>
      ${S.cloze.logic_words.map((w) => `<tr><td><b>${esc(w.relation)}</b></td><td>${esc(w.cn)}</td><td class="chip" style="border:0;background:transparent">${esc(w.en)}</td></tr>`).join("")}
    </tbody></table>
    <div class="qbar"><button class="btn btn-sm" id="c-logic">考我连接词</button></div>
    <div id="logic-drill"></div>
  </div>

  <div class="card">
    <h2>表二：空格类型 —— 决定这题值不值得花时间</h2>
    <table class="tbl"><thead><tr><th>类型</th><th>深挖还是略过</th><th>说明</th></tr></thead><tbody>
      ${S.cloze.blank_types.map((b) => `<tr><td><b>${esc(b.name)}</b></td>
        <td>${b.depth === "FULL" ? '<span class="tag tag-green">吃透</span>' : '<span class="tag">看答案就行</span>'}</td>
        <td class="muted">${esc(b.note)}</td></tr>`).join("")}
    </tbody></table>
  </div>

  <div class="card">
    <h2>练习</h2>
    <p class="sub mb">题库共 ${BY_SEC.cloze.length} 题 / ${groups.length} 篇。做完形只做一件事：把逻辑词的空挑出来做对。</p>
    <div class="row"><button class="btn btn-primary" id="cz-go">做一篇</button>
      <button class="btn" id="cz-wrong">重做错题</button></div>
  </div>`);

  $("#c-logic").onclick = logicDrill;
  $("#cz-go").onclick = () => {
    if (!groups.length) return toast("题库里还没有完形短文");
    const g = groups[Math.floor(Math.random() * groups.length)];
    startQuiz(g.qs, { title: "完形填空", backTo: "cloze" });
  };
  $("#cz-wrong").onclick = () => {
    const list = BY_SEC.cloze.filter((q) => STATE.wrong[q.id]);
    if (!list.length) return toast("还没有错过的完形题");
    startQuiz(shuffle(list), { title: "完形错题重做", backTo: "cloze" });
  };
};

/* 连接词速测：给关系猜词（纯本地，不调 AI，也不算进分数） */
function logicDrill() {
  const pool = shuffle(S.cloze.logic_words);
  let i = 0, right = 0;
  const step = () => {
    const box = $("#logic-drill");     // 每次重新取：切页后它就没了，直接收工
    if (!box) return;
    if (i >= pool.length) {
      box.innerHTML = `<div class="explain mt">背完一轮：${right} / ${pool.length} 对。<button class="btn btn-sm mt" id="ld-again">再来</button></div>`;
      $("#ld-again").onclick = logicDrill; return;
    }
    const cur = pool[i];
    const opts = shuffle([cur].concat(pick(S.cloze.logic_words.filter((w) => w !== cur), 3)));
    box.innerHTML = `<div class="explain mt"><h4>${i + 1} / ${pool.length}　表示「${esc(cur.relation)}（${esc(cur.cn)}）」的是：</h4>
      <div class="opts mt">${opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.en)}</button>`).join("")}</div></div>`;
    $$("#logic-drill .opt").forEach((b) => (b.onclick = () => {
      const ok = opts[+b.dataset.k] === cur;
      if (ok) right++;
      b.classList.add(ok ? "right" : "wrong");
      setTimeout(() => { i++; step(); }, ok ? 350 : 1200);
    }));
  };
  step();
}

/* ============================================================== 写作 */
ROUTES.writing = function (tab) {
  tab = tab || "template";
  render(`
  ${secHead("writing", `<p class="sub mt"><b>评分看什么：</b>${esc(S.writing.scoring_basis)}　词数 ${S.writing.word_range[0]}–${S.writing.word_range[1]}。</p>`)}
  <div class="tabs">
    <button class="tab ${tab === "template" ? "active" : ""}" data-tab="template">三大模板</button>
    <button class="tab ${tab === "write" ? "active" : ""}" data-tab="write">计时写一篇</button>
    <button class="tab ${tab === "check" ? "active" : ""}" data-tab="check">五类低级错误</button>
  </div>
  <div id="w-body"></div>`);
  $$("[data-tab]").forEach((b) => (b.onclick = () => ROUTES.writing(b.dataset.tab)));
  ({ template: wTemplates, write: wWrite, check: wCheck })[tab || "template"]();
};

/* 占位符的中文提示（2026-09-15 信纸版）。骨架里 {{key}} 对零基础用户是英文变量名，看不懂，这里翻成人话。 */
const SLOT_ZH = {
  recipient: "收信人", purpose: "写信目的", background_sentence: "背景一句", point1: "要点一", point2: "要点二", point3: "要点三",
  request: "请对方做什么", topic: "话题", view_a: "一方观点", my_view: "我的看法", reason1: "理由一", reason2: "理由二", reason3: "理由三",
  topic_short: "话题简称", action: "该怎么做", aim: "活动目的", organizer: "组织方", event: "活动名", place: "地点", time: "时间",
  audience: "参加对象", preparation: "要做的准备", deadline: "截止时间", duration: "持续多久", contact: "联系人", signature: "落款", date: "日期",
};
function slotZh(k) { return SLOT_ZH[k] || k.replace(/_/g, " "); }

/* 把骨架文本排成一封信：按空行分段；一行前面空格 ≥40 = 落款（右对齐），≥20 = 标题（居中），1-39 = 正文首行缩进，0 = 顶格（Dear …）。
   fill(k) 决定占位符怎么渲染；不传就渲染成带中文提示的填空块。 */
function letterHTML(sk, fill) {
  fill = fill || ((k) => `<span class="fill" data-slot="${esc(k)}" title="${esc(k)}">${esc(slotZh(k))}</span>`);
  const paras = sk.split(/\n\s*\n/);
  return `<div class="letter">${paras.map((para) => para.split("\n").filter((l) => l.trim()).map((line) => {
    const lead = line.match(/^ */)[0].length;
    const cls = lead >= 40 ? "right" : lead >= 20 ? "center" : lead > 0 ? "indent" : "";
    const html = esc(line.trim()).replace(/\{\{(\w+)\}\}/g, (m, k) => fill(k));
    return `<p class="${cls}">${html}</p>`;
  }).join("")).join("")}</div>`;
}
/* 旧接口留着：别处若还用 skeletonHTML（等宽块），照旧出可读文本 */
function skeletonHTML(sk) {
  return esc(sk).replace(/\{\{(\w+)\}\}/g, (m, k) => `<span class="slot">${esc(slotZh(k))}</span>`);
}

function wTemplates() {
  let out = "";
  S.writing.templates.forEach((t) => {
    const slots = Object.keys(t.slots || {});
    out += `<div class="card" id="tplcard-${t.id}">
      <div class="tpl-head"><h2>${esc(t.name)}</h2><span class="tag tag-ink">约 ${t.estimated_words} 词</span></div>
      <div class="tpl-covers"><span class="muted" style="border:0;background:none;padding-left:0">能套：</span>${t.covers.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
      ${letterHTML(t.skeleton)}
      ${slots.length ? `<div class="slotbank"><h3>橙色格子里填什么<small>点一个短语，直接填进上面的信里</small></h3>
        ${slots.map((k) => `<div class="sb-row"><div class="sb-key"><b>${esc(slotZh(k))}</b><small>${esc(k)}</small></div>
          <div class="sb-opts">${t.slots[k].map((v) => `<button class="sb-opt" data-tpl="${t.id}" data-key="${esc(k)}" data-val="${esc(v)}">${esc(v)}</button>`).join("")}</div></div>`).join("")}</div>` : ""}
      <div class="qbar"><button class="btn btn-sm" data-fill="${t.id}">随机生成一篇完整范文</button>
        <button class="btn btn-sm btn-ghost" data-reset="${t.id}">清空填入</button>
        <button class="btn btn-sm btn-ghost" data-copy="${t.id}">复制骨架</button>
        <button class="btn btn-sm btn-ghost" data-spk2="${t.id}">🔊 朗读</button></div>
      <div id="fill-${t.id}"></div></div>`;
  });
  out += `<div class="card"><h2>词汇升级表（写的时候顺手换掉）</h2>
    <table class="tbl"><thead><tr><th>别用</th><th>换成</th><th>别用</th><th>换成</th></tr></thead><tbody>${
      S.writing.upgrades.reduce((acc, u, i, arr) => {
        if (i % 2) return acc;
        const b = arr[i + 1];
        return acc + `<tr><td class="muted">${esc(u.from)}</td><td><b>${esc(u.to)}</b></td>
          <td class="muted">${b ? esc(b.from) : ""}</td><td>${b ? "<b>" + esc(b.to) + "</b>" : ""}</td></tr>`;
      }, "")}</tbody></table>
    <p class="sub mt">提醒：${esc(S.writing.scoring_basis)}所以先保证不出低级错误，再谈换高级词。</p></div>`;
  $("#w-body").innerHTML = out;

  // 点词库短语 → 填进信里对应的格子（同一格再点别的会替换；同一短语再点一次撤回）
  $$(".sb-opt").forEach((b) => (b.onclick = () => {
    const card = $("#tplcard-" + b.dataset.tpl);
    const cell = card.querySelector(`.letter .fill[data-slot="${b.dataset.key}"]`);
    if (!cell) return;
    const on = b.classList.contains("on");
    card.querySelectorAll(`.sb-opt[data-key="${b.dataset.key}"]`).forEach((x) => x.classList.remove("on"));
    if (on) { cell.textContent = slotZh(b.dataset.key); cell.classList.remove("done"); }
    else { b.classList.add("on"); cell.textContent = b.dataset.val; cell.classList.add("done"); }
    cell.classList.add("hot"); setTimeout(() => cell.classList.remove("hot"), 700);
  }));
  $$("[data-reset]").forEach((b) => (b.onclick = () => {
    const card = $("#tplcard-" + b.dataset.reset);
    card.querySelectorAll(".letter .fill").forEach((c) => { c.textContent = slotZh(c.dataset.slot); c.classList.remove("done"); });
    card.querySelectorAll(".sb-opt.on").forEach((x) => x.classList.remove("on"));
    $("#fill-" + b.dataset.reset).innerHTML = "";
  }));
  $$("[data-fill]").forEach((b) => (b.onclick = () => {
    const t = S.writing.templates.find((x) => x.id === b.dataset.fill);
    let plain = t.skeleton.replace(/\{\{(\w+)\}\}/g, (m, k) => {
      const arr = t.slots && t.slots[k];
      return arr && arr.length ? arr[Math.floor(Math.random() * arr.length)] : "______";
    });
    const html = letterHTML(t.skeleton, (k) => {
      const arr = t.slots && t.slots[k];
      if (arr && arr.length) return `<span class="fill done">${esc(arr[Math.floor(Math.random() * arr.length)])}</span>`;
      return `<span class="fill blank" title="${esc(k)}">${esc(slotZh(k))}</span>`;
    });
    $("#fill-" + t.id).innerHTML = `<h3 class="mt">随机范文<small class="muted" style="font-weight:400;margin-left:8px">绿色=词库里随机挑的，灰色下划线=要按题目自己填</small></h3>${html}
      <p class="sub mt">词数约 ${wordCount(plain)} —— 目标 ${S.writing.word_range[0]}–${S.writing.word_range[1]} 词。</p>`;
  }));
  $$("[data-copy]").forEach((b) => (b.onclick = () => {
    const t = S.writing.templates.find((x) => x.id === b.dataset.copy);
    navigator.clipboard.writeText(t.skeleton).then(() => toast("骨架已复制")).catch(() => toast("复制失败，手动选中吧"));
  }));
  $$("[data-spk2]").forEach((b) => (b.onclick = () => {
    const t = S.writing.templates.find((x) => x.id === b.dataset.spk2);
    speak(t.skeleton.replace(/\{\{\w+\}\}/g, "blank"));
  }));
}

/* 把一道作文题排成真卷第Ⅵ部分的样子：英文 Directions（下挂中文翻译）+ 中文情景 + 要点 + 出处。
   计时写一篇 和 模考 的写作页都用它，版式一致。p = {kind, situation, points, label, note} */
function writingPaperHTML(p) {
  const D = (window.ESSAY_DIRECTIONS || {})[p.kind] || (window.ESSAY_DIRECTIONS || {}).essay
    || { en: SEC.writing.directions, zh: "本部分要求你根据下面的情景写一篇 100–120 词左右的短文。字迹要清楚。" };
  return `<div class="paper">
    <div class="paper-top"><b>Ⅵ. Writing</b><span>（25 points · 考场建议 ${SEC.writing.time_ref} 分钟）</span></div>
    <div class="paper-dir"><b>Directions:</b> ${esc(D.en)}</div>
    <div class="paper-zh">译：${esc(D.zh)}</div>
    <div class="paper-q"><b>61.</b><div>${esc(p.situation)}${
      p.points && p.points.length ? `<ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div></div>
    <div class="paper-note">${esc(p.label || "")}${p.label ? " · " : ""}署名一律写 <b>Li Yuan</b>，不要写真名${p.note ? "　⚠️ " + esc(p.note) : ""}</div>
  </div>`;
}

/* 计时写一篇 + AI 批改 */
let WTIMER = null;
let W_SEL = null;      // 当前选的题：{key, kind, situation, points, label, note}
let W_MODE = "full";  // full 写全篇 / outline 只写三段提纲（工作日任务）
function writingChoices() {
  const out = [];
  (window.REAL_ESSAYS || []).forEach((e) => out.push({
    key: "y" + e.year, real: true, chip: String(e.year), kind: e.kind, situation: e.situation, points: e.points || [],
    label: `${e.year} 年成人高考专升本英语真题`, note: e.note || "" }));
  (window.PAPERS || []).filter((pp) => !pp.real && pp.essay).forEach((pp) => out.push({
    key: "p" + pp.id, real: false, chip: pp.name.replace("全真", ""), kind: "essay", situation: pp.essay, points: [],
    label: `${pp.name}（准真题）`, note: "" }));
  return out;
}
/* 描红（2026-09-16）：用户「写作文时把对应模板阴影在作文里，写多了自然背会」。
   答题纸底下垫一层淡灰的模板骨架（占位符变〔中文提示〕），用户在上面写；
   同一模板写得越多底影越淡：0-1 篇=显，2-3 篇=淡，≥4 篇=隐（脱稿），也可手动 显/淡/隐。 */
const TRACE_KIND = { letter: "letter", email: "letter", notice: "notice", essay: "argument" };
function traceTemplate(kind) {
  const id = TRACE_KIND[kind] || "argument";
  return S.writing.templates.find((t) => t.id === id);
}
function traceCount(tplId) { return STATE.essays.filter((e) => e.tpl === tplId).length; }
function traceLevel(tplId) {
  const mode = (STATE.settings && STATE.settings.trace) || "auto";
  if (mode !== "auto") return mode;              // on / light / off
  const n = traceCount(tplId);
  return n <= 1 ? "on" : n <= 3 ? "light" : "off";
}
function ghostHTML(t) {
  const txt = esc(t.skeleton).replace(/\{\{(\w+)\}\}/g, (m, k) => `<span class="g-slot">〔${esc(slotZh(k))}〕</span>`);
  return `<div class="ghost ${traceLevel(t.id)}" id="w-ghost" aria-hidden="true">${txt}</div>`;
}

function wWrite() {
  const choices = writingChoices();
  const custom = { key: "custom", real: false, chip: "自己出题", kind: "essay", situation: "", points: [], label: "自定义题目", note: "" };
  if (!W_SEL || !choices.concat([custom]).some((c) => c.key === W_SEL.key)) W_SEL = choices[0] || custom;
  const cur = W_SEL.key === "custom" ? Object.assign({}, custom, { situation: W_SEL.situation || "" }) : choices.find((c) => c.key === W_SEL.key) || choices[0];
  const past = STATE.essays.slice(-5).reverse();
  const missing = (window.REAL_ESSAYS_MISSING || []);
  const n = choices.filter((c) => c.real).length;
  const tpl = traceTemplate(cur.kind);
  const traceMode = (STATE.settings && STATE.settings.trace) || "auto";
  const traceN = traceCount(tpl.id);

  $("#w-body").innerHTML = `
  <div class="wp-bar">
    <span class="timer" id="w-timer">35:00</span>
    <button class="btn btn-sm" id="w-start">开始计时</button>
    <span class="wc" id="w-wc">0 词</span>
    <div class="spacer"></div>
    <button class="btn btn-sm" id="w-self">只自查</button>
    <button class="btn btn-sm btn-primary" id="w-ai">${W_MODE === "outline" ? "AI 把提纲扩成范文" : "交卷 · AI 批改打分"}</button>
  </div>
  <div class="card">
    <div class="row mb"><h2>历年真题作文（${n} 年）</h2><div class="spacer"></div>
      <span class="sub">${missing.length ? `${missing.join(" / ")} 年原题没找到可靠版本，暂缺` : ""}</span></div>
    <div class="wp-years">${choices.concat([custom]).map((c) => `<button class="tab ${c.real ? "real" : ""} ${c.key === cur.key ? "active" : ""}" data-year="${esc(c.key)}">${esc(c.chip)}</button>`).join("")}</div>
    ${cur.key === "custom" ? `<label class="field">题目（中文情景，自己写）<textarea id="w-custom" style="min-height:70px">${esc(cur.situation)}</textarea></label>` : ""}
    ${writingPaperHTML(cur)}
    <div class="sheet-wrap">
      <div class="sheet-h">答题纸
        <button class="tab ${W_MODE === "full" ? "active" : ""}" data-wmode="full">写全篇</button>
        <button class="tab ${W_MODE === "outline" ? "active" : ""}" data-wmode="outline">只写三段提纲</button>
        <span class="muted">${W_MODE === "outline" ? "· 每段一两句，把要点塞进去就行，写完让 AI 扩成范文" : "· 开头一句说目的 → 中间把要点逐条写进去 → 结尾一句 · 写完只查五类低级错误"}</span></div>
      ${W_MODE === "full" ? `<div class="trace-bar"><span>描红底影 · ${esc(tpl.name)}</span>
        ${[["auto", "自动"], ["on", "显"], ["light", "淡"], ["off", "隐"]].map(([v, l]) => `<button class="tab ${traceMode === v ? "active" : ""}" data-trace="${v}">${l}</button>`).join("")}
        <span class="muted">${traceMode === "auto" ? `这类已写 ${traceN} 篇 · 0-1 篇显、2-3 篇淡、4 篇起隐，写多了自然脱稿` : "手动模式，写多了记得切回自动"}</span></div>` : ""}
      <div class="${W_MODE === "full" ? "sheet-stack" : ""}">${W_MODE === "full" ? ghostHTML(tpl) : ""}
      <textarea id="w-text" class="ans-sheet" ${W_MODE === "outline" ? 'style="min-height:170px"' : ""} placeholder="${esc(W_MODE === "outline"
        ? "1. 开头（说目的）：\n2. 中间（把要点一条条写）：\n3. 结尾（客套 / 期待回复）：\n"
        : traceLevel(tpl.id) === "off" ? (cur.kind === "essay" ? "My Favorite Photo\n..." : "Dear ...,\n\n") : "")}"></textarea></div>
    </div>
    <div id="w-out"></div>
  </div>
  ${past.length ? `<div class="card"><h2>写过的</h2>${past.map((e) => `<div class="phrase">
      <div style="flex:1"><div class="en">${esc(e.date)}　${typeof e.score === "number" ? `<span class="tag tag-ink">${e.score}/25</span>` : ""}　${e.words} 词</div>
      <div class="use">${esc(String(e.prompt).slice(0, 46))}…</div></div>
      <button class="btn btn-sm" data-essay="${esc(e.id)}">看</button></div>`).join("")}</div>` : ""}`;

  const ta = $("#w-text");
  const promptText = () => (cur.key === "custom" ? ($("#w-custom") || {}).value || "" : `${cur.label}：${cur.situation}${cur.points.length ? " " + cur.points.join("；") : ""}`);
  const upd = () => {
    const c = wordCount(ta.value);
    const el = $("#w-wc");
    el.textContent = c + " 词";
    el.className = "wc " + (c >= S.writing.word_range[0] && c <= S.writing.word_range[1] + 20 ? "ok" : c ? "bad" : "");
  };
  ta.oninput = upd; upd();
  const ghost = $("#w-ghost");
  if (ghost) ta.onscroll = () => { ghost.scrollTop = ta.scrollTop; };
  $$("[data-trace]").forEach((b) => (b.onclick = () => { STATE.settings.trace = b.dataset.trace; saveState(); wWrite(); }));

  $$("[data-year]").forEach((b) => (b.onclick = () => {
    const k = b.dataset.year;
    W_SEL = k === "custom" ? Object.assign({}, custom, { situation: ($("#w-custom") || {}).value || "" }) : choices.find((c) => c.key === k);
    wWrite();
  }));
  if ($("#w-custom")) $("#w-custom").oninput = () => { W_SEL = Object.assign({}, custom, { situation: $("#w-custom").value }); };
  $$("[data-wmode]").forEach((b) => (b.onclick = () => { W_MODE = b.dataset.wmode; wWrite(); }));

  $("#w-start").onclick = function () {
    clearInterval(WTIMER);
    let left = 35 * 60;
    const tick = () => {
      const m = Math.floor(left / 60), sec = left % 60;
      $("#w-timer").textContent = m + ":" + (sec < 10 ? "0" : "") + sec;
      $("#w-timer").classList.toggle("warn", left <= 300);
      if (left-- <= 0) { clearInterval(WTIMER); toast("35 分钟到，考场上就该收笔了"); }
    };
    tick(); WTIMER = setInterval(tick, 1000);
    this.textContent = "重新计时";
    ta.focus();
  };
  $("#w-self").onclick = () => {
    const t = ta.value;
    const c = wordCount(t);
    let issues = [];
    if (c < S.writing.word_range[0]) issues.push(`词数只有 ${c}，不够 ${S.writing.word_range[0]} 词 —— 这项直接扣分`);
    if (!/\n\s*\n/.test(t.trim())) issues.push("看不出三段结构，段落之间空一行");
    if (cur.points.length) issues.push(`对照要点逐条勾：${cur.points.map((x, i) => `(${i + 1}) ${x}`).join("　")}`);
    S.writing.error_classes.forEach((e) => { issues.push(`自查【${e.name}】：如 ${e.example_wrong} → ${e.example_right}`); });
    $("#w-out").innerHTML = `<div class="explain mt"><h4>自查清单</h4>${issues.map((i) => "· " + esc(i)).join("<br>")}</div>`;
  };
  $("#w-ai").onclick = async () => {
    const text = ta.value.trim();
    if (W_MODE === "outline") {
      if (wordCount(text) < 8) return toast("先把三段提纲写出来（每段一两句）");
      const out = $("#w-out");
      out.innerHTML = `<div class="ai-out">AI 正在扩写…（连上后逐字出现）</div>`;
      const wEl = out.firstChild;
      const sys = `你是成人高考专升本英语写作老师。学生英语约 A2（新概念1 学到 90 课），他只写了一道真题作文的三段提纲。
请按下面格式回答，中文说明，英文范文：
【要点核对】逐条说提纲有没有覆盖题目要点，缺的指出来
【范文】用 A2 能看懂的简单词，把提纲扩成一篇 100-120 词的完整作文；尽量沿用学生自己写的句子，只改错、只补全；文体按题目（信 / e-mail / 短文 / 通知），署名 Li Yuan
【逐句中文】范文每句后面给中文
【背这两句】挑范文里最值得背的两句（开头和结尾各一句）`;
      try {
        const t = await callClaude({ strong: true, system: sys, messages: [{ role: "user", content: `题目：${promptText()}\n\n学生提纲：\n${text}` }], maxTokens: 1400, timeoutMs: 180000,
          onDelta: (part) => { if (wEl && wEl.parentNode) wEl.textContent = part; } });
        out.innerHTML = `<div class="ai-out">${esc(t)}</div>`;
        markTask("wo-outline", true);
      } catch (e) { out.innerHTML = `<div class="ai-out">❌ ${esc(e.message)}</div>`; }
      return;
    }
    if (wordCount(text) < 30) return toast("先写够 30 词再批改");
    const out = $("#w-out");
    out.innerHTML = `<div class="ai-out">AI 正在批改…（连上后逐字出现）</div>`;
    const wEl = out.firstChild;
    const sys = `你是成人高考专升本英语阅卷老师。满分 25 分。评分依据：${S.writing.scoring_basis}
题目给了内容要点的话，漏一条要点要扣分并指出。
必须按这个格式回答，不要多余的话：
得分：X/25
词数：N（要求 ${S.writing.word_range[0]}-${S.writing.word_range[1]}）
要点覆盖：逐条说写到了没有
低级错误（只挑这五类：${S.writing.error_classes.map((e) => e.name).join("、")}）：逐条列出「原句 → 改后」，最多 6 条
结构：一句话说三段结构是否清晰
下一步：一句话，最该改的一点
中文回答。`;
    try {
      const t = await callClaude({ strong: true, system: sys, messages: [{ role: "user", content: `题目：${promptText()}\n\n作文：\n${text}` }], maxTokens: 1200, timeoutMs: 180000,
        onDelta: (part) => { if (wEl && wEl.parentNode) wEl.textContent = part; } });
      out.innerHTML = `<div class="ai-out">${esc(t)}</div>`;
      const m = t.match(/得分[：:]\s*(\d+)/);
      const score = m ? Math.min(25, +m[1]) : null;
      STATE.essays.push({ id: "e" + Date.now(), date: todayStr(), prompt: promptText(), text: text, words: wordCount(text), score: score, feedback: t, kind: cur.kind, tpl: tpl.id });
      saveState();
      markTask("wo-essay", true);
      if (score !== null) toast(`已记入：写作当前分 ${score}/25（目标 ${SEC.writing.target}）`);
    } catch (e) { out.innerHTML = `<div class="ai-out">❌ ${esc(e.message)}</div>`; }
  };
  $$("[data-essay]").forEach((b) => (b.onclick = () => {
    const e = STATE.essays.find((x) => x.id === b.dataset.essay);
    $("#w-out").innerHTML = `<div class="ai-out"><b>${esc(e.date)}</b>\n\n${esc(e.text)}\n\n—— 批改 ——\n${esc(e.feedback || "（当时没批改）")}</div>`;
  }));
}

function wCheck() {
  $("#w-body").innerHTML = `<div class="card">
    <h2>写完只查这五类</h2>
    <p class="sub mb">这五类是低级错误，一条一分地扣。查完这五类就交卷，别纠结用词高不高级。</p>
    <table class="tbl"><thead><tr><th>类型</th><th>❌ 错</th><th>✅ 对</th></tr></thead><tbody>
      ${S.writing.error_classes.map((e) => `<tr><td><b>${esc(e.name)}</b></td>
        <td style="color:var(--red)">${esc(e.example_wrong)}</td><td style="color:var(--green)">${esc(e.example_right)}</td></tr>`).join("")}
    </tbody></table>
    <h3 class="mt">检查顺序</h3>
    <ol class="steps">
      <li>数词数够不够 ${S.writing.word_range[0]} 词 —— 不够先补一句，这是唯一硬扣分项</li>
      <li>每句找一遍谓语动词，没有的补上 be 动词</li>
      <li>主语是 he/she/it 的，检查动词有没有加 s</li>
      <li>全文时态是不是一致（讲过去就全用过去）</li>
      <li>可数名词该加 s 的加上</li>
    </ol></div>`;
}

/* ============================================================== 长句拆解 */
/* ============================================================== 每日一读 */
/* 拆句子的温和前置：80-226 词的分级小短文，点句子看中文、逐句可朗读，
   读完 3-4 道理解题（答对 6 成算过，过了才给下一篇）。28 篇也是一条线。 */
let READQ = null;   // 当前理解题会话 { key, i, correct }

ROUTES.dailyread = function (keyArg) {
  const R = window.READINGS_GRADED || {};
  const keys = Object.keys(R).map(Number).sort((a, b) => a - b);
  if (!keys.length) return render('<div class="card"><h1>每日一读</h1><p class="sub">没有找到阅读素材。</p></div>');
  const cur = nextReadKey();
  let k = keyArg || cur || keys[keys.length - 1];
  if (keyArg && !readPassed(keyArg) && keyArg !== cur) k = cur;   // 不跳篇：只能读到当前
  const r = R[k];
  const idx = keys.indexOf(k);
  const rec = STATE.reads[k];
  READQ = null;

  render(`
  <div class="card">
    <div class="q-head">
      <button class="btn btn-sm btn-ghost" id="rd-prev" ${idx === 0 ? "disabled" : ""}>← 上一篇</button>
      <b>第 ${idx + 1} / ${keys.length} 篇</b>
      <span class="tag tag-ink">L${r.level} · ${r.words} 词</span>
      ${rec ? `<span class="tag ${readPassed(k) ? "tag-green" : "tag-red"}">读过 · ${rec.correct}/${rec.total}</span>` : ""}
      <div class="spacer"></div>
      <button class="btn btn-sm" id="rd-all">🔊 整篇朗读</button>
    </div>
    <h1>${esc(r.title)}</h1>
    <p class="sub">💡 ${esc(r.tip)}</p>
    <p class="sub mt">点任意句子显示中文；双击单词查释义。先自己读，实在读不懂再点开中文对照。</p>
  </div>
  <div class="card">
    ${r.sents.map((x, i) => `<div class="rd-sent" data-i="${i}">
      <div class="rd-en">${esc(x.en)} <button class="spk" data-say="${esc(x.en)}">🔊</button></div>
      <div class="rd-zh hidden">${esc(x.zh)}</div>
    </div>`).join("")}
  </div>
  <div class="card">
    <h2>读懂了吗？做 ${r.qs.length} 道理解题</h2>
    <p class="sub mb">答对 ${Math.ceil(r.qs.length * 0.6)} 道这篇算过，下一篇解锁。答案都在文章里，做错会告诉你在第几句。</p>
    <div class="row"><button class="btn btn-orange" id="rd-quiz">开始理解题</button></div>
    <div id="rd-qa" class="mt"></div>
  </div>`);

  $("#rd-prev").onclick = () => { if (idx > 0) ROUTES.dailyread(keys[idx - 1]); };
  $("#rd-all").onclick = () => speak(r.sents.map((x) => x.en).join(" "));
  $$(".rd-sent").forEach((el) => (el.onclick = (e) => {
    if (e.target.closest(".spk")) return;
    el.querySelector(".rd-zh").classList.toggle("hidden");
  }));
  $$("[data-say]").forEach((btn) => (btn.onclick = () => speak(btn.dataset.say)));
  $("#rd-quiz").onclick = () => { READQ = { key: k, i: 0, correct: 0 }; readQStep(r, keys, idx); };
};

function readQStep(r, keys, idx) {
  const box = $("#rd-qa");
  if (!box || !READQ) return;
  if (READQ.i >= r.qs.length) {
    const pass = READQ.correct >= Math.ceil(r.qs.length * 0.6);
    STATE.reads[READQ.key] = { d: todayStr(), correct: READQ.correct, total: r.qs.length };
    saveState();
    markTask("daily-read", true);
    box.innerHTML = `<div class="explain"><h4>${pass ? "🎉 这篇过了（" + READQ.correct + "/" + r.qs.length + "）" : "对了 " + READQ.correct + "/" + r.qs.length + "，还差一点"}</h4>
      ${pass ? "下一篇已解锁，明天接着读。" : "把没读懂的句子点开中文再读一遍，然后重做——读懂为止，不着急。"}</div>
      <div class="qbar">${pass && idx < keys.length - 1 ? `<button class="btn btn-orange" id="rd-next">→ 下一篇</button>` : ""}
        <button class="btn" id="rd-redo">再做一遍理解题</button></div>`;
    if ($("#rd-next")) $("#rd-next").onclick = () => ROUTES.dailyread(keys[idx + 1]);
    $("#rd-redo").onclick = () => { READQ = { key: READQ ? READQ.key : keys[idx], i: 0, correct: 0 }; readQStep(r, keys, idx); };
    return;
  }
  const q = r.qs[READQ.i];
  box.innerHTML = `<div class="explain"><h4>${READQ.i + 1} / ${r.qs.length}　${esc(q.q)}</h4>
    <div class="opts mt">${q.opts.map((o, i) => `<button class="opt" data-k="${i}">${esc(o)}</button>`).join("")}</div>
    <div id="rd-fb"></div></div>`;
  $$("#rd-qa .opt").forEach((btn) => (btn.onclick = () => {
    const ok = +btn.dataset.k === q.ans;
    if (ok) READQ.correct++;
    $$("#rd-qa .opt").forEach((x, i2) => x.classList.add(i2 === q.ans ? "right" : i2 === +btn.dataset.k ? "wrong" : "dim"));
    $("#rd-fb").innerHTML = `<div class="mt" style="font-size:14px">${ok ? "✅" : "❌"} ${esc(q.why)}</div>
      <div class="qbar"><button class="btn btn-primary btn-sm" id="rd-n">${READQ.i + 1 >= r.qs.length ? "看结果" : "下一题"}</button></div>`;
    $("#rd-n").onclick = () => { READQ.i++; readQStep(r, keys, idx); };
  }));
}

ROUTES.sentence = function (tierArg) {
  const rec = sentenceTier();                 // 按路线进度推荐的级别（0=还没到时候）
  const tier = tierArg || Math.max(1, rec);   // 手动可选级别，但推荐跟着路线走
  const pool = sentencePool(tier);
  const seen = {};
  STATE.sentences.forEach((x) => (seen[_cleanSent(x.en)] = 1));
  const fresh = pool.filter((t) => !seen[t]);
  const d = S.sentence_dissection;

  render(`
  <div class="card">
    <h1>句子拆解（打括号读法）</h1>
    <p class="sub">跟微课里学的是同一招：<b>①找真动词（整句的主心骨） ②给修饰打括号（who/that/which 从句、in/of/at 介词短语） ③先读主干，再回头看括号</b>。词都认识但读不懂，就是缺这一步。</p>
    ${rec === 0 ? `<div class="warnbox mt">你还没学到定语从句（路线第三章）——拆解拆的就是从句，没学过等于蒙着眼拆。
      先顺着路线把第三章过了，这里会自动解锁「短句级」。想提前感受可以练下面的短句，看不懂不丢人。</div>` : ""}
  </div>

  <div class="card">
    <h2>难度分级</h2>
    <div class="tabs">${SENT_TIERS.map((t) => `<button class="tab ${t.n === tier ? "active" : ""}" data-tier="${t.n}">${t.name}${t.n === rec ? " ★推荐" : ""}</button>`).join("")}</div>
    <p class="sub">${esc(SENT_TIERS[tier - 1].desc)}　·　本级 ${pool.length} 句，没练过的 ${fresh.length} 句。
      ${rec > 0 && tier > rec ? "<b>这级超过你现在的进度了，看不懂很正常，建议回推荐级。</b>" : ""}</p>
  </div>

  <div class="card">
    <h2>练</h2>
    <div class="row mb"><button class="btn" id="s-random">抓一个${esc(SENT_TIERS[tier - 1].name)}</button></div>
    <label class="field">句子（也可以自己粘贴）
      <textarea id="s-text" style="min-height:90px" placeholder="点上面按钮抓一句，或自己贴一句…"></textarea></label>
    <div class="row">
      <button class="btn btn-primary" id="s-go">🤖 让 AI 打括号拆给我看</button>
      <button class="btn" id="s-speak">🔊 朗读</button>
      <div class="spacer"></div>
      <span class="muted" style="font-size:12.5px">已练 ${STATE.sentences.length} 句</span>
    </div>
    <div id="s-out"></div>
  </div>
  ${STATE.sentences.length ? `<div class="card"><h2>练过的句子</h2>
    ${STATE.sentences.slice(-8).reverse().map((x) => `<div class="phrase"><div style="flex:1">
      <div class="en">${esc(x.en)}</div><div class="use">${esc(x.d)}</div></div></div>`).join("")}</div>` : ""}`);

  $$("[data-tier]").forEach((btn) => (btn.onclick = () => ROUTES.sentence(+btn.dataset.tier)));
  $("#s-random").onclick = () => {
    const src = fresh.length ? fresh : pool;
    if (!src.length) return toast("这一级暂时没有句子");
    $("#s-text").value = src[Math.floor(Math.random() * src.length)];
  };
  $("#s-speak").onclick = () => speak($("#s-text").value);
  $("#s-go").onclick = async () => {
    const en = $("#s-text").value.trim();
    if (!en) return toast("先放一个句子进来");
    const btnGo = $("#s-go");
    btnGo.disabled = true;
    setTimeout(() => { if ($("#s-go")) $("#s-go").disabled = false; }, 3000);
    const out = $("#s-out");
    out.innerHTML = `<div class="ai-out">AI 正在拆…（连上后逐字出现）</div>`;
    const sEl = out.firstChild;
    // 提示词按级别说人话：学生只学过「真动词 / 打括号」这两个概念，别引入别的术语
    const sys = `你是成人高考英语私教。学生是零基础成年人，只学过两个概念：「真动词」（整句真正的谓语）和「打括号」（把修饰成分括起来先跳过）。请用打括号读法拆解他给的英文句子，严格按这个格式输出：

【原句打好括号】把修饰成分（从句、介词短语、时间地点）用（）括起来重写原句
【真动词】是哪个词，为什么是它
【主干】主干的英文 —— 中文意思
【括号】每个括号一行：括号里的英文 —— 中文意思 —— 它是在补充说明谁
【整句人话】用中国人平时说话的方式把整句意思说出来（可以拆成两三个短句，别硬翻成一个长定语）
【这句难在哪】一句话

要求：不用「谓语/宾语/状语/分词」这些术语；每个中文都说人话；总共不超过 200 字。`;
    try {
      const t = await callClaude({ system: sys, messages: [{ role: "user", content: en }], maxTokens: 800, timeoutMs: 180000,
        onDelta: (part) => { if (sEl && sEl.parentNode) sEl.textContent = part; } });
      out.innerHTML = `<div class="ai-out">${esc(t)}</div>`;
      STATE.sentences.push({ ts: Date.now(), d: todayStr(), en: en });
      saveState();
    } catch (e) { out.innerHTML = `<div class="ai-out">❌ ${esc(e.message)}</div>`; }
  };
};

/* ============================================================== 模考 */
let MOCK = null;

/* ---------------------------------------------- 整卷做完之后的「针对性错题训练」 */
/* 用户 2026-09-12 定的原则：真题整卷做完 → 只练这套卷错的题 → 每题带解析 → 弄懂为止。
   所以错题不是笼统丢进错题本，而是**按题型归堆**：哪一类错得最多，先练哪一类。 */
function wrongByType(ids) {
  const buckets = {};
  ids.map((id) => BY_ID[id]).filter(Boolean).forEach((q) => {
    const sec = secOf(q);
    let name;
    if (sec === "reading") name = readingType(q);
    else if (sec === "dialogue") name = (CUE_DEFS[cueKey(q)] || {}).label || "补全对话";
    else if (sec === "grammar") name = sprintGType(q).name;
    else if (sec === "cloze") name = "完形填空";
    else name = SEC[sec] ? SEC[sec].name : "其它";
    const k = sec + "|" + name;
    (buckets[k] = buckets[k] || { sec: sec, name: name, qs: [] }).qs.push(q);
  });
  // 丢分多的排前面（题数 × 每题分值）
  return Object.values(buckets).sort((a, b) =>
    b.qs.length * SEC[b.sec].per - a.qs.length * SEC[a.sec].per);
}

function wrongDrillHTML(ids, label) {
  const gs = wrongByType(ids);
  if (!gs.length) return `<div class="card"><h2>这套卷一道没错</h2>
    <p class="sub">没有错题可练。去「真题」页挑没做过的题型，或者换一套卷。</p></div>`;
  const lost = gs.reduce((a, g) => a + g.qs.length * SEC[g.sec].per, 0);
  return `<div class="card">
    <h2>针对性错题训练</h2>
    <p class="sub mb">${esc(label)}错的 <b>${ids.length}</b> 道题，一共丢了 <b>${lost}</b> 分。
      按题型归好堆了——<b>先练丢分最多的那一类</b>，同一类的题连着做才看得出套路。每题做完都有解析。</p>
    <div class="wd-list">${gs.map((g, i) => `
      <button class="wd" data-wd="${i}">
        <span class="wd-n">${g.qs.length}</span>
        <span class="wd-m"><b>${esc(SEC[g.sec].name)} · ${esc(g.name)}</b>
          <small>丢 ${g.qs.length * SEC[g.sec].per} 分 · 点开只练这一类</small></span>
        <span class="wd-go">练 →</span>
      </button>`).join("")}</div>
    <div class="qbar"><button class="btn btn-orange" id="wd-all">从头把 ${ids.length} 道全部重做一遍</button></div>
  </div>`;
  }

let _WD_IDS = [];
function bindWrongDrill(ids) {
  if (ids) _WD_IDS = ids;
  const gs = wrongByType(_WD_IDS);
  $$("[data-wd]").forEach((b) => (b.onclick = () => {
    const g = gs[+b.dataset.wd];
    startQuiz(orderForPractice(g.qs), {
      title: "错题专训 · " + g.name, backTo: CURRENT, paper: false,
      ruleCard: sprintRuleCard({
        sec: g.sec, name: g.name, qs: g.qs,
        prio: g.sec === "reading" ? READ_PRIORITY[g.name] : null,
        rule: "这一堆是你**刚考错**的同一类题。先看下面的判定步骤，再一道道做——每道做完都有解析，看懂了再点下一题。",
        steps: g.sec === "reading" ? (READ_HOW[g.name] || [])
          : g.sec === "grammar" ? (gtypeRule(sprintGType(g.qs[0])).steps || [])
          : g.sec === "dialogue" ? ["先判断空格前后那句是问句、感谢、道歉还是邀请", "再按固定回法去选", "选完把整段对话读一遍，通顺才对"]
          : ["先通读抓大意，别一空一空孤立着填", "先填有把握的（固定搭配、逻辑连词、时态呼应）", "剩下的靠上下文重复出现的词推"],
      }),
    });
  }));
  if ($("#wd-all")) $("#wd-all").onclick = () => {
    // 同类连着做：按题型排好再出，别打散
    const list = [];
    gs.forEach((g) => list.push(...orderForPractice(g.qs)));
    startQuiz(list, { title: "错题专训 · 全部重做", backTo: CURRENT, paper: false });
  };
}

/* 从「历次成绩」点进来：只练某一次模考错的题 */
ROUTES.mockwrong = function (idx) {
  const m = STATE.mocks[+idx];
  if (!m || !m.wrongIds) { toast("这次模考没有记录错题（旧存档）"); return go("mock"); }
  const pname = ((window.PAPERS || []).find((x) => x.id === m.paper) || {}).name || "随机拼卷";
  render(`<div class="card"><div class="row"><h1>${esc(m.date)} 的错题</h1>
      <span class="tag tag-ink">${esc(pname)}</span>
      <div class="spacer"></div><button class="btn btn-sm btn-ghost" id="w-back">← 回模考页</button></div>
    <p class="sub">当时总分 <b>${m.total}</b> / 150，用时 ${m.used} 分钟。</p></div>
  ${wrongDrillHTML(m.wrongIds, "这次模考")}`);
  $("#w-back").onclick = () => go("mock");
  bindWrongDrill(m.wrongIds);
};

ROUTES.mock = function () {
  if (MOCK && MOCK.running) return renderMock();
  const past = STATE.mocks.slice(-6).reverse();
  const st = currentStage();
  render(`
  <div class="card">
    <h1>全真模考</h1>
    <p class="sub">${S.meta.duration_minutes} 分钟，${S.meta.total_score} 分，按考场固定顺序出：
      ${C.answer_order.map((k) => esc(SEC[k].name)).join(" → ")}。<b>板块之间不能往回跳</b> —— 考场上就是这样，先练习惯。</p>
    ${st.timed ? "" : `<div class="warnbox mt">现在是 ${esc(st.stage)} 阶段，计划里这个阶段<b>不要求计时模考</b>（该做的是：${esc(st.focus)}）。真想测一次也行，但别把它当成日常训练。</div>`}
    <ul style="padding-left:18px;font-size:14px" class="mt">
      <li>语音 5 题会自动填 <b>${C.phonetics_default_answer}</b>，直接跳过 —— 这是策略规定的，不要花时间</li>
      <li>写作按 AI 打分计入；没填 API Key 就自己按 25 分制打</li>
      <li>交卷后直接出「针对性错题训练」——按题型归堆，丢分最多的先练，每题带解析</li>
    </ul>
    ${(() => {
      const ps = (window.PAPERS || []);
      const mk = (pp) => {
        const done = STATE.mocks.filter((m) => m.paper === pp.id);
        const best = done.length ? Math.max(...done.map((m) => m.total)) : null;
        return `<button class="btn ${pp.real ? "btn-orange" : ""}" data-paper="${pp.id}">${esc(pp.name)}${best != null ? ` <b>${best}分</b>` : ""}</button>`;
      };
      const real = ps.filter((p) => p.real), sim = ps.filter((p) => !p.real);
      return `${real.length ? `<h3 class="mt">🎯 历年真题原卷（按卷面原始题序考）</h3>
        <div class="qbar">${real.map(mk).join("")}</div>` : ""}
      ${sim.length ? `<h3 class="mt">全真模拟卷</h3><div class="qbar">${sim.map(mk).join("")}</div>` : ""}
      <h3 class="mt">其它</h3>
      <div class="qbar"><button class="btn btn-ghost" id="mk-go">随机拼卷（从整个题库现抽）</button></div>`;
    })()}
    <p class="sub mt">整卷 = 按卷面原始题序完整考一遍，版式也照真卷：英文 Directions、语音带划线、补全对话是 8 选 5。
      <b>交卷后直接出「针对性错题训练」</b>——按题型归堆，哪一类丢分最多先练哪一类，每题带解析。</p>
  </div>
  ${past.length ? `<div class="card"><h2>历次成绩</h2>
    <table class="tbl"><thead><tr><th>日期</th><th>总分</th>${SECTIONS.map((s) => `<th>${esc(s.name)}</th>`).join("")}<th>用时</th><th></th></tr></thead>
    <tbody>${past.map((m) => {
      const i = STATE.mocks.indexOf(m);
      const nw = (m.wrongIds || []).length;
      return `<tr><td>${esc(m.date)}${m.paper ? ' <span class="tag tag-ink">' + esc(((window.PAPERS || []).find((x) => x.id === m.paper) || { name: m.paper }).name) + "</span>" : ""}</td><td><b>${m.total}</b>/150</td>
      ${SECTIONS.map((s) => `<td>${m.sec[s.key] == null ? "—" : m.sec[s.key]}</td>`).join("")}
      <td>${m.used} 分钟</td>
      <td>${nw ? `<button class="btn btn-sm btn-orange" data-mw="${i}">重练错题 ${nw}</button>` : '<span class="muted">—</span>'}</td></tr>`;
    }).join("")}</tbody></table>
    <p class="sub mt">目标线 ${S.meta.target_score} 分，保险线 ${S.meta.safe_target_score} 分。</p></div>` : ""}`);
  $("#mk-go").onclick = () => startMock();
  $$("[data-paper]").forEach((b) => (b.onclick = () => startMock(b.dataset.paper)));
  $$("[data-mw]").forEach((b) => (b.onclick = () => go("mockwrong", b.dataset.mw)));
};

function startMock(paperId) {
  const paper = {};
  const paperDef = paperId ? (window.PAPERS || []).find((x) => x.id === paperId) : null;
  if (paperDef) {
    // 整卷模式：按印刷卷的原始题序取题，一题不换
    C.answer_order.forEach((k) => {
      if (k === "writing") { paper[k] = []; return; }
      paper[k] = BANK.filter((q) => q.paper === paperId && secOf(q) === k)
        .sort((a, b) => (a.ord || 0) - (b.ord || 0));
    });
  } else {
  C.answer_order.forEach((k) => {
    const s = SEC[k];
    if (k === "writing") { paper[k] = []; return; }
    let pool = BY_SEC[k] || [];
    if (k === "grammar") pool = grammarInScope().length >= s.count ? grammarInScope() : pool;
    if (k === "dialogue") {
      // 真卷上的补全对话是【一整段对话挖 5 个空】，不是 5 道互不相干的单句问答。
      // 以前这里直接 pick(pool, 5)：抽出来是 A 卷的「(56)处应填」+ 几道单句 +
      // B 卷的「(56)处应填」混成一坨，既不成卷，空号也对不上原文。
      // 先找题数够的整段对话；题库里实在没有，再退回单句问答。
      const full = shuffle(groupByPassage(pool).filter((g) => g.passage && g.qs.length >= s.count));
      if (full.length) {
        paper[k] = full[0].qs.slice().sort((a, b) => (a.ord || 0) - (b.ord || 0)).slice(0, s.count);
      } else {
        const singles = pool.filter((x) => !x.passageId);
        paper[k] = pick(singles.length >= s.count ? singles : pool, s.count);
      }
    } else if (k === "reading" || k === "cloze") {
      // 按篇抽，尽量凑够题数
      const gs = shuffle(groupByPassage(pool));
      const out = [];
      for (const g of gs) { if (out.length >= s.count) break; out.push(...g.qs); }
      paper[k] = out.slice(0, s.count);
    } else {
      paper[k] = pick(pool, s.count);
    }
  });
  }
  MOCK = {
    running: true, si: 0, qi: 0,
    order: C.answer_order.slice(),
    paper: paper,
    paperId: paperId || null,
    ans: {},                    // {qid: index}
    essay: "",
    essayPrompt: paperDef ? paperDef.essay : "假设你是李明，请就“大学生做兼职”写一篇短文谈谈你的看法。",
    start: Date.now(), left: S.meta.duration_minutes * 60,
  };
  // 语音直接预填，不占时间
  (paper.phonetics || []).forEach((q) => (MOCK.ans[q.id] = "ABCD".indexOf(C.phonetics_default_answer)));
  clearInterval(MOCK.timer);
  MOCK.timer = setInterval(() => {
    MOCK.left--;
    const el = $("#mk-timer");
    if (el) {
      const m = Math.floor(MOCK.left / 60), s = MOCK.left % 60;
      el.textContent = m + ":" + (s < 10 ? "0" : "") + s;
      el.classList.toggle("warn", MOCK.left <= 600);
    }
    if (MOCK.left <= 0) { clearInterval(MOCK.timer); toast("时间到，自动交卷"); finishMock(); }
  }, 1000);
  renderMock();
}

function renderMock() {
  const key = MOCK.order[MOCK.si];
  const s = SEC[key];
  const m = Math.floor(MOCK.left / 60), sec = MOCK.left % 60;
  const bar = `<div class="mock-bar">
    <span class="timer ${MOCK.left <= 600 ? "warn" : ""}" id="mk-timer">${m}:${sec < 10 ? "0" : ""}${sec}</span>
    <div class="mock-steps">${MOCK.order.map((k, i) => `<span class="${i < MOCK.si ? "done" : i === MOCK.si ? "now" : ""}">${esc(SEC[k].name)}</span>`).join("")}</div>
    <div class="spacer"></div>
    <button class="btn btn-sm btn-ghost" id="mk-quit">放弃</button>
  </div>`;

  if (key === "writing") {
    render(`${bar}<div class="card">
      <h2>${esc(s.name)}（${s.full} 分 · 建议 ${s.time_ref} 分钟）</h2>
      ${(() => {
        const pd = (window.PAPERS || []).find((x) => x.id === MOCK.paperId);
        const re = pd && pd.real ? (window.REAL_ESSAYS || []).find((e) => pd.essay === e.situation || (pd.id === "R" + e.year)) : null;
        return writingPaperHTML(re ? { kind: re.kind, situation: re.situation, points: re.points, label: pd.name }
                                   : { kind: "essay", situation: MOCK.essayPrompt, points: [], label: pd ? pd.name : "随机拼卷" });
      })()}
      <div class="sheet-wrap"><div class="sheet-h">答题纸</div>
      <textarea id="mk-essay" class="ans-sheet" placeholder="Dear ...,">${esc(MOCK.essay)}</textarea></div>
      <div class="row mt"><span class="wc" id="mk-wc"></span><div class="spacer"></div>
        <button class="btn btn-primary" id="mk-next">写完了，进入下一板块 →</button></div>
      <p class="sub mt">提醒：这一板块的顺序排在第 2 位，因为它是模板分，趁脑子清醒先拿满。</p>
    </div>`);
    const ta = $("#mk-essay");
    const upd = () => { const n = wordCount(ta.value); $("#mk-wc").textContent = n + " 词"; $("#mk-wc").className = "wc " + (n >= S.writing.word_range[0] ? "ok" : "bad"); };
    ta.oninput = () => { MOCK.essay = ta.value; upd(); }; upd();
    $("#mk-next").onclick = nextMockSection;
    $("#mk-quit").onclick = quitMock;
    return;
  }

  // ⚠️ 必须带 !MOCK.peek：点了「还是想做一下」之后，每选一个选项都会走 renderMock()，
  //    不判 peek 就会被弹回这个跳过页，等于做不了（踩过）。
  if (key === "phonetics" && !MOCK.peek) {
    render(`${bar}<div class="card">
      <h2>${esc(s.name)}（${s.full} 分）</h2>
      <div class="warnbox">策略：<b>零投入</b>。5 题已全部涂 ${C.phonetics_default_answer}，期望得分 ${s.target} 分左右。
        考场上这 ${s.time_ref} 分钟省下来给阅读。</div>
      <p class="sub">如果你确实还剩时间，可以点开逐题看一眼；不看直接交卷才是标准动作。</p>
      <div class="qbar"><button class="btn btn-primary" id="mk-next">交卷看结果</button>
        <button class="btn btn-ghost" id="mk-peek">还是想做一下</button></div>
      <div id="mk-peek-area"></div>
    </div>`);
    $("#mk-next").onclick = nextMockSection;
    $("#mk-quit").onclick = quitMock;
    $("#mk-peek").onclick = () => { MOCK.peek = true; renderMockQuestions(bar, key, s); };
    return;
  }
  renderMockQuestions(bar, key, s);
}

/* 本板块里「第 N 空 → 第几题」的对照。补全对话/完形的题干长这样：「(57) 处应填：」，
   录题时也有只给 ord 的，两种都认。 */
function blankNoOf(q) {
  const m = String(q.stem || "").match(/\((\d+)\)/);
  if (m) return m[1];
  return q.ord != null ? String(q.ord) : null;
}

/* 原文/对话渲染：当前这一空高亮，已经选过的空**直接把选项文字填进去**。
   补全对话就该长这样 —— 只给一句「(57) 处应填：」而看不见对话，题根本没法做。
   （2026-09-09 用户报 bug：模考里补全对话第 2 空起原文整个消失。） */
function mockPassageHTML(list, cur, key) {
  const raw = passageOf(cur);
  if (!raw) return "";
  // 只有补全对话 / 完形才有「空」；阅读的原文里出现 (2)(1990) 之类纯属正文，别乱标
  if (key !== "dialogue" && key !== "cloze") return esc(raw);
  const byBlank = {};
  list.forEach((x, i) => { const n = blankNoOf(x); if (n) byBlank[n] = { i: i, q: x }; });
  return esc(raw).replace(/\((\d+)\)(\s*_+)?/g, (whole, n, tail) => {
    const hit = byBlank[n];
    if (!hit) return whole;                       // 正文里的年份之类，别乱标
    const pick = MOCK.ans[hit.q.id];
    const on = hit.q.id === cur.id ? " on" : "";
    const fill = pick == null
      ? (tail || "")
      : ` <i class="psg-fill">${esc(mockOptions(hit.q)[pick])}</i>`;
    return `<span class="psg-blank${on}" data-j="${hit.i}" title="跳到第 ${hit.i + 1} 题">(${n})</span>${fill}`;
  });
}

/* ====== 模考 = 照着真卷的样子出题（2026-09-12 用户要求：考场上全是英文，提前适应） ======
   三条差异，以前模考里都没还原：
   ① 补全对话真卷是【8 选 5】：上面一个 A~H 的方框，下面对话挖 5 个空，选项不重复用。
      题库为了能挂解析改编成了每空四选一 —— 练习模式保留四选一，**模考走原始 8 选 5**。
   ② 语音/完形/对话在真卷上**没有中文题干**：语音就是四个词，完形对话就是原文里的那个空。
   ③ 每个大题前面有一段**英文 Directions**，考场上先读它。 */
function dlgSet(q) { return q && q.passageId ? (window.DIALOG_SETS || {})[q.passageId] : null; }
function mockOptions(q) { const d = dlgSet(q); return d ? d.options : q.options; }
function mockAnswer(q) { const d = dlgSet(q); return d ? d.answers[q.id] : q.answer; }

/* 真卷上语音题没题干；完形/对话的「题干」就是原文里那个编号的空 */
function mockStem(q, key) {
  if (key === "phonetics") return "";
  const m = String(q.stem || "").match(/^\((\d+)\)/);
  if ((key === "cloze" || key === "dialogue") && m) return `<span class="mk-blankno">(${m[1]})</span>`;
  return esc(q.stem);
}

/* A~H 的选项方框，照原卷排成两列 */
function dlgChoiceBox(list, cur) {
  const d = dlgSet(cur); if (!d) return "";
  const used = {};
  list.forEach((x) => { const a = MOCK.ans[x.id]; if (a != null) used[a] = x; });
  return `<div class="dlg-box">${d.options.map((o, i) => {
    const by = used[i];
    return `<div class="${by ? (by.id === cur.id ? "used cur" : "used") : ""}">
      <b>${letter(i)}.</b> <span>${escOpt(o)}</span>
      ${by ? `<i>→ ${esc(String(blankNoOf(by) || ""))}</i>` : ""}</div>`;
  }).join("")}</div>`;
}

function renderMockQuestions(bar, key, s) {
  const list = MOCK.paper[key] || [];
  if (!list.length) return nextMockSection();
  if (MOCK.qi >= list.length) MOCK.qi = list.length - 1;
  const q = list[MOCK.qi];
  // ⚠️ 原文一律走 passageOf()：同一篇下面往往只有第一题挂了 passage 字段，
  //    而且不能因为「跟上一题是同一篇」就不渲染 —— 每换一题都是整页重绘，
  //    不渲染 = 原文没了。答题卡跳着做的时候更明显。
  const psg = mockPassageHTML(list, q, key);
  const chosen = MOCK.ans[q.id];
  const optList = mockOptions(q);           // 补全对话在模考里是 8 个
  const opts8 = optList.length > 4;
  const stemHTML = mockStem(q, key);
  const done = list.filter((x) => MOCK.ans[x.id] != null).length;
  const psgLabel = key === "dialogue" ? "对话原文" : "原文";
  const psgTip = key === "reading" ? "先看题干圈关键词，再回原文定位"
    : key === "cloze" ? "先通读抓大意，再一空一空填"
    : "已选的空会直接填进对话里 · 点原文里的空可跳到那一题";

  render(`${bar}
  ${psg ? `<div class="card psg-card mock-psg${MOCK.psgFold ? " folded" : ""}${MOCK.psgBig ? " big" : ""}" id="mk-psg-card">
    <div class="row mb"><b>${psgLabel}</b>
      <span class="muted" style="font-size:12px">${psgTip}</span>
      <div class="spacer"></div>
      <button class="btn btn-sm ${MOCK.psgBig ? "btn-orange" : ""}" id="mk-psg-big">${MOCK.psgBig ? "⤡ 还原" : "⤢ 放大原文"}</button>
      <button class="btn btn-sm btn-ghost" id="mk-psg-fold">${MOCK.psgFold ? "展开原文" : "收起原文"}</button></div>
    <div class="passage" id="mk-psg">${psg}</div>
  </div>` : ""}
  <div class="card">
    <div class="q-head"><b>${esc(s.name)}</b><span class="tag">${s.count} 题 × ${s.per} 分 = ${s.full} 分</span>
      <span class="tag ${s.invest ? "tag-orange" : ""}">目标 ${s.target} 分</span>
      <div class="spacer"></div><span class="qprog">第 ${MOCK.qi + 1} / ${list.length} 题　已答 ${done}</span></div>
    ${MOCK.qi === 0 || MOCK.dirOpen ? `<div class="mk-dir" id="mk-dir">
      <div class="mk-dir-h"><b>${esc(s.en || s.name)}</b><span>(${s.full} points)</span>
        <div class="spacer"></div><button class="btn btn-sm btn-ghost" id="mk-dir-x">收起</button></div>
      <p><b>Directions:</b> ${esc(s.directions || "")}</p>
    </div>` : `<div class="row mb"><button class="btn btn-sm btn-ghost" id="mk-dir-o">📄 看本大题的英文 Directions</button></div>`}
    ${opts8 ? dlgChoiceBox(list, q) : ""}
    ${stemHTML ? `<div class="stem">${stemHTML}</div>` : ""}
    <div class="opts ${opts8 ? "opts-grid" : ""}" id="mk-opts">${optList.map((o, i) => `<button class="opt ${chosen === i ? "chosen" : ""}" data-i="${i}"><b>${letter(i)}</b><span>${escOpt(o)}</span></button>`).join("")}</div>
    <div class="qbar">
      <button class="btn" id="mk-prev" ${MOCK.qi === 0 ? "disabled" : ""}>← 上一题</button>
      <button class="btn" id="mk-skip" ${MOCK.qi >= list.length - 1 ? "disabled" : ""}>跳过 →</button>
      ${chosen != null ? `<button class="btn btn-ghost" id="mk-clear">清除本题</button>` : ""}
      <div class="spacer"></div>
      <button class="btn btn-primary" id="mk-next">${MOCK.si === MOCK.order.length - 1 ? "交卷" : "本板块做完，下一板块 →"}</button>
    </div>
    <h3 class="mt">答题卡</h3>
    <div class="sheet" id="mk-sheet">${list.map((x, i) => {
      const a = MOCK.ans[x.id];
      return `<button class="${a != null ? "filled" : ""} ${i === MOCK.qi ? "cur" : ""}" data-j="${i}">${i + 1}${a != null ? " " + letter(a) : ""}</button>`;
    }).join("")}</div>
    ${done < list.length ? `<p class="sub mt">还有 ${list.length - done} 题没涂。<b>板块之间不能往回跳</b>，走之前先把空的蒙掉。</p>` : ""}
  </div>`);

  if ($("#mk-dir-x")) $("#mk-dir-x").onclick = () => { MOCK.dirOpen = false; renderMock(); };
  if ($("#mk-dir-o")) $("#mk-dir-o").onclick = () => { MOCK.dirOpen = true; renderMock(); };
  const goQ = (j) => {
    const el = $("#mk-psg");
    MOCK.psgScroll = el ? el.scrollTop : MOCK.psgScroll;
    MOCK.qi = j; renderMock();
  };
  // 选完不再自动跳下一题：补全对话要能看着自己填进原文的效果再决定，
  // 一选就被弹走等于看不到（用户报的就是这个）。跳题交给「跳过 / 答题卡」。
  $$("#mk-opts .opt").forEach((b) => (b.onclick = () => { MOCK.ans[q.id] = +b.dataset.i; goQ(MOCK.qi); }));
  if ($("#mk-clear")) $("#mk-clear").onclick = () => { delete MOCK.ans[q.id]; goQ(MOCK.qi); };
  $("#mk-prev").onclick = () => goQ(MOCK.qi - 1);
  $("#mk-skip").onclick = () => { if (MOCK.qi < list.length - 1) goQ(MOCK.qi + 1); };
  $("#mk-next").onclick = nextMockSection;
  $("#mk-quit").onclick = quitMock;
  $$("#mk-sheet button").forEach((b) => (b.onclick = () => goQ(+b.dataset.j)));
  $$("#mk-psg .psg-blank").forEach((b) => (b.onclick = () => goQ(+b.dataset.j)));
  if ($("#mk-psg-big")) $("#mk-psg-big").onclick = () => {
    MOCK.psgBig = !MOCK.psgBig;      // 记在 MOCK 上，换题也保持
    const el = $("#mk-psg");
    MOCK.psgScroll = el ? el.scrollTop : MOCK.psgScroll;
    renderMock();
  };
  if ($("#mk-psg-fold")) $("#mk-psg-fold").onclick = () => {
    MOCK.psgFold = !MOCK.psgFold;
    const c = $("#mk-psg-card");
    c.classList.toggle("folded", MOCK.psgFold);
    $("#mk-psg-fold").textContent = MOCK.psgFold ? "展开原文" : "收起原文";
  };
  // 原文滚到哪儿了，换题之后接着看，别每题都跳回开头
  const pe = $("#mk-psg");
  if (pe && MOCK.psgScroll) pe.scrollTop = MOCK.psgScroll;
}

function nextMockSection() {
  MOCK.si++; MOCK.qi = 0; MOCK.peek = false; MOCK.psgScroll = 0;
  if (MOCK.si >= MOCK.order.length) finishMock(); else renderMock();
}
function quitMock() {
  if (!confirm("放弃这次模考？已作答的不会计入。")) return;
  clearInterval(MOCK.timer); MOCK.running = false; MOCK = null; go("mock");
}

async function finishMock() {
  clearInterval(MOCK.timer);
  MOCK.running = false;
  const used = Math.round((S.meta.duration_minutes * 60 - MOCK.left) / 60);
  const secScores = {}, wrongList = [];
  C.answer_order.forEach((k) => {
    if (k === "writing") return;
    const list = MOCK.paper[k] || [];
    let right = 0;
    list.forEach((q) => {
      const a = MOCK.ans[q.id];
      const ok = a === mockAnswer(q);   // 补全对话在模考里是 8 选 5，答案下标不同于四选一
      if (ok) right++; else wrongList.push({ q: q, picked: a });
      // 计入统计与错题本；模考里的错题先不带归因，交卷后逐题补
      recordAnswer(q, ok, ok ? "NONE" : "", "");
    });
    secScores[k] = Math.round((right / (list.length || 1)) * SEC[k].full);
  });

  render(`<div class="card"><h1>交卷了</h1><p class="sub">正在给作文打分…</p></div>`);

  // 作文分
  let wScore = null, wFeed = "";
  if (wordCount(MOCK.essay) >= 30 && hasApiKey()) {
    try {
      const t = await callClaude({
        strong: true,
        system: `你是成人高考专升本英语阅卷老师，满分 25 分。评分依据：${S.writing.scoring_basis}
第一行必须是「得分：X/25」，之后列出低级错误（只看这五类：${S.writing.error_classes.map((e) => e.name).join("、")}），最后一句给下一步建议。中文回答。`,
        messages: [{ role: "user", content: `题目：${MOCK.essayPrompt}\n\n作文：\n${MOCK.essay}` }], maxTokens: 1000,
      });
      wFeed = t;
      const m = t.match(/得分[：:]\s*(\d+)/);
      if (m) wScore = Math.min(25, +m[1]);
    } catch (e) { wFeed = "AI 批改失败：" + e.message; }
  }
  secScores.writing = wScore == null ? 0 : wScore;
  const total = SECTIONS.reduce((a, s) => a + (secScores[s.key] || 0), 0);

  if (wScore != null || wordCount(MOCK.essay) >= 30) {
    STATE.essays.push({ id: "e" + Date.now(), date: todayStr(), prompt: MOCK.essayPrompt, text: MOCK.essay, words: wordCount(MOCK.essay), score: wScore, feedback: wFeed });
  }
  // 把这套卷错在哪些题上记下来 —— 交卷之后要能随时回来只练这一套的错题
  STATE.mocks.push({
    date: todayStr(), total: total, sec: secScores, used: used, paper: MOCK.paperId || "",
    wrongIds: wrongList.map((w) => w.q.id),
  });
  saveState();

  const rows = SECTIONS.map((s) => {
    const got = secScores[s.key] || 0;
    const gap = got - s.target;
    return `<tr><td><b>${esc(s.name)}</b></td><td class="num">${got} / ${s.full}</td>
      <td class="num">目标 ${s.target}</td>
      <td class="num" style="color:${gap >= 0 ? "var(--green)" : "var(--red)"}">${gap >= 0 ? "+" : ""}${gap}</td></tr>`;
  }).join("");

  render(`<div class="card">
    <h1>模考成绩</h1>
    <div class="hero-nums" style="color:var(--text)">
      <div class="hero-num"><b>${total}</b><span>总分 / 150</span></div>
      <div class="hero-num"><b style="color:${total >= S.meta.target_score ? "var(--green)" : "var(--red)"}">${total - S.meta.target_score >= 0 ? "+" : ""}${total - S.meta.target_score}</b><span>对目标 ${S.meta.target_score}</span></div>
      <div class="hero-num"><b>${used}</b><span>用时（分钟）</span></div>
    </div>
    <table class="sec-table mt"><tbody>${rows}</tbody></table>
    ${wScore == null && wordCount(MOCK.essay) >= 30 ? `<div class="warnbox mt">作文没拿到 AI 分数（没填 Key 或调用失败）。
      <button class="btn btn-sm" id="mk-self">自己打个分</button></div>` : ""}
    ${wFeed ? `<div class="ai-out mt">${esc(wFeed)}</div>` : ""}
  </div>
  ${wrongDrillHTML(wrongList.map((w) => w.q.id), "这套卷")}
  <div class="card">
    <h2>再下一步：逐题归因</h2>
    <p class="sub mb">错的 ${wrongList.length} 道都进错题本了，但还没分类。归了因才知道该补词汇、补句法还是补套路。</p>
    <div class="qbar"><button class="btn" id="mk-attrib">去归因</button>
      <button class="btn btn-ghost" id="mk-home">回首页</button></div>
  </div>`);
  bindWrongDrill(wrongList.map((w) => w.q.id));

  if ($("#mk-self")) $("#mk-self").onclick = () => {
    const v = prompt("按 25 分制给自己的作文打个分（切题+三段结构+词数够+没有低级错误）：", "16");
    const n = parseInt(v, 10);
    if (!isNaN(n)) {
      const last = STATE.essays[STATE.essays.length - 1];
      if (last) last.score = Math.min(25, Math.max(0, n));
      const mk = STATE.mocks[STATE.mocks.length - 1];
      if (mk) { mk.sec.writing = Math.min(25, Math.max(0, n)); mk.total = SECTIONS.reduce((a, s) => a + (mk.sec[s.key] || 0), 0); }
      saveState(); toast("已记入"); go("mock");
    }
  };
  $("#mk-attrib").onclick = () => { MOCK = null; go("wrong"); };
  $("#mk-home").onclick = () => { MOCK = null; go("home"); };
}

/* 错题本每条前面的小标签：难度 · 框架 · 该背/该理解 */
function wrongTags(q) {
  if (!q) return "";
  const lb = levelBadge(q), f = secOf(q) === "grammar" ? frameOf(q) : null;
  const md = (window.FRAME_MODES || {})[f && f.mode] || {};
  return `<span class="wt">${esc(lb.name)}</span>` +
    (f ? `<span class="wt wt-ink">${esc(f.name)}</span><span class="wt ${f.mode === "理解" ? "wt-green" : "wt-orange"}">${md.icon || ""}该${esc(f.mode)}</span>` : "");
}

/* 「错在哪个知识框架」总表 —— 比按错因分类更直接：告诉你该回去补哪一课。
   同时把「该背 / 该理解」摊开：该背的错得多 = 公式没背熟，翻回微课背；
   该理解的错得多 = 句子没读懂，得慢慢想，光刷题没用。 */
function frameStatHTML(ids) {
  const st = {};
  ids.forEach((id) => {
    const q = BY_ID[id];
    if (!q || secOf(q) !== "grammar") return;
    const f = frameOf(q); if (!f) return;
    const r = (st[f.id] = st[f.id] || { f: f, ids: [] });
    r.ids.push(id);
  });
  const rows = Object.values(st).sort((a, b) => b.ids.length - a.ids.length);
  if (!rows.length) return "";
  const nBei = rows.filter((r) => r.f.mode !== "理解").reduce((a, r) => a + r.ids.length, 0);
  const nLi = rows.filter((r) => r.f.mode === "理解").reduce((a, r) => a + r.ids.length, 0);
  const lsn = (f) => {
    if (!f.lesson) return "";
    const l = (window.LESSONS || []).find((x) => x.id === f.lesson);
    return l ? `<button class="btn btn-sm" data-flesson="${esc(f.lesson)}">回去看这一课</button>` : "";
  };
  return `<div class="card"><div class="row"><h2>错在哪个知识框架</h2>
      <span class="tag tag-orange">🧠 该背错 ${nBei} 题</span><span class="tag tag-green">💡 该理解错 ${nLi} 题</span></div>
    <p class="sub mb">${nBei > nLi
      ? "该背的那类错得更多 —— 说明公式还没背熟，回微课把口诀默出来比再刷 20 道题管用。"
      : "该理解的那类错得更多 —— 这类刷题没用，得对着解析图把句子读懂一次。"}</p>
    <table class="tbl"><thead><tr><th>知识框架</th><th>学法</th><th class="num">错题</th><th></th></tr></thead><tbody>
      ${rows.slice(0, 12).map((r) => `<tr>
        <td><b>${esc(r.f.name)}</b><br><span class="muted" style="font-size:12px">${esc(r.f.chapter || ("考点" + r.f.point + " " + ((pointById(r.f.point) || {}).name || "")))}</span></td>
        <td><span class="tag ${r.f.mode === "理解" ? "tag-green" : "tag-orange"}">该${esc(r.f.mode)}</span></td>
        <td class="num">${r.ids.length}</td>
        <td><button class="btn btn-sm" data-fredo="${esc(r.f.id)}">重做</button> ${lsn(r.f)}</td></tr>`).join("")}
    </tbody></table></div>`;
}

/* ============================================================== 错题本 */
ROUTES.wrong = function () {
  const ids = Object.keys(STATE.wrong);
  const pend = ids.filter((id) => !STATE.wrong[id].ec && BY_ID[id]);
  const byEc = {};
  S.error_classes.forEach((e) => (byEc[e.code] = []));
  ids.forEach((id) => {
    const w = STATE.wrong[id];
    if (!w.ec || !BY_ID[id]) return;
    (byEc[w.ec] = byEc[w.ec] || []).push(id);
  });
  const byTrap = {};
  ids.forEach((id) => { const w = STATE.wrong[id]; if (w.ec === "TRAP" && w.trap) (byTrap[w.trap] = byTrap[w.trap] || []).push(id); });

  // 每日随机复习：从整本错题里随机抓一组，点一下就开始（不看到期）
  const drIds = dailyReviewIds();
  const dr = dailyReviewProgress(drIds);
  const drRest = drIds.filter((id) => dr.doneIds.indexOf(id) < 0);

  let cls = "";
  S.error_classes.forEach((e) => {
    const list = byEc[e.code] || [];
    if (e.code === "NONE" && !list.length) return;
    cls += `<div class="card"><div class="row"><h2>${esc(e.name)}</h2>
      <span class="tag ${list.length ? "tag-red" : ""}">${list.length} 题</span><div class="spacer"></div>
      ${list.length ? `<button class="btn btn-sm" data-redo="${e.code}">重做这一类</button>` : ""}</div>
      ${e.fix ? `<p class="sub">对策：${esc(e.fix)}</p>` : ""}
      ${e.code === "TRAP" && Object.keys(byTrap).length ? `<table class="tbl mt"><tbody>${
        S.reading.trap_patterns.map((t) => `<tr><td><b>${esc(t.name)}</b></td><td class="muted">${esc(t.desc)}</td>
          <td class="num">${(byTrap[t.code] || []).length} 题</td></tr>`).join("")}</tbody></table>` : ""}
      ${list.length ? `<div class="mt">${list.slice(0, 6).map((id) => `<div class="phrase"><div style="flex:1">
        <div class="en">${esc(String(BY_ID[id].stem).slice(0, 76))}…</div>
        <div class="use">${wrongTags(BY_ID[id])}${esc(SEC[secOf(BY_ID[id])] ? SEC[secOf(BY_ID[id])].name : "")}${(() => { const w = STATE.wrong[id]; return w.grad ? " · ✅ 已毕业" : w.due ? ` · 🔁 下次回炉 ${w.due}（第 ${(w.box || 0) + 1} 关/共 ${wrongIntervals().length} 关）` : ""; })()}</div></div></div>`).join("")}
        ${list.length > 6 ? `<p class="sub">…还有 ${list.length - 6} 题</p>` : ""}</div>` : ""}
    </div>`;
  });

  render(`
  <div class="card"><h1>错题本</h1>
    <p class="sub">错题只做一件事：<b>再做一遍</b>。错了明天重考，做对间隔拉长（1 → 3 → 7 → 21 天），四关全过毕业出队，中途再错打回明天。</p>
    ${(() => { const d = dueWrongIds().length; return d ? `<div class="row mt"><button class="btn btn-orange" id="w-review">🔁 复习今天到期的错题（${d} 题，一次 12 题）</button></div>` : `<p class="sub mt">今天没有到期的错题。</p>`; })()}
  </div>
  ${drIds.length ? `<div class="card"><div class="row"><h2>每日随机复习</h2>
      <span class="tag ${dr.done >= dr.total ? "tag-green" : "tag-orange"}">今天 ${dr.done} / ${dr.total} 题</span>
      <div class="spacer"></div>
      <button class="btn btn-primary" id="w-daily">${
        drRest.length === dr.total ? "🎲 开始复习这 " + dr.total + " 题"
        : drRest.length ? "▶️ 接着做（还剩 " + drRest.length + " 题）"
        : "🎲 再抽一组"}</button>
      ${dr.done && drRest.length ? `<button class="btn btn-sm" id="w-daily-new">换一组</button>` : ""}</div>
    <p class="sub">不看到期不到期，从整本错题（${ids.filter((i) => BY_ID[i]).length} 题）里随机抓${
      dr.total < DAILY_REVIEW_N ? `全部 ${dr.total}` : ` ${DAILY_REVIEW_N} `}道，点一下直接做。
      没毕业的优先抽。同一天抓到的是同一组，做到一半退出还能接着做，过了零点自动换一组。
      ${drRest.length ? "" : `今天这组做完了，正确 ${dr.ok} / ${dr.total}。`}</p></div>` : ""}
  ${pend.length ? `<details class="acc acc-thin"><summary>给 ${pend.length} 道错题标错因（可选，不标也行）</summary>
    <p class="sub mt">标错因只是为了让上面那张「错因分布」表更准。<b>不标不影响复习</b>——直接回炉做题才是重点。</p>
    <div class="row mt"><button class="btn btn-sm" id="w-attrib">逐题标一下</button></div></details>` : ""}
  ${frameStatHTML(ids)}
  ${cls}
  <div class="card"><h2>清理</h2>
    <p class="sub mb">只能清掉已毕业的（1/3/7/21 天四关全做对）。还在曲线里的错题清不掉——它们还欠着复习。</p>
    <div class="row"><button class="btn" id="w-cleargrad">清掉已毕业的（${ids.filter((i) => STATE.wrong[i].grad).length} 题）</button></div></div>`);

  if ($("#w-attrib")) $("#w-attrib").onclick = () => attribSession(pend);
  $$("[data-fredo]").forEach((b) => (b.onclick = () => {
    const list = ids.map((id) => BY_ID[id]).filter((q) => q && (frameOf(q) || {}).id === b.dataset.fredo);
    if (!list.length) return toast("这一类没有可重做的题");
    startQuiz(shuffle(list).slice(0, 12), { title: "重做 · " + (frameById(b.dataset.fredo) || {}).name, backTo: "wrong" });
  }));
  $$("[data-flesson]").forEach((b) => (b.onclick = () => go("lesson", b.dataset.flesson)));
  $$("[data-redo]").forEach((b) => (b.onclick = () => {
    const list = (byEc[b.dataset.redo] || []).map((id) => BY_ID[id]).filter(Boolean);
    startQuiz(shuffle(list).slice(0, 15), { title: "错题重做", backTo: "wrong" });
  }));
  if ($("#w-daily")) $("#w-daily").onclick = () => {
    const list = (drRest.length ? drRest : dailyReviewIds(true)).map((id) => BY_ID[id]).filter(Boolean);
    startQuiz(shuffle(list), { title: "每日随机复习", backTo: "wrong" });
  };
  if ($("#w-daily-new")) $("#w-daily-new").onclick = () => { dailyReviewIds(true); go("wrong"); };
  if ($("#w-review")) $("#w-review").onclick = () => {
    const list = dueWrongIds().map((id) => BY_ID[id]).filter(Boolean);
    startQuiz(shuffle(list).slice(0, 12), { title: "错题复习", backTo: "wrong" });
  };
  $("#w-cleargrad").onclick = () => {
    Object.keys(STATE.wrong).forEach((id) => { if (STATE.wrong[id].grad) delete STATE.wrong[id]; });
    saveState(); go("wrong");
  };
};

/* 逐题归因会话 */
function attribSession(ids) {
  let i = 0;
  const step = () => {
    while (i < ids.length && !BY_ID[ids[i]]) i++;
    if (i >= ids.length) { toast("归因完成"); go("wrong"); return; }
    const q = BY_ID[ids[i]];
    render(`<div class="card">
      <div class="q-head"><b>逐题归因</b><div class="spacer"></div><span class="qprog">${i + 1} / ${ids.length}</span></div>
      <div class="stem">${esc(q.stem)}</div>
      <div class="opts">${q.options.map((o, k) => `<button class="opt ${k === q.answer ? "right" : "dim"}" disabled><b>${letter(k)}</b><span>${escOpt(o)}${q.optionNotes && q.optionNotes[k] ? `<span class="opt-note">${esc(q.optionNotes[k])}</span>` : ""}</span></button>`).join("")}</div>
      ${explainHTML(q, null)}
      ${attribHTML(q)}
      <div class="qbar"><button class="btn btn-primary" id="at-next" disabled>下一题</button>
        <button class="btn btn-ghost" id="at-quit">先不弄了</button></div>
    </div>`);
    let ec = null, trap = null;
    $$("#ec-row .ec-btn").forEach((b) => (b.onclick = () => {
      $$("#ec-row .ec-btn").forEach((x) => x.classList.remove("on"));
      b.classList.add("on"); ec = b.dataset.ec;
      const def = S.error_classes.find((e) => e.code === ec);
      $("#ec-fix").textContent = def && def.fix ? "→ 对策：" + def.fix : "";
      $("#trap-row").classList.toggle("hidden", ec !== "TRAP");
      $("#at-next").disabled = false;
    }));
    $$("#trap-row .ec-btn").forEach((b) => (b.onclick = () => {
      $$("#trap-row .ec-btn").forEach((x) => x.classList.remove("on"));
      b.classList.add("on"); trap = b.dataset.trap;
    }));
    $("#at-next").onclick = () => { setErrorClass(q.id, ec, trap); i++; step(); };
    $("#at-quit").onclick = () => go("wrong");
    bindLookup();
  };
  step();
}

/* ============================================================== 设置 */
ROUTES.settings = function () {
  const s = STATE.settings;
  render(`
  <div class="card"><h1>设置</h1></div>
  <div class="card"><h2>考试</h2>
    <label class="field">考试日期<input type="date" id="se-exam" value="${esc(s.examDate)}"></label>
    <p class="sub">改了日期，首页的阶段判定会跟着变（按距考试的周数倒推）。</p></div>

  <div class="card"><h2>AI（可选）</h2>
    <p class="sub mb">不填也能用：刷题、模板、对话场景、模考全都不依赖 AI。填了之后多出：讲题、作文批改、长句拆解、划词查释义。</p>
    <label class="field">API Key<input type="password" id="se-key" value="${esc(s.apiKey)}" placeholder="sk-ant-..."></label>
    <label class="field">接口地址（第三方中转填它给的，官方就留默认）<input type="text" id="se-base" value="${esc(s.apiBase)}"></label>
    <label class="field">接口格式<select id="se-fmt">
      <option value="anthropic" ${s.apiFormat === "anthropic" ? "selected" : ""}>anthropic（原生 /v1/messages）</option>
      <option value="openai" ${s.apiFormat === "openai" ? "selected" : ""}>openai（兼容 /v1/chat/completions）</option></select></label>
    <div class="row">
      <label class="field" style="flex:1">日常模型<input type="text" id="se-fast" value="${esc(s.modelFast)}"></label>
      <label class="field" style="flex:1">批改模型<input type="text" id="se-strong" value="${esc(s.modelStrong)}"></label>
    </div>
    <div class="row"><button class="btn" id="se-test">测试连接</button><span id="se-test-out" class="sub"></span></div></div>

  <div class="card"><h2>外观与朗读</h2>
    <label class="field">主题<select id="se-theme">
      <option value="" ${!s.theme ? "selected" : ""}>跟随系统</option>
      <option value="light" ${s.theme === "light" ? "selected" : ""}>浅色</option>
      <option value="dark" ${s.theme === "dark" ? "selected" : ""}>深色</option></select></label>
    <label class="field">显示大小（看着费眼就调大）<select id="se-zoom">
      <option value="" ${!s.zoom ? "selected" : ""}>标准</option>
      <option value="1.1" ${s.zoom === "1.1" ? "selected" : ""}>大（110%）</option>
      <option value="1.2" ${s.zoom === "1.2" ? "selected" : ""}>特大（120%）</option></select></label>
    <label class="field">朗读语音<select id="se-voice"><option value="">自动</option></select></label></div>

  <div class="card"><h2>存档</h2>
    <p class="sub mb">${HAS_SERVER ? "已通过本地服务器运行，进度会自动备份到 backups/ 目录（和老版 App 分开存，互不覆盖）。" : "现在是双击打开（file://），进度只在浏览器里。建议改用「启动学习.command」，进度会额外存一份到硬盘。"}</p>
    <div class="row"><button class="btn" id="se-export">导出存档</button>
      <label class="btn" style="cursor:pointer">导入存档<input type="file" id="se-import" accept="application/json" class="hidden"></label>
      <div class="spacer"></div>
      <button class="btn btn-ghost" id="se-clear" style="color:var(--red)">清空进度</button></div>
    <p class="sub mt">已记录：${STATE.log.length} 次作答 · ${Object.keys(STATE.wrong).length} 道错题 · ${STATE.essays.length} 篇作文 · ${STATE.mocks.length} 次模考</p></div>

  <div class="card"><h2>题库</h2>
    <table class="tbl"><thead><tr><th>板块</th><th>题量</th><th>说明</th></tr></thead><tbody>
      ${SECTIONS.filter((x) => x.key !== "writing").map((x) => `<tr><td>${esc(x.name)}</td><td class="num">${(BY_SEC[x.key] || []).length}</td>
        <td class="muted">${x.key === "grammar" ? `其中 7 大考点内 ${grammarInScope().length} 题，超纲 ${grammarOutScope().length} 题` : ""}</td></tr>`).join("")}
    </tbody></table>
    <p class="sub mt">真题 ${BANK.filter((q) => q.real).length} 题 · 模拟卷 ${BANK.filter((q) => q.mock).length} 题。
      加题：往 js/questions-*.js 里追加即可，字段见文件头注释。</p></div>

  <div class="card"><h2>这个 App 不做什么</h2>
    <ul style="padding-left:18px;font-size:14px">${S.ui_rules.must_not_do.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
    <p class="sub mt">上面四条写在 strategy.js 里。如果哪天想加进度条或打卡，先回头看一眼为什么当初决定不加。</p></div>`);

  $("#se-exam").onchange = (e) => { s.examDate = e.target.value; saveState(); toast("已保存"); };
  ["key:apiKey", "base:apiBase", "fast:modelFast", "strong:modelStrong"].forEach((p) => {
    const [id, field] = p.split(":");
    $("#se-" + id).onchange = (e) => { s[field] = e.target.value.trim(); saveState(); toast("已保存"); };
  });
  $("#se-fmt").onchange = (e) => { s.apiFormat = e.target.value; saveState(); };
  $("#se-theme").onchange = (e) => { s.theme = e.target.value; saveState(); applyTheme(); };
  $("#se-zoom").onchange = (e) => { s.zoom = e.target.value; saveState(); applyZoom(); toast("已调整显示大小"); };
  $("#se-test").onclick = async () => {
    const out = $("#se-test-out");
    out.textContent = "测试中…";
    const t0 = Date.now();
    let base = "";
    try {
      const t = await callClaude({ messages: [{ role: "user", content: "只回两个字：正常" }], maxTokens: 20 });
      base = `✅ ${t}（${((Date.now() - t0) / 1000).toFixed(1)} 秒）`;
    } catch (e) { out.textContent = "❌ " + e.message; return; }
    // 再探一次流式通道：能逐字输出的话讲题体验会好很多
    out.textContent = base + " · 正在测流式…";
    const t1 = Date.now();
    let first = 0;
    try {
      await callClaude({ messages: [{ role: "user", content: "从1数到5，用逗号隔开" }], maxTokens: 30,
        _probe: true, onDelta: () => { if (!first) first = Date.now() - t1; } });
      out.textContent = base + ` · 流式可用 ✓（首字 ${(first / 1000).toFixed(1)} 秒）`;
    } catch (e) {
      out.textContent = base + " · 流式不可用（讲题要等全文生成完才显示，属于中转的限制）";
    }
  };
  $("#se-export").onclick = exportState;
  $("#se-import").onchange = (e) => { if (e.target.files[0]) importState(e.target.files[0], (ok, m) => { toast(m); if (ok) go("home"); }); };
  $("#se-clear").onclick = () => {
    if (!confirm("清空所有进度？错题、作文、模考记录都会没。")) return;
    localStorage.removeItem(STORE_KEY);
    localStorage.setItem("ck_no_restore_v2", "1");
    STATE = defaultState(); saveState(); go("home"); toast("已清空");
  };
  // 语音列表
  const fill = () => {
    const sel = $("#se-voice"); if (!sel) return;
    const vs = (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter((v) => /^en/.test(v.lang));
    sel.innerHTML = `<option value="">自动</option>` + vs.map((v) => `<option value="${esc(v.name)}" ${s.voiceName === v.name ? "selected" : ""}>${esc(v.name)}（${esc(v.lang)}）</option>`).join("");
    sel.onchange = (e) => { s.voiceName = e.target.value; saveState(); speak("This is a test."); };
  };
  fill();
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = fill;
};

/* ============================================================== 启动 */
function applyTheme() {
  const t = STATE.settings.theme;
  document.documentElement.dataset.theme = t || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
/* 显示大小：整页缩放。zoom 属性 Chrome/Safari/新版 Firefox 都支持，用户用 Chrome。 */
function applyZoom() {
  document.body.style.zoom = STATE.settings.zoom || "";
}

function boot() {
  loadState();
  applyTheme();
  applyZoom();
  $("#theme-btn").onclick = () => {
    const cur = document.documentElement.dataset.theme;
    STATE.settings.theme = cur === "dark" ? "light" : "dark";
    saveState(); applyTheme();
  };
  bindLookup();
  go("today");     // 每天打开就落在「今天」，跟着做就行
}

/* ⚠️ 必须等所有 <script> 都执行完再 boot（2026-09-12 踩的大坑）：
   tryAutoRestore() 在「本地已有存档」时是 `Promise.resolve(null)` —— 同步就 resolve 了，
   于是 .then(boot) 会在 **ui.js 刚执行完的那个微任务里**跑掉，
   那时排在 ui.js 后面的 collocations.js / sprint.js 还没执行，
   `typeof sprintTasks === "function"` 为假 → 冲刺分支被跳过 → 首屏掉回旧的「学习路线」清单。
   （症状：今天页出现 7 件、带路线和完形；手动再 go("today") 又正常，所以特别难发现。）
   DOMContentLoaded 保证在**全部同步脚本执行完**之后才触发。 */
function startApp() {
  tryAutoRestore().then((when) => {
    boot();
    if (when) toast("已从硬盘备份恢复进度（" + when + "）", 4000);
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startApp);
else startApp();
