const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk.toString());
  }).on('end', () => {
    // body = (Buffer.concat([ Buffer.from(body.toString()) ])).toString();
    console.log('body:', body);
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('X-Foo', 'bar');
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(`<html lang="en">

    <head>
    <title>toy-browser</title>
    </head>

    <style>
      body div #myid {
        width: 100px;
        background-color: #ff5000;
      }
    
      body div img {
        width: 30px;
        background-color: #ff1111;
      }
    </style>
    
    <body>
      <div>
        <img id="myid" />
        <img />
      </div>
    </body>
    
    </html>
    `);
  })
}).listen(8088);

console.log("server started")
