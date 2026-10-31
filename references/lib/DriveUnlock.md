# DriveUnlock

Restores the eject feature of the specified drive.

```ahk
DriveUnlock Drive
```

<a id="Parameters"></a>
## Parameters

**Drive**

Type: [String](../Concepts.md#strings)

The drive letter followed by a colon and an optional backslash (might also work on UNC paths and mapped drives).

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Remarks"></a>
## Remarks

This function needs to be called multiple times if the drive was locked multiple times (at least for some drives). For example, if `DriveLock("D:")` was called three times, `DriveUnlock("D:")` might need to be called three times to unlock it. Because of this and the fact that there is no way to determine whether a drive is currently locked, it is often useful to keep track of its lock-state in a [variable](../Variables.md).

<a id="Related"></a>
## Related

[DriveLock](DriveLock.md), [Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Unlocks the D drive.

```ahk
DriveUnlock "D:"
```
