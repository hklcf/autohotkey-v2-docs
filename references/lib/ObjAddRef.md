# ObjAddRef / ObjRelease

Increments or decrements an object's [reference count](../Objects.md#Reference_Counting).

```ahk
NewRefCount := ObjAddRef(Ptr)
NewRefCount := ObjRelease(Ptr)
```

<a id="Parameters"></a>
## Parameters

**Ptr**

Type: [Integer](../Concepts.md#numbers)

An unmanaged object pointer or COM interface pointer.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

These functions return the new reference count. This value should be used **only** for debugging purposes.

<a id="Related"></a>
## Related

[Reference Counting](../Objects.md#Reference_Counting)

Although the following articles discuss reference counting as it applies to COM, they cover some important concepts and rules which generally also apply to AutoHotkey objects: [IUnknown::AddRef](https://learn.microsoft.com/windows/win32/api/unknwn/nf-unknwn-iunknown-addref), [IUnknown::Release](https://learn.microsoft.com/windows/win32/api/unknwn/nf-unknwn-iunknown-release), [Reference Counting Rules](https://learn.microsoft.com/windows/win32/com/rules-for-managing-reference-counts).
