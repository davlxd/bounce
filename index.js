var http = require('http');
var fs = require('fs');
var request = require('superagent');

global.run_as = '';  // run as 'server' or 'client'

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

function server(req, res) {
  console.(req.body);
  
}


function server(req, res) {
  console.(req.body);
}


http.createServer(function (req, res) {
  run_as === 'server' ? server(req, res) : client(req, res);
}).listen(7105);

console.log('Bounce now running as ' + run_as + ' at port 7105');



