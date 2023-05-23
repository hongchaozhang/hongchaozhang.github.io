---
layout: post
title: "ios进行网络请求"
date: 2015-11-29 15:12:59 +0800
comments: true
categories: [ios, objective-c]
---

ios网络请求设计的一些类，可以参考；[IOS网络编程：HTTP](http://blog.csdn.net/dyllove98/article/details/9050863)。

下面主要说说NSURLSession。

<!-- more -->

### NSURLSession

参考官方文档：[Life Cycle of a URL Session](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/URLLoadingSystem/NSURLSessionConcepts/NSURLSessionConcepts.html#//apple_ref/doc/uid/10000165i-CH2-SW1)。根据官方文档的Sample code如下：

* Life Cycle of a URL Session with System-Provided Delegates

```

- (void)startWithURLString:(NSString *)urlString {
    /**
     *  using stringByAddingPercentEscapesUsingEncoding to support Chinese characters in url string
     */
    NSURL *url = [NSURL URLWithString:[urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    
    NSURLSessionConfiguration* configuration = [NSURLSessionConfiguration ephemeralSessionConfiguration];
    NSURLSession* session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask* dataTask = [session dataTaskWithRequest:request
                                                completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                                                    if (!error) {
                                                        if ([request.URL isEqual:url]) {
                                                            /**
                                                             *  currently we are not in the main thread
                                                             *  call method in main thread to update the UI
                                                             */
                                                            dispatch_async(dispatch_get_main_queue(), ^{

                                                            });
                                                        }
                                                    }
                                                }];
    [dataTask resume];

}

```
<!-- more -->

* Life Cycle of a URL Session with Custom Delegates

```

- (void)startWithURLString:(NSString *)urlString {
    /**
     *  using stringByAddingPercentEscapesUsingEncoding to support Chinese characters in url string
     */
    NSURL *url = [NSURL URLWithString:[urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    
    NSURLSessionConfiguration* configuration = [NSURLSessionConfiguration ephemeralSessionConfiguration];
    
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:[NSOperationQueue mainQueue]];
    
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request];
    
    self.responseData = [[NSMutableData alloc] init];
    
    [dataTask resume];
}

```

以及NSURLSessionDataDelegate中的：

```

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveData:(NSData *)data {
    // self.responseData is NSMutableData type
    [self.responseData appendData:data];
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
    if (!error) {

    } else {

    }
}

```

> NSURLSessionDataTask不能携带completionHandler，否则上面的delegate不会调到。

### App Transport Security

如果遇到如下错误信息：

```
App Transport Security has blocked a cleartext HTTP (http://) resource load since it is insecure. 
Temporary exceptions can be configured via your app's Info.plist file.
```

打开Info.plist，加入如下字段：

```
<key>NSAppTransportSecurity</key>
    <dict>
        <!--Include to allow all connections (DANGER)-->
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
```