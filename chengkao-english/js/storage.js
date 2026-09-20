/* ============================================================================
 * storage.js  ——  存档 / 进度持久化
 * 所有数据存在浏览器的 localStorage 里；并提供导出/导入 JSON 备份。
 * ========================================================================== */

const STORE_KEY = "ck_english_tutor_v1";   // localStorage 的总键名

/* ------- 默认存档结构（第一次使用时用它） ------- */
function defaultState() {
  return {
    settings: {
      apiKey: "",                               // API Key（存本地，不上传别处）
      apiBase: "https://api.anthropic.com",     // 接口地址：官方就是这个；用第三方中转就填它给的地址
      apiFormat: "anthropic",                   // 接口格式：anthropic(原生) 或 openai(兼容)
      modelFast: "claude-haiku-4-5-20251001",   // 便宜快的模型：逐题讲解、对话陪练、出题
      modelStrong: "claude-sonnet-5",           // 能力强的模型：作文批改、错题诊断
      // ↑ 模型名以你的服务商为准（第三方中转可能有自己的模型名），可在【设置】页随时改
      dailyMinutes: 40,                         // 每天训练时长 25/40/50
      voiceName: "",                            // 朗读用的语音（空=自动挑最好的英语语音）
      examDate: "2026-10-17",                   // 考试日期（EXAM_DATE，可在设置里改）
      stage: 1,                                 // 当前阶段 1/2/3（可手动切换）
    },
    progress: {
      streak: 0,            // 连续打卡天数
      lastCheckIn: "",      // 上次打卡日期 yyyy-mm-dd
      totalAnswered: 0,     // 累计答题数
      totalCorrect: 0,      // 累计答对数
      srs: {},              // 每题熟练度： { [qid]: {level:0-3, wrong:n, seen:n, due, firstTry:bool} }
      studyTime: {},        // 每天学习秒数： { 'yyyy-mm-dd': seconds }
      recent: {},           // 各章最近20次作答对错： { [章号]: [1,0,1,...] }（判"现在会没会"，防被开局烂印象锁死）
      chAtt: {},            // 各章累计练习次数： { [章号]: n }（防死锁兜底的依据）
      weakCh: [],           // 「练够了但没吃透、已放行」的薄弱章号，日常复习优先回访
      placedPass: [],       // 摸底判定「已掌握、主线直接跳过」的章号（可在摸底页一键取消）
    },
    readingSkills: {},      // 阅读/完形技巧闯关进度： { [skillId]: {practiced, best, passed} }
    taskDone: {},           // 每日任务完成情况： { 'yyyy-mm-dd': {study,learn,review,dialogue,write} }
    weeklyScores: [],       // 周测/模拟考记录 [{date, score, total, note}]
    essays: [],             // 作文历史 [{id, date, prompt, text, feedback}]
    aiQuestions: [],        // AI 现场生成、我选择保存的新题（结构同题库）
  };
}

let STATE = null;   // 全局唯一的存档对象

/* 读取存档（没有就用默认） */
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      STATE = Object.assign(defaultState(), JSON.parse(raw));
      // 保证子对象也补全（防止旧存档缺字段）
      STATE.settings = Object.assign(defaultState().settings, STATE.settings);
      STATE.progress = Object.assign(defaultState().progress, STATE.progress);
    } else {
      STATE = defaultState();
    }
  } catch (e) {
    console.error("读取存档失败，使用默认存档：", e);
    STATE = defaultState();
  }
  return STATE;
}

/* 保存存档。除了写 localStorage，还会把进度悄悄备份到硬盘（见下方 pushBackup） */
function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(STATE));
  } catch (e) {
    console.error("保存存档失败：", e);
    alert("保存失败，可能是浏览器存储空间不足。");
  }
  scheduleBackup();
}

/* ==========================================================================
 *                     自动备份到硬盘（防浏览器清数据）
 * 背景：用 file:// 打开时，进度只存在浏览器里，Chrome 清数据/更新就可能清空
 *      （已经丢过一次）。用「启动学习.command」跑本地服务器后，网页会把进度
 *      POST 给服务器写成 backups/latest.json，进度就落在硬盘上了。
 * 降级：如果是 file:// 直接双击打开（没有服务器），fetch 会失败，静默忽略，
 *      功能一切照旧，只是没有硬盘备份——所以推荐用 .command 启动。
 * ========================================================================== */
const HAS_SERVER = location.protocol === "http:" || location.protocol === "https:";
let _backupTimer = null;
let _lastBackupJSON = "";

function scheduleBackup() {
  if (!HAS_SERVER) return;
  clearTimeout(_backupTimer);
  _backupTimer = setTimeout(pushBackup, 8000);   // 停手 8 秒后再传，避免每答一题就发一次
}

/* 这份存档里有没有真东西（做过题 / 答过题）。空存档不值得备份，
   而且推上去有害——会把硬盘上的好备份冲掉（实测踩过）。 */
function stateHasProgress(s) {
  const p = (s && s.progress) || {};
  return Object.keys(p.srs || {}).length > 0 || (p.totalAnswered || 0) > 0;
}

function pushBackup() {
  if (!HAS_SERVER) return;
  if (!stateHasProgress(STATE)) return;          // 空进度不上传，别冲掉硬盘上的好备份
  try {
    const body = JSON.stringify(STATE);
    if (body === _lastBackupJSON) return;        // 没变化就不重复写
    fetch("/api/backup", { method: "POST", headers: { "Content-Type": "application/json" }, body })
      .then((r) => {
        if (!r.ok) return;
        _lastBackupJSON = body;
        STATE.progress.lastBackup = todayStr();
        // 硬盘上已经有新数据了，撤掉「别自动恢复」的墓碑，让以后还能自动救回来
        localStorage.removeItem(NO_RESTORE_KEY);
      })
      .catch(() => {});                          // 服务器没开就算了，不打扰用户
  } catch (e) { /* 忽略 */ }
}
// 关页面前再抢救一次（用 keepalive 保证请求能发出去）
window.addEventListener("beforeunload", function () {
  if (!HAS_SERVER || !stateHasProgress(STATE)) return;
  try {
    const body = JSON.stringify(STATE);
    if (body !== _lastBackupJSON) {
      fetch("/api/backup", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
    }
  } catch (e) { /* 忽略 */ }
});

/* 启动时：本地没存档但硬盘上有备份 → 自动恢复。
   返回 Promise<恢复时间字符串 | null>。
   ⚠️ 用户在设置里主动点过「清空进度」时会留下 NO_RESTORE 墓碑，此时不自动恢复，
      否则他清了又被自动填回来，等于清不掉。 */
const NO_RESTORE_KEY = "ck_no_restore";
function tryAutoRestore() {
  if (!HAS_SERVER) return Promise.resolve(null);
  if (localStorage.getItem(STORE_KEY)) return Promise.resolve(null);   // 本地有数据，不动
  if (localStorage.getItem(NO_RESTORE_KEY)) return Promise.resolve(null);
  return fetch("/api/backup/latest")
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (!j || !j.ok || !j.state) return null;
      const p = (j.state.progress) || {};
      const meaningful = (p.totalAnswered || 0) > 0 || Object.keys(p.srs || {}).length > 0;
      if (!meaningful) return null;                                    // 空备份就别恢复了
      STATE = Object.assign(defaultState(), j.state);
      STATE.settings = Object.assign(defaultState().settings, STATE.settings || {});
      STATE.progress = Object.assign(defaultState().progress, STATE.progress || {});
      localStorage.setItem(STORE_KEY, JSON.stringify(STATE));
      return j.savedAt || "未知时间";
    })
    .catch(() => null);
}

/* 导出存档为 JSON 文件下载 */
function exportState() {
  const data = JSON.stringify(STATE, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `成考英语私教-存档-${today}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* 从文件导入存档 */
function importState(file, onDone) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const obj = JSON.parse(e.target.result);
      STATE = Object.assign(defaultState(), obj);
      STATE.settings = Object.assign(defaultState().settings, STATE.settings || {});
      STATE.progress = Object.assign(defaultState().progress, STATE.progress || {});
      saveState();
      onDone && onDone(true, "导入成功！");
    } catch (err) {
      onDone && onDone(false, "导入失败：文件不是有效的存档 JSON。");
    }
  };
  reader.readAsText(file);
}
