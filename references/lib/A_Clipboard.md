# A_Clipboard

*A_Clipboard* is a [built-in variable](../Concepts.md#built-in-variables) that reflects the current contents of the Windows clipboard if those contents can be expressed as text.

<a id="CopiedFiles"></a>

Each line of text on *A_Clipboard* typically ends with carriage return and linefeed (CR+LF), which can be expressed in the script as `` `r`n ``. Files (such as those copied from an open Explorer window via `Ctrl`+`C`) are considered to be text: They are automatically converted to their filenames (with full path) whenever *A_Clipboard* is referenced in the script. To extract the files one by one, follow this example:

```ahk
Loop Parse A_Clipboard, "`n", "`r"
{
    Result := MsgBox("File number " A_Index " is " A_LoopField ".`n`nContinue?",, 4)
    if Result = "No"
        break
}
```

To arrange the filenames in alphabetical order, use the [Sort](Sort.md) function. To write the filenames on the clipboard to a file, use ``FileAppend A_Clipboard "`r`n", "C:\My File.txt"``. To change how long the script will keep trying to open the clipboard -- such as when it is in use by another application -- use [#ClipboardTimeout](_ClipboardTimeout.md).

[ClipWait](ClipWait.md) may be used to detect when the clipboard contains data (optionally including non-text data):

```ahk
A_Clipboard := ""  ; Start off empty to allow ClipWait to detect when the text has arrived.
Send "^c"
ClipWait  ; Wait for the clipboard to contain text.
MsgBox "Control-C copied the following contents to the clipboard:`n`n" A_Clipboard
```

<a id="Related"></a>
## Related

- [ClipboardAll](ClipboardAll.md): For operating upon everything on the clipboard (such as pictures and formatting).
- [OnClipboardChange](OnClipboardChange.md): For detecting and responding to clipboard changes.

<a id="Examples"></a>
## Examples

<a id="ExNew"></a>

**Example:** Gives the clipboard entirely new contents.

```ahk
A_Clipboard := "my text"
```

<a id="ExEmpty"></a>

**Example:** Empties the clipboard.

```ahk
A_Clipboard := ""
```

<a id="ExPlain"></a>

**Example:** Converts any copied files, HTML, or other formatted text to plain text.

```ahk
A_Clipboard := A_Clipboard
```

<a id="ExAppend"></a>

**Example:** Appends some text to the clipboard.

```ahk
A_Clipboard .= " Text to append."
```

<a id="ExReplace"></a>

**Example:** Replaces all occurrences of ABC with DEF (also converts the clipboard to plain text).

```ahk
A_Clipboard := StrReplace(A_Clipboard, "ABC", "DEF")
```

**Clipboard utilities written in AutoHotkey v1:**

- [Deluxe Clipboard](https://www.autohotkey.com/board/topic/2515-): Provides unlimited number of private, named clipboards to Copy, Cut, Paste, Append or CutAppend of selected text.
- [ClipStep](https://www.autohotkey.com/board/topic/4567-): Control multiple clipboards using only the keyboard's `Ctrl`-`X`-`C`-`V`.
