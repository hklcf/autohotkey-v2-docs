# ControlGetPos

Retrieves the position and size of a control.

```ahk
ControlGetPos &OutX, &OutY, &OutWidth, &OutHeight, ControlID, WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**&OutX, &OutY**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify references to the output variables in which to store the X and Y coordinates (in pixels) of the control's upper left corner. These coordinates are relative to the upper-left corner of the target window's client area (which is the area not including title bar, menu bar, and borders) and thus are the same as those used by [ControlMove](ControlMove.md).

**&OutWidth, &OutHeight**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify references to the output variables in which to store the control's width and height (in pixels).

**ControlID**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

The control's ClassNN, text or HWND, or an object with a Hwnd property. For details, see [Control Identifiers](../misc/ControlID.md). This parameter is required; that is, it cannot be omitted.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to use [GuiControl.GetPos](GuiControl.md#GetPos).

Unlike functions that change a control, ControlGetPos does not have an automatic delay ([SetControlDelay](SetControlDelay.md) does not affect it).

<a id="Related"></a>
## Related

[ControlMove](ControlMove.md), [WinGetPos](WinGetPos.md), [GuiControl.GetPos](GuiControl.md#GetPos), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Continuously updates and displays the name and position of the control currently under the mouse cursor.

```ahk
Loop
{
    Sleep 100
    MouseGetPos ,, &WhichWindow, &WhichControl
    try ControlGetPos &x, &y, &w, &h, WhichControl, WhichWindow
    ToolTip WhichControl "`nX" X "`tY" Y "`nW" W "`t" H
}
```
