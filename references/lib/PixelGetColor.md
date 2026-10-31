# PixelGetColor

Retrieves the color of the pixel at the specified X and Y coordinates.

```ahk
Color := PixelGetColor(X, Y , Mode)
```

<a id="Parameters"></a>
## Parameters

**X, Y**

Type: [Integer](../Concepts.md#numbers)

The X and Y coordinates of the pixel. Coordinates are relative to the active window's client area unless [CoordMode](CoordMode.md) was used to change that.

**Mode**

Type: [String](../Concepts.md#strings)

If blank or omitted, the pixel is retrieved using the normal method. Otherwise, specify one or more of the following words. If more than one word is present, separate each from the next with a space (e.g. `"Alt Slow"`).

**Alt:** Uses an alternate method to retrieve the color, which should be used when the normal method produces invalid or inaccurate colors for a particular type of window. This method is about 10 % slower than the normal method.

**Slow:** Uses a more elaborate method to retrieve the color, which may work in certain full-screen applications when the other methods fail. This method is about three times slower than the normal method. Note: *Slow* takes precedence over *Alt*, so there is no need to specify *Alt* in this case.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns a hexadecimal numeric string representing the RGB (red-green-blue) color of the pixel. For example, the color purple is defined 0x800080 because it has an intensity of 0x80 (128) for its blue and red components but an intensity of 0x00 (0) for its green component.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

<a id="Remarks"></a>
## Remarks

The pixel must be visible; in other words, it is not possible to retrieve the pixel color of a window hidden behind another window. By contrast, pixels beneath the mouse cursor can usually be detected. The exception to this is game cursors, which in most cases will obstruct any pixels beneath them.

Use [Window Spy](../Program.md#Window_Spy) or the example at the bottom of this page to determine the colors currently on the screen.

Known limitations:

- A window that is [partially transparent](WinSetTransparent.md) or that has one of its colors marked invisible ([WinSetTransColor](WinSetTransColor.md)) typically yields colors for the window behind itself rather than its own.
- PixelGetColor might not produce accurate results for certain applications. If this occurs, try specifying the word *Alt* or *Slow* in the last parameter.

<a id="Related"></a>
## Related

[PixelSearch](PixelSearch.md), [ImageSearch](ImageSearch.md), [CoordMode](CoordMode.md), [MouseGetPos](MouseGetPos.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Press a hotkey to show the color of the pixel located at the current position of the mouse cursor.

```ahk
^!z::  ; Control+Alt+Z hotkey.
{
    MouseGetPos &MouseX, &MouseY
    MsgBox "The color at the current cursor position is " PixelGetColor(MouseX, MouseY)
}
```
