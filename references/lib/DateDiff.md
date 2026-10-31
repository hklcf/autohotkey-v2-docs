# DateDiff

Compares two [date-time](FileSetTime.md#YYYYMMDD) values and returns the difference.

```ahk
Result := DateDiff(DateTime1, DateTime2, TimeUnits)
```

<a id="Parameters"></a>
## Parameters

**DateTime1, DateTime2**

Type: [String](../Concepts.md#strings)

Date-time stamps in the [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format.

If either is an empty string, the current local date and time ([A_Now](../Variables.md#Now)) is used.

**TimeUnits**

Type: [String](../Concepts.md#strings)

Units to measure the difference in. *TimeUnits* may be one of the following strings (or just the first letter): Seconds, Minutes, Hours or Days.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the difference between the two timestamps, in the units specified by *TimeUnits*. If *DateTime1* is earlier than *DateTime2*, a negative number is returned.

The result is always rounded <u>down</u> to the nearest integer. For example, if the actual difference between two timestamps is 1.999 days, it will be reported as 1 day. If higher precision is needed, specify Seconds for *TimeUnits* and divide the result by 60.0, 3600.0, or 86400.0.

<a id="Remarks"></a>
## Remarks

The built-in variable **A_Now** contains the current local time in [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format.

To precisely determine the elapsed time between two events, use the [A_TickCount method](../Variables.md#TickCount) because it provides millisecond precision.

To add or subtract a certain number of seconds, minutes, hours, or days from a timestamp, use [DateAdd](DateAdd.md) (subtraction is achieved by adding a negative number).

If *DateTime* contains an invalid timestamp or a year prior to 1601, a [ValueError](Error.md#ValueError) is thrown.

<a id="Related"></a>
## Related

[DateAdd](DateAdd.md), [FileGetTime](FileGetTime.md), [FormatTime](FormatTime.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Calculates the number of days between two timestamps and reports the result.

```ahk
var1 := "20050126"
var2 := "20040126"
MsgBox DateDiff(var1, var2, "days")  ; The answer will be 366 since 2004 is a leap year.
```
