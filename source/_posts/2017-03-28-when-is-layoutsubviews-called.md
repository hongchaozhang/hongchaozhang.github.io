---
layout: post
title: "layoutSubviews的调用机制"
date: 2017-03-28 09:25:06 +0800
comments: true
published: false
categories: [ios]
---

[When is layoutSubviews called?](http://stackoverflow.com/questions/728372/when-is-layoutsubviews-called)

1. init does not cause layoutSubviews to be called (duh)
2. addSubview causes layoutSubviews to be called on the view being added, the view it’s being added to (target view), and all the subviews of the target view
3. setFrame intelligently calls layoutSubviews on the view having it’s frame set only if the size parameter of the frame is different
4. scrolling a UIScrollView causes layoutSubviews to be called on the scrollView, and it’s superview
5. rotating a device only calls layoutSubview on the parent view (the responding viewControllers primary view)
6. removeFromSuperview – layoutSubviews is called on superview only (not show in table)



`setNeedsLayout`

`layoutIfNeeded`

### 与autosizing、auto layout的关系

autosizing

auto layout