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

## 寻找数字之和

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

### nums有序的情况

双指针解法，需要理清为何该解法不会漏过唯一解，时间复杂度O(n)，空间复杂度O(1)。

1、left和right都会不断往中间移动。

2、假设left已经移动到目标位置，但right还未移动到目标位置，此时因为数组有序，和一定大于target，之后的移动只会把right左移，不会动left。

3、假设right已经移动到目标位置，同理right不会再动。

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

## 求最小覆盖子串

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

## 求字符串最长不重复子串

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

### 滑动窗口解法

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

## 满足条件的最小速度

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

## 二叉树和链表

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

## 缓存淘汰算法

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

## 两节点的最小公共祖先

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

