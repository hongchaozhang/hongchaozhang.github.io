---
layout: post
title: "迁移Octopress到新的机器上"
date: 2020-02-26 13:36:46 +0800
comments: true
categories: [productivity]
---


<!-- more -->

<!-- TOC -->

- [问题](#问题)
    - [问题1: rake版本问题](#问题1-rake版本问题)
    - [问题2: `rake deploy`错误](#问题2-rake-deploy错误)
    - [问题3: `bundle install`错误](#问题3-bundle-install错误)
- [参考](#参考)

<!-- /TOC -->

<a id="markdown-问题" name="问题"></a>

## 问题

在新到Mac上面部署Octopress的时候遇到了几个问题。

将github上面的资源clone到本地，并切换到`source`分支：

```
git clone -b source git@github.com:username/username.github.io.git octopress
cd octopress
```

然后，安装rake：

```
gem install bundler
rbenv rehash    # If you use rbenv, rehash to be able to run the bundle command
bundle install
```

<a id="markdown-问题1-rake版本问题" name="问题1-rake版本问题"></a>

### 问题1: rake版本问题

之后，试图执行rake命令到时候，会报错：

```
rake aborted!
Gem::LoadError: You have already activated rake 12.3.2, but your Gemfile requires rake 10.5.0. Prepending `bundle exec` to your command may solve this.
/Users/hozhang/Develop/hongchaozhang.github.io/Rakefile:2:in `<top (required)>'
/Library/Ruby/Gems/2.6.0/gems/rake-12.3.2/exe/rake:27:in `<top (required)>'
(See full trace by running task with --trace)
```

这个时候，可以根据提示，在rake前面加上`bundle exec`，比如`bundle exec rake preview`。每次都这样，比较麻烦。这个问题到根源是Gemfile里面定义使用到rake版本和本地安装到rake版本不一致，这样修改：

在octopress目录下找到我们上面第一步从远端clone下来到Gemfile，打开，将

```
gem 'rake', '~> 10.0'
```

修改成

```
gem 'rake', '~> 12.0'
```

即可。上面的`10.0`表示老版本，`12.0`表示新版本，查看本地rake的版本，如果是`12.3`，就用`12.0`。

<a id="markdown-问题2-rake-deploy错误" name="问题2-rake-deploy错误"></a>

### 问题2: `rake deploy`错误

直接执行`rake deploy`，报错`[rejected] master -> master (non-fast-forward)`，这是因为_deploy这个目录下面的内容是本地生成的，和远端没有关系，不能push。执行：

```
rm -rf _deploy
git clone git@github.com:username/username.github.io.git _deploy
```

解决。

当你在多台机器上同时工作时，经常会出现这个问题。

<a id="markdown-问题3-bundle-install错误" name="问题3-bundle-install错误"></a>

### 问题3: `bundle install`错误
运行`bundle install`的时候出现错误：
```
Could not find ffi-1.9.18 in any of the sources...
```
需要运行一下`bundle update`,再运行`bundle install`。

<a id="markdown-参考" name="参考"></a>

## 参考

1. [Setting Up Existing Octopress Blog on a New Machine](http://michal.codes/setting-up-existing-octopress-blog-on-a-new-machine/)
2. [Setting Up Octopress on a New Machine](http://paulcichonski.com/blog/2013/11/10/setting-up-octopress-on-a-new-machine/)

