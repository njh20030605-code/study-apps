/* ============================================================================
 * 题库 questions.js
 * ----------------------------------------------------------------------------
 * 这就是一个 JSON 数组，你可以直接往里加题、改题。
 * 外面包了一层 window.QUESTIONS = ，是为了你【双击 index.html】用 file:// 打开时
 * 浏览器也能加载（纯 .json 文件在 file:// 下会被浏览器安全策略挡住，所以用 .js）。
 *
 * 每道题的字段说明：
 *   id          唯一编号，随便起，别重复
 *   module      grammar | collocation | cloze | reading | conversation | phonetics
 *   topic       知识点标签（用于间隔复习和薄弱点统计），中文英文都行
 *   stem        题干（____ 表示空）
 *   options     选项数组（4 个）
 *   answer      正确选项下标（0=A,1=B,2=C,3=D）
 *   explanation 整体解析（大白话说这题考什么 + 规则）
 *   optionNotes 逐项说明，长度必须 == 选项数，逐一说"对/错，为什么"
 *   passage     （可选）阅读/完形的短文；同一篇短文用同一个 passageId 归组，短文只显示一次
 *   passageId   （可选）短文分组编号
 * ========================================================================== */

window.QUESTIONS = [

/* ===================== I. Phonetics 语音（5 分，最好拿的送分题）============ */
/* ===================== II. Vocabulary & Structure 词汇与语法（真题 Q6–20）===== */
/* ===================== 虚拟语气强化（重点高频，多练几道）==================== */
{
  id: "gram-101", module: "grammar", topic: "subjunctive",
  stem: "The doctor suggested that the patient ____ in bed for a few days.",
  options: ["stays", "stayed", "stay", "would stay"],
  answer: 2,
  explanation: "suggest（建议）后的从句用 (should) + 动词原形，should 常省略。句意：医生建议病人卧床几天。",
  optionNotes: [
    "错：stays 是第三人称单数陈述语气，这里要虚拟",
    "错：stayed 是过去式，不对",
    "对：(should) stay，should 省略 → stay",
    "错：would stay 不是这个结构该用的"
  ]
},
{
  id: "gram-102", module: "grammar", topic: "subjunctive",
  stem: "If only I ____ his phone number! Then I could call him now.",
  options: ["know", "knew", "have known", "had known"],
  answer: 1,
  explanation: "If only = 要是…就好了（虚拟）。对现在的遗憾，用过去式。句意：要是我现在知道他电话就好了。",
  optionNotes: [
    "错：know 是现在时，If only 要用虚拟",
    "对：对现在的虚拟用过去式 → knew",
    "错：have known 是完成时，不对",
    "错：had known 用于对过去的遗憾，但后面 could call him now 指现在"
  ]
},
{
  id: "gram-103", module: "grammar", topic: "subjunctive",
  stem: "It is necessary that every member ____ the rules of the club.",
  options: ["knows", "know", "knew", "must know"],
  answer: 1,
  explanation: "It is necessary that... 从句用 (should) + 动词原形。句意：每个成员都有必要了解俱乐部规则。",
  optionNotes: [
    "错：knows 是陈述语气",
    "对：(should) know，should 省略 → know",
    "错：knew 是过去式",
    "错：must know 多余，结构不对"
  ]
},
{
  id: "gram-104", module: "grammar", topic: "subjunctive",
  stem: "But for your help, I ____ the exam last week.",
  options: ["would fail", "would have failed", "failed", "will fail"],
  answer: 1,
  explanation: "But for = 要不是（相当于 if it had not been for）。有 last week 指过去，用 would have + 过去分词。句意：要不是你帮忙，我上周考试就挂了。",
  optionNotes: [
    "错：would fail 是对现在虚拟，但这里 last week 是过去",
    "对：对过去虚拟 → would have failed",
    "错：failed 是陈述语气",
    "错：will fail 是将来时"
  ]
},
{
  id: "gram-105", module: "grammar", topic: "subjunctive",
  stem: "The teacher demanded that the homework ____ before Friday.",
  options: ["is handed in", "was handed in", "be handed in", "will be handed in"],
  answer: 2,
  explanation: "demand（要求）后的从句用 (should) + 动词原形，这里被动 → (should) be handed in。句意：老师要求作业周五前交。",
  optionNotes: [
    "错：is handed in 是陈述语气",
    "错：was handed in 是过去时",
    "对：(should) be handed in，should 省略",
    "错：will be handed in 是将来时"
  ]
},
{
  id: "gram-106", module: "grammar", topic: "subjunctive",
  stem: "He talks about Rome as if he ____ there before.",
  options: ["is", "was", "has been", "had been"],
  answer: 3,
  explanation: "as if（好像）表示与过去事实相反时，用过去完成时 had + 过去分词。句意：他谈起罗马，好像以前去过一样（其实没去过）。",
  optionNotes: [
    "错：is 是现在时，as if 虚拟不用它",
    "错：was 用于与现在相反，但“以前去过”是过去",
    "错：has been 是现在完成时，非虚拟",
    "对：与过去相反 → had been"
  ]
},

/* ===================== 定语从句 / 倒装 / 被动 / 非谓语 ====================== */
{
  id: "gram-201", module: "grammar", topic: "relative-clause",
  stem: "This is the village ____ I spent my childhood.",
  options: ["which", "that", "where", "who"],
  answer: 2,
  explanation: "定语从句里，先行词是地点(village)且从句不缺主语/宾语（spent 已经有宾语 childhood），缺的是“地点状语”，所以用 where。",
  optionNotes: [
    "错：which 只在从句缺主语/宾语时用，这里不缺",
    "错：that 同上，从句不缺成分",
    "对：从句缺“在这里”的地点状语 → where",
    "错：who 指人，village 是地点"
  ]
},
{
  id: "gram-202", module: "grammar", topic: "relative-clause",
  viz: {"en": "The book (whose cover is red) belongs to my teacher.", "rows": [["主干", "The book belongs to my teacher.", "那本书是我老师的"], ["括号补充", "whose cover is red", "它的封面是红色的"]]},
  stem: "The book ____ cover is red belongs to my teacher.",
  options: ["which", "whose", "that", "of which"],
  answer: 1,
  explanation: "考定语从句里表示“…的”（所属关系）。whose = …的，可指人或物。打括号读：先读主干“那本书是我老师的”，括号里补充“它的封面是红色的”。",
  optionNotes: [
    "错：which 不表示所属",
    "对：whose cover = 它的封面，表所属",
    "错：that 不表所属",
    "错：of which 语序要改成 the cover of which，不能直接接名词"
  ]
},
{
  id: "gram-203", module: "grammar", topic: "inversion",
  stem: "Not only ____ us with trouble, but he also laughed at us.",
  options: ["he provided", "did he provide", "he did provide", "provided he"],
  answer: 1,
  explanation: "否定词组 Not only 放句首，句子要“部分倒装”：把助动词提到主语前 → did he provide。句意：他不仅给我们添麻烦，还嘲笑我们。",
  optionNotes: [
    "错：he provided 没有倒装",
    "对：Not only 句首要倒装 → did he provide",
    "错：he did provide 语序不对（没倒装）",
    "错：provided he 语序错误"
  ]
},
{
  id: "gram-204", module: "grammar", topic: "inversion",
  stem: "—I have never been to Beijing. —____.",
  options: ["So have I", "Neither have I", "Neither I have", "So I have"],
  answer: 1,
  explanation: "前句是否定“我从没去过”，表示“我也没有”用 Neither + 助动词 + 主语（倒装）。句意：我也没去过。",
  optionNotes: [
    "错：So have I 用于同意“肯定”句",
    "对：同意否定句 → Neither have I（倒装）",
    "错：Neither I have 语序错，没倒装",
    "错：So I have 意思和语序都不对"
  ]
},
{
  id: "gram-205", module: "grammar", topic: "non-finite",
  stem: "The film was so ____ that all of us were deeply ____.",
  options: ["moving; moving", "moved; moved", "moving; moved", "moved; moving"],
  answer: 2,
  explanation: "考 -ing 和 -ed 的区别：-ing 形容“事物令人…”，-ed 形容“人感到…”。电影是“令人感动的”(moving)，我们是“感到感动的”(moved)。",
  optionNotes: [
    "错：第二个 moving 描述人不对",
    "错：第一个 moved 描述电影不对",
    "对：电影 moving（令人感动），我们 moved（感到感动）",
    "错：两个都反了"
  ]
},
{
  id: "gram-206", module: "grammar", topic: "non-finite",
  stem: "____ the bus, he found he had left his wallet at home.",
  options: ["Getting on", "Got on", "To get on", "Get on"],
  answer: 0,
  explanation: "句子已经有主句(he found...)，前面表示“上车时”这个伴随/时间动作，用现在分词短语 Getting on。句意：上了公交，他发现钱包忘在家里。",
  optionNotes: [
    "对：现在分词短语作状语 → Getting on",
    "错：Got on 是过去式，一个句子不能有两个并列谓语却没连词",
    "错：To get on 表目的，逻辑不通",
    "错：Get on 是原形/祈使，不能这样接"
  ]
},

/* ===================== 固定搭配卡对应练习 ================================= */
{
  id: "col-301", module: "collocation", topic: "collocation",
  stem: "The meeting was ____ because of the bad weather.",
  options: ["called on", "called off", "called in", "called up"],
  answer: 1,
  explanation: "call off = 取消。句意：会议因天气不好取消了。",
  optionNotes: [
    "错：call on = 拜访某人 / 号召",
    "对：call off = 取消",
    "错：call in = 叫来、召来",
    "错：call up = 打电话 / 使想起"
  ]
},
{
  id: "col-302", module: "collocation", topic: "collocation",
  stem: "Water ____ hydrogen and oxygen.",
  options: ["is made up", "is composed of", "makes up", "composes"],
  answer: 1,
  explanation: "be composed of = be made up of = 由…组成（主语是整体）。水由氢和氧组成。注意 be made up of 要有 of。",
  optionNotes: [
    "错：is made up 少了 of，不完整",
    "对：be composed of = 由…组成",
    "错：makes up 主动，主语该是部分组成整体",
    "错：compose 主动时意思/搭配不对（应 be composed of）"
  ]
},
{
  id: "col-303", module: "collocation", topic: "collocation",
  stem: "You can ____ me ____ help whenever you are in trouble.",
  options: ["count; on", "count on; for", "depend; in", "rely; at"],
  answer: 1,
  explanation: "count on sb for sth = 在…方面指望某人。句意：有麻烦时你随时可以指望我帮忙。",
  optionNotes: [
    "错：count ... on 语序不对",
    "对：count on sb for sth = 指望某人做某事",
    "错：depend in 搭配错，应 depend on",
    "错：rely at 搭配错，应 rely on"
  ]
},
{
  id: "col-304", module: "collocation", topic: "collocation",
  stem: "He was so ____ his work that he didn't hear the doorbell.",
  options: ["absorbed in", "interested for", "busy with about", "fond in"],
  answer: 0,
  explanation: "be absorbed in = 全神贯注于。句意：他太专注工作，没听见门铃。",
  optionNotes: [
    "对：be absorbed in = 专注于",
    "错：应是 interested in，不是 for",
    "错：busy with about 语法错误",
    "错：应是 fond of，不是 fond in"
  ]
},
{
  id: "col-305", module: "collocation", topic: "collocation",
  stem: "We have no choice but ____ the plan.",
  options: ["accept", "to accept", "accepting", "accepted"],
  answer: 1,
  explanation: "have no choice but to do = 除了做…别无选择。注意 but 后接带 to 的动词不定式。句意：我们只好接受这个计划。",
  optionNotes: [
    "错：accept 缺 to",
    "对：have no choice but to do → to accept",
    "错：accepting 形式不对",
    "错：accepted 形式不对"
  ]
},
{
  id: "col-306", module: "collocation", topic: "collocation",
  stem: "Please ____ the light before you leave the room.",
  options: ["put up", "put off", "turn off", "call off"],
  answer: 2,
  explanation: "turn off = 关掉（灯、电器）。句意：离开房间前请关灯。（put off = 推迟；put up = 举起/张贴/搭建）",
  optionNotes: [
    "错：put up = 举起、张贴、搭建",
    "错：put off = 推迟",
    "对：turn off = 关掉",
    "错：call off = 取消（活动），不用于关灯"
  ]
},

/* ===================== III. Cloze 完形填空（自编短文，A2 难度）============== */
{
  id: "cloze-401", module: "cloze", topic: "cloze", passageId: "cz1",
  passage: "Tom is a middle-school student. Every morning he gets up at six. He often (1)____ to school by bike because his home is far. He likes English (2)____ it is useful and interesting. In class he listens (3)____ and takes notes. After school he does his homework first and (4)____ plays football with his friends. He believes that if he works hard, his dream (5)____ come true one day.",
  stem: "(1) 处应填：",
  options: ["go", "goes", "going", "went"],
  answer: 1,
  explanation: "主语 he 是第三人称单数，一般现在时动词要加 s → goes。",
  optionNotes: [
    "错：go 没加 s，主语是 he",
    "对：he goes，第三人称单数 + s",
    "错：going 不能单独作谓语",
    "错：went 是过去式，全文是现在时"
  ]
},
{
  id: "cloze-402", module: "cloze", topic: "cloze", passageId: "cz1",
  passage: "Tom is a middle-school student. Every morning he gets up at six. He often (1)____ to school by bike because his home is far. He likes English (2)____ it is useful and interesting. In class he listens (3)____ and takes notes. After school he does his homework first and (4)____ plays football with his friends. He believes that if he works hard, his dream (5)____ come true one day.",
  stem: "(2) 处应填：",
  options: ["but", "because", "though", "or"],
  answer: 1,
  explanation: "前面“喜欢英语”和后面“有用又有趣”是因果关系，用 because（因为）。",
  optionNotes: [
    "错：but = 但是（转折），逻辑不对",
    "对：because = 因为，表原因",
    "错：though = 尽管（让步）",
    "错：or = 或者"
  ]
},
{
  id: "cloze-403", module: "cloze", topic: "cloze", passageId: "cz1",
  passage: "Tom is a middle-school student. Every morning he gets up at six. He often (1)____ to school by bike because his home is far. He likes English (2)____ it is useful and interesting. In class he listens (3)____ and takes notes. After school he does his homework first and (4)____ plays football with his friends. He believes that if he works hard, his dream (5)____ come true one day.",
  stem: "(3) 处应填：",
  options: ["careful", "carefully", "care", "careless"],
  answer: 1,
  explanation: "修饰动词 listens（怎么听），要用副词 carefully（认真地）。",
  optionNotes: [
    "错：careful 是形容词，不能修饰动词",
    "对：carefully 是副词，修饰 listens",
    "错：care 是名词/动词，位置不对",
    "错：careless = 粗心的，意思反了"
  ]
},
{
  id: "cloze-404", module: "cloze", topic: "cloze", passageId: "cz1",
  passage: "Tom is a middle-school student. Every morning he gets up at six. He often (1)____ to school by bike because his home is far. He likes English (2)____ it is useful and interesting. In class he listens (3)____ and takes notes. After school he does his homework first and (4)____ plays football with his friends. He believes that if he works hard, his dream (5)____ come true one day.",
  stem: "(4) 处应填：",
  options: ["then", "so", "but", "because"],
  answer: 0,
  explanation: "“先做作业，然后踢球”是先后顺序，用 then（然后）。",
  optionNotes: [
    "对：then = 然后，表先后顺序",
    "错：so = 所以（因果），这里是顺序不是因果",
    "错：but = 但是",
    "错：because = 因为"
  ]
},
{
  id: "cloze-405", module: "cloze", topic: "cloze", passageId: "cz1",
  passage: "Tom is a middle-school student. Every morning he gets up at six. He often (1)____ to school by bike because his home is far. He likes English (2)____ it is useful and interesting. In class he listens (3)____ and takes notes. After school he does his homework first and (4)____ plays football with his friends. He believes that if he works hard, his dream (5)____ come true one day.",
  stem: "(5) 处应填：",
  options: ["will", "would", "is", "has"],
  answer: 0,
  explanation: "if 引导条件句时，主句用将来时 will。句意：如果努力，梦想总有一天会实现。",
  optionNotes: [
    "对：条件句主句用一般将来时 → will come true",
    "错：would 是过去将来，全文是现在语境",
    "错：is come true 语法错误",
    "错：has come true 时态不对"
  ]
},

/* ===================== IV. Reading 阅读理解（自编短文，A2 难度）============= */
{
  id: "read-501", module: "reading", topic: "reading", passageId: "rd1",
  passage: "Anna lives in a small town. She works in a library and loves her job. Every day many students come to read and borrow books. Anna helps them find the books they need. She is patient and kind, so everyone likes her. On weekends, she does not work. She stays at home, reads her favourite novels and drinks tea. Anna thinks a quiet life is a happy life.",
  stem: "Where does Anna work?",
  options: ["In a school", "In a library", "In a bookshop", "In a tea house"],
  answer: 1,
  explanation: "细节题。原文第二句 She works in a library（她在图书馆工作）。找到原句直接选。",
  optionNotes: [
    "错：文中没说学校",
    "对：原文 works in a library",
    "错：是图书馆(library)不是书店(bookshop)",
    "错：茶馆是干扰项，文中只是在家喝茶"
  ]
},
{
  id: "read-502", module: "reading", topic: "reading", passageId: "rd1",
  passage: "Anna lives in a small town. She works in a library and loves her job. Every day many students come to read and borrow books. Anna helps them find the books they need. She is patient and kind, so everyone likes her. On weekends, she does not work. She stays at home, reads her favourite novels and drinks tea. Anna thinks a quiet life is a happy life.",
  stem: "Why does everyone like Anna?",
  options: ["Because she is rich", "Because she is patient and kind", "Because she is young", "Because she reads a lot"],
  answer: 1,
  explanation: "细节题 + 因果。原文 She is patient and kind, so everyone likes her（她耐心又善良，所以大家喜欢她）。",
  optionNotes: [
    "错：文中没说她有钱",
    "对：原文 patient and kind, so everyone likes her",
    "错：没提她年轻",
    "错：读书多是她的爱好，不是大家喜欢她的原因"
  ]
},
{
  id: "read-503", module: "reading", topic: "reading", passageId: "rd1",
  passage: "Anna lives in a small town. She works in a library and loves her job. Every day many students come to read and borrow books. Anna helps them find the books they need. She is patient and kind, so everyone likes her. On weekends, she does not work. She stays at home, reads her favourite novels and drinks tea. Anna thinks a quiet life is a happy life.",
  stem: "What does Anna do on weekends?",
  options: ["She works in the library", "She helps students", "She stays at home and reads", "She travels"],
  answer: 2,
  explanation: "细节题。原文 On weekends... She stays at home, reads her favourite novels（周末她待在家读小说）。",
  optionNotes: [
    "错：原文说周末她不工作",
    "错：帮学生是上班时的事",
    "对：原文 stays at home, reads her favourite novels",
    "错：文中没提旅行"
  ]
},
{
  id: "read-504", module: "reading", topic: "reading", passageId: "rd1",
  passage: "Anna lives in a small town. She works in a library and loves her job. Every day many students come to read and borrow books. Anna helps them find the books they need. She is patient and kind, so everyone likes her. On weekends, she does not work. She stays at home, reads her favourite novels and drinks tea. Anna thinks a quiet life is a happy life.",
  stem: "What is the best title for the passage?",
  options: ["A Busy City", "Anna and Her Quiet Life", "How to Borrow Books", "A Famous Writer"],
  answer: 1,
  explanation: "主旨题。全文围绕 Anna 的工作和安静生活展开，末句点题 a quiet life is a happy life。所以标题是“安娜和她安静的生活”。",
  optionNotes: [
    "错：她住小镇不是繁忙城市",
    "对：全文讲 Anna 及她安静的生活，末句点题",
    "错：借书只是细节，不是全文主旨",
    "错：她是图书管理员，不是作家"
  ]
},

/* ===================== V. Daily Conversation 补全对话 ===================== */
{
  id: "conv-601", module: "conversation", topic: "conversation",
  stem: "—Thank you all the same. —____",
  options: ["It doesn't matter.", "You're welcome.", "That's a good idea.", "Never mind."],
  answer: 0,
  explanation: "Thank you all the same = 还是要谢谢你（常在对方没帮上忙时说）。回应用 It doesn't matter（没关系）。注意：只有真帮了忙才用 You're welcome。",
  optionNotes: [
    "对：It doesn't matter = 没关系，回应“还是谢谢你”",
    "错：You're welcome 用于真的帮了忙、对方道谢时",
    "错：That's a good idea 答非所问",
    "错：Never mind 一般用于回应道歉，不是道谢"
  ]
},
{
  id: "conv-602", module: "conversation", topic: "conversation",
  stem: "—Would you like to go to the cinema with me? —____",
  options: ["Yes, please.", "I'd love to.", "It's nice.", "You're right."],
  answer: 1,
  explanation: "别人邀请你(Would you like to...)，愉快接受用 I'd love to（我很乐意）。",
  optionNotes: [
    "错：Yes, please 用于接受“给你东西”的提议，不用于邀请一起做事",
    "对：I'd love to = 我很乐意（接受邀请的地道说法）",
    "错：It's nice 答非所问",
    "错：You're right 是表示同意观点"
  ]
},
{
  id: "conv-603", module: "conversation", topic: "conversation",
  stem: "—How is your mother? —____",
  options: ["She is a teacher.", "She is fine, thank you.", "She is forty.", "She is at home."],
  answer: 1,
  explanation: "How is somebody? 是问“某人身体/近况怎么样”，答 She is fine（她很好）。别和 What / Where 问句搞混。",
  optionNotes: [
    "错：这是回答 What does she do?（职业）",
    "对：How is...? 问近况 → She is fine, thank you",
    "错：这是回答 How old...?（年龄）",
    "错：这是回答 Where...?（地点）"
  ]
},
{
  id: "conv-604", module: "conversation", topic: "conversation",
  stem: "—I'm sorry I'm late. —____",
  options: ["That's all right.", "You're welcome.", "The same to you.", "With pleasure."],
  answer: 0,
  explanation: "别人道歉(I'm sorry)，回应用 That's all right / Never mind（没关系）。",
  optionNotes: [
    "对：That's all right = 没关系（回应道歉）",
    "错：You're welcome 回应“谢谢”，不是道歉",
    "错：The same to you 用于回祝福",
    "错：With pleasure 用于欣然答应帮忙"
  ]
},
{
  id: "conv-605", module: "conversation", topic: "conversation",
  stem: "—When and where shall we meet? —____",
  options: ["I have no idea.", "Let's meet at the bus stop at five.", "It's a good match.", "See you."],
  answer: 1,
  explanation: "对方问“什么时候、在哪儿见”，要回答具体时间地点：在车站五点见。",
  optionNotes: [
    "错：I have no idea 没回答问题",
    "对：给出具体时间地点 → at the bus stop at five",
    "错：答非所问",
    "错：See you 是道别用语"
  ]
},

];
