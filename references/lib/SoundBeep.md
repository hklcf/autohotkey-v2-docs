# SoundBeep

Emits a tone from the PC speaker.

```ahk
SoundBeep Frequency, Duration
```

<a id="Parameters"></a>
## Parameters

**Frequency**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 523. Otherwise, specify the frequency of the sound, a number between 37 and 32767.

**Duration**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 150. Otherwise, specify the duration of the sound, in milliseconds.

<a id="Remarks"></a>
## Remarks

The script waits for the sound to finish before continuing. In addition, system responsiveness might be reduced during sound production.

If the computer lacks a sound card, a standard beep is played through the PC speaker.

To produce the standard system sounds instead of beeping the PC Speaker, see the asterisk mode of [SoundPlay](SoundPlay.md).

<a id="Related"></a>
## Related

[SoundPlay](SoundPlay.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Plays the default pitch and duration.

```ahk
SoundBeep
```

<a id="ExParams"></a>

**Example:** Plays a higher pitch for half a second.

```ahk
SoundBeep 750, 500
```
