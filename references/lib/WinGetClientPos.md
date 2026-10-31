# WinGetClientPos

Retrieves the position and size of the specified window's client area.

```ahk
WinGetClientPos &OutX, &OutY, &OutWidth, &OutHeight, WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**&OutX, &OutY**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify references to the output variables in which to store the X and Y coordinates of the client area's upper left corner.

**&OutWidth, &OutHeight**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify references to the output variables in which to store the width and height of the client area.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

<a id="Remarks"></a>
## Remarks

The client area is the part of the window which can contain controls. It excludes the window's title bar, menu (if it has a standard one) and borders. The position and size of the client area are less dependent on OS version and theme than the values returned by [WinGetPos](WinGetPos.md).

If *WinTitle* is `"Program Manager"`, the function will retrieve the size of the desktop, which is usually the same as the current screen resolution.

A minimized window will still have a position and size. The values returned in this case may vary depending on OS and configuration, but are usually -32000 for the X and Y coordinates and zero for the width and height.

To discover the name of the window and control that the mouse is currently hovering over, use [MouseGetPos](MouseGetPos.md).

On systems with multiple screens which have different DPI settings, the returned position and size may be different than expected due to [OS DPI scaling](../misc/DPIScaling.md).

<a id="Related"></a>
## Related

[WinGetPos](WinGetPos.md), [WinMove](WinMove.md), [ControlGetPos](ControlGetPos.md), [WinGetTitle](WinGetTitle.md), [WinGetText](WinGetText.md), [ControlGetText](ControlGetText.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves and reports the position and size of the calculator's client area.

```ahk
WinGetClientPos &X, &Y, &W, &H, "Calculator"
MsgBox "Calculator's client area is at " X "," Y " and its size is " W "x" H
```

<a id="ExA"></a>

**Example:** Retrieves and reports the position of the active window's client area.

```ahk
WinGetClientPos &X, &Y,,, "A"
MsgBox "The active window's client area is at " X "," Y
```

<a id="ExLastFound"></a>

**Example:** If Notepad does exist, retrieve and report the position of its client area.

```ahk
if WinExist("Untitled - Notepad")
{
    WinGetClientPos &Xpos, &Ypos ; Use the window found by WinExist.
    MsgBox "Notepad's client area is at " Xpos "," Ypos
}
```
