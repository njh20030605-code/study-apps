/* ============================================================================
 * questions-pack2b.js  ——  扩充包 2b：进阶核心+冲刺章节（第13-26章知识点）
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* ---------------- 比较级 comparative (4) ---------------- */
{
  id: "p2b-comp-1", level: 2, module: "grammar", topic: "comparative",
  stem: "This book is ____ than that one.",
  options: ["interesting", "more interesting", "most interesting", "the most interesting"],
  answer: 1,
  explanation: "有 than 用比较级；interesting 是长单词，比较级加 more。",
  optionNotes: ["错：原级不能配 than", "对：more + 长单词 = 比较级", "错：最高级不配 than", "错：the most 是最高级"]
},
{
  id: "p2b-comp-2", level: 2, module: "grammar", topic: "comparative",
  stem: "Tom runs ____ than his brother.",
  options: ["fast", "faster", "fastest", "more fast"],
  answer: 1,
  explanation: "有 than 用比较级；fast 是短单词，比较级直接加 -er，即 faster。",
  optionNotes: ["错：原级不能配 than", "对：短单词加 -er 变比较级", "错：fastest 是最高级", "错：短单词不用 more，直接加 -er"]
},
{
  id: "p2b-comp-3", level: 2, module: "grammar", topic: "comparative",
  stem: "The weather today is much ____ than yesterday.",
  options: ["good", "better", "best", "well"],
  answer: 1,
  explanation: "有 than 用比较级；good 的比较级是不规则变化 better，much 可以修饰比较级表示“……得多”。",
  optionNotes: ["错：原级不能配 than", "对：good 的比较级是 better", "错：best 是最高级", "错：well 是原级副词"]
},
{
  id: "p2b-comp-4", level: 2, module: "grammar", topic: "comparative",
  stem: "The more you practice, ____ your English will be.",
  options: ["good", "better", "the better", "the best"],
  answer: 2,
  explanation: "“the + 比较级, the + 比较级”是固定句型，表示“越……就越……”，两边都要带 the。",
  optionNotes: ["错：原级不行，也缺 the", "错：比较级对了但缺 the", "对：the + 比较级，越练越好", "错：这里不用最高级"]
},

/* ---------------- 最高级 superlative (3) ---------------- */
{
  id: "p2b-sup-1", level: 2, module: "grammar", topic: "superlative",
  stem: "Shanghai is one of ____ cities in China.",
  options: ["big", "bigger", "the biggest", "biggest"],
  answer: 2,
  explanation: "one of + the + 最高级 + 复数名词，表示“最……之一”，最高级前必须加 the。",
  optionNotes: ["错：原级不表达“最大之一”", "错：比较级不配 one of", "对：one of the biggest cities 固定搭配", "错：最高级前少了 the"]
},
{
  id: "p2b-sup-2", level: 2, module: "grammar", topic: "superlative",
  stem: "This is ____ film I have ever seen.",
  options: ["interesting", "more interesting", "the most interesting", "most interesting"],
  answer: 2,
  explanation: "后面有 I have ever seen（我看过的当中），是在一个范围里比，用最高级 the most interesting。",
  optionNotes: ["错：原级没有“最”的意思", "错：比较级要配 than", "对：范围内比较用 the + 最高级", "错：最高级前少了 the"]
},
{
  id: "p2b-sup-3", level: 2, module: "grammar", topic: "superlative",
  stem: "Of the three girls, Mary sings ____.",
  options: ["well", "better", "best", "most well"],
  answer: 2,
  explanation: "三个人当中比，用最高级；well 的最高级是不规则的 best，副词最高级前 the 可省。",
  optionNotes: ["错：原级不能表达三人中最好", "错：比较级只用于两者之间", "对：well 的最高级是 best", "错：well 是不规则变化，不加 most"]
},

/* ---------------- 同级比较 comparison (2) ---------------- */
{
  id: "p2b-cmp-1", level: 2, module: "grammar", topic: "comparison",
  stem: "This room is twice ____ that one.",
  options: ["as large as", "larger", "the largest", "large than"],
  answer: 0,
  explanation: "倍数表达用“倍数 + as + 原级 + as”，twice as large as 意思是“是那间的两倍大”。",
  optionNotes: ["对：倍数 + as 原级 as 固定结构", "错：larger 后面缺 than，也不和 twice 直接连用", "错：最高级放这里讲不通", "错：large than 缺比较级，语法错误"]
},
{
  id: "p2b-cmp-2", level: 2, module: "grammar", topic: "comparison",
  stem: "He doesn't run as ____ as his friend.",
  options: ["fast", "faster", "fastest", "more fast"],
  answer: 0,
  explanation: "as ... as 中间必须放原级，否定式 not as/so ... as 表示“不如……”。",
  optionNotes: ["对：as + 原级 + as 是铁规矩", "错：as...as 中间不能放比较级", "错：as...as 中间不能放最高级", "错：more fast 本身就是错误形式"]
},

/* ---------------- 现在完成时 present-perfect (8) ---------------- */
{
  id: "p2b-pp-1", level: 2, module: "grammar", topic: "present-perfect",
  stem: "She ____ in Beijing for ten years.",
  options: ["lives", "lived", "has lived", "is living"],
  answer: 2,
  explanation: "for + 一段时间（十年）表示从过去持续到现在，用现在完成时 has lived。",
  optionNotes: ["错：一般现在时不表达持续了十年", "错：一般过去时和现在没关系了", "对：has + 过去分词，持续到现在", "错：进行时不和 for ten years 这样搭"]
},
{
  id: "p2b-pp-2", level: 2, module: "grammar", topic: "present-perfect",
  stem: "____ you ever ____ to the Great Wall?",
  options: ["Did; go", "Have; been", "Have; gone", "Do; go"],
  answer: 1,

  explanation: "ever（曾经）常配现在完成时；have been to 表示“去过（已回来）”，have gone to 表示“去了（还没回来）”。问对方经历要用 been。",
  optionNotes: ["错：ever 问经历不用一般过去时", "对：have been to = 去过，问经历", "错：have gone to 是人还没回来，不能问眼前的你", "错：一般现在时不表达经历"]
},
{
  id: "p2b-pp-3", level: 2, module: "grammar", topic: "present-perfect",
  stem: "He ____ his homework yet.",
  options: ["hasn't finished", "didn't finish", "doesn't finish", "isn't finishing"],
  answer: 0,
  explanation: "yet（还没）是现在完成时否定句的标志词，用 hasn't + 过去分词。",
  optionNotes: ["对：yet 配现在完成时否定式", "错：一般过去时不和 yet 搭配", "错：一般现在时不和 yet 搭配", "错：进行时不和 yet 搭配"]
},
{
  id: "p2b-pp-4", level: 2, module: "grammar", topic: "present-perfect",
  stem: "I ____ my keys. I can't open the door.",
  options: ["lose", "lost", "have lost", "will lose"],
  answer: 2,
  explanation: "钥匙丢了这个动作对现在造成影响（现在开不了门），用现在完成时 have lost。",
  optionNotes: ["错：一般现在时不表达已经丢了", "错：一般过去时只讲过去，不强调现在的影响", "对：过去的动作影响现在，用现在完成时", "错：将来时讲不通，门已经打不开了"]
},
{
  id: "p2b-pp-5", level: 2, module: "grammar", topic: "present-perfect",
  stem: "They ____ each other since 2010.",
  options: ["know", "knew", "have known", "are knowing"],
  answer: 2,
  explanation: "since + 过去的时间点（2010年）是现在完成时的标志，表示从那时认识到现在。",
  optionNotes: ["错：一般现在时不配 since 2010", "错：一般过去时不表达持续到现在", "对：since + 时间点用现在完成时", "错：know 是状态动词，一般不用进行时"]
},
{
  id: "p2b-pp-6", level: 2, module: "grammar", topic: "present-perfect",
  stem: "My father ____ to Shanghai. He will be back next week.",
  options: ["has been", "has gone", "went", "goes"],
  answer: 1,
  explanation: "人现在不在这儿、还没回来，用 has gone to（去了）；has been to 是“去过、已经回来了”。",
  optionNotes: ["错：has been to 是已经回来了，与下句矛盾", "对：has gone to = 人去了还没回来", "错：一般过去时不强调现在人不在", "错：一般现在时表达习惯，不合语境"]
},
{
  id: "p2b-pp-7", level: 2, module: "grammar", topic: "present-perfect",
  stem: "It is the first time I ____ such a beautiful place.",
  options: ["visit", "visited", "have visited", "will visit"],
  answer: 2,
  explanation: "It is the first time + 从句，从句用现在完成时，这是固定句型：第一次做某事。",
  optionNotes: ["错：一般现在时不用于这个句型", "错：It is 开头时从句不用一般过去时", "对：It is the first time + 现在完成时", "错：将来时不用于这个句型"]
},
{
  id: "p2b-pp-8", level: 2, module: "grammar", topic: "present-perfect",
  stem: "He ____ the army for five years.",
  options: ["joined", "has joined", "has been in", "was joining"],
  answer: 2,
  explanation: "for + 一段时间要配能延续的动作；join（参军）是一瞬间的事，不能持续五年，要换成 be in the army（在部队里），用 has been in。",
  optionNotes: ["错：一般过去时不配 for five years 表持续", "错：join 是瞬间动词，不能延续五年", "对：换成延续性的 be in，配 for + 时间段", "错：过去进行时讲不通"]
},

/* ---------------- 过去进行时 past-continuous (3) ---------------- */
{
  id: "p2b-pastc-1", level: 2, module: "grammar", topic: "past-continuous",
  stem: "When I called him, he ____ dinner.",
  options: ["has", "had", "was having", "is having"],
  answer: 2,
  explanation: "我打电话是过去的一个时间点，那时他“正在”吃饭，用过去进行时 was having。",
  optionNotes: ["错：一般现在时和过去的 called 冲突", "错：一般过去时不强调“正在”", "对：过去某一刻正在进行，was + doing", "错：现在进行时和过去时间冲突"]
},
{
  id: "p2b-pastc-2", level: 2, module: "grammar", topic: "past-continuous",
  stem: "While she ____ TV, the phone rang.",
  options: ["watches", "watched", "was watching", "is watching"],
  answer: 2,
  explanation: "while（正当……时候）后面常用进行时；电话铃响时她正在看电视，用过去进行时。",
  optionNotes: ["错：一般现在时和过去的 rang 冲突", "错：while 强调正在进行，一般过去时不合适", "对：while + 过去进行时是常见搭配", "错：现在进行时和过去时间冲突"]
},
{
  id: "p2b-pastc-3", level: 2, module: "grammar", topic: "past-continuous",
  stem: "At eight o'clock last night, I ____ a shower.",
  options: ["was taking", "took", "take", "am taking"],
  answer: 0,
  explanation: "at eight o'clock last night 是过去的具体时间点，说的是那一刻正在洗澡，用过去进行时。",
  optionNotes: ["对：过去某一时刻正在做，was + doing", "错：一般过去时不突出“那一刻正在”", "错：一般现在时和昨晚冲突", "错：现在进行时和昨晚冲突"]
},

/* ---------------- 过去完成时 past-perfect (3) ---------------- */
{
  id: "p2b-pastp-1", level: 2, module: "grammar", topic: "past-perfect",
  stem: "By the end of last year, they ____ the bridge.",
  options: ["built", "have built", "had built", "build"],
  answer: 2,
  explanation: "by + 过去时间（到去年年底为止）是过去完成时的标志，表示“过去的过去”已完成，用 had + 过去分词。",
  optionNotes: ["错：一般过去时不表达“到那时已完成”", "错：现在完成时不和过去时间连用", "对：by + 过去时间配 had done", "错：一般现在时和去年冲突"]
},
{
  id: "p2b-pastp-2", level: 2, module: "grammar", topic: "past-perfect",
  stem: "When we got to the station, the train ____ already ____.",
  options: ["has; left", "had; left", "is; leaving", "did; left"],
  answer: 1,
  explanation: "我们到车站是过去；火车开走发生在这之前，是“过去的过去”，用过去完成时 had left。",
  optionNotes: ["错：现在完成时不能和过去的 got 搭", "对：动作发生在过去动作之前，用 had done", "错：现在进行时和过去时间 got 冲突", "错：did 后面要接动词原形，不能接 left"]
},
{
  id: "p2b-pastp-3", level: 2, module: "grammar", topic: "past-perfect",
  stem: "She said she ____ the film before.",
  options: ["saw", "has seen", "had seen", "sees"],
  answer: 2,
  explanation: "主句 said 是过去时，看电影发生在说话之前，是“过去的过去”，用过去完成时 had seen。",
  optionNotes: ["错：一般过去时分不出比 said 更早", "错：主句是过去时，从句不能用现在完成时", "对：比 said 更早的动作用 had done", "错：一般现在时和 said 冲突"]
},

/* ---------------- used to (2) ---------------- */
{
  id: "p2b-usedto-1", level: 2, module: "grammar", topic: "used-to",
  stem: "He ____ smoke, but now he has given it up.",
  options: ["used to", "is used to", "uses to", "was used to"],
  answer: 0,
  explanation: "used to + 动词原形表示“过去常常（现在不了）”；be used to doing 才是“习惯于”。",
  optionNotes: ["对：used to do = 过去常常做", "错：is used to 后要接 doing，且意思是习惯于", "错：uses to 没有这种形式", "错：was used to 后要接 doing，意思也不对"]
},
{
  id: "p2b-usedto-2", level: 2, module: "grammar", topic: "used-to",
  stem: "She is used to ____ up early in the morning.",
  options: ["get", "gets", "getting", "got"],
  answer: 2,
  explanation: "be used to doing 表示“习惯于做某事”，这里的 to 是介词，后面要接动名词 getting。",
  optionNotes: ["错：这里的 to 是介词，不接动词原形", "错：介词后不能接第三人称单数动词", "对：介词 to 后接 doing", "错：介词后不能接过去式"]
},

/* ---------------- 被动语态 passive (8) ---------------- */
{
  id: "p2b-pass-1", level: 2, module: "grammar", topic: "passive",
  stem: "English ____ in many countries.",
  options: ["speaks", "is spoken", "is speaking", "spoke"],
  answer: 1,
  explanation: "英语是“被说”的，主语是动作的承受者，用被动语态 is spoken。",
  optionNotes: ["错：主动语态，英语不会自己说话", "对：一般现在时被动 = is/are + 过去分词", "错：进行时主动，意思不通", "错：过去时主动，语态和时态都不对"]
},
{
  id: "p2b-pass-2", level: 2, module: "grammar", topic: "passive",
  stem: "The bridge ____ two years ago.",
  options: ["built", "was built", "is built", "has built"],
  answer: 1,
  explanation: "桥是“被建”的，two years ago 表过去，用一般过去时的被动 was built。",
  optionNotes: ["错：缺 be 动词，桥不能自己建", "对：过去被动 = was/were + 过去分词", "错：is built 是现在，和 ago 冲突", "错：has built 是主动，还和 ago 冲突"]
},
{
  id: "p2b-pass-3", level: 2, module: "grammar", topic: "passive",
  stem: "A new hospital ____ in our city next year.",
  options: ["will build", "will be built", "is built", "builds"],
  answer: 1,
  explanation: "医院是“被建”的，next year 表将来，用将来时被动 will be built。",
  optionNotes: ["错：主动语态，缺了 be", "对：将来被动 = will be + 过去分词", "错：一般现在时和 next year 冲突", "错：主动语态且时态不对"]
},
{
  id: "p2b-pass-4", level: 2, module: "grammar", topic: "passive",
  stem: "The problem ____ at the meeting now.",
  options: ["is discussing", "is being discussed", "is discussed", "discusses"],
  answer: 1,
  explanation: "now 表示此刻正在进行，问题是“被讨论”的，用现在进行时被动 is being discussed。",
  optionNotes: ["错：主动进行时，问题不能自己讨论", "对：进行时被动 = is being + 过去分词", "错：一般现在时被动不突出 now 正在进行", "错：主动语态，意思不通"]
},
{
  id: "p2b-pass-5", level: 2, module: "grammar", topic: "passive",
  stem: "The homework must ____ before class.",
  options: ["be finished", "finish", "is finished", "finished"],
  answer: 0,
  explanation: "作业是“被完成”的；情态动词 must 后面接动词原形，被动式就是 must be + 过去分词。",
  optionNotes: ["对：情态动词被动 = must be done", "错：主动语态，作业不能自己完成", "错：must 后不能接 is", "错：must 后要接原形，不能直接接过去分词"]
},
{
  id: "p2b-pass-6", level: 2, module: "grammar", topic: "passive",
  stem: "The window ____ by the naughty boy yesterday.",
  options: ["broke", "was broken", "is broken", "has broken"],
  answer: 1,
  explanation: "by 短语提示被动；yesterday 表过去，用一般过去时被动 was broken。",
  optionNotes: ["错：主动语态，和 by 短语矛盾", "对：过去被动 = was + 过去分词", "错：is broken 是现在，和 yesterday 冲突", "错：主动语态，且和 yesterday 冲突"]
},
{
  id: "p2b-pass-7", level: 2, module: "grammar", topic: "passive",
  stem: "This kind of paper ____ soft.",
  options: ["is felt", "feels", "is feeling", "felt"],
  answer: 1,
  explanation: "feel、look、taste 等感官动词描述事物特性时用主动形式表达被动意思：纸摸起来软 = The paper feels soft。",
  optionNotes: ["错：感官动词表特性不用被动形式", "对：主动形式表被动，feels soft = 摸起来软", "错：表特性不用进行时", "错：说的是一般特性，不用过去时"]
},
{
  id: "p2b-pass-8", level: 2, module: "grammar", topic: "passive",
  stem: "Thousands of trees ____ since 2000.",
  options: ["planted", "were planted", "have been planted", "are planting"],
  answer: 2,
  explanation: "树是“被种”的；since 2000 是现在完成时标志，被动式是 have been + 过去分词。",
  optionNotes: ["错：主动语态还缺 be", "错：一般过去时不和 since 连用", "对：现在完成时被动 = have been done", "错：主动进行时，树不能自己种"]
},

/* ---------------- 非谓语动词 non-finite (6) ---------------- */
{
  id: "p2b-nonf-1", level: 2, module: "grammar", topic: "non-finite",
  stem: "The teacher told us ____ in the river.",
  options: ["not swim", "not to swim", "to not swimming", "don't swim"],
  answer: 1,
  explanation: "tell sb. to do sth. 后接不定式；不定式的否定是把 not 放在 to 前面：not to swim。",
  optionNotes: ["错：缺 to，不定式不完整", "对：不定式否定式 = not to do", "错：to 后面要接原形，不接 doing", "错：don't 是谓语的否定，这里是非谓语"]
},
{
  id: "p2b-nonf-2", level: 2, module: "grammar", topic: "non-finite",
  stem: "I heard her ____ an English song just now.",
  options: ["sing", "to sing", "sang", "sings"],
  answer: 0,
  explanation: "感官动词 hear sb. do sth.，不定式省 to，表示听到了整个过程。",
  optionNotes: ["对：hear sb. do，省 to 的不定式", "错：hear 后面的不定式不带 to", "错：宾语后不能直接接过去式", "错：宾语后不能接第三人称单数形式"]
},
{
  id: "p2b-nonf-3", level: 2, module: "grammar", topic: "non-finite",
  stem: "____ from the top of the hill, the city looks beautiful.",
  options: ["See", "Seeing", "Seen", "To seeing"],
  answer: 2,
  explanation: "城市是“被看”的，分词与主语 the city 是被动关系，用过去分词 Seen（从山顶看去）。",
  optionNotes: ["错：动词原形不能直接作状语", "错：Seeing 是主动，城市不会自己看", "对：被动关系用过去分词", "错：to seeing 结构错误"]
},
{
  id: "p2b-nonf-4", level: 2, module: "grammar", topic: "non-finite",
  stem: "He stopped ____ a rest because he was tired.",
  options: ["have", "to have", "having", "had"],
  answer: 1,
  explanation: "stop to do 是停下来去做另一件事（停下来休息）；stop doing 是停止正在做的事。他累了，是停下来去休息。",
  optionNotes: ["错：stop 后不能直接接动词原形", "对：stop to do = 停下来去做某事", "错：stop having a rest 意思是不再休息，正好相反", "错：stop 后不能接过去式"]
},
{
  id: "p2b-nonf-5", level: 2, module: "grammar", topic: "non-finite",
  stem: "I have a lot of work ____ today.",
  options: ["to do", "doing", "do", "done"],
  answer: 0,
  explanation: "have sth. to do 表示“有事要做”，不定式 to do 作定语修饰 work。",
  optionNotes: ["对：不定式作定语，有活要干", "错：doing 表主动进行，这里表“待做”", "错：动词原形不能作定语", "错：done 表已完成，和“今天要做”矛盾"]
},
{
  id: "p2b-nonf-6", level: 2, module: "grammar", topic: "non-finite",
  stem: "____ the exam, he studied hard every day.",
  options: ["Pass", "Passing", "To pass", "Passed"],
  answer: 2,
  explanation: "为了通过考试（目的），用不定式 To pass 作目的状语。",
  optionNotes: ["错：动词原形不能作状语", "错：Passing 表伴随，不表目的", "对：不定式表目的：为了通过考试", "错：Passed 表被动完成，讲不通"]
},

/* ---------------- 动名词 gerund (3) ---------------- */
{
  id: "p2b-ger-1", level: 2, module: "grammar", topic: "gerund",
  stem: "He suggested ____ to the park this weekend.",
  options: ["go", "to go", "going", "goes"],
  answer: 2,
  explanation: "suggest 后面只能接动名词 doing，不能接 to do，这是高频考点。",
  optionNotes: ["错：suggest 后不接动词原形", "错：suggest 后不接 to do，这是最常见的坑", "对：suggest doing 固定用法", "错：suggest 后不接第三人称单数"]
},
{
  id: "p2b-ger-2", level: 2, module: "grammar", topic: "gerund",
  stem: "We are looking forward to ____ from you.",
  options: ["hear", "hearing", "heard", "be heard"],
  answer: 1,
  explanation: "look forward to 中的 to 是介词，后面接动名词 hearing，表示“盼望收到你的来信”。",
  optionNotes: ["错：这个 to 是介词，不接原形", "对：介词 to + doing", "错：介词后不能接过去分词单独用", "错：不需要被动，是我们主动听到消息"]
},
{
  id: "p2b-ger-3", level: 2, module: "grammar", topic: "gerund",
  stem: "____ is good for your health.",
  options: ["Swim", "Swimming", "To swimming", "Swam"],
  answer: 1,
  explanation: "动名词 Swimming 作主语，表示“游泳（这件事）对健康有好处”。",
  optionNotes: ["错：动词原形不能直接作主语", "对：动名词作主语", "错：to 和 swimming 不能这样连用", "错：过去式不能作主语"]
},

/* ---------------- too...to (3) ---------------- */
{
  id: "p2b-tooto-1", level: 2, module: "grammar", topic: "too-to",
  stem: "The box is too heavy for me ____.",
  options: ["to carry", "carrying", "to carry it", "carry"],
  answer: 0,
  explanation: "too + 形容词 + (for sb.) + to do，表示“太……而不能……”。主语 box 就是 carry 的对象，句尾不能再加 it。",
  optionNotes: ["对：too...to do 固定结构，不重复宾语", "错：too 后面配 to do，不配 doing", "错：box 已是 carry 的对象，加 it 就重复了", "错：缺 to，结构不完整"]
},
{
  id: "p2b-tooto-2", level: 2, module: "grammar", topic: "too-to",
  stem: "He is too young ____ to school.",
  options: ["going", "to go", "go", "goes"],
  answer: 1,
  explanation: "too + 形容词 + to do 表示“太小了，还不能上学”，too 后面固定接不定式。",
  optionNotes: ["错：too...to 结构里不用 doing", "对：too young to go = 太小不能去", "错：缺 to，结构不完整", "错：非谓语位置不能用第三人称单数"]
},
{
  id: "p2b-tooto-3", level: 2, module: "grammar", topic: "too-to",
  stem: "The question is ____ difficult for us to work out; nobody in our class can solve it.",
  options: ["too", "so", "such", "enough"],
  answer: 0,
  explanation: "后半句说“全班没人能解出来”，是“太难而不能”→ too...for sb to do 结构。",
  optionNotes: ["对：too...to = 太……而不能，和后半句“没人能解”呼应", "错：so 要配 that 从句", "错：such 修饰名词，不直接修饰形容词", "错：enough 要放在形容词后面（difficult enough）"]
},

/* ---------------- so...that (3) ---------------- */
{
  id: "p2b-sothat-1", level: 2, module: "grammar", topic: "so-that",
  stem: "He ran ____ fast that I couldn't catch up with him.",
  options: ["so", "too", "very", "such"],
  answer: 0,
  explanation: "后面有 that 从句，用 so...that：跑得如此快，以至于我追不上。so 修饰形容词或副词。",
  optionNotes: ["对：so + 副词 + that 从句", "错：too 配 to do，不配 that 从句", "错：very 不和 that 从句连用", "错：such 修饰名词，不修饰副词 fast"]
},
{
  id: "p2b-sothat-2", level: 2, module: "grammar", topic: "so-that",
  stem: "It was ____ a cold day that we stayed at home.",
  options: ["so", "such", "too", "very"],
  answer: 1,
  explanation: "such + a + 形容词 + 名词 + that：如此冷的一天。such 修饰名词短语（a cold day），so 只修饰形容词、副词。",
  optionNotes: ["错：so 后面直接接形容词，不接 a cold day 这种名词短语", "对：such a cold day that 固定语序", "错：too 不配 that 从句", "错：very 不和 that 从句连用"]
},
{
  id: "p2b-sothat-3", level: 2, module: "grammar", topic: "so-that",
  stem: "She got up early ____ she could catch the first bus.",
  options: ["so that", "in order", "because", "though"],
  answer: 0,
  explanation: "so that + 从句表目的：为了能赶上头班车。从句里常有 can/could。",
  optionNotes: ["对：so that 引导目的状语从句", "错：in order 后要加 to 或 that 才完整", "错：because 表原因，因果颠倒了", "错：though 表让步，意思不通"]
},

/* ---------------- 连词 conjunction (4) ---------------- */
{
  id: "p2b-conj-1", level: 2, module: "grammar", topic: "conjunction",
  stem: "Hurry up, ____ you will miss the train.",
  options: ["and", "or", "but", "so"],
  answer: 1,
  explanation: "祈使句 + or 表示“否则、要不然”：快点，否则你会误了火车。",
  optionNotes: ["错：and 表示“就会”，用于好结果", "对：or = 否则，接坏结果", "错：but 表转折，讲不通", "错：so 表结果，前后逻辑不对"]
},
{
  id: "p2b-conj-2", level: 2, module: "grammar", topic: "conjunction",
  stem: "____ he is over sixty, he still works hard.",
  options: ["Although", "Because", "If", "So"],
  answer: 0,
  explanation: "前后是让步关系：虽然六十多岁了，仍然努力工作。用 Although，且不能再和 but 连用。",
  optionNotes: ["对：Although 表示“虽然”", "错：年过六十不是努力工作的原因", "错：If 表假设，这是事实", "错：So 是并列连词，不能放句首引导从句表让步"]
},
{
  id: "p2b-conj-3", level: 2, module: "grammar", topic: "conjunction",
  stem: "Study hard, ____ you will pass the exam.",
  options: ["or", "and", "but", "while"],
  answer: 1,
  explanation: "祈使句 + and 表示“这样就会”：努力学习，你就会通过考试（好结果用 and）。",
  optionNotes: ["错：or 接坏结果（否则），这里是好结果", "对：and = 那样就会，接好结果", "错：but 表转折，逻辑不通", "错：while 表对比或同时，不合适"]
},
{
  id: "p2b-conj-4", level: 2, module: "grammar", topic: "conjunction",
  stem: "He didn't come to school ____ he was ill.",
  options: ["because", "so", "but", "though"],
  answer: 0,
  explanation: "生病是没来上学的原因，用 because 引导原因状语从句。",
  optionNotes: ["对：because = 因为", "错：so 表结果，位置和逻辑都不对", "错：but 表转折，生病和没来不是转折关系", "错：though 表让步，意思变成“虽然生病”"]
},

/* ---------------- 条件句 conditional (4) ---------------- */
{
  id: "p2b-cond-1", level: 2, module: "grammar", topic: "conditional",
  stem: "If it ____ tomorrow, we will stay at home.",
  options: ["rains", "rain", "will rain", "rained"],
  answer: 0,
  explanation: "if 引导的条件从句用一般现在时表将来（主将从现），it 是第三人称单数，用 rains。",
  optionNotes: ["对：主将从现，第三人称单数加 s", "错：it 后面动词要加 s", "错：if 从句里不用 will", "错：说的是明天，不用过去时"]
},
{
  id: "p2b-cond-2", level: 2, module: "grammar", topic: "conditional",
  stem: "You will fail the exam ____ you study hard.",
  options: ["if", "unless", "when", "because"],
  answer: 1,
  explanation: "unless = if not（除非、如果不）：除非你努力学习，否则会考不及格。",
  optionNotes: ["错：if 变成“如果努力就不及格”，逻辑反了", "对：unless = 如果不……就会……", "错：when 表时间，逻辑不通", "错：because 因果关系反了"]
},
{
  id: "p2b-cond-3", level: 2, module: "grammar", topic: "conditional",
  stem: "If you don't hurry, you ____ late for class.",
  options: ["are", "will be", "were", "be"],
  answer: 1,
  explanation: "if 从句用现在时，主句用将来时（主将从现）：你会迟到，用 will be。",
  optionNotes: ["错：主句要用将来时", "对：主将从现，主句 will be", "错：过去时不合语境", "错：be 不能单独作谓语"]
},
{
  id: "p2b-cond-4", level: 2, module: "grammar", topic: "conditional",
  stem: "We will go for a picnic if the weather ____ fine this Sunday.",
  options: ["is", "will be", "was", "be"],
  answer: 0,
  explanation: "主句已用 will，if 条件从句用一般现在时表将来，用 is。",
  optionNotes: ["对：if 从句用现在时代替将来时", "错：if 从句里不用 will，这是最常见的坑", "错：说的是这周日，不用过去时", "错：be 不能单独作谓语"]
},

/* ---------------- 定语从句 relative-clause (8) ---------------- */
{
  id: "p2b-rel-1", level: 2, module: "grammar", topic: "relative-clause",
  stem: "The man ____ is talking to the teacher is my father.",
  options: ["who", "whom", "which", "whose"],
  answer: 0,
  explanation: "先行词是人（the man），且在从句里作主语（正在说话的人），用 who。",
  optionNotes: ["对：指人作主语用 who", "错：whom 只作宾语，不作主语", "错：which 指物，不指人", "错：whose 表示“谁的”，后面要接名词"]
},
{
  id: "p2b-rel-2", level: 2, module: "grammar", topic: "relative-clause",
  stem: "This is the book ____ I bought yesterday.",
  options: ["who", "which", "whom", "what"],
  answer: 1,
  explanation: "先行词是物（the book），在从句里作 bought 的宾语，用 which（或 that，也可省略）。",
  optionNotes: ["错：who 指人，book 是物", "对：指物用 which", "错：whom 指人作宾语", "错：what 不能引导定语从句"]
},
{
  id: "p2b-rel-3", level: 2, module: "grammar", topic: "relative-clause",
  stem: "The girl ____ father is a doctor studies very hard.",
  options: ["who", "whose", "whom", "which"],
  answer: 1,
  explanation: "空后是名词 father，表示“她的爸爸”，表所属关系用 whose。",
  optionNotes: ["错：who 后面直接接动词，不接名词", "对：whose + 名词，表示“……的”", "错：whom 作宾语，不表所属", "错：which 指物，且不表所属"]
},
{
  id: "p2b-rel-4", level: 3, module: "grammar", topic: "relative-clause",
  stem: "This is the house ____ Lu Xun once lived.",
  options: ["which", "that", "where", "when"],
  answer: 2,
  explanation: "lived 是不及物动词，从句不缺主语宾语，缺的是地点状语（在这里住），用关系副词 where（= in which）。",
  optionNotes: ["错：which 作宾语，但 lived 后面不缺宾语", "错：that 同样需要从句缺主语或宾语", "对：从句缺地点状语，用 where", "错：when 指时间，先行词是房子"]
},
{
  id: "p2b-rel-5", level: 3, module: "grammar", topic: "relative-clause",
  stem: "I will never forget the day ____ we met for the first time.",
  options: ["which", "when", "where", "that"],
  answer: 1,
  explanation: "先行词是时间（the day），从句 we met 不缺主语宾语，缺时间状语，用 when。",
  optionNotes: ["错：which 需要从句缺主语或宾语", "对：先行词是时间且从句缺状语，用 when", "错：where 指地点", "错：that 同样需要从句缺成分"]
},
{
  id: "p2b-rel-6", level: 2, module: "grammar", topic: "relative-clause",
  stem: "Is this the reason ____ he was late for school?",
  options: ["which", "why", "when", "where"],
  answer: 1,
  explanation: "先行词是 the reason（原因），从句结构完整，用关系副词 why。",
  optionNotes: ["错：which 需要从句缺主语或宾语", "对：the reason why 固定搭配", "错：when 指时间", "错：where 指地点"]
},
{
  id: "p2b-rel-7", level: 3, module: "grammar", topic: "relative-clause",
  stem: "All ____ we can do now is wait.",
  options: ["which", "that", "what", "who"],
  answer: 1,
  explanation: "先行词是不定代词 all 时，关系代词只能用 that，不能用 which。",
  optionNotes: ["错：先行词是 all 时不能用 which", "对：all/everything 等作先行词只用 that", "错：what 不能引导定语从句", "错：who 指人，all 这里指事情"]
},
{
  id: "p2b-rel-8", level: 3, module: "grammar", topic: "relative-clause",
  stem: "The teacher, ____ came to see us yesterday, is very kind.",
  options: ["that", "which", "who", "whom"],
  answer: 2,
  explanation: "有逗号是非限制性定语从句，不能用 that；先行词是人且在从句里作主语，用 who。",
  optionNotes: ["错：非限制性定语从句不能用 that", "错：which 指物，先行词是人", "对：非限制性从句中指人作主语用 who", "错：whom 只作宾语，这里缺主语"]
},

/* ---------------- 固定搭配 collocation (10) ---------------- */
{
  id: "p2b-col-1", level: 2, module: "collocation", topic: "collocation",
  stem: "You should give ____ smoking for your health.",
  options: ["in", "up", "out", "away"],
  answer: 1,
  explanation: "give up 表示“戒掉、放弃”，give up smoking = 戒烟。",
  optionNotes: ["错：give in 是让步、屈服", "对：give up = 放弃、戒掉", "错：give out 是分发", "错：give away 是赠送"]
},
{
  id: "p2b-col-2", level: 2, module: "collocation", topic: "collocation",
  stem: "Success depends ____ your hard work.",
  options: ["of", "at", "in", "on"],
  answer: 3,
  explanation: "depend on 是固定搭配，表示“取决于、依靠”。",
  optionNotes: ["错：没有 depend of 的说法", "错：没有 depend at 的说法", "错：没有 depend in 的说法", "对：depend on = 取决于"]
},
{
  id: "p2b-col-3", level: 2, module: "collocation", topic: "collocation",
  stem: "She is interested ____ music.",
  options: ["at", "on", "in", "for"],
  answer: 2,
  explanation: "be interested in 是固定搭配，表示“对……感兴趣”。",
  optionNotes: ["错：interested 不和 at 搭配", "错：interested 不和 on 搭配", "对：be interested in = 对……感兴趣", "错：interested 不和 for 搭配"]
},
{
  id: "p2b-col-4", level: 2, module: "collocation", topic: "collocation",
  stem: "The plane will take ____ in ten minutes.",
  options: ["on", "out", "off", "up"],
  answer: 2,
  explanation: "take off 表示“（飞机）起飞”，也有“脱下”的意思。",
  optionNotes: ["错：take on 是承担、呈现", "错：take out 是拿出", "对：take off = 起飞", "错：take up 是开始从事、占用"]
},
{
  id: "p2b-col-5", level: 2, module: "collocation", topic: "collocation",
  stem: "Please look ____ the new words in the dictionary.",
  options: ["after", "up", "at", "for"],
  answer: 1,
  explanation: "look up 表示“（在词典里）查找”，look up words in the dictionary 是常考搭配。",
  optionNotes: ["错：look after 是照顾", "对：look up = 查（词典）", "错：look at 是看着", "错：look for 是寻找（东西丢了去找）"]
},
{
  id: "p2b-col-6", level: 2, module: "collocation", topic: "collocation",
  stem: "He was ill for a week, so he has to work hard to catch up ____ his classmates.",
  options: ["to", "on", "with", "for"],
  answer: 2,
  explanation: "catch up with 是固定搭配，表示“赶上（某人）”。",
  optionNotes: ["错：catch up 不和 to 搭配", "错：catch up 不和 on sb. 表赶上某人", "对：catch up with sb. = 赶上某人", "错：catch up 不和 for 搭配"]
},
{
  id: "p2b-col-7", level: 2, module: "collocation", topic: "collocation",
  stem: "We should take good care ____ the old.",
  options: ["to", "for", "of", "on"],
  answer: 2,
  explanation: "take care of 是固定搭配，表示“照顾”，take good care of = 好好照顾。",
  optionNotes: ["错：care 不和 to 搭配表照顾", "错：care for 单独可用，但 take care 后面固定接 of", "对：take care of = 照顾", "错：care 不和 on 搭配"]
},
{
  id: "p2b-col-8", level: 2, module: "collocation", topic: "collocation",
  stem: "The meeting was put ____ because of the heavy rain.",
  options: ["on", "off", "up", "away"],
  answer: 1,
  explanation: "put off 表示“推迟”，会议因大雨被推迟了。",
  optionNotes: ["错：put on 是穿上、上演", "对：put off = 推迟", "错：put up 是张贴、搭建", "错：put away 是收起来"]
},
{
  id: "p2b-col-9", level: 2, module: "collocation", topic: "collocation",
  stem: "He is proud ____ his son.",
  options: ["with", "on", "of", "in"],
  answer: 2,
  explanation: "be proud of 是固定搭配，表示“为……感到骄傲”。",
  optionNotes: ["错：proud 不和 with 搭配", "错：proud 不和 on 搭配", "对：be proud of = 为……骄傲", "错：take pride in 才用 in，proud 用 of"]
},
{
  id: "p2b-col-10", level: 2, module: "collocation", topic: "collocation",
  stem: "Don't worry ____ your son. He is safe now.",
  options: ["of", "about", "with", "on"],
  answer: 1,
  explanation: "worry about 是固定搭配，表示“担心……”。",
  optionNotes: ["错：worry 不和 of 搭配", "对：worry about = 担心", "错：worry 不和 with 搭配", "错：worry 不和 on 搭配"]
},

/* ---------------- 近义词辨析 word-choice (4) ---------------- */
{
  id: "p2b-wc-1", level: 2, module: "grammar", topic: "word-choice",
  stem: "The price of the house is too ____ for me.",
  options: ["expensive", "high", "much", "big"],
  answer: 1,
  explanation: "price（价格）只能说 high / low（高低），东西本身才用 expensive / cheap。",
  optionNotes: ["错：expensive 修饰东西，不修饰 price", "对：price 高低用 high / low", "错：much 修饰不可数的量，不修饰 price 的高低", "错：big 不用来形容价格"]
},
{
  id: "p2b-wc-2", level: 2, module: "grammar", topic: "word-choice",
  stem: "Can you ____ me your bike? I'll return it tomorrow.",
  options: ["borrow", "lend", "keep", "take"],
  answer: 1,
  explanation: "lend sb. sth. 是“把东西借给别人”（借出）；borrow 是“借入”，说 borrow sth. from sb.。这里是请对方借出，用 lend。",
  optionNotes: ["错：borrow 是借入，不能说 borrow me", "对：lend me your bike = 把车借给我", "错：keep 是保留，意思不对", "错：take 是拿走，不是借"]
},
{
  id: "p2b-wc-3", level: 2, module: "grammar", topic: "word-choice",
  stem: "I ____ 100 yuan on this pair of shoes.",
  options: ["spent", "cost", "took", "paid"],
  answer: 0,
  explanation: "人 + spend + 钱 + on + 物；cost 的主语是物，take 多指花时间，pay 后面接 for。",
  optionNotes: ["对：sb. spend money on sth.", "错：cost 的主语是物（The shoes cost me...）", "错：It takes sb. time 花的是时间", "错：pay 要说 paid 100 yuan for the shoes"]
},
{
  id: "p2b-wc-4", level: 2, module: "grammar", topic: "word-choice",
  stem: "____ English, he also speaks French.",
  options: ["Except", "Besides", "Beside", "But"],
  answer: 1,
  explanation: "besides = 除了……之外（还有），是加法；except = 除了……之外（不包括），是减法。句中有 also（还会法语），是加法，用 Besides。",
  optionNotes: ["错：except 把英语排除在外，和 also 矛盾", "对：besides = 除了……还……", "错：beside 是“在旁边”，少了 s 意思完全不同", "错：but 表示“除了”时也含排除义，不合语境"]
},

/* ---------------- 虚拟语气 subjunctive (6) ---------------- */
{
  id: "p2b-subj-1", level: 3, module: "grammar", topic: "subjunctive",
  stem: "If I ____ you, I would take the job.",
  options: ["am", "was", "were", "be"],
  answer: 2,
  explanation: "对现在的虚拟：if 从句用过去式，be 动词一律用 were（哪怕主语是 I）。",
  optionNotes: ["错：虚拟语气不用现在时 am", "错：虚拟语气中 be 统一用 were，不用 was", "对：If I were you 是经典虚拟句", "错：be 不能单独作谓语"]
},
{
  id: "p2b-subj-2", level: 3, module: "grammar", topic: "subjunctive",
  stem: "If he had worked harder, he ____ the exam last year.",
  options: ["would pass", "would have passed", "passed", "will pass"],
  answer: 1,
  explanation: "对过去的虚拟：从句 had done，主句 would have done。去年没努力，所以没通过，是对过去事实的假设。",
  optionNotes: ["错：would pass 是对现在或将来的虚拟", "对：对过去虚拟，主句用 would have done", "错：passed 是真实过去，不是虚拟", "错：will pass 是真实将来，和 last year 矛盾"]
},
{
  id: "p2b-subj-3", level: 3, module: "grammar", topic: "subjunctive",
  stem: "The teacher suggested that we ____ more attention to grammar.",
  options: ["paid", "pay", "will pay", "pays"],
  answer: 1,
  explanation: "suggest（建议）后的 that 从句用虚拟语气：should + 动词原形，should 可省略，所以填原形 pay。",
  optionNotes: ["错：建议类从句不用过去式", "对：(should) pay，省略 should 后用原形", "错：建议类从句不用 will", "错：虚拟语气用原形，不加 s"]
},
{
  id: "p2b-subj-4", level: 3, module: "grammar", topic: "subjunctive",
  stem: "I wish I ____ fly like a bird.",
  options: ["can", "could", "will", "am able to"],
  answer: 1,
  explanation: "wish 后的从句表示与现在事实相反的愿望，用过去式：could fly（可惜飞不了）。",
  optionNotes: ["错：wish 从句不用现在时 can", "对：与现在事实相反用过去式 could", "错：wish 从句不用 will 表现在的愿望", "错：am 是现在时，不用于虚拟"]
},
{
  id: "p2b-subj-5", level: 3, module: "grammar", topic: "subjunctive",
  stem: "Without your help, I ____ the work on time yesterday.",
  options: ["couldn't finish", "couldn't have finished", "can't finish", "didn't finish"],
  answer: 1,
  explanation: "without 短语暗含虚拟条件（要是没有你的帮助）；说的是昨天（过去），对过去虚拟用 could/would have done。",
  optionNotes: ["错：couldn't finish 是对现在虚拟，和 yesterday 不符", "对：对过去虚拟用 couldn't have done", "错：can't 是真实现在时", "错：didn't finish 是真实过去，但事实是完成了"]
},
{
  id: "p2b-subj-6", level: 3, module: "grammar", topic: "subjunctive",
  stem: "It's high time we ____ home.",
  options: ["go", "went", "will go", "have gone"],
  answer: 1,
  explanation: "It's (high) time + 从句，从句用过去式表虚拟：早该回家了。这是固定句型。",
  optionNotes: ["错：这个句型不用动词原形", "对：It's high time + 过去式", "错：不用将来时", "错：不用现在完成时"]
},

/* ---------------- 倒装 inversion (3) ---------------- */
{
  id: "p2b-inv-1", level: 3, module: "grammar", topic: "inversion",
  stem: "Never ____ such a beautiful place before.",
  options: ["I have seen", "have I seen", "I saw", "did I saw"],
  answer: 1,
  explanation: "否定词 Never 放句首，句子要部分倒装：把助动词 have 提到主语 I 前面。",
  optionNotes: ["错：Never 开头必须倒装，不能正常语序", "对：助动词提前：Never have I seen", "错：没有倒装", "错：did 后面要接原形 see，saw 是重复错误"]
},
{
  id: "p2b-inv-2", level: 3, module: "grammar", topic: "inversion",
  stem: "Only in this way ____ learn English well.",
  options: ["you can", "can you", "you will", "will you can"],
  answer: 1,
  explanation: "Only + 状语放句首，主句部分倒装：把情态动词 can 提到主语前，can you learn。",
  optionNotes: ["错：Only 开头必须倒装", "对：情态动词提前：can you", "错：没有倒装", "错：will 和 can 两个情态动词不能连用"]
},
{
  id: "p2b-inv-3", level: 3, module: "grammar", topic: "inversion",
  stem: "Hardly ____ home when it began to rain.",
  options: ["I got", "did I get", "had I got", "I had got"],
  answer: 2,
  explanation: "Hardly ... when ...（一……就……）：Hardly 放句首要倒装，且从句 began 是过去时，主句动作更早，用过去完成时：Hardly had I got home when...",
  optionNotes: ["错：Hardly 开头必须倒装，且时态不对", "错：倒装对了但时态错，要用过去完成时", "对：had 提前 + 过去完成时", "错：时态对但没有倒装"]
},

/* ---------------- 强调句 emphasis (2) ---------------- */
{
  id: "p2b-emp-1", level: 3, module: "grammar", topic: "emphasis",
  stem: "It was in the park ____ I met my old friend yesterday.",
  options: ["which", "that", "where", "when"],
  answer: 1,
  explanation: "强调句型 It is/was + 被强调部分 + that ...，即使强调地点，也用 that，不用 where。",
  optionNotes: ["错：强调句不用 which", "对：强调句一律用 that 连接", "错：强调地点也不能换成 where，这是最大的坑", "错：强调时间也不能换成 when"]
},
{
  id: "p2b-emp-2", level: 3, module: "grammar", topic: "emphasis",
  stem: "It is Tom ____ broke the window.",
  options: ["who", "which", "whom", "whose"],
  answer: 0,
  explanation: "强调句强调人时可以用 who（或 that）：是 Tom 打破了窗户。",
  optionNotes: ["对：强调人可用 who", "错：which 不用于强调句", "错：whom 作宾语，这里被强调的 Tom 是主语", "错：whose 表所属，不用于强调句"]
},

/* ---------------- 关联结构 correlative (1) ---------------- */
{
  id: "p2b-corr-1", level: 3, module: "grammar", topic: "correlative",
  stem: "Neither he nor I ____ interested in the film.",
  options: ["am", "is", "are", "be"],
  answer: 0,
  explanation: "neither...nor... 连接两个主语时，动词和靠近的那个主语一致（就近原则），靠近的是 I，所以用 am。",
  optionNotes: ["对：就近原则，跟着 I 用 am", "错：is 跟的是 he，但 he 离动词远", "错：are 和两个主语都不匹配", "错：be 不能单独作谓语"]
},

/* ---------------- 名词性从句 noun-clause (4) ---------------- */
{
  id: "p2b-nc-1", level: 2, module: "grammar", topic: "noun-clause",
  stem: "I don't know ____ he will come tomorrow.",
  options: ["that", "if", "what", "which"],
  answer: 1,
  explanation: "don't know 后表示“不知道是否……”，用 if/whether 引导宾语从句。",
  optionNotes: ["错：that 表示确定的事，和“不知道”不搭", "对：if = 是否", "错：what 要在从句里作成分，从句不缺成分", "错：which 表示选择哪个，不合语境"]
},
{
  id: "p2b-nc-2", level: 3, module: "grammar", topic: "noun-clause",
  stem: "____ he said at the meeting is very important.",
  options: ["What", "That", "Which", "Who"],
  answer: 0,
  explanation: "主语从句里 said 缺宾语（他说的话），既引导从句又作成分，用 What。",
  optionNotes: ["对：What = 他所说的话，作 said 的宾语", "错：That 只起连接作用，但从句缺宾语", "错：Which 表选择，不合语境", "错：Who 指人作主语，但从句已有主语 he"]
},
{
  id: "p2b-nc-3", level: 3, module: "grammar", topic: "noun-clause",
  stem: "The problem is ____ we can get so much money.",
  options: ["that", "how", "what", "which"],
  answer: 1,
  explanation: "表语从句 we can get so much money 主谓宾齐全，缺的是方式（怎么弄到这么多钱），用 how。",
  optionNotes: ["错：that 只连接，但句意需要“怎么”", "对：how = 如何弄到钱，补方式", "错：what 要作成分，从句不缺主宾", "错：which 表选择，不合语境"]
},
{
  id: "p2b-nc-4", level: 2, module: "grammar", topic: "noun-clause",
  stem: "Do you know ____?",
  options: ["where does he live", "where he lives", "where did he live", "where he live"],
  answer: 1,
  explanation: "宾语从句要用陈述语序（主语在前，不倒装），he 是第三人称单数，动词加 s：where he lives。",
  optionNotes: ["错：从句里不能用疑问语序 does he", "对：陈述语序 + 三单加 s", "错：从句里不能用疑问语序 did he", "错：语序对了，但 he 后动词要加 s"]
},

/* ---------------- 语音题 phonetics (8) ---------------- */
{
  id: "p2b-ph-1", level: 1, module: "phonetics", topic: "phonetics-a",
  stem: "选出划线部分读音与其它三个不同的一项：（划线字母 a）",
  options: ["map", "cake", "name", "face"],
  answer: 0,
  explanation: "map 的 a 读短音 /æ/；cake、name、face 都是“辅音+a+辅音+e”结构，a 读字母本音 /eɪ/。",
  optionNotes: ["对：a 读 /æ/，与其它三个不同", "错：a 读 /eɪ/", "错：a 读 /eɪ/", "错：a 读 /eɪ/"]
},
{
  id: "p2b-ph-2", level: 1, module: "phonetics", topic: "phonetics-ea",
  stem: "选出划线部分读音与其它三个不同的一项：（划线字母 ea）",
  options: ["bread", "tea", "head", "ready"],
  answer: 1,
  explanation: "tea 的 ea 读长音 /iː/；bread、head、ready 的 ea 都读短音 /e/。",
  optionNotes: ["错：ea 读 /e/", "对：ea 读 /iː/，与其它三个不同", "错：ea 读 /e/", "错：ea 读 /e/"]
},
{
  id: "p2b-ph-3", level: 1, module: "phonetics", topic: "phonetics-oo",
  stem: "选出划线部分读音与其它三个不同的一项：（划线字母 oo）",
  options: ["food", "moon", "book", "school"],
  answer: 2,
  explanation: "book 的 oo 读短音 /ʊ/；food、moon、school 的 oo 都读长音 /uː/。",
  optionNotes: ["错：oo 读 /uː/", "错：oo 读 /uː/", "对：oo 读 /ʊ/，与其它三个不同", "错：oo 读 /uː/"]
},
{
  id: "p2b-ph-4", level: 2, module: "phonetics", topic: "phonetics-i",
  stem: "选出划线部分读音与其它三个不同的一项：（划线字母 i）",
  options: ["bike", "time", "nice", "city"],
  answer: 3,
  explanation: "city 的 i 读短音 /ɪ/；bike、time、nice 都是“i+辅音+e”结构，i 读字母本音 /aɪ/。",
  optionNotes: ["错：i 读 /aɪ/", "错：i 读 /aɪ/", "错：i 读 /aɪ/", "对：i 读 /ɪ/，与其它三个不同"]
},
{
  id: "p2b-ph-5", level: 2, module: "phonetics", topic: "phonetics-u",
  stem: "选出划线部分读音与其它三个不同的一项：（划线字母 u）",
  options: ["put", "cup", "bus", "sun"],
  answer: 0,
  explanation: "put 的 u 读 /ʊ/（是个特殊词）；cup、bus、sun 的 u 都读 /ʌ/。",
  optionNotes: ["对：u 读 /ʊ/，与其它三个不同", "错：u 读 /ʌ/", "错：u 读 /ʌ/", "错：u 读 /ʌ/"]
},
{
  id: "p2b-ph-6", level: 2, module: "phonetics", topic: "phonetics-g",
  stem: "选出划线部分读音与其它三个不同的一项：（划线字母 g）",
  options: ["big", "orange", "get", "go"],
  answer: 1,
  explanation: "orange 的 g 读 /dʒ/（g 在 e 前常读软音）；big、get、go 的 g 都读硬音 /g/。",
  optionNotes: ["错：g 读 /g/", "对：g 读 /dʒ/，与其它三个不同", "错：g 读 /g/", "错：g 读 /g/"]
},
{
  id: "p2b-ph-7", level: 2, module: "phonetics", topic: "phonetics-ow",
  stem: "选出划线部分读音与其它三个不同的一项：（划线字母 ow）",
  options: ["now", "cow", "snow", "flower"],
  answer: 2,
  explanation: "snow 的 ow 读 /əʊ/；now、cow、flower 的 ow 都读 /aʊ/。",
  optionNotes: ["错：ow 读 /aʊ/", "错：ow 读 /aʊ/", "对：ow 读 /əʊ/，与其它三个不同", "错：ow 读 /aʊ/"]
},
{
  id: "p2b-ph-8", level: 2, module: "phonetics", topic: "phonetics-y",
  stem: "选出划线部分读音与其它三个不同的一项：（划线字母 y）",
  options: ["fly", "sky", "why", "happy"],
  answer: 3,
  explanation: "happy 的 y 在词尾非重读，读 /i/；fly、sky、why 是单音节词，y 读 /aɪ/。",
  optionNotes: ["错：y 读 /aɪ/", "错：y 读 /aɪ/", "错：y 读 /aɪ/", "对：y 读 /i/，与其它三个不同"]
},

/* ---------------- 补全对话 conversation (10) ---------------- */
{
  id: "p2b-conv-1", level: 1, module: "conversation", topic: "conversation",
  stem: "—Thank you for your help.  —____",
  options: ["No, thanks.", "You're welcome.", "It doesn't matter.", "That's right."],
  answer: 1,
  explanation: "别人道谢，回答“不客气”：You're welcome. / My pleasure. / Not at all.",
  optionNotes: ["错：No, thanks. 是拒绝别人的好意", "对：You're welcome. = 不客气", "错：It doesn't matter. 是回应道歉的", "错：That's right. 是“说得对”"]
},
{
  id: "p2b-conv-2", level: 1, module: "conversation", topic: "conversation",
  stem: "—I'm sorry I'm late.  —____",
  options: ["Never mind.", "You're welcome.", "Me too.", "Thank you."],
  answer: 0,
  explanation: "别人道歉，回答“没关系”：Never mind. / It doesn't matter. / That's all right.",
  optionNotes: ["对：Never mind. = 没关系", "错：You're welcome. 是回应道谢的", "错：Me too. 变成“我也迟到了”，答非所问", "错：道歉不用谢谢来回应"]
},
{
  id: "p2b-conv-3", level: 2, module: "conversation", topic: "conversation",
  stem: "—Would you like to come to my birthday party this Saturday?  —____",
  options: ["No, I don't like.", "It doesn't matter.", "I'd love to, but I have to work.", "You are welcome."],
  answer: 2,
  explanation: "婉拒邀请的套路：先说 I'd love to（我很想去），再用 but 说明原因，礼貌得体。",
  optionNotes: ["错：No, I don't like. 生硬无礼且语法不完整", "错：It doesn't matter. 是回应道歉的", "对：先表感谢再说明原因，礼貌拒绝", "错：You are welcome. 是回应道谢的"]
},
{
  id: "p2b-conv-4", level: 2, module: "conversation", topic: "conversation",
  stem: "—Hello! May I speak to Mr. Smith?  —____",
  options: ["I am Mr. Smith.", "This is Mr. Smith speaking.", "Mr. Smith is me.", "You can speak."],
  answer: 1,
  explanation: "打电话表明“我就是”要说：This is ... speaking.，不能说 I am ...，这是电话用语的固定套路。",
  optionNotes: ["错：电话里不说 I am ...", "对：电话用语 This is ... speaking.", "错：电话里没有这种说法", "错：答非所问，也不礼貌"]
},
{
  id: "p2b-conv-5", level: 2, module: "conversation", topic: "conversation",
  stem: "—Excuse me, could you tell me the way to the bank?  —____",
  options: ["No, I couldn't.", "Don't ask me.", "It's a good bank.", "Go along this street and turn left."],
  answer: 3,
  explanation: "问路的标准回答是指路：沿这条街走，然后左转。",
  optionNotes: ["错：No, I couldn't. 生硬无礼", "错：Don't ask me. 很不礼貌", "错：答非所问，人家问的是路", "对：直接指路，最合适的回答"]
},
{
  id: "p2b-conv-6", level: 1, module: "conversation", topic: "conversation",
  stem: "—How do you do?  —____",
  options: ["Fine, thank you.", "How do you do?", "I'm fine.", "How are you?"],
  answer: 1,
  explanation: "初次见面说 How do you do?，回答也是 How do you do?，这是固定套路，不是真的在问身体。",
  optionNotes: ["错：Fine, thank you. 是回答 How are you? 的", "对：原句回应 How do you do?", "错：I'm fine. 是回答 How are you? 的", "错：How are you? 是熟人打招呼用的"]
},
{
  id: "p2b-conv-7", level: 2, module: "conversation", topic: "conversation",
  stem: "—Would you mind opening the window?  —____ It's really hot in here.",
  options: ["Yes, please.", "You are welcome.", "Not at all.", "No way."],
  answer: 2,
  explanation: "Would you mind...? 问“你介意吗”，同意对方就要说“不介意”：Not at all. / Of course not.，后句“确实很热”说明是同意开窗。",
  optionNotes: ["错：Yes 表示“我介意”，是拒绝，和后句矛盾", "错：You are welcome. 是回应道谢的", "对：Not at all. = 不介意，请开吧", "错：No way. 是强硬拒绝，和后句矛盾"]
},
{
  id: "p2b-conv-8", level: 1, module: "conversation", topic: "conversation",
  stem: "—Help yourself to some fish.  —____",
  options: ["Thank you.", "No, I won't.", "Sorry, I can't.", "Yes, I help."],
  answer: 0,
  explanation: "Help yourself to... 是请对方随便吃，接受好意就说 Thank you.。",
  optionNotes: ["对：接受招待说谢谢", "错：No, I won't. 生硬无礼", "错：Sorry, I can't. 答非所问", "错：Yes, I help. 语法和意思都不通"]
},
{
  id: "p2b-conv-9", level: 2, module: "conversation", topic: "conversation",
  stem: "—Can I help you?  —____ I'm looking for a sweater for my son.",
  options: ["No, I can't.", "Yes, please.", "Sorry, you can't.", "It's very kind."],
  answer: 1,
  explanation: "店员问“需要帮忙吗”，需要帮助就说 Yes, please.，然后说明来意。",
  optionNotes: ["错：No, I can't. 答非所问，问的不是你能不能", "对：Yes, please. 接受帮助", "错：Sorry, you can't. 无礼且不合逻辑", "错：It's very kind. 表达不完整也答非所问"]
},
{
  id: "p2b-conv-10", level: 1, module: "conversation", topic: "conversation",
  stem: "—Have a good trip!  —____",
  options: ["You go too.", "No, I won't.", "It doesn't matter.", "Thank you."],
  answer: 3,
  explanation: "别人祝你旅途愉快，回答 Thank you. 表示感谢即可。",
  optionNotes: ["错：You go too. 意思是“你也去”，答非所问", "错：No, I won't. 拒绝祝福，无礼", "错：It doesn't matter. 是回应道歉的", "对：接受祝福说谢谢"]
}

]);
