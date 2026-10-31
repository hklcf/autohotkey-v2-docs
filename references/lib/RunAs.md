# RunAs

Specifies a set of user credentials to use for all subsequent [Run](Run.md) and [RunWait](Run.md) functions.

```ahk
RunAs User, Password, Domain
```

<a id="Parameters"></a>
## Parameters

**User**

Type: [String](../Concepts.md#strings)

If this and the other parameters are all omitted, the RunAs feature will be turned off, which restores [Run](Run.md) and [RunWait](Run.md) to their default behavior. Otherwise, specify the username under which new processes will be created.

**Password**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to a blank password. Otherwise, specify the *User*'s password. Note that passing blank passwords is not allowed by default, according to the OS policy "Accounts: Limit local account use of blank passwords to console logon only".

**Domain**

Type: [String](../Concepts.md#strings)

If blank or omitted, a local account will be used. Otherwise, specify *User*'s domain. If that fails to work, try using @YourComputerName.

<a id="Remarks"></a>
## Remarks

If the script is running with restricted privileges due to [User Account Control (UAC)](https://en.wikipedia.org/wiki/User_Account_Control), any programs it launches will typically also be restricted, even if RunAs is used. To elevate a process, use [Run \*RunAs](Run.md#RunAs) instead.

This function does nothing other than notify AutoHotkey to use (or not use) alternate user credentials for all subsequent [Run](Run.md) and [RunWait](Run.md) functions. The credentials are not validated by this function.

If an invalid *User*, *Password*, and/or *Domain* is specified, [Run](Run.md) and [RunWait](Run.md) will display an error message explaining the problem (unless this error is caught by a [Try](Try.md)/[Catch](Catch.md) statement).

While the RunAs feature is in effect, [Run](Run.md) and [RunWait](Run.md) will not able to launch documents, URLs, or system verbs. In other words, the file to be launched must be an executable file.

The "Secondary Logon" service must be set to manual or automatic for this function to work (the OS should automatically start it upon demand if set to manual).

<a id="Related"></a>
## Related

[Run](Run.md), [RunWait](Run.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Opens the registry editor as administrator.

```ahk
RunAs "Administrator", "MyPassword"
Run "RegEdit.exe"
RunAs  ; Reset to normal behavior.
```
