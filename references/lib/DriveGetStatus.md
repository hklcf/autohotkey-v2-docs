# DriveGetStatus

Returns the status of the drive which contains the specified path.

```ahk
Status := DriveGetStatus(Path)
```

<a id="Parameters"></a>
## Parameters

**Path**

Type: [String](../Concepts.md#strings)

Any path contained by the drive (might also work on UNC paths and mapped drives).

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the status of the drive which contains *Path*:

| Status | Notes |
| --- | --- |
| Unknown | Might indicate unformatted/RAW file system. |
| Ready | This is the most common. |
| NotReady | Typical for removable drives that don't contain media. |
| Invalid | *Path* does not exist or is a network drive that is presently inaccessible, etc. |

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Remarks"></a>
## Remarks

In general, *Path* can be any path. Since NTFS supports mounted volumes and directory junctions, different paths with the same drive letter can produce different results.

<a id="Related"></a>
## Related

[Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

See [example #1](Drive.md#ExAnalyzeDrive) on the [Drive Functions](Drive.md) page for a demonstration of this function.
