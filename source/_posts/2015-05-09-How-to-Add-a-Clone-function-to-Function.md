---
layout: post
comments: true
categories: [javascript]
title: How to Add a Clone function to Function?
---
    
{% highlight javascript linenos %}
Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for( key in this ) {
        temp[key] = this[key];
    }
    return temp;
};
{% endhighlight %}