# FileGetSize

Retrieves the size of a file.

```ahk
Size := FileGetSize(Filename, Units)
```

<a id="Parameters"></a>
## Parameters

**Filename**

Type: [String](../Concepts.md#strings)

If omitted, the current file of the innermost enclosing [file loop](LoopFiles.md) will be used. Otherwise, specify the name of the target file, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

**Units**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to B. Otherwise, specify one of the following letters to cause the result to be returned in specific units:

- B = Bytes
- K = Kilobytes
- M = Megabytes

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the size of the specified file (rounded down to the nearest whole number).

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

[A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

Files of any size are supported, even those over 4 gigabytes, and even if *Units* is bytes.

If the target file is a directory, the size will be reported as whatever the OS believes it to be (probably zero in all cases).

To calculate the size of folder, including all its files, follow this example:

```ahk
FolderSize := 0
WhichFolder := DirSelect()  ; Ask the user to pick a folder.
Loop Files, WhichFolder "\*.*", "R"
    FolderSize += A_LoopFileSize
MsgBox "Size of " WhichFolder " is " FolderSize " bytes."
```

<a id="Related"></a>
## Related

[FileGetAttrib](FileGetAttrib.md), [FileSetAttrib](FileSetAttrib.md), [FileGetTime](FileGetTime.md), [FileSetTime](FileSetTime.md), [FileGetVersion](FileGetVersion.md), [file loop](LoopFiles.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves the size in bytes and stores it in *Size*.

```ahk
Size := FileGetSize("C:\My Documents\test.doc")
```

<a id="ExKB"></a>

**Example:** Retrieves the size in kilobytes and stores it in *Size*.

```ahk
Size := FileGetSize("C:\My Documents\test.doc", "K")
```
