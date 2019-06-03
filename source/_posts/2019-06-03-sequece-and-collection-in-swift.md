---
layout: post
title: "Sequece and Collection in Swift"
date: 2019-06-03 16:22:33 +0800
comments: true
categories: [ios, swift]
---

<!-- more -->

The content comes from the following posts:

1. [Swift Sequences](https://medium.com/swift-programming/swift-sequences-ce22d76f120c)
2. [Swift Collections](https://medium.com/swift-programming/swift-collections-e5fff3cd6759)

But some of the code inside is old and can't be compiled with swift 5.0. So rewritten the code using swift 5.0.

## `Array` out of Range Crash

Before diving into Swift Sequences, let’s see a strange behavior.

```swift
let array = [1, 2, 3]
array[7] 😭

let dic = ["a": 1, "b": 2]
dic["z"] 😎

🤔
```

In other words, when requesting an element that doesn’t exist, why arrays crash whereas dictionaries don’t?

Arrays and dictionaries are two base collections provided by the Swift standard library. We can access those collections elements through the [] notation, also known as subscript. Let’s see how those subscripts are defined.

```swift
struct Array<Element> {
    subscript(index: Int) -> Element
}

struct Dictionary<Key: Hashable, Value> {
    subscript(key: Key) -> Value?
}
```

What’s interesting is that arrays have a non optional return type. Subscript can’t throw errors so there are no alternatives other than a fatalError if we request an index that doesn’t exist.

For dictionaries, on the other hand, an optional Value is returned, which allows to gracefully return nil if the index doesn’t exist.

We can adopt dictionaries safer approach by overloading the arrays subscript — we can’t override them. Adding an external name to the parameter is enough.

```swift
extension Array {
    subscript(safe index: Int) -> Element? {
        return index >= 0 && index < count ? self[index] : nil
    }
}
```

We saw how we can create a new accessor to the elements of an array, but can we do the same with a homemade collection?

## Homemade collection

```swift
struct Section<T> {
    let title: String
    let elements: [T]
}
```

Internally, this ‘collection’ is based on an array. This is an implementation detail for the simplicity of the example. We could have used a linked list as in this [excellent article](http://austinzheng.com/2015/01/24/swift-seq/) by [Austin Zheng](https://twitter.com/austinzheng).

Creating a subscript on our collection is very easy, we can even reuse the array’s extension we made earlier.

```swift
struct Section<T> {
    let title: String
    let elements: [T]
    
    subscript(safe index: Int) -> T? {
        return elements[safe: index]
    }
}
```

An example in practice :

```swift
let cars = ["911", "Cayman", "Cayenne"]
let section = Section(title: "Porsche", elements: cars)

section[1]
// Optional("Cayman")
```

Great! But does that make our type a collection, as Swift defines it?

## Sequences

When it comes to manipulating sets, the most abstract notion given by the standard library is the Sequence, defined as

> A type that can be iterated with a `for…in` loop.

### How to Conform to `Sequence` Protocol

This section is from [Sequece official site](https://developer.apple.com/documentation/swift/sequence).

Making your own custom types conform to Sequence enables many useful operations, like for-in looping and the contains method, without much effort. To add Sequence conformance to your own custom type, add a makeIterator() method that returns an iterator.

Alternatively, if your type can act as its own iterator, implementing the requirements of the IteratorProtocol protocol and declaring conformance to both Sequence and IteratorProtocol are sufficient.

Here’s a definition of a Countdown sequence that serves as its own iterator. The makeIterator() method is provided as a default implementation.

```swift
struct Countdown: Sequence, IteratorProtocol {
    var count: Int

    mutating func next() -> Int? {
        if count == 0 {
            return nil
        } else {
            defer { count -= 1 }
            return count
        }
    }
}

let threeToGo = Countdown(count: 3)
for i in threeToGo {
    print(i)
}
// Prints "3"
// Prints "2"
// Prints "1"
```

### Make our `Section` Conform to `Sequence` Protocol

The `Section` struct can't act as its own iterator, we need to define an iterator for it, and then return an instance of the defined iterator inside `func makeIterator() -> Section<T>.Iterator` method.

```swift
struct Section<T>: Sequence {
    let title: String
    let elements: [T]

    subscript(safe index: Int) -> T? {
        return elements[safe: index]
    }

    struct Iterator: IteratorProtocol {
        let array: [T]
        var currentIndex = 0

        init (_ array: [T]) {
            self.array = array
        }

        mutating func next() -> T? {
            let tempIndex = currentIndex
            currentIndex += 1
            return array[safe: tempIndex]

        }
    }

    func makeIterator() -> Section<T>.Iterator {
        return Iterator(elements)
    }
}
```

### Gifts

Is that all? No! By conforming to SequenceType we also get methods for free, here is some of them.

```swift
section.min()
// 911
section.max()
// Cayman
section.sorted()
// ["911", "Cayenne", "Cayman"]
section.contains("911")
// true
```

We get the min, max & sort methods because the elements of our sequence, String in our case, are Comparable. Contains is available thanks to our elements being Equatable.

```swift
section.filter { $0.count > 3 }
// ["Cayman", "Cayenne"]
section.map { $0.count }
// [3, 6, 7]
section.reduce(0) { $0 + $1.count }
// 16
```

And for functional programming fans, filter, map and reduce are also given.

## Collections

Sequence is the most basic set notion given by the Swift standard library. There is a more evolved one.

A collection is defined as follow :

> A multi-pass *sequence* with addressable positions

As we saw previously, a sequence is a type that can be iterated with a `for…in` loop. It doesn’t need that the elements might be iterated over several times. And it doesn’t need that we give a way to access directly an element.

Collections require those last two points. As a side effect, it no longer allows us to have an infinite number of elements.

To be a collection, a type must conform to the `Collection` protocol.

### How to Conform to `Collection` Protocol

This section comes from [Collection official site](https://developer.apple.com/documentation/swift/collection).

If you create a custom sequence that can provide repeated access to its elements, make sure that its type conforms to the Collection protocol in order to give a more useful and more efficient interface for sequence and collection operations. To add Collection conformance to your type, you must declare at least the following requirements:

1. The `startIndex` and `endIndex` properties
2. A subscript that provides at least read-only access to your type’s elements
3. The `index(after:)` method for advancing an index into your collection
4. Conform to `Sequece` Protocol, as `Collection` is inherited from `Sequence`

### Make our `Section` Conform to `Collection` Protocol

```swift
struct Section<T>: Collection {
    let title: String
    let elements: [T]

    // begin: required for Collection
    var startIndex: Int { return 0 }
    var endIndex: Int { return elements.count }

    func index(after i: Int) -> Int {
        return i + 1
    }

    subscript(index: Int) -> T {
        return elements[index]
    }
    // end: required for Collection


    subscript(safe index: Int) -> T? {
        return elements[safe: index]
    }


    // begin: required for Sequence
    struct Iterator: IteratorProtocol {
        let array: [T]
        var currentIndex = 0

        init (_ array: [T]) {
            self.array = array
        }

        mutating func next() -> T? {
            let tempIndex = currentIndex
            currentIndex += 1
            return array[safe: tempIndex]

        }
    }

    func makeIterator() -> Section<T>.Iterator {
        return Iterator(elements)
    }
    // end: required for Sequence
}
```

The `endIndex` has to be after the last element. It allows to define an empty collection with `startIndex` = `endIndex`.

Like conforming to `Sequence`, we get some methods / properties for free:

```swift
section.count
// 3
section.first
// 911
section.isEmpty
// false
section.index(of: "911")
// 0
```

We get indexOf thanks to our Elements being Equatable.

## Difference between `Array` and `Collection`

We created our own collection, which is great, but what about that difference of behavior between Arrays and Dictionaries we talked about at the beginning of the post? We saw that Array’s dangerous subscript was coming from the Indexable protocol, but what about Dictionaries?

Dictionaries, like Arrays, are a collection, as Swift defines it. They both conform to CollectionType. So Dictionaries are also required to provide an ‘unsafe’ subscript that takes an Index and returns a non optional Element. The one we’re used to is just a convenience subscript.

A simple example shows that it is also really easy to get a crash with Dictionaries.

```swift
let dic = ["a": "bmw", "b": "audi", "c": "citroen"]

var index = dic.startIndex
dic[index]
// (key: "c", value: "citroen")

index = dic.index(after: index)
print(dic[index])
// (key: "b", value: "audi")

index = dic.index(after: index)
index = dic.index(after: index)
dic[index]
// Fatal error
```

**The last question that remains is why `Collection` requires a subscript that may crash? Simply for performance reason, it costs too much to check the validity of the given index. Crashing is faster :)**

## Reference

1. [Swift Sequences](https://medium.com/swift-programming/swift-sequences-ce22d76f120c)
2. [Swift Collections](https://medium.com/swift-programming/swift-collections-e5fff3cd6759)