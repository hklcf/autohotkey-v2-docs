# WinGetControlsHwnd

Returns an array of unique IDs (HWNDs) for all controls in the specified window.

```ahk
HWNDs := WinGetControlsHwnd(WinTitle, WinText, ExcludeTitle, ExcludeText)
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

Type: [Array](Array.md)

This function returns an array of [unique IDs (HWNDs)](../misc/ControlID.md#HWND) for all controls in the specified window.

For example, if the return value is assigned to a variable named `HWNDs` and two controls are present, `HWNDs[1]` contains the HWND of the first control, `HWNDs[2]` contains the HWND of the second control, and `HWNDs.Length` returns the number 2.

Controls are sorted according to their Z-order, which is usually the same order as the navigation order via `Tab` if the window supports tabbing.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

<a id="Related"></a>
## Related

[WinGetControls](WinGetControls.md), [Win functions](Win.md), [Control functions](Control.md)
