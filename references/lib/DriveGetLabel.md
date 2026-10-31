# DriveGetLabel

Returns the volume label of the specified drive.

```ahk
Label := DriveGetLabel(Drive)
```

<a id="Parameters"></a>
## Parameters

**Drive**

Type: [String](../Concepts.md#strings)

The drive letter followed by a colon and an optional backslash, or a UNC name such as `"\server1\share1"`.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the *Drive*'s volume label.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Related"></a>
## Related

[DriveSetLabel](DriveSetLabel.md), [Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

See [example #1](Drive.md#ExAnalyzeDrive) on the [Drive Functions](Drive.md) page for a demonstration of this function.
