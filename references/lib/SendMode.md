# SendMode

Makes [Send](Send.md) synonymous with SendEvent or SendPlay rather than the default (SendInput). Also makes [Click](Click.md), [MouseClick](MouseClick.md), [MouseClickDrag](MouseClickDrag.md), and [MouseMove](MouseMove.md) use the specified mode.

```ahk
PrevMode := SendMode(Mode)
```

<a id="Parameters"></a>
## Parameters

**Mode**

Type: [String](../Concepts.md#strings)

Specify one of the following words to change the sending mode for subsequent occurrences of [Send](Send.md), [SendRaw](Send.md), [Click](Click.md), [MouseClick](MouseClick.md), [MouseClickDrag](MouseClickDrag.md), and [MouseMove](MouseMove.md):

**Event:** Switches to the traditional [SendEvent mode](#Event).

**Input:** Default mode. Switches to the [SendInput mode](#Input), which is the fastest and generally the most reliable method to send simulated keystrokes and mouse clicks.

**Play:** Switches to the [SendPlay mode](#Play), which is faster than SendEvent and can work in cases where the other modes fail, particularly in some games or applications with unusual input handling.

<a id="InputThenPlay"></a>

**InputThenPlay:** Same as *Input* except that rather than falling back to *Event* when *Input* is [unavailable](#SendInputUnavail), it reverts to *Play*. This also causes the [SendInput](Send.md) function itself to revert to *Play* when *Input* is unavailable.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the previous setting.

<a id="Sending_Modes"></a>
## Sending Modes

The following sections describe the three methods AutoHotkey uses to send simulated keystrokes and mouse clicks: [SendEvent](#Event), [SendInput](#Input), and [SendPlay](#Play). Each mode has different strengths and limitations, and applications may respond differently depending on how the input is generated. Understanding these differences helps in choosing the most effective mode for a particular script or target application.

<a id="Event"></a>
### SendEvent

SendEvent is the traditional method to send keystrokes and mouse clicks. However, compared to the other sending modes, SendEvent is slower; it will never match the speed of [SendInput](#Input) or [SendPlay](#Play).

SendEvent obeys the delays set by [SetKeyDelay](SetKeyDelay.md) and [SetMouseDelay](SetMouseDelay.md). The default delay is 10 milliseconds.

SendEvent is also used automatically when SendInput is [unavailable](#SendInputUnavail), unless [InputThenPlay](#InputThenPlay) is in effect.

The [SendEvent](Send.md) function can be used to send keystrokes explicitly via SendEvent mode.

<a id="Input"></a>
### SendInput

SendInput is generally the preferred method to send keystrokes and mouse clicks because of its superior speed and reliability. Under most conditions, SendInput is nearly instantaneous, even when sending long strings. Since SendInput is so fast, it is also more reliable because there is less opportunity for some other window to pop up unexpectedly and intercept the keystrokes. Reliability is further improved by the fact that anything the user types during a SendInput is postponed until afterward.

Unlike the other sending modes, the operating system limits SendInput to about 5000 characters (this may vary depending on the operating system's version and performance settings). Characters and events beyond this limit are not sent.

> **Note:** SendInput ignores [SetKeyDelay](SetKeyDelay.md) and [SetMouseDelay](SetMouseDelay.md) because the operating system does not support a delay in this mode. However, when SendInput reverts to [SendEvent](#Event) under the conditions described below, it uses `SetKeyDelay -1, 0` (unless SendEvent's KeyDelay is `-1,-1`, in which case `-1,-1` is used). When SendInput reverts to [SendPlay](#Play) due to [InputThenPlay](#InputThenPlay), it uses SendPlay's KeyDelay.

<a id="SendInputHook"></a>

If the script has a [low-level keyboard hook](InstallKeybdHook.md) installed, SendInput automatically uninstalls it prior to executing and reinstalls it afterward. As a consequence, SendInput generally cannot trigger the script's own hook hotkeys or [InputHooks](InputHook.md). The hook is temporarily uninstalled because its presence would otherwise disable all of SendInput's advantages, making it inferior to both [SendPlay](#Play) and [SendEvent](#Event). However, this can only be done for the script's own hook, and is not done if an external hook is detected as described below.

<a id="SendInputUnavail"></a>

If a script *other than* the one executing SendInput has a [low-level keyboard hook](InstallKeybdHook.md) installed, SendInput automatically reverts to [SendEvent](#Event) (or [SendPlay](#Play) if [InputThenPlay](#InputThenPlay) is in effect). This is done because the presence of an external hook disables all of SendInput's advantages, making it inferior to both [SendPlay](#Play) and [SendEvent](#Event). However, since SendInput is unable to detect a low-level hook in programs other than AutoHotkey v1.0.43+, it will not revert in these cases, making it less reliable than the other modes.

When SendInput sends mouse clicks by means such as [{Click}](Send.md#Click), and `CoordMode "Mouse", "Window"` or `CoordMode "Mouse", "Client"` is in effect, every click will be relative to the window that was active at the start of the send. Therefore, if SendInput intentionally activates another window (by means such as alt-tab), the coordinates of subsequent clicks within the same function will be wrong if they were intended to be relative to the new window rather than the old one.

The [SendInput](Send.md) function can be used to send keystrokes explicitly via SendInput mode.

Known limitations:

- Windows Explorer ignores SendInput's simulation of certain navigational hotkeys such as `Alt`+`←`. To work around this, use either `SendEvent "!{Left}"` or `SendInput "{Backspace}"`.

<a id="Play"></a>
### SendPlay

> **Deprecated:** SendPlay does not tend to work if [User Account Control (UAC)](https://en.wikipedia.org/wiki/User_Account_Control) is enabled, even if the script is running as an administrator. For more information, refer to the [FAQ](../FAQ.md#uac). On Windows 11 and later, SendPlay may have no effect at all.

SendPlay's biggest advantage is its ability to "play back" keystrokes and mouse clicks in a broader variety of games than the other modes. For example, a particular game may accept [hotstrings](../Hotstrings.md#SendMode) only when they have the [SendPlay option](../Hotstrings.md#SendMode).

Of the three sending modes, SendPlay is the most unusual because it does not simulate keystrokes and mouse clicks per se. Instead, it creates a series of events (messages) that flow directly to the active window (similar to [ControlSend](ControlSend.md), but at a lower level). Consequently, SendPlay does not trigger hotkeys or hotstrings.

Like [SendInput](#Input), SendPlay's keystrokes do not get interspersed with keystrokes typed by the user. Thus, if the user happens to type something during a SendPlay, those keystrokes are postponed until afterward.

Although SendPlay is considerably slower than [SendInput](#Input), it is usually faster than the traditional [SendEvent](#Event) mode (even when [KeyDelay](SetKeyDelay.md) is -1).

The Windows keys (LWin and RWin) are automatically blocked during a SendPlay if the [keyboard hook](InstallKeybdHook.md) is installed. This prevents the Start Menu from appearing if the user accidentally presses a Windows key during the send. By contrast, keys other than LWin and RWin do not need to be blocked because the operating system automatically postpones them until after the SendPlay (via buffering).

SendPlay obeys the delays set by [SetKeyDelay](SetKeyDelay.md) and [SetMouseDelay](SetMouseDelay.md) if their *Play* parameter is present. Unlike [SendEvent](#Event), SendPlay defaults to -1 (no delay at all).

SendPlay is unable to turn on or off the CapsLock, NumLock, or ScrollLock keys. Similarly, it is unable to change a key's state as seen by [GetKeyState](GetKeyState.md) unless the keystrokes are sent to one of the script's own windows. Even then, any changes to the left/right modifier keys (e.g. RControl) can be detected only via their neutral counterparts (e.g. Control).

Unlike [SendInput](#Input) and [SendEvent](#Event), the user may interrupt a SendPlay by pressing `Ctrl`+`Alt`+`Del` or `Ctrl`+`Esc`. When this happens, the remaining keystrokes are not sent but the script continues executing as though the SendPlay had completed normally.

Although SendPlay can send LWin and RWin events, they are sent directly to the active window rather than performing their native operating system function. To work around this, use [SendEvent](#Event). For example, `SendEvent "#r"` would show the Start Menu's Run dialog.

The [SendPlay](Send.md) function can be used to send keystrokes explicitly via SendPlay mode.

Known limitations:

- Characters that do not exist in the current keyboard layout (such as Ô in English) cannot be sent. To work around this, use [SendEvent](#Event).
- Simulated mouse dragging might have no effect in RichEdit controls (and possibly others) such as those of WordPad and Metapad. To use an alternate mode for a particular drag, follow this example: `SendEvent "{Click 6 52 Down}{Click 45 52 Up}"`.
- Simulated mouse wheel rotation produces movement in only one direction (usually downward, but upward in some applications). Also, wheel rotation might have no effect in applications such as MS Word and Notepad. To use an alternate mode for a particular rotation, follow this example: `SendEvent "{WheelDown 5}"`.
- When calling `SendMode "Play"` during the [script startup](../Scripts.md#auto), all remapped keys are affected and might lose some of their functionality. See [SendPlay remapping limitations](../misc/Remap.md#SendPlay) for details.
- SendPlay does not trigger AutoHotkey's hotkeys or hotstrings, or global hotkeys registered by other programs or the OS.

<a id="Remarks"></a>
## Remarks

The default sending mode is *Input*.

Since SendMode also changes the mode of [Click](Click.md), [MouseMove](MouseMove.md), [MouseClick](MouseClick.md), and [MouseClickDrag](MouseClickDrag.md), there may be times when you wish to use a different mode for a particular mouse event. The easiest way to do this is via [{Click}](Send.md#Click). For example:

```ahk
SendEvent "{Click 100 200}"  ; SendEvent uses the older, traditional method of clicking.
```

If SendMode is used during [script startup](../Scripts.md#auto), it also affects [keyboard and mouse remapping](../misc/Remap.md). In particular, if you use `SendMode "Play"` with remapping, see [SendPlay remapping limitations](../misc/Remap.md#SendPlay).

The built-in variable [A_SendMode](../Variables.md#SendMode) contains the current setting and can also be assigned a new value instead of calling SendMode.

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

<a id="Related"></a>
## Related

[Send](Send.md), [SetKeyDelay](SetKeyDelay.md), [SetMouseDelay](SetMouseDelay.md), [Click](Click.md), [MouseClick](MouseClick.md), [MouseClickDrag](MouseClickDrag.md), [MouseMove](MouseMove.md)

<a id="Examples"></a>
## Examples

<a id="ExInputThenPlay"></a>

**Example:** Makes Send synonymous with SendInput, but falls back to SendPlay if SendInput is not available.

```ahk
SendMode "InputThenPlay"
```
