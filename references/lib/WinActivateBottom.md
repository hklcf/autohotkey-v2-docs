# WinActivateBottom

Same as [WinActivate](WinActivate.md) except that it activates the bottommost matching window rather than the topmost.

```ahk
WinActivateBottom WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

At least one of these is required. Specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

<a id="Remarks"></a>
## Remarks

The bottommost window is typically the one least recently used, except when windows have been reordered, such as with [WinMoveBottom](WinMoveBottom.md).

If there is only one matching window, WinActivateBottom behaves identically to [WinActivate](WinActivate.md).

[Window groups](GroupAdd.md) are more advanced than this function, so consider using them for more features and flexibility.

If the window is minimized and inactive, it is automatically restored prior to being activated. If *WinTitle* is the letter "A" and the other parameters are omitted, the active window is restored. The window is restored even if it was already active.

Six attempts will be made to activate the target window over the course of 60 ms. Thus, it is usually unnecessary to follow it with the [WinWaitActive](WinWaitActive.md) function.

Unlike [WinActivate](WinActivate.md), the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) cannot be used because it might not be the bottommost window. Therefore, at least one of the parameters must be non-blank.

When a window is activated immediately after another window was activated, task bar buttons may start flashing on some systems (depending on OS and settings). To prevent this, use [#WinActivateForce](_WinActivateForce.md).

<a id="Related"></a>
## Related

[WinActivate](WinActivate.md), [#WinActivateForce](_WinActivateForce.md), [SetTitleMatchMode](SetTitleMatchMode.md), [DetectHiddenWindows](DetectHiddenWindows.md), [WinExist](WinExist.md), [WinActive](WinActive.md), [WinWaitActive](WinWaitActive.md), [WinWait](WinWait.md), [WinWaitClose](WinWaitClose.md), [GroupActivate](GroupActivate.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Press a hotkey to visit all open browser windows in order from oldest to newest.

```ahk
#i:: ; Win+I
{
    SetTitleMatchMode 2
    WinActivateBottom "- Microsoft Internet Explorer"
}
```
