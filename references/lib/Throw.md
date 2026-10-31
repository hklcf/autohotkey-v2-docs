# Throw

Signals the occurrence of an error. This signal can be caught by a [Try](Try.md)-[Catch](Catch.md) statement.

```ahk
Throw Value
```

<a id="Parameters"></a>
## Parameters

**Value**

A value to throw; typically an [Error](Error.md) object. For example:

```ahk
throw ValueError("Parameter #1 invalid", -1, theBadParam)
```

Values of all kinds can be thrown, but if [Catch](Catch.md) is used without specifying a class (or [Try](Try.md) is used without [Catch](Catch.md) or [Finally](Finally.md)), it will only catch instances of the [Error](Error.md) class.

While execution is within a [Catch](Catch.md), *Value* can be omitted to re-throw the caught value (avoiding the need to specify an output variable just for that purpose). This is supported even within a nested *Try-Finally*, but not within a nested *Try-Catch*. The line with `throw` does not need to be physically contained by the *Catch* statement's body; it can be used by a called function.

<a id="Remarks"></a>
## Remarks

The space or tab after `throw` is optional if the expression is enclosed in parentheses, as in `throw(Error())`.

A thrown value or runtime error can be *caught* by [Try](Try.md)-[Catch](Catch.md). In such cases, execution is transferred into the *catch* statement or to the next statement after the *try*. If a thrown value is not caught, the following occurs:

- Any active [OnError](OnError.md) callbacks are called. Each callback may inspect *Value* and either suppress or allow further callbacks and default handling.
- By default, an error message is displayed based on what was thrown. If *Value* is an [Object](Object.md) and owns a value property named *Message*, its value is used as the message. If *Value* is a non-numeric string, it is used as the message. In any other case, a default message is used. If *Value* is numeric, it is shown below the default message.
- The thread exits. Note that this does not necessarily occur for continuable errors, but *throw* is never continuable.

<a id="Related"></a>
## Related

[Error Object](Error.md), [Try](Try.md), [Catch](Catch.md), [Finally](Finally.md), [OnError](OnError.md)

<a id="Examples"></a>
## Examples

See [Try](Try.md#Examples).
