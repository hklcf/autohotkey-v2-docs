# File Object

```ahk
class File extends Object
```

Provides an interface for file input/output, such as reading or writing text or retrieving its length. [FileOpen](FileOpen.md) returns an object of this type.

"FileObj" is used below as a placeholder for any File object, as "File" is the class itself.

In addition to the methods and properties inherited from [Object](Object.md), File objects have the following predefined methods and properties.

<a id="toc"></a>
## Table of Contents

- [Methods](#Methods):
    - [Read](#Read): Reads a string of characters from the file and advances the file pointer.
    - [Write](#Write): Writes a string of characters to the file and advances the file pointer.
    - [ReadLine](#ReadLine): Reads a line of text from the file and advances the file pointer.
    - [WriteLine](#WriteLine): Writes a line of text to the file and advances the file pointer.
    - [Read*NumType*](#ReadNum): Reads a number from the file and advances the file pointer.
    - [Write*NumType*](#WriteNum): Writes a number to the file and advances the file pointer.
    - [RawRead](#RawRead): Reads raw binary data from the file into memory and advances the file pointer.
    - [RawWrite](#RawWrite): Writes raw binary data to the file and advances the file pointer.
    - [Seek](#Seek): Moves the file pointer.
    - [Close](#Close): Closes the file, flushes any data in the cache to disk and releases the share locks.
- [Properties](#Properties):
    - [Pos](#Pos): Gets or sets the position of the file pointer.
    - [Length](#Length): Gets or sets the size of the file.
    - [AtEOF](#AtEOF): Gets a non-zero number if the file pointer has reached the end of the file.
    - [Encoding](#Encoding): Gets or sets the text encoding used by this file object.
    - [Handle](#Handle): Gets a system file handle, intended for use with DllCall.

<a id="Methods"></a>
## Methods

<a id="Read"></a>

### Read

Reads a string of characters from the file and advances the file pointer.

```ahk
String := FileObj.Read(Characters)
```

<a id="Read_Parameters"></a>
#### Parameters

**Characters**

Type: [Integer](../Concepts.md#numbers)

If omitted, the rest of the file is read and returned as one string. Otherwise, specify the maximum number of characters to read. If the File object was created from a handle to a non-seeking device such as a console buffer or pipe, omitting this parameter may cause the method to fail or return only what data is currently available.

<a id="Read_Return_Value"></a>
#### Return Value

Type: [String](../Concepts.md#strings)

This method returns the string of characters that were read.

<a id="Write"></a>

### Write

Writes a string of characters to the file and advances the file pointer.

```ahk
BytesWritten := FileObj.Write(String)
```

<a id="Write_Parameters"></a>
#### Parameters

**String**

Type: [String](../Concepts.md#strings)

The string to write.

<a id="Write_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the number of bytes (not characters) that were written.

<a id="ReadLine"></a>

### ReadLine

Reads a line of text from the file and advances the file pointer.

```ahk
TextLine := FileObj.ReadLine()
```

<a id="ReadLine_Return_Value"></a>
#### Return Value

Type: [String](../Concepts.md#strings)

This method returns a line of text, excluding the line ending.

<a id="ReadLine_Remarks"></a>
#### Remarks

Lines up to 65,534 characters long can be read. If the length of a line exceeds this, the remainder of the line is returned by subsequent calls to this method.

<a id="WriteLine"></a>

### WriteLine

Writes a line of text to the file and advances the file pointer.

```ahk
BytesWritten := FileObj.WriteLine(String)
```

<a id="WriteLine_Parameters"></a>
#### Parameters

**String**

Type: [String](../Concepts.md#strings)

If blank or omitted, an empty line will be written. Otherwise, specify the string to write, which is always followed by `` `n `` or `` `r`n ``, depending on the EOL flags used to open the file.

<a id="WriteLine_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the number of bytes (not characters) that were written.

<a id="ReadNum"></a>

### Read*NumType*

Reads a number from the file and advances the file pointer.

```ahk
Num := FileObj.ReadNumType()
```

*NumType* is either UInt, Int, Int64, Short, UShort, Char, UChar, Double, or Float. These type names have the same meanings as with [DllCall](DllCall.md#types).

<a id="ReadNum_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers), [Float](../Concepts.md#numbers) or [String (empty)](../Concepts.md#nothing)

On success, this method returns a number. On failure, it returns an empty string.

<a id="ReadNum_Remarks"></a>
#### Remarks

If the number of bytes read is non-zero but less than the size of *NumType*, the missing bytes are assumed to be zero.

<a id="WriteNum"></a>

### Write*NumType*

Writes a number to the file and advances the file pointer.

```ahk
BytesWritten := FileObj.WriteNumType(Num)
```

*NumType* is either UInt, Int, Int64, Short, UShort, Char, UChar, Double, or Float. These type names have the same meanings as with [DllCall](DllCall.md#types).

<a id="WriteNum_Parameters"></a>
#### Parameters

**Num**

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

The number to write.

<a id="WriteNum_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the number of bytes that were written. For example, `FileObj.WriteUInt(42)` returns 4 if successful.

<a id="RawRead"></a>

### RawRead

Reads raw binary data from the file into memory and advances the file pointer.

```ahk
BytesRead := FileObj.RawRead(Buffer , Bytes)
```

<a id="RawRead_Parameters"></a>
#### Parameters

**Buffer**

Type: [Object](../Concepts.md#objects) or [Integer](../Concepts.md#numbers)

The [Buffer](Buffer.md)-like object or memory address which will receive the data.

Reading into a [Buffer](Buffer.md) is recommended. If *Bytes* is omitted, it defaults to the size of the buffer. An exception is thrown if *Bytes* exceeds the size of the buffer.

If a memory address is passed, *Bytes* must also be specified.

**Bytes**

Type: [Integer](../Concepts.md#numbers)

The maximum number of bytes to read. This is optional when *Buffer* is an object; otherwise, it is required.

<a id="RawRead_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the number of bytes that were read.

<a id="RawWrite"></a>

### RawWrite

Writes raw binary data to the file and advances the file pointer.

```ahk
BytesWritten := FileObj.RawWrite(Data , Bytes)
```

<a id="RawWrite_Parameters"></a>
#### Parameters

**Data**

Type: [Object](../Concepts.md#objects), [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

A [Buffer](Buffer.md)-like object or string containing binary data, or a memory address. If an object or string is specified, *Bytes* is optional and defaults to the size of the buffer or string. Otherwise, *Bytes* must also be specified.

**Bytes**

Type: [Integer](../Concepts.md#numbers)

The number of bytes to write. This is optional when *Data* is an object or string; otherwise, it is required.

<a id="RawWrite_Return_Value"></a>
#### Return Value

Type: [Integer](../Concepts.md#numbers)

This method returns the number of bytes that were written.

<a id="Seek"></a>

### Seek

Moves the file pointer.

```ahk
IsMoved := FileObj.Seek(Distance , Origin)
```

<a id="Seek_Parameters"></a>
#### Parameters

**Distance**

Type: [Integer](../Concepts.md#numbers)

Distance to move, in bytes. Lower values are closer to the beginning of the file.

**Origin**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 2 when *Distance* is negative and 0 otherwise. Otherwise, specify one of the following numbers to indicate the starting point for the file pointer move:

- 0 (SEEK_SET): Beginning of the file. *Distance* must be zero or greater.
- 1 (SEEK_CUR): Current position of the file pointer.
- 2 (SEEK_END): End of the file. *Distance* should usually be negative.

<a id="Seek_Return_Value"></a>
#### Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

On success, this method returns 1 (true). On failure, it returns 0 (false).

<a id="Seek_Remarks"></a>
#### Remarks

This method is equivalent to `FileObj.Pos := Distance`, if *Distance* is not negative and *Origin* is omitted or 0 (SEEK_SET).

<a id="Close"></a>

### Close

Closes the file, flushes any data in the cache to disk and releases the share locks.

```ahk
FileObj.Close()
```

Although the file is closed automatically when the object is freed, it is recommended to close the file as soon as possible.

<a id="Properties"></a>
## Properties

<a id="Pos"></a>

### Pos

Gets or sets the position of the file pointer.

```ahk
CurrentPos := FileObj.Pos
```

```ahk
FileObj.Pos := NewPos
```

*CurrentPos* and *NewPos* are a byte offset from the beginning of the file, where 0 is the first byte. When data is written to or read from the file, the file pointer automatically moves to the next byte after that data.

This property is equivalent to `FileObj.Seek(NewPos)`.

<a id="Length"></a>

### Length

Gets or sets the size of the file.

```ahk
CurrentSize := FileObj.Length
```

```ahk
FileObj.Length := NewSize
```

*CurrentSize* and *NewSize* are the size of the file, in bytes.

This property should be used only with an actual file. If the File object was created from a handle to a pipe, it may return the amount of data currently available in the pipe's internal buffer, but this behavior is not guaranteed.

<a id="AtEOF"></a>

### AtEOF

Gets a non-zero number if the file pointer has reached the end of the file, otherwise zero.

```ahk
IsAtEOF := FileObj.AtEOF
```

This property should be used only with an actual file. If the File object was created from a handle to a non-seeking device such as a console buffer or pipe, the returned value may not be meaningful, as such devices do not logically have an "end of file".

<a id="Encoding"></a>

### Encoding

Gets or sets the text encoding used by this file object.

```ahk
CurrentEncoding := FileObj.Encoding
```

```ahk
FileObj.Encoding := NewEncoding
```

*NewEncoding* may be a numeric code page identifier (see [Microsoft Docs](https://learn.microsoft.com/windows/win32/intl/code-page-identifiers)) or one of the following strings.

*CurrentEncoding* is one of the following strings:

- `UTF-8`: Unicode UTF-8, equivalent to CP65001.
- `UTF-16`: Unicode UTF-16 with little endian byte order, equivalent to CP1200.
- `CPnnn`: a code page with numeric identifier *nnn*.

*CurrentEncoding* is never a value with the `-RAW` suffix, regardless of how the file was opened or whether it contains a byte order mark (BOM). Setting *NewEncoding* never causes a BOM to be added or removed, as the BOM is normally written to the file when it is first created.

Setting *NewEncoding* to `UTF-8-RAW` or `UTF-16-RAW` is valid, but the `-RAW` suffix is ignored. This only applies to `FileObj.Encoding`, not [FileOpen](FileOpen.md).

<a id="Handle"></a>

### Handle

Gets a system file handle, intended for use with [DllCall](DllCall.md). See [CreateFile](https://learn.microsoft.com/windows/win32/api/fileapi/nf-fileapi-createfilea).

```ahk
Handle := FileObj.Handle
```

File objects internally buffer reads or writes. If data has been written into the object's internal buffer, it is committed to disk before the handle is returned. If the buffer contains data read from file, it is discarded and the actual file pointer is reset to the logical position indicated by the [Pos](#Pos) property.
