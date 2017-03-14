---
layout: post
title: "微信小程序"
date: 2017-01-12 14:18:20 +0800
comments: true
categories: [mobile]
---

## 背景
微信小程序项目2016.1.9启动，一年后的2017.1.9发布，正好是乔布斯发布iPhone（2007.1.9）整整十年后的同一天（12月28日微信公开课时，张小龙曾说发布日期是随便挑了一天）。

<!-- more -->

**版本需求**：微信更新至iOS6.5.3版本或Android6.5.3版本。

<img src="/images/wechat_micro_program_1.png" alt="wechat_zhangxiaolong" width="360">

<img src="/images/wechat_micro_program_2.png" alt="wechat_zhangxiaolong_comment" width="360">

## 小程序简介

### 小程序入口

1. 小程序入口在哪？

    发现->小程序
    
    <img src="/images/wechat_micro_program_7.jpg" alt="where is micro program" width="360">

2. 我怎么看不到小程序入口？

    至少使用一个。

3. 怎么使用第一个？

    搜索或者扫描二维码。

### 关于小程序的几个问题

1. 小程序的入口在哪里？

    哦，小程序在微信是没有官方入口的。如果你没有运行任何一个小程序的话，就没有入口，就像你没有订阅公众号就看不到入口一样。二维码是小程序的入口之一。
    
2. 小程序商店？

    哦，对不起，这个也没有。微信一直秉承去中心化的原则，没有下载中心，没有分类，没有排行，也不会有推荐。与公众号的朋友圈分享类似，未来小程序也会依赖社会化推荐，那是一种不同形态的推荐，不会因为你用过一次日程管理软件而不停的给你推荐类似的软件。

3. 小程序会有订阅关系吗？

    也没有。用户和小程序只有访问关系，而不是粉丝关系。

4. 小程序能否搜到呢？

    能搜到，但是会限制搜索的能力，避免滥用。小程序不是基于流量分发的模式，只有在需要的时候才用到。至少在现在看来，微信能索引到的小程序数据太少了，就是简单的标题和最多 5 个 tag（标题还必须是精准匹配，但是腾讯自己的小程序好像不是这样。），用这点数据想准确描述小程序的能力，太不现实了。比如，我做了个小程序，提供各个城市攻略，但当用户想找北京攻略，进行搜索，很可能完全找不到它，因为我没法告诉微信，我都能支持哪些城市有哪些方面的攻略（只有 5 个 tag 嘛），那微信当然就不能帮用户找到它所需的小程序，这种搜索能力和大搜索、各种搜索 One Box 相比，太受限了。
    
### 小程序与公众号的区别

  --- | 公众号 | 小程序 |
--- | --- | ---
定位 | 服务于营销与信息传递 | 面向产品与服务
实现技术 | 基于H5 | 基于微信自身开发环境与开发语言
体验 | 延迟较大 | 接近原生app
推送 | 能 | 否
订阅关系 | 有 | 无
能够搜索到 | 无限制 | 有限制
分享范围 | 好友、群、朋友圈 | 好友、群
桌面图标 | 有（android可以，ios不可以） | 有（android可以，ios不可以）
长按二维码识别 | 可以 | 不可以
*外链* | *允许* | *禁止*

最重要的应该是最后一条，这也能说明微信试图通过小程序构建自己的生态圈。

## 技术与开发

微信小程序的提出就不是技术导向的，他和微软开发一个新的语言不同，也和 Facebook 的 React 不同，他的产品色彩和利益相关更浓厚，更像是为了构建微信生态。

以下内容来自[官方开发文档](https://mp.weixin.qq.com/debug/wxadoc/dev/)。

**运行环境：**

微信小程序运行在三端：iOS、Android 和 用于调试的开发者工具。

三端的脚本执行环境聚以及用于渲染非原生组件的环境是各不相同的：

* 在 iOS 上，小程序的 javascript 代码是运行在 JavaScriptCore 中，是由 WKWebView 来渲染的，环境有 iOS8、iOS9、iOS10。
* 在 Android 上，小程序的 javascript 代码是通过 X5 JSCore来解析，是由 X5 基于 Mobile Chrome 37 内核来渲染的。
* 在开发工具上，小程序的 javascript 代码是运行在 nwjs 中，是由 Chrome Webview 来渲染的。

**对javascript库的支持：**

用到window对象和document对象的库，都无法使用，比如jquery。

## 几个问题

### 苹果审核问题

应用号的入口是在发现 tab 购物游戏下面，之所以叫小程序是因为 App Store 审核不通过应用号三个字，并且已经和苹果约法三章应用号不能做游戏产品，以及，一个用户只能添加 20 个。
作为一个只写 Script 语言的人我是很支持腾讯干掉 PhoneGap/Cordova/Ionic。不过我就想问一件事，苹果能允许么？

小程序安装或者升级的话要不要苹果再审核一遍？这就跟用 ReactJS Live Update 一样，属于苹果的灰色地带，一个普通 App 这么做可以睁一只眼闭一只眼，有潜力做成 OS 的话苹果能答应么？

> Apple’s guidelines explicitly permit you to push executable code directly to your app, bypassing the App Store, under these two conditions:
The code is run by Apple’s built-in WebKit framework or JavascriptCore.
The code does not provide, unlock or enable additional features or functionality.

安装一个 App 就相当于微信不用苹果审核就增加一项功能，这比加个 Patch 快速修复一个 Bug 可过份*多了。

鉴于微信在苹果发布会上出现的频率，微信团队很可能跟苹果沟通过了，所以像 360 那样被下架的可能性比较小，不过如果别的厂子看见了也蠢蠢欲动，那可是动摇了 App Store 的根基啊。

**可能与此相关的事情：**

1. 应用号改名小程序。
2. 苹果系统上面的小程序，不能放置图标到桌面。
3. 没有应用商店。没有下载中心，没有分类，没有排行，没有推荐。
 
### 微信关系链问题

当前一些应用使用微信号登陆时可以获取的权限大致如下：

![wechat_privillage](/images/wechat_micro_program_3.png)

1. 只开放公开信息
    昵称、头像，其实也就是登陆 ID，所有的开发者都可以接入，比如航旅纵横。
    
2. 有条件开放
    开放共同使用的好友。比如大众点评。所以基于大众点评，你可以看到有好友去哪。比如美团外卖，可以看到好友头条，比如 58 同城旗下的转转，能看到好友在卖，但很抱歉，这个关系链的开放，目前只有腾讯投资的公司，才能享受如此特权。

3. 更大程度的开放
    除了登陆和好友关系，还开放了朋友圈权限，能把一些操作直接输送到朋友圈做动作，这个很抱歉，只有腾讯自由的产品才有，比如，QQ 音乐、腾讯视频等。

大概的逻辑是：

1. 亲儿子，能得到全部关系。
2. 干儿子，能得到重合的关系，你用，我也用，相互能看到，我用你不用，我不能跟你发生联系。
3. 外人，只能刷个脸，其他的免谈。

*目前小程序只开放公开信息。*

### 什么类型的产品适合接入小程序

<img src="/images/wechat_micro_program_4.png" alt="what is situable for micro program 1" width="480">

<img src="/images/wechat_micro_program_5.png" alt="what is situabel for micro program 2" width="480">

### 小程序是否向个人开放

申请过程中可以看到下面的页面，可以看出现在**小程序是不向个人开放的**。


![do_not_open_to_individual](/images/wechat_micro_program_6.png)