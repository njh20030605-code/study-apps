/* ============================================================================
 * core.js —— 存档 / 日期 / 题库索引 / 分数模型
 * ----------------------------------------------------------------------------
 * 这一层只负责「算」，不碰界面。界面在 ui.js。
 * 设计原则全部来自 strategy.js：
 *   - 进度按板块「当前分 / 目标分」显示，不做总覆盖率进度条
 *   - 每道错题必须落 error_class
 *   - 语法只认 7 大考点，其余判超纲（但真题里搭配/辨析占 29%，UI 里单列出来了）
 *   - 不做背单词、不做拼写默写：用户在别的 App 背词，这里只做划词查义
 * ========================================================================== */

const S = window.STRATEGY;
const STORE_KEY = "ck_en_strategy_v1";     // 新存档键；老版 App 的 ck_english_tutor_v1 原样保留，互不干扰
const BACKUP_NS = "v2";                    // 硬盘备份命名空间，避免冲掉老版的 backups/latest.json

/* ---------------------------------------------------------------- 默认存档 */
function defaultState() {
  return {
    settings: {
      // ↓ 这几个字段名不能改，api.js 直接读它们
      apiKey: "",
      apiBase: "https://api.anthropic.com",
      apiFormat: "anthropic",
      modelFast: "claude-haiku-4-5-20251001",
      modelStrong: "claude-sonnet-5",
      examDate: "2026-10-17",
      // 只出卷子题（真题 + 全真模拟卷），自编练习题不出。冲刺期默认开。
      examOnly: true,
      // 冲刺模式（2026-09-10 用户定：进入备战最后状态）。默认开：只练真题、按题型成组、
      // 每题做完出解析。老存档里没有这个字段，loadState 的 Object.assign 会让默认值生效
      // ——想回到学习路线模式，在「真题」页点一下关掉，关掉的选择会存下来。
      sprint: true,
      writingOnly: true,         // 2026-09-13 用户定：新概念1+背单词在 App 外学，这里只练作文
      theme: "",                 // "" 跟随系统 / "light" / "dark"
      zoom: "",                  // 显示大小："" 标准 / "1.1" 大 / "1.2" 特大
      voiceName: "",
    },
    answers: {},   // { qid: {seen, wrong, lastOk, lastTs} }
    log: [],       // 作答流水 [{ts, qid, sec, ok, ec, trap}]，只留最近 3000 条
    wrong: {},     // 错题本 { qid: {ec, trap, ts, note, fixed} }
    essays: [],    // 作文 [{id, date, prompt, text, words, score, feedback}]
    mocks: [],     // 模考 [{date, total, sec:{}, used}]
    sentences: [], // 长句拆解练习 [{ts, en, note}]
    reads: {},     // 每日一读进度 { 篇号: {d, correct, total} }，答对≥2/3算过
    seenScenes: {},// 对话场景朗读记录
    daily: {},     // 每日练习完成情况 { 'yyyy-mm-dd': {done:[taskId,...]} }
    lessons: {},   // 微课完成记录 { lessonId: {d, correct, total} }
    course: {},    // 学习路线各节记录 { unitId: {d, correct, total, pass} }
    dict: {},      // 划词释义缓存 { 小写词: 释义 } —— 查过的词下次秒出、不花钱
    qhelp: {},     // 「读懂这道题」缓存 { qid: {stem,ans,ctx,ctxZh,words:[[词,词性,中文]]} } —— 一道题只花一次钱
    coach: null,   // AI 教练点评缓存 { d:'yyyy-mm-dd', text } —— 一天只生成一次，省钱
    dailyReview: null, // 每日随机复习抽到的那组错题 { d:'yyyy-mm-dd', ids:[qid,...] } —— 同一天点开是同一组
  };
}

let STATE = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    STATE = raw ? Object.assign(defaultState(), JSON.parse(raw)) : defaultState();
    STATE.settings = Object.assign(defaultState().settings, STATE.settings || {});
    // 旧存档的错题没有曲线字段（box/due/grad）：补上，当作今天到期，进入循环
    Object.keys(STATE.wrong || {}).forEach((id) => {
      const w = STATE.wrong[id];
      if (w && w.due === undefined && !w.grad) { w.box = w.fixed ? 1 : 0; w.due = todayStr(); }
    });
  } catch (e) {
    console.error("读取存档失败，用默认存档：", e);
    STATE = defaultState();
  }
  return STATE;
}

function saveState() {
  try {
    if (STATE.log.length > 3000) STATE.log = STATE.log.slice(-3000);
    const dk = Object.keys(STATE.dict || {});
    if (dk.length > 800) dk.slice(0, dk.length - 800).forEach((k) => delete STATE.dict[k]);
    localStorage.setItem(STORE_KEY, JSON.stringify(STATE));
  } catch (e) {
    console.error("保存失败：", e);
    toast("保存失败，可能是浏览器存储空间不足");
  }
  scheduleBackup();
}

/* ------------------------------------------------- 硬盘备份（有服务器才有） */
const HAS_SERVER = location.protocol === "http:" || location.protocol === "https:";
let _bkTimer = null, _lastBk = "";

function hasProgress(s) {
  return !!(s && s.log && s.log.length > 0);
}
function scheduleBackup() {
  if (!HAS_SERVER) return;
  clearTimeout(_bkTimer);
  _bkTimer = setTimeout(pushBackup, 8000);
}
function pushBackup() {
  if (!HAS_SERVER || !hasProgress(STATE)) return;   // 空存档不上传，别冲掉硬盘上的好备份
  try {
    const body = JSON.stringify(STATE);
    if (body === _lastBk) return;
    fetch("/api/backup?app=" + BACKUP_NS, { method: "POST", headers: { "Content-Type": "application/json" }, body })
      .then((r) => { if (r.ok) { _lastBk = body; localStorage.removeItem("ck_no_restore_v2"); } })
      .catch(() => {});
  } catch (e) {}
}
window.addEventListener("beforeunload", function () {
  if (!HAS_SERVER || !hasProgress(STATE)) return;
  try {
    const body = JSON.stringify(STATE);
    // .catch 必须有：页面正在卸载时这个请求经常被中断，不接住会在控制台刷一堆
    // "Uncaught (in promise) Failed to fetch"，把真正的报错淹掉
    if (body !== _lastBk) fetch("/api/backup?app=" + BACKUP_NS, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  } catch (e) {}
});
function tryAutoRestore() {
  if (!HAS_SERVER) return Promise.resolve(null);
  if (localStorage.getItem(STORE_KEY)) return Promise.resolve(null);
  if (localStorage.getItem("ck_no_restore_v2")) return Promise.resolve(null);
  return fetch("/api/backup/latest?app=" + BACKUP_NS)
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (!j || !j.ok || !j.state || !hasProgress(j.state)) return null;
      STATE = Object.assign(defaultState(), j.state);
      STATE.settings = Object.assign(defaultState().settings, STATE.settings || {});
      localStorage.setItem(STORE_KEY, JSON.stringify(STATE));
      return j.savedAt || "未知时间";
    })
    .catch(() => null);
}

function exportState() {
  const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `成考英语-策略版存档-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function importState(file, done) {
  const r = new FileReader();
  r.onload = (e) => {
    try {
      STATE = Object.assign(defaultState(), JSON.parse(e.target.result));
      STATE.settings = Object.assign(defaultState().settings, STATE.settings || {});
      saveState();
      done(true, "导入成功");
    } catch (err) { done(false, "文件不是有效的存档 JSON"); }
  };
  r.readAsText(file);
}

/* -------------------------------------------------------------------- 日期 */
/* 一律用本地时区，不用 toISOString（UTC 会让中国用户早一天，老版踩过） */
function fmtDate(d) {
  const p = (n) => (n < 10 ? "0" + n : "" + n);
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function todayStr() { return fmtDate(new Date()); }
function parseDate(s) { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d); }
function daysBetween(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000); }
function daysToExam() { return daysBetween(todayStr(), STATE.settings.examDate || "2026-10-17"); }

/* 当前处于哪个备考阶段：按「距考试还剩几周」倒推，而不是按开始学的日期
   （用户随时可能开始，倒推才不会算出一个早就过去的阶段）。
   stages 覆盖 W1-W11 共 11 周：剩 ≤2 周=W10 冲刺，≤5 周=W7-9，≤9 周=W3-6，否则 W1-2。 */
function currentStage() {
  const st = S.config.stages, d = daysToExam();
  if (d <= 14) return st[3];
  if (d <= 35) return st[2];
  if (d <= 63) return st[1];
  return st[0];
}
/* 距考试的「第几周」（1 = 计划第一周），用于显示 */
function planWeek() {
  const d = daysToExam();
  return Math.max(1, 12 - Math.ceil(d / 7));
}

/* ------------------------------------------------------ 每日时间预算与记账 */
/* 时间预算不是拍脑袋定的，是从策略里算的：
   工作日 weekday_minutes(60) × 英语占比(30%) = 18 分钟
   周末   weekend_minutes(180) × 英语占比(30%) = 54 分钟
   任务只排到预算为止，排不下的就不排 —— 这是「每天该做多少」的唯一依据。 */
function isWeekendDay(d) {
  const w = (d || new Date()).getDay();
  return w === 0 || w === 6;
}
function dailyBudgetMin() {
  const base = isWeekendDay() ? S.config.weekend_minutes : S.config.weekday_minutes;
  return Math.round(base * S.config.subject_time_split.english);
}
/* 用「距 1970 的天数」做轮换种子：同一天永远排同一套任务（刷新不会换），
   换一天自动轮到下一个考点/场景/模板。 */
function dayIndex() { return Math.floor(parseDate(todayStr()).getTime() / 86400000); }
function rotate(list, offset) { return list.length ? list[(dayIndex() + (offset || 0)) % list.length] : null; }

function dailyRec() {
  const t = todayStr();
  if (!STATE.daily[t]) STATE.daily[t] = { done: [], planned: [] };
  if (!STATE.daily[t].planned) STATE.daily[t].planned = [];
  return STATE.daily[t];
}
/* 今天排过哪些任务。用途：债还完之后（比如错题全归因了）任务不该整条消失，
   否则「今天 3 件事」会悄悄变成 2 件，看着像自己记错了。记下来就还能显示成已完成。 */
function wasPlannedToday(id) { return dailyRec().planned.indexOf(id) >= 0; }
function notePlanned(ids) {
  const r = dailyRec();
  let changed = false;
  ids.forEach((id) => { if (r.planned.indexOf(id) < 0) { r.planned.push(id); changed = true; } });
  if (changed) saveState();
}
function isTaskDone(id) { return dailyRec().done.indexOf(id) >= 0; }
function markTask(id, done) {
  const r = dailyRec();
  const i = r.done.indexOf(id);
  if (done && i < 0) r.done.push(id);
  if (!done && i >= 0) r.done.splice(i, 1);
  saveState();
}

/* 记分牌上「差目标最远」的必投入板块 —— 每日练习拿它来决定补哪一块 */
function weakestSection() {
  let worst = null, gap = -99;
  SECTIONS.forEach((s) => {
    if (!s.invest || s.key === "writing") return;
    const sc = secScore(s.key);
    const g = s.target - sc.score;
    if (g > gap) { gap = g; worst = s; }
  });
  return worst;
}

/* ------------------------------------------------------------ 板块 / 题库 */
const SECTIONS = S.config.sections;
const SEC = {}; SECTIONS.forEach((s) => (SEC[s.key] = s));

/* 题库里的 module → 策略里的 section */
const MODULE2SEC = {
  phonetics: "phonetics",
  grammar: "grammar",
  collocation: "grammar",
  cloze: "cloze",
  reading: "reading",
  conversation: "dialogue",
};
function secOf(q) { return MODULE2SEC[q.module] || null; }

/* 7 大考点 ← 题库 topic 的映射。不在表里的 topic 一律「超纲」。 */
const POINT_TOPICS = {
  1: ["non-finite", "gerund", "too-to", "to-do"],
  2: ["relative-clause"],
  3: ["present-perfect", "past-perfect", "past-continuous", "present-continuous",
      "present-simple", "future-will", "past-be", "have-has", "used-to", "tense"],
  4: ["subjunctive", "conditional"],
  5: ["inversion", "emphasis"],
  6: ["subject-verb-agreement", "there-be"],
  7: ["conjunction", "correlative", "so-that"],
};
const TOPIC2POINT = {};
Object.keys(POINT_TOPICS).forEach((pid) => POINT_TOPICS[pid].forEach((t) => (TOPIC2POINT[t] = +pid)));
function pointOf(q) { return TOPIC2POINT[q.topic] || 0; }   // 0 = 超纲
function pointById(id) { return S.grammar.points.find((p) => p.id === +id); }

/* ---------------------------------------------------- 知识框架（frames.js） */
/* 每道语法题 → 一个「框架」。框架带 该背/该理解、公式图、判断步骤、口诀，
   同时决定课后练习能出哪些题（只出已经上过课的框架）。
   匹配只在【同考点】的框架里找，避免跨考点误判；找不到就用考点级兜底。 */
const _FRAME_CACHE = {};
function frameOf(q) {
  if (!q) return null;
  if (_FRAME_CACHE[q.id] !== undefined) return _FRAME_CACHE[q.id];
  const list = window.FRAMES || [];
  const pt = pointOf(q);
  let f = null;
  for (let i = 0; i < list.length; i++) {
    if (list[i].point !== pt) continue;
    try { if (list[i].match(q)) { f = list[i]; break; } } catch (e) { /* 匹配函数写错不能拖垮全局 */ }
  }
  if (!f) f = (window.FRAME_FALLBACK || {})[pt] || (window.FRAME_FALLBACK || {})[0] || null;
  _FRAME_CACHE[q.id] = f;
  return f;
}
function frameById(id) { return (window.FRAMES || []).find((f) => f.id === id) || null; }
/* 难度标识：地基 / 搭桥 / 过渡 / 真题级（跟地基阶梯的四级同一套口径） */
function levelBadge(q) {
  const n = levelOf(q);
  if (n === 1) return { n: 1, name: "地基", desc: "新概念1 前 80 课就能做对" };
  if (n === 2 && q.bridge) return { n: 2, name: "搭桥", desc: "只考一个套路，词全认识" };
  if (n === 2) return { n: 3, name: "过渡", desc: "成考常考，比真题温和一档" };
  return { n: 4, name: "真题级", desc: "真题原题难度" };
}
/* 学法：该背还是该理解（用户 2026-08-16 要求的标签） */
function frameMode(q) {
  const f = frameOf(q);
  const m = (f && f.mode) || "理解";
  return Object.assign({ mode: m }, (window.FRAME_MODES || {})[m] || {});
}
/* 已经上过课的框架集合 —— 课后练习/章末过关的范围就以它为准。
   upto = 微课 id（含），不传则取整条路线已过关的部分。 */
function taughtFrameIds(uptoLessonId) {
  const L = window.LESSONS || [];
  const idx = uptoLessonId ? L.findIndex((l) => l.id === uptoLessonId) : -1;
  const okLesson = {};
  L.forEach((l, i) => { if (idx < 0 || i <= idx) okLesson[l.id] = 1; });
  const out = {};
  (window.FRAMES || []).forEach((f) => { if (f.lesson && okLesson[f.lesson]) out[f.id] = 1; });
  return out;
}

/* 阅读题型识别（题库没有标，用题干关键词判断）——决定必做/次做/可放弃 */
function readingType(q) {
  const t = (q.stem || "").toLowerCase() + " " + (q.stem || "");
  if (/attitude|态度|author.*(feel|think of)|作者.*(看法|态度)/.test(t)) return "态度题";
  if (/infer|imply|implied|推断|推知|可以看出|suggests that|conclude/.test(t)) return "推断题";
  if (/main idea|best title|mainly about|main purpose|主旨|标题|主要讲|大意|中心/.test(t)) return "主旨题";
  if (/mean|means|meaning|refer to|refers to|词义|意思是|指的是|closest in meaning/.test(t)) return "词义猜测题";
  return "细节题";
}
const READ_PRIORITY = {};   // 题型 → 必做/次做/可放弃
Object.keys(S.config.reading_priority).forEach((k) =>
  S.config.reading_priority[k].forEach((t) => (READ_PRIORITY[t] = k)));

/* 全部题目（各 questions*.js 已经把自己 concat 进 window.QUESTIONS） */
/* ⚠️ 2026-09-12 用户拍板：「不是真题的题都可以剔除了，现在进入最后的冲刺」。
   自编练习题（453 道）全部从题库里摘掉 —— 它们正是让语法正确率虚高的元凶：
   他在自编题上 551 题 75%，到了真卷只剩 20%。冲刺期练假题＝浪费时间还骗自己。
   保留：真题 168 + 全真模拟卷 309（印刷卷原题原序，是阅读/完形的唯一题量来源；
   只留真题的话阅读仅 40 题、5 天就练完）。
   这是个开关不是删除：设置里关掉 examOnly 就全回来，答题记录也不丢。 */
const _ALL_Q = (window.QUESTIONS || []).filter((q) => q && q.options && q.options.length);
/* ⚠️ BANK 在模块加载时就算好了，而 STATE 要等 boot() 里 loadState() 才有 —— 
   所以这里不能读 STATE，只能直接翻 localStorage，否则开关永远失效。 */
const EXAM_ONLY = (() => {
  try { const r = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
        return !(r.settings && r.settings.examOnly === false); }
  catch (e) { return true; }
})();
const BANK = EXAM_ONLY ? _ALL_Q.filter((q) => q.real || q.mock) : _ALL_Q;
const BY_SEC = {};
SECTIONS.forEach((s) => (BY_SEC[s.key] = []));
BANK.forEach((q) => { const s = secOf(q); if (s && BY_SEC[s]) BY_SEC[s].push(q); });
const BY_ID = {}; BANK.forEach((q) => (BY_ID[q.id] = q));

/* 同一篇短文 / 同一段对话下的题，录题时往往只有第一题挂了 passage 字段
   （模拟卷二的完形、5 篇阅读、补全对话全是这么录的）。谁要是直接读 q.passage，
   第 2 题起就会拿到 undefined —— 屏幕上原文凭空消失，题根本没法做（模考里踩过）。
   所以取原文一律走 passageOf()：先看本题，再按 passageId 回落到同组的原文。 */
const PASSAGE_BY_PID = {};
BANK.forEach((q) => {
  if (q.passageId && q.passage && !PASSAGE_BY_PID[q.passageId]) PASSAGE_BY_PID[q.passageId] = q.passage;
});
function passageOf(q) {
  if (!q) return "";
  return q.passage || (q.passageId ? PASSAGE_BY_PID[q.passageId] || "" : "");
}

function grammarInScope() { return BY_SEC.grammar.filter((q) => pointOf(q) > 0); }
function grammarOutScope() { return BY_SEC.grammar.filter((q) => pointOf(q) === 0); }
function questionsOfPoint(pid) { return BY_SEC.grammar.filter((q) => pointOf(q) === +pid); }

/* 阅读/完形按 passageId 归组，整篇一起做 */
function groupByPassage(list) {
  const groups = [], map = {};
  list.forEach((q) => {
    const k = q.passageId || q.id;
    if (!map[k]) { map[k] = { key: k, passage: passageOf(q), qs: [] }; groups.push(map[k]); }
    if (!map[k].passage) map[k].passage = passageOf(q);
    map[k].qs.push(q);
  });
  return groups;
}

/* 组卷：没做过的排前面，做错过的次之，做对过的最后 */
function orderForPractice(list) {
  const rec = STATE.answers;
  return list.slice().sort((a, b) => {
    const ra = rec[a.id], rb = rec[b.id];
    const ka = !ra ? 0 : ra.lastOk ? 2 : 1;
    const kb = !rb ? 0 : rb.lastOk ? 2 : 1;
    if (ka !== kb) return ka - kb;
    return (ra ? ra.lastTs : 0) - (rb ? rb.lastTs : 0);
  });
}

/* ------------------------------------------------------------ 作答与归因 */
/* 记一次作答。错题必须带 ec（error_class 代码），这是复盘的唯一输入。 */
function recordAnswer(q, ok, ec, trap) {
  const sec = secOf(q) || "grammar";
  const a = STATE.answers[q.id] || { seen: 0, wrong: 0, lastOk: false, lastTs: 0 };
  a.seen++; if (!ok) a.wrong++;
  a.lastOk = !!ok; a.lastTs = Date.now();
  STATE.answers[q.id] = a;
  STATE.log.push({ ts: Date.now(), d: todayStr(), qid: q.id, sec: sec, ok: !!ok, ec: ec || (ok ? "NONE" : ""), trap: trap || "" });
  if (!ok) {
    // 错了 → 进错题本，按遗忘曲线明天回炉（不当天重现——当天你还记着答案，考了也是假会）
    const w = STATE.wrong[q.id] || { ts: Date.now() };
    w.ec = ec || w.ec || ""; w.trap = trap || w.trap || "";
    w.fixed = false; w.grad = false; w.box = 0; w.due = dueDate(wrongIntervals()[0]);
    STATE.wrong[q.id] = w;
  } else if (STATE.wrong[q.id] && !STATE.wrong[q.id].grad) {
    // 错题做对了 → 间隔往后翻一格（1→3→7→21 天），走完全部间隔毕业
    const w = STATE.wrong[q.id], iv = wrongIntervals();
    w.fixed = true;
    w.box = (w.box || 0) + 1;
    if (w.box >= iv.length) { w.grad = true; w.due = null; }
    else w.due = dueDate(iv[w.box]);
  }
  saveState();
}

/* ---------------------------------------------------- 错题的遗忘曲线 */
/* 间隔直接用策略里的 srs_intervals.RECOGNIZE（1/3/7/21 天）。
   规则：错了明天回炉；回炉做对间隔拉长一格；中途再错打回第一格；
   走完全部间隔 = 毕业（grad），不再出现，除非又做错。 */
function wrongIntervals() {
  return (S.config.srs_intervals && S.config.srs_intervals.RECOGNIZE) || [1, 3, 7, 21];
}
function dueDate(days) { const d = parseDate(todayStr()); d.setDate(d.getDate() + days); return fmtDate(d); }
/* 今天到期该回炉的错题 id */
function dueWrongIds() {
  const t = todayStr();
  return Object.keys(STATE.wrong).filter((id) => {
    const w = STATE.wrong[id];
    return BY_ID[id] && !w.grad && w.due && daysBetween(w.due, t) >= 0;
  });
}
/* ------------------------------------------ 每日随机复习（错题本里点一下就练）
   和上面的遗忘曲线是两回事：曲线只挑「今天到期」的，有时候一道都没有。
   这个不管到期不到期，从整本错题里随机抓 20 道，点一下就开始。
   同一天抓到的是同一组（存进 STATE.dailyReview），做到一半退出还能接着做；
   过了零点自动换一组。做对做错照样走上面那条遗忘曲线，不另开一套记账。 */
const DAILY_REVIEW_N = 20;
function dailyReviewIds(force) {
  const t = todayStr(), cur = STATE.dailyReview;
  if (!force && cur && cur.d === t) {
    const keep = cur.ids.filter((id) => BY_ID[id]);   // 题库改动过就把找不到的剔掉
    if (keep.length) {
      if (keep.length !== cur.ids.length) { cur.ids = keep; saveState(); }
      return keep;
    }
  }
  // 没毕业的优先（那些才是真没掌握的），不够 20 道再拿已毕业的填满
  const all = Object.keys(STATE.wrong).filter((id) => BY_ID[id]);
  const ids = shuffle(all.filter((id) => !STATE.wrong[id].grad))
    .concat(shuffle(all.filter((id) => STATE.wrong[id].grad)))
    .slice(0, DAILY_REVIEW_N);
  STATE.dailyReview = { d: t, ids: ids };
  saveState();
  return ids;
}
/* 这组今天做了几道、对了几道 —— 直接从作答流水里数，不另存一份进度（省得两边对不上） */
function dailyReviewProgress(ids) {
  const t = todayStr(), set = {};
  ids.forEach((id) => (set[id] = 1));
  const rec = {};
  STATE.log.forEach((r) => { if (r.d === t && set[r.qid]) rec[r.qid] = r.ok; });
  const done = Object.keys(rec);
  return { doneIds: done, done: done.length, ok: done.filter((id) => rec[id]).length, total: ids.length };
}

/* 补一次归因（错题本里改分类用） */
function setErrorClass(qid, ec, trap) {
  if (!STATE.wrong[qid]) STATE.wrong[qid] = { ts: Date.now(), fixed: false };
  STATE.wrong[qid].ec = ec; STATE.wrong[qid].trap = trap || "";
  for (let i = STATE.log.length - 1; i >= 0; i--) {
    if (STATE.log[i].qid === qid) { STATE.log[i].ec = ec; STATE.log[i].trap = trap || ""; break; }
  }
  saveState();
}
/* 还没归因的错题。必须过滤掉题库里已经没有的 id（改过题库后会留下孤儿记录），
   否则首页提示的数量和错题本里能点开的数量对不上。 */
function pendingErrorClass() {
  return Object.keys(STATE.wrong).filter((id) => !STATE.wrong[id].ec && BY_ID[id]);
}

/* ------------------------------------------------------------ 分数模型 */
/* 「当前分」= 该板块最近 N 次作答正确率 × 卷面满分。
   样本 <5 视为没数据（显示 —），不硬凑一个假分数。 */
const SCORE_WINDOW = 24;
const SCORE_MIN_SAMPLE = 8;      // 少于这个数不给分：5 题全对就报满分，看着爽但是假的
const SCORE_STABLE = 12;         // 少于这个数标注「样本还少」
function secRate(key) {
  const rows = STATE.log.filter((r) => r.sec === key);
  if (rows.length < SCORE_MIN_SAMPLE) return null;
  const w = rows.slice(-SCORE_WINDOW);
  return w.filter((r) => r.ok).length / w.length;
}
function secSample(key) { return STATE.log.filter((r) => r.sec === key).length; }
function secScore(key) {
  const s = SEC[key];
  // 语音：策略是零投入统一蒙 C，当前分就按蒙的期望值算，不按练习正确率
  if (key === "phonetics") return { score: s.target, rate: 0.25, guessed: true };
  if (key === "writing") {
    const es = STATE.essays.filter((e) => typeof e.score === "number");
    if (!es.length) return { score: 0, rate: null, none: true };
    const avg = es.slice(-3).reduce((a, e) => a + e.score, 0) / Math.min(3, es.length);
    return { score: Math.round(avg), rate: avg / s.full };
  }
  const r = secRate(key);
  if (r === null) return { score: 0, rate: null, none: true };
  return { score: Math.round(r * s.full), rate: r };
}
function totalScore() {
  let t = 0;
  SECTIONS.forEach((s) => (t += secScore(s.key).score));
  return t;
}

/* --------------------------------------------------- 难度阶梯（正反馈的来源） */
/* 「先做对一串再碰难的」这件事全靠这个阶梯，所以它是一等公民，不是附属字段。
   四级：地基(level1) → 搭桥(level2且bridge:true，7大考点的最简形态) →
        过渡(level2普通题) → 真题级(level3)。
   搭桥这一级是 2026-08-11 补的：地基是新概念1 内容、真题考虚拟语气非谓语，
   中间原本没有台阶，从 "I am a student" 直接跳到虚拟语气等于劝退。
   ⚠️ 阶梯只收单句题：语音剔除（策略是零投入蒙 C，练它不提分还误导正确率）；
      带短文的阅读/完形也剔除（一道题拖一整篇文章，热身就不轻快了，
      它们有自己的页面和做题步骤）。 */
const LEVELS = [
  { n: 1, name: "地基",   desc: "新概念1 前 80 课就能做对的题",                     match: (q) => levelOf(q) === 1 },
  { n: 2, name: "搭桥",   desc: "7 大考点的最简形态——每题只考一个套路，词都认识",     match: (q) => levelOf(q) === 2 && q.bridge },
  { n: 3, name: "过渡",   desc: "成考常考、比真题温和一档",                         match: (q) => levelOf(q) === 2 && !q.bridge },
  { n: 4, name: "真题级", desc: "真题原题难度",                                    match: (q) => levelOf(q) === 3 },
];
function levelOf(q) { return q.level || 2; }
function levelPool(n, secKey) {
  const L = LEVELS[n - 1];
  if (!L) return [];
  const list = secKey ? (BY_SEC[secKey] || []) : BANK.filter((q) => secOf(q) !== "phonetics" && !passageOf(q));
  return list.filter(L.match);
}
/* 某一级的掌握情况：做过几次、正确率多少。>=80% 且做过 >=15 次算「过了这一级」。 */
function levelStat(n, secKey) {
  const pool = levelPool(n, secKey);
  const ids = {}; pool.forEach((q) => (ids[q.id] = 1));
  const rows = STATE.log.filter((r) => ids[r.qid]);
  const done = Object.keys(STATE.answers).filter((id) => ids[id]).length;
  const acc = rows.length ? rows.filter((r) => r.ok).length / rows.length : null;
  return { total: pool.length, done: done, tried: rows.length, acc: acc,
           passed: rows.length >= 15 && acc !== null && acc >= 0.8 };
}
/* 现在该练哪一级：第一个还没过的级别 */
function currentLevel(secKey) {
  for (let n = 1; n <= LEVELS.length; n++) if (!levelStat(n, secKey).passed) return n;
  return LEVELS.length;
}
/* 一组混合题按难度从易到难排（搭桥题算 1.5，落在地基和过渡中间）。
   和 orderForPractice 套着用：sort 是稳定的，先按难度排好再按做题状态排，
   「没做过的」那一堆里依然是易题在前。 */
function byDifficulty(list) {
  const w = (q) => levelOf(q) - (q.bridge ? 0.5 : 0);
  return list.slice().sort((a, b) => w(a) - w(b));
}

/* ---------------------------------------------------- 语法微课 */
/* 课的内容在 lessons.js（window.LESSONS）。这里只管：下一课是哪课、课后练习出哪些题。 */
function nextLesson() {
  if (!window.LESSONS) return null;
  return window.LESSONS.find((l) => !STATE.lessons[l.id]) || null;
}
function lessonIndex(l) { return window.LESSONS ? window.LESSONS.indexOf(l) : -1; }
/* 课后练习：先出这课点名的核心题（qids），不够再补位。
   ⚠️ 2026-08-16 修 bug：原来补位是「同 topic 随便抓」，结果抓进来一堆这课
   根本没教的东西 —— 第 15 课（So do I）的课后练习出 Not only 倒装；第 14 课
   （强调句）连补 3 道真题级；第 1 课（doing 组）补进第 2 课才教的 to do。
   现在按【知识框架】收窄，补位顺序：
     ① 这一课自己框架的题
     ② 同 topic 的地基题（level 1，新概念1 范围，早在地基阶梯练过，不算没学过）
     ③ 【同一个考点里】之前课已经教过的框架的题（复习性质）
   框架没被任何一节课教过的题（比如目前的 too…to、used to）一律不出；
   跨考点的题也不出 —— 练强调句时冒出 "I enjoy listening to music" 很怪，
   而且连对 4 题的过关判定会被别的考点稀释。 */
function lessonQuestions(l, n) {
  n = n || 5;
  const own = (l.qids || []).map((id) => BY_ID[id]).filter(Boolean);
  const used = {}; own.forEach((q) => (used[q.id] = 1));
  const taught = taughtFrameIds(l.id);
  const mineIds = {};
  (window.FRAMES || []).forEach((f) => { if (f.lesson === l.id) mineIds[f.id] = 1; });
  const rest = BY_SEC.grammar.filter((q) => !used[q.id] && levelOf(q) <= 2 && pointOf(q) === l.point);
  const fid = (q) => (frameOf(q) || {}).id;
  const mine = rest.filter((q) => mineIds[fid(q)]);
  const base = rest.filter((q) => !mineIds[fid(q)] && levelOf(q) === 1 && (l.topics || []).indexOf(q.topic) >= 0);
  const older = rest.filter((q) => !mineIds[fid(q)] && levelOf(q) !== 1 && taught[fid(q)]);
  return own
    .concat(orderForPractice(byDifficulty(mine)))
    .concat(orderForPractice(byDifficulty(base)))
    .concat(orderForPractice(byDifficulty(older)))
    .slice(0, n);
}

/* ---------------------------------------------------- 学习时长（从做题流水估算） */
/* 不跑常驻计时器（页面挂后台会虚高）。用答题时间戳估：相邻两题的间隔算学习时间，
   超过 3 分钟的间隔按 3 分钟封顶（中途走神/离开不算）；每个学习日加 45 秒起步
   （第一题之前的读题时间）。读微课的时间只要做了课后练习就会被间隔覆盖到一部分，
   所以标注为「估算」。 */
function studyStats() {
  const byDay = {};
  STATE.log.forEach((r) => { (byDay[r.d] = byDay[r.d] || []).push(r.ts); });
  const perDay = {};
  let total = 0;
  Object.keys(byDay).forEach((d) => {
    const ts = byDay[d].sort((a, b) => a - b);
    let sec = 45;
    for (let i = 1; i < ts.length; i++) sec += Math.min((ts[i] - ts[i - 1]) / 1000, 180);
    perDay[d] = Math.round(sec);
    total += perDay[d];
  });
  return { perDay: perDay, totalSec: total, today: perDay[todayStr()] || 0 };
}
function fmtMin(sec) {
  const m = Math.round(sec / 60);
  return m >= 60 ? Math.floor(m / 60) + " 小时 " + (m % 60) + " 分" : m + " 分钟";
}

/* ---------------------------------------------------- 学习路线 */
/* 路线定义在 course.js（window.COURSE）。核心规则：线性，不跳级——
   nextCourseUnit 永远返回第一个没过关的节；做题类 ≥70% 才算过，
   讲课类 ≥60%（上课以理解为主）。没过的节第二天还在原地。 */
function unitPassed(u) { const r = STATE.course[u.id]; return !!(r && r.pass); }
function nextCourseUnit() {
  if (!window.COURSE) return null;
  return window.COURSE.find((u) => !unitPassed(u)) || null;
}
function unitTitle(u) {
  if (u.kind === "lesson") { const l = (window.LESSONS || []).find((x) => x.id === u.ref); return l ? l.title : u.ref; }
  return u.title;
}
function unitQuestions(u) {
  if (u.kind === "lesson") { const l = window.LESSONS.find((x) => x.id === u.ref); return lessonQuestions(l, 5); }
  // 章末过关按【知识框架】选题 —— 给不在策略 7 大考点编号里的新章用
  // （被动语态 / 名词从句 / 比较级 / 反意疑问 / 固定搭配 / 词义辨析）
  if (u.frames) {
    const set = {}; u.frames.forEach((f) => (set[f] = 1));
    const pool = byDifficulty(BY_SEC.grammar.filter((q) =>
      set[(frameOf(q) || {}).id] && levelOf(q) <= (u.maxLevel || 2)));
    return orderForPractice(pool).slice(0, u.n || 10);
  }
  if (u.point) {
    // 章末过关自适应：这一章的课后练习里错得越多，章末就多考几道（10 → 最多 15）
    let n2 = u.n || 10;
    if (window.COURSE && window.LESSONS) {
      const misses = window.COURSE.filter((x) => x.ch === u.ch && x.kind === "lesson")
        .reduce((a, x) => { const r = STATE.lessons[x.ref]; return a + (r ? Math.max(0, r.total - r.correct) : 0); }, 0);
      n2 = Math.min(15, n2 + misses);
    }
    // 章末过关也只考本章三节课【教过的框架】＋地基题，不放没讲过的结构进来
    const last = (window.COURSE || []).filter((x) => x.ch === u.ch && x.kind === "lesson").slice(-1)[0];
    const taught = taughtFrameIds(last ? last.ref : null);
    const pool = byDifficulty(questionsOfPoint(u.point).filter((q) =>
      levelOf(q) <= (u.maxLevel || 2) && (levelOf(q) === 1 || taught[(frameOf(q) || {}).id])));
    return orderForPractice(pool).slice(0, n2);
  }
  const pool = byDifficulty(BY_SEC.grammar.filter((q) => levelOf(q) === (u.level || 1) && (u.topics || []).indexOf(q.topic) >= 0));
  return orderForPractice(pool).slice(0, u.n || 8);
}
function recordUnit(u, c, n, passOverride) {
  // passOverride：连对制练习直接给结论（连对4=过），不按正确率算
  const pass = passOverride !== undefined ? !!passOverride
    : u.kind === "template" ? true
    : (c / n) >= (u.kind === "lesson" ? 0.6 : 0.7);
  STATE.course[u.id] = { d: todayStr(), correct: c, total: n, pass: pass };
  saveState();
  return pass;
}

/* ---------------------------------------------------- 每日一读（分级精读） */
/* 素材在 readings-graded.js：28 篇由易到难（L1 77词 → L3 226词），逐句带中文
   + 读后理解题。它是「长句拆解」的前置替代：用户反馈拆句子太难（2026-08-15），
   在句子拆解解锁（路线过时态章）之前，每天的阅读训练就是顺序读这 28 篇。 */
function readPassed(k) {
  const r = STATE.reads[k];
  if (!r) return false;
  return r.correct >= Math.ceil(r.total * 0.6);
}
function nextReadKey() {
  if (!window.READINGS_GRADED) return null;
  const keys = Object.keys(window.READINGS_GRADED).map(Number).sort((a, b) => a - b);
  for (const k of keys) if (!readPassed(k)) return k;
  return null;
}

/* ---------------------------------------------------- 阅读 / 完形：整篇线性推进 */
/* 用户反馈（2026-08-16）：「长句拆解看着没啥用，不如多练练题；阅读理解和完形
   到现在还没练过」。说得对——阅读 60 + 完形 30 = 90 分（全卷 60%），却从来
   没进过每日任务。现在每天那个 15 分钟的阅读槽位改成【真的做一篇】：
     · 按短→长排队，一篇一篇往下走，不跳篇（跟学习路线同一个思路）
     · 一篇里的题全做过一遍 = 这篇过了，明天自动出下一篇
   拆解页和每日一读都还在（导航「打基础」里），但不再占每天的必做位。 */
function passageGroups(secKey) {
  const gs = groupByPassage(BY_SEC[secKey] || []).filter((g) => g.passage && g.qs.length);
  // 由易到难：短文越短越先做。同长度按题库原顺序（稳定排序）。
  return gs.sort((a, b) => a.passage.length - b.passage.length);
}
function groupDone(g) { return g.qs.every((q) => STATE.answers[q.id]); }
function groupAcc(g) {
  const rows = g.qs.map((q) => STATE.answers[q.id]).filter(Boolean);
  if (!rows.length) return null;
  return rows.filter((r) => r.lastOk).length / rows.length;
}
/* 下一篇 = 第一篇没做完的；全做完了就回头挑正确率最低的那篇重做 */
function nextPassageGroup(secKey) {
  const gs = passageGroups(secKey);
  if (!gs.length) return null;
  const fresh = gs.find((g) => !groupDone(g));
  if (fresh) return fresh;
  return gs.slice().sort((a, b) => (groupAcc(a) || 0) - (groupAcc(b) || 0))[0];
}
function passageProgress(secKey) {
  const gs = passageGroups(secKey);
  return { done: gs.filter(groupDone).length, total: gs.length };
}
/* 短文词数（估）——排任务时用来算分钟数 */
function passageWords(g) { return (g.passage || "").split(/\s+/).filter(Boolean).length; }

/* ---------------------------------------------------- 长句拆解的分级 */
/* 用户反馈（2026-08-15）：拆解太难完全看不懂。原因：句池不分难度（18-55词
   全混着），而且没学从句之前就每天必做——拆解拆的就是从句，没学过等于蒙眼拆。
   现在：①句池分三级（短/中/长，按词数+来源）②推荐级别跟路线进度走：
   没过定语从句章不排拆解任务；过了从句章=短句级；过了时态章=中句级；
   过了全部语法章=长句级。短句级优先用微课里的例句——拆自己学过的句子。 */
const SENT_TIERS = [
  { n: 1, name: "短句", desc: "8-14 词，微课例句优先——拆你学过的句子" },
  { n: 2, name: "中句", desc: "15-22 词，一个从句或并列" },
  { n: 3, name: "长句", desc: "23 词以上，真题短文原句" },
];
function _cleanSent(t) { return String(t).replace(/[()（）]/g, "").replace(/\s+/g, " ").trim(); }
function sentencePool(tier) {
  const out = [], seen = {};
  const push = (t) => { const c = _cleanSent(t); if (!seen[c]) { seen[c] = 1; out.push(c); } };
  const wc = (t) => (String(t).match(/[A-Za-z'’-]+/g) || []).length;
  if (tier === 1 && window.LESSONS) {
    window.LESSONS.forEach((l) => (l.teach || []).forEach((b) => (b.ex || []).forEach((e) => {
      const t = _cleanSent(e[0]);
      if (!/_{2,}/.test(t) && wc(t) >= 6 && wc(t) <= 16) push(t);
    })));
  }
  BANK.forEach((q) => {
    if (!q.passage) return;
    (String(q.passage).match(/[^.!?]+[.!?]+/g) || []).forEach((raw) => {
      const t = raw.trim();
      if (/_{2,}|\(\d+\)/.test(t)) return;
      const n = wc(t);
      if (tier === 1 && n >= 8 && n <= 14) push(t);
      if (tier === 2 && n >= 15 && n <= 22) push(t);
      if (tier === 3 && n >= 23 && n <= 55) push(t);
    });
  });
  return out;
}
/* 按路线进度推荐级别；0 = 还没到练拆解的时候 */
function sentenceTier() {
  const passed = (id) => { const u = (window.COURSE || []).find((x) => x.id === id); return u ? unitPassed(u) : false; };
  if (!passed("X2")) return 0;     // 定语从句章末没过：拆解无从谈起
  if (!passed("X3")) return 1;     // 学完从句 → 短句
  if (!passed("X7")) return 2;     // 学完时态 → 中句
  return 3;                        // 语法章全过 → 真题长句
}

/* ---------------------------------------------------- 句子拆解图（打括号读法可视化） */
/* 给答错的题生成「主干 + 括号补充」的可视化拆解。
   - q.viz 手工标注优先（结构特殊的题，人工保证准确）
   - 定语从句题自动生成，但只处理最稳的形状：从句一直延伸到句尾，
     且空格前已经有完整的主句（"This is the photo (that I took...)"）。
     从句夹在中间的（"The house (that we live in) is very old"）自动判不准，
     一律要求手工标注——教错结构比不教更糟。 */
const REL_WORDS = ["who", "whom", "whose", "that", "which", "where", "when", "in which", "at which", "for which"];
function sentenceViz(q) {
  if (q.viz) return q.viz;
  if (q.topic !== "relative-clause") return null;
  const m = String(q.stem).match(/_{2,}/);
  if (!m) return null;
  const ans = String(q.options[q.answer]).split("/")[0].trim();
  if (REL_WORDS.indexOf(ans.toLowerCase()) < 0) return null;
  const before = q.stem.slice(0, q.stem.indexOf(m[0])).trim();
  let after = q.stem.slice(q.stem.indexOf(m[0]) + m[0].length).trim();
  const tail = after.match(/[.?!。？！]\s*$/) ? after.slice(-1) : "";
  after = after.replace(/[.?!。？！]\s*$/, "").trim();
  // 只接受形状 B：空格前面已经是一个能独立成句的主句（含谓语动词）
  if (!/\b(is|are|was|were|am|do|does|did|have|has|had|will|can|could|remember|like|likes|liked|love|loves|took|take|know|knew|see|saw|visit|visited|think|thought|met|find|found|miss|missed)\b/i.test(before)) return null;
  if (before.split(/\s+/).length < 3 || after.split(/\s+/).length < 1) return null;
  return {
    en: before + " (" + ans + " " + after + ")" + tail,
    rows: [["主干", before + tail], ["括号补充", ans + " " + after]],
    note: "先读主干，再回头看括号——括号只是给前面的名词做补充说明。",
  };
}

/* ---------------------------------------------------- AI 教练的进度摘要 */
/* 把此刻的真实学习数据压成一段文本，喂给 AI 当上下文。只给事实，不给判断。 */
function progressBrief() {
  const st = currentStage();
  const lines = [];
  lines.push(`考试 ${STATE.settings.examDate}，距考 ${daysToExam()} 天，阶段 ${st.stage}（方针：${st.focus}）`);
  lines.push(`目标 ${S.meta.target_score}/150（保险 ${S.meta.safe_target_score}），当前预估总分 ${totalScore()}`);
  SECTIONS.forEach((x) => {
    const sc = secScore(x.key);
    lines.push(`- ${x.name}：${sc.none ? "还没数据" : sc.score + "分"}／目标${x.target}（卷面${x.full}，近期正确率${sc.rate === null ? "—" : Math.round(sc.rate * 100) + "%"}，累计做${secSample(x.key)}题）${x.invest ? "" : "［策略不投入］"}`);
  });
  if (window.COURSE) {
    const done = window.COURSE.filter(unitPassed).length;
    const nx = nextCourseUnit();
    lines.push(`学习路线：已过 ${done}/${window.COURSE.length} 节${nx ? "，当前在「" + (window.COURSE_CH[nx.ch] || "") + " · " + unitTitle(nx) + "」" : "，全部走完"}`);
  }
  const cl = currentLevel();
  lines.push(`难度阶梯：现在第${cl}级「${LEVELS[cl - 1].name}」；各级：` + LEVELS.map((L) => {
    const t = levelStat(L.n);
    return `${L.name}${t.passed ? "已过" : t.tried ? Math.round(t.acc * 100) + "%(" + t.tried + "次)" : "未动"}`;
  }).join("、"));
  const byEc = {};
  Object.keys(STATE.wrong).forEach((id) => { const e = STATE.wrong[id].ec; if (e && e !== "NONE") byEc[e] = (byEc[e] || 0) + 1; });
  lines.push(`错题 ${Object.keys(STATE.wrong).length} 道（待归因 ${pendingErrorClass().length}，今天到期回炉 ${dueWrongIds().length}，已毕业 ${Object.keys(STATE.wrong).filter((i) => STATE.wrong[i].grad).length}）；归因分布：` +
    (Object.keys(byEc).length ? Object.keys(byEc).map((k) => { const d = S.error_classes.find((e) => e.code === k); return (d ? d.name : k) + byEc[k] + "题"; }).join("、") : "还没有"));
  const week = STATE.log.filter((r) => daysBetween(r.d, todayStr()) < 7);
  lines.push(`近7天做题 ${week.length} 道${week.length ? "，正确率 " + Math.round(week.filter((r) => r.ok).length / week.length * 100) + "%" : ""}；今天完成任务 ${(STATE.daily[todayStr()] && STATE.daily[todayStr()].done.length) || 0} 件`);
  if (STATE.mocks.length) { const m = STATE.mocks[STATE.mocks.length - 1]; lines.push(`最近一次模考 ${m.date}：${m.total}/150（${SECTIONS.map((x) => x.name + (m.sec[x.key] == null ? "—" : m.sec[x.key])).join("，")}）`); }
  if (STATE.essays.length) { const e = STATE.essays[STATE.essays.length - 1]; lines.push(`最近一篇作文 ${e.date}：${e.score == null ? "没评分" : e.score + "/25"}`); }
  return lines.join("\n");
}

/* ------------------------------------------------------------ 小工具 */
function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function pick(a, n) { return shuffle(a).slice(0, n); }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function letter(i) { return "ABCDEFGH"[i] || String(i); }   // 补全对话是 8 选 5，要到 H
/* 语音题的选项里用 __ea__ 标出划线部分（真卷上那一段是带下划线的）。
   以前直接 esc() 出去，屏幕上就是字面的 sw__ea__t —— 又丑又跟卷面对不上。
   先转义再把 __x__ 换成 <u>x</u>：转义在前，所以不会引入 XSS。 */
function escOpt(s) { return esc(s).replace(/__([^_]+)__/g, "<u>$1</u>"); }
function wordCount(t) { return (String(t).trim().match(/[A-Za-z'’-]+/g) || []).length; }

/* 朗读（浏览器自带，免费离线） */
function speak(text) {
  try {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/_{2,}/g, " blank "));
    u.lang = "en-US"; u.rate = 0.9;
    const vs = speechSynthesis.getVoices();
    const want = STATE.settings.voiceName;
    const v = (want && vs.find((x) => x.name === want)) || vs.find((x) => /en-US/.test(x.lang) && /Samantha|Alex|Google US/.test(x.name)) || vs.find((x) => /^en/.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) {}
}
