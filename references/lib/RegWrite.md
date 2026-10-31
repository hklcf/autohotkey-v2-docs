# RegWrite

Writes a value to the registry.

```ahk
RegWrite Value, ValueType, KeyName , ValueName
RegWrite Value , ValueType, , ValueName
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

The value to be written. Long text values can be broken up into several shorter lines by means of a [continuation section](../Scripts.md#continuation), which might improve readability and maintainability.

**ValueType**

Type: [String](../Concepts.md#strings)

Must be either REG_SZ, REG_EXPAND_SZ, REG_MULTI_SZ, REG_DWORD, or REG_BINARY.

*ValueType* can be omitted only if *KeyName* is omitted and the current [registry loop](LoopReg.md) item is a value, as noted below.

**KeyName**

Type: [String](../Concepts.md#strings)

The full name of the registry key, e.g. `"HKLM\Software\SomeApplication"`.

This must start with HKEY_LOCAL_MACHINE (or HKLM), HKEY_USERS (or HKU), HKEY_CURRENT_USER (or HKCU), HKEY_CLASSES_ROOT (or HKCR), or HKEY_CURRENT_CONFIG (or HKCC).

To access a [remote registry](LoopReg.md#remote), prepend the computer name and a backslash, e.g. `"\\workstation01\HKLM"`.

*KeyName* can be omitted only if a [registry loop](LoopReg.md) is running, in which case it defaults to the key of the current loop item. If the item is a subkey, the full name of that subkey is used by default. If the item is a value, *ValueType* and *ValueName* default to the type and name of that value, but can be overridden.

**ValueName**

Type: [String](../Concepts.md#strings)

If blank or omitted, the key's default value will be used (except as noted above), which is the value displayed as "(Default)" by RegEdit. Otherwise, specify the name of the value that will be written to.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

[A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

If *KeyName* specifies a subkey which does not exist, RegWrite attempts to create it (along with its ancestors, if necessary). Although RegWrite can write directly into a root key, some operating systems might refuse to write into HKEY_CURRENT_USER's top level.

To create a key without writing any values to it, use [RegCreateKey](RegCreateKey.md).

If *ValueType* is REG_DWORD, *Value* should be between -2147483648 and 4294967295 (0xFFFFFFFF). In the registry, REG_DWORD values are always expressed as positive decimal numbers. To read it as a negative number with means such as [RegRead](RegRead.md), convert it to a signed 32-bit integer by using `OutputVar := OutputVar << 32 >> 32` or similar.

When writing a REG_BINARY key, use a string of hex characters, e.g. the REG_BINARY value of 01,a9,ff,77 can be written by using the string 01A9FF77.

When writing a REG_MULTI_SZ key, you must separate each component from the next with a linefeed character (\`n). The last component may optionally end with a linefeed as well. No blank components are allowed. In other words, do not specify two linefeeds in a row (\`n\`n) because that will result in a shorter-than-expected value being written to the registry.

To retrieve and operate upon multiple registry keys or values, consider using a [registry loop](LoopReg.md).

For details about how to access the registry of a remote computer, see the remarks in [registry loop](LoopReg.md#remote).

To read and write entries from the 64-bit sections of the registry in a 32-bit script or vice versa, use [SetRegView](SetRegView.md).

<a id="Related"></a>
## Related

[RegCreateKey](RegCreateKey.md), [RegDelete](RegDelete.md), [RegDeleteKey](RegDeleteKey.md), [RegRead](RegRead.md), [registry loop](LoopReg.md), [SetRegView](SetRegView.md), [IniWrite](IniWrite.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Writes a string to the registry.

```ahk
RegWrite "Test Value", "REG_SZ", "HKEY_LOCAL_MACHINE\SOFTWARE\TestKey", "MyValueName"
```

<a id="ExBinary"></a>

**Example:** Writes binary data to the registry.

```ahk
RegWrite "01A9FF77", "REG_BINARY", "HKEY_CURRENT_USER\Software\TEST_APP", "TEST_NAME"
```

<a id="ExMulti"></a>

**Example:** Writes a multi-line string to the registry.

```ahk
RegWrite "Line1`nLine2", "REG_MULTI_SZ", "HKEY_CURRENT_USER\Software\TEST_APP", "TEST_NAME"
```
