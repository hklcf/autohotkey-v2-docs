# DirCopy

Copies a folder along with all its sub-folders and files (similar to xcopy) or the entire contents of an archive file such as ZIP.

```ahk
DirCopy Source, Dest , Overwrite
```

<a id="Parameters"></a>
## Parameters

**Source**

Type: [String](../Concepts.md#strings)

Name of the source directory (with no trailing backslash), which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. For example: `"C:\My Folder"`

If supported by the OS, *Source* can also be the path of an archive file, in which case its contents will be copied to the destination directory. ZIP files are always supported. TAR files require at least Windows 10 (1803) build 17063. RAR, 7z, gz and others require at least Windows 11 23H2 (which uses [libarchive](https://github.com/libarchive/libarchive), where all supported formats are listed).

**Dest**

Type: [String](../Concepts.md#strings)

Name of the destination directory (with no trailing baskslash), which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. For example: `"C:\Copy of My Folder"`

**Overwrite**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 0. Otherwise, specify one of the following numbers to indicate whether to overwrite files if they already exist:

**0:** Do not overwrite existing files. The operation will fail and have no effect if *Dest* already exists as a file or directory.

**1:** Overwrite existing files.

Other values are reserved for future use.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown if an error occurs.

If the source directory contains any saved webpages consisting of a *PageName.htm* file and a corresponding directory named *PageName_files*, an exception may be thrown even when the copy is successful.

<a id="Remarks"></a>
## Remarks

If the destination directory structure doesn't exist it will be created if possible.

Since the operation will recursively copy a folder along with all its subfolders and files, the result of copying a folder to a destination somewhere inside itself is undefined. To work around this, first copy it to a destination outside itself, then use [DirMove](DirMove.md) to move that copy to the desired location.

DirCopy copies a single folder. To instead copy the contents of a folder (all its files and subfolders), see the examples section of [FileCopy](FileCopy.md).

<a id="Related"></a>
## Related

[DirMove](DirMove.md), [FileCopy](FileCopy.md), [FileMove](FileMove.md), [FileDelete](FileDelete.md), [file loops](LoopFiles.md), [DirSelect](DirSelect.md), [SplitPath](SplitPath.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Copies a directory to a new location.

```ahk
DirCopy "C:\My Folder", "C:\Copy of My Folder"
```

<a id="ExDirSelect"></a>

**Example:** Prompts the user to copy a folder.

```ahk
SourceFolder := DirSelect(, 3, "Select the folder to copy")
if SourceFolder = ""
    return
; Otherwise, continue.
TargetFolder := DirSelect(, 3, "Select the folder IN WHICH to create the duplicate folder.")
if TargetFolder = ""
    return
; Otherwise, continue.
Result := MsgBox("A copy of the folder '" SourceFolder "' will be put into '" TargetFolder "'. Continue?",, 4)
if Result = "No"
    return
SplitPath SourceFolder, &SourceFolderName  ; Extract only the folder name from its full path.
try
    DirCopy SourceFolder, TargetFolder "\" SourceFolderName
catch
    MsgBox "The folder could not be copied, perhaps because a folder of that name already exists in '" TargetFolder "'."
return
```
