# StrPut

Copies a string to a memory address or buffer, optionally converting it to a given code page.

```ahk
BytesWritten := StrPut(String, Target , Length, Encoding)
BytesWritten := StrPut(String, Target , Encoding)
ReqBufSize   := StrPut(String , Encoding)
```

<a id="Parameters"></a>
## Parameters

**String**

Type: [String](../Concepts.md#strings)

Any string. If a number is given, it is automatically converted to a string.

*String* is assumed to be in the [native encoding](../Concepts.md#string-encoding).

**Target**

Type: [Object](../Concepts.md#objects) or [Integer](../Concepts.md#numbers)

A [Buffer](Buffer.md)-like object or memory address to which the string will be written.

Any object which implements [Ptr](Buffer.md#Ptr) and [Size](Buffer.md#Size) properties may be used, but this function is optimized for the native [Buffer](Buffer.md) object. Passing an object with these properties ensures that the function does not write memory to an invalid location; doing so could cause crashes or other unpredictable behavior.

> **Note:** If conversion between code pages is necessary, the required buffer size may differ from the size of the source string. For such cases, call StrPut with two parameters to calculate the required size.

**Length**

Type: [Integer](../Concepts.md#numbers)

The maximum number of [characters](../Concepts.md#character) to write, including the [null-terminator](../Concepts.md#null-termination) if required.

If *Length* is zero or less than the projected length after conversion (or the length of the source string if conversion is not required), an exception is thrown.

*Length* must not be omitted when *Target* is a plain memory address, unless the buffer size is known to be sufficient, such as if the buffer was allocated based on a previous call to StrPut with the same *String* and *Encoding*.

If *Target* is an object, specifying a *Length* that exceeds the buffer size calculated from `Target.Size` is considered an error, even if the converted string would fit within the buffer.

> **Note:** When *Encoding* is specified, *Length* should be the size of the buffer (in characters), <u>not</u> the length of *String* or a substring, as conversion may increase its length.

> **Note:** *Length* is measured in characters, whereas buffer sizes are usually measured in bytes, as is StrPut's return value. To specify the buffer size in bytes, use a [Buffer](Buffer.md)-like object in the *Target* parameter.

**Encoding**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If omitted, the string is simply copied or measured without any conversion taking place. Otherwise, specify the target encoding; for example, `"UTF-8"`, `"UTF-16"` or `"CP936"`. For numeric identifiers, the prefix "CP" can be omitted only in 4-parameter mode. Specify an empty string or `"CP0"` to use the system default ANSI code page.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

In 4- or 3-parameter mode, this function returns the number of bytes written. A null-terminator is written and included in the return value only when there is sufficient space; that is, it is omitted when *Length* or `Target.Size` (multiplied by the size of a character) exactly equals the length of the converted string.

In 2-parameter mode, this function returns the required buffer size in bytes, including space for the null-terminator.

<a id="Error_Handling"></a>
## Error Handling

A [ValueError](Error.md#ValueError) is thrown if invalid parameters are detected, such as if the converted string would be longer than allowed by *Length* or `Target.Size`.

An [OSError](Error.md#OSError) is thrown if the conversion could not be performed.

<a id="Remarks"></a>
## Remarks

Note that the *String* parameter is always assumed to use the [native encoding](../Concepts.md#string-encoding) of the current executable, whereas *Encoding* specifies the encoding of the string written to the given *Target*. If no *Encoding* is specified, the string is simply copied or measured without any conversion taking place.

<a id="Related"></a>
## Related

[String Encoding](../Concepts.md#string-encoding), [StrGet](StrGet.md), [Binary Compatibility](../Compat.md), [FileEncoding](FileEncoding.md), [DllCall](DllCall.md), [Buffer object](Buffer.md), [VarSetStrCapacity](VarSetStrCapacity.md)

<a id="Examples"></a>
## Examples

<a id="ExNumEnc"></a>

**Example:** Either *Length* or *Encoding* may be specified directly after *Target*, but in those cases *Encoding* must be non-numeric.

```ahk
StrPut(str, address, "cp0")  ; Code page 0, unspecified buffer size
StrPut(str, address, n, 0)   ; Maximum n chars, code page 0
StrPut(str, address, 0)      ; Unsupported (maximum 0 chars)
```

<a id="ExEncoding"></a>

**Example:** StrPut may be called once to calculate the required buffer size for a string in a particular encoding, then again to encode and write the string into the buffer. The process can be simplified by utilizing this function.

```ahk
; Returns a Buffer object containing the string.
StrBuf(str, encoding)
{
    ; Calculate required size and allocate a buffer.
    buf := Buffer(StrPut(str, encoding))
    ; Copy or convert the string.
    StrPut(str, buf, encoding)
    return buf
}
```
