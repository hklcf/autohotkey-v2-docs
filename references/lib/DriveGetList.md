# DriveGetList

Returns a string of letters, one character for each drive letter in the system.

```ahk
List := DriveGetList(DriveType)
```

<a id="Parameters"></a>
## Parameters

**DriveType**

Type: [String](../Concepts.md#strings)

If omitted, all drive types are retrieved. Otherwise, specify one of the following words to retrieve only a specific type of drive: CDROM, REMOVABLE, FIXED, NETWORK, RAMDISK, UNKNOWN.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the drive letters in the system, depending on *DriveType*. For example: ACDEZ.

<a id="Related"></a>
## Related

[Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

See [example #1](Drive.md#ExAnalyzeDrive) on the [Drive Functions](Drive.md) page for a demonstration of this function.
