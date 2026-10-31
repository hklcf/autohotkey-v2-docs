# Threads

The *current thread* is defined as the flow of execution invoked by the most recent event; examples include [hotkeys](../Hotkeys.md), [SetTimer subroutines](../lib/SetTimer.md), [custom menu items](../lib/Menu.md), and [GUI events](../lib/Gui.md#Events). The *current thread* can be executing functions within its own subroutine or within other subroutines called by that subroutine.

Although AutoHotkey doesn't actually use multiple threads, it simulates some of that behavior: If a second thread is started -- such as by pressing another hotkey while the previous is still running -- the *current thread* will be interrupted (temporarily halted) to allow the new thread to become *current*. If a third thread is started while the second is still running, both the second and first will be in a dormant state, and so on.

When the *current thread* finishes, the one most recently interrupted will be resumed, and so on, until all the threads finally finish. When resumed, a thread's settings for things such as [SendMode](../lib/SendMode.md) and [SetKeyDelay](../lib/SetKeyDelay.md) are automatically restored to what they were just prior to its interruption; in other words, a thread will experience no side-effects from having been interrupted (except for a possible change in the [active window](../lib/WinActivate.md)).

> **Note:** The [KeyHistory](../lib/KeyHistory.md) function/menu-item shows how many threads are in an interrupted state and the [ListHotkeys](../lib/ListHotkeys.md) function/menu-item shows which hotkeys have threads.

A single script can have multiple simultaneous [MsgBox](../lib/MsgBox.md), [InputBox](../lib/InputBox.md), [FileSelect](../lib/FileSelect.md), and [DirSelect](../lib/DirSelect.md) dialogs. This is achieved by launching a new thread (via [hotkey](../Hotkeys.md), [timed subroutine](../lib/SetTimer.md), [custom menu item](../lib/Menu.md), etc.) while a prior thread already has a dialog displayed.

By default, a given [hotkey](../Hotkeys.md) or [hotstring](../Hotstrings.md) subroutine cannot be run a second time if it is already running. Use [#MaxThreadsPerHotkey](../lib/_MaxThreadsPerHotkey.md) to change this behavior.

**Related:** The [Thread](../lib/Thread.md) function sets the priority or interruptibility of threads.

<a id="Priority"></a>
## Thread Priority

Any thread ([hotkey](../Hotkeys.md), [timed subroutine](../lib/SetTimer.md), [custom menu item](../lib/Menu.md), etc.) with a priority lower than that of the *current thread* cannot interrupt it. During that time, such timers will not run, and any attempt by the user to create a thread (such as by pressing a [hotkey](../Hotkeys.md) or [GUI button](../lib/GuiControls.md#Button)) will have no effect, nor will it be buffered. Because of this, it is usually best to design high priority threads to finish quickly, or use [Critical](../lib/Critical.md) instead of making them high priority.

The default priority is 0. All threads use the default priority unless changed by one of the following methods:

- A timed subroutine is given a specific priority via [SetTimer](../lib/SetTimer.md).
- A hotkey is given a specific priority via the [Hotkey](../lib/Hotkey.md) function.
- A [hotstring](../Hotstrings.md) is given a specific priority when it is defined, or via the [#Hotstring](../lib/_Hotstring.md) directive.
- A custom menu item is given a specific priority via the [Menu.Add](../lib/Menu.md#Add) method.
- The *current thread* sets its own priority via the [Thread](../lib/Thread.md) function.

The [OnExit](../lib/OnExit.md) callback function (if any) will always run when called for, regardless of the *current thread*'s priority.

<a id="Interrupt"></a>
## Thread Interruptibility

For most types of events, new threads are permitted to launch only if the current thread is *interruptible*. A thread can be *uninterruptible* for a number of reasons, including:

- The thread has been marked as *critical*. [Critical](../lib/Critical.md) may have been called by the thread itself or by [the auto-execute thread](../Scripts.md#auto).
- The thread has not been running long enough to meet the conditions for becoming interruptible, as set by [Thread Interrupt](../lib/Thread.md#Interrupt).
- One of the script's menus is being displayed (such as the [tray icon](../Program.md#tray-icon) menu or a menu bar).
- A delay is being performed by [Send](../lib/Send.md) (most often due to [SetKeyDelay](../lib/SetKeyDelay.md)), [WinActivate](../lib/WinActivate.md), or a [Clipboard](../lib/A_Clipboard.md) operation.
- An [OnExit](../lib/OnExit.md) thread is executing.
- A warning dialog is being displayed due to the [A_MaxHotkeysPerInterval](../lib/A_MaxHotkeysPerInterval.md) limit being reached, or due to a problem activating the keyboard or mouse hook (very rare).

<a id="Behave"></a>
### Behavior of Uninterruptible Threads

Unlike high-priority threads, events that occur while the thread is uninterruptible are not discarded. For example, if the user presses a [hotkey](../Hotkeys.md) while the current thread is uninterruptible, the hotkey is buffered indefinitely until the current thread finishes or becomes interruptible, at which time the hotkey is launched as a new thread.

Any thread may be interrupted in emergencies. Emergencies consist of:

- An [OnExit](../lib/OnExit.md) callback.
- Any [OnMessage](../lib/OnMessage.md) function that monitors a message which is not [buffered](../lib/OnMessage.md#buffering).
- Any [callback](../lib/CallbackCreate.md) indirectly triggered by the thread itself (e.g. via [SendMessage](../lib/PostMessage.md) or [DllCall](../lib/DllCall.md)).

To avoid these interruptions, temporarily disable such functions.

A [critical](../lib/Critical.md) thread becomes interruptible when a [MsgBox](../lib/MsgBox.md) or other dialog is displayed. However, unlike [Thread Interrupt](../lib/Thread.md#Interrupt), the thread becomes critical (and therefore uninterruptible) again after the user dismisses the dialog.
