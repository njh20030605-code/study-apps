#!/bin/bash
# ============================================================
# 双击这个文件启动"成考政治 AI 私教"
# 用本地小服务器(localhost)打开 App：
#   - 存储稳（不会被 Chrome 更新清掉进度）
#   - 禁用缓存（App 更新后刷新页面立即生效，不会看到旧版本）
# 用完直接关掉这个黑色终端窗口即可。
# ============================================================
cd "$(dirname "$0")"
PORT=8009
if lsof -i :$PORT >/dev/null 2>&1; then PORT=8010; fi
echo "正在启动 成考政治 AI 私教 ..."
echo "（学习时请勿关闭本窗口；用完关掉即可）"

# 带"禁止缓存"响应头的小服务器：保证每次刷新都拿到最新代码
python3 - "$PORT" <<'PYEOF' &
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()
    def log_message(self, *args):
        pass  # 安静点，别刷屏

HTTPServer(("127.0.0.1", int(sys.argv[1])), NoCacheHandler).serve_forever()
PYEOF
SRV=$!
sleep 1
open "http://localhost:$PORT/index.html"
echo ""
echo "已在浏览器打开：http://localhost:$PORT/index.html"
echo "按 Ctrl+C 或直接关闭本窗口即可停止。"
wait $SRV
