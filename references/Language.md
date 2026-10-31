# Scripting Language

An AutoHotkey script is basically a set of instructions for the program to follow, written in a custom language exclusive to AutoHotkey. This language bears some similarities to several other scripting languages, but also has its own unique strengths and pitfalls. This document describes the language and also tries to point out common pitfalls.

> See [Concepts and Conventions](Concepts.md) for more general explanation of various concepts utilised by AutoHotkey.

<a id="toc"></a>
## Table of Contents

- [General Conventions](#general-conventions)
- [Comments](#comments)
- [Expressions](#expressions)
    - [Strings / Text](#strings)
    - [Variables](#variables)
    - [Keyword Constants](#constants)
    - [Operators](#operators)
    - [Function Calls](#function-calls)
        - [Function Call Statements](#function-call-statements)
        - [Optional Parameters](#optional-parameters)
    - [Operators for Objects](#operators-for-objects)
    - [Expression Statements](#expression-statements)
- [Control Flow Statements](#control-flow)
    - [Control Flow vs. Other Statements](#control-flow-vs)
    - [Loop Statement](#loop-statement)
    - [Not Control Flow](#not-control-flow)
- [Structure of a Script](#structure-of-a-script)
    - [Global Code](#global-code)
    - [Subroutines](#subroutines)
    - [Functions](#functions)
    - [#Include](#-include)
- [Miscellaneous](#misc)
    - [Dynamic Variables](#dynamic-variables)
        - [Pseudo-arrays](#pseudo-arrays)
    - [Labels](#labels)

## General Conventions

**Names:** Variable and function names are not case-sensitive (for example, `CurrentDate` is the same as `currentdate`). For details such as maximum length and usable characters, see [Names](Concepts.md#names).

**No typed variables:** Variables have no explicitly defined type; instead, a value of any type can be stored in any variable (excluding constants and built-in variables). Numbers may be automatically converted to strings (text) and vice versa, depending on the situation.

**Declarations are optional:** Except where noted on the [functions page](Functions.md), variables do not need to be declared. However, attempting to read a variable before it is given a value is considered an error.

**Spaces are mostly ignored:** Indentation (leading space) is important for writing readable code, but is not required by the program and is generally ignored. Spaces and tabs are *generally* ignored at the end of a line and within an expression (except between quotes). However, spaces are significant in some cases, including:

- [Function](#function-calls) and method calls require there to be no space between the function/method name and `(`.
- Spaces are required when performing concatenation.
- Spaces may be required between two operators, to remove ambiguity.
- Single-line [comments](#comments) require a leading space if they are not at the start of the line.

**Line breaks are meaningful:** Line breaks generally act as a statement separator, terminating the previous function call or other statement. (A *statement* is simply the smallest standalone element of the language that expresses some action to be carried out.) The exception to this is line continuation (see below).

**Line continuation:** Long lines can be divided up into a collection of smaller ones to improve readability and maintainability. This is achieved by preprocessing, so is not part of the language as such. There are three methods:

- [Continuation prefix](Scripts.md#continuation-line): Lines that begin with an [expression operator](Variables.md#operators) (except ++ and --) are merged with the previous line. Lines are merged regardless of whether the line actually contains an expression.
- [Continuation by enclosure](Scripts.md#continuation-expr): A sub-expression enclosed in (), [] or {} can automatically span multiple lines in most cases.
- [Continuation section](Scripts.md#continuation-section): Multiple lines are merged with the line above the section, which starts with `(` and ends with `)` (both symbols must appear at the beginning of a line, excluding whitespace).

## Comments

*Comments* are portions of text within the script which are ignored by the program. They are typically used to add explanation or disable parts of the code.

Scripts can be commented by using a semicolon at the beginning of a line. For example:

```ahk
; This entire line is a comment.
```

Comments may also be added at the end of a line, in which case the semicolon must have at least one space or tab to its left. For example:

```ahk
Run "Notepad"  ; This is a comment on the same line as a function call.
```

In addition, the `/*` and `*/` symbols can be used to comment out an entire section, as in this example:

```ahk
/*
MsgBox "This line is commented out (disabled)."
MsgBox "Common mistake:" */ " this does not end the comment."
MsgBox "This line is commented out."
*/
MsgBox "This line is not commented out."
/* This is also valid, but no other code can share the line. */
MsgBox "This line is not commented out."
```

Excluding tabs and spaces, `/*` must appear at the start of the line, while `*/` can appear only at the start or end of a line. It is also valid to omit `*/`, in which case the remainder of the file is commented out.

Since comments are filtered out when the script is read from file, they do not impact performance or memory utilization.

## Expressions

*Expressions* are combinations of one or more [values](Concepts.md#values), [variables](Concepts.md#variables), [operators](#operators) and [function calls](#function-calls). For example, `10`, `1+1` and `MyVar` are valid expressions. Usually, an expression takes one or more values as input, performs one or more operations, and produces a value as the result. The process of finding out the value of an expression is called *evaluation*. For example, the expression `1+1` *evaluates* to the number 2.

Simple expressions can be pieced together to form increasingly more complex expressions. For example, if `Discount/100` converts a discount percentage to a fraction, `1 - Discount/100` calculates a fraction representing the remaining amount, and `Price * (1 - Discount/100)` applies it to produce the net price.

*Values* are [numbers](Concepts.md#numbers), [objects](Concepts.md#objects) or [strings](Concepts.md#strings). A *literal* value is one written physically in the script; one that you can see when you look at the code.

<a id="strings"></a>
### Strings / Text

> For a more general explanation of strings, see [Strings](Concepts.md#strings).

A *string*, or *string of characters*, is just a text value. In an expression, literal text must be enclosed in single or double quotation marks to differentiate it from a variable name or some other expression. This is often referred to as a *quoted literal string*, or just *quoted string*. For example, `"this is a quoted string"` and `'so is this'`.

To include an *actual* quote character inside a quoted string, use the `` `" `` or `` `' `` [escape sequence](misc/EscapeChar.md#quote) or enclose the character in the opposite type of quote mark. For example: `'She said, "An apple a day."'`.

Quoted strings can contain other [escape sequences](misc/EscapeChar.md) such as `` `t `` (tab), `` `n `` (linefeed), and `` `r `` (carriage return).

### Variables

> For a basic explanation and general details about variables, see [Variables](Concepts.md#variables).

*Variables* can be used in an expression simply by writing the variable's name. For example, `A_ScreenWidth/2`. However, variables cannot be used inside a quoted string. Instead, variables and other values can be combined with text through a process called [*concatenation*](Variables.md#concat). There are two ways to *concatenate* values in an expression:

- Implicit concatenation: `"The value is " MyVar`
- Explicit concatenation: `"The value is " . MyVar`

Implicit concatenation is also known as *auto-concat*. In both cases, the spaces preceding the variable and dot are mandatory.

The [Format](lib/Format.md) function can also be used for this purpose. For example:

```ahk
MsgBox Format("You are using AutoHotkey v{1} {2}-bit.", A_AhkVersion, A_PtrSize*8)
```

To assign a value to a variable, use the `:=` [assignment operator](Variables.md#AssignOp), as in `MyVar := "Some text"`.

*Percent signs* within an expression are used to create [dynamic variable references](#dynamic-variables), but these are rarely needed.

<a id="constants"></a>
### Keyword Constants

A constant is simply an unchangeable value, given a symbolic name. AutoHotkey currently has the following constants:

| Name | Value | Type | Description |
| --- | --- | --- | --- |
| False | 0 | [Integer](Concepts.md#numbers) | [Boolean](Variables.md#Boolean) false, sometimes meaning "off", "no", etc. |
| True | 1 | [Integer](Concepts.md#numbers) | [Boolean](Variables.md#Boolean) true, sometimes meaning "on", "yes", etc. |

Unlike the read-only [built-in variables](Variables.md#BuiltIn), these cannot be returned by a [dynamic reference](#dynamic-variables).

### Operators

*Operators* take the form of a symbol or group of symbols such as `+` or `:=`, or one of the words `and`, `or`, `not`, `is`, `in` or `contains`. They take one, two or three values as input and return a value as the result. A value or sub-expression used as input for an operator is called an *operand*.

- *Unary* operators are written either before or after a single operand, depending on the operator. For example, `-x` or `not keyIsDown`.
- *Binary* operators are written in between their two operands. For example, `1+1` or `2 * 5`.
- AutoHotkey has only one *ternary* operator, which takes the form [`condition ? valueIfTrue : valueIfFalse`](Variables.md#ternary).

Some unary and binary operators share the same symbols, in which case the meaning of the operator depends on whether it is written before, after or in between two values. For example, `x-y` performs subtraction while `-x` inverts the sign of `x` (producing a positive value from a negative value and vice versa).

Operators of equal precedence such as multiply (`*`) and divide (`/`) are evaluated in left-to-right order unless otherwise specified in the [operator table](Variables.md#operators). By contrast, an operator of lower precedence such as add (`+`) is evaluated after a higher one such as multiply (`*`). For example, `3 + 2 * 2` is evaluated as `3 + (2 * 2)`. Parentheses may be used to override precedence as in this example: `(3 + 2) * 2`

### Function Calls

> For a general explanation of functions and related terminology, see [Functions](Concepts.md#functions).

*Functions* take a varying number of inputs, perform some action or calculation, and then [*return*](Concepts.md#return-a-value) a result. The inputs of a function are called [*parameters*](Concepts.md#parameters) or *arguments*. A function is [*called*](Concepts.md#call) simply by writing the target function followed by parameters enclosed in parentheses. For example, `GetKeyState("Shift")` returns (evaluates to) 1 if `Shift` is being held down or 0 otherwise.

> **Note:** There must not be any space between the function and open parenthesis.

For those new to programming, the requirement for parentheses may seem cryptic or verbose at first, but they are what allows a function call to be combined with other operations. For example, the expression `GetKeyState("Shift", "P") and GetKeyState("Ctrl", "P")` returns 1 only if both keys are being physically held down.

Although a function call expression usually begins with a literal function name, the target of the call can be any expression which produces a [function object](misc/Functor.md). In the expression `GetKeyState("Shift")`, *GetKeyState* is actually a variable reference, although it usually refers to a read-only variable containing a built-in function.

#### Function Call Statements

If the return value of the function is not needed and the function name is written at the start of the line (or in other contexts which allow a [statement](Concepts.md#statement), such as following `else` or a [hotkey](Hotkeys.md)), the parentheses can be omitted. In this case, the remainder of the line is taken as the function's parameter list. For example:

```ahk
result := MsgBox("This one requires parentheses.",, "OKCancel")
MsgBox "This one doesn't. The result was " result "."
```

Parentheses can also be omitted when calling a [method](Concepts.md#methods) in this same context, but only when the target object is either a variable or a directly named property, such as `myVar.myMethod` or `myVar.myProp.myMethod`.

As with function call expressions, the target of a function call statement does not have to be a predefined function; it can instead be a variable containing a [function object](misc/Functor.md).

A function call statement can [span multiple lines](Scripts.md#continuation).

Function call statements have the following limitations:

- If there is a return value, it is always discarded.
- Like [control flow statements](#control-flow), they cannot be used inside an expression.
- When optional parameters are omitted, any commas at the *end* of the parameter list must also be omitted to prevent [line continuation](Scripts.md#continuation-line).
- Function call statements cannot be [variadic](Functions.md#VariadicCall), although they can pass a fixed number of parameters to a variadic function.

#### Optional Parameters

Optional parameters can simply be left blank, but the delimiting comma is still required unless all subsequent parameters are also omitted. For example, the [Run](lib/Run.md) function can accept between one and four parameters. All of the following are valid:

```ahk
Run "notepad.exe", "C:\"
Run "notepad.exe",, "Min"
Run("notepad.exe", , , &notepadPID)
```

<a id="unset"></a>

Within a [function call](#function-calls), [array literal](Variables.md#square-brackets) or [object literal](Variables.md#curly-braces), the keyword `unset` can be used to explicitly omit the parameter or value. An unset expression has one of the following effects:

- For a user-defined function, the parameter's [default value](Functions.md#optional) is used.
- For a built-in function, the parameter is considered to have been omitted.
- For an [array literal](Variables.md#square-brackets) such as `[var?]`, the element is included in the array's length but is given no value.
- For an [object literal](Variables.md#curly-braces) such as `{x: y?}`, the property is not assigned.

The `unset` keyword can also be [used in a function definition](Functions.md#unset) to indicate that a parameter is optional but has no default value. When the function executes, the local variable corresponding to that parameter will have [no value](Concepts.md#nothing) if the parameter was omitted.

The [maybe operator (*var***?**)](Variables.md#maybe) can be used to pass or omit a variable depending on whether it has a value. For example, `Array(MyVar?)` is equivalent to `Array(IsSet(MyVar) ? MyVar : unset)`.

### Operators for Objects

There are other symbols used in expressions which don't quite fit into any of the categories defined above, or that affect the meaning of other parts of the expression, as described below. These all relate to *objects* in some way. Providing a full explanation of what each construct does would require introducing more concepts which are outside the scope of this section.

`Alpha.Beta` is often called *member access* or *property access*. *Alpha* is an ordinary variable, and could be replaced with a function call or some other sub-expression which returns an object. *Beta* is a literal property name, with meaning specific to the type or value of *Alpha*. When followed by an assignment operator, it sets the property's value.

`Alpha.Beta()` is a *method call*. *Alpha* is implicitly passed as a parameter, but this is normally hidden from view as each method definition implicitly defines a parameter named `this`. The parentheses can be omitted in specific cases; see [Function Call Statements](#function-call-statements).

`Alpha.Beta[Param]` is *parameterized property access*. *Beta* should be a [parameterized property](Objects.md#Custom_Classes_property). This can usually also be used if the property is not parameterized but returns a value which supports [item access](Objects.md#__Item). While *Beta* is a literal property name, *Param* is an ordinary variable or sub-expression, or a list of sub-expressions separated by commas (the same as in a function's parameter list). [Variadic calls](Functions.md#VariadicCall) are permitted.

`Alpha.%vBeta%`, `Alpha.%vBeta%[Param]` and `Alpha.%vBeta%()` are also member access, but *vBeta* is a variable or sub-expression. This allows the name of the property or method to be determined while the script is running. Parentheses are required when calling a method this way.

`Alpha[Index]` typically invokes the [\__Item](Objects.md#__Item) property of `Alpha`, giving `Index` as a parameter. Both *Alpha* and *Index* are variables in this case, and could be replaced with virtually any sub-expression. This syntax is usually used to retrieve an element of an [Array](lib/Array.md) or [Map](lib/Map.md). For COM objects, this invokes the *default property* by ID (DISPID_VALUE), so is different to explicitly specifying the \__Item property.

<a id="array-literal"></a>

`[A, B, C]` creates an [Array](lib/Array.md) with the initial contents A, B and C (all variables in this case), where A is element 1.

<a id="object-literal"></a>

`{Prop1: Value1, Prop2: Value2}` creates an [Object](lib/Object.md) with properties literally named *Prop1* and *Prop2*. A value can later be retrieved by using the *member access* syntax described above. To evaluate a property name as an expression, enclose it in percent signs. For example: `{%NameVar%: ValueVar}`.

`MyFunc(Params*)` is a [variadic function call](Functions.md#VariadicCall). The asterisk must immediately precede the closing parenthesis at the end of the function's parameter list. *Params* must be a variable or sub-expression which returns an [Array](lib/Array.md) or other enumerable object. Although it isn't valid to use `Params*` just anywhere, it can be used in an array literal (`[A, B, C, ArrayToAppend*]`) or property parameter list (`Alpha.Beta[Params*]` or `Alpha[Params*]`).

### Expression Statements

Not all expressions can be used alone on a line. For example, a line consisting of just `21*2` or `"Some text"` wouldn't make any sense. An expression *statement* is an expression used on its own, typically for its side-effects. Most expressions with side-effects can be used this way, so it is generally not necessary to memorise the details of this section.

The following types of expressions can be used as statements:

Assignments, as in `x := y`, compound assignments such as `x += y`, and increment/decrement operators such as `++x` and `x--`.

> **Known limitation:** For `x++` and `x--`, there currently cannot be a space between the variable name and operator.

Function calls such as `MyFunc(Params)`. However, a standalone function call cannot be followed by an open brace `{` (at the end of the line or on the next line), because it would be confused with a function declaration.

Method calls such as `MyObj.MyMethod()`.

Item access or parameterized property access using square brackets, such as `MyObj[Index]` or `MyObj.Prop[Index]`, which can have side-effects like a function call.

Ternary expressions such as `x ? CallIfTrue() : CallIfFalse()`. However, it is safer to utilize the rule below; that is, always enclose the expression (or just the condition) in parentheses.

> **Known limitation:** Due to ambiguity with [function call statements](#function-call-statements), conditions beginning with a variable name and space (but also containing other operators) should be enclosed in parentheses. For example, `(x + 1) ? y : z` and `x+1 ? y : z` are expression statements but `x + 1 ? y : z` is a function call statement.

> **Note:** The condition cannot begin with `!` or any other expression operator, as it would be interpreted as a [continuation line](Scripts.md#continuation-line).

Expressions starting with `(`. However, there usually must be a matching `)` on the same line, otherwise the line would be interpreted as the start of a [continuation section](Scripts.md#continuation).

Expressions starting with a double-deref, such as `%varname% := 1`. This is primarily due to implementation complexity.

Expressions that start with any of those described above (but not those described below) are also allowed, for simplicity. For example, `MyFunc()+1` is currently allowed, although the `+1` has no effect and its result is discarded. Such expressions might become invalid in the future due to enhanced error-checking.

[Function call statements](#function-call-statements) are similar to expression statements, but are technically not pure expressions. For example, `MsgBox "Hello, world!"`, `myGui.Show` or `x.y.z "my parameter"`.

<a id="control-flow"></a>
## Control Flow Statements

> For a general explanation of control flow, see [Control Flow](Concepts.md#control-flow).

[Statements](Concepts.md#statement) are grouped together into a [*block*](lib/Block.md) by enclosing them in braces `{}`, as in C, JavaScript and similar languages, but usually the braces must appear at the start of a line. Control flow statements can be applied to an entire block or just a single statement.

The [body](Concepts.md#cf-body) of a control flow statement is always a single *group* of statements. A block counts as a single group of statements, as does a control flow statement and its body. The following related statements are also grouped with each other, along with their bodies: `If` with `Else`; `Loop`/`For` with `Until` or `Else`; `Try` with `Catch` and/or `Else` and/or `Finally`. In other words, when a group of these statements is used as a whole, it does not always need to be enclosed in braces (however, some coding styles always include the braces, for clarity).

Control flow statements which have a body and therefore must always be followed by a related statement or group of statements: `If`, `Else`, `Loop`, `While`, `For`, `Try`, `Catch` and `Finally`.

<a id="control-flow-list"></a>

The following control flow statements exist:

- A [block](lib/Block.md) (denoted by a pair of braces) groups zero or more statements to act as a single statement.
- An [If statement](lib/If.md) causes its body to be executed or not depending on a condition. It can be followed by an [Else](lib/Else.md) statement, which executes only if the condition was not met.
- [Goto](lib/Goto.md) jumps to the specified label and continues execution.
- [Return](lib/Return.md) returns from a function.
- A [Loop statement](#loop-statement) ([Loop](lib/Loop.md), [While](lib/While.md) or [For](lib/For.md)) executes its body repeatedly.
    - [Break](lib/Break.md) exits (terminates) a loop.
    - [Continue](lib/Continue.md) skips the rest of the current loop iteration and begins a new one.
    - [Until](lib/Until.md) causes a loop to terminate when an expression evaluates to true. The expression is evaluated after each iteration.
- [Switch](lib/Switch.md) compares a value with multiple cases and executes the statements of the first match.
- Exception handling:
    - [Try](lib/Try.md) guards its body against runtime errors and values thrown by the throw statement.
    - [Catch](lib/Catch.md) executes if an exception of a given type is thrown within a try statement.
    - [Else](lib/Else.md), when used after a catch statement, executes only if no exception is thrown within a try statement.
    - [Finally](lib/Finally.md) executes its body when control is being transferred out of a try or catch statement's body.
    - [Throw](lib/Throw.md) throws an exception to be handled by try/catch or [OnError](lib/OnError.md), or to display an error dialog.

<a id="control-flow-vs"></a>
### Control Flow vs. Other Statements

Control flow statements differ from [function call statements](#function-call-statements) in several ways:

- The opening brace of a [block](lib/Block.md) can be written at the end of the same line as an [If](lib/If.md), [Else](lib/Else.md), [Loop](#loop-statement), [While](lib/While.md), [For](lib/For.md), [Try](lib/Try.md), [Catch](lib/Catch.md) or [Finally](lib/Finally.md) statement (basically any control flow statement which has a [body](Concepts.md#cf-body)). This is referred to as the One True Brace (OTB) style.
- [Else](lib/Else.md), [Try](lib/Try.md) and [Finally](lib/Finally.md) allow any valid statement to their right, as they require a [body](Concepts.md#cf-body) but have no parameters.
- [If](lib/If.md), [While](lib/While.md), [Return](lib/Return.md), [Until](lib/Until.md), [Loop *Count*](lib/Loop.md), [For](lib/For.md), [Catch](lib/Catch.md), [Break](lib/Break.md), [Continue](lib/Continue.md), [Throw](lib/Throw.md), and [Goto](lib/Goto.md) allow an open parenthesis to be used immediately after the name, to enclose the entire parameter list. Although these look like function calls, they are not, and cannot be used mid-expression. For example, `if(expression)`.
- Control flow statements cannot be overridden by defining a function with the same name.

### Loop Statement

There are several types of loop statements:

- [Loop *Count*](lib/Loop.md) executes a statement repeatedly: either the specified number of times or until Break is encountered.
- [Loop Reg](lib/LoopReg.md) retrieves the contents of the specified registry subkey, one item at a time.
- [Loop Files](lib/LoopFiles.md) retrieves the specified files or folders, one at a time.
- [Loop Parse](lib/LoopParse.md) retrieves substrings (fields) from a string, one at a time.
- [Loop Read](lib/LoopRead.md) retrieves the lines in a text file, one at a time.
- [While](lib/While.md) executes a statement repeatedly until the specified expression evaluates to false. The expression is evaluated before each iteration.
- [For](lib/For.md) executes a statement once for each value or pair of values returned by an enumerator, such as each key-value pair in an object.

[Break](lib/Break.md) exits (terminates) a loop, effectively jumping to the next line after the loop's body.

[Continue](lib/Continue.md) skips the rest of the current loop iteration and begins a new one.

[Until](lib/Until.md) causes a loop to terminate when an expression evaluates to true. The expression is evaluated after each iteration.

<a id="named-loops"></a>

A [label](#labels) can be used to "name" a loop for [Continue](lib/Continue.md) and [Break](lib/Break.md). This allows the script to easily continue or break out of any number of nested loops without using [Goto](lib/Goto.md).

The built-in variable **A_Index** contains the number of the current loop iteration. It contains 1 the first time the loop's body is executed. For the second time, it contains 2; and so on. If an inner loop is enclosed by an outer loop, the inner loop takes precedence. A_Index works inside all types of loops, but contains 0 outside of a loop.

For some loop types, other built-in variables return information about the current loop item (registry key/value, file, substring or line of text). These variables have names beginning with **A_Loop**, such as A_LoopFileName and A_LoopReadLine. Their values always correspond to the most recently started (but not yet stopped) loop of the appropriate type. For example, A_LoopField returns the current substring in the innermost parsing loop, even if it is used inside a file or registry loop.

```ahk
t := "column 1`tcolumn 2`nvalue 1`tvalue 2"
Loop Parse t, "`n"
{
    rowtext := A_LoopField
    rownum := A_Index  ; Save this for use in the second loop, below.
    Loop Parse rowtext, "`t"
    {
        MsgBox rownum ":" A_Index " = " A_LoopField
    }
}
```

Loop variables can also be used outside the body of a loop, such as in a function which is called from within a loop.

### Not Control Flow

As directives, labels, double-colon hotkey and hotstring tags, and declarations without assignments are processed when the script is loaded from file, they are not subject to control flow. In other words, they take effect unconditionally, before the script ever executes any control flow statements. Similarly, the [#HotIf](lib/_HotIf.md) directive cannot affect control flow; it merely sets the criteria for any hotkeys and hotstrings specified in the code. A hotkey's criteria is evaluated each time it is pressed, not when the #HotIf directive is encountered in the code.

## Structure of a Script

### Global Code

After the script has been loaded, the *auto-execute thread* begins executing at the script's top line, and continues until instructed to stop, such as by [Return](lib/Return.md), [ExitApp](lib/ExitApp.md) or [Exit](lib/Exit.md). The physical end of the script also acts as [Exit](lib/Exit.md).

Global code, or code in the global [scope](Concepts.md#scope), is any executable code that is not inside a function or class definition. Any variable references there are said to be [global](Functions.md#Global), since they can be accessed by any function (with the proper declaration). Such code is often used to configure settings which apply to every newly launched [thread](misc/Threads.md), or to [initialize](Concepts.md#uninitialized-variables) global variables used by hotkeys and other functions.

Code to be executed at startup (immediately when the script starts) is often placed at the top of the file. However, such code can be placed throughout the file, in between (but not inside) function and class definitions. This is because the body of each function or class definition is skipped whenever it is encountered during execution. In some cases, the entire purpose of the script may be carried out with global code.

**Related:** [Script Startup (the Auto-execute Thread)](Scripts.md#auto)

### Subroutines

A *subroutine* (also *sub* or *procedure*) is a reusable block of code which can be executed on demand. A subroutine is created by defining a *function* (see below). These terms are generally interchangeable for AutoHotkey v2, where functions are the only type of subroutine.

### Functions

**Related:** [Functions](Functions.md) (all about defining functions)

Aside from calling the many useful [predefined functions](lib/index.md), a script can define its own functions. These functions can generally be used two ways:

1. A function can be called by the script itself. This kind of function might be used to avoid repetition, to make the code more manageable, or perhaps for other purposes.
2. A function can be called by the program in response to some event, such as the user pressing a hotkey. For instance, each hotkey is associated with a function to execute whenever the hotkey is pressed.

There are multiple ways to define a function:

- A [function definition](Functions.md) combining a name, parentheses and a [block](lib/Block.md) of code. This defines a function which can be executed by name with a [function call](#function-calls) or [function call statement](#function-call-statements). For example:
    ```ahk
    SayHello()  ; Define the SayHello function.
    {
        MsgBox "Hello!"
    }

    SayHello  ; Call the SayHello function.
    ```
- A [hotkey](Hotkeys.md) or [hotstring](Hotstrings.md) definition, combining a hotkey or hotstring with a single [statement](Concepts.md#statement) or a [block](lib/Block.md) of code. This type of function cannot be called directly, but is executed whenever the hotkey or hotstring is activated. For example:
    ```ahk
    #p::Run "mspaint"  ; Press Win-P to run Paint.
    #n::  ; Press Win-N to run Notepad.
    {
        Run "notepad"
    }
    ```
- A [fat arrow expression](Variables.md#fat-arrow) defines a function which evaluates an [expression](#expressions) and [returns](Concepts.md#return-a-value) its result, instead of executing a block of code. Such functions usually have no name as they are passed directly to another function. For example:
    ```ahk
    SetTimer () => MsgBox("Hello!"), -1000  ; Says hello after 1 second.
    ```
- The fat arrow syntax can also be used outside of expressions as shorthand for a normal function or method definition. For example, the following is equivalent to the SayHello definition above, except that this one returns "OK":
    ```ahk
    SayHello() => MsgBox("Hello!")
    ```

Variables in functions are [local](Functions.md#Local) to that function by default, except in the following cases:

- When the function is [assume-global](Functions.md#AssumeGlobal).
- When a variable is referenced but not used as the target of an [assignment](Variables.md#AssignOp) or the reference operator (`&var`).
- When referring to a local variable of an outer function inside a [nested function](Functions.md#nested).

A function can optionally [accept parameters](Concepts.md#parameters). Parameters are defined by listing them inside the parentheses. For example:

```ahk
MyFunction(FirstParameter, Second, &Third, Fourth:="")
{
    ;...
    return "a value"
}
```

As with function calls, there must be no space between the function name and open-parenthesis.

The line break between the close-parenthesis and open-brace is optional. There can be any amount of whitespace or comments between the two.

The [ByRef marker (&)](Functions.md#ByRef) indicates that the caller must pass a variable reference. Inside the function, any reference to the parameter will actually access the caller's variable. This is similar to omitting `&` and explicitly [dereferencing](Variables.md#deref) the parameter inside the function (e.g. `%Third%`), but in this case the percent signs are omitted. If the parameter is optional and the caller omits it, the parameter acts as a normal local variable.

[Optional](Functions.md#optional) parameters are specified by following the parameter name with `:=` and a default value, which must be a literal quoted string, a number, `true`, `false` or `unset`.

The function can [return a value](Functions.md#return). If it does not, the default return value is an empty string.

A function definition does not need to precede calls to that function.

> See [Functions](Functions.md) for much more detail.

<a id="-include"></a>
### #Include

The [#Include](lib/_Include.md) directive causes the script to behave as though the specified file's contents are present at this exact position. This is often used to organize code into separate files, or to make use of script libraries written by other users.

An #Include file can contain [global code](#global-code) to be executed during [script startup](Scripts.md#auto), but as with code in the main script file, such code will be executed only if the auto-execute thread is not terminated (such as with an unconditional `Return`) prior to the #Include directive. A [warning](lib/_Warn.md#Unreachable) is displayed by default if any code cannot be executed due to a prior `Return`.

Unlike in C/C++, #Include does nothing if the file has already been included by a previous directive. To include the contents of the same file multiple times, use [#IncludeAgain](lib/_Include.md).

To facilitate sharing scripts, #Include can search a few standard locations for a library script. For details, see [Script Library Folders](Scripts.md#lib).

<a id="misc"></a>
## Miscellaneous

### Dynamic Variables

A *dynamic variable reference* takes a text value and interprets it as the name of a variable.

> **Note:** A variable cannot be *created* by a dynamic reference, but existing variables can be assigned. This includes all variables which the script contains non-dynamic references to, even if they have not been assigned values.

The most common form of dynamic variable reference is called a *double reference* or *double-deref*. Before performing a double reference, the name of the target variable is stored in a second variable. This second variable can then be used to assign a value to the target variable indirectly, using a double reference. For example:

```ahk
target := 42
second := "target"
MsgBox  second   ; Normal (single) variable reference => target
MsgBox %second%  ; Double-deref => 42
```

Currently, `second` must always contain a variable name in the second case; arbitrary expressions are not supported.

A dynamic variable reference can also take one or more pieces of literal text and the content of one or more variables, and join them together to form a single variable name. This is done simply by writing the pieces of the name and percent-enclosed variables in sequence, without any spaces. For example, `MyArray%A_Index%` or `MyGrid%X%_%Y%`. This is used to access *pseudo-arrays*, described below.

These techniques can also be applied to properties and methods of objects. For example:

```ahk
clr := {}
for n, component in ["red", "green", "blue"]
    clr.%component% := Random(0, 255)
MsgBox clr.red "," clr.green "," clr.blue
```

#### Pseudo-arrays

A *pseudo-array* is actually just a bunch of discrete variables, but with a naming pattern which allows them to be used like elements of an array. For example:

```ahk
MyArray1 := "A"
MyArray2 := "B"
MyArray3 := "C"
Loop 3
    MsgBox MyArray%A_Index%  ; Shows A, then B, then C.
```

The "index" used to form the final variable name does not have to be numeric; it could instead be a letter or keyword.

For these reasons, it is generally recommended to use an [Array](Objects.md#Usage_Simple_Arrays) or [Map](Objects.md#Usage_Associative_Arrays) instead of a pseudo-array:

- As the individual elements are just normal variables, one can assign or retrieve a value, but cannot *remove* or *insert* elements.
- Because the pseudo-array is only conceptual and not a single value, it can't be passed to or returned from a function, or copied as a whole.
- A pseudo-array cannot be declared as a whole, so some "elements" may resolve to [global](Functions.md#Global) (or [captured](Functions.md#capture-var)) variables while others do not.
- If a variable is referenced non-dynamically but only assigned dynamically, a [load-time warning](lib/_Warn.md#VarUnset) may be displayed. Such warnings are a very effective way to detect errors, so disabling them is not recommended.
- Current versions of the language do not permit creating new variables dynamically. This is partly to encourage best practices, and partly to avoid inconsistency between dynamic and non-dynamic variable references in functions.

### Labels

A label identifies a line of code, and can be used as a [Goto](lib/Goto.md) target or to [specify a loop](#named-loops) to break out of or continue. A label consist of a [name](Concepts.md#names) followed by a colon:

```ahk
this_is_a_label:
```

Aside from whitespace and comments, no other code can be written on the same line as a label. For more details, see [Labels](misc/Labels.md).
