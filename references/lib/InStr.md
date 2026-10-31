# InStr

Searches for a given occurrence of a string, from the left or the right.

```ahk
FoundPos := InStr(Haystack, Needle , CaseSense, StartingPos, Occurrence)
```

<a id="Parameters"></a>
## Parameters

**Haystack**

Type: [String](../Concepts.md#strings)

The string whose content is searched.

**Needle**

Type: [String](../Concepts.md#strings)

The string to search for.

**CaseSense**

Type: [String](../Concepts.md#strings) or [Integer (boolean)](../Concepts.md#boolean)

If omitted, it defaults to *Off*. Otherwise, specify one of the following values:

**On** or **1** (true): The search is case-sensitive.

**Off** or **0** (false): The search is not case-sensitive, i.e. the letters A-Z are considered identical to their lowercase counterparts.

**Locale:** The search is not case-sensitive according to the rules of the current user's locale. For example, most English and Western European locales treat not only the letters A-Z as identical to their lowercase counterparts, but also non-ASCII letters like Ä and Ü as identical to theirs. *Locale* is 1 to 8 times slower than *Off* depending on the nature of the strings being compared.

**StartingPos**

Type: [Integer](../Concepts.md#numbers)

If omitted, the entire string is searched. Otherwise, specify the position at which to start the search, where 1 is the first character, 2 is the second character, and so on. Negative values count from the end of *Haystack*, so -1 is the last character, -2 is the second-last, and so on.

If *Occurrence* is omitted, a negative *StartingPos* causes the search to be conducted from right to left. However, *StartingPos* has no effect on the direction of the search if *Occurrence* is specified.

For a right-to-left search, *StartingPos* specifies the position of the <u>last</u> character of the first potential occurence of *Needle*. For example, `InStr("abc", "bc",, 2, +1)` will find a match but `InStr("abc", "bc",, 2, -1)` will not.

If the absolute value of *StartingPos* is greater than the length of *Haystack*, 0 is returned.

**Occurrence**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to the first match in *Haystack*. The search is conducted from right to left if *StartingPos* is negative; otherwise it is conducted from left to right.

If *Occurrence* is positive, the search is always conducted from left to right. Specify 2 for *Occurrence* to return the position of the second match, 3 for the third match, etc.

If *Occurrence* is negative, the search is always conducted from right to left. For example, -2 searches for the second occurrence from the right.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the position of an occurrence of the string *Needle* in the string *Haystack*. Position 1 is the first character; this is because 0 is synonymous with "false", making it an intuitive "not found" indicator.

Regardless of the values of *StartingPos* or *Occurrence*, the return value is always relative to the first character of *Haystack*. For example, the position of "abc" in "123abc789" is always 4.

Conventionally, an occurrence of an empty string (`""`) can be found at any position. However, as a blank *Needle* would typically only be passed by mistake, it is treated as an error (an exception is thrown).

<a id="Error_Handling"></a>
## Error Handling

A [ValueError](Error.md#ValueError) is thrown in any of the following cases:

- *Needle* is an empty (zero-length) string.
- *CaseSense* is invalid.
- *Occurrence* or *StartingPos* is 0 or non-numeric.

<a id="Remarks"></a>
## Remarks

[RegExMatch](RegExMatch.md) can be used to search for a pattern (regular expression) within a string, making it much more flexible than InStr. However, InStr is generally faster than RegExMatch when searching for a simple substring.

InStr searches only up to the first binary zero (null-terminator), whereas RegExMatch searches the entire [length](StrLen.md) of the string even if it includes binary zero.

<a id="Related"></a>
## Related

[RegExMatch](RegExMatch.md), [Is functions](Is.md)

<a id="Examples"></a>
## Examples

<a id="ExRetValue"></a>

**Example:** Reports the 1-based position of the substring "abc" in the string "123abc789".

```ahk
MsgBox InStr("123abc789", "abc") ; Returns 4
```

<a id="ExBasic"></a>

**Example:** Searches for *Needle* in *Haystack*.

```ahk
Haystack := "The Quick Brown Fox Jumps Over the Lazy Dog"
Needle := "Fox"
If InStr(Haystack, Needle)
    MsgBox "The string was found."
Else
    MsgBox "The string was not found."
```

<a id="ExCaseSens"></a>

**Example:** Demonstrates the difference between a case-insensitive and case-sensitive search.

```ahk
Haystack := "The Quick Brown Fox Jumps Over the Lazy Dog"
Needle := "the"
MsgBox InStr(Haystack, Needle, false, 1, 2) ; case-insensitive search, return start position of second occurence
MsgBox InStr(Haystack, Needle, true) ; case-sensitive search, return start position of first occurence, same result as above
```
