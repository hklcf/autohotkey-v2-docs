# ControlClick

Sends a mouse button or mouse wheel event to a window or control.

```ahk
ControlClick ControlID-or-Pos, WinTitle, WinText, WhichButton, ClickCount, Options, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**ControlID-or-Pos**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If omitted, the target window itself will be clicked. Otherwise, use one of the following modes:

**Mode 1 (Position):** Specify the X and Y coordinates relative to the upper left corner of the target window's client area, which is the area not including title bar, menu bar, and borders. The X coordinate must precede the Y coordinate and there must be at least one space or tab between them. For example: `"X55 Y33"`. If there is a control at the specified coordinates, it will be sent the click-event at those exact coordinates. If there is no control, the target window itself will be sent the event (which might have no effect depending on the nature of the window).

> **Note:** In mode 1, the X and Y option letters of the *Options* parameter are ignored.

**Mode 2 (Control Identifier):** Specify the control's ClassNN, text or HWND, or an object with a Hwnd property. For details, see [Control Identifiers](../misc/ControlID.md).

By default, mode 2 takes precedence over mode 1. For example, in the unlikely event that there is a control whose text or ClassNN has the format "Xnnn Ynnn", it would be acted upon by mode 2. To override this and use mode 1 unconditionally, specify the word Pos in *Options* as in the following example: `ControlClick "x255 y152", WinTitle,,,, "Pos"`.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

**WhichButton**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to Left (the left mouse button). Otherwise, specify the button to click or the rotate/push direction of the mouse wheel.

**Button:** Left, Right, Middle (or just the first letter of each of these); or X1 (fourth button) or X2 (fifth button).

**Mouse wheel:** Specify WheelUp or WU to turn the wheel upward (away from you); specify WheelDown or WD to turn the wheel downward (toward you). Specify WheelLeft (or WL) or WheelRight (or WR) to push the wheel left or right, respectively. *ClickCount* is the number of notches to turn the wheel.

**ClickCount**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1. Otherwise, specify the number of times to click the mouse button or turn the mouse wheel.

**Options**

Type: [String](../Concepts.md#strings)

If blank or omitted, each click consists of a down-event followed by an up-event, and occurs at the center of the control when mode 2 is in effect. Otherwise, specify a series of one or more of the following options, each separated from the next by zero or more spaces or tabs. For example: `"d x50 y25"`.

**NA:** May improve reliability. See [reliability](#Reliability) below.

**D:** Press the mouse button down but do not release it (i.e. generate a down-event). If both the D and U options are absent, a complete click (down and up) will be sent.

**U:** Release the mouse button (i.e. generate an up-event). This option should not be present if the D option is already present (and vice versa).

**Pos:** Specify the word Pos anywhere in *Options* to unconditionally use the X/Y positioning mode as described in the *ControlID-or-Pos* parameter above.

**X***n*: Specify for *n* the X position to click at, relative to the control's upper left corner. If unspecified, the click will occur at the horizontal-center of the control.

**Y***n*: Specify for *n* the Y position to click at, relative to the control's upper left corner. If unspecified, the click will occur at the vertical-center of the control.

Use decimal (not hexadecimal) numbers for the X and Y options. The numbers are in pixels.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown in the following cases:

- [TargetError](Error.md#TargetError): The target window could not be found.
- [TargetError](Error.md#TargetError): The target control could not be found and *ControlID-or-Pos* does not specify a valid position.
- [OSError](Error.md#OSError) (very rare): the X or Y position is omitted and the control's position could not be determined.
- [ValueError](Error.md#ValueError) or [TypeError](Error.md#TypeError): Invalid parameters were detected.

<a id="Reliability"></a>
## Reliability

To improve reliability -- especially during times when the user is physically moving the mouse during the ControlClick -- one or both of the following may help:

1) Use `SetControlDelay -1` prior to ControlClick. This avoids holding the mouse button down during the click, which in turn reduces interference from the user's physical movement of the mouse.

2) Specify the string NA anywhere in the sixth parameter (*Options*) as shown below:

```ahk
SetControlDelay -1
ControlClick "Toolbar321", WinTitle,,,, "NA"
```

The NA option avoids marking the target window as active and avoids merging its input processing with that of the script, which may prevent physical movement of the mouse from interfering (but usually only when the target window is not active). However, this method might not work for all types of windows and controls.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to manipulate them via their [GuiControl](GuiControl.md) object (assuming a suitable counterpart exists) or call their [Click event callback](GuiOnEvent.md#Click) directly.

Not all applications obey a *ClickCount* higher than 1 for turning the mouse wheel. For those applications, use a loop to turn the wheel more than one notch as in this example, which turns it 5 notches:

```ahk
Loop 5
    ControlClick ControlID, WinTitle, WinText, "WheelUp"
```

<a id="Related"></a>
## Related

[SetControlDelay](SetControlDelay.md), [Control functions](Control.md), [Click](Click.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Clicks the OK button in a GUI or non-GUI window.

```ahk
ControlClick "OK", "Some Window Title"
```

<a id="ExCoord"></a>

**Example:** Clicks at specific coordinates in a GUI or non-GUI window.

```ahk
ControlClick "x55 y77", "Some Window Title"
```

<a id="ExReliability"></a>

**Example:** Clicks more reliably at specific coordinates relative to a control in a GUI or non-GUI window.

```ahk
SetControlDelay -1  ; May improve reliability and reduce side effects.
ControlClick "Toolbar321", "Some Window Title",,,, "NA x192 y10"
```
