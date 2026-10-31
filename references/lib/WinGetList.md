# WinGetList

Returns an array of unique IDs (HWNDs) for all existing windows that match the specified criteria.

```ahk
HWNDs := WinGetList(WinTitle, WinText, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, all windows on the entire system will be retrieved. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Return_Value"></a>
## Return Value

Type: [Array](Array.md)

This function returns an array of [unique IDs (HWNDs)](../misc/WinTitle.md#ahk_id) for all existing windows that match the specified criteria. If there is no matching window, an empty array is returned.

For example, if the return value is assigned to a variable named `HWNDs` and two matching windows are discovered, `HWNDs[1]` contains the HWND of the first window, `HWNDs[2]` contains the HWND of the second window, and `HWNDs.Length` returns the number 2.

Windows are retrieved in order from topmost to bottommost (according to how they are stacked on the desktop).

<a id="Related"></a>
## Related

[WinGetCount](WinGetCount.md), [Win functions](Win.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Visits all windows on the entire system and displays info about each of them.

```ahk
ids := WinGetList(,, "Program Manager")
for this_id in ids
{
    WinActivate this_id
    this_class := WinGetClass(this_id)
    this_title := WinGetTitle(this_id)
    Result := MsgBox(
    (
        "Visiting All Windows
        " A_Index " of " ids.Length "
        ahk_id " this_id "
        ahk_class " this_class "
        " this_title "

        Continue?"
    ),, 4)
    if (Result = "No")
        break
}
```
