/* ============================================================================
 * course.js —— 学习路线：一条线从头走到底，不跳级
 * ----------------------------------------------------------------------------
 * 用户定的规矩（2026-08-11）：前期一个板块一个板块慢慢打，基础题先做；
 * 跳着练看不懂解析也记不住。所以：
 *   第 1 章    地基热身：新概念1 范围的基础题，按主题分 8 节做熟（不上课，做题找手感）
 *   第 2-8 章  7 大考点：每章先上微课（lessons.js，一课一个套路+课后5题），
 *              章末一节「本章过关」混合练
 *   第 9 章    补全对话套路（题目自带解题思路）
 *   第 10 章   写作三模板（读懂+自己填一篇，手动标记完成）
 * 过关标准：讲课类 ≥60%，做题类 ≥70%——没过的节第二天还在原地，不往下走。
 * 「今天」页的主线任务就是路线的下一节；路线走完后才回到自由复习模式。
 * ========================================================================== */

window.COURSE_CH = {
  1: "第一章 地基热身",
  2: "第二章 非谓语动词",
  3: "第三章 定语从句",
  4: "第四章 时态",
  5: "第五章 虚拟语气",
  6: "第六章 倒装与强调",
  7: "第七章 主谓一致",
  8: "第八章 连词逻辑",
  9: "第九章 被动语态与名词从句",
  10: "第十章 比较级与反意疑问",
  11: "第十一章 固定搭配与词义辨析",
  12: "第十二章 补全对话套路",
  13: "第十三章 写作模板",
};

window.COURSE = [
  /* ---------- 第一章 地基热身：全部 level 1，按主题一节一节做熟 ---------- */
  { id: "A1", ch: 1, kind: "drill", level: 1, n: 8, title: "be 动词与一般现在时",
    topics: ["be-verb", "present-simple", "have-has"] },
  { id: "A2", ch: 1, kind: "drill", level: 1, n: 8, title: "名词复数与冠词 a / an / the",
    topics: ["article", "plural", "demonstrative"] },
  { id: "A3", ch: 1, kind: "drill", level: 1, n: 8, title: "代词：我你他 / 我的你的 / some 和 any",
    topics: ["pronoun", "possessive", "object-pronoun", "some-any"] },
  { id: "A4", ch: 1, kind: "drill", level: 1, n: 8, title: "介词：时间的 at / on / in，地点的 in / on / under",
    topics: ["preposition-time", "preposition-place"] },
  { id: "A5", ch: 1, kind: "drill", level: 1, n: 8, title: "疑问词与多少：what / how many / much",
    topics: ["question-word", "much-many", "few-little"] },
  { id: "A6", ch: 1, kind: "drill", level: 1, n: 8, title: "情态动词与祈使句：can / must / Be quiet",
    topics: ["modal-can", "modal-verb", "imperative", "adverb-frequency"] },
  { id: "A7", ch: 1, kind: "drill", level: 1, n: 8, title: "过去与将来：was / did / will",
    topics: ["past-be", "future-will", "past-continuous", "tense"] },
  { id: "A8", ch: 1, kind: "drill", level: 1, n: 8, title: "比较级与 there be",
    topics: ["comparative", "superlative", "there-be", "so-that", "conjunction"] },

  /* ---------- 第二章 非谓语动词：微课×3 + 章末过关 ---------- */
  { id: "U-P1L1", ch: 2, kind: "lesson", ref: "P1L1" },
  { id: "U-P1L2", ch: 2, kind: "lesson", ref: "P1L2" },
  { id: "U-P1L3", ch: 2, kind: "lesson", ref: "P1L3" },
  { id: "X1", ch: 2, kind: "drill", point: 1, maxLevel: 2, n: 10, title: "本章过关：非谓语混合 10 题" },

  /* ---------- 第三章 定语从句 ---------- */
  { id: "U-P2L1", ch: 3, kind: "lesson", ref: "P2L1" },
  { id: "U-P2L2", ch: 3, kind: "lesson", ref: "P2L2" },
  { id: "U-P2L3", ch: 3, kind: "lesson", ref: "P2L3" },
  { id: "X2", ch: 3, kind: "drill", point: 2, maxLevel: 2, n: 10, title: "本章过关：定语从句混合 10 题" },

  /* ---------- 第四章 时态 ---------- */
  { id: "U-P3L1", ch: 4, kind: "lesson", ref: "P3L1" },
  { id: "U-P3L2", ch: 4, kind: "lesson", ref: "P3L2" },
  { id: "U-P3L3", ch: 4, kind: "lesson", ref: "P3L3" },
  { id: "X3", ch: 4, kind: "drill", point: 3, maxLevel: 2, n: 10, title: "本章过关：时态混合 10 题" },

  /* ---------- 第五章 虚拟语气 ---------- */
  { id: "U-P4L1", ch: 5, kind: "lesson", ref: "P4L1" },
  { id: "U-P4L2", ch: 5, kind: "lesson", ref: "P4L2" },
  { id: "U-P4L3", ch: 5, kind: "lesson", ref: "P4L3" },
  { id: "X4", ch: 5, kind: "drill", point: 4, maxLevel: 2, n: 10, title: "本章过关：虚拟语气混合 10 题" },

  /* ---------- 第六章 倒装与强调 ---------- */
  { id: "U-P5L1", ch: 6, kind: "lesson", ref: "P5L1" },
  { id: "U-P5L2", ch: 6, kind: "lesson", ref: "P5L2" },
  { id: "U-P5L3", ch: 6, kind: "lesson", ref: "P5L3" },
  { id: "X5", ch: 6, kind: "drill", point: 5, maxLevel: 2, n: 10, title: "本章过关：倒装强调混合 10 题" },

  /* ---------- 第七章 主谓一致 ---------- */
  { id: "U-P6L1", ch: 7, kind: "lesson", ref: "P6L1" },
  { id: "U-P6L2", ch: 7, kind: "lesson", ref: "P6L2" },
  { id: "U-P6L3", ch: 7, kind: "lesson", ref: "P6L3" },
  { id: "U-P6L4", ch: 7, kind: "lesson", ref: "P6L4" },
  { id: "X6", ch: 7, kind: "drill", point: 6, maxLevel: 2, n: 10, title: "本章过关：主谓一致混合 10 题" },

  /* ---------- 第八章 连词逻辑 ---------- */
  { id: "U-P7L1", ch: 8, kind: "lesson", ref: "P7L1" },
  { id: "U-P7L2", ch: 8, kind: "lesson", ref: "P7L2" },
  { id: "U-P7L3", ch: 8, kind: "lesson", ref: "P7L3" },
  { id: "X7", ch: 8, kind: "drill", point: 7, maxLevel: 2, n: 10, title: "本章过关：连词逻辑混合 10 题" },

  /* ---------- 以下三章是 2026-08-16 补的：题库里有题、真题也考，
       但原来 21 节微课一节都没教到。用户原话「你觉得后面没学的、需要加的也加」。
       章末过关用 frames 选题（这些考点不在策略的 7 大 point 编号里）。 ---------- */

  /* ---------- 第九章 被动语态 / 名词性从句 ---------- */
  { id: "U-P8L1", ch: 9, kind: "lesson", ref: "P8L1" },
  { id: "U-P8L2", ch: 9, kind: "lesson", ref: "P8L2" },
  { id: "X8", ch: 9, kind: "drill", frames: ["ex-passive", "ex-nounclause"], maxLevel: 2, n: 10,
    title: "本章过关：被动 + 名词从句混合 10 题" },

  /* ---------- 第十章 比较级 / 反意疑问 ---------- */
  { id: "U-P8L3", ch: 10, kind: "lesson", ref: "P8L3" },
  { id: "U-P8L4", ch: 10, kind: "lesson", ref: "P8L4" },
  { id: "X9", ch: 10, kind: "drill", frames: ["ex-comparative", "ex-tag"], maxLevel: 2, n: 10,
    title: "本章过关：比较级 + 反意疑问混合 10 题" },

  /* ---------- 第十一章 固定搭配 / 词义辨析（真题里占语法分近三成）---------- */
  { id: "U-P9L1", ch: 11, kind: "lesson", ref: "P9L1" },
  { id: "U-P9L2", ch: 11, kind: "lesson", ref: "P9L2" },
  { id: "X10", ch: 11, kind: "drill", frames: ["ex-colloc", "ex-wordchoice"], maxLevel: 2, n: 12,
    title: "本章过关：搭配 + 辨析混合 12 题" },

  /* ---------- 第十二章 补全对话套路（题目上方自带解题思路） ---------- */
  { id: "D1", ch: 12, kind: "cue", n: 8, title: "带思路练（上）：回应感谢 / 道歉 / 邀请" },
  { id: "D2", ch: 12, kind: "cue", n: 8, title: "带思路练（下）：问句与给信息" },

  /* ---------- 第十三章 写作模板（读懂 + 自己填一篇，回路线页点完成） ---------- */
  { id: "T1", ch: 13, kind: "template", tpl: "letter",   title: "书信通用模板" },
  { id: "T2", ch: 13, kind: "template", tpl: "argument", title: "议论 / 看法模板" },
  { id: "T3", ch: 13, kind: "template", tpl: "notice",   title: "通知模板" },
];
