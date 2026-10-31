# FileSetAttrib

Changes the attributes of one or more files or folders. Wildcards are supported.

```ahk
FileSetAttrib Attributes , FilePattern, Mode
```

<a id="Parameters"></a>
## Parameters

**Attributes**

Type: [String](../Concepts.md#strings)

The attributes to change. For example, `"+HA-R"`.

To easily turn on, turn off or toggle attributes, prefix one or more of the following attribute letters with a plus (+), minus (-) or caret (^) symbol, respectively:

- R = READONLY
- A = ARCHIVE
- S = SYSTEM
- H = HIDDEN
- N = NORMAL (this is valid only when used without any other attributes)
- O = OFFLINE
- T = TEMPORARY

If no symbol precedes the attribute letters, the file's attributes are replaced with the given attributes. See [example #5](#ExReplace). To remove all attributes, use `"N"` on its own.

**FilePattern**

Type: [String](../Concepts.md#strings)

If omitted, the current file of the innermost enclosing [file loop](LoopFiles.md) will be used. Otherwise, specify the name of a single file or folder, or a wildcard pattern such as `"C:\Temp\*.tmp"`. *FilePattern* is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

Both asterisks (`*`) and question marks (`?`) are supported as wildcards. `*` matches zero or more characters and `?` matches any single character. Usage examples:

- `*.*` or `*` matches all files.
- `*.htm` matches files with the extension .htm, .html, etc.
- `*.` matches files without an extension.
- `log?.txt` matches e.g. log1.txt but not log10.txt.
- `*report*` matches any filename containing the word "report".

**Mode**

Type: [String](../Concepts.md#strings)

If blank or omitted, only files are operated upon and subdirectories are not recursed into. Otherwise, specify one or more of the following letters:

- D = Include directories (folders).
- F = Include files. If both F and D are omitted, files are included but not folders.
- R = Subfolders are recursed into so that files and folders contained therein are operated upon if they match *FilePattern*. All subfolders will be recursed into, not just those whose names match *FilePattern*. If R is omitted, files and folders in subfolders are not included.

<a id="Error_Handling"></a>
## Error Handling

An [Error](Error.md) is thrown if any files failed to be changed, with its [Extra](Error.md#Extra) property set to the number of failures.

If files were found, [A_LastError](../Variables.md#LastError) is set to 0 (zero) or the result of the operating system's GetLastError() function immediately after the last failure. Otherwise A_LastError contains an error code that might indicate why no files were found.

<a id="Remarks"></a>
## Remarks

The compression state of files cannot be changed with this function.

<a id="Related"></a>
## Related

[FileGetAttrib](FileGetAttrib.md), [FileGetTime](FileGetTime.md), [FileSetTime](FileSetTime.md), [FileGetSize](FileGetSize.md), [FileGetVersion](FileGetVersion.md), [file loop](LoopFiles.md)

<a id="Examples"></a>
## Examples

<a id="ExTurnOnMultiple"></a>

**Example:** Turns on the "read-only" and "hidden" attributes of all files and directories (subdirectories are not recursed into).

```ahk
FileSetAttrib "+RH", "C:\MyFiles\*.*", "DF"  ; +RH is identical to +R+H
```

<a id="ExToggle"></a>

**Example:** Toggles the "hidden" attribute of a single directory.

```ahk
FileSetAttrib "^H", "C:\MyFiles"
```

<a id="ExMixed"></a>

**Example:** Turns off the "read-only" attribute and turns on the "archive" attribute of a single file.

```ahk
FileSetAttrib "-R+A", "C:\New Text File.txt"
```

<a id="ExRecurse"></a>

**Example:** Recurses through all .ini files on the C drive and turns on their "archive" attribute.

```ahk
FileSetAttrib "+A", "C:\*.ini", "R"
```

<a id="ExReplace"></a>

**Example:** Copies the attributes of *file2* to *file1*, i.e. it adds any attributes that *file2* has and removes any attributes that *file2* does not have.

```ahk
FileSetAttrib(FileGetAttrib(file2), file1)
```
