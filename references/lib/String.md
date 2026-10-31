# String

Converts a value to a string.

```ahk
StrValue := String(Value)
```

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the result of converting *Value* to a string, or *Value* itself if it is a string.

If *Value* is a number, the [default decimal formatting](../Concepts.md#number-default-format) is used.

If *Value* is an object, the return value is the result of calling `Value.ToString()`. If the object has no such method, a [MethodError](Error.md#MethodError) is thrown. This method is not implemented by default, so must be defined by the script.

<a id="Related"></a>
## Related

[Type](Type.md), [Integer](Integer.md), [Float](Float.md), [Values](../Concepts.md#values), [Expressions](../Language.md#expressions), [Is functions](Is.md)
