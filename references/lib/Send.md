# Send / SendText / SendEvent / SendInput / SendPlay

Sends simulated keystrokes and mouse clicks to the [active](WinActivate.md) window.

```ahk
Send Keys
SendText Keys
SendEvent Keys
SendInput Keys
SendPlay Keys
```

<a id="Parameters"></a>
## Parameters

**Keys**

Type: [String](../Concepts.md#strings)

The sequence of keys to send.

By default (that is, if neither SendText nor the [Raw mode](#Raw) or [Text mode](#Text) is used), the characters `^+!#{}` have a special meaning. The characters `^+!#` represent the modifier keys `Ctrl`, `Shift`, `Alt` and `Win`. They affect only the very next key. To send the corresponding modifier key on its own, enclose the key name in braces. To just press (hold down) or release the key, follow the key name with the word "down" or "up" as shown below.

<a id="modifierkeys"></a>

| Symbol | Key | Press | Release | Examples |
| --- | --- | --- | --- | --- |
| ^ | {Ctrl} | {Ctrl down} | {Ctrl up} | `Send "^{Home}"` presses `Ctrl`+`Home` |
| + | {Shift} | {Shift down} | {Shift up} | `Send "+abC"` sends the text "AbC"<br> `Send "!+a"` presses `Alt`+`Shift`+`A` |
| ! | {Alt} | {Alt down} | {Alt up} | `Send "!a"` presses `Alt`+`A` |
| # | {LWin}<br>{RWin} | {LWin down}<br>{RWin down} | {LWin up}<br>{RWin up} | `Send "#e"` holds down `Win` and presses `E` |

> **Note:** As capital letters are produced by sending `Shift`, `A` produces a different effect in some programs than `a`. For example, `!A` presses `Alt`+`Shift`+`A` and `!a` presses `Alt`+`A`. If in doubt, use lowercase.

The characters `{}` are used to enclose [key names and other options](#keynames), and to send special characters literally. For example, `{Tab}` is `Tab` and `{!}` is a literal exclamation mark.

Enclosing a plain ASCII letter (a-z or A-Z) in braces forces it to be sent as the corresponding virtual keycode, even if the character does not exist on the current keyboard layout. In other words, `Send "a"` produces the letter "a" while `Send "{a}"` may or may not produce "a", depending on the keyboard layout. For details, see the [remarks below](#AZ).

<a id="Send_variants"></a>

<a id="Send_Variants"></a>
## Send Variants

**Send:** Sends keystrokes via [SendInput mode](SendMode.md#Input), but can be made a synonym for SendEvent or SendPlay via [SendMode](SendMode.md).

**SendText:** Similar to Send, except that all characters in *Keys* are interpreted and sent literally. See [Text mode](#Text) for details.

<a id="SendEvent"></a>

**SendEvent:** Sends keystrokes explicitly via the traditional [SendEvent mode](SendMode.md#Event).

<a id="SendInput"></a>

**SendInput:** Sends keystrokes explicitly via [SendInput mode](SendMode.md#Input), which is faster and generally more reliable than SendEvent and SendPlay. In addition, it buffers any physical keyboard or mouse activity during the send, which prevents the user's keystrokes from being interspersed with those being sent.

<a id="SendPlay"></a>

**SendPlay:** Sends keystrokes explicitly via [SendPlay mode](SendMode.md#Play), which is faster than SendEvent and can work in cases where the other modes fail, particularly in some games or applications with unusual input handling.

<a id="Special_modes"></a>

<a id="Special_Modes"></a>
## Special Modes

The following modes affect the interpretation of the characters in *Keys* or the behavior of key-sending functions such as Send, [ControlSend](ControlSend.md) and their variants. These modes must be specified as `{x}` in *Keys*, where x is either Raw, Text, or Blind. For example, `{Raw}`.

<a id="Raw"></a>
### Raw Mode

<a id="SendRaw"></a>

The Raw mode can be enabled with `{Raw}`, which causes all subsequent characters, including the special characters `^+!#{}`, to be interpreted literally rather than translating `{Enter}` to `Enter`, `^c` to `Ctrl`+`C`, etc. For example, `Send "{Raw}{Tab}"` sends `{Tab}` instead of `Tab`.

The Raw mode does not affect the interpretation of [escape sequences](../misc/EscapeChar.md) and [expressions](../Variables.md#Expressions). For example, ```Send "{Raw}``100`%"``` sends the string `` `100% ``.

<a id="Text"></a>
### Text Mode

<a id="SendText"></a>

The Text mode can be either enabled with `{Text}`, SendText or [ControlSendText](ControlSend.md), which is similar to the Raw mode, except that no attempt is made to translate characters (other than `` `r ``, `` `n ``, `` `t `` and `` `b ``) to keycodes; instead, the [fallback method](#fallback) is used for all of the remaining characters. For SendEvent, SendInput and [ControlSend](ControlSend.md), this does improve reliability because the characters are much less dependent on correct modifier state, but it ignores any press duration set by [SetKeyDelay](SetKeyDelay.md). This mode can be combined with the Blind mode to avoid releasing any modifier keys: `Send "{Blind}{Text}your text"`. However, some applications require that the modifier keys be released.

`` `n ``, `` `r `` and `` `r`n `` are all translated to a single `Enter`, unlike the default behavior and Raw mode, which translate `` `r`n `` to two `Enter`. `` `t `` is translated to `Tab` and `` `b `` to `Backspace`, but all other characters are sent without translation.

Like the Blind mode, the Text mode ignores [SetStoreCapsLockMode](SetStoreCapsLockMode.md) (that is, the state of `CapsLock` is not changed) and does not [wait for `Win` to be released](../Hotkeys.md#win-l). This is because the Text mode typically does not depend on the state of `CapsLock` and cannot trigger the system `Win`+`L` hotkey. However, this only applies when *Keys* begins with `{Text}` or `{Blind}{Text}`.

<a id="Blind"></a>
### Blind Mode

<a id="blind"></a>

The Blind mode can be enabled with `{Blind}`, which gives the script more control by disabling a number of things that are normally done automatically to make things work as expected. `{Blind}` must be the first item in the string to enable the Blind mode. It has the following effects:

- The Blind mode avoids releasing the modifier keys (Alt, Ctrl, Shift, and Win) if they started out in the down position, unless the modifier is [excluded](#blind-exclude). For example, the hotkey `+s::Send "{Blind}abc"` would send ABC rather than abc because the user is holding down `Shift`.
- Modifier keys are restored differently to allow a Send to turn off a hotkey's modifiers even if the user is still physically holding them down. For example, `^space::Send "{Ctrl up}"` automatically pushes `Ctrl` back down if the user is still physically holding `Ctrl`, whereas `^space::Send "{Blind}{Ctrl up}"` allows `Ctrl` to be logically up even though it is physically down.
- [SetStoreCapsLockMode](SetStoreCapsLockMode.md) is ignored; that is, the state of `CapsLock` is not changed.
- [Menu masking](A_MenuMaskKey.md) is disabled. That is, Send omits the extra keystrokes that would otherwise be sent in order to prevent: 1) Start Menu appearance during Win keystrokes (LWin/RWin); 2) menu bar activation during Alt keystrokes. However, the Blind mode does not prevent masking performed by the keyboard hook following activation of a hook hotkey.
- Send does not wait for `Win` to be released even if the text contains an `L` keystroke. This would normally be done to prevent Send from triggering the system "lock workstation" hotkey (`Win`+`L`). See [Hotkeys](../Hotkeys.md#win-l) for details.

<a id="blind-exclude"></a>

The word "Blind" may be followed by one or more modifier symbols (`!#^+`) to allow those modifiers to be released automatically if needed. For example, `*^a::Send "{Blind^}b"` would send `Shift`+`B` instead of `Ctrl`+`Shift`+`B` if `Ctrl`+`Shift`+`A` was pressed. `{Blind!#^+}` allows all modifiers to be released if needed, but enables the other effects of the Blind mode.

The Blind mode is used internally when [remapping a key](../misc/Remap.md). For example, the remapping `a::b` would produce: 1) "b" when you type "a"; 2) uppercase "B" when you type uppercase "A"; and 3) `Ctrl`+`B` when you type `Ctrl`+`A`. If any modifiers are specified for the source key (including `Shift` if the source key is an uppercase letter), they are excluded as described above. For example `^a::b` produces normal `B`, not `Ctrl`+`B`.

`{Blind}` is not supported by SendText or [ControlSendText](ControlSend.md); use `{Blind}{Text}` instead.

The Blind mode is not completely supported by [SendPlay](SendMode.md#Play), especially when dealing with the modifier keys (Ctrl, Alt, Shift, and Win).

<a id="keynames"></a>
## Key Names

The following table lists the special keys that can be sent (each key name must be enclosed in braces):

| Key name | Description |
| --- | --- |
| {F1} - {F24} | Function keys. For example: {F12} is `F12`. |
| {!} | ! |
| {#} | # |
| {+} | + |
| {^} | ^ |
| {{} | { |
| {}} | } |
| {Enter} | `Enter` on the main keyboard |
| {Escape} or {Esc} | `Esc` |
| {Space} | `Space` (this is only needed for spaces that appear either at the beginning or the end of the string to be sent -- ones in the middle can be literal spaces) |
| {Tab} | `Tab` |
| {Backspace} or {BS} | `Backspace` |
| {Delete} or {Del} | `Del` |
| {Insert} or {Ins} | `Ins` |
| {Up} | `↑` (up arrow) on main keyboard |
| {Down} | `↓` (down arrow) on main keyboard |
| {Left} | `←` (left arrow) on main keyboard |
| {Right} | `→` (right arrow) on main keyboard |
| {Home} | `Home` on main keyboard |
| {End} | `End` on main keyboard |
| {PgUp} | `PgUp` on main keyboard |
| {PgDn} | `PgDn` on main keyboard |
| {CapsLock} | `CapsLock` (using [SetCapsLockState](SetNumScrollCapsLockState.md) is more reliable). Sending {CapsLock} might require `SetStoreCapsLockMode False` beforehand. |
| {ScrollLock} | `ScrollLock` (see also: [SetScrollLockState](SetNumScrollCapsLockState.md)) |
| {NumLock} | `NumLock` (see also: [SetNumLockState](SetNumScrollCapsLockState.md)) |
| {Control} or {Ctrl} | `Ctrl` (technical info: sends the neutral virtual key but the left scan code) |
| {LControl} or {LCtrl} | Left `Ctrl` (technical info: sends the left virtual key rather than the neutral one) |
| {RControl} or {RCtrl} | Right `Ctrl` |
| {Control down} or {Ctrl down} | Holds `Ctrl` down until {Ctrl up} is sent. To hold down the left or right key instead, replace Ctrl with LCtrl or RCtrl. |
| {Alt} | `Alt` (technical info: sends the neutral virtual key but the left scan code) |
| {LAlt} | Left `Alt` (technical info: sends the left virtual key rather than the neutral one) |
| {RAlt} | Right `Alt` (or `AltGr`, depending on keyboard layout) |
| {Alt down} | Holds `Alt` down until {Alt up} is sent. To hold down the left or right key instead, replace Alt with LAlt or RAlt. |
| {Shift} | `Shift` (technical info: sends the neutral virtual key but the left scan code) |
| {LShift} | Left `Shift` (technical info: sends the left virtual key rather than the neutral one) |
| {RShift} | Right `Shift` |
| {Shift down} | Holds `Shift` down until {Shift up} is sent. To hold down the left or right key instead, replace Shift with LShift or RShift. |
| {LWin} | Left `Win` |
| {RWin} | Right `Win` |
| {LWin down} | Holds the left `Win` down until {LWin up} is sent |
| {RWin down} | Holds the right `Win` down until {RWin up} is sent |
| {AppsKey} | `Menu` (invokes the right-click or context menu) |
| {Sleep} | `Sleep` |
| <a id="asc"></a>{ASC nnnnn} | Sends an `Alt`+nnnnn keypad combination, which can be used to generate special characters that don't exist on the keyboard.<br> To generate printable ASCII characters or other characters from the system's OEM (DOS) code page, specify a number between 1 and 255. `DllCall("GetOEMCP", "UInt")` returns the current OEM code page number, such as [437 (United States)](https://en.wikipedia.org/wiki/Code_page_437) or [850 (Western Europe)](https://en.wikipedia.org/wiki/Code_page_850).<br> To generate ANSI characters (standard in most languages), specify a number between 128 and 255, but precede it with a leading zero, e.g. `{Asc 0133}`. `DllCall("GetACP", "UInt")` returns the current ANSI code page number, such as [1252 (United States, Western Europe, etc.)](https://en.wikipedia.org/wiki/Windows-1252).<br> Unicode characters may be generated by specifying a number between 256 and 65535 (without a leading zero). However, this is not supported by all applications. For alternatives, see the section below. |
| <a id="Unicode"></a>{U+nnnn} | <a id="sendu"></a>Sends a Unicode character where *nnnn* is the hexadecimal value of the character excluding the 0x prefix. This typically isn't needed, because Send and ControlSend automatically support Unicode text.<br> [SendInput()](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-sendinput) or [WM_CHAR](https://learn.microsoft.com/windows/win32/inputdev/wm-char) is used to send the character and the current Send mode has no effect. Characters sent this way usually do not trigger shortcut keys or hotkeys. |
| <a id="vk"></a>{vkXX}<br> {scYYY}<br> {vkXXscYYY} | Sends a keystroke that has virtual key XX and scan code YYY. For example: `Send "{vkFFsc159}"`. If the sc or vk portion is omitted, the most appropriate value is sent in its place.<br> The values for XX and YYY are hexadecimal and can usually be determined from the [main window](../Program.md#main-window)'s View-\>[Key history](KeyHistory.md) menu item. See also: [Special Keys](../KeyList.md#SpecialKeys)<br> **Warning:** Combining vk and sc in this manner is valid only with Send. |
| {Numpad0} - {Numpad9} | Numpad digit keys (as seen when `NumLock` is ON). For example: {Numpad5} is `5`. |
| {NumpadDot} | `.` (numpad period) (as seen when `NumLock` is ON). |
| {NumpadEnter} | `Enter` on keypad |
| {NumpadMult} | `*` (numpad multiplication) |
| {NumpadDiv} | `/` (numpad division) |
| {NumpadAdd} | `+` (numpad addition) |
| {NumpadSub} | `-` (numpad subtraction) |
| {NumpadDel} | `Del` on keypad (this key and the following Numpad keys are used when `NumLock` is OFF) |
| {NumpadIns} | `Ins` on keypad |
| {NumpadClear} | Clear key on keypad (usually `5` when `NumLock` is OFF). |
| {NumpadUp} | `↑` (up arrow) on keypad |
| {NumpadDown} | `↓` (down arrow) on keypad |
| {NumpadLeft} | `←` (left arrow) on keypad |
| {NumpadRight} | `→` (right arrow) on keypad |
| {NumpadHome} | `Home` on keypad |
| {NumpadEnd} | `End` on keypad |
| {NumpadPgUp} | `PgUp` on keypad |
| {NumpadPgDn} | `PgDn` on keypad |
| {Browser_Back} | Select the browser "back" button |
| {Browser_Forward} | Select the browser "forward" button |
| {Browser_Refresh} | Select the browser "refresh" button |
| {Browser_Stop} | Select the browser "stop" button |
| {Browser_Search} | Select the browser "search" button |
| {Browser_Favorites} | Select the browser "favorites" button |
| {Browser_Home} | Launch the browser and go to the home page |
| {Volume_Mute} | Mute/unmute the master volume. Usually equivalent to `SoundSetMute -1`. |
| {Volume_Down} | Reduce the master volume. Usually equivalent to `SoundSetVolume -5`. |
| {Volume_Up} | Increase the master volume. Usually equivalent to `SoundSetVolume "+5"`. |
| {Media_Next} | Select next track in media player |
| {Media_Prev} | Select previous track in media player |
| {Media_Stop} | Stop media player |
| {Media_Play_Pause} | Play/pause media player |
| {Launch_Mail} | Launch the email application |
| {Launch_Media} | Launch media player |
| {Launch_App1} | Launch user app1 |
| {Launch_App2} | Launch user app2 |
| {PrintScreen} | `PrtSc` |
| {CtrlBreak} | `Ctrl`+`Pause` |
| {Pause} | `Pause` |
| <a id="Click"></a>{Click [Options]} | Sends a mouse click using the same options available in the [Click function](Click.md). For example, `Send "{Click}"` would click the left mouse button once at the mouse cursor's current position, and `Send "{Click 100 200}"` would click at coordinates 100, 200 (based on [CoordMode](CoordMode.md)). To move the mouse without clicking, specify 0 after the coordinates; for example: `Send "{Click 100 200 0}"`. The delay between mouse clicks is determined by [SetMouseDelay](SetMouseDelay.md) (not [SetKeyDelay](SetKeyDelay.md)). |
| <a id="mouse-buttons"></a>{WheelDown}, {WheelUp}, {WheelLeft}, {WheelRight}, {LButton}, {RButton}, {MButton}, {XButton1}, {XButton2} | Sends a mouse button event at the cursor's current position (to have control over position and other options, use [{Click}](Click.md) above). The delay between mouse clicks is determined by [SetMouseDelay](SetMouseDelay.md).<br> LButton and RButton correspond to the primary and secondary mouse buttons. Normally the primary mouse button (LButton) is on the left, but the user may swap the buttons via system settings. |
| {Blind} | Enables the [Blind mode](#blind), which gives the script more control by disabling a number of things that are normally done automatically to make things generally work as expected. `{Blind}` must occur at the beginning of the string. |
| {Raw} | Enables the [Raw mode](#SendRaw), which causes the following characters to be interpreted literally: `^+!#{}`. Although `{Raw}` need not occur at the beginning of the string, once specified, it stays in effect for the remainder of the string. |
| {Text} | Enables the [Text mode](#SendText), which sends a stream of characters rather than keystrokes. Like the Raw mode, the Text mode causes the following characters to be interpreted literally: `^+!#{}`. Although `{Text}` need not occur at the beginning of the string, once specified, it stays in effect for the remainder of the string. |

<a id="Repeating_or_Holding_Down_a_Key"></a>
## Repeating or Holding Down a Key

<a id="repeat"></a>

**To repeat a keystroke:** Enclose in braces the name of the key followed by the number of times to repeat it. For example:

```ahk
Send "{DEL 4}"  ; Presses the Delete key 4 times.
Send "{S 30}"   ; Sends 30 uppercase S characters.
Send "+{TAB 4}"  ; Presses Shift-Tab 4 times.
```

<a id="Down"></a>

**To hold down or release a key:** Enclose in braces the name of the key followed by the word **Down** or **Up**. For example:

```ahk
Send "{b down}{b up}"
Send "{TAB down}{TAB up}"
Send "{Up down}"  ; Presses down the up-arrow key.
Sleep 1000  ; Keeps it down for one second.
Send "{Up up}"  ; Releases the up-arrow key.
```

When a key is held down via the method above, it does not begin auto-repeating like it would if you were physically holding it down (this is because auto-repeat is a driver/hardware feature). However, a [Loop](Loop.md) can be used to simulate auto-repeat. The following example sends 20 tab keystrokes:

```ahk
Loop 20
{
    Send "{Tab down}"  ; Auto-repeat consists of consecutive down-events (with no up-events).
    Sleep 30  ; The number of milliseconds between keystrokes (or use SetKeyDelay).
}
Send "{Tab up}"  ; Release the key.
```

By default, Send will not automatically release a modifier key (Control, Shift, Alt, and Win) if that modifier key was "pressed down" by sending it. For example, `Send "a"` may behave similar to `Send "{Blind}{Ctrl up}a{Ctrl down}"` if the user is physically holding `Ctrl`, but `Send "{Ctrl Down}"` followed by `Send "a"` will produce `Ctrl`+`A`. *DownTemp* and *DownR* can be used to override this behavior. *DownTemp* and *DownR* have the same effect as *Down* except for the modifier keys (Control, Shift, Alt, and Win).

<a id="DownTemp"></a>

**DownTemp** tells subsequent sends that the key is not permanently down, and may be released whenever a keystroke calls for it. For example, `Send "{Control DownTemp}"` followed later by `Send "a"` would produce `A`, not `Ctrl`+`A`. Any use of Send may potentially release the modifier permanently, so *DownTemp* is not ideal for [remapping](../misc/Remap.md) modifier keys.

<a id="DownR"></a>

**DownR** (where "R" stands for [remapping](../misc/Remap.md), which is its main use) tells subsequent sends that if the key is automatically released, it should be pressed down again when send is finished. For example, `Send "{Control DownR}"` followed later by `Send "a"` would produce `A`, not `Ctrl`+`A`, but will leave `Ctrl` in the pressed state for use with keyboard shortcuts. In other words, *DownR* has an effect similar to physically pressing the key.

If a character does not correspond to a virtual key on the current keyboard layout, it cannot be "pressed" or "released". For example, `Send "{µ up}"` has no effect on most layouts, and `Send "{µ down}"` is equivalent to `Send "µ"`.

<a id="Remarks"></a>
## General Remarks

<a id="SendPlayDetail"></a>

<a id="SendInputDetail"></a>

AutoHotkey uses three methods to send simulated keystrokes and mouse clicks: [SendEvent](SendMode.md#Event), [SendInput](SendMode.md#Input), and [SendPlay](SendMode.md#Play). Each mode has different strengths and limitations, and applications may respond differently depending on how the input is generated. Understanding these differences helps in choosing the most effective mode for a particular script or target application. For details, see [Sending Modes](SendMode.md#Sending_Modes).

<a id="characters"></a>

**Characters vs. keys:** By default, characters are sent by first translating them to keystrokes. If this translation is not possible (that is, if the current keyboard layout does not contain a key or key combination which produces that character), or if the [Text mode](#Text) is in effect, the character is sent by one of following fallback methods:

<a id="fallback"></a>

- SendEvent and SendInput use [SendInput()](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-sendinput) with the [KEYEVENTF_UNICODE flag](https://learn.microsoft.com/windows/win32/api/winuser/ns-winuser-keybdinput#keyeventf_unicode). Any press duration set by [SetKeyDelay](SetKeyDelay.md) is ignored.
- SendPlay uses the [Alt+nnnnn](#asc) method, which produces Unicode only if supported by the target application.
- ControlSend posts a [WM_CHAR](https://learn.microsoft.com/windows/win32/inputdev/wm-char) message.

> **Note:** Characters sent using any of the above methods usually do not trigger keyboard shortcuts or hotkeys.

<a id="AZ"></a>

For characters in the range a-z or A-Z (plain ASCII letters), each character which does not exist in the current keyboard layout may be sent either as a character or as the corresponding virtual keycode (vk41-vk5A):

- If a naked letter is sent (that is, without modifiers or braces), or if the [Raw mode](#Raw) is in effect, it is sent as a character. For example, `Send "{Raw}Regards"` sends the expected text, even though pressing `R` (vk52) produces some other character (such as `К` on the Russian layout). `{Raw}` can be omitted in this case, unless a modifier key was put into effect by a prior Send.
- If one or more modifier keys have been put into effect by the Send function, or if the letter is wrapped in braces, it is sent as a keycode (modified with `Shift` if the letter is upper-case). This allows the script to easily activate standard keyboard shortcuts. For example, `^c` and `{Ctrl down}c{Ctrl up}` activate the standard `Ctrl`+`C` shortcut and `{c}` is equivalent to `{vk43}`.

If the letter exists in the current keyboard layout, it is always sent as whichever keycode the layout associates with that letter (unless the [Text mode](#SendText) is used, in which case the character is sent by other means). In other words, the section above is only relevant for non-Latin based layouts such as Russian.

<a id="mask"></a>

**Modifier State:** When Send is required to change the state of the `Win` or `Alt` modifier keys (such as if the user was holding one of those keys), it may inject additional keystrokes (`Ctrl` by default) to prevent the Start menu or window menu from appearing. For details, see [A_MenuMaskKey](A_MenuMaskKey.md).

**BlockInput Compared to SendInput/SendPlay:** Although the [BlockInput](BlockInput.md) function can be used to prevent any keystrokes physically typed by the user from disrupting the flow of simulated keystrokes, it is often better to use [SendInput](SendMode.md#Input) or [SendPlay](SendMode.md#Play) so that keystrokes and mouse clicks become uninterruptible. This is because unlike BlockInput, SendInput/Play does not discard what the user types during the send; instead, such keystrokes are buffered and sent afterward.

When sending a large number of keystrokes, a [continuation section](../Scripts.md#continuation) can be used to improve readability and maintainability.

Since the operating system does not allow simulation of the `Ctrl`+`Alt`+`Del` combination, doing something like `Send "^!{Delete}"` will have no effect.

**Send may have no effect** if the active window is running with administrative privileges and the script is not. This is due to a security mechanism called User Interface Privilege Isolation.

<a id="Related"></a>
## Related

[SendMode](SendMode.md), [SetKeyDelay](SetKeyDelay.md), [SetStoreCapsLockMode](SetStoreCapsLockMode.md), [Escape sequences (e.g. \`n)](../misc/EscapeChar.md), [ControlSend](ControlSend.md), [BlockInput](BlockInput.md), [Hotstrings](../Hotstrings.md), [WinActivate](WinActivate.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Types a two-line signature.

```ahk
Send "Sincerely,{enter}John Smith"
```

<a id="ExModifier"></a>

**Example:** Selects the File-\>Save menu (Alt+F followed by S).

```ahk
Send "!fs"
```

<a id="ExBrace"></a>

**Example:** Jumps to the end of the text then send four shift+left-arrow keystrokes.

```ahk
Send "{End}+{Left 4}"
```

<a id="ExSendInputRaw"></a>

**Example:** Sends a long series of [raw characters](#Raw) via the fastest method ([SendInput](SendMode.md#Input) which is the default).

```ahk
SendInput "{Raw}A long series of raw characters sent via the fastest method."
```

<a id="ExVar"></a>

**Example:** Holds down a key contained in a [variable](../Variables.md).

```ahk
MyKey := "Shift"
Send "{" MyKey " down}"  ; Holds down the Shift key.
```
