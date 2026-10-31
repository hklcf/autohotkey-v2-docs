# Concepts and Conventions

This document covers some general concepts and conventions used by AutoHotkey, with focus on explanation rather than code. The reader is not assumed to have any prior knowledge of scripting or programming, but should be prepared to learn new terminology.

For more specific details about syntax, see [Scripting Language](Language.md).

<a id="toc"></a>
## Table of Contents

- [Values](#values)
    - [Strings](#strings)
    - [Numbers](#numbers)
    - [Boolean](#boolean)
    - [Nothing](#nothing)
    - [Objects](#objects)
    - [Object Protocol](#object-protocol)
    - [Enumerable](#enumerable)
- [Variables](#variables)
    - [Uninitialized Variables](#uninitialized-variables)
    - [Built-in Variables](#built-in-variables)
    - [Environment Variables](#environment-variables)
    - [Variable References (VarRef)](#variable-references)
    - [Caching](#caching)
- [Functions](#functions)
    - [Methods](#methods)
- [Control Flow](#control-flow)
- [Details](#details)
    - [String Encoding](#string-encoding)
    - [Pure Numbers](#pure-numbers)
    - [Names](#names)
    - [References to Objects](#references-to-objects)

## Values

A *value* is simply a piece of information within a program. For example, the name of a key to send or a program to run, the number of times a hotkey has been pressed, the title of a window to activate, or whatever else has some meaning within the program or script.

AutoHotkey supports these types of values:

- [Strings](#strings) (text)
- [Numbers](#numbers) (integers and floating-point numbers)
- [Objects](#objects)

The [Type](lib/Type.md) function can be used to determine the type of a value.

Some other related concepts:

- [Boolean](#boolean)
- [Nothing](#nothing)

### Strings

A *string* is simply text. Each string is actually a sequence or *string* of characters, but can be treated as a single entity. The *length* of a string is the number of characters in the sequence, while the *position* of a character in the string is merely that character's sequential number. By convention in AutoHotkey, the first character is at position 1.

<a id="numeric-strings"></a>

**Numeric strings:** A string of digits (or any other supported [number format](#numbers)) is automatically interpreted as a number when a math operation or comparison requires it.

How literal text should be written within the script depends on the context. For instance, in an expression, [strings](Language.md#strings) must be enclosed in quotation marks. In directives (excluding #HotIf) and auto-replace hotstrings, quotation marks are not needed.

For a more detailed explanation of how strings work, see [String Encoding](#string-encoding).

### Numbers

AutoHotkey supports these number formats:

- Decimal integers, such as `123`, `00123` or `-1`.
- Hexadecimal integers, such as `0x7B`, `0x007B` or `-0x1`.
- Decimal floating-point numbers, such as `3.14159`.

Hexadecimal numbers must use the `0x` or `0X` prefix, except where noted in the documentation. This prefix must be written after the `+` or `-` sign, if present, and before any leading zeroes. For example, `0x001` is valid, but `000x1` is not.

Numbers written with a decimal point are always considered to be floating-point, even if the fractional part is zero. For example, `42` and `42.0` are usually interchangeable, but not always. Scientific notation is also recognized (e.g. `1.0e4` and `-2.1E-4`), but always produces a floating-point number even if no decimal point is present.

The decimal separator is always a dot, even if the user's regional settings specify a comma.

<a id="number-default-format"></a>

When a number is converted to a string, it is formatted as decimal. Floating-point numbers are formatted with full precision (but discarding redundant trailing zeroes), which may in some cases reveal their [inaccuracy](#float-imprecision). Use the [Format](lib/Format.md) function to produce a numeric string in a different format. Floating-point numbers can also be formatted by using the [Round](lib/Math.md#Round) function.

For details about the range and accuracy of numeric values, see [Pure Numbers](#pure-numbers).

### Boolean

A *boolean* value can be either *true* or *false*. Boolean values are used to represent anything that has exactly two possible states, such as the *truth* of an expression. For example, the expression `(x <= y)` is *true* when x has lesser or equal value to y. A boolean value could also represent *yes* or *no*, *on* or *off*, *down* or *up* (such as for [GetKeyState](lib/GetKeyState.md)) and so on.

AutoHotkey does not have a specific boolean type, so it uses the integer value `0` to represent false and `1` to represent true. When a value is required to be either true or false, a blank or zero value is considered false and all other values are considered true. (Objects are always considered true.)

The words `true` and `false` are [built-in variables](#built-in-variables) containing 1 and 0. They can be used to make a script more readable.

### Nothing

AutoHotkey does not have a value which uniquely represents *nothing*, *null*, *nil* or *undefined*, as seen in other languages.

Instead of producing a "null" or "undefined" value, any attempt to read a variable, property, array element or map item which has no value causes an [UnsetError](lib/Error.md#UnsetError) to be thrown. This allows errors to be identified more easily than if a null value was implicitly allowed to propagate through the code. See also: [Uninitialized Variables](#uninitialized-variables).

A function's [optional parameters](Language.md#optional-parameters) can be *omitted* when the function is called, in which case the function may change its behavior or use a default value. Parameters are usually omitted by literally omitting them from the code, but can also be omitted explicitly or conditionally by using the `unset` keyword. This special signal can only be propagated explicitly, with the [maybe operator (*var***?**)](Variables.md#maybe). An unset parameter automatically receives its default value (if any) before the function executes.

Mainly for historical reasons, an empty string is sometimes used wherever a null or undefined value would be used in other languages, such as for functions which have no explicit return value.

If a [variable](#variables) or [parameter](#parameters) is said to be "empty" or "blank", that usually means an empty string (a string of zero length). This is not the same as omitting a parameter, although it may have the same effect in some cases.

### Objects

The *object* is AutoHotkey's composite or abstract data type. An object can be composed of any number of *properties* (which can be retrieved or set) and [*methods*](#methods) (which can be called). The name and effect of each property or method depends on the specific object or type of object.

Objects have the following attributes:

- Objects are not contained; they are [referenced](#references-to-objects). For example, `alpha := []` creates a new [Array](lib/Array.md) and stores a reference in *alpha*. `bravo := alpha` copies the reference (not the object) to `bravo`, so both refer to the same object. When an array or variable is said to contain an object, what it actually contains is a reference to the object.
- Two object references compare equal only if they refer to the same object.
- Objects are always considered *true* when a boolean value is required, such as in `if obj`, `!obj` or `obj ? x : y`.
- Each object has a unique address (location in memory), which can be retrieved by the [ObjPtr](Objects.md#ObjPtr) function, but is typically not used directly. This address uniquely identifies the object, but only until the object is freed.

> **Note:** All objects which derive from [Object](lib/Object.md) have additional shared behavior, properties and methods.

Some ways that objects are used include:

- To contain a collection of items or *elements*. For example, an [Array](lib/Array.md) contains a sequence of items, while a [Map](lib/Map.md) associates keys with values. Objects allow a group of values to be treated as one value, to be assigned to a single variable, passed to or returned from a function, and so on.
- To represent something real or conceptual. For example: a position on the screen, with X and Y properties; a contact in an address book, with Name, PhoneNumber, EmailAddress and so on. Objects can be used to represent more complex sets of information by combining them with other objects.
- To encapsulate a service or set of services, allowing other parts of the script to focus on a task rather than how that task is carried out. For example, a [File](lib/File.md) object provides methods to read data from a file or write data to a file. If a script function which writes information to a file accepts a File object as a parameter, it needs not know how the file was opened. The same function could be reused to write information to some other target, such as a TCP/IP socket or WebSocket (via user-defined objects).
- A combination of the above. For example, a [Gui](lib/Gui.md) represents a GUI window; it provides a script with the means to create and display a graphical user interface; it contains a collection of controls, and provides information about the window via properties such as Title and FocusedCtrl.

The proper use of objects (and in particular, [classes](Objects.md#Custom_Classes)) can result in code which is *modular* and *reusable*. Modular code is usually easier to test, understand and maintain. For instance, one can improve or modify one section of code without having to know the details of other sections, and without having to make corresponding changes to those sections. Reusable code saves time, by avoiding the need to write and test code for the same or similar tasks over and over.

### Object Protocol

> This section builds on these concepts which are covered in later sections: [variables](#variables), [functions](#functions)

Objects work through the principle of *message passing*. You don't know where an object's code or variables actually reside, so you must pass a message to the object, like "give me *foo*" or "go do *bar*", and rely on the object to respond to the message. Objects in AutoHotkey support the following basic messages:

- **Get** a property.
- **Set** a property, denoted by `:=`.
- **Call** a [method](#methods), denoted by `()`.

A *property* is simply some aspect of the object that can be set and/or retrieved. For example, [Array](lib/Array.md) has a [Length](lib/Array.md#Length) property which corresponds to the number of elements in the array. If you define a property, it can have whatever meaning you want. Generally a property acts like a [variable](#variables), but its value might be calculated on demand and not actually stored anywhere.

Each message contains the following, usually written where the property or method is [called](#call):

- The name of the property or method.
- Zero or more [parameters](#parameters) which may affect what action is carried out, how a value is stored, or which value is returned. For example, a property might take an array index or key.

For example:

```ahk
myObj.methodName(arg1)
value := myObj.propertyName[arg1]
```

An object may also have a *default* property, which is invoked when square brackets are used without a property name. For example:

```ahk
value := myObj[arg1]
```

Generally, **Set** has the same meaning as an assignment, so it uses the same operator:

```ahk
myObj.name := value
myObj.name[arg1, arg2, ..., argN] := value
myObj[arg1, arg2, ..., argN] := value
```

### Enumerable

An "enumerable" value is any value which can be passed to a [For-loop](lib/For.md) to operate on a sequence of values. To be enumerable, a value must have either an [\__Enum method](Objects.md#__Enum) or an [enumerator-compatible Call method](lib/Enumerator.md#Call). Some examples of standard enumerable values are:

- [Arrays](lib/Array.md), where each iteration returns a single element.
- [Maps](lib/Map.md), where each iteration returns a key and value.
- [Gui](lib/Gui.md), where each iteration returns one of the Gui's controls.

## Variables

A variable allows you to use a name as a placeholder for a value. Which value that is could change repeatedly during the time your script is running. For example, a hotkey could use a variable `press_count` to count the number of times it is pressed, and send a different key whenever `press_count` is a multiple of 3 (every third press). Even a variable which is only assigned a value once can be useful. For example, a `WebBrowserTitle` variable could be used to make your code easier to update when and if you were to change your preferred web browser, or if the [title](misc/WinTitle.md) or [window class](misc/WinTitle.md#ahk_class) changes due to a software update.

In AutoHotkey, variables are created simply by using them. Each variable is *not* permanently restricted to a single [data type](#values), but can instead hold a value of any type: string, number or object. Attempting to read a variable which has not been assigned a value is considered an error, so it is important to [initialize variables](#uninitialized-variables).

A variable has three main aspects:

- The variable's *name*.
- The variable itself.
- The variable's *value*.

Certain restrictions apply to variable names - see [Names](#names) for details. In short, it is safest to stick to names consisting of ASCII letters (which are case-insensitive), digits and underscore, and to avoid using names that start with a digit.

<a id="scope"></a>

A variable name has ***scope***, which defines where in the code that name can be used to refer to that particular variable; in other words, where the variable is *visible*. If a variable is not visible within a given scope, the same name can refer to a different variable. Both variables might exist at the same time, but only one is visible to each part of the script. [Global variables](Functions.md#Global) are visible in the "global scope" (that is, outside of functions), and can be read by functions by default, but must be [declared](Functions.md#Global) if they are to be assigned a value inside a function. [Local variables](Functions.md#Local) are visible only inside the function which created them.

A variable can be thought of as a container or storage location for a value, so you'll often find the documentation refers to a variable's value as *the contents of the variable*. For a variable `x := 42`, we can also say that the variable x has the number 42 as its value, or that the value of x is 42.

It is important to note that a variable and its value are not the same thing. For instance, we might say "`myArray` is an array", but what we really mean is that myArray is a variable containing a reference to an array. We're taking a shortcut by using the name of the variable to refer to its value, but "myArray" is really just the name of the variable; the array object doesn't know that it has a name, and could be referred to by many different variables (and therefore many names).

### <a id="uninitialised-variables"></a>Uninitialized Variables

To *initialize* a variable is to assign it a starting value. A variable which has not yet been assigned a value is *uninitialized* (or *unset* for short). Attempting to read an uninitialized variable is considered an error. This helps to detect errors such as mispelled names and forgotten assignments.

[IsSet](lib/IsSet.md) can be used to determine whether a variable has been initialized, such as to initialize a global or static variable on first use.

A variable can be *un-set* by combining a direct assignment (`:=`) with the `unset` keyword or the [maybe (*var*?)](Variables.md#maybe) operator. For example: `Var := unset`, `Var1 := (Var2?)`.

The [or-maybe operator (??)](Variables.md#or-maybe) can be used to provide a default value when a variable lacks a value. For example, `MyVar ?? "Default"` is equivalent to `IsSet(MyVar) ? MyVar : "Default"`.

### Built-in Variables

A number of useful variables are built into the program and can be referenced by any script. Except where noted, these variables are read-only; that is, their contents cannot be directly altered by the script. By convention, most of these variables start with the prefix `A_`, so it is best to avoid using this prefix for your own variables.

Some variables such as [A_KeyDelay](Variables.md#KeyDelay) and [A_TitleMatchMode](Variables.md#TitleMatchMode) represent settings that control the script's behavior, and retain separate values for each [thread](misc/Threads.md). This allows subroutines launched by new threads (such as for hotkeys, menus, timers and such) to change settings without affecting other threads.

Some special variables are not updated periodically, but rather their value is retrieved or calculated whenever the script references the variable. For example, [A_Clipboard](lib/A_Clipboard.md) retrieves the current contents of the clipboard as text, and [A_TimeSinceThisHotkey](Variables.md#TimeSinceThisHotkey) calculates the number of milliseconds that have elapsed since the hotkey was pressed.

Related: [list of built-in variables](Variables.md#BuiltIn).

### Environment Variables

Environment variables are maintained by the operating system. You can see a list of them at the command prompt by typing SET then pressing Enter.

A script may create a new environment variable or change the contents of an existing one with [EnvSet](lib/EnvSet.md). Such additions and changes are not seen by the rest of the system. However, any programs or scripts which the script launches by calling [Run](lib/Run.md) or [RunWait](lib/Run.md) usually inherit a copy of the parent script's environment variables.

To retrieve an environment variable, use [EnvGet](lib/EnvGet.md). For example:

```ahk
Path := EnvGet("PATH")
```

<a id="variable-references"></a>
### Variable References (VarRef)

Within an expression, each variable reference is automatically resolved to its contents, unless it is the target of an [assignment](Variables.md#AssignOp) or the [reference operator (&)](Variables.md#ref). In other words, calling `myFunction(myVar)` would pass the value of *myVar* to *myFunction*, not the variable itself. The function would then have its own local variable (the parameter) with the same value as *myVar*, but would not be able to assign a new value to *myVar*. In short, the parameter is passed *by value*.

The [reference operator (&)](Variables.md#ref) allows a variable to be handled like a value. `&myVar` produces a VarRef, which can be used like any other value: assigned to another variable or property, inserted into an array, passed to or returned from a function, etc. A VarRef can be used to assign to the original target variable or retrieve its value by [dereferencing](Variables.md#deref) it.

For convenience, a function parameter can be declared [ByRef](Functions.md#ByRef) by prefixing the parameter name with ampersand (&). This requires the caller to pass a VarRef, and allows the function itself to "dereference" the VarRef by just referring to the parameter (without percent signs).

```ahk
class VarRef extends Any
```

The VarRef class currently has no predefined methods or properties, but `value is VarRef` can be used to test if a value is a VarRef.

When a VarRef is used as a parameter of a COM method, the object itself is not passed. Instead, its value is copied into a temporary VARIANT, which is passed using the [variant type](lib/ComObjType.md#vt) `VT_BYREF|VT_VARIANT`. When the method returns, the new value is assigned to the VarRef.

### Caching

Although a variable is typically thought of as holding a single value, and that value having a distinct type (string, number or object), AutoHotkey automatically converts between numbers and strings in cases like `"Value is " myNumber` and `MsgBox myNumber`. As these conversions can happen very frequently, whenever a variable containing a number is converted to a string, the result is *cached* in the variable.

Currently, AutoHotkey v2 caches a pure number only when assigning a pure number to a variable, not when reading it. This preserves the ability to differentiate between strings and pure numbers (such as with the [Type](lib/Type.md) function, or when passing values to COM objects).

<a id="Related"></a>
### Related

- [Variables](Variables.md#Intro): basic usage and examples.
- [Variable Capacity and Memory](Variables.md#cap): details about limitations.

## Functions

A *function* is the basic means by which a script *does something*.

Functions can have many different purposes. Some functions might do no more than perform a simple calculation, while others have immediately visible effects, such as moving a window. One of AutoHotkey's strengths is the ease with which scripts can automate other programs and perform many other common tasks by simply calling a few functions. See the [function list](lib/index.md) for examples.

Throughout this documentation, some common words are used in ways that might not be obvious to someone without prior experience. Below are several such words/phrases which are used frequently in relation to functions:

<a id="call"></a>

**Call a function**

*Calling* a function causes the program to invoke, execute or evaluate it. In other words, a *function call* temporarily transfers control from the script to the function. When the function has completed its purpose, it *returns* control to the script. In other words, any code following the function call does not execute until after the function completes.

However, sometimes a function completes before its effects can be seen by the user. For example, the [Send](lib/Send.md) function *sends* keystrokes, but may return before the keystrokes reach their destination and cause their intended effect.

<a id="parameters"></a>

**Parameters**

Usually a function accepts *parameters* which tell it how to operate or what to operate on. Each parameter is a [value](#values), such as a string or number. For example, [WinMove](lib/WinMove.md) moves a window, so its parameters tell it which window to move and where to move it to. Parameters can also be called *arguments*. Common abbreviations include *param* and *arg*.

<a id="pass-parameters"></a>

**Pass parameters**

Parameters are *passed* to a function, meaning that a value is specified for each parameter of the function when it is called. For example, one can *pass* the name of a key to [GetKeyState](lib/GetKeyState.md) to determine whether that key is being held down.

<a id="return-a-value"></a>

**Return a value**

Functions *return* a value, so the result of the function is often called a *return value*. For example, [StrLen](lib/StrLen.md) returns the number of characters in a string. Functions may also store results in variables, such as when there is more than one result (see [Returning Values](Functions.md#return)).

<a id="command"></a>

**Command**

A function call is sometimes called a *command*, such as if it *commands* the program to take a specific action. (For historical reasons, *command* may refer to a particular style of calling a function, where the parentheses are omitted and the return value is discarded. However, this is technically a [function call statement](Language.md#function-call-statements).)

Functions usually expect parameters to be written in a specific order, so the meaning of each parameter value depends on its position in the comma-delimited list of parameters. Some parameters can be omitted, in which case the parameter can be left blank, but the comma following it can only be omitted if all remaining parameters are also omitted. For example, the syntax for [ControlSend](lib/ControlSend.md) is:

```ahk
ControlSend Keys , ControlID, WinTitle, WinText, ExcludeTitle, ExcludeText
```

Square brackets signify that the enclosed parameters are optional (the brackets themselves should not appear in the actual code). However, usually one must also specify the target window. For example:

```ahk
ControlSend "^{Home}", "Edit1", "A"  ; Correct. ControlID is specified.
ControlSend "^{Home}", "A"           ; Incorrect: Parameters are mismatched.
ControlSend "^{Home}",, "A"          ; Correct. ControlID is omitted.
```

### Methods

A *method* is a function associated with a specific [object](#objects) or type of object. To call a method, one must specify an object and a method name. The method name does not uniquely identify the function; instead, what happens when the method call is attempted depends on the object. For example, `x.Show()` might [show a menu](lib/Menu.md#Show), [show a GUI](lib/Gui.md#Show), raise an error or do something else, depending on what `x` is. In other words, a method call simply passes a message to the object, instructing it to do something. For details, see [Object Protocol](#object-protocol) and [Operators for Objects](Language.md#operators-for-objects).

## Control Flow

*Control flow* is the order in which individual statements are executed. Normally statements are executed sequentially from top to bottom, but a control flow statement can override this, such as by specifying that statements should be executed repeatedly, or only if a certain condition is met.

<a id="statement"></a>

**Statement**

A *statement* is simply the smallest standalone element of the language that expresses some action to be carried out. In AutoHotkey, statements include assignments, function calls and other expressions. However, directives, double-colon hotkey and hotstring tags, and declarations without assignments are not statements; they are processed when the program first starts up, before the script *executes*.

<a id="execute"></a>

**Execute**

Carry out, perform, evaluate, put into effect, etc. *Execute* basically has the same meaning as in non-programming speak.

<a id="cf-body"></a>

**Body**

The *body* of a control flow statement is the statement or group of statements to which it applies. For example, the body of an [if statement](lib/If.md) is executed only if a specific condition is met.

For example, consider this simple set of instructions:

1. Open Notepad
2. Wait for Notepad to appear on the screen
3. Type "Hello, world!"

We take one step at a time, and when that step is finished, we move on to the next step. In the same way, control in a program or script usually flows from one statement to the next statement. But what if we want to type into an existing Notepad window? Consider this revised set of instructions:

1. If Notepad is not running:
    1. Open Notepad
    2. Wait for Notepad to appear on the screen
2. Otherwise:
    1. Activate Notepad
3. Type "Hello, world!"

So we either open Notepad or activate Notepad depending on whether it is already running. #1 is a *conditional statement*, also known as an *if statement*; that is, we execute its *body* (#1.1 - #1.2) only if a condition is met. #2 is an *else statement*; we execute its body (#2.1) only if the condition of a previous *if statement* (#1) is not met. Depending on the condition, control *flows* one of two ways: #1 (if true) → #1.1 → #1.2 → #3; or #1 (if false) → #2 (else) → #2.1 → #3.

The instructions above can be translated into the code below:

```ahk
if (not WinExist("ahk_class Notepad"))
{
    Run "Notepad"
    WinWait "ahk_class Notepad"
}
else
    WinActivate "ahk_class Notepad"
Send "Hello, world{!}"
```

In our written instructions, we used indentation and numbering to group the statements. Scripts work a little differently. Although indentation makes code easier to read, in AutoHotkey it does not affect the grouping of statements. Instead, statements are grouped by enclosing them in braces, as shown above. This is called a [*block*](lib/Block.md).

> For details about syntax - that is, how to write or recognize control flow statements in AutoHotkey - see [Control Flow](Language.md#control-flow).

## Details

### String Encoding

Each character in the string is represented by a number, called its *ordinal number*, or *character code*. For example, the value "Abc" would be represented as follows:

| A | b | c |  |
| --- | --- | --- | --- |
| 65 | 98 | 99 | 0 |

**Encoding:** The *encoding* of a string defines how symbols are mapped to ordinal numbers, and ordinal numbers to bytes. There are many different encodings, but as all of those supported by AutoHotkey include ASCII as a subset, character codes 0 to 127 always have the same meaning. For example, 'A' always has the character code 65.

<a id="null-termination"></a>

**Null-termination:** Each string is terminated with a "null character", or in other words, a character with ordinal value of zero marks the end of the string. The length of the string can be inferred by the position of the null-terminator, but AutoHotkey also stores the length, for performance and to permit null characters within the string's length.

> **Note:** Due to reliance on null-termination, many built-in functions and most expression operators do not support strings with embedded null characters, and instead read only up to the first null character. However, basic manipulation of such strings is supported; e.g. concatenation, `==`, `!==`, `Chr(0)`, [StrLen](lib/StrLen.md), [SubStr](lib/SubStr.md), assignments, parameter values and [return](lib/Return.md).

<a id="native-encoding"></a>

**Native encoding:** Although AutoHotkey provides ways to work with text in various encodings, the built-in functions--and to some degree the language itself--all assume string values to be in one particular encoding. This is referred to as the *native* encoding. The native encoding depends on the version of AutoHotkey:

-     Unicode versions of AutoHotkey use UTF-16. The smallest element in a UTF-16 string is two bytes (16 bits). Unicode characters in the range 0 to 65535 (U+FFFF) are represented by a single 16-bit code unit of the same value, while characters in the range 65536 (U+10000) to 1114111 (U+10FFFF) are represented by a *surrogate pair*; that is, exactly two 16-bit code units between 0xD800 and 0xDFFF. (For further explanation of surrogate pairs and methods of encoding or decoding them, search the Internet.)
-     ANSI versions of AutoHotkey use the system default ANSI code page, which depends on the system locale or "language for non-Unicode programs" system setting. The smallest element of an ANSI string is one byte. However, some code pages contain characters which are represented by sequences of multiple bytes (these are always non-ASCII characters).

> **Note:** AutoHotkey v2 natively uses Unicode and does not have an ANSI version.

<a id="character"></a>

**Character:** Generally, other parts of this documentation use the term "character" to mean a string's smallest unit; bytes for ANSI strings and 16-bit code units for Unicode (UTF-16) strings. For practical reasons, the length of a string and positions within a string are measured by counting these fixed-size units, even though they may not be complete Unicode characters.

[FileRead](lib/FileRead.md), [FileAppend](lib/FileAppend.md), [FileOpen](lib/FileOpen.md) and the [File object](lib/File.md) provide ways of reading and writing text in files with a specific encoding.

The functions [StrGet](lib/StrGet.md) and [StrPut](lib/StrPut.md) can be used to convert strings between the native encoding and some other specified encoding. However, these are usually only useful in combination with data structures and the [DllCall](lib/DllCall.md) function. Strings which are passed directly to or from [DllCall](lib/DllCall.md) can be converted to ANSI or UTF-16 by using the `AStr` or `WStr` parameter types.

Techniques for dealing with the differences between ANSI and Unicode versions of AutoHotkey can be found under [Unicode vs ANSI](Compat.md#Format).

### Pure Numbers

A *pure* or *binary* number is one which is stored in memory in a format that the computer's CPU can directly work with, such as to perform math. In most cases, AutoHotkey automatically converts between numeric strings and pure numbers as needed, and rarely differentiates between the two types. AutoHotkey primarily uses two data types for pure numbers:

- 64-bit signed integers (*int64*).
- 64-bit binary floating-point numbers (the *double* or *binary64* format of the IEEE 754 international standard).

These data types affect the range and precision of pure numeric values for variables, properties, array/map elements and indices, function parameters and return values, and temporary results of operators in an expression. Mathematical operators and functions perform 64-bit integer or floating-point operations. Bitwise operators perform 64-bit integer operations.

In other words, scripts are affected by the following limitations:

-     Integers must be within the signed 64-bit range; that is, -9223372036854775808 (-0x8000000000000000, or -2^63) to 9223372036854775807 (0x7FFFFFFFFFFFFFFF, or 2^63-1). If an integer constant in an expression is outside this range, only the low 64 bits are used (the value is truncated). Although larger values can be contained within a string, any attempt to convert the string to a number (such as by using it in a math operation) will cause it to be similarly truncated.
-     Floating-point numbers generally support 15 digits of precision.

<a id="float-imprecision"></a>

**Note:** There are some decimal fractions which the binary floating-point format cannot precisely represent, so a number is rounded to the closest representable number. This may lead to unexpected results. For example:

```ahk
MsgBox 0.1 + 0           ; 0.10000000000000001
MsgBox 0.1 + 0.2         ; 0.30000000000000004
MsgBox 0.3 + 0           ; 0.29999999999999999
MsgBox 0.1 + 0.2 = 0.3   ; 0 (not equal)
```

One strategy for dealing with this is to avoid direct comparison, instead comparing the difference. For example:

```ahk
MsgBox Abs((0.1 + 0.2) - (0.3)) < 0.0000000000000001
```

Another strategy is to explicitly apply rounding before comparison, such as by converting to a string. There are generally two ways to do this while specifying the precision, and both are shown below:

```ahk
MsgBox Round(0.1 + 0.2, 15) = Format("{:.15f}", 0.3)
```

### Names

AutoHotkey uses the same set of rules for naming various things, including variables, functions, [window groups](lib/GroupAdd.md), classes, properties and methods. The rules are as follows.

**Case sensitivity:** None for ASCII characters. For example, `CurrentDate` is the same as `currentdate`. However, uppercase non-ASCII characters such as 'Ä' are *not* considered equal to their lowercase counterparts, regardless of the current user's locale. This helps the script to behave consistently across multiple locales.

**Maximum length:** 253 characters.

**Allowed characters:** Letters, digits, underscore and non-ASCII characters; however, only property names can begin with a digit.

<a id="reserved-words"></a>

**Reserved words:** `as`, `and`, `contains`, `false`, `in`, `is`, `IsSet`, `not`, `or`, `super`, `true`, `unset`. These words are reserved for future use or other specific purposes.

Declaration keywords and names of control flow statements are also reserved, primarily to detect mistakes. This includes: `Break`, `Case`, `Catch`, `Continue`, `Else`, `Finally`, `For`, `Global`, `Goto`, `If`, `Local`, `Loop`, `Return`, `Static`, `Switch`, `Throw`, `Try`, `Until`, `While`

Names of properties, methods and window groups are permitted to be reserved words.

### References to Objects

Scripts interact with an object only indirectly, through a *reference* to the object. When you create an object, the object is created at some location you don't control, and you're given a reference. Passing this reference to a function or storing it in a variable or another object creates a new reference to the *same* object.

For example, if *myObj* contains a reference to an object, `yourObj := myObj` creates a new reference to the same object. A change such as `myObj.ans := 42` would be reflected by both `myObj.ans` and `yourObj.ans`, since they both refer to the same object. However, `myObj := Object()` only affects the variable *myObj*, not the variable *yourObj*, which still refers to the original object.

A reference is released by simply using an assignment to replace it with any other value. An object is deleted only after all references have been released; you cannot delete an object explicitly, and should not try. (However, you can delete an object's properties, content or associated resources, such as an [Array](lib/Array.md)'s elements, the window associated with a [Gui](lib/Gui.md), the items of a [Menu](lib/Menu.md) object, and so on.)

```ahk
ref1 := Object()  ; Create an object and store first reference
ref2 := ref1      ; Create a new reference to the same object
ref1 := ""        ; Release the first reference
ref2 := ""        ; Release the second reference; object is deleted
```

If that's difficult to understand, try thinking of an object as a rental unit. When you rent a unit, you're given a key which you can use to access the unit. You can get more keys and use them to access the same unit, but when you're finished with the unit, you must hand all keys back to the rental agent. Usually a unit wouldn't be *deleted*, but maybe the agent will have any junk you left behind removed; just as any values you stored in an object are freed when the object is deleted.
