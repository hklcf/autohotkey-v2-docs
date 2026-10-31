# StrLen

Retrieves the count of how many characters are in a string.

```ahk
Length := StrLen(String)
```

<a id="Parameters"></a>
## Parameters

**String**

Type: [String](../Concepts.md#strings)

The string whose contents will be measured.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the length of the specified string.

<a id="Related"></a>
## Related

[InStr](InStr.md), [SubStr](SubStr.md), [Trim](Trim.md), [StrLower](StrLower.md), [StrUpper](StrLower.md), [StrPut](StrPut.md), [StrGet](StrGet.md), [StrReplace](StrReplace.md), [StrSplit](StrSplit.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves and reports the count of how many characters are in a string.

```ahk
StrValue := "The quick brown fox jumps over the lazy dog"
MsgBox "The length of the string is " StrLen(StrValue) ; Result: 43
```
