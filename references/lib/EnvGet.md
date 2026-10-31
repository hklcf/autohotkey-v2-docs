# EnvGet

Retrieves the value of the specified [environment variable](../Concepts.md#environment-variables).

```ahk
Value := EnvGet(EnvVar)
```

<a id="Parameters"></a>
## Parameters

**EnvVar**

Type: [String](../Concepts.md#strings)

The name of the environment variable, e.g. `"Path"`.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns *EnvVar*'s value. If *EnvVar* has an empty value or does not exist, an empty string is returned.

<a id="Remarks"></a>
## Remarks

The operating system limits each environment variable to 32 KB of text.

This function exists because [normal script variables](../Variables.md) are not stored in the environment. This is because performance would be worse and also because the OS limits environment variables to 32 KB.

<a id="Related"></a>
## Related

[EnvSet](EnvSet.md), [Run / RunWait](Run.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves the value of an environment variable and stores it in *LogonServer*.

```ahk
LogonServer := EnvGet("LogonServer")
```

<a id="ExProgramFiles"></a>

**Example:** Retrieves and reports the path of the "Program Files" directory. See [RegRead example #2](RegRead.md#ExProgramFiles) for an alternative method.

```ahk
ProgramFilesDir := EnvGet(A_Is64bitOS ? "ProgramW6432" : "ProgramFiles")
MsgBox "Program files are in: " ProgramFilesDir
```

<a id="ExLocalAppData"></a>

**Example:** Retrieves and reports the path of the current user's Local AppData directory.

```ahk
LocalAppData := EnvGet("LocalAppData")
MsgBox A_UserName "'s Local directory is located at: " LocalAppData
```
