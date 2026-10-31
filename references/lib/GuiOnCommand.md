# OnCommand (GUI)

Registers a function or method to be called when a control notification is received via the [WM_COMMAND](#WM_COMMAND) message.

```ahk
GuiCtrl.OnCommand(NotifyCode, Callback , AddRemove)
```

<a id="Parameters"></a>
## Parameters

**NotifyCode**

Type: [Integer](../Concepts.md#numbers)

The control-defined notification code to monitor.

**Callback**

Type: [String](../Concepts.md#strings) or [Function Object](../misc/Functor.md)

The function, method or object to call when the event is raised.

If the GUI has an event sink (that is, if [Gui()](Gui.md#Call)'s *EventObj* parameter was specified), this parameter may be the name of a method belonging to the event sink. Otherwise, this parameter must be a [function object](../misc/Functor.md).

<a id="Callback_Parameters"></a>

The callback accepts one parameter and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(GuiCtrl) { ...
```

Although the name you give the parameter does not matter, it is assigned the [GuiControl object](GuiControl.md) of the current GUI control.

You can omit the callback's parameter if the corresponding information is not needed, but in this case an asterisk must be specified, e.g. `MyCallback(*)`.

The [notes for OnEvent](GuiOnEvent.md#Callback_Parameters) regarding `this` and bound functions also apply to OnCommand.

<a id="Callback_Return_Value"></a>

If multiple callbacks have been registered for an event, a callback may return a non-empty value to prevent any remaining callbacks from being called.

The callback's return value is ignored by the GUI control.

**AddRemove**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1. Otherwise, specify one of the following numbers:

- 1 = Call the callback after any previously registered callbacks.
- -1 = Call the callback before any previously registered callbacks.
- 0 = Do not call the callback.

<a id="WM_COMMAND"></a>
## WM_COMMAND

Certain types of controls send a [WM_COMMAND](https://learn.microsoft.com/windows/win32/menurc/wm-command) message whenever an interesting event occurs. These are usually standard Windows controls which have been around a long time, as newer controls use the WM_NOTIFY message (see [OnNotify](GuiOnNotify.md)). Commonly used notification codes are translated to events, which the script can monitor with [OnEvent](GuiOnEvent.md).

The message's parameters contain the control's numeric ID (the LOWORD of wParam), the control's HWND (lParam) and the notification code (the HIWORD of wParam), which AutoHotkey uses to dispatch the notification to the appropriate callback. There are no additional parameters.

To determine which notifications are available (if any), refer to the control's documentation. [Control Library (Microsoft Docs)](https://learn.microsoft.com/windows/win32/controls/individual-control-info) contains links to each of the Windows common controls (however, only a few of these use WM_COMMAND). The notification codes (numbers) can be found in the Windows SDK, or by searching the Internet.

<a id="Related"></a>
## Related

These notes for [OnEvent](GuiOnEvent.md) also apply to OnCommand: [Threads](GuiOnEvent.md#Threads), [Destroying the GUI](GuiOnEvent.md#Destroying_the_GUI).

[OnNotify](GuiOnNotify.md) can be used for notifications which are sent as a WM_NOTIFY message.
