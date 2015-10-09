---
layout: post
comments: true
categories: [ios,xcode]
title: Warning Messages in xcode
---

[Compiler Warnings for Objective-C Developers](http://oleb.net/blog/2013/04/compiler-warnings-for-objective-c-developers/) is a good post for describing warning messages for Objective-C in xcode. A Chinese version can be found [谈谈Objective-C的警告](http://onevcat.com/2013/05/talk-about-warning/).

Some important things are marked here.

Two ways to modify complier's warning setting: **UI Method** and **Custom Compiler Flags Method**.

<!-- more -->

## UI Method

In *Project Navigator*, choose the project. On the right, under *Build Settings*, `Apple LLVM 6.1 - Warnings - Objective c` and `Apple LLVM 6.1 - Warnings - Objective C and ARC` are Objective C specific settings. You may also want to see some setttings for all languages, including Objective C in `Apple LLVM 6.1 - Warnings - All languages`.

## *Custom Compiler Flags* Method

Under *Build Settings*, find `other warning flags` in `Apple LLVM 6.1 - Custom Compiler Flags`. In this section, you can use `-W...` like commands for warning settings.

For example, use `-Wall` to display all warnings (actually, not *All*), use `-Wno-unused-variable` to indicate not displaying *unused variable* warnings. Use space between differenct commands, like `-Wall -Wno-unused-variable`.

Using this way, we can set for all kinds of warnings, some of which can not be set by *UI Method* above.

Go to the following two refrences for details on `-Wall`, `-Wextra` and `-Weverything`:

* [Compiler Warnings for Objective-C Developers](http://oleb.net/blog/2013/04/compiler-warnings-for-objective-c-developers/)
* [谈谈Objective-C的警告](http://onevcat.com/2013/05/talk-about-warning/).

The following paragraph comes from the first reference:

If you encounter a particular warning that you actively want to suppress, check the build log. The compiler will tell you the name of each warning it has issued (-Wunused-variable in this example). You can use this name to selectively disable (with -Wno-unused-variable) or enable this specific warning in your project. In my experience, you will come up with a very short list of warnings you want to disable (probably no more than a handful).

Attach one image to indicate the place (red circles) to find the warning type:

![006_warning_type_from_build_log.png](/images/006_warning_type_from_build_log.png)