# SubStr

Retrieves one or more characters from the specified position in a string.

```ahk
NewStr := SubStr(String, StartingPos , Length)
```

<a id="Parameters"></a>
## Parameters

**String**

Type: [String](../Concepts.md#strings)

The string whose content is copied. This may contain binary zero.

**StartingPos**

Type: [Integer](../Concepts.md#numbers)

Specify 1 to start at the first character, 2 to start at the second, and so on. If *StartingPos* is 0 or beyond *String*'s length, an empty string is returned.

Specify a negative *StartingPos* to start at that position from the right. For example, -1 extracts the last character and -2 extracts the two last characters. If *StartingPos* tries to go beyond the left end of the string, the extraction starts at the first character.

**Length**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to "all characters". Otherwise, specify the maximum number of characters to retrieve (fewer than the maximum are retrieved whenever the remaining part of the string is too short).

You can also specify a negative *Length* to omit that many characters from the end of the returned string (an empty string is returned if all or too many characters are omitted).

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the requested substring of the specified string.

<a id="Related"></a>
## Related

[RegExMatch](RegExMatch.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves a substring with a length of 3 characters at position 4.

```ahk
MsgBox SubStr("123abc789", 4, 3) ; Returns abc
```

<a id="ExStartEnd"></a>

**Example:** Retrieves a substring from the beginning and end of a string.

```ahk
Str := "The Quick Brown Fox Jumps Over the Lazy Dog"
MsgBox SubStr(Str, 1, 19)  ; Returns "The Quick Brown Fox"
MsgBox SubStr(Str, -8)  ; Returns "Lazy Dog"
```
