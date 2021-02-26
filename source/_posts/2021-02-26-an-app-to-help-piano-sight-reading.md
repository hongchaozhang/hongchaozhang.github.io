---
layout: post
title: "帮助练习钢琴视奏的应用SightReading"
date: 2021-02-26 14:47:28 +0800
comments: true
categories: [ios, music]
---

<!-- more -->

参[SightReading](https://github.com/hongchaozhang/SightReading)获取应用代码和使用方法。

## 类图和数据结构

![SightReadingClassDiagram](/images/SightReadingClassDiagram.jpg)

标签保存在UserDefault里面，数据格式如下：

```json
{
    "ALL_TAGS" : ["tag1", "tag2", "tag3"],
    "天空之城1" : ["tag1", "tag2"],
    "天空之城2" : ["tag2", "tag3"],
    "巴赫小步舞曲" : ["tag1"]
}
```

对于乐谱“天空之城1”，保存的文件名如下：

1. 乐谱图片：天空之城1.png
2. 笔记图片：天空之城1&-note.png
3. 每小节位置和大小文件：天空之城1.json

其中json文件格式如下：

```json
{
    "basic info" : {
        "tempo" : "90", // 每分钟节拍数
        "meter" : "4", // 每小节节拍数
        "maskOffset" : "1" // Mask偏移
    },
    "bar frames" : {
        1 : CGRect(0.01, 0.02, 0.11, 0.12), // 小节序号和小节位置大小的相对于整个乐谱图片的大小，最终显示的时候需要根据实际显示的乐谱的大小算出每个小节的位置和大小
        2 : CGRect(0.13, 0.03, 0.12, 0.11),
        .
        .
        .
    }
}
```

## 一些其它问题

### 移动Mask时换页的逻辑
在前一页最后一些节需要显示Mask的时候直接换页到下一页，因为这个时候演奏者已经看完了前一页的最后一小节，并且需要预读下一页的第一小节。
