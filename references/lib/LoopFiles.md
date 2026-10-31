# Loop Files

Retrieves the specified files or folders, one at a time.

```ahk
Loop Files FilePattern , Mode
```

<a id="Parameters"></a>
## Parameters

**FilePattern**

Type: [String](../Concepts.md#strings)

The name of a single file or folder, or a wildcard pattern such as `"C:\Temp\*.tmp"`. *FilePattern* is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

<a id="wildcards"></a>

Both asterisks (`*`) and question marks (`?`) are supported as wildcards. `*` matches zero or more characters and `?` matches any single character. Usage examples:

- `*.*` or `*` matches all files.
- `*.htm` matches files with the extension .htm, .html, etc.
- `*.` matches files without an extension.
- `log?.txt` matches e.g. log1.txt but not log10.txt.
- `*report*` matches any filename containing the word "report".

A match occurs when the pattern appears in either the file's long/normal name or its [8.3 short name](#LoopFileShortName).

If this parameter is a single file or folder (i.e. no wildcards) and *Mode* includes R, more than one match will be found if the specified file name appears in more than one of the folders being searched.

Patterns longer than 259 characters may fail to find any files due to [system limitations (MAX_PATH)](../misc/LongPaths.md). This limit can be bypassed by using the `\\?\` [long path prefix](../misc/LongPaths.md#prefix), with some stipulations.

**Mode**

Type: [String](../Concepts.md#strings)

If blank or omitted, only files are included and subdirectories are not recursed into. Otherwise, specify one or more of the following letters:

- D = Include directories (folders).
- F = Include files. If both F and D are omitted, files are included but not folders.
- R = Recurse into subdirectories (subfolders). All subfolders will be recursed into, not just those whose names match *FilePattern*. If R is omitted, files and folders in subfolders are not included.

<a id="Special_Variables"></a>
## Special Variables Available Inside a File Loop

The following variables exist within any file loop. If an inner file loop is enclosed by an outer file loop, the innermost loop's file will take precedence:

| Variable | Description |
| --- | --- |
| <a id="LoopFileName"></a>A_LoopFileName | The name of the file or folder currently retrieved (without the path). |
| <a id="LoopFileExt"></a>A_LoopFileExt | The file's extension (e.g. TXT, DOC, or EXE). The period (.) is not included. |
| <a id="LoopFilePath"></a>A_LoopFilePath | The path and name of the file/folder currently retrieved. If *FilePattern* contains a relative path rather than an absolute path, the path here will also be relative. In addition, any short (8.3) folder names in *FilePattern* will still be short (see next item to get the long version). |
| <a id="LoopFileFullPath"></a>A_LoopFileFullPath | This is different than A_LoopFilePath in the following ways: 1) It always contains the absolute/complete path of the file even if *FilePattern* contains a relative path; 2) Any short (8.3) folder names in *FilePattern* itself are converted to their long names; 3) Characters in *FilePattern* are converted to uppercase or lowercase to match the case stored in the file system. This is useful for converting file names -- such as those passed into a script as command line parameters -- to their exact path names as shown by Explorer. |
| <a id="LoopFileShortPath"></a>A_LoopFileShortPath | The 8.3 short path and name of the file/folder currently retrieved. For example: C:\MYDOCU~1\ADDRES~1.txt. If *FilePattern* contains a relative path rather than an absolute path, the path here will also be relative.<br> To retrieve the complete 8.3 path and name for a single file or folder, follow this example:<br> <code>Loop Files, "C:\My Documents\Address List.txt"<br> ShortPathName := A_LoopFileShortPath</code> **Note:** This variable will be <u>blank</u> if the file does not have a short name, which can happen on systems where NtfsDisable8dot3NameCreation has been set in the registry. It will also be blank if *FilePattern* contains a relative path and the body of the loop uses [SetWorkingDir](SetWorkingDir.md) to switch away from the working directory in effect for the loop itself. |
| <a id="LoopFileShortName"></a>A_LoopFileShortName | The 8.3 short name or alternate name of the file. If the file doesn't have one (due to the long name being shorter than 8.3 or perhaps because short-name generation is disabled on an NTFS file system), *A_LoopFileName* will be retrieved instead. |
| <a id="LoopFileDir"></a>A_LoopFileDir | The path of the directory in which *A_LoopFileName* resides. If *FilePattern* contains a relative path rather than an absolute path, the path here will also be relative. A root directory will not contain a trailing backslash. For example: C: |
| <a id="LoopFileTimeModified"></a>A_LoopFileTimeModified | The time the file was last modified. Format [YYYYMMDDHH24MISS](FileSetTime.md). |
| <a id="LoopFileTimeCreated"></a>A_LoopFileTimeCreated | The time the file was created. Format [YYYYMMDDHH24MISS](FileSetTime.md). |
| <a id="LoopFileTimeAccessed"></a>A_LoopFileTimeAccessed | The time the file was last accessed. Format [YYYYMMDDHH24MISS](FileSetTime.md). |
| <a id="LoopFileAttrib"></a>A_LoopFileAttrib | The [attributes](FileGetAttrib.md) of the file currently retrieved. |
| <a id="LoopFileSize"></a>A_LoopFileSize | The size in bytes of the file currently retrieved. Files larger than 4 gigabytes are also supported. |
| <a id="LoopFileSizeKB"></a>A_LoopFileSizeKB | The size in Kbytes of the file currently retrieved, rounded down to the nearest integer. |
| <a id="LoopFileSizeMB"></a>A_LoopFileSizeMB | The size in Mbytes of the file currently retrieved, rounded down to the nearest integer. |

<a id="Remarks"></a>
## Remarks

A file loop is useful when you want to operate on a collection of files and/or folders, one at a time.

All matching files are retrieved, including hidden files. By contrast, OS features such as the DIR command omit hidden files by default. To avoid processing hidden, system, and/or read-only files, use something like the following inside the loop:

```ahk
if A_LoopFileAttrib ~= "[HRS]"  ; Skip any file that is either H (Hidden), R (Read-only), or S (System). See ~= operator.
    continue  ; Skip this file and move on to the next one.
```

To retrieve files' relative paths instead of absolute paths during a recursive search, use [SetWorkingDir](SetWorkingDir.md) to change to the base folder prior to the loop, and then omit the path from the loop (e.g. `Loop Files, "*.*", "R"`). That will cause [A_LoopFilePath](#LoopFilePath) to contain the file's path relative to the base folder.

A file loop can disrupt itself if it creates or renames files or folders within its own purview. For example, if it renames files via [FileMove](FileMove.md) or other means, each such file might be found twice: once as its old name and again as its new name. To work around this, rename the files only after creating a list of them. For example:

```ahk
FileList := ""
Loop Files, "*.jpg"
    FileList .= A_LoopFileName "`n"
Loop Parse, FileList, "`n"
    FileMove A_LoopField, "renamed_" A_LoopField
```

Files in an NTFS file system are probably always retrieved in alphabetical order. Files in other file systems are retrieved in no particular order. To ensure a particular ordering, use the [Sort](Sort.md) function as shown in the Examples section below.

File patterns longer than 259 characters are supported only when at least one of the following is true:

- The system has [long path support](../misc/LongPaths.md) enabled (requires Windows 10 version 1607 or later).
- The `\\?\` [long path prefix](../misc/LongPaths.md#prefix) is used (caveats apply).

In all other cases, file patterns longer than 259 characters will not find any files or folders. This limit applies both to *FilePattern* and any temporary pattern used during recursion into a subfolder.

<a id="otb"></a>

The One True Brace (OTB) style may optionally be used, which allows the open-brace to appear on the same line rather than underneath. For example: `Loop Files "*.txt", "R" {`.

See [Loop](Loop.md) for information about [Blocks](Block.md), [Break](Break.md), [Continue](Continue.md), and the A_Index variable (which exists in every type of loop).

The loop may optionally be followed by an [Else](Else.md) statement, which is executed if no matching files or directories were found (i.e. the loop had zero iterations).

The functions [FileGetAttrib](FileGetAttrib.md), [FileGetSize](FileGetSize.md), [FileGetTime](FileGetTime.md), [FileGetVersion](FileGetVersion.md), [FileSetAttrib](FileSetAttrib.md), and [FileSetTime](FileSetTime.md) can be used in a file loop without their Filename/FilePattern parameter.

<a id="Related"></a>
## Related

[Loop](Loop.md), [Break](Break.md), [Continue](Continue.md), [Blocks](Block.md), [SplitPath](SplitPath.md), [FileSetAttrib](FileSetAttrib.md), [FileSetTime](FileSetTime.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reports the full path of each text file located in a directory and in its subdirectories.

```ahk
Loop Files, A_ProgramFiles "\*.txt", "R"  ; Recurse into subfolders.
{
    Result := MsgBox("Filename = " A_LoopFilePath "`n`nContinue?",, "y/n")
    if Result = "No"
        break
}
```

<a id="ExSize"></a>

**Example:** Calculates the size of a folder, including the files in all its subfolders.

```ahk
FolderSizeKB := 0
WhichFolder := DirSelect()  ; Ask the user to pick a folder.
Loop Files, WhichFolder "\*.*", "R"
    FolderSizeKB += A_LoopFileSizeKB
MsgBox "Size of " WhichFolder " is " FolderSizeKB " KB."
```

<a id="ExSortName"></a>

**Example:** Retrieves file names sorted by name (see next example to sort by date).

```ahk
FileList := ""  ; Initialize to be blank.
Loop Files, "C:\*.*"
    FileList .= A_LoopFileName "`n"
FileList := Sort(FileList, "R")  ; The R option sorts in reverse order. See Sort for other options.
Loop Parse, FileList, "`n"
{
    if A_LoopField = ""  ; Ignore the blank item at the end of the list.
        continue
    Result := MsgBox("File number " A_Index " is " A_LoopField ".  Continue?",, "y/n")
    if Result = "No"
        break
}
```

<a id="ExSortDate"></a>

**Example:** Retrieves file names sorted by modification date.

```ahk
FileList := ""
Loop Files, A_MyDocuments "\Photos\*.*", "FD"  ; Include Files and Directories
    FileList .= A_LoopFileTimeModified "`t" A_LoopFileName "`n"
FileList := Sort(FileList)  ; Sort by date.
Loop Parse, FileList, "`n"
{
    if A_LoopField = "" ; Omit the last linefeed (blank item) at the end of the list.
        continue
    FileItem := StrSplit(A_LoopField, A_Tab)  ; Split into two parts at the tab char.
    Result := MsgBox("The next file (modified at " FileItem[1] ") is:`n" FileItem[2] "`n`nContinue?",, "y/n")
    if Result = "No"
        break
}
```

<a id="ExFileCopy"></a>

**Example:** Copies only the source files that are newer than their counterparts in the destination. Call this function with a source pattern like "A:\Scripts\\\*.ahk" and an **existing** destination directory like "B:\Script Backup".

```ahk
CopyIfNewer(SourcePattern, Dest)
{
    Loop Files, SourcePattern
    {
        copy_it := false
        if !FileExist(Dest "\" A_LoopFileName)  ; Always copy if target file doesn't yet exist.
            copy_it := true
        else
        {
            time := FileGetTime(Dest "\" A_LoopFileName)
            time := DateDiff(time, A_LoopFileTimeModified, "Seconds")  ; Subtract the source file's time from the destination's.
            if time < 0  ; Source file is newer than destination file.
                copy_it := true
        }
        if copy_it
        {
            try
                FileCopy A_LoopFilePath, Dest "\" A_LoopFileName, 1   ; Copy with overwrite=yes
            catch
                MsgBox 'Could not copy "' A_LoopFilePath '" to "' Dest '\' A_LoopFileName '".'
        }
    }
}
```

<a id="ExLongPath"></a>

**Example:** Converts filenames passed in via command-line parameters to long names, complete path, and correct uppercase/lowercase characters as stored in the file system.

```ahk
for GivenPath in A_Args  ; For each parameter (or file dropped onto a script):
{
    Loop Files, GivenPath, "FD"  ; Include files and directories.
        LongPath := A_LoopFilePath
    MsgBox "The case-corrected long path name of file`n" GivenPath "`nis:`n" LongPath
}
```
