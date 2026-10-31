# ControlGetIndex

Returns the index of the currently selected entry in a list box, combo box, or drop-down list, or the index of the active page in a tab control.

```ahk
Index := ControlGetIndex(ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText)
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

This function returns the index of the currently selected list entry or active tab page. The first entry or page is 1, the second is 2, and so on. If no entry is selected or no page is active, the return value is 0.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found, or if the control's class name does not contain "Combo", "List" or "Tab".

An [OSError](Error.md#OSError) is thrown if a message could not be sent to the control.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to use [GuiControl.Value](GuiControl.md#Value).

<a id="Related"></a>
## Related

[ControlChooseIndex](ControlChooseIndex.md), [ControlGetChoice](ControlGetChoice.md), [ControlChooseString](ControlChooseString.md), [GuiControl.Value](GuiControl.md#Value), [GuiControl.Choose](GuiControl.md#Choose), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExTab"></a>

**Example:** Reports the index of the active page in the first tab control of a GUI or non-GUI window.

```ahk
WhichTab := ControlGetIndex("SysTabControl321", "Some Window Title")
MsgBox "Tab #" WhichTab " is active."
```
