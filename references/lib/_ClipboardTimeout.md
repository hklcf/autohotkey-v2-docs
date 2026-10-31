# #ClipboardTimeout

Changes how long the script keeps trying to access the clipboard when the first attempt fails.

```ahk
#ClipboardTimeout Milliseconds
```

<a id="Parameters"></a>
## Parameters

**Milliseconds**

Type: [Integer](../Concepts.md#numbers)

The length of the interval in milliseconds. Specify -1 to have it keep trying indefinitely. Specify 0 to have it try only once.

<a id="Remarks"></a>
## Remarks

If this directive is unspecified in the script, it will behave as though set to 1000 (milliseconds).

Some applications keep the clipboard open for long periods of time, perhaps to write or read large amounts of data. In such cases, increasing this setting causes the script to wait longer before giving up and displaying an error message.

This settings applies to all [clipboard](A_Clipboard.md) operations, the simplest of which are the following examples: `Var := A_Clipboard` and `A_Clipboard := "New Text"`.

Whenever the script is waiting for the clipboard to become available, new [threads](../misc/Threads.md) <u>cannot</u> be launched and [timers](SetTimer.md) will not run. However, if the user presses a [hotkey](../Hotkeys.md), selects a [custom menu item](Menu.md), or performs a [GUI action](Gui.md) such as pressing a button, that event will be buffered until later; in other words, its subroutine will be performed after the clipboard finally becomes available.

This directive does <u>not</u> cause the reading of clipboard data to be reattempted if the first attempt fails.

Like other directives, #ClipboardTimeout cannot be executed conditionally.

<a id="Related"></a>
## Related

[A_Clipboard](A_Clipboard.md), [Thread](Thread.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Causes the script to wait 2 seconds instead of 1 second before giving up accessing the clipboard and displaying an error message.

```ahk
#ClipboardTimeout 2000
```
