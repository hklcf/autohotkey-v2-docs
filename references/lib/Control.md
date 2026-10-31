# Control Functions

Functions for retrieving information about a control or for performing various operations on a control. Click on a function name for details.

| Function | Description |
| --- | --- |
| [ControlAddItem](ControlAddItem.md) | Adds a new entry at the bottom of a list box, combo box, or drop-down list. |
| [ControlChooseIndex](ControlChooseIndex.md) | Selects an entry in a list box, combo box, or drop-down list, or a tab control page, by index. |
| [ControlChooseString](ControlChooseString.md) | Selects an entry in a list box, combo box, or drop-down list, or a tab control page, by string. |
| [ControlClick](ControlClick.md) | Sends a mouse button or mouse wheel event to a window or control. |
| [ControlDeleteItem](ControlDeleteItem.md) | Deletes an entry from a list box, combo box, or drop-down list by index. |
| [ControlFindItem](ControlFindItem.md) | Searches for an entry in a list box, combo box, or drop-down list by string, and returns its index. |
| [ControlFocus](ControlFocus.md) | Sets keyboard focus to a control. |
| [ControlGetChecked](ControlGetChecked.md) | Returns 1 if a check box or radio button is checked, or 0 if unchecked. |
| [ControlGetChoice](ControlGetChoice.md) | Returns the text of the currently selected entry in a list box, combo box, or drop-down list. |
| [ControlGetClassNN](ControlGetClassNN.md) | Returns the ClassNN (class name and sequence number) of a control. |
| [ControlGetEnabled](ControlGetEnabled.md) | Returns 1 if a control is enabled, or 0 if disabled. |
| [ControlGetFocus](ControlGetFocus.md) | Retrieves which control of the target window has keyboard focus, if any. |
| [ControlGetHwnd](ControlGetHwnd.md) | Returns the window handle (HWND) of a control. |
| [ControlGetIndex](ControlGetIndex.md) | Returns the index of the currently selected entry in a list box, combo box, or drop-down list, or the index of the active page in a tab control. |
| [ControlGetItems](ControlGetItems.md) | Returns an array of entries from a list box, combo box, or drop-down list. |
| [ControlGetPos](ControlGetPos.md) | Retrieves the position and size of a control. |
| [ControlGetStyle<br>ControlGetExStyle](ControlGetStyle.md) | Returns an integer representing the style or extended style of a control. |
| [ControlGetText](ControlGetText.md) | Retrieves text from a control. |
| [ControlGetVisible](ControlGetVisible.md) | Returns 1 if a control is visible, or 0 if hidden. |
| [ControlHide](ControlHide.md) | Hides a control. |
| [ControlHideDropDown](ControlHideDropDown.md) | Hides the popup list of a combo box or drop-down list. |
| [ControlMove](ControlMove.md) | Moves and/or resizes a control. |
| [ControlSend<br>ControlSendText](ControlSend.md) | Sends simulated keystrokes or text to a window or control. |
| [ControlSetChecked](ControlSetChecked.md) | Checks or unchecks a check box or radio button. |
| [ControlSetEnabled](ControlSetEnabled.md) | Enables or disables a control. |
| [ControlSetStyle<br>ControlSetExStyle](ControlSetStyle.md) | Changes the style or extended style of a control. |
| [ControlSetText](ControlSetText.md) | Changes the text of a control. |
| [ControlShow](ControlShow.md) | Shows a control if it was previously hidden. |
| [ControlShowDropDown](ControlShowDropDown.md) | Shows the popup list of a combo box or drop-down list. |
| [EditGetCurrentCol](EditGetCurrentCol.md) | Returns the column number in an edit control where the caret resides. |
| [EditGetCurrentLine](EditGetCurrentLine.md) | Returns the line number in an edit control where the caret resides. |
| [EditGetLine](EditGetLine.md) | Returns the text of a line in an edit control by line number. |
| [EditGetLineCount](EditGetLineCount.md) | Returns the number of lines in an edit control. |
| [EditGetSelectedText](EditGetSelectedText.md) | Returns the selected text in an edit control. |
| [EditPaste](EditPaste.md) | Pastes a string at the caret in an edit control. |
| [ListViewGetContent](ListViewGetContent.md) | Returns content data from a list-view control, such as rows, columns, or count values. |

<a id="Error_Handling"></a>
## Error Handling

Typically one of the following errors may be thrown:

- [TargetError](Error.md#TargetError): The target window or control could not be found.
- [Error](Error.md) or [OSError](Error.md#OSError): There was a problem carring out the function's purpose, such as retrieving a setting or applying a change.
- [ValueError](Error.md#ValueError) or [TypeError](Error.md#TypeError): Invalid parameters were detected.

<a id="Remarks"></a>
## Remarks

Most of the functions listed here are intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. They work best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the functions might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to use their [GuiControl](GuiControl.md) object, assuming a suitable counterpart exists.

<a id="Parameter"></a>

Functions which operate on individual controls have a parameter named *ControlID* which supports a few different ways to identify the control. See [Control Identifiers](../misc/ControlID.md) for details.

To improve reliability, a delay is done automatically after each use of a Control function that changes a control (except for [ControlSetStyle](ControlSetStyle.md) and [ControlSetExStyle](ControlSetStyle.md)). That delay can be changed via [SetControlDelay](SetControlDelay.md) or by assigning a value to [A_ControlDelay](../Variables.md#ControlDelay). For details, see [SetControlDelay remarks](SetControlDelay.md#Remarks).

To discover the [ClassNN](../misc/ControlID.md#ClassNN) or [HWND](../misc/ControlID.md#HWND) of the control that the mouse is currently hovering over, use [MouseGetPos](MouseGetPos.md).

To retrieve an array of all controls in a window, use [WinGetControls](WinGetControls.md) or [WinGetControlsHwnd](WinGetControlsHwnd.md).

<a id="Related"></a>
## Related

[SetControlDelay](SetControlDelay.md), [Win functions](Win.md), [GuiControl object](GuiControl.md) (for controls created by the script)
