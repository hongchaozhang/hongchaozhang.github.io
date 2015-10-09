---
layout: post
comments: true
categories: [web]
title: Font Size in Html - px, em, rem
---

Refer [here](http://snook.ca/archives/html_and_css/font-size-with-rem)

Three units of measurements to size the text in html files to discuss:

1. px
2. em
3. rem

<!-- more -->

## Sizing with `px`

`px` has some problems with IE of versions earlier then IE9 when changing text size with browser function.

## Sizing with `em`

To solve the issue in IE, we can use `em` instead. See [here](http://clagnut.com/blog/348/) for more details. The `em` way modifies the base font size on the `body` using a percentage.

However, there is a **font size compounds** problem for this em-based sizing. That is, if you set `li { font-size:1.4em }`, the `li` element inside another `li` element will become bigger. Guess[**TODO**]: the base font size is not on the body, it is on the `li` element outside.

## Sizing with `rem`

The em unit is relative to the font-size of the parent, which causes the compounding issue. The rem unit is relative to the root—or the html—element. That means that we can define a single font size on the html element and define all rem units to be a percentage of that. (Comming from the [reference](http://snook.ca/archives/html_and_css/font-size-with-rem))

