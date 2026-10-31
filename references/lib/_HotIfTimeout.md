# #HotIfTimeout

Sets the maximum time that may be spent evaluating a single [#HotIf](_HotIf.md) expression.

```ahk
#HotIfTimeout Timeout
```

<a id="Parameters"></a>
## Parameters

**Timeout**

Type: [Integer](../Concepts.md#numbers)

The timeout value to apply globally, in milliseconds.

<a id="Remarks"></a>
## Remarks

If this directive is unspecified in the script, it will behave as though set to 1000 (milliseconds).

A timeout is implemented to prevent long-running expressions from stalling keyboard input processing. If the timeout value is exceeded, the expression continues to evaluate, but the keyboard hook continues as if the expression had already returned false.

<a id="LowLevelHooksTimeout"></a>

Note that the system implements its own timeout, defined by the DWORD value *LowLevelHooksTimeout* in the following registry key:

**HKEY_CURRENT_USER\Control Panel\Desktop**

If the system timeout value is exceeded, the system may stop calling the script's keyboard hook, thereby preventing hook hotkeys from working until the hook is re-registered or the script is [reloaded](Reload.md). The hook can *usually* be re-registered by [suspending](Suspend.md) and un-suspending all hotkeys.

Microsoft's documentation is unclear about the details of this timeout, but research indicates the following for Windows 7 and later: If *LowLevelHooksTimeout* is not defined, the default timeout is 300 ms. The hook may time out up to 10 times, but is silently removed if it times out an 11th time.

If a given hotkey has multiple #HotIf variants, the timeout might be applied to each variant independently, making it more likely that the system timeout will be exceeded. This may be changed in a future update.

Like other directives, #HotIfTimeout cannot be executed conditionally.

<a id="Related"></a>
## Related

[#HotIf](_HotIf.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Sets the #HotIf timeout to 10 ms instead of 1000 ms.

```ahk
#HotIfTimeout 10
```
