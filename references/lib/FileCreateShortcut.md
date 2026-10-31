# FileCreateShortcut

Creates a shortcut (.lnk) file.

```ahk
FileCreateShortcut Target, LinkFile , WorkingDir, Args, Description, IconFile, ShortcutKey, IconNumber, RunState
```

<a id="Parameters"></a>
## Parameters

**Target**

Type: [String](../Concepts.md#strings)

Name of the file that the shortcut refers to, which should include an absolute path unless the file is integrated with the system (e.g. Notepad.exe). The file does not have to exist at the time the shortcut is created; however, if it does not, some systems might [alter the path in unexpected ways](https://devblogs.microsoft.com/oldnewthing/20180509-00/?p=98715).

**LinkFile**

Type: [String](../Concepts.md#strings)

Name of the shortcut file to be created, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. Be sure to include the **.lnk** extension. The destination directory must already exist. If the file already exists, it will be overwritten.

**WorkingDir**

Type: [String](../Concepts.md#strings)

If blank or omitted, *LinkFile* will have a blank "Start in" field and the system will provide a default working directory when the shortcut is launched. Otherwise, specify the directory that will become *Target*'s current working directory when the shortcut is launched.

**Args**

Type: [String](../Concepts.md#strings)

If blank or omitted, *Target* will be launched without parameters. Otherwise, specify the parameters that will be passed to *Target* when it is launched. Separate parameters with spaces. If a parameter contains spaces, enclose it in double quotes.

**Description**

Type: [String](../Concepts.md#strings)

If blank or omitted, *LinkFile* will have no description. Otherwise, specify comments that describe the shortcut (used by the OS to display a tooltip, etc.)

**IconFile**

Type: [String](../Concepts.md#strings)

If blank or omitted, *LinkFile* will have *Target*'s icon. Otherwise, specify the full path and name of the icon to be displayed for *LinkFile*. It must either be an .ICO file or the very first icon of an EXE or DLL file.

**ShortcutKey**

Type: [String](../Concepts.md#strings)

If blank or omitted, *LinkFile* will have no shortcut key. Otherwise, specify a single letter, number, or the name of a single key from the [key list](../KeyList.md) (mouse buttons and other non-standard keys might not be supported). Do <u>not</u> include modifier symbols. Currently, all shortcut keys are created as `Ctrl`+`Alt` shortcuts. For example, if the letter B is specified for this parameter, the shortcut key will be `Ctrl`+`Alt`+`B`.

**IconNumber**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1. Otherwise, specify the number of the icon to be used in *IconFile*. For example, 2 is the second icon.

**RunState**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1. Otherwise, specify one of the following digits to launch *Target* minimized or maximized:

- 1 = Normal
- 3 = Maximized
- 7 = Minimized

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Remarks"></a>
## Remarks

*Target* might not need to include a path if the target file resides in one of the folders listed in the system's PATH [environment variable](../Concepts.md#environment-variables).

The shortcut key (*ShortcutKey*) of a newly created shortcut will have no effect unless the shortcut file resides on the desktop or somewhere in the Start Menu. If the shortcut key you choose is already in use, your new shortcut takes precedence.

An alternative way to create a shortcut to a URL is the following example, which creates a special URL shortcut. Change the first two parameters to suit your preferences:

```ahk
IniWrite "https://www.google.com", "C:\My Shortcut.url", "InternetShortcut", "URL"
```

The following may be optionally added to assign an icon to the above:

```ahk
IniWrite <IconFile>, "C:\My Shortcut.url", "InternetShortcut", "IconFile"
IniWrite 0, "C:\My Shortcut.url", "InternetShortcut", "IconIndex"
```

In the above, replace `0` with the index of the icon (0 is used for the first icon) and replace `<IconFile>` with a URL, EXE, DLL, or ICO file. Examples: `"C:\Icons.dll"`, `"C:\App.exe"`, `"https://www.somedomain.com/ShortcutIcon.ico"`

The operating system will treat a .URL file created by the above as a real shortcut even though it is a plain text file rather than a .LNK file.

<a id="Related"></a>
## Related

[FileGetShortcut](FileGetShortcut.md), [FileAppend](FileAppend.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** The letter "i" in the last parameter makes the shortcut key be `Ctrl`+`Alt`+`I`.

```ahk
FileCreateShortcut "Notepad.exe", A_Desktop "\My Shortcut.lnk", "C:\", A_ScriptFullPath, "My Description", "C:\My Icon.ico", "i"
```
