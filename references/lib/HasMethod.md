# HasMethod

Returns a non-zero number if the specified value has a method by the specified name.

```ahk
HasMethod := HasMethod(Value , Name, ParamCount)
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [Any](../Concepts.md#values)

Any value, of any type except ComObject.

**Name**

Type: [String](../Concepts.md#strings)

If omitted, *Value* itself is checked whether it is callable. Otherwise, specify the method name to check for.

**ParamCount**

Type:

Integer

If omitted (or if the parameter count was not verified), a basic check is performed for a Call method to verify that the object is most likely callable.

Otherwise, specify the number of parameters that would be passed to the method or function. If specified, the method's MinParams, MaxParams and IsVariadic properties may be queried to verify that it can accept this number of parameters. If those properties are not present, the parameter count is not verified.

This count should not include the implicit `this` parameter.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 1 (true) if a method was found and passed validation (if performed), otherwise 0 (false).

<a id="Remarks"></a>
## Remarks

HasMethod has the same [limitations](GetMethod.md#Remarks) as [GetMethod](GetMethod.md).

This function can be used to estimate whether a value supports a specific action. For example, values without a Call method cannot be called or passed to [SetTimer](SetTimer.md), while values without either an \__Enum method or a Call method cannot be passed to [For](For.md). However, the existence of a method does not guarantee that it can be called, since there are requirements that must be met, such as parameter count.

When *ParamCount* is specified, the validation this function performs is equivalent to the validation performed by built-in functions such as [SetTimer](SetTimer.md).

A return value of 0 (false) does not necessarily indicate that the method cannot be called, as the value may have a \__Call [meta-function](../Objects.md#Meta_Functions). However, \__Call is not triggered in certain contexts, such as when \__Enum is being called by [For](For.md). If \__Call is present, there is no way to detect which methods it may support.

This function supports [primitive values](../Objects.md#primitive).

<a id="Related"></a>
## Related

[Objects](../Objects.md), [HasBase](HasBase.md), [HasProp](HasProp.md), [GetMethod](GetMethod.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Illustrates the use of this function.

```ahk
MsgBox HasMethod(0, "HasMethod") ; 1
MsgBox HasMethod(0, "Call") ; 0
```
