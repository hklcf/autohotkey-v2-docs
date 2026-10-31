# ControlGetStyle / ControlGetExStyle

Returns an integer representing the style or extended style of a control.

```ahk
Style := ControlGetStyle(ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText)
ExStyle := ControlGetExStyle(ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**ControlID**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

The control's ClassNN, text or HWND, or an object with a Hwnd property. For details, see [Control Identifiers](../misc/ControlID.md).

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

These functions return an integer representing the style or extended style of the control.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found.

<a id="Remarks"></a>
## Remarks

This function works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected.

See the [styles table](../misc/Styles.md) for a partial listing of styles.

ControlGetExStyle only retrieves generic extended styles, such as WS_EX_CLIENTEDGE (0x200). To retrieve control-specific extended styles, use [SendMessage](SendMessage.md). For example, `SendMessage(0x1037, 0, 0, "SysListView321")`, where 0x1037 is [LVM_GETEXTENDEDLISTVIEWSTYLE](https://learn.microsoft.com/windows/win32/controls/lvm-getextendedlistviewstyle), returns the extended style of a list-view control.

<a id="Related"></a>
## Related

[ControlSetStyle / ControlSetExStyle](ControlSetStyle.md), [WinGetStyle / WinGetExStyle](WinGetStyle.md), [styles table](../misc/Styles.md), [Control functions](Control.md)
