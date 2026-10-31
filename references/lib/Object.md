# Object

```ahk
class Object extends Any
```

**Object** is the basic class from which other AutoHotkey object classes derive. Each instance of Object consists of a set of "own properties" and a base object, from which more properties are inherited. Objects also have methods, but these are just properties which can be called.

There are value properties and dynamic properties. Value properties simply contain a value. Dynamic properties do not contain a value, but instead call an *accessor function* depending on how they are accessed (get, set or call).

"Obj" is used below as a placeholder for any instance of the Object class.

All instances of Object are based on `Object.Prototype`, which is based on `Any.Prototype`. In addition to the methods and properties inherited from [Any](Any.md), Objects have the following predefined methods and properties.

<a id="toc"></a>
## Table of Contents

- [Static Methods](#StaticMethods):
    - [Call](#Call): Creates a new Object.
- [Methods](#Methods):
    - [Clone](#Clone): Returns a shallow copy of an object.
    - [DefineProp](#DefineProp): Defines or modifies an own property.
    - [DeleteProp](#DeleteProp): Removes an own property from an object.
    - [GetOwnPropDesc](#GetOwnPropDesc): Returns a descriptor for a given own property, compatible with DefineProp.
    - [HasOwnProp](#HasOwnProp): Returns 1 (true) if an object owns a property by the specified name.
    - [OwnProps](#OwnProps): Enumerates an object's own properties.
- [Properties](#Properties):
    - [Base](#Base): Gets or sets an object's base object.
- [Functions](#Functions):
    - [ObjSetBase](#SetBase): Set an object's base object.
    - [ObjGetCapacity](#GetCapacity), [ObjSetCapacity](#SetCapacity): Retrieve or set an Object's capacity to contain properties.
    - [ObjOwnPropCount](#OwnPropCount): Retrieve the number of own properties contained by an object.
    - ObjHasOwnProp, ObjOwnProps: Equivalent to the corresponding predefined method, but cannot be overridden.

<a id="StaticMethods"></a>
## Static Methods

<a id="Call"></a>

### Call

Creates a new Object.

```ahk
Obj := Object()
Obj := Object.Call()
```

<a id="Methods"></a>
## Methods

<a id="Clone"></a>

### Clone

Returns a shallow copy of an object.

```ahk
Clone := Obj.Clone()
```

Each property or method owned by the object is copied into the clone. Object *references* are copied (like with a normal assignment), not the objects themselves; in other words, if a property contains a reference to an object, the clone will contain a reference to the same object.

Dynamic properties are copied, not invoked.

The clone has the same base object as the original object.

A TypeError is thrown if *Obj* is derived from an unsupported built-in type. This implementation of Clone supports Object, Class and Error objects. See also: [Clone (Array)](Array.md#Clone), [Clone (Map)](Map.md#Clone).

<a id="DefineProp"></a>

### DefineProp

Defines or modifies an own property.

```ahk
Obj := Obj.DefineProp(Name, Descriptor)
```

<a id="DefineProp_Parameters"></a>
#### Parameters

**Name**

Type: [String](../Concepts.md#strings)

The name of the property.

**Descriptor**

Type: [Object](../Concepts.md#objects)

To define or modify a dynamic property, specify an object with one or more of the following own properties:

**Get:** The [function object](../misc/Functor.md) to call when the property's value is retrieved.

**Set:** The [function object](../misc/Functor.md) to call when the property is assigned a value. Its second parameter is the value being assigned.

**Call:** The [function object](../misc/Functor.md) to call when the property is called.

To define a value property, specify an object with the following own property:

**Value:** Any value to assign to the property.

<a id="DefineProp_Return_Value"></a>
#### Return Value

Type: [Object](../Concepts.md#objects)

This method returns the target object.

<a id="DefineProp_Remarks"></a>
#### Remarks

Defining a value property overwrites any existing value or accessor functions.

Defining a dynamic property overwrites any existing value, but retains any existing accessor functions which aren't specified by the descriptor.

If a dynamic property lacks any one of the accessor functions, behavior is inherited from a base object.

- An inherited value property is equivalent to a set of accessor functions which return or call the value, or store a new value in `this`. Note that a new value would overwrite any dynamic property in `this` itself, and override any inherited accessor functions.
- If no *Set* or value is defined or inherited, attempting to set the property will throw an exception.
- If no *Call* is defined or inherited, *Get* may be called to retrieve a function object, which is then called.
- If no *Get* is defined or inherited but there is a *Call* accessor function, the function itself becomes the property's value (read-only).

As with methods, the first parameter of *Get*, *Set* or *Call* is `this` (the target object). For *Set*, the second parameter is `value` (the value being assigned). These parameters are defined automatically by method and property definitions within a class, but must be defined explicitly if using normal functions. Any other parameters passed by the caller are appended to the parameter list.

The [MaxParams](Func.md#MaxParams) and [IsVariadic](Func.md#IsVariadic) properties of the function objects are evaluated to determine whether the property may accept parameters. If MaxParams is 1 for *Get* or 2 for *Set* and IsVariadic is false or undefined, the property cannot accept parameters; they are instead forwarded to the [\__Item](../Objects.md#__Item) property of the object returned by *get*.

<a id="DeleteProp"></a>

### DeleteProp

Removes an own property from an object.

```ahk
RemovedValue := Obj.DeleteProp(Name)
```

<a id="DeleteProp_Parameters"></a>
#### Parameters

**Name**

Type: [String](../Concepts.md#strings)

A property name.

<a id="DeleteProp_Return_Value"></a>
#### Return Value

Type: [Any](../Concepts.md#values)

This method returns the value of the removed property (blank if none).

<a id="GetOwnPropDesc"></a>

### GetOwnPropDesc

Returns a descriptor for a given own property, compatible with [DefineProp](#DefineProp).

```ahk
Descriptor := Obj.GetOwnPropDesc(Name)
```

<a id="GetOwnPropDesc_Parameters"></a>
#### Parameters

**Name**

Type: [String](../Concepts.md#strings)

A property name.

<a id="GetOwnPropDesc_Return_Value"></a>
#### Return Value

Type: [Object](../Concepts.md#objects)

For a dynamic property, the return value is a new object with an own property for each accessor function: *Get*, *Set*, *Call*. Each property is present only if the corresponding accessor function is defined in *Obj* itself. For a value property, the return value is a new object with a property named *Value*. In such cases, `Obj.GetOwnPropDesc(Name).Value == Obj.%Name%`.

Modifying the returned object has no effect on *Obj* unless [DefineProp](#DefineProp) is called.

The script can determine whether a property is dynamic by checking `not desc.HasProp("Value")`, where *desc* is the return value of GetOwnPropDesc.

<a id="GetOwnPropDesc_Error_Handling"></a>
#### Error Handling

A [PropertyError](Error.md#PropertyError) is thrown if *Obj* does not own a property by that name.

<a id="HasOwnProp"></a>

### HasOwnProp

Returns 1 (true) if an object owns a property by the specified name, otherwise 0 (false).

```ahk
HasOwnProp := Obj.HasOwnProp(Name)
```

The default implementation of this method is also defined as a function: `ObjHasOwnProp(Obj, Name)`.

<a id="OwnProps"></a>

### OwnProps

Enumerates an object's own properties.

```ahk
For Name , Value in Obj.OwnProps()
```

This method returns a new [enumerator](Enumerator.md). The enumerator is typically passed directly to a [for-loop](For.md), which calls the enumerator once for each iteration of the loop. Each call to the enumerator returns the next property name and/or value. The for-loop's variables correspond to the enumerator's parameters, which are:

**Name**

Type: [String](../Concepts.md#strings)

The property's name.

**Value**

Type: [Any](../Concepts.md#values)

The property's value.

If the property has a getter method, it is called to obtain the value (unless *Value* is omitted).

Dynamic properties are included in the enumeration. However:

- Since only the object's own properties are enumerated, the property must be defined directly in *Obj*.
- If only the first variable was specified, the property's name is returned and its getter is not called.
- If two variables were specified, the enumerator attempts to call the property's getter to retrieve the value.
    - If the getter requires parameters, the property is skipped.
    - If *Obj* itself does not define a getter for this property, it is skipped.
        > **Note:** Properties defined by a method definition typically do not have a getter, so are skipped.
    - If *Obj* is a class prototype object, the getter should not (and in some cases cannot) be called; so the property is skipped.
    - If the getter throws an exception, it is propagated (not suppressed). The caller can continue enumeration at the next property only if it retained a reference to the enumerator (i.e. not if it passed the enumerator directly to a for-loop, since in that case the enumerator is freed when the for-loop aborts).

To enumerate own properties without calling property getters, or to enumerate all properties regardless of type, pass only a single variable to the for-loop or enumerator. [GetOwnPropDesc](#GetOwnPropDesc) can be used to differentiate value properties from dynamic properties, while also retrieving the value or getter/setter/method.

Methods are typically excluded from enumeration in the two-parameter mode, because evaluation of the property normally depends on whether the object has a corresponding getter or value, either in the same object or a base object. To avoid inconsistency when two variables are specified, OwnProps skips over own properties that have only a *Call* accessor function. For example:

- If OwnProps returned the method itself when no getter is defined, defining a getter would then prevent the method from being returned. Scripts relying on the two variable mode to retrieve methods would then miss some methods.
- If OwnProps returned the method itself when a getter is defined by a base object, this would be inconsistent with normal evaluation of the property.

The default implementation of this method is also defined as a function: `ObjOwnProps(Obj)`.

<a id="Properties"></a>
## Properties

<a id="Base"></a>

### Base

Gets or sets an object's [base object](../Objects.md#delegation).

```ahk
CurrentBaseObj := Obj.Base
```

```ahk
Obj.Base := NewBaseObj
```

*NewBaseObj* must be an Object.

If assigning the new base would change the native type of the object, an exception is thrown. An object's native type is decided by the nearest prototype object belonging to a built-in class, such as `Object.Prototype` or `Array.Prototype`. For example, an instance of Array must always derive from `Array.Prototype`, either directly or indirectly.

Properties and methods are inherited from the base object dynamically, so changing an object's base also changes which inherited properties and methods are available.

This property is inherited from [Any](Any.md); however, it can be set only for instances of Object.

See also: [ObjGetBase](Any.md#GetBase), [ObjSetBase](#SetBase)

<a id="Functions"></a>
## Functions

<a id="SetBase"></a>
### ObjSetBase

Sets an object's [base object](../Objects.md#delegation).

```ahk
ObjSetBase(Obj, BaseObj)
```

No [meta-functions](../Objects.md#Meta_Functions) or [property functions](../Objects.md#Custom_Classes_property) are called. Overriding the [Base](#Base) property does not affect the behavior of this function.

An exception is thrown if *Obj* or *BaseObj* is of an incorrect type.

See also: [ObjGetBase](Any.md#GetBase), [Base property](#Base)

<a id="OwnPropCount"></a>
### ObjOwnPropCount

Returns the number of properties owned by an object.

```ahk
Count := ObjOwnPropCount(Obj)
```

<a id="SetCapacity"></a>
### ObjSetCapacity

Sets the current capacity of the object's internal array of own properties.

```ahk
MaxProps := ObjSetCapacity(Obj, MaxProps)
```

<a id="SetCapacity_Parameters"></a>
#### Parameters

**MaxProps**

Type: [Integer](../Concepts.md#numbers)

The new capacity. If less than the current number of own properties, that number is used instead, and any unused space is freed.

<a id="SetCapacity_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the new capacity.

<a id="SetCapacity_Error_Handling"></a>
#### Error Handling

An exception is thrown if *Obj* is of an incorrect type.

<a id="GetCapacity"></a>
### ObjGetCapacity

Returns the current capacity of the object's internal array of properties.

```ahk
MaxItems := ObjGetCapacity(Obj)
```

An exception is thrown if *Obj* is of an incorrect type.
