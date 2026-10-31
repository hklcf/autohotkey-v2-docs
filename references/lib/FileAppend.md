# FileAppend

Writes text or binary data to the end of a file (first creating the file, if necessary).

```ahk
FileAppend Text , Filename, Options
```

<a id="Parameters"></a>
## Parameters

**Text**

Type: [String](../Concepts.md#strings) or [Object](../Concepts.md#objects)

The text or raw binary data to append to the file. Text may include linefeed characters (\`n) to start new lines. In addition, a single long line can be broken up into several shorter ones by means of a [continuation section](../Scripts.md#continuation).

A [Buffer](Buffer.md)-like object may be passed to append raw binary data. If a file is created, a byte order mark (BOM) is written only if "UTF-8" or "UTF-16" has been specified within *Options*. The [default encoding](../Variables.md#FileEncoding) is ignored and the data contained by the object is written as-is, regardless of *Options*. Any object which implements [Ptr](Buffer.md#Ptr) and [Size](Buffer.md#Size) properties may be used.

**Filename**

Type: [String](../Concepts.md#strings)

If omitted, the output file of the innermost enclosing [file-reading loop](LoopRead.md) will be used (if available). Otherwise, specify the name of the file to be appended, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. The destination directory must already exist.

<a id="stdout"></a>

**Standard Output (stdout):** Specifying an asterisk (\*) for *Filename* causes *Text* to be sent to standard output (stdout). Such text can be redirected to a file, piped to another EXE, or captured by [fancy text editors](_ErrorStdOut.md). For example, the following would be valid if typed at a command prompt:

```
"%ProgramFiles%\AutoHotkey\AutoHotkey.exe" "My Script.ahk" >"Error Log.txt"
```

However, text sent to stdout will not appear at the command prompt it was launched from. This can be worked around by 1) compiling the script with the [Ahk2Exe ConsoleApp directive](../misc/Ahk2ExeDirectives.md#ConsoleApp), or 2) piping a script's output to another command or program. For example:

```
"%ProgramFiles%\AutoHotkey\AutoHotkey.exe" "My Script.ahk" |more
```

```
For /F "tokens=*" %L in ('""%ProgramFiles%\AutoHotkey\AutoHotkey.exe" "My Script .ahk""') do @Echo %L
```

Specifying two asterisks (\*\*) for *Filename* causes *Text* to be sent to the standard error stream (stderr).

**Options**

Type: [String](../Concepts.md#strings)

Zero or more of the following strings. Separate each option from the next with a single space or tab. For example: ``"`n UTF-8"``

**Encoding:** Specify any of the encoding names accepted by [FileEncoding](FileEncoding.md) (excluding the empty string) to use that encoding if the file lacks a UTF-8 or UTF-16 byte order mark. If omitted, it defaults to [A_FileEncoding](../Variables.md#FileEncoding) (unless *Text* is an object, in which case no byte order mark is written).

**RAW:** Specify the word RAW (case-insensitive) to write the exact bytes contained by *Text* to the file as-is, without any conversion. This option overrides any previously specified encoding and vice versa. If *Text* is not an object, the data size is always a multiple of 2 bytes due to the use of UTF-16 strings.

**\`n** (a linefeed character): Inserts a carriage return (\`r) before each linefeed (\`n) if one is not already present. In other words, it translates from \`n to \`r\`n. This translation typically does not affect performance. If this option is not used, line endings within *Text* are not changed.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

[A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

To overwrite an existing file, delete it with [FileDelete](FileDelete.md) prior to using FileAppend.

The target file is automatically closed after the text is appended (except when FileAppend is used in its single-parameter mode inside a [file-reading/writing loop](LoopRead.md)).

[FileOpen](FileOpen.md) in append mode provides more control than FileAppend and allows the file to be kept open rather than opening and closing it each time. Once a file is opened in append mode, use `FileObj.Write(Str)` to append the string. File objects also support binary I/O via [RawWrite](File.md#RawWrite)/[RawRead](File.md#RawRead) or [Write*Num*](File.md#WriteNum)/[Read*Num*](File.md#ReadNum).

<a id="Related"></a>
## Related

[FileEncoding](FileEncoding.md), [FileOpen](FileOpen.md)/[File Object](File.md), [FileRead](FileRead.md), [file-reading loop](LoopRead.md), [IniWrite](IniWrite.md), [FileDelete](FileDelete.md), [OutputDebug](OutputDebug.md), [continuation sections](../Scripts.md#continuation)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Creates a file, if necessary, and appends a line.

```ahk
FileAppend "Another line.`n", "C:\My Documents\Test.txt"
```

<a id="ExContSect"></a>

**Example:** Use a [continuation section](../Scripts.md#continuation) to enhance readability and maintainability.

```ahk
FileAppend "
(
A line of text.
By default, the hard carriage return (Enter) between the previous line and this one will be written to the file.
	This line is indented with a tab; by default, that tab will also be written to the file.
)", A_Desktop "\My File.txt"
```

<a id="ExFTP"></a>

**Example:** Demonstrates how to automate FTP uploading using the operating system's built-in FTP command.

```ahk
FTPCommandFile := A_ScriptDir "\FTPCommands.txt"
FTPLogFile := A_ScriptDir "\FTPLog.txt"
try FileDelete FTPCommandFile  ; In case previous run was terminated prematurely.

FileAppend
(
"open host.domain.com
username
password
binary
cd htdocs
put " VarContainingNameOfTargetFile "
delete SomeOtherFile.htm
rename OldFileName.htm NewFileName.htm
ls -l
quit"
), FTPCommandFile

RunWait Format('{1} /c ftp.exe -s:"{2}" >"{3}"', A_ComSpec, FTPCommandFile, FTPLogFile)
FileDelete FTPCommandFile  ; Delete for security reasons.
Run FTPLogFile  ; Display the log for review.
```
