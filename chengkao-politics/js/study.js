/* ============================================================
 * study.js —— 学习时间统计 / 知识点进度（一次性通关率）/
 *              系统学习进度 / 专项练习不重复轮次
 * ============================================================ */

const Study = (function () {

  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  /* ---------- 学习时间 ---------- */
  // 每次调用累加 sec 秒到今天（由 App 的心跳定时器每 30 秒调一次）
  function addSeconds(sec) {
    const s = Store.get();
    s.studySeconds = s.studySeconds || {};
    s.studySeconds[today()] = (s.studySeconds[today()] || 0) + sec;
    Store.save();
  }
  function todaySeconds() { return (Store.get().studySeconds || {})[today()] || 0; }
  function totalSeconds() {
    const m = Store.get().studySeconds || {};
    return Object.values(m).reduce((a,b)=>a+b,0);
  }
  function fmt(sec) {
    const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60);
    if (h) return `${h}小时${m}分`;
    if (m) return `${m}分钟`;
    return `${sec}秒`;
  }
  // 最近 n 天的时长（用于小图）
  function recentDays(n) {
    const m = Store.get().studySeconds || {};
    const out = [];
    for (let i = n-1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate()-i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      out.push({ date: key, sec: m[key] || 0 });
    }
    return out;
  }

  /* ---------- 知识点进度（一次性通关率）---------- */
  // 一次性通关率 = 第一次做就答对的题数 / 第一次做过的题数
  // 依赖 SRS.record 在首次作答时写入 rec.firstDone / rec.firstCorrect
  function statsFor(filterFn) {
    const s = Store.get();
    const qs = QUESTION_BANK.filter(q => (q.type==="single"||q.type==="multiple") && filterFn(q));
    let total = qs.length, firstSeen = 0, firstCorrect = 0, seen = 0, mastered = 0;
    qs.forEach(q => {
      const r = s.progress[q.id];
      if (r && r.seen > 0) seen++;
      if (r && r.firstDone) { firstSeen++; if (r.firstCorrect) firstCorrect++; }
      if (r && (r.level||0) >= 2) mastered++;
    });
    const passRate = firstSeen ? Math.round(firstCorrect/firstSeen*100) : null; // 一次性通关率
    return { total, seen, firstSeen, firstCorrect, passRate, mastered };
  }
  // 按章节统计（maxDiff 限定只统计难度≤maxDiff 的题，用于分阶段推进）
  function chapterStats(chapter, maxDiff) {
    return statsFor(q => q.chapter === chapter && (!maxDiff || (q.difficulty||1) <= maxDiff));
  }
  function moduleStats(module) { return statsFor(q => q.module === module); }
  // 当前阶段对应的难度上限：阶段1→只易题，阶段2→易+中，阶段3→全部
  function diffCap() { return Store.get().phase || 1; }

  // 掌握状态：未学 / 学习中 / 已掌握
  // 用"当前熟练度达标数"判断掌握（可通过复习达到），一次性通关率仅作展示。
  function status(st) {
    if (!st.seen) return { label: "未学", cls: "diff2" };
    // 已掌握：本章 ≥60% 的题达到熟练度2以上
    if (st.total && st.mastered >= Math.ceil(st.total * 0.6))
      return { label: "已掌握", cls: "diff1" };
    return { label: "学习中", cls: "diff3" };
  }

  /* ---------- 系统学习：当前章节（按当前阶段的难度上限推进）---------- */
  // 当前应学章节 = 大纲里第一个"该阶段难度内还没掌握、且还有题可做"的章节
  function currentChapterIndex() {
    const cap = diffCap();
    for (let i = 0; i < CURRICULUM.length; i++) {
      const st = chapterStats(CURRICULUM[i].chapter, cap);
      if (st.total > 0 && status(st).label !== "已掌握") return i;
    }
    return CURRICULUM.length - 1;
  }
  function currentChapter() { return CURRICULUM[currentChapterIndex()]; }

  // 当前阶段（难度上限内）是否所有章节都已掌握 → 可升级到下一阶段
  function phaseCleared() {
    const cap = diffCap();
    return CURRICULUM.every(c => {
      const st = chapterStats(c.chapter, cap);
      return st.total === 0 || status(st).label === "已掌握";
    });
  }

  /* ---------- 专项练习：不重复轮次 ---------- */
  // poolKey 例："mod:马哲" / "chap:唯物论" / "all" / "yati" / "wrong"
  function roundRec(key) {
    const s = Store.get();
    s.roundState = s.roundState || {};
    if (!s.roundState[key]) s.roundState[key] = { done: [], round: 1 };
    return s.roundState[key];
  }
  // 取本轮还没做过的题（若全做完→自动进入下一轮，重置）
  function nextBatch(key, poolQs, batchSize) {
    const rec = roundRec(key);
    let remaining = poolQs.filter(q => !rec.done.includes(q.id));
    if (remaining.length === 0 && poolQs.length > 0) {
      rec.done = []; rec.round += 1; Store.save();
      remaining = poolQs.slice();
    }
    return shuffle(remaining).slice(0, batchSize);
  }
  // 记一题为"本轮已做"（答完立即调用，保证中途退出不重做）
  function markDone(key, qid) {
    const rec = roundRec(key);
    if (!rec.done.includes(qid)) { rec.done.push(qid); Store.save(); }
  }
  function roundInfo(key, total) {
    const rec = roundRec(key);
    return { round: rec.round, done: rec.done.length, total };
  }
  function resetRound(key) {
    const s = Store.get();
    if (s.roundState && s.roundState[key]) { s.roundState[key] = { done: [], round: 1 }; Store.save(); }
  }

  function shuffle(a){const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}

  return {
    today, addSeconds, todaySeconds, totalSeconds, fmt, recentDays,
    statsFor, chapterStats, moduleStats, status, diffCap,
    currentChapterIndex, currentChapter, phaseCleared,
    nextBatch, markDone, roundInfo, resetRound
  };
})();
