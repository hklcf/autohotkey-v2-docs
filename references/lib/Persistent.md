# Persistent

Prevents the script from exiting automatically when its last thread completes, allowing it to stay running in an idle state.

```ahk
PrevSetting := Persistent(Setting)
```

<a id="Parameters"></a>
## Parameters

**Setting**

Type: [Boolean](../Concepts.md#boolean)

If omitted, it defaults to true.

If **true**, the script will stay running after [startup](../Scripts.md#auto) completes and all other [threads](../misc/Threads.md) have exited, even if none of the other conditions for keeping the script running are met.

If **false**, the default behavior is restored.

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns the previous setting; either 0 (false) for disabled or 1 (true) for enabled.

<a id="Remarks"></a>
## Remarks

By default, the script is not persistent. However, it becomes persistent [automatically](../Scripts.md#persistent) under certain conditions, specifically in common cases where the user would want it to keep running, such as when responding to [hotkeys](../Hotkeys.md), executing [timers](SetTimer.md), or displaying a [GUI](Gui.md).

It is usually unnecessary to call this function, but there are some cases where it might be needed:

- Scripts which use [OnMessage](OnMessage.md) or [CallbackCreate](CallbackCreate.md) and [DllCall](DllCall.md) to respond to events, since those functions don't make the script persistent.
- Scripts that are executed by selecting a custom tray menu item.
- Scripts which [create](ComObject.md) or [retrieve](ComObjActive.md) COM objects and use [ComObjConnect](ComObjConnect.md) to respond to the object's events.

If this function is added to an existing script, some or all occurrences of [Exit](Exit.md) might need to be changed to [ExitApp](ExitApp.md). This is because [Exit](Exit.md) will not terminate a persistent script; it terminates only the [current thread](../misc/Threads.md).

<a id="Related"></a>
## Related

[Exit](Exit.md), [ExitApp](ExitApp.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Prevent the script from exiting automatically.

```ahk
; This script will not exit automatically, even though it has nothing to do.
; However, you can use its tray icon to open the script in an editor, or to
; launch Window Spy or the Help file.
Persistent
```
