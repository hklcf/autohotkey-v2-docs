# IsObject

Returns a non-zero number if the specified value is an object.

```ahk
Boolean := IsObject(Value)
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [Any](../Concepts.md#values)

The value to check.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 1 (true) if *Value* is an object, otherwise 0 (false).

<a id="Remarks"></a>
## Remarks

Any value which is not a primitive value (number or string) is considered to be an object, including those which do not derive from [Object](Object.md), such as COM wrapper objects. This distinction is made because objects share several common traits in contrast to primitive values:

- Each object is dynamically allocated and [reference-counted](../Objects.md#Reference_Counting). Any number of variables, properties or array elements may refer to the same object. For immutable values this distinction isn't important, but objects can have mutable properties.
- Each object has a [unique address](../Objects.md#ObjPtr) which is also an interface pointer compatible with [IDispatch](https://learn.microsoft.com/windows/win32/api/oaidl/nn-oaidl-idispatch).
- An object compares equal to another value only if it is the same object.
- An object cannot be implicitly converted to a string or number.

<a id="Related"></a>
## Related

[Objects](../Objects.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reports "This is an object." because the value is an object.

```ahk
obj := {key: "value"}

if IsObject(obj)
    MsgBox "This is an object."
else
    MsgBox "This is not an object."
```
