---
layout: post
title: "ARKit Usage"
date: 2017-12-28 17:25:27 +0800
comments: true
categories: [ios]
---


<!-- more -->

## ARKit的功能

参考官方文档[ARKit](https://developer.apple.com/documentation/arkit)。

### Requirement

* iOS 11 and above system.
* iOS device with an A9 or later processor.

To make your app available only on devices supporting ARKit, use the arkit key in the `UIRequiredDeviceCapabilities` section of your app's Info.plist. If augmented reality is a secondary feature of your app, use the `isSupported` property to determine whether the current device supports the session configuration you want to use.

### ARKit in iOS system

![arkit in ios system](/images/ARKitFramework.png)

### ARKit Usage

![arkit usage](/images/ARKitUsage.png)

### [`ARSession`](https://developer.apple.com/documentation/arkit/arsession)

An `ARSession` object coordinates the major processes that ARKit performs on your behalf to create an augmented reality experience. These processes include reading data from the device's motion sensing hardware, controlling the device's built-in camera, and performing image analysis on captured camera images. The session synthesizes all of these results to establish a correspondence between the real-world space the device inhabits and a virtual space where you model AR content.

Every AR experience built with ARKit requires a single `ARSession`object. If you use an `ARSCNView` or `ARSKView` object to easily build the visual part of your AR experience, the view object includes an `ARSession` instance. If you build your own renderer for AR content, you'll need to instantiate and maintain an ARSession object yourself.

Running a session requires a session configuration: an instance of the `ARConfiguration` class, or its subclass `ARWorldTrackingConfiguration`. These classes determine how ARKit tracks a device's position and motion relative to the real world, and thus affect the kinds of AR experiences you can create.

### [`ARConfiguration`](https://developer.apple.com/documentation/arkit/arconfiguration)

`ARConfiguration` is an abstract class; you do not create or work with instances of this class.

To run an AR session, create an instance of the concrete `ARConfiguration` subclass that provides the kind of augmented reality experience you want to use in your app or game. Then, set up the configuration object's properties and pass the configuration to your session's `run(_:options:)` method. ARKit includes the following concrete configuration classes:

* [`ARWorldTrackingConfiguration`](https://developer.apple.com/documentation/arkit/arworldtrackingconfiguration)
Provides high-quality AR experiences that use the rear-facing camera precisely track a device's position and orientation and allow plane detection and hit testing. Creating and maintaining this correspondence between spaces requires tracking the device's motion. The `ARWorldTrackingConfiguration` class tracks the device's movement with six degrees of freedom (6DOF): specifically, the three rotation axes (roll, pitch, and yaw), and three translation axes (movement in x, y, and z).

* [`AROrientationTrackingConfiguration`](https://developer.apple.com/documentation/arkit/arorientationtrackingconfiguration)
Provides basic AR experiences that use the rear-facing camera and track only a device's orientation. Creating and maintaining this correspondence between spaces requires tracking the device's motion. The `AROrientationTrackingConfiguration` class tracks the device's movement with three degrees of freedom (3DOF): specifically, the three rotation axes (roll, pitch, and yaw).

    `AROrientationTrackingConfiguration` cannot track movement of the device, and 3DOF tracking does not support plane detection or hit testing.

    Use 3DOF tracking only as a fallback in situations where 6DOF tracking is temporarily unavailable.


* [`ARFaceTrackingConfiguration`](https://developer.apple.com/documentation/arkit/arfacetrackingconfiguration)
Provides AR experiences that use the front-facing camera and track the movement and expressions of the user's face. Face tracking is available only on iOS devices with a front-facing TrueDepth camera.

### More on [`ARWorldTrackingConfiguration`](https://developer.apple.com/documentation/arkit/arworldtrackingconfiguration)

Refer to [About Augmented Reality and ARKit](https://developer.apple.com/documentation/arkit/about_augmented_reality_and_arkit) for an official explaination of the world tracking things.

World tracking process can be illustracted as:

![arkit world tracking](/images/ARKitTracking.gif)

#### Tracking Quality

To get better tracking quality:

1. Uninterrupted sensor data 
1. Textured environments 
1. Static scenes

If tracking quality changes, the tracking state will also change:

![arkit tracing state transition](/images/ARKitTrackingState.png)

And the tracking state changes will be notified by:

```swift

func session(_ session: ARSession, cameraDidChangeTrackingState camera: ARCamera) { 
    if case .limited(let reason) = camera.trackingState {
        // Notify user of limited tracking state
        ...
    } 
}

```

### Real-World Objects and Positions

* **`ARHitTestResult`**: Information about a real-world surface found by examining a point in the device camera view of an AR session.

* **`ARAnchor`**: A real-world position and orientation that can be used for placing objects in an AR scene.

* **`ARTrackable`**: A real-world object in a scene for which ARKit tracks changes to position and orientation.

### More on HitTest

By calling the following method on `ARSCNView`, 

```swift
open func hitTest(_ point: CGPoint, types: ARHitTestResult.ResultType) -> [ARHitTestResult]
```

we can get an array of `ARHitTestResult`. The `ARHitTestResult`s are sorted by distance. To call the method, you need to specify the `ARHitTestResult.ResultType`. There are four kinds of the types:

#### existingPlane

Return the result type from intersecting with an existing plane anchor.

![arkit hittest existing plane](/images/ARKitHitTestExistingPlane.gif)

#### existingPlaneUsingExtent

Return the result type from intersecting with an existing plane anchor, taking into account the plane’s extent.

#### estimatedHorizontalPlane

Return the result type from intersecting a horizontal plane estimate, determined for the current frame.

![arkit hittest estimated plane](/images/ARKitHitTestEstimatedPlane.gif)

#### featurePoint

Return the result type from intersecting the nearest feature point.

![](/images/ARKitHitTestFeaturePoints.gif)

### Display Virtual Object in Real World

Related classes:

1. **`ARFrame`**: A video image and position tracking information captured as part of an AR session. There are two ways to access `ARFrame` objects produced by an AR session, depending on whether your app favors a pull or a push design pattern.
    1. **Pull Pattern**: get `currentFrame` from `ARSession`.
    1. **Push Pattern**: implement the `session(_:didUpdate:)` delegate method, and the session will call it once for each video frame it captures (at 60 frames per second by default).

1. **`ARCamera`**: Information about the camera position and imaging characteristics for a captured video frame in an AR session. Get `camera` from `ARFrame`.

1. **`ARLightEstimate`**: Estimated scene lighting information associated with a captured video frame in an AR session. Get `lightEstimate` from `ARFrame`.

    Refer to [ARKit by Example — Part 4: Realism - Lighting & PBR](https://blog.markdaws.net/arkit-by-example-part-4-realism-lighting-pbr-b9a0bedb013e) for mimicing the environment light.

#### Standard View

* **`ARSCNView`**: A view for displaying AR experiences that augment the camera view with 3D SceneKit content.
* **`ARSKView`**: A view for displaying AR experiences that augment the camera view with 2D SpriteKit content.

#### Custom View (Refer to [Displaying an AR Experience with Metal](https://developer.apple.com/documentation/arkit/displaying_an_ar_experience_with_metal))

To display your AR experience in a custom view, you’ll need to:

1. Retrieve video frames and tracking information from the session.
2. Render those frame images as the backdrop for your view.
3. Use the tracking information to position and draw AR content atop the camera image.

### Camera and Scene Details

### Face-Based AR Experiences

**Creating Face-Based AR Experiences**
Place and animate 3D content that follows the user’s face and matches facial expressions, using the TrueDepth camera on iPhone X. Reer to [Creating Face-Based AR Experiences](https://developer.apple.com/documentation/arkit/creating_face_based_ar_experiences) for an official example.

* **`ARFaceTrackingConfiguration`**: A configuration that tracks the movement and expressions of the user’s face using the TrueDepth camera.
* **ARFaceAnchor**: Information about the pose, topology, and expression of a face detected in a face-tracking AR session.

## ARKit的使用

### Best Practices and Limitations (Refer to [About Augmented Reality and ARKit](https://developer.apple.com/documentation/arkit/about_augmented_reality_and_arkit))

World tracking is an inexact science. This process can often produce impressive accuracy, leading to realistic AR experiences. However, it relies on details of the device’s physical environment that are not always consistent or are difficult to measure in real time without some degree of error. To build high-quality AR experiences, be aware of these caveats and tips.

**Design AR experiences for predictable lighting conditions.**

 World tracking involves image analysis, which requires a clear image. Tracking quality is reduced when the camera can’t see details, such as when the camera is pointed at a blank wall or the scene is too dark.

**Use tracking quality information to provide user feedback.**

 World tracking correlates image analysis with device motion. ARKit develops a better understanding of the scene if the device is moving, even if the device moves only subtly. Excessive motion—too far, too fast, or shaking too vigorously—results in a blurred image or too much distance for tracking features between video frames, reducing tracking quality. The ARCamera class provides tracking state reason information, which you can use to develop UI that tells a user how to resolve low-quality tracking situations.

**Allow time for plane detection to produce clear results, and disable plane detection when you have the results you need.**

 Plane detection results vary over time—when a plane is first detected, its position and extent may be inaccurate. As the plane remains in the scene over time, ARKit refines its estimate of position and extent. When a large flat surface is in the scene, ARKit may continue changing the plane anchor’s position, extent, and transform after you’ve already used the plane to place content.

## ARKit的不足

1. 对动态场景的位置估计不准确。相机不动，有新物体进入视野的时候，对新物体的空间位置估计偏差比较大。
1. 当镜头轴线方向上有两个真是物体时，没有办法将虚拟物体放到这两个真是物体之间。两种方法可能有助于这个问题的解决：
    1. 基于已经检测出来的特征点的空间位置进行图像分割，先画远的真实物体，再画虚拟物体，再画近的真实物体。因为特征点检测比较稀疏（性能考虑），所以在进行图像分割的时候难免误差较大，需要结合一些边缘检测的算法。
    1. 基于双摄像头得到图像上每个像素的景深，进行图像分割，再根据距离安排真实物体和虚拟物体。

    以上两个方案不知道ARKit以后会不会更新，自己实现工作量大。





