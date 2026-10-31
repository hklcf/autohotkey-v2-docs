# ComObjConnect

Connects a COM object's event source to the script, enabling events to be handled.

```ahk
ComObjConnect ComObj , PrefixOrSink
```

<a id="Parameters"></a>
## Parameters

**ComObj**

Type: [ComObject](ComObject.md)

An object which raises events.

If the object does not support the IConnectionPointContainer interface or type information about the object's class cannot be retrieved, an error message is shown. This can be suppressed or handled with [try](Try.md)/[catch](Catch.md).

The IProvideClassInfo interface is used to retrieve type information about the object's class if the object supports it. Otherwise, ComObjConnect attempts to retrieve type information via the object's IDispatch interface, which may be unreliable.

**PrefixOrSink**

Type: [String](../Concepts.md#strings) or [Object](../Concepts.md#objects)

If omitted, the object is "disconnected"; that is, the script will no longer receive notification of its events. Otherwise, specify a string to prefix to the event name to determine which global function to call when an event occurs, or an [event sink object](#event-sink) defining a static method for each event to be handled.

> **Note:** Nested functions are not supported in this mode, as names may be resolved after the current function returns. To use nested functions or closures, attach them to an object and pass the object as described below.

<a id="Usage"></a>
## Usage

To make effective use of ComObjConnect, you must first write functions in the script to handle any events of interest. Such functions, or "event-handlers," have the following structure:

```ahk
PrefixEventName([Params..., ComObj])
{
    ... event-handling code ...
    return ReturnValue
}
```

*Prefix* should be the same as the *PrefixOrSink* parameter if it is a string; otherwise, it should be omitted. **EventName** should be replaced with the name of whatever event the function should handle.

*Params* corresponds to whatever parameters the event has. If the event has no parameters, *Params* should be omitted entirely. *ComObj* is an additional parameter containing a reference to the original wrapper object which was passed to ComObjConnect; it is never included in the COM event's documentation. "ComObj" should be replaced with a name more meaningful in the context of your script.

Note that event handlers may have return values. To return a COM-specific type of value, use [ComValue](ComValue.md). For example, `return ComValue(0,0)` returns a variant of type VT_EMPTY, which is equivalent to returning `undefined` (or not returning) from a JavaScript function.

Call `ComObjConnect(yourObject, "Prefix")` to enable event-handling.

Call `ComObjConnect(yourObject)` to disconnect the object (stop handling events).

If the number of parameters is not known, a [variadic function](../Functions.md#Variadic) can be used.

### Event Sink

If *PrefixOrSink* is an object, whenever an event is raised, the corresponding method of that object is called. Although the object can be constructed dynamically, it is more typical for *PrefixOrSink* to refer to a class or an instance of a class. In that case, methods are defined as shown above, but without *Prefix*.

As with any call to a method, the method's (normally hidden) `this` parameter contains a reference to the object through which the method was called; i.e. the event sink object, not the COM object. This can be used to provide context to the event handlers, or share values between them.

To catch all events without defining a method for each one, define a [\__Call meta-function](../Objects.md#Meta_Functions).

*ComObject* releases its reference to *PrefixOrSink* automatically if the COM object releases the connection. For example, Internet Explorer does this when it exits. If the script does not retain its own reference to *PrefixOrSink*, it can use [\__Delete](../Objects.md#Custom_NewDelete) to detect when this occurs. If the object is hosted by a remote process and the process terminates unexpectedly, it may take several minutes for the system to release the connection.

<a id="Remarks"></a>
## Remarks

The script must retain a reference to *ComObj*, otherwise it would be freed automatically and would disconnect from its COM object, preventing any further events from being detected. There is no standard way to detect when the connection is no longer required, so the script must disconnect manually by calling ComObjConnect.

The [Persistent](Persistent.md) function may be needed to keep the script running while it is listening for events.

An exception is thrown on failure.

<a id="Related"></a>
## Related

[ComObject](ComObject.md), [ComObjGet](ComObjGet.md), [ComObjActive](ComObjActive.md), [WScript.ConnectObject (Microsoft Docs)](https://learn.microsoft.com/previous-versions/ccxe1xe6(v=vs.85))

<a id="Examples"></a>
## Examples

<a id="ExIE"></a>

**Example:** Launches an instance of Internet Explorer and connects events to corresponding script functions with the prefix "IE_". For details about the COM object and DocumentComplete event used below, see [InternetExplorer object (Microsoft Docs)](https://learn.microsoft.com/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa752084(v=vs.85)).

```ahk
ie := ComObject("InternetExplorer.Application")

; Connects events to corresponding script functions with the prefix "IE_".
ComObjConnect(ie, "IE_")

ie.Visible := true  ; This is known to work incorrectly on IE7.
ie.Navigate("https://www.autohotkey.com/")
Persistent

IE_DocumentComplete(ieEventParam, &url, ieFinalParam) {
    ; IE passes url as a reference to a VARIANT, therefore &url is used above
    ; so that the code below can refer to it naturally rather than as %url%.
    s := ""
    if (ie != ieEventParam)
        s .= "First parameter is a new wrapper object.`n"
    if (ie == ieFinalParam)
        s .= "Final parameter is the original wrapper object.`n"
    if (ComObjValue(ieEventParam) == ComObjValue(ieFinalParam))
        s .= "Both wrapper objects refer to the same IDispatch instance.`n"
    MsgBox s . "Finished loading " ie.Document.title " @ " url
    ie.Quit()
    ExitApp
}
```
