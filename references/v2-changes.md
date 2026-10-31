# Changes from v1.1 to v2.0

This page provides a complete overview of changes between AutoHotkey v1.1 and v2.0. For changes made after v2.0, see the [changelog](ChangeLog.md). For full technical details of changes, refer to [GitHub](https://github.com/AutoHotkey/AutoHotkey/tree/v2.0).

When converting scripts to v2, see also [Changes from v1.0 to v1.1](v1-changes.md) if you are converting from v1.0, and consider using tools such as the [AHK v2 Script Converter](https://github.com/mmikeww/AHK-v2-script-converter) to automate the process.

<a id="toc"></a>
## Table of Contents

- [Language](#language)
    - [Legacy Syntax Removed](#legacy-syntax-removed)
    - [Hotkey and Hotstring Labels](#hotkey-and-hotstring-labels)
    - [Names](#names)
    - [Scope](#scope)
    - [Variables](#variables)
    - [Expressions](#expressions)
    - [Objects (Misc)](#objects-misc)
    - [Functions](#functions)
    - [Nested Functions](#nested-functions)
    - [Uncategorized](#uncategorized)
    - [Continuation Sections](#continuation-sections)
    - [Continuation Lines](#continuation-lines)
    - [Types](#types)
- [Objects](#objects)
    - [Primitive Values](#primitive-values)
    - [Properties and Methods](#properties-and-methods)
    - [Static/Class Variables](#staticclass-variables)
    - [Meta-Functions](#meta-functions)
    - [Array](#array)
    - [Map](#map)
    - [Enumeration](#enumeration)
    - [Bound Functions](#bound-functions)
    - [COM Objects (ComObject)](#com-objects-comobject)
    - [Default Property](#default-property)
    - [COM Calls](#com-calls)
- [Library](#library)
    - [Removed Commands, Functions & Directives](#lib-removed)
    - [Renamed Commands, Functions & Directives](#lib-renamed)
    - [Modified Commands, Functions & Directives](#lib-modified)
    - [New Functions](#new-functions)
    - [New Directives](#new-directives)
    - [Built-in Variables](#built-in-variables)
    - [Built-in Objects](#built-in-objects)
- [Gui](#gui)
    - [Gui sub-commands](#gui-sub-commands)
    - [Events](#events)
    - [Removed](#removed)
    - [Control Options](#control-options)
    - [GuiControlGet](#guicontrolget)
    - [GuiControl](#guicontrol)
    - [Other Changes](#other-changes)
- [Error Handling](#error-handling)
    - [Continuable Errors](#continuable-errors)
    - [ErrorLevel](#errorlevel)
    - [Expressions](#expressions-1)
    - [Functions](#functions-1)
    - [Catch](#catch)
- [Keyboard, Mouse, Hotkeys and Hotstrings](#keyboard-mouse-hotkeys-and-hotstrings)
- [Other](#other)
    - [Persistence](#persistence)
    - [Threads](#threads)
    - [Default Settings](#default-settings)
    - [Default Script](#default-script)
    - [Command Line](#command-line)

## Language

### Legacy Syntax Removed

Removed literal assignments: `var = value`

Removed all legacy If statements, leaving only `if expression`, which never requires parentheses (but allows them, as in any expression).

Removed "command syntax". There are no "commands", only [*function call statements*](Language.md#function-call-statements), which are just function or method calls without parentheses. That means:

- All former commands are now functions (excluding control flow statements).
- All functions can be called without parentheses if the return value is not needed (but as before, parentheses cannot be omitted for calls within an expression).
- All parameters are expressions, so all text is "quoted" and commas never need to be escaped. Currently this excludes a few directives (which are neither commands nor functions).
- Parameters are the same regardless of parentheses; i.e. there is no output variable for the return value, so it is discarded if parentheses are omitted.
- Normal variable references are never enclosed in percent signs (except with [#Include](lib/_Include.md) and [#DllLoad](lib/_DllLoad.md)). Use [concatenation](Variables.md#concat) or [Format](lib/Format.md) to include variables in text.
- There is no comma between the function name and parameters, so `WinMove(, y)` = `WinMove , y` (x is omitted). A space or tab is required for clarity. For consistency, directives also follow the new convention (there must not be a comma between the directive name and parameter).
- There is no percent-space prefix to force an expression. Unquoted percent signs in expressions are used only for double-derefs/dynamic references, and having an odd number of them is a syntax error.
- Method call statements (method calls which omit parentheses) are restricted to a plain variable followed by one or more identifiers separated by dots, such as `MyVar.MyProperty.MyMethod "String to pass"`.

The translation from v1-command to function is generally as follows (but some functions have been changed, as documented further below):

- If the command's first parameter is an output variable and the second parameter is not, it becomes the return value and is removed from the parameter list.
- The remaining output variables are handled like [ByRef parameters](#byref) (for which usage and syntax has changed), except that they permit references to writable built-in variables.
- An exception is thrown on failure instead of setting ErrorLevel.
- Values formerly returned via ErrorLevel are returned by other means, replaced with exceptions, superseded or simply not returned.

All control flow statements also accept expressions, except where noted below.

All control flow statements which take parameters (currently excluding the two-word Loop statements) support parentheses around their parameter list, without any space between the name and parenthesis. For example, `return(var)`. However, these are not functions; for instance, `x := return(y)` is not valid. [If](lib/If.md) and [While](lib/While.md) already supported this.

[Loop](#loop-sub-commands) (except [Loop *Count*](lib/Loop.md)) is now followed by a secondary keyword (Files, Parse, Read or Reg) which cannot be "quoted" or contained by a variable. Currently the keyword can be followed by a comma, but it is not required as this is not a parameter. [OTB](lib/Block.md#otb) is supported by all modes.

[Goto](lib/Goto.md), [Break](lib/Break.md) and [Continue](lib/Continue.md) require an unquoted label name, similar to v1 (`goto label` jumps to `label:`). To jump to a label dynamically, use parentheses immediately after the name: `goto(expression)`. However, this is not a function and cannot be used mid-expression. Parentheses can be used with Break or Continue, but in that case the parameter must be a single literal number or quoted string.

Gosub has been removed, and labels can no longer be used with functions such as [SetTimer](lib/SetTimer.md) and [Hotkey](lib/Hotkey.md).

- They were redundant; basically just a limited form of function, without local variables or a return value, and being in their own separate namespace. Functions can be used everywhere that label subroutines were used before (even [inside other functions](Functions.md#nested)).
- Functions cannot overlap (but can be contained within a function). Instead, use multiple functions and call one from the other. Instead of A_ThisLabel, use function parameters.
- Unlike subroutines, if one forgets to define the *end* of a function, one is usually alerted to the error as each `{` must have a corresponding `}`. It may also be easier to identify the bounds of a function than a label subroutine.
- Functions can be placed in the auto-execute section without interrupting it. The auto-execute section can now easily span the entire script, so may instead be referred to as [global code](Language.md#global-code), executing within the [auto-execute thread](Scripts.md#auto).
- Functions might be a little less prone to being misused as "goto" (where a user gosubs the current subroutine in order to loop, inevitably exhausting stack space and terminating the program).
- There is less ambiguity without functions (like [Hotkey](lib/Hotkey.md)) accepting a label or a function, where both can exist with the same name at once.
- For all remaining uses of labels, it is not valid to refer to a global label from inside a function. Therefore, label lookup can be limited to the local label list. Therefore, there is no need to check for invalid jumps from inside a function to outside (which were never supported).

### Hotkey and Hotstring Labels

[Hotkeys](Hotkeys.md) and non-autoreplace [hotstrings](Hotstrings.md) are no longer labels; instead, they (automatically) define a function. For multi-line hotkeys, use braces to enclose the body of the hotkey instead of terminating it with `return` (which is implied by the ending brace). To allow a hotkey to be called explicitly, specify `funcName(ThisHotkey)` between the `::` and `{` - this can also be done in v1.1.20+, but now there is a parameter. When the function definition is not explicit, the parameter is named ThisHotkey.

**Note:** Hotkey functions are [assume-local](Functions.md#AssumeLocal) by default and therefore cannot assign to [global variables](Functions.md#Global) without a declaration.

### Names

Function and variable names are now placed in a shared namespace.

- Each function definition creates a constant (read-only variable) within the current scope.
- Use `MyFunc` in place of `Func("MyFunc")`.
- Use `MyFunc` in place of `"MyFunc"` when passing the function to any built-in function such as [SetTimer](lib/SetTimer.md) or [Hotkey](lib/Hotkey.md). Passing a name (string) is no longer supported.
- Use `myVar()` in place of `%myVar%()` when calling a function by value.
- To call a function when all you have is a function name (string), first use a [double-deref](Variables.md#deref) to resolve the name to a variable and retrieve its value (the function object). `%myVar%()` now actually performs a double-deref and then calls the result, equivalent to `f := %myVar%, f()`. Avoid handling functions by name (string) where possible; use references instead.

Names cannot start with a digit and cannot contain the following characters which were previously allowed: `@ # $`. Only letters, numbers, underscore and non-ASCII characters are allowed.

**Reserved words:** Declaration keywords and names of control flow statements cannot be used as variable, function or class names. This includes `local`, `global`, `static`, `if`, `else`, `loop`, `for`, `while`, `until`, `break`, `continue`, `goto`, `return`, `switch`, `case`, `try`, `catch`, `finally` and `throw`. The purpose of this is primarily to detect errors such as `if (ex) break`.

**Reserved words:** `as`, `and`, `contains`, `false`, `in`, `is`, `IsSet`, `not`, `or`, `super`, `true`, `unset`. These words are reserved for future use or other specific purposes, and are not permitted as variable or function names even when unambiguous. This is primarily for consistency: in v1, `and := 1` was allowed on its own line but `(and := 1)` would not work.

The words listed above are permitted as property or window group names. Property names in typical use are preceded by `.`, which prevents the word from being interpreted as an operator. By contrast, keywords are never interpreted as variable or function names within an expression. For example, `not(x)` is equivalent to `not (x)` or `(not x)`.

A number of classes are predefined, effectively reserving those global variable names in the same way that a user-defined class would. (However, the [changes to scope](#scope) described below mitigate most issues arising from this.) For a list of classes, see [Built-in Classes](ObjList.md).

### Scope

*Super-global* variables have been removed (excluding built-in variables, which aren't quite the same as they cannot be redeclared or shadowed).

Within an [assume-local](Functions.md#AssumeLocal) function, if a given name is not used in a declaration or as the target of a non-dynamic assignment or the [reference (&) operator](Variables.md#ref), it may resolve to an existing global variable.

In other words:

- Functions can now read global variables without declaring them.
- Functions which have no `global` declarations cannot directly modify global variables (eliminating one source of unintended side-effects).
- Adding a new `class` to the script is much less likely to affect the behavior of any existing function, as classes are not super-global.
- The `global` keyword is currently redundant when used in global scope, but can be used for clarity. Variables declared this way are now much less likely to conflict with local variables (such as when combining scripts manually or with [#Include](lib/_Include.md)), as they are not super-global. On the other hand, some convenience is lost.
- Declarations are generally not needed as much.

*Force-local* mode has been removed.

### Variables

Local [static](Functions.md#static) variables are initialized if and when execution reaches them, instead of being executed in linear order before the auto-execute section begins. Each initializer has no effect the second time it is reached. Multiple declarations are permitted and may execute for the same variable at different times. There are multiple benefits:

- When a static initializer calls other functions with static variables, there is less risk of initializers having not executed yet due to the order of the function definitions.
- Because the function has been called, parameters, [A_ThisFunc](Variables.md#ThisFunc) and [closures](Functions.md#closures) are available (they previously were not).
- A static variable can be initialized conditionally, adding flexibility, while still only executing once without requiring `if IsSet()`.
- Since there may be multiple initializers for a single static variable, compound assignments such as `static x += 1` are permitted. (This change reduced code size marginally as it was already permitted by `local` and `global`.)

> **Note:** `static init := somefunction()` can no longer be used to auto-execute *somefunction*. However, since label-and-return based subroutines can now be completely avoided, the auto-execute section is able to span the entire script.

Declaring a variable with `local` no longer makes the function [assume-global](Functions.md#AssumeGlobal).

[Double-derefs](Variables.md#deref) are now more consistent with variables resolved at load-time, and are no longer capable of creating new variables. This avoids some inconsistencies and common points of confusion.

Double-derefs which fail for any reason now cause an error to be thrown. Previously any cases with an invalid name would silently produce an empty string, while other cases would create and return an empty variable.

### Expressions

Quoted literal strings can be written with `"double"` or `'single'` quote marks, but must begin and end with the same mark. Literal quote marks are written by preceding the mark with an escape character - `` `" `` or `` `' `` - or by using the opposite type of quote mark: `'"42" is the answer'`. Doubling the quote marks has no special meaning, and causes an error since auto-concat requires a space.

The operators `&&`, `||`, `and` and `or` yield whichever value determined the result, similar to JavaScript and Lua. For example, `"" or "default"` yields "default" instead of 1. Scripts which require a pure boolean value (0 or 1) can use something like `!!(x or y)` or `(x or y) ? 1 : 0`.

Auto-concat now requires at least one space or tab in all cases (the v1 documentation says there "should be" a space).

The result of a multi-statement expression such as `x(), y()` is the last (right-most) sub-expression instead of the first (left-most) sub-expression. In both v1 and v2, the sub-expressions are evaluated in left to right order.

Equals after a comma is no longer assignment: `y=z` in `x:=y, y=z` is an ineffectual comparison instead of an assignment.

`:=`, `+=`, `-=`, `*=`, `/=`, `++` and `--` have consistent behavior regardless of whether they are used on their own or combined with other operators, such as with `x := y, y += 2`. Previously, there were differences in behavior when an error occurred within the expression or a blank value was used in a math operation.

`!=` is now always case-insensitive, like `=`, while `!==` has been added as the counterpart of `==`.

`<>` has been removed.

`//` now throws an exception if given a floating-point number. Previously the results were inconsistent between negative floats and negative integers.

`|`, `^`, `&`, `<<` and `>>` now throw an exception if given a floating-point number, instead of truncating to integer.

Scientific notation can be used without a decimal point (but produces a floating-point number anyway). Scientific notation is also supported when numeric strings are converted to integers (for example, `"1e3"` is interpreted as 1000 instead of 1).

Function calls now permit virtually any sub-expression for specifying which function to call, provided that there is no space or tab before the open-parenthesis of the parameter list. For example, `MyFunc()` would call the value of *MyFunc* regardless of whether that is the function's actual name or a variable containing a function object, and `(a?b:c)()` would call either *b* or *c* depending on *a*. Note that `x.y()` is still a method call roughly equivalent to `(x.y)(x)`, but `a[i]()` is now equivalent to `(a[i])()`.

Double-derefs now permit almost any expression (not just variables) as the source of the variable name. For example, `DoNotUseArray%n+1%` and `%(%triple%)%` are valid. Double-deref syntax is now also used to dereference VarRefs, such as `ref := &var, value := %ref%`.

The expressions `funcName[""]()` and `funcName.()` no longer call a function by name. Omitting the method name as in `.()` now causes a load-time error message. Functions should be called or handled by reference, not by name.

`var :=` with no r-value is treated as an error at load-time. In v1 it was equivalent to `var := ""`, but silently failed if combined with another expression - for example: `x :=, y :=`.

Where a literal string is followed by an ambiguous unary/binary operator, an error is reported at load-time. For instance, `"new counter:" ++Counter` is probably supposed to increment and display *Counter*, but technically it is invalid addition and unary plus.

`word ++` and `word --` are no longer expressions, since `word` can be a user-defined function (and ++/-- may be followed by an expression which produces a variable reference). To write a standalone post-increment or post-decrement expression, either omit the space between the variable and the operator, or wrap the variable or expression in parentheses.

`word ? x : y` is still a ternary expression, but more complex cases starting with a word, such as `word1 word2 ? x : y`, are always interpreted as function calls to *word1* (even if no such function exists). To write a standalone ternary expression with a complex condition, enclose the condition in parentheses.

The new [`is` operator](Variables.md#is_in_contains) such as in `x is y` can be used to check whether value *x* is an instance of class *y*, where *y* must be an Object with a *Prototype* property (i.e. a [Class](lib/Class.md)). This includes primitive values, as in `x is Integer` (which is strictly a type check, whereas `IsInteger(x)` checks for potential conversion).

Keywords `contains` and `in` are reserved for future use.

`&var` (address-of) has been replaced with `StrPtr(var)` and `ObjPtr(obj)` to more clearly show the intent and enhance error checking. In v1, address-of returned the address of *var*'s internal string buffer, even if it contained a number (but not an object). It was also used to retrieve the address of an object, and getting an address of the wrong type can have dire consequences.

`&var` is now the [reference operator](Variables.md#ref), which is used with all [ByRef](#byref) and OutputVar parameters to improve clarity and flexibility (and make other language changes possible). See [Variable References (VarRef)](Concepts.md#variable-references) for more details.

String length is now cached during expression evaluation. This improves performance and allows strings to contain binary zero. In particular:

- Concatenation of two strings where one or both contain binary zero no longer causes truncation of the data.
- The case-sensitive equality operators (`==` and `!==`) can be used to compare binary data. The other comparison operators only "see" up to the first binary zero.
- Binary data can be returned from functions and assigned to objects.

Most functions still expect null-terminated strings, so will only "see" up to the first binary zero. For example, [MsgBox](lib/MsgBox.md) would display only the portion of the string before the first binary zero.

The `*` (deref) operator has been removed. Use [NumGet](lib/NumGet.md) instead.

The `~` ([bitwise-NOT](Variables.md#unary)) operator now always treats its input as a 64-bit signed integer; it no longer treats values between 0 and 4294967295 as unsigned 32-bit.

`>>>` and `>>>=` have been added for logical right bit shift.

Added [fat arrow functions](Variables.md#fat-arrow). The expression `Fn(Parameters) => Expression` defines a function named *Fn* (which can be blank) and returns a [Func object](lib/Func.md) or [Closure object](Functions.md#closures). When called, the function evaluates *Expression* and returns the result. When used inside another function, *Expression* can refer to the outer function's variables (this can also be done with a normal function definition).

The fat arrow syntax can also be used to define methods and property getters/setters (in which case the method/property definition itself isn't an expression, but its body just returns an expression).

Literal numbers are now fully supported on the left-hand side of member access (dot). For example, `0.1` is a number but `0.min` and `0.1.min` access the *min* property which can be handled by a base object (see [Primitive Values](Objects.md#primitive)). `1..2` or `1.0.2` is the number 1.0 followed by the property 2. Example use might be to implement units of measurement, literal version numbers or ranges.

`x**y`: Where *x* and *y* are integers and *y* is positive, the power operator now gives correct results for all inputs if in range, where previously some precision was lost due to the internal use of floating-point math. Behavior of overflow is undefined.

### Objects (Misc)

See also: [Objects](#objects)

There is now a distinction between properties accessed with `.` and data (items, array or map elements) accessed with `[]`. For example, `dictionary["Count"]` can return the definition of "Count" while `dictionary.Count` returns the number of words contained within. User-defined objects can utilize this by defining an [\__Item property](Objects.md#__Item).

When the name of a property or method is not known in advance, it can (and must) be accessed by using percent signs. For example, `obj.%varname%()` is the v2 equivalent of `obj[varname]()`. The use of `[]` is reserved for data (such as array elements).

The literal syntax for constructing an ad hoc object is still basically `{name: value}`, but since plain objects now only have "properties" and not "array elements", the rules have changed slightly for consistency with how properties are accessed in other contexts:

- `o := {a: b}` uses the name "a", as before.
- `o := {%a%: b}` uses the property name in *a*, instead of taking that as a variable name, performing a double-deref, and using the contents of the resulting variable. In other words, it has the same effect as `o := {}, o.%a% := b`.
- Any other kind of expression to the left of `:` is illegal. For instance, `{(a): b}` or `{an error: 1}`.

The use of the word "base" in `base.Method()` has been replaced with [super](Objects.md#Custom_Classes_super) (`super.Method()`) to distinguish the two concepts better:

- `super.` or `super[` calls the super-class version of a method/property, where "super-class" is the base of the prototype object which was originally associated with the current function's definition.
- `super` is a reserved word; attempting to use it without the `.` or `[` or `(` suffix or outside of a class results in a load time error.
- `base` is a pre-defined property which gets or sets the object's immediate base object (like [ObjGetBase](lib/Any.md#GetBase)/[ObjSetBase](lib/Object.md#SetBase)). It is just a normal property name, not reserved.
- Invoking `super.x` when the superclass has no definition of x throws an error, whereas `base.x` was previously ignored (even if it was an assignment).

Calling a user-defined object without explicitly specifying a method name now results in a call to the "Call" method instead of the "" method. For example, `%Fn%()` previously resulted in a call to `Fn.()`, but the v2 expression `Fn()` results in a call to `Fn.Call()`. [Func](lib/Func.md) objects no longer implement the nameless method. It is no longer valid to omit the method name in a method call, but `Fn.%""%()` works in place of `Fn.()`.

`this.Method()` calls `Fn.Call(this)` (where *Fn* is the function object which implements the method) instead of `Fn[this]()` (which in v1, would result in a call to `Fn.__Call(this)` unless `Fn[this]` contains a function). Function objects should implement a *Call* method instead of *\__Call*, which is only for explicit method calls.

`Classname()` (formerly `new Classname()`) now fails to create the object if the *\__New* method is defined and it could not be called (e.g. because the parameter count is incorrect), or if parameters were passed and *\__New* is not defined.

Objects created within an expression or returned from a function are now held until expression evaluation is complete, and then released. This improves performance slightly and allows temporary objects to be used for memory management within an expression, without fear of the objects being freed prematurely.

Objects can contain string values (but not keys) which contain binary zero. Cloning an object preserves binary data in strings, up to the stored length of the string (not its capacity). Historically, data was written beyond the value's length when dealing with binary data or structs; now, a [Buffer object](lib/Buffer.md) should be used instead.

Assignment expressions such as `x.y := z` now always yield the value of *z*, regardless of how *x.y* is implemented. The return value of a property setter is now ignored. Previously:

- Some built-in objects returned *z*, some returned *x.y* (such as `c := GuiObj.BackColor := "red"` setting *c* to 0xFF0000), and some returned an incorrect value.
- User-defined property setters may have returned unexpected values or failed to return anything.

`x.y(z) := v` is now a syntax error. It was previously equivalent to `x.y[z] := v`. In general, `x.y(z)` (method call) and `x.y[z]` (parameterized property) are two different operations, although they may be equivalent if *x* is a COM object (due to limitations of the COM interface).

Concatenating an object with another value or passing it to [Loop](lib/Loop.md) is currently treated as an error, whereas previously the object was treated as an empty string. This may be changed to implicitly call `.ToString()`. Use `String(x)` to convert a value to a string; this calls `.ToString()` if *x* is an object.

When an object is called via IDispatch (the COM interface), any uncaught exceptions which cannot be passed back to the caller will cause an error dialog. (The caller may or may not show an additional error dialog without any specific details.) This also applies to event handlers being called due to the use of [ComObjConnect](lib/ComObjConnect.md).

### Functions

Functions can no longer be dynamically called with more parameters than they formally accept.

[Variadic functions](Functions.md#Variadic) are not affected by the above restriction, but normally will create an array each time they are called to hold the surplus parameters. If this array is not needed, the parameter name can now be omitted to prevent it from being created:

```ahk
AcceptsOneOrMoreArgs(first, *) {
  ...
}
```

This can be used for callbacks where the additional parameters are not needed.

[Variadic function calls](Functions.md#VariadicCall) now permit any enumerable object, where previously they required a standard Object with sequential numeric keys. If the enumerator returns more than one value per iteration, only the first value is used. For example, `Array(mymap*)` creates an array containing the keys of *mymap*.

Variadic function calls previously had half-baked support for named parameters. This has been disabled, to remove a possible impediment to the proper implementation of named parameters.

User-defined functions may use the new keyword `unset` as a parameter default value to make the parameter "unset" when no value was provided. The function can then use IsSet() to determine if a value was provided. `unset` is currently not permitted in any other context.

Scripts are no longer automatically included from the function library (Lib) folders when a function call is present without a definition, due to increased complexity and potential for accidents (now that the *MyFunc* in `MyFunc()` can be any variable). `#Include <LibName>` works as before. It may be superseded by module support in a future release.

Variadic built-in functions now have a *MaxParams* value equal to *MinParams*, rather than an arbitrary number (such as 255 or 10000). Use the *IsVariadic* property to detect when there is no upper bound.

#### ByRef

[ByRef parameters](Functions.md#ByRef) are now declared using `&param` instead of `ByRef param`, with some differences in usage.

ByRef parameters no longer implicitly take a reference to the caller's variable. Instead, the caller must explicitly pass a reference with the [reference operator](Variables.md#ref) (`&var`). This allows more flexibility, such as storing references elsewhere, accepting them with a variadic function and passing them on with a variadic call.

When a parameter is marked ByRef, any attempt to explicitly pass a non-VarRef value causes an error to be thrown. Otherwise, the function can check for a reference with `param is VarRef`, check if the target variable has a value with `IsSetRef(param)`, and explicitly dereference it with `%param%`.

ByRef parameters are now able to receive a reference to a local variable from a previous instance of the same function, when it is called recursively.

### Nested Functions

One function may be defined inside another. A nested function may automatically "capture" non-static local variables from the enclosing function (under the right conditions), allowing them to be used after the enclosing function returns.

The new "fat arrow" `=>` operator can also be used to create nested functions.

For full detail, see [Nested Functions](Functions.md#nested).

### Uncategorized

`:=` must be used in place of `=` when initializing a declared variable or optional parameter.

`return %var%` now does a double-deref; previously it was equivalent to `return var`.

[#Include](lib/_Include.md) is relative to the directory containing the current file by default. Its parameter may now optionally be enclosed in quote marks.

[#ErrorStdOut](lib/_ErrorStdOut.md)'s parameter may now optionally be enclosed in quote marks.

Label names are now required to consist only of letters, numbers, underscore and non-ASCII characters (the same as variables, functions, etc.).

Labels defined in a function have local scope; they are visible only inside that function and do not conflict with labels defined elsewhere. It is not possible for local labels to be called externally (even by built-in functions). Nested functions can be used instead, allowing full use of local variables.

`for k, v in obj`:

- How the object is invoked has changed. See [Enumeration](#enumeration) further below.
- *k* and *v* are now restored to the values they had before the loop began, after the loop breaks or completes.
- An exception is thrown if *obj* is not an object or there is a problem retrieving or calling its enumerator.
- Up to 19 variables can be used.
- Variables can be omitted.

Escaping a comma no longer has any meaning. Previously if used in an expression within a command's parameter and not within parentheses, `` `, `` forced the comma to be interpreted as the multi-statement operator rather than as a delimiter between parameters. It only worked this way for commands, not functions or variable declarations.

The escape sequence `` `s `` is now allowed wherever `` `t `` is supported. It was previously only allowed by #IfWin and (Join.

`*/` can now be placed at the end of a line to end a multi-line comment, to resolve a common point of confusion relating to how `/* */` works in other languages. Due to the risk of ambiguity (e.g. with a hotstring ending in `*/`), any `*/` which is not preceded by `/*` is no longer ignored (reversing a change made in AHK_L revision 54).

Integer constants and numeric strings outside of the supported range (of 64-bit signed integers) now overflow/wrap around, instead of being capped at the min/max value. This is consistent with math operators, so `9223372036854775807+1 == 9223372036854775808` (but both produce -9223372036854775808). This facilitates bitwise operations on 64-bit values.

For numeric strings, there are fewer cases where whitespace characters other than space and tab are allowed to precede the number. The general rule (in both v1 and v2) is that only space and tab are permitted, but in some cases other whitespace characters are tolerated due to C runtime library conventions.

[Else](lib/Else.md) can now be used with [loops of any type](Language.md#loop-statement) and [Catch](lib/Catch.md). For loops, it is executed if the loop had zero iterations. For *Catch*, it is executed if no exception is thrown within *Try* (and is not executed if any error or value is thrown, even if there is no *Catch* matching the value's class). Consequently, the interpretation of *Else* may differ from previous versions when used without braces. For example:

```ahk
if condition
{
    while condition
        ; statement to execute for each iteration
} ; These braces are now required, otherwise else associates with while
else
    ; statement to execute if condition is false
```

### Continuation Sections

Smart LTrim: The default behavior is to count the number of leading spaces or tabs on the first line below the continuation section options, and remove that many spaces or tabs from each line thereafter. If the first line mixes spaces and tabs, only the first type of character is treated as indentation. If any line is indented less than the first line or with the wrong characters, all leading whitespace on that line is left as is.

Quote marks are automatically escaped (i.e. they are interpreted as literal characters) if the continuation section starts inside a quoted string. This avoids the need to escape quote marks in multi-line strings (if the starting and ending quotes are outside the continuation section) while still allowing multi-line expressions to contain quoted strings.

If the line above the continuation section ends with a name character and the section does not start inside a quoted string, a single space is automatically inserted to separate the name from the contents of the continuation section. This allows a continuation section to be used for a multi-line expression following `return`, function call statements, etc. It also ensures variable names are not joined with other tokens (or names), causing invalid expressions.

Newline characters (`` `n ``) in expressions are treated as spaces. This allows multi-line expressions to be written using a continuation section with default options (i.e. omitting `Join`).

The `,` and `%` options have been removed, since there is no longer any need to escape these characters.

If `(` or `)` appears in the options of a potential continuation section (other than as part of the `Join` option), the overall line is not interpreted as the start of a continuation section. In other words, lines like `(x.y)()` and `(x=y) && z()` are interpreted as expressions. A multi-line expression can also begin with an open-parenthesis at the start of a line, provided that there is at least one other `(` or `)` on the first physical line. For example, the entire expression could be enclosed with `((` ... `))`.

Excluding the above case, if any invalid options are present, a load-time error is displayed instead of ignoring the invalid options.

Lines starting with `(` and ending with `:` are no longer excluded from starting a continuation section on the basis of looking like a label, as `(` is no longer valid in a label name. This makes it possible for something like `(Join:` to start a continuation section. However, `(:` is an error and `(::` is still a hotkey.

A new method of line continuation is supported in expressions and function/property definitions which utilizes the fact that each `(`/`[`/`{` must be matched with a corresponding `)`/`]`/`}`. In other words, if a line contains an unclosed `(`/`[`/`{`, it will be joined with subsequent lines until the number of opening and closing symbols balances out. Brace `{` at the end of a line is considered to be [OTB](lib/Block.md#otb) (rather than the start of an object literal) if there are no other unclosed symbols and the brace is not immediately preceded by an operator.

### Continuation Lines

Line continuation is now more selective about the context in which a symbol is considered an expression operator. In general, comma and expression operators can no longer be used for continuation in a textual context, such as with hotstrings or directives (other than #HotIf), or after an unclosed quoted string.

Line continuation now works for expression operators at the end of a line.

`is`, `in` and `contains` are usable for line continuation, though `in` and `contains` are still reserved/not yet implemented as operators.

`and`, `or`, `is`, `in` and `contains` act as line continuation operators even if followed by an assignment or other binary operator, since these are no longer valid variable names. By contrast, v1 had exceptions for `and`/`or` followed by any of: `<>=/|^:,`

When `.` is used for continuation, the two lines are no longer automatically delimited by a space if there was no space or tab to the right of `.` at the start of a line, as in `.VeryLongNestedClassName`. Note that `x .123` is always property access (not auto-concat) and `x+.123` works with or without space.

### Types

In general, v2 produces more consistent results with any code that depends on the type of a value.

In v1, a variable can contain both a string and a cached binary number, which is updated whenever the variable is used as a number. Since this cached binary number is the only means of detecting the type of value, caching performed internally by expressions like `var+1` or `abs(var)` effectively changes the "type" of `var` as a side-effect. v2 disables this caching, so that `str := "123"` is always a string and `int := 123` is always an integer. Consequently, `str` needs to be converted every time it is used as a number (instead of just the first time), unless it was originally assigned a pure number.

The built-in "variables" `true`, `false`, `A_PtrSize`, `A_Index` and `A_EventInfo` always return pure integers, not strings. They sometimes return strings in v1 due to certain optimizations which have been superseded in v2.

All literal numbers are converted to pure binary numbers at load time and their string representation is discarded. For example, `MsgBox 0x1` is equivalent to `MsgBox 1`, while `MsgBox 1.0000` is equivalent to `MsgBox 1.0` (because the float formatting has changed). Storing a number in a variable or returning it from a user-defined function retains its pure numeric status.

The default format specifier for floating-point numbers is now `.17g` (was `0.6f`), which is more compact and more accurate in many cases. The default cannot be changed, but `Format` can be used to get different formatting.

Quoted literal strings and strings produced by concatenating with quoted literal strings are no longer unconditionally considered non-numeric. Instead, they are treated the same as strings stored in variables or returned from functions. This has the following implications:

- Quoted literal `"0"` is considered false.
- `("0xA") + 1` and `("0x" Chr(65)) + 1` produce 11 instead of failing.
- `x[y:="0"]` and `x["0"]` now behave the same.

The operators `=` and `!=` now compare their operands alphabetically if both are strings, even if they are numeric strings. Numeric comparison is still performed when both operands are numeric and at least one operand is a pure number (not a string). So for example, `54` and `"530"` are compared numerically, while `"54"` and `"530"` are compared alphabetically. Additionally, strings stored in variables are treated no differently from literal strings.

The relational operators `<`, `<=`, `>` and `>=` now throw an exception if used with a non-numeric string. Previously they compared numerically or alphabetically depending on whether both inputs were numeric, but literal quoted strings were always considered non-numeric. Use `StrCompare(a, b, CaseSense)` instead.

`Type(Value)` returns one of the following strings: String, Integer, Float, or the specific class of an object.

`Float(Value)`, `Integer(Value)` and `String(Value)` convert *Value* to the respective type, or throw an exception if the conversion cannot be performed (e.g. `Integer("1z")`). `Number(Value)` converts to Integer or Float. `String(Value)` calls `Value.ToString()` if *Value* is an object. (Ideally this would be done for any implicit conversion from object to string, but the current implementation makes this difficult.)

## Objects

Objects now use a more structured class-prototype approach, separating class/static members from instance members. Many of the built-in methods and Obj functions have been moved, renamed, changed or removed.

- Each user-defined or built-in class is a class object (an instance of [Class](lib/Class.md)) exposing only methods and properties defined with the `static` keyword (including static members inherited from the base class) and nested classes.
- Each class object has a [Prototype](lib/Class.md#Prototype) property which becomes the `base` of all instances of that class. All non-static method and property definitions inside the class body are attached to the prototype object.
- Instantiation is performed by calling the static [Call](lib/Class.md#Call) method, as in `myClass.Call()` or `myClass()`. This allows the class to fully override construction behavior (e.g. to implement a class factory or singleton, or to construct a native Array or Map instead of an Object), although initialization should still typically be performed in `__New`. The return value of `__New` is now ignored; to override the return value, do so from the Call method.

The mixed Object type has been split into `Object`, `Array` and `Map` (associative array).

Object is now the root class for all user-defined **and built-in** objects (this excludes VarRef and COM objects). Members added to `Object.Prototype` are inherited by all AutoHotkey objects.

The operator `is` expects a class, so `x is y` checks for `y.Prototype` in the base object chain. To check for *y* itself, call `x.HasBase(y)` or `HasBase(x, y)`.

User-defined classes can also explicitly extend `Object`, `Array`, `Map` or some other built-in class (though doing so is not always useful), with `Object` being the default base class if none is specified.

The `new` operator has been removed. Instead, just omit the operator, as in `MyClass()`. To construct an object *based on* another object that is not a class, create it with `{}` or `Object()` (or by any other means) and set its `base`. `__Init` and `__New` can be called explicitly if needed, but generally this is only appropriate when instantiating a class.

Nested class definitions now produce a dynamic property with *get* and *call* accessor functions instead of a simple value property. This is to support the following behavior:

- `Nested.Class()` does not pass *Nested* to `Nested.Class.Call` and ultimately `__New`, which would otherwise happen because this is the normal behavior for function objects called as methods (which is how the nested class is being used here).
- `Nested.Class := 1` is an error by default (the property is read-only).
- Referring to or calling the class for the first time causes it to be initialized.

GetCapacity and SetCapacity were removed.

- [ObjGetCapacity](lib/Object.md#GetCapacity) and [ObjSetCapacity](lib/Object.md#SetCapacity) now only affect the object's capacity to contain properties, and are not expected to be commonly used. Setting the capacity of the string buffer of a property, array element or map element is not supported; for binary data, use a [Buffer object](lib/Buffer.md).
- Array and Map have a Capacity property which corresponds to the object's current array or map allocation.

Other redundant Obj functions (which mirror built-in methods of Object) were removed. [ObjHasOwnProp](lib/Object.md#HasOwnProp) (formerly ObjHasKey) and [ObjOwnProps](lib/Object.md#OwnProps) (formerly ObjNewEnum) are kept to facilitate safe inspection of objects which have redefined those methods (and the primitive prototypes, which don't have them defined). ObjCount was replaced with [ObjOwnPropCount](lib/Object.md#OwnPropCount) (a function only, for all Objects) and Map has its own [Count](lib/Map.md#Count) property.

ObjRawGet and ObjRawSet were merged into [GetOwnPropDesc](lib/Object.md#GetOwnPropDesc) and [DefineProp](lib/Object.md#DefineProp). The original reasons for adding them were superseded by other changes, such as the `Map` type, changes to how meta-functions work, and DefineProp itself superseding meta-functions for some purposes.

Top-level class definitions now create a constant (read-only variable); that is, assigning to a class name is now an error rather than an optional warning, except where a local variable shadows the global class (which now occurs by default when assigning inside a function).

### Primitive Values

Primitive values emulate objects by delegating method and property calls to a prototype object based on their type, instead of the v1 "default base object". Integer and Float extend Number. String and Number extend Primitive. Primitive and Object extend Any. These all exist as predefined classes.

### Properties and Methods

Methods are defined by properties, unlike v2.0-a104 to v2.0-a127, where they are separate to properties. However, unlike v1, properties created by a class method definition (or built-in method) are read-only by default. Methods can still be created by assigning new value properties, which generally act as in v1.

The Object class defines new methods for dealing with properties and methods: [DefineProp](lib/Object.md#DefineProp), [DeleteProp](lib/Object.md#DeleteProp), [GetOwnPropDesc](lib/Object.md#GetOwnPropDesc), [HasOwnProp](lib/Object.md#HasOwnProp), [OwnProps](lib/Object.md#OwnProps). Additional methods are defined for all values (except ComObjects): [GetMethod](lib/Any.md#GetMethod), [HasProp](lib/Any.md#HasProp), [HasMethod](lib/Any.md#HasMethod).

Object, Array and Map are now separate types, and array elements are separate from properties.

All built-in methods and properties (including `base`) are defined the same way as if user-defined. This ensures consistent behavior and permits both built-in and user-defined members to be detected, retrieved or redefined.

If a property does not accept parameters, they are automatically passed to the object returned by the property (or it throws).

Attempting to retrieve a non-existent property is treated as an error for all types of values or objects, unless `__get` is defined. However, setting a non-existent property will create it in most cases.

Multi-dimension array hacks were removed. `x.y[z]:=1` no longer creates an object in `x.y`, and `x[y,z]` is an error unless x.__item handles two parameters (or x.__item.__item does, etc.).

If a property defines `get` but not `set`, assigning a value throws instead of overriding the property.

[DefineProp](lib/Object.md#DefineProp) can be used to define what happens when a specific property is retrieved, set *or called*, without having to define any meta-functions. Property and method definitions in classes utilize the same mechanism, so it is possible to define a property getter/setter and a method with the same name.

`{}` object literals now directly set *own property* values or the object's `base`. That is, `__Set` and property setters are no longer invoked (which would typically only be possible if `base` is set within the parameter list).

### Static/Class Variables

Static/class variable initializers are now executed within the context of a `static __Init` method, so `this` refers to the class and the initializers can create local variables. They are evaluated when the class is referenced for the first time (rather than being evaluated before the auto-execute section begins, strictly in the order of definition). If the class is not referenced sooner, they are evaluated when the class definition is reached during execution, so initialization of global variables can occur first, without putting them into a class.

### Meta-Functions

Meta-functions were greatly simplified; they act like normal methods:

- Where they are defined within the hierarchy is not important.
- If overridden, the base version is not called automatically. Scripts can call `super.__xxx()` if needed.
- If defined, it must perform the default action; e.g. if \__set does not store the value, it is not stored.
- Behavior is not dependent on whether the method uses `return` (but of course, \__get and \__call still need to return a value).

Method and property parameters are passed as an Array. This optimizes for chained base/superclass calls and (in combination with MaxParams validation) encourages authors to handle the args. For \__set, the value being assigned is passed separately.

```ahk
this.__call(name, args)
this.__get(name, args)
this.__set(name, args, value)
```

Defined properties and methods take precedence over meta-functions, regardless of whether they were defined in a base object.

\__Call is not called for internal calls to \__Enum (formerly \_NewEnum) or Call, such as when an object is passed to a [for-loop](lib/For.md) or a function object is being called by [SetTimer](lib/SetTimer.md).

The static method \__New is called for each class when it is initialized, if defined by that class or inherited from a superclass. See [Static/Class Variables](#staticclass-variables) (above) and [Class Initialization](Objects.md#static__New) for more detail.

### Array

`class Array extends Object`

An Array object contains a list or sequence of values, with index 1 being the first element.

When assigning or retrieving an array element, the absolute value of the index must be between 1 and the [Length](lib/Array.md#Length) of the array, otherwise an exception is thrown. An array can be resized by inserting or removing elements with the appropriate method, or by assigning [Length](lib/Array.md#Length).

Currently brackets are required when accessing elements; i.e. `a.1` refers to a property and `a[1]` refers to an element.

Negative values can be used to index in reverse.

Usage of [Clone](lib/Array.md#Clone), [Delete](lib/Array.md#Delete), [InsertAt](lib/Array.md#InsertAt), [Pop](lib/Array.md#Pop), [Push](lib/Array.md#Push) and [RemoveAt](lib/Array.md#RemoveAt) is basically unchanged. HasKey was renamed to [Has](lib/Array.md#Has). [Length](lib/Array.md#Length) is now a property. The [Capacity](lib/Array.md#Capacity) property was added.

Arrays can be constructed with `Array(values*)` or `[values*]`. Variadic functions receive an Array of parameters, and Arrays are also created by several built-in functions.

For-loop usage is `for val in arr` or `for idx, val in arr`, where `idx = A_Index` by default. That is, elements lacking a value are still enumerated, and the index is not returned if only one variable is passed.

### Map

A Map object is an associative array with capabilities similar to the v1 Object, but less ambiguity.

- [Clone](lib/Map.md#Clone) is used as before.
- [Delete](lib/Map.md#Delete) can only delete one key at a time.
- HasKey was renamed to [Has](lib/Map.md#Has).
- [Count](lib/Map.md#Count) is now a property.
- New properties: [Capacity](lib/Map.md#Capacity), [CaseSense](lib/Map.md#CaseSense)
- New methods: [Get](lib/Map.md#Get), [Set](lib/Map.md#Set), [Clear](lib/Map.md#Clear)
- String keys are case-sensitive by default and are never converted to Integer.

Currently Float keys are still converted to strings.

Brackets are required when accessing elements; i.e. `a.b` refers to a property and `a["b"]` refers to an element. Unlike in v1, a property or method cannot be accidentally disabled by assigning an array element.

An exception is thrown if one attempts to retrieve the value of an element which does not exist, unless the map has a [Default](lib/Map.md#Default) property defined. `MapObj.Get(key, default)` can be used to explicitly provide a default value for each request.

Use `Map(Key, Value, ...)` to create a map from a list of key-value pairs.

### Enumeration

Changed enumerator model:

- Replaced \_NewEnum() with \__Enum(n).
- The required parameter n contains the number of variables in the for-loop, to allow it to affect enumeration without having to postpone initialization until the first iteration call.
- Replaced Next() with Call(), with the same usage except that ByRef works differently now; for instance, a method defined as `Call(&a)` should assign `a := next_value` while `Call(a)` would receive a [VarRef](Concepts.md#variable-references), so should assign `%a% := next_value`.
- If \__Enum is not present, the object is assumed to be an enumerator. This allows function objects (such as [closures](Functions.md#closures)) to be used directly.

Since array elements and properties are now separate, enumerating properties requires explicitly creating an enumerator by calling [OwnProps](lib/Object.md#OwnProps).

### Bound Functions

When a [bound function](misc/Functor.md#BoundFunc) is called, parameters passed by the caller fill in any positions that were omitted when creating the bound function. For example, `F.Bind(,b).Call(a,c)` calls `F(a,b,c)` rather than `F(,b,a,c)`.

### COM Objects (ComObject)

COM wrapper objects now identify as instances of a few different classes depending on their variant type (which affects what methods and properties they support, as before):

- `ComValue` is the base class for all COM wrapper objects.
- `ComObject` is for VT_DISPATCH with a non-null pointer; that is, typically a valid COM object that can be invoked by the script using normal object syntax.
- `ComObjArray` is for VT_ARRAY (SafeArrays).
- `ComValueRef` is for VT_BYREF.

These classes can be used for type checks with `obj is ComObject` and similar. Properties and methods can be defined for objects of type ComValue, ComObjArray and ComValueRef (but not ComObject) by modifying the respective prototype object.

`ComObject(CLSID)` creates a ComObject; i.e. this is the new ComObjCreate.

Note: If you are updating old code and get a TypeError due to passing an Integer to ComObject, it's likely that you should be calling ComValue instead.

`ComValue(vt, value)` creates a wrapper object. It can return an instance of any of the classes listed above. This replaces `ComObjParameter(vt, value)`, `ComObject(vt, value)` and any other names that were used with a *variant type* and *value* as parameters. *value* is converted to the appropriate type (following COM conventions), instead of requiring an integer with the right binary value. In particular, the following behave differently to before when passed an integer: R4, R8, Cy, Date. Pointer types permit either a pure integer address as before, or an object/ComValue.

`ComObjFromPtr(pdsp)` is a function similar to `ComObjEnwrap(dsp)`, but like ObjFromPtr, it does not call AddRef on the pointer. The equivalent in v1 is `ComObject(9, dsp, 1)`; omitting the third parameter in v1 caused an AddRef.

For both ComValue and ComObjFromPtr, be warned that AddRef is never called automatically; in that respect, they behave like `ComObject(9, value, 1)` or `ComObject(13, value, 1)` in v1. This does not necessarily mean you should add `ObjAddRef(value)` when updating old scripts, as many scripts used the old function incorrectly.

COM wrapper objects with variant type VT_BYREF, VT_ARRAY or VT_UNKNOWN now have a *Ptr* property equivalent to `ComObjValue(ComObj)`. This allows them to be passed to [DllCall](lib/DllCall.md) or [ComCall](lib/ComCall.md) with the *Ptr* arg type. It also allows the object to be passed directly to [NumPut](lib/NumPut.md) or [NumGet](lib/NumGet.md), which may be used with VT_BYREF (access the caller's typed variable), VT_ARRAY (access SAFEARRAY fields) or VT_UNKNOWN (retrieve vtable pointer).

COM wrapper objects with variant type VT_DISPATCH or VT_UNKNOWN and a null interface pointer now have a *Ptr* property which can be read or assigned. Once assigned a non-null pointer, the property is read-only. This is intended for use with [DllCall](lib/DllCall.md) and [ComCall](lib/ComCall.md), so the pointer does not need to be manually wrapped after the function returns.

Enumeration of ComObjArray is now consistent with Array; i.e. `for value in arr` or `for index, value in arr` rather than `for value, vartype in arr`. The starting value for *index* is the lower bound of the ComObjArray (`arr.MinIndex()`), typically 0.

The integer types I1, I8, UI1, UI2, UI4 and UI8 are now converted to Integer rather than String. These occur rarely in COM calls, but this also applies to VT_BYREF wrappers. VT_ERROR is no longer converted to Integer; it instead produces a ComValue.

COM objects no longer set [A_LastError](Variables.md#LastError) when a property or method invocation fails.

### Default Property

A COM object may have a "default property", which has two uses:

- The *value* of the object. For instance, in VBScript, `MsgBox obj` evaluates the object by invoking its default member.
- The indexed property of a collection, which is usually named *Item* or *item*.

AutoHotkey v1 had no concept of a default property, so the COM object wrapper would invoke the default property if the property name was omitted; i.e. `obj[]` or `obj[,x]`.

However, AutoHotkey v2 separates properties from array/map/collection items, and to do this `obj[x]` is mapped to the object's default property (whether or not *x* is present). For AutoHotkey objects, this is `__Item`.

Some COM objects which represent arrays or collections do not expose a default property, so items cannot be accessed with `[]` in v2. For instance, JavaScript array objects and some other objects normally used with JavaScript expose array elements as properties. In such cases, `arr.%i%` can be used to access an array element-property.

When an AutoHotkey v2 [Array object](lib/Array.md) is passed to JavaScript, its elements cannot be retrieved with JavaScript's `arr[i]`, because that would attempt to access a property.

### COM Calls

Calls to AutoHotkey objects via the IDispatch interface now transparently support VT_BYREF parameters. This would most commonly be used with COM events ([ComObjConnect](lib/ComObjConnect.md)).

For each VT_BYREF parameter, an unnamed temporary var is created, the value is copied from the caller's variable, and a [VarRef](Concepts.md#variable-references) is passed to the AutoHotkey function/method. Upon return, the value is copied from the temporary var back into the caller's variable.

A function/method can assign a value by declaring the parameter ByRef (with `&`) or by explicit dereferencing.

For example, a parameter of type `VT_BYREF|VT_BOOL` would previously have received a ComObjRef object, and would be assigned a value like `pbCancel[] := true` or `NumPut(-1, ComObjValue(pbCancel), "short")`. Now the parameter can be defined as `&bCancel` and assigned like `bCancel := true`; or can be defined as `pbCancel` and assigned like `%pbCancel% := true`.

## Library

<a id="removed-details"></a>

<a id="lib-removed"></a>
### Removed Commands, Functions & Directives

| Removed | Note |
| --- | --- |
| Asc() | Use [Ord](lib/Ord.md) instead. |
| AutoTrim | Use [Trim](lib/Trim.md) instead. |
| ComObjMissing() | Write two consecutive commas instead. |
| ComObjUnwrap() | Use [ComObjValue](lib/ComObjValue.md) instead, and [ObjAddRef](lib/ObjAddRef.md) if needed. |
| ComObjEnwrap() | Use [ComObjFromPtr](lib/ComObjFromPtr.md) instead, and [ObjAddRef](lib/ObjAddRef.md) if needed. |
| ComObjError() |  |
| ComObjXXX() | If XXX is anything other than one of the explicitly defined ComObj functions, use [ComObjActive](lib/ComObjActive.md), [ComValue](lib/ComValue.md) or [ComObjFromPtr](lib/ComObjFromPtr.md) instead. |
| ControlSendRaw | Use `ControlSend "{Raw}"` or [ControlSendText](lib/ControlSend.md) instead. |
| EnvDiv | Use [`/`](Variables.md#MulDiv) or [`/=`](Variables.md#AssignOp) instead, e.g. `a /= b`. |
| EnvMult | Use [`*`](Variables.md#MulDiv) or [`*=`](Variables.md#AssignOp) instead, e.g. `a *= b`. |
| <a id="EnvUpdate"></a>EnvUpdate | It is of very limited usefulness and can be replaced with a simple [SendMessage](lib/SendMessage.md) as follows: `SendMessage(0x1A, 0, StrPtr("Environment"), 0xFFFF)`. |
| Exception | Use [Error](lib/Error.md) or an appropriate subclass. |
| FileReadLine | Use a [file-reading loop](lib/LoopFiles.md) or [FileOpen](lib/FileOpen.md) instead. |
| Func | Use a direct reference like `MyFunc` instead. |
| Gosub |  |
| Gui<br>GuiControl<br>GuiControlGet | See [Gui](#gui) further below. |
| IfEqual | Use [If](lib/If.md) and [`=`](Variables.md#equal) instead, e.g. `if a = b`. |
| IfExist | Use [If](lib/If.md) and [FileExist](lib/FileExist.md) instead, e.g. `if FileExist(...)`. |
| IfGreater | Use [If](lib/If.md) and [`>`](Variables.md#compare) instead, e.g. `if a > b`. |
| IfGreaterOrEqual | Use [If](lib/If.md) and [`>=`](Variables.md#compare) instead, e.g. `if a >= b`. |
| IfInString | Use [If](lib/If.md) and [InStr](lib/InStr.md) instead, e.g. `if InStr(...)`. |
| IfLess | Use [If](lib/If.md) and [`<`](Variables.md#compare) instead, e.g. `if a < b`. |
| IfLessOrEqual | Use [If](lib/If.md) and [`<=`](Variables.md#compare) instead, e.g. `if a <= b`. |
| IfMsgBox | [MsgBox](lib/MsgBox.md) now returns the button name. |
| IfNotEqual | Use [If](lib/If.md) and [`!=`](Variables.md#equal) instead, e.g. `if a != b`. |
| IfNotExist | Use [If](lib/If.md) and [FileExist](lib/FileExist.md) instead, e.g. `if not FileExist(...)`. |
| IfNotInString | Use [If](lib/If.md) and [InStr](lib/InStr.md) instead, e.g. `if not InStr(...)`. |
| IfWinActive | Use [If](lib/If.md) and [WinActive](lib/WinActive.md) instead, e.g. `if WinActive(...)`. |
| IfWinExist | Use [If](lib/If.md) and [WinExist](lib/WinExist.md) instead, e.g. `if WinExist(...)`. |
| IfWinNotActive | Use [If](lib/If.md) and [WinActive](lib/WinActive.md) instead, e.g. `if not WinActive(...)`. |
| IfWinNotExist | Use [If](lib/If.md) and [WinExist](lib/WinExist.md) instead, e.g. `if not WinExist(...)`. |
| If between | See [If example #5](lib/If.md#ExIfBetween). |
| If in/contains | See [If example #6](lib/If.md#ExIfInContains). |
| If is | See [isXXX](#isXXX) further below. |
| Input | Use [InputHook](lib/InputHook.md) instead. |
| IsByRef | See [ByRef limitations](Functions.md#NoIsByRef). |
| IsFunc |  |
| Menu | Use the [Menu/MenuBar class](lib/Menu.md), [TraySetIcon](lib/TraySetIcon.md), [A_IconTip](Variables.md#IconTip), [A_IconHidden](Variables.md#IconHidden) and [A_AllowMainWindow](Variables.md#AllowMainWindow). |
| MenuGetHandle | Use [Menu.Handle](lib/Menu.md#Handle) instead. |
| MenuGetName | There are no menu names; [MenuFromHandle](lib/MenuFromHandle.md) is the closest replacement. |
| Progress | Use [Gui](lib/Gui.md) instead. |
| SendRaw | Use `Send "{Raw}"` or [SendText](lib/Send.md#SendText) instead. |
| SetBatchLines | -1 is now the default behavior. |
| SetEnv | Use [`:=`](Variables.md#AssignOp) instead. |
| SetFormat | [Format](lib/Format.md) can be used to format a string. |
| SoundGet<br>SoundSet | See [Sound functions](#Sound) further below. |
| SoundGetWaveVolume<br>SoundSetWaveVolume | They have slightly different behavior than SoundGet and SoundSet regarding balance, but neither one preserves balance. |
| SplashImage | Use [Gui](lib/Gui.md) instead. |
| SplashTextOn/Off | Use [Gui](lib/Gui.md) instead. |
| <a id="StringCaseSense"></a>StringCaseSense | `!=` is always case-insensitive (but `!==` was added for case-sensitive not-equal), and both `=` and `!=` only ignore case for ASCII characters. [StrCompare](lib/StrCompare.md) was added for comparing strings using any mode. Various string functions now have a *CaseSense* parameter which can be used to specify case-sensitivity or the locale mode. |
| StringGetPos | Use [InStr](lib/InStr.md) instead. |
| StringLeft<br>StringLen<br>StringMid<br>StringRight<br>StringTrimLeft<br>StringTrimRight | Use [SubStr](lib/SubStr.md) instead. |
| StringReplace | Use [StrReplace](lib/StrReplace.md) instead. |
| StringSplit | Use [StrSplit](lib/StrSplit.md) instead. |
| Transform | Use [math functions](lib/Math.md) and [operators](Variables.md#Operators) instead. For Transform Deref, see [RegExMatch example #8](lib/RegExMatch.md#ExDeref). For Transform HTML, see [HTML Entities Encoding](scripts/index.md#HTML_Entities_Encoding). |
| VarSetCapacity | Use a [Buffer object](lib/Buffer.md) for binary data/structs and [VarSetStrCapacity](lib/VarSetStrCapacity.md) for UTF-16 strings. |
| WinGetActiveStats | Use [WinGetTitle](lib/WinGetTitle.md) and [WinGetPos](lib/WinGetPos.md) instead. |
| WinGetActiveTitle | Use [WinGetTitle](lib/WinGetTitle.md) instead, e.g. `WinGetTitle "A"`. |
| #CommentFlag |  |
| #Delimiter |  |
| #DerefChar |  |
| #EscapeChar |  |
| #HotkeyInterval | Use [A_HotkeyInterval](Variables.md#HotkeyInterval) instead. |
| #HotkeyModifierTimeout | Use [A_HotkeyModifierTimeout](lib/A_HotkeyModifierTimeout.md) instead. |
| #IfWinActive<br>#IfWinExist<br>#IfWinNotActive<br>#IfWinNotExist | See [#HotIf Optimization](lib/_HotIf.md#optimization). |
| #InstallKeybdHook | Use [InstallKeybdHook](lib/InstallKeybdHook.md) instead. |
| #InstallMouseHook | Use [InstallMouseHook](lib/InstallMouseHook.md) instead. |
| #KeyHistory | Use `KeyHistory N` instead. |
| #LTrim | Use the [LTrim](Scripts.md#LTrim) option instead if needed. |
| #MaxHotkeysPerInterval | Use [A_MaxHotkeysPerInterval](lib/A_MaxHotkeysPerInterval.md) instead. |
| #MaxMem | Maximum capacity of each variable is now unlimited. |
| #MenuMaskKey | Use [A_MenuMaskKey](lib/A_MenuMaskKey.md) instead. |
| #NoEnv | It is now the default behavior. |

<a id="lib-renamed"></a>
### Renamed Commands, Functions & Directives

| v1 Name | v2 Name |
| --- | --- |
| ComObjCreate() | [ComObject](lib/ComObject.md), which is a class now |
| ComObjParameter() | [ComValue](lib/ComValue.md), which is a class now |
| DriveSpaceFree | [DriveGetSpaceFree](lib/DriveGetSpaceFree.md) |
| EnvAdd | [DateAdd](lib/DateAdd.md) |
| EnvSub | [DateDiff](lib/DateDiff.md) |
| FileCopyDir | [DirCopy](lib/DirCopy.md) |
| FileCreateDir | [DirCreate](lib/DirCreate.md) |
| FileMoveDir | [DirMove](lib/DirMove.md) |
| FileRemoveDir | [DirDelete](lib/DirDelete.md) |
| FileSelectFile | [FileSelect](lib/FileSelect.md) |
| FileSelectFolder | [DirSelect](lib/DirSelect.md) |
| #If | [#HotIf](lib/_HotIf.md) |
| #IfTimeout | [HotIfTimeout](lib/_HotIfTimeout.md) |
| StringLower | [StrLower](lib/StrLower.md) and [StrTitle](lib/StrLower.md) |
| StringUpper | [StrUpper](lib/StrLower.md) and [StrTitle](lib/StrLower.md) |
| UrlDownloadToFile | [Download](lib/Download.md) |
| WinMenuSelectItem | [MenuSelect](lib/MenuSelect.md) |
| LV, TV and SB functions | methods of [GuiControl](lib/GuiControl.md) |
| File.__Handle | [File.Handle](lib/File.md#Handle) |

<a id="modified-commandsfunctions"></a>

<a id="lib-modified"></a>
### Modified Commands, Functions & Directives

> About the section title: there are no commands in v2, just functions. The title refers to both versions.

[BlockInput](lib/BlockInput.md) is no longer momentarily disabled whenever an Alt event is sent with the SendEvent method. This was originally done to work around a bug in some versions of Windows XP, where BlockInput blocked the artificial Alt event.

`Chr(0)` returns a string of length 1, containing a binary zero. This is a result of improved support for binary zero in strings.

[ClipWait](lib/ClipWait.md) now returns 0 (false) if the wait period expires, otherwise 1 (true). ErrorLevel was removed. Specifying 0 is no longer the same as specifying 0.5; instead, it produces the shortest wait possible.

`ComObj()`: This function had a sort of wildcard name, allowing many different suffixes. Some names were more commonly used with specific types of parameters, such as `ComObjActive(CLSID)`, `ComObjParameter(vt, value)`, `ComObjEnwrap(dsp)`. There are instead now separate functions/classes, and no more wildcard names. See [COM Objects (ComObject)](#com-objects-comobject) for details.

ControlID: Several changes have been made to the [*ControlID* parameter](misc/ControlID.md) used by the [Control functions](lib/Control.md), [SendMessage](lib/SendMessage.md) and [PostMessage](lib/PostMessage.md):

- It can now accept a HWND (must be a pure integer) or an object with a *Hwnd* property, such as a [GuiControl object](lib/GuiControl.md). The HWND can identify a control or a top-level window, though the latter is usually only meaningful for a select few functions (see below).
- It is no longer optional, except with functions which can operate on a top-level window ([ControlSend[Text]](lib/ControlSend.md), [ControlClick](lib/ControlClick.md), [SendMessage](lib/SendMessage.md), [PostMessage](lib/PostMessage.md)) or when preceded by other optional parameters ([ListViewGetContent](lib/ListViewGetContent.md), [ControlGetPos](lib/ControlGetPos.md), [ControlMove](lib/ControlMove.md)).
- If omitted, the target window is used instead. This matches the previous behavior of [SendMessage](lib/SendMessage.md)/[PostMessage](lib/PostMessage.md), and replaces the `ahk_parent` special value previously used by [ControlSend](lib/ControlSend.md).
- Blank values are invalid. Functions never default to the target window's topmost control.

[ControlGetFocus](lib/ControlGetFocus.md) now returns the control's HWND instead of its ClassNN, and no longer considers there to be an error when it has successfully determined that the window has no focused control.

[ControlMove](lib/ControlMove.md), [ControlGetPos](lib/ControlGetPos.md) and [ControlClick](lib/ControlClick.md) now use client coordinates (like [GuiControl](lib/GuiControl.md)) instead of window coordinates. Client coordinates are relative to the top-left of the client area, which excludes the window's title bar and borders. (Controls are rendered only inside the client area.)

[ControlMove](lib/ControlMove.md), [ControlSend](lib/ControlSend.md) and [ControlSetText](lib/ControlSetText.md) now use parameter order consistent with the other Control functions; i.e. ***ControlID**, WinTitle, WinText, ExcludeTitle, ExcludeText* are always grouped together (at the end of the parameter list), to aide memorisation.

[CoordMode](lib/CoordMode.md) no longer accepts "Relative" as a mode, since all modes are relative to something. It was synonymous with "Window", so use that instead.

[DllCall](lib/DllCall.md): See [DllCall](#dllcall) section further below.

[Edit](lib/Edit.md) previously had fallback behavior for the `.ini` file type if the "edit" shell verb was not registered. This was removed as script files are not expected to have the `.ini` extension. `AutoHotkey.ini` was the default script name in old versions of AutoHotkey.

[Edit](lib/Edit.md) now does nothing if the script was read from stdin, instead of attempting to open an editor for `*`.

[EnvSet](lib/EnvSet.md) now deletes the environment variable if the *Value* parameter is completely omitted.

[Exit](lib/Exit.md) previously acted as [ExitApp](lib/ExitApp.md) when the script is not persistent, even if there were other suspended threads interrupted by the thread which called Exit. It no longer does this. Instead, it always exits the current thread properly, and (if non-persistent) the script terminates only after the last thread exits. This ensures [Finally](lib/Finally.md) statements are executed and local variables are freed, which may allow `__delete` to be called for any objects contained by local variables.

[FileAppend](lib/FileAppend.md) defaults to no end-of-line translations, consistent with [FileRead](lib/FileRead.md) and [FileOpen](lib/FileOpen.md). FileAppend and FileRead both have a separate *Options* parameter which replaces the option prefixes and may include an optional encoding name (superseding FileRead's `*Pnnn` option). FileAppend, FileRead and FileOpen use ``"`n"`` to enable end-of-line translations. FileAppend and FileRead support an option `"RAW"` to disable codepage conversion (read/write binary data); FileRead returns a [Buffer object](lib/Buffer.md) in this case. This replaces `*c` (see [ClipboardAll](lib/ClipboardAll.md)). FileAppend may accept a Buffer-like object, in which case no conversions are performed.

[FileCopy](lib/FileCopy.md) and [FileMove](lib/FileMove.md) now throw an exception if the source path does not contain `*` or `?` and no file was not found. However, it is still not considered an error to copy or move zero files when the source path contains wildcards.

[FileOpen](lib/FileOpen.md) now throws an exception if it fails to open the file. Otherwise, an exception would be thrown (if the script didn't check for failure) by the first attempt to access the object, rather than at the actual point of failure.

[File.RawRead](lib/File.md#RawRead): When a variable is passed directly, the address of the variable's internal string buffer is no longer used. Therefore, a variable containing an address may be passed directly (whereas in v1, something like `var+0` was necessary).

For buffers allocated by the script, the new [Buffer object](lib/Buffer.md) is preferred over a variable; any object can be used, but must have *Ptr* and *Size* properties.

[File.RawWrite](lib/File.md#RawWrite): As above, except that it can accept a string (or variable containing a string), in which case *Bytes* defaults to the size of the string in bytes. The string may contain binary zero.

[File.ReadLine](lib/File.md#ReadLine) now always supports `` `r ``, `` `n `` and `` `r`n `` as line endings, and no longer includes the line ending in the return value. Line endings are still returned to the script as-is by [File.Read](lib/File.md#Read) if EOL translation is not enabled.

[FileEncoding](lib/FileEncoding.md) now allows code pages to be specified by number without the `CP` prefix. Its parameter is no longer optional, but can still be explicitly blank.

[FileExist](lib/FileExist.md) now ignores the `.` and `..` implied in every directory listing, so `FileExist("dir\*")` is now false instead of true when dir exists but is empty.

[FileGetAttrib](lib/FileGetAttrib.md) and A_LoopFileAttrib now include the letter "L" for reparse points or symbolic links.

[FileInstall](lib/FileInstall.md) in a non-compiled script no longer attempts to copy the file if source and destination are the same path (after resolving relative paths, as the source is relative to [A_ScriptDir](Variables.md#ScriptDir), not [A_WorkingDir](Variables.md#WorkingDir)). In v1 this caused ErrorLevel to be set to 1, which mostly went unnoticed. Attempting to copy a file onto itself via two different paths still causes an error.

FileSelectFile (now named [FileSelect](lib/FileSelect.md)) had two multi-select modes, accessible via options 4 and M. Option 4 and the corresponding mode have been removed; they had been undocumented for some time. FileSelect now returns an Array of paths when the multi-select mode is used, instead of a string like ``C:\Dir`nFile1`nFile2``. Each array element contains the full path of a file. If the user cancels, the array is empty.

FileSelect now uses the IFileDialog API present in Windows Vista and later, instead of the old GetOpenFileName/GetSaveFileName API. This removes the need for (built-in) workarounds relating to the dialog changing the current working directory.

FileSelect no longer has a redundant "Text Documents (\*.txt)" filter by default when *Filter* is omitted.

FileSelect no longer strips spaces from the filter pattern, such as for `pattern with spaces*.ext`. Testing indicates spaces on either side of the pattern (such as after the semi-colon in `*.cpp; *.h`) are already ignored by the OS, so there should be no negative consequences.

FileSelect can now be used in "Select Folder" mode via the `D` option letter.

[FileSetAttrib](lib/FileSetAttrib.md) now overwrites attributes when no +, - or ^ prefix is present, instead of doing nothing. For example, `FileSetAttrib(FileGetAttrib(file2), file1)` copies the attributes of file2 to file1 (adding any that file2 has and removing any that it does not have).

[FileSetAttrib](lib/FileSetAttrib.md) and [FileSetTime](lib/FileSetTime.md): the *OperateOnFolders* and *Recurse* parameters have been replaced with a single *Mode* parameter identical to that of [Loop Files](lib/LoopFiles.md). For example, `FileSetAttrib("+a", "*.zip", "RF")` (Recursively operate on Files only).

[GetKeyName](lib/GetKeyName.md) now returns the non-Numpad names for VK codes that correspond to both a Numpad and a non-Numpad key. For instance, `GetKeyName("vk25")` returns Left instead of NumpadLeft.

[GetKeyState](lib/GetKeyState.md) now always returns 1 or 0 instead of On or Off.

[GroupActivate](lib/GroupActivate.md) now returns the HWND of the window which was selected for activation, or 0 if there were no matches (aside from the already-active window), instead of setting ErrorLevel.

[GroupAdd](lib/GroupAdd.md): Removed the *Label* parameter and related functionality. This was an unintuitive way to detect when GroupActivate fails to find any matching windows; GroupActivate's return value should be used instead.

[GroupDeactivate](lib/GroupDeactivate.md) now selects windows in a manner closer to the `Alt`+`Esc` and `Alt`+`Shift`+`Esc` system hotkeys and the taskbar. Specifically,

- Owned windows are not evaluated. If the owner window is eligible (not a match for the group), either the owner window or one of its owned windows is activated; whichever was active last. A window owned by a group member will no longer be activated, but adding the owned window itself to the group now has no effect. (The previous behavior was to cycle through every owned window and never activate the owner.)
- Any disabled window is skipped, unless one of its owned windows was active more recently than it.
- Windows with the WS_EX_NOACTIVATE style are skipped, since they are probably not supposed to be activated. They are also skipped by the `Alt`+`Esc` and `Alt`+`Shift`+`Esc` system hotkeys.
- Windows with WS_EX_TOOLWINDOW but not WS_EX_APPWINDOW are omitted from the taskbar and Alt-Tab, and are therefore skipped.

[Hotkey](lib/Hotkey.md) no longer defaults to the script's bottommost [#HotIf](lib/_HotIf.md) (formerly #If). Hotkey/hotstring and HotIf threads default to the same criterion as the hotkey, so `Hotkey A_ThisHotkey, "Off"` turns off the current hotkey even if it is context-sensitive. All other threads default to the last setting used by the auto-execute section, which itself defaults to no criterion (global hotkeys).

[Hotkey](lib/Hotkey.md)'s *Action* parameter now requires a function object or hotkey name. Labels and function names are no longer supported. If a hotkey name is specified, the original function of that hotkey is used; and unlike before, this works with [#HotIf](lib/_HotIf.md) (formerly #If).

- Among other benefits, this eliminates ambiguity with the following special strings: `On`, `Off`, `Toggle`, `AltTab`, `ShiftAltTab`, `AltTabAndMenu`, `AltTabMenuDismiss`. The old behavior was to use the label/function by that name if one existed, but only if the *Label* parameter did not contain a variable reference or expression.

[Hotkey](lib/Hotkey.md) and [Hotstring](lib/Hotstring.md) now support the S option to make the hotkey/hostring exempt from [Suspend](lib/Suspend.md) (equivalent to the new [#SuspendExempt](lib/_SuspendExempt.md) directive), and the S0 option to disable exemption.

"Hotkey If" and the other If sub-commands were replaced with individual functions: [HotIf, HotIfWinActive, HotIfWinExist, HotIfWinNotActive, HotIfWinNotExist](lib/HotIf.md).

[HotIf](lib/HotIf.md) (formerly "Hotkey If") now recognizes expressions which use the `and` or `or` operators. This did not work in v1 as these operators were replaced with `&&` or `||` at load time.

[Hotkey](lib/Hotkey.md) no longer has a UseErrorLevel option, and never sets ErrorLevel. An exception is thrown on failure. Error messages were changed to be constant (and shorter), with the key or hotkey name in `Exception.Extra`, and the class of the exception indicating the reason for failure.

[#HotIf](lib/_HotIf.md) (formerly #If) now implicitly creates a function with one parameter (ThisHotkey). As is the default for all functions, this function is [assume-local](Functions.md#AssumeLocal). The expression can create local variables and read global variables, but cannot directly assign to global variables as the expression cannot contain declarations.

#HotIf has been optimized so that simple calls to [WinActive](lib/WinActive.md) or [WinExist](lib/WinExist.md) can be evaluated directly by the hook thread (as #IfWin was in v1, and [HotIfWin](lib/HotIf.md) still is). This improves performance and reduces the risk of problems when the script is busy/unresponsive. This optimization applies to expressions which contain a single call to [WinActive](lib/WinActive.md) or [WinExist](lib/WinExist.md) with up to two parameters, where each parameter is a simple quoted string and the result is optionally inverted with `!` or `not`. For example, `#HotIf WinActive("Chrome")` or `#HotIf !WinExist("Popup")`. In these cases, the first expression with any given combination of criteria can be identified by either the expression or the window criteria. For example, `HotIf '!WinExist("Popup")'` and `HotIfWinNotExist "Popup"` refer to the same hotkey variants.

`KeyHistory N` resizes the key history buffer instead of displaying the key history. This replaces "#KeyHistory N".

[ImageSearch](lib/ImageSearch.md) returns 1 (true) if the image was found, 0 (false) if it was not found, or throws an exception if the search could not be conducted. ErrorLevel is not set.

[IniDelete](lib/IniDelete.md), [IniRead](lib/IniRead.md) and [IniWrite](lib/IniWrite.md) set [A_LastError](Variables.md#LastError) to the result of the operating system's GetLastError() function.

[IniRead](lib/IniRead.md) throws an exception if the requested key, section or file cannot be found and the *Default* parameter was omitted. If *Default* is given a value, even `""`, no exception is thrown.

[InputHook](lib/InputHook.md) now treats `Shift`+`Backspace` the same as `Backspace`, instead of transcribing it to `` `b ``.

[InputBox](lib/InputBox.md) has been given a syntax overhaul to make it easier to use (with fewer parameters). See [InputBox](#inputbox) for usage.

[InStr](lib/InStr.md)'s *CaseSensitive* parameter has been replaced with *CaseSense*, which can be 0, 1 or "Locale".

InStr now searches right-to-left when *Occurrence* is negative (which previously caused a result of 0), and no longer searches right-to-left if a negative *StartingPos* is used with a positive *Occurrence*. (However, it still searches right-to-left if *StartingPos* is negative and *Occurrence* is omitted.) This facilitates right-to-left searches in a loop, and allows a negative *StartingPos* to be used while still searching left-to-right.

- For example, `InStr(a, b,, -1, 2)` now searches left-to-right. To instead search right-to-left, use `InStr(a, b,, -1, -2)`.
- Note that a *StartingPos* of -1 means the last character in v2, but the second last character in v1. If the example above came from v1 (rather than v2.0-a033 - v2.0-a136), the new code should be `InStr(a, b, -2, -2)`.

[KeyWait](lib/KeyWait.md) now returns 0 (false) if the wait period expires, otherwise 1 (true). ErrorLevel was removed.

[MouseClick](lib/MouseClick.md) and [MouseClickDrag](lib/MouseClickDrag.md) are no longer affected by the system setting for swapped mouse buttons; "Left" is the always the primary button and "Right" is the secondary.

[MsgBox](lib/MsgBox.md) has had its syntax changed to prioritise its most commonly used parameters and improve ease of use. See [MsgBox](#msgbox) further below for a summary of usage.

[NumPut](lib/NumPut.md)/[NumGet](lib/NumGet.md): When a variable is passed directly, the address of the variable's internal string buffer is no longer used. Therefore, a variable containing an address may be passed directly (whereas in v1, something like `var+0` was necessary). For buffers allocated by the script, the new [Buffer object](lib/Buffer.md) is preferred over a variable; any object can be used, but must have *Ptr* and *Size* properties.

NumPut's parameters were reordered to allow a sequence of values, with the (now mandatory) type string preceding each number. For example: `NumPut("ptr", a, "int", b, "int", c, addrOrBuffer, offset)`. Type is now mandatory for NumGet as well. (In comparison to [DllCall](lib/DllCall.md), NumPut's input parameters correspond to the dll function's parameters, while NumGet's return type parameter corresponds to the dll function's return type string.)

The use of `Object(obj)` and `Object(ptr)` to convert between a reference and a pointer was shifted to separate functions, `ObjPtrAddRef(obj)` and `ObjFromPtrAddRef(ptr)`. There are also versions of these functions that do not increment the reference count: `ObjPtr(obj)` and `ObjFromPtr(ptr)`.

The OnClipboardChange label is no longer called automatically if it exists. Use the [OnClipboardChange](lib/OnClipboardChange.md) function which was added in v1.1.20 instead. It now requires a function object, not a name.

[OnError](lib/OnError.md) now requires a function object, not a name. See also [Error Handling](#error-handling) further below.

The OnExit command has been removed; use the [OnExit](lib/OnExit.md) function which was added in v1.1.20 instead. It now requires a function object, not a name. A_ExitReason has also been removed; its value is available as a parameter of the OnExit callback function.

[OnMessage](lib/OnMessage.md) no longer has the single-function-per-message mode that was used when a function name (string) was passed; it now only accepts a function by reference. Use `OnMessage(x, MyFunc)` where *MyFunc* is literally the name of a function, but note that the v1 equivalent would be `OnMessage(x, Func("MyFunc"))`, which allows other functions to continue monitoring message x, unlike `OnMessage(x, "MyFunc")`. To stop monitoring the message, use `OnMessage(x, MyFunc, 0)` as `OnMessage(x, "")` and `OnMessage(x)` are now errors. On failure, OnMessage throws an exception.

[Pause](lib/Pause.md) is no longer exempt from [#MaxThreadsPerHotkey](lib/_MaxThreadsPerHotkey.md) when used on the first line of a hotkey, so `#p::Pause` is no longer suitable for toggling pause. Therefore, `Pause()` now only pauses the current thread (for combinations like ListVars/Pause), while `Pause(Value)` now always operates on the underlying thread. *Value* must be 0, 1 or -1. The second parameter was removed.

[PixelSearch](lib/PixelSearch.md) and [PixelGetColor](lib/PixelGetColor.md) use RGB values instead of BGR, for consistency with other functions. Both functions throw an exception if a problem occurs, and no longer set ErrorLevel. PixelSearch returns 1 (true) if the color was found. PixelSearch's slow mode was removed, as it is unusable on most modern systems due to an incompatibility with desktop composition.

[PostMessage](lib/PostMessage.md): See [SendMessage](#SendMessage) further below.

[Random](lib/Random.md) has been reworked to utilize the operating system's random number generator, lift several restrictions, and make it more convenient to use.

- The full 64-bit range of signed integer values is now supported (increased from 32-bit).
- Floating-point numbers are generated from a 53-bit random integer, instead of a 32-bit random integer, and should be greater than or equal to *Min* and lesser than *Max* (but floating-point rounding errors can theoretically produce equal to *Max*).
- The parameters could already be specified in any order, but now specifying only the first parameter defaults the other bound to 0 instead of 2147483647. For example, `Random(9)` returns a number between 0 and 9.
- If both parameters are omitted, the return value is a floating-point number between 0.0 (inclusive) and 1.0 (generally exclusive), instead of an integer between 0 and 2147483647 (inclusive).
- The system automatically seeds the random number generator, and does not provide a way to manually seed it, so there is no replacement for the *NewSeed* parameter.

[RegExMatch](lib/RegExMatch.md) options O and P were removed; O (object) mode is now mandatory. The RegExMatch object now supports enumeration (for-loop). The match object's syntax has changed:

- \__Get is used to implement the shorthand `match.subpat` where *subpat* is the name of a subpattern/capturing group. As \__Get is no longer called if a property is *inherited*, the following subpattern names can no longer be used with the shorthand syntax: Pos, Len, Name, Count, Mark. (For example, `match.Len` always returns the length of the overall match, not a captured string.)
- Originally the match object had methods instead of properties so that properties could be reserved for subpattern names. As new language behavior implies that `match.name` would return a function by default, the methods have been replaced or supplemented with properties:
    - Pos, Len and Name are now properties and methods.
    - Name now requires one parameter to avoid confusion (`match.Name` throws an error).
    - Count and Mark are now only properties.
    - Value has been removed; use `match.0` or `match[]` instead of `match.Value()`, and `match[N]` instead of `match.Value(N)`.

RegisterCallback was renamed to [CallbackCreate](lib/CallbackCreate.md) and changed to better utilize [closures](Functions.md#closures):

- It now supports [function objects](misc/Functor.md) (and no longer supports function names).
- Removed *EventInfo* parameter (use a [closure](Functions.md#closures) or [bound function](misc/Functor.md#BoundFunc) instead).
- Removed the special behavior of variadic callback functions and added the `&` option (pass the address of the parameter list).
- Added `CallbackFree(Address)`, to free the callback memory and release the associated function object.

Registry functions ([RegRead](lib/RegRead.md), [RegWrite](lib/RegWrite.md), [RegDelete](lib/RegDelete.md)): the new syntax added in v1.1.21+ is now the only syntax. Root key and subkey are combined. Instead of `RootKey, SubKey`, write `RootKey\SubKey`. To connect to a remote registry, use `\\ComputerName\RootKey\SubKey` instead of `\\ComputerName:RootKey, SubKey`.

RegWrite's parameters were reordered to put *Value* first, like IniWrite (but this doesn't affect the single-parameter mode, where *Value* was the only parameter).

When *KeyName* is omitted and the current loop reg item is a subkey, RegDelete, RegRead and RegWrite now operate on values within that subkey; i.e. *KeyName* defaults to `A_LoopRegKey "\" A_LoopRegName` in that case (note that A_LoopRegKey was merged with A_LoopRegSubKey). Previously they behaved as follows:

- RegRead read a value with the same name as the subkey, if one existed in the parent key.
- RegWrite returned an error.
- RegDelete deleted the subkey.

RegDelete, RegRead and RegWrite now allow *ValueName* to be specified when *KeyName* is omitted:

- If the current loop reg item is a subkey, *ValueName* defaults to empty (the subkey's default value) and *ValueType* must be specified.
- If the current loop reg item is a value, *ValueName* and *ValueType* default to that value's name and type, but one or both can be overridden.

Otherwise, RegDelete with a blank or omitted *ValueName* now deletes the key's default value (not the key itself), for consistency with RegWrite, RegRead and A_LoopRegName. The phrase "AHK_DEFAULT" no longer has any special meaning. To delete a key, use [RegDeleteKey](lib/RegDeleteKey.md) (new).

[RegRead](lib/RegRead.md) now has a *Default* parameter, like IniRead.

RegRead had an undocumented 5-parameter mode, where the value type was specified after the output variable. This has been removed.

[Reload](lib/Reload.md) now does nothing if the script was read from stdin.

[Run](lib/Run.md) and [RunWait](lib/Run.md) no longer recognize the UseErrorLevel option as ErrorLevel was removed. Use [Try](lib/Try.md)/[Catch](lib/Catch.md) instead. [A_LastError](Variables.md#LastError) is set unconditionally, and can be inspected after an exception is caught/suppressed. RunWait returns the exit code.

[Send](lib/Send.md) (and its variants) now interpret `{LButton}` and `{RButton}` in a way consistent with hotkeys and [Click](lib/Click.md). That is, LButton is the primary button and RButton is the secondary button, even if the user has swapped the buttons via system settings.

<a id="SendMessage"></a>

[SendMessage](lib/SendMessage.md) and [PostMessage](lib/PostMessage.md) now require wParam and lParam to be integers or objects with a Ptr property; an exception is thrown if they are given a non-numeric string or float. Previously a string was passed by address if the expression began with `"`, but other strings were coerced to integers. Passing the address of a variable (formerly `&var`, now `StrPtr(var)`) no longer updates the variable's length (use `VarSetStrCapacity(&var, -1)`).

SendMessage and PostMessage now throw an exception on failure (or timeout) and do not set ErrorLevel. SendMessage returns the message reply.

[SetTimer](lib/SetTimer.md) no longer supports label or function names, but as it now accepts an expression and functions can be referenced directly by name, usage looks very similar: `SetTimer MyFunc`. As with all other functions which accept an object, SetTimer now allows expressions which return an object (previously it required a variable reference).

[Sort](lib/Sort.md) has received the following changes:

- The *VarName* parameter has been split into separate input/output parameters, for flexibility. Usage is now `Output := Sort(Input [, Options, Callback])`.
- When any two items compare equal, the original order of the items is now automatically used as a tie-breaker to ensure more stable results.
- The `C` option now also accepts a suffix equivalent to the *CaseSense* parameter of other functions (in addition to `CL`): `CLocale CLogical COn C1 COff C0`. In particular, support for the "logical" comparison mode is new.

<a id="Sound"></a>

[Sound functions](lib/Sound.md): SoundGet and SoundSet have been revised to better match the capabilities of the Vista+ sound APIs, dropping support for XP.

- Removed unsupported control types.
- Removed legacy mixer component types.
- Let components be referenced by name and/or index.
- Let devices be referenced by name-prefix and/or index.
- Split into separate Volume and Mute functions.
- Added [SoundGetName](lib/SoundGetName.md) for retrieving device or component names.
- Added [SoundGetInterface](lib/SoundGetInterface.md) for retrieving COM interfaces.

[StrGet](lib/StrGet.md): If *Length* is negative, its absolute value indicates the exact number of characters to convert, including any binary zeros that the string might contain - in other words, the result is always a string of exactly that length. If *Length* is positive, the converted string ends at the first binary zero as in v1.

[StrGet](lib/StrGet.md)/[StrPut](lib/StrPut.md): The *Address* parameter can be an object with the *Ptr* and *Size* properties, such as the new [Buffer object](lib/Buffer.md). The read/write is automatically limited by *Size* (which is in bytes). If *Length* is also specified, it must not exceed *Size* (multiplied by 2 for UTF-16).

StrPut's return value is now in bytes, so it can be passed directly to `Buffer()`.

[StrReplace](lib/StrReplace.md) now has a *CaseSense* parameter in place of *OutputVarCount*, which is moved one parameter to the right, with *Limit* following it.

[Suspend](lib/Suspend.md): Making a hotkey or hotstring's first line a call to Suspend no longer automatically makes it exempt from suspension. Instead, use `#SuspendExempt` or the `S` option. The "Permit" parameter value is no longer valid.

[Switch](lib/Switch.md) now performs case-sensitive comparison for strings by default, and has a *CaseSense* parameter which overrides the mode of case sensitivity and forces string (rather than numeric) comparison. Previously it was case-sensitive only if StringCaseSense was changed to On.

[SysGet](lib/SysGet.md) now only has numeric sub-commands; its other sub-commands have been split into functions. See [Sub-Commands](#sub-commands) further below for details.

[TrayTip](lib/TrayTip.md)'s usage has changed to `TrayTip [Text, Title, Options]`. *Options* is a string of zero or more case-insensitive options delimited by a space or tab. The options are `Iconx`, `Icon!`, `Iconi`, `Mute` and/or any numeric value as before. TrayTip now shows even if *Text* is omitted (which is now harder to do by accident than in v1). The *Timeout* parameter no long exists (it had no effect on Windows Vista or later). Scripts may now use the NIIF_USER (0x4) and NIIF_LARGE_ICON (0x20) flags in combination (0x24) to include the large version of the tray icon in the notification. NIIF_USER (0x4) can also be used on its own for the small icon, but may not have consistent results across all OSes.

#Warn UseUnsetLocal and UseUnsetGlobal have been removed, as reading an unset variable now raises an error. [IsSet](lib/IsSet.md) can be used to avoid the error and [Try](lib/Try.md)/[Catch](lib/Catch.md) or [OnError](lib/OnError.md) can be used to handle it.

[#Warn VarUnset](lib/_Warn.md#VarUnset) was added; it defaults to MsgBox. If not disabled, a warning is given for the first non-dynamic reference to each variable which is never used as the target of a direct, non-dynamic assignment or the reference operator (&), or passed directly to IsSet.

[#Warn Unreachable](lib/_Warn.md#Unreachable) no longer considers lines following an [Exit](lib/Exit.md) call to be unreachable, as Exit is now an ordinary function.

#Warn ClassOverwrite has been removed, as top-level classes can no longer be overwritten by assignment. (However, they can now be implicitly shadowed by a local variable; that can be detected by #Warn LocalSameAsGlobal.)

[WinActivate](lib/WinActivate.md) now sends `{Alt up}` after its first failed attempt at activating a window. Testing has shown this reduces the occurrence of flashing taskbar buttons. See the documentation for more details.

[WinClose](lib/WinClose.md) and [WinKill](lib/WinKill.md): For *SecondsToWait*, specifying 0 is no longer the same as specifying 0.5; instead, it produces the shortest wait possible.

[WinSetTitle](lib/WinSetTitle.md) and [WinMove](lib/WinMove.md) now use parameter order consistent with other Win functions; i.e. *WinTitle, WinText, ExcludeTitle, ExcludeText* are always grouped together (at the end of the parameter list), to aide memorisation.

The *WinTitle* parameter of various functions can now accept a HWND (must be a pure integer) or an object with a *Hwnd* property, such as a [Gui object](lib/Gui.md). [DetectHiddenWindows](lib/DetectHiddenWindows.md) is ignored in such cases, except when used with [WinWait](lib/WinWait.md) or [WinWaitClose](lib/WinWaitClose.md).

[WinMove](lib/WinMove.md) no longer has special handling for the literal word `DEFAULT`. Omit the parameter or specify an empty string instead (this works in both v1 and v2).

[WinWait](lib/WinWait.md), [WinWaitClose](lib/WinWaitClose.md), [WinWaitActive](lib/WinWaitActive.md) and [WinWaitNotActive](lib/WinWaitActive.md) return non-zero if the wait finished (timeout did not expire). ErrorLevel was removed. WinWait and WinWaitActive return the HWND of the found window. WinWaitClose now sets the [Last Found Window](misc/WinTitle.md#LastFoundWindow), so if WinWaitClose times out, it returns 0 (false) and `WinExist()` returns the last window it found. For *Timeout*, specifying 0 is no longer the same as specifying 0.5; instead, it produces the shortest wait possible.

**Unsorted:**

A negative *StartingPos* for [InStr](lib/InStr.md), [SubStr](lib/SubStr.md), [RegExMatch](lib/RegExMatch.md) and [RegExReplace](lib/RegExReplace.md) is interpreted as a position from the end. Position -1 is the last character and position 0 is invalid (whereas in v1, position 0 was the last character).

Functions which previously accepted On/Off or On/Off/Toggle (but not other strings) now require 1/0/-1 instead. On and Off would typically be replaced with `True` and `False`. Variables which returned On/Off now return 1/0, which are more useful in expressions.

- [#UseHook](lib/_UseHook.md) and [#MaxThreadsBuffer](lib/_MaxThreadsBuffer.md) allow `1`, `0`, `True` and `False`. (Unlike the others, they do not actually support expressions.)
- [ListLines](lib/ListLines.md) allows omitted or boolean.
- [ControlSetChecked](lib/ControlSetChecked.md), [ControlSetEnabled](lib/ControlSetEnabled.md), [Pause](lib/Pause.md), [Suspend](lib/Suspend.md), [WinSetAlwaysOnTop](lib/WinSetAlwaysOnTop.md), and [WinSetEnabled](lib/WinSetEnabled.md) allow `1`, `0` and `-1`.
- [A_DetectHiddenWindows](Variables.md#DetectHiddenWindows), [A_DetectHiddenText](Variables.md#DetectHiddenText), and [A_StoreCapsLockMode](Variables.md#StoreCapsLockMode) use boolean (as do the corresponding functions).

The following functions return a pure integer instead of a hexadecimal string:

- [ControlGetExStyle](lib/ControlGetStyle.md)
- [ControlGetHwnd](lib/ControlGetHwnd.md)
- [ControlGetStyle](lib/ControlGetStyle.md)
- [MouseGetPos](lib/MouseGetPos.md)
- [WinActive](lib/WinActive.md)
- [WinExist](lib/WinExist.md)
- [WinGetID](lib/WinGetID.md)
- [WinGetIDLast](lib/WinGetIDLast.md)
- [WinGetList](lib/WinGetList.md) (within the Array)
- [WinGetStyle](lib/WinGetStyle.md)
- [WinGetStyleEx](lib/WinGetStyle.md)
- [WinGetControlsHwnd](lib/WinGetControlsHwnd.md) (within the Array)

[A_ScriptHwnd](Variables.md#ScriptHwnd) also returns a pure integer.

#### DllCall

If a type parameter is a variable, that variable's content is always used, never its name. In other words, unquoted type names are no longer supported - type names must be enclosed in quote marks.

When DllCall updates the length of a variable passed as Str or WStr, it now detects if the string was not properly null-terminated (likely indicating that buffer overrun has occurred), and terminates the program with an error message if so, as safe execution cannot be guaranteed.

`AStr` (without any suffix) is now input-only. Since the buffer is only ever as large as the input string, it was usually not useful for output parameters. This would apply to WStr instead of AStr if AutoHotkey is compiled for ANSI, but official v2 releases are only ever compiled for Unicode.

If a function writes a new address to a `Str*`, `AStr*` or `WStr*` parameter, DllCall now assigns the new string to the corresponding variable if one was supplied, instead of merely updating the length of the original string (which probably hasn't changed). Parameters of this type are usually not used to modify the input string, but rather to pass back a string at a new address.

DllCall now accepts an object for any `Ptr` parameter and the *Function* parameter; the object must have a *Ptr* property. For buffers allocated by the script, the new [Buffer object](lib/Buffer.md) is preferred over a variable. For `Ptr*`, the parameter's new value is assigned back to the object's *Ptr* property. This allows constructs such as `DllCall(..., "Ptr*", unk := IUnknown())`, which reduces repetition compared to `DllCall(..., "Ptr*", punk), unk := IUnknown(punk)`, and can be used to ensure any output from the function is properly freed (even if an exception is thrown due to the `HRESULT` return type, although typically the function would not output a non-null pointer in that case).

DllCall now requires the values of numeric-type parameters to be numeric, and will throw an exception if given a non-numeric or empty string. In particular, if the \* or P suffix is used for output parameters, the output variable is required to be initialized.

The output value (if any) of numeric parameters with the \* or P suffix is ignored if the script passes a plain variable containing a number. To receive the output value, pass a [VarRef](Concepts.md#variable-references) such as `&myVar` or an object with a *Ptr* property.

The new `HRESULT` return type throws an exception if the function failed (`int < 0` or `uint & 0x80000000`). This should be used only with functions that actually return a `HRESULT`.

#### Loop Sub-commands

The sub-command keyword must be written literally; it must not be enclosed in quote marks and cannot be a variable or expression. All other parameters are expressions. All loop sub-commands now support [OTB](lib/Block.md#otb).

Removed:

```
Loop, FilePattern [, IncludeFolders, Recurse]
Loop, RootKey [, Key, IncludeSubkeys, Recurse]
```

Use the following (added in v1.1.21) instead:

```ahk
Loop Files, FilePattern [, Mode]
Loop Reg, KeyName [, Mode]
```

The comma after the second word is now optional.

[A_LoopRegKey](lib/LoopReg.md#vars) now contains the root key and subkey, and A_LoopRegSubKey was removed.

#### InputBox

```ahk
InputBoxObj := InputBox([Prompt, Title, Options, Default])
```

The *Options* parameter accepts a string of zero or more case-insensitive options delimited by a space or tab, similar to Gui control options. For example, this includes all supported options: `"x0 y0 w100 h100 T10.0 Password*"`. `T` is timeout and `Password` has the same usage as the equivalent Edit control option.

The width and height options now set the size of the client area (the area excluding the title bar and window frame), so are less theme-dependent.

The title will be blank if the *Title* parameter is an empty string. It defaults to [A_ScriptName](Variables.md#ScriptName) only when completely omitted, consistent with optional parameters of user-defined functions.

*InputBoxObj* is an object with the properties *Result* (containing "OK", "Cancel" or "Timeout") and *Value*.

#### MsgBox

```ahk
Result := MsgBox([Text, Title, Options])
```

The *Options* parameter accepts a string of zero or more case-insensitive options delimited by a space or tab, similar to Gui control options.

- `Iconx`, `Icon?`, `Icon!` and `Iconi` set the icon.
- `Default` followed immediately by an integer sets the *n*th button as default.
- `T` followed immediately by an integer or floating-point number sets the timeout, in seconds.
- `Owner` followed immediately by a HWND sets the owner, overriding the Gui `+OwnDialogs` option.
- One of the following mutually-exclusive strings sets the button choices: `OK`, `OKCancel`, `AbortRetryIgnore`, `YesNoCancel`, `YesNo`, `RetryCancel`, `CancelTryAgainContinue`, or just the initials separated by slashes (`o/c`, `y/n`, etc.), or just the initials without slashes.
- Any numeric value, the same as in v1. Numeric values can be combined with string options, or *Options* can be a pure integer.

The return value is the English name of the button, without spaces. These are the same strings that were used with IfMsgBox in v1.

The title will be blank if the *Title* parameter is an empty string. It defaults to [A_ScriptName](Variables.md#ScriptName) only when completely omitted, consistent with optional parameters of user-defined functions.

#### Sub-Commands

Sub-commands of Control, ControlGet, Drive, DriveGet, WinGet, WinSet and Process have been replaced with individual functions, and the main commands have been removed. Names and usage have been changed for several of the functions. The new usage is shown below:

```ahk
; Where ... means optional ControlID, WinTitle, etc.

Bool  := ControlGetChecked(...)
Bool  := ControlGetEnabled(...)
Bool  := ControlGetVisible(...)
Int   := ControlGetIndex(...)  ; For Tab, LB, CB, DDL
Str   := ControlGetChoice(...)
Arr   := ControlGetItems(...)
Int   := ControlGetStyle(...)
Int   := ControlGetExStyle(...)
Int   := ControlGetHwnd(...)

         ControlSetChecked(TrueFalseToggle, ...)
         ControlSetEnabled(TrueFalseToggle, ...)
         ControlShow(...)
         ControlHide(...)
         ControlSetStyle(Value, ...)
         ControlSetExStyle(Value, ...)
         ControlShowDropDown(...)
         ControlHideDropDown(...)
         ControlChooseIndex(Index, ...)  ; Also covers Tab
Index := ControlChooseString(Str, ...)

Index := ControlFindItem(Str, ...)
Index := ControlAddItem(Str, ...)
         ControlDeleteItem(Index, ...)

Int   := EditGetLineCount(...)
Int   := EditGetCurrentLine(...)
Int   := EditGetCurrentCol(...)
Str   := EditGetLine(N [, ...])
Str   := EditGetSelectedText(...)
         EditPaste(Str, ...)

Str   := ListViewGetContent([Options, ...])

         DriveEject([Drive])
         DriveRetract([Drive])
         DriveLock(Drive)
         DriveUnlock(Drive)
         DriveSetLabel(Drive [, Label])

Str   := DriveGetList([Type])
Str   := DriveGetFilesystem(Drive)
Str   := DriveGetLabel(Drive)
Str   := DriveGetSerial(Drive)
Str   := DriveGetType(Path)
Str   := DriveGetStatus(Path)
Str   := DriveGetStatusCD(Drive)
Int   := DriveGetCapacity(Path)
Int   := DriveGetSpaceFree(Path)

; Where ... means optional WinTitle, etc.

Int   := WinGetID(...)
Int   := WinGetIDLast(...)
Int   := WinGetPID(...)
Str   := WinGetProcessName(...)
Str   := WinGetProcessPath(...)
Int   := WinGetCount(...)
Arr   := WinGetList(...)
Int   := WinGetMinMax(...)
Arr   := WinGetControls(...)
Arr   := WinGetControlsHwnd(...)
Int   := WinGetTransparent(...)
Str   := WinGetTransColor(...)
Int   := WinGetStyle(...)
Int   := WinGetExStyle(...)

         WinSetTransparent(N [, ...])
         WinSetTransColor("Color [N]" [, ...]),
         WinSetAlwaysOnTop([TrueFalseToggle := 1, ...])
         WinSetStyle(Value [, ...])
         WinSetExStyle(Value [, ...])
         WinSetEnabled(Value [, ...])
         WinSetRegion(Value [, ...])

         WinRedraw(...)
         WinMoveBottom(...)
         WinMoveTop(...)

PID   := ProcessExist([PID_or_Name])
PID   := ProcessClose(PID_or_Name)
PID   := ProcessWait(PID_or_Name [, Timeout])
PID   := ProcessWaitClose(PID_or_Name [, Timeout])

         ProcessSetPriority(Priority [, PID_or_Name])
```

[ProcessExist](lib/ProcessExist.md), [ProcessClose](lib/ProcessClose.md), [ProcessWait](lib/ProcessWait.md) and [ProcessWaitClose](lib/ProcessWaitClose.md) no longer set ErrorLevel; instead, they return the PID.

None of the other functions set ErrorLevel. Instead, they throw an exception on failure. In most cases failure is because the target window or control was not found.

HWNDs and styles are always returned as pure integers, not hexadecimal strings.

[ControlChooseIndex](lib/ControlChooseIndex.md) allows 0 to deselect the current item/all items. It replaces "Control Choose" and "Control TabLeft/TabRight", so it also supports Tab controls.

[ControlFindItem](lib/ControlFindItem.md) replaces "ControlGet FindString".

[ControlGetIndex](lib/ControlGetIndex.md) replaces "ControlGet Tab" and also works with ListBox, ComboBox, and DDL. For Tab controls, it returns 0 if no tab is selected (rare but valid). ControlChooseIndex does not permit 0 for Tab controls since applications tend not to handle it.

[ControlGetItems](lib/ControlGetItems.md) replaces "ControlGet List" for ListBox and ComboBox. It returns an Array.

[DriveEject](lib/DriveEject.md) and [DriveRetract](lib/DriveEject.md) now use DeviceIoControl instead of mciSendString. DriveEject is therefore able to eject non-CD/DVD drives which have an "Eject" option in Explorer (i.e. removable drives but not external hard drives which show as fixed disks).

[ListViewGetContent](lib/ListViewGetContent.md) replaces "ControlGet List" for ListView, and currently has the same usage as before.

[WinGetList](lib/WinGetList.md), [WinGetControls](lib/WinGetControls.md) and [WinGetControlsHwnd](lib/WinGetControlsHwnd.md) return arrays, not newline-delimited lists.

[WinSetTransparent](lib/WinSetTransparent.md) treats `""` as `"Off"` rather than `0` (which would make the window invisible and unclickable).

Abbreviated aliases such as Topmost, Trans, FS and Cap were removed.

The following functions were formerly sub-commands of [SysGet](lib/SysGet.md):

```ahk
ActualN := MonitorGet([N, &Left, &Top, &Right, &Bottom])
ActualN := MonitorGetWorkArea([N, &Left, &Top, &Right, &Bottom])
Count   := MonitorGetCount()
Primary := MonitorGetPrimary()
Name    := MonitorGetName([N])
```

### New Functions

`Buffer([ByteCount, FillByte])` (calling the Buffer class) creates and returns a `Buffer` object encapsulating a block of memory with a size of *ByteCount* bytes, initialized only if *FillByte* is specified. `BufferObj.Ptr` returns the address and `BufferObj.Size` returns or sets the size in bytes (reallocating the block of memory). Any object with *Ptr* and *Size* properties can be passed to [NumPut](lib/NumPut.md), [NumGet](lib/NumGet.md), [StrPut](lib/StrPut.md), [StrGet](lib/StrGet.md), [File.RawRead](lib/File.md#RawRead), [File.RawWrite](lib/File.md#RawWrite) and [FileAppend](lib/FileAppend.md). Any object with a *Ptr* property can be passed to [DllCall](lib/DllCall.md) parameters with `Ptr` type, [SendMessage](lib/SendMessage.md) and [PostMessage](lib/PostMessage.md).

`CaretGetPos([&OutputVarX, &OutputVarY])` retrieves the current coordinates of the caret (text insertion point). This ensures the X and Y coordinates always match up, and there is no caching to cause unexpected behavior (such as A_CaretX/Y returning a value that's not in the current CoordMode).

`ClipboardAll([Data, Size])` creates an object containing everything on the clipboard (optionally accepting data previously retrieved from the clipboard instead of using the clipboard's current contents). The methods of reading and writing clipboard file data are different. The data format is the same, except that the data size is always 32-bit, so that the data is portable between 32-bit and 64-bit builds. See the v2 documentation for details.

`ComCall(offset, comobj, ...)` is equivalent to `DllCall(NumGet(NumGet(comobj.ptr) + offset * A_Index), "ptr", comobj.ptr, ...)`, but with the return type defaulting to `HRESULT` rather than `Int`.

[ComObject](lib/ComObject.md) (formerly ComObjCreate) and [ComObjQuery](lib/ComObjQuery.md) now return a wrapper object even if an IID is specified. ComObjQuery permits the first parameter to be any object with a *Ptr* property.

[ControlGetClassNN](lib/ControlGetClassNN.md) returns the ClassNN of the specified control.

[ControlSendText](lib/ControlSend.md), equivalent to ControlSendRaw but using Text mode instead of Raw mode.

`DirExist(FilePattern)`, with usage similar to FileExist. Note that a wildcard check like `InStr(FileExist("MyFolder\*"), "D")` with *MyFolder* containing files and subfolders will only tell you whether the <u>first</u> matching file is a folder, not whether a folder exists.

`Float(Value)`: See [Types](#types) further above.

`InstallKeybdHook([Install, Force])` and `InstallMouseHook([Install, Force])` replace the corresponding directives, for increased flexibility.

`Integer(Value)`: See [Types](#types) further above.

<a id="isXXX"></a>

[IsXXX](lib/Is.md): The legacy command "if Var is Type" has been replaced with a series of functions: IsAlnum, IsAlpha, IsDigit, IsFloat, IsInteger, IsLower, IsNumber, IsSpace, IsUpper, IsXDigit. With the exception of IsFloat, IsInteger and IsNumber, an exception is thrown if the parameter is not a string, as implicit conversion to string may cause counter-intuitive results.

`IsSet(Var)`, `IsSetRef(&Ref)`: Returns 1 (true) if the variable has been assigned a value (even if that value is an empty string), otherwise 0 (false). If 0 (false), attempting to read the variable within an expression would throw an error.

`Menu()`/`MenuBar()` returns a new Menu/MenuBar object, which has the following members corresponding to v1 Menu sub-commands. Methods: [Add](lib/Menu.md#Add), [**Add**Standard](lib/Menu.md#AddStandard), [Check](lib/Menu.md#Check), [Delete](lib/Menu.md#Delete), [Disable](lib/Menu.md#Disable), [Enable](lib/Menu.md#Enable), [Insert](lib/Menu.md#Insert), [Rename](lib/Menu.md#Rename), [**Set**Color](lib/Menu.md#SetColor), [**Set**Icon](lib/Menu.md#SetIcon), [Show](lib/Menu.md#Show), [ToggleCheck](lib/Menu.md#ToggleCheck), [ToggleEnable](lib/Menu.md#ToggleEnable), [Uncheck](lib/Menu.md#Uncheck). Properties: [Click**Count**](lib/Menu.md#ClickCount), [Default](lib/Menu.md#Default), [Handle](lib/Menu.md#Handle) (replaces MenuGetHandle). [A_TrayMenu](Variables.md#TrayMenu) also returns a Menu object. There is no UseErrorLevel mode, no global menu names, and no explicitly deleting the menu itself (that happens when all references are released; the [Delete](lib/Menu.md#Delete) method is equivalent to v1 DeleteAll). Labels are not supported, only function objects. The [AddStandard](lib/Menu.md#AddStandard) method adds the standard menu items and allows them to be individually modified as with custom items. Unlike v1, the Win32 menu is destroyed only when the object is deleted.

`MenuFromHandle(Handle)` retrieves the Menu or MenuBar object corresponding to a Win32 menu handle, if it was created by AutoHotkey.

`Number(Value)`: See [Types](#types) further above.

`Persistent([Persist])` replaces the corresponding directive, increasing flexibility.

`RegDeleteKey([KeyName])` deletes a registry key. (RegDelete now only deletes values, except when omitting all parameters in a registry loop.)

[SendText](lib/Send.md#SendText), equivalent to SendRaw but using Text mode instead of Raw mode.

`StrCompare(String1, String2 [, CaseSense])` returns -1 (String1 is less than String2), 0 (equal) or 1 (greater than). *CaseSense* can be "Locale".

`String(Value)`: See [Types](#types) further above.

`StrPtr(Value)` returns the address of a string. Unlike address-of in v1, it can be used with literal strings and temporary strings.

`SysGetIPAddresses()` returns an array of IP addresses, equivalent to the A_IPAddress variables which have been removed. Each reference to `A_IPAddress%N%` retrieved all addresses but returned only one, so retrieving multiple addresses took exponentially longer than necessary. The returned array can have zero or more elements.

`TraySetIcon([FileName, IconNumber, Freeze])` replaces "Menu Tray, Icon".

`VarSetStrCapacity(&TargetVar [, RequestedCapacity])` replaces the v1 VarSetCapacity, but is intended for use only with UTF-16 strings (such as to optimize repeated concatenation); therefore *RequestedCapacity* and the return value are in characters, not bytes.

`VerCompare(A, B)` compares two version strings using the same algorithm as [#Requires](lib/_Requires.md).

`WinGetClientPos([&OutX, &OutY, &OutWidth, &OutHeight, WinTitle, ...])` retrieves the position and size of the window's client area, in screen coordinates.

### New Directives

`#DllLoad [FileOrDirName]`: Loads a DLL or EXE file before the script starts executing.

### Built-in Variables

[A_AhkPath](Variables.md#AhkPath) always returns the path of the current executable/interpreter, even when the script is compiled. Previously it returned the path of the compiled script if a BIN file was used as the base file, but v2.0 releases no longer include BIN files.

[A_IsCompiled](Variables.md#IsCompiled) returns 0 instead of "" if the script has not been compiled.

[A_OSVersion](Variables.md#OSVersion) always returns a string in the format `major.minor.build`, such as `6.1.7601` for Windows 7 SP1. A_OSType has been removed as only NT-based systems are supported.

[A_TimeSincePriorHotkey](Variables.md#TimeSincePriorHotkey) returns "" instead of -1 whenever [A_PriorHotkey](Variables.md#PriorHotkey) is "", and likewise for [A_TimeSinceThisHotkey](Variables.md#TimeSinceThisHotkey) when [A_ThisHotkey](Variables.md#ThisHotkey) is blank.

All built-in "virtual" variables now have the `A_` prefix (specifics below). Any predefined variables which lack this prefix (such as `Object`) are just global variables. The distinction may be important since it is currently impossible to take a reference to a virtual variable (except when passed directly to a built-in function); however, [A_Args](Variables.md#Args) is not a virtual variable.

Built-in variables which return numbers now return them as an [integer](Concepts.md#numbers) rather than a [string](Concepts.md#strings).

Renamed:

- A_LoopFileFullPath → [A_LoopFilePath](lib/LoopFiles.md#LoopFilePath) (returns a relative path if the Loop's parameter was relative, so "full path" was misleading)
- A_LoopFileLongPath → [A_LoopFileFullPath](lib/LoopFiles.md#LoopFileFullPath)
- Clipboard → [A_Clipboard](lib/A_Clipboard.md)

Removed:

- ClipboardAll (replaced with the [ClipboardAll](lib/ClipboardAll.md) function)
- ComSpec (use [A_ComSpec](Variables.md#ComSpec))
- ProgramFiles (use [A_ProgramFiles](Variables.md#ProgramFiles))
- A_AutoTrim
- A_BatchLines
- A_CaretX, A_CaretY (use [CaretGetPos](lib/CaretGetPos.md))
- A_DefaultGui, A_DefaultListView, A_DefaultTreeView
- A_ExitReason
- A_FormatFloat
- A_FormatInteger
- A_Gui, A_GuiControl, A_GuiControlEvent, A_GuiEvent, A_GuiX, A_GuiY, A_GuiWidth, A_GuiHeight (all replaced with parameters of [event handlers](lib/GuiOnEvent.md))
- A_IPAddress1, A_IPAddress2, A_IPAddress3, A_IPAddress4 (use [SysGetIPAddresses](lib/SysGetIPAddresses.md))
- A_IsUnicode (v2 is always Unicode; it can be replaced with `StrLen(Chr(0xFFFF))` or redefined with `global A_IsUnicode := 1`)
- A_StringCaseSense
- A_ThisLabel
- A_ThisMenu, A_ThisMenuItem, A_ThisMenuItemPos (use the [menu item callback's parameters](lib/Menu.md#Add))
- A_LoopRegSubKey ([A_LoopRegKey](lib/LoopReg.md#vars) now contains the root key and subkey)
- True and False (still exist, but are now only keywords, not variables)

Added:

- [A_AllowMainWindow](Variables.md#AllowMainWindow) (read/write; replaces "Menu Tray, MainWindow/NoMainWindow")
- [A_HotkeyInterval](Variables.md#HotkeyInterval) (replaces #HotkeyInterval)
- [A_HotkeyModifierTimeout](Variables.md#HotkeyModifierTimeout) (replaces #HotkeyModifierTimeout)
- [A_InitialWorkingDir](Variables.md#InitialWorkingDir) (see [Default Settings](#default-settings) further below)
- [A_MaxHotkeysPerInterval](Variables.md#MaxHotkeysPerInterval) (replaces #MaxHotkeysPerInterval)
- [A_MenuMaskKey](Variables.md#MenuMaskKey) (replaces #MenuMaskKey)

The following built-in variables can be assigned values:

- [A_ControlDelay](Variables.md#ControlDelay)
- [A_CoordMode..](Variables.md#CoordMode)
- [A_DefaultMouseSpeed](Variables.md#DefaultMouseSpeed)
- [A_DetectHiddenText](Variables.md#DetectHiddenText) (also, it now returns 1 or 0 instead of "On" or "Off")
- [A_DetectHiddenWindows](Variables.md#DetectHiddenWindows) (also, it now returns 1 or 0 instead of "On" or "Off")
- [A_EventInfo](Variables.md#EventInfo)
- [A_FileEncoding](Variables.md#FileEncoding) (also, it now returns "CP0" in place of "", and allows the "CP" prefix to be omitted when assigning)
- [A_IconHidden](Variables.md#IconHidden)
- [A_IconTip](Variables.md#IconTip) (also, it now always reflects the tooltip, even if it is default or empty)
- [A_Index](Variables.md#Index): For counted loops, modifying this affects how many iterations are performed. (The global nature of built-in variables means that an Enumerator function could set the index to be seen by a For loop.)
- [A_KeyDelay](Variables.md#KeyDelay)
- [A_KeyDelayPlay](Variables.md#KeyDelayPlay)
- [A_KeyDuration](Variables.md#KeyDelay)
- [A_KeyDurationPlay](Variables.md#KeyDelayPlay)
- [A_LastError](Variables.md#LastError): Calls the Win32 SetLastError() function. Also, it now returns an unsigned value.
- [A_ListLines](Variables.md#ListLines)
- [A_MouseDelay](Variables.md#MouseDelay)
- [A_MouseDelayPlay](Variables.md#MouseDelay)
- [A_RegView](Variables.md#RegView)
- [A_ScriptName](Variables.md#ScriptName): Changes the default dialog title.
- [A_SendLevel](Variables.md#SendLevel)
- [A_SendMode](Variables.md#SendMode)
- [A_StoreCapsLockMode](Variables.md#StoreCapsLockMode) (also, it now returns 1 or 0 instead of "On" or "Off")
- [A_TitleMatchMode](Variables.md#TitleMatchMode)
- [A_TitleMatchModeSpeed](Variables.md#TitleMatchModeSpeed)
- [A_WinDelay](Variables.md#WinDelay)
- [A_WorkingDir](Variables.md#WorkingDir): Same as calling [SetWorkingDir](lib/SetWorkingDir.md).

### Built-in Objects

[File objects](lib/File.md) now strictly require property syntax when invoking properties and method syntax when invoking methods. For example, `FileObj.Pos(n)` is not valid. An exception is thrown if there are too few or too many parameters, or if a read-only property is assigned a value.

File.Tell() was removed.

[Func.IsByRef()](lib/Func.md#IsByRef) now works with built-in functions.

## Gui

Gui, GuiControl and GuiControlGet were replaced with [Gui()](lib/Gui.md#Call) and [Gui](lib/Gui.md)/[GuiControl](lib/GuiControl.md) objects, which are generally more flexible, more consistent, and easier to use.

A GUI is typically not referenced by name/number (although it can still be named with `GuiObj.Name`). Instead, a GUI object (and window) is created explicitly by instantiating the `Gui` class, as in `GuiObj := Gui()`. This object has methods and properties which replace the Gui sub-commands. [Gui.Add()](lib/Gui.md#Add) returns a GuiControl object, which has methods and properties which replace the GuiControl and GuiControlGet commands. One can store this object in a variable, or use `GuiObj["Name"]` or [GuiCtrlFromHwnd](lib/GuiCtrlFromHwnd.md) to retrieve the object. It is also passed as a parameter whenever an event handler (the replacement of a g-label) is called.

The usage of these methods and properties is not 1:1. Many parts have been revised to be more consistent and flexible, and to fix bugs or limitations.

There are no "default" GUIs, as the target Gui or control object is always specified. LV/TV/SB functions were replaced with methods (of the control object), making it much easier to use multiple ListViews/TreeViews.

There are no built-in variables containing information about events. The information is passed as parameters to the function/method which handles the event, including the source Gui or control.

Controls can still be named and be referenced by name, but it's just a name (used with `GuiObj["Name"]` and [Gui.Submit()](lib/Gui.md#Submit)), not an associated variable, so there is no need to declare or create a global or static variable. The value is never stored in a variable automatically, but is accessible via [GuiControl.Value](lib/GuiControl.md#Value). [Gui.Submit()](lib/Gui.md#Submit) returns a new associative array using the control names as keys.

The `vName` option now just sets the control's name to *Name*.

The `+HwndVarName` option has been removed in favor of [GuiControl.Hwnd](lib/GuiControl.md#Hwnd).

There are no more "g-labels" or labels/functions which automatically handle GUI events. The script must register for each event of interest by calling the [OnEvent](lib/GuiOnEvent.md) method of the Gui or GuiControl. For example, rather than checking `if (A_GuiEvent = "I" && InStr(ErrorLevel, "F", true))` in a g-label, the script would register a handler for the [ItemFocus](lib/GuiOnEvent.md#ItemFocus) event: `MyLV.OnEvent("ItemFocus", MyFunction)`. *MyFunction* would be called only for the ItemFocus event. It is not necessary to apply the `AltSubmit` option to enable additional events.

Arrays are used wherever a pipe-delimited list was previously used, such as to specify the items for a ListBox when creating it, when adding items, or when retrieving the selected items.

Scripts can define a class which extends `Gui` and handles its own events, keeping all of the GUI logic self-contained.

### Gui sub-commands

**Gui New** → [Gui()](lib/Gui.md#Call). Passing an empty title (not omitting it) now results in an empty title, not the default title.

**Gui Add** → [Gui.Add() or Gui.Add*ControlType*()](lib/Gui.md#Add); e.g. `GuiObj.Add("Edit")` or `GuiObj.AddEdit()`.

**Gui Show** → [Gui.Show()](lib/Gui.md#Show), but it has no *Title* parameter. The title can be specified as a parameter of Gui() or via the Gui.Title property. The initial focus is still set to the first input-capable control with the WS_TABSTOP style (as per default message processing by the system), unless that's a Button control, in which case focus is now shifted to the Default button.

**Gui Submit** → [Gui.Submit()](lib/Gui.md#Submit). It works like before, except that Submit() creates and returns a new object which contains all of the "associated variables".

**Gui Destroy** → [Gui.Destroy()](lib/Gui.md#Destroy). The object still exists (until the script releases it) but cannot be used. A new GUI must be created (if needed). The window is also destroyed when the object is deleted, but the object is "kept alive" while the window is visible.

**Gui Font** → [Gui.SetFont()](lib/Gui.md#SetFont). It is also possible to set a control's font directly, with GuiControl.SetFont().

**Gui Color** → [Gui.BackColor](lib/Gui.md#BackColor) sets/returns the background color. *ControlColor* (the second parameter) is not supported, but all controls which previously supported it can have a background set by the `+Background` option instead. Unlike "Gui Color", Gui.BackColor does not affect Progress controls or disabled/read-only Edit, DDL, ComboBox or TreeView (with `-Theme`) controls.

**Gui Margin** → [Gui.MarginX](lib/Gui.md#MarginX) and [Gui.MarginY](lib/Gui.md#MarginY) properties.

**Gui Menu** → [Gui.MenuBar](lib/Gui.md#MenuBar) sets/returns a MenuBar object created with `MenuBar()`.

**Gui Cancel/Hide/Minimize/Maximize/Restore** → Gui methods of the same name.

**Gui Flash** → [Gui.Flash()](lib/Gui.md#Flash), but use `false` instead of `Off`.

**Gui Tab** → [GuiControl.UseTab()](lib/GuiControls.md#Tab_UseTab). Defaults to matching a prefix of the tab name as before. Pass true for the second parameter to match the whole tab name, but unlike the v1 "Exact" mode, it is case-insensitive.

### Events

See [Events (OnEvent)](lib/GuiOnEvent.md#Events) for details of all explicitly supported GUI and GUI control events.

The Size event passes 0, -1 or 1 (consistent with [WinGetMinMax](lib/WinGetMinMax.md)) instead of 0, 1 or 2.

The ContextMenu event can be registered for each control, or for the whole GUI.

The DropFiles event swaps the *FileArray* and *Ctrl* parameters, to be consistent with ContextMenu.

The ContextMenu and DropFiles events use client coordinates instead of window coordinates (Client is also the default [CoordMode](lib/CoordMode.md) in v2).

The following control events were removed, but detecting them is a simple case of passing the appropriate numeric notification code (defined in the Windows SDK) to [GuiControl.OnNotify()](lib/GuiOnNotify.md): K, D, d, A, S, s, M, C, E and MonthCal's 1 and 2.

Control events do not pass the event name as a parameter (GUI events never did).

Custom's N and Normal events were replaced with [GuiControl.OnNotify()](lib/GuiOnNotify.md) and [GuiControl.OnCommand()](lib/GuiOnCommand.md), which can be used with any control.

Link's Click event passes "Ctrl, ID or Index, HREF" instead of "Ctrl, Index, HREF or ID", and does not automatically execute HREF if a Click callback is registered.

ListView's Click, DoubleClick and ContextMenu (when triggered by a right-click) events now report the item which was clicked (or 0 if none) instead of the focused item.

ListView's I event was split into multiple named events, except for the f (de-focus) event, which was excluded because it is implied by F (ItemFocus).

ListView's e (ItemEdit) event is ignored if the user cancels.

Slider's Change event is raised more consistently than the v1 g-label; i.e. it no longer ignores changes made by the mouse wheel by default. See the [Change](lib/GuiOnEvent.md#Change) event for details.

The BS_NOTIFY style is now added automatically as needed for Button, CheckBox and Radio controls. It is no longer applied by default to Radio controls.

Focus (formerly F) and LoseFocus (formerly f) are supported by more (but not all) control types.

Setting an Edit control's text with Edit.Value or Edit.Text does not trigger the control's Change event, whereas GuiControl would trigger the control's g-label.

LV/TV.Add/Modify now suppress item-change events, so such events should only be raised by user action or SendMessage.

### Removed

+Delimiter<br> +Hwnd*OutputVar* (use [Gui.Hwnd](lib/Gui.md#Hwnd) or [GuiControl.Hwnd](lib/GuiControl.md#Hwnd) instead)<br> +Label<br> +LastFoundExist<br> Gui GuiName: Default

### Control Options

+/-Background is interpreted and supported more consistently. All controls which supported "Gui Color" now support `+BackgroundColor` and `+BackgroundDefault` (synonymous with `-Background`), not just ListView/TreeView/StatusBar/Progress.

[Gui.Add()](lib/Gui.md#Add) defaults to `y+m`/`x+m` instead of `yp`/`xp` when `xp`/`yp` or `xp+0`/`yp+0` is used. In other words, the control is placed below/to the right of the previous control instead of at exactly the same position. If a non-zero offset is used, the behavior is the same as in v1. To use exactly the same position, specify `xp yp` together.

`x+m` and `y+m` can be followed by an additional offset, such as `x+m+10` (`x+m10` is also valid, but less readable).

`Choose` no longer serves as a redundant (undocumented) way to specify the value for a MonthCal. Just use the *Text* parameter, as before.

### GuiControlGet

#### Empty sub-command

GuiControlGet's empty sub-command had two modes: the default mode, and text mode, where the fourth parameter was the word `Text`. If a control type had no single "value", GuiControlGet defaulted to returning the result of [GetWindowText](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-getwindowtexta) (which isn't always visible text). Some controls had no visible text, or did not support retrieving it, so completely ignored the fourth parameter. By contrast, [GuiControl.Text](lib/GuiControl.md#Text) returns display text, hidden text (the same text returned by ControlGetText) or nothing at all.

The table below shows the closest equivalent property or function for each mode of GuiControlGet and control type.

| Control | Default | Text | Notes |
| --- | --- | --- | --- |
| ActiveX | .Value | .Text | Text is hidden. See below. |
| Button | .Text |  |  |
| CheckBox | .Value | .Text |  |
| ComboBox | .Text | ControlGetText() | Use Value instead of Text if AltSubmit was used (but Value returns 0 if Text does not match a list item). Text performs case-correction, whereas ControlGetText returns the Edit field's content. |
| Custom | .Text |  |  |
| DateTime | .Value |  |  |
| DDL | .Text |  | Use Value instead of Text if AltSubmit was used. |
| Edit | .Value |  |  |
| GroupBox | .Text |  |  |
| Hotkey | .Value |  |  |
| Link | .Text |  |  |
| ListBox | .Text | ControlGetText() | Use Value instead of Text if AltSubmit was used. Text returns the selected item's text, whereas ControlGetText returns hidden text. See below. |
| ListView | .Text |  | Text is hidden. |
| MonthCal | .Value |  |  |
| Picture | .Value |  |  |
| Progress | .Value |  |  |
| Radio | .Value | .Text |  |
| Slider | .Value |  |  |
| StatusBar | .Text |  |  |
| Tab | .Text | ControlGetText() | Use Value instead of Text if AltSubmit was used. Text returns the selected tab's text, whereas ControlGetText returns hidden text. |
| Text | .Text |  |  |
| TreeView | .Text |  | Text is hidden. |
| UpDown | .Value |  |  |

ListBox: For multi-select ListBox, Text and Value return an array instead of a pipe-delimited list.

ActiveX: [GuiControl.Value](lib/GuiControl.md#Value) returns the same object each time, whereas GuiControlGet created a new wrapper object each time. Consequently, it is no longer necessary to retain a reference to an ActiveX object for the purpose of keeping a [ComObjConnect](lib/ComObjConnect.md) connection alive.

#### Other sub-commands

**Pos** → [GuiControl.GetPos()](lib/GuiControl.md#GetPos)

**Focus** → [Gui.FocusedCtrl](lib/Gui.md#FocusedCtrl); returns a GuiControl object instead of the ClassNN.

**FocusV** → `GuiObj.FocusedCtrl.Name`

**Hwnd** → [GuiControl.Hwnd](lib/GuiControl.md#Hwnd); returns a pure integer, not a hexadecimal string.

**Enabled/Visible/Name** → GuiCtrl properties of the same name.

### GuiControl

#### (Blank) and Text sub-commands

The table below shows the closest equivalent property or method for each mode of GuiControl and control type.

| Control | (Blank) | Text | Notes |
| --- | --- | --- | --- |
| ActiveX | N/A |  | Command had no effect. |
| Button | .Text |  |  |
| CheckBox | .Value | .Text |  |
| ComboBox | .Delete/Add/Choose | .Text |  |
| Custom | .Text |  |  |
| DateTime | .Value | .SetFormat() |  |
| DDL | .Delete/Add/Choose |  |  |
| Edit | .Value |  |  |
| GroupBox | .Text |  |  |
| Hotkey | .Value |  |  |
| Link | .Text |  |  |
| ListBox | .Delete/Add/Choose |  |  |
| ListView | N/A |  | Command had no effect. |
| MonthCal | .Value |  |  |
| Picture | .Value |  |  |
| Progress | .Value |  | Use the `+=` operator instead of the `+` prefix. |
| Radio | .Value | .Text |  |
| Slider | .Value |  | Use the `+=` operator instead of the `+` prefix. |
| StatusBar | .Text or SB.SetText() |  |  |
| Tab | .Delete/Add/Choose |  |  |
| Text | .Text |  |  |
| TreeView | N/A |  | Command had no effect. |
| UpDown | .Value |  | Use the `+=` operator instead of the `+` prefix. |

<a id="other-sub-commands-1"></a>
#### Other sub-commands

**Move** → [GuiControl.Move()](lib/GuiControl.md#Move)

**MoveDraw** → GuiControl.Move(), [GuiControl.Redraw()](lib/GuiControl.md#Redraw)

**Focus** → [GuiControl.Focus()](lib/GuiControl.md), which now uses WM_NEXTDLGCTL instead of SetFocus, so that focusing a Button temporarily sets it as the default, consistent with tabbing to the control.

**Enable/Disable** → set [GuiControl.Enabled](lib/GuiControl.md#Enabled)

**Hide/Show** → set [GuiControl.Visible](lib/GuiControl.md#Visible)

**Choose** → [GuiControl.Choose(n)](lib/GuiControl.md#Choose), where n is a pure integer. The `|n` or `||n` mode is not supported (use [ControlChooseIndex](lib/ControlChooseIndex.md) instead, if needed).

**ChooseString** → [GuiControl.Choose(s)](lib/GuiControl.md#Choose), where s is not a pure integer. The `|n` or `||n` mode is not supported (use [ControlChooseString](lib/ControlChooseString.md) instead, if needed). If the string matches multiple items in a multi-select ListBox, this method selects them all, not just the first.

**Font** → [GuiControl.SetFont()](lib/GuiControl.md#SetFont)

**+/-Option** → [GuiControl.Opt("+/-Option")](lib/GuiControl.md#Opt)

### Other Changes

Progress Gui controls no longer have the PBS_SMOOTH style by default, so they are now styled according to the system visual style.

The default margins and control sizes (particularly for Button controls) may differ slightly from v1 when DPI is greater than 100 %.

Picture controls no longer delete their current image when they fail to set a new image via `GuiCtrl.Value := "new image.png"`. However, removing the current image with `GuiCtrl.Value := ""` is permitted.

[ListView.InsertCol()](lib/ListView.md#InsertCol)'s *ColumnNumber* parameter can now be omitted, which has the same effect as specifying a column number larger than the number of columns currently in the control.

## Error Handling

[OnError](lib/OnError.md) is now called for critical errors prior to exiting the script. Although the script might not be in a state safe for execution, the attempt is made, consistent with OnExit.

Runtime errors no longer set `Exception.What` to the currently running user-defined function or sub (but this is still done when calling `Error()` without the second parameter). This gives `What` a clearer purpose: a function name indicates a failure of that function (not a failure to call the function or evaluate its parameters). `What` is blank for expression evaluation and control flow errors (some others may also be blank).

Exception objects thrown by runtime errors can now be identified as instances of the new Error class or a more specific subclass. Error objects have a *Stack* property containing a stack trace. If the *What* parameter specifies the name of a running function, *File* and *Line* are now set based on which line called that function.

Try-catch syntax has changed to allow the script to catch specific error classes, while leaving others uncaught. See [Catch](#catch) below for details.

### Continuable Errors

In most cases, error dialogs now provide the option to continue the current thread (vs. exiting the thread). COM errors now exit the thread when choosing not to continue (vs. exiting the entire script).

Scripts should not rely on this: If the error was raised by a built-in function, continuing causes it to return "". If the error was raised by the expression evaluator (such as for an invalid dynamic reference or divide by zero), the expression is aborted and yields "" (if used as a control flow statement's parameter).

In some cases the code does not support continuation, and the option to continue should not be shown. The option is also not shown for critical errors, which are designed to terminate the script.

[OnError](lib/OnError.md) callbacks now take a second parameter, containing one of the following values:

- Return: Returning -1 will continue the thread, while 0 and 1 act as before.
- Exit: Continuation not supported. Returning non-zero stops further processing but still exits the thread.
- ExitApp: This is a critical error. Returning non-zero stops further processing but the script is still terminated.

### ErrorLevel

ErrorLevel has been removed. Scripts are often (perhaps usually) written without error-checking, so the policy of setting ErrorLevel for errors often let them go undetected. An immediate error message may seem a bit confrontational, but is generally more helpful.

Where ErrorLevel was previously set to indicate an error condition, an exception is thrown instead, with a (usually) more helpful error message.

Commands such as "Process Exist" which used it to return a value now simply return that value (e.g. `pid := ProcessExist()`) or something more useful (e.g. `hwnd := GroupActivate(group)`).

In some cases ErrorLevel was used for a secondary return value.

- [Sort](lib/Sort.md) with the U option no longer returns the number of duplicates removed.
- The Input command was removed. It was superseded by InputHook. A few lines of code can make a simple replacement which returns an InputHook object containing the results instead of using ErrorLevel and an OutputVar.
- [InputBox](lib/InputBox.md) returns an object with *Result* (OK, Cancel or Timeout) and *Value* properties.

File functions which previously stored the number of failures in ErrorLevel now throw it in the *Extra* property of the thrown exception object.

[SendMessage](lib/SendMessage.md) timeout is usually an anomolous condition, so causes a [TimeoutError](lib/Error.md#TimeoutError) to be thrown. [TargetError](lib/Error.md#TargetError) and [OSError](lib/Error.md#OSError) may be thrown under other conditions.

The UseErrorLevel modes of the [Run](lib/Run.md) and [Hotkey](lib/Hotkey.md) functions were removed. This mode predates the addition of [Try](lib/Try.md)/[Catch](lib/Catch.md) to the language. Menu and Gui had this mode as well but were replaced with objects (which do not use ErrorLevel).

<a id="expressions-1"></a>
### Expressions

A load-time error is raised for more syntax errors than in v1, such as:

- Empty parentheses (except adjoining a function name); e.g. `x ()`
- Prefix operator used on the wrong side or lacking an operand; e.g. `x!`
- Binary operator with less than two operands.
- Ternary operator with less than three operands.
- Target of assignment not a writable variable or property.

An exception is thrown when any of the following failures occur (instead of ignoring the failure or producing an empty string):

- Attempting math on a non-numeric value. (Numeric strings are okay.)
- Divide by zero or other invalid/unsupported input, such as `(-1)**1.5`. Note that some cases are newly detected as invalid, such as `0**0` and `a<<b` or `a>>b` where *b* is not in the range 0..63.
- Failure to allocate memory for a built-in function's return value, concatenation or the expression's result.
- Stack underflow (typically caused by a syntax error).
- Attempted assignment to something which isn't a variable (or array element).
- Attempted assignment to a read-only variable.
- Attempted double-deref with an empty name, such as `fn(%empty%)`.
- Failure to execute a dynamic function call or method call.
- A method/property invocation fails because the value does not implement that method/property. (For associative arrays in v1, only a method call can cause this.)
- An object-assignment fails due to memory allocation failure.

Some of the conditions above are detected in v1, but not mid-expression; for instance, `A_AhkPath := x` is detected in v1 but `y := x, A_AhkPath := x` is only detected in v2.

Standalone use of the operators `+=`, `-=`, `--` and `++` no longer treats an empty variable as 0. This differs from v1, where they treated an empty variable as 0 when used standalone, but not mid-expression or with multi-statement comma.

<a id="functions-1"></a>
### Functions

Functions generally throw an exception on failure. In particular:

-     Errors due to incorrect use of [DllCall](lib/DllCall.md), [RegExMatch](lib/RegExMatch.md) and [RegExReplace](lib/RegExReplace.md) were fairly common due to their complexity, and (like many errors) are easier to detect and debug if an error message is shown immediately.
-     [Math functions](lib/Math.md) throw an exception if any of their inputs are non-numeric, or if the operation is invalid (such as division by zero).
-     Functions with a *WinTitle* parameter (with exceptions, such as [WinClose](lib/WinClose.md)'s ahk_group mode) throw if the target window or control is not found.

Exceptions are thrown for some errors that weren't previously detected, and some conditions that were incorrectly marked as errors (previously by setting ErrorLevel) were fixed.

Some error messages have been changed.

### Catch

The syntax for [Catch](lib/Catch.md) has been changed to provide a way to catch specific error classes, while leaving others uncaught (to transfer control to another Catch further up the call stack, or report the error and exit the thread). Previously this required catching thrown values of all types, then checking type and re-throwing. For example:

```ahk
; Old (uses obsolete v2.0-a rules for demonstration since v1 had no `is` or Error classes)
try
    SendMessage msg,,, "Control1", "The Window"
catch err
    if err is TimeoutError
        MsgBox "The Window is unresponsive"
    else
        throw err

; New
try
    SendMessage msg,,, "Control1", "The Window"
catch TimeoutError
    MsgBox "The Window is unresponsive"
```

Variations:

- `catch` catches an Error instance.
- `catch as err` catches an Error instance, which is assigned to err.
- `catch ValueError as err` catches a ValueError instance, which is assigned to err.
- `catch ValueError, TypeError` catches either type.
- `catch ValueError, TypeError as err` catches either type and assigns the instance to err.
- `catch Any` catches anything.
- `catch (MyError as err)` permits parentheses, like most other control flow statements.

If *Try* is used without *Finally* or *Catch*, it acts as though it has a *Catch* with an empty block. Although that sounds like v1, now *Catch* on its own only catches instances of [Error](lib/Error.md). In most cases, *Try* on its own is meant to suppress an Error, so no change needs to be made. However, the direct v2 equivalent of v1's `try something()` is the following:

```ahk
try something()
catch Any
{}
```

Prioritising the error type over the output variable name might encourage better code; handling the expected error as intended without suppressing or mishandling unexpected errors that should have been reported.

As values of all types can be thrown, any class is valid for the filter (e.g. `String` or `Map`). However, the class prototypes are resolved at load time, and must be specified as a full class name and not an arbitrary expression (similar to `y` in `class x extends y`).

While a *Catch* statement is executing, `throw` (without parameters) can be used to re-throw the exception (avoiding the need to specify an output variable just for that purpose). This is supported even within a nested *Try-Finally*, but not within a nested *Try-Catch*. The `throw` does not need to be physically contained by the *Catch* statement's body; it can be used by a called function.

An [Else](lib/Else.md) can be present after the last *Catch*; this is executed if no exception is thrown within *Try*.

## Keyboard, Mouse, Hotkeys and Hotstrings

Fewer VK to SC and SC to VK mappings are hard-coded, in theory improving compatibility with non-conventional custom keyboard layouts.

The key names "Return" and "Break" were removed. Use "Enter" and "Pause" instead.

The presence of `AltGr` on each keyboard layout is now always detected by reading the KLLF_ALTGR flag from the keyboard layout DLL. (v1.1.28+ Unicode builds already use this method.) The fallback methods of detecting `AltGr` via the keyboard hook have been removed.

Mouse wheel hotkeys set [A_EventInfo](Variables.md#EventInfo) to the wheel delta as reported by the mouse driver instead of dividing by 120. Generally it is a multiple of 120, but some mouse hardware/drivers may report wheel movement at a higher resolution.

Hotstrings now treat `Shift`+`Backspace` the same as `Backspace`, instead of transcribing it to `` `b `` within the hotstring buffer.

Hotstrings use the first pair of colons (`::`) as a delimiter rather than the last when multiple pairs of colons are present. In other words, colons (when adjacent to another colon) must be escaped in the trigger text in v2, whereas in v1 they must be escaped in the replacement. Note that with an odd number of consecutive colons, the previous behavior did not consider the final colon as part of a pair. For example, there is no change in behavior for `::1:::2` (`1` → `:2`), but `::3::::4` is now `3` → `::4` rather than `3::` → `4`.

Hotstrings no longer escape colons in pairs, which means it is now possible to escape a single colon at the end of the hotstring trigger. For example, ``::5`:::6`` is now `5:` → `6` rather than an error, and ``::7`::::8`` is now `7:` → `:8` rather than `7::` → `8`. It is best to escape every literal colon in these cases to avoid confusion (but a single isolated colon need not be escaped).

Hotstrings with continuation sections now default to Text mode instead of Raw mode.

Hotkeys now mask the Win/Alt key on release only if it is logically down and the hotkey requires the Win/Alt key (with `#`/`!` or a custom prefix). That is, hotkeys which do not require the Win/Alt key no longer mask Win/Alt-up when the Win/Alt key is physically down. This allows hotkeys which send `{Blind}{LWin up}` to activate the Start menu (which was already possible if using a remapped key such as `AppsKey::RWin`).

## Other

Windows 2000 and Windows XP support has been dropped.

AutoHotkey no longer overrides the system `ForegroundLockTimeout` setting at startup.

- This was done by calling `SystemParametersInfo` with the `SPI_SETFOREGROUNDLOCKTIMEOUT` action, which affects all applications for the current user session. It does not persist after logout, but was still undesirable to some users.
- User bug reports (and simple logic) indicate that if it works, it allows the focus to be stolen by programs which aren't specifically designed to do so.
- Some testing on Windows 10 indicated that it had no effect on anything; calls to `SetForegroundWindow` always failed, and other workarounds employed by WinActivate were needed and effective regardless of timeout. `SPI_GETFOREGROUNDLOCKTIMEOUT` was used from a separate process to verify that the change took effect (it sometimes doesn't).
- It can be replicated in script easily:
    ```ahk
    DllCall("SystemParametersInfo", "int", 0x2001, "int", 0, "ptr", 0, "int", 2)
    ```

RegEx newline matching defaults to (\*ANYCRLF) and (\*BSR_ANYCRLF); \`r and \`n are recognized in addition to \`r\`n. The \`a option implicitly enables (\*BSR_UNICODE).

RegEx callout functions can now be variadic. Callouts specified via a `pcre_callout` variable can be any callable object, or `pcre_callout` itself can be directly defined as a function (perhaps a nested function). As the function and variable [namespaces were merged](#scope), a callout pattern such as `(?C:fn)` can also refer to a local or global variable containing a function object, not just a user-defined function.

Scripts read from stdin (e.g. with `AutoHotkey.exe *`) no longer include the initial working directory in [A_ScriptFullPath](Variables.md#ScriptFullPath) or the main window's title, but it is used as [A_ScriptDir](Variables.md#ScriptDir) and to locate the local Lib folder.

Settings changed by the [auto-execute thread](Scripts.md#auto) now become the default settings immediately (for threads launched after that point), rather than after 100 ms and then again when the auto-execute thread finishes.

The following limits have been removed by utilizing dynamic allocations:

- Maximum line or continuation section length of 16,383 characters.
- Maximum 512 tokens per expression (MAX_TOKENS).<br> Arrays internal to the expression evaluator which were sized based on MAX_TOKENS are now based on precalculated estimates of the required sizes, so performance should be similar but stack usage is somewhat lower in most cases. This might increase the maximum recursion depth of user-defined functions.
- Maximum 512 var or function references per arg (but MAX_TOKENS was more limiting for expressions anyway).
- Maximum 255 specified parameter values per function call (but MAX_TOKENS was more limiting anyway).

[ListVars](lib/ListVars.md) now shows static variables separately to local variables. Global variables declared within the function are also listed as static variables (this is a side-effect of new implementation details, but is kept as it might be useful in scripts with many global variables).

The (undocumented?) "lazy var" optimization was removed to reduce code size and maintenance costs. This optimization improved performance of scripts with more than 100,000 variables.

[Tray menu](Program.md#tray-icon): The word "This" was removed from "Reload This Script" and "Edit This Script", for consistency with "Pause Script" and the main window's menu options.

YYYYMMDDHH24MISS timestamp values are now considered invalid if their length is not an even number between 4 and 14 (inclusive).

### Persistence

Scripts are "[persistent](lib/Persistent.md)" while at least one of the following conditions is satisfied:

- At least one hotkey or hotstring has been defined by the script.
- At least one [Gui](lib/Gui.md) (or the script's [main window](Program.md#main-window)) is visible.
- At least one script [timer](lib/SetTimer.md) is currently enabled.
- At least one [OnClipboardChange](lib/OnClipboardChange.md) callback function has been set.
- At least one [InputHook](lib/InputHook.md) is active.
- `Persistent()` or `Persistent(true)` was called and not reversed by calling `Persistent(false)`.

If one of the following occurs and none of the above conditions are satisfied, the script terminates.

- The last script thread finishes.
- A [Gui](lib/Gui.md) is closed or destroyed.
- The script's [main window](Program.md#main-window) is closed (but destroying it causes the script to exit regardless of persistence, as before).
- An [InputHook](lib/InputHook.md) with no [OnEnd](lib/InputHook.md#OnEnd) callback ends.

For flexibility, [OnMessage](lib/OnMessage.md) does not make the script automatically persistent.

By contrast, v1 scripts are "persistent" when at least one of the following is true:

- At least one hotkey or hotstring has been defined by the script.
- Gui or OnMessage() appears anywhere in the script.
- The keyboard hook or mouse hook is installed.
- Input has been called.
- #Persistent was used.

### Threads

[Threads](misc/Threads.md) start out with an uninterruptible timeout of 17 ms instead of 15 ms. 15 was too low since the system tick count updates in steps of 15 or 16 minimum; i.e. if the tick count updated at exactly the wrong moment, the thread could become interruptible even though virtually no time had passed.

Threads which start out uninterruptible now remain so until at least one line has executed, even if the uninterruptible timeout expires first (such as if the system suspends the process immediately after the thread starts in order to give CPU time to another process).

[#MaxThreads](lib/_MaxThreads.md) and [#MaxThreadsPerHotkey](lib/_MaxThreadsPerHotkey.md) no longer make exceptions for any subroutine whose first line is one of the following functions: [ExitApp](lib/ExitApp.md), [Pause](lib/Pause.md), [Edit](lib/Edit.md), [Reload](lib/Reload.md), [KeyHistory](lib/KeyHistory.md), [ListLines](lib/ListLines.md), [ListVars](lib/ListVars.md), or [ListHotkeys](lib/ListHotkeys.md).

### Default Settings

- <a id="NoEnv"></a> #NoEnv is the default behavior, so the directive itself has been removed. Use [EnvGet](lib/EnvGet.md) instead if an equivalent built-in variable is not available.
- [SendMode](lib/SendMode.md) defaults to Input instead of Event.
- [Title matching mode](lib/SetTitleMatchMode.md) defaults to 2 instead of 1.
- <a id="SetBatchLines"></a> SetBatchLines has been removed, so all scripts run at full speed (equivalent to SetBatchLines -1 in v1).
- The working directory defaults to [A_ScriptDir](Variables.md#ScriptDir). [A_InitialWorkingDir](Variables.md#InitialWorkingDir) contains the working directory which was set by the process which launched AutoHotkey.
- [#SingleInstance](lib/_SingleInstance.md) prompt behavior is default for all scripts; #SingleInstance on its own activates Force mode. `#SingleInstance Prompt` can also be used explicitly, for clarity or to override a previous directive.
- [CoordMode](lib/CoordMode.md) defaults to Client (added in v1.1.05) instead of Window.
- The default codepage for script files (but not files read *by* the script) is now UTF-8 instead of ANSI (CP0). This can be overridden with the /CP command line switch, as before.
- <a id="MaxMem"></a> #MaxMem was removed, and no artificial limit is placed on variable capacity.

### Default Script

When an AutoHotkey program file (such as AutoHotkey32.exe or AutoHotkey64.exe) is launched without specifying a script file, it no longer searches the user's Documents folder for a [default script file](Scripts.md#defaultfile).

AutoHotkey is not intended to be used by directly launching the program file, except when using a [portable copy](Program.md#portability). Instead of running the program file, you should generally [run an .ahk file](Program.md#run).

If you are creating a shortcut to a specific program file, you can append a space and the path of a script (generally enclosed by quote marks) to the shortcut's target.

### Command Line

Command-line args are no longer stored in a pseudo-array of numbered global vars; the global variable [A_Args](Variables.md#Args) (added in v1.1.27) should be used instead.

The /R and /F switches were removed. Use /restart and /force instead.

/validate should be used in place of /iLib when AutoHotkey.exe is being used to check a script for syntax errors, as the function library auto-include mechanism was removed.

/ErrorStdOut is now treated as one of the script's parameters, not built-in, in either of the following cases:

- When the script is compiled, unless /script is used.
- When it has a suffix not beginning with `=` (where previously the suffix was ignored).
