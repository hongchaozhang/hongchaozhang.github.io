---
layout: post
title: "在UITableViewCell中异步加载图片"
date: 2016-08-02 16:13:00 +0800
comments: true
categories: [ios]
---

iOS应用如何在列表中高效地加载图片？

<!-- more -->


## 问题
当我们在`UITableViewCell`中进行比较费时的工作（比如绘图，或者加载网络图片）的时候，通常会出现下面的问题：

1. 当`UITableViewCell`移出视图的时候，这个`UITableViewCell`对应的异步操作仍然在执行。这通常会造成系统资源浪费，还可能由于这个异步操作不知道返回到哪个`UITableViewCell`而导致`UITableView`一些诡异的行为。
2. `UITableViewCell`通常是重复利用的实例，这就会导致当前`UITableViewCell`可能会加载之前出现在视图中但是现在不在视图中的`UITableViewCell`的内容，在你面前变换一下`UITableViewCell`里面的内容，这是我们都不想看到的。

## 解决

2012年的WWDC中的*Session 211* [Building Concurrent User Interfaces on iOS](https://developer.apple.com/videos/play/wwdc2012/211/)很好地讲解了如何在一个`UITableViewCell`里面做比较费时的事情（比如绘图，或者网络请求图片），而保持app流畅，我下面的代码和[Advanced issues: Asynchronous UITableViewCell content loading done right](https://stavash.wordpress.com/2012/12/14/advanced-issues-asynchronous-uitableviewcell-content-loading-done-right/)这一篇文章都是根据这个session实现的。

解决上述两个问题的基本想法：当`tableView:cellForRowAtIndexPath:`被调用的时候，去网络请求`UITableViewCell`对应的图片。当请求成功时，判断当前的`UITableViewCell`是否仍然在视图中：如果在，将请求的图片设置到`UITableViewCell`中，否则，不设置。另外，当`UITableViewCell`移出视图的时候，要取消其对应的请求，防止对后续请求造成影响。

[LazyTableImages: Populating UITableView content asynchronously](https://developer.apple.com/library/ios/samplecode/LazyTableImages/Introduction/Intro.html)这个实现相对简单一点：这个实现通过`UIScrollViewDelegate`中的方法，保证在用户滚动`UITableView`和`UITableView`停止之前都停止`UITableViewCell`里面的更新，只有当`UITableView`静止的时候，才去更新当前视图中的所有`UITableViewCell`。而上面的实现则能保证在用户进行滚动的同时，请求并加载图片到正确的位置。

主要代码：

```
class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, UIScrollViewDelegate {

    var data = [String]()
    var rowIndexToOperationDictionary = [String:NSBlockOperation]()
    let downloadImageOperationQueue: NSOperationQueue = {
        var queue = NSOperationQueue()
        queue.name = "download image queue"
        queue.maxConcurrentOperationCount = 4
        return queue
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        for i in 1..<100 {
            data.append("\(i)")
        }
        let tableView = UITableView(frame: self.view.bounds)
        tableView.dataSource = self
        tableView.delegate = self
        self.view.addSubview(tableView)
    }
    
    // when table view disappears, cancel all operations
    override func viewDidDisappear(animated: Bool) {
        downloadImageOperationQueue.cancelAllOperations()
    }
    
    func tableView(tableView: UITableView, heightForRowAtIndexPath indexPath: NSIndexPath) -> CGFloat {
        return 100
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var cell = tableView.dequeueReusableCellWithIdentifier("cell")
        if cell == nil {
            cell = UITableViewCell(style: .Default, reuseIdentifier: "cell")
        }
        
        cell!.textLabel!.text = data[indexPath.row]
        
        let loadImageInfoCellOperation = NSBlockOperation()
        weak var weakLoadImageInfoCellOperation = loadImageInfoCellOperation
        func loadImageOperationBlock() {
            let imageData = NSData(contentsOfURL: NSURL(string: "http://dummyimage.com/100x100/222/fff.png&text="+data[indexPath.row])!)
            var imageIcon:UIImage?
            if let imageData = imageData {
                imageIcon = UIImage(data: imageData)
            }

            func updateImageOperationBlock() {
                if let operation = weakLoadImageInfoCellOperation {
                    if operation.cancelled {
                        rowIndexToOperationDictionary.removeValueForKey(data[indexPath.row])
                    } else {
                        let theCell = tableView.cellForRowAtIndexPath(indexPath)
                        theCell?.imageView!.image = imageIcon
                        theCell?.setNeedsLayout()
                        rowIndexToOperationDictionary.removeValueForKey(data[indexPath.row])
                    }
                }
            }
            NSOperationQueue.mainQueue().addOperationWithBlock(updateImageOperationBlock)
        }
        loadImageInfoCellOperation.addExecutionBlock(loadImageOperationBlock)
        
        rowIndexToOperationDictionary[data[indexPath.row]] = loadImageInfoCellOperation
        downloadImageOperationQueue.addOperation(loadImageInfoCellOperation)
        cell?.imageView!.image = nil
        
        return cell!
    }
    
    // when cell is out of scene, cancel the operation
    func tableView(tableView: UITableView, didEndDisplayingCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        let loadImageInfoCellOperation:NSBlockOperation? = rowIndexToOperationDictionary[data[indexPath.row]]
        if let op = loadImageInfoCellOperation {
            op.cancel()
            rowIndexToOperationDictionary.removeValueForKey(data[indexPath.row])
        }
        
    }

}

```


### 其它问题

1. 修改应用安全权限，确保能下载http资源。参考：[How do I load an HTTP URL with App Transport Security enabled in iOS 9?](http://stackoverflow.com/questions/30731785/how-do-i-load-an-http-url-with-app-transport-security-enabled-in-ios-9)

2. 当设置的`UITableViewCell`中的图片的时候，需要调用一下`[cell setNeedsLayout]`确保其显示出来。否则，只有当你点击的时候图片才会更新出来。参考
[cell imageView in UITableView doesn't appear until selected](http://stackoverflow.com/questions/9352638/cell-imageview-in-uitableview-doesnt-appear-until-selected)。

### 资源

这是一个神奇的网站！可以在线定制图片颜色和内容，然后生成对应的url。参考：[Dynamic Dummy Image Generator](http://dummyimage.com/)。所以才会有下面的效果，方便检查每个cell的图片是否正确：

![async_load_online_images_into_uitableviewcells.png](/images/async_load_online_images_into_uitableviewcells.png)