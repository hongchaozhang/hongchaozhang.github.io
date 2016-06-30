---
layout: post
title: "Objective-C里Category和Inheritence中的Property和Method的可见性"
date: 2016-06-16 21:48:54 +0800
comments: true
categories: [ios, objective-c]
---
[Objective-C - Private vs Protected vs Public](http://stackoverflow.com/questions/4869935/objective-c-private-vs-protected-vs-public)


CONCLUSION：
    /*!
     *  Dot(.) operation is for property only, and has nothing to do with ivar.
     *  And I think -> operation is for ivar only, and has nothing to do with property.
     */
ivar中的关键字public、private和protected只对ivar有效，表明的是ivar的可见性，默认protected。子类中想用继承来的ivar，需要使用->操作符，不能使用dot操作符（dot操作符只用于property）。实例中想用ivar，只能用具有public属性的ivar。


[实现public、private和protected属性和方法](http://stackoverflow.com/questions/12633627/expose-a-private-objective-c-method-or-property-to-subclasses)

[很好的例子:](http://stackoverflow.com/questions/3725857/protected-methods-in-objective-c)
```objc
/////// SuperClass.h
@interface SuperClass

@end

/////// SuperClass.m
@implementation SuperClass
- (void) protectedMethod
{}
@end

/////// SubClass.h
@interface SubClass : SuperClass
@end

/////// SubClass.m
@interface SubClass (Protected)
- (void) protectedMethod ;
@end

@implementation SubClass
- (void) callerOfProtectedMethod
{
  [self protectedMethod] ; // this will not generate warning
} 
@end
```

[另外一个例子](http://bootstragram.com/blog/simulating-protected-modifier-with-objective-c/)

OCPlayground project

CONCLUSTION: We can use @property in Extension the same way as .h file of the class. Compiler can generate the setter and getter methods for us. But in Category, compiler will not generate the setter and getter methods for us, you need to implement them manually or by using @dynamic to tell the compiler that the setter and getter methods are implemented somewhere else.

The difference comes from the fact that instance variables can be added into Extension but not Category.



CONCLUSION: to define whether a category can use the extended class's property or method, just define whether the property or method is in one "interface" that the category can "see".


CONCLUSION: visibility(private, public, protected) does not affect methods. methods are as good as public when visible to clients (and potential pitfalls/bugs when invisible to clients). instead, visibility affects instance variables.


CONCLUSION: The same priciple as Category: to define whether I can use a property or method (in super class), just define whether the property or method is in an "@interface" the code (where you are trying to use the property or method) can "see". 

One exception: performSelector: can run method that are not ready in compile time but ready in runtime. However there will be one warning from the compiler. You can dismiss the warning by declaring a method with the same name in the class in which you are coding, but will introduce another warning saying that "Method definition for *** is not found".