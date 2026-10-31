# PostMessage / SendMessage Tutorial by Rajat

This page explains how to send messages to a window or its controls via [PostMessage](../lib/PostMessage.md) or [SendMessage](../lib/SendMessage.md) and will answer some questions like:

- "How do I press a button on a minimized window?"
- "How do I select a menu item when [MenuSelect](../lib/MenuSelect.md) doesn't work with it?!"
- "This is a skinnable window.... how do I send a command that works every time?"
- "and what about **hidden** windows?!"

Requirements: Winspector Spy ([can be found here](https://www.softpedia.com/get/Security/Security-Related/Winspector.shtml))

As a first example, note that [MenuSelect](../lib/MenuSelect.md) fails to work with the menu bar on Outlook Express's "New Message" window. In other words, this code will not work:

```ahk
MenuSelect "New Message",, "&Insert", "&Picture..."
```

But [PostMessage](../lib/PostMessage.md) can get the job done:

```ahk
PostMessage 0x0111, 40239, 0, , "New Message"
```

Works like a charm! But what the heck is that? 0x0111 is the hex code of [wm_command message](SendMessageList.md) and 40239 is the code that this particular window understands as menu-item 'Insert Picture' selection. Now let me tell you how to find a value such as 40239:

1. Open Winspector Spy and a "New Message" window.
2. Drag the crosshair from Winspector Spy's window to "New Message" window's titlebar (the portion not covered by Winspector Spy's overlay).
3. Right click the selected window in the list on left and select 'Messages'.
4. Right click the blank window and select 'Edit message filter'.
5. Press the 'filter all' button and then dbl click 'wm_command' on the list on left. This way you will only monitor this message.
6. Now go to the "New Message" window and select from its menu bar: Insert \> Picture.
7. Come back to Winspector Spy and press the traffic light button to pause monitoring.
8. Expand the wm_command messages that've accumulated (forget others if any).
9. What you want to look for (usually) is a code 0 message. sometimes there are wm_command messages saying 'win activated' or 'win destroyed' and other stuff.. not needed. You'll find that there's a message saying 'Control ID: 40239' ...that's it!
10. Now put that in the above function and you've got it! It's the wParam value.

For the next example I'm taking Paint because possibly everyone will have that. Now let's say it's an app where you have to select a tool from a toolbar using AutoHotkey; say the dropper tool is to be selected.

What will you do? Most probably a mouse click at the toolbar button, right? But toolbars can be moved and hidden! This one can be moved/hidden too. So if the target user has done any of this then your script will fail at that point. But the following function will still work:

```ahk
PostMessage 0x0111, 639,,, "Untitled - Paint"
```

Another advantage to [PostMessage](../lib/PostMessage.md) is that the Window can be in the background; by contrast, sending mouse clicks would require it to be active.

Here are some more examples. Note: I'm using WinXP Pro (SP1) ... if you use a different OS then your params may change (only applicable to apps like Wordpad and Notepad that come with windows; for others the params shouldn't vary):

```ahk
;makes writing color teal in Wordpad
PostMessage 0x0111, 32788, 0, , "Document - WordPad"
```

```ahk
;opens about box in Notepad
PostMessage 0x0111, 65, 0, , "Untitled - Notepad"
```

```ahk
;toggles word-wrap in Notepad
PostMessage 0x0111, 32, 0, , "Untitled - Notepad"
```

```ahk
;play/pause in Windows Media Player
PostMessage 0x0111, 32808, 0, , "Windows Media Player"
```

```ahk
;suspend the hotkeys of a running AHK script
DetectHiddenWindows True
; Use 65306 to Pause and 65303 to Reload instead of Suspend. (see FAQ)
PostMessage 0x0111, 65305,,, "MyScript.ahk - AutoHotkey"
```

```ahk
; Press CapsLock and Numpad2 to reload all AutoHotkey scripts
CapsLock & Numpad2::
ReloadAllAhkScripts(ThisHotkey)
{
    DetectHiddenWindows True
    for hwnd in WinGetList("ahk_class AutoHotkey")
    {
        if (hwnd = A_ScriptHwnd)  ; ignore the current window for reloading
            continue
        PostMessage 0x0111, 65303,,, hwnd
    }
    Reload
}
```

This above was for PostMessage. [SendMessage](../lib/SendMessage.md) works the same way but additionally waits for a return value, which can be used for things such as getting the currently playing track in Winamp (see [Automating Winamp](Winamp.md) for an example).

Here are some more notes:

- The note above regarding OS being XP and msg values changing with different OSes is purely cautionary. if you've found a msg that works on your system (with a certain version of a software) then you can be sure it'll work on another system too with the same version of the software. In addition, most apps keep these msg values the same even on different versions of themselves (e.g. Windows Media Player and Winamp).
- If you've set the filter to show only wm_command in Winspector Spy and still you're getting a flood of messages then right click that message and select hide (msg name)... you don't want to have a look at a msg that appears without you interacting with the target software.
- The right pointing arrow in Winspector Spy shows the msg values and the blurred left pointing arrows show the returned value. A 0 (zero) value can by default safely be taken as 'no error'.
- For posting to hidden windows add this to script: `DetectHiddenWindows True`

Note: There are apps with which this technique doesn't work. I've had mixed luck with VB and Delphi apps. This technique is best used with C, C++ apps. With VB apps the 'LParam' of the same function keeps changing from one run to another. With Delphi apps... the GUI of some apps doesn't even use wm_command. It probably uses mouse pos & clicks.

Go and explore.... and share your experiences in the AutoHotkey Forum. Feedback is welcome!

This tutorial is not meant for total newbies (no offense meant) since these functions are considered advanced features. So if after reading the above you've not made heads or tails of it, please forget it.

-Rajat
