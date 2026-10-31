# ListHotkeys

Displays the hotkeys in use by the current script, whether their subroutines are currently running, and whether or not they use the [keyboard](InstallKeybdHook.md) or [mouse](InstallMouseHook.md) hook.

```ahk
ListHotkeys
```

This function is equivalent to selecting the View-\>Hotkeys menu item in the [main window](../Program.md#main-window).

If a hotkey has been disabled via the [Hotkey](Hotkey.md) function, it will be listed as OFF or PART ("PART" means that only some of the hotkey's [variants](Hotkey.md#variant) are disabled).

If any of a hotkey's variants have a non-zero [#InputLevel](_InputLevel.md), the level (or minimum and maximum levels) are displayed.

If any of a hotkey's subroutines are currently running, the total number of threads is displayed for that hotkey.

Finally, the type of hotkey is also displayed, which is one of the following:

- reg: The hotkey is implemented via the operating system's RegisterHotkey() function.
- reg(no): Same as above except that this hotkey is inactive (due to being unsupported, disabled, or [suspended](Suspend.md)).
- k-hook: The hotkey is implemented via the [keyboard hook](InstallKeybdHook.md).
- m-hook: The hotkey is implemented via the [mouse hook](InstallMouseHook.md).
- 2-hooks: The hotkey requires both the hooks mentioned above.
- joypoll: The hotkey is implemented by polling the controller at regular intervals.

<a id="Related"></a>
## Related

[InstallKeybdHook](InstallKeybdHook.md), [InstallMouseHook](InstallMouseHook.md), [#UseHook](_UseHook.md), [KeyHistory](KeyHistory.md), [ListLines](ListLines.md), [ListVars](ListVars.md), [#MaxThreadsPerHotkey](_MaxThreadsPerHotkey.md), [A_MaxHotkeysPerInterval](A_MaxHotkeysPerInterval.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Displays information about the hotkeys used by the current script.

```ahk
ListHotkeys
```
