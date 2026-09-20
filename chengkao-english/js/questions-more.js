/* ============================================================================
 * questions-more.js  ——  扩充题库（阶梯式：level 1 入门 / 2 进阶 / 3 冲刺）
 * ----------------------------------------------------------------------------
 * 这里的题会自动【接到】主题库 window.QUESTIONS 后面。
 * 加了一个字段 level：
 *   1 = 入门（最简单，先做，建立信心）
 *   2 = 进阶（核心考点，中等）
 *   3 = 冲刺（真题难度 / 超出模拟卷的拓展点）
 * App 会按 level 从低到高安排新题，不会一上来全是难题。
 * 你自己加题时，照着写 level: 1/2/3 即可；不写默认按进阶(2)处理。
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([

/* ========================================================================== */
/*                      LEVEL 1 · 入门（先把地基打牢）                          */
/* ========================================================================== */

/* ---- 语音 入门 ---- */
{
  id: "b-pho-01", level: 1, module: "phonetics", topic: "phonetics-a",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["n__a__me", "c__a__t", "f__a__ce", "g__a__me"],
  answer: 1,
  explanation: "元音字母 a 在“辅音+e”结构里常读字母本音 /eɪ/（诶）：name/face/game。只有 cat 读短音 /æ/。",
  optionNotes: ["错：name 读 /eɪ/", "对：cat 读 /æ/，不同 → 选它", "错：face 读 /eɪ/", "错：game 读 /eɪ/"]
},
{
  id: "b-pho-02", level: 1, module: "phonetics", topic: "phonetics-ea",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["s__ea__", "gr__ee__n", "br__ea__d", "m__ee__t"],
  answer: 2,
  explanation: "ea/ee 常读长音 /iː/（衣）：sea/green/meet。但 bread 里 ea 读短音 /e/（诶短）。",
  optionNotes: ["错：sea 读 /iː/", "错：green 读 /iː/", "对：bread 读 /e/，不同 → 选它", "错：meet 读 /iː/"]
},
{
  id: "b-pho-03", level: 1, module: "phonetics", topic: "phonetics-i",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["b__i__g", "s__i__x", "n__i__ce", "s__i__t"],
  answer: 2,
  explanation: "字母 i 在“辅音+e”结构里读 /aɪ/（爱）：nice。其它是短音 /ɪ/（衣短）：big/six/sit。",
  optionNotes: ["错：big 读 /ɪ/", "错：six 读 /ɪ/", "对：nice 读 /aɪ/，不同 → 选它", "错：sit 读 /ɪ/"]
},
{
  id: "b-pho-04", level: 1, module: "phonetics", topic: "phonetics-oo",
  stem: "选出划线部分读音与其它三个不同的一项：",
  options: ["b__oo__k", "g__oo__d", "f__oo__d", "l__oo__k"],
  answer: 2,
  explanation: "oo 有长短两读：book/good/look 读短音 /ʊ/，food 读长音 /uː/（乌）。",
  optionNotes: ["错：book 读 /ʊ/", "错：good 读 /ʊ/", "对：food 读 /uː/，不同 → 选它", "错：look 读 /ʊ/"]
},

/* ---- 语法 入门 ---- */
{
  id: "b-g-01", level: 1, module: "grammar", topic: "be-verb",
  stem: "I ____ a student.",
  options: ["am", "is", "are", "be"],
  answer: 0,
  explanation: "be 动词跟主语配对：I 用 am，he/she/it 用 is，you/we/they 用 are。主语是 I，所以用 am。",
  optionNotes: ["对：I 配 am", "错：is 配 he/she/it", "错：are 配 you/we/they", "错：be 是原形，不能直接作谓语"]
},
{
  id: "b-g-02", level: 1, module: "grammar", topic: "plural",
  stem: "There are three ____ on the desk.",
  options: ["book", "books", "a book", "the book"],
  answer: 1,
  explanation: "three（三）后面名词要用复数。book 的复数是 books。",
  optionNotes: ["错：book 是单数，前面有 three 要用复数", "对：three books，名词用复数", "错：a book 是“一本”，和 three 矛盾", "错：the book 是单数"]
},
{
  id: "b-g-03", level: 1, module: "grammar", topic: "present-simple",
  stem: "She ____ to school every day.",
  options: ["go", "goes", "going", "went"],
  answer: 1,
  explanation: "every day（每天）说明是一般现在时。主语 she 是第三人称单数，动词加 es → goes。",
  optionNotes: ["错：go 没加 s，主语是 she", "对：she goes，第三人称单数 + es", "错：going 不能单独作谓语", "错：went 是过去式，every day 用现在时"]
},
{
  id: "b-g-04", level: 1, module: "grammar", topic: "article",
  stem: "I saw ____ elephant at the zoo.",
  options: ["a", "an", "the", "/"],
  answer: 1,
  explanation: "单数名词第一次提到用 a/an；后面单词以元音音素开头(elephant 的 e)用 an。",
  optionNotes: ["错：a 用在辅音音素开头的词前", "对：elephant 以元音开头 → an", "错：the 表示特指，这里是第一次提到", "错：单数可数名词前不能不加冠词"]
},
{
  id: "b-g-05", level: 1, module: "grammar", topic: "pronoun",
  stem: "This is my sister. ____ is a nurse.",
  options: ["He", "She", "It", "They"],
  answer: 1,
  explanation: "sister（姐妹）是女性，用 she 代替。",
  optionNotes: ["错：He 代替男性", "对：sister 是女性 → She", "错：It 代替物或动物", "错：They 是复数“他们”"]
},
{
  id: "b-g-06", level: 1, module: "grammar", topic: "demonstrative",
  stem: "____ apples are very sweet.",
  options: ["This", "These", "That", "It"],
  answer: 1,
  explanation: "apples 是复数。this/that 修饰单数，these/those 修饰复数。所以用 These。",
  optionNotes: ["错：This 修饰单数", "对：These 修饰复数 apples", "错：That 修饰单数", "错：It 是单数代词，不能修饰名词"]
},
{
  id: "b-g-07", level: 1, module: "grammar", topic: "preposition-time",
  stem: "My birthday is ____ May.",
  options: ["in", "on", "at", "to"],
  answer: 0,
  explanation: "时间介词口诀：大用 in（月/年/季节），中用 on（具体某天），小用 at（几点）。月份 May 用 in。",
  optionNotes: ["对：月份用 in → in May", "错：on 用于具体某天(on Monday)", "错：at 用于时刻(at six)", "错：to 不表示“在某月”"]
},
{
  id: "b-g-08", level: 1, module: "grammar", topic: "preposition-time",
  stem: "The class begins ____ 8 o'clock.",
  options: ["in", "on", "at", "for"],
  answer: 2,
  explanation: "具体时刻（几点钟）用 at：at 8 o'clock。",
  optionNotes: ["错：in 用于月/年/季节", "错：on 用于某一天", "对：时刻用 at → at 8 o'clock", "错：for 表示“持续多久”"]
},
{
  id: "b-g-09", level: 1, module: "grammar", topic: "have-has",
  stem: "He ____ a new bike.",
  options: ["have", "has", "having", "haved"],
  answer: 1,
  explanation: "主语 he 是第三人称单数，have 要变 has。",
  optionNotes: ["错：have 用于 I/you/we/they", "对：he 用 has", "错：having 不能单独作谓语", "错：haved 不是英语单词（have 过去式是 had）"]
},
{
  id: "b-g-10", level: 1, module: "grammar", topic: "present-continuous",
  stem: "Look! The baby ____ now.",
  options: ["sleep", "sleeps", "is sleeping", "slept"],
  answer: 2,
  explanation: "Look! 和 now 表示“此刻正在发生”，用现在进行时：am/is/are + 动词ing。主语 the baby 用 is → is sleeping。",
  optionNotes: ["错：sleep 是原形", "错：sleeps 是一般现在时", "对：现在正在进行 → is sleeping", "错：slept 是过去式"]
},
{
  id: "b-g-11", level: 1, module: "grammar", topic: "modal-can",
  stem: "Birds ____ fly in the sky.",
  options: ["can", "cans", "can to", "are can"],
  answer: 0,
  explanation: "情态动词 can（能、会）后面直接跟动词原形，本身不加 s、不加 to。",
  optionNotes: ["对：can + 动词原形 → can fly", "错：情态动词不加 s", "错：can 后面不加 to", "错：can 不和 be 动词连用"]
},
{
  id: "b-g-12", level: 1, module: "grammar", topic: "there-be",
  stem: "____ a cat under the chair.",
  options: ["There is", "There are", "It is", "Have"],
  answer: 0,
  explanation: "表示“某处有某物”用 There be。a cat 是单数，用 There is。",
  optionNotes: ["对：单数 a cat → There is", "错：There are 后面接复数", "错：It is 是“它是”，不表示“有”", "错：表示“有”不用 Have 开头这样说"]
},
{
  id: "b-g-13", level: 1, module: "grammar", topic: "possessive",
  stem: "This is ____ book. Please give it back to me.",
  options: ["I", "me", "my", "mine"],
  answer: 2,
  explanation: "名词(book)前面表示“我的”用形容词性物主代词 my。",
  optionNotes: ["错：I 是主格“我”", "错：me 是宾格“我”", "对：my + 名词 → my book", "错：mine 是名词性物主代词，后面不再跟名词"]
},
{
  id: "b-g-14", level: 1, module: "grammar", topic: "gerund",
  stem: "I like ____ football with my friends.",
  options: ["play", "plays", "playing", "played"],
  answer: 2,
  explanation: "like doing sth = 喜欢做某事，后面用动词ing。（like to do 也对，但这里选 playing）",
  optionNotes: ["错：play 是原形，like 后不直接跟原形", "错：plays 是第三人称单数形式", "对：like doing → playing", "错：played 是过去式/过去分词"]
},
{
  id: "b-g-15", level: 1, module: "grammar", topic: "past-be",
  stem: "Yesterday I ____ at home all day.",
  options: ["am", "is", "was", "were"],
  answer: 2,
  explanation: "Yesterday（昨天）是过去。be 动词的过去式：I/he/she/it 用 was，you/we/they 用 were。主语 I → was。",
  optionNotes: ["错：am 是现在时", "错：is 是现在时", "对：I 的过去 be 用 was", "错：were 用于 you/we/they"]
},
{
  id: "b-g-16", level: 1, module: "grammar", topic: "comparative",
  stem: "Tom is ____ than Jack.",
  options: ["tall", "taller", "tallest", "more tall"],
  answer: 1,
  explanation: "看到 than（比）就是比较级。短单词 tall 的比较级直接加 er → taller。",
  optionNotes: ["错：tall 是原级，没体现“比”", "对：than 前用比较级 → taller", "错：tallest 是最高级(用于三者以上)", "错：短单词不用 more，直接加 er"]
},
{
  id: "b-g-17", level: 1, module: "grammar", topic: "question-word",
  stem: "____ books do you have? — I have five.",
  options: ["How much", "How many", "How old", "How far"],
  answer: 1,
  explanation: "books 是可数名词复数，问“多少”用 How many。",
  optionNotes: ["错：How much 问不可数(钱、水)", "对：可数名词复数用 How many", "错：How old 问年龄", "错：How far 问距离"]
},
{
  id: "b-g-18", level: 1, module: "grammar", topic: "question-word",
  stem: "____ is your name? — My name is Ann.",
  options: ["What", "Who", "Where", "How"],
  answer: 0,
  explanation: "问“名字是什么”用 What。",
  optionNotes: ["对：问名字用 What is your name", "错：Who 问“谁”", "错：Where 问“哪里”", "错：How 问“怎么样”"]
},
{
  id: "b-g-19", level: 1, module: "grammar", topic: "some-any",
  stem: "I don't have ____ money with me now.",
  options: ["some", "any", "a", "many"],
  answer: 1,
  explanation: "some 一般用于肯定句，any 用于否定句和疑问句。这里是否定句(don't)，用 any。",
  optionNotes: ["错：some 多用于肯定句", "对：否定句用 any", "错：a 用于单数可数名词", "错：many 修饰可数名词，money 不可数"]
},
{
  id: "b-g-20", level: 1, module: "grammar", topic: "object-pronoun",
  stem: "I can't do it alone. Please help ____.",
  options: ["I", "me", "my", "mine"],
  answer: 1,
  explanation: "help（帮助）后面跟宾语，用宾格 me。",
  optionNotes: ["错：I 是主格，放动词前作主语", "对：动词后作宾语用宾格 me", "错：my 后面要跟名词", "错：mine 是“我的东西”"]
},
{
  id: "b-g-21", level: 1, module: "grammar", topic: "future-will",
  stem: "Don't worry. I ____ call you tomorrow.",
  options: ["will", "am", "was", "do"],
  answer: 0,
  explanation: "tomorrow（明天）表示将来，用 will + 动词原形。",
  optionNotes: ["对：将来用 will call", "错：am 后不直接跟动词原形", "错：was 是过去", "错：do 不表将来"]
},
{
  id: "b-g-22", level: 1, module: "grammar", topic: "conjunction",
  stem: "She is poor ____ honest.",
  options: ["but", "and", "or", "so"],
  answer: 0,
  explanation: "poor（穷）和 honest（诚实）意思上有转折（虽然穷但诚实），用 but。",
  optionNotes: ["对：前后转折用 but（虽穷但诚实）", "错：and 表并列，语气不对", "错：or 表选择", "错：so 表结果"]
},
{
  id: "b-g-23", level: 1, module: "grammar", topic: "much-many",
  stem: "There isn't ____ water in the bottle.",
  options: ["many", "much", "a few", "few"],
  answer: 1,
  explanation: "water（水）不可数，修饰“多”用 much；many 修饰可数名词。",
  optionNotes: ["错：many 修饰可数名词", "对：不可数名词用 much", "错：a few 修饰可数名词", "错：few 修饰可数名词"]
},
{
  id: "b-g-24", level: 1, module: "grammar", topic: "imperative",
  stem: "____ quiet, please. The baby is sleeping.",
  options: ["Be", "Are", "Being", "Is"],
  answer: 0,
  explanation: "祈使句（叫别人做某事）用动词原形开头。be 动词的原形是 Be。",
  optionNotes: ["对：祈使句用原形 → Be quiet", "错：Are 不是原形", "错：Being 不能作祈使句开头", "错：Is 不是原形"]
},
{
  id: "b-g-25", level: 1, module: "grammar", topic: "adverb-frequency",
  stem: "He is ____ late for class. He always comes early.",
  options: ["never", "always", "usually", "often"],
  answer: 0,
  explanation: "后半句说他“总是早到”，所以前面应是“从不”迟到。用 never。",
  optionNotes: ["对：never = 从不，和“总是早到”一致", "错：always = 总是，和后文矛盾", "错：usually = 通常，矛盾", "错：often = 经常，矛盾"]
},

/* ---- 会话 入门 ---- */
{
  id: "b-conv-01", level: 1, module: "conversation", topic: "conversation",
  stem: "—Hello! —____",
  options: ["Hello!", "Sorry.", "Thank you.", "No."],
  answer: 0,
  explanation: "别人跟你打招呼 Hello，你也回 Hello（或 Hi）。",
  optionNotes: ["对：打招呼互相回 Hello", "错：Sorry 是道歉", "错：Thank you 是道谢", "错：No 答非所问"]
},
{
  id: "b-conv-02", level: 1, module: "conversation", topic: "conversation",
  stem: "—How are you? —____",
  options: ["I'm twelve.", "Fine, thank you.", "I'm a boy.", "Yes, I am."],
  answer: 1,
  explanation: "How are you? 问“你好吗”，答 Fine, thank you（很好，谢谢）。",
  optionNotes: ["错：这是回答 How old are you?（年龄）", "对：问近况答 Fine, thank you", "错：答非所问", "错：这不是一般疑问句，不能只答 Yes"]
},
{
  id: "b-conv-03", level: 1, module: "conversation", topic: "conversation",
  stem: "—Thank you very much. —____",
  options: ["You're welcome.", "OK.", "Fine.", "Yes, please."],
  answer: 0,
  explanation: "别人真心谢你（帮了忙），回 You're welcome（不客气）。",
  optionNotes: ["对：回应道谢用 You're welcome", "错：OK 不够礼貌得体", "错：Fine 答非所问", "错：Yes, please 用于接受提供"]
},
{
  id: "b-conv-04", level: 1, module: "conversation", topic: "conversation",
  stem: "—What's your name? —____",
  options: ["I'm fine.", "My name is Li Hua.", "I'm twelve.", "I'm a teacher."],
  answer: 1,
  explanation: "问名字，答 My name is...（我叫……）。",
  optionNotes: ["错：这是回答 How are you?", "对：问名字答 My name is Li Hua", "错：这是回答年龄", "错：这是回答职业"]
},
{
  id: "b-conv-05", level: 1, module: "conversation", topic: "conversation",
  stem: "—Nice to meet you. —____",
  options: ["Nice to meet you, too.", "Thank you.", "No, thanks.", "You're welcome."],
  answer: 0,
  explanation: "初次见面对方说“很高兴见到你”，你回 Nice to meet you, too（我也很高兴）。",
  optionNotes: ["对：初次见面互相回 Nice to meet you, too", "错：Thank you 不地道", "错：No, thanks 是拒绝", "错：You're welcome 用于回应道谢"]
},
{
  id: "b-conv-06", level: 1, module: "conversation", topic: "conversation",
  stem: "—Happy birthday! —____",
  options: ["Thank you!", "Me too.", "No.", "Sorry."],
  answer: 0,
  explanation: "别人祝你生日快乐，回 Thank you（谢谢）。",
  optionNotes: ["对：接受祝福用 Thank you", "错：Me too 不合适（难道也祝对方？除非同天生日）", "错：No 答非所问", "错：Sorry 是道歉"]
},
{
  id: "b-conv-07", level: 1, module: "conversation", topic: "conversation",
  stem: "—Excuse me, where is the bank? —____",
  options: ["It's over there.", "It's red.", "I'm sorry.", "Thank you."],
  answer: 0,
  explanation: "别人问银行在哪，要告诉地点：It's over there（在那边）。",
  optionNotes: ["对：问地点答 It's over there", "错：It's red 是回答颜色", "错：I'm sorry 没回答问题", "错：Thank you 答非所问"]
},
{
  id: "b-conv-08", level: 1, module: "conversation", topic: "conversation",
  stem: "—Can I help you? —____",
  options: ["Yes, please.", "You're welcome.", "Never mind.", "Me too."],
  answer: 0,
  explanation: "店员问“需要帮忙吗”，接受帮助用 Yes, please（好的，麻烦了）。",
  optionNotes: ["对：接受帮助用 Yes, please", "错：You're welcome 用于回应道谢", "错：Never mind 用于回应道歉", "错：Me too 答非所问"]
},

/* ---- 完形 入门（My family） ---- */
{
  id: "b-cloze-101", level: 1, module: "cloze", topic: "cloze", passageId: "bcz1",
  passage: "I have a happy family. There (1)____ five people in it: my grandpa, my parents, my sister (2)____ me. My father is a doctor, (3)____ my mother is a teacher. My sister and I (4)____ students. We (5)____ each other very much.",
  stem: "(1) 处应填：",
  options: ["is", "are", "be", "have"],
  answer: 1,
  explanation: "There be 句型，后面 five people 是复数，用 are。",
  optionNotes: ["错：is 接单数", "对：five people 复数 → are", "错：be 是原形", "错：表示“有”用 there are，不用 have 开头"]
},
{
  id: "b-cloze-102", level: 1, module: "cloze", topic: "cloze", passageId: "bcz1",
  passage: "I have a happy family. There (1)____ five people in it: my grandpa, my parents, my sister (2)____ me. My father is a doctor, (3)____ my mother is a teacher. My sister and I (4)____ students. We (5)____ each other very much.",
  stem: "(2) 处应填：",
  options: ["but", "or", "and", "so"],
  answer: 2,
  explanation: "“我姐姐和我”是并列关系，用 and。",
  optionNotes: ["错：but 表转折", "错：or 表选择", "对：并列“……和我”用 and", "错：so 表结果"]
},
{
  id: "b-cloze-103", level: 1, module: "cloze", topic: "cloze", passageId: "bcz1",
  passage: "I have a happy family. There (1)____ five people in it: my grandpa, my parents, my sister (2)____ me. My father is a doctor, (3)____ my mother is a teacher. My sister and I (4)____ students. We (5)____ each other very much.",
  stem: "(3) 处应填：",
  options: ["and", "but", "because", "or"],
  answer: 0,
  explanation: "“爸爸是医生，妈妈是老师”是两句并列陈述，用 and。",
  optionNotes: ["对：两个并列陈述用 and", "错：but 表转折，这里不矛盾", "错：because 表原因", "错：or 表选择"]
},
{
  id: "b-cloze-104", level: 1, module: "cloze", topic: "cloze", passageId: "bcz1",
  passage: "I have a happy family. There (1)____ five people in it: my grandpa, my parents, my sister (2)____ me. My father is a doctor, (3)____ my mother is a teacher. My sister and I (4)____ students. We (5)____ each other very much.",
  stem: "(4) 处应填：",
  options: ["is", "am", "are", "be"],
  answer: 2,
  explanation: "主语 My sister and I 是复数（两个人），be 动词用 are。",
  optionNotes: ["错：is 接单数", "错：am 只配 I", "对：两个人是复数 → are", "错：be 是原形"]
},
{
  id: "b-cloze-105", level: 1, module: "cloze", topic: "cloze", passageId: "bcz1",
  passage: "I have a happy family. There (1)____ five people in it: my grandpa, my parents, my sister (2)____ me. My father is a doctor, (3)____ my mother is a teacher. My sister and I (4)____ students. We (5)____ each other very much.",
  stem: "(5) 处应填：",
  options: ["love", "loves", "loving", "loved"],
  answer: 0,
  explanation: "主语 We 是复数，一般现在时动词用原形 love。",
  optionNotes: ["对：We + 动词原形 → love", "错：loves 用于第三人称单数", "错：loving 不能单独作谓语", "错：loved 是过去式"]
},

/* ---- 阅读 入门（Li Lei's day） ---- */
{
  id: "b-read-101", level: 1, module: "reading", topic: "reading", passageId: "brd1",
  passage: "Li Lei is a middle-school student. He gets up at six thirty every morning. He has breakfast at seven and goes to school by bus. He has four classes in the morning and two in the afternoon. He likes English best. After school, he plays basketball with his friends. He gets home at six and does his homework. He goes to bed at ten.",
  stem: "What time does Li Lei get up?",
  options: ["At six.", "At six thirty.", "At seven.", "At ten."],
  answer: 1,
  explanation: "原文 He gets up at six thirty（六点半起床）。",
  optionNotes: ["错：文中不是六点", "对：原文 gets up at six thirty", "错：七点是吃早饭", "错：十点是睡觉"]
},
{
  id: "b-read-102", level: 1, module: "reading", topic: "reading", passageId: "brd1",
  passage: "Li Lei is a middle-school student. He gets up at six thirty every morning. He has breakfast at seven and goes to school by bus. He has four classes in the morning and two in the afternoon. He likes English best. After school, he plays basketball with his friends. He gets home at six and does his homework. He goes to bed at ten.",
  stem: "How does Li Lei go to school?",
  options: ["By bike.", "By bus.", "On foot.", "By car."],
  answer: 1,
  explanation: "原文 goes to school by bus（坐公交车上学）。",
  optionNotes: ["错：不是自行车", "对：原文 by bus", "错：不是走路", "错：不是坐小汽车"]
},
{
  id: "b-read-103", level: 1, module: "reading", topic: "reading", passageId: "brd1",
  passage: "Li Lei is a middle-school student. He gets up at six thirty every morning. He has breakfast at seven and goes to school by bus. He has four classes in the morning and two in the afternoon. He likes English best. After school, he plays basketball with his friends. He gets home at six and does his homework. He goes to bed at ten.",
  stem: "Which subject does Li Lei like best?",
  options: ["Chinese.", "Maths.", "English.", "Music."],
  answer: 2,
  explanation: "原文 He likes English best（最喜欢英语）。",
  optionNotes: ["错：没提语文", "错：没提数学", "对：原文 likes English best", "错：没提音乐"]
},
{
  id: "b-read-104", level: 1, module: "reading", topic: "reading", passageId: "brd1",
  passage: "Li Lei is a middle-school student. He gets up at six thirty every morning. He has breakfast at seven and goes to school by bus. He has four classes in the morning and two in the afternoon. He likes English best. After school, he plays basketball with his friends. He gets home at six and does his homework. He goes to bed at ten.",
  stem: "What does Li Lei do after school?",
  options: ["He does homework.", "He plays basketball.", "He goes to bed.", "He has breakfast."],
  answer: 1,
  explanation: "原文 After school, he plays basketball with his friends（放学后打篮球）。回家后才做作业。",
  optionNotes: ["错：做作业是回到家以后", "对：原文 After school... plays basketball", "错：睡觉是晚上十点", "错：早饭是早上"]
},

/* ========================================================================== */
/*                      LEVEL 2 · 进阶（核心考点）                              */
/* ========================================================================== */

{
  id: "m-g-01", level: 2, module: "grammar", topic: "modal-verb",
  stem: "You ____ finish your homework before you watch TV.",
  options: ["must", "musts", "can to", "are must"],
  answer: 0,
  explanation: "情态动词 must（必须）+ 动词原形，本身不变形、不加 to。",
  optionNotes: ["对：must + 原形 → must finish", "错：情态动词不加 s", "错：不加 to", "错：不和 be 动词连用"]
},
{
  id: "m-g-02", level: 2, module: "grammar", topic: "conditional",
  stem: "If it ____ tomorrow, we will stay at home.",
  options: ["rain", "rains", "rained", "will rain"],
  answer: 1,
  explanation: "真实条件句（if 表“如果”）：从句用一般现在时，主句用将来时。所以 if 从句用 rains。",
  optionNotes: ["错：rain 缺 s（主语 it 第三人称单数）", "对：条件从句用一般现在时 → rains", "错：rained 是过去式", "错：条件从句里不用 will"]
},
{
  id: "m-g-03", level: 2, module: "grammar", topic: "passive",
  stem: "English ____ in many countries around the world.",
  options: ["speaks", "is spoken", "speak", "spoke"],
  answer: 1,
  explanation: "英语是“被人说”的，用被动语态 be + 过去分词。一般现在时被动 → is spoken。",
  optionNotes: ["错：speaks 是主动，但英语不能主动“说”", "对：被动 is spoken（被说）", "错：speak 是原形主动", "错：spoke 是过去主动"]
},
{
  id: "m-g-04", level: 2, module: "grammar", topic: "present-perfect",
  stem: "I ____ my homework, so I can play now.",
  options: ["finish", "finished", "have finished", "finishing"],
  answer: 2,
  explanation: "强调“已经做完、对现在有影响（所以能玩了）”，用现在完成时 have + 过去分词。",
  optionNotes: ["错：finish 是原形", "错：finished 是一般过去时，不强调对现在的影响", "对：have finished 表已完成、影响现在", "错：finishing 不能单独作谓语"]
},
{
  id: "m-g-05", level: 2, module: "grammar", topic: "superlative",
  stem: "This is ____ film I have ever seen.",
  options: ["good", "better", "best", "the best"],
  answer: 3,
  explanation: "“我看过的最好的电影”用最高级，最高级前面要加 the → the best。",
  optionNotes: ["错：good 是原级", "错：better 是比较级(两者比)", "错：best 前面缺 the", "对：最高级加 the → the best"]
},
{
  id: "m-g-06", level: 2, module: "grammar", topic: "relative-clause",
  stem: "The man ____ lives next door is a doctor.",
  options: ["which", "who", "whose", "where"],
  answer: 1,
  explanation: "先行词 the man 是人，从句缺主语（lives 的主语），指人作主语用 who。",
  optionNotes: ["错：which 指物", "对：指人作主语用 who", "错：whose 表“……的”", "错：where 表地点状语"]
},
{
  id: "m-g-07", level: 2, module: "grammar", topic: "conjunction",
  stem: "It was raining hard, ____ we stayed at home.",
  options: ["because", "so", "but", "or"],
  answer: 1,
  explanation: "“下大雨”是原因，“待在家”是结果，用 so（所以）连接结果。",
  optionNotes: ["错：because 后接原因，但空后是结果", "对：so 引出结果", "错：but 表转折", "错：or 表选择"]
},
{
  id: "m-g-08", level: 2, module: "grammar", topic: "non-finite",
  stem: "I want ____ a doctor in the future.",
  options: ["be", "to be", "being", "been"],
  answer: 1,
  explanation: "want to do sth = 想做某事，后面跟带 to 的不定式 → to be。",
  optionNotes: ["错：be 缺 to", "对：want to do → to be", "错：being 形式不对", "错：been 是过去分词"]
},
{
  id: "m-g-09", level: 2, module: "grammar", topic: "non-finite",
  stem: "He went to the shop ____ some bread.",
  options: ["buy", "to buy", "buying", "bought"],
  answer: 1,
  explanation: "表示“去做某事的目的”，用不定式 to do → to buy（去买面包）。",
  optionNotes: ["错：buy 缺 to，不能表目的", "对：不定式表目的 → to buy", "错：buying 不表目的", "错：bought 是过去式"]
},
{
  id: "m-g-10", level: 2, module: "grammar", topic: "gerund",
  stem: "She is very good at ____.",
  options: ["sing", "sings", "singing", "sang"],
  answer: 2,
  explanation: "at 是介词，介词后面接动名词(动词ing)。be good at doing = 擅长做某事。",
  optionNotes: ["错：sing 是原形，介词后不接原形", "错：sings 形式不对", "对：介词 at 后用动名词 → singing", "错：sang 是过去式"]
},
{
  id: "m-g-11", level: 2, module: "grammar", topic: "too-to",
  stem: "He is ____ young ____ drive a car.",
  options: ["too; to", "so; that", "very; to", "too; that"],
  answer: 0,
  explanation: "too + 形容词 + to do = 太……而不能……。句意：他太小了，不能开车。",
  optionNotes: ["对：too...to... = 太……不能……", "错：so...that... 后面接从句，不接单个 to do", "错：very...to 不构成这个固定结构", "错：too 不和 that 搭配成这个意思"]
},
{
  id: "m-g-12", level: 2, module: "grammar", topic: "so-that",
  stem: "He was ____ tired ____ he fell asleep at once.",
  options: ["too; to", "so; that", "such; that", "very; that"],
  answer: 1,
  explanation: "so + 形容词 + that + 从句 = 如此……以至于……。tired 是形容词，用 so...that。",
  optionNotes: ["错：too...to 后接 to do，不接从句", "对：so + 形容词 + that 从句", "错：such 后接名词，不接形容词单独用", "错：very 不引导 that 从句"]
},
{
  id: "m-g-13", level: 2, module: "grammar", topic: "used-to",
  stem: "I ____ live in the countryside when I was a child.",
  options: ["use to", "used to", "am used to", "was used to"],
  answer: 1,
  explanation: "used to do = 过去常常做（现在不这样了）。句意：我小时候常住在乡下。",
  optionNotes: ["错：use to 缺 d（要过去式）", "对：used to do = 过去常常……", "错：be used to doing 是“习惯于”，意思不对", "错：was used to 后接 doing，意思是“习惯”"]
},
{
  id: "m-g-14", level: 2, module: "grammar", topic: "present-perfect",
  stem: "I have lived in this city ____ 2020.",
  options: ["for", "since", "from", "in"],
  answer: 1,
  explanation: "现在完成时里，since + 时间点（2020）表示“自从……以来”。for + 时间段(for 3 years)。",
  optionNotes: ["错：for 后接时间段(for 5 years)", "对：since + 时间点 → since 2020", "错：from 不与现在完成时这样搭配", "错：in 不表“自从”"]
},
{
  id: "m-g-15", level: 2, module: "grammar", topic: "tag-question",
  stem: "You are a college student, ____?",
  options: ["aren't you", "are you", "don't you", "isn't it"],
  answer: 0,
  explanation: "反义疑问句“前肯后否”。前面 You are... 是肯定，反问用否定 aren't you。",
  optionNotes: ["对：前肯定后否定 → aren't you", "错：前肯定后不再用肯定 are you", "错：be 动词句反问不用 don't", "错：主语是 you，不是 it"]
},
{
  id: "m-g-16", level: 2, module: "grammar", topic: "comparative",
  stem: "My bag is much ____ than yours.",
  options: ["heavy", "heavier", "heaviest", "more heavy"],
  answer: 1,
  explanation: "than 前用比较级。heavy 以辅音字母+y 结尾，变 y 为 i 再加 er → heavier。（much 用来加强比较级）",
  optionNotes: ["错：heavy 是原级", "对：比较级 heavier（y→i+er）", "错：heaviest 是最高级", "错：短词不用 more，且拼写不对"]
},
{
  id: "m-g-17", level: 2, module: "grammar", topic: "few-little",
  stem: "He has ____ friends here, so he often feels lonely.",
  options: ["few", "a few", "little", "a little"],
  answer: 0,
  explanation: "few/a few 修饰可数名词(friends)。few 表否定“几乎没有”(所以孤单)，a few 表“有一些”。这里“孤单”说明朋友少，用 few。",
  optionNotes: ["对：few = 几乎没有（可数），符合“孤单”", "错：a few = 有一些，和孤单矛盾", "错：little 修饰不可数名词", "错：a little 修饰不可数名词"]
},
{
  id: "m-g-18", level: 2, module: "grammar", topic: "correlative",
  stem: "____ Tom ____ Jack like sports; they play football every day.",
  options: ["Both; and", "Either; or", "Neither; nor", "Not; but"],
  answer: 0,
  explanation: "后半句说“他们俩每天踢球”，说明两人都喜欢运动，用 both...and（两者都）。注意 both A and B 作主语时动词用复数 like。",
  optionNotes: ["对：both...and = ……和……都，符合“两人都喜欢”", "错：either...or = 要么……要么", "错：neither...nor = 两者都不", "错：not...but = 不是……而是"]
},
{
  id: "m-g-19", level: 2, module: "grammar", topic: "question-word",
  stem: "____ have you studied English? — For three years.",
  options: ["How often", "How long", "How far", "How soon"],
  answer: 1,
  explanation: "回答是 For three years（时间段），问“多久”用 How long。",
  optionNotes: ["错：How often 问频率(答 twice a week)", "对：How long 问时间长度", "错：How far 问距离", "错：How soon 问“多久之后”(答 in two days)"]
},
{
  id: "m-g-20", level: 2, module: "grammar", topic: "present-continuous",
  stem: "Listen! Someone ____ at the door.",
  options: ["knock", "knocks", "is knocking", "knocked"],
  answer: 2,
  explanation: "Listen! 表示“此刻正在发生”，用现在进行时。someone 视为单数 → is knocking。",
  optionNotes: ["错：knock 是原形", "错：knocks 是一般现在时", "对：正在进行 → is knocking", "错：knocked 是过去式"]
},
{
  id: "m-c-01", level: 2, module: "collocation", topic: "collocation",
  stem: "I am very interested ____ Chinese history.",
  options: ["in", "on", "at", "for"],
  answer: 0,
  explanation: "be interested in = 对……感兴趣，固定搭配。",
  optionNotes: ["对：be interested in", "错：不是 on", "错：不是 at", "错：不是 for"]
},
{
  id: "m-c-02", level: 2, module: "collocation", topic: "collocation",
  stem: "Little Tom is afraid ____ dogs.",
  options: ["of", "for", "at", "with"],
  answer: 0,
  explanation: "be afraid of = 害怕，固定搭配。",
  optionNotes: ["对：be afraid of", "错：不是 for", "错：不是 at", "错：不是 with"]
},
{
  id: "m-c-03", level: 2, module: "collocation", topic: "collocation",
  stem: "We are all looking forward ____ the summer holiday.",
  options: ["to", "for", "at", "on"],
  answer: 0,
  explanation: "look forward to = 盼望。注意这里的 to 是介词，后面接名词或动名词。",
  optionNotes: ["对：look forward to + 名词/动名词", "错：不是 for", "错：不是 at", "错：不是 on"]
},
{
  id: "m-c-04", level: 2, module: "collocation", topic: "collocation",
  stem: "Could you ____ my cat while I am away?",
  options: ["look", "take care of", "care", "watch"],
  answer: 1,
  explanation: "take care of = 照顾。句意：我不在时你能帮我照顾猫吗？",
  optionNotes: ["错：look 要加 after 才是照顾(look after)", "对：take care of = 照顾", "错：care 要加 for/about，单独不对", "错：watch 是“看着”，不等于照顾"]
},
{
  id: "m-c-05", level: 2, module: "collocation", topic: "collocation",
  stem: "The little town is famous ____ its green tea.",
  options: ["for", "as", "of", "to"],
  answer: 0,
  explanation: "be famous for = 因……而出名（后接原因/特产）。be famous as 是“作为……出名”。",
  optionNotes: ["对：be famous for + 原因/特产", "错：be famous as 后接身份(as a writer)", "错：不是 of", "错：不是 to"]
},
{
  id: "m-c-06", level: 2, module: "collocation", topic: "collocation",
  stem: "Let's walk to school ____ taking a bus.",
  options: ["instead of", "because of", "thanks to", "as for"],
  answer: 0,
  explanation: "instead of = 代替、而不是。句意：我们走路去学校，而不是坐公交。",
  optionNotes: ["对：instead of = 而不是", "错：because of = 因为", "错：thanks to = 多亏", "错：as for = 至于"]
},
{
  id: "m-c-07", level: 2, module: "collocation", topic: "collocation",
  stem: "How do you ____ your new classmates?",
  options: ["get on with", "get up", "get off", "get to"],
  answer: 0,
  explanation: "get on with sb = 与某人相处。句意：你和新同学相处得怎么样？",
  optionNotes: ["对：get on with = 与……相处", "错：get up = 起床", "错：get off = 下车", "错：get to = 到达"]
},
{
  id: "m-c-08", level: 2, module: "collocation", topic: "collocation",
  stem: "Whether we can win ____ our teamwork.",
  options: ["depends on", "depend on", "depends of", "is depend on"],
  answer: 0,
  explanation: "depend on = 取决于、依靠。主语 Whether... 视为单数，用 depends on。",
  optionNotes: ["对：depends on（主语单数加 s）", "错：depend 少了 s", "错：搭配是 on 不是 of", "错：depend 是实义动词，不和 be 连用"]
},

/* ========================================================================== */
/*                LEVEL 3 · 冲刺（拓展，可能超出模拟卷的点）                    */
/* ========================================================================== */

{
  id: "a-g-01", level: 3, module: "grammar", topic: "subjunctive",
  stem: "It is high time we ____ home; it's already midnight.",
  options: ["go", "went", "have gone", "will go"],
  answer: 1,
  explanation: "It is (high) time that... 后面用过去式表示虚拟“该做还没做”。句意：我们早该回家了。",
  optionNotes: ["错：go 是原形，这里要虚拟过去式", "对：It is high time + 过去式 → went", "错：have gone 时态不对", "错：will go 不是虚拟"]
},
{
  id: "a-g-02", level: 3, module: "grammar", topic: "inversion",
  stem: "Only then ____ the importance of good health.",
  options: ["I realized", "did I realize", "I did realize", "realized I"],
  answer: 1,
  explanation: "Only + 状语放句首，主句要部分倒装：助动词提前 → did I realize。",
  optionNotes: ["错：没倒装", "对：Only 状语开头 → did I realize（倒装）", "错：语序不对（未倒装）", "错：语序错误"]
},
{
  id: "a-g-03", level: 3, module: "grammar", topic: "emphasis",
  stem: "It ____ Tom that broke the window yesterday, not me.",
  options: ["is", "was", "has", "does"],
  answer: 1,
  explanation: "强调句 It is/was + 被强调部分 + that... 。事情发生在 yesterday(过去)，用 was。",
  optionNotes: ["错：事情在昨天，不用 is", "对：过去的事强调用 It was...that", "错：has 不构成强调句", "错：does 不构成强调句"]
},
{
  id: "a-g-04", level: 3, module: "grammar", topic: "subjunctive",
  stem: "I would rather stay at home ____ go out in such bad weather.",
  options: ["than", "then", "rather", "to"],
  answer: 0,
  explanation: "would rather do A than do B = 宁愿做 A 而不做 B。固定搭配用 than。",
  optionNotes: ["对：would rather...than... 固定搭配", "错：then 是“然后”(拼写混淆)", "错：rather 重复", "错：不是 to"]
},
{
  id: "a-g-05", level: 3, module: "grammar", topic: "noun-clause",
  stem: "____ he will come to the party is still not certain.",
  options: ["That", "Whether", "If", "What"],
  answer: 1,
  explanation: "主语从句表示“是否”，且和 not certain（不确定）呼应，用 Whether。注意 if 一般不放句首引导主语从句。",
  optionNotes: ["错：That 引导的从句表“确定的事实”，和 not certain 矛盾", "对：Whether = 是否，和“不确定”呼应", "错：if 表“是否”时不放句首作主语", "错：What 指“什么”，句子成分不缺"]
},
{
  id: "a-g-06", level: 3, module: "grammar", topic: "non-finite",
  stem: "____ from the top of the hill, the small town looks beautiful.",
  options: ["Seen", "Seeing", "To see", "See"],
  answer: 0,
  explanation: "小镇是“被看”的，用过去分词 Seen 作状语（表被动）。句意：从山顶看，小镇很美。",
  optionNotes: ["对：小镇被看 → 过去分词 Seen", "错：Seeing 表主动，但小镇不会主动看", "错：To see 表目的，逻辑不通", "错：See 是原形"]
},
{
  id: "a-g-07", level: 3, module: "grammar", topic: "subjunctive",
  stem: "I wish I ____ taller so that I could play basketball better.",
  options: ["am", "was", "were", "be"],
  answer: 2,
  explanation: "wish 后的从句表示与现在事实相反的愿望，be 动词一律用 were。句意：真希望我更高些。",
  optionNotes: ["错：am 是陈述语气", "错：口语里 was 可见，但考试标准答案用 were", "对：wish 从句 be 动词用 were", "错：be 是原形"]
},
{
  id: "a-g-08", level: 3, module: "grammar", topic: "inversion",
  stem: "Not until he finished the work ____ how tired he was.",
  options: ["he realized", "did he realize", "he did realize", "realized he"],
  answer: 1,
  explanation: "Not until 放句首，主句要部分倒装 → did he realize。句意：直到做完工作，他才意识到自己多累。",
  optionNotes: ["错：未倒装", "对：Not until 开头，主句倒装 → did he realize", "错：语序不对", "错：语序错误"]
},

]);
