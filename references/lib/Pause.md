# Pause

Pauses the script's [current thread](../misc/Threads.md) or sets the pause state of the underlying thread.

```ahk
Pause UnderlyingThreadState
```

<a id="Parameters"></a>
## Parameters

**UnderlyingThreadState**

Type: [Integer](../Concepts.md#numbers)

If omitted, the [current thread](../misc/Threads.md) is paused. Otherwise, specify one of the following values:

`1` or `True`: Marks the underlying thread as paused. The current thread is not paused and continues running. When the current thread finishes, the underlying thread resumes any interrupted function the underlying thread was running. Once the underlying thread finishes the function (if any), it enters a paused state. If there is no thread underneath the current thread, the script itself is paused, which prevents [timers](SetTimer.md) from running (this effect is the same as having used the menu item "Pause Script" while the script has no threads).

`0` or `False`: Unpauses the underlying thread.

`-1`: Toggles the pause state of the underlying thread.

<a id="Remarks"></a>
## Remarks

By default, the script can also be paused via its [tray icon](../Program.md#tray-icon) or [main window](../Program.md#main-window).

Unlike [Suspend](Suspend.md) -- which disables [hotkeys](../Hotkeys.md) and [hotstrings](../Hotstrings.md) -- turning on pause will freeze the thread (the [current thread](../misc/Threads.md) if *UnderlyingThreadState* was omitted, otherwise the underlying thread). As a side-effect, any interrupted threads underneath it will lie dormant until the current thread is unpaused and finishes.

Whenever any thread or the script itself is paused, [timers](SetTimer.md) will not run. By contrast, explicitly launched threads such as [hotkeys](../Hotkeys.md) and [menu items](Menu.md) can still be launched; but when their [threads](../misc/Threads.md) finish, the underlying thread will still be paused. In other words, each thread can be paused independently of the others.

The [tray icon](../Program.md#tray-icon) changes to ![a green icon with a Pause symbol](../static/ahk16_pause.png) (or to ![a green icon with a transparent Pause symbol](../static/ahk16_pause_suspend.png) if the script is also [suspended](Suspend.md)), whenever the script's [current thread](../misc/Threads.md) is in a paused state. This icon change can be avoided by freezing the icon, which is achieved by using `TraySetIcon(,, true)`.

To disable [timers](SetTimer.md) without pausing the script, use [Thread NoTimers](Thread.md#NoTimers).

A script is always halted (though not officially paused) while it is displaying any kind of [menu](Menu.md) (tray menu, menu bar, GUI context menu, etc.)

The built-in variable **A_IsPaused** contains 1 if the thread immediately underneath the current thread is paused and 0 otherwise.

<a id="Related"></a>
## Related

[Suspend](Suspend.md), [Menu object](Menu.md), [ExitApp](ExitApp.md), [Threads](../misc/Threads.md), [SetTimer](SetTimer.md)

<a id="Examples"></a>
## Examples

<a id="ExHalt"></a>

**Example:** Use Pause to halt the script, such as to inspect variables.

```ahk
ListVars
Pause
ExitApp ; This line will not execute until the user unpauses the script.
```

<a id="ExHotkey"></a>

**Example:** Press a hotkey once to pause the script. Press it again to unpause.

```ahk
Pause::Pause -1  ; The Pause/Break key.
#p::Pause -1  ; Win+P
```

<a id="ExPostMessage"></a>

**Example:** Sends a Pause command to another script.

```ahk
DetectHiddenWindows True
WM_COMMAND := 0x0111
ID_FILE_PAUSE := 65403
PostMessage WM_COMMAND, ID_FILE_PAUSE,,, "C:\YourScript.ahk ahk_class AutoHotkey"
```
