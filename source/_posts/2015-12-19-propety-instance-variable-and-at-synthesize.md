---
layout: post
title: "Property, Instance Variable and @synthesize"
date: 2015-12-19 15:17:41 +0800
comments: true
categories: [ios, objective-c]
---

这一段时间，在对自己不是很了解的代码进行重构，重新了解了一下Property、Instance Variable和@synthesize，总结一下。

首先需要明白一点：Property和@synthesize是让编译器帮助我们做一些规律性的工作。

### 如果没有Property
如果没有Property，我们可以这样实现Instance Variable的accessor（getter和setter），示例代码如下：

<!-- more -->

```

@interface PropertyTester() {
    NSString* testString;
}

@end

@implementation PropertyTester

- (NSString*)testString {
    return testString;
}
- (void)setTestString:(NSString*)stringValue {
    testString = stringValue;
}

- (void)test {
    self.testString = @"test proeprty";
    NSLog(@"%@", self.testString); 
}

@end

```

### 有了Property
眼看着Instance Variable及其getter和setter函数是如此有规律，于是Property出现了。

Property可以告诉编译器：我声明了一个Property，名字叫做`propertyName`，你帮我声明一个Instance Variable `_propertyName`，并帮助我实现其getter和setter函数。于是，上述代码，我们可以写成：

```

@interface PropertyTester()

@property (nonatomic, strong) NSString* testString;

@end

@implementation PropertyTester

- (void)test {
    self.testString = @"test proeprty";
    NSLog(@"%@", self.testString);
    
}

@end

```

看看，是不是简单了很多。

### Auto Synthesize

其实在上述使用Property的代码中，编译器还帮助我们做了一件事情：

```
@synthesize testString = _testString;
```

从Xcode 4.4和LLVM Compiler 4.0起，有了**auto synthesize**，即@synthesize被更改为默认使用。因此，大多数情况下，你只需要 @property 指令，编译器将为你关心其它的事情。对，是“大多数”，因为在某些情况下，不会进行auto synthesize 。比如，对于上述代码，如果我打算自己实现getter函数：

```
@interface PropertyTester()

@property (nonatomic, strong) NSString* testString;

@end

@implementation PropertyTester

- (NSString*)testString {
    return _testString;
}

- (void)test {
    self.testString = @"test proeprty";
    NSLog(@"%@", self.testString);
    
}

@end
```

没有任何问题。

如果我再试图加入setter函数：

```
@interface PropertyTester()
@property (nonatomic, strong) NSString* testString;
@end

@implementation PropertyTester

- (NSString*)testString {
    return _testString;
}

- (void)setTestString:(NSString *)testString {
    _testString = testString;
}

- (void)test {
    self.testString = @"test proeprty";
    NSLog(@"%@", self.testString);
    
}

@end
```

编译器会报错：

```
use of undefined identifier '_testString'。
```

为什么呢？

因为此时auto synthesize没有工作。编译器认为：**既然你同时手动接管了getter和setter的实现，那么我就什么也不管了，Instance Variable你也自己声明并起个名字吧。**

总结一下auto synthesize不会工作的几种情况（参考[When should I use @synthesize explicitly?](http://stackoverflow.com/questions/19784454/when-should-i-use-synthesize-explicitly)）：

* readwrite property with custom getter and setter

    when providing both a getter and setter custom implementation, the property won't be automatically synthesized

* readonly property with custom getter

    when providing a custom getter implementation for a readonly property, this won't be automatically synthesized

* @dynamic

    when using @dynamic propertyName, the property won't be automatically synthesized (pretty obvious, since @dynamic and @synthesize are mutually exclusive).
    
    @synthesize will generate getter and setter methods for your property. @dynamic just tells the compiler that the getter and setter methods are implemented not by the class itself but somewhere else (like the superclass)

* **properties declared in a @protocol**

    when conforming to a protocol, any property the protocol defines won't be automatically synthesized. You need to synthesize the property manually. **And this is the only senario in which `@synthesize` should be used.**

    There is another way: you can redeclare the property and the compiler will auto synthesize the property and generate the getter and setter methods for you. Of cause, the previous way is recommended.

* properties declared in a category

    this is a case in which the @synthesize directive is not automatically inserted by the compiler, but this properties cannot be manually synthesized either. While categories can declare properties, they cannot be synthesized at all, since categories cannot create ivars. For the sake of completeness, I'll add that it's still possible to fake the property synthesis using the Objective-C runtime.
    
    Actually, **categorie** is best used for adding capability to code you do not own and cannot change. Adding properties via categories is deprecated.

* overridden properties (new since clang-600.0.51, shipping with Xcode 6, thanks Marc Schlüpmann)

    when you override a property of a superclass, two ways for you:
    * explicitly synthesize it with a different instance variable name from super class.
    * **@dynamic the property to tell the compiler that I will use the getter and setter methods in the super class.**

