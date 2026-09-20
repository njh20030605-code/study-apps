/* ============================================================
 * ai-features.js —— 六大 AI 智能功能的提示词与调用逻辑
 * 全部用简单中文、面向「初中政治水平、靠背」的考生。
 * ============================================================ */

const AIFeat = (function () {

  // 统一的「老师人设」系统提示
  const TUTOR_SYSTEM =
    "你是一位专门辅导『成人高考专升本·政治』的私人老师。你的学生基础薄弱（大约初中政治水平，主要靠理解后背诵），备考目标是150分里考到90分以上。" +
    "要求：①一律用简单的大白话中文，句子短；②多用生活化的类比和例子帮助理解；③讲政治理论时先说『人话』再说『术语』；④不堆砌，不跑题，紧扣考点；⑤鼓励但不啰嗦。";

  // 把一道客观题格式化成给 AI 的文本
  function formatQuestion(q, userAnswerIdx) {
    let t = `【题目】${q.stem}\n`;
    if (q.options && q.options.length) {
      q.options.forEach((op, i) => {
        t += `${String.fromCharCode(65 + i)}. ${op}\n`;
      });
    }
    // 正确答案
    let ans = "";
    if (Array.isArray(q.answer)) ans = q.answer.map(i => String.fromCharCode(65 + i)).join("");
    else if (typeof q.answer === "number") ans = String.fromCharCode(65 + q.answer);
    t += `【标准答案】${ans}\n`;
    if (q.explanation) t += `【已有解析】${q.explanation}\n`;
    if (userAnswerIdx !== undefined && userAnswerIdx !== null) {
      const ua = Array.isArray(userAnswerIdx)
        ? userAnswerIdx.map(i => String.fromCharCode(65 + i)).join("")
        : String.fromCharCode(65 + userAnswerIdx);
      t += `【我选的是】${ua}\n`;
    }
    return t;
  }

  // 1. 逐题深度解析（"讲到懂"模式）—— 首次讲解
  async function deepExplain(q, userAnswerIdx) {
    const prompt =
      formatQuestion(q, userAnswerIdx) +
      "\n请用简单中文给我讲这道题，按这个结构：\n" +
      "① 一句大白话说这题到底在考什么；\n" +
      "② 逐个选项分析（对的为什么对，错的为什么错、错在哪）；\n" +
      "③ 背后的核心知识点（要背的就是这句）；\n" +
      "④ 给一个好记的例子或口诀；\n" +
      "⑤ 最后问我一句『这样清楚吗？还有哪里不懂？』。\n" +
      "别太长，重点讲透。";
    return AI.chat([{ role: "user", content: prompt }], { system: TUTOR_SYSTEM, useStrong: false, maxTokens: 1000 });
  }

  // 逐题追问（把上下文一起带上）
  async function followUp(history) {
    // history: [{role, content}]，第一条通常是题目+首次讲解
    return AI.chat(history, { system: TUTOR_SYSTEM, useStrong: false, maxTokens: 900 });
  }

  // 2. 主观题批改（辨析/简答/论述）
  async function gradeSubjective(q, myAnswer) {
    let full = q.answer || "";
    let kp = (q.keyPoints || []).map((k, i) => `${i + 1}. ${k}`).join("\n");
    const prompt =
      `这是一道政治${q.type}题，满分按成考标准（辨析10分/简答10分/论述20分）。\n` +
      `【题目】${q.stem}\n` +
      `【参考答案】${full}\n` +
      `【采分点】\n${kp}\n\n` +
      `【我的作答】\n${myAnswer || "（空）"}\n\n` +
      "请你当阅卷老师：\n" +
      "① 先给一个估分（写清满分是多少，我得多少）；\n" +
      "② 对照采分点，指出我答到了哪些、漏了哪些（漏的要具体列出来）；\n" +
      "③ 给一版『踩点更全』的参考答案（分点写，方便我背）；\n" +
      "④ 用一句话指出我这类题反复容易漏的点，下次怎么改。\n" +
      "语言简单，像老师面批。";
    return AI.chat([{ role: "user", content: prompt }], { system: TUTOR_SYSTEM, useStrong: true, maxTokens: 1600 });
  }

  // 3. 错题诊断报告
  async function diagnose(wrongQs) {
    const list = wrongQs.map((q, i) => {
      let ans = Array.isArray(q.answer) ? q.answer.map(x => String.fromCharCode(65 + x)).join("") :
        (typeof q.answer === "number" ? String.fromCharCode(65 + q.answer) : "主观题");
      return `${i + 1}. [${q.module}/${q.topic}] ${q.stem.slice(0, 40)}… 正确答案:${ans}`;
    }).join("\n");
    const prompt =
      "下面是我最近做错的政治题（含模块和考点标签）：\n" + list + "\n\n" +
      "请帮我：\n" +
      "① 找出我反复出错的知识点『模式』（是哪几个模块/考点在拖后腿）；\n" +
      "② 针对最薄弱的 2-3 个考点，各讲一节简短的中文小课（大白话+口诀）；\n" +
      "③ 给出下一步复习的重点建议（先补哪、怎么补）。\n" +
      "简单直接，别客套。";
    return AI.chat([{ role: "user", content: prompt }], { system: TUTOR_SYSTEM, useStrong: true, maxTokens: 1800 });
  }

  // 4. 背诵陪练：就某考点提问、听复述、纠正补全
  async function reciteStart(topic) {
    const prompt =
      `我要背『${topic}』这个政治考点。请你当背诵陪练：\n` +
      "① 先用大白话把这个考点的要点讲一遍（要背的核心几句列清楚，最好带口诀）；\n" +
      "② 然后出 1 个问题考我，让我复述，等我回答。\n" +
      "一次别问太多，循序渐进。";
    return AI.chat([{ role: "user", content: prompt }], { system: TUTOR_SYSTEM, useStrong: false, maxTokens: 900 });
  }
  async function reciteContinue(history) {
    return AI.chat(history, { system: TUTOR_SYSTEM, useStrong: false, maxTokens: 800 });
  }

  // 5. AI 按需出题
  async function generate(topic, count) {
    const prompt =
      `请针对政治考点『${topic}』，现场出 ${count || 5} 道贴近成考专升本真题风格的题。\n` +
      "要求：\n" +
      "- 尽量出单选题（single）；难度有易有中；\n" +
      "- 每题都要有 options（4个）、正确答案、简单中文解析、逐项说明 optionNotes。\n" +
      "- 严格只输出一个 JSON 数组，不要有任何多余文字、不要用 markdown 代码块。\n" +
      "每个元素格式：\n" +
      `{"id":"gen-xxxx","module":"马哲或毛中特或时政","chapter":"章节","topic":"${topic}","type":"single","difficulty":1,"stem":"题干","options":["A","B","C","D"],"answer":0,"explanation":"大白话解析","optionNotes":["对/错:...","...","...","..."],"keyPoints":[]}`;
    const raw = await AI.chat([{ role: "user", content: prompt }], { system: TUTOR_SYSTEM, useStrong: true, maxTokens: 2500 });
    return parseJsonArray(raw);
  }

  // 6. 每日教练
  async function dailyCoach(summary) {
    const prompt =
      "这是我今天开始学习前的情况：\n" + summary + "\n" +
      "请用一两句中文告诉我今天的重点该抓什么、心态上注意啥。要短、要具体、能鼓励人。";
    return AI.chat([{ role: "user", content: prompt }], { system: TUTOR_SYSTEM, useStrong: false, maxTokens: 300 });
  }

  // 摸底测试后的个性化诊断
  async function placementDiagnose(summary) {
    const prompt =
      "我刚做完一套政治摸底测试，结果如下：\n" + summary + "\n\n" +
      "请你作为老师给我一份简短的中文诊断：\n" +
      "① 一句话总体评价我现在的水平；\n" +
      "② 我最强和最弱的模块分别是什么；\n" +
      "③ 接下来该怎么安排（先补哪个模块、用什么策略拿到90分）。\n" +
      "语气鼓励，别超过200字。";
    return AI.chat([{ role: "user", content: prompt }], { system: TUTOR_SYSTEM, useStrong: true, maxTokens: 600 });
  }

  // 7. 每日学习总结
  async function dailySummary(summary) {
    const prompt =
      "这是我今天的学习情况：\n" + summary + "\n\n" +
      "请用简单中文给我一段今日学习总结：\n" +
      "① 今天学/练了什么、表现如何（一句话）；\n" +
      "② 暴露出的薄弱点（具体到考点）；\n" +
      "③ 明天的重点建议（具体、可执行）；\n" +
      "④ 一句鼓励。\n" +
      "控制在 150 字内，亲切一点。";
    return AI.chat([{ role: "user", content: prompt }], { system: TUTOR_SYSTEM, useStrong: false, maxTokens: 500 });
  }

  // 8. 章节串讲（系统讲整章，解决碎片化）
  async function chapterLecture(title, points) {
    const prompt =
      `请给我系统串讲政治这一章：《${title}》。\n` +
      "本章要背的核心要点：\n" + (points||[]).map((p,i)=>`${i+1}. ${p}`).join("\n") + "\n\n" +
      "要求：\n" +
      "① 用大白话把这一章的知识串成一条线（讲清它们之间的关系，别一条条孤立地念）；\n" +
      "② 点出最容易考、最容易混的地方；\n" +
      "③ 给一套好记的口诀或框架帮我整章记住。\n" +
      "像老师上课一样，条理清楚、简单易懂。";
    return AI.chat([{ role: "user", content: prompt }], { system: TUTOR_SYSTEM, useStrong: true, maxTokens: 1600 });
  }

  // 9. AI 答疑（自由提问）
  async function ask(history) {
    return AI.chat(history, { system: TUTOR_SYSTEM, useStrong: false, maxTokens: 1000 });
  }

  // 从 AI 回复里尽量解析出 JSON 数组
  function parseJsonArray(raw) {
    let t = (raw || "").trim();
    // 去掉可能的代码块围栏
    t = t.replace(/^```(json)?/i, "").replace(/```$/,"").trim();
    const start = t.indexOf("[");
    const end = t.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("AI 返回格式无法解析");
    const arr = JSON.parse(t.slice(start, end + 1));
    if (!Array.isArray(arr)) throw new Error("AI 返回不是数组");
    return arr;
  }

  return {
    deepExplain, followUp, gradeSubjective, diagnose,
    reciteStart, reciteContinue, generate, dailyCoach, placementDiagnose,
    dailySummary, chapterLecture, ask,
    formatQuestion, TUTOR_SYSTEM
  };
})();
