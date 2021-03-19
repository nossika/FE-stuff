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

#### 动态规划解法

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

#### 循环解法

```js
const coinsMinSolution2 = function(coins, n) {
  if (n === 0) return 0;

  // 缓存，用dp[i]表示凑成面值i最少需要的硬币数
  const dp = [];

  // 初始化dp，目标面值刚好等于硬币面值时，显然只需要1个
  for (let i = 0; i < coins.length; i++) {
    dp[coins[i]] = 1;
  }

  for (let i = 1; i <= n; i++) {
    // 如果dp已经有值，跳过
    if (dp[i]) {
      continue;
    }

    let min = Infinity;

    // 目标面值i的最小凑法：
    // 1、列出每个可能的凑法：对每个coin计算dp[i-coin]+1的值
    // 2、从1的结果中选出最小值
    for (let j = 0; j < coins.length; j++) {
      const cur = dp[i - coins[j]] + 1;
      if (cur && (cur < min)) {
        min = cur;
      }
    }

    dp[i] = min;
  }

  return dp[n];
};

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

## 求两个字符串的最长公共子串

假设两个字符串定义为`s1`，`s2`，`s1[i]`表示`s1`的第i个字符，`s2[j]`表示`s2`的第j个字符。

核心思路：

1. 用一个二维数组`map[i][j]`来表示公共子串以`s1[i]`，`s2[j]`结尾时的最大值。则可以推导出`map[i][j]`与`map[i-1][j-1]`的关系为：当`s[i] === s[j]`时，`map[i][j]`等于`map[i - 1][j - 1]`的值加`s[i]`，否则`map[i][j]`等于空。

2. 计算出这个map的所有结果，遍历map找出其中最大的值即为最长公共子串。

```js
function longestCommonSubstring(s1, s2) {
  // endWith返回公共子串以s1[i]和s2[j]为结尾时的值
  function endWith(i, j) {
    if (i < 0 || j < 0) {
      return { max: 0, str: '' };
    }

    if (map[i][j]) {
      return map[i][j];
    }

    let max = 0;
    let str = '';

    if (s1[i] === s2[j]) {
      max = endWith(i - 1, j - 1).max + 1;
      str = endWith(i - 1, j - 1).str + s1[i];
    }

    map[i][j] = { max, str };

    return map[i][j];
  }

  const map = [];

  let max = 0;
  let str = '';

  for (let i = 0; i < s1.length; i++) {
    map[i] = [];

    for (let j = 0; j < s2.length; j++) {
      map[i][j] = endWith(i, j);
      
      // 遍历map，找出最大值作为最后结果
      if (map[i][j].max > max) {
        max = map[i][j].max;
        str = map[i][j].str;
      }
    }
  }

  return { max, str };
}

const s1 = "basdasdb";
const s2 = "dasasdasdg";

const res = longestCommonSubstring(s1, s2);

console.log(res);
```

## 求两个字符串的最长公共子序列

公共子序列和公共子串的区别是，公共子序列在原字符串中允许被隔开，只要顺序一致即可，而公共子串必须每个字符前后相连。

假设两个字符串定义为`s1`，`s2`，`s1[i]`表示`s1`的第i个字符，`s2[j]`表示`s2`的第j个字符。

核心思路：

1. 用一个二维数组`map[i][j]`来表示以`s1`的前i个字符和`s2`的前j个字符为母字符串时的最长公共子序列。则可以推导出`map[i][j]`的公式为：当`s1[i] === s2[j]`时，`map[i][j]`等于`map[i - 1][j - 1]`加上`s[i]`，否则`map[i][j]`等于`map[i - 1][j]`和`map[i][j - 1]`两者中的较大值。

2. 递增`i`和`j`来逐个计算map，直到`i`等于`s1`长度，`j`等于`s2`长度，此时`map[i][j]`即为所求结果。


```js
function longestCommonSubsequence(s1, s2) {
  if (!s1.length || !s2.length) {
    return { max: 0, seq: '' };
  }

  // maxIn返回以s1的前i个字符和s2的前j个字符为母字符串时的最长公共子序列
  function maxIn(i, j) {
    if (i <= 0 || j <= 0) {
      return { max: 0, seq: '' };
    }

    if (map[i][j]) {
      return map[i][j];
    }

    let max = 0;
    let seq = '';

    if (s1[i] === s2[j]) {
      const res = maxIn(i - 1, j - 1);
      max = res.max + 1;
      seq = res.seq + s1[i];
    } else {
      const res1 = maxIn(i - 1, j);
      const res2 = maxIn(i, j - 1);

      max = Math.max(res1.max, res2.max);
      seq = res1.max >= res2.max ? res1.seq : res2.seq;
    }

    map[i][j] = { max, seq };

    return map[i][j];
  }

  const map = [];

  for (let i = 0; i < s1.length; i++) {
    map[i] = [];

    for (let j = 0; j < s2.length; j++) {
      map[i][j] = maxIn(i, j);
    }
  }

  return map[s1.length - 1][s2.length - 1];
}

const s1 = "basdasdb";
const s2 = "dasasrdasdg";

const res = longestCommonSubsequence(s1, s2);

console.log(res);
```
## 字符串的最大回文子序列

1、以dp[i][j]表示i到j的回文子序列长度

2、dp[i][j]的状态转移公式为：

```
if (s[i] === s[j]) {
  dp[i][j] = dp[i + 1][j - 1] + 2;
} else {
  dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
}
```

3、易知i === j时，即单个字符的回文长度为1，i > j时为0，i或者j越界也为0

4、dp[0][s.length - 1]即为结果

完整解法：

```js
var longestPalindromeSubseq = function(s) {
  const dp = [];

  function getIJ(i, j) {
    if (i < 0 || j >= s.length) {
      return 0;
    }

    if (!dp[i]) {
      dp[i] = [];
    }

    if (dp[i][j] !== undefined) {
      return dp[i][j];
    }

    if (i === j) {
      // 单个字符的回文长度为1
      dp[i][j] = 1;
      return 1;
    }

    if (i > j) {
      return 0;
    }

    if (s[i] === s[j]) {
      dp[i][j] = getIJ(i + 1, j - 1) + 2;
    } else {
      dp[i][j] = Math.max(getIJ(i + 1, j), getIJ(i, j - 1));
    }

    return dp[i][j];
  }

  return getIJ(0, s.length - 1);
};

console.log(longestPalindromeSubseq('aaazgergaa'));
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

## 矩阵以对角线遍历

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

## 蓄水池抽样算法

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

## 最小文本编辑距离

给定source字符串和target字符串，求source变换到target的最小编辑距离。

```js


// 把s各个字符展开为横轴，t各个字符展开为纵轴构建二维平面图，(x,y)表示图上的点，从(0,0)出发。
// 每次移动有3个选择：1、(x,y)移动到(x+1,y)表示删除s[x]，消耗一步；2、(x,y)移动到(x,y+1)表示新增t[y]，消耗一步；3、(x,y)移动到(x+1,y+1)表示不变，不消耗步数，但仅当满足s[x] === t[y]时能选择此项。
// 当点走到(s.length,t.length)时，所经过的路径即为s到t的变换规则，步数越少的路径越优。
function diff(s, t) {
  const sLen = s.length;
  const tLen = t.length;

  // key为当前所经过的路径，value为当前坐标点，不断按上述移动规则去循环改写这个map，直到有value等于终点坐标时，此时其key值就是最优路径。
  const map = {
    '': [0,0],
  };

  // 以BFS求最短步数对应的路径
  function walk(path) {
    const [x, y] = map[path];

    // 出现第一个走到底的path即为最优path，直接return结果
    if (x === sLen && y === tLen) {
      return path;
    }

    const sChar = s[x];
    const tChar = t[y];

    // 路径1、删除sChar
    if (x + 1 <= sLen) {
      map[`${path}.-${sChar}`] = [x + 1, y];
    } 

    // 路径2、新增tChar
    if (y + 1 <= tLen) {
      map[`${path}.+${tChar}`] = [x, y + 1];
    }

    // 路径3、sChar不变
    if (sChar === tChar) {
      map[`${path}.${sChar}`] = [x + 1, y + 1];
      // 此行为不消耗步数，需要对该path补充执行一次walk
      walk(`${path}.${sChar}`);
    }

    // 已经生成了2(或3)条新path，删除原path，等待下轮循环
    Reflect.deleteProperty(map, path);
    return '';
  }

  while (true) {
    for (const path in map) {
      const finded = walk(path);
      if (finded) {
        const result = finded.replace(/^\./, '').split('.').map(str => {
          if (str.length === 2 && str.startsWith('-')) {
            return {
              type: '-',
              char: str.replace(/^-/, ''),
            }
          } else if (str.length === 2 && str.startsWith('+')) {
            return {
              type: '+',
              char: str.replace(/^\+/, ''),
            }
          } else {
            return {
              type: '',
              char: str,
            };
          }
        });
        return result;
      }
    }
  }

}

const s = 'aasdaasdssdas';
const t = 'vwedaswsdasdws';

const result = diff(s,t);

let consoleStr = '';
const consoleColors = [];

result.forEach(item => {
  consoleStr += `%c${item.char}`;
  consoleColors.push(`color: ${
    {'+': 'green', '-': 'red'}[item.type] || 'gray'
  }`);
});

console.log(consoleStr, ...consoleColors);
```
    
todo：Myers差分算法

## 反转链表的指定部分

给定一组链表，要求把链表m到n的部分反转，返回新链表，只扫描一趟。

```js
const reverseBetween = function(head, m, n) {
  let startNode = head; // 起始节点（反转的第一个节点）
  let beforeStartNode = null; // 起始节点的前一个节点

  // 找到起始节点
  for (let i = 1; i < m; i++) {
    beforeStartNode = startNode;
    startNode = startNode.next;
  }

  let prev = beforeStartNode; 
  let cur = startNode;
  let next = startNode.next;

  let endNode = startNode; // 结束节点（反转的最后一个节点）
  
  // 对m到n间的节点进行反转
  for (let i = m; i < n; i++) {
    prev = cur;
    cur = next;
    next = next.next;
    cur.next = prev;
    endNode = cur;
  }

  // 起始节点的前个节点，接入反转后链表的头部（endNode）
  beforeStartNode && (beforeStartNode.next = endNode);

  // 反转链表的尾部（startNode）接入m之后的节点
  startNode.next = next;

  // 如果m为1，则新链表的起点就是反转链表的头部
  return m === 1 ? endNode : head;
};
```

## 距离接近的叶子节点对数

给定一个root节点和distance，求root下满足两者距离小于等于distance的所有叶子节点对。

```js
var countPairs = function(root, distance) {
  let count = 0;

  // dfs(node: TreeNode): number[] 返回以node为根节点的全部叶子节点和node之间的距离
  var dfs = function(node) {
    // 如果node是空节点，就返回空数组
    if (!node) return [];

    // 如果node自身是叶子节点，返回[0]，因为自己是一个叶子节点，自己到自己的距离是0
    if (!node.left && !node.right) {
      return [0];
    }

    // node的全部左子树叶子节点距离，到node的距离左子树的结果+1
    const lLens = dfs(node.left).map(l => l + 1);

    // node右子树同上
    const rLens = dfs(node.right).map(l => l + 1);

    // 左右两两匹配，小于distance的一对计入count
    for (let i = 0; i < lLens.length; i++) {
      for (let j = 0; j < rLens.length; j++) {
        if (lLens[i] + rLens[j] <= distance) {
          count++;
        }
      }
    }

    // node左右子树的结果合并，作为此node的结果
    const lens = lLens.concat(rLens);

    return lens;
  }

  dfs(root);

  return count;
};
```



## 海量数据下的算法

分块 + 各块计算 + 合并结果

### 数据排序

组织一个排序任务模型：数据分块 - 各块内部排序 - 多路合并排序

排序任务可以再拆分为多个排序子任务的多路合并结果，直到拆成合适的粒度。

### 统计最高频率的数据

组织一个统计任务模型：数据hash分块（保证同一key的数据在一个块） - 各块内部统计 - 多路头部结果合并

统计任务可以再拆分为多个统计子任务的多路合并结果，直到拆成合适的粒度。

