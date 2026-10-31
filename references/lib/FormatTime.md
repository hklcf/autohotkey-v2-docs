# FormatTime

Transforms a [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) timestamp into the specified date/time format.

```ahk
String := FormatTime(YYYYMMDDHH24MISS, Format)
```

<a id="Parameters"></a>
## Parameters

**YYYYMMDDHH24MISS**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to the current local date and time. Otherwise, specify all or the leading part of a timestamp in the [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format.

**Format**

Type: [String](../Concepts.md#strings)

If blank or omitted, it defaults to the time followed by the long date, both of which will be formatted according to the current user's locale. For example: 4:55 PM Saturday, November 27, 2004

Otherwise, specify one or more of the date-time formats from the tables below, along with any literal spaces and punctuation in between (commas do not need to be escaped; they can be used normally). In the following example, note that M must be capitalized: M/d/yyyy h:mm tt

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns the transformed version of the specified timestamp.

If *YYYYMMDDHH24MISS* contains a invalid date and/or time portion -- such as February 29th of a non-leap year -- the date and/or time will be omitted from the return value. Although only years between 1601 and 9999 are supported, a formatted time can still be produced for earlier years as long as the time portion is valid.

If *Format* contains more than 2000 characters, an empty string is returned.

<a id="Date_Formats"></a>
## Date Formats (case-sensitive)

| Format | Description |
| --- | --- |
| d | Day of the month without leading zero (1 – 31) |
| dd | Day of the month with leading zero (01 – 31) |
| ddd | Abbreviated name for the day of the week (e.g. Mon) in the current user's language |
| dddd | Full name for the day of the week (e.g. Monday) in the current user's language |
| M | Month without leading zero (1 – 12) |
| MM | Month with leading zero (01 – 12) |
| MMM | Abbreviated month name (e.g. Jan) in the current user's language |
| MMMM | Full month name (e.g. January) in the current user's language |
| y | Year without century, without leading zero (0 – 99) |
| yy | Year without century, with leading zero (00 – 99) |
| yyyy | Year with century. For example: 2005 |
| gg | Period/era string for the current user's locale (blank if none) |

<a id="Time_Formats"></a>
## Time Formats (case-sensitive)

| Format | Description |
| --- | --- |
| h | Hours without leading zero; 12-hour format (1 – 12) |
| hh | Hours with leading zero; 12-hour format (01 – 12) |
| H | Hours without leading zero; 24-hour format (0 – 23) |
| HH | Hours with leading zero; 24-hour format (00 – 23) |
| m | Minutes without leading zero (0 – 59) |
| mm | Minutes with leading zero (00 – 59) |
| s | Seconds without leading zero (0 – 59) |
| ss | Seconds with leading zero (00 – 59) |
| t | Single character time marker, such as A or P (depends on locale) |
| tt | Multi-character time marker, such as AM or PM (depends on locale) |

<a id="Standalone_Formats"></a>
## Standalone Formats

The following formats must be used **alone**; that is, with no other formats or text present in the *Format* parameter. These formats are not case-sensitive.

| Format | Description |
| --- | --- |
| (Blank) | Leave *Format* blank to produce the time followed by the long date. For example, in some locales it might appear as 4:55 PM Saturday, November 27, 2004 |
| Time | Time representation for the current user's locale, such as 5:26 PM |
| ShortDate | Short date representation for the current user's locale, such as 02/29/04 |
| LongDate | Long date representation for the current user's locale, such as Friday, April 23, 2004 |
| YearMonth | Year and month format for the current user's locale, such as February, 2004 |
| YDay | Day of the year without leading zeros (1 – 366) |
| YDay0 | Day of the year with leading zeros (001 – 366) |
| WDay | Day of the week (1 – 7). Sunday is 1. |
| YWeek | The ISO 8601 full year and week number. For example: 200453. If the week containing January 1st has four or more days in the new year, it is considered week 1. Otherwise, it is the last week of the previous year, and the next week is week 1. Consequently, both January 4th and the first Thursday of January are always in week 1. |

<a id="Additional_Options"></a>
## Additional Options

The following options can appear inside the *YYYYMMDDHH24MISS* parameter immediately after the timestamp (if there is no timestamp, they may be used alone). In the following example, note the lack of commas between the last four items:

```ahk
OutputVar := FormatTime("20040228 LSys D1 D4")
```

**R:** Reverse. Have the date come before the time (meaningful only when *Format* is blank).

**Ln:** If this option is *not* present, the current user's locale is used to format the string. To use the system's locale instead, specify LSys. To use a specific locale, specify the letter L followed by a hexadecimal or decimal locale identifier (LCID). For information on how to construct an LCID, search [www.microsoft.com](https://www.microsoft.com) for the following phrase: Locale Identifiers

**Dn:** Date options. Specify for **n** one of the following numbers:

- 0 = Force the default options to be used. This also causes the short date to be in effect.
- 1 = Use short date (meaningful only when *Format* is blank; not compatible with 2 and 8).
- 2 = Use long date (meaningful only when *Format* is blank; not compatible with 1 and 8).
- 4 = Use alternate calendar (if any).
- 8 = Use Year-Month format (meaningful only when *Format* is blank; not compatible with 1 and 2).
- 0x10 = Add marks for left-to-right reading order layout.
- 0x20 = Add marks for right-to-left reading order layout.
- 0x80000000 = Do not obey any overrides the user may have in effect for the system's default date format.
- 0x40000000 = Use the system ANSI code page for string translation instead of the locale's code page.

**Tn:** Time options. Specify for **n** one of the following numbers:

- 0 = Force the default options to be used. This also causes minutes and seconds to be shown.
- 1 = Omit minutes and seconds.
- 2 = Omit seconds.
- 4 = Omit time marker (e.g. AM/PM).
- 8 = Always use 24-hour time rather than 12-hour time.
- 12 = Combination of the above two.
- 0x80000000 = Do not obey any overrides the user may have in effect for the system's default time format.
- 0x40000000 = Use the system ANSI code page for string translation instead of the locale's code page.

> **Note:** Dn and Tn may be repeated to put more than one option into effect, such as this example: `FormatTime("20040228 D2 D4 T1 T8")`

<a id="Remarks"></a>
## Remarks

Letters and numbers that you want to be transcribed literally from *Format* into the final string should be enclosed in single quotes as in this example: `"'Date:' MM/dd/yy 'Time:' hh:mm:ss tt"`.

By contrast, non-alphanumeric characters such as spaces, tabs, linefeeds (\`n), slashes, colons, commas, and other punctuation do not need to be enclosed in single quotes. The exception to this is the single quote character itself: to produce it literally, use four consecutive single quotes (''''), or just two if the quote is already inside an outer pair of quotes.

If *Format* contains date and time elements together, they must not be intermixed. In other words, the string should be dividable into two halves: a time half and a date half. For example, a format string consisting of "hh yyyy mm" would not produce the expected result because it has a date element in between two time elements.

When *Format* contains a numeric day of the month (either d or dd) followed by the full month name (MMMM), the genitive form of the month name is used (if the language has a genitive form).

On a related note, addition, subtraction and comparison of dates and times can be performed with [DateAdd](DateAdd.md) and [DateDiff](DateDiff.md).

<a id="Related"></a>
## Related

To convert in the reverse direction -- that is, *from* a formatted date/time *to* [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format -- see [this forum thread](https://www.autohotkey.com/boards/viewtopic.php?f=6&t=39256).

See also: [Gui DateTime control](GuiControls.md#DateTime), [Format](Format.md), [built-in date and time variables](../Variables.md#date), [FileGetTime](FileGetTime.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Demonstrates different usages.

```ahk
TimeString := FormatTime()
MsgBox "The current time and date (time first) is " TimeString

TimeString := FormatTime("R")
MsgBox "The current time and date (date first) is " TimeString

TimeString := FormatTime(, "Time")
MsgBox "The current time is " TimeString

TimeString := FormatTime("T12", "Time")
MsgBox "The current 24-hour time is " TimeString

TimeString := FormatTime(, "LongDate")
MsgBox "The current date (long format) is " TimeString

TimeString := FormatTime(20050423220133, "dddd MMMM d, yyyy hh:mm:ss tt")
MsgBox "The specified date and time, when formatted, is " TimeString

MsgBox FormatTime(200504, "'Month Name': MMMM`n'Day Name': dddd")

YearWeek := FormatTime(20050101, "YWeek")
MsgBox "January 1st of 2005 is in the following ISO year and week number: " YearWeek
```

<a id="ExFileTime"></a>

**Example:** Changes the date-time stamp of a file.

```ahk
FileName := FileSelect(3,, "Pick a file")
if FileName = "" ; The user didn't pick a file.
    return
FileTime := FileGetTime(FileName)
FileTime := FormatTime(FileTime)   ; Since the last parameter is omitted, the long date and time are retrieved.
MsgBox "The selected file was last modified at " FileTime
```

<a id="ExFormatSec"></a>

**Example:** Converts the specified number of seconds into the corresponding number of hours, minutes, and seconds (hh:mm:ss format).

```ahk
MsgBox FormatSeconds(7384)  ; 7384 = 2 hours + 3 minutes + 4 seconds. It yields: 2:03:04

FormatSeconds(NumberOfSeconds)  ; Convert the specified number of seconds to hh:mm:ss format.
{
    time := 19990101  ; *Midnight* of an arbitrary date.
    time := DateAdd(time, NumberOfSeconds, "Seconds")
    return NumberOfSeconds//3600 ":" FormatTime(time, "mm:ss")
    /*
    ; Unlike the method used above, this would not support more than 24 hours worth of seconds:
    return FormatTime(time, "h:mm:ss")
    */
}
```
