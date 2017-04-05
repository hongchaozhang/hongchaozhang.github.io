---
layout: post
title: "layoutSubviews的调用机制"
date: 2017-03-28 09:25:06 +0800
comments: true
categories: [ios]
---


## `layoutSubviews`什么时候被调用？

为了方便描述，假设视图结构如下：

<!-- more -->

**父视图**包含**子视图1**和**子视图2**。

1. `init`不会调用`layoutSubviews`，即使使用了`init(frame: CGRect)`进行初始化。
2. 当调用`addSubview(:)`将子视图2加入父视图的时候，子视图2和父视图的`layoutSubviews`会被调用，但是子视图1的`layoutSubviews`方法不会被调用。
3. 当我们设置子视图2的`frame`的时候，如果`frame`的`size`有变化，同结论2`addSubview`；如果`frame`的`size`没有变化，则不会有`layoutSubviews`被调用。
4. 当调用`removeFromSuperview`将视图2从父视图中删除的时候，只有父视图的`layoutSubviews`会被调用。
5. 当旋转设备的时候，只有根视图的`layoutSubviews`会被调用。
6. 当滑动`UIScrollView`的时候，`UIScrollView`的`layoutSubviews`会被调用。

## auto layout和autoSizing

以上结论有个前提：视图通过设置`frame`或者autoSizing机制确定位置和大小，不使用auto layout。

> **auto layout和autoSizing的区别**：autoSizing确定的是子视图和父视图之间的位置大小关系，auto layout确定的是子视图、父视图以及兄弟视图之间的位置大小关系。

在使用auto layout的时候，当调用`addSubview(:)`将子视图2加入父视图的时候，子视图2和父视图的`layoutSubviews`会被调用，同时子视图1的`layoutSubviews`方法也会被调用。设置`frame`和`removeFromSuperview`有类似的结论。

## `setNeedsLayout`和`layoutIfNeeded`

* `setNeedsLayout`：如果一个视图调用了`setNeedsLayout`，那么在下一个更新周期该视图的`layoutSubviews`会被调用。
* `layoutIfNeeded`：如果一个视图调用了`layoutIfNeeded `，那么该视图的`layoutSubviews`会被**立刻**调用。
