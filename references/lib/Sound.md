# Sound Functions

Applies to:

- [SoundGetVolume](SoundGetVolume.md) / [SoundSetVolume](SoundSetVolume.md)
- [SoundGetMute](SoundGetMute.md) / [SoundSetMute](SoundSetMute.md)
- [SoundGetName](SoundGetName.md)
- [SoundGetInterface](SoundGetInterface.md)

Other sound-related functions:

- [SoundBeep](SoundBeep.md)
- [SoundPlay](SoundPlay.md)

<a id="devices"></a>
## Endpoint Devices

The "devices" referenced by the SoundGet and SoundSet functions are *audio endpoint devices*. A single device driver or physical device often has multiple endpoints, such as for different types of output or input. For example:

| Name | Description |
| --- | --- |
| Speakers (Example HD Audio) | The main analog outputs of this device (uses multiple jacks in the case of surround sound). |
| Digital Output (Example HD Audio) | An optical or coaxial digital output. |
| Microphone (Example HD Audio) | Captures audio through a microphone jack. |
| Stereo Mix (Example HD Audio) | Captures whatever audio is being output to the Speakers endpoint. |

Device names typically consist of an endpoint name such as "Speakers" followed by the name of the audio driver in parentheses. Scripts may use the full name or just the leading part of the name, such as "Mic" or "Microphone". An audio driver has a fixed name, but endpoint names may be changed by an administrator at any time via the Sound control panel.

<a id="mmsys"></a>

Devices are listed in the Sound control panel, which can be opened by running `mmsys.cpl` from the command line, or via the Run dialog (`Win`+`R`) or the [Run](Run.md) function. By default, the control panel only lists devices that are enabled and plugged in (if applicable), but this can be changed via the right-click menu. AutoHotkey detects devices which are not plugged in, but does not detect disabled devices.

## Components

Components are as shown on the Levels tab of the sound device's properties dialog.

![Levels](../static/sound_levels.png)

In this example, the master controls are at the top, followed by the first four components: Microphone, FrontMic, Line In, and Side. All have volume and mute controls, except the fourth component, which only has volume.

A sound device's properties dialog can be opened via the [Sound control panel](#mmsys).

Audio drivers are capable of exposing other controls, such as bass and treble. However, common audio drivers tend to have only volume and mute controls, or no components at all. Volume and mute controls are supported directly through [SoundGetVolume](SoundGetVolume.md), [SoundSetVolume](SoundSetVolume.md), [SoundGetMute](SoundGetMute.md) and [SoundSetMute](SoundSetMute.md). All other controls are supported only indirectly, through [SoundGetInterface](SoundGetInterface.md) and [ComCall](ComCall.md).

<a id="Advanced_Details"></a>
### Advanced Details

Components are discovered through the [DeviceTopology API](https://learn.microsoft.com/windows/win32/coreaudio/devicetopology-api), which exposes a graph of *Connectors* and *Subunits*. Each component shown above has a Connector, and it is the Connector that defines the component's name. Each control (such as volume or mute) is represented by a Subunit which sits between the Connector and the endpoint. Data "flows" from or to the Connector and is altered as it flows through each Subunit, such as to adjust volume or suppress (mute) all sound.

The SoundGet and SoundSet functions identify components by walking the *device topology* graph and counting Connectors with the given name (or all Connectors if no name is given). Once the matching Connector is found, a control interface (such as IAudioVolumeLevel or IAudioMute) is retrieved by querying each Subunit on that specific branch of the graph, starting nearest the Connector.

Subunits which apply to multiple Connectors are excluded - such as Subunits which correspond to the master volume and mute controls. A Connector is counted if (and only if) it has at least one Subunit of its own, even if the Subunit is not of the requested type.

In practice, the end result is that the available components are as listed on [the Levels tab](#components), and in the same order. However, this process is based on observation, trial and error, so might not be 100 % accurate.

<a id="Common_Parameters"></a>
## Common Parameters

<a id="component"></a>

**Component**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

One of the following:

- The index of a [component](#components), where 1 is the first component.
- The full display name of a component (case-insensitive).
- As above, but followed by a colon and integer, where 1 is the first occurrence of a component with that name. For example, `"Line In:2"` uses the second component named "Line In". This is necessary only when *Component* would otherwise be ambiguous, such as when multiple components exist with the same name, or the display name is empty, an integer or contains a colon.
- If blank or omitted, the function targets the master volume/mute controls or an interface that can be returned by [IMMDevice::Activate](https://learn.microsoft.com/windows/win32/api/mmdeviceapi/nf-mmdeviceapi-immdevice-activate).

If only an index is specified, the display names are ignored. For example, `1`, `"1"` and `":1"` use the first component regardless of name, whereas `""` uses the master controls.

If the sound device lacks the specified *Component*, a [TargetError](Error.md#TargetError) is thrown.

<a id="device"></a>

**Device**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

One of the following:

- A number (integer) between 1 and the total number of supported devices.
- The display name of a device; either the full name or a leading part (case-insensitive). For example, `"Speakers"` or `"Speakers (Example HD Audio)"`.
- As above, but followed by a colon and integer, where 1 is the first device with a matching name. For example, `"Speakers:2"` indicates the second device which has a name starting with "Speakers". This is necessary only when *Device* would otherwise be ambiguous, such as when multiple devices exist with the same name, or the display name contains a colon.
- If blank or omitted, it defaults to the system's default device for playback (which is not necessarily device 1).

The [soundcard analysis script](#ExSoundcard) may help determine which name and/or number to use.

<a id="Examples"></a>
## Examples

<a id="ExSoundcard"></a>

**Example:** Soundcard Analysis. Use the following script to discover the available audio device and component names and whether each device or component supports volume and/or mute controls. It displays the results in a simple ListView. The current volume and mute settings are shown if they can be retrieved, but are not updated in realtime.

```ahk
scGui := Gui(, "Sound Components")
scLV := scGui.Add('ListView', "w600 h400"
    , ["Component", "#", "Device", "Volume", "Mute"])

devMap := Map()

loop
{
    ; For each loop iteration, try to get the corresponding device.
    try
        devName := SoundGetName(, dev := A_Index)
    catch  ; No more devices.
        break

    ; Qualify names with ":index" where needed.
    devName := Qualify(devName, devMap, dev)

    ; Retrieve master volume and mute setting, if possible.
    vol := mute := ""
    try vol := Round(SoundGetVolume( , dev), 2)
    try mute := SoundGetMute( , dev)

    ; Display the master settings only if at least one was retrieved.
    if vol != "" || mute != ""
        scLV.Add("", "", dev, devName, vol, mute)

    ; For each component, first query its name.
    cmpMap := Map()

    loop
    {
        try
            cmpName := SoundGetName(cmp := A_Index, dev)
        catch
            break
        ; Retrieve this component's volume and mute setting, if possible.
        vol := mute := ""
        try vol := Round(SoundGetVolume(cmp, dev), 2)
        try mute := SoundGetMute(cmp, dev)
        ; Display this component even if it does not support volume or mute,
        ; since it likely supports other controls via SoundGetInterface().
        scLV.Add("", Qualify(cmpName, cmpMap, A_Index), dev, devName, vol, mute)
    }
}

loop 5
    scLV.ModifyCol(A_Index, 'AutoHdr Logical')
scGui.Show()

; Qualifies full names with ":index" when needed.
Qualify(name, names, overallIndex)
{
    if name = ''
        return overallIndex
    key := StrLower(name)
    index := names.Has(key) ? ++names[key] : (names[key] := 1)
    return (index > 1 || InStr(name, ':') || IsInteger(name)) ? name ':' index : name
}
```
