# AutoHotkey Beginner Tutorial by tidbit

<a id="s0"></a>
## Table of Contents

1. [The Basics](#s1)
    1. [Downloading and installing AutoHotkey](#s11)
    2. [How to create a script](#s12)
    3. [How to find the help file on your computer](#s14)
2. [Hotkeys & Hotstrings](#s2)
    1. [Keys and their mysterious symbols](#s21)
    2. [Window specific hotkeys/hotstrings](#s22)
    3. [Multiple hotkeys/hotstrings per file](#s23)
    4. [Examples](#s24)
3. [Sending Keystrokes](#s3)
    1. [Games](#s31)
4. [Running Programs & Websites](#s4)
5. [Function Calls with or without Parentheses](#s5)
    1. [Code blocks](#s51)
6. [Variables](#s6)
    1. [Getting user input](#s62)
    2. [Other Examples?](#s63)
7. [Objects](#s7)
    1. [Creating Objects](#s71)
    2. [Using Objects](#s72)
8. [Other Helpful Goodies](#s8)
    1. [The mysterious square brackets](#s81)
    2. [Finding your AHK version](#s82)
    3. [Trial and Error](#s83)
    4. [Indentation](#s84)
    5. [Asking for Help](#s85)
    6. [Other links](#s86)

<a id="s1"></a>
## 1 - The Basics

> Before we begin our journey, let me give some advice. Throughout this tutorial you will see a lot of text and a lot of code. For optimal learning power, it is advised that you read the text and <u>try</u> the code. Then, study the code. You can copy and paste most examples on this page. If you get confused, try reading the section again.

<a id="s11"></a>
### a. Downloading and installing AutoHotkey

<a id="local_note"></a>

> Since you're viewing this documentation locally, you've probably already installed AutoHotkey and can skip to section b.

Before learning to use AutoHotkey (AHK), you will need to download it. After downloading it, you may possibly need to install it. But that depends on the version you want. For this guide we will use the Installer since it is easiest to set up.

Text instructions:

1. Go to the AutoHotkey Homepage: [https://www.autohotkey.com/](https://www.autohotkey.com/)
2. Click Download. You should be presented with an option for each major version of AutoHotkey. This documentation is for v2, so choose that option or switch to the v1 documentation.
3. The downloaded file should be named AutoHotkey_\*_setup.exe or similar. Run this and click Install.
4. Once done, great! Continue on to section b.

<a id="s12"></a>
### b. How to create a script

Once you have AutoHotkey installed, you will probably want it to do stuff. AutoHotkey is not magic, we all wish it was, but it is not. So we will need to tell it what to do. This process is called "Scripting".

Text instructions:

1. Right-Click on your desktop.
2. Find "New" in the menu.
3. Click "AutoHotkey Script" inside the "New" menu.
4. Give the script a new name. It must end with a .ahk extension. For example: MyScript.ahk
5. Find the newly created file on your desktop and right-click it.
6. Click "Edit Script".
7. A window should have popped up, probably Notepad. If so, SUCCESS!
    So now that you have created a script, we need to add stuff into the file. For a list of all built-in function and variables, see [section 5](#s5).

    Here is a very basic script containing a hotkey which types text using the [Send](lib/Send.md) function when the hotkey is pressed:

    ```ahk
    ^j::
    {
        Send "My First Script"
    }
    ```

    We will get more in-depth later on. Until then, here's an explanation of the above code:

    - `^j::` is the hotkey. `^` means `Ctrl`, `j` is the letter `J`. Anything to the <u>left</u> of `::` are the keys you need to press.
    - `Send "My First Script"` is how you <u>send</u> keystrokes. `Send` is the function, anything after the space inside the quotes will be typed.
    - `{` and `}` marks the start and end of the [hotkey](Hotkeys.md).
8. Save the File.
9. Double-click the file/icon in the desktop to run it. Open notepad or (anything you can type in) and press `Ctrl` and `J`.
10. Hip Hip Hooray! Your first script is done. Go get some reward snacks then return to reading the rest of this tutorial.

> For a video instruction, watch [Install and Hello World](https://youtu.be/HcgQlGeaPHw) on YouTube.

<a id="s14"></a>
### c. How to find the help file on your computer

Downloads for v2.0-a076 and later include an offline help file in the same zip as the main program. If you manually extracted the files, the help file should be wherever you put it.

v2.0-beta.4 and later include an installation script. If you have used this to install AutoHotkey, the help file for each version should be in a subdirectory of the location where AutoHotkey was installed, such as "C:\Program Files\AutoHotkey\v2.0-beta.7". There may also be a symbolic link named "v2" pointing to the subdirectory of the last installed version. If v1.x is installed, a help file for that version may also be present in the root directory.

Look for **AutoHotkey.chm** or a file that says AutoHotkey and has a yellow question mark on it.

If you don't need to find the file itself, there are also a number of ways to launch it:

- Via the "Help" menu option in [tray menu](Program.md#tray-icon) of a running script.
- Via the "Help" menu in the [main window](Program.md#main-window) of a running script, or by pressing F1 while the main window is active.
- Via the "Help files (F1)" option in the [Dash](Program.md#dash), which can be activated with the mouse or by pressing F1 while the Dash is active. The Dash can be opened via the "AutoHotkey" shortcut in the Start menu.

<a id="s2"></a>
## 2 - Hotkeys & Hotstrings

What is a hotkey? A hotkey is a key that is hot to the touch. ... Just kidding. It is a key or key combination that the person at the keyboard presses to trigger some actions. For example:

```ahk
^j::
{
    Send "My First Script"
}
```

What is a hotstring? Hotstrings are mainly used to expand abbreviations as you type them (auto-replace), they can also be used to launch any scripted action. For example:

```ahk
::ftw::Free the whales
```

The difference between the two examples is that the hotkey will be triggered when you press `Ctrl`+`J` while the hotstring will convert your typed "ftw" into "Free the whales".

*"So, how exactly does a person such as myself create a hotkey?"* Good question. A hotkey is created by using a single pair of colons. The key or key combo needs to go on the <u>left</u> of the `::`. And the content needs to go below, enclosed in curly brackets.

> **Note:** There are exceptions, but those tend to cause confusion a lot of the time. So it won't be covered in the tutorial, at least, not right now.

```ahk
Esc::
{
    MsgBox "Escape!!!!"
}
```

A hotstring has a pair of colons on each side of the text you want to trigger the text replacement. While the text to replace your typed text goes on the <u>right</u> of the second pair of colons.

Hotstrings, as mentioned above, can also launch scripted actions. That's fancy talk for *"do pretty much anything"*. Same with hotkeys.

```ahk
::btw::
{
    MsgBox "You typed btw."
}
```

A nice thing to know is that you can have many lines of code for each hotkey, hotstring, label, and a lot of other things we haven't talked about yet.

```ahk
^j::
{
    MsgBox "Wow!"
    MsgBox "There are"
    Run "notepad.exe"
    WinActivate "Untitled - Notepad"
    WinWaitActive "Untitled - Notepad"
    Send "7 lines{!}{Enter}"
    SendInput "inside the CTRL{+}J hotkey."
}
```

<a id="s21"></a>
### a. Keys and their mysterious symbols

You might be wondering *"How the crud am I supposed to know that ^ means `Ctrl`?!"*. Well, good question. To help you learn what ^ and other symbols mean, gaze upon this chart:

| Symbol | Description |
| :---: | --- |
| # | `Win` (Windows logo key) |
| ! | `Alt` |
| ^ | `Ctrl` |
| + | `Shift` |
| & | An ampersand may be used between any two keys or mouse buttons to combine them into a custom hotkey. |

**(For the full list of symbols, see the [Hotkey](Hotkeys.md) page)**

Additionally, for a list of all/most hotkey names that can be used on the <u>left</u> side of a hotkey's double-colon, see [List of Keys, Mouse Buttons, and Controller Controls](KeyList.md).

You can define a custom combination of two (and only two) keys (except controller buttons) by using `&` between them. In the example below, you would hold down Numpad0 then press Numpad1 or Numpad2 to trigger one of the hotkeys:

```ahk
Numpad0 & Numpad1::
{
    MsgBox "You pressed Numpad1 while holding down Numpad0."
}

Numpad0 & Numpad2::
{
    Run "notepad.exe"
}
```

But you are now wondering if hotstrings have any cool modifiers since hotkeys do. Yes, they do! Hotstring modifiers go between the first set of colons. For example:

```ahk
:*:ftw::Free the whales
```

> Visit [Hotkeys](Hotkeys.md) and [Hotstrings](Hotstrings.md) for additional hotkey and hotstring modifiers, information and examples.

<a id="s22"></a>
### b. Window specific hotkeys/hotstrings

Sometime you might want a hotkey or hotstring to only work (or be disabled) in a certain window. To do this, you will need to use one of the fancy commands with a # in-front of them, namely [#HotIf](lib/_HotIf.md), combined with the built-in function [WinActive](lib/WinActive.md) or [WinExist](lib/WinExist.md):

```ahk
#HotIf WinActive(WinTitle)
#HotIf WinExist(WinTitle)
```

This special command (technically called "directive") creates context-sensitive hotkeys and hotstrings. Simply specify a window title for *WinTitle*. But in some cases you might want to specify criteria such as HWND, group or class. Those are a bit advanced and are covered more in-depth here: [The WinTitle Parameter & the Last Found Window](misc/WinTitle.md).

```ahk
#HotIf WinActive("Untitled - Notepad")
#Space::
{
    MsgBox "You pressed WIN+SPACE in Notepad."
}
```

To turn off context sensitivity for subsequent hotkeys or hotstrings, specify #HotIf without its parameter. For example:

```ahk
; Untitled - Notepad
#HotIf WinActive("Untitled - Notepad")
!q::
{
    MsgBox "You pressed ALT+Q in Notepad."
}

; Any window that isn't Untitled - Notepad
#HotIf
!q::
{
    MsgBox "You pressed ALT+Q in any window."
}
```

When #HotIf directives are never used in a script, all hotkeys and hotstrings are enabled for all windows.

The #HotIf directive is positional: it affects all hotkeys and hotstrings physically beneath it in the script, until the next #HotIf directive.

```ahk
; Notepad
#HotIf WinActive("ahk_class Notepad")
#Space::
{
    MsgBox "You pressed WIN+SPACE in Notepad."
}
::msg::You typed msg in Notepad

; MSPaint
#HotIf WinActive("Untitled - Paint")
#Space::
{
    MsgBox "You pressed WIN+SPACE in MSPaint!"
}
::msg::You typed msg in MSPaint!
```

> For more in-depth information, check out the [#HotIf](lib/_HotIf.md) page.

<a id="s23"></a>
### c. Multiple hotkeys/hotstrings per file

This, for some reason crosses some people's minds. So I'll set it clear: AutoHotkey has the ability to have <u>as many</u> hotkeys and hotstrings in one file as you want. Whether it's 1, or 3253 (or more).

```ahk
#i::
{
    Run "https://www.google.com/"
}

^p::
{
    Run "notepad.exe"
}

~j::
{
    Send "ack"
}

:*:acheiv::achiev
::achievment::achievement
::acquaintence::acquaintance
:*:adquir::acquir
::aquisition::acquisition
:*:agravat::aggravat
:*:allign::align
::ameria::America
```

The above code is perfectly acceptable. Multiple hotkeys, multiple hotstrings. All in one big happy script file.

<a id="s24"></a>
### d. Examples

```ahk
::btw::by the way  ; Replaces "btw" with "by the way" as soon as you press a default ending character.
```

```ahk
:*:btw::by the way  ; Replaces "btw" with "by the way" without needing an ending character.
```

```ahk
^n::  ; CTRL+N hotkey
{
    Run "notepad.exe"  ; Run Notepad when you press CTRL+N.
}  ; This ends the hotkey. The code below this will not be executed when pressing the hotkey.
```

```ahk
^b::  ; CTRL+B hotkey
{
    Send "{Ctrl down}c{Ctrl up}"  ; Copies the selected text. ^c could be used as well, but this method is more secure.
    SendInput "[b]{Ctrl down}v{Ctrl up}[/b]" ; Wraps the selected text in BBCode tags to make it bold in a forum.
}  ; This ends the hotkey. The code below this will not be executed when pressing the hotkey.
```

<a id="s3"></a>
## 3 - Sending Keystrokes

So now you decided that you want to send (type) keys to a program. We can do that. Use the [Send](lib/Send.md) function. This function literally sends keystrokes, to simulate typing or pressing of keys.

But before we get into things, we should talk about some common issues that people have.

Just like hotkeys, the Send function has special keys too. [Lots and lots of them](lib/Send.md). Here are the four most common symbols:

| Symbol | Description |
| :---: | --- |
| ! | Sends `Alt`. For example, `Send "This is text!a"` would send the keys "This is text" and then press `Alt`+`A`. **Note:** `!A` produces a different effect in some programs than `!a`. This is because `!A` presses `Alt`+`Shift`+`A` and `!a` presses `Alt`+`A`. If in doubt, use lowercase. |
| + | Sends `Shift`. For example, `Send "+abC"` would send the text "AbC", and `Send "!+a"` would press `Alt`+`Shift`+`A`. |
| ^ | Sends `Ctrl`. For example, `Send "^!a"` would press `Ctrl`+`Alt`+`A`, and `Send "^{Home}"` would send `Ctrl`+`Home`. **Note:** `^A` produces a different effect in some programs than `^a`. This is because `^A` presses `Ctrl`+`Shift`+`A` and `^a` presses `Ctrl`+`A`. If in doubt, use lowercase. |
| # | Sends `Win` (the key with the Windows logo) therefore `Send "#e"` would hold down `Win` and then press `E`. |

The [gigantic table on the Send page](lib/Send.md) shows pretty much every special key built-in to AHK. For example: `{Enter}` and `{Space}`.

> **Caution:** This table <u>does not</u> apply to [hotkeys](Hotkeys.md). Meaning, you do not wrap `Ctrl` or `Enter` (or any other key) inside curly brackets when making a hotkey.

An example showing what shouldn't be done to a hotkey:

```ahk
; When making a hotkey...
; WRONG
{LCtrl}::
{
    Send "AutoHotkey"
}

; CORRECT
LCtrl::
{
    Send "AutoHotkey"
}
```

A common issue lots of people have is, they assume that the curly brackets are put in the documentation pages just for fun. But in fact <u>they are needed</u>. It's how AHK knows that `{!}` means "exclamation point" and not "press `Alt`". So please remember to check the table on the [Send](lib/Send.md) page and make sure you have your brackets in the right places. For example:

```ahk
Send "This text has been typed{!}" ; Notice the ! between the curly brackets? That's because if it wasn't, AHK would press the ALT key.
```

```ahk
; Same as above, but with the ENTER key. AHK would type out "Enter" if
; it wasn't wrapped in curly brackets.
Send "Multiple Enter lines have Enter been sent." ; WRONG
Send "Multiple{Enter}lines have{Enter}been sent." ; CORRECT
```

Another common issue is that people think that <u>everything</u> needs to be wrapped in brackets with the Send function. That is FALSE. If it's not in the chart, it does not need brackets. You do <u>not</u> need to wrap common letters, numbers or even some symbols such as `.` (period) in curly brackets. Also, with the Send functions you are able to send more than one letter, number or symbol at a time. So no need for a bunch of Send functions with one letter each. For example:

```ahk
Send "{a}"       ; WRONG
Send "{b}"       ; WRONG
Send "{c}"       ; WRONG
Send "{a}{b}{c}" ; WRONG
Send "{abc}"     ; WRONG
Send "abc"       ; CORRECT
```

To hold down or release a key, enclose the key name in curly brackets and then use the word UP or DOWN. For example:

```ahk
; This is how you hold one key down and press another key (or keys).
; If one method doesn't work in your program, please try the other.
Send "^s"                     ; Both of these send CTRL+S
Send "{Ctrl down}s{Ctrl up}"  ; Both of these send CTRL+S
Send "{Ctrl down}c{Ctrl up}"
Send "{b down}{b up}"
Send "{Tab down}{Tab up}"
Send "{Up down}"  ; Press down the up-arrow key.
Sleep 1000        ; Keep it down for one second.
Send "{Up up}"    ; Release the up-arrow key.
```

But now you are wondering *"How can I make my really long Send functions readable?"*. Easy. Use what is known as a continuation section. Simply specify an opening parenthesis on a new line, then your content, finally a closing parenthesis on its own line. For more information, read about [Continuation Sections](Scripts.md#continuation).

```ahk
Send "
(
Line 1
Line 2
Apples are a fruit.
)"
```

> **Note:** There are several different forms of Send. Each has their own special features. If one form of Send does not work for your needs, try another type of Send. Simply replace the function name "Send" with one of the following: SendText, SendInput, SendPlay, SendEvent. For more information on what each one does, [read this](lib/Send.md).

<a id="s31"></a>
### a. Games

> **This is important:** Some games, especially multiplayer games, use anti-cheat programs. Things like GameGuard, Hackshield, PunkBuster and several others. Not only is bypassing these systems in violation of the games policies and could get you banned, they are complex to work around.

If a game has a cheat prevention system and your hotkeys, hotstrings and Send functions do not work, you are out of luck. However there are methods that can increase the chance of working in some games, but there is no magical *"make it work in my game now!!!"* button. So try <u>all</u> of these before giving up.

There are also known issues with DirectX. If you are having issues and you know the game uses DirectX, try the stuff described on the [FAQ](FAQ.md#games) page. More DirectX issues may occur when using [PixelSearch](lib/PixelSearch.md), [PixelGetColor](lib/PixelGetColor.md) or [ImageSearch](lib/ImageSearch.md). Colors might turn out black (0x000000) no matter the color you try to get. You should also try running the game in windowed mode, if possible. That fixes some DirectX issues.

There is no single solution to make AutoHotkey work in all programs. If everything you try fails, it may not be possible to use AutoHotkey for your needs.

<a id="s4"></a>
## 4 - Running Programs & Websites

To run a program such as *mspaint.exe, calc.exe, script.ahk* or even a folder, you can use the [Run](lib/Run.md) function. It can even be used to open URLs such as [https://www.autohotkey.com/](https://www.autohotkey.com/). If your computer is setup to run the type of program you want to run, it's very simple:

```ahk
; Run a program. Note that most programs will require a FULL file path:
Run A_ProgramFiles "\Some_Program\Program.exe"

; Run a website:
Run "https://www.autohotkey.com"
```

There are some other advanced features as well, such as command line parameters and CLSID. If you want to learn more about that stuff, visit the [Run](lib/Run.md) page.

Here are a few more samples:

```ahk
; Several programs do not need a full path, such as Windows-standard programs:
Run "notepad.exe"
Run "mspaint.exe"

; Run the "My Documents" folder using a built-in variable:
Run A_MyDocuments

; Run some websites:
Run "https://www.autohotkey.com"
Run "https://www.google.com"
```

> For more in-depth information and examples, check out the [Run](lib/Run.md) page.

<a id="s5"></a>
## 5 - Function Calls with or without Parentheses

In AutoHotkey, function calls can be specified with or without parentheses. The parentheses are usually only necessary if the return value of the function is needed or the function name is not written at the start of the line.

> A list of all built-in functions can be found [here](lib/index.md).

A typical function call looks like this:

```ahk
Function(Parameter1, Parameter2, Parameter3) ; with parentheses
Function Parameter1, Parameter2, Parameter3  ; without parentheses
```

The parameters support any kind of expression; this means for example:

1. You can do math in them:
    ```ahk
    SubStr(37 * 12, 1, 2)
    SubStr(A_Hour - 12, 2)
    ```
2. You can call another functions inside them (note that these function calls must be specified with parentheses as they are not at the start of the line):
    ```ahk
    SubStr(A_AhkPath, InStr(A_AhkPath, "AutoHotkey"))
    ```
3. Text needs to be wrapped in quotes:
    ```ahk
    SubStr("I'm scripting, awesome!", 16)
    ```

The most common way assigning the return value of a function to a variable is like so:

```ahk
MyVar := SubStr("I'm scripting, awesome!", 16)
```

> This isn't the only way, but the most common. You are using `MyVar` to store the return value of the function that is to the right of the `:=` operator. See [Functions](Functions.md) for more details.

In short:

```ahk
; These are function calls without parentheses:
MsgBox "This is some text."
StrReplace Input, "AutoHotKey", "AutoHotkey"
SendInput "This is awesome{!}{!}{!}"

; These are function calls with parentheses:
SubStr("I'm scripting, awesome!", 16)
FileExist(VariableContainingPath)
Output := SubStr("I'm scripting, awesome!", 16)
```

<a id="s51"></a>
### a. Code blocks

[Code blocks](lib/Block.md) are lines of code surrounded by little curly brackets (`{` and `}`). They group a section of code together so that AutoHotkey knows it's one big family and that it needs to stay together. They are most often used with functions and control flow statements such as [If](lib/If.md) and [Loop](lib/Loop.md). Without them, only the first line in the block is called.

In the following code, both lines are run only if *MyVar* equals 5:

```ahk
if (MyVar = 5)
{
    MsgBox "MyVar equals " MyVar "!!"
    ExitApp
}
```

In the following code, the message box is only shown if *MyVar* equals 5. The script will always exit, even if *MyVar* <u>is not</u> 5:

```ahk
if (MyVar = 5)
    MsgBox "MyVar equals " MyVar "!!"
    ExitApp
```

This is perfectly fine since the if-statement only had one line of code associated with it. It's exactly the same as above, but I outdented the second line so we know it's separated from the if-statement:

```ahk
if (MyVar = 5)
    MsgBox "MyVar equals " MyVar "!!"
MsgBox "We are now 'outside' of the if-statement. We did not need curly brackets since there was only one line below it."
```

<a id="s6"></a>
## 6 - Variables

[Variables](Variables.md) are like little post-it notes that hold some information. They can be used to store text, numbers, data from functions or even mathematical equations. Without them, programming and scripting would be much more tedious.

Variables can be assigned a few ways. We'll cover the most common forms. Please pay attention to the colon-equal operator (`:=`).

**Text assignment**

```ahk
MyVar := "Text"
```

This is the simplest form for a variable. Simply type in your text and done. Any text needs to be in quotes.

**Variable assignment**

```ahk
MyVar := MyVar2
```

Same as above, but you are assigning a value of a variable to another variable.

**Number assignment**

```ahk
MyVar := 6 + 8 / 3 * 2 - Sqrt(9)
```

Thanks to expressions, you can do math!

**Mixed assignment**

```ahk
MyVar := "The value of 5 + " MyVar2 " is: " 5 + MyVar2
```

A combination of the three assignments above.

> Equal signs (**=**) with a symbol in front of it such as `:=` `+=` `-=` `.=` etc. are called **assignment operators**.

<a id="s62"></a>
### a. Getting user input

Sometimes you want to have the user to choose the value of stuff. There are several ways of doing this, but the simplest way is [InputBox](lib/InputBox.md). Here is a simple example on how to ask the user a couple of questions and doing some stuff with what was entered:

```ahk
IB1 := InputBox("What is your first name?", "Question 1")
if IB1.Value = "Bill"
    MsgBox "That's an awesome name, " IB1.Value "."

IB2 := InputBox("Do you like AutoHotkey?", "Question 2")
if IB2.Value = "yes"
    MsgBox "Thank you for answering " IB2.Value ", " IB1.Value "! We will become great friends."
else
    MsgBox IB1.Value ", That makes me sad."
```

<a id="s63"></a>
### b. Other Examples?

```ahk
Result := MsgBox("Would you like to continue?",, 4)
if Result = "No"
    return  ; If No, stop the code from going further.
MsgBox "You pressed YES."  ; Otherwise, the user picked yes.
```

```ahk
Var := "text"  ; Assign some text to a variable.
Num := 6  ; Assign a number to a variable.
Var2 := Var  ; Assign a variable to another.
Var3 .= Var  ; Append a variable to the end of another.
Var4 += Num  ; Add the value of a variable to another.
Var4 -= Num  ; Subtract the value of a variable from another.
Var5 := SubStr(Var, 2, 2)  ; Variable inside a function.
Var6 := Var "Text"  ; Assigns a variable to another with some extra text.
MsgBox(Var)  ; Variable inside a function.
MsgBox Var  ; Same as above.
Var := StrSplit(Var, "x")  ; Variable inside a function that uses InputVar and OutputVar.
if (Num = 6)  ; Check if a variable is equal to a number.
if Num = 6  ; Same as above.
if (Var != Num)  ; Check if a variable is not equal to another.
if Var1 < Var2  ; Check if a variable is lesser than another.
```

<a id="s7"></a>
## 7 - Objects

[Objects](Objects.md) are a way of organizing your data for more efficient usage. An object is basically a collection of variables. A variable that belongs to an object is known as a "property". An object might also contain items, such as array elements.

There are a number of reasons you might want to use an object for something. Some examples:

- You want to have a numbered list of things, such as a grocery list (this would be referred to as an indexed array)
- You want to represent a grid, perhaps for a board game (this would be done with nested objects)
- You have a list of things where each thing has a name, such as the characteristics of a fruit (this would be referred to as an associative array)

<a id="s71"></a>
### a. Creating Objects

There are a few ways to create an object, and the most common ones are listed below:

**Bracket syntax (Array)**

```ahk
MyArray := ["one", "two", "three", 17]
```

This creates an [Array](lib/Array.md), which represents a list of items, numbered 1 and up. In this example, the value `"one"` is stored at index 1, and the value `17` is stored at index 4.

**Brace syntax**

```ahk
Banana := {Color: "Yellow", Taste: "Delicious", Price: 3}
```

This creates an *ad hoc* [Object](lib/Object.md). It is a quick way to create an object with a short set of known properties. In this example, the value `"Yellow"` is stored in the *Color* property and the value `3` is stored in the *Price* property.

**Array constructor**

```ahk
MyArray := Array("one", "two", "three", 17)
```

This is equivalent to the bracket syntax. It is actually calling the Array class, not a function.

**Map constructor**

```ahk
MyMap := Map("^", "Ctrl", "!", "Alt")
```

This creates a [Map](lib/Map.md), or *associative array*. In this example, the value `"Ctrl"` is associated with the key `"^"`, and the value `"Alt"` is associated with the key `"!"`. Maps are often created empty with `Map()` and later filled with items.

**Other constructor**

```ahk
Banana := Fruit()
```

Creates an object of the given class (Fruit in this case).

<a id="s72"></a>
### b. Using Objects

There are many ways to use objects, including retrieving values, setting values, adding more values, and more.

<a id="To_set_values"></a>
#### To set values

**Bracket notation**

```ahk
MyArray[2] := "TWO"
MyMap["#"] := "Win"
```

Setting array elements or items in a map or collection is similar to assigning a value to a variable. Simply append bracket notation to the variable which contains the object (array, map or whatever). The index or key between the brackets is an expression, so quote marks must be used for any non-numeric literal value.

**Dot notation**

```ahk
Banana.Consistency := "Mushy"
```

This example assigns a new value to a property of the object contained by *Banana*. If the property doesn't already exist, it is created.

<a id="To_retrieve_values"></a>
#### To retrieve values

**Bracket notation**

```ahk
Value := MyMap["^"]
```

This example retrieves the value previously associated with (mapped to) the key `"^"`. Often the key would be contained by a variable, such as `MyMap[modifierChar]`.

**Dot notation**

```ahk
Value := Banana.Color
```

This example retrieves the *Color* property of the *Banana* object.

<a id="To_add_new_keys_and_values"></a>
#### To add new keys and values

**Bracket notation**

```ahk
MyMap["NewerKey"] := 3.1415
```

To directly add a key and value, just set a key that doesn't exist yet. However, note that when assigning to an [Array](lib/Array.md), the index must be within the range of 1 to the array's current length. Different objects may have different requirements.

**Dot notation**

```ahk
MyObject.NewProperty := "Shiny"
```

As mentioned above, assigning to a property that hasn't already been defined will create a new property.

**InsertAt method**

```ahk
MyArray.InsertAt(Index, Value1, Value2, Value3...)
```

[InsertAt](lib/Array.md#InsertAt) is a method used to insert new values at a specific position within an [Array](lib/Array.md), but other kinds of objects may also define a method by this name.

**Push method**

```ahk
MyArray.Push(Value1, Value2, Value3...)
```

[Push](lib/Array.md#Push) "appends" the values to the end of the [Array](lib/Array.md) *MyArray*. It is the preferred way to add new elements to an array, since the bracket notation can't be used to assign outside the current range of values.

<a id="To_remove_keys_and_values"></a>
#### To remove properties and items

**Delete method**

```ahk
RemovedValue := MyObject.Delete(AnyKey)
```

[Array](lib/Array.md) and [Map](lib/Map.md) have a Delete method, which removes the value from the array or map. The previous value of `MyObject[AnyKey]` will be stored in *RemovedValue*. For an Array, this leaves the array element without a value and doesn't affect other elements in the array.

**Pop method**

```ahk
MyArray.Pop()
```

This [Array](lib/Array.md) method removes the last element from an array and returns its value. The array's length is reduced by 1.

**RemoveAt method**

```ahk
RemovedValue := MyArray.RemoveAt(Index)
```

```ahk
MyArray.RemoveAt(Index, Length)
```

[Array](lib/Array.md) has the [RemoveAt](lib/Array.md#RemoveAt) method, which removes an array element or range of array elements. Elements (if any) to the right of the removed elements are shifted to the left to fill the vacated space.

<a id="s8"></a>
## 8 - Other Helpful Goodies

We have reached the end of our journey, my good friend. I hope you have learned something. But before we go, here are some other things that I think you should know. Enjoy!

<a id="s81"></a>
### a. The mysterious square brackets

Throughout the documentation, you will see these two symbols (`[` and `]`) surrounding code in the yellow syntax box at the top of almost all pages. Anything inside of these brackets are <u>optional</u>. Meaning the stuff inside can be left out if you don't need them. When writing your code, it is very important to <u>not</u> type the square brackets in your code.

On the [ControlGetText](lib/ControlGetText.md) page you will see this:

```ahk
Text := ControlGetText(ControlID , WinTitle, WinText, ExcludeTitle, ExcludeText)
```

So you could simply do this if you wanted:

```ahk
Text := ControlGetText(ControlID)
```

Or add in some more details:

```ahk
Text := ControlGetText(ControlID, WinTitle)
```

What if you wanted to use *ExcludeTitle* but not fill in *WinText* or *WinTitle*? Simple!

```ahk
Text := ControlGetText(ControlID,,, ExcludeTitle)
```

Please note that you cannot IGNORE parameters, but you can leave them blank. If you were to ignore `WinTitle, WinText`, it would look like this and cause issues:

```ahk
Text := ControlGetText(ControlID, ExcludeTitle)
```

<a id="s82"></a>
### b. Finding your AHK version

Run this code to see your AHK version:

```ahk
MsgBox A_AhkVersion
```

Or look for "AutoHotkey Help File" or "AutoHotkey.chm" in the start menu or your installation directory.

<a id="s83"></a>
### c. Trial and Error

Trial and Error is a very common and effective way of learning. Instead of asking for help on every little thing, sometimes spending some time alone (sometimes hours or days) and trying to get something to work will help you learn faster.

If you try something and it gives you an error, study that error. Then try to fix your code. Then try running it again. If you still get an error, modify your code some more. Keep trying and failing until your code fails no more. You will learn a lot this way by reading the documentation, reading errors and learning what works and what doesn't. Try, fail, try, fail, try, try, try, fail, fail, **succeed!**

This is how a lot of "pros" have learned. But don't be afraid to ask for help, we don't bite (hard). Learning takes time, the "pros" you encounter did not learn to be masters in just a few hours or days.

> "If at first you don't succeed, try, try, try again." - Hickson, William E.

<a id="s84"></a>
### d. Indentation

This stuff (indentation) is very important! Your code will run perfectly fine without it, but it will be a major headache for you and other to read your code. Small code (25 lines or less) will probably be fine to read without indentation, but it'll soon get sloppy. It's best you learn to indent ASAP. Indentation has no set style, but it's best to keep everything consistent.

"**What is indentation?**" you ask? It's simply spacing to break up your code so you can see what belongs to what. People usually use 3 or 4 spaces or 1 tab per "level".

Not indented:

```ahk
if (car = "old")
{
MsgBox "The car is really old."
if (wheels = "flat")
{
MsgBox "This car is not safe to drive."
return
}
else
{
MsgBox "Be careful! This old car will be dangerous to drive."
}
}
else
{
MsgBox "My, what a shiny new vehicle you have there."
}
```

Indented:

```ahk
if (car = "old")
{
    MsgBox "The car is really old."
    if (wheels = "flat")
    {
        MsgBox "This car is not safe to drive."
        return
    }
    else
    {
        MsgBox "Be careful! This old car will be dangerous to drive."
    }
}
else
{
    MsgBox "My, what a shiny new vehicle you have there."
}
```

See Wikipedia's [Indentation style](https://en.wikipedia.org/wiki/Indentation_style) page for various styles and examples. Choose what you like or learn to indent how you think it's easiest to read.

<a id="s85"></a>
### e. Asking for Help

Before you ask, try doing some research yourself or try to code it yourself. If that did not yield results that satisfy you, read below.

- Don't be afraid to ask for help, even the smartest people ask others for help.
- Don't be afraid to show what you tried, even if you think it's silly.
- Post anything you have tried.
- Pretend <u>everyone but you</u> is a doorknob and knows nothing. Give as much information as you can to educate us doorknobs at what you are trying to do. Help us help you.
- Be patient.
- Be polite.
- Be open.
- Be kind.
- Enjoy!

If you don't get an answer right away, wait at least 1 day (24 hours) before asking for more help. We love to help, but we also do this for free on our own time. We might be at work, sleeping, gaming, with family or just too busy to help.

And while you wait for help, you can try learning and doing it yourself. It's a good feeling, making something yourself without help.

<a id="s86"></a>
### f. Other links

[Frequently Asked Questions (FAQ)](FAQ.md)
