# Map Object

```ahk
class Map extends Object
```

A **Map** object associates or *maps* one set of values, called *keys*, to another set of values. A key and the value it is mapped to are known as a key-value pair. A map can contain any number of key-value pairs, but each key must be unique.

A key may be any [Integer](../Concepts.md#numbers), [object](../Objects.md) reference or null-terminated [String](../Concepts.md#strings). Comparison of string keys is case-sensitive, while objects are compared by reference/address. [Float](../Concepts.md#numbers) keys are automatically converted to String.

The simplest use of a map is to retrieve or set a key-value pair via the implicit [\__Item](#__Item) property, by simply writing the key between brackets following the map object. For example:

```ahk
clrs := Map()
clrs["Red"] := "ff0000"
clrs["Green"] := "00ff00"
clrs["Blue"] := "0000ff"
for clr in Array("Blue", "Green")
    MsgBox clrs[clr]
```

"MapObj" is used below as a placeholder for any Map object, as "Map" is the class itself.

In addition to the methods and properties inherited from [Object](Object.md), Map objects have the following predefined methods and properties.

<a id="toc"></a>
## Table of Contents

- [Static Methods](#StaticMethods):
    - [Call](#Call): Creates a Map and sets items.
- [Methods](#Methods):
    - [Clear](#Clear): Removes all key-value pairs from a map.
    - [Clone](#Clone): Returns a shallow copy of a map.
    - [Delete](#Delete): Removes a key-value pair from a map.
    - [Get](#Get): Returns the value associated with a key, or a default value.
    - [Has](#Has): Returns true if the specified key has an associated value within a map.
    - [Set](#Set): Sets zero or more items.
    - [\__Enum](#__Enum): Enumerates key-value pairs.
    - [\__New](#__New): Sets items. Equivalent to Set.
- [Properties](#Properties):
    - [Count](#Count): Gets the number of key-value pairs present in a map.
    - [Capacity](#Capacity): Gets or sets the current capacity of a map.
    - [CaseSense](#CaseSense): Gets or sets a map's case sensitivity setting.
    - [Default](#Default): Sets the default value returned when a key is not found.
    - [\__Item](#__Item): Gets or sets the value of a key-value pair.

<a id="StaticMethods"></a>
## Static Methods

<a id="Call"></a>

### Call

Creates a Map and sets items.

```ahk
MapObj := Map(Key1, Value1, Key2, Value2, ...)
MapObj := Map.Call(Key1, Value1, Key2, Value2, ...)
```

This is equivalent to setting each item with `MapObj[Key] := Value`, except that [\__Item](#__Item) is not called and [Capacity](#Capacity) is automatically adjusted to avoid expanding multiple times during a single call.

Parameters are defined by [\__New](#__New).

<a id="Methods"></a>
## Methods

<a id="Clear"></a>

### Clear

Removes all key-value pairs from a map.

```ahk
MapObj.Clear()
```

<a id="Clone"></a>

### Clone

Returns a shallow copy of a map.

```ahk
Clone := MapObj.Clone()
```

All key-value pairs are copied to the new map. Object *references* are copied (like with a normal assignment), not the objects themselves.

Own properties, own methods and base are copied as per [Obj.Clone](Object.md#Clone).

<a id="Delete"></a>

### Delete

Removes a key-value pair from a map.

```ahk
RemovedValue := MapObj.Delete(Key)
```

<a id="Delete_Parameters"></a>
#### Parameters

**Key**

Type: [Integer](../Concepts.md#numbers), [Object](../Concepts.md#objects) or [String](../Concepts.md#strings)

Any single key. If the map does not contain this key, an [UnsetItemError](Error.md#UnsetError) is thrown.

<a id="Delete_Return_Value"></a>
#### Return Value

Type: [Any](../Concepts.md#values)

This method returns the removed value.

<a id="Get"></a>

### Get

Returns the value associated with a key, or a default value.

```ahk
Value := MapObj.Get(Key , Default)
```

This method carries out the following steps:

1. Return the value associated with *Key*, if found.
2. Return the value of the *Default* parameter, if specified.
3. Return the value of `MapObj.Default`, if defined.
4. Throw an [UnsetItemError](Error.md#UnsetError).

When *Default* is omitted, this is equivalent to `MapObj[Key]`, except that [\__Item](#__Item) is not called.

<a id="Has"></a>

### Has

Returns true if the specified key has an associated value within a map, otherwise false.

```ahk
MapObj.Has(Key)
```

<a id="Set"></a>

### Set

Sets zero or more items.

```ahk
MapObj.Set(Key, Value, Key2, Value2, ...)
```

This is equivalent to setting each item with `MapObj[Key] := Value`, except that [\__Item](#__Item) is not called and [Capacity](#Capacity) is automatically adjusted to avoid expanding multiple times during a single call.

<a id="Set_Return_Value"></a>
#### Return Value

Type: [Object](../Concepts.md#objects)

This method returns the Map.

<a id="__Enum"></a>

### \__Enum

Enumerates key-value pairs.

```ahk
For Key , Value in MapObj
```

Returns a new [enumerator](Enumerator.md). This method is typically not called directly. Instead, the map object is passed directly to a [for-loop](For.md), which calls \__Enum once and then calls the enumerator once for each iteration of the loop. Each call to the enumerator returns the next key and/or value. The for-loop's variables correspond to the enumerator's parameters, which are:

**Key**

Type: [Integer](../Concepts.md#numbers), [Object](../Concepts.md#objects) or [String](../Concepts.md#strings)

The key.

**Value**

Type: [Any](../Concepts.md#values)

The value.

<a id="__New"></a>

### \__New

Sets items. Equivalent to [Set](#Set).

```ahk
MapObj.__New(Key, Value, Key2, Value2, ...)
```

This method exists to support [Call](#Call), and is not intended to be called directly. See [Construction and Destruction](../Objects.md#Custom_NewDelete).

<a id="Properties"></a>
## Properties

<a id="Count"></a>

### Count

Gets the number of key-value pairs present in a map.

```ahk
Count := MapObj.Count
```

<a id="Capacity"></a>

### Capacity

Gets or sets the current capacity of a map.

```ahk
MaxItems := MapObj.Capacity
```

```ahk
MapObj.Capacity := MaxItems
```

*MaxItems* is an [integer](../Concepts.md#numbers) representing the maximum number of key-value pairs the map should be able to contain before it must be automatically expanded. If setting a value less than the current number of key-value pairs, that number is used instead, and any unused space is freed.

<a id="CaseSense"></a>

### CaseSense

Gets or sets a map's case sensitivity setting.

```ahk
CurrentSetting := MapObj.CaseSense
```

```ahk
MapObj.CaseSense := NewSetting
```

*CurrentSetting* is *NewSetting* if assigned, otherwise On by default (but note that this property only retrieves the string variant of the current setting).

*NewSetting* is one of the following [strings](../Concepts.md#strings) or [integers (boolean)](../Concepts.md#boolean):

**On** or **1** (true): Key lookups are case-sensitive. This is the default setting.

**Off** or **0** (false): Key lookups are not case-sensitive, i.e. the letters A-Z are considered identical to their lowercase counterparts.

**Locale:** Key lookups are not case-sensitive according to the rules of the current user's locale. For example, most English and Western European locales treat not only the letters A-Z as identical to their lowercase counterparts, but also non-ASCII letters like Ä and Ü as identical to theirs. *Locale* is 1 to 8 times slower than *Off* depending on the nature of the strings being compared.

Attempting to assign to this property causes an exception to be thrown if the Map is not empty.

<a id="Default"></a>

### Default

Sets the default value returned when a key is not found.

```ahk
MapObj.Default := Value
```

This property actually doesn't exist by default, but can be defined by the script. If defined, its value is returned by [\__Item](#__Item) or [Get](#Get) if the requested item cannot be found, instead of throwing an [UnsetItemError](Error.md#UnsetError). It can be implemented by any of the normal means, including a [dynamic property](Object.md#DefineProp) or [meta-function](../Objects.md#Meta_Functions), but determining which key was queried would require overriding [\__Item](#__Item) or [Get](#Get) instead.

<a id="__Item"></a>

### \__Item

Gets or sets the value of a key-value pair.

```ahk
Value := MapObj[Key]
Value := MapObj.__Item[Key]
```

```ahk
MapObj[Key] := Value
MapObj.__Item[Key] := Value
```

When retrieving a value, *Key* must be a unique value previously associated with another value. An [UnsetItemError](Error.md#UnsetError) is thrown if *Key* has no associated value within the map, unless a [Default](#Default) property is defined, in which case its value is returned.

When assigning a value, *Key* can be any value to associate with *Value*; in other words, the *key* used to later access *Value*. [Float](../Concepts.md#numbers) keys are automatically converted to String.

The property name \__Item is typically omitted, as shown above, but is used when overriding the property.
