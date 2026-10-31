# GuiControl Object

```ahk
class Gui.Control extends Object
```

Provides an interface for modifying GUI controls and retrieving information about them. [Gui.Add](Gui.md#Add), [Gui.__Item](Gui.md#__Item) and [GuiCtrlFromHwnd](GuiCtrlFromHwnd.md) return an object of this type.

"GuiCtrl" is used below as a placeholder for instances of the `Gui.Control` class.

`Gui.Control` serves as the base class for all GUI controls, but each type of control has its own class. Some of the following methods are defined by the prototype of the appropriate class, or the `Gui.List` base class. See [Built-in Classes](../ObjList.md) for a full list.

In addition to the methods and properties inherited from [Object](Object.md), GuiControl objects may have the following predefined methods and properties.

<a id="toc"></a>
## Table of Contents

- [Methods](#Methods):
    - [Add](#Add): Appends new items to a multi-item control.
    - [Choose](#Choose): Selects an item in a multi-item control.
    - [Delete](#Delete): Deletes one or all items from a multi-item control.
    - [Focus](#Focus): Sets keyboard focus to a control.
    - [GetPos](#GetPos): Retrieves the position and size of a control.
    - [Move](#Move): Moves and/or resizes a control.
    - [OnCommand](#OnCommand): Registers a function or method to be called on WM_COMMAND.
    - [OnEvent](#OnEvent): Registers a function or method to be called when the given event is raised.
    - [OnNotify](#OnNotify): Registers a function or method to be called on WM_NOTIFY.
    - [Opt](#Opt): Adds or removes various options and styles.
    - [Redraw](#Redraw): Redraws the region of the GUI window occupied by a control.
    - [SetFont](#SetFont): Changes a control's font typeface, size, color, and/or style.
- [Properties](#Properties):
    - [ClassNN](#ClassNN): Gets the ClassNN (class name and sequence number) of a control.
    - [Enabled](#Enabled): Gets or sets whether a control is enabled.
    - [Focused](#Focused): Gets whether a control has keyboard focus.
    - [Gui](#Gui): Gets the parent window of a control.
    - [Hwnd](#Hwnd): Gets the window handle (HWND) of a control.
    - [Name](#Name): Gets or sets the explicit name of a control.
    - [Text](#Text): Gets or sets the text/caption of a control.
    - [Type](#Type): Gets the type of a control.
    - [Value](#Value): Gets or sets the contents of a value-capable control.
    - [Visible](#Visible): Gets or sets whether a control is visible.
- General:
    - [Remarks](#Remarks)
    - [Related](#Related)
    - [Examples](#Examples)

<a id="Methods"></a>
## Methods

<a id="Add"></a>

### Add

Appends new items to a multi-item control ([ListBox](GuiControls.md#ListBox), [DropDownList](GuiControls.md#DropDownList), [ComboBox](GuiControls.md#ComboBox), or [Tab](GuiControls.md#Tab)).

```ahk
GuiCtrl.Add(Items)
```

<a id="Add_Parameters"></a>
#### Parameters

**Items**

Type: [Array](Array.md)

An array of strings to be inserted as items at the end of the control's list. For example, `["Red", "Green", "Blue"]`.

<a id="Add_Remarks"></a>
#### Remarks

To replace (overwrite) the list instead, use [GuiControl.Delete](#Delete) beforehand.

To add new items to a [ListView](ListView.md) or [TreeView](TreeView.md) control, use [LV.Add](ListView.md#Add) or [TV.Add](TreeView.md#Add).

See [example #1](#ExReplaceList) for a demonstration.

<a id="Choose"></a>

### Choose

Selects an item in a multi-item control ([ListBox](GuiControls.md#ListBox), [DropDownList](GuiControls.md#DropDownList), [ComboBox](GuiControls.md#ComboBox), or [Tab](GuiControls.md#Tab)).

```ahk
GuiCtrl.Choose(Item)
```

<a id="Choose_Parameters"></a>
#### Parameters

**Item**

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

Specify 1 for the first item, 2 for the second, and so on. Specify 0 to deselect all items.

If a string is specified (even a numeric string), the item whose name starts with the string will be selected. The search is not case-sensitive. For example, if a multi-item control contains the item "UNIX Text", specifying the word unix (lowercase) would be enough to select it. For a [multi-select ListBox](GuiControls.md#ListBoxMulti), all matching items are selected.

<a id="Choose_Remarks"></a>
#### Remarks

To select all items in a [multi-select ListBox](GuiControls.md#ListBoxMulti), use `PostMessage(0x0185, 1, -1, GuiCtrl)`, where 0x0185 is [LB_SETSEL](https://learn.microsoft.com/windows/win32/controls/lb-setsel). As an alternative, call this method for each item in the array returned by [ControlGetItems](ControlGetItems.md):

```ahk
for index, text in ControlGetItems(GuiCtrl)
    GuiCtrl.Choose(index)
```

Unlike [ControlChooseIndex](ControlChooseIndex.md), this method does not raise a [Change](GuiOnEvent.md#Change) or [DoubleClick](GuiOnEvent.md#DoubleClick) event.

To select an item in a [ListView](ListView.md) or [TreeView](TreeView.md) control, use [LV.Modify](ListView.md#Modify) or [TV.Modify](TreeView.md#Modify) with the Select option.

<a id="Delete"></a>

### Delete

Deletes one or all items from a multi-item control ([ListBox](GuiControls.md#ListBox), [DropDownList](GuiControls.md#DropDownList), [ComboBox](GuiControls.md#ComboBox), or [Tab](GuiControls.md#Tab)).

```ahk
GuiCtrl.Delete(Item)
```

<a id="Delete_Parameters"></a>
#### Parameters

**Item**

Type: [Integer](../Concepts.md#numbers)

If omitted, all items will be deleted. Otherwise, specify 1 for the first item, 2 for the second, etc.

<a id="Delete_Remarks"></a>
#### Remarks

For [Tab](GuiControls.md#Tab) controls, a tab's sub-controls stay associated with their original tab number; that is, they are never associated with their tab's actual display-name. For this reason, renaming or removing a tab will not change the tab number to which the sub-controls belong. For example, if there are three tabs `["Red", "Green", "Blue"]` and the second tab is removed by means of `GuiCtrl.Delete(2)`, the sub-controls originally associated with Green will now be associated with Blue. Because of this behavior, only tabs at the end should generally be removed. Tabs that are removed in this way can be added back later, at which time they will reclaim their original set of controls.

To delete an item in a [ListView](ListView.md) or [TreeView](TreeView.md) control, use [LV.Delete](ListView.md#Delete) or [TV.Delete](TreeView.md#Delete).

See [example #1](#ExReplaceList) for a demonstration.

<a id="Focus"></a>

### Focus

Sets keyboard focus to a control.

```ahk
GuiCtrl.Focus()
```

To be effective, the window generally must not be minimized or hidden.

To get the currently focused control in a GUI window, use [Gui.FocusedCtrl](Gui.md#FocusedCtrl).

To get whether a control has keyboard focus, use [GuiControl.Focused](#Focused).

See [example #6](#ExFocus) for a demonstration.

<a id="GetPos"></a>

### GetPos

Retrieves the position and size of a control.

```ahk
GuiCtrl.GetPos(&X, &Y, &Width, &Height)
```

<a id="GetPos_Parameters"></a>
#### Parameters

**&X, &Y**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify references to the output variables in which to store the X and Y coordinates (in pixels) of the control's upper left corner. These coordinates are relative to the upper-left corner of the window's client area, which is the area not including title bar, menu bar, and borders.

**&Width, &Height**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify references to the output variables in which to store the control's width and height (in pixels).

<a id="GetPos_Remarks"></a>
#### Remarks

Unlike [ControlGetPos](ControlGetPos.md), this method applies [DPI scaling](Gui.md#DPIScale) to the returned coordinates (unless the `-DPIScale` option was used).

See [example #5](#ExMoveResize) or [example #10](#ExGetPos) for a demonstration.

<a id="Move"></a>

### Move

Moves and/or resizes a control.

```ahk
GuiCtrl.Move(X, Y, Width, Height)
```

<a id="Move_Parameters"></a>
#### Parameters

**X, Y**

Type: [Integer](../Concepts.md#numbers)

If either is omitted, the control's position in that dimension will not be changed. Otherwise, specify the X and Y coordinates (in pixels) of the upper left corner of the control's new location. The coordinates are relative to the upper-left corner of the window's client area, which is the area not including title bar, menu bar, and borders.

**Width, Height**

Type: [Integer](../Concepts.md#numbers)

If either is omitted, the control's size in that dimension will not be changed. Otherwise, specify the new width and height of the control (in pixels).

<a id="Move_Remarks"></a>
#### Remarks

Unlike [ControlMove](ControlMove.md), this method applies [DPI scaling](Gui.md#DPIScale) to the coordinates (unless the `-DPIScale` option was used).

See [example #4](#ExMove) or [example #5](#ExMoveResize) for a demonstration.

<a id="OnCommand"></a>

### OnCommand

Registers a function or method to be called when a control notification is received via the [WM_COMMAND](GuiOnCommand.md#WM_COMMAND) message.

```ahk
GuiCtrl.OnCommand(NotifyCode, Callback , AddRemove)
```

See [OnCommand](GuiOnCommand.md) for details.

<a id="OnEvent"></a>

### OnEvent

Registers a function or method to be called when the given [event](GuiOnEvent.md#Control_Events) is raised.

```ahk
GuiCtrl.OnEvent(EventName, Callback , AddRemove)
```

See [OnEvent](GuiOnEvent.md) for details.

<a id="OnNotify"></a>

### OnNotify

Registers a function or method to be called when a control notification is received via the [WM_NOTIFY](GuiOnNotify.md#WM_NOTIFY) message.

```ahk
GuiCtrl.OnNotify(NotifyCode, Callback , AddRemove)
```

See [OnNotify](GuiOnNotify.md) for details.

<a id="Opt"></a>

### Opt

Adds or removes various options and styles.

```ahk
GuiCtrl.Opt(Options)
```

<a id="Opt_Parameters"></a>
#### Parameters

**Options**

Type: [String](../Concepts.md#strings)

Specify one or more [control-specific](GuiControls.md) or [general](Gui.md#Add_Options) options and styles, each separated from the next with one or more spaces or tabs.

For example, `"+Disabled -Background"` would both [disable](Gui.md#Disabled) a control and restore its [background](Gui.md#Background) to the system default, while `"+Default"` would make a [button](GuiControls.md#Button) the new default button.

<a id="Opt_Remarks"></a>
#### Remarks

All valid options and styles are usually recognized. However, this does not mean that all of them are applied or removed after a control has been created. Some [styles](../misc/Styles.md) cannot be changed retroactively. For [positioning and sizing options](Gui.md#PosSize), use [GuiControl.Move](#Move) instead, optionally with [GuiControl.GetPos](GuiControl.md#GetPos) for relative adjustments.

If a change could not be applied, an exception is thrown. Even if a change is successfully applied, the control might choose to ignore it.

<a id="redraw-remarks"></a>

<a id="Redraw"></a>

### Redraw

Redraws the region of the GUI window occupied by a control.

```ahk
GuiCtrl.Redraw()
```

Although this may cause an unwanted flickering effect when called repeatedly and rapidly, it solves display artifacts for certain control types such as [GroupBoxes](GuiControls.md#GroupBox).

When adding a large number of items to a control (such as a [ListView](ListView.md), [TreeView](TreeView.md) or [ListBox](GuiControls.md#ListBox)), performance can be improved by preventing the control from being redrawn while the changes are being made. This is done by using `GuiCtrl.Opt("-Redraw")` before adding the items and `GuiCtrl.Opt("+Redraw")` afterward. Changes to the control which have not yet become visible prior to disabling redraw will generally not become visible until after redraw is re-enabled.

For performance reasons, changes to a control's content generally do not cause the control to be immediately redrawn even if redraw is enabled. Instead, a portion of the control is "invalidated" and is usually repainted after a brief delay, when the program checks its internal message queue. The script can force this to take place immediately by calling `Sleep -1`.

<a id="SetFont"></a>

### SetFont

Changes a control's font typeface, size, color, and/or style.

```ahk
GuiCtrl.SetFont(Options, FontName)
```

Omit both parameters to set the font to the GUI's current font, as set by [Gui.SetFont](Gui.md#SetFont). Otherwise, any font attributes which are not specified will be copied from the control's previous font. Text color is changed only if specified in *Options*.

For details about both parameters, see [Gui.SetFont](Gui.md#SetFont).

See [example #7](#ExFont) for a demonstration.

<a id="Properties"></a>
## Properties

<a id="ClassNN"></a>

### ClassNN

Gets the [ClassNN](../misc/ControlID.md#ClassNN) (class name and sequence number) of a control.

```ahk
ClassNN := GuiCtrl.ClassNN
```

<a id="Enabled"></a>

### Enabled

Gets or sets whether a control is enabled.

```ahk
IsEnabled := GuiCtrl.Enabled
```

```ahk
GuiCtrl.Enabled := NewState
```

*IsEnabled* is 1 if the control is enabled, or 0 if disabled. The [Disabled option](Gui.md#Disabled) affects the initial setting.

*NewState* should be a [boolean value](../Concepts.md#boolean). If true, the control is enabled. If false, the control is disabled.

For [Tab](GuiControls.md#Tab) controls, this will also enable or disable all of the tab's sub-controls. However, any sub-control explicitly disabled via `GuiCtrl.Enabled := false` will remember that setting and thus remain disabled even after its Tab control is re-enabled.

<a id="Focused"></a>

### Focused

Gets whether a control has keyboard focus.

```ahk
IsFocused := GuiCtrl.Focused
```

*IsFocused* is 1 if the control has keyboard focus, or 0 if not.

To be effective, the window generally must not be minimized or hidden.

To get the currently focused control in a GUI window, use [Gui.FocusedCtrl](Gui.md#FocusedCtrl).

To focus a control, use [GuiControl.Focus](#Focus).

<a id="Gui"></a>

### Gui

Gets the parent window of a control.

```ahk
GuiObj := GuiCtrl.Gui
```

*GuiObj* is the [Gui object](Gui.md) of the parent window.

<a id="Hwnd"></a>

### Hwnd

Gets the [window handle (HWND)](../misc/ControlID.md#HWND) of a control.

```ahk
HWND := GuiCtrl.Hwnd
```

<a id="Name"></a>

### Name

Gets or sets the explicit name of a control.

```ahk
CurrentName := GuiCtrl.Name
```

```ahk
GuiCtrl.Name := NewName
```

*CurrentName* is the control's current name, or an empty string if it has no name. The [V option](Gui.md#var) affects the initial setting.

*NewName* is the control's new name.

This name can be used with [Gui.__Item](Gui.md#__Item) to retrieve the corresponding GuiControl object. For most input-capable controls, the name is also used by [Gui.Submit](Gui.md#Submit).

<a id="Text"></a>

### Text

Gets or sets the text/caption of a control.

```ahk
CurrentText := GuiCtrl.Text
```

```ahk
GuiCtrl.Text := NewText
```

*CurrentText* and *NewText* depend on the current control. If the control has no visible caption text and no (single) text value, such as [MonthCal](GuiControls.md#MonthCal), this property corresponds to the control's hidden caption text (similar to [ControlGetText](ControlGetText.md) and [ControlSetText](ControlSetText.md)). See [example #9](#ExCheckBox) for a demonstration.

<a id="Text_Control_Group_1"></a>
#### [Button](GuiControls.md#Button) / [CheckBox](GuiControls.md#CheckBox) / [GroupBox](GuiControls.md#GroupBox) / [Link](GuiControls.md#Link) / [Radio](GuiControls.md#Radio) / [Text](GuiControls.md#Text)

*CurrentText* and *NewText* are the current and new caption/display text, respectively. Since the control will not expand automatically, use [GuiControl.Move](#Move) if the control needs to be widened.

<a id="Text_Control_Group_2"></a>
#### [DateTime](GuiControls.md#DateTime)

*CurrentText* is the current formatted text displayed by the control. *NewText* is invalid and throws an exception. To change the date/time being displayed, use [GuiControl.Value](#Value) to set a date-time stamp in [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format.

<a id="Text_Control_Group_3"></a>
#### [ComboBox](GuiControls.md#ComboBox) / [DropDownList](GuiControls.md#DropDownList) / [ListBox](GuiControls.md#ListBox) / [Tab](GuiControls.md#Tab)

*CurrentText* is the text of the currently selected item or tab, or blank if none is selected. For a ComboBox, if no item is selected, it is the text in the edit field. For a [multi-select ListBox](GuiControls.md#ListBoxMulti), it is an [array](Array.md) containing the text of each selected item, or blank if none is selected.

*NewText* is the full text (case-insensitive) of the item or tab to select, or blank to clear the current selection. For a [multi-select ListBox](GuiControls.md#ListBoxMulti), all items that fully match the text are selected. To select multiple items with different text, call [GuiControl.Choose](#Choose) repeatedly. [GuiControl.Value](#Value) selects an item or tab by index.

<a id="Text_Control_Group_4"></a>
#### [Edit](GuiControls.md#Edit)

*CurrentText* and *NewText* are the current and new text, respectively. As with other controls, the text is retrieved or set as-is; no end-of-line translation is performed. To get or set the text of a multi-line Edit control while also translating between CR+LF (\`r\`n) and LF (\`n), use [GuiControl.Value](#Value).

<a id="Text_Control_Group_5"></a>
#### [StatusBar](GuiControls.md#StatusBar)

*CurrentText* and *NewText* are the current and new text of the first part, respectively. Use [StatusBar.SetText](GuiControls.md#SB_SetText) for greater flexibility.

<a id="Type"></a>

### Type

Gets the type of a control.

```ahk
CurrentType := GuiCtrl.Type
```

*CurrentType* is one of the following strings, depending on the [control type](GuiControls.md): ActiveX, Button, CheckBox, ComboBox, Custom, DateTime, DDL, Edit, GroupBox, Hotkey, Link, ListBox, ListView, MonthCal, Pic, Progress, Radio, Slider, StatusBar, Tab, Tab2, Tab3, Text, TreeView, UpDown.

<a id="Value"></a>

### Value

Gets or sets the contents of a value-capable control.

```ahk
CurrentValue := GuiCtrl.Value
```

```ahk
GuiCtrl.Value := NewValue
```

*CurrentValue* and *NewValue* depend on the current control. If the control is not value-capable, *CurrentValue* will be blank and assigning *NewValue* will raise an error. Invalid values throw an exception. See [example #2](#ExNewText), [example #3](#ExRadio), [example #8](#ExEdit), or [example #9](#ExCheckBox) for a demonstration.

<a id="Value_Control_Group_1"></a>
#### [ActiveX](GuiControls.md#ActiveX)

*CurrentValue* is the ActiveX object. For example, if the control was created with the component name `"Shell.Explorer"`, this is a [WebBrowser](https://learn.microsoft.com/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa752043(v=vs.85)) object. The same [wrapper object](ComValue.md) is returned each time. *NewValue* is invalid and throws an exception.

<a id="Value_Control_Group_2"></a>
#### [CheckBox](GuiControls.md#CheckBox) / [Radio](GuiControls.md#Radio)

*CurrentValue* and *NewValue* are the current and new setting, respectively: 1 for checked, 0 for unchecked, or -1 for indeterminate. For radio buttons, if one is being checked (turned on) and it is a member of a multi-radio group, the other radio buttons in its group will be automatically unchecked. To get or set the control's text/caption instead, use [GuiControl.Text](#Text).

<a id="Value_Control_Group_3"></a>
#### [ComboBox](GuiControls.md#ComboBox) / [DropDownList](GuiControls.md#DropDownList) / [ListBox](GuiControls.md#ListBox) / [Tab](GuiControls.md#Tab)

*CurrentValue* is the index of the currently selected item or tab, or 0 if none is selected. For a ComboBox, if text is entered, it is the index of the first item that fully matches the text (case-insensitive), or 0 if there is no match. For a [multi-select ListBox](GuiControls.md#ListBoxMulti), it is an [array](Array.md) containing the index of each selected item, or an empty array if none is selected.

*NewValue* is the index of an item or tab to select, or 0 to clear the current selection (this is valid even for Tab controls). For a [multi-select ListBox](GuiControls.md#ListBoxMulti), to select multiple items, call [GuiControl.Choose](#Choose) repeatedly. [GuiControl.Text](#Text) selects an item or tab by text.

<a id="Value_Control_Group_4"></a>
#### [DateTime](GuiControls.md#DateTime) / [MonthCal](GuiControls.md#MonthCal)

*CurrentValue* and *NewValue* are date-time stamps in [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format representing the date/time currently selected and to be selected in the control, respectively. Specify [A_Now](../Variables.md#Now) for *NewValue* to use the current date and time (today). For DateTime controls, *NewValue* can be blank to cause the control to have no date/time selected (if it was created with [that ability](GuiControls.md#ChooseNone)). For MonthCal controls, a range may be specified if the control is [multi-select](GuiControls.md#MonthCalMulti).

<a id="Value_Control_Group_5"></a>
#### [Edit](GuiControls.md#Edit)

*CurrentValue* is the current content. For multi-line controls, any line breaks will be represented as plain linefeeds (\`n) rather than the traditional CR+LF (\`r\`n) used by non-GUI functions such as [ControlGetText](ControlGetText.md) and [ControlSetText](ControlSetText.md).

*NewValue* is the new content. For multi-line controls, any linefeeds (\`n) that lack a preceding carriage return (\`r) are automatically translated to CR+LF (\`r\`n) to make them display properly. However, this is usually not a concern because when using [Gui.Submit](Gui.md#Submit) or when retrieving this value this translation will be reversed automatically by replacing CR+LF (\`r\`n) with LF (\`n).

To get or set the text without translating LF (\`n) to or from CR+LF (\`r\`n), use [GuiControl.Text](#Text).

<a id="Value_Control_Group_6"></a>
#### [Hotkey](GuiControls.md#Hotkey)

*CurrentValue* and *NewValue* are strings composed of modifiers and a key name, representing the hotkey currently displayed and to be displayed in the control, respectively. For example, `^!c`, `^Numpad1`, or `+Home`. *CurrentValue* is blank if there is no hotkey in the control. *NewValue* can be blank to clear the control. The only modifiers supported are ^ (Control), ! (Alt), and + (Shift). See the [key list](../KeyList.md) for available key names.

<a id="Value_Control_Group_7"></a>
#### [Picture](GuiControls.md#Picture)

*CurrentValue* is the picture's file name as it was originally specified when the control was created. This name does not change even if a new picture file name is specified.

*NewValue* is the filename or a [handle](../misc/ImageHandles.md) of the new image to load (see [Picture](GuiControls.md#Picture) for supported file types). Zero or more of the following options may be specified immediately in front of the filename: `*wN` (width N), `*hN` (height N), and `*IconN` (icon group number N in a DLL or EXE file). For example, `"*icon2 *w100 *h-1 C:\My Application.exe"` loads the default icon from the second icon group with a width of 100 and an automatic height via "keep aspect ratio". Specify `*w0 *h0` to use the image's actual width and height. If `*w` and `*h` are omitted, the image will be scaled to fit the current size of the control. When loading from a multi-icon .ICO file, specifying a width and height also determines which icon to load. Note: Use only one space or tab between the final option and the filename itself; any other spaces and tabs are treated as part of the filename.

<a id="Value_Control_Group_8"></a>
#### [Progress](GuiControls.md#Progress) / [Slider](GuiControls.md#Slider) / [UpDown](GuiControls.md#UpDown)

*CurrentValue* and *NewValue* are the current and new position of the control, respectively. If the new position would be outside the range of the control, the control is generally set to the nearest valid value.

<a id="Value_Control_Group_9"></a>
#### [Text](GuiControls.md#Text)

*CurrentValue* and *NewValue* are the current and new text/caption, respectively. Since the control will not expand automatically, use [GuiControl.Move](#Move) if the control needs to be widened.

<a id="Visible"></a>

### Visible

Gets or sets whether a control is visible.

```ahk
IsVisible := GuiCtrl.Visible
```

```ahk
GuiCtrl.Visible := NewState
```

*IsVisible* is 1 if the control is visible, or 0 if hidden. The [Hidden option](Gui.md#Hidden) affects the initial setting.

*NewState* should be a [boolean value](../Concepts.md#boolean). If true, the control is visible. If false, the control is hidden.

For [Tab](GuiControls.md#Tab) controls, this will also show or hide all of the tab's sub-controls.

If you additionally want to prevent a control's shortcut key (underlined letter) from working, disable the control via `GuiCtrl.Enabled := false`.

<a id="Remarks"></a>
## Remarks

Each method and property listed here can only be used with controls in a GUI window, i.e. a window that was created with the [Gui](Gui.md#Call) function. For non-GUI controls, use the [Control functions](Control.md) instead.

<a id="Related"></a>
## Related

[GUI control types](GuiControls.md), [Gui object](Gui.md), [GuiCtrlFromHwnd](GuiCtrlFromHwnd.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExReplaceList"></a>

**Example:** Replaces a [ListBox](GuiControls.md#ListBox) control's current list with a new one using [GuiControl.Delete](#Delete) and [GuiControl.Add](#Add).

```ahk
MyGui := Gui()
MyListBox := MyGui.Add("ListBox",, ["Black", "White"])
MyGui.Show()
Sleep 1000 ; Wait for demonstration purposes.
MyListBox.Delete()
MyListBox.Add(["Red", "Green", "Blue"])
```

<a id="ExNewText"></a>

**Example:** Puts new text into an [Edit](GuiControls.md#Edit) control using [GuiControl.Value](#Value).

```ahk
MyGui := Gui()
MyEdit := MyGui.Add("Edit", "r2 w100", "Old text line.")
MyGui.Show()
Sleep 1000 ; Wait for demonstration purposes.
MyEdit.Value := "New text line 1.`nNew text line 2."
```

<a id="ExRadio"></a>

**Example:** Checks (turns on) a [Radio](GuiControls.md#Radio) control and unchecks all the others in its group using [GuiControl.Value](#Value).

```ahk
MyGui := Gui()
MyRadio1 := MyGui.Add("Radio", "Checked", "Radio button 1")
MyRadio2 := MyGui.Add("Radio",, "Radio button 2")
MyRadio3 := MyGui.Add("Radio",, "Radio button 3")
MyGui.Show()
Sleep 1000 ; Wait for demonstration purposes.
MyRadio2.Value := 1
```

<a id="ExMove"></a>

**Example:** Moves a [Button](GuiControls.md#Button) control to a new position using [GuiControl.Move](#Move).

```ahk
MyGui := Gui()
MyButton := MyGui.Add("Button",, "OK")
MyGui.Show("w300 h300")
Sleep 1000 ; Wait for demonstration purposes.
MyButton.Move(100, 200)
```

<a id="ExMoveResize"></a>

**Example:** Moves and resizes an [Edit](GuiControls.md#Edit) control relative to its current position and size using [GuiControl.GetPos](#GetPos) and [GuiControl.Move](#Move).

```ahk
MyGui := Gui()
MyEdit := MyGui.Add("Edit")
MyGui.Show("w300 h300")
Sleep 1000 ; Wait for demonstration purposes.
MyEdit.GetPos(&X, &Y, &W, &H)
MyEdit.Move(X+10, Y+5, W*2, H*1.5)
```

<a id="ExFocus"></a>

**Example:** Sets keyboard focus to an [Edit](GuiControls.md#Edit) control using [GuiControl.Focus](#Focus).

```ahk
MyGui := Gui()
MyGui.Add("Text", "Section", "First name:")
MyGui.Add("Text",, "Last name:")
EditFirstName := MyGui.Add("Edit", "ys")
EditLastName := MyGui.Add("Edit")
MyGui.Show()
Sleep 1000 ; Wait for demonstration purposes.
EditLastName.Focus()
```

<a id="ExFont"></a>

**Example:** Changes the font and text color of a [Text](GuiControls.md#Text) control using [GuiControl.SetFont](#SetFont).

```ahk
MyGui := Gui()
MyGui.SetFont("s14")
MyGui.Add("Text",, "This is a test.")
MyText := MyGui.Add("Text",, "This is a test.")
MyGui.Add("Text",, "This is a test.")
MyGui.Show()
Sleep 1000 ; Wait for demonstration purposes.
MyText.SetFont("cRed", "Times New Roman")
```

<a id="ExEdit"></a>

**Example:** Retrieves the text of an [Edit](GuiControls.md#Edit) control by using [GuiControl.Value](#Value).

```ahk
MyGui := Gui()
MyEdit := MyGui.Add("Edit",, "This is a test.")
MyGui.Show()
MsgBox MyEdit.Value
```

<a id="ExCheckBox"></a>

**Example:** Reports the caption and current state of a [CheckBox](GuiControls.md#CheckBox) control when clicked.

```ahk
MyGui := Gui()
MyCheckBox1 := MyGui.Add("CheckBox",, "CheckBox 1")
MyCheckBox2 := MyGui.Add("CheckBox",, "CheckBox 2")
MyCheckBox1.OnEvent("Click", ReportState)
MyCheckBox2.OnEvent("Click", ReportState)
MyGui.Show()

ReportState(MyCheckBox, *)
{
    Caption := MyCheckBox.Text
    State := MyCheckBox.Value
    MsgBox Caption " is " (State = 0 ? "unchecked" : "checked")
}
```

<a id="ExGetPos"></a>

**Example:** Retrieves the position and size of a [Picture](GuiControls.md#Picture) control by using [GuiControl.GetPos](#GetPos) and stores the values in the X, Y, W, and H variables.

```ahk
MyGui := Gui()
MyPicture := MyGui.Add("Picture",, A_AhkPath)
MyGui.Show()
MyPicture.GetPos(&X, &Y, &W, &H)
MsgBox "x" X ", y" Y ", w" W ", h" H
```
