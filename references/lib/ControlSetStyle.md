# ControlSetStyle / ControlSetExStyle

Changes the style or extended style of a control.

```ahk
ControlSetStyle Value, ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText
ControlSetExStyle Value, ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

Pass a positive integer to completely overwrite the window's style; that is, to set it to *Value*.

To easily add, remove or toggle styles, pass a numeric string prefixed with a plus sign (+), minus sign (-) or caret (^), respectively. The new style value is calculated as shown below (where *CurrentStyle* could be retrieved with [ControlGetStyle](ControlGetStyle.md), [ControlGetExStyle](ControlGetStyle.md), [WinGetStyle](WinGetStyle.md) or [WinGetExStyle](WinGetStyle.md)):

| Operation | Prefix | Example | Formula |
| --- | --- | --- | --- |
| Add | + | `"+0x80"` | `NewStyle := CurrentStyle \| Value` |
| Remove | - | `"-0x80"` | `NewStyle := CurrentStyle & ~Value` |
| Toggle | ^ | `"^0x80"` | `NewStyle := CurrentStyle ^ Value` |

If *Value* is a negative integer, it is treated the same as the corresponding numeric string.

To use the + or ^ prefix literally in an expression, the prefix or value must be enclosed in quote marks. For example: `ControlSetStyle("+0x80")` or `ControlSetStyle("^" StylesToToggle)`. This is because the [expression](../Variables.md#Expressions) `+123` produces 123 (without a prefix) and `^123` is a syntax error.

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

An [OSError](Error.md#OSError) is thrown if the style could not be changed. Partial change is considered a success.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to use [GuiControl.Opt](GuiControl.md#Opt) which allows specifying a style number prefixed by a plus or minus sign.

See the [styles table](../misc/Styles.md) for a partial listing of styles.

Certain style changes require that the entire window be redrawn using [WinRedraw](WinRedraw.md).

ControlSetExStyle only changes generic extended styles, such as WS_EX_CLIENTEDGE (0x200). To change control-specific extended styles, use [SendMessage](SendMessage.md). For example, `SendMessage(0x1036, 0, 0x1, "SysListView321")`, where 0x1036 is [LVM_SETEXTENDEDLISTVIEWSTYLE](https://learn.microsoft.com/windows/win32/controls/lvm-setextendedlistviewstyle) and 0x1 is [LVS_EX_GRIDLINES](../misc/Styles.md#LVS_EX_GRIDLINES), displays gridlines around rows and columns in a list-view control.

<a id="Related"></a>
## Related

[ControlGetStyle / ControlGetExStyle](ControlGetStyle.md), [WinSetStyle / WinSetExStyle](WinSetStyle.md), [styles table](../misc/Styles.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Sets the WS_BORDER style of the Notepad's Edit control to its opposite state.

```ahk
ControlSetStyle("^0x800000", "Edit1", "ahk_class Notepad")
```
