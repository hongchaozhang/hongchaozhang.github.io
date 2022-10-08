---
layout: post
title: "重学前端-通过window属性了解协议API"
date: 2022-10-08 17:18:04 +0800
comments: true
categories: [web, html, javascript]
---

<!-- more -->

浏览器的API数目繁多，这一节课，我设计了一个实验，我们一起来给API分分类。

我们按照每个API所在的标准来分类。所以，我们用代码来反射浏览器环境中全局对象的属性，然后我们用JavaScript的filter方法来逐步过滤掉已知的属性。

接下来，我们整理API的方法如下：

1. 从Window的属性中，找到API名称；
1. 查阅MDN或者Google，找到API所在的标准；
1. 阅读标准，手工或者用代码整理出标准中包含的API；
1. 用代码在Window的属性中过滤掉标准中涉及的API。
1. 重复这个过程，我们可以找到所有的API对应的标准。

原文点击[这里](/assets/resources/37丨浏览器API（小实验）：动手整理全部API.html)获取。

从原文整理出来的html文件点击[这里](/assets/resources/traverseWindows.html)获取。

关键js代码如下：

```javascript
function filterOut(names, props) {
    let set = new Set();
    props.forEach(o => set.add(o));
    return names.filter(e => !set.has(e));
}

let names = Object.getOwnPropertyNames(window)
console.log(names)

// 过滤JavaScript 标准规定的属性
let js = new Set();
let objects = ["BigInt", "BigInt64Array", "BigUint64Array", "Infinity", "NaN", "undefined", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Array", "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet", "Function", "Boolean", "String", "Number", "Symbol", "Object", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "ArrayBuffer", "SharedArrayBuffer", "DataView", "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint16Array", "Uint32Array", "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect", "escape", "unescape"];
objects.forEach(o => js.add(o));
names = names.filter(e => !js.has(e));
console.log('\nnames after filtering JS Standard:')
console.log(names)

// 接下来我们看看已经讲过的 DOM 部分，DOM 部分包含了 document 属性和一系列的构造器，我们可以用 JavaScript 的 prototype 来过滤构造器。
names = names.filter( e => {
    try { 
        return !(window[e].prototype instanceof Node)
    } catch(err) {
        return true;
    }
}).filter( e => e != "Node")
console.log('\nnames after filtering DOM:')
console.log(names)

// 接下来我们要找到 Window 对象的定义，我们在下面链接中可以找到。https://html.spec.whatwg.org/#window 这里有一个 Window 接口，是使用 WebIDL 定义的，我们手工把其中的函数和属性整理出来
let windowprops = new Set();
objects = ["window", "self", "document", "name", "location", "history", "customElements", "locationbar", "menubar", " personalbar", "scrollbars", "statusbar", "toolbar", "status", "close", "closed", "stop", "focus", " blur", "frames", "length", "top", "opener", "parent", "frameElement", "open", "navigator", "applicationCache", "alert", "confirm", "prompt", "print", "postMessage", "console"];
objects.forEach(o => windowprops.add(o));
names = names.filter(e => !windowprops.has(e));
console.log('\nnames after filtering WebIDL:')
console.log(names)

// 我们还要过滤掉所有的事件，也就是 on 开头的属性。
names = names.filter( e => !e.match(/^on/))
// webkit 前缀的私有属性我们也过滤掉：
names = names.filter( e => !e.match(/^webkit/))
// 除此之外，我们在 HTML 标准中还能找到所有的接口，这些我们也过滤掉：
let interfaces = new Set();
objects = ["ApplicationCache", "AudioTrack", "AudioTrackList", "BarProp", "BeforeUnloadEvent", "BroadcastChannel", "CanvasGradient", "CanvasPattern", "CanvasRenderingContext2D", "CloseEvent", "CustomElementRegistry", "DOMStringList", "DOMStringMap", "DataTransfer", "DataTransferItem", "DataTransferItemList", "DedicatedWorkerGlobalScope", "Document", "DragEvent", "ErrorEvent", "EventSource", "External", "FormDataEvent", "HTMLAllCollection", "HashChangeEvent", "History", "ImageBitmap", "ImageBitmapRenderingContext", "ImageData", "Location", "MediaError", "MessageChannel", "MessageEvent", "MessagePort", "MimeType", "MimeTypeArray", "Navigator", "OffscreenCanvas", "OffscreenCanvasRenderingContext2D", "PageTransitionEvent", "Path2D", "Plugin", "PluginArray", "PopStateEvent", "PromiseRejectionEvent", "RadioNodeList", "SharedWorker", "SharedWorkerGlobalScope", "Storage", "StorageEvent", "TextMetrics", "TextTrack", "TextTrackCue", "TextTrackCueList", "TextTrackList", "TimeRanges", "TrackEvent", "ValidityState", "VideoTrack", "VideoTrackList", "WebSocket", "Window", "Worker", "WorkerGlobalScope", "WorkerLocation", "WorkerNavigator"];
objects.forEach(o => interfaces.add(o));
names = names.filter(e => !interfaces.has(e));
console.log('\nnames after filtering HTML:')
console.log(names)

// 过滤i18n api
names = names.filter(e => e != "Intl")
console.log(names)

/* Streams 标准
    接下来我看到的属性是： ByteLengthQueuingStrategy。
    同样经过查阅，它来自 WHATWG 的 Streams 标准：
    https://streams.spec.whatwg.org/#blqs-class
*/
names = filterOut(names, ["ReadableStream", "ReadableStreamDefaultReader", "ReadableStreamBYOBReader", "ReadableStreamDefaultController", "ReadableByteStreamController", "ReadableStreamBYOBRequest", "WritableStream", "WritableStreamDefaultWriter", "WritableStreamDefaultController", "TransformStream", "TransformStreamDefaultController", "ByteLengthQueuingStrategy", "CountQueuingStrategy"]);
console.log(names)

/*
    接下来我看到的属性是：WebGLContext​Event。
    显然，这个属性来自 WebGL 标准：
    https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15
*/
names = filterOut(names, ["WebGLContextEvent","WebGLObject", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLTexture", "WebGLUniformLocation", "WebGLActiveInfo", "WebGLShaderPrecisionFormat", "WebGLRenderingContext"]);
console.log(names)

/*
    Web Audio API
    下一个属性是 WaveShaperNode。这个属性名听起来就跟声音有关，这个属性来自 W3C 的 Web Audio API 标准。
    我们来看一下标准：
    https://www.w3.org/TR/webaudio/
*/
names = filterOut(names, ["AudioContext", "AudioNode", "AnalyserNode", "AudioBuffer", "AudioBufferSourceNode", "AudioDestinationNode", "AudioParam", "AudioListener", "AudioWorklet", "AudioWorkletGlobalScope", "AudioWorkletNode", "AudioWorkletProcessor", "BiquadFilterNode", "ChannelMergerNode", "ChannelSplitterNode", "ConstantSourceNode", "ConvolverNode", "DelayNode", "DynamicsCompressorNode", "GainNode", "IIRFilterNode", "MediaElementAudioSourceNode", "MediaStreamAudioSourceNode", "MediaStreamTrackAudioSourceNode", "MediaStreamAudioDestinationNode", "PannerNode", "PeriodicWave", "OscillatorNode", "StereoPannerNode", "WaveShaperNode", "ScriptProcessorNode", "AudioProcessingEvent"]);
console.log(names)

/*
    Encoding 标准
    在我的环境中，下一个属性是 TextDecoder，经过查阅得知，这个属性也来自一份 WHATWG 的标准，Encoding：
    https://encoding.spec.whatwg.org/#dom-textencoder
*/
names = filterOut(names, ["TextDecoder", "TextEncoder", "TextDecoderStream", "TextEncoderStream"]);
console.log(names)

/*
    Web Cryptography API
    我们继续看下去，下一个属性是 SubtleCrypto，这个属性来自 Web Cryptography API，也是 W3C 的标准。
    https://www.w3.org/TR/WebCryptoAPI/
    这份标准中规定了三个 Class 和一个 Window 对象的扩展，给 Window 对象添加了一个属性 crypto。
*/
names = filterOut(names, ["CryptoKey", "SubtleCrypto", "Crypto", "crypto"]);
console.log(names)

/*
    Media Source Extensions
    下一个属性是 SourceBufferList，它来自于：
    https://www.w3.org/TR/media-source/
    这份标准中包含了三个接口，这份标准还扩展了一些接口，但是没有扩展 window。
*/
names = filterOut(names, ["MediaSource", "SourceBuffer", "SourceBufferList"]);
console.log(names)
```
