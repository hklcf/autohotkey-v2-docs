# SetCapsLockState / SetNumLockState / SetScrollLockState

Sets the state of the CapsLock, NumLock, or ScrollLock key. Can also force the key to stay on or off.

```ahk
SetCapsLockState State
SetNumLockState State
SetScrollLockState State
```

<a id="Parameters"></a>
## Parameters

**State**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, the AlwaysOn/Off attribute of the key is removed (if present). Otherwise, specify one of the following values:

**On** or 1 ([true](../Variables.md#True)): Turns on the key and removes the AlwaysOn/Off attribute of the key (if present).

**Off** or 0 ([false](../Variables.md#False)): Turns off the key and removes the AlwaysOn/Off attribute of the key (if present).

**AlwaysOn:** Forces the key to stay on permanently.

**AlwaysOff:** Forces the key to stay off permanently.

<a id="Remarks"></a>
## Remarks

Alternatively to [example #3](#ExToggle) below, a key can also be toggled to its opposite state via the [Send](Send.md) function, e.g. `Send "{CapsLock}"`. However, sending {CapsLock} might require `SetStoreCapsLockMode False` beforehand.

Keeping a key *AlwaysOn* or *AlwaysOff* requires the [keyboard hook](InstallKeybdHook.md), which will be automatically installed in such cases.

<a id="Related"></a>
## Related

[SetStoreCapsLockMode](SetStoreCapsLockMode.md), [GetKeyState](GetKeyState.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Turns on the NumLock key and removes the AlwaysOn/Off attribute of the key (if present).

```ahk
SetNumLockState True
```

<a id="ExAlwaysOff"></a>

**Example:** Forces the ScrollLock key to stay off permanently.

```ahk
SetScrollLockState "AlwaysOff"
```

<a id="ExToggle"></a>

**Example:** Toggles the CapsLock key to its opposite state.

```ahk
SetCapsLockState !GetKeyState("CapsLock", "T")
```
