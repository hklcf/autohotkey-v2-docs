# VarSetStrCapacity

Enlarges a variable's holding capacity or frees its memory. This is not normally needed, but may be used with [DllCall](DllCall.md) or [SendMessage](SendMessage.md) or to optimize repeated concatenation.

```ahk
GrantedCapacity := VarSetStrCapacity(&TargetVar , RequestedCapacity)
```

<a id="Parameters"></a>
## Parameters

**&TargetVar**

Type: [VarRef](../Concepts.md#variable-references)

A reference to a variable. For example: `VarSetStrCapacity(&MyVar, 1000)`. This can also be a dynamic variable such as `MyArray%i%` or a [function's ByRef parameter](../Functions.md#ByRef).

**RequestedCapacity**

Type: [Integer](../Concepts.md#numbers)

If omitted, the variable's current capacity will be returned and its contents will not be altered. Otherwise, anything currently in the variable is lost (the variable becomes blank).

Specify for *RequestedCapacity* the number of characters that the variable should be able to hold after the adjustment. *RequestedCapacity* does not include the internal zero terminator. For example, specifying 1 would allow the variable to hold up to one character in addition to its internal terminator. Note: the variable will auto-expand if the script assigns it a larger value later.

Since this function is often called simply to ensure the variable has a certain minimum capacity, for performance reasons, it shrinks the variable only when *RequestedCapacity* is 0. In other words, if the variable's capacity is already greater than *RequestedCapacity*, it will not be reduced (but the variable will still made blank for consistency).

Therefore, to explicitly shrink a variable, first free its memory with `VarSetStrCapacity(&Var, 0)` and then use `VarSetStrCapacity(&Var, NewCapacity)` -- or simply let it auto-expand from zero as needed.

For performance reasons, freeing a variable whose previous capacity was less than 64 characters might have no effect because its memory is of a permanent type. In this case, the current capacity will be returned rather than 0.

For performance reasons, the memory of a variable whose capacity is less than 4096 bytes is not freed by storing an empty string in it (e.g. `Var := ""`). However, `VarSetStrCapacity(&Var, 0)` does free it.

<a id="neg1"></a>

Specify -1 for *RequestedCapacity* to update the variable's internally-stored string length to the length of its current contents. This is useful in cases where the string has been altered indirectly, such as by passing its [address](StrPtr.md) via [DllCall](DllCall.md) or [SendMessage](SendMessage.md). In this mode, VarSetStrCapacity returns the length rather than the capacity.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the number of characters that *TargetVar* can now hold, which will be greater than or equal to *RequestedCapacity*.

<a id="Failure"></a>
## Failure

An exception is thrown under any of the following conditions:

- *TargetVar* is not a valid variable reference. It is not possible to pass an [object property](../Objects.md#Usage_Objects) or [built-in variable](../Variables.md#BuiltIn) by reference, and therefore not valid to pass one to this function.
- The requested capacity is too large to fit within any single contiguous memory block available to the script. In rare cases, this may be due to the system running out of memory.
- *RequestedCapacity* is less than -1 or greater than the capacity theoretically supported by the current platform.

<a id="Remarks"></a>
## Remarks

The [Buffer](Buffer.md) object offers superior clarity and flexibility when dealing with binary data, structures, DllCall and similar. For instance, a Buffer object can be assigned to a property or array element or be passed to or returned from a function without copying its contents.

This function can be used to enhance performance when building a string by means of gradual concatenation. This is because multiple automatic resizings can be avoided when you have some idea of what the string's final length will be. In such a case, *RequestedCapacity* need not be accurate: if the capacity is too small, performance is still improved and the variable will begin auto-expanding when the capacity has been exhausted. If the capacity is too large, some of the memory is wasted, but only temporarily because all the memory can be freed after the operation by means of `VarSetStrCapacity(&Var, 0)` or `Var := ""`.

<a id="Related"></a>
## Related

[Buffer object](Buffer.md), [DllCall](DllCall.md), [NumPut](NumPut.md), [NumGet](NumGet.md)

<a id="Examples"></a>
## Examples

<a id="ExConcat"></a>

**Example:** Optimize by ensuring *MyVar* has plenty of space to work with.

```ahk
VarSetStrCapacity(&MyVar, 5120000)  ; ~10 MB
Loop
{
    ; ...
    MyVar .= StringToConcatenate
    ; ...
}
```

<a id="ExDllCall"></a>

**Example:** Use a variable to receive a string from an external function via [DllCall](DllCall.md). (Note that the use of a [Buffer object](Buffer.md#ExString) may be preferred; in particular, when dealing with non-Unicode strings.)

```ahk
max_chars := 10

Loop 2
{
    ; Allocate space for use with DllCall.
    VarSetStrCapacity(&buf, max_chars)

    if (A_Index = 1)
        ; Alter the variable indirectly via DllCall.
        DllCall("wsprintf", "Ptr", StrPtr(buf), "Str", "0x%08x", "UInt", 4919, "CDecl")
    else
        ; Use "str" to update the length automatically:
        DllCall("wsprintf", "Str", buf, "Str", "0x%08x", "UInt", 4919, "CDecl")

    ; Concatenate a string to demonstrate why the length needs to be updated:
    wrong_str := buf . "<end>"
    wrong_len := StrLen(buf)

    ; Update the variable's length.
    VarSetStrCapacity(&buf, -1)

    right_str := buf . "<end>"
    right_len := StrLen(buf)

    MsgBox
    (
    "Before updating
      String: " wrong_str "
      Length: " wrong_len "

    After updating
      String: " right_str "
      Length: " right_len
    )
}
```
