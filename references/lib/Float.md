# Float

Converts a numeric string or integer value to a floating-point number.

```ahk
FltValue := Float(Value)
```

<a id="Return_Value"></a>
## Return Value

Type: [Float](../Concepts.md#numbers)

This function returns the result of converting *Value* to a pure floating-point number (having the [type name](Type.md) "Float"), or *Value* itself if it is already the correct type.

<a id="Remarks"></a>
## Remarks

If the value cannot be converted, a [TypeError](Error.md#TypeError) is thrown.

To determine if a value can be converted to a floating-point number, use the [IsNumber](Is.md#number) function.

Float is actually a class, but can be called as a function. `Value is Float` can be used to check whether a value is a pure floating-point number.

<a id="Related"></a>
## Related

[Type](Type.md), [Integer](Integer.md), [Number](Number.md), [String](String.md), [Values](../Concepts.md#values), [Expressions](../Language.md#expressions), [Is functions](Is.md)
