# StrLower / StrUpper / StrTitle

Converts a string to lowercase, uppercase or title case.

```ahk
NewString := StrLower(String)
NewString := StrUpper(String)
NewString := StrTitle(String)
```

<a id="Parameters"></a>
## Parameters

**String**

Type: [String](../Concepts.md#strings)

The string to convert.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

These functions return the newly converted version of the specified string.

<a id="Remarks"></a>
## Remarks

To detect whether a character or string is entirely uppercase or lowercase, use the [IsUpper](Is.md#upper), [IsLower](Is.md#lower) or [RegExMatch](RegExMatch.md) function. For example:

```ahk
var := "abc"
if isUpper(var)
    MsgBox "var is empty or contains only uppercase characters."
if isLower(var)
    MsgBox "var is empty or contains only lowercase characters."
if RegExMatch(var, "^[a-z]+$")
    MsgBox "var is not empty and contains only lowercase ASCII characters."
if !RegExMatch(var, "[A-Z]")
    MsgBox "var does not contain any uppercase ASCII characters."
```

[Format](Format.md) can also be used for case conversions, as shown below:

```ahk
MsgBox Format("{:U}, {:L} and {:T}", "upper", "LOWER", "title")
```

<a id="Related"></a>
## Related

[InStr](InStr.md), [SubStr](SubStr.md), [StrLen](StrLen.md), [StrReplace](StrReplace.md)

<a id="Examples"></a>
## Examples

<a id="ExLower"></a>

**Example:** Converts the string to lowercase and stores "this is a test." in *String1*.

```ahk
String1 := "This is a test."
String1 := StrLower(String1)  ; i.e. output can be the same as input.
```

<a id="ExUpper"></a>

**Example:** Converts the string to uppercase and stores "THIS IS A TEST." in *String2*.

```ahk
String2 := "This is a test."
String2 := StrUpper(String2)
```

<a id="ExTitle"></a>

**Example:** Converts the string to title case and stores "This Is A Test." in *String3*.

```ahk
String3 := "This is a test."
String3 := StrTitle(String3)
```
