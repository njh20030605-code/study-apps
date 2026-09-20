/* ============================================================================
 * app.js —— 界面与流程
 *
 * 一个词要「连续答对 3 次」才算会，三次考法不同、由浅到深：
 *   第 1 关  认词：英文 → 四选一中文        （能认出来）
 *   第 2 关  盲猜：只给一句挖空的例句 → 自评 认识 / 模糊 / 不认识
 *   第 3 关  产出：只给中文 → 出声说英文 → 自评 说对了 / 说错了
 * 任何一关失手，连对次数清零，从第 1 关重来。复习走同一套关卡。
 *
 * 发音：单词优先播真人录音（Wikimedia Commons，本地 audio/ 目录）；
 *       没有录音的、以及所有多词短语和例句，走系统语音合成。
 *       多词短语额外提供「逐词真人」按钮。
 * ==========================================================================*/
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const WORDS = window.WORDS, MODULES = window.MODULES, CATS = window.CATS;
  const EXTRA = window.EXTRA || {}, AUTO_IPA = window.AUTO_IPA || {};
  const AUDIO = window.AUDIO || {}, AUDIO_SEQ = window.AUDIO_SEQ || {};
  const GLOSS = window.GLOSS || {}, LEMMA = window.LEMMA || {}, DICT = window.DICT || {};
  const ROOTS = window.ROOTS || {};
  const byId = {}; WORDS.forEach(w => byId[w.id] = w);

  const NEED = 3;                 // 连对几次算会
  const MAX_TRY = 3;              // 同一个词一轮里最多问几次，防止真不会时卡死
  let S = null, session = null, sessionStart = 0;

  const todayStr = () => new Date().toLocaleDateString("sv");
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = ~~(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- 取词的各种信息 ---------------- */
  const ex = id => EXTRA[id] || {};
  const ipaOf = w => ex(w.id).ipa || AUTO_IPA[w.id] || "";
  /** 主要意思（我按你的工作场景标的）永远排第一，词典里的其他意思跟在后面补全。
   *  ⚠️ 不能反过来：词典第一条常常不是你工作里用的那个意思
   *     （creative 词典第一条是「有创造力的」，你要的是「素材」）。*/
  const sensesOf = w => ex(w.id).senses || [{ pos: w.pos, zh: w.zh }];
  function allSenses(w) {
    const mine = sensesOf(w).map(x => ({ pos: x.pos, zh: x.zh, own: true }));
    const seen = new Set(mine.map(x => x.zh));
    const extra = (DICT[w.id] || [])
      .filter(d => d.z && !seen.has(d.z))
      .map(d => ({ pos: d.p || "", zh: d.z, own: false }));
    return mine.concat(extra);
  }
  const moreOf = w => ex(w.id).more || [];
  const streakOf = id => (S.streak && S.streak[id]) || 0;
  const isMastered = id => streakOf(id) >= NEED;
  const errOf = id => (S.err && S.err[id]) || { w: 0, t: 0 };

  /* 把词分三档，给你看得见「哪些是老对手」。
   * ⚠️ 判定用我自己数的错误次数，不用 FSRS 的 card.lapses ——
   *    实测连续答错 5 次 lapses 还是 0（它只把「学会后又忘」算 lapse）。
   *    FSRS 的 difficulty 作为辅助信号：反复答错会顶到 9 以上。 */
  const TIER = { HARD: "hard", SOME: "some", CLEAN: "clean" };
  function tierOf(id) {
    const e = errOf(id), d = window.SRS.difficulty(S.cards[id]);
    if (e.w >= 3 || (e.w >= 2 && d >= 7)) return TIER.HARD;
    if (e.w >= 1) return TIER.SOME;
    return TIER.CLEAN;
  }
  const TIER_LABEL = { hard: "顽固", some: "偶尔错", clean: "干净" };

  /* ---------------- 发音 ---------------- */
  const JUNK = /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Junior|Kathy|Organ|Ralph|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Deranged|Hysterical|Princess|Bruce|Agnes|Victoria)\b/i;
  const PREFER = ["Samantha", "Ava", "Allison", "Susan", "Nicky", "Alex", "Tom", "Aaron", "Daniel", "Kate"];
  let voices = [];
  function loadVoices() {
    const all = speechSynthesis.getVoices() || [];
    voices = all.filter(v => /^en[-_]/i.test(v.lang) && !JUNK.test(v.name));
    if (!voices.length) voices = all.filter(v => /^en[-_]/i.test(v.lang));
  }
  loadVoices(); speechSynthesis.onvoiceschanged = loadVoices;
  function pickVoice() {
    if (!voices.length) loadVoices();
    const want = S && S.settings.voice;
    if (want) { const v = voices.find(v => v.name === want); if (v) return v; }
    for (const n of PREFER) { const v = voices.find(v => v.name.startsWith(n)); if (v) return v; }
    return voices.find(v => /en[-_]US/i.test(v.lang)) || voices[0] || null;
  }
  function tts(text, rate) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-US";
    u.rate = rate || (S && S.settings.rate) || 0.92;
    speechSynthesis.speak(u);
  }

  let el = null;
  /** 播一个词。
   *  ⚠️ 默认走系统合成音（Samantha 美音），不是真人录音。
   *     原因：真人录音来自 Wikimedia 的志愿者，口音杂（英音/印度音/澳音都有），
   *     实听下来对练发音是干扰。真人录音留着，想听的人在设置里切、或在弹窗里单点。 */
  function say(w, forceHuman) {
    const f = AUDIO[w.id];
    const useHuman = forceHuman || S.settings.voiceSource === "human";
    if (f && useHuman) {
      try {
        if (el) { el.pause(); }
        el = new Audio("audio/" + f);
        el.playbackRate = 1;
        el.play().catch(() => tts(ex(w.id).say || w.en));
        return "human";
      } catch (e) { /* 落到合成 */ }
    }
    tts(ex(w.id).say || w.en);
    return "tts";
  }
  /** 多词短语的逐词真人发音 */
  async function sayByWord(w) {
    const seq = AUDIO_SEQ[w.id]; if (!seq) return;
    for (const s of seq) {
      if (!s.f) { tts(s.w); await new Promise(r => setTimeout(r, 620)); continue; }
      await new Promise(res => {
        const a = new Audio("audio/" + s.f);
        a.onended = a.onerror = () => setTimeout(res, 90);
        a.play().catch(() => res());
      });
    }
  }
  function hasHuman(w) { return !!AUDIO[w.id]; }
  function hasSeq(w) { return !!AUDIO_SEQ[w.id]; }
  window.__say = say;

  /* ---------------- 组今天的任务 ---------------- */
  function buildSession() {
    const now = new Date();
    const seen = new Set(S.seenWords);
    // 注：原来这里有个「一天最多推进一关」的闸门，已拆掉。
    //     用户定的规则是「练不完 5 个 3 次全对的就一直循环刷题」，
    //     闸门会把人挡在第 1 关，两者不能共存。

    // ---- 复习队列：所有到期的学过的词 ----
    let review = S.seenWords.filter(id => byId[id] && window.SRS.isDue(S.cards[id], now));

    // 排序 = 记忆曲线优先。顽固词提到最前（它们最需要），其余按「还记得多少」升序：
    // 最快要忘的先复习。这才是按曲线复习，不是按加入顺序。
    review = review.map(id => ({
      id,
      ret: window.SRS.retention(S.cards[id], now),
      tier: tierOf(id),
    })).sort((a, b) => {
      const rank = t => (t === TIER.HARD ? 0 : t === TIER.SOME ? 1 : 2);
      if (rank(a.tier) !== rank(b.tier)) return rank(a.tier) - rank(b.tier);
      return a.ret - b.ret;
    });

    // ---- 今日新词 + 穿插词 ----
    // 用户要求：「练 5 个今日词的时候，也会穿插一些别的新词进来。」
    // targets = 今日目标（进度条按它算）；fillers = 混进来的额外新词，
    // 免得整轮就在那几个词之间来回，顺手过了就算白赚。
    const notSeen = WORDS.filter(w => !seen.has(w.id)).map(w => w.id);
    const fresh = notSeen.slice(0, S.settings.newPerDay);
    const fillerN = Math.min(4, Math.max(0, notSeen.length - fresh.length));
    const fillers = notSeen.slice(fresh.length, fresh.length + fillerN);

    const mod = MODULES[S.moduleCursor % MODULES.length];
    const counts = { hard: 0, some: 0, clean: 0 };
    review.forEach(r => counts[r.tier]++);

    return {
      reviewQueue: review.map(r => ({ id: r.id })),
      newQueue: fresh.map(id => ({ id })),
      reviewCounts: counts,
      newIds: fresh,
      fillerIds: fillers,
      newDone: fresh.length === 0,
      reviewIds: review.map(r => r.id),
      module: mod, modDone: false,
    };
  }

  /* ---------------- 熟练度小圆点（三格） ---------------- */
  function dots(id) {
    const n = streakOf(id);
    return `<span class="dots">${[0, 1, 2].map(i => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</span>`;
  }

  /* ---------------- 顶部导航（搬自成考英语·策略台）---------------- */
  let curView = "home";
  function renderNav() {
    const nav = $("#nav"); if (!nav) return;
    const rLeft = session ? session.reviewQueue.length : 0;
    const nLeft = session && !session.newDone ? session.newIds.filter(id => streakOf(id) < NEED).length : 0;
    const items = [
      { k: "home", t: "今天", cls: "primary", n: rLeft + nLeft + (session && !session.modDone ? 1 : 0) },
      { sep: 1 },
      { k: "review", t: "复习", n: rLeft, act: () => startWords("review"), off: !rLeft },
      { k: "new", t: "新词", n: nLeft, act: () => startWords("new"), off: !nLeft },
      { k: "phrase", t: "短语", act: startPhrase, off: session && session.modDone },
      { sep: 1 },
      { k: "book", t: "词库", act: () => renderBook() },
      { k: "marks", t: "生词本", n: (S.book || []).length, act: renderBookmarks },
      { k: "stats", t: "统计", act: renderStats },
      { k: "set", t: "设置", act: renderSettings },
    ];
    nav.innerHTML = items.map(it => it.sep ? '<span class="nav-sep"></span>' :
      `<button class="nav-item ${it.cls || "plain"} ${curView === it.k ? "active" : ""}" data-k="${it.k}" ${it.off ? "disabled" : ""}>${it.t}${it.n ? `<span class="dot">${it.n}</span>` : ""}</button>`).join("");
    $$(".nav-item", nav).forEach(b => b.onclick = () => {
      const it = items.find(x => x.k === b.dataset.k);
      curView = b.dataset.k;
      if (!it || !it.act) { curView = "home"; renderHome(); return; }
      it.act();
      renderNav();
    });
  }

  function initTheme() {
    const btn = $("#themeBtn"); if (!btn) return;
    const apply = v => {
      if (v) document.documentElement.setAttribute("data-theme", v);
      else document.documentElement.removeAttribute("data-theme");
      btn.textContent = v === "dark" ? "☀️" : v === "light" ? "🌙" : "🌓";
    };
    apply(S.settings.theme || "");
    btn.onclick = () => {
      // 三态循环：跟随系统 → 亮 → 暗 → 跟随系统
      const cur = S.settings.theme || "";
      const next = cur === "" ? "light" : cur === "light" ? "dark" : "";
      S.settings.theme = next; Store.save(true); apply(next);
      toast(next === "" ? "跟随系统" : next === "light" ? "浅色" : "深色");
    };
  }

  /* ---------------- 首页 ---------------- */
  function renderHome() {
    session = session || buildSession();
    const learned = S.seenWords.length;
    const mastered = S.seenWords.filter(isMastered).length;
    const rLeft = session.reviewQueue.length;
    const nLeft = session.newDone ? 0 : session.newIds.filter(id => streakOf(id) < NEED).length;
    const nPassed = session.newIds.filter(id => streakOf(id) >= NEED).length;
    const c = session.reviewCounts;
    const planTotal = session.reviewIds.length + session.newIds.length;
    const doneCnt = (session.reviewIds.length - rLeft) + nPassed;
    const pct = planTotal ? Math.round(doneCnt / planTotal * 100) : 100;
    const allDone = rLeft === 0 && nLeft === 0 && session.modDone;

    $("#app").innerHTML = `
      <div class="home">
        <div class="hd">
          <div><div class="eyebrow">${todayStr()} · 连续 ${S.streakDays} 天</div><h1>今天的任务</h1></div>
          <button class="icon" id="toStats" title="统计">▤</button>
        </div>
        <div class="ring-row">
          <div class="ring" style="--p:${pct}"><div class="ring-in"><b>${pct}</b><span>%</span></div></div>
          <div class="tasks">
            <div class="task ${rLeft ? "" : "off"}"><span class="tk">复习</span><b>${rLeft}</b><span class="tu">词</span></div>
            <div class="task ${nLeft ? "" : "off"}"><span class="tk">新词</span><b>${nPassed}</b><span class="tu">/ ${session.newIds.length} 过关</span></div>
            <div class="task ${session.modDone ? "off" : ""}"><span class="tk">短语</span><b>1</b><span class="tu">模块</span></div>
          </div>
        </div>

        ${rLeft ? `<div class="tiers">
          <span class="tier hard ${c.hard ? "" : "z"}">顽固 ${c.hard}</span>
          <span class="tier some ${c.some ? "" : "z"}">偶尔错 ${c.some}</span>
          <span class="tier clean ${c.clean ? "" : "z"}">干净 ${c.clean}</span>
          <span class="tier-note">按遗忘曲线排好了，最快忘的先出</span>
        </div>` : ""}

        ${allDone ? `<div class="done-card">今天做完了 👌<br><span>明天有 ${nextDueCount()} 个词到期</span></div>` : ""}

        <div class="btns">
          <button class="primary" id="goReview" ${rLeft ? "" : "disabled"}>
            ${rLeft ? `先复习 · ${rLeft} 词` : "复习已完成"}
          </button>
          <button class="primary ${rLeft ? "muted" : ""}" id="goNew" ${nLeft ? "" : "disabled"}>
            ${nLeft ? `学新词 · 还有 ${nLeft} 个没过关` : "新词已过关"}
          </button>
          <button class="primary alt" id="goPhrase" ${session.modDone ? "disabled" : ""}>
            ${session.modDone ? "短语已完成" : `短语模块 · ${session.module.name}`}
          </button>
        </div>
        ${rLeft && nLeft ? `<div class="order-note">建议顺序：<b>先复习再学新词</b>。到期的词正卡在遗忘边缘，晚一天成本高得多。</div>` : ""}
        ${nLeft ? `<div class="order-note">今日新词 <b>${session.newIds.length}</b> 个，<b>三关全对才算过关</b>，没过完会一直循环出，中间穿插 ${session.fillerIds.length} 个别的新词。</div>` : ""}

        <div class="mod-peek">
          <div class="mp-tag">${session.module.tag}</div>
          <div class="mp-name">${session.module.name}</div>
          <div class="mp-why">${session.module.why}</div>
          <div class="mp-n">${session.module.items.length} 句</div>
        </div>
        <div class="stat-strip">
          <div><dt>已学</dt><dd>${learned}<small>/${WORDS.length}</small></dd></div>
          <div><dt>已掌握</dt><dd>${mastered}</dd></div>
          <div><dt>模块</dt><dd>${S.doneModules.length}<small>/${MODULES.length}</small></dd></div>
          <div><dt>累计</dt><dd>${Math.round(S.totalMinutes)}<small>分</small></dd></div>
        </div>
        <div class="btns row">
          <button class="ghost" id="toBook">词库</button>
          <button class="ghost" id="toMarks">生词本${(S.book || []).length ? " · " + S.book.length : ""}</button>
          <button class="ghost" id="toSet">设置</button>
        </div>
      </div>`;
    curView = "home"; renderNav();
    $("#goReview").onclick = () => startWords("review");
    $("#goNew").onclick = () => startWords("new");
    $("#goPhrase").onclick = startPhrase;
    $("#toStats").onclick = renderStats;
    $("#toSet").onclick = renderSettings;
    $("#toBook").onclick = () => renderBook();
    $("#toMarks").onclick = renderBookmarks;
  }

  function nextDueCount() {
    const t = new Date(Date.now() + 86400000);
    return S.seenWords.filter(id => window.SRS.isDue(S.cards[id], t)).length;
  }


  /* ---------------- 句子分词：双击任意单词查意思 ---------------- */
  /* ⚠️ 句子外面必须套 .tokline（CSS 里设了 user-select:none）。
   *    不然双击会触发浏览器的文字选中，Chrome / Grammarly 的划词菜单会弹出来盖住卡片
   *    —— 用户实测截图里就是这个现象。*/
  function tokline(text, cls) {
    const parts = String(text).split(/([A-Za-z][A-Za-z'’\-]*)/g);
    let html = "";
    for (let i = 0; i < parts.length; i++) {
      const seg = parts[i];
      if (i % 2 === 1) html += `<span class="tok" data-w="${esc(seg.toLowerCase())}">${esc(seg)}</span>`;
      else html += esc(seg);
    }
    return `<span class="tokline ${cls || ""}">${html}</span>`;
  }

  /** 把容器里的 .tok 接上双击查词 */
  function bindTokens(root, ctxSentence) {
    $$(".tok", root || document).forEach(t => {
      t.ondblclick = e => { e.stopPropagation(); lookup(t.dataset.w, ctxSentence); };
    });
  }

  /** 查一个词：先查自己的 158 词库，再查句子词典，再试原形 */
  function lookup(tokRaw, ctx) {
    let tok = String(tokRaw || "").toLowerCase().replace(/[’']s$/, "").replace(/^[^a-z]+|[^a-z\-]+$/g, "");
    if (!tok) return;
    const core = WORDS.find(w => w.en.toLowerCase() === tok);
    if (core) { openModal(core); return; }
    let g = GLOSS[tok], key = tok;
    if (!g && LEMMA[tok]) { key = LEMMA[tok]; g = GLOSS[key]; }
    openMini(tok, key, g, ctx);
  }

  /* ---------------- 小弹窗：句子里查到的词 ---------------- */
  function openMini(tok, key, g, ctx) {
    const inBook = !!(S.book || []).find(b => b.k === tok);
    const wrap = document.createElement("div");
    wrap.className = "modal-wrap";
    wrap.innerHTML = `
      <div class="modal mini" role="dialog" aria-modal="true">
        <button class="mclose" aria-label="关闭">✕</button>
        <div class="m-word">${esc(tok)}</div>
        ${g && g.i ? `<div class="m-ipa">${esc(g.i)}</div>` : ""}
        ${key !== tok ? `<div class="m-lemma">原形：${esc(key)}</div>` : ""}
        <div class="m-audio"><button class="spk big" id="xspk">🔊 发音</button></div>
        ${g ? `<div class="m-senses">
                 <div class="m-sense">${g.p ? `<span class="pos-tag">${esc(g.p.replace(/:/g, " "))}</span>` : ""}<span>${esc(g.z)}</span></div>
               </div>`
            : `<div class="m-none">这个词不在词库里。可以先加进生词本，回头补。</div>`}
        ${ctx ? `<div class="m-sec"><div class="sl">出现在</div><div class="m-ctx">${esc(ctx)}</div></div>` : ""}
        <div class="m-actions">
          <button class="opt ${inBook ? "ghosty" : "go"}" id="xbook">${inBook ? "已在生词本 · 移出" : "＋ 加入生词本"}</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    const close = () => { wrap.remove(); document.removeEventListener("keydown", onEsc); };
    const onEsc = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onEsc);
    $(".mclose", wrap).onclick = close;
    wrap.onclick = e => { if (e.target === wrap) close(); };
    $("#xspk", wrap).onclick = () => tts(tok, 0.85);
    tts(tok, 0.85);
    $("#xbook", wrap).onclick = () => {
      if (inBook) removeFromBook(tok); else addToBook({ k: tok, en: tok, zh: g ? g.z : "", ipa: g ? (g.i || "") : "", ctx: ctx || "" });
      close();
      toast(inBook ? "已从生词本移出" : "已加入生词本");
    };
  }

  /* ---------------- 生词本 ---------------- */
  function addToBook(item) {
    if (!S.book) S.book = [];
    if (S.book.find(b => b.k === item.k)) return;
    S.book.unshift(Object.assign({ at: todayStr() }, item));
    Store.save();
  }
  function removeFromBook(k) {
    if (!S.book) return;
    S.book = S.book.filter(b => b.k !== k);
    Store.save();
  }
  function inBook(k) { return !!(S.book || []).find(b => b.k === k); }
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
  }

  /** 生词本渲染时实时查一遍词典。
   *  ⚠️ 别只信存进去的那份快照：词典后来改好了、或者当初加的时候释义是脏的，
   *     快照不会自己更新（实测生词本里留着一条带 \n 的旧数据）。key 是唯一可靠的东西。*/
  function freshGloss(b) {
    const core = WORDS.find(w => w.en.toLowerCase() === b.k);
    if (core) return { zh: sensesOf(core).map(x => x.pos + " " + x.zh).join("；"), ipa: ipaOf(core) };
    let key = b.k, g = GLOSS[key];
    if (!g && LEMMA[key]) { key = LEMMA[key]; g = GLOSS[key]; }
    if (g) return { zh: g.z, ipa: g.i || "" };
    return { zh: b.zh || "", ipa: b.ipa || "" };
  }

  function renderBookmarks() {
    const list = (S.book || []).map(b => Object.assign({}, b, freshGloss(b)));
    $("#app").innerHTML = `
      <div class="page">
        <div class="bar"><button class="icon" id="back">←</button><div class="verdict">生词本 · ${list.length}</div><div class="cnt"></div></div>
        ${list.length ? `<div class="wlist">
          ${list.map(b => `<div class="brow">
            <div class="b-main">
              <div class="b-en">${esc(b.en)}<button class="spk xs" data-say="${esc(b.en)}">🔊</button></div>
              ${b.ipa ? `<div class="b-ipa">${esc(b.ipa)}</div>` : ""}
              <div class="b-zh">${esc(b.zh || "（还没有释义）")}</div>
              ${b.ctx ? `<div class="b-ctx">${esc(b.ctx)}</div>` : ""}
              <div class="b-at">${esc(b.at)}</div>
            </div>
            <button class="b-del" data-k="${esc(b.k)}" aria-label="移出">✕</button>
          </div>`).join("")}
        </div>` : `<div class="empty">还没有生词。<br><br>在任何句子上<b>双击一个单词</b>，弹窗里就能加进来。<br>单词卡的弹窗里也有这个按钮。</div>`}
      </div>`;
    $("#back").onclick = renderHome;
    $$("[data-say]").forEach(b => b.onclick = () => tts(b.dataset.say, 0.85));
    $$(".b-del").forEach(b => b.onclick = () => { removeFromBook(b.dataset.k); renderBookmarks(); });
  }

  /* ---------------- 弹窗：单词详情 ---------------- */
  function openModal(w) {
    const senses = sensesOf(w), more = moreOf(w), ipa = ipaOf(w);
    const wrap = document.createElement("div");
    wrap.className = "modal-wrap";
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(w.en)} 释义">
        <button class="mclose" aria-label="关闭">✕</button>
        <div class="cat" style="--c:${CATS[w.cat].color}">${CATS[w.cat].name}</div>
        <div class="m-word" id="mword" data-plain="${esc(w.en)}" data-syl="${esc((ROOTS[w.id] || {}).syl || w.en)}">${esc(w.en)}</div>
        ${(ROOTS[w.id] || {}).syl ? `<button class="sylbtn" id="msyl">切音节</button>` : ""}
        ${ipa ? `<div class="m-ipa">${esc(ipa)}</div>` : ""}
        <div class="m-audio">
          <!-- 默认合成音是主按钮（口音干净）。真人录音口音杂，降为次要，想听再点。 -->
          <button class="spk big" id="mspk">🔊 发音</button>
          ${hasHuman(w) ? `<button class="spk big alt" id="mhum">🔊 真人</button>` : ""}
          ${hasSeq(w) ? `<button class="spk big alt" id="mseq">🔊 逐词真人</button>` : ""}
        </div>
        <div class="m-senses">
          ${senses.map(s => `<div class="m-sense"><span class="pos-tag">${esc(s.pos)}</span><span>${esc(s.zh)}</span></div>`).join("")}
        </div>
        <div class="m-sec"><div class="sl">注释</div><div class="sb">${esc(w.gloss)}</div></div>
        ${rootBlock(w, true)}
        <div class="m-sec"><div class="sl">你的原话</div>
          <div class="ex-en">${tokline(w.ex.en)}<button class="spk sm" id="mspkex">🔊</button></div>
          <div class="ex-zh">${esc(w.ex.zh)}</div>
        </div>
        ${w.note ? `<div class="m-sec note"><div class="sl">注意</div><div class="sb">${esc(w.note)}</div></div>` : ""}
        ${more.length ? `<div class="m-sec"><div class="sl">举一反三</div>
          <div class="more-list">${more.map((m, i) => `
            <div class="more-row"><div class="mr-en">${esc(m.en)}<button class="spk xs" data-say="${esc(m.en)}">🔊</button></div><div class="mr-zh">${esc(m.zh)}</div></div>`).join("")}</div></div>` : ""}
        <div class="m-actions">
          <button class="opt ${inBook(w.en.toLowerCase()) ? "ghosty" : "go"}" id="mbook">${inBook(w.en.toLowerCase()) ? "已在生词本 · 移出" : "＋ 加入生词本"}</button>
        </div>
        <div class="m-foot">熟练度 ${dots(w.id)} ${isMastered(w.id) ? "已掌握" : `还要连对 ${NEED - streakOf(w.id)} 次`}</div>
      </div>`;
    document.body.appendChild(wrap);
    const close = () => { wrap.remove(); document.removeEventListener("keydown", onEsc); };
    const onEsc = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onEsc);
    $(".mclose", wrap).onclick = close;
    wrap.onclick = e => { if (e.target === wrap) close(); };
    const mw = $("#mword", wrap), msy = $("#msyl", wrap);
    if (msy) { let on = false; msy.onclick = () => {
      on = !on; mw.textContent = on ? mw.dataset.syl : mw.dataset.plain;
      mw.classList.toggle("issyl", on); msy.textContent = on ? "合起来" : "切音节"; }; }
    $("#mspk", wrap).onclick = () => say(w);
    const hb = $("#mhum", wrap); if (hb) hb.onclick = () => say(w, true);
    const sq = $("#mseq", wrap); if (sq) sq.onclick = () => sayByWord(w);
    $("#mspkex", wrap).onclick = () => tts(w.ex.en, 0.88);
    $$("[data-say]", wrap).forEach(b => b.onclick = e => { e.stopPropagation(); tts(b.dataset.say, 0.9); });
    $$(".rt-krow b", wrap).forEach(b => { b.classList.add("lookupable"); b.onclick = () => { close(); lookup(b.textContent, w.en); }; });
    bindTokens(wrap, w.ex.en);
    const k = w.en.toLowerCase();
    $("#mbook", wrap).onclick = () => {
      if (inBook(k)) removeFromBook(k);
      else addToBook({ k, en: w.en, zh: sensesOf(w).map(x => x.pos + " " + x.zh).join("；"), ipa: ipaOf(w), ctx: w.ex.en });
      close(); toast(inBook(k) ? "已加入生词本" : "已从生词本移出");
    };
    say(w);
  }

  /* ---------------- 背单词 ----------------
   * 用户定的规则（2026-08-23）：
   *   「第一次答对，第二次看英文猜中文，第三次看中文想英文。三次全对才算过关。
   *     练不完 5 个 3 次全对的，就一直循环刷题。
   *     练 5 个今日词的时候，也会穿插一些别的新词进来。」
   *
   * 所以新词是【循环队列】：目标词没全部满 3 次，这一轮就不结束，
   * 顺序打散、不连着出同一个词，中间穿插几个别的新词免得来回就那几个。
   * 复习不这么循环 —— 复习的节奏交给 FSRS，一个词过一遍就行。
   * ---------------------------------------------------------------- */
  let wq = null;

  function startWords(kind) {
    sessionStart = Date.now();
    const isRev = kind === "review";
    if (isRev) {
      wq = { kind: "review", pool: session.reviewQueue.map(x => x.id), targets: [], seen: new Set(), tries: {}, gaveUp: [], cursor: 0, last: null };
    } else {
      wq = {
        kind: "new",
        targets: session.newIds.slice(),          // 今日目标，全部满 3 次这轮才结束
        pool: session.newIds.concat(session.fillerIds),  // 实际会出的词（含穿插的）
        seen: new Set(), tries: {}, gaveUp: [], cursor: 0, last: null,
      };
    }
    if (!wq.pool.length) { renderHome(); return; }
    nextWord();
  }

  const passed = id => streakOf(id) >= NEED;

  /** 挑下一个要出的词：还没满 3 次的里面挑，避开刚出过的那个 */
  function pickNext() {
    const left = wq.pool.filter(id => !passed(id) && !wq.gaveUp.includes(id));
    if (!left.length) return null;
    // 复习模式：一个词过一遍就走，不循环
    if (wq.kind === "review") {
      const fresh = left.filter(id => !wq.seen.has(id));
      if (fresh.length) return fresh[0];
      const retry = left.filter(id => (wq.tries[id] || 0) < MAX_TRY);
      return retry.length ? retry[0] : null;
    }
    // 新词模式：循环，但别连着出同一个
    const others = left.filter(id => id !== wq.last);
    const arr = others.length ? others : left;
    // 优先出连对次数少的（更需要练），同档里随机，避免每轮顺序一样
    const min = Math.min(...arr.map(streakOf));
    const cand = arr.filter(id => streakOf(id) === min);
    return cand[Math.floor(Math.random() * cand.length)];
  }

  function nextWord() {
    document.onkeydown = null;
    const id = pickNext();
    if (id == null) { finishWords(); return; }
    wq.last = id;
    const w = byId[id], st = streakOf(id);
    if (st === 0) askRecognize(w);
    else if (st === 1) askBlind(w);
    else askProduce(w);
  }

  /* 顶部：进度 = 目标词里已经满 3 次的个数（不背单词的 0/5 就是这个） */
  function drillBar(label, w) {
    const isRev = wq.kind === "review";
    const goalArr = isRev ? wq.pool : wq.targets;
    const done = goalArr.filter(passed).length;
    const pct = goalArr.length ? done / goalArr.length * 100 : 100;
    const isFiller = !isRev && wq.targets.indexOf(w.id) < 0;
    let tags = "";
    if (isRev) {
      const t = tierOf(w.id), r = Math.round(window.SRS.retention(S.cards[w.id], new Date()) * 100);
      tags = `<span class="tier ${t} mini">${TIER_LABEL[t]}</span><span class="ret">记得 ${r}%</span>`;
    } else if (isFiller) {
      tags = `<span class="tier some mini">穿插</span>`;
    }
    return `<div class="drillbar">
      <button class="icon" id="back">←</button>
      <div class="grow">
        <div class="pg"><i style="width:${pct}%"></i></div>
        <div class="stage"><span class="kindtag">${isRev ? "复习" : "新词"}</span>${label}${tags}</div>
      </div>
      <div class="goal"><b>${done}</b>/${goalArr.length}</div>
      <div class="db-act">
        <button class="db-btn ${inBook(w.en.toLowerCase()) ? "on" : ""}" id="dbStar" title="加入生词本">☆</button>
        <button class="db-btn" id="dbKnown" title="这个已经很熟，直接过">熟</button>
      </div>
    </div>`;
  }

  function bindDrill(w) {
    $("#back").onclick = () => { flushQueue(); renderHome(); };
    $("#dbStar").onclick = () => {
      const k = w.en.toLowerCase();
      if (inBook(k)) { removeFromBook(k); toast("已从生词本移出"); }
      else { addToBook({ k, en: w.en, zh: allSenses(w).slice(0, 2).map(x => x.pos + " " + x.zh).join("；"), ipa: ipaOf(w), ctx: w.ex.en }); toast("已加入生词本"); }
      $("#dbStar").classList.toggle("on", inBook(k));
    };
    $("#dbKnown").onclick = () => {
      // 直接判定为过关：三次都算对，FSRS 按 easy 记
      if (!S.streak) S.streak = {};
      S.streak[w.id] = NEED;
      if (!S.cards[w.id]) S.cards[w.id] = window.SRS.newCard();
      S.cards[w.id] = window.SRS.grade(S.cards[w.id], "easy");
      if (!S.seenWords.includes(w.id)) S.seenWords.push(w.id);
      wq.seen.add(w.id);
      Store.save(); toast(w.en + " 标为已熟");
      nextWord();
    };
  }

  function flushQueue() {
    if (wq.kind === "review") session.reviewQueue = wq.pool.filter(id => !passed(id)).map(id => ({ id }));
  }

  /** 词头：单词 + 美音徽章 + 音标。点单词切/合音节（158 个词都是手写核对过的）*/
  function wordHead(w, big) {
    const syl = (ROOTS[w.id] || {}).syl;
    return `<div class="wordhead">
      <div class="word-row">
        <div class="word${big ? "" : " sm"} ${syl ? "splitable" : ""}" id="theword"
             data-plain="${esc(w.en)}" data-syl="${esc(syl || w.en)}"
             title="${syl ? "点一下按音节分开" : ""}">${esc(w.en)}</div>
        <button class="spk" id="spk" title="发音">🔊</button></div>
      <div class="ipa"><span class="accent">美 🔊</span>${esc(ipaOf(w) || "")}</div>
      ${syl ? `<button class="sylbtn" id="sylBtn">切音节</button>` : ""}
    </div>`;
  }
  /** 把词头的「点一下切音节」接上。所有画了 wordHead 的地方都要调。*/
  function bindWordHead(w) {
    const el = $("#theword"); if (!el) return;
    let on = false;
    const toggle = () => {
      on = !on;
      el.textContent = on ? el.dataset.syl : el.dataset.plain;
      el.classList.toggle("issyl", on);
      const b = $("#sylBtn"); if (b) b.textContent = on ? "合起来" : "切音节";
    };
    if (el.classList.contains("splitable")) el.onclick = toggle;
    const b = $("#sylBtn"); if (b) b.onclick = toggle;
  }

  /* ============ 第 1 关：英文 → 四选一中文（选项答完显示它其实是哪个词）============ */
  function askRecognize(w) {
    let pool = WORDS.filter(x => x.cat === w.cat && x.id !== w.id);
    if (pool.length < 3) pool = pool.concat(WORDS.filter(x => x.cat !== w.cat && x.id !== w.id));
    const opts = shuffle(shuffle(pool).slice(0, 3).concat([w]));
    let peeked = false, t0 = Date.now(), locked = false;

    $("#app").innerHTML = `
      <div class="drill">
        ${drillBar("第 1 关 · 认词", w)}
        <div class="card word-card" id="wcard">
          <div class="tagrow">
            <span class="tg tg-cat" style="--c:${CATS[w.cat].color}">${CATS[w.cat].name}</span>
            <span class="tg tg-mode">${modeOf(w)}</span>
            ${hasHuman(w) ? '<span class="tg tg-hm">有真人音</span>' : ""}
          </div>
          <div class="dots-top">${dots(w.id)}</div>
          ${wordHead(w, true)}
          <div class="hint">先回想词义再选择 · 双击单词看答案</div>
        </div>
        <div class="opts" id="opts">
          ${opts.map(o => `<button class="optcard" data-id="${o.id}">
            <div class="oc-who">${esc(o.en)}</div>
            <div class="oc-pos">${esc(sensesOf(o)[0].pos)}</div>
            <div class="oc-zh">${esc(o.zh)}</div>
          </button>`).join("")}
        </div>
      </div>`;
    bindDrill(w); bindWordHead(w);
    $("#spk").onclick = e => { e.stopPropagation(); say(w); };
    say(w);
    const peek = () => { if (!peeked) { peeked = true; openModal(w); } };
    $("#wcard").ondblclick = peek;

    $$(".optcard").forEach(b => b.onclick = () => {
      if (locked) return; locked = true;
      const ok = b.dataset.id === w.id, secs = (Date.now() - t0) / 1000;
      // 答完把每个选项属于哪个词露出来 —— 这样你知道自己跟谁搞混了
      $$(".optcard").forEach(x => {
        x.classList.add("done");
        x.classList.add(x.dataset.id === w.id ? "right" : (x === b ? "wrong" : "dim"));
      });
      setTimeout(() => settle(w, ok, peeked ? "hard" : (ok && secs < 3 ? "easy" : ok ? "good" : "again"), 1), 520);
    });
  }

  /* ============ 第 2 关：看英文猜中文，释义打码，认识 / 模糊 / 忘记了 ============ */
  function askBlind(w) {
    const n = allSenses(w).length;
    $("#app").innerHTML = `
      <div class="drill">
        ${drillBar("第 2 关 · 看英文猜中文", w)}
        <div class="card word-card" id="wcard">
          <div class="tagrow">
            <span class="tg tg-cat" style="--c:${CATS[w.cat].color}">${CATS[w.cat].name}</span>
            <span class="tg tg-mode">${modeOf(w)}</span>
          </div>
          <div class="dots-top">${dots(w.id)}</div>
          ${wordHead(w, true)}
          <div class="blurbox">
            ${Array.from({ length: Math.min(3, n) }, (_, i) => `<div class="blurbar" style="width:${[190, 130, 160][i]}px"></div>`).join("")}
          </div>
          <div class="selfhint">瞬间想起词义，选「认识」<br>思考后想起词义，选「模糊」</div>
        </div>
        <div class="three">
          <button class="tri k" id="a2">认识<i></i></button>
          <button class="tri m" id="a1">模糊<i></i></button>
          <button class="tri f" id="a0">忘记了<i></i></button>
        </div>
      </div>`;
    bindDrill(w); bindWordHead(w);
    $("#spk").onclick = () => say(w); say(w);
    $("#wcard").ondblclick = () => openModal(w);
    $("#a2").onclick = () => reveal(w, true, "good", 2);
    $("#a1").onclick = () => reveal(w, true, "hard", 2);   // 模糊也算认出来了，但间隔给短的
    $("#a0").onclick = () => reveal(w, false, "again", 2);
  }

  /* ============ 第 3 关：看中文想英文 ============ */
  function askProduce(w) {
    const ss = allSenses(w).slice(0, 3);
    $("#app").innerHTML = `
      <div class="drill">
        ${drillBar("第 3 关 · 看中文想英文", w)}
        <div class="card prod-card" id="wcard">
          <div class="tagrow">
            <span class="tg tg-cat" style="--c:${CATS[w.cat].color}">${CATS[w.cat].name}</span>
            <span class="tg tg-mode">${modeOf(w)}</span>
          </div>
          <div class="dots-top">${dots(w.id)}</div>
          <div class="p-q">这个意思，英文怎么说？</div>
          <div class="senselist">
            ${ss.map(x => `<div class="m-sense"><span class="pos-tag">${esc(x.pos || "—")}</span><span>${esc(x.zh)}</span></div>`).join("")}
          </div>
          <div class="hint">出声说出来，再看答案</div>
        </div>
        <div class="opts"><button class="opt go" id="show">我说完了，看答案</button></div>
      </div>`;
    $("#back").onclick = () => { flushQueue(); renderHome(); };
    $("#dbStar").onclick = () => {
      const k = w.en.toLowerCase();
      if (inBook(k)) { removeFromBook(k); } else { addToBook({ k, en: w.en, zh: ss.map(x => x.zh).join("；"), ipa: ipaOf(w), ctx: w.ex.en }); }
      $("#dbStar").classList.toggle("on", inBook(k)); toast("生词本已更新");
    };
    $("#dbKnown").onclick = () => {
      S.streak[w.id] = NEED;
      S.cards[w.id] = window.SRS.grade(S.cards[w.id] || window.SRS.newCard(), "easy");
      Store.save(); nextWord();
    };
    bindWordHead(w);
    const go = () => produceAnswer(w);
    $("#show").onclick = go;
    document.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
  }

  function produceAnswer(w) {
    document.onkeydown = null;
    $("#app").innerHTML = `
      <div class="drill">
        ${drillBar("第 3 关 · 对照", w)}
        ${answerCard(w)}
        <div class="opts two"><button class="opt no" id="miss">没说对</button><button class="opt yes" id="hit">说对了</button></div>
      </div>`;
    bindDrill(w);
    bindAnswerCard(w);
    $("#hit").onclick = () => settle(w, true, "good", 3);
    $("#miss").onclick = () => settle(w, false, "again", 3);
  }

  /* 第 2 关的揭晓页 */
  function reveal(w, ok, rating, stage) {
    $("#app").innerHTML = `
      <div class="drill">
        ${drillBar("第 2 关 · 对照", w)}
        ${answerCard(w)}
        <div class="opts">
          <button class="opt go" id="next">继续 →</button>
          <button class="opt ghosty" id="more">举一反三 · 完整释义（${moreOf(w).length}）</button>
        </div>
      </div>`;
    bindDrill(w);
    bindAnswerCard(w);
    $("#more").onclick = () => openModal(w);
    $("#next").onclick = () => settle(w, ok, rating, stage);
    document.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); settle(w, ok, rating, stage); } };
  }

  /** 对照卡：所有释义（工作意思在前）+ 原话（目标词高亮）+ 搭配 */
  function answerCard(w) {
    const ss = allSenses(w);
    const hl = w.ex.en.replace(
      new RegExp("(" + w.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"),
      '<span class="hlw">$1</span>');
    return `<div class="card detail">
      <div class="tagrow">
        <span class="tg tg-cat" style="--c:${CATS[w.cat].color}">${CATS[w.cat].name}</span>
        <span class="tg tg-mode">${modeOf(w)}</span>
        ${tierOf(w.id) === TIER.HARD ? '<span class="tg tg-hard">顽固</span>' : (tierOf(w.id) === TIER.SOME ? '<span class="tg tg-some">偶尔错</span>' : "")}
      </div>
      <div class="dots-top">${dots(w.id)}</div>
      ${wordHead(w, false)}
      <div class="m-senses">
        ${ss.map(x => `<div class="m-sense ${x.own ? "own" : "dictish"}">
           <span class="pos-tag">${esc(x.pos || "—")}</span><span>${esc(x.zh)}</span>
           ${x.own ? '<em class="ownmark">工作里用这个</em>' : ""}</div>`).join("")}
      </div>
      <div class="ansline"><span class="lab">✅ 你的原话</span>${hl}
        <button class="spk sm" id="spkex">🔊</button>
        <span class="zh">${esc(w.ex.zh)}</span></div>
      ${rootBlock(w)}
      ${w.note ? `<div class="sec note"><div class="sl">注意</div><div class="sb">${esc(w.note)}</div></div>` : ""}
      ${moreOf(w).length ? `<div class="sec"><div class="sl">词组搭配</div>
        <div class="more-list">${moreOf(w).slice(0, 4).map(m => `
          <div class="more-row"><div class="mr-en">${esc(m.en)}<button class="spk xs" data-say="${esc(m.en)}">🔊</button></div>
            <div class="mr-zh">${esc(m.zh)}</div></div>`).join("")}</div></div>` : ""}
    </div>`;
  }
  function bindAnswerCard(w) {
    bindWordHead(w);
    $("#spk").onclick = () => say(w); say(w);
    const e = $("#spkex"); if (e) e.onclick = () => tts(w.ex.en, 0.88);
    $$("[data-say]").forEach(b => b.onclick = () => tts(b.dataset.say, 0.9));
    const rb = $("#rootBtn"); if (rb) rb.onclick = () => openModal(w);
  }

  /** 词根块：拆成片段 + 字面意思 + 同根词。没词源可讲的词不显示（不硬编）。*/
  function rootBlock(w, full) {
    const r = ROOTS[w.id];
    if (!r || !r.parts) return "";
    const kin = r.kin || [];
    const show = full ? kin : kin.slice(0, 3);
    return `<div class="sec rootsec">
      <div class="sl">词根拆解</div>
      <div class="rt-parts">${r.parts.map(pp => `
        <span class="rt-blk"><b>${esc(pp[0])}</b><i>${esc(pp[1])}</i></span>`).join('<span class="rt-plus">+</span>')}</div>
      ${r.lit ? `<div class="rt-lit">字面：${esc(r.lit)}</div>` : ""}
      ${show.length ? `<div class="rt-kin">
        <div class="rt-kh">同根词${!full && kin.length > show.length ? `（还有 ${kin.length - show.length} 个）` : ""}</div>
        ${show.map(k => `<div class="rt-krow"><b>${esc(k[0])}</b><span>${esc(k[1])}</span>
          <button class="spk xs" data-say="${esc(k[0])}">🔊</button></div>`).join("")}
      </div>` : ""}
    </div>`;
  }

  /** 该背 / 该理解 —— 抄成考英语那套标签的思路 */
  function modeOf(w) {
    if (allSenses(w).length > 2 || w.note) return "💡 该理解";
    return "🧠 该背";
  }

  /* 统一结算 */
  function settle(w, ok, rating, stage) {
    document.onkeydown = null;
    const id = w.id, before = streakOf(id);
    if (!S.streak) S.streak = {};
    if (!S.err) S.err = {};
    const e = S.err[id] || { w: 0, t: 0 };
    e.t++; if (!ok) e.w++;
    S.err[id] = e;
    S.streak[id] = ok ? Math.min(NEED, before + 1) : 0;   // 失手清零，从第 1 关重来
    if (!S.cards[id]) S.cards[id] = window.SRS.newCard();

    // 三关没过完之前别让 FSRS 把间隔排太远：第 1 关只测「认得出」，
    // 第 3 关测「说得出」，不该因为认得快就推迟九天再考产出。
    const laddering = S.streak[id] < NEED;
    const eff = (laddering && rating === "easy") ? "good" : rating;
    S.cards[id] = window.SRS.grade(S.cards[id], eff);
    if (laddering) {
      const cap = Date.now() + 2 * 86400000;
      if (new Date(S.cards[id].due).getTime() > cap) S.cards[id] = Object.assign({}, S.cards[id], { due: new Date(cap).toISOString() });
    }
    if (!S.seenWords.includes(id)) S.seenWords.push(id);
    wq.seen.add(id);
    wq.tries[id] = (wq.tries[id] || 0) + 1;
    // 复习模式才设放弃上限；新词按用户要求「一直循环刷到全对」，不放弃
    if (wq.kind === "review" && !ok && wq.tries[id] >= MAX_TRY && !wq.gaveUp.includes(id)) wq.gaveUp.push(id);
    Store.save();

    const now = streakOf(id);
    if (stage === 1 || (now >= NEED && before < NEED)) showAfter(w, ok, now, now >= NEED && before < NEED);
    else nextWord();
  }

  function showAfter(w, ok, now, justMastered) {
    $("#app").innerHTML = `
      <div class="drill">
        ${drillBar(`${ok ? "对" : "错"} · 连对 ${now}/${NEED}${justMastered ? " · 过关 🎉" : ""}`, w)}
        ${answerCard(w)}
        <div class="opts">
          <button class="opt go" id="next">继续 →</button>
          <button class="opt ghosty" id="more">举一反三（${moreOf(w).length}）</button>
        </div>
      </div>`;
    bindDrill(w);
    bindAnswerCard(w);
    $("#more").onclick = () => openModal(w);
    $("#next").onclick = nextWord;
    document.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); nextWord(); } };
  }

  function finishWords() {
    document.onkeydown = null;
    const isRev = wq.kind === "review";
    if (isRev) session.reviewQueue = []; else session.newDone = true;
    logMinutes();
    const goalArr = isRev ? wq.pool : wq.targets;
    const done = goalArr.filter(passed).length;
    const fillersPassed = isRev ? [] : session.fillerIds.filter(passed);
    const hard = Array.from(wq.seen).filter(id => tierOf(id) === TIER.HARD);
    $("#app").innerHTML = `
      <div class="finish">
        <div class="fi-tag">${isRev ? "复习完成" : "今日新词全部过关"}</div>
        <div class="fi-big">${done}<span>/${goalArr.length}</span></div>
        <div class="fi-sub">${isRev ? `过了 ${wq.seen.size} 个词` : `${done} 个词三关全对`}</div>
        ${fillersPassed.length ? `<div class="fi-note">穿插的新词里还顺手过了 ${fillersPassed.length} 个：${fillersPassed.map(id => byId[id].en).join("、")}</div>` : ""}
        ${wq.gaveUp.length ? `<div class="fi-hard">${wq.gaveUp.length} 个词问了 ${MAX_TRY} 次还没对，先放过：${wq.gaveUp.map(id => byId[id].en).join("、")}<br><span>硬磨没用，明天按曲线重排</span></div>` : ""}
        ${hard.length ? `<div class="fi-hard">${hard.length} 个顽固词：${hard.slice(0, 6).map(id => byId[id].en).join("、")}${hard.length > 6 ? "…" : ""}<br><span>下次复习排最前</span></div>` : ""}
        <div class="fi-note">${nextDueCount()} 个词明天到期。</div>
        <div class="btns">
          ${isRev && !session.newDone && session.newIds.length ? `<button class="primary" id="goNew">接着学新词 · ${session.newIds.length} 个</button>` : ""}
          ${!isRev && session.reviewQueue.length ? `<button class="primary" id="goReview">还有 ${session.reviewQueue.length} 个要复习</button>` : ""}
          ${session.modDone ? "" : `<button class="primary alt" id="goPhrase">短语模块 · ${session.module.name}</button>`}
          <button class="ghost" id="home">回首页</button>
        </div>
      </div>`;
    const gn = $("#goNew"); if (gn) gn.onclick = () => startWords("new");
    const gr = $("#goReview"); if (gr) gr.onclick = () => startWords("review");
    const gp = $("#goPhrase"); if (gp) gp.onclick = startPhrase;
    $("#home").onclick = renderHome;
  }

  /* ---------------- 短语模块：四步递进重构 ----------------
   * 为什么改掉原来的「看中文 → 出声说 → 自评」：
   *   自评不可靠（说完总觉得自己对），而且没有中间台阶，要么会要么不会。
   * 四步从有支撑到无支撑，中间加了一步【词块排序】：
   *   1 听读   看中英对照 + 发音，建立印象
   *   2 填空   挖掉 1-2 个关键词，选回去（可判对错）
   *   3 排序   句子打散成词块，按中文重组（可判对错 —— 这步是关键）
   *   4 裸说   只给中文，出声说
   * 第 3 步为什么关键：中文母语者说英语最容易错的是语序
   *   （「我明天之前给你」→ I'll get it to you by tomorrow，顺序完全不同），
   *   而排序能客观判定，不靠自评。难度正好卡在填空和裸说之间。
   * ---------------------------------------------------------------- */
  let pq = null;
  const PSTEPS = ["听读", "填空", "排序", "说出来"];

  /* 把句子切成 4-7 个待排序的块。
   * ⚠️ 三条实测教训：
   *   ① 块太大等于送答案（"it would arrive this week" 五个词一块，语序根本没练到），
   *      所以短句直接按【词】切，长句才合成 1-3 词的小块。
   *   ② 每一句都要能排序。原来切不出 3 块就跳过这一步，短句（Is this a typo?）
   *      永远练不到 —— 用户直接点出来了。按词切之后再短的句子也有 3-5 块。
   *   ③ 目标 4-7 块：少于 4 太容易，多于 7 在手机上点着烦。
   */
  const PFUNC = new Set(("a an the of to in on for at by with as from into and or is are was were be been am " +
    "do does did can could will would let i we you he she it they my our your his her their " +
    "this that these those not no up out off so if but than").split(" "));
  function chunkOf(en) {
    const words = en.trim().split(/\s+/);
    if (words.length <= 7) return words;              // 短句按词切，最直接
    // 长句：功能词并到后面的实词上，凑成小块
    let out = [], buf = [];
    for (const t of words) {
      const core = t.replace(/[^A-Za-z']/g, "").toLowerCase();
      buf.push(t);
      if (!PFUNC.has(core) || buf.length >= 3) { out.push(buf.join(" ")); buf = []; }
    }
    if (buf.length) { if (out.length) out[out.length - 1] += " " + buf.join(" "); else out = [buf.join(" ")]; }
    // 还是太多就合并，但【每次只合最短的相邻一对】。
    // 原来是两两对折，8 块一下砍成 4 块，砍过头 —— 会出现
    // "You said it would arrive" 五个词一块，等于把语序答案送出去。
    while (out.length > 7) {
      let best = 0, bestLen = Infinity;
      for (let k = 0; k < out.length - 1; k++) {
        const L = out[k].split(/ /).length + out[k + 1].split(/ /).length;
        if (L < bestLen) { bestLen = L; best = k; }
      }
      out.splice(best, 2, out[best] + " " + out[best + 1]);
    }
    return out;
  }

  /** 挖空：挑「有东西可学」的词，不是挑最长的。
   *  ⚠️ 原来的做法是挖最长的实词、干扰项随机凑，实测出来是
   *     「____ reply as soon as you can.」配 before/drop/anytime/Please
   *     —— 没有任何规则可学，答对也学不到东西。用户直接指出来了，是我偷懒。
   *
   *  现在按优先级挑：
   *    1) 句子里出现的核心词（我那 158 个）→ 干扰项从【同一分类】里挑，
   *       语义相近，必须真知道意思才选得对；答完把四个词的意思都列出来，
   *       一道题学四个词的区别。
   *    2) 有固定搭配规则的介词（align on / blocked on / by Friday …）
   *       → 干扰项是其他介词，答完讲清为什么只能用这个。
   *    3) 都不满足就跳过填空这一步，别硬出一道没营养的题。
   */

  /* 介词/搭配规则表：只收「真的有规则、讲得清」的 */
  const GAP_RULES = [
    { re: /\balign on\b/i, w: "on", opts: ["on", "with", "to", "in"],
      why: { on: "align on something = 就某件事达成一致，介词固定用 on", with: "align with 是「与…保持一致」，对象是人或方向，不是事项",
             to: "align to 偏「对准、校准」，不用于开会对齐", in: "align in 不成立" } },
    { re: /\bblocked on\b/i, w: "on", opts: ["on", "by", "at", "in"],
      why: { on: "blocked on X = 卡在 X 上，介词固定用 on", by: "blocked by 是「被谁挡住」，强调施动者",
             at: "at 用于地点/时间点", in: "in 不成立" } },
    { re: /\bby (Friday|Monday|tomorrow|end of today|month end)\b/i, w: "by", opts: ["by", "before", "until", "in"],
      why: { by: "by + 时间 = 不晚于那个时间点（含当天），谈 deadline 用它最不容易争",
             before: "before Friday 不含周五，容易吵起来", until: "until 是「一直到」，强调持续，不是截止",
             in: "in 后面接时长（in 3 days），不接具体某天" } },
    { re: /\bcheck with\b/i, w: "with", opts: ["with", "on", "to", "for"],
      why: { with: "check with 某人 = 跟某人确认", on: "check on 某事 = 去看看某事怎么样了，对象是事不是人",
             to: "check to 不成立", for: "check for 是「检查有没有」" } },
    { re: /\bwait(ing)? on\b/i, w: "on", opts: ["on", "for", "at", "to"],
      why: { on: "waiting on X = 在等 X 给结果（工作场景常用）", for: "waiting for 也对，但更偏「等人/等物到场」",
             at: "at 是地点", to: "to 不成立" } },
    { re: /\bout of (scope|stock)\b/i, w: "of", opts: ["of", "from", "in", "on"],
      why: { of: "out of + 名词 = 超出/没有了，固定搭配", from: "out from 不成立", in: "in 意思相反", on: "on 不成立" } },
    { re: /\bfollow up with\b/i, w: "with", opts: ["with", "on", "to", "at"],
      why: { with: "follow up with 某人 = 找某人跟进", on: "follow up on 某事 = 跟进某件事，对象是事",
             to: "follow up to 不成立", at: "at 不成立" } },
    { re: /\bhand (it|you) (over )?to\b/i, w: "to", opts: ["to", "for", "at", "with"],
      why: { to: "hand X to 某人 = 把 X 转给某人", for: "hand for 不成立", at: "at 不成立", with: "with 不成立" } },
    { re: /\bweek over week\b/i, w: "over", opts: ["over", "on", "by", "to"],
      why: { over: "week over week = 环比（周），固定说法，缩写 WoW", on: "on 不成立", by: "by 不成立", to: "week to week 是「每周变动」，不是环比" } },
  ];

  /** 返回 {kind, blankText, right, opts, why} 或 null */
  function gapOf(it) {
    // ① 句子里有核心词吗
    const hits = WORDS.filter(w => new RegExp("\\b" + w.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(it.en));
    if (hits.length) {
      const w = hits.sort((a, b) => b.en.length - a.en.length)[0];
      let sib = WORDS.filter(x => x.cat === w.cat && x.id !== w.id);
      if (sib.length < 3) sib = sib.concat(WORDS.filter(x => x.cat !== w.cat && x.id !== w.id));
      const opts = shuffle(shuffle(sib).slice(0, 3).concat([w]));
      const why = {};
      opts.forEach(o => { why[o.en] = (o.id === w.id ? "✅ " : "") + sensesOf(o)[0].pos + " " + o.zh; });
      return {
        kind: "word", right: w.en, opts: opts.map(o => o.en), why,
        blankText: it.en.replace(new RegExp("\\b" + w.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i"), "____"),
        note: `同一类里挑的四个词 · ${CATS[w.cat].name}`,
      };
    }
    // ② 有搭配规则吗
    for (const r of GAP_RULES) {
      if (!r.re.test(it.en)) continue;
      const re = new RegExp("\\b" + r.w + "\\b", "i");
      if (!re.test(it.en)) continue;
      return { kind: "prep", right: r.w, opts: shuffle(r.opts.slice()), why: r.why,
               blankText: it.en.replace(re, "____"), note: "介词搭配 · 这个有规则" };
    }
    return null;   // ③ 没料可讲就不出这道题
  }

  function startPhrase() {
    sessionStart = Date.now();
    const m = session.module;
    pq = {
      m, i: 0, step: 0,
      items: m.items.map((it, idx) => ({ it, idx, step: 0, ok: 0 })),
      done: 0,
    };
    nextPhrase();
  }

  function nextPhrase() {
    document.onkeydown = null;
    // 一句话走完 4 步再进下一句
    const cur = pq.items[pq.i];
    if (!cur) { finishPhrase(); return; }
    if (cur.step > 3) { pq.i++; pq.done++; nextPhrase(); return; }
    // 每一句都排序 —— 短句按词切，一样有 3-5 块可排
    const fn = [pStepRead, pStepBlank, pStepOrder, pStepSay][cur.step];
    fn(cur);
  }

  function pBar(cur, label) {
    const total = pq.items.length;
    return `<div class="drillbar">
      <button class="icon" id="back">←</button>
      <div class="grow">
        <div class="pg"><i style="width:${(pq.i + cur.step / 4) / total * 100}%"></i></div>
        <div class="stage"><span class="kindtag">${pq.m.name}</span>${label}
          <span class="pstep">${PSTEPS.map((s, k) => `<i class="${k < cur.step ? "on" : k === cur.step ? "cur" : ""}"></i>`).join("")}</span>
        </div>
      </div>
      <div class="goal"><b>${pq.i + 1}</b>/${total}</div>
    </div>`;
  }
  function pBack() { $("#back").onclick = renderHome; }

  /* 第 1 步 听读 */
  function pStepRead(cur) {
    const it = cur.it;
    $("#app").innerHTML = `
      <div class="drill">
        ${pBar(cur, "第 1 步 · 听读")}
        <div class="card phrase-card">
          <div class="p-zh sm">${esc(it.zh)}</div>
          <div class="p-en">${tokline(it.en)}<button class="spk" id="spk">🔊</button></div>
          <div class="p-slow"><button class="pillbtn" id="slow">🐢 慢速</button></div>
          ${it.tip ? `<div class="p-tip">${esc(it.tip)}</div>` : ""}
          <div class="p-lk">跟着读一遍 · 双击任意词看意思</div>
        </div>
        <div class="opts"><button class="opt go" id="next">读完了 →</button></div>
      </div>`;
    pBack();
    $("#spk").onclick = () => tts(it.en, 0.9);
    $("#slow").onclick = () => tts(it.en, 0.62);
    bindTokens(document, it.en);
    tts(it.en, 0.9);
    const go = () => { cur.step = 1; nextPhrase(); };
    $("#next").onclick = go;
    document.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
  }

  /* 第 2 步 填空 —— 有规则可学，而且答完解释每一个选项 */
  function pStepBlank(cur) {
    const it = cur.it, g = gapOf(it);
    if (!g) { cur.step = 2; nextPhrase(); return; }   // 没料可讲就跳过
    let locked = false;
    $("#app").innerHTML = `
      <div class="drill">
        ${pBar(cur, "第 2 步 · 填空")}
        <div class="card phrase-card">
          <div class="p-zh sm">${esc(it.zh)}</div>
          <div class="p-en blanked">${esc(g.blankText)}</div>
          <div class="p-lk">${esc(g.note)}</div>
          <div class="whybox" id="whybox"></div>
        </div>
        <div class="opts grid2" id="opts">
          ${g.opts.map(o => `<button class="opt wordopt" data-w="${esc(o)}">${esc(o)}</button>`).join("")}
        </div>
      </div>`;
    pBack();
    $$(".wordopt").forEach(btn => btn.onclick = () => {
      if (locked) return; locked = true;
      const ok = btn.dataset.w.toLowerCase() === g.right.toLowerCase();
      $$(".wordopt").forEach(x => x.classList.add(
        x.dataset.w.toLowerCase() === g.right.toLowerCase() ? "right" : (x === btn ? "wrong" : "dim")));
      $(".p-en").innerHTML = esc(it.en).replace(esc(g.right), `<span class="hlw">${esc(g.right)}</span>`);
      // 逐项解释 —— 这一步才是让填空有营养的地方
      $("#whybox").innerHTML = `<div class="wb-h">四个选项分别是什么</div>` +
        g.opts.map(o => {
          const isR = o.toLowerCase() === g.right.toLowerCase();
          return `<div class="wb-row ${isR ? "r" : (o === btn.dataset.w ? "x" : "")}">
            <b>${esc(o)}</b><span>${esc(g.why[o] || "")}</span></div>`;
        }).join("");
      tts(it.en, 0.9);
      if (ok) cur.ok++;
      const nx = document.createElement("button");
      nx.className = "opt go"; nx.textContent = "继续 →";
      nx.onclick = () => { cur.step = 2; nextPhrase(); };
      $("#opts").appendChild(nx);
      document.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cur.step = 2; nextPhrase(); } };
    });
  }

  /* 第 3 步 排序（核心：练语序，可判对错） */
  function pStepOrder(cur) {
    const it = cur.it, right = chunkOf(it.en);
    // 混进 1-2 个干扰词块（多邻国的做法：词库里放「最近学过、你还没把握」的词）。
    // ⚠️ 不加干扰的话这题就是纯排列组合，把所有块用完必然拼出答案，能蒙。
    const others = [];
    pq.m.items.forEach((x, k) => { if (k !== cur.idx) chunkOf(x.en).forEach(c => others.push(c)); });
    // 干扰块的长度要跟正确块差不多，不然一眼就看出哪个是多余的
    const avgLen = right.reduce((a, c) => a + c.split(/\s+/).length, 0) / right.length;
    const rl = right.map(c => c.toLowerCase());
    const decoyPool = others.filter(c => !rl.includes(c.toLowerCase())
      && Math.abs(c.split(/\s+/).length - avgLen) <= 1);
    const decoys = shuffle(decoyPool).slice(0, right.length >= 6 ? 2 : 1);
    const bank = shuffle(right.concat(decoys));
    let picked = [];
    $("#app").innerHTML = `
      <div class="drill">
        ${pBar(cur, "第 3 步 · 排序")}
        <div class="card phrase-card">
          <div class="p-zh">${esc(it.zh)}</div>
          <div class="p-lk">把下面的词块拼成英文 · 有用不上的干扰块</div>
          <div class="slots" id="slots"></div>
        </div>
        <div class="bank" id="bank">
          ${bank.map((c, i) => `<button class="ck" data-i="${i}">${esc(c)}</button>`).join("")}
        </div>
        <div class="opts two">
          <button class="opt no" id="undo">退一个</button>
          <button class="opt yes" id="check" disabled>对答案</button>
        </div>
      </div>`;
    pBack();
    const slots = $("#slots"), chk = $("#check");
    const draw = () => {
      slots.innerHTML = picked.length
        ? picked.map(p => `<span class="ck placed">${esc(bank[p])}</span>`).join("")
        : `<span class="slot-empty">点下面的词块，按顺序拼</span>`;
      // ⚠️ 只要放了块就能提交。原来写的是「必须正好等于正确块数」，
      //    结果用户把干扰块也点上（4 块 vs 正确 3 块）时按钮又被禁掉，直接卡死出不去。
      chk.disabled = picked.length === 0;
      $$(".ck", $("#bank")).forEach((b, i) => b.classList.toggle("used", picked.includes(i)));
    };
    draw();
    $$(".ck", $("#bank")).forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (picked.includes(i)) return;
      picked.push(i); draw();
    });
    $("#undo").onclick = () => { picked.pop(); draw(); };
    chk.onclick = () => {
      const mine = picked.map(p => bank[p]);
      const ok = mine.join(" ") === right.join(" ");
      const countOff = mine.length !== right.length;
      if (ok) cur.ok++;
      slots.innerHTML = mine.map((c, k) => `<span class="ck placed ${c === right[k] ? "good" : "bad"}">${esc(c)}</span>`).join("");
      const box = document.createElement("div");
      box.className = "ordres " + (ok ? "ok" : "no");
      box.innerHTML = ok ? "✅ 顺序对了"
        : (countOff ? `❌ 用了 ${mine.length} 块，答案是 ${right.length} 块<br>` : "❌ 顺序不对<br>")
          + `正确：<b>${esc(right.join(" "))}</b>`
          + (decoys.length ? `<br><span class="decoy-note">${decoys.length} 个干扰块用不上：${decoys.map(esc).join(" / ")}</span>` : "");
      $(".phrase-card").appendChild(box);
      chk.disabled = true; $("#undo").disabled = true;
      tts(it.en, 0.88);
      setTimeout(() => { cur.step = 3; nextPhrase(); }, ok ? 1100 : 2600);
    };
  }

  /* 第 4 步 裸说 */
  function pStepSay(cur) {
    const it = cur.it;
    $("#app").innerHTML = `
      <div class="drill">
        ${pBar(cur, "第 4 步 · 说出来")}
        <div class="card phrase-card">
          <div class="p-zh">${esc(it.zh)}</div>
          <div class="p-do">不看答案，出声说一遍</div>
        </div>
        <div class="opts"><button class="opt go" id="reveal">我说完了，看答案</button></div>
      </div>`;
    pBack();
    const go = () => pSayCheck(cur);
    $("#reveal").onclick = go;
    document.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
  }
  function pSayCheck(cur) {
    const it = cur.it;
    document.onkeydown = null;
    $("#app").innerHTML = `
      <div class="drill">
        ${pBar(cur, "第 4 步 · 对照")}
        <div class="card phrase-card open">
          <div class="p-zh sm">${esc(it.zh)}</div>
          <div class="p-en">${tokline(it.en)}<button class="spk" id="spk">🔊</button></div>
          <div class="p-slow"><button class="pillbtn" id="slow">🐢 慢速</button></div>
          ${it.tip ? `<div class="p-tip">${esc(it.tip)}</div>` : ""}
        </div>
        <div class="opts two"><button class="opt no" id="stuck">没说对</button><button class="opt yes" id="said">说对了</button></div>
      </div>`;
    pBack();
    $("#spk").onclick = () => tts(it.en, 0.9);
    $("#slow").onclick = () => tts(it.en, 0.62);
    bindTokens(document, it.en);
    tts(it.en, 0.9);
    const mark = ok => {
      const pid = pq.m.id + "#" + cur.idx;
      if (!S.cards[pid]) S.cards[pid] = window.SRS.newCard();
      // 四步里对了几步，决定这条句子的评分：全对 good，中间错过 hard，最后一步没说对 again
      const rating = !ok ? "again" : (cur.ok >= 2 ? "good" : "hard");
      S.cards[pid] = window.SRS.grade(S.cards[pid], rating);
      if (ok) cur.ok++;
      Store.save();
      cur.step = 4; nextPhrase();
    };
    $("#said").onclick = () => mark(true);
    $("#stuck").onclick = () => mark(false);
  }

  function finishPhrase() {
    document.onkeydown = null;
    session.modDone = true;
    if (!S.doneModules.includes(pq.m.id)) S.doneModules.push(pq.m.id);
    S.moduleCursor++;
    logMinutes(); Store.save(true);
    const total = pq.items.length;
    const full = pq.items.filter(x => x.ok >= 3).length;
    const nLeft = session.newDone ? 0 : session.newIds.filter(id => streakOf(id) < NEED).length;
    $("#app").innerHTML = `
      <div class="finish">
        <div class="fi-tag">短语模块完成</div>
        <div class="fi-big">${full}<span>/${total}</span></div>
        <div class="fi-sub">${pq.m.name} · ${full} 句四步全对</div>
        <div class="fi-note">明天的模块：${MODULES[S.moduleCursor % MODULES.length].name}</div>
        <div class="btns">
          ${session.reviewQueue.length ? `<button class="primary" id="goReview">还有 ${session.reviewQueue.length} 个要复习</button>` : ""}
          ${nLeft ? `<button class="primary muted" id="goNew">还有 ${nLeft} 个新词</button>` : ""}
          <button class="ghost" id="home">回首页</button>
        </div>
      </div>`;
    const gr = $("#goReview"); if (gr) gr.onclick = () => startWords("review");
    const gn = $("#goNew"); if (gn) gn.onclick = () => startWords("new");
    $("#home").onclick = renderHome;
  }

  /* ---------------- 词库浏览 ---------------- */
  function renderBook(cat) {
    const cats = Object.keys(CATS);
    // ⚠️ 这个函数既被当点击回调（参数是 Event），又被内部按分类调用（参数是字符串）。
    //    不做这层判断，Event 会被当成分类名，筛出来一个词都没有 —— 实测踩过。
    const cur = (typeof cat === "string" && CATS[cat]) ? cat : cats[0];
    const list = WORDS.filter(w => w.cat === cur);
    $("#app").innerHTML = `
      <div class="page">
        <div class="bar"><button class="icon" id="back">←</button><div class="verdict">词库 · ${WORDS.length} 词</div><div class="cnt"></div></div>
        <div class="chips">${cats.map(c => `<button class="chip2 ${c === cur ? "on" : ""}" data-c="${c}" style="--c:${CATS[c].color}">${CATS[c].name}</button>`).join("")}</div>
        <div class="wlist">
          ${list.map(w => `<button class="wrow" data-id="${w.id}">
            <span class="wr-en">${esc(w.en)}</span>
            <span class="wr-ipa">${esc(ipaOf(w))}</span>
            <span class="wr-zh">${esc(w.zh)}</span>
            ${hasHuman(w) ? '<span class="wr-hm">真人</span>' : ""}
            ${dots(w.id)}
          </button>`).join("")}
        </div>
      </div>`;
    $("#back").onclick = renderHome;
    $$(".chip2").forEach(b => b.onclick = () => renderBook(b.dataset.c));
    $$(".wrow").forEach(b => b.onclick = () => openModal(byId[b.dataset.id]));
  }

  /* ---------------- 统计 ---------------- */
  function renderStats() {
    const lv = [0, 0, 0, 0];
    S.seenWords.forEach(id => lv[Math.min(3, streakOf(id))]++);
    const notYet = WORDS.length - S.seenWords.length;
    const byCat = {}; Object.keys(CATS).forEach(c => byCat[c] = { all: 0, ok: 0 });
    WORDS.forEach(w => { byCat[w.cat].all++; if (isMastered(w.id)) byCat[w.cat].ok++; });
    const last14 = S.log.slice(-14);
    const maxN = Math.max(1, ...last14.map(d => (d.newWords || 0) + (d.reviews || 0)));
    $("#app").innerHTML = `
      <div class="page">
        <div class="bar"><button class="icon" id="back">←</button><div class="verdict">统计</div><div class="cnt"></div></div>
        <div class="sec-h">连对次数分布</div>
        <div class="lvbar">
          <i class="l3" style="flex:${lv[3]}"></i><i class="l2" style="flex:${lv[2]}"></i>
          <i class="l1" style="flex:${lv[1]}"></i><i class="l0" style="flex:${lv[0] + notYet}"></i>
        </div>
        <div class="lgd">
          <span><i class="l3"></i>连对 3 次 · 已掌握 ${lv[3]}</span>
          <span><i class="l2"></i>连对 2 次 ${lv[2]}</span>
          <span><i class="l1"></i>连对 1 次 ${lv[1]}</span>
          <span><i class="l0"></i>归零或没学 ${lv[0] + notYet}</span>
        </div>
        <div class="sec-h">最近 14 天</div>
        ${last14.length ? `<div class="spark">${last14.map(d => `<i style="height:${Math.max(6, ((d.newWords || 0) + (d.reviews || 0)) / maxN * 100)}%" title="${d.date}"></i>`).join("")}</div>` : `<div class="empty">还没有记录</div>`}
        <div class="sec-h">经常做错 vs 偶尔做错</div>
        ${(() => {
          const g = { hard: [], some: [], clean: [] };
          S.seenWords.forEach(id => g[tierOf(id)].push(id));
          const row = (k, title, note) => {
            const ids = g[k];
            if (!ids.length) return `<div class="trow z"><span class="tier ${k}">${title} 0</span><span class="trow-n">${note}</span></div>`;
            const sorted = ids.slice().sort((a, b) => errOf(b).w - errOf(a).w);
            return `<div class="trow">
              <div class="trow-h"><span class="tier ${k}">${title} ${ids.length}</span><span class="trow-n">${note}</span></div>
              <div class="tchips">${sorted.slice(0, 24).map(id => `<button class="tchip" data-id="${id}">${esc(byId[id].en)}<i>${errOf(id).w}</i></button>`).join("")}${sorted.length > 24 ? `<span class="tmore">+${sorted.length - 24}</span>` : ""}</div>
            </div>`;
          };
          return row("hard", "顽固", "错过 3 次以上，或错 2 次且 FSRS 判定难度高") +
                 row("some", "偶尔错", "错过 1-2 次") +
                 row("clean", "干净", "一次没错过");
        })()}
        <div class="hintline">数字是这个词错过几次。顽固词会自动排在每次复习的最前面。</div>

        <div class="sec-h">分类掌握进度</div>
        <div class="cats">${Object.keys(CATS).map(c => `<div class="crow">
          <span class="cn" style="--c:${CATS[c].color}">${CATS[c].name}</span>
          <span class="cbar"><i style="width:${byCat[c].ok / byCat[c].all * 100}%;background:${CATS[c].color}"></i></span>
          <span class="cf">${byCat[c].ok}/${byCat[c].all}</span></div>`).join("")}</div>
        <div class="sec-h">短语模块</div>
        <div class="mods">${MODULES.map(m => `<span class="mchip ${S.doneModules.includes(m.id) ? "on" : ""}">${m.name}</span>`).join("")}</div>
      </div>`;
    $("#back").onclick = renderHome;
    $$(".tchip").forEach(b => b.onclick = () => openModal(byId[b.dataset.id]));
  }

  /* ---------------- 设置 ---------------- */
  function renderSettings() {
    loadVoices();
    const n = S.settings.newPerDay;
    $("#app").innerHTML = `
      <div class="page">
        <div class="bar"><button class="icon" id="back">←</button><div class="verdict">设置与备份</div><div class="cnt"></div></div>

        <div class="sec-h">每天学多少新词</div>
        <div class="numrow">
          <button class="nbtn" id="minus">−</button>
          <input id="num" type="number" min="1" max="60" step="1" value="${n}" inputmode="numeric">
          <button class="nbtn" id="plus">+</button>
        </div>
        <input id="slider" type="range" min="1" max="60" step="1" value="${n}">
        <div class="hintline" id="est"></div>

        <div class="sec-h">过关节奏</div>
        <div class="hintline">一个词要<b>三关全对</b>才算过关：认词 → 看英文猜中文 → 看中文想英文。<br>
          任何一关失手就清零、从第 1 关重来。今日新词没全部过关，这一轮不会结束 ——
          顺序会打散、不连着出同一个词，中间还穿插几个别的新词。</div>

        <div class="sec-h">发音用哪个音源</div>
        <div class="seg" id="vsrc">
          <button data-v="tts" class="${S.settings.voiceSource !== "human" ? "on" : ""}">系统合成音</button>
          <button data-v="human" class="${S.settings.voiceSource === "human" ? "on" : ""}">真人录音</button>
        </div>
        <div class="hintline">默认合成音。真人录音是 Wikimedia 志愿者录的，${Object.keys(AUDIO).length} 个词有，
          但口音很杂（英音／印度音／澳音都有），练发音反而是干扰。<br>
          切到真人后，没有录音的词还是走合成。单词弹窗里随时能单点「真人」听一下。</div>
        <select id="voice">
          <option value="">合成音：自动挑一个美音</option>
          ${voices.map(v => `<option value="${esc(v.name)}" ${S.settings.voice === v.name ? "selected" : ""}>${esc(v.name)} (${v.lang})</option>`).join("")}
        </select>
        <div class="sec-h">合成音语速</div>
        <input id="rate" type="range" min="0.6" max="1.15" step="0.01" value="${S.settings.rate || 0.92}">
        <div class="btns row">
          <button class="ghost" id="testHuman">试听真人录音</button>
          <button class="ghost" id="testTts">试听合成音</button>
        </div>

        <div class="sec-h">进度备份</div>
        <div class="hintline">自动存浏览器 + 每隔几秒备份到本文件夹 backups/。空进度不会覆盖好备份。</div>
        <div class="btns row">
          <button class="ghost" id="exp">导出到文件</button>
          <label class="ghost as-btn">导入文件<input type="file" id="imp" accept=".json" hidden></label>
        </div>

        <div class="sec-h danger">危险操作</div>
        <button class="ghost danger" id="rst">清空全部进度</button>
        <div id="msg" class="msg"></div>
      </div>`;
    $("#back").onclick = renderHome;

    const num = $("#num"), sl = $("#slider"), est = $("#est");
    const showEst = v => {
      // 一个新词要过 3 关，粗算每关 12 秒；复习按当前到期量算
      const mins = Math.round((v * 3 * 12 + session.reviewIds.length * 12 + 10 * 15) / 60);
      est.innerHTML = `新词 <b>${v}</b> 个 → 连上今天的复习和一个短语模块，大约 <b>${mins}</b> 分钟。`;
    };
    const setN = v => {
      v = Math.max(1, Math.min(60, parseInt(v, 10) || 1));
      num.value = v; sl.value = v;
      S.settings.newPerDay = v; Store.save(); session = null; session = buildSession(); showEst(v);
    };
    showEst(n);
    num.oninput = () => setN(num.value);
    sl.oninput = () => setN(sl.value);
    $("#minus").onclick = () => setN(+num.value - 1);
    $("#plus").onclick = () => setN(+num.value + 1);

    $$("#vsrc button").forEach(b => b.onclick = () => {
      S.settings.voiceSource = b.dataset.v; Store.save(true); renderSettings();
    });
    $("#voice").onchange = e => { S.settings.voice = e.target.value; Store.save(true); };
    $("#rate").oninput = e => { S.settings.rate = +e.target.value; Store.save(); };
    $("#testTts").onclick = () => tts("delivery time and refund rate", S.settings.rate);
    $("#testHuman").onclick = () => {
      const id = Object.keys(AUDIO)[0];
      if (!id) { $("#msg").textContent = "没有真人录音文件"; return; }
      say(byId[id]);
      $("#msg").textContent = "播的是：" + byId[id].en + "（真人）";
      $("#msg").className = "msg ok";
    };
    $("#exp").onclick = () => Store.exportFile();
    $("#imp").onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      Store.importFile(f, (ok, m) => {
        $("#msg").textContent = m; $("#msg").className = "msg " + (ok ? "ok" : "bad");
        if (ok) { S = Store.get(); session = null; }
      });
    };
    $("#rst").onclick = () => {
      if (!confirm("清空全部进度？导出的文件不受影响。")) return;
      Store.reset(); S = Store.get(); session = null; renderHome();
    };
  }

  /* ---------------- 记录 ---------------- */
  function logMinutes() {
    const mins = Math.min(90, (Date.now() - sessionStart) / 60000);
    const d = todayStr();
    let row = S.log.find(x => x.date === d);
    if (!row) { row = { date: d, newWords: 0, reviews: 0, modules: 0, minutes: 0 }; S.log.push(row); }
    row.minutes += mins;
    S.totalMinutes += mins;
    row.newWords = Math.max(row.newWords || 0, session.newIds.length);
    row.reviews = Math.max(row.reviews || 0, session.reviewIds.length);
    if (session.modDone) row.modules = 1;
    Store.save();
  }
  function rollDate() {
    const d = todayStr();
    if (S.lastDate === d) return;
    const y = new Date(Date.now() - 86400000).toLocaleDateString("sv");
    S.streakDays = (S.lastDate === y) ? (S.streakDays || 0) + 1 : 1;
    S.lastDate = d; Store.save(true);
  }

  /* ---------------- 启动 ---------------- */
  (async function boot() {
    S = Store.load();
    const r = await Store.restoreIfBetter();
    S = Store.get();
    if (!S.streak) S.streak = {};
    if (S.streakDays == null) S.streakDays = S.streak_days || 0;
    rollDate();
    initTheme();
    session = buildSession();
    renderHome();
    if (r && r.restored) {
      const t = document.createElement("div");
      t.className = "toast"; t.textContent = "已从硬盘备份恢复进度（" + r.savedAt + "）";
      document.body.appendChild(t); setTimeout(() => t.remove(), 4000);
    }
  })();
})();
