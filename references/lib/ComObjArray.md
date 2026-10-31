# ComObjArray

Creates a SafeArray for use with COM.

```ahk
ArrayObj := ComObjArray(VarType, Count1 , Count2, ... Count8)
```

`ComObjArray` itself is a [class](Class.md) derived from `ComValue`, but is used only to create or identify SafeArray wrapper objects.

<a id="Parameters"></a>
## Parameters

**VarType**

Type: [Integer](../Concepts.md#numbers)

The base type of the array (the VARTYPE of each element of the array). The VARTYPE is restricted to a subset of the variant types. Neither the VT_ARRAY nor the VT_BYREF flag can be set. VT_EMPTY and VT_NULL are not valid base types for the array. All other types are legal.

See [ComObjType](ComObjType.md) for a list of possible values.

**Count*N***

Type: [Integer](../Concepts.md#numbers)

The size of each dimension. Arrays containing up to 8 dimensions are supported.

<a id="Return_Value"></a>
## Return Value

Type: ComObjArray

This function returns a wrapper object containing a new SafeArray.

<a id="Methods"></a>
## Methods

ComObjArray objects support the following methods:

- `.MaxIndex(n)`: Returns the upper bound of the *n*th dimension. If *n* is omitted, it defaults to 1.
- `.MinIndex(n)`: Returns the lower bound of the *n*th dimension. If *n* is omitted, it defaults to 1.
- `.Clone()`: Returns a copy of the array.
- `.__Enum()`: Not typically called by script; allows [for-loops](For.md) to be used with SafeArrays.

<a id="Remarks"></a>
## Remarks

ComObjArray objects may also be returned by COM methods and [ComValue](ComValue.md). Scripts may determine if a value is a ComObjArray as follows:

```ahk
; Check class
if obj is ComObjArray
    MsgBox "Array subtype: " . ComObjType(obj) & 0xfff
else
    MsgBox "Not an array."

; Check for VT_ARRAY
if ComObjType(obj) & 0x2000
    MsgBox "obj is a ComObjArray"

; Check specific array type
if ComObjType(obj) = 0x2008
    MsgBox "obj is a ComObjArray of strings"
```

Arrays with up to 8 dimensions are supported.

Since SafeArrays are not designed to support multiple references, when one SafeArray is assigned to an element of another SafeArray, a separate copy is created. However, this only occurs if the wrapper object has the F_OWNVALUE flag, which indicates it is responsible for destroying the array. This flag can be removed by using [ComObjFlags](ComObjFlags.md).

When a function or method called by a COM client returns a SafeArray with the F_OWNVALUE flag, a copy is created and returned instead, as the original SafeArray is automatically destroyed.

<a id="Related"></a>
## Related

[ComValue](ComValue.md), [ComObjType](ComObjType.md), [ComObjValue](ComObjValue.md), [ComObjActive](ComObjActive.md), [ComObjFlags](ComObjFlags.md), [Array Manipulation Functions (Microsoft Docs)](https://learn.microsoft.com/previous-versions/windows/desktop/automat/array-manipulation-functions)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Simple usage.

```ahk
arr := ComObjArray(VT_VARIANT:=12, 3)
arr[0] := "Auto"
arr[1] := "Hot"
arr[2] := "key"
t := ""
Loop arr.MaxIndex() + 1
    t .= arr[A_Index-1]
MsgBox t
```

<a id="ExMultiDims"></a>

**Example:** Multiple dimensions.

```ahk
arr := ComObjArray(VT_VARIANT:=12, 3, 4)

; Get the number of dimensions:
dim := DllCall("oleaut32\SafeArrayGetDim", "ptr", ComObjValue(arr))

; Get the bounds of each dimension:
dims := ""
Loop dim
    dims .= arr.MinIndex(A_Index) " .. " arr.MaxIndex(A_Index) "`n"
MsgBox dims

; Simple usage:
Loop 3 {
    x := A_Index-1
    Loop 4 {
        y := A_Index-1
        arr[x, y] := x * y
    }
}
MsgBox arr[2, 3]
```
