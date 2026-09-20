/* ============================================================================
 * dialog-sets.js —— 补全对话的【真卷原始 8 选 5】
 * ----------------------------------------------------------------------------
 * 为什么要这个文件（2026-09-12 用户提的）：
 *   真卷上的补全对话是 **8 选 5** —— 上面一个方框列 A~H 八个选项，下面一段对话挖 5 个空，
 *   从八个里挑五个填进去，选项**不重复使用**。
 *   题库里为了能复用「四选一 + 每题解析」的引擎，把它改编成了每空四选一（adapted:true），
 *   练习时更好讲，但**跟考场上看到的卷子不是一回事**。
 *   所以：练习模式仍走四选一（有解析、有选项注释），**模考模式走这里的原始 8 选 5**。
 *
 * 字段：passageId → { options: [8 个选项，顺序即 A~H], answers: { 题目id: 该选项在 8 个里的下标 } }
 * 八个选项的顺序照抄原卷 A~H，别重排——考场上看到的就是这个顺序。
 * ⚠️ 改动后跑一遍自检：每个 answers 指向的文本，必须等于该题四选一里的正确项。
 * ========================================================================== */

window.DIALOG_SETS = {
  /* 全真模拟(一) · 周末看篮球赛 */
  "mk1dlg": {
    options: ["What about making it a little earlier", "I have no idea", "Let's go together",
              "Thank you all the same", "Do you like basketball", "When and where shall we meet",
              "What are you going to do", "It doesn't matter"],
    answers: { "mk1-cv-56": 1, "mk1-cv-57": 4, "mk1-cv-58": 2, "mk1-cv-59": 5, "mk1-cv-60": 0 },
  },
  /* 全真模拟(二) · 约见 Mr. Smith */
  "M2-conv": {
    options: ["Yes, he does", "Would 9:30 be convenient", "Can I help you", "this is my name card",
              "out on business today", "It won't be long",
              "make an appointment to see him sometime next week", "How long will it be"],
    answers: { "mk2-56": 2, "mk2-57": 4, "mk2-58": 6, "mk2-59": 1, "mk2-60": 3 },
  },
  /* 全真模拟(三) · 航空公司确认座位 */
  "M3-conv": {
    options: ["Hold the line", "flight number", "ask a question", "To New York",
              "May I have your name", "reconfirm my seat", "please check in", "On May 11th"],
    answers: { "mk3-56": 5, "mk3-57": 1, "mk3-58": 7, "mk3-59": 0, "mk3-60": 6 },
  },
  /* 全真模拟(四) · 聊运动和电影 */
  "M4-conv": {
    options: ["I enjoy P.E. at school", "I like basketball", "What kind of movies do you like, then",
              "Because it's exciting", "It's an action movie and it's interesting",
              "Oh, I like comedies, too", "Sorry. I don't. I want to go to a movie",
              "I don't like watching movies"],
    answers: { "mk4-56": 3, "mk4-57": 6, "mk4-58": 4, "mk4-59": 2, "mk4-60": 5 },
  },
  /* 全真模拟(五) · 约野餐 */
  "M5-conv": {
    options: ["I'll say I did", "Wonderful", "Yes, it was", "That's a good idea",
              "You'd better buy some fruit and sandwiches", "What kind of fruit do you like",
              "How about 6 o'clock in the morning", "I'll be there"],
    answers: { "mk5-56": 3, "mk5-57": 1, "mk5-58": 4, "mk5-59": 5, "mk5-60": 6 },
  },
  /* 2023 真题 · 酒店办入住 */
  "R23-conv": {
    options: ["I have a reservation", "How do you do", "What's the name, please", "Here you are",
              "How may I help you", "I have a very nice stay here", "Did you have a pleasant trip",
              "May I see your ID, please"],
    answers: { "r23-56": 4, "r23-57": 0, "r23-58": 2, "r23-59": 7, "r23-60": 3 },
  },
  /* 2024 真题 · 访客等候会面 */
  "R24-conv": {
    options: ["What do you want?", "Could you be waiting here?", "Mr. Long is still in a meeting.",
              "I don't drink coffee.", "You're welcome.", "Mr. Long will be back tomorrow.",
              "Just water, please.", "Can I help you?"],
    answers: { "r24-56": 7, "r24-57": 2, "r24-58": 1, "r24-59": 6, "r24-60": 4 },
  },
};
