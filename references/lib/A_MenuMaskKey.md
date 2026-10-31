# A_MenuMaskKey

*A_MenuMaskKey* is a [built-in variable](../Concepts.md#built-in-variables) that controls which key is used to mask Win or Alt keyup events.

*A_MenuMaskKey* can be used to get or set a [string](../Concepts.md#strings) representing a vkNNscNNN sequence identifying the virtual key code (NN) and scan code (NNN), in hexadecimal. If blank, masking is disabled.

The script can also assign a [key name](../KeyList.md), [vkNN](../KeyList.md#vk) sequence or [scNNN](../KeyList.md#sc) sequence, in which case generally either the VK or SC code is left as zero until the key is sent, then determined automatically. Assigning `"vk00sc000"` disables masking and is equivalent to assigning `""`.

The returned string is always a vkNNscNNN sequence if enabled or blank if disabled, regardless of how it was assigned. All vkNNscNNN sequences and all non-zero vkNN or scNNN sequences are permitted, but some combinations may fail to suppress the menu. Any other invalid keys cause a [ValueError](Error.md#ValueError) to be thrown.

The default setting is vk11sc01D (the left Ctrl key).

<a id="Remarks"></a>
## Remarks

The mask key is sent automatically to prevent the Start menu or the active window's menu bar from activating at unexpected times.

This variable can be used to change the mask key to a key with fewer side effects. Good candidates are virtual key codes which generally have no effect, such as vkE8, which Microsoft documents as "unassigned", or vkFF, which is reserved to mean "no mapping" (a key which has no function). Some values, such as zero VK with non-zero SC, may fail to suppress the Start menu. Key codes are not required to match an existing key.

> **Note:** Microsoft can assign an effect to an unassigned key code at any time. For example, vk07 was once undefined and safe to use, but since Windows 10 1909 it is reserved for opening the game bar.

This setting is global, meaning that it needs to be specified only once to affect the behavior of the entire script.

**Hotkeys:** If a hotkey is implemented using the keyboard hook or mouse hook, the final keypress may be invisible to the active window and the system. If the system was to detect *only* a Win or Alt keydown and keyup with no intervening keypress, it would usually activate a menu. To prevent this, the keyboard or mouse hook may automatically send the mask key.

Pressing a hook hotkey causes the next Alt or Win keyup to be masked if all of the following conditions are met:

- The hotkey is suppressed (it lacks the [tilde modifier](../Hotkeys.md#Tilde)).
- `Alt` or `Win` is logically down when the hotkey is pressed.
- The modifier is physically down or the hotkey requires the modifier to activate. For example, `$#a::` in combination with `AppsKey::RWin` causes masking when `Menu`+`A` is pressed, but `Menu` on its own is able to open the Start Menu.
- `Alt` is not masked if `Ctrl` was down when the hotkey was pressed, since `Ctrl`+`Alt` does not activate the menu bar.
- `Win` is not masked if the most recent Win keydown was modified with `Ctrl`, `Shift` or `Alt`, since the Start Menu does not normally activate in those cases. However, key-repeat occurs even for `Win` if it was the last key physically pressed, so it can be hard to predict *when* the most recent Win keydown was.
- Either the keyboard hook is not installed (i.e. for a mouse hotkey), or there have been no other (unsuppressed) keydown or keyup events since the last Alt or Win keydown. Note that key-repeat occurs even for modifier keys and even after sending other keys, but only for the last physically pressed key.

Mouse hotkeys may send the mask key immediately if the keyboard hook is not installed.

Hotkeys with the [tilde modifier](../Hotkeys.md#Tilde) are not intended to block the native function of the key, so they do not cause masking. Hotkeys like `~#a::` still suppress the menu, since the system detects that `Win` has been used in combination with another key. However, mouse hotkeys and both `Win` themselves (`~LWin::` and `~RWin::`) do not suppress the Start Menu.

The Start Menu (or the active window's menu bar) can be suppressed by sending any keystroke. The following example disables the ability for the left `Win` to activate the Start Menu, while still allowing its use as a modifier:

```ahk
~LWin::Send "{Blind}{vkE8}"
```

**Send:** [Send](Send.md), [ControlSend](ControlSend.md) and related often release modifier keys as part of their normal operation. For example, the hotkey `<#a::SendText Address` usually must release the left `Win` prior to sending the contents of *Address*, and press the left `Win` back down afterward (so that other Win key combinations continue working). The mask key may be sent in such cases to prevent a Win or Alt keyup from activating a menu.

<a id="Related"></a>
## Related

See [this archived forum thread](https://www.autohotkey.com/board/topic/20619-extraneous-control-key-presses-generated-by-or-hotkeys/) for background information.

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Basic usage.

```ahk
A_MenuMaskKey := "vkE8"  ; Change the masking key to something unassigned such as vkE8.
#Space::Run A_ScriptDir  ; An additional Ctrl keystroke is not triggered.
```

<a id="ExAdvanced"></a>

**Example:** Shows in detail how this variable causes vkFF to be sent instead of LControl.

```ahk
A_MenuMaskKey := "vkFF"  ; vkFF is no mapping.
#UseHook
#Space::
!Space::
{
    KeyWait "LWin"
    KeyWait "RWin"
    KeyWait "Alt"
    KeyHistory
}
```
