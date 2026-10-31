# A_HotkeyModifierTimeout

*A_HotkeyModifierTimeout* is a [built-in variable](../Concepts.md#built-in-variables) that affects the behavior of [Send](Send.md) with [hotkey](../Hotkeys.md) modifiers `Ctrl`, `Alt`, `Win`, and `Shift`. Specifically, it defines how long after a hotkey is pressed that its modifier keys are assumed to still be held down. This is used by [Send](Send.md) to determine whether to push the modifier keys back down after having temporarily released them.

*A_HotkeyModifierTimeout* can be used to get or set an [integer](../Concepts.md#numbers) representing the length of the interval in milliseconds. If -1, it never times out (modifier keys are always pushed back down after the Send). If 0, it always times out (modifier keys are never pushed back down).

The default setting is 50 (ms).

<a id="Remarks"></a>
## Remarks

This variable has no effect when:

- Hotkeys send their keystrokes via the [SendInput](SendMode.md#Input) or [SendPlay](SendMode.md#Play) methods. This is because those methods postpone the user's physical pressing and releasing of keys until after the Send completes.
- The script has the keyboard hook installed (you can see if your script uses the hook via the "View-\>Key history" menu item in the [main window](../Program.md#main-window), or via the [KeyHistory](KeyHistory.md) function). This is because the hook can keep track of which modifier keys (Alt, Ctrl, Shift, and Win) the user is physically holding down and doesn't need to use the timeout.

To illustrate the effect of this variable, consider this example: `^!a::Send "abc"`.

When the [Send](Send.md) function executes, the first thing it does is release `Ctrl` and `Alt` so that the characters get sent properly. After sending all the keys, the function doesn't know whether it can safely push back down `Ctrl` and `Alt` (to match whether the user is still holding them down). But if less than the specified number of milliseconds have elapsed, it will assume that the user hasn't had a chance to release the keys yet and it will thus push them back down to match their physical state. Otherwise, the modifier keys will not be pushed back down and the user will have to release and press them again to get them to modify the same or another key.

The timeout should be set to a value less than the amount of time that the user typically holds down a hotkey's modifiers before releasing them. Otherwise, the modifiers may be restored to the down position (get stuck down) even when the user isn't physically holding them down.

You can reduce or eliminate the need for this variable with one of the following:

- Install the keyboard hook by calling [InstallKeybdHook](InstallKeybdHook.md).
- Use the [SendInput](SendMode.md#Input) or [SendPlay](SendMode.md#Play) methods rather than the traditional [SendEvent](SendMode.md#Event) method.
- When using the traditional [SendEvent](SendMode.md#Event) method, reduce [SetKeyDelay](SetKeyDelay.md) to 0 or -1, which should help because it sends the keystrokes more quickly.

<a id="Related"></a>
## Related

[GetKeyState](GetKeyState.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Sets the hotkey modifier timeout to 100 ms instead of 50 ms.

```ahk
A_HotkeyModifierTimeout := 100
```
