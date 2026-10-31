# ProcessExist

Checks if the specified process exists.

```ahk
PID := ProcessExist(PIDOrName)
```

<a id="Parameters"></a>
## Parameters

**PIDOrName**

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

If omitted, the script's own process is used. Otherwise, specify either a number (the PID) or a process name:

**PID:** The Process ID, which is a number that uniquely identifies one specific process (this number is valid only during the lifetime of that process). The PID of a newly launched process can be determined via the [Run](Run.md) function. Similarly, the PID of a window can be determined with [WinGetPID](WinGetPID.md).

**Name:** The name of a process is usually the same as its executable (without path), e.g. notepad.exe or winword.exe. Since a name might match multiple running processes, only the first process will be operated upon. The name is not case-sensitive.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the [Process ID (PID)](../misc/WinTitle.md#ahk_pid) of the specified process. If there is no matching process, zero is returned.

<a id="Related"></a>
## Related

[Run](Run.md), [WinExist](WinExist.md), [Process functions](Process.md), [Win functions](Win.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Checks if a process of Notepad exists.

```ahk
if (PID := ProcessExist("notepad.exe"))
    MsgBox "Notepad exists and has the Process ID " PID "."
else
    MsgBox "Notepad does not exist."
```
