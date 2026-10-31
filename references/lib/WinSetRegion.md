# WinSetRegion

Changes the shape of the specified window to be the specified rectangle, ellipse, or polygon.

```ahk
WinSetRegion Options, WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**Options**

Type: [String](../Concepts.md#strings)

If blank or omitted, the window is restored to its original/default display area. Otherwise, specify one or more of the following options, each separated from the others with space(s):

**W***n*: Width of rectangle or ellipse. For example: `w200`.

**H***n*: Height of rectangle or ellipse. For example: `h200`.

**X-Y:** Each of these is a pair of X/Y coordinates. For example, `200-0` would use 200 for the X coordinate and 0 for the Y.

**E:** Makes the region an ellipse rather than a rectangle. This option is valid only when W and H are present.

**R***w-h*: Makes the region a rectangle with rounded corners. For example, `r30-30` would use a 30x30 ellipse for each corner. If *w-h* is omitted, 30-30 is used. R is valid only when W and H are present.

**Rectangle or ellipse:** If the W and H options are present, the new display area will be a rectangle whose upper left corner is specified by the first (and only) pair of X-Y coordinates. However, if the E option is also present, the new display area will be an ellipse rather than a rectangle. For example: `WinSetRegion "50-0 w200 h250 E"`.

**Polygon:** When the W and H options are absent, the new display area will be a polygon determined by multiple pairs of X-Y coordinates (each pair of coordinates is a point inside the window relative to its upper left corner). For example, if three pairs of coordinates are specified, the new display area will be a triangle in most cases. The order of the coordinate pairs with respect to each other is sometimes important. In addition, the word **Wind** may be present in *Options* to use the winding method instead of the alternating method to determine the polygon's region.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

A [ValueError](Error.md#ValueError) is thrown if one or more *Options* are invalid, or if more than 2000 pairs of coordinates were specified.

An [OSError](Error.md#OSError) is thrown if the specified region is invalid or could not be applied to the target window.

<a id="Remarks"></a>
## Remarks

When a region is set for a window owned by the script, the system may automatically change the method it uses to render the window's frame, thereby altering its appearance. The effect is similar to workaround #2 shown below, but only affects the window until its region is reset.

**Known limitation:** Setting a region for a window not owned by the script may produce unexpected results if the window has a caption (title bar), and the system has desktop composition enabled. This is because the visible frame is not actually part of the window, but rendered by a separate system process known as Desktop Window Manager (DWM). Note that desktop composition is [always enabled](https://learn.microsoft.com/windows/compatibility/desktop-window-manager-is-always-on) on Windows 8 and later. One of the following two workarounds can be used:

```ahk
; #1: Remove the window's caption.
WinSetStyle "-0xC00000", "Window Title"

; To undo it:
WinSetStyle "+0xC00000", "Window Title"
```

```ahk
; #2: Disable DWM rendering of the window's frame.
DllCall("dwmapi\DwmSetWindowAttribute", "ptr", WinExist("Window Title")
  , "uint", DWMWA_NCRENDERING_POLICY := 2, "int*", DWMNCRP_DISABLED := 1, "uint", 4)

; To undo it (this might also cause any set region to be ignored):
DllCall("dwmapi\DwmSetWindowAttribute", "ptr", WinExist("Window Title")
  , "uint", DWMWA_NCRENDERING_POLICY := 2, "int*", DWMNCRP_ENABLED := 2, "uint", 4)
```

<a id="Related"></a>
## Related

[Win functions](Win.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Makes all parts of Notepad outside this rectangle invisible. This example may not work well with the new Notepad on Windows 11 or later.

```ahk
WinSetRegion "50-0 w200 h250", "ahk_class Notepad"
```

<a id="ExRounded"></a>

**Example:** Same as above but with corners rounded to 40x40. This example may not work well with the new Notepad on Windows 11 or later.

```ahk
WinSetRegion "50-0 w200 h250 r40-40", "ahk_class Notepad"
```

<a id="ExEllipse"></a>

**Example:** Creates an ellipse instead of a rectangle. This example may not work well with the new Notepad on Windows 11 or later.

```ahk
WinSetRegion "50-0 w200 h250 E", "ahk_class Notepad"
```

<a id="ExTriangle"></a>

**Example:** Creates a triangle with apex pointing down. This example may not work well with the new Notepad on Windows 11 or later.

```ahk
WinSetRegion "50-0 250-0 150-250", "ahk_class Notepad"
```

<a id="ExRestore"></a>

**Example:** Restores the window to its original/default display area. This example may not work well with the new Notepad on Windows 11 or later.

```ahk
WinSetRegion , "ahk_class Notepad"
```

<a id="ExAdvanced"></a>

**Example:** Creates a see-through rectangular hole inside Notepad (or any other window). There are two rectangles specified below: an outer and an inner. Each rectangle consists of 5 pairs of X/Y coordinates because the first pair is repeated at the end to "close off" each rectangle. This example may not work well with the new Notepad on Windows 11 or later.

```ahk
WinSetRegion "0-0 300-0 300-300 0-300 0-0   100-100 200-100 200-200 100-200 100-100", "ahk_class Notepad"
```
