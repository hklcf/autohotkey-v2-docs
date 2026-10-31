# SetWinDelay

Sets the delay that will occur after each windowing function, such as [WinActivate](WinActivate.md).

```ahk
PrevDelay := SetWinDelay(Delay)
```

<a id="Parameters"></a>
## Parameters

**Delay**

Type: [Integer](../Concepts.md#numbers)

Time in milliseconds. Specify -1 for no delay at all or 0 for the smallest possible delay.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the previous setting.

<a id="Remarks"></a>
## Remarks

By default, a short delay (sleep) of 100 milliseconds is done automatically after every windowing function except [WinActive](WinActive.md) and [WinExist](WinExist.md). This is done to improve the reliability of scripts because a window sometimes needs a period of "rest" after being created, activated, minimized, etc. so that it has a chance to update itself and respond to the next function that the script may attempt to send to it.

Although a delay of -1 (no delay at all) is allowed, it is recommended that at least 0 be used, to increase confidence that the script will run correctly even when the CPU is under load.

A delay of 0 internally executes a Sleep(0), which yields the remainder of the script's timeslice to any other process that may need it. If there is none, Sleep(0) will not sleep at all.

If the CPU is slow or under load, or if window animation is enabled, higher delay values may be needed.

The built-in variable [A_WinDelay](../Variables.md#WinDelay) contains the current setting and can also be assigned a new value instead of calling SetWinDelay.

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

<a id="Related"></a>
## Related

[SetControlDelay](SetControlDelay.md), [SetKeyDelay](SetKeyDelay.md), [SetMouseDelay](SetMouseDelay.md), [SendMode](SendMode.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Causes a delay of 10 ms to occur after each windowing function.

```ahk
SetWinDelay 10
```
