# DriveSetLabel

Changes the volume label of the specified drive.

```ahk
DriveSetLabel Drive , NewLabel
```

<a id="Parameters"></a>
## Parameters

**Drive**

Type: [String](../Concepts.md#strings)

The drive letter followed by a colon and an optional backslash (might also work on UNC paths and mapped drives).

**NewLabel**

Type: [String](../Concepts.md#strings)

If omitted, the drive will have no label. Otherwise, specify the new label to set.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Related"></a>
## Related

[DriveGetLabel](DriveGetLabel.md), [Drive functions](Drive.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Changes the volume label of the C drive.

```ahk
DriveSetLabel "C:", "Seagate200"
```
