---
layout: post
title: "区域位置地理信息的获取、查看、和后期处理"
date: 2020-05-29 16:53:59 +0800
comments: true
categories: [map tech, productivity]
---

<!-- more -->

如果想展示一些基于地理位置信息的数据，可以考虑使用地图。比如：

![区域男女比例](/images/区域男女比例.gif)

> 注：上图是MicroStrategy产品效果。

这需要在地图上显示指定区域的边界信息，比如中国国家边界信息，或者各省市的边界信息。

为此，首先要获得边界信息数据。下面就介绍一下我在获取中国各省边界信息的过程中用到的一些资源和工具。

## 下载

![GADMDownload](/images/GADMDownload.jpg)

[GADM](https://gadm.org/download_country_v3.html)可以下载的格式包括KMZ格式和SHP格式。

1. KMZ格式是KML格式的压缩格式，需要用解压工具解压。
2. 下载文件中中国各地区的名称都是英文名称，需要写脚本换成中文信息。
3. 下载的中国各省没有包括台湾，需要手动下载台湾，整合起来。

贴个我整合好的连结：[中国各省男女比例地图分析](/assets/resources/中国各省男女比例地图分析.zip)。

## 查看

![vscodemappreview](/images/vscodemappreview.jpg)

在VSCode中使用插件VSCode Map Preview进行预览。但是该插件不支持SHP格式文件预览。

![mapshaper](/images/mapshaper.jpg)

[mapshaper](https://mapshaper.org/)这个地址支持SHP文件的预览，但是不支持KML格式的预览。

## 编辑

在VSCode中编辑，同时结合VSCode Map Preview插件进行预览。

目前为止，发现的编辑工具都只能基于文本进行编辑，还没有发现一款有UI界面的编辑工具。

## 绘制

![geojsondraw](/images/geojsondraw.jpg)

[geojson.io](http://geojson.io/)手动绘制多边形，并且导出geojson格式的文件。

## 格式转换

GDAL ogr2ogr

1. 安装GDAL
    1. pkg安装
    2. homebrew 安装
2. 添加环境变量`export PATH=/Library/Frameworks/GDAL.framework/Programs/:$PATH`到`～/.bash_profile`文件。
3. 运行`source ~/.bash_profile`或者重启Terminal。

现在就可以运行ogr2ogr命令进行格式转化了：

```
ogr2ogr -f “KML” output.kml input.shp
```

## 压缩

### GDAL ogr2ogr压缩点的数量
除了格式转换，GDAL ogr2ogr还可以进行压缩（ogr2ogr官方网站 https://gdal.org/programs/ogr2ogr.html）：

```
ogr2ogr output.kml input lml 0.0001
```

上面命令中最后一个参数对应的是压缩系数，用来控制点的数量，不代表经纬度的小数点位数。

### google官方工具压缩经纬度的经度
如果要压缩经纬度的精度，即小数点的位数，可以使用[google官方工具](https://www.gearthblog.com/blog/archives/2016/03/making-kml-files-smaller-reducing-precision.html)。

### mapshaper压缩点的数量，并实时查看效果。

![mapshapercompressor](/images/mapshapercompressor.gif)

[mapshaper](https://mapshaper.org/)进行压缩很是方便。

**优点：**

1. 滑块调整压缩系数，同时查看压缩效果。
2. 可以导出shp格式文件，还有console可以查看shp文件结构。

## 多边形合并融合

关键字：merge dissolve

试图寻找中国七大区域（华北、华南、东北等）边界信息，没有找到。理论上可以通过多边形合并得到，但是没有合适的工具。

目前只发现了ArcGIS的desktop可以做这个事情，但是需要收费账号。

## 中国各省份的坐标

[省市坐标](https://github.com/baixuexiyang/geocoord)上面贴出了中国各省的地理坐标，可能需要用到。

## 数据源

有了各地区的边界信息，我们还需要各地区的一些有意义的数据，比如人口，GDP等，才能在地图上进行查看。这些数据怎么得到呢？

### 国家数据网站
[国家数据网站](http://data.stats.gov.cn/)提供全国各省很多类型的数据，值得好好挖掘。

其中：

1. [年度数据](http://data.stats.gov.cn/easyquery.htm?cn=C01)适合查看变化趋势；
2. [分省年度数据](http://data.stats.gov.cn/easyquery.htm?cn=E0103)适合观察基于地图的地区分布趋势；
3. [普查数据](http://www.stats.gov.cn/tjsj/pcsj/)中的人口普查数据有详细的人口方面的数据。
4. ...

### 使用脚本解析excel

上面的数据有的是网页数据，有的是excel数据（普查数据），对excel内部数据的结构调整可以参考[使用node-xlsx进行excel文件的读写](http://hongchaozhang.github.io/blog/2016/03/04/parsing-and-write-excel-file-using-node-module/)进行。

最后贴上所有的资源，包括最后写成的文档：[中国各省男女比例地图分析](/assets/resources/中国各省男女比例地图分析.zip)。
