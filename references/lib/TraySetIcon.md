# TraySetIcon

Changes the script's [tray icon](../Program.md#tray-icon) (which is also used by [GUI](Gui.md) and dialog windows).

```ahk
TraySetIcon FileName, IconNumber, Freeze
```

<a id="Parameters"></a>
## Parameters

**FileName**

Type: [String](../Concepts.md#strings)

If omitted, the *current* tray icon is used, which is only meaningful for *Freeze*. Otherwise, specify the path to an icon or image file, a [bitmap or icon handle](../misc/ImageHandles.md) such as `"HICON:" handle`, or an asterisk (\*) to restore the script's default icon.

For a list of supported formats, see [Picture](GuiControls.md#Picture_ImageFile).

**IconNumber**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1 (the first icon group in the file). Otherwise, specify the number of the icon group to use. For example, `2` would load the default icon from the second icon group. If negative, the absolute value is assumed to be the resource ID of an icon within an executable file. If *FileName* is omitted, *IconNumber* is ignored.

**Freeze**

Type: [Boolean](../Concepts.md#boolean)

If omitted, the icon's frozen/unfrozen state remains unchanged.

If **true**, the icon is frozen, i.e. [Pause](Pause.md) and [Suspend](Suspend.md) will not change it.

If **false**, the icon is unfrozen.

<a id="Remarks"></a>
## Remarks

To freeze (or unfreeze) the *current* icon, use the function as follows: `TraySetIcon(,, true)`.

Changing the tray icon also changes the icon displayed by [InputBox](InputBox.md) and subsequently-created [GUI](Gui.md) windows. [Compiled scripts](../Scripts.md#ahk2exe) are also affected even if a custom icon was specified at the time of compiling. Note: Changing the icon will not unhide the tray icon if it was previously hidden by means such as [#NoTrayIcon](_NoTrayIcon.md); to do that, use `A_IconHidden := false`.

<a id="distort"></a>

Slight distortion may occur when loading tray icons from file types other than .ICO. This is especially true for 16x16 icons. To prevent this, store the desired tray icon inside a .ICO file.

There are some icons built into the operating system's DLLs and CPLs that might be useful. For example: `TraySetIcon "Shell32.dll", 174`.

The built-in variables **A_IconNumber** and **A_IconFile** contain the number and name (with full path) of the current icon (both are blank if the icon is the default).

The tray icon's tooltip can be changed by assigning a value to [A_IconTip](../Variables.md#IconTip).

<a id="Related"></a>
## Related

[#NoTrayIcon](_NoTrayIcon.md), [TrayTip](TrayTip.md), [Menu object](Menu.md)
