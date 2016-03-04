---
layout: post
title: "ios内存管理——理论"
date: 2016-02-22 20:51:30 +0800
comments: true
categories: [ios, objective-c]
---

[iOS/OS X内存管理(一)：基本概念与原理](http://www.cocoachina.com/ios/20160219/15330.html)对内存管理的概念讲的很清楚。

<!-- more -->

摘抄一些重要信息。

assign对应就是\_\_unsafe_unretained，它跟__weak相似，被它修饰的变量都不持有对象的所有权，但不相同的是，当变量指向的对象的RC为0时，变量并不设置为nil，而是继续保存对象的地址。
