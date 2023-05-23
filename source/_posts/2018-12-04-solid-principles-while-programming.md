---
layout: post
title: "编程中的SOLID原则"
date: 2018-12-04 11:31:35 +0800
comments: true
categories: [design pattern]
---

Robert C. Martin (Bob大叔)在《敏捷软件开发》中提出了编程过程中的五个原则，以适应敏捷开发（Agile）的特点：以微小增量的方式构建软件。

<!-- more -->

<br>

- [SOLID原则](#solid原则)
- [单一职责原则（The Single Responsibility Principle，简称SRP）](#单一职责原则the-single-responsibility-principle简称srp)
  - [定义](#定义)
  - [什么是职责](#什么是职责)
  - [结论](#结论)
- [开放——封闭原则（The Open-Close Principle，简称OCP）](#开放封闭原则the-open-close-principle简称ocp)
  - [定义](#定义-1)
  - [关键是抽象](#关键是抽象)
    - [接口](#接口)
    - [继承](#继承)
  - [什么时候进行抽象](#什么时候进行抽象)
  - [结论](#结论-1)
- [Liskov替换原则（The Liskov Substitution Priciple，简称LSP）](#liskov替换原则the-liskov-substitution-priciple简称lsp)
  - [定义](#定义-2)
  - [一个违反LSP的简单例子](#一个违反lsp的简单例子)
  - [正方形和长方形的关系：更微妙的违规](#正方形和长方形的关系更微妙的违规)
  - [其它一些容易导致违反LSP的习惯用法](#其它一些容易导致违反lsp的习惯用法)
    - [子类中的退化函数](#子类中的退化函数)
    - [子类抛出基类没有的异常](#子类抛出基类没有的异常)
  - [结论](#结论-2)
- [依赖倒置原则（The Dependency Inversion Principle，简称DIP）](#依赖倒置原则the-dependency-inversion-principle简称dip)
  - [定义](#定义-3)
  - [依赖于抽象](#依赖于抽象)
  - [一个例子](#一个例子)
  - [结论](#结论-3)
- [接口隔离原则（The Interface Segregation Principle，简称ISP）](#接口隔离原则the-interface-segregation-principle简称isp)
  - [定义](#定义-4)
  - [一个例子：定时门](#一个例子定时门)
    - [使用委托对接口分组](#使用委托对接口分组)
    - [使用多重继承对接口分组](#使用多重继承对接口分组)
  - [一个例子：ATM界面](#一个例子atm界面)
    - [多参数形式与单参数形式](#多参数形式与单参数形式)
  - [结论](#结论-4)
 
 <br>

<a id="markdown-solid原则" name="solid原则"></a>
## SOLID原则

SOLID是指我们编程时应该遵守的五个原则：

1. 单一职责原则（The Single Responsibility Principle，简称SRP）
2. 开放——封闭原则（The Open-Close Principle，简称OCP）
3. Liskov替换原则（The Liskov Substitution Priciple，简称LSP）
4. 依赖倒置原则（The Dependency Inversion Principle，简称DIP）
5. 接口隔离原则（The Interface Segregation Principle，简称ISP）

每个原则取一个字母（**S**RP，**O**CP，**L**SP，**I**SP，**D**IP），合称SOLID原则。

<a id="markdown-单一职责原则the-single-responsibility-principle简称srp" name="单一职责原则the-single-responsibility-principle简称srp"></a>
## 单一职责原则（The Single Responsibility Principle，简称SRP）

<a id="markdown-定义" name="定义"></a>
### 定义
**就一个类而言，应该只有一个引起它变化的原因。**

一个类如果有多个职责，但是你只需要其中的一个职责，你也不得不将其它职责包括进来，还有其它职责所依赖的所有组件。

<a id="markdown-什么是职责" name="什么是职责"></a>
### 什么是职责

在SRP中，我们把职责定义为“变化的原因”（a reason for change）。如果能够想到多于一个的动机去改变一个类，那么这个类就具有多于一个的职责。

比如Employee这个类如果同时包含了业务规则和对于持久化的控制，多数情况下，我们可以断定它们不应该放在一起：业务规则会频繁地变化，但是持久化的方式却不会如此频繁地变化，并且变化的原因也是完全不同的。

<a id="markdown-结论" name="结论"></a>
### 结论

SRP是所有原则中最简单的，也是最难运用的。软件设计很多时候要做的，就是发现职责，并把它分离出来。事实上，我们将要论述的其它原则都会以这样或者那样的方式回到这个问题上。

<a id="markdown-开放封闭原则the-open-close-principle简称ocp" name="开放封闭原则the-open-close-principle简称ocp"></a>
## 开放——封闭原则（The Open-Close Principle，简称OCP）

<a id="markdown-定义-1" name="定义-1"></a>
### 定义

**软件实体（类、模块、函数等）应该是可以扩展，但是不可修改的。**

OCP的定义，换个说法：

* 对扩展开放（Open for extension）
* 对修改封闭（Close for modification）

如果程序中的一处改动就会产生连锁反应，导致一系列相关模块的改动，OCP建议我们应该对程序进行重构。重构之后再进行同样的修改，就只需要添加新的功能模块，不需要对原有的代码进行修改。

如何在能在不改变模块原代码的情况下去更改它的行为或者为其添加功能呢？

<a id="markdown-关键是抽象" name="关键是抽象"></a>
### 关键是抽象

抽象一般有两种方式：
1. 接口
2. 继承

<a id="markdown-接口" name="接口"></a>
#### 接口

用接口对需要的对象进行抽象，也就是所谓的“面向接口编程”。

![interface programming](/images/InterfaceProgramming.jpg)

上面的a图是一个不遵循OCP的设计。Client和Server都是具体的类，Client要使用Server。如果我们希望Client使用另外一个不同的Server类，那么就需要把Client里面使用Server的地方都做响应的修改。

上面的b图是一个符合OCP的设计。如果需要使用一个不同的服务器类，只需要重新实现这个类，保证这个类也实现类ClientInterface接口，则Client这个类不需要做修改，同时扩展类Client的功能。

> 这个接口为什么叫ClientInterface，而不叫ServerInterface或者AbstractServer之类？因为这个接口和Client的关系更密切。

<a id="markdown-继承" name="继承"></a>
#### 继承

继承一个抽象类（和接口类似）或者重写一个父类中的（虚）方法，也是OCP的惯用伎俩。典型的例子，就是那个图形的绘制的例子。

```
class Shape {
    func draw() {}
};

class Square: Shape {
    override func draw() {
        // draw square
    }
};

class Circle: Shape {
    override func draw() {
        // draw circle
    }
};

void drawAllShapes([Shape] list) {
    for (Shape shape in list) {
        shape.draw()
    }
}
```

如果想扩展drawAllShapes方法，使其可以绘制一种新的形状，只需要重新创建一个Shape类的子类，drawAllShapes函数不需要改变，即可实现功能的扩展。这就是OCP。

<a id="markdown-什么时候进行抽象" name="什么时候进行抽象"></a>
### 什么时候进行抽象

即使是上面的形状绘制的例子，也不是完全的“对扩展开放，对修改关闭。”比如，我要求所有的圆必须在正方形之前绘制，就没法在不修改drawAllShapes的情况下进行这个功能扩展。

我们无法准确预测未来的功能扩展需求，所以，理论上来说，我们也无法实现完全的“对扩展开放，对修改关闭。”

而且更重要的，遵循OCP进行抽象的代价也是昂贵的。创建正确的抽象需要花费开发时间和精力。同时，这些抽象也增加了软件的设计复杂度。开发人员有能力处理的抽象的数量也是有限的。

所以，不要试图在刚开始就实现OCP，可以试着遵循下面的准则：

* 只受一次愚弄

也就是说，在刚开始编写代码的时候，假设变化不会发生。当变化发生时，我们就创建抽象进行隔离，防止以后发生同类变化。

<a id="markdown-结论-1" name="结论-1"></a>
### 结论

在很多方面，OCP都是面向对象设计的核心所在。遵循这个原则，可以带来面向对象技术所声称的巨大好处（也就是，灵活性、可重用性以及可维护性）。但是，对程序的每个部分都肆意地进行抽象也不是一个好主意。拒绝不成熟的抽象和抽象本身一样重要。

<a id="markdown-liskov替换原则the-liskov-substitution-priciple简称lsp" name="liskov替换原则the-liskov-substitution-priciple简称lsp"></a>
## Liskov替换原则（The Liskov Substitution Priciple，简称LSP）

<a id="markdown-定义-2" name="定义-2"></a>
### 定义

**子类型必须能够替换掉它们的基类型。**

假设一个函数f，它的参数是某个基类型B。如果将基类型B的子类D传给f，会导致f出现错误的行为，那么D就违反了LSP原则。

此时，f的编写者想在f内对D进行检测，以便在把D传给f时，可以使f具有正确的行为。这个行为又违反了OCP原则，因为此时f对于基类型B的所有子类都不在封闭。

<a id="markdown-一个违反lsp的简单例子" name="一个违反lsp的简单例子"></a>
### 一个违反LSP的简单例子

对于LSP的违反常常会导致以明显违反OCP的方式使用运行时类型检测。这种方式常常是使用一个显式的if语句去确定一个对象的类型，以便于能够选择针对该类型的正确行为。考虑下面的例子：


```
class Shape {
    
};

class Square: Shape {
    func drawSquare() {
        // draw square
    }
};

class Circle: Shape {
    func drawCircle() {
        // draw circle
    }
};

void drawAllShapes([Shape] list) {
    for (Shape shape in list) {
        if (shape is Square) {
            shape.drawSquare()
        } else if (shape is Circle) {
            shape.drawCircle()
        }
    }
}
```

很显然，上面的drawAllShapes违反了OCP原则，它必须知道所有的Shape的子类，并且，每创建一个子类，都需要修改drawAllShapes函数。

Square和Circle不能替换其基类型Shape就是违反了LSP原则，这又进一步导致了drawAllShapes违反了OCP原则。因而，对于LSP的违反也潜在违反了OCP原则。

<a id="markdown-正方形和长方形的关系更微妙的违规" name="正方形和长方形的关系更微妙的违规"></a>
### 正方形和长方形的关系：更微妙的违规

下面正方形继承长方形的例子，很微妙地违反了LSP原则。

长方形的实现如下：

```
class Rectangle {
    var width: Double = 0
    var height: Double = 0

    func getWidth() -> Double {
        return width
    }

    func getHeight() -> Double {
        return height
    }

    func setWidth(_ width: Double) {
        self.width = width
    }

    func setHeight(_ height: Double) {
        self.height = height
    }

    func getArea() -> Double {
        return self.width * self.height
    }
}
```

正方形IS-A长方形，按照面向对象分析的方法，正方形应该继承长方形。同时为了保证正方形的四个边长度一致，需要对`setWidth`和`setHeight`两个函数重写。

实现如下：

```
class Square: Rectangle {
    override func setWidth(_ width: Double) {
        self.width = width
        self.height = width
    }

    override func setHeight(_ height: Double) {
        self.width = height
        self.height = height
    }
}
```

Square看起来工作不错，而且这个设计似乎也是自相容的，正确的。可是这个结论是错误的，一个自相容的程序未必就和所有的用户程序相容。考虑下面的函数：

```
func tempFunc(_ rect: Rectangle) {
    rect.setWidth(4)
    rect.setHeight(5)
    assert(rect.getArea() == 4*5)
}
```

如果传递一个Square的实例给`tempFunc`，那么程序就会报错。

有人可能对`tempFunc`存在的问题进行争辩，说函数`tempFunc`的编写者不应该假设宽和长是独立变化的。这时候`tempFunc`的编写者肯定不同意：函数以Rectangle为参数，长宽独立变化就是长方形的特性，为什么不能用？

这时候，我们应该反过来思考一下：IS-A是不是继承的唯一标准？

**IS-A不应该成为继承的准则，“可替换性”才是。**

<a id="markdown-其它一些容易导致违反lsp的习惯用法" name="其它一些容易导致违反lsp的习惯用法"></a>
### 其它一些容易导致违反LSP的习惯用法

<a id="markdown-子类中的退化函数" name="子类中的退化函数"></a>
#### 子类中的退化函数

当子类在重写基类函数的时候，如果功能不如基类完备，即出现了退化，那么这个子类在某些情况下就不能替换基类，违反了LSP原则。

> 这也许就是一些语言在子类重写基类函数的时候必须通过super调用基类函数，这就保证了重写不会退化。但是在Swift和Objective-C中可以不调用super。

<a id="markdown-子类抛出基类没有的异常" name="子类抛出基类没有的异常"></a>
#### 子类抛出基类没有的异常

此时要遵循LSP，要么改变使用者的期望，要么子类不抛出这个异常。

<a id="markdown-结论-2" name="结论-2"></a>
### 结论

OCP是很多说法的核心，而LSP是使OCP成为可能的主要原则之一。正是子类的可替换性才使得使用基类类型的模块在无需修改的情况下就可以扩展。这种可替换性必须是开发人员可以隐式依赖的东西。

<a id="markdown-依赖倒置原则the-dependency-inversion-principle简称dip" name="依赖倒置原则the-dependency-inversion-principle简称dip"></a>
## 依赖倒置原则（The Dependency Inversion Principle，简称DIP）

<a id="markdown-定义-3" name="定义-3"></a>
### 定义

* **高层模块不应该依赖于低级模块。二者都应该依赖于抽象。**
* **抽象不应该依赖于细节，细节应该依赖于抽象。**

> 这里的“抽象”是指接口或者抽象类。

> 为什么用”倒置“：这是相对于传统的软件开发，比如结构化分析和设计。在这些设计中，倾向于创建一些高层模块依赖于低层模块的模块，策略（Policy）依赖于细节的软件结构。而DIP要求大家都依赖于抽象，而且这个抽象绝对不会放在低层模块中，而是放在高层模块中（或者独立出来一个模块），所以，不再是高层模块依赖低层模块，而是低层模块依赖高层模块（中的抽象）。

传统软件开发可能会设计出下面这样的程序结构：

![DIP bad design](/images/DIP_bad_design.jpg)

在这个设计中，高层模块依赖于低层模块，如果要重用，必须同时引入低层模块。如果高层模块能够独立于低层模块，那么，高层模块就可以非常容易地被重用。该原则是框架（framework）设计的核心原则。

![DIP good design](/images/DIP_good_design.jpg)

上图展示了一个更为合适的模型。每个高层模块都为它所需要的服务声明一个独立的接口，较低的层次实现这些抽象接口，每个高层模块都通过接口使用低层模块。这样，高层模块就不依赖于低层模块，低层模块反而依赖于高层模块中定义的抽象服务接口。

> 其实，低层模块也有重用的问题，也不应该直接依赖于高层模块。这里，应该将高层模块抽象出来的接口独立成一个模块，大家都依赖这个模块。

**这里的倒置不仅仅是依赖关系的倒置，也是接口所有权的倒置。**我们通常认为工具库应该拥有自己的接口，但是当应用了DIP之后，我们发现往往是客户拥有抽象接口，而它们的服务者则从这些抽象接口派生。

<a id="markdown-依赖于抽象" name="依赖于抽象"></a>
### 依赖于抽象

“依赖于抽象”这一启发式规则与DIP要求类似，要求我们不应该依赖具体的类，也就是说，程序中所有的依赖关系都应该终止于抽象（抽象类或者接口）。根据这一规则，可知：

* 任何变量都不应该持有一个指向具体类的指针或者引用。
* 任何类都不应该从具体类派生。
* 任何方法都不应该重写它的任何基类中的已经实现了的方法。

要完全遵守这个规则几乎是不可能的。对于一些具体的类，如果比较稳定，还是可以依赖的。比如Java或者Swift中的String类型，String比较稳定，不太会变化，依赖于它不会造成损害。

但是如果一个类不稳定，我们最好不要直接依赖它，而要用一个抽象接口隔离这个类的不稳定性，直接使用接口，而不是这个类。

<a id="markdown-一个例子" name="一个例子"></a>
### 一个例子

依赖倒置可以应用于任何存在一个类向另一个类发送消息的地方。例如Button对Lamp的控制。

![DIP button lamp design](/images/DIP_button_lamp_design.jpg)

上图中的a设计是不成熟的：Button类依赖于Lamp类，当Lamp类改变时，Button类会受到影响。此外，想要重用Button来控制另外一种对象（比如Motor）是不可能的。Button控制着Lamp对象，并且也只能控制Lamp对象。

这个设计违反类DIP原则：应用程序的高层策略没有和低层的实现分离，抽象没有和具体细节分离。也可以说，高层策略依赖于低层模块，抽象自动依赖于细节。

什么是高层策略呢？它是应用背后的抽象，是那些不随具体细节的改变而改变的真理，它是系统内部的系统——它是隐喻（metaphore）。在Button/Lamp这个例子中，背后的抽象是检测用户的开/关指令并将指令传给目标对象。用什么机制检测用户的指令呢？是直接按下GUI上的一个按钮，还是一个实体按钮，或者一个安全系统中的运动监测器？无关紧要！目标对象是什么呢？无关紧要！这些都是不会影响到抽象的具体细节。

改进之后的b设计则是一个遵守DIP的设计。而且，接口本身没有所有者，可以独立放在一个不同于Button，也不同于Lamp的地方。

<a id="markdown-结论-3" name="结论-3"></a>
### 结论

传统程序设计，策略依赖于细节。面向对象设计倒置了这种依赖关系，使得细节和策略都依赖于抽象，并且常常是客户拥有服务接口。

事实上，这种依赖关系的倒置正好是面向对象的标志所在。如果依赖关系是倒置的，就是面向对象设计；否则，就是过程化设计。

依赖倒置关系是实现许多面向对象技术所宣称的好处的基本底层机制。它的正确应用对于创建可重用的框架来说是必要的。同时它对于构建在变化面前富有弹性的代码也是非常重要的。

<a id="markdown-接口隔离原则the-interface-segregation-principle简称isp" name="接口隔离原则the-interface-segregation-principle简称isp"></a>
## 接口隔离原则（The Interface Segregation Principle，简称ISP）

<a id="markdown-定义-4" name="定义-4"></a>
### 定义

**不应该强迫客户依赖于它们不用的方法。**

这个原则是用来处理“胖”接口所具有的缺点。如果类的接口不是内聚（cohesive）的，就表示该类具有“胖”的接口。换句话说，类的“胖”接口可以分解成多组方法，每一组方法都服务于不同的客户程序。

如果客户程序依赖于一个具有“胖”接口的类，就相当于强迫客户程序依赖它们不使用的方法，那么这些客户程序就面临着由于这些未使用的方法的改变所带来的变更。这无意中导致了所有客户程序之间的耦合。

<a id="markdown-一个例子定时门" name="一个例子定时门"></a>
### 一个例子：定时门

**问题描述：**

现在有一个Door的类，现在需要实现一个TimerDoor，如果门开的时间过长，就发出警报。为了做到这一点，TimerDoor需要跟另一个名为Timer的对象进行交互。如果一个对象希望得到超时通知，它可以调用Timer的register函数，该函数有两个参数，一个是超时时间，另一个是TimerClient对象，该对象的`timeout`函数会在超时时被Timer调用。

一个容易想到的实现如下图：

![timer door bad design](/images/door_bad_design.jpg)

现在Door依赖TimerClient了，可是并不是所有种类的Door都需要定时功能。如果要创建无需定时功能的Door的子类，那么在子类中就必须要提供`timeout`方法的退化实现，这就有可能违反LSP原则，使得子类不能够替换父类。而且，这些子类的应用程中中也必须引入TimerClient的定义。使Door变“胖”，只是为了给其某个子类带来需要的功能，这就是接口污染。

下面应用接口隔离原则ISP重新设计这个TimerDoor。

TimerDoor应该“具有”两组接口，一组供Timer使用，一组供Door使用。如何将这两组接口分开呢？该问题的答案基于这样的事实：一个对象的客户不是必须通过该对象才能访问其接口，也可以通过委托或者该对象的基类来访问它。

<a id="markdown-使用委托对接口分组" name="使用委托对接口分组"></a>
#### 使用委托对接口分组

该方案如下图所示，当TimerDoor需要向Timer对象注册一个超时请求时，它就创建一个DoorTimerAdaper，并把它注册给Timer。当Timer对象发送`timeout`消息给DoorTimerAdapter时，DoorTimerAdapter把这个消息委托给TimerDoor的`doorTimeout`方法。

![timer door good design 1](/images/door_good_design_1.jpg)

这个设计是个比较通用的设计，在其他地方，也叫做“使用组合而非继承（Prefer Composition to Extension）”。但是这个设计略显复杂。下面基于多重继承的实现更加简洁。

<a id="markdown-使用多重继承对接口分组" name="使用多重继承对接口分组"></a>
#### 使用多重继承对接口分组

不同语言的多重继承的实现是不一样的。倾向于使用Interface或者Protocol实现这一功能。

![timer door good design 2](/images/door_good_design_2.jpg)

TimerDoor继承Door和TimerClient。尽管这两个基类的客户程序都可以使用TimerDoor，但是实际上都不需要依赖TimerDoor类。这样，它们就通过分离的接口使用同一个对象。

通常情况下，我们都会优先选择多重继承方法，只有当DoorTimerAdapter所做的转换是必须的时候，才考虑使用委托方案。

> DoorTimerAdapter将`timeout`接口转换成TimerDoor里面的`doorTimeout`接口，如果需要，在这个转换过程中还可以做些其它事情。

<a id="markdown-一个例子atm界面" name="一个例子atm界面"></a>
### 一个例子：ATM界面

现在让我们考虑一个更有意义的例子：自动取款机ATM问题。对于ATM上面可执行的不同操作封装一个抽象接口Transaction，三种具体的操作（Deposit，Withdrawal，Transfer）都实现这个接口。每种操作对应的类都可以调用UI抽象接口中的不同方法，但是**每个操作只调用自己对应的方法**。

一个简单直接的实现如下：

![atm bad design](/images/ATM_bad_design.jpg =400x)

对于任何Transaction的子类的改动都有可能迫使对UI的相应改动，从而影响其它所有Transaction的子类以及所有依赖UI的类。如果要增加一种操作PayGasBillTransaction，为了处理该操作想要显示的特定消息，就必须要在UI中加入新的方法。这就导致所有其它Transaction都必须重新编译部署。

通过将UI接口分解成三个对应于不同操作的接口，可以避免这种耦合。设计如下：

![atm good design](/images/ATM_good_design.jpg =600x)

当我们需要增加一种新的Transaction时，其它Transaction都不需要重新编译部署。

<a id="markdown-多参数形式与单参数形式" name="多参数形式与单参数形式"></a>
#### 多参数形式与单参数形式

考虑一个既要访问TransferUI又要访问DepositUI的函数。假设我们想把这两个UI传入该函数，是应该这样写：

```
void tempFund(_ depositeUI: DepositUI, _ transferUI: TransferUI)
```
还是应该这样写：

```
void tempFund(_ ui: UI)
```

以第二种方法编写函数的诱惑是很强的。毕竟，在第一种多参数形式中，两个参数应用的是同一个对象，调用起来是这个样子：

```
tempFunc(ui, ui)
```

虽然上面的调用看起来有悖常理，但是我们还是应该倾向于多参数形式。单参数形式的函数依赖于UI中包含的每一个接口，如果WithDrawalUI发生了改变，那么函数及其所有客户程序都会受到影响。这更悖常理。此外，我们也不能保证传入函数的两个参数一直是同一个对象。也许以后，接口对象会因为某些原因而分离，此时，函数并不需要关注接口对象是合并还是分拆这一事实。

<a id="markdown-结论-4" name="结论-4"></a>
### 结论

“胖”类会导致其客户程序之间的耦合。当一个客户程序要求该“胖”类进行一个改动时，其它客户程序都会受到影响。因此客户程序应该仅仅依赖于它调用的方法，而不应该直接依赖于一个“胖”类。通过把“胖”类的接口分解为多个特定程序的接口，每个针对特定客户程序的接口只声明其对应客户程序需要的接口。接着，该“胖”类就可以继承所有分离出来的接口，并实现它们。这就解除了客户程序和其没有调用的方法间的依赖关系，并使客户程序之间互不依赖。





