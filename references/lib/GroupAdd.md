# GroupAdd

Adds a window specification to a window group, creating the group if necessary.

```ahk
GroupAdd GroupName , WinTitle, WinText, ExcludeTitle, ExcludeText
```

<a id="Parameters"></a>
## Parameters

**GroupName**

Type: [String](../Concepts.md#strings)

The name of the group to which to add this window specification. If the group doesn't exist, it will be created. Group names are not case-sensitive.

**WinTitle, WinText, ExcludeTitle, ExcludeText**

Type: [String](../Concepts.md#strings), [Integer](../Concepts.md#numbers) or [Object](../Concepts.md#objects)

Specify for *WinTitle* a [window title or other criteria](../misc/WinTitle.md) to identify the target window and/or for *WinText* a substring from a single text element of the target window (as revealed by the included [Window Spy](../Program.md#Window_Spy) utility).

*ExcludeTitle* and *ExcludeText* can be used to exclude one or more windows by their title or text. Their specification is similar to *WinTitle* and *WinText*, except that *ExcludeTitle* does not recognize any criteria other than the window title.

Window titles and text are case-sensitive. Although [DetectHiddenWindows](DetectHiddenWindows.md), [DetectHiddenText](DetectHiddenText.md) and [SetTitleMatchMode](SetTitleMatchMode.md) do not directly affect the behavior of this function, they do affect the other group functions such as [GroupActivate](GroupActivate.md) and [GroupClose](GroupClose.md). They also affect the use of ahk_group in any other function's [WinTitle](../misc/WinTitle.md).

<a id="Remarks"></a>
## Remarks

Each use of this function adds a new rule to a group. In other words, a group consists of a set of criteria rather than a fixed list of windows. Later, when a group is used by a function such as [GroupActivate](GroupActivate.md), each window on the desktop is checked against each of these criteria. If a window matches one of the criteria in the group, it is considered a match.

A window group is typically used to bind together a collection of related windows, which is useful for tasks that involve many related windows, or an application that owns many subwindows. For example, if you frequently work with many instances of a graphics program or text editor, you can use [GroupActivate](GroupActivate.md) on a hotkey to visit each instance of that program, one at a time, without having to use alt-tab or task bar buttons to locate them.

Since the entries in each group need to be added only once, this function is typically used during [script startup](../Scripts.md#auto). Attempts to add duplicate entries to a group are ignored.

To include <u>all</u> windows in a group (except the special Program Manager window), use this example:

```ahk
GroupAdd "AllWindows"
```

All windowing functions can operate upon a window group by specifying `ahk_group MyGroupName` for the *WinTitle* parameter. The functions [WinMinimize](WinMinimize.md), [WinMaximize](WinMaximize.md), [WinRestore](WinRestore.md), [WinHide](WinHide.md), [WinShow](WinShow.md), [WinClose](WinClose.md), and [WinKill](WinKill.md) will operate upon <u>all</u> the group's windows. To instead operate upon only the topmost window, follow this example:

```ahk
WinHide WinExist("ahk_group MyGroup")
```

By contrast, other windowing functions such as [WinActivate](WinActivate.md) and [WinExist](WinExist.md) will operate only upon the topmost window of the group.

<a id="Related"></a>
## Related

[GroupActivate](GroupActivate.md), [GroupDeactivate](GroupDeactivate.md), [GroupClose](GroupClose.md)

<a id="Examples"></a>
## Examples

<a id="ExIE"></a>

**Example:** Press a hotkey to traverse all open MSIE windows.

```ahk
; In global code, to be evaluated at startup:
GroupAdd "MSIE", "ahk_class IEFrame" ; Add only Internet Explorer windows to this group.

; Assign a hotkey to activate this group, which traverses
; through all open MSIE windows, one at a time (i.e. each
; press of the hotkey).
Numpad1::GroupActivate "MSIE", "r"
```

<a id="ExOutlook"></a>

**Example:** Press a hotkey to visit each MS Outlook 2002 window, one at a time.

```ahk
; In global code, to be evaluated at startup:
SetTitleMatchMode 2
GroupAdd "mail", "Message - Microsoft Word" ; This is for mails currently being composed
GroupAdd "mail", "- Message (" ; This is for already opened items
; Need extra text to avoid activation of a phantom window:
GroupAdd "mail", "Advanced Find", "Sear&ch for the word(s)"
GroupAdd "mail", , "Recurrence:"
GroupAdd "mail", "Reminder"
GroupAdd "mail", "- Microsoft Outlook"

; Assign a hotkey to visit each Outlook window, one at a time.
Numpad5::GroupActivate "mail"
```
