/* ============================================================================
 * questions-real.js —— 历年真题（成人高考专升本《英语》）
 *
 * 🔴 2026-09-12 更正：hbcj1.com 那套「成考专升本真题卷」（real-a-* 共 20 题）
 *    **不是真题**，已全部降级为 mock，别再当真题用。
 *    证据：把它和《英语全真模拟卷及答案解析（五套）》逐题比对，**20 题里有 11 题
 *    与全真模拟(三)、(四) 一字不差**（题干、四个选项、答案全同）。
 *    真卷不可能和一本市售模拟书重题 55%，只可能是那个站把模拟卷标成了真题。
 *    重复的 11 题已删（保留带卷号的 mk3- / mk4- 那一份），剩下 9 题降级留作练习。
 *    ——> 教训：光看网站标题不算数，**新录一套"真题"必须先跟已有题库跑一遍查重**。
 * 同一套卷的完形和阅读部分因为原文（passage）没有一起给出，无法使用，故未收录。
 *
 * 与普通题库的区别：多了两个字段
 *   real:   true      —— 标记为真题，一条龙的「真题练习」步骤只取这些
 *   source: "..."     —— 出处，答题时显示给用户，让他知道这是真题不是模拟题
 *
 * ⚠️ 分级解锁（用户明确要求）：每题都打了 topic，一条龙里的真题练习**只出已解锁
 *   章节的考点**，绝不提前考没学过的语法。唯一例外是语音题——语音不依赖任何语法
 *   基础（纯字母发音匹配），而且是 7.5 分的送分板块，所以从第一天就开放。
 *   见 app.js 的 REAL_ALWAYS_OPEN。
 *
 * ⚠️ optionNotes 的长度必须等于 options 的长度。
 * ⚠️ 中文一律用全角引号“”。
 *
 * 想加更多真题：直接往下面数组里追加即可，字段照抄。建议一套卷用同一个 source。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* ==================== Ⅰ. Phonetics 语音（5 题 · 送分板块） ==================== */
{
  id: "real-a-pho-02", level: 1, module: "phonetics", topic: "phonetics-o",
  mock: true, source: "来源存疑（实为模拟卷，非真题） · 语音 第2题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["f__o__rgot", "l__o__st", "p__o__t", "h__o__t"],
  answer: 0,
  explanation: "lost / pot / hot 里的 o 都读 /ɒ/（重读音节里的短 o）。forgot 划线的是**第一个** o，它在非重读音节上，弱化成 /ə/：/fəˈɡɒt/。考点＝非重读音节的元音会弱读。",
  optionNotes: ["对：forgot 第一个 o 弱读成 /ə/ → 选它", "错：lost 读 /ɒ/", "错：pot 读 /ɒ/", "错：hot 读 /ɒ/"]
},
{
  id: "real-a-pho-03", level: 1, module: "phonetics", topic: "phonetics-u",
  mock: true, source: "来源存疑（实为模拟卷，非真题） · 语音 第3题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["__u__ncle", "prod__u__ct", "r__u__ral", "__u__gly"],
  answer: 2,
  explanation: "uncle / product / ugly 里的 u 都读短音 /ʌ/（啊短）。rural /ˈrʊərəl/ 的 u 读 /ʊə/，和其它三个不同。",
  optionNotes: ["错：uncle 读 /ʌ/", "错：product 读 /ʌ/", "对：rural 读 /ʊə/，不同 → 选它", "错：ugly 读 /ʌ/"]
},
/* ============ Ⅱ. Vocabulary and Structure 词汇与语法（15 题） ============ */
{
  id: "real-a-vs-07", level: 3, module: "grammar", topic: "subjunctive",
  mock: true, source: "来源存疑（实为模拟卷，非真题） · 词汇与语法 第7题",
  stem: "She advised that I ____ my oral English by doing a lot of practice.",
  options: ["will improve", "improved", "improves", "improve"],
  answer: 3,
  explanation: "advise（建议）后面的 that 从句要用虚拟语气：**(should) + 动词原形**，should 通常省略，所以只留 improve。同类动词一串背下来：suggest / advise / insist / demand / order / require + that + (should) do。",
  optionNotes: ["错：虚拟语气不用将来时", "错：improved 是过去式，不是原形", "错：improves 是三单形式，不是原形", "对：(should) improve 省略 should，用原形"]
},
{
  id: "real-a-vs-09", level: 2, module: "grammar", topic: "collocation",
  mock: true, source: "来源存疑（实为模拟卷，非真题） · 词汇与语法 第9题",
  stem: "You should have been more patient ____ that customer.",
  options: ["of", "with", "for", "at"],
  answer: 1,
  explanation: "固定搭配 **be patient with sb ＝ 对某人有耐心**。顺带记一句：should have done＝“本来应该做却没做”（这里是“你当时本该对那位客人更耐心些”）。",
  optionNotes: ["错：没有 patient of 这个搭配", "对：be patient with sb＝对某人耐心", "错：没有 patient for（有 wait for）", "错：没有 patient at（有 be good at）"]
},
{
  id: "real-a-vs-14", level: 2, module: "grammar", topic: "relative-clause",
  mock: true, source: "来源存疑（实为模拟卷，非真题） · 词汇与语法 第14题",
  stem: "These are the pictures of the house ____ we have lived for many years.",
  options: ["where", "which", "that", "when"],
  answer: 0,
  explanation: "先行词 house 是**地点**，而且从句 we have lived ___ 缺的是“在里面”这个地点状语（live in the house），所以用关系副词 where（＝in which）。若用 which/that，从句就缺介词 in 了——除非写成 which we have lived **in**。",
  optionNotes: ["对：where＝in which，补上了 live 需要的地点状语", "错：which 后面还得有介词 in 才完整", "错：that 同理，缺 in", "错：when 指时间，先行词是 house 不是时间"]
},
{
  id: "real-a-vs-17", level: 2, module: "grammar", topic: "tag-question",
  mock: true, source: "来源存疑（实为模拟卷，非真题） · 词汇与语法 第17题",
  stem: "We may think you know the answer, ____ ?",
  options: ["don't you", "may you", "may not you", "may not I"],
  answer: 0,
  explanation: "重要规则：主句是 **I/we think（believe、suppose）+ 从句** 时，反意疑问句**针对从句**提问，不针对主句。从句是 you know the answer（肯定、实义动词 know），所以反问用 don't you。",
  optionNotes: ["对：针对从句 you know → 前肯后否 → don't you", "错：不该针对主句的 may 提问", "错：同样搞错了对象，而且 may not you 语序也不自然", "错：主语也错了，从句主语是 you 不是 I"]
},
{
  id: "real-a-vs-18", level: 2, module: "grammar", topic: "present-perfect",
  mock: true, source: "来源存疑（实为模拟卷，非真题） · 词汇与语法 第18题",
  stem: "I've worked here since I ____ Harvard Business School.",
  options: ["leave", "left", "have left", "had left"],
  answer: 1,
  explanation: "固定规律：**主句用现在完成时（I've worked），since 引导的从句用一般过去时**——因为“离开学校”是过去某一刻发生并结束的动作。since 从句里不用完成时。",
  optionNotes: ["错：leave 是现在时，离校是过去的事", "对：since 从句用一般过去时 left", "错：since 从句不用现在完成时", "错：过去完成时用于“过去的过去”，这里没有那层时间关系"]
},
{
  id: "real-a-vs-19", level: 3, module: "grammar", topic: "subjunctive",
  mock: true, source: "来源存疑（实为模拟卷，非真题） · 词汇与语法 第19题",
  stem: "If you ____ yesterday, you would have met him.",
  options: ["come", "came", "have come", "had come"],
  answer: 3,
  explanation: "看主句 would have met＝**与过去事实相反**的虚拟语气。这种情况两半固定配对：**If + had done，主句 would have done**。yesterday 也提示是对过去的假设（其实你昨天没来，所以没见到他）。",
  optionNotes: ["错：come 是原形/现在时", "错：came 配的是“与现在相反”（主句该是 would meet）", "错：现在完成时不用于虚拟条件句", "对：had come 配 would have met，与过去事实相反"]
},
{
  id: "real-a-vs-20", level: 3, module: "grammar", topic: "present-perfect",
  mock: true, source: "来源存疑（实为模拟卷，非真题） · 词汇与语法 第20题",
  stem: "By my 50th birthday, I ____ in my current profession for over 20 years.",
  options: ["would have been", "would be", "will be", "will have been"],
  answer: 3,
  explanation: "考**将来完成时 will have done**：到将来某个时间点（By my 50th birthday）为止，某动作已经持续了多久（for over 20 years）。标志就是 **by + 将来时间 + for + 时间段**。would 表示的是过去将来或虚拟，这里是实实在在的将来，所以用 will。",
  optionNotes: ["错：would have been 是虚拟/过去将来，这里是真实的将来", "错：would be 同理，时态语气不对", "错：will be 无法表达“已经持续 20 多年”这层完成含义", "对：will have been＝将来完成时，配 by + 将来时间 + for 时间段"]
},

]);

/* ==========================================================================
 * 第二套：2019 年湖北成人高考专升本《英语》真题
 * 来源 https://www.hbcjw.com/wyzzt/10280.html
 * 答案已逐题复核，全部正确。
 * ⚠️ 原卷语音第3题（reception / receipt / capture / concept）来源页面没有标明
 *    划线部分是哪几个字母，存在歧义（按 c 的读音选 capture，按元音选 receipt），
 *    为避免教错，**这道题不收录**。所以本套只有 4 道语音题。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* -------------------- Ⅰ. Phonetics 语音（4 题） -------------------- */
{
  id: "real-b-pho-01", level: 2, module: "phonetics", topic: "phonetics-i",
  real: true, source: "2019 湖北成考专升本真题 · 语音 第1题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["v__i__tal", "s__i__lent", "coll__i__de", "f__ie__rce"],
  answer: 3,
  explanation: "vital / silent / collide 里的 i 都读 /aɪ/（爱）。fierce 的 ie 读 /ɪə/，和其它三个不同。规律：i 在“辅音+e”或开音节里常读 /aɪ/。",
  optionNotes: ["错：vital 读 /aɪ/", "错：silent 读 /aɪ/", "错：collide 读 /aɪ/", "对：fierce 的 ie 读 /ɪə/，不同 → 选它"]
},
{
  id: "real-b-pho-02", level: 2, module: "phonetics", topic: "phonetics-au",
  real: true, source: "2019 湖北成考专升本真题 · 语音 第2题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["t__au__ght", "c__au__ght", "l__au__gh", "f__au__lt"],
  answer: 2,
  explanation: "taught / caught / fault 里的 au 都读 /ɔː/（哦长）。laugh 是特例，au 读 /ɑː/（啊长），整词读 /lɑːf/。这三个 -aught 词是一组，背下来就送分。",
  optionNotes: ["错：taught 读 /ɔː/", "错：caught 读 /ɔː/", "对：laugh 读 /ɑː/，不同 → 选它", "错：fault 读 /ɔː/"]
},
{
  id: "real-b-pho-03", level: 2, module: "phonetics", topic: "phonetics-oo",
  real: true, source: "2019 湖北成考专升本真题 · 语音 第4题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["b__oo__m", "g__oo__se", "fl__oo__d", "gl__oo__m"],
  answer: 2,
  explanation: "boom / goose / gloom 里的 oo 读长音 /uː/（乌）。flood 是特例，oo 读 /ʌ/（啊短），/flʌd/。同类特例还有 blood /blʌd/——flood 和 blood 一起记。",
  optionNotes: ["错：boom 读 /uː/", "错：goose 读 /uː/", "对：flood 读 /ʌ/，不同 → 选它", "错：gloom 读 /uː/"]
},
{
  id: "real-b-pho-04", level: 2, module: "phonetics", topic: "phonetics-ng",
  real: true, source: "2019 湖北成考专升本真题 · 语音 第5题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["fi__ng__er", "si__ng__er", "ha__ng__er", "ri__ng__er"],
  answer: 0,
  explanation: "singer / hanger / ringer 都是“动词+er”构成的词（sing/hang/ring + er），ng 只读 /ŋ/。而 finger 不是这样构成的，ng 读 /ŋɡ/（多一个 /ɡ/ 音）。规律：动词加 -er 时不加 /ɡ/，其它情况常带 /ɡ/（finger、hunger、angry）。",
  optionNotes: ["对：finger 读 /ŋɡ/，多一个 /ɡ/ → 选它", "错：singer 读 /ŋ/", "错：hanger 读 /ŋ/", "错：ringer 读 /ŋ/"]
},

/* ------------ Ⅱ. Vocabulary and Structure 词汇与语法（15 题） ------------ */
{
  id: "real-b-vs-06", level: 1, module: "grammar", topic: "word-choice",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第6题",
  stem: "As a child I used to wash my parents' car to earn some ____ money.",
  options: ["paper", "easy", "private", "pocket"],
  answer: 3,
  explanation: "固定说法 **pocket money ＝ 零花钱**（字面“口袋里的钱”）。这句是“小时候我常给爸妈洗车挣点零花钱”。顺带复习 used to do＝过去常常做。",
  optionNotes: ["错：paper money＝纸币，不合语境", "错：没有 easy money 表零花钱（easy money 指来得容易的钱）", "错：private money 不是固定搭配", "对：pocket money＝零花钱"]
},
{
  id: "real-b-vs-07", level: 2, module: "grammar", topic: "word-choice",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第7题",
  stem: "After the busy day I've had, I need a ____ drink.",
  options: ["heavy", "sharp", "strong", "powerful"],
  answer: 2,
  explanation: "英语里“浓的/烈的”饮料固定用 **strong**：strong drink（烈酒）、strong tea（浓茶）、strong coffee（浓咖啡）。中文说“浓”，英语不能用 heavy 或 powerful。",
  optionNotes: ["错：heavy 修饰重量或程度（heavy rain 大雨），不修饰酒的浓烈", "错：sharp＝锋利的、刺鼻的", "对：strong drink＝烈酒，固定搭配", "错：powerful＝强大有力的（powerful engine），不用于饮料"]
},
{
  id: "real-b-vs-08", level: 3, module: "grammar", topic: "subjunctive",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第8题",
  stem: "If you ____ stayed at home, this would never have happened.",
  options: ["have", "had", "will have", "would have"],
  answer: 1,
  explanation: "主句是 would never have happened＝**与过去事实相反**的虚拟语气，所以 if 从句必须用 **had + 过去分词**（had stayed）。固定配对：If + had done → 主句 would have done。",
  optionNotes: ["错：have stayed 是现在完成时，虚拟条件句不用", "对：had stayed 配主句 would have happened", "错：将来完成时不能出现在虚拟条件从句里", "错：would have 只能在主句，不能放 if 从句"]
},
{
  id: "real-b-vs-09", level: 2, module: "grammar", topic: "noun-clause",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第9题",
  stem: "— How much did this set of furniture cost?　— I forgot ____ .",
  options: ["how much it costs", "how much did it cost", "how much it cost", "how much does it cost"],
  answer: 2,
  explanation: "两个考点一起考：① 宾语从句要用**陈述语序**（主语在前、不倒装），所以 did it cost / does it cost 都错；② 时态呼应——问句用的是过去时 did...cost，所以从句也用过去时 cost（这里 cost 的过去式同形）。",
  optionNotes: ["错：语序对了但时态错，应与问句的过去时一致", "错：宾语从句不能用疑问语序 did it cost", "对：陈述语序 + 过去时 → how much it cost", "错：同样用了疑问语序，且时态也不对"]
},
{
  id: "real-b-vs-10", level: 2, module: "grammar", topic: "collocation",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第10题",
  stem: "We had a long way to go so we decided to ____ early.",
  options: ["set on", "put on", "set off", "put off"],
  answer: 2,
  explanation: "**set off ＝ 出发、启程**（路远所以决定早点出发）。这组必须分清：put on＝穿上；put off＝推迟；set on 不是常用搭配。另记 set out 也可表“出发”。",
  optionNotes: ["错：set on 不是“出发”的常用搭配", "错：put on＝穿上（衣服）、上演", "对：set off＝出发、启程", "错：put off＝推迟（put off the meeting）"]
},
{
  id: "real-b-vs-11", level: 1, module: "grammar", topic: "conjunction",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第11题",
  stem: "____ it is not his responsibility to do that, he said he would help.",
  options: ["Although", "As", "Since", "Unless"],
  answer: 0,
  explanation: "前后是**让步转折**关系：“虽然那不是他的责任，他还是说会帮忙。”用 Although（虽然）。As / Since 表原因（因为），Unless 表条件（除非），都讲不通。",
  optionNotes: ["对：Although＝虽然，正好是让步转折", "错：As 这里会理解成“因为”，逻辑相反", "错：Since＝既然/因为，也是因果，不通", "错：Unless＝除非，条件关系，不通"]
},
{
  id: "real-b-vs-12", level: 3, module: "grammar", topic: "non-finite",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第12题",
  stem: "One of the strongest hurricanes ____ was the Florida Keys Storm of 1935, during which 500 people were killed.",
  options: ["to record", "recorded", "recording", "being recorded"],
  answer: 1,
  explanation: "hurricanes（飓风）是**被**记录的，所以用过去分词 recorded 作后置定语，＝有记录以来最强的飓风之一（＝that were ever recorded）。recording 是主动（飓风自己记录），意思反了。",
  optionNotes: ["错：to record 表将来或目的，不合“有记录以来”", "对：过去分词 recorded 作后置定语，表被动完成", "错：recording 是主动，飓风不能主动记录", "错：being recorded 强调“正在被记录”，与语境不符"]
},
{
  id: "real-b-vs-13", level: 2, module: "grammar", topic: "word-choice",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第13题",
  stem: "Ms. Jolie is beautiful and very talented, and ____ in control of her own career.",
  options: ["basically", "remarkably", "perfectly", "actively"],
  answer: 1,
  explanation: "四个副词辨义：remarkably＝**引人注目地、非常地**，和前面的 beautiful、very talented 语气一致（褒义、程度强），“而且对自己的事业掌控得非常好”。basically＝基本上（语气偏弱）；perfectly＝完美地（过强且不搭）；actively＝积极地（不修饰 in control）。",
  optionNotes: ["错：basically＝基本上，语气偏弱，与全句褒扬语气不合", "对：remarkably＝非常地、显著地，与 beautiful/talented 呼应", "错：perfectly 与 in control 搭配生硬", "错：actively＝主动地，不用于修饰 in control"]
},
{
  id: "real-b-vs-14", level: 1, module: "grammar", topic: "past-continuous",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第14题",
  stem: "When John left the office, Amy ____ at her desk.",
  options: ["is still working", "has still worked", "had still working", "was still working"],
  answer: 3,
  explanation: "经典搭配：**When + 过去时（left），主句用过去进行时（was working）**——约翰离开的那一刻，艾米正在工作。“过去某一刻正在发生”就是过去进行时。",
  optionNotes: ["错：is working 是现在进行时，与过去的 left 不呼应", "错：现在完成时不能表“过去那一刻正在做”", "错：had still working 结构本身就错（had 后面不能直接跟 -ing）", "对：was still working＝过去进行时，正在工作"]
},
{
  id: "real-b-vs-15", level: 1, module: "grammar", topic: "word-choice",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第15题",
  stem: "You should learn through failures. Why don't you ____ your plan or try a new approach?",
  options: ["adjust", "repeat", "accept", "refuse"],
  answer: 0,
  explanation: "语境是“从失败中学习”，后面又说 or try a new approach（或者换个新办法），所以前面应该是 **adjust your plan＝调整计划**。repeat（重复）、accept（接受）、refuse（拒绝）都和“改进”这个方向相反。",
  optionNotes: ["对：adjust your plan＝调整计划，与 try a new approach 并列", "错：repeat＝重复，失败了还重复原计划不合逻辑", "错：accept your plan＝接受计划，没有改进含义", "错：refuse＝拒绝，语义不通"]
},
{
  id: "real-b-vs-16", level: 3, module: "grammar", topic: "passive",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第16题",
  stem: "The carpet has so many stains on it that it needs ____ .",
  options: ["replace", "to replace", "being replaced", "to be replaced"],
  answer: 3,
  explanation: "地毯是**被**换的，所以要用被动：**need to be done**。这里 needs to be replaced＝需要被换掉。（另一种正确写法是 needs replacing——need 后接动名词时用主动形式表被动，但选项里没有。）",
  optionNotes: ["错：need 后面不能直接跟动词原形", "错：to replace 是主动，变成“地毯要去换别的东西”", "错：need 后不接 being done", "对：need to be replaced＝需要被更换"]
},
{
  id: "real-b-vs-17", level: 3, module: "grammar", topic: "modal-verb",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第17题",
  stem: "I sent him the package yesterday. He ____ it by now.",
  options: ["might have received", "received", "will receive", "receives"],
  answer: 0,
  explanation: "考**情态动词 + have done 表对过去的推测**：might have received＝“到现在他可能已经收到了”（我不确定，只是推测）。by now（到现在为止）提示要用完成式；而说话人并不知道结果，所以要用 might 表推测，不能用确定的陈述。",
  optionNotes: ["对：might have received＝可能已经收到（对过去的推测）", "错：received 是陈述事实，但说话人并不确定", "错：will receive 指将来，与 by now 矛盾", "错：receives 是一般现在时，时态不对"]
},
{
  id: "real-b-vs-18", level: 2, module: "grammar", topic: "relative-clause",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第18题",
  stem: "Is this the factory ____ you visited the other day?",
  options: ["what", "where", "that", "when"],
  answer: 2,
  explanation: "关键看从句缺什么：visited 是及物动词，后面**缺宾语**（参观“它”），所以要用关系代词 that / which，不能用表地点的 where。⚠️ 别一看到 factory 就选 where——要看从句成分缺不缺。对比第14题（the house where we have lived）：live 不及物，缺的是地点状语，那才用 where。",
  optionNotes: ["错：what 不能引导定语从句", "错：where＝in which，但 visited 后面缺的是宾语不是状语", "对：that 作 visited 的宾语，＝which", "错：when 指时间，先行词是 factory"]
},
{
  id: "real-b-vs-19", level: 2, module: "grammar", topic: "non-finite",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第19题",
  stem: "To make the fish ____ nice, she put in some sugar and wine vinegar.",
  options: ["taste", "to taste", "tasted", "tasting"],
  answer: 0,
  explanation: "使役动词 **make + 宾语 + 动词原形**（不带 to）：make the fish taste nice＝让鱼尝起来好吃。同类要背：make / let / have + 宾语 + do；感官动词 see / hear / watch + 宾语 + do（或 doing）。",
  optionNotes: ["对：make sb/sth do，用原形 taste", "错：make 后面不带 to", "错：tasted 是过去分词，鱼不是“被尝”", "错：taste 表“尝起来”时是连系动词，这里不用 -ing"]
},
{
  id: "real-b-vs-20", level: 2, module: "grammar", topic: "comparative",
  real: true, source: "2019 湖北成考专升本真题 · 词汇与语法 第20题",
  stem: "My daughter runs faster than ____ in her class. She runs the fastest.",
  options: ["a boy", "any boy", "some boys", "most boys"],
  answer: 1,
  explanation: "**比较级 + than any + 单数名词 ＝ 最高级含义**（比任何一个都快 ＝ 最快）。后一句 She runs the fastest 正好印证。若用 some boys / most boys，只是“比一些/大多数男生快”，达不到“最快”。",
  optionNotes: ["错：than a boy＝比某一个男生快，程度太弱", "对：than any boy＝比任何男生都快，等于最快", "错：than some boys 只是比一部分人快", "错：than most boys＝比大多数快，仍不等于最快"]
},

]);

/* ==========================================================================
 * 第三套：2022 年成人高考专升本《英语》真题
 * 来源（两个页面互相印证，题干与答案一致）：
 *   https://www.hbcjw.com/wyzzt/17437.html
 *   https://www.hbcjw.com/wyzzt/17081.html
 * 该卷来源只放出了语音 5 题 + 词汇语法前 6 题，其余未公开。
 * 已复核并**剔除 2 道**：
 *   · 语音第5题（easy/noisy/busy/fantasy）：给的答案是 noisy，但按划线字母 y
 *     四个词都读 /i/，答案与题干自相矛盾 → 不收。
 *   · 词汇第11题（He forgot ___ the door again）：网传答案标 locking，但语境是
 *     “Tom 很粗心，昨天出门又忘了锁门”，应为 forget **to lock**（忘记去做）。
 *     答案存疑且题干疑被转录改动 → 不收。
 * 语音第3题（useless/endless/unless/hopeless）来源未标明划线部分，但只有把
 *   “less”划线才能解释给出的答案（后缀 -less 弱读 /ləs/ vs unless 重读 /les/），
 *   故按此收录。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* -------------------- Ⅰ. Phonetics 语音（4 题） -------------------- */
{
  id: "real-c-pho-01", level: 1, module: "phonetics", topic: "phonetics-a",
  real: true, source: "2022 成考专升本真题 · 语音 第1题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["g__a__me", "l__a__te", "tr__a__de", "h__a__ve"],
  answer: 3,
  explanation: "“辅音 + a + 辅音 + e”这种结构里，a 读字母本音 /eɪ/：game / late / trade。have 是特例，a 读短音 /æ/。记住 have 这个例外，成考考过不止一次。",
  optionNotes: ["错：game 读 /eɪ/", "错：late 读 /eɪ/", "错：trade 读 /eɪ/", "对：have 读 /æ/，不同 → 选它"]
},
{
  id: "real-c-pho-02", level: 1, module: "phonetics", topic: "phonetics-th",
  real: true, source: "2022 成考专升本真题 · 语音 第2题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["__th__ere", "__th__ick", "__th__ank", "__th__irty"],
  answer: 0,
  explanation: "th 有清浊两读：thick / thank / thirty 读清音 /θ/（咬舌送气）。there 读浊音 /ð/（咬舌振动）。规律：**虚词类**（the, this, that, there, they, them, than）多读浊音 /ð/；实词多读清音 /θ/。",
  optionNotes: ["对：there 读浊音 /ð/，不同 → 选它", "错：thick 读 /θ/", "错：thank 读 /θ/", "错：thirty 读 /θ/"]
},
{
  id: "real-c-pho-03", level: 3, module: "phonetics", topic: "phonetics-e",
  real: true, source: "2022 成考专升本真题 · 语音 第3题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["use__less__", "end__less__", "un__less__", "hope__less__"],
  answer: 2,
  explanation: "useless / endless / hopeless 里的 **-less 是后缀**，不重读，读成 /ləs/（e 弱化为 /ə/）。而 unless 的重音在后面（unLESS），less 是重读音节，读 /les/。考点＝后缀不重读就要弱化。",
  optionNotes: ["错：useless 的 -less 弱读 /ləs/", "错：endless 的 -less 弱读 /ləs/", "对：unless 重音在 less 上，读 /les/ → 选它", "错：hopeless 的 -less 弱读 /ləs/"]
},
{
  id: "real-c-pho-04", level: 1, module: "phonetics", topic: "phonetics-oo",
  real: true, source: "2022 成考专升本真题 · 语音 第4题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["c__oo__l", "fl__oo__d", "f__oo__d", "m__oo__n"],
  answer: 1,
  explanation: "cool / food / moon 里的 oo 读长音 /uː/。flood 读 /ʌ/。**flood 和 blood 是这一组唯二的特例**，一起背下来——2019 年和 2022 年真题都考了 flood。",
  optionNotes: ["错：cool 读 /uː/", "对：flood 读 /ʌ/，不同 → 选它", "错：food 读 /uː/", "错：moon 读 /uː/"]
},

/* ------------ Ⅱ. Vocabulary and Structure 词汇与语法（5 题） ------------ */
{
  id: "real-c-vs-06", level: 2, module: "grammar", topic: "relative-clause",
  real: true, source: "2022 成考专升本真题 · 词汇与语法 第6题",
  stem: "This test is designed for students ____ native language is not English.",
  options: ["whose", "whom", "to whom", "to whose"],
  answer: 0,
  explanation: "空后面直接跟名词 native language，说明要填“**谁的**”——关系代词 whose（students 的母语）。判断诀窍：**空格后面紧跟名词，就用 whose**。",
  optionNotes: ["对：whose + 名词，表示“学生的母语”", "错：whom 作宾语，后面不能直接跟名词", "错：to whom 后面也不能跟名词作定语", "错：to whose 结构错，whose 前不加 to"]
},
{
  id: "real-c-vs-07", level: 2, module: "grammar", topic: "non-finite",
  real: true, source: "2022 成考专升本真题 · 词汇与语法 第7题",
  stem: "While ____ along the shore, I found a lot of sea shells.",
  options: ["walk", "walking", "to walk", "walked"],
  answer: 1,
  explanation: "While 后面省略了 I was，原句＝While I was walking。**连词 + doing** 是常考的省略结构（When/While/After + doing）。主语 I 是主动走路，所以用现在分词 walking。",
  optionNotes: ["错：walk 是原形，连词后不能直接跟原形", "对：While walking＝While I was walking，省略结构", "错：to walk 表目的，不合“走的时候”", "错：walked 是过去分词，会变成被动，人不是“被走”"]
},
{
  id: "real-c-vs-08", level: 2, module: "grammar", topic: "collocation",
  real: true, source: "2022 成考专升本真题 · 词汇与语法 第8题",
  stem: "The sweater she received in the end differed ____ the one she had seen online.",
  options: ["by", "in", "with", "from"],
  answer: 3,
  explanation: "固定搭配 **differ from ＝ 与…不同**（毛衣和网上看到的那件不一样）。名词形式也一样：be different **from**。注意别被中文“和…不同”带着写成 with。",
  optionNotes: ["错：没有 differ by 表“不同于”（differ by 只表相差多少）", "错：differ in＝在某方面有差异（differ in size），后面接方面不接比较对象", "错：中式英语，differ 不搭 with", "对：differ from＝与…不同"]
},
{
  id: "real-c-vs-09", level: 2, module: "grammar", topic: "relative-clause",
  real: true, source: "2022 成考专升本真题 · 词汇与语法 第9题",
  stem: "There are numerous websites on the Internet ____ you can learn how to cook.",
  options: ["that", "when", "where", "which"],
  answer: 2,
  explanation: "从句 you can learn how to cook 本身**成分齐全**（主语 you、谓语 learn、宾语 how to cook），不缺宾语，缺的是“在网站上”这个**地点状语**，所以用 where（＝on which）。websites 在这里被当作“地点”看待。",
  optionNotes: ["错：that 作宾语，但从句不缺宾语", "错：when 指时间，websites 不是时间", "对：where＝on which，补上地点状语", "错：which 同 that，从句不缺宾语"]
},
{
  id: "real-c-vs-10", level: 1, module: "grammar", topic: "comparative",
  real: true, source: "2022 成考专升本真题 · 词汇与语法 第10题",
  stem: "The writer's first book is ____ popular than his second one.",
  options: ["so", "less", "such", "much"],
  answer: 1,
  explanation: "看到 **than** 就知道要比较级。popular 是多音节词，比较级用 more/less popular。这里 less popular than＝“不如…受欢迎”（第一本不如第二本红）。much 只能修饰比较级（much more popular），不能直接加 popular。",
  optionNotes: ["错：so 不能和 than 搭配", "对：less popular than＝不如…受欢迎", "错：such 修饰名词，且不与 than 搭配", "错：much 要修饰比较级，得写成 much more popular than"]
},

]);

/* ==========================================================================
 * 第四套：2025 年 10 月成人高考全国统一考试 专升本《英语》（最新一套）
 * 来源：郑州函授站 http://www.zzkpedu.com/m/lnzt/2347.html
 *   （原页面是 10 张试卷扫描图，非文字；已逐图识读转录）
 *   页面自称「网络整理版 供考后对答案用」。
 *
 * ✅ 本文件收录：语音 5 题（全）+ 词汇与结构 15 题（全）——这两节题干自洽、
 *    答案已逐题复核无误，是这套卷最可靠的部分，也正好是成考的 20 分客观题。
 *
 * ❌ 以下部分**故意不收**，因为该整理版本身残缺，收进来会教错：
 *    · 完形填空（21-35）：第26、29、30 题的选项被转录弄坏（如 26 题正确项写成
 *      “called”，放进句子里根本不成句；29 题四个选项里没有语义上唯一正确的
 *      “never”；30 题原文“studying to ___ be a teacher”结构已损）。
 *    · 阅读理解：passage 被漏抄了段落——Passage Two 里 Bailey（博物馆驱鸥犬）
 *      从未被介绍就直接出现，却要考“Bailey 的工作是什么”；Passage Three 问
 *      “何时可以直接扑火”，但原文根本没有这一段。文章不全，题无从做对。
 *    · 原卷阅读应为 5 篇 20 题（36-55），该整理版只有 3 篇 13 题（36-48），
 *      后两篇整体缺失。
 *    · 补全对话（56-60，答案 D/G/E/B/F）文意通顺可用，但原题是「8 选 5 配对」
 *      题型，与本题库的四选一结构不同，需改编，暂缓收录。
 *
 * 该卷作文题（可用于写作模块）：以学生会名义写一份「旧书交换会」通告，
 *   100-120 词，需含 ①具体时间地点 ②交换旧书的好处 ③邀请同学参加。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* -------------------- Ⅰ. 语音知识（5 题 · 全） -------------------- */
{
  id: "real-d-pho-01", level: 1, module: "phonetics", topic: "phonetics-i",
  real: true, source: "2025 成考专升本真题 · 语音 第1题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["ar__i__se", "br__i__ck", "pr__i__de", "ch__i__ld"],
  answer: 1,
  explanation: "arise / pride / child 里的 i 读 /aɪ/（爱）。brick 是短音 /ɪ/。规律：i 在开音节或“辅音+e”里读 /aɪ/；被两个辅音夹住（brick、six、sit）读 /ɪ/。",
  optionNotes: ["错：arise 读 /aɪ/", "对：brick 读 /ɪ/，不同 → 选它", "错：pride 读 /aɪ/", "错：child 读 /aɪ/"]
},
{
  id: "real-d-pho-02", level: 1, module: "phonetics", topic: "phonetics-ea",
  real: true, source: "2025 成考专升本真题 · 语音 第2题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["h__ea__d", "b__ea__d", "l__ea__f", "h__ea__t"],
  answer: 0,
  explanation: "bead / leaf / heat 里的 ea 读长音 /iː/。head 读短音 /e/。**ea 读 /e/ 的一组要背死**：head、bread、sweat、weather、health、dead——2025 和另一套真题都考了这个点。",
  optionNotes: ["对：head 读 /e/，不同 → 选它", "错：bead 读 /iː/", "错：leaf 读 /iː/", "错：heat 读 /iː/"]
},
{
  id: "real-d-pho-03", level: 1, module: "phonetics", topic: "phonetics-ow",
  real: true, source: "2025 成考专升本真题 · 语音 第3题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["c__ow__", "h__ow__", "l__ow__", "n__ow__"],
  answer: 2,
  explanation: "ow 有两读：cow / how / now 读 /aʊ/（凹）；low 读 /əʊ/（欧）。读 /əʊ/ 的一组：low、slow、snow、know、grow、show、window。",
  optionNotes: ["错：cow 读 /aʊ/", "错：how 读 /aʊ/", "对：low 读 /əʊ/，不同 → 选它", "错：now 读 /aʊ/"]
},
{
  id: "real-d-pho-04", level: 2, module: "phonetics", topic: "phonetics-th",
  real: true, source: "2025 成考专升本真题 · 语音 第4题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["too__th__", "smoo__th__", "weal__th__", "tru__th__"],
  answer: 1,
  explanation: "名词词尾的 th 多读清音 /θ/：tooth、wealth、truth。smooth 是**形容词**，th 读浊音 /ð/。小规律：th 在词尾读 /ð/ 的常见词——smooth、with、bathe、breathe（动词/形容词居多）。",
  optionNotes: ["错：tooth 读 /θ/", "对：smooth 读 /ð/，不同 → 选它", "错：wealth 读 /θ/", "错：truth 读 /θ/"]
},
{
  id: "real-d-pho-05", level: 2, module: "phonetics", topic: "phonetics-s",
  real: true, source: "2025 成考专升本真题 · 语音 第5题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["an__s__wer", "ab__s__ence", "e__s__cape", "di__s__ease"],
  answer: 3,
  explanation: "answer / absence / escape 里的 s 读清音 /s/。disease /dɪˈziːz/ 里的 s 读浊音 /z/。规律：s 夹在两个元音之间常浊化成 /z/（disease、music、please、easy、visit）。",
  optionNotes: ["错：answer 的 s 读 /s/", "错：absence 的 s 读 /s/", "错：escape 的 s 读 /s/", "对：disease 的 s 读 /z/，不同 → 选它"]
},

/* ---------------- Ⅱ. 词汇与结构（15 题 · 全） ---------------- */
{
  id: "real-d-vs-06", level: 2, module: "grammar", topic: "tag-question",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第6题",
  stem: "Let's celebrate the victory of our team in the sports meeting, ____ ?",
  options: ["do you", "do we", "will you", "shall we"],
  answer: 3,
  explanation: "**Let's ... 的反意疑问句固定用 shall we**（Let's 包含“你和我”，是提议，所以用 shall we 征求同意）。⚠️ 区分：**Let us**（不含听话人，表请求）用 will you；祈使句（Open the door, ____）也用 will you。",
  optionNotes: ["错：do you 不与 Let's 搭配", "错：do we 不是固定形式", "错：will you 用于祈使句或 Let us，不用于 Let's", "对：Let's ..., shall we? 是固定搭配"]
},
{
  id: "real-d-vs-07", level: 3, module: "grammar", topic: "noun-clause",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第7题",
  stem: "____ is late for the examination will not be allowed to enter the classroom.",
  options: ["Whoever", "Who", "Whom", "No matter who"],
  answer: 0,
  explanation: "空格要引导一个**主语从句**（整句主语＝“凡是迟到的人”），用 Whoever（＝Anyone who）。⚠️ 高频陷阱：**No matter who 只能引导让步状语从句**（No matter who comes, ...），不能作主语。",
  optionNotes: ["对：Whoever＝Anyone who，引导主语从句", "错：Who 不能这样引导主语从句", "错：Whom 作宾语，且从句缺主语", "错：No matter who 只引导状语从句，不能当主语"]
},
{
  id: "real-d-vs-08", level: 2, module: "grammar", topic: "non-finite",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第8题",
  stem: "____ the project on time, they had to work late into the night for several days.",
  options: ["Complete", "Completed", "To complete", "Completing"],
  answer: 2,
  explanation: "句首表**目的**用不定式：To complete the project on time＝为了按时完成项目。判断法：能翻译成“为了…”就用 to do。",
  optionNotes: ["错：句首不能直接用动词原形", "错：Completed 表被动，但项目不是主语 they 的状态", "对：To complete＝为了完成，表目的", "错：Completing 表伴随/主动动作，不表目的"]
},
{
  id: "real-d-vs-09", level: 3, module: "grammar", topic: "non-finite",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第9题",
  stem: "— Where do you usually have your hair ____ ?　— At the barber's near the grocery.",
  options: ["cut", "be cut", "cutting", "to cut"],
  answer: 0,
  explanation: "**have + 宾语 + 过去分词** ＝ 让别人做某事（头发是被理的）。cut 的过去分词就是 cut（cut-cut-cut 三态同形）。同类：have the car repaired（修车）、get my phone fixed。",
  optionNotes: ["对：have your hair cut＝（让人）理发，cut 是过去分词", "错：have 结构里不加 be", "错：cutting 是主动，头发不能自己剪", "错：have sth to do 意思不同（还有待做的事）"]
},
{
  id: "real-d-vs-10", level: 2, module: "grammar", topic: "collocation",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第10题",
  stem: "In the digital era, it is very important not to ____ personal information on the internet.",
  options: ["try out", "give out", "pick out", "keep out"],
  answer: 1,
  explanation: "**give out ＝ 发出、泄露**（信息），这里指不要在网上泄露个人信息。分清这组：try out＝试用；pick out＝挑出；keep out＝把…挡在外面。",
  optionNotes: ["错：try out＝试用、试验", "对：give out＝发出、泄露（信息）", "错：pick out＝挑出、辨认出", "错：keep out＝阻止进入"]
},
{
  id: "real-d-vs-11", level: 3, module: "grammar", topic: "collocation",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第11题",
  stem: "With more colleagues to help you with the task, you will be relieved ____ pressure.",
  options: ["by", "of", "against", "to"],
  answer: 1,
  explanation: "固定搭配 **be relieved of ＝ 被解除、免除（负担/压力/职务）**。同类“去除”类动词都爱配 of：rob sb **of** sth（抢走）、cure sb **of** a disease（治好）、rid sb **of** sth（摆脱）——这一串一起背。",
  optionNotes: ["错：relieved by 表“被…缓解”，与后面的 pressure 搭配不对", "对：be relieved of pressure＝压力被解除", "错：没有 relieved against 的搭配", "错：没有 relieved to + 名词的搭配"]
},
{
  id: "real-d-vs-12", level: 1, module: "grammar", topic: "comparative",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第12题",
  stem: "I cannot afford a dinner in that fancy restaurant. Let's try a ____ expensive one.",
  options: ["most", "more", "least", "less"],
  answer: 3,
  explanation: "前一句说“那家高级餐厅我吃不起”，所以要找一家**没那么贵**的 → a less expensive one。less + 形容词＝“不那么…”。选 more 就变成“更贵的”，与上文矛盾。",
  optionNotes: ["错：most 是最高级，且前面用 a 不搭", "错：more expensive＝更贵，与“吃不起”矛盾", "错：least 是最高级，要用 the least", "对：less expensive＝没那么贵"]
},
{
  id: "real-d-vs-13", level: 3, module: "grammar", topic: "word-choice",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第13题",
  stem: "Writing poetry about country life ____ her from the boredom of everyday life.",
  options: ["reminded", "benefited", "liberated", "persuaded"],
  answer: 2,
  explanation: "看后面的介词 **from** 就能锁定：**liberate sb from sth ＝ 把某人从…中解放出来**（写田园诗让她从日常的无聊中解脱）。remind sb **of**；persuade sb **to do**；benefit 一般不接 from + 人（是 sb benefits from sth）。**这题的诀窍是“认介词定动词”**。",
  optionNotes: ["错：remind sb of sth，不配 from", "错：benefit 的用法是 sb benefits from sth，主宾关系反了", "对：liberate sb from sth＝把某人从…中解放", "错：persuade sb to do / into doing，不配 from"]
},
{
  id: "real-d-vs-14", level: 2, module: "grammar", topic: "conjunction",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第14题",
  stem: "____ there was no obvious evidence against him, most people thought he was guilty.",
  options: ["Unless", "If", "While", "Because"],
  answer: 2,
  explanation: "前后是**让步转折**：“虽然没有明显证据指向他，大多数人还是认为他有罪。”用 While（此处＝Although，虽然）。⚠️ While 有两个意思：①当…时候 ②虽然、然而——句首表转折时就是“虽然”。",
  optionNotes: ["错：Unless＝除非，条件关系不通", "错：If＝如果，也讲不通", "对：While 在句首可表“虽然”，正合让步转折", "错：Because 表原因，逻辑正好相反"]
},
{
  id: "real-d-vs-15", level: 2, module: "grammar", topic: "past-perfect",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第15题",
  stem: "He ____ at the company for five years before he was promoted to a management position.",
  options: ["had worked", "has worked", "was working", "will have worked"],
  answer: 0,
  explanation: "**before + 一般过去时（was promoted），主句用过去完成时（had worked）**——“被提拔”是过去，“已干了五年”比它更早，是“过去的过去”。这是过去完成时最典型的考法。",
  optionNotes: ["对：had worked，表示在“被提拔”之前已持续五年", "错：has worked 是现在完成时，与过去的 was promoted 不呼应", "错：was working 不能表达“先于过去某点已持续五年”", "错：将来完成时与全句过去语境矛盾"]
},
{
  id: "real-d-vs-16", level: 3, module: "grammar", topic: "noun-clause",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第16题",
  stem: "The decision finally came from the manager ____ all staff should work extra hours.",
  options: ["when", "which", "what", "that"],
  answer: 3,
  explanation: "这是**同位语从句**：从句 all staff should work extra hours 用来说明 decision 的**具体内容**（决定＝全员加班），成分齐全不缺任何东西，所以用 that 且 that 不作句子成分、不能省。⚠️ 和定语从句的区别：定语从句里关系词要充当成分（作主语/宾语），同位语从句不充当。",
  optionNotes: ["错：when 表时间，decision 不是时间", "错：which 引导定语从句时要作成分，这里从句不缺成分", "错：what 引导的从句必须缺成分（what 自己作主语或宾语）", "对：that 引导同位语从句，说明 decision 的内容"]
},
{
  id: "real-d-vs-17", level: 2, module: "grammar", topic: "word-choice",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第17题",
  stem: "Paul's poor performance in the interview was a big ____ to his mother who had wanted her son to study at Harvard University.",
  options: ["act", "blow", "sign", "air"],
  answer: 1,
  explanation: "固定说法 **a big blow to sb ＝ 对某人的沉重打击**。妈妈本想让儿子上哈佛，面试表现差，对她是个打击。blow 除了“吹”还有“打击”这个高频名词义。",
  optionNotes: ["错：act＝行为、举动，不表打击", "对：a big blow to sb＝对某人的沉重打击", "错：sign＝标志、迹象", "错：air＝空气、神态，不搭"]
},
{
  id: "real-d-vs-18", level: 2, module: "grammar", topic: "relative-clause",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第18题",
  stem: "She is the only one in the office ____ can speak English fluently.",
  options: ["which", "whose", "where", "who"],
  answer: 3,
  explanation: "先行词 the only one 指**人**，从句 ____ can speak English fluently **缺主语**，所以用 who。⚠️ 别被紧挨着的 office 骗去选 where——真正的先行词是 the only one（那个人），不是办公室。",
  optionNotes: ["错：which 指物，这里指人", "错：whose 后面要跟名词", "错：where 是被 office 干扰的错误选项，先行词其实是 the only one", "对：who 指人且作从句主语"]
},
{
  id: "real-d-vs-19", level: 1, module: "grammar", topic: "word-choice",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第19题",
  stem: "With the help of the ____ glasses, people now can have a virtual tour of the museums around the world while sitting at home.",
  options: ["smart", "near", "mobile", "old"],
  answer: 0,
  explanation: "**smart glasses ＝ 智能眼镜**（smart 表“智能的”：smart phone、smart watch、smart home）。坐在家里就能虚拟游览博物馆，靠的是智能眼镜。",
  optionNotes: ["对：smart glasses＝智能眼镜，smart＝智能的", "错：near glasses 不是固定说法（近视眼镜是 glasses for short sight）", "错：mobile＝移动的，不与 glasses 搭配", "错：old glasses＝旧眼镜，做不到虚拟游览"]
},
{
  id: "real-d-vs-20", level: 3, module: "grammar", topic: "subjunctive",
  real: true, source: "2025 成考专升本真题 · 词汇与结构 第20题",
  stem: "The doctor strongly recommends that patient ____ follow a strict diet to be healthy.",
  options: ["following", "followed", "follow", "to follow"],
  answer: 2,
  explanation: "**recommend（建议）后的 that 从句用虚拟语气：(should) + 动词原形**，should 常省略，所以填 follow。这一串动词一起背：suggest / advise / recommend / insist / demand / require / order + that + (should) do。⚠️ 注意别看到 patient 是单数就加 s。",
  optionNotes: ["错：从句需要谓语动词，不能用 -ing", "错：followed 是过去式，虚拟语气要用原形", "对：(should) follow 省略 should，用动词原形", "错：从句要有真正的谓语，不能用不定式"]
},

]);

/* ==========================================================================
 * 第五套：2024 年 10 月成人高考全国统一考试 专升本《英语》
 * 来源：郑州函授站 http://www.zzkpedu.com/m/lnzt/2260.html（16 张试卷扫描图，已逐图识读）
 *
 * ✅ 这套是目前最可靠的一套：扫描件里**下划线清晰可见**（不用猜语音题考哪几个字母），
 *    而且末页附完整参考答案。收录的 20 道客观题（语音5 + 词汇与语法结构15）
 *    我已逐题独立验算，**与原卷答案 20/20 完全一致**，没有一道存疑。
 *
 * 原卷答案（供核对）：
 *   语音 1.B 2.B 3.A 4.A 5.C
 *   词汇与语法 6.D 7.B 8.C 9.D 10.C 11.D 12.B 13.C 14.D 15.C 16.A 17.B 18.D 19.A 20.A
 *   完形 21-35：A B C A B B D C D A D C C B D
 *   阅读 36-55：C A B D B A B D D C B A C A C C D A A B
 *   日常会话 56-60：H C B G E
 *
 * 📌 完形与阅读暂未收录：原卷这两部分的**文章原文就在同一批扫描图里**（第3-14页），
 *    答案也齐全，是可以做的——只是需要把 1 篇完形（15 空）+ 5 篇阅读（20 题）的
 *    英文原文逐字转录进来，工作量较大，留作下一批。这是补齐「阅读45分+完形30分」
 *    这 75 分缺口最靠谱的一条路。
 * 该卷作文题见第 15 页。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* -------------------- Ⅰ. 语音知识（5 题 · 全） -------------------- */
{
  id: "real-e-pho-01", paper: "R2024", ord: 1, level: 1, module: "phonetics", topic: "phonetics-u",
  real: true, source: "2024 成考专升本真题 · 语音 第1题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["j__u__st", "tr__u__th", "l__u__cky", "st__u__dy"],
  answer: 1,
  explanation: "just / lucky / study 里的 u 都读短音 /ʌ/（啊短）。truth 读长音 /uː/（乌）。同类读 /uː/ 的还有 rude、June、rule。",
  optionNotes: ["错：just 读 /ʌ/", "对：truth 读 /uː/，不同 → 选它", "错：lucky 读 /ʌ/", "错：study 读 /ʌ/"]
},
{
  id: "real-e-pho-02", paper: "R2024", ord: 2, level: 1, module: "phonetics", topic: "phonetics-ow",
  real: true, source: "2024 成考专升本真题 · 语音 第2题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["thr__ow__", "all__ow__", "arr__ow__", "wid__ow__"],
  answer: 1,
  explanation: "throw / arrow / widow 里的 ow 读 /əʊ/（欧）。allow 读 /aʊ/（凹）。小结：ow 读 /aʊ/ 的常见词——allow、cow、how、now、down、town；其余多读 /əʊ/。",
  optionNotes: ["错：throw 读 /əʊ/", "对：allow 读 /aʊ/，不同 → 选它", "错：arrow 读 /əʊ/", "错：widow 读 /əʊ/"]
},
{
  id: "real-e-pho-03", paper: "R2024", ord: 3, level: 2, module: "phonetics", topic: "phonetics-c",
  real: true, source: "2024 成考专升本真题 · 语音 第3题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["ex__c__use", "medi__c__ine", "__c__ertain", "de__c__ide"],
  answer: 0,
  explanation: "规律：**c 在 e / i / y 前面读 /s/**（medicine、certain、decide 都是 c+i 或 c+e）。excuse 里 c 前面是 s、后面是 u，读 /k/（整词 /ɪkˈskjuːs/）。这条规律记住，语音题送分。",
  optionNotes: ["对：excuse 的 c 读 /k/，不同 → 选它", "错：medicine 的 c 在 i 前读 /s/", "错：certain 的 c 在 e 前读 /s/", "错：decide 的 c 在 i 前读 /s/"]
},
{
  id: "real-e-pho-04", paper: "R2024", ord: 4, level: 2, module: "phonetics", topic: "phonetics-s",
  real: true, source: "2024 成考专升本真题 · 语音 第4题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["po__ss__ess", "pa__ss__port", "profe__ss__or", "pa__ss__age"],
  answer: 0,
  explanation: "passport / professor / passage 里的 ss 都读 /s/。possess /pəˈzes/ 是特例，划线的第一个 ss 读 /z/（浊化）。同类特例：dessert /dɪˈzɜːt/、scissors。",
  optionNotes: ["对：possess 的 ss 读 /z/，不同 → 选它", "错：passport 的 ss 读 /s/", "错：professor 的 ss 读 /s/", "错：passage 的 ss 读 /s/"]
},
{
  id: "real-e-pho-05", paper: "R2024", ord: 5, level: 1, module: "phonetics", topic: "phonetics-ear",
  real: true, source: "2024 成考专升本真题 · 语音 第5题",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["b__ear__", "w__ear__", "f__ear__", "p__ear__"],
  answer: 2,
  explanation: "bear（熊）/ wear（穿）/ pear（梨）里的 ear 都读 /eə/（诶儿）。fear（害怕）读 /ɪə/（衣儿）。这四个词是成考语音的经典组合，背下来：**只有 fear 不一样**（还有 hear、near、year 也读 /ɪə/）。",
  optionNotes: ["错：bear 读 /eə/", "错：wear 读 /eə/", "对：fear 读 /ɪə/，不同 → 选它", "错：pear 读 /eə/"]
},

/* ---------------- Ⅱ. 词汇与语法结构（15 题 · 全） ---------------- */
{
  id: "real-e-vs-06", paper: "R2024", ord: 6, level: 2, module: "grammar", topic: "present-perfect",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第6题",
  stem: "Due to the financial crisis, the stock prices ____ by 15% since last November.",
  options: ["fall", "are falling", "were falling", "have fallen"],
  answer: 3,
  explanation: "看到 **since + 过去时间点（last November）就用现在完成时**：have fallen，表示从那时跌到现在。这是完成时最好认的标志词，配 since / for / so far / up to now。",
  optionNotes: ["错：fall 是一般现在时，不能配 since", "错：现在进行时不表达“从过去持续到现在”", "错：过去进行时与 since 不搭", "对：have fallen，配 since last November"]
},
{
  id: "real-e-vs-07", paper: "R2024", ord: 7, level: 3, module: "grammar", topic: "subjunctive",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第7题",
  stem: "The university library requires that students ____ the books they have borrowed in time.",
  options: ["to return", "return", "returning", "returned"],
  answer: 1,
  explanation: "**require（要求）后的 that 从句用虚拟语气：(should) + 动词原形**，should 省略，所以用 return。这一串一起背：suggest / advise / recommend / insist / demand / require / order / request + that + (should) do。",
  optionNotes: ["错：从句要有谓语动词，不能用不定式", "对：(should) return 省略 should，用原形", "错：-ing 不能作从句谓语", "错：returned 是过去式，虚拟语气要原形"]
},
{
  id: "real-e-vs-08", paper: "R2024", ord: 8, level: 2, module: "grammar", topic: "relative-clause",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第8题",
  stem: "He is one of the many people ____ scientific careers were influenced by Yuan Longping's achievements.",
  options: ["who", "when", "whose", "which"],
  answer: 2,
  explanation: "**空后面紧跟名词（scientific careers）→ 用 whose**（这些人的科研生涯）。这是定语从句最好判断的一条：后面跟名词就是 whose，别的关系词都不行。",
  optionNotes: ["错：who 作主语，后面不能直接跟名词", "错：when 指时间，people 不是时间", "对：whose + 名词，表示“这些人的科研生涯”", "错：which 指物，且后面不能直接跟名词"]
},
{
  id: "real-e-vs-09", paper: "R2024", ord: 9, level: 2, module: "grammar", topic: "conjunction",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第9题",
  stem: "It was a very difficult examination. ____ , he passed it with a high score.",
  options: ["Similarly", "Additionally", "Therefore", "Nevertheless"],
  answer: 3,
  explanation: "前后是**转折**：考试很难，可他还是高分通过。用 Nevertheless（然而、尽管如此）。四个副词的方向要分清：Similarly＝同样地；Additionally＝另外；Therefore＝因此（顺承）；Nevertheless＝然而（转折）。",
  optionNotes: ["错：Similarly＝同样地，表类比", "错：Additionally＝另外，表补充", "错：Therefore＝因此，是顺承，但难考试→高分是转折", "对：Nevertheless＝然而，正合转折"]
},
{
  id: "real-e-vs-10", paper: "R2024", ord: 10, level: 3, module: "grammar", topic: "non-finite",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第10题",
  stem: "As John grew taller, his mother sorted out his clothes that needed ____ and donated them to those in need.",
  options: ["replace", "replaces", "replacing", "replaced"],
  answer: 2,
  explanation: "**need doing ＝ need to be done（需要被…）**：衣服是被替换的，用 need replacing。同类：The room needs cleaning（＝needs to be cleaned）。⚠️ 主语是「物」时，need 后用动名词表被动，这是高频考点。",
  optionNotes: ["错：need 后不能直接跟动词原形", "错：replaces 是三单形式，不能作 need 的宾语", "对：need replacing＝需要被更换", "错：need 后不接过去分词"]
},
{
  id: "real-e-vs-11", paper: "R2024", ord: 11, level: 1, module: "grammar", topic: "superlative",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第11题",
  stem: "— These mooncakes are delicious.　— But I think the ones with nuts are ____ of all.",
  options: ["delicious", "more delicious", "most delicious", "the most delicious"],
  answer: 3,
  explanation: "**of all（在所有当中）是最高级的标志，而最高级前面必须加 the** → the most delicious。选 C 少了 the，是最常见的扣分点。",
  optionNotes: ["错：原级无法表达“最”", "错：比较级用于两者之间，且不配 of all", "错：最高级前漏了 the", "对：the most delicious，最高级 + of all"]
},
{
  id: "real-e-vs-12", paper: "R2024", ord: 12, level: 2, module: "grammar", topic: "collocation",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第12题",
  stem: "The boy's parents were trying to have a conversation, but he kept ____ .",
  options: ["cutting out", "cutting in", "cutting across", "cutting back"],
  answer: 1,
  explanation: "**cut in ＝ 插话、打断别人说话**（父母想聊天，他老插嘴）。这组 cut 短语分清：cut out＝删掉、戒掉；cut across＝横穿；cut back＝削减。",
  optionNotes: ["错：cut out＝剪掉、删除、戒掉", "对：cut in＝插话、打断", "错：cut across＝横穿、抄近路", "错：cut back＝削减（开支）"]
},
{
  id: "real-e-vs-13", paper: "R2024", ord: 13, level: 2, module: "grammar", topic: "collocation",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第13题",
  stem: "The management is open ____ suggestions on how working conditions can be improved.",
  options: ["at", "for", "to", "with"],
  answer: 2,
  explanation: "固定搭配 **be open to ＝ 乐于接受（建议/批评）**。顺带记一串 be + 形容词 + to：be open to、be similar to、be used to、be related to、be equal to。",
  optionNotes: ["错：没有 open at 这个搭配", "错：open for 一般指“开放供…使用”，不表接受建议", "对：be open to suggestions＝乐于接受建议", "错：没有 open with 表接受"]
},
{
  id: "real-e-vs-14", paper: "R2024", ord: 14, level: 2, module: "grammar", topic: "conjunction",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第14题",
  stem: "Travelling with a dog, you make friends ____ you go.",
  options: ["whatever", "whoever", "whichever", "wherever"],
  answer: 3,
  explanation: "空后是 you go，缺的是**地点**——“无论你走到哪里”用 wherever。四个 -ever 各管一样：whatever＝无论什么；whoever＝无论谁；whichever＝无论哪一个；wherever＝无论哪里。",
  optionNotes: ["错：whatever 指事物", "错：whoever 指人", "错：whichever 指“哪一个”，需有可选范围", "对：wherever you go＝无论你走到哪里"]
},
{
  id: "real-e-vs-15", paper: "R2024", ord: 15, level: 3, module: "grammar", topic: "noun-clause",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第15题",
  stem: "____ a fire door does is to delay the spread of a fire long enough for people to escape.",
  options: ["that", "how", "what", "which"],
  answer: 2,
  explanation: "空格引导**主语从句**，而且从句里 does 缺宾语（防火门“做的事”）→ 用 what（what 自己充当 does 的宾语）。⚠️ 关键区分：**that 引导主语从句时从句成分齐全；what 用于从句缺主语或宾语时**。这里缺宾语，所以只能是 what。",
  optionNotes: ["错：that 引导的从句必须成分完整，这里 does 缺宾语", "错：how 表方式，句意不通", "对：what 既引导从句又作 does 的宾语", "错：which 需有明确的选择范围"]
},
{
  id: "real-e-vs-16", paper: "R2024", ord: 16, level: 3, module: "grammar", topic: "word-choice",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第16题",
  stem: "The local people have been living for years under the ____ of fear because the volcano is becoming more active.",
  options: ["shadow", "cover", "distance", "violence"],
  answer: 0,
  explanation: "固定表达 **under the shadow of ＝ 在…的阴影下**（火山越来越活跃，当地人多年生活在恐惧的阴影下）。这是比喻用法，shadow 表“阴影、笼罩感”。",
  optionNotes: ["对：under the shadow of fear＝在恐惧的阴影下", "错：under the cover of＝在…的掩护下，语义不合", "错：distance＝距离，不搭 of fear", "错：violence＝暴力，与 fear 搭配不通"]
},
{
  id: "real-e-vs-17", paper: "R2024", ord: 17, level: 3, module: "grammar", topic: "non-finite",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第17题",
  stem: "With tears ____ down her face, she kissed goodbye to her parents.",
  options: ["stream", "streaming", "to stream", "streamed"],
  answer: 1,
  explanation: "**with + 宾语 + 现在分词**表伴随状态：眼泪是主动往下流，用 streaming。这个「with 复合结构」很常考：with the light **burning**（灯亮着）、with his eyes **closed**（闭着眼——被动就用过去分词）。判断口诀：**主动用 -ing，被动用 -ed**。",
  optionNotes: ["错：with 结构里不能用动词原形", "对：泪水主动流下，用现在分词 streaming", "错：不定式表将来或目的，不表此刻伴随", "错：过去分词表被动，泪水不是“被流”"]
},
{
  id: "real-e-vs-18", paper: "R2024", ord: 18, level: 3, module: "grammar", topic: "noun-clause",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第18题",
  stem: "As a famous painter, he really loves what he's been doing and that's ____ his passion is.",
  options: ["which", "when", "how", "where"],
  answer: 3,
  explanation: "that's ____ his passion is ＝「那就是他热情**所在之处**」，用 where 引导表语从句（表地点/所在）。类似高频句式：This is **where** I was born. / That's **where** you are wrong（你就错在这儿）。",
  optionNotes: ["错：which 不引导表语从句", "错：when 指时间，句子讲的是“所在”", "错：how 表方式，与 is 搭配不通", "对：where 表“所在之处”，that's where...是常用句式"]
},
{
  id: "real-e-vs-19", paper: "R2024", ord: 19, level: 2, module: "grammar", topic: "modal-verb",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第19题",
  stem: "— I haven't seen Jerry for a while. Do you have any idea where he is?　— He ____ be at home, but I'm not sure about that.",
  options: ["might", "must", "will", "need"],
  answer: 0,
  explanation: "后半句 **but I'm not sure about that（我不确定）** 是关键——说明把握不大，用 might（也许）。must be 表示“肯定是”，语气太强，和“我不确定”自相矛盾。**做推测题先看有没有“不确定”的提示词。**",
  optionNotes: ["对：might be＝也许在，与“我不确定”一致", "错：must be＝肯定是，与后半句矛盾", "错：will be 指将来，不表推测", "错：need 是需要，语义不通"]
},
{
  id: "real-e-vs-20", paper: "R2024", ord: 20, level: 3, module: "grammar", topic: "inversion",
  real: true, source: "2024 成考专升本真题 · 词汇与语法 第20题",
  stem: "No sooner ____ than he realised it was no longer what he wanted.",
  options: ["had he started", "he had started", "had started he", "started he had"],
  answer: 0,
  explanation: "**No sooner ... than ...＝一…就…**，两个考点同时考：① No sooner 放句首要**部分倒装**（助动词提到主语前）；② 时态固定搭配——No sooner 后用**过去完成时**（had done），than 后用一般过去时。所以是 had he started。同类句型：Hardly had he... when...",
  optionNotes: ["对：倒装 had he started + 过去完成时，符合 No sooner...than 句型", "错：没有倒装", "错：倒装形式错，助动词后应紧跟主语 he", "错：语序完全错乱"]
},

]);
