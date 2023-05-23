---
layout: post
title: "浏览器的同源策略和跨域解决方法"
date: 2020-06-04 11:21:46 +0800
comments: true
categories: [web]
---

<!-- more -->

<!-- TOC -->

- [同源的定义](#同源的定义)
- [没有同源策略的危险（为什么需要同源策略）](#没有同源策略的危险为什么需要同源策略)
- [同源策略的限制](#同源策略的限制)
- [常用跨域的解决方法--本地通信](#常用跨域的解决方法--本地通信)
    - [修改`document.domain`属性](#修改documentdomain属性)
    - [借助`window.name`、`location.hash`](#借助windownamelocationhash)
    - [使用`window.postMessage`](#使用windowpostmessage)
- [常用跨域的解决方法--AJAX请求限制](#常用跨域的解决方法--ajax请求限制)
    - [服务器代理](#服务器代理)
    - [JSONP](#jsonp)
    - [WebSocket](#websocket)
    - [CORS](#cors)
- [参考](#参考)

<!-- /TOC -->

<a id="markdown-同源的定义" name="同源的定义"></a>

## 同源的定义

根据[MDN同源的定义](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)：如果两个URL的protocol、port(如果有指定的话)和host都相同的话，则这两个URL是同源。

下表给出了与 URL http://store.company.com/dir/page.html 的源进行对比的示例:


| URL | 结果 | 原因 |
| ----- | ----- | ----- | 
| http://store.company.com/dir2/other.html | 同源 | 只有路径不同 |
| http://store.company.com/dir/inner/another.html | 同源 | 只有路径不同 |
| https://store.company.com/secure.html | 失败 | 协议（protocol）不同 | 
| http://store.company.com:81/dir/etc.html | 失败 | 端口（port）不同 ( http:// 默认端口是80) | 
| http://news.company.com/dir/other.html | 失败 | 主机（host）不同 | 


<a id="markdown-没有同源策略的危险为什么需要同源策略" name="没有同源策略的危险为什么需要同源策略"></a>

## 没有同源策略的危险（为什么需要同源策略）

同源策略的目的，是为了保证用户信息的安全，防止恶意的网站窃取数据。

下面从DOM同源策略和XMLHttpRequest同源策略来举例说明：

**如果没有DOM同源策略**，也就是说不同域的iframe之间可以相互访问Dom结构，那么黑客可以这样进行攻击：

1. 做一个假网站，里面用iframe嵌套一个银行网站[http://mybank.com]()。
2. 把iframe宽高啥的调整到页面全部，这样用户进来除了域名，别的部分和银行的网站没有任何差别。
3. 这时如果用户输入账号密码，我们的主网站可以跨域访问到[http://mybank.com]()的dom节点，就可以拿到用户的账户密码了。

**如果没有XMLHttpRequest同源策略**，那么黑客可以进行CSRF（跨站请求伪造）攻击：

1. 用户登录了自己的银行页面[http://mybank.com]()，[http://mybank.com]()向用户的cookie中添加用户标识。
2. 用户浏览了恶意页面[http://evil.com]()，执行了页面中的恶意AJAX请求代码。
3. [http://evil.com]()向[http://mybank.com]()发起AJAX请求，请求会默认把[http://mybank.com]()对应cookie也同时发送过去。
4. 银行页面从发送的cookie中提取用户标识，验证用户无误，response中返回请求数据。此时数据就泄露了。
5. 而且由于Ajax在后台执行，用户无法感知这一过程。

其它例子可以参考：

1. 知乎[跨域的那些事儿](https://zhuanlan.zhihu.com/p/28562290)
2. [不要再问我跨域的问题了](https://segmentfault.com/a/1190000015597029)

<a id="markdown-同源策略的限制" name="同源策略的限制"></a>

## 同源策略的限制

如果非同源，共有三种行为受到限制。

1. Cookie、LocalStorage 和 IndexDB 无法读取。
2. DOM 无法获得。
3. AJAX 请求不能发送。

比如试图从不同源的iframe里面获取dom结构就会报错：

```
document.getElementById("myIFrame").contentWindow.document
// Uncaught DOMException: Blocked a frame from accessing a cross-origin frame.
```

虽然这些限制是必要的，但是有时很不方便，合理的用途也受到影响：明明两个网页都是自己写的，但是属于不同的源，也就没有办法互相访问。

下面列举一些方法，介绍如何规避上面三种限制。前提是两个URL都是自己写的网页，否则无法使用。这也正是同源策略的作用所在：对于第三方的一个网页，你是无法超越上面三种限制的，这也就保证了安全。

<a id="markdown-常用跨域的解决方法--本地通信" name="常用跨域的解决方法--本地通信"></a>

## 常用跨域的解决方法--本地通信

<a id="markdown-修改documentdomain属性" name="修改documentdomain属性"></a>

### 修改`document.domain`属性

Cookie是服务器写入浏览器的一小段信息，只有同源的网页才能共享。浏览器允许通过设置`document.domain`共享Cookie。

但是，`document.domain`只适用于“主域名相同，而子域名不同”的情况。这种方式非常适用于iframe跨域的情况。

举例来说，A网页是[http://w1.example.com/a.html]()，B网页是[http://w2.example.com/b.html]()，那么只要这两个网页同时设置相同的`document.domain`，两个网页就可以共享Cookie。

注意，这种方法只适用于Cookie和iframe窗口，LocalStorage和IndexDB无法通过这种方法，规避同源政策，而要使用下文介绍的PostMessage API。

另外，服务器也可以在设置Cookie的时候，指定Cookie的所属域名为一级域名，比如.example.com。这样的话，二级域名和三级域名不用做任何设置，都可以读取这个Cookie。

<a id="markdown-借助windownamelocationhash" name="借助windownamelocationhash"></a>

### 借助`window.name`、`location.hash`

这两种方法可以说是一种“破解”。

以`window.name`为例。浏览器窗口有`window.name`属性。这个属性的最大特点是，无论是否同源，只要在同一个窗口里，前一个网页设置了这个属性，后一个网页可以读取它。

<a id="markdown-使用windowpostmessage" name="使用windowpostmessage"></a>

### 使用`window.postMessage`

`window.name`和`location.hash`是“破解”方法，`window.postMessage`则具有官方背景。HTML5为了解决跨文档通信（Cross-document messaging）问题，引入了这个全新的API `window.postMessage`。

这个API为`window`对象新增了一个`window.postMessage`方法，允许跨窗口通信，不论这两个窗口是否同源。

举例来说，父窗口[http://aaa.com]()向子窗口[http://bbb.com]()发消息，调用`postMessage`方法就可以了。

```
var popup = window.open('http://bbb.com', 'title');
popup.postMessage('Hello World!', 'http://bbb.com');
```

`postMessage`方法的第一个参数是具体的信息内容，第二个参数是接收消息的窗口的源（origin），即"协议 + 域名 + 端口"。也可以设为*，表示不限制域名，向所有窗口发送。

子窗口向父窗口发送消息的写法类似。

```
window.opener.postMessage('Nice to see you', 'http://aaa.com');
```

父窗口和子窗口都可以通过message事件，监听对方的消息。

```
window.addEventListener('message', function(e) {
  console.log(e.data);
},false);
```

message事件的事件对象event，提供以下三个属性。

1. `event.source`：发送消息的窗口
2. `event.origin`: 消息发向的网址
3. `event.data`: 消息内容

> 注：通过window.postMessage，读写其他窗口的 LocalStorage 也成为了可能。

<a id="markdown-常用跨域的解决方法--ajax请求限制" name="常用跨域的解决方法--ajax请求限制"></a>

## 常用跨域的解决方法--AJAX请求限制

后面几种方法都是为了解决不同源网页之间的AJAX请求问题。

<a id="markdown-服务器代理" name="服务器代理"></a>

### 服务器代理
浏览器有跨域限制，但是服务器不存在跨域问题，所以可以由服务器请求所要域的资源再返回给客户端。

<a id="markdown-jsonp" name="jsonp"></a>

### JSONP

JSONP是服务器与客户端跨源通信的常用方法。最大特点就是简单适用，老式浏览器全部支持，服务器改造非常小。

它的基本思想是，网页通过添加一个\<script\>元素，向服务器请求JSON数据，这种做法不受同源政策限制；服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。

首先，网页动态插入\<script\>元素，由它向跨源网址发出请求。

```
function addScriptTag(src) {
  var script = document.createElement('script');
  script.setAttribute("type","text/javascript");
  script.src = src;
  document.body.appendChild(script);
}

window.onload = function () {
  addScriptTag('http://example.com/ip?callback=foo');
}

function foo(data) {
  console.log('Your public IP address is: ' + data.ip);
};
```

上面代码通过动态添加\<script\>元素，向服务器[example.com]()发出请求。注意，该请求的查询字符串有一个callback参数，用来指定回调函数的名字，这对于JSONP是必需的。

服务器收到这个请求以后，会将数据放在回调函数的参数位置返回。

```
foo({
  "ip": "8.8.8.8"
});
```

由于\<script\>元素请求的脚本，直接作为代码运行。这时，只要浏览器定义了foo函数，该函数就会立即调用。

<a id="markdown-websocket" name="websocket"></a>

### WebSocket

WebSocket是一种通信协议。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

下面是一个例子，浏览器发出的WebSocket请求的头信息（摘自维基百科）。

```
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

上面代码中，有一个字段是`Origin`，表示该请求的请求源（`origin`），即发自哪个域名。

正是因为有了`Origin`这个字段，所以WebSocket才没有实行同源政策。因为服务器可以根据这个字段，判断是否许可本次通信。如果该域名在白名单内，服务器就会做出如下回应。

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

<a id="markdown-cors" name="cors"></a>

### CORS

CORS是跨源资源分享（Cross-Origin Resource Sharing）的缩写。它是W3C标准，是跨源AJAX请求的根本解决方法。相比JSONP只能发GET请求，CORS允许任何类型的请求。

<a id="markdown-参考" name="参考"></a>

## 参考

* 阮一峰的[浏览器同源政策及其规避方法](https://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
* [MDN同源的定义](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)