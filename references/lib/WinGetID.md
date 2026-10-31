# WinGetID

Returns the unique ID (HWND) of the specified window.

```ahk
HWND := WinGetID(WinTitle, WinText, ExcludeTitle, ExcludeText)
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

This function returns the [window handle (HWND)](../misc/WinTitle.md#ahk_id) of the specified window.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

<a id="Remarks"></a>
## Remarks

A unique ID (HWND) is valid only during its lifetime. In other words, if an application restarts, all of its windows and controls will get new HWNDs.

To discover the HWND of the window that the mouse is currently hovering over, use [MouseGetPos](MouseGetPos.md).

To get the [HWND of a control](../misc/ControlID.md#HWND), use [ControlGetHwnd](ControlGetHwnd.md) or similar.

<a id="Related"></a>
## Related

[WinGetIDLast](WinGetIDLast.md), [WinExist](WinExist.md), [ControlGetHwnd](ControlGetHwnd.md), [Gui.Hwnd](Gui.md#Hwnd), [Win functions](Win.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Maximizes the active window and reports its [HWND](../misc/ControlID.md#HWND).

```ahk
active_id := WinGetID("A")
WinMaximize active_id
MsgBox "The active window's HWND is " active_id
```
