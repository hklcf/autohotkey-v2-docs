# ImageSearch

Searches a region of the screen for an image.

```ahk
ImageSearch &OutputVarX, &OutputVarY, X1, Y1, X2, Y2, ImageFile
```

<a id="Parameters"></a>
## Parameters

**&OutputVarX, &OutputVarY**

Type: [VarRef](../Concepts.md#variable-references)

References to the output variables in which to store the X and Y coordinates of the upper-left pixel of where the image was found on the screen (if no match is found, the variables are made blank). Coordinates are relative to the active window's client area unless [CoordMode](CoordMode.md) was used to change that.

**X1, Y1**

Type: [Integer](../Concepts.md#numbers)

The X and Y coordinates of the upper left corner of the rectangle to search. Coordinates are relative to the active window's client area unless [CoordMode](CoordMode.md) was used to change that.

**X2, Y2**

Type: [Integer](../Concepts.md#numbers)

The X and Y coordinates of the lower right corner of the rectangle to search. Coordinates are relative to the active window's client area unless [CoordMode](CoordMode.md) was used to change that.

**ImageFile**

Type: [String](../Concepts.md#strings)

The file name of an image, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. Supported image formats include ANI, BMP, CUR, EMF, Exif, GIF, ICO, JPG, PNG, TIF, and WMF (BMP images must be 16-bit or higher). Other sources of icons include the following types of files: EXE, DLL, CPL, SCR, and other types that contain icon resources.

**Options:** Zero or more of the following options may be also be present immediately before the name of the file. Separate each option from the next with a single space or tab. For example: `"*2 *w100 *h-1 C:\Main Logo.bmp"`.

**\*Icon***N*: To use an icon group other than the first one in the file, specify `*Icon` followed immediately by the number of the group. For example, `*Icon2` would load the default icon from the second icon group.

**\**n*** (variation): Specify for *n* a number between 0 and 255 (inclusive) to indicate the allowed number of shades of variation in either direction for the intensity of the red, green, and blue components of each pixel's color. For example, if `*2` is specified and the color of a pixel is 0x444444, any color from 0x424242 to 0x464646 will be considered a match. This parameter is helpful if the coloring of the image varies slightly or if *ImageFile* uses a format such as GIF or JPG that does not accurately represent an image on the screen. If you specify 255 shades of variation, all colors will match. The default is 0 shades.

**\*Trans***N*: This option makes it easier to find a match by specifying one color within the image that will match any color on the screen. It is most commonly used to find PNG, GIF, and TIF files that have some transparent areas (however, icons do not need this option because their transparency is automatically supported). For GIF files, `*TransWhite` might be most likely to work. For PNG and TIF files, `*TransBlack` might be best. Otherwise, specify for *N* some other color name or RGB value (see the [color chart](../misc/Colors.md) for guidance, or use [PixelGetColor](PixelGetColor.md) in its RGB mode). Examples: `*TransBlack`, `*TransFFFFAA`, `*Trans0xFFFFAA`.

**\*w***n* and **\*h***n*: Width and height to which to scale the image (this width and height also determines which icon to load from a multi-icon .ICO file). If both these options are omitted, icons loaded from ICO, DLL, or EXE files are scaled to the system's default small-icon size, which is usually 16 by 16 (you can force the actual/internal size to be used by specifying `*w0 *h0`). Images that are not icons are loaded at their actual size. To shrink or enlarge the image while preserving its aspect ratio, specify -1 for one of the dimensions and a positive number for the other. For example, specifying `*w200 *h-1` would make the image 200 pixels wide and cause its height to be set automatically.

A [bitmap or icon handle](../misc/ImageHandles.md) can be used instead of a filename. For example, `"HBITMAP:*" handle`.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 1 (true) if the image was found in the specified region, or 0 (false) if it was not found.

<a id="Error_Handling"></a>
## Error Handling

A [ValueError](Error.md#ValueError) is thrown if an invalid parameter was detected or the image could not be loaded.

An [OSError](Error.md#OSError) is thrown if an internal function call fails.

<a id="Remarks"></a>
## Remarks

ImageSearch can be used to detect graphical objects on the screen that either lack text or whose text cannot be easily retrieved. For example, it can be used to discover the position of picture buttons, icons, web page links, or game objects. Once located, such objects can be clicked via [Click](Click.md).

A strategy that is sometimes useful is to search for a small clipping from an image rather than the entire image. This can improve reliability in cases where the image as a whole varies, but certain parts within it are always the same. One way to extract a clipping is to:

1. Press `Alt`+`PrtSc` while the image is visible in the active window. This places a screenshot on the clipboard.
2. Open an image processing program such as Paint.
3. Paste the contents of the clipboard (that is, the screenshot).
4. Select a region that does not vary and that is unique to the image.
5. Copy and paste that region to a new image document.
6. Save it as a small file for use with ImageSearch.

To be a match, an image on the screen must be the same size as the one loaded via the *ImageFile* parameter and its options.

The region to be searched must be visible; in other words, it is not possible to search a region of a window hidden behind another window. By contrast, images that lie partially beneath the mouse cursor can usually be detected. The exception to this is game cursors, which in most cases will obstruct any images beneath them.

Since the search starts at the top row of the region and moves downward, if there is more than one match, the one closest to the top will be found.

Icons containing a transparent color automatically allow that color to match any color on the screen. Therefore, the color of what lies behind the icon does not matter.

ImageSearch supports 8-bit color screens (256-color) or higher.

The search behavior may vary depending on the display adapter's color depth (especially for GIF and JPG files). Therefore, if a script will run under multiple color depths, it is best to test it on each depth setting. You can use the shades-of-variation option (\*n) to help make the behavior consistent across multiple color depths.

If the image on the screen is translucent, ImageSearch will probably fail to find it. To work around this, try the shades-of-variation option (\*n) or make the window temporarily opaque via `WinSetTransparent("Off")`.

<a id="Related"></a>
## Related

[PixelSearch](PixelSearch.md), [PixelGetColor](PixelGetColor.md), [CoordMode](CoordMode.md), [MouseGetPos](MouseGetPos.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Searches a region of the active window for an image and stores in *FoundX* and *FoundY* the X and Y coordinates of the upper-left pixel of where the image was found.

```ahk
ImageSearch &FoundX, &FoundY, 40, 40, 300, 300, "C:\My Images\test.bmp"
```

<a id="ExScreen"></a>

**Example:** Searches a region of the screen for an image and stores in *FoundX* and *FoundY* the X and Y coordinates of the upper-left pixel of where the image was found, including advanced error handling.

```ahk
CoordMode "Pixel"  ; Interprets the coordinates below as relative to the screen rather than the active window's client area.
try
{
    if ImageSearch(&FoundX, &FoundY, 0, 0, A_ScreenWidth, A_ScreenHeight, "*Icon3 " A_ProgramFiles "\SomeApp\SomeApp.exe")
        MsgBox "The icon was found at " FoundX "x" FoundY
    else
        MsgBox "Icon could not be found on the screen."
}
catch as exc
    MsgBox "Could not conduct the search due to the following error:`n" exc.Message
```
