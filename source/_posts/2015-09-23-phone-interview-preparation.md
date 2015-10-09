---
layout: post
title: "phone interview preparation"
date: 2015-09-23 11:02:18 +0800
comments: true
categories: [algorithm]
---

这里有很多面试题：[GeeksforGeeks](http://www.geeksforgeeks.org/)，有概念，也有算法，也有各大公司的面试经历。尤其是下面两部分：

* [数据结构](http://www.geeksforgeeks.org/data-structures/)
* [算法](http://www.geeksforgeeks.org/fundamentals-of-algorithms/)

Contents

* [Concepts of Stack and Queue](#stack_and_queue)
* [覆盖(Overriding)和重载(Overloading)的区别是什么？](#override_andoverload)
* [迭代(Iteration)和递归(Recursion)有什么区别？](#iteration_and_recursion)
* [Concepts of some kinds of tree](#tree_concepts)
* [链表(Linked List)和数组(Array)有哪些重要区别?](#linked_list_and_array)
* [给定链表的头指针和一个结点指针，在O(1)时间删除该结点](#delete_node_in_linked_list)
* [找出数组中两个只出现一次的数字(数组)](#find_numbers_appearing_once)
* [在哈希表中处理冲突的方法都有哪些？](#conflicts_while_hashing)
* [从哈希表，二叉树和链表中取元素需要多少时间?](#get_elements_from_data_structure)
* [Sort algorithm](#sorting)
* [Iterative Preorder(Postorder) traversal](#iterative_tree_traversal)
* [Reverse Binary Tree](#reverse_binary_tree)
* [Lucky Number](#lucky_number)
* [Circles in Linked List](#linked_list_circle)
* [Intersection of two single Linked Lists without circles](#linked_list_intersection)
* [寻找最小的k个数](#find_k_smallest_nubers)
* [Singleton in Java](#java_singleton)

<!-- more -->


### <a name="stack_and_queue"></a>Concepts of Stack and Queue

* Stack
* Queue

**Question:** How to implement a **Queue** using two **Stack**s?

**Answer:**
 
{% highlight c++ linenos %}
class Stack
{
…
public:
         void Push(int x); // Push an element in stack;
         int Pop();  // Pop an element out of stack;
         int Count() const;     // Return the number of the elements in stack;
…
};
 
class Queue
{
…
public:
         void Enqueue(int x);
         int Dequeue();
 
private:
         Stack s1;
         Stack s2;
…
};
{% endhighlight %}

* 入队时，将元素压入s1。
* 出队时，将s1的元素逐个“倒入”（弹出并压入）s2，将s2的顶元素弹出作为出队元素，之后再将s2剩下的元素逐个“倒回”s1。

### <a name="override_andoverload"></a>覆盖(Overriding)和重载(Overloading)的区别是什么？  (detailed answer)

覆盖在运行时决定，重载是在编译时决定。并且覆盖和重载的机制不同，例如在Java中，重载方法的签名必须不同于原先方法的，但对于覆盖签名必须相同。

### <a name="iteration_and_recursion"></a>迭代(Iteration)和递归(Recursion)有什么区别？(detailed answer)

迭代通过循环来重复执行同一步骤，递归通过调用函数自身来做重复性工作。递归经常是复杂问题（例如汉诺塔、反转链表或反转字符串）的清晰简洁的解决方案。递归的一个缺陷是深度，由于递归在栈中存储中间结果，你只能进行一定深度的递归，在那之后你的程序会因为StackOverFlowError而崩溃。这就是在产品代码中优先使用迭代而不是递归的原因。

### <a name="tree_concepts"></a>Concept of Tree

* 二叉树(Binary Tree)
* 二叉查找树(Binary Search Tree) (二叉排序树(Binary Sort Tree))
* 平衡二叉树(Balanced Binary Tree)
* 满二叉树(Full Binary Tree)

二叉查找树是有序的二叉树，所有节点（例如根节点）的左子树节点的值都小于或等于该节点的值，右子树节点的值都大于或等于该节点的值。它是一个重要的数据结构，可以用来表示有序的数据。

二叉排序树又叫做二叉查找树

### <a name="linked_list_and_array"></a>链表(Linked List)和数组(Array)有哪些重要区别？(detailed answer)

链表和数组都是程序设计世界中重要的数据结构。它们间最明显的区别是，数组将元素存放在连续的地址中，链表将数据存放在内存中任意的位置。这使得链表有巨大的扩展自己的灵活性，因为内存总是分散的。这种情况总是可能的：你无法创建一个数组来存放一百万个整数，但可以用链表来存放，因为空间是存在的，只是不连续。其他的不同都是源于这项事实。例如，在数组中，如果你知道下标，可以用O(1)的时间得到一个元素，但在链表中要花O(n)的时间。更多不同参见详细答案。

存储方式不同：Elements in array is stored condinuousely, while those in linked list are not.

存储位置不同：In general, array is considered a data structure for which size is fixed at the compile time and array memory is allocated either from Data section (e.g. global array) or Stack section (e.g. local array). 
Similarly, linked list is considered a data structure for which size is not fixed and memory is allocated from Heap section (e.g. using malloc() etc.) as and when needed. In this sense, array is taken as a static data structure (residing in Data or Stack section) while linked list is taken as a dynamic data structure (residing in Heap section). 

Like arrays, Linked List is a linear data structure. Unlike arrays, linked list elements are not stored at contiguous location; the elements are linked using pointers.

* Advantages over arrays
	* Dynamic size
	* Ease of insertion/deletion
* Drawbacks:
	* Random access is not allowed. We have to access elements sequentially starting from the first node. So we cannot do binary search with linked lists.
	* Extra memory space for a pointer is required with each element of the list.

### <a name="delete_node_in_linked_list"></a>给定链表的头指针和一个结点指针，在O(1)时间删除该结点

 办法很简单，首先是放p中数据,然后将p->next的数据copy入p中，接下来删除p->next即可。

> 类似的：只给定单链表中某个结点p(非空结点)，在p前面插入一个结点。
> 
> 回答：首先分配一个结点q，将q插入在p后，接下来将p中的数据copy入q中，然后再将要插入的数据记录在p中。

### <a name="find_numbers_appearing_once"></a>找出数组中两个只出现一次的数字(数组)

题目：一个整型数组里除了两个数字之外，其他的数字都出现了两次。
请写程序找出这两个只出现一次的数字。要求时间复杂度是O(n)，空间复杂度是O(1)。
分析：这是一道很新颖的关于位运算的面试题。

首先我们考虑这个问题的一个简单版本：

> **一个数组里除了一个数字之外，其他的数字都出现了两次。**请写程序找出这个只出现一次的数字。

这个题目的突破口在哪里？题目为什么要强调有一个数字出现一次，其他的出现两次？我们想到了**异或运算**的性质：

* 任何一个数字异或它自己都等于0。
* 任何一个数字异或0还等于它自身。

也就是说，如果我们从头到尾依次异或数组中的每一个数字，那么最终的结果刚好是那个只出现依次的数字，因为那些出现两次的数字全部在异或中抵消掉了。

有了上面简单问题的解决方案之后，我们回到原始的问题。如果能够把原数组分为两个子数组。在每个子数组中，包含一个只出现一次的数字，而其他数字都出现两次。如果能够这样拆分原数组，按照前面的办法就是分别求出这两个只出现一次的数字了。

我们还是从头到尾依次异或数组中的每一个数字，那么最终得到的结果就是两个只出现一次的数字的异或结果。因为其他数字都出现了两次，在异或中全部抵消掉了。由于这两个数字肯定不一样，那么这个异或结果肯定不为0，也就是说在这个结果数字的二进制表示中至少就有一位为1。我们在结果数字中找到第一个为1的位的位置，记为第N位。**现在我们以第N位是不是1为标准把原数组中的数字分成两个子数组，第一个子数组中每个数字的第N位都为1，而第二个子数组的每个数字的第N位都为0。**这种划分方法可以保证：

* 出现两次的数字被划分到同一个数组中。
* 只出现一次的两个数字被划分到不同的数组中。

现在我们已经把原数组分成了两个子数组，每个子数组都包含一个只出现一次的数字，而其他数字都出现了两次。因此到此为止，所有的问题我们都已经解决。


### <a name="conflicts_while_hashing"></a>在哈希表中处理冲突的方法都有哪些？

线性探测(linear probing)，二次哈希(double hashing)和链接(chaining)。在线性探测中，如果桶已经被占据了，那么函数会线性地检查下一个桶，直到找到一个空位。在链接中，多个元素可以存储在同一个桶中。

### <a name="get_elements_from_data_structure"></a>从哈希表，二叉树和链表中取元素需要多少时间？如果你有数百万记录呢？

哈希表需要O(1)时间，二叉树需要O(logN) (N是树中节点数)，链表需要O(N) (N是链表中节点数）。如果数据结构工作正常（比如哈希表没有或只有相对少量冲突，二叉树是平衡的），数百万记录并不影响效率。如果工作不正常，那么效率会随着记录数上升而下降。

### <a name="sorting"></a>Sort algorithm

reference [here](http://dongxicheng.org/structure/sort/)

#### Stable of sorting

Some sorting algorithms are stable by nature like **Insertion sort**, **Merge Sort**, **Bubble Sort**, etc. And some sorting algorithms are not, like **Heap Sort**, **Quick Sort**, etc.

### <a name="iterative_tree_traversal"></a>Iterative Preorder(Postorder) Traversal

1. Create an empty stack nodeStack and push root node to stack.
2. Do following while nodeStack is not empty.
	1. Pop an item from stack and print it.
	2. Push **right** (left for Postorder) child of popped item to stack
	3. Push **left** (right for Postorder) child of popped item to stack

Right child is pushed before left child to make sure that left subtree is processed first.

### <a name="reverse_binary_tree"></a>Reverse Binary Tree

#### Recursive method: 

{% highlight java lineno %}

/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
public class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }
        root.left = invertTree(root.left);
        root.right = invertTree(root.right);
        
        TreeNode tmp = root.left;
        root.left = root.right;
        root.right = tmp;
        return root;
    }
}

{% endhighlight %}

#### Iterative method: 

to do ...


### <a name="lucky_number"></a>Lucky Numbers

Implementation using Recursion.

reference [Lucky Numbers](http://www.geeksforgeeks.org/lucky-numbers/)

**Question:**

Take the set of integers
1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,……

* First, delete every second number, we get following reduced set.
1,3,5,7,9,11,13,15,17,19,…………

* Now, delete every third number, we get
1, 3, 7, 9, 13, 15, 19,….….

* Continue this process indefinitely……
Any number that does NOT get deleted due to above process is called “lucky”.

* Therefore, set of lucky numbers is 1, 3, 7, 13,………

Now, given an integer ‘n’, write a function to say whether this number is lucky or not.

`bool isLucky(int n)`

**Analytics:**

Before every iteration, if we calculate position of the given number, then in a given iteration, we can determine if the number will be deleted. Suppose calculated position for the given number is P before some iteration, and each Ith number is going to be removed in this iteration, if P < I then input number is lucky, if P is such that P%I == 0 (I is a divisor of P), then input number is not lucky.

**Code:**

{% highlight c linenos %}
#include <stdio.h>
#define bool int

/* Returns 1 if n is a lucky number, ohterwise returns 0*/
bool isLucky(int n)
{
    static int counter = 2;

    /*variable next_position is just for readability of
       the program we can remove it and use n only */
    int next_position = n;
    if(counter > n)
        return 1;
    if(n%counter == 0)
        return 0;      

    /*calculate next position of input no*/
    next_position -= next_position/counter;

    counter++;
    return isLucky(next_position);
}

/*Driver function to test above function*/
int main()
{
    int x = 5;
    if( isLucky(x) )
        printf("%d is a lucky no.", x);
    else
        printf("%d is not a lucky no.", x);
    getchar();
}
{% endhighlight %}

### <a name="linked_list_circle"></a>Circles in Linked List

> 判断单链表是否有环，要求空间尽量少（2011年MTK）。如何找出环的连接点在哪里？如何知道环的长度？

很经典的题目。

* 判断是否有环。使用两个指针。一个每次前进1，另一个每次前进2，且都从链表第一个元素开始。显然，如果有环，两个指针必然会相遇。
* 环的长度。记下第一次的相遇点，这个指针再次从相遇点出发，直到第二次相遇。此时，步长为1的指针所走的步数恰好就是环的长度。
* 环的链接点。记下第一次的相遇点，使一个指针指向这个相遇点，另一个指针指向链表第一个元素。然后，两个指针同步前进，且步长都为1。当两个指针相遇时所指的点就是环的连接点。

### <a name="linked_list_intersection"></a>Intersection of two Single Linked List without circles

> 判断两无环单链表是否相交。

方法一：直接法

   直接判断第一个链表的每个结点是否在第二个链表中，时间复杂度为O(len1*len2)，耗时很大

方法二：利用计数

如 果 两个链表相交，则两个链表就会有共同的结点；而结点地址又是结点唯一标识。因而判断两个链表中是否存在地址一致的节点，就可以知道是否相交了。可以对第一 个链表的节点地址进行hash排序，建立hash表，然后针对第二个链表的每个节点的地址查询hash表，如果它在hash表中出现，则说明两个链表有共 同的结点。这个方法的时间复杂度为：O(max(len1+len2)；但同时还得增加O(len1)的存储空间存储哈希表。这样减少了时间复杂度，增加 了存储空间。

以链表节点地址为值，遍历第一个链表，使用Hash保存所有节点地址值，结束条件为到最后一个节点（无环）或Hash中该地址值已经存在（有环）。

再遍历第二个链表，判断节点地址值是否已经存在于上面创建的Hash表中。

这个方面可以解决题目中的所有情况，时间复杂度为O(m+n)，m和n分别是两个链表中节点数量。由于节点地址指针就是一个整型，假设链表都是在堆中动态创建的，可以使用堆的起始地址作为偏移量，以地址减去这个偏移量作为Hash函数

方法三

两个没有环的链表相交于一节点，则在这个节点之后的所有结点都是两个链表所共有的。如果它们相交，则最后一个结点一定是共有的，则只需要判断最后一个结点是否相同即可。时间复杂度为O(len1+len2)。对于相交的第一个结点，则可求出两个链表的长度，然后用长的减去短的得到一个差值 K，然后让长的链表先遍历K个结点，然后两个链表再开始比较。

### <a name="find_k_smallest_nubers"></a>寻找最小的k个数

[寻找最小的k个数](http://blog.csdn.net/v_JULY_v/article/details/6370650)

### <a name="java_singleton"></a>Singleton in Java

**Notes:**

* We  should create a static variable so that it can hold one single instance of our class.
* We should declare the constructor private so that  only Class itself can instantiate the object.
* Then the main work  to write the method which returns the instance of the class , let the name of the method be `getInstance()` .

For `getInstance()`, we have two ways to implement it: **Lazy initialization** and **Early initialization**.

#### Lazy initialization:

{% highlight java linenos %}
public class JavaHungrySingleton
{
    private static  volatile JavaHungrySingleton  uniqueInstance;
    
    private JavaHungrySingleton(){}
    
    public static   JavaHungrySingleton  getInstance()
    {
        if (uniqueInstance ==null )
        {
            synchronized(JavaHungrySingleton.class)
            {
                if (uniqueInstance ==null )
                {
                    uniqueInstance=new JavaHungrySingleton();
                }
            }
        }
        return uniqueInstance ;
    }
    
    // other useful methods here
}
{% endhighlight %}

#### Early initailization

If our application always create and use the Singleton class, we can use **Early initialization** to implement Singleton.

{% highlight java linenos %}
public class JavaHungrySingleton
{
    private static JavaHungrySingleton  uniqueInstance  =  new JavaHungrySingleton();
    
    private JavaHungrySingleton(){}
    
    public static  JavaHungrySingleton  getInstance()
    {
        return  uniqueInstance ;
    }
    
    // other useful methods here
}
{% endhighlight %}