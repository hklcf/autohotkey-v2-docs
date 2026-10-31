# Binary Compatibility

This document contains some topics which are sometimes important when dealing with external libraries or sending messages to a control or window.

- [Unicode vs ANSI](#Format)
    - [Buffer](#Buffer)
    - [DllCall](#DllCall)
    - [NumPut / NumGet](#NumPutGet)
- [Pointer Size](#ptr)

<a id="Format"></a>
## Unicode vs ANSI

> **Note:** This section builds on topics covered in other parts of the documentation: [Strings](Concepts.md#strings), [String Encoding](Concepts.md#string-encoding).

Within a string (text value), the numeric character code and size (in bytes) of each character depends on the [encoding](Concepts.md#string-encoding) of the string. These details are typically important for scripts which do any of the following:

- Pass strings to external functions via [DllCall](#DllCall).
- Pass strings via [PostMessage](lib/PostMessage.md) or [SendMessage](lib/SendMessage.md).
- Manipulate strings directly via [NumPut/NumGet](#NumPutGet).
- Allocate a [Buffer](#Buffer) to hold a specific number of characters.

AutoHotkey v2 natively uses Unicode (UTF-16), but some external libraries or window messages might require ANSI strings.

**ANSI:** Each character is **one byte** (8 bits). Character codes above 127 depend on your system's language settings (or the codepage chosen when the text was encoded, such as when it is written to a file).

**Unicode:** Each character is **two bytes** (16 bits). Character codes are as defined by the [UTF-16](https://en.wikipedia.org/wiki/UTF-16) format.

*Semantic note:* Technically, some Unicode characters are represented by *two* 16-bit code units, collectively known as a "surrogate pair." Similarly, some [ANSI code pages](https://learn.microsoft.com/windows/win32/intl/code-pages) (commonly known as [Double Byte Character Sets](https://learn.microsoft.com/windows/win32/intl/double-byte-character-sets)) contain some double-byte characters. However, for practical reasons these are almost always treated as two individual units (referred to as "characters" for simplicity).

<a id="Buffer"></a>
### Buffer

When allocating a [Buffer](lib/Buffer.md), take care to calculate the correct number of *bytes* for whichever encoding is required. For example:

```ahk
ansi_buf  := Buffer(capacity_in_chars)
utf16_buf := Buffer(capacity_in_chars * 2)
```

If an ANSI or UTF-8 string will be written into the buffer with [StrPut](lib/StrPut.md), do not use [StrLen](lib/StrLen.md) to determine the buffer size, as the ANSI or UTF-8 length may differ from the native (UTF-16) length. Instead, use [StrPut](lib/StrPut.md#ExEncoding) to calculate the required buffer size. For example:

```ahk
required_bytes := StrPut(source_string, "cp0")
ansi_buf := Buffer(required_bytes)
StrPut(source_string, ansi_buf)
```

<a id="DllCall"></a>
### DllCall

When the "Str" type is used, it means a string in the native format of the current build. Since some functions may require or return strings in a particular format, the following string types are available:

|  | Char Size | C / Win32 Types | Encoding |
| --- | :---: | --- | --- |
| WStr | 16-bit | wchar_t\*, WCHAR\*, LPWSTR, LPCWSTR | UTF-16 |
| AStr | 8-bit | char\*, CHAR\*, LPSTR, LPCSTR | ANSI (the system default ANSI code page) |
| Str | -- | TCHAR\*, LPTSTR, LPCTSTR | Equivalent to **WStr** in AutoHotkey v2. |

If "Str" or "WStr" is used for a parameter, the address of the string is passed to the function. For "AStr", a temporary ANSI copy of the string is created and its address is passed instead. As a general rule, "AStr" should not be used for an output parameter since the buffer is only large enough to hold the input string.

> **Note:** "AStr" and "WStr" are equally valid for parameters and the function's return value.

In general, if a script calls a function via DllCall which accepts a string as a parameter, one or more of the following approaches must be taken:

1. If both Unicode (W) and ANSI (A) versions of the function are available, omit the W or A suffix and use the "Str" type for input parameters or the return value. For example, the DeleteFile function is exported from kernel32.dll as `DeleteFileA` and `DeleteFileW`. Since `DeleteFile` itself doesn't really exist, DllCall automatically tries `DeleteFileW`:
    ```ahk
    DllCall("DeleteFile", "Ptr", StrPtr(filename))
    DllCall("DeleteFile", "Str", filename)
    ```

    In both cases, the address of the original unmodified string is passed to the function.

    In some cases this approach may backfire, as DllCall adds the W suffix only if no function could be found with the original name. For example, shell32.dll exports ExtractIconExW, ExtractIconExA and ExtractIconEx with no suffix, with the last two being equivalent. In that case, omitting the W suffix causes the ANSI version to be called.
2. If the function accepts a specific type of string as input, the script may use the appropriate string type:
    ```ahk
    DllCall("DeleteFileA", "AStr", filename)
    DllCall("DeleteFileW", "WStr", filename)
    ```
3. If the function has a string parameter used for output, the script must allocate a buffer as described [above](#Buffer) and pass it to the function. If the parameter accepts input, the script must also convert the input string to the appropriate format; [StrPut](lib/StrPut.md) can be used for this.

<a id="NumPutGet"></a>
### NumPut / NumGet

When NumPut or NumGet are used with strings, the offset and type must be correct for the given type of string. The following may be used as a guide:

```ahk
;  8-bit/ANSI   strings:  size_of_char=1  type_of_char="UChar"
; 16-bit/UTF-16 strings:  size_of_char=2  type_of_char="UShort"
nth_char := NumGet(buffer_or_address, (n-1)*size_of_char, type_of_char)
NumPut(type_of_char, nth_char, buffer_or_address, (n-1)*size_of_char)
```

For the first character, *n* should have the value 1.

<a id="ptr"></a>
## Pointer Size

Pointers are 4 bytes in 32-bit builds and 8 bytes in 64-bit builds. Scripts using structures or DllCalls may need to account for this to run correctly on both platforms. Specific areas which are affected include:

- Offset calculation for fields in structures which contain one or more pointers.
- Size calculation for structures containing one or more pointers.
- Type names used with [DllCall](lib/DllCall.md), [NumPut](lib/NumPut.md) or [NumGet](lib/NumGet.md).

For size and offset calculations, use [A_PtrSize](Variables.md#PtrSize). For DllCall, NumPut and NumGet, use the [Ptr](lib/DllCall.md) type where appropriate.

Remember that the offset of a field is usually the total size of all fields preceding it. Also note that handles (including types like HWND and HBITMAP) are essentially pointer-types.

```ahk
/*
  typedef struct _PROCESS_INFORMATION {
    HANDLE hProcess;    // Ptr
    HANDLE hThread;
    DWORD  dwProcessId; // UInt (4 bytes)
    DWORD  dwThreadId;
  } PROCESS_INFORMATION, *LPPROCESS_INFORMATION;
*/
pi := Buffer(A_PtrSize*2 + 8) ; Ptr + Ptr + UInt + UInt
DllCall("CreateProcess", <omitted for brevity>, "Ptr", &pi, <omitted>)
hProcess    := NumGet(pi, 0)         ; Defaults to "Ptr".
hThread     := NumGet(pi, A_PtrSize) ;
dwProcessId := NumGet(pi, A_PtrSize*2,     "UInt")
dwProcessId := NumGet(pi, A_PtrSize*2 + 4, "UInt")
```
