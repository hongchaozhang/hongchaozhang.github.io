---
layout: post
title: "Introducing Create ML"
date: 2018-06-15 17:39:30 +0800
comments: true
published: false
categories: [ios, wwdc]
---


Turi介绍

Previous blog:

[CoreML Usage](../../../../2017/12/28/coreml-usage/)


来自OneV的博客：https://onevcat.com/2018/06/wwdc-2018/

模型训练在 Mac 平台上一直是一个软肋，因为最近 Mac 已经不再配置 Nvidia 的显卡，TensorFlow 甚至都已经不再为 macOS 提供带 GPU 支持的版本，对于日常工作在 Apple 平台的开发者来说，训练一个自己的模型一度是相当困难的事情。
2016 年 Apple 曾经收购了一家 ML 的初创公司 Turi，在今年这一收购案终于是开花结果。基于 Turi 的模型训练框架 Create ML 可以利用 Mac 的 GPU (以及 Metal) 进行训练，并直接得到 Core ML 可用的模型。结合自家 Playground 的更新，Apple 更是祭出了 CreateMLUI 这种“傻瓜式”但效果还很不错的可视化方式，现在开发者只需要将训练数据和测试数据拖拽到 Playground UI 中，就能在 Apple 自家的模型的基础上，得到很好的结果。这大大降低了一般开发者在第三方 app 中集成 AI 特性的门槛，有很多时候用户并不一定需要 Google Assistant 那样复杂的应用，而在一般的各类 app 中集成的 AI，对 app 易用性的提升会相当显著。
