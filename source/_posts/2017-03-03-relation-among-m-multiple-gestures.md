---
layout: post
title: "如何处理多个手势之间的关系"
date: 2017-03-03 13:11:55 +0800
comments: true
categories: [ios, swift, objective-c]
---

1. 可以为同一个view添加两个相同类型的手势吗？比如添加两个`UITapGestureRecognizer`到同一个view。
2. 如果一个view中有多个手势（`UIGestureRecognizer`），应该怎么处理它们之间的关系？
3. 如果子view和父view中都有手势，这些手势之间的关系又是怎么样的呢？

<!-- more -->

单个手势的响应过程参考[iOS中的触控事件机制](http://hongchaozhang.github.io/blog/2015/10/21/touch-event-in-ios/)。但是上面几个问题需要考虑多个手势之间的关系，超出了上面文章的讨论范围。下面，我们就来讨论一下上面几个问题。

### 1. 可以为同一个view添加两个相同类型的手势吗？比如添加两个UITapGestureRecognizer到同一个view。

可以为view添加多个不同的`UIGestureRecognizer`，比如pan和tap，可以同时起作用，但是如果你想**加入两个tap手势，第二个会将第一个手势覆盖**。这个时候，至少需要为其中一个tap手势添加delegate，并实现下面的方法，为两个tap同时存在的情况返回true：
    
{% highlight swift %}
optional public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool
{% endhighlight %}
    
> returning YES is guaranteed to allow simultaneous recognition. returning NO is not guaranteed to prevent simultaneous recognition, as the other gesture's delegate may return YES.

### 2. 如果一个view中有多个手势（`UIGestureRecognizer`），应该怎么处理它们之间的关系？

如果两个手势之间没有识别上的困难，那么不用任何处理，比如tap和pan，但是如果有关系，比如single tap和double tap，rotate和pinch，这需要明确两者之间的关系。
    

如果不希望在double tap的同时触发两次single tap，需要在single tap的delegate中实现方法
    
{% highlight swift %}
optional public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRequireFailureOf otherGestureRecognizer: UIGestureRecognizer) -> Bool
{% endhighlight %}
    
这样，可以保证single tap会等待double tap失败之后再被触发。缺点是single tap反应迟钝。

如果希望在rotate的同时可以进行pinch，需要在pinch或者rotate的手势的delegate中实现方法：
    
{% highlight swift %}
optional public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool
{% endhighlight %}
    
这样，rotate和pinch就能同时被识别。

### 3. 如果子view和父view中都有手势，这些手势之间的关系又是怎么样的呢？

`UIGestureRecognizerDelegate`中的方法并没有限制在同一个view之中，所以，不同view之间的手势关系与1和2的处理相同。
    
### 注意

如果为手势实现了delegate方法，那么`UIGestureRecognizer`里面的响应的方法将不再起作用。比如：

如果设置了

{% highlight swift %}
singleTap.delegate = self.singleTapOnMapWidgetViewerGestureRecognizerDelegate
{% endhighlight %}

那么

{% highlight swift %}
singleTap.require(toFail: doubleTap)
{% endhighlight %}

就不起作用了，必须通过`UIGestureRecognizerDelegate`里面的方法实现。