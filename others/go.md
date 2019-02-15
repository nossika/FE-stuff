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

