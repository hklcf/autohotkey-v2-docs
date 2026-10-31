# Thread

Sets the priority or interruptibility of [threads](../misc/Threads.md). It can also temporarily disable all [timers](SetTimer.md).

```ahk
Thread SubFunction , Value1, Value2
```

The *SubFunction*, *Value1*, and *Value2* parameters are dependent upon each other and their usage is described below.

<a id="SubFunctions"></a>
## Sub-functions

For *SubFunction*, specify one of the following:

- [NoTimers](#NoTimers): Prevents interruptions from any timers.
- [Priority](#Priority): Changes the priority level of the current thread.
- [Interrupt](#Interrupt): Changes the duration of interruptibility for newly launched threads.

<a id="NoTimers"></a>
### NoTimers

Prevents interruptions from any timers.

```ahk
Thread "NoTimers" , False
```

This sub-function prevents interruptions from any [timers](SetTimer.md) until the [current thread](../misc/Threads.md) either ends, executes `Thread "NoTimers", false`, or is interrupted by another thread that allows timers (in which case timers can interrupt the interrupting thread until it finishes).

If this setting is not changed by [the auto-execute thread](../Scripts.md#auto), all threads start off as interruptible by timers (though the settings of the [Interrupt](#Interrupt) sub-function described below will still apply). By contrast, if the auto-execute thread turns on this setting but never turns it off, every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md)) starts off immune to interruptions by timers.

Regardless of the default setting, timers will always operate when the script has no threads (unless [Pause](Pause.md) has been turned on).

`Thread "NoTimers"` is equivalent to `Thread "NoTimers", true`. In addition, since the *False* parameter is an [expression](../Variables.md#Expressions), true resolves to 1, and false to 0. See [Boolean Values](../Concepts.md#boolean) for details.

<a id="Priority"></a>
### Priority

Changes the priority level of the current thread.

```ahk
Thread "Priority", Level
```

Specify for *Level* an integer between -2147483648 and 2147483647 (or an [expression](../Variables.md#Expressions)) to indicate the current thread's new priority. This has no effect on other threads. See [Threads](../misc/Threads.md) for details.

Due to its ability to buffer events, the function [Critical](Critical.md) is generally superior to this sub-function.

On a related note, the OS's priority level for the entire script can be changed via [ProcessSetPriority](ProcessSetPriority.md). For example:

```ahk
ProcessSetPriority "High"
```

<a id="Interrupt"></a>
### Interrupt

Changes the duration of interruptibility for newly launched threads.

```ahk
Thread "Interrupt" , Duration, LineCount
```

> **Note:** This sub-function should be used sparingly because most scripts perform more consistently with settings close to the defaults.

By default, every newly launched thread is uninterruptible for a *Duration* of 17 milliseconds or a *LineCount* of 1000 script lines, whichever comes first. This gives the thread a chance to finish rather than being immediately interrupted by another thread that is waiting to launch (such as a buffered [hotkey](../Hotkeys.md) or a series of [timed subroutines](SetTimer.md) that are all due to be run).

> **Note:** Any *Duration* less than 17 might result in a shorter actual duration or immediate interruption, since the system tick count has a minimum resolution of 10 to 16 milliseconds. However, at least one line will execute before the thread becomes interruptible, allowing the script to enable [Critical](Critical.md), if needed.

If either parameter is 0, each newly launched thread is immediately interruptible. If either parameter is -1, the thread cannot be interrupted as a result of that parameter. The maximum for both parameters is 2147483647.

This setting is global, meaning that it affects all subsequent threads, even if this function was not called by [the auto-execute thread](../Scripts.md#auto). However, [interrupted threads](../misc/Threads.md) are unaffected because their period of uninterruptibility has already expired. Similarly, the [current thread](../misc/Threads.md) is unaffected except if it is uninterruptible at the time the *LineCount* parameter is changed, in which case the new *LineCount* will be in effect for it.

If a [hotkey](../Hotkeys.md) is pressed or a [custom menu item](Menu.md) is selected while the [current thread](../misc/Threads.md) is uninterruptible, that event will be buffered. In other words, it will launch when the current thread finishes or becomes interruptible, whichever comes first. The exception to this is when the current thread becomes interruptible before it finishes, and it is of higher [priority](#Priority) than the buffered event; in this case the buffered event is unbuffered and discarded.

Regardless of this sub-function, a thread will become interruptible the moment it displays a [MsgBox](MsgBox.md), [InputBox](InputBox.md), [FileSelect](FileSelect.md), or [DirSelect](DirSelect.md) dialog.

Either parameter can be left blank to avoid changing it.

<a id="Remarks"></a>
## Remarks

Due to its greater flexibility and its ability to buffer events, the function [Critical](Critical.md) is generally more useful than `Thread "Interrupt"` and `Thread "Priority"`.

<a id="Related"></a>
## Related

[Critical](Critical.md), [Threads](../misc/Threads.md), [Hotkey](Hotkey.md), [Menu object](Menu.md), [SetTimer](SetTimer.md), [Process functions](Process.md)

<a id="Examples"></a>
## Examples

<a id="ExPriority"></a>

**Example:** Makes the priority of the current thread slightly above average.

```ahk
Thread "Priority", 1
```

<a id="ExInterrupt"></a>

**Example:** Makes each newly launched thread immediately interruptible.

```ahk
Thread "Interrupt", 0
```

<a id="ExInterrupt2"></a>

**Example:** Makes each thread interruptible after 50 ms or 2000 lines, whichever comes first.

```ahk
Thread "Interrupt", 50, 2000
```
