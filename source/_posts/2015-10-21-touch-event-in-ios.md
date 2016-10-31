---
layout: post
title: "iOS中的触控事件机制"
date: 2015-10-21 16:55:48 +0800
comments: true
categories: [ios, objective-c]
---

在iOS中有三类事件：

* 触控事件（单点、多点触控以及各种手势操作）
* 传感器事件（重力、加速度传感器等）
* 远程控制事件（远程遥控iOS设备多媒体播放等）

这里要讨论的是**触控事件**的机制。

iOS中主要有两种触控事件：

* 手势识别类定义的触控事件
* UIResponder中定义的触控事件

<!-- more -->

## 手势识别类——Gesture Recognizer

### 手势识别类的代码添加

可以通过如下代码，在ViewController中为UIView添加手势识别类，称为Action-Target模式。每一个Gesture Recognizer关联一个View，但是一个View可以关联多个Gesture Recognizer，因为一个View可能还能响应多种触控操作方式。

{% highlight objc linenos %}
- (void)viewDidLoad {
    [super viewDidLoad];

    // 创建并初始化手势对象
    UITapGestureRecognizer *tapRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(respondToTapGesture:)];

    // 指定操作为单击一次
    tapRecognizer.numberOfTapsRequired = 1;

    // 为当前View添加GestureRecognizer
    [self.view addGestureRecognizer:tapRecognizer];

    // ...
}
{% endhighlight %}

### 连续和不连续动作

![011_iOS_event_discrete_vs_continuous.png](/images/011_iOS_event_discrete_vs_continuous.png)

对于不连续动作，Gesture Recognizer只会给ViewContoller发送一个单一的动作消息(action message)而，对于连续动作，Gesture Recognizer会发送多条动作消息给ViewController，直到所有的事件都结束。


### 常见的手势识别类

UIKit框架中已经提供了诸如UITapGestureRecognizer在内的六种手势识别器：

Gesture | UIKit class
---|---
Tapping (any number of taps)| UITapGestureRecognizer
Pinching in and out (for zooming a view) | UIPinchGestureRecognizer
Panning or dragging | UIPanGestureRecognizer
Swiping (in any direction) | UISwipeGestureRecognizer
Rotating (fingers moving in opposite directions) | UIRotationGestureRecognizer
Long press (also known as “touch and hold”) | UILongPressGestureRecognizer

如果你需要实现自定义的手势识别器，也可以通过继承UIGestureRecognizer类并重写其中的方法来完成。

### 事件识别过程

在事件处理过程中，连续事件和不连续事件所处的状态又各有不同，首先，所有的触控事件最开始都是处于可用状态(Possible)，对应UIKit里面的UIGestureRecognizerStatePossible类，如果是不连续动作事件，则状态只会从Possible转变为已识别状态(Recognized,UIGestureRecognizerStateRecognized)或者是失败状态(Failed,UIGestureRecognizerStateFailed)。例如一次成功的单击动作，就对应了Possible-Recognized这个过程。

![012_iOS_event_gesture_recognizer_state_transitions.png](/images/012_iOS_event_gesture_recognizer_state_transitions.png)

如果是连续动作事件，如果事件没有失败并且连续动作的第一个动作被成功识别(Recognized)，则从Possible状态转移到Began(UIGestureRecognizerStateBegan)状态，这里表示连续动作的开始，接着会转变为Changed(UIGestureRecognizerStateChanged)状态，在这个状态下会不断循环的处理连续动作，直到动作执行完成变转变为Recognized已识别状态，最终该动作会处于完成状态(UIGestureRecognizerStateEnded)。另外，连续动作事件的处理状态也可能会从Changed状态转变为Canceled(UIGestureRecognizerStateCancelled)状态，原因是识别器认为当前的动作已经不匹配当初对事件的设定了。每个动作状态的变化，Gesture Recognizer都会发送消息(action message)给Target，也就是ViewController，它可以根据这些动作消息进行相应的处理。例如一次成功的滑动手势动作就包括按下、移动、抬起的过程，分别对应了Possible-Began-Changed-Recognized这个过程。


## UIResponder中定义的触控事件

### UITouch和UIEvent

**TODO**

当UIView中没有添加UIGestureRecognizer的时候，如果对UIView触发Pinch操作，如下四个事件接口函数中的`touches`都只能接收到一个touch的信息（新加的或者改变的touche）。如果想得到所有touch的信息，可以到`event.touches`中获取。

{% highlight objc linenos %}
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{% endhighlight %}

每个touch都有自己的`phase`，其与上述四个接口函数的关系可以从下面的例子中看出：

![014_ios_event_touch_time.png](/images/014_ios_event_touch_time.png)

## 手势识别类和UIResponder定义的事件的传递过程

![013_iOS_event_path_of_touches.png](/images/013_iOS_event_path_of_touches.png)

iOS中事件传递首先从App(UIApplication)开始，接着传递到Window(UIWindow)，在接着往下传递到View之前，Window会将事件交给GestureRecognizer，如果在此期间，GestureRecognizer识别了传递过来的事件，则该事件将不会继续传递到View去，而是像我们之前说的那样交给Target(ViewController)进行处理。如果View上没有定义GestureRecognizer，或者GestureRecognizer没有识别出这个动作，那么View中的继承自UIResponder的如下事件方法会被触发：

* touchesBegan:withEvent:
* touchesMoved:withEvent:
* touchesEnded:withEvent:
* touchesCancelled:withEvent:

比如，

* 对于非连续行动作（比如Tap），
    * 当View上定义了UITapGestureRecognizer，在View接受用户Tap事件时，touchesBegan:withEvent:和touchesCancelled:withEvent:会被调用，其余事件方法则不会被调用。
    * 当View上没有定义UIGestureRecognizer时，在View接受用户Tap事件时，touchesBegan:withEvent:和touchesEnded:withEvent:会被调用。
* 对于连续动作（比如Pinch），
    * 当View上定义了UIPinchGestureRecognizer时，在View接受用户Pinch动作时，
        * 如果Pinch动作被正确地Recognized，那么View上被触发的事件依次是：
            * touchesBegan
            * touchesMoved
            * touchesMoved
            * ...
            * touchesMoved
            * pinch (UIGestureRecognizerStateBegan)
            * touchesCancelled
            * pinch (UIGestureRecognizerStateChanged)
            * pinch (UIGestureRecognizerStateChanged)
            * ...
            * pinch (UIGestureRecognizerStateChanged)
            * pinch (UIGestureRecognizerStateEnded / UIGestureRecognizerStateRecognized)
        * 如果Pinch动作Cancelled，猜想：应该和recognized的情况类似，只是最后一步的状态是UIGestureRecognizerStateCancelled。
    * 当View上未定义UIPinchGestureRecognizer时，在View接受Pinch动作时，被触发的事件依次是：
        * touchesBegan
        * touchesMoved
        * touchesMoved
        * ...
        * touchesMoved
        * touchesEnded

可以到[Gesture Recognizers](https://developer.apple.com/library/ios/documentation/EventHandling/Conceptual/EventHandlingiPhoneOS/GestureRecognizer_basics/GestureRecognizer_basics.html)官方文档中的“Gesture Recognizers Get the First Opportunity to Recognize a Touch”部分了解详细过程。

截一插图放在这里：

![015_iOS_recognize_touch.png](/images/015_iOS_recognize_touch.png)

## 响应者链（Responder Chain）

在网页上当我们讲到事件，我们会讲到事件响应链，我们会讲到事件的响应者和事件的传递方式(冒泡)，那么在app上，其实也离不开这几个问题。

UIResponder是所有可以响应事件的类的基类(从名字应该就可以看出来了)，其中包括最常见的UIView和UIViewController甚至是UIApplication，所以我们的UIView和UIViewController都是作为响应事件的载体，称为**响应者对象（Responder Object）**。UIResponder部分接口如下：

{% highlight objc linenos %}
NS_CLASS_AVAILABLE_IOS(2_0) @interface UIResponder : NSObject

- (nullable UIResponder*)nextResponder;

- (BOOL)canBecomeFirstResponder;    // default is NO
- (BOOL)becomeFirstResponder;

- (BOOL)canResignFirstResponder;    // default is YES
- (BOOL)resignFirstResponder;

- (BOOL)isFirstResponder;

// Generally, all responders which do custom touch handling should override all four of these methods.
// Your responder will receive either touchesEnded:withEvent: or touchesCancelled:withEvent: for each
// touch it is handling (those touches it received in touchesBegan:withEvent:).
// *** You must handle cancelled touches to ensure correct behavior in your application.  Failure to
// do so is very likely to lead to incorrect behavior or crashes.
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event;
- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event;
- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event;
- (void)touchesCancelled:(nullable NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event;
{% endhighlight %}

那么响应链跟这个UIResponder有什么关系呢？事实事件响应链的形成和事件的响应和传递，UIResponder都帮我们做了很多事。我们的app中，所有的视图都是按照一定的结构组织起来的，即树状层次结构，每个view都有自己的superView，包括controller的topmost view(controller的self.view)。当一个view被add到superView上的时候，他的nextResponder属性就会被指向它的superView，当controller被初始化的时候，self.view(topmost view)的nextResponder会被指向所在的controller，而controller的nextResponder会被指向self.view的superView，这样，整个app就通过nextResponder串成了一条链，也就是我们所说的响应链。所以响应链就是一条虚拟的链，并没有一个对象来专门存储这样的一条链，而是通过UIResponder的属性nextResponder串连起来的。如下图：

![007_iOS_responder_chain.png](/images/007_iOS_responder_chain.png)

参考文章：[深入浅出iOS事件机制](http://zhoon.github.io/ios/2015/04/12/ios-event.html)。

### hit-test view

事件响应链工作的前提是找到**initial view**，我们称为hit-testing view，寻找这个view的过程我们称着为hit-test。确定了hit-TestView之后，才会开始进行下一步的事件分发。

每当手指接触屏幕，UIApplication接收到手指的事件之后，就会去调用UIWindow的hitTest:withEvent:

{% highlight objc linenos %}
hitTest: (CGPoint) point withEvent: (UIEvent* )event{
if (!self.isUserInteractionEnabled || self.isHidden || self.alpha <=0.01) {
    return nil;
}

for (UIView* v in subviews){
     if ([v pointInside:point withEvent:event]){
          return [v hitTest:point withEvent:event];
     }
  }
}
{% endhighlight %}

完整版本：

{% highlight objc linenos %}
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
    if (self.alpha <= 0.01 || !self.userInteractionEnabled || self.hidden) {
        return nil;
    }
    
    UIView *hitView = nil;
    if ([self pointInside:point withEvent:event]) {
        NSEnumerator *enumerator = [self.subviews reverseObjectEnumerator];
        for (UIView *subview in enumerator) {
            CGPoint convertedPoint = [subview convertPoint:point fromView:self];
            hitView = [subview hitTest:convertedPoint withEvent:event];
            if (hitView) {
                return hitView;
            }
        }

        return self;
    } else {
        return nil;
    }
}
{% endhighlight %}

注意hitTest里面是有判断当前的view是否支持点击事件，比如userInteractionEnabled、hidden、alpha等属性，都会影响一个view是否可以响应事件，如果不响应则直接返回nil。

我们留意到还有一个pointInside:withEvent:方法，这个方法跟hittest:withEvent:一样都是UIView的一个方法，通过他可以判断point是否在view的**bound**范围内。

下面用一幅图说明hit-test的过程：

![009_iOS_hittest_2.png](/images/009_iOS_hittest_2.png)

#### hitTest被调用两次的issue

对于一次tap，hitTest会被调用两次。这个问题在Apple Mailing List [Re: -hitTest:withEvent: called twice?](http://lists.apple.com/archives/cocoa-dev/2014/Feb/msg00118.html)里面有描述：

* Yes, it’s normal. The system may tweak the point being hit tested between the calls. Since hitTest should be a pure function with no side-effects, this should be fine.

当我们在UIView中重写`hitTest`也可以发现：这两次调用的timestamp都是相同的，并且两次`hitTest`先被调用之后才调用了`touchesBegan`和`touchesEnded`：

{% highlight text linenos %}
2016-10-12 17:08:24.692843 OCPlayground[1707:973553] timestamp: 164999.282347
2016-10-12 17:08:24.692962 OCPlayground[1707:973553] hitTest is called from EventPropagationViewer

2016-10-12 17:08:24.693520 OCPlayground[1707:973553] timestamp: 164999.282347
2016-10-12 17:08:24.693575 OCPlayground[1707:973553] hitTest is called from EventPropagationViewer

2016-10-12 17:08:24.696633 OCPlayground[1707:973553] timestamp: 164999.282347
2016-10-12 17:08:24.696710 OCPlayground[1707:973553] touchesBegan from EventPropagationViewer

2016-10-12 17:08:24.709334 OCPlayground[1707:973553] timestamp: 164999.299077
2016-10-12 17:08:24.709447 OCPlayground[1707:973553] touchesEnded from EventPropagationViewer
{% endhighlight %}

参考文章：[深入浅出iOS事件机制](http://zhoon.github.io/ios/2015/04/12/ios-event.html)，其中还讲述了一些hitTest的应用。



