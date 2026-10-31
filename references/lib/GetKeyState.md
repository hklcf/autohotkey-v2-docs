# GetKeyState

Returns 1 (true) or 0 (false) depending on whether the specified keyboard key or mouse/controller button is down or up. Also retrieves controller status.

```ahk
IsDown := GetKeyState(KeyName , Mode)
```

<a id="Parameters"></a>
## Parameters

**KeyName**

Type: [String](../Concepts.md#strings)

This can be just about any single character from the keyboard or one of the key names from the [key list](../KeyList.md), such as a mouse/controller button. Examples: B, 5, LWin, RControl, Alt, Enter, Escape, LButton, MButton, Joy1.

Alternatively, an explicit virtual key code such as vkFF may be specified. This is useful in the rare case where a key has no name. The code of such a key can be determined by following the steps at the bottom of the [key list page](../KeyList.md#SpecialKeys). Note that this code must be in hexadecimal.

**Known limitation:** This function cannot differentiate between two keys which share the same virtual key code, such as Left and NumpadLeft.

**Mode**

Type: [String](../Concepts.md#strings)

This parameter is ignored when retrieving controller status.

If omitted, it defaults to that which retrieves the logical state of the key. This is the state that the OS and the active window believe the key to be in, but is not necessarily the same as the physical state.

Otherwise, specify one of the following letters:

**P:** Retrieve the physical state (i.e. whether the user is physically holding it down). The physical state of a key or mouse button will usually be the same as the logical state unless the keyboard and/or mouse hooks are installed, in which case it will accurately reflect whether or not the user is physically holding down the key or button (as long as it was pressed down while the keyboard hook was installed). You can determine if your script is using the hooks via the [KeyHistory](KeyHistory.md) function or menu item. You can force the hooks to be installed by calling [InstallKeybdHook](InstallKeybdHook.md) and/or [InstallMouseHook](InstallMouseHook.md).

**T:** Retrieve the toggle state. For keys other than `CapsLock`, `NumLock` and `ScrollLock`, the toggle state is generally 0 when the script starts and is not synchronized between processes.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean), [Float](../Concepts.md#numbers), [Integer](../Concepts.md#numbers) or [String (empty)](../Concepts.md#nothing)

This function returns 1 (true) if the key is down (or toggled on) or 0 (false) if it is up (or toggled off).

When *KeyName* is a stick axis such as JoyX, this function returns a floating-point number between 0 and 100 to indicate the stick's position as a percentage of that axis's range of motion. This [test script](../scripts/index.md#ControllerTest) can be used to analyze your controller(s).

When *KeyName* is JoyPOV, this function returns an integer between 0 and 35900. The following approximate POV values are used by many controllers:

- -1: no angle to report
- 0: forward POV
- 9000 (i.e. 90 degrees): right POV
- 27000 (i.e. 270 degrees): left POV
- 18000 (i.e. 180 degrees): backward POV

When *KeyName* is JoyName, JoyButtons, JoyAxes or JoyInfo, the retrieved value will be the name, number of buttons, number of axes or capabilities of the controller. For details, see [Game Controller](../KeyList.md#Controller).

When *KeyName* is a button or control of a controller that could not be detected, this function returns an empty string.

<a id="Error_Handling"></a>
## Error Handling

A [ValueError](Error.md#ValueError) is thrown if invalid parameters are detected, e.g. when *KeyName* does not exist on the current keyboard layout.

<a id="Remarks"></a>
## Remarks

To wait for a key or mouse/controller button to achieve a new state, it is usually easier to use [KeyWait](KeyWait.md) instead of a GetKeyState loop.

Systems with unusual keyboard drivers might be slow to update the state of their keys, especially the toggle-state of keys like `CapsLock`. A script that checks the state of such a key immediately after it changed may use [Sleep](Sleep.md) beforehand to give the system time to update the key state.

For examples of using GetKeyState with a controller, see the [controller remapping page](../misc/RemapController.md) and the [Controller-To-Mouse script](../scripts/index.md#ControllerMouse).

<a id="Related"></a>
## Related

[GetKeyVK](GetKeyVK.md), [GetKeySC](GetKeySC.md), [GetKeyName](GetKeyName.md), [KeyWait](KeyWait.md), [Key List](../KeyList.md), [Controller remapping](../misc/RemapController.md), [KeyHistory](KeyHistory.md), [InstallKeybdHook](InstallKeybdHook.md), [InstallMouseHook](InstallMouseHook.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves the current state of the right mouse button.

```ahk
state := GetKeyState("RButton")
```

<a id="ExBasic2"></a>

**Example:** Retrieves the current state of the first controller's second button.

```ahk
state := GetKeyState("Joy2")
```

<a id="ExIfElse"></a>

**Example:** Checks if at least one `Shift` is down.

```ahk
if GetKeyState("Shift")
    MsgBox "At least one Shift key is down."
else
    MsgBox "Neither Shift key is down."
```

<a id="ExToggle"></a>

**Example:** Retrieves the current toggle state of `CapsLock`.

```ahk
state := GetKeyState("CapsLock", "T")
```

<a id="ExRemap"></a>

**Example:** Remapping. (This example is only for illustration because it would be easier to use the [built-in remapping feature](../misc/Remap.md).) In the following hotkey, the mouse button is kept held down while NumpadAdd is down, which effectively transforms NumpadAdd into a mouse button. This method can also be used to repeat an action while the user is holding down a key or button.

```ahk
*NumpadAdd::
{
    MouseClick "left",,, 1, 0, "D"  ; Hold down the left mouse button.
    Loop
    {
        Sleep 10
        if !GetKeyState("NumpadAdd", "P")  ; The key has been released, so break out of the loop.
            break
        ; ... insert here any other actions you want repeated.
    }
    MouseClick "left",,, 1, 0, "U"  ; Release the mouse button.
}
```

<a id="ExController"></a>

**Example:** Makes controller button behavior depend on stick axis position.

```ahk
joy2::
{
    JoyX := GetKeyState("JoyX")
    if JoyX > 75
        MsgBox "Action #1 (button pressed while stick was pushed to the right)."
    else if JoyX < 25
        MsgBox "Action #2 (button pressed while stick was pushed to the left)."
    else
        MsgBox "Action #3 (button pressed while stick was centered horizontally)."
}
```

See the [controller remapping page](../misc/RemapController.md) and the [Controller-To-Mouse script](../scripts/index.md#ControllerMouse) for other examples.
