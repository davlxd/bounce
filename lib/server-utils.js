var fs = require('fs');
var request = require('superagent');
var async = require('async');

global.client_list = './peers-list.txt'


global.set0 = []; // set0 contains hosts have the complete file
global.set1 = []; // set1 contains hosts don't have it yet

exports.provoke_transfer = function() {
  if (set1.length === 0) {
    console.log('Complete file distribution, bye~');
    process.exit(0);
  }

  var hungry_host_arr = set1.filter(function(node){
    return node.status === 'hungry';
  });

  if (hungry_host_arr.length === 0) {
    console.log('No more hungry hosts, just wait');
    return ;
  }

  var satisfied_host_arr = set0.filter(function(node){
    return node.status === 'satisfied';
  });

  if (satisfied_host_arr.length === 0) {
    console.log('No more satisfied hosts, just wait');
    return ;
  }
  
  var hungry_host = hungry_host_arr[0];
  var satisfied_host = satisfied_host_arr[0];
				 
  console.log(set0);
  console.log(set1);
}

exports.load_clients = function (cb) {
  var clients_arr = fs.readFileSync(client_list).toString().split("\n");
  clients_arr = clients_arr.filter(function(value){
    return value != '';
  });
  async.map(clients_arr, spike_client, function(err, results){
    if (err) {
      console.log(err);
      process.exit(1);
    }
    cb(clients_arr, results);
  });

}

function spike_client(hostname, cb) {
  if ( hostname === '')
      return ;

  request.post(hostname + ':' + port)
    .send({'cmd': 'spike'})
    .end(function(error, res){
      if (error) {
	process.exit(1);
      }
      
      var body = "";
      res.on('data', function (chunk) {
	body += chunk;
      });
      res.on('end', function () {
	cb(null, body);
      });
    });
}
