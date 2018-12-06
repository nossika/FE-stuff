# 算法

## 经典排序

方法 | 平均 | 最快 | 最慢 | 空间
:- | :-: | :-: | :-: | :-:
快排 | NlogN | N2 | NlogN | 1
冒泡 | N2 | N2 | N | 1
插入 | N2 | N2 | N | 1

### 多个有序数组合并

    const arr1 = [2,5,7];
    const arr2 = [1,4,7,9];
    const arr3 = [0,3,4,8];

    function mergeOrderedArr(arrs) {
      const result = new Array(arrs.reduce((acc, arr) => acc + arr.length, 0)); // 排序结果数组
      const idxArr = new Array(arrs.length).fill(0); // idx数组，idx对应arrs的每个arr，表示各个arr当前遍历到的位置

      // 在每个arr剩余的第一项中进行对比，最小的取出放入result，并且该数组idx+1表示该项已被取出
      for (let i = 0; i < result.length; i++) {
        let min = Infinity;
        let minIdx = 0;

        for (let j = 0; j < arrs.length; j++) {
          let num = arrs[j][idxArr[j]];

          if (min > num) {
            min = num;
            minIdx = j;
          }
        }

        idxArr[minIdx] = idxArr[minIdx] + 1;
        result[i] = min;
      }

      return result;
    }

    mergeOrderedArr([arr1, arr2, arr3]); // [0, 1, 2, 3, 4, 4, 5, 7, 7, 8, 9]


