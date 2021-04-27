const http = require('http');
const url = require('url');

http.createServer((req,res)=>{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>hello hyunhee!!</h1>');
    res.end();
}).listen(3000);