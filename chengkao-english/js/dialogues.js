/* ============================================================================
 * dialogues.js  ——  情景对话库（教材式范例对话：读 + 听🔊 + 点开看翻译）
 * 每段对话贴近成考「补全对话」高频情景，句子简单(A2)，可自行增改。
 * 字段：id / title / scene(中文情景) / level / lines:[{who:'A'|'B', en, zh}]
 * ========================================================================== */

window.DIALOGUES = [
  {
    id: "dlg-greet", title: "打招呼 · 初次见面", scene: "你第一次见到新同学，互相认识一下。", level: 1,
    lines: [
      { who: "A", en: "Hi! My name is Li Ming. What's your name?", zh: "你好！我叫李明。你叫什么名字？" },
      { who: "B", en: "Hello, Li Ming. I'm Wang Fang. Nice to meet you.", zh: "你好，李明。我是王芳。很高兴认识你。" },
      { who: "A", en: "Nice to meet you, too. Are you a new student here?", zh: "我也很高兴认识你。你是这里的新学生吗？" },
      { who: "B", en: "Yes, I am. I hope we can be good friends.", zh: "是的。我希望我们能成为好朋友。" },
      { who: "A", en: "Me too. See you in class!", zh: "我也是。课上见！" },
    ],
  },
  {
    id: "dlg-shop", title: "购物 · 买衬衫", scene: "你在商店想买一件衬衫。", level: 1,
    lines: [
      { who: "A", en: "Can I help you?", zh: "需要帮忙吗？" },
      { who: "B", en: "Yes, please. I'd like to buy a shirt.", zh: "好的，麻烦了。我想买一件衬衫。" },
      { who: "A", en: "What color do you like?", zh: "你喜欢什么颜色？" },
      { who: "B", en: "Blue, please. How much is it?", zh: "蓝色的。多少钱？" },
      { who: "A", en: "It's fifty yuan.", zh: "五十块。" },
      { who: "B", en: "OK, I'll take it. Thank you.", zh: "好的，我要了。谢谢。" },
    ],
  },
  {
    id: "dlg-restaurant", title: "餐厅 · 点餐", scene: "你在餐厅点菜。", level: 1,
    lines: [
      { who: "A", en: "Good evening. Are you ready to order?", zh: "晚上好。可以点餐了吗？" },
      { who: "B", en: "Yes. I'd like a hamburger and a cup of tea.", zh: "可以。我要一个汉堡和一杯茶。" },
      { who: "A", en: "Anything else?", zh: "还要别的吗？" },
      { who: "B", en: "No, thanks. That's all.", zh: "不用了，谢谢。就这些。" },
      { who: "A", en: "OK. Please wait a moment.", zh: "好的，请稍等。" },
    ],
  },
  {
    id: "dlg-doctor", title: "看病 · 感冒了", scene: "你不舒服，去看医生。", level: 2,
    lines: [
      { who: "A", en: "What's wrong with you?", zh: "你怎么了？" },
      { who: "B", en: "I have a headache and a cough.", zh: "我头疼，还咳嗽。" },
      { who: "A", en: "How long have you been like this?", zh: "这样多久了？" },
      { who: "B", en: "For two days.", zh: "两天了。" },
      { who: "A", en: "You have a cold. Take this medicine and drink more water.", zh: "你感冒了。吃这个药，多喝水。" },
      { who: "B", en: "Thank you, doctor.", zh: "谢谢您，医生。" },
    ],
  },
  {
    id: "dlg-way", title: "问路 · 去火车站", scene: "你在街上迷路了，向路人问路。", level: 2,
    lines: [
      { who: "A", en: "Excuse me, how can I get to the train station?", zh: "打扰一下，请问怎么去火车站？" },
      { who: "B", en: "Go straight and turn left at the second crossing.", zh: "一直走，在第二个路口左转。" },
      { who: "A", en: "Is it far from here?", zh: "离这儿远吗？" },
      { who: "B", en: "No, it's about ten minutes on foot.", zh: "不远，走路大约十分钟。" },
      { who: "A", en: "Thank you very much.", zh: "非常感谢。" },
      { who: "B", en: "You're welcome.", zh: "不客气。" },
    ],
  },
  {
    id: "dlg-phone", title: "打电话 · 找人", scene: "你打电话找 Tom。", level: 2,
    lines: [
      { who: "A", en: "Hello, may I speak to Tom?", zh: "你好，我可以和 Tom 通话吗？" },
      { who: "B", en: "This is Tom speaking. Who's that?", zh: "我就是 Tom。你是哪位？" },
      { who: "A", en: "It's Li Ming. Are you free this Sunday?", zh: "我是李明。你这周日有空吗？" },
      { who: "B", en: "Yes. What's up?", zh: "有空。怎么了？" },
      { who: "A", en: "Let's play basketball together.", zh: "我们一起打篮球吧。" },
      { who: "B", en: "Good idea! See you then.", zh: "好主意！到时候见。" },
    ],
  },
  {
    id: "dlg-invite", title: "邀请 · 生日聚会", scene: "你邀请朋友来参加生日聚会。", level: 2,
    lines: [
      { who: "A", en: "Would you like to come to my birthday party?", zh: "你愿意来我的生日聚会吗？" },
      { who: "B", en: "I'd love to. When is it?", zh: "我很乐意。什么时候？" },
      { who: "A", en: "This Saturday evening at seven.", zh: "这周六晚上七点。" },
      { who: "B", en: "Where shall we meet?", zh: "我们在哪儿见面？" },
      { who: "A", en: "At my home. See you there!", zh: "在我家。到时候见！" },
    ],
  },
  {
    id: "dlg-sorry", title: "道歉 · 迟到了", scene: "你迟到了，向朋友道歉。", level: 1,
    lines: [
      { who: "A", en: "I'm sorry I'm late. The bus was slow.", zh: "对不起我迟到了。公交车太慢了。" },
      { who: "B", en: "That's all right. Don't worry.", zh: "没关系，别担心。" },
      { who: "A", en: "Have you waited long?", zh: "你等很久了吗？" },
      { who: "B", en: "No, just a few minutes. Let's go in.", zh: "没有，就几分钟。我们进去吧。" },
    ],
  },
  {
    id: "dlg-weather", title: "谈天气 · 周末计划", scene: "你和朋友聊天气和周末安排。", level: 2,
    lines: [
      { who: "A", en: "What's the weather like today?", zh: "今天天气怎么样？" },
      { who: "B", en: "It's sunny and warm.", zh: "晴天，很暖和。" },
      { who: "A", en: "Great! Shall we go to the park this weekend?", zh: "太好了！我们周末去公园吧？" },
      { who: "B", en: "Sure. But I heard it may rain on Sunday.", zh: "好啊。不过我听说周日可能下雨。" },
      { who: "A", en: "Then let's go on Saturday.", zh: "那我们周六去吧。" },
    ],
  },
  {
    id: "dlg-borrow", title: "借东西 · 借书", scene: "你想向同学借一本书。", level: 1,
    lines: [
      { who: "A", en: "Could you lend me your English book?", zh: "你能把你的英语书借我吗？" },
      { who: "B", en: "Sure. Here you are.", zh: "当然。给你。" },
      { who: "A", en: "Thank you. I'll give it back tomorrow.", zh: "谢谢。我明天还你。" },
      { who: "B", en: "No hurry. Take your time.", zh: "不急，慢慢来。" },
    ],
  },
];
