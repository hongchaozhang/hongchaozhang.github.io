---
layout: post
title: "面试题——数据结构和算法"
date: 2015-09-23 11:02:18 +0800
comments: true
published: false
categories: [algorithm]
---

这里有很多面试题：[GeeksforGeeks](http://www.geeksforgeeks.org/)，有概念，也有算法，也有各大公司的面试经历。尤其是下面两部分：

* [数据结构](http://www.geeksforgeeks.org/data-structures/)
* [算法](http://www.geeksforgeeks.org/fundamentals-of-algorithms/)

Contents

* [Concepts of Stack and Queue](#stack_and_queue)
* [用两个stack模拟一个queue](#simulate_queue_with_two_stacks)
* [用三个stack进行排序](#sort_with_three_stacks)
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

1. What is the difference between **Stack** and **Queue**?

    * Stack: first in last out
    * Queue: first in first out

2. How to implement a **Queue** using two **Stack**s?
 
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

> Words: enqueue, dequeue


### <a name="simulate_queue_with_two_stacks"></a>用两个stack模拟一个queue

#### Solution 1

Someone might provide a O(n) method for deQueue at the very begining, which is pop all the elements from S1 and push them to S2 and then pop up the top and then pop all the elements back to S1. Need to push to get a better solution as solution 2.

* Ranking: normal



#### Solution 2
The key point is to use two stacks to implement the FIFO enqueue/dequeue operation. For enqueue, we just push the element into stack 1. For deque, we’ll first check if stack 2 is empty or not. If stack 2 is empty, we first pop elements from stack 1 and push it to stack 2 one by one till there is no elements in stack 1. Then we pop up the first one from stack 2. If stack 2 is not empty, we just pop up the first one for stack 2.



{% highlight java linenos %}

public class MyQueue<T> {
    private Stack<T>  stack1;
    private Stack<T> stack2;
    
    public MyQueue() {
        stack1 = new Stack<>();
        stack2 = new Stack<>();
    }
    
    public void enQueue(T element) {
        stack1.push(element);
    }
    
    public T deQueue() {
        if (stack2.empty()) {
            while(!stack1.isEmpty()) {
                stack2.push(stack1.pop());
            }
        }
        return stack2.pop();
    }

}

{% endhighlight %}

* Rank: Excellent
* Key points: 
	* FIFO
	* enQueue and deQueue should all O(1) complexity
	* Be able to analysis the time complexity


### <a name="sort_with_three_stacks"></a>用三个stack进行排序

**Question**

With a stack with unsorted numbers and two empty stacks, sort and leave the numbers in the first stack. Sorting in increasing or decreasing order are both OK. Describe the algorithm. No codes is needed. Describe the time complexity of the algorithm.

**Answer**

There are many solutions. Any solution with O(N^2) complexity is OK. One possible solution is first pop all numbers into second stack and remember the smallest one. Then pop all numbers into third, except the smallest number is pop into the first, and remember the second least one. Continue the progress to pick the remaining smallest number into first stack until all numbers are in the first stack.

### <a name="override_andoverload"></a>覆盖(Overriding)和重载(Overloading)的区别是什么？  (detailed answer)

覆盖在运行时决定，重载是在编译时决定。并且覆盖和重载的机制不同，例如在Java中，重载方法的签名必须不同于原先方法的，但对于覆盖签名必须相同。

Overload（重载）相同函数名，但是不同参数个数或者类型。只有返回值类型不同不能构成重载，如果两个函数只有返回值类型不一样，当你调用时，怎么判断去调用哪个？！

> Words: take effect in compile / running phase

### <a name="iteration_and_recursion"></a>迭代(Iteration)和递归(Recursion)有什么区别？(detailed answer)

迭代通过循环来重复执行同一步骤，递归通过调用函数自身来做重复性工作。递归经常是复杂问题（例如汉诺塔、反转链表或反转字符串）的清晰简洁的解决方案。递归的一个缺陷是深度，由于递归在**栈**中存储中间结果，你只能进行一定深度的递归，在那之后你的程序会因为StackOverFlowError而崩溃。这就是在产品代码中优先使用迭代而不是递归的原因。

### <a name="tree_concepts"></a>Concept of Tree

* 二叉树(Binary Tree)
    * 每个结点至多只有两个子树，并且子树有左右之分。
* 二叉查找树(Binary Search Tree) (二叉排序树(Binary Sort Tree))
    * 二叉查找树是有序的二叉树，所有节点（例如根节点）的左子树节点的值都小于或等于该节点的值，右子树节点的值都大于或等于该节点的值。它是一个重要的数据结构，可以用来表示有序的数据。
* 平衡二叉树(Balanced Binary Tree)
* 满二叉树(Full Binary Tree)
    * 深度为k，且有2^k-1个结点的二叉树为满二叉树。满二叉树每一层上面的结点数都达到最大。

#### 二叉树的遍历（Traversing Binary Tree）
用L、D、R分别表示遍历左子树、遍历根结点、遍历右子树，那么在保证先左后右的前提下，我们有三种遍历顺序：

* DLR：先（根）序遍历
* LDR：中（根）序遍历
* LRD：后（根）序遍历

根据二叉树的递归定义，我们可以得到上述三种遍历方法的递归定义如下：

* 先序遍历（DLR）
    * 访问根结点
    * 先序遍历左子树
    * 先序遍历右子树
* 中序遍历（LDR）
    * 中序遍历左子树
    * 访问根结点
    * 中序遍历右结点
* 后续遍历（LRD）
    * 后续遍历左子树
    * 后续遍历右子树
    * 访问根结点

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

**Question:**

Given the header pointer of a linked list, and a pointer to a non-null node, How can you delete the node?

 办法很简单，首先保存p中数据,然后将p->next的数据copy入p中，接下来删除p->next即可。

> 类似的：只给定单链表中某个结点p(非空结点)，在p前面插入一个结点。
> 
> 回答：首先分配一个结点q，将q插入在p后，接下来将p中的数据copy入q中，然后再将要插入的数据记录在p中。

### <a name="find_numbers_appearing_once"></a>找出数组中两个只出现一次的数字(数组)

**Question:**

In a interger array, there are two elements which appear only once, and for all the other elements, every one appears twice. How can you find the two elements which appears once?

> Words: exclusive or (xor)

题目：一个整型数组里除了两个数字之外，其他的数字都出现了两次。
请写程序找出这两个只出现一次的数字。要求时间复杂度是O(n)，空间复杂度是O(1)。
分析：这是一道很新颖的关于位运算的面试题。

首先我们考虑这个问题的一个简单版本：

> **一个数组里除了一个数字之外，其他的数字都出现了两次。**请写程序找出这个只出现一次的数字。

这个题目的突破口在哪里？题目为什么要强调有一个数字出现一次，其他的出现两次？我们想到了**异或运算**的性质：

* 任何一个数字异或它自己都等于0。
* 任何一个数字异或0还等于它自身。

也就是说，如果我们从头到尾依次异或数组中的每一个数字，那么最终的结果刚好是那个只出现一次的数字，因为那些出现两次的数字全部在异或中抵消掉了。

有了上面简单问题的解决方案之后，我们回到原始的问题。如果能够把原数组分为两个子数组。在每个子数组中，包含一个只出现一次的数字，而其他数字都出现两次。如果能够这样拆分原数组，按照前面的办法就是分别求出这两个只出现一次的数字了。

我们还是从头到尾依次异或数组中的每一个数字，那么最终得到的结果就是两个只出现一次的数字的异或结果。因为其他数字都出现了两次，在异或中全部抵消掉了。由于这两个数字肯定不一样，那么这个异或结果肯定不为0，也就是说在这个结果数字的二进制表示中至少就有一位为1。我们在结果数字中找到第一个为1的位的位置，记为第N位。**现在我们以第N位是不是1为标准把原数组中的数字分成两个子数组，第一个子数组中每个数字的第N位都为1，而第二个子数组的每个数字的第N位都为0。**这种划分方法可以保证：

* 出现两次的数字被划分到同一个数组中。
* 只出现一次的两个数字被划分到不同的数组中。

现在我们已经把原数组分成了两个子数组，每个子数组都包含一个只出现一次的数字，而其他数字都出现了两次。因此到此为止，所有的问题我们都已经解决。

**Further question**

Given an array of integers, every element appears three times except for one. Find that single one.

Note: Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?

**Solution 1**

{% highlight java lineno %}

// Time complexity O (n), space complexity O(1)
int findSingleNumber2(int[] array) {
	int result = -1;
	if (array != null && array.length > 0) {
		int size = 32; // assume int needs 4 bytes in java
		int[] count = new int[size];
		for (int i = 0; i < count.length; i ++) {
			count[i] = 0;
		}
		    
		// count[j] remembers the times 1 appears on the j th bit.
		for (int i = 0; i < array.length; i ++){
			for (int j = 0; j < size; j ++) {
				count[j] += (array[i] >> j) & 0x01;
				count[j] %= 3;
			}
		}
		    
		result = 0;
		for (int i = 0; i < size; i ++) {
			result += (count[i] << i);
		}
	}
	 
	return result;
}
{% endhighlight %}

* explaination: 
	- This question also needs bit operation, but is a little different.
	- create an array  whose length is sizeof(int) e.g. count[sizeof(int)], count[i] remembers the times that 1 appears on the i th bit. If count[i] can divide 3 without a remainder, then just ignore it, else use the number to compute the result.

**Solution 2**

{% highlight java lineno %}
// Time complexity O(n), space complexity O(1)
int findSingleNumber22(int[] array) {
	int result = -1;
	if (array != null && array.length > 0) {
		int one = 0;
		int two = 0;
		int three = 0;
		    
		for (int i = 0; i < array.length; i ++) {
			two |= (one & array[i]);
			one ^= array[i];
			three = ~(one & two);
			one &= three;
			two &= three;
		}
		    
		result = one;
	}
	 
	return result;
}
{% endhighlight %}

* explaination:
	- use binary to simulate ternary(三进制). Number 'one' records which bits has appeared 1 one time (times mod 3), Number 'two' records which bits has appeared 1 two times (times mod 3). When the same bit of 'one' and 'two' has appeared 1,then the bit needs to be set to 0, finally 'one' is the result.

* Rank: excellent
* Key points: code structure and syntax, correct output, understand the complexity and ternary.


### <a name="conflicts_while_hashing"></a>在哈希表中处理冲突的方法都有哪些？

线性探测(linear probing)，二次哈希(double hashing)和链接(chaining)。在线性探测中，如果桶已经被占据了，那么函数会线性地检查下一个桶，直到找到一个空位。在链接中，多个元素可以存储在同一个桶中。

### <a name="get_elements_from_data_structure"></a>从哈希表，二叉树和链表中取元素需要多少时间？如果你有数百万记录呢？

哈希表需要O(1)时间，二叉树需要O(logN) (N是树中节点数)，链表需要O(N) (N是链表中节点数）。如果数据结构工作正常（比如哈希表没有或只有相对少量冲突，二叉树是平衡的），数百万记录并不影响效率。如果工作不正常，那么效率会随着记录数上升而下降。

### <a name="sorting"></a>Sort algorithm

reference [here](http://dongxicheng.org/structure/sort/)

#### Stability of sorting

Some sorting algorithms are stable by nature like **Insertion sort**, **Merge Sort**, **Bubble Sort**, etc. And some sorting algorithms are not, like **Heap Sort**, **Quick Sort**, etc.

### <a name="iterative_tree_traversal"></a>Iterative Preorder(Postorder) Traversal

1. Create an empty stack nodeStack and push root node to stack.
2. Do following while nodeStack is not empty.
	1. Pop an item from stack and print it.
	2. Push **right** (<del>left for Postorder</del>. **Updated**: this is not correct, as pre- or post- is talking about the sequece of the parent node we travesed, not the sequece between left child and right child.) child of popped item to stack
	3. Push **left** (<del>right for Postorder</del>) child of popped item to stack

Right child is pushed before left child to make sure that left subtree is processed first.

[二叉树的非递归遍历](http://www.cnblogs.com/dolphin0520/archive/2011/08/25/2153720.html)阐述了三种遍历顺序的非递归遍历方法。难易程度从简单到复杂依次是：先序遍历、中序遍历、后续遍历。

#### 前序遍历

前序遍历按照“根结点-左孩子-右孩子”的顺序进行访问。

**递归实现**

{% highlight cpp lineno %}
void preOrder1(BinTree *root)     //递归前序遍历 
{
    if(root!=NULL)
    {
        cout<<root->data<<" ";
        preOrder1(root->lchild);
        preOrder1(root->rchild);
    }
}
{% endhighlight %}

**非递归实现**

根据前序遍历访问的顺序，优先访问根结点，然后再分别访问左孩子和右孩子。即对于任一结点，其可看做是根结点，因此可以直接访问，访问完之后，若其左孩子不为空，按相同规则访问它的左子树；当访问其左子树时，再访问它的右子树。因此其处理过程如下：

对于任一结点P：

1. 访问结点P，并将结点P入栈;
2. 判断结点P的左孩子是否为空，若为空，则取栈顶结点并进行出栈操作，并将栈顶结点的右孩子置为当前的结点P，循环至1;若不为空，则将P的左孩子置为当前的结点P;
3. 直到P为NULL并且栈为空，则遍历结束。
     
{% highlight cpp lineno %}
void preOrder2(BinTree *root)     //非递归前序遍历 
{
    stack<BinTree*> s;
    BinTree *p=root;
    while(p!=NULL||!s.empty())
    {
        while(p!=NULL)
        {
            cout<<p->data<<" ";
            s.push(p);
            p=p->lchild;
        }
        if(!s.empty())
        {
            p=s.top();
            s.pop();
            p=p->rchild;
        }
    }
}
{% endhighlight %}

#### 中序遍历

中序遍历按照“左孩子-根结点-右孩子”的顺序进行访问。

**递归实现**

{% highlight cpp lineno %}
void inOrder1(BinTree *root)      //递归中序遍历
{
    if(root!=NULL)
    {
        inOrder1(root->lchild);
        cout<<root->data<<" ";
        inOrder1(root->rchild);
    }
}
{% endhighlight %}

**非递归实现**

根据中序遍历的顺序，对于任一结点，优先访问其左孩子，而左孩子结点又可以看做一根结点，然后继续访问其左孩子结点，直到遇到左孩子结点为空的结点才进行访问，然后按相同的规则访问其右子树。因此其处理过程如下：

对于任一结点P，

1. 若其左孩子不为空，则将P入栈并将P的左孩子置为当前的P，然后对当前结点P再进行相同的处理；
2. 若其左孩子为空，则取栈顶元素并进行出栈操作，访问该栈顶结点，然后将当前的P置为栈顶结点的右孩子；
3. 直到P为NULL并且栈为空则遍历结束

{% highlight cpp lineno %}
void inOrder2(BinTree *root)      //非递归中序遍历
{
    stack<BinTree*> s;
    BinTree *p=root;
    while(p!=NULL||!s.empty())
    {
        while(p!=NULL)
        {
            s.push(p);
            p=p->lchild;
        }
        if(!s.empty())
        {
            p=s.top();
            cout<<p->data<<" ";
            s.pop();
            p=p->rchild;
        }
    }    
}
{% endhighlight %}

#### 后续遍历

后序遍历按照“左孩子-右孩子-根结点”的顺序进行访问。

**递归实现**

{% highlight cpp lineno %}
void postOrder1(BinTree *root)    //递归后序遍历
{
    if(root!=NULL)
    {
        postOrder1(root->lchild);
        postOrder1(root->rchild);
        cout<<root->data<<" ";
    }    
}
{% endhighlight %}

**非递归实现**

后序遍历的非递归实现是三种遍历方式中最难的一种。因为在后序遍历中，要保证左孩子和右孩子都已被访问并且左孩子在右孩子前访问才能访问根结点，这就为流程的控制带来了难题。下面介绍两种思路。

第一种思路：

对于任一结点P，将其入栈，然后沿其左子树一直往下搜索，直到搜索到没有左孩子的结点，此时该结点出现在栈顶，但是此时不能将其出栈并访问，因此其右孩子还为被访问。所以接下来按照相同的规则对其右子树进行相同的处理，当访问完其右孩子时，该结点又出现在栈顶，此时可以将其出栈并访问。这样就保证了正确的访问顺序。可以看出，在这个过程中，每个结点都两次出现在栈顶，只有在第二次出现在栈顶时，才能访问它。因此需要多设置一个变量标识该结点是否是第一次出现在栈顶。

{% highlight cpp lineno %}
void postOrder2(BinTree *root)    //非递归后序遍历
{
    stack<BTNode*> s;
    BinTree *p=root;
    BTNode *temp;
    while(p!=NULL||!s.empty())
    {
        while(p!=NULL)              //沿左子树一直往下搜索，直至出现没有左子树的结点 
        {
            BTNode *btn=(BTNode *)malloc(sizeof(BTNode));
            btn->btnode=p;
            btn->isFirst=true;
            s.push(btn);
            p=p->lchild;
        }
        if(!s.empty())
        {
            temp=s.top();
            s.pop();
            if(temp->isFirst==true)     //表示是第一次出现在栈顶 
             {
                temp->isFirst=false;
                s.push(temp);
                p=temp->btnode->rchild;    
            }
            else                        //第二次出现在栈顶 
             {
                cout<<temp->btnode->data<<" ";
                p=NULL;
            }
        }
    }    
}
{% endhighlight %}

第二种思路：

要保证根结点在左孩子和右孩子访问之后才能访问，因此对于任一结点P，先将其入栈。如果P不存在左孩子和右孩子，则可以直接访问它；或者P存在左孩子或者右孩子，但是其左孩子和右孩子都已被访问过了，则同样可以直接访问该结点。若非上述两种情况，则将P的右孩子和左孩子依次入栈，这样就保证了每次取栈顶元素的时候，左孩子在右孩子前面被访问，左孩子和右孩子都在根结点前面被访问。

{% highlight cpp lineno %}
void postOrder3(BinTree *root)     //非递归后序遍历
{
    stack<BinTree*> s;
    BinTree *cur;                      //当前结点 
    BinTree *pre=NULL;                 //前一次访问的结点 
    s.push(root);
    while(!s.empty())
    {
        cur=s.top();
        if((cur->lchild==NULL&&cur->rchild==NULL)||
           (pre!=NULL&&(pre==cur->lchild||pre==cur->rchild)))
        {
            cout<<cur->data<<" ";  //如果当前结点没有孩子结点或者孩子节点都已被访问过 
              s.pop();
            pre=cur; 
        }
        else
        {
            if(cur->rchild!=NULL)
                s.push(cur->rchild);
            if(cur->lchild!=NULL)    
                s.push(cur->lchild);
        }
    }    
}
{% endhighlight %}

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

或者一种更简洁的方式：

{% highlight cpp lineno %}

 TreeNode* invertTree(TreeNode* root) {  
        if(root==NULL)  
            return NULL;  
        TreeNode * ptmpNode = root->left;  
        root->left = invertTree(root->right);  
        root->right = invertTree(ptmpNode);  
        return root;  
  } 
  
{% endhighlight %}

#### Iterative method: 

{% highlight cpp lineno %}

TreeNode* invertTree2(TreeNode* root) {  
        queue<TreeNode*> tree_queue;  
        if (root == NULL)  
            return root;  
        tree_queue.push(root);  
        while(tree_queue.size() > 0){  
            TreeNode * pNode = tree_queue.front();  
            tree_queue.pop();  
            TreeNode * pLeft = pNode->left;  
            pNode->left = pNode->right;  
            pNode->right = pLeft;  
            if (pNode->left)  
                tree_queue.push(pNode->left);  
            if (pNode->right)  
                tree_queue.push(pNode->right);  
        }  
        return root;  
    } 
    
{% endhighlight %}

这里用Queue还是Stack都可以，区别是先反转左子树，还是先反转右子树，这个对结果没有区别。

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

堆排序过程中涉及的主要概念参考[常见排序算法 - 堆排序 (Heap Sort)](http://bubkoo.com/2014/01/14/sort-algorithm/heap-sort/).

**Questiong：**

Given n intergers, how can we find the k smallest ones?

> Words: max-heap

输入n个整数，输出其中最小的k个。

**Analytics：**

基本上有以下几种思路：

1. 快速排序平均所费时间为`n*logn`，然后再遍历序列中前k个元素输出，即可，总的时间复杂度为`O(n*logn+k)=O(n*logn)`。

2. 咱们再进一步想想，题目并没有要求要查找的k个数，甚至后n-k个数是有序的，既然如此，咱们又何必对所有的n个数都进行排序列?

	这时，咱们想到了用选择或交换排序，即遍历n个数，先把最先遍历到得k个数存入大小为k的数组之中，对这k个数，利用选择或交换排序，找到k个数中的最大数kmax(kmax设为k个元素的数组中最大元素)，用时`O(k)`(你应该知道，插入或选择排序查找操作需要`O(k)`的时间)，后再继续遍历后n-k个数，x与kmax比较：如果`x<kmax`，则x代替kmax，并再次重新找出k个元素的数组中最大元素kmax；如果`x>kmax`，则不更新数组。这样，每次更新或不更新数组的所用的时间为`O(k)`或`O(0)`，整趟下来，总的时间复杂度平均下来为：`n*O(k)=O(n*k)`。

3. 更好的办法是维护k个元素的最大堆，原理与上一个方案一致，即用容量为k的最大堆存储最先遍历到的k个数，并假设它们即是最小的k个数，建堆费时`O(k)`后，有`k1<k2<...<kmax`(kmax设为大顶堆中最大元素)。继续遍历数列，每次遍历一个元素x，与堆顶元素比较，x<kmax，更新堆(用时`O(logk)`)，否则不更新堆。这样下来，总费时`O(k+(n-k)*logk)=O(n*logk)`。

4. 可以用最小堆初始化数组，然后取这个优先队列前k个值。复杂度	`O(n)+k*O(logn)`。

试着从时间和空间复杂度两个方面分析一下方法3和方法4。


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