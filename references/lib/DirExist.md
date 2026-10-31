# DirExist

Checks for the existence of a folder and returns its attributes.

```ahk
AttributeString := DirExist(FilePattern)
```

<a id="Parameters"></a>
## Parameters

**FilePattern**

Type: [String](../Concepts.md#strings)

The name of a single folder or a wildcard pattern such as `"C:\Program*"`. *FilePattern* is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

Both asterisks (`*`) and question marks (`?`) are supported as wildcards. `*` matches zero or more characters and `?` matches any single character. Usage examples:

- `*` matches all folders.
- `gr?y` matches e.g. gray and grey.
- `*report*` matches any folder name containing the word "report".

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the attributes of the first matching folder. This string is a subset of `RASHDOC`, where each letter means the following:

- R = READONLY
- A = ARCHIVE
- S = SYSTEM
- H = HIDDEN
- D = DIRECTORY
- O = OFFLINE
- C = COMPRESSED

Since this function only checks for the existence of a folder, "D" is always present in the return value. If no folder is found, an empty string is returned.

<a id="Remarks"></a>
## Remarks

Note that searches such as `DirExist("MyFolder\*")` with *MyFolder* containing files and subfolders will only tell you whether a folder exists. If you want to check for the existence of files <u>and</u> folders, use [FileExist](FileExist.md) instead.

Unlike [FileGetAttrib](FileGetAttrib.md), DirExist supports wildcard patterns and always returns a non-empty value if a matching folder exists.

Since an empty string is seen as "false", the function's return value can always be used as a quasi-boolean value. For example, the statement `if DirExist("C:\MyFolder")` would be true if the folder exists and false otherwise.

Since *FilePattern* may contain wildcards, DirExist may be unsuitable for validating a folder path which is to be used with another function or program. For example, `DirExist("Program*")` may return attributes even though "Program\*" is not a valid folder name. In such cases, [FileGetAttrib](FileGetAttrib.md) is preferred.

<a id="Related"></a>
## Related

[FileExist](FileExist.md), [FileGetAttrib](FileGetAttrib.md), [file loops](LoopFiles.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Shows a message box if a folder does exist.

```ahk
if DirExist("C:\Windows")
    MsgBox "The target folder does exist."
```

<a id="ExPattern"></a>

**Example:** Shows a message box if at least one program folder does exist.

```ahk
if DirExist("C:\Program*")
    MsgBox "At least one program folder exists."
```

<a id="ExNot"></a>

**Example:** Shows a message box if a folder does <u>not</u> exist.

```ahk
if not DirExist("C:\Temp")
    MsgBox "The target folder does not exist."
```

<a id="ExAttr"></a>

**Example:** Demonstrates how to check a folder for a specific attribute.

```ahk
if InStr(DirExist("C:\System Volume Information"), "H")
    MsgBox "The folder is hidden."
```
