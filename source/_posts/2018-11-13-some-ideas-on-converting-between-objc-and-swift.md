---
layout: post
title: "在swift和Objc之间转换的一些想法"
date: 2018-11-13 10:50:18 +0800
comments: true
categories: [swift, xcode, objective-c]
---

<!-- more -->

在工作中我们有时候需要在swift和objc之间进行转换，这时候有没有一些工具可以帮助我们呢？

> 当然，大部分时候，我们不需要转换，因为swift和objc的类和方法可以互相暴露给对方。

## objc转换成swfit

搜索了一下，找到了两个工具可以做这个事情：

### [objc2swift](https://github.com/yahoojapan/objc2swift)

objc2swift是雅虎日本的一个工具，支持在线转换。[XCSwiftr](https://github.com/dzenbot/XCSwiftr/blob/master/README.md)就是一个基于objc2swift的xcode插件，通过[Alcatraz](https://github.com/alcatraz/Alcatraz)进行管理安装，可以在Xcode里面进行objc到swift的转换。但是xcode自从8.0开始就不支持插件了。

> 插件(plugin)只在xcode 8.0之前的版本才支持。从8.0开始，插件就不再支持，但是引入了扩展(extension)。扩展和插件不同的一点是：扩展在独立的进程里面运行，所以扩展的崩溃不会影响到xcode，但是插件的崩溃，则会导致xcode也崩溃。估计插件崩溃导致的xcode崩溃的锅都是Apple来背，Apple很不爽，就让xcode跟插件分开在不同的进程中运行。

objc2swift的转换效果很一般。

objc源代码：

```objc
@interface MyClass: NSObject

- (void)sayHelloTo:(NSString*)person;

@end

@implementation MyClass

- (void)sayHelloTo:(NSString*)person {
    NSLog([NSString stringWithFormat:@"Hello, %@.", person]);
    [self performSelector:@selector(test)];
    
}

- (void)test {
}

@end
```

转换之后：

```swift
class MyClass: NSObject {
    func sayHelloTo(person: String) {
        print("Hello, \(person).")
        self.performSelector("test")
    }
    
    func test() {
        
    }
}
```

几个问题：

1. 方法名称没有按照swift的习惯改写：应该为`sayHello(to person: String)`，而不是`sayHelloTo(person: String)`。
2. `performSelector:`方法完全转换错误：方法名称错误，应该为`perform(_ aSelector: Selector!)`，而且参数也错误，不应该为`String`类型，应该为`Selector`类型。
3. `test`方法前面没有加上`@objc`，所以不能作为`#selector`的参数。

### [Swiftify](https://objectivec2swift.com/#/home)

swiftify也支持在线转换，而且转换效果明显好于objc2swift。如果愿意花钱，swiftify还可以支持很多功能，包括xcode扩展（注意，这里是“扩展extension”，不是“插件plugin”）、finder扩展、整个工程的转换、离线转换等。

![swiftify.webp](/images/swiftify.webp)

同样用上述objc源代码，转换之后为：

```swift
class MyClass: NSObject {
    func sayHello(to person: String?) {
        print("Hello Swift, Goodbye Obj-C!")
        perform(#selector(MyClass.test))
    }

    @objc func test() {
    }
}
```

## swift转换成objc

[Swiftify](https://objectivec2swift.com/#/home)的作者写了一篇博客[How can you convert Swift to Objective-C?](https://www.quora.com/How-can-you-convert-Swift-to-Objective-C)，说明了这个问题：

原文是：

> When speaking about idiomatic Swift, converting method implementations from Swift to Objective-C is the task that cannot be solved for all cases. As you might imagine, many “modern” Swift features do not have any counterparts in Objective-C and thus cannot be converted without a human brain :)

结论就是：由于swift有很多objc没有的语言特性，所以swift到objc无法完成自动转换。

但是转换之后的objc的头文件可以从build in “Generated Interface” ([ProjectName]-Swift.h)里面找到，拷贝出来，稍作修改即可。但是仅限于swift暴漏给objc的接口和属性。那些没有暴漏给objc的接口和属性，就需要手动去转换啦。

> [ProjectName]-Swift.h如果不能通过cmd+shift+O找到，可以从引用这个头文件的objc文件中通过“go to declaration"找到。



