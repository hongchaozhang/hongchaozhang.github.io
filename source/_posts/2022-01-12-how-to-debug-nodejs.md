---
layout: post
title: "如何调试NodeJs源码"
date: 2022-01-12 15:57:01 +0800
comments: true
categories: [nodejs, javascript]
---

<!-- more -->

## 调试javascript代码
通过添加`--inspect`参数启动nodejs服务，看到下面的消息，表明成功启动调试模式：
```
HANM10610:nodePlayground hozhang$ node --inspect sightReading.js
Debugger listening on ws://127.0.0.1:9229/c8620553-2cf2-4fac-bab8-d18e98c3d777
For help, see: https://nodejs.org/en/docs/inspector
```

可以通过很多种方式连接到调试环境，比如Chrome Developer Tools, VS Code等，详细信息参考官方文档[Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)。下面以Chrome Developer Tools说明。

在chrome://inspect/#devices找到启动的target，打开，搜索打开你的文件或者相关的库文件，就可以打断点开始调试了。

![debug查看参数类型.jpg](/images/debug查看参数类型.jpg)

![调试readFileSync.jpg](/images/调试readFileSync.jpg)

## 调试C/C++代码

参考[Node.js源代码调试的4种姿势](https://www.tripfe.cn/node-js-four-postures-of-source-code-debugging/)