/* ============================================================================
 * reading-skills.js —— 阅读 / 完形「技巧闯关」关卡库
 *
 * 卷面阅读60分+完形30分=90分是"技能盘"，读不流利也能靠【做题技巧】薅一半以上。
 * 这里把技能拆成一个个可训练的技巧关卡（对标政治的考点闯关，但关卡=做题套路）。
 * 每关：白话讲原理 + 几步套路 + 一个走一遍的例子；再用 AI 出针对性题来练、判过关。
 *
 * 字段：id / group(reading|cloze) / emoji / name / why(一句话价值)
 *      / plain(白话讲解) / steps[](套路步骤) / example{passage,q,options,answer,walk}
 *      / genHint(传给 AI 出题的技巧焦点) / bankKw(题库后备题按解析关键词筛)
 * 顺序=性价比/学习先后（先易先高频）。
 * ========================================================================== */

window.READING_SKILLS = [

/* ============================ 阅读技巧 ============================== */
{
  id: "r-detail", group: "reading", emoji: "🔎", name: "细节定位题",
  why: "阅读里一半的题都是它，最好拿、最该先吃满",
  plain: "细节题的答案就明明白白写在原文里，不用你推理、也不用读懂全文。关键就一句话：带着问题回原文找，别凭印象选。",
  steps: [
    "先读题干，圈出关键词：人名 / 时间 / 数字 / 地点 / 专有名词",
    "拿关键词回原文扫描，找到对应的那一句",
    "把四个选项和原文那句比对，意思一致的就是答案",
    "警惕偷换：把原文词换成近义词的常是对的；换成相反 / 原文没提到的就是错的",
  ],
  example: {
    passage: "The meeting will start at 3 p.m. in Room 201. Please arrive on time.",
    q: "When will the meeting start?",
    options: ["At 2 p.m.", "At 3 p.m.", "In Room 201", "Tomorrow"],
    answer: 1,
    walk: "题干关键词是 When（时间）→ 回原文找时间 → “at 3 p.m.” → 选 B。选项 C 是地点不是时间，属于典型干扰项。",
  },
  genHint: "细节定位题（答案能直接在原文找到的 what/when/where/who/how much 类问题）",
  bankKw: "细节",
},
{
  id: "r-guess", group: "reading", emoji: "🧠", name: "猜词义题",
  why: "遇到生词不用慌，靠上下文也能猜对",
  plain: "考的就是“用上下文猜生词”，不是真让你认识它。看这个词前后在说什么，有没有转折、举例、或换个说法解释它。",
  steps: [
    "找到生词所在的句子，连它前后一两句一起读",
    "抓信号词：but / however（前后相反）、because / so（因果）、such as / for example（举例）、or / that is（换句话说）",
    "用你看得懂的部分反推：这个词大概是褒义还是贬义、和旁边的词同义还是反义",
    "把猜的意思代回去读一遍，通顺就对",
  ],
  example: {
    passage: "Tom is very frugal; he never wastes money and always saves for the future.",
    q: "The word “frugal” probably means ____.",
    options: ["节俭的", "浪费的", "富有的", "粗心的"],
    answer: 0,
    walk: "分号后面 “never wastes money and always saves”（从不浪费、总在存钱）正是在解释 frugal → 意思是“节俭的”，选 A。",
  },
  genHint: "猜词义题（题干问某个较难单词在文中的意思，4 个选项是近义解释，答案要靠上下文推断）",
  bankKw: "猜词|词义|词意",
},
{
  id: "r-main", group: "reading", emoji: "🎯", name: "主旨大意题",
  why: "每篇通常 1 道，问全文到底讲什么",
  plain: "主旨题问“整篇主要讲什么”。答案常在首句或末句，或反复出现的那个词。记住：只说了某个细节的选项太小，不是主旨。",
  steps: [
    "看标题（若有）和每段第一句",
    "找反复出现的关键词 = 文章主题",
    "选那个“能盖住全文”的选项",
    "排除两头：只覆盖一个细节的太小；空泛到什么都能套的太大",
  ],
  example: {
    passage: "Reading has many benefits. It improves your vocabulary, helps you relax, and makes you smarter.",
    q: "What is the passage mainly about?",
    options: ["The benefits of reading", "How to relax", "Some new words", "Being smart"],
    answer: 0,
    walk: "首句 “Reading has many benefits” 就是主题句，后面整段都在举好处 → 选 A。B/C/D 都只是其中一个细节，太小。",
  },
  genHint: "主旨大意题（问 main idea / mainly about / best title 的题）",
  bankKw: "主旨|大意|标题|主题",
},
{
  id: "r-infer", group: "reading", emoji: "🔮", name: "推理判断题",
  why: "稍难一点，问“从原文能推出什么”",
  plain: "推理题问“根据原文能得出什么”。铁律：只能顺着原文推一小步，不能自己脑补。原文没依据的、说得太满的，都错。",
  steps: [
    "找到相关的那句，想它“暗示”了什么",
    "正确答案 = 原文没直说、但顺理成章的一小步",
    "排除：原文根本没提的；带 always/never/all 太绝对的；和原文矛盾的",
  ],
  example: {
    passage: "Lily took an umbrella before going out.",
    q: "What can we infer from the sentence?",
    options: ["It might rain.", "Lily is rich.", "It is sunny.", "Lily sells umbrellas."],
    answer: 0,
    walk: "出门前带伞 → 合理推断“可能要下雨”，选 A。B/D 是脑补，C 和“带伞”矛盾。",
  },
  genHint: "推理判断题（问 infer / imply / we can learn 的题，答案是基于原文的合理推断，不是原文原话）",
  bankKw: "推理|推断|判断|infer|暗示",
},

/* ============================ 完形技巧 ============================== */
{
  id: "c-logic", group: "cloze", emoji: "🔗", name: "上下文逻辑 / 连词",
  why: "完形最常考，看空前空后的逻辑关系",
  plain: "完形很多空考“逻辑连接词”。先判断空格前后两部分是什么关系，再选对应关系的词，别按中文顺口就选。",
  steps: [
    "读空格前后两句，判断关系",
    "相反 → but / however / though；原因 → because / since，结果 → so / therefore",
    "补充并列 → and / also；对比 → while；让步 → although",
    "把选的词代进去，整句读一遍通不通顺",
  ],
  example: {
    passage: "He studied very hard, ____ he passed the exam easily.",
    q: "(1) 处应填：",
    options: ["so", "but", "or", "although"],
    answer: 0,
    walk: "前半“努力学习”是原因，后半“轻松通过”是结果 → 因果关系用 so，选 A。",
  },
  genHint: "上下文逻辑关系 / 连词（and, but, so, because, although, however 等）",
  bankKw: "cloze",
},
{
  id: "c-collocation", group: "cloze", emoji: "🧩", name: "固定搭配",
  why: "背过搭配就是秒选的送分空",
  plain: "有些空考“固定搭配”——动词加介词、习惯用法。背过就一眼选出来，没背过硬猜也难。所以平时背单词要连搭配一起背。",
  steps: [
    "看空格和它旁边的词能凑成哪个固定搭配",
    "常见：be interested in / look forward to / depend on / instead of / take care of / be good at",
    "认准搭配整体，别按中文一个字一个字直译",
  ],
  example: {
    passage: "My little sister is very interested ____ drawing pictures.",
    q: "(1) 处应填：",
    options: ["in", "on", "at", "for"],
    answer: 0,
    walk: "be interested in（对……感兴趣）是固定搭配 → 选 in。搭配是背下来的，不是推出来的。",
  },
  genHint: "固定搭配 / 动词短语 / 介词搭配",
  bankKw: "cloze|搭配",
},
{
  id: "c-word", group: "cloze", emoji: "⚖️", name: "词义辨析",
  why: "四个选项意思都差不多时，选最贴语境的",
  plain: "有些空四个选项意思相近，考的是“哪个最贴合这句话的语境”。办法就是逐个代入，看哪个读起来最顺、意思最搭、不冲突。",
  steps: [
    "把四个选项都翻成中文，看清它们的细微差别",
    "逐个代入空格，读整句",
    "选和上下文意思、感情色彩最一致的；搭配不通或意思打架的排除",
  ],
  example: {
    passage: "It was raining hard outside, so I decided to ____ at home.",
    q: "(1) 处应填：",
    options: ["stay", "stand", "sit", "leave"],
    answer: 0,
    walk: "“因为下大雨所以决定……在家” → stay at home（待在家）最贴语境。stand 站、sit 坐、leave 离开都不搭 → 选 A。",
  },
  genHint: "近义词词义辨析（4 个选项意思相近，需按语境选最合适的）",
  bankKw: "cloze|辨析",
},

];
