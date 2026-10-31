# ObjBindMethod

Creates a [BoundFunc object](../misc/Functor.md#BoundFunc) which calls a method of a given object.

```ahk
BoundFunc := ObjBindMethod(Obj , Method, Params)
```

<a id="Parameters"></a>
## Parameters

**Obj**

Type: [Object](../Concepts.md#objects)

Any object.

**Method**

Type: [String](../Concepts.md#strings)

A method name. If omitted, the bound function calls *Obj* itself.

***Params***

Any number of parameters.

<a id="Remarks"></a>
## Remarks

For details and examples, see [BoundFunc object](../misc/Functor.md#BoundFunc).
