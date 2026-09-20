/* ============================================================================
 * sprint.js —— 真题冲刺（备战最后状态）
 * ---------------------------------------------------------------------------
 * 用户 2026-09-10 定的规矩，三条，别改回去：
 *   ① 只练真题（原卷 / 全真模拟卷），不再练自编练习题
 *   ② 每题做完必须有解析  —— startQuiz 的 chooseOpt 本来就出 explainHTML，这里只要
 *      别走「不出解析」的路径（mastery 连对制、模考交卷制都不出，所以这里一律不用）
 *   ③ 同类型的题一起做      —— 这个文件的主体：把真题按【题型】切成组，一组一次做完，
 *      并且在整组题的头上钉一张「这一类的规律」卡，边做边对照
 *
 * ⚠️ 题库实况（2026-09-10 清点，别凭印象改文案）：
 *      real:true 的真题只有 88 道，而且只覆盖【语音 23 + 语法词汇 65】= 卷面 20 分。
 *      阅读(60分) / 完形(30分) / 补全对话(15分) 一道真题都没有，
 *      能用的只有 mock:true 的《全真模拟(一)~(五)》300 道（2026-09-10 把原书五套卷全部录完）
 *      —— 本文件叫它「准真题」，
 *      页面上必须标清楚，不能混着叫真题骗自己。
 * ========================================================================== */

/* ---------------------------------------------------------- 语法：题型归类 */
/* 题库里的 topic 太碎（65 道真题散在 16 个 topic 上，一半是 1-3 道），
   按 topic 分组等于没分。这里合并成 12 类考场上真会一起出现的题型。
   point: n → 规律和判定步骤直接引用 strategy.js 里 7 大考点的原文，不另写一套。 */
const SPRINT_GTYPES = [
  { key: "collocation", name: "固定搭配", topics: ["collocation"], mode: "该背",
    rule: "这类题没规律可讲，只能一条一条记：某个动词/形容词/名词后面固定跟哪个词、哪个介词。",
    steps: ["先看空格【紧挨着】的那个词（动词、形容词、名词）",
            "问自己：这个词后面固定接什么",
            "四个选项各代进去读一遍——搭配对的那个读着顺，其余三个会别扭"] },
  { key: "word-choice", name: "近义词辨析", topics: ["word-choice"], mode: "该背",
    rule: "四个选项中文意思差不多，区别在【接什么宾语、用在什么语境】。别按中文最像的选。",
    steps: ["先把整句翻成中文，弄清空处到底要表达什么",
            "再看四个词各自的搭配对象对不对（接人 / 接物 / 接抽象概念）",
            "还拿不准就看语气正式不正式、程度重不重"] },
  { key: "non-finite", name: "非谓语动词", topics: ["non-finite", "gerund", "to-do", "too-to"], point: 1, mode: "该理解" },
  { key: "relative-clause", name: "定语从句", topics: ["relative-clause"], point: 2, mode: "该理解" },
  { key: "noun-clause", name: "名词性从句", topics: ["noun-clause"], mode: "该理解",
    rule: "从句在主句里当主语/宾语/表语 = 名词性从句。空里填的是连接词，选哪个只看【从句自己缺不缺成分】。",
    steps: ["先把从句划出来，看它在主句里当什么成分",
            "从句成分不缺（主谓宾齐全）→ 用 that，只起连接作用",
            "从句缺主语/宾语 → 用 what / who / which（它自己要充当那个成分）",
            "意思是「是否」→ 用 whether（介词后面和句首不能用 if）"] },
  { key: "subjunctive", name: "虚拟语气 / 条件句", topics: ["subjunctive", "conditional"], point: 4, mode: "该理解" },
  { key: "tense-voice", name: "时态与语态", mode: "该理解",
    topics: ["present-perfect", "past-perfect", "past-continuous", "present-continuous", "present-simple",
             "future-will", "past-be", "have-has", "used-to", "tense", "passive"],
    rule: "先抓时间标志词定时态，再看动作是主语【自己做】还是【被别人做】定语态（被动 = be + done）。",
    steps: ["找时间标志词：since/for/already/yet → 现在完成；yesterday/ago/last → 一般过去；by+过去时间 → 过去完成",
            "没有标志词就看上下文另一个动词的时态，跟着它走",
            "再看主语和动词的关系：主语是动作的承受者 → 被动 be + done"] },
  { key: "inversion", name: "倒装与强调", topics: ["inversion", "emphasis"], point: 5, mode: "该理解" },
  { key: "conjunction", name: "连词与逻辑", topics: ["conjunction", "correlative", "so-that"], point: 7, mode: "该理解" },
  { key: "comparative", name: "比较与最高级", topics: ["comparative", "superlative", "comparison"], mode: "该理解",
    rule: "两者相比用比较级（后面常有 than），三者以上用最高级（the + -est，后面常有 in/of 范围）。",
    steps: ["先数一数在比几个东西：两个 → 比较级；三个以上 → 最高级",
            "看有没有 than（有 than 必是比较级）、有没有 the 和 in/of 范围（有则最高级）",
            "记住三个高频坑：the more…the more（越…越…）、as…as（和…一样）、倍数放在 as 前面"] },
  { key: "sva", name: "主谓一致", topics: ["subject-verb-agreement", "there-be"], point: 6, mode: "该理解" },
  { key: "modal", name: "情态动词", topics: ["modal-verb", "modal-can"], mode: "该背",
    rule: "考的基本都是【推测】和【对过去的评价】这两组固定含义。",
    steps: ["推测：must be（一定是）/ can't be（不可能）/ may be（可能）",
            "对过去：should have done（本该做却没做）、needn't have done（没必要做却做了）、must have done（一定已经做了）",
            "把选项的中文含义念出来，哪个塞进句子里逻辑通就选哪个"] },
  { key: "tag-question", name: "反意疑问句", topics: ["tag-question"], mode: "该背",
    rule: "前肯后否、前否后肯；助动词跟着前面那句走；主语一律换成代词。",
    steps: ["先看前半句是肯定还是否定 → 后半句反过来",
            "前半句有 be/助动词/情态动词就直接搬过来；只有实义动词就用 do/does/did",
            "三个特例：祈使句 → will you；Let's → shall we；I think + 从句 → 反问从句，且否定要移到后面"] },
];
const SPRINT_GMISC = { key: "misc", name: "其他零碎考点", mode: "该背",
  rule: "冠词、代词、介词、名词单复数这些每年只出 1-2 道，不成体系，靠语感和排除法。",
  steps: ["先把明显不搭配的两个划掉", "剩下两个代进句子念一遍，选读着顺的", "拿不准别纠结，这类题不值得花时间"] };

const _G_T2K = {};
SPRINT_GTYPES.forEach((t) => t.topics.forEach((tp) => (_G_T2K[tp] = t.key)));
function sprintGType(q) {
  return SPRINT_GTYPES.find((t) => t.key === _G_T2K[q.topic]) || SPRINT_GMISC;
}
/* 7 大考点的组：规律和步骤取 strategy.js 的原文，别在这儿抄第二份 */
function gtypeRule(t) {
  if (!t.point) return { rule: t.rule, steps: t.steps, trap: "" };
  const p = pointById(t.point);
  return { rule: p.rule, steps: p.decision_steps, trap: p.trap };
}

/* ------------------------------------------------------------ 语音：分两类 */
/* 策略写死语音是零投入板块（全涂 C，期望 1 分）。但用户要求只练真题，
   所以照样列出来、放最后、并且把「别在这儿花时间」写在脸上。 */
const _VOWEL = /^phonetics-(a|e|i|o|u|ea|ee|oo|ow|ou|au|ai|ay|ear|ew|ie|oa|oi)$/;
function sprintPType(q) {
  return _VOWEL.test(q.topic || "") ? "元音字母 / 字母组合" : "辅音字母 / 字母组合";
}

/* -------------------------------------------------------------- 分组主逻辑 */
/* tier: real = 原卷真题；quasi = 全真模拟卷（准真题）。页面上分开摆，不混。 */
function sprintGroups() {
  const out = [];
  const real = BANK.filter((q) => q.real);
  const quasi = BANK.filter((q) => q.mock && !q.real);
  const add = (o) => { if (o.qs && o.qs.length) out.push(o); };

  /* 语法词汇：按 12 类题型切。真题和准真题各切一份，摆在各自的表里。 */
  const gramGroups = (pool, tier) => {
    const buckets = {};
    pool.filter((q) => secOf(q) === "grammar")
        .forEach((q) => { const t = sprintGType(q); (buckets[t.key] = buckets[t.key] || { t: t, qs: [] }).qs.push(q); });
    SPRINT_GTYPES.concat([SPRINT_GMISC]).forEach((t) => {
      const b = buckets[t.key]; if (!b) return;
      const r = gtypeRule(t);
      add({ tier: tier, sec: "grammar", key: tier[0] + "g-" + t.key, name: t.name, mode: t.mode,
            qs: b.qs, rule: r.rule, steps: r.steps, trap: r.trap });
    });
  };
  /* 语音：分元音 / 辅音两组。策略写死这 5 分是放弃项，所以权重压到最低、也写在脸上。 */
  const phonGroups = (pool, tier) => {
    const b = {};
    pool.filter((q) => secOf(q) === "phonetics").forEach((q) => { const k = sprintPType(q); (b[k] = b[k] || []).push(q); });
    Object.keys(b).sort().forEach((k) => add({
      tier: tier, sec: "phonetics", key: tier[0] + "p-" + k, name: k, mode: "该背", give_up: true, qs: b[k],
      rule: "题目问【划线部分读音与其他三个不同】的是哪个。策略上这 5 分是放弃项——考场全涂 C，期望 1 分，省下的 2 分钟给阅读。",
      steps: ["同一个字母在不同词里读音不同，靠的是背常见词，不是拼规则",
              "真要练就只记最高频的几组：ea 读 /iː/ 还是 /e/、oo 读长还是短、c 在 e/i 前读 /s/",
              "考场上不要在这一题上停留超过 10 秒"] }));
  };

  gramGroups(real, "real");
  phonGroups(real, "real");

  /* 阅读：按 5 种题型切（原文跟着每道题走）。真题和准真题各切一份。 */
  const readGroups = (pool, tier) => {
    const rB = {};
    pool.filter((q) => secOf(q) === "reading").forEach((q) => { const k = readingType(q); (rB[k] = rB[k] || []).push(q); });
    ["细节题", "词义猜测题", "主旨题", "推断题", "态度题"].forEach((k) => {
      if (!rB[k]) return;
      add({ tier: tier, sec: "reading", key: tier[0] + "r-" + k, name: k, qs: rB[k],
            prio: READ_PRIORITY[k] || "必做",
            rule: "这一组全是【" + k + "】。" + (READ_PRIORITY[k] === "可放弃"
              ? "策略把它列为可放弃——练的目的是学会认出它然后跳过，不是学会做它。"
              : "先认出题型，再按下面三步走，做多了就知道答案长什么样。"),
            steps: READ_HOW[k] || [] });
    });
  };
  /* 完形：按篇（整篇一起做，一篇 15 空，自动进整篇模式） */
  const clozeGroups = (pool, tier) => {
    groupByPassage(pool.filter((q) => secOf(q) === "cloze")).forEach((g, i) => add({
      tier: tier, sec: "cloze", key: tier[0] + "c-" + g.key,
      name: (tier === "real" ? "真题完形第 " : "完形第 ") + (i + 1) + " 篇（" + g.qs.length + " 空）",
      qs: g.qs.slice().sort((a, b) => (a.ord || 0) - (b.ord || 0)),
      rule: "完形不能一空一空孤立着填。先通读一遍抓大意，再回头填——空与空之间是同一个故事，前后互相提示。",
      steps: ["第一遍通读，不填，只弄清楚讲了件什么事",
              "第二遍填有把握的（固定搭配、逻辑连词、时态呼应）",
              "剩下的靠上下文重复出现的词和感情色彩推，别硬抠语法"] }));
  };
  /* 补全对话：按线索类型分，这是这一板块唯一的规律 */
  const dlgGroups = (pool, tier) => {
    const dB = {};
    pool.filter((q) => secOf(q) === "dialogue").forEach((q) => { const k = cueKey(q); (dB[k] = dB[k] || []).push(q); });
    Object.keys(CUE_DEFS).forEach((k) => {
      if (!dB[k]) return;
      add({ tier: tier, sec: "dialogue", key: tier[0] + "d-" + k, name: CUE_DEFS[k].label, qs: dB[k], think: true,
            rule: CUE_DEFS[k].rule + "。",
            steps: k.indexOf("ASK") === 0
              ? ["空里要填的是【问句】", "线索在空格【后面】那句回答里", "回答给的是什么，就用对应的疑问词去问它"]
              : ["空里要填的是【回应】", "线索是空格【前面】对方那句话", "先判断对方那句是问句、感谢、道歉还是邀请，再挑固定回法"] });
    });
  };

  readGroups(real, "real");
  clozeGroups(real, "real");
  dlgGroups(real, "real");

  readGroups(quasi, "quasi");
  clozeGroups(quasi, "quasi");
  dlgGroups(quasi, "quasi");
  gramGroups(quasi, "quasi");
  phonGroups(quasi, "quasi");

  return out;
}

/* 一组题的战绩：练过几道、正确率多少 —— 决定「这一类的规律学会了没有」 */
function sprintStat(g) {
  let seen = 0, ok = 0;
  g.qs.forEach((q) => {
    const a = STATE.answers[q.id];
    if (!a || !a.seen) return;
    seen++; if (a.lastOk) ok++;
  });
  return { seen: seen, ok: ok, total: g.qs.length, acc: seen ? ok / seen : null };
}

/* 钉在整组题头上的「这一类的规律」卡：做每一道题时它都在 */
function sprintRuleCard(g) {
  const st = sprintStat(g);
  return `<div class="rule-card">
    <div class="rc-head"><span class="tag tag-ink">这一类的规律</span>
      <b>${esc(g.name)}</b>
      ${g.mode ? `<span class="tag ${g.mode === "该理解" ? "tag-green" : "tag-orange"}">${esc(g.mode)}</span>` : ""}
      ${g.prio ? `<span class="tag ${g.prio === "必做" ? "tag-green" : g.prio === "可放弃" ? "tag-red" : ""}">${esc(g.prio)}</span>` : ""}
      <div class="spacer"></div>
      <span class="sub">${g.qs.length} 题${st.acc === null ? "" : " · 历史正确率 " + Math.round(st.acc * 100) + "%"}</span></div>
    <p class="rc-rule">${esc(g.rule)}</p>
    ${g.steps && g.steps.length ? `<ol class="rc-steps">${g.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}
    ${g.trap ? `<div class="rc-trap"><b>坑：</b>${esc(g.trap)}</div>` : ""}
  </div>`;
}

/* 一次坐下来做多少道。「同类型一起做」是指【不跟别的题型混着出】，
   不是指 33 道细节题一口气做完 —— 一次 30 多道只会做废。按板块给上限，
   没做过的排前面，下次接着往后做。 */
const SPRINT_CAP = { reading: 5, cloze: 15, grammar: 10, dialogue: 8, phonetics: 8 };
function sprintCap(g) { return Math.min(g.qs.length, SPRINT_CAP[g.sec] || 10); }
function sprintTake(g, capOverride) {
  const cap = capOverride || sprintCap(g);
  if (g.qs.length <= cap) return g.qs.slice();
  if (g.sec === "reading") {
    // ⚠️ 阅读不能用 orderForPractice 打散：那样抽 5 道题可能来自 5 篇不同短文＝要读 5 篇。
    //    先按篇排好，再取一段连续窗口，5 道题通常只落在 1-2 篇里。
    const sorted = g.qs.slice().sort((a, b) =>
      String(a.passageId || "").localeCompare(String(b.passageId || "")) || (a.ord || 0) - (b.ord || 0));
    let st = sorted.findIndex((q) => !(STATE.answers[q.id] && STATE.answers[q.id].seen));
    if (st < 0) st = 0;
    st = Math.min(st, Math.max(0, sorted.length - cap));
    return sorted.slice(st, st + cap);
  }
  return orderForPractice(g.qs).slice(0, cap);
}

/* 开练一组：一次只出这一个题型的题，头上钉规律卡 —— 「同类型一起做」的落点就在这儿 */
function sprintDrill(g, backTo, taskId, cap) {
  const list = sprintTake(g, cap);
  startQuiz(list, {
    title: "真题 · " + g.name,
    backTo: backTo || "real",
    ruleCard: sprintRuleCard(g),
    think: !!g.think,
    again: () => ROUTES.real(),
    onFinish: taskId ? () => markTask(taskId, true) : undefined,
  });
}

/* ============================================================== 真题冲刺页 */
ROUTES.real = function () {
  const gs = sprintGroups();
  const on = !!STATE.settings.sprint;
  const realQ = BANK.filter((q) => q.real).length;
  const quasiQ = BANK.filter((q) => q.mock && !q.real).length;

  const rows = (tier) => {
    const list = gs.filter((g) => g.tier === tier);
    let last = "";
    return list.map((g) => {
      const st = sprintStat(g);
      const pct = st.acc === null ? null : Math.round(st.acc * 100);
      const head = g.sec !== last ? `<tr class="sp-sec"><td colspan="4">${esc(SEC[g.sec].name)}
        <span class="tag">${SEC[g.sec].full} 分</span>
        <span class="tag ${SEC[g.sec].invest ? "tag-orange" : "tag-red"}">${SEC[g.sec].invest ? "必投入" : "策略：不投入"}</span></td></tr>` : "";
      last = g.sec;
      return head + `<tr>
        <td><b>${esc(g.name)}</b>
          ${g.mode ? `<span class="tag ${g.mode === "该理解" ? "tag-green" : "tag-orange"}">${esc(g.mode)}</span>` : ""}
          ${g.prio ? `<span class="tag ${g.prio === "必做" ? "tag-green" : g.prio === "可放弃" ? "tag-red" : ""}">${esc(g.prio)}</span>` : ""}
          <div class="sub">${esc(g.rule)}</div></td>
        <td class="num">${g.qs.length}</td>
        <td class="num">${st.seen}${pct === null ? "" : ` · <b style="color:${pct >= 70 ? "var(--green)" : pct >= 50 ? "var(--orange)" : "var(--red)"}">${pct}%</b>`}</td>
        <td class="num">${sprintDropped(g)
          ? `<span class="tag tag-red nowrap">放弃 · ${esc(sprintDropped(g))}</span>`
          : `<button class="btn btn-sm nowrap ${pct === null ? "btn-primary" : ""}" data-g="${esc(g.key)}">练 ${sprintCap(g)} 题</button>`}</td>
      </tr>`;
    }).join("");
  };

  render(`
  <div class="card">
    <div class="row"><h1>真题冲刺</h1>
      <span class="tag ${on ? "tag-orange" : ""}">${on ? "冲刺模式已开" : "冲刺模式未开"}</span>
      <div class="spacer"></div><span class="sub">距考试 ${daysToExam()} 天</span></div>
    <p class="sub">题库已经只剩<b>卷子题</b>（真题 + 全真模拟卷），自编练习题全部剔除。
      每一组的题头上钉着「这一类的规律」，每题做完出解析。</p>
    <div class="warnbox mb">🚫 <b>标红「放弃」的不练</b>：完形（考场蒙同一字母）、语音（全涂 C）、定从 / 名从 / 虚拟 / 倒装。
      时间全给<b>写作、搭配、阅读定位法</b>。</div>
    <div class="qbar">
      <button class="btn ${on ? "" : "btn-primary"}" id="sp-toggle">${on ? "关掉冲刺模式（回到学习路线）" : "打开冲刺模式（今天页只排真题）"}</button>
      <button class="btn btn-orange" id="sp-wrong">只练我错过的真题</button>
      <button class="btn" id="sp-fresh">还没做过的真题</button>
    </div>
  </div>

  <div class="card">
    <div class="row"><h2>真题（原卷）</h2><span class="tag tag-orange">${realQ} 题</span></div>
    <details class="acc acc-thin mb"><summary>这 ${realQ} 道题从哪来、答案怎么核的</summary>
      <p class="sub mt">五个板块全覆盖：语音 23 / 语法词汇 80 / 完形 30 / 阅读 40 / 补全对话 10。
      其中 2023、2024 两套整卷（含完形原文、5 篇阅读原文、整段对话）是 2026-09-10 补录的。
      ⚠️ 这两套卷的官方答案要付费，没有买；答案是逐题从原文推导的——用同样方法独立推导 2024 卷第 1-20 题，
      与题库里早已核实的答案 20/20 全中。每题解析都写明了依据在原文哪一句。日后拿到官方答案以官方为准。</p></details>
    <table class="tbl sp-tbl"><thead><tr><th>题型</th><th class="num">题数</th><th class="num">练过 / 正确率</th><th></th></tr></thead>
      <tbody>${rows("real")}</tbody></table>
  </div>

  <div class="card">
    <div class="row"><h2>准真题 · 全真模拟(一)~(五)</h2><span class="tag">${quasiQ} 题</span>
      <span class="tag tag-ink">${(window.PAPERS || []).length} 套整卷</span></div>
    <p class="sub mb">印刷卷原题原序、原书解析，题型和真卷一致，但<b>不是真题</b>，别当真题的正确率看。
      语法词汇按和上面一样的 12 类题型切；阅读按题型抽（原文跟着每道题走）；完形按整篇做；补全对话按线索类型分。
      想整卷计时考，去<a href="#" id="sp-mock">全真模考</a>选整卷。</p>
    <table class="tbl sp-tbl"><thead><tr><th>题型</th><th class="num">题数</th><th class="num">练过 / 正确率</th><th></th></tr></thead>
      <tbody>${rows("quasi")}</tbody></table>
  </div>`);

  $$("[data-g]").forEach((b) => (b.onclick = () => {
    const g = gs.find((x) => x.key === b.dataset.g);
    if (g) sprintDrill(g);
  }));
  $("#sp-toggle").onclick = () => {
    STATE.settings.sprint = !STATE.settings.sprint;
    saveState();
    toast(STATE.settings.sprint ? "冲刺模式已开：今天页只排真题，按题型成组" : "已回到学习路线模式", 3200);
    ROUTES.real();
  };
  $("#sp-wrong").onclick = () => {
    const list = BANK.filter((q) => (q.real || q.mock) && STATE.wrong[q.id]);
    if (!list.length) return toast("真题里还没有错过的题");
    startQuiz(orderForPractice(list), { title: "真题错题重做", backTo: "real", again: () => ROUTES.real() });
  };
  if ($("#sp-mock")) $("#sp-mock").onclick = (e) => { e.preventDefault(); go("mock"); };
  $("#sp-fresh").onclick = () => {
    const list = BANK.filter((q) => q.real && !(STATE.answers[q.id] && STATE.answers[q.id].seen));
    if (!list.length) return toast("原卷真题已经全部做过一遍了");
    startQuiz(orderForPractice(list), { title: "没做过的真题", backTo: "real", again: () => ROUTES.real() });
  };
};

/* ================================================== 冲刺模式下的「今天」清单 */
/* 挑一组的规则：正确率最低的优先（那才是还没学会的规律），没练过的最优先；
   同一天固定住，别每次渲染换一组。分数权重照策略走：阅读 > 语法 > 对话 > 完形 > 语音。 */
/* ============================================================================
 *            最后一个月的固定日程（2026-09-12 重排）
 * ----------------------------------------------------------------------------
 * 用户情况：新概念1 学到 90 课、词汇 1000+、A2。成考大纲要 3000-3800 词，
 *   也就是说**他只认识三分之一**——所以阅读不可能"读懂"，只能用定位法抢分。
 * 用户要求：「性价比最高的拿分方式」「UI 简洁，不要这么多选项」
 *          「今日训练 工作日和休息日 排的尽可能科学合理、精简、区分开」。
 *
 * 所以不再按权重随机挑组（每天看到的都不一样、还要做选择），改成**写死的日程**：
 *   工作日 3 件、休息日 4 件 + 整卷。每天打开就是那几件，不用想。
 *
 * 排序依据＝「每分钟能换几分」，不是卷面分：
 *   ① 写作 25 分：A2 也能靠模板拿 20。今天真卷已拿 18，是全卷最稳的一块
 *   ② 搭配速记：6/6 年必考、纯背，真卷语法只考了 3/15，这里是最快的捡漏
 *   ③ 阅读 60 分：现在 25%(≈蒙)，定位法能提到 35%，绝对分数涨得最多
 *   ④ 补全对话：已经 15/15，改成维持，只在休息日过一遍
 * 明确放弃（考场上直接蒙，平时一分钟都不花）：
 *   完形 30 分 → 统一蒙同一个字母（期望 7.5 分）
 *   语音 5 分  → 全涂 C（期望 1 分）
 *   语法里的定从/名从/虚拟/倒装 → 要真理解，35 天学不透
 * ========================================================================== */

/* 放弃名单：这些组在真题页照常列出来（要认得出题型好跳过），但永远不进每日清单 */
const SPRINT_DROP_SEC = ["cloze", "phonetics"];
const SPRINT_DROP_GT  = ["relative-clause", "noun-clause", "subjunctive", "inversion"];
function sprintDropped(g) {
  if (SPRINT_DROP_SEC.indexOf(g.sec) >= 0) return "考场蒙同一字母";
  if (g.sec === "grammar" && SPRINT_DROP_GT.indexOf((g.key || "").replace(/^[a-z]g-/, "")) >= 0) return "要真理解，来不及";
  return "";
}

/* 从某个板块里挑一组来练：没练过的优先，其次正确率低的 */
function pickGroup(sec, filter) {
  const gs = sprintGroups().filter((g) => g.sec === sec && !sprintDropped(g) && (!filter || filter(g)));
  if (!gs.length) return null;
  gs.sort((a, b) => {
    const sa = sprintStat(a), sb = sprintStat(b);
    const na = sa.seen === 0 ? 2 : 1 - (sa.acc || 0);
    const nb = sb.seen === 0 ? 2 : 1 - (sb.acc || 0);
    return nb - na;
  });
  return gs[0];
}

/* 阅读：工作日只练细节题（占真题 80%、也是唯一能靠定位法抢的），休息日整篇 */
function readingTask(weekend) {
  // 细节题占真题阅读的 80%，也是唯一能靠定位法稳定抢分的——工作日休息日都优先它
  const g = pickGroup("reading", (x) => x.name === "细节题") || pickGroup("reading");
  if (!g) return null;
  const n = Math.min(weekend ? 8 : 5, g.qs.length);
  return {
    id: "sp-read", icon: "📖", tag: "阅读", pinned: true, same: "read",
    title: `阅读 · ${g.name} ${n} 题（定位法）`,
    why: "读不懂是正常的（你 1000 词，大纲 3000），别硬读。三步：题干圈关键词 → 回原文找到它 → 只读那一两句。60 分里抢 20 分就够。",
    min: weekend ? 20 : 12,
    run: () => sprintDrill(g, "today", "sp-read", n),   // 题数跟标题一致，别被 SPRINT_CAP 截断
  };
}

/* 补全对话：真卷已经 15/15，不用再攻，休息日过一遍保持手感就行 */
function dialogueTask() {
  const g = pickGroup("dialogue");
  if (!g) return null;
  return {
    id: "sp-dlg", icon: "💬", tag: "对话", same: "dlg",
    title: `补全对话 · ${g.name}（${sprintCap(g)} 题）`,
    why: "这块你真卷考了满分 15/15，**已经拿下了**。每周过一遍别手生就行，不用再花大力气。",
    min: 8,
    run: () => sprintDrill(g, "today", "sp-dlg"),
  };
}

/* ⚠️ 写作必须单独排，别指望 sprintGroups 会带上它：
   sprintGroups 只切【选择题】板块（语音/语法/完形/阅读/对话），写作没有选项、不成组。
   2026-09-10 查存档发现：冲刺模式开着，但今天页从来没让他写过作文 ——
   而写作是 25 分、他一篇没写过，是全卷性价比最高的一块。所以钉死在清单里。 */
function sprintWritingTask(weekend) {
  const n = (STATE.essays || []).length;
  if (weekend) return {
    id: "sp-write", icon: "📝", tag: "写作", pinned: true, same: "write",
    title: "计时写一篇作文（35 分钟）",
    why: n === 0
      ? "⚠️ 25 分的板块，你到现在一篇都没写过。套模板、写满 100-120 词就有 15 分——全卷最划算的分"
      : `已经写过 ${n} 篇。照样计时套模板写，写完让 AI 按五类低级错误挑一遍`,
    min: 35, run: () => go("writing", "write"), manual: true,
  };
  const tpl = rotate(S.writing.templates);
  return {
    id: "sp-write-tpl", icon: "✍️", tag: "写作", pinned: true, same: "write",
    title: `默写「${esc(tpl.name)}」的三段开头`,
    why: "考场上这 25 分靠的是闭着眼能套出骨架，所以每天默一遍。不用写全篇，只默三段的开头句",
    min: 5,
    run: () => {
      go("writing", "template");
      setTimeout(() => { const el = $("#tplcard-" + tpl.id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
    },
    manual: true,
  };
}

function sprintTasks(weekend) {
  if (STATE.settings.writingOnly) return writingOnlyTasks(weekend);   // 2026-09-13：只练作文
  const out = [];
  const d = daysToExam();

  // ① 写作 —— 天天，排最前，时间不够也不砍
  out.push(sprintWritingTask(weekend));

  // ② 搭配速记 —— 天天，纯背分
  if (typeof collocTask === "function") { const c = collocTask(); if (c) out.push(c); }

  // ③ 阅读定位法 —— 天天，绝对分数涨得最多的一块
  const r = readingTask(weekend); if (r) out.push(r);

  // 休息日多一件：补全对话保持手感。已经 15/15 了，所以是「选做」——不计件数、不计时间、不进大按钮
  if (weekend) { const dl = dialogueTask(); if (dl) { dl.optional = true; out.push(dl); } }

  // 最后 24 天起，**每周日**一套整卷（用户计划里的「模考两次」）。
  // ⚠️ 别写成「每个休息日」：周六周日各一套 = 3 周 6 套，150 分钟一套根本坐不完，还挤掉写作和阅读。
  //    近 5 天刚考过也不排（比如周六自己主动考了）。今天已经考过的自动打勾。
  const lastMock = (STATE.mocks || []).slice(-1)[0];
  const justDid = lastMock && daysBetween(lastMock.date, todayStr()) < 5 && lastMock.date !== todayStr();
  if (weekend && d <= 24 && (new Date().getDay() === 0 || wasPlannedToday("sp-mock")) && !justDid) out.push({
    id: "sp-mock", icon: "⏱️", tag: "整卷", pinned: true,
    title: "整卷计时模考 150 分钟",
    why: "真题原卷 2 套 + 模拟卷 5 套。**坐满 150 分钟**，交卷后直接出针对性错题训练。" +
      "上次你 34 分钟就交了，阅读那部分等于没做——这次把时间用满。",
    min: 150, run: () => go("mock"), manual: true,
    auto: () => (STATE.mocks || []).some((m) => m.date === todayStr()),
  });
  return out;
}

/* 导航里加一个顶级入口：冲刺期它就是主入口，摆在「今天」后面 */
(function () {
  // ⚠️ 幂等：精简版 NAV 本身就带「真题」了，别再塞第二个（2026-09-12 踩过，导航出现两个「真题」）
  if (NAV.some((n) => n.route === "real" || (n.items || []).some((i) => i.route === "real"))) return;
  const i = NAV.findIndex((n) => n.kind === "item" && n.route === "home");
  const item = { kind: "item", route: "real", label: "真题" };
  if (i >= 0) NAV.splice(i + 1, 0, item); else NAV.push(item);
})();

/* ================================================== 只练写作模式（2026-09-13 用户定，当前默认） */
/* 用户原话：「我还是日常学新概念1+背单词吧，这里只练写作文。」
 * 评估时说清楚了：搭配那 ~8 分和阅读定位不排会丢，用户知道并且自己定的——别再往清单里塞回去。
 *   工作日 ≈15′：默写模板骨架 5′ → 一道真题写三段提纲 10′（AI 扩成范文读一遍）
 *   休息日 ≈45′：计时写一篇真题作文 35′ → 回看上一篇批改 8′
 * 提纲题按天轮换 11 道真题，已经写过整篇的年份排到后面。
 * 开关 STATE.settings.writingOnly（默认 true）；今天页底部可切回完整日程。 */
function essayForToday() {
  const list = window.REAL_ESSAYS || [];
  if (!list.length) return null;
  const written = (STATE.essays || []).map((e) => String(e.prompt || ""));
  const fresh = list.filter((e) => !written.some((p) => p.indexOf(e.year + " 年") >= 0));
  const pool = fresh.length ? fresh : list;
  return pool[dayIndex() % pool.length];
}
function openWriting(e, mode) {
  if (e) W_SEL = { key: "y" + e.year };
  W_MODE = mode || "full";
  go("writing", "write");
}
function writingOnlyTasks(weekend) {
  const e = essayForToday();
  const tpl = rotate(S.writing.templates);
  const last = (STATE.essays || []).slice(-1)[0];
  if (weekend) return [
    { id: "wo-essay", icon: "📝", tag: "写作", pinned: true, min: 35, manual: true,
      title: e ? `计时写 ${e.year} 年真题作文（35 分钟）` : "计时写一篇作文（35 分钟）",
      why: e ? e.situation : "照考场要求 100-120 词，写完交给 AI 批改",
      run: () => openWriting(e, "full"),
      auto: () => (STATE.essays || []).some((x) => x.date === todayStr() && x.score != null) },
    { id: "wo-review", icon: "🔍", tag: "复盘", pinned: true, min: 8, manual: true,
      title: "回看上一篇的批改，把低级错误抄一遍",
      why: last ? `上一篇 ${last.date} 得 ${last.score == null ? "未评分" : last.score + "/25"}。把「原句 → 改后」逐条抄一遍，同一类错误下次就不犯`
                : "还没写过整篇，写完第一篇再来",
      run: () => { go("writing", "write"); setTimeout(() => { const b = $("[data-essay]"); if (b) b.click(); }, 80); } },
  ];
  return [
    { id: "wo-tpl", icon: "✍️", tag: "写作", pinned: true, min: 5, manual: true,
      title: `默写「${tpl.name}」骨架`,
      why: "考场上 25 分靠的是闭着眼能套出骨架。默一遍三段的开头句和结尾句，再对着模板页核对",
      run: () => { go("writing", "template"); setTimeout(() => { const el = $("#tplcard-" + tpl.id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); } },
    { id: "wo-outline", icon: "🧾", tag: "写作", pinned: true, min: 10, manual: true,
      title: e ? `${e.year} 年真题：写三段提纲` : "写三段提纲",
      why: (e ? e.situation : "") + "　不写全篇，每段一两句把要点塞进去，然后让 AI 扩成范文读一遍",
      run: () => openWriting(e, "outline") },
  ];
}
