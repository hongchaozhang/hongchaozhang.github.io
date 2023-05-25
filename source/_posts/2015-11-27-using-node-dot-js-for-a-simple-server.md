---
layout: post
title: "应用Node.js搭建一个简单的服务器"
date: 2015-11-27 16:45:10 +0800
comments: true
categories: [nodejs]
---

### 第一个简单应用

参考[Node.js for Beginners](http://code.tutsplus.com/tutorials/nodejs-for-beginners--net-26314). 去除以下代码：

```
request.on("end", function () {

});
```

### 如何调试Node.js在服务器上的应用

<!-- more -->

[node-inspector](https://github.com/node-inspector/node-inspector)是一款非常好用的GUI调试工具，可以让你像调试Web页面一样，在Chrome或者Opera里面调试Node.js应用。

安装

```
$ npm install -g node-inspector
```

打开

```
$ node-debug app.js
```

#### 注意

* node-inspector只支持Chrome和Opera，所以至少将其中之一设为你的默认浏览器。
* node-inspector使用127.0.0.1:8080进行调试，所以，保证localhost的8080端口没有被占用。

