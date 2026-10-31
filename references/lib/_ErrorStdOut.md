# #ErrorStdOut

Sends any syntax error that prevents a script from launching to the standard error stream (stderr) rather than displaying a dialog.

```ahk
#ErrorStdOut Encoding
```

<a id="Parameters"></a>
## Parameters

**Encoding**

Type: [String](../Concepts.md#strings)

If omitted, it defaults to CP0 (the system default ANSI code page). Otherwise, specify an [encoding string](FileEncoding.md) indicating how to encode the output. For example, `#ErrorStdOut "UTF-8"` encodes error messages as UTF-8 before sending them to stderr. Whatever program is capturing the output must support UTF-8, and in some cases may need to be configured to expect it.

> **Note:** This parameter is not an expression, but can be enclosed in quote marks (either 'single' or "double").

<a id="Remarks"></a>
## Remarks

If this directive is unspecified in the script, any syntax error is displayed in a dialog.

Errors are written to stderr instead of stdout. The command prompt and fancy editors usually display both.

This allows fancy editors such as TextPad, SciTE, Crimson, and EditPlus to jump to the offending line when a syntax error occurs. Since the #ErrorStdOut directive would have to be added to every script, it is usually better to set up your editor to use the [command line switch](../Scripts.md#cmd) **/ErrorStdOut** when launching any AutoHotkey script (see further below for setup instructions).

Because AutoHotkey is not a console program, errors will not appear at the command prompt directly. This can be worked around by 1) compiling the script with the [Ahk2Exe ConsoleApp directive](../misc/Ahk2ExeDirectives.md#ConsoleApp), or 2) capturing the script's output via piping or redirection. For example:

```
"C:\Program Files\AutoHotkey\AutoHotkey.exe" /ErrorStdOut "My Script.ahk" 2>&1 |more
"C:\Program Files\AutoHotkey\AutoHotkey.exe" /ErrorStdOut "My Script.ahk" 2>"Syntax-Error Log.txt"
```

You can also pipe the output directly to the clipboard by using the operating system's built-in clip command. For example:

```
"C:\Program Files\AutoHotkey\AutoHotkey.exe" /ErrorStdOut "My Script.ahk" 2>&1 |clip
```

> **Note:** `2>&1` causes stderr to be redirected to stdout, while `2>Filename` redirects only stderr to a file.

Like other directives, #ErrorStdOut cannot be executed conditionally.

<a id="Instructions_for_specific_editors"></a>
## Instructions for specific editors

**EditPlus:**

1. From the menu bar, select Tools \> Configure User Tools.
2. Press button: Add Tool \> Program
3. Menu Text: Your choice
4. Command: `C:\Program Files\AutoHotkey\AutoHotkey.exe`
5. Argument: `/ErrorStdOut "$(FilePath)"`
6. Initial directory: `$(FileDir)`
7. Capture output: Yes

**TextPad:**

1. From the menu bar, select Configure \> Preferences.
2. Expand the Tools entry.
3. Press the Add button and select "Program".
4. Copy and paste (adjust to your path): `C:\Windows\System32\cmd.exe` -- then press OK.
5. Triple-click the newly added item (cmd.exe) in the ListBox and rename it to your choice (e.g. Launch Script).
6. Press Apply.
7. Select the new item in the tree at the left and enter the following information:
8. Command (should already be filled in): `cmd.exe` (or the full path to it)
9. Parameters (adjust to your path, if necessary): `/c ""C:\Program Files\AutoHotkey\AutoHotkey.exe" /ErrorStdOut "$File""`
10. Initial folder: `$FileDir`
11. Check the following boxes: 1) Run minimized; 2) Capture output.
12. Press OK. The newly added item should now exist in the Tools menu.

<a id="Related"></a>
## Related

[FileAppend](FileAppend.md) (because it can also send text to stderr or stdout)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Sends any syntax error that prevents the script from launching to stderr rather than displaying a dialog.

```ahk
#ErrorStdOut
```
