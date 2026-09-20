/* ============================================================================
 * content.js  ——  讲解卡、写作模板、会话陪练场景（可自行增改）
 * ========================================================================== */

/* -------- 语法/知识点讲解卡（先看卡，再做题） -------- */
window.KNOWLEDGE_CARDS = [
  {
    id: "kc-subjunctive",
    topic: "subjunctive",
    title: "虚拟语气（最高频，务必吃透）",
    rule: "虚拟语气就是“说一件不真实/假设/建议要求的事”。最常考三种固定情况：",
    points: [
      "① 建议/要求/命令类词后面：suggest / insist / demand / request / order / important / necessary that + (should) + 动词原形。should 常常省略。",
      "② would rather + 从句 → 从句用过去式表示对现在/将来的虚拟：I'd rather you didn't go.（我宁愿你别去）",
      "③ 对过去的虚拟：if / but for / without ... , 主句用 would have done。But for your help, I would have failed.（要不是你帮忙，我就挂了）",
    ],
    examples: [
      { en: "It is necessary that he (should) be here.", zh: "他有必要到这儿来。（省略 should，用原形 be）" },
      { en: "The boss demanded that the report (should) be finished today.", zh: "老板要求报告今天完成。" },
      { en: "If only I had studied harder!", zh: "要是我当时更用功就好了！（对过去的遗憾）" },
    ],
  },
  {
    id: "kc-conjunction",
    topic: "conjunction",
    title: "连词辨析（完形、语法都常考）",
    rule: "看空前后两句是什么逻辑关系，选对应的连词：",
    points: [
      "转折（但是）：but / yet / however / though",
      "因果（因为/所以）：because / since / so / therefore",
      "条件（如果/除非）：if / unless(除非) / provided / as long as / in case(以防)",
      "让步（尽管）：though / although / even if",
    ],
    examples: [
      { en: "Take an umbrella in case it rains.", zh: "带把伞以防下雨。（in case = 以防万一）" },
      { en: "Unless you hurry, you'll miss the bus.", zh: "除非你快点，否则会误了车。（unless = 如果不）" },
    ],
  },
  {
    id: "kc-relative",
    topic: "relative-clause",
    title: "定语从句（which / that / where / whose）",
    rule: "先看先行词是人还是物，再看从句缺不缺主语/宾语：",
    points: [
      "先行词是物 → which / that；是人 → who / that",
      "从句缺“地点状语”（不缺主宾）→ where；缺“时间”→ when",
      "表示“…的”（所属）→ whose",
      "口诀：缺主宾用 which/that/who，缺状语用 where/when。",
    ],
    examples: [
      { en: "This is the house where I was born.", zh: "这是我出生的房子。（缺“在这里”→ where）" },
      { en: "The man who is talking is my teacher.", zh: "正在说话的男人是我老师。（缺主语 → who）" },
    ],
  },
  {
    id: "kc-inversion",
    topic: "inversion",
    title: "倒装句（否定词/Not only 开头）",
    rule: "当否定词或 Not only 放到句首，句子要“部分倒装”：把助动词/be 提到主语前面。",
    points: [
      "Not only did he ..., but he also ...（不仅…而且…）",
      "Never / Hardly / Seldom 开头 → 后面倒装：Never have I seen ...",
      "表示“某人也如此”：肯定用 So + 助动词 + 主语；否定用 Neither/Nor + 助动词 + 主语。",
    ],
    examples: [
      { en: "Not only did she sing, but she also danced.", zh: "她不仅唱了歌，还跳了舞。" },
      { en: "—I can't swim. —Neither can I.", zh: "—我不会游泳。—我也不会。" },
    ],
  },
  {
    id: "kc-nonfinite",
    topic: "non-finite",
    title: "非谓语：-ing 还是 -ed？",
    rule: "-ing 表示“主动/令人…”，-ed 表示“被动/感到…”。这是最常考的点。",
    points: [
      "形容事物“令人…”用 -ing：interesting, exciting, moving, boring。",
      "形容人“感到…”用 -ed：interested, excited, moved, bored。",
      "The film is moving.（电影令人感动）/ I am moved.（我感到感动）",
    ],
    examples: [
      { en: "The news is surprising; we are all surprised.", zh: "这消息令人吃惊；我们都很吃惊。" },
    ],
  },
  {
    id: "kc-cloze-skill",
    topic: "cloze",
    title: "完形填空技巧",
    rule: "别一上来就填空。先花 30 秒读完整段，抓住大意，再逐空判断。",
    points: [
      "① 先通读全文抓大意（讲什么事、什么态度）。",
      "② 逻辑连词题：看前后句关系（转折 but/however、因果 so/because、并列 and）。",
      "③ 词义辨析题：看上下文搭配，别只看单个空。",
      "④ 拿不准时，选“读起来最顺、最符合上下文”的那个。",
    ],
    examples: [
      { en: "He is poor, but he is happy.", zh: "他穷，但快乐。（前后相反 → but）" },
    ],
  },
  {
    id: "kc-reading-skill",
    topic: "reading",
    title: "阅读理解策略（省时拿分）",
    rule: "不用全读懂！先看题目，带着问题回原文找答案。",
    points: [
      "① 先读题干和选项，圈出关键词（人名、地点、数字）。",
      "② 回原文用关键词定位，找到那一句。",
      "③ 细节题：答案常是原句换个说法；主旨题：看首段和末段；词义题：看上下文。",
      "④ NOT true 题：把四个选项逐一回原文核对，找“和原文不符”的那个。",
    ],
    examples: [
      { en: "Question asks 'Where...' → find the place word in the text.", zh: "问“在哪里”，回原文找地点词。" },
    ],
  },
];

/* -------- 写作模板（可背 + 挖空默写 + 范文，各配 AI 批改） -------- */
window.WRITING_TEMPLATES = [
  {
    id: "wt-letter",
    title: "A · 书信类（祝贺信 / 邀请信）",
    scene: "考试最常考。祝贺、邀请、感谢都用这个框架。",
    template:
`Dear ___,
I am delighted / writing to ___ (congratulate you on... / invite you to...).
[中间 2–3 句：说清楚具体的事，比如“听说你考上了研究生”“周六有个聚会”]
I wish you... / I hope you can...
                                        Yours,
                                        [署名]`,
    sample:
`Dear Li Ming,
I am writing to congratulate you on winning the master's degree of computer science from Fudan University. I am really happy for you when I heard the good news.
You have worked so hard these years, and you truly deserve it. I believe you will make greater progress in your future study and research.
I wish you every success in the days to come.
                                        Yours,
                                        Wang Gang`,
    // 挖空默写：把关键句挖掉，让用户默写
    cloze:
`Dear Li Ming,
I am writing to ______ you on winning the master's degree.
I am really ______ for you when I heard the good news.
You have worked so hard, and you truly ______ it.
I ______ you every success in the days to come.
                                        Yours,
                                        Wang Gang`,
    clozeAnswers: ["congratulate", "happy", "deserve", "wish"],
  },
  {
    id: "wt-diary",
    title: "B · 日记类",
    scene: "记一天的事，按早→午→晚时间顺序写。",
    template:
`[日期]  [天气 fine / cloudy / rainy]
Today I ... [早上做了什么 → 中午 → 晚上，2–3 件事，按时间顺序]
Before we knew it, it was time to say good-bye. We had a wonderful day.`,
    sample:
`June 12th   Fine
Today I went to the park with my classmates. In the morning we took many photos and enjoyed the beautiful flowers. At noon we had a picnic on the grass and shared our food. In the afternoon we played games together and laughed a lot.
Before we knew it, it was time to say good-bye. We had a wonderful day.`,
    cloze:
`June 12th   Fine
Today I went to the park with my classmates. In the ______ we took many photos. At ______ we had a picnic on the grass. In the ______ we played games together.
Before we knew it, it was time to say ______. We had a wonderful day.`,
    clozeAnswers: ["morning", "noon", "afternoon", "good-bye"],
  },
  {
    id: "wt-argument",
    title: "C · 议论文（三段式）",
    scene: "如 Why Should We Learn English、Failure and Success 这类。",
    template:
`第1段（现象/观点）：Nowadays, ... has become ...
第2段（原因/展开）：First, ... Second, ... For example, ...
第3段（结论）：In a word / Therefore, ...`,
    sample:
`Nowadays, English has become more and more important in our life. Many people are trying hard to learn it well.
There are several reasons. First, English is widely used all over the world, so it helps us communicate with others. Second, knowing English can bring us better jobs and chances. For example, a lot of good companies need people who can speak English.
In a word, learning English is really useful. Therefore, we should study it hard and never give up.`,
    cloze:
`Nowadays, English has become more and more ______ in our life.
There are several reasons. ______, English is widely used all over the world. ______, knowing English can bring us better jobs. For ______, many good companies need people who can speak English.
In a word, learning English is really useful. ______, we should study it hard.`,
    clozeAnswers: ["important", "First", "Second", "example", "Therefore"],
  },
];

/* -------- AI 对话陪练场景 -------- */
window.CONV_SCENES = [
  { id: "cs-ask-way", title: "问路 Asking the way", desc: "你在街上迷路了，向 AI（路人）问怎么去火车站。" },
  { id: "cs-book", title: "订票 Booking a ticket", desc: "你想订一张明天去北京的火车票，AI 扮演售票员。" },
  { id: "cs-doctor", title: "看病 Seeing a doctor", desc: "你感冒了，AI 扮演医生，问你哪里不舒服。" },
  { id: "cs-restaurant", title: "点餐 In a restaurant", desc: "你在餐厅点餐，AI 扮演服务员。" },
  { id: "cs-shopping", title: "购物 Shopping", desc: "你想买一件衬衫，AI 扮演店员。" },
];
