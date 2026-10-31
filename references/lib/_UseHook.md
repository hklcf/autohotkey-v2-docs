# #UseHook

Forces the use of the hook to implement all or some keyboard [hotkeys](../Hotkeys.md).

```ahk
#UseHook Setting
```

<a id="Parameters"></a>
## Parameters

**Setting**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If omitted, it defaults to *True*. Otherwise, specify one of the following literal values:

**True** or **1**: The [keyboard hook](InstallKeybdHook.md) will be used to implement all keyboard hotkeys between here and the next `#UseHook False` (if any).

**False** or **0**: Hotkeys will be implemented using the default method (RegisterHotkey() if possible; otherwise, the keyboard hook).

<a id="Remarks"></a>
## Remarks

If this directive is unspecified in the script, it will behave as though set to *False*, meaning the windows API function RegisterHotkey() is used to implement a keyboard hotkey whenever possible. However, the responsiveness of hotkeys might be better under some conditions if the [keyboard hook](InstallKeybdHook.md) is used instead.

Turning this directive ON is equivalent to using the [$ prefix](../Hotkeys.md#prefixdollar) in the definition of each affected hotkey.

As with all # directives -- which are processed only once when the script is launched -- `#UseHook` should not be positioned in the script as though it were a function (that is, it is not necessary to have it contained within a subroutine). Instead, position it immediately before the first hotkey you wish to have affected by it.

By default, hotkeys that use the [keyboard hook](InstallKeybdHook.md) cannot be triggered by means of the [Send](Send.md) function. Similarly, mouse hotkeys cannot be triggered by built-in functions such as [Click](Click.md) because all mouse hotkeys use the [mouse hook](InstallMouseHook.md). One workaround is to [name the hotkey's function](../Hotkeys.md#Function) and call it directly.

[#InputLevel](_InputLevel.md) and [SendLevel](SendLevel.md) provide additional control over which hotkeys and hotstrings are triggered by the Send function.

Like other directives, #UseHook cannot be executed conditionally.

<a id="Related"></a>
## Related

[InstallKeybdHook](InstallKeybdHook.md), [InstallMouseHook](InstallMouseHook.md), [ListHotkeys](ListHotkeys.md), [#InputLevel](_InputLevel.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Causes the first two hotkeys to use the keyboard hook.

```ahk
#UseHook  ; Force the use of the hook for hotkeys after this point.
#x::MsgBox "This hotkey will be implemented with the hook."
#y::MsgBox "And this one too."
#UseHook False
#z::MsgBox "But not this one."
```
