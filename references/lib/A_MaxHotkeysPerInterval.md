# A_MaxHotkeysPerInterval / A_HotkeyInterval

*A_MaxHotkeysPerInterval* and *A_HotkeyInterval* are [built-in variables](../Concepts.md#built-in-variables) that control the rate of [hotkey](../Hotkeys.md) activations beyond which a warning dialog will be displayed.

*A_MaxHotkeysPerInterval* can be used to get or set an [integer](../Concepts.md#numbers) representing the maximum number of hotkeys that can be pressed within the interval without triggering a warning dialog.

*A_HotkeyInterval* can be used to get or set an [integer](../Concepts.md#numbers) representing the length of the interval in milliseconds.

The default settings are 70 (hotkeys) for *A_MaxHotkeysPerInterval* and 2000 (ms) for *A_HotkeyInterval*.

<a id="Remarks"></a>
## Remarks

These built-in variables should usually be assigned values when the script starts (if the default settings are not suitable), but the script can get or set their values at any time.

Care should be taken not to make the setting too lenient because if you ever inadvertently introduce an infinite loop of keystrokes (via a [Send](Send.md) function that accidentally triggers other hotkeys), your computer could become unresponsive due to the rapid flood of keyboard events.

As an oversimplified example, the hotkey `^c::Send "^c"` would produce an infinite loop of keystrokes. To avoid this, add the [$ prefix](../Hotkeys.md#prefixdollar) to the hotkey definition (e.g. `$^c::`) so that the hotkey cannot be triggered by the Send function.

The limit might be reached by means other than an infinite loop, such as:

- Key-repeat when the limit is too low relative to the key-repeat rate, or the system is under heavy load.
- Keyboard or mouse hardware which sends input events more rapidly than the typical key-repeat rate. For example, tilting the wheel left or right on some mice sends a rapid flood of events which may reach the limit for hotkeys such as `WheelLeft::` and `WheelRight::`.

To disable the warning dialog entirely, use `A_HotkeyInterval := 0`.

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Allows a maximum of 200 hotkeys to be pressed within 2000 ms without triggering a warning dialog.

```ahk
A_HotkeyInterval := 2000  ; This is the default value (milliseconds).
A_MaxHotkeysPerInterval := 200
```
