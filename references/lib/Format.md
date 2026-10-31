# Format

Formats a variable number of input values according to a format string.

```ahk
String := Format(FormatStr , Values...)
```

<a id="Parameters"></a>
## Parameters

**FormatStr**

Type: [String](../Concepts.md#strings)

A format string composed of literal text and placeholders of the form `{Index:Format}`.

*Index* is an integer indicating which input value to use, where 1 is the first value.

*Format* is an optional format specifier, as described below.

Omit the index to use the next input value in the sequence (even if it has been used earlier in the string). For example, `"{2:i} {:i}"` formats the second and third input values as decimal integers, separated by a space. If *Index* is omitted, *Format* must still be preceded by `:`. Specify empty braces to use the next input value with default formatting: `{}`

Use `{{}` and `{}}` to include literal braces in the string. Any other invalid placeholders are included in the result as is.

Whitespace inside the braces is not permitted (except as a flag).

**Values**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

Input values to be formatted and inserted into the final string. Each value is a separate parameter. The first value has an index of 1.

To pass an array of values, use a [variadic function call](../Functions.md#VariadicCall):

```ahk
arr := [13, 240]
MsgBox Format("{2:x}{1:02x}", arr*)
```

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the formatted version of the specified string.

<a id="FormatSpec"></a>
## Format Specifiers

Each format specifier can include the following components, in this order (without the spaces):

```ahk
Flags Width .Precision ULT Type
```

**Flags:** Zero or more flags from the [flag table](#Flags) below to affect output justification and prefixes.

**Width:** A decimal integer which controls the minimum width of the formatted value, in characters. By default, values are right-aligned and spaces are used for padding. This can be overridden by using the `-` (left-align) and `0` (zero prefix) flags.

**.Precision:** A decimal integer which controls the maximum number of string characters, decimal places, or significant digits to output, depending on the output type. It must be preceded by a decimal point. Specifying a precision may cause the value to be truncated or rounded. Output types and how each is affected by the precision value are as follows (see table below for an explanation of the different output types):

- `f`, `e`, `E`: *Precision* specifies the number of digits after the decimal point. The default is 6.
- `g`, `G`: *Precision* specifies the maximum number of significant digits. The default is 6.
- `s`: *Precision* specifies the maximum number of characters to be printed. Characters in excess of this are not printed.
- For the integer types (`d`, `i`, `u`, `x`, `X`, `o`), *Precision* acts like *Width* with the `0` prefix and a default of 1.

<a id="ULT"></a>

**ULT:** Specifies a case transformation to apply to a string value -- **U**pper, **L**ower or **T**itle. Valid only with the `s` type. For example `{:U}` or `{:.20Ts}`. Lower-case `l` and `t` are also supported, but `u` is reserved for unsigned integers.

**Type:** A character from the [type table](#Types) below indicating how the input value should be interpreted. If omitted, it defaults to `s`.

<a id="Flags"></a>
## Flags

| Flag | Meaning |
| --- | --- |
| `-` | Left align the result within the given field width (insert spaces to the right if needed). For example, `Format("{:-10}", 1)` returns `1`.<br> If omitted, the result is right aligned within the given field width. |
| `+` | Use a sign (+ or -) to prefix the output value if it is of a signed type. For example, `Format("{:+d}", 1)` returns `+1`.<br> If omitted, a sign appears only for negative signed values (-). |
| `0` | If *width* is prefixed by 0, leading zeros are added until the minimum width is reached. For example, `Format("{:010}", 1)` returns `0000000001`. If both `0` and `-` appear, the 0 is ignored. If 0 is specified as an integer format (i, u, x, X, o, d) and a precision specification is also present - for example, `{:04.d}` - the 0 is ignored.<br> If omitted, no padding occurs. |
|  | Use a space to prefix the output value with a *single* space if it is signed and positive. The space is ignored if both and `+` flags appear. For example, `Format("{: 05d}", 1)` returns `0001`.<br> If omitted, no space appears. |
| `#` | When it's used with the o, x, or X format, the # flag uses `0`, `0x`, or `0X`, respectively, to prefix any nonzero output value. For example, `Format("{:#x}", 1)` returns `0x1`.<br> When it's used with the e, E, f, a or A format, the # flag forces the output value to contain a decimal point. For example, `Format("{:#.0f}", 1)` returns `1.`.<br> When it's used with the g or G format, the # flag forces the output value to contain a decimal point and prevents the truncation of trailing zeros.<br> Ignored when used with c, d, i, u, or s. |

<a id="Types"></a>
## Types

| Type Character | Argument | Output format |
| --- | --- | --- |
| `d` or `i` | Integer | Signed decimal integer. For example, `Format("{:d}", 1.23)` returns `1`. |
| `u` | Integer | Unsigned decimal integer. |
| `x` or `X` | Integer | Unsigned hexadecimal integer; uses "abcdef" or "ABCDEF" depending on the case of `x`. The `0x` prefix is not included unless the `#` flag is used, as in `{:#x}`. To always include the prefix, use `0x{:x}` or similar. For example, `Format("{:X}", 255)` returns `FF`. |
| `o` | Integer | Unsigned octal integer. For example, `Format("{:o}", 255)` returns `377`. |
| `f` | Floating-point | Signed value that has the form [ - ]*dddd*.*dddd*, where *dddd* is one or more decimal digits. The number of digits before the decimal point depends on the magnitude of the number, and the number of digits after the decimal point depends on the requested precision. For example, `Format("{:.2f}", 1)` returns `1.00`. |
| `e` | Floating-point | Signed value that has the form [ - ]*d.dddd* e [*sign*]*dd[d]* where *d* is one decimal digit, *dddd* is one or more decimal digits, *dd[d]* is two or three decimal digits depending on the output format and size of the exponent, and *sign* is + or -. For example, `Format("{:e}", 255)` returns `2.550000e+02`. |
| `E` | Floating-point | Identical to the `e` format except that E rather than e introduces the exponent. |
| `g` | Floating-point | Signed values are displayed in `f` or `e` format, whichever is more compact for the given value and precision. The `e` format is used only when the exponent of the value is less than -4 or greater than or equal to the *precision* argument. Trailing zeros are truncated, and the decimal point appears only if one or more digits follow it. |
| `G` | Floating-point | Identical to the `g` format, except that E, rather than e, introduces the exponent (where appropriate). |
| `a` | Floating-point | Signed hexadecimal double-precision floating-point value that has the form [?]0x*h.hhhh* **p**±*dd*, where *h.hhhh* are the hex digits (using lower case letters) of the mantissa, and *dd* are one or more digits for the exponent. The precision specifies the number of digits after the point. For example, `Format("{:a}", 255)` returns `0x1.fe00000000000p+7`. |
| `A` | Floating-point | Identical to the `a` format, except that P, rather than p, introduces the exponent. |
| `p` | Integer | Displays the argument as a memory address in hexadecimal digits. For example, `Format("{:p}", 255)` returns `00000000000000FF`. |
| `s` | String | Specifies a string. If the input value is numeric, it is automatically converted to a string before the *Width* and *Precision* arguments are applied. |
| `c` | Character code | Specifies a single character by its ordinal value, similar to `Chr(n)`. If the input value is outside the expected range, it wraps around. For example, `Format("{:c}", 116)` returns `t`. |

<a id="Remarks"></a>
## Remarks

Unlike [printf](https://learn.microsoft.com/cpp/c-runtime-library/format-specification-syntax-printf-and-wprintf-functions), size specifiers are not supported. All integers and floating-point input values are 64-bit.

<a id="Related"></a>
## Related

[FormatTime](FormatTime.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Demonstrates different usages.

```ahk
s := ""
; Simple substitution
s .= Format("{2}, {1}!`r`n", "World", "Hello")
; Padding with spaces
s .= Format("|{:-10}|`r`n|{:10}|`r`n", "Left", "Right")
; Hexadecimal
s .= Format("{1:#x} {2:X} 0x{3:x}`r`n", 3735928559, 195948557, 0)
; Floating-point
s .= Format("{1:0.3f} {1:.10f}", 4*ATan(1))

ListVars  ; Use AutoHotkey's main window to display monospaced text.
WinWaitActive "ahk_class AutoHotkey"
ControlSetText(s, "Edit1")
WinWaitClose
```
