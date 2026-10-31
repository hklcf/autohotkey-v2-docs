# Trim / LTrim / RTrim

Trims characters from the beginning and/or end of a string.

```ahk
NewString :=  Trim(String , OmitChars)
NewString := LTrim(String , OmitChars)
NewString := RTrim(String , OmitChars)
```

<a id="Parameters"></a>
## Parameters

**String**

Type: [String](../Concepts.md#strings)

Any string value or variable. Numbers are not supported.

**OmitChars**

Type: [String](../Concepts.md#strings)

If omitted, spaces and tabs will be removed. Otherwise, specify a list of characters (case-sensitive) to exclude from the beginning and/or end of *String*.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

These functions return the trimmed version of the specified string.

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Trims all spaces from the left and right side of a string.

```ahk
text := "  text  "
MsgBox
(
    "No trim:`t'" text "'
    Trim:`t'" Trim(text) "'
    LTrim:`t'" LTrim(text) "'
    RTrim:`t'" RTrim(text) "'"
)
```

<a id="ExTrimZeros"></a>

**Example:** Trims all zeros from the left side of a string.

```ahk
MsgBox LTrim("00000123", "0")
```
