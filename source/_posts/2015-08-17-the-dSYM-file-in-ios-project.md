---
layout: post
comments: true
categories: [ios]
title: the .dSYM file in ios project
---

This article is mainly from the following post: [How is a .dSYM file created?](http://stackoverflow.com/questions/22460058/how-is-a-dsym-file-created).


### Description

A **.dSYM** file is a *debug symbols file*. It is generated when in xcode the `Strip Debug Symbols` setting is enabled and `Debug Infomation Format` are set to `DWARF with dSYM File` in the build settings of your project.

<!-- more -->

### Creatation

Xcode creates the .dSYM file automatically for you when you use the Archive option. The created archive contains your app and its dSYM and is stored in `~/Library/Developer/Archive`.

### Usage

When this setting is enabled, symbol names of your objects are removed from the resulting compiled binary (one of the many countermeasures to try and prevent would be hackers/crackers from reverse engineering your code, amongst other optimisations for binary size, etc.).

They are useful for re-symbolicating your crash reports. With a stripped binary, you won't be able to read any crash reports without first re-symbolicating them. Without the dSYM the crash report will just show memory addresses of objects and methods. Xcode uses the dSYM to put the symbols back into the crash report and allow you to read it properly.

dSYMs and executables have an embedded UUID which matches. So every time a build is done will cause both to get a new UUID. The consequence is that symbolication only works if the UUID of the binary that caused a crash matches the UUID of the dSYM that is used for symbolication.

