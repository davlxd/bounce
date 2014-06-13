var fs = require('fs');
var request = require('superagent');

global.client_list = './peers-list.txt'

exports.load_clients = function () {
  var clients_arr = fs.readFileSync(client_list).toString().split("\n");
  for(i in clients_arr) {
    var hostname = clients_arr[i];
    if ( hostname === '')
      continue;
    console.log('Load ' + clients_arr[i]);
    spike_client(clients_arr[i]);
  }
}

function spike_client(hostname) {
  request.post(hostname + ':' + port)
    .send({'cmd': 'spike'})
    .end(function(error, res){
      if (error) {
	process.exit(1);
      }
    });
}
