# MouseMove

Moves the mouse cursor.

```ahk
MouseMove X, Y , Speed, Relative
```

<a id="Parameters"></a>
## Parameters

**X, Y**

Type: [Integer](../Concepts.md#numbers)

The X and Y coordinates to move the mouse to. Coordinates are relative to the active window's client area unless [CoordMode](CoordMode.md) was used to change that.

**Speed**

Type: [Integer](../Concepts.md#numbers)

If omitted, the default speed (as set by [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md) or 2 otherwise) will be used. Otherwise, specify the speed to move the mouse in the range 0 (fastest) to 100 (slowest). A speed of 0 will move the mouse instantly.

*Speed* is ignored for the modes [SendInput](SendMode.md#Input) and [SendPlay](SendMode.md#Play); they move the mouse instantaneously (though [SetMouseDelay](SetMouseDelay.md) has a mode that applies to SendPlay). To visually move the mouse more slowly -- such as a script that performs a demonstration for an audience -- use `SendEvent "{Click 100 200}"` or `SendMode "Event"` (optionally in conjuction with [BlockInput](BlockInput.md)).

**Relative**

Type: [String](../Concepts.md#strings)

If blank or omitted, the X and Y coordinates will be used for absolute positioning. Otherwise, specify the following letter:

**R:** The X and Y coordinates will be treated as offsets from the current mouse position. In other words, the cursor will be moved from its current position by X pixels to the right (left if negative) and Y pixels down (up if negative).

<a id="Remarks"></a>
## Remarks

This function uses the sending method set by [SendMode](SendMode.md).

The [SendPlay mode](SendMode.md#Play) is able to successfully generate mouse events in a broader variety of games than the other modes. In addition, some applications and games may have trouble tracking the mouse if it moves too quickly. The *Speed* parameter or [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md) can be used to reduce the speed (in [SendEvent mode](SendMode.md#Event) only).

The [BlockInput](BlockInput.md) function can be used to prevent any physical mouse activity by the user from disrupting the simulated mouse events produced by the mouse functions. However, this is generally not needed for the modes [SendInput](SendMode.md#Input) and [SendPlay](SendMode.md#Play) because they automatically postpone the user's physical mouse activity until afterward.

There is an automatic delay after every movement of the mouse (except for [SendInput mode](SendMode.md#Input)). Use [SetMouseDelay](SetMouseDelay.md) to change the length of the delay.

The following is an alternate way to move the mouse cursor that may work better in certain multi-monitor configurations:

```ahk
DllCall("SetCursorPos", "int", 100, "int", 400)  ; The first number is the X-coordinate and the second is the Y (relative to the screen).
```

On a related note, the mouse cursor can be temporarily hidden via the [hide-cursor example](DllCall.md#ExHideCursor).

<a id="Related"></a>
## Related

[CoordMode](CoordMode.md), [SendMode](SendMode.md), [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md), [SetMouseDelay](SetMouseDelay.md), [Click](Click.md), [MouseClick](MouseClick.md), [MouseClickDrag](MouseClickDrag.md), [MouseGetPos](MouseGetPos.md), [BlockInput](BlockInput.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Moves the mouse cursor to a new position.

```ahk
MouseMove 200, 100
```

<a id="ExAdvanced"></a>

**Example:** Moves the mouse cursor slowly (speed 50 vs. 2) by 20 pixels to the right and 30 pixels down from its current location.

```ahk
MouseMove 20, 30, 50, "R"
```
