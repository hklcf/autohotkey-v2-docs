# How to Run Example Code

The easiest way to get started quickly with AutoHotkey is to take example code, try it out and adapt it to your needs.

Within this documentation, there are many examples in code blocks such as the one below.

```ahk
MsgBox "Hello, world!"
```

Most (but not all) examples can be executed as-is to demonstrate their effect. There are generally two ways to do this:

1. **Download the code as a file.** If your browser supports it, you can download any code block (such as the one above) as a script file by clicking the ↓ button which appears in the top-right of the code block when you hover your mouse over it.
2. **Copy the code into a file.** It's usually best to [create a new file](../Program.md#create), so existing code won't interfere with the example code. Once the file has been created, [open it for editing](../Program.md#edit) and copy-paste the code.

**Run the file:** Once you have the code in a script (.ahk) file, running it is usually just a case of double-clicking the file; but there are [other methods](../Program.md#run).

<a id="hotkeys"></a>
## Assigning Hotkeys

Sometimes testing code is easier if you assign it to a hotkey first. For example, consider this code for maximizing the active window:

```ahk
WinMaximize "A"
```

If you save this into a file and run the file by double-clicking it, it will likely maximize the File Explorer window which contains the file. You can instead assign it to a hotkey to test its effect on whatever window you want. For example:

```ahk
^1::WinMaximize "A"
```

Now you can activate your *test subject* and press `Ctrl`+`1` to maximize it.

For more about hotkeys, see [How to Write Hotkeys](WriteHotkeys.md).

## Bailing Out

If you make a mistake in a script, sometimes it can make the computer harder to use. For example, the hotkey `n::` would activate whenever you press `N` and would prevent you from typing that character. To undo this, all you need to do is exit the script. You can do that by right clicking on the script's [tray icon](../Program.md#tray-icon) and selecting Exit.

Keys can get "stuck down" if you send a key-down and don't send a key-up. In that case, exiting the script won't necessarily be enough, as the operating system still thinks the key is being held down. Generally you can "unstick" the key by physically pressing it.

If a script gets into a runaway loop or is otherwise difficult to stop, you can log off or shut down the computer as a last resort. When you log off, all apps running under your session are terminated, including AutoHotkey. In some cases you might need to click "log off anyway" or "shut down anyway" if a script or program is preventing shutdown.

## Reloading

After you've started the script, changes to the script's file do not take effect automatically. In order to make them take effect, you must reload the script. This can be done via the script's [tray icon](../Program.md#tray-icon) or the [Reload](../lib/Reload.md) function, which you can call from a hotkey. In many cases it can also be done by simply running the script again, but that depends on the script's [#SingleInstance](../lib/_SingleInstance.md) setting.

<a id="tools"></a>
## The Right Tools

Learning to code is often a repetitious process; take some code, make a small change, test the code, rinse and repeat. This process is quicker and more productive if you use a [text editor with support for AutoHotkey](../misc/Editors.md). Support varies between editors, but the most important features are (in my opinion):

- The ability to run the script with a keyboard shortcut (such as F5).
- Syntax highlighting to make the code easier to read (and write).

For recommendations, try [Editors with AutoHotkey Support](../misc/Editors.md) or the [Editors subforum](https://www.autohotkey.com/boards/viewforum.php?f=60).
