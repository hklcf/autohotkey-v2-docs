# SoundGetVolume

Retrieves a volume setting of a sound device.

```ahk
Setting := SoundGetVolume(Component, Device)
```

<a id="Parameters"></a>
## Parameters

**Component**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, it defaults to the master volume setting. Otherwise, specify the component's display name and/or index, e.g. `1`, `"Line in"` or `"Line in:2"`.

For further details, see [Component (Sound Functions)](Sound.md#component).

**Device**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, it defaults to the system's default device for playback (which is not necessarily device 1). Otherwise, specify the device's display name and/or index, e.g. `1`, `"Speakers"`, `"Speakers:2"` or `"Speakers (Example HD Audio)"`.

For further details, see [Device (Sound Functions)](Sound.md#device).

<a id="Return_Value"></a>
## Return Value

Type: [Float](../Concepts.md#numbers)

This function returns a floating point number between 0.0 and 100.0.

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

<a id="ExMasterVol"></a>

**Example:** Retrieves and reports the master volume.

```ahk
master_volume := SoundGetVolume()
MsgBox "Master volume is " master_volume " percent."
```

<a id="ExMicListenVol"></a>

**Example:** Retrieves and reports the microphone listening volume.

```ahk
mic_volume := SoundGetVolume("Microphone")
MsgBox "Microphone listening volume is " mic_volume " percent."
```

<a id="ExMicRecordVol"></a>

**Example:** Retrieves and reports the microphone recording volume.

```ahk
mic_volume := SoundGetVolume( , "Microphone")
MsgBox "Microphone recording volume is " mic_volume " percent."
```
