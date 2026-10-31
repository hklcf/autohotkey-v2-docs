# Hotstrings

<a id="toc"></a>
## Table of Contents

- [Introduction and Simple Examples](#intro)
- [Ending Characters](#EndChars)
- [Options](#Options)
- [Long Replacements](#continuation)
- [Context-sensitive Hotstrings](#variant)
- [AutoCorrect](#AutoCorrect)
- [Remarks](#remarks)
- [Named Function Hotstrings](#Function)
- [Hotstring Helper](#Helper)

<a id="intro"></a>
## Introduction and Simple Examples

Although hotstrings are mainly used to expand abbreviations as you type them (auto-replace), they can also be used to launch any scripted action. In this respect, they are similar to [hotkeys](Hotkeys.md) except that they are typically composed of more than one character (that is, a string).

To define a hotstring, enclose the triggering abbreviation between pairs of colons as in this example:

```ahk
::btw::by the way
```

In the above example, the abbreviation btw will be automatically replaced with "by the way" whenever you type it (however, by default you must type an [ending character](#EndChars) after typing btw, such as `Space`, `.`, or `Enter`).

<a id="auto"></a>

The "by the way" example above is known as an auto-replace hotstring because the typed text is automatically erased and replaced by the string specified after the second pair of colons. By contrast, a hotstring may also be defined to perform any custom action as in the following examples. Note that the [statements](Concepts.md#statement) must appear <u>beneath</u> the abbreviation within the hotstring's [function body](Functions.md):

```ahk
::btw::
{
    MsgBox 'You typed "btw".'
}

:*:]d::  ; This hotstring replaces "]d" with the current date and time via the statement below.
{
    Send FormatTime(, "M/d/yyyy h:mm tt")  ; It will look like 9/1/2005 3:53 PM
}
```

In the above, the braces serve to define a function body for each hotstring. The opening brace may also be specified on the same line as the double-colon to support the [OTB (One True Brace) style](lib/Block.md#otb).

Even though the two examples above are not auto-replace hotstrings, the abbreviation you type is erased by default. This is done via automatic backspacing, which can be disabled via the [b0 option](#b0).

<a id="ThisHotkey"></a>

When a hotstring is triggered, the name of the hotstring is passed as its first parameter named `ThisHotkey` (which excludes the trailing colons). For example:

```ahk
:X:btw::MsgBox ThisHotkey  ; Reports :X:btw
```

With few exceptions, this is similar to the built-in variable [A_ThisHotkey](Variables.md#ThisHotkey). The parameter name can be changed by using a [named function](#Function).

<a id="EndChars"></a>
## Ending Characters

Unless the [asterisk option](#Asterisk) is in effect, you must type an *ending character* after a hotstring's abbreviation to trigger it. Ending characters initially consist of the following: **-()[]{}':;"/\,.?!\`n\`s\`t** (note that \`n is `Enter`, \`s is `Space`, and \`t is `Tab`). This set of characters can be changed by editing the following example, which sets the new ending characters for <u>all</u> hotstrings, not just the ones beneath it:

```ahk
#Hotstring EndChars -()[]{}:;'"/\,.?!`n`s`t
```

The ending characters can be changed while the script is running by calling the [Hotstring](lib/Hotstring.md) function as demonstrated below:

```ahk
Hotstring("EndChars", "-()[]{}:;")
```

<a id="Options"></a>
## Options

A hotstring's default behavior can be changed in three possible ways:

1. The [#Hotstring](lib/_Hotstring.md) directive, which affects all hotstrings physically beneath that point in the script. The following example puts the C and R options into effect: `#Hotstring c r`.
2. Putting options inside a hotstring's first pair of colons. The following example puts the C and \* options (case-sensitive and "ending character not required") into effect for a single hotstring: `:c*:j@::john@somedomain.com`.
3. The [Hotstring](lib/Hotstring.md) function, which affects all subsequently created hotstrings while the script is running. The following example puts the C and R options into effect: `Hotstring "c r"`.

The list below describes each option. When specifying more than one option using the methods above, spaces optionally may be included between them.

<a id="Asterisk"></a>

**\*** (asterisk): An ending character (e.g. `Space`, `.`, or `Enter`) is not required to trigger the hotstring. For example:

```ahk
:*:j@::jsmith@somedomain.com
```

The example above would send its replacement the moment you type the @ character. When using the [#Hotstring directive](lib/_Hotstring.md), use **\*0** to turn this option back off.

<a id="Question"></a>

**?** (question mark): The hotstring will be triggered even when it is inside another word; that is, when the character typed immediately before it is alphanumeric. For example, if `:?:al::airline` is a hotstring, typing "practical " would produce "practicairline ". Use **?0** to turn this option back off.

<a id="b0"></a>

**B0** (B followed by a zero): Automatic backspacing is <u>not</u> done to erase the abbreviation you type. Use a plain **B** to turn backspacing back on after it was previously turned off. A script may also do its own backspacing via {bs 5}, which sends `Backspace` five times. Similarly, it may send `←` five times via {left 5}. For example, the following hotstring produces "\<em\>\</em\>" and moves the caret 5 places to the left (so that it's between the tags):

```ahk
:*b0:<em>::</em>{left 5}
```

<a id="C"></a>

**C:** Case-sensitive: When you type an abbreviation, it must exactly match the case defined in the script. Use **C0** to turn case sensitivity back off.

<a id="C1"></a>

**C1:** Do not conform to typed case. Use this option to make [auto-replace hotstrings](#auto) case-insensitive and prevent them from conforming to the case of the characters you actually type. Case-conforming hotstrings (which are the default) produce their replacement text in all caps if you type the abbreviation in all caps. If you type the first letter in caps, the first letter of the replacement will also be capitalized (if it is a letter). If you type the case in any other way, the replacement is sent exactly as defined. When using the [#Hotstring directive](lib/_Hotstring.md), **C0** can be used to turn this option back off, which makes hotstrings conform again.

<a id="Kn"></a>

**Kn:** Key-delay: This rarely-used option sets the delay between keystrokes produced by auto-backspacing or [auto-replacement](#auto). Specify the new delay for **n**; for example, specify k10 to have a 10 ms delay and k-1 to have no delay. The exact behavior of this option depends on which [sending mode](#SendMode) is in effect:

- SI (SendInput): Key-delay is ignored because a delay is not possible in this mode. The exception to this is when SendInput is [unavailable](lib/SendMode.md#SendInputUnavail), in which case hotstrings revert to SendPlay mode below (which does obey key-delay).
- SP (SendPlay): A delay of length zero is the default, which for SendPlay is the same as -1 (no delay). In this mode, the delay is actually a [PressDuration](lib/SetKeyDelay.md#dur) rather than a delay between keystrokes.
- SE (SendEvent): A delay of length zero is the default. Zero is recommended for most purposes since it is fast but still cooperates well with other processes (due to internally doing a [Sleep 0](lib/Sleep.md)). Specify k-1 to have no delay at all, which is useful to make auto-replacements faster if your CPU is frequently under heavy load. When set to -1, a script's process-priority becomes an important factor in how fast it can send keystrokes. To raise a script's priority, use `ProcessSetPriority "High"`.

<a id="O"></a>

**O:** Omit the ending character of [auto-replace hotstrings](#auto) when the replacement is produced. This is useful when you want a hotstring to be kept unambiguous by still requiring an ending character, but don't actually want the ending character to be shown on the screen. For example, if `:o:ar::aristocrat` is a hotstring, typing "ar" followed by the spacebar will produce "aristocrat" with no trailing space, which allows you to make the word plural or possessive without having to press `Backspace`. Use **O0** (the letter O followed by a zero) to turn this option back off.

<a id="Pn"></a>

**Pn:** The [priority](misc/Threads.md) of the hotstring (e.g. P1). This rarely-used option has no effect on [auto-replace hotstrings](#auto).

<a id="raw"></a>

**R:** Send the replacement text [raw](lib/Send.md#SendRaw); that is, without translating {Enter} to `Enter`, ^c to `Ctrl`+`C`, etc. Use **R0** to turn this option back off, or override it with **T**.

> **Note:** [Text mode](#T) may be more reliable. The R and T options are mutually exclusive.

<a id="SuspendExempt"></a>

**S** or **S0**: Specify the letter S to make the hotstring [exempt](lib/_SuspendExempt.md) from [Suspend](lib/Suspend.md). Specify S0 (S with the number 0) to remove the exemption, allowing the hotstring to be suspended. When applied as a default option, either `S` or `#SuspendExempt` will make the hotstring exempt; that is, to override the directive, `S0` must be used explicitly in the hotstring.

<a id="SendMode"></a>

**SI** or **SP** or **SE**: Sets the method by which [auto-replace hotstrings](#auto) send their keystrokes. These options are mutually exclusive: only one can be in effect at a time. The following describes each option:

- <a id="SI"></a> SI stands for [SendInput](lib/SendMode.md#Input), which typically has superior speed and reliability than the other modes. Another benefit is that like SendPlay below, SendInput postpones anything you type during a hotstring's [auto-replacement text](#auto). This prevents your keystrokes from being interspersed with those of the replacement. When SendInput is [unavailable](lib/SendMode.md#SendInputUnavail), hotstrings automatically use SendPlay instead.
- <a id="SP"></a> SP stands for [SendPlay](lib/SendMode.md#Play), which may allow hotstrings to work in a broader variety of games.
- <a id="SE"></a> SE stands for [SendEvent](lib/SendMode.md#Event).

If none of the above options are used, the default mode is SendInput. However, unlike the SI option, SendEvent is used instead of SendPlay when SendInput is unavailable.

<a id="T"></a>

**T:** Send the replacement text using [Text mode](lib/Send.md#SendText). That is, send each character by character code, without translating {Enter} to `Enter`, ^c to `Ctrl`+`C`, etc. and without translating each character to a keystroke. This option is put into effect automatically for hotstrings that have a [continuation section](#continuation). Use **T0** or **R0** to turn this option back off, or override it with **R**.

<a id="X"></a>

**X:** Execute. Instead of replacement text, the hotstring accepts a function call or expression to execute. For example, `:X:~mb::MsgBox` would cause a message box to be displayed when the user types "~mb" instead of auto-replacing it with the word "MsgBox". This is most useful when defining a large number of hotstrings which call functions, as it would otherwise require three lines per hotstring.

This option should not be used with the [Hotstring](lib/Hotstring.md) function. To make a hotstring call a function when triggered, pass the function by reference.

<a id="z"></a>

**Z:** This rarely-used option resets the hotstring recognizer after each triggering of the hotstring. In other words, the script will begin waiting for an entirely new hotstring, eliminating from consideration anything you previously typed. This can prevent unwanted triggerings of hotstrings. To illustrate, consider the following hotstring:

```ahk
:b0*?:11::
{
    Send "xx"
}
```

Since the above lacks the Z option, typing 111 (three consecutive 1's) would trigger the hotstring twice because the middle 1 is the *last* character of the first triggering but also the *first* character of the second triggering. By adding the letter Z in front of b0, you would have to type four 1's instead of three to trigger the hotstring twice. Use **Z0** to turn this option back off.

<a id="continuation"></a>
## Long Replacements

Hotstrings that produce a large amount of replacement text can be made more readable and maintainable by using a [continuation section](Scripts.md#continuation). For example:

```ahk
::text1::
(
Any text between the top and bottom parentheses is treated literally.
By default, the hard carriage return (Enter) between the previous line and this one is also preserved.
    By default, the indentation (tab) to the left of this line is preserved.
)
```

See [continuation section](Scripts.md#continuation) for how to change these default behaviors. The presence of a continuation section also causes the hotstring to default to [Text mode](#T). The only way to override this special default is to specify an opposing option in each hotstring that has a continuation section (e.g. `:t0:text1::` or `:r:text2::`).

<a id="variant"></a>
## Context-sensitive Hotstrings

The [#HotIf](lib/_HotIf.md) directive can be used to make selected hotstrings context sensitive. Such hotstrings send a different replacement, perform a different action, or do nothing at all depending on any condition, such as the type of window that is active. For example:

```ahk
#HotIf WinActive("ahk_class Notepad")
::btw::This replacement text will appear only in Notepad.
#HotIf
::btw::This replacement text appears in windows other than Notepad.
```

<a id="AutoCorrect"></a>
## AutoCorrect

The following script uses hotstrings to correct about 4700 common English misspellings on-the-fly. It also includes a `Win`+`H` hotkey to make it easy to add more misspellings:

Download: [AutoCorrect.ahk](https://www.autohotkey.com/download/AutoCorrect.ahk) (127 KB)

Author: [Jim Biancolo](http://www.biancolo.com/blog/autocorrect/) and [Wikipedia's Lists of Common Misspellings](https://en.wikipedia.org/wiki/Wikipedia:Lists_of_common_misspellings)

## Remarks

[Expressions](Variables.md#Expressions) are not currently supported within the replacement text. To work around this, don't make such hotstrings [auto-replace](#auto). Instead, use the [Send](lib/Send.md) function in the body of the hotstring or in combination with the [X (execute) option](#X).

To send an extra space or tab after a replacement, include the [escape sequence](misc/EscapeChar.md) `` `s `` or `` `t `` at the end of the replacement, e.g. ``:*:btw::by the way`s``.

<a id="ReplaceBrace"></a>

For an auto-replace hotstring which doesn't use the [Text](#T) or [Raw](#raw) mode, sending a `{` alone, or one preceded only by white-space, requires it being enclosed in a pair of brackets, for example `:*:brace::{{}` and `:*:space_brace:: {{}`. Otherwise it is interpreted as the opening brace for the hotstring's function to support the [OTB (One True Brace) style](lib/Block.md#otb).

<a id="NoMouse"></a>

By default, any click of the left or right mouse button will reset the hotstring recognizer. In other words, the script will begin waiting for an entirely new hotstring, eliminating from consideration anything you previously typed (if this is undesirable, specify the line `#Hotstring NoMouse` anywhere in the script). This "reset upon mouse click" behavior is the default because each click typically moves the text insertion point (caret) or sets keyboard focus to a new control/field. In such cases, it is usually desirable to: 1) fire a hotstring even if it lacks the [question mark option](#Question); 2) prevent a firing when something you type after clicking the mouse accidentally forms a valid abbreviation with what you typed before.

<a id="focus-reset"></a>

The hotstring recognizer checks the active window each time a character is typed, and resets if a different window is active than before. If the active window changes but reverts before any characters are typed, the change is not detected (but the hotstring recognizer may be reset for some other reason). The hotstring recognizer can also be reset by calling `Hotstring "Reset"`.

The built-in variable **A_EndChar** contains the ending character that you typed to trigger the most recent non-auto-replace hotstring. If no ending character was required (due to the [\* option](#Asterisk)), this variable will be blank. A_EndChar is useful when making hotstrings that use the Send function or whose behavior should vary depending on which ending character you typed. To send the ending character itself, use `SendText A_EndChar` ([SendText](lib/Send.md) is used because characters such as !{} would not be sent correctly by the normal Send function).

Although single-colons within hotstring definitions do not need to be [escaped](misc/EscapeChar.md) unless they precede the double-colon delimiter, backticks and those semicolons having a space or tab to their left must always be escaped. See [Escape Sequences](misc/EscapeChar.md) for a complete list.

Although the [Send function](lib/Send.md)'s special characters such as {Enter} are supported in [auto-replacement text](#auto) (unless the [raw option](#raw) is used), the hotstring abbreviations themselves do not use this. Instead, specify \`n for `Enter` and \`t (or a literal tab) for `Tab` (see [Escape Sequences](misc/EscapeChar.md) for a complete list). For example, the hotstring ``:*:ab`t::`` would be triggered when you type "ab" followed by a tab.

Spaces and tabs are treated literally within hotstring definitions. For example, the following would produce two different results: `::btw::by the way` and `::btw:: by the way`.

Each hotstring abbreviation can be no more than 40 characters long. The program will warn you if this length is exceeded. By contrast, the length of hotstring's replacement text is limited to about 5000 characters when the [sending mode](#SendMode) is at its default of SendInput. That limit can be removed by switching to one of the other [sending modes](#SendMode), or by using [SendPlay](lib/Send.md) or [SendEvent](lib/Send.md) in the body of the hotstring or in combination with the [X (execute) option](#X).

The order in which hotstrings are defined determines their precedence with respect to each other. In other words, if more than one hotstring matches something you type, only the one listed first in the script will take effect. Related topic: [context-sensitive hotstrings](#variant).

Any backspacing you do is taken into account for the purpose of detecting hotstrings. However, the use of `↑`, `→`, `↓`, `←`, `PgUp`, `PgDn`, `Home`, and `End` to navigate within an editor will cause the hotstring recognition process to reset. In other words, it will begin waiting for an entirely new hotstring.

A hotstring may be typed even when the active window is ignoring your keystrokes. In other words, the hotstring will still fire even though the triggering abbreviation is never visible. In addition, you may still press `Backspace` to undo the most recently typed keystroke (even though you can't see the effect).

A hotstring's function can be called explicitly by the script only if the function has been named. See [Named Function Hotstrings](#Function).

Hotstrings are not monitored and will not be triggered while input is blocked by an invisible [Input hook](lib/InputHook.md).

<a id="InputLevel"></a>

By default, hotstrings are never triggered by keystrokes produced by any AutoHotkey script. This avoids the possibility of an infinite loop where hotstrings trigger each other over and over. This behavior can be controlled with [#InputLevel](lib/_InputLevel.md) and [SendLevel](lib/SendLevel.md). However, auto-replace hotstrings always use send level 0 and therefore never trigger [hook hotkeys](lib/_UseHook.md) or hotstrings.

The [Suspend](lib/Suspend.md) function can temporarily disable all hotstrings except for ones you make exempt. For greater selectivity, use [#HotIf](lib/_HotIf.md).

Hotstrings can be created dynamically by means of the [Hotstring](lib/Hotstring.md) function, which can also modify, disable, or enable the script's existing hotstrings individually.

The [InputHook](lib/InputHook.md) function is more flexible than hotstrings for certain purposes. For example, it allows your keystrokes to be invisible in the active window (such as a game). It also supports non-character ending keys such as `Esc`.

The [keyboard hook](lib/InstallKeybdHook.md) is automatically used by any script that contains hotstrings.

Hotstrings behave identically to hotkeys in the following ways:

- They are affected by the [Suspend](lib/Suspend.md) function.
- They obey [#MaxThreads](lib/_MaxThreads.md) and [#MaxThreadsPerHotkey](lib/_MaxThreadsPerHotkey.md) (but not [#MaxThreadsBuffer](lib/_MaxThreadsBuffer.md)).
- Scripts containing hotstrings are automatically [persistent](Scripts.md#persistent).
- Non-auto-replace hotstrings will create a new [thread](misc/Threads.md) when launched. In addition, they will update the built-in hotkey variables such as [A_ThisHotkey](Variables.md#ThisHotkey).

Known limitation: On some systems in Java applications, hotstrings might interfere with the user's ability to type diacritical letters (via dead keys). To work around this, [Suspend](lib/Suspend.md) can be turned on temporarily (which disables all hotstrings).

<a id="Function"></a>
## Named Function Hotstrings

If the function of a hotstring is ever needed to be called without triggering the hotstring itself, one or more hotstrings can be assigned a named [function](Functions.md) by simply defining it immediately after the hotstring's double-colon, as in this example:

```ahk
; This example also demonstrates one way to implement case conformity in a script.
:C:BTW::  ; Typed in all-caps.
:C:Btw::  ; Typed with only the first letter upper-case.
: :btw::  ; Typed in any other combination.
    case_conform_btw(hs) ; hs will hold the name of the hotstring which triggered the function.
    {
        if (hs == ":C:BTW")
            Send "BY THE WAY"
        else if (hs == ":C:Btw")
            Send "By the way"
        else
            Send "by the way"
    }
```

If the function *case_conform_btw* is ever called explicitly by the script, the first parameter (hs) must be passed a value.

[Hotkeys](Hotkeys.md) can also be defined this way. Multiple hotkeys or hotstrings can be stacked together to call the same function.

There must only be whitespace or comments between the hotstring and the function name.

Naming the function also encourages self-documenting hotstrings, like in the code above where the function name describes the hotstring.

The [Hotstring](lib/Hotstring.md) function can also be used to assign a function or function object to a hotstring.

<a id="Helper"></a>
## Hotstring Helper

Take a look at the [first example](lib/Hotstring.md#ExHelper) in the example section of the [Hotstring](lib/Hotstring.md) function's page, which might be useful if you are a heavy user of hotstrings. By pressing `Win`+`H` (or another hotkey of your choice), the currently selected text can be turned into a hotstring. For example, if you have "by the way" selected in a word processor, pressing `Win`+`H` will prompt you for its abbreviation (e.g. btw), add the new hotstring to the script and activate it.
