---
layout: post
title: "https在Server端的Nodejs实现"
date: 2015-12-30 21:23:19 +0800
comments: true
categories: [node]
---

服务器端利用Nodejs创建https的Server，请参考[Nodejs创建HTTPS服务器](http://blog.fens.me/nodejs-https-server/)

<!-- more -->

首先确保已经安装nodejs、nodejs-https组件和openssl。

### 用openssl生成密钥

* cd到你的server路径。
* 生成私钥key文件privatekey.pem

{% highlight text %}
openssl genrsa -out privatekey.pem 1024
{% endhighlight %}

* 通过私钥生成CSR证书签名

{% highlight text %}
openssl req -new -key privatekey.pem -out certrequest.csr
{% endhighlight %}

填写一些证书信息：

>
>You are about to be asked to enter information that will be incorporated
into your certificate request.
>
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.

{% highlight text %}
Country Name (2 letter code) [AU]:CN
State or Province Name (full name) [Some-State]:Zhejiang
Locality Name (eg, city) []:Hangzhou
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Organization
Organizational Unit Name (eg, section) []:Organization
Common Name (eg, YOUR name) []:Name Zhang
Email Address []:Name@gmail.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
{% endhighlight %}

* 通过私钥和证书签名生成证书文件

{% highlight text %}
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
{% endhighlight %}

至此，我们有了三个文件：

* privatekey.pem: 私钥
* certrequest.csr: CSR证书签名
* certificate.pem: 证书文件

### 实现服务器端app

{% highlight javascript linenos %}
var https = require('https')，
    fs = require("fs");

var options = {
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem')
};

https.createServer(options, function(request, response) {
    response.writeHead(200);
    response.end("hello world\n");
}).listen(8181);
console.log('Https server listening on port ' + 8181);
{% endhighlight %}

在Safari中选择信任证书之后，就可以看到下面的页面了：

![003_package_name_in_Eclipse](/images/https-browser-screenshot.png)

### https的安全性
对于http的server，在浏览器中看是这样的：

![http-browser-sample](/images/http-browser-sample.png)

用Charles抓取网络传输中的数据，可以看出：http的request数据如下：

![http-request-charles](/images/http-request-charles.png)

http的response数据如下：

![http-response-charles](/images/http-response-charles.png)

可以看出，所有东西都是明文传送，如果被截取，必然造成信息泄露。

同样地，看一下https的server传输中的数据。
浏览器中看到的是这样的：

![https-browser-sample](/images/https-browser-sample.png)

用Charles抓取网络传输中的数据，可以看出：https的request数据如下：

![https-request-charles](/images/https-request-charles.png)

从request中只可以看到URL地址，却看不到参数格式和内容。

https的response数据如下：

![https-response-charles](/images/https-response-charles.png)

即使网络传输中被截获，也不会造成信息泄露。

但是还有一个不安全的地方：对于上面的情况，我们使用的是https的get方法从server获取数据，需要在地址栏中输入查询参数，而这些参数可能通过浏览器的历史记录泄露。这一点可以通过使用https的post方法解决，参考[http https get post 的区别，定义/安全性/性能](http://cuishen.iteye.com/blog/2019925)。