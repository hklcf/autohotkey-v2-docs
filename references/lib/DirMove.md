# DirMove

Moves a folder along with all its sub-folders and files. It can also rename a folder.

```ahk
DirMove Source, Dest , OverwriteOrRename
```

<a id="Parameters"></a>
## Parameters

**Source**

Type: [String](../Concepts.md#strings)

Name of the source directory (with no trailing backslash), which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. For example: `"C:\My Folder"`

**Dest**

Type: [String](../Concepts.md#strings)

The new path and name of the directory (with no trailing baskslash), which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. For example: `"D:\My Folder"`

> **Note:** *Dest* is the actual path and name that the directory will have after it is moved; it is *not* the directory into which *Source* is moved (except for the known limitation mentioned below).

**OverwriteOrRename**

Type: [String](../Concepts.md#strings)

If omitted, it defaults to 0. Otherwise, specify one of the following values to indicate whether to overwrite or rename existing files:

**0:** Do not overwrite existing files. The operation will fail if *Dest* already exists as a file or directory.

**1:** Overwrite existing files. **Known limitation:** If *Dest* already exists as a folder and it is on the same volume as *Source*, *Source* will be moved into it rather than overwriting it. To avoid this, see the next option.

**2:** The same as mode 1 above except that the limitation is absent.

**R:** Rename the directory rather than moving it. Although renaming normally has the same effect as moving, it is helpful in cases where you want "all or none" behavior; that is, when you don't want the operation to be only partially successful when *Source* or one of its files is locked (in use). Although this method cannot move *Source* onto a different volume, it can move it to any other directory on its own volume. The operation will fail if *Dest* already exists as a file or directory.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown if an error occurs.

<a id="Remarks"></a>
## Remarks

DirMove moves a single folder to a new location. To instead move the contents of a folder (all its files and subfolders), see the examples section of [FileMove](FileMove.md).

If the source and destination are on different volumes or UNC paths, a copy/delete operation will be performed rather than a move.

<a id="Related"></a>
## Related

[DirCopy](DirCopy.md), [FileCopy](FileCopy.md), [FileMove](FileMove.md), [FileDelete](FileDelete.md), [file loops](LoopFiles.md), [DirSelect](DirSelect.md), [SplitPath](SplitPath.md)

<a id="Examples"></a>
## Examples

<a id="ExNewDrive"></a>

**Example:** Moves a directory to a new drive.

```ahk
DirMove "C:\My Folder", "D:\My Folder"
```

<a id="ExRename"></a>

**Example:** Performs a simple rename.

```ahk
DirMove "C:\My Folder", "C:\My Folder (renamed)", "R"
```

<a id="ExNewLocation"></a>

**Example:** Directories can be "renamed into" another location as long as it's on the same volume.

```ahk
DirMove "C:\My Folder", "C:\New Location\My Folder", "R"
```
