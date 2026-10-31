# FileGetTime

Retrieves the datetime stamp of a file or folder.

```ahk
Timestamp := FileGetTime(Filename, WhichTime)
```

<a id="Parameters"></a>
## Parameters

**Filename**

Type: [String](../Concepts.md#strings)

If omitted, the current file of the innermost enclosing [file loop](LoopFiles.md) will be used. Otherwise, specify the name of the target file or folder, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

**WhichTime**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to M. Otherwise, specify one of the following letters to set which timestamp should be retrieved:

- M = Modification time
- C = Creation time
- A = Last access time

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns a string of digits in the [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format. The time is your own local time, not UTC/GMT. This string should not be treated as a number, i.e. one should not perform math on it or compare it numerically.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

[A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

See [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) for an explanation of dates and times.

<a id="Related"></a>
## Related

[FileSetTime](FileSetTime.md), [FormatTime](FormatTime.md), [FileGetAttrib](FileGetAttrib.md), [FileSetAttrib](FileSetAttrib.md), [FileGetSize](FileGetSize.md), [FileGetVersion](FileGetVersion.md), [file loop](LoopFiles.md), [DateAdd](DateAdd.md), [DateDiff](DateDiff.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves the modification time and stores it in *Timestamp*.

```ahk
Timestamp := FileGetTime("C:\My Documents\test.doc")
```

<a id="ExC"></a>

**Example:** Retrieves the creation time and stores it in *Timestamp*.

```ahk
Timestamp := FileGetTime("C:\My Documents\test.doc", "C")
```
