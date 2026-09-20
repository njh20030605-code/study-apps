/* ============================================================================
 * strategy.js —— 应试策略配置（唯一事实来源）
 * ----------------------------------------------------------------------------
 * 整个 App 的目标分、板块权重、答题顺序、7 大语法考点、写作模板、对话场景、
 * 阅读套路、生词标准，全部读这一个对象。改策略 = 只改这个文件。
 * 外面包 window.STRATEGY 是为了 file:// 双击也能加载（.json 会被浏览器挡）。
 * ========================================================================== */

window.STRATEGY = {
  "meta": {
    "version": "1.0",
    "exam": "成人高考专升本英语",
    "total_score": 150,
    "duration_minutes": 150,
    "target_score": 70,
    "safe_target_score": 87,
    "note": "试卷结构以最近两年真题为准。若真题与本配置不一致，以真题为准并同步修改 sections。"
  },

  "config": {
    "sections": [
      { "key": "phonetics",  "name": "语音",        "count": 5,  "per": 1, "full": 5,  "target": 1,  "time_ref": 2,  "strategy": "零投入，统一蒙同一字母", "invest": false, "en": "Ⅰ. Phonetics", "directions": "In each of the following groups of words, there are four underlined letters or letter combinations marked A, B, C and D. Compare the underlined parts and identify the one that is different from the others in pronunciation. Mark your answer by blackening the corresponding letter on the Answer Sheet." },
      { "key": "grammar",    "name": "语法与词汇",  "count": 15, "per": 1, "full": 15, "target": 9,  "time_ref": 10, "strategy": "只覆盖7大高频考点", "invest": true, "en": "Ⅱ. Vocabulary and Structure", "directions": "There are 15 incomplete sentences in this section. For each sentence there are four choices marked A, B, C and D. Choose one answer that best completes the sentence and blacken the corresponding letter on the Answer Sheet." },
      { "key": "cloze",      "name": "完形填空",    "count": 15, "per": 2, "full": 30, "target": 12, "time_ref": 20, "strategy": "不专项训练，靠其他模块溢出", "invest": false, "en": "Ⅲ. Cloze", "directions": "For each blank in the following passage, there are four choices marked A, B, C and D. Choose the one that is most suitable and mark your answer by blackening the corresponding letter on the Answer Sheet." },
      { "key": "reading",    "name": "阅读理解",    "count": 20, "per": 3, "full": 60, "target": 36, "time_ref": 50, "strategy": "最大投入，占英语时间50%", "invest": true, "en": "Ⅳ. Reading Comprehension", "directions": "There are five reading passages in this part. Each passage is followed by four questions. For each question there are four suggested answers marked A, B, C and D. Choose the best answer and blacken the corresponding letter on the Answer Sheet." },
      { "key": "dialogue",   "name": "补全对话",    "count": 5,  "per": 3, "full": 15, "target": 11, "time_ref": 8,  "strategy": "模板化，优先拿下", "invest": true, "en": "Ⅴ. Daily Conversation", "directions": "Pick out appropriate expressions from the eight choices below and complete the following dialogue by blackening the corresponding letter on the Answer Sheet." },
      { "key": "writing",    "name": "短文写作",    "count": 1,  "per": 25, "full": 25, "target": 18, "time_ref": 35, "strategy": "模板化，优先拿下", "invest": true, "en": "Ⅵ. Writing", "directions": "For this part, you are supposed to write an essay in about 100-120 words based on the following situation. Remember to write it clearly." }
    ],
    "answer_order": ["dialogue", "writing", "grammar", "reading", "cloze", "phonetics"],
    "phonetics_default_answer": "C",
    "reading_target_rate": 0.6,
    "reading_priority": {
      "必做": ["细节题", "词义猜测题"],
      "次做": ["主旨题"],
      "可放弃": ["推断题", "态度题"]
    },
    "subject_time_split": { "politics": 0.4, "english": 0.35, "math2": 0.25 },
    "weekly_budget_hours": 11,
    "weekday_minutes": 60,
    "weekend_minutes": 180,
    "stages": [
      { "stage": "W1-2", "weeks": [1, 2],           "focus": "写作模板 + 补全对话场景句", "timed": false, "note": "不碰阅读整套" },
      { "stage": "W3-6", "weeks": [3, 4, 5, 6],     "focus": "真题精做（不计时）+ 每天一篇阅读 + 生词回收 + 7大语法", "timed": false, "note": "每天必须真做一篇阅读理解（周末加一篇完形）——阅读60+完形30=全卷60%" },
      { "stage": "W7-9", "weeks": [7, 8, 9],        "focus": "真题全真模考（150分钟计时）+ 错题归因", "timed": true, "note": "每周日跑 TASK_MOCK_REVIEW" },
      { "stage": "W10",  "weeks": [10, 11],         "focus": "模板默写 + 生词表过3遍 + 高频语法重看", "timed": false, "note": "另分配10小时给高数二纯公式题" }
    ],
    "srs_intervals": {
      "RECOGNIZE": [1, 3, 7, 21],
      "SPELL": [1, 2, 5, 14]
    }
  },

  "error_classes": [
    { "code": "VOCAB",  "name": "不认识关键词",           "fix": "进生词回收表，按 RECOGNIZE 标准复习", "module": "vocab" },
    { "code": "SYNTAX", "name": "词都认识但句子读不懂",   "fix": "长句三步拆解专项训练",                 "module": "sentence_drill" },
    { "code": "TRAP",   "name": "读懂了但选错",           "fix": "按 trap_pattern 聚类，总结出题套路",   "module": "reading" },
    { "code": "TIME",   "name": "没时间做",               "fix": "调整答题顺序，执行放弃策略",           "module": "mock" },
    { "code": "NONE",   "name": "蒙对或本来就对",         "fix": null,                                   "module": null }
  ],

  "sentence_dissection": {
    "name": "长句三步拆解法",
    "steps": [
      { "step": 1, "action": "找主句谓语动词", "how": "第一个不在从句内、不在介词短语内、非 -ing/-ed 形式的动词" },
      { "step": 2, "action": "划掉所有修饰成分", "how": "介词短语 / 分词短语 / 定语从句 / 状语从句 / 同位语 / 插入语" },
      { "step": 3, "action": "翻译主干再回加修饰", "how": "先翻主+谓+宾，确认无误后逐层加回修饰成分" }
    ]
  },

  "writing": {
    "score": 25,
    "word_range": [100, 120],
    "scoring_basis": "切题 + 三段结构清晰 + 词数达标 + 无低级语法错误。词汇高级度权重很低。",
    "error_classes": [
      { "code": "AGREEMENT", "name": "第三人称单数漏s",  "example_wrong": "He like reading.",        "example_right": "He likes reading." },
      { "code": "TENSE",     "name": "时态前后不一致",    "example_wrong": "He went there and buy a book.", "example_right": "He went there and bought a book." },
      { "code": "PLURAL",    "name": "名词单复数",        "example_wrong": "many student",           "example_right": "many students" },
      { "code": "NO_VERB",   "name": "句子缺谓语",        "example_wrong": "He very happy.",         "example_right": "He is very happy." },
      { "code": "SPELLING",  "name": "拼写",              "example_wrong": "recieve",                "example_right": "receive" }
    ],
    "upgrades": [
      { "from": "very",       "to": "extremely" },
      { "from": "good",       "to": "beneficial" },
      { "from": "important",  "to": "significant" },
      { "from": "so",         "to": "therefore" },
      { "from": "but",        "to": "however" },
      { "from": "and",        "to": "moreover / what's more" },
      { "from": "I think",    "to": "in my opinion / from my point of view" },
      { "from": "many",       "to": "a large number of" },
      { "from": "get",        "to": "obtain" },
      { "from": "help",       "to": "be of great help to" },
      { "from": "because",    "to": "due to the fact that" },
      { "from": "in the end", "to": "in conclusion" }
    ],
    "templates": [
      {
        "id": "letter",
        "name": "书信通用模板",
        "covers": ["邀请", "感谢", "申请", "建议", "道歉", "询问"],
        "skeleton": "Dear {{recipient}},\n\n    I am writing to {{purpose}}. {{background_sentence}}\n\n    There are several points I would like to mention. First, {{point1}}. Second, {{point2}}. What's more, {{point3}}.\n\n    I would be very grateful if you could {{request}}. Looking forward to your reply.\n\n                                                Yours sincerely,\n                                                Li Ming",
        "slots": {
          "recipient": ["Mr. Smith", "Sir or Madam", "Tom", "Manager"],
          "purpose": [
            "invite you to attend our English Speech Contest",
            "express my sincere thanks for your kind help",
            "apply for the position of sales assistant",
            "make some suggestions about our school library",
            "apologize for not being able to attend the meeting"
          ],
          "request": [
            "give me a reply at your earliest convenience",
            "take my suggestions into consideration",
            "consider my application",
            "let me know your decision"
          ]
        },
        "estimated_words": 105,
        "spell_required": ["writing", "grateful", "sincerely", "consideration", "convenience", "apologize", "attend", "position", "suggestions", "reply"]
      },
      {
        "id": "argument",
        "name": "议论/看法模板",
        "covers": ["对某现象的看法", "利弊分析", "是否同意某观点"],
        "skeleton": "Nowadays, {{topic}} has become a common topic among us. Some people think {{view_a}}, while others hold a different view.\n\n    In my opinion, {{my_view}}. There are several reasons. First, {{reason1}}. Second, {{reason2}}. Besides, {{reason3}}.\n\n    To sum up, {{topic_short}} plays a significant role in our life. Therefore, we should {{action}}.",
        "slots": {
          "topic": ["online shopping", "using mobile phones at school", "doing part-time jobs", "learning English", "physical exercise"],
          "my_view": ["it does more good than harm", "we should treat it in a reasonable way", "its advantages outweigh its disadvantages"],
          "action": ["make full use of it", "pay more attention to it", "take action as soon as possible"]
        },
        "estimated_words": 110,
        "spell_required": ["nowadays", "common", "opinion", "several", "reasons", "besides", "significant", "therefore", "advantages", "disadvantages"]
      },
      {
        "id": "notice",
        "name": "通知模板",
        "covers": ["活动通知", "会议通知", "变更通知"],
        "skeleton": "                              Notice\n\n    In order to {{aim}}, {{organizer}} will hold {{event}} at {{place}} on {{time}}.\n\n    All the {{audience}} are expected to attend it on time. Please {{preparation}} before {{deadline}}. The activity is expected to last about {{duration}}.\n\n    If you have any questions, please contact {{contact}}.\n\n                                                {{signature}}\n                                                {{date}}",
        "slots": {
          "aim": ["improve our English", "enrich our school life", "strengthen our teamwork"],
          "organizer": ["our school", "the Students' Union", "our company"],
          "event": ["an English Speech Contest", "a lecture on modern technology", "a sports meeting"],
          "audience": ["students", "staff members", "teachers"],
          "signature": ["The Students' Union", "The Human Resources Department"]
        },
        "estimated_words": 100,
        "spell_required": ["notice", "order", "hold", "expected", "attend", "activity", "questions", "contact", "department", "strengthen"]
      }
    ],
    "practice_rule": "近10年真题作文题各手写一遍，计时35分钟，写完只改上述五类错误。10篇后模板成肌肉记忆。"
  },

  "dialogue": {
    "score": 15,
    "cue_rules": [
      { "code": "YES_NO",     "trigger": "空格后是 Yes / No / Sure / Of course", "fill": "一般疑问句" },
      { "code": "WH_QUESTION","trigger": "空格后是具体信息（时间/地点/原因/数量/方式）", "fill": "特殊疑问句，疑问词由答案性质决定" },
      { "code": "OFFER_HELP", "trigger": "空格后是 Thank you / That's very kind of you", "fill": "提供帮助类句子" },
      { "code": "OTHER",      "trigger": "以上均不适用", "fill": "按语境判断，优先套用场景固定表达" }
    ],
    "note": "先用 cue_rule 定句型，再从选项挑答案。正确率可直接到80%。",
    "scenes": [
      {
        "id": "phone",
        "name": "打电话",
        "phrases": [
          { "en": "May I speak to Mr. Smith, please?", "cn": "我可以和史密斯先生通话吗？", "usage": "开场，要求接通某人" },
          { "en": "This is Li Ming speaking.", "cn": "我是李明。", "usage": "自我介绍，不用 I am" },
          { "en": "Hold on, please. / Just a moment, please.", "cn": "请稍等。", "usage": "转接前" },
          { "en": "Sorry, he's not in at the moment.", "cn": "抱歉，他现在不在。", "usage": "对方不在" },
          { "en": "Can I take a message?", "cn": "需要我传话吗？", "usage": "对方不在时的后续" },
          { "en": "I'm afraid you've got the wrong number.", "cn": "恐怕你打错了。", "usage": "拨错号" },
          { "en": "Could you call back later?", "cn": "你能稍后再打来吗？", "usage": "请对方回拨" }
        ]
      },
      {
        "id": "direction",
        "name": "问路",
        "phrases": [
          { "en": "Excuse me, how can I get to the railway station?", "cn": "打扰一下，去火车站怎么走？", "usage": "开场，必须以 Excuse me 起" },
          { "en": "Go straight ahead and turn left at the second crossing.", "cn": "直走，在第二个路口左转。", "usage": "指路" },
          { "en": "It's about ten minutes' walk.", "cn": "大约走十分钟。", "usage": "回答距离/时间，注意所有格" },
          { "en": "You can't miss it.", "cn": "你不会错过的。", "usage": "指路结尾固定句" },
          { "en": "You'd better take a bus. / Which bus should I take?", "cn": "你最好坐公交／我该坐哪路车？", "usage": "距离较远时" },
          { "en": "Sorry, I'm a stranger here myself.", "cn": "抱歉，我也不熟这里。", "usage": "无法指路" }
        ]
      },
      {
        "id": "doctor",
        "name": "就医",
        "phrases": [
          { "en": "What's wrong with you? / What seems to be the trouble?", "cn": "你怎么了？", "usage": "医生开场" },
          { "en": "I've got a headache and a high fever.", "cn": "我头痛还发高烧。", "usage": "描述症状，用 have got" },
          { "en": "How long have you been like this?", "cn": "这样多久了？", "usage": "医生追问，注意现在完成时" },
          { "en": "Let me take your temperature.", "cn": "我给你量下体温。", "usage": "检查" },
          { "en": "Take this medicine three times a day.", "cn": "这药一天吃三次。", "usage": "医嘱" },
          { "en": "It's nothing serious. Have a good rest.", "cn": "不严重，好好休息。", "usage": "安抚性结论" }
        ]
      },
      {
        "id": "shopping",
        "name": "购物",
        "phrases": [
          { "en": "Can I help you? / What can I do for you?", "cn": "需要帮忙吗？", "usage": "店员开场" },
          { "en": "I'm just looking around, thanks.", "cn": "我只是看看，谢谢。", "usage": "婉拒" },
          { "en": "What size / colour do you want?", "cn": "您要什么尺码／颜色？", "usage": "店员追问" },
          { "en": "How much is it? / What's the price?", "cn": "多少钱？", "usage": "问价" },
          { "en": "Can you give me a discount? / It's a bit too expensive.", "cn": "能打折吗／有点贵。", "usage": "议价" },
          { "en": "I'll take it. / Here's the money.", "cn": "我买了／钱给你。", "usage": "成交" },
          { "en": "May I try it on?", "cn": "我可以试穿吗？", "usage": "衣物类" }
        ]
      },
      {
        "id": "invitation",
        "name": "邀约",
        "phrases": [
          { "en": "Would you like to go to the cinema with me?", "cn": "想和我去看电影吗？", "usage": "发出邀请" },
          { "en": "What about this weekend? / How about Saturday evening?", "cn": "这周末怎么样？", "usage": "约时间" },
          { "en": "I'd love to. / That sounds great.", "cn": "我很愿意／听起来不错。", "usage": "接受" },
          { "en": "I'd love to, but I'm afraid I have to work.", "cn": "我很想去，但恐怕得工作。", "usage": "婉拒的标准结构：先接受再转折" },
          { "en": "Let's meet at the school gate at seven.", "cn": "七点校门口见。", "usage": "约定地点时间" },
          { "en": "See you then. / It's a deal.", "cn": "到时见／就这么定了。", "usage": "结束" }
        ]
      },
      {
        "id": "courtesy",
        "name": "客套应答",
        "phrases": [
          { "en": "It's very kind of you.", "cn": "你真好。", "usage": "接受帮助后致谢" },
          { "en": "Never mind. / That's all right.", "cn": "没关系。", "usage": "回应道歉" },
          { "en": "My pleasure. / You're welcome.", "cn": "不客气。", "usage": "回应感谢" },
          { "en": "No problem. / Not at all.", "cn": "没问题／不用谢。", "usage": "回应请求或感谢" },
          { "en": "I'm sorry to hear that.", "cn": "听到这个我很难过。", "usage": "回应坏消息" },
          { "en": "Congratulations! / Well done!", "cn": "恭喜／干得好。", "usage": "回应好消息" },
          { "en": "Help yourself. / Make yourself at home.", "cn": "请自便／别客气。", "usage": "招待客人" }
        ]
      }
    ]
  },

  "grammar": {
    "score": 15,
    "scope_note": "只学以下7个考点。范围之外一律判为超纲，考场用排除法。",
    "points": [
      {
        "id": 1,
        "name": "非谓语动词",
        "rule": "一个句子只能有一个谓语，其余动词必须变形。doing 表主动/进行，done 表被动/完成，to do 表目的/将来。",
        "decision_steps": [
          "这个空所在的句子是否已有谓语？有则必填非谓语",
          "该动作的逻辑主语与动作是主动还是被动？主动用 doing，被动用 done",
          "是否表示目的或尚未发生？是则用 to do"
        ],
        "trap": "现在分词与过去分词混淆主被动；固定搭配后接 doing 还是 to do 记错。",
        "fixed_collocations": {
          "+ doing": ["avoid", "enjoy", "mind", "finish", "practice", "suggest", "consider", "keep", "can't help", "be worth", "look forward to", "be used to", "spend time (in)", "give up"],
          "+ to do": ["manage", "afford", "decide", "promise", "refuse", "happen", "pretend", "be about", "would like", "can't wait"],
          "both_diff_meaning": ["remember/forget to do 未做 vs doing 已做", "stop to do 停下来去做 vs doing 停止做"]
        },
        "examples": [
          { "en": "The problem ___ (discuss) at the meeting is very important.", "answer": "discussed", "why": "problem 被讨论，被动关系用过去分词" },
          { "en": "___ (see) from the top of the tower, the city looks beautiful.", "answer": "Seen", "why": "city 被看，被动，用过去分词作状语" },
          { "en": "He avoided ___ (answer) my question.", "answer": "answering", "why": "avoid 后固定接 doing" }
        ]
      },
      {
        "id": 2,
        "name": "定语从句",
        "rule": "先看先行词是人还是物，再看从句里缺什么成分。缺主语/宾语用 that/which/who；缺定语用 whose；缺状语用 where/when/why。",
        "decision_steps": [
          "找出先行词，判断人还是物",
          "把从句还原成独立句子，看缺什么成分",
          "人+缺主宾→who/that；物+缺主宾→which/that；缺定语→whose；缺地点状语→where；缺时间状语→when"
        ],
        "trap": "从句已有完整主谓宾却仍选 which（此时应选 where/when）；“介词+which” 等于 where/when，容易漏看介词。",
        "extra_rules": [
          "先行词被 all/only/序数词/最高级修饰，或先行词同时含人和物 → 只能用 that",
          "非限定性从句（有逗号）不能用 that",
          "one of the students who ARE... 从句谓语用复数，先行词是 students"
        ],
        "examples": [
          { "en": "This is the house ___ I lived last year.", "answer": "where / in which", "why": "从句 I lived 已完整，缺地点状语" },
          { "en": "The man ___ car was stolen called the police.", "answer": "whose", "why": "car 前缺所有格定语" },
          { "en": "Is this the book ___ you are looking for?", "answer": "that / which", "why": "for 的宾语缺失，先行词是物" }
        ]
      },
      {
        "id": 3,
        "name": "时态",
        "rule": "现在完成时看“到现在为止的结果”，一般过去时看“过去某个时间点”。抓标志词即可。",
        "decision_steps": [
          "句中有无时间标志词？",
          "since/for/already/yet/just/ever/so far/up to now/recently → 现在完成时",
          "ago/last/yesterday/in+过去年份/just now → 一般过去时",
          "过去的时间点之前又发生 → 过去完成时（by the time / before + 过去式）"
        ],
        "trap": "since 引导的从句用一般过去时，主句用现在完成时，两个时态不一致是正常的；by the time 引导的从句用过去式，主句用过去完成时。",
        "examples": [
          { "en": "I ___ (live) here since 2010.", "answer": "have lived", "why": "since 是现在完成时标志" },
          { "en": "He ___ (leave) two hours ago.", "answer": "left", "why": "ago 是一般过去时标志" },
          { "en": "By the time he arrived, the film ___ (begin).", "answer": "had begun", "why": "过去的过去，用过去完成时" }
        ]
      },
      {
        "id": 4,
        "name": "虚拟语气",
        "rule": "if 从句时态往回推一格。",
        "decision_steps": [
          "判断是与现在、过去还是将来的事实相反",
          "与现在相反：If + 过去式（be 一律 were），主句 would/could/might + do",
          "与过去相反：If + had done，主句 would have done",
          "与将来相反：If + were to do / should do，主句 would do"
        ],
        "trap": "主从句时态不匹配；insist 表“坚持说”时不用虚拟语气；suggest 表“暗示”时也不用。",
        "extra_rules": [
          "wish + 过去式（对现在遗憾）/ had done（对过去遗憾）",
          "as if / as though + 过去式",
          "suggest / demand / insist / order / require / propose + that + (should) do，should 可省"
        ],
        "examples": [
          { "en": "If I ___ (be) you, I would take the job.", "answer": "were", "why": "与现在相反，be 用 were" },
          { "en": "If he had studied harder, he ___ (pass) the exam.", "answer": "would have passed", "why": "与过去相反" },
          { "en": "The doctor suggested that he ___ (stop) smoking.", "answer": "(should) stop", "why": "suggest 表建议，后接虚拟" }
        ]
      },
      {
        "id": 5,
        "name": "倒装与强调",
        "rule": "否定词或 only+状语 放句首，主句用部分倒装（把助动词/be 提到主语前）。强调句是 It is/was + 被强调部分 + that/who + 其余。",
        "decision_steps": [
          "句首是否为否定词或 only+状语？是则部分倒装",
          "倒装只提助动词/be/情态动词，实义动词不动；无助动词时补 do/does/did",
          "若句首是 It is/was 且去掉 It is...that 后句子仍完整 → 强调句"
        ],
        "trap": "only + 状语才倒装，only + 主语不倒装；not only...but also 只倒装 not only 引导的前半句；so/neither 倒装表“也是/也不是”，别与 so...that 混。",
        "negative_words": ["never", "seldom", "hardly", "rarely", "little", "no sooner", "not only", "by no means", "in no case", "at no time"],
        "examples": [
          { "en": "Never ___ I seen such a beautiful place.", "answer": "have", "why": "Never 句首，部分倒装提助动词" },
          { "en": "Only then ___ he realize his mistake.", "answer": "did", "why": "Only+状语句首倒装，无助动词补 did" },
          { "en": "___ was in 1990 that he came to Beijing.", "answer": "It", "why": "It was...that 强调时间状语" }
        ]
      },
      {
        "id": 6,
        "name": "主谓一致",
        "rule": "看真正的主语中心词，不看紧挨着谓语的那个名词。",
        "decision_steps": [
          "找出主语中心词（介词短语、定语从句都不是主语）",
          "either/neither/each/every/one of + 复数名词 → 谓语单数",
          "the number of + 复数 → 单数；a number of + 复数 → 复数",
          "neither...nor / either...or / not only...but also / there be → 就近原则"
        ],
        "trap": "one of the students who ARE... 从句谓语跟 students 用复数，主句谓语跟 one 用单数，同一句里两个不同的数。",
        "extra_rules": [
          "不定式、动名词、从句作主语 → 谓语单数",
          "集体名词 police / people / cattle → 复数",
          "and 连接两个单数主语 → 复数，但 and 连接的是同一事物（bread and butter）→ 单数"
        ],
        "examples": [
          { "en": "Each of the students ___ (have) a dictionary.", "answer": "has", "why": "each of + 复数，谓语单数" },
          { "en": "The number of cars ___ (be) increasing.", "answer": "is", "why": "the number of 中心词是 number，单数" },
          { "en": "Neither he nor I ___ (be) right.", "answer": "am", "why": "neither...nor 就近原则，靠 I" }
        ]
      },
      {
        "id": 7,
        "name": "连词逻辑",
        "rule": "中文可以“虽然…但是”，英文不行。一个逻辑关系只能用一个连词。",
        "decision_steps": [
          "确认句中已有哪个连词，判断该连词是否已经表达了这个逻辑关系",
          "already 有 although/though/while → 不能再加 but",
          "已有 because/since/as → 不能再加 so",
          "成对连词必须结构对称：not only A but also B，A 和 B 的词性结构一致"
        ],
        "trap": "despite / in spite of / because of 后面接名词或动名词，不能接句子；although / because 后面接句子。这一组最常被换着考。",
        "extra_rules": [
          "despite / in spite of + 名词/doing",
          "although / though / even though + 句子",
          "because of / due to / owing to + 名词；because / since / as + 句子",
          "both A and B / either A or B / neither A nor B 都要求 A B 对称"
        ],
        "examples": [
          { "en": "___ he is young, he knows a lot.", "answer": "Although", "why": "后半句无 but，可用 Although 引导让步" },
          { "en": "Despite ___ (be) tired, he kept working.", "answer": "being", "why": "Despite 后接动名词，不接句子" },
          { "en": "He is not only a teacher ___ also a writer.", "answer": "but", "why": "not only...but also 固定成对" }
        ]
      }
    ]
  },

  "cloze": {
    "score": 30,
    "target": 12,
    "strategy": "不做专项训练，只回收两张可迁移的表。",
    "blank_types": [
      { "code": "LOGIC",         "name": "逻辑连接词", "depth": "FULL",  "note": "可迁移性最高，必讲" },
      { "code": "COLLOCATION",   "name": "固定搭配",   "depth": "FULL",  "note": "可迁移性高，必讲" },
      { "code": "VOCAB_DISCRIM", "name": "近义词辨析", "depth": "BRIEF", "note": "只给答案和一句话理由" },
      { "code": "GRAMMAR",       "name": "语法空",     "depth": "BRIEF", "note": "只给答案和一句话理由" }
    ],
    "logic_words": [
      { "en": "however / nevertheless", "relation": "转折", "cn": "然而" },
      { "en": "therefore / thus / as a result", "relation": "因果", "cn": "因此" },
      { "en": "besides / moreover / what's more / in addition", "relation": "递进", "cn": "而且" },
      { "en": "although / though / even though", "relation": "让步", "cn": "尽管" },
      { "en": "for example / for instance", "relation": "举例", "cn": "例如" },
      { "en": "in other words / that is to say", "relation": "解释", "cn": "换句话说" },
      { "en": "on the contrary / instead", "relation": "对比", "cn": "相反" },
      { "en": "in short / to sum up / in conclusion", "relation": "总结", "cn": "总之" },
      { "en": "meanwhile / at the same time", "relation": "同时", "cn": "同时" },
      { "en": "otherwise", "relation": "否则", "cn": "否则" }
    ]
  },

  "reading": {
    "score": 60,
    "target": 36,
    "target_rate": 0.6,
    "method": [
      "先看题干圈关键词，再回原文定位，不通读全文",
      "题目顺序基本对应原文段落顺序，定位后只精读那2-3句",
      "细节题和词义猜测题必做（占多数，答案在原文）",
      "主旨题次做（看首段末句 + 各段首句）",
      "推断题和态度题时间不够直接放弃（20道里约4-5道，共12-15分，不在目标分内）"
    ],
    "trap_patterns": [
      { "code": "SCOPE",     "name": "偷换范围", "desc": "把原文的部分说成全部，或把 some 换成 all/every" },
      { "code": "IRRELEVANT","name": "原文有但答非所问", "desc": "选项内容在原文出现过，但没回答题目问的那个点" },
      { "code": "ABSOLUTE",  "name": "绝对化表述", "desc": "含 must/always/never/only 的选项通常错" },
      { "code": "MISMATCH",  "name": "张冠李戴", "desc": "把 A 的属性安到 B 身上" },
      { "code": "OVERREACH", "name": "过度推断", "desc": "推得比原文远，原文没这层意思" }
    ]
  },

  "vocab": {
    "levels": [
      { "code": "RECOGNIZE", "name": "认出即可", "scope": "阅读、完形、语法题中的词", "test_mode": "看英文选中文", "note": "占绝大多数" },
      { "code": "SPELL",     "name": "必须会拼", "scope": "仅写作模板用词",           "test_mode": "手写输入",     "note": "约60-80个" }
    ],
    "source_rule": "只从真题里回收。禁止使用大纲3800词表或随机词表APP。10套真题约可回收800-1200词，覆盖度高于随机背3000词。",
    "recycle_flow": [
      "做完一套真题，把影响解题的生词抄进表，标注出现在哪道题",
      "第二天回看一次",
      "第七天回看一次",
      "仍不认识的重新入队"
    ]
  },

  "ui_rules": {
    "must_do": [
      "答题顺序固定：补全对话→写作→语法词汇→阅读→完形→语音，模考模式不允许自由跳转",
      "语音题前端直接预填 phonetics_default_answer，不调 API 不耗时",
      "每道错题必须落 error_class，这是 TASK_DAILY 与 TASK_WEEKLY_REVIEW 的输入",
      "生词表按 level 分成两个独立队列，不允许混队",
      "进度显示按题型“当前分/目标分”，不显示总体覆盖百分比"
    ],
    "must_not_do": [
      "不要加英语学习总进度条（会诱导追求覆盖度而非目标分）",
      "不要加连续打卡天数与成就徽章（缺的是时间预算分配，不是动力）",
      "不要让AI生成模拟题（成考真题重复率高，模拟题误导难度判断）",
      "不要给推断题和态度题做专项训练模块"
    ]
  }
};
