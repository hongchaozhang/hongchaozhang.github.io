---
layout: post
comments: true
categories: [productivity]
title: Some Useful Tools for Coding
---

<!-- more -->

## kdiff和p4merge

1. **kdiff**可以用来比较文件和文件夹的不同，也可以集成到Mac的Terminal中。
2. 相比于**kdiff**， **p4merge**的界面更友好，也一样可以集成到Terminal中。唯一的不足是不能比较两个folder的不同。

## node版本管理
使用nvm管理node的版本非常方便。

## python版本管理
用[**pyenv**](https://github.com/pyenv/pyenv)管理python的不同版本，并在不同版本之间自由切换。使用方法和**nvm**类似。

也可以参照[Installing multiple versions of Python on Mac using Homebrew](https://www.chrisjmendez.com/2017/08/03/installing-multiple-versions-of-python-on-your-mac-using-homebrew/)。虽然说运行`source ~/.bash_profile`可以使配置生效，但是我这边还是没有办法切换成功。最后还是重启了Terminal才成功切换python版本。

## Debugging Network

### Charles
用Charles设置代理，抓取数据包。

### Network Link Conditioner
设置网络状态，比如Edge，3G，wifi等。设置界面：
![network_link_conditioner.png](/images/network_link_conditioner.png)

## Goagent for VPN

For Mac, refer to [this post](http://blog.csdn.net/yanzi1225627/article/details/42886391).

If you meet with httplib.BadStatusLine error while running `python uploader.py`, refer [here](https://code.google.com/p/goagent/issues/detail?can=2&start=0&num=100&q=&colspec=ID%20Opened%20Reporter%20Modified%20Summary%20Stars&groupby=&sort=&id=18501) (tricky here, as the link need vpn to get):

* 关闭谷歌账户的两部验证功能。
* 并且到 [这里](https://www.google.com/settings/security/lesssecureapps) 确认"不够安全的应用的访问权限"已启用。

## Using Plugins for Xcode

[2020.05.22 Update]自从XCode 8.0开始，Apple就禁止了插件的使用。

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
