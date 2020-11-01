function find (source, pattern) {

  // 统计 pattern 中 * 号的数量
  let starCount = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "*")
      starCount++;
  }

  // 处理没有 * 号的情况
  if (starCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== "?") 
        return false;
    }
    return;
  }

  let i = 0;
  let lastIndex = 0;

  // 比对第一个 * 之前的字符串，并找到第一个 * 的位置
  for (i = 0; pattern[i] !== "*"; i++) {
    if(pattern[i] !== source[i] && pattern[i] !== "?") 
      return false;
  }

  // reg.lastIndex: 一个整数，标示开始下一次匹配的字符位置。
  // 分段匹配 例如：[*]b [*]bx
  lastIndex = i;
  for(let p = 0; p < starCount - 1; p++) {
    i++;
    let subPattern = "";
    while(pattern[i] !== "*") {
      subPattern += pattern[i];
      i++;
    }

    let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g");
    reg.lastIndex = lastIndex;

    if(!reg.exec(source)) 
      return false;

    lastIndex = reg.lastIndex;
  }

  // 倒着对比最后一个 * 后面的字符串
  for(let j = 1; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
    if(pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== "?")
      return false;
  }

  return true;
}

console.log(find("abcabcabxaac", "a*b?*b?x*c"))
