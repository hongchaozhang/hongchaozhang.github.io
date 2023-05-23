---
layout: post
title: "如何控制iOS应用的屏幕方向"
date: 2019-05-21 18:24:35 +0800
comments: true
categories: [ios, xcode]
---

<!-- more -->

## 背景

一个iOS应用默认都会支持所有的是个方向，当用户旋转屏幕的时候，应用会自动旋转。

有些时候，这可能不是我们想要的。比如你设计了一个只支持竖屏方向的应用，但是又想在某些时候支持Landscape模式，比如播放视频的时候。iOS应用有很多地方的设置会影响屏幕方向，iOS9之后，iPad又支持了split view，使得这个控制更加复杂。

## 总起

iPhone比较简单，因为其没有spit view的功能，iPad因为有了spilt view功能，在屏幕方向的控制上更复杂一些。

首先，需要明确：有哪些因素会影响到App的屏幕方向？

**1. Project设置（info.plist）**

有两个地方可以进行该项设置：

* Project->Target->General->Device Orientation
  
  ![screen orientation project setting](/images/ScreenOrientationProjectSetting.png)

* Project的info.plist配置文件

  ![screen orientation info plist](/images/ScreenOrientationInfoPlist.png)

这两个地方的设置是一致的：在一个地方改动，另一个地方会同步修改。其中：info.plist中的“Supported interface orientations (iPad)”属性对应于iPad的设置（Device选择iPad），info.plist中的“Supported interface orientations”属性对应于iPhone和Universal的设置（Device选择iPhone或者Universal，这两项的设置始终保持一致）。

**2. 在代码中设置应用支持的屏幕方向**

有两种方法可以在代码中设置应用支持的屏幕方向：

* `UIApplicationDelegate`中的`supportedInterfaceOrientationsForWindow:`方法
* 每个`UIViewController`还可以通过`supportedInterfaceOrientations`方法设置自己支持的屏幕方向

系统会自动将两种方法中支持的屏幕方向取交集，作为最终该view controller支持的屏幕方向。如果交集为空，那么应用将会Crash。

**3. `UIViewController`中的`shouldAutorotate`属性**

该属性是只读属性，用来控制该view controller可不可以旋转。可以在自己的view controller中将其override，返回自己的逻辑，甚至将其override为读写属性，可以在其它地方进行设置。比如：

```
override public var shouldAutorotate: Bool {
    get {
        return self.shouldAutorotateVariable
    }
    set {
        self.shouldAutorotateVariable = newValue
    }
}
```

其中`shouldAutorotateVariable`为view controller中自定义的一私有变量。

## iPhone

如果某个view controller中的`shouldAutorotate`被设置为`false`，那么系统将忽略下面的设置：

* `UIApplicationDelegate`中的`supportedInterfaceOrientationsForWindow:`方法
* 该`UIViewController`通过`supportedInterfaceOrientations`方法设置的自己支持的屏幕方向

系统只考虑用户在“Project设置（info.plist）”中的设置。

如果某个view controller中的`shouldAutorotate`未被重写（或者被重写为`true`），那么系统将优先考虑使用下面两个设置的交集：

* `UIApplicationDelegate`中的`supportedInterfaceOrientationsForWindow:`方法
* 该`UIViewController`通过`supportedInterfaceOrientations`方法设置的自己支持的屏幕方向

如果没有以上两个设置，再使用“Project设置（info.plist）”中的设置。


## iPad

从iOS9开始，iPad开始支持split view功能。关于这个功能的设置说明，可以参考苹果官方文档：[Slide Over and Split View Quick Start](https://developer.apple.com/library/archive/documentation/WindowsViews/Conceptual/AdoptingMultitaskingOniPad/QuickStartForSlideOverAndSplitView.html#//apple_ref/doc/uid/TP40015145-CH13-SW1)。简单的说，就是：如果info.plist中的“Supported interface orientations (iPad)”属性对应的值包含了四个方向，同时`UIRequiresFullScreen`对应的值为`NO`，那么系统默认该应用支持split view属性，同时系统将忽略下面两处代码：

* `UIApplicationDelegate`中的`supportedInterfaceOrientationsForWindow:`方法
* `UIViewController`通过`supportedInterfaceOrientations`方法设置的自己支持的屏幕方向

以及`UIViewController`中`shouldAutorotate`的值。

也就是说：支持split view的应用将不能被禁止旋转，至少不能通过本文中的方法进行禁止旋转。

如果info.plist中的“Supported interface orientations (iPad)”属性对应的值未包含四个方向，或者“UIRequiresFullScreen”对应的值为`NO`，那么该应用不支持split view功能，其屏幕方向控制方法同iPhone相同。

> 注意：对于“Project设置（info.plist）”设置，建议在info.plist中进行，直接设置一下三个属性的值：
> * Supported interface orientations (iPad)
> * Supported interface orientations
> * UIRequiresFullScreen
> 
> 在Project->Target->General->Device Orientation中进行设置，有点迷惑性：因为即使“Device”选的是“Universal”，“iPad”下面的设置也会起作用。

## 参考

1. [Controlling Screen Orientation of iOS Apps](https://mobiarch.wordpress.com/2017/04/22/controlling-screen-orientation-of-ios-apps/)
2. [iOS 9 supportedInterfaceOrientations not working](https://stackoverflow.com/questions/32782044/ios-9-supportedinterfaceorientations-not-working/32782517#32782517)
3. [Slide Over and Split View Quick Start](https://developer.apple.com/library/archive/documentation/WindowsViews/Conceptual/AdoptingMultitaskingOniPad/QuickStartForSlideOverAndSplitView.html#//apple_ref/doc/uid/TP40015145-CH13-SW1)