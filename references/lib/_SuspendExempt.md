# #SuspendExempt

Exempts subsequent [hotkeys](../Hotkeys.md) and [hotstrings](../Hotstrings.md) from [suspension](Suspend.md).

```ahk
#SuspendExempt Setting
```

<a id="Parameters"></a>
## Parameters

**Setting**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If omitted, it defaults to *True*. Otherwise, specify one of the following literal values:

**True** or **1**: Enables exemption for subsequent hotkeys and hotstrings.

**False** or **0**: Disables exemption.

<a id="Remarks"></a>
## Remarks

If this directive is unspecified in the script, all hotkeys or hotstrings are disabled when the script is suspended, even those which call the [Suspend](Suspend.md) function.

Hotkeys and hotstrings can be suspended by the [Suspend](Suspend.md) function or via the [tray icon](../Program.md#tray-icon) or [main window](../Program.md#main-window).

To exempt hotkeys while the script is running, use the [Hotkey](Hotkey.md) function with the [S option](Hotkey.md#SuspendExempt), such as `Hotkey("^!c",, "S")`. To exempt hotstrings while the script is running, use the [Hotstring](Hotstring.md) function with the [S option](../Hotstrings.md#SuspendExempt), such as `Hotstring("S")`. #SuspendExempt does not affect these functions.

Like other directives, #SuspendExempt cannot be executed conditionally.

<a id="Related"></a>
## Related

[Suspend](Suspend.md), [Hotkeys](../Hotkeys.md), [Hotstrings](../Hotstrings.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** The first hotkey in this example toggles the suspension. To prevent this hotkey from being suspended after the suspension has been turned on and thus no longer being able to turn it off, it must be exempted.

```ahk
#SuspendExempt  ; Exempt the following hotkey from Suspend.
#Esc::Suspend -1
#SuspendExempt False  ; Disable exemption for any hotkeys/hotstrings below this.
^1::MsgBox "This hotkey is affected by Suspend."
```
