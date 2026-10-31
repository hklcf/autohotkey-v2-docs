# FileRecycleEmpty

Empties the recycle bin.

```ahk
FileRecycleEmpty DriveLetter
```

<a id="Parameters"></a>
## Parameters

**DriveLetter**

Type: [String](../Concepts.md#strings)

If omitted, the recycle bin for all drives is emptied. Otherwise, specify a drive letter such as `"C:\"`.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

<a id="Related"></a>
## Related

[FileRecycle](FileRecycle.md), [FileDelete](FileDelete.md), [FileCopy](FileCopy.md), [FileMove](FileMove.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Empties the recycle bin of the C drive.

```ahk
FileRecycleEmpty "C:\"
```
