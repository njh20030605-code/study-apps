#!/bin/bash
# 把桌面上各学习 App 的最新源码同步进本仓库（排除进度备份 / 存档 / .DS_Store）。
set -euo pipefail
R="$(cd "$(dirname "$0")" && pwd)"; D="$HOME/Desktop"
X=(--exclude .DS_Store --exclude '._*' --exclude backups --exclude '*.bak*' --exclude .git --exclude README.md)
RS() { rsync -a --delete "${X[@]}" "$@"; }
RS --exclude '*.json' "$D/政治/" "$R/chengkao-politics/"
RS "$D/高数/" "$R/chengkao-math/"
RS "$D/剑桥语法练习/" "$R/nce1-grammar/"
RS "$D/工作英语/" "$R/work-english/"
RS "$D/新版-英语ai/" "$R/chengkao-english/"
cd "$R" && git status --short
