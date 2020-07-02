---
layout: post
title: "CSS中的white-space，word-break和word-wrap"
date: 2020-07-02 10:27:04 +0800
comments: true
categories: [css, web]
---

<!-- more -->

`white-space`、`word-break`、`word-wrap`（`overflow-wrap`）估计是css里最基本却又容易让人迷惑的三个属性了。

## `white-space`

[`white-space`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space)：正如它的名字，这个属性是用来**控制空白字符的显示的，同时还能控制是否自动换行**。它有6个值：

1. normal：默认值。空格被合并，自动换行。
2. nowrap：不仅空格被合并，换行符无效，连原本的自动换行都没了！只有\</br\>才能导致换行！所以这个值的表现还是挺简单的，我们可以理解为"永不换行"。
3. pre：下面四个用来保留空格，不常用。详情参考[MDN介绍](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space)。
4. pre-wrap
5. pre-line
6. break-space

下面的表格记录的很详细：

| 属性值 | 换行符 | 空格和制表符 | 文字换行 | 行尾空格 |
| :-----: | :-----: | :-----: | :-----: | :-----: |
|normal	| 合并	| 合并	| 换行	| 删除 |
|nowrap	| 合并	| 合并	| 不换行	| 删除 |
|pre	| 保留	| 保留	| 不换行	| 保留 |
|pre-wrap	| 保留	| 保留	| 换行	| 挂起 |
|pre-line	| 保留	| 合并	| 换行	| 删除 |
|break-spaces	| 保留	| 保留	| 换行	| 换行 |

## `word-break`

[`word-break`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break)指定了怎样在单词内断行。这里说的单词在英文中很明显，但是，对于中文、日文和韩文（合称CJK文本）整段话都是一个单词。

`word-break`共有三个选项：

1. normal：使用默认的断行规则。
2. break-all：对于non-CJK文本，可在任意字符间断行。
3. keep-all：CJK文本不断行。 Non-CJK文本表现同normal。

## `word-wrap` (`overflow-wrap`)

[`word-wrap`(`overflow-wrap`)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-wrap)控制长度超过一行的单词是否被拆分换行。有两个值：

1. normal：长度超过一行的单词也不允许拆成两行显示。
2. break-word：长度超过一行的单词允许被拆分成两行显示。

## 总结

* `white-space`，**控制空白字符的显示，同时还能控制是否自动换行**。
* `word-break`，**控制单词如何被拆分换行**。
* `word-wrap`（`overflow-wrap`）**控制长度超过一行的单词是否被拆分换行**，是`word-break`的补充。

## 参考

实际效果可以参考[彻底搞懂word-break、word-wrap、white-space](https://juejin.im/post/5b8905456fb9a01a105966b4)及其其提供的一个[测试页面](https://codepen.io/YGYOOO/pen/jvyrWK)。

MDN的官方文档当然是不得不看的：

1. [`white-space`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space)
2. [`word-break`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break)
3. [`word-wrap`(`overflow-wrap`)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-wrap)