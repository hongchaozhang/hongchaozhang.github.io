---
layout: post
title: "自然语言理解（NLU）综述"
date: 2019-05-29 17:27:58 +0800
comments: true
published: false
categories: [NLP, NLU, machine learning]
---

<!-- more -->

- [人机对话的两种模型](#%E4%BA%BA%E6%9C%BA%E5%AF%B9%E8%AF%9D%E7%9A%84%E4%B8%A4%E7%A7%8D%E6%A8%A1%E5%9E%8B)
- [NLU与NLP](#nlu%E4%B8%8Enlp)
  - [Stanford CoreNLP](#stanford-corenlp)
  - [iOS *NaturalLanguage* framework](#ios-naturallanguage-framework)
- [自然语言理解平台](#%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%90%86%E8%A7%A3%E5%B9%B3%E5%8F%B0)
- [Google的Dialogflow](#google%E7%9A%84dialogflow)
  - [Dialogflow的历史](#dialogflow%E7%9A%84%E5%8E%86%E5%8F%B2)
  - [Dialogflow的一些概念](#dialogflow%E7%9A%84%E4%B8%80%E4%BA%9B%E6%A6%82%E5%BF%B5)
  - [两种方法实现intents之间的entities共享](#%E4%B8%A4%E7%A7%8D%E6%96%B9%E6%B3%95%E5%AE%9E%E7%8E%B0intents%E4%B9%8B%E9%97%B4%E7%9A%84entities%E5%85%B1%E4%BA%AB)
  - [“Training” tab in Dialogflow platform](#training-tab-in-dialogflow-platform)
  - [“Integrations”, “Analytics” and “Fulfillment”](#integrations-analytics-and-fulfillment)
  - [“Prebuild Agent” and “Small Talk”](#prebuild-agent-and-small-talk)
  - [一些使用Dialogflow的例子](#%E4%B8%80%E4%BA%9B%E4%BD%BF%E7%94%A8dialogflow%E7%9A%84%E4%BE%8B%E5%AD%90)
- [Alexa and Lex](#alexa-and-lex)
- [Microsoft LUIS Text Analytics API](#microsoft-luis-text-analytics-api)
- [Facebook的wit.ai](#facebook%E7%9A%84witai)
- [Snips](#snips)
  - [Duckling](#duckling)
- [IBM的Watson](#ibm%E7%9A%84watson)
- [SwiftNLC](#swiftnlc)
  - [Xunfei Command Recognition](#xunfei-command-recognition)
- [Siri and SiriKit](#siri-and-sirikit)

## 人机对话的两种模型

自然语言理解（NLU）的最终目的是让计算机能够理解人类的语言，实现人机对话。目前，人机对话模型基本上有两种：

1. 基于意图(Intent-based)的对话：这是当NLP算法使用intents和entities进行对话时，通过识别用户声明中的名词和动词，然后与它的dictionary交叉引用，让bot可以执行有效的操作。目前，大部分平台都是基于这种模式进行训练的，包括谷歌的Dialogflow。
2. 基于流程(Flow-based)的对话：基于流程的对话是智能通信的下一个级别。在这里，我们会给予两个人之间对话的许多不同样本的RNN（循环神经网络），创建的机器人将根据你训练的ML模型进行响应。 wit.ai是在这个领域取得巨大进展的少数网站之一。但这个太超前，不是我们考虑使用的对象，接下来也不会讨论。

详细讨论参考：[Bot Talks: Intent-Based vs. Flow-Base Conversations](https://chatbotsmagazine.com/bot-talks-intent-based-vs-flow-base-conversations-798788dc9cf6)。

## NLU与NLP

NLP（Natural Language Processing）是NLU（Natural Language Understanding）的一个前期步骤：NLP用于对文本或者语音进行机器学习训练和识别时的特征提取阶段。

### Stanford CoreNLP

http://nlp.stanford.edu:8080/corenlp/process

### iOS *NaturalLanguage* framework

iOS的*NaturalLanguage*框架可以做的事情如下：





## 自然语言理解平台

- Facebook’s Wit.ai, 
- Watson’s Conversation Service, 
- Microsoft’s Language Understanding and Intelligence Service or 
- Google NLP API 
have drive a lot of attention from developers and customers. 

Wit.ai joined Facebook on 2015.1.5

Amazon: Echo <- Alexa <- Lex
Apple: iPhone <- Siri <- SiriKit
Google: Android phone <- Google Asistant <- Dialogflow
Microsoft: Windows phone <- Cortana <- Luis

## Google的Dialogflow

https://dialogflow.com/

Give users new ways to interact with your product by building engaging voice and text-based conversational interfaces, such as voice apps and chatbots, powered by AI. Connect with users on your website, mobile app, the Google Assistant, Amazon Alexa, Facebook Messenger, and other popular platforms and devices.

### Dialogflow的历史

History of Dialogflow ( api.ai in Speaktoit Company)

2011: Speaktoit developed an intelligent personal assistant for mobile phones
2014: Speaktoit released api.ai
2016: Google buys Speaktoit to power Google Assistant
2017: api.ai is renamed to Dialogflow

### Dialogflow的一些概念

* Agents : 一套module包含dialogflow及自然語言理解使用者的語義後，執行整個動作 action. Ex:如上圖 TestAgent
* Intents: 使用者的意圖。意圖由開發人員配置。
* Entities:重要的關鍵字眼(我真的不知道怎麼翻好，Google說這個字叫做實體?) 從用戶口中所提到的重要的關鍵字眼轉換成重要的資訊，籍此提供給Intent。例如：“訂飛機” ：這句話中還需要 城市 日期 等資訊，來能完成訂飛機這個動作，所以 城市 和 日期 就是Entities.
* Fulfilment: 程式撰寫的地方。例如 訂飛機 還得串飛機公司的API才有可能完成訂購，所以程式邏緝就是寫在這裡。
* Integrations: LINE, Google home etc..
* Prebuilt Agents: dialogflow幫你預先訓練好的Agent，你可以拿來用。
* Smalltalk: 也是dialogflow幫你預先訓練好的Agent，幫助你的chatbot對話更友善.

### 两种方法实现intents之间的entities共享

對話生命周期，就是這個參數可以存多久

- Context: 在線性對話中，完成訊息在Intent中的傳遞
- Followup Intent

### “Training” tab in Dialogflow platform

https://console.dialogflow.com/api-client/#/agent/dea6f73c-7c22-44b6-a1a8-45cdcd160bfc/training

你將收到所有發送給agent的回覆訊息以及agent回覆的內容，如果你告訴你的agent一些回應文本，但它回應你不喜歡的輸出，這就非常有用，若你稍後意識到忘記了某個關鍵字的同義詞，並且用戶正在使用這個關鍵字，那麼也可能會有所幫助，可以去告訴你的代理在這種情況下應該做什麼。

### “Integrations”, “Analytics” and “Fulfillment”

在Training下方，你可以看到Integrations。在這裡，可以管理你的agent去串接不同的服務，例如Google Assistant，Twitter，Slack，Messenger，Cortana，Alexa等等。Integrations之後，還有Analytics，基本上用來顯示建議名稱，之後還有Fulfillment，如果你要調用一個API並實現一個webhook，這就是你會需要來的地方。

### “Prebuild Agent” and “Small Talk”

最後兩個選項功能非常簡單，但很有用。第一個是Prebuilt Agents，在這裡，你可以import一個預先存在的代理框架，有很多例子，如食物傳遞機器人，音樂機器人，甚至（抱歉，但你真的需要知道這個）hotel預訂機器人！ 最後一個選項是Small Talk，如果你將代理設計為像Siri或Google Assistant這樣的每日夥伴(daily companion)，這個選項非常有用，Small Talk允許你添加常見問題的答案，我們都喜歡問我們的機器人，如”你幾歲？”或”你住哪裡？”，以及更熱門的問題”你願意嫁給我嗎？”


### 一些使用Dialogflow的例子

林建宏的7篇文章：如何使用Dialogflow建立Chatbot #1-#7

[用Dialogflow建立LINE Chatbot #1 介紹](https://medium.com/@wolkesau/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8dialogflow%E5%BB%BA%E7%AB%8Bchatbot-1-%E4%BB%8B%E7%B4%B9-62736bcdad95)

[A Demo for booking hotel based on Dialogflow](https://github.com/appcoda/ChatbotHotel)

[聊天機器人教學：使用Dialogflow (API.AI)開發 iOS Chatbot App](https://www.appcoda.com.tw/chatbot-dialogflow-ios/)

## Alexa and Lex

Echo to Alexa as iPhone to Siri
Lex is whats inside Alexa
Lex is part of AWS, but Alexa isn't

Alexa is more focusing on communication using voice. Hence it has some special requirements for utterances. For example, the number is not supported in the utterances. You need to use 'Show me three elements' instead of 'Show me 3 elements'. For acronym, we need to use 'n.b.a' instead of 'NBA'.
Lex is a platform which can power bot who accept text input.


Amazon Lex 让您可以将语音和文本聊天访问集成到现有应用程序中。Amazon Alexa 允许您使用 Amazon Echo 或任何启用 Alexa Voice Service 的设备为家庭或工作场所的用户提供免提语音接口。

## Microsoft LUIS Text Analytics API

Detect language
Analyze sentiment
Extract key phrases
Python demo: https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/quickstarts/python

Identify entities
Python demo: https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/quickstarts/python

## Facebook的wit.ai

https://wit.ai/hongchaozhang/WitDemo/entities

## Snips

Post: https://medium.com/snips-ai/an-introduction-to-snips-nlu-the-open-source-library-behind-snips-embedded-voice-platform-b12b1a60a41a
Document: https://snips-nlu.readthedocs.io/en/latest/index.html
GitHub for iOS app demo: https://github.com/snipsco/snips-platform-swift
Snips assistent generation: https://console.snips.ai/assistants/proj_ageaw4b4d83

### Duckling

https://github.com/facebook/duckling

"the first Tuesday of October"
=> {"value":"2017-10-03T00:00:00.000-07:00","grain":"day"}

Spin your own Duckling server or using wit.ai’s build entities.

Open Sourcing Duckling, our probabilistic (date) parser (https://medium.com/wit-ai/open-sourcing-duckling-our-probabilistic-date-parser-4351ee66c4ba)

## IBM的Watson

https://www.ibm.com/watson/services/natural-language-classifier/

## SwiftNLC

https://chatbotsmagazine.com/coreml-nlc-with-keras-tensorflow-and-apple-nslinguistictagger-1659021ea8e5
https://heartbeat.fritz.ai/implementing-a-natural-language-classifier-in-ios-with-keras-core-ml-358f114c0b51

### Xunfei Command Recognition

例如，开发一个简单的语音拨号应用，可定义如下语法：

```
&lt;commands&gt;:(找一下|打电话给) &lt;name&gt;;
&lt;name&gt;: 张三|李四;
```

该语法使识别引擎可以支持以下说法：找一下张三 、打电话给张三 、找一下李四 、打电话给李四。
凡是用户说出这个范围中的任意一句话，均可以被识别系统识别。如果用户说的话不在上述范围中，识别系统可能拒绝识别。

## Siri and SiriKit

SiriKit build-in domain

Messaging
Lists and Notes
Workouts
Payments
VoIP Calling
Visual Codes
Photos
Ride Booking
Car Commands
CarPlay
Restaurant Reservations


“Hey Siri, send a UnicornChat message”
“To whom?”
“Celestra”
“What do you want to say to Celestra?”
“Let’s add more sparkle transitions” 

Domain: Messages Intent: sendMessage Recipient: Celestra Content: Let’s add more sparkle transitions 


Domain model can be trained and used through NLP framework.

Help Siri understand words unique to your app by custom vocabulary.

From WWDC2017 228_making_great_sirikit_experiences

App vocabulary: known to all your users and unique to your app, supplied in the plist file.
User vocabulary: known only to some specific users, supplied at the runtime.

Need to update the user vocabulary if some info changes.
Need to reset the user vocabulary if the user reset the app, or log out.

SiriKit custom intent

Custom intent can only be used as shortcut and NO parameters will be extracted from the voice command.


Improving search experience using NLP

When you are searching “Hike”, “hiking” will be searched out.


NLP and its custom model

NSLinguisticTagger 
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
