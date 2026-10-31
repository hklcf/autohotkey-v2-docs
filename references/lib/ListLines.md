# ListLines

Enables or disables line logging or displays the script lines most recently executed.

```ahk
PrevSetting := ListLines(Setting)
```

<a id="Parameters"></a>
## Parameters

**Setting**

Type: [Integer (boolean)](../Concepts.md#boolean)

If omitted, the history of lines most recently executed is shown, which is equivalent to selecting the corresponding menu item in the [main window](../Program.md#main-window). It can help [debug a script](../Scripts.md#debug).

Otherwise, specify one of the following numbers to disable or enable line logging:

**0** (false): Disables line logging, meaning subsequently-executed lines are omitted from the history.

**1** (true): Enables line logging.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns the previous setting; either 0 (false) for disabled or 1 (true) for enabled.

<a id="Remarks"></a>
## Remarks

By default, line logging is enabled.

Disabling line logging selectively can help prevent the history from filling up too quickly, such as in a loop with many fast iterations. The line which disables/enables line logging is also removed from the line history, to prevent clutter. Additionally, performance may be reduced by a few percent while line logging is enabled.

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

The built-in variable [A_ListLines](../Variables.md#ListLines) contains the current setting and can also be assigned a new value instead of calling ListLines.

On a related note, the built-in variables [A_LineNumber](../Variables.md#LineNumber) and [A_LineFile](../Variables.md#LineFile) contain the currently executing line number and the file name to which it belongs.

<a id="Related"></a>
## Related

[KeyHistory](KeyHistory.md), [ListHotkeys](ListHotkeys.md), [ListVars](ListVars.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Enables and disables line logging for specific lines and then displays the result.

```ahk
x := "This line is logged"
ListLines False
x := "This line is not logged"
ListLines True
ListLines
MsgBox
```
