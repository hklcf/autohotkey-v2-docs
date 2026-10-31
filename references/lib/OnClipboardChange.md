# OnClipboardChange

Registers a [function](../Functions.md) to be called automatically whenever the clipboard's content changes.

```ahk
OnClipboardChange Callback , AddRemove
```

<a id="Parameters"></a>
## Parameters

**Callback**

Type: [Function Object](../misc/Functor.md)

The function to call.

The callback accepts one parameter and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(DataType) { ...
```

Although the name you give the parameter does not matter, it is assigned one of the following numbers:

- 0 = Clipboard is now empty.
- 1 = Clipboard contains something that can be expressed as text (this includes [files copied](A_Clipboard.md#CopiedFiles) from an Explorer window).
- 2 = Clipboard contains something entirely non-text such as a picture.

You can omit the callback's parameter if the corresponding information is not needed, but in this case an asterisk must be specified, e.g. `MyCallback(*)`.

If this is the last or only callback, the return value is ignored. Otherwise, it can return a non-zero integer to prevent subsequent callbacks from being called.

**AddRemove**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1. Otherwise, specify one of the following numbers:

- 1 = Call the callback after any previously registered callbacks.
- -1 = Call the callback before any previously registered callbacks.
- 0 = Do not call the callback.

<a id="Remarks"></a>
## Remarks

If the clipboard changes while a callback is already running, that notification event is lost. If this is undesirable, use [Critical](Critical.md). However, this will also buffer/defer other [threads](../misc/Threads.md) (such as the press of a hotkey) that occur while the OnClipboardChange thread is running.

If the script itself changes the clipboard, the callbacks are typically not executed immediately; that is, statements immediately below the statement that changed the clipboard are likely to execute beforehand. To force the callbacks to execute immediately, use a short delay such as `Sleep 20` after changing the clipboard.

<a id="Related"></a>
## Related

[A_Clipboard](A_Clipboard.md), [OnExit](OnExit.md), [OnMessage](OnMessage.md), [CallbackCreate](CallbackCreate.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Briefly displays a tooltip for each clipboard change.

```ahk
OnClipboardChange ClipChanged

ClipChanged(DataType) {
    ToolTip "Clipboard data type: " DataType
    Sleep 1000
    ToolTip  ; Turn off the tip.
}
```
