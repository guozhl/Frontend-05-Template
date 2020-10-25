## LL算法构建AST

计算机解析代码步骤：
分词 -> 构建语法树 -> 解析

AST：抽象语法树

构成抽象语法树案例：分析四则运算，构成 AST
词法定义：
- TokenNumber
  支持 1 2 3 4 5 6 7 8 9 0 和小数点 . 的组合
- Operator 
  支持 + - * / 之一
- Whitespace
  支持 [空格] [换行] 
- LineTerminator
  终止符

语法定义：
```javascript
// 表达式
<Expression>::=
  <AdditiveExpression><EOF>

// 加法 嵌套乘法  number*1 + MultiplicativeExpression
<AdditiveExpression>::=
  <MultiplicativeExpression>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>

// 乘法
<MultiplicativeExpression>::=
  <Number>
  |<MultiplicativeExpression><*><Number>
  |<MultiplicativeExpression></><Number>
```

代码实现：
1.html 2.html 实现词法分析


