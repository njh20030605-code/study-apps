/* ============================================================================
 * readings.js  ——  每章配套「课文精读」（按章号 no 索引）
 * 每篇 3-6 句，A2 难度，密集使用本章语法点。点句子看翻译，可整句朗读。
 * 字段：{ title, tip(中文,读前提示看什么), sents: [{en, zh}] }
 * ========================================================================== */

window.READINGS = {

1: {
  title: "My Family",
  tip: "注意每句的 am / is / are / was 是怎么跟着主语变的。",
  sents: [
    { en: "I am a worker in a big city.", zh: "我是大城市里的一名工人。" },
    { en: "My father is a driver, and my mother is a nurse.", zh: "我爸爸是司机，我妈妈是护士。" },
    { en: "They are very kind to people.", zh: "他们对人都很和善。" },
    { en: "My sister and I are good friends.", zh: "我和姐姐是好朋友。" },
    { en: "Last year I was a student, but now I am a worker.", zh: "去年我还是学生，但现在我是工人了。" },
  ],
},

2: {
  title: "Our Classroom",
  tip: "找出所有复数名词（加 s / 不规则），和 There is / There are 的用法。",
  sents: [
    { en: "There is a big classroom in our school.", zh: "我们学校有一间大教室。" },
    { en: "There are forty desks and forty chairs in it.", zh: "教室里有四十张课桌和四十把椅子。" },
    { en: "There are three children at the door.", zh: "门口有三个孩子。" },
    { en: "The two men near the window are our teachers.", zh: "窗边的两个男人是我们的老师。" },
    { en: "There is some water in the bottle on the desk.", zh: "课桌上的瓶子里有一些水。" },
  ],
},

3: {
  title: "A Gift",
  tip: "注意 a / an / the 什么时候用：第一次提到用 a/an，第二次就变 the。",
  sents: [
    { en: "Yesterday I bought a bag and an umbrella.", zh: "昨天我买了一个包和一把伞。" },
    { en: "The bag is for my mother, and the umbrella is for my father.", zh: "包是给妈妈的，伞是给爸爸的。" },
    { en: "My mother is a nurse, and she works eight hours a day.", zh: "我妈妈是护士，一天工作八小时。" },
    { en: "She plays the piano in the evening.", zh: "她晚上弹钢琴。" },
    { en: "The sun was bright, and we had a happy day.", zh: "阳光很好，我们度过了开心的一天。" },
  ],
},

4: {
  title: "My Best Friend",
  tip: "圈出 he / him / his / mine 这些代词，看它们在句子里当什么成分。",
  sents: [
    { en: "Wang Lei is my best friend, and I like him very much.", zh: "王磊是我最好的朋友，我非常喜欢他。" },
    { en: "His home is near mine, so we often walk together.", zh: "他家离我家很近，所以我们常一起走。" },
    { en: "He always helps me, and I also help him.", zh: "他总是帮我，我也帮他。" },
    { en: "This is his bike, and that one is mine.", zh: "这辆是他的自行车，那辆是我的。" },
    { en: "We enjoy ourselves every weekend.", zh: "我们每个周末都玩得很开心。" },
  ],
},

5: {
  title: "Lily's Day",
  tip: "主语是 she（第三人称单数），注意每个动词后面的 s / es。",
  sents: [
    { en: "Lily gets up at six every morning.", zh: "莉莉每天早上六点起床。" },
    { en: "She goes to work by bus.", zh: "她坐公交车上班。" },
    { en: "She has lunch at a small restaurant.", zh: "她在一家小餐馆吃午饭。" },
    { en: "She doesn't watch TV in the evening; she studies English.", zh: "她晚上不看电视，而是学英语。" },
    { en: "Her friends say she works very hard.", zh: "她的朋友们说她工作非常努力。" },
  ],
},

6: {
  title: "A Busy Morning",
  tip: "整篇都在说“正在做”：注意 be + 动词ing 两件套。",
  sents: [
    { en: "It is eight o'clock in the morning.", zh: "现在是早上八点。" },
    { en: "Father is reading a newspaper in the living room.", zh: "爸爸正在客厅看报纸。" },
    { en: "Mother is cooking breakfast in the kitchen.", zh: "妈妈正在厨房做早饭。" },
    { en: "Listen! My little brother is singing in his room.", zh: "听！我弟弟正在他房间里唱歌。" },
    { en: "I am not playing; I am getting ready for work.", zh: "我没在玩，我正准备去上班。" },
  ],
},

7: {
  title: "In the Kitchen",
  tip: "注意 some / any / many / much / a few / a little 后面的名词能不能数。",
  sents: [
    { en: "There are some eggs and a few apples in the fridge.", zh: "冰箱里有一些鸡蛋和几个苹果。" },
    { en: "But there isn't much milk.", zh: "但是牛奶不多了。" },
    { en: "We don't have any bread, either.", zh: "我们也没有面包了。" },
    { en: "How many eggs do we need for the cake?", zh: "做蛋糕我们需要几个鸡蛋？" },
    { en: "Only a little sugar is left, so I will buy some.", zh: "糖只剩一点点了，所以我去买一些。" },
  ],
},

8: {
  title: "My Week",
  tip: "圈出所有 in / on / at，想一想为什么这样搭配。",
  sents: [
    { en: "I get up at six thirty in the morning.", zh: "我早上六点半起床。" },
    { en: "On Monday morning, we have a meeting at the office.", zh: "周一早上我们在办公室开会。" },
    { en: "I was born in 1998, in a small town.", zh: "我 1998 年出生在一个小镇。" },
    { en: "There is a map on the wall of my room.", zh: "我房间的墙上有一张地图。" },
    { en: "At night, I like reading at home.", zh: "晚上我喜欢在家看书。" },
  ],
},

9: {
  title: "Rules at Work",
  tip: "注意 can / must / may 后面全是动词原形，没有 to 也不加 s。",
  sents: [
    { en: "Everyone must come to work on time.", zh: "每个人都必须按时上班。" },
    { en: "You mustn't smoke in the office.", zh: "办公室里禁止吸烟。" },
    { en: "You can have a rest at noon.", zh: "中午你可以休息。" },
    { en: "May I leave early today? My son is ill.", zh: "我今天可以早点走吗？我儿子病了。" },
    { en: "You'd better ask the manager first.", zh: "你最好先问一下经理。" },
  ],
},

10: {
  title: "Weekend Plan",
  tip: "对比 will 和 be going to；最后一句注意 if 后面用的是现在时。",
  sents: [
    { en: "It is Friday evening, and we are talking about the weekend.", zh: "周五晚上，我们在聊周末的安排。" },
    { en: "I am going to visit my parents on Saturday.", zh: "我周六打算去看望父母。（早就计划好）" },
    { en: "My wife will do some shopping in the afternoon.", zh: "我妻子下午会去买些东西。" },
    { en: "Look at the dark clouds—it is going to rain.", zh: "看那乌云——要下雨了。（有迹象）" },
    { en: "If it rains on Sunday, we will stay at home.", zh: "如果周日下雨，我们就待在家。" },
  ],
},

11: {
  title: "Advice from Mom",
  tip: "祈使句用动词原形开头；注意 always / never / usually 放的位置。",
  sents: [
    { en: "Get up early, and don't be late for work.", zh: "早点起床，上班别迟到。" },
    { en: "Eat breakfast every day; it is important.", zh: "每天都要吃早饭，这很重要。" },
    { en: "My mom always says these words to me.", zh: "我妈妈总是对我说这些话。" },
    { en: "She is never angry, but she is usually serious.", zh: "她从不发火，但通常很严肃。" },
    { en: "Never give up, and you will make it.", zh: "永不放弃，你就会成功。" },
  ],
},

12: {
  title: "A Phone Call",
  tip: "看疑问词怎么问、反意疑问句的“小尾巴”，以及回答只看事实。",
  sents: [
    { en: "— Hello! May I speak to Li Hua? — Speaking.", zh: "——你好！请找李华。——我就是。" },
    { en: "— Where are you now? You are at home, aren't you?", zh: "——你现在在哪儿？你在家，对吧？" },
    { en: "— Yes, I am. What's up?", zh: "——是的，我在家。什么事？" },
    { en: "— You didn't forget our meeting, did you?", zh: "——你没忘我们的会吧？" },
    { en: "— No, I didn't. Let's meet at two, shall we?", zh: "——没忘。我们两点见，好吗？" },
  ],
},

13: {
  title: "Two Cities",
  tip: "找出比较级、最高级、as...as，注意 than 前后在比什么。",
  sents: [
    { en: "My hometown is much smaller than Shanghai.", zh: "我的家乡比上海小得多。" },
    { en: "But the air there is fresher, and life is easier.", zh: "但那里的空气更新鲜，生活也更轻松。" },
    { en: "Shanghai is one of the biggest cities in China.", zh: "上海是中国最大的城市之一。" },
    { en: "Living there is not as cheap as living in my hometown.", zh: "在那儿生活不像在我家乡那么便宜。" },
    { en: "The more I travel, the more I love my hometown.", zh: "我走的地方越多，就越爱我的家乡。" },
  ],
},

14: {
  title: "An Old Friend",
  tip: "注意 have/has + 过去分词，since / for / already / ever 这些信号词。",
  sents: [
    { en: "I have known Wang Ming for ten years.", zh: "我认识王明十年了。" },
    { en: "He has lived in Beijing since 2016.", zh: "他从 2016 年起就住在北京。" },
    { en: "We have already talked on the phone many times.", zh: "我们已经通过很多次电话了。" },
    { en: "Have you ever been to Beijing? I have been there twice.", zh: "你去过北京吗？我去过两次。" },
    { en: "He has just found a new job, so he is very happy.", zh: "他刚找到一份新工作，所以很开心。" },
  ],
},

15: {
  title: "A Rainy Night",
  tip: "三种“过去”同台：was doing（正在）、had done（更早的过去）、used to（过去常常）。",
  sents: [
    { en: "Last night, I was cooking when the phone rang.", zh: "昨晚电话响的时候，我正在做饭。" },
    { en: "It was my old classmate, Li Lei.", zh: "是我的老同学李雷。" },
    { en: "We used to play basketball together after school.", zh: "我们以前放学后常一起打篮球。" },
    { en: "He said he had moved to our city a week before.", zh: "他说他一周前就搬到了我们城市。（搬家发生在“说”之前）" },
    { en: "While we were talking, the rain was getting heavier.", zh: "我们聊天的时候，雨越下越大。" },
  ],
},

16: {
  title: "Our Factory",
  tip: "整篇是被动语态：be + 过去分词，时态藏在 be 里。",
  sents: [
    { en: "Our factory was built in 1995.", zh: "我们工厂建于 1995 年。" },
    { en: "Many machines are used in it every day.", zh: "厂里每天都要用到很多机器。" },
    { en: "The products are sold to many countries.", zh: "产品被卖到很多国家。" },
    { en: "Last month, a new workshop was opened.", zh: "上个月新开了一个车间。" },
    { en: "More workers will be needed next year.", zh: "明年会需要更多工人。" },
  ],
},

17: {
  title: "An Exciting Film",
  tip: "注意 -ing（令人…/主动）和 -ed（感到…/被动），还有 enjoy doing、want to do。",
  sents: [
    { en: "Last night we saw an exciting film.", zh: "昨晚我们看了一部激动人心的电影。" },
    { en: "Everyone was excited after watching it.", zh: "看完后每个人都很兴奋。" },
    { en: "I enjoy watching films with my friends.", zh: "我喜欢和朋友们一起看电影。" },
    { en: "The girl sitting next to me kept laughing.", zh: "坐在我旁边的女孩一直在笑。" },
    { en: "We want to see it again next week.", zh: "我们想下周再看一遍。" },
  ],
},

18: {
  title: "A Heavy Box",
  tip: "同一件事的三种说法：too...to / so...that / enough to。",
  sents: [
    { en: "The box was too heavy for me to carry.", zh: "这个箱子太重了，我搬不动。" },
    { en: "It was so heavy that I had to ask for help.", zh: "它重到我不得不找人帮忙。" },
    { en: "Luckily, my brother is strong enough to carry it.", zh: "幸好我弟弟力气够大，搬得动。" },
    { en: "He carried it upstairs and was too tired to say a word.", zh: "他把箱子搬上楼，累得一句话都说不出来。" },
    { en: "It was such a heavy box that we never want to move it again.", zh: "这箱子太重了，我们再也不想搬它了。" },
  ],
},

19: {
  title: "If It Rains",
  tip: "找连词：but / because / so / if / unless；注意 if 从句用现在时。",
  sents: [
    { en: "We want to go climbing on Sunday, but the weather may be bad.", zh: "我们想周日去爬山，但天气可能不好。" },
    { en: "If it rains, we will watch a film at home instead.", zh: "如果下雨，我们就改在家看电影。" },
    { en: "I will take an umbrella in case it rains.", zh: "我会带把伞，以防下雨。" },
    { en: "We won't start early unless everyone is ready.", zh: "除非大家都准备好了，否则我们不会早出发。" },
    { en: "Although the plan is simple, we are all happy, because we will be together.", zh: "虽然计划很简单，我们都很开心，因为我们会在一起。" },
  ],
},

20: {
  title: "The Man Who Helps Us",
  tip: "每句都有定语从句：who / which / that / whose / where 各自修饰谁？",
  sents: [
    { en: "Mr. Zhang is the man who guards our building.", zh: "张师傅就是看守我们大楼的人。" },
    { en: "He has a dog which follows him everywhere.", zh: "他有一条到哪儿都跟着他的狗。" },
    { en: "The room where he lives is small but clean.", zh: "他住的房间小但干净。" },
    { en: "People whose packages are lost always ask him for help.", zh: "丢了包裹的人总是找他帮忙。" },
    { en: "He is the kindest man that I have ever met.", zh: "他是我见过的最善良的人。" },
  ],
},

21: {
  title: "Giving Up Smoking",
  tip: "圈出固定搭配：give up / depend on / look forward to / take care of…",
  sents: [
    { en: "My father gave up smoking last year.", zh: "我爸爸去年戒了烟。" },
    { en: "At first, it depended on his strong will.", zh: "起初，这全靠他坚强的意志。" },
    { en: "Now he takes good care of his health.", zh: "现在他很注意照顾自己的健康。" },
    { en: "He is interested in running and is good at it.", zh: "他喜欢上了跑步，而且跑得不错。" },
    { en: "We are all looking forward to seeing a healthier him.", zh: "我们都盼着看到一个更健康的他。" },
  ],
},

22: {
  title: "If I Were You",
  tip: "全是虚拟语气：注意 were、(should)+原形、had done + would have done。",
  sents: [
    { en: "Li Hua failed the exam again and felt sad.", zh: "李华又没通过考试，很难过。" },
    { en: "If I were you, I would make a study plan first.", zh: "我要是你，就先做一个学习计划。" },
    { en: "I suggest that you (should) review words every day.", zh: "我建议你每天复习单词。" },
    { en: "If you had started earlier, you would have passed it.", zh: "你要是早点开始，就已经通过了。（当初没通过）" },
    { en: "How I wish I knew English well!", zh: "我多希望自己英语好啊！（现在并不好）" },
  ],
},

23: {
  title: "Never Have I Seen",
  tip: "找倒装（否定词开头、So do I）和强调句 It was...that...。",
  sents: [
    { en: "Never have I seen such a beautiful mountain.", zh: "我从没见过这么美的山。" },
    { en: "Not only did we take photos, but we also camped there.", zh: "我们不但拍了照，还在那儿露营了。" },
    { en: "It was my friend that chose this place.", zh: "选这个地方的正是我的朋友。" },
    { en: "— I want to come again. — So do I.", zh: "——我还想再来。——我也是。" },
    { en: "Here comes the bus; let's go home.", zh: "公交车来了，我们回家吧。" },
  ],
},

24: {
  title: "What He Said",
  tip: "从句当名词用：注意从句全是陈述语序，whether 表“是否”。",
  sents: [
    { en: "What the doctor said made me think a lot.", zh: "医生的话让我想了很多。" },
    { en: "He said that I needed more sleep.", zh: "他说我需要更多睡眠。" },
    { en: "I don't know why I always stay up late.", zh: "我不知道自己为什么总是熬夜。" },
    { en: "Whether I can change depends on myself.", zh: "能不能改变取决于我自己。" },
    { en: "The truth is that health comes first.", zh: "事实是：健康第一。" },
  ],
},

25: {
  title: "Read Aloud: Sounds",
  tip: "这篇请出声朗读🔊：体会 ea、oo、-ed 在不同词里的读音。",
  sents: [
    { en: "Please read this and eat some bread.", zh: "请读读这个，再吃点面包。（read /iː/，bread /e/）" },
    { en: "The food in this school is really good.", zh: "这个学校的食物真不错。（food /uː/，good /ʊ/）" },
    { en: "He played all day and then helped his mother.", zh: "他玩了一整天，然后帮妈妈干活。（played /d/，helped /t/）" },
    { en: "She wanted a great name for her cat.", zh: "她想给猫起个好名字。（wanted /ɪd/，great /eɪ/，name /eɪ/，cat /æ/）" },
    { en: "My dogs and cats sit in two buses.", zh: "我的狗和猫坐在两辆公交车上。（dogs /z/，cats /s/，buses /ɪz/）" },
  ],
},

26: {
  title: "Model Dialogue",
  tip: "把这段对话读熟：谢、歉、邀、电话的标准应答全在里面。",
  sents: [
    { en: "— Thank you for your help. — You're welcome.", zh: "——谢谢你的帮助。——不客气。" },
    { en: "— I'm sorry I'm late. — It doesn't matter.", zh: "——抱歉我迟到了。——没关系。" },
    { en: "— Would you like to have dinner with us? — I'd love to.", zh: "——愿意和我们一起吃晚饭吗？——我很乐意。" },
    { en: "— Would you like some tea? — Yes, please.", zh: "——来点茶吗？——好的，谢谢。" },
    { en: "— Goodbye, and see you tomorrow. — See you.", zh: "——再见，明天见。——再见。" },
  ],
},

27: {
  title: "Poor but Happy",
  tip: "读的时候注意 but / so / because 前后的逻辑关系——完形靠它们拿分。",
  sents: [
    { en: "Old Tom is poor, but he is always happy.", zh: "老汤姆很穷，但他总是很快乐。" },
    { en: "He has little money, so he lives in a small house.", zh: "他没什么钱，所以住在小房子里。" },
    { en: "People like him because he often helps others.", zh: "人们喜欢他，因为他常帮助别人。" },
    { en: "He says money is useful, but happiness is more important.", zh: "他说钱有用，但快乐更重要。" },
    { en: "If you meet him, you will like him, too.", zh: "如果你遇到他，你也会喜欢他。" },
  ],
},

28: {
  title: "Practice Reading",
  tip: "用这篇练「先看题→回原文定位」：先想“他几点出门？在哪儿吃午饭？”再去文中找。",
  sents: [
    { en: "Mr. Green works in a bank near the park.", zh: "格林先生在公园附近的一家银行工作。" },
    { en: "He leaves home at seven thirty every morning.", zh: "他每天早上七点半出门。" },
    { en: "At noon, he has lunch at a small restaurant next to the bank.", zh: "中午他在银行隔壁的小餐馆吃午饭。" },
    { en: "After work, he often runs in the park for half an hour.", zh: "下班后他常在公园跑半小时步。" },
    { en: "He says running makes him feel young.", zh: "他说跑步让他觉得年轻。" },
  ],
},

};
