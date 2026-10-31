# AutoHotkey v2 Docs (OpenCode skill)

離線版 AutoHotkey v2 官方英文說明文件，轉成 Markdown，並包裝成 [OpenCode](https://opencode.ai) skill。
所有內容鏡像 <https://www.autohotkey.com/docs/v2/>，目錄結構與官網一致，連結與 anchor 可直接使用。

- **410 頁** Markdown（官方 TOC 393 頁 + 17 頁只可經連結到達的頁面）
- **53 個附件**（GUI 控制項圖示、官網 `.ahk` 範例）
- 上游版本記錄在 [`snapshot.json`](snapshot.json)（每頁 sha256，可做差異比對）
- 完整目錄：[`references/_index.md`](references/_index.md)

## 安裝為 OpenCode skill

Skill 需要放在 OpenCode 的 skills 目錄，資料夾名必須與 `SKILL.md` 內的 `name` 一致（`autohotkey-v2`）。

```powershell
# Windows：用 junction 連到本 repo，之後 git pull 即生效
git clone https://github.com/<your-name>/autohotkey-v2-docs.git "$HOME\Documents\autohotkey-v2-docs"
New-Item -ItemType Junction `
  -Path  "$HOME\.config\opencode\skills\autohotkey-v2" `
  -Target "$HOME\Documents\autohotkey-v2-docs"
```

```bash
# macOS / Linux
git clone https://github.com/<your-name>/autohotkey-v2-docs.git ~/.config/opencode/skills/autohotkey-v2
```

重開 OpenCode 後，問「幫我寫個 AHK v2 熱鍵」之類嘅問題就會自動載入。

> 只想當普通文件用？直接讀 `references/` 就得，唔需要裝 skill。

## 更新文件

```bash
npm install                    # 只有一個 dependency：node-html-parser
npm run update                 # 抓取官網 → 轉換 → 只寫有變更的檔案
npm run update:check           # 只比對不寫檔；有差異時 exit code 1（適合 CI）
npm run update:offline         # 用 .cache/raw 重新轉換，完全離線
npm run verify                 # 抓取 + 嚴格檢查所有內部連結與 anchor
```

- 第一次 `update` 會建立 `.cache/raw/`（原始 HTML 快取，已 gitignore）。
- 上游刪除的頁面會自動從 `references/` 移除；`snapshot.json` 會記錄新版本與 hash。
- 若官網 HTML 結構改變，通常只需修改 `scripts/lib/convert.mjs`。

### GitHub Actions

[`.github/workflows/update-docs.yml`](.github/workflows/update-docs.yml) 每日檢查上游是否有變更：

- `schedule` / 手動 `workflow_dispatch`：有變更就自動 commit + push 回 `main`。
- Pull request：只跑 `--check`，不會寫入。

## 專案結構

```
SKILL.md                 # skill 入口：導航表、語法速查、v1→v2 陷阱
references/              # 410 頁 Markdown（鏡像官網路徑）
  _index.md              # 自動生成的完整目錄
  index.md               # 官網首頁
  lib/                   # 356 個函數／指令頁
  misc/                  # WinTitle、Threads、RegEx-QuickRef、Styles…
  howto/                 # 安裝、寫熱鍵、送鍵、視窗管理
  scripts/               # 官網範例 .ahk
  static/                # 圖片
snapshot.json            # 上游版本 + TOC hash + 每頁 sha256
scripts/
  update.mjs             # 爬取、轉換、寫檔、驗證
  lib/convert.mjs        # HTML → Markdown 轉換器
```

## 轉換方式

官網本身是靜態 HTML，因此直接以網站為來源（而非 GitHub repo）：

1. 以 `static/source/data_toc.js` 的 `tocData` 作種子。
2. 爬遍所有內部 `.htm` 連結，補齊不在 TOC 的頁面。
3. 用 [`node-html-parser`](https://www.npmjs.com/package/node-html-parser) 解析，保留標題層級、
   `<pre>` 區塊、定義清單、表格、`<a id>` anchor，並把 `.htm` 連結改寫成 `.md`。
4. 表格能用 GFM 就輸出 pipe table；含 `colspan`/`rowspan` 時保留 raw HTML table。
5. 下載被引用的圖片與 `.ahk` 範例，然後驗證所有內部連結與 anchor。

## 授權

AutoHotkey 官方文件由 Steve Gray、Chris Mallett 等作者撰寫，依 **GNU GPL v2** 發佈
（見 [`references/license.md`](references/license.md)）。本 repo 只是把 HTML 轉成 Markdown，
不改動內容語意，同樣以 **GPL-2.0-only** 發佈，全文見 [`LICENSE`](LICENSE)。

AutoHotkey 本身亦為 GPL v2；「AutoHotkey」名稱及 logo 屬其作者所有。
本專案與 AutoHotkey 官方無隸屬關係。
