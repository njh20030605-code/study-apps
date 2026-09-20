/* ============================================================================
 * questions-mock.js —— 全真模拟卷（完形填空 + 阅读理解）
 *
 * 来源：用户提供的《全国各类成人高等学校招生考试专升本英语 全真模拟卷及答案解析（五套）》
 *      每题原书都带【答案】【考情点拨】【应试指导】，质量高。
 *
 * ⚠️ 重要：这些是**模拟卷，不是真题**（封面写明"全真模拟"）。
 *    所以标记 mock:true，**不带 real 字段**——不会混进「真题练习」里冒充真题。
 *    它们进的是「完形填空」「阅读理解」这两个送分板块步骤。
 *
 * 为什么要它：阅读 45 分 + 完形 30 分 ＝ 75 分，占全卷一半，
 *    而原题库这两块各只有 20 道、文章都很短。这批是真考长度（200-300 词）。
 *
 * ✅ 收录前我逐题独立推演并与原书答案核对；不一致或有歧义的会在 explanation 里注明。
 * ⚠️ 中文一律全角引号“”；英文原文里的双引号已用 \" 转义。
 * ========================================================================== */

/* ---------- 模拟卷（一）· 完形填空原文（电视购物） ---------- */
var MOCK1_CLOZE = "Have you ever had to decide whether to go shopping or stay home and watch TV on a weekend? Now you (21)____ do both at the same time. Home shopping television networks (网络) have become a (22)____ for many people to shop without (23)____ having to leave their home.\n\nSome shoppers are (24)____ of department stores and supermarkets — fighting the crowds, waiting in long lines, and sometimes having slight (25)____ of finding anything they want to buy. They'd rather sit quietly at home in front of the TV set and watch a friendly announcer describe a product (26)____ a model shows it. And they can shop around the clock, buying something (27)____ by making a phone call.\n\nDepartment stores and even mail-order companies are (28)____ to join in the success of home shopping. Large department stores are busy (29)____ their own TV channels (频道) to encourage TV shopping in the future. Customers can ask questions about products and place (30)____ , all through their TV sets.\n\nWill shopping by television (31)____ take the place of shopping in stores? Some industry managers think so. (32)____ many people find shopping at a real store a great enjoyment. And for many shoppers, it is still important to (33)____ or try on dresses they want to buy. That's (34)____ specialists say that in the future, home shopping will (35)____ together with store shopping but will never entirely replace it.";

window.QUESTIONS = (window.QUESTIONS || []).concat([
{ id:"mk1-cz-21", paper:"M1", ord:21, module:"cloze", topic:"cloze", level:2, mock:true, source:"全真模拟(一) · 完形 第21题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(21) 处应填：",
  options:["must","should","shall","can"], answer:3,
  explanation:"理解推断题。上文问“周末是去购物还是待在家看电视”，下文说“同时做两件事”——这是在讲**能够**做到，用 can。must（必须）、should（应该）、shall 都不合语境。",
  optionNotes:["错：must＝必须，语气不对","错：should＝应该，不是在提建议","错：shall 多用于第一人称征询","对：can＝能够，两件事可以同时做"] },
{ id:"mk1-cz-22", paper:"M1", ord:22, module:"cloze", topic:"cloze", level:2, mock:true, source:"全真模拟(一) · 完形 第22题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(22) 处应填：",
  options:["programme","way","reason","purpose"], answer:1,
  explanation:"词义辨析。a way for sb to do sth＝某人做某事的一种**方式**。电视购物成了很多人不出门就能买东西的方式。programme＝节目；reason＝原因；purpose＝目的，都不搭。",
  optionNotes:["错：programme＝节目，指不了“购物方式”","对：a way for...to...＝…的方式","错：reason＝原因","错：purpose＝目的"] },
{ id:"mk1-cz-23", paper:"M1", ord:23, module:"cloze", topic:"cloze", level:3, mock:true, source:"全真模拟(一) · 完形 第23题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(23) 处应填：",
  options:["ever","never","still","once"], answer:0,
  explanation:"词义辨析。without ever having to leave their home＝**根本不必**离开家。ever 用在 without 之后起加强语气的作用（“从来、一次都不用”）。",
  optionNotes:["对：without ever＝根本不必，加强语气","错：without never 双重否定，不通","错：still 表“仍然”，语气不合","错：once＝一次/曾经，不搭"] },
{ id:"mk1-cz-24", paper:"M1", ord:24, module:"cloze", topic:"cloze", level:2, mock:true, source:"全真模拟(一) · 完形 第24题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(24) 处应填：",
  options:["proud","fond","tired","careful"], answer:2,
  explanation:"固定搭配 **be tired of ＝ 厌烦**。破折号后面列的全是商场的坏处（挤人群、排长队），所以是“厌烦”。be proud of＝以…为荣；be fond of＝喜欢；be careful of＝小心。",
  optionNotes:["错：be proud of＝以…为荣，与后文的抱怨矛盾","错：be fond of＝喜欢，方向反了","对：be tired of＝厌烦，与“挤人群排长队”一致","错：be careful of＝小心提防"] },
{ id:"mk1-cz-25", paper:"M1", ord:25, module:"cloze", topic:"cloze", level:3, mock:true, source:"全真模拟(一) · 完形 第25题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(25) 处应填：",
  options:["sense","doubt","hope","feeling"], answer:2,
  explanation:"理解推断题。have slight hope of doing＝**希望渺茫**（几乎买不到想要的东西）。slight（微小的）＋hope 才构成“希望渺茫”这个意思，正好接着上文抱怨商场的不便。",
  optionNotes:["错：sense of 后面通常接抽象感受（sense of pride）","错：slight doubt＝略有怀疑，与“买不到”对不上","对：have slight hope of＝希望渺茫","错：feeling of 搭配不自然"] },
{ id:"mk1-cz-26", paper:"M1", ord:26, module:"cloze", topic:"cloze", level:2, mock:true, source:"全真模拟(一) · 完形 第26题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(26) 处应填：",
  options:["until","since","if","while"], answer:3,
  explanation:"连词辨析。播音员介绍产品**的同时**模特在展示——两个动作同时发生，用 while。until＝直到；since＝自从/既然；if＝如果，都讲不通。",
  optionNotes:["错：until＝直到…为止","错：since＝自从、既然","错：if＝如果，不是条件关系","对：while 表“与此同时”，两个动作同时进行"] },
{ id:"mk1-cz-27", paper:"M1", ord:27, module:"cloze", topic:"cloze", level:2, mock:true, source:"全真模拟(一) · 完形 第27题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(27) 处应填：",
  options:["suitably","cheaply","simply","hardly"], answer:2,
  explanation:"副词辨析。buying something simply by making a phone call＝**只需**打个电话就能买。simply 在这里表示“仅仅、只不过”，强调方便。hardly＝几乎不，意思正好反。",
  optionNotes:["错：suitably＝合适地","错：cheaply＝便宜地，原文没强调价格","对：simply＝仅仅、只需，强调方便","错：hardly＝几乎不，语义相反"] },
{ id:"mk1-cz-28", paper:"M1", ord:28, module:"cloze", topic:"cloze", level:2, mock:true, source:"全真模拟(一) · 完形 第28题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(28) 处应填：",
  options:["nervous","lucky","equal","eager"], answer:3,
  explanation:"固定搭配 **be eager to do ＝ 急于做某事**。电视购物成了潮流，百货公司和邮购公司都急着分这块蛋糕。",
  optionNotes:["错：be nervous to 不是常用搭配，且语义不合","错：be lucky to＝有幸，语气不对","错：be equal to＝等同于/胜任","对：be eager to do＝急于做某事"] },
{ id:"mk1-cz-29", paper:"M1", ord:29, module:"cloze", topic:"cloze", level:3, mock:true, source:"全真模拟(一) · 完形 第29题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(29) 处应填：",
  options:["putting up","making up","setting up","looking up"], answer:2,
  explanation:"动词短语辨析。**set up ＝ 建立、创办**（建立自己的电视购物频道）。put up＝搭起、张贴；make up＝编造、组成；look up＝查阅，都不合。",
  optionNotes:["错：put up＝搭起、张贴","错：make up＝编造、构成","对：set up＝建立、创办（频道）","错：look up＝查阅（词典）"] },
{ id:"mk1-cz-30", paper:"M1", ord:30, module:"cloze", topic:"cloze", level:2, mock:true, source:"全真模拟(一) · 完形 第30题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(30) 处应填：",
  options:["orders","goods","books","answers"], answer:0,
  explanation:"固定搭配 **place orders ＝ 订购、下订单**。顾客通过电视机就能咨询产品并下单。这个搭配写作里也能用。",
  optionNotes:["对：place orders＝下订单","错：place goods 不是固定搭配","错：place books 不通","错：place answers 不通"] },
{ id:"mk1-cz-31", paper:"M1", ord:31, module:"cloze", topic:"cloze", level:3, mock:true, source:"全真模拟(一) · 完形 第31题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(31) 处应填：",
  options:["lastly","finally","especially","fortunately"], answer:1,
  explanation:"副词辨析。这里问“电视购物**最终会不会**取代商店购物”，用 finally（最终、最后）。⚠️ 区分 lastly：lastly 是罗列要点时的“最后一点”，不表示时间上的最终结果。",
  optionNotes:["错：lastly 是罗列时的“最后一点”","对：finally＝最终、终究","错：especially＝尤其","错：fortunately＝幸运的是"] },
{ id:"mk1-cz-32", paper:"M1", ord:32, module:"cloze", topic:"cloze", level:3, mock:true, source:"全真模拟(一) · 完形 第32题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(32) 处应填：",
  options:["Then","Yet","However","Therefore"], answer:1,
  explanation:"上句说“业内人士认为会取代”，本句说“很多人觉得逛实体店是享受”——**转折**。Yet 可以直接放句首表转折。⚠️ however 也表转折，但它通常用逗号隔开（However, many people...），这里没有逗号，所以选 Yet。",
  optionNotes:["错：Then＝然后，不表转折","对：Yet 置于句首表转折，且不需逗号","错：However 表转折但后面通常要加逗号","错：Therefore＝因此，是顺承"] },
{ id:"mk1-cz-33", paper:"M1", ord:33, module:"cloze", topic:"cloze", level:2, mock:true, source:"全真模拟(一) · 完形 第33题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(33) 处应填：",
  options:["design","make","wear","touch"], answer:3,
  explanation:"理解推断题。连词 or 表**并列选择**，后面是 try on dresses（试穿衣服），所以前面应是同类动作——touch（摸一摸）。买衣服前“摸一摸或试一试”，符合逻辑。",
  optionNotes:["错：design＝设计，顾客不设计衣服","错：make＝制作","错：wear＝穿着（状态），与 try on 重复","对：touch＝触摸，与 try on 并列"] },
{ id:"mk1-cz-34", paper:"M1", ord:34, module:"cloze", topic:"cloze", level:2, mock:true, source:"全真模拟(一) · 完形 第34题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(34) 处应填：",
  options:["how","why","what","when"], answer:1,
  explanation:"固定句式 **That's why... ＝ 那就是…的原因**。前面讲了实体店的好处，所以专家才说未来两者并存。⚠️ 区分：That's why＝所以（引出结果）；That's because＝因为（引出原因）。",
  optionNotes:["错：That's how＝那就是…的方式","对：That's why＝那就是为什么，引出结果","错：That's what 后面要接缺成分的从句","错：That's when＝那就是…的时候"] },
{ id:"mk1-cz-35", paper:"M1", ord:35, module:"cloze", topic:"cloze", level:2, mock:true, source:"全真模拟(一) · 完形 第35题",
  passageId:"mk1cz", passage:MOCK1_CLOZE, stem:"(35) 处应填：",
  options:["exist","practise","follow","appear"], answer:0,
  explanation:"词义辨析。exist together with＝与…**并存**。专家预测未来电视购物将与商店购物并存，但永远不会完全取代它（but will never entirely replace it 是提示）。",
  optionNotes:["对：exist together with＝与…并存","错：practise＝练习、从事","错：follow＝跟随","错：appear＝出现"] },
]);

/* ==========================================================================
 * 模拟卷（一）· 阅读理解 5 篇 20 题
 * ⚠️ 两处与原书答案不一致，已按文意判定并在解析里注明：
 *    · 第55题：原书【答案】印为 B，但其自身【应试指导】写的是“怀特先生这样做是为了
 *      摆脱掉汤姆”——那就是 C。属印刷错误，本题按 C 收录。
 *    · 第42题：原书答案 D(in New York)。选项 B(on the Staten Island) 字面也说得通，
 *      但斯塔滕岛本就属于纽约，且 D 是更完整的表述，故沿用 D 并在解析里点明。
 * ========================================================================== */

var MK1_P1 = "Ann Curry is a famous news presenter of the NBC News \"Today\" show. When she was 15 she happened to walk into a bookstore in her hometown and began looking at the books on the shelves. The man behind the counter, Mac McCarley, asked if she'd like a job. She needed to start saving for college, so she said yes.\n\nAnn worked after school and during summer vacations, and the job helped pay for her first year of college. During college she would do many other jobs: she served coffee in the students' union, was a hotel maid and even made maps for the US Forest Service. But selling books was one of the most satisfying jobs.\n\nOne day a woman came into the bookstore and asked Ann for books on cancer (癌症). The woman seemed anxious. Ann showed her practically everything they had and found other books they could order. The woman left the store less worried, and Ann has always remembered the pride she felt in having helped her customer.\n\nYears later, as a television reporter in Los Angeles, Ann heard about a child who was born with problems with his fingers and his hand. His family could not afford a surgical (外科的) operation, and the boy lived in shame, hiding his hand in his pocket all the time.\n\nAnn persuaded her boss to let her do the story. After the story was broadcast, a doctor and a nurse called, offering to perform the surgical operation for free.\n\nAnn visited the boy in the recovery room after the operation. The first thing he did was to hold up his repaired hand and say, \"Thank you.\" What a sweet sense of satisfaction Ann Curry felt!\n\nAt McCarley's bookstore, Ann always sensed she was working for the customers, not the store. Today it's the same. NBC News pays her, but she feels as if she works for the people who watch the programmes, helping them make sense of the world.";

var MK1_P3 = "There is no creature that does not need sleep or complete rest every day.\n\nIf you want to know why, just try going without sleep for a long period of time. You will discover that your mind and body would become too tired to work properly. You would become irritable and find it hard to think clearly or concentrate on your work. So sleep is quite simply the time when the cells of your body recover from the work of the day and build up supplies of energy for the next period of activity.\n\nOne of the things we all know about sleep is that we are unconscious in sleep. We do not know what is going on around us. But that doesn't mean the body stops all activity. The important organs continue to work during sleep, but most of the body functions are slowed down.\n\nFor example, our breathing becomes slower and deeper. The heart beats more slowly, and the blood pressure is lower. Our arms and legs become limp (柔软的) and muscles are at rest. It would be impossible for our body to relax to such an extent if we were awake. So sleep does for us what the most quiet rest can not do.\n\nYour body temperature becomes lower when you are asleep, which is the reason people go to sleep under some kind of covers. And even though you are unconscious, many of your reflexes (反射动作) still work. For instance, if someone tickles (使觉得痒) your foot, you will put it away in your sleep, or even brush a fly from your forehead. You do these things without knowing it.";

var MK1_P5 = "Tom had once worked in a city office in London, but now he is out of work. He had a large family to support, so he often found himself in difficulty. He often visited Mr. White on Sundays, told him about his troubles, and asked for two or three pounds.\n\nMr. White, a man with a kind heart, found it difficult to refuse the money, though he himself was poor. Tom had already received more than thirty pounds from Mr. White, but he always seemed to be in need of some more.\n\nOne day, after telling Mr. White a long story of his troubles, Tom asked for five pounds.\n\nMr. White had heard this sort of thing before, but he listened patiently to the end. Then he said, \"I understand your difficulties, Tom. I'd like to help you. But I'm not going to give you five pounds this time. I'll lend you the money, and you can pay me off next time you see me.\"\n\nTom took the money, but he never appeared again.";

window.QUESTIONS = (window.QUESTIONS || []).concat([
/* ---- Passage One：Ann Curry（人物故事，事实细节为主） ---- */
{ id:"mk1-rd-36", paper:"M1", ord:36, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage One 第36题",
  passageId:"mk1p1", passage:MK1_P1, stem:"Ann Curry got her first job ____ .",
  options:["from her friend in a bookstore","a couple of years before college","at the NBC News \"Today\" show","when she was studying at university"], answer:1,
  explanation:"推理判断题。第一段说她 15 岁走进书店拿到工作，且“需要开始为上大学攒钱”——说明那时还没上大学，是上大学前几年。⚠️ 书店老板 Mac McCarley 是店主不是她朋友，A 错。",
  optionNotes:["错：McCarley 是店主，不是她的朋友","对：15岁、还在攒大学学费 → 上大学前几年","错：NBC 是很多年以后的工作","错：原文说她当时还需为上大学攒钱，尚未入学"] },
{ id:"mk1-rd-37", paper:"M1", ord:37, module:"reading", topic:"reading", level:1, mock:true, source:"全真模拟(一) · 阅读 Passage One 第37题",
  passageId:"mk1p1", passage:MK1_P1, stem:"At which part-time job did Ann Curry feel the happiest?",
  options:["The hotel.","The bookstore.","The students' union.","The US Forest Service."], answer:1,
  explanation:"事实细节题。第二段最后一句 But selling books was one of the most satisfying jobs（卖书是最让她满足的工作之一）。**看到 most satisfying 就锁定答案**，其余三个工作都只是罗列。",
  optionNotes:["错：hotel maid 只是罗列的工作之一","对：原文 selling books was one of the most satisfying jobs","错：学生会端咖啡只是罗列","错：为林业局画地图只是罗列"] },
{ id:"mk1-rd-38", paper:"M1", ord:38, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage One 第38题",
  passageId:"mk1p1", passage:MK1_P1, stem:"What particularly gives her the feeling of pride?",
  options:["Helping people through her work.","Reporting interesting stories.","Being able to do different jobs well.","Paying through her college education."], answer:0,
  explanation:"事实细节题。第三段末 Ann has always remembered the pride she felt in having helped her customer（帮到顾客带来的骄傲）。全文两个高光时刻——帮顾客找书、帮男孩做手术——都是“通过工作帮到人”。",
  optionNotes:["对：帮到顾客/帮到男孩，都是通过工作帮助别人","错：报道有趣的故事不是她自豪的点","错：做过多种工作只是经历，不是自豪来源","错：赚学费是结果，不是骄傲的来源"] },
{ id:"mk1-rd-39", paper:"M1", ord:39, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage One 第39题",
  passageId:"mk1p1", passage:MK1_P1, stem:"How did Ann help the child get the operation he needed?",
  options:["Ann persuaded the boy to speak on TV.","Ann paid for the operation herself.","Ann's boss agreed to raise money.","Ann's news report moved some doctors."], answer:3,
  explanation:"推理判断题。倒数第三段：节目播出后，一位医生和一位护士打来电话，提出免费做手术。所以是**她的报道打动了医生**。⚠️ 她说服的是自己的老板（让她做这个选题），不是说服男孩上电视。",
  optionNotes:["错：她说服的是老板，不是男孩","错：原文没说她自己出钱","错：老板只是同意她做选题，不是筹钱","对：报道播出后医生主动提出免费手术"] },

/* ---- Passage Three：Sleep（说明文，含词义题） ---- */
{ id:"mk1-rd-44", paper:"M1", ord:44, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage Three 第44题",
  passageId:"mk1p3", passage:MK1_P3, stem:"If you don't have as much sleep as your body needs, you will ____ .",
  options:["work properly","think clearly","keep your attention on your work","easily get angry"], answer:3,
  explanation:"事实细节题。第二段：You would become **irritable**（易怒）and find it hard to think clearly or concentrate。irritable＝易怒的，对应 easily get angry。⚠️ A、B、C 三项都是原文说“做不到”的事，是典型的反向干扰项。",
  optionNotes:["错：原文说 too tired to work properly，正好相反","错：原文说 hard to think clearly，相反","错：原文说难以集中注意力，相反","对：irritable＝易怒，对应 easily get angry"] },
{ id:"mk1-rd-45", paper:"M1", ord:45, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage Three 第45题",
  passageId:"mk1p3", passage:MK1_P3, stem:"The cells of your body develop supplies of energy ____ .",
  options:["when you are asleep","when you recover from your work of the day","in the next period of activity","when you are quiet"], answer:0,
  explanation:"事实细节题。第二段末：sleep is the time when the cells of your body recover... and **build up supplies of energy**——储备能量发生在**睡觉时**。⚠️ C 项 the next period of activity 是能量“用”在什么时候，不是“存”在什么时候，偷换了时间点。",
  optionNotes:["对：原文明说是 sleep is the time when...build up supplies of energy","错：recover 和 build up 是同时发生的，不是先后","错：下一段活动期是消耗能量，不是储备","错：安静≠睡着，原文强调的是睡眠"] },
{ id:"mk1-rd-46", paper:"M1", ord:46, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage Three 第46题",
  passageId:"mk1p3", passage:MK1_P3, stem:"In the clause \"...that we are unconscious in sleep\" (Para.3), the word \"unconscious\" means ____ .",
  options:["untiring","unmoved","quiet","not knowing what is happening around"], answer:3,
  explanation:"词义理解题。**猜词最可靠的办法是看紧挨着的下一句**——原文下一句就是 We do not know what is going on around us（我们不知道周围发生了什么），这就是 unconscious 的解释。",
  optionNotes:["错：untiring＝不知疲倦的","错：unmoved＝不动的/无动于衷的","错：quiet＝安静的，程度不够","对：下一句 We do not know what is going on around us 正是它的解释"] },
{ id:"mk1-rd-47", paper:"M1", ord:47, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage Three 第47题",
  passageId:"mk1p3", passage:MK1_P3, stem:"When you are sleeping, ____ .",
  options:["all of your reflexes stop working","most of your reflexes stop working","many of your reflexes still work","all of your reflexes still work"], answer:2,
  explanation:"细节题，考**程度词**。最后一段：many of your reflexes still work（许多反射仍在工作）。⚠️ 这类题专挖 all / most / many 的区别——原文说 many，就不能选 all 或 most。",
  optionNotes:["错：原文说许多反射仍在工作，不是全部停止","错：原文没说“大部分停止”","对：原文原话 many of your reflexes still work","错：不是“全部”仍在工作，程度过头"] },

/* ---- Passage Five：Tom 借钱（记叙文，含推理题） ---- */
{ id:"mk1-rd-52", paper:"M1", ord:52, module:"reading", topic:"reading", level:1, mock:true, source:"全真模拟(一) · 阅读 Passage Five 第52题",
  passageId:"mk1p5", passage:MK1_P5, stem:"Tom was now in difficulties because he ____ .",
  options:["worked in a city office and was poorly paid","was poorly paid and had a large family to support","was poorly paid and always spent money carelessly","was out of work and had a large family to support"], answer:3,
  explanation:"事实细节题。第一段前两句：now he is **out of work**（失业了），He had a **large family to support**（要养一大家子）。⚠️ 在城里上班是“曾经”（had once worked），不是现在；原文也没说他工资低或乱花钱。",
  optionNotes:["错：在城里办公室上班是过去的事，且没说工资低","错：现在是失业，不是“工资低”","错：原文没提乱花钱","对：out of work ＋ a large family to support，原文两点都有"] },
{ id:"mk1-rd-53", paper:"M1", ord:53, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage Five 第53题",
  passageId:"mk1p5", passage:MK1_P5, stem:"Altogether Tom received ____ from Mr. White.",
  options:["at least thirty-five pounds","exactly thirty-five pounds","less than thirty pounds","five pounds"], answer:0,
  explanation:"事实细节题＋算数。第二段：已经拿了 **more than thirty pounds**（三十多镑），后来又要了 5 镑 → 至少 35 镑。⚠️ 原文是 more than thirty（不止三十），所以只能说“至少”35，不能说“恰好”35。",
  optionNotes:["对：三十多镑 ＋ 5 镑 → 至少 35 镑","错：原文是 more than thirty，不是正好三十","错：方向反了，不止三十","错：5 镑只是最后一次要的"] },
{ id:"mk1-rd-54", paper:"M1", ord:54, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage Five 第54题",
  passageId:"mk1p5", passage:MK1_P5, stem:"Every time Tom went to Mr. White, he would ____ .",
  options:["directly ask for some money","give some reasons before asking for money","give reasons and then borrow five pounds","ask for money before explaining his troubles"], answer:1,
  explanation:"事实细节题，考**先后顺序**。第一段：told him about his troubles, **and** asked for；第三段：**after** telling a long story of his troubles, Tom asked for five pounds——都是先诉苦、后要钱。⚠️ C 项“5 镑”只是最后一次的数目，平时是 two or three pounds。",
  optionNotes:["错：不是直接开口，每次都先讲一堆困难","对：先说理由（诉苦）再要钱","错：5 镑只是最后一次，平时是两三镑","错：顺序反了，是先诉苦后要钱"] },
{ id:"mk1-rd-55", paper:"M1", ord:55, module:"reading", topic:"reading", level:3, mock:true, source:"全真模拟(一) · 阅读 Passage Five 第55题",
  passageId:"mk1p5", passage:MK1_P5, stem:"Mr. White decided to lend, not to give Tom five pounds in order to ____ .",
  options:["encourage him to come again","get all his money back","get rid of him","thank him for his stories"], answer:2,
  explanation:"推理判断题。怀特先生把“给”改成“借”，还说下次见面要还钱——**结果汤姆再也没出现**。这个结果反过来说明他的用意就是让汤姆别再来，即 get rid of him（摆脱他）。\n⚠️ 说明：原书此题【答案】印为 B，但原书自己的解析写的是“怀特先生这样做是为了摆脱掉汤姆”，即 C。答案与解析自相矛盾，属印刷错误，本题按文意与解析判定为 C。",
  optionNotes:["错：正好相反，是不想让他再来","错：他此前送出去三十多镑都没要过，重点不在收回钱","对：把“给”改成“借”，汤姆果然再没出现——目的是摆脱他","错：他并不感谢汤姆的故事"] },
]);

/* ---------- 模拟卷（一）· 补录 Passage Two / Passage Four ---------- */
var MK1_P2 = "Lawn tennis is a good sport, being based on the ancient game of court tennis, which probably came up in Egypt or Persia some 2,500 years ago. Major Walter Wingfield thought that something like court tennis could be played outdoors on lawns, and in December 1873, he introduced his new game, which he called Sphairistike, at a lawn party in Wales. The sport became popular very rapidly, but the strange, difficult name disappeared almost at once, being replaced by the very simple and logical term \"lawn tennis\".\n\nBy 1874 the game was being played by British soldiers in Bermuda, and in the early months of that year a young lady named Mary Outerbridge returned from Bermuda to New York, bringing with her the equipment necessary to play the new game. With the help of one of her brothers, she laid out a court on the grounds of the Staten Island Cricket and Baseball Club, and there, in the spring of 1874, Miss Outerbridge and some of her friends played the first game of lawn tennis in the United States.\n\nAnd just two years later, in 1876, the first United States lawn tennis tournament (锦标赛) was held — at Nahant near Boston.";

var MK1_P4 = "The first European stock exchange was established in Antwerp, Belgium (比利时), in 1531. There were no stock exchanges in England until the 1700's. A man wishing to buy or sell shares of stock had to find a broker (agents) to transact his business for him. In London, he usually went to a coffee house, because brokers often gathered there. In 1773, the brokers of London formed a stock exchange.\n\nIn New York City, brokers met under an old button-wood tree on Wall Street. They organized the New York Stock Exchange in 1792. The American Stock Exchange, the second largest in the United States, was formerly called the Curb Exchange because of its origin on the streets of New York City.\n\nA stock exchange is a market place where member brokers buy and sell stocks and bonds (债券) of American and foreign businesses on behalf of the public. A stock exchange provides a market place for stocks and bonds in the same way a board of trade does for commodities. The stockbrokers receive a small commission on each transaction they make.\n\nThe stockholder may sell his stock wherever he wants to unless the corporation has some special rule to prevent it. Prices of stock change according to general business conditions and the earnings and future prospects (前景) of the company. If the business is doing well, the stockholder may be able to sell his stock for a profit. If it is not, he may have to take a loss.";

window.QUESTIONS = (window.QUESTIONS || []).concat([
{ id:"mk1-rd-40", paper:"M1", ord:40, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage Two 第40题",
  passageId:"mk1p2", passage:MK1_P2, stem:"Mary Outerbridge is important in the history of lawn tennis because ____ .",
  options:["she invented it","she gave it its name","she introduced it to Bermuda","she brought it to America"], answer:3,
  explanation:"事实细节题。第二段：她从百慕大回到纽约，**随身带回了打这项新运动所需的器材**，并在美国打了第一场草地网球。所以她的历史地位在于「把草地网球带到了美国」。",
  optionNotes:["错：发明者是 Walter Wingfield","错：lawn tennis 这个名字是自然取代原名，不是她起的","错：方向反了，她是从百慕大回美国","对：bringing with her the equipment...played the first game in the United States"] },
{ id:"mk1-rd-41", paper:"M1", ord:41, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage Two 第41题",
  passageId:"mk1p2", passage:MK1_P2, stem:"The new game called Sphairistike appeared in ____ in 1873.",
  options:["America","Europe","Bermuda","Egypt"], answer:1,
  explanation:"事实细节题＋常识。第一段：1873 年 12 月他在 **Wales（威尔士）** 的草地聚会上推出这项新运动。威尔士属于欧洲，所以选 Europe。⚠️ 这类题需要把地名归到大洲。",
  optionNotes:["错：1874 年才传到美国","对：威尔士在欧洲","错：1874 年英国士兵才在百慕大打","错：埃及是 2500 年前场地网球的可能起源，不是 1873 年"] },
{ id:"mk1-rd-42", paper:"M1", ord:42, module:"reading", topic:"reading", level:3, mock:true, source:"全真模拟(一) · 阅读 Passage Two 第42题",
  passageId:"mk1p2", passage:MK1_P2, stem:"The first United States lawn tennis game was played ____ .",
  options:["at Nahant","on the Staten Island","in Boston","in New York"], answer:3,
  explanation:"事实细节题。第二段：她回到 **New York**，在 Staten Island 板球棒球俱乐部的场地上划出球场，1874 年春天在**那里**打了美国第一场草地网球。\n⚠️ B 项字面也沾边（确实在斯塔滕岛），但斯塔滕岛本就是纽约的一个区，D 是更完整准确的表述；且原文明写 returned...to New York。at Nahant 是两年后第一次**锦标赛**的地点，别和「第一场比赛」混。",
  optionNotes:["错：Nahant 是 1876 年首届锦标赛的地点，不是第一场比赛","错：斯塔滕岛属于纽约，D 的表述更完整（原文也点明 returned to New York）","错：波士顿附近的 Nahant 是锦标赛地点","对：她回到纽约并在那里打了美国第一场"] },
{ id:"mk1-rd-43", paper:"M1", ord:43, module:"reading", topic:"reading", level:3, mock:true, source:"全真模拟(一) · 阅读 Passage Two 第43题",
  passageId:"mk1p2", passage:MK1_P2, stem:"Which of the following statements is NOT true?",
  options:["Lawn tennis became popular very rapidly.","It was Major Walter Wingfield who invented court tennis.","The sport was called \"lawn tennis\" shortly after it was invented.","Miss Outerbridge set up a lawn tennis court with the help of her brother."], answer:1,
  explanation:"**NOT true 题（找错的那个）**。第一段说得很清楚：court tennis（场地网球）是 2500 年前就有的古老运动，Wingfield 是在它基础上想出了**草地**网球。所以说他发明了 court tennis 是错的。\n⚠️ 做 NOT true 题的诀窍：逐项回原文核对，找到**唯一与原文冲突**的那项。",
  optionNotes:["错(即符合原文)：原文 The sport became popular very rapidly","对(即与原文冲突，选它)：他发明的是 lawn tennis，court tennis 是 2500 年前的古老运动","错(符合原文)：怪名字很快被 lawn tennis 取代","错(符合原文)：With the help of one of her brothers"] },

{ id:"mk1-rd-48", paper:"M1", ord:48, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage Four 第48题",
  passageId:"mk1p4", passage:MK1_P4, stem:"In the 1600's, if a man wanted to buy or sell shares of stock, he had to do it through ____ .",
  options:["the government","himself","a broker","the stock exchange"], answer:2,
  explanation:"事实细节题＋时间定位。第一段：英国直到 1700 年代才有证券交易所；在那之前，想买卖股票**必须找经纪人(broker)**代办。题目问的是 1600 年代，正是「还没有交易所」的时期，所以只能通过经纪人。",
  optionNotes:["错：原文没提政府","错：原文明说必须找经纪人代办","对：had to find a broker to transact his business for him","错：1700年代之前英国还没有证券交易所"] },
{ id:"mk1-rd-49", paper:"M1", ord:49, module:"reading", topic:"reading", level:1, mock:true, source:"全真模拟(一) · 阅读 Passage Four 第49题",
  passageId:"mk1p4", passage:MK1_P4, stem:"The second largest stock exchange in the U.S. used to be called ____ .",
  options:["the Wall Street Exchange","the New York Stock Exchange","the Curb Exchange","the U.S. Exchange"], answer:2,
  explanation:"事实细节题。第二段：The American Stock Exchange, **the second largest** in the United States, was **formerly called the Curb Exchange**。formerly called＝过去叫作，正对应题干的 used to be called。",
  optionNotes:["错：原文没有这个名称","错：纽约证券交易所是最大的，不是第二","对：原文 formerly called the Curb Exchange","错：原文没有这个名称"] },
{ id:"mk1-rd-50", paper:"M1", ord:50, module:"reading", topic:"reading", level:3, mock:true, source:"全真模拟(一) · 阅读 Passage Four 第50题",
  passageId:"mk1p4", passage:MK1_P4, stem:"Which of the statements is true?",
  options:["The stockholder can sell his stock anywhere at any time.","There were no stock exchanges in England in the 1700's.","The price of stock is not stable.","The stockbrokers do the transaction without charging the stockholders."], answer:2,
  explanation:"判断题。最后一段：股价**随公司经营状况和未来前景而变化**——说明股价不稳定，C 正确。\n⚠️ 其余三项都是「细节被改动」的典型陷阱：A 漏掉了 unless the corporation has some special rule（有限制条件）；B 把 until the 1700's（直到1700年代才有）说反；D 与 receive a small commission（收取佣金）矛盾。",
  optionNotes:["错：原文有 unless 限制条件，不是随时随地都能卖","错：原文是「直到1700年代才有」，即1700年代开始有了","对：股价随经营状况和前景变化 → 不稳定","错：原文明说经纪人每笔交易收取少量佣金"] },
{ id:"mk1-rd-51", paper:"M1", ord:51, module:"reading", topic:"reading", level:2, mock:true, source:"全真模拟(一) · 阅读 Passage Four 第51题",
  passageId:"mk1p4", passage:MK1_P4, stem:"The passage is mainly about ____ .",
  options:["the Wall Street","the stock exchange","the stock","the stockholder and stockbroker"], answer:1,
  explanation:"**主旨大意题**。通读四段：①欧洲和英国交易所的由来 ②纽约交易所的成立 ③交易所是什么 ④股票在交易所里如何买卖——**每段都围绕 stock exchange**，所以主旨是证券交易所。\n⚠️ 主旨题诀窍：找**贯穿全文**的那个词，别被某一段里出现的细节词（Wall Street、stockholder）带偏。",
  optionNotes:["错：华尔街只在第二段出现一次","对：四段都围绕 stock exchange 展开","错：股票是话题的一部分，但全文讲的是交易所","错：股东和经纪人只是其中的角色"] },
]);

/* ==========================================================================
 * 模拟卷（一）· 补全对话（15 分送分板块）
 * ⚠️ 题型改编说明：原卷是「8 选 5 配对」，与本题库的四选一结构不同，
 *    这里把每空改成四选一（正确项 ＋ 原卷另外 3 个选项作干扰），
 *    考点和语境完全保留。所以标 adapted:true。
 * ⚠️ 原书第58题答案印为 B(I have no idea)，但 B 已是第56题的答案——8选5不可能重复；
 *    按对话逻辑（“我有免费票” → “一起去吧”）应为 Let's go together。本题按此收录。
 * ========================================================================== */
var MK1_DLG = "A: What do you plan to do this weekend?\nB: (56)____\nA: I hear there's going to be a basketball match this Sunday. Tom and I are going to watch it. (57)____ ?\nB: Of course. Basketball is my favourite. But I have no ticket for the match. What a pity!\nA: You're lucky. I have some free tickets. (58)____\nB: Great! (59)____ ?\nA: Let's meet at the bus stop at half past five.\nB: I think there must be a big crowd of people there. (60)____ ?\nA: OK. See you at five o'clock.\nB: See you.";

window.QUESTIONS = (window.QUESTIONS || []).concat([
{ id:"mk1-cv-56", paper:"M1", ord:56, module:"conversation", topic:"conversation", level:1, mock:true, adapted:true,
  source:"全真模拟(一) · 补全对话 第56题（8选5改编为四选一）",
  passageId:"mk1dlg", passage:MK1_DLG, stem:"(56) 处应填：",
  options:["I have no idea.","Thank you all the same.","It doesn't matter.","Let's go together."], answer:0,
  explanation:"A 问「你这周末打算做什么」，而下文 A 接着主动提议去看球赛——说明 B 并没有安排。**I have no idea＝我还没想好**，最自然。\n💡 送分套路：被问计划却没主意，标准答法就是 I have no idea. / I haven't decided yet.",
  optionNotes:["对：I have no idea＝还没想好，符合下文A主动提议","错：Thank you all the same＝还是要谢谢你（用于对方帮不上忙时）","错：It doesn't matter＝没关系（用于对方道歉时）","错：这是后面第58空的答语"] },
{ id:"mk1-cv-57", paper:"M1", ord:57, module:"conversation", topic:"conversation", level:1, mock:true, adapted:true,
  source:"全真模拟(一) · 补全对话 第57题（8选5改编为四选一）",
  passageId:"mk1dlg", passage:MK1_DLG, stem:"(57) 处应填：",
  options:["What are you going to do","Do you like basketball","When and where shall we meet","What about making it a little earlier"], answer:1,
  explanation:"看**下一句的回答**：Of course. Basketball is my favourite.（当然，篮球是我的最爱）——这是在回答「你喜欢篮球吗」。\n💡 补全对话最好用的方法：**空格后面那句就是答案的镜子**，先看回答再倒推问题。",
  optionNotes:["错：A 上一句已经问过周末计划了，不会重复问","对：下一句 Of course. Basketball is my favourite. 正是对它的回答","错：约时间地点是后面第59空的事","错：改早一点是最后第60空的事"] },
{ id:"mk1-cv-58", paper:"M1", ord:58, module:"conversation", topic:"conversation", level:2, mock:true, adapted:true,
  source:"全真模拟(一) · 补全对话 第58题（8选5改编为四选一）",
  passageId:"mk1dlg", passage:MK1_DLG, stem:"(58) 处应填：",
  options:["I have no idea.","Let's go together.","Thank you all the same.","It doesn't matter."], answer:1,
  explanation:"上文 B 说「没票，好可惜」，A 说「你走运，我有免费票」——顺理成章就是**邀请一起去**：Let's go together. 下一句 B 回 Great!（太好了）也印证是接受邀请。\n⚠️ 原书此题答案印为 I have no idea，但那已是第56题的答案，8选5不可能重复用，且放这里完全不通，属印刷错误。",
  optionNotes:["错：这是第56空的答案，且此处语义不通","对：有免费票 → 一起去吧，下句 Great! 正是接受邀请","错：Thank you all the same 用于对方帮不上忙","错：It doesn't matter 用于回应道歉"] },
{ id:"mk1-cv-59", paper:"M1", ord:59, module:"conversation", topic:"conversation", level:1, mock:true, adapted:true,
  source:"全真模拟(一) · 补全对话 第59题（8选5改编为四选一）",
  passageId:"mk1dlg", passage:MK1_DLG, stem:"(59) 处应填：",
  options:["Do you like basketball","What are you going to do","When and where shall we meet","It doesn't matter"], answer:2,
  explanation:"看下一句：Let's meet at the **bus stop** at **half past five**（五点半在公交站见）——回答的正是**时间和地点**，所以问的是 When and where shall we meet。\n💡 约见面的标准句式：When and where shall we meet? 作文和口语都能直接用。",
  optionNotes:["错：喜不喜欢篮球前面已经问过","错：做什么计划前面已经问过","对：下一句回答了时间(half past five)和地点(bus stop)","错：与上下文无关"] },
{ id:"mk1-cv-60", paper:"M1", ord:60, module:"conversation", topic:"conversation", level:2, mock:true, adapted:true,
  source:"全真模拟(一) · 补全对话 第60题（8选5改编为四选一）",
  passageId:"mk1dlg", passage:MK1_DLG, stem:"(60) 处应填：",
  options:["What about making it a little earlier","When and where shall we meet","Let's go together","Thank you all the same"], answer:0,
  explanation:"B 说「那儿人肯定很多」，A 回「好，五点见」——从五点半改成五点，说明 B 提的是**早一点**：What about making it a little earlier?\n💡 **What about / How about + doing** 是提建议的万能句式，补全对话和写作里都是高频送分点。",
  optionNotes:["对：A 回答「五点见」＝从五点半提前了，正是响应这个建议","错：时间地点上一空已约好","错：一起去在第58空已说过","错：与语境无关"] },
]);
