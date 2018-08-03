---
layout: post
title: "将代码查重工具CPD集成到Xcode"
date: 2018-08-02 18:34:40 +0800
comments: true
categories: [xcode, productivity]
---

<!-- more -->

翻译部分[Integrating Copy-Paste-Detector for Swift in Xcode](https://medium.com/@nvashanin/%D0%B8%D0%BD%D1%82%D0%B5%D0%B3%D1%80%D0%B8%D1%80%D1%83%D0%B5%D0%BC-copy-paste-detector-%D0%B4%D0%BB%D1%8F-swift-%D0%B2-xcode-9ae87c20748)。

## DRY准则

编程到一个基本准则就是DRY（Don't Repeat Yourself)，不写重复代码。简单来说，就是不要复制黏贴。

在开始之前，我们先讨论一下什么叫做“复制黏贴”？首先，如果你有相同的文件，肯定是极其糟糕的“复制黏贴”。如果你有两个类只是类名不同，但是做着相同或者类似的事情，也是很严重的“复制黏贴”。即使只有10行代码的重复，也是”复制黏贴“。根据作者个人经验，一个100000行的工程，完全不需要复制黏贴。

### 复制黏贴的坏处

在重复的代码处修改bug，还需要手动找到另外一处，做相同的修改。

## 如何避免复制黏贴

避免重复代码的传统方法是代码审查，但是对于代码审查者来说，找到重复代码是一件很困难的事情。

我们能不能在编译阶段就查找出重复代码，并要求这些重复代码移除掉之后才可以继续进行编译。

## 安装CPD

对于Swift代码，有两个工具可以做代码查重：

* [jscpd](https://github.com/kucherenko/jscpd)
* [pmd](https://pmd.github.io/)

其中，pmd可定制，并且比较稳定。开始之前，先通过homebrew进行安装：

```
brew install pmd
```

> 注意：对于其他语言，pmd都包含代码静态分析工具，但是对于Swift，只有一个代码查重工具CPD（Copy Paste Detector）。因此，如果想对Swift代码进行静态分析，可以选择[SwiftLint](https://github.com/realm/SwiftLint)。

## 集成到Xcode

为了将CPD功能集成到编译阶段，我们在Build Phase里新添加一个运行脚本（Run Script），并添加以下脚本：

```
# Running CPD
pmd cpd --files ${EXECUTABLE_NAME} --minimum-tokens 50 --language swift --encoding UTF-8 --format net.sourceforge.pmd.cpd.XMLRenderer > cpd-output.xml --failOnViolation true
# Running script
php ./cpd_script.php -cpd-xml cpd-output.xml
```

让我们来看一下这一段脚本做了什么事情。

第一部分是说我们在项目根目录下对所有的文件进行代码查重：

* `--minimum-tokens`指定重复代码的最少token数量。这里的token是一个比较抽象的概念，不是字符，不是单词，也不是短语的意思。根据经验来说，Swift语言的最优值是50：太大，会漏掉重复代码；太小，会将一些代码误判为重复代码。
* `--formant`指定输出格式，这里指定为xml文件。
* `--failOnViolation`标识为设置为`true`，意思是只要检测到重复代码，就不继续进行编译。

> 经测试，无论`--failOnViolation`设置成`true`，还是`false`，都不能阻断编译的正常运行。但是warning能正常地给出。

第一部分脚本执行的结果，是一个xml文件，里面包含了整个工程里面的重复代码及其位置、行数等信息。下面让我们看看，怎么将这个难读的xml文件以warning的形式展示给开发者。

为了将xml文件转换成更好读的warning，需要在工程根目录下创建一个php文件，我们叫做cpd_script.php，拷贝下面的脚本到该文件中：

```php
<?php
foreach (simplexml_load_file('cpd-output.xml')->duplication as $duplication) {
    $files = $duplication->xpath('file');
    foreach ($files as $file) {
        echo $file['path'].':'.$file['line'].':1: warning: '.$duplication['lines'].' copy-pasted lines from: '
            .implode(', ', array_map(function ($otherFile) { return $otherFile['path'].':'.$otherFile['line']; },
            array_filter($files, function ($f) use (&$file) { return $f != $file; }))).PHP_EOL;
    }
}
?>
```

我们在Build Phase中添加的脚本的第二部分就是运行这一段脚本，将生成的xml文件中的所有重复代码信息以warning的形式展示在Xcode中。如果你想了解如何在Xcod中生成warning，参考[Generating Warnings in Xcode](https://krakendev.io/blog/generating-warnings-in-xcode)。

> 我试了[Generating Warnings in Xcode](https://krakendev.io/blog/generating-warnings-in-xcode)中说的方法，脚本有错误，为了将comment中有TODO:和FIXME:的地方标记为warning，将有ERROR:的地方标记为error，可以尝试将下面的脚本写到Build Phase的运行脚本（Run Script）中（参考[Highlight Warnings in Xcode](https://medium.com/ios-os-x-development/highlight-warnings-in-xcode-521125121a75)）：
> 
> ```
> TAGS="TODO:|FIXME:|WARNING:"
> ERRORTAG="ERROR:"
> find "${SRCROOT}" \( -name "*.h" -or -name "*.m" -or -name "*.swift" \) -print0 | xargs -0 egrep --with-filename --line-number --only-matching "($TAGS).*\$|($ERRORTAG).*\$" | perl -p -e "s/($TAGS)/ warning: \$1/"| perl -p -e "s/($ERRORTAG)/ error: \$1/"
> ```


现在编译工程，可以在Xcode左侧导航窗口看到所有的warning：

![cpd warnings in navigation](/images/cpd_warnings_in_navigation.jpg)

在相应的文件中，也可以看到该文件所包含的重复代码的warning：

![cpd warnings in file](/images/cpd_warnings_in_file.jpg)

这个warning的意思是说：从54行往下的41行代码和ErrorHandleTester.swift中从96行往下的41行代码重复。

> 如果是刚安装的pmd，可能需要重启Xcode，让pmd命令生效。


## 结论

重复代码清理是一件刻不容缓的事情。这个工具放在这里，没有任何副作用，建议大家能正确对待重复代码。