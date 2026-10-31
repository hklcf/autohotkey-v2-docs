# KeyWait

Waits for a key or mouse/controller button to be released or pressed down.

```ahk
KeyWait KeyName , Options
```

<a id="Parameters"></a>
## Parameters

**KeyName**

Type: [String](../Concepts.md#strings)

This can be just about any single character from the keyboard or one of the key names from the [key list](../KeyList.md), such as a mouse/controller button. Controller attributes other than buttons are not supported.

An explicit virtual key code such as `vkFF` may also be specified. This is useful in the rare case where a key has no name and produces no visible character when pressed. Its virtual key code can be determined by following the steps at the bottom of the [key list page](../KeyList.md#SpecialKeys).

**Options**

Type: [String](../Concepts.md#strings)

If blank or omitted, the function will wait indefinitely for the specified key or mouse/controller button to be physically released by the user. However, if the [keyboard hook](InstallKeybdHook.md) is not installed and *KeyName* is a keyboard key released artificially by means such as the [Send](Send.md) function, the key will be seen as having been physically released. The same is true for mouse buttons when the [mouse hook](InstallMouseHook.md) is not installed.

Otherwise, specify a string of one or more of the following options (in any order, with optional spaces in between):

**D:** Wait for the key to be pushed down.

**L:** Check the logical state of the key, which is the state that the OS and the active window believe the key to be in (not necessarily the same as the physical state). This option is ignored for controller buttons.

**T:** Timeout (e.g. `T3`). The number of seconds to wait before timing out and returning 0. If the key or button achieves the specified state, the function will not wait for the timeout to expire. Instead, it will immediately return 1. The timeout value can be a floating point number such as 2.5, but it should not be a hexadecimal value such as 0x03.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 0 (false) if the function timed out or 1 (true) otherwise.

<a id="Remarks"></a>
## Remarks

The physical state of a key or mouse button will usually be the same as the logical state unless the keyboard and/or mouse hooks are installed, in which case it will accurately reflect whether or not the user is physically holding down the key. You can determine if your script is using the hooks via the [KeyHistory](KeyHistory.md) function or menu item. You can force either or both of the hooks to be installed by adding the [InstallKeybdHook](InstallKeybdHook.md) and [InstallMouseHook](InstallMouseHook.md) functions to the script.

While the function is in a waiting state, new [threads](../misc/Threads.md) can be launched via [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md).

To wait for two or more keys to be released, use KeyWait consecutively. For example:

```ahk
KeyWait "Control"  ; Wait for both Control and Alt to be released.
KeyWait "Alt"
```

To wait for any one key among a set of keys to be pressed down, see [InputHook example #4](InputHook.md#ExAnyKey).

Modifier key hotkeys (`Ctrl::`, `Control::`, `Alt::`, and `Shift::`), [prefix key](../Hotkeys.md#prefix) hotkeys, and [key-up](../Hotkeys.md#keyup) hotkeys fire upon release rather than press-down. So, when waiting for their trigger key within their definition, the result may differ from what is expected, especially if the timeout option is used. For example, the following code does not work as intended because KeyWait only sees the release of `Alt`, so it will never time out:

```ahk
Alt::  ; Replace this with ~Alt:: to make it work as intended.
{
    if not KeyWait("Alt", "T0.3")
        MsgBox "Held"
    else
        MsgBox "Pressed"
}
```

This code always shows "Pressed" no matter how long you hold the key. To account for this, you would need to add the [tilde prefix (~)](../Hotkeys.md#Tilde) to make the modifier key fire upon press-down instead. In other words, replace `Alt::` with `~Alt::` to make it work as intended.

<a id="Related"></a>
## Related

[GetKeyState](GetKeyState.md), [Key List](../KeyList.md), [Hotkeys](../Hotkeys.md), [InputHook](InputHook.md), [KeyHistory](KeyHistory.md), [InstallKeybdHook](InstallKeybdHook.md), [InstallMouseHook](InstallMouseHook.md), [ClipWait](ClipWait.md), [WinWait](WinWait.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Waits for `A` to be released.

```ahk
KeyWait "a"
```

<a id="ExDown"></a>

**Example:** Waits for the left mouse button to be pressed down.

```ahk
KeyWait "LButton", "D"
```

<a id="ExTimeout"></a>

**Example:** Waits up to 3 seconds for the first controller button to be pressed down.

```ahk
KeyWait "Joy1", "D T3"
```

<a id="ExLogical"></a>

**Example:** Waits for the left `Alt` to be logically released.

```ahk
KeyWait "LAlt", "L"
```

<a id="ExHotkey"></a>

**Example:** When pressing this hotkey, KeyWait waits for the user to physically release `CapsLock`. As a result, subsequent statements are performed on release instead of press. This behavior is similar to `~CapsLock up::`.

```ahk
~CapsLock::
{
    KeyWait "CapsLock"  ; Wait for user to physically release it.
    MsgBox "You pressed and released the CapsLock key."
}
```

<a id="ExRemap"></a>

**Example:** Remaps a key or mouse button. (This example is only for illustration because it would be easier to use the [built-in remapping feature](../misc/Remap.md).) In the following hotkey, the mouse button is kept held down while `NumpadAdd` is down, which effectively transforms `NumpadAdd` into a mouse button.

```ahk
*NumpadAdd::
{
    MouseClick "left",,, 1, 0, "D"  ; Hold down the left mouse button.
    KeyWait "NumpadAdd"  ; Wait for the key to be released.
    MouseClick "left",,, 1, 0, "U"  ; Release the mouse button.
}
```

<a id="ExDouble"></a>

**Example:** Detects when a key has been double-pressed (similar to double-click). KeyWait is used to stop the keyboard's auto-repeat feature from creating an unwanted double-press when you hold down the right `Ctrl` to modify another key. It does this by keeping the hotkey's thread running, which blocks the auto-repeats by relying upon [#MaxThreadsPerHotkey](_MaxThreadsPerHotkey.md) being at its default setting of 1. For a more elaborate script that distinguishes between single, double and triple-presses, see [SetTimer example #3](SetTimer.md#ExampleCount).

```ahk
~RControl::
{
    if (A_PriorHotkey != ThisHotkey or A_TimeSincePriorHotkey > 400)
    {
        ; Too much time between presses, so this isn't a double-press.
        KeyWait "RControl"
        return
    }
    MsgBox "You double-pressed the right control key."
}
```
