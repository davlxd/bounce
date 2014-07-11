var fs = require('fs');
var superagent = require('superagent');
var async = require('async');
var _ = require('underscore');

global.client_list = './peers-list.txt'


global.set0 = []; // set0 contains hosts have the complete file
global.set1 = []; // set1 contains hosts don't have it yet


function do_match_hosts() {
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

  provoke_trasfer(satisfied_host, hungry_host);
}

exports.match_hosts = function() {
  do_match_hosts();
}


exports.change_transferred_host_status = function(cmd_obj) {
  var from_addr = cmd_obj.from;
  var to_addr = cmd_obj.to;

  var from_host = set0.filter(function(node){
    return node.host === from_addr;
  })[0];
  from_host.status = 'satisfied';

  var to_host = set1.filter(function(node){
    return node.host === to_addr;
  })[0];

  var to_host_index = set1.indexOf(to_host);
  set1.splice(to_host_index, 1);

  to_host.status = 'satisfied';
  set0.push(to_host);

  console.log('\nAfter change transfer succeeded host status:');
  console.log('==============================================');
  console.log(set0);
  console.log(set1);
  console.log('==============================================');
}


exports.change_transfer_failed_host_status = function(cmd_obj) {
  var from_addr = cmd_obj.from;
  var to_addr = cmd_obj.to;

  var from_host = set0.filter(function(node){
    return node.host === from_addr;
  })[0];
  from_host.status = 'satisfied';

  var to_host = set1.filter(function(node){
    return node.host === to_addr;
  })[0];

  to_host.status = 'hungry';

  console.log('\nAfter change transfer failed host status:');
  console.log('==============================================');  
  console.log(set0);
  console.log(set1);
  console.log('==============================================');
}

function change_transfering_host_status(from_host, to_host) {
  from_host.status = 'sending';
  to_host.status = 'receving';

  console.log('\nAfter change transferring host status:');
  console.log('==============================================');
  console.log(set0);
  console.log(set1);
  console.log('==============================================');
}

function provoke_trasfer(from_host, to_host) {
  console.log('Provoke transfer, from ' + from_host.host + ':' + from_host.file_path + ', to ' + to_host.host + ':' + to_host.file_path);
  superagent.post(to_host.host + ':' + cmd_port)
    .send(
      {'cmd' : 'receive',
       'to_path' : to_host.file_path
      })
    .end(function(error, res){
      if (error) {
	console.error('Send receive command to ' + from_host.host + ' error!' + error);
	return ;
      }
      superagent.post(from_host.host + ':' + cmd_port)
	.send(
	  {'cmd' : 'transfer',
	   'from_path' : from_host.file_path,
	   'to' : to_host
	  })
	.end(function(error, res){
	  if (error) {
	    console.error('Send transfer command to ' + from_host.host + ' error!' + error);
	    return ;
	  }
	  change_transfering_host_status(from_host, to_host);
	  do_match_hosts();
	});
    });
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
    var no_err_clients = _.zip(clients_arr, results).filter(function(client_and_path){
      return client_and_path[1] != '';
    });
    cb(no_err_clients);
  });

}

function spike_client(hostname, cb) {
  superagent.post(hostname + ':' + cmd_port)
    .send({'cmd': 'spike'})
    .end(function(error, res){
      if (error) {
	console.error('Spike client host ' + hostname +' error!' + error);
	cb(null, '');
	return ;
      }
      
      var body = "";  // Extract path from client respond
      res.on('data', function (chunk) {
	body += chunk;
      });
      res.on('end', function () {
	cb(null, body);
      });
    });
}
