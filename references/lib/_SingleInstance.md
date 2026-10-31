# #SingleInstance

Determines whether a script is allowed to run again when it is already running.

```ahk
#SingleInstance ForceIgnorePromptOff
```

<a id="Parameters"></a>
## Parameters

**ForceIgnorePromptOff**

Type: [String](../Concepts.md#strings)

If omitted, it defaults to *Force*. Otherwise, specify one of the following words:

**Force:** Skips the dialog box and replaces the old instance automatically, which is similar in effect to the [Reload](Reload.md) function.

**Ignore:** Skips the dialog box and leaves the old instance running. In other words, attempts to launch an already-running script are ignored.

**Prompt:** Displays a dialog box asking whether to keep the old instance or replace it with the new one.

**Off:** Allows multiple instances of the script to run concurrently.

<a id="Remarks"></a>
## Remarks

If this directive is unspecified in a script, it will behave as though set to *Prompt*.

This directive is ignored when any of the following [command line switches](../Scripts.md#cmd) are used: /force /restart

Like other directives, #SingleInstance cannot be executed conditionally.

<a id="Limitations"></a>
## Limitations

Previous instances of the script are identified by searching for a [main window](../Program.md#main-window) with the [default title](../Program.md#title). Therefore, a previous instance may not be found if:

- The title of its main window has been changed.
- It is running on a different version of AutoHotkey.
- Its main window is no longer top-level, such as if the script has used [SetParent](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-setparent) to change its parent to something other than NULL (0).

At most one previous instance is detected and sent a message asking it to close. Therefore, the following additional limitations also apply:

- If there are multiple instances (such as if previous instances of the script used the `#SingleInstance Off` mode), the topmost matching instance is sent the message, and other instances are not considered.
- If the previous instance is running at a higher integrity level than the new instance (where running as administrator \> [running with UI access](../Program.md#Installer_uiAccess) \> normal), it cannot be closed due to security restrictions.

If multiple instances of the script are started simultaneously, they may fail to detect each other or may all target the same previous instance. This would result in multiple instances of the script starting.

<a id="Related"></a>
## Related

[Reload](Reload.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Skips the dialog box and replaces the old instance automatically.

```ahk
#SingleInstance Force
```
