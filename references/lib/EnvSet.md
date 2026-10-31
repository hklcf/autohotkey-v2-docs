# EnvSet

Writes a value to the specified [environment variable](../Concepts.md#environment-variables).

```ahk
EnvSet EnvVar , Value
```

<a id="Parameters"></a>
## Parameters

**EnvVar**

Type: [String](../Concepts.md#strings)

The name of the environment variable, e.g. `"Path"`.

**Value**

Type: [String](../Concepts.md#strings)

If omitted, the environment variable will be deleted. Otherwise, specify the value to write.

<a id="Error_Handling"></a>
## Error Handling

An [OSError](Error.md#OSError) is thrown on failure.

<a id="Remarks"></a>
## Remarks

The operating system limits each environment variable to 32 KB of text.

An environment variable created or changed with this function will be accessible only to programs the script launches via [Run](Run.md) or [RunWait](Run.md). See [environment variables](../Concepts.md#environment-variables) for more details.

This function exists because [normal script variables](../Variables.md) are not stored in the environment. This is because performance would be worse and also because the OS limits environment variables to 32 KB.

<a id="Related"></a>
## Related

[EnvGet](EnvGet.md), [Run / RunWait](Run.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Writes some text to an environment variable.

```ahk
EnvSet "AutGUI", "Some text to put in the environment variable."
```
