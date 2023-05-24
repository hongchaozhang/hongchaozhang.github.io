---
layout: post
title: "迁移Octopress到MacBook（M1）"
date: 2023-05-24 01:49:19 +0800
comments: true
categories: [productivity]
---

<!-- more -->

2020年的[迁移Octopress到新的机器上](/blog/2020/02/26/deploy-octopress-in-a-new-machine/)里面描述的问题依然存在。除此之外，还有一些新的问题。

## 不能正常加载(require)pygments.rb

当运行 `rake generate` 时，会报错：

```
jekyll 2.5.3 | Error:  Pygments can't parse unknown language: javascript.
```

通过运行`jekyll build`，可以看到报错的详细信息：

```
/Users/hozhang/Develop/hongchaozhang.github.io/plugins/pygments_code.rb:1:in `require': cannot load such file -- pygments (LoadError)
...
```
当你写一个简单的rb脚本，使用`require 'pygments'`，却不会报错。

我们可以通过运行下面的命令来获得当前所有的gems加载路径（`require`或者`load`）：

```
puts $LOAD_PATH
```
可以看出，上面两种情况下，加载路径是不一样的。在`rake generate`的情况下，加载路径中没有`/Library/Ruby/Gems/2.6.0/gems/pygments.rb-2.4.0/lib`这个路径，所以会报错。

> [Understanding ruby load, require, gems, bundler and rails auto loading from the bottom up](https://medium.com/@connorstack/understanding-ruby-load-require-gems-bundler-and-rails-autoloading-from-the-bottom-up-3b422902ca0)：这篇文章讲解了ruby的依赖加载机制，对于理解这个问题很有帮助，虽然最终还是没有解决问题。

### 解决方法

将所有的code片段的语言类型指定都去掉。

原来带语言标记的源文件暂时放在独立的branch里：`source_code_with_language_type`。等啥时候pygments的问题解决了再弄回来。

## 理解octopress
你自己的github.io那个repo就是一个octopress，每次重新clone之后，就要按照octopress的步骤重新操作一遍：
* http://octopress.org/docs/setup/
* http://octopress.org/docs/deploying/github/


## 在一台机器上同时用两个github账号工作

参考[如何在一台机器上使用两个github账号](/blog/2023/05/24/work-with-two-github-accounts/)


