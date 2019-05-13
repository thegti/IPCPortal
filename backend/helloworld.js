var http=require('http');
http.createServer(function(req,res)
{
    // res.writeHead(200,{'content-type':'text/plain'});
    res.end('Hello ');
}).listen(4200);
console.log('hello');
