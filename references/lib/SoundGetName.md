# SoundGetName

Retrieves the name of a sound device or component.

```ahk
Name := SoundGetName(Component, Device)
```

<a id="Parameters"></a>
## Parameters

**Component**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, the name of the device itself will be retrieved. Otherwise, specify the component's display name and/or index, e.g. `1`, `"Line in"` or `"Line in:2"`.

For further details, see [Component (Sound Functions)](Sound.md#component).

**Device**

Type: [String](../Concepts.md#strings) or [Integer](../Concepts.md#numbers)

If blank or omitted, it defaults to the system's default device for playback (which is not necessarily device 1). Otherwise, specify the device's display name and/or index, e.g. `1`, `"Speakers"`, `"Speakers:2"` or `"Speakers (Example HD Audio)"`.

For further details, see [Device (Sound Functions)](Sound.md#device).

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the name of the device or component, which can be empty.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the device or component could not be found. Otherwise, an [OSError](Error.md#OSError) is thrown on failure.

<a id="Related"></a>
## Related

[Sound Functions](Sound.md)

<a id="Examples"></a>
## Examples

<a id="ExNoParams"></a>

**Example:** Retrieves and reports the name of the default playback device.

```ahk
default_device := SoundGetName()
MsgBox "The default playback device is " default_device
```

<a id="ExDevice"></a>

**Example:** Retrieves and reports the name of the first device.

```ahk
device1 := SoundGetName( , 1)
MsgBox "Device 1 is " device1
```

<a id="ExComponent"></a>

**Example:** Retrieves and reports the name of the first component.

```ahk
component1 := SoundGetName(1)
MsgBox "Component 1 is " component1
```

For a more complex example, see the [soundcard analysis script](Sound.md#ExSoundcard).
