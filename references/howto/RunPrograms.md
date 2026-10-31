# How to Run Programs

One of the easiest and most useful things AutoHotkey can do is allow you to create keyboard shortcuts (hotkeys) that launch programs.

Programs are launched by calling the [Run](../lib/Run.md) function, [passing](../Concepts.md#pass-parameters) the command line of the program as a [parameter](../Concepts.md#parameters):

```ahk
Run "C:\Windows\notepad.exe"
```

This example launches Notepad. To learn how to try it out, refer to [How to Run Example Code](RunExamples.md).

At this stage, we haven't defined a hotkey (in other words, assigned a keyboard shortcut), so the instructions are carried out immediately. In this case, the script has nothing else to do, so it automatically exits. If you prefer to make useful hotkeys while learning, check out [How to Write Hotkeys](WriteHotkeys.md) first.

> **Note:** Run can also be used to open documents, folders and URLs.

To launch other programs, simply replace the path in the example above with the path of the program you wish to launch. Some programs have their paths registered with the system, in which case you can get away with just passing the filename of the program, with or (sometimes) without the ".exe" extension. For example:

```ahk
Run "notepad"
```

<a id="Command-line_Parameters"></a>
## Command-line Parameters

If the program accepts command-line parameters, they can be passed as part of the [Run](../lib/Run.md) function's first parameter. The following example should open license.txt in Notepad:

```ahk
Run "notepad C:\Program Files\AutoHotkey\license.txt"
```

> **Note:** This example assumes AutoHotkey is installed in the default location, and will show an error otherwise.

Simple, right? Now suppose that we want to open the file in the Microsoft browser instead of Notepad.

```ahk
Run "iexplore C:\Program Files\AutoHotkey\license.txt"
```

Run this code and see what you can learn from the result.

Okay, so the new code doesn't work. Hopefully you didn't dismiss the error dialog immediately; error dialogs are a normal part of the process of coding, and often contain very useful information. This one should tell us a few things:

- Firstly, the obvious: the program couldn't be launched.
- The dialog shows "Action" and "Params", but our whole command line is shown next to "Action", and "Params" is empty. In other words, the Run function doesn't know where the program name ends and the parameters begin.
- "The system cannot find the file specified" (on English-language systems). Perhaps the system couldn't find "iexplore", but what it's really saying is that there is no such file as "iexplore C:\\...".

But why did Notepad work? Running either "notepad" or "iexplore" on its own works, but for different reasons. Unlike notepad.exe, iexplore.exe cannot be found by checking each directory listed in the PATH environment variable. It can be located by a different method, which requires the Run function to separate the program name and parameters.

So in this case, the Run function needs a bit of help, in any or all of the following forms:

- Explicitly use the ".exe" extension.
- Explicitly use the full path of iexplore.exe.
- Enclose the program name in quotation marks.

Go with the easiest option:

```ahk
Run "iexplore.exe C:\Program Files\AutoHotkey\license.txt"
```

The Microsoft browser now launches successfully and displays the file.

However, some programs still fail to open a path containing spaces. For example, the following code would report that "C:\Program.png" was not found:

```ahk
Run "mspaint C:\Program Files\AutoHotkey\UX\inc\spy.ico"
```

See the next section on how to handle this.

<a id="Quote_Marks_and_Spaces"></a>
## Quote Marks and Spaces

Often when passing command-line parameters to a program, it is necessary to enclose each parameter in quote marks if the parameter contains a space. This wasn't necessary with "notepad" or "iexplore", but those are exceptions to the general rule. A naive attempt at a solution might be to simply add more quote marks:

```ahk
Run "mspaint "C:\Program Files\AutoHotkey\UX\inc\spy.ico""
```

But this won't work, because by default, quote marks are used to denote the start and end of literal text. So how do we include a literal quote mark within the command line, rather than having it end the command line?

**Method 1:** Precede each literal quote mark with `` ` `` (back-tick, back-quote or grave accent). This is known as an [escape sequence](../misc/EscapeChar.md). The quote mark is then included in the command line (i.e. the string that is passed to the Run function), whereas the back-tick, having fulfilled its purpose, is left out.

```ahk
Run "mspaint `"C:\Program Files\AutoHotkey\UX\inc\spy.ico`""
```

**Method 2:** Enclose the command line in single quotes instead of double quotes.

```ahk
Run 'mspaint "C:\Program Files\AutoHotkey\UX\inc\spy.ico"'
```

Of course, in that case any *literal* single quotes (or apostrophes) in the text would need to be escaped (`` `' ``).

How you write the code affects which quote marks actually make it through to the Run function. In the two examples above, the Run function receives the string `mspaint "C:\Program Files\AutoHotkey\UX\inc\spy.ico"`. The Run function either splits this into a *program name* and *parameters* (everything else) or leaves that up to the system. In either case, how the remaining quote marks are interpreted depends entirely on the target program.

Many programs treat a quote mark as part of the parameter if it is preceded by a backslash. For example, `Run 'my.exe "A\" B'` might produce a parameter with the value `A" B` instead of two parameters. This is up to the program, and can usually be avoided by doubling the backslash, as in `Run 'my.exe "A\\" B'`, which usually produces two parameters (`A\` and `B`).

Most programs interpret quote marks as a sort of toggle, switching modes between "space ends the parameter" and "space is included in the parameter". In other words, `Run 'my.exe "A B"'` is generally equivalent to `Run 'my.exe A" "B'`. So another way to avoid issues with slashes is to quote the *spaces* instead of the entire parameter, or end the quote before the slash, as in `Run 'my.exe "A"\ B'`.

<a id="Including_Variables"></a>
## Including Variables

Often a command line needs to include some [variables](../Concepts.md#variables). For example, the location of the "Program Files" directory can vary between systems, and a script can take this into account by using the [A_ProgramFiles](../Variables.md#ProgramFiles) variable. If the variable contains the entire command line, simply pass the variable to the Run function to execute it.

```ahk
Run A_ComSpec  ; Start a command prompt (almost always cmd.exe).
Run A_MyDocuments  ; Open the user's Documents folder.
```

Including a variable *inside* a quoted string won't work; instead, we use [concatenation](../Variables.md#concat) to join literal strings together with variables. For example:

```ahk
Run 'notepad.exe "' A_MyDocuments '\AutoHotkey.ahk"'
```

Another method is to use [Format](../lib/Format.md) to perform substitution. For example:

```ahk
Run Format('notepad.exe "{1}\AutoHotkey.ahk"', A_MyDocuments)
```

> **Note:** Format can perform additional formatting at the same time, such as padding with 0s or spaces, or formatting numbers as hexadecimal instead of decimal.

<a id="Runs_Parameters"></a>
## Run's Parameters

Aside from the command line to execute, the Run function accepts a few other [parameters](../Concepts.md#parameters) that affect its behavior.

*WorkingDir* specifies the working directory for the new process. If you specify a relative path for the program, it is relative to this directory. Relative paths in command line parameters are often also relative to this directory, but that depends on the program.

```ahk
Run "cmd", "C:\"  ; Open a command prompt at C:\
```

*Options* can often be used to run a program minimized or hidden, instead of having it pop up on screen, but some programs ignore it.

*OutputVarPID* gives you the process ID, which is often used with [WinWait](../lib/WinWait.md) or [WinWaitActive](../lib/WinWaitActive.md) and [ahk_pid](../misc/WinTitle.md#ahk_pid) to wait until the program shows a window on screen, or to identify one of its windows. For example:

```ahk
Run "mspaint",,, &pid
WinWaitActive "ahk_pid " pid
Send "^e"  ; Ctrl+E opens the Image Properties dialog.
```

<a id="System_Verbs"></a>
## System Verbs

[System verbs](../lib/Run.md#verbs) are actions that the system or applications register for specific file types. They are normally available in the file's right-click menu in Explorer, but their actual names don't always match the text displayed in the menu. For example, AutoHotkey scripts have an "edit" verb which opens the script in an editor, and (if Ahk2Exe is installed) a "compile" verb which [compiles](../Scripts.md#ahk2exe) the script.

"Edit" is one of a list of common verbs that Run recognizes by default, so can be used by just writing the word followed by a space and the filename, as follows:

```ahk
Run 'edit ' A_ScriptFullPath  ; Generally equivalent to Edit
```

Any verb registered with the system can be executed by using the \* prefix as shown below:

```ahk
Run '*Compile-Gui ' A_ScriptFullPath
```

If Ahk2Exe is installed, this opens the Ahk2Exe Gui with the current script pre-selected.

<a id="Environment"></a>
## Environment

Whenever a new process starts, it generally inherits the *environment* of the process which launched it (the *parent process*). This basically means that all of the script's [environment variables](../Concepts.md#environment-variables) are inherited by any program that you launch with [Run](../lib/Run.md).

In some cases, environment variables can be set with [EnvSet](../lib/EnvSet.md) before launching the program to affect its behavior, or pass information to it. A script can also use [EnvGet](../lib/EnvGet.md) to read environment variables that it might have inherited from its parent process.

On 64-bit systems, the script's own environment heavily depends on whether the EXE running it is 32-bit or 64-bit. 32-bit processes not only have different environment variables, but also have [file system redirection](https://learn.microsoft.com/windows/win32/winprog64/file-system-redirector) in place for compatibility reasons.

```ahk
Run "cmd /k set pro"
```

The example above shows a command prompt which prints all environment variables beginning with "pro". If you run it from a 32-bit script, you will likely see `PROCESSOR_ARCHITECTURE=x86` and `ProgramFiles=C:\Program Files (x86)`. Although the title shows something like "C:\Windows\System32\cmd.exe", this is a lie; it is actually the 32-bit version, which really resides in "C:\Windows\SysWow64\cmd.exe".

In simple cases like this, the easiest way to bypass the redirection of "System32" is to use "SysNative" instead. However, this only works from a 32-bit process on a 64-bit system, so must be done conditionally. When the following example is executed on a 64-bit system, it shows a 64-bit command prompt even if the script is 32-bit:

```ahk
if FileExist(A_WinDir "\SysNative")
    Run A_WinDir "\SysNative\cmd.exe /k set pro"
else
    Run "cmd /k set pro"
```
