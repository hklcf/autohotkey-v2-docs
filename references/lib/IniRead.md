# IniRead

Reads a value, section or list of section names from a standard format .ini file.

```ahk
Value := IniRead(Filename, Section, Key , Default)
Section := IniRead(Filename, Section ,, Default)
SectionNames := IniRead(Filename ,,, Default)
```

<a id="Parameters"></a>
## Parameters

**Filename**

Type: [String](../Concepts.md#strings)

The name of the .ini file, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

**Section**

Type: [String](../Concepts.md#strings)

The section name in the .ini file, which is the heading phrase that appears in square brackets (do not include the brackets in this parameter).

**Key**

Type: [String](../Concepts.md#strings)

The key name in the .ini file.

**Default**

Type: [String](../Concepts.md#strings)

If omitted, an [OSError](Error.md#OSError) is thrown on failure. Otherwise, specify the value to return on failure, such as if the requested key, section or file is not found.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns one of the following depending on the *Key* and *Section* parameters:

- If both parameters are specified, this function returns the actual value of the specified key.
- If *Key* is omitted, this function returns an entire section. Comments and empty lines are omitted. Only the first 65,533 characters of the section are retrieved.
- If *Key* and *Section* are omitted, this function returns a linefeed (`` `n ``) delimited list of section names.

If none of these can be retrieved, the default value indicated by the *Default* parameter is returned.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure, but only if *Default* is omitted.

Regardless of whether an exception is thrown, [A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

The operating system automatically omits leading and trailing spaces/tabs from the retrieved string. To prevent this, enclose the string in single or double quote marks. The outermost set of single or double quote marks is also omitted, but any spaces inside the quote marks are preserved.

Values longer than 65,535 characters are likely to yield inconsistent results.

A standard ini file looks like:

```
[SectionName]
Key=Value
```

**Unicode:** IniRead and IniWrite rely on the external functions [GetPrivateProfileString](https://learn.microsoft.com/windows/win32/api/winbase/nf-winbase-getprivateprofilestring) and [WritePrivateProfileString](https://learn.microsoft.com/windows/win32/api/winbase/nf-winbase-writeprivateprofilestringa) to read and write values. These functions support Unicode only in UTF-16 files; all other files are assumed to use the system's default ANSI code page.

<a id="Related"></a>
## Related

[IniDelete](IniDelete.md), [IniWrite](IniWrite.md), [RegRead](RegRead.md), [file-reading loop](LoopRead.md), [FileRead](FileRead.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reads the value of a key located in section2 from a standard format .ini file and stores it in *Value*.

```ahk
Value := IniRead("C:\Temp\myfile.ini", "section2", "key")
MsgBox "The value is " Value
```
