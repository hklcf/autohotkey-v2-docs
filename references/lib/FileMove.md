# FileMove

Moves or renames one or more files.

```ahk
FileMove SourcePattern, DestPattern , Overwrite
```

<a id="Parameters"></a>
## Parameters

**SourcePattern**

Type: [String](../Concepts.md#strings)

The name of a single file or a wildcard pattern such as `"C:\Temp\*.tmp"`. *SourcePattern* is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

Both asterisks (`*`) and question marks (`?`) are supported as wildcards. `*` matches zero or more characters and `?` matches any single character. Usage examples:

- `*.*` or `*` matches all files.
- `*.htm` matches files with the extension .htm, .html, etc.
- `*.` matches files without an extension.
- `log?.txt` matches e.g. log1.txt but not log10.txt.
- `*report*` matches any filename containing the word "report".

**DestPattern**

Type: [String](../Concepts.md#strings)

The name or pattern of the destination, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

If present, the first asterisk (`*`) in the filename is replaced with the source filename excluding its extension, while the first asterisk after the last full stop (`.`) is replaced with the source file's extension. If an asterisk is present but the extension is omitted, the source file's extension is used.

To perform a simple move -- retaining the existing file name(s) -- specify only the folder name as shown in these mostly equivalent examples:

```ahk
FileMove "C:\*.txt", "C:\My Folder"
```

```ahk
FileMove "C:\*.txt", "C:\My Folder\*.*"
```

The destination directory must already exist. If *My Folder* does not exist, the first example above will use "My Folder" as the target filename, while the second example will move no files.

**Overwrite**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 0. Otherwise, specify one of the following numbers to indicate whether to overwrite files if they already exist:

**0:** Do not overwrite existing files. The operation will fail and have no effect if *DestPattern* already exists as a file or directory.

**1:** Overwrite existing files.

Other values are reserved for future use.

<a id="Error_Handling"></a>
## Error Handling

An [Error](Error.md) is thrown if any files failed to be moved, with its [Extra](Error.md#Extra) property set to the number of failures. If no files were found, an exception is thrown only if *SourcePattern* lacks the wildcards `*` and `?`. In other words, moving a wildcard pattern such as `"*.txt"` is considered a success when it does not match any files.

Unlike [FileCopy](FileCopy.md), moving a file onto itself is always considered successful, even if the overwrite mode is not in effect.

If files were found, [A_LastError](../Variables.md#LastError) is set to 0 (zero) or the result of the operating system's GetLastError() function immediately after the last failure. Otherwise A_LastError contains an error code that might indicate why no files were found.

<a id="Remarks"></a>
## Remarks

FileMove moves files only. To instead move the contents of a folder (all its files and subfolders), see the examples section below. To move or rename a single folder, use [DirMove](DirMove.md).

The operation will continue even if error(s) are encountered.

Although this function is capable of moving files to a different volume, the operation will take longer than a same-volume move. This is because a same-volume move is similar to a rename, and therefore much faster.

<a id="Related"></a>
## Related

[FileCopy](FileCopy.md), [DirCopy](DirCopy.md), [DirMove](DirMove.md), [FileDelete](FileDelete.md)

<a id="Examples"></a>
## Examples

<a id="ExNoRename"></a>

**Example:** Moves a file without renaming it.

```ahk
FileMove "C:\My Documents\List1.txt", "D:\Main Backup\"
```

<a id="ExRename"></a>

**Example:** Renames a single file.

```ahk
FileMove "C:\File Before.txt", "C:\File After.txt"
```

<a id="ExNewExt"></a>

**Example:** Moves text files to a new location and gives them a new extension.

```ahk
FileMove "C:\Folder1\*.txt", "D:\New Folder\*.bkp"
```

<a id="ExMoveAll"></a>

**Example:** Moves all files and folders inside a folder to a different folder.

```ahk
ErrorCount := MoveFilesAndFolders("C:\My Folder\*.*", "D:\Folder to receive all files & folders")
if ErrorCount != 0
    MsgBox ErrorCount " files/folders could not be moved."

MoveFilesAndFolders(SourcePattern, DestinationFolder, DoOverwrite := false)
; Moves all files and folders matching SourcePattern into the folder named DestinationFolder and
; returns the number of files/folders that could not be moved.
{
    ErrorCount := 0
    if DoOverwrite = 1
        DoOverwrite := 2  ; See DirMove for description of mode 2 vs. 1.
    ; First move all the files (but not the folders):
    try
        FileMove SourcePattern, DestinationFolder, DoOverwrite
    catch as Err
        ErrorCount := Err.Extra
    ; Now move all the folders:
    Loop Files, SourcePattern, "D"  ; D means "retrieve folders only".
    {
        try
            DirMove A_LoopFilePath, DestinationFolder "\" A_LoopFileName, DoOverwrite
        catch
        {
            ErrorCount += 1
            ; Report each problem folder by name.
            MsgBox "Could not move " A_LoopFilePath " into " DestinationFolder
        }
    }
    return ErrorCount
}
```
