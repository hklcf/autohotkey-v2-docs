# Goto

Jumps to the specified label and continues execution.

```ahk
Goto Label
```

<a id="Parameters"></a>
## Parameters

**Label**

Type: [String](../Concepts.md#strings)

The name of the [label](../misc/Labels.md) to which to jump.

*Label* can be a variable or expression only if parentheses are used. For example, `Goto MyLabel` and `Goto("MyLabel")` both jump to `MyLabel:`.

<a id="Remarks"></a>
## Remarks

Performance is slightly reduced when using a dynamic label (that is, a variable or expression which returns a label name) because the target label must be "looked up" each time rather than only once when the script is first loaded. An error dialog will be displayed if the label does not exist. To avoid this, call [IsLabel()](IsLabel.md) beforehand. For example:

```ahk
if IsLabel(VarContainingLabelName)
    Goto(VarContainingLabelName)
```

The use of Goto is discouraged because it generally makes scripts less readable and harder to maintain. Consider using [Else](Else.md), [Blocks](Block.md), [Break](Break.md), and [Continue](Continue.md) as substitutes for Goto.

<a id="Related"></a>
## Related

[Return](Return.md), [IsLabel](IsLabel.md), [Else](Else.md), [Blocks](Block.md), [Break](Break.md), [Continue](Continue.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Jumps to the label named "MyLabel" and continues execution.

```ahk
Goto MyLabel
; ...
MyLabel:
Sleep 100
; ...
```
