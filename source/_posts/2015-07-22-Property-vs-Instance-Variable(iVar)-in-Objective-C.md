---
layout: post
comments: true
categories: [ios,objective-c]
title: Property vs Instance Variable (iVar) in objective-c
---

This post is deprecated. Refer to [Propety, Instance Variable and @synthesize](http://hongchaozhang.github.io/blog/2015/12/19/propety-instance-variable-and-at-synthesize/).

## Description

To declare a variable in a objective-c class, we have the following two ways:

* Property
```objc
@interface Photo : NSObject
@property (nonatomic, strong) NSString *photographer;
@end
```
* Instance Variable (iVar)
```objc
@interface Photo : NSObject {
    NSString *photographer;
}
@end
```	
Then, what's the difference?

<!-- more -->

## Differences

### private vs public

For a private/protected variable, use *iVar*; for a public variable, use *property*. If you want to use the benifit of property attributes for a private variable, like retain, nonatomic etc., declare the property in the implementation file as a private property.

For an iVar, you can use `@private`, `@protected` and `@public`. But these attributes only influence the access of its subclass, and has nothing to do with the access ability of its instances. Go to [here](http://www.cnblogs.com/andyque/archive/2011/08/03/2125728.html) for reference.

### usage

Directly use an iVar inside the class, for example, `photographer`. But use `self.` for a property, for example, `self.photographer`.

### performance

iVar is faster than property, as property will call the `getter` or `setter` functions. When you declare a property, the compiler will add `getter` and `setter` functions for the property.

### @synthesize for property

**UPDATE：Just read this paragraph, omit the paragraphs behind.** 

**`@synthesize` is only for property, not iVar. It will help the property generate an instance variable, the getter and setter accessors for the property and use the generated instance variable in the getter and setter accessors**. For every property, complier will automatically synthesize it using `_propertyName`. The auto synthesize is the same as you add `@synthesize propertyName = _propertyName`. If you only add `@synthesize propertyName`, it is the same with `@synthesize propertyName = propertyName`, and if you define an iVar with the name `propertyName`, they will be synthesized. That is to say, in the accessors (getter and setter) of **property** `propertyName`, it will use **iVar** `propertyName`.

> **Note for property inheritance:** If the super class has a property declared as public, the subclass can inherit the property. But the auto synthesize mechnism will not sythesize the property automatically, and you can only use the getter and setter accessors of the superclass by using dot operation. If you want to synthesize manually, **Be Carefull!** You should avoid using the same iVar as them in the superclass. This will lead to an error message *"property 'propertyName' atemping to use instance variable 'InstanceVariableName' declared in super class 'SuperClassName'"*.
> 
> If you inherit a property from a **protocol**, you mush synthesize it, as the protocol only declares it, not synthesize it.

**Omit the following paragraphs in this section**

If you add `@synthesize photographer` in the implementation, compiler will automatically add an iVar `photographer` <del>and `_photographer`</del> to the class. You can directly use `photographer` <del>or `_photographer`</del> instead of `self.photographer` to get or set the value. The iVar method is faster, but keep in mind that it will not call the `getter` or `setter` method.

If you declare the class like this and don't `@synthesize photographer`:
```objc
@interface Photo : NSObject {
	NSString *photographer;
}
@property (nonatomic, strong) NSString *photographer;
@end
```
There are actually two `photographer` variables in the class: when you use `photographer` directly, you are using the iVar, and when you use `self.photographer`, you are using the property.

However, when you use `@synthesize photographer` in the implementation file, the compoler will add `photographer` variable for the property. That is to say, `photographer` will be the property, and the iVar will not be usable.

## References

A more detailed description is [here](http://stackoverflow.com/questions/9086736/why-would-you-use-an-ivar).

[reference](http://stackoverflow.com/questions/2032826/property-synthesize), answer by *Rachel Henderson*

<del>*Property* session of the </del>[<del>reference</del>](http://www.cocoadevcentral.com/d/learn_objectivec/). <del>This post is old fashioned</del>.

[Here](http://blog.csdn.net/likendsl/article/details/7345485) has a good explaination.

