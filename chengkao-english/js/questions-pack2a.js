/* ============================================================================
 * questions-pack2a.js  ——  扩充包 2a：零基础地基章节（第1-12章知识点）
 * ========================================================================== */

window.QUESTIONS = (window.QUESTIONS || []).concat([
/* ---------------- be-verb 6题 ---------------- */
{
  id: "p2a-be-1", level: 1, module: "grammar", topic: "be-verb",
  stem: "I ____ very happy today.",
  options: ["am", "is", "are", "be"],
  answer: 0,
  explanation: "主语是 I，be 动词用 am。记口诀：我用 am，你用 are，is 跟着他她它。",
  optionNotes: ["对：I 配 am", "错：is 配 he/she/it，不配 I", "错：are 配 you/we/they", "错：be 是原形，不能直接当谓语"]
},
{
  id: "p2a-be-2", level: 1, module: "grammar", topic: "be-verb",
  stem: "She ____ a nurse in the hospital.",
  options: ["are", "is", "am", "be"],
  answer: 1,
  explanation: "she（她）是第三人称单数，be 动词用 is。",
  optionNotes: ["错：are 配 you/we/they，she 不能用", "对：she 配 is", "错：am 只跟 I 搭配", "错：be 是原形，句子里不能直接当谓语"]
},
{
  id: "p2a-be-3", level: 1, module: "grammar", topic: "be-verb",
  stem: "They ____ my good friends.",
  options: ["is", "am", "are", "be"],
  answer: 2,
  explanation: "they（他们）是复数，be 动词用 are。",
  optionNotes: ["错：is 只配单数的 he/she/it", "错：am 只配 I", "对：they 是复数，配 are", "错：be 是原形，不能直接放在主语后当谓语"]
},
{
  id: "p2a-be-4", level: 1, module: "grammar", topic: "be-verb",
  stem: "My father ____ a bus driver.",
  options: ["is", "are", "am", "be"],
  answer: 0,
  explanation: "my father（我爸爸）是一个人，相当于 he，be 动词用 is。",
  optionNotes: ["对：my father 相当于 he，用 is", "错：are 配复数，爸爸只有一个人", "错：am 只配 I", "错：be 是原形，不能直接当谓语"]
},
{
  id: "p2a-be-5", level: 1, module: "grammar", topic: "be-verb",
  stem: "You ____ late for work again.",
  options: ["is", "am", "are", "be"],
  answer: 2,
  explanation: "you（你）永远配 are，不管指一个人还是几个人。",
  optionNotes: ["错：is 配 he/she/it", "错：am 只配 I", "对：you 永远配 are", "错：be 是原形，不能直接当谓语"]
},
{
  id: "p2a-be-6", level: 1, module: "grammar", topic: "be-verb",
  stem: "The weather ____ nice today.",
  options: ["are", "am", "is", "be"],
  answer: 2,
  explanation: "the weather（天气）是不可数的单数概念，相当于 it，用 is。",
  optionNotes: ["错：are 配复数，天气不是复数", "错：am 只配 I", "对：weather 相当于 it，用 is", "错：be 是原形，不能直接当谓语"]
},

/* ---------------- past-be 4题 ---------------- */
{
  id: "p2a-pastbe-1", level: 1, module: "grammar", topic: "past-be",
  stem: "I ____ at home yesterday.",
  options: ["was", "were", "am", "is"],
  answer: 0,
  explanation: "yesterday（昨天）是过去，I 的 be 动词过去式是 was。",
  optionNotes: ["对：I 在过去用 was", "错：were 配 you/we/they 的过去", "错：am 是现在，句里有 yesterday 要用过去式", "错：is 是现在，而且 is 也不配 I"]
},
{
  id: "p2a-pastbe-2", level: 1, module: "grammar", topic: "past-be",
  stem: "They ____ in Beijing last week.",
  options: ["was", "were", "are", "is"],
  answer: 1,
  explanation: "last week（上周）是过去，they 是复数，过去式用 were。",
  optionNotes: ["错：was 配单数（I/he/she/it）", "对：they 复数过去用 were", "错：are 是现在，句里有 last week", "错：is 是现在，也不配复数"]
},
{
  id: "p2a-pastbe-3", level: 1, module: "grammar", topic: "past-be",
  stem: "She ____ tired after work last night.",
  options: ["were", "is", "was", "are"],
  answer: 2,
  explanation: "last night（昨晚）是过去，she 是单数，过去式用 was。",
  optionNotes: ["错：were 配复数或 you", "错：is 是现在，句里说的是昨晚", "对：she 单数过去用 was", "错：are 是现在，也不配 she"]
},
{
  id: "p2a-pastbe-4", level: 1, module: "grammar", topic: "past-be",
  stem: "We ____ busy last Monday.",
  options: ["was", "is", "are", "were"],
  answer: 3,
  explanation: "last Monday（上周一）是过去，we 是复数，过去式用 were。",
  optionNotes: ["错：was 配单数，we 是复数", "错：is 是现在，且不配 we", "错：are 虽然配 we，但那是现在，句里是上周一", "对：we 复数过去用 were"]
},

/* ---------------- plural 4题 ---------------- */
{
  id: "p2a-plural-1", level: 1, module: "grammar", topic: "plural",
  stem: "I have two ____.",
  options: ["book", "books", "bookes", "a book"],
  answer: 1,
  explanation: "two（两个）后面要用复数，book 的复数直接加 s，就是 books。",
  optionNotes: ["错：two 后面不能用单数", "对：book 直接加 s 变复数", "错：book 不是以 s/ch/sh/x 结尾，不加 es", "错：a 表示一个，跟 two 矛盾"]
},
{
  id: "p2a-plural-2", level: 1, module: "grammar", topic: "plural",
  stem: "There are three ____ in the box.",
  options: ["watch", "watchs", "watches", "watch's"],
  answer: 2,
  explanation: "three（三个）后面用复数。watch 以 ch 结尾，复数要加 es，变成 watches。",
  optionNotes: ["错：three 后面不能用单数", "错：ch 结尾不能只加 s", "对：ch 结尾加 es，watches", "错：watch's 是所有格（手表的），不是复数"]
},
{
  id: "p2a-plural-3", level: 1, module: "grammar", topic: "plural",
  stem: "Look at those ____ over there.",
  options: ["child", "childs", "children", "childrens"],
  answer: 2,
  explanation: "child（孩子）是特殊变化的词，复数不加 s，直接变成 children。",
  optionNotes: ["错：those 后面要用复数", "错：child 是特殊词，不能加 s", "对：child 的复数是 children，要死记", "错：children 已经是复数了，后面不能再加 s"]
},
{
  id: "p2a-plural-4", level: 1, module: "grammar", topic: "plural",
  stem: "She bought five ____ at the market.",
  options: ["tomato", "tomatos", "tomatoes", "tomatoies"],
  answer: 2,
  explanation: "five（五个）后面用复数。tomato（西红柿）以 o 结尾，复数加 es，变成 tomatoes。",
  optionNotes: ["错：five 后面不能用单数", "错：tomato 不能只加 s", "对：o 结尾的蔬果类加 es，tomatoes", "错：没有把 o 改成 ies 的规则，那是 y 结尾的词才有的变化"]
},

/* ---------------- there-be 4题 ---------------- */
{
  id: "p2a-therebe-1", level: 1, module: "grammar", topic: "there-be",
  stem: "There ____ a cup on the table.",
  options: ["is", "are", "have", "has"],
  answer: 0,
  explanation: "a cup（一个杯子）是单数，所以用 There is。表示“某地有某物”用 there be，不用 have。",
  optionNotes: ["对：a cup 单数，配 is", "错：are 配复数", "错：某地有某物用 there be，不能用 have", "错：has 也是“拥有”，这里不能用"]
},
{
  id: "p2a-therebe-2", level: 1, module: "grammar", topic: "there-be",
  stem: "There ____ many people in the park.",
  options: ["is", "are", "has", "be"],
  answer: 1,
  explanation: "many people（很多人）是复数，所以用 There are。",
  optionNotes: ["错：is 配单数，people 是复数", "对：many people 复数，配 are", "错：某地有某物不能用 has", "错：be 是原形，不能直接用"]
},
{
  id: "p2a-therebe-3", level: 1, module: "grammar", topic: "there-be",
  stem: "There ____ some milk in the bottle.",
  options: ["are", "is", "have", "were"],
  answer: 1,
  explanation: "milk（牛奶）是不可数名词，当单数看，所以用 is。不可数的东西不管多少都配 is。",
  optionNotes: ["错：are 配可数复数，milk 不可数", "对：不可数名词 milk 配 is", "错：某地有某物不能用 have", "错：were 是过去式复数，这句是现在，milk 也不可数"]
},
{
  id: "p2a-therebe-4", level: 1, module: "grammar", topic: "there-be",
  stem: "____ there a bank near here?",
  options: ["Is", "Are", "Has", "Have"],
  answer: 0,
  explanation: "there be 变问句，把 be 动词提到最前面。a bank 是单数，所以用 Is there...?",
  optionNotes: ["对：a bank 单数，问句提前 is", "错：are 配复数，这里只问一家银行", "错：there be 句型里没有 has", "错：there be 句型里没有 have"]
},

/* ---------------- article 8题 ---------------- */
{
  id: "p2a-art-1", level: 1, module: "grammar", topic: "article",
  stem: "I have ____ apple.",
  options: ["a", "an", "the", "不填"],
  answer: 1,
  explanation: "apple 开头是元音音（发音像“艾”），前面要用 an，不用 a。",
  optionNotes: ["错：a 用在辅音音开头的词前，如 a book", "对：apple 元音开头，用 an", "错：the 是特指“那个”，这里只是随便一个苹果", "错：apple 可数单数，前面必须有冠词"]
},
{
  id: "p2a-art-2", level: 1, module: "grammar", topic: "article",
  stem: "She is ____ teacher.",
  options: ["a", "an", "the", "不填"],
  answer: 0,
  explanation: "说职业时，可数单数名词前要加 a/an。teacher 辅音音开头，用 a。",
  optionNotes: ["对：teacher 辅音开头，用 a", "错：an 用在元音音开头的词前", "错：the 是特指，说职业不特指哪一位", "错：中文不说“一个”，但英文可数单数前必须有冠词"]
},
{
  id: "p2a-art-3", level: 2, module: "grammar", topic: "article",
  stem: "He plays ____ basketball after work.",
  options: ["a", "an", "the", "不填"],
  answer: 3,
  explanation: "球类运动前不加冠词：play basketball、play football。这是固定规则。",
  optionNotes: ["错：球类运动前不加 a", "错：球类运动前也不加 an", "错：球类运动前不加 the，乐器才加 the", "对：play + 球类，中间什么都不加"]
},
{
  id: "p2a-art-5", level: 2, module: "grammar", topic: "article",
  stem: "I waited for ____ hour at the station.",
  options: ["a", "an", "the", "不填"],
  answer: 1,
  explanation: "hour 的 h 不发音，读起来是元音开头（像“奥”），所以用 an hour。这是常考陷阱。",
  optionNotes: ["错：看拼写像辅音开头，但 h 不发音，不能用 a", "对：hour 发音元音开头，用 an", "错：the 是特指，这里只说“一个小时”", "错：hour 可数单数，必须有冠词"]
},
{
  id: "p2a-art-6", level: 1, module: "grammar", topic: "article",
  stem: "There is ____ old man at the door.",
  options: ["a", "an", "the", "不填"],
  answer: 1,
  explanation: "冠词看紧跟着的词。old 是元音音开头（“欧”），所以用 an old man。",
  optionNotes: ["错：a 配辅音开头，old 是元音开头", "对：an + old，元音开头用 an", "错：there is 句型第一次提到的人，用 a/an 不用 the", "错：可数单数 man 前必须有冠词"]
},
{
  id: "p2a-art-7", level: 2, module: "grammar", topic: "article",
  stem: "She plays ____ piano every evening.",
  options: ["a", "an", "the", "不填"],
  answer: 2,
  explanation: "弹奏乐器前面要加 the：play the piano、play the guitar。跟球类正好相反。",
  optionNotes: ["错：乐器前不用 a", "错：乐器前也不用 an", "对：play the + 乐器，固定搭配", "错：不加冠词是球类的规则，乐器要加 the"]
},
{
  id: "p2a-art-8", level: 1, module: "grammar", topic: "article",
  stem: "We go to ____ work by bus every day.",
  options: ["a", "an", "the", "不填"],
  answer: 3,
  explanation: "go to work（去上班）是固定搭配，work 前不加任何冠词。类似的还有 go to school、go to bed。",
  optionNotes: ["错：go to work 是固定说法，不加 a", "错：也不加 an", "错：也不加 the", "对：go to work 中间什么都不加"]
},

/* ---------------- pronoun 3题 ---------------- */
{
  id: "p2a-pron-1", level: 1, module: "grammar", topic: "pronoun",
  stem: "____ is my sister. She is a doctor.",
  options: ["Her", "She", "Hers", "Him"],
  answer: 1,
  explanation: "空格是句子的主语（谁是我妹妹），要用主格 she。",
  optionNotes: ["错：her 是“她的”或宾格，不能当主语", "对：主语位置用主格 she", "错：hers 是“她的东西”，不能当这里的主语", "错：him 是“他”的宾格，性别和格都不对"]
},
{
  id: "p2a-pron-2", level: 1, module: "grammar", topic: "pronoun",
  stem: "Tom and I are workers. ____ work in the same factory.",
  options: ["We", "Us", "Our", "They"],
  answer: 0,
  explanation: "Tom 和我，包括“我”自己，所以是“我们”，主语位置用 we。",
  optionNotes: ["对：Tom 和我 = 我们，主语用 we", "错：us 是宾格，不能放在句首当主语", "错：our 是“我们的”，后面得跟名词", "错：they 是“他们”，把自己排除在外了，不对"]
},
{
  id: "p2a-pron-3", level: 1, module: "grammar", topic: "pronoun",
  stem: "This is my dog. ____ is very cute.",
  options: ["It", "Its", "Him", "Her"],
  answer: 0,
  explanation: "指动物一般用 it（它）。空格是主语，用主格 it。",
  optionNotes: ["对：动物用 it，主语位置用主格", "错：its 是“它的”，后面要跟名词", "错：him 是宾格，不能当主语", "错：her 也是宾格或“她的”，不能当主语"]
},

/* ---------------- object-pronoun 2题 ---------------- */
{
  id: "p2a-obj-1", level: 1, module: "grammar", topic: "object-pronoun",
  stem: "This gift is for ____.",
  options: ["I", "me", "my", "mine"],
  answer: 1,
  explanation: "介词 for 后面要用宾格。“我”的宾格是 me：for me（给我的）。",
  optionNotes: ["错：I 是主格，只能当主语", "对：介词后面用宾格 me", "错：my 是“我的”，后面必须跟名词", "错：mine 是“我的东西”，for mine 说不通"]
},
{
  id: "p2a-obj-2", level: 1, module: "grammar", topic: "object-pronoun",
  stem: "Do you know ____? He is our new manager.",
  options: ["he", "his", "him", "himself"],
  answer: 2,
  explanation: "know（认识）后面接的人是宾语，要用宾格 him。",
  optionNotes: ["错：he 是主格，不能放在动词后面当宾语", "错：his 是“他的”，后面要跟名词", "对：动词后面的宾语用宾格 him", "错：himself 是“他自己”，认识的是别人不是自己"]
},

/* ---------------- possessive 2题 ---------------- */
{
  id: "p2a-poss-1", level: 1, module: "grammar", topic: "possessive",
  stem: "This is ____ car. He bought it last year.",
  options: ["he", "him", "his", "he's"],
  answer: 2,
  explanation: "car 前面缺“谁的”，用形容词性物主代词 his（他的）。",
  optionNotes: ["错：he 是“他”，不是“他的”", "错：him 是宾格，也不表示“他的”", "对：his + 名词 = 他的车", "错：he's 是 he is 的缩写，意思是“他是”，不是“他的”"]
},
{
  id: "p2a-poss-2", level: 1, module: "grammar", topic: "possessive",
  stem: "____ mother cooks dinner every day.",
  options: ["I", "Me", "My", "Mine"],
  answer: 2,
  explanation: "mother 前面缺“谁的”，用 my（我的）：my mother 我妈妈。",
  optionNotes: ["错：I 是“我”，不能直接放在名词前", "错：me 是宾格，也不表示“我的”", "对：my + 名词 = 我的妈妈", "错：mine 后面不能再跟名词，它本身就等于“我的东西”"]
},

/* ---------------- demonstrative 1题 ---------------- */
{
  id: "p2a-dem-1", level: 1, module: "grammar", topic: "demonstrative",
  stem: "____ shoes over there are mine.",
  options: ["This", "That", "These", "Those"],
  answer: 3,
  explanation: "shoes 是复数，over there（在那边）表示远处。远处的复数用 those（那些）。",
  optionNotes: ["错：this 指近处的单数", "错：that 指远处但只能配单数", "错：these 是复数但指近处，句里说 over there", "对：远处 + 复数 = those"]
},

/* ---------------- present-simple 8题 ---------------- */
{
  id: "p2a-ps-1", level: 1, module: "grammar", topic: "present-simple",
  stem: "He ____ to work at eight every morning.",
  options: ["go", "goes", "going", "to go"],
  answer: 1,
  explanation: "every morning（每天早上）是习惯，用一般现在时。主语 he 是第三人称单数，动词加 es：goes。",
  optionNotes: ["错：go 是原形，he 后面要变形", "对：he 是三单，go 变 goes", "错：going 前面得有 be 动词才行", "错：to go 是不定式，不能直接当谓语"]
},
{
  id: "p2a-ps-2", level: 1, module: "grammar", topic: "present-simple",
  stem: "I ____ coffee every day.",
  options: ["drinks", "drink", "drinking", "am drink"],
  answer: 1,
  explanation: "主语是 I，不是第三人称单数，动词用原形 drink。",
  optionNotes: ["错：drinks 是三单形式，I 不用加 s", "对：I 后面动词用原形", "错：drinking 前面缺 be 动词", "错：am 后面不能直接跟动词原形，要么去掉 am 要么用 drinking"]
},
{
  id: "p2a-ps-3", level: 1, module: "grammar", topic: "present-simple",
  stem: "She ____ TV in the evening.",
  options: ["watch", "watchs", "watches", "watching"],
  answer: 2,
  explanation: "she 是第三人称单数。watch 以 ch 结尾，加 es 变成 watches。",
  optionNotes: ["错：she 后面动词要变形，不能用原形", "错：ch 结尾不能只加 s", "对：ch 结尾加 es，watches", "错：watching 前面缺 be 动词"]
},
{
  id: "p2a-ps-4", level: 1, module: "grammar", topic: "present-simple",
  stem: "My parents ____ in a small town.",
  options: ["lives", "live", "living", "is live"],
  answer: 1,
  explanation: "my parents（我父母）是复数，动词用原形 live，不加 s。",
  optionNotes: ["错：lives 是单数第三人称用的，parents 是两个人", "对：复数主语配动词原形", "错：living 前面缺 be 动词", "错：is 和动词原形不能连用，且 parents 也不配 is"]
},
{
  id: "p2a-ps-5", level: 1, module: "grammar", topic: "present-simple",
  stem: "He ____ eat meat. He only eats vegetables.",
  options: ["don't", "doesn't", "isn't", "not"],
  answer: 1,
  explanation: "一般现在时的否定：he/she/it 用 doesn't + 动词原形。",
  optionNotes: ["错：don't 配 I/you/we/they，he 要用 doesn't", "对：三单否定用 doesn't", "错：isn't 是 be 动词的否定，后面不能直接跟 eat", "错：not 不能单独用来否定动词"]
},
{
  id: "p2a-ps-6", level: 1, module: "grammar", topic: "present-simple",
  stem: "____ you like Chinese food?",
  options: ["Do", "Does", "Are", "Is"],
  answer: 0,
  explanation: "like 是普通动词，问句要借助 do/does。主语是 you，用 Do。",
  optionNotes: ["对：you 提问用 Do", "错：Does 配 he/she/it", "错：Are 是 be 动词，句里已经有动词 like 了", "错：Is 也是 be 动词，不能和 like 连用"]
},
{
  id: "p2a-ps-7", level: 1, module: "grammar", topic: "present-simple",
  stem: "____ she work in a bank?",
  options: ["Do", "Does", "Is", "Are"],
  answer: 1,
  explanation: "she 是第三人称单数，问句用 Does。注意 Does 后面动词回到原形 work。",
  optionNotes: ["错：Do 配 I/you/we/they", "对：she 提问用 Does，后面动词用原形", "错：Is 是 be 动词，不能和动词 work 连用", "错：Are 也是 be 动词，且不配 she"]
},
{
  id: "p2a-ps-8", level: 1, module: "grammar", topic: "present-simple",
  stem: "The store ____ at nine o'clock every day.",
  options: ["open", "opens", "opening", "is open every"],
  answer: 1,
  explanation: "every day 表示天天如此，用一般现在时。the store（商店）是单数，动词加 s：opens。",
  optionNotes: ["错：open 是原形，单数主语要加 s", "对：the store 是三单，用 opens", "错：opening 前面缺 be 动词", "错：多了 every，语序也乱了"]
},

/* ---------------- have-has 2题 ---------------- */
{
  id: "p2a-have-1", level: 1, module: "grammar", topic: "have-has",
  stem: "She ____ two children.",
  options: ["have", "has", "is", "are"],
  answer: 1,
  explanation: "表示“有”，she 是第三人称单数，用 has。",
  optionNotes: ["错：have 配 I/you/we/they", "对：she 配 has", "错：is 是“是”，不是“有”", "错：are 也是“是”，且不配 she"]
},
{
  id: "p2a-have-2", level: 1, module: "grammar", topic: "have-has",
  stem: "I ____ a new phone.",
  options: ["has", "am", "have", "is"],
  answer: 2,
  explanation: "表示“有”，主语是 I，用 have。",
  optionNotes: ["错：has 配 he/she/it，I 不用", "错：am 是“是”，不是“有”", "对：I 配 have", "错：is 既不配 I，意思也不对"]
},

/* ---------------- present-continuous 6题 ---------------- */
{
  id: "p2a-pc-1", level: 1, module: "grammar", topic: "present-continuous",
  stem: "Look! The baby ____ now.",
  options: ["sleep", "sleeps", "is sleeping", "sleeping"],
  answer: 2,
  explanation: "Look!（你看！）和 now 都说明动作正在进行，用现在进行时：be + 动词ing。baby 是单数，用 is sleeping。",
  optionNotes: ["错：sleep 是原形，表达不了“正在”", "错：sleeps 是一般现在时，表示习惯不是此刻", "对：is + sleeping，正在睡觉", "错：sleeping 前面必须有 be 动词"]
},
{
  id: "p2a-pc-2", level: 1, module: "grammar", topic: "present-continuous",
  stem: "I ____ dinner now.",
  options: ["cook", "am cooking", "cooks", "cooking"],
  answer: 1,
  explanation: "now（现在）表示动作正在发生。I 配 am，再加 cooking。",
  optionNotes: ["错：cook 是一般现在时，表示平时习惯", "对：I am cooking，正在做饭", "错：cooks 是三单形式，I 不能用", "错：cooking 单独用缺 be 动词"]
},
{
  id: "p2a-pc-3", level: 1, module: "grammar", topic: "present-continuous",
  stem: "They ____ football in the playground now.",
  options: ["play", "plays", "are playing", "is playing"],
  answer: 2,
  explanation: "now 表示正在进行。they 是复数，be 动词用 are：are playing。",
  optionNotes: ["错：play 表示习惯，不是此刻", "错：plays 是三单形式，they 是复数", "对：they are playing，正在踢球", "错：is 配单数，they 要配 are"]
},
{
  id: "p2a-pc-4", level: 1, module: "grammar", topic: "present-continuous",
  stem: "Listen! She ____ an English song.",
  options: ["sings", "sing", "is singing", "are singing"],
  answer: 2,
  explanation: "Listen!（你听！）说明歌声此刻正响着，用现在进行时。she 配 is singing。",
  optionNotes: ["错：sings 是一般现在时，表示平时爱唱", "错：sing 是原形，she 后面也不能直接用", "对：is singing，正在唱", "错：are 配复数，she 是单数"]
},
{
  id: "p2a-pc-5", level: 1, module: "grammar", topic: "present-continuous",
  stem: "What ____ you doing now?",
  options: ["is", "are", "do", "does"],
  answer: 1,
  explanation: "doing 前面缺 be 动词，主语是 you，配 are：What are you doing?（你在干什么？）",
  optionNotes: ["错：is 配 he/she/it，不配 you", "对：you 配 are", "错：do 和 doing 不能这样连用", "错：does 也不能和 doing 连用"]
},
{
  id: "p2a-pc-6", level: 1, module: "grammar", topic: "present-continuous",
  stem: "He ____ a letter at the moment.",
  options: ["writes", "is writing", "write", "writing"],
  answer: 1,
  explanation: "at the moment（此刻）等于 now，用现在进行时。he 配 is writing。",
  optionNotes: ["错：writes 是一般现在时，表示习惯", "对：is writing，此刻正在写", "错：write 是原形，he 后面不能直接用", "错：writing 缺 be 动词"]
},

/* ---------------- some-any 3题 ---------------- */
{
  id: "p2a-sa-1", level: 1, module: "grammar", topic: "some-any",
  stem: "I have ____ money in my pocket.",
  options: ["any", "some", "a", "an"],
  answer: 1,
  explanation: "肯定句里表示“一些”用 some。any 一般用在否定句和疑问句里。",
  optionNotes: ["错：any 用在否定句和问句，这是肯定句", "对：肯定句用 some", "错：money 不可数，不能用 a", "错：money 不可数，也不能用 an"]
},
{
  id: "p2a-sa-2", level: 1, module: "grammar", topic: "some-any",
  stem: "Do you have ____ questions?",
  options: ["some", "a", "any", "an"],
  answer: 2,
  explanation: "疑问句里表示“一些”一般用 any：Do you have any questions?（你有问题吗？）",
  optionNotes: ["错：some 一般用在肯定句", "错：questions 是复数，不能用 a", "对：疑问句用 any", "错：复数前也不能用 an"]
},
{
  id: "p2a-sa-3", level: 1, module: "grammar", topic: "some-any",
  stem: "There isn't ____ water in the cup.",
  options: ["some", "any", "a", "many"],
  answer: 1,
  explanation: "isn't 是否定，否定句里用 any：没有任何水。",
  optionNotes: ["错：some 用在肯定句，这句有 isn't", "对：否定句用 any", "错：water 不可数，不能用 a", "错：many 配可数复数，water 不可数"]
},

/* ---------------- much-many 3题 ---------------- */
{
  id: "p2a-mm-1", level: 1, module: "grammar", topic: "much-many",
  stem: "How ____ people are there in your family?",
  options: ["much", "many", "some", "any"],
  answer: 1,
  explanation: "people（人）是可数的复数，问数量用 how many。",
  optionNotes: ["错：much 配不可数名词，人可以数", "对：可数复数用 many", "错：some 不能和 how 连着问数量", "错：any 也不能和 how 连用"]
},
{
  id: "p2a-mm-2", level: 1, module: "grammar", topic: "much-many",
  stem: "I don't have ____ time today.",
  options: ["many", "much", "a lot", "few"],
  answer: 1,
  explanation: "time（时间）是不可数名词，用 much：not much time 没多少时间。",
  optionNotes: ["错：many 配可数复数，time 不可数", "对：不可数名词用 much", "错：a lot 后面得加 of 才能接名词", "错：few 配可数复数，意思也不搭"]
},
{
  id: "p2a-mm-3", level: 1, module: "grammar", topic: "much-many",
  stem: "How ____ is this shirt?",
  options: ["many", "much", "some", "any"],
  answer: 1,
  explanation: "How much is...? 是问价格的固定说法：这件衬衫多少钱？",
  optionNotes: ["错：how many 问可数的数量，不问价格", "对：问价格固定用 how much", "错：some 不能和 how 连用", "错：any 也不能和 how 连用"]
},

/* ---------------- few-little 2题 ---------------- */
{
  id: "p2a-fl-1", level: 2, module: "grammar", topic: "few-little",
  stem: "There is ____ milk left. Let's buy some.",
  options: ["few", "a few", "little", "many"],
  answer: 2,
  explanation: "milk 不可数，只能用 little/a little。后半句说要去买，说明“几乎没有了”，用 little（表示少得不够）。",
  optionNotes: ["错：few 配可数复数，milk 不可数", "错：a few 也是配可数的", "对：不可数 + 几乎没有 = little", "错：many 配可数复数，且意思相反"]
},
{
  id: "p2a-fl-2", level: 2, module: "grammar", topic: "few-little",
  stem: "He has ____ friends here, so he feels lonely.",
  options: ["few", "a few", "little", "a little"],
  answer: 0,
  explanation: "friends 可数，用 few/a few。他觉得孤独，说明朋友“几乎没有”，用 few（带否定意味）。",
  optionNotes: ["对：可数 + 几乎没有 = few，所以孤独", "错：a few 是“有几个”，有朋友就不至于孤独了", "错：little 配不可数名词", "错：a little 也是配不可数的"]
},

/* ---------------- preposition-time 6题 ---------------- */
{
  id: "p2a-prept-1", level: 1, module: "grammar", topic: "preposition-time",
  stem: "I get up ____ seven o'clock.",
  options: ["in", "on", "at", "of"],
  answer: 2,
  explanation: "具体的钟点前用 at：at seven o'clock（在七点）。记口诀：点用 at，天用 on，年月季节用 in。",
  optionNotes: ["错：in 配年、月、季节", "错：on 配具体某一天", "对：几点钟前面用 at", "错：of 是“……的”，不表示时间"]
},
{
  id: "p2a-prept-2", level: 1, module: "grammar", topic: "preposition-time",
  stem: "We have a meeting ____ Monday.",
  options: ["in", "on", "at", "for"],
  answer: 1,
  explanation: "星期几前面用 on：on Monday（在周一）。",
  optionNotes: ["错：in 配年、月、季节，不配星期", "对：星期几用 on", "错：at 配具体钟点", "错：for 表示“为了”或时间长度，不是时间点"]
},
{
  id: "p2a-prept-3", level: 1, module: "grammar", topic: "preposition-time",
  stem: "It is very cold ____ winter.",
  options: ["on", "at", "in", "of"],
  answer: 2,
  explanation: "季节前面用 in：in winter（在冬天）。",
  optionNotes: ["错：on 配具体某一天", "错：at 配钟点", "对：季节用 in", "错：of 不表示时间"]
},
{
  id: "p2a-prept-4", level: 1, module: "grammar", topic: "preposition-time",
  stem: "She was born ____ 1998.",
  options: ["at", "on", "in", "of"],
  answer: 2,
  explanation: "年份前面用 in：in 1998（在1998年）。",
  optionNotes: ["错：at 配钟点", "错：on 配具体某一天，如 on May 1st", "对：年份用 in", "错：of 不表示时间"]
},
{
  id: "p2a-prept-5", level: 2, module: "grammar", topic: "preposition-time",
  stem: "The shop closes ____ night.",
  options: ["in", "on", "at", "for"],
  answer: 2,
  explanation: "at night（在夜里）是固定搭配。注意对比：in the morning / in the afternoon / at night。",
  optionNotes: ["错：morning/afternoon 才用 in，还得加 the", "错：on 配具体某天", "对：at night 固定搭配，要死记", "错：for 不表示时间点"]
},
{
  id: "p2a-prept-6", level: 2, module: "grammar", topic: "preposition-time",
  stem: "My birthday is ____ May 4th.",
  options: ["in", "at", "on", "of"],
  answer: 2,
  explanation: "具体到某月某日（某一天），用 on：on May 4th。只说月份才用 in May。",
  optionNotes: ["错：in 只配单独的月份，加了日期就不行", "错：at 配钟点", "对：具体日期用 on", "错：of 不表示时间"]
},

/* ---------------- preposition-place 4题 ---------------- */
{
  id: "p2a-prepp-1", level: 1, module: "grammar", topic: "preposition-place",
  stem: "There is a picture ____ the wall.",
  options: ["in", "on", "at", "under"],
  answer: 1,
  explanation: "画挂在墙的表面上，表面接触用 on：on the wall（在墙上）。",
  optionNotes: ["错：in 是“在里面”，画不在墙里面", "对：贴着表面用 on", "错：at 表示在某个地点附近，不用于墙面", "错：under 是“在下面”，意思不对"]
},
{
  id: "p2a-prepp-2", level: 1, module: "grammar", topic: "preposition-place",
  stem: "He lives ____ Shanghai.",
  options: ["at", "on", "in", "to"],
  answer: 2,
  explanation: "在城市、国家等大地方里面，用 in：in Shanghai、in China。",
  optionNotes: ["错：at 配小地点，如 at the bus stop", "错：on 是“在表面上”", "对：大地方（城市）用 in", "错：to 表示“去某地”的方向，不表示住在哪"]
},
{
  id: "p2a-prepp-3", level: 1, module: "grammar", topic: "preposition-place",
  stem: "She is waiting ____ the bus stop.",
  options: ["in", "on", "at", "under"],
  answer: 2,
  explanation: "车站、门口这种小地点用 at：at the bus stop（在公交站）。",
  optionNotes: ["错：in 是“在里面”，车站是个点不是空间", "错：on 是“在表面上”", "对：小地点用 at", "错：under 是“在下面”，意思不对"]
},
{
  id: "p2a-prepp-4", level: 2, module: "grammar", topic: "preposition-place",
  stem: "The bank is ____ the hospital and the school.",
  options: ["between", "among", "in", "on"],
  answer: 0,
  explanation: "在两者之间用 between：between A and B。三个以上才用 among。",
  optionNotes: ["对：两者之间用 between，句里正好是两个地方", "错：among 用于三者或更多之间", "错：in 是“在里面”，银行不在医院里", "错：on 是“在表面上”，意思不对"]
},

/* ---------------- modal-can 3题 ---------------- */
{
  id: "p2a-can-1", level: 1, module: "grammar", topic: "modal-can",
  stem: "She ____ speak English very well.",
  options: ["can", "cans", "can to", "is can"],
  answer: 0,
  explanation: "can（会、能）是情态动词，任何主语后面都不变形，直接加动词原形。",
  optionNotes: ["对：can 不管主语是谁都不变", "错：情态动词永远不加 s", "错：can 后面直接跟原形，不加 to", "错：be 动词和 can 不能连用"]
},
{
  id: "p2a-can-2", level: 1, module: "grammar", topic: "modal-can",
  stem: "I can ____ a bike.",
  options: ["ride", "rides", "riding", "to ride"],
  answer: 0,
  explanation: "can 后面必须跟动词原形：can ride（会骑）。",
  optionNotes: ["对：can 后面用原形 ride", "错：can 后面不能加 s", "错：can 后面不能用 ing 形式", "错：can 后面不能加 to"]
},
{
  id: "p2a-can-3", level: 1, module: "grammar", topic: "modal-can",
  stem: "____ you help me with this box?",
  options: ["Is", "Can", "Am", "Does"],
  answer: 1,
  explanation: "请求别人帮忙用 Can you...?（你能……吗？）can 提问直接放句首。",
  optionNotes: ["错：Is 是 be 动词，后面不能直接跟动词 help", "对：Can you help me? 请求帮忙的常用句", "错：Am 只配 I，也不能接动词原形这样问", "错：Does 不配 you，you 要用 Do"]
},

/* ---------------- modal-verb 5题 ---------------- */
{
  id: "p2a-modal-1", level: 2, module: "grammar", topic: "modal-verb",
  stem: "You ____ smoke here. It's a hospital.",
  options: ["mustn't", "must", "can", "need"],
  answer: 0,
  explanation: "医院里不许吸烟。表示“禁止、千万不能”用 mustn't。",
  optionNotes: ["对：mustn't 表示禁止，医院里禁止吸烟", "错：must 是“必须”，意思正好反了", "错：can 是“可以”，医院里显然不可以", "错：need 是“需要”，意思不通"]
},
{
  id: "p2a-modal-2", level: 1, module: "grammar", topic: "modal-verb",
  stem: "I ____ finish my work before six.",
  options: ["must", "musts", "must to", "have"],
  answer: 0,
  explanation: "must（必须）是情态动词，后面直接加动词原形：must finish。",
  optionNotes: ["对：must + 动词原形", "错：情态动词永远不加 s", "错：must 后面不加 to", "错：have 表示“必须”时要说 have to，少了 to 不行"]
},
{
  id: "p2a-modal-3", level: 1, module: "grammar", topic: "modal-verb",
  stem: "You look tired. You ____ go to bed early.",
  options: ["are", "should", "can be", "must to"],
  answer: 1,
  explanation: "给别人提建议用 should（应该）：你应该早点睡。",
  optionNotes: ["错：are 后面不能直接跟动词原形 go", "对：should 表示建议，后接原形", "错：can be 后面不能再跟 go", "错：must 后面不加 to"]
},
{
  id: "p2a-modal-4", level: 1, module: "grammar", topic: "modal-verb",
  stem: "____ I open the window? It's hot here.",
  options: ["May", "Do", "Am", "Does"],
  answer: 0,
  explanation: "礼貌地请求许可用 May I...?（我可以……吗？）",
  optionNotes: ["对：May I...? 请求许可的礼貌说法", "错：Do I open...? 语法上像在问事实，不是请求许可", "错：Am 后面不能直接跟动词原形", "错：Does 不配 I"]
},
{
  id: "p2a-modal-5", level: 2, module: "grammar", topic: "modal-verb",
  stem: "He may ____ at home now.",
  options: ["be", "is", "am", "being"],
  answer: 0,
  explanation: "may（可能）是情态动词，后面必须跟动词原形。be 动词的原形就是 be：may be（可能在）。",
  optionNotes: ["对：情态动词后面用原形 be", "错：may 后面不能跟 is，is 不是原形", "错：am 也不是原形，且只配 I", "错：may 后面不能跟 ing 形式"]
},

/* ---------------- future-will 6题 ---------------- */
{
  id: "p2a-will-1", level: 1, module: "grammar", topic: "future-will",
  stem: "I ____ visit my grandma tomorrow.",
  options: ["will", "wills", "am", "was"],
  answer: 0,
  explanation: "tomorrow（明天）是将来，用 will + 动词原形。will 不管主语是谁都不变。",
  optionNotes: ["对：将来时用 will + 原形", "错：will 永远不加 s", "错：am 后面不能直接跟动词原形", "错：was 是过去式，句里说的是明天"]
},
{
  id: "p2a-will-2", level: 1, module: "grammar", topic: "future-will",
  stem: "It ____ rain tomorrow.",
  options: ["is", "will", "was", "are"],
  answer: 1,
  explanation: "tomorrow 是将来，用 will：It will rain（明天会下雨）。",
  optionNotes: ["错：is 后面不能直接跟动词原形 rain", "对：将来的事用 will", "错：was 是过去式", "错：are 不配 it，也不能接原形"]
},
{
  id: "p2a-will-3", level: 1, module: "grammar", topic: "future-will",
  stem: "He will ____ back next week.",
  options: ["come", "comes", "coming", "came"],
  answer: 0,
  explanation: "will 后面必须跟动词原形：will come back（会回来）。",
  optionNotes: ["对：will 后面用原形 come", "错：will 后面不能加 s，别被 he 骗了", "错：will 后面不能用 ing 形式", "错：came 是过去式，will 后面只能用原形"]
},
{
  id: "p2a-will-4", level: 1, module: "grammar", topic: "future-will",
  stem: "They ____ move to a new house next month.",
  options: ["are", "were", "will", "did"],
  answer: 2,
  explanation: "next month（下个月）是将来，用 will + 动词原形。",
  optionNotes: ["错：are 后面不能直接跟原形 move", "错：were 是过去式", "对：将来时用 will", "错：did 是过去，且这样搭配不成句"]
},
{
  id: "p2a-will-5", level: 1, module: "grammar", topic: "future-will",
  stem: "____ you come to the party tomorrow?",
  options: ["Will", "Do", "Are", "Did"],
  answer: 0,
  explanation: "问将来的事，把 will 提到句首：Will you come...?（你明天会来吗？）",
  optionNotes: ["对：问将来用 Will you...?", "错：Do 问的是平时习惯，句里有 tomorrow", "错：Are 后面不能直接跟动词原形 come", "错：Did 问过去的事，和 tomorrow 矛盾"]
},
{
  id: "p2a-will-6", level: 1, module: "grammar", topic: "future-will",
  stem: "She ____ be twenty years old next year.",
  options: ["is", "was", "will", "are"],
  answer: 2,
  explanation: "next year（明年）是将来，用 will be：明年就二十岁了。",
  optionNotes: ["错：is 和 be 不能连用", "错：was 是过去式，和 next year 矛盾", "对：will + be，将来时", "错：are 不配 she，也不能和 be 连用"]
},

/* ---------------- imperative 3题 ---------------- */
{
  id: "p2a-imp-1", level: 1, module: "grammar", topic: "imperative",
  stem: "____ the door, please. It's cold outside.",
  options: ["Close", "Closes", "Closing", "Closed"],
  answer: 0,
  explanation: "让别人做事的祈使句，直接用动词原形开头：Close the door（把门关上）。",
  optionNotes: ["对：祈使句用动词原形开头", "错：祈使句没有主语，动词不加 s", "错：ing 形式不能单独发号施令", "错：closed 是过去式，祈使句只用原形"]
},
{
  id: "p2a-imp-2", level: 1, module: "grammar", topic: "imperative",
  stem: "____ be late for the meeting.",
  options: ["Don't", "Doesn't", "Not", "Isn't"],
  answer: 0,
  explanation: "祈使句的否定（别做某事）固定用 Don't 开头：Don't be late（别迟到）。",
  optionNotes: ["对：否定祈使句用 Don't 开头", "错：doesn't 用于陈述句的三单，祈使句不用", "错：Not 不能单独放句首否定", "错：Isn't 是 be 动词否定，不用于祈使句开头"]
},
{
  id: "p2a-imp-3", level: 1, module: "grammar", topic: "imperative",
  stem: "____ quiet, please. The baby is sleeping.",
  options: ["Be", "Is", "Are", "Being"],
  answer: 0,
  explanation: "祈使句用动词原形开头，be 动词的原形就是 be：Be quiet（安静）。",
  optionNotes: ["对：祈使句里 be 动词用原形 Be", "错：is 不是原形，不能开头发指令", "错：are 也不是原形", "错：being 是 ing 形式，不能用来发指令"]
},

/* ---------------- adverb-frequency 3题 ---------------- */
{
  id: "p2a-freq-1", level: 1, module: "grammar", topic: "adverb-frequency",
  stem: "He ____ gets up at six. He does it every day.",
  options: ["always", "never", "seldom", "sometimes"],
  answer: 0,
  explanation: "后半句说他天天如此，所以是“总是”：always（100%的频率）。",
  optionNotes: ["对：every day 天天做 = always 总是", "错：never 是“从不”，正好相反", "错：seldom 是“很少”，和天天做矛盾", "错：sometimes 是“有时”，频率不够"]
},
{
  id: "p2a-freq-2", level: 1, module: "grammar", topic: "adverb-frequency",
  stem: "I am ____ late for work. My boss likes me.",
  options: ["never", "always", "usually", "often"],
  answer: 0,
  explanation: "老板喜欢我，说明我“从不”迟到：never。注意频率词放在 be 动词后面。",
  optionNotes: ["对：从不迟到，老板才喜欢", "错：always late 是总迟到，老板不会喜欢", "错：usually late 是经常迟到，也不对", "错：often late 是常常迟到，同样说不通"]
},
{
  id: "p2a-freq-3", level: 1, module: "grammar", topic: "adverb-frequency",
  stem: "They ____ eat out, maybe once a year.",
  options: ["always", "seldom", "usually", "often"],
  answer: 1,
  explanation: "一年才出去吃一次，频率非常低，用 seldom（很少）。",
  optionNotes: ["错：always 是“总是”，和一年一次矛盾", "对：一年一次 = 很少 = seldom", "错：usually 是“通常”，频率太高了", "错：often 是“经常”，也太高了"]
},

/* ---------------- question-word 4题 ---------------- */
{
  id: "p2a-qw-1", level: 1, module: "grammar", topic: "question-word",
  stem: "____ do you live? — In Beijing.",
  options: ["Where", "What", "Who", "When"],
  answer: 0,
  explanation: "回答的是地点（在北京），所以问的是“在哪里”：Where。",
  optionNotes: ["对：答地点，用 Where 问", "错：What 问“什么”", "错：Who 问“谁”", "错：When 问“什么时候”"]
},
{
  id: "p2a-qw-2", level: 1, module: "grammar", topic: "question-word",
  stem: "____ is that man? — He is my uncle.",
  options: ["What", "Where", "Who", "How"],
  answer: 2,
  explanation: "回答的是人物身份（我叔叔），所以问的是“谁”：Who。",
  optionNotes: ["错：What 问东西或职业名称", "错：Where 问地点", "对：答“他是我叔叔”，问的是 Who（谁）", "错：How 问方式或状态"]
},
{
  id: "p2a-qw-3", level: 1, module: "grammar", topic: "question-word",
  stem: "____ do you go to work? — By bus.",
  options: ["How", "What", "Where", "Who"],
  answer: 0,
  explanation: "回答的是方式（坐公交），所以问的是“怎么去”：How。",
  optionNotes: ["对：答交通方式，用 How 问", "错：What 问“什么”", "错：Where 问地点，答案会是某个地方", "错：Who 问“谁”"]
},
{
  id: "p2a-qw-4", level: 1, module: "grammar", topic: "question-word",
  stem: "____ is your birthday? — It's in June.",
  options: ["Where", "When", "Who", "How"],
  answer: 1,
  explanation: "回答的是时间（六月），所以问的是“什么时候”：When。",
  optionNotes: ["错：Where 问地点", "对：答时间，用 When 问", "错：Who 问“谁”", "错：How 问方式"]
},

/* ---------------- tag-question 4题 ---------------- */
{
  id: "p2a-tag-1", level: 2, module: "grammar", topic: "tag-question",
  stem: "You are a teacher, ____?",
  options: ["aren't you", "are you", "isn't you", "don't you"],
  answer: 0,
  explanation: "反义疑问句：前面肯定，后面否定。前面是 you are，尾巴就是 aren't you。",
  optionNotes: ["对：前肯后否，are 变 aren't", "错：前面已经是肯定，尾巴要否定", "错：you 不能配 isn't", "错：句子里是 be 动词 are，尾巴不能换成 don't"]
},
{
  id: "p2a-tag-2", level: 2, module: "grammar", topic: "tag-question",
  stem: "She likes music, ____?",
  options: ["doesn't she", "does she", "isn't she", "likes she"],
  answer: 0,
  explanation: "前面是肯定的普通动词 likes（三单），尾巴用否定的 doesn't she。",
  optionNotes: ["对：三单动词 likes 的否定尾巴是 doesn't she", "错：前肯后否，尾巴不能还是肯定", "错：句子里是动词 likes 不是 be 动词，不能用 isn't", "错：尾巴要用助动词，不能重复动词本身"]
},
{
  id: "p2a-tag-3", level: 2, module: "grammar", topic: "tag-question",
  stem: "He can swim, ____?",
  options: ["can he", "can't he", "doesn't he", "isn't he"],
  answer: 1,
  explanation: "前面有情态动词 can（肯定），尾巴直接用它的否定：can't he。",
  optionNotes: ["错：前肯后否，尾巴要变否定", "对：can 的否定尾巴是 can't he", "错：句子里有 can，尾巴要跟着用 can，不用 doesn't", "错：句子里没有 be 动词，不能用 isn't"]
},
{
  id: "p2a-tag-4", level: 2, module: "grammar", topic: "tag-question",
  stem: "They don't work on Sundays, ____?",
  options: ["don't they", "do they", "are they", "aren't they"],
  answer: 1,
  explanation: "前面是否定（don't），尾巴要用肯定：do they。记住：前否后肯，前肯后否。",
  optionNotes: ["错：前面已经否定了，尾巴不能再否定", "对：前否后肯，用 do they", "错：句子里是动词 work，不是 be 动词", "错：aren't 也是 be 动词的形式，用不上"]
}
]);
