# #HotIf

Creates context-sensitive [hotkeys](../Hotkeys.md) and [hotstrings](../Hotstrings.md). They perform a different action (or none at all) depending on any condition (an [expression](../Language.md#expressions)).

```ahk
#HotIf Expression
```

<a id="Parameters"></a>
## Parameters

**Expression**

Type: [Boolean](../Concepts.md#boolean)

If omitted, subsequently defined hotkeys/hotstrings are not context-sensitive. Otherwise, specify any valid [expression](../Variables.md#Expressions). This becomes the return value of an implicit function which has one parameter ([ThisHotkey](../Hotkeys.md#ThisHotkey)). The function cannot modify global variables directly (as it is [assume-local](../Functions.md#AssumeLocal) as usual, and cannot contain declarations), but can call other functions which do.

<a id="howto"></a>
## Basic Operation

The #HotIf directive sets the expression which will be used by subsequently defined [hotkeys](../Hotkeys.md) and [hotstrings](../Hotstrings.md) to determine whether they should activate. This expression is evaluated when the hotkey's key, mouse button or combination is pressed, when the hotstring's abbreviation is typed, or at other times when the program needs to know whether the hotkey/hotstring is active.

To make context-sensitive hotkeys/hotstrings, simply precede them with the #HotIf directive. For example:

```ahk
#HotIf WinActive("ahk_class Notepad") or WinActive(MyWindowTitle)
#Space::MsgBox "You pressed Win+Spacebar in Notepad or " MyWindowTitle
:X:btw::MsgBox "You typed btw in Notepad or " MyWindowTitle
```

The #HotIf directive is positional: it affects all hotkeys/hotstrings physically beneath it in the script, until the next #HotIf directive.

> **Note:** Unlike [if statements](If.md), braces have no effect with the #HotIf directive.

The #HotIf directive only affects hotkeys/hotstrings defined via the double-colon syntax, such as `#Space::` or `::btw::`. For hotkeys/hotstrings created via the [Hotkey](Hotkey.md) or [Hotstring](Hotstring.md) function, use the [HotIf](HotIf.md) function.

To turn off context sensitivity, specify #HotIf without any expression. For example:

```ahk
#HotIf
```

Like other directives, #HotIf cannot be executed conditionally.

When a mouse or keyboard hotkey is disabled via #HotIf, it performs its native function; that is, it passes through to the active window as though there is no such hotkey. There is one exception: Controller hotkeys: although #HotIf works, it never prevents other programs from seeing the press of a button.

#HotIf can also be used to alter the behavior of an ordinary key like `Enter` or `Space`. This is useful when a particular window ignores that key or performs some action you find undesirable. For example:

```ahk
#HotIf WinActive("Reminders ahk_class #32770")  ; The "reminders" window in Outlook.
Enter::Send "!o"  ; Have an "Enter" keystroke open the selected reminder rather than snoozing it.
#HotIf
```

<a id="variant"></a>
## Variants (Duplicates)

A particular [hotkey](../Hotkeys.md) or [hotstring](../Hotstrings.md) can be defined more than once in the script if each definition has different HotIf criteria. These are known as *hotkey variants* or *hotstring variants*. For example:

```ahk
#HotIf WinActive("ahk_class Notepad")
^!c::MsgBox "You pressed Control+Alt+C in Notepad."
#HotIf WinActive("ahk_class MSPaintApp")
^!c::MsgBox "You pressed Control+Alt+C in Paint."
#HotIf
^!c::MsgBox "You pressed Control+Alt+C in a window other than Notepad/Paint."
```

If more than one variant is eligible to fire, only the one closest to the top of the script will fire. The exception to this is the global variant (the one with no HotIf criteria): It always has the lowest precedence; therefore, it will fire only if no other variant is eligible (this exception does not apply to [hotstrings](../Hotstrings.md)).

When creating duplicate hotkeys, the order of [modifier symbols](../Hotkeys.md#Symbols) such as `^!+#` does not matter. For example, `^!c` is the same as `!^c`. However, keys must be spelled consistently. For example, *Esc* is not the same as *Escape* for this purpose (though the case does not matter). Also, any hotkey with a [wildcard prefix (\*)](../Hotkeys.md#wildcard) is entirely separate from a non-wildcard one; for example, `*F1` and `F1` would each have their own set of variants.

A [window group](GroupAdd.md) can be used to make a hotkey/hotstring execute for a group of windows. For example:

```ahk
GroupAdd "MyGroup", "ahk_class Notepad"
GroupAdd "MyGroup", "ahk_class MSPaintApp"

#HotIf WinActive("ahk_group MyGroup")
#z::MsgBox "You pressed Win+Z in either Notepad or Paint."
```

To create hotkey/hotstring variants dynamically (while the script is running), see [HotIf](HotIf.md).

## Expression Evaluation

When the hotkey's key, mouse or controller button combination is pressed or the hotstring's abbreviation is typed, the #HotIf expression is evaluated to determine if the hotkey/hotstring should activate.

> **Note:** Scripts should not assume that the expression is only evaluated when the hotkey's key is pressed (see below).

The expression may also be evaluated whenever the program needs to know whether the hotkey is active. For example, the #HotIf expression for a custom combination like `a & b::` might be evaluated when the prefix key (`a` in this example) is pressed, to determine whether it should act as a custom modifier key.

<a id="lag"></a>

> **Note:** Use of #HotIf in an unresponsive script may cause input lag or break hotkeys/hotstrings (see below).

There are several more caveats to the #HotIf directive:

- Keyboard or mouse input is typically buffered (delayed) until expression evaluation completes or [times out](_HotIfTimeout.md).
- Expression evaluation can only be performed by the script's main thread (at the OS level, not a [quasi-thread](../misc/Threads.md)), not directly by the keyboard/mouse hook. If the script is busy or unresponsive, such as if a FileCopy is in progress, expression evaluation is delayed and may time out.
- If the [system-defined timeout](_HotIfTimeout.md#LowLevelHooksTimeout) is reached, the system may stop notifying the script of keyboard or mouse input (see #HotIfTimeout for details).
- Sending keystrokes or mouse clicks while the expression is being evaluated (such as from a function which it calls) may cause complications and should be avoided.

[ThisHotkey](../Hotkeys.md#ThisHotkey), [A_ThisHotkey](../Variables.md#ThisHotkey) and [A_TimeSinceThisHotkey](../Variables.md#TimeSinceThisHotkey) are set based on the hotkey or non-auto-replace hotstring for which the current #HotIf expression is being evaluated.

[A_PriorHotkey](../Variables.md#PriorHotkey) and [A_TimeSincePriorHotkey](../Variables.md#TimeSincePriorHotkey) temporarily contain the previous values of the corresponding "This" variables.

## Optimization

#HotIf is optimized to avoid expression evaluation for simple calls to [WinActive](WinActive.md) or [WinExist](WinExist.md), thereby reducing the [risk of lag](#lag) or other issues in such cases. Specifically:

- The expression must contain exactly one call to [WinExist](WinExist.md) or [WinActive](WinActive.md).
- Each parameter must be a single quoted string, and no more than two parameters may be used.
- The result may be inverted with `not` or `!`, but no other operators may be used.
- Whitespace and parentheses are fully handled when the expression is pre-compiled and therefore do not affect this optimization.

If the expression meets these criteria, it is evaluated directly by the program and does not appear in [ListLines](ListLines.md).

Before the [Hotkey](Hotkey.md) or [Hotstring](Hotstring.md) function is used to modify an existing hotkey/hotstring variant, typically the [HotIf](HotIf.md) function must be used with the original expression text. However, the first unique expression with a given combination of criteria can also be referenced by that criteria. For example:

```ahk
HotIfWinExist "ahk_class Notepad"
Hotkey "#n", "Off"  ; Turn the hotkey off.
HotIf 'WinExist("ahk_class Notepad")'
Hotkey "#n", "On"   ; Turn the same hotkey back on.

#HotIf WinExist("ahk_class Notepad")
#n::WinActivate
```

Note that any use of variables will disqualify the expression. If the variable's value never changes after the hotkey/hotstring is created, there are two strategies for minimizing the risk of lag or other issues inherent to #HotIf:

- Use `HotIfWin...(MyTitleVar)` to set the criteria and `Hotkey(KeyName, Action)` or `Hotstring(String, Replacement)` to create the hotkey/hotstring variant.
- Use a constant expression such as `#HotIf WinActive("ahk_group MyGroup")` and define the window group with `GroupAdd "MyGroup", MyTitleVar` elsewhere in the script.

## General Remarks

#HotIf also restores prefix keys to their native function when appropriate (a [prefix key](../Hotkeys.md#prefix) is `A` in a hotkey such as `a & b::`). This occurs whenever there are no enabled hotkeys for a given prefix.

When a hotkey is currently disabled via #HotIf, its key or mouse button will appear with a "#" character in [KeyHistory's](KeyHistory.md) "Type" column. This can help [debug a script](../Scripts.md#debug).

[Alt-tab hotkeys](../Hotkeys.md#alttab) are not affected by #HotIf: they are in effect for all windows.

The [Last Found Window](../misc/WinTitle.md#LastFoundWindow) can be set by #HotIf. For example:

```ahk
#HotIf WinExist("ahk_class Notepad")
#n::WinActivate  ; Activates the window found by WinExist().
```

<a id="Related"></a>
## Related

[#HotIfTimeout](_HotIfTimeout.md) may be used to override the default timeout value.

[Hotkey function](Hotkey.md), [Hotkeys](../Hotkeys.md), [Hotstring function](Hotstring.md), [Hotstrings](../Hotstrings.md), [Suspend](Suspend.md), [WinActive](WinActive.md), [WinExist](WinExist.md), [SetTitleMatchMode](SetTitleMatchMode.md), [DetectHiddenWindows](DetectHiddenWindows.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Creates two hotkeys and one hotstring which only work when Notepad is active, and one hotkey which works for any window except Notepad.

```ahk
#HotIf WinActive("ahk_class Notepad")
^!a::MsgBox "You pressed Ctrl-Alt-A while Notepad is active."
#c::MsgBox "You pressed Win-C while Notepad is active."
::btw::This replacement text for "btw" will occur only in Notepad.
#HotIf
#c::MsgBox "You pressed Win-C in a window other than Notepad."
```

<a id="ExVolume"></a>

**Example:** Allows the volume to be adjusted by scrolling the mouse wheel over the taskbar.

```ahk
#HotIf MouseIsOver("ahk_class Shell_TrayWnd")
WheelUp::Send "{Volume_Up}"
WheelDown::Send "{Volume_Down}"

MouseIsOver(WinTitle) {
    MouseGetPos ,, &Win
    return WinExist(WinTitle " ahk_id " Win)
}
```

<a id="ExWordDelete"></a>

**Example:** Simple word-delete shortcuts for all Edit controls.

```ahk
#HotIf ActiveControlIsOfClass("Edit")
^BS::Send "^+{Left}{Del}"
^Del::Send "^+{Right}{Del}"

ActiveControlIsOfClass(Cls) {
    FocusedControl := 0
    try FocusedControl := ControlGetFocus("A")
    FocusedControlClass := ""
    try FocusedControlClass := WinGetClass(FocusedControl)
    return (FocusedControlClass=Cls)
}
```

<a id="ExContextInsens"></a>

**Example:** Context-insensitive Hotkey.

```ahk
#HotIf
Esc::ExitApp
```

<a id="ExDynamic"></a>

**Example:** Dynamic Hotkeys. This example should be combined with [example #2](#ExVolume) before running it.

```ahk
NumpadAdd::
{
    static toggle := false
    HotIf 'MouseIsOver("ahk_class Shell_TrayWnd")'
    if (toggle := !toggle)
        Hotkey "WheelUp", DoubleUp
    else
        Hotkey "WheelUp", "WheelUp"
    return
    ; Nested function:
    DoubleUp(ThisHotkey) => Send("{Volume_Up 2}")
}
```
