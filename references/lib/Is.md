# Is Functions

Functions for checking the type and other conditions of a given value.

```ahk
Result := IsSomething(Value , Mode)
```

There are three categories:

- [Type](#cat-type): Check the type of a value, or whether a string can be interpreted as a value of that type.
- [Misc](#cat-misc): Check miscellaneous conditions based on a given value or variable reference.
- [String](#cat-string): Check whether a string matches a specific pattern.

*Mode* is valid only for IsAlpha, IsAlnum, IsUpper and IsLower. By default, only ASCII letters are considered. To instead perform the check according to the rules of the current user's locale, specify the string `"Locale"` for the *Mode* parameter. The default mode can also be used by specifying 0 or 1.

<a id="cat-type"></a>
## Type

Check the type of a value, or whether a string can be interpreted as a value of that type.

| Function | Description |
| --- | --- |
| <a id="integer"></a>IsInteger | True if *Value* is an integer or a purely numeric string (decimal or hexadecimal) without a decimal point. Leading and trailing spaces and tabs are allowed. The string may start with a plus or minus sign and must not be empty. |
| <a id="float"></a>IsFloat | True if *Value* is a floating point number or a purely numeric string containing a decimal point. Leading and trailing spaces and tabs are allowed. The string may start with a plus sign, minus sign, or decimal point and must not be empty. |
| <a id="number"></a>IsNumber | True if `IsInteger(Value) or IsFloat(Value)` is true. |
| <a id="object"></a>[IsObject](IsObject.md) | True if *Value* is an [object](../Objects.md). This includes objects derived from [Object](Object.md), prototype objects such as `0.base`, and COM objects, but not numbers or strings. |

<a id="cat-misc"></a>
## Misc

Check miscellaneous conditions based on a given value or variable reference.

| Function | Description |
| --- | --- |
| <a id="label"></a>[IsLabel](IsLabel.md) | True if *Value* is the name of a [label](../misc/Labels.md) defined within the current scope. |
| <a id="set"></a>[IsSet](IsSet.md) | True if the variable *Value* has been assigned a value. |
| <a id="setref"></a>[IsSetRef](IsSet.md) | True if the [VarRef](../Concepts.md#variable-references) contained by *Value* has been assigned a value. |

<a id="cat-string"></a>
## String

Check whether a string matches a specific pattern. *Value* must be a string, otherwise a [TypeError](Error.md#TypeError) is thrown.

| Function | Description |
| --- | --- |
| <a id="digit"></a>IsDigit | True if *Value* is a positive integer, an empty string, or a string which contains only the characters 0 through 9. Other characters such as the following are not allowed: spaces, tabs, plus signs, minus signs, decimal points, hexadecimal digits, and the 0x prefix. |
| <a id="xdigit"></a>IsXDigit | Hexadecimal digit: Same as [IsDigit](#digit) except the characters A through F (uppercase or lowercase) are also allowed. A prefix of 0x is tolerated if present. |
| <a id="alpha"></a>IsAlpha | True if *Value* is a string and is empty or contains only alphabetic characters. False if there are any digits, spaces, tabs, punctuation, or other non-alphabetic characters anywhere in the string. For example, if *Value* contains a space followed by a letter, it is *not* considered to be *alpha*.<br> By default, only ASCII letters are considered. To instead perform the check according to the rules of the current user's locale, use `IsAlpha(Value, "Locale")`. |
| <a id="upper"></a>IsUpper | True if *Value* is a string and is empty or contains only uppercase characters. False if there are any digits, spaces, tabs, punctuation, or other non-uppercase characters anywhere in the string.<br> By default, only ASCII letters are considered. To instead perform the check according to the rules of the current user's locale, use `IsUpper(Value, "Locale")`. |
| <a id="lower"></a>IsLower | True if *Value* is a string and is empty or contains only lowercase characters. False if there are any digits, spaces, tabs, punctuation, or other non-lowercase characters anywhere in the string.<br> By default, only ASCII letters are considered. To instead perform the check according to the rules of the current user's locale, use `IsLower(Value, "Locale")`. |
| <a id="alnum"></a>IsAlnum | Same as [IsAlpha](#alpha) except that integers and characters 0 through 9 are also allowed. |
| <a id="space"></a>IsSpace | True if *Value* is a string and is empty or contains only whitespace consisting of the following characters: space ([A_Space](../Variables.md) or \`s), tab ([A_Tab](../Variables.md) or \`t), linefeed (\`n), return (\`r), vertical tab (\`v), and formfeed (\`f). |
| <a id="time"></a>IsTime | True if *Value* is a valid date-time stamp, which can be all or just the leading part of the [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format. For example, a 4-digit string such as 2004 is considered valid. Use [StrLen](StrLen.md) to determine whether additional time components are present.<br> *Value* must have an even number of digits between 4 and 14 (inclusive) to be considered valid.<br> Years less than 1601 are not considered valid because the operating system generally does not support them. The maximum year considered valid is 9999. |

<a id="Remarks"></a>
## Remarks

Since literal numbers such as `128`, `0x7F` and `1.0` are converted to pure numbers before the script begins executing, the format of the literal number is lost. To avoid confusion, the string functions listed above throw an exception if they are given a pure number.

<a id="Related"></a>
## Related

[A_YYYY](../Variables.md#YYYY), [FileGetTime](FileGetTime.md), [If](If.md), [StrLen](StrLen.md), [InStr](InStr.md), [StrUpper](StrLower.md), [DateAdd](DateAdd.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Checks whether *var* is a floating point number or an integer and checks whether it is a valid timestamp.

```ahk
if isFloat(var)
    MsgBox var " is a floating point number."
else if isInteger(var)
    MsgBox var " is an integer."
if isTime(var)
    MsgBox var " is also a valid date-time."
```
