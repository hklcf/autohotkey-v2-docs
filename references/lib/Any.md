# Any

`Any` is the class at the root of AutoHotkey's type hierarchy. All other types are a sub-type of Any.

`Any.Prototype` defines methods and properties that are applicable to all values and objects (currently excluding [ComValue](ComValue.md) and derived types) unless overridden. The prototype object itself is natively an [Object](Object.md), but has no `base` and therefore does not identify as an instance of Object.

<a id="toc"></a>
## Table of Contents

- [Methods](#Methods):
    - [GetMethod](#GetMethod): Retrieves the implementation function of a method.
    - [HasBase](#HasBase): Returns true if the specified base object is in the value's chain of base objects.
    - [HasMethod](#HasMethod): Returns true if the value has a method by this name.
    - [HasProp](#HasProp): Returns true if the value has a property by this name.
- [Properties](#Properties):
    - [Base](#Base): Gets the value's base object.
- [Functions](#Functions):
    - [ObjGetBase](#GetBase): Returns the value's base object.

<a id="Methods"></a>
## Methods

<a id="GetMethod"></a>

### GetMethod

Retrieves the implementation function of a method.

```ahk
Value.GetMethod(Name, ParamCount)
```

This method is exactly equivalent to `GetMethod(Value, Name, ParamCount)`, unless overridden.

<a id="HasBase"></a>

### HasBase

Returns true if the specified [base object](../Objects.md#delegation) is in the value's chain of base objects, otherwise false.

```ahk
Value.HasBase(BaseObj)
```

This method is exactly equivalent to `HasBase(Value, BaseObj)`, unless overridden.

<a id="HasMethod"></a>

### HasMethod

Returns true if the value has a method by this name, otherwise false.

```ahk
Value.HasMethod(Name, ParamCount)
```

This method is exactly equivalent to `HasMethod(Value, Name, ParamCount)`, unless overridden.

<a id="HasProp"></a>

### HasProp

Returns true if the value has a property by this name, otherwise false.

```ahk
Value.HasProp(Name)
```

This method is exactly equivalent to `HasProp(Value, Name)`, unless overridden.

<a id="Properties"></a>
## Properties

<a id="Base"></a>

### Base

Gets the value's [base object](../Objects.md#delegation).

```ahk
BaseObj := Value.Base
```

For [primitive values](../Objects.md#primitive), the return value is the pre-defined prototype object corresponding to `Type(Value)`.

See also: [ObjGetBase](#GetBase), [ObjSetBase](Object.md#SetBase), [Obj.Base](Object.md#Base)

<a id="Functions"></a>
## Functions

<a id="GetBase"></a>
### ObjGetBase

Returns the value's [base object](../Objects.md#delegation).

```ahk
BaseObj := ObjGetBase(Value)
```

No [meta-functions](../Objects.md#Meta_Functions) or [property functions](../Objects.md#Custom_Classes_property) are called. Overriding the [Base](#Base) property does not affect the behavior of this function.

If there is no base, the return value is an empty string. Only the Any prototype itself has no base.

See also: [Base](#Base), [ObjSetBase](Object.md#SetBase), [Obj.Base](Object.md#Base)
