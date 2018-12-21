# API

## Hooks

## context api

16.3前后api对比

解决：不符合分形、无法穿透shouldUpdateComponent


## setState

一次DOM reconciliation调用setState多次，state非立刻变化

transaction模型,batchedUpdates(ReactDOM.unstable_batchedUpdates)

## pureComponent

和普通component差异：

自动添加shouldUpdateComponent的判断，对变化前后的props和state进行浅比较返回bool，来决定要不要走render
