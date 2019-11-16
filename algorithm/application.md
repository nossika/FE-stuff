# 算法题

## 背包最大价值问题

有n个有各自价值和重量的物品，以及一个固定容量的背包，可以自由选择物品来放入背包，求背包能达到的最大价值。

假设数据如下：

```js
// 物品列表items: Array<[价值, 重量]>
const items = [[1,1],[3,4],[2,3],[30,48],[21,36],[12,11],[10,12],[15,16],[6, 12],[8, 22]];

// 背包容量capacity
const capacity = 39;
```


### 1. 求最大值

对于前i个物品而言（假设第i个物品的价值为v[i]，重量为w[i]），此时最大值等于不放入第i个物品时的最大值和放入第i个物品时的最大值两者中取大。可以如下状态转移方程表示：

`f(i, capacity) = max{ f(i - 1, capacity), f(i - 1, capacity - w[i]) + v[i] }`

```js
function getVal(i, capacity) {
  const [weight, value] = items[i];
  if (i === 0) {
    if (capacity < weight) return 0;
    return value;
  }
  return capacity >= weight ? Math.max(getVal(i - 1, capacity), getVal(i - 1, capacity - weight) + value) : getVal(i - 1, capacity);
}

getVal(items.length - 1, capacity); // 75
```

### 2. 求最大值及其方案

在算法1的基础上加入bag数组来记录当前解法用到的物品

```js
function getVal(i, capacity, bag) {
  const [weight, value] = items[i];

  if (i === 0) {
    if (capacity < weight) return [0, bag];
    return [value, bag.concat(0)];
  }

  let [unputVal, unputBag] = getVal(i - 1, capacity, bag);

  if (capacity >= weight) {
    let [putVal, putBag] = getVal(i - 1, capacity - weight, bag);
    putVal += value;
  
    if (putVal > unputVal) {
      return [putVal, putBag.concat(i)];
    } else {
      return [unputVal, unputBag];
    }
  } else {
    return [unputVal, unputBag];
  }
}

getVal(items.length - 1, capacity, []); // [75, [0, 1, 4, 8, 9]]
```

### 3. 物品带数量时的最大值

基于算法1作拓展，此时物品i不再是放入或者不放入（放入0个或1个），而是可以放入k个，k是一个有限整数集合，满足`0 <= k <= limit`且`w[i] * k <= capacity`，则状态转移方程应该改为

`f(i, capacity) = max{ f(i - 1, capacity - w[i] * k) + v[i] * k } (0 <= k <= limit & w[i] * k <= capacity)`

```js
// 带数量的物品列表itemsWithLimit: Array<[价值, 重量, 数量]>
const itemsWithLimit = [[1,1,3],[3,4,5],[2,3,1],[30,48,1],[21,36,2]];

function getVal(i, capacity) {
  const [weight, value, limit] = itemsWithLimit[i];
  if (i === 0) {
    return Math.min((capacity / weight | 0), limit) * value;
  }
  const solutions = [];
  for (let k = 0; weight * k <= capacity && k <= limit; k++) {
    solutions.push(getVal(i - 1, capacity - weight * k) + value * k);
  }
  return Math.max(...solutions);
}

getVal(itemsWithLimit.length - 1, capacity); // 58
```

## 硬币凑整问题

有i种面值不同的硬币，数量不限，需要用这i种硬币凑出刚好为n的数额

假设数据如下：

```js
// 硬币种类coins: Array<面值>
const coins = [1, 2, 5, 10, 20];

// 目标数额n
const n = 98;
```

### 1. 求全部解法数量

使用前i种coin的解法数 = 仅使用前i-1种coin的解法数 + 用上第i种coin的解法数

```js
function coinsSolutions(coins, n) {

  // 保证coins数组是升序的
  coins.sort((a, b) => a - b);

  // 用于存放函数use1 use2 use3...use{i}，函数参数为目标数值n，返回值为仅用前i种coin能凑出的解法数
  const solutions = {};

  for (let [index, value] of coins.entries()) {
    
    // 只用第一种coin时特殊处理，如果n能被面值整除，则返回解法数为1，否则返回解法数0
    if (index === 0) {
      solutions['use1'] = function(n) {
        return n % value === 0 ? 1 : 0;
      }
      continue;
    }

    // 使用前i种coin的解法数 = 仅使用前i-1种coin的解法数 + 用上第i种coin的解法数
    // (JS相关)可使用new Function来动态定义函数，因为new Function内的作用域默认为全局作用域，无法访问solutions对象，这里使用with+bind的写法来把solutions传进其作用域
    solutions['use' + (index + 1)] = new Function(
      'n', 
      `with(this){
        let result = 0;
        for (let i = n; i >= 0; i = i - ${value}) {
          result += use${index}(i);
        }
        return result;
      }`
    ).bind(solutions);
  }

  // 最后的解等于所有coin种类都用上的解
  return solutions['use' + coins.length](n);
} 
```

### 2. 求最少使用的硬币数

此问题解法和背包问题类似，每个硬币数量对应的value为1，求最小value。

使用前i种硬币凑成的数额n = (仅使用前i-1种硬币凑成n - coins[i] * k) + (单独使用k个第i种硬币凑成coins[i] * k)

即前i种硬币凑成n的最少硬币个数的状态转移方程为：

`f(n, i) = min{ f(n - coins[i] * k, i - 1) + k } (k >= 0 & coins[i] * k <= n)`


```js
function coinsMinSolution(coins, n) {
  coins.sort((a, b) => a - b);

  function getMin(n, i) {
    // 仅使用第1种硬币时，n能整除面值，则数量为n/面值，否则设为无穷大，在后面的Math.min比较时忽略此解法 
    if (i === 0) {
      return n % coins[0] === 0 ? n / coins[0] : Infinity;
    }

    // 写出状态转移方程，循环k来测试它，找出其最小值
    const solutions = [];
    for (let k = 0; coins[i] * k <= n; k++) {
      solutions.push(getMin(n - coins[i] * k, i - 1) + k);
    }
    return Math.min(...solutions);
  }

  return getMin(n, coins.length - 1);
}
```



## 多个有序数组合并

```js
const arr1 = [2,5,7];
const arr2 = [1,4,7,9];
const arr3 = [0,3,4,8];

function mergeOrderedArr(arrs) {
  const result = new Array(arrs.reduce((acc, arr) => acc + arr.length, 0)); // 排序结果数组
  const idxArr = new Array(arrs.length).fill(0); // idx数组，idx对应arrs的每个arr，表示各个arr当前遍历到的位置

  // 在每个arr剩余的第一项中进行对比，最小的取出放入result，并且该数组idx+1表示该项已被取出
  for (let i = 0; i < result.length; i++) {
    let min = Infinity;
    let minArr = 0;

    for (let j = 0; j < arrs.length; j++) {
      let num = arrs[j][idxArr[j]];

      if (min > num) {
        min = num;
        minArr = j;
      }
    }

    idxArr[minArr] = idxArr[minArr] + 1;
    result[i] = min;
  }

  return result;
}

mergeOrderedArr([arr1, arr2, arr3]); // [0, 1, 2, 3, 4, 4, 5, 7, 7, 8, 9]
```



## 连续子数组的最大和


用f(i)表示arr中以第i项为结尾的连续子数组的最大和，则其状态转移方程如下

`f(i) = max{ f(i - 1) + arr[i], arr[i] }`

求出每一个f(i)的值，再从中取最大值作为最后结果

`result = max{ f(i) } (0 <= i <= arr.length - 1)`

```js
function getMax(arr) {

  // 设置缓存数组，cache[i]表示以第i项为结尾的连续子数组的最大和
  const cache = [];

  function getMaxEndWithIndex(i) {
    if (i === 0) {
      cache[i] = arr[i];
    }
    if (!cache[i]) {
      cache[i] = Math.max(getMaxEndWithIndex(i - 1) + arr[i], arr[i]);
    }
    return cache[i];
  }

  // 计算包含最后一项的子数组的最大和，因为每一项的结果都依赖于前一项，利用此过程递归求出所有项的结果
  getMaxEndWithIndex(arr.length - 1);
  
  return Math.max(...cache);

}
```



## 求字符串最长不重复子串

1. 定义start、end两个指针，起始位置为0，初始化max为0
2. 将start、end指向起始位置，初始化缓存列表
3. end不断向后移动，并将指向的值存入缓存，直到end指向的字母已存在缓存中（说明出现了重复字符），计算end - start的值并与max比较，保留大者
4. 起始位置+1（即start+1），重复步骤2，直到 str.length - start > max 时（此时再继续下去也不会出现更大的max），停止循环，输出max

```js
function lengthOfLongestSubstring(str) {
  let start = 0;
  let end = 0;
  let max = 0;
  while (str.length - start > max) {
    end = start;
    const charCache = new Set();
    while (true) {
      const char = str[end];
      if (!char || charCache.has(char)) {
        max = Math.max(max, end - start);
        break;
      }
      charCache.add(char);
      end++;
    }
    start++;
  }
  return max;
};
```

## 约瑟夫环

n个人围成一个圆圈，随机选定某人为1号，顺时针依次对每个人编号到n，并且选定一个数m。从1号开始，顺时针依次报数，报到m的人被淘汰，接着淘汰者的下个人重新从1开始报数，继续下一轮淘汰。如此往复直到只剩1人，求此人的编号。

链表解法：

```js
class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class Circle {
  constructor(n) {
    if (!(n >= 1)) throw new Error('n should be greater than 1');
    let i = 1;
    this.head = new Node(i);
    let curNode = this.head;
    while (++i <= n) {
      curNode.next = new Node(i);
      curNode = curNode.next;
    }
    this.tail = curNode;
    this.tail.next = this.head;
  }
}

const n = 5; // 人数
const m = 3; // 淘汰号码

const circle = new Circle(n); // 构造环形链表

let node = circle.head;
let prev = circle.tail;
let count = 1;

// 循环删除链表里的项，直到只剩一项
while (node.next !== node) {
  if (count === m) {
    prev.next = node.next;
    count = 1;
  } else {
    prev = node;
    count++;
  }
  node = node.next;
}

node.val; // 结果为4
```


递归解法：

用函数`f(n,m)`表示游戏获胜者的编号。已知`f(1, m) = 1`，只要把`f(n, m)`用`f(n - 1, m)`表示出来，就能递归求解。

`f(n, m)=(f(n - 1, m) + m) % n`


```js
function winner(n, m) {
  if (n === 1) return 1;
  return (winner(n - 1, m) + m - 1) % n + 1;
}

winner(5, 3); // 4
```

### 矩阵以对角线遍历

```js
const data = [
  [1,1,1,1,1],
  [1,1,1,1,1],
  [1,1,1,1,1],
];

const n = data[0].length; // 矩阵宽度
const m = data.length; // 矩阵高度
let i = 0; // i表示第i行
let j = 0; // j表示第j列
let direction = 1; // 遍历方向：1表示往右上，-1表示往左下

while (!(i === n - 1 && j === m - 1)) {
  console.log(i, j);

  if (direction === 1) {
    if (i + 1 >= n) {
      direction = -1;
      j++;
      continue;
    } else if (j - 1 < 0) {
      direction = -1;
      i++;
      continue;
    }
    i++;
    j--;
  } else {
    if (j + 1 >= m) {
      direction = 1;
      i++;
      continue;
    } else if (i - 1 < 0) {
      direction = 1;
      j++;
      continue;
    }
    i--;
    j++;
  }
}

console.log(i, j);

```

### 蓄水池抽样算法

数据集长度为N，从中随机选取M(M <= N)个项，要求每个项被抽取的概率都为M/N。

```js

function ReservoirSampling(data, m) {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    // 此算法甚至可以事先不知道数据集的长度，只要边读取数据边执行核心逻辑即可

    // 前m个项直接放入result
    if (i < m) {
      result.push(data[i]);
      continue;
    }
    // 核心逻辑：对于第i项，以m/i的概率来决定是否将它加入result，若加入，则等概率随机将一个原result中的项替换为它
    const rand = Math.random() * i | 0;
    if (rand < m) {
      result[rand] = data[i];
    }
  }
  return result;
}

console.log(ReservoirSampling([1,2,3,4,5,6,7,8,9,10,11,12], 3));

```

    
