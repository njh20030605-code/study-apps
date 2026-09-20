/* ===== storage.js 本地存档：进度 / 错题 / 打卡 / 时长 / 熟练度 / 设置 ===== */
(function (w) {
  'use strict';
  const KEY = 'gaoshu_tutor_v1';
  const BAK = KEY + '_bak';         // 双写备份键（多一层保险，防主存档被浏览器清空/损坏）

  const DEFAULT = {
    settings: {
      dailyMinutes: 40,             // 20 / 40 / 60
      stage: '',                    // 预备夯实期 / 基础攻坚期 / 冲刺期
      examDate: '2026-10-17',       // 可在设置改；以省教育考试院公布为准
      apiKey: '',
      apiBase: 'https://api.b.ai',  // B.AI 中转
      apiFormat: 'anthropic',       // anthropic | openai
      modelFast: 'claude-haiku-4-5',
      modelStrong: 'claude-sonnet-5',
      theme: 'light',
      placementDone: false,
      lastBackup: ''                // 上次导出备份日期 YYYY-MM-DD
    },
    // 每题记录：{seen, firstTry(第一次是否对), tries, correct, lastTs}
    questions: {},
    // 公式熟练度（SRS）：{box(0-5), due(日期), lastTs, seen}
    formulas: {},
    wrongIds: [],                   // 错题本（题目 id）
    checkins: [],                   // 打卡日期 ["2026-07-13", ...]
    timeLog: {},                    // { "2026-07-13": 分钟数 }
    solveHistory: [],               // 解答题历史 {qid, text, ts, aiFeedback}
    lessonsDone: [],                // 已学完的启蒙读本 id
    todayPlan: null,                // {date, items:[{key,done}], minutesTarget}
    createdAt: new Date().toISOString()
  };

  // 判断一份存档里"有没有真进度"（用于备份救回 & 防止空进度冲掉好备份）
  function hasData(s) {
    if (!s) return false;
    return (s.questions && Object.keys(s.questions).length > 0)
      || (s.lessonsDone && s.lessonsDone.length > 0)
      || (s.checkins && s.checkins.length > 0)
      || (s.formulas && Object.keys(s.formulas).length > 0);
  }
  function parse(raw) { try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }

  let state = load();

  function load() {
    let primary = parse(localStorage.getItem(KEY));
    let backup = parse(localStorage.getItem(BAK));
    let chosen = primary;
    // 主存档空/损坏、但备份有数据 → 用备份救回
    if (!hasData(primary) && hasData(backup)) { chosen = backup; console.warn('主存档为空，已从备份自动恢复'); }
    if (!chosen) chosen = structuredClone(DEFAULT);
    chosen.settings = Object.assign({}, DEFAULT.settings, chosen.settings || {});
    for (const k in DEFAULT) if (!(k in chosen)) chosen[k] = structuredClone(DEFAULT[k]);
    return chosen;
  }
  function writeBoth() {
    try {
      const json = JSON.stringify(state);
      localStorage.setItem(KEY, json);
      // 只有当前有真进度时才覆盖备份，避免"空进度冲掉好备份"
      if (hasData(state)) localStorage.setItem(BAK, json);
    } catch (e) { console.warn('存档失败', e); }
    serverBackup();
  }
  let saveTimer = null;
  function save() { clearTimeout(saveTimer); saveTimer = setTimeout(writeBoth, 120); }
  function saveNow() { writeBoth(); }

  // ---------- 自动备份到硬盘（经由 server.py，仅 localhost 生效）----------
  let bkTimer = null;
  function serverBackup() {
    if (location.protocol === 'file:') return;      // file:// 下没有服务器，跳过（仍有双键 localStorage 兜底）
    if (!hasData(state)) return;                     // 空进度不推
    clearTimeout(bkTimer);
    bkTimer = setTimeout(function () {
      try { fetch('/api/backup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state) }).catch(function () {}); } catch (e) {}
    }, 6000);
  }
  // 开局：本地啥都没有时，尝试从硬盘备份恢复
  function tryServerRestore(done) {
    if (location.protocol === 'file:' || hasData(state)) return done && done(false);
    fetch('/api/backup/latest').then(function (r) { return r.json(); }).then(function (s) {
      if (s && hasData(s)) {
        state = s; state.settings = Object.assign({}, DEFAULT.settings, s.settings || {});
        for (const k in DEFAULT) if (!(k in state)) state[k] = structuredClone(DEFAULT[k]);
        saveNow(); done && done(true);
      } else { done && done(false); }
    }).catch(function () { done && done(false); });
  }

  // ---------- 设置 ----------
  function get(k) { return state.settings[k]; }
  function set(k, v) { state.settings[k] = v; save(); }
  function settings() { return state.settings; }

  // ---------- 题目记录 ----------
  function qRec(id) {
    if (!state.questions[id]) state.questions[id] = { seen: 0, firstTry: null, tries: 0, correct: 0, lastTs: 0 };
    return state.questions[id];
  }
  function recordAnswer(id, isCorrect) {
    const r = qRec(id);
    r.seen++; r.tries++;
    if (isCorrect) r.correct++;
    if (r.firstTry === null) r.firstTry = !!isCorrect;   // 一次性通关率用
    r.lastTs = Date.now();
    if (!isCorrect) addWrong(id); else removeWrong(id);
    save();
  }
  function addWrong(id) { if (!state.wrongIds.includes(id)) state.wrongIds.push(id); }
  function removeWrong(id) { const i = state.wrongIds.indexOf(id); if (i >= 0) state.wrongIds.splice(i, 1); }

  // ---------- 打卡 / 时长 ----------
  function checkin() {
    const t = new Date().toISOString().slice(0, 10);
    if (!state.checkins.includes(t)) { state.checkins.push(t); save(); }
  }
  function streak() {
    if (!state.checkins.length) return 0;
    const set = new Set(state.checkins);
    let n = 0; const d = new Date();
    // 若今天没打卡，从昨天算起也算连续
    if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
    while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function addTime(min) {
    const t = new Date().toISOString().slice(0, 10);
    state.timeLog[t] = (state.timeLog[t] || 0) + min;
    save();
  }
  function todayMinutes() { return state.timeLog[new Date().toISOString().slice(0, 10)] || 0; }
  function totalMinutes() { return Object.values(state.timeLog).reduce((a, b) => a + b, 0); }

  // ---------- 公式熟练度 ----------
  function fRec(id) {
    if (!state.formulas[id]) state.formulas[id] = { box: 0, due: '2000-01-01', lastTs: 0, seen: 0 };
    return state.formulas[id];
  }

  // ---------- 解答历史 ----------
  function addSolve(rec) { state.solveHistory.unshift(rec); if (state.solveHistory.length > 200) state.solveHistory.pop(); save(); }

  // ---------- 启蒙读本 ----------
  function markLesson(id) { if (!state.lessonsDone.includes(id)) { state.lessonsDone.push(id); DB_checkinAndTime(); save(); } }
  function DB_checkinAndTime() { const t = new Date().toISOString().slice(0, 10); if (!state.checkins.includes(t)) state.checkins.push(t); }
  function lessonDone(id) { return state.lessonsDone.includes(id); }
  function lessonsDoneCount() { return state.lessonsDone.length; }

  // ---------- 今日计划 ----------
  function todayPlan() { return state.todayPlan; }
  function setTodayPlan(p) { state.todayPlan = p; save(); }

  // ---------- 导入导出 / 清空 / 备份提醒 ----------
  function exportJSON() {
    state.settings.lastBackup = new Date().toISOString().slice(0, 10);
    saveNow();
    return JSON.stringify(state, null, 2);
  }
  function importJSON(txt) {
    const s = JSON.parse(txt);
    if (!s.settings) throw new Error('存档格式不对');
    state = s; state.settings = Object.assign({}, DEFAULT.settings, s.settings);
    saveNow(); return true;
  }
  function resetProgress() {
    const keepSettings = state.settings;
    state = structuredClone(DEFAULT);
    state.settings = keepSettings;
    // 清空时把备份键也清掉，否则下次 load 会从 _bak 把旧进度又"救回来"
    try { localStorage.removeItem(BAK); } catch (e) {}
    saveNow();
  }
  // 距上次导出备份的天数（从没导出且有进度 → 返回一个较大数用于提醒）
  function daysSinceBackup() {
    const lb = state.settings.lastBackup;
    if (!lb) return hasData(state) ? 999 : 0;
    return Math.round((new Date(new Date().toISOString().slice(0, 10)) - new Date(lb)) / 86400000);
  }
  function hasProgress() { return hasData(state); }
  function raw() { return state; }

  w.DB = {
    get, set, settings, qRec, recordAnswer, addWrong, removeWrong,
    checkin, streak, addTime, todayMinutes, totalMinutes,
    fRec, addSolve, markLesson, lessonDone, lessonsDoneCount, todayPlan, setTodayPlan,
    exportJSON, importJSON, resetProgress, daysSinceBackup, hasProgress, tryServerRestore, raw, save, saveNow
  };
})(window);
