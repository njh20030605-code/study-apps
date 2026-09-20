/* ============================================================================
 * questions-sva.js —— 补齐【考点6 主谓一致】题库
 * ----------------------------------------------------------------------------
 * 为什么单独加：7 大考点里只有「主谓一致」在原题库中几乎没有对应题
 * （只有 there-be 6 道），而它是策略里必投入的考点之一。这里手写补 14 道，
 * 覆盖 strategy.js 里列出的全部判定规则：中心词 / each-every / the number of /
 * 就近原则 / 从句主语 / 集体名词 / 度量整体 / as well as。
 * 字段与其它题库一致；optionNotes 长度必须等于 options 长度。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

{
  id: "sva-01", level: 1, module: "grammar", topic: "subject-verb-agreement",
  stem: "Each of the students ____ a dictionary.",
  options: ["have", "has", "are having", "having"],
  answer: 1,
  explanation: "主语中心词是 each，不是后面的 students。each of + 复数名词，谓语一律用单数。",
  optionNotes: [
    "错：have 是复数形式，跟 students 走了，但真正的主语是 each",
    "对：each of + 复数名词 → 谓语单数 has",
    "错：have 的形式错，而且这里也不需要进行时",
    "错：having 是非谓语，句子就没谓语了"
  ]
},
{
  id: "sva-02", level: 2, module: "grammar", topic: "subject-verb-agreement",
  stem: "The number of private cars ____ increasing year by year.",
  options: ["is", "are", "were", "have been"],
  answer: 0,
  explanation: "the number of + 复数名词 = “……的数量”，中心词是 number，单数。对照记：a number of + 复数名词 = “许多”，谓语用复数。",
  optionNotes: [
    "对：中心词 number 是单数 → is",
    "错：are 跟 cars 走了，cars 只是介词短语里的名词，不是主语",
    "错：数错了，时态也没依据",
    "错：同上，数错"
  ]
},
{
  id: "sva-03", level: 2, module: "grammar", topic: "subject-verb-agreement",
  stem: "A number of students ____ waiting outside the office.",
  options: ["is", "are", "was", "has been"],
  answer: 1,
  explanation: "a number of + 复数名词 = “许多学生”，中心词是 students，谓语用复数。和上一题的 the number of 正好相反，这一对是考试常换着考的。",
  optionNotes: [
    "错：是 the number of 才用单数",
    "对：a number of students = 许多学生 → are",
    "错：数错了",
    "错：数错了"
  ]
},
{
  id: "sva-04", level: 2, module: "grammar", topic: "subject-verb-agreement",
  stem: "Neither he nor I ____ to blame for the accident.",
  options: ["is", "am", "are", "be"],
  answer: 1,
  explanation: "neither...nor 连接两个主语时用“就近原则”——谓语跟离它最近的那个主语走。这里最近的是 I，所以用 am。",
  optionNotes: [
    "错：is 跟的是 he，但 he 不是最近的那个",
    "对：就近原则，最近的主语是 I → am",
    "错：are 需要复数主语，这里没有",
    "错：be 是原形，句子缺谓语"
  ]
},
{
  id: "sva-05", level: 2, module: "grammar", topic: "subject-verb-agreement",
  stem: "Not only the students but also their teacher ____ interested in the new plan.",
  options: ["are", "is", "were", "have been"],
  answer: 1,
  explanation: "not only...but also 同样走就近原则。离谓语最近的是 their teacher（单数），所以用 is。",
  optionNotes: [
    "错：are 跟的是前面的 students，不是最近的主语",
    "对：最近的主语 their teacher 是单数 → is",
    "错：数和时态都没依据",
    "错：数错了"
  ]
},
{
  id: "sva-06", level: 3, module: "grammar", topic: "subject-verb-agreement",
  viz: {"en": "One of the boys (who are playing football over there) is my brother.", "rows": [["主干", "One of the boys is my brother.", "那群男孩里有一个是我弟弟（one 是主语 → is）"], ["括号补充", "who are playing football over there", "他们正在那边踢球（who 指 boys → are）"]], "note": "同一句里两个数：主句跟 one 用单数，从句跟 boys 用复数——这就是这题的坑。"},
  stem: "One of the boys who ____ playing football over there is my brother.",
  options: ["is", "are", "was", "has been"],
  answer: 1,
  explanation: "定语从句 who... 修饰的是 the boys（复数），所以从句谓语用 are；而主句谓语 is 跟的是 One。同一句里两个不同的数，这正是这个考点最爱设的坑。",
  optionNotes: [
    "错：is 是把 who 的先行词误当成 one 了",
    "对：who 指代 the boys，从句谓语用复数 are",
    "错：数错，而且时态与主句 is 不一致",
    "错：数错"
  ]
},
{
  id: "sva-07", level: 2, module: "grammar", topic: "subject-verb-agreement",
  stem: "Reading English newspapers every day ____ a good way to improve your English.",
  options: ["are", "is", "were", "be"],
  answer: 1,
  explanation: "动名词短语作主语，无论后面挂多长，整体都当一件事看，谓语用单数。不定式、从句作主语也一样。",
  optionNotes: [
    "错：are 被 newspapers 骗了，它只是动名词的宾语",
    "对：动名词短语作主语 → 谓语单数 is",
    "错：数错，时态也无依据",
    "错：be 是原形，不能直接作谓语"
  ]
},
{
  id: "sva-08", level: 2, module: "grammar", topic: "subject-verb-agreement",
  stem: "The police ____ looking for the lost child now.",
  options: ["is", "are", "has been", "was"],
  answer: 1,
  explanation: "police / people / cattle 这类集体名词形式上没有 -s，但意义是复数，谓语一律用复数。",
  optionNotes: [
    "错：police 看着像单数，其实是复数",
    "对：police 是集体名词，谓语用复数 are",
    "错：数错了",
    "错：数错，而且 now 要求现在进行时"
  ]
},
{
  id: "sva-09", level: 2, module: "grammar", topic: "subject-verb-agreement",
  stem: "Every boy and every girl in our class ____ to take part in the sports meeting.",
  options: ["want", "wants", "are wanting", "have wanted"],
  answer: 1,
  explanation: "and 连接的两个主语前都有 every（或 each、no），说明是“每一个”逐个来看，谓语用单数。注意这与普通的 A and B 用复数不同。",
  optionNotes: [
    "错：普通 A and B 才用复数，这里被 every 限定了",
    "对：every...and every... → 谓语单数 wants",
    "错：want 一般不用进行时，数也不对",
    "错：数错，时态也无依据"
  ]
},
{
  id: "sva-10", level: 1, module: "grammar", topic: "subject-verb-agreement",
  stem: "There ____ a pen and two books on the desk.",
  options: ["is", "are", "have", "has"],
  answer: 0,
  explanation: "there be 句型用就近原则：谓语跟紧挨着它的第一个名词走。这里最近的是 a pen（单数），所以用 is。",
  optionNotes: [
    "对：最近的名词是 a pen → is",
    "错：are 跟的是后面的 two books，不是最近的",
    "错：there be 句型不用 have",
    "错：同上，there 后面不接 has"
  ]
},
{
  id: "sva-11", level: 2, module: "grammar", topic: "subject-verb-agreement",
  stem: "Bread and butter ____ what he usually has for breakfast.",
  options: ["are", "is", "were", "have been"],
  answer: 1,
  explanation: "and 连接的如果是同一样东西（bread and butter 黄油面包是一体的、fish and chips 也是），当一个整体看，谓语用单数。",
  optionNotes: [
    "错：只有连接两样不同的东西时才用复数",
    "对：bread and butter 是一体的一样食物 → is",
    "错：数错，时态也无依据",
    "错：数错"
  ]
},
{
  id: "sva-12", level: 2, module: "grammar", topic: "subject-verb-agreement",
  stem: "Twenty years ____ a long time in a person's life.",
  options: ["are", "is", "were", "have been"],
  answer: 1,
  explanation: "时间、距离、金钱、重量这类度量，虽然形式是复数，但当成一个整体量看待，谓语用单数。",
  optionNotes: [
    "错：被 years 的复数形式骗了",
    "对：二十年当作一段时间整体 → is",
    "错：数错了",
    "错：数错了"
  ]
},
{
  id: "sva-13", level: 3, module: "grammar", topic: "subject-verb-agreement",
  stem: "What he said at the meeting ____ quite reasonable.",
  options: ["are", "is", "were", "have been"],
  answer: 1,
  explanation: "what 引导的主语从句整体作主语，当一件事看，谓语用单数。判断法：把 What he said 换成 It，句子照样通顺。",
  optionNotes: [
    "错：从句里的成分不决定主句谓语的数",
    "对：主语从句作主语 → 谓语单数 is",
    "错：数错了",
    "错：数错了"
  ]
},
{
  id: "sva-14", level: 3, module: "grammar", topic: "subject-verb-agreement",
  viz: {"en": "The teacher, (as well as his students,) visited the science museum last week.", "rows": [["主干", "The teacher visited the science museum last week.", "老师上周参观了科技馆"], ["括号补充", "as well as his students", "插入语：还有他的学生们——被逗号隔开，不算进主语"]]},
  stem: "The teacher, as well as his students, ____ the science museum last week.",
  options: ["visit", "visits", "visited", "have visited"],
  answer: 2,
  explanation: "as well as / with / together with / along with 引出的部分只是插入成分（这里还被逗号隔开了），主语仍是 The teacher。又有 last week，所以用一般过去时 visited。",
  optionNotes: [
    "错：数不对，而且时态是现在",
    "错：数对了，但 last week 要求过去时",
    "对：主语是 The teacher，last week → 一般过去时 visited",
    "错：have visited 不能和 last week 这种明确的过去时间连用"
  ]
},

]);
