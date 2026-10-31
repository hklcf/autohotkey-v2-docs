# WinGetText

Retrieves the text from the specified window.

```ahk
Text := WinGetText(WinTitle, WinText, ExcludeTitle, ExcludeText)
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

Type: [String](../Concepts.md#strings)

This function returns the text of the specified window.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

An [Error](Error.md) is thrown if there was a problem retrieving the window's text.

<a id="Remarks"></a>
## Remarks

The text retrieved is generally the same as what [Window Spy](../Program.md#Window_Spy) shows for that window. However, if [DetectHiddenText](DetectHiddenText.md) has been turned off, hidden text is omitted from the return value.

Each text element ends with a carriage return and linefeed (CR+LF), which can be represented in the script as \`r\`n. To extract individual lines or substrings, use functions such as [InStr](InStr.md) and [SubStr](SubStr.md). A [parsing loop](LoopParse.md) can also be used to examine each line or word one by one.

If the retrieved text appears to be truncated (incomplete), it may be necessary to retrieve the text by sending the WM_GETTEXT message via [SendMessage](SendMessage.md) instead. This is because some applications do not respond properly to the WM_GETTEXTLENGTH message, which causes AutoHotkey to make the return value too small to fit all the text.

This function might use a large amount of RAM if the target window (e.g. an editor with a large document open) contains a large quantity of text. To avoid this, it might be possible to retrieve only portions of the window's text by using [ControlGetText](ControlGetText.md) instead. In any case, a variable's memory can be freed later by assigning it to nothing, i.e. `Text := ""`.

It is not necessary to do `SetTitleMatchMode "Slow"` because WinGetText always retrieves the text using the slow mode (since it works on a broader range of control types).

To retrieve an array of all controls in a window, use [WinGetControls](WinGetControls.md) or [WinGetControlsHwnd](WinGetControlsHwnd.md).

<a id="Related"></a>
## Related

[ControlGetText](ControlGetText.md), [WinGetTitle](WinGetTitle.md), [WinGetPos](WinGetPos.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Opens the calculator, waits until it exists, and retrieves and reports its text.

```ahk
Run "calc.exe"
WinWait "Calculator"
MsgBox "The text is:`n" WinGetText() ; Use the window found by WinWait.
```
