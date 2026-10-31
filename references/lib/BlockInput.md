# BlockInput

Disables or enables the user's ability to interact with the computer via keyboard and mouse.

```ahk
BlockInput OnOff
BlockInput SendMouse
BlockInput MouseMove
```

<a id="Parameters"></a>
## Parameters

**OnOff**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

This mode blocks all user inputs unconditionally. Specify one of the following values:

**On** or **1** ([true](../Variables.md#True)): The user is prevented from interacting with the computer (mouse and keyboard input has no effect).

**Off** or **0** ([false](../Variables.md#False)): Input is re-enabled.

**SendMouse**

Type: [String](../Concepts.md#strings)

This mode only blocks user inputs while specific send and/or mouse functions are in progress. Specify one of the following words:

**Send:** The user's keyboard and mouse input is ignored while a [SendEvent](Send.md) is in progress (including [Send](Send.md) and [SendText](Send.md) if the traditional [SendEvent mode](SendMode.md#Event) is in effect). This prevents the user's keystrokes from disrupting the flow of simulated keystrokes. When the Send finishes, input is re-enabled (unless still blocked by a previous use of `BlockInput "On"`).

**Mouse:** The user's keyboard and mouse input is ignored while a [Click](Click.md), [MouseMove](MouseMove.md), [MouseClick](MouseClick.md), or [MouseClickDrag](MouseClickDrag.md) is in progress (the traditional [SendEvent mode](SendMode.md#Event) only). This prevents the user's mouse movements and clicks from disrupting the simulated mouse events. When the mouse action finishes, input is re-enabled (unless still blocked by a previous use of `BlockInput "On"`).

**SendAndMouse:** A combination of the above two modes.

**Default:** Turns off both the *Send* and the *Mouse* modes, but does not change the current state of input blocking. For example, if `BlockInput "On"` is currently in effect, using `BlockInput "Default"` will not turn it off.

<a id="MouseMove"></a>

**MouseMove**

Type: [String](../Concepts.md#strings)

This mode only blocks the mouse cursor movement. Specify one of the following words:

**MouseMove:** The mouse cursor will not move in response to the user's physical movement of the mouse (DirectInput applications are a possible exception). When a script first uses this function, the [mouse hook](InstallMouseHook.md) is installed (if it is not already). The mouse hook will stay installed until the next use of the [Suspend](Suspend.md) or [Hotkey](Hotkey.md) function, at which time it is removed if not required by any hotkeys or hotstrings (see [#Hotstring NoMouse](_Hotstring.md)).

**MouseMoveOff:** Allows the user to move the mouse cursor.

<a id="Remarks"></a>
## Remarks

All three BlockInput modes (*OnOff*, *SendMouse* and *MouseMove*) operate independently of each other. For example, `BlockInput "On"` will continue to block input until `BlockInput "Off"` is used, even if one of the words from *SendMouse* is also in effect. Another example is, if `BlockInput "On"` and `BlockInput "MouseMove"` are both in effect, mouse movement will be blocked until both are turned off.

> **Note:** The *OnOff* and *SendMouse* modes might have no effect if UAC is enabled or the script has not been run as administrator. For more information, refer to the [FAQ](../FAQ.md#uac).

In preference to BlockInput, it is often better to use the sending modes [SendInput](SendMode.md#Input) or [SendPlay](SendMode.md#Play) so that keystrokes and mouse clicks become uninterruptible. This is because unlike BlockInput, those modes do not discard what the user types during the send; instead, those keystrokes are buffered and sent afterward. Avoiding BlockInput also avoids the need to work around sticking keys as described in the next paragraph.

If BlockInput becomes active while the user is holding down keys, it might cause those keys to become "stuck down". This can be avoided by waiting for the keys to be released prior to turning BlockInput on, as in this example:

```ahk
^!p::
{
    KeyWait "Control"  ; Wait for the key to be released.  Use one KeyWait for each of the hotkey's modifiers.
    KeyWait "Alt"
    BlockInput true
    ; ... send keystrokes and mouse clicks ...
    BlockInput false
}
```

When BlockInput is in effect, user input is blocked but AutoHotkey can simulate keystrokes and mouse clicks. However, pressing `Ctrl`+`Alt`+`Del` will re-enable input due to a Windows API feature.

Certain types of [hook hotkeys](_UseHook.md) can still be triggered when BlockInput is on. Examples include `MButton` (mouse hook) and `LWin & Space` (keyboard hook with explicit prefix rather than modifiers `$#`).

Input is automatically re-enabled when the script closes.

<a id="Related"></a>
## Related

[SendMode](SendMode.md), [Send](Send.md), [Click](Click.md), [MouseMove](MouseMove.md), [MouseClick](MouseClick.md), [MouseClickDrag](MouseClickDrag.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Opens Notepad and pastes time/date by sending F5 while BlockInput is turned on. Note that BlockInput may only work if the script has been run as administrator.

```ahk
BlockInput true
Run "notepad"
WinWaitActive "ahk_class Notepad"
Send "{F5}" ; pastes time and date
BlockInput false
```
