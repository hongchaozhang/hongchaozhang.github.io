---
layout: post
title: "Swift中的selector"
date: 2017-05-15 13:47:56 +0800
comments: true
categories: [ios, swift]
published: false
---


<!-- more -->
参考：[Hannibal #selector](https://www.bignerdranch.com/blog/hannibal-selector/)

## Objective-C中的`@selector`

> The selector is key to Objective-C’s dynamic runtime nature. It’s just a name that’s used, at runtime, as a key into a dictionary of function pointers. Whenever you send a message to an Objective-C object, you’re actually using a selector to look up a function to call. **Sometimes selectors bubble up in Cocoa/CocoaTouch API, and you will need to deal with them in Swift.**
> 
> 关于上面说的“bubble up”，参考结尾的”UIButton和selector的一点问题”。

Objective-C中selector的例子：

{% highlight objc %}
UIButton *button = [UIButton buttonWithType: UIButtonTypeInfoLight];
[button addTarget: self
                action: @selector(showAboutBox:)
                forControlEvents: UIControlEventTouchUpInside];
{% endhighlight %}

This kind of API is common with Cocoa/CocoaTouch’s “target/action” architecture, used in most of the UI controls, as well as with NSNotificationCenter. This is a fairly old design—APIs that take blocks/closures are more common these days.


## Swit中的`#selector`

You use Cocoa/CocoaTouch from Swift, and so you want button taps to invoke Swift code. Swift needs to be able to use selectors. Selectors aren’t part of the default Swift runtime behavior, because sending arbitrary messages to objects can be unsafe. The compiler can’t guarantee that the receiving object actually responds to that selector.

To have your Swift objects participate in the Objective-C runtime, you will need to opt-in by having your class inherit from NSObject, or decorate individual methods with @objc. This makes a Swift class participate in Objective-C’s method dispatch mechanism. 

## selector的语法

`#selector` was introduced in Swift 2.2. Prior versions of Swift used a String mechanism to automatically convert selector-looking strings into selectors. If you use this syntax today, you will get a deprecation warning.

You can also use `Selector("someSelectorName")` as an alternative syntax, but the compiler will give you a warning suggesting you use #selector, assuming it has seen this selector anywhere before. You can use this syntax to generate a selector that the compiler hasn’t seen yet, perhaps as a selector to methods that are dynamically loaded by plugins at runtime.

### Objective-C

{% highlight objc %}
@selector(methodName:arguments:)
{% endhighlight %}

### Swift

{% highlight swift %}
#selector(UIView.setNeedsDisplay)
#selector(GroovyViewSubclass.setNeedsDisplay)
{% endhighlight %}

比如：

{% highlight swift %}
button.addTarget(self,
                action: #selector(GroovyViewController.showAboutBox),
                for: .touchUpInside)
{% endhighlight %}

#### 为什么方法前面必须加上类的名字：

我们最好为#selector加上类名，这样编译器可以帮助我们检查处理一些错误，防止运行时的crash。比如：

* 当某个类中没有这个方法时，或者
* 当一个纯swift类中的没有通过`@objc`暴露给Objective-C运行时的方法。

#### 重载（overload）的问题

Swift has function overloading (same name, different arguments), while Objective-C does not. You may need to disambiguate which Swift function you want the selector to refer to.

{% highlight swift %}
class Thing {
    ...
    func doStuff(stuff: Int) {
        print("do Stuff \(stuff)")
    }

    func doStuff(stuff: Double, fluffy: String) {
        print("do Stuff \(stuff) - \(fluffy)")
    }
}
{% endhighlight %}

Objective-C demands that all methods have unique selectors.

{% highlight swift %}
@objc(takesADoubleArgument:)
func takesAnArgument(fluffy: Double) {
    print("taking a double \(fluffy)")
}
{% endhighlight %}

{% highlight swift %}
let selector = #selector(((Blorf.takesAnArgument(_:)) as (Blorf) -> (Double) -> Void))
{% endhighlight %}

## 总结：



## UIButton和selector的一点问题

当为button添加target/action的时候，需要保持target的强引用，因为button自身只会保持target的一个弱引用。如果我们没有保持一个target的强引用，当我们试图调用button的action的时候，target是nil。在这种情况下，iOS将会从button向上，沿着responder chain查找action。可以从方法`addTarget(_:action:for:)`的文档中看到：

> add target/action for particular event. you can call this multiple times and you can specify multiple target/actions for a particular event.
> **passing in nil as the target goes up the responder chain**. The action may optionally include the sender and the event in that order
> the action cannot be NULL. **Note that the target is not retained.**

实际上，任何target-action模式都是这样解决问题的，参考苹果官方文档：[Target-Action](https://developer.apple.com/library/content/documentation/General/Conceptual/CocoaEncyclopedia/Target-Action/Target-Action.html#//apple_ref/doc/uid/TP40010810-CH12-SW31)，将重点照抄如下：

A target is a receiver of an action message. 

You can also set a cell’s or control’s target outlet to nil and let the target object be determined at runtime. When the target is nil, the application object (NSApplication or UIApplication) searches for an appropriate receiver in a prescribed order:

1. It begins with the first responder in the key window and follows nextResponder links up the responder chain to the window object’s (NSWindow or UIWindow) content view.
    
    Note: A key window in OS X responds to key presses for an application and is the receiver of messages from menus and dialogs. An application’s main window is the principal focus of user actions and often has key status as well.
2. It tries the window object and then the window object’s delegate.
3. If the main window is different from the key window, it then starts over with the first responder in the main window and works its way up the main window’s responder chain to the window object and its delegate.
4. Next, the application object tries to respond. If it can’t respond, it tries its delegate. The application object and its delegate are the receivers of last resort.

Control objects do not (and should not) retain their targets. However, clients of controls sending action messages (applications, usually) are responsible for ensuring that their targets are available to receive action messages. To do this, they may have to retain their targets in memory-managed environments. This precaution applies equally to delegates and data sources.



