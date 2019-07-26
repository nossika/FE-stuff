# linux

## 环境变量

设置env：

```bash
$ export field1=value1 field2=value2
```

查看env：

```bash
$ echo $field1
```

查看全部env：

```bash
$ env
```

把可执行文件添加到环境变量中：

```bash
$ export PATH=$PATH:/path/to/bin
```

> $PATH表示当前的路径设置，用`:`和新路径分隔，如果去掉`$PATH:`则会以新值覆盖PATH。


程序在sudo模式下运行时，会忽略当前用户配置的env，如果需要当前env的变量，可以加上`-E`参数来透传环境变量：

```bash
$ sudo -E [cmd] 
```