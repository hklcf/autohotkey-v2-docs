# Suspend

Disables or enables all or selected [hotkeys](../Hotkeys.md) and [hotstrings](../Hotstrings.md).

```ahk
Suspend NewState
```

<a id="Parameters"></a>
## Parameters

**NewState**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to -1. Otherwise, specify one of the following values:

`1` or `True`: Suspends all [hotkeys](../Hotkeys.md) and [hotstrings](../Hotstrings.md) except those explained the Remarks section.

`0` or `False`: Re-enables the hotkeys and hotstrings that were disable above.

`-1`: Changes to the opposite of its previous state (On or Off).

<a id="Remarks"></a>
## Remarks

By default, the script can also be suspended via its [tray icon](../Program.md#tray-icon) or [main window](../Program.md#main-window).

A hotkey/hotstring can be made exempt from suspension by preceding it with the [#SuspendExempt](_SuspendExempt.md) directive. An exempt hotkey/hotstring will remain enabled even while suspension is ON. This allows suspension to be turned off via a hotkey, which would otherwise be impossible since the hotkey would be suspended.

The [keyboard](InstallKeybdHook.md) and/or [mouse](InstallMouseHook.md) hooks will be installed or removed if justified by the changes made by this function.

To disable selected hotkeys/hotstrings automatically based on any condition, such as the type of window that is active, use [#HotIf](_HotIf.md).

Suspending a script's hotkeys does not stop the script's already-running [threads](../misc/Threads.md) (if any); use [Pause](Pause.md) to do that.

When a script's hotkeys are suspended, its [tray icon](../Program.md#tray-icon) changes to ![a green icon with a transparent H](../static/ahk16_suspend.png) (or to ![a green icon with a transparent Pause symbol](../static/ahk16_pause_suspend.png) if the script is also [paused](Pause.md)). This icon change can be avoided by freezing the icon, which is achieved by using `TraySetIcon(,, true)`.

The built-in variable **A_IsSuspended** contains 1 if the script is suspended and 0 otherwise.

<a id="Related"></a>
## Related

[#SuspendExempt](_SuspendExempt.md), [Hotkeys](../Hotkeys.md), [Hotstrings](../Hotstrings.md), [#HotIf](_HotIf.md), [Pause](Pause.md), [ExitApp](ExitApp.md)

<a id="Examples"></a>
## Examples

<a id="ExHotkey"></a>

**Example:** Press a hotkey once to suspend all hotkeys and hotstrings. Press it again to unsuspend.

```ahk
#SuspendExempt
^!s::Suspend  ; Ctrl+Alt+S
#SuspendExempt False
```

<a id="ExPostMessage"></a>

**Example:** Sends a Suspend command to another script.

```ahk
DetectHiddenWindows True
WM_COMMAND := 0x0111
ID_FILE_SUSPEND := 65404
PostMessage WM_COMMAND, ID_FILE_SUSPEND,,, "C:\YourScript.ahk ahk_class AutoHotkey"
```
