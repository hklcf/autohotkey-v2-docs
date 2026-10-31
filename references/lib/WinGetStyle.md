# WinGetStyle / WinGetExStyle

Returns the style or extended style (respectively) of the specified window.

```ahk
Style := WinGetStyle(WinTitle, WinText, ExcludeTitle, ExcludeText)
ExStyle := WinGetExStyle(WinTitle, WinText, ExcludeTitle, ExcludeText)
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

Type: [Integer](../Concepts.md#numbers)

These functions return the style or extended style (respectively) of the specified window.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

<a id="Remarks"></a>
## Remarks

See the [styles table](../misc/Styles.md) for a partial listing of styles.

<a id="Related"></a>
## Related

[WinSetStyle / WinSetExStyle](WinSetStyle.md), [ControlGetStyle / ControlGetExStyle](ControlGetStyle.md), [styles table](../misc/Styles.md), [Win functions](Win.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExStyle"></a>

**Example:** Determines whether a window has the WS_DISABLED style.

```ahk
Style := WinGetStyle("My Window Title")
if (Style & 0x8000000)  ; 0x8000000 is WS_DISABLED.
    MsgBox "The window is disabled."
```

<a id="ExExStyle"></a>

**Example:** Determines whether a window has the WS_EX_TOPMOST style (always-on-top).

```ahk
ExStyle := WinGetExStyle("My Window Title")
if (ExStyle & 0x8)  ; 0x8 is WS_EX_TOPMOST.
    MsgBox "The window is always-on-top."
```
