# RegExMatch

Determines whether a string contains a pattern (regular expression).

```ahk
FoundPos := RegExMatch(Haystack, NeedleRegEx , &OutputVar, StartingPos)
```

<a id="Parameters"></a>
## Parameters

**Haystack**

Type: [String](../Concepts.md#strings)

The string whose content is searched. This may contain binary zero.

**NeedleRegEx**

Type: [String](../Concepts.md#strings)

The pattern to search for, which is a Perl-compatible regular expression (PCRE). The pattern's [options](../misc/RegEx-QuickRef.md#Options) (if any) must be included at the beginning of the string followed by a close-parenthesis. For example, the pattern i)abc.\*123 would turn on the case-insensitive option and search for "abc", followed by zero or more occurrences of any character, followed by "123". If there are no options, the ")" is optional; for example, )abc is equivalent to abc.

Although *NeedleRegEx* cannot contain binary zero, the pattern `\x00` can be used to match a binary zero within *Haystack*.

**&OutputVar**

Type: [VarRef](../Concepts.md#variable-references)

If omitted, no output variable will be used. Otherwise, specify a reference to the output variable in which to store a [match object](#MatchObject), which can be used to retrieve the position, length and value of the overall match and of each [captured subpattern](../misc/RegEx-QuickRef.md#subpat), if any are present.

If the pattern is not found (that is, if the function returns 0), this variable is made blank.

**StartingPos**

Type: [Integer](../Concepts.md#numbers)

If omitted, it defaults to 1 (the beginning of *Haystack*). Otherwise, specify 2 to start at the second character, 3 to start at the third, and so on. If *StartingPos* is beyond the length of *Haystack*, the search starts at the empty string that lies at the end of *Haystack* (which typically results in no match).

Specify a negative *StartingPos* to start at that position from the right. For example, -1 starts at the last character and -2 starts at the next-to-last character. If *StartingPos* tries to go beyond the left end of *Haystack*, all of *Haystack* is searched.

Specify 0 to start at the end of *Haystack*; i.e. the position to the right of the last character. This can be used with zero-width assertions such as `(?<=a)`.

Regardless of the value of *StartingPos*, the return value is always relative to the first character of *Haystack*. For example, the position of "abc" in "123abc789" is always 4.

<a id="Return_Value"></a>
## Return Value

Type: [Integer](../Concepts.md#numbers)

This function returns the position of the leftmost occurrence of *NeedleRegEx* in the string *Haystack*. Position 1 is the first character. Zero is returned if the pattern is not found.

<a id="Errors"></a>
## Errors

**Syntax errors:** If the pattern contains a syntax error, an [Error](Error.md) is thrown with a message in the following form: *Compile error N at offset M: description*. In that string, *N* is the PCRE error number, *M* is the position of the offending character inside the regular expression, and *description* is the text describing the error.

**Execution errors:** If an error occurs during the *execution* of the regular expression, an [Error](Error.md) is thrown. The *Extra* property of the error object contains the PCRE error number. Although such errors are rare, the ones most likely to occur are "too many possible empty-string matches" (-22), "recursion too deep" (-21), and "reached match limit" (-8). If these happen, try to redesign the pattern to be more restrictive, such as replacing each \* with a ?, +, or a limit like {0,3} wherever feasible.

<a id="Options"></a>
## Options

See [RegEx Quick Reference](../misc/RegEx-QuickRef.md#Options) for options such as i)abc, which turns off case-sensitivity.

<a id="MatchObject"></a>
## Match Object (RegExMatchInfo)

If a match is found, an object containing information about the match is stored in *OutputVar*. This object has the following methods and properties:

**Match.Pos**, **Match.Pos[N]** or **Match.Pos(N)**: Returns the position of the overall match or a captured subpattern.

**Match.Len**, **Match.Len[N]** or **Match.Len(N)**: Returns the length of the overall match or a captured subpattern.

**Match.Name[N]** or **Match.Name(N)**: Returns the name of the given subpattern, if it has one.

**Match.Count:** Returns the overall number of subpatterns (capturing groups), which is also the maximum value for *N*.

**Match.Mark:** Returns the *NAME* of the last encountered (\*MARK:NAME), when applicable.

**Match[]** or **Match[N]**: Returns the overall match or a captured subpattern.

All of the above allow *N* to be any of the following:

- 0 for the overall match.
- The number of a subpattern, even one that also has a name.
- The name of a subpattern.

**Match.N:** Shorthand for **Match["N"]**, where *N* is any unquoted name or number which does not conflict with a defined property (listed above). For example, `match.1` or `match.Year`.

The object also supports enumeration; that is, the [for-loop](For.md) is supported. Alternatively, use `Loop Match.Count`.

<a id="Performance"></a>
## Performance

To search for a simple substring inside a larger string, use [InStr](InStr.md) because it is faster than RegExMatch.

To improve performance, the 100 most recently used regular expressions are kept cached in memory (in compiled form).

The [study option (S)](../misc/RegEx-QuickRef.md#Study) can sometimes improve the performance of a regular expression that is used many times (such as in a loop).

<a id="Remarks"></a>
## Remarks

<a id="NamedSubPat"></a>

A subpattern may be given a name such as the word *Year* in the pattern (?P\<Year\>\d{4}). Such names may consist of up to 32 alphanumeric characters and underscores. Note that named subpatterns are also numbered, so if an [unnamed subpattern](../misc/RegEx-QuickRef.md#subpat) occurs after "Year", it would be stored in `OutputVar[2]`, not `OutputVar[1]`.

Most characters like abc123 can be used literally inside a regular expression. However, any of the characters in the set `\.*?+[{|()^$` must be preceded by a backslash to be seen as literal. For example, \\. is a literal period and \\\ is a literal backslash. Escaping can be avoided by using \Q...\E. For example: \QLiteral Text\E.

Within a regular expression, special characters such as tab and newline can be escaped with either an accent (\`) or a backslash (\\). For example, \`t is the same as \t except when the [x option](../misc/RegEx-QuickRef.md#opt_x) is used.

To learn the basics of regular expressions (or refresh your memory of pattern syntax), see the [RegEx Quick Reference](../misc/RegEx-QuickRef.md).

AutoHotkey's regular expressions are implemented using Perl-compatible Regular Expressions (PCRE) from [www.pcre.org](http://www.pcre.org/).

Within an [expression](../Variables.md#Expressions), `a ~= b` can be used as shorthand for `RegExMatch(a, b)`.

<a id="Related"></a>
## Related

[RegExReplace](RegExReplace.md), [RegEx Quick Reference](../misc/RegEx-QuickRef.md), [Regular Expression Callouts](../misc/RegExCallout.md), [InStr](InStr.md), [SubStr](SubStr.md), [SetTitleMatchMode RegEx](SetTitleMatchMode.md#RegEx), [Global matching and Grep (archived forum link)](https://www.autohotkey.com/board/topic/14817-)

Common sources of text data: [FileRead](FileRead.md), [Download](Download.md), [A_Clipboard](A_Clipboard.md), [GUI Edit controls](GuiControls.md#Edit)

<a id="Examples"></a>
## Examples

For general RegEx examples, see the [RegEx Quick Reference](../misc/RegEx-QuickRef.md).

<a id="ExBasic"></a>

**Example:** Reports 4, which is the position where the match was found.

```ahk
MsgBox RegExMatch("xxxabc123xyz", "abc.*xyz")
```

<a id="ExDollar"></a>

**Example:** Reports 7 because the $ requires the match to be at the end.

```ahk
MsgBox RegExMatch("abc123123", "123$")
```

<a id="ExCaseInsens"></a>

**Example:** Reports 1 because a match was achieved via the case-insensitive option.

```ahk
MsgBox RegExMatch("abc123", "i)^ABC")
```

<a id="ExOutputVar"></a>

**Example:** Reports 1 and stores "XYZ" in SubPat[1].

```ahk
MsgBox RegExMatch("abcXYZ123", "abc(.*)123", &SubPat)
```

<a id="ExStartingPos"></a>

**Example:** Reports 7 instead of 1 due to the starting position 2 instead of 1.

```ahk
MsgBox RegExMatch("abc123abc456", "abc\d+",, 2)
```

<a id="ExObject"></a>

**Example:** Demonstrates the usage of the Match object.

```ahk
FoundPos := RegExMatch("Michiganroad 72", "(.*) (?<nr>\d+)", &SubPat)
MsgBox SubPat.Count ": " SubPat[1] " " SubPat.Name[2] "=" SubPat.nr  ; Displays "2: Michiganroad nr=72"
```

<a id="ExExtension"></a>

**Example:** Retrieves the extension of a file. Note that [SplitPath](SplitPath.md) can also be used for this, which is more reliable.

```ahk
Path := "C:\Foo\Bar\Baz.txt"
RegExMatch(Path, "\w+$", &Extension)
MsgBox Extension[]  ; Reports "txt".
```

<a id="ExDeref"></a>

**Example:** Similar to AutoHotkey v1's Transform Deref, the following function expands variable references and [escape sequences](../misc/EscapeChar.md) contained inside other variables. Furthermore, this example shows how to find all matches in a string rather than stopping at the first match (similar to the g flag in JavaScript's RegEx).

```ahk
var1 := "abc"
var2 := 123
MsgBox Deref("%var1%def%var2%")  ; Reports abcdef123.

Deref(Str)
{
    spo := 1
    out := ""
    while (fpo:=RegexMatch(Str, "(%(.*?)%)|``(.)", &m, spo))
    {
        out .= SubStr(Str, spo, fpo-spo)
        spo := fpo + StrLen(m[0])
        if (m[1])
            out .= %m[2]%
        else switch (m[3])
        {
            case "a": out .= "`a"
            case "b": out .= "`b"
            case "f": out .= "`f"
            case "n": out .= "`n"
            case "r": out .= "`r"
            case "s": out .= "`s"
            case "t": out .= "`t"
            case "v": out .= "`v"
            default: out .= m[3]
        }
    }
    return out SubStr(Str, spo)
}
```
