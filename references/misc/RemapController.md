# Remapping a Controller to Keyboard or Mouse

<a id="toc"></a>
## Table of Contents

- [Important Notes](#imp)
- [Making a Controller Button Send Keystrokes or Mouse Clicks](#button)
    - [Different Approaches](#different-approaches)
    - [Auto-repeating a Keystroke](#auto-repeating-controller-buttons)
    - [Context-sensitive Controller Buttons](#context-sensitive-controller-buttons)
    - [Using a Controller as a Mouse](#using-a-controller-as-a-mouse)
- [Making Other Controller Controls Send Keystrokes or Mouse Clicks](#axis)
    - [Controller Axes](#controller-axes)
    - [Controller POV Hat](#controller-pov-hat)
    - [Auto-repeating a Keystroke](#auto-repeating-other)
- [Remarks](#Remarks)
- [Related Topics](#related)

<a id="imp"></a>
## Important Notes

- For historical reasons, the following button and control names begin with `Joy`, which stands for joystick. However, they usually also work for other game controllers such as gamepads or steering wheels.
- Although a controller button or axis can be remapped to become a key or mouse button, it cannot be remapped to some other controller button or axis. That would be possible only with the help of a controller emulator such as [vJoy](https://sourceforge.net/projects/vjoystick/).
- AutoHotkey identifies each button on a controller with a unique number between 1 and 32. To determine these numbers, use the [controller test script](../scripts/index.md#ControllerTest).
- For Xbox controller 2013 and newer (anything newer than the Xbox 360 controller), Joy1 to Joy32 hotkeys will only work if a window owned by the script is active, such as a [message box](../lib/MsgBox.md), [GUI](../lib/Gui.md), or the [script's main window](../Program.md#main-window). This limitation also applies to [GetKeyState](../lib/GetKeyState.md) for Joy1 to Joy32 and JoyX, JoyY, JoyZ, JoyR, JoyU, JoyPOV (and possibly JoyV), but not for JoyName, JoyButtons, JoyAxes and JoyInfo. To detect those controller inputs for other active windows, use the [XInput.ahk library](https://www.autohotkey.com/boards/viewtopic.php?f=83&t=106254).

<a id="button"></a>
## Making a Controller Button Send Keystrokes or Mouse Clicks

### Different Approaches

Below are three approaches, starting at the simplest and ending with the most complex. The most complex method works in the broadest variety of circumstances (such as games that require a key or mouse button to be held down).

<a id="Method_1"></a>
#### Method #1

This method sends simple keystrokes and mouse clicks. For example:

```ahk
Joy1::Send "{Left}"  ; Have button #1 send a left-arrow keystroke.
Joy2::Click  ; Have button #2 send a click of left mouse button.
Joy3::Send "a{Esc}{Space}{Enter}"  ; Have button #3 send the letter "a" followed by Escape, Space, and Enter.
Joy4::Send "Sincerely,{Enter}John Smith"  ; Have button #4 send a two-line signature.
```

To have a button perform more than one line, put them *beneath* the button name and enclose them in braces. For example:

```ahk
Joy5::
{
    Run "notepad"
    WinWait "Untitled - Notepad"
    WinActivate
    Send "This is the text that will appear in Notepad.{Enter}"
}
```

For details, see [How to Write Hotkeys](../howto/WriteHotkeys.md).

See the [Key List](../KeyList.md) for the complete list of keys and mouse/controller buttons.

<a id="Method_2"></a>
#### Method #2

This method is necessary in cases where a key or mouse button must be held down for the entire time that you're holding down a controller button. The following example makes the controller's second button become the left-arrow key:

```ahk
Joy2::
{
    Send "{Left down}"  ; Hold down the left-arrow key.
    KeyWait "Joy2"  ; Wait for the user to release the controller button.
    Send "{Left up}"  ; Release the left-arrow key.
}
```

<a id="Method_3"></a>
#### Method #3

This method is necessary in cases where you have more than one controller hotkey of the type described in Method #2, and you sometimes press and release such hotkeys simultaneously. The following example makes the controller's third button become the left mouse button:

```ahk
Joy3::
{
    Send "{LButton down}"   ; Hold down the left mouse button.
    SetTimer WaitForButtonUp3, 10
}

WaitForButtonUp3()
{
    if GetKeyState("Joy3")  ; The button is still, down, so keep waiting.
        return
    ; Otherwise, the button has been released.
    Send "{LButton up}"  ; Release the left mouse button.
    SetTimer , 0
}
```

<a id="auto-repeating-controller-buttons"></a>
### Auto-repeating a Keystroke

Some programs or games might require a key to be sent repeatedly (as though you are holding it down on the keyboard). The following example achieves this by sending spacebar keystrokes repeatedly while you hold down the controller's second button:

```ahk
Joy2::
{
    Send "{Space down}"   ; Press the spacebar down.
    SetTimer WaitForJoy2, 30  ; Reduce the number 30 to 20 or 10 to send keys faster. Increase it to send slower.
}

WaitForJoy2()
{
    if not GetKeyState("Joy2")  ; The button has been released.
    {
        Send "{Space up}"  ; Release the spacebar.
        SetTimer , 0  ; Stop monitoring the button.
        return
    }
    ; Since above didn't "return", the button is still being held down.
    Send "{Space down}"  ; Send another Spacebar keystroke.
}
```

### Context-sensitive Controller Buttons

The [#HotIf](../lib/_HotIf.md) directive can be used to make selected controller buttons perform a different action (or none at all) depending on any condition, such as the type of window that is active.

### Using a Controller as a Mouse

The [Controller-To-Mouse script](../scripts/index.md#ControllerMouse) converts a controller into a mouse by remapping its buttons and axis control.

<a id="axis"></a>
## Making Other Controller Controls Send Keystrokes or Mouse Clicks

To have a script respond to movement of a stick's axis or POV hat, use [SetTimer](../lib/SetTimer.md) and [GetKeyState](../lib/GetKeyState.md).

### Controller Axes

The following example makes the stick's X and Y axes behave like the arrow key cluster on a keyboard (left, right, up, and down):

```ahk
SetTimer WatchAxis, 5

WatchAxis()
{
    static KeyToHoldDown := ""
    JoyX := GetKeyState("JoyX")  ; Get position of X axis.
    JoyY := GetKeyState("JoyY")  ; Get position of Y axis.
    KeyToHoldDownPrev := KeyToHoldDown  ; Prev now holds the key that was down before (if any).

    if JoyX > 70
        KeyToHoldDown := "Right"
    else if JoyX < 30
        KeyToHoldDown := "Left"
    else if JoyY > 70
        KeyToHoldDown := "Down"
    else if JoyY < 30
        KeyToHoldDown := "Up"
    else
        KeyToHoldDown := ""

    if KeyToHoldDown = KeyToHoldDownPrev  ; The correct key is already down (or no key is needed).
        return  ; Do nothing.

    ; Otherwise, release the previous key and press down the new key:
    SetKeyDelay -1  ; Avoid delays between keystrokes.
    if KeyToHoldDownPrev   ; There is a previous key to release.
        Send "{" KeyToHoldDownPrev " up}"  ; Release it.
    if KeyToHoldDown   ; There is a key to press down.
        Send "{" KeyToHoldDown " down}"  ; Press it down.
}
```

### Controller POV Hat

The following example makes the controller's POV hat behave like the arrow key cluster on a keyboard; that is, the POV hat will send arrow keystrokes (left, right, up, and down):

```ahk
SetTimer WatchPOV, 5

WatchPOV()
{
    static KeyToHoldDown := ""
    POV := GetKeyState("JoyPOV")  ; Get position of the POV control.
    KeyToHoldDownPrev := KeyToHoldDown  ; Prev now holds the key that was down before (if any).

; Some controllers might have a smooth/continous POV rather than one in fixed increments.
    ; To support them all, use a range:
    if POV < 0   ; No angle to report
        KeyToHoldDown := ""
    else if POV > 31500                ; 315 to 360 degrees: Forward
        KeyToHoldDown := "Up"
    else if POV >= 0 and POV <= 4500      ; 0 to 45 degrees: Forward
        KeyToHoldDown := "Up"
    else if POV >= 4501 and POV <= 13500  ; 45 to 135 degrees: Right
        KeyToHoldDown := "Right"
    else if POV >= 13501 and POV <= 22500 ; 135 to 225 degrees: Down
        KeyToHoldDown := "Down"
    else                                  ; 225 to 315 degrees: Left
        KeyToHoldDown := "Left"

    if KeyToHoldDown = KeyToHoldDownPrev  ; The correct key is already down (or no key is needed).
        return  ; Do nothing.

    ; Otherwise, release the previous key and press down the new key:
    SetKeyDelay -1  ; Avoid delays between keystrokes.
    if KeyToHoldDownPrev   ; There is a previous key to release.
        Send "{" KeyToHoldDownPrev " up}"  ; Release it.
    if KeyToHoldDown   ; There is a key to press down.
        Send "{" KeyToHoldDown " down}"  ; Press it down.
}
```

<a id="auto-repeating-other"></a>
### Auto-repeating a Keystroke

Both examples above can be modified to send the key repeatedly rather than merely holding it down (that is, they can mimic physically holding down a key on the keyboard). To do this, replace the following line:

```ahk
return  ; Do nothing.
```

With the following:

```ahk
{
    if KeyToHoldDown
        Send "{" KeyToHoldDown " down}"  ; Auto-repeat the keystroke.
    return
}
```

<a id="Remarks"></a>
## Remarks

A controller other than first may be used by preceding the button or axis name with the number of the controller. For example, `2Joy1` would be the second controller's first button.

To find other useful controller scripts, visit the [AutoHotkey forum](https://www.autohotkey.com/boards/). A keyword search such as *Controller and GetKeyState and Send* is likely to produce topics of interest.

<a id="related"></a>
## Related Topics

- [Controller-To-Mouse script (using a controller as a mouse)](../scripts/index.md#ControllerMouse)
- [List of controller buttons, axes, and controls](../KeyList.md#Controller)
- [GetKeyState](../lib/GetKeyState.md)
- [Remapping the keyboard and mouse](Remap.md)
