import{_ as e,p as i,q as a,a1 as d}from"./framework-5866ffd3.js";const n={},l=d(`<h1 id="数据结构" tabindex="-1"><a class="header-anchor" href="#数据结构" aria-hidden="true">#</a> 数据结构</h1><h2 id="栈-stack" tabindex="-1"><a class="header-anchor" href="#栈-stack" aria-hidden="true">#</a> 栈（stack）</h2><h3 id="操作" tabindex="-1"><a class="header-anchor" href="#操作" aria-hidden="true">#</a> 操作</h3><ul><li><p>push - 最上方插入元素</p></li><li><p>pop - 返回最上方元素，并从栈中移除</p></li></ul><h2 id="堆-heap" tabindex="-1"><a class="header-anchor" href="#堆-heap" aria-hidden="true">#</a> 堆（heap）</h2><p>数结构，完全二叉树的一种特殊类型，所有节点满足根节点大于（小于）左右子节点，所以堆顶为最大（最小）元素。</p><ul><li><p>查找</p></li><li><p>插入</p></li><li><p>删除</p></li></ul><h2 id="队列-queue" tabindex="-1"><a class="header-anchor" href="#队列-queue" aria-hidden="true">#</a> 队列 （queue）</h2><h3 id="操作-1" tabindex="-1"><a class="header-anchor" href="#操作-1" aria-hidden="true">#</a> 操作</h3><ul><li><p>enqueue - 在队尾插入元素</p></li><li><p>dequeue - 返回队首元素，并从队列删除</p></li></ul><h2 id="数组-array" tabindex="-1"><a class="header-anchor" href="#数组-array" aria-hidden="true">#</a> 数组（array）</h2><h3 id="操作-2" tabindex="-1"><a class="header-anchor" href="#操作-2" aria-hidden="true">#</a> 操作</h3><ul><li><p>get - 读取某个索引的元素</p></li><li><p>set - 替换某个索引的元素</p></li><li><p>insert - 在某个索引插入元素</p></li><li><p>delete - 删除某个索引的元素</p></li><li><p>size - 返回数组长度</p></li></ul><h2 id="链表-linked-list" tabindex="-1"><a class="header-anchor" href="#链表-linked-list" aria-hidden="true">#</a> 链表（linked list）</h2><h3 id="操作-3" tabindex="-1"><a class="header-anchor" href="#操作-3" aria-hidden="true">#</a> 操作</h3><ul><li><p>insertHead - 在链表头部之前插入元素</p></li><li><p>insertAfter - 在指定元素之后插入新元素</p></li><li><p>has - 查找指定元素</p></li><li><p>delete - 删除指定元素</p></li></ul><h2 id="树-tree" tabindex="-1"><a class="header-anchor" href="#树-tree" aria-hidden="true">#</a> 树（tree）</h2><h3 id="二叉树-binary-tree" tabindex="-1"><a class="header-anchor" href="#二叉树-binary-tree" aria-hidden="true">#</a> 二叉树（binary tree）</h3><h4 id="满二叉树-perfect-binary-tree" tabindex="-1"><a class="header-anchor" href="#满二叉树-perfect-binary-tree" aria-hidden="true">#</a> 满二叉树（perfect binary tree）</h4><p>节点铺满树的每一层。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>        6
     /    \\
    2      8
   /  \\   / \\
  1   4  3   9
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="完全二叉树-complete-binary-tree" tabindex="-1"><a class="header-anchor" href="#完全二叉树-complete-binary-tree" aria-hidden="true">#</a> 完全二叉树（complete binary tree）</h4><p>节点必须逐层、从左到右添加。也就是仅有最后一层没铺满。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>        6
     /    \\
    2      8
   /  \\   / 
  1   4  3 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="二叉搜索树-binary-search-tree" tabindex="-1"><a class="header-anchor" href="#二叉搜索树-binary-search-tree" aria-hidden="true">#</a> 二叉搜索树（binary search tree）</h4><p>定义：</p><ul><li>若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；</li><li>若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；</li><li>任意节点的左、右子树也分别为二叉查找树；</li><li>没有值重复的节点。</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>      6
     /  \\
    2    8
   /  \\   \\
  1    4   9
      / \\   \\
     3   5  10
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查找效率：平均为 O(log<sub>2</sub><sup>n</sup>)，相当于二分查找</p><p>插入效率：平均为 O(log<sub>2</sub><sup>n</sup>)，二分查找到对应位置</p><p>删除效率：平均为 O(log<sub>2</sub><sup>n</sup>)，二分查找到对应节点，将其用中序遍历的后继节点替换</p><blockquote><p>最差情况下全为O(n)，比如全部节点只有右子树（类似链表），层数为n。</p></blockquote><h4 id="平衡二叉树-balanced-binary-tree" tabindex="-1"><a class="header-anchor" href="#平衡二叉树-balanced-binary-tree" aria-hidden="true">#</a> 平衡二叉树（balanced binary tree）</h4><p>所有节点都满足：其左右子树的高度差值不大于1。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>      1
     /  \\
    2    8
   /  \\   \\
  6    4   9
      / \\
     3   5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="平衡二叉搜索树-avl-tree" tabindex="-1"><a class="header-anchor" href="#平衡二叉搜索树-avl-tree" aria-hidden="true">#</a> 平衡二叉搜索树（AVL tree）</h4><p>同时满足“二叉搜索树”和“平衡二叉树”的所有特性。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>      6
     /  \\
    2    8
   /  \\   \\
  1    4   9
      / \\
     3   5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>普通的“二叉搜索树”在经历多次插入删除操作后，可能会变得极不平衡，导致查找效率退化。</p><p>AVL 树则能一直保持较好的查找效率。可以通过对“二叉搜索树”中失衡节点进行“左旋”、“右旋”等操作，使其变成“AVL 树”。</p><h5 id="红黑树" tabindex="-1"><a class="header-anchor" href="#红黑树" aria-hidden="true">#</a> 红黑树</h5><p>红黑树是更进一步的“AVL 树”，其平衡条件更易达到，有更少的“旋转”操作，从而有更好的增删性能。</p><p>定义：</p><ul><li>节点是红色或黑色。</li><li>根是黑色。</li><li>所有叶子都是黑色（叶子是NIL节点）。</li><li>每个红色节点必须有两个黑色的子节点。（从每个叶子到根的所有路径上不能有两个连续的红色节点。）</li><li>从任一节点到其每个叶子的所有简单路径都包含相同数目的黑色节点。</li></ul><p>这些约束可以确保：从根到叶子的最长的可能路径不多于最短的可能路径的两倍长。即查找效率最差也是O(log<sub>2</sub><sup>n</sup>)。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>          b13
        /     \\
     r8        r17
    /  \\       /  \\
  b1   b11   b15  b25
    \\             /  \\
    r6         r22  r27
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="二叉树的遍历" tabindex="-1"><a class="header-anchor" href="#二叉树的遍历" aria-hidden="true">#</a> 二叉树的遍历</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>       1
      /  \\
     2     3
   /  \\     \\
  4    5     6
      / \\
     7    8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>深度优先遍历:</p><p>前序(根-&gt;左-&gt;右): 1 2 4 5 7 8 3 6</p><p>中序(左-&gt;根-&gt;右): 4 2 7 5 8 1 3 6</p><p>后序(左-&gt;右-&gt;根): 4 7 8 5 2 6 3 1</p></li><li><p>广度优先遍历:</p><p>1 -&gt; 2 3 -&gt; 4 5 6 -&gt; 7 8</p></li></ul><h2 id="堆-heap-1" tabindex="-1"><a class="header-anchor" href="#堆-heap-1" aria-hidden="true">#</a> 堆（heap）</h2><h3 id="分类" tabindex="-1"><a class="header-anchor" href="#分类" aria-hidden="true">#</a> 分类</h3><ul><li><p>小顶堆：</p><p>所有节点满足：节点值小于其子节点</p></li><li><p>大顶堆：</p><p>所有节点满足：节点值大于其子节点</p></li></ul><h2 id="图-graph" tabindex="-1"><a class="header-anchor" href="#图-graph" aria-hidden="true">#</a> 图（graph）</h2><h3 id="分类-1" tabindex="-1"><a class="header-anchor" href="#分类-1" aria-hidden="true">#</a> 分类</h3><ul><li><p>有向图</p></li><li><p>无向图</p></li></ul><h3 id="存储方式" tabindex="-1"><a class="header-anchor" href="#存储方式" aria-hidden="true">#</a> 存储方式</h3><ul><li><p>邻接矩阵：全部节点作为矩阵的行和列，matrix[i][j] 表示 i 节点与 j 节点是否邻接</p></li><li><p>邻接表：全部节点作为数组，各自存储与自己邻接的其他节点</p></li></ul><h3 id="操作-4" tabindex="-1"><a class="header-anchor" href="#操作-4" aria-hidden="true">#</a> 操作</h3><ul><li><p>插入点</p></li><li><p>返回点的相邻点</p></li><li><p>遍历图，可分为DFS/BFS</p></li></ul><h2 id="散列表-hash-table" tabindex="-1"><a class="header-anchor" href="#散列表-hash-table" aria-hidden="true">#</a> 散列表（hash table）</h2><h3 id="操作-5" tabindex="-1"><a class="header-anchor" href="#操作-5" aria-hidden="true">#</a> 操作</h3><ul><li><p>has - 查找指定元素</p></li><li><p>add - 插入元素</p></li></ul>`,62),r=[l];function s(t,h){return i(),a("div",null,r)}const c=e(n,[["render",s],["__file","structure.html.vue"]]);export{c as default};
