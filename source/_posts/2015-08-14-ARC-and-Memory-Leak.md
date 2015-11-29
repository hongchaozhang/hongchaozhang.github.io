---
layout: post
comments: true
categories: [ios,objective-c]
title: ARC and GC
---

The following post mainly comes from [ARC vs GC](http://docs.elementscompiler.com/Concepts/ARCvsGC/) and [Re: ARC replacing GC? from Chris Lattner's mail list](http://lists.apple.com/archives/objc-language/2011/Jun/msg00013.html).

Also reference some posts on memory leak, including [What kind of leaks does automatic reference counting in Objective-C not prevent or minimize?](http://stackoverflow.com/questions/6260256/what-kind-of-leaks-does-automatic-reference-counting-in-objective-c-not-prevent/6388601#6388601) and [Debugging retain cycles in Objective-C: four likely culprits](http://www.reigndesign.com/blog/debugging-retain-cycles-in-objective-c-four-likely-culprits/).

<!-- more -->

Add one more article: [Objective-c 内存管理的历史和参考资料](http://www.pchou.info/ios/2015/06/05/oc-memory-management.html).

## Garbage Collection

Garbage Collection (or GC for short) is the technique used for life cycle management on the .NET and Java platforms. The way GC works i/Users/hongchaozhang/Develop/octopress/source/_posts/2015-07-09-Basic-Git-Commands.mds that the runtime (either the Common Language Runtime for .NET or the Java Runtime) has infrastructure in place that detects unused objects and object graphs in the background.

> Unfortunately, garbage collection does have a down side. Garbage collection is only available on MacOS X Version 10.5 or above. It is not available, currently (not sure if it is still true today), on iPhone, iPad, or any of the less common platforms, such as Linux or Windows.

This happens at indeterminate intervals (either after a certain amount of time has passed, or when the runtime sees available memory getting low), so objects are not necessarily released at the exact moment they are no longer used.

### Advantages of Garbage Collection

GC can clean up entire object graphs, including retain cycles.
GC happens in the background, so less memory management work is done as part of the regular application flow.

### Disadvantages of Garbage Collection

Because GC happens in the background, the exact time frame for object releases is undetermined.
When a GC happens, other threads in the application may be temporarily put on hold.

## Automatic Reference Counting

Automatic Reference Counting (ARC for short) as used on Cocoa takes a different approach. Rather than having the runtime look for and dispose of unused objects in the background, the compiler will inject code into the executable that keeps track of object reference counts and will release objects as necessary, automatically. In essence, if you were to disassemble an executable compiled with ARC, it would look (conceptually) as if the developer spent a lot of time meticulously keeping track of object life cycles when writing the code — except that all that hard work was done by the compiler.

### Advantages of Automatic Reference Counting

Real-time, deterministic destruction of objects as they become unused.
No background processing, which makes it more efficient on lower-power systems, such as mobile devices.

### Disadvantages of Automatic Reference Counting

Cannot cope with retain cycles.

> **Note:** Another couple of significant memory-related concerns are the handling of **Core Foundation objects** and **memory allocated using malloc()** for types like char*. 
> >ARC does only manages Objective-C objects, so you'll still need to deal with `malloc()` related objects by yourself. 
> >
> > (**Not very clear about this**)Core Foundation types can be particularly tricky, because sometimes they need to be bridged across to matching Objective-C objects, and vice versa. This means that control needs to be transferred back and forth from ARC when bridging between CF types and Objective-C. 

## Retain Cycle

A so-called retain cycle happens when two (or more) objects reference each other, essentially keeping each other alive even after all external references to the objects have gone out of scope. 

The **Garbage Collection** works by looking at "reachable" objects, it can handle retain cycles fine, and will discard entire object graphs that reference each other, if it detects no outside references exist.

Because **Automatic Reference Counting** works on a lower level and manages life cycles based on reference counts, it cannot handle retain cycles automatically, and a retain cycle will cause objects to stay in memory, essentially causing the application to "leak" memory.
