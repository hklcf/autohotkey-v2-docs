# Hotkeys (Mouse, Controller and Keyboard Shortcuts)

<a id="toc"></a>
## Table of Contents

- [Introduction and Simple Examples](#Intro)
- [Hotkey Modifier Symbols](#Symbols)
- [Context-sensitive Hotkeys](#Context)
- [Custom Combinations](#combo)
- [Other Features](#Features)
- [Mouse Wheel Hotkeys](#Wheel)
- [Hotkey Tips and Remarks](#Remarks)
- [Alt-Tab Hotkeys](#alttab)
- [Named Function Hotkeys](#Function)

<a id="Intro"></a>
## Introduction and Simple Examples

Hotkeys are sometimes referred to as shortcut keys because of their ability to easily trigger an action (such as launching a program or [keyboard macro](misc/Macros.md)). In the following example, the hotkey `Win`+`N` is configured to launch Notepad. The pound sign [#] stands for `Win`, which is known as a *modifier key*:

```ahk
#n::
{
    Run "notepad"
}
```

In the above, the braces serve to define a [function body](Functions.md) for the hotkey. The opening brace may also be specified on the same line as the double-colon to support the [OTB (One True Brace) style](lib/Block.md#otb). However, if a hotkey needs to execute only a single line, that line can be listed to the right of the double-colon. In other words, the braces are implicit:

```ahk
#n::Run "notepad"
```

<a id="ThisHotkey"></a>

When a hotkey is triggered, the name of the hotkey is passed as its first parameter named `ThisHotkey` (which excludes the trailing colons). For example:

```ahk
#n::MsgBox ThisHotkey  ; Reports #n
```

With few exceptions, this is similar to the built-in variable [A_ThisHotkey](Variables.md#ThisHotkey). The parameter name can be changed by using a [named function](#Function).

To use more than one modifier with a hotkey, list them consecutively (the order does not matter). The following example uses `^!s` to indicate `Ctrl`+`Alt`+`S`:

```ahk
^!s::
{
    Send "Sincerely,{enter}John Smith"  ; This line sends keystrokes to the active (foremost) window.
}
```

<a id="Symbols"></a>
## Hotkey Modifier Symbols

You can use the following modifier symbols to define hotkeys:

| Symbol | Description |
| :---: | --- |
| # | `Win` (Windows logo key).<br> <a id="win-l"></a>Hotkeys that include `Win` (e.g. #a) will wait for `Win` to be released before sending any text containing an `L` keystroke. This prevents usages of [Send](lib/Send.md) within such a hotkey from locking the PC. This behavior applies to all sending modes except [SendPlay](lib/SendMode.md#Play) (which doesn't need it), [Blind mode](lib/Send.md#blind) and [Text mode](lib/Send.md#SendText).<br> **Note:** Pressing a hotkey which includes `Win` may result in extra simulated keystrokes (`Ctrl` by default). See [A_MenuMaskKey](lib/A_MenuMaskKey.md). |
| ! | `Alt`<br> **Note:** Pressing a hotkey which includes `Alt` may result in extra simulated keystrokes (`Ctrl` by default). See [A_MenuMaskKey](lib/A_MenuMaskKey.md). |
| ^ | `Ctrl` |
| + | `Shift` |
| & | An ampersand may be used between any two keys or mouse buttons to combine them into a custom hotkey. See [below](#combo) for details. |
| <a id="LeftRight"></a>\< | Use the left key of the pair. e.g. \<!a is the same as !a except that only the left `Alt` will trigger it. |
| \> | Use the right key of the pair. |
| <a id="AltGr"></a>\<^\>! | `AltGr` ([alternate graph, or alternate graphic](https://en.wikipedia.org/wiki/AltGr_key)). If your keyboard layout has `AltGr` instead of a right `Alt` key, this series of symbols can usually be used to stand for `AltGr`. For example:<br> <code>\<^\>!m::MsgBox "You pressed AltGr+m."<br>\<^\<!m::MsgBox "You pressed LeftControl+LeftAlt+m."</code> Alternatively, to make `AltGr` itself into a hotkey, use the following hotkey (without any hotkeys like the above present):<br> <code>LControl & RAlt::MsgBox "You pressed AltGr itself."</code> |
| <a id="wildcard"></a>\* | Wildcard: Fire the hotkey even if extra modifiers are being held down. This is often used in conjunction with [remapping](misc/Remap.md) keys or buttons. For example:<br> <code>\*#c::Run "calc.exe" ; Win+C, Shift+Win+C, Ctrl+Win+C, etc. will all trigger this hotkey.<br>\*ScrollLock::Run "notepad" ; Pressing ScrollLock will trigger this hotkey even when modifier key(s) are down.</code> Wildcard hotkeys always use the keyboard hook, as do any hotkeys eclipsed by a wildcard hotkey. For example, the presence of `*a::` would cause `^a::` to always use the hook. |
| <a id="Tilde"></a>~ | When the hotkey fires, its key's native function will not be blocked (hidden from the system). In both of the below examples, the user's click of the mouse button will be sent to the active window:<br> <code>~RButton::MsgBox "You clicked the right mouse button."<br>~RButton & C::MsgBox "You pressed C while holding down the right mouse button."</code> Unlike the other prefix symbols, the tilde prefix is allowed to be present on some of a hotkey's [variants](lib/_HotIf.md#variant) but absent on others. However, if a tilde is applied to the [prefix key](#prefix) of any custom combination which has not been turned off or suspended, it affects the behavior of that prefix key for *all* combinations.<br> Special hotkeys that are substitutes for [alt-tab](#alttab) always ignore the tilde prefix.<br> If the tilde prefix is applied to a hotkey consisting only of a named modifier key without an L or R prefix (`Control`/`Ctrl`, `Alt`, or `Shift`), that hotkey will fire when the key is pressed instead of being delayed until the key is released. For example, `~Alt::`, `~LAlt::`, and `LAlt::` are fired as soon as the key is pressed, while `Alt::` is fired upon release of the key. Hotkeys consisting of any other key are fired as soon as the key is pressed, regardless of whether the tilde prefix is used.<br> If the tilde prefix is applied to a custom modifier key ([prefix key](#prefix)) which is also used as its own hotkey, that hotkey will fire when the key is pressed instead of being delayed until the key is released. For example, the `~RButton::` hotkey above is fired as soon as the button is pressed.<br> If the tilde prefix is applied only to the custom combination and not the non-combination hotkey, the key's native function will still be blocked. For example, in the script below, holding AppsKey will show the tooltip and will not trigger a context menu:<br> <code>AppsKey::ToolTip "Press \< or \> to cycle through windows."<br>AppsKey Up::ToolTip<br>~AppsKey & \<::Send "!+{Esc}"<br>~AppsKey & \>::Send "!{Esc}"</code> If at least one variant of a keyboard hotkey has the tilde modifier, that hotkey always uses the keyboard hook. |
| <a id="prefixdollar"></a>$ | This is usually only necessary if the script uses the [Send](lib/Send.md) function to send the keys that comprise the hotkey itself, which might otherwise cause it to trigger itself. The $ prefix forces the [keyboard hook](lib/InstallKeybdHook.md) to be used to implement this hotkey, which as a side-effect prevents the [Send](lib/Send.md) function from triggering it. The $ prefix is equivalent to having specified `#UseHook` somewhere above the definition of this hotkey.<br> The $ prefix has no effect for mouse hotkeys, since they always use the mouse hook. It also has no effect for hotkeys which already require the keyboard hook, including any keyboard hotkeys with the [tilde (~)](#Tilde) or [wildcard (\*)](#wildcard) modifiers, key-up hotkeys and custom combinations. To determine whether a particular hotkey uses the keyboard hook, use [ListHotkeys](lib/ListHotkeys.md).<br> [#InputLevel](lib/_InputLevel.md) and [SendLevel](lib/SendLevel.md) provide additional control over which hotkeys and hotstrings are triggered by the Send function. |
| <a id="keyup"></a>UP | The word UP may follow the name of a hotkey to cause the hotkey to fire upon release of the key rather than when the key is pressed down. The following example [remaps](misc/Remap.md) the left `Win` to become the left `Ctrl`:<br> <code>\*LWin::Send "{LControl down}"<br>\*LWin Up::Send "{LControl up}"<br></code> "Up" can also be used with normal hotkeys as in this example: `^!r Up::MsgBox "You pressed and released Ctrl+Alt+R"`. It also works with [combination hotkeys](#combo) (e.g. `F1 & e Up::`)<br> Limitations: 1) "Up" does not work with [controller buttons](KeyList.md#Controller); and 2) An "Up" hotkey without a normal/down counterpart hotkey will completely take over that key to prevent it from getting stuck down. One way to prevent this is to add a [tilde prefix](#Tilde) (e.g. `~LControl up::`)<br> "Up" hotkeys and their key-down counterparts (if any) always use the keyboard hook.<br> On a related note, a technique similar to the above is to make a hotkey into a prefix key. The advantage is that although the hotkey will fire upon release, it will do so only if you did not press any other key while it was held down. For example:<br> <code>LControl & F1::return ; Make left-control a prefix by using it in front of "&" at least once.<br>LControl::MsgBox "You released LControl without having used it to modify any other key."</code> |

> **Note:** See the [Key List](KeyList.md) for a complete list of keyboard keys and mouse/controller buttons.

Multiple hotkeys can be stacked vertically to have them perform the same action. For example:

```ahk
^Numpad0::
^Numpad1::
{
    MsgBox "Pressing either Ctrl+Numpad0 or Ctrl+Numpad1 will display this."
}
```

A key or key-combination can be disabled for the entire system by having it do nothing. The following example disables the right-side `Win`:

```ahk
RWin::return
```

<a id="Context"></a>
## Context-sensitive Hotkeys

The [#HotIf](lib/_HotIf.md) directive can be used to make a hotkey perform a different action (or none at all) depending on a specific condition. For example:

```ahk
#HotIf WinActive("ahk_class Notepad")
^a::MsgBox "You pressed Ctrl-A while Notepad is active. Pressing Ctrl-A in any other window will pass the Ctrl-A keystroke to that window."
#c::MsgBox "You pressed Win-C while Notepad is active."

#HotIf
#c::MsgBox "You pressed Win-C while any window except Notepad is active."

#HotIf MouseIsOver("ahk_class Shell_TrayWnd") ; For MouseIsOver, see #HotIf example 1.
WheelUp::Send "{Volume_Up}"     ; Wheel over taskbar: increase/decrease volume.
WheelDown::Send "{Volume_Down}" ;
```

<a id="combo"></a>
## Custom Combinations

Normally shortcut key combinations consist of optional prefix/modifier keys (Ctrl, Alt, Shift and LWin/RWin) and a single suffix key. The standard modifier keys are designed to be used in this manner, so normally have no immediate effect when pressed down.

A custom combination of two keys (including mouse but not controller buttons) can be defined by using " & " between them. Because they are intended for use with prefix keys that are not normally used as such, custom combinations have the following special behavior:

- The prefix key loses its native function, unless it is a standard modifier key or toggleable key such as `CapsLock`.
- If a hotkey would be activated by pressing the prefix key on its own, by default the hotkey is fired upon release, and is not fired at all if another key is pressed. For example, `F1 & F2::` causes `*F1::` or `F1::1` (a [remapping](misc/Remap.md)) to fire upon release, except when activated by a combination like `Ctrl`+`F1`. If there is both a key-down hotkey and a [key-up](#keyup) hotkey, both hotkeys are fired at once. The fire-on-release effect is disabled if the [tilde prefix](#Tilde) is applied to the prefix key in at least one active custom combination or the suffix hotkey itself.

> **Note:** For combinations with standard modifier keys, it is usually better to use the standard syntax. For example, use `<+s::` rather than `LShift & s::`.

In the below example, you would hold down Numpad0 then press the second key to trigger the hotkey:

<a id="prefix"></a>

```ahk
Numpad0 & Numpad1::MsgBox "You pressed Numpad1 while holding down Numpad0."
Numpad0 & Numpad2::Run "Notepad"
```

**The prefix key loses its native function:** In the above example, Numpad0 becomes a *prefix key*; but this also causes Numpad0 to lose its original/native function when it is pressed by itself. To avoid this, a script may configure Numpad0 to perform a new action such as one of the following:

```ahk
Numpad0::WinMaximize "A"   ; Maximize the active/foreground window.
Numpad0::Send "{Numpad0}"  ; Make the release of Numpad0 produce a Numpad0 keystroke. See comment below.
```

**Fire on release:** The presence of one of the above custom combination hotkeys causes the *release* of Numpad0 to perform the indicated action, but only if you did not press any other keys while Numpad0 was being held down. This behavior can be avoided by applying the [tilde prefix](#Tilde) to either hotkey.

<a id="combo_mods"></a>

**Modifiers:** Unlike a normal hotkey, custom combinations act as though they have the [wildcard (\*)](#wildcard) modifier by default. For example, `1 & 2::` will activate even if `Ctrl` or `Alt` is held down when `1` and `2` are pressed, whereas `^1::` would be activated only by `Ctrl`+`1` and not `Ctrl`+`Alt`+`1`.

Combinations of three or more keys are not supported. Combinations which your keyboard hardware supports can usually be detected by using [#HotIf](lib/_HotIf.md) and [GetKeyState](lib/GetKeyState.md), but the results may be inconsistent. For example:

```ahk
; Press AppsKey and Alt in any order, then slash (/).
#HotIf GetKeyState("AppsKey", "P")
Alt & /::MsgBox "Hotkey activated."

; If the keys are swapped, Alt must be pressed first (use one at a time):
#HotIf GetKeyState("Alt", "P")
AppsKey & /::MsgBox "Hotkey activated."

; [ & ] & \::
#HotIf GetKeyState("[") && GetKeyState("]")
\::MsgBox
```

**Keyboard hook:** Custom combinations involving keyboard keys always use the keyboard hook, as do any hotkeys which use the prefix key as a suffix. For example, `a & b::` causes `^a::` to always use the hook.

<a id="Features"></a>
## Other Features

**NumLock, CapsLock, and ScrollLock:** These keys may be forced to be "AlwaysOn" or "AlwaysOff". For example: `SetNumLockState "AlwaysOn"`.

**Overriding Explorer's hotkeys:** Windows' built-in hotkeys such as `Win`+`E` (#e) and `Win`+`R` (#r) can be individually overridden simply by assigning them to an action in the script. See the [override page](misc/Override.md) for details.

**Substitutes for Alt-Tab:** Hotkeys can provide an alternate means of alt-tabbing. For example, the following two hotkeys allow you to alt-tab with your right hand:

```ahk
RControl & RShift::AltTab  ; Hold down right-control then press right-shift repeatedly to move forward.
RControl & Enter::ShiftAltTab  ; Without even having to release right-control, press Enter to reverse direction.
```

For more details, see [Alt-Tab](#alttab).

<a id="Wheel"></a>
## Mouse Wheel Hotkeys

Hotkeys that fire upon turning the mouse wheel are supported via the key names WheelDown and WheelUp. Here are some examples of mouse wheel hotkeys:

```ahk
MButton & WheelDown::MsgBox "You turned the mouse wheel down while holding down the middle button."
^!WheelUp::MsgBox "You rotated the wheel up while holding down Control+Alt."
```

<a id="HWheel"></a>

If the mouse supports it, horizontal scrolling can be detected via the key names WheelLeft and WheelRight. Some mice have a single wheel which can be scrolled up and down or tilted left and right. Generally in those cases, WheelLeft or WheelRight signals are sent repeatedly while the wheel is held to one side, to simulate continuous scrolling. This typically causes the hotkeys to execute repeatedly.

The built-in variable **A_EventInfo** contains the amount by which the wheel was turned, which is typically 120. However, A_EventInfo can be greater or less than 120 under the following circumstances:

- If the mouse hardware reports distances of less than one notch, A_EventInfo may be less than 120;
- If the wheel is being turned quickly (depending on the type of mouse), A_EventInfo may be greater than 120. A hotkey like the following can help analyze your mouse: `~WheelDown::ToolTip A_EventInfo`

Some of the most useful hotkeys for the mouse wheel involve alternate modes of scrolling a window's text. For example, the following pair of hotkeys scrolls horizontally instead of vertically when you turn the wheel while holding down the left `Ctrl`:

```ahk
~LControl & WheelUp::  ; Scroll left.
{
    Loop 2  ; <-- Increase this value to scroll faster.
        SendMessage 0x0114, 0, 0, ControlGetFocus("A")  ; 0x0114 is WM_HSCROLL and the 0 after it is SB_LINELEFT.
}

~LControl & WheelDown::  ; Scroll right.
{
    Loop 2  ; <-- Increase this value to scroll faster.
        SendMessage 0x0114, 1, 0, ControlGetFocus("A")  ; 0x0114 is WM_HSCROLL and the 1 after it is SB_LINERIGHT.
}
```

Finally, since mouse wheel hotkeys generate only down-events (never up-events), they cannot be used as [key-up hotkeys](#keyup).

<a id="Remarks"></a>
## Hotkey Tips and Remarks

Each numpad key can be made to launch two different hotkey subroutines depending on the state of `NumLock`. Alternatively, a numpad key can be made to launch the same subroutine regardless of the state. For example:

```ahk
NumpadEnd::
Numpad1::
{
    MsgBox "This hotkey is launched regardless of whether NumLock is on."
}
```

If the [tilde (~) symbol](#Tilde) is used with a [prefix key](#prefix) even once, it changes the behavior of that prefix key for all combinations. For example, in both of the below hotkeys, the active window will receive all right-clicks even though only one of the definitions contains a tilde:

```ahk
~RButton & LButton::MsgBox "You pressed the left mouse button while holding down the right."
RButton & WheelUp::MsgBox "You turned the mouse wheel up while holding down the right button."
```

By default, a hotkey fires when its key is pressed down. In contrast, modifier key hotkeys (`Ctrl::`, `Control::`, `Alt::`, and `Shift::`), [prefix key](#prefix) hotkeys, and [key-up](#keyup) hotkeys fire upon release of the key. Use the [tilde prefix](#Tilde) to make the modifier key hotkeys and prefix key hotkeys fire upon press-down rather than release.

The [Suspend](lib/Suspend.md) function can temporarily disable all hotkeys except for ones you make exempt. For greater selectivity, use [#HotIf](lib/_HotIf.md).

By means of the [Hotkey](lib/Hotkey.md) function, hotkeys can be created dynamically while the script is running. The Hotkey function can also modify, disable, or enable the script's existing hotkeys individually.

Controller hotkeys do not currently support modifier prefixes such as ^ (Ctrl) and # (Win). However, you can use [GetKeyState](lib/GetKeyState.md) to mimic this effect as shown in the following example:

```ahk
Joy2::
{
    if not GetKeyState("Control")  ; Neither the left nor right Control key is down.
        return  ; i.e. Do nothing.
    MsgBox "You pressed the first controller's second button while holding down the Control key."
}
```

There may be times when a hotkey should wait for its own modifier keys to be released before continuing. Consider the following example:

```ahk
^!s::Send "{Delete}"
```

Pressing `Ctrl`+`Alt`+`S` would cause the system to behave as though you pressed `Ctrl`+`Alt`+`Del` (due to the system's aggressive detection of this hotkey). To work around this, use [KeyWait](lib/KeyWait.md) to wait for the keys to be released; for example:

```ahk
^!s::
{
    KeyWait "Control"
    KeyWait "Alt"
    Send "{Delete}"
}
```

If a hotkey like `#z::` produces an error like "Invalid Hotkey", your system's keyboard layout/language might not have the specified character ("Z" in this case). Try using a different character that you know exists in your keyboard layout.

A hotkey's function can be called explicitly by the script only if the function has been named. See [Named Function Hotkeys](#Function).

One common use for hotkeys is to start and stop a repeating action, such as a series of keystrokes or mouse clicks. For an example of this, see [this FAQ topic](FAQ.md#repeat).

Finally, each script is [quasi multi-threaded](misc/Threads.md), which allows a new hotkey to be launched even when a previous hotkey subroutine is still running. For example, new hotkeys can be launched even while a [message box](lib/MsgBox.md) is being displayed by the current hotkey.

<a id="alttab"></a>
## <a id="AltTabDetail"></a>Alt-Tab Hotkeys

Alt-Tab hotkeys simplify the mapping of new key combinations to the system's Alt-Tab hotkeys, which are used to invoke a menu for switching tasks (activating windows).

Each Alt-Tab hotkey must be either a single key or a combination of two keys, which is typically achieved via the ampersand symbol (&). In the following example, you would hold down the right `Alt` and press `J` or `K` to navigate the alt-tab menu:

```ahk
RAlt & j::AltTab
RAlt & k::ShiftAltTab
```

*AltTab* and *ShiftAltTab* are two of the special commands that are only recognized when used on the same line as a hotkey. Here is the complete list:

**AltTab:** If the alt-tab menu is visible, move forward in it. Otherwise, display the menu (only if the hotkey is a combination of two keys; otherwise, it does nothing).

**ShiftAltTab:** Same as above except move backward in the menu.

**AltTabMenu:** Show or hide the alt-tab menu.

**AltTabAndMenu:** If the alt-tab menu is visible, move forward in it. Otherwise, display the menu.

**AltTabMenuDismiss:** Close the Alt-tab menu.

To illustrate the above, the mouse wheel can be made into an entire substitute for Alt-tab. With the following hotkeys in effect, clicking the middle button displays the menu and turning the wheel navigates through it:

```ahk
MButton::AltTabMenu
WheelDown::AltTab
WheelUp::ShiftAltTab
```

To cancel the Alt-Tab menu without activating the selected window, press or send `Esc`. In the following example, you would hold the left `Ctrl` and press `CapsLock` to display the menu and advance forward in it. Then you would release the left `Ctrl` to activate the selected window, or press the mouse wheel to cancel. Define the [AltTabWindow](#AltTabWindow) window group as shown below before running this example.

```ahk
LCtrl & CapsLock::AltTab
#HotIf WinExist("ahk_group AltTabWindow")  ; Indicates that the alt-tab menu is present on the screen.
*MButton::Send "{Blind}{Escape}"  ; The * prefix allows it to fire whether or not Alt is held down.
#HotIf
```

If the script sent `{Alt Down}` (such as to invoke the Alt-Tab menu), it might also be necessary to send `{Alt Up}` as shown in the example further below.

<a id="AltTabRemarks"></a>
### General Remarks

Currently, all special Alt-tab actions must be assigned directly to a hotkey as in the examples above (i.e. they cannot be used as though they were functions). They are not affected by [#HotIf](lib/_HotIf.md).

An alt-tab action may take effect on key-down and/or key-up regardless of whether the `up` keyword is used, and cannot be combined with another action on the same key. For example, using both `F1::AltTabMenu` and `F1 up::OtherAction()` is unsupported.

<a id="AltTabWindow"></a>

Custom alt-tab actions can also be created via hotkeys. As the identity of the alt-tab menu differs between OS versions, it may be helpful to use a window group as shown below. For the examples above and below which use `ahk_group AltTabWindow`, this window group is expected to be defined during [script startup](Scripts.md#auto). Alternatively, `ahk_group AltTabWindow` can be replaced with the appropriate `ahk_class` for your system.

```ahk
GroupAdd "AltTabWindow", "ahk_class MultitaskingViewFrame"  ; Windows 10
GroupAdd "AltTabWindow", "ahk_class TaskSwitcherWnd"  ; Windows Vista, 7, 8.1
GroupAdd "AltTabWindow", "ahk_class #32771"  ; Older, or with classic alt-tab enabled
```

In the following example, you would press `F1` to display the menu and advance forward in it. Then you would press `F2` to activate the selected window, or press `Esc` to cancel:

```ahk
*F1::Send "{Alt down}{tab}" ; Asterisk is required in this case.
!F2::Send "{Alt up}"  ; Release the Alt key, which activates the selected window.
#HotIf WinExist("ahk_group AltTabWindow")
~*Esc::Send "{Alt up}"  ; When the menu is cancelled, release the Alt key automatically.
;*Esc::Send "{Esc}{Alt up}"  ; Without tilde (~), Escape would need to be sent.
#HotIf
```

<a id="Function"></a>
## Named Function Hotkeys

If the function of a hotkey is ever needed to be called without triggering the hotkey itself, one or more hotkeys can be assigned a named [function](Functions.md) by simply defining it immediately after the hotkey's double-colon as in this example:

```ahk
; Ctrl+Shift+O to open containing folder in Explorer.
; Ctrl+Shift+E to open folder with current file selected.
; Supports SciTE and Notepad++ (may require title bar setting changes).
^+o::
^+e::
    editor_open_folder(hk)
    {
        path := WinGetTitle("A")
        if RegExMatch(path, "\*?\K(.*)\\[^\\]+(?= [-*] )", &path)
            if (FileExist(path[0]) && hk = "^+e")
                Run Format('explorer.exe /select,"{1}"', path[0])
            else
                Run Format('explorer.exe "{1}"', path[1])
    }
```

If the function *editor_open_folder* is ever called explicitly by the script, the first parameter (hk) must be passed a value.

[Hotstrings](Hotstrings.md) can also be defined this way. Multiple hotkeys or hotstrings can be stacked together to call the same function.

There must only be whitespace or comments between the hotkey and the function name.

Naming the function also encourages self-documenting hotkeys, like in the code above where the function name describes the hotkey.

The [Hotkey](lib/Hotkey.md) function can also be used to assign a function or function object to a hotkey.
