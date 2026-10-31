# DriveGetFileSystem

Returns the type of the specified drive's file system.

```ahk
FileSystem := DriveGetFileSystem(Drive)
```

<a id="Parameters"></a>
## Parameters

**Drive**

Type: [String](../Concepts.md#strings)

The drive letter followed by a colon and an optional backslash, or a UNC name such as `"\server1\share1"`.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the type of *Drive*'s file system. The possible values are defined by the system; they include (but are not limited to) the following: NTFS, FAT32, FAT, CDFS (typically indicates a CD), or UDF (typically indicates a DVD).

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure, such as if the drive does not contain formatted media.

<a id="Related"></a>
## Related

[Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

See [example #1](Drive.md#ExAnalyzeDrive) on the [Drive Functions](Drive.md) page for a demonstration of this function.
