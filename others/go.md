# Golang

## 和JS对比

### 局部变量

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

### 函数传参方式

go定义函数时可以指定参数是按引用还是按值（副本）传递
        
```go
func ByVal(arr [3]int, num int) {
  arr[1] = 0
  num = 0
  // 修改的只是arr、num副本
}

func ByRef(arr *[3]int, num *int) {
  arr[1] = 0
  *num = 0
  // 可修改外部的arr、num值
}

arr := [3]int{1,2,3}
num := 1
ByVal(arr, num)
// arr: [1 2 3], num: 1
ByRef(&arr, &num)
// arr: [1 0 3], num: 0
```

### 类和继承

GO中的继承不同于类继承、原型继承，甚至不像继承，更像是组合。

struct A需要复用已有struct B的字段时，直接把B写到A的struct声明里，还可以把C、D、E等更多struct一起组合到A里，使得A获得这些struct中的字段。

如果遇到对一系列对象遍历并调用其方法的场景，一般来说这些对象需要是同一个类，才有共同的类方法，但GO中没有类，用interface来模拟类的行为，这一系列对象不管它们各自的结构是怎样，只要它们都实现了interface中定义的方法，它们就可以当做是一个『类』，就可以放在循环里统一调用interface里的方法。

### 错误处理

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



### 协程

协程详见[协程](/js/thread.html#协程)

go在语言层面自己实现了协程goroutine，实现了并行和低资源占用。

goroutine间通过通道通信。

### 垃圾回收

标记-清除法（三色标记） + 写屏障

三色标记：

全部对象默认为白，从root开始，把引用的对象标记为灰，把灰对象的引用的非黑对象继续标记为灰，并把原来的灰对象标记为黑表示已遍历，重复这个过程，直到没有灰对象，剩下的所有白对象则表示没被引用到，销毁全部白对象。

写屏障：GC过程并不STW，程序仍在执行，仍可以修改对象间的引用。GC过程中监听对象修改，将受改动影响的对象直接标记为灰，继续GC。

## 一些知识点

### new vs make

make(Type):

返回类型为Type的一个初始值，适用于 slices  /  maps / channels 类型的初始化。

new(Type):

分配类型为Type一片新内存，返回此内存的指针，一般不直接使用new，用`a := &Type{}`即可自动完成内存分配和初始化。

### struct

定义类型

```go
type Person struct {
  name string
  age int
}

type Singer struct {
  Person // 匿名struct，Person类型内部属性可以在Singer上直接访问
  name string
  songs []string
}

func main() {
  p1 := Person{"Alice", 18}
  s1 := Singer{p1, "Ali", []string{"hip", "hop"}}
  fmt.Print(s1.age) // 18 (直接返回了p1的age)
  fmt.Print(s1.name) // Ali (s1有自己的name时覆盖p1的name，返回自身的name)
  fmt.Print(s1.Person.name) // Alice (可通过命名来访问p1的name)
}
```

给struct Person定义方法

```go
type Person struct {
  name string
  age int
}

// 接收者为Person引用
func (p *Person) Grow(year int) int {
  p.age += year
  return p.age
}

// 接收者为Person副本
func (p Person) GrowCopy(year int) int {
  p.age += year
  return p.age
}

func main() {
  p1 := Person{"Alice", 18}
  fmt.Print(p1.GrowCopy(2)) // 20
  fmt.Print(p1) // {Alice 18}
  fmt.Print(p1.Grow(2)) // 20
  fmt.Print(p1) // {Alice 20}
}
```

### interface

定义接口

```go
type Person struct {
  name string
  age int
}

func (p *Person) Grow(year int) int {
  p.age += year
  return p.age
}

type Human interface {
  Grow(year int) int
}

func main() {
  p1 := Person{"Bob", 20}
  var h Human // 定义Human接口类型的h，如果某变量实现了Human定义的所有接口，那么这个变量可以赋值给h
  h = &p1 // 因为前面的Grow方法里定义的接收者为指针类型(*Person)，这里使用&p1与之对应，如果用p1因为Grow方法匹配不上而赋值失败
  h.Grow(1) // 通过h来调用p1上的Grow
  fmt.Print(p1.age) // 21
}
```
