---
layout: post
title: "UIViewController中常见的ios编程习惯"
date: 2015-12-06 12:55:47 +0800
comments: true
categories: [ios, objective-c]
---

参考[iOS应用架构谈 view层的组织和调用方案](http://www.cocoachina.com/ios/20150525/11919.html)。

### 所有的属性都使用getter和setter

<!-- more -->

>
不要在viewDidLoad里面初始化你的view然后再add，这样代码就很难看。在viewDidload里面只做addSubview的事情，然后在viewWillAppear里面做布局的事情，最后在viewDidAppear里面做Notification的监听之类的事情。至于属性的初始化，则交给getter去做。

不要出现这样的代码：

{% highlight objc linenos %}
- (void)viewDidLoad
{
    [super viewDidLoad];
    self.textLabel = [[UILabel alloc] init];
    self.textLabel.textColor = [UIColor blackColor];
    self.textLabel ... ...
    self.textLabel ... ...
    self.textLabel ... ...
    [self.view addSubview:self.textLabel];
}
{% endhighlight %}

而应该是这样的：

{% highlight objc linenos %}
#pragma mark - life cycle
- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    [self.view addSubview:self.firstTableView];
    [self.view addSubview:self.secondTableView];
    [self.view addSubview:self.cleanButton];
    [self.view addSubview:self.originImageView];
    [self.view addSubview:self.processedImageView];
    [self.view addSubview:self.activityIndicator];
    [self.view addSubview:self.takeImageButton];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    CGFloat width = (self.view.width - 30) / 2.0f;
    self.originImageView.size = CGSizeMake(width, width);
    [self.originImageView topInContainer:70 shouldResize:NO];
    [self.originImageView leftInContainer:10 shouldResize:NO];
    self.processedImageView.size = CGSizeMake(width, width);
    [self.processedImageView right:10 FromView:self.originImageView];
    [self.processedImageView topEqualToView:self.originImageView];
    CGFloat labelWidth = self.view.width - 100;
    self.firstFilterLabel.size = CGSizeMake(labelWidth, 20);
    [self.firstFilterLabel leftInContainer:10 shouldResize:NO];
    [self.firstFilterLabel top:10 FromView:self.originImageView];
    ... ...
}
{% endhighlight %}

#### getter和setter全部都放在最后

>
因为一个ViewController很有可能会有非常多的view，就像上面给出的代码样例一样，如果getter和setter写在前面，就会把主要逻辑扯到后面去，其他人看的时候就要先划过一长串getter和setter，这样不太好。然后要求业务工程师写代码的时候按照顺序来分配代码块的位置，**先是life cycle，然后是Delegate方法实现，然后是event response，然后才是getters and setters**。这样后来者阅读代码时就能省力很多。

### 每一个delegate都把对应的protocol名字带上，delegate方法不要到处乱写，写到一块区域里面去

>
比如UITableViewDelegate的方法集就老老实实写上#pragma mark - UITableViewDelegate。这样有个好处就是，当其他人阅读一个他并不熟悉的Delegate实现方法时，他只要按住command然后去点这个protocol名字，Xcode就能够立刻跳转到对应这个Delegate的protocol定义的那部分代码去，就省得他到处找了。

### event response专门开一个代码区域

所有button、gestureRecognizer的响应事件都放在这个区域里面，不要到处乱放。

### 关于private methods，正常情况下ViewController里面不应该写

不是delegate方法的，不是event response方法的，不是life cycle方法的，就是private method了。对的，正常情况下ViewController里面一般是不会存在private methods的，这个private methods一般是用于日期换算、图片裁剪啥的这种小功能。这种小功能要么把它写成一个category，要么把他做成一个模块，哪怕这个模块只有一个函数也行。

ViewController基本上是大部分业务的载体，本身代码已经相当复杂，所以跟业务关联不大的东西能不放在ViewController里面就不要放。另外一点，这个private method的功能这时候只是你用得到，但是将来说不定别的地方也会用到，一开始就独立出来，有利于将来的代码复用。