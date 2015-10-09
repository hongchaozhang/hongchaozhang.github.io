---
layout: post
comments: true
categories: [ios]
title: Some Frameworks in iOS Development
---

Reference [here](http://www.open-open.com/lib/view/open1343210425380.html).

<!-- more -->

### Cocoa and Cocoa Touch

是在Mac OS X系统上原生的一个编译环境。他包含两个框架，其实就是一系列的类库，Foundation和AppKit。

在你的iPhone等掌上设备上，使用的则是他的一个子类 - Cocoa Touch。他所支持的Foundation框架与Cocoa相同，但他的用户图形类库为UIKit，它是为掌上设备特殊设计，提供了你设备上的界面。

Cocoa Touch与Cocoa一个比较鲜明的区别就是Cocoa Touch并不支持垃圾回收机制，这就意味着你必须在你的代码里管理好你的内存。

### UIKit and AppKit

UIKit是iOS上的用户图形包。UI开头的类都来自于这个框架。
AppKit是Mac OS X上的用户图形不同，类名以NS开头。

## some frameworks

![ios_frameworks.png](/images/001_ios_frameworks.png)

### Foundation

### UIKit

### Core Data

### Core Graphics

### Core Animation

### OpenGL ES