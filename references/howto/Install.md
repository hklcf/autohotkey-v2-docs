# How to Install AutoHotkey

If you have not already downloaded AutoHotkey, you can get it from one of the following locations:

- [https://www.autohotkey.com/](https://www.autohotkey.com/) - multiple options are presented when you click Download.
- [https://www.autohotkey.com/download/](https://www.autohotkey.com/download/) - the main download links are for the current exe installer, but there are also links to the current zip package and archive of older versions.

> **Note:** This tutorial is for AutoHotkey v2.

The main download has a filename like `AutoHotkey_2.0_setup.exe`. Run this file to begin installing AutoHotkey.

If you are not the administrator of your computer, you may need to select the *Current user* option.

Otherwise, the recommended options are already filled in, so just click **Install**.

> **For users of v1:** AutoHotkey v2 includes a launcher which allows multiple versions of AutoHotkey to co-exist while sharing one file extension (`.ahk`). Installing AutoHotkey v1 and v2 into different directories is not necessary and is currently not supported.

If you are installing for *all users*, you will need to provide administrator consent in the standard UAC prompt that appears (in other words, click *Yes*).

If there were no complications, AutoHotkey is now installed!

> Once installation completes, the [Dash](../Program.md#dash) is shown automatically.

<a id="Next_Steps"></a>
## Next Steps

[Using the Program](../Program.md) covers the basics of how to use AutoHotkey.

Consider installing an [editor with AutoHotkey support](../misc/Editors.md) to make editing and testing scripts much easier.

The documentation contains many examples, which you can test out as described in [How to Run Example Code](RunExamples.md).

These tutorials focus on specific common tasks:

- [How to Run Programs](RunPrograms.md)
- [How to Write Hotkeys](WriteHotkeys.md)
- [How to Send Keystrokes](SendKeys.md)

[AutoHotkey Beginner Tutorial by tidbit](../Tutorial.md) covers a range of topics.

<a id="Problems"></a>
## Problems?

If you have problems installing AutoHotkey, please try searching for your issue on [the forum](https://www.autohotkey.com/boards/viewforum.php?f=82) or start a new topic to get help or report the issue.

<a id="Zip_Installer"></a>
## Zip Installer

AutoHotkey can also be installed from the zip download.

1. Open the zip file using File Explorer (no extraction necessary), or extract the contents of the zip file to a temporary directory.
2. Run **Install.cmd**.
3. If you receive a prompt like "The publisher could not be verified. Are you sure...?", click Run.
4. Continue installation as described above.

<a id="Security_Prompts"></a>
## Security Prompts

You may receive one or more security prompts, depending on several factors.

<a id="Web_Browsers"></a>
### Web Browsers

Common web browsers may show a warning like "AutoHotkey_2.0_setup.exe was blocked because it could harm your device." This is a generic warning that applies to any executable file type that isn't "commonly downloaded". In other words, it often happens for new releases of software, until more users have downloaded that particular version.

To keep the download, methods vary between browsers. Look for a menu button near where downloads are shown, or try right clicking on the blocked download.

Sometimes the download might be blocked due to an antivirus false-positive; in that case, see [Antivirus](#Antivirus) below.

The Google Safe Browsing service (also used by other browsers) has been known to show false warnings about AutoHotkey. For details, see [Safe Browsing](https://www.autohotkey.com/download/safe.htm).

<a id="SmartScreen"></a>
### SmartScreen

Microsoft Defender SmartScreen may show a prompt like "Windows protected your PC". This is common for software from open source developers and Independent Software Vendors (ISV), especially soon after the release of each new version. The following blog article by Louis Kessler describes the problem well: [That’s not very Smart of you, Microsoft](https://www.beholdgenealogy.com/blog/?p=3823)

To continue installation, select *More info* and then *Run anyway*.

<a id="Antivirus"></a>
### Antivirus

If your antivirus flags the download as malicious, please refer to the following:

- [FAQ: My antivirus program flagged AutoHotkey or a compiled script as malware. Is it really a virus?](../FAQ.md#Virus)
- [Report False-Positives To Anti-Virus Companies](https://www.autohotkey.com/boards/viewtopic.php?f=17&t=62266&start=80)
- [Antivirus False Positives](https://www.autohotkey.com/download/safe.htm)
