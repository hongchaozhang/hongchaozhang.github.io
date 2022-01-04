---
layout: post
title: "极客时间-Web前端性能优化"
date: 2022-01-04 18:06:29 +0800
comments: true
categories: [web, html, javascript, css]
---

<!-- more -->

## 资源压缩与合并
资源合并会减少请求次数，总体上降低请求时间。但是，也不能不加考虑地都合并到一起，这样会影响首页渲染速度。

### 图片优化

1. 图片**雪碧图**，不能太大，太大影响首屏渲染性能。一个页面的小图放在一起，生成一张雪碧图即可。
2. **inline image**，inline image内嵌在html里面，作为html的一部分和html一起加载。当图片大小小于8KB时，考虑使用inline image。
3, **使用webp格式图片**，webp格式图片由google推出，android平台支持好，apple safari浏览器有兼容性问题（2020年Mac OS Big Sur中的Safari 14已经支持WebP格式。）
4. **jpg**、**png**、**svg**等图片格式各有其特点和应用场合。

另附上两个公交软件：

1. [图片压缩网站](https://tinypng.com)
2. [雪碧图生成网站](www.spritecow.com)

## 图片的懒加载预加载
### 懒加载：
通过图片进入可视区域的时候再设置img的src属性，进行请求。或者通过库实现。

### 预加载：

1. 使用`image`标签引入，先设置`display:none`。需要显示的时候再通过设置`display`属性将其显示出来。
2. 在js中`new image`，并且设置`image`的`src`，进行图片下载，保存在js的变量中，但是不显示，需要的时候直接拿过来显示即可。
3. 使用`XMLHttpRequest`，可以清楚知道请求的过程，但是存在跨域的问题。
4. 或者通过库实现：preloader.js

## HTML渲染过程

1. 顺序执行，并发加载：为了让资源并发加载，可以部署多个CDN，以突破浏览器对单个域名并发加载数量的限制（4-6个）。
    1. [突破浏览器域名并发限制的解决方案](https://juejin.cn/post/6844904035628089357)
    2. 浏览器为什么要有这个限制，针对这个限制我们在开发的时候怎么优化？参考[前端性能优化篇——浏览器同域名并发请求对限制](https://segmentfault.com/a/1190000039157302)
2. css加载延迟，页面先显示出没有样式的内容，原因是：css没有在header中引入，而是通过其他方式加载，比如在js中加载css。但是在header中通过link加载css也有缺点：阻塞页面渲染和js执行，但是不阻塞外部脚本的加载（得益于webkit的预扫描功能），但是阻塞执行。
3. `script`和`import`引入方式：`script`引入js是同步的，阻塞页面渲染。结合`differ`和`sync`标签影响js引入过程。不阻塞资源的加载（得益于webkit的预扫描功能）。
4. SPA：单页应用，动态加载，路由到相关页面再加载相关的资源。

## 重绘（外观）与回流（布局）redraw/reflow
css性能让js变慢
css影响layout，进而产生重绘与回流。多次的重绘与回流使得UI线程多次工作，而UI线程的启动会阻塞js线程的执行。

下面是一些有关**回流与重绘**实战演练。通过观察Chrome的Performance调试工具分析渲染过程和性能瓶颈。截图如下：

![chrome_performance_demo.jpg](/images/chrome_performance_demo.jpg)

### top and translate
相比于`top`，`translate`没有回流的过程，对于dom结构复杂的页面，性能提升比较明显。

<details>
  <summary>Code using `top`</summary>

    <html>
    <head>
        <style>
            #rect {
                position: relative;
                top: 0;
                width: 100px;
                height: 100px;
                background: blue;
            }
        </style>
    </head>
    <body>
        <div id="rect"></div>
        <script>
            setTimeout(() => {
                document.getElementById("rect").style.top = "100px";
            }, 2000);
        </script>
    </body>
    </html>

</details>

<details>
  <summary>Code using `transform`</summary>

    <html>
    <head>
        <style>
            #rect {
                position: relative;
                transform: translateY(0);
                width: 100px;
                height: 100px;

                background: blue;
            }
        </style>
    </head>
    <body>
        <div id="rect"></div>
        <script>
            setTimeout(() => {
                document.getElementById("rect").style.transform = "translateY(100px)";
            }, 2000);
        </script>
    </body>
    </html>

</details>

### `opacity`替换`visibility`
`opaciy`：如果被修改的dom元素自己是一个图层，不触发回流和重绘（试验结果：没有回流，但是有重绘）；否则，触发回流和重绘。
`visibility`：不触发回流，只触发重绘。

### 多个dom样式通过class一次改动多条style属性，减少回流和重绘的次数

### 先设置`display`为`none`，再修改各种属性，再将`display`设回来。

### 不要在循环中获取dom的`clientWidth`，否则会flash掉浏览器的缓冲区，使浏览器性能下降。
缓冲区是浏览器的优化机制，将多个改动合并成一次改动，以便提高效率。

### 少用table布局。
修改某一`td`的宽度，会使得所有`td`进行回流。

### 动画的刷新率和页面性能平衡

### 将gif图单独成一个图层
通过设置某些css属性，将某个dom做成一个图层：

1. `will-change`
2. `transform: translateZ(0)`
3. `translate3d(0,0,0)`

### 启用GPU硬件加速

启用GPU加速，会减少重绘的时间，但是图层增多，图层合并的时间会增加，这里也有个平衡需要把握。

细节参考[Web 性能优化-CSS3 硬件加速(GPU 加速)](https://lz5z.com/Web%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96-CSS3%E7%A1%AC%E4%BB%B6%E5%8A%A0%E9%80%9F/)


## 浏览器存储

1. cdn域名和主站域名区分开，防止获取静态资源携带cookie，浪费带宽。
2. 通过service worker开启另一个线程，和主页通过`postMessage`互相通信。
3. 通过浏览器performance profile查看性能瓶颈和改进效果。
4. 增加图层是减少的重绘与回流的时间与增加的图层合并时间的增加之间的平衡。比如通过设置translate3d开启GPU加速。
5. 获取offsetHeight为什么会降低效率？使缓冲区域失效，因为要得到一个真实的尺寸。缓冲区域是浏览器的一个优化机制，通过将多次更改dom综合起来一次更新，提高效率。

## 缓存
#### 强缓存
如果命中，不需要发请求到服务器。

1. cache-control: max-age, s-max-age
2. expires:

#### 协商缓存（弱缓存）
需要发请求到服务器询问本地缓存是否可用。如果可用，服务器返回304，不携带具体内容，具体内容从本地缓存中读取。如果不可用，服务器直接返回内容。

1. last-modified:
2. if-modified-since: 304
3. e-tag:
4. if-none-match:

浏览器缓存流程如下：

![浏览器缓存流程图.png](/images/浏览器缓存流程图.png)

关于缓存，下面两篇文章介绍的很清楚：

1. [Web 缓存介绍](https://www.jiqizhixin.com/articles/2020-07-24-12)
2. [HTTP 缓存之浏览器刷新行为](https://segmentfault.com/a/1190000010787023): disable cache setting in the developper tool

## 服务器端渲染
1. vue-ssr (server-side-rendering)
2. react-ssr
3. 代价：需要一个universal的code base，保证其在服务器端和浏览器端都能运行。

