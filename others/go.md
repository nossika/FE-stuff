# Golang

## 和JS对比

### 局部变量

在JS里写if时经常有如下代码：

    const sum = a + b;
    if (sum > max) {
      handle(sum);
    } 

或者：

    if (a + b > max) {
      handle(a + b);
    }

前者污染外部作用域（在if外部作用域定义了一个sum，实际上这个sum可能只会在if中使用），后者有重复代码（a+b写了两次）。

go可以这么写来定义一个局部变量sum，该变量仅能在if中被访问：

if sum := a + b; sum > max {
  handle(sum)
}

### 函数传参方式

go定义函数时可以指定参数是按引用还是按值（副本）传递
        
    func ByVal(arr [3]int, num int) {
      arr[1] = 0
      int = 0
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
    ByRef(&arr, &num)

## 一些知识点

### new vs make

make(Type):

返回类型为Type的一个初始值，适用于 slices  /  maps / channels 类型的初始化。

new(Type):

分配类型为Type一片新内存，返回此内存的指针，一般不直接使用new，用`a := &Type{}`即可自动完成内存分配和初始化。

### struct

定义类型


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


给struct Person定义方法

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

### interface

定义接口


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






