---
layout: post
title: "iOS中多线程任务之间的同步"
date: 2016-10-31 10:41:27 +0800
comments: true
categories: [ios]
---

当我们使用iOS的多线程并发执行一些任务的时候，有时候需要考虑任务之间的同步问题，比如任务1和任务2执行完之后，才可以执行任务3，原因可能是任务3需要任务1和任务2执行得到的结果。

<!-- more -->

部分内容参考：
[Waiting until two async blocks are executed before starting another block](http://stackoverflow.com/questions/11909629/waiting-until-two-async-blocks-are-executed-before-starting-another-block)

### dispatch_group_notify

当group中所有的block都执行完之后，`dispatch_group_notify`对应的block才会执行。并且放在同一个group中的block可以是不同queue里面的block。

例子：

```objc
dispatch_group_t group = dispatch_group_create();
dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0);
    
dispatch_group_async(group, queue, ^ {
    // block1
    NSLog(@"Block1 Start");
    [NSThread sleepForTimeInterval:2.0];
    NSLog(@"Block1 End");
});
    
dispatch_group_async(group, queue, ^ {
    // block2
    NSLog(@"Block2 Start");
    [NSThread sleepForTimeInterval:1.0];
    NSLog(@"Block2 End");
});
    
dispatch_group_notify(group, queue, ^ {
    // block3
    NSLog(@"Block3");
});
```

输出：

```
2016-10-31 11:14:28.076 OCPlayground[82366:5830581] Block2 Start
2016-10-31 11:14:28.076 OCPlayground[82366:5830578] Block1 Start
2016-10-31 11:14:29.081 OCPlayground[82366:5830581] Block2 End
2016-10-31 11:14:30.078 OCPlayground[82366:5830578] Block1 End
2016-10-31 11:14:30.078 OCPlayground[82366:5830578] Block3
```

### dispatch_barrier_async

`dispatch_barrier_async`函数的作用与barrier的意思相同，在线程任务管理中起到一个栅栏的作用，它等待所有位于barrier函数之前的操作执行完毕后执行，并且在barrier函数执行之后，barrier函数之后的操作才会得到执行，该函数需要同`dispatch_queue_create`函数生成的并行队列一起使用，不能同`dispatch_get_global_queue`返回的并行队列一起使用。

例子：

```objc
// dispatch_barrier_async can not be used together with dispatch_get_global_queue
// dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0);
dispatch_queue_t queue = dispatch_queue_create("com.company.app.queue", DISPATCH_QUEUE_CONCURRENT);
    
dispatch_async(queue, ^{
    // block1
    NSLog(@"Block1 Start");
    [NSThread sleepForTimeInterval:2.0];
    NSLog(@"Block1 End");
});
    
dispatch_async(queue, ^{
    // block2
    NSLog(@"Block2 Start");
    [NSThread sleepForTimeInterval:1.0];
    NSLog(@"Block2 End");
});
    
dispatch_barrier_async(queue, ^{
    // block3
    NSLog(@"Block3");
});
    
dispatch_async(queue, ^{
    // block4
    NSLog(@"Block4 Start");
    [NSThread sleepForTimeInterval:3.0];
    NSLog(@"Block4 End");
});
```

输出：

```
2016-10-31 12:02:08.468 OCPlayground[83918:5867777] Block1 Start
2016-10-31 12:02:08.468 OCPlayground[83918:5867807] Block2 Start
2016-10-31 12:02:09.474 OCPlayground[83918:5867807] Block2 End
2016-10-31 12:02:10.469 OCPlayground[83918:5867777] Block1 End
2016-10-31 12:02:10.469 OCPlayground[83918:5867777] Block3
2016-10-31 12:02:10.470 OCPlayground[83918:5867777] Block4 Start
2016-10-31 12:02:13.473 OCPlayground[83918:5867777] Block4 End
```

### addDependency

苹果对GCD进行了封装，有了自己的`NSOperationQueue`和`NSBlockOperation`。其中`NSBlockOperation`中添加了`addDepencency:`方法可以指定operation block之间的依赖关系。

例子：

```objc
NSOperationQueue *queue = [[NSOperationQueue alloc] init];
    
NSOperation *completionOperation = [NSBlockOperation blockOperationWithBlock:^{
    // block3
    NSLog(@"Block3");
}];
    
NSOperation *operation;
    
operation = [NSBlockOperation blockOperationWithBlock:^{
    // block1
    NSLog(@"Block1 Start");
    [NSThread sleepForTimeInterval:2.0];
    NSLog(@"Block1 End");
}];
    
[completionOperation addDependency:operation];
[queue addOperation:operation];
    
operation = [NSBlockOperation blockOperationWithBlock:^{
    // block2
    NSLog(@"Block2 Start");
    [NSThread sleepForTimeInterval:1.0];
    NSLog(@"Block2 End");
}];
    
[completionOperation addDependency:operation];
[queue addOperation:operation];
    
[queue addOperation:completionOperation];
```

输出：

```
2016-10-31 12:22:49.774 OCPlayground[84061:5887605] Block1 Start
2016-10-31 12:22:49.774 OCPlayground[84061:5887572] Block2 Start
2016-10-31 12:22:50.776 OCPlayground[84061:5887572] Block2 End
2016-10-31 12:22:51.848 OCPlayground[84061:5887605] Block1 End
2016-10-31 12:22:51.849 OCPlayground[84061:5887605] Block3
```

### dispatch_semaphore

[关于dispatch_semaphore的使用](http://www.cnblogs.com/snailHL/p/3906112.html)讲解的很详细。

dispatch_semaphore是GCD用来同步的一种方式，与他相关的共有三个函数，分别是`dispatch_semaphore_create`、`dispatch_semaphore_signal`和`dispatch_semaphore_wait`。

下面我们逐一介绍三个函数：

（1）`dispatch_semaphore_create`的声明为：`dispatch_semaphore_t  dispatch_semaphore_create(long value);`
返回一个`dispatch_semaphore_t`类型且值为`value`的信号量。这里的传入的参数`value`必须大于或等于0，否则`dispatch_semaphore_create`会返回`NULL`。

（2）`dispatch_semaphore_signal`的声明为：`long dispatch_semaphore_signal(dispatch_semaphore_t dsema);`这个函数会使传入的信号量`dsema`的值加1。（至于返回值，参考[关于dispatch_semaphore的使用](http://www.cnblogs.com/snailHL/p/3906112.html)。）

 (3) `dispatch_semaphore_wait`的声明为：`long dispatch_semaphore_wait(dispatch_semaphore_t dsema, dispatch_time_t timeout)；`这个函数会使传入的信号量`dsema`的值减1。这个函数的作用是这样的：
 
 * 如果`dsema`信号量的值大于0，该函数所处线程就继续执行下面的语句，并且将信号量的值减1；
 * 如果`dsema`的值为0，那么这个函数就阻塞当前线程等待timeout，如果等待期间`dsema`的值被`dispatch_semaphore_signal`函数加1了，且该函数（即`dispatch_semaphore_wait`）所处线程获得了信号量，那么就继续向下执行并将信号量减1。
 * 如果等待期间没有获取到信号量或者信号量的值一直为0，那么等到timeout时，其所处线程自动执行其后语句。

例子：

```objc
dispatch_queue_t queue = dispatch_queue_create("my.conQ", DISPATCH_QUEUE_CONCURRENT);
dispatch_semaphore_t mySem = dispatch_semaphore_create(0);
    
dispatch_async(queue, ^{
    // block1
    NSLog(@"Block1 Start");
    [NSThread sleepForTimeInterval:2.0];
    NSLog(@"Block1 End");
    dispatch_semaphore_signal(mySem);
});
    
dispatch_async(queue, ^{
    // block2
    NSLog(@"Block2 Start");
    [NSThread sleepForTimeInterval:1.0];
    NSLog(@"Block2 End");
    dispatch_semaphore_signal(mySem);
});
    
dispatch_async(queue, ^{
    dispatch_semaphore_wait(mySem, DISPATCH_TIME_FOREVER);
    dispatch_semaphore_wait(mySem, DISPATCH_TIME_FOREVER);
    // block3
    NSLog(@"Block3");
});
```

输出：

```
2016-10-31 22:16:34.402 OCPlayground[85158:6133417] Block1 Start
2016-10-31 22:16:34.402 OCPlayground[85158:6133423] Block2 Start
2016-10-31 22:16:35.405 OCPlayground[85158:6133423] Block2 End
2016-10-31 22:16:36.403 OCPlayground[85158:6133417] Block1 End
2016-10-31 22:16:36.404 OCPlayground[85158:6133426] Block3
```

### dispatch_group_enter和dispatch_group_leave

当我们碰到block里面有嵌套的block的时候，简单地使用`dispatch_group_notify`就不能解决问题了：`dispatch_group_notify`不会等到嵌套的block执行完再执行。对于这种情况，如果还坚持用`dispatch_group_notify`，可以有两种解决方案：

**方案1：**

对于嵌套的block，仍然使用`dispatch_group_async`将block放入对应的group。比如下面的例子，对于Block1里面的Block4，我们仍然使用`dispatch_group_async`将Block4放入对应的group，即可以保证Block3在Block4之后执行。也就是说，只要是在`dispatch_group_notify`对应的Block3执行之前加入group的block，都需要执行，然后才能执行`dispatch_group_notify`对应的Block3，即，当`dispatch_group_notify`对应的Block3执行的时候，group中不能有任何没有执行的其它block存在。

```objc
dispatch_group_async(group, queue, ^{
    // block4 inside block 1
    NSLog(@"Block4 inside Block1 Start");
    [NSThread sleepForTimeInterval:1.0];
    NSLog(@"Block4 inside Block1 End");
});
```

如果嵌套的block对应的是服务器请求的callback（比如`onSuccess:`和`onFailure:`），就不方便将其加入对应的group中。这时候就需要使用方案2。

**方案2：**
通过`dispatch_group_enter`和`dispatch_group_leave`手动管理group关联的block的运行状态（或计数）。但是需要注意：进入和退出group次数必须匹配，不仅是code书写方面一致，code执行也要保证一致，否则`dispatch_group_notify`对应的Block3就不会执行到。

例子：

```objc
dispatch_group_t group = dispatch_group_create();
dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0);
    
dispatch_group_async(group, queue, ^ {
    // block1
    NSLog(@"Block1 Start");
    [NSThread sleepForTimeInterval:2.0];
    NSLog(@"Block1 End");

    dispatch_group_enter(group);
    dispatch_async(queue, ^{
        // block4 inside block 1
        NSLog(@"Block4 inside Block1 Start");
        [NSThread sleepForTimeInterval:1.0];
        NSLog(@"Block4 inside Block1 End");
        dispatch_group_leave(group);
    });
});
    
    
dispatch_group_async(group, queue, ^ {
    // block2
    NSLog(@"Block2 Start");
    [NSThread sleepForTimeInterval:1.0];
    NSLog(@"Block2 End");
});
    
dispatch_group_notify(group, queue, ^ {
    // block3
    NSLog(@"Block3");
});
```

输出：

```
2016-10-31 13:51:23.512 OCPlayground[84646:5947063] Block2 Start
2016-10-31 13:51:23.512 OCPlayground[84646:5947080] Block1 Start
2016-10-31 13:51:24.518 OCPlayground[84646:5947063] Block2 End
2016-10-31 13:51:25.518 OCPlayground[84646:5947080] Block1 End
2016-10-31 13:51:25.518 OCPlayground[84646:5947080] Block4 inside Block1 Start
2016-10-31 13:51:26.521 OCPlayground[84646:5947080] Block4 inside Block1 End
2016-10-31 13:51:26.522 OCPlayground[84646:5947063] Block3
```

