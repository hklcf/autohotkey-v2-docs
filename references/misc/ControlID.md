# ControlID Parameter (Window Control Identifiers)

Some functions have a *ControlID* parameter used to identify which control in a window to operate on. This parameter can be the text of the control or any other identifier described on this page.

<a id="toc"></a>
## Table of Contents

- [Control Identifiers](#Control_Identifiers)
    - [HWND](#HWND)
    - [ClassNN](#ClassNN)
    - [Text](#Text)
    - [Omitted](#Omitted)
- [Remarks](#Remarks)
- [Related](#Related)

<a id="Control_Identifiers"></a>
## Control Identifiers

The following identifiers are ordered by descending precedence. This detail is important in rare cases of ambiguity. For example, if a window has two edit controls, the first with the text "Edit2" and the second with ClassNN "Edit2", and `ControlHide "Edit2"` is used, the second control will be hidden, because ClassNN has higher precedence.

<a id="HWND"></a>
### HWND

Type: [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

A control's HWND (short for handle to window) uniquely identifies that control for as long as it exists. Pass the HWND directly, or as an object with a Hwnd property such as a [GuiControl](../lib/GuiControl.md) object. This also works on hidden controls even when [DetectHiddenWindows](../lib/DetectHiddenWindows.md) is turned off. Any subsequent window parameters are ignored. When passing an object, a [PropertyError](../lib/Error.md#PropertyError) is thrown if the object has no Hwnd property, or [TypeError](../lib/Error.md#TypeError) if it does not return a pure integer.

A control's HWND can be retrieved via [ControlGetHwnd](../lib/ControlGetHwnd.md), [GuiControl.Hwnd](../lib/GuiControl.md#Hwnd), [WinGetControlsHwnd](../lib/WinGetControlsHwnd.md), [MouseGetPos](../lib/MouseGetPos.md), and [DllCall](../lib/DllCall.md).

A HWND is especially useful when sending messages directly to a control via [PostMessage](../lib/PostMessage.md), [SendMessage](../lib/SendMessage.md), or when calling native APIs with [DllCall](../lib/DllCall.md). It is also helpful when controls are dynamically created or reordered, since the HWND remains constant for the lifetime of the control.

<a id="ClassNN"></a>
### ClassNN

Type: [String](../Concepts.md#strings)

A control's ClassNN is the name of its window class followed by its sequence number within the top-level window which contains it. The sequence number reflects the control's position among controls of the same class, in the order they were created. For example, `Edit1` is the first edit control in a window and `Button12` is the twelfth button.

Some class names include digits which are not part of the control's sequence number. For example, `SysListView321` is the window's first ListView control, not its 321st. To retrieve the class name without the sequence number, pass the control's HWND to [WinGetClass](../lib/WinGetClass.md).

A control's ClassNN can be determined via [Window Spy](../Program.md#Window_Spy), and retrieved via [ControlGetClassNN](../lib/ControlGetClassNN.md), [WinGetControls](../lib/WinGetControls.md), and [MouseGetPos](../lib/MouseGetPos.md).

The sequence number is not a persistent identifier. It may change if the application recreates controls, changes their order, or uses dynamic or virtualized UI elements. Some modern frameworks (such as WPF or Electron) may not expose traditional Win32 class names at all, or may reuse generic class names for multiple unrelated controls.

ClassNN is often convenient when controls do not have unique text and when the control order is stable. When stability cannot be guaranteed, consider using a HWND or another identifier.

<a id="Text"></a>
### Text

Type: [String](../Concepts.md#strings)

The text of a control may be used as a identifier, e.g. `OK` for an OK button. The matching behavior is determined by [SetTitleMatchMode](../lib/SetTitleMatchMode.md). Use text when it is unique and stable; many controls update it dynamically or do not expose meaningful text.

A control's text can be determined via [Window Spy](../Program.md#Window_Spy), and retrieved via [ControlGetText](../lib/ControlGetText.md), [GuiControl.Text](../lib/GuiControl.md#Text), and [GuiControl.Value](../lib/GuiControl.md#Value).

<a id="Omitted"></a>
### Omitted

[ControlClick](../lib/ControlClick.md), [ControlSend](../lib/ControlSend.md), [PostMessage](../lib/PostMessage.md), and [SendMessage](../lib/SendMessage.md) are able to operate on either a control or a top-level window. Omitting the *ControlID* parameter causes the function to use the target window (specified by *[WinTitle](WinTitle.md)*) instead of one of its controls.

<a id="Remarks"></a>
## Remarks

The following functions have a *ControlID* parameter: [ControlAddItem](../lib/ControlAddItem.md), [ControlChooseIndex](../lib/ControlChooseIndex.md), [ControlChooseString](../lib/ControlChooseString.md), [ControlClick](../lib/ControlClick.md), [ControlDeleteItem](../lib/ControlDeleteItem.md), [ControlFindItem](../lib/ControlFindItem.md), [ControlFocus](../lib/ControlFocus.md), [ControlGetChecked](../lib/ControlGetChecked.md), [ControlGetChoice](../lib/ControlGetChoice.md), [ControlGetClassNN](../lib/ControlGetClassNN.md), [ControlGetEnabled](../lib/ControlGetEnabled.md), [ControlGetHwnd](../lib/ControlGetHwnd.md), [ControlGetIndex](../lib/ControlGetIndex.md), [ControlGetItems](../lib/ControlGetItems.md), [ControlGetPos](../lib/ControlGetPos.md), [ControlGetStyle](../lib/ControlGetStyle.md), [ControlGetText](../lib/ControlGetText.md), [ControlGetVisible](../lib/ControlGetVisible.md), [ControlHide](../lib/ControlHide.md), [ControlHideDropDown](../lib/ControlHideDropDown.md), [ControlMove](../lib/ControlMove.md), [ControlSend](../lib/ControlSend.md), [ControlSetChecked](../lib/ControlSetChecked.md), [ControlSetEnabled](../lib/ControlSetEnabled.md), [ControlSetStyle](../lib/ControlSetStyle.md), [ControlSetText](../lib/ControlSetText.md), [ControlShow](../lib/ControlShow.md), [ControlShowDropDown](../lib/ControlShowDropDown.md), [EditGetCurrentCol](../lib/EditGetCurrentCol.md), [EditGetCurrentLine](../lib/EditGetCurrentLine.md), [EditGetLine](../lib/EditGetLine.md), [EditGetLineCount](../lib/EditGetLineCount.md), [EditGetSelectedText](../lib/EditGetSelectedText.md), [EditPaste](../lib/EditPaste.md), [ListViewGetContent](../lib/ListViewGetContent.md), [PostMessage](../lib/PostMessage.md), [SendMessage](../lib/SendMessage.md). Most of these functions have examples on their corresponding page that demonstrate the use of control identifiers.

ClassNN and control text may change when applications recreate controls, alter their order, use dynamic or virtualized interfaces, or rely on frameworks that do not expose stable Win32 class names or text. When identifiers are unreliable, prefer using a HWND for lifetime-stable addressing or combine multiple criteria. As general guidance: use control text when it is unique and stable, use ClassNN when the control order is consistent and readability is desired, and use a HWND when maximum stability is required. Avoid hardcoding identifiers across application versions unless you control the target application.

<a id="Related"></a>
## Related

[WinTitle Parameter & Last Found Window](WinTitle.md)
