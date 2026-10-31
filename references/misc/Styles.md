# Window and Control Styles

This page lists some styles and extended styles which can be set or retrieved with the methods [Gui.Opt](../lib/Gui.md#Opt) and [GuiControl.Opt](../lib/GuiControl.md#Opt), and with the built-in functions [WinSetStyle](../lib/WinSetStyle.md), [WinSetExStyle](../lib/WinSetStyle.md), [WinGetStyle](../lib/WinGetStyle.md), [WinGetExStyle](../lib/WinGetStyle.md), [ControlSetStyle](../lib/ControlSetStyle.md), [ControlSetExStyle](../lib/ControlSetStyle.md), [ControlGetStyle](../lib/ControlGetStyle.md) and [ControlGetExStyle](../lib/ControlGetStyle.md).

<a id="toc"></a>
## Table of Contents

- [Styles Common to Gui/Parent Windows and Most Control Types](#Common)
- [Text](#Text) | [Edit](#Edit) | [UpDown](#UpDown) | [Picture](#Pic) | [Link](#Link)
- [Button | CheckBox | Radio | GroupBox](#Button)
- [DropDownList | ComboBox](#DDL)
- [ListBox](#ListBox) | [ListView](#ListView) | [TreeView](#TreeView)
- [DateTime](#DateTime) | [MonthCal](#MonthCal)
- [Slider](#Slider) | [Progress](#Progress) | [Tab](#Tab) | [StatusBar](#StatusBar)

<a id="Common"></a>
## Common Styles

By default, a GUI window uses [WS_POPUP](#WS_POPUP), [WS_CAPTION](#WS_CAPTION), [WS_SYSMENU](#WS_SYSMENU), and [WS_MINIMIZEBOX](#WS_MINIMIZEBOX). For a GUI window, [WS_CLIPSIBLINGS](#WS_CLIPSIBLINGS) is always enabled and cannot be disabled.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="WS_BORDER"></a>WS_BORDER | 0x800000 | +/-Border. Creates a window that has a thin-line border. |
| <a id="WS_POPUP"></a>WS_POPUP | 0x80000000 | Creates a pop-up window. This style cannot be used with the [WS_CHILD](#WS_CHILD) style. |
| <a id="WS_CAPTION"></a>WS_CAPTION | 0xC00000 | +/-Caption. Creates a window that has a title bar. This style is a numerical combination of [WS_BORDER](#WS_BORDER) and [WS_DLGFRAME](#WS_DLGFRAME). |
| <a id="WS_CLIPSIBLINGS"></a>WS_CLIPSIBLINGS | 0x4000000 | Clips child windows relative to each other; that is, when a particular child window receives a WM_PAINT message, the WS_CLIPSIBLINGS style clips all other overlapping child windows out of the region of the child window to be updated. If WS_CLIPSIBLINGS is not specified and child windows overlap, it is possible, when drawing within the client area of a child window, to draw within the client area of a neighboring child window. |
| <a id="WS_DISABLED"></a>WS_DISABLED | 0x8000000 | +/-Disabled. Creates a window that is initially disabled. |
| <a id="WS_DLGFRAME"></a>WS_DLGFRAME | 0x400000 | Creates a window that has a border of a style typically used with dialog boxes. |
| <a id="WS_GROUP"></a>WS_GROUP | 0x20000 | +/-Group. Indicates that this control is the first one in a group of controls. This style is automatically applied to manage the "only one at a time" behavior of radio buttons. In the rare case where two groups of radio buttons are added consecutively (with no other control types in between them), this style may be applied manually to the first control of the second radio group, which splits it off from the first. |
| <a id="WS_HSCROLL"></a>WS_HSCROLL | 0x100000 | Creates a window that has a horizontal scroll bar. |
| <a id="WS_MAXIMIZE"></a>WS_MAXIMIZE | 0x1000000 | Creates a window that is initially maximized. |
| <a id="WS_MAXIMIZEBOX"></a>WS_MAXIMIZEBOX | 0x10000 | +/-MaximizeBox. Creates a window that has a maximize button. Cannot be combined with the WS_EX_CONTEXTHELP style. The [WS_SYSMENU](#WS_SYSMENU) style must also be specified. |
| <a id="WS_MINIMIZE"></a>WS_MINIMIZE | 0x20000000 | Creates a window that is initially minimized. |
| <a id="WS_MINIMIZEBOX"></a>WS_MINIMIZEBOX | 0x20000 | +/-MinimizeBox. Creates a window that has a minimize button. Cannot be combined with the WS_EX_CONTEXTHELP style. The [WS_SYSMENU](#WS_SYSMENU) style must also be specified. |
| <a id="WS_OVERLAPPED"></a>WS_OVERLAPPED | 0x0 | Creates an overlapped window. An overlapped window has a title bar and a border. Same as the WS_TILED style. |
| <a id="WS_OVERLAPPEDWINDOW"></a>WS_OVERLAPPEDWINDOW | 0xCF0000 | Creates an overlapped window with the [WS_OVERLAPPED](#WS_OVERLAPPED), [WS_CAPTION](#WS_CAPTION), [WS_SYSMENU](#WS_SYSMENU), [WS_THICKFRAME](#WS_THICKFRAME), [WS_MINIMIZEBOX](#WS_MINIMIZEBOX), and [WS_MAXIMIZEBOX](#WS_MAXIMIZEBOX) styles. Same as the WS_TILEDWINDOW style. |
| <a id="WS_POPUPWINDOW"></a>WS_POPUPWINDOW | 0x80880000 | Creates a pop-up window with [WS_BORDER](#WS_BORDER), [WS_POPUP](#WS_POPUP), and [WS_SYSMENU](#WS_SYSMENU) styles. The [WS_CAPTION](#WS_CAPTION) and [WS_POPUPWINDOW](#WS_POPUPWINDOW) styles must be combined to make the window menu visible. |
| <a id="WS_SIZEBOX"></a>WS_SIZEBOX | 0x40000 | +/-Resize. Creates a window that has a sizing border. Same as the [WS_THICKFRAME](#WS_THICKFRAME) style. |
| <a id="WS_SYSMENU"></a>WS_SYSMENU | 0x80000 | +/-SysMenu. Creates a window that has a window menu on its title bar. The [WS_CAPTION](#WS_CAPTION) style must also be specified. |
| <a id="WS_TABSTOP"></a>WS_TABSTOP | 0x10000 | +/-Tabstop. Specifies a control that can receive the keyboard focus when the user presses `Tab`. Pressing `Tab` changes the keyboard focus to the next control with the WS_TABSTOP style. |
| <a id="WS_THICKFRAME"></a>WS_THICKFRAME | 0x40000 | Creates a window that has a sizing border. Same as the [WS_SIZEBOX](#WS_SIZEBOX) style. |
| <a id="WS_VSCROLL"></a>WS_VSCROLL | 0x200000 | Creates a window that has a vertical scroll bar. |
| <a id="WS_VISIBLE"></a>WS_VISIBLE | 0x10000000 | Creates a window that is initially visible. |
| <a id="WS_CHILD"></a>WS_CHILD | 0x40000000 | Creates a child window. A window with this style cannot have a menu bar. This style cannot be used with the [WS_POPUP](#WS_POPUP) style. |

<a id="Text"></a>
## Text Control Styles

These styles affect the [Text](../lib/GuiControls.md#Text) control. It has neither default styles nor forced styles.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="SS_BLACKFRAME"></a>SS_BLACKFRAME | 0x7 | Specifies a box with a frame drawn in the same color as the window frames. This color is black in the default color scheme. |
| <a id="SS_BLACKRECT"></a>SS_BLACKRECT | 0x4 | Specifies a rectangle filled with the current window frame color. This color is black in the default color scheme. |
| <a id="SS_CENTER"></a>SS_CENTER | 0x1 | +/-Center. Specifies a simple rectangle and centers the text in the rectangle. The control automatically wraps words that extend past the end of a line to the beginning of the next centered line. |
| SS_CENTERIMAGE | 0x200 | If the control contains a single line of text, the text is centered vertically within the available height of the control. |
| <a id="SS_ETCHEDFRAME"></a>SS_ETCHEDFRAME | 0x12 | Draws the frame of the static control using the EDGE_ETCHED edge style. |
| <a id="SS_ETCHEDHORZ"></a>SS_ETCHEDHORZ | 0x10 | Draws the top and bottom edges of the static control using the EDGE_ETCHED edge style. |
| <a id="SS_ETCHEDVERT"></a>SS_ETCHEDVERT | 0x11 | Draws the left and right edges of the static control using the EDGE_ETCHED edge style. |
| <a id="SS_GRAYFRAME"></a>SS_GRAYFRAME | 0x8 | Specifies a box with a frame drawn with the same color as the screen background (desktop). This color is gray in the default color scheme. |
| <a id="SS_GRAYRECT"></a>SS_GRAYRECT | 0x5 | Specifies a rectangle filled with the current screen background color. This color is gray in the default color scheme. |
| <a id="SS_LEFT"></a>SS_LEFT | 0x0 | +/-Left. This is the default. It specifies a simple rectangle and left-aligns the text in the rectangle. The text is formatted before it is displayed. Words that extend past the end of a line are automatically wrapped to the beginning of the next left-aligned line. Words that are longer than the width of the control are truncated. |
| <a id="SS_LEFTNOWORDWRAP"></a>SS_LEFTNOWORDWRAP | 0xC | +/-Wrap. Specifies a rectangle and left-aligns the text in the rectangle. Tabs are expanded, but words are not wrapped. Text that extends past the end of a line is clipped. |
| <a id="SS_NOPREFIX"></a>SS_NOPREFIX | 0x80 | Prevents interpretation of any ampersand (&) characters in the control's text as accelerator prefix characters. This can be useful when file names or other strings that might contain an ampersand (&) must be displayed within a text control. |
| <a id="SS_NOTIFY"></a>SS_NOTIFY | 0x100 | Sends the parent window the STN_CLICKED notification when the user clicks the control. |
| <a id="SS_RIGHT"></a>SS_RIGHT | 0x2 | +/-Right. Specifies a rectangle and right-aligns the specified text in the rectangle. |
| <a id="SS_SUNKEN"></a>SS_SUNKEN | 0x1000 | Draws a half-sunken border around a static control. |
| <a id="SS_WHITEFRAME"></a>SS_WHITEFRAME | 0x9 | Specifies a box with a frame drawn with the same color as the window background. This color is white in the default color scheme. |
| <a id="SS_WHITERECT"></a>SS_WHITERECT | 0x6 | Specifies a rectangle filled with the current window background color. This color is white in the default color scheme. |

<a id="Edit"></a>
## Edit Control Styles

These styles affect the [Edit](../lib/GuiControls.md#Edit) control. By default, it uses [WS_TABSTOP](#WS_TABSTOP) and WS_EX_CLIENTEDGE (extended style E0x200). It has no forced styles.

If an Edit control is auto-detected as multi-line due to its starting contents containing multiple lines, its height being taller than 1 row, or its row-count having been explicitly specified as greater than 1, the following styles will be applied by default: [WS_VSCROLL](#WS_VSCROLL), [ES_WANTRETURN](#ES_WANTRETURN), and [ES_AUTOVSCROLL](#ES_AUTOVSCROLL).

If an Edit control is auto-detected as a single line, it defaults to having [ES_AUTOHSCROLL](#ES_AUTOHSCROLL).

| Style | Hex | Description |
| --- | --- | --- |
| <a id="ES_AUTOHSCROLL"></a>ES_AUTOHSCROLL | 0x80 | +/-Wrap for multi-line edits, and +/-Limit for single-line edits. Automatically scrolls text to the right by 10 characters when the user types a character at the end of the line. When the user presses `Enter`, the control scrolls all text back to the zero position. |
| <a id="ES_AUTOVSCROLL"></a>ES_AUTOVSCROLL | 0x40 | Scrolls text up one page when the user presses `Enter` on the last line. |
| <a id="ES_CENTER"></a>ES_CENTER | 0x1 | +/-Center. Centers text in a multiline edit control. |
| <a id="ES_LOWERCASE"></a>ES_LOWERCASE | 0x10 | +/-Lowercase. Converts all characters to lowercase as they are typed into the edit control. |
| <a id="ES_NOHIDESEL"></a>ES_NOHIDESEL | 0x100 | Negates the default behavior for an edit control. The default behavior hides the selection when the control loses the input focus and inverts the selection when the control receives the input focus. If you specify [ES_NOHIDESEL](#ES_NOHIDESEL), the selected text is inverted, even if the control does not have the focus. |
| <a id="ES_NUMBER"></a>ES_NUMBER | 0x2000 | +/-Number. Prevents the user from typing anything other than digits in the control. |
| <a id="ES_OEMCONVERT"></a>ES_OEMCONVERT | 0x400 | This style is most useful for edit controls that contain file names. |
| <a id="ES_MULTILINE"></a>ES_MULTILINE | 0x4 | +/-Multi. Designates a multiline edit control. The default is a single-line edit control. |
| <a id="ES_PASSWORD"></a>ES_PASSWORD | 0x20 | +/-Password. Displays a masking character in place of each character that is typed into the edit control, which conceals the text. |
| <a id="ES_READONLY"></a>ES_READONLY | 0x800 | +/-ReadOnly. Prevents the user from typing or editing text in the edit control. |
| <a id="ES_RIGHT"></a>ES_RIGHT | 0x2 | +/-Right. Right-aligns text in a multiline edit control. |
| <a id="ES_UPPERCASE"></a>ES_UPPERCASE | 0x8 | +/-Uppercase. Converts all characters to uppercase as they are typed into the edit control. |
| <a id="ES_WANTRETURN"></a>ES_WANTRETURN | 0x1000 | +/-WantReturn. Specifies that a carriage return be inserted when the user presses `Enter` while typing text into a multiline edit control in a dialog box. If you do not specify this style, pressing `Enter` has the same effect as pressing the dialog box's default push button. This style has no effect on a single-line edit control. |

<a id="UpDown"></a>
## UpDown Control Styles

These styles affect the [UpDown](../lib/GuiControls.md#UpDown) control. By default, it uses [UDS_ARROWKEYS](#UDS_ARROWKEYS), [UDS_ALIGNRIGHT](#UDS_ALIGNRIGHT), [UDS_SETBUDDYINT](#UDS_SETBUDDYINT), and [UDS_AUTOBUDDY](#UDS_AUTOBUDDY). It has no forced styles.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="UDS_WRAP"></a>UDS_WRAP | 0x1 | Named option "Wrap". Causes the control to wrap around to the other end of its range when the user attempts to go beyond the minimum or maximum. Without *Wrap*, the control stops when the minimum or maximum is reached. |
| <a id="UDS_SETBUDDYINT"></a>UDS_SETBUDDYINT | 0x2 | Causes the UpDown control to set the text of the buddy control (using the WM_SETTEXT message) when the position changes. However, if the buddy is a ListBox, the ListBox's current selection is changed instead. |
| <a id="UDS_ALIGNRIGHT"></a>UDS_ALIGNRIGHT | 0x4 | Named option "Right" (default). Positions UpDown on the right side of its buddy control. |
| <a id="UDS_ALIGNLEFT"></a>UDS_ALIGNLEFT | 0x8 | Named option "Left". Positions UpDown on the left side of its buddy control. |
| <a id="UDS_AUTOBUDDY"></a>UDS_AUTOBUDDY | 0x10 | Automatically selects the previous control in the z-order as the UpDown control's buddy control. |
| <a id="UDS_ARROWKEYS"></a>UDS_ARROWKEYS | 0x20 | Allows the user to press `↑` or `↓` on the keyboard to increase or decrease the UpDown control's position. |
| <a id="UDS_HORZ"></a>UDS_HORZ | 0x40 | Named option "Horz". Causes the control's arrows to point left and right instead of up and down. |
| <a id="UpDownSep"></a>UDS_NOTHOUSANDS | 0x80 | Does not insert a thousands separator between every three decimal digits in the buddy control. |
| <a id="UDS_HOTTRACK"></a>UDS_HOTTRACK | 0x100 | Causes the control to exhibit "hot tracking" behavior. That is, it highlights the control's buttons as the mouse passes over them. This flag may be ignored if the desktop theme overrides it. |

<a id="Pic"></a>
## Picture Control Styles

These styles affect the [Picture](../lib/GuiControls.md#Picture) control. It has no default styles. The style SS_ICON (for icons and cursors) or SS_BITMAP (for other image types) is always enabled and cannot be disabled.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="SS_REALSIZECONTROL"></a>SS_REALSIZECONTROL | 0x40 | Adjusts the bitmap to fit the size of the control. |
| <a id="SS_CENTERIMAGE"></a>SS_CENTERIMAGE | 0x200 | Centers the bitmap in the control. If the bitmap is too large, it will be clipped. |

<a id="Button"></a>
## Button, CheckBox, Radio, and GroupBox Control Styles

These styles affect the [Button](../lib/GuiControls.md#Button), [CheckBox](../lib/GuiControls.md#CheckBox), [Radio](../lib/GuiControls.md#Radio), or [GroupBox](../lib/GuiControls.md#GroupBox) controls.

By default, each of these controls except GroupBox uses the styles [BS_MULTILINE](#BS_MULTILINE) (unless it has no explicitly set width or height, nor any CR/LF characters in their text) and [WS_TABSTOP](#WS_TABSTOP) (however, Radio controls other than the first of each radio group lack WS_TABSTOP).

The following styles are always enabled and cannot be disabled:

- Button: [BS_PUSHBUTTON](#BS_PUSHBUTTON) or [BS_DEFPUSHBUTTON](#BS_DEFPUSHBUTTON)
- CheckBox: [BS_AUTOCHECKBOX](#BS_AUTOCHECKBOX) or [BS_AUTO3STATE](#BS_AUTO3STATE)
- Radio: [BS_AUTORADIOBUTTON](#BS_AUTORADIOBUTTON)
- GroupBox: [BS_GROUPBOX](#BS_GROUPBOX)

| Style | Hex | Description |
| --- | --- | --- |
| <a id="BS_AUTO3STATE"></a>BS_AUTO3STATE | 0x6 | Creates a button that is the same as a three-state check box, except that the box changes its state when the user selects it. The state cycles through checked, indeterminate, and cleared. |
| <a id="BS_AUTOCHECKBOX"></a>BS_AUTOCHECKBOX | 0x3 | Creates a button that is the same as a check box, except that the check state automatically toggles between checked and cleared each time the user selects the check box. |
| <a id="BS_AUTORADIOBUTTON"></a>BS_AUTORADIOBUTTON | 0x9 | Creates a button that is the same as a radio button, except that when the user selects it, the system automatically sets the button's check state to checked and automatically sets the check state for all other buttons in the same group to cleared. |
| <a id="BS_LEFT"></a>BS_LEFT | 0x100 | +/-Left. Left-aligns the text. |
| <a id="BS_PUSHBUTTON"></a>BS_PUSHBUTTON | 0x0 | Creates a push button that posts a WM_COMMAND message to the owner window when the user selects the button. |
| <a id="BS_PUSHLIKE"></a>BS_PUSHLIKE | 0x1000 | Makes a checkbox or radio button look and act like a push button. The button looks raised when it isn't pushed or checked, and sunken when it is pushed or checked. |
| <a id="BS_RIGHT"></a>BS_RIGHT | 0x200 | +/-Right. Right-aligns the text. |
| <a id="BS_RIGHTBUTTON"></a>BS_RIGHTBUTTON | 0x20 | +Right (i.e. +Right includes both [BS_RIGHT](#BS_RIGHT) and [BS_RIGHTBUTTON](#BS_RIGHTBUTTON), but -Right removes only BS_RIGHT, not BS_RIGHTBUTTON). Positions a checkbox square or radio button circle on the right side of the control's available width instead of the left. |
| <a id="BS_BOTTOM"></a>BS_BOTTOM | 0x800 | Places the text at the bottom of the control's available height. |
| <a id="BS_CENTER"></a>BS_CENTER | 0x300 | +/-Center. Centers the text horizontally within the control's available width. |
| <a id="BS_DEFPUSHBUTTON"></a>BS_DEFPUSHBUTTON | 0x1 | +/-Default. Creates a push button with a heavy black border. If the button is in a dialog box, the user can select the button by pressing `Enter`, even when the button does not have the input focus. This style is useful for enabling the user to quickly select the most likely option. |
| <a id="BS_MULTILINE"></a>BS_MULTILINE | 0x2000 | +/-Wrap. Wraps the text to multiple lines if the text is too long to fit on a single line in the control's available width. This also allows linefeed (\`n) to start new lines of text. |
| <a id="BS_NOTIFY"></a>BS_NOTIFY | 0x4000 | Enables a button to send BN_KILLFOCUS and BN_SETFOCUS notification codes to its parent window. Note that buttons send the BN_CLICKED notification code regardless of whether it has this style. To get BN_DBLCLK notification codes, the button must have the BS_RADIOBUTTON or BS_OWNERDRAW style. |
| <a id="BS_TOP"></a>BS_TOP | 0x400 | Places text at the top of the control's available height. |
| <a id="BS_VCENTER"></a>BS_VCENTER | 0xC00 | Vertically centers text in the control's available height. |
| <a id="BS_FLAT"></a>BS_FLAT | 0x8000 | Specifies that the button is two-dimensional; it does not use the default shading to create a 3-D effect. |
| <a id="BS_GROUPBOX"></a>BS_GROUPBOX | 0x7 | Creates a rectangle in which other controls can be grouped. Any text associated with this style is displayed in the rectangle's upper left corner. |

<a id="DDL"></a>
## DropDownList and ComboBox Control Styles

These styles affect the [DropDownList](../lib/GuiControls.md#DropDownList) and [ComboBox](../lib/GuiControls.md#ComboBox) controls.

By default, each of these controls uses [WS_TABSTOP](#WS_TABSTOP). In addition, a DropDownList control uses [WS_VSCROLL](#WS_VSCROLL), and a ComboBox control uses [WS_VSCROLL](#WS_VSCROLL) and [CBS_AUTOHSCROLL](#CBS_AUTOHSCROLL).

The following styles are always enabled and cannot be disabled:

- DropDownList: [CBS_DROPDOWNLIST](#CBS_DROPDOWNLIST)
- ComboBox: Either [CBS_DROPDOWN](#CBS_DROPDOWN) or [CBS_SIMPLE](#CBS_SIMPLE)

| Style | Hex | Description |
| --- | --- | --- |
| <a id="CBS_AUTOHSCROLL"></a>CBS_AUTOHSCROLL | 0x40 | +/-Limit. Automatically scrolls the text in an edit control to the right when the user types a character at the end of the line. If this style is not set, only text that fits within the rectangular boundary is enabled. |
| <a id="CBS_DISABLENOSCROLL"></a>CBS_DISABLENOSCROLL | 0x800 | Shows a disabled vertical scroll bar in the drop-down list when it does not contain enough items to scroll. Without this style, the scroll bar is hidden when the drop-down list does not contain enough items. |
| <a id="CBS_DROPDOWN"></a>CBS_DROPDOWN | 0x2 | Similar to [CBS_SIMPLE](#CBS_SIMPLE), except that the list box is not displayed unless the user selects an icon next to the edit control. |
| <a id="CBS_DROPDOWNLIST"></a>CBS_DROPDOWNLIST | 0x3 | Similar to [CBS_DROPDOWN](#CBS_DROPDOWN), except that the edit control is replaced by a static text item that displays the current selection in the list box. |
| <a id="CBS_LOWERCASE"></a>CBS_LOWERCASE | 0x4000 | +/-Lowercase. Converts to lowercase any uppercase characters that are typed into the edit control of a combo box. |
| <a id="CBS_NOINTEGRALHEIGHT"></a>CBS_NOINTEGRALHEIGHT | 0x400 | Specifies that the combo box will be exactly the size specified by the application when it created the combo box. Usually, Windows CE sizes a combo box so that it does not display partial items. |
| <a id="CBS_OEMCONVERT"></a>CBS_OEMCONVERT | 0x80 | Converts text typed in the combo box edit control from the Windows CE character set to the OEM character set and then back to the Windows CE set. This style is most useful for combo boxes that contain file names. It applies only to combo boxes created with the [CBS_DROPDOWN](#CBS_DROPDOWN) style. |
| <a id="CBS_SIMPLE"></a>CBS_SIMPLE | 0x1 | +/-Simple (ComboBox only). Displays the drop-down list at all times. The current selection in the list is displayed in the edit control. |
| <a id="CBS_SORT"></a>CBS_SORT | 0x100 | +/-Sort. Sorts the items in the drop-list alphabetically. |
| <a id="CBS_UPPERCASE"></a>CBS_UPPERCASE | 0x2000 | +/-Uppercase. Converts to uppercase any lowercase characters that are typed into the edit control of a ComboBox. |

<a id="ListBox"></a>
## ListBox Control Styles

These styles affect the [ListBox](../lib/GuiControls.md#ListBox) control. By default, it uses [WS_TABSTOP](#WS_TABSTOP), [LBS_USETABSTOPS](#LBS_USETABSTOPS), [WS_VSCROLL](#WS_VSCROLL), and WS_EX_CLIENTEDGE (extended style E0x200). The style [LBS_NOTIFY](#LBS_NOTIFY) (supports detection of double-clicks) is always enabled and cannot be disabled.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="LBS_DISABLENOSCROLL"></a>LBS_DISABLENOSCROLL | 0x1000 | Shows a disabled vertical scroll bar for the list box when the box does not contain enough items to scroll. If you do not specify this style, the scroll bar is hidden when the list box does not contain enough items. |
| <a id="LBS_NOINTEGRALHEIGHT"></a>LBS_NOINTEGRALHEIGHT | 0x100 | Specifies that the list box will be exactly the size specified by the application when it created the list box. |
| <a id="LBS_EXTENDEDSEL"></a>LBS_EXTENDEDSEL | 0x800 | +/-Multi. Allows multiple selections via control-click and shift-click. |
| <a id="LBS_MULTIPLESEL"></a>LBS_MULTIPLESEL | 0x8 | A simplified version of multi-select in which control-click and shift-click are not necessary because normal left clicks serve to extend the selection or de-select a selected item. |
| <a id="LBS_NOSEL"></a>LBS_NOSEL | 0x4000 | +/-ReadOnly. Specifies that the user can view list box strings but cannot select them. |
| <a id="LBS_NOTIFY"></a>LBS_NOTIFY | 0x1 | Causes the list box to send a notification code to the parent window whenever the user clicks a list box item (LBN_SELCHANGE), double-clicks an item (LBN_DBLCLK), or cancels the selection (LBN_SELCANCEL). |
| <a id="LBS_SORT"></a>LBS_SORT | 0x2 | +/-Sort. Sorts the items in the list box alphabetically. |
| <a id="LBS_USETABSTOPS"></a>LBS_USETABSTOPS | 0x80 | Enables a ListBox to recognize and expand tab characters when drawing its strings. The default tab positions are 32 dialog box units apart. A dialog box unit is equal to one-fourth of the current dialog box base-width unit. |

<a id="ListView"></a>
## ListView Control Styles

These styles affect the [ListView](../lib/ListView.md) control. By default, it uses [WS_TABSTOP](#WS_TABSTOP), [LVS_REPORT](#LVS_REPORT), [LVS_SHOWSELALWAYS](#LVS_SHOWSELALWAYS), [LVS_EX_FULLROWSELECT](#LVS_EX_FULLROWSELECT), [LVS_EX_HEADERDRAGDROP](#LVS_EX_HEADERDRAGDROP), and WS_EX_CLIENTEDGE (extended style E0x200). It has no forced styles.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="LVS_ALIGNLEFT"></a>LVS_ALIGNLEFT | 0x800 | Items are left-aligned in icon and small icon view. |
| <a id="LVS_ALIGNTOP"></a>LVS_ALIGNTOP | 0x0 | Items are aligned with the top of the list-view control in icon and small icon view. This is the default. |
| <a id="LVS_AUTOARRANGE"></a>LVS_AUTOARRANGE | 0x100 | Icons are automatically kept arranged in icon and small icon view. |
| <a id="LVS_EDITLABELS"></a>LVS_EDITLABELS | 0x200 | +/-ReadOnly. Specifying **-**ReadOnly (or +0x200) allows the user to edit the first field of each row in place. |
| <a id="LVS_ICON"></a>LVS_ICON | 0x0 | +Icon. Specifies large-icon view. |
| <a id="LVS_LIST"></a>LVS_LIST | 0x3 | +List. Specifies list view. |
| <a id="LVS_NOCOLUMNHEADER"></a>LVS_NOCOLUMNHEADER | 0x4000 | +/-Hdr. Avoids displaying column headers in report view. |
| <a id="LVS_NOLABELWRAP"></a>LVS_NOLABELWRAP | 0x80 | Item text is displayed on a single line in icon view. By default, item text may wrap in icon view. |
| <a id="LVS_NOSCROLL"></a>LVS_NOSCROLL | 0x2000 | Scrolling is disabled. All items must be within the client area. This style is not compatible with the [LVS_LIST](#LVS_LIST) or [LVS_REPORT](#LVS_REPORT) styles. |
| <a id="LVS_NOSORTHEADER"></a>LVS_NOSORTHEADER | 0x8000 | +/-NoSortHdr. Column headers do not work like buttons. This style can be used if clicking a column header in report view does not carry out an action, such as sorting. |
| <a id="LVS_OWNERDATA"></a>LVS_OWNERDATA | 0x1000 | This style specifies a virtual list-view control (not directly supported by AutoHotkey). |
| <a id="LVS_OWNERDRAWFIXED"></a>LVS_OWNERDRAWFIXED | 0x400 | The owner window can paint items in report view in response to WM_DRAWITEM messages (not directly supported by AutoHotkey). |
| <a id="LVS_REPORT"></a>LVS_REPORT | 0x1 | +Report. Specifies report view. |
| <a id="LVS_SHAREIMAGELISTS"></a>LVS_SHAREIMAGELISTS | 0x40 | The [image list](../lib/ListView.md#IL) will not be deleted when the control is destroyed. This style enables the use of the same image lists with multiple list-view controls. |
| <a id="LVS_SHOWSELALWAYS"></a>LVS_SHOWSELALWAYS | 0x8 | The selection, if any, is always shown, even if the control does not have keyboard focus. |
| <a id="LVS_SINGLESEL"></a>LVS_SINGLESEL | 0x4 | +/-Multi. Only one item at a time can be selected. By default, multiple items can be selected. |
| <a id="LVS_SMALLICON"></a>LVS_SMALLICON | 0x2 | +IconSmall. Specifies small-icon view. |
| <a id="LVS_SORTASCENDING"></a>LVS_SORTASCENDING | 0x10 | +/-Sort. Rows are sorted in ascending order based on the contents of the first field. |
| <a id="LVS_SORTDESCENDING"></a>LVS_SORTDESCENDING | 0x20 | +/-SortDesc. Same as above but in descending order. |

<a id="LVS_EX"></a>

> **Extended ListView styles** require the [LV prefix](../lib/ListView.md#LVS_EX) when used with the Gui methods/properties. Some extended styles introduced in Windows XP or later versions are not listed here. For a full list, see [Microsoft Docs: Extended List-View Styles](https://learn.microsoft.com/windows/win32/controls/extended-list-view-styles).

| Extended Style | Hex | Description |
| --- | --- | --- |
| <a id="LVS_EX_BORDERSELECT"></a>LVS_EX_BORDERSELECT | LV0x8000 | When an item is selected, the border color of the item changes rather than the item being highlighted (might be non-functional in recent operating systems). |
| <a id="LVS_EX_CHECKBOXES"></a>LVS_EX_CHECKBOXES | LV0x4 | +/-Checked. Displays a checkbox with each item. When set to this style, the control creates and sets a state image list with two images using DrawFrameControl. State image 1 is the unchecked box, and state image 2 is the checked box. Setting the state image to zero removes the check box altogether.<br> Checkboxes are visible and functional with all list-view modes except the tile view mode. Clicking a checkbox in tile view mode only selects the item; the state does not change. |
| <a id="LVS_EX_DOUBLEBUFFER"></a>LVS_EX_DOUBLEBUFFER | LV0x10000 | Paints via double-buffering, which reduces flicker. This extended style also enables alpha-blended marquee selection on systems where it is supported. |
| <a id="LVS_EX_FLATSB"></a>LVS_EX_FLATSB | LV0x100 | Enables flat scroll bars in the list view. |
| <a id="LVS_EX_FULLROWSELECT"></a>LVS_EX_FULLROWSELECT | LV0x20 | When a row is selected, all its fields are highlighted. This style is available only in conjunction with the [LVS_REPORT](#LVS_REPORT) style. |
| <a id="LVS_EX_GRIDLINES"></a>LVS_EX_GRIDLINES | LV0x1 | +/-Grid. Displays gridlines around rows and columns. This style is available only in conjunction with the [LVS_REPORT](#LVS_REPORT) style. |
| <a id="LVS_EX_HEADERDRAGDROP"></a>LVS_EX_HEADERDRAGDROP | LV0x10 | Enables drag-and-drop reordering of columns in a list-view control. This style is only available to list-view controls that use the [LVS_REPORT](#LVS_REPORT) style. |
| <a id="LVS_EX_INFOTIP"></a>LVS_EX_INFOTIP | LV0x400 | When a list-view control uses this style, the LVN_GETINFOTIP notification message is sent to the parent window before displaying an item's ToolTip. |
| <a id="LVS_EX_LABELTIP"></a>LVS_EX_LABELTIP | LV0x4000 | If a partially hidden label in any list-view mode lacks ToolTip text, the list-view control will unfold the label. If this style is not set, the list-view control will unfold partly hidden labels only for the large icon mode. Note: On some versions of Windows, this style might not work properly if the GUI window is set to be always-on-top. |
| <a id="LVS_EX_MULTIWORKAREAS"></a>LVS_EX_MULTIWORKAREAS | LV0x2000 | If the list-view control has the [LVS_AUTOARRANGE](#LVS_AUTOARRANGE) style, the control will not autoarrange its icons until one or more work areas are defined (see LVM_SETWORKAREAS). To be effective, this style must be set before any work areas are defined and any items have been added to the control. |
| <a id="LVS_EX_ONECLICKACTIVATE"></a>LVS_EX_ONECLICKACTIVATE | LV0x40 | The list-view control sends an LVN_ITEMACTIVATE notification message to the parent window when the user clicks an item. This style also enables hot tracking in the list-view control. Hot tracking means that when the cursor moves over an item, it is highlighted but not selected. |
| <a id="LVS_EX_REGIONAL"></a>LVS_EX_REGIONAL | LV0x200 | Sets the list-view window region to include only the item icons and text using SetWindowRgn. Any area that is not part of an item is excluded from the window region. This style is only available to list-view controls that use the [LVS_ICON](#LVS_ICON) style. |
| <a id="LVS_EX_SIMPLESELECT"></a>LVS_EX_SIMPLESELECT | LV0x100000 | In icon view, moves the state image of the item to the top right of the large icon rendering. In views other than icon view there is no change. When the user changes the state by using the space bar, all selected items cycle over, not the item with the focus. |
| <a id="LVS_EX_SUBITEMIMAGES"></a>LVS_EX_SUBITEMIMAGES | LV0x2 | Allows images to be displayed for fields beyond the first. This style is available only in conjunction with the [LVS_REPORT](#LVS_REPORT) style. |
| <a id="LVS_EX_TRACKSELECT"></a>LVS_EX_TRACKSELECT | LV0x8 | Enables hot-track selection in a list-view control. Hot track selection means that an item is automatically selected when the cursor remains over the item for a certain period of time. The delay can be changed from the default system setting with a LVM_SETHOVERTIME message. This style applies to all styles of list-view control. You can check whether hot-track selection is enabled by calling SystemParametersInfo. |
| <a id="LVS_EX_TWOCLICKACTIVATE"></a>LVS_EX_TWOCLICKACTIVATE | LV0x80 | The list-view control sends an LVN_ITEMACTIVATE notification message to the parent window when the user double-clicks an item. This style also enables hot tracking in the list-view control. Hot tracking means that when the cursor moves over an item, it is highlighted but not selected. |
| <a id="LVS_EX_UNDERLINECOLD"></a>LVS_EX_UNDERLINECOLD | LV0x1000 | Causes those non-hot items that may be activated to be displayed with underlined text. This style requires that [LVS_EX_TWOCLICKACTIVATE](#LVS_EX_TWOCLICKACTIVATE) be set also. |
| <a id="LVS_EX_UNDERLINEHOT"></a>LVS_EX_UNDERLINEHOT | LV0x800 | Causes those hot items that may be activated to be displayed with underlined text. This style requires that [LVS_EX_ONECLICKACTIVATE](#LVS_EX_ONECLICKACTIVATE) or [LVS_EX_TWOCLICKACTIVATE](#LVS_EX_TWOCLICKACTIVATE) also be set. |

<a id="TreeView"></a>
## TreeView Control Styles

These styles affect the [TreeView](../lib/TreeView.md) control. By default, it uses [WS_TABSTOP](#WS_TABSTOP), [TVS_SHOWSELALWAYS](#TVS_SHOWSELALWAYS), [TVS_HASLINES](#TVS_HASLINES), [TVS_LINESATROOT](#TVS_LINESATROOT), [TVS_HASBUTTONS](#TVS_HASBUTTONS), and WS_EX_CLIENTEDGE (extended style E0x200). It has no forced styles.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="TVS_CHECKBOXES"></a>TVS_CHECKBOXES | 0x100 | +/-Checked. Displays a checkbox next to each item. |
| <a id="TVS_DISABLEDRAGDROP"></a>TVS_DISABLEDRAGDROP | 0x10 | Prevents the tree-view control from sending TVN_BEGINDRAG notification messages. |
| <a id="TVS_EDITLABELS"></a>TVS_EDITLABELS | 0x8 | +/-ReadOnly. Allows the user to edit the names of tree-view items. |
| <a id="TVS_FULLROWSELECT"></a>TVS_FULLROWSELECT | 0x1000 | Enables full-row selection in the tree view. The entire row of the selected item is highlighted, and clicking anywhere on an item's row causes it to be selected. This style cannot be used in conjunction with the [TVS_HASLINES](#TVS_HASLINES) style. |
| <a id="TVS_HASBUTTONS"></a>TVS_HASBUTTONS | 0x1 | +/-Buttons. Displays plus (+) and minus (-) buttons next to parent items. The user clicks the buttons to expand or collapse a parent item's list of child items. To include buttons with items at the root of the tree view, [TVS_LINESATROOT](#TVS_LINESATROOT) must also be specified. |
| <a id="TVS_HASLINES"></a>TVS_HASLINES | 0x2 | +/-Lines. Uses lines to show the hierarchy of items. |
| <a id="TVS_INFOTIP"></a>TVS_INFOTIP | 0x800 | Obtains ToolTip information by sending the TVN_GETINFOTIP notification. |
| <a id="TVS_LINESATROOT"></a>TVS_LINESATROOT | 0x4 | +/-Lines. Uses lines to link items at the root of the tree-view control. This value is ignored if [TVS_HASLINES](#TVS_HASLINES) is not also specified. |
| <a id="TVS_NOHSCROLL"></a>TVS_NOHSCROLL | 0x8000 | +/-HScroll. Disables horizontal scrolling in the control. The control will not display any horizontal scroll bars. |
| <a id="TVS_NONEVENHEIGHT"></a>TVS_NONEVENHEIGHT | 0x4000 | Sets the height of the items to an odd height with the TVM_SETITEMHEIGHT message. By default, the height of items must be an even value. |
| <a id="TVS_NOSCROLL"></a>TVS_NOSCROLL | 0x2000 | Disables both horizontal and vertical scrolling in the control. The control will not display any scroll bars. |
| <a id="TVS_NOTOOLTIPS"></a>TVS_NOTOOLTIPS | 0x80 | Disables tooltips. |
| <a id="TVS_RTLREADING"></a>TVS_RTLREADING | 0x40 | Causes text to be displayed from right-to-left (RTL). Usually, windows display text left-to-right (LTR). |
| <a id="TVS_SHOWSELALWAYS"></a>TVS_SHOWSELALWAYS | 0x20 | Causes a selected item to remain selected when the tree-view control loses focus. |
| <a id="TVS_SINGLEEXPAND"></a>TVS_SINGLEEXPAND | 0x400 | Causes the item being selected to expand and the item being unselected to collapse upon selection in the tree-view. If the user holds down `Ctrl` while selecting an item, the item being unselected will not be collapsed. |
| <a id="TVS_TRACKSELECT"></a>TVS_TRACKSELECT | 0x200 | Enables hot tracking of the mouse in a tree-view control. |

<a id="DateTime"></a>
## DateTime Control Styles

These styles affect the [DateTime](../lib/GuiControls.md#DateTime) control. By default, it uses [DTS_SHORTDATECENTURYFORMAT](#DTS_SHORTDATECENTURYFORMAT) and [WS_TABSTOP](#WS_TABSTOP). It has no forced styles.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="DTS_UPDOWN"></a>DTS_UPDOWN | 0x1 | Provides an up-down control to the right of the control to modify date-time values, which replaces the of the drop-down month calendar that would otherwise be available. |
| <a id="DTS_SHOWNONE"></a>DTS_SHOWNONE | 0x2 | +ChooseNone. Displays a checkbox inside the control that users can uncheck to make the control have no date/time selected. |
| <a id="DTS_SHORTDATEFORMAT"></a>DTS_SHORTDATEFORMAT | 0x0 | Displays the date in short format. In some locales, it looks like 6/1/05 or 6/1/2005. On older operating systems, a two-digit year might be displayed. This is why [DTS_SHORTDATECENTURYFORMAT](#DTS_SHORTDATECENTURYFORMAT) is the default and not [DTS_SHORTDATEFORMAT](#DTS_SHORTDATEFORMAT). |
| <a id="DTS_LONGDATEFORMAT"></a>DTS_LONGDATEFORMAT | 0x4 | [Format option](../lib/GuiControls.md#DateTimeFormat) "LongDate". Displays the date in long format. In some locales, it looks like Wednesday, June 01, 2005. |
| <a id="DTS_SHORTDATECENTURYFORMAT"></a>DTS_SHORTDATECENTURYFORMAT | 0xC | [Format option](../lib/GuiControls.md#DateTimeFormat) blank/omitted. Displays the date in short format with four-digit year. In some locales, it looks like 6/1/2005. If the system's version of Comctl32.dll is older than 5.8, this style is not supported and [DTS_SHORTDATEFORMAT](#DTS_SHORTDATEFORMAT) is automatically substituted. |
| <a id="DTS_TIMEFORMAT"></a>DTS_TIMEFORMAT | 0x9 | [Format option](../lib/GuiControls.md#DateTimeFormat) "Time". Displays only the time, which in some locales looks like 5:31:42 PM. |
| <a id="DTS_APPCANPARSE"></a>DTS_APPCANPARSE | 0x10 | Not yet supported. Allows the owner to parse user input and take necessary action. It enables users to edit within the client area of the control when they press `F2`. The control sends DTN_USERSTRING notification messages when users are finished. |
| <a id="DTS_RIGHTALIGN"></a>DTS_RIGHTALIGN | 0x20 | +/-Right. The calendar will drop down on the right side of the control instead of the left. |

<a id="MonthCal"></a>
## MonthCal Control Styles

These styles affect the [MonthCal](../lib/GuiControls.md#MonthCal) control. By default, it uses [WS_TABSTOP](#WS_TABSTOP). It has no forced styles.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="MCS_DAYSTATE"></a>MCS_DAYSTATE | 0x1 | Makes the control send MCN_GETDAYSTATE notifications to request information about which days should be displayed in bold. [Not yet supported] |
| <a id="MCS_MULTISELECT"></a>MCS_MULTISELECT | 0x2 | Named option "Multi". Allows the user to select a range of dates rather than being limited to a single date. By default, the maximum range is 366 days, which can be changed by sending the MCM_SETMAXSELCOUNT message to the control. For example:<br> <code>SendMessage 0x1004, 7, 0, "SysMonthCal321", MyGui ; 7 days. 0x1004 is MCM_SETMAXSELCOUNT.</code> |
| <a id="MCS_WEEKNUMBERS"></a>MCS_WEEKNUMBERS | 0x4 | Displays week numbers (1-52) to the left of each row of days. Week 1 is defined as the first week that contains at least four days. |
| <a id="MCS_NOTODAYCIRCLE"></a>MCS_NOTODAYCIRCLE | 0x8 | Prevents the circling of today's date within the control. |
| <a id="MCS_NOTODAY"></a>MCS_NOTODAY | 0x10 | Prevents the display of today's date at the bottom of the control. |

<a id="Slider"></a>
## Slider Control Styles

These styles affect the [Slider](../lib/GuiControls.md#Slider) control. By default, it uses [WS_TABSTOP](#WS_TABSTOP). It has no forced styles.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="TBS_VERT"></a>TBS_VERT | 0x2 | +/-Vertical. The control is oriented vertically. |
| <a id="TBS_LEFT"></a>TBS_LEFT | 0x4 | +/-Left. The control displays tick marks at the top of the control (or to its left if [TBS_VERT](#TBS_VERT) is present). Same as [TBS_TOP](#TBS_TOP). |
| <a id="TBS_TOP"></a>TBS_TOP | 0x4 | same as [TBS_LEFT](#TBS_LEFT). |
| <a id="TBS_BOTH"></a>TBS_BOTH | 0x8 | +/-Center. The control displays tick marks on both sides of the control. This will be both top and bottom when used with TBS_HORZ or both left and right if used with [TBS_VERT](#TBS_VERT). |
| <a id="TBS_AUTOTICKS"></a>TBS_AUTOTICKS | 0x1 | The control has a tick mark for each increment in its range of values. Use +/-TickInterval to have more flexibility. |
| <a id="TBS_ENABLESELRANGE"></a>TBS_ENABLESELRANGE | 0x20 | The control displays a selection range only. The tick marks at the starting and ending positions of a selection range are displayed as triangles (instead of vertical dashes), and the selection range is highlighted (highlighting might require that the theme be removed via `GuiObj.Opt("-Theme")`).<br> To set the selection range, follow this example, which sets the starting position to 55 and the ending position to 66:<br> <code>SendMessage 0x040B, 1, 55, "msctls_trackbar321", WinTitle<br>SendMessage 0x040C, 1, 66, "msctls_trackbar321", WinTitle</code> |
| <a id="TBS_FIXEDLENGTH"></a>TBS_FIXEDLENGTH | 0x40 | +/-Thick. Allows the thumb's size to be changed. |
| <a id="TBS_NOTHUMB"></a>TBS_NOTHUMB | 0x80 | The control does not display the moveable bar. |
| <a id="TBS_NOTICKS"></a>TBS_NOTICKS | 0x10 | +/-NoTicks. The control does not display any tick marks. |
| <a id="TBS_TOOLTIPS"></a>TBS_TOOLTIPS | 0x100 | +/-ToolTip. The control supports tooltips. When a control is created using this style, it automatically creates a default ToolTip control that displays the slider's current position. You can change where the tooltips are displayed by using the TBM_SETTIPSIDE message. |
| <a id="TBS_REVERSED"></a>TBS_REVERSED | 0x200 | Unfortunately, this style has no effect on the actual behavior of the control, so there is probably no point in using it (instead, use +Invert in the control's options to reverse it). Depending on OS version, this style might require Internet Explorer 5.0 or greater. |
| <a id="TBS_DOWNISLEFT"></a>TBS_DOWNISLEFT | 0x400 | Unfortunately, this style has no effect on the actual behavior of the control, so there is probably no point in using it. Depending on OS version, this style might require Internet Explorer 5.01 or greater. |

<a id="Progress"></a>
## Progress Control Styles

These styles affect the [Progress](../lib/GuiControls.md#Progress) control. It has neither default styles nor forced styles.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="PBS_SMOOTH"></a>PBS_SMOOTH | 0x1 | +/-Smooth. The progress bar displays progress status in a smooth scrolling bar instead of the default segmented bar. When this style is present, the control automatically reverts to the Classic Theme appearance. |
| <a id="PBS_VERTICAL"></a>PBS_VERTICAL | 0x4 | +/-Vertical. The progress bar displays progress status vertically, from bottom to top. |
| <a id="PBS_MARQUEE"></a>PBS_MARQUEE | 0x8 | The progress bar moves like a marquee; that is, each change to its position causes the bar to slide further along its available length until it wraps around to the other side. A bar with this style has no defined position. Each attempt to change its position will instead slide the bar by one increment.<br> This style is typically used to indicate an ongoing operation whose completion time is unknown. |

<a id="Tab"></a>
## Tab Control Styles

These styles affect the [Tab](../lib/GuiControls.md#Tab) control. By default, it uses [WS_TABSTOP](#WS_TABSTOP) and [TCS_MULTILINE](#TCS_MULTILINE). The style [WS_CLIPSIBLINGS](#WS_CLIPSIBLINGS) is always enabled and cannot be disabled, while [TCS_OWNERDRAWFIXED](#TCS_OWNERDRAWFIXED) is forced on or off as required by the control's background color and/or text color.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="TCS_SCROLLOPPOSITE"></a>TCS_SCROLLOPPOSITE | 0x1 | Unneeded tabs scroll to the opposite side of the control when a tab is selected. |
| <a id="TCS_BOTTOM"></a>TCS_BOTTOM | 0x2 | +/-Bottom. Tabs appear at the bottom of the control instead of the top. |
| <a id="TCS_RIGHT"></a>TCS_RIGHT | 0x2 | Tabs appear vertically on the right side of controls that use the [TCS_VERTICAL](#TCS_VERTICAL) style. |
| <a id="TCS_MULTISELECT"></a>TCS_MULTISELECT | 0x4 | Multiple tabs can be selected by holding down `Ctrl` when clicking. This style must be used with the [TCS_BUTTONS](#TCS_BUTTONS) style. |
| <a id="TCS_FLATBUTTONS"></a>TCS_FLATBUTTONS | 0x8 | Selected tabs appear as being indented into the background while other tabs appear as being on the same plane as the background. This style only affects tab controls with the [TCS_BUTTONS](#TCS_BUTTONS) style. |
| <a id="TCS_FORCEICONLEFT"></a>TCS_FORCEICONLEFT | 0x10 | Icons are aligned with the left edge of each fixed-width tab. This style can only be used with the [TCS_FIXEDWIDTH](#TCS_FIXEDWIDTH) style. |
| <a id="TCS_FORCELABELLEFT"></a>TCS_FORCELABELLEFT | 0x20 | Labels are aligned with the left edge of each fixed-width tab; that is, the label is displayed immediately to the right of the icon instead of being centered.<br> This style can only be used with the [TCS_FIXEDWIDTH](#TCS_FIXEDWIDTH) style, and it implies the [TCS_FORCEICONLEFT](#TCS_FORCEICONLEFT) style. |
| <a id="TCS_HOTTRACK"></a>TCS_HOTTRACK | 0x40 | Items under the pointer are automatically highlighted. |
| <a id="TCS_VERTICAL"></a>TCS_VERTICAL | 0x80 | +/-Left or +/-Right. Tabs appear at the left side of the control, with tab text displayed vertically. This style is valid only when used with the [TCS_MULTILINE](#TCS_MULTILINE) style. To make tabs appear on the right side of the control, also use the [TCS_RIGHT](#TCS_RIGHT) style.<br> This style will not correctly display the tabs if a custom background color or text color is in effect. To workaround this, specify -Background and/or cDefault in the tab control's options. |
| <a id="TCS_BUTTONS"></a>TCS_BUTTONS | 0x100 | +/-Buttons. Tabs appear as buttons, and no border is drawn around the display area. |
| <a id="TCS_SINGLELINE"></a>TCS_SINGLELINE | 0x0 | +/-Wrap. Only one row of tabs is displayed. The user can scroll to see more tabs, if necessary. This style is the default. |
| <a id="TCS_MULTILINE"></a>TCS_MULTILINE | 0x200 | +/-Wrap. Multiple rows of tabs are displayed, if necessary, so all tabs are visible at once. |
| <a id="TCS_RIGHTJUSTIFY"></a>TCS_RIGHTJUSTIFY | 0x0 | This is the default. The width of each tab is increased, if necessary, so that each row of tabs fills the entire width of the tab control.<br> This window style is ignored unless the [TCS_MULTILINE](#TCS_MULTILINE) style is also specified. |
| <a id="TCS_FIXEDWIDTH"></a>TCS_FIXEDWIDTH | 0x400 | All tabs are the same width. This style cannot be combined with the [TCS_RIGHTJUSTIFY](#TCS_RIGHTJUSTIFY) style. |
| <a id="TCS_RAGGEDRIGHT"></a>TCS_RAGGEDRIGHT | 0x800 | Rows of tabs will not be stretched to fill the entire width of the control. This style is the default. |
| <a id="TCS_FOCUSONBUTTONDOWN"></a>TCS_FOCUSONBUTTONDOWN | 0x1000 | The tab control receives the input focus when clicked. |
| <a id="TCS_OWNERDRAWFIXED"></a>TCS_OWNERDRAWFIXED | 0x2000 | The parent window is responsible for drawing tabs. |
| <a id="TCS_TOOLTIPS"></a>TCS_TOOLTIPS | 0x4000 | The tab control has a tooltip control associated with it. |
| <a id="TCS_FOCUSNEVER"></a>TCS_FOCUSNEVER | 0x8000 | The tab control does not receive the input focus when clicked. |

<a id="StatusBar"></a>
## StatusBar Control Styles

These styles affect the [StatusBar](../lib/GuiControls.md#StatusBar) control. By default, it uses [SBARS_TOOLTIPS](#SBARS_TOOLTIPS) and [SBARS_SIZEGRIP](#SBARS_SIZEGRIP) (the latter only if the window is resizable). It has no forced styles.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="SBARS_TOOLTIPS"></a>SBARS_TOOLTIPS | 0x800 | Displays a tooltip when the mouse hovers over a part of the status bar that: 1) has too much text to be fully displayed; or 2) has an icon but no text.<br> The text of the tooltip can be set via:<br> <code>SendMessage 0x0411, 0, StrPtr("Text to display"), "msctls_statusbar321", MyGui ; 0x0411 is SB_SETTIPTEXTW.</code> The bold **0** above is the zero-based part number. To use a part other than the first, specify 1 for second, 2 for the third, etc. NOTE: The tooltip might never appear on certain OS versions. |
| <a id="SBARS_SIZEGRIP"></a>SBARS_SIZEGRIP | 0x100 | Includes a sizing grip at the right end of the status bar. A sizing grip is similar to a sizing border; it is a rectangular area that the user can click and drag to resize the parent window. |

<a id="Link"></a>
## Link Control Styles

These styles affect the [Link](../lib/GuiControls.md#Link) control. By default, it uses [WS_TABSTOP](#WS_TABSTOP). It has no forced styles.

| Style | Hex | Description |
| --- | --- | --- |
| <a id="LWS_TRANSPARENT"></a>LWS_TRANSPARENT | 0x1 | The background mix mode is transparent. |
| <a id="LWS_IGNORERETURN"></a>LWS_IGNORERETURN | 0x2 | When the link has keyboard focus and the user presses Enter, the keystroke is ignored by the control and passed to the host dialog box. |
| <a id="LWS_NOPREFIX"></a>LWS_NOPREFIX | 0x4 | Windows Vista. If the text contains an ampersand, it is treated as a literal character rather than the prefix to a shortcut key. |
| <a id="LWS_USEVISUALSTYLE"></a>LWS_USEVISUALSTYLE | 0x8 | Windows Vista. The link is displayed in the current visual style. |
| <a id="LWS_USECUSTOMTEXT"></a>LWS_USECUSTOMTEXT | 0x10 | Windows Vista. An NM_CUSTOMTEXT notification is sent when the control is drawn, so that the application can supply text dynamically. |
| <a id="LWS_RIGHT"></a>LWS_RIGHT | 0x20 | Windows Vista. The text is right-justified. |
