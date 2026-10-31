# SendMessage

Sends a message to a window or control and waits for acknowledgement.

```ahk
Result := SendMessage(MsgNumber , wParam, lParam, ControlID, WinTitle, WinText, ExcludeTitle, ExcludeText, Timeout)
```

<a id="Parameters"></a>
## Parameters

**MsgNumber**

Type: [Integer](../Concepts.md#numbers)

The message number to send. See the [message list](../misc/SendMessageList.md) to determine the number.

**wParam, lParam**

Type: [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If either is omitted, 0 will be sent. Otherwise, specify the first and second component of the message.

Each parameter must be an [integer](../Concepts.md#numbers) or an object with a [Ptr](Buffer.md#Ptr) property, such as a [Buffer](Buffer.md). For messages which require a pointer to a string, use a Buffer or the [StrPtr](StrPtr.md) function. If the string contained by a variable is changed by passing the variable's address to SendMessage, the variable's length must be updated afterward by calling [VarSetStrCapacity(&MyVar, -1)](VarSetStrCapacity.md#neg1).

If AutoHotkey or the target window is 32-bit, only the parameter's low 32 bits are used; that is, values are truncated if outside the range -2147483648 to 2147483647 (-0x80000000 to 0x7FFFFFFF) for signed values, or 0 to 4294967295 (0xFFFFFFFF) for unsigned values. If AutoHotkey and the target window are both 64-bit, any integer value [supported by AutoHotkey](../Concepts.md#pure-numbers) can be used.

**ControlID**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If omitted, the message will be sent directly to the target window rather than one of its controls. Otherwise, specify the control's ClassNN, text or HWND, or an object with a Hwnd property. For details, see [Control Identifiers](../misc/ControlID.md).

If this parameter specifies a HWND (as an integer or object), it is not required to be the HWND of a control (child window). That is, it can also be the HWND of a top-level window.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

**Timeout**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 5000. Otherwise, specify the maximum number of milliseconds to wait for the target window to process the message. If the message is not processed within this time, a [TimeoutError](Error.md#TimeoutError) is thrown. Specify 0 to wait indefinitely. A negative number causes SendMessage to time out immediately.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the result of the message, which might sometimes be a "reply" depending on the nature of the message and its target window.

The range of possible values depends on the target window and the version of AutoHotkey that is running. When using a 32-bit version of AutoHotkey, or if the target window is 32-bit, the result is a 32-bit unsigned integer between 0 and 4294967295. When using the 64-bit version of AutoHotkey with a 64-bit window, the result is a 64-bit signed integer between -9223372036854775808 and 9223372036854775807.

If the result is intended to be a 32-bit signed integer (a value from -2147483648 to 2147483648), it can be truncated to 32-bit and converted to a signed value as follows:

```ahk
MsgReply := MsgReply << 32 >> 32
```

This conversion may be necessary even on AutoHotkey 64-bit, because results from 32-bit windows are zero-extended. For example, a result of -1 from a 32-bit window is seen as 0xFFFFFFFF on any version of AutoHotkey, whereas a result of -1 from a 64-bit window is seen as 0xFFFFFFFF on AutoHotkey 32-bit and -1 on AutoHotkey 64-bit.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found.

A [TimeoutError](Error.md#TimeoutError) is thrown if the message timed out.

An [OSError](Error.md#OSError) is thrown if the message could not be sent. For example, if the target window is running at a higher integrity level than the script (i.e. it is running as admin while the script is not), messages may be blocked.

<a id="Remarks"></a>
## Remarks

This function should be used with caution because sending a message to the wrong window (or sending an invalid message) might cause unexpected behavior or even crash the target application. This is because most applications are not designed to expect certain types of messages from external sources.

SendMessage waits for the target window to process the message, up until the timeout period expires. By contrast, [PostMessage](PostMessage.md) places the message in the message queue associated with the target window without waiting for acknowledgement or reply.

String parameters must be passed by [address](StrPtr.md). For example:

```ahk
ListVars
WinWaitActive "ahk_class AutoHotkey"
SendMessage 0x000C, 0, StrPtr("New Title")  ; 0X000C is WM_SETTEXT
```

To send a message to all windows in the system, including those that are hidden or disabled, specify `0xFFFF` for *WinTitle* (0xFFFF is HWND_BROADCAST). This technique should be used only for messages intended to be broadcast, such as the following example:

```ahk
SendMessage 0x001A,,,, 0xFFFF  ; 0x001A is WM_SETTINGCHANGE
```

To have a script receive a message, use [OnMessage](OnMessage.md).

See the [Message Tutorial](../misc/SendMessage.md) for an introduction to using this function.

<a id="Related"></a>
## Related

[PostMessage](PostMessage.md), [Message List](../misc/SendMessageList.md), [Message Tutorial](../misc/SendMessage.md), [OnMessage](OnMessage.md), [Automating Winamp](../misc/Winamp.md), [DllCall](DllCall.md), [ControlSend](ControlSend.md), [MenuSelect](MenuSelect.md)

<a id="Examples"></a>
## Examples

<a id="ExMonitorPower"></a>

**Example:** Turns off the monitor via hotkey. In the SendMessage line, replace the number 2 with -1 to turn on the monitor, or replace it with 1 to activate the monitor's low-power mode.

```ahk
#o::  ; Win+O hotkey
{
    Sleep 1000  ; Give user a chance to release keys (in case their release would wake up the monitor again).
    ; Turn Monitor Off:
    SendMessage 0x0112, 0xF170, 2,, "Program Manager"  ; 0x0112 is WM_SYSCOMMAND, 0xF170 is SC_MONITORPOWER.
}
```

<a id="ExScreenSave"></a>

**Example:** Starts the user's chosen screen saver.

```ahk
SendMessage 0x0112, 0xF140, 0,, "Program Manager"  ; 0x0112 is WM_SYSCOMMAND, and 0xF140 is SC_SCREENSAVE.
```

<a id="ExVScrollUp"></a>

**Example:** Scrolls up by one line (for a control that has a vertical scroll bar).

```ahk
SendMessage 0x0115, 0, 0, ControlGetFocus("A")
```

<a id="ExVScrollDown"></a>

**Example:** Scrolls down by one line (for a control that has a vertical scroll bar).

```ahk
SendMessage 0x0115, 1, 0, ControlGetFocus("A")
```

<a id="ExWinamp"></a>

**Example:** Asks Winamp which track number is currently active (see [Automating Winamp](../misc/Winamp.md) for more information).

```ahk
SetTitleMatchMode 2
TrackNumber := SendMessage(0x0400, 0, 120,, "- Winamp")
TrackNumber++  ; Winamp's count starts at 0, so adjust by 1.
MsgBox "Track #" TrackNumber " is active or playing."
```

<a id="ExPID"></a>

**Example:** Finds the process ID of an AHK script (an alternative to [WinGetPID](WinGetPID.md)).

```ahk
SetTitleMatchMode 2
DetectHiddenWindows true
PID := SendMessage(0x0044, 0x405, 0, , "SomeOtherScript.ahk - AutoHotkey v")
MsgBox PID " is the process id."
```
