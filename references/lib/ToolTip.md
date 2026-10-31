# ToolTip

Shows an always-on-top window anywhere on the screen.

```ahk
ToolTip Text, X, Y, WhichToolTip
```

<a id="Parameters"></a>
## Parameters

**Text**

Type: [String](../Concepts.md#strings)

If blank or omitted, the existing tooltip (if any) will be hidden. Otherwise, specify the text to display in the tooltip. To create a multi-line tooltip, use the linefeed character (\`n) in between each line, e.g. ``"Line1`nLine2"``.

If *Text* is long, it can be broken up into several shorter lines by means of a [continuation section](../Scripts.md#continuation), which might improve readability and maintainability.

**X, Y**

Type: [Integer](../Concepts.md#numbers)

If omitted, the tooltip will be shown near the mouse cursor. Otherwise, specify the X and Y position of the tooltip relative to the active window's client area (use `CoordMode "ToolTip"` to change to screen coordinates).

**WhichToolTip**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1 (the first tooltip). Otherwise, specify a number between 1 and 20 to indicate which tooltip to operate upon when using multiple tooltips simultaneously.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

If a tooltip is being shown or updated, this function returns the tooltip window's [unique ID (HWND)](../misc/WinTitle.md#ahk_id), which can be used to move the tooltip or send [Tooltip Control Messages](https://learn.microsoft.com/windows/win32/controls/bumper-tooltip-control-reference-messages).

If *Text* is blank or omitted, the return value is zero.

<a id="Remarks"></a>
## Remarks

A tooltip usually looks like this: ![ToolTip](../static/dlg_tooltip.png)

If the X and Y coordinates caused the tooltip to run off-screen, or outside the [monitor's working area](MonitorGetWorkArea.md) on Windows 8 or later, it is repositioned to be entirely visible.

The tooltip is displayed until one of the following occurs:

- The script terminates.
- The ToolTip function is executed again with a blank *Text* parameter.
- The user clicks on the tooltip (this behavior may vary depending on operating system version).

A GUI window may be made the owner of a tooltip by means of the [OwnDialogs option](Gui.md#OwnDialogs). Such a tooltip is automatically destroyed when its owner is destroyed.

<a id="Related"></a>
## Related

[CoordMode](CoordMode.md), [TrayTip](TrayTip.md), [GUI](Gui.md), [MsgBox](MsgBox.md), [InputBox](InputBox.md), [FileSelect](FileSelect.md), [DirSelect](DirSelect.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Shows a multiline tooltip at a specific position in the active window.

```ahk
ToolTip "Multiline`nTooltip", 100, 150
```

<a id="ExAutoHide"></a>

**Example:** Hides a tooltip after a certain amount of time without having to use Sleep (which would stop the current thread).

```ahk
ToolTip "Timed ToolTip`nThis will be displayed for 5 seconds."
SetTimer () => ToolTip(), -5000
```
