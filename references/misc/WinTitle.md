# WinTitle Parameter & Last Found Window

Various built-in functions have a *WinTitle* parameter, used to identify which window (or windows) to operate on. This parameter can be the title or partial title of the window, and/or any other criteria described on this page.

<a id="toc"></a>
## Table of Contents

- [Window Title & Matching Behavior](#WinTitle)
- [A (Active Window)](#ActiveWindow)
- [ahk_ Criteria](#ahk_)
    - [ahk_class (Window Class)](#ahk_class)
    - [ahk_id (Unique ID / HWND)](#ahk_id)
    - [ahk_pid (Process ID)](#ahk_pid)
    - [ahk_exe (Process Name/Path)](#ahk_exe)
    - [ahk_group (Window Group)](#ahk_group)
- [Multiple Criteria](#multi)
- [Last Found Window](#LastFoundWindow)
- [Related](#Related)

<a id="Matching"></a>

<a id="WinTitle"></a>
## Window Title & Matching Behavior

Specify any string for *WinTitle* to identify a window by its title. The title of a window is often visible as text in a title bar at the top of the window. If invisible or only partially visible, the full window title can be revealed via [WinGetTitle](../lib/WinGetTitle.md) or [Window Spy](../Program.md#Window_Spy).

The following example activates the calculator:

```ahk
WinActivate "Calculator"
```

[SetTitleMatchMode](../lib/SetTitleMatchMode.md) controls how a partial or complete title is compared against the title of each window. Depending on the setting, *WinTitle* can be an exact title, or it can contain a prefix, a substring which occurs anywhere in the title, or a [RegEx pattern](RegEx-QuickRef.md). This setting also controls whether the [ahk_class](#ahk_class) and [ahk_exe](#ahk_exe) criteria are interpreted as RegEx patterns.

Window titles are case-sensitive, except when using the [i) modifier](RegEx-QuickRef.md#opt_i) in a RegEx pattern.

Hidden windows are only detected if [DetectHiddenWindows](../lib/DetectHiddenWindows.md) is turned on, except with [WinShow](../lib/WinShow.md), which always detects hidden windows.

If multiple windows match *WinTitle* and any other criteria, the topmost matching window is used. If the active window matches the criteria, it usually takes precedence since it is usually above all other windows. However, if an [always-on-top](../lib/WinSetAlwaysOnTop.md) window also matches (and the active window is not always-on-top), it may be used instead.

<a id="CharLimit"></a>

In [v2.0.6+], it is no longer the case that only the first 1023 characters of the specified window title, [ahk_class](#ahk_class) criterion value, and [ahk_exe](#ahk_exe) criterion value are considered for matching purposes. Exceeding the length no longer leads to unexpected results, which rarely occurs, but may be encountered more often if a very long RegEx pattern is used.

<a id="ActiveWindow"></a>
## A (Active Window)

Use the letter `A` for *WinTitle* and omit the other three window parameters (*WinText*, *ExcludeTitle* and *ExcludeText*), to operate on the active window.

The following example retrieves and reports the unique ID (HWND) of the active window:

```ahk
MsgBox WinExist("A")
```

The following example creates a hotkey which can be pressed to maximize the active window:

```ahk
#Up::WinMaximize "A"  ; Win+Up
```

<a id="ahk_"></a>
## ahk_ Criteria

Specify one or more of the following ahk_ criteria (optionally in addition to a window's title), each separated from the next with exactly <u>one</u> space or tab (any other spaces or tabs are treated as a literal part of the previous criterion). An ahk_ criterion always consists of an ahk_ keyword and its criterion value, separated by zero or more spaces or tabs. For example, `ahk_class Notepad` identifies a Notepad window.

The ahk_ keyword and its criterion value do not need to be separated by spaces or tabs. This is primarily useful when specifying ahk_ criteria in combination with variables. For example, you could specify `"ahk_pid" PID` instead of `"ahk_pid " PID`. In all other cases, however, it is recommended to use at least one space or tab as a separation to improve readability.

<a id="ahk_class"></a>
### ahk_class (Window Class)

Use `ahk_class ClassName` in *WinTitle* to identify a window by its window class.

A window class is a set of attributes that the system uses as a template to create a window. In other words, the class name of the window identifies what *type* of window it is. A window class can be revealed via [Window Spy](../Program.md#Window_Spy) or retrieved by [WinGetClass](../lib/WinGetClass.md). If the RegEx [title matching mode](../lib/SetTitleMatchMode.md) is active, *ClassName* accepts a [regular expression](RegEx-QuickRef.md).

Window classes are case-sensitive, except when using the [i) modifier](RegEx-QuickRef.md#opt_i) in a RegEx pattern.

The following example activates a console window (e.g. cmd.exe):

```ahk
WinActivate "ahk_class ConsoleWindowClass"
```

The following example does the same as above, but uses a [regular expression](RegEx-QuickRef.md) (note that the RegEx [title matching mode](../lib/SetTitleMatchMode.md) must be turned on beforehand to make it work):

```ahk
WinActivate "ahk_class ^ConsoleWindowClass$"
```

<a id="ahk_id"></a>
### ahk_id (Unique ID / HWND)

Use `ahk_id HWND` or a pure HWND (as an [Integer](../Concepts.md#numbers) or an [Object](../Objects.md) with a Hwnd property) in *WinTitle* to identify a window or control by its unique ID. If the object has no Hwnd property or the property's value is not an integer, a [PropertyError](../lib/Error.md#PropertyError) or [TypeError](../lib/Error.md#TypeError) is thrown.

Each window and control has a unique ID, also known as a HWND (short for handle to window). This ID can be used to identify the window or control even if its title or text changes. The ID of a window is typically retrieved via [WinExist](../lib/WinExist.md) or [WinGetID](../lib/WinGetID.md) and can be revealed via [Window Spy](../Program.md#Window_Spy). For details about identifying a control by HWND, see [Control Identifiers](ControlID.md#HWND).

A HWND is especially useful when sending messages directly to a window or control via [PostMessage](../lib/PostMessage.md), [SendMessage](../lib/SendMessage.md), or when calling native APIs with [DllCall](../lib/DllCall.md).

When using `ahk_id HWND`, [DetectHiddenWindows](../lib/DetectHiddenWindows.md) affects whether hidden top-level windows are detected, but hidden controls are always detected. When using pure HWNDs, hidden windows are always detected regardless of DetectHiddenWindows. [WinWait](../lib/WinWait.md) and [WinWaitClose](../lib/WinWaitClose.md) are an exception, where both `ahk_id HWND` and pure HWNDs are affected by DetectHiddenWindows.

`ahk_id HWND` can also be combined with other criteria that the given window must match. For example, `WinExist("ahk_id " ahwnd " ahk_class " aclass)` returns *ahwnd* if the window is "detected" (according to DetectHiddenWindows) and its window class matches the string contained by *aclass*.

The following examples operate on a window by a unique ID stored in *VarContainingID*:

```ahk
; Pass an Integer.
WinActivate Integer(VarContainingID)
WinShow A_ScriptHwnd
WinWaitNotActive WinExist("A")

; Pass an Object with a Hwnd property.
WinActivate {Hwnd: VarContainingID}
WinWaitClose myGuiObject

; Use the ahk_id prefix.
WinActivate "ahk_id " VarContainingID
```

<a id="ahk_pid"></a>
### ahk_pid (Process ID)

Use `ahk_pid PID` in *WinTitle* to identify a window belonging to a specific process. The process identifier (PID) is typically retrieved by [WinGetPID](../lib/WinGetPID.md), [Run](../lib/Run.md) or [Process functions](../lib/Process.md). The ID of a window's process can be revealed via [Window Spy](../Program.md#Window_Spy).

The following example activates a window by a process ID stored in *VarContainingPID*:

```ahk
WinActivate "ahk_pid " VarContainingPID
```

<a id="ahk_exe"></a>
### ahk_exe (Process Name/Path)

Use `ahk_exe ProcessNameOrPath` in *WinTitle* to identify a window belonging to any process with the given name or path.

While the [ahk_pid criterion](#ahk_pid) is limited to one specific process, the ahk_exe criterion considers all processes with name or full path matching a given string. If the RegEx [title matching mode](../lib/SetTitleMatchMode.md) is active, *ProcessNameOrPath* accepts a [regular expression](RegEx-QuickRef.md) which must match the full path of the process. Otherwise, it accepts a case-insensitive name or full path; for example, `ahk_exe notepad.exe` covers `ahk_exe C:\Windows\Notepad.exe`, `ahk_exe C:\Windows\System32\Notepad.exe` and other variations. The name of a window's process can be revealed via [Window Spy](../Program.md#Window_Spy).

The following example activates a Notepad window by its process name:

```ahk
WinActivate "ahk_exe notepad.exe"
```

The following example does the same as above, but uses a [regular expression](RegEx-QuickRef.md) (note that the RegEx [title matching mode](../lib/SetTitleMatchMode.md) must be turned on beforehand to make it work):

```ahk
WinActivate "ahk_exe i)\\notepad\.exe$"  ; Match the name part of the full path.
```

<a id="ahk_group"></a>
### ahk_group (Window Group)

Use `ahk_group GroupName` in *WinTitle* to identify a window or windows matching the rules contained by a previously defined [window group](../lib/GroupAdd.md).

[WinMinimize](../lib/WinMinimize.md), [WinMaximize](../lib/WinMaximize.md), [WinRestore](../lib/WinRestore.md), [WinHide](../lib/WinHide.md), [WinShow](../lib/WinShow.md), [WinClose](../lib/WinClose.md), and [WinKill](../lib/WinKill.md) will operate upon <u>all</u> the group's windows. By contrast, the other windowing functions such as [WinActivate](../lib/WinActivate.md) and [WinExist](../lib/WinExist.md) will operate only upon the topmost window of the group.

The following example activates any window matching the criteria defined by a window group:

```ahk
; Define the group: Windows Explorer windows
GroupAdd "Explorer", "ahk_class ExploreWClass" ; Unused on Vista and later
GroupAdd "Explorer", "ahk_class CabinetWClass"

; Activate any window matching the above criteria
WinActivate "ahk_group Explorer"
```

<a id="multi"></a>
## Multiple Criteria

By contrast with the [ahk_group criterion](#ahk_group) (which broadens the search), the search may be narrowed by specifying more than one criterion within the *WinTitle* parameter. In the following example, the script waits for a window whose title contains *My File.txt* <u>and</u> whose class is *Notepad*:

```ahk
WinWait "My File.txt ahk_class Notepad"
WinActivate  ; Activate the window it found.
```

When using this method, the text of the title (if any is desired) should be listed first, followed by one or more additional criteria. Criteria beyond the first should be separated from the previous with exactly <u>one</u> space or tab (any other spaces or tabs are treated as a literal part of the previous criterion).

The [ahk_id criterion](#ahk_id) can be combined with other criteria to test a window's title, class or other attributes:

```ahk
MouseGetPos ,, &id
if WinExist("ahk_class Notepad ahk_id " id)
    MsgBox "The mouse is over Notepad."
```

<a id="LastFoundWindow"></a>
## Last Found Window

This is the window most recently found by [WinExist](../lib/WinExist.md), [WinActive](../lib/WinActive.md), [WinWait[Not]Active](../lib/WinWaitActive.md), [WinWait](../lib/WinWait.md), or [WinWaitClose](../lib/WinWaitClose.md). It can make scripts easier to create and maintain since *WinTitle* and *WinText* of the target window do not need to be repeated for every windowing function. In addition, scripts perform better because they don't need to search for the target window again after it has been found the first time.

The last found window can be used by all of the windowing functions except [WinWait](../lib/WinWait.md), [WinActivateBottom](../lib/WinActivateBottom.md), [GroupAdd](../lib/GroupAdd.md), [WinGetCount](../lib/WinGetCount.md), and [WinGetList](../lib/WinGetList.md). To use it, simply omit all four window parameters (*WinTitle*, *WinText*, *ExcludeTitle*, and *ExcludeText*).

Each [thread](Threads.md) retains its own value of the last found window, meaning that if the [current thread](Threads.md) is interrupted by another, when the original thread is resumed it will still have its original value of the last found window, not that of the interrupting thread.

If the last found window is a hidden [Gui window](../lib/Gui.md), it can be used even when [DetectHiddenWindows](../lib/DetectHiddenWindows.md) is turned off. This is often used in conjunction with the GUI's [+LastFound](../lib/Gui.md#LastFound) option.

The following example opens Notepad, waits until it exists and activates it:

```ahk
Run "Notepad"
WinWait "Untitled - Notepad"
WinActivate ; Use the window found by WinWait.
```

The following example activates and maximizes the Notepad window found by WinExist:

```ahk
if WinExist("Untitled - Notepad")
{
    WinActivate ; Use the window found by WinExist.
    WinMaximize ; Same as above.
    Send "Some text.{Enter}"
}
```

The following example activates the calculator found by WinExist and moves it to a new position:

```ahk
if not WinExist("Calculator")
{
    ; ...
}
else
{
    WinActivate ; Use the window found by WinExist.
    WinMove 40, 40 ; Same as above.
}
```

<a id="Related"></a>
## Related

[ControlID Parameter (Window Control Identifiers)](ControlID.md)
