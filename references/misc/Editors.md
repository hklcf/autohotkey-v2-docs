# Editors with AutoHotkey Support

Any text editor can be used to edit an AutoHotkey script, but editors which are (or can be configured to be) more AutoHotkey-aware tend to make reading, editing and testing scripts much easier. AutoHotkey-aware editors may provide:

- Syntax highlighting, like what is used in this documentation. With syntax highlighting, words, symbols and segments of code are color-coded to indicate their meaning. For instance, literal text, comments and variable names are displayed in different colors.
- Auto-complete, which typically offers a list of suggestions when you start typing the name of a known function or variable.
- Calltips may show you what the parameters are for a function while you are writing code to call the function.
- [Interactive debugging](../Scripts.md#idebug), such as to step through the script line by line and inspect variables at each step, or to view and modify variables or objects, beyond what [ListVars](../lib/ListVars.md) allows.

Recommendations:

- SciTE4AutoHotkey is simple to install, relatively light-weight, and fully supports AutoHotkey v1 and v2 without further configuration.
- VS Code (plus extensions) provides an even higher level of support and a wider range of features, but can be heavy on resources.

<a id="SciTE4AutoHotkey"></a>
## SciTE4AutoHotkey

SciTE4AutoHotkey is a custom version of the text editor known as SciTE. Its features include:

- Syntax highlighting
- Auto-complete
- Calltips
- Smart auto-indent
- Code folding
- Interactive debugging
- Running the script by pressing a hotkey
- Other tools for AutoHotkey scripting

SciTE4AutoHotkey can be found here: [https://www.autohotkey.com/scite4ahk/](https://www.autohotkey.com/scite4ahk/)

<a id="Visual_Studio_Code_VS_Code"></a>
## Visual Studio Code (VS Code)

Visual Studio Code can be configured with a high level of support for AutoHotkey by installing extensions.

[AutoHotkey2 Language Support](https://marketplace.visualstudio.com/items?itemName=thqby.vscode-autohotkey2-lsp) provides many features, including:

- Syntax highlighting
- Auto-complete
- Calltips
- Smart auto-indent
- Code folding
- Running the script by pressing a hotkey
- Real-time diagnostics (detecting common errors)
- Formatting/tidying code

Additional notes:

- This extension only supports AutoHotkey v2, but can also detect v1 scripts and automatically switch over to a v1 extension if one is installed.
- This extension can also be used with other editors, such as **vim**, **neovim** and **Sublime Text 4**. For details, see [Use in other editors](https://github.com/thqby/vscode-autohotkey2-lsp#use-in-other-editors). However, VS Code likely provides the best experience, with easiest setup.

[vscode-autohotkey-debug](https://marketplace.visualstudio.com/items?itemName=zero-plusplus.vscode-autohotkey-debug) provides support for interactive debugging of v1 and v2 scripts.

<a id="Notepad++"></a>
## Notepad++

Notepad++ can be configured to support the following features:

- Syntax highlighting
- Auto-complete
- Code folding
- Running the script by pressing a hotkey

See [Setup Notepad++ for AutoHotkey](https://www.autohotkey.com/boards/viewtopic.php?f=88&t=50) for instructions.

<a id="Notepad4"></a>
## Notepad4

Notepad4 supports the following for AutoHotkey v2 by default:

- Syntax highlighting
- Auto-complete
- Auto-indent
- Code folding
- Running the script by pressing a hotkey

It is available here: [https://github.com/zufuliu/notepad4](https://github.com/zufuliu/notepad4)

<a id="Others_editors"></a>
## Others editors

For help finding or configuring other editors, try the [Editors sub-forum](https://www.autohotkey.com/boards/viewforum.php?f=60).

To get an editor added to this page, post in the [Suggestions sub-forum](https://www.autohotkey.com/boards/viewforum.php?f=86) or open an Issue or Pull Request at [GitHub](https://github.com/AutoHotkey/AutoHotkeyDocs/).
