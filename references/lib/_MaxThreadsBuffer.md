# #MaxThreadsBuffer

Causes some or all [hotkeys](../Hotkeys.md) to buffer rather than ignore keypresses when their [#MaxThreadsPerHotkey](_MaxThreadsPerHotkey.md) limit has been reached.

```ahk
#MaxThreadsBuffer Setting
```

<a id="Parameters"></a>
## Parameters

**Setting**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If omitted, it defaults to *True*. Otherwise, specify one of the following literal values:

**True** or **1**: All hotkey subroutines between here and the next `#MaxThreadsBuffer False` directive will buffer rather than ignore presses of their hotkeys whenever their subroutines are at their [#MaxThreadsPerHotkey](_MaxThreadsPerHotkey.md) limit.

**False** or **0**: A hotkey press will be ignored whenever that hotkey is already running its maximum number of threads (usually 1, but this can be changed with [#MaxThreadsPerHotkey](_MaxThreadsPerHotkey.md)).

<a id="Remarks"></a>
## Remarks

If this directive is unspecified in the script, it will behave as though set to *False*.

This directive is rarely used because this type of buffering usually does more harm than good. For example, if you accidentally press a hotkey twice, having this setting ON would cause that hotkey's subroutine to automatically run a second time if its first [thread](../misc/Threads.md) takes less than 1 second to finish (this type of buffer expires after 1 second, by design). Note that AutoHotkey buffers hotkeys in several other ways (such as [Thread Interrupt](Thread.md#Interrupt) and [Critical](Critical.md)). It's just that this particular way can be detrimental, thus it is OFF by default.

The main use for this directive is to increase the responsiveness of the keyboard's auto-repeat feature. For example, when you hold down a hotkey whose [#MaxThreadsPerHotkey](_MaxThreadsPerHotkey.md) setting is 1 (the default), incoming keypresses are ignored if that hotkey subroutine is already running. Thus, when the subroutine finishes, it must wait for the next auto-repeat keypress to come in, which might take 50 ms or more due to being caught in between keystrokes of the auto-repeat cycle. This 50 ms delay can be avoided by enabling this directive for any hotkey that needs the best possible response time while it is being auto-repeated.

As with all # directives, this one should not be positioned in the script as though it were a function (i.e. it is not necessary to have it contained within a subroutine). Instead, position it immediately before the first hotkey you wish to have affected by it.

Like other directives, #MaxThreadsBuffer cannot be executed conditionally.

<a id="Related"></a>
## Related

[#MaxThreads](_MaxThreads.md), [#MaxThreadsPerHotkey](_MaxThreadsPerHotkey.md), [Critical](Critical.md), [Thread (function)](Thread.md), [Threads](../misc/Threads.md), [Hotkey](Hotkey.md), [A_MaxHotkeysPerInterval](A_MaxHotkeysPerInterval.md), [ListHotkeys](ListHotkeys.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Causes the first two hotkeys to buffer rather than ignore keypresses when their #MaxThreadsPerHotkey limit has been reached.

```ahk
#MaxThreadsBuffer True
#x::MsgBox "This hotkey will use this type of buffering."
#y::MsgBox "And this one too."
#MaxThreadsBuffer False
#z::MsgBox "But not this one."
```
