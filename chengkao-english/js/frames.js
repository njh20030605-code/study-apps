/* ============================================================================
 * frames.js —— 知识框架层（2026-08-16 用户要求）
 * ----------------------------------------------------------------------------
 * 用户原话：「把题目加上一些标签，哪些该背，哪些该理解。题目的难度也加上标识。
 *            以及对应的知识框架对应什么。」
 *            「错题的解析全部加强，最好用可视化、或者简单的方式让我理解。」
 *
 * 一个「框架」= 一个可以画成公式的最小套路。它同时干三件事：
 *   ① 标签：每道题显示 该背 / 该理解 + 难度 + 属于哪个框架
 *   ② 画图：答错时把这个框架的公式画成色块（每块下面标中文角色）
 *   ③ 修 bug：课后练习只出「已经上过课的框架」的题——微课没教过的
 *      结构（比如 Not only 倒装）不会再混进第 15 课的课后练习里
 *
 * 字段
 *   id       唯一
 *   point    1-7 = 策略里的 7 大考点；0 = 不在 7 考点内但真题在考（要另开课）
 *   chapter  显示用的知识区名（point 为 0 时靠它归类）
 *   name     框架名，≤10 字，显示在标签上
 *   mode     "背" | "理解" | "背+理解" —— 用户要的「哪些该背哪些该理解」
 *   modeWhy  一句话说明为什么这么归类（点标签能看到）
 *   formula  公式色块 [[英文, 中文角色, 类型], ...]
 *            类型："k"=触发词(橙) / "hl"=空格填这里(高亮) / ""=普通
 *   steps    考场上的判断步骤，2-3 条，从「眼睛看到什么」出发
 *   mnemonic 口诀（一句话，能默出来的那种）
 *   trap     最容易错的地方
 *   lesson   哪节微课教它；null = 目前一节课都没教（课后练习不出这类题）
 *   match    (q) => bool，题 → 框架。前面的先匹配，所以特殊的排前面。
 *
 * 维护规矩
 *   · 新增题目 topic 落进 core.js 的 POINT_TOPICS 才会被算进考点；
 *     落不进框架的题会走 point 的兜底框架，标签仍在，只是没有公式图。
 *   · 中文引号一律全角“”，别在 ASCII 双引号里写 " 当中文引号。
 *   · 改完跑 `node --check js/frames.js` 和 scratchpad 里的框架覆盖体检。
 * ========================================================================== */

/* 学法三档的说明文案（标签点开时显示） */
window.FRAME_MODES = {
  "背":     { icon: "🧠", tip: "这类没道理可讲，就是英语的规矩。背下形状，考场上认形状直接选。" },
  "理解":   { icon: "💡", tip: "这类要看懂句子在说什么才能选对，背不了。慢慢想清楚一次，以后都对。" },
  "背+理解": { icon: "🧠💡", tip: "公式要背下来，但用哪个公式得看懂句子。先背形状，再练判断。" },
};

/* 匹配用的小工具 ——————————————————————————————————————————————
   ⚠️ 这类填空题的考点词，多半在【选项】里而不是题干里。
      例：「____ Tom ____ Jack like sports」——both…and 只出现在选项，
      题干里一个连词都没有。所以匹配一律「题干 + 正确答案」一起看，
      否则整批题会挂到别的框架上去（2026-08-25 用户报：both…and 的题
      底下画的是 although 不配 but 的图）。 */
function FR_ANS(q) { const o = (q.options || [])[q.answer]; return String(o === undefined ? "" : o); }
function FR_TXT(q) { return q.stem + " " + FR_ANS(q); }
function FR_OPTS(q) { return (q.options || []).join(" "); }

window.FRAMES = [

/* ==================================================================
 * 考点 1 非谓语动词
 * ================================================================== */
{
  id: "nf-prepdoing", point: 1, name: "介词后面 + doing", mode: "背",
  modeWhy: "介词后面只能站名词，动词得穿上 -ing 才算名词。没道理可讲，认形状。",
  formula: [["good at", "介词 at 收尾", "k"], ["singing", "动词加 ing", "hl"]],
  steps: ["看空格【前面】最后那个词是不是介词（at / in / of / on / about / by / without / after / before）", "是介词 → 空里填 doing", "look forward to 的 to 也是介词，所以是 to hearing，不是 to hear"],
  mnemonic: "介词后面站 doing",
  trap: "want to do 的 to 是不定式不是介词；be used to doing（习惯于）和 used to do（过去常常）别混。",
  lesson: "P1L1",
  match: (q) => /\b(at|in|of|on|about|by|without|after|before|to|from|for)\s+_+/i.test(q.stem) && /ing\b/i.test(FR_ANS(q)),
},
{
  id: "nf-adj", point: 1, name: "-ing 令人 / -ed 感到", mode: "理解",
  modeWhy: "两个形状都简单，难的是判断这个空说的是「东西令人怎样」还是「人感到怎样」。",
  formula: [["The film was", "主语是【物】", "k"], ["moving", "令人…（-ing）", "hl"], ["we were", "主语是【人】", "k"], ["moved", "感到…（-ed）", "hl"]],
  steps: ["看这个空修饰的是【物】还是【人】", "物令人怎么样 → -ing（an interesting book / the film is moving）", "人感到怎么样 → -ed（I am interested / we were moved）"],
  mnemonic: "物 -ing 令人，人 -ed 感到",
  trap: "别看到人就填 -ed：He is an interesting man 说的是「他这个人很有趣」，用 -ing。",
  lesson: null,
  match: (q) => /\b(moving|moved|interesting|interested|exciting|excited|boring|bored|surprising|surprised|tiring|tired|amazing|amazed|pleasing|pleased|disappointing|disappointed|frightening|frightened|confusing|confused|relaxing|relaxed)\b/i.test(FR_ANS(q)),
},
{
  id: "nf-doing", point: 1, name: "enjoy 类 + doing", mode: "背",
  modeWhy: "哪些动词后面接 doing 完全没道理，是英语的习惯。列表背下来就行。",
  formula: [["enjoy / finish / practice", "这几个词", "k"], ["+", "", ""], ["doing", "动词加 ing", "hl"]],
  steps: ["看空格【前面】那个词", "是 enjoy / finish / practice / keep / mind / avoid / suggest / give up / look forward to → 填 doing", "不用管句子意思"],
  mnemonic: "享受、完成、练习、坚持 —— 都接 doing",
  trap: "want / decide / hope 是另一伙，接 to do。两组别记混。",
  lesson: "P1L1",
  match: (q) => /\b(enjoy|enjoys|enjoyed|finish|finished|practice|practise|keep|keeps|mind|avoid|avoided|suggest|suggested|consider|give up|gave up|look(ing)? forward to|worth|busy|like|likes|liked|love|loves|hate|hates|need|needs|needed)\b/i.test(q.stem) && /ing\b/i.test(FR_ANS(q)),
},
{
  id: "nf-todo", point: 1, name: "want 类 + to do", mode: "背",
  modeWhy: "同样是固定搭配，只不过这一组接 to do。背这一组词就够。",
  formula: [["want / decide / hope", "这几个词", "k"], ["+", "", ""], ["to do", "to + 动词原形", "hl"]],
  steps: ["看空格【前面】那个词", "是 want / decide / hope / plan / refuse / promise / would like / manage / afford → 填 to do", "口诀：还没做的事，用 to do"],
  mnemonic: "想做、决定做、希望做 —— 事儿还没发生，用 to do",
  trap: "want 后面绝不接 doing；told sb. not to do 的 not 放在 to 前面。",
  lesson: "P1L2",
  match: (q) => /\b(want|wants|wanted|decide|decided|hope|hopes|plan|planned|refuse|refused|promise|promised|would like|manage|managed|afford|happen|pretend|told|asked|allow|allowed)\b/i.test(q.stem),
},
{
  id: "nf-stop", point: 1, name: "stop 两兄弟", mode: "背+理解",
  modeWhy: "两个形状都要背，但选哪个得看后半句在说什么。",
  formula: [["stop to do", "停下手里的事，去做另一件", "k"], ["stop doing", "把这件事本身停掉", "k"]],
  steps: ["看后半句给的原因/情景", "「别吵了」→ stop talking（停掉说话）", "「累了停下来歇会儿」→ stopped to have a rest（停下来去歇）"],
  mnemonic: "to do 是去做新的，doing 是停掉旧的",
  trap: "remember / forget 同理：to do = 还没做，doing = 已经做过。",
  lesson: "P1L3",
  match: (q) => /\b(stop|stopped|remember|remembered|forget|forgot|forgotten|try|tried|regret)\b/i.test(q.stem),
},
{
  id: "nf-tooto", point: 1, name: "too … to …", mode: "背",
  modeWhy: "固定框架，填进去就对，不用分析。",
  formula: [["too", "太", "k"], ["young", "形容词", ""], ["to", "以至于不能", "k"], ["drive", "动词原形", "hl"]],
  steps: ["看到 too … to … 的架子", "中间填形容词，to 后面填动词原形", "意思是「太…以至于不能…」，本身就是否定"],
  mnemonic: "too … to … = 太…了，做不了",
  trap: "too…to 已经含「不能」，别再加 not。",
  lesson: null,
  match: (q) => q.topic === "too-to" || /\btoo\b[^.]*\bto\b/i.test(q.stem),
},
{
  id: "nf-make", point: 1, name: "使役 / 感官动词 + 原形", mode: "背",
  modeWhy: "make / let / hear / see 后面接【不带 to 的原形】，是一条死规矩。",
  formula: [["I heard her", "感官动词 + 人", "k"], ["sing", "动词原形，不加 to", "hl"], ["an English song", "", ""]],
  steps: ["空格前面是 make / let / have / hear / see / watch / feel + 某人", "→ 空里填【动词原形】，别加 to", "但 have sth done（让某物被做）要用过去分词：have your hair cut"],
  mnemonic: "一使二让三感觉，后面原形不带 to",
  trap: "变成被动句时 to 要还回来：She was heard to sing.",
  lesson: null,
  match: (q) => /\b(make|makes|made|let|lets|hear|heard|see|saw|watch|watched|feel|felt|have your|had (his|her|my|your))\b/i.test(q.stem),
},
{
  id: "nf-attr", point: 1, name: "分词当后置定语", mode: "理解",
  modeWhy: "要看出这个分词是在【修饰前面那个名词】，不是句子的谓语。",
  formula: [["the strongest hurricanes", "被修饰的名词", "k"], ["recorded", "有记载的（被…的）", "hl"], ["was …", "真正的谓语", ""]],
  steps: ["空格前面是名词，空格后面还有一个真动词（was / is / came…）", "说明这个空不是谓语，是在修饰前面那个名词", "名词【被】这样对待 → done；名词自己在做 → doing"],
  mnemonic: "名词后面挂分词 = 一个短定语，等于省了 which is",
  trap: "the man standing there = the man who is standing there；别把 standing 当谓语，句子后面还有真动词。",
  lesson: null,
  match: (q) => /^[a-z]+(ed|en)$/i.test(FR_ANS(q).trim()) && /\w+s?\s+_+\s+(was|were|is|are)\b/i.test(q.stem),
},
{
  id: "nf-part", point: 1, name: "分词作状语", mode: "理解",
  modeWhy: "要判断句首那个动作是「他主动做」还是「它被做」，得读懂关系。",
  formula: [["Seen from the hill,", "被看 → 用 done", "hl"], ["the city", "真正的主语", "k"], ["looks beautiful.", "", ""]],
  steps: ["看逗号后面那个主语是谁", "主语【主动】做这个动作 → doing（Walking along…, I found…）", "主语【被】这样对待 → done（Seen from…, the city looks…）"],
  mnemonic: "他自己做 = doing，他被做 = done",
  trap: "Seen from the hill 的主语是 city（城市被看），不是人。",
  lesson: null,
  match: (q) => {
    const a = String((q.options || [])[q.answer] || "");
    if (/^while\s+_+|^with\s+\w+\s+_+/i.test(q.stem.trim())) return true;
    if (/\w+ing\s*[;；]\s*\w+ed\b/i.test(a)) return false;         // moving; moved 这类归 nf-adj（-ing 令人 / -ed 感到）
    return /^_+[^,]*,\s/.test(q.stem.trim()) && /\w+(ing|ed|en)\b/.test(a) && !/^to\s/i.test(a);
  },
},
{
  id: "nf-purpose", point: 1, name: "to do 表目的 / 用途", mode: "理解",
  modeWhy: "看出「为了……」「用来……」这层意思就会选，属于读懂句子。",
  formula: [["He went to the shop", "句子已有真动词", ""], ["to buy some bread", "为了…（目的）", "hl"]],
  steps: ["句子里已经有一个真动词（went / have / am happy…）", "空里这个动作是「为了什么 / 用来干什么」→ 用 to do", "放句首也行：To pass the exam, he studied hard."],
  mnemonic: "为了做某事 = to do，放句首放句尾都行",
  trap: "一个句子只能有一个真动词，第二个动作必须变形。",
  lesson: "P1L2",
  match: (q) => /^to\s+\w+/i.test(String((q.options || [])[q.answer] || "")),
},
{
  id: "nf-subject", point: 1, name: "动作当主语", mode: "理解",
  modeWhy: "要看出这个空是句子的主语（后面跟着 is/was），不是背来的。",
  formula: [["Swimming", "动作变 -ing 当主语", "hl"], ["is", "谓语用单数", "k"], ["dangerous", "", ""]],
  steps: ["看空格后面是不是紧跟 is / was", "是 → 这个空是主语，动词要变 -ing（或 To do）", "主语是动作时，谓语一律用单数 is"],
  mnemonic: "句首动作 + is，动作要穿 -ing 的衣服",
  trap: "Swimming is… 不是 Swim is…；谓语别用 are。",
  lesson: "P1L3",
  match: (q) => /^_+\s+(is|was|are|were)\b/i.test(q.stem.trim()) || /\b(is|was)\s+(good|dangerous|important|bad)\b/i.test(q.stem),
},

/* ==================================================================
 * 考点 2 定语从句
 * ================================================================== */
{
  id: "rc-whose", point: 2, name: "whose = 谁的", mode: "背",
  modeWhy: "只要空后面紧跟一个名词、意思是「他的/它的」，就是 whose。认形状。",
  formula: [["The boy", "先行词（人）", "k"], ["whose", "谁的", "hl"], ["father", "紧跟一个名词", "k"], ["is a doctor", "", ""]],
  steps: ["看空格【后面】紧跟的是不是光秃秃一个名词（father / cover / car）", "是，而且意思是「他的那个 X」→ 填 whose", "人和物都能用 whose"],
  mnemonic: "空后面直接跟名词 = whose",
  trap: "别看见人就填 who —— who 后面跟的是动词，whose 后面跟的是名词。",
  lesson: "P2L2",
  match: (q) => (q.options || []).some((o) => /^whose$/i.test(String(o).trim())) && q.answer !== undefined && /^whose$/i.test(String(q.options[q.answer]).trim()),
},
{
  id: "rc-wherewhen", point: 2, name: "从句不缺东西 → where/when", mode: "理解",
  modeWhy: "得把从句拆出来看它缺不缺主语宾语，这一步没法背。",
  formula: [["This is the school", "先行词是地点", "k"], ["where", "从句不缺主语宾语", "hl"], ["I study", "完整的句子", ""]],
  steps: ["把空格后面的部分单独拎出来读：I study —— 完整吗？", "完整（不缺主语也不缺宾语）→ 地点用 where，时间用 when", "缺东西 → 回去用 that / which / who"],
  mnemonic: "后面读着不缺东西，才轮到 where / when",
  trap: "「介词 + which」等于 where/when：the house in which we live = where we live。",
  lesson: "P2L3",
  match: (q) => /^(where|when|why)$/i.test(FR_ANS(q).trim()),
},
{
  id: "rc-prep", point: 2, name: "介词 + which / whom", mode: "理解",
  modeWhy: "要看清句子里那个介词（in / for / with）有没有落单，属于读句子。",
  formula: [["The house", "先行词", "k"], ["which", "", "hl"], ["we live", "", ""], ["in", "介词落在句尾", "k"]],
  steps: ["找句子里有没有孤零零的介词（in / for / with / about）", "介词在句尾 → 空里填 which / that（人用 who / that）", "介词提到空格前 → 只能 in which / for whom，不能用 that"],
  mnemonic: "介词跟着跑，which 陪它走",
  trap: "in that 不成立；介词提前后不能用 that，也不能用 who（要 whom）。",
  lesson: "P2L3",
  match: (q) => /\b(in|on|at|for|with|about|to)\s*[.?]?\s*$/i.test(q.stem.replace(/\s+/g, " ").trim()) || /\b(in|for|with|about)\s+which\b/i.test((q.options || []).join(" ")),
},
{
  id: "rc-whothat", point: 2, name: "who / which / that", mode: "理解",
  modeWhy: "先行词是人还是物、从句缺什么，两步都要读句子。",
  formula: [["The man", "先行词：人", "k"], ["who", "从句缺主语", "hl"], ["is talking to Tom", "缺主语的半句", ""], ["is my father", "", ""]],
  steps: ["先看先行词是【人】还是【物】", "再把从句拎出来读，看缺主语还是缺宾语", "人 → who / that；物 → which / that；缺宾语时可以整个省掉"],
  mnemonic: "先看人还是物，再看缺什么",
  trap: "先行词被 all / only / 最高级 / 序数词修饰时，只能用 that。",
  lesson: "P2L1",
  match: (q) => q.topic === "relative-clause",
},

/* ==================================================================
 * 考点 3 时态
 * ================================================================== */
{
  id: "ts-usedto", point: 3, name: "used to 三兄弟", mode: "背",
  modeWhy: "三个长得像但意思完全不同，必须背清楚。",
  formula: [["used to do", "过去常常做（现在不做了）", "k"], ["be used to doing", "习惯于做", "k"], ["be used to do", "被用来做", "k"]],
  steps: ["看 used 前面有没有 be 动词（is / was / am）", "没有 be → used to do：过去常常", "有 be + to doing → 习惯于；有 be + to do → 被用来"],
  mnemonic: "没 be 是「过去常常」，有 be 才是「习惯」",
  trap: "be used to 后面接 doing 不是 do。",
  lesson: null,
  match: (q) => q.topic === "used-to" || /\b(used to|used to be)\b/i.test(FR_TXT(q)),
},
{
  id: "ts-futperf", point: 3, name: "将来完成 will have done", mode: "背",
  modeWhy: "认 By + 将来时间 这个标志就能选，纯形状。",
  formula: [["By my 50th birthday,", "到将来某个时间点", "k"], ["I will have been", "will have + 过去分词", "hl"], ["in this job for 20 years", "", ""]],
  steps: ["看时间状语：By + 将来的时间（by next year / by my 50th birthday）", "→ 用 will have done（到那时就已经…了）", "By + 过去的时间（by the end of last year）→ 用 had done，别混"],
  mnemonic: "by 将来 → will have done；by 过去 → had done",
  trap: "光看到 by 就填 had done 是最常见的错，先看 by 后面是过去还是将来。",
  lesson: null,
  match: (q) => /\bwill have\b/i.test(FR_ANS(q)),
},
{
  id: "ts-perfect", point: 3, name: "since/for → 现在完成时", mode: "背",
  modeWhy: "抓标志词就能做对，属于认词不是理解。",
  formula: [["since 2020 / for ten years / already / yet / ever", "看到这些词", "k"], ["→", "", ""], ["have / has + done", "现在完成时", "hl"]],
  steps: ["扫一眼句子里有没有 since / for / already / yet / ever / so far / recently", "有 → 一定是 have/has + 过去分词", "主语是 he/she/it 用 has，其余用 have"],
  mnemonic: "since、for、already —— 见了就写 have done",
  trap: "since 后面那半句用过去式（since I left），主句才用完成时，两个时态不一样是正常的。",
  lesson: "P3L1",
  match: (q) => q.topic !== "have-has" && (
       /\b(have|has|haven't|hasn't)\b\s*\S/i.test(FR_ANS(q))
    || (/^(since|for)$/i.test(FR_ANS(q).trim()) && /(\b(have|has)\b|'ve\b|'s\b)/i.test(q.stem))
    || (/\b(since|already|yet|ever|so far|up to now|recently|just)\b/i.test(q.stem) && /(\b(have|has)\b|'ve\b)/i.test(q.stem))),
},
{
  id: "ts-pastperf", point: 3, name: "过去的过去 → had done", mode: "理解",
  modeWhy: "要理清两件事谁先谁后，是读句子不是认词。",
  formula: [["By the time I arrived,", "过去的时间点", "k"], ["the film", "", ""], ["had begun", "在那之前就发生了", "hl"]],
  steps: ["句子里是不是有两件过去的事", "找那个「更早发生」的 → 用 had + 过去分词", "标志：by the time / before / when 引导的过去事件"],
  mnemonic: "两件旧事，更早那件穿 had done",
  trap: "by the time 从句用过去式，主句才用 had done。",
  lesson: "P3L3",
  match: (q) => /\bhad\b/i.test(FR_ANS(q)) || /\b(by the time|by the end of last|by the end of the)\b/i.test(q.stem),
},
{
  id: "ts-pastcont", point: 3, name: "被打断的动作 → was doing", mode: "理解",
  modeWhy: "要看出「正做着某事时，另一件事插进来」这层关系。",
  formula: [["I", "", ""], ["was watching TV", "正做着的事（背景）", "hl"], ["when the phone rang", "突然插进来的事", "k"]],
  steps: ["看有没有 when / while 把两件事连起来", "「一直在做」的那件 → was/were + doing", "「突然发生」的那件 → 过去式（rang / came）"],
  mnemonic: "长的那件穿 was doing，短的那件用过去式",
  trap: "while 后面一般接长动作，when 后面一般接短动作。",
  lesson: "P3L3",
  match: (q) => /\b(was|were)\b/i.test(FR_ANS(q)) && /ing\b/i.test(FR_ANS(q)),
},
{
  id: "ts-pcont", point: 3, name: "Look! / now → 正在进行", mode: "背",
  modeWhy: "Look! Listen! now 就是信号弹，认信号即可。",
  formula: [["Look! / Listen! / now", "信号词", "k"], ["→", "", ""], ["am / is / are + doing", "现在进行时", "hl"]],
  steps: ["句首有 Look! / Listen! 或句中有 now / at the moment", "→ 填 am/is/are + doing", "主语单数用 is，复数用 are，I 用 am"],
  mnemonic: "Look! Listen! now —— 三个词，一个答案：is doing",
  trap: "别漏了 be 动词，只写 doing 是错的。",
  lesson: "P3L2",
  match: (q) => !/going to/i.test(FR_ANS(q)) && (
       (/\b(am|is|are)\b/i.test(FR_ANS(q)) && /ing\b/i.test(FR_ANS(q)))
    || /\blook\s*!|\blisten\s*!|\bnow\b|\bat the moment\b|\bat present\b/i.test(q.stem)),
},
{
  id: "ts-pastsimple", point: 3, name: "ago / last → 过去式", mode: "背",
  modeWhy: "时间词直接决定答案，认词就行。",
  formula: [["two days ago / last week / yesterday", "过去时间词", "k"], ["→", "", ""], ["went / did / was", "动词过去式", "hl"]],
  steps: ["找 ago / last … / yesterday / in 1990 / just now", "有 → 用过去式，别用完成时", "不规则动词的过去式要单独记（go→went, break→broke）"],
  mnemonic: "ago、last、yesterday —— 一律过去式",
  trap: "ago 和 since 不共存：ago 配过去式，since 配完成时。",
  lesson: "P3L2",
  match: (q) => /\b(ago|last (night|week|month|year|monday)|yesterday|just now|in (18|19|20)\d\d)\b/i.test(q.stem),
},
{
  id: "ts-will", point: 3, name: "tomorrow → will do", mode: "背",
  modeWhy: "将来时间词一出现，答案就定了。",
  formula: [["tomorrow / next week", "将来时间词", "k"], ["→", "", ""], ["will + 动词原形", "", "hl"], ["黑云压顶", "眼前有迹象", "k"], ["be going to", "打算 / 就要", "hl"]],
  steps: ["找 tomorrow / next … / in the future / soon", "→ will + 动词原形（will 后面永远是原形）", "眼前有迹象、早就打算好的 → be going to（Look at those black clouds! It is going to rain）"],
  mnemonic: "明天下周用 will；看得见的苗头用 be going to",
  trap: "will 后面不能加 s 也不能加 to；be going to 是将来，不是正在进行。",
  lesson: null,
  match: (q) => /\b(will|going to)\b/i.test(FR_ANS(q))
    || /\b(tomorrow|next (week|month|year|monday)|in the future|soon)\b/i.test(q.stem),
},
{
  id: "ts-basic", point: 3, name: "一般现在时 / 三单", mode: "理解",
  modeWhy: "要看主语是谁、动作是不是习惯性的，属于基本功。",
  formula: [["He", "第三人称单数", "k"], ["goes", "动词加 s", "hl"], ["to work every day", "习惯性动作", "k"]],
  steps: ["动作是不是「天天、经常」发生（every day / usually / always）", "是 → 一般现在时", "主语是 he/she/it → 动词加 s；否定用 doesn't + 原形"],
  mnemonic: "他她它，动词加 s；doesn't 后面回原形",
  trap: "doesn't / does 后面动词必须回原形（doesn't eat，不是 doesn't eats）。",
  lesson: null,
  match: (q) => q.topic === "present-simple" || q.topic === "have-has" || q.topic === "be-verb",
},

/* ==================================================================
 * 考点 4 虚拟语气
 * ================================================================== */
{
  id: "sj-rather", point: 4, name: "would rather / high time", mode: "背",
  modeWhy: "两个句型都是死形状：后面跟从句就退一格用过去式，跟动词就用原形。",
  formula: [["I'd rather you", "would rather + 从句", "k"], ["didn't do", "从句用过去式", "hl"], ["It's high time we", "该……了", "k"], ["went home", "过去式", "hl"]],
  steps: ["would rather / It's high time 后面跟的是【一个从句】（有自己的主语）→ 从句用过去式", "would rather 后面直接跟动词 → 用原形，而且配 than：would rather stay than go", "It's high time 也可以写成 It's high time we should go（较少考）"],
  mnemonic: "后面带主语就退一格，直接跟动词就用原形",
  trap: "would rather do A than do B 里 than 后面也是原形，不加 to。",
  lesson: null,
  match: (q) => /\b(would rather|'d rather|high time)\b/i.test(q.stem),
},
{
  id: "sj-suggest", point: 4, name: "suggest + (should) 原形", mode: "背",
  modeWhy: "一串词后面全接动词原形，没有道理，背词表。",
  formula: [["suggest / demand / require / advise", "这些词", "k"], ["that + 主语 +", "", ""], ["动词原形", "should 被省掉了", "hl"]],
  steps: ["看 that 前面那个动词是不是 suggest / demand / insist / require / order / advise / recommend / propose", "是 → that 后面无论主语是谁，动词都用【原形】", "被动就用 be + 过去分词（be handed in）"],
  mnemonic: "建议、要求、命令 —— 后面一律用原形",
  trap: "第三人称也不加 s（he stay，不是 he stays）；It is necessary / important that … 同理。",
  lesson: "P4L3",
  match: (q) => /\b(suggest|suggests|suggested|demand|demands|demanded|require|requires|required|insist|insists|insisted|advise|advises|advised|recommend|recommends|recommended|order|orders|ordered|propose|proposes|proposed|request|requests|requested|urge|urges|urged)\b/i.test(q.stem)
    || /\bit is (important|necessary|essential|vital|natural|strange)\b/i.test(q.stem),
},
{
  id: "sj-past", point: 4, name: "与过去相反", mode: "背",
  modeWhy: "整套公式必须背下来，考场上照抄形状。",
  formula: [["If + had done", "从句：had + 过去分词", "k"], [",", "", ""], ["would have done", "主句：would have + 过去分词", "hl"]],
  steps: ["找 If 从句里有没有 had done（或空在主句）", "有 had done → 主句一定是 would/could have done", "反过来也成立：主句是 would have done，从句就填 had done"],
  mnemonic: "从句 had done，主句 would have done —— 一对儿，见一个补一个",
  trap: "But for / Without 开头也是这个公式：Without your help, I couldn't have finished it.",
  lesson: "P4L2",
  match: (q) => /\bhad (not )?(been|come|studied|worked|planned|done|stayed)\b/i.test(q.stem) || /\bwould(n.t)?\s+(\w+\s+)?have\b/i.test(q.stem + " " + String((q.options || [])[q.answer] || "")) || /\b(but for|without)\b/i.test(q.stem),
},
{
  id: "sj-wish", point: 4, name: "wish / if only", mode: "背",
  modeWhy: "wish 后面时态往回退一格，是死规矩。",
  formula: [["I wish", "但愿…（其实不是）", "k"], ["I", "", ""], ["were taller", "退一格：用过去式，be 一律 were", "hl"]],
  steps: ["看到 wish / if only / would rather", "对现在遗憾 → 用过去式（were / knew / could）", "对过去遗憾 → 用 had done"],
  mnemonic: "wish 后面永远退一格，be 一律用 were",
  trap: "I wish I were，不是 I wish I was（考试认 were）。",
  lesson: "P4L1",
  match: (q) => /\b(wish|wishes|wished|if only)\b/i.test(q.stem),
},
{
  id: "sj-asif", point: 4, name: "as if 好像", mode: "背",
  modeWhy: "as if 后面也退一格，同一套规矩。",
  formula: [["He talks as if", "好像…（其实不是）", "k"], ["he had been there", "退一格", "hl"]],
  steps: ["看到 as if / as though", "说的是「好像以前怎样」→ had done", "说的是「好像现在怎样」→ 过去式（were）"],
  mnemonic: "as if 也退一格，跟 wish 一伙",
  trap: "如果说的是真事（他确实去过），就不退格，用正常时态。",
  lesson: null,
  match: (q) => /\bas if\b|\bas though\b/i.test(q.stem),
},
{
  id: "sj-now", point: 4, name: "与现在相反", mode: "背",
  modeWhy: "公式固定，认 If + 过去式就写 would do。",
  formula: [["If I were you", "从句：过去式，be 用 were", "k"], [",", "", ""], ["I would say sorry", "主句：would + 原形", "hl"]],
  steps: ["If 从句里是过去式（were / had / knew）", "→ 主句一定是 would / could / might + 动词原形", "反过来：主句 would do，从句就填过去式"],
  mnemonic: "从句过去式，主句 would do",
  trap: "be 动词在虚拟里一律用 were，连 I 也是 were。",
  lesson: "P4L1",
  match: (q) => /\bif\b/i.test(q.stem) && /\bwould\b/i.test(q.stem + (q.options || []).join(" ")),
},
{
  id: "sj-real", point: 4, name: "主将从现（真条件）", mode: "理解",
  modeWhy: "关键是判断出「这事真可能发生」，不是虚拟——这一步靠读句子。",
  formula: [["If it rains tomorrow", "从句：用现在时", "k"], [",", "", ""], ["we will stay at home", "主句：will + 原形", "hl"]],
  steps: ["这事将来真有可能发生吗？（明天下雨——真可能）", "真可能 → 从句用一般现在时，主句用 will", "不可能 / 与事实相反 → 才走虚拟公式"],
  mnemonic: "主句将来时，从句用现在 —— 「主将从现」",
  trap: "从句里绝不能写 will（If it will rain 是错的）。",
  lesson: "P4L2",
  match: (q) => q.topic === "conditional" || (/\bif\b/i.test(q.stem) && /\bwill\b/i.test(q.stem)),
},

/* ==================================================================
 * 考点 5 倒装与强调
 * ================================================================== */
{
  id: "iv-so", point: 5, name: "So do I（我也是）", mode: "背",
  modeWhy: "固定应答句，形状背下来，考场上直接选。",
  formula: [["So", "也", "k"], ["do", "助动词跟着对方那句走", "hl"], ["I", "主语放最后", ""]],
  steps: ["对方说的是肯定句 → So + 助动词 + 主语（So do I / So am I）", "对方说的是否定句 → Neither / Nor + 助动词 + 主语", "助动词跟着对方那句话：I like → do；I am → am；I have → have"],
  mnemonic: "我也是 = So + 助动词 + 我；我也不 = Neither + 助动词 + 我",
  trap: "So I do 语序没倒，意思是「我确实如此」，不是「我也是」。",
  lesson: "P5L3",
  match: (q) => /^\s*[—-]/.test(q.stem) && (q.options || []).some((o) => /^(so|neither|nor)\s+\w+/i.test(String(o).trim())),
},
{
  id: "iv-here", point: 5, name: "Here comes …", mode: "背",
  modeWhy: "整句当口语背下来，不用分析。",
  formula: [["Here / There", "句首", "k"], ["comes", "动词跑到前面", "hl"], ["the bus", "主语在最后", ""]],
  steps: ["句首是 Here / There", "主语是名词（the bus）→ 动词提到主语前面：Here comes the bus!", "主语是代词（it / he）→ 不倒装：Here it comes!"],
  mnemonic: "Here comes the bus —— 整句背下来",
  trap: "主语换成代词就不倒装了。",
  lesson: "P5L3",
  match: (q) => /^\s*(here|there)\b/i.test(q.stem) && !/there (is|are|was|were|be)\b/i.test(q.stem),
},
{
  id: "iv-notonly", point: 5, name: "Not only 开头倒装", mode: "背",
  modeWhy: "形状固定：前半句倒装，后半句不倒装。背这个不对称。",
  formula: [["Not only", "句首否定词", "k"], ["did he", "前半句倒装", "hl"], ["trouble us,", "", ""], ["but he also laughed", "后半句【不】倒装", "k"]],
  steps: ["句首是 Not only", "前半句倒装：助动词 + 主语（did he / has he）", "but also 那半句保持正常语序，别跟着倒"],
  mnemonic: "Not only 倒前不倒后",
  trap: "只有句首的 Not only 才倒装；放在句中（He not only…）不倒装。",
  lesson: "P5L1",
  match: (q) => /\bnot only\b/i.test(q.stem) && /^\s*not only/i.test(q.stem.trim()),
},
{
  id: "iv-neg", point: 5, name: "否定词开头 → 部分倒装", mode: "背",
  modeWhy: "认句首那个词就能选，纯认形状。",
  formula: [["Never / Seldom / Only then", "否定词或 only+状语 开头", "k"], ["have / did", "助动词跳到主语前", "hl"], ["I", "主语", ""], ["seen …", "动词保持不变", ""]],
  steps: ["看句首是不是 Never / Seldom / Hardly / Little / No sooner / Only then / Only in this way", "是 → 空里选「助动词 + 主语」这个形状（have I / did he）", "句子里没有现成的助动词，就补 do / does / did"],
  mnemonic: "否定词一到句首，助动词就得跳到主语前面",
  trap: "only + 状语才倒装；only + 主语（Only he knows）不倒装。",
  lesson: "P5L1",
  match: (q) => /^\s*(never|seldom|hardly|rarely|little|no sooner|only|not until|by no means|in no case|at no time)\b/i.test(q.stem.trim()),
},
{
  id: "emp-it", point: 5, name: "It is … that 强调句", mode: "背+理解",
  modeWhy: "外壳要背，但是不是强调句得用「删掉验证法」判断一次。",
  formula: [["It was", "外壳前半", "k"], ["in Beijing", "被强调的部分", "hl"], ["that", "外壳后半（强调人可用 who）", "k"], ["I met her", "剩下的话", ""]],
  steps: ["把 It is/was 和 that 都删掉", "剩下的话还能读通 → 就是强调句，空里填 It / that / who", "读不通 → 不是强调句，别往这上面套"],
  mnemonic: "删掉 It was 和 that，还读得通就是强调句",
  trap: "强调人时 that 和 who 都行；强调时间地点也用 that，不用 when / where。",
  lesson: "P5L2",
  match: (q) => q.topic === "emphasis" || /^\s*(it (is|was)|_+)\s/i.test(q.stem) && /\bthat\b/i.test((q.options || []).join(" ") + q.stem),
},

/* ==================================================================
 * 考点 6 主谓一致
 * ================================================================== */
{
  id: "sv-therebe", point: 6, name: "there be 看最近的", mode: "背",
  modeWhy: "就近原则是死规矩，背下来直接用。",
  formula: [["There", "", ""], ["is", "跟【最近】那个名词走", "hl"], ["a pen", "离得最近的名词", "k"], ["and two books", "后面的不管", ""]],
  steps: ["找 There be 后面【第一个】名词", "第一个是单数 / 不可数 → is / was", "第一个是复数 → are / were"],
  mnemonic: "there be 只看离它最近的那个",
  trap: "milk / water / bread 是不可数，一律当单数用 is。",
  lesson: "P6L2",
  match: (q) => (/\bthere\s+_+/i.test(q.stem) || /^_+\s+there\b/i.test(q.stem.trim()) || /\bthere\b/i.test(FR_ANS(q)))
    && /\b(is|are|was|were)\b/i.test(FR_TXT(q)),
},
{
  id: "sv-number", point: 6, name: "the number / a number", mode: "背",
  modeWhy: "两个只差一个冠词，意思和单复数完全相反，必须背。",
  formula: [["The number of cars", "「…的数量」→ 单数", "k"], ["is", "", "hl"], ["|", "", ""], ["A number of students", "「许多…」→ 复数", "k"], ["are", "", "hl"]],
  steps: ["看是 the number of 还是 a number of", "the number of（数量）→ 谓语单数 is", "a number of（许多）→ 谓语复数 are"],
  mnemonic: "the 是「数量」用单数，a 是「许多」用复数",
  trap: "两个长得几乎一样，考试专坑这个。",
  lesson: "P6L4",
  match: (q) => /\b(the|a) number of\b/i.test(q.stem),
},
{
  id: "sv-near", point: 6, name: "neither…nor 就近", mode: "背",
  modeWhy: "就近原则，认结构直接选。",
  formula: [["Neither he nor", "", "k"], ["I", "离谓语最近的那个", "k"], ["am", "跟 I 走", "hl"], ["to blame", "", ""]],
  steps: ["看到 neither…nor / either…or / not only…but also", "谓语跟【离它最近】的那个主语走", "Neither he nor I am… （跟 I 走，用 am）"],
  mnemonic: "谁离动词近，动词就跟谁",
  trap: "both A and B 是例外 —— 那个一律复数。",
  lesson: "P6L4",
  match: (q) => /\b(neither .* nor|either .* or|not only .* but( also)?)\b/i.test(q.stem),
},
{
  id: "sv-both", point: 6, name: "both A and B → 复数", mode: "背",
  modeWhy: "记住 both 是唯一不讲就近原则的那个。",
  formula: [["Both Tom and Mary", "两个人 = 复数", "k"], ["are", "用复数", "hl"], ["good at English", "", ""]],
  steps: ["看到 both A and B", "→ 谓语一律用复数 are / were / do", "但 bread and butter 这种「一样东西」用单数"],
  mnemonic: "both…and 永远复数，别跟就近原则混",
  trap: "Bread and butter is…（面包夹黄油是一样东西）是例外。",
  lesson: "P6L3",
  match: (q) => /\bboth\b.*\band\b/i.test(q.stem),
},
{
  id: "sv-whole", point: 6, name: "钱/时间当整体", mode: "背",
  modeWhy: "看着是复数其实当一个整体，属于反直觉的死规矩。",
  formula: [["Twenty years", "看着复数", "k"], ["is", "其实是「一段时间」= 单数", "hl"], ["a long time", "", ""]],
  steps: ["主语是钱 / 时间 / 距离 / 重量（two hundred dollars、twenty years）", "→ 当成一个整体，谓语用单数 is / was", "同理：动名词、不定式、从句作主语也一律单数"],
  mnemonic: "钱和时间是一坨，不是一堆 —— 用单数",
  trap: "Two hundred dollars IS a lot of money，别写 are。",
  lesson: "P6L3",
  match: (q) => /\b(bread and butter|fish and chips|ham and eggs)\b/i.test(q.stem)
    || (/\b(hundred|thousand|dollars|years|miles|kilos|minutes|hours)\b/i.test(q.stem) && (q.options || []).some((o) => /^(is|are|was|were)$/i.test(String(o).trim()))),
},
{
  id: "sv-head", point: 6, name: "找真正的主语", mode: "理解",
  modeWhy: "要能看出中间那一串是修饰语不是主语，这一步靠读。",
  formula: [["Everyone", "真正的主语（单数）", "k"], ["in our class", "挂在后面的修饰，不算数", ""], ["works", "跟 everyone 走", "hl"], ["hard", "", ""]],
  steps: ["把 of / in / with 引导的那一串括起来盖住", "剩下最前面那个词才是主语", "everyone / each / one of / every 都当单数"],
  mnemonic: "介词短语一律盖住，剩下的才是主语",
  trap: "Each of the students HAS…（跟 each 走，不跟 students 走）。",
  lesson: "P6L1",
  match: (q) => q.topic === "subject-verb-agreement",
},

/* ==================================================================
 * 考点 7 连词逻辑
 * ================================================================== */
{
  id: "cj-sothat", point: 7, name: "so … that …", mode: "背",
  modeWhy: "so 配形容词、such 配名词，是形状问题，背。",
  formula: [["so", "后面跟形容词/副词", "k"], ["tired", "", ""], ["that", "以至于", "k"], ["he can't walk", "结果", ""]],
  steps: ["看 that 前面那个词是形容词还是名词", "形容词 / 副词 → 用 so（so tired that / so fast that）", "名词 → 用 such（such a nice day that）"],
  mnemonic: "so 配形容词，such 配名词",
  trap: "so + 形容词 + a + 名词 也对（so nice a day），但考试更常考 such a nice day。",
  lesson: "P7L3",
  match: (q) => q.topic === "so-that" || (/\b(so|such)\b/i.test(FR_TXT(q)) && /\bthat\b/i.test(FR_TXT(q))),
},
{
  id: "cj-imper", point: 7, name: "祈使句 + and / or", mode: "背",
  modeWhy: "看后半句是好事还是坏事就能选，形状固定。",
  formula: [["Hurry up,", "祈使句（命令）", "k"], ["or", "否则（坏结果）", "hl"], ["you will be late", "坏事", "k"]],
  steps: ["前半句是命令（Hurry up / Get up early），逗号后有 will", "后半句是【好结果】→ 用 and", "后半句是【坏结果】→ 用 or"],
  mnemonic: "好结果 and，坏结果 or",
  trap: "别看见逗号就填 but。",
  lesson: "P7L2",
  match: (q) => /^\s*(hurry|get up|study|work|come|go|be)\b[^,]*,/i.test(q.stem.trim()) && /\bwill\b/i.test(q.stem),
},
{
  id: "cj-corr", point: 7, name: "both A and B 成对出现", mode: "背",
  modeWhy: "这几对词是固定搭配，谁配谁背下来就行，配错就是错。",
  formula: [["both", "两者都", "hl"], ["Tom", "A", "k"], ["and", "必须配 and", "hl"], ["Jack", "B", "k"]],
  steps: ["看空格前后是不是【两个并列的东西】（Tom … Jack / 又…又…）", "认对子：both…and（两者都）、either…or（要么…要么）、not only…but also（不但…而且）", "填一个就得配另一个，不能张冠李戴"],
  mnemonic: "both 配 and，either 配 or，not only 配 but also",
  trap: "both A and B 作主语，谓语用【复数】；either…or / neither…nor 作主语看【离得近的那个】。",
  lesson: null,
  match: (q) => /\bboth\b[\s\S]{0,40}\band\b/i.test(FR_TXT(q)) || /\beither\b[\s\S]{0,40}\bor\b/i.test(FR_TXT(q)) || /\bnot only\b[\s\S]{0,40}\bbut\b/i.test(FR_TXT(q)),
},
{
  id: "cj-neither", point: 7, name: "neither = 两者都不", mode: "背",
  modeWhy: "neither / nor 的意思和搭配是死的，背；难的只是谓语用单数还是复数。",
  formula: [["Neither", "两者都不（本身是否定）", "hl"], ["of my parents", "两个人", "k"], ["is", "谓语用单数", "hl"]],
  steps: ["neither = 两者都不，本身已经是否定，句子里不要再加 not", "neither of + 复数名词 → 谓语用【单数】（Neither of them is…）", "neither A nor B 作主语 → 谓语看【B】（Neither he nor I am…）"],
  mnemonic: "neither 自带否定，谓语看离得最近的那个",
  trap: "both of my parents are 是「两个都是」，neither of my parents is 是「两个都不是」，意思正好相反。",
  lesson: null,
  match: (q) => /\b(neither|nor)\b/i.test(FR_TXT(q)),
},
{
  id: "cj-although", point: 7, name: "although 不配 but", mode: "背",
  modeWhy: "中文「虽然…但是…」直译过来就错，必须记住英文只留一个。",
  formula: [["Although", "虽然", "hl"], ["he is old,", "", ""], ["he works hard", "这里【不能】再加 but", "k"]],
  steps: ["先看句子里已经有没有连词", "已经有 although / though → 后半句不能再加 but", "已经有 because / since → 后半句不能再加 so"],
  mnemonic: "虽然…但是…、因为…所以… —— 英文只能留一个",
  trap: "despite / in spite of / because of 后面接名词，although / because 后面接句子。",
  lesson: "P7L1",
  match: (q) => /^(although|though|even though|even if|while|whereas|despite|in spite of)$/i.test(FR_ANS(q).trim())
    || /\b(although|though)\b/i.test(q.stem),
},

{
  id: "cj-because", point: 7, name: "because / so 因果", mode: "背",
  modeWhy: "认「哪半句是原因、哪半句是结果」就能选，剩下的是一条铁律。",
  formula: [["He didn't come", "结果", "k"], ["because", "因为（后面接原因）", "hl"], ["he was ill", "原因", "k"]],
  steps: ["先分清两半句：哪句是原因，哪句是结果", "空后面跟【原因】→ because / since / as", "空后面跟【结果】→ so；「因为…所以…」两个只能留一个"],
  mnemonic: "空后面是原因用 because，是结果用 so",
  trap: "because of + 名词，because + 句子；一句话里 because 和 so 不能同时出现。",
  lesson: "P7L1",
  match: (q) => /^(because|since|as|so|therefore|thus|for)$/i.test(FR_ANS(q).trim()),
},
{
  id: "cj-when", point: 7, name: "when / until 时间连词", mode: "背+理解",
  modeWhy: "词表要背，选哪个得看两件事的先后关系。",
  formula: [["I will call you", "主句", ""], ["when", "当…的时候", "hl"], ["I arrive", "从句用现在时表将来", "k"]],
  steps: ["两半句是【时间先后】关系 → 用时间连词", "同时发生 when / while；一…就 as soon as；直到 until / till；之前 before，之后 after", "主句是将来时，when 从句要用【现在时】：I will call you when I arrive（不是 will arrive）"],
  mnemonic: "主将从现：主句 will，从句用现在时",
  trap: "while 后面一般接持续性动作（While I was cooking…）；not…until 是「直到…才」。",
  lesson: null,
  match: (q) => /^(when|while|as soon as|until|till|before|after|whenever|once)$/i.test(FR_ANS(q).trim()),
},
{
  id: "cj-if", point: 7, name: "if / unless 条件", mode: "背",
  modeWhy: "几个条件连词的意思背下来，代进句子读一遍就能确认。",
  formula: [["We'll visit Europe", "主句 will", ""], ["provided", "只要 / 如果（条件）", "hl"], ["we have enough money", "从句用现在时", "k"]],
  steps: ["两半句是【条件 → 结果】关系 → 用条件连词", "如果 if；除非 unless（= if…not）；只要 as long as / provided；以防 in case", "同样是主将从现：主句 will，条件从句用现在时"],
  mnemonic: "unless = if…not；in case = 以防万一",
  trap: "unless 本身带否定，别再写成 unless…not；in case 后面说的是【怕发生的事】，不是一定会发生。",
  lesson: null,
  match: (q) => /^(if|unless|provided|providing|in case|as long as|so long as)$/i.test(FR_ANS(q).trim()),
},
{
  id: "cj-but", point: 7, name: "but / however 转折", mode: "背",
  modeWhy: "意思都是「但是」，区别在【词性】：but 是连词，however 是副词。这条要背。",
  formula: [["She is poor", "第一句", "k"], ["but", "连词，直接连两句", "hl"], ["(she is) honest", "第二句", "k"]],
  steps: ["两半句意思【相反】→ 转折", "空在两句【中间】、要把两句连起来 → but / yet（连词）", "空后面有逗号、句子已经断开（… . ____ , …）→ however / nevertheless（副词）"],
  mnemonic: "but 连句子，however 靠逗号",
  trap: "前面已经有 although / though 了，这里就不能再填 but —— 英文只留一个。",
  lesson: "P7L1",
  match: (q) => /^(but|however|nevertheless|yet|otherwise|instead)$/i.test(FR_ANS(q).trim()),
},
{
  id: "cj-wherever", point: 7, name: "wherever 无论…", mode: "背",
  modeWhy: "-ever 结尾这一组的意思是死的，认词就行。",
  formula: [["you make friends", "主句", ""], ["wherever", "无论在哪里", "hl"], ["you go", "从句", "k"]],
  steps: ["句子里有「无论…都…」的意思 → 用 -ever 那一组", "地点 wherever，时间 whenever，人 whoever，事 whatever，方式 however", "都等于 no matter where / when / who / what / how"],
  mnemonic: "-ever = no matter …（无论）",
  trap: "however 有两个身份：这里是「无论多么」（however hard he tries），前面那个是「但是」。",
  lesson: null,
  match: (q) => /^(wherever|whenever|whoever|whatever|whichever|no matter \w+)$/i.test(FR_ANS(q).trim()),
},
/* ==================================================================
 * 以下是 7 大考点【之外】但真题在考的 —— point: 0
 * 用户 2026-08-16：「你觉得后面没学的、需要加的也加」
 * ================================================================== */
{
  id: "ex-passive", point: 0, chapter: "被动语态", name: "被动语态 be + done", mode: "背+理解",
  modeWhy: "公式 be + 过去分词 要背；用不用被动，得看主语是「做事的」还是「被做的」。",
  formula: [["The bridge", "主语是【被】建的", "k"], ["was", "be 动词按时态变", "hl"], ["built", "过去分词", "hl"], ["two years ago", "", ""]],
  steps: ["问一句：主语是自己做，还是被别人做？", "被别人做 → be + 过去分词", "be 跟着时态走：现在 is done / 过去 was done / 将来 will be done / 情态 must be done"],
  mnemonic: "被字句 = be + 过去分词，时态全靠 be 来变",
  trap: "情态动词后面是 be done（must be finished）；feel / taste / sell 这类词用主动表被动（This paper feels soft）。",
  lesson: "P8L1",
  match: (q) => q.topic === "passive",
},
{
  id: "ex-nounclause", point: 0, chapter: "名词性从句", name: "名词从句用陈述语序", mode: "背+理解",
  modeWhy: "「不用疑问语序」这条要背；填 what / whether / that 得看从句缺不缺东西。",
  formula: [["Do you know", "主句", ""], ["where", "连接词", "hl"], ["he lives", "陈述语序！不是 does he live", "k"]],
  steps: ["从句一律用【陈述语序】：主语在前动词在后，不能写成疑问句", "从句缺东西（缺主语/宾语）→ 用 what / who", "从句不缺东西 → 用 that；表示「是否」→ whether / if"],
  mnemonic: "从句不倒装：where he lives，不是 where does he live",
  trap: "主语从句、介词后面只能用 whether，不能用 if。",
  lesson: "P8L2",
  match: (q) => q.topic === "noun-clause",
},
{
  id: "ex-asas", point: 0, chapter: "比较级最高级", name: "as … as 同级比较", mode: "背",
  modeWhy: "夹在两个 as 中间必须用【原级】，这是形状问题。",
  formula: [["This room is twice", "倍数放最前面", "k"], ["as", "第一个 as", "hl"], ["large", "中间放原级，不加 er", "hl"], ["as that one", "第二个 as", "hl"]],
  steps: ["看句子里有没有 as … as（一样…）", "有 → 中间那个词用【原级】：as fast as，不是 as faster as", "否定 not as / so … as = 不如…；倍数放最前面：twice as large as"],
  mnemonic: "as 中间放原级，别加 er",
  trap: "not so much A as B = 与其说是 A，不如说是 B —— 考过，认这个搭配。",
  lesson: null,
  match: (q) => /\bas\b[\s\S]{0,30}\bas\b/i.test(FR_TXT(q)) || /so much as/i.test(FR_ANS(q)),
},
{
  id: "ex-superlative", point: 0, chapter: "比较级最高级", name: "最高级 the + est", mode: "背",
  modeWhy: "形状固定：三者以上、带 the、常配 in / of / ever。",
  formula: [["the", "最高级必须带 the", "hl"], ["biggest", "短词加 est，长词用 the most", "hl"], ["city in China", "范围：in / of", "k"]],
  steps: ["看范围词：in China / of all / of the three / I have ever seen → 三者以上，用最高级", "短词加 -est（biggest / longest），长词用 the most（the most interesting）", "one of the + 最高级 + 复数名词（one of the biggest cities）"],
  mnemonic: "三者以上带 the，短加 est 长用 most",
  trap: "副词最高级前面的 the 可以省（Mary sings best）；good→best，bad→worst 硬背。",
  lesson: "P8L3",
  match: (q) => q.topic === "superlative",
},
{
  id: "ex-comparative", point: 0, chapter: "比较级最高级", name: "比较级 -er / more", mode: "背",
  modeWhy: "短词加 er、长词加 more，是拼写规则，背。",
  formula: [["Tom is", "", ""], ["taller", "短词直接加 -er", "hl"], ["than", "比较级的标志", "k"], ["Jack", "", ""]],
  steps: ["句子里有 than → 一定用比较级", "短词（1-2 音节）加 -er：tall→taller, big→bigger", "长词加 more：important→more important。good/bad 不规则：better / worse"],
  mnemonic: "看见 than 就上比较级；短加 er，长加 more",
  trap: "the more … the more …（越…越…）两边都要加 the；the + 最高级 后面不跟 than。",
  lesson: "P8L3",
  match: (q) => q.topic === "comparative" || q.topic === "comparison",
},
{
  id: "ex-tag", point: 0, chapter: "反意疑问句", name: "反意疑问句", mode: "背",
  modeWhy: "前肯后否、前否后肯，机械规则，背完直接套。",
  formula: [["You are a student,", "前面是肯定", "k"], ["aren't", "后面就用否定", "hl"], ["you", "主语换成代词", "hl"]],
  steps: ["前面肯定 → 后面否定；前面否定 → 后面肯定", "借前面的助动词：are→aren't；likes→doesn't；can→can't；没有助动词就补 do/does/did", "主语一律换成代词（Tom→he）"],
  mnemonic: "前肯后否，前否后肯，主语换代词",
  trap: "Let's … 用 shall we？；Let us … 用 will you？",
  lesson: "P8L4",
  match: (q) => q.topic === "tag-question",
},
{
  id: "ex-modal", point: 0, chapter: "情态动词", name: "情态动词", mode: "背",
  modeWhy: "每个词对应一个中文意思，背对照表就行。",
  formula: [["must", "必须", "k"], ["should", "应该", "k"], ["may / might", "可能、也许", "k"], ["can / could", "能够、可以", "k"]],
  steps: ["先把空里要的中文意思想出来（必须？应该？可能？）", "对着表选词", "情态动词后面永远接动词【原形】"],
  mnemonic: "must 必须 / should 应该 / may 可能 / can 能够",
  trap: "mustn't = 禁止（不是「不必」）；needn't 才是「不必」。",
  lesson: null,
  match: (q) => q.topic === "modal-verb" || q.topic === "modal-can",
},
{
  id: "ex-colloc", point: 0, chapter: "固定搭配", name: "固定搭配", mode: "背",
  modeWhy: "动词 + 介词的组合没有道理可讲，是真题里占分最多的一类，只能靠积累。",
  formula: [["look after", "照顾", "k"], ["look for", "寻找", "k"], ["look forward to", "盼望", "k"], ["同一个动词，换个介词就换意思", "", ""]],
  steps: ["把四个选项分别代进去，读一遍中文意思", "选出意思对得上的那个", "错了就把这一组搭配抄下来 —— 这类题只能靠见过"],
  mnemonic: "搭配没道理，见一个记一个",
  trap: "真题里这一类占语法分近三成，比任何单个考点都多，别跳过。",
  lesson: "P9L1",
  match: (q) => q.topic === "collocation",
},
{
  id: "ex-wordchoice", point: 0, chapter: "词义辨析", name: "词义辨析", mode: "理解",
  modeWhy: "四个词意思相近，要看句子的语境挑最合适的那个 —— 背单词表没用，得理解差别。",
  formula: [["四个选项意思都沾边", "", "k"], ["→", "", ""], ["看句子的场景选最贴的", "", "hl"]],
  steps: ["先看句子在讲什么场景", "把四个词的细微差别想一遍（程度、褒贬、搭配对象）", "选最贴的那个；错了要把四个词的差别写下来"],
  mnemonic: "辨析题选「最合适」，不是选「能用」",
  trap: "别只看中文翻译，很多词中文一样但用法不同。",
  lesson: "P9L2",
  match: (q) => q.topic === "word-choice",
},
{
  id: "ex-be", point: 0, chapter: "基础句型", name: "be 动词对号：am/is/are", mode: "背",
  modeWhy: "谁配谁是一张表，背下来一辈子不错。",
  formula: [["I", "→ am", "k"], ["he / she / it / 单数名词", "→ is", "k"], ["you / we / they / 复数", "→ are", "k"]],
  steps: ["先找主语是谁", "I → am；单数（他/她/它/一个人一样东西）→ is；you 和一切复数 → are", "过去时同一张表：I / 单数 → was，you / 复数 → were"],
  mnemonic: "我 am，单数 is，你和复数 are",
  trap: "The weather / My father 都是单数 → is；You 不管一个人还是几个人都用 are。",
  lesson: null,
  match: (q) => q.topic === "be-verb",
},
{
  id: "ex-qword", point: 0, chapter: "基础句型", name: "疑问词开头提问", mode: "背",
  modeWhy: "问什么用什么词，是一张对照表。",
  formula: [["What", "什么", "k"], ["Who", "谁", "k"], ["Where", "哪里", "k"], ["When", "什么时候", "k"], ["How many / How long", "多少 / 多久", "k"]],
  steps: ["看答句在回答什么", "回答地点 → Where；回答人 → Who；回答时间点 → When；回答方式 → How", "回答数量 → How many（可数）/ How much（不可数、价钱）；回答时间长度 → How long"],
  mnemonic: "看答句缺什么，就用问那样东西的词",
  trap: "How long 问多久（For three years），How far 问多远，别互换。",
  lesson: null,
  match: (q) => q.topic === "question-word",
},
{
  id: "ex-imper", point: 0, chapter: "基础句型", name: "祈使句用动词原形", mode: "背",
  modeWhy: "形状固定：开头直接上原形，否定加 Don't。",
  formula: [["Close", "动词原形开头（没有主语）", "hl"], ["the door, please", "", ""], ["Don't", "否定祈使句", "hl"], ["be late", "原形", "k"]],
  steps: ["句子没有主语、就是叫人做事 → 祈使句", "肯定：动词【原形】开头（Close… / Be quiet…）", "否定：Don't + 原形（Don't be late）"],
  mnemonic: "祈使句没主语，动词光着上；否定加 Don't",
  trap: "「安静点」是 Be quiet，不是 Are quiet —— 形容词前面要补 be 的原形。",
  lesson: null,
  match: (q) => q.topic === "imperative",
},
{
  id: "ex-freq", point: 0, chapter: "基础句型", name: "频度副词的位置与程度", mode: "背",
  modeWhy: "程度顺序和摆放位置都是规矩，背下来直接用。",
  formula: [["always 总是", "100%", "k"], ["usually / often", "常常", "k"], ["sometimes", "有时", "k"], ["seldom / never", "很少 / 从不", "k"]],
  steps: ["先看后半句透露的频率（every day → always；once a year → seldom；He always comes early → never late）", "位置：在 be 动词【后面】（He is never late），在实义动词【前面】（He never comes late）", "never / seldom 本身是否定，句子里不要再加 not"],
  mnemonic: "be 后面，实义动词前面",
  trap: "never 提到句首要部分倒装（Never have I seen…），那是倒装题的考法。",
  lesson: null,
  match: (q) => q.topic === "adverb-frequency",
},
{
  id: "ex-plural", point: 0, chapter: "冠词与名词", name: "名词复数 -s / -es", mode: "背",
  modeWhy: "变形规则 + 不规则表，全是背的东西。",
  formula: [["book → books", "一般加 s", "k"], ["watch → watches", "ch/sh/s/x 加 es", "k"], ["tomato → tomatoes", "辅音+o 加 es", "k"], ["child → children", "不规则，硬背", "hl"]],
  steps: ["前面有 two / three / five / those / many → 名词必须变复数", "一般加 -s；以 s/x/ch/sh 结尾加 -es；辅音+y 变 i 加 es（city→cities）", "不规则的单独背：child→children，man→men，foot→feet，tooth→teeth"],
  mnemonic: "数字后面必须带 s；ch/sh/s/x 要加 es",
  trap: "不可数名词没有复数（water / milk / money / information），别写成 waters。",
  lesson: null,
  match: (q) => q.topic === "plural",
},
{
  id: "ex-dem", point: 0, chapter: "冠词与名词", name: "this / that / these / those", mode: "背",
  modeWhy: "近远 + 单复数两个维度，一张四格表，背。",
  formula: [["this", "近 · 单数", "k"], ["these", "近 · 复数", "k"], ["that", "远 · 单数", "k"], ["those", "远 · 复数", "k"]],
  steps: ["先看名词是单数还是复数：apples / shoes 是复数 → these / those", "再看远近：这儿（here）→ this / these；那儿（over there）→ that / those", "两步一起定：over there + 复数 → Those"],
  mnemonic: "近 this/these，远 that/those；复数带 se",
  trap: "空后面的名词是复数就绝不能用 this / that，先数名词再选词。",
  lesson: null,
  match: (q) => q.topic === "demonstrative",
},
{
  id: "ex-article", point: 0, chapter: "冠词与名词", name: "冠词 a / an / the", mode: "背",
  modeWhy: "元音前用 an、特指用 the，是几条死规则。",
  formula: [["a", "泛指，辅音开头", "k"], ["an", "泛指，元音开头", "k"], ["the", "特指（双方都知道哪一个）", "k"]],
  steps: ["是「随便一个」还是「特定那一个」", "随便一个 → a / an（看后面单词的【发音】是不是元音开头）", "特定那一个、上文提过的 → the"],
  mnemonic: "元音前用 an，特指用 the",
  trap: "an hour（h 不发音）、a university（发 you 的音）—— 看发音不看字母。",
  lesson: null,
  match: (q) => q.topic === "article",
},
{
  id: "ex-prep", point: 0, chapter: "介词", name: "介词 in / on / at", mode: "背",
  modeWhy: "时间地点介词是三条口诀的事，背完不再错。",
  formula: [["at", "点：at 6:00 / at the door", "k"], ["on", "面：on Monday / on the desk", "k"], ["in", "里：in May / in the box", "k"]],
  steps: ["时间：具体钟点用 at，某一天用 on，月份年份用 in", "地点：一个点用 at，接触表面用 on，在里面用 in", "背这三条就够应付成考"],
  mnemonic: "点 at、面 on、里 in",
  trap: "in the morning 但 on Monday morning（带了具体某天就用 on）。",
  lesson: null,
  match: (q) => /^preposition/.test(q.topic || ""),
},
{
  id: "ex-quant", point: 0, chapter: "代词与数量词", name: "much / many / few / little", mode: "背",
  modeWhy: "数得清用哪个、数不清用哪个，是一张表；a few 和 few 的差别也是死规定。",
  formula: [["many / few / a few", "配【可数】复数：apples", "k"], ["much / little / a little", "配【不可数】：water", "k"], ["a lot of", "两边都能用", "hl"]],
  steps: ["先看后面那个名词数得清吗：apples 数得清（可数），water / time / money 数不清", "可数 → many / few / a few；不可数 → much / little / a little；拿不准就用 a lot of", "How many + 可数复数，How much + 不可数（也问价钱）"],
  mnemonic: "many 数得清，much 数不清；a lot of 通吃",
  trap: "few / little = 几乎没有（偏否定），a few / a little = 有一点（偏肯定），差一个 a 意思翻转。",
  lesson: null,
  match: (q) => /^(much-many|few-little)$/.test(q.topic || ""),
},
{
  id: "ex-pronoun", point: 0, chapter: "代词与数量词", name: "代词与 some/any", mode: "背",
  modeWhy: "人称代词的四种形式和 some/any 的用法都是表格，背表。",
  formula: [["I / me / my / mine", "我 / 我（宾） / 我的+名词 / 我的", "k"], ["some", "肯定句", "k"], ["any", "否定句、疑问句", "k"]],
  steps: ["看这个空在句子里当什么：主语用 I，宾语用 me，后面跟名词用 my", "肯定句用 some，否定和疑问用 any", "many 数得清，much 数不清"],
  mnemonic: "主格宾格看位置；some 肯定 any 否定",
  trap: "few / little 是「几乎没有」，a few / a little 才是「有一点」。",
  lesson: null,
  match: (q) => /^(pronoun|possessive|object-pronoun|some-any)$/.test(q.topic || ""),
},

];

/* 兜底框架：题目落不进任何具体框架时，至少给它一个考点级的说明。
   这样每道题都有「该背/该理解 + 难度 + 框架」三个标签，不会出现空白。 */
window.FRAME_FALLBACK = {
  1: { id: "p1", point: 1, name: "非谓语动词", mode: "背+理解", modeWhy: "固定搭配要背，主动被动要理解。",
       steps: ["句子里已经有真动词了吗？有 → 这个空必须变形", "这个动作是主动做的（doing）还是被动挨的（done）", "还没发生 / 表示目的 → to do"],
       mnemonic: "一句一个真动词，其余全变形", trap: "分不清主动被动就先找这个动作的执行者是谁。" },
  2: { id: "p2", point: 2, name: "定语从句", mode: "理解", modeWhy: "先行词是人是物、从句缺什么，两步都得读句子。",
       steps: ["找先行词：空格前面那个名词", "把从句拎出来单独读，看缺什么", "人→who/that，物→which/that，缺定语→whose，不缺→where/when"],
       mnemonic: "先看人还是物，再看缺什么", trap: "从句读着不缺东西时就该用 where/when 了。" },
  3: { id: "p3", point: 3, name: "时态", mode: "背", modeWhy: "成考时态题九成靠标志词，认词就能做对。",
       steps: ["先扫标志词：since/for/already→完成时；ago/last→过去式；Look!/now→进行时；tomorrow→will", "没有标志词才去看句子意思", "两件过去的事，更早那件用 had done"],
       mnemonic: "先找标志词，再想意思", trap: "since 和 ago 不共存。" },
  4: { id: "p4", point: 4, name: "虚拟语气", mode: "背", modeWhy: "三套公式背下来，考场上照着形状填。",
       steps: ["与现在相反：If + 过去式 → would do", "与过去相反：If + had done → would have done", "suggest/demand 后面 → 动词原形"],
       mnemonic: "从句退一格，主句配 would", trap: "be 在虚拟里一律 were。" },
  5: { id: "p5", point: 5, name: "倒装与强调", mode: "背", modeWhy: "认句首那个词就能选，纯认形状。",
       steps: ["句首是否定词或 only+状语 → 部分倒装（助动词+主语）", "It is…that 删掉还通顺 → 强调句", "So do I = 我也是"],
       mnemonic: "否定提前，助动词跟上", trap: "only + 主语不倒装。" },
  6: { id: "p6", point: 6, name: "主谓一致", mode: "背+理解", modeWhy: "找主语要理解，特殊规则要背。",
       steps: ["把 of/in 引导的修饰语盖住，找真正的主语", "each/every/everyone/动名词作主语 → 单数", "there be 和 neither…nor → 就近；both A and B → 复数"],
       mnemonic: "盖住修饰语，剩下的才是主语", trap: "the number of 单数，a number of 复数。" },
  7: { id: "p7", point: 7, name: "连词逻辑", mode: "背", modeWhy: "几条铁律记住就行。",
       steps: ["句子里已经有连词了吗？有就不能再加第二个", "although 不配 but，because 不配 so", "祈使句后面：好结果 and，坏结果 or"],
       mnemonic: "一个逻辑关系只能用一个连词", trap: "despite 接名词，although 接句子。" },
  0: { id: "p0", point: 0, name: "其他考点", mode: "理解", modeWhy: "不在 7 大考点里，考场上靠读句子和排除法。",
       steps: ["把四个选项分别代进句子读一遍", "排掉明显读不通的", "剩下的选最贴句意的那个"],
       mnemonic: "代入读一遍，排除法收尾", trap: "这类不做专项，别花大时间。" },
};
