---
layout: post
title: "ARKit Usage"
date: 2017-12-28 17:25:27 +0800
comments: true
categories: [ios]
---


<!-- more -->

## Requirement

* iOS 11 and above system.
* iOS device with an A9 or later processor.

To make your app available only on devices supporting ARKit, use the arkit key in the `UIRequiredDeviceCapabilities` section of your app's Info.plist. If augmented reality is a secondary feature of your app, use the `isSupported` property to determine whether the current device supports the session configuration you want to use.

## ARKit Usage

### ARKit in iOS System

![arkit in ios system](/images/ARKitFramework.png)

### ARKit Key Classes

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

> One questiong here: How does ARKit know how long is 1 meter in the real world?    

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

### `ARFrame`

After world tracking, we can get the 6 DOF of the camera, used for the upcomming rendering. These infos are stored in each `ARFrame`.

`ARFrame` owns video image and position tracking information captured as part of an AR session. There are two ways to access `ARFrame` objects produced by an AR session, depending on whether your app favors a pull or a push design pattern.

* *Pull Pattern*: get `currentFrame` from `ARSession`.
* *Push Pattern*: implement the `session(_:didUpdate:)` delegate method, and the session will call it once for each video frame it captures (at 60 frames per second by default).

Key infos in `ARFrame`:

1. **`ARCamera`**: Information about the camera position and imaging characteristics for a captured video frame in an AR session. Get `camera` from `ARFrame`.

1. **`ARLightEstimate`**: Estimated scene lighting information associated with a captured video frame in an AR session. Get `lightEstimate` from `ARFrame`.

    Refer to [ARKit by Example — Part 4: Realism - Lighting & PBR](https://blog.markdaws.net/arkit-by-example-part-4-realism-lighting-pbr-b9a0bedb013e) for mimicing the environment light.

### HitTest for Real World Position

By calling the following method on `ARSCNView`, 

```swift
open func hitTest(_ point: CGPoint, types: ARHitTestResult.ResultType) -> [ARHitTestResult]
```

we can get an array of `ARHitTestResult`, which stay at the very position point indicates. The `ARHitTestResult`s are sorted by distance. To call the method, you need to specify the `ARHitTestResult.ResultType`. There are four kinds of hitTest types:

#### `existingPlane`

Return the result type from intersecting with an existing plane anchor.

![arkit hittest existing plane](/images/ARKitHitTestExistingPlane.gif)

#### `existingPlaneUsingExtent`

Return the result type from intersecting with an existing plane anchor, taking into account the plane’s extent.

#### `estimatedHorizontalPlane`

Return the result type from intersecting a horizontal plane estimate, determined for the current frame.

![arkit hittest estimated plane](/images/ARKitHitTestEstimatedPlane.gif)

#### `featurePoint`

Return the result type from intersecting the nearest feature point.

![](/images/ARKitHitTestFeaturePoints.gif)

### Display Virtual Object in Real World

#### Standard View

* **`ARSCNView`**: A view for displaying AR experiences that augment the camera view with 3D SceneKit content.
* **`ARSKView`**: A view for displaying AR experiences that augment the camera view with 2D SpriteKit content.

#### Custom View (Refer to [Displaying an AR Experience with Metal](https://developer.apple.com/documentation/arkit/displaying_an_ar_experience_with_metal))

To display your AR experience in a custom view, you’ll need to:

1. Retrieve video frames and tracking information from the session.
2. Render those frame images as the backdrop for your view.
3. Use the tracking information to position and draw AR content atop the camera image.

### Face-Based AR Experiences

**Creating Face-Based AR Experiences**
Place and animate 3D content that follows the user’s face and matches facial expressions, using the TrueDepth camera on iPhone X. Reer to [Creating Face-Based AR Experiences](https://developer.apple.com/documentation/arkit/creating_face_based_ar_experiences) for an official example.

* **`ARFaceTrackingConfiguration`**: A configuration that tracks the movement and expressions of the user’s face using the TrueDepth camera.
* **ARFaceAnchor**: Information about the pose, topology, and expression of a face detected in a face-tracking AR session.

## Best Practices and Limitations

### Best Practices (Refer to [About Augmented Reality and ARKit](https://developer.apple.com/documentation/arkit/about_augmented_reality_and_arkit))

World tracking is an inexact science. This process can often produce impressive accuracy, leading to realistic AR experiences. However, it relies on details of the device’s physical environment that are not always consistent or are difficult to measure in real time without some degree of error. To build high-quality AR experiences, be aware of these caveats and tips.

**Design AR experiences for predictable lighting conditions.**

 World tracking involves image analysis, which requires a clear image. Tracking quality is reduced when the camera can’t see details, such as when the camera is pointed at a blank wall or the scene is too dark.

**Use tracking quality information to provide user feedback.**

 World tracking correlates image analysis with device motion. ARKit develops a better understanding of the scene if the device is moving, even if the device moves only subtly. Excessive motion—too far, too fast, or shaking too vigorously—results in a blurred image or too much distance for tracking features between video frames, reducing tracking quality. The ARCamera class provides tracking state reason information, which you can use to develop UI that tells a user how to resolve low-quality tracking situations.

**Allow time for plane detection to produce clear results, and disable plane detection when you have the results you need.**

 Plane detection results vary over time—when a plane is first detected, its position and extent may be inaccurate. As the plane remains in the scene over time, ARKit refines its estimate of position and extent. When a large flat surface is in the scene, ARKit may continue changing the plane anchor’s position, extent, and transform after you’ve already used the plane to place content.

### Limitations

1. For a moving object, ARKit can not give an usable world position of it.
1. You can not put a virtual object behind a real object. This leads to some problems, like:
    1. When an real object move in front of an virtual object, the virtual object will still be displayed in front of the real object.
    1. You can not hold a virtual object coolly, as the virtual object you are trying to hold can not be behind your fingers.


Two thoughts that may be help on the second limitation:

* Segment the camera image based on the feature point with world position. Draw further real object, and then virtual object, and at last, the nearest real object. However, as the feature point is sparse (performance consideration), some edge detection algorithms are needed for accurate edges of objects.
* Based on the dual camera, we can get depth of each pixel of the camera image. This will help on image segmentation.





