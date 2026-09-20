#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
本地服务器 + 自动备份
=====================
为什么要它：
  1) 用 file:// 直接双击打开网页时，Chrome 会把学习进度存进「本地文件」这个
     特殊存储区，它很脆——清浏览数据、某些"关闭时清除"设置、浏览器更新，
     都可能把它清掉（用户已经踩过一次）。改成 http://localhost 后，浏览器
     把它当成正经网站，存储稳得多。
  2) 更重要的：光靠浏览器存储永远有风险。这个服务器额外提供备份接口，
     网页每隔一会儿就把进度 POST 过来，**存成硬盘上的 JSON 文件**。
     只要文件还在，进度就丢不了；下次启动会自动恢复。

用法：双击同目录下的「启动学习.command」即可，不用手动跑这个文件。

备份文件放在 backups/ 目录：
  latest.json                     —— 最新一份（启动时自动恢复用的就是它）
  backup-YYYYMMDD-HHMMSS.json     —— 历史快照，最多保留 KEEP 份
"""

import http.server
import json
import os
import re
import socketserver
import sys
import datetime
import glob
import urllib.parse

PORT_START = 8877          # 首选端口，被占用就依次往后试
PORT_TRIES = 20
KEEP = 30                  # 历史快照最多保留多少份
ROOT = os.path.dirname(os.path.abspath(__file__))
BACKUP_ROOT = os.path.join(ROOT, "backups")


def backup_dir(app):
    """备份分命名空间存放。
    ⚠️ 为什么要分：现在同一个目录下有两套 App（策略台 index.html 和
       旧版-完整版.html），两者的存档结构完全不同。如果共用一个
       backups/latest.json，后打开的那个会把另一个的备份冲掉。
       策略台请求时会带 ?app=v2 → 存进 backups/v2/；老版不带参数 → 还是 backups/。"""
    return BACKUP_ROOT if not app else os.path.join(BACKUP_ROOT, app)


def app_of(path):
    """从 URL 里取出 ?app=xxx，只允许字母数字，防目录穿越。"""
    q = urllib.parse.urlparse(path).query
    v = (urllib.parse.parse_qs(q).get("app") or [""])[0]
    return v if re.fullmatch(r"[a-zA-Z0-9_-]{1,16}", v or "") else ""


def latest_path(app):
    return os.path.join(backup_dir(app), "latest.json")


def ensure_backup_dir(app=""):
    os.makedirs(backup_dir(app), exist_ok=True)


def weight(state):
    """衡量一份存档「有多少真东西」。用来判断一份备份是不是空的
    ——空备份不许覆盖非空备份（成考那个 App 上实测踩过这个坑）。
    本 App 的存档结构：cards{id->FSRS卡} / seenWords[] / log[]"""
    try:
        s = state or {}
        return (len(s.get("cards") or {}), len(s.get("seenWords") or []), len(s.get("log") or []))
    except Exception:
        return (0, 0, 0)


def prune_old(app=""):
    """只保留最近 KEEP 份历史快照，避免目录无限膨胀。"""
    files = sorted(glob.glob(os.path.join(backup_dir(app), "backup-*.json")))
    for f in files[:-KEEP] if len(files) > KEEP else []:
        try:
            os.remove(f)
        except OSError:
            pass


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, fmt, *args):
        # 备份请求太频繁，别刷屏；只打印页面访问和错误
        msg = fmt % args
        if "/api/backup" in msg and " 200 " in msg:
            return
        sys.stderr.write("  %s\n" % msg)

    def end_headers(self):
        # index.html 绝不能被缓存：它里面写着各个 js 的 ?v= 版本号，
        # 一旦浏览器拿旧的 index.html，改了代码也加载不到新版（踩过好几次，
        # 表现是「改了没生效」）。js/css 靠 ?v= 自己控缓存，不用管。
        p = self.path.split("?")[0]
        if p.endswith(".html") or p in ("/", ""):
            self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def _json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    # ---------------- 取最新备份（网页启动时自动恢复用） ----------------
    def do_GET(self):
        if self.path.startswith("/api/backup/latest"):
            latest = latest_path(app_of(self.path))
            if not os.path.exists(latest):
                return self._json(404, {"ok": False, "msg": "还没有备份"})
            try:
                with open(latest, "r", encoding="utf-8") as f:
                    data = json.load(f)
                stat = os.path.getmtime(latest)
                when = datetime.datetime.fromtimestamp(stat).strftime("%Y-%m-%d %H:%M")
                return self._json(200, {"ok": True, "savedAt": when, "state": data})
            except Exception as e:
                return self._json(500, {"ok": False, "msg": str(e)})
        # 其余走静态文件
        return super().do_GET()

    # ---------------- 写入备份 ----------------
    def do_POST(self):
        if not self.path.startswith("/api/backup"):
            return self._json(404, {"ok": False, "msg": "no such api"})
        app = app_of(self.path)
        LATEST = latest_path(app)
        try:
            n = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(n).decode("utf-8")
            state = json.loads(raw)          # 先解析一遍，坏数据不落盘

            # ⚠️ 防「空数据覆盖好备份」——这是实测踩到的坑：
            #    服务器启动时会自动开一个浏览器标签，如果同时还有别的标签/别的浏览器
            #    打开着同一地址，那个页面的 localStorage 可能是空的，它一保存就会把
            #    一份全空的进度推上来，**把硬盘上的好备份冲掉**。
            #    规则：进度为空的备份，一律不许覆盖已有的非空备份。
            if weight(state) == (0, 0, 0) and os.path.exists(LATEST):
                try:
                    with open(LATEST, "r", encoding="utf-8") as f:
                        if weight(json.load(f)) != (0, 0, 0):
                            return self._json(200, {"ok": True, "skipped": "空进度，已忽略以保护现有备份"})
                except Exception:
                    pass
            ensure_backup_dir(app)
            stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
            snap = os.path.join(backup_dir(app), "backup-%s.json" % stamp)
            text = json.dumps(state, ensure_ascii=False, indent=1)
            # 先写快照再覆盖 latest，避免写一半断电把 latest 弄坏
            with open(snap, "w", encoding="utf-8") as f:
                f.write(text)
            with open(LATEST, "w", encoding="utf-8") as f:
                f.write(text)
            prune_old(app)
            return self._json(200, {"ok": True, "savedAt": stamp})
        except Exception as e:
            return self._json(500, {"ok": False, "msg": str(e)})


def main():
    ensure_backup_dir()
    socketserver.TCPServer.allow_reuse_address = True
    httpd = None
    port = None
    for p in range(PORT_START, PORT_START + PORT_TRIES):
        try:
            httpd = socketserver.TCPServer(("127.0.0.1", p), Handler)
            port = p
            break
        except OSError:
            continue
    if httpd is None:
        print("❌ 端口都被占用了（%d-%d），请关掉别的程序再试。"
              % (PORT_START, PORT_START + PORT_TRIES - 1))
        sys.exit(1)

    url = "http://localhost:%d/index.html" % port
    n_backup = len(glob.glob(os.path.join(BACKUP_ROOT, "**", "backup-*.json"), recursive=True))
    print("=" * 52)
    print("  工作英语 · 刷题   已启动")
    print("=" * 52)
    if port != PORT_START:
        # ⚠️ 端口换了要说清楚：否则上一个没关干净的服务器还占着老端口，
        #    你在浏览器里访问老地址其实是旧进程，会一头雾水（开发时踩过）。
        print("  ⚠️ 端口 %d 被占用（可能上次没关干净），这次用 %d。" % (PORT_START, port))
        print("     如果浏览器里看到的是旧版本，请把其它黑窗口都关掉再启动。")
    print("  学习地址：%s" % url)
    print("  硬盘备份：%s（已有 %d 份）" % (BACKUP_ROOT, n_backup))
    print("")
    print("  ⚠️ 学习时请不要关闭这个黑窗口。")
    print("     学完直接关窗口即可，进度已自动存到硬盘。")
    print("=" * 52)

    # 自动打开浏览器
    os.system('open "%s" >/dev/null 2>&1 &' % url)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止。进度已保存在 backups/ 目录。")


if __name__ == "__main__":
    main()
