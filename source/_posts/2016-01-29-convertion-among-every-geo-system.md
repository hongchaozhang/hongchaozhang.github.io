---
layout: post
title: "火星坐标导致iOS系统下高德地图定位不准"
date: 2016-01-29 13:47:42 +0800
comments: true
categories: [ios, objective-c]
---

首先感慨一下：神奇的国度，神奇的坐标！

### 火星坐标系统介绍

<!-- more -->

我们平时用到的地球坐标系统，叫做WGS-84坐标，这个是国际通用的“准确”的坐标系统。国家保密插件，其实就是对真实坐标系统进行人为的加偏处理，即为GCJ-02坐标，戏称“火星坐标”。于是，我们有了下面的东西：

* 地球坐标：指WGS84坐标系统
* 火星坐标：指使用国家保密插件人为偏移后的坐标
* 地球地图：指与地球坐标对应的客观真实的地图
* 火星地图：指经过加密偏移后的，与火星坐标对应的地图

而且，国家龟腚： **国内出版的各种地图系统（包括电子形式），必须至少采用GCJ-02对地理位置进行首次加密。**于是，

* 谷歌地图的大陆地图、高德国内地图采用GCJ-02对地图进行加偏。
* 百度地图更是进一步发挥了天朝特色，除了GCJ-02加偏，自己又在此基础上继续进行加偏，相应的坐标称为BD-09坐标。

也就是说，我们平时用到的地图应用都是采用的虚假的坐标，虚假的地图。

### 各地图厂商使用的坐标系

* 火星坐标
    * iOS 地图
    * Gogole地图
    * 搜搜、阿里云、高德地图
* 地球坐标
    * Google 卫星地图（国外地图应该都是……）
* 百度坐标
    * 百度地图

### 各坐标系之间的转换

为了在地图应用开发中准确地定位，需要将准确的WGS-84坐标转换成需要的坐标。在加偏算法不公开的的情况下，各方大神各显神通，有了下面几种方案：

#### 数据库

可以列出WGC-84坐标和GCJ-02坐标系统的对应关系，放在数据库中供检索。数据库方案参考：[GPS火星坐标转换](http://code4app.com/ios/GPS%E7%81%AB%E6%98%9F%E5%9D%90%E6%A0%87%E8%BD%AC%E6%8D%A2/51c2564f6803fa9a29000000)。

也有一些网站提供转换查询服务，比如[ZDOZ.net](http://www.zdoz.net/)，和 [坐标转换API - Web服务API](http://lbsyun.baidu.com/index.php?title=webapi/guide/changeposition)。

#### 近似解析式

逆向求解近似解析式，不需要大的数据库，不需要进行网络请求，而且精度在10米以内，基本能满足日常需求。

这样的实现很多，具体实现可以参考Objective-C的一种实现：[JZLocationConverter](https://github.com/JackZhouCn/JZLocationConverter)。

### iOS系统中坐标系的使用

iOS（9.0）中的关于地图和位置的接口中有些用的是WGS-84坐标，有的使用的是GCJ-02坐标。比如定位用户位置的时候我们使用的两种方法：

* 设置MKMapView中的`showsUserLocation = YES`，然后在`- (void)mapView:(MKMapView *)mapView didUpdateUserLocation:(MKUserLocation *)userLocation`方法中获得的坐标是GCJ-02坐标。
* 通过CLLocationManager的`startUpdatingLocation`方法，并在`- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations`方法中获得的坐标是WGS-84坐标。

其实在使用iOS的地图应用的时候，只要使用的是非大陆的ip地址（国外用户或者国内用户通过国外代理），使用的都将是准确的WGS-84坐标和准确的地图。但是当在大陆地区使用是，苹果使用的是搞得的地图服务，得到的坐标也都是GCJ-02坐标。

下面具体说一下在下面三个接口中经纬度坐标的使用，下面的内容都是针对iOS中高德地图的使用。

#### MKMapView

通过加到MMKMapView中的UIGestureRecognizer的`locationInVieww:`获得手势在地图上的CGPoint，然后通过MKMapView的`convertPoint:toCoordinateFromView:`方法得到的经纬度坐标是GCJ-02坐标，使用的也是高德地图，所以在`addAnnotation:`等操作的时候，不用进行坐标转换。

### CLLocationManager

即使使用的是高德地图，CLLocationManager返回的坐标也是WGS-84坐标，所以在定位用户位置的时候是有偏差的，需要我们进行坐标转换。

### CLGeoCoder

在进行经纬度坐标和地址描述转换的时候，我们需要CLGeoCoder中的转换方法：

* `- (void)geocodeAddressString:(NSString *)addressString completionHandler:(CLGeocodeCompletionHandler)completionHandler`

    该方法没有问题，输入地址的描述，返回该地址对应的GCJ-02坐标（高德地图）。

* `- (void)reverseGeocodeLocation:(CLLocation *)location completionHandler:(CLGeocodeCompletionHandler)completionHandler`

    该方法有问题：当我们直接将得到的GCJ-02坐标传给该接口之后，该接口不能得到正确的地址，而且返回的坐标和输入的坐标有较大的差距，经试验，该返回的坐标是输入坐标经过`wgs84ToGcj02:`转换之后的坐标，所以，解决方案如下：
    将得到的坐标先经过`gcj02ToWgs84`转换成WGS-84坐标，传给接口，返回正确的地址，然后将地址坐标通过`wgs84ToGcj02`转换之后进行使用。

### 其它系统中用的坐标系
最近在抓取[hzbus.cn](http://www.hzbus.cn)网站中的一些数据时发现：该坐标不是我们前面提到的各种坐标。原来该网站使用的是[蒙特的GIS引擎](http://www.mountor.cn/rjcp_377.html)。通过试验各种接口，发现其坐标应该是连续**两次**将WGS-84坐标进行`wgs84ToGcj02`转换得到的，**两次**。所以将其坐标经过`gcj02ToWgs84`转换成真正的GCJ-02坐标在iOS的高德地图中使用。


### 参考

* 这一片文章的结论和我的结论一致，（除了GeoCoding外）：[iOS 火星坐标相关整理及解决方案汇总](http://blog.it985.com/7728.html)
* [火星坐标系统简介](http://blog.csdn.net/giswens/article/details/8775121)
* [google map 的地图偏移 火星坐标](http://blog.csdn.net/giswens/article/details/8775267)
*[地球坐标系 (WGS-84) 到火星坐标系 (GCJ-02) 的转换算法](http://blog.csdn.net/coolypf/article/details/8686588)
* [WGS84坐标转火星坐标（iOS篇）](http://blog.csdn.net/giswens/article/details/8775183)
* 各种坐标体系之间的转换，参考：[WGS84、Web墨卡托、火星坐标、百度坐标互转](http://blog.csdn.net/wildboy2001/article/details/12031351)
* [IOS LocationManager定位国内偏移，火星坐标(GCJ-02)解决方法](http://blog.csdn.net/swingpyzf/article/details/16972351)