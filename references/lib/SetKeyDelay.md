# SetKeyDelay

Sets the delay that will occur after each keystroke sent by [Send](Send.md) or [ControlSend](ControlSend.md).

```ahk
SetKeyDelay Delay, PressDuration, "Play"
```

<a id="Parameters"></a>
## Parameters

**Delay**

Type: [Integer](../Concepts.md#numbers)

If omitted, the current delay is retained. Otherwise, specify the time in milliseconds. Specify -1 for no delay at all or 0 for the smallest possible delay (however, if the *Play* parameter is present, both 0 and -1 produce no delay).

<a id="dur"></a>

**PressDuration**

Type: [Integer](../Concepts.md#numbers)

Certain games and other specialized applications may require a delay inside each keystroke; that is, after the press of the key but before its release.

If omitted, the current press duration is retained. Otherwise, specify the time in milliseconds. Specify -1 for no delay at all or 0 for the smallest possible delay (however, if the *Play* parameter is present, both 0 and -1 produce no delay).

> **Note:** *PressDuration* also produces a delay after any change to the modifier key state (Ctrl, Alt, Shift, and Win) needed to support the keys being sent.

**Play**

Type: [String](../Concepts.md#strings)

If blank or omitted, the delay and press duration are applied to the traditional [SendEvent mode](SendMode.md#Event). Otherwise, specify the word **Play** to apply both to the [SendPlay mode](SendMode.md#Play). If a script never uses this parameter, both are always -1 for SendPlay.

<a id="Remarks"></a>
## Remarks

By default, for the traditional [SendEvent mode](SendMode.md#Event), a short delay (sleep) of 10 milliseconds is done automatically after every keystroke sent by [Send](Send.md) or [ControlSend](ControlSend.md). This is done to improve the reliability of scripts because a window sometimes can't keep up with a rapid flood of keystrokes. For [SendPlay mode](SendMode.md#Play), the default delay is -1. For both modes, the default press duration is -1.

SetKeyDelay is not obeyed when using [SendInput mode](SendMode.md#Input) (which is the default); there is no delay between keystrokes in that mode.

During the delay (sleep), the current thread is made [uninterruptible](../misc/Threads.md#Interrupt).

Due to the granularity of the OS's time-keeping system, delays might be rounded up to the nearest multiple of 10 or 15.

For [SendEvent mode](SendMode.md#Event), a delay of 0 internally executes a Sleep(0), which yields the remainder of the script's timeslice to any other process that may need it. If there is none, Sleep(0) will not sleep at all. By contrast, a delay of -1 will never sleep. For better reliability, 0 is recommended as an alternative to -1.

When the delay is set to -1, a script's process-priority becomes an important factor in how fast it can send keystrokes when using the traditional [SendEvent mode](SendMode.md#Event). To raise a script's priority, use `ProcessSetPriority "High"`. Although this typically causes keystrokes to be sent faster than the [active window](WinActivate.md) can process them, the system automatically buffers them. Buffered keystrokes continue to arrive in the target window after the [Send](Send.md) function completes (even if the window is no longer active). This is usually harmless because any subsequent keystrokes sent to the same window get queued up behind the ones already in the buffer.

The built-in variables [A_KeyDelay](../Variables.md#KeyDelay) and [A_KeyDuration](../Variables.md#KeyDelay) contain the current settings for [SendEvent mode](SendMode.md#Event), while [A_KeyDelayPlay](../Variables.md#KeyDelayPlay) and [A_KeyDurationPlay](../Variables.md#KeyDelayPlay) contain the current settings for [SendPlay mode](SendMode.md#Play). They can also be assigned a new value instead of calling SetKeyDelay.

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

<a id="Related"></a>
## Related

[Send](Send.md), [ControlSend](ControlSend.md), [SendMode](SendMode.md), [SetMouseDelay](SetMouseDelay.md), [SetControlDelay](SetControlDelay.md), [SetWinDelay](SetWinDelay.md), [Click](Click.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Causes the smallest possible delay to occur after each keystroke sent via [Send](Send.md) or [ControlSend](ControlSend.md).

```ahk
SetKeyDelay 0
```
