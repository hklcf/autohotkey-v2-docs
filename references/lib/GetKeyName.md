# GetKeyName

Retrieves the name/text of a key.

```ahk
Name := GetKeyName(KeyName)
```

<a id="Parameters"></a>
## Parameters

**KeyName**

Type: [String](../Concepts.md#strings)

This can be just about any single character from the keyboard or one of the key names from the [key list](../KeyList.md). Examples: B, 5, LWin, RControl, Alt, Enter, Escape.

Alternatively, this can be an explicit virtual key code such as vkFF, an explicit scan code such as sc01D, or a combination of VK and SC (in that order) such as vk1Bsc001. Note that these codes must be in hexadecimal.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the name of the specified key, or blank if the key is invalid or unnamed.

<a id="Related"></a>
## Related

[GetKeyVK](GetKeyVK.md), [GetKeySC](GetKeySC.md), [GetKeyState](GetKeyState.md), [Key List](../KeyList.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves and reports the English name of `Esc`.

```ahk
MsgBox GetKeyName("Esc") ; Shows Escape
MsgBox GetKeyName("vk1B") ; Shows also Escape
```
