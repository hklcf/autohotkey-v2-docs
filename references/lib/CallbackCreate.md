# CallbackCreate

Creates a machine-code address that when called, redirects the call to a [function](../Functions.md) in the script.

```ahk
Address := CallbackCreate(Function , Options, ParamCount)
```

<a id="Parameters"></a>
## Parameters

**Function**

Type: [Function Object](../misc/Functor.md)

A function object to call automatically whenever *Address* is called. The function also receives the parameters that were passed to *Address*.

A [closure](../Functions.md#closures) or [bound function](../misc/Functor.md#BoundFunc) can be used to differentiate between multiple callbacks which all call the same script function.

The callback retains a reference to the function object, and releases it when the script calls [CallbackFree](#CallbackFree).

**Options**

Type: [String](../Concepts.md#strings)

If blank or omitted, a new [thread](../misc/Threads.md) will be started each time *Function* is called, the standard calling convention will be used, and the parameters will be passed individually to *Function*. Otherwise, specify one or more of the following options. Separate each option from the next with a space (e.g. `"C Fast"`).

<a id="Fast"></a>

**Fast** or **F**: Avoids starting a new [thread](../misc/Threads.md) each time *Function* is called. Although this performs better, it must be avoided whenever the thread from which *Address* is called varies (e.g. when the callback is triggered by an incoming message). This is because *Function* will be able to change global settings such as [A_LastError](../Variables.md#LastError) and the [last-found window](../misc/WinTitle.md#LastFoundWindow) for whichever thread happens to be running at the time it is called. For more information, see [Remarks](#Threads).

**CDecl** or **C**: Makes *Address* conform to the "C" calling convention. This is typically omitted because the standard calling convention is much more common for callbacks. This option is ignored by 64-bit versions of AutoHotkey, which use the x64 calling convention.

**&:** Causes the address of the parameter list (a single integer) to be passed to *Function* instead of the individual parameters. Parameter values can be retrieved by using [NumGet](NumGet.md). When using the standard 32-bit calling convention, *ParamCount* must specify the size of the parameter list in DWORDs (the number of bytes divided by 4).

**ParamCount**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to [*Function*.MinParams](Func.md#MinParams), which is usually the number of mandatory parameters in the [definition](../Functions.md#define) of *Function*. Otherwise, specify the number of parameters that *Address*'s caller will pass to it. In either case, ensure that the caller passes exactly this number of parameters.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

CallbackCreate returns a machine-code address. This address is typically passed to an external function via [DllCall](DllCall.md) or placed in a struct using [NumPut](NumPut.md), but can also be called directly by DllCall. Passing the address to [CallbackFree](#CallbackFree) will delete the callback.

<a id="Error_Handling"></a>
## Error Handling

This function fails and throws an exception under any of the following conditions:

- *Function* is not an object, or has neither a `MinParams` property nor a `Call` method.
- *Function* has a `MinParams` property which exceeds the number of parameters that the callback will supply.
- *ParamCount* is negative.
- *ParamCount* is omitted and: 1) *Function* has no `MinParams` property; or 2) the `&` option is used with the standard 32-bit calling convention.

<a id="The_Callback_Functions_Parameters"></a>

<a id="The_Functions_Parameters"></a>
## The *Function*'s Parameters

A [function](../Functions.md) assigned to a callback address may accept up to 31 parameters. [Optional parameters](../Functions.md#optional) are permitted, which is useful when *Function* is called by more than one caller.

Interpreting the parameters correctly requires some understanding of how the x86 calling conventions work. Since AutoHotkey does not have typed parameters, the callback's parameter list is assumed to consist of integers, and some reinterpretation may be required.

**AutoHotkey 32-bit:** All incoming parameters are unsigned 32-bit integers. Smaller types are padded out to 32 bits, while larger types are split into a series of 32-bit parameters.

If an incoming parameter is intended to be a signed integer, any negative numbers can be revealed by following either of the following methods:

```ahk
; Method #1
if (wParam > 0x7FFFFFFF)
    wParam := -(~wParam) - 1

; Method #2: Relies on the fact that AutoHotkey natively uses signed 64-bit integers.
wParam := wParam << 32 >> 32
```

**AutoHotkey 64-bit:** All incoming parameters are signed 64-bit integers. AutoHotkey does not natively support unsigned 64-bit integers. Smaller types are padded out to 64 bits, while larger types are always passed by address.

**AutoHotkey 32-bit/64-bit:** If an incoming parameter is intended to be 8-bit or 16-bit (or 32-bit on x64), the upper bits of the value might contain "garbage" which can be filtered out by using bitwise-and, as in the following examples:

```ahk
Callback(UCharParam, UShortParam, UIntParam) {
    UCharParam &= 0xFF
    UShortParam &= 0xFFFF
    UIntParam &= 0xFFFFFFFF
    ;...
}
```

If an incoming parameter is intended by its caller to be a string, what it actually receives is the address of the string. To retrieve the string itself, use [StrGet](StrGet.md):

```ahk
MyString := StrGet(MyParameter)
```

If an incoming parameter is the address of a structure, the individual members may be extracted by following the steps at [DllCall structures](DllCall.md#struct).

<a id="Indirect"></a>

**Receiving parameters by address:** If the `&` option is used, *Function* receives the *address* of the first callback parameter. For example:

```ahk
callback := CallbackCreate(TheFunc, "F&", 3)  ; Parameter list size must be specified for 32-bit.
DllCall(callback, "float", 10.5, "int64", 42)
TheFunc(params) {
    MsgBox NumGet(params, 0, "float") ", " NumGet(params, A_PtrSize, "int64")
}
```

Most callbacks in 32-bit programs use the *stdcall* calling convention, which requires a fixed number of parameters. In those cases, *ParamCount* must be set to the size of the parameter list, where Int64 and Double count as two 32-bit parameters. With *CDecl* or the 64-bit calling convention, *ParamCount* has no effect.

<a id="What_the_Function_Should_Return"></a>

<a id="What_Function_Should_Return"></a>
## What *Function* Should Return

If *Function* uses [Return](Return.md) without any parameters, or it specifies a blank value such as "" (or it never uses Return at all), 0 is returned to the caller of the callback. Otherwise, *Function* should return an integer, which is then returned to the caller. AutoHotkey 32-bit truncates return values to 32-bit, while AutoHotkey 64-bit supports 64-bit return values. Returning structs larger than this (by value) is not supported.

<a id="Threads"></a>
## Fast vs. Slow

The default/slow mode causes *Function* to start off fresh with the default values for settings such as [SendMode](SendMode.md) and [DetectHiddenWindows](DetectHiddenWindows.md). These defaults can be changed during [script startup](../Scripts.md#auto).

By contrast, the [fast mode](#Fast) inherits global settings from whichever [thread](../misc/Threads.md) happens to be running at the time *Function* is called. Furthermore, any changes *Function* makes to global settings (including the [last-found window](../misc/WinTitle.md#LastFoundWindow)) will go into effect for the [current thread](../misc/Threads.md). Consequently, the fast mode should be used only when it is known exactly which thread(s) *Function* will be called from.

To avoid being interrupted by itself (or any other thread), a callback may use [Critical](Critical.md) as its first line. However, this is not completely effective when *Function* is called indirectly via the arrival of a message less than 0x0312 (increasing Critical's [interval](Critical.md#Interval) may help). Furthermore, [Critical](Critical.md) does not prevent *Function* from doing something that might indirectly result in a call to itself, such as calling [SendMessage](SendMessage.md) or [DllCall](DllCall.md).

<a id="CallbackFree"></a>
## CallbackFree

Deletes a callback and releases its reference to the function object.

```ahk
CallbackFree(Address)
```

Each use of CallbackCreate allocates a small amount of memory (32 or 48 bytes plus system overhead). Since the OS frees this memory automatically when the script exits, any script that allocates a small, *fixed* number of callbacks can get away with not explicitly freeing the memory.

However, if the function object held by the callback is of a dynamic nature (such as a [closure](../Functions.md#closures) or [bound function](../misc/Functor.md#BoundFunc)), it can be especially important to free the callback when it is no longer needed; otherwise, the function object will not be released.

<a id="Related"></a>
## Related

[DllCall](DllCall.md), [OnMessage](OnMessage.md), [OnExit](OnExit.md), [OnClipboardChange](OnClipboardChange.md), [Sort's callback](Sort.md#callback), [Critical](Critical.md), [PostMessage](PostMessage.md), [SendMessage](SendMessage.md), [Functions](../Functions.md), [Windows Messages](../misc/SendMessageList.md), [Threads](../misc/Threads.md)

<a id="Examples"></a>
## Examples

<a id="ExWinList"></a>

**Example:** Displays a summary of all top-level windows.

```ahk
EnumAddress := CallbackCreate(EnumWindowsProc, "Fast")  ; Fast-mode is okay because it will be called only from this thread.

DetectHiddenWindows True  ; Due to fast-mode, this setting will go into effect for the callback too.

; Pass control to EnumWindows(), which calls the callback repeatedly:
DllCall("EnumWindows", "Ptr", EnumAddress, "Ptr", 0)
MsgBox Output  ; Display the information accumulated by the callback.

EnumWindowsProc(hwnd, lParam)
{
    global Output
    win_title := WinGetTitle(hwnd)
    win_class := WinGetClass(hwnd)
    if win_title
        Output .= "HWND: " hwnd "`tTitle: " win_title "`tClass: " win_class "`n"
    return true  ; Tell EnumWindows() to continue until all windows have been enumerated.
}
```

<a id="ExSubclassGUI"></a>

**Example:** Demonstrates how to subclass a GUI window by redirecting its WindowProc to a new WindowProc in the script. In this case, the background color of a text control is changed to a custom color.

```ahk
TextBackgroundColor := 0xFFBBBB  ; A custom color in BGR format.
TextBackgroundBrush := DllCall("CreateSolidBrush", "UInt", TextBackgroundColor)

MyGui := Gui()
Text := MyGui.Add("Text",, "Here is some text that is given`na custom background color.")

; 64-bit scripts must call SetWindowLongPtr instead of SetWindowLong:
SetWindowLong := A_PtrSize=8 ? "SetWindowLongPtr" : "SetWindowLong"

WindowProcNew := CallbackCreate(WindowProc)  ; Avoid fast-mode for subclassing.
WindowProcOld := DllCall(SetWindowLong, "Ptr", MyGui.Hwnd, "Int", -4  ; -4 is GWL_WNDPROC
    , "Ptr", WindowProcNew, "Ptr") ; Return value must be set to "Ptr" or "UPtr" vs. "Int".

MyGui.Show()

WindowProc(hwnd, uMsg, wParam, lParam)
{
    Critical
    if (uMsg = 0x0138 && lParam = Text.Hwnd)  ; 0x0138 is WM_CTLCOLORSTATIC.
    {
        DllCall("SetBkColor", "Ptr", wParam, "UInt", TextBackgroundColor)
        return TextBackgroundBrush  ; Return the HBRUSH to notify the OS that we altered the HDC.
    }
    ; Otherwise (since above didn't return), pass all unhandled events to the original WindowProc.
    return DllCall("CallWindowProc", "Ptr", WindowProcOld, "Ptr", hwnd, "UInt", uMsg, "Ptr", wParam, "Ptr", lParam)
}
```
