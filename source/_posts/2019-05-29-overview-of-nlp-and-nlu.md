---
layout: post
title: "自然语言理解（NLU）综述"
date: 2019-05-29 17:27:58 +0800
comments: true
published: true
categories: [NLP, NLU, machine learning]
---

<!-- more -->

这篇总结有点乱，权当留作自己看。

- [人机对话的两种模型](#人机对话的两种模型)
- [NLU与NLP](#nlu与nlp)
  - [Stanford CoreNLP](#stanford-corenlp)
  - [iOS *NaturalLanguage* framework](#ios-naturallanguage-framework)
    - [Custom Machine Learning Models](#custom-machine-learning-models)
- [自然语言理解平台](#自然语言理解平台)
- [Google的Dialogflow](#google的dialogflow)
  - [Dialogflow的历史](#dialogflow的历史)
  - [Dialogflow的一些概念](#dialogflow的一些概念)
  - [两种方法实现intents之间的entities共享](#两种方法实现intents之间的entities共享)
  - [“Training” tab in Dialogflow platform](#training-tab-in-dialogflow-platform)
  - [“Integrations”, “Analytics” and “Fulfillment”](#integrations-analytics-and-fulfillment)
  - [“Prebuild Agent” and “Small Talk”](#prebuild-agent-and-small-talk)
  - [一些使用Dialogflow的例子](#一些使用dialogflow的例子)
- [Alexa and Lex](#alexa-and-lex)
- [Microsoft LUIS Text Analytics API](#microsoft-luis-text-analytics-api)
- [Facebook的wit.ai](#facebook的witai)
- [Snips](#snips)
  - [Duckling](#duckling)
- [IBM的Watson](#ibm的watson)
- [SwiftNLC](#swiftnlc)
  - [Xunfei Command Recognition](#xunfei-command-recognition)
- [Siri and SiriKit](#siri-and-sirikit)
  - [SiriKit build-in domain](#sirikit-build-in-domain)
  - [SiriKit custom intent](#sirikit-custom-intent)

<a id="markdown-人机对话的两种模型" name="人机对话的两种模型"></a>
## 人机对话的两种模型

自然语言理解（NLU）的最终目的是让计算机能够理解人类的语言，实现人机对话。目前，人机对话模型基本上有两种：

1. 基于意图(Intent-based)的对话：这是当NLP算法使用intents和entities进行对话时，通过识别用户声明中的名词和动词，然后与它的dictionary交叉引用，让bot可以执行有效的操作。目前，大部分平台都是基于这种模式进行训练的，包括谷歌的Dialogflow。
2. 基于流程(Flow-based)的对话：基于流程的对话是智能通信的下一个级别。在这里，我们会给予两个人之间对话的许多不同样本的RNN（循环神经网络），创建的机器人将根据你训练的ML模型进行响应。 wit.ai是在这个领域取得巨大进展的少数网站之一。但这个太超前，不是我们考虑使用的对象，接下来也不会讨论。

详细讨论参考：[Bot Talks: Intent-Based vs. Flow-Base Conversations](https://chatbotsmagazine.com/bot-talks-intent-based-vs-flow-base-conversations-798788dc9cf6)。

<a id="markdown-nlu与nlp" name="nlu与nlp"></a>
## NLU与NLP

NLP（Natural Language Processing）是NLU（Natural Language Understanding）的一个前期步骤：NLP用于对文本或者语音进行机器学习训练和识别时的特征提取阶段。

<a id="markdown-stanford-corenlp" name="stanford-corenlp"></a>
### Stanford CoreNLP

可以去[Stanford CoreNLP](http://nlp.stanford.edu:8080/corenlp/process)试一下效果。使用界面可以看一下：

![stanford CoreNLP](/images/NLU_Stanford_CoreNLP.png)

<a id="markdown-ios-naturallanguage-framework" name="ios-naturallanguage-framework"></a>
### iOS *NaturalLanguage* framework

iOS的*NaturalLanguage*框架可以做的事情如下：

![Apple nlp framework](/images/NLU_AppleNLP.png)


<a id="markdown-custom-machine-learning-models" name="custom-machine-learning-models"></a>
#### Custom Machine Learning Models
用户可以自己训练模型，用于下列事情：

NSLinguisticTagger:

- Language identification 
- Tokenization in Word/Sentence/Paragraph
- Part of speech
- Lemmatization
- Named entity recognition

With custom models:

1. Text classification
    - Sentiment classification
    - Topic classification
    - Domain classification
2. Word tagging
    - Part of speech
    - Named entity
    - Slot parsing
    - Chunking
    - 

<a id="markdown-自然语言理解平台" name="自然语言理解平台"></a>
## 自然语言理解平台

一些比较有名气的自然语言理解平台：

- Facebook’s Wit.ai, 
- IBM Watson’s Conversation Service, 
- Microsoft’s Language Understanding and Intelligence Service or 
- Google NLP API 

Wit.ai joined Facebook on 2015.1.5

一些常见产品及其背后的支撑技术：

- Amazon: Echo <- Alexa <- Lex
- Apple: iPhone <- Siri <- SiriKit
- Google: Android phone <- Google Asistant <- Dialogflow
- Microsoft: Windows phone <- Cortana <- Luis

下面选择一些平台做简单介绍。

<a id="markdown-google的dialogflow" name="google的dialogflow"></a>
## Google的Dialogflow

> [Google的Dialogflow](https://dialogflow.com/)Give users new ways to interact with your product by building engaging voice and text-based conversational interfaces, such as voice apps and chatbots, powered by AI. Connect with users on your website, mobile app, the Google Assistant, Amazon Alexa, Facebook Messenger, and other popular platforms and devices.

<a id="markdown-dialogflow的历史" name="dialogflow的历史"></a>
### Dialogflow的历史

Dialogflow就是Speaktoit公司的api.ai。

- 2011: Speaktoit developed an intelligent personal assistant for mobile phones
- 2014: Speaktoit released api.ai
- 2016: Google buys Speaktoit to power Google Assistant
- 2017: api.ai is renamed to Dialogflow

<a id="markdown-dialogflow的一些概念" name="dialogflow的一些概念"></a>
### Dialogflow的一些概念

* Agents: 一套module包含dialogflow及自然語言理解使用者的語義後，執行整個動作 action. Ex:如上圖 TestAgent
* Intents: 使用者的意圖。意圖由開發人員配置。
* Entities:重要的關鍵字眼(我真的不知道怎麼翻好，Google說這個字叫做實體?) 從用戶口中所提到的重要的關鍵字眼轉換成重要的資訊，籍此提供給Intent。例如：“訂飛機” ：這句話中還需要 城市 日期 等資訊，來能完成訂飛機這個動作，所以 城市 和 日期 就是Entities.
* Fulfilment: 程式撰寫的地方。例如 訂飛機 還得串飛機公司的API才有可能完成訂購，所以程式邏緝就是寫在這裡。
* Integrations: LINE, Google home etc..
* Prebuilt Agents: dialogflow幫你預先訓練好的Agent，你可以拿來用。
* Smalltalk: 也是dialogflow幫你預先訓練好的Agent，幫助你的chatbot對話更友善.

<a id="markdown-两种方法实现intents之间的entities共享" name="两种方法实现intents之间的entities共享"></a>
### 两种方法实现intents之间的entities共享

- Context: 在线性对话中，完成讯息在Intent中的传送。
- Followup Intent

> 对话生命周期，就是这个参数可以存多久。

<a id="markdown-training-tab-in-dialogflow-platform" name="training-tab-in-dialogflow-platform"></a>
### “Training” tab in Dialogflow platform

> [官方关于Training的说明](https://console.dialogflow.com/api-client/#/agent/dea6f73c-7c22-44b6-a1a8-45cdcd160bfc/training)：你将收到所有发送给agent的回覆讯息以及agent回覆的内容，如果你告诉你的agent一些回应文本，但它回应你不喜欢的输出，这就非常有用，若你稍后意识到忘记了某个关键字的同义词，并且用户正在使用这个关键字，那么也可能会有所帮助，可以去告诉你的代理在这种情况下应该做什么。

<a id="markdown-integrations-analytics-and-fulfillment" name="integrations-analytics-and-fulfillment"></a>
### “Integrations”, “Analytics” and “Fulfillment”

> 在Training下方，你可以看到Integrations。在这里，可以管理你的agent去串接不同的服务，例如Google Assistant，Twitter，Slack，Messenger，Cortana，Alexa等等。 Integrations之后，还有Analytics，基本上用来显示建议名称，之后还有Fulfillment，如果你要调用一个API并实现一个webhook，这就是你会需要来的地方。

<a id="markdown-prebuild-agent-and-small-talk" name="prebuild-agent-and-small-talk"></a>
### “Prebuild Agent” and “Small Talk”

最后两个选项功能非常简单，但很有用。第一个是Prebuilt Agents，在这里，你可以import一个预先存在的代理框架，有很多例子，如食物传递机器人，音乐机器人，甚至（抱歉，但你真的需要知道这个）hotel预订机器人！最后一个选项是Small Talk，如果你将代理设计为像Siri或Google Assistant这样的每日伙伴(daily companion)，这个选项非常有用，Small Talk允许你添加常见问题的答案，我们都喜欢问我们的机器人，如”你几岁？”或”你住哪里？”，以及更热门的问题”你愿意嫁给我吗？”

<a id="markdown-一些使用dialogflow的例子" name="一些使用dialogflow的例子"></a>
### 一些使用Dialogflow的例子

1. 林建宏的7篇文章：如何使用Dialogflow建立Chatbot #1-#7
2. [用Dialogflow建立LINE Chatbot #1 介紹](https://medium.com/@wolkesau/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8dialogflow%E5%BB%BA%E7%AB%8Bchatbot-1-%E4%BB%8B%E7%B4%B9-62736bcdad95)
3. [A Demo for booking hotel based on Dialogflow](https://github.com/appcoda/ChatbotHotel)
4. [聊天機器人教學：使用Dialogflow (API.AI)開發 iOS Chatbot App](https://www.appcoda.com.tw/chatbot-dialogflow-ios/)

<a id="markdown-alexa-and-lex" name="alexa-and-lex"></a>
## Alexa and Lex

> Echo to Alexa as iPhone to Siri
> Lex is whats inside Alexa
> Lex is part of AWS, but Alexa isn't
> 
> Alexa is more focusing on communication using voice. Hence it has some special requirements for utterances. For example, the number is not supported in the utterances. You need to use 'Show me three elements' instead of 'Show me 3 elements'. For acronym, we need to use 'n.b.a' instead of 'NBA'.
> 
> Lex is a platform which can power bot who accept text input.
> 
> Amazon Lex 让您可以将语音和文本聊天访问集成到现有应用程序中。Amazon Alexa 允许您使用 Amazon Echo 或任何启用 Alexa Voice Service 的设备为家庭或工作场所的用户提供免提语音接口。

<a id="markdown-microsoft-luis-text-analytics-api" name="microsoft-luis-text-analytics-api"></a>
## Microsoft LUIS Text Analytics API

1. Detect language
2. Analyze sentiment
3. Extract key phrases
   * 使用方法参考[Python demo](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/quickstarts/python)。
4. Identify entities
    * 使用方法参考[Python demo](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/quickstarts/python)。

<a id="markdown-facebook的witai" name="facebook的witai"></a>
## Facebook的wit.ai

参见[官方文档](https://wit.ai/)。

<a id="markdown-snips" name="snips"></a>
## Snips

Snips的设计流程还是非常好的 ，包含基于正则表达式的确定性识别和基于机器学习的可能性识别。一些资料：

* [Post](https://medium.com/snips-ai/an-introduction-to-snips-nlu-the-open-source-library-behind-snips-embedded-voice-platform-b12b1a60a41a)
* [Document](https://snips-nlu.readthedocs.io/en/latest/index.html)
* [GitHub for iOS app demo](https://github.com/snipsco/snips-platform-swift)
* [Snips assistent generation](https://console.snips.ai/assistants/proj_ageaw4b4d83)

<a id="markdown-duckling" name="duckling"></a>
### Duckling

Snips使用[Duckling](https://github.com/facebook/duckling)进行下面的理解：

输入："the first Tuesday of October"
输出：{"value":"2017-10-03T00:00:00.000-07:00","grain":"day"}

> Note:
> * Spin your own Duckling server or using wit.ai’s build entities.
> * [Open Sourcing Duckling, our probabilistic (date) parser](https://medium.com/wit-ai/open-sourcing-duckling-our-probabilistic-date-parser-4351ee66c4ba)

<a id="markdown-ibm的watson" name="ibm的watson"></a>
## IBM的Watson

参看[官方文档](https://www.ibm.com/watson/services/natural-language-classifier/)。

<a id="markdown-swiftnlc" name="swiftnlc"></a>
## SwiftNLC

* [Offline Intent Understanding: CoreML NLC with Keras/TensorFlow and Apple NSLinguisticTagger](https://chatbotsmagazine.com/coreml-nlc-with-keras-tensorflow-and-apple-nslinguistictagger-1659021ea8e5)
* [Implementing a Natural Language Classifier in iOS with Keras + Core ML](https://heartbeat.fritz.ai/implementing-a-natural-language-classifier-in-ios-with-keras-core-ml-358f114c0b51)

<a id="markdown-xunfei-command-recognition" name="xunfei-command-recognition"></a>
### Xunfei Command Recognition

例如，开发一个简单的语音拨号应用，可定义如下语法：

```
&lt;commands&gt;:(找一下|打电话给) &lt;name&gt;;
&lt;name&gt;: 张三|李四;
```

该语法使识别引擎可以支持以下说法：找一下张三 、打电话给张三 、找一下李四 、打电话给李四。
凡是用户说出这个范围中的任意一句话，均可以被识别系统识别。如果用户说的话不在上述范围中，识别系统可能拒绝识别。

<a id="markdown-siri-and-sirikit" name="siri-and-sirikit"></a>
## Siri and SiriKit

<a id="markdown-sirikit-build-in-domain" name="sirikit-build-in-domain"></a>
### SiriKit build-in domain

SiriKit支持的build-in的domain包括：

- Messaging
- Lists and Notes
- Workouts
- Payments
- VoIP Calling
- Visual Codes
- Photos
- Ride Booking
- Car Commands
- CarPlay
- Restaurant Reservations

基于build-in的domain，可以不经过任何机器模型训练达到下面的效果：

```
“Hey Siri, send a UnicornChat message”
“To whom?”
“Celestra”
“What do you want to say to Celestra?”
“Let’s add more sparkle transitions” 
```
当然也可以用机器学习模型做一些事情。
> Domain model can be trained and used through NLP framework.

我们也可以帮助Siri识别自定义的词典（WWDC2017 228_making_great_sirikit_experiences)。可以支持两种自定义的词典：

* App vocabulary: known to all your users and unique to your app, supplied in the plist file.
* User vocabulary: known only to some specific users, supplied at the runtime.

但是，注意：

* Need to update the user vocabulary if some info changes.
* Need to reset the user vocabulary if the user reset the app, or log out.

<a id="markdown-sirikit-custom-intent" name="sirikit-custom-intent"></a>
### SiriKit custom intent

SiriKit的custom intent只是用来实现Siri Shortcut的，不能携带参数。

> Custom intent can only be used as shortcut and NO parameters will be extracted from the voice command.
