# Error Object

```ahk
class Error extends Object
```

Error objects are [thrown](Throw.md) by built-in code when a runtime error occurs, and may also be thrown explicitly by the script.

Error objects can be created with [Error()](#Call) and retrieved with [Catch](Catch.md).

"ErrorObj" is used below as a placeholder for any Error object, as "Error" is the class itself.

In addition to the methods and properties inherited from [Object](Object.md), Error objects have the following predefined methods and properties.

<a id="toc"></a>
## Table of Contents

- [Static Methods](#Static_Methods):
    - [Call](#Call): Creates an Error object.
- [Properties](#Properties):
    - [Extra](#Extra): Gets or sets a string relating to the error.
    - [File](#File): Gets or sets the path of the script file containing the line at which the error occurred.
    - [Line](#Line): Gets or sets the line number at which the error occurred.
    - [Message](#Message): Gets or sets the error message.
    - [Stack](#Stack): Gets or sets the call stack when the Error object was constructed.
    - [What](#What): Gets or sets the source that threw the exception.
- General:
    - [Error Types](#error-types)
    - [Remarks](#Remarks)
    - [Related](#Related)

<a id="Static_Methods"></a>
## Static Methods

<a id="new"></a>

<a id="Call"></a>

### Call

Creates an Error object.

```ahk
ErrorObj := Error(Message , What, Extra)
ErrorObj := Error.Call(Message , What, Extra)
```

*Error* may be replaced with one of the subclasses listed under [Error Types](#error-types), although some subclasses may take different parameters.

The parameters directly correspond to the [Message](#Message), [What](#What), and [Extra](#Extra) properties, but may differ for Error subclasses which override the \__New method.

*Message* and *Extra* are converted to strings. These are displayed by an error dialog if the exception is thrown and not caught.

*What* indicates the source of the error. It can be an arbitrary string, but should be a negative integer or the name of a running function. Specifying -1 indicates the current function, -2 indicates the function which called it, and so on. If the script is [compiled](../Scripts.md#ahk2exe) or the value does not identify a valid stack frame, the value is merely converted to a string and assigned to `NewError.What`. Otherwise, the identified stack frame is used as follows to determine the other properties:

- `NewError.What` contains the name of the function.
- `NewError.Line` and `NewError.File` indicate the line which *called* the function.
- `NewError.Stack` contains a partial stack trace, with the indicated stack frame at the top.

Use of the *What* parameter can allow a complex function to use helper functions to perform its work or parameter validation, while omitting those internal details from any reported error information. For example:

```ahk
MyFunction(a, b) {
    CheckArg "a", a
    CheckArg "b", b
    ;...
    CheckArg(name, value) {
        if value < 0
            throw ValueError(name " is negative", "myfunction", value)
    }
}

try
    MyFunction(1, -1)  ; err.Line indicates this line.
catch ValueError as err
    MsgBox Format("{1}: {2}.`n`nFile:`t{3}`nLine:`t{4}`nWhat:`t{5}`nStack:`n{6}"
        , type(err), err.Message, err.File, err.Line, err.What, err.Stack)
```

```ahk
try
    SomeFunction()
catch as e
    MsgBox(type(e) " in " e.What ", which was called at line " e.Line)

SomeFunction() {
    throw Error("Fail", -1)
}
```

<a id="Standard_Properties"></a>

<a id="Properties"></a>
## Properties

<a id="Extra"></a>

### Extra

Gets or sets a string relating to the error.

```ahk
CurrentExtra := ErrorObj.Extra
```

```ahk
ErrorObj.Extra := NewExtra
```

The standard error dialog displays a line with "Specifically:" followed by this string.

<a id="File"></a>

### File

Gets or sets the full path of the script file containing the line at which the error occurred, or at which the Error object was constructed.

```ahk
CurrentFile := ErrorObj.File
```

```ahk
ErrorObj.File := NewFile
```

<a id="Line"></a>

### Line

Gets or sets the line number at which the error occurred, or at which the Error object was constructed.

```ahk
CurrentLine := ErrorObj.Line
```

```ahk
ErrorObj.Line := NewLine
```

<a id="Message"></a>

### Message

Gets or sets the error message.

```ahk
CurrentMessage := ErrorObj.Message
```

```ahk
ErrorObj.Message := NewMessage
```

<a id="Stack"></a>

### Stack

Gets or sets a string representing the call stack at the time the Error object was constructed.

```ahk
CurrentStack := ErrorObj.Stack
```

```ahk
ErrorObj.Stack := NewStack
```

Each line may be formatted as follows:

**``File (Line) : [What] SourceCode`r`n``**

Represents a call to the function

*What*

.

*File*

and

*Line*

indicate the current script line at this stack depth.

*SourceCode*

is an approximation of the source code at that line, as it would be shown in

ListLines

.

**``> What`r`n``**

Represents the launching of a thread, typically the direct cause of the function call above it.

**`... N more`**

Indicates that the stack trace was truncated, and there are

*N*

more stack entries not shown. Currently the

`Stack`

property cannot exceed 2047 characters.

<a id="What"></a>

### What

Gets or sets the source that threw the exception.

```ahk
CurrentWhat := ErrorObj.What
```

```ahk
ErrorObj.What := NewWhat
```

This is usually the name of a function, but is blank for exceptions thrown due to an error in an expression (such as using a math operator on a non-numeric value).

## Error Types

The following subclasses of **Error** are predefined:

- <a id="MemoryError"></a> **MemoryError:** A memory allocation failed.
- <a id="OSError"></a> **OSError:** An internal function call to a Win32 function failed. **Message** includes an error code and description generated by the operating system. OSErrors have an additional **Number** property which contains the error code. Calling `OSError(Code)` where *Code* is numeric sets *Number* and *Message* based on the given OS-defined error code. If *Code* is omitted, it defaults to [A_LastError](../Variables.md#LastError). For example, `OSError(5).Message` returns "(5) Access is denied."
- <a id="TargetError"></a> **TargetError:** A function failed because its target could not be found. **Message** indicates what kind of target, such as a window, control, menu or status bar.
- <a id="TimeoutError"></a> **TimeoutError:** [SendMessage](SendMessage.md) timed out.
- <a id="TypeError"></a> **TypeError:** An unexpected type of value was used as input for a function, property assignment, or some other operation. Usually **Message** indicates the expected and actual type, and **Extra** contains a string representing the errant value.
- <a id="UnsetError"></a> **UnsetError:** An attempt was made to read the value of a variable, property or item, but there was no value.
    - <a id="MemberError"></a> **MemberError**
        - <a id="PropertyError"></a> **PropertyError**
        - <a id="MethodError"></a> **MethodError**
    - <a id="UnsetItemError"></a> **UnsetItemError**
- <a id="ValueError"></a> **ValueError:** An unexpected value was used as input for a function, property assignment, or some other operation. Usually **Message** indicates which expectation was broken, and **Extra** contains a string representing the errant value.
    - <a id="IndexError"></a> **IndexError:** The index parameter of an object's [\__Item property](../Objects.md#__Item) was invalid or out of range.
- <a id="ZeroDivisionError"></a> **ZeroDivisionError:** Division by zero was attempted in an expression or with the Mod function.

Errors are also thrown using the base Error class.

<a id="Remarks"></a>
## Remarks

The standard error dialog requires the Message, Extra, File and Line properties to be [own value properties](Object.md).

<a id="Related"></a>
## Related

[Throw](Throw.md), [Try](Try.md), [Catch](Catch.md), [Finally](Finally.md), [OnError](OnError.md)
