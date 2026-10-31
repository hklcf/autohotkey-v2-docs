# ProcessGetParent

Returns the process ID (PID) of the process which created the specified process.

```ahk
PID := ProcessGetParent(PIDOrName)
```

<a id="Parameters"></a>
## Parameters

**PIDOrName**

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

If omitted, the script's own process is used. Otherwise, specify either a number (the PID) or a process name:

**PID:** The Process ID, which is a number that uniquely identifies one specific process (this number is valid only during the lifetime of that process). The PID of a newly launched process can be determined via the [Run](Run.md) function. Similarly, the PID of a window can be determined with [WinGetPID](WinGetPID.md). [ProcessExist](ProcessExist.md) can also be used to discover a PID.

**Name:** The name of a process is usually the same as its executable (without path), e.g. notepad.exe or winword.exe. Since a name might match multiple running processes, only the first process will be operated upon. The name is not case-sensitive.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the process ID (PID) of the process which created the specified process.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the specified process could not be found.

<a id="Remarks"></a>
## Remarks

If the parent process is no longer running, there is some risk that the returned PID has been reused by the system, and now identifies a different process.

<a id="Related"></a>
## Related

[Process functions](Process.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Display the name of the process which launched the script.

```ahk
try
    MsgBox ProcessGetName(ProcessGetParent())
catch
    MsgBox "Unable to retrieve parent process name; the process has likely exited."
```
