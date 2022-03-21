---
layout: post
title: "HTTP(s)请求性能优化"
date: 2022-03-08 16:44:40 +0800
comments: true
categories: [web, http]
---

<!-- more -->

<!-- TOC -->

- [性能测试工具](#性能测试工具)
- [HTTP性能优化](#http性能优化)
    - [开源](#开源)
    - [节流](#节流)
    - [缓存](#缓存)
    - [升级到HTTP/2](#升级到http2)
    - [关于资源合并](#关于资源合并)
- [HTTPs性能优化](#https性能优化)
    - [1. 硬件优化：CPU，SSL加速卡，SSL加速服务器](#1-硬件优化cpussl加速卡ssl加速服务器)
    - [2. 软件优化：](#2-软件优化)

<!-- /TOC -->

<a id="markdown-性能测试工具" name="性能测试工具"></a>

## 性能测试工具
1. 在 Linux 上，最常用的性能测试工具可能就是 ab（Apache Bench）了，比如，下面的命令指定了并发数 100，总共发送 10000 个请求：
    
    ```
    ab -c 100 -n 10000 'http://www.xxx.com'
    ```
2. 系统资源监控方面，Linux 自带的工具也非常多，常用的有 uptime、top、vmstat、netstat、sar 等等，可能你比我还要熟悉，我就列几个简单的例子吧：
    
    ```
    top             # 查看 CPU 和内存占用情况
    vmstat  2       # 每 2 秒检查一次系统状态
    sar -n DEV 2    # 看所有网卡的流量，定时 2 秒检查
    ```
3. 之前讲 HTTPS 时介绍过一个专门的网站[SSLLabs](https://www.ssllabs.com/)，而对于 HTTP 性能优化，也有一个专门的测试网站[WebPageTest](https://www.webpagetest.org/)。它的特点是在世界各地建立了很多的测试点，可以任意选择地理位置、机型、操作系统和浏览器发起测试，非常方便，用法也很简单。网站测试的最终结果是一个直观的“瀑布图”（Waterfall Chart），清晰地列出了页面中所有资源加载的先后顺序和时间消耗。
4. Chrome 等浏览器自带的开发者工具也可以很好地观察客户端延迟指标，面板左边有每个 URI 具体消耗的时间，面板的右边也有瀑布图。

<a id="markdown-http性能优化" name="http性能优化"></a>

## HTTP性能优化
<a id="markdown-开源" name="开源"></a>

### 开源
* Nginx及相关配置
* HTTP启用长连接
<a id="markdown-节流" name="节流"></a>

### 节流
* 数据压缩：图片，json等
* html/css/js的minify
* 去除不必要的Header属性
* 减少域名数量和重定向次数
<a id="markdown-缓存" name="缓存"></a>

### 缓存
* 服务器缓存：Redis
* CDN缓存
<a id="markdown-升级到http2" name="升级到http2"></a>

### 升级到HTTP/2
* 消除了应用层的队头阻塞，拥有头部压缩、二进制帧、多路复用、流量控制、服务器推送等许多新特性，大幅度提升了 HTTP 的传输效率。
<a id="markdown-关于资源合并" name="关于资源合并"></a>

### 关于资源合并
* “资源合并”在 HTTP/1 里减少了多次请求的成本，但在 HTTP/2 里因为有头部压缩和多路复用，传输小文件的成本很低，所以合并就失去了意义。而且“资源合并”还有一个缺点，就是降低了缓存的可用性，只要一个小文件更新，整个缓存就完全失效，必须重新下载。
* 所以在现在的大带宽和 CDN 应用场景下，应当尽量少用资源合并（JS、CSS 图片合并，数据内嵌），让资源的粒度尽可能地小，才能更好地发挥缓存的作用。

<a id="markdown-https性能优化" name="https性能优化"></a>

## HTTPs性能优化
<a id="markdown-1-硬件优化cpussl加速卡ssl加速服务器" name="1-硬件优化cpussl加速卡ssl加速服务器"></a>

### 1. 硬件优化：CPU，SSL加速卡，SSL加速服务器
<a id="markdown-2-软件优化" name="2-软件优化"></a>

### 2. 软件优化：

1. 软件升级：Linux内核，Nginx，OpenSSL
2. 协议优化：
    * TLS1.3
    * 密钥交换协议尽量选用椭圆曲线ECDHE算法，能够把握手的消息往返由 2-RTT 减少到 1-RTT，达到与 TLS1.3 类似的效果。
    * Nginx配置密码套件和椭圆曲线，将优先使用的放在前面。
3. 证书优化：
    * CRL（Certificate revocation list，证书吊销列表）由 CA 定期发布，里面是所有被撤销信任的证书序号，查询这个列表就可以知道证书是否有效。
    * 现在 CRL 基本上不用了，取而代之的是 OCSP（在线证书状态协议，Online Certificate Status Protocol），向 CA 发送查询请求，让 CA 返回证书的有效状态。
    * “OCSP Stapling”（OCSP 装订），它可以让服务器预先访问 CA 获取 OCSP 响应，然后在握手时随着证书一起发给客户端，免去了客户端连接 CA 服务器查询的时间。
4. 会话复用：
    * 我们再回想一下 HTTPS 建立连接的过程：先是 TCP 三次握手，然后是 TLS 一次握手。这后一次握手的重点是算出主密钥“Master Secret”，而主密钥每次连接都要重新计算，未免有点太浪费了，如果能够把“辛辛苦苦”算出来的主密钥缓存一下“重用”，不就可以免去了握手和计算的成本了吗？
    * 这种做法就叫“会话复用”（TLS session resumption），和 HTTP Cache 一样，也是提高 HTTPS 性能的“大杀器”，被浏览器和服务器广泛应用。
    * 会话复用分两种
        * 第一种叫“Session ID”：“Session ID”是最早出现的会话复用技术，也是应用最广的，但它也有缺点，服务器必须保存每一个客户端的会话数据，对于拥有百万、千万级别用户的网站来说存储量就成了大问题，加重了服务器的负担。
        * 第二种叫“Session Ticket”：它有点类似 HTTP 的 Cookie，存储的责任由服务器转移到了客户端
    * 预共享密钥：
        * 在发送 Ticket 的同时会带上应用数据（Early Data），免去了 1.2 里的服务器确认步骤，这种方式叫“Pre-shared Key”，简称为“PSK”。

上面的内容来自极客时间的《透视HTTP协议》课程的39和40两节课。
另外，[极客时间-罗剑锋-《透视HTTP协议》总结](/blog/2021/05/26/toushi-http-xieyi/)中的章节[http性能优化](/blog/2021/05/26/toushi-http-xieyi/#http性能优化)，有一个概括性的描述。
