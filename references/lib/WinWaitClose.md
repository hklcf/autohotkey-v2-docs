# WinWaitClose

Waits until no matching windows can be found.

```ahk
Boolean := WinWaitClose(WinTitle, WinText, Timeout, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

**Timeout**

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

If omitted, the function will wait indefinitely. Otherwise, it will wait no longer than this many seconds. To wait for a fraction of a second, specify a floating-point number, for example, 0.25 to wait for a maximum of 250 milliseconds.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 0 (false) if the function timed out or 1 (true) otherwise.

<a id="Remarks"></a>
## Remarks

Whenever no matching windows exist, the function will not wait for *Timeout* to expire. Instead, it will immediately return 1 and the script will continue executing. Conversely, the function may continue waiting even after a matching window is closed, until no more matching windows can be found.

If *WinTitle* specifies a [pure HWND](../misc/WinTitle.md#ahk_id) (as an [Integer](../Concepts.md#numbers) or an [Object](../Objects.md) with a Hwnd property), hidden windows are detected only when using [DetectHiddenWindows](DetectHiddenWindows.md). This only applies to [WinWait](WinWait.md) and WinWaitClose; for other windowing functions, specifying a pure HWND causes hidden windows to be detected regardless of DetectHiddenWindows.

Since `"A"` matches whichever window is active at any given moment, `WinWaitClose "A"` typically waits indefinitely. To instead wait for the current active window to close, specify its title or HWND as in the following example:

```ahk
WinWaitClose WinExist("A")
```

WinWaitClose updates the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) whenever it finds a matching window. One use for this is to identify or operate on the window after the function times out. For example:

```ahk
Gui("", "Test window " Random()).Show("w300 h50")  ; Show a test window.
if !WinWaitClose("Test",, 5)  ; Wait 5 seconds for someone to close it.
{
    MsgBox "Window not yet closed: " WinGetTitle()
    WinClose  ; Close the window found by WinWaitClose.
}
```

While the function is in a waiting state, new [threads](../misc/Threads.md) can be launched via [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md).

If another [thread](../misc/Threads.md) changes the contents of any variable(s) that were used for this function's parameters, the function will not see the change -- it will continue to use the title and text that were originally present in the variables when the function first started waiting.

<a id="Related"></a>
## Related

[WinClose](WinClose.md), [WinWait](WinWait.md), [WinWaitActive](WinWaitActive.md), [WinExist](WinExist.md), [WinActive](WinActive.md), [ProcessWaitClose](ProcessWaitClose.md), [SetTitleMatchMode](SetTitleMatchMode.md), [DetectHiddenWindows](DetectHiddenWindows.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Opens Notepad, waits until it exists and then waits until it is closed.

```ahk
Run "notepad.exe"
WinWait "Untitled - Notepad"
WinWaitClose ; Use the window found by WinWait.
MsgBox "Notepad is now closed."
```
