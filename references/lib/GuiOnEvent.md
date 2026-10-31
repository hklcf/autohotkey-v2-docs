# OnEvent (GUI)

Registers a function or method to be called when the given event is raised by a GUI window or control.

```ahk
Gui.OnEvent(EventName, Callback , AddRemove)
GuiCtrl.OnEvent(EventName, Callback , AddRemove)
```

<a id="Parameters"></a>
## Parameters

**EventName**

Type: [String](../Concepts.md#strings)

The name of the event. See [Events](#Events) further below.

**Callback**

Type: [String](../Concepts.md#strings) or [Function Object](../misc/Functor.md)

The function, method or object to call when the event is raised.

If the GUI has an event sink (that is, if [Gui()](Gui.md#Call)'s *EventObj* parameter was specified), this parameter may be the name of a method belonging to the event sink. Otherwise, this parameter must be a [function object](../misc/Functor.md).

The callback accepts a specific number of parameters depending on the [window event](#Window_Events) and [control event](#Control_Events). A callback function can be [defined](../Functions.md#intro) as follows:

```ahk
MyCallback(GuiOrCtrlObj, ...) { ...
```

> **Note:** If the callback function was created by a [method definition](../Objects.md#Custom_Classes_method), it has an implicit `this` parameter which must be taken into account.

Although the names you give the parameters do not matter, the following values are sequentially assigned to them:

1. The [Gui](Gui.md) or [GuiControl](GuiControl.md) object of the GUI window or control which raised the event. This value is always passed.
2. Zero or more additional values depending on the [window event](#Window_Events) and [control event](#Control_Events). For example, in the case of the [Size](#Size) window event, this would be *MinMax* (whether the window is minimized or maximized), *Width* (its new width), and *Height* (its new height).

You can omit one or more parameters from the end of the callback's parameter list if the corresponding information is not needed, but in this case an asterisk must be specified as the final parameter, e.g. `MyCallback(Param1, *)`.

<a id="Callback_Return_Value"></a>

If multiple callbacks have been registered for an event, a callback may return a non-empty value to prevent any remaining callbacks from being called.

The return value may have additional meaning for specific events. For example, a [Close](#Close) callback may return a non-zero number (such as `true`) to prevent the GUI window from closing.

For more details, see the following sections.

**AddRemove**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1. Otherwise, specify one of the following numbers:

- 1 = Call the callback after any previously registered callbacks.
- -1 = Call the callback before any previously registered callbacks.
- 0 = Do not call the callback.

<a id="Callback_Parameters"></a>
## Callback Parameters

If the callback is a method registered by name, its hidden [*this* parameter](../Objects.md#Custom_Classes_method) seamlessly receives the event sink object (that is, the object to which the method belongs). This parameter is not shown in the parameter lists in this documentation.

Since *Callback* can be an object, it can be a [BoundFunc object](../misc/Functor.md#BoundFunc) which inserts additional parameters at the beginning of the parameter list and then calls another function. This is a general technique not specific to OnEvent, so is generally ignored by the rest of this documentation.

The callback's first explicit parameter is the [Gui](Gui.md) or [GuiControl](GuiControl.md) object which raised the event. The only exception is that this parameter is omitted when a Gui [handles its own events](Gui.md#EventObj), since `this` already contains a reference to the Gui.

Many events pass additional parameters about the event, as described for each event.

As with all methods or functions called dynamically, the callback is not required to declare parameters which the callback itself does not need, but in this case an asterisk must be specified as the final parameter, e.g. `MyCallback(Param1, *)`. If an event has more parameters than are declared by the callback, they will simply be ignored (unless the callback is [variadic](../Functions.md#Variadic)).

The callback can declare more parameters than the event provides if (and only if) the additional parameters are declared optional. However, the use of optional parameters is not recommended as future versions of the program may extend an event with additional parameters, in which case the optional parameters would stop receiving their default values.

<a id="Callback_Name"></a>
## Callback Name

By convention, the syntax of each event below is shown with a function name of the form `ObjectType_EventName`, for clarity. Scripts are not required to follow this convention, and can use any valid function name.

<a id="Threads"></a>
## Threads

Each event callback is called in a new [thread](../misc/Threads.md), and therefore starts off fresh with the default values for settings such as [SendMode](SendMode.md). These defaults can be changed during [script startup](../Scripts.md#auto).

Whenever a GUI [thread](../misc/Threads.md) is launched, that thread's [last found window](../misc/WinTitle.md#LastFoundWindow) starts off as the GUI window itself. This allows functions for windows and controls -- such as [WinGetStyle](WinGetStyle.md), [WinSetTransparent](WinSetTransparent.md), and [ControlGetFocus](ControlGetFocus.md) -- to omit *WinTitle* and *WinText* when operating upon the GUI window itself (even if it is hidden).

Except where noted, each event is limited to one thread at a time, per object. If an event is raised before a previous thread started by that event finishes, it is usually discarded. To prevent this, use [Critical](Critical.md) as the callback's first line (however, this will also buffer/defer other [threads](../misc/Threads.md) such as the press of a hotkey).

<a id="Destroying_the_GUI"></a>
## Destroying the GUI

When a GUI is destroyed, all event callbacks are released. Therefore, if the GUI is destroyed while an event is being dispatched, subsequent event callbacks are not called. For clarity, callbacks should [return a non-empty value](#Callback_Return_Value) after destroying the GUI.

<a id="Events"></a>
## Events

The following events are supported by [Gui](Gui.md) objects:

| Event | Raised when... |
| --- | --- |
| [Close](#Close) | The window is closed. |
| [ContextMenu](#ContextMenu) | The user right-clicks within the window or presses `Menu` or `Shift`+`F10`. |
| [DropFiles](#DropFiles) | Files/folders are dragged and dropped onto the window. |
| [Escape](#Escape) | The user presses `Esc` while the GUI window is active. |
| [Size](#Size) | The window is resized, minimized, maximized or restored. |

The following events are supported by [GuiControl](GuiControl.md) objects, depending on the control type:

| Event | Raised when... |
| --- | --- |
| [Change](#Change) | The control's value changes. |
| [Click](#Click) | The control is clicked. |
| [DoubleClick](#DoubleClick) | The control is double-clicked. |
| [ColClick](#ColClick) | One of the ListView's column headers is clicked. |
| [ContextMenu](#Ctrl-ContextMenu) | The user right-clicks the control or presses `Menu` or `Shift`+`F10` while the control has the keyboard focus. |
| [Focus](#Focus) | The control gains the keyboard focus. |
| [LoseFocus](#LoseFocus) | The control loses the keyboard focus. |
| [ItemCheck](#ItemCheck) | A ListView or TreeView item is checked or unchecked. |
| [ItemEdit](#ItemEdit) | A ListView or TreeView item's label is edited by the user. |
| [ItemExpand](#ItemExpand) | A TreeView item is expanded or collapsed. |
| [ItemFocus](#ItemFocus) | The focused item changes in a ListView. |
| [ItemSelect](#ItemSelect) | A ListView or TreeView item is selected, or a ListView item is deselected. |

<a id="Window_Events"></a>
## Window Events

<a id="Close"></a>
### Close

Launched when the user or another program attempts to close the window, such as by pressing the X button in its title bar, selecting "Close" from its system menu, or calling [WinClose](WinClose.md).

```ahk
Gui_Close(GuiObj)
```

By default, the window is automatically hidden after the callback returns, or if no callbacks were registered. A callback can prevent this by returning 1 (or `true`), which will also prevent any remaining callbacks from being called. The callback can hide the window immediately by calling [GuiObj.Hide](Gui.md#Hide), or destroy the window by calling [GuiObj.Destroy](Gui.md#Destroy).

For example, this GUI shows a confirmation prompt before closing:

```ahk
MyGui := Gui()
MyGui.AddText("", "Press Alt+F4 or the X button in the title bar.")
MyGui.OnEvent("Close", MyGui_Close)
MyGui_Close(thisGui) {  ; Declaring this parameter is optional.
    if MsgBox("Are you sure you want to close the GUI?",, "y/n") = "No"
        return true  ; true = 1
}
MyGui.Show()
```

<a id="ContextMenu"></a>
### ContextMenu

Launched whenever the user right-clicks anywhere in the window except the title bar and menu bar. It is also launched in response to pressing `Menu` or `Shift`+`F10`.

```ahk
Gui_ContextMenu(GuiObj, GuiCtrlObj, Item, IsRightClick, X, Y)
```

**GuiCtrlObj**

Type: [Object](../Concepts.md#objects) or [String (empty)](../Concepts.md#nothing)

The [GuiControl object](GuiControl.md) of the control that received the event (blank if none).

**Item**

Type: [Integer](../Concepts.md#numbers)

When a ListBox, ListView, or TreeView is the target of the context menu (as determined by *GuiCtrlObj*), *Item* specifies which of the control's items is the target.

[ListBox](GuiControls.md#ListBox): The position number of the currently focused item. Note that a standard ListBox does not focus an item when it is right-clicked, so this might not be the clicked item.

[ListView](ListView.md) and [TreeView](TreeView.md): For right-clicks, *Item* contains the clicked item's row number or ID (or 0 if the user clicked somewhere other than an item). For `Menu` and `Shift`+`F10`, *Item* contains the selected item's row number or ID.

**IsRightClick**

Type: [Integer (boolean)](../Concepts.md#boolean)

One of the following values:

- 1 (true) = The user clicked the right mouse button.
- 0 (false) = The user pressed `Menu` or `Shift`+`F10`.

**X, Y**

Type: [Integer](../Concepts.md#numbers)

The X and Y coordinates of where the script should display the menu (e.g. `MyContextMenu.Show(X, Y)`). Coordinates are relative to the upper-left corner of the window's client area.

Unlike most other GUI events, the ContextMenu event can have more than one concurrent [thread](../misc/Threads.md).

Each control can have its own ContextMenu event callback which is called before any callback registered for the Gui object. Control-specific callbacks omit the *GuiObj* parameter, but all other parameters are the same.

Note: Since [Edit](GuiControls.md#Edit) and [MonthCal](GuiControls.md#MonthCal) controls have their own context menu, a right-click in one of them will not launch the ContextMenu event.

<a id="DropFiles"></a>
### DropFiles

Launched whenever files/folders are dropped onto the window as part of a drag-and-drop operation (but if this callback is already running, drop events are ignored).

```ahk
Gui_DropFiles(GuiObj, GuiCtrlObj, FileArray, X, Y)
```

**GuiCtrlObj**

Type: [Object](../Concepts.md#objects) or [String (empty)](../Concepts.md#nothing)

The [GuiControl object](GuiControl.md) of the control upon which the files were dropped (blank if none).

**FileArray**

Type: [Array](Array.md)

An array of filenames, where `FileArray[1]` is the first file and `FileArray.Length` returns the number of files. A [for-loop](For.md) can be used to iterate through the files:

```ahk
Gui_DropFiles(GuiObj, GuiCtrlObj, FileArray, X, Y) {
    for i, DroppedFile in FileArray
        MsgBox "File " i " is:`n" DroppedFile
}
```

**X, Y**

Type: [Integer](../Concepts.md#numbers)

The X and Y coordinates of where the files were dropped, relative to the upper-left corner of the window's client area.

<a id="Escape"></a>
### Escape

Launched when the user presses `Esc` while the GUI window is active.

```ahk
Gui_Escape(GuiObj)
```

By default, pressing `Esc` has no effect. Known limitation: If the first control in the window is disabled (possibly depending on control type), the Escape event will not be launched. There may be other circumstances that produce this effect.

<a id="Size"></a>
### Size

Launched when the window is resized, minimized, maximized, or restored.

```ahk
Gui_Size(GuiObj, MinMax, Width, Height)
```

**MinMax**

Type: [Integer](../Concepts.md#numbers)

One of the following values:

- 0 = The window is neither minimized nor maximized.
- 1 = The window is maximized.
- -1 = The window is minimized.

Note that a maximized window can be resized without restoring/un-maximizing it, so a value of 1 does not necessarily mean that this event was raised in response to the user maximizing the window.

**Width, Height**

Type: [Integer](../Concepts.md#numbers)

The new width and height of the window's client area, which is the area excluding title bar, menu bar, and borders.

A script may use the Size event to reposition and resize controls in response to the user's resizing of the window.

When the window is resized (even by the script), the Size event might not be raised immediately. As with other window events, if the current thread is [uninterruptible](Thread.md#Interrupt), the Size event won't be raised until the thread becomes interruptible. If the script has just resized the window, follow this example to ensure the Size event is raised immediately:

```ahk
Critical "Off"  ; Even if Critical "On" was never used.
Sleep -1
```

[Gui.Show](Gui.md#Show) automatically does a `Sleep -1`, so it is generally not necessary to call Sleep in that case.

<a id="Control_Events"></a>
## Control Events

<a id="Change"></a>
### Change

Raised when the control's value changes.

```ahk
Ctrl_Change(GuiCtrlObj, Info)
```

**Info**

Type: [Integer](../Concepts.md#numbers)

[Slider](GuiControls.md#Slider): One of the following numbers indicating how the slider was moved (note that number 5 and 8 require the [AltSubmit](Gui.md#AltSubmit) option): The number 0 for using `←` or `↑`, the number 1 for using `→` or `↓`, the number 2 for using `PgUp`, the number 3 for using `PgDn`, the number 4 for moving the slider via the mouse wheel or finishing a drag-and-drop to a new position, the number 5 for dragging the slider via the mouse (i.e. the mouse button is currently down), the number 6 for using `Home` to send the slider to the left or top side, the number 7 for using `End` to send the slider to the right or bottom side, or the number 8 for stopping the slider movement.

For all other controls, *Info* currently has no meaning.

To retrieve the control's new value, use [GuiCtrlObj.Value](GuiControl.md#Value).

Applies to: [DropDownList](GuiControls.md#DropDownList), [ComboBox](GuiControls.md#ComboBox), [ListBox](GuiControls.md#ListBox), [Edit](GuiControls.md#Edit), [DateTime](GuiControls.md#DateTime), [MonthCal](GuiControls.md#MonthCal), [Hotkey](GuiControls.md#Hotkey), [UpDown](GuiControls.md#UpDown), [Slider](GuiControls.md#Slider), [Tab](GuiControls.md#Tab).

<a id="Click"></a>
### Click

Raised when the control is clicked.

```ahk
Ctrl_Click(GuiCtrlObj, Info)
Link_Click(GuiCtrlObj, Info, Href)
```

**Info**

Type: [Integer](../Concepts.md#numbers)

[ListView](GuiControls.md#ListView): The row number of the clicked item, or 0 if the mouse was not over an item.

[TreeView](GuiControls.md#TreeView): The ID of the clicked item, or 0 if the mouse was not over an item.

[Link](GuiControls.md#Link): The link's ID attribute (a string) if it has one, otherwise the link's index (an integer).

[StatusBar](GuiControls.md#StatusBar): The part number of the clicked section (however, the part number might be a very large integer if the user clicks near the sizing grip at the right side of the bar).

For all other controls, *Info* currently has no meaning.

**Href**

Type: [String](../Concepts.md#strings)

[Link](GuiControls.md#Link): The link's HREF attribute. Note that if a Click event callback is registered, the HREF attribute is not automatically executed.

Applies to: [Text](GuiControls.md#Text), [Picture](GuiControls.md#Picture), [Button](GuiControls.md#Button), [CheckBox](GuiControls.md#CheckBox), [Radio](GuiControls.md#Radio), [ListView](ListView.md), [TreeView](TreeView.md), [Link](GuiControls.md#Link), [StatusBar](GuiControls.md#StatusBar).

<a id="DoubleClick"></a>
### DoubleClick

Raised when the control is double-clicked.

```ahk
Ctrl_DoubleClick(GuiCtrlObj, Info)
```

**Info**

Type: [Integer](../Concepts.md#numbers)

[ListView](GuiControls.md#ListView), [TreeView](GuiControls.md#TreeView) and [StatusBar](GuiControls.md#StatusBar): Same as for the [Click](#Click) event.

[ListBox](GuiControls.md#ListBox): The position number of the currently focused item. Double-clicking empty space below the last item usually focuses the last item and leaves the selection as it was.

Applies to: [Text](GuiControls.md#Text), [Picture](GuiControls.md#Picture), [Button](GuiControls.md#Button), [CheckBox](GuiControls.md#CheckBox), [Radio](GuiControls.md#Radio), [ComboBox](GuiControls.md#ComboBox), [ListBox](GuiControls.md#ListBox), [ListView](ListView.md), [TreeView](TreeView.md), [StatusBar](GuiControls.md#StatusBar).

<a id="ColClick"></a>
### ColClick

Raised when one of the ListView's column headers is clicked.

```ahk
Ctrl_ColClick(GuiCtrlObj, Info)
```

**Info**

Type: [Integer](../Concepts.md#numbers)

The one-based column number that was clicked. This is the original number assigned when the column was created; that is, it does not reflect any dragging and dropping of columns done by the user.

Applies to: [ListView](ListView.md).

<a id="Ctrl-ContextMenu"></a>
### ContextMenu

Raised when the user right-clicks the control or presses `Menu` or `Shift`+`F10` while the control has the keyboard focus.

```ahk
Ctrl_ContextMenu(GuiCtrlObj, Item, IsRightClick, X, Y)
```

For details, see [ContextMenu](#ContextMenu).

Applies to: All controls except [Edit](GuiControls.md#Edit) and [MonthCal](GuiControls.md#MonthCal) (and the Edit control within a [ComboBox](GuiControls.md#ComboBox)), which have their own standard context menu.

<a id="LoseFocus"></a>

<a id="Focus"></a>
### Focus / LoseFocus

Raised when the control gains or loses the keyboard focus.

```ahk
Ctrl_Focus(GuiCtrlObj, Info)
Ctrl_LoseFocus(GuiCtrlObj, Info)
```

**Info**

Reserved.

Applies to: [Button](GuiControls.md#Button), [CheckBox](GuiControls.md#CheckBox), [Radio](GuiControls.md#Radio), [DropDownList](GuiControls.md#DropDownList), [ComboBox](GuiControls.md#ComboBox), [ListBox](GuiControls.md#ListBox), [ListView](ListView.md), [TreeView](TreeView.md), [Edit](GuiControls.md#Edit), [DateTime](GuiControls.md#DateTime).

Not supported: [Hotkey](GuiControls.md#Hotkey), [Slider](GuiControls.md#Slider), [Tab](GuiControls.md#Tab) and [Link](GuiControls.md#Link). Note that [Text](GuiControls.md#Text), [Picture](GuiControls.md#Picture), [MonthCal](GuiControls.md#MonthCal), [UpDown](GuiControls.md#UpDown) and [StatusBar](GuiControls.md#StatusBar) controls do not accept the keyboard focus.

<a id="ItemCheck"></a>
### ItemCheck

Raised when a ListView or TreeView item is checked or unchecked.

```ahk
Ctrl_ItemCheck(GuiCtrlObj, Item, Checked)
```

Applies to: [ListView](ListView.md), [TreeView](TreeView.md).

<a id="ItemEdit"></a>
### ItemEdit

Raised when a ListView or TreeView item's label is edited by the user.

```ahk
Ctrl_ItemEdit(GuiCtrlObj, Item)
```

An item's label can only be edited if `-ReadOnly` has been used in the control's options.

Applies to: [ListView](ListView.md), [TreeView](TreeView.md).

<a id="ItemExpand"></a>
### ItemExpand

Raised when a TreeView item is expanded or collapsed.

```ahk
Ctrl_ItemExpand(GuiCtrlObj, Item, Expanded)
```

Applies to: [TreeView](TreeView.md).

<a id="ItemFocus"></a>
### ItemFocus

Raised when the focused item changes in a ListView.

```ahk
Ctrl_ItemFocus(GuiCtrlObj, Item)
```

Applies to: [ListView](ListView.md).

<a id="ItemSelect"></a>
### ItemSelect

Raised when a ListView or TreeView item is selected, or a ListView item is deselected.

```ahk
ListView_ItemSelect(GuiCtrlObj, Item, Selected)
TreeView_ItemSelect(GuiCtrlObj, Item)
```

Applies to: [ListView](ListView.md), [TreeView](TreeView.md).

ListView: This event is raised once for each item being deselected or selected, so can be raised multiple times in response to a single action by the user.

<a id="Other_Events"></a>
## Other Events

Other types of GUI events can be detected and acted upon via [OnNotify](GuiOnNotify.md), [OnCommand](GuiOnCommand.md) or [OnMessage](OnMessage.md). For example, a script can display context-sensitive help via ToolTip whenever the user moves the mouse over particular controls in the window. This is demonstrated in the [GUI ToolTip example](Gui.md#ExToolTip).

<a id="Examples"></a>
## Examples

<a id="ExClickLink"></a>

**Example:** Demonstrates the [Click](#Click) event handling for [Link](GuiControls.md#Link) controls. Each time a link is clicked, a confirmation dialog appears asking if the link should be executed. The first link opens Notepad, while the second opens the online docs in the default browser.

<a id="notepad"></a>
<a id="help"></a>

```ahk
MyGui := Gui()
LinkText := 'Click to run <a href="notepad" id="notepad">Notepad</a> or open <a id="help" href="https://www.autohotkey.com/docs/">online help</a>.'
Link := MyGui.Add("Link", "w200", LinkText)
Link.OnEvent("Click", Link_Click)
Link_Click(Ctrl, ID, HREF)
{
    MsgText := Format("
    (
        ID: {1}
        HREF: {2}

        Execute this link?
    )", ID, HREF)
    if MsgBox(MsgText,, "y/n") = "yes"
        Run(HREF)
}
MyGui.Show()
```

<a id="ExEventSink"></a>

**Example:** Demonstrates two ways to handle events using methods instead of functions. This is functionally equivalent to the [next example](#ExEventSinkThis).

```ahk
MyGui := Gui("-DPIScale",, MyGuiEvents)
MyEdit := MyGui.AddEdit("vMyEdit")
MyEdit.OnEvent("Focus", "CtrlFocused")
MyEdit.OnEvent("LoseFocus", "CtrlUnfocused")
MyGui.SetFont("s30")
MyButton := MyGui.AddButton("vMyButton", "Test Button")
MyButton.OnEvent("Focus", "CtrlFocused")
MyButton.OnEvent("LoseFocus", "CtrlUnfocused")
; If the object isn't the Gui's event sink, it can also be done as shown below.
; Bind is necessary because each method has an implicit "this" parameter.
MyButton.OnEvent("Click", MyGuiEvents.ButtonClicked.Bind(MyGuiEvents))
MyGui.Show()

class MyGuiEvents
{
    ; These are static because we use MyGuiEvents and not MyGuiEvents().
    static MessageFormat := "{1} was clicked."

    static CtrlFocused(Ctrl, *)
    {
        Ctrl.GetPos(&X, &Y, &W)
        ToolTip Ctrl.Name " has focus", X + W, Y
    }

    static CtrlUnfocused(Ctrl, *)
    {
        ToolTip
    }

    static ButtonClicked(Ctrl, *)
    {
        ToolTip
        MsgBox Format(this.MessageFormat, Ctrl.Text)
    }
}
```

<a id="ExEventSinkThis"></a>

**Example:** Demonstrates handling events within a Gui subclass. This is functionally equivalent to the [previous example](#ExEventSink).

```ahk
DemoGui().Show()  ; This creates a DemoGui instance and shows it.

class DemoGui extends Gui
{
    MessageFormat := "{1} was clicked."

    __New()
    {
        ; Pass "this" as the EventSink.
        super.__New("-DPIScale",, this)

        MyEdit := this.AddEdit("vMyEdit")
        MyEdit.OnEvent("Focus", "CtrlFocused")
        MyEdit.OnEvent("LoseFocus", "CtrlUnfocused")
        this.SetFont("s30")
        MyButton := this.AddButton("vMyButton", "Test Button")
        MyButton.OnEvent("Focus", "CtrlFocused")
        MyButton.OnEvent("LoseFocus", "CtrlUnfocused")
        MyButton.OnEvent("Click", "ButtonClicked")
    }

    CtrlFocused(Ctrl, *)
    {
        Ctrl.GetPos(&X, &Y, &W)
        ToolTip Ctrl.Name " has focus", X + W, Y
    }

    CtrlUnfocused(Ctrl, *)
    {
        ToolTip
    }

    ButtonClicked(Ctrl, *)
    {
        ToolTip
        MsgBox Format(this.MessageFormat, Ctrl.Text)
    }
}
```
