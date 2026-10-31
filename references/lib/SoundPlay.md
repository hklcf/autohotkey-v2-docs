# SoundPlay

Plays a sound, video, or other supported file type.

```ahk
SoundPlay Filename , Wait
```

<a id="Parameters"></a>
## Parameters

**Filename**

Type: [String](../Concepts.md#strings)

The name of the file to be played, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified.

To produce standard system sounds, specify an asterisk followed by a number as shown below (note that the *Wait* parameter has no effect in this mode):

- \*-1 = Simple beep. If the sound card is not available, the sound is generated using the speaker.
- \*16 = Hand (stop/error)
- \*32 = Question
- \*48 = Exclamation
- \*64 = Asterisk (info)

**Wait**

Type: [Integer (boolean)](../Concepts.md#boolean) or [String](../Concepts.md#strings)

If blank or omitted, it defaults to 0 (false). Otherwise, specify one of the following values:

**0** (false): The [current thread](../misc/Threads.md) will move on to the next statement(s) while the file is playing.

**1** (true) or **Wait**: The current thread waits until the file is finished playing before continuing. Even while waiting, new threads can be launched via [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md).

Known limitation: If the *Wait* parameter is not used, the system might consider the playing file to be "in use" until the script closes or until another file is played (even a nonexistent file).

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Remarks"></a>
## Remarks

All Windows systems should be able to play .wav files. However, other file types (.mp3, .avi, etc.) might not be playable if the right codecs or features aren't installed on the system.

Due to a quirk in Windows, .wav files with a path longer than 127 characters will not be played. To work around this, use other file types such as .mp3 (with a path length of up to 255 characters) or use 8.3 short paths (see [A_LoopFileShortPath](LoopFiles.md#LoopFileShortPath) how to retrieve such paths).

If a file is playing and the current script plays a second file, the first file will be stopped so that the second one can play. On some systems, certain file types might stop playing even when an entirely separate script plays a new file.

To stop a file that is currently playing, use SoundPlay on a nonexistent filename as in this example: `try SoundPlay "Nonexistent.avi"`.

If the script is exited, any currently-playing file that it started will stop.

<a id="Related"></a>
## Related

[SoundBeep](SoundBeep.md), [Sound Functions](Sound.md), [MsgBox](MsgBox.md), [Threads](../misc/Threads.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Plays a .wav file located in the Windows directory.

```ahk
SoundPlay A_WinDir "\Media\ding.wav"
```

<a id="ExStandardSound"></a>

**Example:** Generates a simple beep.

```ahk
SoundPlay "*-1"
```
