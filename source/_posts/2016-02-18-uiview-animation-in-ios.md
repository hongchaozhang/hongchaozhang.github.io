---
layout: post
title: "iOS中的动画——UIView"
date: 2016-02-18 11:36:47 +0800
comments: true
categories: [ios, objective-c]
---

官方文档[Animations](https://developer.apple.com/library/ios/documentation/WindowsViews/Conceptual/ViewPG_iPhoneOS/AnimatingViews/AnimatingViews.html)详细讲述了UIView的animations，
[iOS 开发之动画篇 - 从 UIView 动画说起](http://www.cocoachina.com/ios/20160215/15262.html)也阐述了用UIView进行动画的基本用法。

<!-- more -->

总结摘抄一些要点。

## Animate Property Changes in a View

### Basic Usage

{% highlight objc linenos %}
[UIView animateWithDuration:1.0 animations:^{
    firstView.alpha = 0.0;
    secondView.alpha = 1.0;
}];
{% endhighlight %}

> NOTE: When this code executes, the specified animations are started immediately on another thread so as to avoid blocking the current thread or your application’s main thread.

### Completion Handler

Usage of Completion Handler

* Use a completion handler to signal your application that a specific animation has finished. 
* Completion handlers are also the way to link separate animations together.

Sample code：

{% highlight objc linenos %}
- (IBAction)showHideView:(id)sender
{
    // Fade out the view right away
    [UIView animateWithDuration:1.0
        delay: 0.0
        options: UIViewAnimationOptionCurveEaseIn
        animations:^{
             thirdView.alpha = 0.0;
        }
        completion:^(BOOL finished){
            // Wait one second and then fade in the view
            [UIView animateWithDuration:1.0
                 delay: 1.0
                 options:UIViewAnimationOptionCurveEaseOut
                 animations:^{
                    thirdView.alpha = 1.0;
                 }
                 completion:nil];
        }];
}
{% endhighlight %}

### Nesting Animation Blocks

Nested animations are started at the same time as any parent animations.

Sample code:

{% highlight objc linenos %}
[UIView animateWithDuration:1.0
        delay: 1.0
        options:UIViewAnimationOptionCurveEaseOut
        animations:^{
            aView.alpha = 0.0;
            // Create a nested animation that has a different
            // duration, timing curve, and configuration.
            [UIView animateWithDuration:0.2
                 delay:0.0
                 options: UIViewAnimationOptionOverrideInheritedCurve |
                          UIViewAnimationOptionCurveLinear |
                          UIViewAnimationOptionOverrideInheritedDuration |
                          UIViewAnimationOptionRepeat |
                          UIViewAnimationOptionAutoreverse
                 animations:^{
                      [UIView setAnimationRepeatCount:2.5];
                      anotherView.alpha = 0.0;
                 }
                 completion:nil];
        }
        completion:nil];
{% endhighlight %}

## Creating Animated Transitions Between Views

View transitions help you hide sudden changes associated with adding, removing, hiding, or showing views in your view hierarchy. You use view transitions to implement the following types of changes:

* **Change the visible subviews of an existing view.** You typically choose this option when you want to make relatively small changes to an existing view.
* **Replace one view in your view hierarchy with a different view.** You typically choose this option when you want to replace a view hierarchy that spans all or most of the screen.

> **Note:** View transitions should not be confused with transitions initiated by view controllers, such as the presentation of modal view controllers or the pushing of new view controllers onto a navigation stack. View transitions affect the view hierarchy only, whereas view-controller transitions change the active view controller as well. Thus, for view transitions, the view controller that was active when you initiated the transition remains active when the transition finishes.

Sampel code for replacing a view with a different view:

{% highlight objc linenos %}
- (IBAction)toggleMainViews:(id)sender {
    [UIView transitionFromView:(displayingPrimary ? primaryView : secondaryView)
        toView:(displayingPrimary ? secondaryView : primaryView)
        duration:1.0
        options:(displayingPrimary ? UIViewAnimationOptionTransitionFlipFromRight :
                    UIViewAnimationOptionTransitionFlipFromLeft)
        completion:^(BOOL finished) {
            if (finished) {
                displayingPrimary = !displayingPrimary;
            }
    }];
}
{% endhighlight %}

> **Note:** In addition to swapping out views, your view controller code needs to manage the loading and unloading of both the primary and secondary views. 