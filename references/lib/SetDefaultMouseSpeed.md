# SetDefaultMouseSpeed

Sets the mouse speed that will be used if unspecified in [Click](Click.md), [MouseMove](MouseMove.md), [MouseClick](MouseClick.md), and [MouseClickDrag](MouseClickDrag.md).

```ahk
PrevSpeed := SetDefaultMouseSpeed(Speed)
```

<a id="Parameters"></a>
## Parameters

**Speed**

Type: [Integer](../Concepts.md#numbers)

The speed to move the mouse in the range 0 (fastest) to 100 (slowest). A speed of 0 will move the mouse instantly.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the previous setting.

<a id="Remarks"></a>
## Remarks

If SetDefaultMouseSpeed is not used, the default mouse speed is 2.

SetDefaultMouseSpeed is ignored for the modes [SendInput](SendMode.md#Input) and [SendPlay](SendMode.md#Play); they move the mouse instantaneously (except when SendInput [reverts to SendEvent](SendMode.md#SendInputUnavail); also, [SetMouseDelay](SetMouseDelay.md) has a mode that applies to SendPlay). To visually move the mouse more slowly -- such as a script that performs a demonstration for an audience -- use `SendEvent "{Click 100 200}"` or `SendMode "Event"` (optionally in conjuction with [BlockInput](BlockInput.md)).

The built-in variable [A_DefaultMouseSpeed](../Variables.md#DefaultMouseSpeed) contains the current setting and can also be assigned a new value instead of calling SetDefaultMouseSpeed.

The functions [MouseClick](MouseClick.md), [MouseMove](MouseMove.md), and [MouseClickDrag](MouseClickDrag.md) all have a parameter to override the default mouse speed.

Whenever *Speed* is greater than zero, [SetMouseDelay](SetMouseDelay.md) also influences the speed by producing a delay after each incremental move the mouse makes toward its destination.

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

<a id="Related"></a>
## Related

[SetMouseDelay](SetMouseDelay.md), [SendMode](SendMode.md), [Click](Click.md), [MouseClick](MouseClick.md), [MouseMove](MouseMove.md), [MouseClickDrag](MouseClickDrag.md), [SetWinDelay](SetWinDelay.md), [SetControlDelay](SetControlDelay.md), [SetKeyDelay](SetKeyDelay.md), [SetKeyDelay](SetMouseDelay.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Causes the mouse cursor to be moved instantly.

```ahk
SetDefaultMouseSpeed 0
```
