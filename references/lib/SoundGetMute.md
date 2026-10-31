# SoundGetMute

Retrieves a mute setting of a sound device.

```ahk
Setting := SoundGetMute(Component, Device)
```

<a id="Parameters"></a>
## Parameters

**Component**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, it defaults to the master mute setting. Otherwise, specify the component's display name and/or index, e.g. `1`, `"Line in"` or `"Line in:2"`.

For further details, see [Component (Sound Functions)](Sound.md#component).

**Device**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, it defaults to the system's default device for playback (which is not necessarily device 1). Otherwise, specify the device's display name and/or index, e.g. `1`, `"Speakers"`, `"Speakers:2"` or `"Speakers (Example HD Audio)"`.

For further details, see [Device (Sound Functions)](Sound.md#device).

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 0 (false) for unmuted or 1 (true) for muted.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the device or component could not be found or if the component does not support this control type. Otherwise, an [OSError](Error.md#OSError) is thrown on failure.

<a id="Remarks"></a>
## Remarks

To discover the capabilities of the sound devices installed on the system -- such as the names and available components -- run the [soundcard analysis script](Sound.md#ExSoundcard).

<a id="Related"></a>
## Related

[Sound Functions](Sound.md)

<a id="Examples"></a>
## Examples

<a id="ExMasterMute"></a>

**Example:** Checks whether the default playback device is muted.

```ahk
master_mute := SoundGetMute()
if master_mute
    MsgBox "The default playback device is muted."
else
    MsgBox "The default playback device is not muted."
```

<a id="ExLineInMute"></a>

**Example:** Checks whether "Line In pass-through" is muted.

```ahk
if SoundGetMute("Line In") = 0
    MsgBox "Line In pass-through is not muted."
```

<a id="ExMicRecordMute"></a>

**Example:** Checks whether the microphone (recording) is muted.

```ahk
if SoundGetMute( , "Microphone") = 0
    MsgBox "The microphone (recording) is not muted."
```
