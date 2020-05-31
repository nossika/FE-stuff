# 一些用法

## struct

可以用struct定义一个固定结构的结构体

```go
type Person struct {
  name string
  age int
}

type Singer struct {
  Person // 继承Person，直接(Singer).age就能访问到Person.age，也可以通过(Singer).Person.age来访问
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

可以为struct定义一些方法

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

## interface

接口类型可以用来统一管理拥有某一组共同方法的struct

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
  var h Human // 定义Human接口类型的h，如果某类型实现了Human定义的所有接口，那么这个类型才可以赋值给h
  h = &p1 // 因为前面的Grow方法里定义的接收者为指针类型(*Person)，这里使用&p1与之对应，如果用p1因为Grow方法匹配不上而赋值失败
  h.Grow(1) // 通过h来调用p1上的Grow
  fmt.Print(p1.age) // 21
}
```

## chan
chan类型是一种生产者-消费者结构，多用于协程间的通信

一个基本用法
```go
func chProducer(ch chan<- int) {
  for {
    time.Sleep(1 * time.Second)
    ch <- 1
  }
}

func chConsumer(ch <-chan int) {
  for {
    fmt.Println(<-ch)
  }
}

func main() {
  ch := make(chan int)
  go chProducer(ch)
  chConsumer(ch)
}
```

chan是阻塞模式

生产者发生阻塞
```go
func main() {
  // ch缓冲区容量为3
  ch := make(chan int, 3)

  ch <- 1
  ch <- 2
  ch <- 3

  // 此时已经有3条未消费数据了，到这一步会卡住
  // main在等待其他协程消费ch数据，才会继续往下执行，但此时已经没有活跃协程了，产生deadlock
  ch <- 4

  // 走不到这一步
  fmt.Println(<-ch)
}
```

消费者发生阻塞
```go
func main() {
  ch := make(chan int, 3)

  ch <- 1

  fmt.Println(<-ch) // 1

  // 到这一步会卡住
  // main在等待其他协程生产ch数据，才会继续往下执行，但此时已经没有活跃协程了，产生deadlock
  fmt.Println(<-ch)

  // 执行不到这里
  fmt.Println(<-ch)
}
```


## 类型断言

interface类型可以使用断言语法转化为指定类型

```go
type Person struct {
  Name string
  Age int
}

type Person2 struct {
  Name string
  Age int
}

func main() {
  p := Person{"A", 20}

  var i interface{}

  i = p

  p1, _ := i.(Person)
  // 断言使用该interface对应的类型，转化成功
  fmt.Println(p1) // {A, 20}

  p2, _ := i.(Person2)
  // 断言使用非对应的类型，转化失败
  fmt.Println(p2) // { }
}
```

## 类型强制转换

可以通过改写读取指针来强行改变某个变量的类型，需要unsafe包

```go
import "unsafe"

type Person struct {
  Name string
  Age int
}

type Person2 struct {
  Name string
  Age int
}

func main() {
  var i float64

  i = 1

  // 强制以int的结构读取float64类型的数据
  i2 := *(*int)(unsafe.Pointer(&i))

  fmt.Println(i2) // 4607182418800017408

  p := Person{"A", 20}

  // 也可以用于struct，强制以Person2的结构来读取Person类型的数据
  // 使用强制转化时，两者结构完全对应的时候可以转化成功，否则可能读出奇怪的数据甚至panic
  p2 := *(*Person2)(unsafe.Pointer(&p))

  fmt.Println(p2) // {A, 20}
}
```

## interface类型强制转换

某些场景下，可能你知道某个interface对应的原始类型，但无法引入这个原始类型，此时无法用正常的断言来转换类型。

可以自己构造一个对应类型，然后通过eface强制转换。

```go
type Person struct {
  Name string
  Age  int
}

func main() {
  p := Person{"A", 20}

  var i interface{}

  i = p

  type PersonFake struct {
    Name string
    Age  int
  }

  // 这里如果直接使用类型强制转换会失败，&i指向的并不是那个原始Person结构体，因为interface把这个结构包了一层，&i指向的只是这个interface外壳
  // p2 := *(*PersonFake)(unsafe.Pointer(&i))

  // 需要借助eface结构体，做两次类型强制转换
  // eface即为interface类型的真实结构，定义于go/src/runtime/runtime2.go
  type eface struct {
    _type unsafe.Pointer
    data  unsafe.Pointer
  }
  // (*eface)(unsafe.Pointer(&i)) 这一步把interface类型的i转换为eface结构体，而(eface).data存储的就是指向i对应的那个原始结构的指针
  // *(*PersonFake)(原始结构体指针) 这一步就是正常的类型强制转换，使用PersonFake来强制读取Person类型的数据
  p2 := *(*PersonFake)((*eface)(unsafe.Pointer(&i)).data)

  fmt.Println(p2) // {A, 20}
}
```