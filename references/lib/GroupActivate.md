# GroupActivate

Activates the next window in a window group that was defined with [GroupAdd](GroupAdd.md).

```ahk
HWND := GroupActivate(GroupName , Mode)
```

<a id="Parameters"></a>
## Parameters

**GroupName**

Type: [String](../Concepts.md#strings)

The name of the group to activate, as originally defined by [GroupAdd](GroupAdd.md).

**Mode**

Type: [String](../Concepts.md#strings)

If blank or omitted, the function activates the oldest window in the series. Otherwise, specify the following letter:

**R:** The newest window (the one most recently active) is activated, but only if no members of the group are active when the function is given. "R" is useful in cases where you temporarily switch to working on an unrelated task. When you return to the group via GroupActivate, [GroupDeactivate](GroupDeactivate.md), or [GroupClose](GroupClose.md), the window you were most recently working with is activated rather than the oldest window.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the [HWND (unique ID)](../misc/WinTitle.md#ahk_id) of the window selected for activation, or 0 if no matching windows were found to activate. If the current active window is the only match, the return value is 0.

<a id="Remarks"></a>
## Remarks

This function causes the first window that matches one of the group's window specifications to be activated. Using it a second time will activate the next window in the series and so on. Normally, it is assigned to a hotkey so that this window-traversal behavior is automated by pressing that key.

Each window is evaluated against the window group as a whole, without distinguishing between window specifications. *Mode* affects the order of activation across the entire group.

When a window is activated immediately after the activation of some other window, task bar buttons might start flashing on some systems (depending on OS and settings). To prevent this, use [#WinActivateForce](_WinActivateForce.md).

See [GroupAdd](GroupAdd.md) for more details about window groups.

<a id="Related"></a>
## Related

[GroupAdd](GroupAdd.md), [GroupDeactivate](GroupDeactivate.md), [GroupClose](GroupClose.md), [#WinActivateForce](_WinActivateForce.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Activates the newest window (the one most recently active) in a window group.

```ahk
GroupActivate "MyGroup", "R"
```
