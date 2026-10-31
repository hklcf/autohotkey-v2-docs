# DriveGetSpaceFree

Returns the free disk space of the drive which contains the specified path, in megabytes.

```ahk
FreeSpace := DriveGetSpaceFree(Path)
```

<a id="Parameters"></a>
## Parameters

**Path**

Type: [String](../Concepts.md#strings)

Any path contained by the drive (might also work on UNC paths and mapped drives).

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the free disk space of the drive which contains *Path*, in megabytes (rounded down to the nearest megabyte).

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Remarks"></a>
## Remarks

In general, *Path* can be any path. Since NTFS supports mounted volumes and directory junctions, different paths with the same drive letter can produce different amounts of free space.

<a id="Related"></a>
## Related

[DriveGetCapacity](DriveGetCapacity.md), [Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

<a id="ExPath"></a>

**Example:** Retrieves and reports the free disk space of the drive which contains [A_MyDocuments](../Variables.md#MyDocuments).

```ahk
FreeSpace := DriveGetSpaceFree(A_MyDocuments)
MsgBox FreeSpace " MB"
```

See [example #1](Drive.md#ExAnalyzeDrive) on the [Drive Functions](Drive.md) page for another demonstration of this function.
