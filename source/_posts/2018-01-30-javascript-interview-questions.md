---
layout: post
title: "javascript interview questions"
date: 2018-01-30 17:58:11 +0800
comments: true
published: false
categories: [javascript, web, html, css]
---

<!-- more -->

## use strict

What are the benefits of including 'use strict' at the beginning of a JavaScript source file?
在严格模式('use strict')下进行 JavaScript 开发有神马好处？

1. 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
2. 消除代码运行的一些不安全之处，保证代码运行的安全；
3. 提高编译器效率，增加运行速度；
4. 为未来新版本的Javascript做好铺垫。

## 请指出以下代码的区别：function Person(){}、var person = Person()、var person = new Person()？

## 解释 function foo() {} 与 var foo = function() {} 用法的区别

Refer to [函数声明 VS 函数表达式](https://libuchao.com/2012/06/25/function-declaration-vs-function-expression).

```javascript
// 方法一：函数声明
function foo() {}

// 方法二：函数表达式
var foo = function () {};
```

方法一和方法二都创建了一个函数，且命名为 foo，但是二者还是有区别的。JavaScript 解释器中存在一种变量声明被**提升**（hoisting）的机制，也就是说变量（函数）的声明会被提升到作用域的最前面，即使写代码的时候是写在最后面，也还是会被**提升**至最前面。

例如以下代码段：

```javascript
alert(foo); // function foo() {}
alert(bar); // undefined
function foo() {}
var bar = function bar_fn() {};
alert(foo); // function foo() {}
alert(bar); // function bar_fn() {}
```

JavaScript引擎执行以上代码的顺序可能是这样的：

1. 创建变量 foo 和 bar，并将它们都赋值为 undefined。
1. 创建函数 foo 的函数体，并将其赋值给变量 foo。
1. 执行前面的两个 alert。
1. 创建函数 bar_fn，并将其赋值给 bar。
1. 执行后面的两个 alert。


## setTimeout() and  closure

Refer to [80% 应聘者都不及格的 JS 面试题](http://web.jobbole.com/90954/).

1. 基本问题：

下面程序的输出是什么？

```javascript
for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
 
console.log(i);
```

答案：5 -> 5,5,5,5,5，即第1个5直接输出，1秒之后，输出5个5；

2. 拓展

如果期望代码的输出变成：5 -> 0,1,2,3,4，该怎么改造代码？请用闭包实现。

```javascript
for (var i = 0; i < 5; i++) {
    (function(j) {  // j = i
        setTimeout(function() {
            console.log(j);
        }, 1000);
    })(i);
}
 
console.log(i);
```

## reflow(回流) and repaint(重绘)

引起reflow的原因，如何避免reflow？Refer to [减少页面回流与重绘（Reflow & Repaint）](http://harttle.land/2015/08/11/reflow-repaint.html).

offsetWidth引起reflow

## NaN

**问题**

神马是 NaN，它的类型是神马？怎么测试一个值是否等于 NaN?

**答案**

NaN 是 Not a Number 的缩写，JavaScript 的一种特殊数值，其类型是 `Number`，可以通过 `isNaN(param)` 来判断一个值是否是 NaN：

```javascript
console.log(isNaN(NaN)); //true
console.log(isNaN(23)); //false
console.log(isNaN('ds')); //true
console.log(isNaN('32131sdasd')); //true
console.log(NaN === NaN); //false
console.log(NaN === undefined); //false
console.log(undefined === undefined); //false
console.log(typeof NaN); //number
console.log(Object.prototype.toString.call(NaN)); //[object Number]
```

## Hybrid Mobile性能问题，交互问题

## 数组的插入

对数组进行下面两个操作，时间和空间复杂度分别是多少？
- inset(at index: Int) 时间复杂度O(n)
- append(element) 时间复杂度O(1)


参考Swift关于Array.append方法效率的说明[Growing the Size of an Array](https://developer.apple.com/documentation/swift/array)

Every array reserves a specific amount of memory to hold its contents. When you add elements to an array and that array begins to exceed its reserved capacity, the array allocates a larger region of memory and copies its elements into the new storage. The new storage is a multiple of the old storage’s size. This exponential growth strategy means that appending an element happens in constant time, averaging the performance of many append operations. Append operations that trigger reallocation have a performance cost, but they occur less and less often as the array grows larger.

If you know approximately how many elements you will need to store, use the reserveCapacity(_:) method before appending to the array to avoid intermediate reallocations. Use the capacity and count properties to determine how many more elements the array can store without allocating larger storage.



