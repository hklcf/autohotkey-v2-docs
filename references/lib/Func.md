# Func Object

```ahk
class Func extends Object
```

Represents a user-defined or built-in function and provides an interface to call it, bind parameters to it, and retrieve information about it or its parameters.

For information about other objects which can be called like functions, see [Function Objects](../misc/Functor.md).

The `Closure` class extends `Func` but does not define any new properties.

For each built-in function or function definition within the script, there is a corresponding read-only variable containing a Func object. This variable is directly used to call the function, but its value can also be read to retrieve the function itself, as a value. For example:

```ahk
InspectFn StrLen
InspectFn InspectFn

InspectFn(fn)
{
    ; Display information about the passed function.
    MsgBox fn.Name "() is " (fn.IsBuiltIn ? "built-in." : "user-defined.")
}
```

"FuncObj" is used below as a placeholder for any Func object, as "Func" is the class itself.

In addition to the methods and properties inherited from [Object](Object.md), Func objects have the following predefined methods and properties.

<a id="toc"></a>
## Table of Contents

- [Methods](#Methods):
    - [Call](#Call): Calls the function.
    - [Bind](#Bind): Binds parameters to the function.
    - [IsByRef](#IsByRef): Determines whether a parameter is ByRef.
    - [IsOptional](#IsOptional): Determines whether a parameter is optional.
- [Properties](#Properties):
    - [Name](#Name): Gets the function's name.
    - [IsBuiltIn](#IsBuiltIn): Gets 1 (true) if the function is built-in, otherwise 0 (false).
    - [IsVariadic](#IsVariadic): Gets 1 (true) if the function is variadic, otherwise 0 (false).
    - [MinParams](#MinParams): Gets the number of required parameters.
    - [MaxParams](#MaxParams): Gets the number of formally-declared parameters for a user-defined function or maximum parameters for a built-in function.

<a id="Methods"></a>
## Methods

<a id="Call"></a>

### Call

Calls the function.

```ahk
FuncObj(Param1, Param2, ...)
FuncObj.Call(Param1, Param2, ...)
```

<a id="Call_Parameters"></a>
#### Parameters

**Param1, Param2, ...**

Parameters and return value are defined by the function.

<a id="Call_Remarks"></a>
#### Remarks

The "Call" method is implied when calling a value, so need not be explicitly specified.

<a id="Bind"></a>

### Bind

Binds parameters to the function.

```ahk
BoundFunc := FuncObj.Bind(Param1, Param2, ...)
```

<a id="Bind_Parameters"></a>
#### Parameters

**Param1, Param2, ...**

Any number of parameters.

<a id="Bind_Return_Value"></a>
#### Return Value

Type: [Object](../Concepts.md#objects)

This method returns a [BoundFunc object](../misc/Functor.md#BoundFunc).

<a id="IsByRef"></a>

### IsByRef

Determines whether a parameter is ByRef.

```ahk
Boolean := FuncObj.IsByRef(ParamIndex)
```

<a id="IsByRef_Parameters"></a>
#### Parameters

**ParamIndex**

Type: [Integer](../Concepts.md#numbers)

If omitted, *Boolean* indicates whether the function has any ByRef parameters. Otherwise, specify the one-based index of a parameter.

<a id="IsByRef_Return_Value"></a>
#### Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This method returns 1 (true) if the parameter is ByRef, otherwise 0 (false). If *ParamIndex* is invalid, an exception is thrown.

<a id="IsOptional"></a>

### IsOptional

Determines whether a parameter is optional.

```ahk
Boolean := FuncObj.IsOptional(ParamIndex)
```

<a id="IsOptional_Parameters"></a>
#### Parameters

**ParamIndex**

Type: [Integer](../Concepts.md#numbers)

If omitted, *Boolean* indicates whether the function has any optional parameters. Otherwise, specify the one-based index of a parameter.

<a id="IsOptional_Return_Value"></a>
#### Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This method returns 1 (true) if the parameter is optional, otherwise 0 (false). If *ParamIndex* is invalid, an exception is thrown.

<a id="IsOptional_Remarks"></a>
#### Remarks

Parameters do not need to be formally declared if the function is variadic. Built-in functions are supported.

<a id="Properties"></a>
## Properties

<a id="Name"></a>

### Name

Gets the function's name.

```ahk
FunctionName := FuncObj.Name
```

<a id="IsBuiltIn"></a>

### IsBuiltIn

Gets 1 (true) if the function is [built-in](../Functions.md#BuiltIn), otherwise 0 (false).

```ahk
Boolean := FuncObj.IsBuiltIn
```

<a id="IsVariadic"></a>

### IsVariadic

Gets 1 (true) if the function is [variadic](../Functions.md#Variadic), otherwise 0 (false).

```ahk
Boolean := FuncObj.IsVariadic
```

<a id="MinParams"></a>

### MinParams

Gets the number of required parameters.

```ahk
ParamCount := FuncObj.MinParams
```

<a id="MaxParams"></a>

### MaxParams

Gets the number of formally-declared parameters for a user-defined function or maximum parameters for a built-in function.

```ahk
ParamCount := FuncObj.MaxParams
```

If the function is [variadic](../Functions.md#Variadic), *ParamCount* indicates the maximum number of parameters which can be accepted by the function without overflowing into the "variadic\*" parameter.
