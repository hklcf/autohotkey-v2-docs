# InstallKeybdHook

Installs or uninstalls the keyboard hook.

```ahk
InstallKeybdHook Install, Force
```

<a id="Parameters"></a>
## Parameters

**Install**

Type: [Boolean](../Concepts.md#boolean)

If omitted, it defaults to true.

If **true**, the hook is required to be installed.

If **false**, any requirement previously set by this function is removed, potentially uninstalling the hook.

**Force**

Type: [Boolean](../Concepts.md#boolean)

If omitted, it defaults to false.

If **false**, an internal variable is updated to indicate whether the hook is required by the script, but there might be no immediate change if the hook is required for some other purpose.

If **true** and *Install* is true, the hook is uninstalled and reinstalled. This has the effect of giving it precedence over any hooks previously installed by other processes. If the system has stopped calling the hook due to an unresponsive program, reinstalling the hook might get it working again.

If **true** and *Install* is false, the hook is uninstalled even if needed for some other purpose. If a [hotkey](../Hotkeys.md), [hotstring](../Hotstrings.md) or [InputHook](InputHook.md) requires the hook, it will stop working until the hook is reinstalled. The hook may be reinstalled explicitly by calling this function, or automatically as a side-effect of enabling or disabling a hotkey or calling some other function which requires the hook.

<a id="Remarks"></a>
## Remarks

The keyboard hook monitors keystrokes for the purpose of activating [hotstrings](../Hotstrings.md) and any keyboard [hotkeys](../Hotkeys.md) not supported by RegisterHotkey (which is a function built into the operating system). It also supports a few other features such as the [InputHook](InputHook.md) function.

AutoHotkey does not install the keyboard and mouse hooks unconditionally because together they consume at least 500 KB of memory. Therefore, the keyboard hook is normally installed only when the script contains one of the following: 1) [hotstrings](../Hotstrings.md); 2) one or more [hotkeys](../Hotkeys.md) that require the keyboard hook (most do not); 3) [SetCaps/Scroll/NumLock AlwaysOn/AlwaysOff](SetNumScrollCapsLockState.md); 4) active [Input hooks](InputHook.md).

By contrast, the InstallKeybdHook function can be used to unconditionally install the keyboard hook, which has benefits including:

- [KeyHistory](KeyHistory.md) can be used to display the last 20 keystrokes (for debugging purposes).
- The physical state of the modifier keys can be tracked reliably, which removes the need for [A_HotkeyModifierTimeout](A_HotkeyModifierTimeout.md) and may improve the reliability with which [Send](Send.md) restores the modifier keys to their proper states after temporarily releasing them.
- [GetKeyState](GetKeyState.md) can retrieve the physical state of a key.
- [A_TimeIdleKeyboard](../Variables.md#TimeIdleKeyboard) and [A_TimeIdlePhysical](../Variables.md#TimeIdlePhysical) can work correctly (ignoring mouse input or artificial input, respectively).
- Mouse hotkeys which use the Alt modifier (such as `!LButton::`) can suppress the window menu more efficiently, by sending only one [menu mask key](A_MenuMaskKey.md) when the Alt key is released, instead of sending one each time the button is clicked.

Keyboard hotkeys which do not require the hook will use the *reg* method even if the InstallKeybdHook function is used. By contrast, applying the [#UseHook](_UseHook.md) directive or the [$ prefix](../Hotkeys.md#prefixdollar) to a keyboard hotkey forces it to require the hook, which causes the hook to be installed if the hotkey is enabled.

You can determine whether a script is using the hook via the [KeyHistory](KeyHistory.md) function or menu item. You can determine which hotkeys are using the hook via the [ListHotkeys](ListHotkeys.md) function or menu item.

<a id="Related"></a>
## Related

[InstallMouseHook](InstallMouseHook.md), [#UseHook](_UseHook.md), [Hotkey](Hotkey.md), [InputHook](InputHook.md), [KeyHistory](KeyHistory.md), [Hotstrings](../Hotstrings.md), [GetKeyState](GetKeyState.md), [KeyWait](KeyWait.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Installs the keyboard hook unconditionally.

```ahk
InstallKeybdHook
```
