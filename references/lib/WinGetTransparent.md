# WinGetTransparent

Returns the degree of transparency of the specified window.

```ahk
TransDegree := WinGetTransparent(WinTitle, WinText, ExcludeTitle, ExcludeText)
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

Type: [Integer](../Concepts.md#numbers) or [String (empty)](../Concepts.md#nothing)

This function returns a number between 0 and 255 representing the degree of transparency of the specified window, where 0 indicates an invisible window and 255 indicates an opaque window.

The return value is an empty string in the following cases:

- The window has no transparency level.
- Under other conditions (caused by OS behavior) such as the window having been minimized, restored, and/or resized since it was made transparent.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

<a id="Remarks"></a>
## Remarks

To set transparency, use [WinSetTransparent](WinSetTransparent.md).

<a id="Related"></a>
## Related

[WinSetTransparent](WinSetTransparent.md), [WinGetTransColor](WinGetTransColor.md), [Win functions](Win.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves the degree of transparency of the window under the mouse cursor.

```ahk
MouseGetPos ,, &MouseWin
TransDegree := WinGetTransparent(MouseWin)
```
