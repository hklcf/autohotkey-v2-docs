# ControlChooseString

Selects an entry in a list box, combo box, or drop-down list, or a tab control page, by string.

```ahk
Index := ControlChooseString(String, ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**String**

Type: [String](../Concepts.md#strings)

The full text or just the leading part of the text of the entry or page to select. If the text matches multiple entries or pages, the first one is selected.

The search is not case-sensitive. For example, if a list box contains the entry "UNIX Text", specifying the word unix (lowercase) would be enough to select it.

**ControlID**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

The control's ClassNN, text or HWND, or an object with a Hwnd property. For details, see [Control Identifiers](../misc/ControlID.md).

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the index of the selected entry or page, where 1 is the first, 2 is the second, etc.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found, or if the control's class name does not contain "Combo" or "List".

An [Error](Error.md) or [OSError](Error.md#OSError) is thrown if the change could not be applied.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI controls](GuiControls.md), it is usually more convenient to use [GuiControl.Choose](GuiControl.md#Choose).

Unlike [GuiControl.Choose](GuiControl.md#Choose), this function raises a [Change](GuiOnEvent.md#Change) or [DoubleClick](GuiOnEvent.md#DoubleClick) event.

To improve reliability, a delay is done automatically after each use of this function. That delay can be changed via [SetControlDelay](SetControlDelay.md) or by assigning a value to [A_ControlDelay](../Variables.md#ControlDelay). For details, see [SetControlDelay remarks](SetControlDelay.md#Remarks).

<a id="Related"></a>
## Related

[ControlGetChoice](ControlGetChoice.md), [ControlChooseIndex](ControlChooseIndex.md), [GuiControl.Choose](GuiControl.md#Choose), [Control functions](Control.md)
