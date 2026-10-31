# Exit

Exits the [current thread](../misc/Threads.md).

```ahk
Exit ExitCode
```

<a id="Parameters"></a>
## Parameters

**ExitCode**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 0 (zero is traditionally used to indicate success). Otherwise, specify an integer between -2147483648 and 2147483647 that is returned to its caller when the script exits. This code is accessible to any program that spawned the script, such as another script (via RunWait) or a batch (.bat) file.

<a id="Remarks"></a>
## Remarks

The Exit function terminates only the [current thread](../misc/Threads.md). In other words, the stack of functions called directly or indirectly by a [menu](Menu.md), [timer](SetTimer.md), or [hotkey](../Hotkeys.md) function will all be returned from as though a [Return](Return.md) were immediately encountered in each. If used directly inside such a function -- or in [global code](../Language.md#global-code) -- Exit is equivalent to [Return](Return.md).

If the script is not [persistent](../Scripts.md#persistent) and this is the last thread, the script will terminate after the thread exits.

Use [ExitApp](ExitApp.md) to completely terminate a script that is [persistent](../Scripts.md#persistent).

<a id="Related"></a>
## Related

[ExitApp](ExitApp.md), [OnExit](OnExit.md), [Functions](../Functions.md), [Return](Return.md), [Threads](../misc/Threads.md), [Persistent](Persistent.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** In this example, the Exit function terminates the call_exit function as well as the calling function.

```ahk
#z::
{
    call_exit
    MsgBox "This MsgBox will never happen because of the Exit."
    call_exit()
    {
        Exit ; Terminate this function as well as the calling function.
    }
}
```
