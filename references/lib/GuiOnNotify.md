# OnNotify (GUI)

Registers a function or method to be called when a control notification is received via the [WM_NOTIFY](#WM_NOTIFY) message.

```ahk
GuiCtrl.OnNotify(NotifyCode, Callback , AddRemove)
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

The callback accepts two parameters and can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(GuiCtrl, lParam) { ...
```

Although the names you give the parameters do not matter, the following values are sequentially assigned to them:

1. The [GuiControl object](GuiControl.md) of the current GUI control.
2. The address of a notification structure derived from [NMHDR](https://learn.microsoft.com/windows/win32/api/richedit/ns-richedit-nmhdr). Its exact type depends on the type of control and notification code. If the structure contains additional information about the notification, the callback can retrieve it with [NumGet](NumGet.md) and/or [StrGet](StrGet.md).

You can omit one or more parameters from the end of the callback's parameter list if the corresponding information is not needed, but in this case an asterisk must be specified as the final parameter, e.g. `MyCallback(Param1, *)`.

The [notes for OnEvent](GuiOnEvent.md#Callback_Parameters) regarding `this` and bound functions also apply to OnNotify.

<a id="Callback_Return_Value"></a>

If multiple callbacks have been registered for an event, a callback may return a non-empty value to prevent any remaining callbacks from being called.

The callback's return value may have additional meaning, depending on the notification. For example, the ListView notification [LVN_BEGINLABELEDIT](https://learn.microsoft.com/windows/win32/controls/lvn-beginlabeledit) (-175 or -105) prevents the user from editing the label if the callback returns TRUE (1).

**AddRemove**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1. Otherwise, specify one of the following numbers:

- 1 = Call the callback after any previously registered callbacks.
- -1 = Call the callback before any previously registered callbacks.
- 0 = Do not call the callback.

<a id="WM_NOTIFY"></a>
## WM_NOTIFY

Certain types of controls send a [WM_NOTIFY](https://learn.microsoft.com/windows/win32/controls/wm-notify) message whenever an interesting event occurs or the control requires information from the program. The *lParam* parameter of this message contains a pointer to a structure containing information about the notification. The type of structure depends on the notification code and the type of control which raised the notification, but is always based on [NMHDR](https://learn.microsoft.com/windows/win32/api/richedit/ns-richedit-nmhdr).

To determine which notifications are available (if any), what type of structure they provide and how they interpret the return value, refer to the control's documentation. [Control Library (Microsoft Docs)](https://learn.microsoft.com/windows/win32/controls/individual-control-info) contains links to each of the Windows common controls. The notification codes (numbers) can be found in the Windows SDK, or by searching the Internet.

AutoHotkey uses the *idFrom* and *hwndFrom* fields to identify which control sent the notification, in order to dispatch it to the appropriate object. The *code* field contains the notification code. Since these must match up to *GuiCtrl* and *NotifyCode* used to register the callback, they are rarely useful to the script.

<a id="Related"></a>
## Related

These notes for [OnEvent](GuiOnEvent.md) also apply to OnNotify: [Threads](GuiOnEvent.md#Threads), [Destroying the GUI](GuiOnEvent.md#Destroying_the_GUI).

[OnCommand](GuiOnCommand.md) can be used for notifications which are sent as a WM_COMMAND message.
