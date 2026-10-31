# Sort

Arranges a variable's contents in alphabetical, numerical, or random order (optionally removing duplicates).

```ahk
SortedString := Sort(String , Options, Callback)
```

<a id="Parameters"></a>
## Parameters

**String**

Type: [String](../Concepts.md#strings)

The string to sort.

**Options**

Type: [String](../Concepts.md#strings)

If blank or omitted, *String* will be sorted in ascending alphabetical order (case-insensitive), using a linefeed (\`n) as separator. Otherwise, specify a string of one or more options from the [Options section](#Options) below (in any order, with optional spaces in between).

<a id="callback"></a>

**Callback**

Type: [Function Object](../misc/Functor.md)

If omitted, no custom sorting will be performed. Otherwise, specify the function to call that compares any two items in the list.

The callback accepts three parameters and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(First, Second, Offset) { ...
```

Although the names you give the parameters do not matter, the following values are sequentially assigned to them:

1. The first item.
2. The second item.
3. The offset (in characters) of the second item from the first as seen in the original/unsorted list (see examples).

You can omit one or more parameters from the end of the callback's parameter list if the corresponding information is not needed, but in this case an asterisk must be specified as the final parameter, e.g. `MyCallback(Param1, *)`.

When the callback deems the first parameter to be greater than the second, it should return a positive integer; when it deems the two parameters to be equal, it should return 0, "", or nothing; otherwise, it should return a negative integer. If a decimal point is present in the returned value, that part is ignored (i.e. 0.8 is the same as 0).

The callback uses the same global (or thread-specific) settings as the Sort function that called it.

> **Note:** All options except D, Z, and U are ignored when *Callback* is specified (though N, C, and CL still affect how [duplicates](#unique) are detected).

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the sorted version of the specified string.

<a id="Options"></a>
## Options

**C**, **C1** or **COn**: Case-sensitive sort (ignored if the N option is also present).

**C0** or **COff**: Case-insensitive sort. The uppercase letters A-Z are considered identical to their lowercase counterparts for the purpose of the sort. This is the default mode if none of the other case sensitivity options are used.

**CL** or **CLocale**: Case-insensitive sort based on the current user's locale. For example, most English and Western European locales treat the letters A-Z and ANSI letters like Ä and Ü as identical to their lowercase counterparts. This method also uses a "word sort", which treats hyphens and apostrophes in such a way that words like "coop" and "co-op" stay together. Depending on the content of the items being sorted, the performance will be 1 to 8 times worse than the default method of insensitivity.

**CLogical:** Like *CLocale*, but digits in the strings are considered as numerical content rather than text. For example, "A2" is considered less than "A10". However, if two numbers differ only by the presence of a leading zero, the string with leading zero may be considered *less* than the other string. The exact behavior may differ between OS versions.

**D***x*: Specifies *x* as the delimiter character, which determines where each item begins and ends. The delimiter is always case-sensitive. If this option is not present, *x* defaults to linefeed (\`n). In most cases this will work even if lines end with CR+LF (\`r\`n), but the carriage return (\`r) is included in comparisons and therefore affects the sort order. For example, ``"B`r`nA"`` will sort as expected, but ``"A`r`nA`t`r`nB"`` will place ``A`t`r`` before ``A`r``.

**N:** Numeric sort. Each item is assumed to be a number rather than a string (for example, if this option is not present, the string 233 is considered to be less than the string 40 due to alphabetical ordering). Both decimal and hexadecimal strings (e.g. 0xF1) are considered to be numeric. Strings that do not start with a number are considered to be zero for the purpose of the sort. Numbers are treated as 64-bit floating point values so that the decimal portion of each number (if any) is taken into account.

**P***n*: Sorts items based on character position *n* (do not use hexadecimal for *n*). If this option is not present, *n* defaults to 1, which is the position of the first character. The sort compares each string to the others starting at its *n*th character. If *n* is greater than the length of any string, that string is considered to be blank for the purpose of the sort. When used with option N (numeric sort), the string's character position is used, which is not necessarily the same as the number's digit position.

**R:** Sorts in reverse order (alphabetically or numerically depending on the other options).

**Random:** Sorts in random order. This option causes all other options except D, Z, and U to be ignored (though N, C, and CL still affect how duplicates are detected). Examples:

```ahk
MyVar := Sort(MyVar, "Random")
MyVar := Sort(MyVar, "Random Z D|")
```

<a id="unique"></a>

**U:** Removes duplicate items from the list so that every item is unique. If the C option is in effect, the case of items must match for them to be considered identical. If the N option is in effect, an item such as 2 would be considered a duplicate of 2.0. If either the P or \ (backslash) option is in effect, the entire item must be a duplicate, not just the substring that is used for sorting. If the Random option or [custom sorting](#callback) is in effect, duplicates are removed only if they appear adjacent to each other as a result of the sort. For example, when `"A|B|A"` is sorted randomly, the result could contain either one or two A's.

**Z:** To understand this option, consider a variable that contains ``"RED`nGREEN`nBLUE`n"``. If the Z option is not present, the last linefeed (\`n) is considered to be part of the last item, and thus there are only 3 items. But by specifying Z, the last \`n (if present) will be considered to delimit a blank item at the end of the list, and thus there are 4 items (the last being blank).

**\:** Sorts items based on the substring that follows the last backslash in each. If an item has no backslash, the entire item is used as the substring. This option is useful for sorting bare filenames (i.e. excluding their paths), such as the example below, in which the AAA.txt line is sorted above the BBB.txt line because their directories are ignored for the purpose of the sort:

```
C:\BBB\AAA.txt
C:\AAA\BBB.txt
```

> **Note:** Options N and P are ignored when the \ (backslash) option is present.

<a id="Remarks"></a>
## Remarks

This function is typically used to sort a variable that contains a list of lines, with each line ending in a linefeed character (\`n). One way to get a list of lines into a variable is to load an entire file via [FileRead](FileRead.md).

If a large variable was sorted and later its contents are no longer needed, you can free its memory by making it blank, e.g. `MyVar := ""`.

<a id="Related"></a>
## Related

[FileRead](FileRead.md), [File-reading loop](LoopRead.md), [Parsing loop](LoopParse.md), [StrSplit](StrSplit.md), [CallbackCreate](CallbackCreate.md), [A_Clipboard](A_Clipboard.md)

<a id="Examples"></a>
## Examples

<a id="ExNumbers"></a>

**Example:** Sorts a comma-separated list of numbers.

```ahk
MyVar := "5,3,7,9,1,13,999,-4"
MyVar := Sort(MyVar, "N D,")  ; Sort numerically, use comma as delimiter.
MsgBox MyVar   ; The result is -4,1,3,5,7,9,13,999
```

<a id="ExFileContents"></a>

**Example:** Sorts the contents of a file.

```ahk
Contents := FileRead("C:\Address List.txt")
FileDelete "C:\Address List (alphabetical).txt"
FileAppend Sort(Contents), "C:\Address List (alphabetical).txt"
Contents := ""  ; Free the memory.
```

<a id="ExFilenames"></a>

**Example:** Makes a hotkey to copy files from an open Explorer window and put their sorted filenames onto the clipboard.

```ahk
#c:: ; Win+C
{
    A_Clipboard := "" ; Must be blank for detection to work.
    Send "^c"
    if !ClipWait(2)
        return
    MsgBox "Ready to be pasted:`n" Sort(A_Clipboard)
}
```

<a id="ExCustom"></a>

**Example:** Demonstrates custom sorting via a callback function.

```ahk
MyVar := "This`nis`nan`nexample`nstring`nto`nbe`nsorted"
MsgBox Sort(MyVar,, LengthSort)
LengthSort(a1, a2, *)
{
    a1 := StrLen(a1), a2 := StrLen(a2)
    return a1 > a2 ? 1 : a1 < a2 ? -1 : 0  ; Sorts according to the lengths determined above.
}

MyVar := "5,3,7,9,1,13,999,-4"
MsgBox Sort(MyVar, "D,", IntegerSort)
IntegerSort(a1, a2, *)
{
    return a1 - a2  ; Sorts in ascending numeric order. This method works only if the difference is never so large as to overflow a signed 64-bit integer.
}

MyVar := "1,2,3,4"
MsgBox Sort(MyVar, "D,", ReverseDirection)  ; Reverses the list so that it contains 4,3,2,1
ReverseDirection(a1, a2, offset)
{
    return offset  ; Offset is positive if a2 came after a1 in the original list; negative otherwise.
}

MyVar := "a bbb cc"
; Sorts in ascending length order; uses a fat arrow function:
MsgBox Sort(MyVar, "D ", (a,b,*) => StrLen(a) - StrLen(b))
```
