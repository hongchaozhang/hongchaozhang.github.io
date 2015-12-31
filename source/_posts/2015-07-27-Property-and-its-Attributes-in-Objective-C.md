---
layout: post
comments: true
categories: [ios,objective-c]
title: Property and its Attributes in Objective-C
---

All the attributes of a property defines how the compiler generate the `getter` and `setter` accessors.

* atomic / nonatomic
* strong / weak: used for ARC.
* assign / retain / copy: go to [here](http://blog.csdn.net/jiarusun000/article/details/6991249) for reference. These properties define how the compiler generate the `setter` accessor.
* readonly / readwrite: if a property is declared as `readonly`, the compiler will only declare the getter accessor, so that you can not call setter accessor.

<!-- more -->

Apart from above, `@synthesize` define the instance variable used for accessors. `@synthesize` can only be used to property, not iVar. For more info, see [Property and Its Attributes in Objective-C](http://hongchaozhang.github.io/blog/2015/07/27/Property-and-its-Attributes-in-Objective-C/), and <del>[Property vs Instance Variable (iVar) in objective-c](http://hongchaozhang.github.io/code/2015/07/22/Property-vs-Instance-Variable(iVar)-in-Objective-C.html)</del> is deprecated.

[Here](http://www.cnblogs.com/andyque/archive/2011/08/03/2125728.html) has a detail description. And the useful part:
 
* 什么时候用assign、什么时候用retain和copy呢？就看你想让编译器怎么实现该Property的setter函数了。推荐做法是NSString用copy,delegate用assign（且一定要用assign，<del>不要问为什么，只管去用就是了，以后你会明白的。</del>如果用retain，容易造成retain cycle。），非objc数据类型，比如int，float等基本数据类型用assign（默认就是assign），而其它objc类型，比如NSArray，NSDate用retain。
* 如果你自己实现了getter和setter的话，atomic/nonatomic/retain/assign/copy这些只是给编译的建议，编译会首先会到你的代码里面去找，如果你定义了相应的getter和setter的话，那么好，用你的。如果没有，编译器就会根据atomic/nonatomic/retain/assign/copy这其中你指定的某几个规则去生成相应的getter和setter。 
