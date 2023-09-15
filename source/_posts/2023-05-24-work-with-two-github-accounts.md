---
layout: post
title: "如何在一台机器上使用两个github账号"
date: 2023-05-24 21:30:12 +0800
comments: true
categories: []
---

<!-- more -->



最近公司的github账号从专有域名（github.company.com）迁移到了公共域名（github.com）下，所以我需要在一台机器上同时使用两个github账号。这里记录一下配置过程。

1. 生成两个ssh key
2. 将ssh key添加到github账号
3. 配置ssh config
   1. 如果不想配置config文件，需要手动保证ssh-agent里面每次有你想要的key，这个要不断切换，不方便，推荐使用config文件。
4. 使用特殊的域名进行`git clone`操作, `git clone git@github.com-hongchaozhang:hongchaozhang/deep-learning-specialization.git`.


`~/.ssh`目录下文件和创建的`config`文件，内容如下：

<img src="/images/config-two-github-account.jpg" alt="config two github accounts" width="300">

具体步骤细节参考：

* [How to manage multiple GitHub accounts on a single machine with SSH keys](https://www.freecodecamp.org/news/manage-multiple-github-accounts-the-ssh-way-2dadc30ccaca/#:~:text=If%20it%E2%80%99s%20to%20a%20personal%20Git%20account%20that,do%20a%20Git%20push%20to%20the%20personal%20repository)
* [How To Work With Multiple Github Accounts on a single Machine](https://gist.github.com/rahularity/86da20fe3858e6b311de068201d279e3)