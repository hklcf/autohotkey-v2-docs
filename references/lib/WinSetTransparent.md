# WinSetTransparent

Makes the specified window semi-transparent.

```ahk
WinSetTransparent N, WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**N**

Type: [Integer](../Concepts.md#numbers) or [String](../Concepts.md#strings)

To enable transparency, specify a number between 0 and 255 indicating the degree of transparency: 0 makes the window invisible while 255 makes it opaque.

`"Off"` (case-insensitive) or an empty string may be specified to completely turn off transparency for a window. This is functionally identical to `WinSetTransColor "Off"`. Specifying Off is different than specifying 255 because it may improve performance and reduce usage of system resources (but probably only when desktop composition is disabled).

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the window could not be found.

An [OSError](Error.md#OSError) is thrown if the change could not be applied.

<a id="Remarks"></a>
## Remarks

For example, to make the task bar transparent, use `WinSetTransparent 150, "ahk_class Shell_TrayWnd"`. Similarly, to make the classic Start Menu transparent, see [example #2](#ExTransStartMenu). To make the Start Menu's submenus transparent, also include the script from [example #3](#ExTransMenu).

Setting the transparency level to 255 before using Off might avoid window redrawing problems such as a black background. If the window still fails to be redrawn correctly, see [WinRedraw](WinRedraw.md) for a possible workaround.

<a id="Related"></a>
## Related

[WinSetTransColor](WinSetTransColor.md), [Win functions](Win.md), [Control functions](Control.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Makes Notepad a little bit transparent.

```ahk
WinSetTransparent 200, "Untitled - Notepad"
```

<a id="ExTransStartMenu"></a>

**Example:** Makes the classic Start Menu transparent (to additionally make the Start Menu's submenus transparent, see [example #3](#ExTransMenu)).

```ahk
DetectHiddenWindows True
WinSetTransparent 150, "ahk_class BaseBar"
```

<a id="ExTransMenu"></a>

**Example:** Makes all or selected menus transparent throughout the system as soon as they appear. Note that although such a script cannot make its own menus transparent, it can make those of other scripts transparent.

```ahk
SetTimer WatchForMenu, 5

WatchForMenu()
{
    DetectHiddenWindows True  ; Might allow detection of menu sooner.
    if WinExist("ahk_class #32768")
        WinSetTransparent 150  ; Uses the window found by the above line.
}
```

<a id="ExTransHotkey"></a>

**Example:** Demonstrates the effects of WinSetTransparent and [WinSetTransColor](WinSetTransColor.md). Note: If you press one of the hotkeys while the mouse cursor is hovering over a pixel that is invisible as a result of TransColor, the window visible beneath that pixel will be acted upon instead!

```ahk
#t::  ; Press Win+T to make the color under the mouse cursor invisible.
{
    MouseGetPos &MouseX, &MouseY, &MouseWin
    MouseRGB := PixelGetColor(MouseX, MouseY)
    ; It seems necessary to turn off any existing transparency first:
    WinSetTransColor "Off", MouseWin
    WinSetTransColor MouseRGB " 220", MouseWin
}

#o::  ; Press Win+O to turn off transparency for the window under the mouse.
{
    MouseGetPos ,, &MouseWin
    WinSetTransColor "Off", MouseWin
}

#g::  ; Press Win+G to show the current settings of the window under the mouse.
{
    MouseGetPos ,, &MouseWin
    TransDegree := WinGetTransparent(MouseWin)
    TransColor := WinGetTransColor(MouseWin)
    ToolTip "Translucency:`t" TransDegree "`nTransColor:`t" TransColor
}
```
