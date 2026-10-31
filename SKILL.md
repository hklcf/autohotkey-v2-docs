---
name: autohotkey-v2
description: "AutoHotkey v2 (AHK v2) 官方英文說明文件嘅完整離線 Markdown 副本，共 410 頁。內容包括語法、運算子、變數、函數、物件/類別、熱鍵 hotkey、hotstring、GUI、視窗控制 WinTitle、Send/SendMode、剪貼板、檔案/資料夾、登錄檔、程序、COM、DllCall、正則表達式 RegExMatch/RegExReplace、SetTimer、錯誤處理 try/catch、v1→v2 遷移。當用戶要寫或除錯 AutoHotkey v2 腳本、查 AHK v2 函數語法（MsgBox、Send、Gui、Map、Array、StrSplit、WinExist…）、將 v1 script 改寫成 v2、或問 AHK 熱鍵/自動化問題時使用。Keywords: AutoHotkey, AHK, AHKv2, ahk script, hotkey, hotstring, automation, GUI, Send, WinTitle, DllCall, COM, RegEx."
---

# AutoHotkey v2 官方文件（離線完整副本）

`references/` 係 <https://www.autohotkey.com/docs/v2/> 嘅 1:1 Markdown 鏡像（英文原文，未翻譯），
目錄結構同網站完全一樣，所有連結已改寫成 `.md`，anchor 保持可用。

- 完整目錄：`references/_index.md`（官網 TOC + 17 頁 TOC 以外嘅頁面）
- 版本／校驗資訊：`snapshot.json`（`upstream.version`、每頁 sha256）
- 首頁：`references/index.md`

> 呢個 skill 只負責「查文件」。寫 script 時請直接引用 `references/lib/<Function>.md`，
> 唔好靠記憶背 API，因為 v2 同 v1 差異好大。

## 按任務搵頁面

| 我想… | 睇邊頁 |
| --- | --- |
| 由零開始學 AHK | `references/Tutorial.md`、`references/howto/Install.md` |
| 寫第一個熱鍵 | `references/howto/WriteHotkeys.md`、`references/Hotkeys.md` |
| 整 hotstring（打字替換） | `references/Hotstrings.md` |
| 送鍵盤／滑鼠輸入 | `references/lib/Send.md`、`references/lib/SendMode.md`、`references/howto/SendKeys.md` |
| 搵 key 名（{Enter}、{F1}、Mouse…） | `references/KeyList.md`、`references/lib/GetKeyName.md` |
| 視窗標題/match mode（ahk_class、ahk_exe） | `references/misc/WinTitle.md`、`references/lib/SetTitleMatchMode.md` |
| 視窗操作（activate/move/hide/wait） | `references/lib/WinExist.md`、`references/lib/WinActivate.md`、`references/lib/WinMove.md`、`references/lib/WinWait.md` |
| 控制項（按鈕、Edit、ListView…） | `references/lib/Control.md`、`references/misc/ControlID.md` |
| 建立 GUI | `references/lib/Gui.md`、`references/lib/GuiControl.md`、`references/lib/GuiOnEvent.md` |
| 選單／tray icon | `references/lib/Menu.md`、`references/lib/TraySetIcon.md` |
| 剪貼板 | `references/lib/A_Clipboard.md`、`references/lib/ClipboardAll.md`、`references/lib/ClipWait.md` |
| 讀寫檔案 | `references/lib/FileRead.md`、`references/lib/FileAppend.md`、`references/lib/FileOpen.md`、`references/lib/File.md` |
| 揀檔案／資料夾 | `references/lib/FileSelect.md`、`references/lib/DirSelect.md` |
| 資料夾／檔案操作 | `references/lib/DirCopy.md`、`references/lib/FileCopy.md`、`references/lib/FileExist.md` |
| 登錄檔 | `references/lib/RegRead.md`、`references/lib/RegWrite.md`、`references/lib/RegCreateKey.md` |
| 執行外部程式 | `references/lib/Run.md`、`references/howto/RunPrograms.md` |
| 執行 cmd／拎輸出 | `references/lib/Run.md`（`RunWait` + `Shell.Exec` 例子） |
| 程序（process）管理 | `references/lib/Process.md`、`references/lib/ProcessExist.md`、`references/lib/ProcessClose.md` |
| 陣列／Map／物件 | `references/lib/Array.md`、`references/lib/Map.md`、`references/Objects.md` |
| 自訂 class／property | `references/lib/Class.md`、`references/Objects.md` |
| 函數、ByRef、closure | `references/Functions.md`、`references/lib/Func.md` |
| 字串處理 | `references/lib/StrSplit.md`、`references/lib/SubStr.md`、`references/lib/StrReplace.md`、`references/lib/Format.md`、`references/lib/Trim.md` |
| 正則表達式 | `references/misc/RegEx-QuickRef.md`、`references/lib/RegExMatch.md`、`references/lib/RegExReplace.md` |
| 數學／日期時間 | `references/lib/Math.md`、`references/lib/DateAdd.md`、`references/lib/FormatTime.md` |
| 計時器／排程 | `references/lib/SetTimer.md`、`references/lib/Sleep.md` |
| 錯誤處理 | `references/lib/Try.md`、`references/lib/Catch.md`、`references/lib/Throw.md`、`references/lib/Error.md` |
| DllCall／struct／Buffer | `references/lib/DllCall.md`、`references/lib/Buffer.md`、`references/lib/NumGet.md`、`references/lib/NumPut.md` |
| COM（Excel、Word、WScript…） | `references/lib/ComObject.md`、`references/lib/ComObjActive.md`、`references/lib/ComValue.md` |
| 多執行緒／Critical | `references/misc/Threads.md`、`references/lib/Critical.md` |
| 效能調校 | `references/misc/Performance.md` |
| 打包成 EXE | `references/misc/Ahk2ExeDirectives.md`、`references/Scripts.md` |
| 由 v1 升上 v2 | `references/v2-changes.md`、`references/v1-changes.md` |
| 常見問題 | `references/FAQ.md`、`references/Compat.md` |
| 版本更新紀錄 | `references/ChangeLog.md` |

## AHK v2 最小語法速查

```ahk
#Requires AutoHotkey v2.0
#SingleInstance Force
Persistent

; 賦值一定要 := ；= 係（唔分大小寫嘅）比較
name := "World"
count := 1
count += 1

; 字串串接要空格（implicit concat）或者用點
MsgBox "Hello, " name "!"        ; 唔可以寫 "Hello, name"
MsgBox "Count = " . count

; 函數呼叫：有括號 = 表達式；冇括號 = 只喺語句開頭
MsgBox("Hello")                  ; 有回傳值
Sleep 500                        ; 毫秒
Run "notepad.exe"

; 函數定義
Add(a, b) {
    return a + b
}
Square(n) => n * n               ; fat arrow

; 熱鍵：多行要 { }
^!s:: {
    Send "^s"
    Sleep 100
}
#HotIf WinActive("ahk_class Notepad")
^a::MsgBox "Notepad 入面撳咗 Ctrl+A"
#HotIf

; Hotstring
::btw::by the way
:*:ahk::AutoHotkey

; if / loop / for
if (count > 0)
    MsgBox "positive"

Loop 5
    MsgBox "iteration " A_Index

Loop Files, A_ScriptDir "\*.txt"
    MsgBox A_LoopFileName

arr := [1, 2, 3]                 ; 1-based，arr[1] = 1
for i, v in arr
    MsgBox i ": " v

m := Map("a", 1, "b", 2)
for k, v in m
    MsgBox k "=" v
MsgBox m["a"]
if m.Has("b")
    m.Delete("b")
```

### 物件導向

```ahk
class Point {
    __New(x, y) {
        this.x := x
        this.y := y
    }
    Length => Sqrt(this.x ** 2 + this.y ** 2)   ; property getter
    static Origin() => Point(0, 0)             ; static method
}

p := Point(3, 4)
MsgBox p.Length          ; 5
MsgBox Point.Origin().x  ; 0
```

### 錯誤處理

```ahk
try
    content := FileRead("missing.txt")
catch OSError as err
    MsgBox "讀取失敗：" err.Message
finally
    MsgBox "Done"
```

### GUI

```ahk
g := Gui("+Resize", "My Tool")
g.Add("Text",, "Name:")
g.Add("Edit", "vName w200")
g.Add("Button",, "OK").OnEvent("Click", Submit)
g.Show()

Submit(ctrl, info) {
    saved := ctrl.Gui.Submit()     ; 收集 vName
    MsgBox "Hello " saved.Name
}
```

## v1 → v2 常見陷阱

| v1 | v2 |
| --- | --- |
| `var = value`（literal 賦值） | `var := "value"` |
| `MsgBox, text` | `MsgBox "text"`（逗號唔要） |
| 字串內 `%var%` | `"text " var`（空格串接）或 `Format()` |
| `IfEqual, x, y` | `if (x = y)` |
| `IfWinActive, title` | `#HotIf WinActive("title")` |
| `SetEnv, var, val` | `var := "val"` |
| `StringSplit, out, in, delim` | `out := StrSplit(in, delim)` |
| `StringReplace, out, in, a, b` | `out := StrReplace(in, a, b)` |
| `StringLeft/Right/Mid/Len` | `SubStr()` / `StrLen()` |
| `StringGetPos` | `InStr()` |
| `FileReadLine` | `Loop Read` 或 `FileOpen` |
| `Gosub label` | 直接呼叫函數 |
| 熱鍵結尾 `return` | 用 `{ }` 包住（結尾 `return` 可省） |
| `Gui, Add, Text` | `g.Add("Text", ...)` |
| `GuiControl,, ctrl, value` | `ctrl.Value := value` |
| `ErrorLevel` | 擲異常 / 用回傳值 |
| `IfMsgBox Yes` | `if MsgBox(...) = "Yes"` |
| `#IfWinActive` | `#HotIf WinActive(...)` |
| `SendRaw` / `ControlSendRaw` | `SendText` / `ControlSendText`，或 `Send "{Raw}"` |
| `Asc()` | `Ord()` |
| `VarSetCapacity()` | `Buffer` 物件 / `VarSetStrCapacity()` |
| `AutoTrim` | `Trim()` |
| `#NoEnv` | 已經係預設，唔需要 |
| `SetBatchLines, -1` | 已經係預設 |
| `A_Args` / `A_Index` | 一樣，但 `A_LoopFileName` 等要配合新 Loop 語法 |

其他一定要記住嘅語意差異（詳見 `references/v2-changes.md`）：

- 變數／函數名**唔可以**含 `@ # $`；`and`、`or`、`not`、`is`、`in`、`contains` 等係保留字。
- `!=` 永遠唔分大小寫；`!==` 才分。`==` 分大小寫。
- `&&` / `||` 回傳「決定結果嘅值」，唔一定係 0/1。
- 函數內預設 assume-local：可以讀 global，但改 global 要 `global` 宣告。
- 熱鍵函數預設 assume-local，改 global 一樣要宣告。
- 動態呼叫用 function reference（`MyFunc`），唔再用 `"MyFunc"` 字串。
- `&var` 係取 reference（ByRef），唔再係 address-of；要 pointer 用 `StrPtr()` / `ObjPtr()`。
- `#HotIf` 取代 `#If` / `#IfWinActive`。

## 常用內建分類（`references/lib/`）

- **流程**：`If` `Else` `Loop` `LoopFiles` `LoopParse` `LoopRead` `LoopReg` `While` `For` `Switch` `Break` `Continue` `Return` `Exit` `ExitApp` `Goto` `Try` `Catch` `Finally` `Throw`
- **字串**：`StrLen` `SubStr` `InStr` `StrReplace` `StrSplit` `StrLower`（含 `StrUpper`/`StrTitle`）`StrCompare` `Trim` `Format` `FormatTime` `Ord` `Chr`
- **數學**：`Math` `Round` `Floor` `Ceil` `Abs` `Sqrt` `Min` `Max` `Random`
- **檔案**：`FileRead` `FileAppend` `FileOpen` `File` `FileCopy` `FileMove` `FileDelete` `FileExist` `FileGetTime` `FileSetTime` `FileSelect` `DirCreate` `DirCopy` `DirDelete` `DirSelect` `SplitPath`
- **視窗**：`WinExist` `WinActive` `WinActivate` `WinClose` `WinKill` `WinMove` `WinGetPos` `WinGetTitle` `WinGetText` `WinSetTitle` `WinWait` `WinWaitActive` `WinWaitClose`
- **控制項**：`ControlGetText` `ControlSetText` `ControlClick` `ControlSend` `ControlGetPos` `ControlMove` `ControlFocus` `ControlGetFocus`
- **輸入**：`Send` `SendText` `SendInput` `SendPlay` `SendEvent` `Click` `MouseMove` `MouseClick` `MouseClickDrag` `MouseGetPos` `KeyWait` `GetKeyState`
- **系統**：`Run`（含 `RunWait`）`RunAs` `ProcessExist` `ProcessClose` `ProcessWait` `EnvGet` `EnvSet` `RegRead` `RegWrite` `SoundBeep` `SoundPlay` `Shutdown` `OnExit` `OnError` `OnMessage` `OnClipboardChange`
- **GUI**：`Gui` `GuiControl` `GuiOnEvent` `GuiOnCommand` `GuiOnNotify` `Menu`（含 MenuBar）`ToolTip` `TrayTip` `MsgBox` `InputBox`
- **進階**：`DllCall` `Buffer` `NumGet` `NumPut` `StrGet` `StrPut` `StrPtr` `ObjPtr`（喺 `references/Objects.md#ObjPtr`）`CallbackCreate` `ComObject` `ComValue` `ComObjActive` `ComCall` `SendMessage` `PostMessage` `OnMessage`

完整清單見 `references/_index.md` 或 `references/lib/index.md`。

## 搜尋技巧

呢個 repo 係純 Markdown，直接 grep 最快：

```bash
# 搵邊個 lib 頁提到某個函數／關鍵字
grep -ril "ControlSendText" references/

# 喺 lib/ 搵語法簽名（通常喺 "## Parameters" 前面）
grep -n "^## " references/lib/Send.md

# 搵 anchor（官網 fragment 對應）
grep -n 'id="SendText"' references/lib/Send.md

# 搵例子
grep -n "Example" references/lib/Gui.md
```

- 每頁開頭通常有 `## Parameters`、`## Return Value`、`## Error Handling`、`## Remarks`、`## Related`、`## Examples`。
- 官網 anchor（例如 `Send.htm#SendText`）已轉成 `<a id="SendText"></a>`，喺 Markdown 內可直接 `references/lib/Send.md#SendText`。
- 遇到 TOC 冇嘅頁面（例如 `lib/Type.md`、`misc/EscapeChar.md`），喺 `references/_index.md` 最尾「Additional pages」。

## 更新文件（同步官網）

```bash
npm install                 # 只有一個 dependency：node-html-parser
npm run update              # 重新抓取 + 轉換，只寫有變更嘅檔案
npm run update -- --check   # 只比對，唔寫檔（有差異 exit code 1，適合 CI）
npm run update -- --offline # 用 .cache/raw 重新轉換，完全唔上網
npm run verify              # 連結 + anchor 驗證（--strict）
```

- 每次 update 會更新 `snapshot.json`（版本、TOC hash、每頁 sha256）。
- 上游刪除嘅頁面會自動由 `references/` 移除。
- 轉換器：`scripts/lib/convert.mjs`；爬蟲／流程：`scripts/update.mjs`。
  如果官網 HTML 結構改變，通常只需要改 `convert.mjs`。

## 檔案佈局

```
SKILL.md                  # 你而家睇緊嘅導航
references/               # 410 頁 Markdown（鏡像官網路徑）
  _index.md               # 完整目錄（自動生成，唔好手改）
  index.md                # 官網首頁
  lib/                    # 356 個函數／指令頁
  misc/                   # WinTitle、Threads、RegEx-QuickRef、Styles…
  howto/                  # 安裝、寫熱鍵、送鍵、視窗管理
  scripts/                # 官網範例 .ahk 原檔
  static/                 # 圖片（GUI 控制項圖示等）
snapshot.json             # 上游版本 + sha256 清單
scripts/                  # 更新工具
```

## 授權

文件內容來自 AutoHotkey 官方（作者 Steve Gray、Chris Mallett 等），依 GNU GPL v2 發佈；
原文見 `references/license.md`。本 repo 只做 HTML→Markdown 轉換，唔改內容語意。
