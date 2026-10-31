# WinWaitActive / WinWaitNotActive

Waits until the specified window is active or not active.

```ahk
HWND := WinWaitActive(WinTitle, WinText, Timeout, ExcludeTitle, ExcludeText)
Boolean := WinWaitNotActive(WinTitle, WinText, Timeout, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

**Timeout**

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

If omitted, the function will wait indefinitely. Otherwise, it will wait no longer than this many seconds. To wait for a fraction of a second, specify a floating-point number, for example, 0.25 to wait for a maximum of 250 milliseconds.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers) or [Integer (boolean)](../Concepts.md#boolean)

WinWaitActive returns the [HWND (unique ID)](../misc/WinTitle.md#ahk_id) of the active window if it matches the criteria, or 0 if the function timed out.

WinWaitNotActive returns 1 (true) if the active window does not match the criteria, or 0 (false) if the function timed out.

<a id="Remarks"></a>
## Remarks

If the active window satisfies the function's expectation, the function will not wait for *Timeout* to expire. Instead, it will immediately return, allowing the script to resume.

Since `"A"` matches whichever window is active at any given moment, `WinWaitNotActive "A"` typically waits indefinitely. To instead wait for a different window to become active, specify its HWND as in the following example:

```ahk
WinWaitNotActive WinExist("A")
```

Both WinWaitActive and WinWaitNotActive will update the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) if a matching window is active when the function begins or becomes active while the function is waiting.

While the function is in a waiting state, new [threads](../misc/Threads.md) can be launched via [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md).

If another [thread](../misc/Threads.md) changes the contents of any variable(s) that were used for this function's parameters, the function will not see the change -- it will continue to use the title and text that were originally present in the variables when the function first started waiting.

<a id="Related"></a>
## Related

[WinWait](WinWait.md), [WinWaitClose](WinWaitClose.md), [WinExist](WinExist.md), [WinActive](WinActive.md), [SetTitleMatchMode](SetTitleMatchMode.md), [DetectHiddenWindows](DetectHiddenWindows.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Opens Notepad and waits a maximum of 2 seconds until it is active. If WinWait times out, an error message is shown, otherwise Notepad is minimized.

```ahk
Run "notepad.exe"
if WinWaitActive("Untitled - Notepad", , 2)
    WinMinimize ; Use the window found by WinWaitActive.
else
    MsgBox "WinWaitActive timed out."
```
