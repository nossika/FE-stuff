# 笔试题

## 经典函数实现

### String.prototype.indexOf

```js
String.prototype.indexOf = function(target, startIndex = 0) {
  if (target === '') return startIndex;
  const str = this;
  strLoop: for (let i = startIndex; i < str.length; i++) {
    if (str[i] === target[0]) {
      for (let j = 1; j < target.length; j++) {
        if (str[i + j] !== target[j]) {
          break strLoop;
        }
      }
      return i;
    }
  }
  return -1;
}
```

### Array.prototype.reduce

```js
Array.prototype.reduce = function(reducer, initial) {
  const arr = this;
  initial = initial === undefined ? arr.shift() : initial;
  let result = initial;
  for (let i = 0; i < arr.length; i++) {
    result = reducer(result, arr[i], i, arr);
  }
  return result;
}
```

### Function.prototype.bind

```js
Function.prototype.bind = function(scope) {
  const fn = this;
  const bindArgs = [].slice.call(arguments, 1);
  return function() {
    const args = [].slice.call(arguments);
    return fn.apply(scope, bindArgs.concat(args));
  };
}

// or

Function.prototype.bind = function(scope, ...bindArgs) {
  return (...args) => this.call(scope, ...bindArgs, ...args);
}
```

### Array.prototype.flat

```js
Array.prototype.flat = function(depth = 1) {
  const arr = this;
  const newArr = [];
  function flat(curArr, curDepth = 0) {
    curArr.forEach(item => {
      if (!(item instanceof Array) || (curDepth >= depth)) {
        newArr.push(item);
        return;
      }
      flat(item, curDepth + 1);
    });
  }
  flat(arr);
  return newArr;
}
```

## 数组去重

```js
function uniqueArr(arr) {
  return [...new Set(arr)];
}

function uniqueArr(arr) {
  return arr.filter((num, index) => arr.indexOf(num) === index);
}
```

## 异步编程

### 执行顺序判断

```js
console.log(1);

setTimeout(() => {
  Promise.resolve().then(() => {
    console.log(2);
  });
  console.log(3);
}, 0);

new Promise((resolve) => {
  for (let i = 0; i <= 1000; i++) {
    if (i === 1000) {
      resolve();
    }
  }
  console.log(4);
}).then(() => {
  console.log(5);
});

console.log(6);

// 1 4 6 5 3 2

// 第一轮事件循环：[宏任务] 1 4 6 [微任务] 5

// 第二轮事件循环：[宏任务] 3 [微任务] 2
```

### Promise 超时

```js
// 超时实现
const timeLimit = (fn, timeout) => {
  return async (...args) => {
    return Promise.race([
      fn(...args),
      new Promise((_, reject) => {
        setTimeout(reject, timeout, 'Time Limit Exceeded');
      }),
    ]);
  };
};

// 测试用例
(async () => {
  const testFn = async (value, delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value);
      }, delay);
    });
  };

  const limitedFn = timeLimit(testFn, 500);

  const a = await limitedFn('in limit', 100);
  console.log(a);
  const b = await limitedFn('exceed limit', 1000);
  console.log(b);
})();
```

### Promise 重试

```js

// retry 实现
Promise.retry = (fn, times = 0) => {
  return new Promise(async (resolve, reject)=> {
    let remainTimes = times;

    const tryFn = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        if (remainTimes) {
          remainTimes -= 1;
          return tryFn();
        }
        reject(error);
      }
    };

    return tryFn();
  });
};


// 测试用例
(async () => {
  const fn = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const value = Math.random();
        if (value > 0.5) {
          resolve(value);
        } else {
          reject(value);
        }
      }, Math.random() * 1000);
    })
  };

  const a = await Promise.retry(fn, 5);
  console.log(a);
})();

```

### 等待异步操作

```js
// 假设你的本地机器不支持小数的加减乘除（但整数支持），需要借用远程 api 来实现。
// 现需要实现本地任意数字的加法，请补全 add 函数
// 加分项：考虑缓存、并发


// 模拟远程 api 调用
function decimalAdd(a, b) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b);
    }, 100);
  });
}

// 测试代码
async function test() {
  console.log(
    await add(1.1, 2.2),
    await add(1.1, 2.2, 5, 7, 100, 100.1),
  );
}

test();

// @todo: 本地加法实现
// async function add(...nums) {
  
// }

// 未考虑缓存清理
const cache = {};
async function proxyDecimalAdd (a, b) {
  const key = `${a},${b}`;
  if (cache[key] === undefined) {
    cache[key] = await decimalAdd(a, b);
  }

  return cache[key];
}

// 本地加法实现
async function add(...nums) {
  let tempNums = [...nums];
  
  while (tempNums.length > 1) {
    // 两两分组并发
    const pairs = [];
    while (tempNums.length > 1) {
      pairs.push([
        tempNums.shift(),
        tempNums.shift(),
      ]);
    } 

    const nums = await Promise.all(pairs.map(pair => proxyDecimalAdd(pair[0], pair[1])));
    tempNums.push(...nums);
  }

  return tempNums[0];
}
```

### 并发控制

```js
/**
 * 给定一个异步的 request 方法，要求将其包装成可并发调用的 batchRequest 方法，并可控制并发数
 */

const https = require('https');

// 提供的 request 方法
const request = async (url) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    
    });

    req.on('error', (err) => reject(err));
  });
};

const batchRequest = async (urls, concurrent = 1) => {
  return new Promise((resolve => {
    let currentConcurrent = 0;
    const results = [];
    const remainTasks = urls.map((url, i) => {
      return {
        url,
        i,
      };
    });

    const doRequest = async (url, callback) => {
      const result = await request(url)
        .then(res => {
          return {
            content: res,
            error: '',
          }
        })
        .catch((error) => {
          return {
            content: '',
            error: String(error),
          }
        });
    
      callback(result);
    };
  
    const checkAndExecTasks = () => {
      // 当结果数量等于输入时，认为整体任务结束，根据执行前的任务序号重新排序后返回
      if (results.length >= urls.length) {
        const resps = results.sort((a, b) => a.i < b.i ? -1 : 1).map(r => r.result);
        resolve(resps);
      }

      // 仅当并发数有空闲，且队列有剩余任务时，取一个任务出来执行
      while (currentConcurrent < concurrent && remainTasks.length) {
        const task = remainTasks.shift();
        currentConcurrent += 1;
        doRequest(task.url, (result) => {
          currentConcurrent -= 1;
          results.push({
            i: task.i,
            result,
          });

          // 每个任务完成后，重新检查并执行新任务
          checkAndExecTasks();
        });
      }
    };

    checkAndExecTasks();
  }));
};

const test = async () => {
  const resps = await batchRequest([
    'https://nossika.com',
    'https://www.baidu.com',
    'https://www.taobao.com',
    'https://www.bytedance.com',
    'https://nossika2.com',
  ], 2);

  console.log(resps);
};

test();
```

