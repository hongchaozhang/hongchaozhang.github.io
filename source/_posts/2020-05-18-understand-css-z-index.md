---
layout: post
title: "理解CSS中的z-index"
date: 2020-05-18 18:20:46 +0800
comments: true
categories: [html css]
---

CSS中的`z-index`和iOS中的非常不一样：iOS非常简单，所有的`z-index`设置只在parent视图（view）中起作用。但是，CSS的`z-index`的作用范围却可以超出parent的限制。

<!-- more -->

## Stacking Context
`z-index`只在其所属的Stacking Context中起作用。但是，什么是Stacking Context？Stacking Context hirarchy和Html Elements Tree hirarchy又有什么区别？

MDN上面的[The stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)讲的非常清楚，抄下来。

the rendering order of certain elements is influenced by their z-index value. This occurs because these elements have special properties which cause them to form a stacking context.

A stacking context is formed, anywhere in the document, by any element in the following scenarios:

1. Root element of the document (<html>).
2. **Element with a `position` value absolute or relative and `z-index` value other than auto.**
3. Element with a `position` value `fixed` or `sticky` (sticky for all mobile browsers, but not older desktop).
4. Element that is a child of a flex (`flexbox`) container, with `z-index` value other than auto.
5. Element that is a child of a grid (`grid`) container, with `z-index` value other than auto.
6. **Element with a `opacity` value less than 1.**
7. Element with a `mix-blend-mode` value other than `normal`.
8. Element with any of the following properties with value other than none:
    * **`transform`**
    * `filter`
    * `perspective`
    * `clip-path`
    * `mask` / `mask-image` / `mask-border`
9. Element with a `isolation` value `isolate`.
10. Element with a `-webkit-overflow-scrolling` value touch.
11. Element with a `will-change` value specifying any property that would create a stacking context on non-initial value (see this [post](https://dev.opera.com/articles/css-will-change-property/)).
12. Element with a `contain` value of `layout`, or `paint`, or a composite value that includes either of them (i.e. `contain: strict`, `contain: content`).


> **Note**: 
> 1. The hierarchy of stacking contexts is a subset of the hierarchy of HTML elements because only certain elements create stacking contexts.
> 2. iOS可以看成Stacking Context hirarchy和view hirarchy相同的一个特例。
## 同一Stacking Context中的元素的排序

在同一Stacking Context内部，前后顺序是怎么排列的呢？

简单地说，顺序大致如下：
```
                |      |         |    |
                |           |    |    |   ⇦ ☻
                |           |         |   user
z-index:  canvas  -1	  0    1    2
```

from back to front:

1. The stacking context’s root element
2. Positioned elements (and their children) with negative z-index values (higher values are stacked in front of lower values; elements with the same value are stacked according to appearance in the HTML)
3. Non-positioned elements (ordered by appearance in the HTML)
4. Positioned elements (and their children) with a z-index value of auto (ordered by appearance in the HTML)
5. Positioned elements (and their children) with positive z-index values (higher values are stacked in front of lower values; elements with the same value are stacked according to appearance in the HTML)

更全面详细的说明见[Appendix E. Elaborate description of Stacking Contexts](https://www.w3.org/TR/CSS2/zindex.html)。

> **Note:**
> 这里有一点和iOS很不同：子元素可以跑到父元素的后面 （`z-index`小于0）。

## 例子
我们可以借助下面的例子来理解Stacking Context。

下面三个正方形的前后顺序：

![](/images/CSS_zIndex.png)

其实现代码的html如下：

```
<div>
  <span class="red">Red</span>
</div>
<div>
  <span class="green">Green</span>
</div>
<div>
  <span class="blue">Blue</span>
</div>
```

CSS代码如下：

```
.red, .green, .blue {
  position: absolute;
  width: 100px;
  color: white;
  line-height: 100px;
  text-align: center;
}

.red {
  z-index: 1;
  top: 20px;
  left: 20px;
  background: red;
}

.green {
  top: 60px;
  left: 60px;
  background: green;
}

.blue {
  top: 100px;
  left: 100px;
  background: blue;
}
```

怎样才能让红色的正方形回到最底层呢？

只需要在CSS中加入下面一段即可：

```
div:first-child {
  opacity: .99;
}
```

将红色正方形的父元素变成Stacking Context，那么红色元素对应的span的`z-index`就只能在其父元素中起作用，而不能超出父元素了。

这个例子没有什么实际意义，但是对于我们理解`z-index`起作用的范围却十分清楚。

## 参考

1. [Appendix E. Elaborate description of Stacking Contexts](https://www.w3.org/TR/CSS2/zindex.html)
2. [The stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
