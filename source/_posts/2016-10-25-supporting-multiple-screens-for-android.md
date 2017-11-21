---
layout: post
title: "Android开发中使用的度量单位px、dp、sp、pt、in、mm"
date: 2016-10-25 17:10:08 +0800
comments: true
categories: [android]
---

关于多屏的支持，最好的文章当然是官方文档：[Supporting Multiple Screens](https://developer.android.com/guide/practices/screens_support.html#testing)。一篇文章，从概念到解决方案，非常全面。

下面主要讨论一下开发过程中使用的度量单位的问题。

<!-- more -->

## 单位的意义及其之间的转换

对于不同的度量单位（`px`、`dp`、`sp`、`pt`、`in`、`mm`），可以从下面一张图看出它们之间的关系：

![android_font_size_tesst](/images/android_font_size_tesst.png)

左上->右上->左下->右下，依次为ldpi->mdpi->hdpi->xhdpi（其大小不代表绝对大小，只用关注它们之间的相对大小即可）。结论如下：

### `px`
`px`是唯一一个显示大小与dpi有关系的单位，其它单位的显示大小都与dpi无关。

### `dp`
`dp`也叫`dip`，即*density-independent-pixel*，在dpi等于160的时候，其大小与px相等。因此，我们可以算出1dp等于`densityDpi / DENSITY_DEFAULT(160)） px`，也就是`density px`。具体关系参考下面介绍`DisplayMetrics`中属性的表格。

### `sp`
除了具有`dp`的特征之外，`sp`还可以响应用户的font size preference设置其值像dp一样，也只能取一些离散的值。font size preference的设置界面如下：

![android_font_preference_setting](/images/android_font_preference_setting.png)

### `pt`、`in`、`mm`
这几个单位都是长度单位，其中pt等于1/72inch，都是用户最终看到的大小。这些值都是根据设备真实物理像素密度（`xdpi`和`ydpi`）算出来的，不会像`dp`和`sp`一样，只有几个离散的值。

在TypedValue.java中有所有单位到`px`的转换方法：

```java
/**
 * Converts an unpacked complex data value holding a dimension to its final floating 
 * point value. The two parameters <var>unit</var> and <var>value</var>
 * are as in {@link #TYPE_DIMENSION}.
 *  
 * @param unit The unit to convert from.
 * @param value The value to apply the unit to.
 * @param metrics Current display metrics to use in the conversion -- 
 *                supplies display density and scaling information.
 * 
 * @return The complex floating point value multiplied by the appropriate 
 * metrics depending on its unit. 
 */
public static float applyDimension(int unit, float value,
                                   DisplayMetrics metrics)
{
    switch (unit) {
    case COMPLEX_UNIT_PX:
        return value;
    case COMPLEX_UNIT_DIP:
        return value * metrics.density;
    case COMPLEX_UNIT_SP:
        return value * metrics.scaledDensity;
    case COMPLEX_UNIT_PT:
        return value * metrics.xdpi * (1.0f/72);
    case COMPLEX_UNIT_IN:
        return value * metrics.xdpi;
    case COMPLEX_UNIT_MM:
        return value * metrics.xdpi * (1.0f/25.4f);
    }
    return 0;
}
```

该函数将所有的单位转换为px，其中参数意义如下：

属性 | 意义
--- | ---
`metrics.density` | 默认值为`densityDpi / (float) DENSITY_DEFAULT`。该值为归整之后的值：比如150dpi的设备，`density`值为1，即按照160dpi进行处理。`density`的典型值为0.75、1.0、1.5、2.0、3.0等。
`metrics.densityDpi` | 设备物理像素密度，非精确的归整值，可取值为`DENSITY_LOW(120)`、`DENSITY_MEDIUM(160)`、`DENSITY_HIGH(240)`等。`density`的值是根据`densityDpi / DENSITY_DEFAULT`计算出来的，所以取值也是一些典型的离散值。
`metrics.scaledDensity` | 具有`density`所有的特征，如果用户设置了font size preference，还需要乘以一个scale系数。
`metrics.xdpi` | `x`方向的物理像素密度，精确的值，单位px/inch。同样的有`ydpi`。
`DENSITY_DEFAULT` | dpi的参考值，值为160px/inch。

### `dp`转换为`px`

有时候我们必须使用`px`作为单位，比如某个api接受的参数只能是`px`。这个时候，需要将`dp`转化为`px`。在code中我们可以使用下面的方法将`dp`转化为`px`：

```java
// The gesture threshold expressed in dp
private static final float GESTURE_THRESHOLD_DP = 16.0f;

// Get the screen's density scale
final float scale = getResources().getDisplayMetrics().density;
// Convert the dps to pixels, based on density scale
mGestureThreshold = (int) (GESTURE_THRESHOLD_DP * scale + 0.5f);

// Use mGestureThreshold as a distance in pixels...
```

## Best Practice

1. Use `wrap_content`, `match_parent`, or `dp` units when specifying dimensions in an XML layout file
2. Do not use hard coded pixel values in your application code
3. Do not use `AbsoluteLayout` (it's deprecated). Use `RelativeLayout` instead.
4. Supply alternative bitmap drawables for different screen densities


另外一篇关于网页上字体大小单位的讨论：[Font Size in Html - Px, Em, Rem](http://hongchaozhang.github.io/blog/2015/08/03/Font-size-in-Html/)。