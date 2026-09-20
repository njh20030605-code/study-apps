/* ============================================================
 * dedupe.js —— 题库去重（同一道题只保留一份）
 * ------------------------------------------------------------
 * 题库由多个来源拼起来（基础题库/扩充/押题/6套模拟卷/4年真题），
 * 难免撞题。这里按"归一化题干"识别重复，每组只保留一份：
 *   优先级：历年真题 > 模拟卷 > 押题 > 普通题
 *   （同级则保留解析更详细的那条）
 * 被去掉的题不删除，只打 _dup=true 标记并移出 QUESTION_BANK，
 * 存到 window.QUESTION_DUPES 备查。
 * 必须在所有 questions*.js 之后、shuffle-options.js 之前加载。
 * ============================================================ */

(function () {
  const bank = window.QUESTION_BANK || [];

  // 归一化题干：去掉标点、空格、序号、引号，只比实质内容
  function norm(s) {
    return String(s || "")
      .replace(/[（）()【】\[\]“”"‘’',，。．\.、；;：:？?！!\s_—－\-·]/g, "")
      .replace(/[0-9０-９]+/g, "");
  }

  // 优先级分数：越大越优先保留
  function score(q) {
    let s = 0;
    if (q.zhenti) s += 1000;              // 历年真题最优先
    else if (q.mock) s += 500;            // 其次模拟卷
    else if (q.yati) s += 200;            // 再次押题
    s += Math.min(200, String(q.explanation || "").length);   // 解析越详细越好
    s += (q.optionNotes || []).join("").length / 10;          // 逐项说明越全越好
    return s;
  }

  const groups = {};
  bank.forEach(q => {
    if (q.type !== "single" && q.type !== "multiple") return;
    const k = norm(q.stem);
    if (!k) return;
    (groups[k] = groups[k] || []).push(q);
  });

  const dropped = [];
  Object.values(groups).forEach(g => {
    if (g.length < 2) return;
    g.sort((a, b) => score(b) - score(a));   // 分高的排前面
    g.slice(1).forEach(q => { q._dup = true; dropped.push(q); });
  });

  if (dropped.length) {
    const dropSet = new Set(dropped);
    window.QUESTION_BANK = bank.filter(q => !dropSet.has(q));
    window.QUESTION_DUPES = dropped;
    console.info("题库去重：移除重复题 " + dropped.length + " 道，剩余 " + window.QUESTION_BANK.length + " 道");
  }
})();
