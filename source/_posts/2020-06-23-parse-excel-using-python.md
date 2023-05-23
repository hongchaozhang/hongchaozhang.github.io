---
layout: post
title: "使用Python解析Excel文件"
date: 2020-06-23 19:17:45 +0800
comments: true
categories: [productivity, python]
---

<!-- more -->

## Python基础教程

[python基础教程](https://www.runoob.com/python/python-tutorial.html)

## xlrd和xlwt

```
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import xlrd
import xlwt


def read_excel():
    file_name = 'demo.xlsx'

    # 打开excel文件
    wb = xlrd.open_workbook(file_name)

    # 获取所有表格名字
    print(wb.sheet_names())

    # 通过索引获取表格
    sheet1 = wb.sheet_by_index(0)
    print(sheet1.name, sheet1.nrows, sheet1.ncols)

    # 获取行内容
    rows = sheet1.row_values(2)
    print(rows)

    # 获取列内容
    cols = sheet1.col_values(3)
    print(cols)

    # 获取表格里的内容，三种方式
    print(sheet1.cell(1, 0).value)
    print(sheet1.cell_value(1, 0))
    print(sheet1.row(1)[0].value)


def write_excel():
    f = xlwt.Workbook()

    # 添加sheet
    sheet1 = f.add_sheet('Students', True)

    # 创建杭数据和列数据
    row0 = ["qq", "ddd", "fgg", "hjj"]
    column0 = ["zsfsd", "ghg", "Python", "fs", "fgsf", "zbg"]

    # 写第一行
    for i in range(0, len(row0)):
        sheet1.write(0, i, row0[i])

    # 写第一列
    for i in range(0, len(column0)):
        sheet1.write(i + 1, 0, column0[i])

    # 保存文件为xls格式，xlsx格式不能打开
    f.save('test.xls')

```

## openpyxl

xlwt的局限性是不能写入超过65535行、256列的数据（因为它只支持Excel 2003及之前的版本，在这些版本的Excel中行数和列数有此限制）。openpyxl支持07/10/13版本Excel，功能很强大，但是操作起来感觉没有xlwt方便。

## 总结
1. 读取Excel时，选择openpyxl和xlrd差别不大，都能满足要求
2. 写入少量数据且存为xls格式文件时，用xlwt更方便
3. 写入大量数据（超过xls格式限制）或者必须存为xlsx格式文件时，就要用openpyxl了。