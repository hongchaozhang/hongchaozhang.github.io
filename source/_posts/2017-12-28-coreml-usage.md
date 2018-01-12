---
layout: post
title: "CoreML Usage"
date: 2017-12-28 17:25:39 +0800
comments: true
categories: [ios]
---

<!-- more -->


## Model Usage

When you load a trained machine learning model (.mlmodel) into xcode, the screenshot is like (take inceptionv3.mlmodel as an example):

![machine learning model imported to xcode](/images/mlmodel_in_xcode.png)

From *Model Class* (section A), we can see that xcode has *Automatically generated Swift model calss*. Click the right arrow to view the generated model class.

If the model class is not generated successfully, double check *Target Membership* (section B) to make sure the mlmodel file is added into the correct target.

From *Model Evaluation Parameters*(section C), we can see the input and output of the trained model.

```swift

guard let selectedModel = try? VNCoreMLModel(for: Inceptionv3().model) else {
    fatalError("Could not load model. Ensure model has been drag and dropped (copied) to XCode Project. Also ensure the model is part of a target.")
}     

let classificationRequest = VNCoreMLRequest(model: selectedModel, completionHandler: classificationCompleteHandler)
classificationRequest.imageCropAndScaleOption = VNImageCropAndScaleOption.centerCrop // Crop from centre of images and scale to appropriate size.

...

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

```

Refer to [Build more intelligent apps with machine learning](https://developer.apple.com/machine-learning/) for some official materails.

For some detailed usage step by step, refer to [Core ML and Vision: Machine Learning in iOS 11 Tutorial](https://www.raywenderlich.com/164213/coreml-and-vision-machine-learning-in-ios-11-tutorial).

## Model Training

### Basic

![Custom Vision From MicroSoft](/images/CustomVisionFromMicroSoft.png)

来自微软的[Custom Vision](https://www.customvision.ai/)，提供UI界面，可以直接上传图片，并进行标注。训练好之后可以到处模型供移动设备使用：iOS平台导出mlmodel，Android平台导出供TensorFlow使用的model。

使用界面友好：

![interface of microsoft custom vision](/images/InterfaceOfCustomVision.png)

但是由于Custom Vision仍然处于测试阶段，所以有很多限制：

![limitation of microsoft custom vision](/images/MicroSoftCustomVisionLimitation.png)

### Advanced

[apple turicreate image classification](https://github.com/apple/turicreate/tree/master/userguide/image_classifier)有更多的参数可以设置，比如训练集和测试集的比例。需要写一些python代码。

## CoreML Pros and Cons

Refer to [Apple’s Core ML: The pros and cons](https://www.infoworld.com/article/3200885/machine-learning/apples-core-ml-the-pros-and-cons.html).