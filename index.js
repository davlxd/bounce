var http = require('http');
var fs = require('fs');
var request = require('superagent');
var client_utils = require('./lib/client-utils.js');
var server_utils = require('./lib/server-utils.js');

global.run_as = '';  // run as 'server' or 'client'
global.port = 7105;


var input_arg = process.argv[2];

try {
  if (fs.lstatSync(input_arg).isFile()) // server provide this file
    run_as = 'server';
  else if (fs.lstatSync(input_arg).isDirectory()) // client receive file at here
    run_as = 'client';
  else
    throw new Error('Not a file or directory');
} catch (err) {
  console.log(err);
  process.exit(1);
}



// init data structure here (2 set)
// set0 contains hosts have the complete file
// set1 contains hosts don't have it yet
function init_set(clients) {
  var set0 = [], set1 = [];
  
  server_utils.provoke_transfer(set0, set1);
}



if (run_as === 'server') {
  client_utils.load_clients(init_set);
}



function server(data, res) {
  console.log('server' + data);
}


function client(data, res) {
  var obj = JSON.parse(data);
  if (obj.cmd === 'spkie')
    res.end();
  
}


http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    run_as === 'server' ? server(body, res) : client(body, res);
  });
}).listen(7105);

console.log('Bounce now running as ' + run_as + ' at port ' + port);



