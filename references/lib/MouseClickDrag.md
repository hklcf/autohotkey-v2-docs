# MouseClickDrag

Clicks and holds the specified mouse button, moves the mouse to the destination coordinates, then releases the button.

```ahk
MouseClickDrag WhichButton, X1, Y1, X2, Y2 , Speed, Relative
```

<a id="Parameters"></a>
## Parameters

**WhichButton**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to Left (the left mouse button). Otherwise, specify Left, Right, Middle (or just the first letter of each of these); or X1 (fourth button) or X2 (fifth button). For example: `MouseClickDrag "X1", 0, 0, 10, 10`.

Left and Right correspond to the primary button and secondary button. If the user swaps the buttons via system settings, the physical positions of the buttons are swapped but the effect stays the same.

**X1, Y1**

Type: [Integer](../Concepts.md#numbers)

Specify the X and Y coordinates of the drag's starting position (the mouse will be moved to these coordinates right before the drag is started). Coordinates are relative to the active window's client area unless [CoordMode](CoordMode.md) was used to change that.

[v2.0.7+]: If both X1 and Y1 are omitted, the mouse cursor's current position is used. Due to a bug, X1 and Y1 were mandatory in previous versions.

**X2, Y2**

Type: [Integer](../Concepts.md#numbers)

The X and Y coordinates to drag the mouse to (that is, while the button is held down). Coordinates are relative to the active window's client area unless [CoordMode](CoordMode.md) was used to change that.

**Speed**

Type: [Integer](../Concepts.md#numbers)

If omitted, the default speed (as set by [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md) or 2 otherwise) will be used. Otherwise, specify the speed to move the mouse in the range 0 (fastest) to 100 (slowest). A speed of 0 will move the mouse instantly.

*Speed* is ignored for the modes [SendInput](SendMode.md#Input) and [SendPlay](SendMode.md#Play); they move the mouse instantaneously (though [SetMouseDelay](SetMouseDelay.md) has a mode that applies to SendPlay). To visually move the mouse more slowly -- such as a script that performs a demonstration for an audience -- use `SendEvent "{Click 100 200}"` or `SendMode "Event"` (optionally in conjuction with [BlockInput](BlockInput.md)).

**Relative**

Type: [String](../Concepts.md#strings)

If blank or omitted, the X and Y coordinates will be used for absolute positioning. Otherwise, specify the following letter:

**R:** The X1 and Y1 coordinates will be treated as offsets from the current mouse position. In other words, the cursor will be moved from its current position by X1 pixels to the right (left if negative) and Y1 pixels down (up if negative). Similarly, the X2 and Y2 coordinates will be treated as offsets from the X1 and Y1 coordinates. For example, the following would first move the cursor down and to the right by 5 pixels from its starting position, and then drag it from that position down and to the right by 10 pixels: `MouseClickDrag "Left", 5, 5, 10, 10, , "R"`.

<a id="Remarks"></a>
## Remarks

This function uses the sending method set by [SendMode](SendMode.md).

Dragging can also be done via the various [Send](Send.md) functions, which is more flexible because the mode can be specified via the function name. For example:

```ahk
SendEvent "{Click 6 52 Down}{click 45 52 Up}"
```

Another advantage of the method above is that unlike MouseClickDrag, it automatically compensates when the user has swapped the left and right mouse buttons via the system's control panel.

The [SendPlay mode](SendMode.md#Play) is able to successfully generate mouse events in a broader variety of games than the other modes. However, dragging via SendPlay might not work in RichEdit controls (and possibly others) such as those of WordPad and Metapad.

Some applications and games may have trouble tracking the mouse if it moves too quickly. The *Speed* parameter or [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md) can be used to reduce the speed (in [SendEvent mode](SendMode.md#Event) only).

The [BlockInput](BlockInput.md) function can be used to prevent any physical mouse activity by the user from disrupting the simulated mouse events produced by the mouse functions. However, this is generally not needed for the modes [SendInput](SendMode.md#Input) and [SendPlay](SendMode.md#Play) because they automatically postpone the user's physical mouse activity until afterward.

There is an automatic delay after every click-down and click-up of the mouse (except for [SendInput mode](SendMode.md#Input)). This delay also occurs after the movement of the mouse during the drag operation. Use [SetMouseDelay](SetMouseDelay.md) to change the length of the delay.

<a id="Related"></a>
## Related

[CoordMode](CoordMode.md), [SendMode](SendMode.md), [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md), [SetMouseDelay](SetMouseDelay.md), [Click](Click.md), [MouseClick](MouseClick.md), [MouseGetPos](MouseGetPos.md), [MouseMove](MouseMove.md), [BlockInput](BlockInput.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Clicks and holds the left mouse button, moves the mouse cursor to the destination coordinates, then releases the button.

```ahk
MouseClickDrag "left", 0, 200, 600, 400
```

<a id="ExPaint"></a>

**Example:** Opens MS Paint and draws a little house.

```ahk
Run "mspaint.exe"
if !WinWaitActive("ahk_class MSPaintApp",, 2)
    return
MouseClickDrag "L", 150, 450, 150, 350
MouseClickDrag "L", 150, 350, 200, 300
MouseClickDrag "L", 200, 300, 250, 350
MouseClickDrag "L", 250, 350, 150, 350
MouseClickDrag "L", 150, 350, 250, 450
MouseClickDrag "L", 250, 450, 250, 350
MouseClickDrag "L", 250, 350, 150, 450
MouseClickDrag "L", 150, 450, 250, 450
```
