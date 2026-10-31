# Catch

Specifies one or more [statements](../Concepts.md#statement) to execute if a value or error is thrown during execution of a [Try](Try.md) statement.

```ahk
Catch ErrorClass as OutputVar
{
    Statements
}
```

<a id="Parameters"></a>
## Parameters

**ErrorClass**

Type: [Class](Class.md)

The class of value that should be caught, such as `Error`, `TimeoutError` or `MyCustomError`. This can also be a comma-delimited list of classes. Classes must be specified by their exact full name and not an arbitrary expression, as the [Prototype](Class.md#Prototype) of each class is resolved at load time. Any [built-in](../ObjList.md) or [user-defined](../Objects.md#Custom_Classes) class can be used, even if it does not derive from [Error](Error.md).

If no classes are specified, the default is `Error`.

To catch anything at all, use `catch Any`.

A load-time error is displayed if an invalid class name is used, or if a class is inaccessible due to the presence of a local variable with the same name.

**OutputVar**

Type: [Variable](../Concepts.md#variables)

The output variable in which to store the thrown value, which is typically an [Error object](Error.md). This cannot be a [dynamic variable](../Language.md#dynamic-variables).

If omitted, the thrown value cannot be accessed directly, but can still be re-thrown by using [Throw](Throw.md) with no parameter.

***Statements***

The [statements](../Concepts.md#statement) to execute if a value or error is thrown.

Braces are generally not required if only a single statement is used. For details, see [{...} (block)](Block.md).

<a id="Remarks"></a>
## Remarks

Multiple *Catch* statements can be used one after the other, with each one specifying a different class (or multiple classes). If the value is not an instance of any of the listed classes, it is not caught by this *Try-Catch*, but might be caught by one further up the call stack.

Every use of *Catch* must belong to (be associated with) a [Try](Try.md) statement above it. A *Catch* always belongs to the nearest unclaimed *Try* statement above it unless a [block](Block.md) is used to change that behavior.

The parameter list may optionally be enclosed in parentheses, in which case the space or tab after `catch` is optional.

*Catch* may optionally be followed by [Else](Else.md), which is executed if no exception was thrown within the associated *Try* block.

The [One True Brace (OTB) style](Block.md#otb) may optionally be used. For example:

```ahk
try {
    ...
} catch Error {
    ...
}
```

Load-time errors cannot be caught, since they occur before the *try* statement is executed.

<a id="Related"></a>
## Related

[Try](Try.md), [Throw](Throw.md), [Error Object](Error.md), [Else](Else.md), [Finally](Finally.md), [Blocks](Block.md), [OnError](OnError.md)

<a id="Examples"></a>
## Examples

See [Try](Try.md#Examples).
