# IniWrite

Writes a value or section to a standard format .ini file.

```ahk
IniWrite Value, Filename, Section, Key
IniWrite Pairs, Filename, Section
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [String](../Concepts.md#strings)

The string or number that will be written to the right of *Key*'s equal sign (=).

If the text is long, it can be broken up into several shorter lines by means of a [continuation section](../Scripts.md#continuation), which might improve readability and maintainability.

**Pairs**

Type: [String](../Concepts.md#strings)

The complete content of a section to write to the .ini file, excluding the [SectionName] header. *Key* must be omitted. *Pairs* must not contain any blank lines. If the section already exists, everything up to the last key=value pair is overwritten. *Pairs* can contain lines without an equal sign (=), but this may produce inconsistent results. Comments can be written to the file but are stripped out when they are read back by [IniRead](IniRead.md).

**Filename**

Type: [String](../Concepts.md#strings)

The name of the .ini file, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

**Section**

Type: [String](../Concepts.md#strings)

The section name in the .ini file, which is the heading phrase that appears in square brackets (do not include the brackets in this parameter).

**Key**

Type: [String](../Concepts.md#strings)

The key name in the .ini file.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

Regardless of whether an exception is thrown, [A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

Values longer than 65,535 characters can be written to the file, but may produce inconsistent results as they usually cannot be read correctly by [IniRead](IniRead.md) or other applications.

A standard ini file looks like:

```
[SectionName]
Key=Value
```

New files are created with a UTF-16 byte order mark to ensure that the full range of Unicode characters can be used. If this is undesired, ensure the file exists before calling IniWrite. For example:

```ahk
; Create a file with ANSI encoding.
FileAppend "", "NonUnicode.ini", "CP0"

; Create a UTF-16 file without byte order mark.
FileAppend "[SectionName]`n", "Unicode.ini", "UTF-16-RAW"
```

**Unicode:** IniRead and IniWrite rely on the external functions [GetPrivateProfileString](https://learn.microsoft.com/windows/win32/api/winbase/nf-winbase-getprivateprofilestring) and [WritePrivateProfileString](https://learn.microsoft.com/windows/win32/api/winbase/nf-winbase-writeprivateprofilestringa) to read and write values. These functions support Unicode only in UTF-16 files; all other files are assumed to use the system's default ANSI code page.

<a id="Related"></a>
## Related

[IniDelete](IniDelete.md), [IniRead](IniRead.md), [RegWrite](RegWrite.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Writes a value to a key located in section2 of a standard format .ini file.

```ahk
IniWrite "this is a new value", "C:\Temp\myfile.ini", "section2", "key"
```
