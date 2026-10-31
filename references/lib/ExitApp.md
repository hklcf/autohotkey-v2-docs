# ExitApp

Terminates the script.

```ahk
ExitApp ExitCode
```

<a id="Parameters"></a>
## Parameters

**ExitCode**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 0 (zero is traditionally used to indicate success). Otherwise, specify an integer between -2147483648 and 2147483647 that is returned to its caller when the script exits. This code is accessible to any program that spawned the script, such as another script (via RunWait) or a batch (.bat) file.

<a id="Remarks"></a>
## Remarks

This is equivalent to choosing "Exit" from the script's tray menu or main menu.

Any functions registered by [OnExit](OnExit.md) are called before the script terminates. If such a function returns a non-zero integer, the script does not terminate; instead, the current [thread](../misc/Threads.md) exits as if [Exit](Exit.md) was called.

Terminating the script is not the same as exiting each thread. For instance, [Finally](Finally.md) blocks are not executed and [\__Delete](../Objects.md#Custom_NewDelete) is not called for objects contained by local variables.

ExitApp is often unnecessary in scripts which are not [persistent](../Scripts.md#persistent).

<a id="Related"></a>
## Related

[Exit](Exit.md), [OnExit](OnExit.md), [Persistent](Persistent.md)

<a id="Examples"></a>
## Examples

<a id="ExHotkey"></a>

**Example:** Press a hotkey to terminate the script.

```ahk
#x::ExitApp  ; Win+X
```
