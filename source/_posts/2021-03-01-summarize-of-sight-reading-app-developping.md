---
layout: post
title: "SightReading(视奏)应用开发知识点总结"
date: 2021-03-01 14:39:00 +0800
comments: true
categories: [ios, swift, objective-c]
---

<!-- more -->

<!-- TOC -->

- [数据持久化](#数据持久化)
    - [文件的保存和读取](#文件的保存和读取)
    - [NSDefault：保存标签信息](#nsdefault保存标签信息)
    - [参考](#参考)
- [播放节拍器声音](#播放节拍器声音)
    - [通过AVFoundation播放声音](#通过avfoundation播放声音)
    - [节拍器音量调节](#节拍器音量调节)
- [navigationController的使用和数据的传递](#navigationcontroller的使用和数据的传递)
    - [参考](#参考)
- [PhotoKit的使用](#photokit的使用)
    - [参考](#参考)
- [Alert View](#alert-view)
- [UIImage](#uiimage)
    - [参考](#参考)
- [可编辑的UITableView](#可编辑的uitableview)
- [CALayer & CAShapeLayer & Core Graphics](#calayer--cashapelayer--core-graphics)
- [音乐术语英语](#音乐术语英语)
- [swift中构造方法designated，convenience](#swift中构造方法designatedconvenience)
    - [参考](#参考)
- [笔记绘制功能](#笔记绘制功能)

<!-- /TOC -->

<a id="markdown-数据持久化" name="数据持久化"></a>

## 数据持久化

<a id="markdown-文件的保存和读取" name="文件的保存和读取"></a>

### 文件的保存和读取
* Json文件：每个乐谱页对应一个Json文件。文件保存乐谱每小节的大小和位置信息，以及乐谱的基本信息，包括每小节节拍数和用户设置的速度和Mask偏移量。
* png文件：每个乐谱都有一个乐谱图片，如果用户做了笔记，还有一个笔记图片。
    
保存文件的代码如下：
```
func getRootPath() -> String? {
    return NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first
}

func saveImageFile() {
    if let rootPath = Utility.getRootPath(),
        let imageName = getFileName() {
        let imagePath = "\(rootPath)/\(imageName).png"
        print("image path: \(imagePath)")
        if let image = imageView.image, let imageData = image.pngData() {
            FileManager.default.createFile(atPath: imagePath, contents: imageData, attributes: nil)
        }
    }
}

func saveJsonFile() {
    if let rootPath = Utility.getRootPath(),
        let jsonFileName = getFileName() {
        let jsonPath = "\(rootPath)/\(jsonFileName).json"
        print("image path: \(jsonPath)")
        let jsonDic: [String: Any] = [basicInfoKey: [String: String](), barFramesKey: barFrames]
        if let jsonData = try? NSKeyedArchiver.archivedData(withRootObject: jsonDic, requiringSecureCoding: false) {
            FileManager.default.createFile(atPath: jsonPath, contents: jsonData, attributes: nil)
        }
    }
}
```

读取文件的代码如下：
```
func loadJsonFile() {
    if let rootPath = Utility.getRootPath(),
        let jsonName = navigationItem.title,
        let jsonData = FileManager.default.contents(atPath: "\(rootPath)/\(jsonName).json"),
        let jsonObjectAny = NSKeyedUnarchiver.unarchiveObject(with: jsonData),
        let jsonObject = jsonObjectAny as? [String: Any] {
        if let sheetBasicInfo = jsonObject[basicInfoKey] as? [String: String] {
            self.sheetBasicInfo = sheetBasicInfo
        }
        if let barFrames = jsonObject[barFramesKey] as? [Int: CGRect] {
            self.barFrames =  barFrames
        }
    }
}

func loadSheetImage(with imageName: String) {
    if let rootPath = Utility.getRootPath(),
        let sheetImage = UIImage(contentsOfFile: "\(rootPath)/\(imageName).png") {
        sheetImageView.image = sheetImage
        noteImageView.image = UIImage(contentsOfFile: "\(rootPath)/\(imageName)\(noteImageSubfix).png")
        layoutImageView()
    }
}
```

<a id="markdown-nsdefault保存标签信息" name="nsdefault保存标签信息"></a>

### NSDefault：保存标签信息
```
UserDefaults.standard.setValue(allTags, forKey: allTagsKey)
let allTags = UserDefaults.standard.value(forKey: allTagsKey)
```

<a id="markdown-参考" name="参考"></a>

### 参考
* [iOS数据本地持久化方法总结](https://www.jianshu.com/p/d1c621631f7e)
* [iOS应用数据存储（数据持久化）的常用方式](https://cloud.tencent.com/developer/article/1129341)
* [iOS 将对象序列化成json，写入本地文件](https://www.jianshu.com/p/fad66bae5484)


<a id="markdown-播放节拍器声音" name="播放节拍器声音"></a>

## 播放节拍器声音
<a id="markdown-通过avfoundation播放声音" name="通过avfoundation播放声音"></a>

###  通过AVFoundation播放声音

```
if let audioUrl = Bundle.main.url(forResource: "FirstMeter", withExtension: "wav", subdirectory: "Resource.bundle")  {
    AudioServicesCreateSystemSoundID(audioUrl as CFURL, &firstMeterId)
}
AudioServicesPlaySystemSound(self.firstMeterId)
```

<a id="markdown-节拍器音量调节" name="节拍器音量调节"></a>

### 节拍器音量调节
在设置中，如果“声音->铃声和警报”下面的“跟随按钮”没有打开，那么通过`AudioServicesPlaySystemSound()`播放的声音就会始终用一个固定的音量播放，其它声音API播放的声音（比如`AVAudioPlayer`）会跟随系统音量变化音量大小。

> In Settings app, Sounds->RINGER AND ALERTS, if 'Change with Buttons' is set to Off, then sounds using AudioServicesPlaySystemSound() will always be played at a fixed volume (yet other sound API's such as AVAudioPlayer will respect the volume of the device).


<a id="markdown-navigationcontroller的使用和数据的传递" name="navigationcontroller的使用和数据的传递"></a>

## navigationController的使用和数据的传递

通过下面两种方法进行ViewController的弹出
```
let playVC = storyBoard.instantiateViewController(identifier: "Play")
playVC.navigationItem.title = filtedFileNames[indexPath.row]
navigationController?.pushViewController(playVC, animated: true)
```
或者
```
let colorPickerVC = UIColorPickerViewController()
colorPickerVC.selectedColor = brushColorButton.selectedColor
colorPickerVC.delegate = self
present(colorPickerVC, animated: true, completion: nil)
```
通过delegate进行目标ViewController到源ViewController的方法调用和数据传递，源ViewControler可以直接设置目标ViewController的属性进行数据传递。

<a id="markdown-参考" name="参考"></a>

### 参考
* [How to send data back by popViewControllerAnimated for Swift?](https://stackoverflow.com/questions/30618172/how-to-send-data-back-by-popviewcontrolleranimated-for-swift)
* [iOS导航控制器——UINavigationController使用详解](https://www.jianshu.com/p/319cbc53f0ba)
* [一篇较为详细的 Storyboard使用方法 总结](https://blog.csdn.net/liuyinghui523/article/details/62036465)


<a id="markdown-photokit的使用" name="photokit的使用"></a>

## PhotoKit的使用
需要在info.plist里面设置`NSPhotoLibraryUsageDescription`属性，设置在获取权限的时候显示给用户的弹窗中显示的内容。

检查权限状态：
```
private func requestPrivilegeAndLoadPhotos() {
    let status = PHPhotoLibrary.authorizationStatus()
    if status == .authorized {
        loadPhotos()
    } else {
        PHPhotoLibrary.requestAuthorization { (status) in
            if status == .authorized {
                self.loadPhotos()
                DispatchQueue.main.async {
                    self.collection.reloadData()
                }
            } else {
                // use not grant the privilege
            }
        }
    }
}
```

如果用户给了访问相册的权限，通过下面的方法加载所有图片信息：
```
private func loadPhotos() {
    let allPhotosOptions = PHFetchOptions()
    allPhotosOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: true)]
    allPhotos = PHAsset.fetchAssets(with: .image, options: allPhotosOptions)
}
```

通过下面方法将所有图片信息显示在collection列表中：
```
func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return allPhotos.count
}

func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    if let cell = collection.dequeueReusableCell(withReuseIdentifier: cellIdentifier, for: indexPath) as? PhotoCollectionCell {
        let assert = allPhotos.object(at: indexPath.item)
        PHImageManager.default().requestImage(for: assert, targetSize: CGSize(width: photoCollectionWH, height: photoCollectionWH), contentMode: .aspectFill, options: .none) { (image, dic) in
            if let image = image {
                cell.imageView.image = image
            }
        }
        
        return cell
    } else {
        return collection.dequeueReusableCell(withReuseIdentifier: cellIdentifier, for: indexPath)
    }
}
```

通过下面方法，将用户选择的图片传给delegate处理（delegate可以是源ViewController）：
```
func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
    print("item: \(indexPath.item)")
    let assert = allPhotos.object(at: indexPath.item)
    PHImageManager.default().requestImage(for: assert, targetSize: CGSize(width: assert.pixelWidth, height: assert.pixelHeight), contentMode: .aspectFill, options: .none) { (image, dic) in
        if let image = image {
            self.delegate?.set(image: image, and: nil)
        }
    }
}
```
<a id="markdown-参考" name="参考"></a>

### 参考
* [官方文档：PhotoKit](https://developer.apple.com/documentation/photokit)
* [Getting Started with PhotoKit](https://www.raywenderlich.com/11764166-getting-started-with-photokit)


<a id="markdown-alert-view" name="alert-view"></a>

## Alert View
[Displaying Alerts with UIAlertController in Swift](https://learnappmaking.com/uialertcontroller-alerts-swift-how-to/)

<a id="markdown-uiimage" name="uiimage"></a>

## UIImage
下面两个图片加载方法对cache的运用是不一样的：
```
+ (UIImage *)imageNamed:(NSString *)name: use cached images
+ (UIImage *)imageWithContentsOfFile:(NSString *)path: skip cached images and read data directly from file
```

<a id="markdown-参考" name="参考"></a>

### 参考
[iOS UIImage Cache](https://medium.com/@maximbilan/ios-uiimage-cache-92563c3ae3c2)


<a id="markdown-可编辑的uitableview" name="可编辑的uitableview"></a>

## 可编辑的UITableView
通过实现下面方法保证每个cell支持左滑操作：
``` 
func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
    return true
}
```

通过实现下面的方法，左滑之后显示两个按钮: Edit Tags和Delete
```
func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
    let deleteAction = UITableViewRowAction(style: .destructive, title: "Delete") { (action, indexPath) in
        self.deleteItem(at: indexPath)
    }
    let editAction = UITableViewRowAction(style: .default, title: "Edit Tags") { (action, indexPath) in
        self.editTags(for: indexPath)
    }
    editAction.backgroundColor = UIColor(displayP3Red: 60/255, green: 148/255, blue: 1.0, alpha: 1.0)
    deleteAction.backgroundColor = .red

    return [deleteAction, editAction]
}
```

<a id="markdown-calayer--cashapelayer--core-graphics" name="calayer--cashapelayer--core-graphics"></a>

## CALayer & CAShapeLayer & Core Graphics
这一块的内容太多，希望有时间可以单独总结一下。

<a id="markdown-音乐术语英语" name="音乐术语英语"></a>

## 音乐术语英语
[音乐术语英文名称汇总](https://zhuanlan.zhihu.com/p/35999407)

<a id="markdown-swift中构造方法designatedconvenience" name="swift中构造方法designatedconvenience"></a>

## swift中构造方法designated，convenience
官方文档中有如下描述：

1. 子类designated构造方法中必须调用父类的designated构造方法。
2. convenience构造方法中必须调用当前类的构造方法。
3. convenience构造方法归根结底要调用到designated构造方法。

![swift init methods](/images/swift_init_method.webp)

<a id="markdown-参考" name="参考"></a>

### 参考
* [Swift之init构造方法](https://www.jianshu.com/p/e2cce123a5af)

<a id="markdown-笔记绘制功能" name="笔记绘制功能"></a>

## 笔记绘制功能
通过第三方库[STSketchKit](https://github.com/e7711bbear/ATSketchKit)实现笔记功能支持Undo/Redo操作。官方介绍如下：

> ATSketchKit is a drawing / sketching framework for iOS written in Swift.

> It can be used as the foundation for an artistic app, a simple signature feature or more inteligent graph designing app.