# FileSetTime

Changes the datetime stamp of one or more files or folders. Wildcards are supported.

```ahk
FileSetTime YYYYMMDDHH24MISS, FilePattern, WhichTime, Mode
```

<a id="Parameters"></a>
## Parameters

**YYYYMMDDHH24MISS**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to the current local date and time. Otherwise, specify the time to use for the operation (see [Remarks](#Remarks) for the format). Years prior to 1601 are not supported.

**FilePattern**

Type: [String](../Concepts.md#strings)

If omitted, the current file of the innermost enclosing [file loop](LoopFiles.md) will be used. Otherwise, specify the name of a single file or folder, or a wildcard pattern such as `"C:\Temp\*.tmp"`. *FilePattern* is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

Both asterisks (`*`) and question marks (`?`) are supported as wildcards. `*` matches zero or more characters and `?` matches any single character. Usage examples:

- `*.*` or `*` matches all files.
- `*.htm` matches files with the extension .htm, .html, etc.
- `*.` matches files without an extension.
- `log?.txt` matches e.g. log1.txt but not log10.txt.
- `*report*` matches any filename containing the word "report".

**WhichTime**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to M. Otherwise, specify one of the following letters to set which timestamp should be changed:

- M = Modification time
- C = Creation time
- A = Last access time

**Mode**

Type: [String](../Concepts.md#strings)

If blank or omitted, only files are operated upon and subdirectories are not recursed into. Otherwise, specify one or more of the following letters:

- D = Include directories (folders).
- F = Include files. If both F and D are omitted, files are included but not folders.
- R = Subfolders are recursed into so that files and folders contained therein are operated upon if they match *FilePattern*. All subfolders will be recursed into, not just those whose names match *FilePattern*. If R is omitted, files and folders in subfolders are not included.

> **Note:** If *FilePattern* is a single folder rather than a wildcard pattern, it will always be operated upon regardless of this setting.

<a id="Error_Handling"></a>
## Error Handling

An [Error](Error.md) is thrown if any files failed to be changed, with its [Extra](Error.md#Extra) property set to the number of failures.

If files were found, [A_LastError](../Variables.md#LastError) is set to 0 (zero) or the result of the operating system's GetLastError() function immediately after the last failure. Otherwise A_LastError contains an error code that might indicate why no files were found.

<a id="Remarks"></a>
## Remarks

A file's last access time might not be as precise on FAT16 & FAT32 volumes as it is on NTFS volumes.

<a id="YYYYMMDD"></a>

The elements of the YYYYMMDDHH24MISS format are:

| Element | Description |
| --- | --- |
| YYYY | The 4-digit year |
| MM | The 2-digit month (01-12) |
| DD | The 2-digit day of the month (01-31) |
| HH24 | The 2-digit hour in 24-hour format (00-23). For example, 09 is 9am and 21 is 9pm. |
| MI | The 2-digit minutes (00-59) |
| SS | The 2-digit seconds (00-59) |

If only a partial string is given for YYYYMMDDHH24MISS (e.g. 200403), any remaining element that has been omitted will be supplied with the following default values:

- MM = Month 01
- DD = Day 01
- HH24 = Hour 00
- MI = Minute 00
- SS = Second 00

The built-in variable [A_Now](../Variables.md#Now) contains the current local time in the above format. Similarly, [A_NowUTC](../Variables.md#NowUTC) contains the current Coordinated Universal Time.

> **Note:** Date-time values can be compared, added to, or subtracted from via [DateAdd](DateAdd.md) and [DateDiff](DateDiff.md). Also, it is best to not use greater-than or less-than to compare times unless they are both the same string length. This is because they would be compared as numbers; for example, 20040201 is always numerically less (but chronologically greater) than 200401010533. So instead use [DateDiff](DateDiff.md) to find out whether the amount of time between them is positive or negative.

<a id="Related"></a>
## Related

[FileGetTime](FileGetTime.md), [FileGetAttrib](FileGetAttrib.md), [FileSetAttrib](FileSetAttrib.md), [FileGetSize](FileGetSize.md), [FileGetVersion](FileGetVersion.md), [FormatTime](FormatTime.md), [file loop](LoopFiles.md), [DateAdd](DateAdd.md), [DateDiff](DateDiff.md)

<a id="Examples"></a>
## Examples

<a id="ExOmitted"></a>

**Example:** Sets the modification time to the current time for all matching files.

```ahk
FileSetTime "", "C:\temp\*.txt"
```

<a id="ExModTime"></a>

**Example:** Sets the modification date (time will be midnight).

```ahk
FileSetTime 20040122, "C:\My Documents\test.doc"
```

<a id="ExCreateTime"></a>

**Example:** Sets the creation date. The time will be set to 4:55pm.

```ahk
FileSetTime 200401221655, "C:\My Documents\test.doc", "C"
```

<a id="ExPattern"></a>

**Example:** Changes the mod-date of all files that match a pattern. Any matching folders will also be changed due to the last parameter.

```ahk
FileSetTime 20040122165500, "C:\Temp\*.*", "M", "DF"
```
