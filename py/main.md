# 一些用法

## threading

```py
import threading
import time

# 初始化 task，等待 1 秒后自动完成
def task(id: int):
    time.sleep(1)
    print('task done', id)

thread_list = []

start_time = time.time()

for i in range(3):
    t = threading.Thread(target=task, args=[i]) # 创建 task 线程并传递参数
    t.start() # 启动线程
    thread_list.append(t)

for t in thread_list:
    t.join() # 等待线程完成

end_time = time.time()

 # 线程并发，1 秒左右完成全部线程
print('time', end_time - start_time)
```

## debounce

```py
import threading
from typing import Callable, Optional

def debounce(wait: float):
    def decorator(fn: Callable):
        timer: Optional[threading.Timer] = None
        def debounced(*args, **kwargs): # py 的参数有 tuple(位置参数) & dict(关键字参数) 两种形式，* 匹配 tuple，** 匹配 dict
            nonlocal timer # 使得 debounced 内可以访问外部作用域的 timer
            def call_fn():
                fn(*args, **kwargs)
            if timer:
                timer.cancel() # 取消已有定时器线程
            timer = threading.Timer(wait, call_fn) # 创建一个 wait 后执行 call_fn 的定时器线程
            timer.start() # 启动定时器线程
        return debounced
    return decorator

@debounce(1)
def foo(num):
    print('foo', num)

for i in range(100):
    foo(i)
```