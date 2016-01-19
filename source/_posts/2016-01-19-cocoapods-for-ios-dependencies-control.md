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

{% highlight text %}
sudo gem install cocoapods
{% endhighlight %}

第一次使用之前需要设置CocoaPods：

{% highlight text %}
pod setup
{% endhighlight %}

此时需要耐心等待，因为CocoaPods会将这些podspec索引文件更新到本地的 ~/.cocoapods/目录下，这个索引文件比较大，有80M左右，比较慢。

### 使用

#### 安装依赖库

使用时需要新建Podfile文件，格式如下：

{% highlight text linenos %}
platform :ios
pod 'JSONKit',       '~> 1.4'
pod 'Reachability',  '~> 3.0.0'
pod 'ASIHTTPRequest'
pod 'RegexKitLite'
{% endhighlight %}

然后你将编辑好的Podfile文件放到你的项目根目录中，执行如下命令即可：

{% highlight text linenos %}
cd "your project home"
pod install
{% endhighlight %}

现在，你的所有第三方库都已经下载完成并且设置好了编译参数和依赖，你只需要记住如下两点即可：

* 使用CocoaPods生成的 .xcworkspace 文件来打开工程，而不是以前的 .xcodeproj 文件。
* 每次更改了Podfile文件，你需要重新执行一次pod update命令。

#### 搜索依赖库

你如果不知道cocoaPods管理的库中，是否有你想要的库，那么你可以通过

{% highlight text %}
pod search
{% endhighlight %}

命令进行查找。

### 问题

当我在使用*kingpin*第三方库的时候，出现了下面的问题：

{% highlight text %}
Specs satisfying the `kingpin` dependency were found, but they required a higher minimum deployment target.
{% endhighlight %}

通过修改Podfile的第一行：

{% highlight text %}
platform :ios
{% endhighlight %}

为

{% highlight text %}
platform :ios, '7。0'
{% endhighlight %}

解决。

原理参考：[Unable to satisfy the following requirements with Podfile, but they required a higher minimum deployment target. #4373](https://github.com/CocoaPods/CocoaPods/issues/4373)。
