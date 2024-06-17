---
layout: post
title: "CSS resolution rules and specificity"
date: 2024-06-17 11:53:39 +0800
comments: true
categories: [web]
---

<!-- more -->

## Description

The css property doesn't take effect in the release build but works fine in the debug build.

## Root cause

We applied two css classes in one dom node and didn’t specify the priority (have the same css specificity (0,1,0)), thus the CSS class order matters: the latter one will override the previous one.

However, the css class order is not stable between the debug and release builds.

## Solution

After fixing, the classes are like this:

![css-specificity-1](/images/css-specificity-1.png)

We can use the scss file helper tools in VS Code:

![css-specificity-2](/images/css-specificity-2.png)

Caution while nesting & :

![css-specificity-3](/images/css-specificity-3.png)

## [Cascade](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)

When two rules from the same cascade layer apply and both have equal specificity, the one that is defined last in the stylesheet is the one that will be used.

There are three factors to consider, listed here in increasing order of importance. Later ones overrule earlier ones:

### Source order

### [Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

* one identifier selector has 1-0-0 specificity
* one class selector (attribute selector) has 0-1-0 specificity
* one element selector has 0-0-1 specificity
* The specificity weight of :not/:is/:has comes from the selector parameter in the list of selectors with the highest specificity.
* Combinators, such as +, >, ~, " ", and ||, may make a selector more specific in what is selected but they don't add any value to the specificity weight.

![css-specificity-4](/images/css-specificity-4.png)

### Importance

* inline style
* `!important`: DO NOT use `!important`. It makes the CSS hard to maintain and debug.
  * See a demo for `!important` [here](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#!important).


## Other info
The VS Code should have issues with “specificity” calculation.

![css-specificity-5](/images/css-specificity-5.png)

The specificity should be 0-2-0.

More examples can be seen from here: [Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity#three-column_comparison )

![css-specificity-6](/images/css-specificity-6.png)

Some online css specificity calculator can be used for testing:

[Specificity Calculator](https://specificity.keegan.st/)

## How to avoid such issues?

* Make sure all the loaded CSSs have different css specificity.
* Review the CSS in the developer tool.
* For a specific css property, filter out all CSSs which contains it.
* Make sure the CSS you want to apply have the highest css specificity.
