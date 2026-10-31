# SetRegView

Sets the registry view used by [RegRead](RegRead.md), [RegWrite](RegWrite.md), [RegDelete](RegDelete.md), [RegDeleteKey](RegDeleteKey.md) and [Loop Reg](LoopReg.md), allowing them in a 32-bit script to access the 64-bit registry view and vice versa.

```ahk
PrevRegView := SetRegView(RegView)
```

<a id="Parameters"></a>
## Parameters

**RegView**

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

Specify **32** to view the registry as a 32-bit application would, or **64** to view the registry as a 64-bit application would.

Specify the word **Default** to restore normal behavior.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the previous setting.

<a id="Remarks"></a>
## Remarks

On 64-bit systems, 32-bit applications run on a subsystem of Windows called [WOW64](https://learn.microsoft.com/windows/win32/winprog64/running-32-bit-applications). By default, the system redirects certain [registry keys](https://learn.microsoft.com/windows/win32/winprog64/shared-registry-keys) to prevent conflicts. For example, in a 32-bit script, `HKLM\SOFTWARE\AutoHotkey` is redirected to `HKLM\SOFTWARE\Wow6432Node\AutoHotkey`. SetRegView allows the registry functions in a 32-bit script to access redirected keys in the 64-bit registry view and vice versa.

This function is only useful on Windows 64-bit. It has no effect on Windows 32-bit.

The built-in variable [A_RegView](../Variables.md#RegView) contains the current setting and can also be assigned a new value instead of calling SetRegView.

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

<a id="Related"></a>
## Related

[RegRead](RegRead.md), [RegWrite](RegWrite.md), [RegCreateKey](RegCreateKey.md), [RegDelete](RegDelete.md), [RegDeleteKey](RegDeleteKey.md), [Loop Reg](LoopReg.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Shows how to set a specific registry view, and how registry redirection affects the script.

```ahk
; Access the registry as a 32-bit application would.
SetRegView 32
RegWrite "REG_SZ", "HKLM\SOFTWARE\Test.ahk", "Value", 123

; Access the registry as a 64-bit application would.
SetRegView 64
value := RegRead("HKLM\SOFTWARE\Wow6432Node\Test.ahk", "Value")
RegDelete "HKLM\SOFTWARE\Wow6432Node\Test.ahk"

MsgBox "Read value '" value "' via Wow6432Node."

; Restore the registry view to the default, which
; depends on whether the script is 32-bit or 64-bit.
SetRegView "Default"
;...
```

<a id="Ex32Or64"></a>

**Example:** Shows how to detect the type of EXE and operating system on which the script is running.

```ahk
if (A_PtrSize = 8)
    script_is := "64-bit"
else ; if (A_PtrSize = 4)
    script_is := "32-bit"

if (A_Is64bitOS)
    OS_is := "64-bit"
else
    OS_is := "32-bit, which has only a single registry view"

MsgBox "This script is " script_is ", and the OS is " OS_is "."
```
