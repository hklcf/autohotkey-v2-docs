# Objects

An *object* combines a number of *properties* and [*methods*](Concepts.md#methods).

Related topics:

- [Objects](Concepts.md#objects): General explanation of objects.
- [Object Protocol](Concepts.md#object-protocol): Specifics about how a script interacts with an object.
- [Function objects](misc/Functor.md): Objects which can be *called*.

**IsObject** can be used to determine if a value is an object:

```ahk
Result := IsObject(expression)
```

See [Built-in Classes](ObjList.md) for a list of standard object types. There are two fundamental types:

- **AutoHotkey objects** are instances of the [Object](lib/Object.md) class. These support ad hoc properties, and have methods for discovering which properties exist. [Array](lib/Array.md), [Map](lib/Map.md) and all user defined and built-in classes are derived from Object.
- **COM objects** such as those created by [ComObject](lib/ComObject.md). These are implemented by external libraries, so often differ in behavior to AutoHotkey objects. ComObject typically represents a COM or "Automation" object implementing the [IDispatch interface](https://learn.microsoft.com/windows/win32/api/oaidl/nn-oaidl-idispatch), but is also used to [wrap values of specific types](lib/ComValue.md) to be passed to COM objects and functions.

<a id="toc"></a>
## Table of Contents

- [Basic Usage](#Usage)
    - [Arrays](#Usage_Simple_Arrays)
    - [Maps (Associative Arrays)](#Usage_Associative_Arrays)
    - [Objects](#Usage_Objects)
    - [Object Literal](#object-literal)
    - [Freeing Objects](#Usage_Freeing_Objects)
- [Extended Usage](#Extended_Usage)
    - [Arrays of Arrays](#Usage_Arrays_of_Arrays)
- [Custom Objects](#Custom_Objects)
    - [Ad Hoc](#ad-hoc)
    - [Delegation](#delegation)
    - [Creating a Base Object](#creating-a-base-object)
    - [Classes](#Custom_Classes)
    - [\__Enum Method](#__Enum)
    - [\__Item Property](#__Item)
    - [Construction and Destruction](#Custom_NewDelete)
    - [Meta-Functions](#Meta_Functions)
- [Primitive Values](#primitive)
    - [Adding Properties and Methods](#primitive-extension)
- [Implementation](#Implementation)
    - [Reference Counting](#Reference_Counting)
    - [Pointers to Objects](#ObjPtr)

<a id="Syntax"></a>

<a id="Usage"></a>
## Basic Usage

<a id="Usage_Simple_Arrays"></a>
### Arrays

Create an [Array](lib/Array.md):

```ahk
MyArray := [Item1, Item2, ..., ItemN]
MyArray := Array(Item1, Item2, ..., ItemN)
```

Retrieve an item (or *array element*):

```ahk
Value := MyArray[Index]
```

Change the value of an item (`Index` must be between 1 and Length, or an equivalent reverse index):

```ahk
MyArray[Index] := Value
```

Insert one or more items at a given index using the [InsertAt](lib/Array.md#InsertAt) method:

```ahk
MyArray.InsertAt(Index, Value, Value2, ...)
```

Append one or more items using the [Push](lib/Array.md#Push) method:

```ahk
MyArray.Push(Value, Value2, ...)
```

Remove an item using the [RemoveAt](lib/Array.md#RemoveAt) method:

```ahk
RemovedValue := MyArray.RemoveAt(Index)
```

Remove the last item using the [Pop](lib/Array.md#Pop) method:

```ahk
RemovedValue := MyArray.Pop()
```

[Length](lib/Array.md#Length) returns the number of items in the array. Looping through an array's contents can be done either by index or with a For-loop. For example:

```ahk
MyArray := ["one", "two", "three"]

; Iterate from 1 to the end of the array:
Loop MyArray.Length
    MsgBox MyArray[A_Index]

; Enumerate the array's contents:
For index, value in MyArray
    MsgBox "Item " index " is '" value "'"

; Same thing again:
For value in MyArray
    MsgBox "Item " A_Index " is '" value "'"
```

<a id="Usage_Associative_Arrays"></a>
### Maps (Associative Arrays)

A [Map](lib/Map.md) or associative array is an object which contains a collection of unique keys and a collection of values, where each key is associated with one value. Keys can be strings, integers or objects, while values can be of any type. An associative array can be created as follows:

```ahk
MyMap := Map("KeyA", ValueA, "KeyB", ValueB, ..., "KeyZ", ValueZ)
```

Retrieve an item, where `Key` is a [variable](Concepts.md#variables) or [expression](Language.md#expressions):

```ahk
Value := MyMap[Key]
```

Assign an item:

```ahk
MyMap[Key] := Value
```

Remove an item using the [Delete](lib/Array.md#Delete) method:

```ahk
RemovedValue := MyMap.Delete(Key)
```

Enumerating items:

```ahk
MyMap := Map("ten", 10, "twenty", 20, "thirty", 30)
For key, value in MyMap
    MsgBox key ' = ' value
```

<a id="Usage_Objects"></a>
### Objects

An object can have *properties* and *items* (such as array elements). Items are accessed using `[]` as shown in the previous sections. Properties are usually accessed by writing a dot followed by an identifier (just a [name](Concepts.md#names)). *Methods* are properties which can be called.

**Examples:**

Retrieve or set a property literally named *Property*:

```ahk
Value := MyObject.Property
```

```ahk
MyObject.Property := Value
```

Retrieve or set a property where the name is determined by evaluating an [expression](Language.md#expressions) or [variable](Concepts.md#variables):

```ahk
Value := MyObject.%Expression%
```

```ahk
MyObject.%Expression% := Value
```

Call a property/method literally named *Method*:

```ahk
ReturnValue := MyObject.Method(Parameters)
```

Call a property/method where the name is determined by evaluating an expression or variable:

```ahk
ReturnValue := MyObject.%Expression%(Parameters)
```

Sometimes parameters are accepted when retrieving or assigning properties:

```ahk
Value := MyObject.Property[Parameters]
MyObject.Property[Parameters] := Value
```

An object may also support indexing: `MyArray[Index]` actually invokes the [\__Item](#__Item) property of `MyArray`, passing `Index` as a parameter.

### Object Literal

An object literal can be used within an [expression](Language.md#expressions) to create an improvised object. An object literal consists of a pair of braces (`{}`) enclosing a list of comma-delimited name-value pairs. Each pair consists of a literal (unquoted) [property name](Concepts.md#names) and a value (sub-expression) separated by a colon (`:`). For example:

```ahk
Coord := {X: 13, Y: 240}
```

This is equivalent:

```ahk
Coord := Object()
Coord.X := 13
Coord.Y := 240
```

Each name-value pair causes a value property to be defined, with the exception that [Base](lib/Object.md#Base) can be set (with the same restrictions as a normal assignment).

[Name substitution](Variables.md#deref) allows a property name to be determined by evaluating an [expression](Language.md#expressions) or [variable](Concepts.md#variables). For example:

```ahk
parts := StrSplit("key = value", "=", " ")
pair := {%parts[1]%: parts[2]}
MsgBox pair.key
```

<a id="Usage_Freeing_Objects"></a>
### Freeing Objects

Scripts do not free objects explicitly. When the last reference to an object is released, the object is freed automatically. A reference stored in a variable is released automatically when that variable is assigned some other value. For example:

```ahk
obj := {}  ; Creates an object.
obj := ""  ; Releases the last reference, and therefore frees the object.
```

Similarly, a reference stored in a property or array element is released when that property or array element is assigned some other value or removed from the object.

```ahk
arr := [{}]  ; Creates an array containing an object.
arr[1] := {}  ; Creates a second object, implicitly freeing the first object.
arr.RemoveAt(1)  ; Removes and frees the second object.
```

<a id="Circular_References"></a>

Because all references to an object must be released before the object can be freed, objects containing circular references aren't freed automatically. For instance, if `x.child` refers to `y` and `y.parent` refers to `x`, clearing `x` and `y` is not sufficient since the parent object still contains a reference to the child and vice versa. To resolve this situation, remove the circular reference.

```ahk
x := {}, y := {}             ; Create two objects.
x.child := y, y.parent := x  ; Create a circular reference.

y.parent := ""               ; The circular reference must be removed before the objects can be freed.
x := "", y := ""             ; Without the above line, this would not free the objects.
```

For more advanced usage and details, see [Reference Counting](#Reference_Counting).

<a id="Extended_Usage"></a>
## Extended Usage

<a id="Usage_Arrays_of_Arrays"></a>
### Arrays of Arrays

Although "multi-dimensional" arrays are not supported, a script can combine multiple arrays or maps. For example:

```ahk
grid := [[1,2,3],
         [4,5,6],
         [7,8,9]]
MsgBox grid[1][3] ; 3
MsgBox grid[3][2] ; 8
```

<a id="Array2D"></a>

A custom object can implement multi-dimensional support by defining an [\__Item](#__Item) property. For example:

```ahk
class Array2D extends Array {
    __new(x, y) {
        this.Length := x * y
        this.Width := x
        this.Height := y
    }
    __Item[x, y] {
        get => super.Has(this.i[x, y]) ? super[this.i[x, y]] : false
        set => super[this.i[x, y]] := value
    }
    i[x, y] => this.Width * (y-1) + x
}

grid := Array2D(4, 3)
grid[4, 1] := "#"
grid[3, 2] := "#"
grid[2, 2] := "#"
grid[1, 3] := "#"
gridtext := ""
Loop grid.Height {
    y := A_Index
    Loop grid.Width {
        x := A_Index
        gridtext .= grid[x, y] || "-"
    }
    gridtext .= "`n"
}
MsgBox gridtext
```

A real script should perform error-checking and override other methods, such as [\__Enum](#__Enum) to support enumeration.

<a id="Custom_Objects"></a>
## Custom Objects

There are two general ways to create custom objects:

- *Ad hoc*: create an object and add properties.
- *Delegation*: define properties in a shared *base object* or class.

[Meta-functions](#Meta_Functions) can be used to further control how an object behaves.

> **Note:** Within this section, an *object* is any instance of the [Object](lib/Object.md) class. This section does not apply to COM objects.

### Ad Hoc

Properties and methods (callable properties) can generally be added to new objects at any time. For example, an object with one property and one method might be constructed like this:

```ahk
; Create an object.
thing := {}
; Store a value.
thing.foo := "bar"
; Define a method.
thing.test := thing_test
; Call the method.
thing.test()

thing_test(this) {
    MsgBox this.foo
}
```

You could similarly create the above object with `thing := {foo: "bar"}`. When using the {property:value} notation, quote marks must not be used for properties.

When `thing.test()` is called, *thing* is automatically inserted at the beginning of the parameter list. By convention, the function is named by combining the "type" of object and the method name, but this is not a requirement.

In the example above, *test* could be assigned some other function or value after it is defined, in which case the original function is lost and cannot be called via this property. An alternative is to define a read-only method, as shown below:

```ahk
thing.DefineProp('test', {call: thing_test})
```

See also: [DefineProp](lib/Object.md#DefineProp)

### Delegation

Objects are *prototype-based*. That is, any properties not defined in the object itself can instead be defined in the object's [base](lib/Object.md#Base). This is known as *inheritance by delegation* or *differential inheritance*, because an object can implement only the parts that make it different, while delegating the rest to its base.

Although a base object is also generally known as a prototype, we use "a class's [Prototype](lib/Class.md#Prototype)" to mean the object upon which every instance of the class is based, and "base" to mean the object upon which an instance is based.

> AutoHotkey's object design was influenced primarily by JavaScript and Lua, with a little C#. We use `obj.base` in place of JavaScript's `obj.__proto__` and `cls.Prototype` in place of JavaScript's `func.prototype`. (Class objects are used in place of constructor functions.)

An object's base is also used to identify its type or class. For example, `x := []` creates an object *based on* `Array.Prototype`, which means that the expressions `x is Array` and `x.HasBase(Array.Prototype)` are true, and `type(x)` returns "Array". Each class's Prototype is based on the Prototype of its base class, so `x.HasBase(Object.Prototype)` is also true.

Any instance of Object or a derived class can be a base object, but an object can only be [assigned as the base](lib/Object.md#Base) of an object with the same native type. This is to ensure that built-in methods can always identify the native type of an object, and operate only on objects that have the correct binary structure.

Base objects can be defined two different ways:

- By [creating a normal object](#creating-a-base-object).
- By [defining a class](#Custom_Classes). Each class has a [Prototype](lib/Class.md#Prototype) property containing an object which all instances of that class are based on, while the class itself becomes the base object of any direct subclasses.

A base object can be assigned to the [base](lib/Object.md#Base) property of another object, but typically an object's base is set implicitly when it is created.

### Creating a Base Object

Any object can be used as the base of any other object which has the same native type. The following example builds on the previous example under [Ad Hoc](#ad-hoc) (combine the two before running it):

```ahk
other := {}
other.base := thing
other.test()
```

In this case, *other* inherits *foo* and *test* from *thing*. This inheritance is dynamic, so if `thing.foo` is modified, the change will be reflected by `other.foo`. If the script assigns to `other.foo`, the value is stored in *other* and any further changes to `thing.foo` will have no effect on `other.foo`. When `other.test()` is called, its *this* parameter contains a reference to *other* instead of *thing*.

<a id="Custom_Classes"></a>
### Classes

> In object-oriented programming, a class is an extensible program-code-template for creating objects, providing initial values for state (member variables) and implementations of behavior (member functions or methods).
>
> Wikipedia

In more general terms, a *class* is a set or category of things having some property or attribute in common. In AutoHotkey, a `class` defines properties to be shared by instances of the class (and methods, which are callable properties). An *instance* is just an object which inherits properties from the class, and can typically also be identified as belonging to that class (such as with the expression `instance is ClassName`). Instances are typically created by calling [*ClassName*()](lib/Class.md#Call).

Since [Objects](lib/Object.md) are [dynamic](#ad-hoc) and [prototype-based](#delegation), each class consists of two parts:

- The class has a [Prototype](lib/Class.md#Prototype) object, on which all instances of the class are based. All methods and dynamic properties that apply to instances of the class are contained by the prototype object. This includes all properties and methods which lack the `static` keyword.
- The class itself is an object, containing only static methods and properties. This includes all properties and methods with the `static` keyword, and all nested classes. These do not apply to a specific instance, and can be used by referring to the class itself by name.

The following shows most of the elements of a class definition:

```ahk
class ClassName extends BaseClassName
{
    InstanceVar := Expression

    static ClassVar := Expression

    class NestedClass
    {
        ...
    }

    Method()
    {
        ...
    }

    static Method()
    {
        ...
    }

    Property[Parameters]  ; Use brackets only when parameters are present.
    {
        get {
            return value of property
        }
        set {
            Store or otherwise handle value
        }
    }

    ShortProperty
    {
        get => Expression which calculates property value
        set => Expression which stores or otherwise handles value
    }

    ShorterProperty => Expression which calculates property value
}
```

When the script is loaded, this constructs a [Class](lib/Class.md) object and stores it in a [global](Functions.md#Global) constant (read-only variable) with the name *ClassName*. If `extends BaseClassName` is present, *BaseClassName* must be the full name of another class. The full name of each class is stored in `ClassName.Prototype.__Class`.

Because the class itself is accessed through a variable, the class name cannot be used to both reference the class and create a separate variable (such as to hold an instance of the class) in the same context. For example, `box := Box()` will not work, because `box` and `Box` both resolve to the same thing. Attempting to reassign a top-level (not nested) class in this manner results in a load time error.

Within this documentation, the word "class" on its own usually means a class object constructed with the `class` keyword.

Class definitions can contain variable declarations, method definitions and nested class definitions.

<a id="Custom_Classes_var"></a>
#### Instance Variables

An *instance variable* is one that each instance of the class has its own copy of. They are declared and behave like normal assignments, but the `this.` prefix is omitted (only directly within the class body):

```ahk
InstanceVar := Expression
```

These declarations are evaluated each time a new instance of the class is created with [*ClassName*()](lib/Class.md#Call), after all base-class declarations are evaluated but before [\__New](#Custom_NewDelete) is called. This is achieved by automatically creating a method named *\__Init* containing a call to `super.__Init()` and inserting each declaration into it. Therefore, a single class definition must not contain both an \__Init method and an instance variable declaration.

*Expression* can access other instance variables and methods via `this`. Global variables may be read, but not assigned. An additional assignment (or use of the [reference operator](Variables.md#ref)) within the expression will generally create a variable local to the \__Init method. For example, `x := y := 1` would set `this.x` and a local variable `y` (which would be freed once all initializers have been evaluated).

To access an instance variable (even within a method), always specify the target object; for example, `this.InstanceVar`.

Declarations like `x.y := z` are also supported, provided that `x` was previously defined in this class. For example, `x := {}, x.y := 42` declares `x` and also initializes `this.x.y`.

<a id="Custom_Classes_staticvar"></a>
#### Static/Class Variables

Static/class variables belong to the class itself, but their values can be inherited by subclasses. They are declared like instance variables, but using the static keyword:

```ahk
static ClassVar := Expression
```

These declarations are evaluated only once, when the class is [initialized](#static__New). A static method named *\__Init* is automatically defined for this purpose.

Each declaration acts as a normal property assignment, with the class object as the target. *Expression* has the same interpretation as for instance variables, except that `this` refers to the class itself.

To assign to a class variable anywhere else, always specify the class object; for example, `ClassName.ClassVar := Value`. If a subclass does not own a property by that name, `Subclass.ClassVar` can also be used to retrieve the value; so if the value is a reference to an object, subclasses will share that object by default. However, `Subclass.ClassVar := y` would store the value in *Subclass*, not in *ClassName*.

Declarations like `static x.y := z` are also supported, provided that `x` was previously defined in this class. For example, `static x := {}, x.y := 42` declares `x` and also initializes `ClassName.x.y`. Because [Prototype](lib/Class.md#Prototype) is implicitly defined in each class, `static Prototype.sharedValue := 1` can be used to set values which are dynamically inherited by all instances of the class (until shadowed by a property on the instance itself).

<a id="Custom_Classes_class"></a>
#### Nested Classes

Nested class definitions allow a class object to be associated with a static/class variable of the outer class instead of a separate global variable. In the example above, `class NestedClass` constructs a [Class](lib/Class.md) object and stores it in `ClassName.NestedClass`. Subclasses could inherit *NestedClass* or override it with their own nested class (in which case `WhichClass.NestedClass()` could be used to instantiate whichever class is appropriate).

```ahk
class NestedClass
{
    ...
}
```

Nesting a class does not imply any particular relationship to the outer class. The nested class is not instantiated automatically, nor do instances of the nested class have any connection with an instance of the outer class, unless the script explicitly makes that connection.

Each nested class definition produces a dynamic property with *get* and *call* accessor functions instead of a simple value property. This is to support the following behavior (where class X contains the nested class Y):

- `X.Y()` does not pass X to `X.Y.Call` and ultimately `__New`, which would otherwise happen because this is the normal behavior for function objects called as methods (which is how the nested class is being used here).
- `X.Y := 1` is an error by default (the property is read-only).
- Referring to or calling the class for the first time causes it to be initialized.

<a id="Custom_Classes_method"></a>
#### Methods

Method definitions look identical to function definitions. Each method definition creates a [Func](lib/Func.md) with a hidden first parameter named `this`, and defines a property which is used to call the method or retrieve its function object.

There are two types of methods:

- Instance methods are defined as below, and are attached to the class's [Prototype](lib/Class.md#Prototype), which makes them accessible via any instance of the class. When the method is called, `this` refers to an instance of the class.
- Static methods are defined by preceding the method name with the separate keyword `static`. These are attached to the class object itself, but are also inherited by subclasses, so `this` refers to either the class itself or a subclass.

The method definition below creates a property of the same type as `target.DefineProp('Method', {call: funcObj})`. By default, `target.Method` returns *funcObj* and attempting to assign to `target.Method` throws an error. These defaults can be overridden by [defining a property](#Custom_Classes_property) or calling [DefineProp](lib/Object.md#DefineProp).

```ahk
Method()
{
    ...
}
```

[Fat arrow syntax](Variables.md#fat-arrow) can be used to define a single-line method which returns an expression:

```ahk
Method() => Expression
```

<a id="Custom_Classes_super"></a>
#### Super

Inside a method or a property getter/setter, the keyword `super` can be used in place of `this` to access the superclass versions of methods or properties which are overridden in a derived class. For example, `super.Method()` in the class defined above would typically call the version of *Method* which was defined within *BaseClassName*. Note:

- `super.Method()` always invokes the base of the class or prototype object associated with the current method's original definition, even if `this` is derived from a *subclass* of that class or some other class entirely.
- `super.Method()` implicitly passes `this` as the first (hidden) parameter.
- Since it is not known where (or whether) *ClassName* exists within the chain of base objects, *ClassName* itself is used as the starting point. Therefore, `super.Method()` is mostly equivalent to `(ClassName.Prototype.base.Method)(this)` (but without *Prototype* when *Method* is static). However, `ClassName.Prototype` is resolved at load time.
- An error is thrown if the property is not defined in a superclass or cannot be invoked.

The keyword `super` must be followed by one of the following symbols: `.[(`

`super()` is equivalent to `super.call()`.

<a id="Custom_Classes_property"></a>
#### Properties

A property definition creates a [dynamic property](lib/Object.md#DefineProp), which calls a method instead of simply storing or returning a value.

```ahk
Property[Parameters]
{
    get {
        return property value
    }
    set {
        Store or otherwise handle value
    }
}
```

*Property* is simply the name of the property, which will be used to invoke it. For example, `obj.Property` would call *get* while `obj.Property := value` would call *set*. Within *get* or *set*, `this` refers to the object being invoked. Within *set*, `value` contains the value being assigned.

Parameters can be defined by enclosing them in square brackets to the right of the property name, and are passed the same way - but they should be omitted when parameters are not present (see below). Aside from using square brackets, parameters of properties are defined the same way as parameters of methods - optional, ByRef and variadic parameters are supported.

If a property is invoked with parameters but has none defined, parameters are automatically forwarded to the [\__Item](#__Item) property of the object returned by *get*. For example, `this.Property[x]` would have the same effect as `(this.Property)[x]` or `y := this.Property, y[x]`. Empty brackets (`this.Property[]`) always cause the \__Item property *of Property's value* to be invoked, but a variadic call such as `this.Property[args*]` has this effect only if the number of parameters is non-zero.

Static properties can be defined by preceding the property name with the separate keyword `static`. In that case, `this` refers to the class itself or a subclass.

The return value of *set* is ignored. For example, `val := obj.Property := 42` always assigns `val := 42` regardless of what the property does, unless it throws an exception or exits the thread.

Each class can define one or both halves of a property. If a class overrides a property, it can use `super.Property` to access the property defined by its base class. If *Get* or *Set* is not defined, it can be inherited from a base object. If *Get* is undefined, the property can return a value inherited from a base. If *Set* is undefined in this and all base objects (or is obscured by an inherited value property), attempting to set the property causes an exception to be thrown.

A property definition with both *get* and *set* actually creates two separate functions, which do not share local or static variables or nested functions. As with methods, each function has a hidden parameter named `this`, and *set* has a second hidden parameter named `value`. Any explicitly defined parameters come after those.

While a property definition defines the *get* and *set* accessor functions for a property in the same way as [DefineProp](lib/Object.md#DefineProp), a method definition defines the *call* accessor function. Any class may contain a property definition and a method definition with the same name. If a property without a *call* accessor function (a method) is called, *get* is invoked with no parameters and the result is then called as a method.

<a id="Custom_Classes_property_short"></a>
#### Fat Arrow Properties

[Fat arrow syntax](Variables.md#fat-arrow) can be used to define a [property](#Custom_Classes_property) getter or setter which returns an expression:

```ahk
ShortProperty[Parameters]
{
    get => Expression which calculates property value
    set => Expression which stores or otherwise handles value
}
```

When defining only a getter, the braces and `get` can be omitted:

```ahk
ShorterProperty[Parameters] => Expression which calculates property value
```

In both cases, the square brackets must be omitted unless parameters are defined.

<a id="__Enum"></a>
### \__Enum Method

```ahk
__Enum(NumberOfVars)
```

The \__Enum method is called when the object is passed to a [for-loop](lib/For.md). This method should return an [enumerator](lib/Enumerator.md) which will return items contained by the object, such as array elements. If left undefined, the object cannot be passed directly to a for-loop unless it has an [enumerator-compatible Call method](lib/Enumerator.md#Call).

*NumberOfVars* contains the number of variables passed to the for-loop. If *NumberOfVars* is 2, the enumerator is expected to assign the key or index of an item to the first parameter and the value to the second parameter. Each key or index should be accepted as a parameter of the [\__Item](#__Item) property. This enables [DBGp-based debuggers](AHKL_DBGPClients.md) to get or set a specific item after listing them by invoking the enumerator.

<a id="__Item"></a>
### \__Item Property

The \__Item property is invoked when the indexing operator (array syntax) is used with the object. In the following example, the property is declared as static so that the indexing operator can be used on the Env class itself. For another example, see [Array2D](#Array2D).

```ahk
class Env {
    static __Item[name] {
        get => EnvGet(name)
        set => EnvSet(name, value)
    }
}

Env["PATH"] .= ";" A_ScriptDir  ; Only affects this script and child processes.
MsgBox Env["PATH"]
```

`__Item` is effectively a default property name (if such a property has been defined):

- `object[params]` is equivalent to `object.__Item[params]` when there are parameters.
- `object[]` is equivalent to `object.__Item`.

For example:

```ahk
obj := {}
obj[] := Map()     ; Equivalent to obj.__Item := Map()
obj["base"] := 10
MsgBox obj.base = Object.prototype  ; True
MsgBox obj["base"]                  ; 10
```

> **Note:** When an explicit property name is combined with empty brackets, as in `obj.prop[]`, it is handled as two separate operations: first retrieve `obj.prop`, then invoke the default property of the result. This is part of the language syntax, so is not dependent on the object.

<a id="Custom_NewDelete"></a>
### Construction and Destruction

Whenever an object is created by the default implementation of [*ClassName*()](lib/Class.md#Call), the new object's \__New method is called in order to allow custom initialization. Any parameters passed to `ClassName()` are forwarded to \__New, so can affect the object's initial content or how it is constructed. When an object is destroyed, \__Delete is called. For example:

<a id="GMem"></a>

```ahk
m1 := GMem(0, 10)
m2 := {base: GMem.Prototype}, m2.__New(0, 30)

; Note: For general memory allocations, use Buffer() instead.
class GMem
{
    __New(aFlags, aSize)
    {
        this.ptr := DllCall("GlobalAlloc", "UInt", aFlags, "Ptr", aSize, "Ptr")
        if !this.ptr
            throw MemoryError()
        MsgBox "New GMem of " aSize " bytes at address " this.ptr "."
    }

    __Delete()
    {
        MsgBox "Delete GMem at address " this.ptr "."
        DllCall("GlobalFree", "Ptr", this.ptr)
    }
}
```

\__Delete is not called for any object which owns a property named "__Class". [Prototype objects](lib/Class.md#Prototype) have this property by default.

If an exception or runtime error is thrown while \__Delete is executing and is not handled within \__Delete, it acts as though \__Delete was called from a new [thread](misc/Threads.md). That is, an error dialog is displayed and \__Delete returns, but the thread does not exit (unless it was already exiting).

If the script is directly terminated by any means, including the tray menu or [ExitApp](lib/ExitApp.md), any functions which have yet to return do not get the chance to do so. Therefore, any objects referenced by local variables of those functions are not released, so \__Delete is not called. Temporary references on the expression evaluation stack are also not released under such circumstances.

When the script exits, objects contained by global and static variables are released automatically in an arbitrary, implementation-defined order. When \__Delete is called during this process, some global or static variables may have already been released, but any references contained by the object itself are still valid. It is therefore best for \__Delete to be entirely self-contained, and not rely on any global or static variables.

<a id="static__New"></a>
#### Class Initialization

Each class is initialized automatically when a reference to the class is evaluated for the first time. For example, if *MyClass* has not yet been initialized, `MyClass.MyProp` would cause the class to be initialized before the property is retrieved. Initialization consists of calling two static methods: \__Init and \__New.

`static __Init` is defined automatically for every class, and always begins with a reference to the base class if one was specified, to ensure it is initialized. [Static/class variables](#Custom_Classes_staticvar) and [nested classes](#Custom_Classes_class) are initialized in the order that they were defined, except when a nested class is referenced during initialization of a previous variable or class.

If the class defines or inherits a `static __New` method, it is called immediately after \__Init. It is important to note that \__New may be called once for the class in which it is defined *and* once for each subclass which does not define its own (or which calls `super.__New()`). This can be used to perform common initialization tasks for each subclass, or modify subclasses in some way before they are used.

If `static __New` is not intended to act on derived classes, that can be avoided by checking the value of `this`. In some cases it may be sufficient for the method to delete itself, such as with `this.DeleteProp('__New')`; however, the first execution of \__New might be for a subclass if one is nested in the base class or referenced during initialization of a static/class variable.

A class definition also has the effect of referencing the class. In other words, when execution reaches a class definition during [script startup](Scripts.md#auto), \__Init and \__New are called automatically, unless the class was already referenced by the script. However, if execution is prevented from reaching the class definition, such as by `return` or an infinite loop, the class is initialized only if it is referenced.

Once automatic initialization begins, it will not occur again for the same class. This is generally not a problem unless multiple classes refer to each other. For example, consider the two classes below. When `A` is initialized first, evaluating `B.SharedArray` (A1) causes `B` to be initialized before retrieving and returning the value, but `A.SharedValue` (A3) is undefined and does not cause initialization of `A` because it is already in progress. In other words, if `A` is accessed or initialized first, the order is A1 to A3; otherwise it is B1 to B4:

```ahk
MsgBox A.SharedArray.Length
MsgBox B.SharedValue

class A {
    static SharedArray := B.SharedArray   ; A1          ; B3
    static SharedValue := 42                            ; B4
}

class B {
    static SharedArray := StrSplit("XYZ") ; A2          ; B1
    static SharedValue := A.SharedValue   ; A3 (Error)  ; B2
}
```

<a id="Meta_Functions"></a>
### Meta-Functions

```ahk
class ClassName {
    __Get(Name, Params)
    __Set(Name, Params, Value)
    __Call(Name, Params)
}
```

**Name**

The name of the property or method.

**Params**

An [Array](lib/Array.md) of parameters. This includes only the parameters between `()` or `[]`, so may be empty. The meta-function is expected to handle cases such as `x.y[z]` where `x.y` is undefined.

**Value**

The value being assigned.

Meta-functions define what happens when an undefined property or method is invoked. For example, if `obj.unk` has not been assigned a value, it invokes the *\__Get* meta-function. Similarly, `obj.unk := value` invokes *\__Set* and `obj.unk()` invokes *\__Call*.

Properties and methods can be defined in the object itself or any of its [base objects](#delegation). In general, for a meta-function to be called for every property, one must avoid defining any properties. Built-in properties such as [Base](lib/Object.md#Base) can be overridden with a [property definition](#Custom_Classes_property) or [DefineProp](lib/Object.md#DefineProp).

If a meta-function is defined, it must perform whatever default action is required. For example, the following might be expected:

- *Call*: Throw a [MethodError](lib/Error.md#MethodError).
- If parameters were given, throw an exception (there's no object to forward the parameters to).
- *Get*: Throw a [PropertyError](lib/Error.md#PropertyError).
- *Set*: Define a new property with the given value, such as by calling [DefineProp](lib/Object.md#DefineProp).

Any [callable object](misc/Functor.md) can be used as a meta-function by assigning it to the relevant property.

Meta-functions are not called in the following cases:

- `x[y]`: Using square brackets without a property name only invokes the [\__Item](#__Item) property.
- `x()`: Calling the object itself only invokes the Call method. This includes internal calls made by built-in functions such as [SetTimer](lib/SetTimer.md) and [Hotkey](lib/Hotkey.md).
- Internal calls to other meta-functions or double-underscore methods do not trigger `__Call`.

<a id="Dynamic_Properties"></a>
#### Dynamic Properties

[Property syntax](#Custom_Classes_property) and [DefineProp](lib/Object.md#DefineProp) can be used to define properties which compute a value each time they are evaluated, but each property must be defined in advance. By contrast, *\__Get* and *\__Set* can be used to implement properties which are known only at the moment they are invoked.

For example, a "proxy" object could be created which sends requests for properties over the network (or through some other channel). A remote server would send back a response containing the value of the property, and the proxy would return the value to its caller. Even if the name of each property was known in advance, it would not be logical to define each property individually in the proxy class since every property does the same thing (send a network request). Meta-functions receive the property name as a parameter, so are a good solution to this problem.

<a id="primitive"></a>
## Primitive Values

Primitive values, such as strings and numbers, cannot have their own properties and methods. However, primitive values support the same kind of [delegation](#delegation) as objects. That is, any property or method call on a primitive value is delegated to a predefined prototype object, which is also accessible via the [Prototype](lib/Class.md#Prototype) property of the corresponding class. The following classes relate to primitive values:

- Primitive (extends [Any](lib/Any.md))
    - Number
        - Float
        - Integer
    - String

Although checking the [Type](lib/Type.md) string is generally faster, the type of a value can be tested by checking whether it has a given base. For example, `n.HasBase(Number.Prototype)` or `n is Number` is true if *n* is a pure Integer or Float, but not if *n* is a numeric string, since String does not derive from Number. By contrast, `IsNumber(n)` is true if *n* is a number or a numeric string.

[ObjGetBase](lib/Any.md#GetBase) and the [Base](lib/Any.md#Base) property return one of the predefined prototype objects when appropriate.

Note that `x is Any` would ordinarily be true for any value within AutoHotkey's type hierarchy, but false for COM objects.

<a id="primitive-extension"></a>
### Adding Properties and Methods

Properties and methods can be added for all values of a given type by modifying that type's prototype object. However, since a primitive value is not an Object and cannot have its own properties or methods, the primitive prototype objects do not derive from `Object.Prototype`. In other words, methods such as [DefineProp](lib/Object.md#DefineProp) and [HasOwnProp](lib/Object.md#HasOwnProp) are not accessible by default. They can be called indirectly. For example:

```ahk
DefProp := {}.DefineProp
DefProp( "".base, "Length", { get: StrLen } )
MsgBox A_AhkPath.length " == " StrLen(A_AhkPath)
```

Although primitive values can inherit value properties from their prototype, an exception is thrown if the script attempts to set a value property on a primitive value. For example:

```ahk
"".base.test := 1  ; Don't try this at home.
MsgBox "".test  ; 1
"".test := 2  ; Error: Property is read-only.
```

Although \__Set and property setters can be used, they are not useful since primitive values should be considered immutable.

<a id="Implementation"></a>
## Implementation

<a id="Refs"></a>

<a id="Reference_Counting"></a>
### Reference Counting

AutoHotkey uses a basic reference counting mechanism to automatically free the resources used by an object when it is no longer referenced by the script. Understanding this mechanism can be essential for properly managing the lifetime of an object, allowing it to be deleted when it is no longer needed, and not before then.

An object's reference count is incremented whenever a reference is stored. When a reference is released, the count is used to determine whether that reference is the last one. If it is, the object is deleted; otherwise, the count is decremented. The following example shows how references are counted in some simple cases:

```ahk
a := {Name: "Bob"}  ; Bob's ref count is initially 1
b := [a]            ; Bob's ref count is incremented to 2
a := ""             ; Bob's ref count is decremented to 1
c := b.Pop()        ; Bob is transferred, ref count still 1
c := ""             ; Bob is deleted...
```

Temporary references returned by functions, methods or operators within an expression are released after evaluation of that expression has completed or been aborted. In the following example, the new [GMem](#GMem) object is freed only after MsgBox has returned:

```ahk
MsgBox DllCall("GlobalSize", "ptr", GMem(0, 20).ptr, "ptr")  ; 20
```

> **Note:** In this example, `.ptr` could have been omitted since the [Ptr](lib/DllCall.md#Ptr) arg type permits objects with a Ptr property. However, the pattern shown above will work even with other property names.

To run code when the last reference to an object is being released, implement the [\__Delete](#Custom_NewDelete) meta-function.

<a id="refs-problems"></a>
#### Problems with Reference Counting

Relying solely on reference counting sometimes creates catch-22 situations: an object is designed to free its resources when deleted, but would only be deleted if its resources are first freed. Specifically, this occurs when those resources are other objects or functions which retain a reference to the object, often indirectly.

A *circular reference* or *reference cycle* is when an object directly or indirectly refers to itself. If each reference which is part of the cycle is included in the count, the object cannot be deleted until the cycle is manually broken. For example, the following creates a reference cycle:

```ahk
parent := {}  ; parent: 1 (reference count)
child := {parent: parent}  ; parent: 2, child: 1
parent.child := child  ; parent: 2, child: 2
```

If the variables `parent` and `child` are reassigned, the reference count for each object is decremented to 1. Both objects would be inaccessible to the script, but would not be deleted because the last references are not released.

A cycle is often less obvious than this, and can involve several objects. For example, [ShowRefCycleGui](lib/Gui.md#ExRefCycle) demonstrates a cycle involving a Gui, MenuBar, Menu and closures. The use of a separate object to handle GUI events is also prone to cycles, if the handler object has a reference to the GUI.

Non-cyclic references to an object can also cause issues. For instance, objects with a dependency on built-in functions like SetTimer or OnMessage generally cause the program to hold an indirect reference to the object. This would prevent the object from being deleted, which means that it cannot use \__New and \__Delete to manage the timer or message monitor.

Below are several strategies for solving issues like those described above.

<a id="ref-avoid-cycles"></a>

**Avoid cycles:** If reference cycles are a problem, avoid creating them. For example, either `parent.child` or `child.parent` would not be set. This is often not practical, as related objects may need a way to refer to each other.

When defining event handlers for [OnEvent (Gui)](lib/GuiOnEvent.md), avoid capturing the source Gui in a closure or bound function and instead utilize the Gui or Gui.Control parameter. Likewise for [Add (Menu)](lib/Menu.md#Add) and the callback's Menu parameter, but of course, a menu item which needs to refer to a Gui cannot use this approach.

In some cases, the other object can be retrieved by an indirect method which doesn't rely on a counted reference. For example, retain a HWND and use `GuiFromHwnd(hwnd)` to retrieve a [Gui](lib/Gui.md) object. Retaining a reference is not necessary to prevent deletion while the window is visible, as the Gui itself handles this.

<a id="ref-break-cycles"></a>

**Break cycles:** If the script can avoid relying on reference counting and instead manage the lifetime of the object directly, it needs only break the cycle when the objects are to be deleted:

```ahk
child.parent := unset  ; parent: 1, child: 2
child := unset  ; parent: 1, child: 1
parent := unset  ; both deleted
```

<a id="ref-dispose"></a>

**Dispose:** \__Delete is called precisely when the last reference is released, so one might come to think of a simple assignment like `myGui := ""` as a cleanup step which triggers deletion of the object. Sometimes this is done explicitly when the object is no longer needed, but it is neither reliable nor truly showing the intent of the code. An alternative pattern is to define a Dispose or Destroy method which frees the object's resources, and design it to do nothing if called a second time. It can then also be called from \__Delete, as a safeguard.

An object following this pattern would still need to break any reference cycles when it is *disposed*, otherwise some memory would not be reclaimed, and \__Delete would not be called for other objects referenced by the object.

Cycles caused by a Gui object's event handlers, MenuBar or event sink object are automatically "broken" when [Destroy](lib/Gui.md#Destroy) is called, as it releases those objects. (This is demonstrated in the [ShowRefCycleGui example](lib/Gui.md#ExRefCycle).) However, this would not break cycles caused by new properties which the script has added, as Destroy does not delete them.

Similar to the Dispose pattern, [InputHook](lib/InputHook.md) has a Stop method which must be called explicitly, so it does not rely on \__Delete to signal when its operation should end. While operating, the program effectively holds a reference to the object which prevents it from being deleted, but this becomes a strength rather than a flaw: event callbacks can still be called and will receive the InputHook as a parameter. When the operation ends, the internal reference is released and the InputHook is deleted if the script has no reference to it.

<a id="ref-ptr"></a>

**Pointers:** Storing any number of pointer values does not affect the reference count of the object, since a pointer is just an integer. A pointer retrieved with [ObjPtr](#ObjPtr) can be used to produce a reference by passing it to [ObjFromPtrAddRef](#ObjFromPtr). The AddRef version of the function must be used because the reference count will be decremented when the temporary reference is automatically released.

For example, suppose that an object needs to update some properties each second. A timer holds a reference to the callback function, which has the object bound as a parameter. Normally this would prevent the object from being deleted before the timer is deleted. Storing a pointer instead of a reference allows the object to be deleted regardless of the timer, so it can be managed automatically by \__New and \__Delete.

```ahk
a := SomeClass()
Sleep 5500  ; Let the timer run 5 times.
a := ""
Sleep 3500  ; Prevent exit temporarily to show that the timer has stopped.

class SomeClass {
    __New() {
        ; The closure must be stored so that the timer can be deleted later.
        ; Synthesize a counted reference each time the method needs to be called.
        this.Timer := (p => ObjFromPtrAddRef(p).Update()).Bind(ObjPtr(this))
        SetTimer this.Timer, 1000
    }
    __Delete() {
        SetTimer this.Timer, 0
        ; If this object is truly deleted, all properties will be
        ; deleted and the following __Delete method will be called.
        ; This is just for confirmation and wouldn't normally be used.
        this.Test := {__Delete: test => ToolTip("object deleted")}
    }
    ; This is just to demonstrate that the timer is running.
    ; Hypothetically, this class has some other purpose.
    count := 0
    Update() => ToolTip(++this.count)
}
```

A drawback of this approach is that the pointer is not directly usable as an object, and is not recognized as such by [Type](lib/Type.md) or the [debugger](AHKL_DBGPClients.md). The script must be absolutely certain not to use the pointer after the object is deleted, as doing so is invalid and the result would be indeterminate.

If the pointer-reference is needed in multiple places, encapsulating it might make sense. For instance, `b := ObjFromPtrAddRef.Bind(ObjPtr(this))` would produce a [BoundFunc](misc/Functor.md#BoundFunc) which can be called (`b()`) to retrieve the reference, while `((this, p) => ObjFromPtrAddRef(p)).Bind(ObjPtr(this))` can be used as a property getter (the property would return a reference).

<a id="ref-uncounted"></a>

**Uncounted references:** If the object's reference count accounts for a reference, we call it a *counted reference*, otherwise we call it an *uncounted reference*. The idea of the latter is to allow the script to store a reference which does not prevent the object from being deleted.

> **Note:** This is about how the object's reference count relates to a given reference as per the script's logic, and doesn't affect the nature of the reference itself. The program will still attempt to release the reference automatically at whatever time it would normally, so the terms *weak reference* and *strong reference* are unsuitable.

A counted reference can be turned into an uncounted reference by simply decrementing the object's reference count. This <u>must</u> be reversed before the reference is released, which <u>must</u> occur before the object is deleted. Since the point of an uncounted reference is to allow the object to be deleted without first manually unsetting the reference, generally the count must be corrected within that object's own [\__Delete](#Custom_NewDelete) method.

For example, \__New and \__Delete from the previous example can be replaced with the following.

```ahk
    __New() {
        ; The BoundFunc must be stored so that the timer can be deleted later.
        SetTimer this.Timer := this.Update.Bind(this), 1000
        ; Decrement ref count to compensate for the AddRef done by Bind.
        ObjRelease(ObjPtr(this))
    }
    __Delete() {
        ; Increment ref count so that the ref within the BoundFunc
        ; can be safely released.
        ObjPtrAddRef(this)
        ; Delete the timer to release its reference to the BoundFunc.
        SetTimer this.Timer, 0
        ; Release the BoundFunc. This may not happen automatically
        ; due to the reference cycle which exists now that the ref
        ; in the BoundFunc is counted again.
        this.Timer := unset
        ; If this object is truly deleted, all properties will be
        ; deleted and the following __Delete method will be called.
        ; This is just for confirmation and wouldn't normally be used.
        this.Test := {__Delete: test => ToolTip("object deleted")}
    }
```

This can generally be applied regardless of where the uncounted reference is stored and what it is used for. The key points are:

- Decrement the reference count (Release) *after* storing the reference.
- Increment the reference count (AddRef) *before* unsetting the reference.
- Explicitly unset the reference before \__Delete returns (doing so before it is called is fine).

The reference count must be incremented and decremented as many times as there are references which are intended to be uncounted. This may not be practical if the script cannot accurately predict how many references will be stored by some function.

<a id="ObjPtr"></a>
### Pointers to Objects

As part of creating an object, some memory is allocated to hold the basic structure of the object. This structure is essentially the object itself, so we call its address a *pointer to the object*. An address is an integer value which corresponds to a location within the virtual memory of the current process, and is valid only until the object is deleted.

In some rare cases it may be necessary to pass an object to external code via DllCall or store it in a binary data structure for later retrieval. An object's address can be retrieved via `address := ObjPtr(myObject)`; however, this effectively makes two references to the object, but the program only knows about the one in *myObject*. If the last *known* reference to the object was released, the object would be deleted. Therefore, the script must inform the object that it has gained a reference. This can be done as follows (the two lines below are equivalent):

```ahk
ObjAddRef(address := ObjPtr(myObject))
address := ObjPtrAddRef(myObject)
```

The script must also inform the object when it is finished with that reference:

```ahk
ObjRelease(address)
```

Generally each new copy of an object's address should be treated as another reference to the object, so the script should call [ObjAddRef](lib/ObjAddRef.md) when it gains a copy and [ObjRelease](lib/ObjAddRef.md) immediately before losing one. For example, whenever an address is copied via something like `x := address`, [ObjAddRef](lib/ObjAddRef.md) should be called. Similarly, when the script is finished with *x* (or is about to overwrite *x*'s value), it should call [ObjRelease](lib/ObjAddRef.md).

<a id="ObjFromPtr"></a>

To convert an address to a proper reference, use the ObjFromPtr function:

```ahk
myObject := ObjFromPtr(address)
```

ObjFromPtr assumes that *address* is a counted reference, and claims ownership of it. In other words, `myObject := ""` would cause the reference originally represented by *address* to be released. After that, *address* must be considered invalid. To instead make a new reference, use one of the following:

```ahk
ObjAddRef(address), myObject := ObjFromPtr(address)
myObject := ObjFromPtrAddRef(address)
```
