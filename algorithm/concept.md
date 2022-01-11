
# 概念

## RSA加密

### 用法

密钥a：e（指数），n（模）
密钥b：d（指数），n（模）

用密钥a把M加密为C：C = M ** e (mod n)
用密钥b把C还原为M：M = C ** d (mod n)

也可以反过来用密钥b加密，密钥a还原，从数学上密钥a、b完全可以交换使用。但在实际运用中，一般会生成一个指数较小的（或者固定的）数作为公钥开放（客户端使用起来更方便），指数较大的数作为私钥。如果将它们交换，相当于用一个指数较小的数作为私钥，较容易被反推出来，不安全。

### 密钥对生成

生成e，d，n过程：

1、选取两个足够大的素数：p、q

2、n = p * q

3、m = (p - 1) * (q - 1)

4、找一个与m互质的数e，且1 < e < m

5、找出d，使得d * e (mod m) = 1

6、生成完毕，密钥a：(e, n)，密钥b：(d, n)

### 安全性

安全性是基于：大素数分解困难。在这个条件成立的前提下，通过已知的大素数n难以反推出p、q，所以也难以推出e、d，因此密钥a、b虽然可以相互加密解密，但算出另一密钥是困难的。

### 例子

生成密钥对

1、选取两个素数 p = 3 ，q = 11（为方便举例选取了较小的素数）

2、n = p * q = 3 * 11 = 33

3、m = (p - 1) * (q - 1) = (3 - 1) * (11 - 1) = 20

4、从比m小的数中找出一个与m互质的数 e = 3

5、可以通过穷举法，d从1开始递增，试出满足条件的最小的d = 7

6、得出一对密钥：密钥a：(3, 33)，密钥b：(7, 33)

对'rsa'这个字符串加密

1、对‘rsa’进行数字化转化，'r'，‘s'，’a'可以转化成其对应字母表次序：18、19、1

2、用密钥a加密：

r => 18 => 18 ** 3 % 33 => 24

s => 19 => 19 ** 3 % 33 => 28

a => 1 => 1 ** 3 % 33 => 1

加密后：['r', 's', 'a'] => [24, 28, 1]

对加密后的[24, 28, 1]进行还原

1、用密钥b解密

24 => 24 ** 7 % 33 => 18 => r

28 => 28 ** 7 % 33 => 19 => s

1 => 1 ** 7 % 33 => 1 => a

得出结果'rsa'


## 二叉树

### 类型

#### 完全二叉树

节点必须逐层、从左到右添加。

#### 二叉搜索树

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


#### 平衡二叉树

一个节点的左右子树的高度差值不能大于1。

##### 红黑树

红黑树是平衡二叉树的一种。

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

```js
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
```
    
原地快排 时间复杂度O(n*log<sup>n</sup>)，空间复杂度O(1)

```js
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
```
### 插入排序

时间复杂度O(n<sup>2</sup>)，空间复杂度O(1)

```js
const arr = [4,2,56,37,21,43,673,5,4,63,45,345,66,74,63,646,457,48,74,234,45];

function insertSort(arr) {
  // i从1开始，每次递增1，不断往前面的有序数组插入，形成新的有序数组，直到arr末尾，此时整个数组有序
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i];
    let j = i;

    // 和前面的有序数组对比，大的元素往后挪一位，直到找到自己的位置插入
    for (; j > 0 && arr[j - 1] > temp; j--) {
      arr[j] = arr[j - 1];
    }

    arr[j] = temp;
  }
  
  return arr;
}

console.log(insertSort(arr.slice()));
```

希尔排序，比起插入排序，它的平均时间复杂度更优，取决于步长，空间复杂度O(1)

```js
function shellSort(arr) {
  // 步长取值的因子
  const factor = 2.2;

  // 对整个数组以步长(gap)分组，在各组内部不断做插入排序，每次循环gap逐渐递减，直到gap为1
  for (let gap = Math.floor(arr.length / factor); gap >= 1; gap = Math.floor(gap / factor)) {

    // 还是插入排序的算法，不同的是gap不再是固定是1，这样交换距离更远，使得效率更高
    for (let i = gap; i < arr.length; i += gap) {
      let temp = arr[i];
      let j = i;

      for (; j > 0 && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }

      arr[j] = temp;
    }
  }

  return arr;
}

console.log(shellSort(arr.slice()));
```

### 基数排序

设mod为进制，rad为数组元素在该进制下的最大位数。则时间复杂度为O(rad * n)，空间复杂度为O(mod * n)。

```js
function radixSort(arr) {
  const mod = 10; // 进制
  let digit = 0; // 当前正在处理的位数，0表示个位，1表示十位
  
  // 创造和进制等数量的桶
  const buckets = (new Array(mod).fill(null)).map(() => ([]));

  let temp = [];

  // 把所有数据放入桶9，作为初始条件
  buckets[9] = arr.slice();

  // 当所有数据落入桶0，说明处理的进制已经到达上限，可以结束
  while (buckets[0].length !== arr.length) {
    temp = [];

    // 从所有桶里按序取出num，放入temp数组
    buckets.forEach(bucket => {
      while (bucket.length) {
        const num = bucket.shift();
        if (num === undefined) break;
        temp.push(num);
      }
    });
    
    // 对temp数组里的num，按位数放入对应的桶
    temp.forEach(num => {
      buckets[(num / (mod ** digit)) % mod | 0].push(num);
    });

    digit++;
  }

  return buckets[0];
}

console.log(radixSort(arr.slice()));

```