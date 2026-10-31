# Script Performance

The following functions may affect performance depending on the nature of the script: [SendMode](../lib/SendMode.md), [SetKeyDelay](../lib/SetKeyDelay.md), [SetMouseDelay](../lib/SetMouseDelay.md), [SetWinDelay](../lib/SetWinDelay.md), [SetControlDelay](../lib/SetControlDelay.md), and [SetDefaultMouseSpeed](../lib/SetDefaultMouseSpeed.md).

<a id="Built-in_Performance_Features"></a>
## Built-in Performance Features

Each script is semi-compiled while it is being loaded and syntax-checked. In addition to detecting some errors early, this also greatly improves runtime performance.

Here are some of the technical details of the optimization process (semi-compiling):

- [Loops](../lib/Loop.md), [blocks](../lib/Block.md), [IFs](../lib/If.md), [ELSEs](../lib/Else.md) and other [control flow statements](../Language.md#control-flow) are given the memory addresses of their related jump-points in the script.
- Each statement name is replaced by an address in a jump table.
- Each [expression](../Variables.md#Expressions) is tokenized and converted from infix to postfix.
- Each reference to a [variable](../Variables.md) or [function](../Functions.md) is resolved to a memory address, unless it is [dynamic](../Variables.md#deref).
- Literal integers in expressions are replaced with binary integers.
- The destination of each [Goto](../lib/Goto.md) is resolved to a memory address unless it is a variable.

In addition, during script execution, binary numbers are cached in variables to avoid conversions to/from strings.
