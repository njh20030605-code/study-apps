/* ============================================================================
 * essays-real.js —— 成考专升本英语 · 历年真题作文题（第Ⅵ部分 Writing，25 分）
 * ----------------------------------------------------------------------------
 * 2026-09-13 整理。⚠️ 真卷的写作题是：英文 Directions + 中文情景 + 中文要点，署名一律 Li Yuan。
 * 来源：aipta.com（2023/2024 原卷）、kuaishiedu.com（2021 原题）、hqwx.com（2016 原题）、
 *       233.com（2017 原题 / 2015 文字版）、eol.cn（2013-2015）、cwjedu.com（2020-2022 汇总）。
 * ⚠️ 年份归属网上有打架：「Prof. Smith 请假」多数站标 2022，个别站标 2018；这里按多数（2022）。
 * ⚠️ 2018 和 2025 两年没有找到可靠的原题文本（2025 只有需要手机号才能下的 PDF），暂缺——
 *    拿到原题后照下面格式加一条即可，页面自动多一个年份按钮。
 * ⚠️ 2019 只找到情景，没找到原卷的要点列表，points 留空并在 note 里说明，别自己编。
 * 字段：year / kind(essay|email|letter|notice) / situation(中文情景原文) / points[](要点原文)
 * ========================================================================== */
window.REAL_ESSAYS = [
  { year: 2024, kind: "letter",
    situation: "新学期伊始，你(Li Yuan)有意加入学校环保社团(Environmental Club)。请给该社团写一封申请信，内容包括：",
    points: ["个人情况介绍", "申请加入的原因", "你期望在社团中承担的工作", "你对社团发展的建议"] },
  { year: 2023, kind: "essay",
    situation: "你(Li Yuan)要参加一次英语征文比赛，题目为 My Favorite Photo。请写一篇短文参赛，内容包括：",
    points: ["拍照时间和地点", "照片中的人物或景物", "喜欢这张照片的原因"] },
  { year: 2022, kind: "email",
    situation: "你(Li Yuan)下周一因为要去参加演讲比赛，不能上外教(Prof. Smith)的写作课。请给他写一封 e-mail，内容包括：",
    points: ["请假并表示歉意", "解释不能上课的原因，如比赛的重要性", "承诺会自学所缺内容并按时交作业", "祝他愉快"],
    note: "个别网站把这题标成 2018 年" },
  { year: 2021, kind: "email",
    situation: "学校将组织一次英语演讲比赛，打算邀请外教(John)来做评委。请你(Li Yuan)给他写一封 e-mail，内容包括：",
    points: ["邀请他担任评委(judge)", "告知他比赛安排(如：时间、地点等)", "希望他赛后进行点评", "期待他能接受邀请"] },
  { year: 2020, kind: "email",
    situation: "你(Li Yuan)收到美国朋友 Thomas 的 e-mail，他在邮件中提到想来中国留学。请给他回一封 e-mail，内容包括：",
    points: ["欢迎他来中国留学", "推荐一所学校", "介绍该学校所在的城市", "表示愿意提供帮助"] },
  { year: 2019, kind: "email",
    situation: "你(Li Yuan)的美国朋友 Harry 在最近的 e-mail 中提到要带他的父母来华旅游，他们计划去黄山。请给他回一封 e-mail。",
    points: [],
    note: "这一年只查到情景，原卷的要点列表没找到可靠版本。按回信常规写：表示欢迎 → 介绍黄山 / 给出行程建议 → 表示愿意帮忙" },
  { year: 2017, kind: "email",
    situation: "你(Li Yuan)组织同学进行了一次烧烤野餐(barbecue)。请给你的英国朋友 Tim 写一封 e-mail，内容包括：",
    points: ["野餐前的准备", "野餐的过程", "印象最深的人或事"] },
  { year: 2016, kind: "notice",
    situation: "你(Li Yuan)是班长，准备周末组织全班同学参观历史博物馆。请根据以下提示写一个通知：",
    points: ["周六上午八点全班在校门口集合，乘公交汽车前往", "参观时，要认真听讲并记录重要内容",
             "遵守参观规定：馆内不得喧哗、拍照，勿带食品饮料入馆", "下周五之前交一份参观报告"] },
  { year: 2015, kind: "letter",
    situation: "你(Li Yuan)在英语学习中遇到了一些困难，希望得到帮助。请给你的英国笔友(Jason)写封信，内容包括：",
    points: ["介绍你学习英语的经历", "描述你在英语学习中遇到的困难", "希望笔友给你一些建议"] },
  { year: 2014, kind: "letter",
    situation: "你(Li Yuan)的班级即将组织一次郊游(picnic)，请你给你的外籍教师(Steve)写封信，内容包括：",
    points: ["邀请他参加此项活动", "介绍活动的具体安排和内容(如时间、地点等)", "告知需要做的准备(如着装、自备午餐等)", "希望他参加并尽快给予答复"] },
  { year: 2013, kind: "email",
    situation: "你(Li Yuan)收到朋友 Xiao Ming 的 e-mail，他在邮件中谈及买车计划。请在回信中说明你对买车的看法，内容包括：",
    points: ["私家车的好处(如舒适、便捷)", "私家车的弊端(如交通拥挤、环境污染、停车困难等)", "你的建议"] },
];
/* 还没录到的年份，页面上要明说，别让人以为「近十年就这些」 */
window.REAL_ESSAYS_MISSING = [2025, 2018];

/* 真卷 Directions 原句（按文体两种），以及给零基础考生看的中文翻译 */
window.ESSAY_DIRECTIONS = {
  essay:  { en: "For this part, you are supposed to write an essay in about 100-120 words based on the following situation. Remember to write it clearly.",
            zh: "本部分要求你根据下面的情景，写一篇 100–120 词左右的短文。字迹要清楚。" },
  email:  { en: "For this part, you are supposed to write an e-mail in about 100-120 words based on the following situation. Remember to write it clearly.",
            zh: "本部分要求你根据下面的情景，写一封 100–120 词左右的电子邮件。字迹要清楚。" },
  letter: { en: "For this part, you are supposed to write a letter in about 100-120 words based on the following situation. Remember to write it clearly.",
            zh: "本部分要求你根据下面的情景，写一封 100–120 词左右的信。字迹要清楚。" },
  notice: { en: "For this part, you are supposed to write a notice in about 100-120 words based on the following information. Remember to write it clearly.",
            zh: "本部分要求你根据下面的信息，写一则 100–120 词左右的通知。字迹要清楚。" },
};
