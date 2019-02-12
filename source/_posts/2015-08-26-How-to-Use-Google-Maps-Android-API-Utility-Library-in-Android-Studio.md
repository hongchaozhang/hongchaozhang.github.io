---
layout: post
comments: true
categories: [android,android studio]
title: How to Use Google Maps Android API Utility Library in Android Studio
---

**Google Maps Android API utility library** (the [github repo](https://github.com/googlemaps/android-maps-utils) and the [documentation](http://googlemaps.github.io/android-maps-utils/)) supplies multiple cool features, including

* **Marker clustering** — handles the display of a large number of points
* **Heat maps** — display a large number of points as a heat map
* **IconGenerator** — display text on your Markers
* **Poly decoding and encoding** — compact encoding for paths, interoperability with Maps API web services
* **Spherical geometry** — for example: computeDistance, computeHeading, computeArea
* **KML** — displays KML data (Caution: Beta!)
* **GeoJSON** — displays and styles GeoJSON data

<!-- more -->

A simple documentation about the usage of these features based on a demo can be found in *Google Developers* page [Google Maps Android API Utility Library](https://developers.google.com/maps/documentation/android/utility/?hl=zh-cn). And you can also refer to the [javadoc](http://googlemaps.github.io/android-maps-utils/javadoc/).

When I tried to use the library in my Android Studio (Windows OS) project, I met some problems. It is not as simple as the [document](http://googlemaps.github.io/android-maps-utils/) describes. A reference for setting up in Eclipse can be found in the [Google Maps Android API Utilities Setup](https://developers.google.com/maps/documentation/android/utility/setup?hl=zh-cn).

As we know, we have three ways to use a library in Android Studio project: *Module dependency*, *Remote binary dependency* and *Local binary dependency*. (Go to [Configure Gradle Builds](https://developer.android.com/tools/building/configuring-gradle.html) for detail). See the following code that we can use in the module `build.gradle`, not the project `build.gradle`

	dependencies {
	    // Module dependency
	    compile project(":lib")

	    // Remote binary dependency
	    compile 'com.android.support:appcompat-v7:19.0.1'

	    // Local binary dependency
	    compile fileTree(dir: 'libs', include: ['*.jar'])
	}
	
I use the *Module dependency* method **successfully** in my project, but **failed** with the other two methods. Let's go to the details.

## Module Dependency (Succeeded)

* In your project, **New --> Module --> Android Library**, name it with *library* (not a googd name).
* Go to the exploror, go to *<your project folder>/library*, delete all the files and folders there.
* Go to the *library* folder in the repository you downloaded from [android-maps-utils](https://github.com/googlemaps/android-maps-utils). Copy all the files and folders, and paste them into your own *library* folder.
* Open `build.gradle` under your own module, under `dependencies` element, add `compile project(':library')`.
* Sync your project, build and run. Success!

## Remote Binary Dependency (Failed)

The github page suggested this way by
	
	dependencies {
		compile 'com.google.maps.android:android-maps-utils:x.y.z'
	}

But I just can not find the path `<Android SDK>/extras/google/m2repository/com/google/map.android/`. I am sure that I already installed the *Google Repository* by SDK manager.

## Local Binary Dependency (Failed)

To use this way, I tried:

* put the `library-debug.aar` in to the *libs* folder in my module from *<library/build/output/aar/* in Android Studio project exploror view.
* add `compile fileTree(dir: 'libs', include: ['*.aar'])` into my module `build.gradle` file, `dependencies` element.

Seems that Android studio doesn't support `.aar` type library.

So I changed to the following way:

* unzip the `library-debug.aar` file, and copy the `class.jar` file into the *libs* folder in my module.
* add `compile fileTree(dir: 'libs', include: ['*.jar'])` in to my module `build.gradle` file, `dependencies` element.
* Build passed, but crashed when I run it. I didn't go into it. Maybe the library need some resource that is in the `.aar` file, which is not in the `class.jar` file. Just guess.










