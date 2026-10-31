# SetStoreCapsLockMode

Whether to restore the state of the CapsLock key after sending simulated keystrokes.

```ahk
PrevSetting := SetStoreCapsLockMode(Setting)
```

<a id="Parameters"></a>
## Parameters

**Setting**

Type: [Boolean](../Concepts.md#boolean)

If **true**, CapsLock state restoration is enabled, meaning the CapsLock key will be restored to its former state if key-sending functions such as [Send](Send.md) or [ControlSend](ControlSend.md) needed to change it temporarily for its operation.

If **false**, CapsLock state restoration is disabled, meaning the state of the CapsLock key is not changed at all. As a result, key-sending functions will invert the case of the characters if the CapsLock key happens to be on during the operation.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns the previous setting; either 0 (false) for disabled or 1 (true) for enabled.

<a id="Remarks"></a>
## Remarks

By default, CapsLock state restoration is enabled. However, this does not guarantee that the CapsLock key will be turned off before sending keystrokes, nor that its previous state will be restored afterward.

SetStoreCapsLockMode is rarely used because the default behavior is best in most cases.

SetStoreCapsLockMode is ignored by [Blind mode](Send.md#blind) and [Text mode](Send.md#SendText); that is, the state of the CapsLock key is not changed in those cases.

The built-in variable [A_StoreCapsLockMode](../Variables.md#StoreCapsLockMode) contains the current setting and can also be assigned a new value instead of calling SetStoreCapsLockMode.

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

<a id="Related"></a>
## Related

[SetCaps/Num/ScrollLockState](SetNumScrollCapsLockState.md), [Send](Send.md), [ControlSend](ControlSend.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Causes the state of the CapsLock key not to be changed at all.

```ahk
SetStoreCapsLockMode False
```
