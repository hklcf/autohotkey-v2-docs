# MenuFromHandle

Retrieves the [Menu or MenuBar object](Menu.md) corresponding to a Win32 menu handle.

```ahk
Menu := MenuFromHandle(Handle)
```

<a id="Parameters"></a>
## Parameters

**Handle**

Type: [Integer](../Concepts.md#numbers)

A handle to a Win32 menu (of type `HMENU`).

<a id="Remarks"></a>
## Remarks

If the handle is invalid or does not correspond to a menu created by this script, the function returns an empty string.

<a id="Related"></a>
## Related

[Win32 Menus](Menu.md#Win32_Menus), [Menu/MenuBar object](Menu.md), [Menu.Handle](Menu.md#Handle), [Menu()](Menu.md#Call)
