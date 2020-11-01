/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  // 计算 table
  let table = new Array(needle.length).fill(0);

  if(table.length === 0)
    return 0

  {
    let i = 1, j = 0;

    while (i < needle.length) {
      if (needle[i] === needle[j]) {
        ++j, ++i;
        table[i] = j;
      } else {
        if (j > 0)
          j = table[j];
        else
          ++i;
      }
    }
  }


  // 匹配
  {
    let i = 0, j = 0;
    while (i < haystack.length) {
      if (needle[j] === haystack[i])
        ++i, ++j;
      else {
        if (j > 0) {
          j = table[j];
        } else
          ++i;
      }
      if (j === needle.length)
        return i - needle.length;
    }
    return -1;
  }
};

console.log(strStr("hello", "ll"))
