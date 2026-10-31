# WinRestore

Unminimizes or unmaximizes the specified window if it is minimized or maximized.

```ahk
WinRestore WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found, except if the [group](#group) mode is used.

<a id="Remarks"></a>
## Remarks

If a particular type of window does not respond correctly to WinRestore, try using the following instead:

```ahk
PostMessage 0x0112, 0xF120,,, WinTitle, WinText  ; 0x0112 = WM_SYSCOMMAND, 0xF120 = SC_RESTORE
```

<a id="group"></a>

This function operates only upon the topmost matching window except when *WinTitle* is [ahk_group GroupName](GroupAdd.md), in which case all windows in the group are affected.

<a id="Related"></a>
## Related

[WinMinimize](WinMinimize.md), [WinMaximize](WinMaximize.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Unminimizes or unmaximizes Notepad if it is minimized or maximized.

```ahk
WinRestore "Untitled - Notepad"
```
