# SetTimer

Causes a function to be called automatically and repeatedly at a specified time interval.

```ahk
SetTimer Function, Period, Priority
```

<a id="Parameters"></a>
## Parameters

<a id="Function"></a>

**Function**

Type: [Function Object](../misc/Functor.md)

The function object to call.

A [reference](../Concepts.md#references-to-objects) to the function object is kept in the script's list of timers, and is not released unless the timer is deleted. This occurs automatically for [run-once](#once) timers, but can also be done by calling SetTimer with a *Period* of 0.

<a id="OmitCallback"></a>

If *Function* is omitted, SetTimer will operate on the timer which launched the current thread, if any. For example, `SetTimer , 0` can be used inside a timer function to mark the timer for deletion, while `SetTimer , 1000` would update the current timer's *Period*.

> **Note:** Passing an empty variable or an expression which results in an empty value is considered an error. This parameter must be either given a non-empty value or completely omitted.

**Period**

Type: [Integer](../Concepts.md#numbers)

If omitted and the timer does not exist, it will be created with a period of 250. If omitted and the timer already exists, it will be [reset](#reset) at its former period unless *Priority* is specified. Otherwise, the absolute value of this parameter is used as the [approximate](#Precision) number of milliseconds that must pass before the timer is executed. The timer will be automatically [reset](#reset). It can be set to repeat automatically or run only once:

- If *Period* is greater than 0, the timer will automatically repeat until it is explicitly disabled by the script.
- <a id="once"></a> If *Period* is less than 0, the timer will run only once. For example, specifying -100 would call *Function* 100 ms from now then delete the timer as though `SetTimer Function, 0` had been used.
- If *Period* is 0, the timer is marked for deletion. If a thread started by this timer is still running, the timer is deleted after the thread finishes (unless it has been reenabled); otherwise, it is deleted immediately. In any case, the timer's previous *Period* and *Priority* are not retained.

The absolute value of *Period* must be no larger than 4294967295 ms (49.7 days).

**Priority**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 0. Otherwise, specify an integer between -2147483648 and 2147483647 (or an [expression](../Variables.md#Expressions)) to indicate this timer's thread priority. See [Threads](../misc/Threads.md) for details.

To change the priority of an existing timer without affecting it in any other way, omit *Period*.

<a id="Remarks"></a>
## Remarks

Timers are useful because they run asynchronously, meaning that they will run at the specified frequency (interval) even when the script is waiting for a window, displaying a dialog, or busy with another task. Examples of their many uses include taking some action when the user becomes idle (as reflected by [A_TimeIdle](../Variables.md#TimeIdle)) or closing unwanted windows the moment they appear.

Although timers may give the illusion that the script is performing more than one task simultaneously, this is not the case. Instead, timed functions are treated just like other threads: they can interrupt or be interrupted by another thread, such as a [hotkey subroutine](../Hotkeys.md). See [Threads](../misc/Threads.md) for details.

Whenever a timer is created or updated with a new period, its function will not be called right away; its time period must expire first. If you wish the timer's first execution to be immediate, call the timer's function directly (however, this will not start a new thread like the timer itself does; so settings such as [SendMode](SendMode.md) will not start off at their defaults).

<a id="reset"></a>

**Reset:** If SetTimer is used on an existing timer, the timer is reset (unless *Priority* is specified and *Period* is omitted); in other words, the entirety of its period must elapse before its function will be called again.

<a id="Precision"></a>

**Timer precision:** Due to the granularity of the OS's time-keeping system, *Period* is typically rounded up to the nearest multiple of 10 or 15.6 milliseconds (depending on the type of hardware and drivers installed). A shorter delay may be achieved via Loop+Sleep as demonstrated at [DllCall+timeBeginPeriod+Sleep](Sleep.md#ExShorterSleep).

<a id="Reliability"></a>

**Reliability:** A timer might not be able to run at the expected time under the following conditions:

1. Other applications are putting a heavy load on the CPU.
2. The timer's function is still running when the timer period expires again.
3. There are too many other competing timers.
4. The timer has been interrupted by another [thread](../misc/Threads.md), namely another timed function, [hotkey subroutine](../Hotkeys.md), or [custom menu item](Menu.md) (this can be avoided via [Critical](Critical.md)). If this happens and the interrupting thread takes a long time to finish, the interrupted timer will be effectively disabled for the duration. However, any other timers will continue to run by interrupting the [thread](../misc/Threads.md) that interrupted the first timer.
5. The script is uninterruptible as a result of [Critical](Critical.md) or [Thread Interrupt/Priority](Thread.md). During such times, timers will not run. Later, when the script becomes interruptible again, any overdue timer will run once as soon as possible and then resume its normal schedule.

Although timers will operate when the script is [suspended](Suspend.md), they will not run if the [current thread](../misc/Threads.md) has [Thread NoTimers](Thread.md#NoTimers) in effect or whenever any thread is [paused](Pause.md). In addition, they do not operate when the user is navigating through one of the script's menus (such as the [tray icon](../Program.md#tray-icon) menu or a menu bar).

Because timers operate by temporarily interrupting the script's current activity, their functions should be kept short (so that they finish quickly) whenever a long interruption would be undesirable.

<a id="otherremarks"></a>

**Other remarks:** A temporary timer might often be disabled by its own function (see examples at the bottom of this page).

Whenever a function is called by a timer, it starts off fresh with the default values for settings such as [SendMode](SendMode.md). These defaults can be changed during [script startup](../Scripts.md#auto).

If [hotkey](../Hotkeys.md) response time is crucial (such as in games) and the script contains any timers whose functions take longer than about 5 ms to execute, use the following function to avoid any chance of a 15 ms delay. Such a delay would otherwise happen if a hotkey is pressed at the exact moment a timer thread is in its period of uninterruptibility:

```ahk
Thread "Interrupt", 0  ; Make all threads always-interruptible.
```

If a timer is disabled while its function is currently running, that function will continue until it completes.

The [KeyHistory](KeyHistory.md) feature shows how many timers exist and how many are currently enabled.

<a id="Related"></a>
## Related

[Threads](../misc/Threads.md), [Thread (function)](Thread.md), [Critical](Critical.md), [Function Objects](../misc/Functor.md)

<a id="Examples"></a>
## Examples

<a id="ExampleClose"></a>

**Example:** Closes unwanted windows whenever they appear.

```ahk
SetTimer CloseMailWarnings, 250

CloseMailWarnings()
{
    WinClose "Microsoft Outlook", "A timeout occured while communicating"
    WinClose "Microsoft Outlook", "A connection to the server could not be established"
}
```

<a id="ExampleArgs"></a>

**Example:** Call a function after a delay with specific parameter values.

```ahk
; Create a bound function which calls MsgBox.
; MsgBox can be replaced with any user-defined or built-in function.
SetTimer MsgBox.Bind("Bound function called.",, "T1"), -1000

; Use an anonymous function to call MsgBox.
SetTimer () => MsgBox("Arrow function called.",, "T1"), -2500
```

**Example:** Cancel a timer before it expires.

```ahk
; Create a bound function which is both the timer's identifier and the function to execute.
timedOut := MsgBox.Bind("Timed out.")
SetTimer timedOut, -5000
MsgBox "Close this before 5 seconds pass to cancel the timeout."
SetTimer timedOut, 0
```

<a id="ExampleWait"></a>

**Example:** Waits for a certain window to appear and then alerts the user.

```ahk
SetTimer Alert1, 500

Alert1()
{
    if not WinExist("Video Conversion", "Process Complete")
        return
    ; Otherwise:
    SetTimer , 0  ; i.e. the timer turns itself off here.
    MsgBox "The video conversion is finished."
}
```

<a id="ExampleCount"></a>

**Example:** Detects single, double, and triple-presses of a hotkey. This allows a hotkey to perform a different operation depending on how many times you press it.

```ahk
#c::
KeyWinC(ThisHotkey)  ; This is a named function hotkey.
{
    static winc_presses := 0
    if winc_presses > 0 ; SetTimer already started, so we log the keypress instead.
    {
        winc_presses += 1
        return
    }
    ; Otherwise, this is the first press of a new series. Set count to 1 and start
    ; the timer:
    winc_presses := 1
    SetTimer After400, -400 ; Wait for more presses within a 400 millisecond window.

    After400()  ; This is a nested function.
    {
        if winc_presses = 1 ; The key was pressed once.
        {
            Run "m:\"  ; Open a folder.
        }
        else if winc_presses = 2 ; The key was pressed twice.
        {
            Run "m:\multimedia"  ; Open a different folder.
        }
        else if winc_presses > 2
        {
            MsgBox "Three or more clicks detected."
        }
        ; Regardless of which action above was triggered, reset the count to
        ; prepare for the next series of presses:
        winc_presses := 0
    }
}
```

<a id="ExampleClass"></a>

**Example:** Uses a [method](../Objects.md#Custom_Classes_method) as the timer function.

```ahk
counter := SecondCounter()
counter.Start()
Sleep 5000
counter.Stop()
Sleep 2000

; An example class for counting the seconds...
class SecondCounter {
    __New() {
        this.interval := 1000
        this.count := 0
        ; Tick() has an implicit parameter "this" which is a reference to
        ; the object, so we need to create a function which encapsulates
        ; "this" and the method to call:
        this.timer := ObjBindMethod(this, "Tick")
    }
    Start() {
        SetTimer this.timer, this.interval
        ToolTip "Counter started"
    }
    Stop() {
        ; To turn off the timer, we must pass the same object as before:
        SetTimer this.timer, 0
        ToolTip "Counter stopped at " this.count
    }
    ; In this example, the timer calls this method:
    Tick() {
        ToolTip ++this.count
    }
}
```

Tips relating to the above example:

- We can also use `this.timer := this.Tick.Bind(this)`. When `this.timer` is called, it will effectively invoke `tick_function.Call(this)`, where *tick_function* is the function object which implements that method. By contrast, [ObjBindMethod](ObjBindMethod.md) produces an object which invokes `this.Tick()`.
- If we rename *Tick* to *Call*, we can just use `this` directly instead of `this.timer`. However, ObjBindMethod is useful when the object has multiple methods which should be called by different event sources, such as hotkeys, menu items, GUI controls, etc.
- If the timer is being modified or deleted from within a function/method called by the timer, it may be easier to [omit the *Function* parameter](#OmitCallback). In some cases this avoids the need to retain the original object which was passed to SetTimer.
