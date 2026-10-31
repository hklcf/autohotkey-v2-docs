# StatusBarWait

Waits until a window's status bar contains the specified string.

```ahk
Boolean := StatusBarWait(BarText, Timeout, Part#, WinTitle, WinText, Interval, ExcludeTitle, ExcludeText)
```

<a id="Parameters"></a>
## Parameters

**BarText**

Type: [String](../Concepts.md#strings)

If blank or omitted, the function waits for the status bar to become blank. Otherwise, specify the text or partial text for which the function will wait to appear. The text is case-sensitive and the matching behavior is determined by [SetTitleMatchMode](SetTitleMatchMode.md), similar to *WinTitle* below.

To instead wait for the bar's text to *change*, either use [StatusBarGetText](StatusBarGetText.md) in a loop, or use the RegEx example at the bottom of this page.

**Timeout**

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

If omitted, the function will wait indefinitely. Otherwise, it will wait no longer than this many seconds. To wait for a fraction of a second, specify a floating-point number, for example, 0.25 to wait for a maximum of 250 milliseconds.

**Part#**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1, which is usually the part that contains the text of interest. Otherwise, specify the part number of the bar to retrieve.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

If each of these is blank or omitted, the [Last Found Window](../misc/WinTitle.md#LastFoundWindow) will be used. Otherwise, specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. By default, hidden windows are not detected and hidden text elements are detected, unless changed with [DetectHiddenWindows](DetectHiddenWindows.md) and [DetectHiddenText](DetectHiddenText.md). When using [pure HWNDs](../misc/WinTitle.md#ahk_id), hidden windows are always detected. By default, a window title can contain *WinTitle* or *ExcludeTitle* anywhere inside it to be a match, unless changed with [SetTitleMatchMode](SetTitleMatchMode.md).

**Interval**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 50. Otherwise, specify how often the status bar should be checked while the function is waiting (in milliseconds).

<a id="Return_Value"></a>
## Return Value

Type: [Integer (boolean)](../Concepts.md#boolean)

This function returns 1 (true) if a match was found or 0 (false) if the function timed out.

<a id="Error_Handling"></a>
## Error Handling

A [TargetError](Error.md#TargetError) is thrown if the target window could not be found or does not contain a standard status bar.

An [OSError](Error.md#OSError) is thrown if there was a problem sending the SB_GETPARTS message or no reply was received within 2000 ms, or if memory could not be allocated within the process which owns the status bar.

<a id="Remarks"></a>
## Remarks

This function attempts to read the first *standard* status bar on a window (Microsoft common control: msctls_statusbar32). Some programs use their own status bars or special versions of the MS common control, in which case such bars are not supported.

Rather than using [StatusBarGetText](StatusBarGetText.md) in a loop, it is usually more efficient to use StatusBarWait, which contains optimizations that avoid the overhead of repeated calls to [StatusBarGetText](StatusBarGetText.md).

StatusBarWait determines its target window before it begins waiting for a match. If that target window is closed, the function will stop waiting even if there is another window matching the specified *WinTitle* and *WinText*.

While the function is in a waiting state, new [threads](../misc/Threads.md) can be launched via [hotkey](../Hotkeys.md), [custom menu item](Menu.md), or [timer](SetTimer.md).

<a id="Related"></a>
## Related

[StatusBarGetText](StatusBarGetText.md), [WinGetTitle](WinGetTitle.md), [WinGetText](WinGetText.md), [ControlGetText](ControlGetText.md)

<a id="Examples"></a>
## Examples

<a id="ExSearch"></a>

**Example:** Enters a new search pattern into an existing Explorer/Search window.

```ahk
if WinExist("Search Results") ; Sets the Last Found window to simplify the below.
{
    WinActivate
    Send "{tab 2}!o*.txt{enter}"  ; In the Search window, enter the pattern to search for.
    Sleep 400  ; Give the status bar time to change to "Searching".
    if StatusBarWait("found", 30)
        MsgBox "The search successfully completed."
    else
        MsgBox "The function timed out."
}
```

<a id="ExChange"></a>

**Example:** Waits for the status bar of the active window to change.

```ahk
SetTitleMatchMode "RegEx"  ; Accept regular expressions for use below.
if WinExist("A")  ; Set the last-found window to be the active window (for use below).
{
    OrigText := StatusBarGetText()
    StatusBarWait "^(?!\Q" OrigText "\E$)"  ; This regular expression waits for any change to the text.
}
```
