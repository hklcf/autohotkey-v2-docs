# While-loop

Performs one or more [statements](../Concepts.md#statement) repeatedly until the specified [expression](../Variables.md#Expressions) evaluates to false.

```ahk
While Expression
```

<a id="Parameters"></a>
## Parameters

**Expression**

Any valid [expression](../Variables.md#Expressions). For example: `while x < y`.

<a id="Remarks"></a>
## Remarks

The space or tab after `While` is optional if the expression is enclosed in parentheses, as in `While(expression)`.

The expression is evaluated once before each iteration. If the expression evaluates to true (which is any result other than an empty string or the number 0), the body of the loop is executed; otherwise, execution jumps to the line following the loop's body.

A while-loop is usually followed by a [block](Block.md), which is a collection of statements that form the *body* of the loop. However, a loop with only a single statement does not require a block (an "if" and its "else" count as a single statement for this purpose).

<a id="otb"></a>

The One True Brace (OTB) style may optionally be used, which allows the open-brace to appear on the same line rather than underneath. For example: `while x < y {`.

The built-in variable **A_Index** contains the number of the current loop iteration. It contains 1 the first time the loop's expression and body are executed. For the second time, it contains 2; and so on. If an inner loop is enclosed by an outer loop, the inner loop takes precedence. A_Index works inside all types of loops, but contains 0 outside of a loop.

As with all loops, [Break](Break.md) may be used to exit the loop prematurely. Also, [Continue](Continue.md) may be used to skip the rest of the current iteration, at which time A_Index is increased by 1 and the while-loop's expression is re-evaluated. If it is still true, a new iteration begins; otherwise, the loop ends.

The loop may optionally be followed by an [Else](Else.md) statement, which is executed if the loop had zero iterations.

Specialized loops: Loops can be used to automatically retrieve files, folders, or registry items (one at a time). See [file loop](LoopFiles.md) and [registry loop](LoopReg.md) for details. In addition, [file-reading loops](LoopRead.md) can operate on the entire contents of a file, one line at a time. Finally, [parsing loops](LoopParse.md) can operate on the individual fields contained inside a delimited string.

<a id="Related"></a>
## Related

[Until](Until.md), [Break](Break.md), [Continue](Continue.md), [Blocks](Block.md), [Loop](Loop.md), [For-loop](For.md), [Files-and-folders loop](LoopFiles.md), [Registry loop](LoopReg.md), [File-reading loop](LoopRead.md), [Parsing loop](LoopParse.md), [If](If.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** As the user drags the left mouse button, a tooltip displays the size of the region inside the drag-area.

```ahk
CoordMode "Mouse", "Screen"

~LButton::
{
    MouseGetPos &begin_x, &begin_y
    while GetKeyState("LButton")
    {
        MouseGetPos &x, &y
        ToolTip begin_x ", " begin_y "`n" Abs(begin_x-x) " x " Abs(begin_y-y)
        Sleep 10
    }
    ToolTip
}
```
