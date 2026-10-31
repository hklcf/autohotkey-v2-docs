# #WinActivateForce

Skips the gentle method of activating a window and goes straight to the forceful method.

```ahk
#WinActivateForce
```

Specifying this anywhere in a script will cause built-in functions that activate a window -- such as [WinActivate](WinActivate.md), [WinActivateBottom](WinActivateBottom.md), and [GroupActivate](GroupActivate.md) -- to skip the "gentle" method of activating a window and go straight to the more forceful methods.

Although this directive will usually not change how quickly or reliably a window is activated, it might prevent task bar buttons from flashing when different windows are activated quickly one after the other.

<a id="Remarks"></a>
## Remarks

Like other directives, #WinActivateForce cannot be executed conditionally.

<a id="Related"></a>
## Related

[WinActivate](WinActivate.md), [WinActivateBottom](WinActivateBottom.md), [GroupActivate](GroupActivate.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Enables the forceful method of activating a window.

```ahk
#WinActivateForce
```
