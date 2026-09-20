/* ===== srs.js 间隔重复 + 进度统计 ===== */
(function (w) {
  'use strict';
  const U = w.U, DB = w.DB;

  // ---------- 模块中文名 ----------
  const MODULE_NAMES = {
    literacy: '数学扫盲·从零',
    prep: '预备·初高中衔接',
    limit: '极限与连续',
    derivative: '导数与微分',
    application: '导数应用',
    integral_indef: '不定积分',
    integral_def: '定积分及应用',
    multivar: '多元函数微分',
    probability: '概率初步'
  };
  const LEVEL_NAMES = { 0: '启蒙', 1: '预备', 2: '基础', 3: '提升', 4: '冲刺' };

  // ---------- 该背还是该懂 ----------
  // 主要靠"记住公式套上去"的知识点归为"记忆"，其余归为"理解"。
  // 题目可自带 q.mode 覆盖（'记忆' | '理解'）。
  const MEMORIZE_TOPICS = new Set(['指数对数', '三角函数', '导数计算', '不定积分', '定积分', '多元偏导', '全微分']);
  function questionMode(q) {
    if (q.mode) return q.mode;
    if (MEMORIZE_TOPICS.has(q.topic)) return '记忆';
    return '理解';
  }

  // ---------- 知识点权重（3=核心必考 / 2=重要 / 1=基础·了解）----------
  // 依据成考高数(二)、目标60分的"高性价比"：极限/导数/积分/导数应用是拿分大头。
  const TOPIC_WEIGHT = {
    '极限计算': 3, '导数计算': 3, '不定积分': 3, '定积分': 3, '导数应用': 3,
    '连续性': 2, '定义域': 2, '指数对数': 2, '多元偏导': 2, '全微分': 2,
    '隐函数': 2, '反常积分': 2, '概率': 2, '三角函数': 2
    // 其余（字母/根号/因式分解/不等式/中值定理…）默认 1
  };
  function topicWeight(t) { return TOPIC_WEIGHT[t] || 1; }
  function weightLabel(w) { return w >= 3 ? '⭐核心必考' : w === 2 ? '重要' : '基础'; }

  // ---------- 放弃清单（难学 + 投产比差，不进 60 分必学路线）----------
  // 这些不进每日计划、不算章节通关、不拖累解锁；想学仍可在"练习/课程"里自己点开。
  const SKIP_TOPICS = new Set(['中值定理', '反常积分', '隐函数']);
  function isSkipTopic(t) { return SKIP_TOPICS.has(t); }

  // ---------- 大纲章节主线（按学习顺序） ----------
  const CHAPTERS = [
    { key: 'literacy', name: '第0章 · 数学扫盲（启蒙）', module: 'literacy' },
    { key: 'prep', name: '第1章 · 预备·函数基础', module: 'prep' },
    { key: 'limit', name: '第2章 · 极限与连续', module: 'limit' },
    { key: 'derivative', name: '第3章 · 导数与微分', module: 'derivative' },
    { key: 'application', name: '第4章 · 导数应用', module: 'application' },
    { key: 'integral_indef', name: '第5章 · 不定积分', module: 'integral_indef' },
    { key: 'integral_def', name: '第6章 · 定积分', module: 'integral_def' },
    { key: 'multivar', name: '第7章 · 多元函数微分', module: 'multivar' },
    { key: 'probability', name: '第8章 · 概率初步', module: 'probability' }
  ];
  function chapterStatus() {
    const byM = passRateByModule();
    const recs = DB.raw().questions;
    const litLessons = (w.LESSONS || []).filter(l => (l.group || '启蒙') === '启蒙');
    const litDone = litLessons.length ? litLessons.every(l => DB.lessonDone(l.id)) : true;
    return CHAPTERS.map(ch => {
      const s = byM[ch.module] || { first: 0, firstOk: 0, total: 0 };
      const rate = s.first ? s.firstOk / s.first : null;   // 一次性通关率（仅展示）
      // 通关标准（用于解锁）：本章 ≥60% 的题"最终做对过"。
      // 只算必学题——把"放弃清单"里的难题排除，别让它们拖着你不解锁。
      const qs = (w.QUESTIONS || []).filter(q => q.module === ch.module && !isSkipTopic(q.topic));
      let okEver = 0, seen = 0;
      qs.forEach(q => { const r = recs[q.id]; if (r && r.seen) seen++; if (r && r.correct > 0) okEver++; });
      let mastered = qs.length > 0 && okEver >= Math.ceil(qs.length * 0.6);
      if (ch.key === 'literacy') mastered = mastered && litDone; // 启蒙还要读完9节
      const started = seen > 0 || (ch.key === 'literacy' && DB.lessonsDoneCount() > 0);
      return Object.assign({}, ch, { total: s.total, first: s.first, rate, okEver, seen, mastered, started });
    });
  }
  // 摸底阶段 → 起始章下标（测出来是"预备"就别再从"扫盲"耗着）
  function stageFloorIndex() {
    switch (DB.get('stage')) {
      case '预备夯实期': return 1;   // 从"预备·函数基础"起
      case '基础攻坚期': return 2;   // 从"极限与连续"起（真正的高数）
      case '冲刺期': return 2;       // 同上，靠难度分层再拔高
      default: return 0;             // 零基础启蒙期
    }
  }
  function currentChapterIndex() {
    const st = chapterStatus();
    const floor = stageFloorIndex();
    for (let i = floor; i < st.length; i++) { if (st[i].total > 0 && !st[i].mastered) return i; }
    return st.length - 1;
  }
  // 每日主攻选题：本章里按"性价比优先"——先挑还没掌握的、权重高(核心)的；排除放弃清单
  function leastPracticedTopicInModule(module) {
    const byT = passRateByTopic();
    const arr = Object.entries(byT)
      .filter(([t, s]) => s.module === module && !isSkipTopic(t))
      .map(([t, s]) => ({ topic: t, first: s.first, rate: s.first ? s.firstOk / s.first : null, w: topicWeight(t) }));
    if (!arr.length) return null;
    arr.sort((a, b) => {
      const am = (a.rate != null && a.rate >= 0.8) ? 1 : 0;   // 已掌握的排后面
      const bm = (b.rate != null && b.rate >= 0.8) ? 1 : 0;
      return (am - bm) || (b.w - a.w) || (a.first - b.first); // 未掌握 > 高权重(核心) > 练得少
    });
    return arr[0].topic;
  }

  // ---------- 公式 SRS（Leitner 盒子，间隔按 box 递增） ----------
  const BOX_DAYS = [0, 1, 2, 4, 8, 16];   // box0 立即, box5 隔16天
  function reviewFormula(id, grade) {
    // grade: 'know'(记得) | 'fuzzy'(模糊) | 'no'(不会)
    const r = DB.fRec(id);
    r.seen++;
    if (grade === 'know') r.box = U.clamp(r.box + 1, 0, 5);
    else if (grade === 'fuzzy') r.box = U.clamp(r.box, 0, 5); // 保持
    else r.box = 0;                                           // 不会 -> 归零，天天见
    const days = BOX_DAYS[r.box];
    const d = new Date(); d.setDate(d.getDate() + days);
    r.due = d.toISOString().slice(0, 10);
    r.lastTs = Date.now();
    DB.save();
  }
  function dueFormulas() {
    const today = U.todayStr();
    return (w.FORMULAS || []).filter(f => {
      const r = DB.raw().formulas[f.id];
      return !r || r.due <= today;   // 没背过 或 到期
    });
  }
  // 当前章节该背哪组公式（背的要和正在学的对上，别做字母题却背导数公式）
  const FORMULA_GROUP_BY_MODULE = {
    limit: '极限', derivative: '导数', application: '导数',
    integral_indef: '积分', integral_def: '积分', multivar: '多元',
    probability: '概率', prep: '三角'
    // literacy（扫盲）→ 不背公式
  };
  function formulaGroupForModule(m) { return FORMULA_GROUP_BY_MODULE[m] || null; }
  // 返回该章节相关、且到期/没背过的公式（无相关组 → 空数组，今日就不安排背公式）
  function dueFormulasForModule(module) {
    const g = formulaGroupForModule(module);
    if (!g) return [];
    const today = U.todayStr();
    return (w.FORMULAS || []).filter(f => f.group === g).filter(f => {
      const r = DB.raw().formulas[f.id];
      return !r || r.due <= today;
    });
  }
  function formulaMastery() {
    const all = w.FORMULAS || [];
    if (!all.length) return 0;
    let sum = 0;
    all.forEach(f => { const r = DB.raw().formulas[f.id]; sum += r ? r.box / 5 : 0; });
    return Math.round((sum / all.length) * 100);
  }

  // ---------- 题目取题：整轮不重复，做过的排后面 ----------
  // filterFn(q)->bool；返回排好序的题数组
  function pickQuestions(filterFn, limit) {
    const qs = (w.QUESTIONS || []).filter(filterFn);
    const now = Date.now();
    // 排序：没做过 > 做错过（错的优先重现）> 做对过（按上次时间早的优先）
    qs.sort((a, b) => score(a) - score(b));
    function score(q) {
      const r = DB.raw().questions[q.id];
      if (!r || !r.seen) return 0;                        // 没做过，最优先
      const wrongRate = r.tries ? 1 - r.correct / r.tries : 0;
      if (wrongRate > 0) return 1 - wrongRate;            // 错得多 -> 越小越优先(0~1)
      return 2 + r.lastTs / now;                          // 全对：越久没做越优先
    }
    return limit ? qs.slice(0, limit) : qs;
  }

  // ---------- 一次性通关率（按模块/知识点） ----------
  function passRateByModule() {
    const stat = {};
    (w.QUESTIONS || []).forEach(q => {
      const m = q.module;
      if (!stat[m]) stat[m] = { first: 0, firstOk: 0, total: 0 };
      stat[m].total++;
      const r = DB.raw().questions[q.id];
      if (r && r.firstTry !== null) { stat[m].first++; if (r.firstTry) stat[m].firstOk++; }
    });
    return stat; // { module: {first, firstOk, total} }
  }
  function passRateByTopic() {
    const stat = {};
    (w.QUESTIONS || []).forEach(q => {
      const t = q.topic || '未分类';
      if (!stat[t]) stat[t] = { module: q.module, first: 0, firstOk: 0, total: 0 };
      stat[t].total++;
      const r = DB.raw().questions[q.id];
      if (r && r.firstTry !== null) { stat[t].first++; if (r.firstTry) stat[t].firstOk++; }
    });
    return stat;
  }
  // 真·薄弱知识点：做过≥1题、且一次性通关率 < 80%（已经会的不算弱点，别再拿来重复做）
  function weakestTopics(n) {
    const byTopic = passRateByTopic();
    const arr = Object.entries(byTopic)
      .map(([t, s]) => ({ topic: t, module: s.module, rate: s.first ? s.firstOk / s.first : null, first: s.first, total: s.total }))
      .filter(x => x.first > 0 && x.rate != null && x.rate < 0.8 && !isSkipTopic(x.topic))
      .sort((a, b) => a.rate - b.rate);
    return arr.slice(0, n || 3);
  }
  // 练得最少的知识点（用于「学概念」轮换）
  function leastPracticedTopic() {
    const byTopic = passRateByTopic();
    const arr = Object.entries(byTopic).map(([t, s]) => ({ topic: t, module: s.module, first: s.first }));
    arr.sort((a, b) => a.first - b.first);
    return arr[0] ? arr[0].topic : null;
  }

  function overallProgress() {
    const all = (w.QUESTIONS || []);
    if (!all.length) return 0;
    let done = 0;
    all.forEach(q => { const r = DB.raw().questions[q.id]; if (r && r.seen) done++; });
    return Math.round(done / all.length * 100);
  }
  function accuracy() {
    let tries = 0, correct = 0;
    Object.values(DB.raw().questions).forEach(r => { tries += r.tries; correct += r.correct; });
    return tries ? Math.round(correct / tries * 100) : 0;
  }

  w.SRS = {
    MODULE_NAMES, LEVEL_NAMES, questionMode, topicWeight, weightLabel, isSkipTopic,
    CHAPTERS, chapterStatus, currentChapterIndex, stageFloorIndex, leastPracticedTopicInModule,
    formulaGroupForModule, dueFormulasForModule,
    reviewFormula, dueFormulas, formulaMastery,
    pickQuestions, passRateByModule, passRateByTopic, weakestTopics, leastPracticedTopic,
    overallProgress, accuracy
  };
})(window);
