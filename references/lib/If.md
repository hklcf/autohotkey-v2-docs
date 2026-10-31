# If

Specifies one or more [statements](../Concepts.md#statement) to execute if an [expression](../Variables.md#Expressions) evaluates to true.

```ahk
If Expression
{
    Statements
}
```

<a id="Remarks"></a>
## Remarks

If the *If* statement's expression evaluates to true (which is any result other than an empty string or the number 0), the line or [block](Block.md) underneath it is executed. Otherwise, if there is a corresponding [Else](Else.md) statement, execution jumps to the line or block underneath it.

If an *If* owns more than one line, those lines must be enclosed in braces (to create a [block](Block.md)). However, if only one line belongs to an *If*, the braces are optional. See the examples at the bottom of this page.

The space after `if` is optional if the expression starts with an open-parenthesis, as in `if(expression)`.

<a id="otb"></a>

The [One True Brace (OTB) style](Block.md#otb) may optionally be used. For example:

```ahk
if (x < y) {
    ; ...
}
if WinExist("Untitled - Notepad") {
    WinActivate
}
if IsDone {
    ; ...
} else {
    ; ...
}
```

Unlike an *If* statement, an [Else](Else.md) statement supports any type of statement immediately to its right.

<a id="Related"></a>
## Related

[Expressions](../Variables.md#Expressions), [Ternary operator (a?b:c)](../Variables.md#ternary), [Blocks](Block.md), [Else](Else.md), [While-loop](While.md)

<a id="Examples"></a>
## Examples

<a id="ExOne"></a>

**Example:** If *A_Index* is greater than 100, return.

```ahk
if (A_Index > 100)
    return
```

<a id="ExMultiple"></a>

**Example:** If the result of `A_TickCount - StartTime` is greater than the result of `2*MaxTime + 100`, show "Too much time has passed." and terminate the script.

```ahk
if (A_TickCount - StartTime > 2*MaxTime + 100)
{
    MsgBox "Too much time has passed."
    ExitApp
}
```

<a id="ExComplex"></a>

**Example:** This example is executed as follows:

1. If *Color* is the word "Blue" or "White":
    1. Show "The color is one of the allowed values.".
    2. Terminate the script.
2. Otherwise if *Color* is the word "Silver":
    1. Show "Silver is not an allowed color.".
    2. Stop further checks.
3. Otherwise:
    1. Show "This color is not recognized.".
    2. Terminate the script.

```ahk
if (Color = "Blue" or Color = "White")
{
    MsgBox "The color is one of the allowed values."
    ExitApp
}
else if (Color = "Silver")
{
    MsgBox "Silver is not an allowed color."
    return
}
else
{
    MsgBox "This color is not recognized."
    ExitApp
}
```

<a id="ExMultiStatement"></a>

**Example:** A single [multi-statement](../Variables.md#comma) line does not need to be enclosed in braces.

```ahk
MyVar := 3
if (MyVar > 2)
    MyVar++, MyVar := MyVar - 4, MyVar .= " test"
MsgBox MyVar  ; Reports "0 test".
```

<a id="ExIfBetween"></a>

**Example:** Similar to AutoHotkey v1's [If Var [not] between Lower and Upper](https://www.autohotkey.com/docs/v1/lib/IfBetween.htm), the following examples check whether a [variable's](../Variables.md) contents are numerically or alphabetically between two values (inclusive).

Checks whether *var* is in the range 1 to 5:

```ahk
if (var >= 1 and var <= 5)
    MsgBox var " is in the range 1 to 5, inclusive."
```

Checks whether *var* is in the range 0.0 to 1.0:

```ahk
if not (var >= 0.0 and var <= 1.0)
    MsgBox var " is not in the range 0.0 to 1.0, inclusive."
```

Checks whether *var* is between *VarLow* and *VarHigh* (inclusive):

```ahk
if (var >= VarLow and var <= VarHigh)
    MsgBox var " is between " VarLow " and " VarHigh "."
```

Checks whether *var* is alphabetically between the words blue and red (inclusive):

```ahk
if (StrCompare(var, "blue") >= 0) and (StrCompare(var, "red") <= 0)
    MsgBox var " is alphabetically between the words blue and red."
```

Allows the user to enter a number and checks whether it is in the range 1 to 10:

```ahk
LowerLimit := 1
UpperLimit := 10
IB := InputBox("Enter a number between " LowerLimit " and " UpperLimit)
if not (IB.Value >= LowerLimit and IB.Value <= UpperLimit)
    MsgBox "Your input is not within the valid range."
```

<a id="ExIfInContains"></a>

**Example:** Similar to AutoHotkey v1's [If Var [not] in/contains MatchList](https://www.autohotkey.com/docs/v1/lib/IfIn.htm), the following examples check whether a [variable's](../Variables.md) contents match one of the items in a list.

Checks whether *var* is the file extension exe, bat or com:

```ahk
if (var ~= "i)\A(exe|bat|com)\z")
    MsgBox "The file extension is an executable type."
```

Checks whether *var* is the prime number 1, 2, 3, 5, 7 or 11:

```ahk
if (var ~= "\A(1|2|3|5|7|11)\z")
    MsgBox var " is a small prime number."
```

Checks whether *var* contains the digit 1 or 3:

```ahk
if (var ~= "1|3")
    MsgBox "Var contains the digit 1 or 3 (Var could be 1, 3, 10, 21, 23, etc.)"
```

Checks whether *var* is one of the items in *MyItemList*:

```ahk
; Uncomment the following line if MyItemList contains RegEx chars except |
; MyItemList := RegExReplace(MyItemList, "[\Q\.*?+[{()^$\E]", "\$0")
if (var ~= "i)\A(" MyItemList ")\z")
    MsgBox var " is in the list."
```

Allows the user to enter a string and checks whether it is the word yes or no:

```ahk
IB := InputBox("Enter YES or NO")
if not (IB.Value ~= "i)\A(yes|no)\z")
    MsgBox "Your input is not valid."
```

Checks whether *active_title* contains "Address List.txt" or "Customer List.txt" and checks whether it contains "metapad" or "Notepad":

```ahk
active_title := WinGetTitle("A")
if (active_title ~= "i)Address List\.txt|Customer List\.txt")
    MsgBox "One of the desired windows is active."
if not (active_title ~= "i)metapad|Notepad")
    MsgBox "But the file is not open in either Metapad or Notepad."
```
