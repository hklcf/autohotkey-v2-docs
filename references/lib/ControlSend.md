# ControlSend / ControlSendText

Sends simulated keystrokes or text to a window or control.

```ahk
ControlSend Keys , ControlID, WinTitle, WinText, ExcludeTitle, ExcludeText
ControlSendText Keys , ControlID, WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**Keys**

Type: [String](../Concepts.md#strings)

The sequence of keys to send (see the [Send](Send.md) function for details). The rate at which characters are sent is determined by [SetKeyDelay](SetKeyDelay.md).

Unlike the [Send](Send.md) function, mouse clicks cannot be sent by ControlSend. Use [ControlClick](ControlClick.md) for that.

**ControlID**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If omitted, the keystrokes will be sent directly to the target window instead of one of its controls. Otherwise, specify the control's ClassNN, text or HWND, or an object with a Hwnd property. For details, see [Control Identifiers](../misc/ControlID.md).

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to manipulate them via their [GuiControl](GuiControl.md) object, assuming a suitable counterpart exists.

Unlike [Send](Send.md), ControlSend ignores [SendMode](SendMode.md). It uses the operating system's PostMessage function to post keyboard messages.

ControlSendText is similar to ControlSend, except that it sends the individual characters of the *Keys* parameter without translating `{Enter}` to `Enter`, `^c` to `Ctrl`+`C`, etc. For details, see [Text mode](Send.md#SendText). It is also valid to use [{Raw}](Send.md#Raw) or [{Text}](Send.md#Text) with ControlSend.

If the *ControlID* parameter is omitted, this function will attempt to send directly to the target window by sending to its topmost control (which is often the correct one) or the window itself if there are no controls. This is useful if a window does not appear to have any controls at all, or just for the convenience of not having to worry about which control to send to.

By default, modifier keystrokes (Ctrl, Alt, Shift, and Win) are sent as they normally would be by the [SendEvent](Send.md) function. This allows command prompt and other console windows to properly detect uppercase letters, control characters, etc. It may also improve reliability in other ways.

However, in some cases these modifier events may interfere with the active window, especially if the user is actively typing during a ControlSend or if `Alt` is being sent (since `Alt` activates the active window's menu bar). This can be avoided by explicitly sending modifier up and down events as in this example:

```ahk
ControlSend "{Alt down}f{Alt up}", "Edit1", "Untitled - Notepad"
```

The method above also allows the sending of modifier keystrokes (Ctrl, Alt, Shift, and Win) while the workstation is locked (protected by logon prompt).

[BlockInput](BlockInput.md) should be avoided when using ControlSend against a console window such as command prompt. This is because it might prevent capitalization and modifier keys such as `Ctrl` from working properly.

The value of [SetKeyDelay](SetKeyDelay.md) determines the speed at which keys are sent. If the target window does not receive the keystrokes reliably, try increasing the press duration via the second parameter of [SetKeyDelay](SetKeyDelay.md) as in these examples:

```ahk
SetKeyDelay 10, 10
SetKeyDelay 0, 10
SetKeyDelay -1, 0
```

If the target control is an edit control (or something similar), the following functions are usually more reliable and faster than ControlSend:

- [EditPaste](EditPaste.md) to insert text at the caret position.
- [ControlSetText](ControlSetText.md) to entirely replace any current text.

ControlSend is generally not capable of manipulating a window's menu bar. To work around this, use [MenuSelect](MenuSelect.md). If that is not possible due to the nature of the menu bar, you could try to discover the message that corresponds to the desired menu item by following the [SendMessage Tutorial](../misc/SendMessage.md).

<a id="Related"></a>
## Related

[SetKeyDelay](SetKeyDelay.md), [Escape sequences (e.g. \`n)](../misc/EscapeChar.md), [Control functions](Control.md), [Send](Send.md), [Automating Winamp](../misc/Winamp.md)

<a id="Examples"></a>
## Examples

<a id="ExNotepad"></a>

**Example:** Opens Notepad minimized and send it some text. This example may fail on Windows 11 or later, as it requires the classic version of Notepad.

```ahk
Run "Notepad",, "Min", &PID  ; Run Notepad minimized.
WinWait "ahk_pid " PID  ; Wait for it to appear.
; Send the text to the inactive Notepad edit control.
; The third parameter is omitted so the last found window is used.
ControlSend "This is a line of text in the notepad window.{Enter}", "Edit1"
ControlSendText "Notice that {Enter} is not sent as an Enter keystroke with ControlSendText.", "Edit1"

Msgbox "Press OK to activate the window to see the result."
WinActivate "ahk_pid " PID  ; Show the result.
```

<a id="ExCmd"></a>

**Example:** Opens the command prompt and sent it some text. This example may fail on Windows 11 or later, as it requires the classic version of the command prompt.

```ahk
SetTitleMatchMode 2
Run A_ComSpec,,, &PID  ; Run command prompt.
WinWait "ahk_pid " PID  ; Wait for it to appear.
ControlSend "ipconfig{Enter}",, "cmd.exe"  ; Send directly to the command prompt window.
```

<a id="ExGUI"></a>

**Example:** Creates a [GUI](Gui.md) with an edit control and sent it some text.

```ahk
MyGui := Gui()
MyGui.Add("Edit", "r10 w500")
MyGui.Show()
ControlSend "This is a line of text in the edit control.{Enter}", "Edit1", MyGui
ControlSendText "Notice that {Enter} is not sent as an Enter keystroke with ControlSendText.", "Edit1", MyGui
```
