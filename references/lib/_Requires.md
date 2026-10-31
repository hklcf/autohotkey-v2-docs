# #Requires

Displays an error and quits if a version requirement is not met.

```ahk
#Requires Requirement
```

<a id="Parameters"></a>
## Parameters

**Requirement**

Type: [String](../Concepts.md#strings)

If this does not begin with the word "AutoHotkey", an error message is shown and the program exits. This encourages clarity and reserves the directive for future uses. Other forks of AutoHotkey may support other names.

Otherwise, the word "AutoHotkey" should be followed by any combination of the following, separated by spaces or tabs:

- An optional letter "v" followed by a version number. [A_AhkVersion](../Variables.md#AhkVersion) is required to be greater than or equal to this version, but less than the next major version.
- One of `<`, `<=`, `>`, `>=` or `=` immediately followed by an optional letter "v" and a version number. For example, `>=2-rc <2` allows v2 release candidates but not the final release.
- One of the following words to restrict the type of executable (EXE) which can run the script: "32-bit", "64-bit".

<a id="Error_Message"></a>
## Error Message

The message shown depends on the version of AutoHotkey interpreting the directive.

For v2, the path, version and build of AutoHotkey are always shown in the error message.

If the script is launched with a version of AutoHotkey that does not support this directive, the error message is something like the following:

```
Line Text: #Requires %Requirement%
Error: This line does not contain a recognized action.
```

<a id="Remarks"></a>
## Remarks

As the [launcher](../Program.md#launcher) enables the use of v1 and v2 scripts on one system, it is recommended that you add at least `#Requires AutoHotkey v1` for v1 scripts and `#Requires AutoHotkey v2` for v2 scripts. This will ensure that the correct version is used to run the script.

If the script uses syntax or functions which are unavailable in earlier versions, using this directive ensures that the error message shows the unmet requirement, rather than indicating an arbitrary syntax error. This cannot be done with something like `if (A_AhkVersion <= "1.1.33")` because a syntax error elsewhere in the script would prevent it from executing.

When sharing a script or posting code online, using this directive allows anyone who finds the code to readily identify which version of AutoHotkey it was intended for.

Other programs or scripts can check for this directive for various purposes. For example, the launcher installed with AutoHotkey v2 uses it to determine which AutoHotkey executable to launch, while a script editor or related tools might use it to determine how to interpret or highlight the script file.

<a id="compare"></a>

Version strings are compared as a series of dot-delimited components, optionally followed by a hyphen and pre-release identifier(s).

- Numeric components are compared numerically. For example, v1.01 = v1.1, but a20 \> a112.
- Numeric components are always considered lower than non-numeric components in the same position.
- Any missing dot-delimited components are assumed to be zero. For example, v1.1.33-alpha is the same as v1.1.33.00-alpha.0.
- Non-numeric components are compared alphabetically, and are case-sensitive.
- Pre-release versions are considered lower than standard releases. For example, a script that `#Requires AutoHotkey v2` will not run on v2.0-a112. To permit pre-release versions, include a hyphen suffix. For example: `v2.0-`.
- Any suffix beginning with "+" is ignored.

A trailing "+" is sufficient to indicate to the reader that later versions are acceptable, but is not required.

Like other directives, #Requires cannot be executed conditionally.

<a id="Related"></a>
## Related

[VerCompare](VerCompare.md), [#ErrorStdOut](_ErrorStdOut.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Causes the script to run only on v2.0, including alpha releases.

```ahk
#Requires AutoHotkey v2.0-a
MsgBox "This script will run only on v2.0, including alpha releases."
```

<a id="ExUpper"></a>

**Example:** Causes the script to run only on v2.0, including pre-release versions.

```ahk
#Requires AutoHotkey >=2.0- <2.1
```

<a id="ExBuild"></a>

**Example:** Causes the script to run only with a 64-bit interpreter (EXE).

```ahk
#Requires AutoHotkey 64-bit
```

<a id="ExVerBuild"></a>

**Example:** Causes the script to run only with a 64-bit interpreter (EXE) version 2.0-rc.2 or later.

```ahk
#Requires AutoHotkey v2.0-rc.2 64-bit
```
