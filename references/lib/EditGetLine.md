# EditGetLine

Returns the text of a line in an edit control by line number.

```ahk
Line := EditGetLine(N, ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**N**

Type: [Integer](../Concepts.md#numbers)

The line number. The first line is 1, the second 2, and so on.

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

This function returns the text of line *N*. Depending on the nature of the control, the string might end in a carriage return (\`r) or a carriage return + linefeed (\`r\`n).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found.

A [ValueError](Error.md#ValueError) is thrown if *N* is out of range or otherwise invalid.

An [OSError](Error.md#OSError) is thrown if a message could not be sent to the control.

<a id="Remarks"></a>
## Remarks

This function works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected.

<a id="Related"></a>
## Related

[EditGetCurrentCol](EditGetCurrentCol.md), [EditGetCurrentLine](EditGetCurrentLine.md), [EditGetLineCount](EditGetLineCount.md), [EditGetSelectedText](EditGetSelectedText.md), [EditPaste](EditPaste.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reports the text of the second line in the first edit control of a GUI or non-GUI window.

```ahk
MsgBox EditGetLine(2, "Edit1", "Some Window Title")
```
