# DetectHiddenText

Determines whether invisible text in a window is "seen" for the purpose of finding the window. This affects windowing functions such as [WinExist](WinExist.md) and [WinActivate](WinActivate.md).

```ahk
PrevSetting := DetectHiddenText(Setting)
```

<a id="Parameters"></a>
## Parameters

**Setting**

Type: [Boolean](../Concepts.md#boolean)

If **true**, hidden text detection is enabled.

If **false**, hidden text detection is disabled.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns the previous setting; either 0 (false) for disabled or 1 (true) for enabled.

<a id="Remarks"></a>
## Remarks

By default, hidden text detection is enabled.

"Hidden text" is a term that refers to those controls of a window that are not visible. Their text is thus considered "hidden". Turning off DetectHiddenText can be useful in cases where you want to detect the difference between the different panes of a multi-pane window or multi-tabbed dialog. Use [Window Spy](../Program.md#Window_Spy) to determine which text of the currently-active window is hidden. All built-in functions that accept a *WinText* parameter are affected by this setting, including [WinActivate](WinActivate.md), [WinActive](WinActive.md), [WinWait](WinWait.md), and [WinExist](WinExist.md).

The built-in variable [A_DetectHiddenText](../Variables.md#DetectHiddenText) contains the current setting and can also be assigned a new value instead of calling DetectHiddenText.

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

<a id="Related"></a>
## Related

[DetectHiddenWindows](DetectHiddenWindows.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Turns off the detection of hidden text.

```ahk
DetectHiddenText false
```
