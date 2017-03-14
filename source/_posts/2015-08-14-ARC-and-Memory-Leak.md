---
layout: post
comments: true
categories: [ios,objective-c]
title: 自动引用计数(ARC)和垃圾回收(GC)
---

在Java或者Javascript的开发中，我们会碰到垃圾回收（Garbage Collection，GC），它和iOS中的自动引用计数（Auto Reference Count，ARC）有什么区别呢？

<!-- more -->

## 垃圾回收简介

参考[iOS 面试题（16）：解释垃圾回收的原理](https://mp.weixin.qq.com/s?__biz=MjM5NTIyNTUyMQ==&mid=2709545319&idx=1&sn=42783a72aa6c884b9292054edf2e416e&chksm=828f0bb9b5f882af12a903ba9f0f9063deecf6710f6ab50b3ebcaf6c1b49d52b3f3fb56bada1&scene=0&pass_ticket=Rv%2Fk3YeUUuKkXhjvYLryk470ImsKulGNm6K1MyPs5tU9Oxl6j2olw0D25oUcORSu#rd)。

作为 iOS 开发者，了解一下这个世界上除了 ARC 之外最流行的内存管理方式，还是挺有价值的。

垃圾回收这种内存管理机制最早由图灵奖获得者John McCarthy在1959年提出，垃圾回收的理论主要基于一个事实：**大部分的对象的生命期都很短**。

所以，GC 将内存中的对象主要分成两个区域：Young区和Old区。对象先在Young区被创建，然后如果经过一段时间还存活着，则被移动到Old区。（其实还有一个Perm区，但是内存回收算法通常不涉及这个区域）

Young区和Old区因为对象的特点不一样，所以采用了两种完全不同的内存回收算法。

Young区的对象因为大部分生命期都很短，每次回收之后只有少部分能够存活，所以采用的算法叫Copying算法，简单说来就是直接把活着的对象复制到另一个地方。Young区内部又分成了三块区域Eden区、From区、To 区。每次执行Copying算法时，即将存活的对象从Eden区和From区复制到 To 区，然后交换From区和To区的名字（即From区变成To区，To区变成From区）。

Old区的对象因为都是存活下来的老司机了，所以如果用Copying算法的话，很可能90%的对象都得复制一遍了，不划算啊！所以Old区的回收算法叫Mark-Sweep算法。简单来说，就是只是把不用的对象先标记（Mark）出来，然后回收（Sweep），活着的对象就不动它了。因为大部分对象都活着，所以回收下来的对象并不多。但是这个算法会有一个问题：它会产生内存碎片，所以它一般还会带有整理内存碎片的逻辑，在算法中叫做Compact。如何整理呢？早年用过Windows的硬盘碎片整理程序的朋友可能能理解，其实就是把对象插到这些空的位置里。这里面还涉及很多优化的细节，我就不一一展开了。

讲完主要的算法，接下来GC需要解决的问题就只剩下如何找出需要回收的垃圾对象了。为了避免ARC解决不了的循环引用问题，GC引入了一个叫做**可达性**的概念，应用这个概念，即使是有循环引用的垃圾对象，也可以被回收掉。下面就给大家介绍一下这个概念。

当GC工作时，GC认为当前的一些对象是有效的，这些对象包括：**全局变量**，**栈里面的变量**等，然后GC从这些变量出发，去标记这些变量“**可达**”的其它变量，这个标记是一个递归的过程，最后就像从树根的内存对象开始，把所有的树枝和树叶都记成可达的了。那除了这些可达的变量，别的变量就都需要被回收了。这就解决了**循环引用**带来的内存泄漏问题。

听起来很牛逼对不对？那为什么苹果不用呢？实际上苹果在OSX10.5的时候还真用了，不过在10.7的时候把GC换成了ARC。那么，GC有什么问题让苹果不能忍，这就是：**垃圾回收的时候，整个程序需要暂停**，英文把这个过程叫做：Stop the World。所以说，你知道Android手机有时候为什么会卡吧，GC就相当于春运的最后一天返城高峰。当所有的对象都需要一起回收时，那种体验肯定是当时还在世的乔布斯忍受不了的。

## 总结

### ARC相对于GC的优点

ARC工作在编译期，在运行时没有额外开销。
ARC的内存回收是平稳进行的，对象不被使用时会立即被回收。而GC的内存回收是一阵一阵的，回收时需要暂停程序，会有一定的卡顿。

### ARC相对于GC的缺点

GC真的是太简单了，基本上完全不用处理内存管理问题，而ARC还是需要处理类似循环引用这种内存管理问题。
GC一类的语言相对来说学习起来更简单。

另外，还可以参考：

* [ARC vs GC](http://docs.elementscompiler.com/Concepts/ARCvsGC/)
* [Re: ARC replacing GC? from Chris Lattner's mail list](http://lists.apple.com/archives/objc-language/2011/Jun/msg00013.html).
