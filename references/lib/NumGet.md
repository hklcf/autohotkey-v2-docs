# NumGet

Returns the binary number stored at the specified address+offset.

```ahk
Number := NumGet(Source, Offset, Type)
Number := NumGet(Source, Type)
```

<a id="Parameters"></a>
## Parameters

**Source**

Type: [Object](../Concepts.md#objects) or [Integer](../Concepts.md#numbers)

A [Buffer](Buffer.md)-like object or memory address.

Any object which implements [Ptr](Buffer.md#Ptr) and [Size](Buffer.md#Size) properties may be used, but this function is optimized for the native [Buffer](Buffer.md) object. Passing an object with these properties ensures that the function does not read memory from an invalid location; doing so could cause crashes or other unpredictable behavior.

**Offset**

Type: [Integer](../Concepts.md#numbers)

If blank or omitted (or when using 2-parameter mode), it defaults to 0. Otherwise, specify an offset in bytes which is added to *Source* to determine the source address.

**Type**

Type: [String](../Concepts.md#strings)

One of the following strings: UInt, Int, Int64, Short, UShort, Char, UChar, Double, Float, Ptr or UPtr

*Unsigned* 64-bit integers are not supported, as AutoHotkey's native integer type is Int64. Therefore, to work with numbers greater than or equal to 0x8000000000000000, omit the U prefix and interpret any negative values as large integers. For example, a value of -1 as an Int64 is really 0xFFFFFFFFFFFFFFFF if it is intended to be a UInt64. On 64-bit builds, UPtr is equivalent to Int64.

For details see [DllCall Types](DllCall.md#types).

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

This function returns the binary number at the specified address+offset.

<a id="General_Remarks"></a>
## General Remarks

If only two parameters are present, the second parameter must be *Type*. For example, `NumGet(var, "int")` is valid.

An exception may be thrown if the source address is invalid. However, some invalid addresses cannot be detected as such and may cause unpredictable behavior. Passing a [Buffer](Buffer.md) object instead of an address ensures that the source address can always be validated.

<a id="Related"></a>
## Related

[NumPut](NumPut.md), [DllCall](DllCall.md), [Buffer object](Buffer.md), [VarSetStrCapacity](VarSetStrCapacity.md)
