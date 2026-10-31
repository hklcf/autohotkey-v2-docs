# GetKeyVK

Retrieves the virtual key code of a key.

```ahk
VK := GetKeyVK(KeyName)
```

<a id="Parameters"></a>
## Parameters

**KeyName**

Type: [String](../Concepts.md#strings)

Any single character or one of the key names from the [key list](../KeyList.md). Examples: B, 5, LWin, RControl, Alt, Enter, Escape.

Alternatively, this can be an explicit virtual key code such as vkFF, an explicit scan code such as sc01D, or a combination of VK and SC (in that order) such as vk1Bsc001. Note that these codes must be in hexadecimal.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the virtual key code of the specified key, or 0 if the key is invalid or has no virtual key code.

<a id="Remarks"></a>
## Remarks

Before using the virtual key code with a built-in function like [Hotkey](Hotkey.md) or [GetKeyState](GetKeyState.md), it must first be converted to hexadecimal format, such as by using `Format("vk{:X}", vk_code)`. By contrast, external functions called via [DllCall](DllCall.md) typically use the numeric value directly.

If *KeyName* corresponds to a scan code or single character, the function attempts to map the value to a virtual key code by calling certain system functions which refer to the script's current keyboard layout. This may differ from the keyboard layout of the active window.

If *KeyName* is an ASCII letter in the range A-Z and has no mapping within the keyboard layout, the corresponding virtual key in the range vk41-vk5A is used as a fallback.

Some keyboard layouts do not define a 1:1 mapping of virtual key codes to scan codes. When multiple interpretations are possible, the underlying system functions most likely choose one based on the order defined in the keyboard layout, which is not always the most common or logical choice.

<a id="Related"></a>
## Related

[GetKeySC](GetKeySC.md), [GetKeyName](GetKeyName.md), [GetKeyState](GetKeyState.md), [Key List](../KeyList.md), [Format](Format.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves and reports the hexadecimal virtual key code of `Esc`.

```ahk
vk_code := GetKeyVK("Esc")
MsgBox Format("vk{:X}", vk_code) ; Reports vk1B
```
