# DriveGetCapacity

Returns the total capacity of the drive which contains the specified path, in megabytes.

```ahk
Capacity := DriveGetCapacity(Path)
```

<a id="Parameters"></a>
## Parameters

**Path**

Type: [String](../Concepts.md#strings)

Any path contained by the drive (might also work on UNC paths and mapped drives).

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the total capacity of the drive which contains *Path*, in megabytes.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Remarks"></a>
## Remarks

In general, *Path* can be any path. Since NTFS supports mounted volumes and directory junctions, different paths with the same drive letter can produce different amounts of capacity.

<a id="Related"></a>
## Related

[DriveGetSpaceFree](DriveGetSpaceFree.md), [Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

See [example #1](Drive.md#ExAnalyzeDrive) on the [Drive Functions](Drive.md) page for a demonstration of this function.
