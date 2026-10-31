# ComObjQuery

Queries a COM object for an interface or service.

```ahk
InterfaceComObj := ComObjQuery(ComObj, SID, IID)
InterfaceComObj := ComObjQuery(ComObj, IID)
```

<a id="Parameters"></a>
## Parameters

**ComObj**

Type: [Object](../Concepts.md#objects) or [Integer](../Concepts.md#numbers)

A COM wrapper object, an interface pointer, or an object with a `Ptr` property which returns an interface pointer. See [ComValue](ComValue.md) for details.

**IID**

Type: [String](../Concepts.md#strings)

An interface identifier (GUID) in the form "{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}".

**SID**

Type: [String](../Concepts.md#strings)

A service identifier in the same form as IID.

<a id="Return_Value"></a>
## Return Value

Type: [Object](../Concepts.md#objects)

This function returns a COM wrapper object of type dependent on the IID parameter.

| IID | Class | Variant Type | Description |
| --- | --- | --- | --- |
| IID_IDispatch | `ComObject` | VT_DISPATCH (9) | Allows the script to call properties and methods of the object using normal [object syntax](../Objects.md#Usage_Objects). |
| Any other IID | `ComValue` | VT_UNKNOWN (13) | Provides only a `Ptr` property, which allows the object to be passed to [DllCall](DllCall.md) or [ComCall](ComCall.md). |

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure, such as if the interface is not supported.

<a id="Remarks"></a>
## Remarks

In its two-parameter mode, this function is equivalent to [IUnknown::QueryInterface](https://learn.microsoft.com/windows/win32/api/unknwn/nf-unknwn-iunknown-queryinterface(refiid_void)). When SID and IID are both specified, it internally queries for the [IServiceProvider](https://learn.microsoft.com/previous-versions/windows/internet-explorer/ie-developer/platform-apis/cc678965(v=vs.85)) interface, then calls [IServiceProvider::QueryService](https://learn.microsoft.com/previous-versions/windows/internet-explorer/ie-developer/platform-apis/cc678966(v=vs.85)).

[ComCall](ComCall.md) can be used to call native interface methods.

<a id="Related"></a>
## Related

[ComCall](ComCall.md), [ComObject](ComObject.md), [ComObjGet](ComObjGet.md), [ComObjActive](ComObjActive.md)

<a id="Examples"></a>
## Examples

<a id="ExClassName"></a>

**Example:** Determines the class name of an object.

```ahk
obj := ComObject("Scripting.Dictionary")

MsgBox "Interface name: " ComObjType(obj, "name")

IID_IProvideClassInfo := "{B196B283-BAB4-101A-B69C-00AA00341D07}"

; Request the object's IProvideClassInfo interface.
try
    pci := ComObjQuery(obj, IID_IProvideClassInfo)
catch
{
    MsgBox "IProvideClassInfo interface not supported."
    return
}

; Call GetClassInfo to retrieve a pointer to the ITypeInfo interface.
ComCall(3, pci, "ptr*", &ti := 0)

; Wrap ti to ensure automatic cleanup.
ti := ComValue(13, ti)

; Call GetDocumentation to get the object's full type name.
ComCall(12, ti, "int", -1, "ptr*", &pname := 0, "ptr", 0, "ptr", 0, "ptr", 0)

; Convert the BSTR pointer to a usable string.
name := StrGet(pname, "UTF-16")

; Clean up.
DllCall("oleaut32\SysFreeString", "ptr", pname)
pci := ti := ""

; Display the type name!
MsgBox "Class name: " name
```

<a id="ExIE"></a>

**Example:** Automates an existing Internet Explorer window.

```ahk
sURL := "https://www.autohotkey.com/boards/"
if WebBrowser := GetWebBrowser()
    WebBrowser.Navigate(sURL)

GetWebBrowser()
{
    ; Get a raw pointer to the document object of the top-most IE window.
    static msg := DllCall("RegisterWindowMessage", "Str", "WM_HTML_GETOBJECT")
    lResult := SendMessage(msg, 0, 0, "Internet Explorer_Server1", "ahk_class IEFrame")
    if !lResult
        return  ; IE not found.
    static IID_IHTMLDocument2 := GUID("{332C4425-26CB-11D0-B483-00C04FD90119}")
    static VT_UNKNOWN := 13
    DllCall("oleacc\ObjectFromLresult", "Ptr", lResult
        , "Ptr", IID_IHTMLDocument2, "Ptr", 0
        , "Ptr*", pdoc := ComValue(VT_UNKNOWN, 0))

    ; Query for the WebBrowserApp service. In this particular case,
    ; the SID and IID are the same, but it isn't always this way.
    static IID_IWebBrowserApp := "{0002DF05-0000-0000-C000-000000000046}"
    static SID_SWebBrowserApp := IID_IWebBrowserApp
    pweb := ComObjQuery(pdoc, SID_SWebBrowserApp, IID_IWebBrowserApp)

    ; Return the WebBrowser object as IDispatch for usability.
    ; This works only because IWebBrowserApp is derived from IDispatch.
    ; pweb will release its ptr automatically, so AddRef to counter that.
    ObjAddRef(pweb.ptr)
    static VT_DISPATCH := 9
    return ComValue(VT_DISPATCH, pweb.ptr)
}

GUID(sGUID) ; Converts a string to a binary GUID and returns it in a Buffer.
{
    GUID := Buffer(16, 0)
    if DllCall("ole32\CLSIDFromString", "WStr", sGUID, "Ptr", GUID) < 0
        throw ValueError("Invalid parameter #1", -1, sGUID)
    return GUID
}
```
