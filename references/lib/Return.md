# Return

Returns from a function to which execution had previously jumped via [function-call](../Functions.md), [Hotkey](../Hotkeys.md) activation, or other means.

```ahk
Return Expression
```

<a id="Parameters"></a>
## Parameters

**Expression**

This parameter can only be used within a [function](../Functions.md).

If omitted, it defaults to an empty string.

Since this parameter is an [expression](../Variables.md#Expressions), all of the following lines are valid:

```ahk
return 3
return "literal string"
return MyVar
return i + 1
return true  ; Returns the number 1 to mean "true".
return ItemCount < MaxItems  ; Returns a true or false value.
return FindColor(TargetColor)
```

<a id="Remarks"></a>
## Remarks

The space or tab after *Return* is optional if the expression is enclosed in parentheses, as in `return(expression)`.

If there is no caller to which to return, *Return* will do an [Exit](Exit.md) instead.

There are various ways to return multiple values from function to caller described within [Returning Values to Caller](../Functions.md#return).

<a id="Related"></a>
## Related

[Functions](../Functions.md), [Exit](Exit.md), [ExitApp](ExitApp.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reports the value returned by the function.

```ahk
MsgBox returnTest() ; Shows 123

returnTest() {
    return 123
}
```

<a id="ExUsage"></a>

**Example:** The first Return ensures that the subsequent function call is skipped if the preceding condition is true. The second Return is redundant when used at the end of a function like this.

```ahk
#z::  ; Win-Z
^#z::  ; Ctrl-Win-Z
{
    MsgBox "A Win-Z hotkey was pressed."
    if GetKeyState("Ctrl")
        return  ; Finish early, skipping the function call below.
    MyFunction()
}

MyFunction()
{
    Sleep 1000
    return  ; Redundant when used at the end of the function like this.
}
```
