# WinSetTitle

Changes the title of the specified window.

```ahk
WinSetTitle NewTitle , WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**NewTitle**

Type: [String](../Concepts.md#strings)

The new title for the window. If this is the only parameter given, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

An [OSError](Error.md#OSError) is thrown if the change could not be applied.

<a id="Remarks"></a>
## Remarks

A change to a window's title might be merely temporary if the application that owns the window frequently changes the title.

<a id="Related"></a>
## Related

[WinMove](WinMove.md), [WinGetTitle](WinGetTitle.md), [WinGetText](WinGetText.md), [ControlGetText](ControlGetText.md), [WinGetPos](WinGetPos.md), [Win functions](Win.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Changes the title of Notepad. This example may fail on Windows 11 or later, as it requires the classic version of Notepad.

```ahk
WinSetTitle("This is a new title", "Untitled - Notepad")
```

<a id="ExLastFound"></a>

**Example:** Opens Notepad, waits until it is active and changes its title. This example may fail on Windows 11 or later, as it requires the classic version of Notepad.

```ahk
Run "notepad.exe"
WinWaitActive "Untitled - Notepad"
WinSetTitle "This is a new title" ; Use the window found by WinWaitActive.
```

<a id="ExMainWin"></a>

**Example:** Opens the [main window](../Program.md#main-window), waits until it is active and changes its title.

```ahk
ListVars
WinWaitActive "ahk_class AutoHotkey"
WinSetTitle "This is a new title" ; Use the window found by WinWaitActive.
```
