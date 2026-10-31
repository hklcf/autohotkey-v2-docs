# Array Object

```ahk
class Array extends Object
```

An **Array** object contains a list or sequence of values.

Values are addressed by their position within the array (known as an *array index*), where position 1 is the first element.

Arrays are often created by enclosing a list of values in brackets. For example:

```ahk
veg := ["Asparagus", "Broccoli", "Cucumber"]
Loop veg.Length
    MsgBox veg[A_Index]
```

A negative index can be used to address elements in reverse, so -1 is the last element, -2 is the second last element, and so on.

Attempting to use an array index which is out of bounds (such as zero, or if its absolute value is greater than the [Length](#Length) of the array) is considered an error and will cause an [IndexError](Error.md#IndexError) to be thrown. The best way to add new elements to the array is to call [InsertAt](#InsertAt) or [Push](#Push). For example:

```ahk
users := Array()
users.Push(A_UserName)
MsgBox users[1]
```

An array can also be extended by assigning a larger value to [Length](#Length). This changes which indices are valid, but [Has](#Has) will show that the new elements have no value. Elements without a value are typically used for [variadic calls](../Functions.md#VariadicCall) or by [variadic functions](../Functions.md#Variadic), but can be used for any purpose.

"ArrayObj" is used below as a placeholder for any Array object, as "Array" is the class itself.

In addition to the methods and properties inherited from [Object](Object.md), Array objects have the following predefined methods and properties.

<a id="toc"></a>
## Table of Contents

- [Static Methods](#StaticMethods):
    - [Call](#Call): Creates a new Array containing the specified values.
- [Methods](#Methods):
    - [Clone](#Clone): Returns a shallow copy of an array.
    - [Delete](#Delete): Removes the value of an array element, leaving the index without a value.
    - [Get](#Get): Returns the value at a given index, or a default value.
    - [Has](#Has): Returns a non-zero number if the index is valid and there is a value at that position.
    - [InsertAt](#InsertAt): Inserts one or more values at a given position.
    - [Pop](#Pop): Removes and returns the last array element.
    - [Push](#Push): Appends values to the end of an array.
    - [RemoveAt](#RemoveAt): Removes items from an array.
    - [\__New](#__New): Appends items. Equivalent to Push.
    - [\__Enum](#__Enum): Enumerates array elements.
- [Properties](#Properties):
    - [Length](#Length): Gets or sets the number of items in an array.
    - [Capacity](#Capacity): Gets or sets the current capacity of an array.
    - [Default](#Default): Sets the default value returned when an element with no value is requested.
    - [\__Item](#__Item): Gets or sets the value of an array element.

<a id="StaticMethods"></a>
## Static Methods

<a id="Call"></a>

### Call

Creates a new Array containing the specified values.

```ahk
ArrayObj := Array(Value, Value2, ..., ValueN)
ArrayObj := Array.Call(Value, Value2, ..., ValueN)
```

Parameters are defined by [\__New](#__New).

<a id="Methods"></a>
## Methods

<a id="Clone"></a>

### Clone

Returns a shallow copy of an array.

```ahk
Clone := ArrayObj.Clone()
```

All array elements are copied to the new array. Object *references* are copied (like with a normal assignment), not the objects themselves.

Own properties, own methods and base are copied as per [Obj.Clone](Object.md#Clone).

<a id="Delete"></a>

### Delete

Removes the value of an array element, leaving the index without a value.

```ahk
RemovedValue := ArrayObj.Delete(Index)
```

<a id="Delete_Parameters"></a>
#### Parameters

**Index**

Type: [Integer](../Concepts.md#numbers)

A valid array index.

<a id="Delete_Return_Value"></a>
#### Return Value

Type: [Any](../Concepts.md#values)

This method returns the removed value (blank if none).

<a id="Delete_Remarks"></a>
#### Remarks

This method does not affect the [Length](#Length) of the array.

A [ValueError](Error.md#ValueError) is thrown if *Index* is out of range.

<a id="Get"></a>

### Get

Returns the value at a given index, or a default value.

```ahk
Value := ArrayObj.Get(Index , Default)
```

This method carries out the following steps:

1. Throw an [IndexError](Error.md#IndexError) if *Index* is zero or out of range.
2. Return the value at *Index*, if there is one (see [Has](#Has)).
3. Return the value of the *Default* parameter, if specified.
4. Return the value of `ArrayObj.Default`, if defined.
5. Throw an [UnsetItemError](Error.md#UnsetError).

When *Default* is omitted, this is equivalent to `ArrayObj[Index]`, except that [\__Item](#__Item) is not called.

<a id="Has"></a>

### Has

Returns a non-zero number if the index is valid and there is a value at that position.

```ahk
HasIndex := ArrayObj.Has(Index)
```

<a id="InsertAt"></a>

### InsertAt

Inserts one or more values at a given position.

```ahk
ArrayObj.InsertAt(Index, Value1 , Value2, ... ValueN)
```

<a id="InsertAt_Parameters"></a>
#### Parameters

**Index**

Type: [Integer](../Concepts.md#numbers)

The position to insert *Value1* at. Subsequent values are inserted at Index+1, Index+2, etc. Specifying an index of 0 is the same as specifying [Length](#Length) + 1.

**Value1 ...**

Type: [Any](../Concepts.md#values)

One or more values to insert. To insert an array of values, pass `theArray*` as the last parameter.

<a id="InsertAt_Remarks"></a>
#### Remarks

InsertAt is the counterpart of [RemoveAt](#RemoveAt).

Any items previously at or to the right of *Index* are shifted to the right. Missing parameters are also inserted, but without a value. For example:

```ahk
x := []
x.InsertAt(1, "A", "B") ; =>  ["A", "B"]
x.InsertAt(2, "C")      ; =>  ["A", "C", "B"]

; Missing elements are preserved:
x := ["A", , "C"]
x.InsertAt(2, "B")      ; =>  ["A", "B",    , "C"]

x := ["C"]
x.InsertAt(1, , "B")    ; =>  [   , "B", "C"]
```

A [ValueError](Error.md#ValueError) is thrown if *Index* is less than `-ArrayObj.Length` or greater than `ArrayObj.Length + 1`. For example, with an array of 3 items, *Index* must be between -3 and 4, inclusive.

<a id="Pop"></a>

### Pop

Removes and returns the last array element.

```ahk
RemovedValue := ArrayObj.Pop()
```

All of the following are equivalent:

```ahk
RemovedValue := ArrayObj.Pop()
RemovedValue := ArrayObj.RemoveAt(ArrayObj.Length)
RemovedValue := ArrayObj.RemoveAt(-1)
```

If the array is empty ([Length](#Length) is 0), an [Error](Error.md) is thrown.

<a id="Push"></a>

### Push

Appends values to the end of an array.

```ahk
ArrayObj.Push(Value, Value2, ..., ValueN)
```

<a id="Push_Parameters"></a>
#### Parameters

**Value ...**

Type: [Any](../Concepts.md#values)

One or more values to insert. To insert an array of values, pass `theArray*` as the last parameter.

<a id="RemoveAt"></a>

### RemoveAt

Removes items from an array.

```ahk
RemovedValue := ArrayObj.RemoveAt(Index)
ArrayObj.RemoveAt(Index, Length)
```

<a id="RemoveAt_Parameters"></a>
#### Parameters

**Index**

Type: [Integer](../Concepts.md#numbers)

The index of the value or values to remove.

**Length**

Type: [Integer](../Concepts.md#numbers)

If omitted, one item is removed. Otherwise, specify the length of the range of values to remove.

<a id="RemoveAt_Return_Value"></a>
#### Return Value

Type: [Any](../Concepts.md#values)

If *Length* is omitted, the removed value is returned (blank if none). Otherwise there is no return value.

<a id="RemoveAt_Remarks"></a>
#### Remarks

RemoveAt is the counterpart of [InsertAt](#InsertAt).

A [ValueError](Error.md#ValueError) is thrown if the range indicated by *Index* and *Length* is not entirely within the array's current bounds.

The remaining items to the right of *Pos* are shifted to the left by *Length* (or 1 if omitted). For example:

```ahk
x := ["A", "B"]
MsgBox x.RemoveAt(1)  ; A
MsgBox x[1]           ; B

x := ["A", , "C"]
MsgBox x.RemoveAt(1, 2)  ; 1
MsgBox x[1]              ; C
```

<a id="__New"></a>

### \__New

Appends items. Equivalent to [Push](#Push).

```ahk
ArrayObj.__New(Value, Value2, ..., ValueN)
```

This method exists to support [Call](#Call), and is not intended to be called directly. See [Construction and Destruction](../Objects.md#Custom_NewDelete).

<a id="__Enum"></a>

### \__Enum

Enumerates array elements.

```ahk
For Value in ArrayObj
```

```ahk
For Index, Value in ArrayObj
```

Returns a new [enumerator](Enumerator.md). This method is typically not called directly. Instead, the array object is passed directly to a [for-loop](For.md), which calls \__Enum once and then calls the enumerator once for each iteration of the loop. Each call to the enumerator returns the next array element. The for-loop's variables correspond to the enumerator's parameters, which are:

**Index**

Type: [Integer](../Concepts.md#numbers)

The array index, typically the same as [A_Index](../Variables.md#Index). This is present only in the two-parameter mode.

**Value**

Type: [Any](../Concepts.md#values)

The value (if there is no value, *Value* becomes [uninitialized](../Concepts.md#uninitialized-variables)).

<a id="Properties"></a>
## Properties

<a id="Length"></a>

### Length

Gets or sets the number of items in an array.

```ahk
Length := ArrayObj.Length
```

```ahk
ArrayObj.Length := Length
```

The length includes elements which have no value. Increasing the length changes which indices are considered valid, but the new elements have no value (as indicated by [Has](#Has)). Decreasing the length truncates the array.

```ahk
MsgBox ["A", "B", "C"].Length  ;  3
MsgBox ["A",    , "C"].Length  ;  3
```

<a id="Capacity"></a>

### Capacity

Gets or sets the current capacity of an array.

```ahk
MaxItems := ArrayObj.Capacity
```

```ahk
ArrayObj.Capacity := MaxItems
```

*MaxItems* is an [integer](../Concepts.md#numbers) representing the maximum number of elements the array should be able to contain before it must be automatically expanded. If setting a value less than [Length](#Length), elements are removed.

<a id="Default"></a>

### Default

Sets the default value returned when an element with no value is requested.

```ahk
ArrayObj.Default := Value
```

This property actually doesn't exist by default, but can be defined by the script. If defined, its value is returned by [\__Item](#__Item) or [Get](#Get) if the requested element has no value, instead of throwing an [UnsetItemError](Error.md#UnsetError). It can be implemented by any of the normal means, including a [dynamic property](Object.md#DefineProp) or [meta-function](../Objects.md#Meta_Functions), but determining which key was queried would require overriding [\__Item](#__Item) or [Get](#Get) instead.

Setting a default value does not prevent an error from being thrown when the index is out of range.

<a id="__Item"></a>

### \__Item

Gets or sets the value of an array element.

```ahk
Value := ArrayObj[Index]
Value := ArrayObj.__Item[Index]
```

```ahk
ArrayObj[Index] := Value
ArrayObj.__Item[Index] := Value
```

*Index* is an [integer](../Concepts.md#numbers) representing a valid array index; that is, an integer with absolute value between 1 and [Length](#Length) (inclusive). A negative index can be used to address elements in reverse, so that -1 is the last element, -2 is the second last element, and so on. Attempting to use an index which is out of bounds (such as zero, or if its absolute value is greater than the [Length](#Length) of the array) is considered an error and will cause an [IndexError](Error.md#IndexError) to be thrown.

The property name \__Item is typically omitted, as shown above, but is used when overriding the property.
