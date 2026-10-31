# HasProp

Returns a non-zero number if the specified value has a property by the specified name.

```ahk
HasProp := HasProp(Value, Name)
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [Any](../Concepts.md#values)

Any value, of any type except ComObject.

**Name**

Type: [String](../Concepts.md#strings)

The property name to check for.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 1 (true) if the value has a property by this name, otherwise 0 (false).

<a id="Remarks"></a>
## Remarks

This function does not test for the presence of a \__Get or \__Set [meta-function](../Objects.md#Meta_Functions). If present, there is no way to detect the exact set of properties that it may implement.

This function supports [primitive values](../Objects.md#primitive).

<a id="Related"></a>
## Related

[Objects](../Objects.md), [HasBase](HasBase.md), [HasMethod](HasMethod.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Illustrates the use of this function.

```ahk
MsgBox HasProp({}, "x") ; 0
MsgBox HasProp({x:1}, "x") ; 1
MsgBox HasProp(0, "Base") ; 1
```
