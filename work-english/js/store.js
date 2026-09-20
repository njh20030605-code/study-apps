/* ============================================================================
 * store.js —— 进度存储
 * 双保险：localStorage（快） + 硬盘 JSON 备份（稳）。
 * ⚠️ 为什么要硬盘备份：浏览器存储会被「清除浏览数据」冲掉，你已经踩过一次。
 *    server.py 那边还有一道「空进度不许覆盖非空备份」的保护。
 * ==========================================================================*/
(function () {
  const KEY = "work-en-v1";
  const APPTAG = "worken";               // 服务器备份的命名空间，别和成考 App 混
  const SAVE_DEBOUNCE = 1500;

  function blank() {
    return {
      cards: {},          // id -> FSRS card（词和短语共用，短语 id 形如 m01#3）
      streak: {},         // id -> 连续答对次数 0..3，满 3 算掌握；失手清零
      lastAdv: {},        // id -> 最后一次答对的日期，用来实现「一天最多推进一关」
      seenWords: [],      // 已进入学习的词 id，按进入顺序
      doneModules: [],    // 已完成过的模块 id
      moduleCursor: 0,    // 下一个要学的模块下标
      err: {},            // id -> {w:错的次数, t:总答题次数}  用来分「经常做错 / 偶尔做错」
      book: [],           // 生词本 [{k,en,zh,ipa,ctx,at}]
      log: [],            // [{date, newWords, reviews, modules, minutes}]
      settings: { newPerDay: 12, voice: "", rate: 0.92, voiceSource: "tts", theme: "" },
      lastDate: "",
      streakDays: 0,      // 连续打卡天数（注意别和上面按词的 streak 混）
      totalMinutes: 0,
    };
  }

  let state = blank();
  let timer = null;

  function migrate(s) {
    const b = blank();
    const out = Object.assign(b, s || {}, { settings: Object.assign(b.settings, (s && s.settings) || {}) });
    // ⚠️ 旧版存档里 streak 是「连续打卡天数」（数字），新版用它存「每个词的连对次数」（对象）。
    //    不迁移的话，S.streak[id] = n 是往数字上赋属性 —— 非严格模式下不报错，值直接丢掉，
    //    结果连对次数永远是 0，三关关卡永远进不去。实测踩到过。
    if (typeof out.streak !== "object" || out.streak === null) {
      if (typeof out.streak === "number" && !out.streakDays) out.streakDays = out.streak;
      out.streak = {};
    }
    if (typeof out.streakDays !== "number") out.streakDays = 0;
    // 「一天最多推进一关」已废弃：跟「没全对就一直循环刷」矛盾。旧存档里强制关掉。
    out.settings.oneStagePerDay = false;
    if (typeof out.moduleCursor !== "number") out.moduleCursor = 0;
    if (!Array.isArray(out.seenWords)) out.seenWords = [];
    if (!Array.isArray(out.doneModules)) out.doneModules = [];
    if (!Array.isArray(out.log)) out.log = [];
    if (!Array.isArray(out.book)) out.book = [];
    if (typeof out.err !== "object" || out.err === null) out.err = {};
    if (typeof out.cards !== "object" || out.cards === null) out.cards = {};
    return out;
  }

  function weight(s) {
    // 和 server.py 的判断保持一致：这份存档里有多少真东西
    return (Object.keys((s && s.cards) || {}).length) + ((s && s.log ? s.log.length : 0)) + ((s && s.seenWords ? s.seenWords.length : 0));
  }

  const Store = {
    get() { return state; },

    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) state = migrate(JSON.parse(raw));
      } catch (e) { console.warn("本地存储读取失败", e); }
      return state;
    },

    /** 启动时跟硬盘备份比一比，谁的内容多用谁 —— 防浏览器存储被清空 */
    async restoreIfBetter() {
      try {
        const r = await fetch("/api/backup/latest?app=" + APPTAG, { cache: "no-store" });
        if (!r.ok) return null;
        const j = await r.json();
        if (!j.ok || !j.state) return null;
        const disk = migrate(j.state);
        if (weight(disk) > weight(state)) {
          state = disk;
          this.save(true);
          return { restored: true, savedAt: j.savedAt };
        }
        return { restored: false, savedAt: j.savedAt };
      } catch (e) { return null; }   // 直接开 html 没服务器时静默跳过
    },

    save(immediate) {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn(e); }
      clearTimeout(timer);
      const push = () => {
        fetch("/api/backup?app=" + APPTAG, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state),
        }).catch(() => {});
      };
      if (immediate) push(); else timer = setTimeout(push, SAVE_DEBOUNCE);
    },

    /** 导出成文件，给你自己留一份 */
    exportFile() {
      const blob = new Blob([JSON.stringify(state, null, 1)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "工作英语-进度-" + new Date().toISOString().slice(0, 10) + ".json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },

    importFile(file, cb) {
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const s = migrate(JSON.parse(fr.result));
          if (weight(s) === 0 && weight(state) > 0) { cb(false, "这份文件是空的，没有导入"); return; }
          state = s; this.save(true); cb(true, "已导入");
        } catch (e) { cb(false, "文件读不出来：" + e.message); }
      };
      fr.readAsText(file);
    },

    reset() { state = blank(); this.save(true); },
  };

  window.Store = Store;
})();
