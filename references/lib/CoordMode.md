# CoordMode

Sets coordinate mode for various built-in functions to be relative to either the active window or the screen.

```ahk
PrevRelativeTo := CoordMode(TargetType , RelativeTo)
```

<a id="Parameters"></a>
## Parameters

**TargetType**

Type: [String](../Concepts.md#strings)

Specify one of the following words to indicate the type of target to affect:

**ToolTip:** Affects [ToolTip](ToolTip.md).

**Pixel:** Affects [PixelGetColor](PixelGetColor.md), [PixelSearch](PixelSearch.md), and [ImageSearch](ImageSearch.md).

**Mouse:** Affects [MouseGetPos](MouseGetPos.md), [Click](Click.md), [MouseMove](MouseMove.md), [MouseClick](MouseClick.md), and [MouseClickDrag](MouseClickDrag.md).

**Caret:** Affects [CaretGetPos](CaretGetPos.md).

**Menu:** Affects the [Menu.Show](Menu.md#Show) method when coordinates are specified for it.

**RelativeTo**

Type: [String](../Concepts.md#strings)

If omitted, it defaults to *Screen*. Otherwise, specify the area that *TargetType* should be relative to:

**Screen:** Coordinates are relative to the desktop (entire screen).

**Window:** Coordinates are relative to the active window.

<a id="Client"></a>

**Client:** Coordinates are relative to the active window's client area, which excludes the window's title bar, menu (if it has a standard one) and borders. Client coordinates are less dependent on OS version and theme.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the area that *TargetType* was previously relative to.

<a id="Remarks"></a>
## Remarks

By default, coordinates are relative to the active window's client area. This applies to all built-in functions that use coordinates, except those documented otherwise (e.g. [WinMove](WinMove.md) and [InputBox](InputBox.md)).

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

The built-in [A_CoordMode variables](../Variables.md#CoordMode) contain the current settings and can also be assigned a new value instead of calling CoordMode.

<a id="Related"></a>
## Related

[Click](Click.md), [MouseMove](MouseMove.md), [MouseClick](MouseClick.md), [MouseClickDrag](MouseClickDrag.md), [MouseGetPos](MouseGetPos.md), [PixelGetColor](PixelGetColor.md), [PixelSearch](PixelSearch.md), [ToolTip](ToolTip.md), [Menu.Show](Menu.md)

<a id="Examples"></a>
## Examples

<a id="ExToolTipScreen"></a>

**Example:** Places tooltips at absolute screen coordinates.

```ahk
CoordMode "ToolTip", "Screen"
```

<a id="ExToolTip"></a>

**Example:** Same effect as the above because "Screen" is the default.

```ahk
CoordMode "ToolTip"
```
