# Type

Returns the class name of a value.

```ahk
ClassName := Type(Value)
```

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the class name of *Value*.

The algorithm for determining a value's class name can be approximated as shown below:

```ahk
TypeOf(Value)
{
    if (comClass := ComObjType(Value, "Class")) != ""
        return comClass
    try ; `Value is Object` is not checked because it can be false for prototypes.
        if ObjHasOwnProp(Value, "__Class")
            return "Prototype"
    while Value := ObjGetBase(Value)
        if ObjHasOwnProp(Value, "__Class")
            return Value.__Class
    return "Object"
}
```

For COM wrapper objects, the class name can also be determined based on the [variant type](ComObjType.md#vt), as follows:

```ahk
ComObject_Type(obj)
{
    if ComObjType(obj) & 0x2000 ; VT_ARRAY
        return "ComObjArray" ; ComObjArray.Prototype.__Class
    if ComObjType(obj) & 0x4000 ; VT_BYREF
        return "ComValueRef" ; ComValueRef.Prototype.__Class
    if (ComObjType(obj) = 9 || ComObjType(obj) = 13) ; VT_DISPATCH || VT_UNKNOWN
        && ComObjValue(obj) != 0
    {
        if (comClass := ComObjType(obj, "Class")) != ""
            return comClass
        if ComObjType(obj) = 9 ; VT_DISPATCH
            return "ComObject" ; ComObject.Prototype.__Class
    }
    return "ComValue" ; ComValue.Prototype.__Class
}
```

<a id="Remarks"></a>
## Remarks

This function typically shouldn't be used to determine if a value is numeric, since numeric *strings* are valid in math expressions and with most built-in functions. However, in some cases the exact type of a value is more important. In such cases, consider using `Value is Number` or similar instead of Type.

To check if a value can be used as a number, use the [IsNumber](Is.md#number), [IsInteger](Is.md#integer) or [IsFloat](Is.md#float) function.

To check for any type of object (that is, anything which is not a primitive value), use the [IsObject](IsObject.md) function.

To check if a value is an instance of a specific class, use the [`is`](../Variables.md#is_in_contains) operator. This can be used even with primitive values or to identify [COM wrapper objects](ComValue.md).

<a id="Related"></a>
## Related

[Values](../Concepts.md#values), [Expressions](../Language.md#expressions), [Is functions](Is.md), [Integer](Integer.md), [Float](Float.md), [String](String.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves and reports the exact type of the values stored in *a*, *b* and *c*.

```ahk
a := 1, b := 2.0, c := "3"
MsgBox Type(a)  ; Integer
MsgBox Type(b)  ; Float
MsgBox Type(c)  ; String
```
