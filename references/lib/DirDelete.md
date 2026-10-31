# DirDelete

Deletes a folder.

```ahk
DirDelete DirName , Recurse
```

<a id="Parameters"></a>
## Parameters

**DirName**

Type: [String](../Concepts.md#strings)

Name of the directory to delete, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

**Recurse**

Type: [Boolean](../Concepts.md#boolean)

If omitted, it defaults to false.

If **false**, files and subdirectories contained in *DirName* are <u>not</u> removed. In this case, if *DirName* is not empty, no action is taken and an exception is thrown.

If **true**, all files and subdirectories are removed (like the Windows command "rmdir /S").

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown if an error occurs.

<a id="Related"></a>
## Related

[DirCreate](DirCreate.md), [FileDelete](FileDelete.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Removes the directory, but only if it is empty.

```ahk
DirDelete "C:\Download Temp"
```

<a id="ExRecurse"></a>

**Example:** Removes the directory including its files and subdirectories.

```ahk
DirDelete "C:\Download Temp", true
```
