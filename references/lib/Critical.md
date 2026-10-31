# Critical

Prevents the [current thread](../misc/Threads.md) from being interrupted by other threads, or enables it to be interrupted.

```ahk
PrevSetting := Critical(Setting)
```

<a id="Parameters"></a>
## Parameters

**Setting**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, it defaults to *On*. Otherwise, specify one of the following:

**On:** The [current thread](../misc/Threads.md) is made critical, meaning that it cannot be interrupted by another thread.

**Off:** The current thread immediately becomes interruptible, regardless of the settings of [Thread Interrupt](Thread.md#Interrupt). See [Critical Off](#Off) for details.

**(Numeric):** Specify a positive number to turn on Critical but also change the number of milliseconds between checks of the internal message queue. See [Message Check Interval](#Interval) for details. Specifying 0 turns off Critical. Specifying -1 turns on Critical but disables message checks.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the previous setting (the value [A_IsCritical](../Variables.md#IsCritical) would return prior to calling the function); 0 if Critical is off, otherwise an integer greater than zero.

<a id="Behave"></a>
## Behavior of Critical Threads

Critical threads are *uninterruptible*; for details, see [Threads](../misc/Threads.md#Behave).

A critical thread becomes interruptible when a [message box](MsgBox.md) or other dialog is about to be displayed. However, unlike [Thread Interrupt](Thread.md#Interrupt), the thread becomes critical again after the user dismisses the dialog.

<a id="Off"></a>
## Critical Off

When buffered events are waiting to start new threads, using `Critical "Off"` will not result in an immediate interruption of the current thread. Instead, an average of 5 milliseconds will pass before an interruption occurs. This makes it more than 99.999 % likely that at least one line after `Critical "Off"` will execute before an interruption. You can force interruptions to occur immediately by means of a delay such as a `Sleep -1` or a [WinWait](WinWait.md) for a window that does not yet exist.

`Critical "Off"` cancels the current thread's period of uninterruptibility even if the thread was not Critical, thereby letting events such as [Size](GuiOnEvent.md#Size) be processed sooner or more predictably.

<a id="Settings"></a>
## Thread Settings

See [A_IsCritical](../Variables.md#IsCritical) for how to save and restore the current setting of Critical. However, since Critical is a thread-specific setting, when a critical thread ends, the underlying/resumed thread (if any) will be automatically noncritical. Consequently there is no need to do `Critical "Off"` right before ending a thread.

If Critical is not used by [the auto-execute thread](../Scripts.md#auto), all threads start off as noncritical (though the settings of [Thread Interrupt](Thread.md#Interrupt) will still apply). By contrast, if the auto-execute thread turns on Critical but never turns it off, every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off critical.

[Thread NoTimers](Thread.md#NoTimers) is similar to Critical except that it only prevents interruptions from [timers](SetTimer.md).

<a id="Interval"></a>
## Message Check Interval

Specifying a positive number as the first parameter (e.g. `Critical 30`) turns on Critical but also changes the minimum number of milliseconds between checks of the internal message queue. If unspecified, the default is 16 milliseconds while Critical is On, and 5 ms while Critical is Off. Increasing the interval postpones the arrival of messages/events, which gives the [current thread](../misc/Threads.md) more time to finish. This reduces the possibility that certain [OnMessage callbacks](OnMessage.md) and [GUI events](GuiOnEvent.md) will be lost due to "thread already running". However, functions that wait such as [Sleep](Sleep.md) and [WinWait](WinWait.md) will check messages regardless of this setting (a workaround is `DllCall("Sleep", "UInt", 500)`).

This setting affects the following:

- Preemptive message checks, which potentially occur before each line of code executes.
- Periodic message checks during [Send](Send.md), file and download operations.

It does not affect the frequency of message checks while the script is paused or waiting.

Because the system tick count generally has a granularity of 15.6 milliseconds, the minimum delta value is generally at least 15 or 16. The duration since the last check must *exceed* the interval setting in order for another check to occur. For example, a setting of 16 requires the tick count to change by 17 or greater. As a message check could occur at any time within the 15.6 millisecond window, any setting between 1 and 16 could permit two message checks within a single interval.

> **Note:** Increasing the message-check interval too much may reduce the responsiveness of various events such as [GUI](Gui.md) window repainting.

`Critical -1` turns on Critical but disables message checks. This does not prevent the program from checking for messages while performing a sleep, delay or wait. It is useful in cases where dispatching messages could interfere with the code currently executing, such as while handling certain types of messages during an [OnMessage](OnMessage.md) callback.

<a id="Related"></a>
## Related

[Thread (function)](Thread.md), [Threads](../misc/Threads.md), [#MaxThreadsPerHotkey](_MaxThreadsPerHotkey.md), [#MaxThreadsBuffer](_MaxThreadsBuffer.md), [OnMessage](OnMessage.md), [CallbackCreate](CallbackCreate.md), [Hotkey](Hotkey.md), [Menu object](Menu.md), [SetTimer](SetTimer.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Press a hotkey to display a tooltip for 3 seconds. Due to Critical, any new thread that is launched during this time (e.g. by pressing the hotkey again) will be postponed until the tooltip disappears.

```ahk
#space::  ; Win+Space hotkey.
{
    Critical
    ToolTip "No new threads will launch until after this ToolTip disappears."
    Sleep 3000
    ToolTip  ; Turn off the tip.
    return ; Returning from a hotkey function ends the thread. Any underlying thread to be resumed is noncritical by definition.
}
```
