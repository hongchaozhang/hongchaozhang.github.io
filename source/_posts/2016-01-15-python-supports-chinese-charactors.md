---
layout: post
title: "python对中文的支持问题"
date: 2016-01-15 23:18:52 +0800
comments: true
categories: [python]
---
参考[官方文档](https://www.python.org/dev/peps/pep-0263/)

<!-- more -->

一种解决方案：在python文件的开头（第一行）加入如下内容：
```python
#!/usr/local/bin/python
# coding: utf-8
```
