# Regular Expression Callouts

RegEx callouts provide a means of temporarily passing control to the script in the middle of regular expression pattern matching. For detailed information about the PCRE-standard callout feature, see [pcre.txt](http://www.pcre.org/pcre.txt).

RegEx callouts are currently supported only by [RegExMatch](../lib/RegExMatch.md) and [RegExReplace](../lib/RegExReplace.md).

<a id="toc"></a>
## Table of Contents

- [Syntax](#syntax)
- [RegEx Callout Functions](#callout-functions)
- [EventInfo](#EventInfo)
- [Auto-Callout](#auto)
- [Remarks](#remarks)

## Syntax

The syntax for a RegEx callout in AutoHotkey is (?C*Number*:*Function*), where both *Number* and *Function* are optional. Colon ':' is allowed only if *Function* is specified, and is optional if *Number* is omitted.

A callout function must be provided by either formally defining it or assigning it to a variable within the scope of the function which called RegExMatch or RegExReplace (local or global). If *Function* is omitted, it defaults to `pcre_callout`. If no variable is found or its value is not a [function object](Functor.md), an error is thrown.

<a id="callout-functions"></a>
## RegEx Callout Functions

```ahk
MyFunction(Match, CalloutNumber, FoundPos, Haystack, NeedleRegEx)
{
    ...
}
```

RegEx callout functions may define up to 5 parameters:

- **Match:** Receives a [RegExMatchInfo](../lib/RegExMatch.md#MatchObject) object containing information about the match so far.
- **CalloutNumber:** Receives the *Number* of the RegEx callout.
- **FoundPos:** Receives the position of the current potential match.
- **Haystack:** Receives the *Haystack* passed to RegExMatch or RegExReplace.
- **NeedleRegEx:** Receives the *NeedleRegEx* passed to RegExMatch or RegExReplace.

These names are suggestive only. Actual names may vary.

> **Warning:** Changing the input parameters of [RegExReplace](../lib/RegExReplace.md) or [RegExMatch](../lib/RegExMatch.md) during a call is unsupported and may cause unpredictable behavior.

Pattern-matching may proceed or fail depending on the return value of the RegEx callout function:

- If the function returns **0** or does not return a numeric value, matching proceeds as normal.
- If the function returns **1** or greater, matching fails at the current point, but the testing of other matching possibilities goes ahead.
- If the function returns **-1**, matching is abandoned.
- If the function returns a value less than -1, it is treated as a PCRE error code and matching is abandoned. This causes RegExMatch and RegExReplace to throw an exception; the *Extra* property of the exception object contains the error code.

For example:

```ahk
Haystack := "The quick brown fox jumps over the lazy dog."
RegExMatch(Haystack, "i)(The) (\w+)\b(?CCallout)")
Callout(m, *) {
    MsgBox "m[0]=" m[0] "`nm[1]=" m[1] "`nm[2]=" m[2]
    return 1
}
```

In the above example, *Callout* is called once for each substring which matches the part of the pattern preceding the RegEx callout. \b is used to exclude incomplete words in matches such as *The quic*, *The qui*, *The qu*, etc.

If any of the input parameters to a *RegEx* function is modified during a callout, the behavior is undefined.

<a id="EventInfo"></a>
## EventInfo

Additional information is available by accessing the pcre_callout_block structure via **A_EventInfo**.

```ahk
version           := NumGet(A_EventInfo,  0, "Int")
callout_number    := NumGet(A_EventInfo,  4, "Int")
offset_vector     := NumGet(A_EventInfo,  8, "Ptr")
subject           := NumGet(A_EventInfo,  8 + A_PtrSize, "Ptr")
subject_length    := NumGet(A_EventInfo,  8 + A_PtrSize*2, "Int")
start_match       := NumGet(A_EventInfo, 12 + A_PtrSize*2, "Int")
current_position  := NumGet(A_EventInfo, 16 + A_PtrSize*2, "Int")
capture_top       := NumGet(A_EventInfo, 20 + A_PtrSize*2, "Int")
capture_last      := NumGet(A_EventInfo, 24 + A_PtrSize*2, "Int")
pad := A_PtrSize=8 ? 4 : 0  ; Compensate for 64-bit data alignment.
callout_data      := NumGet(A_EventInfo, 28 + pad + A_PtrSize*2, "Ptr")
pattern_position  := NumGet(A_EventInfo, 28 + pad + A_PtrSize*3, "Int")
next_item_length  := NumGet(A_EventInfo, 32 + pad + A_PtrSize*3, "Int")
if (version >= 2)
    mark   := StrGet(NumGet(A_EventInfo, 36 + pad + A_PtrSize*3, "Int"), "UTF-8")
```

For more information, see [pcre.txt](http://www.pcre.org/pcre.txt), [NumGet](../lib/NumGet.md) and [A_PtrSize](../Variables.md#PtrSize).

<a id="auto"></a>
## Auto-Callout

Including **C** in the options of the pattern enables the auto-callout mode. In this mode, RegEx callouts equivalent to (?C255) are inserted before each item in the pattern. For example, the following template may be used to debug regular expressions:

```ahk
; Call RegExMatch with auto-callout option C.
RegExMatch("xxxabc123xyz", "C)abc.*xyz")

; Define the default RegEx callout function.
pcre_callout(Match, CalloutNumber, FoundPos, Haystack, NeedleRegEx)
{
    ; See pcre.txt for descriptions of these fields.
    start_match       := NumGet(A_EventInfo, 12 + A_PtrSize*2, "Int")
    current_position  := NumGet(A_EventInfo, 16 + A_PtrSize*2, "Int")
    pad := A_PtrSize=8 ? 4 : 0
    pattern_position  := NumGet(A_EventInfo, 28 + pad + A_PtrSize*3, "Int")
    next_item_length  := NumGet(A_EventInfo, 32 + pad + A_PtrSize*3, "Int")

    ; Point out >>current match<<.
    _HAYSTACK:=SubStr(Haystack, 1, start_match)
        . ">>" SubStr(Haystack, start_match + 1, current_position - start_match)
        . "<<" SubStr(Haystack, current_position + 1)

    ; Point out >>next item to be evaluated<<.
    _NEEDLE:=  SubStr(NeedleRegEx, 1, pattern_position)
        . ">>" SubStr(NeedleRegEx, pattern_position + 1, next_item_length)
        . "<<" SubStr(NeedleRegEx, pattern_position + 1 + next_item_length)

    ListVars
    ; Press Pause to continue.
    Pause
}
```

## Remarks

RegEx callouts are executed on the current quasi-thread, but the previous value of A_EventInfo will be restored after the RegEx callout function returns.

PCRE is optimized to abort early in some cases if it can determine that a match is not possible. For all RegEx callouts to be called in such cases, it may be necessary to disable these optimizations by specifying (\*NO_START_OPT) at the start of the pattern.
