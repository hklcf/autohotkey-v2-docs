# ControlGetText

Retrieves text from a control.

```ahk
Text := ControlGetText(ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText)
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

Type: [String](../Concepts.md#strings)

This function returns the text of the specified control.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to use [GuiControl.Text](GuiControl.md#Text) or [GuiControl.Value](GuiControl.md#Value).

To retrieve text from a list box, combo box, drop-down list, or list-view control, use [ControlGetItems](ControlGetItems.md) or [ListViewGetContent](ListViewGetContent.md) instead.

If the retrieved text appears to be truncated (incomplete), it may be necessary to retrieve the text by sending the WM_GETTEXT message via [SendMessage](SendMessage.md) instead. This is because some applications do not respond properly to the WM_GETTEXTLENGTH message, which causes AutoHotkey to make the return value too small to fit all the text.

This function might use a large amount of RAM if the target control (e.g. an editor with a large document open) contains a large quantity of text. However, a variable's memory can be freed after use by assigning it to nothing, i.e. `Text := ""`.

Text retrieved from most control types uses carriage return and linefeed (\`r\`n) rather than a solitary linefeed (\`n) to mark the end of each line.

It is not necessary to do `SetTitleMatchMode "Slow"` because ControlGetText always retrieves the text using the slow mode (since it works on a broader range of control types).

To retrieve an array of all controls in a window, use [WinGetControls](WinGetControls.md) or [WinGetControlsHwnd](WinGetControlsHwnd.md).

<a id="Related"></a>
## Related

[ControlSetText](ControlSetText.md), [WinGetText](WinGetText.md), [GuiControl.Text](GuiControl.md#Text), [GuiControl.Value](GuiControl.md#Value), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves the current text from Notepad's edit control and stores it in *Text*. This example may fail on Windows 11 or later, as it requires the classic version of Notepad.

```ahk
Text := ControlGetText("Edit1", "Untitled -")
```

<a id="ExMainWin"></a>

**Example:** Retrieves and reports the current text from the [main window](../Program.md#main-window)'s edit control.

```ahk
ListVars
WinWaitActive "ahk_class AutoHotkey"
MsgBox ControlGetText("Edit1") ; Use the window found above.
```
