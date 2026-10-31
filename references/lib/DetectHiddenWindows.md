# DetectHiddenWindows

Determines whether invisible windows are "seen" by the script.

```ahk
PrevSetting := DetectHiddenWindows(Setting)
```

<a id="Parameters"></a>
## Parameters

**Setting**

Type: [Boolean](../Concepts.md#boolean)

If **true**, hidden window detection is enabled.

If **false**, hidden window detection is disabled.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns the previous setting; either 0 (false) for disabled or 1 (true) for enabled.

<a id="Remarks"></a>
## Remarks

By default, hidden window detection is disabled.

Turning on DetectHiddenWindows can make scripting harder in some cases since some hidden system windows might accidentally match the title or text of another window you're trying to work with. So most scripts should leave this setting turned off. However, turning it on may be useful if you wish to work with hidden windows directly without first using [WinShow](WinShow.md) to unhide them.

All windowing functions except [WinShow](WinShow.md) are affected by this setting, including [WinActivate](WinActivate.md), [WinActive](WinActive.md), [WinWait](WinWait.md) and [WinExist](WinExist.md). By contrast, [WinShow](WinShow.md) will always unhide a hidden window even if hidden windows are not being detected.

Turning on DetectHiddenWindows is not necessary in the following cases:

- When using a [pure HWND](../misc/WinTitle.md#ahk_id) (as an [Integer](../Concepts.md#numbers) or an [Object](../Objects.md) with a Hwnd property), as in `WinShow(A_ScriptHwnd)` or `WinMoveTop(myGui)`, except with [WinWait](WinWait.md) or [WinWaitClose](WinWaitClose.md).
- When accessing a control or child window via the [ahk_id method](../misc/WinTitle.md#ahk_id) or as the [last-found-window](../misc/WinTitle.md#LastFoundWindow).
- When accessing GUI windows via the [+LastFound](Gui.md#LastFound) option.

Cloaked windows are also considered hidden. Cloaked windows, introduced with Windows 8, are windows on a non-active virtual desktop or UWP apps which have been suspended to improve performance, or more precisely to reduce their memory consumption. On Windows 10, the processes of those are indicated with a green leaf in the Task Manager. Such windows are hidden from view, but might still have the WS_VISIBLE window style.

The built-in variable [A_DetectHiddenWindows](../Variables.md#DetectHiddenWindows) contains the current setting and can also be assigned a new value instead of calling DetectHiddenWindows.

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

<a id="Related"></a>
## Related

[DetectHiddenText](DetectHiddenText.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Turns on the detection of hidden windows.

```ahk
DetectHiddenWindows true
```
