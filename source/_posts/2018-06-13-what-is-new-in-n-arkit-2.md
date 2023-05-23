---
layout: post
title: "What is new in ARKit 2"
date: 2018-06-13 13:24:59 +0800
comments: true
published: true
categories: [ios, wwdc, machine learning, augmented reality]
---

<!-- more -->

- [Overview](#overview)
- [New Features in ARKit 2](#new-features-in-arkit-2)
  - [Saving and Loading Maps](#saving-and-loading-maps)
    - [World Tracking Recap:](#world-tracking-recap)
    - [World Tracking Enhancement:](#world-tracking-enhancement)
    - [Saving and loading maps:](#saving-and-loading-maps)
    - [How to get a good map](#how-to-get-a-good-map)
  - [Environment Texturing](#environment-texturing)
  - [Image Tracking](#image-tracking)
  - [3D Object Detection](#3d-object-detection)
  - [Face Tracking Enhancements](#face-tracking-enhancements)
- [Some other WWDC Sessions Related to AR](#some-other-wwdc-sessions-related-to-ar)
  - [Integrating Apps and Content with AR Quick Look](#integrating-apps-and-content-with-ar-quick-look)
  - [Inside SwiftShot: Creating an AR Game](#inside-swiftshot-creating-an-ar-game)
  - [Creating Great AR Experiences](#creating-great-ar-experiences)
  - [Understanding ARKit Tracking and Detection](#understanding-arkit-tracking-and-detection)
- [Some other materials for a better AR app:](#some-other-materials-for-a-better-ar-app)
  - [Building Your First AR Experience](#building-your-first-ar-experience)
  - [Managing Session Lifecycle and Tracking Quality](#managing-session-lifecycle-and-tracking-quality)
  - [Human Interface Guidelines - Augmented Reality](#human-interface-guidelines---augmented-reality)
  - [Handling 3D Interaction and UI Controls in Augmented Reality](#handling-3d-interaction-and-ui-controls-in-augmented-reality)
  - [Creating a Multiuser AR Experience](#creating-a-multiuser-ar-experience)
  - [SwiftShot: Creating a Game for Augmented Reality](#swiftshot-creating-a-game-for-augmented-reality)
  - [Recognizing Images in an AR Experience](#recognizing-images-in-an-ar-experience)
  - [Scanning and Detecting 3D Objects](#scanning-and-detecting-3d-objects)

<a id="markdown-overview" name="overview"></a>
## Overview

In ARKit 1, we have:

* Device positioning from world tracking process
* Horizontal and vertical plane detection from world tracking process
* Lighting estimation
* AR face tracking

In ARKit 2, we have:

* Saving and loading maps
* Environment Texturing
* Image detection and tracking
* 3D object tracking
* Improved face tracking

<a id="markdown-new-features-in-arkit-2" name="new-features-in-arkit-2"></a>
## New Features in ARKit 2

<a id="markdown-saving-and-loading-maps" name="saving-and-loading-maps"></a>
### Saving and Loading Maps 

<a id="markdown-world-tracking-recap" name="world-tracking-recap"></a>
#### World Tracking Recap:

- Position and orientation of the device.
- Physical scale in the scene.
- 3D feature points.
- Relocalization (iOS 11.3): we can relocalize objects when your AR session is interrupted, like phone coming or going from background. This feature is implemented by storing the mapping `ARWorldMap` between real world and the coordinate system. However the mapping is not exposed to developers.

<a id="markdown-world-tracking-enhancement" name="world-tracking-enhancement"></a>
#### World Tracking Enhancement:

- **Saving and loading maps**: expose the `ARWorldMap` to developers.
- Faster initialization and plane detection 
- Robust tracking and plane detection 
- More accurate extent and boundary Continuous autofocus
- New 4:3 video formats (iPad is also 4:3)

<a id="markdown-saving-and-loading-maps" name="saving-and-loading-maps"></a>
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

<a id="markdown-how-to-get-a-good-map" name="how-to-get-a-good-map"></a>
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

<a id="markdown-environment-texturing" name="environment-texturing"></a>
### Environment Texturing 

With the help of Environment Texturing, AR scene objects can reflect the environment texture on the surface of themselves, just like:

![arkit2 environment texturing demo](/images/arkit2_environment_texturing_demo.jpg)

<a id="markdown-image-tracking" name="image-tracking"></a>
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

There are two classes related to image tracking:

ARImageTrackingConfiguration | ARWorldTrackingConfiguration
--- | ---
Has No World Origin | Has World Origin
After detecting the image, only do things inside the place of the image. | After detecting the image, place some virtual objects outside the detected image plane.


<a id="markdown-3d-object-detection" name="3d-object-detection"></a>
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


<a id="markdown-face-tracking-enhancements" name="face-tracking-enhancements"></a>
### Face Tracking Enhancements

With face tracking, we can place something on it or around it.

Enhancements in ARKit 2:

- Gaze tracking
- Tongue support

> Gaze and Tongue can be input of the AR app.


New changes in one screenshot:

![what-is-new-in-arkit-2](/images/what-is-new-in-arkit-2.jpg)


<a id="markdown-some-other-wwdc-sessions-related-to-ar" name="some-other-wwdc-sessions-related-to-ar"></a>
## Some other WWDC Sessions Related to AR

<a id="markdown-integrating-apps-and-content-with-ar-quick-lookhttpsdeveloperapplecomvideosplaywwdc2018603" name="integrating-apps-and-content-with-ar-quick-lookhttpsdeveloperapplecomvideosplaywwdc2018603"></a>
### [Integrating Apps and Content with AR Quick Look](https://developer.apple.com/videos/play/wwdc2018/603/)

A deeper dive into a new feature in iOS that provides a way to preview any AR object from a USDZ file.

![QLPreviewController](/images/QLPreviewController.png)

* There’s a great sequence diagram presented (see above) (I wish more sessions would have these!) for previewing USDZ objects, of which the `QLPreviewController` plays a central role.
* For web developers, it covers HTML samples for how to preview USDZ objects in Safari.
* Then it goes into a deep dive on how to create the actual USDZ objects, with more examples on new AR texturing capabilities.
* There’s also a quick overview on how to optimize the files, to keep the size down, and there’s a breakdown of the files that make up the USDZ format.

<a id="markdown-inside-swiftshot-creating-an-ar-gamehttpsdeveloperapplecomvideosplaywwdc2018605" name="inside-swiftshot-creating-an-ar-gamehttpsdeveloperapplecomvideosplaywwdc2018605"></a>
### [Inside SwiftShot: Creating an AR Game](https://developer.apple.com/videos/play/wwdc2018/605/)

Covers world map sharing, networking, and the physics of how to build an AR game, as well as some design insight (I have limited game dev experience so I’ll do the best I can below).

* Pointers to remember with designing an AR game, such as “encouraging” the user to slowly move the device for world mapping!
* It demonstrates the usage of image & object detection, world map sharing, and iBeacons for the game.
* Integrating `ARKit` with `SceneKit` and `Metal`, including the translation of physics data between each — position, velocity, and orientation.
* Performance enhancement with the `BitStreamCodable` protocol.
* A small look at how audio was integrated into the game.

<a id="markdown-creating-great-ar-experienceshttpsdeveloperapplecomvideosplaywwdc2018805" name="creating-great-ar-experienceshttpsdeveloperapplecomvideosplaywwdc2018805"></a>
### [Creating Great AR Experiences](https://developer.apple.com/videos/play/wwdc2018/805/)

Best practises mainly from a UX & design perspective (there are no code samples in this session).

* Logical dos and don’ts that may be useful, if you need help with thought towards product and empathy towards the user.
* They emphasize the importance of using transitions between AR scapes.
* Why AR is a special combination of touch and movement.
* They advise that minimal battery impact should be a huge focus! This is a challenge, given that they recommend to render the FPS at 60 to avoid latency.
* There’s a lengthy demonstration of creating an AR fireplace, with complex texturing, etc. It looks great, but unfortunately there were no coding samples accompanying the demo.

<a id="markdown-understanding-arkit-tracking-and-detectionhttpsdeveloperapplecomvideosplaywwdc2018610" name="understanding-arkit-tracking-and-detectionhttpsdeveloperapplecomvideosplaywwdc2018610"></a>
### [Understanding ARKit Tracking and Detection](https://developer.apple.com/videos/play/wwdc2018/610/)

A good broad overview of all of the main AR concepts.

* This is such a good intro into not only AR on iOS, but AR in general, that it should have been part of 2017’s sessions when ARKit was first introduced. Better late than never. If you’re only going to watch one session, watch this one!
* It recaps the main features of ARKit — **orientation**, **world tracking**, and **plane detection**, and demos all of these in depth with coding samples.
* It then demos the new features of ARKit 2 — **shared world mapping**, **image tracking**, and **object detection** (which has been available in the Vision framework recapped above, but is now also accessible in ARKit).
* A good explanation on a core AR principle, **Visual Inertial Odometry**, is given. Short of going into the actual physics equations behind it, this should give you a great understanding of VIO.


<a id="markdown-some-other-materials-for-a-better-ar-app" name="some-other-materials-for-a-better-ar-app"></a>
## Some other materials for a better AR app:

<a id="markdown-building-your-first-ar-experiencehttpsdeveloperapplecomdocumentationarkitbuilding_your_first_ar_experience" name="building-your-first-ar-experiencehttpsdeveloperapplecomdocumentationarkitbuilding_your_first_ar_experience"></a>
### [Building Your First AR Experience](https://developer.apple.com/documentation/arkit/building_your_first_ar_experience)

This document demos an app for basic usage of ARKit.

<a id="markdown-managing-session-lifecycle-and-tracking-qualityhttpsdeveloperapplecomdocumentationarkitmanaging_session_lifecycle_and_tracking_quality" name="managing-session-lifecycle-and-tracking-qualityhttpsdeveloperapplecomdocumentationarkitmanaging_session_lifecycle_and_tracking_quality"></a>
### [Managing Session Lifecycle and Tracking Quality](https://developer.apple.com/documentation/arkit/managing_session_lifecycle_and_tracking_quality)

Make your AR experience more robust by 

* providing clear feedback, using `ARCamera.TrackingState`.
* recovering from interruptions, using `ARCamera.TrackingState.Reason.relocalizing`.
* resuming previous sessions, using `ARWorldMap`.

<a id="markdown-human-interface-guidelines---augmented-realityhttpsdeveloperapplecomdesignhuman-interface-guidelinesiossystem-capabilitiesaugmented-reality" name="human-interface-guidelines---augmented-realityhttpsdeveloperapplecomdesignhuman-interface-guidelinesiossystem-capabilitiesaugmented-reality"></a>
### [Human Interface Guidelines - Augmented Reality](https://developer.apple.com/design/human-interface-guidelines/ios/system-capabilities/augmented-reality/)

This post describes how to rendering virtual objects, how to interact with virtual objects, how to handling interruptions. It is for UX.

<a id="markdown-handling-3d-interaction-and-ui-controls-in-augmented-realityhttpsdeveloperapplecomdocumentationarkithandling_3d_interaction_and_ui_controls_in_augmented_reality" name="handling-3d-interaction-and-ui-controls-in-augmented-realityhttpsdeveloperapplecomdocumentationarkithandling_3d_interaction_and_ui_controls_in_augmented_reality"></a>
### [Handling 3D Interaction and UI Controls in Augmented Reality](https://developer.apple.com/documentation/arkit/handling_3d_interaction_and_ui_controls_in_augmented_reality)

This document describes the best practices for visual feedback, gesture interactions, and realistic rendering in AR experiences. And a demo app is supplied.

![arkit demo](/images/arkit_demo_screenshot.jpg)

<a id="markdown-creating-a-multiuser-ar-experiencehttpsdeveloperapplecomdocumentationarkitcreating_a_multiuser_ar_experience" name="creating-a-multiuser-ar-experiencehttpsdeveloperapplecomdocumentationarkitcreating_a_multiuser_ar_experience"></a>
### [Creating a Multiuser AR Experience](https://developer.apple.com/documentation/arkit/creating_a_multiuser_ar_experience)

This document demos an app (with source code) on how to transmit ARKit world-mapping data between nearby devices with the [MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity) framework (introduced in iOS 7.0) to create a shared basis for AR experiences. MultipeerConnectivity supports peer-to-peer connectivity and the discovery of nearby devices. With MultipeerConnectivity, you can not only share `ARWorldMap`, but also some actions. This makes multiuser AR game possible.

However:

* Recording and transmitting a world map and relocalizing to a world map are time-consuming, bandwidth-intensive operations. A good design is needed for better performance.
* The persons received the world map data need to move their device so they see a similar perspective (also sent by the host) helps ARKit process the received map and establish a shared frame of reference for the multiuser experience.

<a id="markdown-swiftshot-creating-a-game-for-augmented-realityhttpsdeveloperapplecomdocumentationarkitswiftshot_creating_a_game_for_augmented_reality" name="swiftshot-creating-a-game-for-augmented-realityhttpsdeveloperapplecomdocumentationarkitswiftshot_creating_a_game_for_augmented_reality"></a>
### [SwiftShot: Creating a Game for Augmented Reality](https://developer.apple.com/documentation/arkit/swiftshot_creating_a_game_for_augmented_reality)

This document demos the SwiftShot game shown on WWDC 2018, including:

* Designing Gameplay for AR
* Using Local Multipeer Networking and Sharing World Maps
* Synchronizing Gameplay Actions
* Solving Multiplayer Physics

<a id="markdown-recognizing-images-in-an-ar-experiencehttpsdeveloperapplecomdocumentationarkitrecognizing_images_in_an_ar_experience" name="recognizing-images-in-an-ar-experiencehttpsdeveloperapplecomdocumentationarkitrecognizing_images_in_an_ar_experience"></a>
### [Recognizing Images in an AR Experience](https://developer.apple.com/documentation/arkit/recognizing_images_in_an_ar_experience)

Detect known 2D images in the user’s environment, and use their positions to place AR content.

<a id="markdown-scanning-and-detecting-3d-objectshttpsdeveloperapplecomdocumentationarkitscanning_and_detecting_3d_objects" name="scanning-and-detecting-3d-objectshttpsdeveloperapplecomdocumentationarkitscanning_and_detecting_3d_objects"></a>
### [Scanning and Detecting 3D Objects](https://developer.apple.com/documentation/arkit/scanning_and_detecting_3d_objects)

Record spatial features of real-world objects, then use the results to find those objects in the user’s environment and trigger AR content.