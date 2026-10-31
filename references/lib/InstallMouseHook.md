# InstallMouseHook

Installs or uninstalls the mouse hook.

```ahk
InstallMouseHook Install, Force
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

The mouse hook monitors mouse clicks for the purpose of activating mouse [hotkeys](../Hotkeys.md) and [facilitating hotstrings](../Hotstrings.md#NoMouse).

AutoHotkey does not install the keyboard and mouse hooks unconditionally because together they consume at least 500 KB of memory (but if the keyboard hook is installed, installing the mouse hook only requires about 50 KB of additional memory; and vice versa). Therefore, the mouse hook is normally installed only when the script contains one or more mouse [hotkeys](../Hotkeys.md). It is also installed for [hotstrings](../Hotstrings.md), but that can be disabled via [#Hotstring NoMouse](_Hotstring.md).

By contrast, the InstallMouseHook function can be used to unconditionally install the mouse hook, which has benefits including:

- [KeyHistory](KeyHistory.md) can be used to monitor mouse clicks.
- [GetKeyState](GetKeyState.md) can retrieve the physical state of a button.
- [A_TimeIdleMouse](../Variables.md#TimeIdleMouse) and [A_TimeIdlePhysical](../Variables.md#TimeIdlePhysical) can work correctly (ignoring keyboard input or artificial input, respectively).

You can determine whether a script is using the hook via the [KeyHistory](KeyHistory.md) function or menu item. You can determine which hotkeys are using the hook via the [ListHotkeys](ListHotkeys.md) function or menu item.

<a id="Related"></a>
## Related

[InstallKeybdHook](InstallKeybdHook.md), [#UseHook](_UseHook.md), [Hotkey](Hotkey.md), [KeyHistory](KeyHistory.md), [GetKeyState](GetKeyState.md), [KeyWait](KeyWait.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Installs the mouse hook unconditionally.

```ahk
InstallMouseHook
```
