# Remapping Keys (Keyboard, Mouse and Controller)

<a id="toc"></a>
## Table of Contents

- [Introduction](#intro)
- [Remapping the Keyboard and Mouse](#Remap)
- [Remarks](#remarks)
- [Moving the Mouse Cursor via the Keyboard](#moving-the-mouse-cursor)
- [Remapping via the Registry's "Scancode Map"](#registry)
- [Related Topics](#related)

<a id="intro"></a>
## Introduction

**Limitation:** AutoHotkey's remapping feature described below is generally not as pure and effective as remapping directly via the Windows registry. For the advantages and disadvantages of each approach, see [registry remapping](#registry).

<a id="Remap"></a>
## Remapping the Keyboard and Mouse

The syntax for the built-in remapping feature is `OriginKey::DestinationKey`. For example, a [script](../Scripts.md) consisting only of the following line would make `A` behave like `B`:

```ahk
a::b
```

The above example does not alter `B` itself. `B` would continue to send the "b" keystroke unless you remap it to something else as shown in the following example:

```ahk
a::b
b::a
```

The examples above use lowercase, which is recommended for most purposes because it also remaps the corresponding uppercase letters (that is, it will send uppercase when `CapsLock` is "on" or `Shift` is held down). By contrast, specifying an uppercase letter on the right side forces uppercase. For example, the following line would produce an uppercase B when you type either "a" or "A" (as long as `CapsLock` is off):

```ahk
a::B
```

Conversely, any modifiers included on the left side but not the right side are automatically released when the key is sent. For example, the following two lines would produce a lowercase "b" when you press either `Shift`+`A` or `Ctrl`+`A`:

```ahk
A::b
^a::b
```

<a id="RemapMouse"></a>
### Mouse Remapping

To remap the mouse instead of the keyboard, use the same approach. For example:

| Example | Description |
| --- | --- |
| `MButton::Shift` | Makes the middle button behave like `Shift`. |
| `XButton1::LButton` | Makes the fourth mouse button behave like the left mouse button. |
| `RAlt::RButton` | Makes the right `Alt` behave like the right mouse button. |

### Other Useful Remappings

| Example | Description |
| --- | --- |
| `CapsLock::Ctrl` | Makes `CapsLock` become `Ctrl`. To retain the ability to turn `CapsLock` on and off, add the remapping `+CapsLock::CapsLock` first. This toggles `CapsLock` on and off when you hold down `Shift` and press `CapsLock`. Because both remappings allow additional modifier keys to be held down, the more specific `+CapsLock::CapsLock` remapping must be placed first for it to work. |
| `XButton2::^LButton` | Makes the fifth mouse button (XButton2) produce a control-click. |
| `RAlt::AppsKey` | Makes the right `Alt` become `Menu` (which is the key that opens the context menu). |
| `RCtrl::RWin` | Makes the right `Ctrl` become the right `Win`. |
| `Ctrl::Alt` | Makes both `Ctrl` behave like `Alt`. However, see [alt-tab issues](#AltTab). |
| `^x::^c` | Makes `Ctrl`+`X` produce `Ctrl`+`C`. It also makes `Ctrl`+`Alt`+`X` produce `Ctrl`+`Alt`+`C`, etc. |
| `RWin::Return` | Disables the right `Win` by having it simply [return](../lib/Return.md). |

You can try out any of these examples by copying them into a new text file such as "Remap.ahk", then launching the file.

See the [Key List](../KeyList.md) for a complete list of key and mouse button names.

## Remarks

The [#HotIf](../lib/_HotIf.md) directive can be used to make selected remappings active only in the windows you specify (or while any given condition is met). For example:

```ahk
#HotIf WinActive("ahk_class Notepad")
a::b  ; Makes the 'a' key send a 'b' key, but only in Notepad.
#HotIf  ; This puts subsequent remappings and hotkeys in effect for all windows.
```

Remapping a key or button is "complete" in the following respects:

- Holding down a modifier such as `Ctrl` or `Shift` while typing the origin key will put that modifier into effect for the destination key. For example, `b::a` would produce `Ctrl`+`A` if you press `Ctrl`+`B`.
- `CapsLock` generally affects remapped keys in the same way as normal keys.
- The destination key or button is held down for as long as you continue to hold down the origin key. However, some games do not support remapping; in such cases, the keyboard and mouse will behave as though not remapped.
- Remapped keys will auto-repeat while being held down (except keys remapped to become mouse buttons).

<a id="HookHotkeys"></a>

Although a remapped key can trigger normal hotkeys, by default it cannot trigger mouse hotkeys or [hook hotkeys](../lib/_UseHook.md) (use [ListHotkeys](../lib/ListHotkeys.md) to discover which hotkeys are "hook"). For example, if the remapping `a::b` is in effect, pressing `Ctrl`+`Alt`+`A` would trigger the `^!b` hotkey only if `^!b` is not a hook hotkey. If `^!b` is a hook hotkey, you can define `^!a` as a hotkey if you want `Ctrl`+`Alt`+`A` to perform the same action as `Ctrl`+`Alt`+`B`. For example:

```ahk
a::b
^!a::
^!b::ToolTip "You pressed " ThisHotkey
```

Alternatively, [#InputLevel](../lib/_InputLevel.md) can be used to override the default behavior. For example:

```ahk
#InputLevel 1
a::b

#InputLevel 0
^!b::ToolTip "You pressed " ThisHotkey
```

<a id="SendPlay"></a>

If [SendMode](../lib/SendMode.md) is used during [script startup](../Scripts.md#auto), it affects all remappings. However, since remapping uses [Send "{Blind}"](../lib/Send.md#blind) and since the [SendPlay mode](../lib/SendMode.md#Play) does not fully support {Blind}, some remappings might not function properly in SendPlay mode (especially `Ctrl`, `Shift`, `Alt`, and `Win`). To work around this, avoid using `SendMode "Play"` during [script startup](../Scripts.md#auto) when you have remappings; then use the function [SendPlay](../lib/Send.md) vs. Send in other places throughout the script. Alternatively, you could translate your remappings into hotkeys (as described below) that explicitly call SendEvent vs. Send.

<a id="EscapeBrace"></a>

If *DestinationKey* is meant to be `{`, it has to be [escaped](EscapeChar.md), for example, ``x::`{``. Otherwise it is interpreted as the opening brace for the [hotkey](../Hotkeys.md)'s function.

<a id="actually"></a>

When a script is launched, each remapping is translated into a pair of [hotkeys](../Hotkeys.md). For example, a script containing `a::b` actually contains the following two hotkeys instead:

```ahk
*a::
{
    SetKeyDelay -1   ; If the destination key is a mouse button, SetMouseDelay is used instead.
    Send "{Blind}{b DownR}"  ; DownR is like Down except that other Send functions in the script won't assume "b" should stay down during their Send.
}

*a up::
{
    SetKeyDelay -1  ; See note below for why press-duration is not specified with either of these SetKeyDelays.
    Send "{Blind}{b Up}"
}
```

However, the above hotkeys vary under the following circumstances:

1. When the source key is the left `Ctrl` and the destination key is `Alt`, the line `Send "{Blind}{LAlt DownR}"` is replaced by `Send "{Blind}{LCtrl up}{LAlt DownR}"`. The same is true if the source is the right `Ctrl`, except that `{RCtrl up}` is used. This is done to ensure that the system translates Alt-key combinations as though `Ctrl` is not being held down, but it also causes the remapping to override any prior {Ctrl down}. [v2.0.8+]: The unsuppressed Ctrl key-up is still sent for backward-compatibility, but is no longer needed for its original purpose. The side effect can be avoided by replacing the remapping with an explicit pair of hotkeys as demonstrated above.
2. When a keyboard key is being remapped to become a mouse button (e.g. `RCtrl::RButton`), the hotkeys above use SetMouseDelay in place of SetKeyDelay. In addition, the first hotkey above is replaced by the following, which prevents the keyboard's auto-repeat feature from generating repeated mouse clicks:
    ```ahk
    *RCtrl::
    {
        SetMouseDelay -1
        if not GetKeyState("RButton")  ; i.e. the right mouse button isn't down yet.
            Send "{Blind}{RButton DownR}"
    }
    ```
3. When the source is a [custom combination](../Hotkeys.md#combo), the wildcard modifier (\*) is omitted to allow the hotkeys to work.
4. If any of the modifier symbols in `!#^+` are applied to the source key and not the destination key, they are inserted after the word "Blind" to allow those modifiers to be released by Send. For example, `^a::b` would use `{Blind^}`. `<^a::b` would also use `{Blind^}`, which may produce unexpected results if used in combination with RCtrl. For details, see [Blind mode](../lib/Send.md#blind).

Note that SetKeyDelay's second parameter ([press duration](../lib/SetKeyDelay.md#dur)) is omitted in the hotkeys above. This is because press-duration does not apply to down-only or up-only events such as `{b down}` and `{b up}`. However, it does apply to changes in the state of the modifier keys (Shift, Ctrl, Alt, and Win), which affects remappings such as `a::B` or `a::^b`. Consequently, any press-duration a script puts into effect during [script startup](../Scripts.md#auto) will apply to all such remappings.

Since remappings are translated into hotkeys as described above, the [Suspend](../lib/Suspend.md) function affects them. Similarly, the [Hotkey](../lib/Hotkey.md) function can disable or modify a remapping. For example, the following two functions would disable the remapping `a::b`.

```ahk
Hotkey "*a", "Off"
Hotkey "*a up", "Off"
```

<a id="AltTab"></a>

Alt-tab issues: If you remap a key or mouse button to become `Alt`, that key will probably not be able to alt-tab properly. A possible work-around is to add the hotkey `*Tab::Send "{Blind}{Tab}"` -- but be aware that it will likely interfere with using the real `Alt` to alt-tab. Therefore, it should be used only when you alt-tab solely by means of remapped keys and/or [alt-tab hotkeys](../Hotkeys.md#alttab).

In addition to the keys and mouse buttons on the [Key List](../KeyList.md) page, the source and destination keys may also be a virtual key (VKnn) or scan code (SCnnn) as described in the [Special Keys](../KeyList.md#SpecialKeys) section. For example, `sc01e::vk42` is equivalent to `a::b` on most keyboard layouts.

To disable a key rather than remapping it, make it a hotkey that simply [returns](../lib/Return.md). For example, `F1::return` would disable `F1`.

The following keys are not supported by the built-in remapping method:

- The mouse wheel (WheelUp/Down/Left/Right).
- "Pause" as a destination key name (since it matches the name of a built-in function). Instead use `vk13` or the corresponding scan code.
- Curly braces {} as destination keys. Instead use the [VK/SC method](../lib/Send.md#vk); e.g. `x::+sc01A` and `y::+sc01B`.

<a id="moving-the-mouse-cursor"></a>
## Moving the Mouse Cursor via the Keyboard

The keyboard can be used to move the mouse cursor as demonstrated by the fully-featured [Keyboard-To-Mouse script](../scripts/index.md#NumpadMouse). Since that script offers smooth cursor movement, acceleration, and other features, it is the recommended approach if you plan to do a lot of mousing with the keyboard. By contrast, the following example is a simpler demonstration:

```ahk
*#up::MouseMove 0, -10, 0, "R"  ; Win+UpArrow hotkey => Move cursor upward
*#Down::MouseMove 0, 10, 0, "R"  ; Win+DownArrow => Move cursor downward
*#Left::MouseMove -10, 0, 0, "R"  ; Win+LeftArrow => Move cursor to the left
*#Right::MouseMove 10, 0, 0, "R"  ; Win+RightArrow => Move cursor to the right

*<#RCtrl::  ; LeftWin + RightControl => Left-click (hold down Control/Shift to Control-Click or Shift-Click).
{
    SendEvent "{Blind}{LButton down}"
    KeyWait "RCtrl"  ; Prevents keyboard auto-repeat from repeating the mouse click.
    SendEvent "{Blind}{LButton up}"
}

*<#AppsKey::  ; LeftWin + AppsKey => Right-click
{
    SendEvent "{Blind}{RButton down}"
    KeyWait "AppsKey"  ; Prevents keyboard auto-repeat from repeating the mouse click.
    SendEvent "{Blind}{RButton up}"
}
```

<a id="registry"></a>
## Remapping via the Registry's "Scancode Map"

**Advantages:**

- Registry remapping is generally more pure and effective than [AutoHotkey's remapping](#Remap). For example, it works in a broader variety of games, it has no known [alt-tab issues](#AltTab), and it is capable of firing AutoHotkey's hook hotkeys (whereas AutoHotkey's remapping requires a [workaround](#HookHotkeys)).
- If you choose to make the registry entries manually (explained below), absolutely no external software is needed to remap your keyboard. Even if you use [KeyTweak](https://www.bleepingcomputer.com/download/keytweak/) to make the registry entries for you, KeyTweak does not need to stay running all the time (unlike AutoHotkey).

**Disadvantages:**

- Registry remapping is relatively permanent: a reboot is required to undo the changes or put new ones into effect.
- Its effect is global: it cannot create remappings specific to a particular user, application, or locale.
- It cannot send keystrokes that are modified by `Shift`, `Ctrl`, `Alt`, or `AltGr`. For example, it cannot remap a lowercase character to an uppercase one.
- It supports only the keyboard (AutoHotkey has [mouse remapping](#RemapMouse) and some [limited controller remapping](RemapController.md)).

**How to Apply Changes to the Registry:** There are at least two methods to remap keys via the registry:

1. Use a program like [KeyTweak](https://www.bleepingcomputer.com/download/keytweak/) (freeware) to visually remap your keys. It will change the registry for you.
2. Remap keys manually by creating a .reg file (plain text) and loading it into the registry. This is demonstrated in the [archived forums](https://www.autohotkey.com/board/index.php?showtopic=8359#entry52760).

<a id="related"></a>
## Related Topics

- [List of keys, mouse buttons and controller controls](../KeyList.md)
- [GetKeyState](../lib/GetKeyState.md)
- [Remapping a controller](RemapController.md)
