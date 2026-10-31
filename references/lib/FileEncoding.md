# FileEncoding

Sets the default encoding for [FileRead](FileRead.md), [Loop Read](LoopRead.md), [FileAppend](FileAppend.md), and [FileOpen](FileOpen.md).

```ahk
PrevEncoding := FileEncoding(Encoding)
```

<a id="Parameters"></a>
## Parameters

**Encoding**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

Specify one of the following values:

**CP0** or empty string: The system default ANSI code page. See remarks below.

**UTF-8:** Unicode UTF-8, equivalent to CP65001.

**UTF-8-RAW:** As above, but no byte order mark is written when a new file is created.

**UTF-16:** Unicode UTF-16 with little endian byte order, equivalent to CP1200.

**UTF-16-RAW:** As above, but no byte order mark is written when a new file is created.

**CP*nnn*:** A code page with numeric identifier *nnn*. See [Code Page Identifiers](https://learn.microsoft.com/windows/win32/intl/code-page-identifiers).

***nnn*:** A numeric code page identifier.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the previous setting.

<a id="Remarks"></a>
## Remarks

The default encoding is CP0. However, the default encoding is not used if a UTF-8 or UTF-16 byte order mark is present in the file, unless the file is being opened with write-only access (i.e. the previous contents of the file are being discarded).

CP0 does not universally identify a single code page; rather, it corresponds to the system default ANSI code page, which depends on the system locale or "language for non-Unicode programs" system setting. To get the actual code page number, call `DllCall("GetACP")`.

The built-in variable [A_FileEncoding](../Variables.md#FileEncoding) contains the current setting and can also be assigned a new value instead of calling FileEncoding.

Every newly launched [thread](../misc/Threads.md) (such as a [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timed](SetTimer.md) subroutine) starts off fresh with the default setting for this function. That default may be changed by using this function during [script startup](../Scripts.md#auto).

<a id="Related"></a>
## Related

[FileOpen](FileOpen.md), [StrGet](StrGet.md), [StrPut](StrPut.md), [Reading Binary Data](FileRead.md#Binary)
