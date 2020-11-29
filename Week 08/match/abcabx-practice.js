// 使用状态机找 abcabx, abc abx 作为两个循环 

var circle = 1;

function match (string) {
  let state = start;
  for (let c of string) {
    state = state(c);
  }
  return circle == 2 && state === end;
}

function start (c) {
  if (c === 'a')
    return foundA;
  else
    return start;
}

function end (c) {
  return end;
}

function foundA (c) {
  if (c === 'b')
    return foundB;
  else
    return start(c);
}

function foundB (c) {
  if (c === 'c') {
    return foundC;
  } else if (c === 'x') {
    return end;
  } else {
    circle = 1;
    return start(c);
  }
}

function foundC (c) {
  if (c === 'a') {
    circle = 2;
    return foundA;
  } else {
    circle = 1;
    return start(c);
  }
}
console.log(match("abcabcabbhyb"))
