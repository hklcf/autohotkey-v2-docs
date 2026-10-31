# ListVars

Displays the script's [variables](../Variables.md): their names and current contents.

```ahk
ListVars
```

<a id="Remarks"></a>
## Remarks

This function is equivalent to selecting the "View-\>Variables" menu item in the [main window](../Program.md#main-window). It can help [debug a script](../Scripts.md#debug).

For each variable in the list, the variable's name and contents are shown, along with other information depending on what the variable contains. Each item is terminated with a carriage return and newline (`` `r`n ``), but may span multiple lines if the variable contains `` `r`n ``.

List items may take the following forms (where words in *italics* are placeholders):

```
VarName[Length of Capacity]: String
VarName: TypeName object {Info}
VarName: Number
```

*Capacity* is the variable's current [capacity](VarSetStrCapacity.md).

*String* is the first 60 characters of the variable's string value.

*Info* depends on the type of object, but is currently very limited.

If ListVars is used inside a [function](../Functions.md), the following are listed:

- [Local variables](../Functions.md#Local), including variables of outer functions which are referenced by the current function.
- [Static variables](../Functions.md#static) for the current function. [Global variables](../Functions.md#Global) declared inside the function are also listed in this section.
- If the current function is nested inside another function, static variables of each outer function are also listed.
- All [global variables](../Functions.md#Global).

<a id="Related"></a>
## Related

[KeyHistory](KeyHistory.md), [ListHotkeys](ListHotkeys.md), [ListLines](ListLines.md)

The [DebugVars](https://github.com/Lexikos/DebugVars.ahk#debugvars) script can be used to inspect and change the contents of variables and objects.

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Displays information about the script's variables.

```ahk
var1 := "foo"
var2 := "bar"
obj := []
ListVars
Pause
```
