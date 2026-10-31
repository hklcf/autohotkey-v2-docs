# #MaxThreads

Sets the maximum number of simultaneous [threads](../misc/Threads.md).

```ahk
#MaxThreads Value
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [Integer](../Concepts.md#numbers)

The maximum total number of [threads](../misc/Threads.md) that can exist simultaneously. Specifying a number higher than 255 is the same as specifying 255.

<a id="Remarks"></a>
## Remarks

If this directive is unspecified in the script, it will behave as though set to 10.

This setting is global, meaning that it needs to be specified only once (anywhere in the script) to affect the behavior of the entire script.

Although a value of 1 is allowed, it is not recommended because it would prevent new [hotkeys](../Hotkeys.md) from launching whenever the script is displaying a [message box](MsgBox.md) or other dialog. It would also prevent [timers](SetTimer.md) from running whenever another [thread](../misc/Threads.md) is sleeping or waiting.

The [OnExit](OnExit.md) callback function will always launch regardless of how many threads exist.

If this setting is lower than [#MaxThreadsPerHotkey](_MaxThreadsPerHotkey.md), it effectively overrides that setting.

Like other directives, #MaxThreads cannot be executed conditionally.

<a id="Related"></a>
## Related

[#MaxThreadsPerHotkey](_MaxThreadsPerHotkey.md), [Threads](../misc/Threads.md), [A_MaxHotkeysPerInterval](A_MaxHotkeysPerInterval.md), [ListHotkeys](ListHotkeys.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Allows a maximum of 2 instead of 10 simultaneous threads.

```ahk
#MaxThreads 2
```
