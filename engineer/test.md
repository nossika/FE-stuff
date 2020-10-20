
# 测试

## 前端测试

前端测试的实现难点在于：

1. 代码跑测试用例的环境和实际运行平台不一致（除了用puppeteer方案），要解决node端和浏览器端环境差异

2. 源码通常是用最新ECMA标准来编写，要经过编译才能运行

对于使用了webpack的项目来说，测试框架需要保留其模块化规则和编译规则，保留编译的sourcemap，在出错时能对应到源码；且对依赖了浏览器特有api的代码mock掉（比如import了某个css文件），不去测试和平台相关的行为。

## 测试分类

### 单元测试

### 接口测试/集成测试

### 端到端测试/UI测试

## 对React Hooks进行单元测试

### 准备

测试框架：[jest](https://jestjs.io/) + [enzyme](https://enzymejs.github.io/enzyme/)

当前版本：
- jest 26.1.0
- enzyme 3.11.0
- react 16.8+

jest配置中需要注意的地方：

1. 一般前端项目都以webpack编译，但jest测试不跑webpack，所以一些在webpack中设置过alias和extensions的引用在jest中会报错，需要把这部分规则同步到jest中。
2. 一些非js依赖在webpack中有对应的loader处理，比如`import './xxx.css'`。对组件的测试一般不需要理会这部分逻辑，可以对其直接mock为一个返回空值的模块。

我的jest.config.js例子

```js
const webpackConfig = require('./webpack.base.config')();

const alias = { };

Object.keys(webpackConfig.resolve.alias).forEach((name) => {
  alias[`^${name}(.*)`] = `<rootDir>/src/${name}$1`;
});

alias['^config(.*)'] = '<rootDir>/../config$1';

module.exports = {
  moduleNameMapper: { // 改写导入模块的规则
    '^.+\\.(css|less|png|jpg)$': '<rootDir>/mock/null.js',
    ...alias,
  },
  moduleFileExtensions: webpackConfig.resolve.extensions.map(ext => ext.replace(/^\./, '')), // 省略文件后缀
  transform: { // loader
    '^.+\\.(js|jsx)$': 'babel-jest', // 使用babel-jest还需在根目录有babel.config.js，与webpack的babel配置保持一致即可
  },
  collectCoverage: true,
};
```

### 一个简单的例子

header.jsx

```jsx
import React from 'react';
export default function Header(props) {
  const { content } = props; 
  return (
    <h1>{ content }</h1>
  );
}
```

header.test.js

```jsx
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from './header.jsx';

Enzyme.configure({ adapter: new Adapter() });

describe('Header', () => {
  it('should render correct', async () => {
    const content = 'abc';
    const wrapper = mount(<Header content={content}/>);
    expect(wrapper.find('h1').text()).toEqual(content);
  });
});

```

### 改变state
简单例子中只是改变组件的入参props来测试，对于组件的内部state，是无法直接从外部改变的。

但state总归是要由某个对应的函数来控制的，只要想办法去调用此函数即可。一般此函数都会关联到组件上，可以通过获取组件树上的props或者模拟DOM操作来触发它。


counter.jsx

```jsx
import React, { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);

  const addCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>{ count }</h1>
      <button onClick={addCount}> 
        count + 1 
      </button>
    </div>
  );
}
```

counter.test.js

```jsx
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { sleep } from 'utils';
import Counter from './counter.jsx';

Enzyme.configure({ adapter: new Adapter() });

describe('Counter', () => {
  it('should render correct', async () => {
    const wrapper = mount(<Counter/>);
    await act(async() => { // 
      wrapper.find('button').at(0).props().onClick(); // 直接通过props获取并调用addCount
      // wrapper.find('button').simulate('click'); // 或者通过模拟DOM事件触发addCount
      await sleep(10); // 更新state的事务是异步执行，需要先等待更新再断言
      wrapper.update(); // 更新DOM，如果wrapper.find的目标元素是state改变后才渲染，不执行这句就会find不到，这个例子中去掉也能正常运行
      expect(wrapper.find('h1').text()).toEqual('1');
    });
  });
});
```

辅助sleep函数

```js
const sleep = (ms) => new Promise((resolve) => {
  const timer = setTimeout(() => {
    resolve(timer);
  }, ms);
});
```


### mock调用

如果组件还依赖了一些外部调用，比如常见的http请求，也可以基于jest自带的mock功能，对特定的调用做mock。

这里以一个异步调用返回promise的api模块作为例子，在模块级别做mock，更多mock方式可以看 [mock-function-api](https://jestjs.io/docs/en/mock-function-api)。

user-name.jsx

```jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

export default function UserName(props) {
  const { userId } = props;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    api
      .getUserName({
        userId,
      })
      .then(resp => {
        setUserName(resp.userName);
      });
  }, [userId]);

  return (
    <h1>{ userName }</h1>
  )
}
```

user-name.test.js

```jsx
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { sleep } from 'utils';
import api from '../api';
import UserName from './user-name.jsx';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('../api'); // 对api模块mock

describe('Counter', () => {
  it('should render correct', async () => {
    const mockUserName = 'test user';
    
    api.getUserName.mockResolvedValue({ // 对api.getUserName方法mock返回值
      userName: mockUserName,
    });

    await act(async() => {
      const wrapper = mount(<UserName userId={123}/>);
      await sleep(10);
      wrapper.update();
      expect(wrapper.find('h1').text()).toEqual(mockUserName);
    });
  });
});
```

### mock全局变量

对于web端，全局变量都是挂载于window上，jest运行时提供了浏览器环境，可以直接改写window上的值来mock。以常见的location全局变量为例，其他变量同理：

page-href.jsx

```jsx
import React, { useState } from 'react';

export default function PageHref() {
  const [pageHref, setPageHref] = useState('');

  const showPageHref = () => {
    setPageHref(window.location.href);
  };

  return (
    <div>
      <h1>{ pageHref }</h1>
      <button onClick={showPageHref}> 
        showPageHref
      </button>
    </div>
  );
}
```

page-href.test.js

```jsx
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { sleep } from 'utils';
import PageHref from './page-href.jsx';

Enzyme.configure({ adapter: new Adapter() });

describe('PageHref', () => {
  it('should render correct', async () => {
    const { location } = window;
    delete window.location; // location的属性无法直接通过赋值来改变，需要删除原来的
 
    const href = 'test-page';
    window.location = { href }; // 直接构造一个新的全局变量location

    const wrapper = mount(<PageHref/>);
    await act(async() => {
      wrapper.find('button').at(0).props().onClick();
      await sleep(10);
      wrapper.update();
      expect(wrapper.find('h1').text()).toEqual(href);
    });

    window.location = location; // 还原location，以免影响其他用例
  });
});
```

对于固定的mock逻辑，可以使用beforeEach和afterEach统一管理，它们会在每个it的执行前后运行。比如上面的例子可以优化为：

```js
describe('PageHref', () => {
  const { location } = window;
  
  beforeEach(() => {
    delete window.location;
    window.location = {};
  });

  afterEach(() => {
    window.location = location;
  });

  it('test-page', async () => {
    window.location.href = 'test-page';
    // test code ...
  });
  
  it('test-page2', async () => {
    window.location.href = 'test-page2';
    // test code ...
  });
});
```

### 测试副作用

jest的断言除了可以判断dom的结构，还可以判断某个方法是否被调用。某些组件除了测试渲染的结果是否正确外，还需要测试某个逻辑是否被触发，比如useEffect里的副作用代码。

方法就是对副作用的调用mock成jest.Mock类型的函数，然后对此mock函数的调用次数/入参等做断言；作用在浏览器环境的副作用可直接通过jest模拟出的浏览器api来断言。

page-title.jsx

```jsx
import React, { useState, useEffect } from 'react';
import emitter from './emitter';

export default function PageTitle() {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!title) return;
    document.title = title; // 副作用1：改写页面的document.title
    emitter.emit('title', title); // 副作用2：调用外部模块发送事件
  }, [title]);

  return (
    <div>
      <h1>{ title }</h1>
      <input onChange={setTitle}/> 
    </div>
  );
}
```

page-title.test.js

```jsx
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { sleep } from 'utils';
import PageTitle from './page-title.jsx';
import emitter from './emitter';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('./emitter', () => ({
  emit: jest.fn(),
}));

describe('PageTitle', () => {
  beforeEach(() => {
    emitter.emit.mockClear(); //  各个it用例共用同一个emitter.emit，运行前重置调用记录
  });
  
  it('should render correct', async () => {
    const wrapper = mount(<PageTitle/>);
    await act(async() => {
      const title = 'test title';
      wrapper.find('input').at(0).props().onChange(title);
      await sleep(10);
      wrapper.update();

      expect(document.title).toEqual(title); // 可直接对jest环境中的document.title断言
      expect(emitter.emit).toBeCalledTimes(1); // 断言emit调用次数
      expect(emitter.emit).toHaveBeenCalledWith('title', title); // 断言emit调用入参
    });
  });
});
```

### 测试非UI组件

hooks的一大特性就是，组件不再必须是UI组件，也可以是逻辑组件，即组件返回值不一定是ReactElement，也可以是一个普通的json。

测试此类组件，有一个变通的方法是在外套一层HooksTest组件，把待测组件的输出值映射成UI，然后当做普通UI组件来测。

use-app-list.js

```jsx
import { useEffect, useState } from 'react';
import api from '../api';

export default function useAppList(refreshTime = 0) { // 获取app列表，返回结果list和加载状态
  const [list, setList] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setStatus('loading');
    setList([]);
    api.getAppList().then((list) => {
      setList(list);
      setStatus(list.length ? '' : 'empty');
    })
      .catch(() => {
        setStatus('error');
      });
  }, [refreshTime]);

  return [list, status];
};
```

use-app-list.test.js

```jsx
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { sleep } from 'utils';
import api from '../api';
import useAppList from './use-app-list.jsx';

jest.mock('../api');
Enzyme.configure({ adapter: new Adapter() });

const HooksTest = ({ hooks, hooksParams }) => {
  const result = hooks(...hooksParams); // 调用目标hooks，得到其返回值
  return <div>
    {JSON.stringify(result)} // 将返回值映射到UI上
  </div>;
}

describe('useAppList', () => {
  it('should render correct', async () => {
    const mockList = ['a', 'b', 'c'];
    api.getAppList.mockResolvedValue(mockList);

    await act(async () => {
      const wrapper = mount(<HooksTest hooks={useAppList} hooksParams={[0]}/>);
      await sleep(10);
      wrapper.update();
      expect(wrapper.text()).toEqual(JSON.stringify([mockList, ''])); // 将UI显示的结果和预期结果做对比
    });
  });
});
```

