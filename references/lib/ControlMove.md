# ControlMove

Moves and/or resizes a control.

```ahk
ControlMove X, Y, Width, Height, ControlID, WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**X, Y**

Type: [Integer](../Concepts.md#numbers)

If either is omitted, the control's position in that dimension will not be changed. Otherwise, specify the X and Y coordinates (in pixels) of the upper left corner of the control's new location. The coordinates are relative to the upper-left corner of the target window's client area (which is the area not including title bar, menu bar, and borders); [ControlGetPos](ControlGetPos.md) or [Window Spy](../Program.md#Window_Spy) can be used to determine them.

**Width, Height**

Type: [Integer](../Concepts.md#numbers)

If either is omitted, the control's size in that dimension will not be changed. Otherwise, specify the new width and height of the control (in pixels).

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

An [OSError](Error.md#OSError) is thrown if the control's current position could not be determined.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to use [GuiControl.Move](GuiControl.md#Move).

To improve reliability, a delay is done automatically after each use of this function. That delay can be changed via [SetControlDelay](SetControlDelay.md) or by assigning a value to [A_ControlDelay](../Variables.md#ControlDelay). For details, see [SetControlDelay remarks](SetControlDelay.md#Remarks).

<a id="Related"></a>
## Related

[ControlGetPos](ControlGetPos.md), [WinMove](WinMove.md), [SetControlDelay](SetControlDelay.md), [GuiControl.Move](GuiControl.md#Move), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExControlMoveTimer"></a>

**Example:** Demonstrates how to manipulate the OK button of an input box while the script is waiting for user input.

```ahk
SetTimer ControlMoveTimer
IB := InputBox(, "My Input Box")

ControlMoveTimer()
{
    if !WinExist("My Input Box")
        return
    ; Otherwise the above set the "last found" window for us:
    SetTimer , 0
    WinActivate
    ControlMove 10,, 200,, "OK"  ; Move the OK button to the left and increase its width.
}
```
