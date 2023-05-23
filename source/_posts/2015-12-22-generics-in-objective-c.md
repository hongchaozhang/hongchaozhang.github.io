---
layout: post
title: "generics in objective-c"
date: 2015-12-22 13:18:48 +0800
comments: true
categories: [ios, objective-c]
---

参考：[Is there any way to enforce typing on NSArray, NSMutableArray, etc.?](http://stackoverflow.com/questions/649483/is-there-any-way-to-enforce-typing-on-nsarray-nsmutablearray-etc)

参考：[Objective C Generics](http://drekka.ghost.io/objective-c-generics/)

随着Xcode7的发布，苹果实现了collection类（NSArray，NSDictionary，NSSet）的generics功能。

<!-- more -->

以后，可以这样定义Array了：

```objc
NSArray<MyClass *> *myArray = @[[MyClass new], [MyClass new]];
```

但是，我们仍然可以在Array中加入非MyClass类型的实例，此时xcode会报出警告，但是不会报错，程序仍然可以运行。所以需要我们在写程序时去除所有的警告。

Xcode的提示也会帮助我们避免这些警告：当你试图add一个元素到Array中时，Xcode会提示其中元素的类型`void addObject:(nonnull MyClass *)`；如果没有用Generics，Xcode的提示是`void addObject:(nonnull id)`。

但是这个可以给我们带来一个明显的好处：

我们只要看到定义，就能知道其中的元素类型，而不用全局搜索代码，看往其中加入了什么。就冲这一点，就足以让我们毫不犹豫地使用了。

更多的介绍和Generics的局限，请参考：[Objective C Generics](http://drekka.ghost.io/objective-c-generics/)。