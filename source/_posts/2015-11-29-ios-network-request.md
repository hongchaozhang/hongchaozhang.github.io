---
layout: post
title: "ios进行网络请求"
date: 2015-11-29 15:12:59 +0800
comments: true
categories: [ios, objective-c]
---

参考[IOS网络编程：HTTP](http://blog.csdn.net/dyllove98/article/details/9050863)。

<!-- more -->

如果遇到如下错误信息：

{% highlight text %}
App Transport Security has blocked a cleartext HTTP (http://) resource load since it is insecure. 
Temporary exceptions can be configured via your app's Info.plist file.
{% endhighlight %}

打开Info.plist，加入如下字段：

{% highlight xml linenos %}
<key>NSAppTransportSecurity</key>
    <dict>
        <!--Include to allow all connections (DANGER)-->
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
{% endhighlight %}