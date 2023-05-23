---
layout: post
title: "ARKit Usage"
date: 2017-12-28 17:25:27 +0800
comments: true
categories: [ios, machine learning, augmented reality]
---


<!-- more -->

<!-- TOC -->autoauto- [Cool AR Apps in App Store](#cool-ar-apps-in-app-store)auto    - [World Brush](#world-brush)auto    - [IKEA Place](#ikea-place)auto    - [AR MeasureKit](#ar-measurekit)auto- [Requirement](#requirement)auto- [ARKit Usage](#arkit-usage)auto    - [ARKit Related Techniques](#arkit-related-techniques)auto    - [ARKit in iOS System](#arkit-in-ios-system)auto    - [ARKit Key Classes](#arkit-key-classes)auto    - [`ARSession`](#arsession)auto    - [`ARConfiguration`](#arconfiguration)auto    - [More on `ARWorldTrackingConfiguration`](#more-on-arworldtrackingconfiguration)auto        - [Tracking Quality](#tracking-quality)auto    - [`ARFrame`](#arframe)auto    - [HitTest for Real World Position](#hittest-for-real-world-position)auto        - [`existingPlane`](#existingplane)auto        - [`existingPlaneUsingExtent`](#existingplaneusingextent)auto        - [`estimatedHorizontalPlane`](#estimatedhorizontalplane)auto        - [`featurePoint`](#featurepoint)auto    - [Display Virtual Object in Real World](#display-virtual-object-in-real-world)auto        - [Standard View](#standard-view)auto        - [Custom View](#custom-view)auto- [Best Practices and Limitations](#best-practices-and-limitations)auto    - [Best Practices](#best-practices)auto    - [Limitations](#limitations)auto- [AR from Google](#ar-from-google)autoauto<!-- /TOC -->

<a id="markdown-cool-ar-apps-in-app-store" name="cool-ar-apps-in-app-store"></a>
## Cool AR Apps in App Store

<a id="markdown-world-brush" name="world-brush"></a>
### World Brush

[World Brush](https://itunes.apple.com/us/app/world-brush/id1277410449?mt=8) is an AR experience where users can paint with brushes on the world around them. Every painting is saved at the approximate GPS location where it was created, and will be recommended to the user around.

![world brush](/images/ARKit_WorldBrush.png =300x)

<a id="markdown-ikea-place" name="ikea-place"></a>
### IKEA Place

[IKEA Place](https://itunes.apple.com/us/app/ikea-place/id1279244498?mt=8) lets you virtually 'place' IKEA products in your space.

![ikea place](/images/ARKit_IkeaPlace.png =300x)

<a id="markdown-ar-measurekit" name="ar-measurekit"></a>
### AR MeasureKit

[AR MeasureKit](https://itunes.apple.com/us/app/ar-measurekit/id1258270451?mt=8) makes it really easy to measure different things in the world using your iPhone’s or iPad’s camera.

![ar measure kit](/images/ARKit_MeasureKit.png =300x)

<a id="markdown-requirement" name="requirement"></a>
## Requirement

* iOS 11 and above system.
* iOS device with an A9 or later processor.

To make your app available only on devices supporting ARKit, use the arkit key in the `UIRequiredDeviceCapabilities` section of your app's Info.plist. If augmented reality is a secondary feature of your app, use the `ARWorldTrackingSessionConfiguration.isSupported` property to determine whether the current device supports the session configuration you want to use.

<a id="markdown-arkit-usage" name="arkit-usage"></a>
## ARKit Usage

<a id="markdown-arkit-related-techniques" name="arkit-related-techniques"></a>
### ARKit Related Techniques

![arkit related techs](/images/ARKitRelatedTechs.png)

<a id="markdown-arkit-in-ios-system" name="arkit-in-ios-system"></a>
### ARKit in iOS System

![arkit in ios system](/images/ARKitFramework.png)

<a id="markdown-arkit-key-classes" name="arkit-key-classes"></a>
### ARKit Key Classes

![arkit usage](/images/ARKitUsage.png)

<a id="markdown-arsession" name="arsession"></a>
### `ARSession`

An [`ARSession`](https://developer.apple.com/documentation/arkit/arsession) object coordinates the major processes that ARKit performs on your behalf to create an augmented reality experience. These processes include reading data from the device's motion sensing hardware, controlling the device's built-in camera, and performing image analysis on captured camera images. The session synthesizes all of these results to establish a correspondence between the real-world space the device inhabits and a virtual space where you model AR content.

Every AR experience built with ARKit requires a single `ARSession`object. If you use an `ARSCNView` or `ARSKView` object to easily build the visual part of your AR experience, the view object includes an `ARSession` instance. If you build your own renderer for AR content, you'll need to instantiate and maintain an ARSession object yourself.

Running a session requires a session configuration: an instance of the `ARConfiguration` class, or its subclass `ARWorldTrackingConfiguration`. These classes determine how ARKit tracks a device's position and motion relative to the real world, and thus affect the kinds of AR experiences you can create.

<a id="markdown-arconfiguration" name="arconfiguration"></a>
### `ARConfiguration`

[`ARConfiguration`](https://developer.apple.com/documentation/arkit/arconfiguration) is an abstract class; you do not create or work with instances of this class.

To run an AR session, create an instance of the concrete `ARConfiguration` subclass that provides the kind of augmented reality experience you want to use in your app or game. Then, set up the configuration object's properties and pass the configuration to your session's `run(_:options:)` method. ARKit includes the following concrete configuration classes:

* [`ARWorldTrackingConfiguration`](https://developer.apple.com/documentation/arkit/arworldtrackingconfiguration)
Provides high-quality AR experiences that use the rear-facing camera precisely track a device's position and orientation and allow plane detection and hit testing. Creating and maintaining this correspondence between spaces requires tracking the device's motion. The `ARWorldTrackingConfiguration` class tracks the device's movement with six degrees of freedom (6DOF): specifically, the three rotation axes (roll, pitch, and yaw), and three translation axes (movement in x, y, and z).

* [`AROrientationTrackingConfiguration`](https://developer.apple.com/documentation/arkit/arorientationtrackingconfiguration)
Provides basic AR experiences that use the rear-facing camera and track only a device's orientation. Creating and maintaining this correspondence between spaces requires tracking the device's motion. The `AROrientationTrackingConfiguration` class tracks the device's movement with three degrees of freedom (3DOF): specifically, the three rotation axes (roll, pitch, and yaw).

    `AROrientationTrackingConfiguration` cannot track movement of the device, and 3DOF tracking does not support plane detection or hit testing.

    Use 3DOF tracking only as a fallback in situations where 6DOF tracking is temporarily unavailable.


* [`ARFaceTrackingConfiguration`](https://developer.apple.com/documentation/arkit/arfacetrackingconfiguration)
Provides AR experiences that use the front-facing camera and track the movement and expressions of the user's face. 

Face tracking is available only on iOS devices with a front-facing TrueDepth camera. 

An official example [Creating Face-Based AR Experiences](https://developer.apple.com/documentation/arkit/creating_face_based_ar_experiences) demonstrates that you can place and animate 3D content that follows the user’s face and matches facial expressions, using the TrueDepth camera on iPhone X.

<a id="markdown-more-on-arworldtrackingconfiguration" name="more-on-arworldtrackingconfiguration"></a>
### More on `ARWorldTrackingConfiguration`

Refer to [About Augmented Reality and ARKit](https://developer.apple.com/documentation/arkit/about_augmented_reality_and_arkit) for an official explanation of the world tracking things.

World tracking process can be illustrated as:

![arkit world tracking](/images/ARKitTracking.gif)

> One question here: *How does ARKit know how long is 1 meter in the real world?* [How can Apple’s ARKit (Augmented Reality) do precise measurement with just one camera?](https://www.quora.com/How-can-Apple%E2%80%99s-ARKit-Augmented-Reality-do-precise-measurement-with-just-one-camera) is trying to figure this out:

> "When an iPhone camera is turned on, it doesn’t have two different images with which to calculate distances. However, a moment after the first image is taken it does have a second image. **Thanks to data from the iPhone accelerometer sensors, it can also estimate the difference - from the first image to the second - of the iPhone camera’s 3D position and aim.** Now we go back to those “known features” being tracked. For each image the iPhone doesn’t just do this for a single feature, it maps as many features as it can. Aside from doing the triangulation on each of the features in the images, it also does a comparison between the differences in each feature’s relationship to other features in the image. So now, like your brain, the iPhone has two different views of something, knows the approximate angles of focus, knows the distance between the lens position, is tracking known features and their relationship to each other. From this, the iPhone can get a very good approximation of how each feature is positioned in space with relation to the other features, essentially producing a 3D mapping of the space."



<a id="markdown-tracking-quality" name="tracking-quality"></a>
#### Tracking Quality

To get better tracking quality:

1. Uninterrupted sensor data 
1. Textured environments 
1. Static scenes

If tracking quality changes, the tracking state will also change:

![arkit tracing state transition](/images/ARKitTrackingState.png)

And the tracking state changes will be notified by:

```

func session(_ session: ARSession, cameraDidChangeTrackingState camera: ARCamera) { 
    if case .limited(let reason) = camera.trackingState {
        // Notify user of limited tracking state
        ...
    } 
}

```

<a id="markdown-arframe" name="arframe"></a>
### `ARFrame`

After world tracking, we can get the 6 DOF of the camera, used for the upcoming rendering. These infos are stored in each `ARFrame`.

`ARFrame` owns video image and position tracking information captured as part of an AR session. There are two ways to access `ARFrame` objects produced by an AR session, depending on whether your app favors a pull or a push design pattern.

* *Pull Pattern*: get `currentFrame` from `ARSession`.
* *Push Pattern*: implement the `session(_:didUpdate:)` delegate method, and the session will call it once for each video frame it captures (at 60 frames per second by default).

Key infos in `ARFrame`:

1. **`ARCamera`**: Information about the camera position and imaging characteristics for a captured video frame in an AR session. Get `camera` from `ARFrame`.

1. **`ARLightEstimate`**: Estimated scene lighting information associated with a captured video frame in an AR session. Get `lightEstimate` from `ARFrame`.

    Refer to [ARKit by Example — Part 4: Realism - Lighting & PBR](https://blog.markdaws.net/arkit-by-example-part-4-realism-lighting-pbr-b9a0bedb013e) for mimicing the environment light.

<a id="markdown-hittest-for-real-world-position" name="hittest-for-real-world-position"></a>
### HitTest for Real World Position

By calling the following method on `ARSCNView`, 

```
open func hitTest(_ point: CGPoint, types: ARHitTestResult.ResultType) -> [ARHitTestResult]
```

we can get an array of `ARHitTestResult`, which stay at the very position point indicates. The `ARHitTestResult`s are sorted by distance. To call the method, you need to specify the `ARHitTestResult.ResultType`. There are four kinds of hitTest types:

<a id="markdown-existingplane" name="existingplane"></a>
#### `existingPlane`

Return the result type from intersecting with an existing plane anchor.

![arkit hittest existing plane](/images/ARKitHitTestExistingPlane.gif)

<a id="markdown-existingplaneusingextent" name="existingplaneusingextent"></a>
#### `existingPlaneUsingExtent`

Return the result type from intersecting with an existing plane anchor, taking into account the plane’s extent.

<a id="markdown-estimatedhorizontalplane" name="estimatedhorizontalplane"></a>
#### `estimatedHorizontalPlane`

Return the result type from intersecting a horizontal plane estimate, determined for the current frame.

![arkit hittest estimated plane](/images/ARKitHitTestEstimatedPlane.gif)

<a id="markdown-featurepoint" name="featurepoint"></a>
#### `featurePoint`

Return the result type from intersecting the nearest feature point.

![](/images/ARKitHitTestFeaturePoints.gif)

<a id="markdown-display-virtual-object-in-real-world" name="display-virtual-object-in-real-world"></a>
### Display Virtual Object in Real World

<a id="markdown-standard-view" name="standard-view"></a>
#### Standard View

* **`ARSCNView`**: A view for displaying AR experiences that augment the camera view with 3D SceneKit content.
* **`ARSKView`**: A view for displaying AR experiences that augment the camera view with 2D SpriteKit content.

<a id="markdown-custom-view" name="custom-view"></a>
#### Custom View 

To display your AR experience in a custom view, you’ll need to:

1. Retrieve video frames and tracking information from the session.
2. Render those frame images as the backdrop for your view.
3. Use the tracking information to position and draw AR content atop the camera image.

Refer to [Displaying an AR Experience with Metal](https://developer.apple.com/documentation/arkit/displaying_an_ar_experience_with_metal).

<a id="markdown-best-practices-and-limitations" name="best-practices-and-limitations"></a>
## Best Practices and Limitations

<a id="markdown-best-practices" name="best-practices"></a>
### Best Practices

World tracking is an inexact science. This process can often produce impressive accuracy, leading to realistic AR experiences. However, it relies on details of the device’s physical environment that are not always consistent or are difficult to measure in real time without some degree of error. To build high-quality AR experiences, be aware of these caveats and tips.

Refer to [About Augmented Reality and ARKit](https://developer.apple.com/documentation/arkit/about_augmented_reality_and_arkit).

**Design AR experiences for predictable lighting conditions.**

 World tracking involves image analysis, which requires a clear image. Tracking quality is reduced when the camera can’t see details, such as when the camera is pointed at a blank wall or the scene is too dark.

**Use tracking quality information to provide user feedback.**

 World tracking correlates image analysis with device motion. ARKit develops a better understanding of the scene if the device is moving, even if the device moves only subtly. Excessive motion—too far, too fast, or shaking too vigorously—results in a blurred image or too much distance for tracking features between video frames, reducing tracking quality. The ARCamera class provides tracking state reason information, which you can use to develop UI that tells a user how to resolve low-quality tracking situations.

**Allow time for plane detection to produce clear results, and disable plane detection when you have the results you need.**

 Plane detection results vary over time—when a plane is first detected, its position and extent may be inaccurate. As the plane remains in the scene over time, ARKit refines its estimate of position and extent. When a large flat surface is in the scene, ARKit may continue changing the plane anchor’s position, extent, and transform after you’ve already used the plane to place content.

<a id="markdown-limitations" name="limitations"></a>
### Limitations

1. For a moving object, ARKit can not give an usable world position of it.
1. You can not put a virtual object behind a real object. This leads to some problems, like:
    1. When an real object move in front of an virtual object, the virtual object will still be displayed in front of the real object.
    1. You can not hold a virtual object coolly, as the virtual object you are trying to hold can not be behind your fingers.


Two thoughts that may be help on the second limitation:

* Segment the camera image based on the feature point with world position. Draw further real object, and then virtual object, and at last, the nearest real object. However, as the feature point is sparse (performance consideration), some edge detection algorithms are needed for accurate edges of objects.
* Based on the dual camera, we can get depth of each pixel of the camera image. This will help on image segmentation.

<a id="markdown-ar-from-google" name="ar-from-google"></a>
## AR from Google

[Tango](https://developers.google.com/tango/?hl=zh-cn) is a platform that uses computer vision to give devices the ability to understand their position relative to the world around them. But Tango requires very special hardware to run on. So [ARCore](https://developers.google.com/ar/) comes.

> The Tango project will be deprecated on March 1st, 2018. Google is continuing AR development with ARCore, a new platform designed for building augmented reality apps for a broad range of devices without the requirement for specialized hardware.

ARCore is a platform for building augmented reality apps on Android. ARCore is designed to work on a wide variety of qualified Android phones running N and later. During the developer **preview**, ARCore supports the following devices:

* Google Pixel, Pixel XL, Pixel 2, Pixel 2 XL
* Samsung Galaxy S8 (SM-G950U, SM-G950N, SM-G950F, SM-G950FD, SM-G950W, SM-G950U1)




