# ClipboardAll

Creates an object containing everything on the clipboard (such as pictures and formatting).

```ahk
ClipSaved := ClipboardAll(Data, Size)
```

`ClipboardAll` itself is a [class](Class.md) derived from `Buffer`.

<a id="Parameters"></a>
## Parameters

Omit both parameters to retrieve the current contents of the clipboard. Otherwise, specify one or both parameters to create an object containing the given binary clipboard data.

**Data**

Type: [Object](../Concepts.md#objects) or [Integer](../Concepts.md#numbers)

A [Buffer](Buffer.md)-like object or a pure integer which is the address of the binary data. The data must be in a specific format, so typically originates from a previous call to ClipboardAll. See [example #2](#ExFile) below.

**Size**

Type: [Integer](../Concepts.md#numbers)

The number of bytes of data to use. This is optional when *Data* is an object.

<a id="clipboardall-object"></a>
## Return Value

Type: [Object](../Concepts.md#objects)

This function returns a ClipboardAll object, which has two properties (inherited from [Buffer](Buffer.md)):

- [Ptr](Buffer.md#Ptr): The address of the data contained by the object. This address is valid until the object is freed.
- [Size](Buffer.md#Size): The size, in bytes, of the raw binary data.

<a id="Remarks"></a>
## Remarks

The built-in variable [A_Clipboard](A_Clipboard.md) reflects the current contents of the Windows clipboard expressed as plain text, but can be assigned a ClipboardAll object to restore its content to the clipboard.

*ClipboardAll* is most commonly used to save the clipboard's contents so that the script can temporarily use the clipboard for an operation. When the operation is completed, the script restores the original clipboard contents as shown in [example #1](#ExVar) and [example #2](#ExFile).

If *ClipboardAll* cannot retrieve one or more of the data objects (formats) on the clipboard, they will be omitted but all the remaining objects will be stored.

[ClipWait](ClipWait.md) may be used to detect when the clipboard contains data (optionally including non-text data).

The binary data contained by the object consists of a four-byte format type, followed by a four-byte data-block size, followed by the data-block for that format. If the clipboard contained more than one format (which is almost always the case), these three items are repeated until all the formats are included. The data ends with a four-byte format type of 0.

<a id="Related"></a>
## Related

[A_Clipboard](A_Clipboard.md), [ClipWait](ClipWait.md), [OnClipboardChange](OnClipboardChange.md), [#ClipboardTimeout](_ClipboardTimeout.md), [Buffer](Buffer.md)

<a id="Examples"></a>
## Examples

<a id="ExVar"></a>

**Example:** Saves and restores everything on the clipboard using a variable.

```ahk
ClipSaved := ClipboardAll()   ; Save the entire clipboard to a variable of your choice.
; ... here make temporary use of the clipboard, such as for quickly pasting large amounts of text ...
A_Clipboard := ClipSaved   ; Restore the original clipboard. Note the use of A_Clipboard (not ClipboardAll).
ClipSaved := ""  ; Free the memory in case the clipboard was very large.
```

<a id="ExFile"></a>

**Example:** Saves and restores everything on the clipboard using a file.

```ahk
; Option 1: Delete any existing file and then use FileAppend.
FileDelete "Company Logo.clip"
FileAppend ClipboardAll(), "Company Logo.clip" ; The file extension does not matter.

; Option 2: Use FileOpen in overwrite mode and File.RawWrite.
ClipData := ClipboardAll()
FileOpen("Company Logo.clip", "w").RawWrite(ClipData)
```

To later load the file back onto the clipboard (or into a variable), follow this example:

```ahk
ClipData := FileRead("Company Logo.clip", "RAW")  ; In this case, FileRead returns a Buffer.
A_Clipboard := ClipboardAll(ClipData)  ; Convert the Buffer to a ClipboardAll and assign it.
```
