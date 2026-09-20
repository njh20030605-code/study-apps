/* ============================================================================
 * lessons.js —— 语法微课：像新概念那样，一课讲一个套路 + 课后练习
 * ----------------------------------------------------------------------------
 * 为什么有这个文件：用户反馈「定语从句这些我根本没学过，纯刷题看解析都看不懂」。
 * 刷题只对学过的东西有用；没学过的要先上课。每课结构：
 *   teach: 讲解块（写给零基础，先中文找感觉 → 规则 → 例句 → 口诀）
 *   qids:  课后练习的核心题（对应的搭桥题，讲什么练什么）
 *   topics: 题不够时从这些 topic 里按易到难补足
 * 课的顺序就是学习顺序（考点 1→7，每个考点由浅入深）。
 * ========================================================================== */

window.LESSONS = [

/* ==================== 考点1 非谓语动词 ==================== */
{
  id: "P1L1", point: 1, title: "一个句子只有一个“真动词”（doing 组）",
  teach: [
    { h: "先看一句中文", p: "“我喜欢听音乐。”这句里有两个动作：喜欢、听。中文可以把两个动词并排放，英文不行——英文一个句子只能有一个“真动词”，其余的动作必须“变形”让位。这是整个非谓语的地基，记住这一条，后面全通。" },
    { h: "第一种变形：-ing（叫 doing）", p: "enjoy 已经是这句的真动词了，后面的 listen 就得变成 listening：", ex: [["I enjoy listening to music.", "我喜欢听音乐。"], ["She finished doing her homework.", "她把作业做完了。"]] },
    { h: "哪些词后面接 doing？", p: "一批“享受/坚持/完成”类的词，后面固定接 doing：enjoy（喜欢）、finish（完成）、practice（练习）、keep（坚持）、mind（介意）、avoid（避免）。先记牢 enjoy 和 finish 这两个最常考的。" },
    { h: "口诀", p: "一句一真动，其余要变形；享受完成类，后面加 doing。" },
  ],
  qids: ["br-nf-01", "br-nf-03"], topics: ["non-finite", "gerund"],
},
{
  id: "P1L2", point: 1, title: "还没做的事用 to do",
  teach: [
    { h: "对比昨天的 doing", p: "“我想回家。”——“回家”这个动作发生了吗？还没有，是想要去做。还没发生、将来才做的动作，用 to + 动词原形（叫 to do）。", ex: [["I want to go home.", "我想回家。（还没回）"], ["He decided to study English every day.", "他决定每天学英语。（决定了，接下来才做）"]] },
    { h: "哪些词后面接 to do？", p: "一批“想要/决定/希望/计划”类的词：want、decide、hope、plan、promise（承诺）。它们的共同点：说的都是还没发生的事。" },
    { h: "形容词后面也接 to do", p: "高兴、难过这类形容词，后面用 to do 说明原因：", ex: [["I am happy to see you.", "见到你很高兴。"], ["She is ready to start.", "她准备好开始了。"]] },
    { h: "口诀", p: "已做享受加 doing，没做想做 to do；高兴难过说原因，后面也是 to do。" },
  ],
  qids: ["br-nf-02", "br-nf-04", "br-nf-07"], topics: ["non-finite"],
},
{
  id: "P1L3", point: 1, title: "stop 两兄弟 + 动作当主语",
  teach: [
    { h: "stop 后面两种接法，意思相反", p: "stop doing = 停止正在做的事；stop to do = 停下手头的事、去做另一件。考试就爱考这个区别。", ex: [["Stop talking! The baby is sleeping.", "别说话了！宝宝在睡觉。（停止说话）"], ["He stopped to drink some water.", "他停下来喝了点水。（停下别的事，去喝水）"]] },
    { h: "判断法", p: "问自己一句：这个动作是要“不做了”还是“要去做”？不做了 → doing；要去做 → to do。" },
    { h: "动作也能当主语", p: "“游泳很危险。”——“游泳”在这里不是动作，是被谈论的一件事，要写成 doing 形式（叫动名词），整个当单数看：", ex: [["Swimming in the river is dangerous.", "在河里游泳很危险。（Swimming 当主语，动词用 is）"]] },
  ],
  qids: ["br-nf-05", "br-nf-06"], topics: ["non-finite", "gerund"],
},

/* ==================== 考点2 定语从句 ==================== */
{
  id: "P2L1", point: 2, title: "定语从句是什么：who 和 that",
  teach: [
    { h: "中文和英文，描述放的位置不一样", p: "想说“那个男人是我爸”，同时补充“他正在和 Tom 说话”。\n中文习惯把补充放在**前面**：“正在和 Tom 说话的那个男人是我爸。”\n英文习惯把补充放在**后面**：The man + who is talking to Tom + is my father.\n位置相反，这就是定语从句读着别扭的全部原因。" },
    { h: "读英文长句的办法：打括号", p: "看到 who / that / which，就在心里打个括号，把括号里的先跳过去，读完主干再回头看。这样再长的句子也不会晕：",
      ex: [["The man (who is talking to Tom) is my father.", "主干：那个男人是我爸。　括号补充：他正在和 Tom 说话。", "先读主干 The man is my father，再回头看括号"]] },
    { h: "接头的小词怎么选：看人还是物", p: "被描述的是人 → 用 who；是物 → 用 that（或 which）。就这一条，先别管别的。",
      ex: [["The man who is talking to Tom is my father.", "那个男人是我爸——就是正在跟 Tom 说话的那个。", "man 是人 → who；主干 The man is my father"],
           ["This is the photo that I took in Beijing.", "这是我在北京拍的照片。", "photo 是物 → that"]] },
    { h: "练一个判断动作", p: "看到空格，先往前看一个词：是人还是物？人选 who，物选 that。今天只练这一个动作。" },
  ],
  qids: ["br-rc-01", "br-rc-02", "br-rc-03"], topics: ["relative-clause"],
},
{
  id: "P2L2", point: 2, title: "“谁的” = whose",
  teach: [
    { h: "别硬翻，拆成两句就懂了", p: "The boy whose father is a doctor is my friend.\n硬翻成中文是“那个爸爸是医生的男孩是我朋友”——读着很绕，因为中文不习惯这么长的前置修饰。\n**用打括号法拆开**：The boy (whose father is a doctor) is my friend.\n主干：那个男孩是我朋友。　括号补充：他爸爸是医生。\n中国人平时会说：“我有个朋友，他爸爸是医生。”意思完全一样。",
      ex: [["The boy whose father is a doctor is my friend.", "我有个朋友，他爸爸是医生。", "主干 The boy is my friend；括号里 whose father is a doctor 补充说明这男孩"]] },
    { h: "whose 就是“他的 / 她的 / 它的”", p: "whose 后面一定接名词，等于把 his / her / its 换了个说法：\n他爸爸是医生 → his father is a doctor\n接到男孩后面 → the boy **whose** father is a doctor" },
    { h: "一眼认出 whose 的方法", p: "空格后面如果紧跟着一个名词（father、car、name……），十有八九是 whose。对比：who 后面跟的是动词（who is talking）。",
      ex: [["The man whose car was stolen called the police.", "有个人的车被偷了，他报了警。", "空格后是名词 car → whose；主干是 The man called the police"]] },
  ],
  qids: ["br-rc-06"], topics: ["relative-clause"],
},
{
  id: "P2L3", point: 2, title: "where 和 when：从句“不缺东西”才轮到它们",
  teach: [
    { h: "关键一步：把从句单独读一遍", p: "This is the school ____ I study. 把后半句单独读：I study（我学习）——主语有、动词有，什么都不缺。不缺东西的完整句子，只能补“在哪里/在何时”，所以用 where/when。",
      ex: [["This is the school where I study.", "这就是我上学的那个学校。", "从句 I study 完整不缺东西 → where"],
           ["I remember the day when we first met.", "我还记得那天，我们第一次见面。", "从句 we met 完整，day 是时间 → when"]] },
    { h: "最经典的坑", p: "The house ____ we live in is very old. 别看到 house 就选 where！单独读从句：we live in ____——in 后面缺东西！缺东西就用 that/which。只有 we live（没有 in）才用 where。",
      ex: [["The house that we live in is very old.", "我们住的那所房子很旧。", "主干 The house is very old；从句里 in 的宾语缺了 → that"]] },
    { h: "总结成一句", p: "从句缺人缺物 → who/that；缺“谁的” → whose；什么都不缺 → where（地点）/ when（时间）。" },
  ],
  qids: ["br-rc-04", "br-rc-05", "br-rc-07"], topics: ["relative-clause"],
},

/* ==================== 考点3 时态 ==================== */
{
  id: "P3L1", point: 3, title: "since / for / already → 现在完成时",
  teach: [
    { h: "现在完成时管什么", p: "“我从 2020 年起就住在上海。”——住这件事从过去开始、一直延续到现在。这种“从过去到现在”的事，用 have/has + 过去分词（done）。" },
    { h: "不用理解，抓标志词", p: "考场上不用分析，看到这几个词直接选完成时：since（自从）、for + 一段时间、already（已经）、yet、just。", ex: [["I have lived in Shanghai since 2020.", "我从 2020 年起住在上海。"], ["She has already finished her homework.", "她已经做完作业了。"]] },
    { h: "结构拆开看", p: "have/has + done。主语是 he/she/it 用 has，其余用 have。done 是动词的第三种形态（过去分词），规则动词就是 -ed。" },
  ],
  qids: ["br-ts-01", "br-ts-03"], topics: ["present-perfect"],
},
{
  id: "P3L2", point: 3, title: "ago → 过去式；Look! → 进行时",
  teach: [
    { h: "ago 一出现，过去式跑不掉", p: "“他两天前去了北京。”——两天前，过去某个时间点的事，动词用过去式。标志词：ago、yesterday、last week/year、just now。", ex: [["He went to Beijing two days ago.", "他两天前去了北京。"]] },
    { h: "一个必考的坑", p: "完成时不能和 ago 这种明确的过去时间连用。看到 ago 却给你 has gone 这个选项，那是坑，别踩。" },
    { h: "Look! / Listen! → 正在发生", p: "让人“看！听！”，说明动作此刻正在眼前，用 am/is/are + doing：", ex: [["Look! The children are playing in the park.", "看！孩子们正在公园里玩。"]] },
  ],
  qids: ["br-ts-02", "br-ts-06"], topics: ["tense", "present-continuous", "present-simple"],
},
{
  id: "P3L3", point: 3, title: "被打断的动作 + 过去的过去",
  teach: [
    { h: "was doing：过去正在进行、被打断", p: "“电话响的时候我正在看电视。”——“看电视”正在进行，被“电话响”打断。被打断的那个动作用 was/were + doing：", ex: [["I was watching TV when the phone rang.", "电话响时我正在看电视。"]] },
    { h: "had done：过去的过去", p: "“我到的时候，电影已经开始了。”——“到”是过去，“开始”比“到”还早，是过去的过去，用 had + done。标志组合：By the time + 过去式。", ex: [["By the time I arrived, the film had begun.", "我到的时候电影已经开始了。"]] },
    { h: "两个一起记", p: "两个过去动作：同时进行被打断 → was doing；一先一后 → 先的用 had done。" },
  ],
  qids: ["br-ts-04", "br-ts-05"], topics: ["past-continuous", "past-perfect"],
},

/* ==================== 考点4 虚拟语气 ==================== */
{
  id: "P4L1", point: 4, title: "虚拟语气入门：If I were you",
  teach: [
    { h: "什么叫虚拟", p: "“如果我是你……”——我不可能是你，这是跟现实相反的假设。英文对这种“不可能的假设”有专门的写法，叫虚拟语气。" },
    { h: "第一条规则：be 一律用 were", p: "虚拟语气里 be 动词不分人称，一律 were（不用 was——这是考试最爱设的坑）：", ex: [["If I were you, I would say sorry to her.", "如果我是你，我会向她道歉。"], ["I wish I were taller.", "我要是再高点就好了。"]] },
    { h: "wish 也是虚拟", p: "wish（真希望……）后面的事都是没实现的，跟 if 一样用过去式、be 用 were。" },
  ],
  qids: ["br-sj-01", "br-sj-03"], topics: ["subjunctive"],
},
{
  id: "P4L2", point: 4, title: "三个公式对照：would do / would have done / 主将从现",
  teach: [
    { h: "公式一：与现在相反", p: "现在其实没钱，假设有——If + 过去式，主句 would + 原形：", ex: [["If I had money now, I would buy a new phone.", "我现在要是有钱，就买新手机。"]] },
    { h: "公式二：与过去相反", p: "当时没努力，已经改不了了——If + had done，主句 would have done：", ex: [["If he had studied hard, he would have passed the exam.", "他当时努力的话，就通过考试了。"]] },
    { h: "公式三：不是虚拟！主将从现", p: "“如果明天他有空，他会帮我们。”——明天有空完全可能发生，这是真事，不用虚拟：if 从句用一般现在时，主句用 will：", ex: [["If he is free tomorrow, he will help us.", "如果他明天有空，他就会帮我们。"]] },
    { h: "考场判断法", p: "先问：这事可能发生吗？可能 → 主将从现；不可能 → 看是现在还是过去，套公式一或二。看到 if 半句是 had done，主句闭眼选 would have done。" },
  ],
  qids: ["br-sj-02", "br-sj-05", "br-sj-04"], topics: ["subjunctive", "conditional"],
},
{
  id: "P4L3", point: 4, title: "suggest 后面藏着一个 should",
  teach: [
    { h: "建议命令类动词", p: "suggest（建议）、demand（要求）、insist（坚持要）、order（命令）这类词，后面 that 从句里藏着一个 should，而 should 通常省略——所以从句动词看起来是原形：", ex: [["The teacher suggested that he (should) read more books.", "老师建议他多读书。（should 可省，剩下原形 read）"]] },
    { h: "为什么是原形", p: "别管为什么，记形状：建议命令类 + that + 人 + 动词原形。选项里 reads / will read / is reading 都不对，就选光秃秃的 read。" },
  ],
  qids: ["br-sj-06"], topics: ["subjunctive"],
},

/* ==================== 考点5 倒装与强调 ==================== */
{
  id: "P5L1", point: 5, title: "Never 开头，have 提前",
  teach: [
    { h: "正常语序先看清", p: "I have never seen such a big cat.（我从没见过这么大的猫。）——这是正常语序。" },
    { h: "把 Never 挪到句首会发生什么", p: "英文规定：否定词放句首，后面要“部分倒装”——把 have/did/is 这类助动词提到主语前面：", ex: [["Never have I seen such a big cat.", "我从没见过这么大的猫。（have 跳到 I 前面）"], ["Only then did he understand the truth.", "直到那时他才明白真相。（没有助动词就补 did）"]] },
    { h: "认形状就行", p: "这类题不用分析含义：句首是 Never / Seldom / Only then，空里就选“助动词 + 主语”的那个选项（have I / did he）。" },
    { h: "Not only 开头：倒前不倒后", p: "Not only 也是否定词，放句首同样要倒装 —— 但**只倒前半句**，but also 那半句保持正常语序。真题考过这个不对称：", ex: [["Not only did he trouble us, but he also laughed at us.", "他不但给我们添麻烦，还嘲笑我们。（前半句 did he 倒了，后半句 he also 没倒）"]] },
  ],
  qids: ["br-iv-01", "br-iv-03"], topics: ["inversion"],
},
{
  id: "P5L2", point: 5, title: "强调句：It was … that …",
  teach: [
    { h: "强调句是个固定外壳", p: "想强调“是在北京”（不是别处）：It was in Beijing that I met her. 外壳就是 It is/was + 被强调的部分 + that + 剩下的话。", ex: [["It was in Beijing that I met her.", "我是在北京遇见她的。"], ["It was Tom who broke the window.", "打破窗户的是 Tom。（强调人可用 who）"]] },
    { h: "验证法", p: "把 It was 和 that 都删掉，剩下的话还能读通，就是强调句：删掉后得到 in Beijing I met her ——通，所以是强调句，开头选 It。" },
  ],
  qids: ["br-iv-02", "br-iv-06"], topics: ["emphasis"],
},
{
  id: "P5L3", point: 5, title: "“我也是” = So do I；Here comes the bus",
  teach: [
    { h: "我也是，怎么说", p: "So + 助动词 + 主语。助动词跟着对方那句话走：对方说 I like English（一般现在时）→ So do I；对方说 I am tired → So am I。", ex: [["—I like English. —So do I.", "——我喜欢英语。——我也是。"]] },
    { h: "小心一个长得像的", p: "So I do 语序没倒，意思是“我确实如此”，不是“我也是”。选项里两个都出现时看语序：倒了才是“我也是”。" },
    { h: "Here / There 开头", p: "Here comes the bus!（车来了！）——Here/There 放句首，动词跑到主语前面，这是口语里天天用的句子，当整句背。", ex: [["Here comes the bus!", "车来了！"]] },
  ],
  qids: ["br-iv-04", "br-iv-05"], topics: ["inversion"],
},

/* ==================== 考点6 主谓一致 ==================== */
{
  id: "P6L1", point: 6, title: "找到真正的主语",
  teach: [
    { h: "动词跟谁走", p: "Everyone in our class works hard. 动词该配 everyone 还是 class？——配主语中心词 everyone。in our class 只是挂在后面的修饰，不算数。" },
    { h: "everyone / each 都当单数", p: "everyone（每个人）、everybody、each（每一个）虽然说的是很多人，但英文把它们当单数看，动词加 s：", ex: [["Everyone in our class works hard.", "我们班每个人都很努力。"], ["Each of the students has a dictionary.", "每个学生都有一本词典。（each 是主语，不是 students）"]] },
    { h: "口诀", p: "介词短语不是主语；every / each，一律单数。" },
  ],
  qids: ["br-sv-01", "sva-01"], topics: ["subject-verb-agreement"],
},
{
  id: "P6L2", point: 6, title: "there be 看最近的；不可数当单数",
  teach: [
    { h: "there be 句型：就近原则", p: "There is a pen and two books on the desk. ——be 动词跟紧挨着它的第一个名词走：最近的是 a pen（单数）→ is。", ex: [["There is a pen and two books on the desk.", "桌上有一支笔和两本书。"]] },
    { h: "不可数名词一律单数", p: "water（水）、milk、money、time、bread 这些数不出“一个两个”的词，叫不可数名词，永远当单数：", ex: [["There is some water in the glass.", "杯子里有些水。"]] },
  ],
  qids: ["br-sv-02", "sva-10"], topics: ["there-be"],
},
{
  id: "P6L3", point: 6, title: "钱和时间当整体；both A and B 是复数",
  teach: [
    { h: "复数形式，单数看待", p: "Two hundred dollars is a lot of money.——dollars 有 s，但“两百美元”是一笔钱、一个整体，动词用单数。时间、距离、金额都这样：", ex: [["Two hundred dollars is a lot of money.", "两百美元是一大笔钱。"], ["Twenty years is a long time.", "二十年是很长的时间。"]] },
    { h: "both A and B 永远复数", p: "“Tom 和 Mary 两个都……”——两个人，动词用复数：", ex: [["Both Tom and Mary are good at English.", "Tom 和 Mary 都擅长英语。"]] },
  ],
  qids: ["br-sv-03", "br-sv-04", "sva-12"], topics: ["subject-verb-agreement"],
},

/* ==================== 考点7 连词逻辑 ==================== */
{
  id: "P7L1", point: 7, title: "两条铁律：although 不配 but，because 不配 so",
  teach: [
    { h: "中文的习惯，英文的坑", p: "中文说“虽然……但是……”“因为……所以……”，两个词成对出现。英文只准留一个！这是中国考生最容易丢分的地方。", ex: [["Although he is old, he works very hard.", "虽然他年纪大，他工作很努力。（有 Although 就不能再加 but）"], ["Because it was raining, we stayed at home.", "因为下雨，我们待在家。（有 Because 就不能再加 so）"]] },
    { h: "判断逻辑关系", p: "选连词前先问：这两句话什么关系？转折（但是）→ but/although 选一个；因果（所以）→ because/so 选一个。", ex: [["I was very tired, so I went to bed early.", "我很累，所以早早睡了。"]] },
  ],
  qids: ["br-cj-01", "br-cj-02", "br-cj-03"], topics: ["conjunction"],
},
{
  id: "P7L2", point: 7, title: "祈使句 + and / or：好结果 and，坏结果 or",
  teach: [
    { h: "一对固定形状", p: "命令/建议的句子（祈使句）后面接 and 或 or，意思完全不同：and = 这样就会（好结果）；or = 否则（坏结果）。", ex: [["Get up early, and you will have time for breakfast.", "早点起，就有时间吃早饭。（好结果 → and）"], ["Hurry up, or you will be late.", "快点，否则你要迟到了。（坏结果 → or）"]] },
    { h: "判断法", p: "看后半句是好事还是坏事：好事选 and，坏事选 or。就这么简单。" },
  ],
  qids: ["br-cj-04", "br-cj-06"], topics: ["conjunction"],
},
{
  id: "P7L3", point: 7, title: "so … that …（太……以至于）",
  teach: [
    { h: "先找 that", p: "He is ____ tired that he can't walk. 做这种题第一步：往后看有没有 that + 结果。有 → 空里选 so。so + 形容词 + that = 太……以至于……", ex: [["He is so tired that he can't walk.", "他累得走不动了。"]] },
    { h: "为什么不是 very / too", p: "very tired 本身没错，但 very 不能和 that 配对；too 的搭配是 too … to do（too tired to walk），不带 that。有 that 就锁死 so。" },
  ],
  qids: ["br-cj-05"], topics: ["so-that", "conjunction"],
},

/* ==================== 2026-08-16 补：有题但一节课都没教的考点 ====================
 * 用户原话：「你觉得后面没学的、需要加的也加」。
 * 体检发现题库里这些是有题、真题也考、但 21 节微课一节都没碰过的：
 *   固定搭配 48 题 + 词义辨析 24 题（真题里占语法分近三成，ROI 最高）
 *   比较级 22 题 / 被动语态 16 题 / 名词性从句 10 题 / 反意疑问 7 题
 *   主谓一致里的 the number of 和就近原则（考点6 三节课没覆盖到）
 * 这些课的 point 记 0（不在策略的 7 大考点里），chapter 写清属于哪一块。 */

/* ==================== 考点6 补漏 ==================== */
{
  id: "P6L4", point: 6, title: "the number of 和「就近原则」",
  teach: [
    { h: "两个长得几乎一样的", p: "**the** number of students（学生的**数量**）→ 主语是 number，用**单数** is。\n**a** number of students（**许多**学生）→ 主语是 students，用**复数** are。\n差一个冠词，答案完全相反 —— 考试专坑这个。", ex: [["The number of private cars is increasing.", "私家车的数量在增加。"], ["A number of students are waiting outside.", "许多学生正在外面等着。"]] },
    { h: "就近原则：谁离动词近，动词就跟谁", p: "neither…nor / either…or / not only…but also 连起来的两个主语，谓语跟**后面那个**（离动词近的那个）走。", ex: [["Neither he nor I am to blame.", "他和我都没有责任。（跟 I 走，用 am）"], ["Not only the students but also their teacher is interested in it.", "不光学生，连他们老师也感兴趣。（跟 teacher 走，用 is）"]] },
    { h: "别跟 both 搞混", p: "只有 both A and B 是例外 —— 它永远用复数，不讲就近原则。" },
  ],
  qids: ["sva-02", "sva-03", "sva-04", "sva-05"], topics: ["subject-verb-agreement"],
},

/* ==================== 第九章 被动语态 / 名词性从句 ==================== */
{
  id: "P8L1", point: 0, chapter: "被动语态", title: "被动语态：be + 过去分词",
  teach: [
    { h: "先分清谁做谁挨", p: "主语是**自己做**这件事 → 主动：Farmers grow rice.（农民种水稻）\n主语是**被别人做** → 被动：Rice **is grown** by farmers.（水稻被种）\n判断只要问一句：这个主语是干活的，还是挨收拾的？", ex: [["English is spoken in many countries.", "很多国家都说英语。（英语是“被说”的）"], ["The bridge was built two years ago.", "这座桥是两年前建的。"]] },
    { h: "公式只有一个：be + 过去分词", p: "时态全靠前面那个 be 来变，过去分词不动：\n现在 → **is/are** done　过去 → **was/were** done\n将来 → **will be** done　情态 → **must/can be** done\n正在 → **is being** done　完成 → **have been** done", ex: [["The homework must be finished before class.", "作业必须在上课前完成。（情态动词后面用 be done）"], ["A new hospital will be built next year.", "明年会建一所新医院。"]] },
    { h: "一个坑：看着主动其实是被动", p: "feel / taste / sell / read 这几个词习惯用主动形式表示被动意思：This kind of paper **feels** soft.（这种纸摸起来很软），不写成 is felt。这类词不多，见一个记一个。" },
  ],
  qids: ["pv-01", "p2b-pass-1", "p2b-pass-2", "p2b-pass-5", "p2b-pass-3"], topics: ["passive"],
},
{
  id: "P8L2", point: 0, chapter: "名词性从句", title: "从句里不用疑问语序",
  teach: [
    { h: "最容易错的一条", p: "把一个问句塞进另一句话里，它就**不再是问句**了，要改回**陈述语序**（主语在前，动词在后）：\nWhere does he live? → Do you know **where he lives**?\n注意：does 没了，lives 加回了 s。", ex: [["Do you know where he lives?", "你知道他住哪儿吗？（不是 where does he live）"], ["I forgot how much it cost.", "我忘了它多少钱。（不是 how much did it cost）"]] },
    { h: "填哪个连接词：看从句缺不缺东西", p: "从句**缺主语或宾语** → 用 **what / who**（what 本身当成分用）\n从句**什么都不缺**，只是接上去 → 用 **that**\n意思是「**是否**」→ 用 **whether / if**", ex: [["What he said at the meeting is very important.", "他在会上说的话很重要。（said 缺宾语，用 what）"], ["I don't know if he will come tomorrow.", "我不知道他明天来不来。"]] },
    { h: "whether 和 if 的分工", p: "多数位置两个都行，但**主语位置**和**介词后面**只能用 whether：Whether he will come is not certain.（不能用 if）。" },
  ],
  qids: ["p2b-nc-1", "p2b-nc-4", "p2b-nc-2", "real-b-vs-09"], topics: ["noun-clause"],
},

/* ==================== 第十章 比较级 / 反意疑问 ==================== */
{
  id: "P8L3", point: 0, chapter: "比较级最高级", title: "看见 than 就上比较级",
  teach: [
    { h: "信号：than", p: "句子里有 than，空里一定是**比较级**。短词（1-2 个音节）直接加 **-er**，长词前面加 **more**。", ex: [["Tom is taller than Jack.", "Tom 比 Jack 高。（tall 是短词，加 -er）"], ["This book is more interesting than that one.", "这本书比那本有意思。（interesting 是长词，用 more）"]] },
    { h: "拼写小坑", p: "big → big**g**er（重读闭音节双写末尾字母）、happy → happ**i**er（辅音+y 改 i 加 er）。\ngood / well → **better**，bad → **worse**，many/much → **more** —— 这三组不规则，直接背。" },
    { h: "两个常考句型", p: "**the + 比较级，the + 比较级** = 越……越……：The more you practise, **the better** your English will be.\n**最高级**前面要加 the，而且后面不跟 than：She runs **the fastest** in her class.", ex: [["The more you practise, the better your English will be.", "你练得越多，英语就越好。"]] },
  ],
  qids: ["cs-01", "b-g-16", "p2b-comp-1", "p2b-comp-3", "p2b-comp-4"], topics: ["comparative", "superlative", "comparison"],
},
{
  id: "P8L4", point: 0, chapter: "反意疑问句", title: "反意疑问句：前肯后否",
  teach: [
    { h: "三步就能做对", p: "① 前面是**肯定** → 后面用**否定**；前面是**否定** → 后面用**肯定**\n② 借前面的**助动词**：are → aren’t；can → can’t；没有助动词就补 do / does / did\n③ 主语一律换成**代词**（Tom → he，my sister → she）", ex: [["You are a student, aren't you?", "你是学生，对吧？"], ["She likes music, doesn't she?", "她喜欢音乐，对吧？（likes 没有助动词，补 does）"], ["They don't work on Sundays, do they?", "他们周日不上班，对吧？（前面否定，后面肯定）"]] },
    { h: "两个必须背的特例", p: "Let’s … 后面用 **shall we**？（我们一起）\nLet us … 后面用 **will you**？（你让我们）", ex: [["Let's celebrate the victory, shall we?", "咱们庆祝一下胜利，好吗？"]] },
  ],
  qids: ["p2a-tag-1", "p2a-tag-2", "p2a-tag-3", "p2a-tag-4", "m-g-15"], topics: ["tag-question"],
},

/* ==================== 第十一章 固定搭配 / 词义辨析（真题占分最多的一块）==== */
{
  id: "P9L1", point: 0, chapter: "固定搭配", title: "动词 + 介词：只能靠见过",
  teach: [
    { h: "为什么这一课最值", p: "真题体检结果：88 道真题里，固定搭配 10 道 + 词义辨析 9 道 = **占语法分的 29%**，比 7 大考点里任何一个都多。这类题没有道理可讲，见过就会、没见过就蒙 —— 所以要专门练。" },
    { h: "最高频的一批，先背这些", p: "**be interested in** 对…感兴趣　**be afraid of** 害怕\n**look forward to** 盼望（to 后面接 doing！）　**take care of** 照顾\n**be good at** 擅长　**be proud of** 为…自豪\n**depend on** 取决于　**count on** 指望\n**be absorbed in** 全神贯注于　**be composed of** 由…组成", ex: [["I am very interested in Chinese history.", "我对中国历史很感兴趣。"], ["We are all looking forward to the summer holiday.", "我们都盼着暑假。（to 后面是名词/doing，不是动词原形）"]] },
    { h: "同一个动词换个介词就换意思", p: "**look after** 照顾　**look for** 寻找　**look up** 查（单词）　**look forward to** 盼望\n**turn on** 打开　**turn off** 关掉　**turn up** 调大 / 出现　**turn down** 调小 / 拒绝\n**call on** 拜访　**call off** 取消　**call up** 打电话", ex: [["The meeting was called off because of the bad weather.", "会议因为天气不好取消了。"], ["Please turn off the light before you leave.", "走之前请把灯关掉。"]] },
    { h: "错了怎么办", p: "这类题错了不用分析原因 —— 就是没见过。把整个搭配连同例句抄一遍，下次见到就认识了。" },
  ],
  qids: ["m-c-01", "m-c-02", "m-c-03", "m-c-04", "col-306"], topics: ["collocation"],
},
{
  id: "P9L2", point: 0, chapter: "词义辨析", title: "四个词都沾边，选最贴的那个",
  teach: [
    { h: "辨析题不是选「能用的」，是选「最合适的」", p: "四个选项中文翻译经常一样，差别在**跟谁搭配**、**程度多重**、**褒义还是贬义**。所以不能只背中文，要看整句在讲什么场景。" },
    { h: "成考最爱考的几组", p: "**borrow**（借进来）／ **lend**（借出去）：Can you **lend** me your bike?\n**spend**（人 + 花钱/时间）／ **cost**（物 + 值多少钱）／ **take**（花时间做某事）\n**high**（价格/温度高）／ **tall**（人或物个子高）：The price is too **high**.\n**besides**（除…之外还有）／ **except**（除…之外没有）", ex: [["Can you lend me your bike? I'll return it tomorrow.", "你能把自行车借给我吗？我明天还。（从我这儿借出去 = lend）"], ["I spent 100 yuan on this pair of shoes.", "这双鞋我花了 100 块。（人花钱用 spend）"]] },
    { h: "考场上怎么做", p: "把四个词**分别代进句子读一遍**，读着别扭的先排掉。剩下两个拿不准时，看句子里有没有固定搭配的痕迹（介词、后面接的词）。" },
  ],
  qids: ["p2b-wc-2", "p2b-wc-3", "p2b-wc-1", "p2b-wc-4"], topics: ["word-choice"],
},

];
