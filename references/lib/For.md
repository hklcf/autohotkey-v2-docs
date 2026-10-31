# For-loop

Repeats one or more [statements](../Concepts.md#statement) once for each set of values in a sequence.

```ahk
For Value1, Value2 in Expression
```

<a id="Parameters"></a>
## Parameters

**Value1, Value2**

Type: [Variable](../Concepts.md#variables)

The variables in which to store the values returned by the enumerator at the beginning of each iteration. The nature of these values is defined by the enumerator, which is determined by *Expression*. These variables cannot be [dynamic](../Language.md#dynamic-variables).

When the loop breaks or completes, these variables are restored to their former values. If a loop variable is a [ByRef parameter](../Functions.md#ByRef), the target variable is unaffected by the loop. [Closures](../Functions.md#closures) which reference the variable (if local) are also unaffected and will see only the value it had outside the loop.

> **Note:** Even if defined inside the loop body, a nested function which refers to a loop variable cannot see or change the current iteration's value. Instead, pass the variable explicitly or [bind](Func.md#Bind) its value to a parameter.

Up to 19 variables are supported, if supported by the enumerator.

Variables can be omitted. For example, `for , value in myMap` calls *myMap*'s enumerator with only its second parameter, omitting its first parameter. If the enumerator is user-defined and the parameter is mandatory, an exception is thrown as usual. The parameter count passed to [\__Enum](../Objects.md#__Enum) is 0 if there are no variables or commas; otherwise it is 1 plus the number of commas present.

**Expression**

Type: [Enumerable](../Concepts.md#enumerable)

An [expression](../Variables.md#Expressions) which results in an enumerable value, or a variable which contains an enumerable value.

<a id="Remarks"></a>
## Remarks

The parameter list can optionally be enclosed in parentheses. For example: `for (val in myarray)`

The process of enumeration is as follows:

- Before the loop begins, *Expression* is evaluated to determine the target object.
- The object's \__Enum method is called to retrieve an [*enumerator*](Enumerator.md) object. If no such method exists, the object itself is assumed to be an enumerator object.
- At the beginning of each iteration, the enumerator is [called](Enumerator.md#Call) to retrieve the next value or pair of values. If it returns false (zero or an empty string), the loop terminates.

Although not exactly equivalent to a for-loop, the following demonstrates this process:

```ahk
_enum := Expression
try _enum := _enum.__Enum(2)
while _enum(&Value1, &Value2)
{
    ...
}
```

As in the code above, an exception is thrown if *Expression* or \__Enum yields a value which cannot be called.

While enumerating properties, methods or array elements, it is generally unsafe to insert or remove items of that type. Doing so may cause some items to be skipped or enumerated multiple times. One workaround is to build a list of items to remove, then use a second loop to remove the items after the first loop completes.

A for-loop is usually followed by a [block](Block.md), which is a collection of statements that form the *body* of the loop. However, a loop with only a single statement does not require a block (an "if" and its "else" count as a single statement for this purpose). The One True Brace (OTB) style may optionally be used, which allows the open-brace to appear on the same line rather than underneath. For example: `for x, y in z {`.

As with all loops, [Break](Break.md), [Continue](Continue.md) and [A_Index](../Variables.md#Index) may be used.

The loop may optionally be followed by an [Else](Else.md) statement, which is executed if the loop had zero iterations.

<a id="COM_Objects"></a>
## COM Objects

Since *Value1* and *Value2* are passed directly to the enumerator, the values they are assigned depends on what type of object is being enumerated. For COM objects, *Value1* contains the value returned by [IEnumVARIANT::Next()](https://learn.microsoft.com/windows/win32/api/oaidl/nf-oaidl-ienumvariant-next) and *Value2* contains a number which represents its [variant type](https://learn.microsoft.com/openspecs/windows_protocols/ms-oaut/3fe7db9f-5803-4dc4-9d14-5425d3f5461f). For example, when used with a [Scripting.Dictionary](https://learn.microsoft.com/previous-versions/x4k5wbx4(v=vs.85)) object, each *Value1* contains a key from the dictionary and *Value2* is typically 8 for strings and 3 for integers. See [ComObjType](ComObjType.md) for a list of type codes.

When enumerating a [SafeArray](ComObjArray.md), *Value1* contains the current element and *Value2* contains its variant type.

<a id="Related"></a>
## Related

[Enumerator object](Enumerator.md), [OwnProps](Object.md#OwnProps), [While-loop](While.md), [Loop](Loop.md), [Until](Until.md), [Break](Break.md), [Continue](Continue.md), [Blocks](Block.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Lists the properties owned by an object.

```ahk
colors := {red: 0xFF0000, blue: 0x0000FF, green: 0x00FF00}
; The above expression could be used directly in place of "colors" below:
s := ""
for k, v in colors.OwnProps()
    s .= k "=" v "`n"
MsgBox s
```

<a id="ExCOM"></a>

**Example:** Lists all open Explorer and Internet Explorer windows, using the [Shell](https://learn.microsoft.com/windows/win32/shell/shell) object.

```ahk
windows := ""
for window in ComObject("Shell.Application").Windows
    windows .= window.LocationName " :: " window.LocationURL "`n"
MsgBox windows
```

<a id="ExFibF"></a>

**Example:** Defines an enumerator as a [fat arrow function](../Variables.md#fat-arrow). Returns numbers from the Fibonacci sequence, indefinitely or until stopped.

```ahk
for n in FibF()
    if MsgBox("#" A_Index " = " n "`nContinue?",, "y/n") = "No"
        break

FibF() {
    a := 0, b := 1
    return (&n) => (
        n := c := b, b += a, a := c,
        true
    )
}
```

<a id="ExFibC"></a>

**Example:** Defines an enumerator as a [class](../Objects.md#Custom_Classes). Equivalent to the [previous example](#ExFibF).

```ahk
for n in FibC()
    if MsgBox("#" A_Index " = " n "`nContinue?",, "y/n") = "No"
        break

class FibC {
    a := 0, b := 1
    Call(&n) {
        n := c := this.b, this.b += this.a, this.a := c
        return true
    }
}
```
