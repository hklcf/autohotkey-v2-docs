# Break

Exits (terminates) any type of [loop statement](../Language.md#loop-statement).

```ahk
Break LoopLabel
```

<a id="Parameters"></a>
## Parameters

**LoopLabel**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If omitted or 1, this statement applies to the innermost loop in which it is enclosed. Otherwise, specify which loop this statement should apply to; either by [label name](../misc/Labels.md) or numeric nesting level. If a [label](../misc/Labels.md) is specified, it must point directly at a [loop statement](../Language.md#loop-statement).

*LoopLabel* must be a constant value - variables and expressions are not supported, with the exception of a single literal number or quoted string enclosed in parentheses. For example: `break("outer")`

<a id="Remarks"></a>
## Remarks

The use of Break and [Continue](Continue.md) are encouraged over [Goto](Goto.md) since they usually make scripts more readable and maintainable.

<a id="Related"></a>
## Related

[Continue](Continue.md), [Loop](Loop.md), [While-loop](While.md), [For-loop](For.md), [Blocks](Block.md), [Labels](../misc/Labels.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Breaks the loop if *var* is greater than 25.

```ahk
Loop
{
    ; ...
    if (var > 25)
        break
    ; ...
    if (var <= 5)
        continue
}
```

<a id="ExBreakOuter"></a>

**Example:** Breaks the outer loop from within a nested loop.

```ahk
outer:
Loop 3
{
    x := A_Index
    Loop 3
    {
        if (x*A_Index = 6)
            break outer  ; Equivalent to break 2 or goto break_outer.
        MsgBox x "," A_Index
    }
}
break_outer: ; For goto.
```
