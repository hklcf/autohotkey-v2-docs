# DirCreate

Creates a folder.

```ahk
DirCreate DirName
```

<a id="Parameters"></a>
## Parameters

**DirName**

Type: [String](../Concepts.md#strings)

Name of the directory to create, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown if an error occurs.

[A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

This function will also create all parent directories given in *DirName* if they do not already exist.

<a id="Related"></a>
## Related

[DirDelete](DirDelete.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Creates a new directory, including its parent directories if necessary.

```ahk
DirCreate "C:\Test1\My Images\Folder2"
```
