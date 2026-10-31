# LoadPicture

Loads a picture from file and returns a bitmap or icon handle.

```ahk
Handle := LoadPicture(Filename , Options, &OutImageType)
```

<a id="Parameters"></a>
## Parameters

**Filename**

Type: [String](../Concepts.md#strings)

The filename of the picture, which is usually assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. If the name of a DLL or EXE file is given without a path, it may be loaded from the directory of the current executable (AutoHotkey.exe or a compiled script) or a system directory.

**Options**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to no options. Otherwise, specify a string of one or more of the following options, each separated from the next with a space or tab:

**W***n* and **H***n*: The width and height to load the image at, where *n* is an integer. If one dimension is omitted or -1, it is calculated automatically based on the other dimension, preserving aspect ratio. If both are omitted, the image's original size is used. If either dimension is 0, the original size is used for that dimension. For example: `"w80 h50"`, `"w48 h-1"` or `"w48"` (preserve aspect ratio), `"h0 w100"` (use original height but override width).

**Icon***n*: Indicates which icon to load from a file with multiple icons (generally an EXE or DLL file). For example, `"Icon2"` loads the file's second icon. If negative, the absolute value is assumed to be the resource ID of an icon within an executable file. Any supported image format can be converted to an icon by specifying `"Icon1"`. However, the icon is converted back to a bitmap if the *OutImageType* parameter is omitted.

**GDI+:** Use GDI+ to load the image, if available. For example, `"GDI+ w100"`.

**&OutImageType**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored, and the return value will always be a bitmap handle (icons/cursors are converted if necessary) because reliably using or deleting an icon/cursor/bitmap handle requires knowing which type it is. Otherwise, specify a reference to the output variable in which to store a number indicating the type of handle being returned: 0 (IMAGE_BITMAP), 1 (IMAGE_ICON) or 2 (IMAGE_CURSOR).

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns a [bitmap or icon handle](../misc/ImageHandles.md) depending on whether a picture or icon is specified and whether the *&OutImageType* parameter is present or not. If there are any errors, the function returns 0.

<a id="Remarks"></a>
## Remarks

LoadPicture also supports [the handle syntax](../misc/ImageHandles.md), such as for creating a resized image based on an icon or bitmap which has already been loaded into memory, or converting an icon to a bitmap by omitting *&OutImageType*.

If the image needs to be freed from memory, call whichever function is appropriate for the type of handle.

```ahk
if (not OutImageType)  ; IMAGE_BITMAP (0) or the OutImageType parameter was omitted.
    DllCall("DeleteObject", "ptr", Handle)
else if (OutImageType = 1)  ; IMAGE_ICON
    DllCall("DestroyIcon", "ptr", Handle)
else if (OutImageType = 2)  ; IMAGE_CURSOR
    DllCall("DestroyCursor", "ptr", Handle)
```

<a id="Related"></a>
## Related

[Image Handles](../misc/ImageHandles.md)

<a id="Examples"></a>
## Examples

<a id="ExSlideShow"></a>

**Example:** Pre-loads and reuses some images.

```ahk
Pics := []
; Find some pictures to display.
Loop Files, A_WinDir "\Web\Wallpaper\*.jpg", "R"
{
    ; Load each picture and add it to the array.
    Pics.Push(LoadPicture(A_LoopFileFullPath))
}
if !Pics.Length
{
    ; If this happens, edit the path on the Loop line above.
    MsgBox("No pictures found! Try a different directory.")
    ExitApp
}
; Add the picture control, preserving the aspect ratio of the first picture.
MyGui := Gui()
Pic := MyGui.Add("Pic", "w600 h-1 +Border", "HBITMAP:*" Pics[1])
MyGui.OnEvent("Escape", (*) => ExitApp())
MyGui.OnEvent("Close", (*) => ExitApp())
MyGui.Show()
Loop
{
    ; Switch pictures!
    Pic.Value := "HBITMAP:*" Pics[Mod(A_Index, Pics.Length)+1]
    Sleep 3000
}
```
