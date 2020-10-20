# 设计模式

## 常用设计模式

- 创建型模式：单例模式、抽象工厂模式、建造者模式、工厂模式、原型模式。
- 结构型模式：适配器模式、桥接模式、装饰模式、组合模式、外观模式、享元模式、代理模式。
- 行为型模式：模版方法模式、命令模式、迭代器模式、观察者模式、中介者模式、备忘录模式、解释器模式、状态模式、策略模式、职责链模式(责任链模式)、访问者模式。

## OOP六大设计原则

单一职责原则、开闭原则、里氏替换原则、依赖倒置原则、接口隔离、迪米勒原则

## 单例模式

使某个方法在一次或多次被调用的情况下，其产生的实例仍只有一个，复用先前的资源来节省运算。

```js
// 全局提示组件
const showMsg= (() => {
  let div;
  return msg => {
    // 仅在第一次调用时创建这个div容器，之后的调用都复用此div，而非每次调用都创建一个新的
    if (!div) {
      div = document.createElement('div');
      document.body.appendChild(div);
    }
    div.innerText = msg;
  }
})();

showMsg('hello'); // 创建一个div
showMsg('world'); // 复用上面的div
```

## 观察者模式

当对象间需要一对一或者一对多通信时，在接收方和发送方都引入观察者，通过观察者来传递信息，而非直接调用对方的方法，降低耦合。

```js
class Observer {
  constructor() {
    this.dep = new Set();
  }
  emit(msg) {
    for (let callback of this.dep) {
      callback(msg);
    }
  }
  subscribe(callback) {
    this.dep.add(callback);
    return () => this.dep.delete(callback);
  }
}

class House {
  constructor() {
    this.event = new Observer();
  }
}

class Person {
  constructor(name) {
    this.name = name;
  }
  watch(observer) {
    observer.subscribe(msg => {
      console.log(this.name + ' see ' + msg);
    });
  }
}

const house = new House();
const person1 = new Person('Alice');
const person2 = new Person('Bob');

// 让Alice和Bob关注house发生的事件
person1.watch(house.event);
person2.watch(house.event);

// house发生着火事件
house.event.emit('fire!!!');

// Alice和Bob接收到着火事件
// 'Alice see fire!!!'
// 'Bob see fire!!!'
```


## 策略模式

有一系列相似的运算，需要根据条件来采取不同的运算时，可以使用策略模式，来替代大量平铺的if/else，符合开闭原则，也易于拓展。

```ts
interface Animal {
  yell(): string;
}

class Yeller {
  private animal: Animal;
  constructor() {
    this.animal = new DefaultAnimal();
  }
  setAnimal(animal: Animal) {
    this.animal = animal;
  }
  // 对外提供统一的run接口，根据不同animal显示不同叫声，只要实现了yell方法的类都可以作为animal
  run() {
    console.log(this.animal.yell());
  }
}

class DefaultAnimal implements Animal {
  yell() {
    return 'default';
  }
}

class Cat implements Animal {
  yell() {
    return 'meow';
  }
}

class Dog implements Animal {
  yell() {
    return 'bark';
  }
}

const yeller = new Yeller(); // 以默认Animal初始化，Animal可以理解为策略
yeller.run(); // 默认策略下显示default

yeller.setAnimal(new Cat()); // 设置策略为Cat
yeller.run(); // cat策略下显示meow

yeller.setAnimal(new Dog()); // 设置策略为Dog
yeller.run(); // dog策略下显示bark


```


