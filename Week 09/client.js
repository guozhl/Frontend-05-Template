const net = require('net');
const parser = require('./parser.js')

class Request {
  // 收集请求头信息
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.body = options.body || {};
    this.headers = options.headers || {};

    // headers 添加默认的 Content-Type 属性
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = "application/x-www-form-urlencoded";
    }

    if (this.headers['Content-Type'] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === "application/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&");
    }

    // headers 添加 Content-Length 属性
    this.headers["Content-Length"] = this.bodyText.length;
  }

  // 请求头格式
  toString () {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
  }

  // 发送请求
  send (connection) {
    return new Promise((reslove, reject) => {
      // 逐步收到response
      const parser = new ResponseParser;
      // 支持已有的 connection 或新建 connection
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString());
        })
      }

      connection.on('data', (data) => {
        parser.receive(data.toString());
        if (parser.isFinished) {
          reslove(parser.response);
          // 关掉 connection
          connection.end();
        }
      })

      connection.on('error', (err) => {
        reject(err);
        connection.end();
      })
    })
  }
}

// 逐步接收response文本，进行分析
class ResponseParser {
  constructor() {
    // \r
    this.WAITING_STATUS_LINE = 0;
    // \n
    this.WAITING_STATUS_LINE_END = 1;
    // header_name
    this.WAITING_HEADER_NAME = 2;
    // header_name 后面的空格
    this.WAITING_HEADER_SPACE = 3;
    // header_value
    this.WAITING_HEADER_VALUE = 4;
    // header_end
    this.WAITING_HEADER_LINE_END = 5;
    // header 后的空行
    this.WAITING_HEADER_BLOCK_END = 6;
    // body
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }

  get isFinished () {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response () {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  receive (string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  // 状态机
  receiveChar (char) {
    // 开始处理 request line ----- POST /HTTP/1.1\r\n
    if (this.current === this.WAITING_STATUS_LINE) {
      // 处理 \r
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      // 处理 \n
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      // 开始处理 headers ----- key: value
      if (char === ':') {
        // 遇到字符是 :
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === '\r') {
        // 两种情况：1. 没有 headers，直接到空行
        // 2. headers结束
        this.current = this.WAITING_HEADER_BLOCK_END;
        // body 和 header 相关，由 header 决定应该如何处理 body 内容
        // 举例 chunked
        if (this.headers['Transfer-Encoding'] === 'chunked')
          this.bodyParser = new TrunkedBodyParser();
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      // 处理 空格 ' '
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      // 处理 value
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_BODY) {
      // 接收 body 字符
      this.bodyParser.receiveChar(char);
    }
  }
}

void async function () {
  let request = new Request({
    method: 'POST',  // HTTP
    host: '127.0.0.1',  // ip
    port: '8088',  // tcp
    path: '/',  // HTTP
    headers: {
      ['X-Foo2']: 'customed'
    },
    body: {
      name: 'skye'
    }
  })

  // 第一步 URL -> HTML
  let response = await request.send();

  // 第二步 HTML -> DOM
  // 事实上浏览器逐段返回 response 进行解析
  let dom = parser.parseHTML(response.body);
}();

class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }

  receiveChar (char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    } else if (this.current === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}
