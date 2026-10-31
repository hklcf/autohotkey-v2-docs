# SoundSetVolume

Changes a volume setting of a sound device.

```ahk
SoundSetVolume NewSetting , Component, Device
```

<a id="Parameters"></a>
## Parameters

**NewSetting**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

A string containing a percentage number between -100 and 100 inclusive. If the number begins with a plus or minus sign, the <u>current setting</u> will be adjusted up or down by the indicated amount. Otherwise, the setting will be set explicitly to the level indicated by *NewSetting*.

If the percentage number begins with a minus sign or is unsigned, it does not need to be enclosed in quotation marks.

**Component**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, it defaults to the master volume setting. Otherwise, specify the component's display name and/or index, e.g. `1`, `"Line in"` or `"Line in:2"`.

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

An alternative way to adjust the volume is to have the script send volume-control keystrokes to change the master volume for the entire system, such as in the example below:

```ahk
Send "{Volume_Up}"  ; Raise the master volume by 1 interval (typically 5%).
Send "{Volume_Down 3}"  ; Lower the master volume by 3 intervals.
```

To discover the capabilities of the sound devices installed on the system -- such as the names and available components -- run the [soundcard analysis script](Sound.md#ExSoundcard).

SoundSetVolume attempts to preserve the existing balance when changing the volume level.

Use [SoundGetVolume](SoundGetVolume.md) to retrieve the current volume setting.

<a id="Related"></a>
## Related

[Sound Functions](Sound.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Sets the master volume to 50 percent. Quotation marks can be omitted.

```ahk
SoundSetVolume "50"
```

```ahk
SoundSetVolume 50
```

<a id="ExPlus"></a>

**Example:** Increases the master volume by 10 percent. Quotation marks <u>cannot</u> be omitted.

```ahk
SoundSetVolume "+10"
```

<a id="ExMinus"></a>

**Example:** Decreases the master volume by 10 percent. Quotation marks can be omitted.

```ahk
SoundSetVolume "-10"
```

```ahk
SoundSetVolume -10
```

<a id="ExMic"></a>

**Example:** Increases microphone recording volume by 20 percent.

```ahk
SoundSetVolume "+20", , "Microphone"
```
