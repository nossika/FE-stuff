# 算法

## 经典排序

方法 | 平均 | 最慢 | 最快 | 空间
:- | :-: | :-: | :-: | :-:
快排 | NlogN | N2 | NlogN | 1
冒泡 | N2 | N2 | N | 1
插入 | N2 | N2 | N | 1

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
    
    // todo
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


### 二叉树遍历

              1
             / \
           2     3
          / \     \
         4   5     6
            / \
           7   8

  深度优先遍历:

  前序(根->左->右): 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 3 -> 6

  中序(左->根->右): 4 -> 2 -> 7 -> 5 -> 8 -> 1 -> 3 -> 6

  后序(左->右->根): 4 -> 7 -> 8 -> 5 -> 2 -> 6 -> 3 -> 1

  广度优先遍历:

  1 -> 2 3 -> 4 5 6 -> 7 8
  








