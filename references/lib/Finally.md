# Finally

Ensures that one or more [statements](../Concepts.md#statement) are always executed after a [Try](Try.md) statement finishes.

```ahk
Finally Statement
```

```ahk
Finally
{
    Statements
}
```

<a id="Remarks"></a>
## Remarks

Every use of *Finally* must belong to (be associated with) a [Try](Try.md) statement above it (after any optional [Catch](Catch.md) and/or [Else](Else.md)). A *Finally* always belongs to the nearest unclaimed *Try* statement above it unless a [block](Block.md) is used to change that behavior.

*Try* statements behave differently depending on whether *Catch* or *Finally* is present. For more information, see [Try](Try.md).

*Goto*, *Break*, *Continue* and *Return* cannot be used to exit a *Finally* block, as that would require suppressing any control flow statements within the *Try* block. For example, if *Try* uses `return 42`, the value 42 is returned after the *Finally* block executes. Attempts to jump out of a *Finally* block using one of these statements are detected as errors at load time where possible, or at run time otherwise.

*Finally* statements are not executed if the script is directly terminated by any means, including the tray menu or [ExitApp](ExitApp.md).

The [One True Brace (OTB) style](Block.md#otb) may optionally be used with the *Finally* statement. For example:

```ahk
try {
    ...
} finally {
    ...
}

try {
    ...
} catch {
    ...
} else {
    ...
} finally {
    ...
}
```

<a id="Related"></a>
## Related

[Try](Try.md), [Catch](Catch.md), [Else](Else.md), [Throw](Throw.md), [Blocks](Block.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Demonstrates the behavior of *Finally* in detail.

```ahk
try
{
    ToolTip "Working..."
    Example1()
}
catch as e
{
    ; For more detail about the object that e contains, see Error.
    MsgBox(Type(e) " thrown!`n`nwhat: " e.what "`nfile: " e.file
        . "`nline: " e.line "`nmessage: " e.message "`nextra: " e.extra,, 16)
}
finally
{
    ToolTip ; hide the tooltip
}

MsgBox "Done!"

; This function has a Finally block that acts as cleanup code
Example1()
{
    try
        Example2()
    finally
        MsgBox "This is always executed regardless of exceptions"
}

; This function fails when the minutes are odd
Example2()
{
    if Mod(A_Min, 2)
        throw Error("That's odd...")
    MsgBox "Example2 did not fail"
}
```
