# HotIf / HotIfWin...

Specifies the criteria for subsequently created or modified [hotkey variants](Hotkey.md#variant) and [hotstring variants](Hotstring.md#variant).

<a id="If"></a>
## HotIf

```ahk
HotIf "Expression"
HotIf Callback
```

<a id="HotIf_Parameters"></a>
### Parameters

**"Expression"**

Type: [String](../Concepts.md#strings)

If omitted, blank criteria will be set (turns off context-sensitivity). Otherwise, the criteria will be set to an existing [#HotIf](_HotIf.md) expression. The expression is usually written as a [quoted string](../Language.md#strings), but can also be a variable or expression which returns text matching a #HotIf expression.

> **Note:** The HotIf function uses the string that you pass to it, not the original source code. [Escape sequences](../misc/EscapeChar.md) are resolved when the script loads, so only the resulting characters are considered; for example, ``HotIf 'x = "`t"'`` and `HotIf 'x = "' A_Tab '"'` both correspond to ``#HotIf x = "`t"``.

For an example, see [#HotIf example #5](_HotIf.md#ExDynamic).

**Callback**

Type: [Function Object](../misc/Functor.md)

If omitted, blank criteria will be set (turns off context-sensitivity). Otherwise, the criteria will be set to a given function object. Subsequently-created hotkeys/hotstrings will only execute if the callback returns a non-zero number. This is like `HotIf "Expression"`, except that each hotkey/hotstring can have many [hotkey variants](Hotkey.md#variant) or [hotstring variants](Hotstring.md#variant) (one per object).

The callback accepts one parameter and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(HotkeyName) { ...
```

Although the name you give the parameter does not matter, it is assigned the [hotkey name](../Hotkeys.md#ThisHotkey) or [hotstring name](../Hotstrings.md#ThisHotkey).

You can omit the callback's parameter if the corresponding information is not needed, but in this case an asterisk must be specified, e.g. `MyCallback(*)`.

Once passed to the HotIf function, the object will never be deleted (but memory will be reclaimed by the OS when the process exits).

For an example, see [example #2](#ExHotIfCallback) below or [Hotkey example #6](Hotkey.md#ExampleIfFn).

<a id="IfWin"></a>
## HotIfWin...

```ahk
HotIfWinActive WinTitle, WinText
HotIfWinExist WinTitle, WinText
HotIfWinNotActive WinTitle, WinText
HotIfWinNotExist WinTitle, WinText
```

<a id="HotIfWin_Parameters"></a>
### Parameters

**WinTitle, WinText**

Type: [String](../Concepts.md#strings)

If both are omitted, blank criteria will be set (turns off context-sensitivity). Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility). Depending on which function is called, affected hotkeys/hotstrings are in effect only while the target window is active, exists, is not active, or does not exist.

Since the parameters are evaluated before the function is called, any variable reference becomes permanent at that moment. In other words, subsequent changes to the contents of the variable are not seen by existing hotkeys/hotstrings.

*WinTitle* and *WinText* have the same meaning as for [WinActive](WinActive.md) or [WinExist](WinExist.md), but only strings can be used, and they are evaluated according to the default settings for [SetTitleMatchMode](SetTitleMatchMode.md) and [DetectHiddenWindows](DetectHiddenWindows.md) as set by the [auto-execute thread](../Scripts.md#auto).

For an example, see [example #1](#ExHotIfWin) below.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown if HotIf's parameter is invalid, such as if it does not match an existing expression or is not a valid callback function.

<a id="remarks"></a>
## General Remarks

The HotIf and HotIfWin functions allow context-sensitive [hotkeys](../Hotkeys.md) and [hotstrings](../Hotstrings.md) to be created and modified while the script is running (by contrast, the [#HotIf](_HotIf.md) directive is positional and takes effect before the script begins executing). For example:

```ahk
HotIfWinActive "ahk_class Notepad"
Hotkey "^!e", MyFuncForNotepad  ; Creates a hotkey that works only in Notepad.
Hotstring "::btw", "by the way"  ; Creates a hotstring that works only in Notepad.
```

Using HotIf or one of the HotIfWin functions puts context sensitivity into effect for all subsequently created hotkeys/hotstrings in the current [thread](../misc/Threads.md), and affects which hotkey/hotstring variants the [Hotkey](Hotkey.md) or [Hotstring](Hotstring.md) function modifies. Only the most recent call to the HotIf or HotIfWin function in the current thread will be in effect.

To turn off context sensitivity (such as to make subsequently-created hotkeys/hotstrings work in all windows), call HotIf or one of the HotIfWin functions but omit the parameters. For example: `HotIf` or `HotIfWinActive`.

Before HotIf or one of the HotIfWin functions is used in a hotkey/hotstring [thread](../misc/Threads.md), the [Hotkey](Hotkey.md) and [Hotstring](Hotstring.md) functions default to the same context as the hotkey/hotstring that launched the thread. In other words, `Hotkey A_ThisHotkey, "Off"` turns off the current hotkey even if it is context-sensitive. All other threads default to creating or modifying global hotkeys/hotstrings, unless that default is overridden by using HotIf or one of the HotIfWin functions during [script startup](../Scripts.md#auto).

When a mouse or keyboard hotkey is disabled via HotIf, one of the HotIfWin functions, or the [#HotIf](_HotIf.md) directive, it performs its native function; that is, it passes through to the active window as though there is no such hotkey. However, controller hotkeys always pass through, whether they are disabled or not.

<a id="Related"></a>
## Related

[Hotkeys](../Hotkeys.md), [Hotstrings](../Hotstrings.md), [Hotkey function](Hotkey.md), [Hotstring function](Hotstring.md), [#HotIf](_HotIf.md), [Threads](../misc/Threads.md)

## Examples

<a id="ExHotIfWin"></a>

**Example:** Similar to [#HotIf example #1](_HotIf.md#ExBasic), this creates two hotkeys and one hotstring which only work when Notepad is active, and one hotkey which works for any window except Notepad. The main difference is that this example creates context-sensitive hotkeys and hotstrings at runtime, while the #HotIf example creates them at loadtime.

```ahk
HotIfWinActive "ahk_class Notepad"
Hotkey "^!a", ShowMsgBox
Hotkey "#c", ShowMsgBox
Hotstring "::btw", "This replacement text will occur only in Notepad."
HotIfWinActive
Hotkey "#c", (*) => MsgBox("You pressed Win-C in a window other than Notepad.")

ShowMsgBox(HotkeyName)
{
    MsgBox "You pressed " HotkeyName " while Notepad is active."
}
```

<a id="ExHotIfCallback"></a>

**Example:** Similar to the example above, but with a callback.

```ahk
HotIf MyCallback
Hotkey "^!a", ShowMsgBox
Hotkey "#c", ShowMsgBox
Hotstring "::btw", "This replacement text will occur only in Notepad."
HotIf
Hotkey "#c", (*) => MsgBox("You pressed Win-C in a window other than Notepad.")

MyCallback(*)
{
    if WinActive("ahk_class Notepad")
        return true
    else
        return false
}

ShowMsgBox(HotkeyName)
{
    MsgBox "You pressed " HotkeyName " while Notepad is active."
}
```
