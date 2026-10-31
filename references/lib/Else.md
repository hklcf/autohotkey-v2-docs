# Else

Specifies one or more [statements](../Concepts.md#statement) to execute if the associated statement's body did not execute.

```ahk
Else Statement
```

```ahk
Else
{
    Statements
}
```

<a id="Remarks"></a>
## Remarks

Every use of *Else* must belong to (be associated with) an [If](If.md), [Catch](Catch.md), [For](For.md), [Loop](Loop.md) or [While](While.md) statement above it. An *Else* always belongs to the nearest applicable unclaimed statement above it unless a [block](Block.md) is used to change that behavior. The condition for an *Else* statement executing depends on the associated statement:

- [If expression](If.md): The expression evaluated to false.
- [For](For.md), [Loop](Loop.md) (any kind), [While](While.md): The loop had zero iterations.
- [Loop Read](LoopRead.md): As above, but the presence of *Else* also prevents an error from being thrown if the file or path is not found. Therefore, *Else* executes if the file is empty or does not exist.
- [Try](Try.md)...[Catch](Catch.md): No exception was thrown within the *Try* block.

An *Else* can be followed immediately by any other single [statement](../Concepts.md#statement) on the same line. This is most often used for "else if" ladders (see examples at the bottom).

If an *Else* owns more than one line, those lines must be enclosed in braces (to create a [block](Block.md)). However, if only one line belongs to an *Else*, the braces are optional. For example:

```ahk
if (count > 0)  ; No braces are required around the next line because it's only a single line.
    MsgBox "Press OK to begin the process."
else  ; Braces must be used around the section below because it consists of more than one line.
{
    WinClose "Untitled - Notepad"
    MsgBox "There are no items present."
}
```

The [One True Brace (OTB) style](Block.md#otb) may optionally be used around an *Else*. For example:

```ahk
if IsDone {
    ; ...
} else if (x < y) {
    ; ...
} else {
    ; ...
}
```

<a id="Related"></a>
## Related

[Blocks](Block.md), [If](If.md), [Control Flow Statements](../Language.md#control-flow)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Common usage of an *Else* statement. This example is executed as follows:

1. If Notepad exists:
    1. Activate it
    2. Send the string "This is a test." followed by `Enter`.
2. Otherwise (that is, if Notepad does not exist):
    1. Activate another window
    2. Left-click at the coordinates 100, 200

```ahk
if WinExist("Untitled - Notepad")
{
    WinActivate
    Send "This is a test.{Enter}"
}
else
{
    WinActivate "Some Other Window"
    MouseClick "Left", 100, 200
}
```

<a id="ExOtherUsages"></a>

**Example:** Demonstrates different styles of how the *Else* statement can be used too.

```ahk
if (x = 1)
    firstFunction()
else if (x = 2) ; "else if" style
    secondFunction()
else if x = 3
{
    thirdFunction()
    Sleep 1
}
else defaultFunction()  ; i.e. Any single statement can be on the same line with an Else.
```

<a id="ExLoop"></a>

**Example:** Executes some code if a loop had zero iterations.

```ahk
; Show File/Internet Explorer windows/tabs.
for window in ComObject("Shell.Application").Windows
    MsgBox "Window #" A_Index ": " window.LocationName
else
    MsgBox "No shell windows found."
```
