# ControlSetText

Changes the text of a control.

```ahk
ControlSetText NewText, ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**NewText**

Type: [String](../Concepts.md#strings)

The new text to set into the control.

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

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to use [GuiControl.Text](GuiControl.md#Text) or [GuiControl.Value](GuiControl.md#Value).

Most control types use carriage return and linefeed (\`r\`n) rather than a solitary linefeed (\`n) to mark the end of each line. To translate a block of text containing \`n characters, follow this example:

```ahk
MyVar := StrReplace(MyVar, "`n", "`r`n")
```

To improve reliability, a delay is done automatically after each use of this function. That delay can be changed via [SetControlDelay](SetControlDelay.md) or by assigning a value to [A_ControlDelay](../Variables.md#ControlDelay). For details, see [SetControlDelay remarks](SetControlDelay.md#Remarks).

<a id="Related"></a>
## Related

[SetControlDelay](SetControlDelay.md), [ControlGetText](ControlGetText.md), [GuiControl.Text](GuiControl.md#Text), [GuiControl.Value](GuiControl.md#Value), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Changes the text of Notepad's edit control. This example may fail on Windows 11 or later, as it requires the classic version of Notepad.

```ahk
ControlSetText("New Text Here", "Edit1", "Untitled -")
```

<a id="ExMainWin"></a>

**Example:** Changes the text of the [main window](../Program.md#main-window)'s edit control.

```ahk
ListVars
WinWaitActive "ahk_class AutoHotkey"
ControlSetText "New Text Here", "Edit1" ; Use the window found above.
```
