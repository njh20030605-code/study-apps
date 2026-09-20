/* ============================================================================
 * srs.js —— 复习排程（真正的 FSRS，不是自己搓的近似）
 * 用的是 open-spaced-repetition/ts-fsrs（MIT），本地 vendored 在 fsrs.umd.js。
 *
 * 为什么用 FSRS 而不是艾宾浩斯固定间隔：
 *   固定间隔（1天/2天/4天/7天…）对所有词一视同仁，简单词浪费你时间，
 *   难词又复习不够。FSRS 给每个词单独算稳定度，该多看的多看。
 *   你每天 20 分钟是硬约束，所以调度效率直接决定能记住多少。
 * ==========================================================================*/
(function () {
  const F = window.FSRS;
  if (!F) { console.error("fsrs.umd.js 没加载上"); return; }

  // request_retention 0.9 = 目标保持率九成。再高会让复习量暴涨，20 分钟装不下。
  const params = F.generatorParameters({ enable_fuzz: true, request_retention: 0.9 });
  const engine = F.fsrs(params);

  const RATING = { again: F.Rating.Again, hard: F.Rating.Hard, good: F.Rating.Good, easy: F.Rating.Easy };

  /** 序列化：FSRS 的 card 里 due 是 Date，存 localStorage 要转字符串 */
  function pack(card) {
    return { ...card, due: new Date(card.due).toISOString() };
  }
  function unpack(o) {
    if (!o) return null;
    return { ...o, due: new Date(o.due) };
  }

  window.SRS = {
    RATING,
    newCard(now) { return pack(F.createEmptyCard(now || new Date())); },

    /** 评分并返回新的 card。rating: 'again'|'hard'|'good'|'easy' */
    grade(packed, rating, now) {
      const card = unpack(packed) || F.createEmptyCard(now || new Date());
      const out = engine.repeat(card, now || new Date());
      const r = RATING[rating] != null ? RATING[rating] : RATING.good;
      return pack(out[r].card);
    },

    /** 到期了吗 */
    isDue(packed, now) {
      if (!packed) return true;
      return new Date(packed.due).getTime() <= (now || new Date()).getTime();
    },

    /** 还有多久到期，给界面显示用 */
    dueInText(packed) {
      if (!packed) return "新";
      const ms = new Date(packed.due) - new Date();
      if (ms <= 0) return "待复习";
      const d = Math.round(ms / 86400000);
      if (d >= 1) return d + " 天后";
      const h = Math.round(ms / 3600000);
      if (h >= 1) return h + " 小时后";
      return "稍后";
    },

    /** 此刻还记得的概率 0..1 —— 这就是遗忘曲线本身。
     *  复习顺序按它升序排：最快要忘的先复习。 */
    retention(packed, now) {
      if (!packed || !packed.reps) return 0;
      try { return engine.get_retrievability(unpack(packed), now || new Date(), false); }
      catch (e) { return 0; }
    },

    /** FSRS 自己算的难度 1..10。反复答错会顶到 9 以上。
     *  ⚠️ 别用 card.lapses 判断「经常做错」——实测连续答错 5 次它还是 0，
     *     因为 FSRS 只把「学会之后又忘」算作 lapse。 */
    difficulty(packed) { return (packed && packed.difficulty) || 0; },

    /** 掌握程度：靠 stability（天）分四档，用来画统计 */
    level(packed) {
      if (!packed || !packed.reps) return 0;            // 没学过
      const s = packed.stability || 0;
      if (s < 3) return 1;                              // 刚认识
      if (s < 21) return 2;                             // 记住了
      return 3;                                         // 熟了
    },
  };
})();
