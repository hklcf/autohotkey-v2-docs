# GroupClose

Closes the active window if it was just activated by [GroupActivate](GroupActivate.md) or [GroupDeactivate](GroupDeactivate.md). It then activates the next window in the series. It can also close all windows in a group.

```ahk
GroupClose GroupName , Mode
```

<a id="Parameters"></a>
## Parameters

**GroupName**

Type: [String](../Concepts.md#strings)

The name of the group as originally defined by [GroupAdd](GroupAdd.md).

**Mode**

Type: [String](../Concepts.md#strings)

If blank or omitted, the function closes the active window and activates the oldest window in the series. Otherwise, specify one of the following letters:

**R:** The newest window (the one most recently active) is activated, but only if no members of the group are active when the function is given. "R" is useful in cases where you temporarily switch to working on an unrelated task. When you return to the group via [GroupActivate](GroupActivate.md), [GroupDeactivate](GroupDeactivate.md), or GroupClose, the window you were most recently working with is activated rather than the oldest window.

**A:** All members of the group will be closed. This is the same effect as `WinClose "ahk_group GroupName"`.

<a id="Remarks"></a>
## Remarks

When the *Mode* parameter is not "A", the behavior of this function is determined by whether the previous action on *GroupName* was [GroupActivate](GroupActivate.md) or [GroupDeactivate](GroupDeactivate.md). If it was [GroupDeactivate](GroupDeactivate.md), this function will close the active window only if it is <u>not</u> a member of the group (otherwise it will do nothing). If it was [GroupActivate](GroupActivate.md) or nothing, this function will close the active window only if it <u>is</u> a member of the group (otherwise it will do nothing). This behavior allows GroupClose to be assigned to a hotkey as a companion to *GroupName*'s [GroupActivate](GroupActivate.md) or [GroupDeactivate](GroupDeactivate.md) hotkey.

When the active window closes, the system typically activates the next most recently active window. If the newly active window is a match for the same window specification as the window that was just closed, it is left active even though the default *Mode* would normally dictate that the <u>oldest</u> window should be activated next. If the newly active window is a match for <u>any</u> of the group's window specifications, it is left active.

See [GroupAdd](GroupAdd.md) for more details about window groups.

<a id="Related"></a>
## Related

[GroupAdd](GroupAdd.md), [GroupActivate](GroupActivate.md), [GroupDeactivate](GroupDeactivate.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Closes the active window activated by [GroupActivate](GroupActivate.md) or [GroupDeactivate](GroupDeactivate.md) and activates the newest window (the one most recently active) in a window group.

```ahk
GroupClose "MyGroup", "R"
```
