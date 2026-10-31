# FileRead

Retrieves the contents of a file.

```ahk
Text := FileRead(Filename , Options)
```

<a id="Parameters"></a>
## Parameters

**Filename**

Type: [String](../Concepts.md#strings)

The name of the file to read, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

**Options**

Type: [String](../Concepts.md#strings)

Zero or more of the following strings. Separate each option from the next with a single space or tab. For example: ``"`n m5000 UTF-8"``

**Encoding:** Specify any of the encoding names accepted by [FileEncoding](FileEncoding.md) (excluding the empty string) to use that encoding if the file lacks a UTF-8 or UTF-16 byte order mark. If omitted, it defaults to [A_FileEncoding](../Variables.md#FileEncoding).

**RAW:** Specify the word RAW (case-insensitive) to read the file's content as [raw binary data](#Binary) and return a [Buffer](Buffer.md) object instead of a string. This option overrides any previously specified encoding and vice versa.

**m1024:** If this option is omitted, the entire file is loaded unless there is insufficient memory, in which case an error message is shown and the thread exits (but [Try](Try.md) can be used to avoid this). Otherwise, replace 1024 with a decimal or hexadecimal number of bytes. If the file is larger than this, only its leading part is loaded.

> **Note:** This might result in the last line ending in a naked carriage return (\`r) rather than \`r\`n.

**\`n** (a linefeed character): Replaces any/all occurrences of carriage return & linefeed (\`r\`n) with linefeed (\`n). However, this translation reduces performance and is usually not necessary. For example, text containing \`r\`n is already in the right format to be added to a [Gui Edit control](StrReplace.md). The following [parsing loop](LoopParse.md) will work correctly regardless of whether each line ends in \`r\`n or just \`n: ``Loop Parse, MyFileContents, "`n", "`r"``.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings) or [Object](../Concepts.md#objects)

This function returns the contents of the specified file.

When the RAW option is used, the return value is a [Buffer](Buffer.md) object instead. See [below](#Binary) for details.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown if there was a problem opening or reading the file.

A file greater than 4 GB in size will cause a [MemoryError](Error.md#MemoryError) to be thrown unless the \*m option is present, in which case the leading part of the file is loaded. A MemoryError will also be thrown if the program is unable to allocate enough memory to contain the requested amount of data.

[A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Binary"></a>
## Reading Binary Data

When the RAW option is used, the return value is a [Buffer](Buffer.md) object containing the raw, unmodified contents of the file. The object's [Size](Buffer.md#Size) property returns the number of bytes read. [NumGet](NumGet.md) or [StrGet](StrGet.md) can be used to retrieve data from the buffer. For example:

```ahk
buf := FileRead(A_AhkPath, "RAW")
if StrGet(buf, 2, "cp0") == "MZ"  ; Looks like an executable file...
{
    ; Read machine type from COFF file header.
    machine := NumGet(buf, NumGet(buf, 0x3C, "uint") + 4, "ushort")
    machine := machine=0x8664 ? "x64" : machine=0x014C ? "x86" : "unknown"
    ; Display machine type and file size.
    MsgBox "This " machine " executable is " buf.Size " bytes."
}
buf := ""
```

This option is generally required for reading binary data because by default, any bytes read from file are interpreted as text and may be converted from the source file's encoding (as specified in the options or by [A_FileEncoding](../Variables.md#FileEncoding)) to the script's [native encoding](../Compat.md#Format), UTF-16. If the data is not UTF-16 text, this conversion generally changes the data in undesired ways.

For another demonstration of the RAW option, see [ClipboardAll example #2](ClipboardAll.md#ExFile).

Finally, [FileOpen](FileOpen.md) and [File.RawRead](File.md#RawRead) or [File.Read*Num*](File.md#ReadNum) may be used to read binary data without first reading the entire file into memory.

<a id="Remarks"></a>
## Remarks

When the goal is to load all or a large part of a file into memory, FileRead performs much better than using a [file-reading loop](LoopRead.md).

If there is concern about using too much memory, check the file size beforehand with [FileGetSize](FileGetSize.md).

[FileOpen](FileOpen.md) provides more advanced functionality than FileRead, such as reading or writing data at a specific location in the file without reading the entire file into memory. See [File Object](File.md) for a list of functions.

<a id="Related"></a>
## Related

[FileEncoding](FileEncoding.md), [FileOpen](FileOpen.md)/[File Object](File.md), [file-reading loop](LoopRead.md), [FileGetSize](FileGetSize.md), [FileAppend](FileAppend.md), [IniRead](IniRead.md), [Sort](Sort.md), [Download](Download.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reads a text file into *MyText*.

```ahk
MyText := FileRead("C:\My Documents\My File.txt")
```

<a id="ExSort"></a>

**Example:** Quickly sorts the contents of a file.

```ahk
Contents := FileRead("C:\Address List.txt")
Contents := Sort(Contents)
FileDelete "C:\Address List (alphabetical).txt"
FileAppend Contents, "C:\Address List (alphabetical).txt"
Contents := "" ; Free the memory.
```
