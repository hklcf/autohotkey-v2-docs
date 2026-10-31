# MonitorGetName

Returns the operating system's name of the specified monitor.

```ahk
Name := MonitorGetName(N)
```

<a id="Parameters"></a>
## Parameters

**N**

Type: [Integer](../Concepts.md#numbers)

If omitted, the primary monitor will be used. Otherwise, specify the monitor number, between 1 and the number returned by [MonitorGetCount](MonitorGetCount.md).

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the operating system's name for the specified monitor.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Related"></a>
## Related

[SysGet](SysGet.md), [Monitor functions](Monitor.md)

<a id="Examples"></a>
## Examples

See [example #1](Monitor.md#ExLoopAll) on the [Monitor Functions](Monitor.md) page for a demonstration of this function.
