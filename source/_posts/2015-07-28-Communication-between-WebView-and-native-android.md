---
layout: post
comments: true
categories: [android,java]
title: Communication between WebView and native android
---

## Description

In Android project, we sometimes want to rend a page in **WebView**, and need communication between webview and native android side.

**Note:** Go to [here](https://github.com/hongchaozhang/android_java_javascript_communication) for a project as a sample.

## Javascript and Java Bridge

<!-- more -->

1. Code for javascript interface in native android side:

	    public class JavaScriptInterface {
	        protected MyActivity parentActivity;
	        protected WebView mWebView;
	        
	        public JavaScriptInterface(MyActivity _activity, WebView _webView)  {
	            parentActivity = _activity;
	            mWebView = _webView;
	            
	        }
	        
	        @JavascriptInterface
	        public void setResult(int val){
	            Log.v("mylog","JavaScriptHandler.setResult is called : " + val);
	            this.parentActivity.javascriptCallFinished(val);
	        }
	        
	        @JavascriptInterface
	        public void calcSomething(int x, int y){
	            this.parentActivity.changeText("Result is : " + (x * y));
	        }
	        
	        @JavascriptInterface
	        public String modifyString(String inputString) {
	            return inputString + " from Java side";
	        }
	    }
    
	Here, we can introduce the main activity `parentActivity` and the webview `mWebView` into the interface for further use.

2. Get webview from layout xml file, or create it from scrach, and config it:

	    myWebView = (WebView)this.findViewById(R.id.myWebView);
	    myWebView.getSettings().setJavaScriptEnabled(true);
	    myWebView.loadUrl("file:///android_asset/index.html");

	    myWebView.addJavascriptInterface(new JavaScriptInterface(this, myWebView), "MyHandler");
	    if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
		    WebView.setWebContentsDebuggingEnabled(true);
		}
	
	1) Pay attention to `addJavascriptinterface`, which add the javascript interface, and gives the interface a name `MyHandler`.
2) To be able to debug web page inside webview, `setWebContentsDebuggingEnabled(true)` should be called for android version after `KITKAT(4.4)`.

3. Then we can use the following way to call javascript function and change html page from java side:

    	myWebView.loadUrl("javascript:document.getElementById('test1').innerHTML = 'changed'");
    
	And use the following to call java method from javascript side:

    	window.MyHandler.setResult(9999)

## Passing parameters and `return` value


#### parameter of `WebView.loadUrl`

We can only use *String* as the parameter of `WebView.loadUrl()` function (Note `val1` and `val2`):

	myWebView.loadUrl("javascript:window.MyHandler.setResult( addSomething("+val1+","+val2+") )");
    
#### parameter of the interface for javascript

We can use *String* or *int* for these interfaces, like:

	window.MyHandler.setResult(10);
	var stringFromJava = window.MyHandler.modifyString("string from javascript");


#### Java return value to Javascript: **sync**

Java can directly return String back to Javascritp, so we can use the following way to get the string from Java:

    var stringFromJava = window.MyHandler.modifyString("string from javascript");

#### <a name="javascript_return_value_to_java"></a>Javascript return value to Java: **async**

As `WebView.loadUrl` does not return anything, so Java can not get results from Javascript. We need other ways to get the result.

Currently, we have no way to do this. The work around is: when javascript get the result, call a method in java side through the interface `MyHandler`, and pass the result as a parameter. As java call `WebView.loadurl` in a differenct thread, so even in this way, we can not get the result right away for use in the next line.

## Multi-thread in Java side and Single-thread in Javascript side

### Javascript call Java: sync

When we run the following function, we can get the string returned from java side, and then set it into the html page.

    function testSync() {
    	var string = "default string";
    	string = window.MyHandler.testString();
    	document.getElementById('test1').innerHTML = string;
    }

### Java call Javascript: async

Similar to [Javascript return value to Java](#javascript_return_value_to_java).

## Security problems

Reference to [Java和Javascript安全交互](http://jiajixin.cn/2014/09/16/webview-js-safety/).

An example listed:

* 成名已久的任意命令执行漏洞，通过addJavascriptInterface方法，Js可以调用Java对象方法，通过反射机制，Js可以直接获取Runtime，从而执行任意命令。Android 4.2以上，可以通过声明@JavascriptInterface保证安全性，4.2以下不能再调用addJavascriptInterface，需要另谋他法。
