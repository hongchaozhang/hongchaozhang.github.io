---
layout: post
title: "some tips on markdown usage"
date: 2017-11-21 10:13:28 +0800
comments: true
categories: [productivity]
---

Collect some markdown usage tips.

<!-- more -->


## insert an image

To insert the image, just use the path under the base url, for me, it is */GitBlogs/images/<image_name>.png*, for example

```
![image annotation](/images/001_ios_frameworks.png)
```
## show content while click

Using the following block of code for hiding some content and show the content while click.

```html
<details> 
  <summary>Q1: What is the best Language in the World? </summary>
   A1: Swift 
</details>
```

You will get:

<details> 
  <summary>_Question: What is the best Language in the World?_</summary>
   Answer: Swift 
</details>
