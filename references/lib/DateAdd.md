# DateAdd

Adds or subtracts time from a [date-time](FileSetTime.md#YYYYMMDD) value.

```ahk
Result := DateAdd(DateTime, Time, TimeUnits)
```

<a id="Parameters"></a>
## Parameters

**DateTime**

Type: [String](../Concepts.md#strings)

A date-time stamp in the [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format.

**Time**

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

The amount of time to add, as an integer or floating-point number. Specify a negative number to perform subtraction.

**TimeUnits**

Type: [String](../Concepts.md#strings)

The meaning of the *Time* parameter. *TimeUnits* may be one of the following strings (or just the first letter): Seconds, Minutes, Hours or Days.

<a id="Return_Value"></a>
## Return Value

Type: [String](../Concepts.md#strings)

This function returns a string of digits in the [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format. This string should not be treated as a number, i.e. one should not perform math on it or compare it numerically.

<a id="Remarks"></a>
## Remarks

The built-in variable **A_Now** contains the current local time in [YYYYMMDDHH24MISS](FileSetTime.md#YYYYMMDD) format.

To calculate the amount of time between two timestamps, use [DateDiff](DateDiff.md).

If *DateTime* contains an invalid timestamp or a year prior to 1601, a [ValueError](Error.md#ValueError) is thrown.

<a id="Related"></a>
## Related

[DateDiff](DateDiff.md), [FileGetTime](FileGetTime.md), [FormatTime](FormatTime.md)

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Calculates the date 31 days from now and reports the result in human-readable form.

```ahk
later := DateAdd(A_Now, 31, "days")
MsgBox FormatTime(later)
```
