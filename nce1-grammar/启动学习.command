#!/bin/bash
# 双击这个文件即可开始做题。
# 它会启动本地服务器并自动打开浏览器；每次点「提交」后进度会自动备份到 backups/ 目录。
cd "$(dirname "$0")" || exit 1

# 找一个可用的 python3
PY=""
for c in python3 /usr/bin/python3 /usr/local/bin/python3 /opt/homebrew/bin/python3; do
  if command -v "$c" >/dev/null 2>&1; then PY="$c"; break; fi
done

if [ -z "$PY" ]; then
  echo "❌ 没找到 python3。"
  echo "   Mac 一般自带；若确实没有，请在终端运行：xcode-select --install"
  echo ""
  echo "（按回车键关闭窗口）"
  read -r _
  exit 1
fi

clear
exec "$PY" server.py
