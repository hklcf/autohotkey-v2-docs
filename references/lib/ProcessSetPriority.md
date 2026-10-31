# ProcessSetPriority

Changes the priority level of the first matching process.

```ahk
PID := ProcessSetPriority(Level , PIDOrName)
```

<a id="Parameters"></a>
## Parameters

**Level**

Type: [String](../Concepts.md#strings)

Specify one of the following words or letters:

- Low (or L)
- BelowNormal (or B)
- Normal (or N)
- AboveNormal (or A)
- High (or H)
- Realtime (or R)

Note that any process not designed to run at Realtime priority might reduce system stability if set to that level.

**PIDOrName**

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

If omitted, the script's own process is used. Otherwise, specify either a number (the PID) or a process name:

**PID:** The Process ID, which is a number that uniquely identifies one specific process (this number is valid only during the lifetime of that process). The PID of a newly launched process can be determined via the [Run](Run.md) function. Similarly, the PID of a window can be determined with [WinGetPID](WinGetPID.md). [ProcessExist](ProcessExist.md) can also be used to discover a PID.

**Name:** The name of a process is usually the same as its executable (without path), e.g. notepad.exe or winword.exe. Since a name might match multiple running processes, only the first process will be operated upon. The name is not case-sensitive.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the [Process ID (PID)](../misc/WinTitle.md#ahk_pid) of the specified process. If a matching process is not found or cannot be manipulated, zero is returned.

<a id="Remarks"></a>
## Remarks

The current priority level of a process can be seen in the Windows Task Manager.

<a id="Related"></a>
## Related

[Run](Run.md), [Process functions](Process.md), [Win functions](Win.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Launches Notepad, sets its priority to high and reports its current PID.

```ahk
Run "notepad.exe", , , &NewPID
ProcessSetPriority "High", NewPID
MsgBox "The newly launched Notepad's PID is " NewPID
```

<a id="ExHotkey"></a>

**Example:** Press a hotkey to change the priority of the active window's process.

```ahk
#z:: ; Win+Z hotkey
{
    active_pid := WinGetPID("A")
    active_title := WinGetTitle("A")
    MyGui := Gui(, "Set Priority")
    MyGui.Add("Text",, "
    (
        Press ESCAPE to cancel, or double-click a new
        priority level for the following window:
    )")
    MyGui.Add("Text", "wp", active_title)
    LB := MyGui.Add("ListBox", "r5 Choose1", ["Normal", "High", "Low", "BelowNormal", "AboveNormal"])
    LB.OnEvent("DoubleClick", SetPriority)
    MyGui.Add("Button", "default", "OK").OnEvent("Click", SetPriority)
    MyGui.OnEvent("Escape", (*) => MyGui.Destroy())
    MyGui.OnEvent("Close", (*) => MyGui.Destroy())
    MyGui.Show()

    SetPriority(*)
    {
        new_prio := LB.Text
        MyGui.Destroy()
        if ProcessSetPriority(new_prio, active_pid)
            MsgBox "Success: Its priority was changed to " new_prio
        else
            MsgBox "Error: Its priority could not be changed to " new_prio
    }
}
```
