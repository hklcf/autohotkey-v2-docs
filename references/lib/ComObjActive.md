# ComObjActive

Retrieves a registered COM object.

```ahk
ComObj := ComObjActive(CLSID)
```

<a id="Parameters"></a>
## Parameters

**CLSID**

Type: [String](../Concepts.md#strings)

CLSID or human-readable Prog ID of the COM object to retrieve.

<a id="Return_Value"></a>
## Return Value

Type: [ComObject](ComObject.md)

This function returns a new COM wrapper object with the [variant type](ComObjType.md#vt) VT_DISPATCH (9).

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Related"></a>
## Related

[ComValue](ComValue.md), [ComObject](ComObject.md), [ComObjGet](ComObjGet.md), [ComObjConnect](ComObjConnect.md), [ComObjFlags](ComObjFlags.md), [ObjAddRef/ObjRelease](ObjAddRef.md), [ComObjQuery](ComObjQuery.md), [GetActiveObject (Microsoft Docs)](https://learn.microsoft.com/windows/win32/api/oleauto/nf-oleauto-getactiveobject)

<a id="Examples"></a>
## Examples

<a id="ExWord"></a>

**Example:** Displays the active document in Microsoft Word, if it is running. For details about the COM object and its properties used below, see [Word.Application object (Microsoft Docs)](https://learn.microsoft.com/office/vba/api/Word.Application).

```ahk
try word := ComObjActive("Word.Application")
if not IsSet(word)
    MsgBox "Word isn't open."
else
    MsgBox word.ActiveDocument.FullName
```
