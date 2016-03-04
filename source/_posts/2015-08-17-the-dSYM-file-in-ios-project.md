---
layout: post
comments: true
categories: [ios, xcode]
title: the .dSYM file in ios project
---

### Description

A **.dSYM** file is a *debug symbols file*. It is generated when in xcode:

* `Generate Debug Symbols` setting is enabled
* `Debug Infomation Format` is set to `DWARF with dSYM File` in the build settings of your project.

<!-- more -->

> Pay attention to the *debug/release/distribution* mode.

### Where to find

Reference: [iphone: Where the .dSYM file is located in crash report](http://stackoverflow.com/questions/7088771/iphone-where-the-dsym-file-is-located-in-crash-report/35619718#35619718). The post shows the following two ways.

#### 'build' folder
    
* Build you project for a real device.
* In *Project Navigator -> Products*, right click the app, choose *Show in Finder*, you will see the app with the coresponding .dSYM file in the same folder.

    > Note: Only if you build your project for real device will the app in Products folder be effective (black color, not red color).

#### Archive

##### Use of Archive from officical site:
>
An archive is a bundle that includes your product along with symbol information. You can build an archive to seed an application for testing or to validate and submit an application to iTunes Connect.

Xcode creates the .dSYM file automatically for you when you use the Archive option. The created archive contains your app and its dSYM and is stored in `~/Library/Developer/xcode/Archives`.

Reference: [dSYM file from device](http://stackoverflow.com/questions/11880404/dsym-file-from-device) to find the detailed way to find the dSYM file.

### Usage

#### Safe

When this setting is enabled, symbol names of your objects are removed from the resulting compiled binary (one of the many countermeasures to try and prevent would be hackers/crackers from reverse engineering your code, amongst other optimisations for binary size, etc.).

#### Re-symbolicating

They are useful for re-symbolicating your crash reports. With a stripped binary, you won't be able to read any crash reports without first re-symbolicating them. Without the dSYM the crash report will just show memory addresses of objects and methods. Xcode uses the dSYM to put the symbols back into the crash report and allow you to read it properly.

#### UUID

dSYMs and executables have an embedded UUID which matches. So every time a build is done will cause both to get a new UUID. The consequence is that symbolication only works if the UUID of the binary that caused a crash matches the UUID of the dSYM that is used for symbolication.

### Reference 

Official reference: [Restoring Symbols When an Instruments Trace Shows Only Addresses](https://developer.apple.com/library/ios/recipes/Instruments_help_articles/RestoringSymbolsWhenTraceShowsOnlyAddresses/RestoringSymbolsWhenTraceShowsOnlyAddresses.html).

This post is mainly from the following post: [How is a .dSYM file created?](http://stackoverflow.com/questions/22460058/how-is-a-dsym-file-created).
