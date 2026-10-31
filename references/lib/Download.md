# Download

Downloads a file from the Internet.

```ahk
Download URL, Filename
```

<a id="Parameters"></a>
## Parameters

**URL**

Type: [String](../Concepts.md#strings)

URL of the file to download. For example, `"https://someorg.org"` might retrieve the welcome page for that organization.

**Filename**

Type: [String](../Concepts.md#strings)

Specify the name of the file to be created locally, which is assumed to be in [A_WorkingDir](../Variables.md#WorkingDir) if an absolute path isn't specified. Any existing file will be <u>overwritten</u> by the new file.

This function downloads to a file. To download to a variable instead, see the [example](#ExWHR) below.

<a id="Error_Handling"></a>
## Error Handling

An exception is thrown on failure.

<a id="Remarks"></a>
## Remarks

The download might appear to succeed even when the remote file doesn't exist. This is because many web servers send an error page instead of the missing file. This error page is what will be saved in place of *Filename*.

Firewalls or the presence of multiple network adapters may cause this function to fail. Also, some websites may block such downloads.

**Caching:** By default, the URL is retrieved directly from the remote server (that is, never from Internet Explorer's cache). To permit caching, precede the URL with \*0 followed by a space; for example: `"*0 https://someorg.org"`. The zero following the asterisk may be replaced by any valid dwFlags number; for details, search [www.microsoft.com](https://www.microsoft.com) for InternetOpenUrl.

**Proxies:** If a proxy server has been configured in Microsoft Internet Explorer's settings, it will be used.

**FTP and Gopher** URLS are also supported. For example:

```ahk
Download "ftp://example.com/home/My File.zip", "C:\My Folder\My File.zip"  ; Log in anonymously.
Download "ftp://user:pass@example.com:21/home/My File.zip", "C:\My Folder\My File.zip"  ; Log in as a specific user.
Download "ftp://user:pass@example.com/My Directory", "C:\Dir Listing.html"  ; Gets a directory listing in HTML format.
```

<a id="Related"></a>
## Related

[FileRead](FileRead.md), [FileCopy](FileCopy.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Downloads a text file.

```ahk
Download "https://www.autohotkey.com/download/2.0/version.txt", "C:\AutoHotkey Latest Version.txt"
```

<a id="ExZip"></a>

**Example:** Downloads a zip file.

```ahk
Download "https://someorg.org/archive.zip", "C:\SomeOrg's Archive.zip"
```

<a id="ExWHR"></a>

**Example:** Downloads text to a variable.

```ahk
whr := ComObject("WinHttp.WinHttpRequest.5.1")
whr.Open("GET", "https://www.autohotkey.com/download/2.0/version.txt", true)
whr.Send()
; Using 'true' above and the call below allows the script to remain responsive.
whr.WaitForResponse()
version := whr.ResponseText
MsgBox version
```

<a id="ExXHR"></a>

**Example:** Makes an asynchronous HTTP request.

```ahk
req := ComObject("Msxml2.XMLHTTP")
; Open a request with async enabled.
req.open("GET", "https://www.autohotkey.com/download/2.0/version.txt", true)
; Set our callback function.
req.onreadystatechange := Ready
; Send the request.  Ready() will be called when it's complete.
req.send()
/*
; If you're going to wait, there's no need for onreadystatechange.
; Setting async=true and waiting like this allows the script to remain
; responsive while the download is taking place, whereas async=false
; will make the script unresponsive.
while req.readyState != 4
    sleep 100
*/
Persistent

Ready() {
    if (req.readyState != 4)  ; Not done yet.
        return
    if (req.status == 200) ; OK.
        MsgBox "Latest AutoHotkey version: " req.responseText
    else
        MsgBox "Status " req.status,, 16
    ExitApp
}
```
