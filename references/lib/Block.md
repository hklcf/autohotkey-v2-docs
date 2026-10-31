# {...} (block)

Blocks are one or more [statements](../Concepts.md#statement) enclosed in braces. Typically used with [function definitions](../Functions.md#define) and [control flow statements](../Language.md#control-flow).

```ahk
{
    Statements
}
```

<a id="Remarks"></a>
## Remarks

A block is used to bind two or more [statements](../Concepts.md#statement) together. It can also be used to change which [If statement](If.md) an [Else statement](Else.md) belongs to, as in this example where the block forces the Else statement to belong to the first If statement rather than the second:

```ahk
if (Var1 = 1)
{
    if (Var2 = "abc")
        Sleep 1
}
else
    return
```

Although blocks can be used anywhere, currently they are only meaningful when used with [function definitions](../Functions.md#define), [If](If.md), [Else](Else.md), [Loop statements](../Language.md#loop-statement), [Try](Try.md), [Catch](Catch.md) or [Finally](Finally.md).

If any of the control flow statements mentioned above has only a single statement, that statement need not be enclosed in a block (this does not work for function definitions). However, there may be cases where doing so enhances the readability or maintainability of the script.

A block may be empty (contain zero statements), which may be useful in cases where you want to comment out the contents of the block without removing the block itself.

<a id="otb"></a>

**One True Brace (OTB, K&R style):** The OTB style may optionally be used in the following places: [function definitions](../Functions.md#define), [If](If.md), [Else](Else.md), [Loop](../Language.md#loop-statement), [While](While.md), [For](For.md), [Try](Try.md), [Catch](Catch.md), and [Finally](Finally.md). This style puts the block's opening brace on the same line as the block's controlling statement rather than underneath on a line by itself. For example:

```ahk
MyFunction(x, y) {
    ...
}
if (x < y) {
    ...
} else {
    ...
}
Loop RepeatCount {
    ...
}
While x < y {
    ...
}
For k, v in obj {
    ...
}
Try {
    ...
} Catch Error {
    ...
} Finally {
    ....
}
```

Similarly, a statement may exist to the right of a brace (except the open-brace of the One True Brace style). For example:

```ahk
if (x = 1)
{ MsgBox "This line appears to the right of an opening brace. It executes whenever the IF-statement is true."
    MsgBox "This is the next line."
} MsgBox "This line appears to the right of a closing brace. It executes unconditionally."
```

<a id="Related"></a>
## Related

[Function Definitions](../Functions.md#define), [Control Flow Statements](../Language.md#control-flow), [If](If.md), [Else](Else.md), [Loop Statements](../Language.md#loop-statement), [Try](Try.md), [Catch](Catch.md), [Finally](Finally.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** By enclosing the two statements `MsgBox "test1"` and `Sleep 5` with braces, the If statement knows that it should execute both if *x* is equal to 1.

```ahk
if (x = 1)
{
    MsgBox "test1"
    Sleep 5
}
else
    MsgBox "test2"
```
