---
layout: post
title: "应用Node.js搭建一个简单的服务器"
date: 2015-11-27 16:45:10 +0800
comments: true
categories: [node]
---

### 第一个简单应用

参考[Node.js for Beginners](http://code.tutsplus.com/tutorials/nodejs-for-beginners--net-26314). 去除以下代码：

{% highlight javascript linenos %}
request.on("end", function () {

});
{% endhighlight %}

### 如何调试Node.js在服务器上的应用

<!-- more -->

[node-inspector](https://github.com/node-inspector/node-inspector)是一款非常好用的GUI调试工具，可以让你像调试Web页面一样调试Node.js应用。

安装

{% highlight text %}
$ npm install -g node-inspector
{% endhighlight %}

打开

{% highlight text %}
$ node-debug app.js
{% endhighlight %}

### 解析excel文件
在我的应用中需要对excel文件内容进行搜索，所以需要一个解析excel文件的插件。

[node-xlsx](https://www.npmjs.com/package/node-xlsx)插件可以让我们解析、修改、新建excel文件。

安装

{% highlight text %}
npm install excel node-xlsx
{% endhighlight %}

然后就可以这样解析excel文件：

{% highlight javascript linenos %}
var xlsx = require('node-xlsx');
var obj = xlsx.parse(__dirname + '/myFile.xlsx'); // parses a file 
{% endhighlight %}
