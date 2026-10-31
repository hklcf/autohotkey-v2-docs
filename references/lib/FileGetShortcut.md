# FileGetShortcut

Retrieves information about a shortcut (.lnk) file, such as its target file.

```ahk
FileGetShortcut LinkFile , &OutTarget, &OutDir, &OutArgs, &OutDescription, &OutIcon, &OutIconNum, &OutRunState
```

<a id="Parameters"></a>
## Parameters

**LinkFile**

Type: [String](../Concepts.md#strings)

Name of the shortcut file to be analyzed, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. Be sure to include the **.lnk** extension.

**&OutTarget**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify a reference to the output variable in which to store the shortcut's target (not including any arguments it might have). For example: C:\WINDOWS\system32\notepad.exe

**&OutDir**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify a reference to the output variable in which to store the shortcut's working directory. For example: C:\My Documents. If [environment variables](../Concepts.md#environment-variables) such as %WinDir% are present in the string, one way to resolve them is via [StrReplace](StrReplace.md). For example: `OutDir := StrReplace(OutDir, "%WinDir%", A_WinDir)`

**&OutArgs**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify a reference to the output variable in which to store the shortcut's parameters (blank if none).

**&OutDescription**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify a reference to the output variable in which to store the shortcut's comments (blank if none).

**&OutIcon**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify a reference to the output variable in which to store the filename of the shortcut's icon (blank if none).

**&OutIconNum**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify a reference to the output variable in which to store the shortcut's icon number within the icon file (blank if none). This value is most often 1, which means the first icon.

**&OutRunState**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, the corresponding value will not be stored. Otherwise, specify a reference to the output variable in which to store the shortcut's initial launch state, which is one of the following digits:

- 1 = Normal
- 3 = Maximized
- 7 = Minimized

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

<a id="Remarks"></a>
## Remarks

Any of the output variables may be omitted if the corresponding information is not needed.

<a id="Related"></a>
## Related

[FileCreateShortcut](FileCreateShortcut.md), [SplitPath](SplitPath.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Allows the user to select an .lnk file to show its information.

```ahk
LinkFile := FileSelect(32,, "Pick a shortcut to analyze.", "Shortcuts (*.lnk)")
if LinkFile = ""
    return
FileGetShortcut LinkFile, &OutTarget, &OutDir, &OutArgs, &OutDesc, &OutIcon, &OutIconNum, &OutRunState
MsgBox OutTarget "`n" OutDir "`n" OutArgs "`n" OutDesc "`n" OutIcon "`n" OutIconNum "`n" OutRunState
```
