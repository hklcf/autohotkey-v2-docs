# How to Send Keystrokes

```ahk
Send "Hello, world{!}{Left}^+{Left}"
```

Sending keystrokes (or keys for short) is the most common method of automating programs, because it is the one that works most generally. More direct methods tend to work only in particular types of app.

There are broadly two parts to learning how to send keys:

1. How to write the code so that the program knows which keys you want to send.
2. How to use the available modes and options to get the right end result.

It is important to understand that sending a key does not perfectly replicate the act of physically pressing the key, even if you slow it down to human speeds. But before we go into that, we'll cover some basics.

<a id="Trying_the_examples"></a>
## Trying the examples

If you run an example like `SendText "Hi!"`, the text will be immediately sent to the active (focused) window, which might be less than useful depending on how you ran the example. It's usually better to define a hotkey, run the example to load it up, and press the hotkey when you want to test its effect. Some of the examples below will use numbered hotkeys like `^1::` (`Ctrl` and a number, so you can try multiple examples at once if there are no duplicates), but you can change that to whatever suits you.

To learn how to customize the hotkeys or create your own, see [How to Write Hotkeys](WriteHotkeys.md).

If you're not sure how to try out the examples, see [How to Run Example Code](RunExamples.md).

<a id="How_to_write_the_code"></a>
## How to write the code

When sending keys, you generally want to either send a key or key combination for its effect (like `Ctrl`+`C` to copy to the clipboard), or type some text. Typing text is simpler, so we'll start there: just call the [SendText](../lib/Send.md) function, [passing](../Concepts.md#pass-parameters) it the exact text you want to send.

```ahk
^1::SendText "To Whom It May Concern"
```

Technically SendText actually sends Unicode character packets and not keystrokes, and that makes it much more reliable for characters that are normally typed with a key-combination like `Shift`+`2` or `AltGr`+`a`.

<a id="Rules_of_quoted_strings"></a>
### Rules of quoted strings

SendText sends the text verbatim, but keep in mind the rules of the [language](../Language.md). For instance, [literal text](../Language.md#strings) must be enclosed in quote marks (double `"` or single `'`), and the quote marks themselves aren't "seen" by the SendText function. To send a literal quote mark, you can enclose it in the opposite type of quote mark. For example:

```ahk
^2::SendText 'Quote marks are also known as "quotes".'
```

Alternatively, use an [escape sequence](../misc/EscapeChar.md). Inside a quoted string, `` `" `` translates to a literal `"` and `` `' `` translates to a literal `'`. For example:

```ahk
^3::{
    SendText "Double quote (`")"
    SendText 'Single quote (`')'
}
```

You can also alternate the quote marks:

```ahk
^4::SendText 'Double (") and' . " single (') quote"
```

The two strings are joined together ([concatenated](../Variables.md#concat)) before being passed to the SendText function. The dot (`.`) can be omitted, but that makes it harder to see where one ends and the other begins.

As you've seen above, the escape character `` ` `` (known by *backquote*, *backtick*, *grave accent* and other names) has special meaning, so if you want to send that character literally (or send the corresponding key), you need to double it up, as in ```Send "``"```. Other common escape sequences include `` `n `` for linefeed (Enter) and `` `t `` for tab. See [Escape Sequences](../misc/EscapeChar.md) for more.

<a id="Sending_keys_and_key_combinations"></a>
### Sending keys and key combinations

[SendText](../lib/Send.md) is best for sending text verbatim, but it can't send keys that don't produce text, like `Left` or `Home`. [Send](../lib/Send.md), [SendInput](../lib/Send.md), [SendPlay](../lib/Send.md), [SendEvent](../lib/Send.md) and [ControlSend](../lib/ControlSend.md) can send both text and key combinations, or keys which don't produce text. To do all of this, they add special meaning to the following symbols: `^!+#{}`

The first four symbols correspond to the standard modifier keys, Ctrl (`^`), Alt (`!`), Shift (`+`) and Win (`#`). They can be used in combination, but otherwise affect only the next key.

To send a key by name, or to send any one of the above symbols literally, enclose it in braces. For example:

- `^+{Left}` produces `Ctrl`+`Shift`+`Left`
- `^{+}{Left}` produces `Ctrl`+`+` followed by `Left`
- `^+Left` produces `Ctrl`+`Shift`+`L` followed literally by the letters `eft`

When you press `Ctrl`+`Shift`+`"`, the following example sends two quote marks and then moves the insertion point to the left, ready to type inside the quote marks:

```ahk
^+"::Send '""{Left}'
```

For any single character other than `^!+#{}`, Send translates it to the corresponding key combination and presses and releases that combination. For example, `Send "aB"` presses and releases `A` and then presses and releases `Shift`+`B`. Similarly, any key name enclosed in braces is pressed and released by default. For example, `Send "{Ctrl}a"` would press and release `Ctrl`, then press and release `A`; probably not what you want.

To only press (hold down) or release a key, enclose the key name in braces, followed by a space and then the word "down" or "up". The following example causes `Ctrl`+`CapsLock` to act as a toggle for `Shift`:

```ahk
*^CapsLock::{
    if GetKeyState("Shift")
        Send "{Shift up}"
    else
        Send "{Shift down}"
}
```

<a id="Hotkeys_vs_Send"></a>
### Hotkeys vs. Send

> **Warning:** Hotkeys and Send have some differences that you should be aware of.

Although [hotkeys](../Hotkeys.md) also use the symbols `^!+#` and the same key names, there are several important differences:

- Other hotkey modifier symbols are not supported by Send. For example, `>^a::` corresponds to `RCtrl`+`A`, but to send that combination, you need to spell out the key name in full, as in `Send "{RCtrl down}a{RCtrl up}"`.
- Key names are never enclosed in braces within hotkeys, but must always be enclosed in braces for Send (if longer than one character).
- Send is case-sensitive. For example, `Send "^A"` sends the combination of `Ctrl` with *upper-case* "a", so `Ctrl`+`Shift`+`A`. By contrast, `^a::` and `^A::` are equivalent.

This is because Send serves multiple purposes, whereas hotkeys are optimized for key combinations.

On a related note, [hotstrings](../Hotstrings.md) are exclusively for detecting text entry, so the symbols `^!+#{}` have no special meaning within the hotstring trigger text. However, a hotstring's *replacement* text uses the same syntax as Send (except when the [T option](../Hotstrings.md#T) is used). Whenever you type "{" with the following hotstring active, it sends "}" and then `Left` to move the insertion point back between the braces:

```ahk
:*?B0:{::{}}{Left}
```

<a id="Blind_mode"></a>
### Blind mode

Normally, Send assumes that any modifier keys you are physically holding down should not be combined with the keys you are asking it to send. For instance, if you are holding `Ctrl` and you call `Send "Hi"`, Send will automatically release `Ctrl` before sending "Hi" and press it back down afterward.

Sometimes what you want is to send some keys in combination with other modifiers that were previously pressed or sent. To do this, you can use the `{Blind}` prefix. While running the following example, try focusing a non-empty text editor or input field and pressing `1` or `2` while holding `Ctrl` or `Ctrl`+`Shift`:

```ahk
*^1::Send "{Blind}{Home}"
*^2::Send "{Blind}{End}"
```

For more about `{Blind}`, see [Blind mode](../lib/Send.md#Blind).

<a id="Others"></a>
### Others

Send supports a few other special constructs, such as:

- `{U+00B5}` to send a Unicode character by its ordinal value (character code).
- `{ASC 0181}` to send an Alt+Numpad sequence.
- `{Click Options}` to click or move the mouse.

For a full list, see [Key names](../lib/Send.md#keynames).

<a id="Modes_and_options"></a>
## Modes and options

Sending a key does not perfectly replicate the act of physically pressing the key. The operating system provides several different ways to send keys, with different caveats for each. Sometimes to get the result you want, you will need to not only try different methods but also tweak the timing.

The [main methods](../lib/Send.md#Send_Variants) are SendInput, SendEvent and SendPlay. SendInput is generally the most reliable, so by default, Send is synonymous with SendInput. [SendMode](../lib/SendMode.md) can be used to make Send synonymous with SendEvent or SendPlay instead. The documentation describes other pros and cons of [SendInput](../lib/SendMode.md#Input) and [SendPlay](../lib/SendMode.md#Play) at length, but I would suggest just trying SendEvent or SendPlay when you have issues with SendInput.

> **Warning:** SendPlay doesn't tend to work on modern systems unless you [run with UI access](../Program.md#Installer_uiAccess). On Windows 11 and later, SendPlay may have no effect at all.

Another option worth trying is [ControlSend](../lib/ControlSend.md). This doesn't use an official method of sending keystrokes, but instead sends messages directly to the window that you specify. The main advantage is that the window usually doesn't need to be active to receive these messages. But since it bypasses the normal processing of keyboard input by the system, sometimes it doesn't work.

<a id="Timing_and_delays"></a>
### Timing and delays

Sometimes you can get away with sending a flood of keystrokes faster than humanly possible, and sometimes you can't. There are generally two situations where you might need a delay:

- A keypress is supposed to trigger some change within the target app (such as showing a new control or window), and sending another keypress before that happens will have the wrong effect.
- The app can't keep up with a rapid stream of keystrokes, and you need to slow them all down.

For the first case, you can simply call Send, then [Sleep](../lib/Sleep.md), then Send, and so on.

[SetKeyDelay](../lib/SetKeyDelay.md) exists for the second case. This function can set a delay to be performed between each keystroke, and the duration of the keystroke (i.e. the delay between pressing and releasing the key).

```ahk
^1::{
    SetKeyDelay 75, 25  ; 75ms between keys, 25ms between down/up.
    SendEvent "You should see the keys{bs 4}text appear gradually."
}
```

> **Warning:** SendInput does not support key delays, nor does Send by default.

In order to make SetKeyDelay effective, you must generally either use `SendMode "Event"` or call SendEvent, SendPlay or ControlSend instead of Send or SendText.

<a id="Sending_a_lot_of_text"></a>
## Sending a lot of text

One way to send multiple lines of text is to use a [continuation section](../Scripts.md#continuation-section):

```ahk
SendText "
(
    Leading indentation is stripped out,
    based on the first line.
    Line breaks are kept
    unless you use the "Join" option.
)"
```

Although it is generally quite fast, SendText still has to send each character one at a time, while Send generally needs to send at least twice as many messages (key-down *and* key-up). This adds up to a noticeable delay when sending a large amount of text. It can also become unreliable, as a longer delay means higher risk of conflict with input by the user, the keyboard focus shifting, or other conditions changing.

Generally it is faster and more reliable to instead place the text on the clipboard and *paste* it. For example:

```ahk
^1::{
    old_clip := ClipboardAll()  ; Save all clipboard content
    A_Clipboard := "
    (Join`s
        This text is placed on the clipboard,
        and will be pasted below by sending Ctrl+V.
    )"
    Send "^v"
    Sleep 500  ; Wait a bit for Ctrl+V to be processed
    A_Clipboard := old_clip  ; Restore previous clipboard content
}
```
