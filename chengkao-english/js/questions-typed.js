/* ============================================================================
 * questions-typed.js  ——  输入题（自己敲答案，加深印象）
 * 两种新题型：
 *   type: "fill"     填空 —— stem 里的 ____ 处，你输入答案（如把动词变对形式）
 *   type: "rewrite"  句型改写 —— 按 prompt 要求，输入改写后的整句
 * 字段：prompt(要求) / stem(原题) / answers(可接受答案数组,判分时忽略大小写和末尾标点)
 *       / explanation。答对自动判对；和参考答案不完全一样时可自评或让 AI 判分。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* ------------------------------ 填空 fill -------------------------------- */
{
  id: "tf-01", level: 1, module: "grammar", topic: "present-perfect", type: "fill",
  prompt: "用括号里动词的正确形式填空（现在完成时）：",
  stem: "She ____ (live) in Beijing since 2015.",
  answers: ["has lived", "has been living"],
  explanation: "since 2015（自 2015 起一直到现在）用现在完成时。主语 she → has + 过去分词 lived。",
},
{
  id: "tf-02", level: 1, module: "grammar", topic: "present-perfect", type: "fill",
  prompt: "用括号里动词的正确形式填空：",
  stem: "I ____ (finish) my homework already.",
  answers: ["have finished"],
  explanation: "already（已经）是现在完成时标志。主语 I → have + 过去分词 finished。",
},
{
  id: "tf-03", level: 2, module: "grammar", topic: "past-continuous", type: "fill",
  prompt: "用括号里动词的正确形式填空：",
  stem: "When you called me, I ____ (cook) dinner.",
  answers: ["was cooking"],
  explanation: "你打电话来（短动作）时我正在做饭（进行中）→ 过去进行时 was + cooking。",
},
{
  id: "tf-04", level: 2, module: "grammar", topic: "past-perfect", type: "fill",
  prompt: "用括号里动词的正确形式填空：",
  stem: "By the time we got there, the film ____ (begin).",
  answers: ["had begun", "had already begun"],
  explanation: "到我们到那儿（过去）之前，电影就已经开始了（更早的过去）→ 过去完成时 had + 过去分词 begun。",
},
{
  id: "tf-05", level: 1, module: "grammar", topic: "passive", type: "fill",
  prompt: "用括号里动词的正确形式填空（被动语态）：",
  stem: "This letter ____ (write) by Tom yesterday.",
  answers: ["was written"],
  explanation: "信是“被写”的（by Tom），yesterday 是过去 → 一般过去时被动 was + 过去分词 written。",
},
{
  id: "tf-06", level: 2, module: "grammar", topic: "passive", type: "fill",
  prompt: "用括号里动词的正确形式填空（被动语态）：",
  stem: "English ____ (speak) in many countries.",
  answers: ["is spoken"],
  explanation: "英语是“被说”的 → 一般现在时被动 is + 过去分词 spoken。",
},
{
  id: "tf-07", level: 1, module: "grammar", topic: "comparative", type: "fill",
  prompt: "用括号里词的正确形式填空（比较级）：",
  stem: "An elephant is ____ (big) than a dog.",
  answers: ["bigger"],
  explanation: "than 前用比较级。big 重读闭音节，双写 g 加 er → bigger。",
},
{
  id: "tf-08", level: 2, module: "grammar", topic: "superlative", type: "fill",
  prompt: "用括号里词的正确形式填空（最高级）：",
  stem: "This is the ____ (interesting) book I have ever read.",
  answers: ["most interesting"],
  explanation: "the + 最高级。interesting 是长单词，最高级用 most → the most interesting。",
},
{
  id: "tf-09", level: 1, module: "grammar", topic: "present-simple", type: "fill",
  prompt: "用括号里动词的正确形式填空：",
  stem: "He ____ (go) to school by bike every day.",
  answers: ["goes"],
  explanation: "every day 是一般现在时。主语 he 第三人称单数 → 动词加 es → goes。",
},
{
  id: "tf-10", level: 2, module: "grammar", topic: "used-to", type: "fill",
  prompt: "填入 used to 的正确形式（表示过去有、现在没有）：",
  stem: "There ____ a small river here, but it dried up long ago.",
  answers: ["used to be"],
  explanation: "there used to be = 过去曾经有（现在没有了）。填 used to be。",
},

/* ------------------------------ 改写 rewrite ----------------------------- */
{
  id: "tr-01", level: 2, module: "grammar", topic: "passive", type: "rewrite",
  prompt: "把下面的句子改写成被动语态：",
  stem: "People speak English all over the world.",
  answers: ["english is spoken all over the world", "english is spoken all over the world by people"],
  explanation: "主动变被动：宾语 English 提前作主语，speak → is spoken（一般现在被动），原主语 people 可用 by people 或省略。→ English is spoken all over the world.",
},
{
  id: "tr-02", level: 1, module: "grammar", topic: "passive", type: "rewrite",
  prompt: "把下面的句子改写成被动语态：",
  stem: "Tom broke the window.",
  answers: ["the window was broken by tom", "the window was broken"],
  explanation: "宾语 the window 提前，broke → was broken（一般过去被动），加 by Tom。→ The window was broken by Tom.",
},
{
  id: "tr-03", level: 2, module: "grammar", topic: "present-perfect", type: "rewrite",
  prompt: "把下面的句子改写成现在完成时：",
  stem: "I saw this movie.",
  answers: ["i have seen this movie", "i've seen this movie"],
  explanation: "现在完成时 = have + 过去分词。saw → have seen。→ I have seen this movie.",
},
{
  id: "tr-04", level: 2, module: "grammar", topic: "present-perfect", type: "rewrite",
  prompt: "用 since 把两句合成一句（现在完成时）：",
  stem: "He moved here in 2019. He still lives here.",
  answers: ["he has lived here since 2019", "he has been here since 2019", "he's lived here since 2019", "he's been here since 2019", "he has been living here since 2019", "he's been living here since 2019"],
  explanation: "从 2019 一直住到现在 → 现在完成时 + since 时间点。→ He has lived here since 2019.",
},
{
  id: "tr-05", level: 2, module: "grammar", topic: "relative-clause", type: "rewrite",
  prompt: "用定语从句（who）把两句合成一句：",
  stem: "The girl is my sister. She is singing.",
  answers: ["the girl who is singing is my sister", "the girl who's singing is my sister"],
  explanation: "用 who 代替 She，把“正在唱歌”作定语修饰 the girl。→ The girl who is singing is my sister.",
},
{
  id: "tr-06", level: 1, module: "grammar", topic: "comparative", type: "rewrite",
  prompt: "用 than 把两句合成一个比较级句子：",
  stem: "Tom is tall. Jack is not so tall.",
  answers: ["tom is taller than jack"],
  explanation: "Tom 更高 → 比较级 + than。tall → taller。→ Tom is taller than Jack.",
},
{
  id: "tr-07", level: 1, module: "grammar", topic: "present-perfect", type: "rewrite",
  prompt: "把下面的句子改写成一般疑问句：",
  stem: "She has finished her homework.",
  answers: ["has she finished her homework"],
  explanation: "现在完成时变疑问句：把 has 提到主语前。→ Has she finished her homework?",
},
{
  id: "tr-08", level: 1, module: "grammar", topic: "present-continuous", type: "rewrite",
  prompt: "把下面的句子改写成否定句：",
  stem: "They are watching TV.",
  answers: ["they are not watching tv", "they aren't watching tv"],
  explanation: "含 be 动词(are)的句子变否定：are 后面加 not。→ They are not (aren't) watching TV.",
},

]);
