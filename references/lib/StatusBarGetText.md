# StatusBarGetText

Retrieves the text from a standard status bar control.

```ahk
Text := StatusBarGetText(Part#, WinTitle, WinText, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**Part#**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1, which is usually the part that contains the text of interest. Otherwise, specify the part number of the bar to retrieve.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the text from a single part of the status bar control.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the target window could not be found or does not contain a standard status bar.

An [OSError](Error.md#OSError) is thrown if there was a problem sending the SB_GETPARTS message or no reply was received within 2000 ms, or if memory could not be allocated within the process which owns the status bar.

<a id="Remarks"></a>
## Remarks

This function attempts to read the first *standard* status bar on a window (Microsoft common control: msctls_statusbar32). Some programs use their own status bars or special versions of the MS common control, in which case the text cannot be retrieved.

Rather than using StatusBarGetText in a loop, it is usually more efficient to use [StatusBarWait](StatusBarWait.md), which contains optimizations that avoid the overhead of repeated calls to StatusBarGetText.

<a id="Related"></a>
## Related

[StatusBarWait](StatusBarWait.md), [WinGetTitle](WinGetTitle.md), [WinGetText](WinGetText.md), [ControlGetText](ControlGetText.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves and analyzes the text from the first part of a status bar.

```ahk
RetrievedText := StatusBarGetText(1, "Search Results")
if InStr(RetrievedText, "found")
    MsgBox "Search results have been found."
```
