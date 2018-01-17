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

To define the size of the image:

```
![image annotation](/images/001_ios_frameworks.png =200x300)
```

Or you can omit the `height` of the image:

```
![image annotation](/images/001_ios_frameworks.png =200x)
```

If the aspect ratio you define is not consistent with the original image, the height will be omitted automatically. That is to say, just define the `width` you want, and the system will calculate the `height` for it.

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
