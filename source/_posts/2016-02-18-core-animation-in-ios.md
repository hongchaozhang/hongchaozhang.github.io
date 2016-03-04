---
layout: post
title: "iOS中的动画——Core Animation"
date: 2016-02-18 15:16:19 +0800
comments: true
categories: [ios, objective-c]
published: false
---

**TODO**

<!-- more -->

layer and view

Because Layer manipulates a static bitmap, layer-based drawing differs significantly from more traditional view-based drawing techniques. With view-based drawing, changes to the view itself often result in a call to the view’s drawRect: method to redraw content using the new parameters. But drawing in this way is expensive because it is done using the CPU on the main thread. Core Animation avoids this expense by whenever possible by manipulating the cached bitmap in hardware to achieve the same or similar effects.