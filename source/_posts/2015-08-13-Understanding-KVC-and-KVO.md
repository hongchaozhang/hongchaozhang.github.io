---
layout: post
comments: true
categories: [ios,objective-c]
title: Understanding KVC and KVO in Objective-C
---

Contents:

* [Description](#description)
* [KVC](#kvc)
* [KVO](#kvo)
* [Remove Observers](#remove_observers)



## <a name="description"></a>Description

In Cocoa, the Model-View-Controller pattern, a controller’s responsibility is to keep the view and the model synchronized. There are two parts to this: when the model object changes, the views have to be updated to reflect this change, and when the user interacts with controls, the model has to be updated accordingly.

Key-Value Observing helps us update the views to reflect changes to model objects. The controller can observe changes to those property values that the views depend on.

For more details, refer [Key-Value Coding and Observing](http://www.objc.io/issues/7-foundation/key-value-coding-and-observing/) from [objc.io](objc.io);

<!-- more -->

## <a name="kvc"></a>KVC

### Description

KVC, which means *NSKeyValueCoding*, is a protoco, and supplies accessors (getter and setter) for getting and setting property value. Only by using the KVC setter method to set the property value, can the sender send a message to the observer.

KVC has the following two getter methods: `valueForKey:` and `valueForKeyPath:`, two setter methods: `setValue:forKey:` and `setValue:forKeyPath:`.

### Sample code

Assume that `Person` class has two simple properties: `name` and `address` and a `Person` type property `spouse`. We have the following two pieces of code explaining the *Key* and *KeyPath*:

For *Key*:

```
void changeName(Person *p, NSString *newName)
{
    // using the KVC accessor (getter) method
    NSString *originalName = [p valueForKey:@"name"];
 
    // using the KVC  accessor (setter) method.
    [p setValue:newName forKey:@"name"];
 
    NSLog(@"Changed %@'s name to: %@", originalName, newName);
}
```

For *KeyPath*:

```
void logMarriage(Person *p)
{
    // just using the accessor again, same as example above
    NSString *personsName = [p valueForKey:@"name"];
 
    // this line is different, because it is using
    // a "key path" instead of a normal "key"
    NSString *spousesName = [p valueForKeyPath:@"spouse.name"];
 
    NSLog(@"%@ is happily married to %@", personsName, spousesName);
}
```

Actually, `[p valueForKeyPath:@"spouse.name"];` equals to `[[p valueForKey:@"spouse"] valueForKey:@"name"];`.

## <a name="kvo"></a>KVO

### Description

*Key Value Observer (KVO)* is based on KVC, and can observe the change of a property of another object.

KVO allows you to register as an observer of a given object and receive notification when specific properties on that object are changed. It’s an incredibly powerful capability, and it is built into Objective-C at its very core.

### Sample code

Implement `PersonWatcher` for observing a `Person` instance.

```
@implementation PersonWatcher

static NSString *const KVO_CONTEXT_ADDRESS_CHANGED = @"KVO_CONTEXT_ADDRESS_CHANGED";

-(id) init;
{
    if(self = [super init]){
        self.m_observedPeople = [NSMutableArray new];
    }
    
    return self;
}

// watch a person
-(void) watchPersonForChangeOfAddress:(Person *)p
{
    // this begins the observing
    [p addObserver:self
        forKeyPath:@"address"
           options:0
           context:CFBridgingRetain(KVO_CONTEXT_ADDRESS_CHANGED)];
    
    // keep a record of all the people being observed,
    // because we need to stop observing them in dealloc
    [self.m_observedPeople addObject:p];
}

// whenever an observed key path changes, this method will be called
- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context
{
    // use the context to make sure this is a change in the address,
    // because we may also be observing other things
    if(context == CFBridgingRetain(KVO_CONTEXT_ADDRESS_CHANGED)) {
        NSString *name = [object valueForKey:@"name"];
        NSString *address = [object valueForKey:@"address"];
        NSLog(@"%@ has a new address: %@", name, address);
    }
}

-(void) dealloc;
{ 
    // must stop observing everything before this object is
    // deallocated, otherwise it will cause crashes
    for(Person *p in self.m_observedPeople){
        [p removeObserver:self forKeyPath:@"address"];
    }
    
    self.m_observedPeople = nil;
}
```

## <a name="remove_observers"></a>Remove observer

Refer [here](http://stackoverflow.com/questions/6959896/kvo-and-arc-how-to-removeobserver)

You should stop observing the sender when observer is dealloced. If you fail to do this and then allow the observer to be deallocated, then future notifications to the observer may cause your application to crash.

So, remember to remove observers 

1. before observer is dealloced
2. before the sender is dealloced

For `#1`, just send `removeObserver:forKeyPath` message to the sender in the `-dealloc` function of the observer.
`-dealloc` function is called even in ARC mode. In `-dealloc`, just free non-object resources, or clean up tasks like removing observers. In `-dealloc` under ARC mode, you can not call `[super dealloc]`, as the compiller did it for you and this why there is an error if you call this manually.

> **Note:** `-dealloc` is not called in *garbage collection* mode.

For `#2`, the observer must know the life circle of the sender, and before the sender is freed, the observer must remove the observation from the sender. 