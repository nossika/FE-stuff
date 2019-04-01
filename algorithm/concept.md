## 二叉树

### 遍历

例子：

              1
             / \
           2     3
          / \     \
         4   5     6
            / \
           7   8

  - 深度优先遍历:

  前序(根->左->右): 1 2 4 5 7 8 3 6

  中序(左->根->右): 4 2 7 5 8 1 3 6

  后序(左->右->根): 4 7 8 5 2 6 3 1

  - 广度优先遍历:

  1 -> 2 3 -> 4 5 6 -> 7 8


### 二叉搜索树



定义：

- 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
- 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
- 任意节点的左、右子树也分别为二叉查找树；
- 没有键值相等的节点。

例子：

              6
             / \
           2     8
          / \     \
         1   4     9
            / \
           3   5

查找效率：

平均为O(log<sub>2</sub><sup>n</sup>)，最差为O(n)（比如全部节点只有右子树，层数为n）


### 平衡二叉树



### 红黑树

定义：

- 节点是红色或黑色。
- 根是黑色。
- 所有叶子都是黑色（叶子是NIL节点）。
- 每个红色节点必须有两个黑色的子节点。（从每个叶子到根的所有路径上不能有两个连续的红色节点。）
- 从任一节点到其每个叶子的所有简单路径都包含相同数目的黑色节点。

这些约束可以确保：从根到叶子的最长的可能路径不多于最短的可能路径的两倍长。即查找效率最差也是O(log<sub>2</sub><sup>n</sup>)。

例子：

               b13
             /     \
          r8        r17
         /  \       /  \
        b1  b11   b15  b25
         \             /  \
          r6         r22  r27


方法：

变色、左旋、右旋

操作：

插入、删除、查找

## Huffman压缩

原理：根据文件中各字符的出现频率对字符重新编码，越高频的字符给予越短的编码，来降低文件整体数据量。

1. 读取文件，得到各字符频率表。
2. 根据频率表，构建Huffman树（从数组每次取最小的两个值；两个值分别作为左右节点，两值之和作为父节点建立一个子树；并将父节点放入数组，重复取值操作，直到数组内的项全部转化成树。最后构建出来的树满足值越小离根节点越远）。
3. 根据Huffman树，建立字符与编码的映射表，越靠近根节点的字符对应的编码越短。
4. 根据映射表，对原文件重新编译，得到编译后的文件。
5. 把编译后的文件和配置信息（包括Huffman树）打包成为最后的输出文件，完成压缩。
6. 解压时，根据配置信息对编译后的文件进行还原，得到原文件。


## 经典排序

### 快速排序


普通快排 时间复杂度O(n*log<sup>n</sup>)，空间复杂度O(log<sup>n</sup>)


    const arr = [5,11,23,43,72,8,34,99,4,65,54];

    function quickSort(arr) {
      arr = arr.slice();
      function sort(arr) {
        if (arr.length <= 1) return arr;
        const mid = arr.shift();
        const left = [];
        const right = [];
        arr.forEach(num => {
          if (num < mid) {
            left.push(num);
          } else {
            right.push(num);
          }
        });
        return [...sort(left), mid, ...sort(right)];
      }
      return sort(arr);
    }

    quickSort(arr);

    
原地快排 时间复杂度O(n*log<sup>n</sup>)，空间复杂度O(1)


    function betterQuickSort(arr, begin = 0, end = arr.length - 1) {
      if (end - begin <= 1) return;
      const benchmark = arr[begin];
      let i = begin + 1;
      let j = end;
      // 每轮循环都把一个基准数和其左右数组摆对，再对左右数组递归
      while (i < j) {
        while (arr[i] < benchmark) {
          i++;
        }
        while (arr[j] > benchmark) {
          j--;
        }
        if (i < j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
      if (arr[i] > benchmark) {
        i = i - 1;
      }
      [arr[begin], arr[i]] = [arr[i], arr[begin]];
      betterQuickSort(arr, begin, i - 1);
      betterQuickSort(arr, i + 1, end);
    }

    betterQuickSort(arr);



