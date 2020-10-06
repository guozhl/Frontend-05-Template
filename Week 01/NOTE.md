学习笔记
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
