# OnMessage

Registers a [function](../Functions.md) to be called automatically whenever the script receives the specified message.

```ahk
OnMessage MsgNumber, Callback , MaxThreads
```

<a id="Parameters"></a>
## Parameters

**MsgNumber**

Type: [Integer](../Concepts.md#numbers)

The number of the message to monitor or query, which should be between 0 and 4294967295 (0xFFFFFFFF). If you do not wish to monitor a [system message](../misc/SendMessageList.md) (that is, one below 0x0400), it is best to choose a number greater than 4096 (0x1000) to the extent you have a choice. This reduces the chance of interfering with messages used internally by current and future versions of AutoHotkey.

<a id="The_Functions_Parameters"></a>

**Callback**

Type: [Function Object](../misc/Functor.md)

The function to call.

The callback accepts four parameters and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(wParam, lParam, msg, hwnd) { ...
```

Although the names you give the parameters do not matter, the following values are sequentially assigned to them:

1. The message's WPARAM value.
2. The message's LPARAM value.
3. The message number, which is useful in cases where a callback monitors more than one message.
4. The [HWND (unique ID)](../misc/WinTitle.md#ahk_id) of the window or control to which the message was sent.

You can omit one or more parameters from the end of the callback's parameter list if the corresponding information is not needed, but in this case an asterisk must be specified as the final parameter, e.g. `MyCallback(Param1, *)`.

WPARAM and LPARAM are unsigned 32-bit integers (from 0 to 2^32-1) or signed 64-bit integers (from -2^63 to 2^63-1) depending on whether the exe running the script is 32-bit or 64-bit. For 32-bit scripts, if an incoming parameter is intended to be a signed integer, any negative numbers can be revealed by following this example:

```ahk
if (A_PtrSize = 4 && wParam > 0x7FFFFFFF)  ; Checking A_PtrSize ensures the script is 32-bit.
    wParam := -(~wParam) - 1
```

<a id="MaxThreads"></a>

**MaxThreads**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1, meaning the callback is limited to one [thread](../misc/Threads.md) at a time. This is usually best because otherwise, the script would process messages out of chronological order whenever the callback interrupts itself. Therefore, as an alternative to *MaxThreads*, consider using *Critical* as described [below](#Critical).

If the callback directly or indirectly causes the message to be sent again while the callback is still running, it is necessary to specify a *MaxThreads* value greater than 1 or less than -1 to allow the callback to be called for the new message (if desired). Messages sent (not posted) by the script's own process to itself cannot be delayed or buffered.

Specify 0 to unregister the previously registered callback identified by *Callback*.

By default, when multiple callbacks are registered for a single *MsgNumber*, they are called in the order that they were registered. To register a callback to be called before any previously registered callbacks, specify a negative value for *MaxThreads*. For example, `OnMessage Msg, Fn, -2` registers `Fn` to be called before any other callbacks previously registered for *Msg*, and allows *Fn* a maximum of 2 threads. However, if the callback is already registered, the order will not change unless it is unregistered and then re-registered.

<a id="Usage"></a>
## Usage

Any number of callbacks can monitor a given *MsgNumber*.

Either of these two lines registers a callback to be called <u>after</u> any previously registered callbacks:

```ahk
OnMessage MsgNumber, Callback     ; Option 1 - omit MaxThreads
OnMessage MsgNumber, Callback, 1  ; Option 2 - specify MaxThreads 1
```

This registers a callback to be called <u>before</u> any previously registered callbacks:

```ahk
OnMessage MsgNumber, Callback, -1
```

To unregister a callback, specify 0 for *MaxThreads*:

```ahk
OnMessage MsgNumber, Callback, 0
```

<a id="Additional_Information_Available_to_the_Callback"></a>
## Additional Information Available to the Callback

In addition to the received parameters mentioned above, the callback may also consult the built-in variable **A_EventInfo**, which contains 0 if the message was sent via SendMessage. If sent via PostMessage, it contains the [tick-count time](../Variables.md#TickCount) the message was posted.

A callback's [last found window](../misc/WinTitle.md#LastFoundWindow) starts off as the parent window to which the message was sent (even if it was sent to a control). If the window is hidden but not a GUI window (such as the [script's main window](../Program.md#main-window)), turn on [DetectHiddenWindows](DetectHiddenWindows.md) before using it. For example:

```ahk
DetectHiddenWindows True
MsgParentWindow := WinExist()  ; This stores the unique ID of the window to which the message was sent.
```

<a id="What_the_Callback_Should_Return"></a>
## What the Callback Should Return

If a callback uses [Return](Return.md) without any parameters, or it specifies a blank value such as "" (or it never uses Return at all), the incoming message goes on to be processed normally when the callback finishes. The same thing happens if the callback [exits](Exit.md) or causes a runtime error such as [running](Run.md) a nonexistent file. By contrast, returning an integer causes it to be sent immediately as a reply; that is, the program does not process the message any further. For example, a callback monitoring WM_LBUTTONDOWN (0x0201) may return an integer to prevent the target window from being notified that a mouse click has occurred. In many cases (such as a message arriving via [PostMessage](PostMessage.md)), it does not matter which integer is returned; but if in doubt, 0 is usually safest.

The range of valid return values depends on whether the exe running the script is 32-bit or 64-bit. Non-empty return values must be between -2^31 and 2^32-1 for 32-bit scripts (`A_PtrSize = 4`) and between -2^63 and 2^63-1 for 64-bit scripts (`A_PtrSize = 8`).

If there are multiple callbacks monitoring a given message number, they are called one by one until one returns a non-empty value.

<a id="Remarks"></a>
## General Remarks

Unlike a normal function-call, the arrival of a monitored message calls the callback as a new [thread](../misc/Threads.md). Because of this, the callback starts off fresh with the default values for settings such as [SendMode](SendMode.md) and [DetectHiddenWindows](DetectHiddenWindows.md). These defaults can be changed during [script startup](../Scripts.md#auto).

Messages sent to a control (rather than being posted) are not monitored because the system routes them directly to the control behind the scenes. This is seldom an issue for system-generated messages because most of them are posted.

If the script is intended to stay running in an idle state to monitor for incoming messages, it may be necessary to call the [Persistent](Persistent.md) function to prevent the script from exiting. OnMessage does not automatically make the script persistent, as it is sometimes unnecessary or undesired. For instance, when OnMessage is used to monitor input to a GUI window (such as in the [WM_LBUTTONDOWN example](#ExLButtonDown)), it is often more appropriate to allow the script to exit automatically when the last GUI window is closed.

<a id="Critical"></a>

If a message arrives while its callback is still running due to a previous arrival of the same message, by default the callback will not be called again; instead, the message will be treated as unmonitored. If this is undesirable, there are multiple ways it can be avoided:

- If the message is posted rather than sent and has a number greater than 0x0311, it can be buffered until its callback completes by specifying [Critical](Critical.md) as the first line of the callback. Alternatively, [Thread Interrupt](Thread.md#Interrupt) can achieve the same effect as long as it lasts long enough for the callback to finish.
- Using [Critical](Critical.md) to increase the [message check interval](Critical.md#Interval) gives the callback more time to complete before any messages are dispatched. An interval greater than 16 may be needed for reliability. Due to the granularity of the system timer (usually 15.6 milliseconds), the default interval for non-Critical threads (5 milliseconds) might appear to pass the instant after the callback starts.
- Ensuring that the callback returns quickly reduces the risk that messages will be missed due to *MaxThreads*. One way to do this is to have it queue up a future thread by [posting](PostMessage.md) to its own script a monitored message number greater than 0x0311. That message's callback should use [Critical](Critical.md) as its first line to ensure that its messages are buffered. Alternatively, a [timer](SetTimer.md) can be used to queue up a future thread.
- Specifying a higher value for [*MaxThreads*](#MaxThreads) allows the callback to be interrupted to process the newly-received message.

<a id="buffering"></a>

If a monitored message that is numerically greater than 0x0311 is posted while the script is [uninterruptible](../misc/Threads.md#Interrupt), the message is buffered; that is, its callback is not called until the script becomes interruptible. However, messages which are sent rather than posted cannot be buffered as they must provide a return value. Posted messages also might not be buffered when a modal message loop is running, such as for a system dialog, ListView drag-drop operation or menu.

If a monitored message arrives and is not buffered, its callback is called immediately even if the thread is [uninterruptible](../misc/Threads.md#Interrupt) when the message is received.

The [priority](../misc/Threads.md) of OnMessage threads is always 0. Consequently, no messages are monitored or buffered when the current thread's priority is higher than 0.

Caution should be used when monitoring system messages (those below 0x0400). For example, if a callback does not finish quickly, the response to the message might take longer than the system expects, which might cause side-effects. Unwanted behavior may also occur if a callback returns an integer to suppress further processing of a message, but the system expected different processing or a different response.

When the script is displaying a system dialog such as [MsgBox](MsgBox.md), any message posted to a control is not monitored. For example, if the script is displaying a message box and the user clicks a button in a GUI window, the WM_LBUTTONDOWN message is sent directly to the button without calling the callback.

Although an external program may post messages directly to a script's thread via PostThreadMessage() or other API call, this is not recommended because the messages would be lost if the script is displaying a system window such as a [message box](MsgBox.md). Instead, it is usually best to post or send the messages to the [script's main window](../Program.md#main-window) or one of its GUI windows.

<a id="Related"></a>
## Related

[CallbackCreate](CallbackCreate.md), [OnExit](OnExit.md), [OnClipboardChange](OnClipboardChange.md), [PostMessage](PostMessage.md), [SendMessage](SendMessage.md), [Functions](../Functions.md), [Windows Messages](../misc/SendMessageList.md), [Threads](../misc/Threads.md), [Critical](Critical.md), [DllCall](DllCall.md)

<a id="Examples"></a>
## Examples

<a id="ExLButtonDown"></a>

**Example:** Monitors mouse clicks in a GUI window. Related topic: [ContextMenu](GuiOnEvent.md#ContextMenu) event

```ahk
MyGui := Gui(, "Example Window")
MyGui.Add("Text",, "Click anywhere in this window.")
MyGui.Add("Edit", "w200")
MyGui.Show()
OnMessage 0x0201, WM_LBUTTONDOWN

WM_LBUTTONDOWN(wParam, lParam, msg, hwnd)
{
    X := lParam & 0xFFFF
    Y := lParam >> 16
    Control := ""
    thisGui := GuiFromHwnd(hwnd)
    thisGuiControl := GuiCtrlFromHwnd(hwnd)
    if thisGuiControl
    {
        thisGui := thisGuiControl.Gui
        Control := "`n(in control " . thisGuiControl.ClassNN . ")"
    }
    ToolTip "You left-clicked in Gui window '" thisGui.Title "' at client coordinates " X "x" Y "." Control
}
```

<a id="ExShutdown"></a>

**Example:** Detects system shutdown/logoff and allows the user to abort it. On Windows Vista and later, the system displays a user interface showing which program is blocking shutdown/logoff and allowing the user to force shutdown/logoff. On older OSes, the script displays a confirmation prompt. Related topic: [OnExit](OnExit.md)

```ahk
; The following DllCall is optional: it tells the OS to shut down this script first (prior to all other applications).
DllCall("kernel32.dll\SetProcessShutdownParameters", "UInt", 0x4FF, "UInt", 0)
OnMessage(0x0011, On_WM_QUERYENDSESSION)
Persistent

On_WM_QUERYENDSESSION(wParam, lParam, *)
{
    ENDSESSION_LOGOFF := 0x80000000
    if (lParam & ENDSESSION_LOGOFF)  ; User is logging off.
        EventType := "Logoff"
    else  ; System is either shutting down or restarting.
        EventType := "Shutdown"
    try
    {
        ; Set a prompt for the OS shutdown UI to display.  We do not display
        ; our own confirmation prompt because we have only 5 seconds before
        ; the OS displays the shutdown UI anyway.  Also, a program without
        ; a visible window cannot block shutdown without providing a reason.
        BlockShutdown("Example script attempting to prevent " EventType ".")
        return false
    }
    catch
    {
        ; ShutdownBlockReasonCreate is not available, so this is probably
        ; Windows XP, 2003 or 2000, where we can actually prevent shutdown.
        Result := MsgBox(EventType " in progress. Allow it?",, "YN")
        if (Result = "Yes")
            return true  ; Tell the OS to allow the shutdown/logoff to continue.
        else
            return false  ; Tell the OS to abort the shutdown/logoff.
    }
}

BlockShutdown(Reason)
{
    ; If your script has a visible GUI, use it instead of A_ScriptHwnd.
    DllCall("ShutdownBlockReasonCreate", "ptr", A_ScriptHwnd, "wstr", Reason)
    OnExit StopBlockingShutdown
}

StopBlockingShutdown(*)
{
    OnExit StopBlockingShutdown, 0
    DllCall("ShutdownBlockReasonDestroy", "ptr", A_ScriptHwnd)
}
```

<a id="ExCustom"></a>

**Example:** Receives a custom message and up to two numbers from some other script or program (to send strings rather than numbers, see the example after this one).

```ahk
OnMessage 0x5555, MsgMonitor
Persistent

MsgMonitor(wParam, lParam, msg, *)
{
    ; Since returning quickly is often important, it is better to use ToolTip than
    ; something like MsgBox that would prevent the callback from finishing:
    ToolTip "Message " msg " arrived:`nWPARAM: " wParam "`nLPARAM: " lParam
}

; The following could be used inside some other script to run the callback inside the above script:
SetTitleMatchMode 2
DetectHiddenWindows True
if WinExist("Name of Receiving Script.ahk ahk_class AutoHotkey")
    PostMessage 0x5555, 11, 22  ; The message is sent to the "last found window" due to WinExist above.
DetectHiddenWindows False  ; Must not be turned off until after PostMessage.
```

<a id="ExSendString"></a>

**Example:** Sends a string of any length from one script to another. To use this, save and run both of the following scripts then press `Win`+`Space` to show an input box that will prompt you to type in a string. Both scripts must use the same [native encoding](../Concepts.md#native-encoding).

Save the following script as **Receiver.ahk** then launch it.

```ahk
#SingleInstance
OnMessage 0x004A, Receive_WM_COPYDATA  ; 0x004A is WM_COPYDATA
Persistent

Receive_WM_COPYDATA(wParam, lParam, msg, hwnd)
{
    StringAddress := NumGet(lParam, 2*A_PtrSize, "Ptr")  ; Retrieves the CopyDataStruct's lpData member.
    CopyOfData := StrGet(StringAddress)  ; Copy the string out of the structure.
    ; Show it with ToolTip vs. MsgBox so we can return in a timely fashion:
    ToolTip A_ScriptName "`nReceived the following string:`n" CopyOfData
    return true  ; Returning 1 (true) is the traditional way to acknowledge this message.
}
```

Save the following script as **Sender.ahk** then launch it. After that, press the `Win`+`Space` hotkey.

```ahk
TargetScriptTitle := "Receiver.ahk ahk_class AutoHotkey"

#space::  ; Win+Space hotkey. Press it to show an input box for entry of a message string.
{
    ib := InputBox("Enter some text to Send:", "Send text via WM_COPYDATA")
    if ib.Result = "Cancel"  ; User pressed the Cancel button.
        return
    result := Send_WM_COPYDATA(ib.Value, TargetScriptTitle)
    if result = ""
        MsgBox "SendMessage failed or timed out. Does the following WinTitle exist?:`n" TargetScriptTitle
    else if (result = 0)
        MsgBox "Message sent but the target window responded with 0, which may mean it ignored it."
}

Send_WM_COPYDATA(StringToSend, TargetScriptTitle)
; This function sends the specified string to the specified window and returns the reply.
; The reply is 1 if the target window processed the message, or 0 if it ignored it.
{
    CopyDataStruct := Buffer(3*A_PtrSize)  ; Set up the structure's memory area.
    ; First set the structure's cbData member to the size of the string, including its zero terminator:
    SizeInBytes := (StrLen(StringToSend) + 1) * 2
    NumPut( "Ptr", SizeInBytes  ; OS requires that this be done.
          , "Ptr", StrPtr(StringToSend)  ; Set lpData to point to the string itself.
          , CopyDataStruct, A_PtrSize)
    Prev_DetectHiddenWindows := A_DetectHiddenWindows
    Prev_TitleMatchMode := A_TitleMatchMode
    DetectHiddenWindows True
    SetTitleMatchMode 2
    TimeOutTime := 4000  ; Optional. Milliseconds to wait for response from receiver.ahk. Default is 5000
    ; Must use SendMessage not PostMessage.
    RetValue := SendMessage(0x004A, 0, CopyDataStruct,, TargetScriptTitle,,,, TimeOutTime) ; 0x004A is WM_COPYDATA.
    DetectHiddenWindows Prev_DetectHiddenWindows  ; Restore original setting for the caller.
    SetTitleMatchMode Prev_TitleMatchMode         ; Same.
    return RetValue  ; Return SendMessage's reply back to our caller.
}
```

See the [WinLIRC client script](../scripts/index.md#WinLIRC) for a demonstration of how to use OnMessage to receive notification when data has arrived on a network connection.
