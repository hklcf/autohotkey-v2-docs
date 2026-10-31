# ControlGetItems

Returns an array of entries from a list box, combo box, or drop-down list.

```ahk
Items := ControlGetItems(ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

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

Type: [Array](Array.md)

This function returns an array containing the text of each entry.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found, or if the control's class name does not contain "Combo" or "List".

An [Error](Error.md) is thrown on failure, such as if a message returned a failure code or could not be sent.

<a id="Remarks"></a>
## Remarks

This function works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected.

Some applications store their control data privately, preventing AutoHotkey from retrieving any text. In such cases, no exception is usually thrown, but all the retrieved text will be empty.

To get the total number of entries, use [Array.Length](Array.md#Length), as in [example #3](#ExCount). To instead discover how many pages exist in a tab control, follow this example:

```ahk
PageCount := SendMessage(0x1304,,, "SysTabControl321", WinTitle)  ; 0x1304 is TCM_GETITEMCOUNT.
```

<a id="Related"></a>
## Related

[ListViewGetContent](ListViewGetContent.md), [WinGetList](WinGetList.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExFor"></a>

**Example:** Accesses the entries of a combo box one by one in a GUI or non-GUI window.

```ahk
for entry in ControlGetItems("ComboBox1", "Some Window Title")
    MsgBox "Entry number " A_Index " is " entry
```

<a id="ExIndex"></a>

**Example:** Accesses a specific entry of a list box by index in a GUI or non-GUI window.

```ahk
entries := ControlGetItems("ListBox1", "Some Window Title")
MsgBox "The first item is " entries[1]
MsgBox "The last item is " entries[-1]
```

<a id="ExCount"></a>

**Example:** Reports the total number of entries in a list box within a GUI or non-GUI window.

```ahk
entries := ControlGetItems("ListBox1", "Some Window Title")
MsgBox "The total number is " entries.Length
```
