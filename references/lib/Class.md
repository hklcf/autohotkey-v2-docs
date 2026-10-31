# Class Object

```ahk
class Class extends Object
```

A **Class** object represents a class definition; it contains static methods and properties.

Each class object is [based on](../Objects.md#Custom_Objects) whatever class it extends, or [Object](Object.md) if not specified. The global class object `Object` is based on `Class.Prototype`, which is based on `Object.Prototype`, so classes can inherit methods and properties from any of these base objects.

"Static" methods and properties are any methods and properties which are owned by the class object itself (and therefore do not apply to a specific instance), while methods and properties for instances of the class are owned by the class's [Prototype](#Prototype).

"ClassObj" is used below as a placeholder for any class object, as "Class" is the Class class itself. Ordinarily, one refers to a class object by the name given in its [class definition](../Objects.md#Custom_Classes).

<a id="toc"></a>
## Table of Contents

- [Methods](#Methods):
    - [Call](#Call): Constructs a new instance of the class.
- [Properties](#Properties):
    - [Prototype](#Prototype): Gets or sets the object on which all instances of the class are based.

<a id="Methods"></a>
## Methods

<a id="Call"></a>

### Call

Constructs a new instance of the class.

```ahk
Obj := ClassObj(Params*)
Obj := ClassObj.Call(Params*)
```

This static method is typically inherited from the [Object](Object.md), [Array](Array.md) or [Map](Map.md) class. It performs the following functions:

- Allocate memory and initialize the binary structure of the object, which depends on the object's native type (e.g. whether it is an Array or Map, or just an Object).
- Set the base of the new object to [ClassObj.Prototype](#Prototype).
- Call the new object's \__Init method, if it has one. This method is automatically created by class definitions; it contains all instance variable initializers defined within the class body.
- Call the new object's \__New method, if it has one. All parameters passed to Call are forwarded on to \__New.
- Return the new object.

Call can be overridden within a class definition by defining a static method, such as `static Call()`. This allows classes to modify or prevent the construction of new instances.

Note that `Class()` (literally using "Class" in this case) can be used to construct a new Class object based on `Class.Prototype`. However, this new object initially has no Call method as it is not a subclass of [Object](Object.md). It can become a subclass of Object by assigning to [Base](Object.md#Base), or the Call method can be reimplemented or copied from another class. A [Prototype](#Prototype) must also be created and assigned to the class before it can be instantiated with the standard Call method.

<a id="Properties"></a>
## Properties

<a id="Prototype"></a>

### Prototype

Gets or sets the object on which all instances of the class are based.

```ahk
Proto := ClassObj.Prototype
```

```ahk
ClassObj.Prototype := Proto
```

By default, the class's Prototype contains all instance methods and dynamic properties defined within the class definition, and can be used to retrieve references to methods or property getters/setters or define new ones. The script can also define new value properties, which act as default property values for all instances.

A class's Prototype is normally based on the Prototype of its base class, so `ClassObj.Prototype.base == ClassObj.base.Prototype`.

Prototype is automatically defined as an own property of any class object created by a class definition.

[ClassObj()](#Call) and [value is ClassObj](../Variables.md#is) require that the Prototype property is a value property owned directly by the class. Changing its value typically only affects these two operations and direct references to `ClassObj.Prototype`. Previously-created objects and objects constructed by other means are generally unaffected, but may no longer identify as instances of the class.

With some exceptions, built-in functions typically construct objects based on a known prototype and are thus unaffected by changes to the Prototype property.
