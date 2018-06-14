---
layout: post
title: "iOS代码查重工具"
date: 2017-05-08 17:52:24 +0800
comments: true
categories: [xcode, productivity, ios]
published: true
---


<!-- more -->

代码查重工具

## jscpd

[jscpd](https://github.com/kucherenko/jscpd)

Supported languages： 

JavaScript	Java	YAML
CoffeeScript	C++	Haxe
PHP	C#	TypeScript
Go	Python	Mixed HTML
Ruby	C	SCSS
Less	CSS	erlang
**Swift**	xml/xslt	**Objective-C**
Puppet	Twig	Vue.js

### 优点

* 安装使用简单
* 运行速度快。

### 缺点：

* 没有GUI
* 复制1行，修改其中的一行，就不会被认为复制。


## PMD

[PMD](https://pmd.github.io/)

### Supported IDEs

没有Xcode的插件，所以只能用命令行。

PMD is integrated with JDeveloper, Eclipse, JEdit, JBuilder, BlueJ, CodeGuide, NetBeans/Sun Java Studio Enterprise/Creator, IntelliJ IDEA, TextPad, Maven, Ant, Gel, JCreator, and Emacs.


* Maven PMD plugin
* Gradle: The PMD Plugin
* Eclipse plugin
* NetBeans plugin
* JBuilder plugin
* JDeveloper plugin
* IntelliJ IDEA plugin

### Supported Languages of PMD commonded line:

* java
* ecmascript (JavaScript)
* jsp
* plsql
* vm (Apache Velocity)
* xml and xsl

### Supported Languages of CPD:

* cs
* cpp
* ecmascript (JavaScript)
* fortran
* go
* java
* jsp
* matlab
* objectivec
* php
* plsql
* python
* ruby
* scala
* swift

### CPD has GUI

On Mac, display the GUI by running:

```
./run.sh cpdgui
```

The screen shot is like:

![screenshot_cpd](/images/screenshot_cpd.png)

### 将CPD集成到XCode里面

[Интегрируем Copy-Paste-Detection в Xcode, и не только](https://habrahabr.ru/post/137875/)将CPD集成到了XCode里面。

## JenkinsCI-iOS

[JenkinsCI-iOS](https://github.com/cyupa/JenkinsCI-iOS)

The CPD in PMD is the core of JenkinsCI-iOS.


## NiCad4 Clone Detector

[NiCad4 Clone Detector](http://www.txl.ca/nicaddownload.html)

NiCad handles a range of languages, including C, Java, Python, and C#, and provides a range of normalizations, filters and abstractions.


## AppCode

## Code Clone Detection

Visual Studio Enterprise有自己的code clone analysis，see [Finding Duplicate Code by using Code Clone Detection](https://msdn.microsoft.com/en-us/library/hh205279.aspx)。copy一段code，然后改了某个变量名称，仍然可以被检测出重复。

## Simian - Similarity Analyser

[Simian - Similarity Analyser](http://www.harukizaemon.com/simian/)


