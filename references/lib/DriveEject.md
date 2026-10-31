# DriveEject / DriveRetract

Ejects or retracts the tray of the specified CD/DVD drive. DriveEject can also eject a removable drive.

```ahk
DriveEject Drive
DriveRetract Drive
```

<a id="Parameters"></a>
## Parameters

**Drive**

Type: [String](../Concepts.md#strings)

If omitted, it defaults to the first CD/DVD drive found by iterating from A to Z (an exception is thrown if no drive is found). Otherwise, specify the drive letter optionally followed by a colon or a colon and backslash. For example, `"D"`, `"D:"` or `"D:\"`.

This can also be a device path in the form `"\\?\Volume{...}"`, which can be discovered by running [mountvol](https://learn.microsoft.com/windows-server/administration/windows-commands/mountvol) at the command line. In this case the drive is not required to be assigned a drive letter.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure, if detected.

These functions will probably not work on a network drive or any drive lacking the "Eject" option in Explorer. The underlying system functions do not always report failure, so an exception may or may not be thrown.

<a id="Remarks"></a>
## Remarks

This function waits for the ejection or retraction to complete before allowing the script to continue.

It may be possible to detect the previous tray state by measuring the time the function takes to complete, as in [the example below](#ExToggle).

Ejecting a removable drive is generally equivalent to using the "Eject" context menu option in Explorer, except that no warning is shown if files are in use. Unlike the Safely Remove Hardware option, this only dismounts the volume identified by the *Drive* parameter, not the overall device.

DriveEject and DriveRetract correspond to the [IOCTL_STORAGE_EJECT_MEDIA](https://learn.microsoft.com/windows-hardware/drivers/ddi/ntddstor/ni-ntddstor-ioctl_storage_eject_media) and [IOCTL_STORAGE_LOAD_MEDIA](https://learn.microsoft.com/windows-hardware/drivers/ddi/ntddstor/ni-ntddstor-ioctl_storage_load_media) control codes, which may also have an effect on drive types other than CD/DVD, such as tape drives.

<a id="Related"></a>
## Related

[DriveGetStatusCD](DriveGetStatusCD.md), [Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

<a id="ExEject"></a>

**Example:** Ejects (opens) the tray of the first CD/DVD drive.

```ahk
DriveEject()
```

<a id="ExRetract"></a>

**Example:** Retracts (closes) the tray of the first CD/DVD drive.

```ahk
DriveRetract()
```

<a id="ExEjectAll"></a>

**Example:** Ejects all removable drives (except CD/DVD drives).

```ahk
Loop Parse DriveGetList("REMOVABLE")
{
    if MsgBox("Eject " A_LoopField ":, even if files are open?",, "y/n") = "yes"
        DriveEject(A_LoopField)
}
else
    MsgBox "No removable drives found."
```

<a id="ExToggle"></a>

**Example:** Defines a hotkey which toggles the tray to the opposite state (open or closed), based on the time the function takes to complete.

```ahk
#c::
{
    DriveEject
    ; If the function completed quickly, the tray was probably already ejected.
    ; In that case, retract it:
    if (A_TimeSinceThisHotkey < 1000)  ; Adjust this time if needed.
        DriveRetract
}
```
