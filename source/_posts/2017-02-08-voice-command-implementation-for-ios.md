---
layout: post
title: "iOS语音控制系统"
date: 2017-02-08 22:53:14 +0800
comments: true
categories: [ios]
---

## 语音识别

ios10之前，用户和iOS系统进行语音交互有两种途径：

1. Siri
2. 通过键盘的麦克风按钮，进入听写模式

<!-- more -->

**Siri**

缺点：

虽然Siri在iOS10中也开放了一些接口，但是非常有限：

1. VoIP calling
2. Messaging
3. Payments
4. Photo
5. Workouts
6. Ride booking
7. CarPlay (automotive vendors only)
8. Restaurant reservations (requires additional support from Apple)

而且，还必须以App Extension的形式实现。

优点：

但是优点也是很明显的，比如，在一个支持Siri的Messaging的应用中，可能出现下面的对话：

Siri | User
--- | ---
 | Hi, Siri, send a app_name message.
 to whom? | 
  | Hongchao
  What do you want to say to Hongchao? | 
   | Good job on Jarvis for Map.

**Speech**

iOS10除了通过SiriKit开发了Siri的一些功能之外，还开放了Siri使用的语音识别库Speech，该库是一个在线语音识别库。通过Speech进行语音识别非常简单、好用识别率高。详情参照[官方文档](https://developer.apple.com/reference/speech)。

虽然ios10开放了Speech，但是也是有限制的开放：

1. 最长一分钟的持续时间。
2. 对每个设备和每个应用，每天都有请求次数限制，但是具体次数没有公布。

## 命令提取

Speech识别请求会返回最长一分钟的音频识别结果，如何从这段识别结果里面提取出需要执行的命令呢？我们使用下面两条原则：

1. 从后往前提取出第一个匹配命令库中的命令。
2. 设计一些断句词帮助断句、提取命令。

通过原则1，可以解决不带参数的固定命令的提取，但是对命令有个要求：

* 任何命令不能是另一个命令的后缀。

否则较长的命令就不能被执行。

对于有参数的变化命令，通过原则1就不能解决了。

比如，有命令*search for new york*，其中*search for*是命令，*new york*是参数。当执行完此命令之后，继续说了一些“无关紧要”的话，就会导致系统继续执行此命令。这里说的“无关紧要”是指：

* 不是固定命令
* 不是断句词

执行完带有参数的变化命令之后，需要使用断句词进行断句。这就是原则2的必要性。

**更自然的命令提取方法**

* 只要能得到每个单词的时间戳，就可以通过停顿进行断句和命令提取，更加自然。
* 参考Siri在某个固定场景下的对话方式。


## 通过扬声器发声

需要设置`AVAudioSession`的状态，保证既可以录音，也可以发声，同时发出的声音不应该再被录入。

这个需求应该可以通过`AVSpeechSynthesizerDelegate`中下面的方法实现：

```swift
public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance)
```

