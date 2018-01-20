---
layout: post
title: "DR Project"
date: 2018-01-02 13:39:28 +0800
comments: true
published: true
categories: [ios]
---

Key words: ARKit, CoreML, SceneKit

<!-- more -->

DR (Data to Reality) is a demo for projecting data into reality: Using **CoreML** for object recognition, and then get the recognized object data and project the data to reality, just above the recognized object. In this process, **ARKit** helps us to get the real world object coordinate to put the data at, and **SceneKit** helps us to render the data in reality. 

This is a screenshot in demo:

![project chart to reality](/images/DR-Screenshot-1.jpg)

Refer to github [Project Data to Reality](https://github.com/hongchaozhang/ProjectDataToReality) for demo project. In the github page, the following are told:

1. Requirement
1. How to Run the Project
1. How to Use the Demo
    1. Project Chart to Reality
    1. Face Detection
    1. Face Recognition

## Related techniques used

1. [ARKit](../../../../2017/12/28/arkit-usage/)
2. [CoreML](../../../../2017/12/28/coreml-usage/)
3. [SceneKit](../../../../2018/01/02/scenekit-usage/)

## Notes on the Demo

As this is a rough demo, it need some enhancements:

1. Only four kinds of fruits are supported: banana, orange, cucumber and strawberry. But for anything recognized by Inceptionv3.mlmodel, we can add a sphere and the name just at the world position of the object. (Set `showRecognizedResultNearby` to `true`.)
1. The chart data of the four kinds of fruits are images exported from other apps.
1. For face detection on iphone, rotate the device to left by 90 degrees to make it work on landscape. This is an issue need to be fixed.
1. Face recognition needs a trained face recognition model, called FaceRecognition.mlmodel.
1. Face recognition request doesn't crop the image from camera according to the face detection result. This should be done to make face recognition more robust.

