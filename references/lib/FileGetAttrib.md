# FileGetAttrib

Reports whether a file or folder is read-only, hidden, etc.

```ahk
AttributeString := FileGetAttrib(Filename)
```

<a id="Parameters"></a>
## Parameters

**Filename**

Type: [String](../Concepts.md#strings)

If omitted, the current file of the innermost enclosing [file loop](LoopFiles.md) will be used. Otherwise, specify the name of the target file, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. Unlike [FileExist](FileExist.md) and [DirExist](DirExist.md), this must be a true filename, not a pattern.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the attributes of the file or folder. This string is a subset of `RASHNDOCTL`, where each letter means the following:

- R = READONLY
- A = ARCHIVE
- S = SYSTEM
- H = HIDDEN
- N = NORMAL
- D = DIRECTORY
- O = OFFLINE
- C = COMPRESSED
- T = TEMPORARY
- L = REPARSE_POINT (typically a symbolic link)

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

[A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

To check if a particular attribute is present in the retrieved string, see [example #2](#ExIf) below.

On a related note, to retrieve a file's 8.3 short name, follow this example:

```ahk
Loop Files, "C:\My Documents\Address List.txt"
    ShortPathName := A_LoopFileShortPath  ; Will yield something similar to C:\MYDOCU~1\ADDRES~1.txt
```

A similar method can be used to get the long name of an 8.3 short name.

<a id="Related"></a>
## Related

[FileExist](FileExist.md), [DirExist](DirExist.md), [FileSetAttrib](FileSetAttrib.md), [FileGetTime](FileGetTime.md), [FileSetTime](FileSetTime.md), [FileGetSize](FileGetSize.md), [FileGetVersion](FileGetVersion.md), [file loop](LoopFiles.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Stores the attribute letters of a directory in *OutputVar*. Note that existing directories always have the attribute letter D.

```ahk
OutputVar := FileGetAttrib("C:\New Folder")
```

<a id="ExIf"></a>

**Example:** Checks if the Hidden attribute is present in the retrieved string.

```ahk
if InStr(FileGetAttrib("C:\My File.txt"), "H")
    MsgBox "The file is hidden."
```
