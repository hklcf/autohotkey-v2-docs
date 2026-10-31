# Labels

<a id="toc"></a>
## Table of Contents

- [Syntax and Usage](#syntax-and-usage)
- [Look-alikes](#look-alikes)
- [Dynamic Labels](#dynamic-labels)
- [Named Loops](#named-loops)
- [Related](#related)

## Syntax and Usage

A label identifies a line of code, and can be used as a [Goto](../lib/Goto.md) target or to [specify a loop](#named-loops) to break out of or continue. A label consist of a [name](../Concepts.md#names) followed by a colon:

```ahk
this_is_a_label:
```

Aside from whitespace and comments, no other code can be written on the same line as a label.

**Names:** Label names are not case-sensitive (for ASCII letters), and may consist of letters, numbers, underscore and non-ASCII characters. For example: *MyListView*, *Menu_File_Open*, and *outer_loop*.

**Scope:** Each function has its own list of local labels. Inside a function, only that function's labels are visible/accessible to the script.

**Target:** The target of a label is the next line of executable code. Executable code includes functions, assignments, [expressions](../Variables.md#Expressions) and [blocks](../lib/Block.md), but not directives, labels, hotkeys or hotstrings. In the following example, `run_notepad_1` and `run_notepad_2` both point at the `Run` line:

```ahk
run_notepad_1:
run_notepad_2:
    Run "notepad"
    return
```

**Execution:** Like directives, labels have no effect when reached during normal execution.

## Look-alikes

Hotkey and hotstring definitions look similar to labels, but are not labels.

[Hotkeys](../Hotkeys.md) consist of a hotkey followed by double-colon.

```ahk
^a::
```

[Hotstrings](../Hotstrings.md) consist of a colon, zero or more [options](../Hotstrings.md#Options), another colon, an abbreviation and double-colon.

```ahk
:*:btw::
```

## Dynamic Labels

In some cases a [variable](../Variables.md) can be used in place of a label name. In such cases, the name stored in the variable is used to locate the target label. However, performance is slightly reduced because the target label must be "looked up" each time rather than only once when the script is first loaded.

## Named Loops

A label can also be used to identify a loop for the [Continue](../lib/Continue.md) and [Break](../lib/Break.md) statements. This allows the script to easily continue or break out of any number of nested loops.

## Related

[Functions](../Functions.md), [IsLabel](../lib/IsLabel.md), [Goto](../lib/Goto.md), [Break](../lib/Break.md), [Continue](../lib/Continue.md)
