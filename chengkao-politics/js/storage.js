/* ============================================================
 * storage.js —— 存档与进度持久化
 * 所有进度、错题本、打卡、主观题历史都存在浏览器 localStorage。
 * 另提供导出/导入 JSON 文件的功能，方便换电脑或备份。
 * ============================================================ */

const Store = (function () {
  const KEY = "zhengzhi_state_v1";

  // 默认存档结构
  function defaultState() {
    return {
      version: 1,
      // ——— 设置 ———
      apiKey: "",
      apiBaseUrl: "https://api.anthropic.com",   // API 地址：官方或第三方中转站根地址
      apiFormat: "anthropic",                    // 接口格式：anthropic(原生/v1/messages) 或 openai(兼容/v1/chat/completions)
      modelFast: "claude-haiku-4-5-20251001",    // 讲解等轻活：便宜快
      modelStrong: "claude-sonnet-5",            // 批改/诊断等重活：更强
      examDate: "2026-10-17",                    // 考试日期，设置里可改
      dailyMinutes: 25,                          // 兼容旧字段（不再直接用）
      minWeekday: 15,                            // 工作日训练时长（上班日，轻量）
      minWeekend: 40,                            // 周末训练时长（有空，冲刺）
      // ——— 学习进度 ———
      phase: 1,                                  // 当前阶段 1/2/3
      placementDone: false,                      // 摸底测试是否完成
      placementResult: null,                     // 摸底诊断结果
      // ——— 打卡 ———
      streak: 0,                                 // 连续打卡天数
      lastCheckin: "",                           // 上次打卡日期 YYYY-MM-DD
      checkinDates: [],                          // 所有打卡日期
      // ——— 刷题记录（SRS）———
      // progress[qid] = {level:0-3, seen, correct, wrong, lastTs, nextTs}
      progress: {},
      wrongBook: [],                             // 错题 id 列表（去重）
      // ——— 主观题作答历史 ———
      subjectiveHistory: [],                     // {id, stem, myAnswer, aiResult, score, date}
      // ——— 统计 ———
      stats: { totalAnswered: 0, totalCorrect: 0 },
      // ——— v2 新增 ———
      studySeconds: {},        // 每日学习时长 {date: 秒}
      roundState: {},          // 专项练习不重复轮次 {poolKey:{done:[],round}}
      dailySummaries: [],      // 每日 AI 学习总结 [{date, text, answered, correct}]
      memoryRead: {},          // 必背卡已读记录 {cardId: 最近已读日期}
      lastBackup: "",          // 上次导出备份的日期 YYYY-MM-DD
      sprintMode: null,        // 冲刺模式：null=自动(考点基本通关后自动开)，true/false=手动指定
      mockHistory: [],         // 模拟考成绩记录 [{date,title,correct,total,rate}]
      sprintDone: {},          // 冲刺模式每日待办完成情况 {date,review,zhenti,subj,mock}
      // ——— 每日任务快照（避免同一天重复生成）———
      todayTask: null,                           // {date, ids:[], done:bool}
      createdAt: new Date().toISOString()
    };
  }

  const BAK = KEY + "_bak"; // 双写的备份键（多一层保险）—— 必须在 load() 调用前定义

  // 判断一份存档是不是"有内容的"（有摸底或有刷题记录）
  function hasData(o) {
    return !!(o && (o.placementDone || (o.progress && Object.keys(o.progress).length) ||
                    (o.stats && o.stats.totalAnswered)));
  }

  function load() {
    let primary = null, backup = null;
    try { const r = localStorage.getItem(KEY); if (r) primary = JSON.parse(r); } catch (e) {}
    try { const r = localStorage.getItem(BAK); if (r) backup = JSON.parse(r); } catch (e) {}
    // 主存档没数据、但备份有数据 → 用备份救回（防止主存档被清/损坏）
    let chosen = primary;
    if (!hasData(primary) && hasData(backup)) {
      chosen = backup;
      console.warn("主存档为空，已从备份恢复");
    }
    if (!chosen) return defaultState();
    return Object.assign(defaultState(), chosen); // 合并默认字段，防止旧存档缺字段
  }

  let state = load(); // 现在 BAK/hasData 都已就绪，可安全调用

  function save() {
    try {
      const json = JSON.stringify(state);
      localStorage.setItem(KEY, json);
      localStorage.setItem(BAK, json); // 同步写一份备份
    } catch (e) {
      console.error("保存存档失败", e);
      alert("保存失败：浏览器存储可能已满或被禁用。");
    }
  }

  function get() { return state; }

  function set(patch) {
    Object.assign(state, patch);
    save();
  }

  function reset() {
    state = defaultState();
    save();
  }

  // 导出存档为 JSON 文件下载
  function exportFile() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
    a.href = url;
    a.download = `政治刷题存档_${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    state.lastBackup = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    save();
  }
  // 距上次导出备份过了多少天（从没导出返回一个大数）
  function daysSinceBackup() {
    if (!state.lastBackup) return 999;
    const last = new Date(state.lastBackup + "T00:00:00");
    return Math.floor((Date.now() - last) / (24*3600*1000));
  }

  // 从文件导入存档
  function importFile(file, onDone) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        state = Object.assign(defaultState(), parsed);
        save();
        onDone && onDone(true);
      } catch (err) {
        onDone && onDone(false, err);
      }
    };
    reader.readAsText(file);
  }

  return { get, set, save, reset, exportFile, importFile, defaultState, daysSinceBackup };
})();
