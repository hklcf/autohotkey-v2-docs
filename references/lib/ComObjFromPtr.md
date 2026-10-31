# ComObjFromPtr

Wraps a raw [IDispatch](https://learn.microsoft.com/windows/win32/api/oaidl/nn-oaidl-idispatch) pointer (COM object) for use by the script.

```ahk
ComObj := ComObjFromPtr(DispPtr)
```

<a id="Parameters"></a>
## Parameters

**DispPtr**

Type: [Integer](../Concepts.md#numbers)

A non-null interface pointer for IDispatch or a derived interface.

<a id="Returns"></a>
## Return Value

Type: [ComObject](ComObject.md)

Returns a wrapper object containing the [variant type](ComObjType.md#vt) VT_DISPATCH and the given pointer.

Wrapping a COM object enables the script to interact with it more naturally, using [object syntax](../Objects.md#Usage_Objects). However, the majority of scripts do not need to do this manually since a wrapper object is created automatically by [ComObject](ComObject.md), [ComObjActive](ComObjActive.md), [ComObjGet](ComObjGet.md) and any COM method which returns an object.

<a id="Remarks"></a>
## Remarks

The wrapper object assumes responsibility for automatically releasing the pointer when appropriate. This function [queries](ComObjQuery.md) the object for its IDispatch interface; if one is returned, *DispPtr* is immediately released. Therefore, if the script intends to use the pointer after calling this function, it must call `ObjAddRef(DispPtr)` first.

**Known limitation:** Each time a COM object is wrapped, a new wrapper object is created. Comparisons and assignments such as `obj1 == obj2` and `arr[obj1] := value` treat the two wrapper objects as unique, even when they contain the same COM object.

<a id="Related"></a>
## Related

[ComObject](ComObject.md), [ComValue](ComValue.md), [ComObjGet](ComObjGet.md), [ComObjConnect](ComObjConnect.md), [ComObjFlags](ComObjFlags.md), [ObjAddRef/ObjRelease](ObjAddRef.md), [ComObjQuery](ComObjQuery.md), [GetActiveObject (Microsoft Docs)](https://learn.microsoft.com/windows/win32/api/oleauto/nf-oleauto-getactiveobject)
