---
layout: post
title: "Operating Files and Folders with Command Line in Terminal"
date: 2015-10-28 16:26:14 +0800
comments: true
categories: [productivity]
---

为什么需要在命令行进行文件和文件夹的操作：

<!-- more -->

* 通过正则表达式批量处理文件（夹）。
* 可以用来删除隐藏文件，比如一些以“.”开头的设置文件。
* 打不开Finder的情况下。
* 强制删除一些顽固的文件。

一些常用命令罗列：

命令 | 说明
----|----
**pwd** | 打印当前工作路径（print working directory）
**touch** fileName | 创建文件fileName
**ls -a** | 列出当前文件夹下的所有文件，包括以‘.’开头的隐藏文件。
**vi** *file* | 在当前位置用vim打开file，如果已经存在，直接打开。
**mkdir** *folder* | 创建文件夹。
**cp** *sourceFile* *destFolder* | 将sourceFile拷贝到destFolder下。
**cp** **-R** *sourceFolder* *destFolder* | 将sourceFolder及其下面的所有资源拷贝到destFolder下，R是reverse的意思。
**mv** *sourceFile* *destFolder* | 将sourceFile移动到destFolder下。
**rm** *file.txt* | 删除文件。
**rm** **-R** *folder* | 删除文件夹和里面的子文件（夹），R是reverse的意思。
**echo** "hello" | 将“hello”字符串输出到terminal中
**echo** "hello" **>** hello.txt | 将“hello”字符串写进文件hello.txt文件中
**cat** hello.txt | 将hello.txt文件的内容输出到terminal中
**cat** hello.txt **>** dest.txt | 将hello.txt中的内容**覆盖**dest.txt文件的内容
**cat** hello.txt **>>** dest.txt | 将hello.txt中的内容**追加**到dest.txt文件的内容
