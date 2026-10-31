# SoundSetMute

Changes a mute setting of a sound device.

```ahk
SoundSetMute NewSetting , Component, Device
```

<a id="Parameters"></a>
## Parameters

**NewSetting**

Type: [Integer](../Concepts.md#numbers)

One of the following values:

- `1` or `True` turns on the setting
- `0` or `False` turns off the setting
- `-1` toggles the setting (sets it to the opposite of its current state)

**Component**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, it defaults to the master mute setting. Otherwise, specify the component's display name and/or index, e.g. `1`, `"Line in"` or `"Line in:2"`.

For further details, see [Component (Sound Functions)](Sound.md#component).

**Device**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, it defaults to the system's default device for playback (which is not necessarily device 1). Otherwise, specify the device's display name and/or index, e.g. `1`, `"Speakers"`, `"Speakers:2"` or `"Speakers (Example HD Audio)"`.

For further details, see [Device (Sound Functions)](Sound.md#device).

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the device or component could not be found or if the component does not support this control type. Otherwise, an [OSError](Error.md#OSError) is thrown on failure.

<a id="Remarks"></a>
## Remarks

An alternative way to toggle the master mute setting of the default playback device is to have the script send a keystroke, such as in the example below:

```ahk
Send "{Volume_Mute}"  ; Mute/unmute the master volume.
```

To discover the capabilities of the sound devices installed on the system -- such as the names and available components -- run the [soundcard analysis script](Sound.md#ExSoundcard).

Use [SoundGetMute](SoundGetMute.md) to retrieve the current mute setting.

<a id="Related"></a>
## Related

[Sound Functions](Sound.md)

<a id="Examples"></a>
## Examples

<a id="ExMuteOn"></a>

**Example:** Turns on the master mute.

```ahk
SoundSetMute true
```

<a id="ExMuteOff"></a>

**Example:** Turns off the master mute.

```ahk
SoundSetMute false
```

<a id="ExMuteToggle"></a>

**Example:** Toggles the master mute (sets it to the opposite of its current state).

```ahk
SoundSetMute -1
```

<a id="ExMuteLineIn"></a>

**Example:** Mutes Line In.

```ahk
SoundSetMute true, "Line In"
```

<a id="ExMuteMicRecord"></a>

**Example:** Mutes microphone recording.

```ahk
SoundSetMute true,, "Microphone"
```
