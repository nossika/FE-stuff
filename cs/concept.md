# 概念

## 比特、字节、字符

比特是计量信息的最小单位，只有0、1两种状态。字节是计算机信息计量单位，1字节(Byte)(B)由8比特(Bit)(b)组成，即有256种状态。

字符也是信息计量单位，一个字符对应自然语言的一个字母、一个汉字或一个假名等。一个字符占用的字节数并非固定，因编码方式和语言类型而异，编码方式有UTF-8、ASCII、Unicode等。

## 缓存

凡是位于速度相差较大的两种介质之间，用于协调两者数据传输速度差异的结构，均可称为缓存。

## 高级语言、字节码、机器码

程序由人编写，由机器运行。由人编写的代码是高级语言，更贴近人思考和表达的自然语法；机器运行的代码是机器码，二进制，由机器指令集组成，且和运行平台（CPU等）强相关。

程序由编写到运行则需高级语言翻译到机器码，而这二者相差太大，高级语言如果直接编译为机器码，那么下次换个平台运行可能又得从头编译。字节码则是介于这二者之间，更贴近机器运行的语言，但又和平台无关的代码。将高级语言编译为字节码，之后的运行只需从字节码再翻译为机器码即可。保存字节码占用空间相比于直接保存机器码更小，且字节码翻译成机器码的效率也足够高。

JS的V8也采用了把JS编译为字节码缓存，运行时再逐条翻译为机器码的方式。
