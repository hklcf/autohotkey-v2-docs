# RegRead

Reads a value from the registry.

```ahk
Value := RegRead(KeyName, ValueName, Default)
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

If blank or omitted, the key's default value will be retrieved (except as noted above), which is the value displayed as "(Default)" by RegEdit. Otherwise, specify the name of the value to retrieve. If there is no default value (that is, if RegEdit displays "value not set"), an [OSError](Error.md#OSError) is thrown.

**Default**

Type: Any

If omitted, an [OSError](Error.md#OSError) is thrown instead of returning a default value. Otherwise, specify the value to return if the specified key or value does not exist.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

This function returns a value of the specified registry key.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown if there was a problem, such as a nonexistent key or value when *Default* is omitted, or a permission error.

[A_LastError](../Variables.md#LastError) is set to the result of the operating system's GetLastError() function.

<a id="Remarks"></a>
## Remarks

Currently only the following value types are supported: REG_SZ, REG_EXPAND_SZ, REG_MULTI_SZ, REG_DWORD, and REG_BINARY.

In the registry, REG_DWORD values are always expressed as positive decimal numbers. If the number was intended to be negative, convert it to a signed 32-bit integer by using `OutputVar := OutputVar << 32 >> 32` or similar.

When reading a REG_BINARY key the result is a string of hex characters. For example, the REG_BINARY value of 01,a9,ff,77 will be read as the string 01A9FF77.

When reading a REG_MULTI_SZ key, each of the components ends in a linefeed character (\`n). If there are no components, an empty string is returned. To extract the individual components from the return value, use a [parsing loop](LoopParse.md).

To retrieve and operate upon multiple registry keys or values, consider using a [registry loop](LoopReg.md).

For details about how to access the registry of a remote computer, see the remarks in [registry loop](LoopReg.md#remote).

To read and write entries from the 64-bit sections of the registry in a 32-bit script or vice versa, use [SetRegView](SetRegView.md).

<a id="Related"></a>
## Related

[RegCreateKey](RegCreateKey.md), [RegDelete](RegDelete.md), [RegDeleteKey](RegDeleteKey.md), [RegWrite](RegWrite.md), [registry loop](LoopReg.md), [SetRegView](SetRegView.md), [IniRead](IniRead.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reads a value from the registry and store it in *TestValue*.

```ahk
TestValue := RegRead("HKEY_LOCAL_MACHINE\Software\SomeApplication", "TestValue")
```

<a id="ExProgramFiles"></a>

**Example:** Retrieves and reports the path of the "Program Files" directory. See [EnvGet example #2](EnvGet.md#ExProgramFiles) for an alternative method.

```ahk
; The line below ensures that the path of the 64-bit Program Files
; directory is returned if the OS is 64-bit and the script is not.
SetRegView 64

ProgramFilesDir := RegRead("HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion", "ProgramFilesDir")
MsgBox "Program files are in: " ProgramFilesDir
```

<a id="ExType"></a>

**Example:** Retrieves the type of a registry value (e.g. REG_SZ or REG_DWORD).

```ahk
MsgBox RegKeyType("HKCU", "Environment", "TEMP")
return

RegKeyType(RootKey, SubKey, ValueName)  ; This function returns the type of the specified value.
{
    Loop Reg, RootKey "\" SubKey
        if (A_LoopRegName = ValueName)
            return A_LoopRegType
    return "Error"
}
```
