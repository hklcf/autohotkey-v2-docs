# Number

Converts a numeric string to a pure integer or floating-point number.

```ahk
NumValue := Number(Value)
```

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

This function returns the result of converting *Value* to a pure integer or floating-point number, or *Value* itself if it is already an Integer or Float value.

<a id="Remarks"></a>
## Remarks

If the value cannot be converted, a [TypeError](Error.md#TypeError) is thrown.

To determine if a value can be converted to a number, use the [IsNumber](Is.md#number) function.

Number is actually a class, but can be called as a function. `Value is Number` can be used to check whether a value is a pure number.

<a id="Related"></a>
## Related

[Type](Type.md), [Float](Float.md), [Integer](Integer.md), [String](String.md), [Values](../Concepts.md#values), [Expressions](../Language.md#expressions), [Is functions](Is.md)
