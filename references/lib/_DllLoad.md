# #DllLoad

[Loads](DllCall.md#load) a DLL or EXE file before the script starts executing.

```ahk
#DllLoad FileOrDirName
```

<a id="Parameters"></a>
## Parameters

**FileOrDirName**

Type: [String](../Concepts.md#strings)

The path of a file or directory as explained below. This must <u>not</u> contain double quotes (except for an optional pair of double quotes surrounding the parameter), wildcards (`*` and `?`) or [escape sequences](../misc/EscapeChar.md) other than semicolon (`` `; ``).

Built-in variables may be used by enclosing them in percent signs (for example, `#DllLoad "%A_ScriptDir%"`). Percent signs which are not part of a valid variable reference are interpreted literally. All built-in variables are valid, except for [A_Args](../Variables.md#Args) and built-in classes.

Known limitation: When compiling a script, variables are evaluated by the compiler and may differ from what the script would return when it is finally executed. The following variables are supported: [A_AhkPath](../Variables.md#AhkPath), [A_AppData](../Variables.md#AppData), [A_AppDataCommon](../Variables.md#AppDataCommon), [A_ComputerName](../Variables.md#ComputerName), [A_ComSpec](../Variables.md#ComSpec), [A_Desktop](../Variables.md#Desktop), [A_DesktopCommon](../Variables.md#DesktopCommon), [A_IsCompiled](../Variables.md#IsCompiled), [A_LineFile](../Variables.md#LineFile), [A_MyDocuments](../Variables.md#MyDocuments), [A_ProgramFiles](../Variables.md#ProgramFiles), [A_Programs](../Variables.md#Programs), [A_ProgramsCommon](../Variables.md#ProgramsCommon), [A_ScriptDir](../Variables.md#ScriptDir), [A_ScriptFullPath](../Variables.md#ScriptFullPath), [A_ScriptName](../Variables.md#ScriptName), [A_Space](../Variables.md#Space), [A_StartMenu](../Variables.md#StartMenu), [A_StartMenuCommon](../Variables.md#StartMenuCommon), [A_Startup](../Variables.md#Startup), [A_StartupCommon](../Variables.md#StartupCommon), [A_Tab](../Variables.md#Tab), [A_Temp](../Variables.md#Temp), [A_UserName](../Variables.md#UserName), [A_WinDir](../Variables.md#WinDir).

**File:** The absolute or relative path to the DLL or EXE file to be loaded. If a relative path is specified, the directive searches for the file using the same search strategy as the system's function [LoadLibraryW](https://learn.microsoft.com/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibraryw). Note: [SetWorkingDir](SetWorkingDir.md) has no effect on #DllLoad because #DllLoad is processed before the script begins executing.

**Directory:** Specify a directory instead of a file to alter the search strategy by all subsequent occurrences of #DllLoad which do not specify an absolute path to a DLL or EXE. The new search strategy is the same as if *Directory* was passed to the system's function [SetDllDirectoryW](https://learn.microsoft.com/windows/win32/api/winbase/nf-winbase-setdlldirectoryw). If this parameter is omitted, the default search strategy is restored.

> **Note:** This parameter is not an expression, but can be enclosed in quote marks (either 'single' or "double").

<a id="Remarks"></a>
## Remarks

Once a DLL or EXE has been loaded by this directive it cannot be unloaded by calling the system's function [FreeLibrary](https://learn.microsoft.com/windows/win32/api/libloaderapi/nf-libloaderapi-freelibrary). When the script is terminated, all loaded files are unloaded automatically.

The file path may optionally be preceded by `*i` and a single space, which causes the program to ignore any failure to load the file. This option should be used only if the script is capable of executing despite the failure, such as if the DLL or EXE is non-essential, or if the script is designed to detect the failure. For example:

```ahk
#DllLoad "*i MyDLL"
if !DllCall("GetModuleHandle", "str", "MyDLL")
    MsgBox "Failed to load MyDLL!"
```

If the *FileOrDirName* parameter specifies a DLL name without a path and the file name extension is omitted, *.dll* is appended to the file name. To prevent this, include a trailing period (.) in the file name.

Like other directives, #DllLoad cannot be executed conditionally.

<a id="Related"></a>
## Related

[DllCall](DllCall.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Loads a DLL file located in the current user's "My Documents" folder before the script starts executing.

```ahk
#DllLoad "%A_MyDocuments%\MyDLL.dll"
```
