# InputHook

Creates an object which can be used to collect or intercept keyboard input.

```ahk
InputHookObj := InputHook(Options, EndKeys, MatchList)
```

<a id="Parameters"></a>
## Parameters

**Options**

Type: [String](../Concepts.md#strings)

A string of zero or more of the following options (in any order, with optional spaces in between):

<a id="option-b"></a>

**B:** Sets [BackspaceIsUndo](#BackspaceIsUndo) to 0 (false), which causes `Backspace` to be ignored.

<a id="option-c"></a>

**C:** Sets [CaseSensitive](#CaseSensitive) to 1 (true), making *MatchList* case-sensitive.

<a id="option-i"></a>

**I:** Sets [MinSendLevel](#MinSendLevel) to 1 or a given value, causing any input with [send level](SendLevel.md) below this value to be ignored. For example, `I2` would ignore any input with a level of 0 (the default) or 1, but would capture input at level 2.

<a id="option-l"></a>

**L:** Length limit (e.g. `L5`). The maximum allowed length of the input. When the text reaches this length, the Input is terminated and [EndReason](#EndReason) is set to the word Max (unless the text matches one of the *MatchList* phrases, in which case [EndReason](#EndReason) is set to the word Match). If unspecified, the length limit is 1023.

Specifying `L0` disables collection of text and the length limit, but does not affect which keys are counted as producing text (see [VisibleText](#VisibleText)). This can be useful in combination with [OnChar](#OnChar), [OnKeyDown](#OnKeyDown), [KeyOpt](#KeyOpt) or the *EndKeys* parameter.

<a id="option-m"></a>

**M:** Allows a greater range of modified keypresses to produce text. Normally, a key is treated as non-text if it is modified by any combination *other than* `Shift`, `Ctrl`+`Alt` (i.e. `AltGr`) or `Ctrl`+`Alt`+`Shift` (i.e. `AltGr`+`Shift`). This option causes translation to be attempted for other combinations of modifiers. Consider this example, which typically recognizes `Ctrl`+`C`:

```ahk
CtrlC := Chr(3) ; Store the character for Ctrl-C in the CtrlC var.
ih := InputHook("L1 M")
ih.Start()
ih.Wait()
if (ih.Input = CtrlC)
    MsgBox "You pressed Control-C."
```

By default, the system maps `Ctrl`+`A` through `Ctrl`+`Z` to ASCII control characters [Chr(1)](Chr.md) through [Chr(26)](Chr.md). Other translations may be defined by the system or the active window's keyboard layout. Translation may ignore any modifier key for which the keyboard layout does not define a modifier bitmask. For example, `Win`+`E` typically transcribes to "e" if the M option is used.

The M option might cause some keyboard shortcuts such as `Ctrl`+`←` to misbehave while an Input is in progress.

<a id="option-t"></a>

**T:** Sets [Timeout](#Timeout) (e.g. `T3` or `T2.5`).

<a id="vis"></a>

**V:** Sets [VisibleText](#VisibleText) and [VisibleNonText](#VisibleNonText) to 1 (true). By default, only textual input is blocked (hidden from the system). Use this option to have all of the user's keystrokes sent to the active window.

<a id="asterisk"></a>

**\*:** Wildcard. Sets [FindAnywhere](#FindAnywhere) to 1 (true), allowing matches to be found anywhere within what the user types.

<a id="E"></a>

**E:** Handle single-character end keys by character code instead of by keycode. This provides more consistent results if the active window's keyboard layout is different to the script's keyboard layout. It also prevents key combinations which don't actually produce the given end characters from ending input; for example, if @ is an end key, on the US layout `Shift`+`2` will trigger it but `Ctrl`+`Shift`+`2` will not (if the [E option](#E) is used). If the [C option](#option-c) is also used, the end character is case-sensitive.

<a id="EndKeys"></a>

**EndKeys**

Type: [String](../Concepts.md#strings)

A list of zero or more keys, any one of which terminates the Input when pressed (the end key itself is not written to the Input buffer). When an Input is terminated this way, [EndReason](#EndReason) is set to the word EndKey and [EndKey](#EndKey) is set to the name of the key.

*EndKeys* uses a format similar to the [Send](Send.md) function. For example, specifying `"{Enter}.{Esc}"` would cause either `Enter`, `.`, or `Esc` to terminate the Input. To use the braces themselves as end keys, specify `{{}` and/or `{}}`.

To use `Ctrl`, `Alt`, or `Shift` as end keys, specify the left and/or right version of the key, not the neutral version. For example, specify `"{LControl}{RControl}"` rather than `"{Control}"`.

Although modified keys such as `Alt`+`C` (!c) are not supported, non-alphanumeric characters such as `?!:@&{}` by default require `Shift` or `AltGr` to be pressed or not pressed depending on how the character is normally typed. If the [E option](#E) is present, single character key names are interpreted as characters instead, and in those cases the modifier keys must be in the correct state to produce that character. When both the [E option](#E) and [M option](#option-m) are used, `Ctrl`+`A` through `Ctrl`+`Z` are supported by including the corresponding ASCII control characters in *EndKeys*.

An explicit key code such as `{vkFF}` or `{sc001}` may also be specified. This is useful in the rare case where a key has no name and produces no visible character when pressed. Its key code can be determined by following the steps at the bottom of the [key list page](../KeyList.md#SpecialKeys).

<a id="MatchList"></a>

**MatchList**

Type: [String](../Concepts.md#strings)

A comma-separated list of key phrases, any of which will cause the Input to be terminated (in which case [EndReason](#EndReason) will be set to the word Match). The entirety of what the user types must exactly match one of the phrases for a match to occur (unless the [\* option](#asterisk) is present). In addition, **any spaces or tabs around the delimiting commas are significant**, meaning that they are part of the match string. For example, if *MatchList* is `"ABC , XYZ"`, the user must type a space after ABC or before XYZ to cause a match.

Two consecutive commas results in a single literal comma. For example, the following would produce a single literal comma at the end of string1: `"string1,,,string2"`. Similarly, the following list contains only a single item with a literal comma inside it: `"single,,item"`.

Because the items in *MatchList* are not treated as individual parameters, the list can be contained entirely within a variable. For example, *MatchList* might consist of `List1 "," List2 "," List3` -- where each of the variables contains a large sub-list of match phrases.

<a id="stack"></a>
## Input Stack

Any number of InputHook objects can be created and in progress at any time, but the order in which they are started affects how input is collected.

When each Input is started (by the [Start](#Start) method), it is pushed onto the top of a stack, and is removed from this stack only when the Input is terminated. Keyboard events are passed to each Input in order of most recently started to least. If an Input suppresses a given keyboard event, it is passed no further down the stack.

[Sent](Send.md) keystrokes are ignored if the [send level](SendLevel.md) of the keystroke is below the InputHook's [MinSendLevel](#MinSendLevel). In such cases, the keystroke may still be processed by an Input lower on the stack.

Multiple InputHooks can be used in combination with [MinSendLevel](#MinSendLevel) to separately collect both sent keystrokes and real ones.

<a id="object"></a>
## InputHook Object

The InputHook function returns an InputHook object, which has the following methods and properties.

"InputHookObj" is used below as a placeholder for any InputHook object, as "InputHook" is the class itself.

- [Methods](#Methods):
    - [KeyOpt](#KeyOpt): Sets options for a key or list of keys.
    - [Start](#Start): Starts collecting input.
    - [Stop](#Stop): Terminates the Input and sets EndReason to the word Stopped.
    - [Wait](#Wait): Waits until the Input is terminated (InProgress is false).
- [General Properties](#General_Properties):
    - [EndKey](#EndKey): Gets the name of the end key which was pressed to terminate the Input.
    - [EndMods](#EndMods): Gets a string of the modifiers which were logically down when Input was terminated.
    - [EndReason](#EndReason): Gets an EndReason string indicating how Input was terminated.
    - [InProgress](#InProgress): Gets 1 (true) if the Input is in progress, otherwise 0 (false).
    - [Input](#Input): Gets any text collected since the last time Input was started.
    - [Match](#Match): Gets the *MatchList* item which caused the Input to terminate.
    - [OnEnd](#OnEnd): Gets or sets the function object which is called when Input is terminated.
    - [OnChar](#OnChar): Gets or sets the function object which is called after a character is added to the input buffer.
    - [OnKeyDown](#OnKeyDown): Gets or sets the function object which is called when a notification-enabled key is pressed.
    - [OnKeyUp](#OnKeyUp): Gets or sets the function object which is called when a notification-enabled key is released.
- [Option Properties](#Option_Properties):
    - [BackspaceIsUndo](#BackspaceIsUndo): Gets or sets whether the Backspace key removes the most recently pressed character from the end of the Input buffer.
    - [CaseSensitive](#CaseSensitive): Gets or sets whether *MatchList* is case-sensitive.
    - [FindAnywhere](#FindAnywhere): Gets or sets whether each match can be a substring of the input text.
    - [MinSendLevel](#MinSendLevel): Gets or sets the minimum send level of input to collect.
    - [NotifyNonText](#NotifyNonText): Gets or sets whether the OnKeyDown and OnKeyUp callbacks are called whenever a non-text key is pressed.
    - [Timeout](#Timeout): Gets or sets the timeout value in seconds.
    - [VisibleNonText](#VisibleNonText): Gets or sets whether keys or key combinations which do not produce text are visible (not blocked).
    - [VisibleText](#VisibleText): Gets or sets whether keys or key combinations which produce text are visible (not blocked).

<a id="Methods"></a>
### Methods

<a id="KeyOpt"></a>

### KeyOpt

Sets options for a key or list of keys.

```ahk
InputHookObj.KeyOpt(Keys, KeyOptions)
```

<a id="KeyOpt_Parameters"></a>
#### Parameters

**Keys**

Type: [String](../Concepts.md#strings)

A list of keys. Braces are used to enclose key names, virtual key codes or scan codes, similar to the [Send](Send.md) function. For example, `"{Enter}.{{}"` would apply to `Enter`, `.` and `{`. Specifying a key by name, by `{vkNN}` or by `{scNNN}` may produce three different results; see below for details.

<a id="all-keys"></a>

Specify the string `"{All}"` (case-insensitive) on its own to apply *KeyOptions* to all VK and all SC, including `{vkE7}` and `{sc000}` as described below. KeyOpt may then be called a second time to remove options from specific keys.

<a id="sc000"></a>

Specify `{sc000}` to apply *KeyOptions* to all events which lack a scan code.

<a id="vke7"></a>

Specify `{vkE7}` to apply *KeyOptions* to Unicode events, such as those sent by `SendEvent "{U+221e}"` or `SendEvent "{Text}∞"`.

**KeyOptions**

Type: [String](../Concepts.md#strings)

One or more of the following single-character options (spaces and tabs are ignored).

<a id="KeyOpt-minus"></a>

**-** (minus): Removes any of the options following the `-`, up to the next `+`.

<a id="KeyOpt-plus"></a>

**+** (plus): Cancels any previous `-`, otherwise has no effect.

<a id="KeyOpt-e"></a>

**E:** End key. If enabled, pressing the key terminates Input, sets [EndReason](#EndReason) to the word EndKey and [EndKey](#EndKey) to the key's normalized name. Unlike the *EndKeys* parameter, the state of `Shift` or `AltGr` is ignored. For example, `@` and `2` are both equivalent to `{vk32}` on the US keyboard layout.

<a id="KeyOpt-i"></a>

**I:** Ignore text. Any text normally produced by this key is ignored, and the key is treated as a non-text key (see [VisibleNonText](#VisibleNonText)). Has no effect if the key normally does not produce text.

<a id="KeyOpt-n"></a>

**N:** Notify. Causes the [OnKeyDown](#OnKeyDown) and [OnKeyUp](#OnKeyUp) callbacks to be called each time the key is pressed.

<a id="KeyOpt-s"></a>

**S:** Suppresses (blocks) the key after processing it. This overrides [VisibleText](#VisibleText) or [VisibleNonText](#VisibleNonText) until `-S` is used. `+S` implies `-V`.

<a id="KeyOpt-v"></a>

**V:** Visible. Prevents the key from being suppressed (blocked). This overrides [VisibleText](#VisibleText) or [VisibleNonText](#VisibleNonText) until `-V` is used. `+V` implies `-S`.

<a id="KeyOpt_Remarks"></a>
#### Remarks

Options can be set by both virtual key code (VK) and scan code (SC), and are accumulative.

When a key is specified by name, options are added either by VK or by SC. Where two physical keys share the same VK but differ by SC (such as `Up` and `NumpadUp`), they are handled by SC. By contrast, if a VK number is used, it will apply to any physical key which produces that VK (and this may vary over time as it depends on the active keyboard layout).

Removing an option by VK number does not affect any options that were set by SC, or vice versa. However, when an option is removed by key name and that name is handled by VK, the option is also removed for the corresponding SC (according to the script's keyboard layout). This allows keys to be excluded by name after applying an option to [all keys](#all-keys).

To prevent an option from affecting a key, the option must be removed from both the VK and the SC of that key, or sc000 if the key has no SC.

<a id="U"></a>

Unicode events, such as those sent by `SendEvent "{U+221e}"` or `SendEvent "{Text}∞"`, are affected by options which have been set for either [vkE7](#vke7) or [sc000](#sc000). Any option applied to [{All}](#all-keys) is applied to both vkE7 and sc000, so to exclude Unicode events, remove the option from both. For example:

```ahk
InputHookObj.KeyOpt("{All}", "+I")  ; Ignore text produced by any event
InputHookObj.KeyOpt("{vkE7}{sc000}", "-I")  ; except Unicode events.
```

<a id="Start"></a>

### Start

Starts collecting input.

```ahk
InputHookObj.Start()
```

Has no effect if the Input is already in progress.

The newly started Input is placed on the top of the [InputHook stack](#stack), which allows it to override any previously started Input.

This method installs the [keyboard hook](InstallKeybdHook.md) (if it was not already).

<a id="Stop"></a>

### Stop

Terminates the Input and sets [EndReason](#EndReason) to the word Stopped.

```ahk
InputHookObj.Stop()
```

Has no effect if the Input is not in progress.

<a id="Wait"></a>

### Wait

Waits until the Input is terminated ([InProgress](#InProgress) is false).

```ahk
EndReason := InputHookObj.Wait(MaxTime)
```

<a id="Wait_Parameters"></a>
#### Parameters

**MaxTime**

Type: [Float](../Concepts.md#numbers)

If omitted, the wait is indefinitely. Otherwise, specify the maximum number of seconds to wait. If Input is still in progress after *MaxTime* seconds, the method returns and does not terminate Input.

<a id="Wait_Return_Value"></a>
#### Return Value

Type: [String](../Concepts.md#strings)

This method returns [EndReason](#EndReason).

<a id="General_Properties"></a>
### General Properties

<a id="EndKey"></a>

### EndKey

Gets the name of the [end key](#EndKeys) which was pressed to terminate the Input.

```ahk
KeyName := InputHookObj.EndKey
```

Note that EndKey returns the "normalized" name of the key regardless of how it was written in the *EndKeys* parameter. For example, `{Esc}` and `{vk1B}` both produce `Escape`. [GetKeyName](GetKeyName.md) can be used to retrieve the normalized name.

If the [E option](#E) was used, EndKey returns the actual character which was typed (if applicable). Otherwise, the key name is determined according to the script's active keyboard layout.

EndKey returns an empty string if [EndReason](#EndReason) is not "EndKey".

<a id="EndMods"></a>

### EndMods

Gets a string of the modifiers which were logically down when Input was terminated.

```ahk
Mods := InputHookObj.EndMods
```

If all modifiers were logically down (pressed), the full string is:

```
<^>^<!>!<+>+<#>#
```

These modifiers have the same meaning as with [hotkeys](../Hotkeys.md). Each modifier is always qualified with \< (left) or \> (right). The corresponding key names are: LCtrl, RCtrl, LAlt, RAlt, LShift, RShift, LWin, RWin.

[InStr](InStr.md) can be used to check whether a given modifier (such as `>!` or `^`) is present. The following line can be used to convert *Mods* to a string of neutral modifiers, such as `^!+#`:

```ahk
Mods := RegExReplace(Mods, "[<>](.)(?:>\1)?", "$1")
```

Due to split-second timing, this property may be more reliable than [GetKeyState](GetKeyState.md) even if it is used immediately after Input terminates, or in the [OnEnd](#OnEnd) callback.

<a id="EndReason"></a>

### EndReason

Gets an [EndReason string](#EndReasons) indicating how Input was terminated.

```ahk
Reason := InputHookObj.EndReason
```

If the Input is still in progress, an empty string is returned.

<a id="InProgress"></a>

### InProgress

Gets 1 (true) if the Input is in progress, otherwise 0 (false).

```ahk
Boolean := InputHookObj.InProgress
```

<a id="Input"></a>

### Input

Gets any text collected since the last time Input was started.

```ahk
String := InputHookObj.Input
```

This property can be used while the Input is in progress, or after it has ended.

<a id="Match"></a>

### Match

Gets the *[MatchList](#MatchList)* item which caused the Input to terminate.

```ahk
String := InputHookObj.Match
```

This property returns the matched item with its original case, which may differ from what the user typed if the [C option](#option-c) was omitted, or an empty string if [EndReason](#EndReason) is not "Match".

<a id="OnEnd"></a>

### OnEnd

Gets or sets the [function object](../misc/Functor.md) which is called when Input is terminated.

```ahk
MyCallback := InputHookObj.OnEnd
```

```ahk
InputHookObj.OnEnd := MyCallback
```

*MyCallback* is the [function object](../misc/Functor.md) to call. An empty string means no function object.

The callback accepts one parameter and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(InputHookObj) { ...
```

Although the name you give the parameter does not matter, it is assigned a reference to the InputHook object.

You can omit the callback's parameter if the corresponding information is not needed, but in this case an asterisk must be specified, e.g. `MyCallback(*)`.

The function is called as a new [thread](../misc/Threads.md), so starts off fresh with the default values for settings such as [SendMode](SendMode.md) and [DetectHiddenWindows](DetectHiddenWindows.md).

<a id="OnChar"></a>

### OnChar

Gets or sets the [function object](../misc/Functor.md) which is called after a character is added to the input buffer.

```ahk
MyCallback := InputHookObj.OnChar
```

```ahk
InputHookObj.OnChar := MyCallback
```

*MyCallback* is the [function object](../misc/Functor.md) to call. An empty string means no function object.

The callback accepts two parameters and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(InputHookObj, Char) { ...
```

Although the names you give the parameters do not matter, the following values are sequentially assigned to them:

1. A reference to the InputHook object.
2. A string containing the character (or multiple characters, see below for details).

You can omit one or more parameters from the end of the callback's parameter list if the corresponding information is not needed, but in this case an asterisk must be specified as the final parameter, e.g. `MyCallback(Param1, *)`.

The presence of multiple characters indicates that a dead key was used prior to the last keypress, but the two keys could not be transliterated to a single character. For example, on some keyboard layouts `` ` ```e` produces `è` while `` ` ```z` produces `` `z ``.

The function is never called when an end key is pressed.

<a id="OnKeyDown"></a>

### OnKeyDown

Gets or sets the [function object](../misc/Functor.md) which is called when a notification-enabled key is pressed.

```ahk
MyCallback := InputHookObj.OnKeyDown
```

```ahk
InputHookObj.OnKeyDown := MyCallback
```

Key-down notifications must first be enabled by [KeyOpt](#KeyOpt) or [NotifyNonText](#NotifyNonText).

*MyCallback* is the [function object](../misc/Functor.md) to call. An empty string means no function object.

The callback accepts three parameters and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(InputHookObj, VK, SC) { ...
```

Although the names you give the parameters do not matter, the following values are sequentially assigned to them:

1. A reference to the InputHook object.
2. An integer representing the virtual key code of the key.
3. An integer representing the scan code of the key.

You can omit one or more parameters from the end of the callback's parameter list if the corresponding information is not needed, but in this case an asterisk must be specified as the final parameter, e.g. `MyCallback(Param1, *)`.

To retrieve the key name (if any), use `GetKeyName(Format("vk{:x}sc{:x}", VK, SC))`.

The function is called as a new [thread](../misc/Threads.md), so starts off fresh with the default values for settings such as [SendMode](SendMode.md) and [DetectHiddenWindows](DetectHiddenWindows.md).

The function is never called when an end key is pressed.

<a id="OnKeyUp"></a>

### OnKeyUp

Gets or sets the [function object](../misc/Functor.md) which is called when a notification-enabled key is released.

```ahk
MyCallback := InputHookObj.OnKeyUp
```

```ahk
InputHookObj.OnKeyUp := MyCallback
```

Key-up notifications must first be enabled by [KeyOpt](#KeyOpt) or [NotifyNonText](#NotifyNonText). Whether a key is considered text or non-text is determined when the key is pressed. If an InputHook detects a key-up without having detected key-down, it is considered non-text.

*MyCallback* is the [function object](../misc/Functor.md) to call. An empty string means no function object.

The callback accepts three parameters and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(InputHookObj, VK, SC) { ...
```

Although the names you give the parameters do not matter, the following values are sequentially assigned to them:

1. A reference to the InputHook object.
2. An integer representing the virtual key code of the key.
3. An integer representing the scan code of the key.

You can omit one or more parameters from the end of the callback's parameter list if the corresponding information is not needed, but in this case an asterisk must be specified as the final parameter, e.g. `MyCallback(Param1, *)`.

To retrieve the key name (if any), use `GetKeyName(Format("vk{:x}sc{:x}", VK, SC))`.

The function is called as a new [thread](../misc/Threads.md), so starts off fresh with the default values for settings such as [SendMode](SendMode.md) and [DetectHiddenWindows](DetectHiddenWindows.md).

<a id="Option_Properties"></a>
### Option Properties

<a id="BackspaceIsUndo"></a>

### BackspaceIsUndo

Gets or sets whether `Backspace` removes the most recently pressed character from the end of the Input buffer.

```ahk
CurrentSetting := InputHookObj.BackspaceIsUndo
```

```ahk
InputHookObj.BackspaceIsUndo := NewSetting
```

*CurrentSetting* is *NewSetting* if assigned, otherwise 1 (true) by default unless overwritten by the [B option](#option-b).

*NewSetting* is a [boolean value](../Concepts.md#boolean) that enables or disables this setting.

When `Backspace` acts as undo, it is treated as a text entry key. Specifically, whether the key is suppressed depends on [VisibleText](#VisibleText) rather than [VisibleNonText](#VisibleNonText).

`Backspace` is always ignored if pressed in combination with a modifier key such as `Ctrl` (the logical modifier state is checked rather than the physical state).

> **Note:** If the input text is visible (such as in an editor) and the arrow keys or other means are used to navigate within it, `Backspace` will still remove the last character rather than the one behind the caret (insertion point).

<a id="CaseSensitive"></a>

### CaseSensitive

Gets or sets whether [*MatchList*](#MatchList) is case-sensitive.

```ahk
CurrentSetting := InputHookObj.CaseSensitive
```

```ahk
InputHookObj.CaseSensitive := NewSetting
```

*CurrentSetting* is *NewSetting* if assigned, otherwise 0 (false) by default unless overwritten by the [C option](#option-c).

*NewSetting* is a [boolean value](../Concepts.md#boolean) that enables or disables this setting.

<a id="FindAnywhere"></a>

### FindAnywhere

Gets or sets whether each match can be a substring of the input text.

```ahk
CurrentSetting := InputHookObj.FindAnywhere
```

```ahk
InputHookObj.FindAnywhere := NewSetting
```

*CurrentSetting* is *NewSetting* if assigned, otherwise 0 (false) by default unless overwritten by the [\* option](#asterisk).

*NewSetting* is a [boolean value](../Concepts.md#boolean) that enables or disables this setting. If true, a match can be found anywhere within what the user types (the match can be a substring of the input text). If false, the entirety of what the user types must match one of the *MatchList* phrases. In both cases, one of the *MatchList* phrases must be typed in full.

<a id="MinSendLevel"></a>

### MinSendLevel

Gets or sets the minimum [send level](SendLevel.md) of input to collect.

```ahk
CurrentLevel := InputHookObj.MinSendLevel
```

```ahk
InputHookObj.MinSendLevel := NewLevel
```

*CurrentLevel* is *NewLevel* if assigned, otherwise 0 by default unless overwritten by the [I option](#option-i).

*NewLevel* should be an [integer](../Concepts.md#numbers) between 0 and 101. Events which have a send level <u>lower</u> than this value are ignored. For example, a value of 101 causes all input generated by [SendEvent](Send.md) to be ignored, while a value of 1 only ignores input at the default send level (zero).

The [SendInput](SendMode.md#Input) and [SendPlay](SendMode.md#Play) methods are always ignored, regardless of this setting. Input generated by any source other than AutoHotkey is never ignored as a result of this setting.

<a id="NotifyNonText"></a>

### NotifyNonText

Gets or sets whether the [OnKeyDown](#OnKeyDown) and [OnKeyUp](#OnKeyUp) callbacks are called whenever a non-text key is pressed.

```ahk
CurrentSetting := InputHookObj.NotifyNonText
```

```ahk
InputHookObj.NotifyNonText := NewSetting
```

*CurrentSetting* is *NewSetting* if assigned, otherwise 0 (false) by default.

*NewSetting* is a [boolean value](../Concepts.md#boolean) that enables or disables this setting. If true, notifications are enabled for all keypresses which do not produce text, such as when pressing `←` or `Alt`+`F`. Setting this property does not affect a key's [options](#KeyOpt), since the production of text depends on the active window's keyboard layout at the time the key is pressed.

NotifyNonText is applied to key-up events by considering whether a previous key-down with a matching VK code was classified as text or non-text. For example, if NotifyNonText is true, pressing `Ctrl`+`A` will produce [OnKeyDown](#OnKeyDown) and [OnKeyUp](#OnKeyUp) calls for both `Ctrl` and `A`, while pressing `A` on its own will not call OnKeyDown or OnKeyUp unless [KeyOpt](#KeyOpt) has been used to enable notifications for that key.

See [VisibleText](#VisibleText) for details about which keys are counted as producing text.

<a id="Timeout"></a>

### Timeout

Gets or sets the timeout value in seconds.

```ahk
CurrentSeconds := InputHookObj.Timeout
```

```ahk
InputHookObj.Timeout := NewSeconds
```

*CurrentSeconds* is *NewSeconds* if assigned, otherwise 0 by default unless overwritten by the [T option](#option-t).

*NewSeconds* is a [floating-point number](../Concepts.md#numbers) representing the timeout. 0 means no timeout.

The timeout period ordinarily starts when [Start](#Start) is called, but will restart if this property is assigned a value while Input is in progress. If Input is still in progress when the timeout period elapses, it is terminated and [EndReason](#EndReason) is set to the word Timeout.

<a id="VisibleNonText"></a>

### VisibleNonText

Gets or sets whether keys or key combinations which do not produce text are visible (not blocked).

```ahk
CurrentSetting := InputHookObj.VisibleNonText
```

```ahk
InputHookObj.VisibleNonText := NewSetting
```

*CurrentSetting* is *NewSetting* if assigned, otherwise 1 (true) by default. The [V option](#vis) sets this to 1 (true).

*NewSetting* is a [boolean value](../Concepts.md#boolean) that enables or disables this setting. If true, keys and key combinations which do not produce text may trigger hotkeys or be passed on to the active window. If false, they are blocked.

See [VisibleText](#VisibleText) for details about which keys are counted as producing text.

<a id="VisibleText"></a>

### VisibleText

Gets or sets whether keys or key combinations which produce text are visible (not blocked).

```ahk
CurrentSetting := InputHookObj.VisibleText
```

```ahk
InputHookObj.VisibleText := NewSetting
```

*CurrentSetting* is *NewSetting* if assigned, otherwise 0 (false) by default unless overwritten by the [V option](#vis).

*NewSetting* is a [boolean value](../Concepts.md#boolean) that enables or disables this setting. If true, keys and key combinations which produce text may trigger hotkeys or be passed on to the active window. If false, they are blocked.

Any keystrokes which cause text to be appended to the Input buffer are counted as producing text, even if they do not normally do so in other applications. For instance, `Ctrl`+`A` produces text if the [M option](#option-m) is used, and `Esc` produces the control character `Chr(27)`.

Dead keys are counted as producing text, although they do not typically produce an immediate effect. Pressing a dead key might also cause the following key to produce text (if only the dead key's character).

`Backspace` is counted as producing text only when it [acts as undo](#BackspaceIsUndo).

The [standard modifier keys](../KeyList.md#modifier) and `CapsLock`, `NumLock` and `ScrollLock` are always visible (not blocked).

<a id="EndReasons"></a>
## EndReason

The [EndReason](#EndReason) property returns one of the following strings:

| String | Description |
| --- | --- |
| Stopped | The [Stop](#Stop) method was called or the [Start](#Start) method has not yet been called for the first time. |
| Max | The Input reached the maximum allowed length and it does not match any of the items in [*MatchList*](#MatchList). |
| Timeout | The Input timed out. |
| Match | The Input matches one of the items in [*MatchList*](#MatchList). The [Match](#Match) property contains the matched item. |
| EndKey | One of the *EndKeys* was pressed to terminate the Input. The [EndKey](#EndKey) property contains the terminating key name or character without braces. |
|  | If the Input is in progress, EndReason is blank. |

<a id="Remarks"></a>
## Remarks

The [Start](#Start) method must be called before input will be collected.

InputHook is designed to allow different parts of the script to monitor input, with minimal conflicts. It can operate continuously, such as to watch for [arbitrary words](#ExSac) or other patterns. It can also operate temporarily, such as to collect user input or temporarily override specific (or [non-specific](#ExKeyWaitAny)) keys without interfering with hotkeys.

Keyboard [hotkeys](../Hotkeys.md) are still in effect while an Input is in progress, but cannot activate if any of the required modifier keys are suppressed, or if the hotkey uses the *reg* method and its suffix key is suppressed. For example, the hotkey `^+a::` *might* be overridden by InputHook, whereas the hotkey `$^+a::` would take priority unless the InputHook suppressed `Ctrl` or `Shift`.

Keys are either suppressed (blocked) or not depending on the following factors (in order):

- If the [V option](#KeyOpt-v) is in effect for this VK or SC, it is not suppressed.
- If the [S option](#KeyOpt-s) is in effect for this VK or SC, it is suppressed.
- If the key is a [standard modifier key](../KeyList.md#modifier) or `CapsLock`, `NumLock` or `ScrollLock`, it is not suppressed.
- [VisibleText](#VisibleText) or [VisibleNonText](#VisibleNonText) is consulted, depending on whether the key produces text. If the property is 0 (false), the key is suppressed. See [VisibleText](#VisibleText) for details about which keys are counted as producing text.

The [keyboard hook](InstallKeybdHook.md) is required while an Input is in progress, but will be uninstalled automatically if it is no longer needed when the Input is terminated.

The script is [automatically persistent](../Scripts.md#persistent) while an Input is in progress, so it will continue monitoring input even if there are no running [threads](../misc/Threads.md). The script may exit automatically when input ends (if there are no running threads and the script is not persistent for some other reason).

AutoHotkey does not support Input Method Editors (IME). The keyboard hook intercepts keyboard events and translates them to text by using [ToUnicodeEx](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-tounicodeex) or ToAsciiEx (except in the case of [VK_PACKET](https://learn.microsoft.com/windows/win32/inputdev/virtual-key-codes#vk_packet) events, which encapsulate a single character).

If you use multiple languages or keyboard layouts, InputHook uses the keyboard layout of the active window rather than the script's (regardless of whether the Input is [visible](#vis)).

Although not as flexible, [hotstrings](../Hotstrings.md) are generally easier to use.

<a id="comparison"></a>
## InputHook vs. Input (v1)

In AutoHotkey v1.1, InputHook is a replacement for the Input command, offering greater flexbility. The Input command was removed for v2.0, but the code below is mostly equivalent:

```ahk
; Input OutputVar, % Options, % EndKeys, % MatchList  ; v1
ih := InputHook(Options, EndKeys, MatchList)
ih.Start()
ErrorLevel := ih.Wait()
if (ErrorLevel = "EndKey")
    ErrorLevel .= ":" ih.EndKey
OutputVar := ih.Input
```

The Input command terminates any previous Input which it started, whereas InputHook allows [more than one Input](#stack) at a time.

*Options* is interpreted the same, but the default settings differ:

- The Input command limits the length of the input to 16383, while InputHook limits it to 1023. This can be overridden with the [L option](#option-l), and there is no absolute maximum.
- The Input command blocks both text and non-text keystrokes by default, and blocks neither if the [V option](#vis) is present. By contrast, InputHook blocks only text keystrokes by default ([VisibleNonText](#VisibleNonText) defaults to true), so most hotkeys can be used while an Input is in progress.

The Input command blocks the [thread](../misc/Threads.md) while it is in progress, whereas InputHook allows the thread to continue, or even exit (which allows any thread that it interrupted to resume). Instead of waiting, the script can register an [OnEnd](#OnEnd) function to be called when the Input is terminated.

The Input command returns the user's input only after the Input is terminated, whereas InputHook's [Input](#Input) property allows it to be retrieved at any time. The script can register an [OnChar](#OnChar) function to be called whenever a character is added, instead of continuously checking the Input property.

InputHook gives much more control over individual keys via the [KeyOpt](#KeyOpt) method. This includes adding or removing end keys, suppressing or not suppressing specific keys, or ignoring the text produced by specific keys.

Unlike the Input command, InputHook can be used to detect keys which do not produce text, *without* terminating the Input. This is done by registering an [OnKeyDown](#OnKeyDown) function and using [KeyOpt](#KeyOpt) or [NotifyNonText](#NotifyNonText) to specify which keys are of interest.

If a *MatchList* item caused the Input to terminate, the [Match](#Match) property can be consulted to determine exactly which match (this is more useful when the [\* option](#asterisk) is present).

Although the script can consult [GetKeyState](GetKeyState.md) after the Input command returns, sometimes it does not accurately reflect which keys were pressed when the Input was terminated. InputHook's [EndMods](#EndMods) property reflects the logical state of the modifier keys at the time Input was terminated.

There are some differences relating to backward-compatibility:

- The Input command stores end keys `A`-`Z` in uppercase even though other letters on some keyboard layouts are lowercase. Passing the value to [Send](Send.md) would produce a shifted keystroke instead of a plain one. By contrast, InputHook's [EndKeys](#EndKeys) property always returns the normalized name; i.e. whichever character is produced by pressing the key without holding `Shift` or other modifiers.
- If a key name used in *EndKeys* corresponds to a VK which is shared between two physical keys (such as `NumpadUp` and `Up`), the Input command handles the primary key by VK and the secondary key by SC, whereas InputHook handles both by SC. `{vkNN}` notation can be used to handle the key by VK.
    When the end key is handled by VK, both physical keys can terminate the Input. For example, `{NumpadUp}` would cause the Input command to be terminated by pressing the `↑` arrow key on the main keyboard, but ErrorLevel would contain `EndKey:NumpadUp` since only the VK is considered.

    When an end key is handled by SC, the Input command always produces names for the known secondary SC of any given VK, and always produces `scNNN` for any other key (even if it has a name). By contrast, InputHook produces a name if the key has one.

<a id="Related"></a>
## Related

[KeyWait](KeyWait.md), [Hotstrings](../Hotstrings.md), [InputBox](InputBox.md), [InstallKeybdHook](InstallKeybdHook.md), [Threads](../misc/Threads.md)

<a id="Examples"></a>
## Examples

<a id="ExKeyWaitAny"></a>

**Example:** Waits for the user to press any single key.

```ahk
MsgBox KeyWaitAny()

; Same again, but don't block the key.
MsgBox KeyWaitAny("V")

KeyWaitAny(Options:="")
{
    ih := InputHook(Options)
    if !InStr(Options, "V")
        ih.VisibleNonText := false
    ih.KeyOpt("{All}", "E")  ; End
    ih.Start()
    ih.Wait()
    return ih.EndKey  ; Return the key name
}
```

<a id="ExKeyWaitCombo"></a>

**Example:** Waits for any key in combination with Ctrl/Alt/Shift/Win.

```ahk
MsgBox KeyWaitCombo()

KeyWaitCombo(Options:="")
{
    ih := InputHook(Options)
    if !InStr(Options, "V")
        ih.VisibleNonText := false
    ih.KeyOpt("{All}", "E")  ; End
    ; Exclude the modifiers
    ih.KeyOpt("{LCtrl}{RCtrl}{LAlt}{RAlt}{LShift}{RShift}{LWin}{RWin}", "-E")
    ih.Start()
    ih.Wait()
    return ih.EndMods . ih.EndKey  ; Return a string like <^<+Esc
}
```

<a id="ExSac"></a>

**Example:** Simple auto-complete: any day of the week. Pun aside, this is a mostly functional example. Simply run the script and start typing today, press `Tab` to complete or press `Esc` to exit.

```ahk
WordList := "Monday`nTuesday`nWednesday`nThursday`nFriday`nSaturday`nSunday"

Suffix := ""

SacHook := InputHook("V", "{Esc}")
SacHook.OnChar := SacChar
SacHook.OnKeyDown := SacKeyDown
SacHook.KeyOpt("{Backspace}", "N")
SacHook.Start()

SacChar(ih, char)  ; Called when a character is added to SacHook.Input.
{
    global Suffix := ""
    if RegExMatch(ih.Input, "`nm)\w+$", &prefix)
        && RegExMatch(WordList, "`nmi)^" prefix[0] "\K.*", &Suffix)
        Suffix := Suffix[0]

    if CaretGetPos(&cx, &cy)
        ToolTip Suffix, cx + 15, cy
    else
        ToolTip Suffix

    ; Intercept Tab only while we're showing a tooltip.
    ih.KeyOpt("{Tab}", Suffix = "" ? "-NS" : "+NS")
}

SacKeyDown(ih, vk, sc)
{
    if (vk = 8) ; Backspace
        SacChar(ih, "")
    else if (vk = 9) ; Tab
        Send "{Text}" Suffix
}
```

<a id="ExAnyKey"></a>

**Example:** Waits for the user to press any key. Keys that produce no visible character -- such as the modifier keys, function keys, and arrow keys -- are listed as end keys so that they will be detected too.

```ahk
ih := InputHook("L1", "{LControl}{RControl}{LAlt}{RAlt}{LShift}{RShift}{LWin}{RWin}{AppsKey}{F1}{F2}{F3}{F4}{F5}{F6}{F7}{F8}{F9}{F10}{F11}{F12}{Left}{Right}{Up}{Down}{Home}{End}{PgUp}{PgDn}{Del}{Ins}{BS}{CapsLock}{NumLock}{PrintScreen}{Pause}")
ih.Start()
ih.Wait()
```

<a id="ExHotkey"></a>

**Example:** This is a working hotkey example. Since the hotkey has the tilde (~) prefix, its own keystroke will pass through to the active window. Thus, if you type `[btw` (or one of the other match phrases) in any editor, the script will automatically perform an action of your choice (such as replacing the typed text). For an alternative version of this example, see [Switch](Switch.md#ExInput).

```ahk
~[::
{
    msg := ""
    ih := InputHook("V T5 L4 C", "{enter}.{esc}{tab}", "btw,otoh,fl,ahk,ca")
    ih.Start()
    ih.Wait()
    if (ih.EndReason = "Max")
        msg := 'You entered "{1}", which is the maximum length of text.'
    else if (ih.EndReason = "Timeout")
        msg := 'You entered "{1}" at which time the input timed out.'
    else if (ih.EndReason = "EndKey")
        msg := 'You entered "{1}" and terminated the input with {2}.'

    if msg  ; If an EndReason was found, skip the rest below.
    {
        MsgBox Format(msg, ih.Input, ih.EndKey)
        return
    }

    ; Otherwise, a match was found.
    if (ih.Input = "btw")
        Send("{backspace 4}by the way")
    else if (ih.Input = "otoh")
        Send("{backspace 5}on the other hand")
    else if (ih.Input = "fl")
        Send("{backspace 3}Florida")
    else if (ih.Input = "ca")
        Send("{backspace 3}California")
    else if (ih.Input = "ahk")
        Run("https://www.autohotkey.com")
}
```
