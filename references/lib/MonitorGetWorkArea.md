# MonitorGetWorkArea

Checks if the specified monitor exists and optionally retrieves the bounding coordinates of its working area.

```ahk
ActualN := MonitorGetWorkArea(N, &Left, &Top, &Right, &Bottom)
```

<a id="Parameters"></a>
## Parameters

**N**

Type: [Integer](../Concepts.md#numbers)

If omitted, the primary monitor will be used. Otherwise, specify the monitor number, between 1 and the number returned by [MonitorGetCount](MonitorGetCount.md).

**&Left, &Top, &Right, &Bottom**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify references to the output variables in which to store the bounding coordinates of the working area, in pixels.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the monitor number (the same as *N* unless *N* was omitted).

<a id="Error_Handling"></a>
## Error Handling

On failure, an exception is thrown and the output variables are not modified.

<a id="Remarks"></a>
## Remarks

The working area of a monitor excludes the area occupied by the taskbar and other registered desktop toolbars.

<a id="Related"></a>
## Related

[MonitorGet](MonitorGet.md), [SysGet](SysGet.md), [Monitor functions](Monitor.md)

<a id="Examples"></a>
## Examples

See [example #1](Monitor.md#ExLoopAll) on the [Monitor Functions](Monitor.md) page for a demonstration of this function.
