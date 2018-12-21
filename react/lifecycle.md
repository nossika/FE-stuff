
# 生命周期

## 执行顺序

### 组件新建

- constructor()
- static getDerivedStateFromProps()
- render()
- componentDidMount()

### 组件卸载

- componentWillUnmount()

### 组件更新 && 组件内执行setState

- static getDerivedStateFromProps()
- shouldComponentUpdate()
- render()
- getSnapshotBeforeUpdate()
- componentDidUpdate()

### 对组件执行forceUpdate

- static getDerivedStateFromProps()
- render()
- getSnapshotBeforeUpdate()
- componentDidUpdate()

## 执行顺序（before v16.3）

### 组件新建

- constructor()
- UNSAFE_componentWillMount()
- render()
- componentDidMount()

### 组件卸载

- componentWillUnmount()

### 组件更新

- UNSAFE_componentWillReceiveProps()
- shouldComponentUpdate()
- UNSAFE_componentWillUpdate()
- render()
- componentDidUpdate()

### 组件内执行setState

- shouldComponentUpdate()
- UNSAFE_componentWillUpdate()
- render()
- componentDidUpdate()

### 对组件执行forceUpdate

- UNSAFE_componentWillUpdate()
- render()
- componentDidUpdate()

## componentDidCatch