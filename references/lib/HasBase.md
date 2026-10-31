# HasBase

Returns a non-zero number if the specified value is derived from the specified base object.

```ahk
HasBase := HasBase(Value, BaseObj)
```

<a id="Parameters"></a>
## Parameters

**Value**

Any value, of any type.

**BaseObj**

Type: [Object](../Concepts.md#objects)

The potential base object to test.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 1 (true) if *BaseObj* is in *Value*'s chain of base objects, otherwise 0 (false).

<a id="Remarks"></a>
## Remarks

The following code is roughly equivalent to this function:

```ahk
MyHasBase(Value, BaseObj) {
    b := Value
    while b := ObjGetBase(b)
        if b = BaseObj
            return true
    return false
}
```

For example, `HasBase(Obj, Array.Prototype)` is true if *Obj* is an instance of [Array](Array.md) or any derived class. This the same check performed by `Obj is Array`; however, instances can be based on other instances, whereas `is` requires a [Class](Class.md).

HasBase accepts both objects and [primitive values](../Objects.md#primitive). For example, `HasBase(1, 0.base)` returns true.

<a id="Related"></a>
## Related

[Objects](../Objects.md), [Obj.Base](Object.md#Base), [ObjGetBase](Any.md#GetBase), [HasMethod](HasMethod.md), [HasProp](HasProp.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Illustrates the use of this function.

```ahk
thebase := {key: "value"}
derived := {base: thebase}
MsgBox HasBase(thebase, derived) ; 0
MsgBox HasBase(derived, thebase) ; 1
```
