/* ============================================================
 * app.js —— 主控制器：路由 + 各页面渲染 + 答题流程
 * 依赖：questions.js, storage.js, api.js, srs.js, ai.js, placement.js
 * ============================================================ */

const App = (function () {
  const $ = sel => document.querySelector(sel);
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  };
  const letter = i => String.fromCharCode(65 + i);
  const esc = s => (s == null ? "" : String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"));

  // ——— 学习方式标注：这题该「背」还是该「懂原理」———
  // 下面是人工核定的"需懂原理"（应用/情境/事例题）清单；其余客观题默认"靠背"。
  const DONG_IDS = new Set([
    "phi-002","phi-008","phi-011","phi-012","phi-013","phi-014","phi-015","phi-017","mul-001",
    "phi2-005","phi2-008","y-phi-001","y-phi-002","y-phi-003","y-phi-004"
  ]);
  function learnType(q) {
    if (q.learn === "背" || q.learn === "懂") return q.learn; // 题库里可显式指定，优先
    if (q.type === "辨析") return "懂";                        // 判断对错靠原理
    if (q.type === "简答" || q.type === "论述") return "背";   // 主要靠背采分点
    if (DONG_IDS.has(q.id)) return "懂";
    // 兜底（给你以后自己加的新题自动猜）：有强应用信号→懂，否则→背
    const s = q.stem || "";
    if (/[①②③④]/.test(s) || /(体现|蕴含|哲理|启示|要求我们|这句话|这一论断)/.test(s)) return "懂";
    const ql = [...s.matchAll(/[「『“"]([^」』”"]{5,})[」』”"]/g)].map(m => m[1]);
    if (ql.some(x => x.length >= 7 || /[，。]/.test(x))) return "懂";
    return "背";
  }
  function learnTag(q) {
    return learnType(q) === "懂"
      ? '<span class="tag learn-dong">💡 懂原理</span>'
      : '<span class="tag learn-bei">🧠 靠背</span>';
  }
  function learnTip(q) {
    return learnType(q) === "懂"
      ? "💡 这题靠<strong>理解</strong>：记住背后的原理，题目换个说法或例子也能套用。"
      : "🧠 这题靠<strong>记忆</strong>：把正确的表述背牢，选项换个说法也认得出。";
  }

  let mount, navWrap, phaseBadge;

  // ---------- 通用工具 ----------
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  function daysUntilExam() {
    const s = Store.get();
    const exam = new Date(s.examDate + "T00:00:00");
    return Math.ceil((exam - new Date()) / (24*3600*1000));
  }
  function overallProgress() {
    // 以「熟练度≥2 的题占全部客观题比例」衡量掌握进度
    const s = Store.get();
    const objective = QUESTION_BANK.filter(q => q.type === "single" || q.type === "multiple");
    let mastered = 0;
    objective.forEach(q => { if ((s.progress[q.id]?.level || 0) >= 2) mastered++; });
    return { mastered, total: objective.length, pct: objective.length ? Math.round(mastered/objective.length*100) : 0 };
  }
  function checkinToday() {
    const s = Store.get();
    const t = todayStr();
    if (s.lastCheckin === t) return; // 今天已打卡
    // 判断是否连续
    const yest = new Date(); yest.setDate(yest.getDate()-1);
    const yStr = `${yest.getFullYear()}-${String(yest.getMonth()+1).padStart(2,"0")}-${String(yest.getDate()).padStart(2,"0")}`;
    s.streak = (s.lastCheckin === yStr) ? s.streak + 1 : 1;
    s.lastCheckin = t;
    if (!s.checkinDates.includes(t)) s.checkinDates.push(t);
    Store.save();
  }

  // ---------- 每日任务生成 ----------
  function isWeekend(d) {
    const day = (d || new Date()).getDay(); // 0=周日 6=周六
    return day === 0 || day === 6;
  }
  function todayMinutes() {
    const s = Store.get();
    return isWeekend() ? (s.minWeekend || 40) : (s.minWeekday || 15);
  }
  function minutesToCount(m) {
    if (m <= 15) return 12;
    if (m <= 25) return 22;
    if (m <= 40) return 35;
    return 50; // 60 分钟
  }
  function questionsPerDay() {
    return minutesToCount(todayMinutes());
  }
  function todayModeLabel() {
    return isWeekend()
      ? "🟢 周末 · 冲刺模式（上新知识点＋练 1 道主观题）"
      : `🔵 工作日 · 轻量模式（约 ${minutesToCount(todayMinutes())} 题，快速过一遍保持手感）`;
  }
  function buildDailyTask() {
    const s = Store.get();
    const t = todayStr();
    if (s.todayTask && s.todayTask.date === t) return s.todayTask;

    const n = questionsPerDay();
    // 难度上限跟着阶段走：阶段1只出易题（打地基），阶段2易+中，阶段3全部
    const cap = s.phase || 1;
    const objective = QUESTION_BANK.filter(q =>
      (q.type === "single" || q.type === "multiple") && (q.difficulty || 1) <= cap);
    const chapterOrder = CURRICULUM.map(c => c.chapter);
    const chIdx = ch => { const i = chapterOrder.indexOf(ch); return i < 0 ? 999 : i; };
    // 排序：先按大纲章节顺序，再按难度从易到难（系统推进、先易后难）
    const orderCmp = (a,b) => chIdx(a.chapter)-chIdx(b.chapter) || (a.difficulty||1)-(b.difficulty||1);

    // 1) 到期复习的旧题
    const due = objective.filter(q => SRS.isDue(q.id))
                         .sort((a,b) => (s.progress[a.id]?.nextTs||0)-(s.progress[b.id]?.nextTs||0));
    // 2) 新题：按 章节→难度 排
    const fresh = objective.filter(q => SRS.isNew(q.id)).sort(orderCmp);

    // 阶段1以打地基（学新）为主，少复习；后面阶段多复习巩固
    const reviewRatio = (s.phase === 1) ? 0.2 : 0.35;
    const reviewCount = Math.min(due.length, Math.round(n * reviewRatio));
    const ids = [];
    due.slice(0, reviewCount).forEach(q => ids.push(q.id));
    fresh.slice(0, n - ids.length).forEach(q => ids.push(q.id));
    // 若不够，用任意未满熟练度的题补齐（同样先易后难）
    if (ids.length < n) {
      objective.filter(q => !ids.includes(q.id) && (s.progress[q.id]?.level||0) < 3)
               .sort(orderCmp)
               .slice(0, n - ids.length).forEach(q => ids.push(q.id));
    }
    // 周末且已过打地基阶段（≥阶段2）才追加主观题——辨析/简答对零基础太难，先不出
    if (isWeekend() && (s.phase >= 2)) {
      const subj = QUESTION_BANK.filter(q => q.type==="辨析"||q.type==="简答"||q.type==="论述");
      if (subj.length) {
        const d = new Date();
        const seed = d.getFullYear()*1000 + (d.getMonth()+1)*40 + d.getDate();
        ids.push(subj[seed % subj.length].id);
      }
    }
    s.todayTask = { date: t, ids, done: false, idx: 0, chapter: Study.currentChapter().chapter };
    Store.save();
    return s.todayTask;
  }
  function weakModuleOrder() {
    const s = Store.get();
    const mods = {};
    QUESTION_BANK.forEach(q => {
      if (q.type !== "single" && q.type !== "multiple") return;
      mods[q.module] = mods[q.module] || { correct:0, seen:0 };
      const r = s.progress[q.id];
      if (r) { mods[q.module].correct += r.correct; mods[q.module].seen += r.seen; }
    });
    return Object.keys(mods).length
      ? Object.keys(mods).sort((a,b) => (mods[a].seen? mods[a].correct/mods[a].seen:0) - (mods[b].seen? mods[b].correct/mods[b].seen:0))
      : ["马哲","毛中特","时政"];
  }

  // ============================================================
  // 路由
  // ============================================================
  function go(view, arg) {
    window.scrollTo(0,0);
    [...navWrap.querySelectorAll("button")].forEach(b => b.classList.toggle("active", b.dataset.view === view));
    const s = Store.get();
    // 首次未做摸底 → 强制引导
    if (!s.placementDone && view !== "settings" && view !== "onboarding" && view !== "placement" && view !== "placeResult") {
      return renderOnboarding();
    }
    setActive(false); // 进入菜单/首页类页面默认不计时，答题/背诵时再打开
    switch (view) {
      case "dashboard": return renderDashboard();
      case "train": return sprintOn() ? renderSprint() : renderSkillPath();
      case "review": return renderReview();
      case "practice": return renderPractice();
      case "memory": return renderMemory();
      case "progress": return renderProgress();
      case "wrong": return renderWrong();
      case "mock": return renderMock();
      case "recite": return renderRecite();
      case "settings": return renderSettings();
      case "onboarding": return renderOnboarding();
      case "placement": return renderPlacement();
      default: return renderDashboard();
    }
  }
  // 学习计时开关（answering/背诵时 true）
  let _active = false;
  function setActive(b) { _active = b; }

  // ============================================================
  // 首次引导
  // ============================================================
  function renderOnboarding() {
    mount.innerHTML = "";
    const c = el("div", "card");
    c.innerHTML = `
      <h1>👋 欢迎，我们先摸个底</h1>
      <p class="muted">开始前，先做一套<strong>摸底测试</strong>，看看你现在各模块的水平，然后定制一份到考试的三阶段计划。</p>
      <h3>考试信息</h3>
      <div class="field">
        <label>考试日期（官方为准，可改）</label>
        <input id="ob-date" type="date" value="${Store.get().examDate}">
        <div class="hint">当前距考试约 <strong id="ob-days">${daysUntilExam()}</strong> 天</div>
      </div>
      <p class="small muted">你说工作日上班、效率低，周末有空——所以分开设置，App 会自动按今天是工作日还是周末切换强度。</p>
      <div class="row">
        <div class="field">
          <label>工作日每天学多久？</label>
          <select id="ob-wd">
            <option value="15">15 分钟（约12题，轻量）</option>
            <option value="25" selected>25 分钟（约22题）</option>
            <option value="40">40 分钟（约35题）</option>
          </select>
          <div class="hint">周一~周五，重在保持手感</div>
        </div>
        <div class="field">
          <label>周末每天学多久？</label>
          <select id="ob-we">
            <option value="25">25 分钟（约22题）</option>
            <option value="40" selected>40 分钟（约35题，冲刺）</option>
            <option value="60">60 分钟（约50题，猛冲）</option>
          </select>
          <div class="hint">上新知识点＋练主观题</div>
        </div>
      </div>
      <details class="mb">
        <summary>（可选）现在就填 Claude API Key，解锁 AI 讲解</summary>
        <div class="field mt">
          <label>API Key</label>
          <input id="ob-key" type="password" placeholder="sk-ant-..." value="${esc(Store.get().apiKey)}">
          <div class="hint">不填也能刷题，只是 AI「讲到懂 / 批改 / 诊断」用不了。key 在 console.anthropic.com 获取。之后也能在「设置」里填。</div>
        </div>
      </details>
      <button class="btn big" id="ob-start">开始摸底测试 →</button>
    `;
    mount.appendChild(c);
    $("#ob-date").addEventListener("change", e => {
      Store.set({ examDate: e.target.value });
      $("#ob-days").textContent = daysUntilExam();
    });
    $("#ob-start").addEventListener("click", () => {
      Store.set({
        minWeekday: parseInt($("#ob-wd").value,10),
        minWeekend: parseInt($("#ob-we").value,10),
        apiKey: $("#ob-key").value.trim()
      });
      renderPlacement();
    });
  }

  // ============================================================
  // 摸底测试
  // ============================================================
  let placementState = null;
  function renderPlacement() {
    const t = Placement.buildSkillTest();
    placementState = { qs: t.qs, skillOf: t.skillOf, idx: 0, answers: {} };
    renderPlacementQ();
  }
  function renderPlacementQ() {
    const ps = placementState;
    const q = ps.qs[ps.idx];
    mount.innerHTML = "";
    const c = el("div","card");
    const pct = Math.round(ps.idx / ps.qs.length * 100);
    c.innerHTML = `
      <div class="progress-line"><div class="fill" style="width:${pct}%"></div></div>
      <div class="q-meta"><span>考点摸底</span><span>第 ${ps.idx+1} / ${ps.qs.length} 题</span></div>
      <div class="stem">${esc(q.stem)}</div>
      <div class="options" id="p-opts"></div>
      <div class="action-row"><button class="btn" id="p-next" disabled>下一题</button></div>
      <p class="small muted center mt">每题对应一个考点，答对就判定你已掌握、以后不再重复学。不会就选一个/不确定的，别硬猜。</p>
    `;
    mount.appendChild(c);
    const isMulti = q.type === "multiple";
    let chosen = isMulti ? [] : null;
    const optsBox = $("#p-opts");
    q.options.forEach((op,i) => {
      const o = el("button","option");
      o.innerHTML = `<span class="key">${letter(i)}</span><span>${esc(op)}</span>`;
      o.addEventListener("click", () => {
        if (isMulti) {
          const at = chosen.indexOf(i);
          if (at>=0) { chosen.splice(at,1); o.classList.remove("selected"); }
          else { chosen.push(i); o.classList.add("selected"); }
          $("#p-next").disabled = chosen.length === 0;
        } else {
          chosen = i;
          [...optsBox.children].forEach(x=>x.classList.remove("selected"));
          o.classList.add("selected");
          $("#p-next").disabled = false;
        }
      });
      optsBox.appendChild(o);
    });
    if (isMulti) {
      const hint = el("p","small muted","（多选题，可选多个）");
      optsBox.appendChild(hint);
    }
    $("#p-next").addEventListener("click", () => {
      ps.answers[q.id] = chosen;
      if (ps.idx < ps.qs.length - 1) { ps.idx++; renderPlacementQ(); }
      else finishPlacement();
    });
  }
  function finishPlacement() {
    const ps = placementState;
    const result = Placement.score(ps.qs, ps.answers);
    // 按考点判定：代表题答对 → 该考点标记"已掌握"，闯关直接跳过；答错 → 留着重点学
    const st = Store.get();
    st.skillState = st.skillState || {};
    let mastered = 0, toLearn = 0;
    ps.qs.forEach(q => {
      const sid = ps.skillOf && ps.skillOf[q.id];
      if (!sid) return;
      const ua = ps.answers[q.id];
      const ok = Array.isArray(q.answer)
        ? (Array.isArray(ua) && ua.length === q.answer.length && q.answer.every(x => ua.includes(x)))
        : (ua === q.answer);
      if (ok) { st.skillState[sid] = { conceptRead: true, tiers: [1,2,3], passed: true }; mastered++; }
      else { st.skillState[sid] = { conceptRead: false, tiers: [], passed: false }; toLearn++; }
    });
    result.masteredSkills = mastered;
    result.toLearnSkills = toLearn;
    result.totalSkills = (window.SKILLS || []).length;
    const plan = Placement.buildPlan(result);
    Store.set({ placementDone: true, placementResult: { ...result, plan, date: todayStr() }, phase: 1 });
    Store.save();
    renderPlacementResult(result, plan);
  }
  function renderPlacementResult(result, plan) {
    mount.innerHTML = "";
    const c = el("div","card");
    let modRows = Object.keys(result.byModule).map(m => {
      const b = result.byModule[m];
      const r = Math.round(b.correct/b.total*100);
      return `<div class="mb"><div style="display:flex;justify-content:space-between">
        <span>${m}</span><span class="muted">${b.correct}/${b.total}（${r}%）</span></div>
        <div class="bar-mini"><div class="f" style="width:${r}%"></div></div></div>`;
    }).join("");
    c.innerHTML = `
      <h1>📋 摸底诊断报告</h1>
      <div class="ring-wrap mb">
        <div class="ring" style="--p:${Math.round(result.rate*100)}"><div class="inner">
          <span class="big">${Math.round(result.rate*100)}%</span><span class="cap">正确率</span></div></div>
        <div>
          <p style="font-size:20px;margin:0"><strong>${result.levelLabel}</strong></p>
          <p class="muted">摸底 ${result.correct}/${result.total} 题正确</p>
          <p>粗估卷面分：<strong style="color:var(--accent);font-size:22px">${result.estScore}</strong> / 150　<span class="small muted">（仅参考，客观题估算）</span></p>
        </div>
      </div>
      ${typeof result.masteredSkills === "number" ? `
      <div class="explain mb">
        <div class="verdict ok">✅ 已掌握 ${result.masteredSkills} / ${result.totalSkills} 个考点——这些会自动跳过，不再重复学</div>
        <p class="small" style="margin:4px 0 0">还需重点学 <strong style="color:var(--bad)">${result.toLearnSkills}</strong> 个考点。闯关会直接从你第一个不会的考点开始，把时间花在刀刃上。</p>
      </div>` : ""}
      <h3>各模块表现（最弱：${result.weakest || "—"}）</h3>
      ${modRows}
      <div id="ai-diag" class="mt"></div>
      <h3>📅 为你定制的三阶段计划（距考试约 ${plan.weeksLeft} 周）</h3>
      ${plan.phases.map(p => `
        <div class="list-item" style="cursor:default">
          <div class="li-top"><strong>阶段${p.n}· ${p.name}</strong><span class="tag">${p.weeks}</span></div>
          <p class="small muted" style="margin:6px 0 0">${p.focus}</p>
        </div>`).join("")}
      <button class="btn big mt" id="pr-go">好，开始今天的训练 →</button>
    `;
    mount.appendChild(c);
    $("#pr-go").addEventListener("click", () => go("dashboard"));
    updatePhaseBadge();

    // AI 个性化诊断（有 key 才调）
    const box = $("#ai-diag");
    if (AI.ready()) {
      box.innerHTML = `<div class="explain"><div class="ai-thinking">AI 老师正在看你的成绩，稍等…</div></div>`;
      const summary = `总体正确率${Math.round(result.rate*100)}%。各模块：` +
        Object.keys(result.byModule).map(m=>`${m} ${Math.round(result.byModule[m].correct/result.byModule[m].total*100)}%`).join("，") +
        `。距考试约${plan.weeksLeft}周，目标150分考90分。`;
      AIFeat.placementDiagnose(summary)
        .then(txt => { box.innerHTML = `<div class="explain"><div class="verdict">🧑‍🏫 AI 老师的话</div><div>${esc(txt)}</div></div>`; })
        .catch(err => { box.innerHTML = `<p class="small muted">（AI 诊断没出来：${esc(AI.friendlyError(err))}）</p>`; });
    } else {
      box.innerHTML = `<p class="small muted">💡 到「设置」填 API Key，摸底后能收到一段 AI 老师的个性化点评。</p>`;
    }
  }

  // ============================================================
  // 仪表盘
  // ============================================================
  function renderDashboard() {
    const s = Store.get();
    const prog = overallProgress();
    const days = daysUntilExam();
    const pr = s.placementResult;
    const skillOv = (window.Skills && Skills.overall) ? Skills.overall() : { passed: 0, total: 0 };
    const accPct = s.stats.totalAnswered ? Math.round(s.stats.totalCorrect / s.stats.totalAnswered * 100) : 0;
    const reviewDue = (typeof SRS !== "undefined" && SRS.dueCount) ? SRS.dueCount() : 0;
    mount.innerHTML = "";

    const c = el("div","card");
    c.innerHTML = `
      <h1>倒计时 <span style="color:var(--bad)">${days}</span> 天</h1>
      <p class="muted">考试日期 ${s.examDate} ·（在设置里可改）</p>
      <div class="dash-grid mt">
        <div class="stat"><div class="num">${s.streak}</div><div class="label">🔥 连续打卡天</div></div>
        <div class="stat"><div class="num" style="font-size:22px">${Study.fmt(Study.todaySeconds())}</div><div class="label">⏱️ 今日学习</div></div>
        <div class="stat"><div class="num" style="font-size:22px">${Study.fmt(Study.totalSeconds())}</div><div class="label">⏳ 累计学习</div></div>
        <div class="stat"><div class="num">${skillOv.passed}<span style="font-size:18px;color:var(--muted)">/${skillOv.total}</span></div><div class="label">🎯 考点通关</div></div>
        <div class="stat"><div class="num">${prog.pct}%</div><div class="label">📈 题目掌握</div></div>
        <div class="stat"><div class="num">${accPct}%</div><div class="label">✅ 总正确率</div></div>
        <div class="stat"><div class="num">${s.stats.totalAnswered}</div><div class="label">✍️ 累计答题</div></div>
        <div class="stat"><div class="num">${s.wrongBook.length}</div><div class="label">❗ 错题数</div></div>
      </div>
    `;
    mount.appendChild(c);

    // 备份提醒：有进度且好久没备份 → 提示导出（防止浏览器清掉存储导致进度丢失）
    if (s.stats.totalAnswered > 0 && Store.daysSinceBackup() >= 3) {
      const bk = el("div","card");
      bk.style.borderColor = "var(--bad)";
      bk.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div>💾 <strong>该备份了</strong> · 进度只存在本浏览器，${s.lastBackup?`上次备份 ${s.lastBackup}`:'你还没备份过'}。导出一份存起来，换电脑/浏览器清数据也不怕丢。</div>
        <button class="btn" id="d-backup">立即备份</button></div>`;
      mount.appendChild(bk);
      $("#d-backup").addEventListener("click", () => { Store.exportFile(); flash("已导出存档，存好这个文件 ✅"); });
    }

    // AI 每日教练
    const coach = el("div","card");
    coach.innerHTML = `<h3 style="margin-top:0">🧑‍🏫 今日教练</h3><div id="coach-box" class="muted small">…</div>`;
    mount.appendChild(coach);
    renderCoach($("#coach-box"));

    const cta = el("div","card center");
    const acc = s.stats.totalAnswered ? Math.round(s.stats.totalCorrect/s.stats.totalAnswered*100) : 0;
    cta.innerHTML = `
      <p class="muted">第 ${weekNo()} 周 · 阶段 ${s.phase}（${["打地基","全面铺开","刷卷冲刺"][s.phase-1]}）　|　正确率 ${acc}%</p>
      <p class="small">📘 正在攻克：第 ${Study.currentChapterIndex()+1} 章《${esc(Study.currentChapter().title)}》</p>
      <p class="small" style="color:var(--accent);font-weight:600">${todayModeLabel()}</p>
      <button class="btn big" id="d-train">开始今日训练</button>
      <div class="row mt">
        <button class="btn subtle" id="d-review">复习${reviewDue?`（${Math.min(reviewDue, reviewCap())}）`:''}</button>
        <button class="btn subtle" id="d-practice">专项练习</button>
        <button class="btn subtle" id="d-memory">每日必背</button>
        <button class="btn subtle" id="d-wrong">错题（${s.wrongBook.length}）</button>
        <button class="btn subtle" id="d-mock">模拟考</button>
        <button class="btn subtle" id="d-recite">AI 助手</button>
      </div>
    `;
    mount.appendChild(cta);
    $("#d-train").addEventListener("click", () => go("train"));
    $("#d-review").addEventListener("click", () => go("review"));
    $("#d-practice").addEventListener("click", () => go("practice"));
    $("#d-memory").addEventListener("click", () => go("memory"));
    $("#d-wrong").addEventListener("click", () => go("wrong"));
    $("#d-mock").addEventListener("click", () => go("mock"));
    $("#d-recite").addEventListener("click", () => go("recite"));

    // 拿分策略提示（长期可见，帮你抓重点）
    const tip = el("div","card");
    tip.innerHTML = `
      <details>
        <summary>🎯 90分怎么拿？（点开看策略）</summary>
        <div class="small" style="margin-top:10px;line-height:1.8">
          <p><strong>试卷 150 分构成：</strong>选择题 40×2=80，辨析 2×10=20，简答 3×10=30，论述 1×20=20。</p>
          <p><strong>你的最优路线（基础薄弱也能到 90）：</strong></p>
          <p>① <strong>选择题拿稳 55+</strong>：考点固定、反复考"母题"，靠这个 App 刷到条件反射。这是主战场。</p>
          <p>② <strong>主观题靠背模板拿 35+</strong>：辨析/简答/论述共 70 分是"送分区"——阅卷松，往采分点上靠、分点写，写多少给多少。背熟"判断+理由框架""采分点骨架"即可。</p>
          <p>③ <strong>节奏</strong>：工作日轻量刷选择题（保持手感），周末上新知识点＋练 1 道主观题＋考前多做模拟卷。</p>
          <p class="muted">55 + 35 = 90，稳过线。别死磕偏难题，把高频考点和主观题模板吃透最划算。</p>
        </div>
      </details>`;
    mount.appendChild(tip);
  }
  function weekNo() {
    const s = Store.get();
    const created = new Date(s.createdAt);
    return Math.max(1, Math.ceil((new Date() - created)/(7*24*3600*1000)));
  }
  function renderCoach(box) {
    const s = Store.get();
    if (!AI.ready()) { box.innerHTML = "填了 API Key 后，这里每天给你一句重点提醒。"; return; }
    const prog = overallProgress();
    const summary = `距考试${daysUntilExam()}天，当前阶段${s.phase}，掌握进度${prog.pct}%，错题${s.wrongBook.length}道，最弱模块约为${weakModuleOrder()[0]}。`;
    box.innerHTML = `<span class="ai-thinking">正在想今天该抓什么…</span>`;
    AIFeat.dailyCoach(summary)
      .then(t => box.innerHTML = esc(t))
      .catch(() => box.innerHTML = "今天也稳稳地学，先复习错题再上新题。（AI 教练暂时没连上）");
  }

  // ============================================================
  // 答题流程（通用 QuizRunner）—— 供每日训练/错题/模拟共用
  // ============================================================
  function runQuiz(config) {
    // config: {title, ids, mode:'train'|'wrong'|'mock', onFinish}
    const session = { ...config, idx: 0, correctCount: 0, wrongIds: [], done: 0 };
    renderQuizQuestion(session);
  }

  function renderQuizQuestion(session) {
    const qid = session.ids[session.idx];
    const q = QUESTION_BANK.find(x => x.id === qid);
    if (!q) { session.idx++; return session.idx < session.ids.length ? renderQuizQuestion(session) : finishQuiz(session); }

    if (q.type === "single" || q.type === "multiple") return renderObjective(session, q);
    return renderSubjective(session, q);
  }

  // ——— 客观题 ———
  function renderObjective(session, q) {
    setActive(true);
    mount.innerHTML = "";
    const c = el("div","card");
    const pct = Math.round(session.idx / session.ids.length * 100);
    const diff = q.difficulty || 1;
    c.innerHTML = `
      <div class="progress-line"><div class="fill" style="width:${pct}%"></div></div>
      <div class="q-meta">
        <span>${esc(session.title)}</span>
        <span>${session.idx+1} / ${session.ids.length} · 剩 ${session.ids.length - session.idx} 题</span>
      </div>
      <div>
        <span class="tag">${esc(q.module)}</span>
        <span class="tag">${esc(q.topic)}</span>
        <span class="tag diff${diff}">${["","易","中","难"][diff]}</span>
        ${learnTag(q)}
        ${q.type==="multiple" ? '<span class="tag">多选</span>' : ''}
      </div>
      <div class="stem">${esc(q.stem)}</div>
      <div class="options" id="q-opts"></div>
      <div id="q-after"></div>
    `;
    mount.appendChild(c);

    const isMulti = q.type === "multiple";
    let chosen = isMulti ? [] : null;
    let locked = false;
    const optsBox = $("#q-opts");

    q.options.forEach((op,i) => {
      const o = el("button","option");
      o.dataset.i = i;
      o.innerHTML = `<span class="key">${letter(i)}</span><span>${esc(op)}</span>`;
      o.addEventListener("click", () => {
        if (locked) return;
        if (isMulti) {
          const at = chosen.indexOf(i);
          if (at>=0){chosen.splice(at,1);o.classList.remove("selected");}
          else {chosen.push(i);o.classList.add("selected");}
        } else {
          chosen = i;
          [...optsBox.children].forEach(x=>x.classList.remove("selected"));
          o.classList.add("selected");
          setTimeout(()=>submit(), 120); // 单选点了即判
        }
      });
      optsBox.appendChild(o);
    });

    const after = $("#q-after");
    if (isMulti) {
      const bar = el("div","action-row");
      bar.innerHTML = `<button class="btn" id="q-submit">提交答案</button>`;
      after.appendChild(bar);
      $("#q-submit").addEventListener("click", () => { if(chosen.length) submit(); });
    }

    function submit() {
      if (locked) return;
      locked = true;
      let ok;
      if (isMulti) {
        ok = Array.isArray(chosen) && chosen.length === q.answer.length && q.answer.every(x=>chosen.includes(x));
      } else ok = chosen === q.answer;

      // 上色
      const correctSet = isMulti ? q.answer : [q.answer];
      const chosenSet = isMulti ? chosen : [chosen];
      [...optsBox.children].forEach(o => {
        const i = parseInt(o.dataset.i,10);
        o.classList.add("disabled");
        if (correctSet.includes(i)) o.classList.add("correct");
        else if (chosenSet.includes(i)) o.classList.add("wrong");
      });

      // 记录（模拟考也记，方便错题收集）
      SRS.record(q.id, ok);
      // 专项练习：答完立即标记本轮已做（中途退出再进也不会重做）
      if (session.mode === "practice" && session.poolKey) Study.markDone(session.poolKey, q.id);
      if (ok) session.correctCount++; else session.wrongIds.push(q.id);

      showFeedback(session, q, ok, chosenSet);
    }
  }

  function showFeedback(session, q, ok, chosenSet) {
    const after = $("#q-after");
    after.innerHTML = "";
    const box = el("div","explain");
    let notes = (q.optionNotes||[]).map((n,i) => {
      const cls = n.startsWith("对") ? "n-ok" : (n.startsWith("错") ? "n-bad" : "");
      return `<div class="opt-note ${cls}">${letter(i)}. ${esc(n)}</div>`;
    }).join("");
    box.innerHTML = `
      <div class="verdict ${ok?'ok':'bad'}">${ok?'✅ 答对了':'❌ 答错了'}　正确答案：${
        Array.isArray(q.answer)?q.answer.map(letter).join(""):letter(q.answer)}</div>
      <p style="margin:6px 0"><strong>解析：</strong>${esc(q.explanation)}</p>
      <div class="mt">${notes}</div>
      <div class="small mt" style="color:var(--muted)">${learnTip(q)}</div>
    `;
    after.appendChild(box);

    // AI 讲到懂
    const aiWrap = el("div","ai-box");
    aiWrap.innerHTML = `<button class="btn ghost" id="ai-explain">🤔 没懂？让 AI 再讲一遍</button><div id="ai-thread"></div>`;
    after.appendChild(aiWrap);
    setupDeepExplain(q, chosenSet, $("#ai-explain"), $("#ai-thread"));

    // 下一题
    const nav = el("div","action-row");
    const last = session.idx === session.ids.length - 1;
    nav.innerHTML = `<button class="btn" id="q-next">${last?'完成 →':'下一题 →'}</button>`;
    after.appendChild(nav);
    $("#q-next").addEventListener("click", () => {
      session.done++;
      if (last) finishQuiz(session);
      else { session.idx++; renderQuizQuestion(session); }
    });
  }

  // AI「讲到懂」+ 追问对话
  function setupDeepExplain(q, chosenSet, btn, thread) {
    let history = null;
    btn.addEventListener("click", async () => {
      if (!AI.ready()) { thread.innerHTML = `<div class="explain small">${esc(AI.friendlyError(new Error("NO_KEY")))}</div>`; return; }
      btn.disabled = true;
      const chosenIdx = q.type === "multiple" ? chosenSet : chosenSet[0];
      thread.innerHTML = `<div class="bubble ai ai-thinking">AI 老师正在组织语言…</div>`;
      try {
        const first = await AIFeat.deepExplain(q, chosenIdx);
        const userMsg = AIFeat.formatQuestion(q, chosenIdx) + "\n请用简单中文按结构讲这道题。";
        history = [{role:"user",content:userMsg},{role:"assistant",content:first}];
        renderThread(thread, history, q);
      } catch (err) {
        thread.innerHTML = `<div class="explain small">${esc(AI.friendlyError(err))}</div>`;
        btn.disabled = false;
      }
    });
  }
  function renderThread(thread, history, q) {
    // 只显示第一条之后（第一条是题目本身，不展示）
    thread.innerHTML = "";
    history.forEach((m, i) => {
      if (i === 0) return; // 跳过题目
      const b = el("div", "bubble " + (m.role==="assistant"?"ai":"me"));
      b.innerHTML = esc(m.content);
      thread.appendChild(b);
    });
    const row = el("div","ask-row");
    row.innerHTML = `<input type="text" id="ask-in" placeholder="继续追问，比如：能再举个例子吗？"><button class="btn" id="ask-btn">问</button>`;
    thread.appendChild(row);
    const send = async () => {
      const v = $("#ask-in").value.trim();
      if (!v) return;
      history.push({role:"user",content:v});
      renderThread(thread, history, q);
      const think = el("div","bubble ai ai-thinking"); think.textContent = "思考中…";
      thread.insertBefore(think, thread.querySelector(".ask-row"));
      try {
        const reply = await AIFeat.followUp(history);
        history.push({role:"assistant",content:reply});
        renderThread(thread, history, q);
      } catch (err) {
        think.classList.remove("ai-thinking"); think.textContent = AI.friendlyError(err);
      }
    };
    $("#ask-btn").addEventListener("click", send);
    $("#ask-in").addEventListener("keydown", e => { if(e.key==="Enter") send(); });
  }

  // ——— 主观题（辨析/简答/论述）———
  function renderSubjective(session, q) {
    setActive(true);
    mount.innerHTML = "";
    const c = el("div","card");
    const pct = Math.round(session.idx / session.ids.length * 100);
    c.innerHTML = `
      <div class="progress-line"><div class="fill" style="width:${pct}%"></div></div>
      <div class="q-meta"><span>${esc(session.title)}</span><span>${session.idx+1} / ${session.ids.length}</span></div>
      <div><span class="tag">${esc(q.module)}</span><span class="tag">${esc(q.type)}</span><span class="tag">${esc(q.topic)}</span>${learnTag(q)}</div>
      <div class="stem">${esc(q.stem)}</div>
      <textarea class="answer-box" id="subj-ans" placeholder="把你的答案写在这里，尽量分点写…"></textarea>
      <div class="action-row">
        <button class="btn" id="subj-grade">提交给 AI 批改</button>
        <button class="btn ghost" id="subj-show">直接看参考答案</button>
      </div>
      <div id="subj-after"></div>
    `;
    mount.appendChild(c);

    $("#subj-show").addEventListener("click", () => showRefAnswer(q));
    $("#subj-grade").addEventListener("click", async () => {
      const my = $("#subj-ans").value.trim();
      const after = $("#subj-after");
      if (!AI.ready()) { after.innerHTML = `<div class="explain">${esc(AI.friendlyError(new Error("NO_KEY")))}</div>`; showRefAnswer(q); return; }
      $("#subj-grade").disabled = true;
      after.innerHTML = `<div class="explain ai-thinking">AI 阅卷老师正在批改…（这一步用更强的模型，稍慢）</div>`;
      try {
        const res = await AIFeat.gradeSubjective(q, my);
        after.innerHTML = `<div class="explain"><div class="verdict">📝 AI 批改结果</div><div style="white-space:pre-wrap">${esc(res)}</div></div>`;
        // 存历史
        const s = Store.get();
        s.subjectiveHistory.unshift({ id:q.id, stem:q.stem, myAnswer:my, aiResult:res, date: todayStr() });
        Store.save();
        appendSubjNav(q, session);
      } catch (err) {
        after.innerHTML = `<div class="explain">${esc(AI.friendlyError(err))}</div>`;
        $("#subj-grade").disabled = false;
        showRefAnswer(q);
      }
    });

    function showRefAnswer(q) {
      const after = $("#subj-after");
      const kp = (q.keyPoints||[]).map(k=>`<li>${esc(k)}</li>`).join("");
      after.innerHTML += `
        <div class="explain mt">
          <div class="verdict">📖 参考答案</div>
          <p style="white-space:pre-wrap">${esc(q.answer)}</p>
          ${kp?`<h3>采分点</h3><ul>${kp}</ul>`:''}
          <p class="small muted">💡 ${esc(q.explanation||"")}</p>
        </div>`;
      appendSubjNav(q, session);
    }
    function appendSubjNav(q, session) {
      if ($("#subj-next")) return;
      const nav = el("div","action-row");
      const last = session.idx === session.ids.length - 1;
      nav.innerHTML = `<button class="btn" id="subj-next">${last?'完成 →':'下一题 →'}</button>`;
      $("#subj-after").appendChild(nav);
      $("#subj-next").addEventListener("click", () => {
        if (last) finishQuiz(session);
        else { session.idx++; renderQuizQuestion(session); }
      });
    }
  }

  function finishQuiz(session) {
    setActive(false);
    const total = session.ids.length;
    const rate = total ? Math.round(session.correctCount/total*100) : 0;
    // 考点闯关：交回闯关流程自己处理结果（不显示通用完成页）
    if (session.mode === "skill") { session.onFinish && session.onFinish(session, rate); return; }
    // 每日训练完成 → 打卡
    if (session.mode === "train") {
      checkinToday();
      const s = Store.get();
      if (s.todayTask) { s.todayTask.done = true; Store.save(); }
    }
    // 专项练习完成 → 把这批标记为本轮已做（中途已逐题记录，这里兜底）
    if (session.mode === "practice" && session.poolKey) {
      session.ids.forEach(id => Study.markDone(session.poolKey, id));
    }
    // 复习完成 → 也算今日打卡
    if (session.mode === "review") { checkinToday(); markSprintDone("review"); }
    // 冲刺待办：真题/大题完成自动划掉
    if (session.mode === "practice" && session.poolKey === "zhenti") markSprintDone("zhenti");
    if (session.mode === "practice" && session.poolKey === "sprint-subj") markSprintDone("subj");
    // 模拟考完成 → 记录成绩。口径修正：正确率只按客观题算（主观题不比对答案，
    // 以前混进分母会把正确率拉低 ~13%）；并换算 150 分制预估卷面分方便对照 90 分目标。
    let mockEst = null, mockObjRate = null;
    if (session.mode === "mock" && total > 0) {
      const objN = session.ids.filter(id => {
        const q = QUESTION_BANK.find(x => x.id === id);
        return q && (q.type === "single" || q.type === "multiple");
      }).length;
      const objRate = objN ? Math.round(session.correctCount / objN * 100) : 0;
      mockObjRate = objRate;
      mockEst = Math.round(objRate / 100 * 150);   // 粗估：主观题按同等拿分率折算（成考主观阅卷偏松）
      const s = Store.get();
      s.mockHistory = s.mockHistory || [];
      s.mockHistory.unshift({ date: todayStr(), title: session.title, correct: session.correctCount, total: objN, rate: objRate, est: mockEst });
      if (s.mockHistory.length > 30) s.mockHistory.length = 30;
      Store.save();
      checkinToday();
      markSprintDone("mock");
    }
    mount.innerHTML = "";
    const c = el("div","card celebrate");
    c.innerHTML = `
      <div class="ring" style="--p:${mockObjRate !== null ? mockObjRate : rate}"><div class="inner"><span class="big">${mockObjRate !== null ? mockObjRate : rate}%</span><span class="cap">${mockObjRate !== null ? "客观题正确率" : "正确率"}</span></div></div>
      <h1>${session.mode==="train"?"今日训练完成 🎉":"这组做完啦"}</h1>
      <p class="muted">共 ${total} 题，客观题答对 ${session.correctCount} 题${session.wrongIds.length?`，${session.wrongIds.length} 题进了错题本`:""}。</p>
      ${mockEst !== null ? `<p>📊 预估卷面分 <strong style="font-size:1.3em;color:${mockEst>=90?'var(--ok)':'var(--bad)'}">${mockEst}</strong> / 150（目标 90+${mockEst>=90?'，达标！':'，差 '+(90-mockEst)+' 分'}）</p>` : ""}
      ${session.mode==="train"?`<p>连续打卡 <strong style="color:var(--accent)">${Store.get().streak}</strong> 天 · 今日已学 ${Study.fmt(Study.todaySeconds())}，稳住！</p>`:""}
      ${session.mode==="train"?`<div id="fin-summary" class="mt"></div>`:""}
      <div class="action-row mt">
        ${session.wrongIds.length?`<button class="btn ghost" id="fin-review">立刻复盘错题</button>`:""}
        <button class="btn" id="fin-home">回首页</button>
      </div>
    `;
    mount.appendChild(c);
    $("#fin-home").addEventListener("click", ()=>go("dashboard"));

    // 每日训练完成 → AI 学习总结
    if (session.mode === "train") renderDailySummary(session, rate);
    if (session.wrongIds.length) {
      $("#fin-review").addEventListener("click", () => {
        runQuiz({ title:"错题复盘", ids: session.wrongIds.slice(), mode:"wrong" });
      });
    }
    session.onFinish && session.onFinish(session);
  }

  // ============================================================
  // 每日训练入口
  // ============================================================
  // 打地基/进阶阶段全部掌握 → 自动升级到下一阶段
  function maybeAdvancePhase() {
    const s = Store.get();
    if (s.phase < 3 && Study.phaseCleared()) {
      const names = ["", "打地基", "全面铺开", "刷卷冲刺"];
      s.phase += 1; s.todayTask = null; Store.save(); updatePhaseBadge();
      flash(`🎉 阶段${s.phase-1}完成！进入阶段${s.phase}·${names[s.phase]}，开始上${s.phase===2?'中等难度':'全部难度+主观题'}`);
    }
  }

  function renderTrainStart() {
    setActive(false);
    maybeAdvancePhase();
    const task = buildDailyTask();
    const s = Store.get();
    mount.innerHTML = "";
    const c = el("div","card");
    if (!task.ids.length) {
      c.innerHTML = `<h1>今天没有可练的新题了 👍</h1><p class="muted">题库里的题你都练过并达到较高熟练度了。可以去「专项练习」再刷一轮，或「只刷错题」巩固，或用「AI 押题」加练薄弱点。</p>
      <div class="action-row"><button class="btn" onclick="App.go('practice')">专项练习</button><button class="btn subtle" onclick="App.go('wrong')">刷错题</button><button class="btn ghost" onclick="App.go('recite')">AI 助手</button></div>`;
      mount.appendChild(c); return;
    }
    const chap = CURRICULUM.find(x => x.chapter === task.chapter) || Study.currentChapter();
    const idx = CURRICULUM.findIndex(x => x.chapter === chap.chapter);
    const st = Store.get();
    const readToday = st.memoryRead[chap.id] === todayStr();
    const reviewN = task.ids.filter(id => !SRS.isNew(id)).length;
    c.innerHTML = `
      <h1>今日学习</h1>
      <p class="muted">阶段 ${s.phase}（${["打地基","全面铺开","刷卷冲刺"][s.phase-1]}）· ${todayMinutes()} 分钟 · 第 ${weekNo()} 周</p>
      <p class="small" style="color:var(--accent);font-weight:600">${todayModeLabel()}</p>
      <div class="explain mt">
        <div class="verdict">📘 今日主线：第 ${idx+1}/${CURRICULUM.length} 章 · ${esc(chap.title)}</div>
        <p class="small muted" style="margin:4px 0 0">系统三步走：先看懂关键词 → 再读必背卡 → 再练这一章的题。${s.phase===1?'（当前打地基，只出最简单的题）':''}</p>
      </div>
      ${chap.primer && chap.primer.length ? `
      <details class="mt" open>
        <summary>🍼 第一步 · 先看懂这些词（大白话，零基础必看）</summary>
        <div class="small" style="line-height:1.9">
          ${chap.primer.map(p=>`<p style="margin:8px 0"><strong style="color:var(--accent)">${esc(p.term)}</strong>：${esc(p.plain)}</p>`).join("")}
        </div>
      </details>` : ''}
      <details class="mt" ${readToday?'':'open'}>
        <summary>📌 第二步 · 今日必背卡（${readToday?'今天已背 ✅，可再看':'点开背，背完点“我背完了”'}）</summary>
        <ul style="line-height:1.9">${chap.must.map(m=>`<li>${esc(m)}</li>`).join("")}</ul>
        ${chap.mnemonic?`<p style="color:var(--accent)">🧠 ${esc(chap.mnemonic)}</p>`:""}
        <button class="btn subtle" id="mem-done">✅ 我背完了</button>
      </details>
      <div class="dash-grid mt mb">
        <div class="stat"><div class="num">${task.ids.length}</div><div class="label">今日题量</div></div>
        <div class="stat"><div class="num">${reviewN}</div><div class="label">复习旧题</div></div>
        <div class="stat"><div class="num">${task.ids.length-reviewN}</div><div class="label">新题</div></div>
      </div>
      ${task.done?'<p class="center" style="color:var(--ok)">今天已完成过一轮，可以再练一遍巩固 💪</p>':''}
      <button class="btn big" id="t-start">${task.done?'再练一遍':'开始练习'}</button>
    `;
    mount.appendChild(c);
    const md = $("#mem-done");
    if (md) md.addEventListener("click", () => {
      const s2 = Store.get(); s2.memoryRead[chap.id] = todayStr(); Store.save(); flash("已记录：今天背过这张卡 ✅");
      if (cardsReadToday() >= 3) markSprintDone("recite");
    });
    $("#t-start").addEventListener("click", () => {
      runQuiz({ title:"今日学习", ids: task.ids.slice(), mode:"train" });
    });
  }

  // ============================================================
  // 复习（记忆曲线 / 间隔重复，规则参考「不背单词」）
  // ============================================================
  const CURVE_TIP = "答错的题→次日就复习（趁还没忘牢）；答对的题→隔几天再复习，而且一次比一次晚（3天→7天→15天→30天→60天），越记越牢、问得越少。系统还会把同一天做的题自动错开到不同日子，不让它们全堆到第二天。";

  function renderReview() {
    setActive(false);
    const due = SRS.dueQuestions();
    mount.innerHTML = "";
    const c = el("div","card");
    if (!due.length) {
      const nx = SRS.nextDueText();
      c.innerHTML = `
        <h1>复习</h1>
        <p class="muted">🎉 现在没有到期要复习的题！${nx?`下一批大约在 <strong>${nx}</strong>。`:''}</p>
        <p class="small muted" style="line-height:1.8">${esc(CURVE_TIP)}</p>
        <div class="action-row"><button class="btn" onclick="App.go('train')">去学新考点</button>
        <button class="btn ghost" onclick="App.go('wrong')">刷错题</button></div>`;
      mount.appendChild(c); return;
    }
    const cap = reviewCap();
    const n = Math.min(due.length, cap);
    const backlog = due.length - n;
    c.innerHTML = `
      <h1>复习</h1>
      <p class="muted">到期该复习的有 <strong style="color:var(--bad)">${due.length}</strong> 题。<strong>别一次贪多</strong>——今天先复最该复的 <strong>${n}</strong> 题就够了，${backlog>0?`剩下 ${backlog} 题会自动顺延到以后，不用一次全做完。`:`正好全部复完。`}</p>
      <button class="btn big" id="rv-start">开始复习（${n} 题）</button>
      <details class="mt"><summary class="small">为什么有这么多？（点开看）</summary>
        <p class="small muted" style="line-height:1.8">你最近做的题多才会攒下这些。别担心：<strong>每天只复习封顶 ${cap} 题</strong>（工作日20/周末40），系统自动挑最该复的先复；答对的题间隔会越拉越长（3→7→15→30→60天）、还会错开到不同日子，所以过几天队列就会自己变短。${esc(CURVE_TIP)}</p></details>`;
    mount.appendChild(c);
    $("#rv-start").addEventListener("click", () => {
      runQuiz({ title:"复习", ids: due.slice(0, n).map(q=>q.id), mode:"review" });
    });
  }
  // 每日复习上限：工作日 20、周末 40（防止一次性堆太多）
  function reviewCap() { return isWeekend() ? 40 : 20; }

  // ============================================================
  // 冲刺模式（考点基本通关后：每日=复习错题+真题+模拟考+主观题写作）
  // ============================================================
  // 冲刺模式每日待办：{date, review, zhenti, subj, mock, recite}（隔天自动重置）
  function sprintTodo() {
    const s = Store.get();
    if (!s.sprintDone || s.sprintDone.date !== todayStr()) {
      s.sprintDone = { date: todayStr(), review: false, zhenti: false, subj: false, mock: false, recite: false };
      Store.save();
    }
    if (s.sprintDone.recite === undefined) s.sprintDone.recite = false;
    return s.sprintDone;
  }
  // 今天背过几张必背卡（memoryRead 里标记为今天的数量）
  function cardsReadToday() {
    const mr = Store.get().memoryRead || {};
    return Object.values(mr).filter(d => d === todayStr()).length;
  }
  function markSprintDone(key) {
    const t = sprintTodo();
    if (!t[key]) { t[key] = true; Store.save(); }
  }

  // 是否处于冲刺模式：手动指定优先；未指定时，考点通关≥总数-1 或已进考前45天 自动进入
  function sprintOn() {
    const s = Store.get();
    if (s.sprintMode === true) return true;
    if (s.sprintMode === false) return false;
    if (daysUntilExam() <= 45) return true;   // 最后备战期：无条件默认冲刺
    const ov = Skills.overall();
    return ov.total > 0 && ov.passed >= ov.total - 1;
  }

  function renderSprint() {
    setActive(false);
    const s = Store.get();
    mount.innerHTML = "";

    // 顶部：倒计时 + 模考成绩趋势
    const head = el("div","card");
    const hist = (s.mockHistory || []).slice(0, 6);
    const trend = hist.length
      ? hist.map(h => `<span class="tag ${(h.est!=null?h.est>=90:h.rate>=60)?'diff1':'diff3'}" title="${esc(h.title)} ${h.date}">${h.est!=null?h.est+"分":h.rate+"%"}</span>`).reverse().join(" ")
      : `<span class="small muted">还没有模考记录，考一套就有了</span>`;
    // 今日待办状态（做完自动划掉）
    const todo = sprintTodo();
    const dueN = SRS.dueCount();
    const todayN = Math.min(dueN, reviewCap());
    const reviewDone = todo.review || dueN === 0;   // 没有到期复习＝这项自然完成
    const readN = cardsReadToday();
    const reciteDone = todo.recite || readN >= 3;
    const doneCount = [reviewDone, todo.zhenti, todo.subj, reciteDone, todo.mock].filter(Boolean).length;
    const TASKS_N = 5;

    head.innerHTML = `
      <h1>🏁 冲刺模式</h1>
      <p class="muted">考点已基本通关（${Skills.overall().passed}/${Skills.overall().total}）。现在的任务就一件事：<strong>刷真题、抠错题、练答题，把分提上去。</strong>距考试 <strong style="color:var(--bad)">${daysUntilExam()}</strong> 天。</p>
      <p class="small">✅ 今日清单 <strong style="color:var(--accent)">${doneCount}/${TASKS_N}</strong>${doneCount===TASKS_N?' · 今天的任务全清，漂亮！🎉':''} ｜ 📈 最近模考：${trend}</p>
      <div class="bar-mini"><div class="f" style="width:${doneCount/TASKS_N*100}%"></div></div>`;
    mount.appendChild(head);

    // 生成一张待办卡（done=true 时划掉变绿）
    function taskCard(done, titleHtml, subHtml, btns) {
      const c = el("div", "card" + (done ? " task-done" : ""));
      c.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div><span class="task-check">${done ? "✅" : "⬜"}</span><span class="task-title">${titleHtml}</span>${subHtml ? `<br><span class="small muted">${subHtml}</span>` : ""}</div>
        <div class="action-row" style="margin:0">${btns}</div></div>`;
      mount.appendChild(c);
      return c;
    }

    // ① 复习（记忆曲线到期 + 错题）
    taskCard(reviewDone,
      `📆 <strong>第一步 · 复习</strong> · ${dueN>0?`今天该复 <span style="color:var(--bad);font-weight:700">${todayN}</span> 题（按记忆曲线）`:(todo.review?'今日复习已完成':'今天没有到期复习')} ｜ 错题本 <strong>${s.wrongBook.length}</strong> 道`,
      "",
      `${dueN>0?`<button class="btn${reviewDone?' subtle':''}" id="sp-review">${todo.review?'再复一遍':'开始复习'}</button>`:""}
       ${s.wrongBook.length?`<button class="btn subtle" id="sp-wrong">清错题</button>`:""}
       ${weakSpots().length?`<button class="btn subtle" id="sp-weak">🎯 薄弱专项</button>`:""}`);
    if ($("#sp-review")) $("#sp-review").addEventListener("click", ()=>go("review"));
    if ($("#sp-wrong")) $("#sp-wrong").addEventListener("click", ()=>{
      runQuiz({ title:"错题清刷", ids: s.wrongBook.slice(0, 20), mode:"wrong" });
    });
    if ($("#sp-weak")) $("#sp-weak").addEventListener("click", ()=>go("wrong"));

    // ② 每日真题 20 道（轮次不重复）
    const zhenti = QUESTION_BANK.filter(q => q.zhenti && (q.type==="single"||q.type==="multiple"));
    if (zhenti.length) {
      const zi = Study.roundInfo("zhenti", zhenti.length);
      taskCard(todo.zhenti,
        `📜 <strong>第二步 · 每日真题</strong> · 20 道（第 ${zi.round} 轮 · 已刷 ${zi.done}/${zhenti.length}）· 覆盖 2018–2025 八个年份`,
        "",
        `<button class="btn${todo.zhenti?' subtle':''}" id="sp-zhenti">${todo.zhenti?'再刷 20 道':'开始刷真题'}</button>`);
      $("#sp-zhenti").addEventListener("click", ()=>{
        const batch = Study.nextBatch("zhenti", zhenti, 20);
        runQuiz({ title:"每日真题", ids: batch.map(q=>q.id), mode:"practice", poolKey:"zhenti" });
      });
    }

    // ③ 今日主观题写作（辨析/简答/论述 轮换 1 道，AI 批改）
    const subj = QUESTION_BANK.filter(q => q.type==="辨析"||q.type==="简答"||q.type==="论述");
    if (subj.length) {
      const si = Study.roundInfo("sprint-subj", subj.length);
      taskCard(todo.subj,
        `✍️ <strong>第三步 · 写一道大题</strong> · ${subj.some(q=>q.zhenti)?`历年真题大题优先（真题 ${subj.filter(q=>q.zhenti).length} 道）`:'辨析/简答/论述轮着来'}（已写 ${si.done}/${subj.length}）· 写完 AI 按采分点批改`,
        "主观题 70 分是送分区，每天动笔一道，考场才写得出来",
        `<button class="btn${todo.subj?' subtle':''}" id="sp-subj">${todo.subj?'再写一道':'开始写'}</button>`);
      $("#sp-subj").addEventListener("click", ()=>{
        // 真题大题优先：本轮还有没写过的真题大题就先出真题，写完才轮到自编题
        const rec = (Store.get().roundState || {})["sprint-subj"];
        const done = rec ? rec.done : [];
        const zhRemain = subj.filter(q => q.zhenti && !done.includes(q.id));
        const pool = zhRemain.length ? zhRemain : subj;
        const batch = Study.nextBatch("sprint-subj", pool, 1);
        runQuiz({ title:"今日大题", ids: batch.map(q=>q.id), mode:"practice", poolKey:"sprint-subj" });
      });
    }

    // ④ 背必背卡（简答30分的输入端：每天背3张）
    taskCard(reciteDone,
      `📖 <strong>第四步 · 背 3 张必背卡</strong> · 今天已背 ${readN}/3 张`,
      "简答题30分靠默写核心表述——写大题是输出，这里是输入，5分钟搞定",
      `<button class="btn${reciteDone?' subtle':''}" id="sp-recite">${reciteDone?'再背几张':'去背卡'}</button>`);
    $("#sp-recite").addEventListener("click", ()=>go("memory"));

    // ⑤ 整卷模拟（最后一个月：每天 1 套）
    taskCard(todo.mock,
      `🧾 <strong>第五步 · 整卷模拟</strong> · 每天 1 套（8套真题卷+6套模拟卷，两周一轮）`,
      "成绩换算成 150 分制估分记在上方趋势里，盯着它涨到 90+",
      `<button class="btn${todo.mock?' subtle':''}" id="sp-mock">${todo.mock?'再考一套':'去考一套'}</button>`);
    $("#sp-mock").addEventListener("click", ()=>go("mock"));

    // 底部：切回闯关模式
    const foot = el("div","card center");
    foot.innerHTML = `<p class="small muted">想回去补概念、重学某个考点？<button class="btn ghost" id="sp-back" style="padding:6px 14px">切回闯关模式</button></p>`;
    mount.appendChild(foot);
    $("#sp-back").addEventListener("click", ()=>{ Store.set({sprintMode:false}); go("train"); });
  }

  // ============================================================
  // 今日学习 = 考点闯关（五步台阶：概念→易→中→难→过关）
  // ============================================================
  function renderSkillPath() {
    setActive(false);
    maybeAdvancePhase && maybeAdvancePhase();
    const sk = Skills.currentSkill();
    const step = Skills.nextStep(sk);
    const ov = Skills.overall();
    const idx = Skills.list.findIndex(x => x.id === sk.id);
    const st = Skills.state(sk.id);
    const ps = Skills.practiceSteps(sk);
    mount.innerHTML = "";

    // 顶部：进度 + 模式
    const head = el("div","card");
    head.innerHTML = `
      <h1>今日学习 · 闯关</h1>
      <p class="muted">已过关 <strong style="color:var(--accent)">${ov.passed}</strong> / ${ov.total} 个考点 · 第 ${weekNo()} 周 · ${todayModeLabel()}</p>
      <div class="bar-mini" style="margin-top:8px"><div class="f" style="width:${Math.round(ov.passed/ov.total*100)}%"></div></div>
      ${ov.passed >= ov.total*0.7 ? `<p class="small mt">考点学得差不多了？<button class="btn subtle" id="sk-sprint" style="padding:6px 14px">🏁 切换冲刺模式（每日=错题+真题+模拟考+大题）</button></p>` : ""}`;
    mount.appendChild(head);
    if ($("#sk-sprint")) $("#sk-sprint").addEventListener("click", ()=>{ Store.set({sprintMode:true}); go("train"); });

    // 每日复习：把「到期该复习」的旧题捞出来提示（记忆曲线）
    const dueN = SRS.dueCount();
    if (dueN > 0) {
      const todayN = Math.min(dueN, reviewCap());
      const rv = el("div","card");
      rv.style.borderColor = "var(--bad)";
      rv.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div>📆 <strong>今日复习</strong> · 今天复 <span style="color:var(--bad);font-weight:700">${todayN}</span> 题就够（按记忆曲线挑最该复的${dueN>todayN?`，共${dueN}题到期、其余自动顺延`:''}）</div>
        <button class="btn" id="sk-review">开始复习</button></div>`;
      mount.appendChild(rv);
      $("#sk-review").addEventListener("click", () => go("review"));
    }

    // 每日真题训练：从历年真题里抽 20 道（做过的本轮不再出现）
    const zhenti = QUESTION_BANK.filter(q => q.zhenti && (q.type === "single" || q.type === "multiple"));
    if (zhenti.length) {
      const zInfo = Study.roundInfo("zhenti", zhenti.length);
      const zt = el("div","card");
      zt.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div>📜 <strong>今日真题</strong> · 练 20 道历年真题（第 ${zInfo.round} 轮 · 已做 ${zInfo.done}/${zhenti.length}）</div>
        <button class="btn subtle" id="sk-zhenti">开始真题训练</button></div>`;
      mount.appendChild(zt);
      $("#sk-zhenti").addEventListener("click", () => {
        const batch = Study.nextBatch("zhenti", zhenti, 20);
        runQuiz({ title:"每日真题", ids: batch.map(q=>q.id), mode:"practice", poolKey:"zhenti" });
      });
    }

    if (step.type === "done") {
      const done = el("div","card celebrate");
      done.innerHTML = `<h1>🎉 太强了！全部 ${ov.total} 个考点都通关了！</h1>
        <p class="muted">该上强度了：去「模拟考」按真卷结构整套练，或「专项练习」刷押题保持手感。</p>
        <div class="action-row"><button class="btn" onclick="App.go('mock')">去模拟考</button><button class="btn ghost" onclick="App.go('practice')">刷押题</button></div>`;
      mount.appendChild(done);
      return;
    }

    // 当前考点卡：步骤条 + 概念 + 行动按钮
    const c = el("div","card");
    const tierLabel = t => ({1:"易",2:"中",3:"难"}[t]);
    const stepChips = [
      `<span class="chip ${st.conceptRead?'':'active'}">①概念${st.conceptRead?' ✓':''}</span>`,
      ...ps.map(p => `<span class="chip ${st.tiers.includes(p.tier)?'':(step.type==='tier'&&step.tier===p.tier?'active':'')}">${["","②认一认·易","③练一练·中","④挑战·难"][p.tier]}${st.tiers.includes(p.tier)?' ✓':''}</span>`),
      `<span class="chip ${step.type==='pass'?'active':''}">⑤过关${st.passed?' ✓':''}</span>`
    ].join("");

    let actionHtml = "";
    if (step.type === "concept") {
      setActive(true); // 读概念也算学习
      actionHtml = `
        <div class="explain">
          <div class="verdict">🍼 第一步 · 先用大白话看懂这个考点</div>
          <p style="line-height:1.9;white-space:pre-wrap">${esc(sk.concept)}</p>
        </div>
        <button class="btn big mt" id="sk-concept">看懂了，开始做题 →</button>`;
    } else if (step.type === "tier") {
      const n = Math.min(8, step.pool.length);
      actionHtml = `
        <div class="explain"><div class="verdict">${step.tier===1?'②认一认（最简单，先热身）':step.tier===2?'③练一练（应用一下）':'④挑战（难题，最后攻）'}</div>
          <p class="small muted">本层 ${n} 题，答对约 ${Math.round(Skills.TIER_PASS*100)}% 就过关。做过的会记住，答错的会讲。</p></div>
        <button class="btn big mt" id="sk-tier">开始 ${step.label}（${n} 题）→</button>`;
    } else if (step.type === "pass") {
      const n = Skills.passQuiz(sk).length;
      actionHtml = `
        <div class="explain"><div class="verdict">⑤ 过关测试</div>
          <p class="small muted">综合考 ${n} 题，答对约 ${Math.round(Skills.FINAL_PASS*100)}% 即通关，解锁下一个考点。</p></div>
        <button class="btn big mt" id="sk-pass">开始过关测试（${n} 题）→</button>`;
    }

    c.innerHTML = `
      <p class="small muted">正在攻克 第 ${idx+1}/${ov.total} 个考点</p>
      <h2 style="margin-top:2px">${esc(sk.title)} <span class="tag">${esc(sk.chapter)}</span></h2>
      <div class="chip-row">${stepChips}</div>
      ${actionHtml}
      <details class="mt"><summary class="small">看整体路线（后面还有哪些考点）</summary>
        <div class="small" style="line-height:1.9;margin-top:6px">${Skills.list.map((x,i)=>{
          const xs=Skills.state(x.id); const cur=i===idx;
          return `<div style="${cur?'color:var(--accent);font-weight:600':''}">${xs.passed?'✅':(cur?'👉':'🔒')} ${i+1}. ${esc(x.title)}</div>`;
        }).join("")}</div>
      </details>
    `;
    mount.appendChild(c);

    if ($("#sk-concept")) $("#sk-concept").addEventListener("click", () => {
      Skills.markConcept(sk.id); checkinToday(); renderSkillPath();
    });
    if ($("#sk-tier")) $("#sk-tier").addEventListener("click", () => {
      const ids = shuffleArr(step.pool).slice(0,8).map(q=>q.id);
      runQuiz({ title:`${sk.title} · ${step.label}`, ids, mode:"skill",
        onFinish:(sess,rate)=>handleSkillStep(sk, {type:"tier",tier:step.tier,label:step.label}, sess, rate) });
    });
    if ($("#sk-pass")) $("#sk-pass").addEventListener("click", () => {
      const ids = Skills.passQuiz(sk);
      runQuiz({ title:`${sk.title} · 过关测试`, ids, mode:"skill",
        onFinish:(sess,rate)=>handleSkillStep(sk, {type:"pass"}, sess, rate) });
    });
  }

  function handleSkillStep(sk, stepInfo, session, rate) {
    checkinToday();
    const acc = rate / 100;
    let passed, title, msg;
    if (stepInfo.type === "tier") {
      passed = Skills.tierPass(acc);
      if (passed) Skills.markTier(sk.id, stepInfo.tier);
      title = passed ? "这一层过啦！" : "差一点，再练一遍";
      msg = passed ? `正确率 ${rate}%，${stepInfo.label} 通过 ✅` : `正确率 ${rate}%，没到 ${Math.round(Skills.TIER_PASS*100)}%。别急，错题刚讲过，再来一遍就顺了。`;
    } else {
      passed = Skills.finalPass(acc);
      if (passed) Skills.markPassed(sk.id);
      title = passed ? "🎉 考点通关！" : "过关差一点";
      msg = passed ? `正确率 ${rate}%，「${sk.title}」拿下，解锁下一个考点！` : `正确率 ${rate}%，没到 ${Math.round(Skills.FINAL_PASS*100)}%。再巩固一下这个考点。`;
    }
    mount.innerHTML = "";
    const c = el("div","card celebrate");
    const nextPassed = stepInfo.type==="pass" && passed;
    c.innerHTML = `
      <div class="ring" style="--p:${rate}"><div class="inner"><span class="big">${rate}%</span><span class="cap">正确率</span></div></div>
      <h1>${title}</h1>
      <p class="muted">${esc(msg)}</p>
      <div id="sk-summary" class="mt"></div>
      <div class="action-row mt">
        <button class="btn" id="sk-continue">${passed?'继续 →':'再来一遍'}</button>
        <button class="btn ghost" id="sk-home">回首页</button>
      </div>`;
    mount.appendChild(c);
    $("#sk-home").addEventListener("click", ()=>go("dashboard"));
    $("#sk-continue").addEventListener("click", ()=>renderSkillPath());
    // 通关一个考点时，给一段 AI 小结（可选）
    if (nextPassed && AI.ready()) {
      const box = $("#sk-summary");
      box.innerHTML = `<div class="explain"><div class="ai-thinking">AI 老师点评中…</div></div>`;
      AIFeat.dailySummary(`我刚通关考点「${sk.title}」，过关测试正确率${rate}%。请用一两句话肯定我，并提示这个考点考试里最容易考的点。`)
        .then(t=>box.innerHTML=`<div class="explain"><div class="verdict">🧑‍🏫 老师点评</div><div style="white-space:pre-wrap">${esc(t)}</div></div>`)
        .catch(()=>box.innerHTML="");
    }
  }

  // ============================================================
  // 错题本
  // ============================================================
  // ============================================================
  // 薄弱项分析：把"错过且还没练回来"的题按考点聚类
  // 判定：某题 progress.wrong>0 且 level<2（还没连对回来）＝未修复错题；
  //       一个考点攒了 ≥2 道未修复错题 ＝ 薄弱考点。
  // 训练集＝该考点未修复错题 + 同考点没做过的新题，共 12 道（由浅入深）。
  // 练回来（level≥2）自动退出集合；薄弱项清零卡片自动消失。
  // ============================================================
  function weakSpots() {
    const p = Store.get().progress || {};
    const spots = [];
    (window.SKILLS || []).forEach(sk => {
      const qs = Skills.skillQs(sk);
      if (!qs.length) return;
      const unrecovered = qs.filter(q => p[q.id] && p[q.id].wrong > 0 && (p[q.id].level || 0) < 2);
      if (unrecovered.length < 2) return;
      const wrongTotal = qs.reduce((a, q) => a + ((p[q.id] && p[q.id].wrong) || 0), 0);
      const attempts = qs.reduce((a, q) => a + ((p[q.id] ? (p[q.id].correct || 0) + (p[q.id].wrong || 0) : 0)), 0);
      const acc = attempts ? Math.round((attempts - wrongTotal) / attempts * 100) : 0;
      // 训练集：未修复错题（浅→深）打头，再补同考点没做过的新题，共 12 道
      const byDiff = (a, b) => (a.difficulty || 2) - (b.difficulty || 2);
      // 补充的新题优先抽真题，其次全真模拟卷，自编题垫底（少刷低价值题）
      const srcRank = q => q.zhenti ? 0 : q.mock ? 1 : q.yati ? 2 : 3;
      const fresh = qs.filter(q => !p[q.id]).sort((a, b) => srcRank(a) - srcRank(b) || byDiff(a, b));
      const ids = unrecovered.slice().sort(byDiff).concat(fresh).slice(0, 12).map(q => q.id);
      spots.push({ sk, unrecovered: unrecovered.length, acc, ids });
    });
    spots.sort((a, b) => b.unrecovered - a.unrecovered || a.acc - b.acc);
    return spots.slice(0, 6);
  }

  function renderWrong() {
    const s = Store.get();
    mount.innerHTML = "";

    // —— 薄弱项专项训练（按错题自动生成）——
    const spots = weakSpots();
    if (spots.length) {
      const wc = el("div","card");
      const mixedIds = [...new Set(spots.flatMap(x => x.ids))].slice(0, 20);
      wc.innerHTML = `
        <h1>🎯 薄弱项专项训练</h1>
        <p class="muted">根据你的错题自动聚类出 <strong>${spots.length}</strong> 个薄弱考点。每套＝你的未修复错题＋同考点新题（由浅入深）。<strong>连对 2 次算练回来</strong>，练回来的题自动退出，薄弱项清完卡片就消失。</p>
        <div class="action-row"><button class="btn" id="weak-mix">🔥 混合连刷（${mixedIds.length} 题，覆盖全部薄弱点）</button></div>
        <div id="weak-list"></div>`;
      mount.appendChild(wc);
      $("#weak-mix").addEventListener("click", () =>
        runQuiz({ title: "薄弱项混合专项", ids: mixedIds, mode: "practice" }));
      const wl = $("#weak-list");
      spots.forEach(x => {
        const row = el("div","list-item");
        row.innerHTML = `<div class="li-top">
          <span><strong>${esc(x.sk.title)}</strong> <span class="small muted">未修复错题 ${x.unrecovered} 道 · 该考点正确率 ${x.acc}%</span></span>
          <span class="tag ${x.acc < 60 ? 'diff3' : 'diff2'}">${x.ids.length} 题专项</span></div>`;
        row.addEventListener("click", () =>
          runQuiz({ title: `薄弱专项 · ${x.sk.title}`, ids: x.ids, mode: "practice" }));
        wl.appendChild(row);
      });
    }

    const c = el("div","card");
    if (!s.wrongBook.length) {
      c.innerHTML = spots.length
        ? `<h3>错题本已清空 ✨</h3><p class="muted">上面的薄弱项还没完全练回来，建议把专项刷完。</p>`
        : `<h1>错题本是空的 ✨</h1><p class="muted">先去做题，答错的会自动收进来。</p><button class="btn" onclick="App.go('train')">去训练</button>`;
      mount.appendChild(c); return;
    }
    c.innerHTML = `
      <h1>错题本（${s.wrongBook.length}）</h1>
      <p class="muted">这里是你答错过的题。刷一遍，答对了熟练度会回升；连续答对会逐渐移出高频复习。</p>
      <div class="action-row">
        <button class="btn" id="w-all">只刷错题（全部）</button>
        <button class="btn ghost" id="w-diag">AI 错题诊断报告</button>
      </div>
      <div id="w-diag-box"></div>
      <h3>错题清单</h3>
      <div id="w-list"></div>
    `;
    mount.appendChild(c);
    const list = $("#w-list");
    s.wrongBook.forEach(id => {
      const q = QUESTION_BANK.find(x=>x.id===id); if(!q) return;
      const item = el("div","list-item");
      item.innerHTML = `<div class="li-top"><span>${esc(q.stem.slice(0,44))}${q.stem.length>44?'…':''}</span>
        <span class="tag">${esc(q.module)}</span></div>`;
      item.addEventListener("click", ()=> runQuiz({ title:"错题重练", ids:[id], mode:"wrong" }));
      list.appendChild(item);
    });
    $("#w-all").addEventListener("click", ()=> runQuiz({ title:"只刷错题", ids: s.wrongBook.slice(), mode:"wrong" }));
    $("#w-diag").addEventListener("click", async () => {
      const box = $("#w-diag-box");
      if (!AI.ready()) { box.innerHTML = `<div class="explain">${esc(AI.friendlyError(new Error("NO_KEY")))}</div>`; return; }
      box.innerHTML = `<div class="explain ai-thinking">AI 正在分析你的错题模式…</div>`;
      const wrongQs = s.wrongBook.map(id=>QUESTION_BANK.find(x=>x.id===id)).filter(Boolean).slice(0,30);
      try {
        const rep = await AIFeat.diagnose(wrongQs);
        box.innerHTML = `<div class="explain"><div class="verdict">🩺 错题诊断报告</div><div style="white-space:pre-wrap">${esc(rep)}</div></div>`;
      } catch (err) { box.innerHTML = `<div class="explain">${esc(AI.friendlyError(err))}</div>`; }
    });
  }

  // ============================================================
  // 模拟考（按真实卷结构：40单选×2 + 主观题）
  // ============================================================
  function renderMock() {
    mount.innerHTML = "";
    const c = el("div","card");
    const singles = QUESTION_BANK.filter(q=>q.type==="single").length;
    const nBx = QUESTION_BANK.filter(q=>q.type==="辨析").length;
    const nJd = QUESTION_BANK.filter(q=>q.type==="简答").length;
    const nLs = QUESTION_BANK.filter(q=>q.type==="论述").length;
    const canFull = singles >= 35;
    c.innerHTML = `
      <h1>模拟考</h1>
      <p class="muted">现行卷面（2021年起）：选择题 35×2=70，简答 4×10=40，论述 2×20=40，满分 150。<br><span class="small">2025 年起选择题减为 30 道＋新增 5 道时政填空（填空去「每日必背」页背默）。辨析题是 2020 年以前的旧题型，已不再考。</span></p>
      <p class="small muted">题库现有：单选 ${singles} 题、简答 ${nJd}（含真题 32）、论述 ${nLs}（含真题 16）、旧题型辨析 ${nBx}。${canFull?"✅ 已够出完整套卷。":"⚠️ 单选还不足 35，先用『迷你模拟』。"}</p>

      <h3>① 完整套卷（按现行卷面结构，模拟真实考试）</h3>
      <p class="small muted">选择题 35（真题+模拟卷池，马哲∶毛中特∶时政 ≈ 3∶6∶1）＋简答 4＋论述 2（历年真题大题优先）。</p>
      <button class="btn big" id="mock-full" ${canFull?"":"disabled"}>${canFull?"开始完整套卷":"题量不足，暂不可用"}</button>

      <div id="mock-sets"></div>

      <h3 class="mt">③ 迷你模拟 / 单项突破（自选部分）</h3>
      <div class="chip-row" id="mock-parts">
        <span class="chip active" data-p="single">选择题×20</span>
        <span class="chip active" data-p="辨析">辨析</span>
        <span class="chip active" data-p="简答">简答</span>
        <span class="chip" data-p="论述">论述</span>
      </div>
      <button class="btn subtle mt" id="mock-start">开始迷你模拟</button>
    `;
    mount.appendChild(c);

    // ② 按整套原卷考（历年真题卷 / 全真模拟卷各自成套，最接近真实考场）
    const setsBox = $("#mock-sets");
    const setMap = {};
    QUESTION_BANK.forEach(q => {
      if (q.type !== "single" && q.type !== "multiple") return;
      const name = q.zhenti ? (q.year + " 年真题卷") : (q.mock ? (q.source || "全真模拟卷") : null);
      if (!name) return;
      (setMap[name] = setMap[name] || []).push(q);
    });
    const setNames = Object.keys(setMap).sort();
    if (setNames.length) {
      setsBox.innerHTML = `<h3 class="mt">② 按整套原卷考（最接近真实考场）</h3>
        <p class="small muted">直接考一整套原卷的选择题，题目顺序与卷面一致。</p>
        <div class="chip-row">${setNames.map((n,i)=>
          `<span class="chip" data-set="${i}">${esc(n)}（${setMap[n].length}题）</span>`).join("")}</div>`;
      setsBox.querySelectorAll(".chip[data-set]").forEach(ch => {
        ch.addEventListener("click", () => {
          const name = setNames[parseInt(ch.dataset.set,10)];
          const ids = setMap[name].slice().sort((a,b)=>String(a.id).localeCompare(String(b.id))).map(q=>q.id);
          runQuiz({ title: name, ids, mode:"mock" });
        });
      });
    }

    const chips = [...c.querySelectorAll("#mock-parts .chip")];
    chips.forEach(ch => ch.addEventListener("click", ()=>ch.classList.toggle("active")));

    // 完整套卷：现行卷面（2021年起）＝35单选 + 4简答 + 2论述
    $("#mock-full").addEventListener("click", () => {
      const ids = drawSingles(35).map(q=>q.id);
      pushN("简答", 4, ids); pushN("论述", 2, ids);
      runQuiz({ title:"完整模拟卷", ids, mode:"mock" });
    });

    $("#mock-start").addEventListener("click", () => {
      const parts = chips.filter(c=>c.classList.contains("active")).map(c=>c.dataset.p);
      const ids = [];
      if (parts.includes("single")) drawSingles(20).forEach(q=>ids.push(q.id));
      ["辨析","简答","论述"].forEach(tp => {
        if (parts.includes(tp)) QUESTION_BANK.filter(q=>q.type===tp).forEach(q=>ids.push(q.id));
      });
      if (!ids.length) { alert("至少选一个部分"); return; }
      runQuiz({ title:"迷你模拟", ids, mode:"mock" });
    });
  }
  // 按内容比例抽 n 道单选（马哲30% 毛中特58% 时政12%），不足则用其他模块补齐
  function drawSingles(n) {
    // 冲刺期原则：完整套卷只从"真题+全真模拟卷"里抽，不掺自编题（不够时才补）
    const prime = QUESTION_BANK.filter(q => q.type==="single" && (q.zhenti || q.mock));
    const pool = prime.length >= n ? prime : QUESTION_BANK.filter(q => q.type==="single");
    const byMod = m => shuffleArr(pool.filter(q => q.module===m));
    const want = { "马哲": Math.round(n*0.30), "毛中特": Math.round(n*0.58), "时政": Math.max(1, Math.round(n*0.12)) };
    let out = [];
    Object.keys(want).forEach(m => { out = out.concat(byMod(m).slice(0, want[m])); });
    // 补齐/截断到 n
    if (out.length < n) {
      const rest = shuffleArr(QUESTION_BANK.filter(q=>q.type==="single" && !out.includes(q)));
      out = out.concat(rest.slice(0, n - out.length));
    }
    return shuffleArr(out).slice(0, n);
  }
  function pushN(type, n, ids) {
    // 主观题优先抽历年真题大题，不够再补自编题
    const all = QUESTION_BANK.filter(q=>q.type===type);
    const pick = shuffleArr(all.filter(q=>q.zhenti)).concat(shuffleArr(all.filter(q=>!q.zhenti)));
    pick.slice(0, n).forEach(q=>ids.push(q.id));
  }
  function shuffleArr(a){const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}

  // ============================================================
  // 每日 AI 学习总结
  // ============================================================
  function renderDailySummary(session, rate) {
    const box = $("#fin-summary"); if (!box) return;
    const s = Store.get();
    if (!AI.ready()) {
      box.innerHTML = `<div class="explain small"><strong>今日小结：</strong>完成 ${session.ids.length} 题，正确率 ${rate}%，错 ${session.wrongIds.length} 题。填了 API Key 后，这里会有 AI 的个性化总结与明日建议。</div>`;
      return;
    }
    box.innerHTML = `<div class="explain"><div class="ai-thinking">AI 正在给你写今日总结…</div></div>`;
    const weak = weakModuleOrder()[0];
    const summary = `今天完成 ${session.ids.length} 题，正确率 ${rate}%，错 ${session.wrongIds.length} 题；正在学的章节：${s.todayTask?.chapter||''}；较弱模块约 ${weak}；今日学习时长 ${Study.fmt(Study.todaySeconds())}；距考试 ${daysUntilExam()} 天。`;
    AIFeat.dailySummary(summary).then(t => {
      box.innerHTML = `<div class="explain"><div class="verdict">🧑‍🏫 今日学习总结</div><div style="white-space:pre-wrap">${esc(t)}</div></div>`;
      const st = Store.get();
      st.dailySummaries.unshift({ date: todayStr(), text: t, answered: session.ids.length, correct: session.correctCount });
      Store.save();
    }).catch(err => {
      box.innerHTML = `<div class="explain small">（今日总结没生成：${esc(AI.friendlyError(err))}）本次正确率 ${rate}%。</div>`;
    });
  }

  // ============================================================
  // 专项练习（不重复轮次：做过的本轮不再出现）
  // ============================================================
  function renderPractice() {
    setActive(false);
    mount.innerHTML = "";
    const c = el("div","card");
    c.innerHTML = `
      <h1>专项练习</h1>
      <p class="muted">选范围，一次做一批。<strong>做过的本轮不会再出现</strong>，中途退出再进接着做；整轮做完自动进入下一轮。</p>
      <div class="field"><label>练哪部分？</label><select id="pr-scope"></select></div>
      <div class="field"><label>每次题量</label>
        <select id="pr-size"><option value="10">10 题</option><option value="20" selected>20 题</option><option value="30">30 题</option></select></div>
      <div id="pr-info" class="explain small"></div>
      <div class="action-row">
        <button class="btn" id="pr-start">开始专项练习</button>
        <button class="btn ghost" id="pr-reset">重置本范围进度</button>
      </div>
    `;
    mount.appendChild(c);
    const scopeSel = $("#pr-scope");
    const opts = [{k:"all",label:"全部题目"},{k:"zhenti",label:"只刷历年真题"},{k:"mock",label:"只刷模拟卷"},{k:"yati",label:"只刷押题"}];
    ["马哲","毛中特","时政"].forEach(m=>opts.push({k:"mod:"+m,label:"模块 · "+m}));
    CURRICULUM.forEach(cu=>opts.push({k:"chap:"+cu.chapter,label:"章节 · "+cu.title}));
    scopeSel.innerHTML = opts.map(o=>`<option value="${o.k}">${esc(o.label)}</option>`).join("");
    function poolFor(key){
      const obj = QUESTION_BANK.filter(q=>q.type==="single"||q.type==="multiple");
      if (key==="all") return obj;
      if (key==="zhenti") return obj.filter(q=>q.zhenti);
      if (key==="mock") return obj.filter(q=>q.mock);
      if (key==="yati") return obj.filter(q=>q.yati);
      if (key.startsWith("mod:")) return obj.filter(q=>q.module===key.slice(4));
      if (key.startsWith("chap:")) return obj.filter(q=>q.chapter===key.slice(5));
      return obj;
    }
    function refresh(){
      const key=scopeSel.value, pool=poolFor(key), info=Study.roundInfo(key,pool.length);
      $("#pr-info").innerHTML = pool.length
        ? `本范围共 ${pool.length} 题 · 当前第 <strong>${info.round}</strong> 轮 · 本轮已做 <strong>${info.done}/${pool.length}</strong>`
        : "这个范围暂时没有题。";
    }
    scopeSel.addEventListener("change", refresh); refresh();
    $("#pr-start").addEventListener("click", ()=>{
      const key=scopeSel.value, pool=poolFor(key);
      if (!pool.length){ alert("这个范围没有题"); return; }
      const size=parseInt($("#pr-size").value,10);
      const batch=Study.nextBatch(key,pool,size);
      runQuiz({ title:"专项练习", ids:batch.map(q=>q.id), mode:"practice", poolKey:key });
    });
    $("#pr-reset").addEventListener("click", ()=>{
      if (confirm("重置本范围的练习轮次进度？（不影响熟练度和错题本）")){ Study.resetRound(scopeSel.value); refresh(); flash("已重置 ✅"); }
    });
  }

  // ============================================================
  // 每日必背（死记硬背材料 + AI 章节串讲）
  // ============================================================
  function renderMemory() {
    setActive(true); // 阅读也计入学习时长
    mount.innerHTML = "";
    const s = Store.get();
    const curIdx = Study.currentChapterIndex();
    const c = el("div","card");
    c.innerHTML = `
      <h1>每日必背</h1>
      <p class="muted">这些是选择题和主观题的命根子——固定表述、核心考点、口诀。每天抽几分钟读一遍，考前反复过。</p>
      <p class="small" style="color:var(--accent)">建议今天重点背：第 ${curIdx+1} 章《${esc(CURRICULUM[curIdx].title)}》</p>
      <div id="mem-list"></div>`;
    mount.appendChild(c);

    // —— 2026 时政背默（2025年起真卷新增5道时政填空，要能默写）——
    const szCards = window.SHIZHENG_CARDS || [];
    if (szCards.length) {
      const readSz = szCards.filter(k => s.memoryRead[k.id] === todayStr()).length;
      const sc = el("div","card");
      sc.innerHTML = `
        <h3>🗞️ 2026 时政背默（${szCards.length} 张 · 今天已背 ${readSz} 张）</h3>
        <p class="small muted">2025 年起真卷新增 5 道时政<strong>填空题</strong>——不是四选一，是要默写出来。先自己想空里填什么，再点「看答案」，背下来了就点 ✅。</p>
        <div id="sz-list"></div>`;
      c.after(sc);
      const szList = sc.querySelector("#sz-list");
      szCards.forEach(k => {
        const done = s.memoryRead[k.id];
        const row = el("div","list-item");
        row.innerHTML = `<div class="li-top" style="align-items:flex-start">
            <span style="flex:1">${esc(k.q)}<span class="sz-ans" hidden> 👉 <strong style="color:var(--accent)">${esc(k.a)}</strong>${k.note?`<span class="small muted">（${esc(k.note)}）</span>`:''}</span></span>
            <span style="white-space:nowrap">
              <button class="btn ghost sz-show" style="padding:4px 10px">看答案</button>
              <button class="btn subtle sz-read" data-id="${esc(k.id)}" style="padding:4px 10px">${done===todayStr()?"✅":"背过了"}</button>
            </span></div>`;
        row.querySelector(".sz-show").addEventListener("click", ev => {
          ev.stopPropagation();
          const a = row.querySelector(".sz-ans"); a.hidden = !a.hidden;
          ev.target.textContent = a.hidden ? "看答案" : "遮住";
        });
        row.querySelector(".sz-read").addEventListener("click", ev => {
          ev.stopPropagation();
          const st = Store.get(); st.memoryRead[ev.target.dataset.id] = todayStr(); Store.save();
          if (cardsReadToday() >= 3) markSprintDone("recite");
          ev.target.textContent = "✅";
        });
        szList.appendChild(row);
      });
    }

    const list = $("#mem-list");
    CURRICULUM.forEach((cu,i)=>{
      const read = s.memoryRead[cu.id];
      const d = el("details"); if (i===curIdx) d.open = true;
      d.innerHTML = `<summary>第${i+1}章 · ${esc(cu.title)} ${read?`<span class="tag diff1">已背 ${esc(read)}</span>`:''}</summary>
        ${cu.primer&&cu.primer.length?`<div class="explain small" style="margin:6px 0"><strong>🍼 先看懂这些词：</strong>${cu.primer.map(p=>`<div style="margin:5px 0"><strong style="color:var(--accent)">${esc(p.term)}</strong>：${esc(p.plain)}</div>`).join("")}</div>`:''}
        <div class="small muted" style="margin:8px 0 2px">📌 必背要点：</div>
        <ul style="line-height:1.9;margin-top:2px">${cu.must.map(m=>`<li>${esc(m)}</li>`).join("")}</ul>
        ${cu.mnemonic?`<p style="color:var(--accent)">🧠 ${esc(cu.mnemonic)}</p>`:''}
        <div class="action-row">
          <button class="btn subtle mem-read" data-id="${cu.id}">✅ 标记已背</button>
          <button class="btn ghost mem-lec" data-i="${i}">🧑‍🏫 AI 串讲这一章</button>
        </div>
        <div class="mem-lec-box"></div>`;
      list.appendChild(d);
    });
    list.querySelectorAll(".mem-read").forEach(b=>b.addEventListener("click",()=>{
      const st=Store.get(); st.memoryRead[b.dataset.id]=todayStr(); Store.save();
      if (cardsReadToday() >= 3) markSprintDone("recite");
      flash("已标记 ✅"); renderMemory();
    }));
    list.querySelectorAll(".mem-lec").forEach(b=>b.addEventListener("click",async()=>{
      const box=b.parentElement.nextElementSibling;
      if(!AI.ready()){ box.innerHTML=`<div class="explain small">${esc(AI.friendlyError(new Error("NO_KEY")))}</div>`; return; }
      box.innerHTML=`<div class="explain ai-thinking">AI 正在串讲这一章…</div>`;
      const cu=CURRICULUM[parseInt(b.dataset.i,10)];
      try{ const t=await AIFeat.chapterLecture(cu.title,cu.must);
        box.innerHTML=`<div class="explain"><div class="verdict">🧑‍🏫 ${esc(cu.title)} · 串讲</div><div style="white-space:pre-wrap">${esc(t)}</div></div>`;
      }catch(err){ box.innerHTML=`<div class="explain small">${esc(AI.friendlyError(err))}</div>`; }
    }));
  }

  // ============================================================
  // 学习进度（一次性通关率 + 学习时长）
  // ============================================================
  function renderProgress() {
    setActive(false);
    mount.innerHTML = "";
    const s = Store.get();
    const days = Study.recentDays(7);
    const maxSec = Math.max(60, ...days.map(d=>d.sec));
    const timeBars = days.map(d=>{
      const h = Math.round(d.sec/maxSec*60);
      return `<div style="flex:1;text-align:center">
        <div style="height:64px;display:flex;align-items:flex-end;justify-content:center">
          <div title="${Study.fmt(d.sec)}" style="width:60%;height:${h}px;min-height:2px;background:var(--accent);border-radius:4px 4px 0 0"></div></div>
        <div class="small muted">${d.date.slice(5)}</div></div>`;
    }).join("");
    const c1 = el("div","card");
    c1.innerHTML = `
      <h1>学习进度</h1>
      <div class="dash-grid">
        <div class="stat"><div class="num" style="font-size:22px">${Study.fmt(Study.todaySeconds())}</div><div class="label">今日学习时长</div></div>
        <div class="stat"><div class="num" style="font-size:22px">${Study.fmt(Study.totalSeconds())}</div><div class="label">累计学习时长</div></div>
        <div class="stat"><div class="num">${s.streak}</div><div class="label">连续打卡天</div></div>
      </div>
      <h3>近 7 天学习时长</h3>
      <div style="display:flex;gap:6px;align-items:flex-end">${timeBars}</div>`;
    mount.appendChild(c1);
    const c2 = el("div","card");
    c2.innerHTML = `<h2>各知识点掌握度</h2>
      <p class="small muted">用「一次性通关率」（第一次做就答对的比例）判断掌握程度。<span style="color:var(--ok)">绿=已掌握</span> / <span style="color:var(--bad)">黄=学习中</span> / 灰=未学。</p>
      <div id="prog-list"></div>`;
    mount.appendChild(c2);
    const list = $("#prog-list");
    CURRICULUM.forEach((cu,i)=>{
      const st = Study.chapterStats(cu.chapter), ss = Study.status(st);
      const rate = st.passRate===null?0:st.passRate;
      list.innerHTML += `
        <div class="mb">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span>第${i+1}章 · ${esc(cu.title)} <span class="tag ${ss.cls}">${ss.label}</span></span>
            <span class="muted small">练 ${st.seen}/${st.total} 题 · 通关率 ${st.passRate===null?'—':rate+'%'}</span>
          </div>
          <div class="bar-mini"><div class="f" style="width:${rate}%"></div></div>
        </div>`;
    });
  }

  // ============================================================
  // AI 助手（背诵陪练 / 出题 / 押题 / 答疑）
  // ============================================================
  function renderRecite() {
    setActive(false);
    mount.innerHTML = "";
    const topics = [...new Set(QUESTION_BANK.map(q=>q.topic))];
    const c = el("div","card");
    c.innerHTML = `
      <h1>AI 助手</h1>
      <p class="muted">用 AI 帮你背、押题、答疑。（需要 API Key，可在设置里填 B.AI 或官方）</p>
      <div class="field"><label>选个考点</label>
        <select id="rc-topic">${topics.map(t=>`<option>${esc(t)}</option>`).join("")}</select></div>
      <div class="action-row">
        <button class="btn" id="rc-recite">🗣️ 背诵陪练</button>
        <button class="btn subtle" id="rc-gen">📝 出5道同类题</button>
        <button class="btn ghost" id="rc-yati">🎯 AI 押题</button>
      </div>
      <div id="rc-box" class="mt"></div>
    `;
    mount.appendChild(c);
    $("#rc-recite").addEventListener("click", ()=>startRecite($("#rc-topic").value));
    $("#rc-gen").addEventListener("click", ()=>genQuestions($("#rc-topic").value, false));
    $("#rc-yati").addEventListener("click", ()=>genQuestions($("#rc-topic").value, true));

    // AI 答疑
    const c2 = el("div","card");
    c2.innerHTML = `<h2>💬 AI 答疑</h2>
      <p class="small muted">政治哪里不懂都能问，比如"辨析题怎么答才拿分""帮我区分主要矛盾和矛盾的主要方面"。</p>
      <div id="ask-thread"></div>
      <div class="ask-row"><input id="ask-q" placeholder="输入你的问题…"><button class="btn" id="ask-go">问</button></div>`;
    mount.appendChild(c2);
    let hist = [];
    function renderAsk(){
      const th=$("#ask-thread"); th.innerHTML="";
      hist.forEach(m=>{ const b=el("div","bubble "+(m.role==="assistant"?"ai":"me")); b.innerHTML=esc(m.content); th.appendChild(b); });
    }
    const send = async ()=>{
      const v=$("#ask-q").value.trim(); if(!v) return;
      if(!AI.ready()){ $("#ask-thread").innerHTML=`<div class="explain small">${esc(AI.friendlyError(new Error("NO_KEY")))}</div>`; return; }
      hist.push({role:"user",content:v}); $("#ask-q").value=""; renderAsk();
      const th=$("#ask-thread"); const t=el("div","bubble ai ai-thinking"); t.textContent="思考中…"; th.appendChild(t);
      try{ const r=await AIFeat.ask(hist); hist.push({role:"assistant",content:r}); renderAsk(); }
      catch(err){ t.classList.remove("ai-thinking"); t.textContent=AI.friendlyError(err); }
    };
    $("#ask-go").addEventListener("click", send);
    $("#ask-q").addEventListener("keydown", e=>{ if(e.key==="Enter") send(); });
  }
  function startRecite(topic) {
    const box = $("#rc-box");
    if (!AI.ready()) { box.innerHTML = `<div class="explain">${esc(AI.friendlyError(new Error("NO_KEY")))}</div>`; return; }
    box.innerHTML = `<div class="bubble ai ai-thinking">AI 老师准备中…</div>`;
    let history = [{role:"user",content:`我要背『${topic}』。先讲要点再考我。`}];
    AIFeat.reciteStart(topic).then(first=>{
      history.push({role:"assistant",content:first});
      const thread = el("div","ai-box"); box.innerHTML=""; box.appendChild(thread);
      renderReciteThread(thread, history);
    }).catch(err=> box.innerHTML=`<div class="explain">${esc(AI.friendlyError(err))}</div>`);
  }
  function renderReciteThread(thread, history) {
    thread.innerHTML = "";
    history.forEach((m,i)=>{ if(i===0)return;
      const b=el("div","bubble "+(m.role==="assistant"?"ai":"me")); b.innerHTML=esc(m.content); thread.appendChild(b); });
    const row=el("div","ask-row");
    row.innerHTML=`<input id="rc-in" placeholder="复述你记住的内容，或说『继续』"><button class="btn" id="rc-send">答</button>`;
    thread.appendChild(row);
    const send=async()=>{ const v=$("#rc-in").value.trim(); if(!v)return;
      history.push({role:"user",content:v}); renderReciteThread(thread,history);
      const t=el("div","bubble ai ai-thinking"); t.textContent="…"; thread.insertBefore(t,thread.querySelector(".ask-row"));
      try{ const r=await AIFeat.reciteContinue(history); history.push({role:"assistant",content:r}); renderReciteThread(thread,history);}
      catch(err){ t.classList.remove("ai-thinking"); t.textContent=AI.friendlyError(err);} };
    $("#rc-send").addEventListener("click",send);
    $("#rc-in").addEventListener("keydown",e=>{if(e.key==="Enter")send();});
  }
  function genQuestions(topic, isYati) {
    const box = $("#rc-box");
    if (!AI.ready()) { box.innerHTML = `<div class="explain">${esc(AI.friendlyError(new Error("NO_KEY")))}</div>`; return; }
    box.innerHTML = `<div class="explain ai-thinking">AI 正在${isYati?'押题':'出题'}…</div>`;
    AIFeat.generate(topic, 5).then(arr=>{
      // 给生成题一个唯一 id 前缀，避免和题库冲突
      arr.forEach((q,i)=>{ q.id = (isYati?"yati-":"gen-")+Date.now()+"-"+i; q.type="single"; if(isYati) q.yati=true; });
      box.innerHTML = `<p>AI ${isYati?'押了':'出了'} ${arr.length} 道题。</p>`;
      box.innerHTML += `
        <div class="action-row">
          <button class="btn" id="gen-do">现在就做</button>
          <button class="btn ghost" id="gen-save">存入题库（本次会话）</button>
        </div>`;
      $("#gen-do").addEventListener("click",()=>{
        arr.forEach(q=>{ if(!QUESTION_BANK.find(x=>x.id===q.id)) QUESTION_BANK.push(q); });
        runQuiz({title:"AI 出的题",ids:arr.map(q=>q.id),mode:"wrong"});
      });
      $("#gen-save").addEventListener("click",()=>{
        arr.forEach(q=>{ if(!QUESTION_BANK.find(x=>x.id===q.id)) QUESTION_BANK.push(q); });
        alert("已加入本次会话的题库。想永久保存，请把这些题复制进 js/questions.js 文件。");
      });
    }).catch(err=> box.innerHTML=`<div class="explain">${esc(AI.friendlyError(err))}</div>`);
  }

  // ============================================================
  // 设置
  // ============================================================
  function renderSettings() {
    const s = Store.get();
    mount.innerHTML = "";
    const c = el("div","card");
    c.innerHTML = `
      <h1>设置</h1>
      <div class="field"><label>API Key</label>
        <input id="set-key" type="password" placeholder="sk-..." value="${esc(s.apiKey)}">
        <div class="hint">官方在 console.anthropic.com 获取；用第三方中转站(如 B.AI)则填它给你的 key。存本地浏览器，不上传。</div></div>
      <div class="row">
        <div class="field"><label>API 地址（Base URL）</label>
          <input id="set-base" placeholder="https://api.anthropic.com" value="${esc(s.apiBaseUrl)}">
          <div class="hint">官方留默认；中转站填它的接口根地址（如 https://xxx.com，末尾不用加 /v1/messages）</div></div>
        <div class="field"><label>接口格式</label>
          <select id="set-format">
            <option value="anthropic" ${s.apiFormat==="anthropic"?'selected':''}>Claude 原生 (/v1/messages)</option>
            <option value="openai" ${s.apiFormat==="openai"?'selected':''}>OpenAI 兼容 (/v1/chat/completions)</option>
          </select>
          <div class="hint">看中转站文档：写 messages 就选原生，写 chat/completions 或"OpenAI格式"就选后者</div></div>
      </div>
      <div class="field">
        <button class="btn subtle" id="set-test">🔌 测试连接</button>
        <button class="btn subtle" id="set-diag">🩺 自动排查（试各种模型名）</button>
        <div id="set-test-r" class="small mt"></div>
      </div>
      <div class="row">
        <div class="field"><label>讲解用模型（快/省）</label>
          <input id="set-fast" value="${esc(s.modelFast)}"><div class="hint">默认 Haiku 档</div></div>
        <div class="field"><label>批改/诊断模型（强）</label>
          <input id="set-strong" value="${esc(s.modelStrong)}"><div class="hint">默认 Sonnet 档</div></div>
      </div>
      <div class="row">
        <div class="field"><label>考试日期 EXAM_DATE</label>
          <input id="set-date" type="date" value="${esc(s.examDate)}"></div>
        <div class="field"><label>工作日时长</label>
          <select id="set-wd">
            <option value="15" ${s.minWeekday===15?'selected':''}>15 分钟（约12题）</option>
            <option value="25" ${s.minWeekday===25?'selected':''}>25 分钟（约22题）</option>
            <option value="40" ${s.minWeekday===40?'selected':''}>40 分钟（约35题）</option>
          </select></div>
        <div class="field"><label>周末时长</label>
          <select id="set-we">
            <option value="25" ${s.minWeekend===25?'selected':''}>25 分钟（约22题）</option>
            <option value="40" ${s.minWeekend===40?'selected':''}>40 分钟（约35题）</option>
            <option value="60" ${s.minWeekend===60?'selected':''}>60 分钟（约50题）</option>
          </select></div>
      </div>
      <div class="field"><label>当前学习阶段（可手动切换）</label>
        <select id="set-phase">
          <option value="1" ${s.phase===1?'selected':''}>阶段1 · 打地基</option>
          <option value="2" ${s.phase===2?'selected':''}>阶段2 · 全面铺开</option>
          <option value="3" ${s.phase===3?'selected':''}>阶段3 · 刷卷冲刺</option>
        </select></div>
      <button class="btn" id="set-save">保存设置</button>

      <h3 class="mt">存档管理</h3>
      <div class="action-row">
        <button class="btn subtle" id="set-export">⬇️ 导出存档</button>
        <button class="btn subtle" id="set-import">⬆️ 导入存档</button>
        <input type="file" id="set-file" accept="application/json" class="hidden">
      </div>
      <h3 class="mt">主观题作答历史（${s.subjectiveHistory.length}）</h3>
      <div id="set-subj"></div>

      <h3 class="mt" style="color:var(--bad)">危险操作</h3>
      <button class="btn ghost" id="set-redo">重做摸底测试</button>
      <button class="btn ghost" id="set-reset" style="color:var(--bad);border-color:var(--bad)">清空所有数据</button>
    `;
    mount.appendChild(c);

    $("#set-save").addEventListener("click", ()=>{
      Store.set({
        apiKey:$("#set-key").value.trim(),
        apiBaseUrl:$("#set-base").value.trim() || "https://api.anthropic.com",
        apiFormat:$("#set-format").value,
        modelFast:$("#set-fast").value.trim(),
        modelStrong:$("#set-strong").value.trim(), examDate:$("#set-date").value,
        minWeekday:parseInt($("#set-wd").value,10), minWeekend:parseInt($("#set-we").value,10),
        phase:parseInt($("#set-phase").value,10)
      });
      updatePhaseBadge();
      flash("已保存 ✅");
    });
    $("#set-test").addEventListener("click", async ()=>{
      // 先把当前填写的值存下来，再用它测试
      Store.set({
        apiKey:$("#set-key").value.trim(),
        apiBaseUrl:$("#set-base").value.trim() || "https://api.anthropic.com",
        apiFormat:$("#set-format").value,
        modelFast:$("#set-fast").value.trim(), modelStrong:$("#set-strong").value.trim()
      });
      const r = $("#set-test-r");
      if (!AI.ready()) { r.style.color="var(--bad)"; r.textContent="请先填 API Key"; return; }
      // 防呆：选了 OpenAI 兼容格式，却把地址留成 Anthropic 官方 → 十有八九是中转站地址没改
      const s2 = Store.get();
      if (s2.apiFormat === "openai" && /anthropic\.com/.test(s2.apiBaseUrl)) {
        r.style.color="var(--bad)";
        r.innerHTML = "❌ 地址不对：你选了「OpenAI 兼容」，但 API 地址还是 Anthropic 官方。用中转站(如 B.AI)请把「API 地址」改成它的地址，比如 <strong>https://api.b.ai</strong>";
        return;
      }
      r.style.color="var(--muted)"; r.textContent="正在测试…";
      try {
        const reply = await AI.chat([{role:"user",content:"回复两个字：可以"}], {maxTokens:20, timeout:20000});
        r.style.color="var(--ok)"; r.textContent="✅ 连接成功！模型回复：" + reply.slice(0,20);
      } catch (err) {
        r.style.color="var(--bad)"; r.textContent="❌ " + AI.friendlyError(err);
      }
    });
    // 🩺 自动排查：把常见的模型名/接口格式挨个试一遍，直接告诉你哪个能用
    $("#set-diag").addEventListener("click", async ()=>{
      Store.set({
        apiKey:$("#set-key").value.trim(),
        apiBaseUrl:$("#set-base").value.trim() || "https://api.anthropic.com",
        apiFormat:$("#set-format").value
      });
      const r = $("#set-test-r");
      if (!AI.ready()) { r.style.color="var(--bad)"; r.textContent="请先填 API Key"; return; }
      const base = Store.get().apiBaseUrl;
      // 候选：模型名 × 接口格式
      const models = ["claude-sonnet-5","claude-haiku-4.5","claude-sonnet-4.5",
                      "claude-haiku-4-5-20251001","claude-3-5-sonnet-20241022","gpt-5.2"];
      const formats = [$("#set-format").value, $("#set-format").value === "openai" ? "anthropic" : "openai"];
      r.style.color="var(--muted)";
      r.innerHTML = `正在逐个尝试（共 ${models.length*formats.length} 种组合），请稍候…`;
      const okList = [];
      const lines = [];
      for (const fmt of formats) {
        for (const m of models) {
          Store.set({ apiFormat: fmt });
          try {
            await AI.chat([{role:"user",content:"回复：ok"}], {model:m, maxTokens:10, timeout:15000});
            okList.push({m, fmt});
            lines.push(`✅ <strong>${esc(m)}</strong>（${fmt==="openai"?"OpenAI兼容":"Claude原生"}）可用`);
          } catch (e) {
            const short = String(e.message||"").replace(/（当前模型.*$/,"").slice(0,60);
            lines.push(`❌ ${esc(m)}（${fmt==="openai"?"OpenAI兼容":"Claude原生"}）：${esc(short)}`);
          }
        }
        if (okList.length) break; // 第一种格式就有可用的，不必再试另一种
      }
      if (okList.length) {
        const best = okList[0];
        const fast = okList.find(x=>/haiku/i.test(x.m)) || best;
        Store.set({ apiFormat: best.fmt, modelStrong: best.m, modelFast: fast.m });
        $("#set-format").value = best.fmt;
        $("#set-fast").value = fast.m;
        $("#set-strong").value = best.m;
        r.style.color="var(--ok)";
        r.innerHTML = `🎉 找到可用配置，已自动帮你填好并保存：<br>接口格式＝<strong>${best.fmt==="openai"?"OpenAI兼容":"Claude原生"}</strong>，讲解模型＝<strong>${esc(fast.m)}</strong>，批改模型＝<strong>${esc(best.m)}</strong><br><details class="mt"><summary class="small">查看全部尝试结果</summary><div class="small">${lines.join("<br>")}</div></details>`;
      } else {
        Store.set({ apiFormat: formats[0] });
        r.style.color="var(--bad)";
        r.innerHTML = `没有一种组合能用。多半是 <strong>API Key 或 API 地址</strong> 的问题（不是模型名）。请核对 key 是否复制完整、地址是否为中转站给的地址。<details class="mt" open><summary class="small">详细报错</summary><div class="small">${lines.join("<br>")}</div></details>`;
      }
    });
    $("#set-export").addEventListener("click", ()=>Store.exportFile());
    $("#set-import").addEventListener("click", ()=>$("#set-file").click());
    $("#set-file").addEventListener("change", e=>{
      const f=e.target.files[0]; if(!f)return;
      Store.importFile(f,(ok)=>{ if(ok){flash("导入成功 ✅");go("dashboard");} else flash("导入失败：文件格式不对"); });
    });
    $("#set-redo").addEventListener("click", ()=>{ if(confirm("重做摸底测试？会重新生成计划，刷题进度保留。")){ Store.set({placementDone:false}); renderPlacement(); }});
    $("#set-reset").addEventListener("click", ()=>{ if(confirm("确定清空全部数据？错题、进度、打卡都会没。此操作不可恢复！")){ Store.reset(); location.reload(); }});

    // 主观题历史
    const sb = $("#set-subj");
    if (!s.subjectiveHistory.length) sb.innerHTML = `<p class="small muted">还没有主观题作答记录。</p>`;
    else s.subjectiveHistory.slice(0,20).forEach(h=>{
      const d=el("details");
      d.innerHTML=`<summary>${esc(h.stem.slice(0,40))}… <span class="small muted">(${h.date})</span></summary>
        <p class="small"><strong>我的答案：</strong>${esc(h.myAnswer||"（空）")}</p>
        <p class="small" style="white-space:pre-wrap"><strong>AI 批改：</strong>${esc(h.aiResult)}</p>`;
      sb.appendChild(d);
    });
  }

  function flash(msg){
    const f=el("div","",msg);
    f.style.cssText="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:10px 20px;border-radius:20px;z-index:99;box-shadow:var(--shadow)";
    document.body.appendChild(f); setTimeout(()=>f.remove(),1600);
  }

  function updatePhaseBadge(){
    const s=Store.get();
    phaseBadge.textContent = s.placementDone ? `阶段${s.phase}·${["打地基","全面铺开","刷卷冲刺"][s.phase-1]}` : "未摸底";
  }

  // ============================================================
  // 初始化
  // ============================================================
  function init() {
    mount = $("#app");
    navWrap = $("#nav");
    phaseBadge = $("#phase-badge");

    // 主题切换
    $("#theme-btn").addEventListener("click", ()=>{
      const root=document.documentElement;
      const cur=root.getAttribute("data-theme");
      const next = cur==="dark"?"light":(cur==="light"?"dark":(matchMedia("(prefers-color-scheme: dark)").matches?"light":"dark"));
      root.setAttribute("data-theme",next);
      localStorage.setItem("zz_theme",next);
    });
    const savedTheme=localStorage.getItem("zz_theme");
    if(savedTheme) document.documentElement.setAttribute("data-theme",savedTheme);

    navWrap.addEventListener("click", e=>{
      const b=e.target.closest("button[data-view]"); if(b) go(b.dataset.view);
    });

    // 学习时长心跳：每 30 秒，若正在答题/背诵且页面可见，累加 30 秒
    setInterval(() => {
      if (_active && document.visibilityState !== "hidden") Study.addSeconds(30);
    }, 30000);

    updatePhaseBadge();
    const s=Store.get();
    if (!s.placementDone) renderOnboarding();
    else go("dashboard");
  }

  return { init, go };
})();

document.addEventListener("DOMContentLoaded", App.init);
