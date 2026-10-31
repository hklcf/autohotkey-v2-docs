# DriveGetType

Returns the type of the drive which contains the specified path.

```ahk
DriveType := DriveGetType(Path)
```

<a id="Parameters"></a>
## Parameters

**Path**

Type: [String](../Concepts.md#strings)

Any path contained by the drive (might also work on UNC paths and mapped drives).

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the type of the drive which contains *Path*: Unknown, Removable, Fixed, Network, CDROM, or RAMDisk. If *Path* is invalid (e.g. because the drive does not exist), the return value is an empty string.

<a id="Remarks"></a>
## Remarks

In general, *Path* can be any path. Since NTFS supports mounted volumes and directory junctions, different paths with the same drive letter can produce different results.

<a id="Related"></a>
## Related

[Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

See [example #1](Drive.md#ExAnalyzeDrive) on the [Drive Functions](Drive.md) page for a demonstration of this function.
