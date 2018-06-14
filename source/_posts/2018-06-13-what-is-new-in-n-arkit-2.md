---
layout: post
title: "what is new in ARKit 2"
date: 2018-06-13 13:24:59 +0800
comments: true
published: false
categories: [ios]
---

<!-- more -->



Adding some demos time stamp…

Demo game: SwiftShot from “Platform State of Union”

## Saving and Loading Maps 

World Tracking Recap:
- Position and orientation 
- Physical scale
- 3D feature points 
- Relocalization 

World Tracking Enhancement:
- Saving and loading maps
- Faster initialization and plane detection 
- Robust tracking and plane detection 
- More accurate extent and boundary Continuous autofocus
- New 4:3 video formats (iPad is also 4:3)

ARWorldMap:
- Mapping of physical 3D space 
- Mutable list of named anchors 
- Raw feature points and extent 
- Serialization 

Enable/Disable world map share button according to WorldMappingStatus.
public enum WorldMappingStatus : Int {
   case notAvailable
   case limited
   case extending
   case mapped 
} 


Not rely on internet connectivity, bluetooth also works.

Usages:
- Persistent
- Multi-users experience
- Educational apps

## Environment Texturing 

Render ark scene object as realistic as possible: can reflect the environment texture on the surface of the virtual objects. 

## Image Tracking 

Moving objects can not be positioned in ARKit 1. In ARKit 2, specified images can be tracked in AR scene.

The specified image should:
- Histogram should be broad
- Not have multiple uniform color regions
- Not have repeated structures

Demo is cool. Cat image became alive. 

## Object Detection 

Refer to: [Scanning and Detecting 3D Objects](https://developer.apple.com/documentation/arkit/scanning_and_detecting_3d_objects)

Scan object -> import scanned object file -> detect scanned object from real world -> add some info beside the detected object. It can determine six degrees of the object (because it has all 3D info of the object), so it can place the info properly.

An ARReferenceObject contains only the spatial feature information needed for ARKit to recognize the real-world object, and is not a displayable 3D reconstruction of that object. 

## Face Tracking Enhancements

Face tracking, so that you can place something on it or around it.

Enhancements in ARKit 2:
- Gaze tracking
- Tongue support

Gaze and Tongue can be input of the AR app.

Summary

￼


