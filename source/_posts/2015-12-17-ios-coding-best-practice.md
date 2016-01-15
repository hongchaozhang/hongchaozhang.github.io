---
layout: post
title: "ios coding best practice"
date: 2015-12-17 10:49:54 +0800
comments: true
categories: [objective-c]
---

<!-- more -->

* Use forward declarations
* Move variable declaration out of header
* Cleanup duplication in import
* Remove private method declaration in implementation files
* Move protocol definition to separate header to aviod unnecessary cross reference
* Freqently monitor warnings and static analyzer warnings in your component. Usually it is a good idea to fix it.
* Removing unused resources
* Delegate objects should not be retained when doing so would create a retain cycle.
* import Objective-C/Objective-C++ headers, and #include C/C++ headers.
* Don't @throw Objective-C exceptions, but you should be prepared to catch them from third-party or OS calls.
* Use nil checks for logic flow only.
* Don't initialize variables to 0 or nil in the init method; it's redundant.
* Instance Variables In Headers Should Be @private
    * Instance variables should typically be declared in implementation files or auto-synthesized by properties. When ivars are declared in a header file, they should be marked @private.
* One space should be used between the - or + and the return type, and no spacing in the parameter list except between parameters.
