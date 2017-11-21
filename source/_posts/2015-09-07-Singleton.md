---
layout: post
comments: true
categories: [design_pattern,objective-c]
title: Singleton
published: true
---


## Singleton implementation
[Objective-C中单例模式的实现](http://cocoa.venj.me/blog/singleton-in-objc/)

[Singleton Design Pattern for Objective-C](http://www.makebetterthings.com/iphone/singleton-design-pattern-for-objective-c/)

<!-- more -->

```objc
+ (instancetype)sharedInstance
{
    static dispatch_once_t once;
    static id sharedInstance;
    dispatch_once(&once, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}
```

## Avoid abusing singleton
[避免滥用单例](http://objccn.io/issue-13-2/)

Singleton introduces globla variable, which may lead to coupling of far-away components.

Note the life circle of an object, to see if it confirm to "will always has one instance". If NO, we can not use Singleton here.