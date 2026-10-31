# Enumerator Object

An enumerator is a type of [function object](../misc/Functor.md) which is called repeatedly to enumerate a sequence of values.

Enumerators exist primarily to support [For-loops](For.md), and are not usually called directly. The for-loop documentation details the process by which an enumerator is called. The script may implement an enumerator to control which values are assigned to the for-loop's variables on each iteration of the loop.

Built-in enumerators are instances of the `Enumerator` class (which is derived from [Func](Func.md)), but any function object can potentially be used with a for-loop.

<a id="toc"></a>
## Table of Contents

- [Methods](#Methods):
    - [Call](#Call): Retrieves the next item or items in an enumeration.
- [Related](#Related)

<a id="Methods"></a>
## Methods

<a id="Call"></a>

### Call

Retrieves the next item or items in an enumeration.

```ahk
Boolean := Enum.Call(&OutputVar1 , &OutputVar2)
```

```ahk
Boolean := EnumFunction(&OutputVar1 , &OutputVar2)
```

<a id="Next_Parameters"></a>
#### Parameters

**&OutputVar1, &OutputVar2**

Type: [VarRef](../Concepts.md#variable-references)

One or more references to output variables for the enumerator to assign values.

<a id="Next_Return_Value"></a>
#### Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This method returns 1 (true) if successful or 0 (false) if there were no items remaining.

<a id="Next_Remarks"></a>
#### Remarks

A simple function definition can be used to create an enumerator; in that case, the Call method is implied.

When defining your own enumerator, the number of parameters should match the number of variables expected to be passed to the for-loop (before the "in" keyword). This is usually either 1 or 2, but a for-loop can accept up to 19 variables. To allow the method to accept a varying number of variables, declare [optional parameters](../Functions.md#optional).

An exception is thrown when the for-loop attempts to call the method if there are more variables than parameters (too many parameters passed, too few defined) or fewer variables than mandatory parameters.

<a id="Related"></a>
## Related

[For-loop](For.md), [OwnProps](Object.md#OwnProps), [\__Enum (Array)](Array.md#__Enum), [\__Enum (Map)](Map.md#__Enum)
