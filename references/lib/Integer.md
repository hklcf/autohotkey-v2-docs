# Integer

Converts a numeric string or floating-point value to an integer.

```ahk
IntValue := Integer(Value)
```

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the result of converting *Value* to a pure integer (having the [type name](Type.md) "Integer"), or *Value* itself if it is already the correct type.

<a id="Remarks"></a>
## Remarks

Any fractional part of *Value* is dropped, equivalent to `Value < 0 ? Ceil(Value) : Floor(Value)`.

If the value cannot be converted, a [TypeError](Error.md#TypeError) is thrown.

To determine if a value can be converted to an integer, use the [IsNumber](Is.md#number) function.

Integer is actually a class, but can be called as a function. `Value is Integer` can be used to check whether a value is a pure integer.

<a id="Related"></a>
## Related

[Type](Type.md), [Float](Float.md), [Number](Number.md), [String](String.md), [Values](../Concepts.md#values), [Expressions](../Language.md#expressions), [Is functions](Is.md)
