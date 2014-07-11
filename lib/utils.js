var os=require('os');
var fs = require('fs');
var ifaces=os.networkInterfaces();
var exec = require('child_process').exec;
var superagent = require('superagent');
var request = require('request');

// This function extremely fragile!
exports.get_public_ip = function() {
  for (var dev in ifaces) {
    var addr_object_arr =  ifaces[dev].filter(function(addr_obj){
      return addr_obj.family === 'IPv4' && addr_obj.address != '127.0.0.1'
    });

    if (addr_object_arr.length === 0)
      continue;

    var addr = addr_object_arr[0].address;
    return addr;
  }
}


function notify_server_when_transfer_succeeded(orig_cmd) {
  superagent.post(server_addr + ':' + cmd_port)
    .send(
      {'cmd': 'transfer_succeeded',
       'from' : orig_cmd.from,
       'to' : orig_cmd.to
      })
    .end(function(error, res){
      if (error) {
	console.error('Notify server transfer succeeded error!' + error);
	return ;
      }
    });
}

function notify_server_when_transfer_failed(orig_cmd) {
  superagent.post(server_addr + ':' + cmd_port)
    .send(
      {'cmd': 'transfer_failed',
       'from' : orig_cmd.from,
       'to' : orig_cmd.to
      })
    .end(function(error, res){
      if (error) {
	console.error('Notify server transfer failed error!' + error);
	return ;
      }
    });
}


exports.transfer = function(cmd) {
  var readStream = fs.createReadStream(cmd.from_path);
  readStream.pipe(request.post('http://' + cmd.to + ':' + file_port));
  
  readStream
    .on('end', function() {
      notify_server_when_transfer_succeeded(cmd);
    })
    .on('error', function(error) {
      console.error('read error: ' + error);
      notify_server_when_transfer_failed(cmd);
    });
}
