# Ord

Returns the ordinal value (numeric character code) of the first character in the specified string.

```ahk
Number := Ord(String)
```

<a id="Parameters"></a>
## Parameters

**String**

Type: [String](../Concepts.md#strings)

The string whose ordinal value is retrieved.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the ordinal value of *String*, or 0 if *String* is empty. If *String* begins with a Unicode supplementary character, this function returns the corresponding Unicode character code (a number between 0x10000 and 0x10FFFF). Otherwise it returns a value in the range 0 to 255 (for ANSI) or 0 to 0xFFFF (for Unicode). See [Unicode vs ANSI](../Compat.md#Format) for details.

<a id="Related"></a>
## Related

[Chr](Chr.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Both message boxes below show 116, because only the first character is considered.

```ahk
MsgBox Ord("t")
MsgBox Ord("test")
```
