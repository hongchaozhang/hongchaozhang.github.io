---
layout: post
title: "Swift Closure"
date: 2019-06-04 17:24:47 +0800
comments: true
categories: [ios, swift]
---

<!-- more -->

- [Function与Closure的关系：](#function与closure的关系)
- [用Closure初始化一个变量](#用closure初始化一个变量)
- [Closure的语法糖：](#closure的语法糖)
- [Closure与内存管理、内存泄漏](#closure与内存管理内存泄漏)
  - [Capture List的定义](#capture-list的定义)
  - [Weak and Unowned References](#weak-and-unowned-references)
- [Closure捕获变量](#closure捕获变量)

[Functional swift: All about Closures](https://medium.com/@abhimuralidharan/functional-swift-all-about-closures-310bc8af31dd)

这篇全面详细易懂地介绍了Swift的Closure，包括

* Closure的语法，包括一些简化写法，如Trailing Closures
* Closure与Function的区别
* Closure与内存管理、内存泄漏，如capture list的使用，weak与unowned的区别
* Functions和closures都是引用类型，不是值类型

也可以看[官方文档Closures](https://docs.swift.org/swift-book/LanguageGuide/Closures.html)，但是官方文档没有上面的文章详细。

下面有选择地记录一下。

<a id="markdown-function与closure的关系" name="function与closure的关系"></a>
## Function与Closure的关系：

参考[官方文档Closures](https://docs.swift.org/swift-book/LanguageGuide/Closures.html)里面的三句话理解一下：

> * Global functions are closures that have a name and do not capture any values.
> * Nested functions are closures that have a name and can capture values from their enclosing function.
> * Closure expressions are unnamed closures written in a lightweight syntax that can capture values from their surrounding context.

还有一点很重要：**Closures and functions are first class types in swift**。

> Functions and closures are first-class citizens in Swift because you can treat then like a normal value. For example, you can：
>
> * assign a function/closure to a local variable .
> * pass a function/closure as an argument .
> * return a function/closure .

<a id="markdown-用closure初始化一个变量" name="用closure初始化一个变量"></a>
## 用Closure初始化一个变量

```
let setupViewUsingClosure: UIView = {
    let view = UIView()
    view.backgroundColor = .green
    return view
}() //IMPORTANT!!! I have added () at the end.
```

<a id="markdown-closure的语法糖" name="closure的语法糖"></a>
## Closure的语法糖：

[官方文档Closures](https://docs.swift.org/swift-book/LanguageGuide/Closures.html)有个总的说明：

> Swift’s closure expressions have a clean, clear style, with optimizations that encourage brief, clutter-free syntax in common scenarios. These optimizations include:
>
> * Inferring parameter and return value types from context
> * Implicit returns from single-expression closures
> * Shorthand argument names
> * Trailing closure syntax

当你第一次看到这个写法的时候肯定很疑惑：参数、类型、函数调用时的括号都跑哪去了？

```
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
rreversedNames = names.sorted { $0 > $1 }
```

理解了上面几点，就可以明白为什么可以这么写，下面让我们一步步看清楚。

Closure的定义如下：

> Closure expressions are unnamed closures written in a lightweight syntax that can capture values from their surrounding context.
>
> ```
> { (params) -> returnType in
>     statements
> }
> ```

举个具体的例子：

```
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
})
```

因为：

> * **Inferring parameter and return value types from context**
>
> Because the sorting closure is passed as an argument to a method, Swift can infer the types of its parameters and the type of the value it returns.

所以，上面的代码可以写为：

```
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
reversedNames = names.sorted(by: { s1, s2 in return s1 > s2 } )
```

再因为：

> * **Implicit returns from single-expression closures**
>
> Single-expression closures can implicitly return the result of their single expression by omitting the return keyword from their declaration.

所以，代码继续改为：

```
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
reversedNames = names.sorted(by: { s1, s2 in s1 > s2 } )
```

再因为：

> * **Shorthand argument names**
>
> Swift automatically provides shorthand argument names to inline closures, which can be used to refer to the values of the closure’s arguments by the names $0, $1, $2, and so on.

代码继续改为：

```
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
rreversedNames = names.sorted(by: { $0 > $1 } )
```

再因为：

> * **Trailing closure syntax**
>
> If you need to pass a closure expression to a function as the function’s final argument and the closure expression is long, it can be useful to write it as a trailing closure instead. A trailing closure is written after the function call’s parentheses, even though it is still an argument to the function. When you use the trailing closure syntax, you don’t write the argument label for the closure as part of the function call.

代码就可以写成：

```
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
rreversedNames = names.sorted { $0 > $1 }
```

<a id="markdown-closure与内存管理内存泄漏" name="closure与内存管理内存泄漏"></a>
## Closure与内存管理、内存泄漏

Closure带来的循环引用和内存泄漏，主要通过Capture List来解决：

> You resolve a strong reference cycle between a closure and a class instance by defining a capture list as part of the closure’s definition. A capture list defines the rules to use when capturing one or more reference types within the closure’s body. 

详细内容参考[Resolving Strong Reference Cycles for Closures](https://docs.swift.org/swift-book/LanguageGuide/AutomaticReferenceCounting.html#ID56)。下面摘要一下。

<a id="markdown-capture-list的定义" name="capture-list的定义"></a>
### Capture List的定义

> Each item in a capture list is a pairing of the weak or unowned keyword with a reference to a class instance (such as self) or a variable initialized with some value (such as delegate = self.delegate!). These pairings are written within a pair of square braces, separated by commas.

Place the capture list before a closure’s parameter list and return type if they are provided:

```
lazy var someClosure: (Int, String) -> String = {
    [unowned self, weak delegate = self.delegate!] (index: Int, stringToProcess: String) -> String in
    // closure body goes here
}
```

<a id="markdown-weak-and-unowned-references" name="weak-and-unowned-references"></a>
### Weak and Unowned References

> Define a capture in a closure as an unowned reference when the closure and the instance it captures will always refer to each other, and will always be deallocated at the same time.
> 
> Conversely, define a capture as a weak reference when the captured reference may become nil at some point in the future. Weak references are always of an optional type, and automatically become nil when the instance they reference is deallocated. This enables you to check for their existence within the closure’s body.
> 
> NOTE: If the captured reference will never become nil, it should always be captured as an unowned reference, rather than a weak reference.

关于unowned的另一个解释更清楚：

> Like a weak reference, an unowned reference does not keep a strong hold on the instance it refers to. Unlike a weak reference, however, an unowned reference is used when the other instance has the same lifetime or a longer lifetime.

<a id="markdown-closure捕获变量" name="closure捕获变量"></a>
## Closure捕获变量

> Closures can capture and store references to any constants and variables from the context in which they are defined. This is known as closing over those constants and variables.

比如：

```
// capturing values
var i = 0
var closureArray = [()->()]()
for _ in 1...5 {
    closureArray.append {
        print(i)
    }
    i += 1
}
// here i will be 5
closureArray[0]() // prints 5
closureArray[1]() // prints 5
closureArray[2]() // prints 5
closureArray[3]() // prints 5
closureArray[4]() // prints 5
```

The closure captures the current address of `i` and every time we access `i` , it . returns the current value.

If we want to prevent this behavior (capturing values) and print the value of i even if the properties change after their capturing inside the closure, we can explicitly capture the variable with a capture list like this:

```
var closureArray2 = [()->()]()
var j = 0
for _ in 1...5 {
    closureArray2.append { [j] in
        print(j)
    }
    j += 1
}
// here i will be 5
closureArray2[0]() // prints 0
closureArray2[1]() // prints 1
closureArray2[2]() // prints 2
closureArray2[3]() // prints 3
closureArray2[4]() // prints 4
```

In this way, we keep an immutable copy of the variable `j`. Thanks to this copy, further changes to `j`, outside the closure, will not affect the closure. `j` is a let constant here. It is not mutable.

We can add multiple values to the capture list :

```
closure.append { [j,k,l] in
    print("\(j) \(k) \(l)")
}
```

also, you can have alias names for the values captured.

```
closure.append { [a = j, b = k, c = l] in
    print("\(a) \(b) \(c)")
}
```