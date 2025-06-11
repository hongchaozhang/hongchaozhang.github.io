---
layout: post
title: "Web性能指标"
date: 2025-06-10 17:51:04 +0800
comments: true
categories: [performance, web]
---

<!-- more -->

下面是Google Web Vitals的指标，以及如何测量。

* [Web Vitals](https://web.dev/articles/vitals)
* [Largest Contentful Paint (LCP)](https://web.dev/articles/lcp#measure)
* [Interaction to Next Paint (INP)](https://web.dev/articles/inp#how-to-measure-inp)
* [Cumulative Layout Shift (CLS)](https://web.dev/articles/cls#measure)

下面对其进行总结。


## 🔍 什么是 Web Vitals？

* **Web Vitals** 是 Google 推出的统一性能评估体系，旨在让开发者、产品经理等聚焦界面体验质量的核心指标 ([web.dev](https://web.dev/articles/vitals))。
* 它简化了性能指标体系，聚焦当前"**Core Web Vitals**"（核心页面体验指标） ([developers.google.com](https://developers.google.com/search/docs/appearance/core-web-vitals))。


## 🎯 Core Web Vitals 主要指标

![lcp inp cls](/images/LCP-INP-CLS.jpg)

这三个指标反映了用户体验的三个关键维度：

| 指标                              | 描述                     | 优良阈值                   |
| ------------------------------- | ---------------------- | ---------------------- |
| LCP (Largest Contentful Paint)  | 最大内容元素首次对用户可见所需时间      | ≤ 2.5 s ([web.dev](https://web.dev/articles/vitals)) |
| INP (Interaction to Next Paint) | 用户交互至下一帧渲染完成的延迟，反映响应速度 | ≤ 200 ms               |
| CLS (Cumulative Layout Shift)   | 页面元素意外移动引起的视觉稳定性问题累积分数 | ≤ 0.1                  |

* 衡量标准采用 **75th percentile**，也就是大多数用户（前 75%）体验应满足上述阈值 ([web.dev](https://web.dev/articles/vitals))。
* 长期来看，Core Web Vitals 指标可能会随着研究演进调整（目前由实验→待定→稳定阶段管理） 。



## 🛠 如何衡量 Web Vitals

* **合成工具**：Lighthouse、WebPageTest、Chrome DevTools Performance 面板（支持实时测量 FCI、LCP、CLS、INP） ([web.dev](https://web.dev/performance))。
* **真实用户监控**：

  * 使用 `web-vitals` JS 库采集、上报（可配合 GA4、BigQuery）([web.dev](https://web.dev/articles/vitals-ga4))；
  * 或使用现成 RUM 工具，如 Google Analytics、CrUX、Search Console Core Web Vitals 报告等 ([web.dev](https://web.dev/articles/vitals-ga4))。



## [Largest Contentful Paint (LCP)](https://web.dev/articles/lcp#measure)


### 1. 什么是 LCP？

* **LCP** 指的是浏览器首次渲染页面中 **最大内容元素**（如图片块、文本块或视频）的时间，相对于页面开始加载时刻([web.dev](https://web.dev/articles/lcp?utm_source=chatgpt.com))。
* 它是 Core Web Vitals 中衡量“页面主要内容是否快速可见”的关键指标，比传统指标（如 FCP、DOMContentLoaded）更能贴合用户感知([web.dev](https://web.dev/articles/lcp?hl=ja&utm_source=chatgpt.com))。
* LCP被认为是最接近“首屏渲染时间”的指标。


### 2. 考量元素与规则

* LCP 只考虑特定类型元素。
* 只计算可见部分

下面是几个LCP的例子。

![lcp demo 1](/images/lcp-demo1.png)

在这个例子中，新内容被添加到DOM中，这改变了哪个元素是最大的。


![lcp demo 2](/images/lcp-demo-2.png)

在这个例子中，Instagram的logo相对较早加载，即使其他内容逐渐显示，它仍然是最大的元素。


![lcp demo 3](/images/lcp-demo-3.png)

在这个Google搜索结果页面的例子中，最大的元素是一段文本，它在任何图像或logo加载完成之前就显示出来了。由于所有单独的图像都比这段文本小，所以在整个加载过程中它始终是最大的元素。



## [Interaction to Next Paint (INP)](https://web.dev/articles/inp#how-to-measure-inp)


### 🎯 什么是 INP？

* **INP** 是 Core Web Vitals 的一项稳定指标，用来评估页面对用户所有交互（点击、触摸、键盘输入等）的整体响应能力。
* 它会记录整个页面生命周期中的每次交互延迟，最终以 **最长的那次交互**（剔除极端值）作为该页面的 INP 分数。


### 🔄 为什么用 INP 替代 FID？

* **FID（First Input Delay）** 只测量页面首次交互的延迟，而 INP 更全面，衡量整个访问过程中的所有交互延迟，更真实反映用户体验。
* INP 包括从用户输入、事件处理到下一帧


### 🧪 如何测量 INP？

使用 `web-vitals` JavaScript 库测量 INP。


### 🛠 提高 INP 的常见优化措施

1. 避免主线程长时间阻塞（比如大循环或同步 JS）。
2. 将重逻辑拆分为异步任务（如 requestIdleCallback、setTimeout）。
3. 减少第三方脚本干扰。
4. 延迟加载不重要的资源（如图片、iframe）。
5. 使用 `content-visibility: auto` 优化首次绘制区域。


## [Cumulative Layout Shift (CLS)](https://web.dev/articles/cls#measure)

### 🧩 什么是 CLS？

* **CLS（Cumulative Layout Shift）** 測量的是页面在非用户触发的情况下，视觉内容发生的意外位移累积程度，是 Core Web Vitals 的一项重要稳定指标 ([web.dev][1])。
* 一次布局移动（layout shift）指的是在两个绘制帧之间，一个可见元素的位置改变。若多个这种变化连续发生（间隔 < 1 秒，总时长 ≤ 5 秒），它们形成一个布局移动“突发窗口”（session window），CLS 取该窗口里得分最高的一组变化 ([web.dev][1])。


### 📊 如何计算布局移动分数？

每次 layout‑shift 条目的分数由下面两个部分组成：

1. **impact fraction**：不稳定元素的影响区域占视口大小的比例。
2. **distance fraction**：元素移动距离占视口最大边长（宽或高）的比例。


### 🧪 如何测量 CLS？

#### 实验室工具（合成环境）：

* Chrome DevTools、Lighthouse、PageSpeed Insights、WebPageTest 都可测量加载过程中的 CLS 值。

#### 真实用户监控（Field Data）：

* 使用 CrUX、Search Console、PageSpeed Insights RUM 等；
* 推荐通过 `web-vitals` 或 Layout Instability API 捕获事件并上报

### 🛠 如何优化 CLS？

* **显式指定资源尺寸**：给图片、视频、iframe 设置 `width/height` 或使用 CSS aspect-ratio，避免加载后推移。
* **先占位后加载**：异步加载资源前预留空间（例如广告、远程组件），加载后不引起布局移动。
* **适度动画过渡**：用 CSS `transform` 动画代替突兀的布局变化，若与用户交互触发可排除计算。
* **第三方脚本注意尺寸**：广告、embed 内容应提供固定高度/宽度；若动态变化，应用动画或预留长条提示。
* **过滤用户交互触发移动**：500ms 内关联用户交互的 layout shift 不计入 CLS（例如点击展开）。
