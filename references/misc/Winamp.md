# Automating Winamp

This page demonstrates how to control Winamp via hotkey even when it is minimized or inactive. This information has been tested with Winamp 2.78c but should work for other major releases as well. Please post changes and improvements in the forum.

This example makes the `Ctrl`+`Alt`+`P` hotkey equivalent to pressing Winamp's pause/unpause button:

```ahk
^!p::
{
    if not WinExist("ahk_class Winamp v1.x")
        return
; Otherwise, the above has set the "last found" window for use below.
ControlSend "c"  ; Pause/Unpause
}
```

Here are some of the keyboard shortcuts available in Winamp 2.x (may work in other versions too). The above example can be revised to use any of these keys:

| Key to send | Effect |
| --- | --- |
| `c` | Pause/UnPause |
| `x` | Play/Restart/UnPause |
| `v` | Stop |
| `+v` | Stop with Fadeout |
| `^v` | Stop after the current track |
| `b` | Next Track |
| `z` | Previous Track |
| `{left}` | Rewind 5 seconds |
| `{right}` | Fast-forward 5 seconds |
| `{up}` | Turn Volume Up |
| `{down}` | Turn Volume Down |

The following example asks Winamp which track number is currently active:

```ahk
TrackNumber := SendMessage(0x0400, 0, 120,, "ahk_class Winamp v1.x")
if (TrackNumber != "")
{
    TrackNumber += 1  ; Winamp's count starts at 0, so adjust by 1.
    MsgBox "Track #" TrackNumber " is active or playing."
}
```
