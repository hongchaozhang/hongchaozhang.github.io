---
layout: post
title: "Offline Natural Language Understanding Engine on iOS"
date: 2019-05-22 16:04:28 +0800
comments: true
categories: [ios, machine learning, NLP, NLU]
---

<!-- more -->

- [Objective](#objective)
  - [What is a good NLU engine](#what-is-a-good-nlu-engine)
    - [Deterministic behavior](#deterministic-behavior)
    - [Generalization power](#generalization-power)
- [Design and Workflow](#design-and-workflow)
- [Deterministic Intent Parser](#deterministic-intent-parser)
- [Probabilistic Intent Parser](#probabilistic-intent-parser)
  - [Intent Classification](#intent-classification)
    - [Model Training](#model-training)
    - [Model Usage](#model-usage)
  - [Slot Filling](#slot-filling)
    - [Model Training](#model-training-1)
    - [Model Usage](#model-usage-1)
  - [Model Size](#model-size)
  - [Problems to Be Solved](#problems-to-be-solved)
    - [Intent Classification Model Has No Probability Output](#intent-classification-model-has-no-probability-output)
    - [Slot Filling Model Tagges the Label by Words, not Phrase](#slot-filling-model-tagges-the-label-by-words-not-phrase)


<a id="markdown-objective" name="objective"></a>
## Objective

![nlu objective](/images/NLUObjective.png)

We want an NLU Engine to understand the normal text command on Mobile. We hope the engine can know the command's intent and the info the command needs to execute.

Currently, there are many NLU related tools, like Google Dialogflow, Amazon Lex, Facebook Wit.ai, Microsoft Luis. However, they are all online tools. Considering the privacy problem, we are trying to build our own offline NLU Engine.

<a id="markdown-what-is-a-good-nlu-engine" name="what-is-a-good-nlu-engine"></a>
### What is a good NLU engine

Let’s start by looking at a simple example, and see what you would expect from a good NLU engine.

First, we need some examples to train the NLU engine. Consider the following dataset, used to train a simple weather assistant with a few query examples:

* Give me the weather for \[tomorrow](date)
* Show me the \[Paris](location) weather for \[Sunday](date)
  
<a id="markdown-deterministic-behavior" name="deterministic-behavior"></a>
#### Deterministic behavior

The first thing you want is that all the examples you give to train the model are correctly supported by the engine. This makes the system predictable and easy to use: if a query is not correctly parsed, then add it to the dataset and it will work right away.

<a id="markdown-generalization-power" name="generalization-power"></a>
#### Generalization power

Having this deterministic behavior is great for robustness and predictability, but a powerful NLU engine also needs to have some generalization power. You want the system not only to recognize patterns provided in the training set, but also all the possible variations that come from speaking naturally. If we go back to the previous dataset, it is reasonable to expect the NLU engine to parse a query like: “What’s the weather in Beijing right now?” even though it is not one of the training examples.

<a id="markdown-design-and-workflow" name="design-and-workflow"></a>
## Design and Workflow

![nlu design](/images/NLUDesign.png)

In order to satisfy these objectives: deterministic behavior and generalization power, we built the processing pipeline described in the figure above. It receives a text as input, and outputs a structured response containing the intent and the list of slots. The main processing unit of the pipeline is the NLU engine. It contains two intent parsers which are called successively: a deterministic intent parser and a probabilistic one.

The deterministic parser relies on regular expressions to match intent and slots, which results in perfect behavior on training examples but doesn’t generalize. This parser is the first to be used because of its strictness.

The probabilistic parser is used whenever the first parser fails to find a match. It uses machine learning to generalize beyond the set of sentences seen at train time, thus making our NLU engine be able to cope with examples which are not in the scope of the training data set. This parser involves two successive steps: intent classification and slot filling. These two steps rely on trained machine learning models to classify intent and extract slots.

<a id="markdown-deterministic-intent-parser" name="deterministic-intent-parser"></a>
## Deterministic Intent Parser

The Deterministic Intent Parse is the first step to be used. This parser relies on some regular expressions to match the intent and slots. If the new input has the same structure with one of the training examples, we will find its intent and slots by comparing the input with the matched regular expression. 

The regular expressions are built based on the training examples. For a training case:

* What is the weather in \[Alaska](location)

We will build a regular expression:

* (what is the weather in)(?&lt;location1&gt;.+)
 
<a id="markdown-probabilistic-intent-parser" name="probabilistic-intent-parser"></a>
## Probabilistic Intent Parser

If the Deterministic Intent Parser fails to find the intent and slots, the Probabilistic Intent Parser will be used.

The Probabilistic Intent Parser has two steps:

* Intent Classification
* Slot Filling

The Intent Classification is to find the intent of the input command text, and the Slot Filling is to extract all the slots needed by the intent. These two steps are both based on trained machine models.

Apple has released CreateML for training natural language models, which also integrates the powerful NatrualLanguage framework functions, like Tokenization, Part of Speech, Lemmatization, Name Entity Recognition, etc. This will make the training process very simple, and the trained model will be more accurate and smaller.

<a id="markdown-intent-classification" name="intent-classification"></a>
### Intent Classification

<a id="markdown-model-training" name="model-training"></a>
#### Model Training

For Intent Classification model training, we prepare the data set as follows (The size of the training data is 3282 falling into four intents.):

```
[
  {
    "text": "I would like the forecast in cupertino california  tomorrow", 
    "label": "searchWeatherForecast"
  }, 
  {
    "text": "Forecast in Maine USA next week", 
    "label": "searchWeatherForecast"
  }, 
...
...
  {
    "text": "Will I be able to wear open-toed shoes twenty three hours and seven minutes from now in Severn?", 
    "label": "searchWeatherForecastItem"
  }, 
  {
    "text": "Should I bring a raincoat to the Belgrade and Loreto areas of Oman at midnight?", 
    "label": "searchWeatherForecastItem"
  }, 
...
...
]
```

Apple has release CreateML framework for training machine learning models easily inside Swift playground and the trained model can be saved as mlmodel type. And the MLTextClassifier class from CreateML will benefit from Apple's NatrualLanguage framework for Tokenization, Part of Speech, Lemmatization, etc.

The training script is:

```
let trainingDataPath = Bundle.main.path(forResource: "intentClassificationFile", ofType: "json", inDirectory: "Data/text/train")!
let trainingData = try! MLDataTable(contentsOf:  URL(fileURLWithPath: trainingDataPath))

// Initializing the classifier with a training data.
let classifier = try! MLTextClassifier(trainingData: trainingData, textColumn: "text", labelColumn: "label")

// Evaluating training & validation accuracies.
let trainingAccuracy = (1.0 - classifier.trainingMetrics.classificationError) * 100
let validationAccuracy = (1.0 - classifier.validationMetrics.classificationError) * 100

// Initializing the properly labeled testing data from Resources folder.
let testingDataPath = Bundle.main.path(forResource: "intentClassificationFile", ofType: "json", inDirectory: "Data/text/test")!
let testingData = try! MLDataTable(contentsOf: URL(fileURLWithPath:testingDataPath))

// Counting the testing evaluation.
let evaluationMetrics = classifier.evaluation(on: testingData)
let evaluationAccuracy = (1.0 - evaluationMetrics.classificationError) * 100

// Confusion matrix in order to see which labels were classified wrongly.
let confusionMatrix = evaluationMetrics.confusion
print("Confusion matrix: \(confusionMatrix)")

// Metadata for saving the model.
let metadata = MLModelMetadata(author: "Hongchao Zhang",
                            shortDescription: "A model trained to classify weather related commands.",
                            version: "1.0")

// Saving the model. Remember to update the path.
try! classifier.write(to: URL(fileURLWithPath: "/Users/hozhang/Downloads/textClassifier.mlmodel"),
                    metadata: metadata)
```

We can get 99.23% training accuracy and 98.87% validation accuracy.

<a id="markdown-model-usage" name="model-usage"></a>
#### Model Usage

For the trained model of mlmodel type, we can use it in our iOS app through NLModel (from NatrualLanguage framework). The demo swift code may be like:

```
let modelUrl = Bundle.main.url(forResource: "Data/text/textClassifier", withExtension: "mlmodel")
let compiledModelUrl = try! MLModel.compileModel(at: modelUrl!)
let classifier = try! NLModel(contentsOf: compiledModelUrl)

let text = requestText
let label = classifier.predictedLabel(for: text)

print("text: \(text)\nlabel:\(label ?? "Not detected!")")
```

> **How to use .mlmodel file?**
>  
> .mlmodel file needs to be compiled before using. There are two ways to do this: offline and online:
>  
> 1. offline: drag the mlmodel into your project, xcode will compile the .mlmodel for you before you build you app.
> 2. online: use `MLModel.compileModel` to compile your .mlmodel file at runtime. This is especially useful when your are at swift playground, where you cannot get xcode's help for comipling.

<a id="markdown-slot-filling" name="slot-filling"></a>
### Slot Filling

<a id="markdown-model-training-1" name="model-training-1"></a>
#### Model Training

For Slot Filling model training, we prepare the data set as follows (The size of the training data is: 3282.):

```
[
  {
    "tokens": ["I", "would", "like", "the", "forecast", "in", "california", "tomorrow"], 
    "labels": ["none", "none", "none", "none", "none", "none", "location", "date"]
  }, 
  {
    "tokens": ["Forecast", "in", "Maine", "next week"], 
    "labels": ["none", "none", "location", "date"]
  }, 
...
...
]
```

Like Intent Classification model training, CreateML framework also makes it easy. Like MLTextClassifier, the MLWordTagger class from CreateML will also benefit from NatrualLanguage framework for Part of Speech, Lemmatization, Name Entity Recognition, etc.

The training script is:

```
// Initializing the training data from Resources folder.
let trainingDataPath = Bundle.main.path(forResource: "slotParsingFile", ofType: "json", inDirectory: "Data/text/train")!
let trainingData = try! MLDataTable(contentsOf:  URL(fileURLWithPath: trainingDataPath))

// Initializing the classifier with a training data.
let classifier = try! MLWordTagger(trainingData: trainingData, tokenColumn: "tokens", labelColumn: "labels")

// Evaluating training & validation accuracies.
let trainingAccuracy = (1.0 - classifier.trainingMetrics.taggingError) * 100
let validationAccuracy = (1.0 - classifier.validationMetrics.taggingError) * 100

// Initializing the properly labeled testing data from Resources folder.
let testingDataPath = Bundle.main.path(forResource: "slotParsingFile", ofType: "json", inDirectory: "Data/text/test")!
let testingData = try! MLDataTable(contentsOf: URL(fileURLWithPath:testingDataPath))

// Counting the testing evaluation.
let evaluationMetrics = classifier.evaluation(on: testingData)
let evaluationAccuracy = (1.0 - evaluationMetrics.taggingError) * 100

// Confusion matrix in order to see which labels were classified wrongly.
let confusionMatrix = evaluationMetrics.confusion
print("Confusion matrix: \(confusionMatrix)")

// Metadata for saving the model.
let metadata = MLModelMetadata(author: "Hongchao Zhang",
                                shortDescription: "A model trained to parse slots from weather related commands.",
                                version: "1.0")

// Saving the model. Remember to update the path.
try! classifier.write(to: URL(fileURLWithPath: "/Users/hozhang/Downloads/slotParsing.mlmodel"),
                        metadata: metadata)
```

We can get 99.64% training accuracy and 98.38% validation accuracy.

<a id="markdown-model-usage-1" name="model-usage-1"></a>
#### Model Usage

We can load the mlmodel into an NLTagger (from NatrualLanguage framework), and use the NLTagger to tag labels for each word of the input command text. The demo swift script is like:

```
let weatherTagSchema = NLTagScheme("Weather")
let modelUrl = Bundle.main.url(forResource: "Data/text/slotParsing", withExtension: "mlmodel")
let compiledModelUrl = try! MLModel.compileModel(at: modelUrl!)
let taggerModel = try! NLModel(contentsOf: compiledModelUrl)

let weatherTagger = NLTagger(tagSchemes: [weatherTagSchema])
weatherTagger.setModels([taggerModel], forTagScheme: weatherTagSchema)

let text = requestText
weatherTagger.string = text
weatherTagger.enumerateTags(in: text.startIndex..<text.endIndex, unit: .word, scheme: weatherTagSchema, options: []) { (tag, tokenRange) -> Bool in
    if let tag = tag, tag.rawValue != "Whitespace" {
        print("\(text[tokenRange]): \(tag.rawValue)")
    }
    return true
}
```

** Reference **

1. [Creating a Text Classifier Model](https://developer.apple.com/documentation/createml/creating_a_text_classifier_model): Apple offical site for training and using machine learning models through CreateML framework.
2. WWDC video [Introducing Natural Language Framework](https://developer.apple.com/videos/play/wwdc2018/713/): This session introduces NLP framework and its relation with CreateML framework.

<a id="markdown-model-size" name="model-size"></a>
### Model Size

For the iOS app, we hope the machine learning model size is small enough. Apple's NatrualLanguage framework has done many optimizations on machine learning model size. The following data is from WWDC 2018 (session 713: Introducing NatrualLanguage Framework):

-- | Open Source CRFSuite | Natural Language Framework
---- | ---- | ----
Name Entity Recognition	| 70MB	| 1.4MB
Chunking | 30MB | 1.8MB

We can see that the model will be much smaller than that trained from an open source platform.

The size of the two models we trained is (The training data size is: 3282):

 Model | Size 
---- | ---- | ----
Intent Classification | 41K
Slot Filling | 609K

If your model is a neural network, you can reduce the size of your model by the following way:
[Reducing the Size of Your Core ML App](https://developer.apple.com/documentation/coreml/reducing_the_size_of_your_core_ml_app). You can control the precision of the neural network parameters, and thus the size of the trained model.

If still your model is large, you can
[Downloading and Compiling a Model on the User's Device](https://developer.apple.com/documentation/coreml/core_ml_api/downloading_and_compiling_a_model_on_the_user_s_device) at runtime.

<a id="markdown-problems-to-be-solved" name="problems-to-be-solved"></a>
### Problems to Be Solved

For Probabilistic Intent Parser, we still have some problems.

<a id="markdown-intent-classification-model-has-no-probability-output" name="intent-classification-model-has-no-probability-output"></a>
#### Intent Classification Model Has No Probability Output

We may need the probability to define the reliability of the estimated intent of an input command text.

However, the model trained through `MLTextClassifier` has no probability output API. If we really need the probability output, we can use other platforms to train the model, like tensorflow. That way, we will not benefit from NatrualLanguage framework and we need to consider these things by ourselves, like Tokenization, Part of Speech, Lemmatization, etc.

> Try other tools for training models with probability output, like Turi.

<a id="markdown-slot-filling-model-tagges-the-label-by-words-not-phrase" name="slot-filling-model-tagges-the-label-by-words-not-phrase"></a>
#### Slot Filling Model Tagges the Label by Words, not Phrase

The NLTagger class only supply the following four tag level: word, sentence, paragraph, and document. There is no "phrase" tag level. For example, "New York" will be treated as "New" and "York", and the tagged label will both be "location". We need to compose them together manually.