---
layout: post
title: "使用Python解析XML格式文件"
date: 2020-06-22 18:34:32 +0800
comments: true
categories: [productivity, python]
---

<!-- more -->

## Python基础教程

[python基础教程](https://www.runoob.com/python/python-tutorial.html)

## ElementTree

ELementTree官方文档参考：[The ElementTree XML API](https://docs.python.org/2/library/xml.etree.elementtree.html#xml.etree.ElementTree.Element)

下面是一个例子：

```
from xml.etree import ElementTree as ET

# 读取xml文件
tree = ET.parse('gadm36_CHN_2.kml')
## 获取root节点
root = tree.getroot()

# 打印root节点的tag名称和所有的attribute
print root.tag, root.attrib

# 正常的xml文件的tag可能只是Placemark，这里是因为读进来的是一个kml文件
for placemark in root.iter('{http://www.opengis.net/kml/2.2}Placemark'):
    for simpleData in placemark.iter('{http://www.opengis.net/kml/2.2}SimpleData'):
        # 获取某一个attribute的值也可以可以使用simpleData.get('attribute name')
        print simpleData.attrib['name']
        if simpleData.attrib['name'] == 'NAME_2':
            cityName = simpleData.text
            # 创建一个tag为name的节点作为placemark的子节点
            nameEle = ET.SubElement(placemark, 'name')
            # 给新创建的节点的text属性赋值
            nameEle.text = cityName
            # 给placemark节点增加一个名为updated的attribute，其值为'yes'
            placemark.set('updated', 'yes')

# 将新修改的xml文件写入新的文件
tree.write('modifyChinaCity.kml')
```