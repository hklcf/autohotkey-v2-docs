# Random

Generates a pseudo-random number.

```ahk
N := Random(A, B)
```

<a id="Parameters"></a>
## Parameters

**A, B**

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

If both are omitted, the default is 0.0 to 1.0. If only one parameter is specified, the other parameter defaults to 0. Otherwise, specify the minimum and maximum number to be generated, in either order.

For integers, the minimum value and maximum value are both included in the set of possible numbers that may be returned. The full range of 64-bit integers is supported.

For floating point numbers, the maximum value is generally excluded.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers) or [Float](../Concepts.md#numbers)

This function returns a pseudo-randomly generated number, which is a number that simulates a true random number but is really a number based on a complicated formula to make determination/guessing of the next number extremely difficult.

If either *A* or *B* is a floating point number or both are omitted, the result will be a floating point number. Otherwise, the result will be an integer.

<a id="Remarks"></a>
## Remarks

All numbers within the specified range have approximately the same probability of being generated.

Although the specified maximum value is excluded by design when returning a floating point number, it may in theory be returned due to floating point rounding errors. This has not been confirmed, and might only be possible if the chosen bounds are larger than 2\*\*53. Also note that since there may be up to 2\*\*53 possible values (such as in the range 0.0 to 1.0), the probability of generating exactly the lower bound is generally very low.

<a id="Examples"></a>
## Examples

<a id="ExBasic"></a>

**Example:** Generates a random integer in the range 1 to 10 and stores it in *N*.

```ahk
N := Random(1, 10)
```

<a id="ExOne"></a>

**Example:** Generates a random integer in the range 0 to 9 and stores it in *N*.

```ahk
N := Random(9)
```

<a id="ExFloat"></a>

**Example:** Generates a random floating point number in the range 0.0 to 1.0 and stores it in *fraction*.

```ahk
fraction := Random(0.0, 1.0)
fraction := Random()  ; Equivalent to the line above.
```
