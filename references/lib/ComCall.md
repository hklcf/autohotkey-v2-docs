# ComCall

Calls a native COM interface method by index.

```ahk
Result := ComCall(Index, ComObj , Type1, Arg1, Type2, Arg2, ReturnType)
```

<a id="Parameters"></a>
## Parameters

**Index**

Type: [Integer](../Concepts.md#numbers)

The zero-based index of the method within the virtual function table.

*Index* corresponds to the position of the method within the original interface definition. Microsoft documentation usually lists methods in alphabetical order, which is not relevant. In order to determine the correct index, locate the original interface definition. This may be in a header file or type library.

It is important to take into account methods which are inherited from parent interfaces. Since all COM interfaces ultimately derive from [IUnknown](https://learn.microsoft.com/windows/win32/api/unknwn/nn-unknwn-iunknown), the first three methods are always QueryInterface (0), AddRef (1) and Release (2). For example, *IShellItem2* is an extension of *IShellItem*, which starts at index 3 and contains 5 methods, so *IShellItem2*'s first method (GetPropertyStore) is at index 8.

> **Tip:** For COM interfaces defined by Microsoft, try searching the Internet or Windows SDK for "*IInterfaceName***Vtbl**" - for example, "IUnknownVtbl". Microsoft's own interface definitions are accompanied by this plain-C definition of the interface's virtual function table, which lists all methods explicitly, in the correct order.

Passing an invalid index may cause undefined behavior, including (but not limited to) program termination.

**ComObj**

Type: [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

The target COM object; that is, a COM interface pointer. The pointer value can be passed directly or encapsulated within an object with the `Ptr` property, such as a [ComValue](ComValue.md) with variant type VT_UNKNOWN.

The interface pointer is used to locate the address of the virtual function which implements the interface method, and is also passed as a parameter. This parameter is generally not explicitly present in languages which natively support interfaces, but is shown in the C style "Vtbl" definition.

Passing an invalid pointer may cause undefined behavior, including (but not limited to) program termination.

**Type1, Arg1**

Type: [String](../Concepts.md#strings)

Each of these pairs represents a single parameter to be passed to the method. The number of pairs is unlimited. For *Type*, see the [DllCall types table](DllCall.md#types). For *Arg*, specify the value to be passed to the method.

**ReturnType**

Type: [String](../Concepts.md#strings)

If omitted, the return type defaults to [HRESULT](DllCall.md#HRESULT), which is most the common return type for COM interface methods. Any result indicating failure causes an [OSError](Error.md#OSError) to be thrown; therefore, the return type must not be omitted unless the actual return type is HRESULT.

If the method is of a type that does not return a value (the `void` return type in C), specify `"Int"` or any other numeric type without any suffix (except HRESULT), and ignore the return value. As the content of the return value register is arbitrary in such cases, an exception may or may not be thrown if *ReturnType* is omitted.

Otherwise, specify one of the argument types from the [DllCall types table](DllCall.md#types). The [asterisk suffix](DllCall.md#asterisk) is also supported.

<a id="CDecl"></a>

<a id="cdecl"></a>Although ComCall supports the *CDecl* keyword as per [DllCall](DllCall.md#CDecl), it is generally not used by COM interface methods.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If *ReturnType* is [HRESULT](DllCall.md#HRESULT) (or omitted) and the method returned an error value (as defined by the [FAILED macro](https://learn.microsoft.com/windows/win32/api/winerror/nf-winerror-failed)), an [OSError](Error.md#OSError) is thrown.

Otherwise, ComCall returns the actual value returned by the method. If the method is of a type that does not return a value (with return type defined in C as `void`), the result is undefined and should be ignored.

<a id="Remarks"></a>
## Remarks

The following DllCall topics are also applicable to ComCall:

- [Types of Arguments and Return Values](DllCall.md#types)
- [Errors](DllCall.md#error)
- [Native Exceptions and A_LastError](DllCall.md#except)
- [Structures and Arrays](DllCall.md#struct)
- [Known Limitations](DllCall.md#limits)
- [.NET Framework](DllCall.md#dotnet)

<a id="Related"></a>
## Related

[ComObject](ComObject.md), [ComObjQuery](ComObjQuery.md), [ComValue](ComValue.md), [Buffer object](Buffer.md), [CallbackCreate](CallbackCreate.md)

<a id="Examples"></a>
## Examples

<a id="ExTaskbar"></a>

**Example:** Removes the active window from the taskbar for 3 seconds. Compare this to the [equivalent DllCall example](DllCall.md#ExTaskbar).

```ahk
/*
  Methods in ITaskbarList's VTable:
    IUnknown:
      0 QueryInterface  -- use ComObjQuery instead
      1 AddRef          -- use ObjAddRef instead
      2 Release         -- use ObjRelease instead
    ITaskbarList:
      3 HrInit
      4 AddTab
      5 DeleteTab
      6 ActivateTab
      7 SetActiveAlt
*/
IID_ITaskbarList  := "{56FDF342-FD6D-11d0-958A-006097C9A090}"
CLSID_TaskbarList := "{56FDF344-FD6D-11d0-958A-006097C9A090}"

; Create the TaskbarList object.
tbl := ComObject(CLSID_TaskbarList, IID_ITaskbarList)

activeHwnd := WinExist("A")

ComCall(3, tbl)                     ; tbl.HrInit()
ComCall(5, tbl, "ptr", activeHwnd)  ; tbl.DeleteTab(activeHwnd)
Sleep 3000
ComCall(4, tbl, "ptr", activeHwnd)  ; tbl.AddTab(activeHwnd)

; When finished with the object, simply replace any references with
; some other value (or if its a local variable, just return):
tbl := ""
```

<a id="ExTaskbarClass"></a>

**Example:** Demonstrates some techniques for wrapping COM interfaces. Equivalent to the previous example.

```ahk
tbl := TaskbarList()

activeHwnd := WinExist("A")

tbl.DeleteTab(activeHwnd)
Sleep 3000
tbl.AddTab(activeHwnd)

tbl := ""

class TaskbarList {
    static IID := "{56FDF342-FD6D-11d0-958A-006097C9A090}"
    static CLSID := "{56FDF344-FD6D-11d0-958A-006097C9A090}"

    ; Called on startup to initialize the class.
    static __new() {
        ; Get the base object for all instances of TaskbarList.
        proto := this.Prototype

        ; Bound functions can be used to predefine parameters, making
        ; the methods more usable without requiring wrapper functions.
        ; HrInit itself has no parameters, so bind only the index,
        ; and the caller will implicitly provide 'this'.
        proto.HrInit := ComCall.Bind(3)

        ; Leave a parameter blank to let the caller provide a value.
        ; In this case, the blank parameter is 'this' (normally hidden).
        proto.AddTab := ComCall.Bind(4,, "ptr")

        ; An object or Map can be used to reduce repetition.
        for name, args in Map(
            "DeleteTab", [5,,"ptr"],
            "ActivateTab", [6,,"ptr"],
            "SetActiveAlt", [7,,"ptr"]) {
            proto.%name% := ComCall.Bind(args*)
        }
    }

    ; Called by TaskbarList() on the new instance.
    __new() {
        this.comobj := ComObject(TaskbarList.CLSID, TaskbarList.IID)
        this.ptr := this.comobj.ptr
        ; Request initialization via ITaskbarList.
        this.HrInit()
    }
}
```
