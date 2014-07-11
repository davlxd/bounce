var http = require('http');
var fs = require('fs');
var client_utils = require('./lib/client-utils.js');
var server_utils = require('./lib/server-utils.js');
var utils = require('./lib/utils.js');
var path = require('path');

global.run_as = '';  // run as 'server' or 'client'
global.cmd_port = 7105; // port for comand exchange
global.file_port = 5017; // port for file transfer
global.receive_file_path = '';

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



//status list:
//  hungry
//  sending
//  receiving
//  satisfied
function init_set(clients_with_path) {
  set0.push({'host':utils.get_public_ip(), 'status':'satisfied', 'file_path':path.resolve(input_arg)});

  clients_with_path.map(function(client_and_path){
    var joined_path = path.join(client_and_path[1], path.basename(input_arg));
    set1.push({'host':client_and_path[0], 'status':'hungry', 'file_path':joined_path});  
  });

  console.log('Initial hosts:');
  console.log('==================================');
  console.log(set0);
  console.log(set1);
  console.log('==================================');

  server_utils.match_hosts();
}



if (run_as === 'server') {
  server_utils.load_clients(init_set);
}



function server(data, req, res) {
  server_addr = utils.get_public_ip();

  console.log('Receive command `' + data + '`');
  var cmd_obj = JSON.parse(data);

  if (cmd_obj.cmd === 'transfer') {
    utils.transfer(cmd_obj);
    res.end();
    return ;
  }

  if (cmd_obj.cmd === 'transfer_succeeded') {
    server_utils.change_transferred_host_status(cmd_obj);
    server_utils.match_hosts();
    res.end();
    return ;
  }

  if (cmd_obj.cmd === 'transfer_failed') {
    console.log('Previous transfer failed, reset host status and rematch!');
    server_utils.change_transfer_failed_host_status(cmd_obj);
    server_utils.match_hosts();
    res.end();
    return ;
  }
}


function client(data, req, res) {
  server_addr = req.connection.remoteAddress;

  console.log('Receive command `' + data + '`');
  var cmd_obj = JSON.parse(data);
  
  if (cmd_obj.cmd === 'spike') {
    res.end(path.resolve(input_arg)); //response receive path to server
    return ;
  }

  if (cmd_obj.cmd === 'transfer') {
    utils.transfer(cmd_obj);
    res.end();
    return ;
  }
  if (cmd_obj.cmd === 'receive') {
    receive_file_path = cmd_obj.to_path;
    res.end();
    return ;
  }
}


http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    run_as === 'server' ? server(body, req, res) : client(body, req, res);
  });
}).listen(cmd_port);

console.log('Bounce now running as ' + run_as + ' at port ' + cmd_port);



if (run_as === 'client') {
  http.createServer(function (req, res) {
    console.log('Client will receive file store to ' + receive_file_path);
    var writeStream = fs.createWriteStream(receive_file_path);
    req.pipe(writeStream);

    writeStream.on('close', function(){
      console.log('Received');
      res.end();
    });
  }).listen(file_port);

  console.log('Client now listen to receive file at port ' + file_port);
}



