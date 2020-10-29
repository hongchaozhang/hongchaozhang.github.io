---
layout: post
title: "Android内存分析工具"
date: 2020-10-29 17:29:30 +0800
comments: true
categories: [android]
---

<!-- more -->

## 使用Android Studio自带的Profile工具
必看的两篇官方文档：

* View the Java Heap and Memory Allocations with Memory Profiler： https://developer.android.com/studio/profile/memory-profiler
* Manage your app's memory： https://developer.android.com/topic/performance/memory


选看的一篇官方文档：

* Overview of memory management：https://developer.android.com/topic/performance/memory-overview

## Use MAT for profiling Android memory
参考：[How to analyze memory using android studio](https://stackoverflow.com/questions/24547555/how-to-analyze-memory-using-android-studio)

1. First, you have install **MAT** ( [download](https://www.eclipse.org/mat/downloads.php) )
1. In Android Studio open Android Device Monitor or DDMS.
1. Select your process "com.example.etc.."
1. Click Update Heap above the process list.
1. In the right-side panel, select the Heap tab.
1. Click in Cause GC.
1. Click Dump HPROF file above the process list.
1. When we downloaded the file HPROF, we have to open the Terminal and run this command to generate the file to open it with MAT.
1. Open terminal and run this command “./hprof-conv path/file.hprof exitPath/1. heap-converted.hprof”. The command "hprof-conv" is in the platform-tools 1. folder of the sdk.
1. And ready and MAT can open and open the converted file ( heap-converted.hprof ) .

## 如何在Android Studio 3.0里面打开DDMS？
自从Android Studio进入3.0，DDMS就被偷偷的隐藏起来了。参考下面的文章看如何打开DDMS。

Android Studio启动DDMS https://blog.csdn.net/llfjfz/article/details/70213723
注意：需要关闭Android Studio。

## 在Android Studio中保存hprof文档
在Android Studio将DDMS偷偷隐藏起来的同时，DDMS的一些工具已经集成到Android Studio里面了。比如这个获取hprof文件的方法。

该方法不需要打开DDMS，直接用Android Studio的Profile工具即可。

https://developer.android.com/studio/profile/memory-profiler#save_the_heap_dump_as_hprof

## Mat启动报错
下载的Mat在打开的时候会报错。错误信息如下：

java.lang.IllegalStateException: The platform metadata area could not be written: /private/var/folders/7b/3wj5jwnd1yg98w2yzmn36qwr0000gq/T/AppTranslocation/C98006F4-54ED-44FB-9F3E-AC7C1EB9519B/d/mat.app/Contents/MacOS/workspace/.metadata.  By default the platform writes its content under the current working directory when the platform is launched.  Use the -data parameter to specify a different content area for the platform.


解决方案参考这片文章：[Eclipse Memory Analyzer在Mac启动报错](https://www.jianshu.com/p/9bbbe3c4cc8b)

注意：右键打开Mat package，可以找到上面说的MemoryAnalyzer.ini文件