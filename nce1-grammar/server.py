#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
本地服务器 + 自动备份
=====================
用法：双击同目录下的「启动学习.command」即可，不用手动跑这个文件。

为什么要它：
  直接双击 html（file:// 打开）时，答题进度只存在浏览器的本地存储里，
  清浏览数据、换浏览器、某些"关闭时清除"设置都可能把它清掉。
  改用 http://localhost 之后，浏览器把它当正经网站，存储稳得多；
  更重要的是网页每次「提交」都会把进度 POST 过来，**存成硬盘上的 JSON 文件**。
  只要文件还在，进度就丢不了，下次打开自动读回来。

备份文件放在 backups/ 目录：
  latest.json                     —— 最新一份（启动时自动恢复用的就是它）
  backup-YYYYMMDD-HHMMSS.json     —— 历史快照，最多保留 KEEP 份
"""

import http.server
import json
import os
import socketserver
import sys
import datetime
import glob
import urllib.parse
import urllib.request

# ⚠️ 端口必须钉死，不能自动往后找。
# 原因：答题进度存在浏览器 localStorage 里，而 localStorage 按「源」隔离
# （浏览器眼里 localhost:8902 和 :8900 是两个不同网站）。端口一漂，上次的
# 进度就"看不见"了——数据还在，只是在另一个源里，人会以为全丢了。
PORT = 8902
KEEP = 30                  # 历史快照最多保留多少份
ROOT = os.path.dirname(os.path.abspath(__file__))
BACKUP_DIR = os.path.join(ROOT, "backups")
LATEST = os.path.join(BACKUP_DIR, "latest.json")
BEST = os.path.join(BACKUP_DIR, "best.json")   # 历史最高水位，只增不减
PAGE = "现在完成时-答题.html"
APP_ID = "nce1-present-perfect"   # 用于判断占端口的是不是本程序自己


def ensure_backup_dir():
    os.makedirs(BACKUP_DIR, exist_ok=True)


def weight(state):
    """这份存档里有多少真东西（做过几道题）。用来判断是不是空存档
    —— 空存档不许覆盖非空备份。"""
    try:
        return len((state or {}).keys())
    except Exception:
        return 0


def prune_old():
    """只保留最近 KEEP 份历史快照，避免目录无限膨胀。"""
    files = sorted(glob.glob(os.path.join(BACKUP_DIR, "backup-*.json")))
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
        # 网页本身绝不缓存，否则改了代码打开还是旧版
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
        if self.path.startswith("/api/ping"):
            return self._json(200, {"ok": True, "app": APP_ID})
        if self.path.startswith("/api/backup/latest"):
            # 取 latest 和 best（历史最高水位）里内容更多的那份 —— 恢复只该往好的方向走
            cands = []
            for ref in (LATEST, BEST):
                if os.path.exists(ref):
                    try:
                        with open(ref, "r", encoding="utf-8") as f:
                            data = json.load(f)
                        cands.append((weight(data), os.path.getmtime(ref), data))
                    except Exception:
                        pass
            if not cands:
                return self._json(404, {"ok": False, "msg": "还没有备份"})
            cands.sort(key=lambda x: (x[0], x[1]))
            best_n, mtime, data = cands[-1]
            when = datetime.datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M")
            return self._json(200, {"ok": True, "savedAt": when, "state": data})
        return super().do_GET()

    # ---------------- 写入备份 ----------------
    def do_POST(self):
        if not self.path.startswith("/api/backup"):
            return self._json(404, {"ok": False, "msg": "no such api"})
        try:
            n = int(self.headers.get("Content-Length", 0))
            state = json.loads(self.rfile.read(n).decode("utf-8"))  # 坏数据不落盘

            # ⚠️ 防「空数据覆盖好备份」：如果另开了一个标签、它的浏览器存储是空的，
            #    它一保存就会把硬盘上的好备份冲掉。空进度一律不许覆盖非空备份。
            if weight(state) == 0 and os.path.exists(LATEST):
                try:
                    with open(LATEST, "r", encoding="utf-8") as f:
                        if weight(json.load(f)) != 0:
                            return self._json(200, {"ok": True, "skipped": "空进度，已忽略以保护现有备份"})
                except Exception:
                    pass

            # ⚠️ 防「进度大幅缩水覆盖恢复点」——实测踩过：某个标签（或开发测试）里
            #    进度被清成一小半，一保存就把硬盘上那份完整的恢复点冲掉了。
            #    规则：新数据比恢复点少 30% 以上时，快照照存（不丢证据），
            #    但不动 latest.json —— 恢复点只能变好，不能变差。
            # 和「历史最高水位」比，而不是和上一次比。
            # 只和上一次比会被"逐步蚕食"绕过：31→26→20 每步都在 30% 以内，
            # 但累计已经把好数据啃掉了（实测踩过）。
            best_n = 0
            for ref in (BEST, LATEST):
                if os.path.exists(ref):
                    try:
                        with open(ref, "r", encoding="utf-8") as f:
                            best_n = max(best_n, weight(json.load(f)))
                    except Exception:
                        pass
            new_n = weight(state)
            shrink = (best_n >= 10 and new_n < best_n * 0.7)

            ensure_backup_dir()
            stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
            text = json.dumps(state, ensure_ascii=False, indent=1)
            # 先写快照再覆盖 latest，避免写一半出问题把 latest 弄坏
            with open(os.path.join(BACKUP_DIR, "backup-%s.json" % stamp), "w", encoding="utf-8") as f:
                f.write(text)
            if shrink:
                # 快照留着（不丢证据），但恢复点不降级
                prune_old()
                return self._json(200, {"ok": True, "savedAt": stamp,
                                        "note": "只有 %d 题，历史最高是 %d 题，已存快照但不覆盖恢复点"
                                                % (new_n, best_n)})
            with open(LATEST, "w", encoding="utf-8") as f:
                f.write(text)
            # 刷新高水位：这份比历史最多还多，就把它记成新的最高点
            if new_n >= best_n:
                with open(BEST, "w", encoding="utf-8") as f:
                    f.write(text)
            prune_old()
            return self._json(200, {"ok": True, "savedAt": stamp})
        except Exception as e:
            return self._json(500, {"ok": False, "msg": str(e)})


def main():
    ensure_backup_dir()
    socketserver.TCPServer.allow_reuse_address = True
    port = PORT
    url = "http://localhost:%d/%s" % (port, urllib.parse.quote(PAGE))
    try:
        httpd = socketserver.TCPServer(("127.0.0.1", port), Handler)
    except OSError:
        # 端口被占用 —— 先看看占着的是不是本程序自己（上次没关干净）
        mine = False
        try:
            with urllib.request.urlopen("http://127.0.0.1:%d/api/ping" % port, timeout=2) as r:
                mine = (json.loads(r.read().decode("utf-8")).get("app") == APP_ID)
        except Exception:
            mine = False

        if mine:
            # 就是它自己在跑，那没什么要处理的：直接把页面打开，安静退出
            print("学习页已经在运行了，正在打开浏览器…")
            print("  %s" % url)
            os.system('open "%s" >/dev/null 2>&1 &' % url)
            sys.exit(0)

        # 是别的程序占着，这才需要人来处理
        print("=" * 52)
        print("  端口 %d 被<别的程序>占用了。" % port)
        print("=" * 52)
        print("  本程序必须用这个端口：你的答题进度是按 localhost:%d 存在" % port)
        print("  浏览器里的，换端口就会看不到之前做过的题（数据没丢，在另一个地址下）。")
        print("")
        print("  请先关掉占用它的程序，再双击本文件。查是谁占的：")
        print("     lsof -ti:%d" % port)
        print("=" * 52)
        print("")
        print("（按回车键关闭窗口）")
        try:
            input()
        except Exception:
            pass
        sys.exit(1)

    n_backup = len(glob.glob(os.path.join(BACKUP_DIR, "backup-*.json")))
    print("=" * 52)
    print("  新概念英语 1 · 现在完成时   已启动")
    print("=" * 52)
    print("  学习地址：http://localhost:%d/%s" % (port, PAGE))
    print("  硬盘备份：backups/（已有 %d 份快照）" % n_backup)
    print("")
    print("  ⚠️ 做题时别关这个黑窗口 —— 关了就只剩浏览器里那一份进度，")
    print("     硬盘备份会停。浏览器标签随便开关，不影响。")
    print("  学完直接关窗口即可，每次「交卷」时进度已经存到硬盘了。")
    print("=" * 52)
    print("")
    os.system('open "%s" >/dev/null 2>&1 &' % url)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止。进度已保存在 backups/ 目录。")


if __name__ == "__main__":
    main()
