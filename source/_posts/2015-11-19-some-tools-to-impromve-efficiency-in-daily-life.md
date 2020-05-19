---
layout: post
title: "Some Tools to Impromve Efficiency in Daily Life"
date: 2015-11-19 16:16:22 +0800
comments: true
categories: [productivity]
---

<!-- more -->

- [Everything](#everything)
- [DocFetcher](#docfetcher)
- [RescueTime](#rescuetime)
- [EuDic](#eudic)
- [calibre](#calibre)
- [<del>Astah</del> (draw.io的chrome插件更好用)](#delastahdel-drawio%E7%9A%84chrome%E6%8F%92%E4%BB%B6%E6%9B%B4%E5%A5%BD%E7%94%A8)
- [图像视频操作](#%E5%9B%BE%E5%83%8F%E8%A7%86%E9%A2%91%E6%93%8D%E4%BD%9C)
    - [LICECap](#licecap)
    - [Kap](#kap)
    - [PicGif Lite](#picgif-lite)


### Everything

瞬间搜索全机器文件。但是只支持文件名搜索，不支持文件内容搜索。结合DocFetcher应用，可以大大提高搜索文件的效率。

### DocFetcher

支持文件内容搜索。但是索引文件较大，最好分目录进行索引，不要索引整台计算机。结合Everything应用，可以大大提高搜索文件的效率。

### RescueTime

可以用来监督你一天之中分别有多少时间花在什么地方。在上淘宝的时候都想快点结束，不然一天下来数据会很难看。

### EuDic

Mac上的这个词典好过系统自带的Dictionary很多。引用推荐人的一句话：这是Mac上最好用的词典，没有之一。

但是这是一个收费的软件，只能试用50次。这个值可以在下面文件里面修改：*Users/[User]/Library/Preferences/com.eusoft.eudic.plist*。用Xcode打开此文件，修改`MAIN_TimesLeft`为100000000即可。

> 如果喜欢这个软件，还是花一百多块钱支持一下作者吧。而且这是一次性的费用。
> 
> 我用VS Code打开是乱码。

### calibre

喜欢看电子书的话，用这个编辑电子书非常方便。比如，将一部合集拆成几个部分，或者反过来，将几部分合成一本电子书。

### <del>Astah</del> (draw.io的chrome插件更好用)

用**Astah Community**（Astah还有收费版本：Astah Professional，功能更全，不过Astah Community完全够用了。）来画UML图的class diagram和sequence diagram非常方便，尤其是sequence diagram，相比于之前用的**Dia**，简直是方便太多了，用**Dia**画sequence diagram简直就是噩梦。

对于Astah中定义的UML sequence diagram，参考[UML建模之时序图（Sequence Diagram）](http://www.uml.org.cn/oobject/201009081.asp)

### 图像视频操作

#### LICECap
[LICECap](http://www.cockos.com/licecap/)用来快速将屏幕操作等转换成gif动画，比先录屏再转换快太多了。

#### Kap
[Kap](https://getkap.co/)比LICECap更加好用，而且可以直接指定一个App的界面进行录制。Kap可以导出多种格式，包括MP4，Gif等。

使用Mac自带的Preview是不能预览gif图片的，可以通过以下两种方式预览：

* 在Finder中选中gif图片，在右边的预览框中预览。
* 将gif用浏览器打开预览，比如Safari。

#### PicGif Lite
PicGif用来将视频或者图片转换成gif图片，这种工具很多，还有在线工具，比如[uupoop](http://www.uupoop.com/gif/)。<del>我主要用这个来进行gif图的预览。</del>