const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.log('88888')
    console.error(err);
  }).on('data', (chunk) => {
    console.log('8888877')
    body.push(chunk.toString());
  }).on('end', () => {
    console.log('8888998')
    body = (Buffer.concat([ Buffer.from(body.toString()) ])).toString();
    // body = Buffer.concat(body).toString();
    console.log('body:', body);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(' Hello world\n');
  })
}).listen(8088);

console.log("server started")
 