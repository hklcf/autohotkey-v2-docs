# SetWorkingDir

Changes the script's current working directory.

```ahk
SetWorkingDir DirName
```

<a id="Parameters"></a>
## Parameters

**DirName**

Type: [String](../Concepts.md#strings)

The name of the new working directory, which is assumed to be a subfolder of the current [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

<a id="Remarks"></a>
## Remarks

The script's working directory is the default directory that is used to access files and folders when an absolute path has not been specified. In the following example, the file *My Filename.txt* is assumed to be in A_WorkingDir: `FileAppend "A Line of Text", "My Filename.txt"`.

The script's working directory defaults to [A_ScriptDir](../Variables.md#ScriptDir), regardless of how the script was launched. By contrast, the value of [A_InitialWorkingDir](../Variables.md#InitialWorkingDir) is determined by how the script was launched. For example, if it was run via shortcut -- such as on the Start Menu -- its initial working directory is determined by the "Start in" field within the shortcut's properties.

Once changed, the new working directory is instantly and globally in effect throughout the script. All interrupted, [paused](Pause.md), and newly launched [threads](../misc/Threads.md) are affected, including [Timers](SetTimer.md).

The built-in variable [A_WorkingDir](../Variables.md#WorkingDir) contains the current setting and can also be assigned a new value instead of calling SetWorkingDir.

<a id="Related"></a>
## Related

[A_WorkingDir](../Variables.md#WorkingDir), [A_InitialWorkingDir](../Variables.md#InitialWorkingDir), [A_ScriptDir](../Variables.md#ScriptDir), [DirSelect](DirSelect.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Changes the script's current working directory.

```ahk
SetWorkingDir "D:\My Folder\Temp"
```

<a id="ExInitial"></a>

**Example:** Forces the script to use the folder it was initially launched from as its working directory.

```ahk
SetWorkingDir A_InitialWorkingDir
```
