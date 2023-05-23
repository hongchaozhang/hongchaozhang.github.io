---
layout: post
comments: true
categories: [javascript]
title: Caution Javascript Closure in Loop
---

###Object
Define a function <span style="background-color:yellow;">_addTimer_</span>, to log executed time for all function-type property of an object

###Definition 1

<!-- more -->

####Code:
```javascript
var addTimer = function (widget) {
    var prop;
    for (prop in widget) {
        if (typeof widget[prop] === 'function') {
            var backupFunc = widget[prop];
            // the same problem with the following code
            //backupFunc = (function () {
            //    return widget[prop];
            //})();
            
            // try a deep copy here to make bakcupFunc not changed with prop
            widget[prop] = function () {
                console.time("from timer " + prop);
                backupFunc.apply(this, arguments);
                console.timeEnd("from timer " + prop);
            };
            // the same problem with the following code
            //widget[prop] = (function () {
            //    return function () {
            //        console.time(prop);
            //        backupFunc.apply(this, arguments);
            //        console.timeEnd(prop);
            //    };
            //})();
        }
    }
}
```
####Problem
All function type property in widget will call the last function type property

###Definition 2
Since there is no block scope in JavaScript - only **function scope** - by wrapping the function creation in a new function, you ensure that the value of `prop` remains as you intended.

####Code:
```javascript
var addTimer = function (widget) {
    var prop;
    var getFuncWithTimer = function (prop) {
        return function () {
            console.time("from timer " + prop);
            widget[prop].apply(this, arguments);
            console.timeEnd("from timer " + prop);
        };
    };
    for (prop in widget) {
        if (typeof widget[prop] === 'function') {
            widget[prop] = getFuncWithTimer(prop);
        }
    }
};
```
####Problem
exceed maximum call stack

###Definition 3

####Code:
```javascript
var addTimer = function (widget) {
    var prop;
    var getFuncWithTimer = function (prop) {
        var backupFunc = widget[prop];
        return function () {
            console.time("from timer " + prop);
            backupFunc.apply(this, arguments);
            console.timeEnd("from timer " + prop);
        };
    };
    for (prop in widget) {
        if (typeof widget[prop] === 'function') {
            widget[prop] = getFuncWithTimer(prop);
        }
    }
};
```
####Problem
All function with returned value can not work

###Final Definition

####Code:
```javascript
var addTimer = function (widget) {
    var prop;
    var getFuncWithTimer = function (prop) {
        var backupFunc = widget[prop];
        return function () {
            console.time("from timer " + prop);
            var ret = backupFunc.apply(this, arguments);
            console.timeEnd("from timer " + prop);
            return ret;
        };
    };
    for (prop in widget) {
        if (typeof widget[prop] === 'function') {
            widget[prop] = getFuncWithTimer(prop);
        }
    }
};
```