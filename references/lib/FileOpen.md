# FileOpen

Opens a file to read specific content from it and/or to write new content into it.

```ahk
FileObj := FileOpen(Filename, Flags , Encoding)
```

<a id="Parameters"></a>
## Parameters

**Filename**

Type: [String](../Concepts.md#strings)

The path of the file to open, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

Specify an asterisk (or two) as shown below to open the standard input/output/error stream:

```ahk
FileOpen("*", "r")   ; for stdin
FileOpen("*", "w")   ; for stdout
FileOpen("**", "w")  ; for stderr
```

**Flags**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

Either a string of characters indicating the desired access mode followed by other options (with optional spaces or tabs in between); or a combination (sum) of numeric flags. Supported values are described in the tables below.

**Encoding**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If omitted, the default encoding (as set by [FileEncoding](FileEncoding.md) or CP0 otherwise) will be used. If blank, it defaults to CP0 (the system default ANSI code page). Otherwise, specify the encoding or code page to use for text I/O, e.g. `"UTF-8"`, `"UTF-16"`, `"CP936"` or `936`.

If the file contains a UTF-8 or UTF-16 byte order mark (BOM), or if the `h` (handle) flag is used, this parameter and the default encoding will be ignored, unless the file is being opened with write-only access (i.e. the previous contents of the file are being discarded).

<a id="Flags"></a>
## Flags

<a id="Access_modes"></a>
### Access modes (mutually-exclusive)

| Flag | Dec | Hex | Description |
| :---: | ---: | ---: | --- |
| r | 0 | 0x0 | *Read:* Fails if the file doesn't exist. |
| w | 1 | 0x1 | *Write:* Creates a new file, **overwriting any existing file**. |
| a | 2 | 0x2 | *Append:* Creates a new file if the file didn't exist, otherwise moves the file pointer to the end of the file. |
| rw | 3 | 0x3 | *Read/Write:* Creates a new file if the file didn't exist. |
| h |  |  | Indicates that *Filename* is a file handle to wrap in an object. Sharing mode flags are ignored and the file or stream represented by the handle is not checked for a byte order mark. The file handle is <u>not</u> closed automatically when the file object is destroyed and calling [File.Close](File.md#Close) has no effect. Note that [File.Seek](File.md#Seek), [File.Pos](File.md#Pos) and [File.Length](File.md#Length) should not be used if *Filename* is a handle to a nonseeking device such as a pipe or a communications device. |

<a id="Sharing_mode_flags"></a>
### Sharing mode flags

| Flag | Dec | Hex | Description |
| :---: | ---: | ---: | --- |
| -rwd |  |  | Locks the file for read, write and/or delete access. Any combination of `r`, `w` and `d` may be used. Specifying `-` is the same as specifying `-rwd`. If omitted entirely, the default is to share all access. |
|  | 0 | 0x0 | If *Flags* is numeric, the absence of sharing mode flags causes the file to be locked. |
|  | 256 | 0x100 | Shares *read* access. |
|  | 512 | 0x200 | Shares *write* access. |
|  | 1024 | 0x400 | Shares *delete* access. |

<a id="EOL_options"></a>
### End of line (EOL) options

| Flag | Dec | Hex | Description |
| :---: | ---: | ---: | --- |
| \`n | 4 | 0x4 | Replace `` `r`n `` with `` `n `` when reading and `` `n `` with `` `r`n `` when writing. |
| \`r | 8 | 0x8 | Replace standalone `` `r `` with `` `n `` when reading. |

<a id="Return_Value"></a>
## Return Value

Type: [Object](../Concepts.md#objects)

The return value is a new [File object](File.md) encapsulating the open handle to the file. Use the methods and properties of this object to access the file's contents.

<a id="Errors"></a>
## Errors

If the file cannot be opened, an [OSError](Error.md#OSError) is thrown.

<a id="Remarks"></a>
## Remarks

[File.ReadLine](File.md#ReadLine) always supports `` `n ``, `` `r`n `` and `` `r `` as line endings and does not include them in its return value, regardless of whether the `` `r `` or `` `n `` options are used. The options only affect translation of line endings within the text returned by [File.Read](File.md#Read) or written by [File.Write](File.md#Write) or [File.WriteLine](File.md#WriteLine).

When a UTF-8 or UTF-16 file is created, a byte order mark (BOM) is written to the file <u>unless</u> *Encoding* or the default encoding (as set by [FileEncoding](FileEncoding.md)) is `"UTF-8-RAW"` or `"UTF-16-RAW"`.

When a file containing a UTF-8 or UTF-16 byte order mark (BOM) is opened with read access, the BOM is excluded from the output by positioning the file pointer after it. Therefore, [File.Pos](File.md#Pos) may report 3 or 2 immediately after opening the file.

If necessary, the write buffer can be flushed using [File.Read](File.md#Read) such as `FileObj.Read(0)`. See [example #3](#ExStreams) below.

<a id="Related"></a>
## Related

[FileEncoding](FileEncoding.md), [File Object](File.md), [FileRead](FileRead.md)

<a id="Examples"></a>
## Examples

<a id="ExWriteRead"></a>

**Example:** Writes some text to a file then reads it back into memory (it provides the same functionality as [this DllCall example](DllCall.md#ExFile)).

```ahk
FileName := FileSelect("S16",, "Create a new file:")
if (FileName = "")
    return
try
    FileObj := FileOpen(FileName, "w")
catch as Err
{
    MsgBox "Can't open '" FileName "' for writing."
        . "`n`n" Type(Err) ": " Err.Message
    return
}
TestString := "This is a test string.`r`n"  ; When writing a file this way, use `r`n rather than `n to start a new line.
FileObj.Write(TestString)
FileObj.Close()

; Now that the file was written, read its contents back into memory.
try
    FileObj := FileOpen(FileName, "r-d") ; read the file ("r"), share all access except for delete ("-d")
catch as Err
{
    MsgBox "Can't open '" FileName "' for reading."
        . "`n`n" Type(Err) ": " Err.Message
    return
}
CharsToRead := StrLen(TestString)
TestString := FileObj.Read(CharsToRead)
FileObj.Close()
MsgBox "The following string was read from the file: " TestString
```

<a id="ExReadLine"></a>

**Example:** Opens the script in read-only mode and read its first line.

```ahk
Script := FileOpen(A_ScriptFullPath, "r")
MsgBox Script.ReadLine()
```

<a id="ExStreams"></a>

**Example:** Demonstrates the usage of the standard input/output streams.

```ahk
; Open a console window for this demonstration:
DllCall("AllocConsole")
; Open the application's stdin/stdout streams.
stdin  := FileOpen("*", "r")
stdout := FileOpen("*", "w")
stdout.Write("Enter your query.`n\> ")
stdout.Read(0) ; Flush the write buffer.
query := RTrim(stdin.ReadLine(), "`n")
stdout.WriteLine("Your query was '" query "'. Have a nice day.")
stdout.Read(0) ; Flush the write buffer.
Sleep 5000
```
