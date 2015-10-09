---
layout: post
comments: true
categories: [ios,productivity]
title: How to deploy MicroStrategy iOS Mobile environment
---

## Start Developing in a New Mac Machine

[**updated on 2015.9.17**] With Xcode 7, we only need an Apple ID for deploying your app to ipad or iphone, with the ability to debug.

<!-- more -->

1. Regist you apple id to MSTR group. Contact your manager for some info.
2. Go to [Apple Develop Center](https://developer.apple.com/membercenter/index.action).
3. Go to *[Certificates](https://developer.apple.com/account/ios/certificate/certificateList.action)*, find your certificate, click it, and download the certificate. If there is no certificate for you, go to [here](https://developer.apple.com/account/ios/certificate/certificateLanding.action) for generating it by yourself.
4. Run the certificate you just downloaded, and add it to keychain. （To get the certificate, go to here）
5. Go to *Provisioning Profiles*, download the *Development* and *Distribution* profile (for example: *MicroStretegy_Mobile.mobileprovision*), double click to insert it into xcode. You can also go to *Xcode-->Preferences-->Accounts*, select *MicroStrategy Incorporated* and refresh the provisioning profiles.
6. Go to *Project* --> *Build Settings* --> *Code Signing*, you will find the provisions you get through step 5.
7. To install the app in your device, make sure your device is registed already. Check it in the *Devices* in [Apple Develop Center](https://developer.apple.com/membercenter/index.action).

## Get the Code

Currently, MicroStrategy Mobile code is in [**github**](http://github-mstr.labs.microstrategy.com/). To deploy the environment, you should:

1.  git clone *https://github.microstrategy.com/MSTRMobile/Mobile.git* *<del>http://github-mstr.labs.microstrategy.com/MSTRMobile/Mobile.git<del>*
2.  Copy **"Engine"** folder from somewhere else to **"Mobile"** folder you just cloned. **"Engine"** folder can be found in previous clearcase branch.
3.  Open the xcode project here: *Mobile-->Mobile_Client-->iOS-->MicroStrategyMobile-->MicroStrategyMobile.xcodeproj*