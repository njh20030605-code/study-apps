/* ============================================================
 * placement.js —— 摸底测试 + 三阶段计划生成
 * 首次使用先摸底：从题库里按模块、按难度均衡抽一套题，
 * 做完给出各模块得分、预估卷面分、薄弱模块，并生成计划。
 * ============================================================ */

const Placement = (function () {

  // 考点级摸底：每个考点抽 1 道代表题（优先中等难度，更能区分"会不会"）。
  // 返回 { qs:[...], skillOf:{qid:skillId} }。答对→该考点判定已掌握、闯关跳过。
  function buildSkillTest() {
    const bank = window.QUESTION_BANK.filter(q => q.type === "single" || q.type === "multiple");
    const qs = [], skillOf = {};
    (window.SKILLS || []).forEach(sk => {
      const pool = bank.filter(q => sk.topics.includes(q.topic));
      if (!pool.length) return;
      const mid = pool.filter(q => q.difficulty === 2);
      const easy = pool.filter(q => q.difficulty === 1);
      const use = mid.length ? mid : (easy.length ? easy : pool);
      const q = use[Math.floor(Math.random() * use.length)];
      if (skillOf[q.id]) return; // 同一题别重复
      skillOf[q.id] = sk.id;
      qs.push(q);
    });
    return { qs, skillOf };
  }

  // 从题库里抽一套有代表性的摸底题（只用客观单选/多选，便于自动判分）
  function buildTest() {
    const bank = window.QUESTION_BANK.filter(q => q.type === "single" || q.type === "multiple");
    // 按模块分组
    const byModule = {};
    bank.forEach(q => {
      (byModule[q.module] = byModule[q.module] || []).push(q);
    });
    const picked = [];
    // 每个模块按难度均衡取样：易2 + 中2 + 难1（不足则尽量取）
    Object.keys(byModule).forEach(mod => {
      const arr = byModule[mod];
      const easy = arr.filter(q => q.difficulty === 1);
      const mid = arr.filter(q => q.difficulty === 2);
      const hard = arr.filter(q => q.difficulty === 3);
      pick(easy, 2, picked);
      pick(mid, 2, picked);
      pick(hard, 1, picked);
    });
    // 打散顺序
    return shuffle(picked);
  }

  function pick(arr, n, out) {
    const copy = arr.slice();
    for (let i = 0; i < n && copy.length; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(idx, 1)[0]);
    }
  }

  function shuffle(a) {
    const arr = a.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // 判分：answers = { qid: userAnswerIdx | [idx...] }
  function score(testQs, answers) {
    const byModule = {}; // mod -> {total, correct}
    let total = 0, correct = 0;
    testQs.forEach(q => {
      const m = q.module;
      byModule[m] = byModule[m] || { total: 0, correct: 0 };
      byModule[m].total += 1;
      total += 1;
      const ua = answers[q.id];
      let ok = false;
      if (Array.isArray(q.answer)) {
        ok = Array.isArray(ua) && ua.length === q.answer.length &&
             q.answer.every(x => ua.includes(x));
      } else {
        ok = ua === q.answer;
      }
      if (ok) { byModule[m].correct += 1; correct += 1; }
    });

    const rate = total ? correct / total : 0;
    // 粗略预估卷面分（150满分）：用正确率×150，仅供参考
    const estScore = Math.round(rate * 150);

    // 找出最弱模块
    let weakest = null, weakestRate = 2;
    Object.keys(byModule).forEach(m => {
      const r = byModule[m].correct / byModule[m].total;
      if (r < weakestRate) { weakestRate = r; weakest = m; }
    });

    // 水平档位
    let levelLabel;
    if (rate < 0.4) levelLabel = "零基础起步";
    else if (rate < 0.6) levelLabel = "有点印象，需系统打地基";
    else if (rate < 0.75) levelLabel = "基础还行，重点补漏";
    else levelLabel = "基础不错，冲刺提分";

    return { total, correct, rate, estScore, byModule, weakest, levelLabel };
  }

  // 根据摸底结果生成三阶段计划（考试日期由设置决定）
  function buildPlan(result) {
    const s = Store.get();
    const weeksLeft = weeksUntil(s.examDate);
    // 弱模块优先
    const modOrder = Object.keys(result.byModule)
      .sort((a, b) => (result.byModule[a].correct / result.byModule[a].total) -
                      (result.byModule[b].correct / result.byModule[b].total));

    return {
      weeksLeft,
      phases: [
        {
          n: 1, name: "打地基",
          weeks: `前 ${Math.max(1, Math.round(weeksLeft * 0.45))} 周`,
          focus: `马哲原理 + 毛中特核心概念，先把最弱的「${modOrder[0] || "马哲"}」啃下来。每天新知识点讲解卡 + 少量练习，重理解不贪多。`
        },
        {
          n: 2, name: "全面铺开",
          weeks: `中间 ${Math.max(1, Math.round(weeksLeft * 0.35))} 周`,
          focus: "覆盖全部高频考点，加大练习量，开始练辨析/简答的答题套路，每周一次周测查漏。"
        },
        {
          n: 3, name: "刷卷冲刺",
          weeks: `最后 ${Math.max(1, weeksLeft - Math.round(weeksLeft*0.45) - Math.round(weeksLeft*0.35))} 周`,
          focus: "按真题结构做模拟卷、计时训练，狂刷错题本，背主观题采分点，更新最新时政。"
        }
      ]
    };
  }

  function weeksUntil(dateStr) {
    try {
      const exam = new Date(dateStr + "T00:00:00");
      const diff = exam - new Date();
      return Math.max(1, Math.ceil(diff / (7 * 24 * 3600 * 1000)));
    } catch (e) { return 13; }
  }

  return { buildTest, buildSkillTest, score, buildPlan, weeksUntil };
})();
