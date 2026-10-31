# Math Functions

Functions for performing various mathematical operations such as rounding, exponentiation, squaring, etc.

<a id="toc"></a>
## Table of Contents

- [General Math](#General):
    - [Abs](#Abs): Returns the absolute value of a number.
    - [Ceil](#Ceil): Returns a number rounded up to the nearest integer.
    - [Exp](#Exp): Returns the result of raising e to the *N*th power.
    - [Floor](#Floor): Returns a number rounded down to the nearest integer.
    - [Log](#Log): Returns the logarithm (base 10) of a number.
    - [Ln](#Ln): Returns the natural logarithm (base e) of a number.
    - [Max](#Max): Returns the highest number from a set of numbers.
    - [Min](#Min): Returns the lowest number from a set of numbers.
    - [Mod](#Mod): Modulo. Returns the remainder of a division.
    - [Round](#Round): Returns a number rounded to *N* decimal places.
    - [Sqrt](#Sqrt): Returns the square root of a number.
- [Trigonometry](#Trigonometry):
    - [Sin](#Sin): Returns the trigonometric sine of a number.
    - [Cos](#Cos): Returns the trigonometric cosine of a number.
    - [Tan](#Tan): Returns the trigonometric tangent of a number.
    - [ASin](#ASin): Returns the arcsine of a number in radians.
    - [ACos](#ACos): Returns the arccosine of a number in radians.
    - [ATan](#ATan): Returns the arctangent of a number in radians.
- [Error-handling](#Errors)

<a id="General"></a>
## General Math

<a id="Abs"></a>
### Abs

Returns the absolute value of the specified number.

```ahk
Value := Abs(Number)
```

The return value is the same type as *Number* (integer or floating point).

```ahk
MsgBox Abs(-1.2) ; Returns 1.2
```

<a id="Ceil"></a>
### Ceil

Returns the specified number rounded up to the nearest integer (without any .00 suffix).

```ahk
Value := Ceil(Number)
```

```ahk
MsgBox Ceil(1.2)  ; Returns 2
MsgBox Ceil(-1.2) ; Returns -1
```

<a id="Exp"></a>
### Exp

Returns the result of raising e (which is approximately 2.71828182845905) to the *N*th power.

```ahk
Value := Exp(N)
```

*N* may be negative and may contain a decimal point. To raise numbers other than e to a power, use the [\*\* operator](../Variables.md#pow).

```ahk
MsgBox Exp(1.2) ; Returns 3.320117
```

<a id="Floor"></a>
### Floor

Returns the specified number rounded down to the nearest integer (without any .00 suffix).

```ahk
Value := Floor(Number)
```

```ahk
MsgBox Floor(1.2)  ; Returns 1
MsgBox Floor(-1.2) ; Returns -2
```

<a id="Log"></a>
### Log

Returns the logarithm (base 10) of the specified number.

```ahk
Value := Log(Number)
```

The result is a floating-point number. If *Number* is negative, a [ValueError](Error.md#ValueError) is thrown.

```ahk
MsgBox Log(1.2) ; Returns 0.079181
```

<a id="Ln"></a>
### Ln

Returns the natural logarithm (base e) of the specified number.

```ahk
Value := Ln(Number)
```

The result is a floating-point number. If *Number* is negative, a [ValueError](Error.md#ValueError) is thrown.

```ahk
MsgBox Ln(1.2) ; Returns 0.182322
```

<a id="Max"></a>
### Max

Returns the highest number from a set of numbers.

```ahk
Number := Max(Number1 , Number2, ...)
```

```ahk
MsgBox Max(2.11, -2, 0) ; Returns 2.11
```

You can also specify a [variadic parameter](../Functions.md#Variadic) to pass an [array](Array.md) of numbers. For example:

```ahk
Numbers := [1, 2, 3, 4]
MsgBox Max(Numbers*) ; Returns 4
```

<a id="Min"></a>
### Min

Returns the lowest number from a set of numbers.

```ahk
Number := Min(Number1 , Number2, ...)
```

```ahk
MsgBox Min(2.11, -2, 0) ; Returns -2
```

You can also specify a [variadic parameter](../Functions.md#Variadic) to pass an [array](Array.md) of numbers. For example:

```ahk
Numbers := [1, 2, 3, 4]
MsgBox Min(Numbers*) ; Returns 1
```

<a id="Mod"></a>
### Mod

Modulo. Returns the remainder of a number (dividend) divided by another number (divisor).

```ahk
Value := Mod(Dividend, Divisor)
```

The sign of the result is always the same as the sign of the first parameter. If either input is a floating point number, the result is also a floating point number. If the second parameter is zero, a [ZeroDivisionError](Error.md#ZeroDivisionError) is thrown.

```ahk
MsgBox Mod(7.5, 2) ; Returns 1.5 (2 x 3 + 1.5)
```

<a id="Round"></a>
### Round

Returns the specified number rounded to *N* decimal places.

```ahk
Value := Round(Number , N)
```

If *N* is omitted or 0, *Number* is rounded to the nearest integer:

```ahk
MsgBox Round(3.14)    ; Returns 3
```

If *N* is positive, *Number* is rounded to *N* decimal places:

```ahk
MsgBox Round(3.14, 1) ; Returns 3.1
```

If *N* is negative, *Number* is rounded by *N* digits to the left of the decimal point:

```ahk
MsgBox Round(345, -1) ; Returns 350
MsgBox Round(345, -2) ; Returns 300
```

The result is an integer if *N* is omitted or less than 1. Otherwise, the result is a numeric string with exactly *N* decimal places. If a pure number is needed, simply perform another math operation on Round's return value; for example: `Round(3.333, 1)+0`.

<a id="Sqrt"></a>
### Sqrt

Returns the square root of the specified number.

```ahk
Value := Sqrt(Number)
```

The result is a floating-point number. If *Number* is negative, a [ValueError](Error.md#ValueError) is thrown.

```ahk
MsgBox Sqrt(16) ; Returns 4
```

<a id="Trigonometry"></a>
## Trigonometry

> **Note:** To convert a radians value to degrees, multiply it by 180/pi (approximately 57.29578). To convert a degrees value to radians, multiply it by pi/180 (approximately 0.01745329252). The value of pi (approximately 3.141592653589793) is 4 times the arctangent of 1.

<a id="Sin"></a>
### Sin

Returns the trigonometric sine of the specified number.

```ahk
Value := Sin(Number)
```

*Number* must be expressed in radians.

```ahk
MsgBox Sin(1.2) ; Returns 0.932039
```

<a id="Cos"></a>
### Cos

Returns the trigonometric cosine of the specified number.

```ahk
Value := Cos(Number)
```

*Number* must be expressed in radians.

```ahk
MsgBox Cos(1.2) ; Returns 0.362358
```

<a id="Tan"></a>
### Tan

Returns the trigonometric tangent of the specified number.

```ahk
Value := Tan(Number)
```

*Number* must be expressed in radians.

```ahk
MsgBox Tan(1.2) ; Returns 2.572152
```

<a id="ASin"></a>
### ASin

Returns the arcsine (the number whose sine is the specified number) in radians.

```ahk
Value := ASin(Number)
```

If *Number* is less than -1 or greater than 1, a [ValueError](Error.md#ValueError) is thrown.

```ahk
MsgBox ASin(0.2) ; Returns 0.201358
```

<a id="ACos"></a>
### ACos

Returns the arccosine (the number whose cosine is the specified number) in radians.

```ahk
Value := ACos(Number)
```

If *Number* is less than -1 or greater than 1, a [ValueError](Error.md#ValueError) is thrown.

```ahk
MsgBox ACos(0.2) ; Returns 1.369438
```

<a id="ATan"></a>
### ATan

Returns the arctangent (the number whose tangent is the specified number) in radians.

```ahk
Value := ATan(Number)
```

```ahk
MsgBox ATan(1.2) ; Returns 0.876058
```

<a id="Errors"></a>
## Error-Handling

These functions throw an exception if any incoming parameters are non-numeric or an invalid operation (such as divide by zero) is attempted.
