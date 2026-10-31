# Until

Applies a condition to the continuation of a Loop or For-loop.

```ahk
Loop {
    ...
} Until Expression
```

<a id="Parameters"></a>
## Parameters

**Expression**

Any valid [expression](../Variables.md#Expressions).

<a id="Remarks"></a>
## Remarks

The space or tab after `Until` is optional if the expression is enclosed in parentheses, as in `until(expression)`.

The expression is evaluated once after each iteration, and is evaluated even if [Continue](Continue.md) was used. If the expression evaluates to false (which is an empty string or the number 0), the loop continues; otherwise, the loop is broken and execution continues at the line following *Until*.

Loop Until is shorthand for the following:

```ahk
Loop {
    ...
    if (Expression)
        break
}
```

However, Loop Until is often easier to understand and unlike the above, can be used with a single-line action. For example:

```ahk
Loop
    x *= 2
Until x > y
```

*Until* can be used with any Loop or For. For example:

```ahk
Loop Read, A_ScriptFullPath
    lines .= A_LoopReadLine . "`n"
Until A_Index=5  ; Read the first five lines.
MsgBox lines
```

If [A_Index](../Variables.md#Index) is used in *Expression*, it contains the index of the iteration which has just finished.

<a id="Related"></a>
## Related

[Loop](Loop.md), [While-loop](While.md), [For-loop](For.md), [Break](Break.md), [Continue](Continue.md), [Blocks](Block.md), [Files-and-folders loop](LoopFiles.md), [Registry loop](LoopReg.md), [File-reading loop](LoopRead.md), [Parsing loop](LoopParse.md), [If](If.md)
