var fs = require('fs');
var request = require('superagent');
var async = require('async');

global.client_list = './peers-list.txt'

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
    cb(results);
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
      cb(null, hostname);
    });
}
