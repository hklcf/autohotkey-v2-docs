# DllCall

Calls a function inside a DLL, such as a standard Windows API function.

```ahk
Result := DllCall("DllFile\Function" , Type1, Arg1, Type2, Arg2, "CDecl ReturnType")
```

<a id="Parameters"></a>
## Parameters

**[DllFile\\]Function**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

The DLL or EXE file name followed by a backslash and the name of the function. For example: `"MyDLL\MyFunction"` (the file extension ".dll" is the default when omitted). If an absolute path isn't specified, *DllFile* is assumed to be in the system's PATH or [A_WorkingDir](../Variables.md#WorkingDir). Note that DllCall expects a path with backslashes (\\). Forward slashes (/) are not supported.

<a id="std"></a>

*DllFile* may be omitted when calling a function that resides in User32.dll, Kernel32.dll, ComCtl32.dll, or Gdi32.dll. For example, `"User32\IsWindowVisible"` produces the same result as `"IsWindowVisible"`.

If no function can be found by the given name, a "W" (Unicode) suffix is automatically appended. For example, `"MessageBox"` is the same as `"MessageBoxW"`.

Performance can be dramatically improved when making *repeated* calls to a DLL by [loading it beforehand](#load).

This parameter may also consist solely of an integer, which is interpreted as the address of the function to call. Sources of such addresses include [COM](#COM) and [CallbackCreate](CallbackCreate.md).

If this parameter is an object, the value of the object's Ptr property is used. If no such property exists, a [PropertyError](Error.md#PropertyError) is thrown.

**Type1, Arg1**

Type: [String](../Concepts.md#strings)

Each of these pairs represents a single parameter to be passed to the function. The number of pairs is unlimited. For *Type*, see the [types table](#types) below. For *Arg*, specify the value to be passed to the function.

**CDecl ReturnType**

Type: [String](../Concepts.md#strings)

<a id="CDecl"></a>

<a id="cdecl"></a>The word *CDecl* is normally omitted because most functions use the standard calling convention rather than the "C" calling convention (functions such as wsprintf that accept a varying number of arguments are one exception to this). Note that most object-oriented C++ functions use the *thiscall* convention, which is not supported.

If present, the word *CDecl* should be listed before the return type (if any). Separate each word from the next with a space or tab. For example: `"CDecl Str"`.

Since a separate "C" calling convention does not exist in 64-bit code, *CDecl* may be specified but has no effect on 64-bit builds of AutoHotkey.

*ReturnType*: If the function returns a 32-bit signed integer (Int), BOOL, or nothing at all, *ReturnType* may be omitted. Otherwise, specify one of the argument types from the [types table](#types) below. The [asterisk/P suffix](#asterisk) is also supported.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

DllCall returns the actual value returned by *Function*. If *Function* is of a type that does not return a value, the result is an undefined value of the specified return type (integer by default).

<a id="types"></a>
## Types of Arguments and Return Values

| Type | Description |
| --- | --- |
| <a id="Str"></a><a id="str"></a>Str | A string such as `"Blue"` or `MyVar`, or a [VarRef](../Concepts.md#variable-references) such as `&MyVar`. If the called function modifies the string and the argument is a naked variable or VarRef, its contents will be updated. For example, the following call would convert the contents of *MyVar* to uppercase: `DllCall("CharUpper", "Str", MyVar)`.<br> If the function is designed to store a string longer than the parameter's input value (or if the parameter is for output only), the recommended approach is to create a [Buffer](Buffer.md), use the [Ptr](#Ptr) type to pass it, and use [StrGet](StrGet.md) to retrieve the string after the function returns, as in the [wsprintf example](#ExWsprintf).<br> Otherwise, ensure that the variable is large enough before calling the function. This can be achieved by calling `VarSetStrCapacity(&MyVar, 123)`, where 123 is the number of 16-bit units (loosely referred to as characters) that *MyVar* must be able to hold. If the variable is not null-terminated upon return, an error message is shown and the program exits as it is likely that memory has been corrupted via buffer overrun. This would typically indicate that the variable's capacity was insufficient.<br> A Str argument must not be an [expression](../Variables.md#Expressions) that evaluates to a number (such as `i+1`). If it is, the function is not called and a [TypeError](Error.md#TypeError) is thrown.<br> <a id="strp"></a>The rarely-used [Str\*](#asterisk) arg type passes the address of a temporary variable containing the address of the string. If the function writes a new address into the temporary variable, the new string is copied into the script's variable, if a [VarRef](../Concepts.md#variable-references) was passed. This can be used with functions that expect something like `TCHAR **` or `LPTSTR *`. However, if the function allocates memory and expects the caller to free it (such as by calling [CoTaskMemFree](https://learn.microsoft.com/windows/win32/api/combaseapi/nf-combaseapi-cotaskmemfree)), the [Ptr\*](#asterisk) arg type must be used instead.<br> **Note:** When passing a string to a function, be aware what [*type* of string](../Compat.md#DllCall) the function expects. |
| <a id="WStr"></a><a id="wstr"></a>WStr | Since AutoHotkey uses UTF-16 natively, WStr (wide character string) is equivalent to [Str](#Str). |
| <a id="AStr"></a><a id="astr"></a>AStr | AStr causes the input value to be automatically converted to ANSI. Since the temporary memory used for this conversion is only large enough for the converted input string, any value written to it by the function is discarded. To receive an ANSI string as an output parameter, follow this example:<br> <code>buf := Buffer(length) ; Allocate temporary buffer.<br>DllCall("Function", "ptr", buf) ; Pass buffer to function.<br>str := StrGet(buf, "cp0") ; Retrieve ANSI string from buffer.<br></code> The rarely-used [AStr\*](#asterisk) arg type is also supported and behaves similarly to the [Str\*](#strp) type, except that any new string is converted from ANSI to the native format, UTF-16.<br> See [Binary Compatibility](../Compat.md#DllCall) for equivalent Win32 types and other details. |
| <a id="Int64"></a>Int64 | A 64-bit integer, whose range is -9223372036854775808 (-0x8000000000000000) to 9223372036854775807 (0x7FFFFFFFFFFFFFFF). |
| <a id="Int"></a>Int | A 32-bit integer (the most common integer type), whose range is -2147483648 (-0x80000000) to 2147483647 (0x7FFFFFFF). An Int is sometimes called a "Long". An Int should also be used for each BOOL argument expected by a function (a BOOL value should be either 1 or 0). An [unsigned](#unsigned) Int (UInt) is also used quite frequently, such as for DWORD. |
| <a id="Short"></a>Short | A 16-bit integer, whose range is -32768 (-0x8000) to 32767 (0x7FFF). An [unsigned](#unsigned) Short (UShort) can be used with functions that expect a WORD. |
| <a id="Char"></a>Char | An 8-bit integer, whose range is -128 (-0x80) to 127 (0x7F). An [unsigned](#unsigned) character (UChar) can be used with functions that expect a BYTE. |
| <a id="Float"></a>Float | A 32-bit floating point number, which provides 6 digits of precision. |
| <a id="Double"></a>Double | A 64-bit floating point number, which provides 15 digits of precision. |
| <a id="Ptr"></a><a id="ptr"></a>Ptr | A [pointer-sized](../Variables.md#PtrSize) integer, equivalent to [Int](#Int) or [Int64](#Int64) depending on whether the exe running the script is 32-bit or 64-bit. Ptr should be used for pointers to arrays or structures (such as RECT\* or LPPOINT) and almost all handles (such as HWND, HBRUSH or HBITMAP). If the parameter is a pointer to a single numeric value such as LPDWORD or Int\*, generally the \* or P suffix should be used instead of Ptr.<br> Ptr can also be used with the \* or P suffix; it should be used with functions that output a pointer via LPVOID\* or similar.<br> If an object is passed to a Ptr argument, the value of the object's Ptr property is used. If no such property exists, a [PropertyError](Error.md#PropertyError) is thrown. Typically the object would be a [Buffer](Buffer.md).<br> If an object is passed to a [Ptr\*](#asterisk) argument, the value of the object's Ptr property is retrieved before the call and the address of a temporary variable containing this value is passed to the function. After the function returns, the new value is assigned back to the object's Ptr property.<br> An [unsigned](#unsigned) pointer (UPtr) is also valid, with the following limitations: 1) It is only unsigned in 32-bit builds as AutoHotkey does not support unsigned 64-bit integers, and 2) objects are not permitted.<br> **Note:** To pass a **NULL** handle or pointer, pass the integer 0. |
| <a id="asterisk"></a>\* or P<br> (suffix) | Append an asterisk or the letter P (both with optional preceding space) to any of the above types to cause the address of the argument to be passed rather than the value itself (the called function must be designed to accept it). Since the value of such an argument might be modified by the function, whenever a [VarRef](../Concepts.md#variable-references) is passed as the argument, the variable's contents will be updated after the function returns. For example, the following call would pass the contents of MyVar to MyFunction by address, but would also update MyVar to reflect any changes made to it by MyFunction: `DllCall("MyDll\MyFunction", "Int*", &MyVar)`.<br> In general, an asterisk/P suffix is used whenever a function has an argument type or return type that starts with "LP". The most common example is LPDWORD, which is a pointer to a DWORD. Since a DWORD is an unsigned 32-bit integer, use [UInt\*](#asterisk) or [UIntP](#asterisk) to represent LPDWORD. An asterisk/P suffix should not be used for string types such as LPTSTR, pointers to structures such as LPRECT, or arrays; for these, [Str](#Str) or [Ptr](#Ptr) should be used, depending on whether you pass a string, address or [Buffer](Buffer.md).<br> **Note:** [Char\*](#asterisk) is not the same as [Str](#Str) because [Char\*](#asterisk) passes the address of an 8-bit number, whereas [Str](#Str) passes the address of a series of characters, which may be either 16-bit (Unicode) or 8-bit (for [AStr](#AStr)), depending on the version of AutoHotkey. Similarly, [UInt\*](#asterisk) passes the address of a 32-bit number, so should not be used if the function expects an array of values or a structure larger than 32 bits.<br> Since variables in AutoHotkey have no fixed type, the address passed to the function points to temporary memory rather than the caller's variable. |
| <a id="unsigned"></a>U (prefix) | Prepend the letter U to any of the integer types above to interpret it as an unsigned integer ([UInt64](#unsigned), [UInt](#unsigned), [UShort](#unsigned), [UChar](#unsigned), and [UPtr](#unsigned)). Strictly speaking, this is necessary only for return values and [asterisk variables](#asterisk) because it does not matter whether an argument passed by value is unsigned or signed (except for [Int64](#Int64)).<br> If a negative integer is specified for an unsigned argument, the integer wraps around into the unsigned domain. For example, when -1 is sent as a [UInt](#unsigned), it would become 0xFFFFFFFF.<br> *Unsigned* 64-bit integers produced by a function are not supported. Therefore, to work with numbers greater or equal to 0x8000000000000000, omit the U prefix and interpret any negative values received from the function as large integers. For example, a function that yields -1 as an [Int64](#Int64) is really yielding 0xFFFFFFFFFFFFFFFF if it is designed to yield a [UInt64](#unsigned). |
| <a id="HRESULT"></a>HRESULT | A 32-bit integer. This is generally used with COM functions and is valid only as a return type without any prefix or suffix. Error values (as defined by the [FAILED macro](https://learn.microsoft.com/windows/win32/api/winerror/nf-winerror-failed)) are never returned; instead, an [OSError](Error.md#OSError) is thrown. Therefore, the return value is a success code in the range 0 to 2147483647.<br> HRESULT is the default return type for [ComCall](ComCall.md). |

<a id="error"></a>
## Errors

DllCall throws an [Error](Error.md) under any of the following conditions:

- [OSError](Error.md#OSError): The [HRESULT](#HRESULT) return type was used and the function returned an error value (as defined by the [FAILED macro](https://learn.microsoft.com/windows/win32/api/winerror/nf-winerror-failed)). `Exception.Extra` contains the hexadecimal error code.
- [TypeError](Error.md#TypeError): The *[DllFile\\]Function* parameter is a floating point number. A string or positive integer is required.
- [ValueError](Error.md#ValueError): The [return type](#types) or one of the specified [arg types](#types) is invalid.
- [TypeError](Error.md#TypeError): An argument was passed a value of an unexpected type. For instance, an [expression](../Variables.md#Expressions) that evaluates to a number was passed to a string ([Str](#Str)) argument, a non-numeric string was passed to a numeric argument, or an object was passed to an argument *not* of type [Ptr](#Ptr).
- [Error](Error.md): The specified *DllFile* could not be accessed or loaded. If no explicit path was specified for *DllFile*, the file must exist in the system's PATH or [A_WorkingDir](../Variables.md#WorkingDir). This error might also occur if the user lacks permission to access the file, or if AutoHotkey is 32-bit and the DLL is 64-bit or vice versa.
- [Error](Error.md): The specified function could not be found inside the DLL.
- [Error](Error.md): The function was called but it aborted with a fatal exception. `Exception.Extra` contains the exception code. For example, 0xC0000005 means "access violation". In such cases, the thread is aborted (if [Try](Try.md) is not used), but any [asterisk variables](#asterisk) are still updated. An example of a fatal exception is dereferencing an invalid pointer such as NULL (0). Since a [CDecl](#CDecl) function never produces the error described in the next paragraph, it may generate an exception when too few arguments are passed to it.
- [Error](Error.md): The function was called but was passed too many or too few arguments. `Exception.Extra` contains the number of bytes by which the argument list was incorrect. If it is positive, too many arguments (or arguments that were too large) were passed, or the call requires [CDecl](#CDecl). If it is negative, too few arguments were passed. This situation should be corrected to ensure reliable operation of the function. The presence of this error may also indicate that an exception occurred. Note that due to the x64 calling convention, 64-bit builds never raise this error.

<a id="except"></a>
## Native Exceptions and A_LastError

In spite of the built-in exception handling, it is still possible to crash a script with DllCall. This can happen when a function does not directly generate an exception but yields something inappropriate, such as a bad pointer or a string that is not terminated. This might not be the function's fault if the script passed it an unsuitable value such as a bad pointer or a [Str](#Str) with insufficient capacity. A script can also crash when it specifies an inappropriate argument type or return type, such as claiming that an ordinary integer yielded by a function is an [asterisk variable](#asterisk) or [Str](#Str).

The built-in variable [A_LastError](../Variables.md#LastError) contains the result of the operating system's GetLastError() function.

<a id="load"></a>
## Performance

When making repeated calls to a DLL, performance can be dramatically improved by loading it explicitly (*this is not necessary for a [standard DLL](#std) such as User32 because it is always resident*). This practice avoids the need for DllCall to internally call LoadLibrary and FreeLibrary each time. For example:

```ahk
hModule := DllCall("LoadLibrary", "Str", "MyFunctions.dll", "Ptr")  ; Avoids the need for DllCall in the loop to load the library.
Loop Files, "C:\My Documents\*.*", "R"
    result := DllCall("MyFunctions\BackupFile", "Str", A_LoopFilePath)
DllCall("FreeLibrary", "Ptr", hModule)  ; To conserve memory, the DLL may be unloaded after using it.
```

Even faster performance can be achieved by looking up the function's address beforehand. For example:

```ahk
; In the following example, if the DLL isn't yet loaded, use LoadLibrary in place of GetModuleHandle.
MulDivProc := DllCall("GetProcAddress", "Ptr", DllCall("GetModuleHandle", "Str", "kernel32", "Ptr"), "AStr", "MulDiv", "Ptr")
Loop 500
    DllCall(MulDivProc, "Int", 3, "Int", 4, "Int", 3)
```

If DllCall's first parameter is a literal string such as `"MulDiv"` and the DLL containing the function is ordinarily loaded before the script starts, or has been successfully loaded with [#DllLoad](_DllLoad.md), the string is automatically resolved to a function address. This built-in optimization is more effective than the example shown above.

Finally, when passing a string-variable to a function that will not change the length of the string, performance is improved by passing the variable [by address](StrPtr.md) (e.g. `StrPtr(MyVar)`) rather than as a [Str](#Str) (especially when the string is very long). The following example converts a string to uppercase: `DllCall("CharUpper", "Ptr", StrPtr(MyVar), "Ptr")`.

<a id="struct"></a>
## Structures and Arrays

A structure is a collection of *members* (fields) stored adjacently in memory. Most members tend to be integers.

Functions that accept the address of a structure (or a memory-block array) can be called by allocating memory by some means and passing the memory address to the function. The [Buffer](Buffer.md) object is recommended for this purpose. The following steps are generally used:

1) Call `MyStruct := Buffer(123, 0)` to allocate a buffer to hold the structure's data. Replace `123` with a number that is at least as large as the size of the structure, in bytes. Specifying zero as the last parameter is optional; it initializes all members to be binary zero, which is typically used to avoid calling NumPut as often in the next step.

2) If the target function uses the values initially in the structure, call `NumPut("UInt", 123, MyStruct, 4)` to initialize any members that should be non-zero. Replace `123` with the integer to be put into the target member (or specify `StrPtr(Var)` to store the address of a string). Replace `4` with the offset of the target member (see step #4 for description of "offset"). Replace `"UInt"` with the appropriate type, such as `"Ptr"` if the member is a pointer or handle.

3) Call the target function, passing *MyStruct* as a [Ptr](#Ptr) argument. For example, `DllCall("MyDll\MyFunc", "Ptr", MyStruct)`. The function will examine and/or change some of the members. DllCall automatically uses the address of the buffer, which is normally retrieved by using `MyStruct.Ptr`.

4) Use `MyInteger := NumGet(MyStruct, 4, "UInt")` to retrieve any desired integers from the structure. Replace `4` with the offset of the target member in the structure. The first member is always at offset 0. The second member is at offset 0 plus the size of the first member (typically 4). Members beyond the second are at the offset of the previous member plus the size of the previous member. Most members -- such as DWORD, Int, and [other types of 32-bit integers](#Int) -- are 4 bytes in size. Replace `"UInt"` with the appropriate type, such as `"Ptr"` if the member is a pointer or handle.

See [Structure Examples](#ExStruct) for actual usages.

<a id="limits"></a>
## Known Limitations

When a variable's string address (e.g. `StrPtr(MyVar)`) is passed to a function and that function alters the length of the variable's contents, subsequent uses of the variable may behave incorrectly. To fix this, do one of the following: 1) Pass *MyVar* as a [Str](#Str) argument rather than as a [Ptr](#Ptr); 2) Call `VarSetStrCapacity(&MyVar, -1)` to update the variable's internally-stored length after calling DllCall.

Any binary zero stored in a variable by a function may act as a terminator, preventing all data to the right of the zero from being accessed or changed by most built-in functions. However, such data can be manipulated by retrieving the string's address with [StrPtr](StrPtr.md) and passing it to other functions, such as [NumPut](NumPut.md), [NumGet](NumGet.md), [StrGet](StrGet.md), [StrPut](StrPut.md), and DllCall itself.

A function that returns the address of one of the strings that was passed into it might return an identical string in a different memory address than expected. For example calling `CharLower(CharUpper(MyVar))` in a programming language would convert *MyVar*'s contents to lowercase. But when the same is done with DllCall, *MyVar* would be uppercase after the following call because CharLower would have operated on a different/temporary string whose contents were identical to *MyVar*:

```ahk
MyVar := "ABC"
result := DllCall("CharLower", "Str", DllCall("CharUpper", "Str", MyVar, "Str"), "Str")
```

To work around this, change the two underlined Str values above to Ptr. This interprets CharUpper's return value as a pure address that will get passed as an integer to CharLower.

Certain limitations may be encountered when dealing with strings. For details, see [Binary Compatibility](../Compat.md#DllCall).

<a id="COM"></a>
## Component Object Model (COM)

COM objects which are accessible to VBScript and similar languages are typically also accessible to AutoHotkey via [ComObject](ComObject.md), [ComObjGet](ComObjGet.md) or [ComObjActive](ComObjActive.md) and the built-in [object syntax](../Objects.md#Usage_Objects).

COM objects which don't support [IDispatch](https://learn.microsoft.com/windows/win32/api/oaidl/nn-oaidl-idispatch) can be used with DllCall by retrieving the address of a function from the virtual function table of the object's interface. For more details, see [the example](#ExTaskbar) further below. However, it is usually better to use [ComCall](ComCall.md), which streamlines this process.

<a id="dotnet"></a>
## .NET Framework

.NET Framework libraries are executed by a "virtual machine" known as the Common Language Runtime, or CLR. That being the case, .NET DLL files are formatted differently to normal DLL files, and generally do not contain any functions which DllCall is capable of calling.

However, AutoHotkey can utilize the CLR through [COM callable wrappers](https://learn.microsoft.com/dotnet/standard/native-interop/com-callable-wrapper). Unless the library is also registered as a general COM component, the CLR itself must first be manually initialized via DllCall. For details, see [.NET Framework Interop](https://www.autohotkey.com/boards/viewtopic.php?t=4633).

<a id="Related"></a>
## Related

[Binary Compatibility](../Compat.md#DllCall), [Buffer object](Buffer.md), [ComCall](ComCall.md), [PostMessage](PostMessage.md), [OnMessage](OnMessage.md), [CallbackCreate](CallbackCreate.md), [Run](Run.md), [VarSetStrCapacity](VarSetStrCapacity.md), [Functions](../Functions.md), [SysGet](SysGet.md), [#DllLoad](_DllLoad.md), [Windows API Index](https://learn.microsoft.com/windows/win32/apiindex/windows-api-list)

<a id="Examples"></a>
## Examples

<a id="ExMessageBox"></a>

**Example:** Calls the Windows API function "MessageBox" and reports which button the user presses.

```ahk
WhichButton := DllCall("MessageBox", "Int", 0, "Str", "Press Yes or No", "Str", "Title of box", "Int", 4)
MsgBox "You pressed button #" WhichButton
```

<a id="ExWallpaper"></a>

**Example:** Changes the desktop wallpaper to the specified bitmap (.bmp) file.

```ahk
DllCall("SystemParametersInfo", "UInt", 0x14, "UInt", 0, "Str", A_WinDir . "\winnt.bmp", "UInt", 1)
```

<a id="ExIsWindowVisible"></a>

**Example:** Calls the API function "IsWindowVisible" to find out if a Notepad window is visible.

```ahk
DetectHiddenWindows True
if not DllCall("IsWindowVisible", "Ptr", WinExist("Untitled - Notepad"))  ; WinExist returns an HWND.
    MsgBox "The window is not visible."
```

<a id="ExWsprintf"></a>

**Example:** Calls the API's wsprintf() to pad the number 432 with leading zeros to make it 10 characters wide (0000000432).

```ahk
ZeroPaddedNumber := Buffer(20)  ; Ensure the buffer is large enough to accept the new string.
DllCall("wsprintf", "Ptr", ZeroPaddedNumber, "Str", "%010d", "Int", 432, "CDecl")  ; Requires the CDecl calling convention.
MsgBox StrGet(ZeroPaddedNumber)

; Alternatively, use the Format function in conjunction with the zero flag:
MsgBox Format("{:010}", 432)
```

<a id="ExQPC"></a>

**Example:** Demonstrates QueryPerformanceCounter(), which gives more precision than [A_TickCount](../Variables.md#TickCount)'s 10 ms.

```ahk
DllCall("QueryPerformanceFrequency", "Int64*", &freq := 0)
DllCall("QueryPerformanceCounter", "Int64*", &CounterBefore := 0)
Sleep 1000
DllCall("QueryPerformanceCounter", "Int64*", &CounterAfter := 0)
MsgBox "Elapsed QPC time is " . (CounterAfter - CounterBefore) / freq * 1000 " ms"
```

<a id="ExMouseSpeed"></a>

**Example:** Press a hotkey to temporarily reduce the mouse cursor's speed, which facilitates precise positioning. Hold down `F1` to slow down the cursor. Release it to return to original speed.

```ahk
F1::
F1 up::
{
    static SPI_GETMOUSESPEED := 0x70
    static SPI_SETMOUSESPEED := 0x71
    static OrigMouseSpeed := 0

    switch ThisHotkey
    {
    case "F1":
        ; Retrieve the current speed so that it can be restored later:
        DllCall("SystemParametersInfo", "UInt", SPI_GETMOUSESPEED, "UInt", 0, "Ptr*", &OrigMouseSpeed, "UInt", 0)
        ; Now set the mouse to the slower speed specified in the next-to-last parameter (the range is 1-20, 10 is default):
        DllCall("SystemParametersInfo", "UInt", SPI_SETMOUSESPEED, "UInt", 0, "Ptr", 3, "UInt", 0)
        KeyWait "F1"  ; This prevents keyboard auto-repeat from doing the DllCall repeatedly.

    case "F1 up":
        DllCall("SystemParametersInfo", "UInt", SPI_SETMOUSESPEED, "UInt", 0, "Ptr", OrigMouseSpeed, "UInt", 0)  ; Restore the original speed.
    }
}
```

<a id="ExWatchScrollBar"></a>

**Example:** Monitors the active window and displays the position of its vertical scroll bar in its focused control (with real-time updates).

```ahk
SetTimer WatchScrollBar, 100

WatchScrollBar()
{
    FocusedHwnd := 0
    try FocusedHwnd := ControlGetFocus("A")
    if !FocusedHwnd  ; No focused control.
        return
    ; Display the vertical or horizontal scroll bar's position in a tooltip:
    ToolTip DllCall("GetScrollPos", "Ptr", FocusedHwnd, "Int", 1)  ;  Last parameter is 1 for SB_VERT, 0 for SB_HORZ.
}
```

<a id="ExFile"></a>

**Example:** Writes some text to a file then reads it back into memory. This method can be used to help performance in cases where multiple files are being read or written simultaneously. Alternatively, [FileOpen](FileOpen.md) can be used to achieve the [same effect](FileOpen.md#ExWriteRead).

```ahk
FileName := FileSelect("S16",, "Create a new file:")
if FileName = ""
    return
GENERIC_WRITE := 0x40000000  ; Open the file for writing rather than reading.
CREATE_ALWAYS := 2  ; Create new file (overwriting any existing file).
hFile := DllCall("CreateFile", "Str", FileName, "UInt", GENERIC_WRITE, "UInt", 0, "Ptr", 0, "UInt", CREATE_ALWAYS, "UInt", 0, "Ptr", 0, "Ptr")
if !hFile
{
    MsgBox "Can't open '" FileName "' for writing."
    return
}
TestString := "This is a test string.`r`n"  ; When writing a file this way, use `r`n rather than `n to start a new line.
StrSize := StrLen(TestString) * 2
DllCall("WriteFile", "Ptr", hFile, "Str", TestString, "UInt", StrSize, "UIntP", &BytesActuallyWritten := 0, "Ptr", 0)
DllCall("CloseHandle", "Ptr", hFile)  ; Close the file.

; Now that the file was written, read its contents back into memory.
GENERIC_READ := 0x80000000  ; Open the file for reading rather than writing.
OPEN_EXISTING := 3  ; This mode indicates that the file to be opened must already exist.
FILE_SHARE_READ := 0x1 ; This and the next are whether other processes can open the file while we have it open.
FILE_SHARE_WRITE := 0x2
hFile := DllCall("CreateFile", "Str", FileName, "UInt", GENERIC_READ, "UInt", FILE_SHARE_READ|FILE_SHARE_WRITE, "Ptr", 0, "UInt", OPEN_EXISTING, "UInt", 0, "Ptr", 0)
if !hFile
{
    MsgBox "Can't open '" FileName "' for reading."
    return
}
; Allocate a block of memory for the string to read:
Buf := Buffer(StrSize)
DllCall("ReadFile", "Ptr", hFile, "Ptr", Buf, "UInt", Buf.Size, "UIntP", &BytesActuallyRead := 0, "Ptr", 0)
DllCall("CloseHandle", "Ptr", hFile)  ; Close the file.
MsgBox "The following string was read from the file: " StrGet(Buf)
```

<a id="ExHideCursor"></a>

**Example:** Hides the mouse cursor when you press `Win`+`C`. To later show the cursor, press this hotkey again.

```ahk
OnExit (*) => SystemCursor("Show")  ; Ensure the cursor is made visible when the script exits.

#c::SystemCursor("Toggle")  ; Win+C hotkey to toggle the cursor on and off.

SystemCursor(cmd)  ; cmd = "Show|Hide|Toggle|Reload"
{
    static visible := true, c := Map()
    static sys_cursors := [32512, 32513, 32514, 32515, 32516, 32642
                         , 32643, 32644, 32645, 32646, 32648, 32649, 32650]
    if (cmd = "Reload" or !c.Count)  ; Reload when requested or at first call.
    {
        for i, id in sys_cursors
        {
            h_cursor  := DllCall("LoadCursor", "Ptr", 0, "Ptr", id)
            h_default := DllCall("CopyImage", "Ptr", h_cursor, "UInt", 2
                , "Int", 0, "Int", 0, "UInt", 0)
            h_blank   := DllCall("CreateCursor", "Ptr", 0, "Int", 0, "Int", 0
                , "Int", 32, "Int", 32
                , "Ptr", Buffer(32*4, 0xFF)
                , "Ptr", Buffer(32*4, 0))
            c[id] := {default: h_default, blank: h_blank}
        }
    }
    switch cmd
    {
    case "Show": visible := true
    case "Hide": visible := false
    case "Toggle": visible := !visible
    default: return
    }
    for id, handles in c
    {
        h_cursor := DllCall("CopyImage"
            , "Ptr", visible ? handles.default : handles.blank
            , "UInt", 2, "Int", 0, "Int", 0, "UInt", 0)
        DllCall("SetSystemCursor", "Ptr", h_cursor, "UInt", id)
    }
}
```

<a id="ExStruct"></a>

**Example:** Structure example. Pass the address of a RECT structure to GetWindowRect(), which sets the structure's members to the positions of the left, top, right, and bottom sides of a window (relative to the screen).

```ahk
Run "Notepad"
WinWait "Untitled - Notepad"  ; This also sets the "last found window" for use with WinExist below.
Rect := Buffer(16)  ; A RECT is a struct consisting of four 32-bit integers (i.e. 4*4=16).
DllCall("GetWindowRect", "Ptr", WinExist(), "Ptr", Rect)  ; WinExist returns an HWND.
L := NumGet(Rect, 0, "Int"), T := NumGet(Rect, 4, "Int")
R := NumGet(Rect, 8, "Int"), B := NumGet(Rect, 12, "Int")
MsgBox Format("Left {1} Top {2} Right {3} Bottom {4}", L, T, R, B)
```

<a id="ExStructRect"></a>

**Example:** Structure example. Pass to FillRect() the address of a RECT structure that indicates a part of the screen to temporarily paint red.

```ahk
Rect := Buffer(16)  ; Set capacity to hold four 4-byte integers.
NumPut( "Int", 0                  ; left
      , "Int", 0                  ; top
      , "Int", A_ScreenWidth//2   ; right
      , "Int", A_ScreenHeight//2  ; bottom
      , Rect)
hDC := DllCall("GetDC", "Ptr", 0, "Ptr")  ; Pass zero to get the desktop's device context.
hBrush := DllCall("CreateSolidBrush", "UInt", 0x0000FF, "Ptr")  ; Create a red brush (0x0000FF is in BGR format).
DllCall("FillRect", "Ptr", hDC, "Ptr", Rect, "Ptr", hBrush)  ; Fill the specified rectangle using the brush above.
DllCall("ReleaseDC", "Ptr", 0, "Ptr", hDC)  ; Clean-up.
DllCall("DeleteObject", "Ptr", hBrush)  ; Clean-up.
```

<a id="ExSystemTime"></a>

**Example:** Structure example. Changes the system's clock to the specified date and time. Use caution when changing to a date in the future as it may cause scheduled tasks to run prematurely!

```ahk
SetSystemTime("20051008142211")  ; Pass it a timestamp (local, not UTC).

SetSystemTime(YYYYMMDDHHMISS)
; Sets the system clock to the specified date and time.
; Caller must ensure that the incoming parameter is a valid date-time stamp
; (local time, not UTC). Returns non-zero upon success and zero otherwise.
{
    ; Convert the parameter from local time to UTC for use with SetSystemTime().
    UTC_Delta := DateDiff(A_Now, A_NowUTC, "Seconds")  ; Seconds is more accurate due to rounding issue.
    UTC_Delta := Round(-UTC_Delta/60)  ; Round to nearest minute to ensure accuracy.
    YYYYMMDDHHMISS := DateAdd(YYYYMMDDHHMISS, UTC_Delta, "Minutes")  ; Apply offset to convert to UTC.

    SystemTime := Buffer(16)  ; This struct consists of 8 UShorts (i.e. 8*2=16).

    NumPut( "UShort", SubStr(YYYYMMDDHHMISS, 1, 4)  ; YYYY (year)
          , "UShort", SubStr(YYYYMMDDHHMISS, 5, 2)  ; MM (month of year, 1-12)
          , "UShort", 0                             ; Unused (day of week)
          , "UShort", SubStr(YYYYMMDDHHMISS, 7, 2)  ; DD (day of month)
          , "UShort", SubStr(YYYYMMDDHHMISS, 9, 2)  ; HH (hour in 24-hour time)
          , "UShort", SubStr(YYYYMMDDHHMISS, 11, 2) ; MI (minute)
          , "UShort", SubStr(YYYYMMDDHHMISS, 13, 2) ; SS (second)
          , "UShort", 0                             ; Unused (millisecond)
          , SystemTime)

    return DllCall("SetSystemTime", "Ptr", SystemTime)
}
```

More structure examples:

- See the [WinLIRC client script](../scripts/index.md#WinLIRC) for a demonstration of how to use DllCall to make a network connection to a TCP/IP server and receive data from it.
- The operating system offers standard dialog boxes that prompt the user to pick a font, color, or icon. These dialogs use structures and can be displayed via DllCall in combination with [comdlg32\ChooseFont](https://learn.microsoft.com/previous-versions/windows/desktop/legacy/ms646914(v=vs.85)), [comdlg32\ChooseColor](https://learn.microsoft.com/previous-versions/windows/desktop/legacy/ms646912(v=vs.85)), or [shell32\PickIconDlg](https://learn.microsoft.com/windows/win32/api/shlobj_core/nf-shlobj_core-pickicondlg). Search the forums for examples.

<a id="ExTaskbar"></a>

**Example:** Removes the active window from the taskbar for 3 seconds. Compare this to the [equivalent ComCall example](ComCall.md#ExTaskbar).

```ahk
/*
  Methods in ITaskbarList's VTable:
    IUnknown:
      0 QueryInterface  -- use ComObjQuery instead
      1 AddRef          -- use ObjAddRef instead
      2 Release         -- use ObjRelease instead
    ITaskbarList:
      3 HrInit
      4 AddTab
      5 DeleteTab
      6 ActivateTab
      7 SetActiveAlt
*/
IID_ITaskbarList  := "{56FDF342-FD6D-11d0-958A-006097C9A090}"
CLSID_TaskbarList := "{56FDF344-FD6D-11d0-958A-006097C9A090}"

; Create the TaskbarList object.
tbl := ComObject(CLSID_TaskbarList, IID_ITaskbarList)

activeHwnd := WinExist("A")

DllCall(vtable(tbl.ptr,3), "ptr", tbl)                     ; tbl.HrInit()
DllCall(vtable(tbl.ptr,5), "ptr", tbl, "ptr", activeHwnd)  ; tbl.DeleteTab(activeHwnd)
Sleep 3000
DllCall(vtable(tbl.ptr,4), "ptr", tbl, "ptr", activeHwnd)  ; tbl.AddTab(activeHwnd)

; Interface pointer will be freed automatically.

vtable(ptr, n) {
    ; NumGet(ptr, "ptr") returns the address of the object's virtual function
    ; table (vtable for short). The remainder of the expression retrieves
    ; the address of the nth function's address from the vtable.
    return NumGet(NumGet(ptr, "ptr"), n*A_PtrSize, "ptr")
}
```
