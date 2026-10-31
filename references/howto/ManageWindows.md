# How to Manage Windows

One of the easiest and most useful things AutoHotkey can do is allow you to create keyboard shortcuts (hotkeys) that manipulate windows. A script can activate, close, minimize, maximize, restore, hide, show or move almost any window. This is done by calling the appropriate [Win function](../lib/Win.md), specifying the window by title or some other criteria:

```ahk
Run "notepad.exe"
WinWait "Untitled - Notepad"
WinActivate "Untitled - Notepad"
WinMove 0, 0, A_ScreenWidth/4, A_ScreenHeight/2, "Untitled - Notepad"
```

This example should open a new Notepad window and then move it to fill a portion of the primary screen (¼ of its width and ½ its height). To learn how to try it out, refer to [How to Run Example Code](RunExamples.md).

We won't go into detail about many of the functions for manipulating windows, since there's not much to it. For instance, to minimize a window instead of activating it, replace `WinActivate` with `WinMinimize`. See [Win functions](../lib/Win.md) for a list of functions which can manipulate windows or retrieve information.

Most of this tutorial is about ways to *identify* which window you want to operate on, since that is often the most troublesome part. For instance, there are a number of problems with the example above:

- The title is repeated unnecessarily.
- The title is correct only for systems with UI language set to English.
- It might move an existing untitled Notepad window instead of the new one.
- If for some reason no matching window appears, the script will stall indefinitely.

We'll address these issues one at a time, after covering a few basics.

> **Tip:** AutoHotkey comes with a script called [Window Spy](../Program.md#Window_Spy), which can be used to confirm the title, class and process name of a window. The class and process name are often used when identifying a window by title alone is not feasible. You can find Window Spy in the script's [tray menu](../Program.md#tray-icon) or the [AutoHotkey Dash](../Program.md#dash).

<a id="ttm"></a>
## Title Matching

There are a few things to know when specifying a window by title:

- Window titles are always case-sensitive, except when using the RegEx matching mode with the [i) modifier](../misc/RegEx-QuickRef.md#opt_i).
- By default, functions expect a substring of the window title. For example, "Notepad" could match both "Untitled - Notepad" and "C:\A\B.ahk - Notepad++". [SetTitleMatchMode](../lib/SetTitleMatchMode.md) can be used to make functions expect a prefix, exact match, or RegEx pattern instead.
- By default, hidden windows are ignored (except by [WinShow](../lib/WinShow.md)). [DetectHiddenWindows](../lib/DetectHiddenWindows.md) can be used to change this.

See [Matching Behavior](../misc/WinTitle.md#Matching) for more details.

<a id="A"></a>
## Active Window

To refer to the active window, use the letter "A" in place of a window title. For example, this minimizes the active window:

```ahk
WinMinimize "A"
```

<a id="lfw"></a>
## Last Found Window

When [WinWait](../lib/WinWait.md), [WinExist](../lib/WinExist.md), [WinActive](../lib/WinActive.md), [WinWaitActive](../lib/WinWaitActive.md) or [WinWaitNotActive](../lib/WinWaitActive.md) find a matching window, they set it as the [*last found window*](../misc/WinTitle.md#LastFoundWindow). Most window functions allow the window title (and related parameters) to be omitted, and will in that case default to the last found window. For example:

```ahk
Run "notepad.exe"
WinWait "Untitled - Notepad"
WinActivate
WinMove 0, 0, A_ScreenWidth/4, A_ScreenHeight/2
```

This saves repeating the window title, which saves a little of your time, makes the script easier to update if the window title needs to be changed, and might make the code easier to read. It makes the script more reliable by ensuring that it operates on the same window each time, even when there are multiple matching windows, or if the window title changes after the window is "found". It also makes the script execute more efficiently, but not by much.

<a id="class"></a>
## Window Class

A window class is a set of attributes that is used as a template to create a window. Often the name of a window's class is related to the app or the purpose of the window. A window's class never changes while the window exists, so we can often use it to identify a window when identifying by title is impractical or impossible.

For example, instead of the window title "Untitled - Notepad", we can use the window's class, which in this case happens to be "Notepad" *regardless* of the system language:

```ahk
Run "notepad.exe"
WinWait "ahk_class Notepad"
WinActivate
WinMove 0, 0, A_ScreenWidth/4, A_ScreenHeight/2
```

A window class is distinguished from a title by using the word "ahk_class" as shown above. To combine multiple criteria, list the window title first. For example: `"Untitled ahk_class Notepad"`.

**Related:** [ahk_class](../misc/WinTitle.md#ahk_class)

<a id="exe"></a>
## Process Name/Path

Windows can be identified by the process which created them by using the word "ahk_exe" followed by the name or path of the process. For example:

```ahk
Run "notepad.exe"
WinWait "ahk_exe notepad.exe"
WinActivate
WinMove 0, 0, A_ScreenWidth/4, A_ScreenHeight/2
```

**Related:** [ahk_exe](../misc/WinTitle.md#ahk_exe)

<a id="pid"></a>
## Process ID (PID)

Each process has an ID number which remains unique until the process exits. We can use this to make our Notepad example more reliable by ensuring that it ignores any Notepad window except the one that is created by the new process:

```ahk
Run "notepad.exe",,, &notepad_pid
WinWait "ahk_pid " notepad_pid
WinActivate
WinMove 0, 0, A_ScreenWidth/4, A_ScreenHeight/2
```

We need three commas in a row; two of them are just to skip the unused *WorkingDir* and *Options* parameters of the Run function, since the one we want (*OutputVarPID*) is the fourth parameter.

Ampersand (&) is the [reference operator](../Variables.md#ref). This is used to pass the `notepad_pid` variable to the Run function *by reference* (in other words, to pass the variable itself instead of its value), allowing the function to assign a new value to the variable. Then `notepad_pid` becomes a placeholder for the actual process ID.

The [string](../Concepts.md#strings) "ahk_pid " is [concatenated](../Variables.md#concat) with the process ID contained by the notepad_pid variable by simply writing them in sequence, separated by whitespace. The result is a string like "ahk_pid 1040", but the number isn't predictable.

If the new process might create multiple windows, a window title and other criteria can be combined by delimiting them with spaces. The window title must always come first. For example: `"Untitled ahk_class Notepad ahk_pid " notepad_pid`.

**Related:** [ahk_pid](../misc/WinTitle.md#ahk_pid)

<a id="hwnd"></a>
## Window ID (HWND)

Each window has an ID number which remains unique until the window is destroyed. In programming parlance, this is known as a "window handle" or HWND. Although not as convenient as using the *last found window*, the window's ID can be stored in a variable so that the script can refer to it by a name of your choice, even if the title changes. There can be only one *last found window* at a time, but you can use as many window IDs as you can make up variable names for (or you can use an [array](../lib/Array.md)).

A window ID is [returned](../Concepts.md#return-a-value) by [WinWait](../lib/WinWait.md), [WinExist](../lib/WinExist.md) or [WinActive](../lib/WinActive.md), or can come from some other sources. The Notepad example can be rewritten to take advantage of this:

```ahk
Run "notepad.exe"
notepad_id := WinWait("Untitled - Notepad")
WinActivate notepad_id
WinMove 0, 0, A_ScreenWidth/4, A_ScreenHeight/2, notepad_id
```

This assigns the return value of WinWait to the variable "notepad_id". In other words, when WinWait finds the window, it produces the window's ID as its result, and the script then stores this result in the variable. "notepad_id" is just a name that I've made up for this example; you can use whatever variable names make sense to you (within [certain constraints](../Concepts.md#names)).

Notice that I added parentheses around the window title, *immediately* following the function name. Parentheses can be omitted in [function call statements](../Language.md#function-call-statements) (that is, function calls at the very beginning of the line), but in that case you cannot get the function's return value.

The script can also retain the [variable](../Concepts.md#variables) `notepad_id` for later use, such as to close or reactivate the window or move it somewhere else.

**Related:** [ahk_id](../misc/WinTitle.md#ahk_id)

## Timeout

By default, WinWait will wait indefinitely for a matching window to appear. You can determine whether this has happened by opening the script's [main window](../Program.md#main-window) via the [tray icon](../Program.md#tray-icon) (unless you've [disabled it](../lib/_NoTrayIcon.md)). The window normally opens on [ListLines](../lib/ListLines.md#Remarks) view by default. If WinWait is still waiting, it will appear at the very bottom of the list of lines, followed by the number of seconds since it began waiting. The number doesn't update unless you select "Refresh" from the View menu.

Try running this example and opening the main window as described above:

```ahk
WinWait "Untitled - Notpad"  ; (intentional typo)
```

If the script is stuck waiting for a window, you will usually need to exit or reload the script to get it unstuck. To prevent that from happening in the first place (or happening again), you can use the *Timeout* parameter of WinWait. For example, this will wait at most 5 seconds for the window to appear:

```ahk
Run "notepad.exe",,, &notepad_pid
if WinWait("ahk_pid " notepad_pid,, 5)
{
    WinActivate
    WinMove 0, 0, A_ScreenWidth/4, A_ScreenHeight/2
}
```

The [block](../lib/Block.md) below the if statement is executed only if WinWait finds a matching window. If it times out, the block is skipped and execution continues after the closing brace (if there is any code after it).

Note that the parentheses after "WinWait" are required when we want to use the function's result in an [expression](../Language.md#expressions) (such as the condition of an [if statement](../lib/If.md)). You can think of the [function call](../Language.md#function-calls) itself as a substitute for the result of the function. For instance, if WinWait finds a match before timing out, the result is non-zero. `if 1` would execute the block below the if statement, whereas `if 0` would skip it.

Another way to write it is to return early (in other words, abort) if the wait times out. For example:

```ahk
Run "notepad.exe",,, &notepad_pid
if !WinWait("ahk_pid " notepad_pid,, 5)
    return
WinActivate
WinMove 0, 0, A_ScreenWidth/4, A_ScreenHeight/2
```

The result is inverted by applying the [logical-not](../Variables.md#unary) operator (`!` or `not`). If WinWait times out, its result is 0. The result of `!0` is 1, so when WinWait times out, the if statement executes the `return`.

WinWait's result is actually the ID of the window (as described above) or zero if it timed out. If you also want to refer to the window by ID, you can assign the result to a variable instead of using it directly in the if statement:

```ahk
Run "notepad.exe",,, &notepad_pid
notepad_id := WinWait("ahk_pid " notepad_pid,, 5)
if notepad_id
{
    WinActivate notepad_id
    WinMove 0, 0, A_ScreenWidth/4, A_ScreenHeight/2, notepad_id
}
```

To avoid repeating the variable name, you can both assign the result to a variable and check that it is non-zero ([*true*](../Concepts.md#boolean)) at the same time:

```ahk
Run "notepad.exe",,, &notepad_pid
if notepad_id := WinWait("ahk_pid " notepad_pid,, 2)
{
    WinActivate notepad_id
    WinMove 0, 0, A_ScreenWidth/4, A_ScreenHeight/2, notepad_id
}
```

In that case, be careful not to confuse `:=` (assignment) with `=` or `==` (comparison). For example, `if myvar := 0` assigns a new value and gives the same result every time (false), whereas `if myvar = 0` compares a previously-assigned value with 0.

<a id="math"></a>
## Expressions (Math etc.)

When you want to move a window, it is often useful to move or size it relative to its previous position or size, which can be retrieved by using the [WinGetPos](../lib/WinGetPos.md) function. For example, the following set of hotkeys can be used to move the active window by 10 pixels in each direction, by holding `RCtrl` and pressing the arrow keys:

```ahk
>^Left::    MoveActiveWindowBy(-10,   0)
>^Right::   MoveActiveWindowBy(+10,   0)
>^Up::      MoveActiveWindowBy(  0, -10)
>^Down::    MoveActiveWindowBy(  0, +10)

MoveActiveWindowBy(x, y) {
    WinExist "A"  ; Make the active window the Last Found Window
    WinGetPos &current_x, &current_y
    WinMove current_x + x, current_y + y
}
```

The example [defines a function](../Functions.md#intro) to avoid repeating code several times. `x` and `y` become placeholders for the two numbers specified in each hotkey. WinGetPos stores the current position in `current_x` and `current_y`, which we then add to `x` and `y`.

Simple expressions such as this should look fairly familiar. For more details, see [Expressions](../Variables.md#Expressions); but be aware there is a lot of detail that you probably won't need to learn immediately.
