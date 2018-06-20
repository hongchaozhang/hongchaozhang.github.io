---
layout: post
title: "What is new in ARKit 2"
date: 2018-06-13 13:24:59 +0800
comments: true
published: true
categories: [ios, wwdc]
---

<!-- more -->

## New Features in ARKit 2

### Saving and Loading Maps 

#### World Tracking Recap:

- Position and orientation of the device.
- Physical scale in the scene.
- 3D feature points.
- Relocalization (iOS 11.3): we can relocalize objects when your AR session is interrupted, like phone coming or going from background. This feature is implemented by storing the mapping `ARWorldMap` between real world and the coordinate system. However the mapping is not exposed to developers.

#### World Tracking Enhancement:

- **Saving and loading maps**: expose the `ARWorldMap` to developers.
- Faster initialization and plane detection 
- Robust tracking and plane detection 
- More accurate extent and boundary Continuous autofocus
- New 4:3 video formats (iPad is also 4:3)

#### Saving and loading maps:

`ARWorldmap` contains:

- Mapping of physical 3D space: for representing 3D feature points in the coordinate system.
- Mutable list of named anchors: for restoring previous 3D environment (like lighting node anchor), and relocalizing previously added virtual objects.
- Raw feature points and extent: for debugging and visualization.
- Serialization: for storing and recovering from an file.

![arkit arworldmap](/images/arkit2_arworldmap.jpg =500x)

We can use the map in two different ways:

* Persistent: Restore previous AR scene for a new AR session. For example, you go to another room and come back or close the AR app and open it some time later.
* Multiuser experience: We can share the map among devices through WiFi or bluetooth.

The SwiftShot is an multiuser experience AR game:

![arkit2 swiftshot](/images/swiftshot.jpg)

and the following is a small piece of the demo:

![swift shot game](/images/arkit2_multiuser_experience_demo.gif)

#### How to get a good map

In order to share or restore the map, we need to get a good one first. A good map should be:

<!-- * Important for relocalization -->
* Multiple points of view: If we record the mapping from one point of view, and try to restore the coordinate system from another point of view, it will fail.
* Static, well-textured environment.
* Dense feature points on the map.

We can use the `WorldMappingStatus` status from `ARFrame` to decide if the current map is good enough for sharing or storing:

```swift
public enum WorldMappingStatus : Int {
   case notAvailable
   case limited
   case extending
   case mapped 
}
```

### Environment Texturing 

With the help of Environment Texturing, AR scene objects can reflect the environment texture on the surface of themselves, just like:

![arkit2 environment texturing demo](/images/arkit2_environment_texturing_demo.jpg)

### Image Tracking 

Moving objects can not be positioned in ARKit 1. In ARKit 2, specified images can be tracked in AR scene.

![arkit 2 image tracking](/images/arkit2_image_tracking.gif)

The classes in ARKit 2 for image tracking are:

![arkit 2 image tracking classes](/images/arkit2_image_tracking_classes.jpg)

The detected `ARImageAnchor`s have properties like:

```swift
open class ARImageAnchor : ARAnchor, ARTrackable { 
    public var isTracked: Bool { get }
    open var transform: simd_float4x4 { get }
    open var referenceImage: ARReferenceImage { get }
}
```

The specified image should:

- Histogram should be broad
- Not have multiple uniform color regions
- Not have repeated structures

The following is the demo:

![arkit 2 image tracking demo](/images/arkit2_image_tracking_demo.gif)

The inputs of the above demo are:

* an static image of the cat, the same as it is in the picture frame
* an video of the cat

The video is played at the position of the specified picture frame, with the same orientation of the picture frame.


### 3D Object Detection 


3D object detection workflow is:

![arkit2 3D object tracking classes](/images/arkit2_3D_object_tracking_classes.jpg)

The `ARObjectAnchor` contains properties like:

```swift
open class ARObjectAnchor : ARAnchor {
    open var transform: simd_float4x4 { get }
    open var referenceObject: ARReferenceObject { get }
}
```

and `ARReferenceObject` is the scanned 3D object:

```swift
open class ARReferenceObject
    : NSObject, NSCopying, NSSecureCoding {
    open var name: String?
    open var center: simd_float3 { get }
    open var extent: simd_float3 { get }
    open var rawFeaturePoints: ARPointCloud { get }
}
```

> An `ARReferenceObject` contains only the spatial feature information needed for ARKit to recognize the real-world object, and is not a displayable 3D reconstruction of that object.

In order to get the `ARReferenceObject`, we should scan the real object, and store the result as an file (.arobject) or an xcode asset catalog for ARKit to use. Fortunately, Apple supplies a demo for scanning 3D object to get the `ARReferenceObject`. Refer to: [Scanning and Detecting 3D Objects](https://developer.apple.com/documentation/arkit/scanning_and_detecting_3d_objects) for detail and the rough steps of object scanning are:

![arkit2 3D object scan](/images/arkit2_3D_object_scan.jpg)

For scanned object in the real world, we can dynamically add some info around it (Museum is a good use case.), like the demo does:

![arkit2 object tracking demo](/images/arkit2_3D_object_tracking_demo.gif)


### Face Tracking Enhancements

With face tracking, we can place something on it or around it.

Enhancements in ARKit 2:

- Gaze tracking
- Tongue support

> Gaze and Tongue can be input of the AR app.


New changes in one screenshot:

![what-is-new-in-arkit-2](/images/what-is-new-in-arkit-2.jpg)


## Some other materials for a better AR app:

### [Building Your First AR Experience](https://developer.apple.com/documentation/arkit/building_your_first_ar_experience)

This document demos an app for basic usage of ARKit.

### [Managing Session Lifecycle and Tracking Quality](https://developer.apple.com/documentation/arkit/managing_session_lifecycle_and_tracking_quality)

Make your AR experience more robust by 

* providing clear feedback, using `ARCamera.TrackingState`.
* recovering from interruptions, using `ARCamera.TrackingState.Reason.relocalizing`.
* resuming previous sessions, using `ARWorldMap`.

### [Human Interface Guidelines - Augmented Reality](https://developer.apple.com/design/human-interface-guidelines/ios/system-capabilities/augmented-reality/)

This post describes how to rendering virtual objects, how to interact with virtual objects, how to handling interruptions. It is for UX.

### [Handling 3D Interaction and UI Controls in Augmented Reality](https://developer.apple.com/documentation/arkit/handling_3d_interaction_and_ui_controls_in_augmented_reality)

This document describes the best practices for visual feedback, gesture interactions, and realistic rendering in AR experiences. And a demo app is supplied.

![arkit demo](/images/arkit_demo_screenshot.jpg)

### [Creating a Multiuser AR Experience](https://developer.apple.com/documentation/arkit/creating_a_multiuser_ar_experience)

This document demos an app on how to transmit ARKit world-mapping data between nearby devices with the [MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity) framework (introduced in iOS 7.0) to create a shared basis for AR experiences. MultipeerConnectivity supports peer-to-peer connectivity and the discovery of nearby devices. With MultipeerConnectivity, you can not only share `ARWorldMap`, but also some actions. This makes multiuser AR game possible.

However:

* Recording and transmitting a world map and relocalizing to a world map are time-consuming, bandwidth-intensive operations. A good design is needed for better performance.
* The persons received the world map data need to move their device so they see a similar perspective (also sent by the host) helps ARKit process the received map and establish a shared frame of reference for the multiuser experience.

### [SwiftShot: Creating a Game for Augmented Reality](https://developer.apple.com/documentation/arkit/swiftshot_creating_a_game_for_augmented_reality)

This document demos the SwiftShot game shown on WWDC 2018, including:

* Designing Gameplay for AR
* Using Local Multipeer Networking and Sharing World Maps
* Synchronizing Gameplay Actions
* Solving Multiplayer Physics
