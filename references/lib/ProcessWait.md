# ProcessWait

Waits for the specified process to exist.

```ahk
PID := ProcessWait(PIDOrName , Timeout)
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

If the specified process is discovered, this function returns the [Process ID (PID)](../misc/WinTitle.md#ahk_pid) of the process. If the function times out, zero is returned.

<a id="Remarks"></a>
## Remarks

Processes are checked every 100 milliseconds; the moment the condition is satisfied, the function stops waiting. In other words, rather than waiting for the timeout to expire, it immediately returns and continues execution of the script. Also, while the function is in a waiting state, new [threads](../misc/Threads.md) can be launched via [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md).

<a id="Related"></a>
## Related

[ProcessWaitClose](ProcessWaitClose.md), [Run](Run.md), [WinWait](WinWait.md), [Process functions](Process.md), [Win functions](Win.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Waits for a Notepad process to appear. If one appears within 5.5 seconds, its priority is set to low and the script's own priority is set to high. After that, an attempt is made to close the process within 5 seconds.

```ahk
NewPID := ProcessWait("notepad.exe", 5.5)
if not NewPID
{
    MsgBox "The specified process did not appear within 5.5 seconds."
    return
}
; Otherwise:
MsgBox "A matching process has appeared (Process ID is " NewPID ")."
ProcessSetPriority "Low", NewPID
ProcessSetPriority "High"  ; Have the script set itself to high priority.
WinClose "Untitled - Notepad"
WaitPID := ProcessWaitClose(NewPID, 5)
if WaitPID ; The PID still exists.
    MsgBox "The process did not close within 5 seconds."
```
