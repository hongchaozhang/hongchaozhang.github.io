---
layout: post
title: "autorelease in objective-c"
date: 2015-09-22 10:36:50 +0800
comments: true
categories: [objective-c]
published: false
---

reference [Objective-C Autorelease Pool 的实现原理](http://blog.leichunfeng.com/blog/2015/05/31/objective-c-autorelease-pool-implementation-principle/)

`if` and `for` blocks don't have autoreleasepool, for循环中遍历产生大量autorelease变量时，就需要手加局部AutoreleasePool咯。