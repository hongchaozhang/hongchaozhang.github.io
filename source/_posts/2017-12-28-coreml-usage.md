---
layout: post
title: "CoreML Usage"
date: 2017-12-28 17:25:39 +0800
comments: true
categories: [ios]
---

<!-- more -->
<!-- TOC -->

- [Model Usage](#model-usage)
- [Model Training](#model-training)
    - [Basic](#basic)
    - [Advanced](#advanced)
- [CoreML Pros and Cons](#coreml-pros-and-cons)
    - [Pros](#pros)
    - [Cons](#cons)

<!-- /TOC -->

<a id="markdown-model-usage" name="model-usage"></a>
## Model Usage

When you load a trained machine learning model (.mlmodel) into xcode, the screenshot is like (take inceptionv3.mlmodel as an example):

![machine learning model imported to xcode](/images/mlmodel_in_xcode.png)

From *Model Class* (section A), we can see that xcode has *Automatically generated Swift model calss*. Click the right arrow to view the generated model class.

If the model class is not generated successfully, double check *Target Membership* (section B) to make sure the mlmodel file is added into the correct target.

From *Model Evaluation Parameters*(section C), we can see the input and output of the trained model.

The following is a sample usage of image classification model:

```swift

// create request
guard let selectedModel = try? VNCoreMLModel(for: Inceptionv3().model) else {
    fatalError("Could not load model. Ensure model has been drag and dropped (copied) to XCode Project. Also ensure the model is part of a target.")
}     

let classificationRequest = VNCoreMLRequest(model: selectedModel, completionHandler: classificationCompleteHandler)
classificationRequest.imageCropAndScaleOption = VNImageCropAndScaleOption.centerCrop // Crop from centre of images and scale to appropriate size.

...

// run request against an image
guard let pixbuff = (sceneView.session.currentFrame?.capturedImage) else { return }
let ciImage = CIImage(cvPixelBuffer: pixbuff)
// Note1: Not entirely sure if the ciImage is being interpreted as RGB, but for now it works with the Inception model.
// Note2: Also uncertain if the pixelBuffer should be rotated before handing off to Vision (VNImageRequestHandler) - regardless, for now, it still works well with the Inception model.

let imageRequestHandler = VNImageRequestHandler(ciImage: ciImage, options: [:])

do {
    try imageRequestHandler.perform([classificationRequest])
} catch {
    print(error)
}

...

// completion handler for coping with image classification results.
func classificationCompleteHandler(request: VNRequest, error: Error?) {
    if error != nil {
        print("Error: " + (error?.localizedDescription)!)
        return
    }
    
    guard let observations = request.results else {
        print("No results")
        return
    }
    
    // Get Classifications
    let classifications = observations[0...1] // top 2 results
        .flatMap({ $0 as? VNClassificationObservation })
        .filter({ $0.confidence > 0.2 })
        .map({ "\($0.identifier) \(String(format:"- %.2f", $0.confidence))" })
        .joined(separator: "\n")

    print("image recognition: " + classifications)
}

```

Refer to [Build more intelligent apps with machine learning](https://developer.apple.com/machine-learning/) for some official materials.

For some detailed usage step by step, refer to [Core ML and Vision: Machine Learning in iOS 11 Tutorial](https://www.raywenderlich.com/164213/coreml-and-vision-machine-learning-in-ios-11-tutorial).

<a id="markdown-model-training" name="model-training"></a>
## Model Training

<a id="markdown-basic" name="basic"></a>
### Basic

![Custom Vision From MicroSoft](/images/CustomVisionFromMicroSoft.png)

Microsoft [Custom Vision](https://www.customvision.ai/) supplies a very friendly UI interface. You can upload you images and label them very easily. After training is done, you can export the model for mobile devices, including: mlmodel file for iOS platform, and TensorFlow model on Android platform.

Friendly UI Interface:

![interface of microsoft custom vision](/images/InterfaceOfCustomVision.png)

But there are some limitations, as [Custom Vision](https://www.customvision.ai/) is still in preview process.

![limitation of microsoft custom vision](/images/MicroSoftCustomVisionLimitation.png)

<a id="markdown-advanced" name="advanced"></a>
### Advanced

[apple turicreate image classification](https://github.com/apple/turicreate/tree/master/userguide/image_classifier) supplies more configurations for model training, like the partition of trainning data and verification data. But some Python experience is needed.

<a id="markdown-coreml-pros-and-cons" name="coreml-pros-and-cons"></a>
## CoreML Pros and Cons

<a id="markdown-pros" name="pros"></a>
### Pros

1. **Easy to use.** As described at the beginning of the post.

1. **High performance.** As is said:

    > “It was amazing to see the prediction results immediately without any time interval.”

<a id="markdown-cons" name="cons"></a>
### Cons

**Lack of federated learning.** As is said:

> There are no provisions within Core ML for model retraining or federated learning, where data collected from the field is used to improve the accuracy of the model. That’s something you would have to implement by hand, most likely by asking app users to opt in for data collection and using that data to retrain the model for a future edition of the app.

Refer to [Apple’s Core ML: The pros and cons](https://www.infoworld.com/article/3200885/machine-learning/apples-core-ml-the-pros-and-cons.html).