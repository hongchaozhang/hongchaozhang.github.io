---
layout: post
title: "https在ios客户端的objective-c实现"
date: 2015-12-30 21:23:54 +0800
comments: true
categories: [objective-c]
---

ios通过NSURLSession进行网络请求，参考另一篇博客[ios进行网络请求](http://hongchaozhang.github.io/blog/2015/11/29/ios-network-request/)。

在开发阶段，server端我们会用self-signed证书（省钱啊！）。正因为不是第三方机构认证的证书，所以客户端都会报警告。我们需要对此进行处理（参考[NSURLSession in Apple Tech Note](https://developer.apple.com/library/ios/technotes/tn2232/_index.html#//apple_ref/doc/uid/DTS40012884-CH1-SECNSURLSESSION)和[How do I accept a self-signed SSL certificate using iOS 7's NSURLSession and its family of delegate methods for development purposes?](http://stackoverflow.com/questions/19507207/how-do-i-accept-a-self-signed-ssl-certificate-using-ios-7s-nsurlsession-and-its)）:

<!-- more -->

> NSURLSession allows you to customize HTTPS server trust evaluation by implementing the `-URLSession:didReceiveChallenge:completionHandler:` delegate method. To customize HTTPS server trust evaluation, look for a challenge whose protection space has an authentication method of `NSURLAuthenticationMethodServerTrust`. For those challenges, resolve them as described below. For other challenges, the ones that you don't care about, call the completion handler block with the `NSURLSessionAuthChallengePerformDefaultHandling` disposition and a NULL credential.

> When dealing with the `NSURLAuthenticationMethodServerTrust` authentication challenge, you can get the trust object from the challenge's protection space by calling the `-serverTrust` method. After using the trust object to do your own custom HTTPS server trust evaluation, you must resolve the challenge in one of two ways:

> * If you want to deny the connection, call the completion handler block with the `NSURLSessionAuthChallengeCancelAuthenticationChallenge` disposition and a NULL credential.
* If you want to allow the connection, create a credential from your trust object (using `+[NSURLCredential credentialForTrust:]`) and call the completion handler block with that credential and the `NSURLSessionAuthChallengeUseCredential` disposition.

说了这么多，代码在下面的delegate中实现：

```objc
- (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential *))completionHandler {
    if([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
        if([challenge.protectionSpace.host isEqualToString:@"domaintoverride.com"]) {
            NSURLCredential *credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
            completionHandler(NSURLSessionAuthChallengeUseCredential,credential);
        } else {
            completionHandler(NSURLSessionAuthChallengeCancelAuthenticationChallenge, nil);
        }
    }
}
```



