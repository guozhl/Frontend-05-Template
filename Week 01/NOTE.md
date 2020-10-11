# 前端技术知识体系
根据自己列出的知识目录和老师的技术脑图做对比，发现自己所列出的都是一些大概念的技术范围，甚至思考的时候都是在想面试题范围。而老师的脑图，则比较系统的列出来知识结构。

这也说明了自己之前在学习过程中都是没有计划没有条理的。基本上都是一头蒙的前进，没有一个系统的规划。

这也导致了自己对所在的领域没有一个整体结构的认识，也即使老师说的，没有形成一个知识体系。

# 三子棋
### 实现思路
1. show，画棋盘，初始化棋盘数组和棋子颜色
2. move，添加点击事件，实现落子
3. check，判断输赢
4. willWin，提示对方是否要赢了
5. 实现 AI，寻找最优解

### AI 逻辑
每次落子后，AI 会把每一个格子试一遍，直到找到最优解。

### Object.create(pattern) 比 JSON.parse(JSON.stringify(pattern)) 好在哪？
Onject.create(obj) 利用原型机制，将创建出来的对象继承原有的对象。
例如：
```javascript
var a = { name: 'skye' };
var b = Object.create(a);

console.log(b);  // {}
console.log(b.__proto__);  // { name: 'skye' }
console.log(b.name);  // skye
```

而 ```JSON.parse(JSON.stringify(pattern))``` 将内容复制，占用内存空间大
例如：
```javascript
var a = { name: 'skye' };
var c = JSON.parse(JSON.stringify(a));

console.log(c); // { name: 'skye' }
console.log(c.__proto__);  // {}
console.log(c.name);  // skye
```


# 红绿灯问题
一个路口的红绿灯，会按照绿灯亮 10 秒，黄灯亮 2 秒，红灯亮 5 秒的顺序无限循环，请编写 js 代码来控制这个红绿灯。

考虑拓展性。如需临时手动控制，如何高效的切换方案。
