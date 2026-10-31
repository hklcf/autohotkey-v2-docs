# OutputDebug

Sends a string to the debugger (if any) for display.

```ahk
OutputDebug Text
```

<a id="Parameters"></a>
## Parameters

**Text**

Type: [String](../Concepts.md#strings)

The text to send to the debugger for display. This text may include linefeed characters (\`n) to start new lines. In addition, a single long line can be broken up into several shorter ones by means of a [continuation section](../Scripts.md#continuation).

<a id="Remarks"></a>
## Remarks

If the script's process has no debugger, the system debugger displays the string. If the system debugger is not active, this function has no effect.

One example of a debugger is DebugView, which is free and available at [microsoft.com](https://learn.microsoft.com/sysinternals/downloads/debugview).

See also: [other debugging methods](../Scripts.md#debug)

<a id="Related"></a>
## Related

[FileAppend](FileAppend.md), [continuation sections](../Scripts.md#continuation)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Sends a string to the debugger (if any) for display.

```ahk
OutputDebug A_Now ': Because the window "' TargetWindowTitle '" did not exist, the process was aborted.'
```
