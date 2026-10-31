# Functions

<a id="toc"></a>
## Table of Contents

- [Introduction and Simple Examples](#intro)
- [Parameters](#param)
- [ByRef Parameters](#ByRef)
- [Optional Parameters](#optional)
    - [Unset Parameters](#unset)
- [Returning Values to Caller](#return)
- [Variadic Functions](#Variadic)
    - [Variadic Function Calls](#VariadicCall)
- [Local and Global Variables](#Locals)
    - [Local Variables](#Local)
    - [Global Variables](#Global)
    - [Static Variables](#static)
    - [More About Locals and Globals](#More_about_locals_and_globals)
- [Dynamically Calling a Function](#DynCall)
- [Short-circuit Boolean Evaluation](#ShortCircuit)
- [Nested Functions](#nested)
    - [Static Functions](#static-functions)
    - [Closures](#closures)
- [Return, Exit, and General Remarks](#remarks)
- [Style and Naming Conventions](#Style_and_Naming_Conventions)
- [Using #Include to Share Functions Among Multiple Scripts](#include)
- [Built-in Functions](#BuiltIn)

<a id="intro"></a>
## Introduction and Simple Examples

<a id="define"></a>

A function is a reusable block of code that can be executed by *calling* it. A function can optionally accept parameters (inputs) and return a value (output). Consider the following simple function that accepts two numbers and returns their sum:

```ahk
Add(x, y)
{
    return x + y
}
```

The above is known as a function *definition* because it creates a function named "Add" (not case-sensitive) and establishes that anyone who calls it must provide exactly two parameters (x and y). To call the function, assign its result to a variable with the [`:=` operator](Variables.md#AssignOp). For example:

```ahk
Var := Add(2, 3)  ; The number 5 will be stored in Var.
```

Also, a function may be called without storing its return value:

```ahk
Add(2, 3)
Add 2, 3  ; Parentheses can be omitted if used at the start of a line.
```

But in this case, any value returned by the function is discarded; so unless the function produces some effect other than its return value, the call would serve no purpose.

Within an expression, a function call "evaluates to" the return value of the function. The return value can be assigned to a variable as shown above, or it can be used directly as shown below:

```ahk
if InStr(MyVar, "fox")
    MsgBox "The variable MyVar contains the word fox."
```

<a id="param"></a>
## Parameters

When a function is defined, its parameters are listed in parentheses next to its name (there must be no spaces between its name and the open-parenthesis). If a function does not accept any parameters, leave the parentheses empty; for example: `GetCurrentTimestamp()`.

Known limitation:

- If a parameter in a function-call resolves to a variable (e.g. `Var` or `++Var` or `Var*=2`), other parameters to its left or right can alter that variable before it is passed to the function. For example, `MyFunc(Var, Var++)` would unexpectedly pass 1 and 0 when *Var* is initially 0, because the first *Var* is not dereferenced until the function call is executed. Since this behavior is counterintuitive, it might change in a future release.

<a id="ByRef"></a>
## ByRef Parameters

From the function's point of view, parameters are essentially the same as [local variables](#Local) unless they are marked as *ByRef* as in this example:

```ahk
a := 1, b := 2
Swap(&a, &b)
MsgBox a ',' b

Swap(&Left, &Right)
{
    temp := Left
    Left := Right
    Right := temp
}
```

In the example above, the use of `&` requires the caller to pass a [VarRef](Concepts.md#variable-references), which usually corresponds to one of the caller's variables. Each parameter becomes an alias for the variable represented by the VarRef. In other words, the parameter and the caller's variable both refer to the same contents in memory. This allows the Swap function to alter the caller's variables by moving *Left*'s contents into *Right* and vice versa.

By contrast, if *ByRef* were not used in the example above, *Left* and *Right* would be copies of the caller's variables and thus the Swap function would have no external effect. However, the function could instead be changed to explicitly [dereference](Variables.md#deref) each VarRef. For example:

```ahk
Swap(Left, Right)
{
    temp := %Left%
    %Left% := %Right%
    %Right% := temp
}
```

Since [return](lib/Return.md) can send back only one value to a function's caller, VarRefs can be used to send back extra results. This is achieved by having the caller pass in a reference to a variable (usually empty) in which the function stores a value.

When passing large strings to a function, *ByRef* enhances performance and conserves memory by avoiding the need to make a copy of the string. Similarly, using *ByRef* to send a long string back to the caller usually performs better than something like `Return HugeString`. However, what the function receives is not a reference to the string, but a reference to the *variable*. Future improvements might supersede the use of ByRef for these purposes.

Known limitations:

- It is not possible to construct a VarRef for a property of an object (such as `foo.bar`), [A_Clipboard](lib/A_Clipboard.md) or any other [built-in variable](Variables.md#BuiltIn), so those cannot be passed *ByRef*.
- <a id="NoIsByRef"></a> If the parameter is optional, it is not possible to determine whether the variable referenced by the parameter is a newly created local variable or one supplied by the caller. One alternative is to use a non-ByRef parameter, but pass it a [VarRef](Concepts.md#variable-references) anyway, and have the function [explicitly dereference it](Variables.md#deref) or pass it to another function's ByRef parameter (without using the `&` operator).

<a id="optional"></a>
## Optional Parameters

When defining a function, one or more of its parameters can be marked as optional.

Append `:=` followed by a literal number, quoted/literal string such as "fox" or "", or an expression that should be evaluated each time the parameter needs to be initialized with its default value. For example, `X:=[]` would create a new Array each time.

Append `?` or `:= unset` to define a parameter which is [unset by default](#unset).

The following function has its Z parameter marked optional:

```ahk
Add(X, Y, Z := 0) {
    return X + Y + Z
}
```

When the caller passes **three** parameters to the function above, Z's default value is ignored. But when the caller passes only **two** parameters, Z automatically receives the value 0.

<a id="missing"></a>

It is not possible to have optional parameters isolated in the middle of the parameter list. In other words, all parameters that lie to the right of the first optional parameter must also be marked optional. However, optional parameters may be omitted from the middle of the parameter list when calling the function, as shown below:

```ahk
MyFunc(1,, 3)
MyFunc(X, Y:=2, Z:=0) {  ; Note that Z must still be optional in this case.
    MsgBox X ", " Y ", " Z
}
```

<a id="OptionalByRef"></a>

[ByRef parameters](#ByRef) also support default values; for example: `MyFunc(&p1 := "") {`. Whenever the caller omits such a parameter, the function creates a local variable to contain the default value; in other words, the function behaves as though the symbol "&" is absent.

<a id="unset"></a>
### Unset Parameters

To mark a parameter as optional without supplying a default value, use the keyword `unset` or the `?` suffix. In that case, whenever the parameter is omitted, the corresponding variable will have no value. Use [IsSet](lib/IsSet.md) to determine whether the parameter has been given a value, as shown below:

```ahk
MyFunc(p?) {  ; Equivalent to MyFunc(p := unset)
    if IsSet(p)
        MsgBox "Caller passed " p
    else
        MsgBox "Caller did not pass anything"
}

MyFunc(42)
MyFunc
```

Attempting to read the parameter's value when it has none is considered an error, the same as for any [uninitialized variable](Concepts.md#uninitialized-variables). To pass an optional parameter through to another function even when the parameter has no value, use the [maybe operator (*var***?**)](Variables.md#maybe). For example:

```ahk
Greet(title?) {
    MsgBox("Hello!", title?)
}

Greet "Greeting"  ; Title is "Greeting"
Greet             ; Title is A_ScriptName
```

<a id="return"></a>
## Returning Values to Caller

As described in [introduction](#intro), a function may optionally [return](lib/Return.md) a value to its caller.

```ahk
MsgBox returnTest()

returnTest() {
    return 123
}
```

If you want to return extra results from a function, you may also use [ByRef (&)](#ByRef):

```ahk
returnByRef(&A,&B,&C)
MsgBox A "," B "," C

returnByRef(&val1, &val2, val3)
{
    val1 := "A"
    val2 := 100
    %val3% := 1.1  ; % is used because & was omitted.
    return
}
```

Objects and Arrays can be used to return multiple values or even named values:

```ahk
Test1 := returnArray1()
MsgBox Test1[1] "," Test1[2]

Test2 := returnArray2()
MsgBox Test2[1] "," Test2[2]

Test3 := returnObject()
MsgBox Test3.id "," Test3.val

returnArray1() {
    Test := [123,"ABC"]
    return Test
}

returnArray2() {
    x := 456
    y := "EFG"
    return [x, y]
}

returnObject() {
    Test := {id: 789, val: "HIJ"}
    return Test
}
```

<a id="Variadic"></a>
## Variadic Functions

When defining a function, write an asterisk after the final parameter to mark the function as variadic, allowing it to receive a variable number of parameters:

```ahk
Join(sep, params*) {
    for index,param in params
        str .= param . sep
    return SubStr(str, 1, -StrLen(sep))
}
MsgBox Join("`n", "one", "two", "three")
```

When a variadic function is called, surplus parameters can be accessed via an object which is stored in the function's final parameter. The first surplus parameter is at `params[1]`, the second at `params[2]` and so on. As it is an [array](lib/Array.md), `params.Length` can be used to determine the number of parameters.

Attempting to call a non-variadic function with more parameters than it accepts is considered an error. To permit a function to accept any number of parameters *without* creating an array to store the surplus parameters, write `*` as the final parameter (without a parameter name).

> **Note:** The "variadic" parameter can only appear at the end of the formal parameter list.

<a id="VariadicCall"></a>
### Variadic Function Calls

While variadic functions can *accept* a variable number of parameters, an array of parameters can be passed to *any* function by applying the same syntax to a function-call:

```ahk
substrings := ["one", "two", "three"]
MsgBox Join("`n", substrings*)
```

Notes:

- The object can be an [Array](lib/Array.md) or any other kind of enumerable object (any object with an [\__Enum](Objects.md#__Enum) method) or an [enumerator](lib/Enumerator.md). If the object is not an Array, \__Enum is called with a count of 1 and the enumerator is called with only one parameter at a time.
- [Array](lib/Array.md) elements with no value (such as the first element in `[,2]`) are equivalent to omitting the parameter; that is, the parameter's default value is used if it is optional, otherwise an exception is thrown.
- This syntax can also be used when calling methods or setting or retrieving properties of objects; for example, `Object.Property[Params*]`.

Known limitations:

- Only the right-most parameter can be expanded this way. For example, `MyFunc(x, y*)` is supported but `MyFunc(x*, y)` is not.
- There must not be any non-whitespace characters between the asterisk (`*`) and the symbol which ends the parameter list.
- [Function call statements](Language.md#function-call-statements) cannot be variadic; that is, the parameter list must be enclosed in parentheses (or brackets for a property).

<a id="Locals"></a>
## Local and Global Variables

<a id="Local"></a>
### Local Variables

Local variables are specific to a single function and are visible only inside that function. Consequently, a local variable may have the same name as a global variable but have separate contents. Separate functions may also safely use the same variable names.

All local variables which are not [static](#static) are automatically freed (made empty) when the function returns, with the exception of variables which are bound to a [closure](#closures) or [VarRef](Concepts.md#variable-references) (such variables are freed at the same time as the closure or VarRef).

Built-in variables such as [A_Clipboard](lib/A_Clipboard.md) and [A_TimeIdle](Variables.md#TimeIdle) are never local (they can be accessed from anywhere), and cannot be redeclared. (This does not apply to built-in classes such as [Object](lib/Object.md); they are predefined as [global](#Global) variables.)

<a id="AssumeLocal"></a>

Functions are **assume-local** by default. Variables accessed or created inside an assume-local function are local by default, with the following exceptions:

- [Global](#Global) variables which are only read by the function, not assigned or used with the [reference operator (&)](Variables.md#ref).
- [Nested functions](#nested) may refer to local and static variables created by an enclosing function.

The default may also be overridden by declaring the variable using the `local` keyword, or by changing the mode of the function (as shown below).

<a id="Global"></a>
### Global Variables

<a id="AssignLocal"></a>

Any variable reference in an [assume-local](#AssumeLocal) function may resolve to a global variable if it is only read. However, if a variable is used in an assignment or with the [reference operator (&)](Variables.md#ref), it is automatically local by default. This allows functions to read global variables or call global or built-in functions without declaring them inside the function, while protecting the script from unintended side-effects when the name of a local variable being assigned coincides with a global variable. For example:

```ahk
LogToFile(TextToLog)
{
    ; LogFileName was previously given a value somewhere outside this function.
    ; FileAppend is a predefined global variable containing a built-in function.
    FileAppend TextToLog "`n", LogFileName
}
```

Otherwise, to refer to an existing global variable inside a function (or create a new one), declare the variable as global prior to using it. For example:

```ahk
SetDataDir(Dir)
{
    global LogFileName
    LogFileName := Dir . "\My.log"
    global DataDir := Dir  ; Declaration combined with assignment, described below.
}
```

<a id="AssumeGlobal"></a>

**Assume-global mode:** If a function needs to access or create a large number of global variables, it can be defined to assume that all its variables are global (except its parameters) by making its first line the word "global". For example:

```ahk
SetDefaults()
{
    global
    MyGlobal := 33  ; Assigns 33 to a global variable, first creating the variable if necessary.
    local x, y:=0, z  ; Local variables must be declared in this mode, otherwise they would be assumed global.
}
```

<a id="static"></a>
### Static Variables

Static variables are always implicitly local, but differ from locals because their values are remembered between calls. For example:

```ahk
LogToFile(TextToLog)
{
    static LoggedLines := 0
    LoggedLines += 1  ; Maintain a tally locally (its value is remembered between calls).
    global LogFileName
    FileAppend LoggedLines ": " TextToLog "`n", LogFileName
}
```

<a id="InitStatic"></a>

A static variable may be initialized on the same line as its declaration by following it with `:=` and any [expression](Variables.md#Expressions). For example: `static X:=0, Y:="fox"`. Static declarations are evaluated the same as [local](#Local) declarations, except that after a static initializer (or group of combined initializers) is successfully evaluated, it is effectively removed from the flow of control and will not execute a second time.

Nested functions can be [declared static](#static-functions) to prevent them from capturing non-static local variables of the outer function.

<a id="AssumeStatic"></a>

**Assume-static mode:** A function may be defined to assume that all its undeclared local variables are static (except its parameters) by making its first line the word "static". For example:

```ahk
GetFromStaticArray(WhichItemNumber)
{
    static
    static FirstCallToUs := true  ; Each static declaration's initializer still runs only once.
    if FirstCallToUs  ; Create a static array during the first call, but not on subsequent calls.
    {
        FirstCallToUs := false
        StaticArray := []
        Loop 10
            StaticArray.Push("Value #" . A_Index)
    }
    return StaticArray[WhichItemNumber]
}
```

In assume-static mode, any variable that should not be static must be declared as local or global (with the same exceptions as for [assume-local mode](#AssumeLocal)).

<a id="More_about_locals_and_globals"></a>
### More About Locals and Globals

Multiple variables may be declared on the same line by separating them with commas as in these examples:

```ahk
global LogFileName, MaxRetries := 5
static TotalAttempts := 0, PrevResult
```

<a id="DeclareInit"></a>

A variable may be initialized on the same line as its declaration by following it with an assignment. Unlike [static initializers](#InitStatic), the initializers of locals and globals execute every time the function is called. In other words, a line like `local x := 0` has the same effect as writing two separate lines: `local x` followed by `x := 0`. Any [assignment operator](Variables.md#AssignOp) can be used, but a compound assignment such as `global HitCount += 1` would require that the variable has previously been assigned a value.

Because the words *local*, *global*, and *static* are processed immediately when the script launches, a variable cannot be conditionally declared by means of an [IF statement](lib/If.md). In other words, a declaration inside an IF's or ELSE's [block](lib/Block.md) takes effect unconditionally for the entire function (but any initializers included in the declaration are still conditional). A dynamic declaration such as `global MyArray%i%` is not possible, since all non-dynamic references to variables such as `MyArray1` or `MyArray99` would have already been resolved to addresses.

<a id="DynCall"></a>
## Dynamically Calling a Function

Although a function call expression usually begins with a literal function name, the target of the call can be any expression which produces a [function object](misc/Functor.md). In the expression `GetKeyState("Shift")`, *GetKeyState* is actually a variable reference, although it usually refers to a read-only variable containing a built-in function.

A function call is said to be *dynamic* if the target of the call is determined while the script is running, instead of before the script starts. The same syntax is used as for normal function calls; the only apparent difference is that certain error-checking is performed at load time for non-dynamic calls but only at run time for dynamic calls.

For example, `MyFunc()` would call the [function object](misc/Functor.md) contained by *MyFunc*, which could be either the actual name of a function, or just a variable which has been assigned a function.

Other expressions can be used as the target of a function call, including [double-derefs](Variables.md#deref). For example, `MyArray[1]()` would call the function contained by the first element of MyArray, while `%MyVar%()` would call the function contained by the *variable* whose *name* is contained by MyVar. In other words, the expression preceding the parameter list is first evaluated to get a [function object](misc/Functor.md), then that object is called.

If the target value cannot be called due to one of the reasons below, an [Error](lib/Error.md) is thrown:

- If the target value is not of a type that can be called, a [MethodError](lib/Error.md#MethodError) is thrown. Any value with a Call method can be called, so `HasMethod(value, "Call")` or `HasMethod(value)` can be used to avoid this error.
- Passing too few or too many parameters, which can often be avoided by checking the function's [MinParams](lib/Func.md#MinParams), [MaxParams](lib/Func.md#MaxParams) and [IsVariadic](lib/Func.md#IsVariadic) properties, either directly or by calling `HasMethod(value,, N)`, where *N* is the number of parameters that will be passed to the function.
- Passing something other than a [variable reference (VarRef)](Concepts.md#variable-references) to a [ByRef](#ByRef) or OutputVar parameter, which could be avoided through the use of the [IsByRef method](lib/Func.md#IsByRef).

The caller of a function should generally know what each parameter means and how many there are before calling the function. However, for dynamic calls, the function is often written to suit the function call, and in such cases failure might be caused by a mistake in the function definition rather than incorrect parameter values.

<a id="ShortCircuit"></a>
## Short-circuit Boolean Evaluation

When *AND, OR*, and the [ternary operator](Variables.md#ternary) are used within an [expression](Variables.md#Expressions), they short-circuit to enhance performance (regardless of whether any function calls are present). Short-circuiting operates by refusing to evaluate parts of an expression that cannot possibly affect its final result. To illustrate the concept, consider this example:

```ahk
if (ColorName != "" AND not FindColor(ColorName))
    MsgBox ColorName " could not be found."
```

In the example above, the FindColor() function never gets called if the *ColorName* variable is empty. This is because the left side of the *AND* would be *false*, and thus its right side would be incapable of making the final outcome *true*.

Because of this behavior, it's important to realize that any side-effects produced by a function (such as altering a global variable's contents) might never occur if that function is called on the right side of an *AND* or *OR*.

It should also be noted that short-circuit evaluation cascades into nested *AND*s and *OR*s. For example, in the following expression, only the leftmost comparison occurs whenever *ColorName* is blank. This is because the left side would then be enough to determine the final answer with certainty:

```ahk
if (ColorName = "" OR FindColor(ColorName, Region1) OR FindColor(ColorName, Region2))
    break   ; Nothing to search for, or a match was found.
```

As shown by the examples above, any expensive (time-consuming) functions should generally be called on the right side of an *AND* or *OR* to enhance performance. This technique can also be used to prevent a function from being called when one of its parameters would be passed a value it considers inappropriate, such as an empty string.

The [ternary conditional operator (?:)](Variables.md#ternary) also short-circuits by not evaluating the losing branch.

<a id="nested"></a>
## Nested Functions

A *nested* function is one defined inside another function. For example:

```ahk
outer(x) {
    inner(y) {
        MsgBox(y, x)
    }
    inner("one")
    inner("two")
}
outer("title")
```

A nested function is not accessible by name outside of the function which immediately encloses it, but is accessible anywhere inside that function, including inside other nested functions (with exceptions).

By default, a nested function may access any [static](#static) variable of any function which encloses it, even dynamically. However, a non-dynamic assignment inside a nested function typically resolves to a local variable if the outer function has neither a declaration nor a non-dynamic assignment for that variable.

<a id="capture-var"></a>

By default, a nested function automatically "captures" a non-static local variable of an outer function when the following requirements are met:

1. The outer function must refer to the variable in at least one of the following ways:
    1. By declaring it with `local`, or as a parameter or nested function.
    2. As the non-dynamic target of an assignment or the [reference operator (&)](Variables.md#ref).
2. The inner function (or a function nested inside it) must refer to the variable non-dynamically.

A nested function which has captured variables is known as a [closure](#closures).

Non-static local variables of the outer function cannot be [accessed dynamically](Language.md#dynamic-variables) unless they have been captured.

Explicit declarations always take precedence over local variables of the function which encloses them. For example, `local x` declares a variable local to the current function, independent of any `x` in the outer function. [Global](#Global) declarations in the outer function also affect nested functions, except where overridden by an explicit declaration.

If a function is declared [assume-global](#AssumeGlobal), any local or static variables created *outside* that function are not directly accessible to the function itself or any of its nested functions. By contrast, a nested function which is assume-static can still refer to variables from the outer function, unless the function itself is [declared static](#static-functions).

Functions are [assume-local](#AssumeLocal) by default, and this is true even for nested functions, even those inside an [assume-static](#AssumeStatic) function. However, if the outer function is [assume-global](#AssumeGlobal), nested functions behave as though assume-global by default, except that they can refer to local and static variables of the outer function.

Each function definition creates a read-only variable containing the function itself; that is, a [Func](lib/Func.md) or [Closure](#closures) object. See below for examples of how this might be used.

### Static Functions

Any nested function which does not capture variables is automatically static; that is, every call to the outer function references the same [Func](lib/Func.md). The keyword `static` can be used to explicitly declare a nested function as static, in which case any non-static local variables of the outer function are ignored. For example:

```ahk
outer() {
    x := "outer value"
    static inner() {
        x := "inner value"  ; Creates a variable local to inner
        MsgBox type(inner)  ; Displays "Func"
    }
    inner()
    MsgBox x  ; Displays "outer value"
}
outer()
```

A static function cannot refer to other nested functions outside its own body unless they are explicitly declared static. Note that even if the function is [assume-static](#AssumeStatic), a non-static nested function may become a closure if it references a function parameter.

### Closures

A *closure* is a nested function bound to a set of <a id="free-vars"></a>*free variables*. Free variables are local variables of the outer function which are also used by nested functions. Closures allow one or more nested functions to share variables with the outer function even after the outer function returns.

To create a closure, simply define a nested function which refers to variables of the outer function. For example:

```ahk
make_greeter(f)
{
    greet(subject)  ; This will be a closure due to f.
    {
        MsgBox Format(f, subject)
    }
    return greet  ; Return the closure.
}

g := make_greeter("Hello, {}!")
g(A_UserName)
g("World")
```

Closures may also be used with built-in functions, such as [SetTimer](lib/SetTimer.md) or [Hotkey](lib/Hotkey.md). For example:

```ahk
app_hotkey(keyname, app_title, app_path)
{
    activate(keyname)  ; This will be a closure due to app_title and app_path.
    {
        if WinExist(app_title)
            WinActivate
        else
            Run app_path
    }
    Hotkey keyname, activate
}
; Win+N activates or launches Notepad.
app_hotkey "#n", "ahk_class Notepad", "notepad.exe"
; Win+P activates or launches Paint.
app_hotkey "#p", "ahk_class MSPaintApp", "mspaint.exe"
```

A nested function is automatically a closure if it captures any non-static local variables of the outer function. The variable corresponding to the closure itself (such as `activate`) is also a non-static local variable, so any nested functions which refer to a closure are automatically closures.

Each call to the outer function creates new closures, distinct from any previous calls.

<a id="circular-closure"></a>

It is best not to store a reference to a closure in any of the outer function's free variables, since that creates a [reference cycle](Objects.md#refs-problems) which must be broken (such as by clearing the variable) before the closure can be freed. However, a closure may safely refer to itself and other closures by their original variables without creating a problematic reference cycle. For example:

```ahk
timertest() {
    x := "tock!"
    tick() {
        MsgBox x           ; x causes this to become a closure.
        SetTimer tick, 0   ; Using the closure's original var is safe.
        ; SetTimer t, 0    ; Capturing t would create a reference cycle.
    }
    t := tick              ; This is okay because t isn't captured above.
    SetTimer t, 1000
}
timertest()
```

Each time the outer function is called, all of its [free variables](#free-vars) are allocated as a set. This one set of free variables is linked to all of the function's closures. If the closure's original variable (`tick` in the example above) is captured by another closure within the same function, its lifetime is bound to the set. The set is deleted only when no references exist to any of its closures, except those in the original variables. This allows closures to refer to each other without causing a [problematic reference cycle](Objects.md#refs-problems).

Closures which are not captured by other closures can be deleted before the set. All of the free variables within the set, including captured closures, cannot be deleted while such a closure exists.

<a id="remarks"></a>
## Return, Exit, and General Remarks

If the flow of execution within a function reaches the function's closing brace prior to encountering a [Return](lib/Return.md), the function ends and returns a blank value (empty string) to its caller. A blank value is also returned whenever the function explicitly omits [Return](lib/Return.md)'s parameter.

When a function uses [Exit](lib/Exit.md) to terminate the [current thread](misc/Threads.md), its caller does not receive a return value at all. For example, the statement `Var := Add(2, 3)` would leave `Var` unchanged if `Add()` exits. The same thing happens if the function is exited because of [Throw](lib/Throw.md) or a runtime error (such as [running](lib/Run.md) a nonexistent file).

To call a function with one or more blank values (empty strings), use an empty pair of quotes as in this example: `FindColor(ColorName, "")`.

Since calling a function does not start a new [thread](misc/Threads.md), any changes made by a function to settings such as [SendMode](lib/SendMode.md) and [SetTitleMatchMode](lib/SetTitleMatchMode.md) will go into effect for its caller too.

When used inside a function, [ListVars](lib/ListVars.md) displays a function's [local variables](#Local) along with their contents. This can help [debug a script](Scripts.md#debug).

<a id="Style_and_Naming_Conventions"></a>
## Style and Naming Conventions

You might find that complex functions are more readable and maintainable if their special variables are given a distinct prefix. For example, naming each parameter in a function's parameter list with a leading "p" or "p_" makes their special nature easy to discern at a glance, especially when a function has several dozen [local variables](#Local) competing for your attention. Similarly, the prefix "r" or "r_" could be used for [ByRef parameters](#ByRef), and "s" or "s_" could be used for [static variables](#static).

The [One True Brace (OTB) style](lib/Block.md#otb) may optionally be used to define functions. For example:

```ahk
Add(x, y) {
    return x + y
}
```

<a id="include"></a>
## Using #Include to Share Functions Among Multiple Scripts

The [#Include](lib/_Include.md) directive may be used to load functions from an external file.

<a id="BuiltIn"></a>
## Built-in Functions

A built-in function is overridden if the script defines its own function of the same name. For example, a script could have its own custom WinExist function that is called instead of the standard one. However, the script would then have no way to call the original function.

External functions that reside in DLL files may be called with [DllCall](lib/DllCall.md).

To get a list of all built-in functions, see [Alphabetical Function Index](lib/index.md).
