# Scripts

Related topics:

- [Using the Program](Program.md): How to use AutoHotkey, in general.
- [Concepts and Conventions](Concepts.md): General explanation of various concepts utilised by AutoHotkey.
- [Scripting Language](Language.md): Specific details about syntax (how to write scripts).

<a id="toc"></a>
## Table of Contents

- [Introduction](#intro)
- [Script Startup (the Auto-execute Thread)](#auto): Taking action immediately upon starting the script, and changing default settings.
- [Splitting a Long Line into a Series of Shorter Ones](#continuation): This can improve a script's readability and maintainability.
- [Script Library Folders](#lib)
- [Convert a Script to an EXE (Ahk2Exe)](#ahk2exe): Convert a .ahk script into a .exe file that can run on any PC.
- [Passing Command Line Parameters to a Script](#cmd): The variable A_Args contains the incoming parameters.
- [Script File Codepage](#cp): Using non-ASCII characters safely in scripts.
- [Debugging a Script](#debug): How to find the flaws in a misbehaving script.

<a id="intro"></a>
## Introduction

Each script is a plain text file containing lines to be executed by the program (AutoHotkey.exe). A script may also contain [hotkeys](Hotkeys.md) and [hotstrings](Hotstrings.md), or even consist entirely of them. However, in the absence of hotkeys and hotstrings, a script will perform its functions sequentially from top to bottom the moment it is launched.

The program loads the script into memory line by line. During loading, the script is [optimized](misc/Performance.md) and validated. Any syntax errors will be displayed, and they must be corrected before the script can run.

<a id="auto"></a>
## Script Startup (the Auto-execute Thread)

After the script has been loaded, the *auto-execute thread* begins executing at the script's top line, and continues until instructed to stop, such as by [Return](lib/Return.md), [ExitApp](lib/ExitApp.md) or [Exit](lib/Exit.md). The physical end of the script also acts as [Exit](lib/Exit.md).

<a id="persistent"></a>

The script will terminate after completing startup if it lacks [hotkeys](Hotkeys.md), [hotstrings](Hotstrings.md), visible [GUIs](lib/Gui.md), active [timers](lib/SetTimer.md), [clipboard monitors](lib/OnClipboardChange.md) and [InputHooks](lib/InputHook.md), and has not called the [Persistent](lib/Persistent.md) function. Otherwise, it will stay running in an idle state, responding to events such as [hotkeys](Hotkeys.md), [hotstrings](Hotstrings.md), [GUI events](lib/GuiOnEvent.md), [custom menu items](lib/Menu.md), and [timers](lib/SetTimer.md). If these conditions change after startup completes (for example, the last timer is disabled), the script may exit when the last running thread completes or the last GUI closes.

Whenever any new [thread](misc/Threads.md) is launched (whether by a [hotkey](Hotkeys.md), [hotstring](Hotstrings.md), [timer](lib/SetTimer.md), or some other event), the following settings are copied from the auto-execute thread. If not set by the auto-execute thread, the standard defaults will apply (as documented on each of the following pages): [CoordMode](lib/CoordMode.md), [Critical](lib/Critical.md), [DetectHiddenText](lib/DetectHiddenText.md), [DetectHiddenWindows](lib/DetectHiddenWindows.md), [FileEncoding](lib/FileEncoding.md), [ListLines](lib/ListLines.md), [SendLevel](lib/SendLevel.md), [SendMode](lib/SendMode.md), [SetControlDelay](lib/SetControlDelay.md), [SetDefaultMouseSpeed](lib/SetDefaultMouseSpeed.md), [SetKeyDelay](lib/SetKeyDelay.md), [SetMouseDelay](lib/SetMouseDelay.md), [SetRegView](lib/SetRegView.md), [SetStoreCapsLockMode](lib/SetStoreCapsLockMode.md), [SetTitleMatchMode](lib/SetTitleMatchMode.md), [SetWinDelay](lib/SetWinDelay.md), and [Thread](lib/Thread.md).

Each [thread](misc/Threads.md) retains its own collection of the above settings, so changes made to those settings will not affect other threads.

The "default setting" for one of the above functions usually refers to the current setting of the auto-execute thread, which starts out the same as the program-defined default setting.

Traditionally, the top of the script has been referred to as the *auto-execute section*. However, the auto-execute thread is not limited to just the top of the script. Any functions which are called on the auto-execute thread may also affect the default settings. As directives and function, hotkey, hotstring and class definitions are skipped when encountered during execution, it is possible for startup code to be placed throughout each file. For example, a global variable used by a group of hotkeys may be initialized above (or even below) those hotkeys rather than at the top of the script.

<a id="continuation"></a>
## Splitting a Long Line into a Series of Shorter Ones

Long lines can be divided up into a collection of smaller ones to improve readability and maintainability. This does not reduce the script's execution speed because such lines are merged in memory the moment the script launches.

There are three methods, and they can generally be used in combination:

- [Continuation operator](#continuation-line): Start or end a line with an expression operator to join it to the previous or next line.
- [Continuation by enclosure](#continuation-expr): A sub-expression enclosed in (), [] or {} can automatically span multiple lines in most cases.
- [Continuation section](#continuation-section): Mark a group of lines to be merged together, with additional options such as what text (or code) to insert between lines.

<a id="continuation-line"></a>

**Continuation operator:** A line that starts with a comma or any other [expression operator](Variables.md#Operators) (except ++ and --) is automatically merged with the line directly above it. Similarly, a line that ends with an expression operator is automatically merged with the line below it. In the following example, the second line is appended to the first because it begins with a comma:

```ahk
FileAppend "This is the text to append.`n"   ; A comment is allowed here.
    , A_ProgramFiles "\SomeApplication\LogFile.txt"  ; Comment.
```

Similarly, the following lines would get merged into a single line because the last two start with "and" or "or":

```ahk
if Color = "Red" or Color = "Green"  or Color = "Blue"   ; Comment.
    or Color = "Black" or Color = "Gray" or Color = "White"   ; Comment.
    and ProductIsAvailableInColor(Product, Color)   ; Comment.
```

The [ternary operator](Variables.md#ternary) is also a good candidate:

```ahk
ProductIsAvailable := (Color = "Red")
    ? false  ; We don't have any red products, so don't bother calling the function.
    : ProductIsAvailableInColor(Product, Color)
```

The following examples are equivalent to those above:

```ahk
FileAppend "This is the text to append.`n",   ; A comment is allowed here.
    A_ProgramFiles "\SomeApplication\LogFile.txt"  ; Comment.

if Color = "Red" or Color = "Green"  or Color = "Blue" or   ; Comment.
    Color = "Black" or Color = "Gray" or Color = "White" and   ; Comment.
    ProductIsAvailableInColor(Product, Color)   ; Comment.

ProductIsAvailable := (Color = "Red") ?
    false : ; We don't have any red products, so don't bother calling the function.
    ProductIsAvailableInColor(Product, Color)
```

Although the indentation used in the examples above is optional, it might improve clarity by indicating which lines belong to ones above them. Also, blank lines or [comments](Language.md#comments) may be added between or at the end of any of the lines in the above examples.

A continuation operator cannot be used with an auto-replace hotstring or directive other than [#HotIf](lib/_HotIf.md).

<a id="continuation-expr"></a>

**Continuation by enclosure:** If a line contains an expression or function/property definition with an unclosed `(`/`[`/`{`, it is joined with subsequent lines until the number of opening and closing symbols balances out. In other words, a sub-expression enclosed in parentheses, brackets or braces can automatically span multiple lines in most cases. For example:

```ahk
myarray := [
  "item 1",
  "item 2",
]
MsgBox(
    "The value of item 2 is " myarray[2],
    "Title",
    "ok iconi"
    )
```

Continuation expressions may contain both types of [comments](Language.md#comments).

Continuation expressions may contain normal [continuation sections](#continuation-section). Therefore, as with any line containing an expression, if a line begins with a non-escaped open parenthesis (`(`), it is considered to be the start of a continuation section unless there is a closing parenthesis (`)`) on the same line.

Quoted strings cannot span multiple lines using this method alone. However, see above.

Continuation by enclosure can be combined with a continuation operator. For example:

```ahk
myarray :=  ; The assignment operator causes continuation.
[  ; Brackets enclose the following two lines.
  "item 1",
  "item 2",
]
```

Brace (`{`) at the end of a line does not cause continuation if the program determines that it should be interpreted as the beginning of a block ([OTB style](lib/Block.md#otb)) rather than the start of an [object literal](Language.md#object-literal). Specifically (in descending order of precedence):

- A brace is never interpreted as the beginning of a block if it is preceded by an unclosed `(`/`[`/`{`, since that would produce an invalid expression. For example, the brace in `If ({` is the start of an object literal.
- An object literal cannot legally follow `)` or `]`, so if the brace follows either of those symbols (excluding whitespace), it is interpreted as the beginning of a block (such as for a function or property definition).
- For [control flow statements](Language.md#control-flow) which require a body (and therefore support OTB), the brace can be the start of an object literal only if it is preceded by an operator, such as `:= {` or `for x in {`. In particular, the brace in `Loop {` is always block-begin, and `If {` and `While {` are always errors.

A brace can be safely used for line continuation with any function call, expression or control flow statement which does not require a body. For example:

```ahk
myfn() {
    return {
        key: "value"
    }
}
```

<a id="continuation-section"></a>

**Continuation section:** This method should be used to merge a large number of lines or when the lines are not suitable for the other methods. Although this method is especially useful for [auto-replace hotstrings](Hotstrings.md), it can also be used with any [expression](Variables.md#Expressions). For example:

```ahk
; EXAMPLE #1 - inside a quoted/literal string:
Var := "
(
A line of text.
By default, the hard carriage return (Enter) between the previous line and this one will be stored.
	This line is indented with a tab; by default, that tab will also be stored.
Additionally, "quote marks" are automatically escaped when appropriate.
)"

; EXAMPLE #2 - outside a quoted/literal string:
Var :=
(
"Same as above, except that quote marks are not automatically escaped.
Specify variables as follows: " Var "
A line of text."
)

; EXAMPLE #3:
FileAppend "
(
Line 1 of the text.
Line 2 of the text. By default, a linefeed (`n) is present between lines.
)", A_Desktop "\My File.txt"

; EXAMPLE #4:
FormatStr := "
(
Another way of using variables with a continuation section.
Input value 1: {1}
Input value 2: {2}
)"
MsgBox Format(FormatStr, A_TickCount, A_Now)
```

In the examples above, a series of lines is bounded at the top and bottom by a pair of parentheses. This is known as a *continuation section*. Notice that any code after the closing parenthesis is also joined with the other lines (without any delimiter), but the opening and closing parentheses are not included.

If the line above the continuation section ends with a [name](Concepts.md#names) character and the section does not start inside a quoted string, a single space is automatically inserted to separate the name from the contents of the continuation section.

<a id="continuation_quotes"></a>

Quote marks are automatically escaped (i.e. they are interpreted as literal characters) if the continuation section starts inside a quoted/literal string, as in the examples except #2 above. Otherwise, quote marks act as they do normally; that is, continuation sections can contain expressions with quoted strings, as in the example #2 above.

<a id="continuation_defaults"></a>

By default, leading spaces or tabs are omitted based on the indentation of the first line inside the continuation section. If the first line mixes spaces and tabs, only the first type of character is treated as indentation. If any line is indented less than the first line or with the wrong characters, all leading whitespace on that line is left as is.

By default, trailing spaces or tabs are omitted.

The default behavior of a continuation section can be overridden by including one or more of the following options to the right of the section's opening parenthesis. If more than one option is present, separate each one from the previous with a space. For example: `( LTrim Join|`.

<a id="Join"></a>

**Join***String*: Specifies how lines should be connected together. If this option is not used, each line except the last will be followed by a linefeed character (\`n). If *String* is omitted, lines are connected directly to each other without any characters in between. Otherwise, specify for *String* a string of up to 15 characters. For example, ``Join`s`` would insert a space after each line except the last. Another example is ``Join`r`n``, which inserts CR+LF between lines. Similarly, `Join|` inserts a pipe between lines. To have the final line in the section also ended by *String*, include a blank line immediately above the section's closing parenthesis.

<a id="LTrim"></a>

**LTrim:** Omits all spaces and tabs at the beginning of each line. This is usually unnecessary because of the [default "smart" behavior](#continuation_defaults).

<a id="LTrim0"></a>

**LTrim0** (LTrim followed by a zero): Turns off the omission of spaces and tabs from the beginning of each line.

<a id="RTrim0"></a>

**RTrim0** (RTrim followed by a zero): Turns off the omission of spaces and tabs from the end of each line.

<a id="CommentOption"></a>

**Comments** (or **Comment** or **Com** or **C**): Allows [semicolon comments](Language.md#comments) inside the continuation section (but not `/*..*/`). Such comments (along with any spaces and tabs to their left) are entirely omitted from the joined result rather than being treated as literal text. Each comment can appear to the right of a line or on a new line by itself.

<a id="accent"></a>

**\`** (accent): Treats each backtick character literally rather than as an [escape character](misc/EscapeChar.md). This also prevents the translation of any explicitly specified escape sequences such as `` `r `` and `` `t ``.

<a id="non-continuation"></a>

**(** or **)**: If an opening or closing parenthesis appears to the right of the initial opening parenthesis (except as a parameter of the [Join](#Join) option), the line is reinterpreted as an expression instead of the beginning of a continuation section. This enables expressions like `(x.y)[z]()` to be used at the start of a line, and also allows [multi-line expressions](#continuation-expr) to start with a line like `((` or `(MyFunc(`.

<a id="continuation-remarks"></a>
### Remarks

[Escape sequences](misc/EscapeChar.md) such as \`n (linefeed) and \`t (tab) are supported inside the continuation section except when the [accent (\`) option](#accent) has been specified.

When the [comment option](#CommentOption) is absent, semicolon and /\*..\*/ comments are not supported within the interior of a continuation section because they are seen as literal text. However, comments can be included on the bottom and top lines of the section. For example:

```ahk
FileAppend "   ; Comment.
; Comment.
( LTrim Join    ; Comment.
     ; This is not a comment; it is literal. Include the word Comments in the line above to make it a comment.
)", "C:\File.txt"   ; Comment.
```

As a consequence of the above, semicolons never need to be [escaped](misc/EscapeChar.md) within a continuation section.

Since a closing parenthesis indicates the end of a continuation section, to have a line start with literal closing parenthesis, precede it with an accent/backtick: `` `) ``. However, this cannot be combined with the [accent (\`) option](#accent).

A continuation section can be immediately followed by a line containing the open-parenthesis of another continuation section. This allows the options mentioned above to be varied during the course of building a single line.

The piecemeal construction of a continuation section by means of [#Include](lib/_Include.md) is not supported.

<a id="lib"></a>
## Script Library Folders

The library folders provide a few standard locations to keep shared scripts which other scripts utilise by means of [#Include](lib/_Include.md). A library script typically contains a function or class which is designed to be used and reused in this manner. Placing library scripts in one of these locations makes it easier to write scripts that can be shared with others and work across multiple setups. The library locations are:

```ahk
A_ScriptDir "\Lib\"  ; Local library.
A_MyDocuments "\AutoHotkey\Lib\"  ; User library.
"directory-of-the-currently-running-AutoHotkey.exe\Lib\"  ; Standard library.
```

The library folders are searched in the order shown above.

For example, if a script includes the line `#Include <MyLib>`, the program searches for a file named "MyLib.ahk" in the local library. If not found there, it searches for it in the user library, and then the standard library. If a match is still not found and the library's name contains an underscore (e.g. `MyPrefix_MyFunc`), the program searches again with just the prefix (e.g. `MyPrefix.ahk`).

Although by convention a library file generally contains only a single function or class of the same name as its filename, it may also contain private functions that are called only by it. However, such functions should have fairly distinct names because they will still be in the global namespace; that is, they will be callable from anywhere in the script.

<a id="ahk2exe"></a>
## Convert a Script to an EXE (Ahk2Exe)

A script compiler (courtesy of fincs, with additions by TAC109) is available as a separate automatic download.

Once a script is compiled, it becomes a standalone executable; that is, AutoHotkey.exe is not required in order to run the script. The compilation process creates an executable file which contains the following: the AutoHotkey interpreter, the script, any files it [includes](lib/_Include.md), and any files it has incorporated via the [FileInstall](lib/FileInstall.md) function. Additional files can be included using [compiler directives](misc/Ahk2ExeDirectives.md).

The same compiler is used for v1.1 and v2 scripts. The compiler distinguishes script versions by checking the major version of the base file supplied.

<a id="ahk2exe-toc"></a>
### Compiler Topics

- [Running the Compiler](#ahk2exe-run)
- [Base Executable File](#ahk2exe-base)
- [Script Compiler Directives](#CompilerDirectives)
- [Compressing Compiled Scripts](#mpress)
- [Background Information](#information)

<a id="ahk2exe-run"></a>
### Running the Compiler

Ahk2Exe can be used in the following ways:

-     **GUI Interface:** Run the "Convert .ahk to .exe" item in the Start Menu. (After invoking the GUI, there may be a pause before the window is shown; see [Background Information](#information) for more details.)
-     **Right-click:** Within an open Explorer window, right-click any .ahk file and select "Compile Script" (only available if the script compiler option was chosen when AutoHotkey was installed). This creates an EXE file of the same base filename as the script, which appears after a short time in the same directory. Note: The EXE file is produced using the same custom icon, .bin file and [compression](#mpress) setting that were last saved in Method #1 above, or as specified by any relevant [compiler directive](misc/Ahk2ExeDirectives.md) in the script.
- <a id="ahk2exeCmd"></a>     **Command Line:** The compiler can be run from the command line by using the parameters shown below. If any command line parameters are used, the script is compiled immediately unless `/gui` is used. All parameters are optional, except that there must be one `/gui` or `/in` parameter.

    <a id="param_pairs"></a>

    | Parameter pair | Meaning |
    | --- | --- |
    | <a id="SlashIn"></a>/in *script_name* | The path and name of the script to compile. This is mandatory if any other parameters are used, unless `/gui` is used. |
    | <a id="SlashOut"></a>/out *exe_name* | The path\name of the output .exe to be created. Default is the directory\base_name of the input file plus extension of .exe, or any relevant [compiler directive](misc/Ahk2ExeDirectives.md) in the script. |
    | <a id="slashIcon"></a>/icon *icon_name* | The icon file to be used. Default is the last icon saved in the GUI interface, or any [SetMainIcon](misc/Ahk2ExeDirectives.md#SetMainIcon) compiler directive in the script. |
    | <a id="SlashBase"></a>/base *file_name* | The base file to be used (a .bin or .exe file). The major version of the base file used must be the same as the version of the script to be compiled. Default is the last base file name saved in the GUI interface, or any [Base](misc/Ahk2ExeDirectives.md#Bin) compiler directive in the script. |
    | <a id="SlashResourceID"></a>/resourceid *name* | Assigns a non-standard resource ID to be used for the main script for compilations which use an [.exe base file](#SlashBase) (see [Embedded Scripts](Program.md#embedded-scripts)). Numeric resource IDs should consist of a hash sign (#) followed by a decimal number. Default is #1, or any [ResourceID](misc/Ahk2ExeDirectives.md#ResourceID) compiler directive in the script. |
    | <a id="SlashCp"></a>/cp *codepage* | Overrides the default codepage used to read script files. For a list of possible values, see [Code Page Identifiers](https://learn.microsoft.com/windows/win32/intl/code-page-identifiers). Note that Unicode scripts should begin with a byte-order-mark (BOM), rendering the use of this parameter unnecessary. |
    | <a id="SlashCompress"></a>/compress *n* | [Compress](#mpress) the exe? 0 = no, 1 = use MPRESS if present, 2 = use UPX if present. Default is the last setting saved in the GUI interface. |
    | <a id="SlashGui"></a>/gui | Shows the GUI instead of immediately compiling. The other parameters can be used to override the settings last saved in the GUI. `/in` is optional in this case. |
    | <a id="SlashGuiSilent"></a>/silent [verbose] | Disables all message boxes and instead outputs errors to the standard error stream (stderr); or to the standard output stream (stdout) if stderr fails. Other messages are also output to stdout. Optionally enter the word `verbose` to output status messages to stdout as well. |
    | <a id="SlashAhk"></a>**Deprecated:**<br>/ahk *file_name* | The path\name of AutoHotkey.exe to be used as a utility when compiling the script. |
    | <a id="SlashMpress"></a>**Deprecated:**<br>/mpress *0or1* | [Compress](#mpress) the exe with MPRESS? 0 = no, 1 = yes. Default is the last setting used in the GUI interface. |
    | <a id="SlashBin"></a>**Deprecated:**<br>/bin *file_name* | The .bin file to be used. Default is the last .bin file name saved in the GUI interface. |

    For example:

    ```
    Ahk2Exe.exe /in "MyScript.ahk" /icon "MyIcon.ico"
    ```

Notes:

- Parameters containing spaces must be enclosed in double quotes.
- Compiling does not typically improve the performance of a script.
- [#NoTrayIcon](lib/_NoTrayIcon.md) and [A_AllowMainWindow](Variables.md#AllowMainWindow) affect the behavior of compiled scripts.
- The built-in variable [A_IsCompiled](Variables.md#IsCompiled) contains 1 if the script is running in compiled form, otherwise 0.
- When parameters are passed to Ahk2Exe, a message indicating the success or failure of the compiling process is written to stdout. Although the message will not appear at the command prompt, it can be "caught" by means such as redirecting output to a file.
- Additionally in the case of a failure, Ahk2Exe has exit codes indicating the kind of error that occurred. These error codes can be found at [GitHub (ErrorCodes.md)](https://github.com/AutoHotkey/Ahk2Exe/blob/master/ErrorCodes.md).

The compiler's source code and newer versions can be found at [GitHub](https://github.com/AutoHotkey/Ahk2Exe).

<a id="ahk2exe-base"></a>
### Base Executable File

Each compiled script .exe is based on an executable file which implements the interpreter. The base files included in the Compiler directory have the ".bin" extension; these are versions of the interpreter which do not include the capability to load external script files. Instead, the program looks for a Win32 (RCDATA) resource named "\>AUTOHOTKEY SCRIPT\<" and loads that, or fails if it is not found.

The standard AutoHotkey executable files can also be used as the base of a compiled script, by embedding a Win32 (RCDATA) resource with ID 1. (Additional scripts can be added with the [AddResource](misc/Ahk2ExeDirectives.md#AddResource) compiler directive.) This allows the compiled script .exe to be used with the [/script](#SlashScript) switch to execute scripts other than the main embedded script. For more details, see [Embedded Scripts](Program.md#embedded-scripts).

<a id="CompilerDirectives"></a>
### Script Compiler Directives

Script compiler directives allow the user to specify details of how a script is to be compiled. Some of the features are:

- Ability to change the version information (such as the name, description, version...).
- Ability to add resources to the compiled script.
- Ability to tweak several miscellaneous aspects of compilation.
- Ability to remove code sections from the compiled script and vice versa.

See [Script Compiler Directives](misc/Ahk2ExeDirectives.md) for more details.

<a id="mpress"></a>
### Compressing Compiled Scripts

Ahk2Exe optionally uses MPRESS or UPX freeware to compress compiled scripts. If **MPRESS.exe** and/or **UPX.exe** has been copied to the "Compiler" subfolder where AutoHotkey was installed, either can be used to compress the .exe as directed by the `/compress` parameter or the GUI setting.

**MPRESS:** [archived official website](https://www.autohotkey.com/mpress/mpress_web.htm) (downloads and information) | [direct download](https://www.autohotkey.com/mpress/mpress.219.zip) (95 KB)

**UPX:** [official website](https://upx.github.io/) (downloads and information)

**Note:** While compressing the script executable prevents casual inspection of the script's source code using a plain text editor like Notepad or a PE resource editor, it does not prevent the source code from being extracted by tools dedicated to that purpose.

<a id="information"></a>
### Background Information

The following folder structure is supported, where the running version of `Ahk2Exe.exe` is in the first \Compiler directory shown below:

```
\AutoHotkey
   AutoHotkeyA32.exe
   AutoHotkeyU32.exe
   AutoHotkeyU64.exe
   \Compiler
      Ahk2Exe.exe  ; the master version of Ahk2Exe
      ANSI 32-bit.bin
      Unicode 32-bit.bin
      Unicode 64-bit.bin
   \AutoHotkey v2.0-a135
      AutoHotkey32.exe
      AutoHotkey64.exe
      \Compiler
   \v2.0-beta.1
      AutoHotkey32.exe
      AutoHotkey64.exe
```

The base file search algorithm runs for a short amount of time when Ahk2Exe starts, and works as follows:

Qualifying AutoHotkey .exe files and all .bin files are searched for in the compiler's directory, the compiler's parent directory, and any of the compiler's sibling directories with directory names that start with `AutoHotkey` or `V`, but do not start with `AutoHotkey_H`. The selected directories are searched recursively. Any AutoHotkey.exe files found are excluded, leaving files such as AutoHotkeyA32.exe, AutoHotkey64.exe, etc. plus all .bin files found. All .exe files that are included must have a name starting with `AutoHotkey` and a file description containing the word `AutoHotkey`, and must have a version of `1.1.34+` or `2.0-a135+`.

A version of the AutoHotkey interpreter is also needed (as a utility) for a successful compile, and one is selected using a similar algorithm. In most cases the version of the interpreter used will match the version of the base file selected by the user for the compile.

<a id="cmd"></a>
## Passing Command Line Parameters to a Script

Scripts support command line parameters. The format is:

```
AutoHotkey.exe [Switches] [Script Filename] [Script Parameters]
```

And for compiled scripts, the format is:

```
CompiledScript.exe [Switches] [Script Parameters]
```

**Switches:** Zero or more of the following:

| Switch | Meaning | Works compiled? |
| --- | --- | --- |
| <a id="SlashF"></a>/force | Launch unconditionally, skipping any warning dialogs. This has the same effect as [#SingleInstance Off](lib/_SingleInstance.md). | Yes |
| <a id="SlashR"></a>/restart | Indicate that the script is being restarted and should attempt to close a previous instance of the script (this is also used by the [Reload](lib/Reload.md) function, internally). | Yes |
| <a id="ErrorStdOut"></a>/ErrorStdOut<br><br>/ErrorStdOut=*Encoding* | Send syntax errors that prevent a script from launching to the standard error stream (stderr) rather than displaying a dialog. See [#ErrorStdOut](lib/_ErrorStdOut.md) for details.<br> An [encoding](lib/FileEncoding.md) can optionally be specified. For example, `/ErrorStdOut=UTF-8` encodes messages as UTF-8 before writing them to stderr. | No |
| <a id="SlashDebug"></a>/Debug | Connect to a debugging client. For more details, see [Interactive Debugging](#idebug). | No |
| <a id="CPn"></a>/CP*n* | Overrides the default codepage used to read script files. For more details, see [Script File Codepage](#cp). | No |
| <a id="validate"></a>/Validate | AutoHotkey loads the script and then exits instead of running it.<br> By default, load-time errors and warnings are displayed as usual. The [/ErrorStdOut](#ErrorStdOut) switch can be used to suppress or capture any error messages.<br> The process exit code is zero if the script successfully loaded, or non-zero if there was an error. | No |
| /iLib *"OutFile"* | **Deprecated:** Equivalent to [/validate](#validate); use that instead.<br> *"OutFile"* must be specified but is ignored. In previous versions of AutoHotkey, filenames of auto-included files were written to the file specified by *OutFile*, formatted as #Include directives. | No |
| <a id="SlashInclude"></a>/include *"IncFile"* | [Includes](lib/_Include.md) a file prior to the main script. Only a single file can be included by this method. When the script is [reloaded](lib/Reload.md), this switch is automatically passed to the new instance. | No |
| <a id="SlashScript"></a>/script | When used with a compiled script based on an .exe file, this switch causes the program to ignore the main embedded script. This allows a compiled script .exe to execute external script files or embedded scripts other than the main one. Other switches not normally supported by compiled scripts can be used but must be listed to the right of this switch. For example:<br> <code>CompiledScript.exe /script /ErrorStdOut MyScript.ahk "Script's arg 1"</code> If the current executable file does not have an embedded script, this switch is permitted but has no effect.<br> This switch is not supported by compiled scripts which are based on a .bin file.<br> See also: [Base Executable File (Ahk2Exe)](#ahk2exe-base) | N/A |

<a id="defaultfile"></a>

**Script Filename:** This can be omitted if there are no *Script Parameters*. If omitted, it defaults to the path and name of the [AutoHotkey executable](Variables.md#AhkPath), replacing ".exe" with ".ahk". For example, if you rename AutoHotkey.exe to MyScript.exe, it will attempt to load MyScript.ahk. If you run AutoHotkey32.exe without parameters, it will attempt to load AutoHotkey32.ahk.

<a id="stdin"></a>

Specify an asterisk (\*) for the filename to read the script text from standard input (stdin). This also puts the following into effect:

- The [initial working directory](Variables.md#InitialWorkingDir) is used as [A_ScriptDir](Variables.md#ScriptDir) and to locate the [local Lib folder](#lib).
- [A_ScriptName](Variables.md#ScriptName) and [A_ScriptFullPath](Variables.md#ScriptFullPath) both contain "\*".
- [#SingleInstance](lib/_SingleInstance.md) is off by default.

For an example, see [ExecScript()](lib/Run.md#ExecScript).

If the current executable file has [embedded scripts](Program.md#embedded-scripts), this parameter can be an asterisk followed by the resource name or ID of an embedded script. For compiled scripts (i.e. if an embedded script with the ID #1 exists), this parameter must be preceded by the `/script` switch.

**Script Parameters:** The string(s) you want to pass into the script, with each separated from the next by one or more spaces. Any parameter that contains spaces should be enclosed in quotation marks. If you want to pass an empty string as a parameter, specify two consecutive quotation marks. A literal quotation mark may be passed in by preceding it with a backslash (\"). Consequently, any trailing slash in a quoted parameter (such as "C:\My Documents\") is treated as a literal quotation mark (that is, the script would receive the string C:\My Documents"). To remove such quotes, use `A_Args[1] := StrReplace(A_Args[1], '"')`

<a id="cmd_args"></a>

Incoming parameters, if present, are stored as an array in the built-in variable **A_Args**, and can be accessed using [array syntax](Objects.md#Usage_Simple_Arrays). `A_Args[1]` contains the first parameter. The following example exits the script when too few parameters are passed to it:

```ahk
if A_Args.Length < 3
{
    MsgBox "This script requires at least 3 parameters but it only received " A_Args.Length "."
    ExitApp
}
```

If the number of parameters passed into a script varies (perhaps due to the user dragging and dropping a set of files onto a script), the following example can be used to extract them one by one:

```ahk
for n, param in A_Args  ; For each parameter:
{
    MsgBox "Parameter number " n " is " param "."
}
```

If the parameters are file names, the following example can be used to convert them to their case-corrected long names (as stored in the file system), including complete/absolute path:

```ahk
for n, GivenPath in A_Args  ; For each parameter (or file dropped onto a script):
{
    Loop Files, GivenPath, "FD"  ; Include files and directories.
        LongPath := A_LoopFileFullPath
    MsgBox "The case-corrected long path name of file`n" GivenPath "`nis:`n" LongPath
}
```

<a id="cp"></a>
## Script File Codepage

In order for non-ASCII characters to be read correctly from file, the encoding used when the file was saved (typically by the text editor) must match what AutoHotkey uses when it reads the file. If it does not match, characters will be decoded incorrectly. AutoHotkey uses the following rules to decide which encoding to use:

- If the file begins with a UTF-8 or UTF-16 (LE) byte order mark, the appropriate codepage is used and the [/CP*n*](#CPn) switch is ignored.
- If the [/CP*n*](#CPn) switch is passed on the command-line, codepage *n* is used. For a list of possible values, see [Code Page Identifiers](https://learn.microsoft.com/windows/win32/intl/code-page-identifiers).
- In all other cases, UTF-8 is used (this default differs from AutoHotkey v1).

Note that this applies only to script files loaded by AutoHotkey, not to file I/O within the script itself. [FileEncoding](lib/FileEncoding.md) controls the default encoding of files read or written by the script, while [IniRead](lib/IniRead.md) and [IniWrite](lib/IniWrite.md) always deal in UTF-16 or ANSI.

As all text is converted (where necessary) to the [native string format](Compat.md#Format), characters which are invalid or don't exist in the native codepage are replaced with a placeholder: '�'. This should only occur if there are encoding errors in the script file or the codepages used to save and load the file don't match.

[RegWrite](lib/RegWrite.md) may be used to set the default for scripts launched from Explorer (e.g. by double-clicking a file):

```ahk
; Uncomment the appropriate line below or leave them all commented to
;   reset to the default of the current build.  Modify as necessary:
; codepage := 0        ; System default ANSI codepage
; codepage := 65001    ; UTF-8
; codepage := 1200     ; UTF-16
; codepage := 1252     ; ANSI Latin 1; Western European (Windows)
if (codepage != "")
    codepage := " /CP" . codepage
cmd := Format('"{1}"{2} "%1" %*', A_AhkPath, codepage)
key := "AutoHotkeyScript\Shell\Open\Command"
if A_IsAdmin    ; Set for all users.
    RegWrite cmd, "REG_SZ", "HKCR\" key
else            ; Set for current user only.
    RegWrite cmd, "REG_SZ", "HKCU\Software\Classes\" key
```

This assumes AutoHotkey has already been installed. Results may be less than ideal if it has not.

<a id="debug"></a>
## Debugging a Script

Built-in functions such as [ListVars](lib/ListVars.md) and [Pause](lib/Pause.md) can help you debug a script. For example, the following two lines, when temporarily inserted at carefully chosen positions, create "break points" in the script:

```ahk
ListVars
Pause
```

When the script encounters these two lines, it will display the current contents of all variables for your inspection. When you're ready to resume, un-pause the script via the File or Tray menu. The script will then continue until reaching the next "break point" (if any).

It is generally best to insert these "break points" at positions where the active window does not matter to the script, such as immediately before a WinActivate function. This allows the script to properly resume operation when you un-pause it.

The following functions are also useful for debugging: [ListLines](lib/ListLines.md), [KeyHistory](lib/KeyHistory.md), and [OutputDebug](lib/OutputDebug.md).

Some common errors, such as typos and missing "global" declarations, can be detected by [enabling warnings](lib/_Warn.md).

<a id="idebug"></a>
### Interactive Debugging

Interactive debugging is possible with a supported [DBGp client](AHKL_DBGPClients.md). Typically the following actions are possible:

- Set and remove breakpoints on lines - pause execution when a [breakpoint](https://en.wikipedia.org/wiki/Breakpoint) is reached.
- Step through code line by line - step into, over or out of functions.
- Inspect all variables or a specific variable.
- View the stack of running threads and functions.

Note that this functionality is disabled for compiled scripts which are [based on a BIN file](#ahk2exe-base). For compiled scripts based on an EXE file, /debug must be specified after [/script](#SlashScript).

To enable interactive debugging, first launch a supported debugger client then launch the script with the **/Debug** command-line switch.

```ahk
AutoHotkey.exe /Debug[=SERVER:PORT] ...
```

*SERVER* and *PORT* may be omitted. For example, the following are equivalent:

```
AutoHotkey /Debug "myscript.ahk"
AutoHotkey /Debug=localhost:9000 "myscript.ahk"
```

<a id="debug_attach"></a>

To attach the debugger to a script which is already running, send it a message as shown below:

```ahk
ScriptPath := "" ; SET THIS TO THE FULL PATH OF THE SCRIPT
A_DetectHiddenWindows := true
if WinExist(ScriptPath " ahk_class AutoHotkey")
    ; Optional parameters:
    ;   wParam  = the IPv4 address of the debugger client, as a 32-bit integer.
    ;   lParam  = the port which the debugger client is listening on.
    PostMessage DllCall("RegisterWindowMessage", "Str", "AHK_ATTACH_DEBUGGER")
```

Once the debugger client is connected, it may detach without terminating the script by sending the "detach" DBGp command.

<a id="Script_Showcase"></a>
## Script Showcase

See [this page](scripts/index.md) for some useful scripts.
