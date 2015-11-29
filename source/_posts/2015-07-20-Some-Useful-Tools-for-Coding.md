---
layout: post
comments: true
categories: [productivity]
title: Some Useful Tools for Coding
---

## Using plugins for Xcode

Using [Alcatraz](http://alcatraz.io/) to manage plugins in Xcode.

Some recommended plugins:

* [ColorSenseRainBow](https://github.com/NorthernRealities/ColorSenseRainbow)
    
    A plugin for Xcode that shows colours and allows you to modify them. It works for both UIColor and NSColor in Swift and Objective-C.

* [AutoHighlightSymbol](https://github.com/chiahsien/AutoHighlightSymbol)

    Xcode can highlight instances of selected symbol, but what it does is to add dash lines under the instances, which is hard to be noticed.

    AutoHighlightSymbol is a plugin for Xcode, it adds background highlight color to those instances. It's super useful while you're tracing codes, especially when you want to figure out where a specific variable is used in a certain method.

* [Backlight-for_Xcode](https://github.com/limejelly/Backlight-for-XCode)

    Highlights the current editing line in Xcode.

* [VVDocument-Xcode](https://github.com/onevcat/VVDocumenter-Xcode)

    Use this plug-in for xcode to enable xcode support automatically adding comments to our code, using Javadoc style.
With these comments, we can alt+click a used function to see some useful info.


## kdiff

<!-- more -->

Use **kdiff** for comparing and merging files or folders.

## goagent for VPN

For Mac, refer to [this post](http://blog.csdn.net/yanzi1225627/article/details/42886391).

If you meet with httplib.BadStatusLine error while running `python uploader.py`, refer [here](https://code.google.com/p/goagent/issues/detail?can=2&start=0&num=100&q=&colspec=ID%20Opened%20Reporter%20Modified%20Summary%20Stars&groupby=&sort=&id=18501) (tricky here, as the link need vpn to get):

* 关闭谷歌账户的两部验证功能。
* 并且到 [这里](https://www.google.com/settings/security/lesssecureapps) 确认"不够安全的应用的访问权限"已启用。