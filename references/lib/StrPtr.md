# StrPtr

Returns the current memory address of a string.

```ahk
Address := StrPtr(Value)
```

<a id="Parameters"></a>
## Parameters

**Value**

Type: [String](../Concepts.md#strings)

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the current memory address of *Value*.

<a id="Remarks"></a>
## Remarks

The lifetime of an address and which operations are valid to perform on it depend on how *Value* was passed to this function. There are three distinct cases, shown as example code below. In all cases, if the string will <u>not</u> be modified, the return value can be passed *directly* to a [DllCall](DllCall.md) function or [SendMessage](SendMessage.md).

```ahk
Ptr := StrPtr(MyVar)
```

If *Value* is a variable reference such as `MyVar` (and not a built-in variable), the return value is the memory address of the variable's internal string buffer. `VarSetStrCapacity(&MyVar)` returns the size of the buffer **in characters**, excluding the terminating null character.

The address should be considered valid *only* until the variable is freed or has been reassigned by means of any of the [assignment operators](../Variables.md#AssignOp) or by passing it to a built-in function. The address of the contents of a function's [local](../Functions.md#Local) variable is not valid after the function returns, as local variables are freed automatically.

The address can be stored in a [structure](DllCall.md#struct) or another variable, and passed indirectly to [DllCall](DllCall.md) or [SendMessage](SendMessage.md) or used in other ways, for as long as it remains valid as described above.

The script may change the value of the string indirectly by passing the address to [NumPut](NumPut.md), [DllCall](DllCall.md) or [SendMessage](SendMessage.md). If the length of the string is changed this way, the variable's internal length property must be updated by calling `VarSetStrCapacity(&MyVar, -1)`.

```ahk
Ptr := StrPtr("literal string")
```

The address of a literal string is valid until the program exits. The script should not attempt to modify the string. The address can be stored in a [structure](DllCall.md#struct) or another variable, and passed indirectly to [DllCall](DllCall.md) or [SendMessage](SendMessage.md) or used in other ways.

```ahk
SendMessage 0x000C, 0, StrPtr(A_ScriptName " changed this title"),, "A"
```

The address of a temporary string is valid only until evaluation of the overall expression or function call statement is completed, after which time it must not be used. For the example above, the address is valid until SendMessage returns. All of the following yield temporary strings:

- Concatenation.
- Built-in variables such as [A_ScriptName](../Variables.md#ScriptName).
- Functions which return strings.
- Accessing properties of an object, array elements or map elements.

If not explicitly covered above, it is safe to assume the string is temporary.

<a id="Related"></a>
## Related

[VarSetStrCapacity](VarSetStrCapacity.md), [DllCall](DllCall.md), [SendMessage](SendMessage.md), [Buffer object](Buffer.md), [NumPut](NumPut.md), [NumGet](NumGet.md)
