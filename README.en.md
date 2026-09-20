<div align="center">

# Study Apps · 自用学习 App 合集

**Offline-first, zero-build web apps for self-study: AI tutors for China's adult college-entrance exam (English / Politics / Advanced Math II), NCE1 grammar drills, and workplace English — with spaced repetition and on-disk progress backups.**

[中文](README.md) | English

![Vanilla JS](https://img.shields.io/badge/vanilla-HTML%20%2B%20CSS%20%2B%20JS-F7DF1E?logo=javascript&logoColor=black)
![No build step](https://img.shields.io/badge/build-none-brightgreen)
![Offline first](https://img.shields.io/badge/offline-first-blue)
![SRS](https://img.shields.io/badge/review-SRS%20%2F%20FSRS-purple)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

<img src="docs/screenshots/chengkao-english.png" width="49%" alt="English strategy board"> <img src="docs/screenshots/chengkao-math.png" width="49%" alt="Math tutor">
<img src="docs/screenshots/nce1-grammar.png" width="49%" alt="NCE1 grammar drills"> <img src="docs/screenshots/work-english.png" width="49%" alt="Workplace English">

</div>

## What's inside

| App | Target | Highlights | Port |
|---|---|---|---|
| [`chengkao-english/`](chengkao-english/) | Adult college-entrance English, 150 pts, goal 90+ (exam 2026-10-17) | Two UIs on one question bank: a **strategy board** (per-section scoreboard, fixed answering order, mandatory error attribution, only 7 grammar points) and a 28-chapter tutor; 70 "knowledge frames" that render explanations graphically; essay templates fade out as you write more | 8899 |
| [`chengkao-politics/`](chengkao-politics/) | Adult college-entrance Politics, goal 90+ | Placement test → diagnostic report → auto 3-phase plan; past papers 2018–2025 + current affairs | 8000 |
| [`chengkao-math/`](chengkao-math/) | Advanced Math II from zero, goal 60+ | Local KaTeX; placement (from "never saw a square root" upwards); shortest path to 60 through must-score chapters; double-write saves | 8011 |
| [`nce1-grammar/`](nce1-grammar/) | New Concept English 1 grammar, mapped to Cambridge grammar | Whole-book cheatsheet + per-lesson drills; today's mistakes view; auto backup on every submit | 8902 |
| [`work-english/`](work-english/) | Workplace English for cross-border e-commerce / TikTok ads, 20 min a day | Vocabulary mined from real Feishu conversations; FSRS retention orders the review queue; "stubborn / occasional / clean" tiers | see `说明.md` |

Common design:

- **Pure HTML / CSS / JS**, no bundler. Double-click a launcher and it runs.
- **Works offline**; only the AI features (explain / grade / diagnose) need a network and your own API key, which stays in the browser.
- **Progress never lost**: `server.py` serves the app on a pinned `localhost` port and every submit POSTs progress to `backups/` on disk (not in the repo).
- **Spaced repetition**: mistakes are scheduled with SRS / FSRS; review first, then learn new.

## Who is this for

- Working adults preparing for China's 成考专升本 (adult college-entrance, junior-college → bachelor) exams with weak foundations and ~30 minutes a day.
- Adults relearning English grammar from New Concept English 1.
- People in cross-border e-commerce who want a daily dose of job-specific English.
- Developers who want a "static front-end + local backup server + SRS" skeleton to copy.

## Run

Each folder has a `启动XX.command` (macOS). It finds `python3`, runs `server.py`, and opens the browser. First launch may show "unidentified developer": right-click → Open.

Or manually:

```bash
cd chengkao-math && python3 server.py      # then open http://localhost:8011
```

> Don't open `index.html` directly: `file://` and `localhost` are separate storage origins and browsers clear `file://` storage easily. Ports are pinned on purpose.

## AI backend

Enter an API key once in Settings. Default is the Anthropic Messages API format; daily tasks use `claude-haiku-4-5`, grading / diagnosis use `claude-sonnet-5`. The base URL is configurable for any compatible proxy.

## Editing question banks

Banks are plain data files such as `js/questions-*.js`. After editing, run `node --check js/*.js`; bump the `?v=N` on script tags in `index.html` to bust the cache. Each app's `README.md` / `HANDOFF.md` (Chinese) documents its data structures and known pitfalls.

## Contact

- WeChat: **Anyway77777777**
- GitHub: [@njh20030605-code](https://github.com/njh20030605-code)

## License

MIT — see [LICENSE](LICENSE).
