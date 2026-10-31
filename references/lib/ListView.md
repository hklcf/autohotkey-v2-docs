# ListView

<a id="toc"></a>
## Table of Contents

- [Introduction and Simple Example](#Intro)
- [Parameters](#Parameters)
- [View Modes](#View): Report (default), Icon, Tile, IconSmall, and List.
- [Built-in Methods](#BuiltIn)
- [Events](#Events)
- [ImageLists](#IL) (the means by which icons are added to a ListView)
- [Remarks](#Remarks)
- [Examples](#Examples)

<a id="Intro"></a>
## Introduction and Simple Example

A ListView is one of the most elaborate controls provided by the operating system. In its most recognizable form, it displays a tabular view of rows and columns, the most common example of which is Explorer's list of files and folders (detail view).

A ListView usually looks like this:

![ListView](../static/ctrl_listview.png)

Though it may be elaborate, a ListView's basic features are easy to use. The syntax for creating a ListView is:

<a id="GuiAdd"></a>

```ahk
GuiCtrl := MyGui.Add("ListView", Options, ColumnTitles)
GuiCtrl := MyGui.AddListView(Options, ColumnTitles)
```

Here is a working script that creates and displays a ListView containing a list of files in the user's "My Documents" folder:

```ahk
; Create the window:
MyGui := Gui()

; Create the ListView with two columns, Name and Size:
LV := MyGui.Add("ListView", "r20 w700", ["Name", "Size (KB)"])

; Notify the script whenever the user double clicks a row:
LV.OnEvent("DoubleClick", LV_DoubleClick)

; Gather a list of file names from a folder and put them into the ListView:
Loop Files, A_MyDocuments "\*.*"
    LV.Add(, A_LoopFileName, A_LoopFileSizeKB)

LV.ModifyCol()  ; Auto-size each column to fit its contents.
LV.ModifyCol(2, "Integer")  ; For sorting purposes, indicate that column 2 is an integer.

; Display the window:
MyGui.Show()

LV_DoubleClick(LV, RowNumber)
{
    RowText := LV.GetText(RowNumber)  ; Get the text from the row's first field.
    ToolTip("You double-clicked row number " RowNumber ". Text: '" RowText "'")
}
```

<a id="Parameters"></a>
## Parameters

<a id="Options"></a>

**Options**

Type: [String](../Concepts.md#strings)

In addition to the [general options and styles](Gui.md#Add_Options), the following are supported or noteworthy:

**Background***Color*: Background color. Specify for *Color* a color name (see [color chart](../misc/Colors.md)) or RGB value (the 0x prefix is optional). Examples: `BackgroundSilver`, `BackgroundFFDD99`. If this option is not present, the ListView initially defaults to the system's default background color. Specifying `BackgroundDefault` applies the system's default background color (usually white). For example, a ListView can be restored to the default color via `LV.Opt("+BackgroundDefault")`.

**C***Color*: Text color. Specify for *Color* a color name (see [color chart](../misc/Colors.md)) or RGB value (the 0x prefix is optional). Examples: `cRed`, `cFF2211`, `c0xFF2211`, `cDefault`.

<a id="Checked"></a>

**Checked:** Provides a checkbox at the left side of each row. When [adding](#Add) a row, specify the word *Check* in its options to have the box to start off checked instead of unchecked. The user may either click the checkbox or press the spacebar to check or uncheck a row.

<a id="Count"></a>

**Count***N*: Specify for *N* the total number of rows that the ListView will ultimately contain. This is not a limit: rows beyond the count can still be added. Instead, this option serves as a hint to the control that allows it to allocate memory only once rather than each time a row is added, which greatly improves row-adding performance (it may also improve sorting performance). To improve performance even more, use `LV.Opt("-Redraw")` prior to adding a large number of rows and `LV.Opt("+Redraw")` afterward. See [Redraw](GuiControl.md#Redraw) for more details.

**Grid:** Provides horizontal and vertical lines to visually indicate the boundaries between rows and columns.

**Hdr:** Specify `-Hdr` (minus Hdr) to omit the header (the special top row that contains column titles). To make it visible later, use `LV.Opt("+Hdr")`.

**Icon**, **Tile**, **IconSmall**, **List**, or **Report**: See [View Modes](#View) for details.

<a id="LVS_EX"></a>

**LV***n*: Specify for *n* the number of an [extended ListView style](../misc/Styles.md#LVS_EX). These styles are entirely separate from generic extended styles. For example, specifying `-E0x200` would remove the generic extended style WS_EX_CLIENTEDGE to eliminate the control's default border. By contrast, specifying `-LV0x20` would remove [LVS_EX_FULLROWSELECT](#frs).

**LV0x10:** Specify `-LV0x10` to prevent the user from dragging column headers to the left or right to reorder them. However, it is usually not necessary to do this because the physical reordering of columns does not affect the column order seen by the script. For example, the first column will always be column 1 from the script's point of view, even if the user has physically moved it to the right of other columns.

<a id="frs"></a>

**LV0x20:** Specify `-LV0x20` to require that a row be clicked at its first field to select it (normally, a click on *any* field will select it). The advantage of this is that it makes it easier for the user to drag a rectangle around a group of rows to select them.

**Multi:** Specify `-Multi` (minus Multi) to prevent the user from selecting more than one row at a time.

<a id="NoSortHdr"></a>

**NoSortHdr:** Prevents the header from being clickable. It will take on a flat appearance rather than its normal button-like appearance. Unlike most other ListView styles, this one cannot be changed after the ListView is created.

<a id="NoSort"></a>

**NoSort:** Turns off the automatic sorting that occurs when the user clicks a column header. However, the header will still behave visually like a button (unless the [NoSortHdr](#NoSortHdr) option has been specified). In addition, the [ColClick](GuiOnEvent.md#ColClick) event is still raised, so the script can respond with a custom sort or other action.

<a id="ReadOnly"></a>

**ReadOnly:** Specify `-ReadOnly` (minus ReadOnly) to allow editing of the text in the first column of each row. To edit a row, select it then press `F2` (see the [WantF2](#WantF2) option below). Alternatively, you can click a row once to select it, wait at least half a second, then click the same row again to edit it.

<a id="Sort"></a>

**Sort:** The control is kept alphabetically sorted according to the contents of the first column.

<a id="SortDesc"></a>

**SortDesc:** Same as above except in descending order.

<a id="WantF2"></a>

**WantF2:** Specify `-WantF2` (minus WantF2) to prevent `F2` from [editing](#ReadOnly) the currently focused row. This setting is ignored unless [-ReadOnly](#ReadOnly) is also in effect.

**W***n*: Sets the width of the control. For example, specifying `w400` would make the control 400 pixels wide. If omitted, the default is 30 times the current font size.

**R***n* or **H***n*: Sets the height of the control. For example, specifying `r7` would make room for 7 rows inside the control, while `h400` would set the total height of the control to 400 pixels. If both R and H are omitted, the default is 5 rows. If the ListView is created with a [view mode](#View) other than report view, the control is sized to fit rows of icons instead of rows of text. Note that adding [icons](#IL) to a ListView's rows will increase the height of each row, which will make this option inaccurate.

**(Unnamed numeric styles):** Since styles other than the above are rarely used, they do not have names. See the [ListView styles table](../misc/Styles.md#ListView) for a list.

**ColumnTitles**

Type: [Array](Array.md)

An array of column titles such as `["Red", "Green", "Blue"]`, which form the header of the ListView.

<a id="View"></a>
## View Modes

A ListView has five viewing modes, of which the most common is report view (which is the default). To use one of the other views, specify its name in *Options*. The view can also be changed after the control is created; for example: `LV.Opt("+IconSmall")`.

**Icon:** Shows a large-icon view. In this view and all the others except *Report*, the text in columns other than the first is not visible. To display icons in this mode, the ListView must have a large-icon [ImageList](#IL) assigned to it.

**Tile:** Shows a large-icon view but with ergonomic differences such as displaying each item's text to the right of the icon rather than underneath it. [Checkboxes](#Checked) do not function in this view.

**IconSmall:** Shows a small-icon view.

**List:** Shows a small-icon view in list format, which displays the icons in columns. The number of columns depends on the width of the control and the width of the widest text item in it.

**Report:** Switches back to report view, which is the initial default. For example: `LV.Opt("+Report")`.

<a id="BuiltIn"></a>
## Built-in Methods

In addition to the [default methods/properties of a GUI control](GuiControl.md), this control type has the following methods.

<a id="RowNumber"></a>

When the phrase "row number" is used on this page, it refers to a row's current position within the ListView. The top row is 1, the second row is 2, and so on. After a row is added, its row number tends to change due to sorting, deleting, and inserting of other rows. Therefore, to locate specific row(s) based on their contents, it is usually best to use the [GetText](#GetText) method in a loop.

Row methods:

- [Add](#Add): Adds a new row to the bottom of the list.
- [Insert](#Insert): Inserts a new row at the specified row number.
- [Modify](#Modify): Modifies the attributes and/or text of a row.
- [Delete](#Delete): Deletes the specified row or all rows.

Column methods:

- [ModifyCol](#ModifyCol): Modifies the attributes and/or text of the specified column and its header.
- [InsertCol](#InsertCol): Inserts a new column at the specified column number.
- [DeleteCol](#DeleteCol): Deletes the specified column and all of the contents beneath it.

Retrieval methods:

- [GetCount](#GetCount): Returns the number of rows or columns in the control.
- [GetNext](#GetNext): Returns the row number of the next selected, checked, or focused row.
- [GetText](#GetText): Retrieves the text at the specified row and column number.

Other methods:

- [SetImageList](#SetImageList): Sets or replaces an ImageList for displaying icons.

<a id="Add"></a>

### Add

Adds a new row to the bottom of the list.

```ahk
RowNumber := LV.Add(Options, Col1, Col2, ...)
```

<a id="Add_Parameters"></a>
#### Parameters

<a id="RowOptions"></a>

**Options**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to no options. Otherwise, specify one or more options from the list below (not case-sensitive). Separate each option from the next with a space or tab. To remove an option, precede it with a minus sign. To add an option, a plus sign is permitted but not required.

<a id="Check"></a>

**Check:** Shows a checkmark in the row (if the ListView has [checkboxes](#Checked)). To later uncheck it, use `LV.Modify(RowNumber, "-Check")`.

<a id="ColN"></a>

**Col:** Specify the word *Col* followed immediately by the column number at which to begin applying the parameters *Col1* and beyond. This is most commonly used with the [Modify](#Modify) method to alter individual fields in a row without affecting those that lie to their left.

<a id="Focus"></a>

**Focus:** Sets keyboard focus to the row (often used in conjunction with the [Select](#Select) option below). To later de-focus it, use `LV.Modify(RowNumber, "-Focus")`.

**Icon:** Specify the word *Icon* followed immediately by the number of this row's icon, which is displayed in the left side of the first column. If this option is absent, the first icon in the [ImageList](#IL) is used. To display a blank icon, specify -1 or a number that is larger than the number of icons in the ImageList. If the control lacks a small-icon ImageList, no icon is displayed nor is any space reserved for one in [report view](#View).

The *Icon* option accepts a one-based icon number, but this is internally translated to a zero-based index; therefore, `Icon0` corresponds to the constant [I_IMAGECALLBACK](https://learn.microsoft.com/windows/win32/controls/list-view-controls-overview#callback-items-and-the-callback-mask), which is normally defined as -1, and `Icon-1` corresponds to I_IMAGENONE. Other out of range values may also cause a blank space where the icon would be.

<a id="Select"></a>

**Select:** Selects the row. To later deselect it, use `LV.Modify(RowNumber, "-Select")`. When selecting rows, it is usually best to ensure that at least one row always has the [focus property](#Focus) because that allows the Apps key to display its [context menu](GuiOnEvent.md#ContextMenu) (if any) near the focused row. The word *Select* may optionally be followed immediately by a 0 or 1 to indicate the starting state. In other words, both `"Select"` and `"Select" . VarContainingOne` are the same (the period used here is the [concatenation operator](../Variables.md#concat)). This technique also works with the [Focus](#Focus) and [Check](#Check) options above.

<a id="Vis"></a>

**Vis:** Ensures that the specified row is completely visible by scrolling the ListView, if necessary. This has an effect only for [LV.Modify](#Modify); for example: `LV.Modify(RowNumber, "Vis")`.

**Col1, Col2, ...**

Type: [String](../Concepts.md#strings)

The columns of the new row, which can be text or numeric (including numeric [expression](../Variables.md#Expressions) results). To make any field blank, specify `""` or the equivalent. If there are too few fields to fill all the columns, the columns at the end are left blank. If there are too many fields, the fields at the end are completely ignored.

<a id="Add_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the new [row number](#RowNumber), which is not necessarily the last row if the ListView has the [Sort](#Sort) or [SortDesc](#SortDesc) style.

<a id="Insert"></a>

### Insert

Inserts a new row at the specified row number.

```ahk
RowNumber := LV.Insert(RowNumber , Options, Col1, Col2, ...)
```

<a id="Insert_Parameters"></a>
#### Parameters

**RowNumber**

Type: [Integer](../Concepts.md#numbers)

The row number of the newly inserted row. Any rows at or beneath *RowNumber* are shifted downward to make room for the new row. If *RowNumber* is greater than the number of rows in the list (even as high as 2147483647), the new row is added to the end of the list.

**Options**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to no options. Otherwise, specify one or more options from the [list above](#RowOptions).

**Col1, Col2, ...**

Type: [String](../Concepts.md#strings)

The columns of the new row, which can be text or numeric (including numeric [expression](../Variables.md#Expressions) results). To make any field blank, specify `""` or the equivalent. If there are too few fields to fill all the columns, the columns at the end are left blank. If there are too many fields, the fields at the end are completely ignored.

<a id="Insert_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the specified row number.

<a id="Modify"></a>

### Modify

Modifies the attributes and/or text of a row.

```ahk
LV.Modify(RowNumber , Options, NewCol1, NewCol2, ...)
```

<a id="Modify_Parameters"></a>
#### Parameters

**RowNumber**

Type: [Integer](../Concepts.md#numbers)

The number of the row to modify. If 0, <u>all</u> rows in the control are modified.

**Options**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to no options. Otherwise, specify one or more options from the [list above](#RowOptions). The [Col option](#ColN) may be used to update specific columns without affecting the others.

**NewCol1, NewCol2, ...**

Type: [String](../Concepts.md#strings)

The new columns of the specified row, which can be text or numeric (including numeric [expression](../Variables.md#Expressions) results). To make any field blank, specify `""` or the equivalent. If there are too few parameters to cover all the columns, the columns at the end are not changed. If there are too many fields, the fields at the end are completely ignored.

<a id="Modify_Remarks"></a>
#### Remarks

When only the first two parameters are present, only the row's attributes and not its text are changed.

<a id="Delete"></a>

### Delete

Deletes the specified row or all rows.

```ahk
LV.Delete(RowNumber)
```

<a id="Delete_Parameters"></a>
#### Parameters

**RowNumber**

Type: [Integer](../Concepts.md#numbers)

If omitted, <u>all</u> rows in the ListView are deleted. Otherwise, specify the number of the row to delete.

<a id="ModifyCol"></a>

### ModifyCol

Modifies the attributes and/or text of the specified column and its header.

```ahk
LV.ModifyCol(ColumnNumber, Options, ColumnTitle)
```

<a id="ModifyCol_Parameters"></a>
#### Parameters

**ColumnNumber**

Type: [Integer](../Concepts.md#numbers)

If this and the other parameters are all omitted, the width of every column is adjusted to fit the contents of the rows. This has no effect when not in [Report (Details) view](#View).

Otherwise, specify the number of the column to modify. The first column is 1 (not 0).

<a id="ColOptions"></a>

**Options**

Type: [String](../Concepts.md#strings)

If omitted, it defaults to Auto (adjusts the column's width to fit its contents). Otherwise, specify one or more options from the list below (not case-sensitive). Separate each option from the next with a space or tab. To remove an option, precede it with a minus sign. To add an option, a plus sign is permitted but not required.

---

***General options:***

**N:** Specify for *N* the new width of the column, in pixels. This number can be unquoted if is the only option. For example, the following are both valid: `LV.ModifyCol(1, 50)` and `LV.ModifyCol(1, "50 Integer")`.

**Auto:** Adjusts the column's width to fit its contents. This has no effect when not in [Report (Details) view](#View).

**AutoHdr:** Adjusts the column's width to fit its contents and the column's header text, whichever is wider. If applied to the last column, it will be made at least as wide as all the remaining space in the ListView. It is usually best to apply this setting only after the rows have been added because that allows any newly-arrived vertical scroll bar to be taken into account when sizing the last column. This has no effect when not in [Report (Details) view](#View).

**Icon:** Specify the word *Icon* followed immediately by the number of the [ImageList](#IL)'s icon to display next to the column header's text. Specify `-Icon` (minus icon) to remove any existing icon.

**IconRight:** Puts the icon on the right side of the column rather than the left.

---

***Data type options:***

**Float:** For sorting purposes, indicates that this column contains floating point numbers (hexadecimal format is not supported). Sorting performance for Float and Text columns is up to 25 times slower than it is for integers.

<a id="Integer"></a>

**Integer:** For sorting purposes, indicates that this column contains integers. To be sorted properly, each integer must be 32-bit; that is, within the range -2147483648 to 2147483647. If any of the values are not integers, they will be considered zero when sorting (unless they start with a number, in which case that number is used). Numbers may appear in either decimal or hexadecimal format (e.g. `0xF9E0`).

<a id="Text"></a>

**Text:** Changes the column back to text-mode sorting, which is the initial default for every column. Only the first 8190 characters of text are significant for sorting purposes (except for the [Logical](#Logical) option, in which case the limit is 4094).

---

***Alignment options:***

**Center:** Centers the text in the column. To center an Integer or Float column, specify the word *Center* after the word *Integer* or *Float*.

**Left:** Left-aligns the column's text, which is the initial default for every column. On older operating systems, the first column might have a forced left-alignment.

**Right:** Right-aligns the column's text. This attribute need not be specified for Integer and Float columns because they are right-aligned by default. That default can be overridden by specifying something such as `"Integer Left"` or `"Float Center"`.

---

***Sorting options:***

<a id="Case"></a>

**Case:** The sorting of the column is case-sensitive (affects only [text](#Text) columns). If the options *Case*, *CaseLocale*, and *Logical* are all omitted, the uppercase letters A-Z are considered identical to their lowercase counterparts for the purpose of the sort.

**CaseLocale:** The sorting of the column is case-insensitive based on the current user's locale (affects only [text](#Text) columns). For example, most English and Western European locales treat the letters A-Z and ANSI letters like Ä and Ü as identical to their lowercase counterparts. This method also uses a "word sort", which treats hyphens and apostrophes in such a way that words like "coop" and "co-op" stay together.

<a id="Desc"></a>

**Desc:** Descending order. The column starts off in descending order the first time the user sorts it.

<a id="Logical"></a>

**Logical:** Same as *CaseLocale* except that any sequences of digits in the text are treated as true numbers rather than mere characters. For example, the string "T33" would be considered greater than "T4". *Logical* and *Case* are currently mutually exclusive: only the one most recently specified will be in effect.

**NoSort:** Prevents a user's click on this column from having any automatic sorting effect. However, the [ColClick](GuiOnEvent.md#ColClick) event is still raised, so the script can respond with a custom sort or other action. To disable sorting for all columns rather than only a subset, include [NoSort](#NoSort) in the ListView's options.

**Sort:** Immediately sorts the column in ascending order (even if it has the [Desc](#Desc) option).

**SortDesc:** Immediately sorts the column in descending order.

**Uni:** Unidirectional sort. This prevents a second click on the same column from reversing the sort direction.

**ColumnTitle**

Type: [String](../Concepts.md#strings)

If omitted, the current header is left unchanged. Otherwise, specify the new header of the column.

<a id="InsertCol"></a>

### InsertCol

Inserts a new column at the specified column number.

```ahk
ColumnNumber := LV.InsertCol(ColumnNumber, Options, ColumnTitle)
```

<a id="InsertCol_Parameters"></a>
#### Parameters

**ColumnNumber**

Type: [Integer](../Concepts.md#numbers)

If omitted or larger than the number of columns currently in the control, the new column is added next to the last column on the right side.

Otherwise, specify the column number of the newly inserted column. Any column at or on the right side of *ColumnNumber* are shifted to the right to make room for the new column. The first column is 1 (not 0).

**Options**

Type: [String](../Concepts.md#strings)

If omitted, the column always starts off at its defaults, such as whether or not it uses [integer sorting](#Integer). Otherwise, specify one or more options from the [list above](#ColOptions).

**ColumnTitle**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to an empty header. Otherwise, specify the header of the column.

<a id="InsertCol_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the new column's position number.

<a id="InsertCol_Remarks"></a>
#### Remarks

The newly inserted column starts off with empty contents beneath it unless it is the first column, in which case it inherits the old first column's contents and the old first column acquires blank contents.

The maximum number of columns in a ListView is 200.

<a id="DeleteCol"></a>

### DeleteCol

Deletes the specified column and all of the contents beneath it.

```ahk
LV.DeleteCol(ColumnNumber)
```

<a id="DeleteCol_Parameters"></a>
#### Parameters

**ColumnNumber**

Type: [Integer](../Concepts.md#numbers)

The number of the column to delete. Once a column is deleted, the column numbers of any that lie to its right are reduced by 1. Consequently, calling `LV.DeleteCol(2)` twice would delete the second and third columns.

<a id="GetCount"></a>

### GetCount

Returns the number of rows or columns in the control.

```ahk
Count := LV.GetCount(Mode)
```

<a id="GetCount_Parameters"></a>
#### Parameters

**Mode**

Type: [String](../Concepts.md#strings)

If blank or omitted, the method returns the total number of rows in the control. Otherwise, specify one of the following strings:

**S** or **Selected**: The count includes only the selected/highlighted rows.

**Col** or **Column**: The method returns the number of columns in the control.

<a id="GetCount_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the number of rows or columns in the control. The value is always returned immediately because the control keeps track of these counts.

<a id="GetCount_Remarks"></a>
#### Remarks

This method is often used in the top line of a [Loop](Loop.md), in which case the method would get called only once (prior to the first iteration). For example:

```ahk
Loop LV.GetCount()
{
    RetrievedText := LV.GetText(A_Index)
    if InStr(RetrievedText, "some filter text")
        LV.Modify(A_Index, "Select")  ; Select each row whose first field contains the filter-text.
}
```

To retrieve the widths of a ListView's columns -- for uses such as saving them to an INI file to be remembered between sessions -- follow this example:

```ahk
Loop LV.GetCount("Column")
{
    ColWidth := SendMessage(0x101D, A_Index - 1, 0, LV)  ; 0x101D is LVM_GETCOLUMNWIDTH.
    MsgBox("Column " A_Index "'s width is " ColWidth ".")
}
```

<a id="GetNext"></a>

### GetNext

Returns the row number of the next selected, checked, or focused row.

```ahk
RowNumber := LV.GetNext(StartingRowNumber, RowType)
```

<a id="GetNext_Parameters"></a>
#### Parameters

**StartingRowNumber**

Type: [Integer](../Concepts.md#numbers)

If omitted or less than 1, the search begins at the top of the list. Otherwise, specify the number of the row after which to begin the search.

**RowType**

Type: [String](../Concepts.md#strings)

If blank or omitted, the method searches for the next selected/highlighted row (see the example below). Otherwise, specify one of the following strings:

**C** or **Checked**: Find the next checked row.

**F** or **Focused**: Find the focused row. There is never more than one focused row in the entire list, and sometimes there is none at all.

<a id="GetNext_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the row number of the next selected, checked, or focused row. If none is found, it returns 0.

<a id="GetNext_Remarks"></a>
#### Remarks

The following example reports all selected rows in the ListView:

```ahk
RowNumber := 0  ; This causes the first loop iteration to start the search at the top of the list.
Loop
{
    RowNumber := LV.GetNext(RowNumber)  ; Resume the search at the row after that found by the previous iteration.
    if not RowNumber  ; The above returned zero, so there are no more selected rows.
        break
    Text := LV.GetText(RowNumber)
    MsgBox('The next selected row is #' RowNumber ', whose first field is "' Text '".')
}
```

An alternate method to find out if a particular row number is checked is the following:

```ahk
ItemState := SendMessage(0x102C, RowNumber - 1, 0xF000, LV)  ; 0x102C is LVM_GETITEMSTATE. 0xF000 is LVIS_STATEIMAGEMASK.
IsChecked := (ItemState >> 12) - 1  ; This sets IsChecked to true if RowNumber is checked or false otherwise.
```

<a id="GetText"></a>

### GetText

Retrieves the text at the specified row and column number.

```ahk
Text := LV.GetText(RowNumber , ColumnNumber)
```

<a id="GetText_Parameters"></a>
#### Parameters

**RowNumber**

Type: [Integer](../Concepts.md#numbers)

The number of the row whose text to be retrieved. If 0, the column header text is retrieved.

**ColumnNumber**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1 (the text in the first column). Otherwise, specify the number of the column where *RowNumber* is located.

<a id="GetText_Return_Value"></a>
#### Return Value

Type: [String](../Concepts.md#strings)

The method returns the retrieved text. Only up to 8191 characters are retrieved.

<a id="GetText_Remarks"></a>
#### Remarks

Column numbers seen by the script are not altered by any dragging and dropping of columns the user may have done. For example, the original first column is still number 1 even if the user drags it to the right of other columns.

<a id="SetImageList"></a>

### SetImageList

Sets or replaces an [ImageList](#IL) for displaying icons.

```ahk
PrevImageListID := LV.SetImageList(ImageListID , IconType)
```

<a id="SetImageList_Parameters"></a>
#### Parameters

**ImageListID**

Type: [Integer](../Concepts.md#numbers)

The ID number returned from a previous call to [IL_Create](#IL_Create).

**IconType**

Type: [Integer](../Concepts.md#numbers)

If omitted, the type of icons in the ImageList is detected automatically as large or small. Otherwise, specify 0 for large icons, 1 for small icons, or 2 for state icons (which are not yet directly supported, but could be used via [SendMessage](SendMessage.md)).

<a id="SetImageList_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the ImageList ID that was previously associated with the ListView. On failure, it returns 0. Any such detached ImageList should normally be destroyed via [IL_Destroy](#IL_Destroy).

<a id="SetImageList_Remarks"></a>
#### Remarks

This method is normally called prior to adding any rows to the ListView. It sets the [ImageList](#IL) whose icons will be displayed by the ListView's rows (and optionally, its columns).

A ListView may have up to two ImageLists: small-icon and/or large-icon. This is useful when the script allows the user to switch to and from the large-icon view. To add more than one ImageList to a ListView, call the SetImageList method a second time, specifying the ImageList ID of the second list. A ListView with both a large-icon and small-icon ImageList should ensure that both lists contain the icons in the same order. This is because the same ID number is used to reference both the large and small versions of a particular icon.

Although it is traditional for all [viewing modes](#View) except Icon and Tile to show small icons, this can be overridden by passing a large-icon list to the SetImageList method and specifying 1 (small-icon) for the second parameter. This also increases the height of each row in the ListView to fit the large icon.

<a id="Events"></a>
## Events

The following events can be detected by calling [GuiControl.OnEvent](GuiControl.md#OnEvent) to register a callback function or method:

| Event | Raised when... |
| --- | --- |
| [Click](GuiOnEvent.md#Click) | The control is clicked. |
| [DoubleClick](GuiOnEvent.md#DoubleClick) | The control is double-clicked. |
| [ColClick](GuiOnEvent.md#ColClick) | A column header is clicked. |
| [ContextMenu](GuiOnEvent.md#Ctrl-ContextMenu) | The user right-clicks the control or presses `Menu` or `Shift`+`F10` while the control has the keyboard focus. |
| [Focus](GuiOnEvent.md#Focus) | The control gains the keyboard focus. |
| [LoseFocus](GuiOnEvent.md#LoseFocus) | The control loses the keyboard focus. |
| [ItemCheck](GuiOnEvent.md#ItemCheck) | An item is checked or unchecked. |
| [ItemEdit](GuiOnEvent.md#ItemEdit) | An item's label is edited by the user. |
| [ItemFocus](GuiOnEvent.md#ItemFocus) | The focused item changes. |
| [ItemSelect](GuiOnEvent.md#ItemSelect) | An item is selected or deselected. |

Additional (rarely-used) notifications can be detected by using [GuiControl.OnNotify](GuiControl.md#OnNotify). These notifications are [documented at Microsoft Docs](https://learn.microsoft.com/windows/win32/controls/bumper-list-view-control-reference-notifications). Microsoft Docs does not show the numeric value of each notification code; those can be found in the Windows SDK or by searching the Internet.

<a id="IL"></a>
## ImageLists

An Image-List is a group of identically sized icons stored in memory. Upon creation, each ImageList is empty. The script calls [IL_Add](#IL_Add) repeatedly to add icons to the list, and each icon is assigned a sequential number starting at 1. This is the number to which the script refers to display a particular icon in a row or column header. Here is a working example that demonstrates how to put icons into a ListView's rows:

```ahk
MyGui := Gui()  ; Create a Gui window.
LV := MyGui.Add("ListView", "h200 w180", ["Icon & Number", "Description"])  ; Create a ListView.
ImageListID := IL_Create(10)  ; Create an ImageList to hold 10 small icons.
LV.SetImageList(ImageListID)  ; Assign the above ImageList to the current ListView.
Loop 10  ; Load the ImageList with a series of icons from the DLL.
    IL_Add(ImageListID, "shell32.dll", A_Index)
Loop 10  ; Add rows to the ListView (for demonstration purposes, one for each icon).
    LV.Add("Icon" . A_Index, A_Index, "n/a")
MyGui.Show()
```

ImageList functions:

- [IL_Create](#IL_Create): Creates a new ImageList that is initially empty.
- [IL_Add](#IL_Add): Adds an icon or picture to the specified ImageList.
- [IL_Destroy](#IL_Destroy): Deletes the specified ImageList.

<a id="IL_Create"></a>
### IL_Create

Creates a new ImageList that is initially empty.

```ahk
ImageListID := IL_Create(InitialCount, GrowCount, LargeIcons)
```

<a id="IL_Create_Parameters"></a>
#### Parameters

**InitialCount**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 2. Otherwise, specify the number of icons you expect to put into the list immediately.

**GrowCount**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 5. Otherwise, specify the number of icons by which the list will grow each time it exceeds the current list capacity.

**LargeIcons**

Type: [Boolean](../Concepts.md#boolean)

If omitted, it defaults to false.

If **false**, the ImageList will contain small icons.

If **true**, the ImageList will contain large icons.

Icons added to the list are scaled automatically to conform to the system's dimensions for small and large icons.

<a id="IL_Create_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

On success, this function returns the unique ID of the newly created ImageList. On failure, it returns 0.

<a id="IL_Add"></a>
### IL_Add

Adds an icon or picture to the specified ImageList.

```ahk
IconIndex := IL_Add(ImageListID, IconFileName , IconNumber)
IconIndex := IL_Add(ImageListID, PicFileName, MaskColor, Resize)
```

<a id="IL_Add_Parameters"></a>
#### Parameters

**ImageListID**

Type: [Integer](../Concepts.md#numbers)

The ID number returned from a previous call to [IL_Create](#IL_Create).

**IconFileName**

Type: [String](../Concepts.md#strings)

The name of an icon (.ICO), cursor (.CUR), or animated cursor (.ANI) file (animated cursors will not actually be animated when displayed in a ListView), or an [icon handle](../misc/ImageHandles.md) such as `"HICON:" handle`. Other sources of icons include the following types of files: EXE, DLL, CPL, SCR, and other types that contain icon resources.

**IconNumber**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1 (the first icon group). Otherwise, specify the number of the icon group to be used in the file. If the number is negative, its absolute value is assumed to be the resource ID of an icon within an executable file. In the following example, the default icon from the second icon group would be used: `IL_Add(ImageListID, "C:\My Application.exe", 2)`.

**PicFileName**

Type: [String](../Concepts.md#strings)

The name of a non-icon image such as BMP, GIF, JPG, PNG, TIF, Exif, WMF, and EMF, or a [bitmap handle](../misc/ImageHandles.md) such as `"HBITMAP:" handle`.

**MaskColor**

Type: [Integer](../Concepts.md#numbers)

The mask/transparency color number. 0xFFFFFF (the color white) might be best for most pictures.

**Resize**

Type: [Boolean](../Concepts.md#boolean)

If **true**, the picture is scaled to become a single icon.

If **false**, the picture is divided up into however many icons can fit into its actual width.

<a id="IL_Add_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

On success, this function returns the new icon's index (1 is the first icon, 2 is the second, and so on). On failure, it returns 0.

<a id="IL_Destroy"></a>
### IL_Destroy

Deletes the specified ImageList.

```ahk
IsDestroyed := IL_Destroy(ImageListID)
```

<a id="IL_Destroy_Parameters"></a>
#### Parameters

**ImageListID**

Type: [Integer](../Concepts.md#numbers)

The ID number returned from a previous call to [IL_Create](#IL_Create).

<a id="IL_Destroy_Return_Value"></a>
#### Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

On success, this function returns 1 (true). On failure, it returns 0 (false).

<a id="IL_Destroy_Remarks"></a>
#### Remarks

It is normally not necessary to destroy ImageLists because once attached to a ListView, they are destroyed automatically when the ListView or its parent window is destroyed. However, if the ListView shares ImageLists with other ListViews (by having 0x40 in *Options*), the script should explicitly destroy the ImageList after destroying all the ListViews that use it. Similarly, if the script replaces one of a ListView's old ImageLists with a new one, it should explicitly destroy the old one.

<a id="Remarks"></a>
## Remarks

After a column is sorted -- either by means of the user clicking its header or the script calling `LV.ModifyCol(1, "Sort")` -- any subsequently added rows will appear at the bottom of the list rather than obeying the sort order. The exception to this is the [Sort](#Sort) and [SortDesc](#SortDesc) styles, which move newly added rows into the correct positions.

<a id="Enter"></a>

To detect when the user has pressed `Enter` while a ListView has focus, use a [default button](GuiControls.md#DefaultButton) (which can be hidden if desired). For example:

```ahk
MyGui.Add("Button", "Hidden Default", "OK").OnEvent("Click", LV_Enter)
...
LV_Enter(*) {
    global
    if MyGui.FocusedCtrl != LV
        return
    MsgBox("Enter was pressed. The focused row number is " LV.GetNext(0, "Focused"))
}
```

In addition to navigating from row to row with the keyboard, the user may also perform incremental search by typing the first few characters of an item in the first column. This causes the selection to jump to the nearest matching row.

Although any length of text can be stored in each field of a ListView, only the first 260 characters are displayed.

Although the maximum number of rows in a ListView is limited only by available system memory, row-adding performance can be greatly improved as described in the [Count](#Count) option.

A picture may be used as a background around a ListView (that is, to frame the ListView). To do this, create the [picture control](GuiControls.md#Picture) after the ListView and include 0x4000000 (which is WS_CLIPSIBLINGS) in the picture's *Options*.

A script may create more than one ListView per window.

It is best not to insert or delete columns directly with [SendMessage](SendMessage.md). This is because the program maintains a collection of [sorting preferences](#Integer) for each column, which would then get out of sync. Instead, use the [built-in column methods](#BuiltIn).

To perform actions such as resizing, hiding, or changing the font of a ListView, see the [GuiControl](GuiControl.md) object.

To extract text from external ListViews (those not owned by the script), use [ListViewGetContent](ListViewGetContent.md).

<a id="Related"></a>
## Related

[TreeView](TreeView.md), [Other Control Types](GuiControls.md), [Gui()](Gui.md#Call), [ContextMenu event](GuiOnEvent.md#ContextMenu), [Gui object](Gui.md), [GuiControl object](GuiControl.md), [ListView styles table](../misc/Styles.md#ListView)

<a id="Examples"></a>
## Examples

<a id="ExAllRows"></a>

**Example:** Selects or de-selects all rows by specifying 0 as the row number.

```ahk
LV.Modify(0, "Select")   ; Select all.
LV.Modify(0, "-Select")  ; De-select all.
LV.Modify(0, "-Check")  ; Uncheck all the checkboxes.
```

<a id="ExAutoSize"></a>

**Example:** Auto-sizes all columns to fit their contents.

```ahk
LV.ModifyCol()  ; There are no parameters in this mode.
```

<a id="ExAdvanced"></a>

**Example:** The following is a working script that is more elaborate than the one near the top of this page. It displays the files in a folder chosen by the user, with each file assigned the icon associated with its type. The user can double-click a file, or right-click one or more files to display a context menu.

```ahk
; Create a GUI window:
MyGui := Gui("+Resize")  ; Allow the user to maximize or drag-resize the window.

; Create some buttons:
B1 := MyGui.Add("Button", "Default", "Load a folder")
B2 := MyGui.Add("Button", "x+20", "Clear List")
B3 := MyGui.Add("Button", "x+20", "Switch View")

; Create the ListView and its columns:
LV := MyGui.Add("ListView", "xm r20 w700", ["Name", "In Folder", "Size (KB)", "Type"])
LV.ModifyCol(3, "Integer")  ; For sorting, indicate that the Size column is an integer.

; Create an ImageList so that the ListView can display some icons:
ImageListID1 := IL_Create(10)
ImageListID2 := IL_Create(10, 10, true)  ; A list of large icons to go with the small ones.

; Attach the ImageLists to the ListView so that it can later display the icons:
LV.SetImageList(ImageListID1)
LV.SetImageList(ImageListID2)

; Apply control events:
LV.OnEvent("DoubleClick", RunFile)
LV.OnEvent("ContextMenu", ShowContextMenu)
B1.OnEvent("Click", LoadFolder)
B2.OnEvent("Click", (*) => LV.Delete())
B3.OnEvent("Click", SwitchView)

; Apply window events:
MyGui.OnEvent("Size", Gui_Size)

; Create a popup menu to be used as the context menu:
ContextMenu := Menu()
ContextMenu.Add("Open", ContextOpenOrProperties)
ContextMenu.Add("Properties", ContextOpenOrProperties)
ContextMenu.Add("Clear from ListView", ContextClearRows)
ContextMenu.Default := "Open"  ; Make "Open" a bold font to indicate that double-click does the same thing.

; Display the window:
MyGui.Show()

LoadFolder(*)
{
    static IconMap := Map()
    MyGui.Opt("+OwnDialogs")  ; Forces user to dismiss the following dialog before using main window.
    Folder := DirSelect(, 3, "Select a folder to read:")
    if not Folder  ; The user canceled the dialog.
        return

    ; Check if the last character of the folder name is a backslash, which happens for root
    ; directories such as C:\. If it is, remove it to prevent a double-backslash later on.
    if SubStr(Folder, -1, 1) = "\"
        Folder := SubStr(Folder, 1, -1)  ; Remove the trailing backslash.

    ; Calculate buffer size required for SHFILEINFO structure.
    sfi_size := A_PtrSize + 688
    sfi := Buffer(sfi_size)

    ; Gather a list of file names from the selected folder and append them to the ListView:
    LV.Opt("-Redraw")  ; Improve performance by disabling redrawing during load.
    Loop Files, Folder "\*.*"
    {
        FileName := A_LoopFilePath  ; Must save it to a writable variable for use below.

        ; Build a unique extension ID to avoid characters that are illegal in variable names,
        ; such as dashes. This unique ID method also performs better because finding an item
        ; in the array does not require search-loop.
        SplitPath(FileName,,, &FileExt)  ; Get the file's extension.
        if FileExt ~= "i)\A(EXE|ICO|ANI|CUR)\z"
        {
            ExtID := FileExt  ; Special ID as a placeholder.
            IconNumber := 0  ; Flag it as not found so that these types can each have a unique icon.
        }
        else  ; Some other extension/file-type, so calculate its unique ID.
        {
            ExtID := 0  ; Initialize to handle extensions that are shorter than others.
            Loop 7     ; Limit the extension to 7 characters so that it fits in a 64-bit value.
            {
                ExtChar := SubStr(FileExt, A_Index, 1)
                if not ExtChar  ; No more characters.
                    break
                ; Derive a Unique ID by assigning a different bit position to each character:
                ExtID := ExtID | (Ord(ExtChar) << (8 * (A_Index - 1)))
            }
            ; Check if this file extension already has an icon in the ImageLists. If it does,
            ; several calls can be avoided and loading performance is greatly improved,
            ; especially for a folder containing hundreds of files:
            IconNumber := IconMap.Has(ExtID) ? IconMap[ExtID] : 0
        }
        if not IconNumber  ; There is not yet any icon for this extension, so load it.
        {
            ; Get the high-quality small-icon associated with this file extension:
            if not DllCall("Shell32\SHGetFileInfoW", "Str", FileName
            , "Uint", 0, "Ptr", sfi, "UInt", sfi_size, "UInt", 0x101)  ; 0x101 is SHGFI_ICON+SHGFI_SMALLICON
                IconNumber := 9999999  ; Set it out of bounds to display a blank icon.
            else ; Icon successfully loaded.
            {
                ; Extract the hIcon member from the structure:
                hIcon := NumGet(sfi, 0, "Ptr")
                ; Add the HICON directly to the small-icon and large-icon lists.
                ; Below uses +1 to convert the returned index from zero-based to one-based:
                IconNumber := DllCall("ImageList_ReplaceIcon", "Ptr", ImageListID1, "Int", -1, "Ptr", hIcon) + 1
                DllCall("ImageList_ReplaceIcon", "Ptr", ImageListID2, "Int", -1, "Ptr", hIcon)
                ; Now that it's been copied into the ImageLists, the original should be destroyed:
                DllCall("DestroyIcon", "Ptr", hIcon)
                ; Cache the icon to save memory and improve loading performance:
                IconMap[ExtID] := IconNumber
            }
        }

        ; Create the new row in the ListView and assign it the icon number determined above:
        LV.Add("Icon" . IconNumber, A_LoopFileName, A_LoopFileDir, A_LoopFileSizeKB, FileExt)
    }
    LV.Opt("+Redraw")  ; Re-enable redrawing (it was disabled above).
    LV.ModifyCol()  ; Auto-size each column to fit its contents.
    LV.ModifyCol(3, 60)  ; Make the Size column at little wider to reveal its header.
}

SwitchView(*)
{
    static IconView := false
    if not IconView
        LV.Opt("+Icon")        ; Switch to icon view.
    else
        LV.Opt("+Report")      ; Switch back to details view.
    IconView := not IconView   ; Invert in preparation for next time.
}

RunFile(LV, RowNumber)
{
    FileName := LV.GetText(RowNumber, 1) ; Get the text of the first field.
    FileDir := LV.GetText(RowNumber, 2)  ; Get the text of the second field.
    try
        Run(FileDir "\" FileName)
    catch
        MsgBox("Could not open " FileDir "\" FileName ".")
}

ShowContextMenu(LV, Item, IsRightClick, X, Y)  ; In response to right-click or Apps key.
{
    ; Show the menu at the provided coordinates, X and Y.  These should be used
    ; because they provide correct coordinates even if the user pressed the Apps key:
    ContextMenu.Show(X, Y)
}

ContextOpenOrProperties(ItemName, *)  ; The user selected "Open" or "Properties" in the context menu.
{
    ; For simplicitly, operate upon only the focused row rather than all selected rows:
    FocusedRowNumber := LV.GetNext(0, "F")  ; Find the focused row.
    if not FocusedRowNumber  ; No row is focused.
        return
    FileName := LV.GetText(FocusedRowNumber, 1) ; Get the text of the first field.
    FileDir := LV.GetText(FocusedRowNumber, 2)  ; Get the text of the second field.
    try
    {
        if (ItemName = "Open")  ; User selected "Open" from the context menu.
            Run(FileDir "\" FileName)
        else
            Run("properties " FileDir "\" FileName)
    }
    catch
        MsgBox("Could not perform requested action on " FileDir "\" FileName ".")
}

ContextClearRows(*)  ; The user selected "Clear" in the context menu.
{
    RowNumber := 0  ; This causes the first iteration to start the search at the top.
    Loop
    {
        ; Since deleting a row reduces the RowNumber of all other rows beneath it,
        ; subtract 1 so that the search includes the same row number that was previously
        ; found (in case adjacent rows are selected):
        RowNumber := LV.GetNext(RowNumber - 1)
        if not RowNumber  ; The above returned zero, so there are no more selected rows.
            break
        LV.Delete(RowNumber)  ; Clear the row from the ListView.
    }
}

Gui_Size(thisGui, MinMax, Width, Height)  ; Expand/Shrink ListView in response to the user's resizing.
{
    if MinMax = -1  ; The window has been minimized. No action needed.
        return
    ; Otherwise, the window has been resized or maximized. Resize the ListView to match.
    LV.Move(,, Width - 20, Height - 40)
}
```
