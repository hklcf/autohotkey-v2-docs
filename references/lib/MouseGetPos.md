# MouseGetPos

Retrieves the current position of the mouse cursor, and optionally which window and control it is hovering over.

```ahk
MouseGetPos &OutputVarX, &OutputVarY, &OutputVarWin, &OutputVarControl, Flag
```

<a id="Parameters"></a>
## Parameters

**&OutputVarX, &OutputVarY**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify references to the output variables in which to store the X and Y coordinates. The retrieved coordinates are relative to the active window's client area unless [CoordMode](CoordMode.md) was used to change to screen coordinates.

**&OutputVarWin**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify a reference to the output variable in which to store the [unique ID (HWND)](../misc/WinTitle.md#ahk_id) of the window under the mouse cursor. If the window cannot be determined, this variable will be made blank.

The window does not have to be active to be detected. Hidden windows cannot be detected.

**&OutputVarControl**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify a reference to the output variable in which to store the [ClassNN](../misc/ControlID.md#ClassNN) of the control under the mouse cursor. If the control cannot be determined, this variable will be made blank.

The window under the mouse cursor does not have to be active for a control to be detected.

**Flag**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 0, meaning the function uses the default method to determine *OutputVarControl* and stores the control's [ClassNN](../misc/ControlID.md#ClassNN). Otherwise, specify a combination (sum) of the following numbers:

**1:** Uses a simpler method to determine *OutputVarControl*. This method correctly retrieves the active/topmost child window of an Multiple Document Interface (MDI) application such as SysEdit or TextPad. However, it is less accurate for other purposes such as detecting controls inside a GroupBox control.

**2:** Stores the [control's HWND](../misc/ControlID.md#HWND) in *OutputVarControl* rather than the control's [ClassNN](../misc/ControlID.md#ClassNN).

For example, to put both options into effect, the *Flag* parameter must be set to 3.

<a id="Remarks"></a>
## Remarks

Any of the output variables may be omitted if the corresponding information is not needed.

On systems with multiple screens which have different DPI settings, the returned position may be different than expected due to [OS DPI scaling](../misc/DPIScaling.md).

<a id="Related"></a>
## Related

[CoordMode](CoordMode.md), [Win functions](Win.md), [SetDefaultMouseSpeed](SetDefaultMouseSpeed.md), [Click](Click.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reports the position of the mouse cursor.

```ahk
MouseGetPos &xpos, &ypos
MsgBox "The cursor is at X" xpos " Y" ypos
```

<a id="ExWatchCursor"></a>

**Example:** Shows the HWND, class name, title and controls of the window currently under the mouse cursor.

```ahk
SetTimer WatchCursor, 100

WatchCursor()
{
    MouseGetPos , , &id, &control
    ToolTip
    (
        "ahk_id " id "
        ahk_class " WinGetClass(id) "
        " WinGetTitle(id) "
        Control: " control
    )
}
```
