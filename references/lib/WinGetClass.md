# WinGetClass

Retrieves the specified window's class name.

```ahk
ClassName := WinGetClass(WinTitle, WinText, ExcludeTitle, ExcludeText)
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

This function returns the [class name](../misc/WinTitle.md#ahk_class) of the specified window.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

An [OSError](Error.md#OSError) is thrown if the class name could not be retrieved.

<a id="Remarks"></a>
## Remarks

Only the class name is retrieved (the prefix "ahk_class" is not included in the return value).

For a general explanation of window classes and one way to use them, see [ahk_class](../misc/WinTitle.md#ahk_class).

<a id="Related"></a>
## Related

[WinGetTitle](WinGetTitle.md), [Win functions](Win.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves and reports the class name of the active window.

```ahk
MsgBox "The active window's class is " WinGetClass("A")
```
