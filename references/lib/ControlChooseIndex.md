# ControlChooseIndex

Selects an entry in a list box, combo box, or drop-down list, or a tab control page, by index.

```ahk
ControlChooseIndex N, ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**N**

Type: [Integer](../Concepts.md#numbers)

The index of the entry or page to select, where 1 is the first, 2 is the second, etc.

Specify 0 to deselect all entries. For tab controls, specifying 0 is invalid and throws an exception, since non-GUI windows tend not to handle it.

**ControlID**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

The control's ClassNN, text or HWND, or an object with a Hwnd property. For details, see [Control Identifiers](../misc/ControlID.md).

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found, or if the control's class name does not contain "Combo", "List" or "Tab".

An [Error](Error.md) or [OSError](Error.md#OSError) is thrown if the change could not be applied.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to use [GuiControl.Choose](GuiControl.md#Choose).

To select all entries in a *multi-select* list box, use `PostMessage(0x0185, 1, -1, "ListBox1", WinTitle)`, where 0x0185 is [LB_SETSEL](https://learn.microsoft.com/windows/win32/controls/lb-setsel). As an alternative, call this function for each item in the array returned by [ControlGetItems](ControlGetItems.md):

```ahk
for index, text in ControlGetItems("ListBox1", WinTitle)
    ControlChooseIndex(index, "ListBox1", WinTitle)
```

Unlike [GuiControl.Choose](GuiControl.md#Choose), this function raises a [Change](GuiOnEvent.md#Change) or [DoubleClick](GuiOnEvent.md#DoubleClick) event.

To improve reliability, a delay is done automatically after each use of this function. That delay can be changed via [SetControlDelay](SetControlDelay.md) or by assigning a value to [A_ControlDelay](../Variables.md#ControlDelay). For details, see [SetControlDelay remarks](SetControlDelay.md#Remarks).

<a id="Related"></a>
## Related

[ControlGetIndex](ControlGetIndex.md), [ControlChooseString](ControlChooseString.md), [GuiControl.Choose](GuiControl.md#Choose), [Control functions](Control.md)
