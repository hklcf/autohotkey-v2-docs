# ProcessClose

Forces the first matching process to close.

```ahk
PID := ProcessClose(PIDOrName)
```

<a id="Parameters"></a>
## Parameters

**PIDOrName**

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

Specify either a number (the PID) or a process name:

**PID:** The Process ID, which is a number that uniquely identifies one specific process (this number is valid only during the lifetime of that process). The PID of a newly launched process can be determined via the [Run](Run.md) function. Similarly, the PID of a window can be determined with [WinGetPID](WinGetPID.md). [ProcessExist](ProcessExist.md) can also be used to discover a PID.

**Name:** The name of a process is usually the same as its executable (without path), e.g. notepad.exe or winword.exe. Since a name might match multiple running processes, only the first process will be operated upon. The name is not case-sensitive.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the [Process ID (PID)](../misc/WinTitle.md#ahk_pid) of the specified process. If a matching process is not found or cannot be manipulated, zero is returned.

<a id="Remarks"></a>
## Remarks

Since the process will be abruptly terminated -- possibly interrupting its work at a critical point or resulting in the loss of unsaved data in its windows (if it has any) -- this function should be used only if a process cannot be closed by using [WinClose](WinClose.md) on one of its windows.

<a id="Related"></a>
## Related

[Run](Run.md), [WinClose](WinClose.md), [WinKill](WinKill.md), [Process functions](Process.md), [Win functions](Win.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Forces the first matching process to close (be warned that any unsaved data will be lost).

```ahk
ProcessClose "notepad.exe"
```

<a id="ExCloseAll"></a>

**Example:** Forces <u>all</u> matching processes to close.

```ahk
ProcessCloseAll(PIDOrName)
{
    While ProcessExist(PIDOrName)
        ProcessClose PIDOrName
}

; Example:
Loop 3
    Run "notepad.exe"
Sleep 3000
ProcessCloseAll "notepad.exe"
```
