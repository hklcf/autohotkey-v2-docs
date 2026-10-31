# WinMove

Changes the position and/or size of the specified window.

```ahk
WinMove X, Y, Width, Height, WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**X, Y**

Type: [Integer](../Concepts.md#numbers)

If either is omitted, the position in that dimension will not be changed. Otherwise, specify the X and Y coordinates (in pixels) of the upper left corner of the target window's new location. The upper-left pixel of the screen is at 0, 0.

**Width, Height**

Type: [Integer](../Concepts.md#numbers)

If either is omitted, the size in that dimension will not be changed. Otherwise, specify the new width and height of the window (in pixels).

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

An [OSError](Error.md#OSError) is thrown if an internal function call reported failure. However, success may be reported even if the window has not moved, such as if the window restricts its own movement.

<a id="Remarks"></a>
## Remarks

If *Width* or *Height* is small (or negative), most windows with a title bar will generally go no smaller than 112 x 27 pixels (however, some types of windows may have a different minimum size). If *Width* or *Height* is large, most windows will go no larger than approximately 12 pixels beyond the dimensions of the desktop.

Negative X and Y coordinates are allowed to support multi-monitor systems and to move a window entirely off-screen.

Although WinMove cannot move minimized windows, it can move hidden windows if [DetectHiddenWindows](DetectHiddenWindows.md) is on.

The speed of WinMove is affected by [SetWinDelay](SetWinDelay.md).

On systems with multiple screens which have different DPI settings, the final position and size of the window may differ from the requested values due to [OS DPI scaling](../misc/DPIScaling.md).

<a id="Related"></a>
## Related

[ControlMove](ControlMove.md), [WinGetPos](WinGetPos.md), [WinHide](WinHide.md), [WinMinimize](WinMinimize.md), [WinMaximize](WinMaximize.md), [Win functions](Win.md)

<a id="Examples"></a>
## Examples

<a id="ExLastFound"></a>

**Example:** Opens the calculator, waits until it exists and moves it to the upper-left corner of the screen.

```ahk
Run "calc.exe"
WinWait "Calculator"
WinMove 0, 0 ; Use the window found by WinWait.
```

<a id="ExBasic"></a>

**Example:** Creates a fixed-size popup window that shows the contents of the clipboard, and moves it to the upper-left corner of the screen.

```ahk
MyGui := Gui("ToolWindow -Sysmenu Disabled", "The clipboard contains:")
MyGui.Add("Text",, A_Clipboard)
MyGui.Show("w400 h300")
WinMove 0, 0,,, MyGui
MsgBox "Press OK to dismiss the popup window"
MyGui.Destroy()
```

<a id="ExCenter"></a>

**Example:** Centers a window on the screen.

```ahk
CenterWindow("ahk_class Notepad")

CenterWindow(WinTitle)
{
    WinGetPos ,, &Width, &Height, WinTitle
    WinMove (A_ScreenWidth/2)-(Width/2), (A_ScreenHeight/2)-(Height/2),,, WinTitle
}
```
