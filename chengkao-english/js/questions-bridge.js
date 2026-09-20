/* ============================================================================
 * questions-bridge.js —— 搭桥题：7 大考点的最简形态（42 道）
 * ----------------------------------------------------------------------------
 * 为什么有这个文件：地基题（level 1）是新概念1 前 80 课的内容，真题级考的是
 * 非谓语、定语从句、虚拟语气——中间没有台阶，从 "I am a student" 直接跳到
 * 虚拟语气等于劝退。这 42 道就是那级台阶：
 *   - 每道题只考一个套路，句子里没有生词（全部 A2 词汇）
 *   - 讲解按「套路一句话 → 为什么 → 怎么记」写，给零基础的人看
 *   - 字段 bridge:true + level:2 —— 地基阶梯把它单独算一级（第 2 级·搭桥）
 * topic 全部落在 core.js 的 POINT_TOPICS 映射里，会被算进对应考点。
 * optionNotes 长度必须等于 options 长度；中文引号一律用全角“”。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* ==================== 考点1 非谓语动词（7 道）====================
 * 桥的高度：只教「哪些词后面接 doing、哪些接 to do」这一层，
 * 不碰分词作状语、独立主格那些真题级的形态。 */
{
  id: "br-nf-01", level: 2, bridge: true, module: "grammar", topic: "non-finite",
  stem: "I enjoy ____ music.",
  options: ["listening to", "listen to", "to listen to", "listens to"],
  answer: 0,
  zh: "我喜欢听音乐。",
  explanation: "套路：enjoy（喜欢）后面必须接 doing。为什么？一个句子只能有一个“真正的动词”，这里 enjoy 已经是了，后面的动作要变成 -ing 形式。记住一句话：享受爱好类的词（enjoy / finish / practice）后面都接 doing。",
  optionNotes: [
    "对：enjoy + doing 是固定搭配",
    "错：listen 是动词原形，句子里已经有 enjoy 这个动词了，不能再放一个原形",
    "错：enjoy 后面不接 to do（这是它的脾气，记住就行）",
    "错：listens 是第三人称形式，更不能放在 enjoy 后面"
  ]
},
{
  id: "br-nf-02", level: 2, bridge: true, module: "grammar", topic: "non-finite",
  stem: "I want ____ home now.",
  options: ["go", "to go", "going", "goes"],
  answer: 1,
  zh: "我现在想回家。",
  explanation: "套路：want（想要）后面接 to do。“想要做”的事情还没发生，将来才做——表示将来、目的的动作用 to do。同类词：want / decide / hope / plan，后面都接 to do。",
  optionNotes: [
    "错：句子已经有动词 want，不能再放原形 go",
    "对：want + to do，想做的事还没做，用 to do",
    "错：want 后面不接 doing",
    "错：goes 是给 he/she/it 用的形式，放这里语法不通"
  ]
},
{
  id: "br-nf-03", level: 2, bridge: true, module: "grammar", topic: "non-finite",
  stem: "She finished ____ her homework at nine.",
  options: ["do", "doing", "to do", "did"],
  answer: 1,
  zh: "她九点做完了作业。",
  explanation: "套路：finish（完成）后面接 doing。能“完成”的事一定是已经在做的事，正在做/已经做的动作用 doing。finish / enjoy / practice / keep 是一伙的，都接 doing。",
  optionNotes: [
    "错：句子已有动词 finished，不能再放原形",
    "对：finish + doing 固定搭配",
    "错：to do 表示还没做的事，和“完成”矛盾",
    "错：did 是过去式，一个句子不能有两个过去式动词"
  ]
},
{
  id: "br-nf-04", level: 2, bridge: true, module: "grammar", topic: "non-finite",
  stem: "He decided ____ English every day.",
  options: ["to study", "studying", "study", "studies"],
  answer: 0,
  zh: "他决定每天学英语。",
  explanation: "套路：decide（决定）后面接 to do。决定要做的事是将来才做的，所以用 to do。记这一组：decide / want / hope / plan / promise + to do。",
  optionNotes: [
    "对：decide + to do，决定做的事还没发生",
    "错：decide 不接 doing",
    "错：句子已有动词 decided，不能再放原形",
    "错：studies 是第三人称单数形式，不能放在 decided 后面"
  ]
},
{
  id: "br-nf-05", level: 2, bridge: true, module: "grammar", topic: "non-finite",
  stem: "Stop ____! The baby is sleeping.",
  options: ["talk", "talking", "to talk", "talks"],
  answer: 1,
  zh: "别说话了！宝宝在睡觉。",
  explanation: "套路：stop doing = 停止做（正在做的事别做了）。宝宝在睡觉，是让对方“别再说话了”，所以 stop talking。对比：stop to do = 停下来去做另一件事（stop to talk = 停下手头的事、开始说话）——意思正好相反，考试就爱考这个区别。",
  optionNotes: [
    "错：stop 后面不能直接跟动词原形",
    "对：stop doing = 停止正在做的事",
    "错：stop to talk 意思是“停下来去说话”，和让人安静正相反",
    "错：talks 的形式放在这里语法不通"
  ]
},
{
  id: "br-nf-06", level: 2, bridge: true, module: "grammar", topic: "gerund",
  stem: "____ in the river is dangerous.",
  options: ["Swim", "To swimming", "Swimming", "Swims"],
  answer: 2,
  zh: "在河里游泳很危险。",
  explanation: "套路：动作当主语用，要变成 doing 形式（叫“动名词”）。“在河里游泳很危险”——“游泳”这个动作在这里当名词用，所以写成 Swimming。整个动名词当一件事看，后面动词用单数 is。",
  optionNotes: [
    "错：动词原形不能直接当主语",
    "错：to 后面接原形（to swim），to swimming 是拼错的形式",
    "对：动作当主语 → 用 doing 形式",
    "错：Swims 是动词的第三人称形式，不能当主语"
  ]
},
{
  id: "br-nf-07", level: 2, bridge: true, module: "grammar", topic: "non-finite",
  stem: "I am very happy ____ you again.",
  options: ["saw", "see", "seeing", "to see"],
  answer: 3,
  zh: "很高兴又见到你。",
  explanation: "套路：形容词后面接 to do，说明高兴/难过的原因。be happy to do = 很高兴做某事。同类：be glad to do、be sorry to do、be ready to do。",
  optionNotes: [
    "错：句子已经有动词 am，不能再放过去式 saw",
    "错：也不能放动词原形 see",
    "错：happy 后面的习惯搭配是 to do 不是 doing",
    "对：be happy to do 固定搭配，“见到你很高兴”"
  ]
},

/* ==================== 考点2 定语从句（7 道）====================
 * 桥的高度：只教 who / that / whose / where / when 五个词怎么选，
 * 判断法就一条：先行词是人还是物 + 从句缺什么。 */
{
  id: "br-rc-01", level: 2, bridge: true, module: "grammar", topic: "relative-clause",
  viz: {"en": "The man (who is talking to Tom) is my father.", "rows": [["主干", "The man is my father.", "那个男人是我爸"], ["括号补充", "who is talking to Tom", "他正在跟 Tom 说话"]]},
  stem: "The man ____ is talking to Tom is my father.",
  options: ["which", "who", "where", "what"],
  answer: 1,
  zh: "那位正在跟 Tom 说话的男士是我爸爸。",
  explanation: "套路：空后面那句话（is talking to Tom）缺一个“谁”，而说的是 the man（人）——人，就用 who。定语从句第一步永远是：看被修饰的词是人还是物。",
  optionNotes: [
    "错：which 用于物，the man 是人",
    "对：先行词是人 + 从句缺主语 → who",
    "错：where 表示地点，这里缺的是“谁”不是“哪里”",
    "错：what 不能引导定语从句（这是考试常设的坑）"
  ]
},
{
  id: "br-rc-02", level: 2, bridge: true, module: "grammar", topic: "relative-clause",
  viz: {"en": "This is the photo (that I took in Beijing).", "rows": [["主干", "This is the photo.", "这就是那张照片"], ["括号补充", "that I took in Beijing", "我在北京拍的"]]},
  stem: "This is the photo ____ I took in Beijing.",
  options: ["who", "where", "that", "when"],
  answer: 2,
  zh: "这就是我在北京拍的那张照片。",
  explanation: "套路：I took in Beijing（我在北京拍）——拍了“什么”没说，缺一个东西；被修饰的 the photo 是物。物 + 缺主语或宾语 → that 或 which。",
  optionNotes: [
    "错：who 用于人，book 是物",
    "错：where 表地点；这句缺的是 took 的宾语（拍的东西），不是地点",
    "对：物 + 从句缺宾语 → that（用 which 也对）",
    "错：when 表时间，这里不缺时间"
  ]
},
{
  id: "br-rc-03", level: 2, bridge: true, module: "grammar", topic: "relative-clause",
  viz: {"en": "I like the girl (who sings very well).", "rows": [["主干", "I like the girl.", "我喜欢那个女孩"], ["括号补充", "who sings very well", "她唱歌很好听"]]},
  stem: "I like the girl ____ sings very well.",
  options: ["which", "where", "when", "who"],
  answer: 3,
  zh: "我喜欢那个女孩，她唱歌很好听。",
  explanation: "套路：sings very well 前面缺“谁在唱”；被修饰的 the girl 是人。人 + 缺主语 → who（用 that 也行）。",
  optionNotes: [
    "错：which 用于物",
    "错：where 表地点，从句缺的是主语",
    "错：when 表时间",
    "对：人 + 缺主语 → who"
  ]
},
{
  id: "br-rc-04", level: 2, bridge: true, module: "grammar", topic: "relative-clause",
  viz: {"en": "The house (that we live in) is very old.", "rows": [["主干", "The house is very old.", "那所房子很旧"], ["括号补充", "that we live in", "我们住在里面——in 缺的宾语就是它，所以不用 where"]]},
  stem: "The house ____ we live in is very old.",
  options: ["who", "that", "where", "when"],
  answer: 1,
  zh: "我们住的那所房子很旧了。",
  explanation: "套路：先把从句还原——we live in ____（我们住在……里面），in 后面缺东西！缺的是宾语，所以用 that/which。⚠️ 别看到 house 就选 where：只有从句“已经完整”（比如 we live，没有 in）才轮到 where。这是定语从句最经典的坑。",
  optionNotes: [
    "错：who 用于人",
    "对：从句里 in 的宾语缺了 → 物 + 缺宾语 → that",
    "错：where 的坑！从句里已经有 in 了，缺的是 in 的宾语，不是地点状语。如果句子是 the house where we live（没有 in），才用 where",
    "错：when 表时间"
  ]
},
{
  id: "br-rc-05", level: 2, bridge: true, module: "grammar", topic: "relative-clause",
  viz: {"en": "This is the school (where I study).", "rows": [["主干", "This is the school.", "这就是那所学校"], ["括号补充", "where I study", "我在这里上学（从句完整 → where）"]]},
  stem: "This is the school ____ I study.",
  options: ["that", "where", "which", "who"],
  answer: 1,
  zh: "这就是我上学的那所学校。",
  explanation: "套路：从句 I study（我学习）主语谓语都齐了，不缺主语也不缺宾语——完整的句子只能补“在哪里”，所以用 where。和上一题对比着记：缺东西用 that/which，不缺东西用 where/when。",
  optionNotes: [
    "错：that 需要从句缺主语或宾语，I study 什么都不缺",
    "对：从句完整 + 先行词是地点 → where",
    "错：which 同 that，需要从句缺成分",
    "错：who 用于人"
  ]
},
{
  id: "br-rc-06", level: 2, bridge: true, module: "grammar", topic: "relative-clause",
  viz: {"en": "The boy (whose father is a doctor) is my friend.", "rows": [["主干", "The boy is my friend.", "那男孩是我朋友"], ["括号补充", "whose father is a doctor", "他爸爸是医生"]]},
  stem: "The boy ____ father is a doctor is my friend.",
  options: ["who", "whom", "whose", "which"],
  answer: 2,
  zh: "我有个朋友，他爸爸是医生。",
  explanation: "套路：____ father = “谁的”爸爸——缺一个“……的”，表示“谁的”就用 whose。判断法：空后面紧跟着名词（father），十有八九是 whose。",
  optionNotes: [
    "错：who 代替人本身，不能表示“谁的”",
    "错：whom 是 who 的宾语形式，也不表示“谁的”",
    "对：空后面紧跟名词 father，“男孩的爸爸” → whose",
    "错：which 用于物，且不表示“……的”"
  ]
},
{
  id: "br-rc-07", level: 2, bridge: true, module: "grammar", topic: "relative-clause",
  viz: {"en": "I remember the day (when we first met).", "rows": [["主干", "I remember the day.", "我记得那天"], ["括号补充", "when we first met", "我们第一次见面（从句完整，day 是时间 → when）"]]},
  stem: "I remember the day ____ we first met.",
  options: ["which", "where", "when", "who"],
  answer: 2,
  zh: "我还记得我们第一次见面的那天。",
  explanation: "套路：从句 we first met（我们第一次见面）是完整的，不缺主语宾语；被修饰的 the day 是时间——完整从句 + 时间词 → when。",
  optionNotes: [
    "错：which 需要从句缺成分，这句是完整的",
    "错：where 用于地点，day 是时间",
    "对：从句完整 + 先行词是时间 → when",
    "错：who 用于人"
  ]
},

/* ==================== 考点3 时态（6 道）====================
 * 桥的高度：只教「看标志词选时态」，一个标志词对应一个时态，
 * 不碰时态混合、语境推断那些真题级的判断。 */
{
  id: "br-ts-01", level: 2, bridge: true, module: "grammar", topic: "present-perfect",
  stem: "I ____ in Shanghai since 2020.",
  options: ["have lived", "live", "lived", "am living"],
  answer: 0,
  zh: "我从 2020 年起就住在上海。",
  explanation: "套路：看到 since（自从……以来）= 现在完成时（have/has + 过去分词）。“从 2020 年住到现在”，动作从过去延续到现在，就是现在完成时管的事。标志词记三个就够：since、for + 一段时间、already。",
  optionNotes: [
    "对：since → have/has done，“从那时住到现在”",
    "错：live 是一般现在时，表达不了“从 2020 年开始”这层意思",
    "错：lived 是过去时，意思变成“过去住过、现在不住了”",
    "错：am living 是“现在正在住”，跟 since 2020 配不上"
  ]
},
{
  id: "br-ts-02", level: 2, bridge: true, module: "grammar", topic: "tense",
  stem: "He ____ to Beijing two days ago.",
  options: ["goes", "went", "has gone", "will go"],
  answer: 1,
  zh: "他两天前去了北京。",
  explanation: "套路：看到 ago（……以前）= 一般过去时。“两天前去的”，是过去某个时间点发生的事，动词用过去式。ago / yesterday / last week 都是过去时的标志。",
  optionNotes: [
    "错：goes 是一般现在时，和“两天前”矛盾",
    "对：ago → 过去式 went",
    "错：has gone 是现在完成时，⚠️ 完成时不能和 ago 这种明确的过去时间连用（这是考试爱设的坑）",
    "错：will go 是将来时，方向反了"
  ]
},
{
  id: "br-ts-03", level: 2, bridge: true, module: "grammar", topic: "present-perfect",
  stem: "She has already ____ her homework.",
  options: ["finish", "finishes", "finishing", "finished"],
  answer: 3,
  zh: "她已经做完作业了。",
  explanation: "套路：has/have 后面必须接过去分词（done）。already（已经）也提示这是现在完成时。结构死记：have/has + done，中间可以插 already。",
  optionNotes: [
    "错：has 后面不能接动词原形",
    "错：finishes 是第三人称一般现在时，不能跟在 has 后面",
    "错：has + doing 不是英语里存在的结构",
    "对：has + 过去分词 finished，“已经做完了”"
  ]
},
{
  id: "br-ts-04", level: 2, bridge: true, module: "grammar", topic: "past-continuous",
  stem: "I ____ TV when the phone rang.",
  options: ["watch", "watched", "am watching", "was watching"],
  answer: 3,
  zh: "电话响的时候我正在看电视。",
  explanation: "套路：“电话响的时候我正在看电视”——过去某一刻正在进行的动作，用过去进行时（was/were + doing）。判断法：句子里有一个过去的“插入动作”（the phone rang），被打断的那个动作用 was doing。",
  optionNotes: [
    "错：watch 是现在时，故事发生在过去",
    "错：watched 也说得通语法，但表达不出“正在看的时候被打断”",
    "错：am watching 是现在进行时，时间对不上",
    "对：过去正在进行 + 被 rang 打断 → was watching"
  ]
},
{
  id: "br-ts-05", level: 2, bridge: true, module: "grammar", topic: "past-perfect",
  stem: "By the time I arrived, the film ____.",
  options: ["begins", "began", "had begun", "has begun"],
  answer: 2,
  zh: "我到的时候，电影已经开演了。",
  explanation: "套路：看到 by the time + 过去式（arrived）= 主句用过去完成时（had done）。“我到的时候电影已经开始了”——开始在到达之前，是“过去的过去”，就用 had done。这个标志词组合直接背。",
  optionNotes: [
    "错：begins 是现在时，全句在讲过去",
    "错：began 只是过去时，表达不出“比到达更早”",
    "对：过去的过去 → had begun",
    "错：has begun 是现在完成时，不能出现在过去的故事里"
  ]
},
{
  id: "br-ts-06", level: 2, bridge: true, module: "grammar", topic: "present-continuous",
  stem: "Look! The children ____ in the park.",
  options: ["play", "are playing", "played", "have played"],
  answer: 1,
  zh: "你看！孩子们正在公园里玩。",
  explanation: "套路：看到 Look!（你看！）= 现在进行时（am/is/are + doing）。让人“看”，说明动作此刻正在眼前发生。Look! / Listen! 都是现在进行时的信号。",
  optionNotes: [
    "错：play 是一般现在时，表示习惯，不是“此刻正在”",
    "对：Look! → 正在发生 → are playing",
    "错：played 是过去式，眼前的事不是过去",
    "错：have played 是“已经玩过了”，和“你看！”矛盾"
  ]
},

/* ==================== 考点4 虚拟语气（6 道）====================
 * 桥的高度：只教三个死公式（were / would do / would have done）
 * 和一个对照（真实条件句），不碰倒装虚拟、含蓄虚拟。 */
{
  id: "br-sj-01", level: 2, bridge: true, module: "grammar", topic: "subjunctive",
  stem: "If I ____ you, I would say sorry to her.",
  options: ["am", "was", "be", "were"],
  answer: 3,
  zh: "我要是你的话，就去跟她道歉。（我不是你）",
  explanation: "套路：“如果我是你”——我不可能是你，这是和现实相反的假设，be 动词一律用 were（不管主语是谁）。If I were you 整个背下来，考试年年见。",
  optionNotes: [
    "错：am 是真实情况用的，“我是你”不是真实情况",
    "错：was 是最大的坑！虚拟语气里 be 不用 was，一律 were",
    "错：be 原形放这里语法不通",
    "对：与现实相反的假设 → If I were you"
  ]
},
{
  id: "br-sj-02", level: 2, bridge: true, module: "grammar", topic: "subjunctive",
  stem: "If I had money now, I ____ a new phone.",
  options: ["buy", "will buy", "would buy", "bought"],
  answer: 2,
  zh: "我现在要是有钱，就买个新手机。（我没钱）",
  explanation: "套路：与现在事实相反的假设（现在其实没钱），公式：If + 过去式，主句 would + 动词原形。前半句 had 已经告诉你这是虚拟了，主句配 would buy。",
  optionNotes: [
    "错：buy 缺了 would，和前面的 had 配不成公式",
    "错：will buy 用于真实的将来，这里是“没钱”的假设",
    "对：If + 过去式 → would + 原形",
    "错：bought 放主句里不成立，过去式该待在 if 那半句"
  ]
},
{
  id: "br-sj-03", level: 2, bridge: true, module: "grammar", topic: "subjunctive",
  stem: "I wish I ____ taller.",
  options: ["am", "was", "were", "is"],
  answer: 2,
  zh: "但愿我能高一点。（其实不高）",
  explanation: "套路：wish（真希望……）后面的事都是没实现的，用虚拟：接过去式，be 一律 were。I wish I were... = 我要是……就好了。和 If I were you 是同一个 were。",
  optionNotes: [
    "错：am 是真实情况，wish 后面全是“没实现的愿望”",
    "错：was 同样是坑，虚拟语气里 be 只用 were",
    "对：wish + 过去式（be → were）",
    "错：is 放在 I 后面本身就不对"
  ]
},
{
  id: "br-sj-04", level: 2, bridge: true, module: "grammar", topic: "conditional",
  stem: "If he ____ free tomorrow, he will help us.",
  options: ["be", "is", "was", "will be"],
  answer: 1,
  zh: "如果他明天有空，他会来帮我们。（真有可能）",
  explanation: "套路：这句不是虚拟！“他明天有空”完全可能发生，是真实条件句，公式：主句将来时（will help），if 从句用一般现在时——口诀“主将从现”。和虚拟语气的区别就看一点：这事有没有可能发生。可能发生→主将从现；不可能→虚拟。",
  optionNotes: [
    "错：be 原形不能直接当谓语",
    "对：真实条件句，if 从句用一般现在时 is",
    "错：was 过去式会把句子变成虚拟，但“他明天有空”是可能发生的真事",
    "错：if 从句里不放 will，will 待在主句里（主将从现）"
  ]
},
{
  id: "br-sj-05", level: 2, bridge: true, module: "grammar", topic: "subjunctive",
  stem: "If he had studied hard, he ____ the exam.",
  options: ["passed", "would have passed", "would pass", "has passed"],
  answer: 1,
  zh: "他要是当初用功，考试就过了。（他没用功）",
  explanation: "套路：与过去事实相反（他当时没努力，已经没法改了），公式：If + had done，主句 would have done。判断法：看到 if 半句是 had done，主句闭着眼选 would have done。",
  optionNotes: [
    "错：passed 单独的过去式配不上 had studied",
    "对：与过去相反 → would have done",
    "错：would pass 是“与现在相反”的公式，和 had studied 不配套（考试最爱考这个错配）",
    "错：has passed 现在完成时，和假设无关"
  ]
},
{
  id: "br-sj-06", level: 2, bridge: true, module: "grammar", topic: "subjunctive",
  stem: "The teacher suggested that he ____ more books.",
  options: ["reads", "read", "will read", "is reading"],
  answer: 1,
  zh: "老师建议他多读点书。",
  explanation: "套路：suggest（建议）后面的 that 从句用“(should) + 动词原形”，should 通常省略——所以看起来就是个原形 read。同类词：suggest / demand / insist / order，都是“建议命令类”，后面全这样。",
  optionNotes: [
    "错：reads 加了 s，但这里要的是 (should) read 的原形",
    "对：suggest + that + (should) 动词原形，should 省略后剩 read",
    "错：建议的内容不用 will",
    "错：进行时和“建议”不搭"
  ]
},

/* ==================== 考点5 倒装与强调（6 道）====================
 * 桥的高度：只教三个可以死记的形状：Never 开头提 have、
 * Only then 开头补 did、It was...that 强调句。 */
{
  id: "br-iv-01", level: 2, bridge: true, module: "grammar", topic: "inversion",
  stem: "Never ____ seen such a big cat.",
  options: ["I have", "have I", "I had", "had I"],
  answer: 1,
  zh: "我从没见过这么大的猫。",
  explanation: "套路：Never（从来没有）放在句首，后面要“部分倒装”——把 have 提到 I 前面。正常语序是 I have never seen...，把 never 挪到开头，have 就得跟着往前跳。记形状：Never + 助动词 + 主语。",
  optionNotes: [
    "错：I have 是正常语序，但 Never 开头必须倒装",
    "对：Never 句首 → have 提到 I 前面",
    "错：语序错了，而且没理由用过去完成时",
    "错：倒装形状对了，但 had 没有依据，这句说的是“到现在为止”"
  ]
},
{
  id: "br-iv-02", level: 2, bridge: true, module: "grammar", topic: "emphasis",
  viz: {"en": "(It was) in Beijing (that) I met her.", "rows": [["强调的壳", "It was … that …", "固定外壳，强调中间夹的部分"], ["被强调", "in Beijing", "是在北京（不是别处）"], ["验证", "in Beijing I met her", "删掉壳还读得通 → 是强调句"]]},
  stem: "____ was in Beijing that I met her.",
  options: ["That", "It", "This", "There"],
  answer: 1,
  zh: "我是在北京遇见她的。（强调“在北京”）",
  explanation: "套路：强调句的固定外壳：It is/was + 被强调的部分 + that + 剩下的话。这句强调“在北京”（地点）。验证法：把 It was 和 that 都删掉，剩下 in Beijing I met her 还能读通，就是强调句。开头永远是 It。",
  optionNotes: [
    "错：强调句的壳只能用 It 开头，不能用 That",
    "对：It was ... that ... 强调句固定外壳",
    "错：This 不能开这个头",
    "错：There was 是“某地有某物”，句型完全不同"
  ]
},
{
  id: "br-iv-03", level: 2, bridge: true, module: "grammar", topic: "inversion",
  stem: "Only then ____ understand the truth.",
  options: ["he did", "did he", "he does", "does he"],
  answer: 1,
  zh: "直到那时他才明白真相。",
  explanation: "套路：Only + 时间/地点（Only then = 直到那时）放句首，也要部分倒装。原句 he understood 里没有助动词，就补一个 did，动词变回原形：did he understand。记形状：Only then/there + did/does + 主语。",
  optionNotes: [
    "错：he did 是正常语序，Only then 开头必须倒装",
    "对：Only + 状语开头 → 补 did 提到主语前",
    "错：语序没倒",
    "错：倒装形状对，但“直到那时才明白”是过去的事，用 did 不用 does"
  ]
},
{
  id: "br-iv-04", level: 2, bridge: true, module: "grammar", topic: "inversion",
  stem: "—I like English very much. —____.",
  options: ["So do I", "So I do", "So am I", "So did I"],
  answer: 0,
  zh: "——我很喜欢英语。——我也是。",
  explanation: "套路：“我也是” = So + 助动词 + 主语。对方说 I like（一般现在时的实义动词），助动词就用 do → So do I。选哪个助动词，跟着对方那句话走：对方用 am 你就 So am I，对方用 did 你就 So did I。",
  optionNotes: [
    "对：对方说 like（一般现在时）→ So do I，“我也喜欢”",
    "错：So I do 语序没倒，意思变成“我确实如此”，不是“我也是”",
    "错：对方句子里没有 be 动词，不能用 am",
    "错：对方说的是现在的事，不用 did"
  ]
},
{
  id: "br-iv-05", level: 2, bridge: true, module: "grammar", topic: "inversion",
  stem: "Here ____ the bus!",
  options: ["come", "comes", "coming", "came"],
  answer: 1,
  zh: "车来了！",
  explanation: "套路：Here / There 放句首，主语是名词时整句倒装：Here comes the bus（车来了）。动词跟着真正的主语 the bus（单数）走，所以是 comes。这是口语里天天用的句子，当整句背。",
  optionNotes: [
    "错：主语 the bus 是单数，动词要加 s",
    "对：Here + 动词 + 主语，bus 单数 → comes",
    "错：coming 缺助动词，不能单独当谓语",
    "错：“车来了！”说的是眼前，不用过去式"
  ]
},
{
  id: "br-iv-06", level: 2, bridge: true, module: "grammar", topic: "emphasis",
  viz: {"en": "(It was) Tom (who) broke the window.", "rows": [["强调的壳", "It was … who …", "强调人可用 who"], ["被强调", "Tom", "是 Tom（不是别人）"], ["验证", "Tom broke the window", "删掉壳还读得通"]]},
  stem: "It was Tom ____ broke the window.",
  options: ["which", "where", "who", "when"],
  answer: 2,
  zh: "打破窗户的是 Tom。（强调“Tom”）",
  explanation: "套路：强调句 It was ... that/who ...，被强调的是人（Tom）时，可以用 who 也可以用 that。“打破窗户的是 Tom（不是别人）”。验证法照旧：删掉 It was 和 who，剩下 Tom broke the window 读得通。",
  optionNotes: [
    "错：强调句的连接词只有 that 和 who（强调人时），没有 which",
    "错：where 不能接强调句",
    "对：强调的是人 → who（that 也对）",
    "错：when 不能接强调句"
  ]
},

/* ==================== 考点6 主谓一致（4 道）====================
 * 桥的高度：只教「找真正的主语」这一个动作 + 三个常见形状。
 * （更全的题在 questions-sva.js，这里是入门版。） */
{
  id: "br-sv-01", level: 2, bridge: true, module: "grammar", topic: "subject-verb-agreement",
  stem: "Everyone in our class ____ hard.",
  options: ["work", "works", "are working", "have worked"],
  answer: 1,
  zh: "我们班每个人都很努力。",
  explanation: "套路：everyone / everybody / each 都当单数看（虽然指很多人），动词加 s。in our class 只是修饰，别被它带偏——真正的主语是 everyone。",
  optionNotes: [
    "错：work 是复数形式，everyone 是单数",
    "对：everyone → 单数 → works",
    "错：are 是复数的 be 动词",
    "错：have 也是复数形式，everyone 配 has"
  ]
},
{
  id: "br-sv-02", level: 2, bridge: true, module: "grammar", topic: "there-be",
  stem: "There ____ some water in the glass.",
  options: ["are", "is", "be", "were"],
  answer: 1,
  zh: "杯子里有一些水。",
  explanation: "套路：there be 句型看后面的名词定单复数。water（水）是不可数名词，不可数一律当单数 → is。不可数的常见成员：water / milk / money / time / bread。",
  optionNotes: [
    "错：are 配复数名词，water 不可数",
    "对：不可数名词当单数 → is",
    "错：be 原形不能直接当谓语",
    "错：were 是过去式，句子说的是现在"
  ]
},
{
  id: "br-sv-03", level: 2, bridge: true, module: "grammar", topic: "subject-verb-agreement",
  stem: "Two hundred dollars ____ a lot of money for me.",
  options: ["are", "were", "have been", "is"],
  answer: 3,
  zh: "两百美元对我来说是一大笔钱。",
  explanation: "套路：钱、时间、距离这类数量，虽然形式是复数（dollars 有 s），但当成“一笔钱、一段时间”整体看，动词用单数。Two hundred dollars = 一笔钱 → is。",
  optionNotes: [
    "错：被 dollars 的复数形式骗了，它是“一笔钱”整体",
    "错：数错了，时态也没依据",
    "错：同样数错了",
    "对：金额当整体 → is"
  ]
},
{
  id: "br-sv-04", level: 2, bridge: true, module: "grammar", topic: "subject-verb-agreement",
  stem: "Both Tom and Mary ____ good at English.",
  options: ["is", "was", "are", "be"],
  answer: 2,
  zh: "Tom 和 Mary 两个人英语都好。",
  explanation: "套路：both A and B（A 和 B 两个都）永远是复数 → are。对比记：either A or B（两者选一）就近原则看 B。both...and 是主谓一致里最省心的：见到就选复数。",
  optionNotes: [
    "错：is 是单数，both...and 是俩人",
    "错：was 单数且是过去式",
    "对：both A and B → 复数 are",
    "错：be 原形不能当谓语"
  ]
},

/* ==================== 考点7 连词逻辑（6 道）====================
 * 桥的高度：只教两条铁律（although 不配 but / because 不配 so）
 * 和三个高频形状（祈使句+or/and、so...that、despite+名词）。 */
{
  id: "br-cj-01", level: 2, bridge: true, module: "grammar", topic: "conjunction",
  stem: "____ he is old, he works very hard.",
  options: ["Although", "But", "Because", "So"],
  answer: 0,
  zh: "他虽然年纪大了，干活还是很卖力。",
  explanation: "套路：“虽然他年纪大，（但是）他工作很努力”——中文说“虽然……但是”，英文只能留一个！后半句没有 but，前面就用 Although。铁律：although 和 but 永远不同时出现。",
  optionNotes: [
    "对：让步关系，后半句没 but，用 Although 开头",
    "错：But 放句首接不出“虽然”的意思，而且两个分句间需要的是让步",
    "错：Because 是“因为”——年纪大不是努力工作的原因",
    "错：So 是“所以”，逻辑反了"
  ]
},
{
  id: "br-cj-02", level: 2, bridge: true, module: "grammar", topic: "conjunction",
  stem: "I was very tired, ____ I went to bed early.",
  options: ["but", "so", "although", "or"],
  answer: 1,
  zh: "我很累，所以早早就睡了。",
  explanation: "套路：“很累”和“早睡”是因果关系：因为累，所以早睡 → so。判断连词就问一句：这两句话是什么关系？转折用 but，因果用 so，选择用 or。",
  optionNotes: [
    "错：but 是转折，“累”和“早睡”不矛盾",
    "对：因果关系 → so（所以）",
    "错：although 是“虽然”，会让句意变成“虽然累但早睡”，不通",
    "错：or 是“或者”，这里不是二选一"
  ]
},
{
  id: "br-cj-03", level: 2, bridge: true, module: "grammar", topic: "conjunction",
  stem: "____ it was raining, we stayed at home.",
  options: ["Because", "Although", "But", "Or"],
  answer: 0,
  zh: "因为下雨，我们就待在家里了。",
  explanation: "套路：“下雨”和“待在家”是因果：因为下雨，所以在家 → Because。注意铁律的另一半：用了 because，后半句就不能再加 so（中文“因为……所以”在英文里也只能留一个）。",
  optionNotes: [
    "对：下雨是待在家的原因 → Because",
    "错：Although 会变成“虽然下雨我们还是待在家”，逻辑不通（下雨待在家很正常，不是让步）",
    "错：But 不能这样放句首连接两个分句",
    "错：Or 是“或者”"
  ]
},
{
  id: "br-cj-04", level: 2, bridge: true, module: "grammar", topic: "conjunction",
  stem: "Hurry up, ____ you will be late.",
  options: ["and", "or", "but", "so"],
  answer: 1,
  zh: "快点，不然你要迟到了。",
  explanation: "套路：祈使句 + or = “否则”。“快点，否则你要迟到了”。对比下一题：祈使句 + and = “这样就会”。这两个形状考试常一起出现，一好一坏对着记：or 接坏结果，and 接好结果。",
  optionNotes: [
    "错：and 接的是好结果（快点，这样就能赶上）——但“迟到”是坏结果",
    "对：祈使句 + or + 坏结果 = 否则",
    "错：but 在这个形状里不用",
    "错：so 也不用于这个形状"
  ]
},
{
  id: "br-cj-05", level: 2, bridge: true, module: "grammar", topic: "so-that",
  stem: "He is ____ tired that he can't walk.",
  options: ["very", "too", "so", "such"],
  answer: 2,
  zh: "他累得走不动了。",
  explanation: "套路：看到后面有 that + 结果，前面就配 so：so + 形容词 + that = “太……以至于……”。判断法：先找到 that，再回头看空格——有 that 就选 so，没有 that 才轮到 very/too。",
  optionNotes: [
    "错：very tired 本身没错，但 very 不能和后面的 that 配对",
    "错：too 的搭配是 too...to do（too tired to walk），不带 that",
    "对：so...that 固定配对，“累得走不动”",
    "错：such 后面接名词（such a tired man），tired 是形容词"
  ]
},
{
  id: "br-cj-06", level: 2, bridge: true, module: "grammar", topic: "conjunction",
  stem: "Get up early, ____ you will have time for breakfast.",
  options: ["and", "or", "but", "so"],
  answer: 0,
  zh: "早点起床，你就有时间吃早饭了。",
  explanation: "套路：祈使句 + and = “这样就会”。“早点起，就有时间吃早饭”——接的是好结果，用 and。和上面 Hurry up, or... 对比着记：好结果 and，坏结果 or。",
  optionNotes: [
    "对：祈使句 + and + 好结果 = 这样就会",
    "错：or 接坏结果（否则），“有时间吃早饭”是好事",
    "错：but 表转折，这里没有转折",
    "错：so 不用于祈使句这个形状"
  ]
},

/* ==================== 2026-08-16 补：范围收窄后池子太薄的几课 ====================
 * 课后练习按「已上过课的知识框架」收窄之后（core.js lessonQuestions），
 * 有三节课自带的同框架题不够连对 4 题用：
 *   P4L1 虚拟入门(If I were you / wish)、P5L1 否定倒装、P5L2 强调句。
 * 这里按框架补齐，全部 A2 词汇、一题只考一个套路。
 * 新题一律带 zh 字段（整句中文）—— 答错时的「答案对照图」要用它。 */

{
  id: "br-sj-07", level: 2, bridge: true, module: "grammar", topic: "subjunctive",
  stem: "If I ____ rich, I would buy a big house.",
  options: ["am", "were", "will be", "have been"],
  answer: 1,
  zh: "如果我有钱，我就买一套大房子。（其实没钱）",
  explanation: "套路：说的是“跟现在的事实相反”（我现在并不有钱），If 后面用过去式，be 动词一律用 were —— 连 I 也是 were。主句配 would + 动词原形（would buy）。",
  optionNotes: [
    "错：am 是陈述事实的说法，这句说的是不可能的假设",
    "对：与现在相反，be 一律用 were",
    "错：虚拟条件句里绝对不能出现 will",
    "错：have been 是完成时，跟这个公式不搭"
  ]
},
{
  id: "br-sj-08", level: 2, bridge: true, module: "grammar", topic: "subjunctive",
  stem: "If she ____ here, she would help us.",
  options: ["is", "was", "were", "will be"],
  answer: 2,
  zh: "如果她在这儿，她会帮我们的。（她其实不在）",
  explanation: "套路：跟现在相反的假设 → If + 过去式，be 用 were。主句 would help 已经把公式的另一半写出来了，看到 would 就知道从句该填 were。",
  optionNotes: [
    "错：is 是在陈述事实",
    "错：口语里有人说 was，但考试认 were",
    "对：虚拟语气里 be 一律用 were",
    "错：if 从句里不能有 will"
  ]
},
{
  id: "br-sj-09", level: 2, bridge: true, module: "grammar", topic: "subjunctive",
  stem: "I wish I ____ speak English well.",
  options: ["can", "could", "will", "am able"],
  answer: 1,
  zh: "但愿我能把英语说好。（现在还说不好）",
  explanation: "套路：wish（但愿）后面的话都是“事实上做不到”的，时态要往回退一格 —— can 退成 could，am 退成 were，do 退成 did。",
  optionNotes: [
    "错：can 是现在时，wish 后面要退一格",
    "对：wish + could，退一格",
    "错：will 是将来时，方向反了",
    "错：am able 没退格，而且形式不对"
  ]
},
{
  id: "br-iv-07", level: 2, bridge: true, module: "grammar", topic: "inversion",
  stem: "Seldom ____ his homework on time.",
  options: ["he finishes", "does he finish", "he does finish", "finishes he"],
  answer: 1,
  zh: "他很少按时完成作业。",
  explanation: "套路：Seldom（很少）是否定词，放句首要部分倒装。句子里本来没有助动词（finishes 是实义动词），所以补一个 does，然后是主语 he，最后动词回原形 finish。",
  optionNotes: [
    "错：这是正常语序，Seldom 开头必须倒装",
    "对：补助动词 does + 主语 he + 动词原形 finish",
    "错：语序没倒，does 在主语后面不算倒装",
    "错：实义动词不能直接提到主语前面"
  ]
},
{
  id: "br-iv-08", level: 2, bridge: true, module: "grammar", topic: "inversion",
  stem: "Hardly ____ the room when the phone rang.",
  options: ["I had entered", "had I entered", "I entered", "did I entered"],
  answer: 1,
  zh: "我刚进屋，电话就响了。",
  explanation: "套路：Hardly（几乎不）也是否定词，句首要倒装。句子里现成有助动词 had，直接把 had 提到主语 I 前面就行，不用再补 did。",
  optionNotes: [
    "错：正常语序，Hardly 开头必须倒装",
    "对：现成的助动词 had 提到主语前面",
    "错：既没倒装也丢了 had",
    "错：已经有 had 了就不该再补 did，而且 did 后面要接原形"
  ]
},
{
  id: "br-iv-09", level: 2, bridge: true, module: "grammar", topic: "inversion",
  stem: "Only in this way ____ learn English well.",
  options: ["you can", "can you", "you could", "could you have"],
  answer: 1,
  zh: "只有用这种方法你才能学好英语。",
  explanation: "套路：Only + 状语（in this way 是“用这种方法”，是状语）放句首要倒装。句子里有情态动词 can，把 can 提到主语 you 前面。注意：如果是 Only you（only 后面直接跟主语），就【不】倒装。",
  optionNotes: [
    "错：正常语序，Only + 状语开头要倒装",
    "对：把 can 提到主语 you 前面",
    "错：语序没倒",
    "错：语序对了但 could have 是“本来能”，跟句意不符"
  ]
},
{
  id: "br-iv-10", level: 2, bridge: true, module: "grammar", topic: "emphasis",
  stem: "____ was yesterday that I met him.",
  options: ["This", "That", "It", "There"],
  answer: 2,
  zh: "我是昨天遇见他的。（强调“昨天”）",
  explanation: "套路：强调句的外壳只有一种写法 —— It is/was + 被强调的部分 + that。验证一下：把 It was 和 that 都删掉，剩下 yesterday I met him，读得通，所以确实是强调句，开头只能填 It。",
  optionNotes: [
    "错：强调句的开头是固定的 It，不能换成 This",
    "错：同上，That 也不行",
    "对：强调句外壳固定是 It is / It was … that …",
    "错：There was 是“有”，跟强调无关"
  ]
},
{
  id: "br-iv-11", level: 2, bridge: true, module: "grammar", topic: "emphasis",
  stem: "It was in the park ____ we played football.",
  options: ["where", "which", "that", "when"],
  answer: 2,
  zh: "我们是在公园里踢的球。（强调“在公园”）",
  explanation: "套路：强调句的后半个壳永远是 that，哪怕被强调的是地点也不用 where、是时间也不用 when。验证：删掉 It was 和 that，剩下 in the park we played football，读得通 → 是强调句。",
  optionNotes: [
    "错：这是强调句不是定语从句，地点也用 that",
    "错：which 用在定语从句里，这里句子不缺成分",
    "对：强调句的后半个壳固定是 that",
    "错：同理，强调时间也用 that 不用 when"
  ]
},
{
  id: "br-iv-12", level: 2, bridge: true, module: "grammar", topic: "emphasis",
  stem: "It is my sister ____ helps me with my English.",
  options: ["who", "which", "what", "where"],
  answer: 0,
  zh: "是我姐姐在帮我学英语。（强调“我姐姐”）",
  explanation: "套路：强调句的后半个壳一般用 that，但被强调的是【人】的时候也可以用 who。这题被强调的是 my sister（人），所以 who 和 that 都对，选项里只给了 who。",
  optionNotes: [
    "对：强调人时可以用 who（也可以用 that）",
    "错：which 只用于物，而且强调句不这么用",
    "错：what 不能出现在强调句的壳里",
    "错：where 是地点，这里强调的是人"
  ]
},

]);
