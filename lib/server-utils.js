var fs = require('fs');
var request = require('superagent');

global.set0 = []; // set0 contains hosts have the complete file
global.set1 = []; // set1 contains hosts don't have it yet

exports.provoke_transfer = function() {
  console.log(set0);
  console.log(set1);
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
