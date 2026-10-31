# Drive Functions

Functions for retrieving information about the computer's drive(s) or for performing various operations on a drive. Click on a function name for details.

| Function | Description |
| --- | --- |
| [DriveEject](DriveEject.md) | Ejects the tray of the specified CD/DVD drive, or ejects a removable drive. |
| [DriveGetCapacity](DriveGetCapacity.md) | Returns the total capacity of the drive which contains the specified path, in megabytes. |
| [DriveGetFileSystem](DriveGetFileSystem.md) | Returns the type of the specified drive's file system. |
| [DriveGetLabel](DriveGetLabel.md) | Returns the volume label of the specified drive. |
| [DriveGetList](DriveGetList.md) | Returns a string of letters, one character for each drive letter in the system. |
| [DriveGetSerial](DriveGetSerial.md) | Returns the volume serial number of the specified drive. |
| [DriveGetSpaceFree](DriveGetSpaceFree.md) | Returns the free disk space of the drive which contains the specified path, in megabytes. |
| [DriveGetStatus](DriveGetStatus.md) | Returns the status of the drive which contains the specified path. |
| [DriveGetStatusCD](DriveGetStatusCD.md) | Returns the media status of the specified CD/DVD drive. |
| [DriveGetType](DriveGetType.md) | Returns the type of the drive which contains the specified path. |
| [DriveLock](DriveLock.md) | Prevents the eject feature of the specified drive from working. |
| [DriveRetract](DriveEject.md) | Retracts the tray of the specified CD/DVD drive. |
| [DriveSetLabel](DriveSetLabel.md) | Changes the volume label of the specified drive. |
| [DriveUnlock](DriveUnlock.md) | Restores the eject feature of the specified drive. |

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Related"></a>
## Related

[List of all functions](index.md)

<a id="Examples"></a>
## Examples

<a id="ExAnalyzeDrive"></a>

**Example:** Allows the user to select a drive in order to analyze it.

```ahk
folder := DirSelect( , 3, "Pick a drive to analyze:")
if not folder
    return
MsgBox
(
    "All Drives: " DriveGetList() "
    Selected Drive: " folder "
    Drive Type: " DriveGetType(folder) "
    Status: " DriveGetStatus(folder) "
    Capacity: " DriveGetCapacity(folder) " MB
    Free Space: " DriveGetSpaceFree(folder) " MB
    Filesystem: " DriveGetFilesystem(folder) "
    Volume Label: " DriveGetLabel(folder) "
    Serial Number: " DriveGetSerial(folder)
)
```
