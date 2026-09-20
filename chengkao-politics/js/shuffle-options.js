/* ============================================================
 * shuffle-options.js —— 选项打乱（消除"正确答案总在A"的偏差）
 * ------------------------------------------------------------
 * 题库里很多题的正确项都排在第一位(A)，直接刷会养成"闭眼选A"的坏习惯。
 * 这里在题库加载后，对每道客观题把选项顺序打乱，并同步重排
 * answer(正确项下标) 和 optionNotes(逐项解析)，保证对应关系不变。
 * 打乱用"按题目 id 确定的伪随机"，所以：
 *   - 同一道题每次打开顺序固定（错题本/复习引用稳定、不会每次乱跳）；
 *   - 但整体不再扎堆 A，接近真实考试。
 * 必须在所有 questions*.js 之后、渲染之前加载。
 * ============================================================ */

(function () {
  // 简单字符串哈希 → 32位种子
  function hash(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  // mulberry32 伪随机（同种子必得同序列）
  function prng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const bank = window.QUESTION_BANK || [];
  bank.forEach(function (q) {
    if (q._shuffled) return;
    if (q.type !== "single" && q.type !== "multiple") return;
    if (!Array.isArray(q.options) || q.options.length < 2) return;

    const n = q.options.length;
    const order = [];
    for (let i = 0; i < n; i++) order.push(i);

    // Fisher-Yates，用 id 作种子（无 id 则用题干）
    const rnd = prng(hash(String(q.id || q.stem || Math.random())));
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const t = order[i]; order[i] = order[j]; order[j] = t;
    }

    // order[displayIdx] = 原下标；构造 原下标→新显示下标 的映射
    const posOf = {};
    order.forEach(function (orig, disp) { posOf[orig] = disp; });

    const newOptions = order.map(function (i) { return q.options[i]; });
    const newNotes = (Array.isArray(q.optionNotes) && q.optionNotes.length === n)
      ? order.map(function (i) { return q.optionNotes[i]; })
      : q.optionNotes;

    let newAnswer;
    if (Array.isArray(q.answer)) {
      newAnswer = q.answer.map(function (a) { return posOf[a]; }).sort(function (a, b) { return a - b; });
    } else if (typeof q.answer === "number") {
      newAnswer = posOf[q.answer];
    } else {
      newAnswer = q.answer; // 主观题等，不动
    }

    q.options = newOptions;
    q.optionNotes = newNotes;
    q.answer = newAnswer;
    q._shuffled = true;
  });
})();
