# Monitor Functions

Functions for retrieving screen resolution and multi-monitor info. Click on a function name for details.

| Function | Description |
| --- | --- |
| [MonitorGet](MonitorGet.md) | Checks if the specified monitor exists and optionally retrieves its bounding coordinates. |
| [MonitorGetCount](MonitorGetCount.md) | Returns the total number of monitors. |
| [MonitorGetName](MonitorGetName.md) | Returns the operating system's name of the specified monitor. |
| [MonitorGetPrimary](MonitorGetPrimary.md) | Returns the number of the primary monitor. |
| [MonitorGetWorkArea](MonitorGetWorkArea.md) | Checks if the specified monitor exists and optionally retrieves the bounding coordinates of its working area. |

<a id="Remarks"></a>
## Remarks

The built-in variables [A_ScreenWidth](../Variables.md#Screen) and [A_ScreenHeight](../Variables.md#Screen) contain the dimensions of the primary monitor, in pixels.

[SysGet](SysGet.md) can be used to retrieve the bounding rectangle of all display monitors. For example, this retrieves the width and height of the virtual screen:

```ahk
MsgBox SysGet(78) " x " SysGet(79)
```

<a id="Related"></a>
## Related

[DllCall](DllCall.md), [Win functions](Win.md), [SysGet](SysGet.md)

<a id="Examples"></a>
## Examples

<a id="ExLoopAll"></a>

**Example:** Displays info about each monitor.

```ahk
MonitorCount := MonitorGetCount()
MonitorPrimary := MonitorGetPrimary()
MsgBox "Monitor Count:`t" MonitorCount "`nPrimary Monitor:`t" MonitorPrimary
Loop MonitorCount
{
    MonitorGet A_Index, &L, &T, &R, &B
    MonitorGetWorkArea A_Index, &WL, &WT, &WR, &WB
    MsgBox
    (
        "Monitor:`t#" A_Index "
        Name:`t" MonitorGetName(A_Index) "
        Left:`t" L " (" WL " work)
        Top:`t" T " (" WT " work)
        Right:`t" R " (" WR " work)
        Bottom:`t" B " (" WB " work)"
    )
}
```
