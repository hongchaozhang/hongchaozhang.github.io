---
layout: post
title: "经典算法智力题"
date: 2015-09-14 20:46:22 +0800
comments: true
published: false
categories: [algorithm]
---

1. [海盗分金子](#1)
2. [飞机加油问题](#2)
3. [蚂蚁爬杆](#3)
4. [平面上N个点，每两个点都确定一条直线，求出斜率最大的那条直线所通过的两个点（斜率不存在的情况不考虑）。时间效率越高越好。](#4)
5. [Find the closest pair from a sorted array](#5)
6. [Building Bridge](#6)
7. [打印n分之一的前k位小数](#7)
8. [Marketing Size](#8)
9. [赛马问题](#9)
10. [火车运煤问题](#10)
11. [Measure 9 minutes with two hourglasses](#hourglass)


<!-- more -->

### <a name="1"></a>海盗分金子
参考[海盗分金子的游戏](http://lucky-harry.blog.163.com/blog/static/201270702007101634121760/)

数学的逻辑有时会导致看来十分怪异的结论。一般的规则是，如果逻辑推理没有漏洞，那么结论就必定站得住脚，即使它与你的直觉矛盾。

#### 题目

10名海盗抢得了窖藏的100块金子，并打算瓜分这些战利品。这是一些讲民主的海盗（当然是他们自己特有的民主），他们的习惯是按下面的方式进行分配：最厉害的一名海盗提出分配方案，然后所有的海盗（包括提出方案者本人）就此方案进行表决。如果50%或更多的海盗赞同此方案，此方案就获得通过并据此分配战利品。否则提出方案的海盗将被扔到海里，然后下提名最厉害的海盗又重复上述过程。（所有的海盗都乐于看到他们的一位同伙被扔进海里，不过，如果让他们选择的话，他们还是宁可得一笔现金。他们当然也不愿意自己被扔到海里。所有的海盗都是有理性的，而且知道其他的海盗也是有理性的。此外，没有两名海盗是同等厉害的——这些海盗按照完全由上到下的等级排好了座次，并且每个人都清楚自己和其他所有人的等级。这些金块不能再分，也不允许几名海盗共有金块，因为任何海盗都不相信他的同伙会遵守关于共享金块的安排。这是一伙每人都只为自己打算的海盗。）最凶的一名海盗应当提出什么样的分配方案才能使他获得最多的金子呢？

#### 分析

为方便起见，我们按照这些海盗的怯懦程度来给他们编号。最怯懦的海盗为1号海盗，次怯懦的海盗为2号海盗，如此类推。这样最厉害的海盗就应当得到最大的编号，而方案的提出就将倒过来从上至下地进行。

分析所有这类策略游戏的奥妙就在于应当从结尾出发倒推回去。游戏结束时，你容易知道何种决策有利而何种决策不利。确定了这一点后，你就可以把它用到倒数第2次决策上，如此类推。如果从游戏的开头出发进行分析，那是走不了多远的。其原因在于，所有的战略决策都是要确定：“如果我这样做，那么下一个人会怎样做？”

因此在你以下海盗所做的决定对你来说是重要的，而在你之前的海盗所做的决定并不重要，因为你反正对这些决定也无能为力了。

记住了这一点，就可以知道我们的出发点应当是游戏进行到只剩两名海盗——即1号和2号——的时候。这时最厉害的海盗是2号，而他的最佳分配方案是一目了然的：100块金子全归他一人所有，1号海盗什么也得不到。由于他自己肯定为这个方案投赞成票，这样就占了总数的50%，因此方案获得通过。

现在加上3号海盗。1号海盗知道，如果3号的方案被否决，那么最后将只剩2个海盗，而1号将肯定一无所获——此外，3号也明白1号了解这一形势。因此，只要3号的分配方案给1号一点甜头使他不至于空手而归，那么不论3号提出什么样的分配方案，1号都将投赞成票。因此3号需要分出尽可能少的一点金子来贿赂1号海盗，这样就有了下面的分配方案： 3号海盗分得99块金子，2号海盗一无所获，1号海盗得1块金子。

4号海盗的策略也差不多。他需要有50%的支持票，因此同3号一样也需再找一人做同党。他可以给同党的最低贿赂是1块金子，而他可以用这块金子来收买2号海盗。因为如果4号被否决而3号得以通过，则2号将一文不名。因此，4号的分配方案应是：99块金子归自己，3号一块也得不到，2号得1块金子，1号也是一块也得不到。

5号海盗的策略稍有不同。他需要收买另两名海盗，因此至少得用2块金子来贿赂，才能使自己的方案得到采纳。他的分配方案应该是：98块金子归自己，1块金子给3号，1块金子给1号。

这一分析过程可以照着上述思路继续进行下去。每个分配方案都是唯一确定的，它可以使提出该方案的海盗获得尽可能多的金子，同时又保证该方案肯定能通过。照这一模式进行下去，10号海盗提出的方案将是96块金子归他所有，其他编号为偶数的海盗各得1块金子，而编号为奇数的海盗则什么也得不到。这就解决了10名海盗的分配难题。

分配方案用表格表示如下：

被分配人|1|2|3|4|5|6|7|8|9|10|
|---|---|---|---|---|---|---|---|---|---|---|
分配人|
1|100
2|0|100
3|1|0|99
4|0|1|0|99
5|1|0|1|0|98
6|0|1|0|1|0|98
7|1|0|1|0|1|0|97
8|0|1|0|1|0|1|0|97
9|1|0|1|0|1|0|1|0|96
10|0|1|0|1|0|1|0|1|0|96

#### 延伸

Omohundro的贡献是他把这一问题扩大到有500名海盗的情形，即500名海盗瓜分100块金子。显然，类似的规律依然成立——至少是在一定范围内成立。事实上，前面所述的规律直到第200号海盗都成立。 200号海盗的方案将是：从1到199号的所有奇数号的海盗都将一无所获，而从2到198号的所有偶数号海盗将各得1块金子，剩下的1块金子归200号海盗自己所有。

乍看起来，这一论证方法到200号之后将不再适用了，因为201号拿不出更多的金子来收买其他海盗。但是即使分不到金子，201号至少还希望自己不会被扔进海里，因此他可以这样分配：给1到199号的所有奇数号海盗每人1块金子，自己一块也不要。

202号海盗同样别无选择，只能一块金子都不要了——他必须把这100块金子全部用来收买100名海盗，而且这100名海盗还必须是那些按照201号方案将一无所获的人。由于这样的海盗有101名，因此202号的方案将不再是唯一的——贿赂方案有101种。

> 202号海盗是第一个有多种最优方案的人。

203号海盗必须获得102张赞成票，但他显然没有足够的金子去收买101名同伙。因此，无论提出什么样的分配方案，他都注定会被扔到海里去喂鱼。不过，尽管203号命中注定死路一条，但并不是说他在游戏进程中不起任何作用。相反，204号现在知道，203号为了能保住性命，就必须避免由他自己来提出分配方案这么一种局面，所以无论204号海盗提出什么样的方案，203号都一定会投赞成票。这样204号海盗总算侥幸拣到一条命：他可以得到他自己的1票、203号的1票、以及另外100名收买的海盗的赞成票，刚好达到保命所需的50%。获得金子的海盗，必属于根据202号方案肯定将一无所获的那101名海盗之列。

205号海盗的命运又如何呢？他可没有这样走运了。他不能指望203号和204号支持他的方案，因为如果他们投票反对205号方案，就可以幸灾乐祸地看到205号被扔到海里去喂鱼，而他们自己的性命却仍然能够保全。这样，无论205号海盗提出什么方案都必死无疑。206号海盗也是如此——他肯定可以得到205号的支持，但这不足以救他一命。类似地，207号海盗需要104张赞成票——除了他收买的100张赞成票以及他自己的1张赞成票之外，他还需3张赞成票才能免于一死。他可以获得205号和206号的支持，但还差一张票却是无论如何也弄不到了，因此207号海盗的命运也是下海喂鱼。

208号又时来运转了。他需要104张赞成票，而205、206、207号都会支持他，加上他自己一票及收买的100票，他得以过关保命。获得他贿赂的必属于那些根据204号方案肯定将一无所获的人（候选人包括2到200号中所有偶数号的海盗、以及201、203、204号）。

现在可以看出一条新的、此后将一直有效的规律：那些方案能过关的海盗（他们的分配方案全都是把金子用来收买100名同伙而自己一点都得不到）相隔的距离越来越远，而在他们之间的海盗则无论提什么样的方案都会被扔进海里——因此为了保命，他们必会投票支持比他们厉害的海盗提出的任何分配方案。得以避免葬身鱼腹的海盗包括201、202、204、208、216、232、264、328、456号，即其号码等于200加2的某一方幂的海盗。

> 对于大于200号的海盗，均无法获得任何黄金，而且只有200加2的整数次幂的海盗可以分金子并且免于一死。

现在我们来看看哪些海盗是获得贿赂的幸运儿。分配贿赂的方法是不唯一的，其中一种方法是让201号海盗把贿赂分给1到199号的所有奇数编号的海盗，让202号分给2到200号的所有偶数编号的海盗，然后是让204号贿赂奇数编号的海盗，208号贿赂偶数编号的海盗，如此类推，也就是轮流贿赂奇数编号和偶数编号的海盗。

#### 结论

当500名海盗运用最优策略来瓜分金子时，头44名海盗必死无疑，而456号海盗则给从1到199号中所有奇数编号的海盗每人分1块金子，问题就解决了。由于这些海盗所实行的那种民主制度，他们的事情就搞成了最厉害的一批海盗多半都是下海喂鱼，不过有时他们也会觉得自己很幸运——虽然分不到抢来的金子，但总可以免于一死。只有最怯懦的200名海盗有可能分得一份脏物，而他们之中又只有一半的人能真正得到一块金子，的确是**怯懦者继承财富**。

### <a name="2"></a>飞机加油问题

参考[飞机加油智力题](http://blog.csdn.net/athenaer/article/details/8612536)

#### Question
On Bagshot Island, there is an airport. The airport is the home base of an unlimited number of identical airplanes. Each airplane has a fuel capacity to allow it to fly exactly 1/2 way around the world, along a great circle. The planes have the ability to refuel in flight without loss of speed or spillage of fuel. Though the fuel is unlimited, the island is the only source of fuel.
What is the fewest number of aircraft necessary to get one plane all the way around the world assuming that all of the aircraft must return safely to the airport? How did you get to your answer?

Notes:

1. Each airplane must depart and return to the same airport, and that is the only airport they can land and refuel on ground.
2. Each airplane must have enough fuel to return to airport.
3. The time and fuel consumption of refueling can be ignored. (so we can also assume that one airplane can refuel more than one airplanes in air at the same time.)
4. The amount of fuel airplanes carrying can be zero as long as the other airplane is refueling these airplanes. What is the fewest number of airplanes and number of tanks of fuel needed to accomplish this work? (we only need airplane to go around the world)

#### Answer

The fewest number of aircraft is 3, and the times of taking off is 5! 
Imagine 3 aircraft (A, B and C). A is going to fly round the world. All three aircraft start at the same time in the same direction. After 1/8 of the circumference, B passes 1/4 of its fuel to C, 1/4 of its fuel to A, and returns home. C continues to fly alongside A until they are 1/4 of the distance around the world. At this point C completely fills the tank of A with 1/4 of its full fuel, which is now able to fly to a point 3/4 of the way around the world. C has now only 1/2 of its full fuel capacity left, exactly enough to get back to the home base. 

When C gets to the base, gets fully refueled and takes off in the other direction. C will meet A in 3/4 of the distance. Now A has no fuel while C has half of its full fuel. Let C fill the tank of A with 1/4 of its full fuel, and B takes off from base with full fuel. B will meet A and C in 7/8 of the distance. Currently, A and C has no fuel, while B has 3/4 of its full fuel. Let B fill A with its 1/4 of its full fuel and fills C with 1/4 of its full fuel. And all the three planes can get back safely to the base.


#### 问题

每个飞机只有一个油箱，飞机之间可以相互加油，注意是相互，没有加油机，一箱油可供一架飞机绕地球飞半圈。      
为使至少一架飞机绕地球一圈回到起飞时的飞机场，至少需要出动几架飞机？  
A:所有飞机从同一机场起飞，而且必须安全返回机场，不允许中途降落，中间没有飞机场
B:所有飞机从同一机场,同一方向起飞，而且必须安全返回机场，不允许中途降落，中间没有飞机场

#### 答案

三架飞机，五架次。
> 提示：刚开始三架同时飞，另一方向一架一架次去接。

### <a name="3"></a>蚂蚁爬杆

#### 问题

**Words:**

transparent, straight stick, head for

**Question:**

We have a straight stick which is 30 centimeters long. There are five ants in the following positions: 3cm, 7cm, 11cm, 17cm and 23cm. Initially, the ants head left or right randomly. When ants meet, both of them will turn back and head for the other dirctions. Assuming that all the ants' speed is 1cm/s. Try to get the max and min time that all the ants leave the stick.

有一根30厘米的细木杆，在第3厘米、7厘米、11厘米、17厘米、23厘米这五个位置上各有一只蚂蚁。木杆很细，同时只能通过一只蚂蚁。开始时，蚂蚁的头朝左还是朝右是任意的，它们只会朝前走或调头，但不会后退。当任意两只蚂蚁碰头时，两只蚂蚁会同时调头朝反方向走。假设蚂蚁们每秒钟可以走一厘米的距离。求所有蚂蚁都离开木杆的最小时间和最大时间。

> 提示：问题等价于蚂蚁之间是透明的，可以相互穿过不阻挡。


### <a name="4"></a>平面上N个点，每两个点都确定一条直线，求出斜率最大的那条直线所通过的两个点（斜率不存在的情况不考虑）。时间效率越高越好。

按照一般的方法，逐个求斜率比较，O(n^2)可完成。有没有更快的方法？有。

对所有的点按x坐标排序，然后只比较相邻两点的斜率即可。复杂度O(nlgn)。

### <a name="5"></a>Given a sorted array and a number x, find the pair in array whose sum is closest to x

reference [Given a sorted array and a number x, find the pair in array whose sum is closest to x](http://geeksquiz.com/given-sorted-array-number-x-find-pair-array-whose-sum-closest-x/)

A similar question is [Find the closest pair from two sorted arrays](http://www.geeksforgeeks.org/given-two-sorted-arrays-number-x-find-pair-whose-sum-closest-x/).

**Question:**

Given a sorted array and a number x, find a pair in array whose sum is closest to x.
Examples:
{% highlight text %}
Input: arr[] = {10, 22, 28, 29, 30, 40}, x = 54
Output: 22 and 30

Input: arr[] = {1, 3, 4, 7, 10}, x = 15
Output: 4 and 10
{% endhighlight %}

**Answer:**

An efficient solution can find the pair in `O(n)` time. Following is detailed algorithm.

1. Initialize a variable `diff` as infinite (`diff` is used to store the 
   difference between pair and `x`).  We need to find the minimum `diff`.
2. Initialize two index variables `l` and `r` in the given sorted array.
	1. Initialize first to the leftmost index:  `l = 0`
	2. Initialize second  the rightmost index:  `r = n-1`
3. Loop while `l < r`.
	1. If  `abs(arr[l] + arr[r] - sum) < diff`  then update diff and result 
	2. Else if(`arr[l] + arr[r] <  sum` )  then `l++`
	3. Else `r--`  

> Similar question: 给定一个存放整数的数组，重新排列数组使得数组左边为奇数(odd)，右边为偶数(even)。时间复杂度O(n),空间复杂度O(1)。


### <a name="6"></a>Building Bridge

**Words:**

be perpendicular to, be parallel with, intersection point

**Question:** 

A and B live in different sides of a straight river, whose width is `w`. A and B want to build a bridge over the river (the bridge must be perpendicular to the river), so that they can visit each other. Where to build the bridge so that the walking distance is the shortest between A and B?

**Analytics:**


### <a name="7"></a>打印n分之一的前k位小数

**Words:**

digits, decimal point, overflow, floating point pricision，divided by, remainder, quotient，mod

**Question:**

Given a positive integer n, print first k digits after point in value of 1/n. Your program should avoid overflow and floating point arithmetic.

Examples:

{% highlight text %}
Input:   n = 3, k = 3
Output:  333
Input:   n = 50, k = 4
Output:  0200
{% endhighlight %}

**Answer:**

{% highlight java linenos %}

// Function to print first k digits after dot in value
// of 1/n. n is assumed to be a positive integer.
void print(int n, int k)
{
    int rem = 1; // Initialize remainder

    // Run a loop k times to print k digits
    for (int i = 0; i < k; i++)
    {
        // The next digit can always be obtained as
        // doing (10*rem)/10
        cout << (10 * rem) / n;

        // Update remainder
        rem = (10*rem) % n;
    }
}

{% endhighlight %}

## <a name="8"></a>Marketing Size

请估算：

* 某城市市目前的出租车数量（TX某年面试题）；
* 上周在某城市有多少个煎饼被吃掉?
* 某城市的酒店的数量？
* 波音747能装下多少个乒乓球?
* 中国人一年用多少草本洗发水?

> Manily, we have two kinds of methods: **up-to-down** and **bottome-to-up**.

## <a name="9"></a>赛马问题

各种不同的题型可以参考：

* [关于选牛和选马的问题](http://blog.csdn.net/tianmohust/article/details/6839524)： 结论基本都是错的。
* [面试题：赛马问题](http://coolshell.cn/articles/1202.html)

google面试原题：

* [[Google]25匹马的角逐](http://hxraid.iteye.com/blog/662643)：正确的分析过程。

**Question：**

一共有25匹马，有一个赛场，赛场有5个赛道，就是说最多同时可以有5匹马一起比赛。假设每匹马都跑的很稳定，不用任何其他工具，只通过马与马之间的比赛，试问最少 得比多少场才能知道跑得最快的5匹马。

**Analytics：**

1. 首先将25匹马分成5组，并分别进行5场比赛之后得到的名次排列如下：
              
	A组：  [A1  A2  A3   A4  A5]

	B组：  [B1  B2  B3   B4  B5]

	C组：  [C1  C2  C3  C4  C5]

	D组：  [D1  D2  D3  D4  D5]

	E组：  [E1  E2  E3   E4  E5]
	
	其中，每个小组最快的马为[A1、B1、C1、D1、E1]。
2. 将[A1、B1、C1、D1、E1]进行第6场，选出第1名的马，不妨设 A1>B1>C1>D1>E1. 此时第1名的马为A1。
3. 将[A2、B1、C1、D1、E1]进行第7场，此时选择出来的必定是第2名的马，不妨假设为B1。因为这5匹马是除去A1之外每个小组当前最快的马。
4. 进行第8场，选择[A2、B2、C1、D1、E1]角逐出第3名的马。
5. 依次类推，第9，10场可以分别决出第4，5名的吗。
 
因此，依照这种竞标赛排序思想，需要10场比赛是一定可以取出前5名的。
 
 
仔细想一下，如果需要减少比赛场次，就一定需要**在某一次比赛中同时决出2个名次**，而且**每一场比赛之后，有一些不可能进入前5名的马可以提前出局**。 当然要做到这一点，就必须小心选择每一场比赛的马匹。我们在上面的方法基础上进一步思考这个问题，希望能够得到解决。
 
1. 首先利用5场比赛角逐出每个小组的排名次序是绝对必要的。
2. 第6场比赛选出第1名的马也是必不可少的。假如仍然是A1马(A1>B1>C1>D1>E1)。那么此时我们可以得到一个重要的结论：有一些马在前6场比赛之后就决定出局的命运了。
   	
    A组：  [A1  A2  A3   A4  A5]
   	
    B组：  [B1  B2  B3   B4  <del>B5</del>]

    C组：  [C1  C2  C3   <del>C4</del>  <del>C5</del>]

    D组：  [D1  D2  <del>D3</del>   <del>D4</del>  <del>D5</del>]

    E组：  [E1  <del>E2</del>  <del>E3</del>   <del>E4</del>  <del>E5</del>]
       
3. 第7场比赛是关键，能否同时决出第2，3名的马呢？我们首先做下分析：

	在上面的方法中，第7场比赛[A2、B1、C1、D1、E1]是为了决定第2名的马。但是在第6场比赛中我们已经得到(B1>C1>D1>E1)，试问？有B1在的比赛，C1、D1、E1还有可能争夺第2名吗？ 当然不可能，也就是说第2名只能在A2、B1中出现。实际上只需要2条跑道就可以决出第2名，剩下C1、D1、E1的3条跑道都只能用来凑热闹的吗？

	能够优化的关键出来了，**我们是否能够通过剩下的3个跑道来决出第3名呢？**当然可以，我们来进一步分析第3名的情况？

	* 如果A2>B1(即第2名为A2)，那么根据第6场比赛中的(B1>C1>D1>E1)。 可以断定第3名只能在A3和B1中产生。
	* 如果B1>A2(即第2名为B1)，那么可以断定的第3名只能在A2, B2,C1 中产生。

	好了，结论也出来了，只要我们把[A2、B1、A3、B2、C1]作为第7场比赛的马，那么这场比赛的第2，3名一定是整个25匹马中的第2，3名。

	我们在这里列举出第7场的2，3名次的所有可能情况：
    
	1. 第2名=A2，第3名=A3
	2. 第2名=A2，第3名=B1
	3. 第2名=B1，第3名=A2
	4. 第2名=B1，第3名=B2
	5. 第2名=B1，第3名=C1
 
4. 第8场比赛很复杂，我们要根据第7场的所有可能的比赛情况进行分析。

   1. 第2名=A2，第3名=A3。那么此种情况下第4名只能在A4和B1中产生。
		* 如果第4名=A4，那么第5名只能在A5、B1中产生。
		* 如果第4名=B1，那么第5名只能在A4、B2、C1中产生。
         
      不管结果如何，此种情况下，第4、5名都可以在第8场比赛中决出。其中比赛马匹为[A4、A5、B1、B2、C1]
   2. 第2名=A2，第3名=B1。那么此种情况下第4名只能在A3、B2、C1中产生。
		* 如果第4名=A3，那么第5名只能在A4、B2、C1中产生。		* 如果第4名=B2，那么第5名只能在A3、B3、C1中产生。
		* 如果第4名=C1，那么第5名只能在A3、B2、C2、D1中产生。
          
     	那么，第4、5名需要在马匹[A3、B2、B3、C1、A4、C2、D1]七匹马中产生，则必须比赛两场才行，也就是到第9场角逐出全部的前5名。
   3. 第2名=B1，第3名=A2。那么此种情况下第4名只能在A3、B2、C1中产生。情况和上述一样，必须角逐第9场
   4. 第2名=B1，第3名=B2。 那么此种情况下第4名只能在A2、B3、C1中产生。
		* 如果第4名=A2，那么第5名只能在A3、B3、C1中产生。
		* 如果第4名=B3，那么第5名只能在A2、B4、C1中产生。
		* 如果第4名=C1，那么第5名只能在A2、B3、C2、D1中产生。
     	
     	那么，第4、5名需要在马匹[A2、B3、B4、C1、A3、C2、D1]七匹马中产 生，则必须比赛两场才行，也就是到第9场角逐出全部的前5名。
   5. 第2名=B1，第3名=C1。那么此种情况下第4名只能在A2、B2、C2、D1中产生。
		* 如果第4名=A2，那么第5名只能在A3、B2、C2、D1中产生。
		* 如果第4名=B2，那么第5名只能在A2、B3、C2、D1中产生。
		* 如果第4名=C2，那么第5名只能在A2、B2、C3、D1中产生。
		* 如果第4名=D1，那么第5名只能在A2、B2、C2、D2、E2中产生。
             
		那么，第4、5名需要在马匹[A2、B2、C2、D1、A3、B3、C3、D2、E1]九匹马中 产 生，因此也必须比赛两场，也就是到第9长决出胜负。
 
 
**结论：**

最好情况可以在第8场角逐出前5名，最差也可以在第9场搞定。


## <a name="10"></a>火车运煤问题

[火车运煤问题](http://www.cnblogs.com/liuzhi/p/3922311.html)

**Words:**

coal mine, coal, goods, carry, transport, devided by, consume

**Question:**

Supposing we have a coal mine which has 3000 tons of coal. We plan to transport the coal to the market which is 1000 kilometers away. 

For the train, 

* it uses one ton of coal for running 1 kilometer, no matter how much it is carrying;
* it can carry 1000 tons of coal at the most;

Question:

1. Can we carry coal to the market?
    * IF NO, tell the reason;
    * If YES, how much coal can we carry to the market at the most?

2. Supposing we have 1000n (n is a interger) tons of coal in the mine, can we transport more than 1000 tons of coal to the market?
    * if NO, tell the reason;
    * if YES, try to give the smallest n.

你是山西的一个煤老板，你在矿区开采了有3000吨煤需要运送到市场上去卖，从你的矿区到市场有1000公里，你手里有一列烧煤的火车，这个火车最多只能装1000吨煤，且其能耗比较大——每一公里需要耗一吨煤。请问，

* 作为一个懂编程的煤老板的你，你会怎么运送才能运最多的煤到集市？
* 假设矿区共有1000n（n是正整数）吨煤，是否可能运送多于1000吨的煤到达目的地？如果不可以，说明理由，如果可以，试求最小的n值。

**Analytics：**

最优运送方案如下：

* 将1000n吨煤运送到全程的1/(2n-1)处，此时还有1000(n-1)吨煤。
* 将1000(n-1)吨煤再往前运送全程的1/(2n-3)，即全程的1/(2n-1)+1/(2n-3)处，此时还剩1000(n-2)吨煤。
* ...
* 将2000吨煤再往前运送全程的1/3，即全程的1/(2n-1)+1/(2n-3)+...+1/3处，此时还剩1000吨煤。
* 将1000吨煤运送到目的地，还需要消耗1000{1-[1/(2n-1)+1/(2n-3)+...+1/3]}吨煤，所以运送达目的地的煤量为1000[1/(2n-1)+1/(2n-3)+...+1/3]吨。

Note：

* 当n=7时，1/3+1/5+1/7+...+1/13 = 0.96;
* 当n=8时，1/3+1/5+1/7+...+1/13+1/15 = 1.02;

所以，

* 上述公式只适用于n小于8的情况；
* 当n=8时，可以将多于1000吨的煤运送到目的地。火车可以将2000吨煤运送到1000[1/5+1/7+...+1/13+1/15]公里处，即688公里处，最终能将2000-(1000-688)*3吨煤，即1065吨煤，运送到目的地。


## <a name="hourglass"></a>Measure 9 minutes with two hourglasses

**Words:**

hourglass, flip over, turn over, measure, run out 

**Question:**

How to measure 9 minutes with two hourglasses: 4 minutes and 7 minutes?

**Analytics:**

Start both timers together. When the 4 minute timer is done, flip it. 7 minute timer will have 3 minutes left. When the 7 minute timer is done, the 4 minute timer will have 1 minute left. Now you can count to 9 minutes by simply leaving the 4 minute to expire (1 min), flip it and let it expire (4 min), flip it again and let it expire (4 min). 1 + 4 + 4 = 9.