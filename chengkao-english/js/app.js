/* ============================================================================
 * app.js  ——  主程序：路由、答题引擎、间隔复习(SRS)、各页面、AI 功能
 * 依赖顺序（在 index.html 里按序引入）：
 *   questions.js → content.js → storage.js → api.js → app.js
 * ========================================================================== */

/* ------------------------------ 小工具 ------------------------------------ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* 日期一律用本地时区（别用 toISOString，它是 UTC，在中国会把日期算早一天） */
function fmtDate(d) {
  const p = (x) => String(x).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function todayStr() { return fmtDate(new Date()); }

function daysBetween(a, b) { // b - a，单位天
  const d1 = new Date(a + "T00:00:00");
  const d2 = new Date(b + "T00:00:00");
  return Math.round((d2 - d1) / 86400000);
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return fmtDate(d);
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
/* 把 AI 返回的简单 markdown 转成安全 HTML（加粗 + 换行） */
function mdLite(s) {
  let h = escapeHtml(s);
  h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/\n/g, "<br>");
  return h;
}
const LETTERS = ["A", "B", "C", "D", "E", "F"];

/* 渲染选项文字：把语音题里 __x__ 标记的"划线部分"变成高亮（变色+下划线） */
function fmtOption(opt) {
  return escapeHtml(opt).replace(/__(.+?)__/g, '<span class="ph-mark">$1</span>');
}

/* 朗读：用浏览器自带的语音合成（免费、离线、无需 API Key）
   —— 关键：自动挑系统里最好的英语语音，而不是用默认那个（默认常常很机械）。 */
let _voices = [];
function loadVoices() { try { _voices = window.speechSynthesis.getVoices() || []; } catch (e) {} }
/* Mac 自带的一堆"恶搞/音效"语音，读英语像搞笑配音，全部过滤掉 */
const NOVELTY_VOICES = ["Albert", "Bad News", "Bahh", "Bells", "Boing", "Bubbles", "Cellos", "Good News",
  "Jester", "Organ", "Pipe Organ", "Superstar", "Trinoids", "Whisper", "Wobble", "Zarvox", "Deranged",
  "Hysterical", "Junior", "Ralph", "Grandma", "Grandpa", "Rocko", "Sandy", "Shelley", "Flo", "Eddy", "Reed", "Fred"];
function englishVoices() {
  return _voices.filter((v) => /^en/i.test(v.lang) &&
    !NOVELTY_VOICES.some((n) => v.name === n || v.name.startsWith(n + " ")));
}
function bestVoice() {
  const en = englishVoices();
  if (!en.length) return null;
  // 1) 用户在设置里手动选的
  const chosen = STATE.settings.voiceName && en.find((v) => v.name === STATE.settings.voiceName);
  if (chosen) return chosen;
  // 2) 优先高质量语音（Google 在线音质最好；Mac 上 Samantha/Karen/Daniel 等较自然）
  const prefer = ["Google US English", "Samantha", "Google UK English Female", "Karen", "Serena", "Daniel", "Moira", "Alex"];
  for (const n of prefer) { const v = en.find((x) => x.name.includes(n)); if (v) return v; }
  // 3) 带"增强/高级/Siri"的通常更好
  const enh = en.find((v) => /enhanced|premium|siri/i.test(v.name)); if (enh) return enh;
  return en[0];
}
function speak(text, lang) {
  try {
    if (!("speechSynthesis" in window)) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = bestVoice();
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = lang || "en-US"; }
    u.rate = 0.9;               // 稍慢一点，听清楚
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) { return false; }
}


/* 全部题库（题库 + 我保存过的 AI 题） */
function allQuestions() {
  return window.QUESTIONS.concat(STATE.aiQuestions || []);
}
/* 主线/每日/模拟考只用题库原题；AI 裂变出的练习题(q.fission)不混进来，
   保证「练习」和主线学习永远不是同一批题 */
function bankQuestions() {
  return allQuestions().filter((q) => !q.fission);
}
function questionById(id) {
  return allQuestions().find((q) => q.id === id);
}
/* 校验 AI 生成的选择题是否自洽：答案下标在范围内，且 optionNotes(若有)恰好一条以「对」开头、
   正好落在 answer 那一项。不自洽（选项和逐项解析对不上）的整题丢弃，避免出现错位 bug。 */
function validGenQ(q) {
  if (!q || !q.stem || !Array.isArray(q.options) || q.options.length < 2) return false;
  if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.length) return false;
  if (Array.isArray(q.optionNotes)) {
    if (q.optionNotes.length !== q.options.length) return false;
    const correctIdx = q.optionNotes
      .map((n, i) => [String(n).trim(), i]).filter(([n]) => /^对/.test(n)).map(([, i]) => i);
    if (correctIdx.length !== 1 || correctIdx[0] !== q.answer) return false;
  }
  return true;
}

const MODULE_NAMES = {
  phonetics: "语音", grammar: "语法", collocation: "固定搭配",
  cloze: "完形填空", reading: "阅读理解", conversation: "补全对话",
};

/* 难度阶梯：1 入门 / 2 进阶 / 3 冲刺。老题库没写 level 的默认按进阶(2)。 */
const LEVEL_NAMES = { 1: "入门", 2: "进阶", 3: "冲刺" };
function effLevel(q) { return q.level || 2; }
/* 每个阶段最高解锁到的难度：阶段一只出入门+进阶，冲刺题留到后面 */
function stageMaxLevel(stage) { return stage === 1 ? 2 : 3; }

/* 练习每组题数（一次别太多） */
const PRACTICE_BATCH = 20;
/* 练习排序：做过的排后面（等整轮做完才重现），同"做过次数"内按难度从易到难。
   这样退出再进不会一直重复同几道。 */
function orderForPractice(pool, cap) {
  const srs = STATE.progress.srs;
  const seen = (q) => (srs[q.id] ? srs[q.id].seen : 0);
  const arr = pool.slice().sort((a, b) =>
    seen(a) !== seen(b) ? seen(a) - seen(b) : effLevel(a) - effLevel(b));
  return cap ? arr.slice(0, cap) : arr;
}

/* -------- 学习时间统计 -------- */
function addStudyTime(sec) {
  if (!(sec > 0)) return;
  const p = STATE.progress;
  if (!p.studyTime) p.studyTime = {};
  const d = todayStr();
  p.studyTime[d] = (p.studyTime[d] || 0) + Math.min(sec, 180); // 单题最多计 3 分钟，防挂机
}
function quizTick() {   // 每次答题时结算从上一题到现在的用时
  if (QUIZ && QUIZ.lastTick) { addStudyTime((Date.now() - QUIZ.lastTick) / 1000); QUIZ.lastTick = Date.now(); }
}
function studyMinToday() { const t = STATE.progress.studyTime || {}; return Math.round((t[todayStr()] || 0) / 60); }
function studyMinTotal() { const t = STATE.progress.studyTime || {}; return Math.round(Object.keys(t).reduce((a, k) => a + t[k], 0) / 60); }

/* -------- 知识点掌握度：通关率（可翻案） --------
   掌握 = 第一次就做对，或后来“翻案”——错过之后又连对至少 2 次（level≥2 即距上次
   出错已连对两次）。这样错题真的学会了也能解锁章节，不会被“第一印象”永远卡死。 */
function statsFor(pred) {
  const srs = STATE.progress.srs;
  const qs = allQuestions().filter(pred);
  let attempted = 0, firstOK = 0;
  qs.forEach((q) => {
    const s = srs[q.id];
    if (s && typeof s.firstTry === "boolean") {
      attempted++;
      if (s.firstTry || s.level >= 2) firstOK++;
    }
  });
  return { total: qs.length, attempted, firstOK, rate: attempted ? Math.round((firstOK / attempted) * 100) : 0 };
}

/* -------- 今日训练组卷：一天主攻一个知识点（轮换到练得最少的） -------- */
function dailyTargetCount() { const m = STATE.settings.dailyMinutes; return m <= 25 ? 8 : m <= 40 ? 10 : 12; }

/* -------- 学习大纲主线：从第1章开始，掌握了才解锁下一章 -------- */
function chapterStats(ch) { return statsFor((q) => ch.topics.includes(q.topic)); }

/* -------- 章节近况：最近 20 次作答表现 + 本章累计练习量 --------
   为什么要它：原来只看"一次性通关率"（全历史第一印象），开局做错几道就被永久拖累，
   低正确率的人 100% 会被某一章锁死（实测 40% 正确率锁死在第1章、55% 锁死在第21章）。
   近况数据让"我现在会了"能够翻身。 */
function chRecent(no) { const r = STATE.progress.recent || (STATE.progress.recent = {}); return r[no] || (r[no] = []); }
function chAttempts(no) { return (STATE.progress.chAtt || {})[no] || 0; }
function recentRate(no) {
  const a = chRecent(no);
  return a.length ? { n: a.length, rate: Math.round(a.reduce((s, x) => s + x, 0) / a.length * 100) } : { n: 0, rate: 0 };
}
function weakChapters() { return STATE.progress.weakCh || (STATE.progress.weakCh = []); }
function markWeakChapter(no) { const w = weakChapters(); if (!w.includes(no)) { w.push(no); saveState(); } }
function clearWeakChapter(no) {
  const w = weakChapters(); const i = w.indexOf(no);
  if (i >= 0) { w.splice(i, 1); saveState(); }
}

/* -------- 章节通关判定：四条通道，任一满足即解锁（绝不把人永久锁死） --------
   A 真掌握  ：做够题 且 一次性通关率 ≥70%（原标准，最硬）
   B 现在会了：最近 ≥8 次作答正确率 ≥70% —— 摆脱"开局印象差"的历史包袱
   C 练透了  ：本章题覆盖够 且 最近 ≥12 次正确率 ≥55%
   D 防死锁  ：覆盖够 + 本章累计练习 ≥40 次 → 放行，但标记为「薄弱章」，
              之后在每日复习里优先回访。卡死一个人比放他过去有害得多——
              i+1 的本意是"别提前教没学的"，不是"学不会就永远出不去"。 */
function chapterPassed(ch) {
  // E 摸底判定：摸底时这一章的题答对了 → 直接跳过，别让人重学已经会的东西。
  //   （可在摸底页「取消所有跳过」一键撤销；这些章的题仍在复习池里，不会彻底消失）
  if (placedPassed(ch.no)) return true;
  const s = chapterStats(ch);
  if (s.total === 0) return true;                 // 没题的章不卡住
  const need = Math.min(5, s.total);
  const r = recentRate(ch.no);
  const covered = s.attempted >= Math.min(s.total, 12);
  if (s.attempted >= need && s.rate >= 70) { clearWeakChapter(ch.no); return true; }   // A
  if (r.n >= 8 && r.rate >= 70) { clearWeakChapter(ch.no); return true; }              // B
  if (covered && r.n >= 12 && r.rate >= 55) { clearWeakChapter(ch.no); return true; }  // C
  if (covered && chAttempts(ch.no) >= 40) { markWeakChapter(ch.no); return true; }     // D
  return false;
}

/* 题目 → 所属章（用于记录近况；裂变题新增后自动重建映射） */
let _QTOPIC = null;
function chapterOfQuestion(qid) {
  if (!_QTOPIC || _QTOPIC[qid] === undefined) {
    _QTOPIC = {}; allQuestions().forEach((q) => (_QTOPIC[q.id] = q.topic));
  }
  const t = _QTOPIC[qid];
  return t ? chapterOfTopic(t) : null;
}
function currentChapterIndex() {
  const list = window.SYLLABUS || [];
  const i = list.findIndex((ch) => !chapterPassed(ch));
  return i < 0 ? list.length - 1 : i;             // 全通关就停在最后一章
}
function currentChapter() { return (window.SYLLABUS || [])[currentChapterIndex()]; }
function chapterOfTopic(topic) { return (window.SYLLABUS || []).find((ch) => ch.topics.includes(topic)); }

/* 今日"学+练"跟着大纲当前章走 */
function pickDailyCard() { return currentChapter(); }

/* ==========================================================================
 *                       两条轨道：语法主线 + 送分轨道
 * 为什么要拆：原来 28 章顺序推进，2.5 天一章＝70 天，意味着考前一周才学到
 *   第25章语音(7.5分)、26章补全对话(15分)、27章完形(30分)、28章阅读(45分)——
 *   **97.5 分、全卷 65%，被锁在最后才碰得到**。这对 72 天的备考是致命的。
 * 怎么拆：这四章的内容**不依赖语法进度**（语音是字母发音规律、补全对话是礼貌
 *   应答套路、完形/阅读是解题技巧），所以从第一天就开放，跟主线并行练。
 * ⚠️ 但真题不能跟着一起放开——见 realAvailable()：真题是"检验"，得先练过才考，
 *   否则又会出现"第1章天天做语音真题却一个词都不认识"的情况。
 * ========================================================================== */
const BONUS_CHAPTERS = [25, 26, 27, 28];      // 语音 / 补全对话 / 完形技巧 / 阅读理解策略
function bonusTopicSet() {
  const s = new Set();
  (window.SYLLABUS || []).forEach((ch) => {
    if (BONUS_CHAPTERS.indexOf(ch.no) >= 0) ch.topics.forEach((t) => s.add(t));
  });
  return s;
}
function isBonusTopic(t) { return bonusTopicSet().has(t); }

/* 已解锁的知识点 = 语法主线（当前章+之前所有章）+ 送分轨道（永远开放）。
   i+1 原则仍然守住：**语法**部分上一步没过，下一步绝不出现。 */
function unlockedTopicSet() {
  const list = window.SYLLABUS || [];
  const cur = currentChapterIndex();
  const s = new Set();
  list.slice(0, cur + 1).forEach((ch) => ch.topics.forEach((t) => s.add(t)));
  bonusTopicSet().forEach((t) => s.add(t));
  return s;
}
/* 只要语法主线已解锁的考点（组"练本章"时用，免得送分轨道的题混进来抢名额） */
function mainlineTopicSet() {
  const list = window.SYLLABUS || [];
  const cur = currentChapterIndex();
  const s = new Set();
  list.slice(0, cur + 1).forEach((ch) => {
    if (BONUS_CHAPTERS.indexOf(ch.no) < 0) ch.topics.forEach((t) => s.add(t));
  });
  return s;
}
/* 练本章入口：题够直接开做；本章题库太薄且有 Key → AI 现场补一批本章新题 */
function startChapterQuiz() {
  const c = pickDailyCard();
  const list = buildDailyList(c);
  const opts = { title: "练本章 · " + c.title, checkIn: true, daily: true };
  if (list.length >= dailyTargetCount() || !hasApiKey()) { startQuiz(list, opts); return; }
  const bank = bankQuestions().filter((q) => c.topics.includes(q.topic));
  startFission("ch-" + c.no, {
    label: "第" + c.no + "章 " + c.title, module: "grammar", topicSlug: c.topics[0],
    sampleStems: bank.slice(0, 3).map((q) => q.stem || ""),
    quizOpts: { checkIn: true, daily: true },
    fallback: () => (list.length ? list : bank),
  });
}

/* 练本章组卷。铁律：只出「当前章 + 已学过章节」的题，绝不提前出没学的语法 */
function buildDailyList(ch) {
  const target = dailyTargetCount();
  const unlocked = unlockedTopicSet();
  const due = getDueQuestions().filter((q) => unlocked.has(q.topic)).slice(0, Math.ceil(target * 0.3));  // ~3成复习
  const used = new Set(due.map((q) => q.id));
  // 薄弱章（当年"练够了先放过去、但没吃透"）固定留 ~2 成名额回访。
  // ⚠️ 必须占固定名额：只放在"本章题不够时才补"的分支里，会被当前章的题永远挤掉，等于没回访。
  const weak = new Set(weakChapters());
  let weakQs = [];
  if (weak.size && !weak.has(ch.no)) {
    weakQs = orderForPractice(bankQuestions().filter((q) => {
      if (used.has(q.id) || !unlocked.has(q.topic)) return false;
      const c = chapterOfTopic(q.topic);
      return c && weak.has(c.no);
    }), Math.max(1, Math.round(target * 0.2)));
    weakQs.forEach((q) => used.add(q.id));
  }
  // 主攻当前章：orderForPractice = 没做过的排最前(保证把本章题覆盖完)，同"做过次数"内先易后难。
  // ⚠️ 别退回只按 effLevel(难度) 排序——那样每天都是同几道题，本章其余题永远见不到（曾导致卡章时42题只做过18题）。
  const chQs = orderForPractice(bankQuestions().filter((q) => ch.topics.includes(q.topic) && !used.has(q.id)), 0);
  chQs.forEach((q) => used.add(q.id));
  let list = due.concat(weakQs, chQs).slice(0, target);
  if (list.length < target) {
    // 本章题不够 → 用**语法主线**里学过章节的题来凑。
    // ⚠️ 这里用 mainlineTopicSet 而不是 unlockedTopicSet：送分轨道(语音/对话/完形/阅读)
    //    有它自己的每日步骤，不能让它的题跑来抢"练本章"的名额、把语法练习稀释掉。
    const mainline = mainlineTopicSet();
    const rest = bankQuestions().filter((q) => mainline.has(q.topic) && !used.has(q.id));
    list = list.concat(orderForPractice(rest, 0)).slice(0, target);
  }
  return list;
}

/* 章节白话概念卡（带 背/懂 标签 + 补充讲解 + 易错点对照） */
function renderChapterCard(ch) {
  const tagText = { "懂": "重在理解", "背": "重在记忆", "背+懂": "又背又懂", "技巧": "重在技巧" }[ch.learn] || ch.learn;
  const tagCls = ch.learn === "懂" ? "lt-understand" : ch.learn === "技巧" ? "lt-skill" : "lt-memorize";
  return `
    <div class="kcard">
      <div class="kcard-title">第 ${ch.no} 章 · ${escapeHtml(ch.title)} <span class="learn-tag ${tagCls}">${tagText}</span></div>
      <div class="kcard-rule">${escapeHtml(ch.plain)}</div>
      <ul class="kcard-points">${ch.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
      ${ch.extra ? `<div class="kcard-extra">${escapeHtml(ch.extra)}</div>` : ""}
      <div class="kcard-eg-title">例句：</div>
      ${ch.examples.map((e) => `<div class="kcard-eg"><span class="eg-en">${escapeHtml(e.en)}</span><span class="eg-zh">${escapeHtml(e.zh)}</span></div>`).join("")}
      ${(ch.pitfalls && ch.pitfalls.length) ? `
        <div class="kcard-eg-title pitfall-title">⚠️ 易错点（考试爱挖的坑）：</div>
        <ul class="kcard-pitfalls">${ch.pitfalls.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>` : ""}
    </div>`;
}

/* 按语法点练习：把零散 topic 归成对得上新概念1/手册的语法块。
   学完某个点（比如被动语态）就能进来只刷这一点。顺序大致按手册 02→14。 */
const GRAMMAR_GROUPS = [
  { name: "时态基础", topics: ["be-verb", "present-simple", "present-continuous", "past-be", "future-will"] },
  { name: "一般/现在进行", topics: ["present-continuous"] },
  { name: "现在完成时", topics: ["present-perfect"] },
  { name: "过去进行时", topics: ["past-continuous"] },
  { name: "过去完成时", topics: ["past-perfect"] },
  { name: "used to 过去常常", topics: ["used-to"] },
  { name: "比较级·最高级", topics: ["comparative", "superlative", "comparison"] },
  { name: "被动语态", topics: ["passive"] },
  { name: "定语从句", topics: ["relative-clause"] },
  { name: "状语从句·连词", topics: ["conjunction"] },
  { name: "名词性从句", topics: ["noun-clause"] },
  { name: "虚拟语气", topics: ["subjunctive"] },
  { name: "倒装句", topics: ["inversion"] },
  { name: "非谓语(-ing/-ed/不定式)", topics: ["non-finite", "gerund"] },
  { name: "情态动词", topics: ["modal-verb", "modal-can"] },
  { name: "条件句 if", topics: ["conditional"] },
  { name: "反意疑问句", topics: ["tag-question"] },
  { name: "冠词·名词·代词", topics: ["article", "plural", "pronoun", "object-pronoun", "possessive", "demonstrative", "some-any", "much-many", "few-little"] },
  { name: "介词(时间/其它)", topics: ["preposition-time"] },
  { name: "太…以至于/太…不能", topics: ["too-to", "so-that"] },
  { name: "固定搭配", topics: ["collocation"] },
  { name: "词义辨析", topics: ["word-choice", "correlative", "emphasis"] },
];

/* ------------------------------ SRS 间隔复习 ------------------------------ */
/* 熟练度 → 隔几天再现。和单词一样拉长到 30 天；30 天后仍答对 → “毕业退休”，
   不再无限排队（否则练过的题每 7 天全部到期，复习债会越滚越多）。 */
const SRS_INTERVALS = { 0: 1, 1: 2, 2: 4, 3: 7, 4: 15, 5: 30 };

function recordAnswer(qid, correct) {
  const srs = STATE.progress.srs;
  const s = srs[qid] || { level: 0, wrong: 0, seen: 0, due: todayStr() };
  if (s.seen === 0) s.firstTry = correct;   // 第一次做就对 = 直接算真懂
  s.seen++;
  if (correct) {
    if (s.level >= 5) s.retired = true;     // 隔了30天还答对 → 这题毕业，退出复习队列
    s.level = Math.min(5, s.level + 1);
    s.due = addDays(todayStr(), SRS_INTERVALS[s.level]);
    STATE.progress.totalCorrect++;
  } else {
    s.level = 0;
    s.wrong++;
    s.retired = false;                       // 毕业的题又错了 → 重新入队
    s.due = addDays(todayStr(), 1);          // 错题明天再见：刚看完解析当天重做只是背答案
  }
  srs[qid] = s;
  STATE.progress.totalAnswered++;
  // 记入所属章的"近况"（只留最近 20 次）+ 本章累计练习量，供 chapterPassed 的 B/C/D 通道判定
  const ch = chapterOfQuestion(qid);
  if (ch) {
    const arr = chRecent(ch.no);
    arr.push(correct ? 1 : 0);
    while (arr.length > 20) arr.shift();
    const att = STATE.progress.chAtt || (STATE.progress.chAtt = {});
    att[ch.no] = (att[ch.no] || 0) + 1;
  }
  saveState();
}

/* 到期需要复习的题（只复习题库原题，裂变题练完即走；毕业退休的题不再出现） */
function getDueQuestions() {
  const srs = STATE.progress.srs;
  return bankQuestions().filter((q) => {
    const s = srs[q.id];
    return s && s.due && !s.retired && daysBetween(s.due, todayStr()) >= 0;
  }).sort((a, b) => (srs[b.id].wrong - srs[a.id].wrong));
}

/* 没做过的新题：先按难度从低到高（阶梯），同难度再按阶段 topic 优先。
   maxLevel 可选，用来把冲刺题留到后面阶段。 */
function getNewQuestions(preferTopics, maxLevel) {
  const srs = STATE.progress.srs;
  let fresh = bankQuestions().filter((q) => !srs[q.id]);
  if (maxLevel) fresh = fresh.filter((q) => effLevel(q) <= maxLevel);
  fresh.sort((a, b) => {
    // 1) 难度低的先出
    if (effLevel(a) !== effLevel(b)) return effLevel(a) - effLevel(b);
    // 2) 同难度里，当前阶段重点 topic 先出
    if (preferTopics && preferTopics.length) {
      const pa = preferTopics.includes(a.topic) ? 0 : 1;
      const pb = preferTopics.includes(b.topic) ? 0 : 1;
      if (pa !== pb) return pa - pb;
    }
    return 0;
  });
  return fresh;
}

/* 错题本：做错过、且还没完全掌握的题 */
function getWrongQuestions() {
  const srs = STATE.progress.srs;
  return allQuestions().filter((q) => srs[q.id] && srs[q.id].wrong > 0);
}

/* ------------------------------ 打卡 -------------------------------------- */
function checkInIfNeeded() {
  const p = STATE.progress;
  const today = todayStr();
  if (p.lastCheckIn === today) return false;
  if (p.lastCheckIn && daysBetween(p.lastCheckIn, today) === 1) p.streak += 1;
  else p.streak = 1;
  p.lastCheckIn = today;
  saveState();
  return true;
}

/* ------------------------------ 阶段与周次 -------------------------------- */
function weeksUntilExam() {
  const d = daysBetween(todayStr(), STATE.settings.examDate);
  return Math.max(0, Math.ceil(d / 7));
}
function daysUntilExam() {
  return daysBetween(todayStr(), STATE.settings.examDate);
}
function stageFocusTopics(stage) {
  if (stage === 1) return ["subjunctive", "conversation"];             // 打地基
  if (stage === 2) return ["collocation", "conjunction", "relative-clause", "inversion", "non-finite", "word-choice", "cloze", "reading"]; // 铺开
  return [];                                                            // 冲刺：错题+模拟
}

/* ========================================================================== */
/*                                 路由 / 导航                                 */
/* ========================================================================== */
let contentEl;
const ROUTES = {};
let CURRENT_ROUTE = "dashboard";   // 当前所在页面
let RETURN_HUB = "dashboard";      // 做题/学习结束后回到哪个页面（=启动时所在页）
let DASH_CHAT = [];                // 首页「问 AI 老师」对话历史（本次打开期间保留，不写存档）

function go(route) {
  CURRENT_ROUTE = route;
  $$(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.route === route));
  (ROUTES[route] || ROUTES.dashboard)();
  contentEl.scrollTop = 0;
  window.scrollTo(0, 0);
}
function hubName(r) {
  return { today: "今日清单", practice: "练习", syllabus: "大纲", wrongbook: "错题本", conversation: "会话", study: "学知识" }[r] || "首页";
}

/* ========================================================================== */
/*                              页面：仪表盘                                    */
/* ========================================================================== */
ROUTES.dashboard = function () {
  const p = STATE.progress;
  const total = bankQuestions().length;
  const learned = Object.keys(p.srs).length;
  const pct = total ? Math.round((learned / total) * 100) : 0;
  const acc = p.totalAnswered ? Math.round((p.totalCorrect / p.totalAnswered) * 100) : 0;
  const dLeft = daysUntilExam();
  const wrongCount = getWrongQuestions().length;

  // 今天要走的步骤 + 已完成到哪一步（首页只需回答一个问题：现在点什么）
  const fsteps = buildFlowSteps();
  const fdone = taskState();
  const doneN = fsteps.filter((s) => fdone[s.key]).length;
  const allDone = doneN >= fsteps.length;
  const totalMin = fsteps.reduce((a, s) => a + s.min, 0);
  const ch0 = currentChapter() || {};

  contentEl.innerHTML = `
    <div class="page">
      <!-- 英雄区：一眼看到今天干什么，只有一个按钮 -->
      <div class="hero ${allDone ? "hero-done" : ""}">
        <div class="hero-meta">距考试 <b>${dLeft >= 0 ? dLeft : 0}</b> 天　·　<b>第${["", "一", "二", "三"][examPhase()]}阶段 · ${PHASE_INFO[examPhase()].name}</b>　·　连续打卡 <b>${p.streak}</b> 天 🔥　·　今天已学 <b>${studyMinToday()}</b> 分钟</div>
        <h1 class="hero-title">${allDone ? "今天的任务已完成 🎉" : doneN ? "继续今天的学习" : "开始今天的学习"}</h1>
        <div class="hero-sub">第 ${currentChapterIndex() + 1}/${(window.SYLLABUS || []).length} 章 · <b>${escapeHtml(ch0.title || "")}</b>　|　约 ${totalMin} 分钟，跟着走就行</div>
        <div class="hero-steps">
          ${fsteps.map((s, i) => `<div class="hs ${fdone[s.key] ? "hs-done" : (doneN === i ? "hs-now" : "")}">
              <span class="hs-emoji">${fdone[s.key] ? "✓" : s.emoji}</span>
              <span class="hs-name">${escapeHtml(s.title)}</span>
              <span class="hs-min">${s.min}分</span>
            </div>`).join("")}
        </div>
        <button id="start-daily" class="btn btn-primary btn-hero">
          ${allDone ? "再练一组 →" : doneN ? `继续（还剩 ${fsteps.length - doneN} 步）→` : "开始学习 →"}
        </button>
        <div class="hero-foot">${doneN}/${fsteps.length} 步已完成${allDone ? " · 今天就到这，休息一下" : " · 中途退出会自动接着上次的地方"}</div>
        ${(() => {
          // 真题还没解锁时说明原因和时间点，免得以为功能坏了
          if (fsteps.some((s) => s.key === "real")) return "";
          const at = realUnlockAtChapter();
          if (!at || currentChapterIndex() + 1 >= at) return "";
          return `<div class="hero-foot" style="margin-top:4px">🎯 真题练习会在<b>第 ${at} 章</b>解锁——真题考的都是中高级语法，现在做只会打击信心，先把地基打牢。</div>`;
        })()}
      </div>

      ${HAS_SERVER ? "" : `
        <div class="warn-bar">
          <div>
            <b>⚠️ 进度有丢失风险</b><br>
            你现在是双击 index.html（file://）打开的，进度只存在浏览器里，
            Chrome 清数据或更新时可能被清空。<b>请改用「启动学习.command」</b>（在同一个文件夹里，双击即可），
            进度会自动备份到硬盘的 backups 文件夹，清了也能自动恢复。
          </div>
          <button id="warn-export" class="btn btn-primary btn-sm">先导出备份</button>
        </div>`}

      ${!STATE.progress.placement ? `
        <div class="placement-cta">
          <div class="pc-left">
            <div class="pc-title">🧭 先做个摸底测试</div>
            <div class="pc-sub">15 道题（约 10 分钟），测出你现在的水平，帮你把计划和难度调到最合适。</div>
          </div>
          <button id="go-placement" class="btn btn-primary">开始摸底 →</button>
        </div>` : `
        <div class="placement-done">
          🧭 摸底水平：<b>${STATE.progress.placement.levelLabel}</b>
          <button id="go-placement" class="btn btn-ghost btn-sm">重新摸底</button>
        </div>`}

      <div class="stat-grid">
        <div class="stat-card accent">
          <div class="stat-num">${dLeft >= 0 ? dLeft : 0}</div>
          <div class="stat-label">距离考试还有 (天)</div>
          <div class="stat-foot">${STATE.settings.examDate} · 约 ${weeksUntilExam()} 周</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${p.streak} <span class="fire">🔥</span></div>
          <div class="stat-label">连续打卡 (天)</div>
          <div class="stat-foot">${p.lastCheckIn ? "上次：" + p.lastCheckIn : "今天开始第一天"}</div>
        </div>
        <div class="stat-card">
          <div class="ring" style="--pct:${pct}">
            <div class="ring-num">${pct}%</div>
          </div>
          <div class="stat-label">题库进度</div>
          <div class="stat-foot">已练 ${learned}/${total} 题</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${acc}%</div>
          <div class="stat-label">累计正确率</div>
          <div class="stat-foot">共答 ${p.totalAnswered} 题 · 错题本 ${wrongCount} 题</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${studyMinToday()}<span style="font-size:16px"> 分</span></div>
          <div class="stat-label">今日学习时间</div>
          <div class="stat-foot">累计 ${studyMinTotal()} 分钟</div>
        </div>
        <div class="stat-card link-card" data-route="progress">
          <div class="stat-num">📈</div>
          <div class="stat-label">学习进度</div>
          <div class="stat-foot">看各知识点通关率 →</div>
        </div>
      </div>

      ${renderScoreMap()}

      <div class="mainline-bar">
        <div class="ml-text">📚 学习主线：第 <b>${currentChapterIndex() + 1}</b>/${(window.SYLLABUS || []).length} 章 · 当前 <b>${escapeHtml((currentChapter() || {}).title || "")}</b></div>
        <button id="go-syllabus" class="btn btn-ghost btn-sm">看大纲 →</button>
      </div>

      <div id="coach-box" class="coach-box">
        <div class="coach-title">🎯 今日教练</div>
        <div id="coach-text" class="coach-text muted">点下方按钮，让 AI 教练根据你的情况说两句…</div>
        <button id="coach-btn" class="btn btn-ghost btn-sm">让 AI 教练点评</button>
      </div>

      <div id="ask-box" class="ask-box">
        <div class="ask-head">💬 问 AI 老师<span class="muted"> · 语法 / 单词 / 翻译 / 作文，随便问</span>
          <button id="ask-clear" class="btn btn-ghost btn-sm" title="清空对话">清空</button>
        </div>
        <div class="chat-window" id="ask-cw"></div>
        <div class="ask-chips" id="ask-chips">
          <button class="ask-chip" data-q="borrow 和 lend 有什么区别？">borrow 和 lend 的区别？</button>
          <button class="ask-chip" data-q="用简单的话讲讲现在完成时怎么用，给两个例句。">现在完成时怎么用？</button>
          <button class="ask-chip" data-q="把这句翻译成英文：我每天花一个小时学英语。">帮我翻译一句话</button>
          <button class="ask-chip" data-q="给我三个作文里常用、又不容易出错的高级句型。">作文常用高级句型</button>
        </div>
        <div class="tutor-ask">
          <input class="input" id="ask-input" placeholder="输入你的问题，按回车发送…" />
          <button class="btn btn-primary" id="ask-send">发送</button>
        </div>
      </div>

      <div class="quick-grid">
        <button class="quick" data-route="reading">📖 阅读/完形闯关</button>
        <button class="quick" data-route="practice">✍️ 分模块练习</button>
        <button class="quick" data-route="wrongbook">🔁 错题本 (${wrongCount})</button>
        <button class="quick" data-route="syllabus">📚 学习大纲</button>
        <button class="quick" data-route="writing">📝 写作模板</button>
        <button class="quick" data-route="conversation">💬 对话陪练</button>
        <button class="quick" data-route="mock">⏱️ 模拟考</button>
        <button class="quick" data-route="progress">📈 学习进度</button>
      </div>
    </div>`;

  const we = $("#warn-export");
  if (we) we.onclick = () => { exportState(); toast("已下载存档文件，请妥善保存"); };
  // 一键进入一条龙：自动跳过今天已完成的步骤，接着上次的地方往下走
  $("#start-daily").onclick = () => (allDone ? startChapterQuiz() : startFlow(true));
  $$(".quick").forEach((b) => (b.onclick = () => go(b.dataset.route)));
  $$(".link-card").forEach((b) => (b.onclick = () => go(b.dataset.route)));
  $("#coach-btn").onclick = runDailyCoach;
  const gp = $("#go-placement"); if (gp) gp.onclick = () => go("placement");
  const gs = $("#go-syllabus"); if (gs) gs.onclick = () => go("syllabus");
  bindDashChat();
};

/* -------- 首页「问 AI 老师」自由对话（多轮，本次打开期间保留） -------- */
const ASK_SYSTEM = `你是一位温暖、耐心的中国成人高考英语私教，学生英语约 A2 水平（新概念1）。
规则：
- 一律用【简单中文】讲解，必要的英文单词/例句用英文，但都配中文翻译。
- 回答要简短、抓重点、口语化，别堆术语；能举 1-2 个简单例句就举。
- 如果学生让翻译，就直接给地道又简单的译文，并可补一句用法提示。
- 只聊英语学习和考试相关的内容；无关问题礼貌地拉回到学习上。`;

function askBubble(cw, role, html) {
  const d = document.createElement("div");
  d.className = "bubble " + (role === "user" ? "bubble-user" : "bubble-ai");
  d.innerHTML = html;
  cw.appendChild(d); cw.scrollTop = cw.scrollHeight;
  return d;
}
function renderDashChat() {
  const cw = $("#ask-cw"), chips = $("#ask-chips");
  if (!cw) return;
  cw.innerHTML = "";
  if (!DASH_CHAT.length) {
    cw.style.display = "none";
    if (chips) chips.style.display = "flex";
    return;
  }
  cw.style.display = "flex";
  if (chips) chips.style.display = "none";
  DASH_CHAT.forEach((m) => askBubble(cw, m.role, m.role === "user" ? escapeHtml(m.content) : mdLite(m.content)));
}
function bindDashChat() {
  renderDashChat();
  const input = $("#ask-input");
  const doSend = () => { const v = input.value.trim(); if (!v) return; input.value = ""; dashChatSend(v); };
  $("#ask-send").onclick = doSend;
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSend(); });
  $$(".ask-chip").forEach((b) => (b.onclick = () => dashChatSend(b.dataset.q)));
  $("#ask-clear").onclick = () => { DASH_CHAT = []; renderDashChat(); };
}
async function dashChatSend(text) {
  const cw = $("#ask-cw"), chips = $("#ask-chips");
  if (chips) chips.style.display = "none";
  cw.style.display = "flex";
  askBubble(cw, "user", escapeHtml(text));
  if (!hasApiKey()) {
    askBubble(cw, "ai", '还没填 API Key，先到<b>【设置】</b>填一个 Anthropic API Key 就能问我啦～');
    return;
  }
  DASH_CHAT.push({ role: "user", content: text });
  const t = askBubble(cw, "ai", '<span class="muted">老师思考中…</span>');
  try {
    const r = await callClaude({ system: ASK_SYSTEM, messages: DASH_CHAT, maxTokens: 700 });
    DASH_CHAT.push({ role: "assistant", content: r });
    t.innerHTML = mdLite(r);
    cw.scrollTop = cw.scrollHeight;
  } catch (e) {
    t.innerHTML = '<span class="err">' + escapeHtml(e.message) + "</span>";
    DASH_CHAT.pop();   // 回滚这条 user，避免把失败请求留在历史里
  }
}

/* 首页「90分怎么拿」策略地图卡：分值条(送分/地基/技能三色) + 现实拿分路线 */
function renderScoreMap() {
  const SEGS = [
    { name: "写作", pts: 25, cat: "send" },
    { name: "对话", pts: 15, cat: "send" },
    { name: "语音", pts: 5, cat: "send" },
    { name: "词汇语法", pts: 15, cat: "base" },
    { name: "完形", pts: 30, cat: "skill" },
    { name: "阅读", pts: 60, cat: "skill" },
  ];
  const ROUTE = [
    ["✍️ 写作", 25, 18, "背 1 套模板 + 范文，分点写地道句"],
    ["🗣️ 补全对话", 15, 12, "礼貌应答套路吃熟，题型固定"],
    ["🔊 语音", 5, 4, "背发音规则，最快最稳的分"],
    ["📚 词汇语法", 15, 11, "高频词 + 核心语法刷到条件反射"],
    ["🧩 完形填空", 30, 18, "靠词汇 / 固定搭配 / 连词逻辑"],
    ["📖 阅读理解", 60, 32, "定位细节 + 猜词 + 主旨题技巧"],
  ];
  const target = ROUTE.reduce((s, r) => s + r[2], 0);
  const bar = SEGS.map((s) =>
    `<div class="sb-seg sb-${s.cat}" style="width:${(s.pts / 150 * 100).toFixed(2)}%" title="${s.name} ${s.pts}分"><span>${s.name}<i>${s.pts}</i></span></div>`).join("");
  const rows = ROUTE.map((r) =>
    `<tr><td class="sr-name">${r[0]}</td><td class="sr-full">${r[1]}</td><td class="sr-get"><b>${r[2]}</b></td><td class="sr-how">${r[3]}</td></tr>`).join("");
  return `
    <details class="score-map">
      <summary>🎯 90 分怎么拿？先吃满送分板块，再从阅读薅够 · <span class="sm-open">点开看分值地图</span></summary>
      <div class="score-map-body">
        <div class="sm-hint">试卷满分 150，六大板块。按<b>性价比</b>排兵，不是按考试顺序：</div>
        <div class="score-bar">${bar}</div>
        <div class="score-legend">
          <span><i class="dot send"></i><b>送分板块 45 分</b> · 背套路 / 模板，先吃满</span>
          <span><i class="dot base"></i><b>词汇语法 15 分</b> · 通吃四板块的地基</span>
          <span><i class="dot skill"></i><b>技能盘 90 分</b> · 靠技巧薅一半以上</span>
        </div>
        <div class="sm-route-title">🧭 你的 90 分路线（A2 基础也能到）：</div>
        <table class="score-route">
          <thead><tr><th>板块</th><th>满分</th><th>目标</th><th>怎么拿</th></tr></thead>
          <tbody>${rows}</tbody>
          <tfoot><tr><td>合计</td><td>150</td><td class="sr-get"><b>${target}</b></td><td>留足余量，稳过 90</td></tr></tfoot>
        </table>
        <div class="sm-punch">💡 <b>胜负手</b>：送分板块（写作/对话/语音 45 分）先背到手；<b>词汇</b>是同时喂养阅读·完形·写作·语法的唯一杠杆；90 分要求阅读+完形这 90 分的技能盘贡献一半以上，所以<b>阅读做题技巧</b>要专门练。别死磕难句——把高频词和题型套路吃透最划算。</div>
      </div>
    </details>`;
}

async function runDailyCoach() {
  const btn = $("#coach-btn");
  const box = $("#coach-text");
  if (!hasApiKey()) { box.innerHTML = "还没填 API Key，先到【设置】填一下就能用啦。"; return; }
  btn.disabled = true; btn.textContent = "教练思考中…";
  box.innerHTML = '<span class="muted">正在思考…</span>';
  const p = STATE.progress;
  const wrongTopics = {};
  getWrongQuestions().forEach((q) => (wrongTopics[q.topic] = (wrongTopics[q.topic] || 0) + 1));
  const wrongSummary = Object.entries(wrongTopics).map(([t, n]) => `${t}:${n}题`).join("，") || "暂无明显错题";
  try {
    const text = await callClaude({
      system: "你是一位温暖、务实的成人高考英语私教。用简单中文，两三句话，先鼓励再给今天最该做的一件事。别啰嗦。",
      messages: [{ role: "user", content:
        `学员情况：距考试${daysUntilExam()}天，当前阶段${STATE.settings.stage}，累计答题${p.totalAnswered}、正确率${p.totalAnswered?Math.round(p.totalCorrect/p.totalAnswered*100):0}%，连续打卡${p.streak}天。薄弱错题分布：${wrongSummary}。请给今天的一句话建议。` }],
      maxTokens: 300,
    });
    box.innerHTML = mdLite(text);
  } catch (e) {
    box.innerHTML = '<span class="err">' + escapeHtml(e.message) + "</span>";
  }
  btn.disabled = false; btn.textContent = "重新点评";
}

/* ========================================================================== */
/*                          页面：摸底测试（诊断 + 定制计划）                    */
/* ========================================================================== */
/* -------------------------- 摸底测试（一次性定级） --------------------------
   旧版的问题：从全题库**随机**抽 15 道，可能给你 3 道定语从句、0 道 be 动词，
   根本判断不出你哪章会哪章不会；而且测完只设了个 stage 标签，
   **主线照样从第 1 章开始，会的章一个都不跳**，等于白测。
   新版：每章各出 1 道（28 章全覆盖，按章序由易到难），哪章答对就把哪章标记为
   「摸底已过」，主线直接从你第一个不会的章开始，后面零星会的章也会自动跳过。 */
function placementPickForChapter(ch) {
  const pool = bankQuestions().filter((q) => ch.topics.includes(q.topic) && !isTyped(q));
  if (!pool.length) return null;
  // 优先中等难度：太简单会「蒙对就跳过」，太难会「明明会却判定不会」
  const byLv = (lv) => shuffle(pool.filter((q) => effLevel(q) === lv && !q.real));
  return byLv(2)[0] || byLv(1)[0] || byLv(3)[0] || shuffle(pool)[0];
}
function buildPlacementList() {
  return (window.SYLLABUS || []).map(placementPickForChapter).filter(Boolean);
}
/* 摸底判定通过的章（chapterPassed 的第 5 条通道） */
function placedPassed(no) { return (STATE.progress.placedPass || []).indexOf(no) >= 0; }

ROUTES.placement = function () {
  const done = STATE.progress.placement;
  const n = buildPlacementList().length;
  const skipped = (STATE.progress.placedPass || []).length;
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">摸底测试</h2>
      <p class="muted">${n} 道题，约 ${Math.round(n * 0.5)} 分钟，<b>28 章每章一道</b>，从最简单的 be 动词一路排到虚拟语气。<br>
      作用：<b>哪章你答对了，主线就直接跳过那一章</b>，不用再从第 1 章慢慢爬。测一次就定，之后按结果走。</p>
      <div class="kcard">
        <div class="kcard-title">💡 做之前先看一眼</div>
        <div>· 不会就不会，<b>别猜</b>——蒙对了会让系统以为你懂，把该学的章跳掉。</div>
        <div>· 完全没头绪的题，随便选一个继续就行，判错反而是准的。</div>
        <div>· 做完可以看每题解析，本身也是一轮复习。</div>
        <div>· 结果不满意随时能重测，也能一键取消所有跳过。</div>
      </div>
      ${done ? `<div class="kcard"><div class="kcard-title">上次结果（${done.date}）</div>
        <div>水平定位：<b>${done.levelLabel}</b>${done.total ? ` · 答对 ${done.correct}/${done.total}` : ""}</div>
        <div class="muted" style="margin-top:6px">已跳过 <b>${skipped}</b> 章，当前主线在第 ${currentChapterIndex() + 1} 章</div>
      </div>` : ""}
      <button id="start-placement" class="btn btn-primary btn-big">${done ? "重新测一次" : "开始摸底测试 →"}</button>
      ${skipped ? `<button id="undo-skip" class="btn btn-ghost" style="margin-top:10px">取消所有跳过，从第 1 章重新学</button>` : ""}
    </div>`;
  $(".back-link").onclick = () => go("dashboard");
  $("#start-placement").onclick = () => {
    STATE.progress.placedPass = [];           // 重测前先清掉旧的跳过结果
    saveState();
    startQuiz(buildPlacementList(), { title: "摸底测试", placement: true });
  };
  const us = $("#undo-skip");
  if (us) us.onclick = () => {
    if (!confirm("取消所有跳过？主线会回到第 1 章从头学（已做过的题目记录不受影响）。")) return;
    STATE.progress.placedPass = []; saveState(); toast("已取消跳过"); go("dashboard");
  };
};

function finishPlacement() {
  const byLevel = { 1: { c: 0, n: 0 }, 2: { c: 0, n: 0 }, 3: { c: 0, n: 0 } };
  QUIZ.results.forEach((r) => {
    const q = questionById(r.id); if (!q) return;
    const lv = effLevel(q);
    byLevel[lv].n++; if (r.correct) byLevel[lv].c++;
  });
  const acc = (lv) => (byLevel[lv].n ? byLevel[lv].c / byLevel[lv].n : 0);
  const a1 = acc(1), a2 = acc(2), a3 = acc(3);
  const totalC = QUIZ.correct, totalN = QUIZ.list.length;

  // 定位 + 计划
  let stage, levelLabel, plan, band;
  if (a1 < 0.7) {
    stage = 1; levelLabel = "入门夯实期";
    band = "基础还比较薄，但别急——地基打牢了后面提分很快。";
    plan = ["主攻【入门】题，把 be动词、时态、单复数、介词这些地基吃透",
      "每天先看 1 张讲解卡再做题，错题必点『让 AI 再讲一遍』直到懂",
      "写作先只背 A 书信模板；会话背最基础的问候/道谢应答"];
  } else if (a2 < 0.6) {
    stage = 1; levelLabel = "进阶攻坚期";
    band = "基础不错！卡点在核心语法，攻下来冲 90 分很有戏。";
    plan = ["重点练【进阶】题：虚拟语气、定语从句、固定搭配、完形/阅读技巧",
      "入门题快速过一遍查漏，进阶错题反复刷",
      "写作把 3 套模板都背下来，开始用 AI 批改练手感"];
  } else if (a3 < 0.6) {
    stage = 2; levelLabel = "冲刺预备期";
    band = "水平挺好！可以开始上真题难度了。";
    plan = ["开始做【冲刺/真题】难度题 + 每周模拟考",
      "错题本重点攻，尤其虚拟语气、倒装、词义辨析这些易错点",
      "每周写 1–2 篇作文让 AI 批改，背熟范文"];
  } else {
    stage = 3; levelLabel = "冲刺拔高期";
    band = "底子很扎实，目标可以往更高冲。";
    plan = ["直接进冲刺：模拟考反复做、错题本清零、真题掐时间",
      "作文每周练、追求地道表达，会话多和 AI 练真实情景",
      "查漏补缺，把偶尔错的难点彻底搞定"];
  }

  // -------- 按章判定：哪章答对就跳过哪章（这才是摸底真正的价值） --------
  const passList = [], failList = [];
  QUIZ.results.forEach((r) => {
    const q = questionById(r.id); if (!q) return;
    const ch = chapterOfTopic(q.topic); if (!ch) return;
    (r.correct ? passList : failList).push(ch.no);
  });
  STATE.progress.placedPass = passList.slice().sort((a, b) => a - b);

  STATE.settings.stage = stage;
  STATE.progress.placement = {
    date: todayStr(), levelLabel, stage, correct: totalC, total: totalN,
    byLevel: { 1: [byLevel[1].c, byLevel[1].n], 2: [byLevel[2].c, byLevel[2].n], 3: [byLevel[3].c, byLevel[3].n] },
  };
  saveState();

  const startCh = currentChapter() || {};
  const chName = (n) => { const c = (window.SYLLABUS || []).find((x) => x.no === n); return c ? `第${n}章 ${c.title}` : `第${n}章`; };
  const skipHtml = `
    <div class="kcard" style="text-align:left">
      <div class="kcard-title">🎯 根据结果，主线已经帮你调好了</div>
      <div style="margin:6px 0"><b>你从「${escapeHtml(startCh.title || "第 1 章")}」开始学</b>（第 ${currentChapterIndex() + 1}/${(window.SYLLABUS || []).length} 章）</div>
      ${passList.length ? `<div class="muted" style="margin-top:8px">✅ 这 ${passList.length} 章你会了，已跳过，不用再学：<br>${
        STATE.progress.placedPass.map(chName).map(escapeHtml).join("、")}</div>` : ""}
      ${failList.length ? `<div class="muted" style="margin-top:8px">📖 这 ${failList.length} 章要学：${
        failList.sort((a, b) => a - b).slice(0, 8).map(chName).map(escapeHtml).join("、")}${failList.length > 8 ? " 等" : ""}</div>` : ""}
      <div class="muted" style="margin-top:8px">⚠️ 有蒙对的？点下面「取消所有跳过」就能回到第 1 章从头学。跳过的章，它们的题目仍会在日常复习里出现。</div>
      <button id="pl-undo" class="btn btn-ghost btn-sm" style="margin-top:8px">取消所有跳过</button>
    </div>`;

  const bar = (lv) => {
    const p = Math.round(acc(lv) * 100);
    return `<div class="pl-row"><span class="pl-lab">${LEVEL_NAMES[lv]}</span>
      <div class="pl-track"><div class="pl-fill lv${lv}" style="width:${p}%"></div></div>
      <span class="pl-num">${byLevel[lv].c}/${byLevel[lv].n}</span></div>`;
  };

  contentEl.innerHTML = `
    <div class="page result-page">
      <div class="result-emoji">🧭</div>
      <h2 class="page-title">摸底完成 · 你的水平定位</h2>
      <div class="result-score">${totalC} / ${totalN} 正确</div>
      <div class="level-badge">${levelLabel}</div>
      <div class="pl-bars">${bar(1)}${bar(2)}${bar(3)}</div>
      <p class="muted" style="margin-top:12px">${band}</p>
      <div class="kcard" style="text-align:left">
        <div class="kcard-title">📋 给你的定制计划（已自动设为${{1:"阶段一",2:"阶段二",3:"阶段三"}[stage]}）</div>
        <ul class="kcard-points">${plan.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
      </div>
      ${skipHtml}
      <div id="ai-plan-box"></div>
      <div class="row-center">
        <button id="pl-start" class="btn btn-primary btn-big">开始今天的学习 →</button>
        <button id="pl-ai" class="btn btn-ghost">🤖 让 AI 教练写份更详细的计划</button>
      </div>
    </div>`;
  $("#pl-start").onclick = () => startFlow(true);
  $("#pl-ai").onclick = () => aiCustomPlan(byLevel, levelLabel);
  $("#pl-undo").onclick = () => {
    if (!confirm("取消所有跳过？主线会回到第 1 章从头学。")) return;
    STATE.progress.placedPass = []; saveState(); toast("已取消跳过，回到第 1 章"); go("dashboard");
  };
}

async function aiCustomPlan(byLevel, levelLabel) {
  const box = $("#ai-plan-box");
  if (!hasApiKey()) { box.innerHTML = '<div class="err">让 AI 写详细计划需要先在【设置】填 API Key。上面那份计划不用联网也能照着练。</div>'; return; }
  box.innerHTML = '<div class="kcard"><span class="muted">AI 教练正在为你定制计划…</span></div>';
  try {
    const text = await callClaude({
      strong: true,
      system: "你是成人高考英语私教。学生 A2 水平、目标 150 分考到 90+（60%）。拿分策略：送分板块(写作25/对话15/语音5=45)优先背套路模板吃满；词汇是通吃阅读/完形/写作/语法的地基；阅读+完形这90分靠做题技巧薅一半以上。请用简单中文，根据摸底结果，写一份未来 2 周的具体计划：每周重点、每天大概做什么、先补哪块。要具体、可执行、鼓励，别超过 250 字。",
      messages: [{ role: "user", content:
        `我的摸底结果：入门 ${byLevel[1][0]}/${byLevel[1][1]}，进阶 ${byLevel[2][0]}/${byLevel[2][1]}，冲刺 ${byLevel[3][0]}/${byLevel[3][1]}，定位「${levelLabel}」，距考试 ${daysUntilExam()} 天。请给我未来两周的详细训练计划。` }],
      maxTokens: 900,
    });
    box.innerHTML = `<div class="kcard" style="text-align:left"><div class="kcard-title">🤖 AI 定制两周计划</div><div>${mdLite(text)}</div></div>`;
  } catch (e) { box.innerHTML = '<div class="err">' + escapeHtml(e.message) + "</div>"; }
}

/* ========================================================================== */
/*                          页面：今日训练（组卷）                              */
/* ========================================================================== */
/* ========================================================================== */
/*                     页面：今日学习清单（把一切串成系统）                     */
/* ========================================================================== */
const WRITE_TASKS = [
  "抄写并默写今天背的 3 个写作金句",
  "用「祝贺信」模板写 5 句话，祝贺朋友考上学校",
  "写一篇 60 词的小日记（今天做了什么，早→午→晚）",
  "用「议论文」开头写 3 句：为什么要学英语",
  "挑今天错的 1 道题，把正确的英文句子抄写 3 遍",
  "用「邀请信」模板写 5 句话，约朋友周末打球",
  "背默一遍 A 书信模板的开头和结尾句",
];

/* 找你最该补的语法点：一次性通关率最低（且做过≥3题）的组 */
function weakestGroup() {
  let worst = null, worstRate = 101;
  GRAMMAR_GROUPS.forEach((g) => {
    const st = statsFor((q) => g.topics.includes(q.topic));
    if (st.attempted >= 3 && st.rate < worstRate) { worstRate = st.rate; worst = g; }
  });
  if (!worst) worst = GRAMMAR_GROUPS.find((g) => allQuestions().some((q) => g.topics.includes(q.topic)));
  return worst;
}
function taskState() {
  const p = STATE.progress;
  if (!p.taskDone) p.taskDone = {};
  const d = todayStr();
  if (!p.taskDone[d]) p.taskDone[d] = {};
  return p.taskDone[d];
}
function markTask(key) { taskState()[key] = true; saveState(); }
/* 每日情景对话：轮换到读得最少的那段 */
function pickDailyDialogue() {
  const seen = STATE.progress.dlgSeen || {};
  return (window.DIALOGUES || []).slice().sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0))[0];
}
function bumpDlg(id) { const p = STATE.progress; if (!p.dlgSeen) p.dlgSeen = {}; p.dlgSeen[id] = (p.dlgSeen[id] || 0) + 1; saveState(); }

/* ==========================================================================
 *                      今日一条龙（点一次「开始学习」，跟着走到底）
 * 设计原则：用户不需要做任何选择。每一步做完自动进下一步，中途退出能续上。
 * 步骤：学知识 → 精读(+读后题) → 练本章 → 复习旧题 → 送分板块(对话/写作)
 * ========================================================================== */
let FLOW = null;   // { steps:[...], i:当前第几步 }

/* -------------------------- 真题练习（严格跟着学习进度） --------------------------
   真题只出**已解锁章节**的考点，绝不提前考没学过的东西。

   ⚠️ 曾经的错误设计（别再犯）：以前给语音题开了「永久开放」的例外，理由是
      "语音不依赖语法基础，又是 7.5 分送分板块，第一天就该练"。
      **这个理由是错的**——语音题不依赖语法，但**重度依赖词汇量**：
      arise / possess / professor / medicine / widow 这些词，第1章的学员根本没见过，
      看都看不懂，更别说判断读音。结果就是每天 5 道天书，用户直接反馈"根本不会写"。
      语音真题现在归第 25 章管，到那时词汇量够了再练，才是真送分。 */
const REAL_DAILY_COUNT = 15;                      // 每天真题练习最多出多少道
const REAL_MIN_TO_SHOW = 4;                       // 可做真题少于这个数就不排这一步（避免只有1道也占一格）
/* 单模块上限：照真卷的卷面比例来。一整套成考真卷只有 **5 道语音**（7.5分/150），
   所以每天最多出 5 道语音。
   ⚠️ 别去掉这个上限：前几章语法真题还没解锁时，池子里只剩语音，
   不设上限就会连续出 15 道语音——语音才占卷面 5%，纯属浪费时间（踩过）。 */
const REAL_MODULE_CAP = { phonetics: 5 };

const REAL_NEED_PRACTICE = 8;   // 某章至少练过这么多道普通题，它的真题才出现

function realQuestions() { return bankQuestions().filter((q) => q.real); }
/* 当前阶段可以做的真题。
   规则：**真题是检验，不是教学——必须先在普通题里练过这一章，才拿真题考你。**
   光看"解锁"不够：送分轨道一开放，语音考点立刻解锁，但学员可能一道语音题都没练过，
   真题里 arise/possess/professor 这些词照样看不懂（用户已经反馈过一次）。 */
function realAvailable() {
  const unlocked = unlockedTopicSet();
  return realQuestions().filter((q) => {
    if (!unlocked.has(q.topic)) return false;
    const ch = chapterOfTopic(q.topic);
    if (!ch) return false;
    return chapterPassed(ch) || chAttempts(ch.no) >= REAL_NEED_PRACTICE;
  });
}
/* 真题还没解锁时，告诉用户「学到第几章就能开始做真题」，别让人以为功能坏了 */
function realUnlockAtChapter() {
  const list = window.SYLLABUS || [];
  const counts = [];
  for (let i = 0; i < list.length; i++) {
    const set = new Set();
    list.slice(0, i + 1).forEach((ch) => ch.topics.forEach((t) => set.add(t)));
    const n = realQuestions().filter((q) => set.has(q.topic)).length;
    counts.push({ no: list[i].no, n });
  }
  const hit = counts.find((c) => c.n >= REAL_MIN_TO_SHOW);
  return hit ? hit.no : null;
}
/* 组卷：没做过的排最前、同"做过次数"内先易后难；再按模块上限削顶 */
function buildRealList() {
  const pool = orderForPractice(realAvailable(), 0);
  const used = {}, list = [];
  for (const q of pool) {
    const cap = REAL_MODULE_CAP[q.module], n = used[q.module] || 0;
    if (cap && n >= cap) continue;
    list.push(q); used[q.module] = n + 1;
    if (list.length >= REAL_DAILY_COUNT) break;
  }
  return list;
}

/* ==========================================================================
 *                    备考三阶段（按距考试天数自动切换）
 * 为什么要阶段：只按"学完第N章才进下一章"推进，很容易考前一周才碰到阅读和完形。
 *   阶段是**时间闸**——到日子就把该练的东西加进每日流程，不管主线学到第几章。
 *   主线该慢还是慢（地基不能跳），但送分板块和解题技巧不等它。
 * ========================================================================== */
function examPhase() {
  const d = daysUntilExam();
  if (d > 47) return 1;
  if (d > 21) return 2;
  return 3;
}
const PHASE_INFO = {
  1: { name: "地基期", tip: "打语法地基，同时开始背作文模板、记语音规律" },
  2: { name: "攻坚期", tip: "进阶语法 + 阅读/完形技巧 + 补全对话套路" },
  3: { name: "冲刺期", tip: "整卷模拟、掐时间、错题清零" },
};

/* 送分板块轮转表：写作25 + 补全对话15 + 语音7.5 ＝ 47.5 分，
   这些几乎不依赖语法水平，零基础也能拿，所以每天必占一格，按阶段换重点。 */
function bonusRotation() {
  const p = examPhase();
  if (p === 1) return ["write", "phonetics", "write", "dialogue"];
  if (p === 2) return ["write", "convquiz", "readskill", "clozeq", "phonetics", "dialogue"];
  return ["write", "clozeq", "readskill", "convquiz"];
}
function bonusTasksToday(n) {
  const rot = bonusRotation();
  const base = ((daysBetween("2026-01-01", todayStr()) % rot.length) + rot.length) % rot.length;
  const out = [];
  for (let i = 0; i < n; i++) out.push(rot[(base + i) % rot.length]);
  return out.filter((v, i) => out.indexOf(v) === i);   // 同一天不重复
}
const BONUS_DEF = {
  write:     { emoji: "📝", title: "今日作文", sub: "送分板块 · 占 25 分，背熟模板就能拿", min: 8 },
  dialogue:  { emoji: "🗣️", title: "情景对话", sub: "读一段对话，练应答套路", min: 5 },
  phonetics: { emoji: "🔤", title: "语音规律", sub: "送分板块 · 占 7.5 分，纯规律、最好拿", min: 5 },
  convquiz:  { emoji: "💬", title: "补全对话", sub: "送分板块 · 占 15 分，套路题", min: 6 },
  readskill: { emoji: "📗", title: "阅读理解", sub: "占 45 分，全卷最大头", min: 8 },
  clozeq:    { emoji: "🧩", title: "完形填空", sub: "占 30 分", min: 8 },
};
/* 送分板块的题目：用带解析的普通题（不上真题——真题要"练过才考"，见 realAvailable） */
function bonusQuizList(key) {
  const mod = { phonetics: "phonetics", convquiz: "conversation", readskill: "reading", clozeq: "cloze" }[key];
  if (!mod) return [];
  const pool = bankQuestions().filter((q) => q.module === mod && !q.real);
  if (key === "phonetics" || key === "convquiz") return orderForPractice(pool, 10);
  // 阅读/完形是"一篇文章配一组题"，按文章分组，挑练得最少的那一组整组做，别把几篇混在一起
  const groups = {};
  pool.forEach((q) => {
    const k = String(q.passage || q.article || q.text || q.topic).slice(0, 60);
    (groups[k] = groups[k] || []).push(q);
  });
  const srs = STATE.progress.srs || {};
  const seenOf = (arr) => arr.reduce((s, q) => s + ((srs[q.id] && srs[q.id].seen) || 0), 0);
  return (Object.values(groups).sort((a, b) => seenOf(a) - seenOf(b))[0]) || [];
}

function buildFlowSteps() {
  const min = STATE.settings.dailyMinutes;
  const ch = currentChapter();
  const steps = [];
  steps.push({ key: "study", emoji: "📖", title: "学知识", sub: `第 ${ch.no} 章「${ch.title}」白话讲解 + 易错点`, min: min <= 25 ? 6 : 8 });
  steps.push({ key: "read", emoji: "📕", title: "课文精读", sub: "读一篇短文，做读后理解题", min: min <= 25 ? 5 : 6 });
  steps.push({ key: "learn", emoji: "✍️", title: "练本章", sub: `${dailyTargetCount()} 道题，只出学过的语法`, min: min <= 25 ? 7 : 10 });
  // 真题练习：解锁的真题够多才排这一步。少于 REAL_MIN_TO_SHOW 道就不排——
  // 硬凑几道你还没学到的题，只会让人做不下去（踩过：前几章曾天天出 5 道语音天书）
  const realList = buildRealList();
  if (realList.length >= REAL_MIN_TO_SHOW) {
    const gN = realList.filter((q) => q.module !== "phonetics").length;
    const pN = realList.length - gN;
    steps.push({ key: "real", emoji: "🎯", title: "真题练习",
      sub: `${realList.length} 道历年真题（${gN ? `语法词汇 ${gN} 道 + ` : ""}语音 ${pN} 道，只出你学过的考点）`,
      min: realList.length <= 6 ? 4 : (min <= 25 ? 6 : 8) });
  }
  const qDue = getDueQuestions().filter((q) => unlockedTopicSet().has(q.topic)).length;
  if (min >= 40 && qDue) steps.push({ key: "review", emoji: "🔄", title: "复习巩固", sub: `${qDue} 道到期旧题`, min: 6 });
  // 送分板块：每天必占一格（50分档两格）。这 47.5 分不依赖语法进度，
  // 零基础也能拿，所以哪怕 25 分钟档也要留位置——它是性价比最高的一块。
  bonusTasksToday(min >= 50 ? 2 : 1).forEach((key) => {
    const d = BONUS_DEF[key];
    if (!d) return;
    if (key === "dialogue") {
      const dlg = pickDailyDialogue();
      if (!dlg) return;
      steps.push({ key: "dialogue", emoji: d.emoji, title: d.title, sub: dlg.title, min: d.min, dlgId: dlg.id });
      return;
    }
    if (key === "write") { steps.push({ key: "write", emoji: d.emoji, title: d.title, sub: d.sub, min: d.min }); return; }
    const list = bonusQuizList(key);
    if (!list.length) return;                     // 没题就跳过，别排空步骤
    steps.push({ key, emoji: d.emoji, title: d.title, sub: `${list.length} 道 · ${d.sub}`, min: d.min });
  });
  return steps;
}

/* 开始/继续今天的一条龙。resume=true 时自动跳过今天已完成的步骤 */
function startFlow(resume) {
  const steps = buildFlowSteps();
  let i = 0;
  if (resume) { const done = taskState(); while (i < steps.length && done[steps[i].key]) i++; }
  FLOW = { steps, i };
  CURRENT_ROUTE = "flow";
  renderFlowStep();
}
function flowQuit() { FLOW = null; go("dashboard"); }
function flowNext() {
  if (!FLOW) return go("dashboard");
  markTask(FLOW.steps[FLOW.i].key);
  FLOW.i++;
  renderFlowStep();
}
/* 顶部步骤条：让人始终知道“还剩几步”，这是能坚持下去的关键 */
function flowHeader() {
  if (!FLOW) return "";
  const s = FLOW.steps[FLOW.i];
  return `
    <div class="flow-top">
      <div class="flow-dots">
        ${FLOW.steps.map((x, i) => `<span class="fd ${i < FLOW.i ? "fd-done" : i === FLOW.i ? "fd-now" : ""}" title="${escapeHtml(x.title)}">${i < FLOW.i ? "✓" : x.emoji}</span>`).join("<i class='fd-line'></i>")}
      </div>
      <div class="flow-step-name">第 ${FLOW.i + 1} 步 / 共 ${FLOW.steps.length} 步 · <b>${escapeHtml(s.title)}</b> · 约 ${s.min} 分钟</div>
      <button class="flow-quit" id="flow-quit">暂停退出</button>
    </div>`;
}
function bindFlowHeader() { const q = $("#flow-quit"); if (q) q.onclick = flowQuit; }
/* 给「非答题类」步骤统一加底部“下一步”按钮 */
function flowFooter(label) {
  const bar = document.createElement("div");
  bar.className = "flow-footer";
  bar.innerHTML = `<button class="btn btn-primary btn-big" id="flow-next">${label} →</button>`;
  contentEl.appendChild(bar);
  $("#flow-next").onclick = flowNext;
}

function renderFlowStep() {
  if (!FLOW) return go("dashboard");
  if (FLOW.i >= FLOW.steps.length) return renderFlowDone();
  const s = FLOW.steps[FLOW.i];
  const ch = currentChapter();
  window.scrollTo(0, 0);

  if (s.key === "study") {
    contentEl.innerHTML = `<div class="page">${flowHeader()}
      <h2 class="page-title">先把这个点学明白</h2>
      <p class="muted">今天只学这一个语法点。看完讲解和易错点，再往下走。</p>
      ${renderChapterCard(ch)}</div>`;
    bindFlowHeader(); flowFooter("学明白了，去读课文"); return;
  }
  if (s.key === "read") { renderFlowReading(ch); return; }
  if (s.key === "learn") {
    startQuiz(buildDailyList(ch), { title: "练本章 · " + ch.title, daily: true, checkIn: true, flow: true });
    return;
  }
  if (s.key === "real") {
    const list = buildRealList();
    if (!list.length) return flowNext();
    startQuiz(list, { title: "真题练习", flow: true, taskKey: "real" });
    return;
  }
  // 送分板块里的做题类步骤（语音 / 补全对话 / 阅读 / 完形）
  if (BONUS_DEF[s.key] && s.key !== "write" && s.key !== "dialogue") {
    const list = bonusQuizList(s.key);
    if (!list.length) return flowNext();
    startQuiz(list, { title: BONUS_DEF[s.key].title, flow: true, taskKey: s.key });
    return;
  }
  if (s.key === "review") {
    const unlocked = unlockedTopicSet();
    let list = getDueQuestions().filter((q) => unlocked.has(q.topic));
    if (!list.length) list = getWrongQuestions().filter((q) => unlocked.has(q.topic) || q.fission);
    if (!list.length) return flowNext();
    startQuiz(shuffle(list).slice(0, 10), { title: "复习巩固", flow: true });
    return;
  }
  if (s.key === "dialogue") {
    if (!s.dlgId) return flowNext();
    // ⚠️ openDialogue 需要一个 #dlg-view 容器（平时由 renderDialogueList 建），这里自己建，
    //    否则 $("#dlg-view") 取到 null 会抛错、整步白屏。
    contentEl.innerHTML = `<div class="page">${flowHeader()}
      <h2 class="page-title">情景对话</h2>
      <p class="muted">补全对话占 15 分，是送分板块。先自己读一遍，再点「译」对答案，最好跟着 🔊 读出声。</p>
      <div id="dlg-view"></div></div>`;
    bindFlowHeader();
    openDialogue(s.dlgId); bumpDlg(s.dlgId);
    flowFooter("读完了，下一步"); return;
  }
  if (s.key === "write") {
    ROUTES.writing();
    const pg = contentEl.querySelector(".page");
    if (pg) { pg.insertAdjacentHTML("afterbegin", flowHeader()); bindFlowHeader(); }
    flowFooter("写完了，完成今天"); return;
  }
  flowNext();
}

/* 精读步骤：课文（点句看翻译/逐句朗读）→ 读后理解题（选完立刻讲为什么） */
function renderFlowReading(ch) {
  const g = (window.READINGS_GRADED || {})[ch.no];
  const rd = g || (window.READINGS || {})[ch.no];
  if (!rd) return flowNext();
  const qs = (g && g.qs) || [];
  contentEl.innerHTML = `<div class="page">${flowHeader()}
    <h2 class="page-title">课文精读</h2>
    <p class="muted">先通读一遍别查翻译，读完再<b>点句子</b>核对中文。生词双击可以查释义。${g ? `本篇 ${g.words} 词。` : ""}</p>
    <div class="kcard rt-card">
      <div class="kcard-title">📖 ${escapeHtml(rd.title)}</div>
      ${rd.tip ? `<p class="rt-tip">读前提示：${escapeHtml(rd.tip)}</p>` : ""}
      ${rd.sents.map((s, i) => `
        <div class="rt-sent" data-i="${i}">
          <div class="rt-en">${escapeHtml(s.en)} <button class="say-btn rt-say" data-i="${i}" title="听这句">🔊</button></div>
          <div class="rt-zh">${escapeHtml(s.zh)}</div>
        </div>`).join("")}
      <div class="row-center" style="margin-top:12px"><button id="rt-say-all" class="btn btn-ghost btn-sm">🔊 朗读全文</button></div>
    </div>
    ${qs.length ? `<div class="kcard">
      <div class="kcard-title">✅ 读后理解（${qs.length} 题）</div>
      <p class="muted" style="margin-top:-4px">不用背，答案就在原文里——找到那一句就行。</p>
      ${qs.map((q, qi) => `
        <div class="rq" data-qi="${qi}">
          <div class="rq-stem">${qi + 1}. ${escapeHtml(q.q)}</div>
          ${q.opts.map((o, oi) => `<button class="rq-opt" data-qi="${qi}" data-oi="${oi}">${String.fromCharCode(65 + oi)}. ${escapeHtml(o)}</button>`).join("")}
          <div class="rq-why"></div>
        </div>`).join("")}
    </div>` : ""}</div>`;
  bindFlowHeader();
  $$(".rt-sent").forEach((el) => (el.onclick = (e) => { if (!e.target.classList.contains("rt-say")) el.classList.toggle("open"); }));
  $$(".rt-say").forEach((b) => (b.onclick = () => speak(rd.sents[parseInt(b.dataset.i, 10)].en)));
  const sa = $("#rt-say-all"); if (sa) sa.onclick = () => speak(rd.sents.map((s) => s.en).join(" "));
  let answered = 0;
  $$(".rq-opt").forEach((b) => (b.onclick = () => {
    const qi = +b.dataset.qi, oi = +b.dataset.oi, q = qs[qi];
    const box = document.querySelector(`.rq[data-qi="${qi}"]`);
    if (box.classList.contains("done")) return;
    box.classList.add("done");
    box.querySelectorAll(".rq-opt").forEach((x, i) => {
      if (i === q.ans) x.classList.add("rq-right");
      else if (i === oi) x.classList.add("rq-wrong");
    });
    box.querySelector(".rq-why").innerHTML =
      `<b>${oi === q.ans ? "✅ 对了" : "❌ 正确答案是 " + String.fromCharCode(65 + q.ans)}</b><br>${escapeHtml(q.why)}`;
    answered++;
    if (answered === qs.length) { const n = $("#flow-next"); if (n) n.textContent = "全部答完，去练本章 →"; }
  }));
  flowFooter(qs.length ? "读完做完，去练本章" : "读完了，去练本章");
}

function renderFlowDone() {
  const mins = studyMinToday();
  const ch = currentChapter();
  const days = daysBetween(todayStr(), "2026-10-17");
  contentEl.innerHTML = `
    <div class="page result-page">
      <div class="result-emoji">🎉</div>
      <h2 class="page-title">今天的任务全部完成！</h2>
      <div class="result-score">学习 ${mins} 分钟 · 连续打卡 ${STATE.progress.streak || 0} 天</div>
      <div class="muted" style="margin-top:8px">当前进度：第 ${ch.no}/${(window.SYLLABUS || []).length} 章 · 距考试还有 ${days} 天</div>
      <div class="kcard" style="text-align:left;margin-top:18px">
        <div class="kcard-title">📋 今天走完的路</div>
        ${FLOW.steps.map((s) => `<div>${s.emoji} ${escapeHtml(s.title)} —— ${escapeHtml(s.sub)}</div>`).join("")}
      </div>
      <div class="row-center">
        <button id="fd-more" class="btn btn-primary">还想练？再来一组题</button>
        <button id="fd-home" class="btn btn-ghost">回首页</button>
      </div>
    </div>`;
  $("#fd-home").onclick = flowQuit;
  $("#fd-more").onclick = () => { FLOW = null; startChapterQuiz(); };
}

ROUTES.flow = function () { startFlow(true); };

ROUTES.today = function () {
  const min = STATE.settings.dailyMinutes;
  const card = pickDailyCard();
  const dlg = pickDailyDialogue();
  const writeTask = WRITE_TASKS[new Date().getDay() % WRITE_TASKS.length];
  const done = taskState();
  const unlocked = unlockedTopicSet();
  const qDue = getDueQuestions().filter((q) => unlocked.has(q.topic)).length;

  /* 固定学习法（每天同一个节奏）：①学知识+课文精读 ②练本章 (→③复习旧题 ④对话 ⑤写作) */
  const items = [];
  items.push({ key: "study", emoji: "📖", title: `学知识 · 第 ${card.no} 章`, desc: `「${card.title}」白话讲解 + 课文精读，先学明白再做题`, min: min <= 25 ? 8 : 10, route: "study" });
  items.push({ key: "learn", emoji: "✍️", title: "练本章", desc: `${dailyTargetCount()} 道题：主攻「${card.title}」，只出学过的点，绝不出没学的语法`, min: min <= 25 ? 7 : 10, act: "chquiz" });
  if (min >= 40) {
    items.push({ key: "review", emoji: "🔄", title: "复习巩固（旧题）", desc: qDue ? `${qDue} 道到期旧题（全部来自学过的章节）` : "没有到期旧题，就把最近的错题再过一遍", min: 7, act: "review" });
    // 送分板块：写作25分+对话15分是保60的核心，必须常练。
    // 50分钟档两个都练；40分钟档隔天轮换（今天对话、明天写作），保证每周都写作文。
    const dlgItem = { key: "dialogue", emoji: "🗣️", title: "情景对话（送分板块）", desc: `读 1 段（能听🔊+看翻译）：${dlg ? dlg.title : ""}`, min: 5, act: "dialogue", dlgId: dlg ? dlg.id : null };
    const writeItem = { key: "write", emoji: "📝", title: "今日作业（送分板块·占25分）", desc: writeTask, min: 8, route: "writing" };
    if (min >= 50) items.push(dlgItem, writeItem);
    else items.push(daysBetween("2026-01-01", todayStr()) % 2 === 0 ? dlgItem : writeItem);
  }
  const doneCount = items.filter((it) => done[it.key]).length;
  const allDone = doneCount === items.length;

  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">今日学习清单</h2>
      <p class="muted">约 ${min} 分钟，每天同一个节奏：<b>学懂 → 练会 → 巩固</b>。今天主线：第 ${card.no}/28 章「${escapeHtml(card.title)}」。${qDue ? `到期复习：<b>${qDue} 道题</b>。` : "没有积压的复习，轻装上阵。"}</p>
      <div class="task-progress"><div class="task-progress-fill" style="width:${Math.round(doneCount / items.length * 100)}%"></div></div>
      <div class="task-progress-label">${doneCount}/${items.length} 完成${allDone ? " · 🎉 今日达成！" : ""}</div>
      <div class="task-list">
        ${items.map((it) => `
          <div class="task-item ${done[it.key] ? "task-done" : ""}">
            <button class="task-check" data-key="${it.key}">${done[it.key] ? "✅" : "⬜"}</button>
            <div class="task-body">
              <div class="task-head"><span class="task-emoji">${it.emoji}</span><b>${it.title}</b><span class="task-min">${it.min} 分</span></div>
              <div class="task-desc">${escapeHtml(it.desc)}</div>
            </div>
            <button class="task-go btn btn-primary btn-sm" data-key="${it.key}">去做 →</button>
          </div>`).join("")}
      </div>
      ${weakChapters().length ? `<p class="muted" style="margin-top:14px">
        📌 这些章当时是「练够了先放你过去」，还没真吃透：${weakChapters().sort((a, b) => a - b)
          .map((n) => { const c = (window.SYLLABUS || []).find((x) => x.no === n); return "第" + n + "章" + (c ? "「" + escapeHtml(c.title) + "」" : ""); }).join("、")}。
        它们的题会在每天的复习里优先回访，练顺了会自动摘掉这个标记。</p>` : ""}
    </div>`;
  $(".back-link").onclick = () => go("dashboard");
  $$(".task-check").forEach((b) => (b.onclick = () => {
    const k = b.dataset.key; const st = taskState(); st[k] = !st[k]; saveState(); ROUTES.today();
  }));
  $$(".task-go").forEach((b) => (b.onclick = () => {
    const it = items.find((x) => x.key === b.dataset.key);
    if (it.route) go(it.route);
    else if (it.act === "chquiz") {
      startChapterQuiz();
    } else if (it.act === "review") {
      const unlocked2 = unlockedTopicSet();
      let list = getDueQuestions().filter((q) => unlocked2.has(q.topic));
      if (!list.length) list = getWrongQuestions().filter((q) => unlocked2.has(q.topic) || q.fission);
      if (!list.length) { toast("没有要复习的旧题，太棒了！"); markTask("review"); ROUTES.today(); return; }
      startQuiz(shuffle(list).slice(0, 10), { title: "复习巩固", taskKey: "review" });
    } else if (it.act === "dialogue") {
      if (!it.dlgId) { go("conversation"); return; }
      go("conversation"); renderDialogueList(); openDialogue(it.dlgId);
      markTask("dialogue"); bumpDlg(it.dlgId);   // 读了就算完成
    }
  }));
};

/* 学知识：当前章讲解 + 课文精读（点句子看翻译、逐句🔊），学完直通练本章 */
ROUTES.study = function () {
  const ch = currentChapter();
  const rd = (window.READINGS || {})[ch.no];
  const done = taskState();
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="today">← 返回今日清单</button>
      <h2 class="page-title">学知识 · 第 ${ch.no}/${(window.SYLLABUS || []).length} 章</h2>
      <p class="muted">今天只学这一个点，学明白再做题。步骤：①看白话讲解和易错点 → ②精读课文（<b>点句子看翻译</b>，点 🔊 听发音，最好跟读）→ ③去练本章。</p>
      ${renderChapterCard(ch)}
      ${rd ? `
        <div class="kcard rt-card">
          <div class="kcard-title">📖 课文精读 · ${escapeHtml(rd.title)}</div>
          ${rd.tip ? `<p class="rt-tip">读前提示：${escapeHtml(rd.tip)}</p>` : ""}
          ${rd.sents.map((s, i) => `
            <div class="rt-sent" data-i="${i}">
              <div class="rt-en">${escapeHtml(s.en)} <button class="say-btn rt-say" data-i="${i}" title="听这句">🔊</button></div>
              <div class="rt-zh">${escapeHtml(s.zh)}</div>
            </div>`).join("")}
          <div class="row-center" style="margin-top:12px"><button id="rt-say-all" class="btn btn-ghost btn-sm">🔊 朗读全文</button></div>
        </div>` : ""}
      <button id="study-done" class="btn btn-primary btn-big">${done.study ? "已学完 ✓ 直接去练本章 →" : "学完了，去练本章 →"}</button>
    </div>`;
  $(".back-link").onclick = () => go("today");
  $$(".rt-sent").forEach((el) => (el.onclick = (e) => {
    if (e.target.classList.contains("rt-say")) return;
    el.classList.toggle("open");
  }));
  $$(".rt-say").forEach((b) => (b.onclick = () => speak(rd.sents[parseInt(b.dataset.i, 10)].en)));
  const sa = $("#rt-say-all");
  if (sa && rd) sa.onclick = () => speak(rd.sents.map((s) => s.en).join(" "));
  $("#study-done").onclick = () => { markTask("study"); startChapterQuiz(); };
};
ROUTES.daily = ROUTES.study;   // 旧入口兼容

/* 讲解卡 HTML */
function renderCardHTML(card) {
  return `
    <div class="kcard">
      <div class="kcard-title">${escapeHtml(card.title)}</div>
      <div class="kcard-rule">${escapeHtml(card.rule)}</div>
      <ul class="kcard-points">${card.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
      <div class="kcard-eg-title">例句：</div>
      ${card.examples.map((e) => `<div class="kcard-eg"><span class="eg-en">${escapeHtml(e.en)}</span><span class="eg-zh">${escapeHtml(e.zh)}</span></div>`).join("")}
    </div>`;
}

/* ========================================================================== */
/*                          页面：知识讲解卡                                    */
/* ========================================================================== */
ROUTES.knowledge = function () {
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">知识讲解卡</h2>
      <p class="muted">每个语法点先看这里，再去做题。看不懂就去练习页问 AI。</p>
      ${window.KNOWLEDGE_CARDS.map(renderCardHTML).join("")}
    </div>`;
  $(".back-link").onclick = () => go("dashboard");
};

/* ========================================================================== */
/*                          页面：学习大纲主线                                  */
/* ========================================================================== */
ROUTES.syllabus = function () {
  const list = window.SYLLABUS || [];
  const curIdx = currentChapterIndex();
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">大纲讲解</h2>
      <p class="muted">这是一本<b>随时翻的白话语法手册</b>：点开任何一章看讲解、例句和易错点（预习/复习/做题卡壳时来查都行）。做题在「今日学习」和「练习」里——主线会带你从当前章按顺序走，掌握了(通关率≥70%)自动往后。</p>
      <div class="syl-list">
        ${list.map((ch, i) => {
          const isCur = i === curIdx, passed = i < curIdx, locked = i > curIdx;
          const st = chapterStats(ch);
          const status = isCur ? "▶ 当前" : passed ? "✓ 已过" : "预习";
          const cls = isCur ? "syl-cur" : locked ? "syl-ahead" : "syl-done";
          const tag = { "懂": "理解", "背": "记忆", "背+懂": "背+懂", "技巧": "技巧" }[ch.learn] || ch.learn;
          const tagCls = ch.learn === "懂" ? "lt-understand" : ch.learn === "技巧" ? "lt-skill" : "lt-memorize";
          return `<button class="syl-item ${cls}" data-i="${i}">
              <div class="syl-no">${ch.no}</div>
              <div class="syl-body">
                <div class="syl-title">${escapeHtml(ch.title)} <span class="learn-tag ${tagCls}">${tag}</span></div>
                <div class="syl-meta">${st.attempted ? "通关率 " + st.rate + "% · 已练 " + st.attempted + "/" + st.total : (isCur ? "当前章 · 点开看讲解" : "点开可预习讲解")}</div>
              </div>
              <div class="syl-status">${status}</div>
            </button>`;
        }).join("")}
      </div>
      <div id="chapter-view"></div>
    </div>`;
  $(".back-link").onclick = () => go("dashboard");
  $$(".syl-item").forEach((b) => (b.onclick = () => openChapter(parseInt(b.dataset.i, 10))));
};
function openChapter(i) {
  const ch = window.SYLLABUS[i];
  const view = $("#chapter-view");
  view.innerHTML = renderChapterCard(ch);   // 纯讲解手册：做题走「今日学习」和「练习」
  view.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ========================================================================== */
/*                          页面：学习进度（各知识点通关率）                    */
/* ========================================================================== */
ROUTES.progress = function () {
  const gGroups = GRAMMAR_GROUPS.filter((g) => allQuestions().some((q) => g.topics.includes(q.topic)));
  const modGroups = [
    { name: "语音", pred: (q) => q.module === "phonetics" },
    { name: "完形填空", pred: (q) => q.module === "cloze" },
    { name: "阅读理解", pred: (q) => q.module === "reading" },
    { name: "补全对话", pred: (q) => q.module === "conversation" },
  ];
  const overall = statsFor(() => true);
  const row = (name, st) => {
    const started = st.attempted > 0;
    const cls = !started ? "pr-none" : st.rate >= 80 ? "pr-good" : st.rate >= 60 ? "pr-mid" : "pr-low";
    return `<div class="prog-row">
        <div class="pr-name">${escapeHtml(name)}</div>
        <div class="pr-track"><div class="pr-fill ${cls}" style="width:${started ? st.rate : 0}%"></div></div>
        <div class="pr-meta">${started ? st.rate + "%" : "未开始"} · ${st.attempted}/${st.total}</div>
      </div>`;
  };
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">学习进度</h2>
      <p class="muted">“通关率”= 第一次就做对、或者错过之后<b>又连对两次翻案</b>的比例——错题真学会了同样算数。<br>
        <span style="color:#2f7d5b">■</span> ≥80% 掌握 · <span style="color:#c8703c">■</span> 60–79% 还行 · <span style="color:#b1483e">■</span> &lt;60% 要补</p>
      <div class="kcard">
        <div class="kcard-title">总体</div>
        ${row("全部题目", overall)}
        <div class="muted" style="margin-top:8px">今日学习 ${studyMinToday()} 分钟 · 累计 ${studyMinTotal()} 分钟 · 连续打卡 ${STATE.progress.streak} 天</div>
      </div>
      <h3 class="sub-title">语法 / 词汇知识点</h3>
      <div class="prog-list">${gGroups.map((g) => row(g.name, statsFor((q) => g.topics.includes(q.topic)))).join("")}</div>
      <h3 class="sub-title">其它板块</h3>
      <div class="prog-list">${modGroups.map((m) => row(m.name, statsFor(m.pred))).join("")}</div>
    </div>`;
  $(".back-link").onclick = () => go("dashboard");
};

/* ========================================================================== */
/*                          页面：分模块练习                                    */
/* ========================================================================== */
/* -------- 练习裂变：AI 现场生成全新的题，和主线题库不重复 --------
   有 Key：优先用缓存里还没做过的裂变题，不够就现场生成一批（存起来续用，省钱）；
   没 Key：退回题库里做得最少的题，并提示填 Key 可解锁不重复新题。 */
function fissionUnseen(key) {
  const srs = STATE.progress.srs;
  return (STATE.aiQuestions || []).filter((q) => q.fissionKey === key && !(srs[q.id] && srs[q.id].seen > 0));
}
/* 裂变题攒多了清理：做过且没做错的老题可以扔，控制存档体积 */
function pruneFission() {
  const list = STATE.aiQuestions || [];
  if (list.length <= 400) return;
  const srs = STATE.progress.srs;
  STATE.aiQuestions = list.filter((q) => !q.fission || !(srs[q.id] && srs[q.id].seen > 0 && !srs[q.id].wrong));
}
async function startFission(key, opts) {
  // opts: { label, module, level, topicSlug, taskKey, fallback(), quizOpts(额外传给 startQuiz，如 checkIn/daily) }
  const extra = opts.quizOpts || {};
  const unseen = fissionUnseen(key);
  if (unseen.length >= 6) { startQuiz(shuffle(unseen).slice(0, 10), Object.assign({ title: opts.label + " · AI 新题", taskKey: opts.taskKey }, extra)); return; }
  if (!hasApiKey()) {
    const fb = orderForPractice(opts.fallback ? opts.fallback() : [], PRACTICE_BATCH);
    if (!fb.length) { alert("这个板块暂时没有题，填 API Key 后可让 AI 出新题。"); return; }
    toast("提示：填 API Key 后，练习会换成和主线不重复的 AI 新题");
    startQuiz(fb, Object.assign({ title: opts.label + " 练习", taskKey: opts.taskKey }, extra));
    return;
  }
  const prevRoute = CURRENT_ROUTE;
  contentEl.innerHTML = `
    <div class="page result-page">
      <div class="result-emoji">🤖</div>
      <h2 class="page-title">AI 正在出题…</h2>
      <p class="muted">正在给你出一批全新的「${escapeHtml(opts.label)}」题（10~20 秒）。<br>这些题和主线学习的题库完全不重复，做过的也不会再出。</p>
    </div>`;
  try {
    const fresh = await aiFission(key, opts);
    STATE.aiQuestions = (STATE.aiQuestions || []).concat(fresh);
    pruneFission(); saveState();
    startQuiz(shuffle(unseen.concat(fresh)).slice(0, 10), Object.assign({ title: opts.label + " · AI 新题", taskKey: opts.taskKey }, extra));
  } catch (e) {
    contentEl.innerHTML = `
      <div class="page result-page">
        <div class="result-emoji">😵</div>
        <h2 class="page-title">出题失败</h2>
        <p class="muted">${escapeHtml(e.message || "网络或接口出错")}</p>
        <div class="row-center">
          <button id="fis-retry" class="btn btn-primary">再试一次</button>
          <button id="fis-bank" class="btn btn-ghost">先用题库原题练</button>
          <button id="fis-back" class="btn btn-ghost">返回</button>
        </div>
      </div>`;
    $("#fis-retry").onclick = () => startFission(key, opts);
    $("#fis-bank").onclick = () => {
      const fb = orderForPractice(opts.fallback ? opts.fallback() : [], PRACTICE_BATCH);
      if (fb.length) startQuiz(fb, { title: opts.label + " 练习", taskKey: opts.taskKey }); else go(prevRoute);
    };
    $("#fis-back").onclick = () => go(prevRoute);
  }
}
/* 真正调 AI 生成：普通知识点出单题；阅读/完形出一篇短文带一组题 */
async function aiFission(key, opts) {
  const mod = opts.module || "grammar";
  const lvName = { 1: "入门（A1-A2，很基础）", 2: "进阶（A2-B1）", 3: "冲刺（B1，接近考试难度）" }[opts.level || 2];
  const sys = "你是成人高考专升本英语出题老师，面向基础薄弱的成人考生。只输出合法 JSON，不要 markdown 代码块，不要任何多余文字。解析用大白话中文。optionNotes 必须和 options 一一对应、顺序一致：有且只有一条以「对」开头，并且正好是 answer 指向的那个选项，其余都以「错」开头，千万别弄乱顺序。";
  let userMsg, maxTokens = 2600;
  if (mod === "reading") {
    const focus = opts.genHint ? `这 4 道题请重点考「${opts.genHint}」。` : "细节题为主 + 1 道主旨题。";
    userMsg = `写一篇 60~90 词、${lvName}难度的英文短文（日常生活/校园/工作场景），并围绕它出 4 道四选一阅读理解题。${focus}输出 JSON：{"passage":"短文","questions":[{"stem":"英文问题","options":["..","..","..",".."],"answer":0,"explanation":"大白话解析，指出原文依据","optionNotes":["对:...","错:...","错:...","错:..."]}]}`;
    maxTokens = 3000;
  } else if (mod === "cloze") {
    const focus = opts.genHint ? `设计空格时，请多考「${opts.genHint}」。` : "";
    userMsg = `写一段 60~80 词、${lvName}难度的英文短文，挖 5 个空，空用 (1)____ 到 (5)____ 标注。每空出四选一。${focus}输出 JSON：{"passage":"带5个空的短文","questions":[{"stem":"(1) 处应填：","options":["..","..","..",".."],"answer":0,"explanation":"大白话解析","optionNotes":["对:...","错:...","错:...","错:..."]}]}（questions 恰好 5 个，顺序对应 5 个空）`;
    maxTokens = 3000;
  } else {
    const what = opts.genHint || `围绕「${opts.label}」`;
    const avoid = (opts.sampleStems || []).slice(0, 3).map((s) => "- " + s).join("\n");
    userMsg = `${what}，出 8 道成人高考风格的四选一选择题，难度：${lvName}。要求：每道题考点明确、干扰项常见易错、answer 是正确选项下标(0-3)、optionNotes 长度必须等于 4。${avoid ? "\n以下是已有的题干，不要出雷同的：\n" + avoid : ""}\n输出 JSON 数组：[{"stem":"带____的题干","options":["A","B","C","D"],"answer":0,"explanation":"大白话解析","optionNotes":["对:...","错:...","错:...","错:..."]}]`;
  }
  const raw = await callClaude({ system: sys, messages: [{ role: "user", content: userMsg }], maxTokens });
  const json = raw.trim().replace(/^```json?/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(json);
  const stamp = Date.now();
  let arr;
  if (mod === "reading" || mod === "cloze") {
    arr = (parsed.questions || []).map((q) => Object.assign(q, { passage: parsed.passage, passageId: "fx-" + stamp }));
  } else {
    arr = Array.isArray(parsed) ? parsed : (parsed.questions || []);
  }
  arr.forEach((q, i) => {
    q.id = "fx-" + stamp + "-" + i;
    q.fission = true; q.fissionKey = key;
    q.module = mod; q.type = "choice";
    q.topic = opts.topicSlug || opts.label;
    q.level = opts.level || 2;
  });
  arr = arr.filter(validGenQ);   // 丢掉"选项/答案/逐项解析对不上"的坏题
  if (!arr.length) throw new Error("AI 出的题没通过一致性校验，请再试一次");
  return arr;
}

ROUTES.practice = function () {
  const counts = {};
  bankQuestions().forEach((q) => (counts[q.module] = (counts[q.module] || 0) + 1));
  const keyed = hasApiKey();
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">练习</h2>
      <p class="muted">${keyed
        ? "这里的题<b>和主线学习不重复</b>：AI 会现场给你出全新的题，做过的不再出。主线负责学新知识，这里负责用新题巩固。"
        : "这里目前用题库原题（做得最少的优先）。<b>填 API Key 后</b>，练习会换成 AI 现场生成、和主线完全不重复的新题。"}</p>
      <h3 class="sub-title">按难度练习</h3>
      <div class="level-row">
        ${[1, 2, 3].map((lv) => `<button class="level-card lv${lv}" data-level="${lv}">
            <div class="lc-name">${LEVEL_NAMES[lv]}</div>
            <div class="lc-count">${keyed ? "AI 新题" : (bankQuestions().filter((q) => effLevel(q) === lv).length + " 题")}</div>
          </button>`).join("")}
      </div>
      <h3 class="sub-title">按模块练习</h3>
      <div class="module-grid">
        ${Object.keys(MODULE_NAMES).map((m) => `
          <button class="module-card" data-module="${m}">
            <div class="mc-name">${MODULE_NAMES[m]}</div>
            <div class="mc-count">${keyed ? "AI 新题" : (counts[m] || 0) + " 题"}</div>
          </button>`).join("")}
      </div>

      <h3 class="sub-title">按语法点练习</h3>
      <p class="muted">学完哪个语法点，就来这里只刷这一点。</p>
      <div class="topic-grid">
        ${GRAMMAR_GROUPS.map((g, gi) => {
          const c = bankQuestions().filter((q) => g.topics.includes(q.topic)).length;
          const usable = c > 0 || keyed;
          return `<button class="topic-chip${usable ? "" : " empty"}" data-gi="${gi}" ${usable ? "" : "disabled"}>
            ${escapeHtml(g.name)}<span class="tc-c">${keyed ? "∞" : c}</span></button>`;
        }).join("")}
      </div>

      <div class="ai-gen-box">
        <div class="kcard-title">🤖 AI 按需出题</div>
        <p class="muted">想练上面没有的点（某个词、某个搭配），在这里输入，AI 现场出 5 道。</p>
        <div class="row">
          <input id="gen-topic" class="input" placeholder="输入知识点，如：虚拟语气 / 定语从句 / yield to" />
          <button id="gen-btn" class="btn btn-primary">再来 5 道</button>
        </div>
        <div id="gen-result"></div>
      </div>
    </div>`;
  $(".back-link").onclick = () => go("dashboard");
  $$(".level-card").forEach((b) => (b.onclick = () => {
    const lv = parseInt(b.dataset.level, 10);
    startFission("lv" + lv, {
      label: LEVEL_NAMES[lv] + "综合", level: lv, module: "grammar",
      genHint: "混合语法、词汇、固定搭配、情景对话各类考点",
      fallback: () => bankQuestions().filter((q) => effLevel(q) === lv),
    });
  }));
  $$(".module-card").forEach((b) => (b.onclick = () => {
    const m = b.dataset.module;
    startFission("mod-" + m, {
      label: MODULE_NAMES[m], module: m,
      genHint: m === "phonetics" ? "出「找出划线部分读音不同的词」型语音题（题干说明划线字母，选项为4个单词）"
        : m === "conversation" ? "出补全对话题（给出对话上下文，选最合适的应答）"
        : m === "collocation" ? "围绕高频固定搭配（动词短语/介词搭配）" : "围绕常考语法点",
      fallback: () => bankQuestions().filter((q) => q.module === m),
    });
  }));
  $$(".topic-chip:not(.empty)").forEach((b) => (b.onclick = () => {
    const g = GRAMMAR_GROUPS[parseInt(b.dataset.gi, 10)];
    const bank = bankQuestions().filter((q) => g.topics.includes(q.topic));
    startFission("g-" + g.name, {
      label: g.name, module: "grammar", topicSlug: g.topics[0],
      sampleStems: bank.slice(0, 3).map((q) => q.stem || ""),
      fallback: () => bank,
    });
  }));
  $("#gen-btn").onclick = aiGenerateQuestions;
};

/* ========================================================================== */
/*                    页面：阅读 / 完形「技巧闯关」                              */
/*   卷面 90 分的技能盘，拆成一个个做题套路来练。对标政治考点闯关。                  */
/* ========================================================================== */
const READ_PASS_ACC = 70;   // 单次练习正确率 ≥70% 即算这一技巧过关（阅读比语法难，门槛设 70）

function readSkillState(id) {
  const m = STATE.readingSkills || (STATE.readingSkills = {});
  if (!m[id]) m[id] = { practiced: 0, best: 0, passed: false };
  return m[id];
}
ROUTES.reading = function () {
  const skills = window.READING_SKILLS || [];
  const passed = skills.filter((s) => readSkillState(s.id).passed).length;
  const groupHtml = (grp, title, sub) => {
    const list = skills.filter((s) => s.group === grp);
    return `
      <h3 class="sub-title">${title} <span class="muted" style="font-weight:400;font-size:13px">${sub}</span></h3>
      <div class="rs-list">
        ${list.map((s) => {
          const st = readSkillState(s.id);
          const badge = st.passed ? `<span class="rs-badge pass">✓ 已过关</span>`
            : st.practiced ? `<span class="rs-badge">练过 ${st.practiced} 次 · 最好 ${st.best}%</span>`
            : `<span class="rs-badge new">未练</span>`;
          return `
          <div class="rs-card" data-id="${s.id}">
            <div class="rs-head">
              <div class="rs-title"><span class="rs-emoji">${s.emoji}</span>${escapeHtml(s.name)}</div>
              ${badge}
            </div>
            <div class="rs-why">${escapeHtml(s.why)}</div>
            <details class="rs-detail">
              <summary>看讲解 · 怎么做</summary>
              <div class="rs-detail-body">
                <div class="rs-plain">${escapeHtml(s.plain)}</div>
                <div class="rs-steps-title">套路步骤：</div>
                <ol class="rs-steps">${s.steps.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ol>
                <div class="rs-eg">
                  <div class="rs-eg-tag">📄 走一遍例子</div>
                  <div class="rs-eg-passage">${escapeHtml(s.example.passage)}</div>
                  <div class="rs-eg-q">${escapeHtml(s.example.q)}</div>
                  <ol class="rs-eg-opts">${s.example.options.map((o, i) => `<li class="${i === s.example.answer ? "ans" : ""}">${escapeHtml(o)}${i === s.example.answer ? " ✓" : ""}</li>`).join("")}</ol>
                  <div class="rs-eg-walk">💡 ${escapeHtml(s.example.walk)}</div>
                </div>
              </div>
            </details>
            <button class="btn btn-primary btn-sm rs-practice" data-id="${s.id}">🎯 练这个技巧（5~8 题）</button>
          </div>`;
        }).join("")}
      </div>`;
  };
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">阅读 / 完形 · 技巧闯关</h2>
      <p class="muted">阅读 60 + 完形 30 = <b>90 分</b>的技能盘。读不流利也没关系——这里把它拆成一个个<b>做题套路</b>，一个个练到过关。先看讲解，再练针对性新题。</p>
      <div class="rs-progress">🏁 技巧过关进度：<b>${passed}/${skills.length}</b>${passed === skills.length && skills.length ? " · 全部过关，去模拟考实战！" : ""}</div>
      ${groupHtml("reading", "📖 阅读技巧", "按高频/易度排序，从上往下练")}
      ${groupHtml("cloze", "🧩 完形技巧", "")}
    </div>`;
  $(".back-link").onclick = () => go("dashboard");
  $$(".rs-practice").forEach((b) => (b.onclick = () => practiceReadingSkill(b.dataset.id)));
};

function practiceReadingSkill(id) {
  const s = (window.READING_SKILLS || []).find((x) => x.id === id);
  if (!s) return;
  startFission("rs-" + id, {
    label: s.name, module: s.group, level: 2, topicSlug: s.group,
    genHint: s.genHint,
    fallback: () => bankQuestions().filter((q) => q.module === s.group &&
      (!s.bankKw || new RegExp(s.bankKw).test(q.explanation || "") || s.group === "cloze")),
    quizOpts: {
      onFinish: (acc) => {
        const st = readSkillState(id);
        st.practiced += 1;
        if (acc > st.best) st.best = acc;
        if (acc >= READ_PASS_ACC) st.passed = true;
        saveState();
      },
    },
  });
}

/* ========================================================================== */
/*                          答题引擎（一题一屏）                                */
/* ========================================================================== */
let QUIZ = null;

function startQuiz(list, opts = {}) {
  if (!list || !list.length) { alert("这个板块暂时没有题。"); return; }
  RETURN_HUB = CURRENT_ROUTE;   // 记住从哪来的，退出后回这里
  QUIZ = { list, i: 0, correct: 0, opts, results: [] };
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = QUIZ.list[QUIZ.i];
  QUIZ.lastTick = Date.now();   // 开始计这道题的用时
  const n = QUIZ.list.length;
  const progress = Math.round((QUIZ.i / n) * 100);

  contentEl.innerHTML = `
    <div class="page quiz-page">
      <div class="quiz-top">
        <button class="back-link" id="quiz-quit">← 退出</button>
        <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${progress}%"></div></div>
        <div class="quiz-count">${QUIZ.i + 1}/${n}</div>
      </div>
      <div class="q-tag">${MODULE_NAMES[q.module] || q.module} · ${escapeHtml(q.topic || "")}${qTypeTag(q)}<span class="q-level lv${effLevel(q)}">${LEVEL_NAMES[effLevel(q)]}</span>${q.real ? `<span class="q-real" title="${escapeHtml(q.source || "历年真题")}">🎯 真题</span>` : ""}</div>
      ${q.real && q.source ? `<div class="q-source">${escapeHtml(q.source)}</div>` : ""}
      ${chapterOfTopic(q.topic) ? `<button id="show-concept" class="btn btn-ghost btn-sm concept-btn">📖 看这题的知识点讲解</button><div id="concept-box"></div>` : ""}
      ${q.passage ? `<div class="q-passage">${escapeHtml(q.passage)}</div>
        <div class="passage-tools"><button id="tr-passage" class="btn btn-ghost btn-sm">🔤 中英对照翻译</button><button id="say-passage" class="btn btn-ghost btn-sm">🔊 朗读</button></div>
        <div id="tr-box"></div>` : ""}
      ${isTyped(q)
        ? `${q.prompt ? `<div class="q-prompt">✍️ ${escapeHtml(q.prompt)}</div>` : ""}
           ${q.type === "rewrite"
             ? `<div class="q-rewrite-src">${escapeHtml(q.stem)}</div>`
             : `<div class="q-stem">${escapeHtml(q.stem)}</div>`}
           <div class="typed-area">
             ${q.type === "rewrite"
               ? `<textarea id="typed-input" class="textarea" rows="2" placeholder="输入改写后的完整句子…"></textarea>`
               : `<input id="typed-input" class="input" placeholder="输入答案…" autocomplete="off" autocapitalize="off" />`}
             <button id="typed-submit" class="btn btn-primary">提交</button>
           </div>`
        : `<div class="q-stem">${escapeHtml(q.stem)}</div>
           <div class="q-options">
             ${q.options.map((opt, idx) => `
               <button class="opt" data-idx="${idx}">
                 <span class="opt-letter">${LETTERS[idx]}</span>
                 <span class="opt-text">${fmtOption(opt)}</span>
               </button>`).join("")}
           </div>`}
      <div id="q-feedback"></div>
    </div>`;

  $("#quiz-quit").onclick = () => { if (confirm("退出本次练习？进度已保存。")) go(RETURN_HUB); };
  const cbtn = $("#show-concept");
  if (cbtn) {
    const chap = chapterOfTopic(q.topic); let shown = false;
    cbtn.onclick = () => { shown = !shown; $("#concept-box").innerHTML = shown ? renderChapterCard(chap) : ""; cbtn.textContent = shown ? "收起讲解 ▲" : "📖 看这题的知识点讲解"; };
  }
  if (q.passage) {
    $("#tr-passage").onclick = () => translatePassage(q.passage);
    $("#say-passage").onclick = () => speak(q.passage);
  }
  if (isTyped(q)) {
    const inp = $("#typed-input");
    const submit = () => { const v = inp.value.trim(); if (!v) return; onTypedAnswer(v); };
    $("#typed-submit").onclick = submit;
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (q.type === "fill" || !e.shiftKey)) { e.preventDefault(); submit(); }
    });
    inp.focus();
  } else {
    $$(".opt").forEach((b) => (b.onclick = () => onAnswer(parseInt(b.dataset.idx, 10))));
  }
}

/* 输入题（填空/改写）相关 */
function isTyped(q) { return q.type === "fill" || q.type === "rewrite"; }
function qTypeTag(q) { return q.type === "fill" ? " · 填空" : q.type === "rewrite" ? " · 改写" : ""; }

/* 答案归一化：忽略大小写、首尾空格、多余空格、末尾标点、中英引号差异 */
function normAns(s) {
  return String(s).toLowerCase().trim()
    .replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/[.?!,。！？，]+$/g, "")
    .trim();
}

function onTypedAnswer(text) {
  quizTick();
  const q = QUIZ.list[QUIZ.i];
  const inp = $("#typed-input"); if (inp) inp.disabled = true;
  const sb = $("#typed-submit"); if (sb) sb.disabled = true;
  const matched = (q.answers || []).some((a) => normAns(a) === normAns(text));
  if (matched) return finalizeTyped(q, true, text);
  showTypedUnsure(q, text);   // 不完全一样 → 自评 / AI 判分
}

function finalizeTyped(q, correct, userText) {
  QUIZ.results.push({ id: q.id, correct });
  if (correct) QUIZ.correct++;
  recordAnswer(q.id, correct);
  renderTypedFeedback(q, correct, userText);
}

function typedRefs(q) { return (q.answers || []).join("　/　"); }

function renderTypedFeedback(q, correct, userText) {
  const fb = $("#q-feedback");
  fb.innerHTML = `
    <div class="feedback ${correct ? "ok" : "no"}">
      <div class="fb-head">${correct ? "✅ 对了" : "❌ 这题没对，记牢参考答案"}</div>
      <div class="fb-note"><b>你写的：</b>${escapeHtml(userText)}</div>
      <div class="fb-note note-right"><b>参考答案：</b>${escapeHtml(typedRefs(q))}</div>
      <div class="fb-explain"><strong>解析：</strong>${escapeHtml(q.explanation || "")}</div>
      <div class="tutor" id="tutor"></div>
      <button id="next-q" class="btn btn-primary btn-big">${QUIZ.i + 1 < QUIZ.list.length ? "下一题 →" : "完成 ✓"}</button>
    </div>`;
  attachTutor($("#tutor"), q);
  $("#next-q").onclick = () => { QUIZ.i++; if (QUIZ.i < QUIZ.list.length) renderQuizQuestion(); else finishQuiz(); };
  fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showTypedUnsure(q, userText) {
  const fb = $("#q-feedback");
  fb.innerHTML = `
    <div class="feedback no">
      <div class="fb-head">跟参考答案不完全一样，对一下：</div>
      <div class="fb-note"><b>你写的：</b>${escapeHtml(userText)}</div>
      <div class="fb-note note-right"><b>参考答案：</b>${escapeHtml(typedRefs(q))}</div>
      <div class="fb-explain"><strong>解析：</strong>${escapeHtml(q.explanation || "")}</div>
      <p class="muted">意思和语法都对、只是说法不同，也算对：</p>
      <div class="row-center">
        <button id="self-right" class="btn btn-ghost">✅ 我其实写对了</button>
        <button id="self-wrong" class="btn btn-ghost">❌ 确实错了</button>
        ${hasApiKey() ? `<button id="ai-judge" class="btn btn-primary">🤖 让 AI 判分</button>` : ""}
      </div>
      <div id="ai-judge-box"></div>
    </div>`;
  $("#self-right").onclick = () => finalizeTyped(q, true, userText);
  $("#self-wrong").onclick = () => finalizeTyped(q, false, userText);
  const aj = $("#ai-judge"); if (aj) aj.onclick = () => aiJudgeTyped(q, userText);
}

async function aiJudgeTyped(q, userText) {
  const box = $("#ai-judge-box");
  box.innerHTML = '<div class="muted">AI 判分中…</div>';
  try {
    const out = await callClaude({
      system: "你是英语老师。判断学生答案在语法和意思上是否正确完成了题目要求（说法不同但正确也算对）。只回复 JSON：{\"correct\":true或false,\"note\":\"一句中文说明\"}，不要其它内容。",
      messages: [{ role: "user", content:
        `题目要求：${q.prompt || ""}\n原题/填空：${q.stem}\n参考答案：${(q.answers || []).join(" / ")}\n学生的答案：${userText}\n对吗？` }],
      maxTokens: 200,
    });
    let j; try { j = JSON.parse(out.replace(/^```json?/i, "").replace(/```$/, "").trim()); }
    catch (_) { j = { correct: false, note: out }; }
    box.innerHTML = `<div class="${j.correct ? "ok-text" : "err"}">${j.correct ? "✅" : "❌"} ${escapeHtml(j.note || "")}</div>`;
    setTimeout(() => finalizeTyped(q, !!j.correct, userText), 700);
  } catch (e) {
    box.innerHTML = '<div class="err">' + escapeHtml(e.message) + " 先自己判一下吧。</div>";
  }
}

function onAnswer(idx) {
  quizTick();   // 结算本题用时
  const q = QUIZ.list[QUIZ.i];
  const correct = idx === q.answer;
  if (correct) QUIZ.correct++;
  QUIZ.results.push({ id: q.id, correct });
  recordAnswer(q.id, correct);

  $$(".opt").forEach((b) => {
    const i = parseInt(b.dataset.idx, 10);
    b.disabled = true;
    if (i === q.answer) b.classList.add("opt-correct");
    if (i === idx && !correct) b.classList.add("opt-wrong");
  });

  const fb = $("#q-feedback");
  fb.innerHTML = `
    <div class="feedback ${correct ? "ok" : "no"}">
      <div class="fb-head">${correct ? "✅ 答对了" : "❌ 答错了"} · 正确答案：${LETTERS[q.answer]}</div>
      <div class="fb-explain"><strong>解析：</strong>${escapeHtml(q.explanation)}</div>
      <div class="fb-notes">
        ${q.optionNotes.map((note, i) => `
          <div class="fb-note ${i === q.answer ? "note-right" : ""}">
            <span class="note-letter">${LETTERS[i]}</span> ${escapeHtml(note)}
          </div>`).join("")}
      </div>
      <div class="tutor" id="tutor"></div>
      <div class="fb-actions">
        <button id="vary-q" class="btn btn-ghost">🔁 换个说法再考我一道</button>
        <button id="next-q" class="btn btn-primary">${QUIZ.i + 1 < QUIZ.list.length ? "下一题 →" : "完成 ✓"}</button>
      </div>
    </div>`;

  attachTutor($("#tutor"), q);
  $("#next-q").onclick = () => {
    QUIZ.i++;
    if (QUIZ.i < QUIZ.list.length) renderQuizQuestion();
    else finishQuiz();
  };
  $("#vary-q").onclick = () => aiVariation(q);
  $("#q-feedback").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* 换个说法再考一道同考点变体题（AI 生成，插到当前队列后面）——防止只记住这道题 */
async function aiVariation(q) {
  if (!hasApiKey()) { alert("这个功能要用 AI 出题，请先到【设置】填 API Key。"); return; }
  const btn = $("#vary-q");
  btn.disabled = true; btn.textContent = "AI 出题中…";
  const schema = '{"stem":"带 ____ 的题干","options":["A","B","C","D"],"answer":0,"explanation":"大白话中文解析","optionNotes":["对/错:...","...","...","..."]}';
  try {
    const raw = await callClaude({
      system: "你是英语出题老师。只输出一个合法 JSON 对象，不要任何多余文字，不要 markdown 代码块。",
      messages: [{ role: "user", content:
        `模仿下面这道题，出一道【考同一个知识点、但换个说法/换个词/换个情景】的新选择题。难度相同，适合 A2 水平，解析用简单中文。\n原题：${q.stem}\n选项：${q.options.join(" / ")}\n正确答案：${LETTERS[q.answer]}\n知识点：${q.topic}\n严格按此结构输出 JSON（optionNotes 必须 4 条、和 answer 对应）：${schema}` }],
      maxTokens: 800,
    });
    const j = JSON.parse(raw.trim().replace(/^```json?/i, "").replace(/```$/, "").trim());
    j.id = "var-" + Date.now(); j.module = q.module; j.topic = q.topic; j.level = q.level;
    if (!validGenQ(j)) throw new Error("这道生成的题不合格（选项和解析对不上）");
    QUIZ.list.splice(QUIZ.i + 1, 0, j);   // 插到下一题
    QUIZ.i++;
    renderQuizQuestion();
  } catch (e) {
    btn.disabled = false; btn.textContent = "🔁 换个说法再考我一道";
    alert("出题失败：" + e.message + "，再点一次试试。");
  }
}

/* 阅读/完形短文「看中文翻译」（AI 翻译，翻一次后缓存，可再点收起） */
async function translatePassage(text) {
  const box = $("#tr-box"), btn = $("#tr-passage");
  if (!box) return;
  if (box.dataset.done) { box.classList.toggle("hidden"); return; }  // 已翻过 → 收起/展开
  if (!hasApiKey()) { box.innerHTML = '<div class="err">看翻译需要先在【设置】填 API Key。</div>'; return; }
  btn.disabled = true; box.innerHTML = '<div class="muted">翻译中…</div>';
  try {
    const t = await callClaude({
      system: "你是翻译。把英文逐句翻译成简体中文，做成中英对照：每个英文句子单独一行，格式严格为『英文原句 ||| 中文翻译』（用三个竖线分隔）。一句一行，不要加序号、不要说别的话。",
      messages: [{ role: "user", content: text }], maxTokens: 1200,
    });
    const pairs = t.split(/\n+/).map((l) => l.split("|||")).filter((p) => p.length >= 2 && p[0].trim());
    if (pairs.length) {
      box.innerHTML = `<div class="tr-align">${pairs.map((p) =>
        `<div class="tr-pair"><div class="tp-en">${escapeHtml(p[0].trim())}</div><div class="tp-zh">${escapeHtml(p.slice(1).join("|||").trim())}</div></div>`).join("")}</div>`;
    } else {
      box.innerHTML = `<div class="tr-cn">${mdLite(t)}</div>`;   // 万一没按格式来，兜底整段显示
    }
    box.dataset.done = "1";
  } catch (e) { box.innerHTML = '<div class="err">' + escapeHtml(e.message) + "</div>"; }
  btn.disabled = false;
}

/* 每道题下方的 AI 私教（讲到懂 + 追问） */
function attachTutor(box, q) {
  box.innerHTML = `
    <button id="tutor-start" class="btn btn-ghost">🤔 没懂？让 AI 再讲一遍</button>
    <div id="tutor-chat" class="tutor-chat hidden"></div>`;
  const chat = $("#tutor-chat", box);
  const history = []; // 传给 API 的对话历史
  const system = "你是一位非常耐心的英语私教，学生只有 A2/新概念1 水平。请务必用简单中文、短句子、多打生活化比方来讲。绝不用复杂术语。";

  function bubble(role, html) {
    const div = document.createElement("div");
    div.className = "bubble " + (role === "user" ? "bubble-user" : "bubble-ai");
    div.innerHTML = html;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
  }

  async function send(userText, displayUser) {
    if (displayUser) bubble("user", escapeHtml(userText));
    history.push({ role: "user", content: userText });
    const thinking = bubble("ai", '<span class="muted">正在思考…</span>');
    try {
      const reply = await callClaude({ system, messages: history, maxTokens: 900 });
      history.push({ role: "assistant", content: reply });
      thinking.innerHTML = mdLite(reply);
    } catch (e) {
      thinking.innerHTML = '<span class="err">' + escapeHtml(e.message) + "</span>";
      history.pop(); // 失败的这条 user 不留在历史里
    }
  }

  $("#tutor-start", box).onclick = function () {
    this.classList.add("hidden");
    chat.classList.remove("hidden");
    const prompt = isTyped(q)
      ? `请就下面这道英语${q.type === "fill" ? "填空" : "改写"}题，帮我彻底讲懂：
要求：${q.prompt || ""}
原题：${q.stem}
参考答案：${(q.answers || []).join(" / ")}

请按这个顺序讲：
① 用大白话说这题在考什么；
② 讲清楚为什么这样${q.type === "fill" ? "填" : "改"}（一步步）；
③ 给背后 1 条规则；
④ 给 1 个最简单的新例句（带中文）；
⑤ 结尾问我"这样清楚吗？还有哪里想不通？"`
      : `请就下面这道英语选择题，帮我彻底讲懂：
题目：${q.stem}
选项：${q.options.map((o, i) => LETTERS[i] + ". " + o).join("  ")}
正确答案：${LETTERS[q.answer]}

请按这个顺序讲：
① 用大白话说这题在考什么；
② 逐一分析 4 个选项（对的为什么对，错的各错在哪）；
③ 给背后 1 条规则；
④ 给 1 个最简单的新例句（带中文）；
⑤ 结尾问我"这样清楚吗？还有哪里想不通？"`;
    send(prompt, false);
    // 追问输入框
    const ask = document.createElement("div");
    ask.className = "tutor-ask";
    ask.innerHTML = `<input class="input" id="tutor-input" placeholder="继续追问，如：should 什么时候能省略？" />
                     <button class="btn btn-primary" id="tutor-send">问</button>`;
    box.appendChild(ask);
    const input = $("#tutor-input", box);
    const doAsk = () => {
      const t = input.value.trim();
      if (!t) return;
      input.value = "";
      send(t, true);
    };
    $("#tutor-send", box).onclick = doAsk;
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") doAsk(); });
  };
}

/* topic 标签 → 友好中文名（用于小结/进度显示） */
function topicDisplayName(topic) {
  const g = GRAMMAR_GROUPS.find((x) => x.topics.includes(topic));
  return g ? g.name : (topic || "综合");
}

function finishQuiz() {
  clearExamTimer();
  quizTick();          // 结算最后一题用时
  saveState();         // 落盘学习时间
  if (QUIZ.opts.placement) return finishPlacement();
  const n = QUIZ.list.length;
  const acc = Math.round((QUIZ.correct / n) * 100);
  const isDaily = !!QUIZ.opts.daily;
  const inFlow = !!(QUIZ.opts.flow && FLOW && FLOW.i < FLOW.steps.length);   // 在一条龙里 → 结算页直接给"下一步"
  if (isDaily) markTask("learn");
  if (QUIZ.opts.taskKey) markTask(QUIZ.opts.taskKey);   // 精读/弱点专练 → 自动打勾
  let checkedIn = false;
  if (QUIZ.opts.checkIn) checkedIn = checkInIfNeeded();
  if (QUIZ.opts.recordScore) {
    STATE.weeklyScores.push({ date: todayStr(), score: QUIZ.correct, total: n,
      note: QUIZ.opts.title, scaled: Math.round(QUIZ.correct / n * 150) });
    saveState();
  }
  const wrongList = QUIZ.results.filter((r) => !r.correct).map((r) => questionById(r.id)).filter(Boolean);

  // 今日小结：练了哪些知识点
  const topicSet = {};
  QUIZ.results.forEach((r) => { const q = questionById(r.id); if (q) { const nm = topicDisplayName(q.topic); topicSet[nm] = (topicSet[nm] || 0) + 1; } });
  const topicsStr = Object.keys(topicSet).slice(0, 6).join("、");

  contentEl.innerHTML = `
    <div class="page result-page">
      <div class="result-emoji">${acc >= 80 ? "🎉" : acc >= 60 ? "💪" : "📖"}</div>
      <h2 class="page-title">${QUIZ.opts.title || "练习"}完成</h2>
      <div class="result-score">${QUIZ.correct} / ${n} 题正确 · ${acc}%</div>
      ${QUIZ.opts.recordScore ? `<div class="muted">折算约 ${Math.round(QUIZ.correct / n * 150)} / 150 分</div>` : ""}
      ${checkedIn ? `<div class="checkin-badge">🔥 打卡成功！连续 ${STATE.progress.streak} 天</div>` : ""}
      ${isDaily ? `
        <div class="kcard" style="text-align:left">
          <div class="kcard-title">📋 今日小结</div>
          <div>· 练到的知识点：${escapeHtml(topicsStr || "综合")}</div>
          <div>· 今天已学习 <b>${studyMinToday()}</b> 分钟</div>
          <div>· 做错 ${wrongList.length} 道，已进错题本，明天会自动帮你复习</div>
          <div id="ai-summary-box" style="margin-top:8px"></div>
          <button id="ai-summary" class="btn btn-ghost btn-sm">🤖 让 AI 点评今天</button>
        </div>` : ""}
      ${wrongList.length ? `
        <div class="result-wrong">
          <div class="rw-title">这次做错的 ${wrongList.length} 道（已进错题本）：</div>
          ${wrongList.map((q) => `<div class="rw-item">· ${escapeHtml((q.stem || "").slice(0, 40))}…</div>`).join("")}
        </div>` : `<div class="checkin-badge">全对，太棒了！</div>`}
      <div class="row-center">
        ${inFlow ? `<button id="flow-go" class="btn btn-primary btn-big">${FLOW.i + 1 >= FLOW.steps.length ? "完成今天 →" : "继续下一步：" + escapeHtml(FLOW.steps[FLOW.i + 1].title) + " →"}</button>` : ""}
        ${!inFlow && isDaily ? `<button id="again" class="btn btn-primary">再来一组</button>` : ""}
        ${wrongList.length ? `<button id="redo-wrong" class="btn btn-ghost">只重做这次错题</button>` : ""}
        ${inFlow ? `<button id="flow-stop" class="btn btn-ghost">暂停退出</button>`
                 : `<button id="back-home" class="btn btn-ghost">返回${hubName(RETURN_HUB)}</button>`}
      </div>
    </div>`;
  if (inFlow) {
    $("#flow-go").onclick = flowNext;              // 一条龙：做完自动接下一步，不用回清单再点
    $("#flow-stop").onclick = flowQuit;
  } else {
    $("#back-home").onclick = () => go(RETURN_HUB);
  }
  if (wrongList.length) $("#redo-wrong").onclick = () => startQuiz(shuffle(wrongList), { title: "错题重做" });
  if (isDaily) {
    if (!inFlow) $("#again").onclick = () => startChapterQuiz();   // 一条龙里没有"再来一组"按钮，别绑 null
    $("#ai-summary").onclick = aiDailySummary;
  }
  if (typeof QUIZ.opts.onFinish === "function") { try { QUIZ.opts.onFinish(acc, QUIZ.correct, n); } catch (_) {} }
}

async function aiDailySummary() {
  const box = $("#ai-summary-box"), btn = $("#ai-summary");
  if (!hasApiKey()) { box.innerHTML = '<span class="err">填了 API Key 才能用 AI 点评。</span>'; return; }
  btn.disabled = true; box.innerHTML = '<span class="muted">AI 点评中…</span>';
  const wrongTopics = {};
  QUIZ.results.filter((r) => !r.correct).forEach((r) => { const q = questionById(r.id); if (q) { const nm = topicDisplayName(q.topic); wrongTopics[nm] = (wrongTopics[nm] || 0) + 1; } });
  const ws = Object.keys(wrongTopics).map((k) => k + wrongTopics[k] + "道").join("，") || "没有明显错的";
  try {
    const t = await callClaude({
      system: "你是英语私教。用两三句简单中文点评学生今天的练习：先鼓励，再指出今天最该回去复习的一个点。别啰嗦。",
      messages: [{ role: "user", content: `今天做了${QUIZ.list.length}题，对${QUIZ.correct}题，学习${studyMinToday()}分钟。错得多的知识点：${ws}。给我一句鼓励 + 一个明天该重点复习的点。` }],
      maxTokens: 250,
    });
    box.innerHTML = mdLite(t);
  } catch (e) { box.innerHTML = '<span class="err">' + escapeHtml(e.message) + "</span>"; }
  btn.disabled = false;
}

/* ========================================================================== */
/*                          页面：错题本 + AI 诊断                              */
/* ========================================================================== */
ROUTES.wrongbook = function () {
  const wrong = getWrongQuestions();
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">错题本</h2>
      <p class="muted">共 ${wrong.length} 道错题。建议反复刷，直到全部答对 2 次。</p>
      <div class="row-center">
        ${wrong.length ? `<button id="drill-wrong" class="btn btn-primary">只刷错题</button>` : ""}
        ${wrong.length ? `<button id="diagnose" class="btn btn-ghost">🩺 生成 AI 诊断报告</button>` : ""}
      </div>
      <div id="diag-box"></div>
      <div class="wrong-list">
        ${wrong.length ? wrong.map((q) => `
          <div class="wrong-item">
            <div class="wi-tag">${MODULE_NAMES[q.module]} · ${escapeHtml(q.topic || "")} · 错 ${STATE.progress.srs[q.id].wrong} 次</div>
            <div class="wi-stem">${escapeHtml(q.stem)}</div>
            <div class="wi-ans">正确答案：${LETTERS[q.answer]}. ${escapeHtml(q.options[q.answer])}</div>
          </div>`).join("") : '<div class="empty">还没有错题，继续加油！</div>'}
      </div>
    </div>`;
  $(".back-link").onclick = () => go("dashboard");
  if (wrong.length) {
    $("#drill-wrong").onclick = () => startQuiz(shuffle(wrong), { title: "错题特训" });
    $("#diagnose").onclick = runDiagnosis;
  }
};

async function runDiagnosis() {
  const box = $("#diag-box");
  if (!hasApiKey()) { box.innerHTML = '<div class="err">还没填 API Key，请到设置里填写。</div>'; return; }
  const wrong = getWrongQuestions();
  box.innerHTML = '<div class="kcard"><span class="muted">AI 正在分析你的错题模式…</span></div>';
  const lines = wrong.slice(0, 30).map((q) =>
    `[${q.topic}] ${q.stem}｜正确:${LETTERS[q.answer]}.${q.options[q.answer]}`).join("\n");
  try {
    const text = await callClaude({
      strong: true,
      system: "你是成人高考英语私教。学生 A2 水平。请用简单中文，根据错题找出他反复出错的知识点规律，写一段个性化小课，最后给出接下来该重点练什么（3 条以内）。语气鼓励。",
      messages: [{ role: "user", content: `这是我的错题清单（知识点+题干+正确答案）：\n${lines}\n\n请分析我最该补的薄弱点，并给出练习建议。` }],
      maxTokens: 1200,
    });
    box.innerHTML = `<div class="kcard diag"><div class="kcard-title">🩺 AI 诊断报告</div><div>${mdLite(text)}</div></div>`;
  } catch (e) {
    box.innerHTML = '<div class="err">' + escapeHtml(e.message) + "</div>";
  }
}

/* ========================================================================== */
/*                          页面：写作模块                                      */
/* ========================================================================== */
ROUTES.writing = function () {
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">写作模块</h2>
      <p class="muted">3 套模板可背 → 挖空默写 → 看范文 → 自己写一篇让 AI 批改。</p>
      <div class="tmpl-list">
        ${window.WRITING_TEMPLATES.map((t) => `
          <div class="tmpl">
            <div class="tmpl-title">${escapeHtml(t.title)}</div>
            <div class="tmpl-scene muted">${escapeHtml(t.scene)}</div>
            <div class="tmpl-tabs">
              <button class="tab active" data-tab="template" data-id="${t.id}">模板</button>
              <button class="tab" data-tab="sample" data-id="${t.id}">范文</button>
              <button class="tab" data-tab="cloze" data-id="${t.id}">挖空默写</button>
            </div>
            <div class="tmpl-body" id="body-${t.id}"><pre>${escapeHtml(t.template)}</pre></div>
          </div>`).join("")}
      </div>

      <div class="write-area">
        <div class="kcard-title">📝 写作练习 · AI 批改</div>
        <p class="muted">写一篇 100–120 词的作文（祝贺信/日记/邀请信/议论文都行），AI 给你估分 + 逐条修改 + 地道改进版。</p>
        <textarea id="essay-input" class="textarea" rows="9" placeholder="在这里写你的作文（英文）…"></textarea>
        <div class="row">
          <input id="essay-prompt" class="input" placeholder="题目要求（选填），如：写信祝贺李明考上研究生" />
          <button id="grade-btn" class="btn btn-primary">AI 批改</button>
        </div>
        <div id="grade-result"></div>
      </div>

      <div class="essay-history" id="essay-history"></div>
    </div>`;
  $(".back-link").onclick = () => go("dashboard");

  // 模板 tab 切换
  $$(".tmpl-tabs .tab").forEach((tab) => (tab.onclick = function () {
    const id = this.dataset.id;
    const t = window.WRITING_TEMPLATES.find((x) => x.id === id);
    $$(`.tmpl-tabs .tab[data-id="${id}"]`).forEach((x) => x.classList.remove("active"));
    this.classList.add("active");
    const body = $("#body-" + id);
    if (this.dataset.tab === "template") body.innerHTML = `<pre>${escapeHtml(t.template)}</pre>`;
    else if (this.dataset.tab === "sample") body.innerHTML = `<pre>${escapeHtml(t.sample)}</pre>`;
    else body.innerHTML = renderClozePractice(t);
  }));

  $("#grade-btn").onclick = gradeEssay;
  renderEssayHistory();
};

/* 挖空默写练习 */
function renderClozePractice(t) {
  const parts = t.cloze.split("______");
  let html = '<div class="cloze-practice"><div class="cp-text">';
  parts.forEach((seg, i) => {
    html += escapeHtml(seg);
    if (i < parts.length - 1) html += `<input class="cp-blank" data-i="${i}" />`;
  });
  html += `</div><button class="btn btn-ghost btn-sm cp-check">对答案</button><div class="cp-result"></div></div>`;
  // 用 setTimeout 绑定，因为此刻还没插入 DOM
  setTimeout(() => {
    const box = $("#body-" + t.id);
    if (!box) return;
    const btn = box.querySelector(".cp-check");
    if (!btn) return;
    btn.onclick = () => {
      const blanks = box.querySelectorAll(".cp-blank");
      let right = 0;
      blanks.forEach((b, i) => {
        const ok = b.value.trim().toLowerCase() === (t.clozeAnswers[i] || "").toLowerCase();
        b.classList.toggle("cp-ok", ok);
        b.classList.toggle("cp-no", !ok);
        if (ok) right++;
      });
      box.querySelector(".cp-result").innerHTML =
        `对 ${right}/${blanks.length}。参考答案：${t.clozeAnswers.join(" / ")}`;
    };
  }, 0);
  return html;
}

async function gradeEssay() {
  const text = $("#essay-input").value.trim();
  const prompt = $("#essay-prompt").value.trim();
  const box = $("#grade-result");
  if (text.length < 20) { box.innerHTML = '<div class="err">先写一篇作文再批改哦（至少 20 词）。</div>'; return; }
  if (!hasApiKey()) { box.innerHTML = '<div class="err">还没填 API Key，请到设置里填写。</div>'; return; }
  box.innerHTML = '<div class="kcard"><span class="muted">AI 老师正在批改…</span></div>';
  try {
    const feedback = await callClaude({
      strong: true,
      system: "你是成人高考英语作文阅卷老师。请用简单中文点评，务必包含：① 按成考标准估分(满分25分，给具体分数)；② 逐条指出语法/拼写/用词错误并说明怎么改；③ 指出反复出现的问题；④ 给一版保持原意但更地道的改进范文(标题写：【改进范文】)。语气鼓励。",
      messages: [{ role: "user", content: `作文题目要求：${prompt || "（未填）"}\n\n我的作文：\n${text}` }],
      maxTokens: 1600,
    });
    box.innerHTML = `<div class="kcard grade"><div class="kcard-title">批改结果</div><div>${mdLite(feedback)}</div></div>`;
    STATE.essays.unshift({ id: "e" + Date.now(), date: todayStr(), prompt, text, feedback });
    saveState();
    renderEssayHistory();
  } catch (e) {
    box.innerHTML = '<div class="err">' + escapeHtml(e.message) + "</div>";
  }
}

function renderEssayHistory() {
  const box = $("#essay-history");
  if (!box) return;
  if (!STATE.essays.length) { box.innerHTML = ""; return; }
  box.innerHTML = `<div class="kcard-title" style="margin-top:24px">作文历史（点开看批改）</div>` +
    STATE.essays.map((e) => `
      <details class="essay-item">
        <summary>${e.date} · ${escapeHtml(e.prompt || "无题目")}</summary>
        <div class="essay-compare">
          <div class="ec-col"><div class="ec-h">我的原文</div><pre>${escapeHtml(e.text)}</pre></div>
          <div class="ec-col"><div class="ec-h">AI 批改</div><div>${mdLite(e.feedback)}</div></div>
        </div>
      </details>`).join("");
}

/* ========================================================================== */
/*                          页面：会话模块（配对题 + AI 陪练）                  */
/* ========================================================================== */
ROUTES.conversation = function () {
  const convQs = allQuestions().filter((q) => q.module === "conversation");
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">会话模块</h2>
      <div class="conv-two">
        <button id="conv-dialogues" class="big-choice">
          <div class="bc-emoji">📖</div><div class="bc-t">情景对话</div>
          <div class="bc-s muted">${(window.DIALOGUES || []).length} 段 · 读+听+看翻译</div>
        </button>
        <button id="conv-quiz" class="big-choice">
          <div class="bc-emoji">🧩</div><div class="bc-t">补全对话练习</div>
          <div class="bc-s muted">${convQs.length} 道 · 练礼貌应答套路</div>
        </button>
        <button id="conv-chat" class="big-choice">
          <div class="bc-emoji">💬</div><div class="bc-t">和 AI 练对话</div>
          <div class="bc-s muted">真实情景 · 温和纠错</div>
        </button>
      </div>
      <div id="conv-body"></div>
    </div>`;
  $(".back-link").onclick = () => go("dashboard");
  $("#conv-dialogues").onclick = renderDialogueList;
  $("#conv-quiz").onclick = () => startQuiz(shuffle(convQs), { title: "补全对话练习" });
  $("#conv-chat").onclick = renderConvScenes;
};

/* 情景对话：列表 → 阅读（每句可听🔊 + 点开看翻译） */
function renderDialogueList() {
  const body = $("#conv-body");
  body.innerHTML = `
    <div class="kcard-title" style="margin-top:20px">选一段情景对话来读：</div>
    <div class="scene-grid">
      ${(window.DIALOGUES || []).map((d) => `
        <button class="scene-card" data-id="${d.id}">
          <div class="sc-t">${escapeHtml(d.title)}</div>
          <div class="sc-d muted">${escapeHtml(d.scene)}</div>
        </button>`).join("")}
    </div>
    <div id="dlg-view"></div>`;
  $$(".scene-card").forEach((b) => (b.onclick = () => openDialogue(b.dataset.id)));
}
function openDialogue(id) {
  const d = (window.DIALOGUES || []).find((x) => x.id === id);
  if (!d) return;
  const view = $("#dlg-view");
  view.innerHTML = `
    <div class="dlg-head">
      <div class="kcard-title">${escapeHtml(d.title)}</div>
      <div class="muted">${escapeHtml(d.scene)}</div>
      <div class="row" style="margin-top:8px">
        <button id="dlg-toggle-tr" class="btn btn-ghost btn-sm">显示全部翻译</button>
        <button id="dlg-play-all" class="btn btn-ghost btn-sm">🔊 读全文</button>
      </div>
    </div>
    <div class="dlg-lines">
      ${d.lines.map((ln, i) => `
        <div class="dlg-line who-${ln.who}">
          <div class="dlg-who">${ln.who}</div>
          <div class="dlg-bubble">
            <div class="dlg-en">${escapeHtml(ln.en)} <button class="say-btn dlg-say" data-i="${i}" title="听">🔊</button></div>
            <div class="dlg-zh hidden" data-i="${i}">${escapeHtml(ln.zh)}</div>
            <button class="dlg-tr-btn" data-i="${i}">译</button>
          </div>
        </div>`).join("")}
    </div>`;
  view.scrollIntoView({ behavior: "smooth", block: "start" });
  // 单句听
  $$(".dlg-say", view).forEach((b) => (b.onclick = () => speak(d.lines[parseInt(b.dataset.i, 10)].en)));
  // 单句翻译开关
  $$(".dlg-tr-btn", view).forEach((b) => (b.onclick = () => {
    $(`.dlg-zh[data-i="${b.dataset.i}"]`, view).classList.toggle("hidden");
  }));
  // 全部翻译开关
  let showAll = false;
  $("#dlg-toggle-tr", view).onclick = function () {
    showAll = !showAll;
    $$(".dlg-zh", view).forEach((z) => z.classList.toggle("hidden", !showAll));
    this.textContent = showAll ? "隐藏翻译" : "显示全部翻译";
  };
  // 顺序读全文
  $("#dlg-play-all", view).onclick = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    d.lines.forEach((ln) => { const u = new SpeechSynthesisUtterance(ln.en); u.lang = "en-US"; u.rate = 0.9; window.speechSynthesis.speak(u); });
  };
}

function renderConvScenes() {
  const body = $("#conv-body");
  body.innerHTML = `
    <div class="kcard-title" style="margin-top:20px">选一个场景开始对话：</div>
    <div class="scene-grid">
      ${window.CONV_SCENES.map((s) => `
        <button class="scene-card" data-id="${s.id}">
          <div class="sc-t">${escapeHtml(s.title)}</div>
          <div class="sc-d muted">${escapeHtml(s.desc)}</div>
        </button>`).join("")}
    </div>
    <div id="conv-chat-area"></div>`;
  $$(".scene-card").forEach((b) => (b.onclick = () => startConvChat(window.CONV_SCENES.find((s) => s.id === b.dataset.id))));
}

function startConvChat(scene) {
  const area = $("#conv-chat-area");
  const history = [];
  const system = `你在和一个 A2 水平的中国学生练英语口语，场景是「${scene.title}」：${scene.desc}。规则：
- 你用【简单英语】扮演场景里的对方，一次只说 1-2 句，并自然地把话轮交给学生。
- 学生回复后，先温和纠错（如果有错，用括号简短指出更好的说法），再继续对话。
- 每次回复末尾加一行中文小提示，帮他知道接下来能怎么说。格式：💡提示：……`;

  area.innerHTML = `
    <div class="chat-window" id="cw"></div>
    <div class="tutor-ask">
      <input class="input" id="conv-input" placeholder="用英文回复…（按回车发送）" />
      <button class="btn btn-primary" id="conv-send">发送</button>
    </div>`;
  const cw = $("#cw");
  function bubble(role, html) {
    const d = document.createElement("div");
    d.className = "bubble " + (role === "user" ? "bubble-user" : "bubble-ai");
    d.innerHTML = html;
    cw.appendChild(d); cw.scrollTop = cw.scrollHeight;
    return d;
  }
  async function send(text, showUser) {
    if (showUser) bubble("user", escapeHtml(text));
    history.push({ role: "user", content: text });
    const t = bubble("ai", '<span class="muted">…</span>');
    try {
      const r = await callClaude({ system, messages: history, maxTokens: 500 });
      history.push({ role: "assistant", content: r });
      t.innerHTML = mdLite(r);
    } catch (e) { t.innerHTML = '<span class="err">' + escapeHtml(e.message) + "</span>"; history.pop(); }
  }
  // AI 先开口
  send("(请你用一句简单英语开启这个场景对话)", false);
  const input = $("#conv-input");
  const doSend = () => { const v = input.value.trim(); if (!v) return; input.value = ""; send(v, true); };
  $("#conv-send").onclick = doSend;
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSend(); });
}

/* ========================================================================== */
/*                          AI 按需出题                                         */
/* ========================================================================== */
async function aiGenerateQuestions() {
  const topic = $("#gen-topic").value.trim();
  const box = $("#gen-result");
  if (!topic) { box.innerHTML = '<div class="err">先输入一个知识点。</div>'; return; }
  if (!hasApiKey()) { box.innerHTML = '<div class="err">还没填 API Key，请到设置里填写。</div>'; return; }
  box.innerHTML = '<div class="kcard"><span class="muted">AI 正在出题…</span></div>';
  const schema = `[{"id":"ai-xxx","module":"grammar","topic":"${topic}","stem":"...带____的题干","options":["A","B","C","D"],"answer":0,"explanation":"大白话解析","optionNotes":["对:...","错:...","错:...","错:..."]}]`;
  try {
    const raw = await callClaude({
      system: "你是成人高考英语出题老师。请只输出一个合法 JSON 数组，不要任何多余文字、不要 markdown 代码块。",
      messages: [{ role: "user", content:
        `围绕知识点「${topic}」，出 5 道成人高考风格的四选一选择题，难度适合 A2 水平。严格按这个结构输出 JSON 数组（optionNotes 长度必须等于选项数，解析用简单中文）：\n${schema}` }],
      maxTokens: 2000,
    });
    let json = raw.trim().replace(/^```json?/i, "").replace(/```$/,"").trim();
    let arr = JSON.parse(json);
    arr.forEach((q, i) => { q.id = "ai-" + Date.now() + "-" + i; q.module = q.module || "grammar"; });
    arr = arr.filter(validGenQ);   // 丢掉不自洽的坏题
    if (!arr.length) { box.innerHTML = '<div class="err">这批题没通过校验，请再点一次生成。</div>'; return; }
    box.innerHTML = `
      <div class="kcard">
        <div class="kcard-title">AI 出了 ${arr.length} 道题</div>
        <div class="row-center">
          <button id="ai-do" class="btn btn-primary">现在就做</button>
          <button id="ai-save" class="btn btn-ghost">存入题库</button>
        </div>
      </div>`;
    $("#ai-do").onclick = () => startQuiz(arr, { title: topic + " · AI 生成" });
    $("#ai-save").onclick = () => {
      STATE.aiQuestions = (STATE.aiQuestions || []).concat(arr);
      saveState();
      box.innerHTML += '<div class="checkin-badge">已存入题库（可在分模块练习里看到）</div>';
    };
  } catch (e) {
    box.innerHTML = '<div class="err">出题失败：' + escapeHtml(e.message) + '。可以再点一次试试。</div>';
  }
}

/* ========================================================================== */
/*                          页面：模拟考                                        */
/* ========================================================================== */
ROUTES.mock = function () {
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">模拟考 / 周测</h2>
      <p class="muted">按真实卷结构抽题、计时、给分。冲刺期建议反复做。</p>
      <div class="mock-info kcard">
        <div class="kcard-title">真实卷结构（满分 150）</div>
        <ul class="kcard-points">
          <li>I 语音 5 分 · II 词汇语法 15 分 · III 完形 30 分</li>
          <li>IV 阅读 60 分 · V 补全对话 15 分 · VI 写作 25 分</li>
          <li>本模拟考只考选择题部分，作文请到【写作模块】用 AI 批改练习。</li>
        </ul>
      </div>
      <div class="row-center">
        <button id="start-weekly" class="btn btn-ghost btn-big">周测（约 20 题）</button>
        <button id="start-mock" class="btn btn-primary btn-big">模拟考（全部题·计时）</button>
      </div>
      ${STATE.weeklyScores.length ? renderScoreHistory() : ""}
    </div>`;
  $(".back-link").onclick = () => go("dashboard");
  $("#start-weekly").onclick = () => startTimedExam(20, "周测");
  $("#start-mock").onclick = () => startTimedExam(999, "模拟考");
};

function renderScoreHistory() {
  const list = STATE.weeklyScores.slice(-8);
  const max = 150;
  return `
    <div class="kcard">
      <div class="kcard-title">📈 提分曲线（折算 150 分制）</div>
      <div class="spark">
        ${list.map((s) => {
          const h = Math.round((s.scaled / max) * 100);
          return `<div class="spark-col" title="${s.date} ${s.scaled}分">
                    <div class="spark-bar" style="height:${h}%"></div>
                    <div class="spark-val">${s.scaled}</div>
                  </div>`;
        }).join("")}
      </div>
    </div>`;
}

let EXAM_TIMER = null;
function startTimedExam(count, title) {
  // 按模块比例抽题
  const pick = (mod, n) => shuffle(bankQuestions().filter((q) => q.module === mod && !isTyped(q))).slice(0, n);
  let list;
  if (count >= 999) {
    list = [].concat(pick("phonetics", 5), pick("grammar", 12), pick("collocation", 8),
      pick("cloze", 5), pick("reading", 8), pick("conversation", 5));
  } else {
    list = [].concat(pick("phonetics", 2), pick("grammar", 6), pick("collocation", 5),
      pick("cloze", 3), pick("reading", 2), pick("conversation", 2));
  }
  list = shuffle(list.filter(Boolean));
  if (!list.length) { alert("题库题目不足。"); return; }

  const minutes = count >= 999 ? 40 : 20;
  startQuiz(list, { title, recordScore: true });
  // 顶部加一个计时器
  const timerEl = document.createElement("div");
  timerEl.className = "exam-timer";
  document.body.appendChild(timerEl);
  let left = minutes * 60;
  const tick = () => {
    const m = String(Math.floor(left / 60)).padStart(2, "0");
    const s = String(left % 60).padStart(2, "0");
    timerEl.textContent = "⏱ " + m + ":" + s;
    if (left <= 0) { clearInterval(EXAM_TIMER); timerEl.remove(); finishQuiz(); }
    left--;
  };
  tick();
  clearInterval(EXAM_TIMER);
  EXAM_TIMER = setInterval(tick, 1000);
  // 交卷/退出时清掉计时器
  const origFinish = finishQuiz;
  // 用 MutationObserver 简化：这里在 finishQuiz 里已处理不了，改为在 go() 时清理
  window._examTimerEl = timerEl;
}

/* ========================================================================== */
/*                          页面：设置                                          */
/* ========================================================================== */
ROUTES.settings = function () {
  const s = STATE.settings;
  contentEl.innerHTML = `
    <div class="page">
      <button class="back-link" data-route="dashboard">← 返回首页</button>
      <h2 class="page-title">设置</h2>

      <div class="setting-block">
        <label class="set-label">Anthropic API Key</label>
        <p class="muted">去 <b>console.anthropic.com</b> 申请。只存在你自己的浏览器里，不会上传到别处。文档见 docs.claude.com。</p>
        <div class="row">
          <input id="set-key" class="input" type="password" value="${escapeHtml(s.apiKey)}" placeholder="sk-ant-..." />
          <button id="toggle-key" class="btn btn-ghost btn-sm">显示</button>
        </div>
      </div>

      <div class="setting-block">
        <label class="set-label">接口地址 / 格式（用第三方中转才改）</label>
        <p class="muted">官方 Anthropic 保持默认即可。用第三方中转（代理）时，把它给你的<b>接口地址</b>填进来，并选对<b>格式</b>（它文档里会写是 Anthropic 还是 OpenAI 格式）。</p>
        <div class="set-row"><span>接口地址</span><input id="set-base" class="input" value="${escapeHtml(s.apiBase)}" placeholder="https://api.anthropic.com" /></div>
        <div class="set-row"><span>接口格式</span>
          <select id="set-format" class="input">
            <option value="anthropic" ${s.apiFormat === "anthropic" ? "selected" : ""}>Anthropic 原生 (/v1/messages)</option>
            <option value="openai" ${s.apiFormat === "openai" ? "selected" : ""}>OpenAI 兼容 (/v1/chat/completions)</option>
          </select>
        </div>
      </div>

      <div class="setting-block">
        <label class="set-label">模型</label>
        <p class="muted">日常讲解用便宜快的（Haiku 档）；作文批改/诊断用更强的（Sonnet 档）。用第三方中转时，模型名要填它支持的名字。</p>
        <div class="set-row"><span>日常快速模型</span><input id="set-fast" class="input" value="${escapeHtml(s.modelFast)}" /></div>
        <div class="set-row"><span>强力模型</span><input id="set-strong" class="input" value="${escapeHtml(s.modelStrong)}" /></div>
        <button id="test-ai" class="btn btn-ghost btn-sm">测试连接</button>
        <span id="test-result"></span>
      </div>

      <div class="setting-block">
        <label class="set-label">每日训练时长</label>
        <div class="seg">
          ${[25, 40, 50].map((m) => `<button class="seg-btn ${s.dailyMinutes === m ? "active" : ""}" data-min="${m}">${m} 分钟</button>`).join("")}
        </div>
      </div>

      <div class="setting-block">
        <label class="set-label">朗读语音（🔊 单词/例句/对话）</label>
        <p class="muted">默认自动挑最好的英语语音。觉得难听就换一个试听。想要更地道，去 Mac「系统设置→辅助功能→朗读内容→系统语音→管理语音」下载"增强版/Siri"英语语音（免费），下完这里就能选。</p>
        <div class="row">
          <select id="set-voice" class="input">
            <option value="">自动（推荐）</option>
            ${englishVoices().map((v) => `<option value="${escapeHtml(v.name)}" ${s.voiceName === v.name ? "selected" : ""}>${escapeHtml(v.name)} (${escapeHtml(v.lang)})</option>`).join("")}
          </select>
          <button id="voice-test" class="btn btn-ghost">🔊 试听</button>
        </div>
        ${englishVoices().length === 0 ? '<p class="muted">（暂时没读到语音列表，点一下页面或刷新再来。）</p>' : ""}
      </div>

      <div class="setting-block">
        <label class="set-label">学习阶段（可手动切换）</label>
        <div class="seg">
          ${[[1,"阶段一·打地基"],[2,"阶段二·铺开"],[3,"阶段三·冲刺"]].map(([n,t]) =>
            `<button class="seg-btn ${s.stage === n ? "active" : ""}" data-stage="${n}">${t}</button>`).join("")}
        </div>
      </div>

      <div class="setting-block">
        <label class="set-label">考试日期 (EXAM_DATE)</label>
        <p class="muted">默认 2026-10-17，请以你所在省教育考试院公布为准。</p>
        <input id="set-date" class="input" type="date" value="${escapeHtml(s.examDate)}" />
      </div>

      <div class="setting-block">
        <label class="set-label">存档备份</label>
        <p class="muted">换浏览器或怕丢进度，就导出成 JSON 存好；需要时再导入恢复。</p>
        <div class="row-center">
          <button id="export-btn" class="btn btn-ghost">⬇️ 导出存档</button>
          <label class="btn btn-ghost">⬆️ 导入存档<input id="import-file" type="file" accept="application/json" hidden /></label>
        </div>
        <div id="io-result"></div>
      </div>

      <div class="setting-block danger">
        <button id="reset-btn" class="btn btn-danger btn-sm">清空所有进度（谨慎）</button>
      </div>

      <div class="save-hint">改动会自动保存 ✓</div>
    </div>`;
  $(".back-link").onclick = () => go("dashboard");

  const save = () => saveState();
  $("#set-key").onchange = (e) => { s.apiKey = e.target.value.trim(); save(); };
  $("#toggle-key").onclick = function () {
    const inp = $("#set-key");
    inp.type = inp.type === "password" ? "text" : "password";
    this.textContent = inp.type === "password" ? "显示" : "隐藏";
  };
  $("#set-fast").onchange = (e) => { s.modelFast = e.target.value.trim(); save(); };
  $("#set-strong").onchange = (e) => { s.modelStrong = e.target.value.trim(); save(); };
  $("#set-voice").onchange = (e) => { s.voiceName = e.target.value; save(); };
  $("#voice-test").onclick = () => { s.voiceName = $("#set-voice").value; save(); speak("Hello, I am your English teacher. Let's improve your English together."); };
  $("#set-base").onchange = (e) => { s.apiBase = e.target.value.trim(); save(); };
  $("#set-format").onchange = (e) => { s.apiFormat = e.target.value; save(); };
  $("#set-date").onchange = (e) => { s.examDate = e.target.value; save(); };
  $$(".seg-btn[data-min]").forEach((b) => (b.onclick = () => {
    s.dailyMinutes = parseInt(b.dataset.min, 10); save(); ROUTES.settings();
  }));
  $$(".seg-btn[data-stage]").forEach((b) => (b.onclick = () => {
    s.stage = parseInt(b.dataset.stage, 10); save(); ROUTES.settings();
  }));
  $("#test-ai").onclick = async function () {
    const r = $("#test-result");
    r.innerHTML = ' <span class="muted">测试中…</span>';
    // 先保存当前输入（含中转地址和格式）
    s.apiKey = $("#set-key").value.trim(); s.modelFast = $("#set-fast").value.trim();
    s.apiBase = $("#set-base").value.trim(); s.apiFormat = $("#set-format").value; save();
    try {
      const t = await callClaude({ messages: [{ role: "user", content: "回复：连接成功" }], maxTokens: 20 });
      r.innerHTML = ' <span class="ok-text">✓ ' + escapeHtml(t) + "</span>";
    } catch (e) { r.innerHTML = ' <span class="err">' + escapeHtml(e.message) + "</span>"; }
  };
  $("#export-btn").onclick = exportState;
  $("#import-file").onchange = (e) => {
    if (e.target.files[0]) importState(e.target.files[0], (ok, msg) => {
      $("#io-result").innerHTML = ok ? '<div class="checkin-badge">' + msg + "</div>" : '<div class="err">' + msg + "</div>";
      if (ok) setTimeout(() => go("dashboard"), 800);
    });
  };
  $("#reset-btn").onclick = () => {
    if (confirm("确定清空所有进度、错题、作文？此操作不可恢复。")) {
      localStorage.removeItem(STORE_KEY);
      // 留个墓碑：否则下次启动会从硬盘备份自动恢复，等于清不掉
      localStorage.setItem(NO_RESTORE_KEY, "1");
      loadState(); go("dashboard");
    }
  };
};

/* -------- 划词速查：双击一个词 / 拖选短句 → 弹出中文释义（阅读辅助，不收藏） -------- */
function toast(msg) {
  let t = document.getElementById("app-toast");
  if (!t) { t = document.createElement("div"); t.id = "app-toast"; t.className = "app-toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}
/* 选中的是不是合法的英文单词/短句（1-6 个词，只含字母/空格/撇号/连字符） */
function isEnglishSelection(text) {
  const t = text.trim().replace(/\s+/g, " ");
  const words = t.split(" ").filter(Boolean);
  return t.length >= 2 && words.length >= 1 && words.length <= 6 && /^[a-zA-Z][a-zA-Z' \-]*$/.test(t);
}
/* 划词 → 弹出中文释义（读文章时随手查，不再收藏） */
async function showLookupPop(text, x, y) {
  text = text.trim().replace(/\s+/g, " ");
  const isPhrase = text.split(" ").length >= 2;
  let p = document.getElementById("vocab-pop");
  if (!p) { p = document.createElement("div"); p.id = "vocab-pop"; p.className = "vocab-pop"; document.body.appendChild(p); }
  const hint = hasApiKey() ? "查询中…" : "（填 API Key 可查释义）";
  p.innerHTML = `<b>${escapeHtml(text)}</b> <span class="lk-say" title="朗读" style="cursor:pointer">🔊</span><br><span class="lk-zh" style="color:var(--muted,#888)">${hint}</span>`;
  p.style.left = Math.min(Math.max(8, x - 60), window.innerWidth - 260) + "px";
  p.style.top = (y + 16) + "px";
  p.classList.add("show");
  const sayBtn = p.querySelector(".lk-say");
  if (sayBtn) sayBtn.onclick = (ev) => { ev.stopPropagation(); speak(text, "en-US"); };
  const hide = () => p.classList.remove("show");
  clearTimeout(p._t); p._t = setTimeout(hide, 6000);
  if (!hasApiKey()) return;
  try {
    const out = await callClaude({
      system: "你是英汉词典。给这个英文" + (isPhrase ? "短语/短句" : "单词") + "最常用的简明中文释义" +
        (isPhrase ? "" : "(带词性，如 v./n./adj.)") + "。只输出中文释义本身，一行，不要英文、不要例句、不要多余符号。",
      messages: [{ role: "user", content: text }], maxTokens: 90,
    });
    const zh = (out || "").trim();
    const zhEl = p.querySelector(".lk-zh");
    if (zhEl) { zhEl.textContent = zh || "（没查到）"; zhEl.style.color = "inherit"; }
    clearTimeout(p._t); p._t = setTimeout(hide, 6000);
  } catch (e) {
    const zhEl = p.querySelector(".lk-zh");
    if (zhEl) zhEl.textContent = "（查询失败，可重试）";
  }
}

/* ========================================================================== */
/*                          启动                                                */
/* ========================================================================== */
function clearExamTimer() {
  clearInterval(EXAM_TIMER);
  if (window._examTimerEl) { window._examTimerEl.remove(); window._examTimerEl = null; }
}

function init() {
  loadState();
  // 清掉历史里已存下的"不自洽"AI题（选项/答案/解析对不上的坏题）
  if (Array.isArray(STATE.aiQuestions)) {
    const before = STATE.aiQuestions.length;
    STATE.aiQuestions = STATE.aiQuestions.filter(validGenQ);
    if (STATE.aiQuestions.length !== before) saveState();
  }
  contentEl = $("#content");

  // 加载语音列表（getVoices 是异步的，voiceschanged 后再读一次）
  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // 划词加生词/短句本：双击单词 或 拖选短句（1-6 个词）都弹出加入
  const onSelect = (e) => {
    const sel = (window.getSelection ? window.getSelection().toString() : "").trim().replace(/\s+/g, " ");
    if (isEnglishSelection(sel)) {
      const x = (e.clientX || (window.innerWidth / 2)), y = (e.clientY || 120);
      showLookupPop(sel, x, y);
    }
  };
  document.addEventListener("dblclick", onSelect);   // 双击选中一个词
  document.addEventListener("mouseup", (e) => { setTimeout(() => onSelect(e), 0); });   // 拖选短句

  // 导航
  $$(".nav-item").forEach((n) => (n.onclick = () => { clearExamTimer(); go(n.dataset.route); }));

  // 首次使用引导填 key
  if (!hasApiKey()) {
    setTimeout(() => {
      const banner = $("#onboard");
      if (banner) banner.classList.remove("hidden");
    }, 400);
  }
  $("#onboard-go") && ($("#onboard-go").onclick = () => { $("#onboard").classList.add("hidden"); go("settings"); });
  $("#onboard-skip") && ($("#onboard-skip").onclick = () => $("#onboard").classList.add("hidden"));

  // 深色模式切换
  const themeBtn = $("#theme-btn");
  if (localStorage.getItem("ck_theme") === "dark") document.body.classList.add("dark");
  themeBtn.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("ck_theme", document.body.classList.contains("dark") ? "dark" : "light");
  };

  // 本地存档是空的 → 看看硬盘备份里有没有（浏览器被清数据后靠这个救回来）
  tryAutoRestore().then((savedAt) => {
    if (savedAt) {
      loadState();
      go("dashboard");
      setTimeout(() => toast("已从硬盘备份恢复你的进度（备份于 " + savedAt + "）"), 300);
    }
  });

  go("dashboard");
}

// go() 前清理考试计时器
const _origGo = go;
go = function (route) { clearExamTimer(); _origGo(route); };

document.addEventListener("DOMContentLoaded", init);
