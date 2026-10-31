# #MaxThreadsPerHotkey

Sets the maximum number of simultaneous [threads](../misc/Threads.md) per [hotkey](../Hotkeys.md) or [hotstring](../Hotstrings.md).

```ahk
#MaxThreadsPerHotkey Value
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [Integer](../Concepts.md#numbers)

The maximum number of [threads](../misc/Threads.md) that can be launched for a given hotkey/hotstring subroutine (limit 255).

<a id="Remarks"></a>
## Remarks

If this directive is unspecified in the script, it will behave as though set to 1.

This setting is used to control how many "instances" of a given [hotkey](../Hotkeys.md) or [hotstring](../Hotstrings.md) subroutine are allowed to exist simultaneously. For example, if a hotkey has a max of 1 and it is pressed again while its subroutine is already running, the press will be ignored. This is helpful to prevent accidental double-presses. However, if you wish these keypresses to be buffered rather than ignored -- perhaps to increase the responsiveness of the keyboard's auto-repeat feature -- use [#MaxThreadsBuffer](_MaxThreadsBuffer.md).

Unlike [#MaxThreads](_MaxThreads.md), this setting is <u>not</u> global. Instead, position it before the first hotkey you wish to have affected by it, which will result in all subsequent hotkeys using that value until another instance of this directive is encountered.

The setting of [#MaxThreads](_MaxThreads.md) -- if lower than this setting -- takes precedence.

Like other directives, #MaxThreadsPerHotkey cannot be executed conditionally.

<a id="Related"></a>
## Related

[#MaxThreads](_MaxThreads.md), [#MaxThreadsBuffer](_MaxThreadsBuffer.md), [Critical](Critical.md), [Threads](../misc/Threads.md), [Hotkey](Hotkey.md), [A_MaxHotkeysPerInterval](A_MaxHotkeysPerInterval.md), [ListHotkeys](ListHotkeys.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Allows a maximum of 3 simultaneous threads instead of 1 per hotkey or hotstring.

```ahk
#MaxThreadsPerHotkey 3
```
