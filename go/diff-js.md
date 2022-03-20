# 和JS对比

## 局部变量

在JS里写if时经常有如下代码：

```js
const sum = a + b;
if (sum > max) {
  handle(sum);
} 
```

或者：

```js
if (a + b > max) {
  handle(a + b);
}
```

前者污染外部作用域（在if外部作用域定义了一个sum，实际上这个sum可能只会在if中使用），后者有重复代码（a+b写了两次）。

go可以这么写来定义一个局部变量sum，该变量仅能在if中被访问：

```go
if sum := a + b; sum > max {
  handle(sum)
}
```

## 函数传参方式

go定义函数时可以指定参数是按引用还是按值（副本）传递
        
```go
func ByVal(arr [3]int, num int) {
  arr[1] = 0
  num = 0
  // 修改的只是arr、num副本
}

func ByRef(arr *[3]int, num *int) {
  (*arr)[1] = 0
  *num = 0
  // 可修改外部的arr、num值
}

func main() {
  arr := [3]int{1,2,3}
  num := 1
  ByVal(arr, num)
  fmt.Print(arr, num) // [1 2 3] 1
  ByRef(&arr, &num)
  fmt.Print(arr, num) // [1 0 3] 0
}
```

arr改成切片类型时，情况会有点变化：

```go
func ByVal(arr []int) {
  arr[1] = 0
}

func main() {
	arr := []int{1,2,3}
	ByVal(arr)
	fmt.Print(arr) // [1 0 3]
}
```

和上述例子的区别在于把`[3]int`改成了`[]int`，结果arr的值就改变了。

因为`[]int`是切片类型，传递到ByVal内部时，同样会创造一个切片副本，但这个arr副本其内部指向的底层数组和函数外部arr是同一个，所以函数内部对arr[1]的改动会直接影响底层数组，其本质还是按值传递的。

## 值比较

基本类型间比较 - 直接比较
struct间比较 - 对各个字段比较，如果有不可比较字段则编译报错

## 组合替代继承

GO中的继承不同于类继承、原型继承，甚至不像继承，更像是组合。

struct A需要复用已有struct B的字段时，直接把B写到A的struct声明里，还可以把C、D、E等更多struct一起组合到A里，使得A获得这些struct中的字段。

如果遇到对一系列对象遍历并调用其方法的场景，一般来说这些对象需要是同一个类，才有共同的类方法，但GO中没有类，用interface来模拟类的行为，这一系列对象不管它们各自的结构是怎样，只要它们都实现了interface中定义的方法，它们就可以当做是一个『类』，就可以放在循环里统一调用interface里的方法。

组合+接口相比继承的好处：子类不需要知晓父类的实现细节；可运行时动态修改接口背后的实现；更易于复杂的拓展。

## 错误处理

JS中的错误（throw）和异常都可以用try-catch来处理，并且有冒泡机制。

GO在设计上把错误（error）和异常（panic）分开对待。

panic也会冒泡，可以被上层的defer中的recover()捕获到，若没有被捕获，整个程序会退出。

```go
func crash() {
	arr := [4]int{1,2,3,4}
	for i := 0; i < 5; i++ {
		arr[i] = 0 // panic: arr[5] is out of range
	}
}

func main() {
	defer (func() {
		err := recover()
		if err != nil {
			fmt.Print(err) // runtime error: index out of range [4] with length 4
		}
	})()
	crash()
	fmt.Print("done") // never print
}
```

error则被作为函数返回值返回，强制开发者在第一现场处理（或者忽略），error是一个interface类型。

```go
type error interface {
    Error() string
}
```



## 协程

协程详见[协程](/js/thread.html#协程)

go在语言层面自己实现了协程goroutine，实现了并行和低资源占用。

goroutine间通过通道通信。

## 垃圾回收

标记-清除法（三色标记） + 写屏障

三色标记：

全部对象默认为白，从root开始，把引用的对象标记为灰，把灰对象的引用的非黑对象继续标记为灰，并把原来的灰对象标记为黑表示已遍历，重复这个过程，直到没有灰对象，剩下的所有白对象则表示没被引用到，销毁全部白对象。

写屏障：GC过程并不STW，程序仍在执行，仍可以修改对象间的引用。GC过程中监听对象修改，将受改动影响的对象直接标记为灰，继续GC。