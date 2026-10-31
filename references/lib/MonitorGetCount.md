# MonitorGetCount

Returns the total number of monitors.

```ahk
Count := MonitorGetCount()
```

<a id="Parameters"></a>
## Parameters

This function has no parameters.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the total number of monitors.

<a id="Remarks"></a>
## Remarks

Unlike the SM_CMONITORS system property retrieved via `SysGet(80)`, the return value includes all monitors, even those not being used as part of the desktop.

<a id="Related"></a>
## Related

[SysGet](SysGet.md), [Monitor functions](Monitor.md)

<a id="Examples"></a>
## Examples

See [example #1](Monitor.md#ExLoopAll) on the [Monitor Functions](Monitor.md) page for a demonstration of this function.
