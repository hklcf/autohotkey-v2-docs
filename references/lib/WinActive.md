# WinActive

Checks if the specified window is active and returns its unique ID (HWND).

```ahk
HWND := WinActive(WinTitle, WinText, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the [unique ID (HWND)](../misc/WinTitle.md#ahk_id) of the active window if it matches the specified criteria, or 0 if it does not.

Since all non-zero numbers are seen as "true", the statement `if WinActive(WinTitle)` is true whenever *WinTitle* is active.

<a id="Remarks"></a>
## Remarks

If the active window is a qualified match, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be updated to be the active window.

An easy way to retrieve the unique ID of the active window is with `ActiveHwnd := WinExist("A")`.

[SetWinDelay](SetWinDelay.md) does not apply to this function.

<a id="Related"></a>
## Related

[WinExist](WinExist.md), [SetTitleMatchMode](SetTitleMatchMode.md), [DetectHiddenWindows](DetectHiddenWindows.md), [Last Found Window](../misc/WinTitle.md#LastFoundWindow), [WinActivate](WinActivate.md), [WinWaitActive](WinWaitActive.md), [WinWait](WinWait.md), [WinWaitClose](WinWaitClose.md), [#HotIf](_HotIf.md)

<a id="Examples"></a>
## Examples

<a id="ExLastFound"></a>

**Example:** Closes either Notepad or another window, depending on which of them was found by the WinActive functions above. Note that the space between an "ahk_" keyword and its criterion value can be omitted; this is especially useful when using variables, as shown by the second WinActive.

```ahk
if WinActive("ahk_class Notepad") or WinActive("ahk_class" ClassName)
    WinClose ; Use the window found by WinActive.
```
