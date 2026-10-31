# IsLabel

Returns a non-zero number if the specified label exists in the current scope.

```ahk
Boolean := IsLabel(LabelName)
```

<a id="Parameters"></a>
## Parameters

**LabelName**

Type: [String](../Concepts.md#strings)

The name of a [label](../misc/Labels.md). The trailing colon should not be included.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 1 (true) if the specified label exists within the current scope, otherwise 0 (false).

<a id="Remarks"></a>
## Remarks

This function is useful to avoid runtime errors when specifying a dynamic label for [Goto](Goto.md).

When called from inside a function, only that function's labels are searched. Global labels are not valid targets for a local goto.

<a id="Related"></a>
## Related

[Labels](../misc/Labels.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Reports "Target label exists" because the label does exist.

```ahk
if IsLabel("Label")
    MsgBox "Target label exists"
else
    MsgBox "Target label doesn't exist"

Label:
return
```
