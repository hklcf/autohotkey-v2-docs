# Changes from v1.0 to v1.1

This document details changes between AutoHotkey v1.0 and v1.1 that may cause scripts to behave differently, and therefore might be important to keep in mind while reading or updating old code. See also: [Changes from v1.1 to v2.0](v2-changes.md).

AutoHotkey v1.1 is also known as "AutoHotkey_L", while AutoHotkey v1.0 was retrospectively labelled "AutoHotkey Basic". Some older versions of AutoHotkey_L used 1.0.\* version numbers, so for clarity, this document refers to the two branches of AutoHotkey by name rather than version number.

<a id="toc"></a>
## Table of Contents

High impact:

- [Certain syntax errors are no longer tolerated](#Syntax_Errors)
- [FileRead may return corrupt binary data](#FileRead)
- [Variable and function names do not allow [, ] or ?](#Names)
- [DPI scaling is enabled by default for GUIs](#DPIScale)

Medium impact:

- [Transform's *Unicode* sub-command is unavailable on Unicode versions](#Transform)
- [AutoHotkey.ahk is launched instead of AutoHotkey.ini](#Default_Script)
- [SetFormat, Integer, **H** is case-sensitive](#SetFormat)
- [A_LastError is modified by more commands](#LastError)
- [MsgBox's handles commas more consistently](#MsgBox)
- [Gui +Owner overrides additional styles](#GuiOwner)
- [~Tilde affects how custom modifier keys work](#Tilde)
- [`x & y::` causes both `x::` and `x up::` to fire when x is released](#ComboUpDown)

Low impact:

- [*If Var is [not] Type* ignores the system locale by default](#IfIs)
- [GroupActivate sets ErrorLevel and GroupAdd's *Label* works differently](#Window_Groups)
- [Run and RunWait interpret *Target* differently](#Run)
- [Control-Z is not interpreted as end-of-file](#ControlZ)
- [A_IsCompiled is always read-only](#IsCompiled)
- [DllCall tries the A or W suffix in more cases](#DllCall)

<a id="Validation"></a>

<a id="Syntax_Errors"></a>
## Syntax Errors

Certain syntax errors which were tolerated by AutoHotkey Basic are not tolerated by AutoHotkey_L. Most such errors can be easily corrected once they are identified. Some errors are detected at load-time, and must be corrected before the script will run at all. Other errors are raised only when specific conditions are met while the script is running.

Error detection in v2.0 is generally more robust, and as there have been numerous changes to usage beyond just error detection and handling, the differences in error detection between v1.0 and v1.1 are not listed here. For those details, refer to the v1.1 documentation.

<a id="FileRead"></a>
## FileRead

[FileRead](lib/FileRead.md#Binary) translates text between code pages in certain common cases and therefore might output corrupt binary data. To avoid this in v2.0, add the `RAW` option or use [FileOpen](lib/FileOpen.md) instead.

<a id="Names"></a>
## Variable and Function Names

The characters `[`, `]` and `?` are reserved for use in [expressions](Language.md#expressions), so are no longer valid in variable names. Consequently, `?` (used in [ternary operations](Variables.md#ternary)) no longer requires a space on either side. Code for v1.0 which uses these characters in a variable name would have a new interpretation in v1.1, and as such might not be detected as an error.

Related: [Operators for Objects](Language.md#operators-for-objects), [Names (Changes from v1.1 to v2.0)](v2-changes.md#names)

<a id="DPIScale"></a>
## DPI Scaling

[DPI scaling](lib/Gui.md#DPIScale) is enabled by default for script GUIs to ensure they scale according to the [system DPI setting](Variables.md#ScreenDPI). If enabled and the system DPI setting is not 96 (100 %), positions and sizes accepted by or returned from Gui methods/properties are not compatible with other functions. To disable DPI scaling, use `MyGui.Opt("-DPIScale")`.

<a id="Transform"></a>
## Transform

Some *Transform* sub-commands are altered or unavailable:

- *Transform Unicode* is available only in ANSI versions of AutoHotkey. To assign Unicode text to the clipboard, use a regular assignment. See also: [StrPut](lib/StrPut.md)/[StrGet](lib/StrGet.md).
- *Transform HTML* supports additional features in Unicode versions of AutoHotkey_L.

*Transform* itself was removed in v2.0.

<a id="Default_Script"></a>
## Default Script

When AutoHotkey_L is launched without specifying a script, an .ahk file is loaded by default instead of an .ini file. The name of this file depends on the filename of the current executable. For more details, see [Script Filename](Scripts.md#defaultfile).

<a id="SetFormat"></a>
## SetFormat, Integer[Fast], H

When an uppercase H is used, hexadecimal digits A-F will also be in uppercase. AutoHotkey Basic always produces lowercase digits.

*SetFormat* itself was removed in v2.0. `Format("0x{:x}", n)` produces lowercase a-f while `Format("0x{:X}", n)` produces uppercase A-F.

<a id="LastError"></a>
## A_LastError

The following commands now set [A_LastError](Variables.md#LastError) to assist with debugging: FileAppend, FileRead, FileReadLine, FileDelete, FileCopy, FileMove, FileGetAttrib/Time/Size/Version, FileSetAttrib/Time, FileCreateDir, RegRead, RegWrite, RegDelete. Using any of these commands causes the previous value of A_LastError to be overwritten.

For v2.0, A_LastError is also set by IniRead, IniWrite and IniDelete.

<a id="MsgBox"></a>
## MsgBox

MsgBox in v1.0 and v1.1 had "smart comma handling" to avoid the need to escape commas in unquoted text. This handling was slightly different between the two versions, and might need to be taken into account in very rare cases while reading v1.0 code. Refer to the v1.1 documentation for details. v2.0 uses expression syntax exclusively and as such has no need for any special handling of commas.

<a id="GuiOwner"></a>
## Gui +Owner

Applying the [+Owner](lib/Gui.md#Owner) option to a Gui also removes the WS_CHILD style and sets the WS_POPUP style. This may break scripts which used `+Owner` to set the parent window of a Gui *after* setting the styles.

<a id="Tilde"></a>
## ~Tilde and Custom Combination Hotkeys

As of v1.1.14, the [tilde prefix](Hotkeys.md#Tilde) affects how a key works when used as a modifier key in a custom combination.

<a id="ComboUpDown"></a>
## Custom Combinations and Down/Up Hotkeys

Except when the tilde prefix is used, if both a key-down and a key-up hotkey are defined for a custom modifier key, they will both fire when the key is released. For example, `x & y::` causes both `x::` and `x up::` to fire when x is released, where previously `x::` never fired.

<a id="IfIs"></a>
## If Var is [not] Type

*If Var is [not] Type* identified certain (possibly locale-specific) non-ASCII characters as alphabetic/uppercase/lowercase by default in v1.0, whereas it did so in v1.1 only if *StringCaseSense Locale* was used. Similarly, the [Is*Type*](lib/Is.md) functions in v2.0 only identify non-ASCII characters as alphabetic if the second parameter is `"Locale"`.

<a id="Window_Groups"></a>
## Window Groups

[GroupActivate](lib/GroupActivate.md) sets ErrorLevel only in v1.1, not v1.0 or v2.0.

[GroupAdd](lib/GroupAdd.md)'s *Label* parameter behaves differently between v1.0 and v1.1, but was removed in v2.0.

<a id="Run"></a>
## Run / RunWait

AutoHotkey_L includes some enhancements to the way the [Run](lib/Run.md) and [RunWait](lib/Run.md) commands interpret the *Target* parameter. This allows some things that didn't work previously, but in some very rare cases, may also affect scripts which were already working in AutoHotkey Basic. The new behavior is as follows:

- If *Target* begins with a quotation mark, everything up to the next quotation mark is considered the action, typically an executable file.
- Otherwise the first substring which ends at a space and is either an existing file or ends in .exe, .bat, .com, .cmd or .hta is considered the action. This allows file types such as .ahk, .vbs or .lnk to accept parameters while still allowing "known" executables such as wordpad.exe to be launched without an absolute path as in previous versions.

<a id="ControlZ"></a>
## Control-Z

[Loop Read](lib/LoopRead.md) and [File.ReadLine](lib/File.md#ReadLine) no longer interpret the character `Ctrl`+`Z` (0x1A) as an end-of-file marker. Any `Ctrl`+`Z`, even one appearing at the very end of the file, is loaded as-is. [FileRead](lib/FileRead.md) already ignored this character, so is not affected by this issue.

<a id="IsCompiled"></a>
## A_IsCompiled

If the script has not been compiled, [A_IsCompiled](Variables.md#IsCompiled) is defined even if the script has not been compiled; its value is `""` in v1.1 and `0` in v2.0. Previously it was left undefined, which meant that assignments such as `A_IsCompiled := 1` were valid if the script hadn't been compiled. Now it is treated as a read-only built-in variable in all cases.

<a id="DllCall"></a>
## DllCall

When the function name given to [DllCall](lib/DllCall.md) cannot be resolved, AutoHotkey_L automatically appends an "A" (ANSI) or "W" (Unicode) to the function name regardless of which DLL was specified. By contrast, AutoHotkey Basic appends the "A" suffix only for functions in User32.dll, Kernel32.dll, ComCtl32.dll, or Gdi32.dll.
