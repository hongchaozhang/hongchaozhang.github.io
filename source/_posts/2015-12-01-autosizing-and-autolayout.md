---
layout: post
title: "AutoSizing and AutoLayout"
date: 2015-12-01 11:20:38 +0800
comments: true
categories: [ios, objective-c]
---

参考：

* [先进的自动布局工具箱](http://objccn.io/issue-3-5/)
* [AutoLayout Guide](https://developer.apple.com/library/prerelease/ios/documentation/UserExperience/Conceptual/AutolayoutPG/ProgrammaticallyCreatingConstraints.html#//apple_ref/doc/uid/TP40010853-CH16-SW1)
* [AutoLayout Table View](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/AutolayoutPG/WorkingwithSelf-SizingTableViewCells.html)

摘要：

* AutoSizing和AutoLayout都是用来自动确定试图大小和位置的方法，区别在于：

    * AutoSizing: 只针对SuperView
    * AutoLayout: 针对SuperView和兄弟View
<!-- more -->

* AutoLayout这边可以考虑使用[Masonry](https://github.com/SnapKit/Masonry)，代码的可读性就能好很多。

* ios9.0开始：
    * 可以使用UIStackView（Horizontal / Vertical）帮助进行AutoLayout，因为UIStackView使用AutoLayout进行内部view的布局。
    * 在进行AutoLayout的时候，可以使用UILayoutGuide帮助布局。UILayoutGuide比UIView轻量级很多，通过UIView的`addLayoutGuide:`方法加入。

* 如果还有使用Frame的，可以考虑一下使用[这个项目](https://github.com/casatwy/HandyAutoLayout)。

    * 这个项目里面提供了Frame相关的方便方法(UIView+LayoutMethods)，里面的方法也基本涵盖了所有布局的需求，可读性非常好，使用它之后基本可以和CGRectMake说再见了。因为天猫在最近才切换到支持iOS6，所以之前天猫都是用Frame布局的，在天猫App中，首页，范儿部分页面的布局就使用了这些方法。使用这些方便方法能起到事半功倍的效果。
