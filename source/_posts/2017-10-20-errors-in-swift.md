---
layout: post
title: "Swift中的Error"
date: 2017-10-20 16:24:35 +0800
comments: true
categories: [swift, ios]
published: true
---

<!-- more -->

<!-- TOC depthFrom:1 depthTo:3 insertAnchor:true -->

- [Swift Error基本使用](#swift-error基本使用)
    - [`throws` in Swift 1.x](#throws-in-swift-1x)
    - [`throws` in Swift 2](#throws-in-swift-2)
    - [`throws`的使用](#throws的使用)
    - [`throws`抛出错误的处理](#throws抛出错误的处理)
- [`throws`的一些实践](#throws的一些实践)
    - [`throws`的调试和断点](#throws的调试和断点)
    - [`throws`仍然存在的问题](#throws仍然存在的问题)
- [Swift 错误类型的种类](#swift-错误类型的种类)
    - [Simple domain error](#simple-domain-error)
    - [Recoverable error](#recoverable-error)
    - [Universal error](#universal-error)
    - [Logic failure](#logic-failure)
- [几种常见场景下的错误处理](#几种常见场景下的错误处理)
    - [app内资源加载](#app内资源加载)
    - [加载当前用户信息时发生错误](#加载当前用户信息时发生错误)
    - [还没有实现的代码](#还没有实现的代码)
    - [调用设备上的传感器收集数据](#调用设备上的传感器收集数据)
    - [总结](#总结)
- [错误处理相关的辅助方法](#错误处理相关的辅助方法)
    - [Use Custom Errors](#use-custom-errors)
    - [Do Cleanup Work Using `defer`](#do-cleanup-work-using-defer)
- [参考](#参考)

<!-- /TOC -->

<a id="markdown-swift-error基本使用" name="swift-error基本使用"></a>
## Swift Error基本使用

<a id="markdown-throws-in-swift-1x" name="throws-in-swift-1x"></a>
### `throws` in Swift 1.x

在Objective-C中，`FileManager`的copy接口如下：

```
- (BOOL)copyItemAtPath:(NSString *)srcPath toPath:(NSString *)dstPath error:(NSError **)error
```

调用该方法时，写法如下：

```
NSFileManager *fileManager = [NSFileManager defaultManager];
NSError *error;
[fileManager copyItemAtPath:srcPath toPath:toPath error:&error];
if (error) {
    // 发生了错误
} else {
    // 复制成功
}
```

在Swift 1.x中，与Objective-C类似。方法接口如下：

```
func copyItemAtPath(_ srcPath: String, toPath dstPath: String, error: NSErrorPointer)
```

使用方法如下：

```
let fileManager = NSFileManager.defaultManager()
var error: NSError?
fileManager.copyItemAtPath(srcPath, toPath: dstPath, error: &error)
if error != nil {
    // 发生了错误
} else {
    // 复制成功
}
```

在上面的例子中，因为这个 API 仅会在极其特定的条件下 (比如磁盘空间不足) 会出错，所以开发者为了方便，有时会直接传入 nil 来忽视掉这个错误：

```
let fileManager = NSFileManager.defaultManager()
// 不关心是否发生错误
fileManager.copyItemAtPath(srcPath, toPath: dstPath, error: nil)
```

<a id="markdown-throws-in-swift-2" name="throws-in-swift-2"></a>
### `throws` in Swift 2

这种做法无形中降低了应用的可靠性以及从错误中恢复的能力。为了解决这个问题，Swift 2 中在编译器层级就对`throws`进行了限定。上面提到的copy接口在Swift 2中的形式为：

```
func copyItem(atPath srcPath: String, toPath dstPath: String) throws
```

被标记为`throws`的API，必须被处理，否则编译器就会报错。这就在编译器层面对错误的处理进行了强制执行，保证了代码的可靠性。

<a id="markdown-throws的使用" name="throws的使用"></a>
### `throws`的使用

下面是包含`throws`的一个自动售货机实现：

```
enum VendingMachineError: Error {
    case invalidSelection
    case insufficientFunds(coinsNeeded: Int)
    case outOfStock
}

struct Item {
    var price: Int
    var count: Int
}

class VendingMachine {
    var inventory = [
        "Candy Bar": Item(price: 12, count: 7),
        "Chips": Item(price: 10, count: 4),
        "Pretzels": Item(price: 7, count: 11)
    ]
    var coinsDeposited = 0

    func vend(itemNamed name: String) throws {
        guard let item = inventory[name] else {
            throw VendingMachineError.invalidSelection
        }

        guard item.count > 0 else {
            throw VendingMachineError.outOfStock
        }

        guard item.price <= coinsDeposited else {
            throw VendingMachineError.insufficientFunds(coinsNeeded: item.price - coinsDeposited)
        }

        coinsDeposited -= item.price

        var newItem = item
        newItem.count -= 1
        inventory[name] = newItem

        print("Dispensing \(name)")
    }
}

```

`vend(itemNamed:)`方法的实现通过`guard`抛出购买过程中相应的错误。

<a id="markdown-throws抛出错误的处理" name="throws抛出错误的处理"></a>
### `throws`抛出错误的处理
被标记为`throws`的API，我们必须采用下面几种处理方式中的一种来处理，否则，编译器会报错。

#### `do catch`

```
var vendingMachine = VendingMachine()
vendingMachine.coinsDeposited = 8
do {
    try buyFavoriteSnack(person: "Alice", vendingMachine: vendingMachine)
} catch VendingMachineError.invalidSelection {
    print("Invalid Selection.")
} catch VendingMachineError.outOfStock {
    print("Out of Stock.")
} catch VendingMachineError.insufficientFunds(let coinsNeeded) {
    print("Insufficient funds. Please insert an additional \(coinsNeeded) coins.")
}
```

#### `try?`

使用`try?`来处理错误，将其返回值变为Optional：如果在执行过程中出现错误，接口返回`nil`，同时错误停止继续传播。比如：

```
func fetchDataFromDisk() throws -> Data

func fetchDataFromServer() throws -> Data

func fetchData() -> Data? {
    if let data = try? fetchDataFromDisk() { 
        return data 
    }
    if let data = try? fetchDataFromServer() { 
        return data 
    }
    return nil
}

```

#### `try!`

如果你非常确信一个被标记为`throws`的接口，在你的环境中不会抛出错误，可以通过`try!`来强制终止错误的继续传播。如果在执行的时候出现了错误，那么抛出运行时错误，导致程序崩溃。

比如，`loadImage(atPath:)`方法加载指定目录下面的一张图片到内存中，如果加载异常，会抛出错误。在下面的使用中，我们希望加载一张应用中包含的图片，这种情况下，可以通过`try!`来终止错误的继续传播。

```
let photo = try! loadImage(atPath: "./Resources/John Appleseed.jpg")

```

#### `try`

也可以直接使用`try`来调用被标记为`throws`的接口，但是这种情况下，错误会继续传播，包含该调用的方法也必须被标记为`throws`才行，否则，编译器会报错。

```
let favoriteSnacks = [
    "Alice": "Chips",
    "Bob": "Licorice",
    "Eve": "Pretzels",
]
func buyFavoriteSnack(person: String, vendingMachine: VendingMachine) throws {
    let snackName = favoriteSnacks[person] ?? "Candy Bar"
    try vendingMachine.vend(itemNamed: snackName)
}
```

在这个例子中，因为`buyFavoriteSnack(person: vendingMachine:)`使用`try`调用了一个被标记为throws的接口`vend(itemNamed:)`，错误会继续传播，因此，该方法也需要标记为thorws。

<a id="markdown-throws的一些实践" name="throws的一些实践"></a>
## `throws`的一些实践

<a id="markdown-throws的调试和断点" name="throws的调试和断点"></a>
### `throws`的调试和断点

Swift的错误抛出并不是传统意义的exception，在调试时抛出错误并不会触发Exception断点。另外，throw本身是语言的关键字，而不是一个symbol，它也不能触发Symbolic类型的断点。如果我们希望在所有throw语句执行的时候让程序停住的话，需要一些额外的技巧。在之前 throw 的汇编实现中，可以看到所有throw语句在返回前都会进行一次`swift_willThrow`的调用，这就是一个有效的 Symbolic语句，我们设置一个`swift_willThrow`的Symbolic断点，就可以让程序在throw的时候停住，并使用调用栈信息来获知程序在哪里抛出了错误。

补充，在最新版本的Xcode中，Apple直接为我们在断点类型中加上了 “Swift Error Breakpoint”的选项，它背后做的就是在`swift_willThrow`上添加一个断点。不过因为有了更直接的方法，我们现在不再需要手动去添加这个符号断点了。我们可以通过设置“Swift Error Breakpoint”对throws进行断点设置和调试。设置方法如下：

![swift error breakpoint](/images/Swift-Error-Breakpoint.png)

<a id="markdown-throws仍然存在的问题" name="throws仍然存在的问题"></a>
### `throws`仍然存在的问题

不能从接口直接看出有哪些可能抛出的Error，必须看Document才行，带来了一些不便。比如，只通过接口：

```
func vend(itemNamed name: String) throws
```

我们没有办法知道这个接口可能返回哪些错误。此时，要么阅读文档，获得确切的抛出错误，分别进行处理；或者将所有的错误统一处理如下：

```
do {
    let snackName = favoriteSnacks[person] ?? "Candy Bar"
    try vendingMachine.vend(itemNamed: snackName)
} catch {
    // 错误抛出
}
```

<a id="markdown-swift-错误类型的种类" name="swift-错误类型的种类"></a>
## Swift 错误类型的种类

参考Swift官方文档[Error Handling in Swift<!-- 2.0-->](https://github.com/apple/swift/blob/master/docs/ErrorHandling.rst)，Swift中的错误有下面四种：

1. Simple domain error
2. Recoverable error
3. Universal error
4. Logic failure

<a id="markdown-simple-domain-error" name="simple-domain-error"></a>
### Simple domain error

简单的，显而易见的错误。这类错误的最大特点是我们不需要知道原因，只需要知道错误发生，并且想要进行处理。用来表示这种错误发生的方法一般就是返回一个`nil`值。在Swift中，这类错误最常见的情况就是将某个字符串转换为整数，或者在字典尝试用某个不存在的 key 获取元素：

```
// Simple Domain Error 的例子
let num = Int("hello world") // nil
let element = dic["key_not_exist"] // nil
```

**可能出现这种错误的接口，不需要使用`throws`来标记，只需要将接口的返回类型设置为Optional即可。**在使用层面 (或者说应用逻辑) 上，这类错误一般用`if let`的可选值绑定或者是`guard let`提前进行返回处理即可。

<a id="markdown-recoverable-error" name="recoverable-error"></a>
### Recoverable error

正如其名，这类错误应该是被容许，并且是可以恢复的。可恢复错误的发生是正常的程序路径之一，而作为开发者，我们应当去检出这类错误发生的情况，并进一步对它们进行处理，让它们恢复到我们期望的程序路径上。

**这类错误在Objective-C的时代通常用NSError类型来表示，而在Swift里则是通过throws来实现。**一般我们需要检查错误的类型，并作出合理的响应。而选择忽视这类错误往往是不明智的，因为它们是用户正常使用过程中可能会出现的情况，我们应该尝试对其恢复，或者至少向用户给出合理的提示，让他们知道发生了什么。像是网络请求超时，或者写入文件时磁盘空间不足：

```
// 网络请求
let url = URL(string: "https://www.example.com/")!
let task = URLSession.shared.dataTask(with: url) { data, response, error in
    if let error = error {
        // 提示用户
        self.showErrorAlert("Error: \(error.localizedDescription)")
    }
    let data = data!
    // ...
}

// 写入文件
func write(data: Data, to url: URL) {
    do {
        try data.write(to: url)
    } catch let error as NSError {
        if error.code == NSFileWriteOutOfSpaceError {
            // 尝试通过释放空间自动恢复
            removeUnusedFiles()
            write(data: data, to: url)
        } else {
            // 其他错误，提示用户
            showErrorAlert("Error: \(error.localizedDescription)")
        }
    } catch {
        showErrorAlert("Error: \(error.localizedDescription)")
    }
}
```

<a id="markdown-universal-error" name="universal-error"></a>
### Universal error

这类错误理论上可以恢复，但是由于语言本身的特性所决定，我们难以得知这类错误的来源，所以一般来说也不会去处理这种错误。这类错误包括类似下面这些情形：

```
// 内存不足
[Int](repeating: 100, count: .max)

// 调用栈溢出
func foo() { foo() }
foo()
```

我们可以通过设计一些手段来对这些错误进行处理，比如：检测当前的内存占用并在超过一定值后警告，或者监视栈frame数进行限制等。但是一般来说这是不必要的，也不可能涵盖全部的错误情况。更多情况下，这是由于代码触碰到了设备的物理限制和边界情况所造成的，一般我们也不去进行处理（除非是人为造成的bug）。

在 Swift 中，各种被使用`fatalError`进行强制终止的错误一般都可以归类到 Universal error。

<a id="markdown-logic-failure" name="logic-failure"></a>
### Logic failure

逻辑错误是程序员的失误所造成的错误，它们应该在开发时通过代码进行修正并完全避免，而不是等到运行时再进行恢复和处理。

常见的 Logic failure 包括有：

```
// 强制解包一个 `nil` 可选值
var name: String? = nil
name!

// 数组越界访问
let arr = [1,2,3]
let num = arr[3]

// 计算溢出
var a = Int.max
a += 1

// 强制 try 但是出现错误
try! JSONDecoder().decode(Foo.self, from: Data())
```

这类错误在实现中触发的一般是`assert`或者`precondition`。

和`fatalError`不同，`assert`只在进行编译优化的`-O`配置下是不触发的，而如果更进一步，将编译优化选项配置为`-Ounchecked`的话，`precondition`也将不触发。此时，各方法中的`precondition`将被跳过，因此我们可以得到最快的运行速度。但是相对地代码的安全性也将降低，因为对于越界访问或者计算溢出等错误，我们得到的将是不确定的行为。

函数 | fatalError | precondition | assert
--- | --- | --- | --- 
-Onone | 触发 | 触发 | 触发
-O | 触发 | 触发 | -
-Ounchecked | 触发 | - | -

对于Universal error一般使用`fatalError`，而对于`Logic failure`一般使用`assert`或者`precondition`。遵守这个规则会有助于我们在编码时对错误进行界定。而有时候我们也希望能尽可能多地在开发的时候捕获Logic failure，而在产品发布后尽量减少crash比例。这种情况下，相比于直接将Logic failure转换为可恢复的错误，我们最好是使用`assert`在内部进行检查，来让程序在开发时崩溃。

<a id="markdown-几种常见场景下的错误处理" name="几种常见场景下的错误处理"></a>
## 几种常见场景下的错误处理

光说不练假把式。让我们来实际判断一下下面这些情况下我们都应该选择用哪种错误处理方式吧~

<a id="markdown-app内资源加载" name="app内资源加载"></a>
### app内资源加载
假设我们在处理一个机器学习的模型，需要从磁盘读取一份预先训练好的模型。该模型以文件的方式存储在 app bundle 中，如果读取时没有找到该模型，我们应该如何处理这个错误？

#### 方案 1 Simple domain error

```
func loadModel() -> Model? {
    guard let path = Bundle.main.path(forResource: "my_pre_trained_model", ofType: "mdl") else {
        return nil
    }
    let url = URL(fileURLWithPath: path)
    guard let data = try? Data(contentOf: url) else {
        return nil
    }
    
    return try? ModelLoader.load(from: data)
}
```

#### 方案 2 Recoverable error

```
func loadModel() throws -> Model {
    guard let path = Bundle.main.path(forResource: "my_pre_trained_model", ofType: "mdl") else {
        throw AppError.FileNotExisting
    }
    let url = URL(fileURLWithPath: path)
    let data = try Data(contentOf: url)
    return try ModelLoader.load(from: data)
}
```

#### 方案 3 Universal error

```
func loadModel() -> Model {
    guard let path = Bundle.main.path(forResource: "my_pre_trained_model", ofType: "mdl") else {
        fatalError("Model file not existing")
    }
    let url = URL(fileURLWithPath: path)
    do {
        let data = try Data(contentOf: url)
        return try ModelLoader.load(from: data)
    } catch {
        fatalError("Model corrupted.")
    }
}
```

#### 方案 4 Logic failure

```
func loadModel() -> Model {
    let path = Bundle.main.path(forResource: "my_pre_trained_model", ofType: "mdl")!
    let url = URL(fileURLWithPath: path)
    let data = try! Data(contentOf: url)
    return try! ModelLoader.load(from: data)
}
```

<details> 
  <summary>*点击查看答案*</summary>
   
正确答案应该是方案 4，使用Logic failure让代码直接崩溃。

作为内建的存在于app bundle中模型或者配置文件，如果不存在或者无法初始化，在不考虑极端因素的前提下，一定是开发方面出现了问题，这不应该是一个可恢复的错误，无论重试多少次结果肯定是一样的。也许是开发者忘了将文件放到合适的位置，也许是文件本身出现了问题。不论是哪种情况，我们都会希望尽早发现并强制我们修正错误，而让代码崩溃可以很好地做到这一点。

使用Universal error同样可以让代码崩溃，但是Universal error更多是用在语言的边界情况下。而这里并非这种情况。
</details>

<a id="markdown-加载当前用户信息时发生错误" name="加载当前用户信息时发生错误"></a>
### 加载当前用户信息时发生错误

我们在用户登录后会将用户信息存储在本地，每次重新打开app时我们检测并使用用户信息。当用户信息不存在时，应该进行的处理：

#### 方案 1 Simple domain error

```
func loadUser() -> User? {
    let username = UserDefaults.standard.string(forKey: "com.onevcat.app.defaults.username")
    if let username {
        return User(name: username)
    } else {
        return nil
    }
}
```

#### 方案 2 Recoverable error

```
func loadUser() throws -> User {
    let username = UserDefaults.standard.string(forKey: "com.onevcat.app.defaults.username")
    if let username {
        return User(name: username)
    } else {
        throws AppError.UsernameNotExisting
    }
}
```

#### 方案 3 Universal error

```
func loadUser() -> User {
    let username = UserDefaults.standard.string(forKey: "com.onevcat.app.defaults.username")
    if let username {
        return User(name: username)
    } else {
        fatalError("User name not existing")
    }
}
```

#### 方案 4 Logic failure

```
func loadUser() -> User {
    let username = UserDefaults.standard.string(forKey: "com.onevcat.app.defaults.username")
    return User(name: username!)
}
```

<details> 
  <summary>*点击查看答案*</summary>
   
首先肯定排除方案3和4。“用户名不存在”是一个正常的现象，肯定不能直接crash。所以我们应该在方案1和方案2中选择。

对于这种情况，选择方案1 Simple domain error会更好。因为用户信息不存在是很简单的一个状况，如果用户不存在，那么我们直接让用户登录即可，这并不需要知道额外的错误信息，返回`nil`就能够很好地表达意图了。

当然，我们不排除今后随着情况越来越复杂，会需要区分用户信息缺失的原因 (比如是否是新用户还没有注册，还是由于原用户注销等)。但是在当前的情况下来看，这属于过度设计，暂时并不需要考虑。如果之后业务复杂到这个程度，在编译器的帮助下将Simple domain error修改为Recoverable error也不是什么难事儿。
</details>


<a id="markdown-还没有实现的代码" name="还没有实现的代码"></a>
### 还没有实现的代码

假设你在为你的服务开发一个iOS框架，但是由于工期有限，有一些功能只定义了接口，没有进行具体实现。这些接口会在正式版中完成，但是我们需要预先发布给友商内测。所以除了在文档中明确标明这些内容，这些方法内部应该如何处理呢？

#### 方案 1 Simple domain error

```
func foo() -> Bar? {
    return nil
}
```

#### 方案 2 Recoverable error

```
func foo() throws -> Bar? {
    throw FrameworkError.NotImplemented
}
```

#### 方案 3 Universal error

```
func foo() -> Bar? {
    fatalError("Not implemented yet.")
}
```

#### 方案 4 Logic failure

```
func foo() -> Bar? {
    assertionFailure("Not implemented yet.")
    return nil
}
```

<details> 
  <summary>*点击查看答案*</summary>
   
正确答案是方案3 Universal error。对于没有实现的方法，返回`nil`或者抛出错误期待用户恢复都是没有道理的，这会进一步增加框架用户的迷惑。这里的问题是语言层面的边界情况，由于没有实现，我们需要给出强力的提醒。在任意build设定下，都不应该期待用户可以成功调用这个函数，所以`fatalError`是最佳选择。

其实在swift继承的时候，编译器会给我们添加一个默认的未实现的接口：

```
required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
}
```
</details>


<a id="markdown-调用设备上的传感器收集数据" name="调用设备上的传感器收集数据"></a>
### 调用设备上的传感器收集数据

调用传感器的app最有意思了！不管是相机还是陀螺仪，传感器相关的app总是能带给我们很多乐趣。那么，如果想要调用传感器获取数据时，发生了错误，应该怎么办呢？

#### 方案 1 Simple domain error

```
func getDataFromSensor() -> Data? {
    let sensorState = sensor.getState()
    guard sensorState == .normal else {
        return nil
    }
    return try? sensor.getData()
}
```

#### 方案 2 Recoverable error
```
func getDataFromSensor() throws -> Data {
    let sensorState = sensor.getState()
    guard sensorState == .normal else {
        throws SensorError.stateError
    }
    return try sensor.getData()
}
```

#### 方案 3 Universal error

```
func loadUser() -> Data {
    let sensorState = sensor.getState()
    guard sensorState == .normal, let data = try? sensor.getData() else {
        fatalError("Sensor get data failed!")
    }
    return data
}
```

#### 方案 4 Logic failure

```
func loadUser() -> Data {
    let sensorState = sensor.getState()
    assert(sensorState == .normal, "The sensor state is not normal")
    return try! sensor.getData()
}
```

<details> 
  <summary>*点击查看答案*</summary>
   
传感器由于种种原因暂时不能使用 (比如正在被其他进程占用，或者甚至设备上不存在对应的传感器)，是很有可能发生的情况。即使这个传感器的数据对应用是至关重要，不可或缺的，我们可能也会希望至少能给用户一些提示。基于这种考虑，使用方案2 Recoverable error是比较合理的选择。

方案1在传感器数据无关紧要的时候可能也会是一个更简单的选项。但是方案3和4会直接让程序崩溃，而且这实际上也并不是代码边界或者开发者的错误，所以不应该被考虑。
</details>


<a id="markdown-总结" name="总结"></a>
### 总结

可以看到，其实在错误处理的时候，选用哪种错误是根据情景和处理需求而定的，我在参考答案也使用了很多诸如“可能”，“相较而言”等语句。虽然对于特定的场景，我们可以进行直观的考虑和决策，但这并不是教条主义般的一成不变。错误类型之间可以很容易地通过代码互相转换，这让我们在处理错误的时候可以自由选择使用的策略：比如API即使提供给我们的是Recoverable的throws形式，我们也还是可以按照需要，通过`try?`将其转为Simple domain error，或者用`try!`将其转为Logic failure。

能切实理解使用情景，利用这些错误类型转换的方式，灵活选取使用场景下最合适的错误类型，才能说是真正理解了这四种错误的分类依据。


<a id="markdown-错误处理相关的辅助方法" name="错误处理相关的辅助方法"></a>
## 错误处理相关的辅助方法

For custom errors in swift, refer to [Error](https://developer.apple.com/documentation/swift/error) official document.


<a id="markdown-use-custom-errors" name="use-custom-errors"></a>
### Use Custom Errors

#### Using Enumerations as Errors

Swift’s enumerations are well suited to represent simple errors. Create an enumeration that conforms to the Error protocol with a case for each possible error. If there are additional details about the error that could be helpful for recovery, use associated values to include that information.

The following example shows an IntParsingError enumeration that captures two different kinds of errors that can occur when parsing an integer from a string: overflow, where the value represented by the string is too large for the integer data type, and invalid input, where nonnumeric characters are found within the input.

```
enum IntParsingError: Error {
    case overflow
    case invalidInput(String)
}
```

#### Including More Data in Errors

The following XMLParsingError conforms to Error and supply line and column position of the error.

```
struct XMLParsingError: Error {
    enum ErrorKind {
        case invalidCharacter
        case mismatchedTag
        case internalError
    }

    let line: Int
    let column: Int
    let kind: ErrorKind
}

func parse(_ source: String) throws -> XMLDoc {
    // ...
    throw XMLParsingError(line: 19, column: 5, kind: .mismatchedTag)
    // ...
}
```

Here’s how you can catch any XMLParsingError errors thrown by the parse(_:) function:

```
do {
    let xmlDoc = try parse(myXMLData)
} catch let e as XMLParsingError {
    print("Parsing error: \(e.kind) [\(e.line):\(e.column)]")
} catch {
    print("Other error: \(error)")
}

// Prints "Parsing error: mismatchedTag [19:5]"
```

<a id="markdown-do-cleanup-work-using-defer" name="do-cleanup-work-using-defer"></a>
### Do Cleanup Work Using `defer`

You use a `defer` statement to execute a set of statements just before code execution leaves the current block of code. This statement lets you do any necessary cleanup that should be performed regardless of how execution leaves the current block of code—whether it leaves because an error was thrown or because of a statement such as `return` or `break`. For example, you can use a `defer` statement to ensure that file descriptors are closed and manually allocated memory is freed.

```
func processFile(filename: String) throws {
    if exists(filename) {
        let file = open(filename)
        defer {
            close(file)
        }
        while let line = try file.readline() {
            // Work with the file.
        }
        // close(file) is called here, at the end of the scope.
    }
}

func vend(itemNamed name: String) throws {
    
    defer {
        // do some clean work
    }
    
    guard let item = inventory[name] else {
        throw VendingMachineError.invalidSelection
    }
    
    guard item.count > 0 else {
        throw VendingMachineError.outOfStock
    }
    
    guard item.price <= coinsDeposited else {
        throw VendingMachineError.insufficientFunds(coinsNeeded: item.price - coinsDeposited)
    }
    
    coinsDeposited -= item.price
    var newItem = item
    newItem.count -= 1
    inventory[name] = newItem
    
    print("Dispensing \(name)")
}
```

The above example uses a `defer` statement to ensure that the `open(_:)` function has a corresponding call to `close(_:)`.

<a id="markdown-参考" name="参考"></a>
## 参考

1. [关于 Swift Error 的分类](https://onevcat.com/2017/10/swift-error-category/)
2. [Swift 2 throws 全解析 - 从原理到实践](https://onevcat.com/2016/03/swift-throws/)
3. [Error Handling Official Site](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/ErrorHandling.html#//apple_ref/doc/uid/TP40014097-CH42-ID508)
4. [Error from Apple Document](https://developer.apple.com/documentation/swift/error)
