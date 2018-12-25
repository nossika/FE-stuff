# 算法

## 经典排序

### 快速排序

    // 普通快排 时间复杂度O(N*logN)，空间复杂度O(logN)

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
    
    // 原地快排 时间复杂度O(N*logN)，空间复杂度O(1)

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


## 多个有序数组合并

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


## 二叉树遍历

              1
             / \
           2     3
          / \     \
         4   5     6
            / \
           7   8

  深度优先遍历:

  前序(根->左->右): 1 2 4 5 7 8 3 6

  中序(左->根->右): 4 2 7 5 8 1 3 6

  后序(左->右->根): 4 7 8 5 2 6 3 1

  广度优先遍历:

  1 -> 2 3 -> 4 5 6 -> 7 8

## 背包问题

有n个有各自价值和重量的物品，以及一个固定容量的背包，可以自由选择物品来放入背包，求背包能达到的最大价值。

假设数据如下：

    // 物品列表: Array<[价值, 重量]>
    const items = [[1,1],[3,4],[2,3],[30,48],[21,36],[12,11],[10,12],[15,16],[6, 12],[8, 22]];

    // 背包容量
    const capacity = 39;


### 1. 求最大值

对于前i个物品而言（假设第i个物品的价值为v[i]，重量为w[i]），此时最大值等于不放入第i个物品时的最大值和放入第i个物品时的最大值两者中取大。可以如下公式表示：

`f(i, capacity) = max{f(i - 1, capacity), f(i - 1, capacity - w[i]) + v[i]}`


    function getVal1(i, capacity) {
      const [weight, value] = items[i];
      if (i === 0) {
        if (capacity < weight) return 0;
        return value;
      }
      return capacity >= weight ? Math.max(getVal1(i - 1, capacity), getVal1(i - 1, capacity - weight) + value) : getVal1(i - 1, capacity);
    }

    getVal1(items.length - 1, capacity); // 75

### 2. 求最大值及其方案

在算法1的基础上加入bag数组来记录当前解法用到的物品

    function getVal2(i, capacity, bag) {
      const [weight, value] = items[i];

      if (i === 0) {
        if (capacity < weight) return [0, bag];
        return [value, bag.concat(0)];
      }

      let [unputVal, unputBag] = getVal2(i - 1, capacity, bag);

      if (capacity >= weight) {
        let [putVal, putBag] = getVal2(i - 1, capacity - weight, bag);
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

    getVal2(items.length - 1, capacity, []); // [75, [0, 1, 4, 8, 9]]

### 3. 物品带数量时的最大值

基于算法1作拓展，此时物品i不再是放入或者不放入（放入0个或1个），而是可以放入k个，k是一个有限整数集合，满足`0 < k < limit`且`0 < k * w[i] < capacity`，则公式应该改为

`f(i, capacity) = max{f(i - 1, capacity - w[i] * k) + v[i] * k}`


    // 带数量的物品列表: Array<[价值, 重量, 数量]>
    const itemsWithLimit = [[1,1,3],[3,4,5],[2,3,1],[30,48,1],[21,36,2]];

    function getVal3(i, capacity) {
      const [weight, value, limit] = itemsWithLimit[i];
      if (i === 0) {
        return (capacity / weight | 0) * value;
      }
      const solutions = [];
      for (let k = 0; k * weight < capacity && k < limit; k++) {
        solutions.push(getVal3(i - 1, capacity - k * weight) + k * value);
      }
      return Math.max(...solutions);
    }

    getVal3(itemsWithLimit.length - 1, capacity); // 58








