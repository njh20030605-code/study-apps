/* ===== app.js 主逻辑：路由 / 页面 / AI 功能 / 今日清单 / 计时 ===== */
(function (w) {
  'use strict';
  const U = w.U, DB = w.DB, AI = w.AI, SRS = w.SRS;
  const { $, $$, el, tex, esc } = U;
  const view = () => document.getElementById('view');

  // ---------- 运行时会话 ----------
  let session = null; // {list:[q], idx, title, onDone, results:[]}

  // =========================================================
  //  路由
  // =========================================================
  const Router = {
    cur: 'home',
    go(route, params) {
      this.cur = route; this.params = params || {};
      window.scrollTo(0, 0);
      $$('#mainnav button').forEach(b => b.classList.toggle('active', b.dataset.route === route));
      const fn = Views[route];
      if (fn) fn(this.params); else Views.home();
    }
  };
  w.Router = Router;

  // =========================================================
  //  首页 / 仪表盘 + 今日清单
  // =========================================================
  const Views = {};

  Views.home = function () {
    const s = DB.settings();
    const v = view(); v.innerHTML = '';

    // 第一次：先摸底测水平，再给 60 分最省时路线
    if (!s.placementDone) {
      v.appendChild(el('div', { class: 'card hero' }, [
        el('div', { class: 'hero-emoji', text: '📋' }),
        el('h1', { class: 'hero-title', text: '先花几分钟，摸个底' }),
        el('p', { class: 'hero-sub', html: '我出十几道题（从最简单到难），看看你现在在哪儿，<br>再给你定一条 <b>最省时间、稳拿 60 分</b> 的路线。<br><span class="small">做不出来很正常，只是找起点，不计分。</span>' }),
        el('button', { class: 'btn big', onclick: () => Router.go('placement') }, ['📋 开始摸底测水平']),
        el('div', { style: 'margin-top:12px' }, [el('button', { class: 'btn ghost sm', onclick: () => { DB.set('stage', '零基础启蒙期'); DB.set('placementDone', true); Router.go('lessons'); } }, ['我就是纯小白，直接从第 1 课学'])])
      ]));
      return;
    }

    const plan = ensureTodayPlan();
    const total = plan.items.length;
    const doneCount = plan.items.filter(i => i.done).length;
    const remaining = total - doneCount;

    const hero = el('div', { class: 'card hero' });
    if (remaining === 0) {
      // 今天做完了
      hero.appendChild(el('div', { class: 'hero-emoji', text: '🎉' }));
      hero.appendChild(el('h1', { class: 'hero-title', text: '今天学完啦！' }));
      hero.appendChild(el('p', { class: 'hero-sub', text: '今天学了约 ' + U.fmtMin(DB.todayMinutes()) + '，连续打卡 ' + DB.streak() + ' 天。歇会儿，或再来一轮。' }));
      hero.appendChild(el('button', { class: 'btn big', onclick: () => replanAndBegin() }, ['🔁 再学一轮']));
      hero.appendChild(el('div', { style: 'margin-top:12px' }, [el('button', { class: 'btn ghost sm', onclick: () => Router.go('progress') }, ['看看我的进度'])]));
    } else {
      const curCh = SRS.CHAPTERS[SRS.currentChapterIndex()];
      hero.appendChild(el('div', { class: 'hero-eyebrow', text: greeting() + ' · 今天约 ' + plan.minutesTarget + ' 分钟' }));
      hero.appendChild(el('h1', { class: 'hero-title', text: '跟着学就行' }));
      hero.appendChild(el('p', { class: 'hero-sub', html: '今天主攻 <b>' + esc(curCh.name.replace(/^第.章 · /, '')) + ' · ' + esc(topicLabel(plan.learnTopic)) + '</b>' }));
      const steps = el('div', { class: 'today-steps' });
      plan.items.forEach(it => steps.appendChild(el('span', { class: 'step-chip' + (it.done ? ' done' : ''), text: (it.done ? '✓ ' : '') + it.title })));
      hero.appendChild(steps);
      hero.appendChild(el('button', { class: 'btn big', onclick: () => beginToday() }, [doneCount > 0 ? '▶ 继续今日学习（' + doneCount + '/' + total + '）' : '▶ 开始今日学习']));
    }
    v.appendChild(hero);

    // 极简状态条（一行小字，不占地方）
    const days = Math.max(0, U.daysBetween(U.todayStr(), s.examDate));
    v.appendChild(el('div', { class: 'status-strip' }, [
      el('span', { html: '📅 距考试 <b>' + days + '</b> 天' }),
      el('span', { html: '🔥 连打 <b>' + DB.streak() + '</b> 天' }),
      el('span', { html: '⏱️ 今日 <b>' + U.fmtMin(DB.todayMinutes()) + '</b>' }),
      el('span', { html: '📈 进度 <b>' + SRS.overallProgress() + '%</b>' })
    ]));

    // 备份提醒：有进度且好几天没备份 → 提示一键导出（防丢）
    if (DB.hasProgress() && DB.daysSinceBackup() >= 3) {
      const bak = el('div', { class: 'notice warn', style: 'display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap' }, [
        el('span', { html: '💾 有阵子没备份了，导出一份存到硬盘，换电脑/清缓存也不怕丢。' }),
        el('button', { class: 'btn sm', onclick: () => { exportSave(); } }, ['一键备份'])
      ]);
      v.appendChild(bak);
    }

    // 次要入口：一行小链接（不再是大卡片）
    v.appendChild(el('div', { class: 'quick-links' }, [
      linkChip('🗺️ 学习地图', () => Router.go('progress')),
      linkChip('📘 从零扫盲', () => Router.go('lessons')),
      linkChip('📕 只做错题', () => { const ids = DB.raw().wrongIds; if (!ids.length) return alert('还没有错题，继续加油～'); startSession(SRS.pickQuestions(q => ids.includes(q.id), 999), '只刷错题'); }),
      linkChip('🔢 背公式', () => Router.go('formulas'))
    ]));
  };

  function greeting() {
    return '接着来'; // 无实时钟，保持稳定问候
  }
  function linkChip(text, fn) { return el('button', { class: 'link-chip', onclick: fn }, [text]); }

  function stat(num, lbl) {
    return el('div', { class: 'stat' }, [el('div', { class: 'num', text: String(num) }), el('div', { class: 'lbl', text: lbl })]);
  }

  // =========================================================
  //  一键闯关：今日学习自动串起来，一步步走完
  // =========================================================
  let Guided = null; // {steps:[item], idx}

  function beginToday() {
    const plan = ensureTodayPlan();
    const steps = plan.items.filter(i => !i.done);
    if (!steps.length) return finishToday();
    Guided = { steps, idx: 0 };
    launchGuidedStep();
  }
  function replanAndBegin() {
    DB.setTodayPlan(null);          // 重排今天
    ensureTodayPlan();
    beginToday();
  }
  function launchGuidedStep() {
    if (!Guided) return;
    if (Guided.idx >= Guided.steps.length) { Guided = null; return finishToday(); }
    const it = Guided.steps[Guided.idx];
    runPlanItem(it, {
      guided: true,
      onComplete: () => { markPlanDone(it.key); Guided.idx++; guidedBetween(); }
    });
  }
  function guidedBetween() {
    if (!Guided) return;
    const prev = Guided.steps[Guided.idx - 1];
    const next = Guided.steps[Guided.idx];
    if (!next) { Guided = null; return finishToday(); }
    const v = view(); v.innerHTML = '';
    const pct = Math.round(Guided.idx / Guided.steps.length * 100);
    v.appendChild(el('div', { class: 'topbar-progress' }, [el('span', { style: 'width:' + pct + '%' })]));
    v.appendChild(el('div', { class: 'card center' }, [
      el('div', { class: 'hero-emoji', text: '✅' }),
      el('h2', { text: '完成：' + prev.title }),
      el('p', { class: 'muted', html: '下一步：<b>' + esc(next.title) + '</b><br><span class="small">' + esc(next.sub) + '</span>' }),
      el('div', { class: 'btn-row', style: 'justify-content:center' }, [
        el('button', { class: 'btn big', onclick: () => launchGuidedStep() }, ['继续 →']),
        el('button', { class: 'btn ghost sm', onclick: () => { Guided = null; Router.go('home'); } }, ['先歇会儿'])
      ])
    ]));
  }
  function finishToday() {
    DB.checkin();
    const v = view(); v.innerHTML = '';
    v.appendChild(el('div', { class: 'card center' }, [
      el('div', { class: 'hero-emoji', text: '🎉' }),
      el('h1', { class: 'hero-title', text: '今天的学习完成啦！' }),
      el('p', { class: 'hero-sub', text: '今天学了约 ' + U.fmtMin(DB.todayMinutes()) + '，连续打卡 ' + DB.streak() + ' 天。明天见！' }),
      el('div', { class: 'btn-row', style: 'justify-content:center' }, [
        el('button', { class: 'btn', onclick: () => Router.go('home') }, ['回首页']),
        el('button', { class: 'btn ghost', onclick: () => Router.go('progress') }, ['看看进度'])
      ])
    ]));
  }

  // 供「进度」页复用的章节地图卡
  function chapterMapCard() {
    const chSt = SRS.chapterStatus();
    const curIdx = SRS.currentChapterIndex();
    const curCh = chSt[curIdx], nextCh = chSt[curIdx + 1];
    const card = el('div', { class: 'card' }, [
      el('div', { style: 'display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px' }, [
        el('h2', { text: '🗺️ 学习地图', style: 'margin:0' }),
        el('span', { class: 'pill', text: chSt.filter(c => c.mastered).length + '/' + chSt.length + ' 章掌握' })
      ]),
      el('div', { class: 'notice info', html: '按顺序闯关：<b>过一章才解锁下一章</b>。当前：<b>' + esc(curCh.name) + '</b>' + (nextCh ? '　→　下一章：' + esc(nextCh.name) : '　（已到最后一章）') })
    ]);
    const floor = SRS.stageFloorIndex();
    chSt.forEach((c, i) => {
      const locked = i > curIdx;                       // 当前章之后 → 上锁
      const belowFloor = i < floor && !c.mastered;      // 摸底测出你在这之上，这几章可跳过
      const state = c.mastered ? '已掌握' : belowFloor ? '摸底已过·可选' : (i === curIdx ? '进行中' : (i < curIdx ? '待巩固' : '未解锁'));
      const dot = locked ? '🔒' : (c.mastered ? '✅' : belowFloor ? '⏭️' : (i === curIdx ? '📍' : (c.started ? '◔' : '○')));
      const sub = locked
        ? '先通关上一章才解锁'
        : belowFloor ? '摸底显示你已过这一层，可直接跳过（想补也能点进去）'
        : state + '　·　' + (c.mastered ? '本章已通关 ✓' : c.total ? '做对 ' + c.okEver + '/' + c.total + '（做对 60% 即通关）' : '暂无题');
      const row = el('div', {
        class: 'task' + (c.mastered ? ' done' : '') + (locked ? ' locked' : ''),
        style: i === curIdx ? 'border-color:var(--brand)' : ''
      }, [
        el('div', { class: 'chk', style: 'background:none;border:none;font-size:20px', text: dot }),
        el('div', { class: 't-main' }, [
          el('div', { class: 't-title', text: c.name }),
          el('div', { class: 't-sub', text: sub })
        ]),
        locked ? el('span', { class: 'small muted', text: '🔒' }) : el('button', { class: 'btn sm soft', text: c.mastered ? '复习' : '去学' })
      ]);
      if (locked) {
        row.addEventListener('click', () => alert('这一章还锁着～先把「' + curCh.name + '」通关（做对本章 60% 的题），就自动解锁下一章。'));
      } else {
        row.addEventListener('click', () => {
          if (c.key === 'literacy') return Router.go('lessons');
          Views.learn({ topic: SRS.leastPracticedTopicInModule(c.module) || c.name });
        });
      }
      card.appendChild(row);
    });
    return card;
  }

  // =========================================================
  //  今日计划：按时长配量
  // =========================================================
  function ensureTodayPlan() {
    const today = U.todayStr();
    let plan = DB.todayPlan();
    if (plan && plan.date === today) return plan;

    const mins = DB.get('dailyMinutes');
    const qn = mins <= 20 ? 4 : mins <= 40 ? 7 : 11;   // 做题量
    const fn = mins <= 20 ? 4 : mins <= 40 ? 8 : 12;   // 公式量
    const wn = mins <= 20 ? 2 : mins <= 40 ? 4 : 6;    // 弱点专练量

    // 主线：按大纲顺序，主攻"当前章"里练得最少的知识点
    const curCh = SRS.CHAPTERS[SRS.currentChapterIndex()];
    const learnTopic = SRS.leastPracticedTopicInModule(curCh.module) || SRS.leastPracticedTopic() || pickTopicForStage();
    const weak = SRS.weakestTopics(1)[0];
    // 越重要的知识点，今天多排几道题，确保学会
    const wt = SRS.topicWeight(learnTopic);
    const qnAdj = qn + (wt >= 3 ? 4 : wt === 2 ? 2 : 0);
    const impTag = wt >= 3 ? '　⭐核心必考' : wt === 2 ? '　·重要' : '';

    const items = [
      { key: 'concept', title: '📖 学概念', sub: '主攻：' + topicLabel(learnTopic) + impTag, done: false, arg: learnTopic },
      { key: 'practice', title: '✍️ 做题', sub: topicLabel(learnTopic) + ' · ' + qnAdj + ' 题（先易后难）' + impTag, done: false, arg: learnTopic, n: qnAdj }
    ];
    // 背公式：只在"本章真有相关公式要背"时才排（别做字母题却背导数公式）
    const fGroup = SRS.formulaGroupForModule(curCh.module);
    if (fGroup) items.push({ key: 'formula', title: '🔢 背公式', sub: fGroup + '公式 · 约 ' + fn + ' 张', done: false, n: fn, module: curCh.module });
    // 弱点专练：只在真有弱点数据时排（否则这一项对新手就是重复做题）
    if (weak && weak.topic) items.push({ key: 'weak', title: '🎯 弱点专练', sub: topicLabel(weak.topic) + '（通关率最低）· ' + wn + ' 题', done: false, arg: weak.topic, n: wn });
    // 解答题：只在本阶段有合适难度的解答题时排
    const maxLv = Math.max.apply(null, stageLevels());
    if ((w.QUESTIONS || []).some(q => q.type === 'solve' && q.level <= maxLv && !SRS.isSkipTopic(q.topic))) items.push({ key: 'solve', title: '🧮 一道解答题', sub: '完整做一道 / 对照分步解答', done: false });

    plan = { date: today, minutesTarget: mins, learnTopic, module: curCh.module, items };
    DB.setTodayPlan(plan);
    return plan;
  }
  function markPlanDone(key) {
    const plan = DB.todayPlan(); if (!plan) return;
    const it = plan.items.find(i => i.key === key); if (it) { it.done = true; DB.setTodayPlan(plan); }
    // 完成关键项即打卡
    if (['practice', 'formula', 'weak', 'solve'].includes(key)) DB.checkin();
  }
  function pickTopicForStage() {
    const stage = DB.get('stage');
    if (stage === '冲刺期') return '真题综合';
    if (stage === '基础攻坚期') return '导数计算';
    if (stage === '预备夯实期') return '函数基础';
    return '用字母表示数';  // 零基础启蒙期
  }
  function topicLabel(t) { return t || '综合'; }

  function runPlanItem(it, opts) {
    opts = opts || {};
    const guided = !!opts.guided;
    const onDone = opts.onComplete || (() => markPlanDone(it.key));

    if (it.key === 'concept') return guidedConcept(it, onDone);
    if (it.key === 'formula') return startFormulaSession(it.n, onDone, false, guided, it.module);
    if (it.key === 'solve') {
      // 按阶段兜底：只出不超过本阶段难度的解答题，绝不给零基础的人扔真题证明
      const maxLv = Math.max.apply(null, stageLevels());
      let list = SRS.pickQuestions(q => q.type === 'solve' && q.level <= maxLv && !SRS.isSkipTopic(q.topic), 1);
      if (!list.length) {
        const lv = stageLevels();
        list = SRS.pickQuestions(q => lv.includes(q.level) && q.steps && q.steps.length, 1);
        if (!list.length) { onDone(); return; }   // 本阶段暂无合适解答题：跳过（引导流程会自动进下一步）
      }
      return startSession(list, '今日解答题', onDone, guided);
    }
    // practice / weak
    let list;
    if (it.key === 'weak' && it.arg) list = SRS.pickQuestions(q => q.topic === it.arg, it.n);
    else if (it.arg && it.arg !== '真题综合' && it.arg !== '函数基础' && it.arg !== '导数计算')
      list = SRS.pickQuestions(q => q.topic === it.arg, it.n);
    else list = byStageQuestions(it.n);
    if (!list.length) list = SRS.pickQuestions(() => true, it.n);
    list.sort((a, b) => a.level - b.level);   // 先易后难
    startSession(list, it.title.replace(/^[^ ]+ /, ''), onDone, guided);
  }

  // 引导流程里的"学概念"：把概念/扫盲内容内联展示，读完点"继续"
  function guidedConcept(it, onDone) {
    const topic = it.arg;
    const v = view(); v.innerHTML = '';
    const card = el('div', { class: 'card' });
    card.appendChild(el('h2', { text: '📖 先学概念：' + topicLabel(topic) }));
    const filled = renderConceptInto(card, topic);
    if (!filled) card.appendChild(el('p', { class: 'muted', text: '这个知识点先直接上手做题感受一下，不懂随时回来问 AI。' }));
    card.appendChild(el('div', { class: 'btn-row', style: 'margin-top:16px' }, [
      el('button', { class: 'btn big', onclick: () => onDone() }, ['看完了，去做题 →'])
    ]));
    v.appendChild(card);
    window.scrollTo(0, 0);
  }
  // 把 topic 对应的扫盲读本正文 / 白话概念卡渲染进容器；返回是否有内容
  function renderConceptInto(container, topic) {
    let has = false;
    const lesson = (w.LESSONS || []).find(l => l.topic === topic);
    if (lesson) {
      has = true;
      (lesson.body || []).forEach(b => {
        if (b.h) container.appendChild(el('div', { style: 'font-weight:600;margin:10px 0 4px', text: b.h }));
        else if (b.p) container.appendChild(el('p', { style: 'font-size:18px;line-height:1.9', html: tex(b.p) }));
        else if (b.eg) container.appendChild(el('div', { class: 'notice info', html: '举例：' + tex(b.eg) }));
        else if (b.tip) container.appendChild(el('div', { class: 'notice warn', html: '💡 ' + tex(b.tip) }));
      });
    }
    const concept = (w.CONCEPTS || {})[topic];
    if (concept) {
      has = true;
      container.appendChild(el('div', { class: 'card', style: 'background:var(--brand-soft);margin:8px 0' },
        [el('h3', { text: '📝 ' + concept.title, style: 'margin-top:0' })].concat(
          (concept.body || []).map(b => {
            if (b.h) return el('div', { style: 'font-weight:600;margin:10px 0 4px', text: b.h });
            if (b.p) return el('p', { style: 'font-size:18px;line-height:1.9', html: tex(b.p) });
            if (b.eg) return el('div', { class: 'notice info', html: '举例：' + tex(b.eg) });
            if (b.tip) return el('div', { class: 'notice warn', html: '💡 ' + tex(b.tip) });
            return null;
          }).filter(Boolean))));
    }
    // 附一道带步骤的例题
    const eg = (w.QUESTIONS || []).find(q => q.topic === topic && q.steps && q.steps.length);
    if (eg) {
      has = true;
      container.appendChild(el('h3', { text: '看个例子（分步）' }));
      container.appendChild(el('div', { class: 'stem', html: tex(eg.stem) }));
      const box = el('div', { class: 'steps' });
      (eg.steps || []).forEach(sp => box.appendChild(el('div', { class: 'step', html: tex(sp) })));
      container.appendChild(box);
    }
    return has;
  }
  function stageLevels() {
    const stage = DB.get('stage');
    if (stage === '零基础启蒙期') return [0, 1];
    if (stage === '基础攻坚期') return [2, 3];
    if (stage === '冲刺期') return [3, 4];
    return [1, 2]; // 预备夯实期
  }
  function byStageQuestions(n) {
    const lv = stageLevels();
    return SRS.pickQuestions(q => lv.includes(q.level), n);
  }

  // =========================================================
  //  练习页
  // =========================================================
  Views.practice = function () {
    const v = view(); v.innerHTML = '';
    const c = el('div', { class: 'card' }, [el('h2', { text: '✍️ 练习' }), el('p', { class: 'muted', text: '按难度或知识点专练，一次约 20 题，做过的排后面。' })]);

    c.appendChild(el('h3', { text: '按难度' }));
    const seg1 = el('div', { class: 'seg' });
    [[0, '启蒙'], [1, '预备'], [2, '基础'], [3, '提升'], [4, '冲刺(真题)']].forEach(([lv, name]) => {
      const cnt = (w.QUESTIONS || []).filter(q => q.level === lv).length;
      seg1.appendChild(el('button', { onclick: () => startByFilter(q => q.level === lv, name + '练习', 20) }, [name + ' (' + cnt + ')']));
    });
    c.appendChild(seg1);

    c.appendChild(el('h3', { text: '按知识点' }));
    const seg2 = el('div', { class: 'seg' });
    Object.entries(SRS.MODULE_NAMES).forEach(([m, name]) => {
      const cnt = (w.QUESTIONS || []).filter(q => q.module === m).length;
      if (!cnt) return;
      seg2.appendChild(el('button', { onclick: () => startByFilter(q => q.module === m, name, 20) }, [name + ' (' + cnt + ')']));
    });
    c.appendChild(seg2);

    c.appendChild(el('hr'));
    c.appendChild(el('div', { class: 'btn-row' }, [
      el('button', { class: 'btn', onclick: () => startByFilter(() => true, '全部混合', 20) }, ['🎲 混合练习 20 题']),
      el('button', { class: 'btn ghost', onclick: () => aiGenerateFlow() }, ['🤖 让 AI 按薄弱点出题'])
    ]));
    v.appendChild(c);
  };
  function startByFilter(fn, title, n) {
    const list = SRS.pickQuestions(fn, n);
    if (!list.length) return alert('这个分类还没有题目，稍后补充～');
    startSession(list, title);
  }

  // =========================================================
  //  答题会话 & 题目渲染
  // =========================================================
  function startSession(list, title, onDone, guided) {
    session = { list, idx: 0, title, onDone, results: [], guided: !!guided };
    Views.question();
  }
  Views.question = function () {
    if (!session || !session.list.length) return Router.go('home');
    const v = view(); v.innerHTML = '';
    const q = session.list[session.idx];
    const pct = Math.round(session.idx / session.list.length * 100);

    v.appendChild(el('div', { class: 'topbar-progress' }, [el('span', { style: 'width:' + pct + '%' })]));
    v.appendChild(el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px' }, [
      el('span', { class: 'muted small', text: session.title + ' · 第 ' + (session.idx + 1) + '/' + session.list.length + ' 题' }),
      el('button', { class: 'btn sm ghost', onclick: () => endSession() }, ['结束'])
    ]));
    const card = el('div', { class: 'card qwrap' });
    renderQuestion(card, q);
    v.appendChild(card);
  };

  function levelTag(lv) { return el('span', { class: 'tag lv' + lv, text: SRS.LEVEL_NAMES[lv] }); }

  function renderQuestion(root, q, opts) {
    opts = opts || {};
    root.innerHTML = '';
    root.appendChild(el('div', { class: 'qmeta' }, [
      levelTag(q.level),
      el('span', { class: 'tag', text: SRS.MODULE_NAMES[q.module] || q.module }),
      q.topic ? el('span', { class: 'tag', text: q.topic }) : null,
      el('span', { class: 'tag', text: ({ choice: '选择题', fill: '填空题', solve: '解答题' })[q.type] }),
      (function () { const m = SRS.questionMode(q); return el('span', { class: 'tag ' + (m === '记忆' ? 'mode-mem' : 'mode-und'), title: m === '记忆' ? '关键是记住公式再套用' : '关键是想通思路', text: (m === '记忆' ? '📖 该背' : '🧠 该懂') }); })()
    ]));
    root.appendChild(el('div', { class: 'stem', html: tex(q.stem) }));

    let answered = false;
    const fb = el('div'); // feedback 容器

    if (q.type === 'choice') {
      const opts_ = el('div', { class: 'options' });
      (q.options || []).forEach((o, i) => {
        const optEl = el('div', { class: 'opt' }, [
          el('span', { class: 'k', text: 'ABCD'[i] + '.' }),
          el('span', { class: 'otext', html: tex(o) })
        ]);
        optEl.addEventListener('click', () => {
          if (answered) return; answered = true;
          const correct = i === q.answer;
          $$('.opt', opts_).forEach((x, j) => {
            x.classList.add('disabled');
            if (j === q.answer) x.classList.add('correct');
            if (j === i && !correct) x.classList.add('wrong');
          });
          if (!opts.noRecord) { DB.recordAnswer(q.id, correct); if (session && session.results) session.results.push({ id: q.id, correct }); }
          showFeedback(fb, q, correct, 'ABCD'[q.answer]);
        });
        opts_.appendChild(optEl);
      });
      root.appendChild(opts_);
    } else if (q.type === 'fill') {
      const input = el('input', { class: 'fill-input', placeholder: '输入答案（如 1/2、x^2、-e^y/(x+e^y)^2）' });
      const submit = el('button', { class: 'btn', style: 'margin-top:12px', text: '提交' });
      submit.addEventListener('click', () => {
        if (answered) return;
        const correct = U.checkFill(input.value, q.answer);
        answered = true; input.disabled = true; submit.disabled = true;
        if (!opts.noRecord) { DB.recordAnswer(q.id, correct); if (session && session.results) session.results.push({ id: q.id, correct }); }
        showFeedback(fb, q, correct, Array.isArray(q.answer) ? q.answer[0] : q.answer);
      });
      input.addEventListener('keydown', e => { if (e.key === 'Enter') submit.click(); });
      root.appendChild(input); root.appendChild(submit);
      // 拿不准就自评
      root.appendChild(el('div', { class: 'small muted', style: 'margin-top:8px', text: '判分做了宽松归一化；若你确信自己对但被判错，可对照参考答案自评。' }));
    } else { // solve
      const ta = el('textarea', { class: 'fill-input', rows: 5, placeholder: '先自己写出解题步骤（可选），再点"对照解答"或"AI 批改"。' });
      root.appendChild(ta);
      root.appendChild(el('div', { class: 'btn-row' }, [
        el('button', { class: 'btn', onclick: () => { if (!answered) { answered = true; if (!opts.noRecord) { DB.recordAnswer(q.id, true); if (session && session.results) session.results.push({ id: q.id, correct: true }); } } showSolve(fb, q); } }, ['对照分步解答']),
        AI.hasKey() ? el('button', { class: 'btn ghost', onclick: () => gradeSolve(fb, q, ta.value) }, ['🤖 AI 批改我的解法']) : null
      ]));
    }
    root.appendChild(fb);

    // 下一题
    if (!opts.noNav) {
      root.appendChild(el('div', { class: 'btn-row', style: 'margin-top:18px;border-top:1px solid var(--line);padding-top:16px' }, [
        el('button', { class: 'btn', onclick: () => nextQuestion() }, [session && session.idx < session.list.length - 1 ? '下一题 →' : '完成本轮 ✓'])
      ]));
    }
  }

  function showFeedback(fb, q, correct, ansLabel) {
    fb.innerHTML = '';
    fb.className = 'feedback';
    fb.appendChild(el('div', { class: 'verdict ' + (correct ? 'ok' : 'no'), text: correct ? '✅ 答对了！' : '❌ 答错了' }));
    fb.appendChild(el('div', { html: '<b>正确答案：</b>' + tex(String(ansLabel)) }));
    if (q.explanation) fb.appendChild(el('div', { style: 'margin-top:8px', html: '<b>思路：</b>' + tex(q.explanation) }));
    // 分步
    if (q.steps && q.steps.length) {
      const d = el('details', { open: !correct }); d.appendChild(el('summary', { text: '分步解题过程' }));
      const box = el('div', { class: 'steps' });
      q.steps.forEach(s => box.appendChild(el('div', { class: 'step', html: tex(s) })));
      d.appendChild(box); fb.appendChild(d);
    }
    // 选项逐项分析
    if (q.type === 'choice' && q.optionNotes && q.optionNotes.length) {
      const d = el('details'); d.appendChild(el('summary', { text: '四个选项逐项分析' }));
      q.optionNotes.forEach((n, i) => d.appendChild(el('div', { class: 'optnote', html: '<b>' + 'ABCD'[i] + '.</b> ' + tex(n) })));
      fb.appendChild(d);
    }
    // AI 按钮
    fb.appendChild(aiButtons(q));
  }
  function showSolve(fb, q) {
    fb.innerHTML = ''; fb.className = 'feedback';
    fb.appendChild(el('div', { class: 'verdict ok', text: '📝 参考分步解答' }));
    if (q.explanation) fb.appendChild(el('div', { style: 'margin-bottom:8px', html: '<b>思路：</b>' + tex(q.explanation) }));
    const box = el('div', { class: 'steps' });
    (q.steps || []).forEach(s => box.appendChild(el('div', { class: 'step', html: tex(s) })));
    fb.appendChild(box);
    fb.appendChild(aiButtons(q));
  }

  function aiButtons(q) {
    if (!AI.hasKey()) return el('div', { class: 'small muted', style: 'margin-top:10px', text: '（填了 API Key 后，这里会有「AI 再讲一遍」「换个说法再考我」）' });
    const row = el('div', { class: 'btn-row' }, [
      el('button', { class: 'btn soft sm', onclick: (e) => explainAgain(e.target, q) }, ['🤖 没懂？AI 再讲一遍']),
      el('button', { class: 'btn soft sm', onclick: (e) => reQuiz(e.target, q) }, ['🔁 换个说法再考我'])
    ]);
    return row;
  }

  function nextQuestion() {
    if (!session) return Router.go('home');
    if (session.idx < session.list.length - 1) { session.idx++; Views.question(); }
    else endSession();
  }
  function endSession() {
    const done = session && session.onDone;
    const guided = session && session.guided;
    const title = session ? session.title : '';
    const results = session ? session.results.slice() : [];
    session = null;
    if (done) done(results);
    if (guided) return; // 引导流程：onComplete 已渲染"下一步"，不再显示本轮小结
    // 小结
    const v = view(); v.innerHTML = '';
    v.appendChild(el('div', { class: 'card center' }, [
      el('h2', { text: '🎉 本轮完成：' + title }),
      el('p', { class: 'muted', text: '题目记录已存档，错题已进错题本。要不要看看今日小结？' }),
      el('div', { class: 'btn-row', style: 'justify-content:center' }, [
        el('button', { class: 'btn', onclick: () => Router.go('home') }, ['回今日']),
        AI.hasKey() ? el('button', { class: 'btn ghost', onclick: (e) => dailySummary(e.target) }, ['🤖 AI 今日小结']) : null
      ])
    ]));
  }

  // =========================================================
  //  AI 功能
  // =========================================================
  const PERSONA = '你是一位极有耐心的高等数学老师，学生只有初二数学水平、高数从零开始，正在备考"全国成人高考专升本·高等数学(二)"，目标 60 分（满分150）。' +
    '请务必用简单中文、短句、生活化比方讲解，不要堆术语。所有数学式子用 LaTeX，并用 $...$ 或 $$...$$ 包起来（这样能正确显示）。';

  function bubbleAdd(msgs, role, htmlOrText, isHtml) {
    const b = el('div', { class: 'bubble ' + (role === 'user' ? 'me' : 'ai') });
    if (isHtml) b.innerHTML = htmlOrText; else b.textContent = htmlOrText;
    msgs.appendChild(b); msgs.scrollTop = msgs.scrollHeight; return b;
  }
  function thinking(msgs) {
    const b = el('div', { class: 'bubble ai' }, [el('span', { class: 'thinking', html: '正在思考 <i></i><i></i><i></i>' })]);
    msgs.appendChild(b); msgs.scrollTop = msgs.scrollHeight; return b;
  }

  // 逐题讲到懂 + 可继续追问
  async function explainAgain(btn, q) {
    btn.disabled = true;
    const container = btn.closest('.feedback') || btn.parentElement;
    // 已有对话框则不重复建
    let boxWrap = container.querySelector('.ai-box.explain');
    if (boxWrap) { boxWrap.scrollIntoView({ behavior: 'smooth' }); btn.disabled = false; return; }

    const msgs = el('div', { class: 'ai-msgs' });
    const input = el('input', { placeholder: '还有哪里不懂？继续问我…' });
    const sendBtn = el('button', { class: 'btn sm', text: '问' });
    boxWrap = el('div', { class: 'ai-box explain' }, [
      el('div', { class: 'ai-head' }, [el('span', { text: '🤖 AI 讲解' }), el('span', { class: 'small', text: '清爽自习室' })]),
      msgs,
      el('div', { class: 'ai-input' }, [input, sendBtn])
    ]);
    container.appendChild(boxWrap);

    const history = [];
    const firstPrompt =
      '请给我讲这道题：\n' + qToText(q) + '\n\n' +
      '请按这个结构讲，用初中生能懂的话：\n' +
      '① 这题到底在考什么；\n② 一步一步怎么算（每步都说清为什么）；\n③ 背后 1 条要记住的公式/规则；\n④ 再给 1 个最简单的同类小例子；\n⑤ 结尾问我"这样清楚吗？"。';

    async function turn(userText, showUser) {
      if (showUser) bubbleAdd(msgs, 'user', userText);
      history.push({ role: 'user', content: userText });
      const t = thinking(msgs);
      try {
        const reply = await AI.ask(history, { system: PERSONA, maxTokens: 1500 });
        t.remove();
        history.push({ role: 'assistant', content: reply });
        bubbleAdd(msgs, 'ai', tex(reply), true);
      } catch (e) {
        t.remove(); bubbleAdd(msgs, 'ai', '⚠️ ' + e.message);
      }
    }
    sendBtn.addEventListener('click', () => { const v = input.value.trim(); if (v) { input.value = ''; turn(v, true); } });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendBtn.click(); });
    btn.disabled = false;
    turn(firstPrompt, false);
  }

  // 换个说法再考我：AI 现场出同考点新题
  async function reQuiz(btn, q) {
    btn.disabled = true;
    const container = btn.closest('.feedback') || btn.parentElement;
    let holder = container.querySelector('.requiz-holder');
    if (!holder) { holder = el('div', { class: 'requiz-holder' }); container.appendChild(holder); }
    const wait = el('div', { class: 'notice info', text: 'AI 正在出一道同考点的新题…' });
    holder.appendChild(wait);
    const prompt =
      '根据下面这道题的考点，出一道"换了数字/换了问法"的同类新题，难度相当，用来检验我是否真的会。\n' +
      '原题：\n' + qToText(q) + '\n\n' +
      '只输出一个 JSON（不要多余文字、不要代码块标记），字段：\n' +
      '{"type":"choice|fill","stem":"题干(LaTeX用$包)","options":["选项0",...4个(仅choice)],"answer":choice是正确下标数字/fill是答案字符串,"explanation":"大白话思路","steps":["步骤1","步骤2"]}';
    try {
      const raw = await AI.ask([{ role: 'user', content: prompt }], { system: PERSONA, maxTokens: 1400 });
      const nq = parseJSON(raw);
      nq.id = 'ai_' + Date.now(); nq.module = q.module; nq.topic = q.topic; nq.level = q.level;
      if (nq.type === 'choice' && typeof nq.answer === 'string') nq.answer = 'ABCD'.indexOf(nq.answer.trim().toUpperCase());
      wait.remove();
      const box = el('div', { class: 'card', style: 'border-color:var(--brand)' });
      box.appendChild(el('div', { class: 'small', style: 'color:var(--accent);margin-bottom:6px', text: '🔁 AI 出的同考点新题' }));
      renderQuestion(box, nq, { noRecord: true, noNav: true });
      holder.appendChild(box);
    } catch (e) {
      wait.className = 'notice warn'; wait.textContent = '⚠️ 出题失败：' + e.message;
    }
    btn.disabled = false;
  }

  // AI 批改解答题
  async function gradeSolve(fb, q, myText) {
    if (!myText.trim()) { alert('先把你的解题步骤写进上面的框里，我才好批改～'); return; }
    fb.innerHTML = ''; fb.className = 'feedback';
    const msgs = el('div', { class: 'ai-msgs' });
    fb.appendChild(el('div', { class: 'ai-box' }, [el('div', { class: 'ai-head' }, [el('span', { text: '🤖 AI 批改' })]), msgs]));
    const t = thinking(msgs);
    const prompt = '这是一道解答题和我的解法，请批改：\n【题目】' + qToText(q) +
      '\n【标准分步答案】' + (q.steps || []).join('；') +
      '\n【我的解法】' + myText +
      '\n\n请：①判断我的思路对不对、最终结果对不对；②指出错在哪一步、为什么错；③给出正确的关键步骤；④用鼓励的语气。全程简单中文，式子用$包。';
    try {
      const reply = await AI.ask([{ role: 'user', content: prompt }], { system: PERSONA, strong: true, maxTokens: 1600 });
      t.remove(); bubbleAdd(msgs, 'ai', tex(reply), true);
      DB.addSolve({ qid: q.id, text: myText, ts: Date.now(), aiFeedback: reply.slice(0, 500) });
    } catch (e) { t.remove(); bubbleAdd(msgs, 'ai', '⚠️ ' + e.message); }
  }

  // AI 每日教练
  async function dailyCoach(box) {
    const weak = SRS.weakestTopics(2).map(x => x.topic).join('、');
    const prompt = '用两三句话给我今天的学习开场建议。我的阶段：' + (DB.get('stage') || '预备') +
      '；距考试 ' + Math.max(0, U.daysBetween(U.todayStr(), DB.get('examDate'))) + ' 天；' +
      '题库进度 ' + SRS.overallProgress() + '%；' + (weak ? '最弱知识点：' + weak + '。' : '') +
      '语气温和、具体、别啰嗦，不要用 markdown 标题。';
    try {
      const r = await AI.ask([{ role: 'user', content: prompt }], { system: PERSONA, maxTokens: 400 });
      box.className = 'notice info'; box.innerHTML = '🧑‍🏫 ' + tex(r);
    } catch (e) { box.className = 'notice warn'; box.textContent = '（今日教练暂不可用：' + e.message.split('\n')[0] + '）'; }
  }

  // AI 今日小结
  async function dailySummary(btn) {
    btn.disabled = true;
    const v = view();
    const box = el('div', { class: 'card' }, [el('h3', { text: '🤖 今日小结' }), el('div', { class: 'notice info', id: 'sm', text: '正在总结…' })]);
    v.appendChild(box);
    const prompt = '给我一个今日学习小结（3-5 句）：今天学习约 ' + U.fmtMin(DB.todayMinutes()) +
      '，题库总进度 ' + SRS.overallProgress() + '%，正确率 ' + SRS.accuracy() + '%，' +
      '最弱知识点：' + (SRS.weakestTopics(2).map(x => x.topic).join('、') || '暂无') +
      '。请说：练了什么方向、鼓励一句、明天重点复习什么。简单中文，别用markdown标题。';
    try { const r = await AI.ask([{ role: 'user', content: prompt }], { system: PERSONA, maxTokens: 500 }); box.querySelector('#sm').innerHTML = tex(r); }
    catch (e) { box.querySelector('#sm').className = 'notice warn'; box.querySelector('#sm').textContent = '⚠️ ' + e.message; }
  }

  // AI 按需出题（练习页入口）
  async function aiGenerateFlow() {
    if (!AI.hasKey()) return alert('先到「设置 ⚙️」填 API Key 才能让 AI 出题。');
    const weak = SRS.weakestTopics(1)[0];
    const topic = prompt('针对哪个知识点出 5 道题？', weak ? weak.topic : '导数计算');
    if (!topic) return;
    const v = view(); v.innerHTML = '';
    const card = el('div', { class: 'card' }, [el('h2', { text: '🤖 AI 出题：' + topic }), el('div', { class: 'notice info', id: 'g', text: '正在生成 5 道题…' })]);
    v.appendChild(card);
    const p = '针对成考高数(二)知识点「' + topic + '」，出 5 道题（选择或填空，难度适合基础薄弱者）。' +
      '只输出 JSON 数组，不要多余文字/代码块：[{"type":"choice|fill","stem":"$包公式","options":[4个(仅choice)],"answer":下标或字符串,"explanation":"大白话","steps":["步骤"]}]';
    try {
      const raw = await AI.ask([{ role: 'user', content: p }], { system: PERSONA, strong: true, maxTokens: 2500 });
      const arr = parseJSON(raw);
      const list = arr.map((nq, i) => {
        nq.id = 'aig_' + Date.now() + '_' + i; nq.module = 'application'; nq.topic = topic; nq.level = 2;
        if (nq.type === 'choice' && typeof nq.answer === 'string') nq.answer = 'ABCD'.indexOf(nq.answer.trim().toUpperCase());
        return nq;
      });
      card.querySelector('#g').remove();
      card.appendChild(el('p', { class: 'muted small', text: '这些是 AI 现场生成的题，做完可自行判断是否加入题库（复制到 questions.js）。' }));
      startSession(list, 'AI · ' + topic);
    } catch (e) { card.querySelector('#g').className = 'notice warn'; card.querySelector('#g').textContent = '⚠️ ' + e.message; }
  }

  // AI 错题诊断
  async function wrongDiagnosis(btn) {
    btn.disabled = true;
    const wrongIds = DB.raw().wrongIds;
    const qs = (w.QUESTIONS || []).filter(q => wrongIds.includes(q.id)).slice(0, 25);
    const v = view();
    const box = el('div', { class: 'card' }, [el('h3', { text: '🤖 错题诊断报告' }), el('div', { class: 'notice info', id: 'dg', text: '正在分析你的错题模式…' })]);
    v.appendChild(box);
    const list = qs.map(q => '· [' + (q.topic || q.module) + '] ' + q.stem.replace(/\$/g, '')).join('\n');
    const prompt = '这是我做错的题（含知识点标签）：\n' + list + '\n\n请找出我反复出错的知识点/思维模式，指出 2-3 个最该补的漏洞，给一节针对性小课（每个漏洞：为什么错+怎么记+一个例子），最后给明天的重点。简单中文，式子用$包。';
    try { const r = await AI.ask([{ role: 'user', content: prompt }], { system: PERSONA, strong: true, maxTokens: 2000 }); box.querySelector('#dg').innerHTML = tex(r); }
    catch (e) { box.querySelector('#dg').className = 'notice warn'; box.querySelector('#dg').textContent = '⚠️ ' + e.message; }
    btn.disabled = false;
  }

  function qToText(q) {
    let s = '题干：' + q.stem;
    if (q.type === 'choice') s += '\n选项：' + (q.options || []).map((o, i) => 'ABCD'[i] + '.' + o).join('  ') + '\n正确答案：' + 'ABCD'[q.answer];
    else if (q.type === 'fill') s += '\n参考答案：' + (Array.isArray(q.answer) ? q.answer[0] : q.answer);
    return s;
  }
  function parseJSON(raw) {
    let t = raw.trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim();
    const s = t.indexOf('['), sb = t.indexOf('{');
    const start = (s === -1) ? sb : (sb === -1 ? s : Math.min(s, sb));
    const e = Math.max(t.lastIndexOf(']'), t.lastIndexOf('}'));
    if (start >= 0 && e > start) t = t.slice(start, e + 1);
    return JSON.parse(t);
  }

  // =========================================================
  //  学概念（知识讲解卡）
  // =========================================================
  Views.learn = function (p) {
    p = p || {}; const topic = p.topic;
    const v = view(); v.innerHTML = '';
    const card = el('div', { class: 'card' });
    card.appendChild(el('h2', { text: '📖 学概念：' + topicLabel(topic) }));

    // 若有对应的启蒙读本，优先给个入口
    const lessonIdx = (w.LESSONS || []).findIndex(l => l.topic === topic);
    if (lessonIdx >= 0) {
      card.appendChild(el('div', { class: 'notice info', html: '这个知识点有一节大白话小课 👉 ' }));
      card.appendChild(el('button', { class: 'btn', style: 'margin-bottom:8px', onclick: () => Router.go('lesson', { idx: lessonIdx }) }, ['📘 读《' + (w.LESSONS[lessonIdx].title) + '》']));
    }

    // 离线白话概念卡（不依赖 AI）
    const concept = (w.CONCEPTS || {})[topic];
    if (concept) {
      card.appendChild(el('div', { class: 'card', style: 'background:var(--brand-soft);margin:8px 0' },
        [el('h3', { text: '📝 ' + concept.title, style: 'margin-top:0' })].concat(
          (concept.body || []).map(b => {
            if (b.h) return el('div', { style: 'font-weight:600;margin:10px 0 4px', text: b.h });
            if (b.p) return el('p', { style: 'font-size:18px;line-height:1.9', html: tex(b.p) });
            if (b.eg) return el('div', { class: 'notice info', html: '举例：' + tex(b.eg) });
            if (b.tip) return el('div', { class: 'notice warn', html: '💡 ' + tex(b.tip) });
            return null;
          }).filter(Boolean)
        )));
    }

    // 相关公式
    const fs = (w.FORMULAS || []).filter(f => f.name.includes(topic) || (f.group && topicMatchGroup(topic, f.group))).slice(0, 4);
    if (fs.length) {
      card.appendChild(el('h3', { text: '要记住的公式' }));
      fs.forEach(f => card.appendChild(el('div', { class: 'notice info', html: '<b>' + esc(f.name) + '：</b>' + tex('$' + f.latex + '$') + (f.example ? '<br><span class="small">例：' + tex(f.example) + '</span>' : '') })));
    }
    // 相关例题（取一道带 steps 的）
    const eg = (w.QUESTIONS || []).find(q => q.topic === topic && q.steps && q.steps.length);
    if (eg) {
      card.appendChild(el('h3', { text: '看个例题（分步）' }));
      card.appendChild(el('div', { class: 'stem', html: tex(eg.stem) }));
      const box = el('div', { class: 'steps' });
      (eg.steps || []).forEach(s => box.appendChild(el('div', { class: 'step', html: tex(s) })));
      card.appendChild(box);
    }
    if (!fs.length && !eg) card.appendChild(el('p', { class: 'muted', text: '这个知识点还没有配套讲解卡，点下面让 AI 给你讲，或直接去做题感受一下。' }));

    // AI 讲这个知识点
    if (AI.hasKey()) {
      const holder = el('div');
      card.appendChild(el('button', { class: 'btn', style: 'margin-top:12px', onclick: (e) => aiTeachTopic(e.target, topic, holder) }, ['🤖 让 AI 用大白话讲「' + topicLabel(topic) + '」']));
      card.appendChild(holder);
    }
    card.appendChild(el('div', { class: 'btn-row' }, [
      el('button', { class: 'btn ghost', onclick: () => { const list = SRS.pickQuestions(q => q.topic === topic, 6); if (list.length) { list.sort((a, b) => a.level - b.level); startSession(list, topic + ' 练习', p.onDone); } else { if (p.onDone) p.onDone(); Router.go('practice'); } } }, ['去做这个知识点的题 →']),
      el('button', { class: 'btn soft', onclick: () => { if (p.onDone) p.onDone(); Router.go('home'); } }, ['学完了，标记完成'])
    ]));
    v.appendChild(card);
  };
  function topicMatchGroup(topic, group) {
    const map = { '导数计算': '导数', '基本积分': '积分', '极限计算': '极限', '三角函数': '三角', '函数基础': '函数' };
    return map[topic] === group;
  }
  async function aiTeachTopic(btn, topic, holder) {
    btn.disabled = true;
    const wait = el('div', { class: 'notice info', text: 'AI 正在准备讲解…' }); holder.appendChild(wait);
    const prompt = '请用初中生能懂的大白话给我讲成考高数(二)的知识点「' + topicLabel(topic) + '」：①它是干嘛的、生活比方；②最核心要会的 2-3 点；③每点配一个最简单的例子（分步）；④考试里通常怎么考、怎么拿分。式子用$包，别用markdown大标题。';
    try { const r = await AI.ask([{ role: 'user', content: prompt }], { system: PERSONA, maxTokens: 1800 }); wait.remove(); holder.appendChild(el('div', { class: 'card', style: 'background:var(--brand-soft)', html: tex(r) })); }
    catch (e) { wait.className = 'notice warn'; wait.textContent = '⚠️ ' + e.message; }
    btn.disabled = false;
  }

  // =========================================================
  //  启蒙读本（从零开始 · 数学扫盲）
  // =========================================================
  function lessonGroup(l) { return l.group || '启蒙'; }
  // 课程编号自动算：标题里若写了"第N课 · "会被去掉，按在列表中的位置重新编号
  function lessonTitle(l, idx) { return '第 ' + (idx + 1) + ' 课 · ' + String(l.title).replace(/^[^·]*·\s*/, ''); }
  function litLessonsDone() { return (w.LESSONS || []).filter(l => DB.lessonDone(l.id)).length; }
  function groupDone(g) { return (w.LESSONS || []).filter(l => lessonGroup(l) === g && DB.lessonDone(l.id)).length; }
  function groupTotal(g) { return (w.LESSONS || []).filter(l => lessonGroup(l) === g).length; }

  Views.lessons = function () {
    const v = view(); v.innerHTML = '';
    const list = w.LESSONS || [];
    v.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: '📘 一步步学 · 大白话课程' }),
      el('p', { class: 'muted', html: '从最最基础讲起，不用任何前置知识。每节几分钟，读完做 2 道小题就算过。<br><b>按顺序往下学</b>；哪节忘了随时回来翻。' })
    ]));

    const sections = [
      { g: '启蒙', title: '🌱 第一阶段 · 数学扫盲', sub: '字母、正负数、分数、次方、根号、解方程、函数' },
      { g: '预备', title: '📗 第二阶段 · 预备上手', sub: '不等号、定义域、次方运算、因式分解、三角值（做真正的题前先过这些）' },
      { g: '基础', title: '📘 第三阶段 · 核心计算', sub: '极限、连续、导数、基本积分——考试真正考的大头' },
      { g: '提升', title: '📕 第四阶段 · 拿分专项', sub: '导数应用、定积分、偏导数、概率' },
      { g: '冲刺', title: '🎯 第五阶段 · 真题技巧', sub: '换元/分部积分、反常积分、隐函数、全微分、证明题' }
    ];
    sections.forEach(sec => {
      const dn = groupDone(sec.g), tot = groupTotal(sec.g);
      if (!tot) return;
      v.appendChild(el('div', { style: 'margin:18px 0 6px' }, [
        el('div', { style: 'font-size:17px;font-weight:600', text: sec.title + '（' + dn + '/' + tot + '）' }),
        el('div', { class: 'muted small', text: sec.sub })
      ]));
      list.forEach((l, i) => {
        if (lessonGroup(l) !== sec.g) return;
        const done = DB.lessonDone(l.id);
        const skip = SRS.isSkipTopic(l.topic);
        const tag = skip
          ? el('span', { class: 'tag', style: 'background:var(--line);color:var(--ink-soft)', text: '✋选学·可放弃' })
          : (SRS.topicWeight(l.topic) >= 2 ? el('span', { class: 'tag ' + (SRS.topicWeight(l.topic) >= 3 ? 'w-core' : 'w-imp'), text: SRS.weightLabel(SRS.topicWeight(l.topic)) }) : null);
        const row = el('div', { class: 'task' + (done ? ' done' : '') + (skip ? ' locked' : '') }, [
          el('div', { class: 'chk', text: done ? '✓' : (i + 1) }),
          el('div', { class: 't-main' }, [
            el('div', { class: 't-title' }, [ document.createTextNode(lessonTitle(l, i) + ' '), tag ]),
            el('div', { class: 't-sub', text: skip ? '性价比低，冲 60 分可跳过；想学随时点开' : '共 ' + (l.checks ? l.checks.length : 0) + ' 道小练习' })
          ]),
          el('button', { class: 'btn sm soft', text: done ? '重读' : (skip ? '选学' : '开始') })
        ]);
        row.addEventListener('click', () => Router.go('lesson', { idx: i }));
        v.appendChild(row);
      });
    });

    const required = list.filter(l => !SRS.isSkipTopic(l.topic));
    if (required.length && required.every(l => DB.lessonDone(l.id))) {
      v.appendChild(el('div', { class: 'card center' }, [
        el('p', { html: '🎉 必学的课都学完了！（"选学·可放弃"那几节不影响过 60 分）' }),
        el('button', { class: 'btn', onclick: () => Router.go('home') }, ['回今日，开始正式做题 →'])
      ]));
    }
  };

  Views.lesson = function (p) {
    const list = w.LESSONS || []; const idx = (p && p.idx) || 0;
    const l = list[idx]; if (!l) return Router.go('lessons');
    const v = view(); v.innerHTML = '';
    v.appendChild(el('div', { class: 'topbar-progress' }, [el('span', { style: 'width:' + Math.round((idx) / list.length * 100) + '%' })]));
    v.appendChild(el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px' }, [
      el('span', { class: 'muted small', text: lessonGroup(l) + ' · 第 ' + (idx + 1) + ' 课 / 共 ' + list.length }),
      el('button', { class: 'btn sm ghost', onclick: () => Router.go('lessons') }, ['返回目录'])
    ]));

    const card = el('div', { class: 'card' });
    card.appendChild(el('h2', { text: lessonTitle(l, idx) }));
    (l.body || []).forEach(b => {
      if (b.h) card.appendChild(el('h3', { text: b.h }));
      else if (b.p) card.appendChild(el('p', { style: 'font-size:18px;line-height:1.9', html: tex(b.p) }));
      else if (b.eg) card.appendChild(el('div', { class: 'notice info', html: '举例：' + tex(b.eg) }));
      else if (b.tip) card.appendChild(el('div', { class: 'notice warn', html: '💡 ' + tex(b.tip) }));
    });
    v.appendChild(card);

    // 试一试（读的时候先在心里对一下，热身）
    if (l.checks && l.checks.length) {
      const qc = el('div', { class: 'card' }, [el('h3', { text: '✍️ 试一试（先热身，心里想一下再看答案）' })]);
      l.checks.forEach((c, i) => {
        const ansBox = el('div', { class: 'feedback', style: 'display:none' }, [
          el('div', { class: 'verdict ok', html: '答案：' + tex(c.a) }),
          c.why ? el('div', { html: tex(c.why) }) : null
        ]);
        const btn = el('button', { class: 'btn soft sm', text: '看答案' });
        btn.addEventListener('click', () => { ansBox.style.display = ansBox.style.display === 'none' ? 'block' : 'none'; btn.textContent = ansBox.style.display === 'none' ? '看答案' : '收起'; });
        qc.appendChild(el('div', { style: 'margin:14px 0;padding-bottom:10px;border-bottom:1px dashed var(--line)' }, [
          el('div', { style: 'font-size:18px;margin-bottom:8px', html: '<b>' + (i + 1) + '.</b> ' + tex(c.q) }),
          btn, ansBox
        ]));
      });
      v.appendChild(qc);
    }

    // 过关小测：读完做该知识点的真题，做完才算学会（掌握式，借鉴政治App）
    const quizQs = SRS.pickQuestions(x => x.topic === l.topic, 5);
    const goNext = () => { if (idx < list.length - 1) Router.go('lesson', { idx: idx + 1 }); else Router.go('lessons'); };
    const passScreen = () => {
      DB.markLesson(l.id);
      const v2 = view(); v2.innerHTML = '';
      v2.appendChild(el('div', { class: 'card center' }, [
        el('div', { class: 'hero-emoji', text: '✅' }),
        el('h2', { text: '过关！这节学会了' }),
        el('p', { class: 'muted', text: '做错的已进错题本，之后会再帮你复现。' }),
        el('div', { class: 'btn-row', style: 'justify-content:center' }, [
          el('button', { class: 'btn big', onclick: goNext }, [idx < list.length - 1 ? '下一节 →' : '回目录 ✓']),
          el('button', { class: 'btn ghost sm', onclick: () => Router.go('lessons') }, ['回目录'])
        ])
      ]));
    };

    // 硬门禁：做完判分，错的当场循环重练，全做对才算过关
    function gradeQuiz(results) {
      const wrongIds = Array.from(new Set((results || []).filter(r => !r.correct).map(r => r.id)));
      if (!wrongIds.length) return passScreen();
      const wrongQs = (w.QUESTIONS || []).filter(q => wrongIds.includes(q.id));
      const v2 = view(); v2.innerHTML = '';
      v2.appendChild(el('div', { class: 'card center' }, [
        el('div', { class: 'hero-emoji', text: '💪' }),
        el('h2', { text: '还差 ' + wrongQs.length + ' 道就过关' }),
        el('p', { class: 'muted', text: '刚才这几道做错了。解析都看过了，把它们再做对一次，这节就真会了——做对才放行。' }),
        el('div', { class: 'btn-row', style: 'justify-content:center' }, [
          el('button', { class: 'btn big', onclick: () => startSession(wrongQs, '再练错题·' + l.topic, gradeQuiz, true) }, ['把错题再做一遍 →']),
          el('button', { class: 'btn ghost sm', onclick: () => Router.go('lessons') }, ['先歇会儿（不算过关）'])
        ])
      ]));
    }

    const quizCard = el('div', { class: 'card', style: 'border-color:var(--brand)' });
    quizCard.appendChild(el('h3', { text: '🎯 过关小测', style: 'margin-top:0' }));
    if (quizQs.length) {
      quizCard.appendChild(el('p', { class: 'muted small', html: '读懂了？做 ' + quizQs.length + ' 道小题验一验。<b>全做对才算过关</b>；做错的会讲解、并让你当场再做对，别怕。' }));
      quizCard.appendChild(el('button', { class: 'btn big', onclick: () => startSession(quizQs, '过关·' + l.topic, gradeQuiz, true) }, ['开始过关小测（' + quizQs.length + ' 题）']));
    } else {
      quizCard.appendChild(el('p', { class: 'muted small', text: '这节暂时没有配套小题，直接标记学会即可。' }));
      quizCard.appendChild(el('button', { class: 'btn', onclick: () => { DB.markLesson(l.id); goNext(); } }, ['学会了 ✓']));
    }
    v.appendChild(quizCard);

    // 底部导航（保留一个小小的退路，避免个别题卡死；但默认要过关）
    const navRow = el('div', { class: 'btn-row', style: 'margin-top:6px' });
    if (idx > 0) navRow.appendChild(el('button', { class: 'btn ghost sm', onclick: () => Router.go('lesson', { idx: idx - 1 }) }, ['← 上一节']));
    navRow.appendChild(el('button', { class: 'btn ghost sm', onclick: () => Router.go('lessons') }, ['返回目录']));
    v.appendChild(navRow);
  };

  // =========================================================
  //  背公式
  // =========================================================
  Views.formulas = function () {
    const v = view(); v.innerHTML = '';
    const due = SRS.dueFormulas();
    v.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: '🔢 背公式' }),
      el('p', { class: 'muted', html: '数学有很多要死记的公式。翻卡自评（记得/模糊/不会）驱动间隔复习：记得的隔久点再考，不会的天天见。' }),
      el('div', { class: 'grid' }, [
        stat(due.length, '待复习'),
        stat((w.FORMULAS || []).length, '公式总数'),
        stat(SRS.formulaMastery() + '%', '掌握率')
      ]),
      el('div', { class: 'btn-row', style: 'justify-content:center' }, [
        el('button', { class: 'btn', onclick: () => startFormulaSession(Math.max(6, due.length)) }, ['开始复习到期公式']),
        el('button', { class: 'btn ghost', onclick: () => startFormulaSession(999, null, true) }, ['浏览全部公式'])
      ])
    ]));
    // 分组浏览
    const groups = {};
    (w.FORMULAS || []).forEach(f => { (groups[f.group] = groups[f.group] || []).push(f); });
    Object.entries(groups).forEach(([g, arr]) => {
      const d = el('details'); d.appendChild(el('summary', { text: g + '（' + arr.length + '）' }));
      arr.forEach(f => d.appendChild(el('div', { class: 'notice info', html: '<b>' + esc(f.name) + '：</b>' + tex('$' + f.latex + '$') })));
      v.appendChild(d);
    });
  };

  let fsession = null;
  function startFormulaSession(n, onDone, browseAll, guided, module) {
    let list;
    if (browseAll) list = (w.FORMULAS || []).slice();
    else if (module) list = SRS.dueFormulasForModule(module);   // 只背与当前章相关的公式
    else list = SRS.dueFormulas();
    if (!browseAll) {
      // 补同类新公式到 n（有 module 就只补同组，避免混入不相关公式）
      const g = module ? SRS.formulaGroupForModule(module) : null;
      const dueIds = new Set(list.map(f => f.id));
      (w.FORMULAS || []).forEach(f => { if (list.length < n && !dueIds.has(f.id) && (!g || f.group === g)) list.push(f); });
    }
    list = list.slice(0, n);
    if (!list.length) { if (onDone) return onDone(); alert('没有待背的公式，去做题吧！'); return; }
    fsession = { list, idx: 0, onDone, browseAll, guided: !!guided };
    renderFlash();
  }
  function renderFlash() {
    const v = view(); v.innerHTML = '';
    const f = fsession.list[fsession.idx];
    v.appendChild(el('div', { class: 'topbar-progress' }, [el('span', { style: 'width:' + Math.round(fsession.idx / fsession.list.length * 100) + '%' })]));
    v.appendChild(el('div', { class: 'muted small center', text: (f.group || '') + ' · ' + (fsession.idx + 1) + '/' + fsession.list.length }));

    const flash = el('div', { class: 'flash' });
    const inner = el('div', { class: 'flash-inner' }, [
      el('div', { class: 'flash-face' }, [
        el('div', { class: 'grp', text: '正面 · 提示' }),
        el('div', { class: 'big', text: f.name }),
        el('div', { class: 'small muted', style: 'margin-top:12px', text: '想一想公式是什么，点卡片翻面' })
      ]),
      el('div', { class: 'flash-face flash-back' }, [
        el('div', { class: 'grp', text: '背面 · 公式' }),
        el('div', { class: 'big', html: tex('$' + f.latex + '$') }),
        f.example ? el('div', { class: 'eg', html: '例：' + tex(f.example) }) : null
      ])
    ]);
    flash.appendChild(inner);
    flash.addEventListener('click', () => flash.classList.toggle('flip'));
    v.appendChild(flash);

    if (fsession.browseAll) {
      v.appendChild(el('div', { class: 'btn-row', style: 'justify-content:center' }, [
        el('button', { class: 'btn ghost', onclick: () => nextFlash() }, ['下一张 →'])
      ]));
    } else {
      v.appendChild(el('p', { class: 'center muted small', text: '翻到背面后，如实评价自己：' }));
      v.appendChild(el('div', { class: 'btn-row', style: 'justify-content:center' }, [
        el('button', { class: 'btn', style: 'background:var(--good)', onclick: () => { SRS.reviewFormula(f.id, 'know'); nextFlash(); } }, ['😀 记得']),
        el('button', { class: 'btn', style: 'background:var(--warn)', onclick: () => { SRS.reviewFormula(f.id, 'fuzzy'); nextFlash(); } }, ['😐 模糊']),
        el('button', { class: 'btn', style: 'background:var(--bad)', onclick: () => { SRS.reviewFormula(f.id, 'no'); nextFlash(); } }, ['😵 不会'])
      ]));
    }
    v.appendChild(el('div', { class: 'center', style: 'margin-top:10px' }, [el('button', { class: 'btn sm ghost', onclick: () => endFlash() }, ['结束'])]));
  }
  function nextFlash() { if (fsession.idx < fsession.list.length - 1) { fsession.idx++; renderFlash(); } else endFlash(); }
  function endFlash() { const d = fsession && fsession.onDone; const guided = fsession && fsession.guided; fsession = null; if (d) d(); if (guided) return; Router.go('formulas'); }

  // =========================================================
  //  学习进度
  // =========================================================
  Views.progress = function () {
    const v = view(); v.innerHTML = '';

    // 顶部小数据条
    v.appendChild(el('div', { class: 'grid' }, [
      stat(SRS.overallProgress() + '%', '题库进度'),
      stat(SRS.accuracy() + '%', '正确率'),
      stat(SRS.formulaMastery() + '%', '公式掌握'),
      stat(U.fmtMin(DB.totalMinutes()), '累计学习')
    ]));

    // 学习地图（章节主线）
    v.appendChild(chapterMapCard());

    v.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: '📈 各知识点通关率' }),
      el('p', { class: 'muted small', html: '每条是该板块/知识点的<b>一次性通关率</b>（第一次做就对的比例）。<span style="color:var(--good)">≥80 绿</span> / <span style="color:var(--warn)">60-79 黄</span> / <span style="color:var(--bad)">&lt;60 红</span>。' })
    ]));

    // 按模块
    const byM = SRS.passRateByModule();
    const c1 = el('div', { class: 'card' }, [el('h3', { text: '按板块' })]);
    Object.entries(SRS.MODULE_NAMES).forEach(([m, name]) => {
      const s = byM[m]; if (!s || !s.total) return;
      c1.appendChild(bar(name, s.first ? s.firstOk / s.first : null, s.first, s.total));
    });
    v.appendChild(c1);

    // 按知识点
    const byT = SRS.passRateByTopic();
    const c2 = el('div', { class: 'card' }, [el('h3', { text: '按知识点' })]);
    Object.entries(byT).sort((a, b) => (a[1].firstOk / (a[1].first || 1)) - (b[1].firstOk / (b[1].first || 1))).forEach(([t, s]) => {
      c2.appendChild(bar(t, s.first ? s.firstOk / s.first : null, s.first, s.total));
    });
    v.appendChild(c2);

    // 公式掌握
    v.appendChild(el('div', { class: 'card' }, [el('h3', { text: '公式掌握率' }), bar('公式记忆库', SRS.formulaMastery() / 100, 1, (w.FORMULAS || []).length)]));
  };
  function bar(label, rate, first, total) {
    const pct = rate == null ? 0 : Math.round(rate * 100);
    const cls = rate == null ? '' : pct >= 80 ? 'g' : pct >= 60 ? 'y' : 'r';
    return el('div', { class: 'bar-row' }, [
      el('div', { class: 'lbl' }, [el('span', { text: label }), el('span', { class: 'muted', text: rate == null ? '未测(' + total + '题)' : pct + '%  (做过' + first + '/' + total + ')' })]),
      el('div', { class: 'bar' }, [el('span', { class: cls, style: 'width:' + (rate == null ? 3 : pct) + '%' })])
    ]);
  }

  // =========================================================
  //  错题本
  // =========================================================
  Views.wrongbook = function () {
    const v = view(); v.innerHTML = '';
    const ids = DB.raw().wrongIds;
    const qs = (w.QUESTIONS || []).filter(q => ids.includes(q.id));
    const c = el('div', { class: 'card' }, [
      el('h2', { text: '📕 错题本（' + qs.length + '）' }),
      el('p', { class: 'muted small', text: '做错自动收集；再做对会自动移出。' })
    ]);
    c.appendChild(el('div', { class: 'btn-row' }, [
      el('button', { class: 'btn', disabled: !qs.length, onclick: () => startSession(SRS.pickQuestions(q => ids.includes(q.id), 999), '只刷错题') }, ['只刷错题']),
      AI.hasKey() ? el('button', { class: 'btn ghost', disabled: !qs.length, onclick: (e) => wrongDiagnosis(e.target) }, ['🤖 AI 错题诊断报告']) : null
    ]));
    v.appendChild(c);
    if (!qs.length) { v.appendChild(el('div', { class: 'card center muted', text: '还没有错题，继续加油！' })); return; }
    qs.forEach(q => {
      const d = el('details'); d.appendChild(el('summary', { html: tex(q.stem.slice(0, 60)) + (q.stem.length > 60 ? '…' : '') }));
      const box = el('div'); renderQuestion(box, q, { noNav: true }); d.appendChild(box); v.appendChild(d);
    });
  };

  // =========================================================
  //  模拟考（按真题结构）
  // =========================================================
  Views.exam = function () {
    const v = view(); v.innerHTML = '';
    v.appendChild(el('div', { class: 'card' }, [
      el('h2', { text: '🧪 模拟考' }),
      el('p', { class: 'muted', html: '按真题结构组卷：选择题 + 填空题 + 解答题。做完给分 + 薄弱点。<br><span class="small">真题满分150、150分钟；本模拟按题库现有题量缩放。</span>' }),
      el('div', { class: 'btn-row' }, [
        el('button', { class: 'btn', onclick: () => startExam('quick') }, ['快速小考（10 题选填）']),
        el('button', { class: 'btn ghost', onclick: () => startExam('full') }, ['整卷模拟（含解答题）'])
      ])
    ]));
  };
  function startExam(kind) {
    let list;
    if (kind === 'quick') list = U.shuffle(SRS.pickQuestions(q => q.type !== 'solve', 999)).slice(0, 10);
    else {
      const ch = U.shuffle((w.QUESTIONS || []).filter(q => q.type === 'choice')).slice(0, 10);
      const fi = U.shuffle((w.QUESTIONS || []).filter(q => q.type === 'fill')).slice(0, 10);
      const so = U.shuffle((w.QUESTIONS || []).filter(q => q.type === 'solve')).slice(0, 8);
      list = ch.concat(fi, so);
    }
    if (!list.length) return alert('题库题量不足以组卷，先多录点题。');
    startSession(list, kind === 'quick' ? '快速小考' : '整卷模拟');
  }

  // =========================================================
  //  摸底测试
  // =========================================================
  let placementIds = [];
  Views.placement = function () {
    // 跨难度小卷：从最简单(启蒙)到难，能识别真·零基础
    const pool = (w.QUESTIONS || []).filter(q => q.type !== 'solve');
    const byLv = lv => U.shuffle(pool.filter(q => q.level === lv));
    const list = [].concat(byLv(0).slice(0, 3), byLv(1).slice(0, 3), byLv(2).slice(0, 3), byLv(3).slice(0, 2));
    if (list.length < 4) { DB.set('placementDone', true); DB.set('stage', '零基础启蒙期'); return Router.go('home'); }
    placementIds = list.map(q => q.id);
    session = { list, idx: 0, title: '摸底测水平', results: [], placement: true, guided: true, onDone: finishPlacement };
    Views.question();
  };
  function finishPlacement(results) {
    // 按每个难度层的答对率定位起点
    const byLv = { 0: [0, 0], 1: [0, 0], 2: [0, 0], 3: [0, 0] };
    (results || []).forEach(r => {
      const q = (w.QUESTIONS || []).find(x => x.id === r.id); if (!q) return;
      const b = byLv[q.level]; if (!b) return; b[1]++; if (r.correct) b[0]++;
    });
    const rate = lv => byLv[lv][1] ? byLv[lv][0] / byLv[lv][1] : 0;
    const r0 = rate(0), r1 = rate(1), r2 = rate(2);
    let stage = '零基础启蒙期';
    if (r0 >= 0.6) stage = '预备夯实期';
    if (r0 >= 0.6 && r1 >= 0.6) stage = '基础攻坚期';
    if (r1 >= 0.6 && r2 >= 0.6) stage = '冲刺期';
    DB.set('stage', stage); DB.set('placementDone', true); DB.setTodayPlan(null);
    showPlan(stage, { r0, r1, r2 });
  }

  // 摸底后的"60 分最省时路线"
  function showPlan(stage, rates) {
    const v = view(); v.innerHTML = '';
    const curCh = SRS.CHAPTERS[SRS.currentChapterIndex()];
    const startMsg = {
      '零基础启蒙期': '基础确实薄，但没关系——从"数学扫盲"打地基起步，一步都不跳。',
      '预备夯实期': '基本运算没问题，从"预备·函数基础"接着上。',
      '基础攻坚期': '有底子！直接冲核心计算（极限/导数/积分）。',
      '冲刺期': '底子不错！主攻真题和拿分专项，查漏补缺。'
    }[stage];

    v.appendChild(el('div', { class: 'card center' }, [
      el('div', { class: 'hero-emoji', text: '🎯' }),
      el('h1', { class: 'hero-title', text: '你的提分计划' }),
      el('p', { html: '起点定位：<span class="pill" style="font-size:16px">' + stage + '</span>' }),
      el('p', { class: 'muted', text: startMsg })
    ]));

    // 60 分策略（最省时、最高分）
    v.appendChild(el('div', { class: 'card' }, [
      el('h3', { text: '🏆 目标 60 分 · 最省时路线', style: 'margin-top:0' }),
      el('div', { class: 'notice info', html: '成考高数(二)满分 150，<b>拿 60 就过</b>。最划算的打法：' }),
      el('div', { class: 'plan-step', html: '① <b>选择+填空吃满</b>（各 40 分，共 80 分）——套公式、基本计算，是最好拿的分。' }),
      el('div', { class: 'plan-step', html: '② <b>⭐核心必考练到熟</b>：极限计算、导数计算、基本积分、导数应用（再加偏导/全微分、概率）——解答题前几道就靠它们拿分。' }),
      el('div', { class: 'plan-step', html: '③ <b>这几块直接放弃</b>：中值定理证明、反常积分、隐函数——难学、考得少、性价比差，冲 60 分不碰。系统已自动把它们标成"选学"、不进你的每日计划、也不挡解锁。' }),
      el('div', { class: 'notice warn small', html: '算笔账：选填 80 分里拿一半多 + 解答题基础分，够到 60 绰绰有余。<b>不用全会，会核心的就行。</b>' })
    ]));

    // 你的路线（从当前章开始，标出核心）
    const chSt = SRS.chapterStatus();
    const curIdx = SRS.currentChapterIndex();
    const routeCard = el('div', { class: 'card' }, [el('h3', { text: '🗺️ 你的专属路线（按顺序闯关）', style: 'margin-top:0' })]);
    chSt.forEach((c, i) => {
      if (i < curIdx) return; // 只列从当前章往后的
      const core = SRS.topicWeight(SRS.leastPracticedTopicInModule(c.module) || '') >= 3
        || ['limit', 'derivative', 'application', 'integral_indef', 'integral_def'].includes(c.module);
      routeCard.appendChild(el('div', { class: 'plan-step' }, [
        document.createTextNode((i === curIdx ? '📍 ' : '') + c.name.replace(/·/, '·') + '　'),
        core ? el('span', { class: 'tag w-core', text: '⭐核心' }) : el('span', { class: 'small muted', text: '过一遍即可' })
      ]));
    });
    v.appendChild(routeCard);

    const btns = el('div', { class: 'btn-row', style: 'justify-content:center' }, [
      el('button', { class: 'btn big', onclick: () => Router.go('home') }, ['▶ 开始今日学习']),
    ]);
    if (AI.hasKey()) btns.appendChild(el('button', { class: 'btn ghost', onclick: (e) => aiPlan(e.target, stage, v) }, ['🤖 让 AI 出更详细计划']));
    v.appendChild(btns);
  }
  async function aiPlan(btn, stage, holder) {
    btn.disabled = true;
    const wait = el('div', { class: 'notice info', text: 'AI 正在制定计划…' }); holder.appendChild(wait);
    const days = Math.max(1, U.daysBetween(U.todayStr(), DB.get('examDate')));
    const p = '我是初二数学水平、高数从零开始，备考成考专升本高数(二)，目标60分。当前阶段：' + stage + '，距考试' + days + '天，每天学' + DB.get('dailyMinutes') + '分钟。请给我一份分三阶段（预备→基础→冲刺）的学习计划，每阶段说重点知识点和目标，最后给本周具体安排。简单中文、条理清楚、务实。';
    try { const r = await AI.ask([{ role: 'user', content: p }], { system: PERSONA, strong: true, maxTokens: 1800 }); wait.remove(); holder.appendChild(el('div', { class: 'card', style: 'text-align:left;background:var(--brand-soft)', html: tex(r) })); }
    catch (e) { wait.className = 'notice warn'; wait.textContent = '⚠️ ' + e.message; }
    btn.disabled = false;
  }

  // =========================================================
  //  设置
  // =========================================================
  Views.settings = function () {
    const s = DB.settings(); const v = view(); v.innerHTML = '';
    const c = el('div', { class: 'card' }); c.appendChild(el('h2', { text: '⚙️ 设置' }));

    // 每日时长
    c.appendChild(el('div', { class: 'field' }, [el('label', { text: '每日学习时长' }),
      seg([[20, '20 分钟'], [40, '40 分钟'], [60, '60 分钟']], s.dailyMinutes, val => { DB.set('dailyMinutes', val); DB.setTodayPlan(null); })]));
    // 阶段
    c.appendChild(el('div', { class: 'field' }, [el('label', { text: '学习阶段' }),
      seg([['零基础启蒙期', '零基础'], ['预备夯实期', '预备'], ['基础攻坚期', '基础'], ['冲刺期', '冲刺']], s.stage, val => DB.set('stage', val))]));
    // 主题
    c.appendChild(el('div', { class: 'field' }, [el('label', { text: '主题' }),
      seg([['light', '浅色'], ['dark', '深色']], s.theme, val => { DB.set('theme', val); applyTheme(); })]));
    // 考试日期
    c.appendChild(field('考试日期（以你省教育考试院公布为准）', 'examDate', s.examDate, 'date'));
    v.appendChild(c);

    // AI 接口
    const a = el('div', { class: 'card' }); a.appendChild(el('h2', { text: '🤖 AI 接口（B.AI 中转）' }));
    a.appendChild(el('p', { class: 'muted small', html: '默认已配好 B.AI（Anthropic 原生格式）。你只需填 <b>API Key</b>：去 chat.b.ai 创建，用支付宝/微信充值。<br>⚠️ Key 只存在你本机浏览器里，别贴给任何人。' }));
    a.appendChild(field('API Key', 'apiKey', s.apiKey, 'password'));
    a.appendChild(field('接口地址 apiBase', 'apiBase', s.apiBase));
    a.appendChild(el('div', { class: 'field' }, [el('label', { text: '接口格式（遇到 CORS 就切 OpenAI 兼容）' }),
      seg([['anthropic', 'Anthropic 原生'], ['openai', 'OpenAI 兼容']], s.apiFormat, val => DB.set('apiFormat', val))]));
    a.appendChild(field('日常模型（快）', 'modelFast', s.modelFast));
    a.appendChild(field('强力模型（批改/诊断）', 'modelStrong', s.modelStrong));
    a.appendChild(el('div', { class: 'btn-row' }, [
      el('button', { class: 'btn', onclick: (e) => testAI(e.target) }, ['测试连接']),
      el('span', { id: 'aitest', class: 'small muted', style: 'align-self:center' })
    ]));
    v.appendChild(a);

    // 存档
    const b = el('div', { class: 'card' }); b.appendChild(el('h2', { text: '💾 存档' }));
    b.appendChild(el('div', { class: 'btn-row' }, [
      el('button', { class: 'btn soft', onclick: exportSave }, ['导出存档']),
      el('button', { class: 'btn soft', onclick: importSave }, ['导入存档']),
      el('button', { class: 'btn warnbtn', onclick: () => { if (confirm('确定清空所有学习进度？设置会保留。')) { DB.resetProgress(); alert('已清空'); Router.go('home'); } } }, ['清空进度'])
    ]));
    v.appendChild(b);
  };
  function field(label, key, val, type) {
    const input = el('input', { type: type || 'text', value: val == null ? '' : val });
    input.addEventListener('change', () => DB.set(key, input.value.trim()));
    if (key === 'examDate') input.addEventListener('change', () => { DB.set('examDate', input.value); updateCountdown(); });
    return el('div', { class: 'field' }, [el('label', { text: label }), input]);
  }
  function seg(pairs, cur, cb) {
    const wrap = el('div', { class: 'seg' });
    pairs.forEach(([val, name]) => {
      const b = el('button', { class: String(cur) === String(val) ? 'on' : '', text: name });
      b.addEventListener('click', () => { $$('button', wrap).forEach(x => x.classList.remove('on')); b.classList.add('on'); cb(val); });
      wrap.appendChild(b);
    });
    return wrap;
  }
  async function testAI(btn) {
    const out = $('#aitest'); out.textContent = '测试中…'; btn.disabled = true;
    try { const r = await AI.ask([{ role: 'user', content: '回复两个字：你好' }], { maxTokens: 20, timeout: 30000 }); out.textContent = '✅ 连通：' + r.slice(0, 20); out.style.color = 'var(--good)'; }
    catch (e) { out.textContent = '❌ ' + e.message.split('\n')[0]; out.style.color = 'var(--bad)'; }
    btn.disabled = false;
  }
  function exportSave() {
    const blob = new Blob([DB.exportJSON()], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: 'gaoshu-save-' + U.todayStr() + '.json' });
    document.body.appendChild(a); a.click(); a.remove();
  }
  function importSave() {
    const inp = el('input', { type: 'file', accept: '.json' });
    inp.addEventListener('change', () => {
      const f = inp.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try { DB.importJSON(rd.result); applyTheme(); alert('导入成功'); Router.go('home'); } catch (e) { alert('导入失败：' + e.message); } };
      rd.readAsText(f);
    });
    inp.click();
  }

  // =========================================================
  //  主题 / 倒计时 / 计时心跳
  // =========================================================
  function applyTheme() { document.documentElement.setAttribute('data-theme', DB.get('theme') || 'light'); }
  function updateCountdown() {
    const days = Math.max(0, U.daysBetween(U.todayStr(), DB.get('examDate')));
    const cd = $('#countdown'); if (cd) cd.textContent = '距考试 ' + days + ' 天';
    const fm = $('#foot-model'); if (fm) fm.textContent = (AI.hasKey() ? 'AI 已连接' : 'AI 未配置') + ' · KaTeX 本地';
  }
  // 学习计时：可见时每 30s 记 0.5 分钟
  let idleTicks = 0;
  function heartbeat() {
    if (document.visibilityState === 'visible') {
      DB.addTime(0.5); idleTicks = 0;
      const cd = $('#countdown'); // 顺带刷新今日分钟显示（若在首页）
    }
  }

  // =========================================================
  //  启动
  // =========================================================
  function boot() {
    applyTheme();
    // 导航按钮
    $$('#mainnav button').forEach(b => b.addEventListener('click', () => Router.go(b.dataset.route)));
    updateCountdown();
    setInterval(heartbeat, 30000);
    document.addEventListener('visibilitychange', updateCountdown);
    Router.go('home');
    // 本地无进度时，尝试从硬盘备份自动恢复（经 server.py），恢复到就刷新首页
    DB.tryServerRestore(function (restored) { if (restored) { applyTheme(); updateCountdown(); Router.go('home'); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

})(window);
