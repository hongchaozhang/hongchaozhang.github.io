---
layout: post
title: "iOS代码查重工具"
date: 2017-05-08 17:52:24 +0800
comments: true
categories: [xcode, productivity, ios]
published: true
---


<!-- more -->

很多IDE里面都有自己的代码查重工具，比如WebStorm的代码查重工具做的非常好用。但是Xcode里面至今没有自己的代码查重工具。这里调研了一些常见的代码查重工具，最后选择~~PMD里面的CPD~~jscpd，并将其集成到Xcode中，重复代码会以warning的形式出现在Xcode里面，方便查看。

## jscpd

[jscpd](https://github.com/kucherenko/jscpd)

Supported languages： 

* JavaScript	
* Java	
* YAML
* CoffeeScript	
* C++	
* Haxe
* PHP	
* C#	
* TypeScript
* Go	
* Python	
* Mixed HTML
* Ruby	
* C	
* SCSS
* Less	
* CSS	
* erlang
* **Swift**	
* xml/xslt	
* **Objective-C**
* Puppet	
* Twig	
* Vue.js

### 优点

* 安装使用简单
* 运行速度快
* **支持yaml配置文件进行配置**

### 缺点：

* 没有GUI
* 算法简单：复制一段，修改其中的一行，就不会被认为复制。


## PMD

[PMD](https://pmd.github.io/)

### Supported IDEs

* Maven PMD plugin
* Gradle: The PMD Plugin
* Eclipse plugin
* NetBeans plugin
* JBuilder plugin
* JDeveloper plugin
* IntelliJ IDEA plugin

没有Xcode的插件，但是可以通过在Build Phase里面加入Run Script来使用。

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
* **objectivec**
* php
* plsql
* python
* ruby
* scala
* **swift**

### CPD has GUI

On Mac, display the GUI by running:

```
./run.sh cpdgui
```

The screen shot is like:

![screenshot_cpd](/images/screenshot_cpd.png)

### 将CPD集成到XCode里面

[Integrating Copy-Paste-Detector for Swift in Xcode](https://medium.com/@nvashanin/%D0%B8%D0%BD%D1%82%D0%B5%D0%B3%D1%80%D0%B8%D1%80%D1%83%D0%B5%D0%BC-copy-paste-detector-%D0%B4%D0%BB%D1%8F-swift-%D0%B2-xcode-9ae87c20748): This is a newer post on April 2017 and gives a detailed step by step way for integrating CPD into Xcode:

* Add run script into Build Phase.
* Xcode warnings will appear at the place of duplicated code.

Refer to [将代码查重工具CPD集成到Xcode](../../../../2018/08/02/integrate-copy-and-paste-detector-into-xcode/) for details.

[~~Интегрируем Copy-Paste-Detection в Xcode, и не только~~](https://habrahabr.ru/post/137875/): Integrate CPD into XCode, but this post is a little older on 2012.

## JenkinsCI-iOS

[JenkinsCI-iOS](https://github.com/cyupa/JenkinsCI-iOS)

The CPD in PMD is the core of JenkinsCI-iOS.


## NiCad4 Clone Detector

[NiCad4 Clone Detector](http://www.txl.ca/nicaddownload.html)

NiCad handles a range of languages, including C, Java, Python, and C#, and provides a range of normalizations, filters and abstractions.

## Android Studio 

Find and Replace Code Duplicates...

## WebStorm

WebStorm has built in copy paste detection tool, but it is expensive.

## VSCode

Copy/Paste Detector extension, based on jscpd.

## AppCode

AppCode has no copy paste detection tool, the same with Xcode.

## Visual Studio

Visual Studio Enterprise有自己的code clone analysis，see [Finding Duplicate Code by using Code Clone Detection](https://msdn.microsoft.com/en-us/library/hh205279.aspx)。copy一段code，然后改了某个变量名称，仍然可以被检测出重复。

The following modifications can be made, and the clone will still be recognized. In each case, there is a tolerance of a specific number of such modifications:
    
    * Rename identifiers.
    * Insert and delete statements.
    * Rearrange statements.

## Simian - Similarity Analyser

[Simian - Similarity Analyser](http://www.harukizaemon.com/simian/)


