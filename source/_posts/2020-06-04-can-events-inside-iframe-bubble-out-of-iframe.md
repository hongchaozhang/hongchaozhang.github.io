---
layout: post
title: "iframe之外能否知道iframe里面产生的事件？"
date: 2020-06-04 11:55:31 +0800
comments: true
categories: [web, html]
---

<!-- more -->

<!-- TOC -->

- [问题](#问题)
    - [资料一](#资料一)
    - [资料二](#资料二)
    - [资料三](#资料三)

<!-- /TOC -->

<a id="markdown-问题" name="问题"></a>

## 问题
iframe里面产生的click事件，外面有没有办法知道？

<a id="markdown-资料一" name="资料一"></a>

### 资料一
根据[Detect Click into Iframe using JavaScript](https://stackoverflow.com/questions/2381336/detect-click-into-iframe-using-javascript/32138108)，

1. 我们只能监测到发生在iframe上的'mouseover'、'mouseout'等事件，至于鼠标进入iframe之后发生的事情，我们是没有办法获取的。
2. 对于试图在iframe上面盖一层透明的dom来截获鼠标事件的想法也是不可取的，因为一旦事件被截获，便没有办法再次dispatch到iframe内部去。
3. 以上结论基于不同源的两个网页。

<a id="markdown-资料二" name="资料二"></a>

### 资料二
[Event bubbling not happen in IFrame](https://stackoverflow.com/questions/40109631/event-bubbling-not-happen-in-iframe)解释来为什么iframe里面的事件不能bubble出iframe。

> Bubbling is specced to happen only through a single **document tree**. The iframe is a separate document tree, and so events that bubble through its tree terminate at the root of the iframe's document and do not travel across the boundary into the host document.

<a id="markdown-资料三" name="资料三"></a>

### 资料三
如果满足同源策略，那么可以通过下面的方法将iframe内部的事件传到外部(参考[Detect mousemove when over an iframe?](https://stackoverflow.com/questions/5645485/detect-mousemove-when-over-an-iframe/11865037#11865037))：

```
// This example assumes execution from the parent of the the iframe

function bubbleIframeMouseMove(iframe){
    // Save any previous onmousemove handler
    var existingOnMouseMove = iframe.contentWindow.onmousemove;

    // Attach a new onmousemove listener
    iframe.contentWindow.onmousemove = function(e){
        // Fire any existing onmousemove listener 
        if(existingOnMouseMove) existingOnMouseMove(e);

        // Create a new event for the this window
        var evt = document.createEvent("MouseEvents");

        // We'll need this to offset the mouse move appropriately
        var boundingClientRect = iframe.getBoundingClientRect();

        // Initialize the event, copying exiting event values
        // for the most part
        evt.initMouseEvent( 
            "mousemove", 
            true, // bubbles
            false, // not cancelable 
            window,
            e.detail,
            e.screenX,
            e.screenY, 
            e.clientX + boundingClientRect.left, 
            e.clientY + boundingClientRect.top, 
            e.ctrlKey, 
            e.altKey,
            e.shiftKey, 
            e.metaKey,
            e.button, 
            null // no related element
        );

        // Dispatch the mousemove event on the iframe element
        iframe.dispatchEvent(evt);
    };
}

// Get the iframe element we want to track mouse movements on
var myIframe = document.getElementById("myIframe");

// Run it through the function to setup bubbling
bubbleIframeMouseMove(myIframe);
```

You can now listen for mousemove on the iframe element or any of its parent elements. As the event will bubble up as you would expect.
