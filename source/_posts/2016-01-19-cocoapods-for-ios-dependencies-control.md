---
layout: post
title: "应用CocoaPods管理iOS的依赖库关系"
date: 2016-01-19 13:47:18 +0800
comments: true
categories: [productivity, ios]
---

就像Java有Maven，nodejs有npm一样，ios也有自己的库依赖管理工具：CocoaPods。

<!-- more -->
参考[用CocoaPods做iOS程序的依赖管理](http://www.cnblogs.com/iyuanxiaojun/p/4465850.html)。


### 安装与设置
Mac下使用自带的ruby的gem命令进行安装：

```
sudo gem install cocoapods
```

第一次使用之前需要设置CocoaPods：

```
pod setup
```

此时需要耐心等待，因为CocoaPods会将这些podspec索引文件更新到本地的 ~/.cocoapods/目录下，这个索引文件比较大，有80M左右，比较慢。

> 如果你等太久，可以试着cd到那个目录，用du -sh *来查看下载进度。

### 使用

#### 安装依赖库

使用时需要新建Podfile文件，格式如下：

```
platform :ios
pod 'JSONKit',       '~> 1.4'
pod 'Reachability',  '~> 3.0.0'
pod 'ASIHTTPRequest'
pod 'RegexKitLite'
```

然后你将编辑好的Podfile文件放到你的项目根目录中，执行如下命令即可：

```
cd "your project home"
pod install
```

现在，你的所有第三方库都已经下载完成并且设置好了编译参数和依赖，你只需要记住如下两点即可：

* 使用CocoaPods生成的 .xcworkspace 文件来打开工程，而不是以前的 .xcodeproj 文件。
* 每次更改了Podfile文件，你需要重新执行一次pod update命令。

#### 搜索依赖库

你如果不知道cocoaPods管理的库中，是否有你想要的库，那么你可以通过

```
pod search
```

命令进行查找。

### 问题

#### 1. required a higher minimum deployment target

当我在使用*[kingpin](https://github.com/itsbonczek/kingpin)*第三方库的时候，出现了下面的问题：

```
Specs satisfying the `kingpin` dependency were found, but they required a higher minimum deployment target.
```

通过修改Podfile的第一行：

```
platform :ios
```

为

```
platform :ios, '7.0'
```

解决。

如果问题仍然存在，将'7.0'改成'8.0'或者'9.0'，直到没有错误。

#### 2. 在Objective-C中引用swift写的CocoaPod库

当我在用*[ios-charts](https://github.com/danielgindi/ios-charts)*库的时候，首先出现了问题1。解决问题1之后，又出现了下面的问题：

```
[!] Pods written in Swift can only be integrated as frameworks; add `use_frameworks!` to your Podfile or target to opt into using it. The Swift Pod being used is: Charts
```

于是，将Podfile从

```
platform :ios, '9.0'
pod 'Charts'
```

改成

```
platform :ios, '9.0'
use_frameworks!
pod 'Charts'
```

解决了这个问题。接着就是如何在Objective-C的project中使用这个swift库了。

首先是官方文档[Swift and Objective-C in the Same Project](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html#//apple_ref/doc/uid/TP40014216-CH10-XID_77)，有点看不懂。

一些人说的：

```
@import Charts;
```

会报错。

很庆幸，StackOverflow上有人遇到了相同的问题：[Module not found error when importing Swift pod into Objective-C project](http://stackoverflow.com/questions/33931517/module-not-found-error-when-importing-swift-pod-into-objective-c-project)，在需要用到Charts库中的类的文件中，加入下面代码：

```
#import "Charts-Swift.h"
```

另外，注意，在Storyboard中使用库中类的时候，在*Module*框中填上*Charts*，如下：

![using_lib_class_in_storyboard](/images/using_lib_class_in_storyboard.jpg)

原理参考：[Unable to satisfy the following requirements with Podfile, but they required a higher minimum deployment target. #4373](https://github.com/CocoaPods/CocoaPods/issues/4373)。
