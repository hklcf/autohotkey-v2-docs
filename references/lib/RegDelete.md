# RegDelete

Deletes a value from the registry.

```ahk
RegDelete KeyName, ValueName
```

<a id="Parameters"></a>
## Parameters

**KeyName**

Type: [String](../Concepts.md#strings)

The full name of the registry key, e.g. `"HKLM\Software\SomeApplication"`.

This must start with HKEY_LOCAL_MACHINE (or HKLM), HKEY_USERS (or HKU), HKEY_CURRENT_USER (or HKCU), HKEY_CLASSES_ROOT (or HKCR), or HKEY_CURRENT_CONFIG (or HKCC).

To access a [remote registry](LoopReg.md#remote), prepend the computer name and a backslash, e.g. `"\\workstation01\HKLM"`.

*KeyName* can be omitted only if a [registry loop](LoopReg.md) is running, in which case it defaults to the key of the current loop item. If the item is a subkey, the full name of that subkey is used by default. If the item is a value, *ValueName* defaults to the name of that value, but can be overridden.

**ValueName**

Type: [String](../Concepts.md#strings)

If blank or omitted, the key's default value will be deleted (except as noted above), which is the value displayed as "(Default)" by RegEdit. Otherwise, specify the name of the value to delete.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

[A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

> **Warning:** Deleting from the registry is potentially dangerous - please exercise caution!

To retrieve and operate upon multiple registry keys or values, consider using a [registry loop](LoopReg.md).

Within a [registry loop](LoopReg.md), RegDelete does not necessarily delete the current loop item. If the item is a subkey, `RegDelete()` only deletes its default value.

For details about how to access the registry of a remote computer, see the remarks in [registry loop](LoopReg.md#remote).

To delete entries from the 64-bit sections of the registry in a 32-bit script or vice versa, use [SetRegView](SetRegView.md).

<a id="Related"></a>
## Related

[RegCreateKey](RegCreateKey.md), [RegDeleteKey](RegDeleteKey.md), [RegRead](RegRead.md), [RegWrite](RegWrite.md), [registry loop](LoopReg.md), [SetRegView](SetRegView.md), [IniDelete](IniDelete.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Deletes a value from the registry.

```ahk
RegDelete "HKEY_LOCAL_MACHINE\Software\SomeApplication", "TestValue"
```
