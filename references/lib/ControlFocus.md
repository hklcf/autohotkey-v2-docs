# ControlFocus

Sets keyboard focus to a control.

```ahk
ControlFocus ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText
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

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to use [GuiControl.Focus](GuiControl.md#Focus).

To be effective, the control's window generally must not be minimized or hidden.

To improve reliability, a delay is done automatically after each use of this function. That delay can be changed via [SetControlDelay](SetControlDelay.md) or by assigning a value to [A_ControlDelay](../Variables.md#ControlDelay). For details, see [SetControlDelay remarks](SetControlDelay.md#Remarks).

<a id="WM_NEXTDLGCTL"></a>

When a control is focused in response to user input, such as pressing `Tab`, the dialog manager applies additional effects which are independent of the control having focus. These effects are not applied by ControlFocus, and therefore the following limitations apply:

- Focusing a button does not automatically make it the default button, as would normally happen if a button is focused by user input. The default button can usually be activated by pressing `Enter`.
- If user input previously caused the default button to be temporarily changed, focusing a non-button control does not automatically restore the default highlight to the actual default button. Pressing `Enter` may then activate the default button even though it is not highlighted.
- Focusing an edit control does not automatically select its text. Instead, the caret is typically positioned wherever it was last time the control had focus.

The [WM_NEXTDLGCTL](https://learn.microsoft.com/windows/win32/dlgbox/wm-nextdlgctl) message can be used to focus the control and apply these additional effects. For example:

```ahk
WinExist("A") ; Set the Last Found Window to the active window.
hWndControl := ControlGetHwnd("Button1")  ; Get HWND of the first button.
SendMessage 0x0028, hWndControl, True  ; 0x0028 is WM_NEXTDLGCTL.
```

<a id="Related"></a>
## Related

[SetControlDelay](SetControlDelay.md), [ControlGetFocus](ControlGetFocus.md), [GuiControl.Focus](GuiControl.md#Focus), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Sets keyboard focus to the OK button in a GUI or non-GUI window.

```ahk
ControlFocus "OK", "Some Window Title"
```
