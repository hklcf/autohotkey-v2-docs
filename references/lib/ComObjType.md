# ComObjType

Retrieves type information from a COM object.

```ahk
Info := ComObjType(ComObj , InfoType)
```

<a id="Parameters"></a>
## Parameters

**ComObj**

Type: [Object](../Concepts.md#objects)

A wrapper object containing a COM object or typed value. See [ComValue](ComValue.md) for details.

**InfoType**

Type: [String](../Concepts.md#strings)

If omitted, an integer [variant type code](#vt) indicating the type of value contained by the COM wrapper object will be retrieved. Otherwise, specify one of the following strings indicating the type information to retrieve:

**Name:** The name of the object's default interface.

**IID:** The globally unique identifier (GUID) of the object's default interface.

**Class:** The object's class name. Note that this is not the same as a Prog ID (a Prog ID is a name used to identify the class in the system registry, or for [ComObject](ComObject.md)).

**CLSID:** The globally unique identifier (GUID) of the object's class. Classes are often registered by CLSID under the `HKCR\CLSID` registry key.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

The return value depends on the value of *InfoType*. An empty string is returned if either parameter is invalid or if the requested type information could not be retrieved.

<a id="vt"></a>
## Variant Type Constants

COM uses the following values to identify basic data types:

```ahk
VT_EMPTY     :=      0  ; No value
VT_NULL      :=      1  ; SQL-style Null
VT_I2        :=      2  ; 16-bit signed int
VT_I4        :=      3  ; 32-bit signed int
VT_R4        :=      4  ; 32-bit floating-point number
VT_R8        :=      5  ; 64-bit floating-point number
VT_CY        :=      6  ; Currency
VT_DATE      :=      7  ; Date
VT_BSTR      :=      8  ; COM string (Unicode string with length prefix)
VT_DISPATCH  :=      9  ; COM object
VT_ERROR     :=    0xA  ; Error code (32-bit integer)
VT_BOOL      :=    0xB  ; Boolean True (-1) or False (0)
VT_VARIANT   :=    0xC  ; VARIANT (must be combined with VT_ARRAY or VT_BYREF)
VT_UNKNOWN   :=    0xD  ; IUnknown interface pointer
VT_DECIMAL   :=    0xE  ; (not supported)
VT_I1        :=   0x10  ; 8-bit signed int
VT_UI1       :=   0x11  ; 8-bit unsigned int
VT_UI2       :=   0x12  ; 16-bit unsigned int
VT_UI4       :=   0x13  ; 32-bit unsigned int
VT_I8        :=   0x14  ; 64-bit signed int
VT_UI8       :=   0x15  ; 64-bit unsigned int
VT_INT       :=   0x16  ; Signed machine int
VT_UINT      :=   0x17  ; Unsigned machine int
VT_RECORD    :=   0x24  ; User-defined type -- NOT SUPPORTED
VT_ARRAY     := 0x2000  ; SAFEARRAY
VT_BYREF     := 0x4000  ; Pointer to another type of value
/*
 VT_ARRAY and VT_BYREF are combined with another value (using bitwise OR)
 to specify the exact type. For instance, 0x2003 identifies a SAFEARRAY
 of 32-bit signed integers and 0x400C identifies a pointer to a VARIANT.
*/
```

<a id="General_Remarks"></a>
## General Remarks

In most common cases, return values from methods or properties of COM objects are converted to an appropriate data type supported by AutoHotkey. Types which aren't specifically handled are coerced to strings via [VariantChangeType](https://learn.microsoft.com/windows/win32/api/oleauto/nf-oleauto-variantchangetype); if this fails or if the variant type contains the VT_ARRAY or VT_BYREF flag, an object containing both the value and its type is returned instead.

For any variable *x*, if `ComObjType(x)` returns an integer, *x* contains a COM object wrapper.

If *InfoType* is `"Name"` or `"IID"`, type information is retrieved via the [IDispatch::GetTypeInfo](https://learn.microsoft.com/windows/win32/api/oaidl/nf-oaidl-idispatch-gettypeinfo) interface method. *ComObj*'s variant type must be VT_DISPATCH.

If *InfoType* is `"Class"` or `"CLSID"`, type information is retrieved via the [IProvideClassInfo::GetClassInfo](https://learn.microsoft.com/windows/win32/api/ocidl/nf-ocidl-iprovideclassinfo-getclassinfo) interface method. *ComObj*'s variant type must be VT_DISPATCH or VT_UNKNOWN, and the object must implement the IProvideClassInfo interface (some objects do not).

<a id="Related"></a>
## Related

[ComObjValue](ComObjValue.md), [ComValue](ComValue.md), [ComObject](ComObject.md), [ComObjGet](ComObjGet.md), [ComObjActive](ComObjActive.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reports various type information of a COM object.

```ahk
d := ComObject("Scripting.Dictionary")
MsgBox
(
    "Variant type:`t" ComObjType(d) "
    Interface name:`t" ComObjType(d, "Name") "
    Interface ID:`t" ComObjType(d, "IID") "
    Class name:`t" ComObjType(d, "Class") "
    Class ID (CLSID):`t" ComObjType(d, "CLSID")
)
```
