import{_ as n,p as s,q as a,a1 as t}from"./framework-5866ffd3.js";const p={},e=t(`<h1 id="一些用法" tabindex="-1"><a class="header-anchor" href="#一些用法" aria-hidden="true">#</a> 一些用法</h1><h2 id="struct" tabindex="-1"><a class="header-anchor" href="#struct" aria-hidden="true">#</a> struct</h2><p>可以用struct定义一个固定结构的结构体</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> Person <span class="token keyword">struct</span> <span class="token punctuation">{</span>
  name <span class="token builtin">string</span>
  age <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> Singer <span class="token keyword">struct</span> <span class="token punctuation">{</span>
  Person <span class="token comment">// 继承Person，直接(Singer).age就能访问到Person.age，也可以通过(Singer).Person.age来访问</span>
  name <span class="token builtin">string</span>
  songs <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  p1 <span class="token operator">:=</span> Person<span class="token punctuation">{</span><span class="token string">&quot;Alice&quot;</span><span class="token punctuation">,</span> <span class="token number">18</span><span class="token punctuation">}</span>
  s1 <span class="token operator">:=</span> Singer<span class="token punctuation">{</span>p1<span class="token punctuation">,</span> <span class="token string">&quot;Ali&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">{</span><span class="token string">&quot;hip&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;hop&quot;</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
  fmt<span class="token punctuation">.</span><span class="token function">Print</span><span class="token punctuation">(</span>s1<span class="token punctuation">.</span>age<span class="token punctuation">)</span> <span class="token comment">// 18 (直接返回了p1的age)</span>
  fmt<span class="token punctuation">.</span><span class="token function">Print</span><span class="token punctuation">(</span>s1<span class="token punctuation">.</span>name<span class="token punctuation">)</span> <span class="token comment">// Ali (s1有自己的name时覆盖p1的name，返回自身的name)</span>
  fmt<span class="token punctuation">.</span><span class="token function">Print</span><span class="token punctuation">(</span>s1<span class="token punctuation">.</span>Person<span class="token punctuation">.</span>name<span class="token punctuation">)</span> <span class="token comment">// Alice (可通过命名来访问p1的name)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以为struct定义一些方法</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> Person <span class="token keyword">struct</span> <span class="token punctuation">{</span>
  name <span class="token builtin">string</span>
  age <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token comment">// 接收者为Person引用</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>p <span class="token operator">*</span>Person<span class="token punctuation">)</span> <span class="token function">Grow</span><span class="token punctuation">(</span>year <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span>
  p<span class="token punctuation">.</span>age <span class="token operator">+=</span> year
  <span class="token keyword">return</span> p<span class="token punctuation">.</span>age
<span class="token punctuation">}</span>

<span class="token comment">// 接收者为Person副本</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>p Person<span class="token punctuation">)</span> <span class="token function">GrowCopy</span><span class="token punctuation">(</span>year <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span>
  p<span class="token punctuation">.</span>age <span class="token operator">+=</span> year
  <span class="token keyword">return</span> p<span class="token punctuation">.</span>age
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  p1 <span class="token operator">:=</span> Person<span class="token punctuation">{</span><span class="token string">&quot;Alice&quot;</span><span class="token punctuation">,</span> <span class="token number">18</span><span class="token punctuation">}</span>
  fmt<span class="token punctuation">.</span><span class="token function">Print</span><span class="token punctuation">(</span>p1<span class="token punctuation">.</span><span class="token function">GrowCopy</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 20</span>
  fmt<span class="token punctuation">.</span><span class="token function">Print</span><span class="token punctuation">(</span>p1<span class="token punctuation">)</span> <span class="token comment">// {Alice 18}</span>
  fmt<span class="token punctuation">.</span><span class="token function">Print</span><span class="token punctuation">(</span>p1<span class="token punctuation">.</span><span class="token function">Grow</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 20</span>
  fmt<span class="token punctuation">.</span><span class="token function">Print</span><span class="token punctuation">(</span>p1<span class="token punctuation">)</span> <span class="token comment">// {Alice 20}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="struct比较" tabindex="-1"><a class="header-anchor" href="#struct比较" aria-hidden="true">#</a> struct比较</h3><p>全部key可比才可比，有slice和map则不可比。（可比struct才能用于做map的key，slice和map可用reflect.DeepEqual比较）</p><h3 id="内存对齐" tabindex="-1"><a class="header-anchor" href="#内存对齐" aria-hidden="true">#</a> 内存对齐</h3><p>struct的最终占用大小并非struct里的每个key大小之和，go编译器会按key的顺序和大小调整每个key的offset来对齐内存。</p><p>因为CPU读取数据是按段读取的，如果不对齐，可能读一个key会读两次。</p><h2 id="interface" tabindex="-1"><a class="header-anchor" href="#interface" aria-hidden="true">#</a> interface</h2><p>接口类型可以用来统一管理拥有某一组共同方法的struct</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> Person <span class="token keyword">struct</span> <span class="token punctuation">{</span>
  name <span class="token builtin">string</span>
  age <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>p <span class="token operator">*</span>Person<span class="token punctuation">)</span> <span class="token function">Grow</span><span class="token punctuation">(</span>year <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span>
  p<span class="token punctuation">.</span>age <span class="token operator">+=</span> year
  <span class="token keyword">return</span> p<span class="token punctuation">.</span>age
<span class="token punctuation">}</span>

<span class="token keyword">type</span> Human <span class="token keyword">interface</span> <span class="token punctuation">{</span>
  <span class="token function">Grow</span><span class="token punctuation">(</span>year <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  p1 <span class="token operator">:=</span> Person<span class="token punctuation">{</span><span class="token string">&quot;Bob&quot;</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">}</span>
  <span class="token keyword">var</span> h Human <span class="token comment">// 定义Human接口类型的h，如果某类型实现了Human定义的所有接口，那么这个类型才可以赋值给h</span>
  h <span class="token operator">=</span> <span class="token operator">&amp;</span>p1 <span class="token comment">// 因为前面的Grow方法里定义的接收者为指针类型(*Person)，这里使用&amp;p1与之对应，如果用p1因为Grow方法匹配不上而赋值失败</span>
  h<span class="token punctuation">.</span><span class="token function">Grow</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token comment">// 通过h来调用p1上的Grow</span>
  fmt<span class="token punctuation">.</span><span class="token function">Print</span><span class="token punctuation">(</span>p1<span class="token punctuation">.</span>age<span class="token punctuation">)</span> <span class="token comment">// 21</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="chan" tabindex="-1"><a class="header-anchor" href="#chan" aria-hidden="true">#</a> chan</h2><p>chan类型是一种生产者-消费者结构，多用于协程间的通信</p><p>一个基本用法</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">chProducer</span><span class="token punctuation">(</span>ch <span class="token keyword">chan</span><span class="token operator">&lt;-</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">{</span>
    time<span class="token punctuation">.</span><span class="token function">Sleep</span><span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">*</span> time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span>
    ch <span class="token operator">&lt;-</span> <span class="token number">1</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">chConsumer</span><span class="token punctuation">(</span>ch <span class="token operator">&lt;-</span><span class="token keyword">chan</span> <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">{</span>
    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token operator">&lt;-</span>ch<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  ch <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">chan</span> <span class="token builtin">int</span><span class="token punctuation">)</span>
  <span class="token keyword">go</span> <span class="token function">chProducer</span><span class="token punctuation">(</span>ch<span class="token punctuation">)</span>
  <span class="token function">chConsumer</span><span class="token punctuation">(</span>ch<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>chan是阻塞模式</p><p>生产者发生阻塞</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ch缓冲区容量为3</span>
  ch <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">chan</span> <span class="token builtin">int</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span>

  ch <span class="token operator">&lt;-</span> <span class="token number">1</span>
  ch <span class="token operator">&lt;-</span> <span class="token number">2</span>
  ch <span class="token operator">&lt;-</span> <span class="token number">3</span>

  <span class="token comment">// 此时已经有3条未消费数据了，到这一步会卡住</span>
  <span class="token comment">// main在等待其他协程消费ch数据，才会继续往下执行，但此时已经没有活跃协程了，产生deadlock</span>
  ch <span class="token operator">&lt;-</span> <span class="token number">4</span>

  <span class="token comment">// 走不到这一步</span>
  fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token operator">&lt;-</span>ch<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>消费者发生阻塞</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  ch <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">chan</span> <span class="token builtin">int</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span>

  ch <span class="token operator">&lt;-</span> <span class="token number">1</span>

  fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token operator">&lt;-</span>ch<span class="token punctuation">)</span> <span class="token comment">// 1</span>

  <span class="token comment">// 到这一步会卡住</span>
  <span class="token comment">// main在等待其他协程生产ch数据，才会继续往下执行，但此时已经没有活跃协程了，产生deadlock</span>
  fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token operator">&lt;-</span>ch<span class="token punctuation">)</span>

  <span class="token comment">// 执行不到这里</span>
  fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token operator">&lt;-</span>ch<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="类型断言" tabindex="-1"><a class="header-anchor" href="#类型断言" aria-hidden="true">#</a> 类型断言</h2><p>interface类型可以使用断言语法转化为指定类型</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> Person <span class="token keyword">struct</span> <span class="token punctuation">{</span>
  Name <span class="token builtin">string</span>
  Age <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> Person2 <span class="token keyword">struct</span> <span class="token punctuation">{</span>
  Name <span class="token builtin">string</span>
  Age <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  p <span class="token operator">:=</span> Person<span class="token punctuation">{</span><span class="token string">&quot;A&quot;</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">}</span>

  <span class="token keyword">var</span> i <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

  i <span class="token operator">=</span> p

  p1<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> i<span class="token punctuation">.</span><span class="token punctuation">(</span>Person<span class="token punctuation">)</span>
  <span class="token comment">// 断言使用该interface对应的类型，转化成功</span>
  fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>p1<span class="token punctuation">)</span> <span class="token comment">// {A, 20}</span>

  p2<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> i<span class="token punctuation">.</span><span class="token punctuation">(</span>Person2<span class="token punctuation">)</span>
  <span class="token comment">// 断言使用非对应的类型，转化失败</span>
  fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>p2<span class="token punctuation">)</span> <span class="token comment">// { }</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="类型强制转换" tabindex="-1"><a class="header-anchor" href="#类型强制转换" aria-hidden="true">#</a> 类型强制转换</h2><p>可以通过改写读取指针来强行改变某个变量的类型，需要unsafe包</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">import</span> <span class="token string">&quot;unsafe&quot;</span>

<span class="token keyword">type</span> Person <span class="token keyword">struct</span> <span class="token punctuation">{</span>
  Name <span class="token builtin">string</span>
  Age <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> Person2 <span class="token keyword">struct</span> <span class="token punctuation">{</span>
  Name <span class="token builtin">string</span>
  Age <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> i <span class="token builtin">float64</span>

  i <span class="token operator">=</span> <span class="token number">1</span>

  <span class="token comment">// 强制以int的结构读取float64类型的数据</span>
  i2 <span class="token operator">:=</span> <span class="token operator">*</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token builtin">int</span><span class="token punctuation">)</span><span class="token punctuation">(</span>unsafe<span class="token punctuation">.</span><span class="token function">Pointer</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span>

  fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>i2<span class="token punctuation">)</span> <span class="token comment">// 4607182418800017408</span>

  p <span class="token operator">:=</span> Person<span class="token punctuation">{</span><span class="token string">&quot;A&quot;</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">}</span>

  <span class="token comment">// 也可以用于struct，强制以Person2的结构来读取Person类型的数据</span>
  <span class="token comment">// 使用强制转化时，两者结构完全对应的时候可以转化成功，否则可能读出奇怪的数据甚至panic</span>
  p2 <span class="token operator">:=</span> <span class="token operator">*</span><span class="token punctuation">(</span><span class="token operator">*</span>Person2<span class="token punctuation">)</span><span class="token punctuation">(</span>unsafe<span class="token punctuation">.</span><span class="token function">Pointer</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>p<span class="token punctuation">)</span><span class="token punctuation">)</span>

  fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>p2<span class="token punctuation">)</span> <span class="token comment">// {A, 20}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="interface类型强制转换" tabindex="-1"><a class="header-anchor" href="#interface类型强制转换" aria-hidden="true">#</a> interface类型强制转换</h2><p>某些场景下，可能你知道某个interface对应的原始类型，但无法引入这个原始类型，此时无法用正常的断言来转换类型。</p><p>可以自己构造一个对应类型，然后通过eface强制转换。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> Person <span class="token keyword">struct</span> <span class="token punctuation">{</span>
  Name <span class="token builtin">string</span>
  Age  <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  p <span class="token operator">:=</span> Person<span class="token punctuation">{</span><span class="token string">&quot;A&quot;</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">}</span>

  <span class="token keyword">var</span> i <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

  i <span class="token operator">=</span> p

  <span class="token keyword">type</span> PersonFake <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    Name <span class="token builtin">string</span>
    Age  <span class="token builtin">int</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 这里如果直接使用类型强制转换会失败，&amp;i指向的并不是那个原始Person结构体，因为interface把这个结构包了一层，&amp;i指向的只是这个interface外壳</span>
  <span class="token comment">// p2 := *(*PersonFake)(unsafe.Pointer(&amp;i))</span>

  <span class="token comment">// 需要借助eface结构体，做两次类型强制转换</span>
  <span class="token comment">// eface即为interface类型的真实结构，定义于go/src/runtime/runtime2.go</span>
  <span class="token keyword">type</span> eface <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    _type unsafe<span class="token punctuation">.</span>Pointer
    data  unsafe<span class="token punctuation">.</span>Pointer
  <span class="token punctuation">}</span>
  <span class="token comment">// (*eface)(unsafe.Pointer(&amp;i)) 这一步把interface类型的i转换为eface结构体，而(eface).data存储的就是指向i对应的那个原始结构的指针</span>
  <span class="token comment">// *(*PersonFake)(原始结构体指针) 这一步就是正常的类型强制转换，使用PersonFake来强制读取Person类型的数据</span>
  p2 <span class="token operator">:=</span> <span class="token operator">*</span><span class="token punctuation">(</span><span class="token operator">*</span>PersonFake<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token operator">*</span>eface<span class="token punctuation">)</span><span class="token punctuation">(</span>unsafe<span class="token punctuation">.</span><span class="token function">Pointer</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>data<span class="token punctuation">)</span>

  fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>p2<span class="token punctuation">)</span> <span class="token comment">// {A, 20}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="debounce" tabindex="-1"><a class="header-anchor" href="#debounce" aria-hidden="true">#</a> debounce</h2><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">package</span> main

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;context&quot;</span>
	<span class="token string">&quot;fmt&quot;</span>
	<span class="token string">&quot;reflect&quot;</span>
	<span class="token string">&quot;sync&quot;</span>
	<span class="token string">&quot;time&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">Debounce</span><span class="token punctuation">(</span>fn <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> wait <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token operator">...</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">var</span> cf context<span class="token punctuation">.</span>CancelFunc
	<span class="token keyword">var</span> mu sync<span class="token punctuation">.</span>Mutex
	<span class="token keyword">return</span> <span class="token keyword">func</span><span class="token punctuation">(</span>args <span class="token operator">...</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token comment">// 需注意并发安全，因为 cf 的判断 &amp; 赋值不是原子操作，多协程同时访问可能有问题，比如协程 1 可能已经设置了新 cf，而协程 2 取消的是旧的 cf</span>
		<span class="token comment">// 需要加锁以保证同时只有一个协程能对 cf 操作</span>
		mu<span class="token punctuation">.</span><span class="token function">Lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">if</span> cf <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
			<span class="token function">cf</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
		cf <span class="token operator">=</span> <span class="token function">setTimeout</span><span class="token punctuation">(</span>fn<span class="token punctuation">,</span> wait<span class="token punctuation">,</span> args<span class="token operator">...</span><span class="token punctuation">)</span>
		mu<span class="token punctuation">.</span><span class="token function">Unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">setTimeout</span><span class="token punctuation">(</span>fn <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> timeout <span class="token builtin">int</span><span class="token punctuation">,</span> args <span class="token operator">...</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> context<span class="token punctuation">.</span>CancelFunc <span class="token punctuation">{</span>
	ctx<span class="token punctuation">,</span> cancelFunc <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">WithCancel</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

	<span class="token comment">// 新起协程执行任务</span>
	<span class="token keyword">go</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token comment">// 轮询以下情况</span>
		<span class="token keyword">select</span> <span class="token punctuation">{</span>
		<span class="token comment">// ctx 结束，直接退出</span>
		<span class="token keyword">case</span> <span class="token operator">&lt;-</span>ctx<span class="token punctuation">.</span><span class="token function">Done</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
		<span class="token comment">// time 达到要求，调用 fn</span>
		<span class="token keyword">case</span> <span class="token operator">&lt;-</span>time<span class="token punctuation">.</span><span class="token function">After</span><span class="token punctuation">(</span>time<span class="token punctuation">.</span><span class="token function">Duration</span><span class="token punctuation">(</span>timeout<span class="token punctuation">)</span> <span class="token operator">*</span> time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span><span class="token punctuation">:</span>
			<span class="token function">callFunc</span><span class="token punctuation">(</span>fn<span class="token punctuation">,</span> args<span class="token operator">...</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	<span class="token keyword">return</span> cancelFunc
<span class="token punctuation">}</span>

<span class="token comment">// fn 的函数类型和参数不确定，需通过反射调用函数</span>
<span class="token keyword">func</span> <span class="token function">callFunc</span><span class="token punctuation">(</span>fn <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> args <span class="token operator">...</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	f <span class="token operator">:=</span> reflect<span class="token punctuation">.</span><span class="token function">ValueOf</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span>
	<span class="token keyword">if</span> <span class="token function">len</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span> <span class="token operator">!=</span> f<span class="token punctuation">.</span><span class="token function">Type</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">NumIn</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token function">panic</span><span class="token punctuation">(</span><span class="token string">&quot;The number of arguments does not match the function&quot;</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>

	inputs <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span>reflect<span class="token punctuation">.</span>Value<span class="token punctuation">,</span> <span class="token function">len</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">)</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token keyword">range</span> args <span class="token punctuation">{</span>
		inputs<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> reflect<span class="token punctuation">.</span><span class="token function">ValueOf</span><span class="token punctuation">(</span>args<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>

	f<span class="token punctuation">.</span><span class="token function">Call</span><span class="token punctuation">(</span>inputs<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">testDebounce</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	foo <span class="token operator">:=</span> <span class="token function">Debounce</span><span class="token punctuation">(</span><span class="token keyword">func</span><span class="token punctuation">(</span>id <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;foo&quot;</span><span class="token punctuation">,</span> id<span class="token punctuation">)</span>
	<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span>

	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token keyword">range</span> <span class="token number">100</span> <span class="token punctuation">{</span>
		<span class="token keyword">go</span> <span class="token function">foo</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>

	time<span class="token punctuation">.</span><span class="token function">Sleep</span><span class="token punctuation">(</span><span class="token number">100</span> <span class="token operator">*</span> time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token function">testDebounce</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,35),c=[e];function o(i,l){return s(),a("div",null,c)}const k=n(p,[["render",o],["__file","main.html.vue"]]);export{k as default};
