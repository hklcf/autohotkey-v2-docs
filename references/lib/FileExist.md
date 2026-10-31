# FileExist

Checks for the existence of a file or folder and returns its attributes.

```ahk
AttributeString := FileExist(FilePattern)
```

<a id="Parameters"></a>
## Parameters

**FilePattern**

Type: [String](../Concepts.md#strings)

The name of a single file or folder, or a wildcard pattern such as `"C:\Temp\*.tmp"`. *FilePattern* is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

Both asterisks (`*`) and question marks (`?`) are supported as wildcards. `*` matches zero or more characters and `?` matches any single character. Usage examples:

- `*.*` or `*` matches all files.
- `*.htm` matches files with the extension .htm, .html, etc.
- `*.` matches files without an extension.
- `log?.txt` matches e.g. log1.txt but not log10.txt.
- `*report*` matches any filename containing the word "report".

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the attributes of the first matching file or folder. This string is a subset of `RASHNDOCTL`, where each letter means the following:

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

If the file has no attributes (rare), "X" is returned. If no file or folder is found, an empty string is returned.

<a id="Remarks"></a>
## Remarks

Note that a wildcard check like `InStr(FileExist("MyFolder\*"), "D")` with *MyFolder* containing files and subfolders will only tell you whether the <u>first</u> matching file is a folder, not whether a folder exists. To check for the latter, use [DirExist](DirExist.md), e.g. `DirExist("MyFolder\*")`.

Unlike [FileGetAttrib](FileGetAttrib.md), FileExist supports wildcard patterns and always returns a non-empty value if a matching file exists.

Since an empty string is seen as "false", the function's return value can always be used as a quasi-boolean value. For example, the statement `if FileExist("C:\My File.txt")` would be true if the file exists and false otherwise.

Since *FilePattern* may contain wildcards, FileExist may be unsuitable for validating a file path which is to be used with another function or program. For example, `FileExist("*.txt")` may return attributes even though "\*.txt" is not a valid filename. In such cases, [FileGetAttrib](FileGetAttrib.md) is preferred.

<a id="Related"></a>
## Related

[DirExist](DirExist.md), [FileGetAttrib](FileGetAttrib.md), [file loops](LoopFiles.md)

<a id="Examples"></a>
## Examples

<a id="ExDrive"></a>

**Example:** Shows a message box if the D drive does exist.

```ahk
if FileExist("D:\")
    MsgBox "The drive exists."
```

<a id="ExPattern"></a>

**Example:** Shows a message box if at least one text file does exist in a directory.

```ahk
if FileExist("D:\Docs\*.txt")
    MsgBox "At least one .txt file exists."
```

<a id="ExNot"></a>

**Example:** Shows a message box if a file does <u>not</u> exist.

```ahk
if not FileExist("C:\Temp\FlagFile.txt")
    MsgBox "The target file does not exist."
```

<a id="ExAttr"></a>

**Example:** Demonstrates how to check a file for a specific attribute.

```ahk
if InStr(FileExist("C:\My File.txt"), "H")
    MsgBox "The file is hidden."
```
