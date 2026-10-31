# GetMethod

Retrieves the implementation function of a method.

```ahk
Method := GetMethod(Value , Name, ParamCount)
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [Any](../Concepts.md#values)

Any value, of any type except ComObject.

**Name**

Type: [String](../Concepts.md#strings)

If omitted, validation is performed on *Value* itself and *Value* is returned if successful. Otherwise, specify the name of the method to retrieve.

**ParamCount**

Type:

Integer

If omitted (or if the parameter count was not verified), a basic check is performed for a Call method to verify that the object is most likely callable.

Otherwise, specify the number of parameters that would be passed to the method or function. If specified, the method's MinParams, MaxParams and IsVariadic properties may be queried to verify that it can accept this number of parameters. If those properties are not present, the parameter count is not verified.

This count should not include the implicit `this` parameter.

<a id="Return_Value"></a>
## Return Value

Type: [Function Object](../misc/Functor.md)

This function returns the function object which contains the implementation of the method, or *Value* itself if *Name* was omitted.

<a id="Errors"></a>
## Errors

If the method is not found or cannot be retrieved without invoking a property getter, a [MethodError](Error.md#MethodError) is thrown.

If validation is attempted, exceptions may be thrown as a result of querying the method's properties. A [ValueError](Error.md#ValueError) or [MethodError](Error.md#MethodError) is thrown if validation fails.

<a id="Remarks"></a>
## Remarks

Methods may be defined through one of the following:

- A dynamic property with a *call* accessor function. This includes:
    - Any property created by a [method definition](../Objects.md#Custom_Classes_method) within a class.
    - Any property created by passing a descriptor like `{Call: fn}` to [DefineProp](Object.md#DefineProp), where *fn* implements the method.
    - Any predefined/built-in method.
- An own value property of the object or one of its base objects, where the value is a [function object](../misc/Functor.md).
- A dynamic property with a getter which returns a function object. This case is not supported by GetMethod.
- Handling within a \__Call [meta-function](../Objects.md#Meta_Functions). Methods implemented this way cannot be detected and may not even have a corresponding function object, so are not supported by GetMethod.

When calling the function object, it is necessary to supply a value for the normally-hidden *this* parameter. For example, `Method(Value, Parameters*)`.

Although the standard implementation of GetMethod has limitations as described above, if `Value.GetMethod(Name)` is used instead of `GetMethod(Value, Name)`, the object *Value* can define its own implementation of GetMethod.

`GetMethod(Value, "Call", N)` is not the same as `GetMethod(Value,, N)`, as the Call method takes the function object itself as a parameter, and its usage may otherwise differ from that of *Value*. For instance, `Func.Prototype.Call` is a single method which applies to all built-in and user-defined functions, and as such must accept any number of parameters.

<a id="Related"></a>
## Related

[Objects](../Objects.md), [HasMethod](HasMethod.md), [HasBase](HasBase.md), [HasProp](HasProp.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves and reports information about the [GetMethod method](Any.md#GetMethod).

```ahk
method := GetMethod({}, "GetMethod")  ; It's also a method.
MsgBox method.MaxParams  ; Takes 3 parameters, including 'this'.
MsgBox method = GetMethod  ; Actually the same object in this case.
```
