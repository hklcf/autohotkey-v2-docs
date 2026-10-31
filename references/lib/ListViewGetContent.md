# ListViewGetContent

Returns content data from a list-view control, such as rows, columns, or count values.

```ahk
Data := ListViewGetContent(Options, ControlID, WinTitle, WinText, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**Options**

Type: [String](../Concepts.md#strings)

Specify what to retrieve. If blank or omitted, all rows in the control are returned. Otherwise, specify zero or more of the following words, each separated from the next with a space or tab:

**Selected:** Returns only the selected rows rather than all rows. If none, *Data* is made blank.

**Focused:** Returns only the focused row. If none, *Data* is made blank.

<a id="ColN"></a>

**Col***N*: Returns only the *N*th column (field) rather than all columns. Replace *N* with a number of your choice. For example, Col4 returns the fourth column.

**Count:** Returns a single number that is the total number of rows in the control.

**Count Selected:** Returns the number of selected rows.

**Count Focused:** Returns the row number (position) of the focused row (0 if none).

**Count Col:** Returns the number of columns in the control (or -1 if the count cannot be determined).

**ControlID**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

The control's ClassNN, text or HWND, or an object with a Hwnd property. For details, see [Control Identifiers](../misc/ControlID.md). This parameter is required; that is, it cannot be omitted.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

This function returns either a list of rows or a count value, depending on the specified options.

When returning a list of rows, each row except the last will end with a linefeed character (\`n). Within each row, each field (column) except the last will end with a tab character (\`t).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window or control could not be found.

An [OSError](Error.md#OSError) is thrown if a message could not be sent to the control, or if the process owning the list-view control could not be opened, perhaps due to a lack of user permissions or because it is locked.

A [ValueError](Error.md#ValueError) is thrown if the [Col*N* option](#ColN) specifies a nonexistent column.

<a id="Remarks"></a>
## Remarks

This function is intended for use with controls in a non-GUI window, i.e. a window that is not created with the [Gui](Gui.md#Call) function. It works best with common or predefined Microsoft controls; some applications use custom or modified controls, in which case the function might not work as expected. For [GUI ListView controls](ListView.md), it is usually more convenient to use their [built-in retrieval methods](ListView.md#BuiltIn).

Some applications store their control data privately, preventing AutoHotkey from retrieving any text. In such cases, no exception is usually thrown, but all the retrieved text will be empty.

On a related note, the columns in a list-view control can be resized via [SendMessage](SendMessage.md) as shown in this example:

```ahk
SendMessage(0x101E, 0, 80, "SysListView321", WinTitle)  ; 0x101E is LVM_SETCOLUMNWIDTH.
```

In the above, 0 indicates the first column (specify 1 for the second, 2 for the third, etc.) Also, 80 is the new width. Replace 80 with -1 to autosize the column. Replace it with -2 to do the same but also take into account the header text width.

<a id="Related"></a>
## Related

[ControlGetItems](ControlGetItems.md), [WinGetList](WinGetList.md), [GUI ListView control](ListView.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExListView"></a>

**Example:** Extracts the individual rows and fields out of a list-view control in a GUI or non-GUI window.

```ahk
List := ListViewGetContent("Selected", "SysListView321", WinTitle)
Loop Parse, List, "`n"  ; Rows are delimited by linefeeds (`n).
{
    RowNumber := A_Index
    Loop Parse, A_LoopField, A_Tab  ; Fields (columns) in each row are delimited by tabs (A_Tab).
        MsgBox "Row #" RowNumber " Col #" A_Index " is " A_LoopField
}
```
