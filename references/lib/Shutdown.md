# Shutdown

Shuts down, restarts, or logs off the system.

```ahk
Shutdown Flags
```

<a id="Parameters"></a>
## Parameters

**Flags**

Type: [Integer](../Concepts.md#numbers)

A combination (or sum) of numbers from the table below to indicate the shutdown type.

<a id="Shutdown_Types"></a>
## Shutdown Types

| Number | Windows Constant | Description |
| --- | --- | --- |
| 0x0 (0) | EWX_LOGOFF | Closes all processes and then logs the user off. |
| 0x1 (1) | EWX_SHUTDOWN | Shuts down the system to a point at which it is safe to turn off the power. All file buffers have been flushed to disk, and all running processes have stopped. Then, it turns off the power if the system supports the power-off feature. |
| 0x2 (2) | EWX_REBOOT | Shuts down the system and then restarts the system. |
| 0x4 (4) | EWX_FORCE | Forces all open applications to close. It should only be used in an emergency because it may cause any open applications to lose data. |
| 0x8 (8) | EWX_POWEROFF | Shuts down the system and turns off the power. The system must support the power-off feature. |
| 0x400000 (4194304) | EWX_HYBRID_SHUTDOWN | Prepares the system for the fast startup, shuts down the system and turns off the power. Requires Windows 8 or later, and the corresponding option must be enabled in the system's power settings (if available). |

<a id="Remarks"></a>
## Remarks

Add or combine the required values together. For example, to shut down and power off, use 9 (1 + 8). Alternatively, an [expression](../Variables.md#Expressions) such as `1 + 8` or `0x1 | 0x8` can be specified.

To have the system suspend or hibernate, see [example #2](#ExSuspend) at the bottom of this page.

To turn off the monitor, see [SendMessage example #1](SendMessage.md#ExMonitorPower).

On a related note, a script can detect when the system is shutting down or the user is logging off via [OnExit](OnExit.md).

<a id="Related"></a>
## Related

[Run](Run.md), [ExitApp](ExitApp.md), [OnExit](OnExit.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Forces a reboot (reboot + force = 2 + 4 = 6).

```ahk
Shutdown 6
```

<a id="ExSuspend"></a>

**Example:** Calls the Windows API function "SetSuspendState" to have the system suspend or hibernate. Note that the second parameter may have no effect at all on newer systems.

```ahk
; Parameter #1: Pass 1 instead of 0 to hibernate rather than suspend.
; Parameter #2: Pass 1 instead of 0 to suspend immediately rather than asking each application for permission.
; Parameter #3: Pass 1 instead of 0 to disable all wake events.
DllCall("PowrProf\SetSuspendState", "Int", 0, "Int", 0, "Int", 0)
```
