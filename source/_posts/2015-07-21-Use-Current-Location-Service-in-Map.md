---
layout: post
comments: true
categories: [ios]
title: Use Current Location Service in Map
---


## Location Service Authorization

### 1. Set *info.plist*

For iOS SDK 8.0 and later, we need to set `NSLocationWhenInUseUsageDescription` and 'NSLocationAlwaysUsageDescription' in *info.plist* file. A sample case is:
{% highlight xml linenos %}
<key>NSLocationWhenInUseUsageDescription</key>
<string>Do you allow the app to use your location?</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>Are you willing to allow the app to use your location?</string>
{% endhighlight %}
The `string` will appear in the popup dialog. You can leave it as empty, and only the system message will appear in the popup.

<!-- more -->

### 2. Ask the User for Location Service Authorization

We ask for the authorization by an instance of `CLLocationManager`.

* import `CoreLocation/CoreLocation.h` class, and define a location manager `locationManager` in the map view controller.
* use the following code for asking authorization from user:
{%highlight objc linenos %}
if ([CLLocationManager locationServicesEnabled] ) { // check if the location service is enabled for the device
    if (self.locationManager == nil ) {
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        self.locationManager.distanceFilter = kCLDistanceFilterNone;
    }
    // Check for iOS 8. Without this guard the code will crash with "unknown selector" on iOS 7.
    if([self.locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]){
        CLAuthorizationStatus locationAuthorizationStatus = [CLLocationManager authorizationStatus];
        if (locationAuthorizationStatus == kCLAuthorizationStatusNotDetermined && ([self.locationManager respondsToSelector:@selector(requestAlwaysAuthorization)] || [self.locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)])) {
            // choose one request according to your business.
            if([[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationAlwaysUsageDescription"]){
                [self.locationManager requestAlwaysAuthorization];
            } else if([[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationWhenInUseUsageDescription"]) {
                [self.locationManager  requestWhenInUseAuthorization];
            } else {
                NSLog(@"Info.plist does not contain NSLocationAlwaysUsageDescription or NSLocationWhenInUseUsageDescription");
            }
        }
    }
}
{% endhighlight %}
	

## Get Location

For iOS SDK 8.0 and later, we have two ways to get user current location:

1. set `showsUserLocation` to `YES` for map view.
2. send method `startUpdatingLocation` to `CLLocationManager` instance.

### 1. showsUserLocation

For this way, after we set `showsUserLocation` to `YES`, 

* We can get the location in `mapView:didUpdateUserLocation:`.
{%highlight objc linenos %}
- (void)mapView:(MKMapView *)mapView didUpdateUserLocation:(MKUserLocation *)userLocation
{
    // Center the map the first time we get a real location change.
    static dispatch_once_t centerMapFirstTime;
    
    if ((userLocation.coordinate.latitude != 0.0) && (userLocation.coordinate.longitude != 0.0)) {
        dispatch_once(&centerMapFirstTime, ^{
            [self.mapView setCenterCoordinate:userLocation.coordinate animated:YES];
        });
    }
    
}
{% endhighlight %}
* We can set the current location annotation view in `mapView:viewForAnnotation:`. If `nil` is returned, a default blue circle with white boundary is use. The circle has breathing effect. For this purpose, we need to identify the annotation (which is an `id` type) type: if it is a `MKUserLocation` type, return a current location annotation view or nil. **Question: How to define whether an `id` type object is a `MKUserLocation` type object?**

Before implementing the above two methods, we should set the map view's delegate comfirm with `MapViewDelegate` protoco.

### 2. Send message `startUpdateingLocation` to `CLLocationManager` Instaance

For this way, after we send the method, 

* We can get the location in `locationManager:didUpdateLocations:`. The newest location is the `lastObject` of `locations`.
{%highlight objc linenos %}
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
    self.currentLocation = [locations lastObject];
    CLLocationCoordinate2D currentCoordinate = self.currentLocation.coordinate;
    
    if (self.currentLocationAnnotation) {
        [self.mapView removeAnnotation:self.currentLocationAnnotation];
    }
    self.currentLocationAnnotation = [[CurrentLocationAnnotation alloc] initWithCoordinate:currentCoordinate];
    [self.mapView addAnnotation:self.currentLocationAnnotation];
}
{% endhighlight %}
* When you add the current location annotation to map view, you can set the current location annotation view in mapView:viewForAnnotation: method. If `nil` is returned, a **red pin** will be use as the annotation view. **Question: How can we use the default blue circle as the annotation view, just as we set `showsUserLocation` to `YES`?**

* You can also get erroe message when app fails to get the location in `locationManager:didFailWithError:` method.
{%highlight objc linenos %}
- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    NSLog(@"didFailWithError: %@", error);
    UIAlertView *errorAlert = [[UIAlertView alloc] initWithTitle:@"Error" message:@"Failed to Get Your Location" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
    [errorAlert show];
}
{% endhighlight %}
Before implementing the above methods, set the `CLLocationManager`'s delegate confirm  with `CLLocationManagerDelegate` protoco.

## References

[reference:](http://nevan.net/2014/09/core-location-manager-changes-in-ios-8/)