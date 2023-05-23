---
layout: post
title: "Swift Coding Conventions"
date: 2018-01-26 11:37:05 +0800
comments: true
categories: [ios, swift]
---

Collection of some Swift coding conventions, which will make Swift code more maintainable, more readable.

<!-- more -->

The following is conventions I like or I will likely misuse. For a complete version, go to:

1. [The Official raywenderlich.com Swift Style Guide.](https://github.com/raywenderlich/swift-style-guide/)
1. Swift [API Design Guidelines](https://swift.org/documentation/api-design-guidelines/)

<!-- TOC -->

- [Naming](#naming)
    - [Try to Form Grammatical English Phrases](#try-to-form-grammatical-english-phrases)
    - [Mutating/Nonmutating Methods Naming](#mutatingnonmutating-methods-naming)
    - [Boolean Methods Naming](#boolean-methods-naming)
    - [Protocol Naming](#protocol-naming)
    - [Avoid Abbreviations](#avoid-abbreviations)
    - [Delegates](#delegates)
- [Code Organization](#code-organization)
    - [Protocol Conformance](#protocol-conformance)
- [Classes and Structures](#classes-and-structures)
    - [Use of Self](#use-of-self)
    - [Constants](#constants)
- [Control Flow](#control-flow)
    - [Golden Path](#golden-path)
        - [Failing Guards](#failing-guards)
- [Argument Labels](#argument-labels)

<!-- /TOC -->

<a id="markdown-naming" name="naming"></a>
## Naming

Descriptive and consistent naming makes software easier to read and understand. Use the Swift naming conventions described in the [API Design Guidelines](https://swift.org/documentation/api-design-guidelines/). Some key principles include:

1. prioritizing clarity over brevity
1. striving for fluent usage
1. using uppercase for types (and protocols), lowercase for everything else
1. boolean types should read like assertions
1. choosing good parameter names that serve as documentation
1. generally avoiding abbreviations
1. taking advantage of default parameters
1. labeling closure and tuple parameters
1. verb methods follow the -ed, -ing rule for the non-mutating version
1. noun methods follow the formX rule for the mutating version
1. protocols that describe what something is should read as nouns
1. protocols that describe a capability should end in -able or -ible
1. striving for clarity at the call site

<a id="markdown-try-to-form-grammatical-english-phrases" name="try-to-form-grammatical-english-phrases"></a>
### Try to Form Grammatical English Phrases

**Preferred:**

```
x.insert(y, at: z)          // “x, insert y at z”
x.subViews(havingColor: y)  // “x's subviews having color y”
x.capitalizingNouns()       // “x, capitalizing nouns”
```

**Not Preferred:**

```
x.insert(y, position: z)
x.subViews(color: y)
x.nounCapitalize()
```

<a id="markdown-mutatingnonmutating-methods-naming" name="mutatingnonmutating-methods-naming"></a>
### Mutating/Nonmutating Methods Naming

When the operation is naturally described by a verb, use the verb’s imperative for the mutating method and apply the “ed” or “ing” suffix to name its nonmutating counterpart.

| Mutating	| Nonmutating |
| --- | --- |
| `x.sort()`	| `z = x.sorted()` |
| `x.append(y)`	| `z = x.appending(y)` |

<br>
When the operation is naturally described by a noun, use the noun for the nonmutating method and apply the “form” prefix to name its mutating counterpart.

| Nonmutating	| Mutating |
| --- | --- |
| `x = y.union(z)`	| `y.formUnion(z)` |
| `j = c.successor(i)`	| `c.formSuccessor(&i)` |

<a id="markdown-boolean-methods-naming" name="boolean-methods-naming"></a>
### Boolean Methods Naming

Uses of Boolean methods and properties should read as assertions about the receiver when the use is nonmutating, e.g. `x.isEmpty`, `line1.intersects(line2)`.

<a id="markdown-protocol-naming" name="protocol-naming"></a>
### Protocol Naming

Protocols that describe what something is should read as nouns (e.g. `Collection`).

Protocols that describe a capability should be named using the suffixes -able, -ible, or -ing (e.g. `Equatable`, `ProgressReporting`).

<a id="markdown-avoid-abbreviations" name="avoid-abbreviations"></a>
### Avoid Abbreviations

> The intended meaning for any abbreviation you use should be easily found by a **web search**.

<a id="markdown-delegates" name="delegates"></a>
### Delegates

When creating custom delegate methods, an unnamed first parameter should be the delegate source. (UIKit contains numerous examples of this.)

**Preferred:**

```
func namePickerView(_ namePickerView: NamePickerView, didSelectName name: String)
func namePickerViewShouldReload(_ namePickerView: NamePickerView) -> Bool
```

**Not Preferred:**

```
func didSelectName(namePicker: NamePickerViewController, name: String)
func namePickerShouldReload() -> Bool
```

<a id="markdown-code-organization" name="code-organization"></a>
## Code Organization

Use extensions to organize your code into logical blocks of functionality. Each extension should be set off with a `// MARK: - comment` to keep things well-organized.

<a id="markdown-protocol-conformance" name="protocol-conformance"></a>
### Protocol Conformance

In particular, when adding protocol conformance to a model, prefer adding a separate extension for the protocol methods. This keeps the related methods grouped together with the protocol and can simplify instructions to add a protocol to a class with its associated methods.

**Preferred:**

```
class MyViewController: UIViewController {
  // class stuff here
}

// MARK: - UITableViewDataSource
extension MyViewController: UITableViewDataSource {
  // table view data source methods
}

// MARK: - UIScrollViewDelegate
extension MyViewController: UIScrollViewDelegate {
  // scroll view delegate methods
}
```

**Not Preferred:**

```
class MyViewController: UIViewController, UITableViewDataSource, UIScrollViewDelegate {
  // all methods
}
```

For UIKit view controllers, consider grouping lifecycle, custom accessors, and IBAction in separate class extensions.

<a id="markdown-classes-and-structures" name="classes-and-structures"></a>
## Classes and Structures

<a id="markdown-use-of-self" name="use-of-self"></a>
### Use of Self

For conciseness, avoid using `self` since Swift does not require it to access an object's properties or invoke its methods.

Use `self` only when required by the compiler (in `@escaping` closures, or in initializers to disambiguate properties from arguments). In other words, if it compiles without `self` then omit it.

<a id="markdown-constants" name="constants"></a>
### Constants

Constants are defined using the `let` keyword, and variables with the `var` keyword. Always use `let` instead of `var` if the value of the variable will not change.

> Tip: A good technique is to define everything using `let` and only change it to `var` if the compiler complains!

You can define constants on a type rather than on an instance of that type using type properties. To declare a type property as a constant simply use `static let`. Type properties declared in this way are generally preferred over global constants because they are easier to distinguish from instance properties.

**Preferred:**

```
enum Math {
  static let e = 2.718281828459045235360287
  static let root2 = 1.41421356237309504880168872
}

let hypotenuse = side * Math.root2
```

**Not Preferred:**

```
let e = 2.718281828459045235360287  // pollutes global namespace
let root2 = 1.41421356237309504880168872

let hypotenuse = side * root2 // what is root2?
```

<a id="markdown-control-flow" name="control-flow"></a>
## Control Flow

<a id="markdown-golden-path" name="golden-path"></a>
### Golden Path

When coding with conditionals, the left-hand margin of the code should be the "golden" or "happy" path. That is, don't nest `if` statements. Multiple return statements are OK. The `guard` statement is built for this.

**Preferred:**

```
func computeFFT(context: Context?, inputData: InputData?) throws -> Frequencies {

  guard let context = context else {
    throw FFTError.noContext
  }
  guard let inputData = inputData else {
    throw FFTError.noInputData
  }

  // use context and input to compute the frequencies
  return frequencies
}
```

**Not Preferred:**

```
func computeFFT(context: Context?, inputData: InputData?) throws -> Frequencies {

  if let context = context {
    if let inputData = inputData {
      // use context and input to compute the frequencies

      return frequencies
    } else {
      throw FFTError.noInputData
    }
  } else {
    throw FFTError.noContext
  }
}
```

When multiple optionals are unwrapped either with `guard` or `if let`, minimize nesting by using the compound version when possible. Example:

**Preferred:**

```
guard let number1 = number1,
      let number2 = number2,
      let number3 = number3 else {
  fatalError("impossible")
}
// do something with numbers
```

**Not Preferred:**

```
if let number1 = number1 {
  if let number2 = number2 {
    if let number3 = number3 {
      // do something with numbers
    } else {
      fatalError("impossible")
    }
  } else {
    fatalError("impossible")
  }
} else {
  fatalError("impossible")
}
```

<a id="markdown-failing-guards" name="failing-guards"></a>
#### Failing Guards

`guard` statements are required to exit in some way. Generally, this should be simple one line statement such as `return`, `throw`, `break`, `continue`, and `fatalError()`. Large code blocks should be avoided. If cleanup code is required for multiple exit points, consider using a `defer` block to avoid cleanup code duplication.

<a id="markdown-argument-labels" name="argument-labels"></a>
## Argument Labels

1. Good practice

```
func move(from start: Point, to end: Point)
x.move(from: x, to: y) 
```

1. Omit all labels when arguments can’t be usefully distinguished, e.g. `min(number1, number2)`, `zip(sequence1, sequence2)`.

1. When the first argument forms part of a prepositional phrase, give it an argument label. The argument label should normally begin at the preposition, e.g. `x.removeBoxes(havingLength: 12)`.

    * An exception for the principle above arises when the first two arguments represent parts of a single abstraction. In such cases, begin the argument label after the preposition, to keep the abstraction clear.

**Preferred:**

```
a.moveTo(x: b, y: c)
a.fadeFrom(red: b, green: c, blue: d)
```

**Not Preferred:**

```
a.move(toX: b, y: c)
a.fade(fromRed: b, green: c, blue: d)
```
