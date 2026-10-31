# Buffer Object

```ahk
class Buffer extends Object
```

Encapsulates a block of memory for use with advanced techniques such as DllCall, structures, StrPut and raw file I/O.

Buffer objects are typically created by calling [Buffer()](#Call), but can also be returned by [FileRead](FileRead.md) with the "RAW" option.

```ahk
BufferObj := Buffer(ByteCount)
```

[ClipboardAll](ClipboardAll.md) returns a sub-type of Buffer, also named ClipboardAll.

```ahk
class ClipboardAll extends Buffer
```

"BufferObj" is used below as a placeholder for any Buffer object, as "Buffer" is the class itself.

In addition to the methods and properties inherited from [Object](Object.md), Buffer objects have the following predefined properties.

<a id="toc"></a>
## Table of Contents

- [Buffer-like Objects](#like)
- [Static Methods](#StaticMethods):
    - [Call](#Call): Creates a new Buffer object.
- [Methods](#Methods):
    - [\__New](#__New): Allocates or reallocates the buffer and optionally fills it.
- [Properties](#Properties):
    - [Ptr](#Ptr): Gets the buffer's current memory address.
    - [Size](#Size): Gets or sets the buffer's size, in bytes.
- [Related](#Related)
- [Examples](#Examples)

<a id="like"></a>
## Buffer-like Objects

Some built-in functions accept a Buffer object in place of an address - see the [Related](#Related) section for links. These functions also accept any other object which has [Ptr](#Ptr) and [Size](#Size) properties, but are optimized for the native Buffer object.

In most cases, passing a Buffer object is safer than passing an address, as the function can read the [buffer size](#Size) to ensure that it does not attempt to access any memory location outside of the buffer. One exception is that [DllCall](DllCall.md) calls functions outside of the program; in those cases, it may be necessary to explicitly pass the [buffer size](#Size) to the function.

<a id="StaticMethods"></a>
## Static Methods

<a id="Call"></a>

### Call

Creates a new Buffer object.

```ahk
BufferObj := Buffer(ByteCount, FillByte)
BufferObj := Buffer.Call(ByteCount, FillByte)
```

<a id="Call_Parameters"></a>
#### Parameters

**ByteCount**

Type: [Integer](../Concepts.md#numbers)

The number of bytes to allocate. Corresponds to [Buffer.Size](#Size).

If omitted, the Buffer is created with a null (zero) [Ptr](#Ptr) and zero [Size](#Size).

**FillByte**

Type: [Integer](../Concepts.md#numbers)

Specify a number between 0 and 255 to set each byte in the buffer to that number.

This should generally be omitted in cases where the buffer will be written into without first being read, as it has a time-cost proportionate to the number of bytes. If omitted, the memory of the buffer is not initialized; the value of each byte is arbitrary.

<a id="Call_Return_Value"></a>
#### Return Value

Type: [Object](../Concepts.md#objects)

This method or function returns a Buffer object.

<a id="Call_Remarks"></a>
#### Remarks

A [MemoryError](Error.md#MemoryError) is thrown if the memory could not be allocated, such as if *ByteCount* is unexpectedly large or the system is low on virtual memory.

Parameters are defined by [\__New](#__New).

<a id="Methods"></a>
## Methods

<a id="__New"></a>

### \__New

Allocates or reallocates the buffer and optionally fills it.

```ahk
BufferObj.__New(ByteCount, FillByte)
```

This method exists to support [Call](#Call), and is not usually called directly. See [Construction and Destruction](../Objects.md#Custom_NewDelete).

Specify *ByteCount* to allocate, reallocate or free the buffer. This is equivalent to assigning [Size](#Size).

Specify *FillByte* to fill the buffer with the given numeric byte value, overwriting any existing content.

If both parameters are omitted, this method has no effect.

<a id="Properties"></a>
## Properties

<a id="Ptr"></a>

### Ptr

Gets the buffer's current memory address.

```ahk
CurrentPtr := BufferObj.Ptr
```

*CurrentPtr* is an [integer](../Concepts.md#numbers) representing the buffer's current memory address. This address becomes invalid when the buffer is freed or reallocated. Invalid addresses must not be used. The buffer is not freed until the Buffer object's [reference count](../Objects.md#Reference_Counting) reaches zero, but it is reallocated when its [Size](#Size) is changed.

<a id="Size"></a>

### Size

Gets or sets the buffer's size, in bytes.

```ahk
CurrentByteCount := BufferObj.Size
```

```ahk
BufferObj.Size := NewByteCount
```

*CurrentByteCount* and *NewByteCount* are an [integer](../Concepts.md#numbers) representing the buffer's size, in bytes. The buffer's address typically changes whenever its size is changed. If the size is decreased, the data within the buffer is truncated, but the remaining bytes are preserved. If the size is increased, all data is preserved and the values of any new bytes are arbitrary (they are not initialized, for performance reasons).

A [MemoryError](Error.md#MemoryError) is thrown if the memory could not be allocated, such as if *NewByteCount* is unexpectedly large or the system is low on virtual memory.

*CurrentByteCount* is always the exact value it was given either by [\__New](#__New) or by a previous assignment.

<a id="Related"></a>
## Related

[DllCall](DllCall.md), [NumPut](NumPut.md), [NumGet](NumGet.md), [StrPut](StrPut.md), [StrGet](StrGet.md), [File.RawRead](File.md#RawRead), [File.RawWrite](File.md#RawWrite), [ClipboardAll](ClipboardAll.md)

<a id="Examples"></a>
## Examples

<a id="ExString"></a>

**Example:** Uses a Buffer to receive a string from an external function via [DllCall](DllCall.md).

```ahk
max_chars := 11

; Allocate a buffer for use with the Unicode version of wsprintf.
bufW := Buffer(max_chars*2)

; Print a UTF-16 string into the buffer with wsprintfW().
DllCall("wsprintfW", "Ptr", bufW, "Str", "0x%08x", "UInt", 4919, "CDecl")

; Retrieve the string from bufW and show it.
MsgBox StrGet(bufW, "UTF-16")  ; Or just StrGet(bufW).

; Allocate a buffer for use with the ANSI version of wsprintf.
bufA := Buffer(max_chars)

; Print an ANSI string into the buffer with wsprintfA().
DllCall("wsprintfA", "Ptr", bufA, "AStr", "0x%08x", "UInt", 4919, "CDecl")

; Retrieve the string from bufA (converted to the native format), and show it.
MsgBox StrGet(bufA, "CP0")
```
