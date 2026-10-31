# Loop Parse

Retrieves substrings (fields) from a string, one at a time.

```ahk
Loop Parse String , DelimiterChars, OmitChars
```

<a id="Parameters"></a>
## Parameters

**String**

Type: [String](../Concepts.md#strings)

The string to analyze.

**DelimiterChars**

Type: [String](../Concepts.md#strings)

If blank or omitted, each character of the input string will be treated as a separate substring.

<a id="CSV"></a>

If this parameter is `"CSV"`, the string will be parsed in standard comma separated value format. Here is an example of a CSV line produced by MS Excel:

```
"first field",SecondField,"the word ""special"" is quoted literally",,"last field, has literal comma"
```

Otherwise, specify one or more characters (case-sensitive), each of which is used to determine where the boundaries between substrings occur.

Delimiter characters are not considered to be part of the substrings themselves. In addition, if there is nothing between a pair of delimiter characters within the input string, the corresponding substring will be empty.

For example: `','` (a comma) would divide the string based on every occurrence of a comma. Similarly, `A_Space A_Tab` would start a new substring every time a space or tab is encountered in the input string.

To use a string as a delimiter rather than a character, first use [StrReplace](StrReplace.md) to replace all occurrences of the string with a single character that is never used literally in the text, e.g. one of these special characters: `¢¤¥¦§©ª«®µ¶`. Consider this example, which uses the string \<br\> as a delimiter:

```ahk
NewHTML := StrReplace(HTMLString, "<br>", "&cent;")
Loop Parse, NewHTML, "&cent;" ; Parse the string based on the cent symbol.
{
    ; ...
}
```

**OmitChars**

Type: [String](../Concepts.md#strings)

If blank or omitted, no characters will be excluded. Otherwise, specify a list of characters (case-sensitive) to exclude from the beginning and end of each substring. For example, if *OmitChars* is `A_Space A_Tab`, spaces and tabs will be removed from the beginning and end (but not the middle) of every retrieved substring.

If *DelimiterChars* is blank, *OmitChars* indicates which characters should be excluded from consideration (the loop will not see them).

<a id="Remarks"></a>
## Remarks

A string parsing loop is useful when you want to operate on each field contained in a string, one at a time. Parsing loops use less memory than [StrSplit](StrSplit.md) (though either way the memory use is temporary) and in most cases they are easier to use.

<a id="LoopField"></a>

The built-in variable **A_LoopField** exists within any parsing loop. It contains the contents of the current substring (field). If an inner parsing loop is enclosed by an outer parsing loop, the innermost loop's field will take precedence.

Although there is no built-in variable "A_LoopDelimiter", the example at the very bottom of this page demonstrates how to detect which delimiter character was encountered for each field.

There is no restriction on the size of the input string or its fields.

To arrange the fields in a different order prior to parsing, use the [Sort](Sort.md) function.

See [Loop](Loop.md) for information about [Blocks](Block.md), [Break](Break.md), [Continue](Continue.md), and the A_Index variable (which exists in every type of loop).

The loop may optionally be followed by an [Else](Else.md) statement, which is executed if the loop had zero iterations. Note that the loop always has at least one iteration unless *String* is empty or *DelimiterChars* is omitted and all characters in *String* are included in *OmitChars*.

<a id="Related"></a>
## Related

[StrSplit](StrSplit.md), [file-reading loop](LoopRead.md), [Loop](Loop.md), [Break](Break.md), [Continue](Continue.md), [Blocks](Block.md), [Sort](Sort.md), [FileSetAttrib](FileSetAttrib.md), [FileSetTime](FileSetTime.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Parses a comma-separated string.

```ahk
Colors := "red,green,blue"
Loop parse, Colors, ","
{
    MsgBox "Color number " A_Index " is " A_LoopField
}
```

<a id="ExFileRead"></a>

**Example:** Reads the lines inside a variable, one by one (similar to a [file-reading loop](LoopRead.md)). A file can be loaded into a variable via [FileRead](FileRead.md).

```ahk
Loop parse, FileContents, "`n", "`r"  ; Specifying `n prior to `r allows both Windows and Unix files to be parsed.
{
    Result := MsgBox("Line number " A_Index " is " A_LoopField ".`n`nContinue?",, "y/n")
}
until Result = "No"
```

<a id="ExClipboard"></a>

**Example:** This is the same as the example above except that it's for the [clipboard](A_Clipboard.md). It's useful whenever the clipboard contains files, such as those copied from an open Explorer window (the program automatically converts such files to their file names).

```ahk
Loop parse, A_Clipboard, "`n", "`r"
{
    Result := MsgBox("File number " A_Index " is " A_LoopField ".`n`nContinue?",, "y/n")
}
until Result = "No"
```

<a id="ExCSV"></a>

**Example:** Parses a comma separated value (CSV) file.

```ahk
Loop read, "C:\Database Export.csv"
{
    LineNumber := A_Index
    Loop parse, A_LoopReadLine, "CSV"
    {
        Result := MsgBox("Field " LineNumber "-" A_Index " is:`n" A_LoopField "`n`nContinue?",, "y/n")
        if Result = "No"
            return
    }
}
```

<a id="ExDelimiter"></a>

**Example:** Determines which delimiter character was encountered.

```ahk
; Initialize string to search.
Colors := "red,green|blue;yellow|cyan,magenta"
; Initialize counter to keep track of our position in the string.
Position := 0

Loop Parse, Colors, ",|;"
{
    ; Calculate the position of the delimiter character at the end of this field.
    Position += StrLen(A_LoopField) + 1
    ; Retrieve the delimiter character found by the parsing loop.
    DelimiterChar := SubStr(Colors, Position, 1)

    MsgBox "Field: " A_LoopField "`nDelimiter character: " DelimiterChar
}
```
