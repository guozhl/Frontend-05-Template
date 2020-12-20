学习笔记
## CSS总体结构
- @charset
- @import
- rules
  - @media
  - @page
  - rule

## At-rules
- @media - 条件组规则，如果设备满足使用媒体查询定义的条件的条件，则将应用其内容。
- @keyframes - 描述CSS动画序列中的中间步骤的方面。
- @fontface - 说明要下载的外部字体的外观。
- @charset - 定义样式表使用的字符集。
- @import - 告诉CSS引擎包括一个外部样式表。
- @page - 介绍在打印文档时将应用的版式更改方面。
- @counter-style - 定义不属于预定义样式集的特定计数器样式。
- @namespace - 告诉CSS引擎，必须考虑其所有内容以XML名称空间为前缀。
- @supports - 一个条件组规则，如果浏览器满足给定条件的条件，它将应用其内容。

## 选择器语法
### 简单选择器
- \*
- div svg|a
- .cls
- #id
- [attr=value]
- :hover
- ::before

### 复合选择器
- <简单选择器><简单选择器><简单选择器>
- \* 或者 div 必须写在最前面

### 复杂选择器
- <复合选择器>\<sp><复合选择器>
- <复合选择器>">"<复合选择器>
- <复合选择器>"~"<复合选择器>
- <复合选择器>"+"<复合选择器>
- <复合选择器>"||"<复合选择器>

## 选择器优先级
### 权重计算规则
- 第一等：代表内联样式，如: style=””，权值为1000
- 第二等：代表ID选择器，如：#content，权值为0100
- 第三等：代表类，伪类和属性选择器，如.content，权值为0010
- 第四等：代表类型选择器和伪元素选择器，如div p，权值为0001
- 通配符、子选择器、相邻选择器等的。如*、>、+,权值为0000
- 继承的样式没有权值

## 伪类
- 链接/行为
  - :any-link  匹配任何超链接
  - :link  匹配还未访问过的超链接
  - :visited  已经访问过的超链接
  - :hover
  - :active
  - :focus
  - :target
> 一旦使用过 :link 或者 :visit 后，就无法更改元素除文字颜色以外的其他属性。因为改过以后会重新排版，可以监听到用户访问过哪些网站。

- 树结构
  - :empty
  - :nth-child()
  - :nth-last-child()
  - :first-child :last-child :only-child

- 逻辑型
  - :not伪类
  - :where :has

## 伪元素
- ::before
- ::after
- ::first-line  针对排版以后的 first-line
- ::first-letter

