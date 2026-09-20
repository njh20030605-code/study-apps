/* ============================================================================
 * questions-pack1.js  ——  扩充包 1：阅读 + 完形 + 高中基础语法/词汇/会话
 * 重点补考试大分板块（阅读60分/完形30分）和高中基础语法。都带 level 阶梯。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* ============================ 阅读 Reading ================================ */
/* --- 短文 A（通知，入门） --- */
{
  id: "p1-rd-A1", level: 1, module: "reading", topic: "reading", passageId: "p1rdA",
  passage: "NOTICE\nThe school library will be closed from July 1 to July 5 for cleaning. During these days, students cannot borrow or return books. The library will open again on July 6 at 9 a.m. If you have any questions, please call Miss Wang at 12345678.\nThank you!",
  stem: "Why will the library be closed?",
  options: ["For cleaning.", "For a meeting.", "For a holiday.", "For a party."],
  answer: 0,
  explanation: "细节题。原文 closed ... for cleaning（为了打扫而关闭）。",
  optionNotes: ["对：原文 for cleaning", "错：没提开会", "错：没提放假", "错：没提聚会"]
},
{
  id: "p1-rd-A2", level: 1, module: "reading", topic: "reading", passageId: "p1rdA",
  passage: "NOTICE\nThe school library will be closed from July 1 to July 5 for cleaning. During these days, students cannot borrow or return books. The library will open again on July 6 at 9 a.m. If you have any questions, please call Miss Wang at 12345678.\nThank you!",
  stem: "When will the library open again?",
  options: ["On July 1.", "On July 5.", "On July 6.", "On July 9."],
  answer: 2,
  explanation: "细节题。原文 open again on July 6（7 月 6 日重新开放）。",
  optionNotes: ["错：7 月 1 日是开始关闭", "错：7 月 5 日是关闭的最后一天", "对：原文 open again on July 6", "错：文中没有 7 月 9 日"]
},
{
  id: "p1-rd-A3", level: 1, module: "reading", topic: "reading", passageId: "p1rdA",
  passage: "NOTICE\nThe school library will be closed from July 1 to July 5 for cleaning. During these days, students cannot borrow or return books. The library will open again on July 6 at 9 a.m. If you have any questions, please call Miss Wang at 12345678.\nThank you!",
  stem: "What can't students do during these days?",
  options: ["Read at home.", "Borrow or return books.", "Call Miss Wang.", "Go to school."],
  answer: 1,
  explanation: "细节题。原文 cannot borrow or return books（不能借书或还书）。",
  optionNotes: ["错：文中没说不能在家读", "对：原文 cannot borrow or return books", "错：有问题正是要打电话给 Miss Wang", "错：没说不能上学"]
},
{
  id: "p1-rd-A4", level: 1, module: "reading", topic: "reading", passageId: "p1rdA",
  passage: "NOTICE\nThe school library will be closed from July 1 to July 5 for cleaning. During these days, students cannot borrow or return books. The library will open again on July 6 at 9 a.m. If you have any questions, please call Miss Wang at 12345678.\nThank you!",
  stem: "Who can you call if you have questions?",
  options: ["The teacher.", "Miss Wang.", "The students.", "The doctor."],
  answer: 1,
  explanation: "细节题。原文 please call Miss Wang（打电话给王老师）。",
  optionNotes: ["错：没说打给别的老师", "对：原文 call Miss Wang", "错：不是打给学生", "错：文中没有医生"]
},

/* --- 短文 B（邀请邮件，进阶） --- */
{
  id: "p1-rd-B1", level: 2, module: "reading", topic: "reading", passageId: "p1rdB",
  passage: "Dear Sarah,\nHow are you? I'm writing to invite you to my birthday party. It will be held at my home this Saturday evening at seven o'clock. There will be music, games and a big cake. Many of our old friends will come too. Please tell me if you can come. I hope to see you there!\nYours,\nEmma",
  stem: "What is this email about?",
  options: ["A birthday party invitation.", "A school notice.", "A shopping plan.", "A job offer."],
  answer: 0,
  explanation: "主旨题。全文是 Emma 写信邀请 Sarah 参加她的生日聚会。",
  optionNotes: ["对：invite you to my birthday party，是生日聚会邀请", "错：不是学校通知", "错：不是购物", "错：不是工作邀请"]
},
{
  id: "p1-rd-B2", level: 2, module: "reading", topic: "reading", passageId: "p1rdB",
  passage: "Dear Sarah,\nHow are you? I'm writing to invite you to my birthday party. It will be held at my home this Saturday evening at seven o'clock. There will be music, games and a big cake. Many of our old friends will come too. Please tell me if you can come. I hope to see you there!\nYours,\nEmma",
  stem: "When will the party be held?",
  options: ["Saturday morning.", "Saturday evening.", "Sunday evening.", "Friday evening."],
  answer: 1,
  explanation: "细节题。原文 this Saturday evening at seven o'clock（本周六晚上七点）。",
  optionNotes: ["错：不是周六早上", "对：原文 Saturday evening", "错：不是周日", "错：不是周五"]
},
{
  id: "p1-rd-B3", level: 2, module: "reading", topic: "reading", passageId: "p1rdB",
  passage: "Dear Sarah,\nHow are you? I'm writing to invite you to my birthday party. It will be held at my home this Saturday evening at seven o'clock. There will be music, games and a big cake. Many of our old friends will come too. Please tell me if you can come. I hope to see you there!\nYours,\nEmma",
  stem: "What will there NOT be at the party?",
  options: ["Music.", "Games.", "A cake.", "Films."],
  answer: 3,
  explanation: "细节判断题。原文列出 music, games and a big cake，没提 films（电影）。",
  optionNotes: ["错：有 music", "错：有 games", "错：有 a big cake", "对：文中没提 films → 选它"]
},
{
  id: "p1-rd-B4", level: 2, module: "reading", topic: "reading", passageId: "p1rdB",
  passage: "Dear Sarah,\nHow are you? I'm writing to invite you to my birthday party. It will be held at my home this Saturday evening at seven o'clock. There will be music, games and a big cake. Many of our old friends will come too. Please tell me if you can come. I hope to see you there!\nYours,\nEmma",
  stem: "What does Emma ask Sarah to do?",
  options: ["Bring a cake.", "Tell her if she can come.", "Call the old friends.", "Come at six."],
  answer: 1,
  explanation: "细节题。原文 Please tell me if you can come（请告诉我你能不能来）。",
  optionNotes: ["错：没让带蛋糕", "对：原文 tell me if you can come", "错：没让联系老朋友", "错：是七点不是六点"]
},

/* --- 短文 C（小故事，进阶） --- */
{
  id: "p1-rd-C1", level: 2, module: "reading", topic: "reading", passageId: "p1rdC",
  passage: "Mr. Green likes running. Every morning he runs in the park near his house. One morning, while he was running, he saw an old woman fall down. He stopped at once and helped her stand up. Then he took her to the hospital. The doctor said she was fine. The old woman thanked Mr. Green again and again. Mr. Green felt very happy that day.",
  stem: "What does Mr. Green do every morning?",
  options: ["He runs in the park.", "He goes to the hospital.", "He helps his wife.", "He reads books."],
  answer: 0,
  explanation: "细节题。原文 Every morning he runs in the park（每天早上在公园跑步）。",
  optionNotes: ["对：原文 runs in the park", "错：去医院是那天送老太太", "错：没提妻子", "错：没提读书"]
},
{
  id: "p1-rd-C2", level: 2, module: "reading", topic: "reading", passageId: "p1rdC",
  passage: "Mr. Green likes running. Every morning he runs in the park near his house. One morning, while he was running, he saw an old woman fall down. He stopped at once and helped her stand up. Then he took her to the hospital. The doctor said she was fine. The old woman thanked Mr. Green again and again. Mr. Green felt very happy that day.",
  stem: "What happened to the old woman?",
  options: ["She got lost.", "She fell down.", "She lost her bag.", "She missed the bus."],
  answer: 1,
  explanation: "细节题。原文 he saw an old woman fall down（看见一位老太太摔倒）。",
  optionNotes: ["错：不是迷路", "对：原文 fall down（摔倒）", "错：没说丢包", "错：没说错过公交"]
},
{
  id: "p1-rd-C3", level: 2, module: "reading", topic: "reading", passageId: "p1rdC",
  passage: "Mr. Green likes running. Every morning he runs in the park near his house. One morning, while he was running, he saw an old woman fall down. He stopped at once and helped her stand up. Then he took her to the hospital. The doctor said she was fine. The old woman thanked Mr. Green again and again. Mr. Green felt very happy that day.",
  stem: "What did Mr. Green do first after he saw her?",
  options: ["He called the doctor.", "He helped her stand up.", "He ran away.", "He went home."],
  answer: 1,
  explanation: "细节+顺序题。原文 He stopped at once and helped her stand up（先扶她起来），之后才送医院。",
  optionNotes: ["错：文中没有打电话叫医生这一步", "对：原文先 helped her stand up", "错：他没跑开，而是停下帮忙", "错：没有回家"]
},
{
  id: "p1-rd-C4", level: 2, module: "reading", topic: "reading", passageId: "p1rdC",
  passage: "Mr. Green likes running. Every morning he runs in the park near his house. One morning, while he was running, he saw an old woman fall down. He stopped at once and helped her stand up. Then he took her to the hospital. The doctor said she was fine. The old woman thanked Mr. Green again and again. Mr. Green felt very happy that day.",
  stem: "How did Mr. Green feel that day?",
  options: ["Angry.", "Sad.", "Happy.", "Afraid."],
  answer: 2,
  explanation: "细节题。原文 Mr. Green felt very happy that day（那天他很开心）。",
  optionNotes: ["错：不是生气", "错：不是难过", "对：原文 felt very happy", "错：不是害怕"]
},

/* ============================ 完形 Cloze ================================= */
/* --- 完形 A（我的周末，入门） --- */
{
  id: "p1-cz-A1", level: 1, module: "cloze", topic: "cloze", passageId: "p1czA",
  passage: "I have a good time every weekend. On Saturday I get up (1)____ seven o'clock. Then I do my homework. In the afternoon I play football (2)____ my friends. On Sunday I help my mother (3)____ the housework. We often go to the park (4)____ a walk. I like weekends (5)____ I can relax and have fun.",
  stem: "(1) 处应填：",
  options: ["at", "in", "on", "for"],
  answer: 0,
  explanation: "具体时刻（七点钟）用 at → at seven o'clock。",
  optionNotes: ["对：时刻用 at", "错：in 用于月/年", "错：on 用于某天", "错：for 表持续时间"]
},
{
  id: "p1-cz-A2", level: 1, module: "cloze", topic: "cloze", passageId: "p1czA",
  passage: "I have a good time every weekend. On Saturday I get up (1)____ seven o'clock. Then I do my homework. In the afternoon I play football (2)____ my friends. On Sunday I help my mother (3)____ the housework. We often go to the park (4)____ a walk. I like weekends (5)____ I can relax and have fun.",
  stem: "(2) 处应填：",
  options: ["with", "to", "for", "at"],
  answer: 0,
  explanation: "和朋友一起（做某事）用 with → play football with my friends。",
  optionNotes: ["对：with my friends = 和朋友一起", "错：to 方向", "错：for 为了", "错：at 在某处"]
},
{
  id: "p1-cz-A3", level: 1, module: "cloze", topic: "cloze", passageId: "p1czA",
  passage: "I have a good time every weekend. On Saturday I get up (1)____ seven o'clock. Then I do my homework. In the afternoon I play football (2)____ my friends. On Sunday I help my mother (3)____ the housework. We often go to the park (4)____ a walk. I like weekends (5)____ I can relax and have fun.",
  stem: "(3) 处应填：",
  options: ["with", "of", "for", "in"],
  answer: 0,
  explanation: "help sb with sth = 帮某人做某事（家务）→ help my mother with the housework。",
  optionNotes: ["对：help sb with sth 固定搭配", "错：不是 of", "错：不是 for", "错：不是 in"]
},
{
  id: "p1-cz-A4", level: 1, module: "cloze", topic: "cloze", passageId: "p1czA",
  passage: "I have a good time every weekend. On Saturday I get up (1)____ seven o'clock. Then I do my homework. In the afternoon I play football (2)____ my friends. On Sunday I help my mother (3)____ the housework. We often go to the park (4)____ a walk. I like weekends (5)____ I can relax and have fun.",
  stem: "(4) 处应填：",
  options: ["for", "to", "at", "on"],
  answer: 0,
  explanation: "go for a walk = 去散步，固定搭配用 for。",
  optionNotes: ["对：go for a walk 固定搭配", "错：不是 to", "错：不是 at", "错：不是 on"]
},
{
  id: "p1-cz-A5", level: 1, module: "cloze", topic: "cloze", passageId: "p1czA",
  passage: "I have a good time every weekend. On Saturday I get up (1)____ seven o'clock. Then I do my homework. In the afternoon I play football (2)____ my friends. On Sunday I help my mother (3)____ the housework. We often go to the park (4)____ a walk. I like weekends (5)____ I can relax and have fun.",
  stem: "(5) 处应填：",
  options: ["because", "but", "or", "so"],
  answer: 0,
  explanation: "“我喜欢周末”和“能放松”是因果关系，用 because（因为）。",
  optionNotes: ["对：because 引出原因", "错：but 转折", "错：or 选择", "错：so 引出结果，方向反了"]
},

/* --- 完形 B（乡下的暑假，进阶） --- */
{
  id: "p1-cz-B1", level: 2, module: "cloze", topic: "cloze", passageId: "p1czB",
  passage: "Last summer I visited my grandparents in the countryside. It was my first time there, so everything (1)____ new to me. My grandpa taught me how (2)____ vegetables in the garden. (3)____ first it was difficult, but I soon learned. We also went fishing (4)____ the afternoon. I had a wonderful time and hope I (5)____ go there again next year.",
  stem: "(1) 处应填：",
  options: ["is", "was", "are", "be"],
  answer: 1,
  explanation: "全文讲去年的事（Last summer），是过去时。everything 视为单数 → was。",
  optionNotes: ["错：is 是现在时", "对：过去 + 单数 → was", "错：are 接复数", "错：be 是原形"]
},
{
  id: "p1-cz-B2", level: 2, module: "cloze", topic: "cloze", passageId: "p1czB",
  passage: "Last summer I visited my grandparents in the countryside. It was my first time there, so everything (1)____ new to me. My grandpa taught me how (2)____ vegetables in the garden. (3)____ first it was difficult, but I soon learned. We also went fishing (4)____ the afternoon. I had a wonderful time and hope I (5)____ go there again next year.",
  stem: "(2) 处应填：",
  options: ["grow", "to grow", "growing", "grew"],
  answer: 1,
  explanation: "how + to do = 如何做某事。teach sb how to grow = 教某人怎么种。",
  optionNotes: ["错：grow 缺 to", "对：how to grow = 怎么种", "错：growing 形式不对", "错：grew 是过去式"]
},
{
  id: "p1-cz-B3", level: 2, module: "cloze", topic: "cloze", passageId: "p1czB",
  passage: "Last summer I visited my grandparents in the countryside. It was my first time there, so everything (1)____ new to me. My grandpa taught me how (2)____ vegetables in the garden. (3)____ first it was difficult, but I soon learned. We also went fishing (4)____ the afternoon. I had a wonderful time and hope I (5)____ go there again next year.",
  stem: "(3) 处应填：",
  options: ["At", "In", "On", "For"],
  answer: 0,
  explanation: "at first = 起初、一开始，固定短语。",
  optionNotes: ["对：at first = 起初", "错：没有 in first 这个短语", "错：没有 on first", "错：没有 for first"]
},
{
  id: "p1-cz-B4", level: 2, module: "cloze", topic: "cloze", passageId: "p1czB",
  passage: "Last summer I visited my grandparents in the countryside. It was my first time there, so everything (1)____ new to me. My grandpa taught me how (2)____ vegetables in the garden. (3)____ first it was difficult, but I soon learned. We also went fishing (4)____ the afternoon. I had a wonderful time and hope I (5)____ go there again next year.",
  stem: "(4) 处应填：",
  options: ["in", "at", "on", "for"],
  answer: 0,
  explanation: "in the afternoon = 在下午，固定搭配用 in。",
  optionNotes: ["对：in the afternoon 固定搭配", "错：at 用于 at noon/night", "错：on 用于具体某天下午(on Sunday afternoon)", "错：for 表持续"]
},
{
  id: "p1-cz-B5", level: 2, module: "cloze", topic: "cloze", passageId: "p1czB",
  passage: "Last summer I visited my grandparents in the countryside. It was my first time there, so everything (1)____ new to me. My grandpa taught me how (2)____ vegetables in the garden. (3)____ first it was difficult, but I soon learned. We also went fishing (4)____ the afternoon. I had a wonderful time and hope I (5)____ go there again next year.",
  stem: "(5) 处应填：",
  options: ["can", "could", "must", "need"],
  answer: 0,
  explanation: "hope 后接的从句表将来愿望，用 can（能够）→ hope I can go there again。",
  optionNotes: ["对：hope I can go = 希望我能去", "错：could 是过去/委婉，这里指明年", "错：must 是必须，语气不对", "错：need 意思不合"]
},

/* ======================= 高中基础语法 / 词汇 ============================= */
{
  id: "p1-g-01", level: 1, module: "grammar", topic: "article", type: "choice",
  stem: "____ sun rises in the east.",
  options: ["A", "An", "The", "/"],
  answer: 2,
  explanation: "世界上独一无二的事物前用 the：the sun（太阳）、the moon、the earth。",
  optionNotes: ["错：a 用于泛指“一个”", "错：an 用于元音开头词前", "对：独一无二事物用 the → the sun", "错：这里不能不加冠词"]
},
{
  id: "p1-g-02", level: 1, module: "grammar", topic: "article",
  stem: "He is ____ honest man; everyone believes him.",
  options: ["a", "an", "the", "/"],
  answer: 1,
  explanation: "a/an 看“读音”不看字母。honest 的 h 不发音，读起来以元音开头，用 an。",
  optionNotes: ["错：a 用于辅音音素开头", "对：honest 的 h 不发音 → an", "错：这里是泛指，不用 the", "错：单数可数名词前要加冠词"]
},
{
  id: "p1-g-03", level: 1, module: "grammar", topic: "preposition-place",
  stem: "There is a beautiful picture ____ the wall.",
  options: ["in", "on", "at", "to"],
  answer: 1,
  explanation: "东西贴在墙“表面”上用 on → on the wall。",
  optionNotes: ["错：in 表示“在里面”", "对：贴在表面用 on → on the wall", "错：at 表示地点“点”", "错：to 表方向"]
},
{
  id: "p1-g-04", level: 1, module: "grammar", topic: "preposition-place",
  stem: "Look! A bird is singing ____ the tree.",
  options: ["in", "on", "under", "at"],
  answer: 0,
  explanation: "鸟在树里（枝叶间）用 in the tree；长在树上的果实才用 on。",
  optionNotes: ["对：鸟在树里用 in the tree", "错：on the tree 指长在树上的东西(果子)", "错：under 是“在下面”", "错：at 不这么用"]
},
{
  id: "p1-g-05", level: 1, module: "grammar", topic: "there-be",
  stem: "There ____ some milk in the glass.",
  options: ["is", "are", "have", "has"],
  answer: 0,
  explanation: "There be 就近一致。milk 不可数，视为单数 → There is。",
  optionNotes: ["对：milk 不可数 → is", "错：are 接复数", "错：表示“有”不用 have 开头", "错：不用 has"]
},
{
  id: "p1-g-06", level: 1, module: "grammar", topic: "word-choice",
  stem: "She sings very ____.",
  options: ["good", "well", "nice", "beautiful"],
  answer: 1,
  explanation: "修饰动词 sings（怎么唱）要用副词。good 是形容词，它的副词是 well。",
  optionNotes: ["错：good 是形容词，不能修饰动词", "对：副词 well 修饰 sings", "错：nice 是形容词", "错：beautiful 是形容词"]
},
{
  id: "p1-g-07", level: 1, module: "grammar", topic: "much-many",
  stem: "There are ____ apples in the basket.",
  options: ["much", "a lot of", "a little", "little"],
  answer: 1,
  explanation: "apples 可数复数。a lot of 可数不可数都能修饰，这里最合适。much/a little/little 都修饰不可数。",
  optionNotes: ["错：much 修饰不可数", "对：a lot of 可修饰可数复数 apples", "错：a little 修饰不可数", "错：little 修饰不可数"]
},
{
  id: "p1-g-08", level: 2, module: "grammar", topic: "pronoun",
  stem: "Is there ____ in the room? — No, it's empty.",
  options: ["anybody", "somebody", "nobody", "everybody"],
  answer: 0,
  explanation: "疑问句里“有没有人”用 anybody。somebody 多用于肯定句。",
  optionNotes: ["对：疑问句用 anybody", "错：somebody 多用于肯定句", "错：nobody 本身是否定，不用于这种问句", "错：everybody 是“每个人”"]
},
{
  id: "p1-g-09", level: 1, module: "collocation", topic: "collocation",
  stem: "Please ____ your shoes before you come into the room.",
  options: ["take off", "take on", "put on", "turn off"],
  answer: 0,
  explanation: "take off = 脱掉（衣物鞋子）。句意：进屋前请脱鞋。",
  optionNotes: ["对：take off = 脱掉", "错：take on = 承担", "错：put on = 穿上（相反）", "错：turn off = 关掉（电器）"]
},
{
  id: "p1-g-10", level: 1, module: "collocation", topic: "collocation",
  stem: "It's cold outside. ____ your coat.",
  options: ["Take off", "Put on", "Turn off", "Look after"],
  answer: 1,
  explanation: "put on = 穿上。天冷了，穿上外套。",
  optionNotes: ["错：Take off = 脱掉（相反）", "对：Put on = 穿上", "错：Turn off = 关掉", "错：Look after = 照顾"]
},
{
  id: "p1-g-11", level: 2, module: "collocation", topic: "collocation",
  stem: "Who will ____ the baby when you are out?",
  options: ["look after", "look at", "look for", "look up"],
  answer: 0,
  explanation: "look after = 照顾。句意：你出门时谁照看宝宝？",
  optionNotes: ["对：look after = 照顾", "错：look at = 看着", "错：look for = 寻找", "错：look up = 查（单词）"]
},
{
  id: "p1-g-12", level: 2, module: "grammar", topic: "so-that",
  stem: "It was ____ a nice day that we went out for a picnic.",
  options: ["so", "such", "very", "too"],
  answer: 1,
  explanation: "such + a + 形容词 + 名词 + that...。这里 a nice day 是“冠词+形容词+名词”，用 such。（so 后面直接跟形容词：so nice a day）",
  optionNotes: ["错：so 后直接跟形容词(so nice)，不跟 a nice day", "对：such + a + 形容词 + 名词 → such a nice day", "错：very 不引导 that 从句", "错：too 不这么用"]
},
{
  id: "p1-g-13", level: 2, module: "grammar", topic: "word-choice",
  stem: "He is old ____ to go to school by himself.",
  options: ["enough", "too", "so", "very"],
  answer: 0,
  explanation: "形容词 + enough + to do = 足够……能做……。注意 enough 放在形容词后面：old enough。",
  optionNotes: ["对：old enough to do = 大得足以……", "错：too...to 是“太……不能”，且语序不对", "错：so 不这么搭配", "错：very 不接 to do 这个结构"]
},
{
  id: "p1-g-14", level: 2, module: "grammar", topic: "future-will",
  stem: "Look at those black clouds! It ____ rain soon.",
  options: ["will", "is going to", "rains", "rained"],
  answer: 1,
  explanation: "有眼前的迹象（乌云）预测将要发生，用 be going to。will 多表示当场决定或单纯将来。",
  optionNotes: ["错：will 多用于当场决定，不强调“有迹象”", "对：有迹象预测用 is going to", "错：rains 是一般现在时", "错：rained 是过去式"]
},
{
  id: "p1-g-15", level: 2, module: "grammar", topic: "correlative",
  stem: "____ of my parents is a doctor; they are both teachers.",
  options: ["Both", "Neither", "Either", "All"],
  answer: 1,
  explanation: "后文说“他们俩都是老师”，所以“父母俩都不是医生”。neither = 两者都不。",
  optionNotes: ["错：Both...are，且意思相反", "对：Neither = 两者都不，符合“都是老师”", "错：Either 是“两者之一”", "错：All 用于三者以上"]
},
{
  id: "p1-g-16", level: 2, module: "grammar", topic: "comparative",
  stem: "My English is bad, but his is even ____.",
  options: ["bad", "worse", "worst", "badder"],
  answer: 1,
  explanation: "bad 的比较级是不规则变化 worse。even 用来加强比较级（更……）。",
  optionNotes: ["错：bad 是原级", "对：bad 的比较级是 worse", "错：worst 是最高级", "错：没有 badder 这个词"]
},
{
  id: "p1-g-17", level: 1, module: "grammar", topic: "conjunction",
  stem: "I will call you ____ I arrive at the airport.",
  options: ["when", "because", "although", "so"],
  answer: 0,
  explanation: "“当我到机场时”用 when 引导时间状语从句。",
  optionNotes: ["对：when = 当……时", "错：because = 因为", "错：although = 尽管", "错：so = 所以"]
},
{
  id: "p1-g-18", level: 2, module: "grammar", topic: "possessive",
  stem: "This pen isn't mine. I think it's ____.",
  options: ["her", "she", "hers", "her's"],
  answer: 2,
  explanation: "空后没有名词，表示“她的（东西）”用名词性物主代词 hers。",
  optionNotes: ["错：her 后要跟名词(her pen)", "错：she 是主格", "对：hers = 她的（东西），后面不跟名词", "错：hers 没有撇号，her's 是错的"]
},

/* ============================ 会话 Conversation ========================== */
{
  id: "p1-cv-01", level: 1, module: "conversation", topic: "conversation",
  stem: "— How much is this shirt? — ____",
  options: ["It's 50 yuan.", "It's blue.", "Yes, please.", "It's nice."],
  answer: 0,
  explanation: "How much 问价格，要回答具体钱数 → It's 50 yuan。",
  optionNotes: ["对：问价格答钱数 → It's 50 yuan", "错：这是回答颜色", "错：答非所问", "错：这是评价好坏"]
},
{
  id: "p1-cv-02", level: 1, module: "conversation", topic: "conversation",
  stem: "— Are you ready to order? — ____",
  options: ["Yes, I'd like a hamburger.", "No problem.", "You're welcome.", "It's over there."],
  answer: 0,
  explanation: "餐厅里服务员问“可以点餐了吗”，回答要点菜 → Yes, I'd like a hamburger。",
  optionNotes: ["对：点餐 → I'd like a hamburger", "错：No problem 答非所问", "错：You're welcome 回应道谢", "错：It's over there 回答地点"]
},
{
  id: "p1-cv-03", level: 1, module: "conversation", topic: "conversation",
  stem: "— Hello, may I speak to Tom? — ____ (电话里)",
  options: ["Speaking.", "I'm Tom here.", "Yes, I am Tom now.", "Who are you?"],
  answer: 0,
  explanation: "打电话找某人，如果你就是本人，地道回答是 Speaking（我就是）。",
  optionNotes: ["对：电话用语 Speaking = 我就是", "错：I'm Tom here 不地道", "错：Yes, I am Tom now 不地道", "错：Who are you 不礼貌"]
},
{
  id: "p1-cv-04", level: 1, module: "conversation", topic: "conversation",
  stem: "— Shall we go swimming this afternoon? — ____",
  options: ["Good idea!", "You're welcome.", "Never mind.", "It doesn't matter."],
  answer: 0,
  explanation: "别人提议一起做某事(Shall we...)，同意用 Good idea!（好主意）。",
  optionNotes: ["对：接受提议 → Good idea!", "错：You're welcome 回应道谢", "错：Never mind 回应道歉", "错：It doesn't matter 回应道歉"]
},
{
  id: "p1-cv-05", level: 1, module: "conversation", topic: "conversation",
  stem: "— Would you like some tea? — ____",
  options: ["Yes, please.", "Here you are.", "You're welcome.", "The same to you."],
  answer: 0,
  explanation: "别人问“要喝点茶吗”，接受用 Yes, please（好的，谢谢）。",
  optionNotes: ["对：接受提供用 Yes, please", "错：Here you are 是递东西时说的", "错：You're welcome 回应道谢", "错：The same to you 回祝福"]
},

]);
