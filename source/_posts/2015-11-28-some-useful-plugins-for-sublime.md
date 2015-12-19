---
layout: post
title: "Sublime的一些插件"
date: 2015-11-28 23:45:59 +0800
comments: true
categories: [productivity]
---

### Package Control

[Package Control](https://packagecontrol.io/installation#st2)是Sublime中用于插件管理的工具。安装之后，其它插件基本上可以通过它进行管理：安装、删除、禁用等。

### JSFormat

<!-- more -->

可以对Javascript和json文件进行格式化。

对于json，如果不想用本地插件，可以用[Online Json Viewer](http://jsonviewer.stack.hu/)。

### JSHint Guntter

* Run JSHint: Command+Shift+J
* Clear Annotations: Command+Escape

对于一些关键字，比如node中的`require`，在.jshintrc文件中通过设置`predef`进行排除。.jshintrc通过Preferrences->Package Settings->JSHint Gunter->Set Linting Preferences打开。

### Sublime ​Code​Intel

* 自动代码补全功能

* 代码间跳转

    * Jump to definition = Control+Click
    * Go back = Control+Alt+Command+Left

### Bracket Highlighter

可以对括号（圆括号，方括号，花括号，尖括号等）和标签（html tag等）进行自定义高亮。

自定义方法：

* 打开Preferences->Package Settings->Bracket Highlighter->Brakets Settings - **Default**，复制。这个文件无法修改。
* 打开Preferences->Package Settings->Bracket Highlighter->Brakets Settings - **User**，粘贴。修改`bracket styles`。此文件中的设置将覆盖**Default**中的设置。
