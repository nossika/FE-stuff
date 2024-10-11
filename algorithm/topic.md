# 算法题

## 经典排序

### 快速排序

普通快排：

平均时间复杂度O(n*log<sup>n</sup>)，最坏O(n<sup>2</sup>)，空间复杂度O(log<sup>n</sup>)

此实现是稳定排序，多个相同元素排序后的相对位置不变。如果 benchmark 值随机取则为不稳定排序。

```js
const arr = [5,11,23,43,72,8,34,99,4,65,54];

function quickSort(arr) {
  arr = arr.slice();
  function sort(arr) {
    if (arr.length <= 1) return arr;
    const benchmark = arr.shift();
    const left = [];
    const right = [];
    arr.forEach(num => {
      if (num < benchmark) {
        left.push(num);
      } else {
        right.push(num);
      }
    });
    return [...sort(left), benchmark, ...sort(right)];
  }
  return sort(arr);
}

quickSort(arr);
```
    
原地快排：

平均时间复杂度O(n*log<sup>n</sup>)，空间复杂度O(1)，非稳定排序（挪动基准数时可能会把它挪到相等元素的后面）。

> 数据量大的时候适合用。取基准数前可以先取 3 个值，以中间大小的值作为基准数，防止基准数太小或太大导致时间复杂度劣化。

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

### 归并排序

时间复杂度O(n*log<sup>n</sup>)，空间复杂度O(n)，稳定排序。

```js
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  } 

  const mid = arr.length / 2 | 0;

  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // mergeSort 递归展开，递归深度 logn 层，每层进行 mergeArr 处理
  return mergeArr(mergeSort(left), mergeSort(right));
}

// 对两个有序数组合并，时间复杂度 n，空间复杂度 n
function mergeArr(left, right) {
  const result = [];

  while (left.length && right.length) {
    if (left[0] < right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  return result.concat(left).concat(right);
}
```

### 冒泡排序

时间复杂度O(n<sup>2</sup>)，空间复杂度O(1)，稳定排序（相等元素不交换）。

```js
function bubbleSort(arr) {
  // 总共进行 n 次循坏，每次找出剩余数组中的最大值
  for (let sorted = arr.length; sorted > 0; sorted--) {
    // 相邻元素两两对比，大的往后挪，每次循坏会把剩余数组最大值挪到尾部，需要对比 n 次。
    for (let i = 0; i < sorted; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
  }

  return arr;
}
```

### 插入排序

时间复杂度O(n<sup>2</sup>)，空间复杂度O(1)，稳定排序（后选择的插入到最后，相对位置不变）。

> 数据量小的时候很适合用，甚至优于O(n*log<sup>n</sup>)的算法，因为基础消耗小。

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

> 适合值为固定位数的数据，比如身份证号

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

### 堆排序

时间复杂度：构建堆需要O(n * log<sub>2</sub><sup>n</sup>)，调整堆需要O(n * log<sub>2</sub><sup>n</sup>)，总的复杂度O(n * log<sub>2</sub><sup>n</sup>)；空间复杂度O(1)。非稳定排序。

> 适合数据量大，数据流式输入的情况。比如经典的海量数据找 TOP K 的问题。



```js
function heapSort(arr) {
  // 构建初始堆，比如升序诉求就构建大顶堆
  makeHeap(arr);

  // 不断把堆顶元素（最大元素）和末尾元素交换，使得有序区增大，无序区减小，继续调整堆并交换，直至无序区为零。
  for (let sorted = arr.length - 1; sorted > 0; sorted--) {
    swap(0, sorted, arr);
    adjustHeapNode(0, sorted, arr);
  }

  return arr;
}

// 构建堆
function makeHeap(arr) {
  // 由最后一个非叶子节点开始，从右到左，从下到上，调整节点
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    adjustHeapNode(i, arr.length, arr);
  }
}

// 把目标节点挪到堆的合适位置
function adjustHeapNode(i, boundary, arr) {
  // 取得节点 i 的左右子节点序号，如果节点序号已经到达边界，则返回
  const left = i * 2 + 1;
  const right = left + 1;
  if (left >= boundary) return;

  // 目标节点和左右子节点中较大的节点比较，如果需要则交换位置，并继续递归调整目标节点，直到其位置合适
  const child = right < boundary && arr[left] < arr[right] ? right : left;

  if (arr[i] < arr[child]) {
    swap(i, child, arr);
    adjustHeapNode(child, boundary, arr);
  }
}

function swap(i, j, arr) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
```



### 桶排序

1、按序设置一定数量(k)的桶，将数组元素按大小落入对应桶

2、桶内各自排序

3、按序把桶内元素取出，成为有序数组

时间复杂度取决于排序算法，O(n * log<sub>2</sub><sup>n</sup>)算法下的平均复杂度为O(k * n * log<sub>2</sub><sup>n</sup><sup>/</sup><sup>k</sup>)，空间复杂度O(n+k)，稳定性也取决于排序算法。


## 动态规划

### 打家劫舍

你是一位专业小偷，计划偷窃沿街一组房屋，房屋有相连的报警器，如果相邻的房屋都遭到入侵，就会触发报警。

给定一组正数数组 nums 表示每间房屋中的可偷窃金额，求在不触发报警的前提下，能偷到的最大金额。

```js
var rob = function(nums) {
  // dp[i] 表示前 i 间屋子的最大可偷金额
  const dp = [nums[0]];

  for (let i = 0; i < nums.length; i++) {
    // dp[i] 的值由以下两者取大：
    // - 偷了第 i 间屋子的情况：(第 i 间屋子金额) + (前 i - 2 间屋子总金额)
    // - 不偷第 i 间屋子的情况：(前 i - 1 间屋子总金额)
    dp[i] = Math.max(
      nums[i] + (dp[i - 2] || 0),
      (dp[i - 1] || 0),
    );
  }

  // 最后一个 dp[i] 即为所求
  return dp[dp.length - 1];
};
```

时间复杂度 O(n)，空间复杂度 O(n)，空间复杂度可进一步优化为 O(1)，因为 dp[i] 只和 dp[i - 1] & dp[i - 2] 有关，可以不使用完整 dp 数组，只滚动记录 i - 1 和 i - 2 的值。

### 背包最大价值问题

有n个有各自价值和重量的物品，以及一个固定容量的背包，可以自由选择物品来放入背包，求背包能达到的最大价值。

假设数据如下：

```js
// 物品列表items: Array<[价值, 重量]>
const items = [[1,1],[3,4],[2,3],[30,48],[21,36],[12,11],[10,12],[15,16],[6, 12],[8, 22]];

// 背包容量capacity
const capacity = 39;
```


#### 1. 求最大值

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

#### 2. 求最大值及其方案

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

#### 3. 物品带数量时的最大值

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

### 硬币凑整问题

有i种面值不同的硬币，数量不限，需要用这i种硬币凑出刚好为n的数额

假设数据如下：

```js
// 硬币种类coins: Array<面值>
const coins = [1, 2, 5, 10, 20];

// 目标数额n
const n = 98;
```

#### 1. 求全部解法数量

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

#### 2. 求最少使用的硬币数

动态规划解法：

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

循环解法：

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


### 连续子数组的最大和

用 f(i) 表示以 i 下标为结尾的最大和，其状态转移方程为 `f(i)=max{f(i-1) + nums[i], nums[i]}`，遍历 n 次即可得出所有 f(i)，从所有 f(i) 中取最大值。

```js
function maxSubArray(nums) {
  // dp[i] 表示以第 i 项为结尾的连续子数组的最大和
  const dp = [nums[0]];

  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i])
  }
  
  return Math.max(...dp);
}
```

### 被 3 整除的最大和

给定一个数组 nums，求找出可被 3 整除的最大子元素和。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSumDivThree = function(nums) {
  // 用 dp[i][mod] 表示前 i 项被 3 除后余 mod 情况的最大和
  // 比如 dp[2][1] 表示前 2 项被 3 除后余数为 1 情况的最大和
  const dp = [
    [0, -Infinity, -Infinity], // 需要注意 dp[0][1]、dp[0][2] 默认为非法值，因为后续取 max，所以可以设为最小值表示非法
  ];
  
  dp[0][nums[0] % 3] = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const remains = [];
    const lastRemains = dp[i - 1];

    // dp[i] 和 dp[i - 1] 的关系如下，分别讨论 nums[i] 被 3 除后余 0、1、2 的情况：
    if (num % 3 === 0) {
      remains[0] = lastRemains[0] + num;
      remains[1] = lastRemains[1] + num;
      remains[2] = lastRemains[2] + num;
    }

    if (num % 3 === 1) {
      remains[0] = Math.max(lastRemains[0], lastRemains[2] + num);
      remains[1] = Math.max(lastRemains[1], lastRemains[0] + num);
      remains[2] = Math.max(lastRemains[2], lastRemains[1] + num);
    }

    if (num % 3 === 2) {
      remains[0] = Math.max(lastRemains[0], lastRemains[1] + num);
      remains[1] = Math.max(lastRemains[1], lastRemains[2] + num);
      remains[2] = Math.max(lastRemains[2], lastRemains[0] + num);
    }

    dp[i] = remains;
  }

  // dp 最后一项的 0 即为整个数组被 3 整除的最大和
  return dp[dp.length - 1][0];
};

console.log(maxSumDivThree([3,6,5,1,8]))
```

时间复杂度O(n)，空间复杂度可优化到O(1)，i 只和 i - 1 有关，可以只滚动保留最新两项。

拓展为被 n 整除的最大和：

给定一个数组 nums，求找出可被 n 整除的最大子元素和。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSumDivN = function(nums, mod = 3) {
  const firstRemains = new Array(mod).fill(-Infinity);
  firstRemains[0] = 0;
  firstRemains[nums[0] % mod] = nums[0];

  const dp = [
    firstRemains,
  ];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const remains = [];
    const lastRemains = dp[i - 1];

    // 根据 mod 为 3 的情况推导通项公式：
    // dp[i][remain] = max(dp[i - 1][remain], dp[i - 1][(mod + remain - (num % mod)) % mod] + num)
    for (let remain = 0; remain < mod; remain++) {
      remains[remain] = Math.max(lastRemains[remain], lastRemains[(mod + remain - (num % mod)) % mod] + num);
    }

    dp[i] = remains;
  }

  return dp[dp.length - 1][0];
};

console.log(maxSumDivN([3,6,5,1,8], 5))

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

## 寻找众数

给定一个数组nums，此数组中必定有一个元素的出现的次数大于数组长度的一半，找出这个元素。

### 普通解法

```js
var majorityElement = function(nums) {
  const map = {};

  for (const num of nums) {
    if (!map[num]) {
      map[num] = 1;
    } else {
      map[num] += 1;
    }

    if (map[num] >= (nums.length / 2)) {
      return num;
    } 
  }

  return target;
};
```

时间复杂度O(n)，空间复杂度O(n)。

### Boyer-Moore 投票算法

维护一个候选众数candidate，往后遍历，num等于candidate时count加1，否则减1。count归零时，遇到的第一个num作为candidate，继续往后遍历。遍历完nums后，最后的candidate即为所要的众数。

算法的正确性推导：真正众数在数组中数量一定大于一半，遍历过程中若count归零，说明直至此时candidate和非candidate的数量55开，不管candidate是不是真正的众数，都可将它们全部丢弃，数组剩余的部分依然还是满足“真正众数的数量大于一半”。此时重选candidate继续上面流程，最后没被放弃的candidate就是真正众数。

```js
var majorityElement = function(nums) {
  let count = 0;
  let candidate;

  for (const num of nums) {
    if (count === 0) {
      candidate = num;
    }
    if (num === candidate) {
      count += 1;
    } else {
      count -= 1;
    }
  }

  return candidate;
};
```

时间复杂度O(n)，空间复杂度O(1)。

### 随机取数

随机取一个数，验证这个数是否众数，验证时间O(n)，不需要额外空间。因为众数占1/2，随机取的情况下平均2次就可取到。

```js
var majorityElement = function(nums) {
  while (true) {
    const candidate = nums[Math.random() * nums.length | 0];

    let count = 0;
    for (const num of nums) {
      if (candidate === num) {
        count += 1;
      }

      if (count >= nums.length / 2) {
        return candidate;
      }
    }
  }
};
```

时间复杂度最坏O(无穷)，平均O(n)，空间复杂度O(1)。

### 拓展 - 寻找多个众数

比如有3个数，它们各自在数组中出现的概率超过1/4，即除此3个数以外的其他数在数组中总共不到1/4。寻找这3个数。

和前面投票算法思想类似，从数组中消去4个不同数字，不会影响这3个数占比大于1/4的局面。

做法：

1、开辟常量3的额外空间记录top3数字和对应次数。
2、遍历数组，如果当前数字是top3里重复的，对应次数加1；如果未重复且top3未满，则把此数字加入top3，次数初始化为1；如果未重复且top3已满，则把全部top3数字的次数减1（视为消去4个不同数字），如果降为0的则从top3移除。
3、遍历完数组后，最终留下的top3即为结果。

## 双指针

### 两数之和

给定一个数组nums，寻找两个和刚好为target的数，返回它们的下标。

hash表查找，时间复杂度O(n)，空间复杂度O(n)。

1、构造一个hash map，key为num，value为num的下标。

2、遍历nums，查找map中是否已存在target-num，若有，则返回结果；若无，则把num和其下标作为key、value存入map。

```js
function twoSum(nums, target) {
    const map = {};
    let result = null;

    for (let i = 0; i < nums.length; i++) {
        if (map[target - nums[i]] !== undefined) {
            result = [map[target - nums[i]], i];
            break;
        } else {
            map[nums[i]] = i;
        }
    }

    return result;
};

twoSum([2,5,9,6], 11); // [0, 2]
```

nums有序的情况：

双指针解法，需要理清为何该解法不会漏过唯一解，时间复杂度O(n)，空间复杂度O(1)。

1、left和right都会不断往中间移动。

2、假设left已经移动到目标位置，但right还未移动到目标位置，此时因为数组有序，和一定大于target，之后的移动只会把right左移，不会动left。仅当left未移动到目标位置时才会动。

3、同理right也是，当right已到目标位置时不会再动，仅当未到目标时才动。

4、继续查找，一定能找到解，或者得出无解。

```js
function twoSum(numbers, target) {
    let left = 0;
    let right = numbers.length - 1;
    let result = null;

    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) {
            result = [left + 1, right + 1];
            break;
        } else if (sum < target) {
            left += 1;
        } else if (sum > target) {
            right -= 1;
        }
    }

    return result;
};

twoSum([2,5,6,9], 14); // [1, 3]
```

### 三数之和

问题：给定一个数组nums，从数组寻找3个数，要求正好和为0，列出全部可能的解，并且解不重复。

解法：借助两数之和里，使数组有序，然后采用一重循环+双指针的方式。

时间复杂度：一次数组排序O(n * log<sub>2</sub><sup>n</sup>) + 一重循环O(n) * 双指针遍历O(n) = O(n<sup>2</sup>)；空间复杂度：一个新的排序数组O(n)。

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  const results = [];

  // 使数组有序，方便后面使用双指针方式
  nums.sort((a, b) => a < b ? -1 : 1);

  // 用i表示第一个数，left、right为第二、三个数，使用两数之和里双指针的方式移动
  for (let i = 0; i < nums.length - 2; i++) {
    // 如果第一个数和上一轮循环一样，直接跳过
    if (nums[i] === nums[i - 1]) continue;
    // 如果第一个数大于0，则不可能有等于0的解了
    if (nums[i] > 0) break;

    const target = 0 - nums[i];

    let left = i + 1;
    let right = nums.length - 1;

    // 双指针寻找第二、三个数
    while (left < right) {
      const sum = nums[left] + nums[right];

      if (sum === target) {
        results.push([nums[i], nums[left], nums[right]]);

        // 如果数字和之前重复，需要跳过
        do {
          left += 1;
        } while (nums[left] === nums[left - 1])

        do {
          right -= 1;
        } while (nums[right] === nums[right + 1])
      } else if (sum > target) {
        right -= 1;
      } else {
        left += 1;
      }
    }
  }

  return results;
};
```

### 多个数字之和

给定一个有序数组 nums，寻找和刚好为 target 的全部可能组合：

```js
const nums = [1, 3, 3, 3, 4, 5, 6];

const subsetSum = (nums, target) => {
  const result = [];

  const sum = (arr) => {
    return arr.reduce((sum, n) => sum + n, 0);
  };

  const travel = (nums, start, path) => {
    // 如果 cache 和已经大于等于 target，则剪枝，没必要继续遍历，因为后续结果已不可能满足条件
    if (sum(path) >= target) {
      if (sum(path) === target) {
        result.push(path);
      }

      return;
    }

    // 从给定位置开始遍历
    for (let i = start; i < nums.length; i++) {
      // 组装当前结果为 path，下标后移一位，进入下一层遍历
      travel(nums, i + 1, path.concat(nums[i]));
    }
  }

  // 启动遍历
  travel(nums, 0, []);

  return result;
};

console.log(subsetSum(nums, 9));
```

nums 中的元素不重复，但可被重复选择：

```js
const nums = [3, 4, 5, 6];

const subsetSum = (nums, target) => {
  const result = [];

  const sum = (arr) => {
    return arr.reduce((sum, n) => sum + n, 0);
  };

  const travel = (nums, start, path) => {
    // 如果 cache 和已经大于等于 target，则没必要继续遍历
    if (sum(path) >= target) {
      if (sum(path) === target) {
        result.push(path);
      }

      return;
    }

    // 从给定位置开始遍历
    for (let i = start; i < nums.length; i++) {
      // 组装当前结果为 path，下标不动（使当前元素可以重复被选择），进入下一层遍历
      travel(nums, i, path.concat(nums[i]));
    }
  }

  // 启动遍历
  travel(nums, 0, []);

  return result;
};

console.log(subsetSum(nums, 9));

```

### 移动 0

给定一个数字数组，将其中的 0 全部挪到数组末尾，但其他元素的相对位置保持不变，返回移动后的数组。

```js
var moveZeroes = function(nums) {
  let right = 0; // 连续 0 的左边界
  let left = 0; // 连续 0 的右边界
  // 左右边界的中间，是目前数组遇到的全部 0
  // 不断把右边界的遇到的第一个非 0 值换到左边届，并推进左右边界，直到触碰数组末尾
  while (right < nums.length) {
    // 将左右边界推进到第一个 0 值的位置
    while (nums[left] && nums[left] !== 0) {
      left++;
      right++;
    }
    // 推进右边界到一个非 0 值的位置
    while (nums[right] === 0) {
      right++;
    }
    // 此时 [left, right) 区间是连续的 0 
    if (right >= nums.length) {
      break;
    }
    // 交换右边界的非 0 和左边界的 0
    [nums[left], nums[right]] = [nums[right], nums[left]];
    // 继续推进左右边界
    left++;
    right++;
  }
};

console.log(moveZeroes[[0,1,0,3,12]]);
```

时间复杂度O(n)，空间复杂度O(1)

## 滑动窗口

### 求最小覆盖子串

给一个字符串s和一个目标字符串t，求s中包含全部t中字符（包括字符数量）的最小子串。

双指针滑动窗口法：

```js
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function (s, t) {
  // 构造一个 key 为字符的哈希表，value 表示该字符还欠缺多少个
  const needs = {};
  for (let i = 0; i < t.length; i++) {
    const char = t[i];
    if (!needs[char]) {
      needs[char] = 0;
    }

    needs[char] -= 1;
  }

  // 判断当下是否满足 t 所需
  function isInNeed() {
    for (let key in needs) {
      if (needs[key] < 0) {
        return true;
      }
    }
    return false;
  }

  function updateNeed(char, count) {
    if (char in needs) {
      needs[char] += count;
    }
  }

  // 用于记录全部的最小情况，最后再遍历取最小中的最小。
  const results = [];

  let left = 0;
  let right = 0;

  // 右指针不断向右，扩大窗口，直到窗口的字符满足t，然后开始把左指针不断右移，缩小窗口，直到刚好不满足t，此时的窗口作为一种最小情况记录，然后重复前面右指针右移的步骤。
  while (right < s.length) {
    const addChar = s[right];
    updateNeed(addChar, 1);

    while (!isInNeed()) {
      const removeChar = s[left];

      // 如果左指针的字符，在所需列表中刚好是 0，表示再往左移就会处于不够的状态了，此时作为一种最小情况记录下来
      if (needs[removeChar] === 0) {
        results.push(s.slice(left, right + 1));
      }

      updateNeed(removeChar, -1);
      left += 1;
    }

    right += 1;
  }

  if (!results.length) return '';

  return results.reduce((min, result) => {
    if (result.length < min.length) {
      return result;
    }

    return min;
  }, results[0]);
};
```


### 求刚好包含的子串

给一个字符串s2和一个目标字符串s1，求s2中是否存在刚好包含全部s1中字符（包括字符数量）的子串。

和“最小覆盖子串”在于这里必须刚好包含，不得有多余的字符。

```js
var checkInclusion = function (s1, s2) {
  // 维护一个 s1 字符计数器。
  // 在 s2 中使用滑动窗口遍历，使得滑动窗口中的字段刚好能全部消耗完 s1 字符计数器。
  // 如果 s2 存在这个满足条件的窗口，则认为 s2 包含 s1 的一个排列。

  // 构造初始 s1 字符计数器。
  const s1Chars = {};
  for (let i = 0; i < s1.length; i++) {
    const char = s1[i];
    if (!s1Chars[char]) {
      s1Chars[char] = 0;
    }
    s1Chars[char] += 1;
  }

  // 初始化滑动窗口的左右指针。
  let left = 0;
  let right = 0;

  // 初始化判断结果。
  let result = false;

  // 在 s2 中使用滑动窗口遍历：
  // 1、尝试使右指针右移，并把右指针字符从计数器中扣除。
  // 2、如果 1 失败，则把左指针字符交还给计数器，并将左指针右移。
  // 3、如果左右指针重叠，则左右指针同时右移，从新起点开始上述判断。
  while (true) {
    if (right >= s2.length) {
      break;
    }
    if (s1Chars[s2[right]]) {
      s1Chars[s2[right]] -= 1;
      right += 1;
      if (right - left >= s1.length) {
        result = true;
        break;
      }
    } else if (left < right) {
      s1Chars[s2[left]] += 1;
      left += 1;
    } else {
      left += 1;
      right += 1;
    }
  }

  return result;
};
```



### 求字符串不重复的最长子串

暴力计算：

1. 定义start、end两个指针，起始位置为0，初始化max为0
2. 将start、end指向起始位置，初始化缓存列表
3. end不断向后移动，并将指向的值存入缓存，直到end指向的字母已存在缓存中（说明出现了重复字符），计算end - start的值并与max比较，保留大者
4. 起始位置+1（即start+1），重复步骤2，直到 str.length - start > max 时（此时再继续下去也不会出现更大的max），停止循环，输出max

时间复杂度O(n<sup>2</sup>)，空间复杂度O(chars)，chars表示字符集空间大小。

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

滑动窗口解法:

上面的解法，左指针+1时，右指针也重置，重新计算不重复子串。事实上，不重复子串可以利用上一步的结果，左指针+1前，把左指针对应的字符从set清除，右指针不需要重置，此时左右指针内的子串依然是不重复子串，在这基础上继续计算即可。

左右指针之间的空间形成一个不断往右滑动的窗口，空间内的字符串就是不重复子串。对于整个字符串，左右指针只需要各遍历一次。

时间复杂度O(n)，空间复杂度O(chars)，chars表示字符集空间大小。

```js
var lengthOfLongestSubstring = function(s) {
  let left = 0;
  let right = 0;
  const chars = new Set();

  let max = 0;

  // 左指针为起点，不断往右平移，得出各次的最长不重复子串，左指针离尾部的距离小于max时即可停止，因为这时怎么计算都不会得到大于max的结果。
  while (left < s.length - max) {
    // 将右指针不断往右平移，直到出现重复字符就停止。
    while (s[right] && !chars.has(s[right])) {
      chars.add(s[right]);
      right += 1;
    }

    max = Math.max(max, right - left);

    // 左指针平移前，从set里去除左指针指向的字符。
    chars.delete(s[left]);
    left += 1;
  }

  return max;
};
```

### 长度最小的子数组

给定一个元素全部为正整数的数组 nums 以及一个正整数 target，求 nums 中满足和大于等于 target 的长度最小的子数组。

```js
var minSubArrayLen = function(target, nums) {
  let left = 0; // 子数组窗口左边界
  let right = 0; // 子数组窗口右边界
  let sum = 0; // 子数组当前总和
  let minLen = Infinity; // 最小长度

  // 当子数组右边界达到数组边界时停止
  while (right < nums.length) {

    // 不断尝试拓展右边界，直到 sum 刚好达到要求，或者右边界越界
    while (sum < target && nums[right]) {
      sum += nums[right];
      right++;
    }

    // 如果此时 sum 还未达到要求，直接结束
    if (sum < target) break;

    // 不断尝试缩短左边界，直到 sum 刚好不满足要求
    while (sum >= target) {
      sum -= nums[left];
      left++;
    }

    // 此时 sum 为刚好不满足要求的状态，左右边界距离 +1 则为刚好满足要求的长度，记录此刻子数组长度
    minLen = Math.min(minLen, right - left + 1);
  }

  return Number.isFinite(minLen) ? minLen : 0;
};

console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])); // 2
```

## 子串问题

### 求是否存在某子串

给定一个字符串s，和一个子串t，求s中是否存在完全匹配t的子串。

常规暴力解法：

```js
const s = 'BBC ABCDAB ABCDABCDABDE';
const t = 'ABCDABD'; 

function indexOf(s, t) {
  // 第一层查找：遍历 s 中的每个字符，尝试以其为开头来匹配 t
  for (let i = 0; i <= s.length - t.length; i++) {
    // 第二层查找：遍历 t，判断 s 与其对应位置的字符是否匹配
    for (let j = 0; j < t.length; j++) {
      // 如果匹配成功，则继续匹配 t 的下一个字符
      if (s[i + j] === t[j]) {
        // 如果已经匹配到 t 的最后一个字符，则说明 t 已经匹配成功
        if (j >= t.length - 1) {
          return i;
        }

        continue;
      } else {
        // 如果匹配失败，则退出当前 t 的遍历，继续进行 s 的遍历
        break;
      }
    }
  }

  return -1;
}

console.log(indexOf(s, t));
```

KMP算法：

简而言之，是对子串t提前做模式分析，得到一些子串模式的数据（Partial Match Table - 部份匹配表），后续在对主串s的查找中应用这些数据，以优化在主串查找过程中回溯的次数，来达到总体效率的提升。

```js
const s = 'BBC ABCDAB ABCDABCDABDE';
const t = 'ABCDABD'; 

function kmpIndexOf(s, t) {
  // 获取字符串 p 最长公共前后缀的长度
  function getPMTValue (p) {
    let max = 0;
    for (let i = 1; i < p.length; i++) {
      const prefix = p.slice(0, i);
      const surfix = p.slice(p.length - i, p.length);
      if (prefix === surfix) {
        max = i;
      }
    }

    return max;
  }

  // 构造部份匹配表（pmt），计算出 t 中每个字符位置对应的 pmt 值
  const pmt = [];
  for (let i = 0; i < t.length; i++) {
    pmt[i] = getPMTValue(t.slice(0, i + 1));
  }

  // 第一层查找：遍历 s 中的每个字符，尝试以其为开头来匹配 t
  for (let i = 0; i <= s.length - t.length; i++) {
    // 第二层查找：遍历 t，判断 s 与其对应位置的字符是否匹配
    for (let j = 0; j < t.length; j++) {
      if (s[i + j] === t[j]) {
        // 如果已经匹配到 t 的最后一个字符，则说明 t 已经匹配成功
        if (j >= t.length - 1) {
          return i;
        }

        continue;
      } else {
        // 匹配失败，则尝试回退到上一个 j（即 t 中已匹配成功的部份字符串）并查看 pmt 表对应的值
        const pmtValue = pmt[j - 1];
        // 若无值或为 0，说明已匹配成功的串中，没有可复用的串
        if (!pmtValue) {
          // 此时正常退出当前 t 的遍历，继续进行 s 的遍历
          break;
        }

        // 若 pmt 有值，说明已匹配成功的串中，有可复用的串
        // 对 s 的遍历位置 i：基于当前 j 的位置，往前回溯 pmt 个位置即可，而非回溯到下一个 i
        i = i + (j - pmtValue) - 1;
        // 对 t 的遍历位置 j：直接挪到 pmt 的位置，而非清 0 重新匹配
        j = pmtValue - 1;
        continue;
      }
    }
  }

  return -1;
}

console.log(kmpIndexOf(s, t));
```


### 求两个字符串的最长公共子串

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

### 求两个字符串的最长公共子序列

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

### 最长上升子序列

给定一个无序整数数组 nums ，找到其中最长严格递增子序列的长度。

动态规划：

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  // 构造 dp 缓存，dp[i] 表示以 nums[i] 为结尾的最长上升子序列长度。
  const dp = [];

  // 计算并保存 dp[i]
  function calc(i) {
    // 当数组只有一项时显然上升长度为 1。
    if (i === 0) {
      dp[i] = 1;
      return;
    }

    // 依次 0 <= j < i 范围内遍历 j：当 nums[i] > nums[j] 时，以 nums[j] 结尾的序列才可以拼上 nums[i] 成为更长的上升序列，此时序列长度为 dp[j] + 1，否则为 1。
    // 从上面遍历的长度结果中取最大值，即为 dp[i] 的结果。
    let maxLen = -Infinity;
    for (let j = 0; j < i; j++) {
      const len = nums[i] > nums[j] ? dp[j] + 1 : 1;

      if (len > maxLen) {
        maxLen = len;
      }
    }

    dp[i] = maxLen;
  }

  // 依次计算 dp[i]
  for (let i = 0; i < nums.length; i++) {
    calc(i);
  }

  // dp 中的最大值即为结果
  return Math.max(...dp);
};
```

时间复杂度 O(n<sup>2</sup>)，空间复杂度 O(n)。

贪心+二分解法：

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLISGreedy = function (nums) {
  // 构建 greedyLIS 缓存，其长度表示当前最长上升子序列的长度
  // 注意是“长度”而非“内容”对应最长上升子序列，其子元素并不代表真实的子序列，因为会随着迭代不断优化替换局部元素
  const greedyLIS = [];

  // 二分查找 greedyLIS 中第一个比 num 大的数的位置
  const findPlace = (num, start = 0, end = greedyLIS.length - 1, arr = greedyLIS) => {
    if (start > end) {
      throw new Error('range invalid');
    }
    
    if (start === end) {
      return start;
    }

    const mid = Math.ceil((start + end) / 2);

    if (greedyLIS[mid - 1] < num && greedyLIS[mid] >= num) {
      return mid;
    }

    if (greedyLIS[mid] >= num) {
      return findPlace(num, mid + 1, end, arr);
    } else {
      return findPlace(num, start, mid - 1, arr);
    }
  };

  // 遍历 nums
  nums.forEach(num => {
    // 如果 num 大于 greedyLIS 尾部，直接将其加入以得到更长的上升子序列
    if (!greedyLIS.length || num > greedyLIS[greedyLIS.length - 1]) {
      greedyLIS.push(num);
      return;
    }

    // 将 num 替换 greedyLIS 中第一个比它大的元素，以达成更优的局部序列，供后续使用
    // 比如 num 替换了 greedyLIS 中间的第 4 个元素
    // 则内部原本长度为 4 的子序列就优化：为 num 结尾的，比原来更优的，同样长度是 4 的子序列
    // 因为前面长度为 3 的子序列不变的情况下，结尾的 num 比原来更小，更易于后续拼接
    // 注意，经过了这种优化后的 greedyLIS 不再表示真正的上升子序列，仅表示其可能的长度
    greedyLIS[findPlace(num)] = num;
  });

  return greedyLIS.length;
}
```

时间复杂度 O(n * log<sup>n</sup>)，空间复杂度 O(n)。

## 回文问题

### 字符串的最大回文子串

暴力求解：

```js
const testStr = 'fwefwefweabbbffbbba33fef';

const longestPalindromeSubstr = (str) => {
  // 表示以数组下标 i 为中心（blank 表示以 i 后边的空隙为中心）的最长回文长度
  const longestPalindromeLength = (i, blank) => {
    let left = blank ? i : i - 1;
    let right = i + 1;

    let length = blank ? 0 : 1;

    while (str[left] && str[right] && (str[left] === str[right])) {
      length += 2;
      left -= 1;
      right += 1;
    }
    
    return length;
  };

  let max = 0;

  // 依次计算 str 所有可能的回文串长度
  for (let i = 0; i < str.length; i++) {
    const maxI = longestPalindromeLength(i, false);
    const maxIBlank = longestPalindromeLength(i, true);

    max = Math.max(max, maxI, maxIBlank);
  }

  return max;
}

console.log(longestPalindromeSubstr(testStr));
```

循环字符串 2n，计算回文 n，总复杂度O(n<sup>2</sup>)



Manacher 算法：

利用回文串的性质，实时维护一个“右边界”和其对应的“中心点”，遍历时可利用已有信息来快速确定初始值及左右节点，省去多余的计算。

```js
const testStr = 'fwefwefweabbbfffbbba33fef';

const longestPalindromeSubstr = (str) => {
  // 把原始字符串空隙填满 #，省去处理对称轴为空隙的情况。filledStr 的对称半径减 1 即为原始 str 的对称长度。
  const filledStr = `#${str.split('').join('#')}#`;
  // 数组下标 i，表示对称轴为 i 的对称半径
  const radiusCache = [];
  // 当前访问过的最大右边边界，其对应的回文串临时称为“边界回文串”
  let maxRight = 0;
  // “边界回文串”对应的对称轴
  let maxRightMid = 0;

  // 遍历 filledStr 的每项
  for (let i = 0; i < filledStr.length; i++) {
    // 初始对称半径，左右下标
    let radius = 1;
    let left = i - 1;
    let right = i + 1;

    // 如果 i 位于访问过的最大右边界内，则说明其处于“边界回文串”的对称轴的右臂。
    // 基于回文特性，可以直接以对称轴左臂上对应的值，作为其初始半径，并且左右访问点直接从边界开始。
    if (i < maxRight)  {
      radius = radiusCache[maxRightMid - (i - maxRightMid)] || 0;

      // 如果以 i 为对称轴的初始对称半径小于 i 离右边边界的距离，则无需继续计算直接返回
      // 否则继续计算，并尝试拓展边界
      if (radius < maxRight - i) {
        radiusCache[i] = radius;
        continue;
      }

      right = maxRight + 1;
      left = i - (maxRight - i) - 1;
    } else {
      // 如果 i 超出了访问过的最大右边界，则重置这个最大右边界，并继续计算
      maxRightMid = i;
      maxRight = right;
    }

    // 正常进行回文判断，如果成功拓展，则更新最大右边界以及其对应的对称轴（即更新“边界回文串”）
    while (filledStr[left] && filledStr[right] && filledStr[left] === filledStr[right]) {
      maxRightMid = i;
      maxRight = right;
      radius += 1;
      left -= 1;
      right += 1;
    }

    // 记录 i 对应的对称半径
    radiusCache[i] = radius;
  }

  console.log(radiusCache);

  // 找出最大对称半径，减 1 即为原始字符串的最大回文长度
  return Math.max(...radiusCache) - 1;
}

console.log(longestPalindromeSubstr(testStr));
```

虽然有两层循环，但实际上内层循环利用已知信息跳过了多余的比对，理论上字符串的每个位置只需访问 1 次。

时间复杂度O(n)，空间复杂度O(n)。


### 字符串的最大回文子序列

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

## 数字问题

### 大数相加

```js
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function(num1, num2) {
  // 翻转后都从个位开始
  const n1List = num1.split('').reverse();
  const n2List = num2.split('').reverse();

  // 结果数组，也从个位开始
  let resultList = [];
  // 进位
  let carry = 0;

  // 模拟加法过程，记录每一位相加的结果，大于 10 的结果需要进位，给下一轮处理
  for (let i = 0; i < n1List.length || i < n2List.length || carry; i++) {
    const n1 = n1List[i];
    const n2 = n2List[i];

    let sum = (parseInt(n1) || 0) + (parseInt(n2) || 0) + carry;

    if (sum >= 10) {
      sum -= 10;
      carry = 1;
    } else {
      carry = 0;
    }

    resultList[i] = String(sum);
  }

  // 翻转结果数据，使个位在末尾
  return resultList.reverse().join('');
};

console.log(
  addStrings('5551343412352345212342134', '551245123431451214512323451425')
);
```

### 大数相乘

```js
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function(num1, num2) {
  // 翻转后都从个位开始
  const n1List = num1.split('').reverse();
  const n2List = num2.split('').reverse();

  // 乘法的每行数据
  const rows = [];

  // 模拟乘法过程，num2 整体与 num1 每个数相乘，得到 num1 长度的行数据，记录这些行数据，最后相加得到最终结果
  for (let i = 0; i < n1List.length; i++) {
    // 遍历 num1 的每个数 n1 作为乘数
    const n1 = n1List[i];
    let carry = 0;
    // 根据当前 n1 的位数给结果补零
    let row = new Array(i).fill(0);

    // num2 逐个数与 n1 相乘，记录每一位的结果到行数据，carry 用于记录进位
    for (let j = 0; j < n2List.length || carry; j++) {
      const n2 = n2List[j];
      let sum = (parseInt(n1) || 0) * (parseInt(n2) || 0) + carry;

      carry = 0;
      while (sum >= 10) {
        sum -= 10;
        carry += 1;
      }

      row.push(sum);
    }
    
    // 格式化行数据并记录
    rows.push(row.reverse().join(''));
  }

  // 将乘法过程得到的所有行数据相加，得到最终结果
  return add(...rows);
};

// 大数相加单独实现，本题不关心
var add = (...nums) => {
  return nums.reduce((result, num) => result + BigInt(num), 0n).toString();
};

console.log(
  multiply('123', '789')
);
```

### 阿拉伯数字转中文数字

```ts

const numChars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const unitChars = ['', '十', '百', '千'];
const sectionChars = ['', '万', '亿', '万亿'];

// 以万为小节的中文翻译
function sectionStr(num: number): string {
  let int = Math.floor(num);

  if (int >= 10000) {
    return '';
  }

  let str = '';

  let unit = 0;
  let isContinuousZero = false;
  let isLastUnit = true;

  function nextLoop() {
    int = Math.floor(int / 10);
    unit += 1;
  }

  while (int) {
    const num = int % 10;

    if (isLastUnit && num === 0) {
      // 如果是末位的零，忽略，并且下一轮循环也要末位判断零
      nextLoop();
      continue;
    } else {
      isLastUnit = false;
    }

    if (num === 0) {
      // 如果是中间的零，且为首次出现，补零；如果是连续出现，则忽略
      if (!isContinuousZero) {
        isContinuousZero = true;
        str = '零' + str;
      }

      nextLoop();
      continue;
    } else {
      isContinuousZero = false;
    }

    str = numChars[num] + unitChars[unit] + str;

    nextLoop();
  }

  return str;
}

// 把阿拉伯数字翻译为中文数字
export function num2Str(num: number): string {
  if (num === 0) return '零';

  let int = Math.floor(num);

  let str = '';

  let section = 0;
  let isContinuousZero = false;
  let isLastUnit = true;

  function nextLoop() {
    int = Math.floor(int / 10000);
    section += 1;
  }

  while (int) {
    const sectionInt = int % 10000;

    if (isLastUnit && sectionInt === 0) {
      // 如果是末位的零，忽略，并且下一轮循环也要末位判断零
      nextLoop();
      continue;
    } else {
      isLastUnit = false;
    }

    if (sectionInt === 0) {
      // 如果是中间的零，且为首次出现，补零；如果是连续出现，则忽略
      if (!isContinuousZero) {
        isContinuousZero = true;
        str = '零' + str;
      }

      nextLoop();
      continue;
    } else {
      isContinuousZero = false;
    }

    let sectionChar = sectionChars[section];

    // 判断“万亿”后面是否已经有单位“亿”了，有的话只保留单位“万”，防止出现“一万亿一千亿”这种说法
    if (sectionChar === '万亿' && str.includes('亿')) {
      sectionChar = '万';
    }

    str = sectionStr(sectionInt) + sectionChar + str;

    // 不足 1000 的，补上前置零
    if (sectionInt < 1000) {
      isContinuousZero = true;
      str = '零' + str;
      nextLoop();
      continue;
    }

    nextLoop();
  }

  // 把最开头的零忽略
  str = str.replace(/^零/g, '');

  return str;
}

console.log(num2Str(12314000342));
```

### 中文数字转阿拉伯数字

```ts

type CharMeanings = Record<string, {
  value: number;
  unit?: boolean;
  section?: boolean;
}>;

const charMeanings: CharMeanings = {
  '零': { value: 0 },
  '一': { value: 1 },
  '二': { value: 2 },
  '三': { value: 3 },
  '四': { value: 4 },
  '五': { value: 5 },
  '六': { value: 6 },
  '七': { value: 7 },
  '八': { value: 8 },
  '九': { value: 9 },
  '十': { value: 10, unit: true },
  '百': { value: 100, unit: true },
  '千': { value: 1000, unit: true },
  '万': { value: 10000, unit: true, section: true },
  '亿': { value: 10000 * 10000, unit: true, section: true },
};

// 把中文数字翻译为阿拉伯数字
export function str2Num(str: string): number {
  let num = 0;
  let tempNum = 0;
  let sectionYi = 0;

  str.split('').forEach((char) => {
    const meaning = charMeanings[char];
    if (!meaning.unit) { // 处理普通数字，缓存到 tempNum
      tempNum = meaning.value;
    } else if (!meaning.section) { // 处理普通单位，把 tempNum 乘以单位加入 num
      tempNum *= meaning.value;
      num += tempNum;
      tempNum = 0;
    } else { // 处理节点单位，非零 tempNum 加到 num，并把 num 直接乘以节点单位
      num += tempNum;
      num *= meaning.value;
      tempNum = 0;
    }

    // 计算到“亿”时缓存当前结果，并清空 num，防止处理“亿”后面的“万”时把前面的“亿”也乘上
    if (char === '亿') {
      sectionYi = num;
      num = 0;
    }
  });

  num += tempNum;

  return sectionYi + num;
}

console.log(str2Num('一百二十三亿一千四百万零三百四十二'));
```

### 最大交换

给定一个非负整数，你至多可以交换一次数字中的任意两位。返回你能得到的最大值。

暴力循环：

```js

const maximumSwap = (num) => {
const nums = num.toString().split('');
const swap = (i, j, nums) => {
const copiedNums = nums.slice();
[copiedNums[i], copiedNums[j]] = [copiedNums[j], copiedNums[i]];
return +copiedNums.join('');
}

let max = num;

// 暴力尝试两两交换，记录过程中的最大值
for (let i = 0; i < nums.length; i++) {
for (let j = i + 1; j < nums.length; j++) {
max = Math.max(max, swap(i, j, nums));
}
}

return max;
};
```

复杂度O(n<sup>2</sup>)，n 为数字的位数。

单次遍历：

```js
const maximumSwap = (num) => {
const nums = num.toString().split('').map(n => +n).reverse(); // 将数字拆开并倒置，使低位数字在前
let maxIndex = 0; // 当前最大值的下标
let needSwap = []; // 当前需要交换的两个值的下标，下称交换组

// 让高位数字与比它低位的最大值交换（如果最大值同时出现在多个低位，则应取最低位的那个），并让这个交换尽可能发生在更高位
// 从低位开始往高位遍历，逐位记录当前的有效交换组，最后记录的交换组就是位数最高的交换
for (let i = 0; i < nums.length; i++) {
// 如果遇到的值比最大值大，则记录这个新最大值的下标
if (nums[i] > nums[maxIndex]) {
maxIndex = i;
}

// 如果遇到的值比最大值小，则可以把当前位和当前最大值交换来得到更大的值，先记录此时的交换组
if (nums[i] < nums[maxIndex]) {
needSwap = [maxIndex, i];
}
}

// 如果存在有效交换组，则进行交换
if (needSwap.length) {
[nums[needSwap[0]], nums[needSwap[1]]] = [nums[needSwap[1]], nums[needSwap[0]]];
}

// 倒置结果回原始顺序
return +nums.reverse().join('');
};
```

复杂度O(n)，n 为数字的位数。



## 特殊遍历

### 水杯倒水

给定 3 个容量分别为 a、b、c 的水杯。判断是否可以通过相互倾倒，来得到 t 容量的水。

你可以
1、将某一水杯倒满水
2、将某一水杯倒空
3、将某一水杯的水倒往另一水杯

```js
function check(a, b, c, t) {
  if ([a, b, c].every(n => n > t)) {
    return false;
  }

  return dfs(a, b, c, t, [0, 0, 0], {});
}

function dfs(a, b, c, t, state, visited) {
  const key = state.join();
  if (visited[key]) {
    return false;
  }

  // 用 visited 记录某个状态是否已判断过
  visited[key] = true;

  if (state.find(s => s === t)) {
    return true;
  }

  // 将 3 个瓶子中的某个倒满
  for (let i = 0; i < 3; i++) {
    newState = state.slice();
    newState[i] = [a, b, c][i];
    if (dfs(a, b, c, t, newState, visited)) {
      return true;
    }
  }

  // 将 3 个瓶子中的某个倒空
  for (let i = 0; i < 3; i++) {
    newState = state.slice();
    newState[i] = 0;
    if (dfs(a, b, c, t, newState, visited)) {
      return true;
    }
  }

  // 将 3 个瓶子中的某个倒往另一个
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === j) continue;
      newState = state.slice();
      let pour = [a, b, c][j] - newState[j];
      if (pour > newState[i]) {
        pour = newState[i];
      }

      newState[i] -= pour;
      newState[j] += pour;

      if (dfs(a, b, c, t, newState, visited)) {
        return true;
      }
    }
  }


  return false;
}


console.log(
  check(3, 4, 6, 5),
  check(2, 4, 6, 5),
);
```

时间复杂度O(a * b * c)，最坏情况需要遍历所有可能的组合。

如果改为需要返回达到目标状态的操作记录，则把 dfs 参数中的 state 从单个状态改为历史状态数组，每次拼接上当前状态后再给下个 dfs 使用。

### 约瑟夫环

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

### 顺时针遍历矩阵

```js
var spiralArray = function (array) {
  const h = array.length || 0; // 矩阵高
  const w = array[0]?.length || 0; // 矩阵宽
  let x = 0; // 当前 x 坐标
  let y = 0; // 当前 y 坐标
  let count = w * h; // 总数
  let round = 0; // 顺时针轮次
  const result = [];

  // 不断顺时针遍历，直到 result 全部装满才结束
  while (true) {
    // 左上角往右上角
    while (x < (w - round)) {
      result.push(array[y][x]);
      x++;
    }
    x--;
    y++;
    if (result.length >= count) break;

    // 右上角往右下角
    while (y < (h - round)) {
      result.push(array[y][x]);
      y++;
    }
    y--;
    x--;
    if (result.length >= count) break;

    // 右下角往左下角
    while (x >= round) {
      result.push(array[y][x]);
      x--;
    }
    x++;
    y--;
    if (result.length >= count) break;

    // 左下角往左上角
    while (y >= (1 + round)) {
      result.push(array[y][x]);
      y--;
    }
    y++;
    x++;
    if (result.length >= count) break;

    // 进入下一个轮次
    round++;
  }

  return result;
};

console.log(
  spiralArray([
    [1, 2, 3],
    [8, 9, 4],
    [7, 6, 5],
  ])
)
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

## 二分法

### 满足条件的最小速度

问题：

有几堆香蕉，用piles[i]表示第i堆香蕉的个数。用k（个/小时）来吃香蕉，要求

- 吃完一堆香蕉才能吃下一堆
- 如果吃完这堆香蕉，胃口还有剩余，也要等下个小时才能开始吃下一堆

求在h小时内吃完香蕉所需的最小速度。

解法：

某个数列的值按序递增，求值刚好满足条件的数，一般可用二分法。

比如此题中的吃香蕉速度为k，是否满足条件用f(k)表示，如果t是刚好满足条件的临界速度，则f(大于t)也为true，而f(小于t)为false，则可用二分法找到这个t。

时间复杂度：对max(piles)长度的数据判断log<sub>2</sub><sup>max(piles)</sup>次，每次判断需要进行 piles.length 长度的计算，总体复杂度为O(piles.length * log<sub>2</sub><sup>max(piles)</sup>)；空间复杂度：O(1)

```js
/**
 * @param {number[]} piles
 * @param {number} h
 * @return {number}
 */
var minEatingSpeed = function (piles, h) {
  // 检查该速度下将香蕉吃完的时间是否超过 h
  function checkSpeed(k) {
    let costTime = 0;
    for (const num of piles) {
      costTime += Math.ceil(num / k);
    }
    return costTime <= h;
  }

  // 二分法查找刚好满足要求的速度
  let left = 1;
  let right = Math.max(...piles); // 最大速度是 piles 里的最大值，此时需要 piles.length 的时间

  while (left < right) {
    // 注意 mid 应该向下取整，移动边界时，右边界只移到 mid 处，左边界则将 mid 舍去，保证最终值是刚好满足要求的
    const mid = Math.floor((left + right) / 2);
    if (checkSpeed(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
};
```

## 栈

### 高温天气

给定一组 temperatures 数组，每项元素表示当天的气温。

要求返回同样长度的数组，其中每项元素 x 表示后续第一个比当前气温高的日子是 x 天后，若后续没有比当前气温高的日子，则 x 为 0。

暴力解法：

```js
const temperatures = [35, 30, 31, 32, 30, 29, 34, 33, 30, 31];

const firstHigherTemperatures = (temperatures) => {
  // 独立计算查找每一天
  return temperatures.map((t, i) => {
    // 逐个往后查找，直到有一个更高温的天
    for (let j = i + 1; j < temperatures.length; j++) {
      if (temperatures[j] > t) {
        return j - i;
      }
    }

    return 0;
  });
};

console.log(firstHigherTemperatures(temperatures));
```

时间复杂度 O(n<sup>2</sup>)，空间复杂度 O(n)。

单调栈解法：

```js
const temperatures = [35, 30, 31, 32, 30, 29, 34, 33, 30, 31];

const firstHigherTemperatures = (temperatures) => {
  // 单调递增栈（从栈顶到栈底是递增趋势）
  const stack = [];
  const result = new Array(temperatures.length).fill(0);

  // 对每个元素尝试入栈
  temperatures.forEach((t, i) => {
    const current = [i, t];

    // 从栈顶元素逐个往下对比，将比当前元素小的都取出来，如果遇到比它大的就停止
    while (stack[0] && stack[0][1] < t) {
      const poped = stack.shift();
      // 元素被取出后，此时当前元素就是被取出元素遇到的第一个比它大的元素，计算两者下标的距离得到结果
      result[poped[0]] = i - poped[0];
    }

    // 当前元素入栈，此时栈依然是单调递增
    stack.unshift(current);
  });

  return result;
};


console.log(firstHigherTemperatures(temperatures));
```

原始数组长度为 n，有 n 次栈的插入，每次插入的对比次数是 1 + x（遇到比当前元素小的，需要取出的元素个数）。

其中 x 在全部插入过程的累计和不会超过 n，因为元素最多就 n 个，每个元素最多只会被取出 1 次，x 的平均值不大于 1。所以插入对比次数为常数级别。

时间复杂度 O(n)，空间复杂度 O(n)。

### 行星碰撞

给定一个整数数组 asteroids，表示在同一行的小行星。

对于数组中的每一个元素，其绝对值表示小行星的大小，正负表示小行星的移动方向（正表示向右移动，负表示向左移动）。每一颗小行星以相同的速度移动。

找出碰撞后剩下的所有小行星。碰撞规则：两个小行星相互碰撞，较小的小行星会爆炸。如果两颗小行星大小相同，则两颗小行星都会爆炸。两颗移动方向相同的小行星，永远不会发生碰撞。

```js
// 是否会碰撞，只有左边向右且右边向左时碰撞
const willCollision = (left, right) => {
  const leftToRight = left === Math.abs(left);
  const rightToLeft = -right === Math.abs(right);
  return leftToRight && rightToLeft;
};

// 碰撞后的结果，0 表示消失
const afterCollision = (a, b) => {
  if (Math.abs(a) === Math.abs(b)) {
    return 0;
  }

  return Math.abs(a) > Math.abs(b) ? a : b;
}

/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
var asteroidCollision = function(asteroids) {
  // 用栈保存结果，保持从左到右结构
  const stack = [];

  const addAsteroid = (asteroid) => {
    if (!asteroid) {
      return;
    }

    // 如果不会碰撞，直接入栈
    if (!stack.length || !willCollision(stack[stack.length - 1], asteroid)) {
      stack.push(asteroid);
      return;
    }

    // 计算碰撞结果，并递归调用 addAsteroid
    const result = afterCollision(stack.pop(), asteroid);
    addAsteroid(result);
  };
  
  // 逐个遍历 asteroids，将各个 asteroid 计算进结果
  for (const asteroid of asteroids) {
    addAsteroid(asteroid);
  }

  // 最后的栈就是结果
  return stack;
};
```

## 抽样

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

## 最小文本编辑距离

给定source字符串和target字符串，求source变换到target的最小编辑距离。

### 借助最小公共子序列

求出source和target的最小公共子序列。然后分别对source和target各遍历一次，source转化为公共子序列，再把公共子序列扩充成target，即为它们的最小转化路径。

### 在矩阵中求路径

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


## 链表


### 反转链表的指定部分

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


### k 个一组反转链表

将链表每 k 个节点为一组进行反转，返回反转后的链表。


```js
function reverseKGroup(head, k = 3) {
  const start = new ListNode();
  start.next = head;
  let prev = start; // 前一节点
  let cur = head; // 当前节点
  let count = 0; // 当前节点序号
  let groupStart = null; // group 头
  let lastGroupEnd = start; // 上个 group 尾

  while (cur) {
    const next = cur.next;
    const mod = count % k;

    if (mod === 0) {
      // 余数为 0，说明遇到了 group 头，记录这个头
      groupStart = cur;
    } else if (mod === k - 1 || !next) {
      // 余数为 k - 1 或者没有下一节点，说明遇到 group 尾，以此 group 为单元处理和上个 group 的拼接
      // 此节点也需要反转
      cur.next = prev;

      // 将上个 group 尾部接此节点（反转后已经是 group 头）
      lastGroupEnd.next = cur;
      // 将此 group 头（反转后已经是 group 尾）作为上个 group 尾
      lastGroupEnd = groupStart;
      // 并拼接下一节点
      groupStart.next = next;
    } else {
      // 余数为中间值，正常进行节点的反转
      cur.next = prev;
    }

    prev = cur;
    cur = next;
    count += 1;
  }

  return start.next;
}
```

### 合并两个有序链表

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
  // 构造一个最终 list 的头节点，便于返回结果
  const finalListHead = new ListNode(-Infinity, list1);
  let list1Node = finalListHead;
  let list2Node = list2;

  // 将 list2 的 node 逐个插入 list1 中的合适位置
  while (list2Node) {
    const nextList2Node = list2Node.next;

    // 找到 list1 中合适的位置，使得 list2Node 的值大于 list1Node 但不大于 list1Node.next
    while (list1Node.next && (list1Node.next.val < list2Node.val)) {
      list1Node = list1Node.next;
    }

    // 此时将 list2Node 插入 list1Node 后面
    const nextList1Node = list1Node.next;
    list1Node.next = list2Node;
    list2Node.next = nextList1Node;

    // 移动 list1Node、list2Node 到下个遍历位置，此时 list1Node 必定不大于 list2Node，可满足下次循环的前置条件
    list1Node = list2Node;
    list2Node = nextList2Node;
  }

  return finalListHead.next;
};
```

### 排序链表

归并排序

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var sortList = function(head) {
    if (!head) {
        return null;
    }
    const [left, right] = split(head);
    if (!right) {
        return left;
    }
    return merge(sortList(left), sortList(right));
};

// 链表一分为二
var split = function(head) {
  // 使用快慢指针找到中间节点
  let fast = head;
  let slow = head;
  while (fast?.next?.next) {
    fast = fast.next.next;
    slow = slow.next;
  }

  const right = slow.next;
  slow.next = null;

  return [head, right];
}

// 合并有序链表
var merge = function(head1, head2) {
  const head = new ListNode();
  head.val = -Infinity;
  head.next = head1;
  let insertNode = head2;
  let currentNode = head;
  // 将 head1 直接拼接到 head，并将 head2 中的节点逐个插入 head 的合适位置
  while (insertNode) {
    while (currentNode.next?.val < insertNode.val) {
        currentNode = currentNode.next;
    }
    const nextInsertNode = insertNode.next
    insertNode.next = currentNode.next;
    currentNode.next = insertNode;
    insertNode = nextInsertNode;
  }

  return head.next;
}
```

时间复杂度O(n * log<sup>n</sup>)，空间复杂度O(log<sup>n</sup>)，有递归展开的栈空间


## 二叉树

### 两节点的最小公共祖先

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
  let result = null;

  function dfs(node) {
    if (!node) return false;

    const isInLeft = dfs(node.left);
    const isInRight = dfs(node.right);
    
    // 满足最小公共祖先的两种情况：
    // 1. 左右子树各包含了p、q
    // 2. 节点自身为p、q且左或右子树包含p、q
    if (
        (isInLeft && isInRight)
        || ((node === p || node === q) && (isInLeft || isInRight))
    ) {
      result = node;
    }

    return isInLeft || isInRight || node === p || node === q;
  }

  dfs(root);

  return result;
};
```

### 距离接近的叶子节点对数

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

### 二叉树构建

给定一棵二叉树的前序遍历和中序遍历的数组（无重复节点），通过数组还原这棵二叉树。

```js
// 前序数组
const preorder = [1, 2, 3, 4, 5];
// 中序数组
const inorder = [2, 1, 4, 3, 5];

class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

const buildTree = (preorder, inorder) => {
  // 树的前序数组和中序数组长度必须一致，不一致就是数据有问题
  if (preorder.length !== inorder.length) {
    throw new Error('Invalid Tree');
  }

  if (!preorder.length) return null;

  // 前序数组的第一个一定是根节点
  const root = preorder[0];
  // 找到中序数组中根节点的位置
  const inorderRootIndex = inorder.findIndex(n => n === root);

  // 中序数组的左子树：根节点的左边数组
  const leftInorder = inorder.slice(0, inorderRootIndex);
  // 中序数组的右子树：根节点的右边数组
  const rightInorder = inorder.slice(inorderRootIndex + 1, inorder.length);

  // 前序数组的左子树：中序数组的根节点位置代表了左子树的长度，从剩余数组中按长度取出数组，即为左子树
  const leftPreorder = preorder.slice(1, 1 + inorderRootIndex);
  // 前序数组的右子树：上一步剩余的数组即为右子树
  const rightPreorder = preorder.slice(1 + inorderRootIndex, preorder.length);

  // 递归建立根节点及左右子树
  const rootNode = new Node(root);
  rootNode.left = buildTree(leftPreorder, leftInorder);
  rootNode.right = buildTree(rightPreorder, rightInorder);

  return rootNode;
};

console.log(buildTree(preorder, inorder));

```

### 二叉树的最大宽度

给你一棵二叉树的根节点 root ，返回树的 最大宽度 。

树的 最大宽度 是所有层中最大的 宽度 。

每一层的 宽度 被定义为该层最左和最右的非空节点（即，两个端点）之间的长度。将这个二叉树视作与满二叉树结构相同，两端点间会出现一些延伸到这一层的 null 节点，这些 null 节点也计入长度。

输入：root = [1,3,2,5,3,null,9]

输出：4

解释：最大宽度出现在树的第 3 层，宽度为 4 (5,3,null,9) 。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var widthOfBinaryTree = function (root) {
  let result = 0;

  // 计算这一层的宽度
  const getWidth = (nodes) => {
    let start;
    let end;

    nodes.forEach((_, i) => {
      if (start === undefined) {
        start = i;
      }

      end = i;
    });

    return end - start + 1;
  };

  // 广度优先逐层遍历
  const bfs = (nodes) => {
    result = Math.max(getWidth(nodes), result);

    const nextNodes = [];
    // 使用稀疏数组结构
    nodes.forEach((node, i) => {
      node.left && (nextNodes[i * 2] = node.left);
      node.right && (nextNodes[i * 2 + 1] = node.right);
    });

    if (!nextNodes.length) return;

    // 尾递归优化
    return bfs(nextNodes);
  };

  bfs([root]);

  return result;
};
```

## 二叉树和链表互转

### 二叉搜索树转有序双向链表

```js
/**
 * // Definition for a Node.
 * function Node(val,left,right) {
 *    this.val = val;
 *    this.left = left;
 *    this.right = right;
 * };
 */
/**
 * @param {Node} root
 * @return {Node}
 */
var treeToDoublyList = function(root) {
  if (!root) return null;

  // 中序遍历，对二叉搜索树即是从小到大遍历
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    handle(node);
    dfs(node.right);
  }

  let preNode;
  let firstNode;

  // 把当前节点与上一个节点建立连接，并缓存当前节点
  function handle(node) {
    if (preNode) {
      node.left = preNode;
      preNode.right = node;
    } else {
      firstNode = node;
    }

    preNode = node;
  }

  // 执行遍历
  dfs(root);

  // 首尾节点相连，构造出循环链表
  firstNode.left = preNode;
  preNode.right = firstNode;

  return firstNode;
};
```

时间复杂度O(n)，空间复杂度O(1)，未使用额外空间。

### 有序单向链表转平衡二叉搜索树

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val === undefined ? 0 : val)
 *     this.next = (next === undefined ? null : next)
 * }
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val === undefined ? 0 : val)
 *     this.left = (left === undefined ? null : left)
 *     this.right = (right === undefined ? null : right)
 * }
 */
/**
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function(head) {
  if (!head) return null;

  // 获取链表长度
  function getListLen(listHead) {
    let len = 0;
    let node = head;
    while (node) {
      len += 1;
      node = node.next;
    }
    return len;
  }

  // 用分治法构建树，不断二分链表，作为树的左右子树
  function buildTree(start, end) {
    if (end < start) {
      return null;
    }

    const mid = start + (((end - start) / 2) | 0);

    // 用中序遍历构建树，正好构建顺序就是链表顺序
    const root = new TreeNode(0, null, null);
    root.left = buildTree(start, mid - 1);
    root.val = popList();
    root.right = buildTree(mid + 1, end);

    return root;
  }

  // 从链表中按序取出节点
  let node = head;
  function popList() {
    const val = node.val;
    node = node.next;
    return val;
  }

  // 启动构建
  const listLen = getListLen(head);
  const root = buildTree(0, listLen - 1);

  return root;
};
```

时间复杂度：O(n)

空间复杂度：节点数O(n)，栈深度O(log<sup>n</sup>)

## 综合


### LRU（Least Recently Used）

实现一个固定容量的缓存，缓存达到上限时，淘汰最久未访问的数据。

以哈希表记录节点位置，可使查找操作的复杂度为O(1)；以双向链表记录节点访问顺序，最久未访问的节点放在链表末尾，最新的在最前，每次访问时更新链表头部节点，若缓存达到上限，同时删除尾部节点，插入和删除操作的复杂度为O(1)。

空间复杂度是O(capacity)，需要维护和capacity同容量的哈希表和双向链表。

```js
/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  // 记录剩余容量
  this.capacity = capacity;
  // 构造哈希表
  this.nodeMap = {};
  // 构造双向链表
  const head = new Node();
  const tail = new Node();
  head.next = tail;
  tail.prev = head;
  this.head = head;
  this.tail = tail;
};

var Node = function (key, value) {
  this.value = value;
  this.key = key;
  this.next = null;
  this.prev = null;
};

/** 
* @param {number} key
* @return {number}
*/
LRUCache.prototype.get = function (key) {
    if (!this.nodeMap[key]) {
      return -1;
    }

    this.update(key);

    return this.nodeMap[key].value;
};

/** 
* @param {number} key 
* @param {number} value
* @return {void}
*/
LRUCache.prototype.put = function (key, value) {
  if (!this.nodeMap[key]) {
    this.add(key, value);
  } else {
    this.update(key, value);
  }
};

// 节点插入到链表头部
LRUCache.prototype.insertNodeAfterHead = function (node) {
  node.next = this.head.next;
  node.next.prev = node;
  node.prev = this.head;
  node.prev.next = node;
};

// 向缓存中插入新值
LRUCache.prototype.add = function (key, value) {
  // 如果还有剩余容量，则只扣除容量；如果容量不够，则把尾部节点从链表和哈希表移除
  if (this.capacity > 0) {
    this.capacity -= 1;
  } else {
    const toDeletedNode = this.tail.prev;

    this.tail.prev = toDeletedNode.prev;
    this.tail.prev.next = this.tail;

    Reflect.deleteProperty(this.nodeMap, toDeletedNode.key);
  }

  const node = new Node(key, value);
  this.insertNodeAfterHead(node);
  this.nodeMap[key] = node;
};

// 在缓存中更新值和位置
LRUCache.prototype.update = function (key, value) {
  const node = this.nodeMap[key];

  if (value !== undefined) {
    node.value = value;
  }

  if (this.head.next === node) {
    return;
  }

  // 把节点移动到链表的最前
  const { next, prev } = node;
  next.prev = prev;
  prev.next = next;

  this.insertNodeAfterHead(node);
};

/**
* Your LRUCache object will be instantiated and called as such:
* var obj = new LRUCache(capacity)
* var param_1 = obj.get(key)
* obj.put(key,value)
*/
```

### LFU（Least Frequently Used）

实现一个固定容量的缓存，缓存达到上限时，淘汰最少访问的数据（如果有多个数据访问频次相同，淘汰最久未访问的）。

#### O(n)解法

可用和 LRU 类似的思路处理，使用一个哈希表和一个双向链表，只是将节点的数据加上频次，并且双向链表按访问频次排序，更新双向链表的节点时，需要按照频次向前比较并挪动节点（也就是这一步使得更新操作的复杂度为O(n)）。空间复杂度依然是O(capacity)。

```js
/**
 * @param {number} capacity
 */
var LFUCache = function (capacity) {
  // 记录剩余容量
  this.capacity = capacity;
  // 构造哈希表
  this.nodeMap = {};
  // 构造双向链表
  const head = new Node();
  const tail = new Node();
  head.next = tail;
  tail.prev = head;
  this.head = head;
  this.tail = tail;
};

var Node = function (key, value) {
  this.value = value;
  this.freq = 1;
  this.key = key;
  this.next = null;
  this.prev = null;
};

/** 
 * @param {number} key
 * @return {number}
 */
LFUCache.prototype.get = function (key) {
  if (!this.nodeMap[key]) {
    return -1;
  }

  this.update(key);

  return this.nodeMap[key].value;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LFUCache.prototype.put = function (key, value) {
  if (!this.nodeMap[key]) {
    this.add(key, value);
  } else {
    this.update(key, value);
  }
};

// 节点插入链表尾部
LFUCache.prototype.insertNodeBeforeTail = function (node) {
  node.prev = this.tail.prev;
  node.prev.next = node;
  node.next = this.tail;
  node.next.prev = node;
};

// 节点往链表头部移动一步
LFUCache.prototype.moveNodeForwardHead = function (node) {
  const prev = node.prev;
  const prevPrev = prev.prev;
  const next = node.next;

  prevPrev.next = node;
  node.prev = prevPrev;

  node.next = prev;
  prev.prev = node;

  prev.next = next;
  next.prev = prev;
};

// 调整节点到链表的合适位置
LFUCache.prototype.adjustNode = function (node) {
  while (node.prev && node.prev !== this.head && node.prev.freq <= node.freq) {
    this.moveNodeForwardHead(node);
  }
};

// 向缓存中间插入新值
LFUCache.prototype.add = function (key, value) {
  if (this.capacity > 0) {
    this.capacity -= 1;
  } else {
    const toDeletedNode = this.tail.prev;
    if (toDeletedNode === this.head) {
      return;
    }

    this.tail.prev = toDeletedNode.prev;

    this.tail.prev.next = this.tail;

    Reflect.deleteProperty(this.nodeMap, toDeletedNode.key);
  }

  const node = new Node(key, value);
  this.insertNodeBeforeTail(node);
  this.adjustNode(node);
  this.nodeMap[key] = node;
};

// 在缓存中更新值和位置
LFUCache.prototype.update = function (key, value) {
  const node = this.nodeMap[key];

  if (value !== undefined) {
    node.value = value;
  }

  node.freq += 1;

  this.adjustNode(node);
};

/**
 * Your LFUCache object will be instantiated and called as such:
 * var obj = new LFUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
```

#### O(1)解法

O(n)解法中复杂度主要来源是，双向链表的更新节点需要逐个向前比较和移动。可以把单个双向链表按频次拆分，每个频次下对应一条双向链表，并增加key为频次的哈希表来记录各链表头部。

这样每次更新节点时，根据节点哈希表找到节点位置，更新频次，再根据频次哈希表找到对应链表，把节点直接插入头部即可，更新复杂度为O(1)；同时需要记录当前最小频次，当超过缓存容量时，需要删除最小频次链表中的尾部节点，删除复杂度为O(1)。

空间复杂度是O(capacity)，需要维护一个 节点-位置 的哈希表，一个 频次-链表头 的哈希表，多条双向链表（总长度为capacity）。


## 海量数据下的算法

分块 + 各块计算 + 合并结果

### 数据排序

组织一个排序任务模型：数据分块 - 各块内部排序 - 多路合并排序

排序任务可以再拆分为多个排序子任务的多路合并结果，直到拆成合适的粒度。

### 统计最高频率的数据

组织一个统计任务模型：数据hash分块（保证同一key的数据在一个块） - 各块内部统计 - 多路头部结果合并

统计任务可以再拆分为多个统计子任务的多路合并结果，直到拆成合适的粒度。


### 判断重复数据

海量数据下如果判断数据是否重复，存储会有较大压力。

如果能接受一定的误判（将新数据当作重复数据），可以使用布隆过滤器（Bloom Filter）。

布隆过滤器主要由存储器（一个很长的二进制向量，可理解为一串01数组），以及一套映射函数（hash 函数）组成。任何数据经过这个映射函数，都会变成和其存储器规格对应的二进制向量。

运行时，逐个将数据丢入布隆过滤器，布隆过滤器会将得到这次二进制向量记下，并与存储器中的数据比较：

如果任何有一位向量在存储器中为 0，则说明这个数据一定是未重复的（如果之前存过这个数据，那么它向量的所有位置在存储器中都一定为 1）；反之，如果所有向量在存储器都为 1，则说明这个数据大概率是重复的（不一定真的存过这个数据，有可能它所有向量对应存储器的位置刚好都已经被别的数据占了）。

然后将本次的二进制向量存储到存储器，原本为 0 的位置变为 1，原本为 1 的位置不变。

布隆过滤器可以用固定的空间和较少的时间完成插入和查询操作。缺点是有误判，且删除数据麻烦。

### 找 TOP K

参考[堆排序](#堆排序)，数据可逐个输入，内存中仅维护 K 个数。





