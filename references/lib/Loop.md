# Loop (normal)

Performs one or more [statements](../Concepts.md#statement) repeatedly: either the specified number of times or until [Break](Break.md) is encountered.

```ahk
Loop Count
```

<a id="Parameters"></a>
## Parameters

**Count**

Type: [Integer](../Concepts.md#numbers)

If omitted, the loop continues indefinitely until a [Break](Break.md) or [Return](Return.md) is encountered. Otherwise, specify how many times (iterations) to perform the loop. However, an explicit blank value or number less than 1 causes the loop to be skipped entirely.

*Count* is evaluated only once, right before the loop begins. For instance, if *Count* is an expression with side-effects such as function calls or assignments, the side-effects occur only once.

If *Count* is enclosed in parentheses, a space or tab is not required. For example: `Loop(2)`

<a id="Remarks"></a>
## Remarks

The loop statement is usually followed by a [block](Block.md), which is a collection of statements that form the *body* of the loop. However, a loop with only a single statement does not require a block (an "if" and its "else" count as a single statement for this purpose).

A common use of this statement is an infinite loop that uses the [Break](Break.md) statement somewhere in the loop's *body* to determine when to stop the loop.

The use of [Break](Break.md) and [Continue](Continue.md) inside a loop are encouraged as alternatives to [Goto](Goto.md), since they generally make a script more understandable and maintainable. One can also create a "While" or "Do...While/Until" loop by making the first or last statement of the loop's *body* an IF statement that conditionally issues the [Break](Break.md) statement, but the use of [While](While.md) or [Loop...Until](Until.md) is usually preferred.

The built-in variable **A_Index** contains the number of the current loop iteration. It contains 1 the first time the loop's *body* is executed. For the second time, it contains 2; and so on. If an inner loop is enclosed by an outer loop, the inner loop takes precedence. A_Index works inside all types of loops, including [file loops](LoopFiles.md) and [registry loops](LoopReg.md); but A_Index contains 0 outside of a loop.

A_Index can be assigned any integer value by the script. If *Count* is specified, changing A_Index affects the number of iterations that will be performed. For example, `A_Index := 3` would make the loop statement act as though it is on the third iteration (A_Index will be 4 on the next iteration), while `A_Index--` would prevent the current iteration from being counted toward the total.

The loop may optionally be followed by an [Else](Else.md) statement, which is executed if *Count* is zero.

The [One True Brace (OTB) style](Block.md#otb) may optionally be used. For example:

```ahk
Loop {
    ...
}
Loop RepeatCount {
    ...
}
```

Specialized loops: Loops can be used to automatically retrieve files, folders, or registry items (one at a time). See [file loop](LoopFiles.md) and [registry loop](LoopReg.md) for details. In addition, [file-reading loops](LoopRead.md) can operate on the entire contents of a file, one line at a time. Finally, [parsing loops](LoopParse.md) can operate on the individual fields contained inside a delimited string.

<a id="Related"></a>
## Related

[Until](Until.md), [While-loop](While.md), [For-loop](For.md), [Files-and-folders loop](LoopFiles.md), [Registry loop](LoopReg.md), [File-reading loop](LoopRead.md), [Parsing loop](LoopParse.md), [Break](Break.md), [Continue](Continue.md), [Blocks](Block.md), [Else](Else.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Creates a loop with 3 iterations.

```ahk
Loop 3
{
    MsgBox "Iteration number is " A_Index  ; A_Index will be 1, 2, then 3
    Sleep 100
}
```

<a id="ExBreakContinue"></a>

**Example:** Creates an infinite loop, but it will be terminated after the 25th iteration.

```ahk
Loop
{
    if (A_Index > 25)
        break  ; Terminate the loop
    if (A_Index < 20)
        continue ; Skip the below and start a new iteration
    MsgBox "A_Index = " A_Index ; This will display only the numbers 20 through 25
}
```
