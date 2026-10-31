# Win Functions

Functions for retrieving information about one or more windows or for performing various operations on a window. Click on a function name for details.

| Function | Description |
| --- | --- |
| [WinActivate](WinActivate.md) | Activates the specified window. |
| [WinActivateBottom](WinActivateBottom.md) | Same as [WinActivate](WinActivate.md) except that it activates the bottommost matching window rather than the topmost. |
| [WinActive](WinActive.md) | Checks if the specified window exists and is currently active (foremost). |
| [WinClose](WinClose.md) | Closes the specified window. |
| [WinExist](WinExist.md) | Checks if the specified window exists. |
| [WinGetClass](WinGetClass.md) | Retrieves the specified window's class name. |
| [WinGetClientPos](WinGetClientPos.md) | Retrieves the position and size of the specified window's client area. |
| [WinGetControls](WinGetControls.md) | Returns an array of ClassNNs for all controls in the specified window. |
| [WinGetControlsHwnd](WinGetControlsHwnd.md) | Returns an array of unique IDs (HWNDs) for all controls in the specified window. |
| [WinGetCount](WinGetCount.md) | Returns the number of existing windows that match the specified criteria. |
| [WinGetID](WinGetID.md) | Returns the unique ID (HWND) of the specified window. |
| [WinGetIDLast](WinGetIDLast.md) | Returns the unique ID (HWND) of the last/bottommost window if there is more than one match. |
| [WinGetList](WinGetList.md) | Returns an array of unique IDs (HWNDs) for all existing windows that match the specified criteria. |
| [WinGetMinMax](WinGetMinMax.md) | Returns a non-zero number if the specified window is maximized or minimized. |
| [WinGetPID](WinGetPID.md) | Returns the Process ID (PID) of the specified window. |
| [WinGetPos](WinGetPos.md) | Retrieves the position and size of the specified window. |
| [WinGetProcessName](WinGetProcessName.md) | Returns the name of the process that owns the specified window. |
| [WinGetProcessPath](WinGetProcessPath.md) | Returns the full path and name of the process that owns the specified window. |
| [WinGetStyle<br>WinGetExStyle](WinGetStyle.md) | Returns the style or extended style (respectively) of the specified window. |
| [WinGetText](WinGetText.md) | Retrieves the text from the specified window. |
| [WinGetTitle](WinGetTitle.md) | Retrieves the title of the specified window. |
| [WinGetTransColor](WinGetTransColor.md) | Returns the color that is marked transparent in the specified window. |
| [WinGetTransparent](WinGetTransparent.md) | Returns the degree of transparency of the specified window. |
| [WinHide](WinHide.md) | Hides the specified window. |
| [WinKill](WinKill.md) | Forces the specified window to close. |
| [WinMaximize](WinMaximize.md) | Enlarges the specified window to its maximum size. |
| [WinMinimize](WinMinimize.md) | Collapses the specified window into a button on the task bar. |
| [WinMinimizeAll<br>WinMinimizeAllUndo](WinMinimizeAll.md) | Minimizes or unminimizes all windows. |
| [WinMove](WinMove.md) | Changes the position and/or size of the specified window. |
| [WinMoveBottom](WinMoveBottom.md) | Sends the specified window to the bottom of stack; that is, beneath all other windows. |
| [WinMoveTop](WinMoveTop.md) | Brings the specified window to the top of the stack without explicitly activating it. |
| [WinRedraw](WinRedraw.md) | Redraws the specified window. |
| [WinRestore](WinRestore.md) | Unminimizes or unmaximizes the specified window if it is minimized or maximized. |
| [WinSetAlwaysOnTop](WinSetAlwaysOnTop.md) | Makes the specified window stay on top of all other windows (except other always-on-top windows). |
| [WinSetEnabled](WinSetEnabled.md) | Enables or disables the specified window. |
| [WinSetRegion](WinSetRegion.md) | Changes the shape of the specified window to be the specified rectangle, ellipse, or polygon. |
| [WinSetStyle<br>WinSetExStyle](WinSetStyle.md) | Changes the style or extended style of the specified window, respectively. |
| [WinSetTitle](WinSetTitle.md) | Changes the title of the specified window. |
| [WinSetTransColor](WinSetTransColor.md) | Makes all pixels of the chosen color invisible inside the specified window. |
| [WinSetTransparent](WinSetTransparent.md) | Makes the specified window semi-transparent. |
| [WinShow](WinShow.md) | Unhides the specified window. |
| [WinWait](WinWait.md) | Waits until the specified window exists. |
| [WinWaitActive<br>WinWaitNotActive](WinWaitActive.md) | Waits until the specified window is active or not active. |
| [WinWaitClose](WinWaitClose.md) | Waits until no matching windows can be found. |

<a id="Related"></a>
## Related

[SetWinDelay](SetWinDelay.md), [Control functions](Control.md), [Gui object](Gui.md) (for windows created by the script)
