# ComObjGet

Returns a reference to an object provided by a COM component.

```ahk
ComObj := ComObjGet(Name)
```

<a id="Parameters"></a>
## Parameters

**Name**

Type: [String](../Concepts.md#strings)

The display name of the object to be retrieved. See [MkParseDisplayName (Microsoft Docs)](https://learn.microsoft.com/windows/win32/api/objbase/nf-objbase-mkparsedisplayname) for more information.

<a id="Return_Value"></a>
## Return Value

Type: [ComObject](ComObject.md)

This function returns a new COM wrapper object with the [variant type](ComObjType.md#vt) VT_DISPATCH (9).

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Related"></a>
## Related

ComObject

,

ComObjActive

,

ComObjConnect

,

ComObjQuery

,

CoGetObject (Microsoft Docs)

<a id="Examples"></a>
## Examples

<a id="exwmi"></a>

**Example:** Press `Shift`+`Esc` to show the command line which was used to launch the active window's process. For Win32_Process, see [Microsoft Docs](https://learn.microsoft.com/windows/win32/cimwin32prov/win32-process).

```ahk
+Esc::
{
    pid := WinGetPID("A")
    ; Get WMI service object.
    wmi := ComObjGet("winmgmts:")
    ; Run query to retrieve matching process(es).
    queryEnum := wmi.ExecQuery(""
        . "Select * from Win32_Process where ProcessId=" . pid)
        ._NewEnum()
    ; Get first matching process.
    if queryEnum(&proc)
        MsgBox(proc.CommandLine, "Command line", 0)
    else
        MsgBox("Process not found!")
}
```
