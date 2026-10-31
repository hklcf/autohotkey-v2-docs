# FileInstall

Includes the specified file inside the [compiled version](../Scripts.md#ahk2exe) of the script.

```ahk
FileInstall Source, Dest , Overwrite
```

<a id="Parameters"></a>
## Parameters

**Source**

Type: [String](../Concepts.md#strings)

The name of a single file to be added to the compiled EXE. The file is assumed to be in (or relative to) the script's own directory if an absolute path isn't specified.

This parameter must be a [quoted literal string](../Language.md#strings) (not a variable or any other expression), and must be listed to the right of the function name *FileInstall* (that is, not on a [continuation line](../Scripts.md#continuation) beneath it).

**Dest**

Type: [String](../Concepts.md#strings)

When *Source* is extracted from the EXE, this is the name of the file to be created. It is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. The destination directory must already exist.

**Overwrite**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 0. Otherwise, specify one of the following numbers to indicate whether to overwrite files if they already exist:

**0:** Do not overwrite existing files. The operation will fail and have no effect if *Dest* already exists.

**1:** Overwrite existing files.

Other values are reserved for future use.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

Any case where the file cannot be written to the destination is considered failure. For example:

- The destination file already exists and the *Overwrite* parameter was 0 or omitted.
- The destination file could not be opened due to a permission error, or because the file is in use.
- The destination path was invalid or specifies a folder which does not exist.
- The source file does not exist (only for uncompiled scripts).

<a id="Remarks"></a>
## Remarks

When a call to this function is read by [Ahk2Exe](../Scripts.md#ahk2exe) during compilation of the script, the file specified by *Source* is added to the resulting compiled script. Later, when the compiled script EXE runs and the call to FileInstall is executed, the file is extracted from the EXE and written to the location specified by *Dest*.

Files added to a script are neither compressed nor encrypted during compilation, but the compiled script EXE can be compressed by using the appropriate option in Ahk2Exe.

If this function is used in a normal (uncompiled) script, a simple file copy will be performed instead -- this helps the testing of scripts that will eventually be compiled. No action is taken if the full source and destination paths are equal, as attempting to copy the file to its current location would result in an error. The paths are compared with [lstrcmpi](https://learn.microsoft.com/windows/win32/api/winbase/nf-winbase-lstrcmpiw) after expansion with [GetFullPathName](https://learn.microsoft.com/windows/win32/api/fileapi/nf-fileapi-getfullpathnamew).

<a id="Related"></a>
## Related

[FileCopy](FileCopy.md), [#Include](_Include.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Includes a text file inside the compiled version of the script. Later, when the compiled script is executed, the included file is extracted to another location with another name. If a file with this name already exists at this location, it will be overwritten.

```ahk
FileInstall "My File.txt", A_Desktop "\Example File.txt", 1
```
