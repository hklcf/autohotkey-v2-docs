# How to Write Hotkeys

A hotkey is a key or key combination that triggers an action. For example, `Win`+`E` normally launches File Explorer, and `F1` often activates an app-specific help function. AutoHotkey has the power to define hotkeys that can be used anywhere *or* only within specific apps, performing any action that you are able to express with code.

The most common way to define a hotkey is to write the *hotkey name* followed by double-colon, then the action:

```ahk
#n::Run "notepad"
```

This example defines a hotkey that runs Notepad whenever you press `Win`+`N`. To learn how to try it out, refer to [How to Run Example Code](RunExamples.md).

For more about running programs, see [How to Run Programs](RunPrograms.md).

If multiple lines are required, use braces to mark the start and end of the hotkey's action. This is called a [block](../lib/Block.md).

```ahk
#n::
{
    if WinExist("ahk_class Notepad")
        WinActivate  ; Activate the window found above
    else
        Run "notepad"  ; Open a new Notepad window
}
```

The opening brace can also be written on the same line as the hotkey, after `::`.

The block following a double-colon hotkey is implicitly the body of a [function](../Functions.md), but that is only important when you define your own [variables](../Concepts.md#variables). For now, just know that blocks are used to group multiple lines as a single action or *statement* (see [Control Flow](../Concepts.md#control-flow) if you want to know more about this).

<a id="Basic_Hotkeys"></a>
## Basic Hotkeys

For most hotkeys, the *hotkey name* consists of optional modifier symbols immediately followed by a single letter or symbol, or a [key name](../KeyList.md). Try making the following changes to the example above:

- Remove `#` to make the hotkey activate whenever you press `N` on its own. Keep in mind that if something goes wrong, you can always [exit the script](RunExamples.md#bailing-out).
- Replace `#` with `^` for Ctrl, `!` for Alt or `+` for Shift, or try combinations.
- Replace `#` with `<^` to make it activate only when the *left* Ctrl key is pressed, or `>^` for the right Ctrl key, or *both* to require both keys.
- Replace `n` with any other letter or symbol (except `:`).
- Replace `n` with any name from the [key list](../KeyList.md).

> **Note:** The last character before `::` is never interpreted as a modifier symbol.

With this form of hotkey, only the final key in the combination can be written literally as a single character or have its name spelled out in full. For example:

- `#::` would create a hotkey activated by the hash key, or whatever combination is associated with that symbol (on the US layout, it's `Shift`+`3`).
- `##::` would create a hotkey like the above, but which activates only if you are also holding the Windows key.
- `LWin::` would create a hotkey activated by pressing down the left Windows key without any other modifier keys.

The most common modifiers are Ctrl (`^`), Alt (`!`), Shift (`+`) and Win (`#`).

The symbols `<` and `>` can be prefixed to any one of the above four modifiers to specify the left or right variant of that key. The modifier combination `<^>!` corresponds to the AltGr key (if present on your keyboard layout), since the operating system implements it as a combination of LCtrl and RAlt.

The other modifiers are:

- `*` ([wildcard](../Hotkeys.md#wildcard)) allows the hotkey to fire even if you are holding modifier keys that the hotkey doesn't include symbols for.
- `~` ([no-suppress](../Hotkeys.md#Tilde)) prevents the hotkey from blocking the key's native function.
- `$` ([use hook](../Hotkeys.md#prefixdollar)) prevents unintentional loops when sending keys, and in some instances makes the hotkey more reliable.

To make a hotkey fire only when you release the key instead of when you press it, use the [UP suffix](../Hotkeys.md#keyup).

**Related:** [Hotkey Modifier Symbols](../Hotkeys.md#Symbols), [List of Keys](../KeyList.md)

<a id="Context-sensitive_Hotkeys"></a>
## Context-sensitive Hotkeys

The [#HotIf](../lib/_HotIf.md) directive can be used to specify a condition that must be met for the hotkey to activate, such as:

- If a window of a specific app is active when you press the hotkey.
- If CapsLock is on when you press the hotkey.
- Any other condition you are able to detect with code.

For example:

```ahk
#HotIf WinActive("ahk_class Notepad")
^a::MsgBox "You pressed Ctrl-A while Notepad is active. Pressing Ctrl-A in any other window will pass the Ctrl-A keystroke to that window."
#c::MsgBox "You pressed Win-C while Notepad is active."

#HotIf
#c::MsgBox "You pressed Win-C while any window except Notepad is active."
```

You define the condition by writing an [expression](../Language.md#expressions) which is evaluated whenever you press the hotkey. If the expression [evaluates to true](../Concepts.md#boolean), the hotkey's action is executed.

The same hotkey can be used multiple times by specifying a different condition for each occurrence of the hotkey, or each *hotkey variant*. When you press the hotkey, the program executes the first hotkey variant whose condition is met, or the one without a condition (such as the final `#c::` in the example above).

If the hotkey's condition isn't met and there is no unconditional variant of the hotkey, the keypress is passed on to the active window as though the hotkey wasn't defined in the first place. For instance, if Notepad *isn't* active while running the example above, `Ctrl`+`A` will perform its normal function (probably Select All).

Try making the following changes to the example:

- Replace `WinActive` with `WinExist` so that the hotkeys activate if Notepad is running, even if Notepad doesn't have the focus.
- Replace the condition with `GetKeyState("CapsLock", "T")` so that the hotkeys only activate while CapsLock is on.
- Add another ^a or #c hotkey for some other window, such as your web browser or editor. Note that we use [ahk_class](../misc/WinTitle.md#ahk_class) so that the example will work on non-English systems, but you can remove it and use the window's title if you wish.

Correctly identifying which window you want the hotkey to affect sometimes requires using criteria other than the window title. To learn more, see [How to Manage Windows](ManageWindows.md).

**Related:** [#HotIf](../lib/_HotIf.md), [Expressions](../Language.md#expressions), [WinActive](../lib/WinActive.md)

<a id="Custom_Combinations"></a>
## Custom Combinations

A *custom combination* is a hotkey that combines two keys which aren't normally meant to be used in combination. For example, `Numpad0 & Numpad1::` defines a hotkey which activates when you hold Numpad0 and press Numpad1.

When you use a key as a prefix in a custom combination, AutoHotkey assumes that you don't want the normal function of the key to activate, since that would interfere with its use as a modifier key. There are two ways to restore the key's normal function:

1. Use another hotkey such as `Numpad0::Send "{Numpad0}"` to replicate the key's original function. By default, the hotkey will only activate when you *release* Numpad0, and only if you didn't press Numpad0 and Numpad1 in combination.
2. Prefix the combination with [tilde (~)](../Hotkeys.md#Tilde), as in `~Numpad0 & Numpad1::`. This prevents AutoHotkey from suppressing the normal function of Numpad0, unless you have also defined `Numpad0::`, in which case the tilde allows the latter hotkey to activate immediately instead of when you release Numpad0.

> **Note:** Custom combinations only support combinations of exactly two keys/mouse buttons, and cannot be combined with other modifiers, such as `!#^+` for Alt, Win, Ctrl and Shift.

Although AutoHotkey does not directly support custom combinations of more than two keys, a similar end result can be achieved by using [#HotIf](../lib/_HotIf.md). If you run the example below, pressing `Ctrl`+`CapsLock`+`Space` or `Ctrl`+`Space`+`CapsLock` should show a message:

```ahk
#HotIf GetKeyState("Ctrl")
Space & CapsLock::
CapsLock & Space::MsgBox "Success!"
```

It is necessary to press Ctrl first in this example. This has the advantage that Space and CapsLock perform their normal function if you are not holding Ctrl.

**Related:** [Custom Combinations](../Hotkeys.md#combo)

<a id="Other_Features"></a>
## Other Features

AutoHotkey's hotkeys have some other features that are worth exploring. While most applications are limited to combinations of Ctrl, Alt, Shift and sometimes Win with one other key (and often not all keys on the keyboard are supported), AutoHotkey isn't so limited. For further reading, see [Hotkeys](../Hotkeys.md).
