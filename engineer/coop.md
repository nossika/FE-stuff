# 协作

## Git Workflow

master：稳定版本，生产环境分支，随时可以发布或回退

release：较稳定版本，用于测试。develop功能稳定时，可以切出release，以在发布到生产前再次测试

develop：开发分支，拥有最新的功能，各个feature完成开发后往此分支合并（冲突在此时解决）

hotfix：有紧急的生产问题时，基于master切出，修复后直接合并回master发布（也要及时同步到develop）

feature：功能分支，基于单个功能从develop分支切出，可能同时存在多个，开发完毕后各自合并回develop

在此流程中，master必须合并release（或者稳定的develop），不能直接合入单个feature，否则功能可能会和测试过的release或develop有差异。


