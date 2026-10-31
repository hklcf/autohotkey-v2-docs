# Continue

Skips the rest of a [loop statement](../Language.md#loop-statement)'s current iteration and begins a new one.

```ahk
Continue LoopLabel
```

<a id="Parameters"></a>
## Parameters

**LoopLabel**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If omitted or 1, this statement applies to the innermost loop in which it is enclosed. Otherwise, specify which loop this statement should apply to; either by [label name](../misc/Labels.md) or numeric nesting level. If a [label](../misc/Labels.md) is specified, it must point directly at a [loop statement](../Language.md#loop-statement).

*LoopLabel* must be a constant value - variables and expressions are not supported, with the exception of a single literal number or quoted string enclosed in parentheses. For example: `continue("outer")`

<a id="Remarks"></a>
## Remarks

Continue behaves the same as reaching the loop's closing brace:

1. It skips the rest of the loop's body.
2. The loop's [Until](Until.md) expression (if it has one) is evaluated.
3. [A_Index](../Variables.md#Index) is increased by 1.
4. The loop's own condition (if it has one) is checked to see if it is satisfied. If so, a new iteration begins; otherwise the loop ends.

The use of [Break](Break.md) and Continue are encouraged over [Goto](Goto.md) since they usually make scripts more readable and maintainable.

<a id="Related"></a>
## Related

[Break](Break.md), [Loop](Loop.md), [Until](Until.md), [While-loop](While.md), [For-loop](For.md), [Blocks](Block.md), [Labels](../misc/Labels.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Displays 5 message boxes, one for each number between 6 and 10. Note that in the first 5 iterations of the loop, the Continue statement causes the loop to start over before it reaches the MsgBox line.

```ahk
Loop 10
{
    if (A_Index <= 5)
        continue
    MsgBox A_Index
}
```

<a id="ExContinueOuter"></a>

**Example:** Continues the outer loop from within a nested loop.

```ahk
outer:
Loop 3
{
    x := A_Index
    Loop 3
    {
        if (x*A_Index = 4)
            continue outer  ; Equivalent to continue 2 or goto continue_outer.
        MsgBox x "," A_Index
    }
    continue_outer: ; For goto.
}
```
