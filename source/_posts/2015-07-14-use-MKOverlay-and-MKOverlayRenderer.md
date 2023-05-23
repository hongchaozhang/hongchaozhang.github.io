---
layout: post
comments: true
categories: [ios]
title: Use MKOverlay and MKOverlayRenderer
---

###MKOverlay

Write your own overlay class (for example, `MapOverlay`) confirm to `MKOverlay`, synthesize `coordinate` and `boundingMapRect`, so that we can assign value to them while initializing it.

Note that the type of `coordinate` is `CLLocationCoordinate2D` with `latitude` and `longitude`, while `boundingMapRect` is `MKMapRect`. And we need to use `MKMapPointForCoordinate` method to convert a `CLLocationCoordinate2D` type data to `MKMapPoint` type data. If we assign the `CLLocationCoordinate2D` data directly to `boundingMapRect`, the overlay will be too small to draw, and the `mapView:rendererForOverlay:` method will not be called at all. It is very hard for debugging.

<!-- more -->
Sample code: 
```objc
@implementation MapOverlay

@synthesize coordinate;
@synthesize boundingMapRect;

- (instancetype)init
{
    self = [super init];
    if (self) {
        CGFloat radius = 10.0;
        CLLocationCoordinate2D coords = CLLocationCoordinate2DMake(37.0, -111.0);
        coordinate = CLLocationCoordinate2DMake(coords.latitude, coords.longitude);
        
        MKMapPoint startMapPoint = MKMapPointForCoordinate(CLLocationCoordinate2DMake(coords.latitude - radius, coords.longitude - radius));
        MKMapPoint endMapPoint = MKMapPointForCoordinate(CLLocationCoordinate2DMake(coords.latitude + radius, coords.longitude + radius));
        boundingMapRect = MKMapRectMake(startMapPoint.x, startMapPoint.y, fabs(endMapPoint.x - startMapPoint.x), fabs(endMapPoint.y - startMapPoint.y));
    }

	return self;
}

@end
```


###MKOverlayRenderer

Write your own overlay renderer class (for example, `MapOverlayRenderer`) confirm to `MKOverlayRenderer`, and implement `drawMapRect:zoomScale:inContext:` method.

Sample code:
```objc
- (void)drawMapRect:(MKMapRect)mapRect zoomScale:(MKZoomScale)zoomScale inContext:(CGContextRef)context
{
    MKMapRect overlayMapRect = self.overlay.boundingMapRect;
    CGRect drawRect = [self rectForMapRect:overlayMapRect];
    CGContextSetRGBFillColor(context, 0, 0, 1, 0.4);
    CGContextFillRect(context, drawRect);
}
```

###Interact with MKMapView

After you implement your overlay and overlay renderer, implement `mapView:redererForOverlay` method in your map view's delegate. In this method, you need to return an instance of your own overlay renderer, initialized with the given overlay.

Sample code:
```objc
- (MKOverlayRenderer *)mapView:(MKMapView *)mapView rendererForOverlay:(id<MKOverlay>)overlay
{
    if ([overlay isKindOfClass:[MapOverlay class]]) {
        MapOverlayRenderer *overlayRenderer = [[MapOverlayRenderer alloc] initWithOverlay:overlay];
        
        return overlayRenderer;
    }
    
    return nil;
}
```
Then, we can add overlay instance to the map view through `addOverlay` or `addOverlays` methods.

Sample code:
```objc
MapOverlay *overlay = [[MapOverlay alloc] init];
[self.mapView addOverlay:overlay level:MKOverlayLevelAboveLabels];
```
	