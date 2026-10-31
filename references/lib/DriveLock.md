# DriveLock

Prevents the eject feature of the specified drive from working.

```ahk
DriveLock Drive
```

<a id="Parameters"></a>
## Parameters

**Drive**

Type: [String](../Concepts.md#strings)

The drive letter followed by a colon and an optional backslash (might also work on UNC paths and mapped drives).

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure, such as if *Drive* does not exist or does not support the locking feature.

<a id="Remarks"></a>
## Remarks

Most drives cannot be "locked open". However, locking the drive while it is open will probably result in it becoming locked the moment it is closed.

This function has no effect on drives that do not support locking (such as most read-only drives).

To unlock a drive, call [DriveUnlock](DriveUnlock.md). If a drive is locked by a script and that script exits, the drive will stay locked until another script or program unlocks it, or the system is restarted.

<a id="Related"></a>
## Related

[DriveUnlock](DriveUnlock.md), [Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Locks the D drive.

```ahk
DriveLock "D:"
```
