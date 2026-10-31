# Chr

Returns the string (usually a single character) corresponding to the character code indicated by the specified number.

```ahk
String := Chr(Number)
```

<a id="Parameters"></a>
## Parameters

**Number**

Type: [Integer](../Concepts.md#numbers)

A Unicode character code between 0 and 0x10FFFF.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

The string corresponding to *Number*. This is always a single Unicode character, but for practical reasons, Unicode supplementary characters (where *Number* is in the range 0x10000 to 0x10FFFF) are counted as two characters. That is, the length of the return value as reported by [StrLen](StrLen.md) may be 1 or 2. For further explanation, see [String Encoding](../Concepts.md#string-encoding).

If *Number* is 0, the return value is a string containing a binary null character, not an empty (zero-length) string. This can be safely assigned to a variable, passed to a function or concatenated with another string. However, some built-in functions may "see" only the part of the string preceding the first null character.

<a id="Remarks"></a>
## Remarks

The range and meaning of character codes depends on which [string encoding](../Concepts.md#string-encoding) is in use. Currently all AutoHotkey v2 executables are built for Unicode, so this function always accepts a Unicode character code and returns a Unicode (UTF-16) string.

Common character codes include 9 (tab), 10 (linefeed), 13 (carriage return), 32 (space), 48-57 (the digits 0-9), 65-90 (uppercase A-Z), and 97-122 (lowercase a-z).

<a id="Related"></a>
## Related

[Ord](Ord.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reports the string corresponding to the character code 116.

```ahk
MsgBox Chr(116) ; Reports "t".
```
