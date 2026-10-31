# ComValue

Wraps a value, SafeArray or COM object for use by the script or for passing to a COM method.

```ahk
ComObj := ComValue(VarType, Value , Flags)
```

`ComValue` itself is a [class](Class.md) derived from `Any`, but is used only to create or identify COM wrapper objects.

<a id="Parameters"></a>
## Parameters

**VarType**

Type: [Integer](../Concepts.md#numbers)

An integer indicating the type of value. See [ComObjType](ComObjType.md#vt) for a list of types.

**Value**

Type: [Any](../Concepts.md#values)

The value to wrap.

If this is a pure integer and *VarType* is not VT_R4, VT_R8, VT_DATE or VT_CY, its value is used directly; in particular, VT_BSTR, VT_DISPATCH and VT_UNKNOWN can be initialized with a pointer value.

In any other case, the value is copied into a temporary VARIANT using the same rules as normal COM methods calls. If the source variant type is not equal to *VarType*, conversion is attempted by calling [VariantChangeType](https://learn.microsoft.com/windows/win32/api/oleauto/nf-oleauto-variantchangetype) with a *wFlags* value of 0. An exception is thrown if conversion fails.

**Flags**

Type: [Integer](../Concepts.md#numbers)

Flags affecting the behavior of the wrapper object; see [ComObjFlags](ComObjFlags.md) for details.

<a id="Returns"></a>
## Return Value

Type: [Object](../Concepts.md#objects)

This function returns a wrapper object containing a [variant type](ComObjType.md#vt) and value or pointer, specifically ComValue, ComValueRef, [ComObjArray](ComObjArray.md) or [ComObject](ComObject.md).

This object has multiple uses:

1. Some COM methods may require specific types of values which have no direct equivalent within AutoHotkey. This function allows the type of a value to be specified when passing it to a COM method. For example, `ComValue(0xB, true)` creates an object which represents the COM boolean value *true*.
2. Wrapping a COM object or SafeArray enables the script to interact with it more naturally, using [object syntax](../Objects.md#Usage_Objects). However, the majority of scripts do not need to do this manually since a wrapper object is created automatically by [ComObject](ComObject.md), [ComObjArray](ComObjArray.md), [ComObjActive](ComObjActive.md), [ComObjGet](ComObjGet.md) and any COM method which returns an object.
3. Wrapping a COM interface pointer allows the script to take advantage of automatic reference counting. An interface pointer can be wrapped immediately upon being returned to the script (typically from [ComCall](ComCall.md) or [DllCall](DllCall.md)), avoiding the need to explicitly [release](ObjAddRef.md) it at some later point.

<a id="Ptr"></a>
## Ptr

If a wrapper object's [*VarType*](ComObjType.md#vt) is VT_UNKNOWN (13) or includes the VT_BYREF (0x4000) flag or VT_ARRAY (0x2000) flag, the `Ptr` property can be used to retrieve the address of the object, typed variable or SafeArray. This allows the ComObject itself to be passed to any [DllCall](DllCall.md) or [ComCall](ComCall.md) parameter which has the `"Ptr"` type, but can also be used explicitly. For example, `ComObj.Ptr` is equivalent to `ComObjValue(ComObj)` in these cases.

If a wrapper object's [*VarType*](ComObjType.md#vt) is VT_UNKNOWN (13) or VT_DISPATCH (9) and the wrapped pointer is null (0), the `Ptr` property can be used to retrieve the current null value or to assign a pointer to the wrapper object. Once assigned (if non-null), the pointer will be released automatically when the wrapper object is freed. This can be used with [DllCall](DllCall.md) or [ComCall](ComCall.md) output parameters of type `"Ptr*"` or `"PtrP"` to ensure the pointer will be released automatically, such as if an error occurs. For an example, see [ComObjQuery](ComObjQuery.md#ExIE).

When a wrapper object with *VarType* VT_DISPATCH (9) and a null (0) pointer value is assigned a non-null pointer value, its type changes from `ComValue` to `ComObject`. The properties and methods of the wrapped object become available and the `Ptr` property becomes unavailable.

<a id="ByRef"></a>
## ByRef

If a wrapper object's [*VarType*](ComObjType.md#vt) includes the VT_BYREF (0x4000) flag, empty brackets `[]` can be used to read or write the referenced value.

When creating a reference, *Value* must be the memory address of a variable or buffer with sufficient capacity to store a value of the given type. For example, the following can be used to create a variable which a VBScript function can write into:

```ahk
vbuf := Buffer(24, 0)
vref := ComValue(0x400C, vbuf.ptr)  ; 0x400C is a combination of VT_BYREF and VT_VARIANT.

vref[] := "in value"
sc.Run("Example", vref)  ; sc should be initialized as in the example below.
MsgBox vref[]
```

Note that although any previous value is freed when a new value is assigned by `vref[]` or the COM method, the final value is not freed automatically. Freeing the value requires knowing which type it is. Because it is VT_VARIANT in this case, it can be freed by calling [VariantClear](https://learn.microsoft.com/windows/win32/api/oleauto/nf-oleauto-variantclear) with [DllCall](DllCall.md) or by using a simpler method: assign an integer, such as `vref[] := 0`.

If the method accepts a combination of VT_BYREF and VT_VARIANT as shown above, a [VarRef](../Concepts.md#variable-references) can be used instead. For example:

```ahk
some_var := "in value"
sc.Run("Example", &some_var)
MsgBox some_var
```

However, some methods require a more specific variant type, such as `VT_BYREF | VT_I4`. In such cases, the first approach shown above must be used, replacing 0x400C with the appropriate variant type.

<a id="Remarks"></a>
## General Remarks

When this function is used to wrap an [IDispatch](https://learn.microsoft.com/windows/win32/winauto/idispatch-interface) or IUnknown interface pointer (passed as an integer), the wrapper object assumes responsibility for automatically releasing the pointer when appropriate. Therefore, if the script intends to use the pointer after calling this function, it must call `ObjAddRef(DispPtr)` first. By contrast, this is not necessary if *Value* is itself a ComValue or ComObject.

Conversion from VT_UNKNOWN to VT_DISPATCH results in a call to [IUnknown::QueryInterface](https://learn.microsoft.com/windows/win32/api/unknwn/nf-unknwn-iunknown-queryinterface(refiid_void)), which may produce an interface pointer different to the original, and will throw an exception if the object does not implement IDispatch. By contrast, if *Value* is an integer and *VarType* is VT_DISPATCH, the value is used directly, and therefore must be an IDispatch-compatible interface pointer.

The *VarType* of a wrapper object can be retrieved using [ComObjType](ComObjType.md).

The *Value* of a wrapper object can be retrieved using [ComObjValue](ComObjValue.md).

**Known limitation:** Each time a COM object is wrapped, a new wrapper object is created. Comparisons and assignments such as `obj1 == obj2` and `arr[obj1] := value` treat the two wrapper objects as unique, even when they contain the same variant type and value.

<a id="Related"></a>
## Related

[ComObjFromPtr](ComObjFromPtr.md), [ComObject](ComObject.md), [ComObjGet](ComObjGet.md), [ComObjConnect](ComObjConnect.md), [ComObjFlags](ComObjFlags.md), [ObjAddRef/ObjRelease](ObjAddRef.md), [ComObjQuery](ComObjQuery.md), [GetActiveObject (Microsoft Docs)](https://learn.microsoft.com/windows/win32/api/oleauto/nf-oleauto-getactiveobject)

<a id="Examples"></a>
## Examples

<a id="ExByRef"></a>

**Example:** Passes a VARIANT ByRef to a COM function.

```ahk
#Requires AutoHotkey v2 32-bit ; 32-bit for ScriptControl.
code := "
(
Sub Example(Var)
    MsgBox Var
    Var = "out value!"
End Sub
)"
sc := ComObject("ScriptControl"), sc.Language := "VBScript", sc.AddCode(code)

; Example: Pass a VARIANT ByRef to a COM method.
var := ComVar()
var[] := "in value"
sc.Run("Example", var.ref)
MsgBox var[]

; The same thing again, but more direct:
variant_buf := Buffer(24, 0)  ; Make a buffer big enough for a VARIANT.
var := ComValue(0x400C, variant_buf.ptr)  ; Make a reference to a VARIANT.
var[] := "in value"
sc.Run("Example", var)  ; Pass the VT_BYREF ComValue itself, no [] or .ref.
MsgBox var[]
; If a VARIANT contains a string or object, it must be explicitly freed
; by calling VariantClear or assigning a pure numeric value:
var[] := 0

; The simplest way when the method accepts VT_BYREF|VT_VARIANT:
var := "in value"
sc.Run("Example", &var)
MsgBox var

; ComVar: An object which can be used to pass a value ByRef.
;   this[] retrieves the value.
;   this[] := Val sets the value.
;   this.ref retrieves a ByRef object for passing to a COM method.
class ComVar {
    __new(vType := 0xC) {
        ; Allocate memory for a VARIANT to hold our value. VARIANT is used even
        ; when vType != VT_VARIANT so that VariantClear can be used by __delete.
        this.var := Buffer(24, 0)
        ; Create an object which can be used to pass the variable ByRef.
        this.ref := ComValue(0x4000|vType, this.var.ptr + (vType=0xC ? 0 : 8))
        ; Store the variant type for VariantClear (if not VT_VARIANT).
        if vType != 0xC
            NumPut "ushort", vType, this.var
    }
    __item {
        get => this.ref[]
        set => this.ref[] := value
    }
    __delete() {
        DllCall("oleaut32\VariantClear", "ptr", this.var)
    }
}
```
