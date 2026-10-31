# Reload

Replaces the currently running instance of the script with a new one.

```ahk
Reload
```

This function is useful for scripts that are frequently changed. By assigning a hotkey to this function, you can easily restart the script after saving your changes in an editor.

By default, the script can also be reloaded via its [tray icon](../Program.md#tray-icon) or [main window](../Program.md#main-window).

If the [/include](../Scripts.md#SlashInclude) switch was passed to the script's current instance, it is automatically passed to the new instance.

Any other [command-line parameters](../Scripts.md#cmd) passed to the script's current instance are not passed to the new instance. To pass such parameters, do not use Reload. Instead, use [Run](Run.md) in conjunction with [A_AhkPath](../Variables.md#AhkPath) and [A_ScriptFullPath](../Variables.md#ScriptFullPath) (and [A_IsCompiled](../Variables.md#IsCompiled) if the script is ever used in compiled form). Also, include the string `/restart` as the first parameter (i.e. after the name of the executable), which tells the program to use the same behavior as Reload. See also: [command line switches and syntax](../Scripts.md#cmd).

When the script restarts, it is launched in its original working directory (the one that was in effect when it was first launched). In other words, [SetWorkingDir](SetWorkingDir.md) will not change the working directory that will be used for the new instance.

If the script cannot be reloaded -- perhaps because it has a syntax error -- the original instance of the script will continue running. Therefore, the reload function should be followed by whatever actions you want taken in the event of a failure (such as a [return](Return.md) to exit the current subroutine). To have the original instance detect the failure, follow this example:

```ahk
Reload
Sleep 1000 ; If successful, the reload will close this instance during the Sleep, so the line below will never be reached.
Result := MsgBox("The script could not be reloaded. Would you like to open it for editing?",, 4)
if Result = "Yes"
    Edit
return
```

Previous instances of the script are identified by the same mechanism as for [#SingleInstance](_SingleInstance.md), with the same [limitations](_SingleInstance.md#Limitations).

If the script allows multiple instances, Reload may fail to identify the correct instance. The simplest alternative is to [Run](Run.md) a new instance and then exit. For example:

```ahk
if A_IsCompiled
    Run Format('"{1}" /force', A_ScriptFullPath)
else
    Run Format('"{1}" /force "{2}"', A_AhkPath, A_ScriptFullPath)
ExitApp
```

<a id="Related"></a>
## Related

[Edit](Edit.md)

<a id="Examples"></a>
## Examples

<a id="ExHotkey"></a>

**Example:** Press a hotkey to restart the script.

```ahk
^!r::Reload  ; Ctrl+Alt+R
```
