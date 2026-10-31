# IniDelete

Deletes a value from a standard format .ini file.

```ahk
IniDelete Filename, Section , Key
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

If omitted, the entire section will be deleted. Otherwise, specify the key name in the .ini file.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

Regardless of whether an exception is thrown, [A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

A standard ini file looks like:

```
[SectionName]
Key=Value
```

<a id="Related"></a>
## Related

[IniRead](IniRead.md), [IniWrite](IniWrite.md), [RegDelete](RegDelete.md), [RegDeleteKey](RegDeleteKey.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Deletes a key and its value located in section2 from a standard format .ini file.

```ahk
IniDelete "C:\Temp\myfile.ini", "section2", "key"
```
