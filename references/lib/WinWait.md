# WinWait

Waits until the specified window exists.

```ahk
HWND := WinWait(WinTitle, WinText, Timeout, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

At least one of these is required. Specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

**Timeout**

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

If omitted, the function will wait indefinitely. Otherwise, it will wait no longer than this many seconds. To wait for a fraction of a second, specify a floating-point number, for example, 0.25 to wait for a maximum of 250 milliseconds.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the [HWND (unique ID)](../misc/WinTitle.md#ahk_id) of a matching window if one was found, or 0 if the function timed out.

<a id="Remarks"></a>
## Remarks

If a matching window comes into existence, the function will not wait for *Timeout* to expire. Instead, it will update the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) and return, allowing the script to continue execution.

If *WinTitle* specifies a [pure HWND](../misc/WinTitle.md#ahk_id) (as an [Integer](../Concepts.md#numbers) or an [Object](../Objects.md) with a Hwnd property), hidden windows are detected only when using [DetectHiddenWindows](DetectHiddenWindows.md). This only applies to WinWait and [WinWaitClose](WinWaitClose.md); for other windowing functions, specifying a pure HWND causes hidden windows to be detected regardless of DetectHiddenWindows.

If *WinTitle* specifies an invalid pure HWND, the function returns immediately, without waiting for *Timeout* to expire. Waiting for another window to be created with the same HWND value would not be meaningful, as there would likely be no relation between the two windows.

While the function is in a waiting state, new [threads](../misc/Threads.md) can be launched via [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md).

If another [thread](../misc/Threads.md) changes the contents of any variable(s) that were used for this function's parameters, the function will not see the change -- it will continue to use the title and text that were originally present in the variables when the function first started waiting.

Unlike [WinWaitActive](WinWaitActive.md), the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) cannot be used. Therefore, at least one of the window parameters (*WinTitle*, *WinText*, *ExcludeTitle*, *ExcludeText*) must be non-blank.

<a id="Related"></a>
## Related

[WinWaitActive](WinWaitActive.md), [WinWaitClose](WinWaitClose.md), [WinExist](WinExist.md), [WinActive](WinActive.md), [ProcessWait](ProcessWait.md), [SetTitleMatchMode](SetTitleMatchMode.md), [DetectHiddenWindows](DetectHiddenWindows.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Opens Notepad and waits a maximum of 3 seconds until it exists. If WinWait times out, an error message is shown, otherwise Notepad is minimized.

```ahk
Run "notepad.exe"
if WinWait("Untitled - Notepad", , 3)
    WinMinimize ; Use the window found by WinWait.
else
    MsgBox "WinWait timed out."
```
