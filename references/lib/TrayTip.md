# TrayTip

Shows a balloon message window or, on Windows 10 and later, a toast notification near the [tray icon](../Program.md#tray-icon).

```ahk
TrayTip Text, Title, Options
```

<a id="Parameters"></a>
## Parameters

**Text**

Type: [String](../Concepts.md#strings)

If blank or omitted, the text will be entirely omitted from the traytip, making it vertically shorter. Otherwise, specify the message to display. Only the first 255 characters will be displayed.

Carriage return (\`r) or linefeed (\`n) may be used to create multiple lines of text. For example: ``"Line1`nLine2"``.

If *Text* is long, it can be broken up into several shorter lines by means of a [continuation section](../Scripts.md#continuation), which might improve readability and maintainability.

**Title**

Type: [String](../Concepts.md#strings)

If blank or omitted, the title line will be entirely omitted from the traytip, making it vertically shorter. Otherwise, specify the title of the traytip. Only the first 63 characters will be displayed.

**Options**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, it defaults to 0. Otherwise, specify either an integer value (a combination by addition or bitwise-OR) or a string of zero or more case-insensitive options separated by at least one space or tab. One or more numeric options may also be included in the string.

| Function | Dec | Hex | String |
| --- | ---: | ---: | --- |
| No icon | 0 | 0x0 | N/A |
| Info icon | 1 | 0x1 | `Iconi` |
| Warning icon | 2 | 0x2 | `Icon!` |
| Error icon | 3 | 0x3 | `Iconx` |
| [Tray icon](TraySetIcon.md) | 4 | 0x4 | N/A |
| Do not play the notification sound. | 16 | 0x10 | `Mute` |
| Use the large version of the icon. | 32 | 0x20 | N/A |

The icon is also not shown by the traytip if it lacks a title (this does not apply to the toast notifications on Windows 10 and later).

On Windows 10 and later, the small tray icon is generally displayed even if the "tray icon" option (4) is omitted, and specifying this option may cause the program's name to be shown in the notification.

<a id="Hiding_the_Traytip"></a>
## Hiding the Traytip

To hide the traytip, omit all parameters (or at least the *Text* and *Title* parameters). For example:

```ahk
TrayTip
```

To hide the traytip on Windows 10, temporarily remove the [tray icon](../Program.md#tray-icon) (which not always work, according to at least one report). For example:

<a id="Hide"></a>

```ahk
TrayTip "#1", "This is TrayTip #1"
Sleep 3000   ; Let it display for 3 seconds.
HideTrayTip
TrayTip "#2", "This is the second notification."
Sleep 3000

; Copy this function into your script to use it.
HideTrayTip() {
    TrayTip  ; Attempt to hide it the normal way.
    if SubStr(A_OSVersion,1,3) = "10." {
        A_IconHidden := true
        Sleep 200  ; It may be necessary to adjust this sleep.
        A_IconHidden := false
    }
}
```

<a id="Remarks"></a>
## Remarks

On Windows 10, a traytip window usually looks like this:

![TrayTip](../static/dlg_traytip.png)

<a id="Windows10"></a>

**Windows 10 and later** replace all balloon windows with toast notifications by default (this can be overridden via group policy). Calling TrayTip multiple times will usually cause multiple notifications to be placed in a "queue" instead of each notification replacing the last.

TrayTip has no effect if the script lacks a [tray icon](../Program.md#tray-icon) (via [#NoTrayIcon](_NoTrayIcon.md) or `A_IconHidden := true`). TrayTip also has no effect if the following REG_DWORD value exists and has been set to 0:

```
HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced >> EnableBalloonTips
```

On a related note, there is a tooltip displayed whenever the user hovers the mouse over the script's [tray icon](../Program.md#tray-icon). The contents of this tooltip can be changed via: `A_IconTip := "My New Text"`.

<a id="Related"></a>
## Related

[ToolTip](ToolTip.md), [SetTimer](SetTimer.md), [Menu object](Menu.md), [MsgBox](MsgBox.md), [InputBox](InputBox.md), [FileSelect](FileSelect.md), [DirSelect](DirSelect.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Shows a multiline balloon message or toast notification for 20 seconds near the [tray icon](../Program.md#tray-icon) without playing the notification sound. It also has a title and contains an info icon.

```ahk
TrayTip "Multiline`nText", "My Title", "Iconi Mute"
```

<a id="ExDisplayTime"></a>

**Example:** Provides a more precise control over the display time without having to use Sleep (which would stop the current thread).

```ahk
TrayTip "This will be displayed for 5 seconds.", "Timed traytip"
SetTimer () => TrayTip(), -5000
```

The following does the same, but allows you to replace the HideTrayTip function definition with the one defined [above](#Hide) for Windows 10.

```ahk
TrayTip "This will be displayed for 5 seconds.", "Timed traytip"
SetTimer HideTrayTip, -5000

HideTrayTip() {
    TrayTip
}
```

<a id="ExPermanent"></a>

**Example:** Permanently displays a traytip by refreshing it periodically via timer. Note that this probably won't work well on Windows 10 and later for [reasons described above](#Windows10).

```ahk
SetTimer RefreshTrayTip, 1000
RefreshTrayTip  ; Call it once to get it started right away.

RefreshTrayTip()
{
    TrayTip "This is a more permanent traytip.", "Refreshed traytip", "Mute"
}
```

<a id="ExOnMessage"></a>

**Example:** Shows a message box whenever a traytip is left-clicked, timed out, closed, shown, queued, or disappeared. Press `F1` to test this example. For details, see [Shell_NotifyIcon (Microsoft Docs)](https://learn.microsoft.com/windows/win32/api/shellapi/nf-shellapi-shell_notifyicona).

```ahk
OnMessage 0x404, AHK_NOTIFYICON

F1::TrayTip("foo", "bar")

AHK_NOTIFYICON(wParam, lParam, msg, hwnd)
{
    if (hwnd != A_ScriptHwnd)
        return
    if (lParam = 1029) ; NIN_BALLOONUSERCLICK
        MsgBox "Traytip was left-clicked."
    if (lParam = 1028) ; NIN_BALLOONTIMEOUT
        MsgBox "Traytip timed out or was closed or right-clicked."
    if (lParam = 1026) ; NIN_BALLOONSHOW
        MsgBox "Traytip was shown or queued."
    if (lParam = 1027) ; NIN_BALLOONHIDE
        MsgBox "Traytip disappeared, but not due to timeout or user interaction."
}
```
