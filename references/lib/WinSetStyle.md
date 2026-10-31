# WinSetStyle / WinSetExStyle

Changes the style or extended style of the specified window, respectively.

```ahk
WinSetStyle Value , WinTitle, WinText, ExcludeTitle, ExcludeText
WinSetExStyle Value , WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

Pass a positive integer to completely overwrite the window's style; that is, to set it to *Value*.

To easily add, remove or toggle styles, pass a numeric string prefixed with a plus sign (+), minus sign (-) or caret (^), respectively. The new style value is calculated as shown below (where *CurrentStyle* could be retrieved with [WinGetStyle](WinGetStyle.md) or [WinGetExStyle](WinGetStyle.md)):

| Operation | Prefix | Example | Formula |
| --- | --- | --- | --- |
| Add | + | `"+0x80"` | `NewStyle := CurrentStyle \| Value` |
| Remove | - | `"-0x80"` | `NewStyle := CurrentStyle & ~Value` |
| Toggle | ^ | `"^0x80"` | `NewStyle := CurrentStyle ^ Value` |

If *Value* is a negative integer, it is treated the same as the corresponding numeric string.

To use the + or ^ prefix literally in an expression, the prefix or value must be enclosed in quote marks. For example: `WinSetStyle("+0x80")` or `WinSetStyle("^" StylesToToggle)`. This is because the [expression](../Variables.md#Expressions) `+123` produces 123 (without a prefix) and `^123` is a syntax error.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

An [OSError](Error.md#OSError) is thrown if the change could not be applied.

<a id="Remarks"></a>
## Remarks

See the [styles table](../misc/Styles.md) for a partial listing of styles.

After applying certain style changes to a visible window, it might be necessary to redraw the window using [WinRedraw](WinRedraw.md).

<a id="Related"></a>
## Related

[WinGetStyle / WinGetExStyle](WinGetStyle.md), [ControlSetStyle / ControlSetExStyle](ControlSetStyle.md), [styles table](../misc/Styles.md), [Win functions](Win.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExStyle"></a>

**Example:** Removes the active window's title bar (WS_CAPTION).

```ahk
WinSetStyle "-0xC00000", "A"
```

<a id="ExExStyle"></a>

**Example:** Toggles the WS_EX_TOOLWINDOW attribute, which removes/adds Notepad from the alt-tab list.

```ahk
WinSetExStyle "^0x80", "ahk_class Notepad"
```
