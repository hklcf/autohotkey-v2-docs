# WinClose

Closes the specified window.

```ahk
WinClose WinTitle, WinText, SecondsToWait, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

**SecondsToWait**

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

If omitted, the function will not wait at all. Otherwise, specify the number of seconds (can contain a decimal point) to wait for the window to close. If the window does not close within that period, the script will continue.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found, except if the [group](#group) mode is used.

No exception is thrown if a window is found but cannot be closed, so use [WinExist](WinExist.md) or [WinWaitClose](WinWaitClose.md) if you need to determine for certain that a window has closed.

<a id="Remarks"></a>
## Remarks

This function sends a close message to a window. The result depends on the window (it may ask to save data, etc.)

If a matching window is active, that window will be closed in preference to any other matching window. In general, if more than one window matches, the topmost (most recently used) will be closed.

<a id="group"></a>

This function operates only upon a single window except when *WinTitle* is [ahk_group GroupName](GroupAdd.md) (with no other criteria specified), in which case all windows in the group are affected.

While the function is in a waiting state, new [threads](../misc/Threads.md) can be launched via [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md).

WinClose sends a WM_CLOSE message to the target window, which is a somewhat forceful method of closing it. An alternate method of closing is to send the following message. It might produce different behavior because it is similar in effect to pressing `Alt`+`F4` or clicking the window's close button in its title bar:

```ahk
PostMessage 0x0112, 0xF060,,, WinTitle, WinText  ; 0x0112 = WM_SYSCOMMAND, 0xF060 = SC_CLOSE
```

If a window does not close via WinClose, you can force it to close with [WinKill](WinKill.md).

<a id="Related"></a>
## Related

[WinKill](WinKill.md), [WinWaitClose](WinWaitClose.md), [ProcessClose](ProcessClose.md), [WinActivate](WinActivate.md), [SetTitleMatchMode](SetTitleMatchMode.md), [DetectHiddenWindows](DetectHiddenWindows.md), [Last Found Window](../misc/WinTitle.md#LastFoundWindow), [WinExist](WinExist.md), [WinActive](WinActive.md), [WinWaitActive](WinWaitActive.md), [WinWait](WinWait.md), [GroupActivate](GroupActivate.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** If Notepad does exist, close it, otherwise close the calculator.

```ahk
if WinExist("Untitled - Notepad")
    WinClose ; Use the window found by WinExist.
else
    WinClose "Calculator"
```
