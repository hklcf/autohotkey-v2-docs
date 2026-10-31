# GuiFromHwnd

Retrieves the [Gui object](Gui.md) of a GUI window associated with the specified window handle.

```ahk
GuiObj := GuiFromHwnd(Hwnd , RecurseParent)
```

<a id="Parameters"></a>
## Parameters

**Hwnd**

Type: [Integer](../Concepts.md#numbers)

The [window handle (HWND)](../misc/WinTitle.md#ahk_id) of a GUI window previously created by the script, or if *RecurseParent* is true, any child window of a GUI window created by the script.

**RecurseParent**

Type: [Boolean](../Concepts.md#boolean)

If this parameter is true and *Hwnd* identifies a child window which is not a GUI, the function searches for and retrieves its closest parent window which is a GUI. Otherwise, the function returns an empty string if *Hwnd* does not directly identify a GUI window.

<a id="Return_Value"></a>
## Return Value

Type: [Object](../Concepts.md#objects) or [String (empty)](../Concepts.md#nothing)

This function returns the [Gui object](Gui.md) associated with the specified HWND, or an empty string if there isn't one or the HWND is invalid.

<a id="Remarks"></a>
## Remarks

For example, the HWND of a GUI window may be passed to an [OnMessage](OnMessage.md) function, or can be retrieved via [Gui.Hwnd](Gui.md#Hwnd), [WinExist](WinExist.md) or some other method.

<a id="Related"></a>
## Related

[Gui()](Gui.md#Call), [Gui object](Gui.md), [GuiControl object](GuiControl.md), [GuiCtrlFromHwnd](GuiCtrlFromHwnd.md), [Control Types](GuiControls.md), [ListView](ListView.md), [TreeView](TreeView.md), [Menu object](Menu.md), [Control functions](Control.md), [MsgBox](MsgBox.md), [FileSelect](FileSelect.md), [DirSelect](DirSelect.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves the Gui object by using the HWND of the GUI window just created and reports its title.

```ahk
MyGui := Gui(, "Title of Window")
MyGui.Add("Text",, "Some text to display.")
MyGui.Show()

MsgBox(GuiFromHwnd(MyGui.Hwnd).Title)
```
