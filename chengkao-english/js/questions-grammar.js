/* ============================================================================
 * questions-grammar.js  ——  语法专项补充（对应新概念1 / 手册 09–12 高频语法点）
 * 补齐：现在完成时、过去进行时、过去完成时、used to、被动语态、比较级/最高级
 * 格式同主题库，自动接到 window.QUESTIONS 后面。都带 level 阶梯难度。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* ===================== 现在完成时 present-perfect ========================= */
{
  id: "pp-01", level: 1, module: "grammar", topic: "present-perfect",
  stem: "I have already ____ this film. Let's watch another one.",
  options: ["see", "saw", "seen", "seeing"],
  answer: 2,
  explanation: "现在完成时 = have/has + 过去分词。see 的过去分词是 seen。already（已经）是现在完成时的标志词。",
  optionNotes: ["错：see 是原形", "错：saw 是过去式，不是过去分词", "对：have + 过去分词 → have seen", "错：seeing 是现在分词"]
},
{
  id: "pp-02", level: 1, module: "grammar", topic: "present-perfect",
  stem: "She ____ in this city for ten years.",
  options: ["has lived", "live", "lived", "is living"],
  answer: 0,
  explanation: "for ten years（长达十年，一直到现在）用现在完成时。主语 she → has + 过去分词 lived。",
  optionNotes: ["对：has lived，表示住了十年到现在", "错：live 是原形", "错：lived 是一般过去时，不强调延续到现在", "错：is living 是现在进行时"]
},
{
  id: "pp-03", level: 2, module: "grammar", topic: "present-perfect",
  stem: "____ you ever ____ to the Great Wall?",
  options: ["Have; been", "Has; been", "Did; go", "Have; gone"],
  answer: 0,
  explanation: "have been to = 去过（已回来）。ever（曾经）常用于现在完成时的疑问句。主语 you → Have。",
  optionNotes: ["对：Have you ever been to...? = 你去过……吗", "错：主语 you 用 Have 不用 Has", "错：Did...go 是一般过去时，和 ever 不搭", "错：have gone to 是“去了还没回”，不能问“是否去过”"]
},
{
  id: "pp-04", level: 2, module: "grammar", topic: "present-perfect",
  stem: "I can't find my keys. I'm afraid I ____ them.",
  options: ["have lost", "lost", "lose", "am losing"],
  answer: 0,
  explanation: "钥匙丢了、现在还没找到（对现在有影响），用现在完成时 have lost。",
  optionNotes: ["对：have lost，丢了且影响现在", "错：lost 是一般过去时，不强调对现在的影响", "错：lose 是原形", "错：am losing 是正在进行，不合逻辑"]
},
{
  id: "pp-05", level: 2, module: "grammar", topic: "present-perfect",
  stem: "— Where is Lily? — She ____ Shanghai; she will be back next week.",
  options: ["has been to", "has gone to", "went to", "goes to"],
  answer: 1,
  explanation: "have gone to = 去了某地（人不在这儿，还没回）。下文“下周才回来”说明人不在，用 has gone to。对比：have been to = 去过（已回来）。",
  optionNotes: ["错：has been to 是“去过并回来了”，和“下周才回”矛盾", "对：has gone to = 去了还没回，符合语境", "错：went to 只说过去去了，没体现“现在不在”", "错：goes to 是一般现在时"]
},

/* ===================== 过去进行时 past-continuous ========================= */
{
  id: "pc-01", level: 1, module: "grammar", topic: "past-continuous",
  stem: "They ____ football at four o'clock yesterday afternoon.",
  options: ["played", "were playing", "are playing", "play"],
  answer: 1,
  explanation: "过去某个时间点“正在做”用过去进行时 was/were + 动词ing。主语 they → were playing。",
  optionNotes: ["错：played 是一般过去时（做过），不强调“正在”", "对：were playing，昨天四点正在踢", "错：are playing 是现在进行", "错：play 是原形"]
},
{
  id: "pc-02", level: 2, module: "grammar", topic: "past-continuous",
  stem: "When the phone rang, I ____ a shower.",
  options: ["took", "was taking", "am taking", "take"],
  answer: 1,
  explanation: "一个短动作(rang 电话响)发生时，另一件事正在进行(洗澡)，进行的那件用过去进行时 → was taking。",
  optionNotes: ["错：took 是一般过去时", "对：was taking，电话响时正在洗澡", "错：am taking 是现在进行", "错：take 是原形"]
},
{
  id: "pc-03", level: 2, module: "grammar", topic: "past-continuous",
  stem: "While we ____ dinner, the lights suddenly went out.",
  options: ["had", "were having", "are having", "have"],
  answer: 1,
  explanation: "while（当……的时候）后面常跟过去进行时，表示“正在进行时发生了别的事”。were having dinner = 正在吃饭。",
  optionNotes: ["错：had 是一般过去时", "对：while + 过去进行 → were having", "错：are having 是现在进行", "错：have 是原形"]
},

/* ===================== 过去完成时 past-perfect ============================ */
{
  id: "ppf-01", level: 2, module: "grammar", topic: "past-perfect",
  stem: "When I got to the station, the train ____ already ____.",
  options: ["has; left", "had; left", "was; left", "did; leave"],
  answer: 1,
  explanation: "过去完成时 = had + 过去分词，表示“过去的过去”。到站(过去)之前，火车就已经开走了(更早)，用 had left。",
  optionNotes: ["错：has 用于现在完成，这里整体是过去", "对：had left，比“到站”更早发生", "错：was left 意思不对（被留下）", "错：did leave 是一般过去时，不表“更早”"]
},
{
  id: "ppf-02", level: 2, module: "grammar", topic: "past-perfect",
  stem: "She told me that she ____ the book before.",
  options: ["had read", "has read", "reads", "reading"],
  answer: 0,
  explanation: "主句 told 是过去，从句“在这之前就读过”是更早的过去，用过去完成时 had read。",
  optionNotes: ["对：had read，比 told 更早发生", "错：has read 是现在完成，主句已是过去", "错：reads 是一般现在时", "错：reading 不能单独作谓语"]
},
{
  id: "ppf-03", level: 2, module: "grammar", topic: "past-perfect",
  stem: "By the end of last year, he ____ English for three years.",
  options: ["had learned", "has learned", "learned", "learns"],
  answer: 0,
  explanation: "By the end of last year（到去年年底为止）是过去的时间点，表示“到那时已经……”，用过去完成时 had learned。",
  optionNotes: ["对：had learned，到去年底为止已学了三年", "错：has learned 是现在完成", "错：learned 不强调“到过去某点为止”", "错：learns 是一般现在时"]
},

/* ===================== used to（过去常常） =============================== */
{
  id: "ut-01", level: 2, module: "grammar", topic: "used-to",
  stem: "There ____ a big tree in front of my house, but it was cut down last year.",
  options: ["used to be", "use to be", "is used to", "used to being"],
  answer: 0,
  explanation: "used to be = 过去曾经有（现在没有了）。there used to be = 过去有……。",
  optionNotes: ["对：used to be = 过去曾有", "错：use 少了 d", "错：be used to 是“习惯于”，意思不对", "错：used to being 结构错误"]
},
{
  id: "ut-02", level: 2, module: "grammar", topic: "used-to",
  stem: "He ____ smoke a lot, but he has given it up now.",
  options: ["used to", "is used to", "was used to", "uses to"],
  answer: 0,
  explanation: "used to do = 过去常常做（现在不做了）。句意：他过去抽很多烟，现在戒了。注意和 be used to doing（习惯于）区分。",
  optionNotes: ["对：used to do = 过去常常……", "错：be used to doing 是“习惯于做”，后接ing", "错：was used to 后接 doing，意思是“习惯”", "错：没有 uses to 这个用法"]
},

/* ===================== 被动语态 passive ================================== */
{
  id: "pv-01", level: 1, module: "grammar", topic: "passive",
  stem: "Our classroom ____ every day.",
  options: ["cleans", "is cleaned", "cleaned", "clean"],
  answer: 1,
  explanation: "教室是“被打扫”的，用被动语态 be + 过去分词。一般现在时被动 → is cleaned。",
  optionNotes: ["错：cleans 是主动，教室不能主动打扫", "对：is cleaned（被打扫）", "错：cleaned 是过去式主动", "错：clean 是原形"]
},
{
  id: "pv-02", level: 2, module: "grammar", topic: "passive",
  stem: "This stone bridge ____ more than 500 years ago.",
  options: ["built", "was built", "is built", "builds"],
  answer: 1,
  explanation: "桥是“被建”的（被动），且 500 years ago 是过去，用一般过去时被动 was + 过去分词 → was built。",
  optionNotes: ["错：built 是过去主动，桥不能主动建", "对：was built，过去被建", "错：is built 是现在时，和 ago 矛盾", "错：builds 是现在主动"]
},
{
  id: "pv-03", level: 2, module: "grammar", topic: "passive",
  stem: "The homework must ____ before class tomorrow.",
  options: ["finish", "be finished", "finished", "finishing"],
  answer: 1,
  explanation: "情态动词后的被动：情态动词 + be + 过去分词。作业是“被完成”的 → must be finished。",
  optionNotes: ["错：finish 是主动原形", "对：情态动词 + be + 过去分词 → must be finished", "错：finished 缺 be", "错：finishing 结构不对"]
},
{
  id: "pv-04", level: 2, module: "grammar", topic: "passive",
  stem: "Rice ____ by farmers in the south of China.",
  options: ["grows", "is grown", "grew", "growing"],
  answer: 1,
  explanation: "有 by farmers（被农民）就是被动语态：稻子被农民种植。一般现在时被动 → is grown。",
  optionNotes: ["错：grows 是主动，和 by farmers（被……）矛盾", "对：is grown by farmers（被农民种植）", "错：grew 是过去式", "错：growing 不能单独作谓语"]
},
{
  id: "pv-05", level: 3, module: "grammar", topic: "passive",
  stem: "Look! A new library ____ near our school now.",
  options: ["is building", "is being built", "is built", "builds"],
  answer: 1,
  explanation: "now/Look 表示“正在”，且图书馆是“被建”的，用现在进行时的被动：is/are being + 过去分词 → is being built。",
  optionNotes: ["错：is building 是主动进行，图书馆不能主动建", "对：is being built（正在被建）", "错：is built 没体现“正在”", "错：builds 是主动"]
},

/* ===================== 比较级 · 最高级 =================================== */
{
  id: "cs-01", level: 1, module: "grammar", topic: "comparative",
  stem: "This box is ____ than that one.",
  options: ["big", "bigger", "biggest", "more big"],
  answer: 1,
  explanation: "than 前用比较级。big 是重读闭音节，双写 g 再加 er → bigger。",
  optionNotes: ["错：big 是原级", "对：bigger（双写 g + er）", "错：biggest 是最高级", "错：短单词不用 more"]
},
{
  id: "cs-02", level: 2, module: "grammar", topic: "superlative",
  stem: "The Yangtze River is one of ____ rivers in the world.",
  options: ["long", "longer", "the longest", "longest"],
  answer: 2,
  explanation: "one of the + 最高级 + 复数名词 = 最……之一。最高级前要加 the → the longest。",
  optionNotes: ["错：long 是原级", "错：longer 是比较级", "对：one of the longest = 最长的之一", "错：最高级前缺 the"]
},
{
  id: "cs-03", level: 2, module: "grammar", topic: "comparative",
  stem: "The more you practise, the ____ your English will be.",
  options: ["good", "better", "best", "well"],
  answer: 1,
  explanation: "the more..., the more... = 越……越……。两个空都用比较级。good 的比较级是 better。",
  optionNotes: ["错：good 是原级", "对：the + 比较级 → the better", "错：best 是最高级", "错：well 的比较级也是 better，但 well 本身是原级副词，这里要比较级"]
},
{
  id: "cs-04", level: 2, module: "grammar", topic: "comparative",
  stem: "In my opinion, health is ____ than money.",
  options: ["important", "more important", "most important", "importanter"],
  answer: 1,
  explanation: "than 前用比较级。important 是长单词(多音节)，比较级用 more + 原级 → more important。",
  optionNotes: ["错：important 是原级", "对：长单词比较级用 more important", "错：most important 是最高级", "错：长单词不能加 er，importanter 是错的"]
},

]);
