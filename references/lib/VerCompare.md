# VerCompare

Compares two version strings.

```ahk
Result := VerCompare(VersionA, VersionB)
```

<a id="Parameters"></a>
## Parameters

**VersionA**

Type: [String](../Concepts.md#strings)

The first version string to be compared.

**VersionB**

Type: [String](../Concepts.md#strings)

The second version string to be compared, optionally prefixed with one of the following operators: `<`, `<=`, `>`, `>=` or `=`.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean) or [Integer](../Concepts.md#numbers)

If *VersionB* begins with an operator symbol, this function returns 1 (true) or 0 (false).

Otherwise, this function returns one of the following to indicate the relationship between *VersionA* and *VersionB*:

- 0 if *VersionA* is equal to *VersionB*
- a positive integer if *VersionA* is greater than *VersionB*
- a negative integer if *VersionA* is less than *VersionB*

To check for a specific relationship between the two strings, compare the result to 0. For example:

```ahk
a_less_than_b := VerCompare(a, b) < 0
a_greater_than_or_equal_to_b := VerCompare(a, b) >= 0
```

<a id="Remarks"></a>
## Remarks

Version strings are compared according to the same rules as [#Requires](_Requires.md#compare).

This function should correctly compare [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) version strings, but the parameters are not required to be valid SemVer strings.

This function can be used in a [sort callback](Sort.md#callback).

**Known limitation:** Any numeric component greater than 2147483647 (2^31-1) is considered equal to 2147483647.

<a id="Related"></a>
## Related

[#Requires](_Requires.md), [Sort](Sort.md), [StrCompare](StrCompare.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Checks the version of AutoHotkey in use.

```ahk
if VerCompare(A_AhkVersion, "2.0") < 0
    MsgBox "This version < 2.0; possibly a pre-release version."
else
    MsgBox "This version is 2.0 or later."
```

<a id="ExStr"></a>

**Example:** Shows one difference between VerCompare and StrCompare.

```ahk
MsgBox VerCompare("1.20.0", "1.3")  ; Returns 1
MsgBox StrCompare("1.20.0", "1.3")  ; Returns -1
```

<a id="ExPre"></a>

**Example:** Demonstrates comparison with pre-release versions.

```ahk
MsgBox VerCompare("2.0-a137", "2.0-a136")  ; Returns 1
MsgBox VerCompare("2.0-a137", "2.0")  ; Returns -1
MsgBox VerCompare("10.2-beta.3", "10.2.0")  ; Returns -1
```

<a id="ExPreRange"></a>

**Example:** Demonstrates a range check.

```ahk
MsgBox VerCompare("2.0.1", ">=2.0") && VerCompare("2.0.1", "<2.1")  ; Returns 1
```
