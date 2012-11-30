var twitter = require('ntwitter');
var credentials = require('./credentials.js');

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

// var http = require('http');
// var sys = require('sys');
// var fs = require('fs');
// 
// var connections = [];
// 
// http.createServer(function(req, res) {
//   debugHeaders(req);
// 
//   if (req.headers.accept && req.headers.accept == 'text/event-stream') {
//     if (req.url == '/events') {
//       sendSSE(req, res);
//     } else {
//       res.writeHead(404);
//       res.end();
//     }
//   } else {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write("");
//     res.end();
//   }
// }).listen(8000);
// 
// function sendSSE(req, res) {
//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive'
//   });
// 
//   console.log("added connection");
//   connections.push(res);
// }
// 
// function constructSSE(res, id, data) {
//   res.write('id: ' + id + '\n');
//   res.write("data: " + data + '\n\n');
// }
// 
// function broadcastSSE(data){
//   var id = (new Date()).toLocaleTimeString();
//   connections.each(function(res){
//     constructSSE(res, id, data);
//   });
// }
// 
// function debugHeaders(req) {
//   sys.puts('URL: ' + req.url);
//   for (var key in req.headers) {
//     sys.puts(key + ': ' + req.headers[key]);
//   }
//   sys.puts('\n\n');
// }

t.stream(
    'statuses/filter',
    { track: ['#dpadvent', 'digitpaint'] },
    function(stream) {
        stream.on('data', function(tweet) {
            sys.puts(tweet.text);
            // broadcastSSE(tweet.text);
        });
    }
);


