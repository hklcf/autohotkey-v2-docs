# MouseClick

Clicks or holds down a mouse button, or turns the mouse wheel. Note: The [Click](Click.md) function is generally more flexible and easier to use.

```ahk
MouseClick WhichButton, X, Y, ClickCount, Speed, DownOrUp, Relative
```

<a id="Parameters"></a>
## Parameters

**WhichButton**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to Left (the left mouse button). Otherwise, specify the button to click or the rotate/push direction of the mouse wheel.

**Button:** Left, Right, Middle (or just the first letter of each of these); or X1 (fourth button) or X2 (fifth button). For example: `MouseClick "X1"`.

Left and Right correspond to the primary button and secondary button. If the user swaps the buttons via system settings, the physical positions of the buttons are swapped but the effect stays the same.

**Mouse wheel:** Specify WheelUp or WU to turn the wheel upward (away from you); specify WheelDown or WD to turn the wheel downward (toward you). Specify WheelLeft (or WL) or WheelRight (or WR) to push the wheel left or right, respectively. *ClickCount* is the number of notches to turn the wheel.

**X, Y**

Type: [Integer](../Concepts.md#numbers)

If omitted, the cursor's current position is used. Otherwise, specify the X and Y coordinates to which the mouse cursor is moved prior to clicking. Coordinates are relative to the active window's client area unless [CoordMode](CoordMode.md) was used to change that.

**ClickCount**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1. Otherwise, specify the number of times to click the mouse button or turn the mouse wheel.

**Speed**

Type: [Integer](../Concepts.md#numbers)

If omitted, the default speed (as set by [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md) or 2 otherwise) will be used. Otherwise, specify the speed to move the mouse in the range 0 (fastest) to 100 (slowest). A speed of 0 will move the mouse instantly.

*Speed* is ignored for the modes [SendInput](SendMode.md#Input) and [SendPlay](SendMode.md#Play); they move the mouse instantaneously (though [SetMouseDelay](SetMouseDelay.md) has a mode that applies to SendPlay). To visually move the mouse more slowly -- such as a script that performs a demonstration for an audience -- use `SendEvent "{Click 100 200}"` or `SendMode "Event"` (optionally in conjuction with [BlockInput](BlockInput.md)).

**DownOrUp**

Type: [String](../Concepts.md#strings)

If blank or omitted, each click consists of a down-event followed by an up-event. Otherwise, specify one of the following letters:

**D:** Press the mouse button down but do not release it (i.e. generate a down-event).

**U:** Release the mouse button (i.e. generate an up-event).

**Relative**

Type: [String](../Concepts.md#strings)

If blank or omitted, the X and Y coordinates will be used for absolute positioning. Otherwise, specify the following letter:

**R:** The X and Y coordinates will be treated as offsets from the current mouse position. In other words, the cursor will be moved from its current position by X pixels to the right (left if negative) and Y pixels down (up if negative).

<a id="Remarks"></a>
## Remarks

This function uses the sending method set by [SendMode](SendMode.md).

The [Click](Click.md) function is recommended over MouseClick because it is generally easier to use. However, MouseClick supports the *Speed* parameter, whereas adjusting the speed of movement by Click requires the use of [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md).

To perform a shift-click or control-click, use the [Send](Send.md) function before and after the operation as shown in these examples:

```ahk
; Example #1:
Send "{Control down}"
MouseClick "left", 55, 233
Send "{Control up}"
```

```ahk
; Example #2:
Send "{Shift down}"
MouseClick "left", 55, 233
Send "{Shift up}"
```

The [SendPlay mode](SendMode.md#Play) is able to successfully generate mouse events in a broader variety of games than the other modes. In addition, some applications and games may have trouble tracking the mouse if it moves too quickly. The *Speed* parameter or [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md) can be used to reduce the speed (in [SendEvent mode](SendMode.md#Event) only).

Some applications do not obey a *ClickCount* higher than 1 for the mouse wheel. For them, use a [Loop](Loop.md) such as the following:

```ahk
Loop 5
    MouseClick "WheelUp"
```

The [BlockInput](BlockInput.md) function can be used to prevent any physical mouse activity by the user from disrupting the simulated mouse events produced by the mouse functions. However, this is generally not needed for the modes [SendInput](SendMode.md#Input) and [SendPlay](SendMode.md#Play) because they automatically postpone the user's physical mouse activity until afterward.

There is an automatic delay after every click-down and click-up of the mouse (except for [SendInput mode](SendMode.md#Input) and for turning the mouse wheel). Use [SetMouseDelay](SetMouseDelay.md) to change the length of the delay.

<a id="Related"></a>
## Related

[CoordMode](CoordMode.md), [SendMode](SendMode.md), [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md), [SetMouseDelay](SetMouseDelay.md), [Click](Click.md), [MouseClickDrag](MouseClickDrag.md), [MouseGetPos](MouseGetPos.md), [MouseMove](MouseMove.md), [ControlClick](ControlClick.md), [BlockInput](BlockInput.md)

<a id="Examples"></a>
## Examples

<a id="ExDoubleClick"></a>

**Example:** Double-clicks at the current mouse position.

```ahk
MouseClick "left"
MouseClick "left"
```

<a id="ExDoubleClick2"></a>

**Example:** Same as above.

```ahk
MouseClick "left",,, 2
```

<a id="ExMove"></a>

**Example:** Moves the mouse cursor to a specific position, then right-clicks once.

```ahk
MouseClick "right", 200, 300
```

<a id="ExWheel"></a>

**Example:** Simulates the turning of the mouse wheel.

```ahk
#up::MouseClick "WheelUp",,, 2  ; Turn it by two notches.
#down::MouseClick "WheelDown",,, 2
```
