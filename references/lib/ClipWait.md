# ClipWait

Waits until the [clipboard](A_Clipboard.md) contains data.

```ahk
Boolean := ClipWait(Timeout, WaitFor)
```

<a id="Parameters"></a>
## Parameters

**Timeout**

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

If omitted, the function will wait indefinitely. Otherwise, it will wait no longer than this many seconds. To wait for a fraction of a second, specify a floating-point number, for example, 0.25 to wait for a maximum of 250 milliseconds.

**WaitFor**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 0 (wait only for text or files). Otherwise, specify one of the following numbers to indicate what to wait for:

**0:** The function is more selective, waiting specifically for text or files to appear ("text" includes anything that would produce text when you paste into Notepad).

**1:** The function waits for data of any kind to appear on the clipboard.

Other values are reserved for future use.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 0 (false) if the function timed out or 1 (true) otherwise (i.e. the clipboard contains data).

<a id="Remarks"></a>
## Remarks

It's better to use this function than a loop of your own that checks to see if this clipboard is blank. This is because the clipboard is never opened by this function, and thus it performs better and avoids any chance of interfering with another application that may be using the clipboard.

This function considers anything convertible to text (e.g. HTML) to be text. It also considers files, such as those copied in an Explorer window via `Ctrl`+`C`, to be text. Such files are automatically converted to their filenames (with full path) whenever the clipboard variable is referred to in the script. See [A_Clipboard](A_Clipboard.md) for details.

When 1 is present as the last parameter, the function will be satisfied when any data appears on the clipboard. This can be used in conjunction with [ClipboardAll](ClipboardAll.md) to save non-textual items such as pictures.

While the function is in a waiting state, new [threads](../misc/Threads.md) can be launched via [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md).

<a id="Related"></a>
## Related

[A_Clipboard](A_Clipboard.md), [WinWait](WinWait.md), [KeyWait](KeyWait.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Empties the clipboard, copies the current selection into the clipboard and waits a maximum of 2 seconds until the clipboard contains data. If ClipWait times out, an error message is shown, otherwise the clipboard contents is shown.

```ahk
A_Clipboard := "" ; Empty the clipboard
Send "^c"
if !ClipWait(2)
{
    MsgBox "The attempt to copy text onto the clipboard failed."
    return
}
MsgBox "clipboard = " A_Clipboard
return
```
