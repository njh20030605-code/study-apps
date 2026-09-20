#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 成考高数 AI 私教 · 本地服务器 + 自动备份到硬盘
# 由「启动高数App.command」调用。网页每次存档会 POST 到 /api/backup，
# 自动写入 backups/latest.json + 时间戳快照（留最近 30 份）。
# 启动时若浏览器 localStorage 为空、而硬盘有备份 → 网页会自动恢复。
import http.server, socketserver, json, os, datetime, webbrowser

DIR = os.path.dirname(os.path.abspath(__file__))
BK = os.path.join(DIR, 'backups')
os.makedirs(BK, exist_ok=True)
LATEST = os.path.join(BK, 'latest.json')
PORT = 8011

def weight(raw):
    """存档里有多少真进度（题目记录 + 读完的课 + 打卡）。用于空进度守卫。"""
    try:
        s = json.loads(raw)
        return len(s.get('questions') or {}) + len(s.get('lessonsDone') or []) + len(s.get('checkins') or [])
    except Exception:
        return 0

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=DIR, **k)

    def end_headers(self):
        # 本地小应用不缓存静态文件，避免改了 js 还加载旧缓存
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def _json(self, code, body):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body if isinstance(body, bytes) else body.encode('utf-8'))

    def do_GET(self):
        if self.path == '/api/backup/latest':
            if os.path.exists(LATEST):
                with open(LATEST, 'rb') as f:
                    return self._json(200, f.read())
            return self._json(200, b'null')
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/backup':
            n = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(n)
            new_w = weight(body)
            old_w = 0
            if os.path.exists(LATEST):
                try:
                    with open(LATEST, 'rb') as f:
                        old_w = weight(f.read())
                except Exception:
                    old_w = 0
            # 空进度守卫：不许用"空的/更空的"覆盖已有的好备份
            if new_w == 0 and old_w > 0:
                return self._json(200, b'{"skipped":"empty"}')
            with open(LATEST, 'wb') as f:
                f.write(body)
            ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
            try:
                with open(os.path.join(BK, 'save_%s.json' % ts), 'wb') as f:
                    f.write(body)
                snaps = sorted(x for x in os.listdir(BK) if x.startswith('save_'))
                for old in snaps[:-30]:
                    os.remove(os.path.join(BK, old))
            except Exception:
                pass
            return self._json(200, b'{"ok":true}')
        return self._json(404, b'{"error":"not found"}')

    def log_message(self, *a):
        pass  # 静默，别刷屏

port = PORT
httpd = None
for p in range(PORT, PORT + 6):
    try:
        httpd = socketserver.TCPServer(('', p), Handler)
        port = p
        break
    except OSError:
        continue
if httpd is None:
    print('端口都被占用了，先关掉其它 App 窗口再试。')
    raise SystemExit(1)

url = 'http://localhost:%d/index.html' % port
print('成考高数 AI 私教 已启动：%s' % url)
print('（学习时别关这个窗口；进度会自动备份到 backups/ 文件夹）')
webbrowser.open(url)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
