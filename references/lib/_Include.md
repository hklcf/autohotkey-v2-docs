# #Include / #IncludeAgain

Causes the script to behave as though the specified file's contents are present at this exact position.

```ahk
#Include FileOrDirName
#Include <LibName>
#IncludeAgain FileOrDirName
```

<a id="Parameters"></a>
## Parameters

**FileOrDirName**

Type: [String](../Concepts.md#strings)

The path of a file or directory as explained below. This must <u>not</u> contain double quotes (except for an optional pair of double quotes surrounding the parameter), wildcards (`*` and `?`) or [escape sequences](../misc/EscapeChar.md) other than semicolon (`` `; ``).

Built-in variables may be used by enclosing them in percent signs (for example, `#Include "%A_ScriptDir%"`). Percent signs which are not part of a valid variable reference are interpreted literally. All built-in variables containing strings or numbers are valid.

Known limitation: When compiling a script, variables are evaluated by the compiler and may differ from what the script would return when it is finally executed. The following variables are supported: [A_AhkPath](../Variables.md#AhkPath), [A_AppData](../Variables.md#AppData), [A_AppDataCommon](../Variables.md#AppDataCommon), [A_ComputerName](../Variables.md#ComputerName), [A_ComSpec](../Variables.md#ComSpec), [A_Desktop](../Variables.md#Desktop), [A_DesktopCommon](../Variables.md#DesktopCommon), [A_IsCompiled](../Variables.md#IsCompiled), [A_LineFile](../Variables.md#LineFile), [A_MyDocuments](../Variables.md#MyDocuments), [A_ProgramFiles](../Variables.md#ProgramFiles), [A_Programs](../Variables.md#Programs), [A_ProgramsCommon](../Variables.md#ProgramsCommon), [A_ScriptDir](../Variables.md#ScriptDir), [A_ScriptFullPath](../Variables.md#ScriptFullPath), [A_ScriptName](../Variables.md#ScriptName), [A_Space](../Variables.md#Space), [A_StartMenu](../Variables.md#StartMenu), [A_StartMenuCommon](../Variables.md#StartMenuCommon), [A_Startup](../Variables.md#Startup), [A_StartupCommon](../Variables.md#StartupCommon), [A_Tab](../Variables.md#Tab), [A_Temp](../Variables.md#Temp), [A_UserName](../Variables.md#UserName), [A_WinDir](../Variables.md#WinDir).

**File:** The name of the file to be included. By default, relative paths are relative to the directory of the file which contains the #Include directive. This default can be overridden by using `#Include Dir` as described below. Note: [SetWorkingDir](SetWorkingDir.md) has no effect on #Include because #Include is processed before the script begins executing.

**Directory:** Specify a directory instead of a file to change the working directory used by all subsequent occurrences of #Include and [FileInstall](FileInstall.md) in the current file. Note: Changing the working directory in this way does not affect the script's initial working directory when it starts running ([A_WorkingDir](../Variables.md#WorkingDir)). To change that, use [SetWorkingDir](SetWorkingDir.md) at the top of the script.

> **Note:** This parameter is not an expression, but can be enclosed in quote marks (either 'single' or "double").

**\<LibName\>**

Type: [String](../Concepts.md#strings)

A library file or function name. For example, `#Include <lib>` and `#Include <lib_func>` would both include lib.ahk from one of the [Lib folders](../Scripts.md#lib). Variable references are not allowed.

A subdirectory can be specified, with the caveat that the first underscore may be interpreted as a delimiter as described under [Script Library Folders](../Scripts.md#lib), e.g. `#Include <a_b\c>` will try a.ahk if a_b\c.ahk is not found.

<a id="Remarks"></a>
## Remarks

A script behaves as though the included file's contents are physically present at the exact position of the #Include directive (as though a copy-and-paste were done from the included file). Consequently, it generally cannot merge two isolated scripts together into one functioning script.

#Include ensures that the specified file is included only once, even if multiple inclusions are encountered for it. By contrast, #IncludeAgain allows multiple inclusions of the same file, while being the same as #Include in all other respects.

The file path may optionally be preceded by `*i` and a single space, which causes the program to ignore any failure to read the file. For example: `#Include "*i SpecialOptions.ahk"`. This option should be used only when the file's contents are not essential to the main script's operation.

Lines displayed in the [main window](../Program.md#main-window) via [ListLines](ListLines.md) or the menu View-\>Lines are always numbered according to their physical order within their own files. In other words, including a new file will change the line numbering of the main script file by only one line, namely that of the #Include line itself (except for [compiled scripts](../Scripts.md#ahk2exe), which merge their included files into one big script at the time of compilation).

#Include is often used to load [functions](../Functions.md) defined in an external file.

Like other directives, #Include cannot be executed conditionally. In other words, this example would not work as expected:

```ahk
if (x = 1)
    #Include "SomeFile.ahk"  ; This line takes effect regardless of the value of x.
```

<a id="Related"></a>
## Related

[Script Library Folders](../Scripts.md#lib), [Functions](../Functions.md), [FileInstall](FileInstall.md)

<a id="Examples"></a>
## Examples

<a id="ExFile"></a>

**Example:** Includes the contents of the specified file into the current script.

```ahk
#Include "C:\My Documents\Scripts\Utility Subroutines.ahk"
```

<a id="ExDir"></a>

**Example:** Changes the working directory for subsequent #Includes and FileInstalls.

```ahk
#Include "%A_ScriptDir%"
```

<a id="ExDir2"></a>

**Example:** Same as above but for an explicitly named directory.

```ahk
#Include "C:\My Scripts"
```
