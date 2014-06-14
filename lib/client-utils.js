var fs = require('fs');
var request = require('superagent');
var async = require('async');

global.client_list = './peers-list.txt'

exports.load_clients = function () {
  var clients_arr = fs.readFileSync(client_list).toString().split("\n");
  async.map(clients_arr, spike_client, function(err, result){
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log('result = ' + result);
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
