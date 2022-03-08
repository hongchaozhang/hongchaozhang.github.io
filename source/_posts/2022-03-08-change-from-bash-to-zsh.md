---
layout: post
title: "从Terminal切换到iTerm2，从Bash切换到Zsh"
date: 2022-03-08 16:45:12 +0800
comments: true
categories: [productivity]
---

<!-- more -->

## 安装iTerm2 + Oh My Zsh

[iTerm2 + Oh My Zsh 打造舒适终端体验](https://segmentfault.com/a/1190000014992947)

OhMyZsh的主题：
ZSH_THEME="af-magic"

OhMyZsh的插件：
plugins=(git zsh-syntax-highlighting zsh-autosuggestions)

## Zsh配置文件加载顺序
.zshenv
.zshrc

更多配置文件，参考[What should/shouldn't go in .zshenv, .zshrc, .zlogin, .zprofile, .zlogout?](https://unix.stackexchange.com/questions/71253/what-should-shouldnt-go-in-zshenv-zshrc-zlogin-zprofile-zlogout)

## Zsh问题

### Octopress在zsh下无法新建博客的问题
执行：
 ```
$ rake new_post["new post name"]
```

报错：
```
zsh: no matches found: new_post[new post name]
```
原因：
zsh中若出现‘*’, ‘(’, ‘|’, ‘<’, ‘[’, 或者 ‘?’符号，则将其识别为查找文件名的通配符。

解决方法一：

遇到上面的特殊字符，使用转义字符代替。比如：
 ```
$ rake new_post["new post name"]
```
解决方法二：

取消zsh的通配(GLOB), 在.zshrc中加入
```
alias rake="noglob rake"
```
并且执行：
```
source ./zshrc
```

PS git操作也有类似的问题。

在 git 回滚操作
```
git reset --soft HEAD^
```
出现报错：
```
zsh: no matches found HEAD^
```
也为同样原因，因为^也为正则中的符号， 需要转义为
```
git reset --soft HEAD\^
```
