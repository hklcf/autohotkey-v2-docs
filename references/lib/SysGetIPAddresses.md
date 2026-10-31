# SysGetIPAddresses

Returns an array of the system's IPv4 addresses.

```ahk
Addresses := SysGetIPAddresses()
```

<a id="Parameters"></a>
## Parameters

This function has no parameters.

<a id="Return_Value"></a>
## Return Value

Type: [Array](Array.md)

This function returns an array, where each element is an IPv4 address string such as "192.168.0.1".

<a id="Remarks"></a>
## Remarks

Currently only IPv4 is supported.

This function returns only the IP addresses of the computer's network adapters. If the computer is connected to the Internet through a router, this will not include the computer's public (Internet) IP address. To determine the computer's public IP address, use an external web API. For example:

```ahk
whr := ComObject("WinHttp.WinHttpRequest.5.1")
whr.Open("GET", "https://api.ipify.org")
whr.Send()
MsgBox "Public IP address: " whr.ResponseText
```

<a id="Related"></a>
## Related

[A_ComputerName](../Variables.md#ComputerName)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Retrieves and reports the system's IPv4 addresses.

```ahk
addresses := SysGetIPAddresses()
msg := "IP addresses:`n"
for n, address in addresses
    msg .= address "`n"
MsgBox msg
```
