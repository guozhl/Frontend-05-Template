function findABCDEF (string, str) {
  let exLen = 0;
  for (let i = 0; i < string.length; i++) {
    if (exLen == 0 && string[i] == str[exLen]) {
      exLen++;
    } else if (exLen == 1 && string[i] == str[exLen]) {
      exLen++;
    } else if (exLen == 2 && string[i] == str[exLen]) {
      exLen++;
    } else if (exLen == 3 && string[i] == str[exLen]) {
      exLen++;
    } else if (exLen == 4 && string[i] == str[exLen]) {
      exLen++;
    } else if (exLen == 5 && string[i] == str[exLen]) {
      exLen++;
      return i - exLen + 1;
    } else {
      exLen = 0
    }
  }
  return -1;
}

console.log(findABCDEF('123444abcdef', 'abcdef'))
