# OnExit

Registers a [function](../Functions.md) to be called automatically whenever the script exits.

```ahk
OnExit Callback , AddRemove
```

<a id="Parameters"></a>
## Parameters

**Callback**

Type: [Function Object](../misc/Functor.md)

The function to call.

The callback accepts two parameters and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(ExitReason, ExitCode) { ...
```

Although the names you give the parameters do not matter, the following values are sequentially assigned to them:

1. The exit reason (one of the words from the [table below](#ExitReason)).
2. The exit code passed to [Exit](Exit.md) or [ExitApp](ExitApp.md).

You can omit one or more parameters from the end of the callback's parameter list if the corresponding information is not needed, but in this case an asterisk must be specified as the final parameter, e.g. `MyCallback(Param1, *)`.

The callback can return a non-zero integer to prevent the script from exiting (with some [rare exceptions](#close)) and calling more callbacks. Otherwise, the script exits after all registered callbacks are called.

**AddRemove**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1. Otherwise, specify one of the following numbers:

- 1 = Call the callback after any previously registered callbacks.
- -1 = Call the callback before any previously registered callbacks.
- 0 = Do not call the callback.

<a id="Remarks"></a>
## Remarks

Any number of callbacks can be registered. A callback usually should not call ExitApp; if it does, the script terminates immediately.

The callbacks are called when the script exits by any means (except when it is killed by something like "End Task"). It is also called whenever [#SingleInstance](_SingleInstance.md) and [Reload](Reload.md) ask a previous instance to terminate.

A script can detect and optionally abort a system shutdown or logoff via `OnMessage(0x0011, On_WM_QUERYENDSESSION)` (see [OnMessage example #2](OnMessage.md#ExShutdown) for a working script).

The OnExit [thread](../misc/Threads.md) does not obey [#MaxThreads](_MaxThreads.md) (it will always launch when needed). In addition, while it is running, it cannot be interrupted by any [thread](../misc/Threads.md), including [hotkeys](../Hotkeys.md), [custom menu items](Menu.md), and [timed subroutines](SetTimer.md). However, it will be interrupted (and the script will terminate) if the user chooses Exit from the tray menu or main menu, or the script is asked to terminate as a result of [Reload](Reload.md) or [#SingleInstance](_SingleInstance.md). Because of this, a callback should be designed to finish quickly unless the user is aware of what it is doing.

If the OnExit [thread](../misc/Threads.md) encounters a failure condition such as a runtime error, the script will terminate.

If the OnExit [thread](../misc/Threads.md) was launched due to [Exit](Exit.md) or [ExitApp](ExitApp.md) that specified an exit code, that exit code is used unless a callback returns 1 (true) to prevent exit or calls ExitApp.

Whenever an exit attempt is made, each callback starts off fresh with the default values for settings such as [SendMode](SendMode.md). These defaults can be changed during [script startup](../Scripts.md#auto).

<a id="ExitReason"></a>
## Exit Reasons

| Reason | Description |
| --- | --- |
| <a id="logoff"></a>Logoff | The user is logging off. |
| Shutdown | The system is being shut down or restarted, such as by the [Shutdown](Shutdown.md) function. |
| <a id="close"></a>Close | The script was sent a WM_CLOSE or WM_QUIT message, had a critical error, or is being closed in some other way. Although all of these are unusual, WM_CLOSE might be caused by [WinClose](WinClose.md) having been used on the script's main window. To close (hide) the window without terminating the script, use [WinHide](WinHide.md).<br> If the script is exiting due to a critical error or its [main window](../Program.md#main-window) being destroyed, it will unconditionally terminate after the OnExit thread completes.<br> If the main window is being destroyed, it may still exist but cannot be displayed. This condition can be detected by monitoring the WM_DESTROY message with [OnMessage](OnMessage.md). |
| Error | A runtime error occurred in a script that is not [persistent](../Scripts.md#persistent). An example of a runtime error is [Run/RunWait](Run.md) being unable to launch the specified program or document. |
| Menu | The user selected Exit from the [main window](../Program.md#main-window)'s menu or from the [standard tray menu](../Program.md#tray-icon). |
| Exit | [Exit](Exit.md) or [ExitApp](ExitApp.md) was used (includes [custom menu items](Menu.md)). |
| Reload | The script is being reloaded via the [Reload](Reload.md) function or menu item. |
| Single | The script is being replaced by a new instance of itself as a result of [#SingleInstance](_SingleInstance.md). |

<a id="Related"></a>
## Related

[OnError](OnError.md), [OnMessage](OnMessage.md), [CallbackCreate](CallbackCreate.md), [OnClipboardChange](OnClipboardChange.md), [ExitApp](ExitApp.md), [Shutdown](Shutdown.md), [Persistent](Persistent.md), [Threads](../misc/Threads.md), [Return](Return.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Asks the user before exiting the script. To test this example, right-click the [tray icon](../Program.md#tray-icon) and click Exit.

```ahk
Persistent  ; Prevent the script from exiting automatically.
OnExit ExitFunc

ExitFunc(ExitReason, ExitCode)
{
    if ExitReason != "Logoff" and ExitReason != "Shutdown"
    {
        Result := MsgBox("Are you sure you want to exit?",, 4)
        if Result = "No"
            return 1  ; Callbacks must return non-zero to avoid exit.
    }
    ; Do not call ExitApp -- that would prevent other callbacks from being called.
}
```

<a id="ExFnObj"></a>

**Example:** Registers a method to be called on exit.

```ahk
Persistent  ; Prevent the script from exiting automatically.
OnExit MyObject.Exiting

class MyObject
{
    static Exiting(*)
    {
        MsgBox "MyObject is cleaning up prior to exiting..."
        /*
        this.SayGoodbye()
        this.CloseNetworkConnections()
        */
    }
}
```
