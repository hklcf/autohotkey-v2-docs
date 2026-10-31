# MonitorGet

Checks if the specified monitor exists and optionally retrieves its bounding coordinates.

```ahk
ActualN := MonitorGet(N, &Left, &Top, &Right, &Bottom)
```

<a id="Parameters"></a>
## Parameters

**N**

Type: [Integer](../Concepts.md#numbers)

If omitted, the primary monitor will be used. Otherwise, specify the monitor number, between 1 and the number returned by [MonitorGetCount](MonitorGetCount.md).

**&Left, &Top, &Right, &Bottom**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify references to the output variables in which to store the bounding coordinates, in pixels.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the monitor number (the same as *N* unless *N* was omitted).

<a id="Error_Handling"></a>
## Error Handling

On failure, an exception is thrown and the output variables are not modified.

<a id="Remarks"></a>
## Remarks

The built-in variables [A_ScreenWidth](../Variables.md#Screen) and [A_ScreenHeight](../Variables.md#Screen) contain the dimensions of the primary monitor, in pixels.

[SysGet](SysGet.md) can be used to retrieve the bounding rectangle of all display monitors. For example, this retrieves the width and height of the virtual screen:

```ahk
MsgBox SysGet(78) " x " SysGet(79)
```

<a id="Related"></a>
## Related

[MonitorGetWorkArea](MonitorGetWorkArea.md), [SysGet](SysGet.md), [Monitor functions](Monitor.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Shows the bounding coordinates of the second monitor in a message box.

```ahk
try
{
    MonitorGet 2, &Left, &Top, &Right, &Bottom
    MsgBox "Left: " Left " -- Top: " Top " -- Right: " Right " -- Bottom: " Bottom
}
catch
    MsgBox "Monitor 2 doesn't exist or an error occurred."
```

See [example #1](Monitor.md#ExLoopAll) on the [Monitor Functions](Monitor.md) page for another demonstration of this function.
