# ProcessGetName / ProcessGetPath

Returns the name or path of the specified process.

```ahk
Name := ProcessGetName(PIDOrName)
Path := ProcessGetPath(PIDOrName)
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

Type: [String](../Concepts.md#strings)

ProcessGetName returns the name of the specified process. For example: notepad.exe.

ProcessGetPath returns the path of the specified process. For example: C:\Windows\notepad.exe.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the process could not be found.

An [OSError](Error.md) is thrown if the name/path could not be retrieved.

<a id="Related"></a>
## Related

[Process functions](Process.md), [Run](Run.md), [WinGetProcessName](WinGetProcessName.md), [WinGetProcessPath](WinGetProcessPath.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Get the name and path of a process used to open a document.

```ahk
Run "license.rtf",,, &pid  ; This is likely to exist in C:\Windows\System32.
try {
    name := ProcessGetName(pid)
    path := ProcessGetPath(pid)
}
MsgBox "Name: " (name ?? "could not be retrieved") "`n"
    .  "Path: " (path ?? "could not be retrieved")
```
