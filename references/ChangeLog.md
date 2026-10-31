# Changes & New Features

[Changes from v1.1 to v2.0](v2-changes.md) covers the differences between v1.1 and v2.0.

For full technical details of changes, refer to [GitHub](https://github.com/AutoHotkey/AutoHotkey).

<a id="v2.0.31"></a>
## 2.0.31 - October 25, 2026

Fixed `a.b[c]` to throw when `a.b` is a method.

Fixed crash when setting a breakpoint if any function has a parameter default expression and an arrow function as its first line. [PR #363 by FuPeiJiang]

<a id="v2.0.30"></a>
## 2.0.30 - October 9, 2026

Fixed Gui.Move moving the window incorrectly if it has an owner. [PR #359 by iPhilip]

Fixed `a & b::AltTabMenu` and similar crashing the program when activated [broken by v2.0.20].

<a id="v2.0.29"></a>
## 2.0.29 - October 3, 2026

Fixed OnMessage crashing if more than 65536 monitors are registered.

<a id="v2.0.28"></a>
## 2.0.28 - September 12, 2026

Fixed Gui.Move to not DPI-scale X or Y.

<a id="v2.0.27"></a>
## 2.0.27 - August 28, 2026

Fixed breakpoint on line containing `=>` where direct parent is a block.

Fixed `Send "{Click X Y Count}"` to move only once, not *Count* times.

Fixed IServiceProvider interface pointer leak in ComObjQuery.

Fixed setter definition to be permitted after a separate getter.

Fixed Item parameter of ContextMenu event raised by a ListView's Header.

Fixed class declarations to not permit a class to subclass itself.

<a id="v2.0.26"></a>
## 2.0.26 - May 4, 2026

Fixed ControlGetItems/ControlGetChoice not throwing for Tab controls.

Fixed error reporting for ComObjArray().__Enum(), if it ever fails.

Fixed `TraySetIcon("HBITMAP:" handle)` without \*.

<a id="v2.0.25"></a>
## 2.0.25 - April 26, 2026

Fixed ByRef alias to global var becoming unset in recursive calls.

Fixed error raised by Hotkey() not transferring control correctly.

<a id="v2.0.24"></a>
## 2.0.24 - April 19, 2026

Fixed navigation with Tab key in a Gui with a nested Gui (+Parent).

**UX/Dash**

Added an [optional check for AutoHotkey updates](Program.md#update), disabled by default. [based on UX PR #11 by kczx3]

Fixed errors being raised when arrow keys are used in the Help Files menu. [UX PR #24 by iPhilip]

Fixed install-version.ahk to delete the temporary ".staging" directory after installing an upgrade.

Fixed Help Files menu to be displayed at the button, not at the mouse cursor.

Changed "New script" to add the file to recent files.

<a id="v2.0.23"></a>
## 2.0.23 - April 5, 2026

Changed how key-up events are correlated to key-down events for the purpose of determining whether to suppress key-up. A key-down with SendLevel between 1 and 7 now only correlates with a key-up of the same level. When `#InputLevel 1` is in effect, this fixes `Right::Send "{Right}"` not suppressing key-up, `RShift::RAlt` interfering with `RAlt::RShift` and vice versa. Events with SendLevel 8 and above are still grouped with non-sent events for practical reasons.

Fixed `WinExist("A",,,"B")` to not exclude windows which have no controls.

Fixed custom combo hotkeys with neutral modifiers (e.g. `Alt & Esc::`) [broken by v2.0.22].

Fixed key-up hotkeys to fire consistently when the key is used as both a prefix and a suffix (e.g. `a & b::`, `b & a::` and `a up::`).

Fixed timers interrupting MsgBox after the timeout starts but before the window is shown, such as if `SetTimer(MsgBox, -10)` is used immediately before `MsgBox(1,,"T1")`.

<a id="v2.0.22"></a>
## 2.0.22 - March 22, 2026

Removed the undocumented effect that a hotkey with the \</\> prefix had on the corresponding modifier key; e.g. `<^a::` causing `LCtrl::` to fire on release, inconsistent with the [documentation](KeyList.md#modifier). Always firing on press provides greater consistency and flexibility. The modifier key itself was suppressed since v2.0.20. Neutral modifiers such as `Ctrl::` always fire on release, and similar behavior can be implemented with [A_PriorKey](Variables.md#PriorKey) and `~LCtrl up::`.

Changed error dialogs to use msftedit.dll instead of riched20.dll to fix the following issues:

- Hanging when inspected by UI Automation.
- Broken characters and inconsistent fonts when the error message includes certain character sets (e.g. emoji, Chinese or Arabic).

Fixed errors within \__Delete being suppressed if a Try/Catch is active.

Fixed CallbackCreate to validate ParamCount.

Fixed detection of `DllCall(... "str",&var:={} ...)` as an error.

Fixed `CapsLock::` to suppress even if CapsLock is used as a prefix key.

Fixed neutral Ctrl/Alt/Shift hotkeys to not suppress the key [broken by v2.0.20].

Fixed fire-on-release behavior of neutral Ctrl/Alt/Shift hotkeys when a key-up variant is turned on but disabled by #HotIf.

Fixed `CapsLock & 1::` to revert CapsLock state even if another prefix key is pressed before CapsLock is released.

Fixed L/R modifier key-up not being suppressed in some cases where key-down was suppressed.

Fixed L/R modifier key-up to be passed through if `~` is used even if key-down was suppressed.

Fixed L/R modifier hotkeys to fire on press even if the corresponding neutral modifier is present; e.g. `LCtrl::` with `Ctrl::`.

Fixed corruption of unquoted continuation sections with trailing spaces.

Fixed file stream I/O to flush cached writes if the file hasn't been closed when the process exits.

Fixed `` `; `` in continuation sections with the `` ` `` (literal escape) and `C` (comment) options.

Cleaned up some code within the keyboard/mouse hook.

<a id="v2.0.21"></a>
## 2.0.21 - February 9, 2026

Fixed StrGet crashing when given an address and not a length. (Broken by v2.0.20)

<a id="v2.0.20"></a>
## 2.0.20 - February 8, 2026

Fixed potential undefined behavior in message callbacks during script termination.

Fixed Run not closing the process handle.

Fixed GuiFromHwnd crashing if passed another script's GUI window HWND.

Fixed leading space in `For( a in b )` incorrectly raising an error.

Fixed enumerator calls (For) treating implicitly returned "" as true.

Fixed `A_maxHotkeysPerInterval` and `A_Hotkeyinterval` returning incorrect values if spelled in lower case.

Fixed FileSelect duplicating the filter pattern if it lacks `*.`.

Fixed ListBox tab-stop spacing when T option is used during control creation. [[PR #346](https://github.com/AutoHotkey/AutoHotkey/pull/346)]

Fixed `~RAlt & <::` causing `RAlt::` to fire on release despite `~` (and likewise with other L/R modifier keys).

Fixed remap with nonexistent source key causing silent exit.

Fixed key-up hotkey causing unwanted passthrough when modifiers don't match. e.g. RButton release not being suppressed after activating `RButton::` if `^RButton up::` was also present.

Fixed semicolon in `/* ; */` preventing the block comment from ending.

Fixed IsOptional and IsByRef return values for built-in methods.

Fixed RegWrite parameter 1 to be mandatory.

Fixed string return value being corrupted during debugging.

Fixed erroneous `Else` placement to raise an error, not crash on load.

Fixed StrPut/StrGet handling of 32-bit integer limits on x64.

- Operations not requiring conversion no longer limit string length.
- Conversion now throws more consistently if the API's limit is exceeded.

Fixed `1::` to not fire after `1 & LButton up::` is used, and similar.

Fixed crash when ListView has the Sort option and Add is called with Col1 omitted.

Fixed static functions not using static variables of grandparent functions.

Fixed unpaired key-up hotkey not suppressing the key if it is also used as a prefix but the custom combos are disabled or have the tilde modifier.

Fixed L/R modifier hotkeys to suppress even if the corresponding neutral modifier is present; e.g. `LCtrl::` with `Ctrl::`.

<a id="v2.0.19"></a>
## 2.0.19 - January 25, 2025

Fixed memory out-of-bounds access during RegEx compilation.

Fixed externally-released modifiers to not be "restored" post-Send.

Fixed modal dialog boxes suppressing InputHook events.

Fixed key-up erroneously being suppressed after key-repeat presses it down in some cases.

Fixed Critical Error when loading large icons with no alpha channel.

Fixed MouseGetPos to make Control blank and not throw if ClassNN cannot be determined.

Fixed FileSelect to validate Options.

Fixed unexpected Catch/Else/Finally/Until not being flagged as an error in some cases.

Fixed Try/Catch/Else/Finally not executing Finally if Else returns.

Fixed execution of if-else-if-else-if containing fat arrow functions.

<a id="v2.0.18"></a>
## 2.0.18 - July 6, 2024

Fixed A_Clipboard silently exiting when GetClipboardData returns NULL.

Fixed `a.b[c] := d` to invoke the getter for `a.b` if there is no setter.

<a id="v2.0.17"></a>
## 2.0.17 - June 5, 2024

Implemented an optimization to the WinText parameter by Descolada. [[PR #335](https://github.com/AutoHotkey/AutoHotkey/pull/335)]

Changed UnsetError message to suggest a global declaration instead of appending "(same name as a global)" after the variable name.

Changed VarUnset warning message for consistency with UnsetError.

Fixed the increment/decrement operators to throw UnsetError if the var is unset, not TypeError.

Fixed OwnProps to assign the property name safely in cases where a property deletes itself.

Fixed breakpoints to work in arrow functions under a control flow statement without a block.

Fixed debugger to break at the line of the call when stepping out of a function. (This behavior was added in Revision 31 and broken by v1.1.30.00.)

Stepping out of a function which was called as a new thread now breaks at the line which was interrupted, instead of waiting until the next line is reached.

Fixed debugger to not delete temporary breakpoints which are ignored while evaluating DBGp property_get or context_get.

<a id="v2.0.16"></a>
## 2.0.16 - May 30, 2024

Fixed load-time errors sent to stdout showing incorrect file/line number in some cases.

Fixed ExitApp on load-time error/warning dialogs to use exit code 2.

Fixed locating WindowSpy.ahk in Current User (non-admin) installs.

Fixed DBGp property_get paging items incorrectly (again).

Fixed StrPut failing if Length/Buffer is specified and [MultiByteToWideChar](https://learn.microsoft.com/windows/win32/api/stringapiset/nf-stringapiset-multibytetowidechar) doesn't support the WC_NO_BEST_FIT_CHARS flag for the target codepage.

Fixed Download to attempt anonymous authentication if the server requests client authentication.

<a id="v2.0.15"></a>
## 2.0.15 - May 16, 2024

Fixed DBGp property_get failing to retrieve properties due to incorrect paging (since v2.0.14).

Fixed DBGp property evaluation causing Try without Catch to fail (since v2.0.14).

Fixed \<base\> debugger pseudo-property leaking a reference (since v2.0.14).

<a id="v2.0.14"></a>
## 2.0.14 - May 6, 2024

Fixed the error dialog to handle letter key shortcuts even when text is focused.

Fixed MonthCal W-*n* (number of month) width values to not be affected by DPI scaling.

Fixed Click to not return an integer.

Fixed detection of `key::try {` as an error.

Fixed `:B0*O:XY::Z` to produce XYZ rather than XZ (suppressing Y).

Fixed Send to leave any prior `{modifier Down}` in effect even if the key happens to be physically held down.

Improved the reliability of the script taking focus when a menu popup is shown.

**Debugger improvements:**

Fixed stdout/stderr packets sent during the processing of another command to not corrupt the pending response.

Fixed `property_get -n <exception>.message` and similar.

Fixed corrupted results from property_get when a property returns a temporary object with a string, such as `x.y.z` where `y => {z:"a"}`.

Fixed crashes when an asynchronous command is received during the processing of another command.

Fixed exceptions not being deleted after they are suppressed via property_set.

Fixed `property_get -c 0 -d 0` to allow global variables, as already allowed by `-d 1`.

Fixed property_get paging enumerated items incorrectly.

Improved property_get to support property getters with one parameter (previously only the implicit \__Item property supported this).

Improved property_get to support properties of primitive values. The value must still be contained by a variable or returned from a property.

Improved property_get to allow calling functions with \<=1 parameter.

Improved property_get to support float keys/parameters.

Changed debugger to suppress exceptions during property evaluation.

Changed debugger to ignore errors thrown by \__Enum (treat as no items).

Changed the \<enum\> pseudo-property to require \__Enum. This prevents the object itself from being called as an enumerator.

Small code size optimizations in the debugger.

<a id="v2.0.13"></a>
## 2.0.13 - April 20, 2024

Changed Hotkey function to throw ValueError if Options contains an invalid option.

Fixed InputHook to respect the +S option for Backspace when acting as undo.

Fixed debugger to safely handle property deletion during enumeration.

Fixed OLE clipboard content (e.g. error dialog text) being lost on exit.

Fixed detection of invalid suffix on a hotkey, such as `Hotkey "a pu"`.

Fixed DllCall `AStr*` arg type to copy back only if address changes.

Fixed #Include to correctly "close" any built-in variable it reads (no known impact on real-world scripts).

Fixed WinTitles with two different ahk_id values to yield no match.

<a id="v2.0.12"></a>
## 2.0.12 - March 23, 2024

Fixed Gui GetPos/GetClientPos when Gui has an owner window or +DPIScale.

Fixed Until preventing subfolder recursion in file loops.

Fixed DllCall to throw when arg type is UStr.

Fixed a memory leak occurring for each regex callout.

Fixed Send erroneously releasing a modifier due to a race condition. For example, `~LAlt::Send "{Blind}x"` intermittently released LAlt if some other keyboard hook was installed more recently than the script's own hook.

Fixed icon loader to prefer higher bit-depth when multiple bitmaps of the same size are present.

Fixed SendInput failing to release LCtrl if it had already released RAlt and the layout does not have AltGr.

Fixed key-up hotkeys not firing if the key repeats after modifiers change. For example, `F1::Send "{Ctrl down}"` should allow `F1 up::` to execute when the key is released even though Ctrl is down, but was not allowing it after key-repeat occurs.

Fixed an error message to refer to #HotIf rather than #IfWin. [PR #327]

Fixed OwnProps erroneously skipping properties with optional parameters.

Fixed inconsistent behavior of cloned dynamic properties.

- OwnProps not skipping cloned properties which require parameters.
- Parameters not being passed recursively to parameterless properties (i.e. to allow `a.b[c]` to evaluate as `(a.b)[c]`).

Fixed SysGetIPAddresses causing a Critical Error when the network subsystem is non-functional; e.g. in Windows safe mode.

Changed ControlGetFocus to return 0 when focus can't be determined, such as when a console window is active.

<a id="v2.0.11"></a>
## 2.0.11 - December 23, 2023

Added a workaround for the first shown menu not accepting keyboard input on Windows 10.

Fixed the [Add method (Gui)](lib/Gui.md#Add) to support the ShortDate option for DateTime controls.

Fixed a reference counting error with multi-level function nesting.

Fixed `#include <x>` causing a load-time crash if used inside a function.

Fixed `ListView.Opt("NoSort")`.

Fixed a memory leak occurring when an object with no own properties is cloned.

Fixed #include and FileInstall (non-compiled) to compare file names [ordinally](https://learn.microsoft.com/windows/win32/intl/handling-sorting-in-your-applications#sort-strings-ordinally), not linguistically.

<a id="v2.0.10"></a>
## 2.0.10 - September 24, 2023

Fixed crashing when a named function hotkey is used after #HotIf.

Fixed numeric literals ending with a dot to not cause line continuation.

Fixed pre-increment/decrement to work with chained array indexing.

Fixed OnNotify/OnCommand applying styles only applicable to OnEvent.

Fixed FileExist/DirExist leaking handles when `emptydir\*` is used.

Fixed DirExist leaking handles when only files match.

<a id="v2.0.9"></a>
## 2.0.9 - September 17, 2023

Fixed stacking of hotstrings with the X option.

Fixed debugger not listing local vars if the function is at the bottom of the stack.

Fixed Gui threads to show on the debugger's call stack.

Fixed some combinations of &/ByRef causing stack overflow in ExitApp.

<a id="v2.0.8"></a>
## 2.0.8 - September 11, 2023

Fixed ByRef parameters erroneously assigning the default value to the caller's VarRef if unset.

Fixed some issues affecting suppressed Alt/Ctrl/Shift/Win hotkeys, such as:

- `*LCtrl::` blocked LCtrl from the active window, but sending Alt-key combinations would fail because the system thinks Ctrl is down, and would therefore send WM_KEYDOWN instead of WM_SYSKEYDOWN.
- `*LAlt::` caused the system to forget any prior `{LAlt DownR}`, so a remapping such as `LCtrl::LAlt` would not behave correctly while LAlt is physically down, even though LAlt was suppressed.
- Other potential issues where the system's low-level tracking of a modifier key doesn't match up with the logical state.

Fixed some issues affecting continuation sections:

- Escape sequences in the Join option were translated twice, causing ````` ```` ````` to become one literal `` ` `` instead of two, ``` ``n ``` to become a linefeed, and similar.
- `` `" `` or `` `' `` produced a literal backtick and ended the string, instead of producing a literal quote mark, if the continuation section was enclosed in quotes of the same type and lacked the `` ` `` option.

Optimized the automatic escaping of quote marks and backtick in continuation sections.

Fixed breakpoint_list (debugger) returning duplicates on lines containing fat arrow functions.

Fixed `+BackgroundDefault` failing to override the Gui's BackColor property.

<a id="v2.0.7"></a>
## 2.0.7 - September 2, 2023

Fixed MouseClickDrag to allow X1 and Y1 to be omitted.

Fixed mouse AltTab hotkeys not suppressing execution of a prefix hotkey, such as `1::` for `1 & WheelDown::AltTab`. (Broken by v2.0.4)

Fixed hook hotkeys not recognizing modifiers which are pressed down by SendInput.

Fixed A_AhkPath to not be reliant on the case/format of the command line used to launch the process.

Fixed heap corruption during window searches involving groups. (Broken by v2.0.6)

**Launcher**

Fixed #Requires not being detected if followed by a comment other than `; prefer xxx`. (Broken by v2.0.6)

Fixed syntax detection misinterpreting multi-line auto-replace hotstrings.

**Window Spy**

Changed font to Segoe UI size 9, consistent with Dash.

<a id="v2.0.6"></a>
## 2.0.6 - August 30, 2023

Fixed some ambiguity with COM calls, such as `x.y` acting as `x.y()`.

Fixed breakpoint on control flow statement being "hit" when a fat arrow function on the line below it returns.

Fixed `Default :` to not merge with the line below it. This prevented `Default :` from being used at the end of a Switch block, and caused any subsequent line to take the line number of the Default.

Optimized ProcessGetPath, ProcessSetPriority and ProcessClose to not scan through all processes when given a valid PID, even if access to the process is denied.

Fixed inability of `LWin::Alt` to be used to activate some Alt key combos.

Fixed TypeError thrown by `x is y` to say "Class" rather than "Object".

Fixed WinTitle to support criteria longer than 1023 characters.

Fixed issues when `&ref` is used on different aliases of the same variable.

Fixed optional parameter default expressions (other than simple literal values) preventing the use of assume-global/assume-static.

<a id="v2.0.5"></a>
## 2.0.5 - August 12, 2023

Fixed a memory leak caused by incorrect reference counting when an object is enumerated via COM. [PR# 325]

Fixed internal calls to \__Enum to not call \__Call.

Fixed error messages referring to parameter #65535.

Fixed incorrect IEnumVARIANT return count.

Fixed Download throwing OSError(0) when error should be non-zero.

Fixed LV.Add/Insert/Modify crashing when passed the minimum number of parameters.

Fixed stack traces to exclude calls to \__new for Error subclasses.

<a id="v2.0.4"></a>
## 2.0.4 - July 3, 2023

Changed the Reload button on error/warning dialogs to explicitly close the dialog, even if the current script instance isn't terminated.

Removed an optimization for `return var` which caused the variable to appear blank when accessed within a `finally` block.

Fixed Default (Switch) to allow space before the colon.

Fixed Array.Prototype.RemoveAt to return the removed value when Length is "explicitly omitted" with `unset` or `var?`.

Fixed crashing when a ComObject is passed to a for-loop with only the second variable specified.

**Changes merged from v1.1.37.00 and v1.1.37.01:**

Changed COM method and property calls to pass large integers as VT_I8, not VT_R8 (floating-point), so the original type and precision is retained. Integers in the 32-bit range are still passed as VT_I4.

Added support for multi-variable enumerators (for-loops) with IDispatch-wrapped AutoHotkey objects. Both the script invoking the object and the object itself must be running a supported AutoHotkey version.

Fixed omitted parameters to receive their default values rather than the "optional argument marker" when an AutoHotkey method is called via IDispatch (COM). The reverse translation was already done when *calling* COM methods in previous versions.

Fixed `VerCompare(a, ">" b)` and reduced code size marginally.

Fixed AltTab-related load-time errors to be consistent with other errors.

Fixed errors thrown by a ComObject wrapper not being propagated correctly if it is called via an object/COM.

Fixed the Hotkey GUI control to allow setting the symbols `^`, `!` and `+` as hotkeys.

Fixed the Hotkey control to include modifiers when its value is set to a symbol.

Fixed potential misbehavior of InputHook.KeyOpt() with single chars.

- Option removal potentially not affecting the corresponding SC.
- Options potentially also being applied to sc000.

Fixed a bug with custom combos where a set of hotkeys like `a & b::`, `a::` and `a up::` would fail to suppress the release of `a` if `a::` alone is disabled with #HotIf.

Fixed a bug where a key-down event is correctly suppressed by a hotkey, but sending an additional key-down with SendLevel \> 0 would prevent the subsequent key-up from being suppressed, even if the sent event is ignored due to #InputLevel.

Fixed `a & b up::` not suppressing `b` if `a & b::` is present but disabled by #HotIf.

Fixed an issue with hotkeys not firing due to a race condition. If a modifier hotkey such as `~*RWin::` called Send or GetKeyState too soon, the OS could report that RWin isn't down, so the hook's modifier state would be "corrected" and hotkeys would wrongly fire or fail to fire. This was likely to occur only if another keyboard hook was installed more recently than the script's own hook, since in that case the OS would not update key state until the other hook's thread has resumed and returned.

Fixed hotstrings to use the Last Found Window set by #HotIf.

Fixed an issue where any attempt to reinstall the keyboard or mouse hook would fail if the OS had automatically uninstalled the hook. It is still necessary to meet certain conditions before any such attempt can be made.

Optimized allocation of cached COM property names for built-in IDispatch.

Refactored code to support a build configuration for AutoHotkey as a DLL.

<a id="v2.0.3"></a>
## 2.0.3 - June 19, 2023

Fixed `Hotkey("a", "b")` to use the original function of "b", not "a". [PR #318]

Fixed FileSetAttribute crash when used in a File Reading Loop. [PR #323]

Fixed duplicate Gui control name errors to correctly abort the thread.

Fixed DateTime/MonthCal Range option not applying minimum value.

Fixed `s[x] => x` and other single-line properties starting with "s".

Fixed a bug with deleting a breakpoint on a static line containing `=>`.

Fixed Button control not becoming default when clicked.

Fixed PixelSearch to unset X when pixel is not found.

Fixed hotstring with escape sequence causing next line to be skipped.

Fixed WinTitle ignoring character 1 when "ahk_" is at character 2.

Fixed remapping to utilize right-hand modifier already being down. For example, `+x::+y` will no longer release RShift to press LShift.

Changed error message for `a == b && c()` and similar cases to avoid alluding to legacy `=`.

Improved error message for some cases of unintended line continuation.

Fixed reserved words to be permitted as method names, as documented.

Fixed duplicate OnMessage calls for some keyboard messages.

Fixed inter-referenced closures being deleted prematurely.

Fixed SetFont to permit leading spaces in the Options parameter.

Fixed sending of `{ASC nnnn}`.

Fixed `a.base := a` to throw an error.

Fixed `x.y := unset` causing crashes or undefined behavior.

Fixed GuiControl.Move() to be relative to the GUI's client area even when the GUI is not its parent.

Fixed Menu Add overwriting items which were appended by Menu Insert.

**Launcher**

Run Dash instead of showing the old Welcome page in the documentation, when run without parameters.

Fixed version selection GUI raising an error if Enter is pressed without selecting a version. [PR UX/#4]

Suppress errors when checking whether an absent version can be downloaded.

Fixed absent version download prompt to not show the UAC shield if UAC is disabled.

Fixed issues with #Requires interpretation.

- Support omitting the "v" prefix.
- Support operators (`> >= < <= =`).
- Support a single digit for the version.

**Installation**

Fixed the default installation directory for command-line use.

Renamed the Start menu shortcut from "AutoHotkey" to "AutoHotkey Dash".

Fixed EnableUIAccess when running as SYSTEM.

Fixed EnableUIAccess to verify the private key when selecting a certificate.

**Dash**

Fixed Launch Config GUI to update the "Run as administrator" and "Run with UI access" options.

Fixed Up/Down key handling in the Launch Config GUI.

<a id="v2.0.2"></a>
## 2.0.2 - January 2, 2023

Fixed Short DllCall arg type and undefined behavior for invalid types.

Fixed (non-string) file version number for AutoHotkey binaries.

Fixed parameter type errors to show the correct parameter number.

<a id="v2.0.1"></a>
## 2.0.1 - January 1, 2023

Fixed Func.IsOptional(1) returning 0 in some cases where it shouldn't.

Fixed Gui event handler functions to not drop the Gui parameter when the Gui is its own event sink.

Fixed COM errors to not show "(null)" when no description is available.

Fixed ToolTips intermittently appearing at the wrong position.

Fixed \__Enum(unset) to permit a second variable for Array, Match and Gui.

Fixed #include \<\> error messages to show "Script library" rather than "Function library".

Fixed new threads being unable to prevent a message check with Critical.

Optimized conversion of DllCall type names.

Made some trivial but effective code size optimizations.

<a id="Pre-Release"></a>
## Pre-Release

For a history of changes prior to the v2.0.0 release, refer to the following (but note some changes were superseded):

- [v2.0 release candidates](https://www.autohotkey.com/boards/viewtopic.php?f=24&t=110696)
- [v2.0-beta releases](https://www.autohotkey.com/boards/viewtopic.php?f=24&t=95688)
- [v2.0-alpha releases](https://www.autohotkey.com/boards/viewtopic.php?f=37&t=2120)
