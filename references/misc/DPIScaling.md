# DPI Scaling

DPI scaling is a function performed either by the operating system or by the application, to increase the visual size of content proportionate to the "dots per inch" setting of the display. Generally it allows content to appear at the same physical size on systems with different display resolutions, or to at least be usable on very high-resolution displays. Sometimes a user may increase the DPI setting just to make content larger and more comfortable to read.

[A_ScreenDPI](../Variables.md#ScreenDPI) typically returns the DPI setting which the primary display had at the time the script started. This is known as the "system DPI", although processes started at different times can have different values.

There are two types of DPI scaling that relate to AutoHotkey: Gui DPI Scaling and OS DPI Scaling.

<a id="Gui_DPI_Scaling"></a>
## Gui DPI Scaling

Automatic scaling is performed by the Gui and GuiControl methods/properties by default, so that GUI scripts with hard-coded positions, sizes and margins will tend to scale as appropriate on high DPI screens. If this interferes with the script, or if the script will do its own scaling, the automatic scaling can be disabled. For more details, see the [-DPIScale](../lib/Gui.md#DPIScale) option.

<a id="OS_DPI_Scaling"></a>
## OS DPI Scaling

For applications which are not DPI-aware, the operating system automatically scales coordinates passed to and returned from certain system functions. This type of scaling typically affects AutoHotkey in two scenarios:

- Systems with multiple monitors where not all monitors are set to the same scale.
- Whenever the display scale setting differs from what it was when the program started.

The exact scaling done depends on which system function is being called, the DPI awareness of the script and potentially the DPI awareness of the target window.

<a id="Per-Monitor_DPI_Awareness"></a>
### Per-Monitor DPI Awareness

On Windows 8.1 and later, secondary screens can have different DPI settings, and "per-monitor DPI-aware" applications are expected to scale their windows according to the DPI of whichever screen they are currently on, adapting dynamically when the window moves between screens.

For applications which are not per-monitor DPI-aware, the system performs bitmap scaling to allow windows to change sizes when they move between screens, and hides this from the application by reporting coordinates and sizes scaled to the global DPI setting that the application expects to have. For instance, on an 11 inch 4K screen, a GUI designed to display at 96 dpi (100 %) would be almost impossible to use, whereas upscaling it by 200 % would make it usable.

AutoHotkey v2.0 is not designed to perform per-monitor scaling, and therefore has not been marked as per-monitor DPI-aware. This is a boon, for instance, when moving a GUI window between a large external screen with 100 % DPI and a smaller screen with 200 % DPI. However, automatic scaling does have negative implications.

In order of the system's automatic scaling to work, system functions such as [MoveWindow](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-movewindow) and [GetWindowRect](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-getwindowrect) automatically scale the coordinates that they accept or return. When AutoHotkey uses these functions to work with external windows, this often produces unexpected results if the coordinates are not on the primary screen. To add further confusion, some functions scale coordinates based on which screen the script's last active window was displayed on.

<a id="Workarounds"></a>
## Workarounds

On Windows 10 version 1607 and later, the [SetThreadDpiAwarenessContext](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-setthreaddpiawarenesscontext) system function can be used to change the program's DPI awareness setting at runtime. For instance, enabling per-monitor DPI awareness disables the scaling performed by the system, so built-in functions such as [WinMove](../lib/WinMove.md) and [WinGetPos](../lib/WinGetPos.md) will accept or return coordinates in pixels, untouched by DPI scaling. However, if a GUI is sized for a screen with 100 % DPI and then moved to a screen with 200 % DPI, it will not adjust automatically, and may be very hard to use.

To enable per-monitor DPI awareness, call the following function prior to using functions that are normally affected by DPI scaling:

```ahk
DllCall("SetThreadDpiAwarenessContext", "ptr", -3, "ptr")
```

On Windows 10 version 1703 and later, -3 can be replaced with -4 to enable the "Per Monitor v2" mode. This enables scaling of dialogs, menus, tooltips and some other things. However, it also causes the non-client area (title bar) to scale, which may cause the window's client area to be too small unless the script is designed to adjust for it (such as by responding to the [WM_DPICHANGED message](https://learn.microsoft.com/windows/win32/hidpi/wm-dpichanged)). This can be avoided by setting the context to -3 before creating the GUI, but -4 before creating any tooltips, menus or dialogs.

<a id="New_Threads"></a>
### New Threads

When the [window procedure](https://learn.microsoft.com/windows/win32/winmsg/window-procedures) for a window is called by the system, it automatically sets the current DPI awareness context to whichever context was in use when the window was created. The context for a new [script thread](Threads.md) therefore depends on whether it was launched directly from AutoHotkey's message loop or via a window procedure.

- Under typical conditions, posted messages are handled directly from AutoHotkey's message loop, which means that whatever context was already in effect remains in effect. This includes most events which start new script threads, such as hotkeys, hotstrings and timers.
- Script threads corresponding to sent (not posted) messages are started from within the window procedure, which means that the context is always set based on the target window.
- Posted messages are typically dispatched to a window procedure if they are received during a modal message loop. Modal message loops are (for example) used by modal dialog boxes and menus, or while the user is moving a window or performing drag-drop.
- Non-GUI events are associated with the script's [main window](../Program.md#main-window), and therefore receive the program-default DPI awareness context. This is usually as set in the program's manifest, but could be overridden by application compatibility settings.

<a id="Mixed_Settings"></a>
### Mixed Settings

A per-monitor DPI aware GUI window is expected to adjust automatically when it receives a [WM_DPICHANGED message](https://learn.microsoft.com/windows/win32/hidpi/wm-dpichanged). AutoHotkey v2.0 GUI windows do not respond to this message by default. If correctly implementing this type of dynamic scaling is too difficult, a simpler alternative is to temporarily disable per-monitor DPI awareness immediately prior to creating the GUI. For example:

```ahk
; Set the "system DPI aware" mode which is the default in AutoHotkey v2.0:
try dac := DllCall("SetThreadDpiAwarenessContext", 'ptr', -2, 'ptr')
; Create the GUI, which will permanently be "system DPI aware":
MyGui := Gui()
; Restore the previous mode for any subsequent function calls:
IsSet(dac) && DllCall("SetThreadDpiAwarenessContext", 'ptr', dac, 'ptr')
```

The additional lines have no effect if the OS does not support SetThreadDpiAwarenessContext or the program was already in system DPI aware mode.

If only some of the GUI's controls do not scale well, system DPI aware (or DPI unaware) controls can be hosted on a per-monitor DPI aware window. Mixed hosting must be enabled prior to creating the window (requires Windows 10 version 1803 or later):

```ahk
; Create a GUI window which can host less-aware child windows:
try dhb := DllCall("SetThreadDpiHostingBehavior", 'int', 1)
MyGui := Gui()
IsSet(dhb) && DllCall("SetThreadDpiHostingBehavior", 'int', dhb)

; Add a "system DPI aware" control:
try dac := DllCall("SetThreadDpiAwarenessContext", 'ptr', -2, 'ptr')
MyListView := MyGui.AddListView()
IsSet(dac) && DllCall("SetThreadDpiAwarenessContext", 'ptr', dac, 'ptr')
```

<a id="Compiled_Scripts"></a>
### Compiled Scripts

Per-monitor DPI awareness can be enabled process-wide by setting the "dpiAware" and "dpiAwareness" elements in the compiled script's manifest (an embedded XML resource). For details of the proper use and effect of these settings, see [Setting default awareness with the application manifest](https://learn.microsoft.com/windows/win32/hidpi/setting-the-default-dpi-awareness-for-a-process#setting-default-awareness-with-the-application-manifest). For example, the manifest in AutoHotkey v2.0.19 includes the following:

```
<v3:windowsSettings xmlns="http://schemas.microsoft.com/SMI/2005/WindowsSettings"
                 xmlns:ws2="http://schemas.microsoft.com/SMI/2016/WindowsSettings">
  <dpiAware>true</dpiAware>
  <ws2:longPathAware>true</ws2:longPathAware>
</v3:windowsSettings>
```

As explained in the Microsoft documentation, it may be desirable to include both "dpiAware" and "dpiAwareness", which belong to different XML namespaces. As "longPathAware" and "dpiAwareness" belong to the same namespace, the XML can be optimized by moving some things around. The following enables per-monitor DPI awareness (v2 if available, otherwise v1):

```
<v3:windowsSettings xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">
  <dpiAware xmlns="http://schemas.microsoft.com/SMI/2005/WindowsSettings">true/pm</dpiAware>
  <dpiAwareness>PerMonitorV2</dpiAwareness>
  <longPathAware>true</longPathAware>
</v3:windowsSettings>
```

<a id="Compatibility_Settings"></a>
### Compatibility Settings

The program's default DPI awareness can be overridden by compatibility settings, which can be set in the properties of an AutoHotkey executable file, in the properties of a shortcut file, or by setting the `__COMPAT_LAYER` environment variable to include the keyword `DpiUnaware` or the keyword `HighDpiAware`. Enabling DPI awareness using this method may have unwanted effects; in particular, MsgBox windows may not adjust automatically when moved between screens.
