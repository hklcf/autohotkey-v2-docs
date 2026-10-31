# ComObjValue

Retrieves the value or pointer stored in a COM wrapper object.

```ahk
Value := ComObjValue(ComObj)
```

<a id="Parameters"></a>
## Parameters

**ComObj**

Type: [Object](../Concepts.md#objects)

A wrapper object containing a COM object or typed value. See [ComValue](ComValue.md) for details.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns a 64-bit signed integer.

<a id="Error_Handling"></a>
## Error Handling

A [TypeError](Error.md#TypeError) is thrown if *ComObj* is not a COM wrapper object.

<a id="Remarks"></a>
## Remarks

This function is not intended for general use.

Calling ComObjValue is equivalent to `variant.llVal`, where *ComObj* is treated as a [VARIANT structure](https://learn.microsoft.com/windows/win32/api/oaidl/ns-oaidl-variant). Any script which uses this function must be aware what [type of value](ComObjType.md) the wrapper object contains and how it should be treated. For instance, if an interface pointer is returned, [Release](ObjAddRef.md) should not be called, but [AddRef](ObjAddRef.md) may be required depending on what the script does with the pointer.

<a id="Related"></a>
## Related

[ComObjType](ComObjType.md), [ComObject](ComObject.md), [ComObjGet](ComObjGet.md), [ComObjActive](ComObjActive.md)
