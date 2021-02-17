/**
 * 接收 html文本，返回 dom 树
 */

const css = require('css');

let currentToken = null;
let currentAttribute = null;

let stack = [{ type: 'document', children: [] }];
let currentTextNode = null;

let rules = [];
const EOF = Symbol("EOF");

// 把css规则暂存到一个数组里
function addCSSRules (text) {
  var ast = css.parse(text);
  console.log(JSON.stringify(ast, null, '    '));
  rules.push(...ast.stylesheet.rules);
}

// function match (element, selector) {
//   if (!selector || !element.attributes) {
//     return false;
//   }

//   if (selector.charAt(0) === '#') {
//     var attr = element.attributes.filter(attr => attr.name === 'id')[0];
//     if (attr && attr.value === selector.replace('#', '')) {
//       return true;
//     }
//   } else if (selector.charAt(0) === '.') {
//     var attr = element.attributes.filter(attr => attr.name === 'id')[0];
//     if (attr && attr.value === selector.replace('.', '')) {
//       return true;
//     }
//   } else {
//     if (element.tagName === selector) {
//       return true;
//     }
//   }
//   return false;
// }

// function specificity (selector) {
//   var p = [0, 0, 0, 0];
//   var selectorParts = selector.split(" ");
//   for (var part of selectorParts) {
//     if (part.charAt(0) === '#') {
//       p[1] += 1;
//     } else if (part.charAt(0) === '.') {
//       p[2] += 1;
//     } else {
//       p[3] += 1;
//     }
//   }
//   return p;
// }

// function compare (sp1, sp2) {
//   if (sp1[0] - sp2[0]) {
//     return sp1[0] - sp2[0];
//   }
//   if (sp1[1] - sp2[1]) {
//     return sp1[1] - sp2[1];
//   }
//   if (sp1[2] - sp2[2]) {
//     return sp1[2] - sp2[2];
//   }
//   return sp1[3] - sp2[3];
// }

function computeCSS (element) {
  let elements = stack.slice().reverse();
//   if (!element.computedStyle) {
//     element.computedStyle = {};
//   }

//   for (let rule of rules) {
//     var selectorParts = rule.selectors[0].split(" ").reverse();
//     if (!match(element, selectorParts[0])) {
//       continue;
//     }

//     let matched = false;

//     var j = 1;
//     for (var i = 0; i < elements.length; i++) {
//       if (match(elements[i], selectorParts[i])) {
//         j++;
//       }
//     }

//     if (j >= selectorParts.length) {
//       matched = true;
//     }

//     if (matched) {
//       var sp = specificity(rule.selectors[0]);
//       var computedStyle = element.computedStyle;
//       for (var declaration of rule.declarations) {
//         if (!computedStyle[declaration.property]) {
//           computedStyle[declaration.property] = {};
//         }
//         if (!computedStyle[declaration.property].specificity) {
//           computedStyle[declaration.property].value = declaration.value;
//           computedStyle[declaration.property].specificity = sp;
//         } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
//           computedStyle[declaration.property].value = declaration.value;
//           computedStyle[declaration.property].specificity = sp;
//         }
//       }
//     }
//   }
}


function emit (token) {
  // 取栈顶
  let top = stack[stack.length - 1];

  if (token.type == 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName;

    for (let p in token) {
      if (p != 'type' || p != 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    computeCSS(element);

    top.children.push(element);

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;

  } else if (token.type === 'endTag') {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match")
    } else {
      // 结束标签遇到style，说明属性是 style，执行添加CSS规则的操作
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content);
      }
      stack.pop();
    }
    currentTextNode = null

  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data (c) {
  if (c == '<') {
    // 代表标签开始，不是开始标签 -- <div> 或者 </div>
    return tagOpen;
  } else if (c == EOF) {
    emit({
      type: 'EOF'
    });
    return;
  } else {
    emit({
      type: 'text',
      content: c
    });
    return data;
  }
}

function tagOpen (c) {
  if (c == '/') {
    // 结束标签
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 开始标签 或者 自封闭标签 -- <div>  或者 <div />
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c);
  } else {
    emit({
      type: 'text',
      content: c
    })
    return;
  }
}

function endTagOpen (c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c);
  } else if (c == '>') {
    // 此类情况：</>，进行错误处理
  } else if (c == EOF) {
    // 此类情况：EOF，进行错误处理
  } else {

  }
}

function tagName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    // 遇到属性：<div prop="">
    return beforeAttributeName;
  } else if (c == '/') {
    // 自封闭标签：<div/>
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c == '>') {
    // 普通开始标签：<div>
    emit(currentToken);
    return data;
  } else {
    currentToken.tagName += c;
    return tagName;
  }
}

function afterQuotedAttributeValue (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data
  } else if (c === EOF) {
    // 处理错误
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function afterAttributeName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    }
    return attributeName(c);
  }
}

{/* <div prop=""> */ }
function beforeAttributeName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    // 遇到空格
    return beforeAttributeName;
  } else if (c == '/' || c == '>' || c == EOF) {
    // ？？？
    return afterAttributeName(c);
  } else if (c == '=') {
    // 处理错误
  } else {
    // 遇到字母
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c);
  }
}

function attributeName (c) {
  if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    // ？？？
    return afterAttributeName(c);
  } else if (c == '=') {
    // 属性的 value
    return beforeAttributeValue;
  } else if (c == '\u0000') {

  } else if (c == "\"" || c == "'" || c == "<") {

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue (c) {
  if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    return beforeAttributeValue;
  } else if (c == "\"") {
    return doubleQuotedAttributeValue;
  } else if (c == "\'") {
    return singleQuotedAttributeValue;
  } else if (c == ">") {

  } else {
    return UnquotedAttributeValue(c);
  }
}

{/* <div prop="value"></div> */ }
function doubleQuotedAttributeValue (c) {
  if (c === "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

{/* <div prop='value'></div> */ }
function singleQuotedAttributeValue (c) {
  if (c === "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function UnquotedAttributeValue (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken)
    return data
  } else if (c === '\u0000') {

  } else if (c == "\"" || c == "'" || c == "<" || c == '=' || c == '`') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}

function selfClosingStartTag (c) {
  // 自封闭标签 <div/>  / 后面只有 > 是有效的
  if (c == '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c == "EOF") {

  } else {

  }
}

module.exports.parseHTML = function parseHTML (html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
}
