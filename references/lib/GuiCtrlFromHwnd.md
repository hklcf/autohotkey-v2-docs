# GuiCtrlFromHwnd

Retrieves the [GuiControl object](GuiControl.md) of a GUI control associated with the specified window handle.

```ahk
GuiControlObj := GuiCtrlFromHwnd(Hwnd)
```

<a id="Parameters"></a>
## Parameters

**Hwnd**

Type: [Integer](../Concepts.md#numbers)

The [window handle (HWND)](../misc/ControlID.md#HWND) of a GUI control, or a child window of such a control (e.g. the Edit control of a ComboBox). The control must have been created by the current script via [Gui.Add](Gui.md#Add).

<a id="Return_Value"></a>
## Return Value

Type: [Object](../Concepts.md#objects) or [String (empty)](../Concepts.md#nothing)

This function returns the [GuiControl object](GuiControl.md) associated with the specified HWND, or an empty string if there isn't one or the HWND is invalid.

<a id="Remarks"></a>
## Remarks

For example, a HWND of a GUI control can be retrieved via [GuiControl.Hwnd](GuiControl.md#Hwnd), [MouseGetPos](MouseGetPos.md) or [OnMessage](OnMessage.md).

<a id="Related"></a>
## Related

[Gui()](Gui.md#Call), [Gui object](Gui.md), [GuiControl object](GuiControl.md), [GuiFromHwnd](GuiFromHwnd.md), [Control Types](GuiControls.md), [ListView](ListView.md), [TreeView](TreeView.md), [Menu object](Menu.md), [Control functions](Control.md), [MsgBox](MsgBox.md), [FileSelect](FileSelect.md), [DirSelect](DirSelect.md)

<a id="Examples"></a>
## Examples

See the [ToolTip example](Gui.md#ExToolTip) on the Gui object page.
