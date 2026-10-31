# StrSplit

Separates a string into an array of substrings using the specified delimiters.

```ahk
Array := StrSplit(String , Delimiters, OmitChars, MaxParts)
```

<a id="Parameters"></a>
## Parameters

**String**

Type: [String](../Concepts.md#strings)

A string to split.

**Delimiters**

Type: [String](../Concepts.md#strings) or [Array](Array.md)

If blank or omitted, each character of the input string will be treated as a separate substring.

Otherwise, specify either a single string or an array of strings (case-sensitive), each of which is used to determine where the boundaries between substrings occur. Since the delimiters are not considered to be part of the substrings themselves, they are never included in the returned array. Also, if there is nothing between a pair of delimiters within the input string, the corresponding array element will be blank.

For example: `","` would divide the string based on every occurrence of a comma. Similarly, `[A_Space, A_Tab]` would create a new array element every time a space or tab is encountered in the input string.

**OmitChars**

Type: [String](../Concepts.md#strings)

If blank or omitted, no characters will be excluded. Otherwise, specify a list of characters (case-sensitive) to exclude from the beginning and end of each array element. For example, if *OmitChars* is ``" `t"``, spaces and tabs will be removed from the beginning and end (but not the middle) of every element.

If *Delimiters* is blank, *OmitChars* indicates which characters should be excluded from the array.

**MaxParts**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to -1, which means "no limit". Otherwise, specify the maximum number of substrings to return. If non-zero, the string is split a maximum of *MaxParts*-1 times and the remainder of the string is returned in the last substring (excluding any leading or trailing *OmitChars*).

<a id="Return_Value"></a>
## Return Value

Type: [Array](Array.md)

This function returns an array containing the substrings of the specified string.

<a id="Remarks"></a>
## Remarks

Whitespace characters such as spaces and tabs will be preserved unless those characters are included in the *Delimiters* or *OmitChars* parameters. Spaces and tabs can be trimmed from both ends of any variable by using [Trim](Trim.md). For example: `Var := Trim(Var)`

To split a string that is in standard CSV (comma separated value) format, use a [parsing loop](LoopParse.md) since it has built-in CSV handling.

To arrange the fields in a different order prior to splitting them, use the [Sort](Sort.md) function.

If you do not need the substrings to be permanently stored in memory, consider using a [parsing loop](LoopParse.md) -- especially if *String* is very large, in which case a large amount of memory would be saved. For example:

```ahk
Colors := "red,green,blue"
Loop Parse, Colors, ","
    MsgBox "Color number " A_Index " is " A_LoopField
```

<a id="Related"></a>
## Related

[Parsing loop](LoopParse.md), [Sort](Sort.md), [SplitPath](SplitPath.md), [InStr](InStr.md), [SubStr](SubStr.md), [StrLen](StrLen.md), [StrLower](StrLower.md), [StrUpper](StrLower.md), [StrReplace](StrReplace.md)

<a id="Examples"></a>
## Examples

<a id="ExSpace"></a>

**Example:** Separates a sentence into an array of words and reports the fourth word.

```ahk
TestString := "This is a test."
word_array := StrSplit(TestString, A_Space, ".")  ; Omits periods.
MsgBox "The 4th word is " word_array[4]
```

<a id="ExComma"></a>

**Example:** Separates a comma-separated list of colors into an array of substrings and traverses them, one by one.

```ahk
colors := "red,green,blue"
For index, color in StrSplit(colors, ",")
    MsgBox "Color number " index " is " color
```
