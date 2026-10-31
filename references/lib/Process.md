# Process Functions

Functions for retrieving information about a process or for performing various operations on a process. Click on a function name for details.

| Function | Description |
| --- | --- |
| [ProcessClose](ProcessClose.md) | Forces the first matching process to close. |
| [ProcessExist](ProcessExist.md) | Checks if the specified process exists. |
| [ProcessGetName](ProcessGetName.md) | Returns the name of the specified process. |
| [ProcessGetParent](ProcessGetParent.md) | Returns the process ID (PID) of the process which created the specified process. |
| [ProcessGetPath](ProcessGetName.md) | Returns the path of the specified process. |
| [ProcessSetPriority](ProcessSetPriority.md) | Changes the priority level of the first matching process. |
| [ProcessWait](ProcessWait.md) | Waits for the specified process to exist. |
| [ProcessWaitClose](ProcessWaitClose.md) | Waits for all matching processes to close. |

<a id="Remarks"></a>
## Remarks

**Process list:** Although there is no *ProcessList* function, [example #1](#ExList) and [example #2](#ExListCOM) demonstrate how to retrieve a list of processes via [DllCall](DllCall.md) or COM.

<a id="Related"></a>
## Related

[Run](Run.md), [WinClose](WinClose.md), [WinKill](WinKill.md), [WinWait](WinWait.md), [WinWaitClose](WinWaitClose.md), [WinExist](WinExist.md), [Win functions](Win.md)

<a id="Examples"></a>
## Examples

<a id="ExList"></a>

**Example:** Shows a list of running processes retrieved via [DllCall](DllCall.md) and [EnumProcesses](https://learn.microsoft.com/windows/win32/api/psapi/nf-psapi-enumprocesses).

```ahk
MyGui := Gui()
LV := MyGui.Add("ListView", "w1300 r25", ["#", "PID", "Name", "Path"])
for Index, Proc in GetProcessList()
    LV.Add("", Index, Proc.PID, Proc.Name, Proc.Path)
LV.ModifyCol()
MyGui.Title := LV.GetCount() " Processes"
MyGui.Show()

GetProcessList(MaxProcs := 1024) {
    Arr := []  ; array to store the process information
    DllCall("Psapi.dll\EnumProcesses"
        , "Ptr", Buf := Buffer(MaxProcs * 4)  ; buffer to store all PIDs
        , "UInt", Buf.Size
        , "UIntP", &ByteCnt := 0)  ; number of bytes returned by DllCall
    Loop (ByteCnt // 4) {
        PID := NumGet(Buf, (A_Index - 1) * 4, "UInt")
        try Arr.Push({
            Name: ProcessGetName(PID),
            Path: ProcessGetPath(PID),
            PID: PID
        })
    }
    return Arr
}
```

<a id="ExListCOM"></a>

**Example:** Shows a list of running processes retrieved via COM and [Win32_Process](https://learn.microsoft.com/windows/win32/cimwin32prov/win32-process).

```ahk
MyGui := Gui(, "Process List")
LV := MyGui.Add("ListView", "x2 y0 w400 h500", ["Process Name", "Command Line"])
for process in ComObjGet("winmgmts:").ExecQuery("Select * from Win32_Process")
    LV.Add("", process.Name, process.CommandLine)
MyGui.Show()
```
