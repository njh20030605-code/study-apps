/* ============================================================
 * srs.js —— 间隔重复 / 记忆曲线（参考 Ebbinghaus 遗忘曲线，
 *            规则类似「不背单词」/Anki）
 * ------------------------------------------------------------
 * 每题一个「熟练度 level」（0–5）。答对→升级、间隔越拉越长（阶梯）；
 * 答错→打回 L0＝次日复习。再加随机抖动，把同一天做的题错开到不同日子，
 * 避免第二天全堆到一块。
 *   L0 答错/刚学错 → 次日（约 1 天后）复习
 *   L1 首次答对    → 约 3 天后
 *   L2            → 约 7 天后
 *   L3            → 约 15 天后
 *   L4            → 约 30 天后
 *   L5 记牢了     → 约 60 天后
 * ============================================================ */

const SRS = (function () {
  const MIN = 60 * 1000;
  const DAY = 24 * 60 * MIN;
  // 记忆曲线阶梯（天）：答错→回到 L0=次日复习；答对→逐级拉长（首次答对直接到 L1=3天）
  const INTERVALS = [1 * DAY, 3 * DAY, 7 * DAY, 15 * DAY, 30 * DAY, 60 * DAY];
  const MAXLV = INTERVALS.length - 1; // 5

  function now() { return Date.now(); }

  // 取某题的进度记录（没有则新建）
  function rec(qid) {
    const s = Store.get();
    if (!s.progress[qid]) {
      s.progress[qid] = { level: 0, seen: 0, correct: 0, wrong: 0, lastTs: 0, nextTs: 0,
                          firstDone: false, firstCorrect: false };
    }
    return s.progress[qid];
  }

  // 记录一次作答结果，更新熟练度与下次复习时间（记忆曲线核心）
  function record(qid, isCorrect) {
    const s = Store.get();
    const r = rec(qid);
    // 记录"一次性通关"：仅在这道题第一次作答时记
    if (!r.firstDone) { r.firstDone = true; r.firstCorrect = !!isCorrect; }
    r.seen += 1;
    if (isCorrect) {
      r.correct += 1;
      r.level = Math.min(MAXLV, r.level + 1);   // 答对：升级，间隔拉长（首次答对→L1=3天，之后 7/15/30/60）
    } else {
      r.wrong += 1;
      r.level = 0;                               // 答错：打回 L0＝次日复习
      if (!s.wrongBook.includes(qid)) s.wrongBook.push(qid);
    }
    r.lastTs = now();
    // 乘 0.85~1.15 的随机抖动：把同一天做的题错开到不同日子，避免第二天全堆一块
    r.nextTs = now() + Math.round(INTERVALS[r.level] * (0.85 + 0.3 * Math.random()));
    s.stats.totalAnswered += 1;
    if (isCorrect) s.stats.totalCorrect += 1;
    Store.save();
  }

  // 某题现在是否「到期该复习」
  function isDue(qid) {
    const s = Store.get();
    const r = s.progress[qid];
    if (!r || r.seen === 0) return false; // 没做过的不算「复习」，算「新题」
    return now() >= r.nextTs;
  }

  function isNew(qid) {
    const s = Store.get();
    const r = s.progress[qid];
    return !r || r.seen === 0;
  }

  function level(qid) {
    const s = Store.get();
    return s.progress[qid] ? s.progress[qid].level : 0;
  }

  // 所有「到期该复习」的客观题（按到期时间早的排前）
  function dueQuestions() {
    const s = Store.get();
    return window.QUESTION_BANK
      .filter(q => (q.type === "single" || q.type === "multiple") && isDue(q.id))
      .sort((a, b) => (s.progress[a.id].nextTs) - (s.progress[b.id].nextTs));
  }
  function dueCount() { return dueQuestions().length; }

  // 距离下一批复习到期还有多久（人话），没有则 null
  function nextDueText() {
    const s = Store.get();
    let min = Infinity;
    Object.keys(s.progress).forEach(id => {
      const r = s.progress[id];
      if (r && r.seen > 0 && r.nextTs > now()) min = Math.min(min, r.nextTs);
    });
    if (min === Infinity) return null;
    const hrs = (min - now()) / (60 * MIN);
    if (hrs < 1) return "不到 1 小时后";
    if (hrs < 24) return Math.round(hrs) + " 小时后";
    return Math.round(hrs / 24) + " 天后";
  }

  return { record, isDue, isNew, level, rec, dueQuestions, dueCount, nextDueText, INTERVALS };
})();
