# ProcessWaitClose

Waits for all matching processes to close.

```ahk
PID := ProcessWaitClose(PIDOrName , Timeout)
```

<a id="Parameters"></a>
## Parameters

**PIDOrName**

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

Specify either a number (the PID) or a process name:

**PID:** The Process ID, which is a number that uniquely identifies one specific process (this number is valid only during the lifetime of that process). The PID of a newly launched process can be determined via the [Run](Run.md) function. Similarly, the PID of a window can be determined with [WinGetPID](WinGetPID.md). [ProcessExist](ProcessExist.md) can also be used to discover a PID.

**Name:** The name of a process is usually the same as its executable (without path), e.g. notepad.exe or winword.exe. Since a name might match multiple running processes, only the first process will be operated upon. The name is not case-sensitive.

**Timeout**

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

If omitted, the function will wait indefinitely. Otherwise, specify the number of seconds (can contain a decimal point) to wait before timing out.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

If all matching processes are closed, zero is returned. If this function times out, it returns the [Process ID (PID)](../misc/WinTitle.md#ahk_pid) of the first matching process that still exists.

<a id="Remarks"></a>
## Remarks

Processes are checked every 100 milliseconds; the moment the condition is satisfied, the function stops waiting. In other words, rather than waiting for the timeout to expire, it immediately returns and continues execution of the script. Also, while the function is in a waiting state, new [threads](../misc/Threads.md) can be launched via [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md).

<a id="Related"></a>
## Related

[ProcessWait](ProcessWait.md), [Run](Run.md), [WinWaitClose](WinWaitClose.md), [Process functions](Process.md), [Win functions](Win.md)

<a id="Examples"></a>
## Examples

See [example #1](ProcessWait.md#ExBasic) on the [ProcessWait](ProcessWait.md) page.
