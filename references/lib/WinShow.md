# WinShow

Unhides the specified window.

```ahk
WinShow WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. Hidden windows are always detected regardless of [DetectHiddenWindows](DetectHiddenWindows.md). By default, hidden text elements are detected unless changed with [DetectHiddenText](DetectHiddenText.md). By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found, except if the [group](#group) mode is used.

<a id="Remarks"></a>
## Remarks

By default, WinShow is the only function that can always detect hidden windows. Other built-in functions can detect them only if [DetectHiddenWindows](DetectHiddenWindows.md) has been turned on.

<a id="group"></a>

This function operates only upon the topmost matching window except when *WinTitle* is [ahk_group GroupName](GroupAdd.md), in which case all windows in the group are affected.

<a id="Related"></a>
## Related

[WinHide](WinHide.md), [SetTitleMatchMode](SetTitleMatchMode.md), [DetectHiddenWindows](DetectHiddenWindows.md), [Last Found Window](../misc/WinTitle.md#LastFoundWindow)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Opens Notepad, waits until it exists, hides it for a short time and unhides it.

```ahk
Run "notepad.exe"
WinWait "Untitled - Notepad"
Sleep 500
WinHide ; Use the window found by WinWait.
Sleep 1000
WinShow ; Use the window found by WinWait.
```
