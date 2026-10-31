# NumPut

Stores one or more numbers in binary format at the specified address+offset.

```ahk
NumPut Type, Number, Type2, Number2, ... Target , Offset
```

<a id="Parameters"></a>
## Parameters

**Type**

Type: [String](../Concepts.md#strings)

One of the following strings: UInt, UInt64, Int, Int64, Short, UShort, Char, UChar, Double, Float, Ptr or UPtr

For all integer types, or when passing pure integers, signed vs. unsigned does not affect the result due to the use of two's complement to represent signed integers.

For details see [DllCall Types](DllCall.md#types).

**Number**

Type: [Integer](../Concepts.md#numbers)

The number to store.

**Target**

Type: [Object](../Concepts.md#objects) or [Integer](../Concepts.md#numbers)

A [Buffer](Buffer.md)-like object or memory address.

Any object which implements [Ptr](Buffer.md#Ptr) and [Size](Buffer.md#Size) properties may be used, but this function is optimized for the native [Buffer](Buffer.md) object. Passing an object with these properties ensures that the function does not write to an invalid memory location; doing so could cause crashes or other unpredictable behavior.

**Offset**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 0. Otherwise, specify an offset in bytes which is added to *Target* to determine the target address.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the address to the right of the last item written. This can be used when writing a non-contiguous sequence of numbers, such as in a structure for use with [DllCall](DllCall.md), where some fields are not being set. However, in many cases it is simpler and more efficient to specify multiple *Type*, *Number* pairs instead. Passing the address back to NumPut is less safe than passing a Buffer-like object with an updated *Offset*.

<a id="General_Remarks"></a>
## General Remarks

A sequence of numbers can be written by repeating *Type* and *Number* any number of times after the first *Number*. Each number is written at the next byte after the previous number, with no padding. When creating a structure for use with [DllCall](DllCall.md), be aware that some fields may need explicit padding added due to data alignment requirements.

If an integer is too large to fit in the specified *Type*, its most significant bytes are ignored; e.g. `NumPut("Char", 257, buf)` would store the number 1.

An exception may be thrown if the target address is invalid. However, some invalid addresses cannot be detected as such and may cause unpredictable behavior. Passing a [Buffer](Buffer.md) object instead of an address ensures that the target address can always be validated.

<a id="Related"></a>
## Related

[NumGet](NumGet.md), [DllCall](DllCall.md), [Buffer object](Buffer.md), [VarSetStrCapacity](VarSetStrCapacity.md)
