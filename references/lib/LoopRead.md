# Loop Read

Retrieves the lines in a text file, one at a time.

```ahk
Loop Read InputFile , OutputFile
```

<a id="Parameters"></a>
## Parameters

**InputFile**

Type: [String](../Concepts.md#strings)

The name of the text file whose contents will be read by the loop, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. The file's lines may end in carriage return and linefeed (\`r\`n), just linefeed (\`n), or just carriage return (\`r).

<a id="OutputFile"></a>

**OutputFile**

Type: [String](../Concepts.md#strings)

(Optional) The name of the file to be kept open for the duration of the loop, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

Within the loop's body, use the [FileAppend](FileAppend.md) function without the *Filename* parameter (i.e. omit it) to append to this special file. Appending to a file in this manner performs better than using [FileAppend](FileAppend.md) in its 2-parameter mode because the file does not need to be closed and re-opened for each operation. Remember to include a linefeed (\`n) or carriage return and linefeed (\`r\`n) after the text, if desired.

The file is not opened if nothing is ever written to it. This happens if the loop performs zero iterations or if it never calls [FileAppend](FileAppend.md).

**Options:** The end of line (EOL) translation mode and output file encoding depend on which options are passed in the opening call to [FileAppend](FileAppend.md) (i.e. the first call which omits *Filename*). Subsequent calls ignore the *Options* parameter. EOL translation is not performed by default; that is, linefeed (\`n) characters are written as-is unless the ``"`n"`` option is present.

**Standard Output (stdout):** Specifying an asterisk (\*) for *OutputFile* sends any text written by [FileAppend](FileAppend.md) to standard output (stdout). Such text can be redirected to a file, piped to another EXE, or captured by [fancy text editors](_ErrorStdOut.md). However, text sent to stdout will not appear at the command prompt it was launched from. This can be worked around by 1) compiling the script with the [Ahk2Exe ConsoleApp directive](../misc/Ahk2ExeDirectives.md#ConsoleApp), or 2) piping a script's output to another command or program. See [FileAppend](FileAppend.md) for more details.

<a id="Remarks"></a>
## Remarks

A file-reading loop is useful when you want to operate on each line contained in a text file, one at a time. The file is kept open for the entire operation to avoid having to re-scan each time to find the next line.

<a id="LoopReadLine"></a>

The built-in variable **A_LoopReadLine** exists within any file-reading loop. It contains the contents of the current line excluding the carriage return and linefeed (\`r\`n) that marks the end of the line. If an inner file-reading loop is enclosed by an outer file-reading loop, the innermost loop's file-line will take precedence.

Lines up to 65,534 characters long can be read. If the length of a line exceeds this, its remaining characters will be read during the next loop iteration.

[StrSplit](StrSplit.md) or a [parsing loop](LoopParse.md) is often used inside a file-reading loop to parse the contents of each line retrieved from *InputFile*. For example, if *InputFile*'s lines are each a series of tab-delimited fields, those fields can individually retrieved as in this example:

```ahk
Loop read, "C:\Database Export.txt"
{
    Loop parse, A_LoopReadLine, A_Tab
    {
        MsgBox "Field number " A_Index " is " A_LoopField "."
    }
}
```

To load an entire file into a variable, use [FileRead](FileRead.md) because it performs much better than a loop (especially for large files).

To have multiple files open simultaneously, use [FileOpen](FileOpen.md).

<a id="otb"></a>

The One True Brace (OTB) style may optionally be used, which allows the open-brace to appear on the same line rather than underneath. For example: `Loop Read InputFile, OutputFile {`.

See [Loop](Loop.md) for information about [Blocks](Block.md), [Break](Break.md), [Continue](Continue.md), and the A_Index variable (which exists in every type of loop).

To control how the file is decoded when no byte order mark is present, use [FileEncoding](FileEncoding.md).

The loop may optionally be followed by an [Else](Else.md) statement, which is executed if the input file is empty or could not be found. If *OutputFile* was specified, the special mode of [FileAppend](FileAppend.md) described [above](#OutputFile) may also be used within the *Else* statement's body. If there is no *Else*, an [OSError](Error.md#OSError) is thrown if the file could not be found.

<a id="Related"></a>
## Related

[FileEncoding](FileEncoding.md), [FileOpen](FileOpen.md)/[File Object](File.md), [FileRead](FileRead.md), [FileAppend](FileAppend.md), [Sort](Sort.md), [Loop](Loop.md), [Break](Break.md), [Continue](Continue.md), [Blocks](Block.md), [FileSetAttrib](FileSetAttrib.md), [FileSetTime](FileSetTime.md)

<a id="Examples"></a>
## Examples

<a id="ExFileAppend"></a>

**Example:** Only those lines of the 1st file that contain the word FAMILY will be written to the 2nd file. Uncomment the first line to overwrite rather than append to any existing file.

```ahk
;FileDelete "C:\Docs\Family Addresses.txt"

Loop read, "C:\Docs\Address List.txt", "C:\Docs\Family Addresses.txt"
{
    if InStr(A_LoopReadLine, "family")
        FileAppend(A_LoopReadLine "`n")
}
else
    MsgBox "Address List.txt was completely empty or not found."
```

<a id="ExLastLine"></a>

**Example:** Retrieves the last line from a text file.

```ahk
Loop read, "C:\Log File.txt"
    last_line := A_LoopReadLine  ; When loop finishes, this will hold the last line.
```

<a id="ExURL"></a>

**Example:** Attempts to extract all FTP and HTTP URLs from a text or HTML file.

```ahk
SourceFile := FileSelect(3,, "Pick a text or HTML file to analyze.")
if SourceFile = ""
    return  ; This will exit in this case.

SplitPath SourceFile,, &SourceFilePath,, &SourceFileNoExt
DestFile := SourceFilePath "\" SourceFileNoExt " Extracted Links.txt"

if FileExist(DestFile)
{
    Result := MsgBox("Overwrite the existing links file? Press No to append to it.`n`nFILE: " DestFile,, 4)
    if Result = "Yes"
        FileDelete DestFile
}

LinkCount := 0
Loop read, SourceFile, DestFile
{
    URLSearch(A_LoopReadLine)
}
MsgBox LinkCount ' links were found and written to "' DestFile '".'
return

URLSearch(URLSearchString)
{
    ; It's done this particular way because some URLs have other URLs embedded inside them:
    ; Find the left-most starting position:
    URLStart := 0  ; Set starting default.
    for URLPrefix in ["https://", "http://", "ftp://", "www."]
    {
        ThisPos := InStr(URLSearchString, URLPrefix)
        if !ThisPos  ; This prefix is disqualified.
            continue
        if !URLStart
            URLStart := ThisPos
        else ; URLStart has a valid position in it, so compare it with ThisPos.
        {
            if ThisPos && ThisPos < URLStart
                URLStart := ThisPos
        }
    }

    if !URLStart  ; No URLs exist in URLSearchString.
        return

    ; Otherwise, extract this URL:
    URL := SubStr(URLSearchString, URLStart)  ; Omit the beginning/irrelevant part.
    Loop parse, URL, " `t<>"  ; Find the first space, tab, or angle bracket (if any).
    {
        URL := A_LoopField
        break  ; i.e. perform only one loop iteration to fetch the first "field".
    }
    ; If the above loop had zero iterations because there were no ending characters found,
    ; leave the contents of the URL var untouched.

    ; If the URL ends in a double quote, remove it.  For now, StrReplace is used, but
    ; note that it seems that double quotes can legitimately exist inside URLs, so this
    ; might damage them:
    URLCleansed := StrReplace(URL, '"')
    FileAppend URLCleansed "`n"
    global LinkCount += 1

    ; See if there are any other URLs in this line:
    CharactersToOmit := StrLen(URL)
    CharactersToOmit += URLStart
    URLSearchString := SubStr(URLSearchString, CharactersToOmit)

    ; Recursive call to self:
    URLSearch(URLSearchString)
}
```
