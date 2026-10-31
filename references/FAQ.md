# Frequently Asked Questions (FAQ)

<a id="toc"></a>
## Table of Contents

**[General Troubleshooting](#general-troubleshooting)**

- [What can I do if AutoHotkey won't install?](#install)
- [How do I restore the right-click context menu options for .ahk files?](#rightclick)
- [Why doesn't my script work on Windows *xxx* even though it worked on a previous version?](#vista)
- [How do I work around problems caused by User Account Control (UAC)?](#uac)
- [I can't edit my script via tray icon because it won't start due to an error. What should I do?](#DefaultScript)
- [How can I find and fix errors in my code?](#Debug)
- [Why is the Run function unable to launch my game or program?](#run)
- [Why are the non-ASCII characters in my script displaying or sending incorrectly?](#nonascii)
- [Why don't Hotstrings, Send, and Click work in certain games?](#games)
- [How can performance be improved for games or at other times when the CPU is under heavy load?](#perf)
- [My antivirus program flagged AutoHotkey or a compiled script as malware. Is it really a virus?](#Virus)

**[Common Tasks](#common-tasks)**

- [Where can I find the official build, or older releases?](#Download)
- [Can I run AHK from a USB drive?](#USB)
- [How can the output of a command line operation be retrieved?](#output)
- [How can a script close, pause, suspend or reload other script(s)?](#close)
- [How can a repeating action be stopped without exiting the script?](#repeat)
- [How can context sensitive help for AutoHotkey functions be used in any editor?](#help)
- [How to detect when a web page is finished loading?](#load)
- [How can dates and times be compared or manipulated?](#time)
- [How can I send the current Date and/or Time?](#SendDate)
- [How can I send text to a window which isn't active or isn't visible?](#ControlSend)
- [How can Winamp be controlled even when it isn't active?](#winamp)
- [How can MsgBox's button names be changed?](#msgbox)
- [How can I change the default editor, which is accessible via context menu or tray icon?](#DefaultEditor)
- [How can I save the contents of my GUI controls?](#GuiSubmit)
- [Can I draw something with AHK?](#GDIPlus)
- [How can I start an action when a window appears, closes or becomes [in]active?](#WinWaitAction)

**[Hotkeys, Hotstrings, and Remapping](#hotkeys-hotstrings-and-remapping)**

- [How do I put my hotkeys and hotstrings into effect automatically every time I start my PC?](#Startup)
- [I'm having trouble getting my mouse buttons working as hotkeys. Any advice?](#HotMouse)
- [How can Tab and Space be defined as hotkeys?](#HotSymb)
- [How can keys or mouse buttons be remapped so that they become different keys?](#Remap)
- [How do I detect the double press of a key or button?](#DoublePress)
- [How can a hotkey or hotstring be made exclusive to certain program(s)? In other words, I want a certain key to act as it normally does except when a specific window is active.](#HotContext)
- [How can a prefix key be made to perform its native function rather than doing nothing?](#HotPrefix)
- [How can the built-in Windows shortcut keys, such as Win+U (Utility Manager) and Win+R (Run), be changed or disabled?](#HotOverride)
- [Can I use wildcards or regular expressions in Hotstrings?](#HotRegex)
- [How can I use a hotkey that is not in my keyboard layout?](#SpecialKey)
- [My keypad has a special 000 key. Is it possible to turn it into a hotkey?](#HotZero)

## General Troubleshooting

<a id="install"></a>
### What can I do if AutoHotkey won't install?

If AutoHotkey cannot be installed the normal way, see [How to Install AutoHotkey](howto/Install.md) for more help.

<a id="rightclick"></a>
### How do I restore the right-click context menu options for .ahk files?

Normally if AutoHotkey is installed, right-clicking an AutoHotkey script (.ahk) file should give the following options:

- Run script
- Compile script (if Ahk2Exe is installed)
- Edit script
- Run as administrator
- Run with UI access (if the [prerequisites](Program.md#Installer_uiAccess) are met)

> **Note:** On Windows 11, some of these options are usually relegated to a submenu that can be accessed by selecting "Show more options".

Sometimes these options are overridden by settings in the current user's profile, such as if *Open With* has been used to change the default program for opening .ahk files. This can be fixed by deleting the following registry key:

```
HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.ahk\UserChoice
```

This can be done by applying [this registry patch](misc/remove-userchoice.reg) or by running `UX\reset-assoc.ahk` from the AutoHotkey installation directory.

It may also be necessary to repair the default registry values, either by reinstalling AutoHotkey or by running `UX\install.ahk` from the AutoHotkey installation directory.

<a id="vista"></a>
### Why doesn't my script work on Windows *xxx* even though it worked on a previous version?

There are many variations of this problem, such as:

- I've upgraded my computer/Windows and now my script won't work.
- Hotkeys/hotstrings don't work when a program running as admin is active.
- Some windows refuse to be automated (e.g. Device Manager ignores Send).

If you've switched operating systems, it is likely that something else has also changed and may be affecting your script. For instance, if you've got a new computer, it might have different drivers or other software installed. If you've also updated to a newer version of AutoHotkey, find out which version you had before and then check the [changelog](ChangeLog.md) and [compatibility notes](Compat.md).

Also refer to the following question:

<a id="uac"></a>
### How do I work around problems caused by User Account Control (UAC)?

By default, [User Account Control (UAC)](https://en.wikipedia.org/wiki/User_Account_Control) protects "elevated" programs (that is, programs which are running as admin) from being automated by non-elevated programs, since that would allow them to bypass security restrictions. Hotkeys are also blocked, so for instance, a non-elevated program cannot spy on input intended for an elevated program.

UAC may also prevent [SendPlay](lib/SendMode.md#Play) and [BlockInput](lib/BlockInput.md) from working.

Common workarounds are as follows:

- **Recommended:** [Run with UI access](Program.md#Installer_uiAccess). This requires AutoHotkey to be installed under Program Files. There are several ways to do this, including:
    - Right-click the script in Explorer and select *Run with UI access*.
    - Use the *UIAccess* shell verb with Run, as in `Run '*UIAccess "Your script.ahk"'`.
    - Use a [command line](Scripts.md#cmd) such as `"AutoHotkey32_UIA.exe" "Your script.ahk"` (but include full paths where necessary).
    - Set scripts to run with UI access by default, by checking the appropriate box in the [Launch Settings](Program.md#launcher-config) GUI.
- Run the script [as administrator](Variables.md#IsAdmin). Note that this also causes any programs launched by the script to run as administrator, and may require the user to accept an approval prompt when launching the script.
- Disable the local security policy "Run all administrators in Admin Approval Mode" (not recommended).
- Disable UAC completely. This is not recommended, and is not feasible on Windows 8 or later.

<a id="DefaultScript"></a>
### I can't edit my script via tray icon because it won't start due to an error. What should I do?

You need to fix the error in your script before you can get your [tray icon](Program.md#tray-icon) back. This will require locating the script and opening it in an editor by some other means than the tray icon.

If you are running an AutoHotkey executable file directly, the name of the script depends on the executable. For example, if you are running AutoHotkey32.exe, look for AutoHotkey32.ahk in the same directory. Note that depending on your system settings the ".ahk" part may be hidden, but the file should have an icon like ![[H]](static/ahkfile16.png)

You can usually [edit a script file](Program.md#edit) by right clicking it and selecting *Edit Script*. If that doesn't work, you can open the file in Notepad or another editor.

Normally, you should [create a script file](Program.md#create) (something.ahk) anywhere you like, and run that script file instead of running AutoHotkey.

See also [Command Line Parameter "Script Filename"](Scripts.md#defaultfile) and [Portability of AutoHotkey.exe](Program.md#portability).

<a id="Debug"></a>
### How can I find and fix errors in my code?

For simple scripts, see [Debugging a Script](Scripts.md#debug). To show contents of a variable, use [MsgBox](lib/MsgBox.md) or [ToolTip](lib/ToolTip.md). For complex scripts, see [Interactive Debugging](Scripts.md#idebug).

<a id="run"></a>
### Why is the [Run](lib/Run.md) function unable to launch my game or program?

Some programs need to be started in their own directories (when in doubt, it is usually best to do so). For example:

```ahk
Run A_ProgramFiles "\Some Application\App.exe", A_ProgramFiles "\Some Application"
```

If the program you are trying to start is in `A_WinDir "\System32"` and you are using AutoHotkey 32-bit on a 64-bit system, the [File System Redirector](https://learn.microsoft.com/windows/win32/winprog64/file-system-redirector) may be interfering. To work around this, use `A_WinDir "\SysNative"` instead; this is a virtual directory only visible to 32-bit programs running on 64-bit systems.

<a id="nonascii"></a>
### Why are the non-ASCII characters in my script displaying or sending incorrectly?

Short answer: Save the script as UTF-8, preferably with BOM.

Non-ASCII characters are represented by different binary values depending on the chosen encoding. In order for such characters to be interpreted correctly, your text editor and AutoHotkey must be *on the same codepage*, so to speak. AutoHotkey v2 defaults to UTF-8 for all script files, although this can be overridden with the [/CP command line switch](Scripts.md#cp).

It is recommended to save the script as UTF-8 with BOM (byte order mark) to ensure that editors (and maybe other applications) can determine with certainty that the file is indeed UTF-8. Without BOM, the editor has to guess the encoding of the file, which can sometimes be wrong.

To save as UTF-8 in Notepad, select *UTF-8* or *UTF-8 with BOM* from the *Encoding* drop-down in the Save As dialog. Note that Notepad in Windows 10 v1903 and later defaults to *UTF-8* (without BOM).

To read other UTF-8 files which lack a byte order mark (BOM), use `FileEncoding "UTF-8-RAW"`, the `*P65001` option with [FileRead](lib/FileRead.md), or `"UTF-8-RAW"` for the third parameter of [FileOpen](lib/FileOpen.md). The `-RAW` suffix can be omitted, but in that case any newly created files will have a BOM.

Note that INI files accessed with the standard INI functions do not support UTF-8; they must be saved as ANSI or UTF-16.

<a id="games"></a>
### Why don't [Hotstrings](Hotstrings.md), [Send](lib/Send.md), and [Click](lib/Click.md) work in certain games?

Not all games allow AHK to send keys and clicks or receive pixel colors.

But there are some alternatives, try all the solutions mentioned below. If all these fail, it may not be possible for AHK to work with your game. Sometimes games have a hack and cheat prevention measure, such as GameGuard and Hackshield. If they do, there is a high chance that AutoHotkey will not work with that game.

-     Use SendPlay via the [SendPlay](lib/Send.md) function, [SendMode Play](lib/SendMode.md#Play) and/or the [hotstring option SP](Hotstrings.md#SP).

    ```ahk
    SendPlay "abc"
    ```

    ```ahk
    SendMode "Play"
    Send "abc"
    ```

    ```ahk
    :SP:btw::by the way

    ; or

    #Hotstring SP
    ::btw::by the way
    ```

    > **Deprecated:** SendPlay does not tend to work if [User Account Control (UAC)](https://en.wikipedia.org/wiki/User_Account_Control) is enabled, even if the script is running as an administrator. On Windows 11 and later, SendPlay may have no effect at all.
-     Increase [SetKeyDelay](lib/SetKeyDelay.md). For example:

    ```ahk
    SetKeyDelay 0, 50
    SetKeyDelay 0, 50, "Play"
    ```
-     Try [ControlSend](lib/ControlSend.md), which might work in cases where the other Send modes fail:

    ```ahk
    ControlSend "abc",, GameTitle
    ```
-     Try the down and up event of a key with the various send methods:

    ```ahk
    Send "{KEY Down}{KEY Up}"
    ```
-     Try the down and up event of a key with a [Sleep](lib/Sleep.md) between them:

    ```ahk
    Send "{KEY down}"
    Sleep 10 ; Try various milliseconds.
    Send "{KEY up}"
    ```

<a id="perf"></a>
### How can performance be improved for games or at other times when the CPU is under heavy load?

If a script's [Hotkeys](Hotkeys.md), [Clicks](lib/Click.md), or [Sends](lib/Send.md) are noticeably slower than normal while the CPU is under heavy load, raising the script's process-priority may help. To do this, include the following line near the top of the script:

```ahk
ProcessSetPriority "High"
```

<a id="Virus"></a>
### My antivirus program flagged AutoHotkey or a compiled script as malware. Is it really a virus?

Although it is certainly possible that the file has been infected, most often these alerts are *false positives*, meaning that the antivirus program is mistaken. One common suggestion is to upload the file to an online service such as [virustotal](https://www.virustotal.com/) or [Jotti](https://virusscan.jotti.org/) and see what other antivirus programs have to say. If in doubt, you could send the file to the vendor of your antivirus software for confirmation. This might also help us and other AutoHotkey users, as the vendor may confirm it is a false positive and fix their product to play nice with AutoHotkey.

False positives might be more common for compiled scripts which have been compressed, such as with UPX (default for AutoHotkey 1.0 but not 1.1) or MPRESS (optional for AutoHotkey 1.1). As the default AutoHotkey installation does not include a compressor, compiled scripts are not compressed by default.

## Common Tasks

<a id="Download"></a>
### Where can I find the official build, or older releases?

See [download page of AutoHotkey](https://www.autohotkey.com/download/).

<a id="USB"></a>
### Can I run AHK from a USB drive?

See [Portability of AutoHotkey.exe](Program.md#portability).

<a id="output"></a>
### How can the output of a command line operation be retrieved?

Testing shows that due to file caching, a temporary file can be very fast for relatively small outputs. In fact, if the file is deleted immediately after use, it often does not actually get written to disk. For example:

```ahk
RunWait A_ComSpec ' /c dir > C:\My Temp File.txt'
VarToContainContents := FileRead("C:\My Temp File.txt")
FileDelete "C:\My Temp File.txt"
```

To avoid using a temporary file (especially if the output is large), consider using the [Shell.Exec()](lib/Run.md#ExStdOut) method as shown in the examples for the [Run](lib/Run.md) function.

<a id="close"></a>
### How can a script close, pause, suspend or reload other script(s)?

First, here is an example that closes another script:

```ahk
DetectHiddenWindows True  ; Allows a script's hidden main window to be detected.
SetTitleMatchMode 2  ; Avoids the need to specify the full path of the file below.
WinClose "ScriptFileName.ahk - AutoHotkey"  ; Update this to reflect the script's name (case-sensitive).
```

To [suspend](lib/Suspend.md), [pause](lib/Pause.md) or [reload](lib/Reload.md) another script, replace the last line above with one of these:

```ahk
PostMessage 0x0111, 65305,,, "ScriptFileName.ahk - AutoHotkey"  ; Suspend.
PostMessage 0x0111, 65306,,, "ScriptFileName.ahk - AutoHotkey"  ; Pause.
PostMessage 0x0111, 65303,,, "ScriptFileName.ahk - AutoHotkey"  ; Reload.
```

<a id="repeat"></a>
### How can a repeating action be stopped without exiting the script?

To pause or resume the entire script at the press of a key, assign a hotkey to the [Pause](lib/Pause.md) function as in this example:

```ahk
^!p::Pause  ; Press Ctrl+Alt+P to pause. Press it again to resume.
```

To stop an action that is repeating inside a [Loop](lib/Loop.md), consider the following working example, which is a hotkey that both starts and stops its own repeating action. In other words, pressing the hotkey once will start the loop. Pressing the same hotkey again will stop it.

```ahk
#MaxThreadsPerHotkey 3
#z::  ; Win+Z hotkey (change this hotkey to suit your preferences).
{
    static KeepWinZRunning := false
    if KeepWinZRunning  ; This means an underlying thread is already running the loop below.
    {
        KeepWinZRunning := false  ; Signal that thread's loop to stop.
        return  ; End this thread so that the one underneath will resume and see the change made by the line above.
    }
    ; Otherwise:
    KeepWinZRunning := true
    Loop
    {
        ; The next four lines are the action you want to repeat (update them to suit your preferences):
        ToolTip "Press Win-Z again to stop this from flashing."
        Sleep 1000
        ToolTip
        Sleep 1000
        ; But leave the rest below unchanged.
        if not KeepWinZRunning  ; The user signaled the loop to stop by pressing Win-Z again.
            break  ; Break out of this loop.
    }
    KeepWinZRunning := false  ; Reset in preparation for the next press of this hotkey.
}
#MaxThreadsPerHotkey 1
```

<a id="help"></a>
### How can context sensitive help for AutoHotkey functions be used in any editor?

Rajat created [this script](scripts/index.md#ContextSensitiveHelp).

<a id="load"></a>
### How to detect when a web page is finished loading?

With Internet Explorer, perhaps the most reliable method is to use DllCall and COM as demonstrated at [this archived forum thread](https://www.autohotkey.com/board/topic/17715-). On a related note, the contents of the address bar and status bar can be retrieved as demonstrated at [this archived forum thread](https://www.autohotkey.com/board/topic/17714-).

**Older, less reliable method:** The technique in the following example will work with MS Internet Explorer for most pages. A similar technique might work in other browsers:

```ahk
Run "www.yahoo.com"
MouseMove 0, 0  ; Prevents the status bar from showing a mouse-hover link instead of "Done".
WinWait "Yahoo! - "
WinActivate
if StatusBarWait("Done", 30)
    MsgBox "The page is done loading."
else
    MsgBox "The wait timed out or the window was closed."
```

<a id="time"></a>
### How can dates and times be compared or manipulated?

The [DateAdd](lib/DateAdd.md) function can add or subtract a quantity of days, hours, minutes, or seconds to a time-string that is in the [YYYYMMDDHH24MISS](lib/FileSetTime.md#YYYYMMDD) format. The following example subtracts 7 days from the specified time:

```ahk
Result := DateAdd(VarContainingTimestamp, -7, "days")
```

To determine the amount of time between two dates or times, see [DateDiff](lib/DateDiff.md), which gives an example. Also, the built-in variable [A_Now](Variables.md#Now) contains the current local time. Finally, there are several built-in [date/time variables](Variables.md#date), as well as the [FormatTime](lib/FormatTime.md) function to create a custom date/time string.

<a id="SendDate"></a>
### How can I send the current Date and/or Time?

Use [FormatTime](lib/FormatTime.md) or [built-in variables for date and time](Variables.md#date).

<a id="ControlSend"></a>
### How can I send text to a window which isn't active or isn't visible?

Use [ControlSend](lib/ControlSend.md).

<a id="winamp"></a>
### How can Winamp be controlled even when it isn't active?

See [Automating Winamp](misc/Winamp.md).

<a id="msgbox"></a>
### How can [MsgBox](lib/MsgBox.md)'s button names be changed?

Here is an [example](scripts/index.md#MsgBoxButtonNames).

<a id="DefaultEditor"></a>
### How can I change the default editor, which is accessible via context menu or tray icon?

In the example section of [Edit](lib/Edit.md) you will find a script that allows you to change the default editor.

<a id="GuiSubmit"></a>
### How can I save the contents of my GUI controls?

Use [Gui.Submit](lib/Gui.md#Submit). For Example:

```ahk
MyGui := Gui()
MyGui.Add("Text",, "Enter some Text and press Submit:")
MyGui.Add("Edit", "vMyEdit")
MyGui.Add("Button",, "Submit").OnEvent("Click", Submit)
MyGui.Show()

Submit(*)
{
    Saved := MyGui.Submit(false)
    MsgBox "Content of the edit control: " Saved.MyEdit
}
```

<a id="GDIPlus"></a>
### Can I draw something with AHK?

See [GDI+ standard library](https://www.autohotkey.com/boards/viewtopic.php?t=6517) by tic. It's also possible with some rudimentary methods using Gui, but in a limited way.

<a id="WinWaitAction"></a>
### How can I start an action when a window appears, closes or becomes [in]active?

Use [WinWait](lib/WinWait.md), [WinWaitClose](lib/WinWaitClose.md) or [WinWait[Not]Active](lib/WinWaitActive.md).

There are also user-created solutions such as [OnWin.ahk](https://www.autohotkey.com/boards/viewtopic.php?f=6&t=6463) and [[How to] Hook on to Shell to receive its messages](https://www.autohotkey.com/board/topic/80644-how-to-hook-on-to-shell-to-receive-its-messages/) on the archived forum.

## Hotkeys, Hotstrings, and Remapping

<a id="Startup"></a>
### How do I put my hotkeys and hotstrings into effect automatically every time I start my PC?

There are several ways to make a script (or any program) launch automatically every time you start your PC. The easiest is to place a shortcut to the script in the Startup folder:

1. Find the script file, select it, and press `Ctrl`+`C`.
2. Press `Win`+`R` to open the Run dialog, then enter `shell:startup` and click OK or `Enter`. This will open the Startup folder for the current user. To instead open the folder for all users, enter `shell:common startup` (however, in that case you must be an administrator to proceed).
3. Right click inside the window, and click "Paste Shortcut". The shortcut to the script should now be in the Startup folder.

<a id="HotMouse"></a>
### I'm having trouble getting my mouse buttons working as hotkeys. Any advice?

The left and right mouse buttons should be assignable normally (for example, `#LButton::` is the `Win`+LeftButton hotkey). Similarly, the middle button and the turning of the [mouse wheel](KeyList.md) should be assignable normally except on mice whose drivers directly control those buttons.

The fourth button (XButton1) and the fifth button (XButton2) might be assignable if your mouse driver allows their clicks to be [seen](lib/KeyHistory.md) by the system. If they cannot be seen -- or if your mouse has more than five buttons that you want to use -- you can try configuring the software that came with the mouse (sometimes accessible in the Control Panel or Start Menu) to send a keystroke whenever you press one of these buttons. Such a keystroke can then be defined as a hotkey in a script. For example, if you configure the fourth button to send `Ctrl`+`F1`, you can then indirectly configure that button as a hotkey by using `^F1::` in a script.

If you have a five-button mouse whose fourth and fifth buttons cannot be [seen](lib/KeyHistory.md), you can try changing your mouse driver to the default driver included with the OS. This assumes there is such a driver for your particular mouse and that you can live without the features provided by your mouse's custom software.

<a id="HotSymb"></a>
### How can Tab and Space be defined as hotkeys?

Use the names of the keys (Tab and Space) rather than their characters. For example, `#Space` is `Win`+`Space` and `^!Tab` is `Ctrl`+`Alt`+`Tab`.

<a id="Remap"></a>
### How can keys or mouse buttons be remapped so that they become different keys?

This is described on the [remapping](misc/Remap.md) page.

<a id="DoublePress"></a>
### How do I detect the double press of a key or button?

Use [built-in variables for hotkeys](Variables.md#h) as follows:

```ahk
~Ctrl::
{
    if (ThisHotkey = A_PriorHotkey && A_TimeSincePriorHotkey < 200)
        MsgBox "double-press"
}
```

<a id="HotContext"></a>
### How can a [hotkey](Hotkeys.md) or [hotstring](Hotstrings.md) be made exclusive to certain program(s)? In other words, I want a certain key to act as it normally does except when a specific window is active.

The preferred method is [#HotIf](lib/_HotIf.md). For example:

```ahk
#HotIf WinActive("ahk_class Notepad")
^a::MsgBox "You pressed Control-A while Notepad is active."
```

<a id="HotPrefix"></a>
### How can a prefix key be made to perform its native function rather than doing nothing?

Consider the following example, which makes Numpad0 into a prefix key:

```ahk
Numpad0 & Numpad1::MsgBox "You pressed Numpad1 while holding down Numpad0."
```

Now, to make Numpad0 send a real Numpad0 keystroke whenever it wasn't used to launch a hotkey such as the above, add the following hotkey:

```ahk
$Numpad0::Send "{Numpad0}"
```

The $ prefix is needed to prevent a warning dialog about an infinite loop (since the hotkey "sends itself"). In addition, the above action occurs at the time the key is **released**.

<a id="HotOverride"></a>
### How can the built-in Windows shortcut keys, such as Win+U (Utility Manager) and Win+R (Run), be changed or disabled?

Here are some [examples](misc/Override.md).

<a id="HotRegex"></a>
### Can I use wildcards or regular expressions in Hotstrings?

Use the [script](https://github.com/polyethene/AutoHotkey-Scripts/blob/master/Hotstrings.ahk) by polyethene (examples are included).

<a id="SpecialKey"></a>
### How can I use a hotkey that is not in my keyboard layout?

See [Special Keys](KeyList.md#SpecialKeys).

<a id="HotZero"></a>
### My keypad has a special 000 key. Is it possible to turn it into a hotkey?

You can. This [example script](scripts/index.md#Numpad000) makes `000` into an equals key. You can change the action by replacing the `Send "="` line with line(s) of your choice.
