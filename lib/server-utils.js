var fs = require('fs');
var request = require('superagent');

exports.provoke_transfer = function(set0 ,set1) {
  
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
