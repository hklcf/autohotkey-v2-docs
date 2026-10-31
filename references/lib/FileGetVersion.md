# FileGetVersion

Retrieves the version of a file.

```ahk
Version := FileGetVersion(Filename)
```

<a id="Parameters"></a>
## Parameters

**Filename**

Type: [String](../Concepts.md#strings)

If omitted, the current file of the innermost enclosing [file loop](LoopFiles.md) will be used. Otherwise, specify the name of the target file. If a full path is not specified, this function uses the search sequence specified by the system [LoadLibrary](https://learn.microsoft.com/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya) function.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the version number of the specified file.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure, such as if the file lacks version information.

[A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

Most non-executable files (and even some EXEs) have no version, and thus an error will be thrown.

<a id="Related"></a>
## Related

[FileGetAttrib](FileGetAttrib.md), [FileSetAttrib](FileSetAttrib.md), [FileGetTime](FileGetTime.md), [FileSetTime](FileSetTime.md), [FileGetSize](FileGetSize.md), [file loop](LoopFiles.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves the version of a file and stores it in *Version*.

```ahk
Version := FileGetVersion("C:\My Application.exe")
```

<a id="ExBIV"></a>

**Example:** Retrieves the version of the file "AutoHotkey.exe" located in AutoHotkey's installation directory and stores it in *Version*.

```ahk
Version := FileGetVersion(A_ProgramFiles "\AutoHotkey\AutoHotkey.exe")
```
