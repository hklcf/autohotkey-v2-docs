# StrReplace

Replaces the specified substring with a new string.

```ahk
ReplacedStr := StrReplace(Haystack, Needle , ReplaceText, CaseSense, &OutputVarCount, Limit)
```

<a id="Parameters"></a>
## Parameters

**Haystack**

Type: [String](../Concepts.md#strings)

The string whose content is searched and replaced.

**Needle**

Type: [String](../Concepts.md#strings)

The string to search for.

**ReplaceText**

Type: [String](../Concepts.md#strings)

If blank or omitted, *Needle* will be replaced with blank (empty), meaning it will be omitted from the return value. Otherwise, specify the string to replace *Needle* with.

**CaseSense**

Type: [String](../Concepts.md#strings) or [Integer (boolean)](../Concepts.md#boolean)

If omitted, it defaults to *Off*. Otherwise, specify one of the following values:

**On** or **1** (true): The search is case-sensitive.

**Off** or **0** (false): The search is not case-sensitive, i.e. the letters A-Z are considered identical to their lowercase counterparts.

**Locale:** The search is not case-sensitive according to the rules of the current user's locale. For example, most English and Western European locales treat not only the letters A-Z as identical to their lowercase counterparts, but also non-ASCII letters like Ä and Ü as identical to theirs. *Locale* is 1 to 8 times slower than *Off* depending on the nature of the strings being compared.

**&OutputVarCount**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify a reference to the output variable in which to store the number of replacements that occurred (0 if none).

**Limit**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to -1, which replaces <u>all</u> occurrences of the pattern found in *Haystack*. Otherwise, specify the maximum number of replacements to allow. The part of *Haystack* to the right of the last replacement is left unchanged.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the replaced version of the specified string.

<a id="Remarks"></a>
## Remarks

The built-in variables **A_Space** and **A_Tab** contain a single space and a single tab character, respectively. They are useful when searching for spaces and tabs alone or at the beginning or end of *Needle*.

<a id="Related"></a>
## Related

[RegExReplace](RegExReplace.md), [InStr](InStr.md), [SubStr](SubStr.md), [StrLen](StrLen.md), [StrLower](StrLower.md), [StrUpper](StrLower.md)

<a id="Examples"></a>
## Examples

<a id="ExClipboard"></a>

**Example:** Removes all CR-LF pairs from the clipboard contents.

```ahk
A_Clipboard := StrReplace(A_Clipboard, "`r`n")
```

<a id="ExVar"></a>

**Example:** Replaces all spaces with pluses.

```ahk
NewStr := StrReplace(OldStr, A_Space, "+")
```

<a id="ExRemoveBlankLines"></a>

**Example:** Removes all blank lines from the text in a variable.

```ahk
Loop
{
    MyString := StrReplace(MyString, "`r`n`r`n", "`r`n",, &Count)
    if (Count = 0)  ; No more replacements needed.
        break
}
```
