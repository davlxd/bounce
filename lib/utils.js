var os=require('os');
var ifaces=os.networkInterfaces();
var exec = require('child_process').exec;
var request = require('superagent');

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


function notify_server_when_transfer_succeeded(stdout) {
  request.post(server_addr + ':' + port)
    .send({'cmd': 'transfer_succeeded','data' : stdout})
    .end(function(error, res){
      if (error) {
	console.error('Notify server transfer succeeded error!' + error);
	return ;
      }
    });
}

function notify_server_when_transfer_failed(err_data) {
  request.post(server_addr + ':' + port)
    .send({'cmd': 'transfer_failed','data' : err_data})
    .end(function(error, res){
      if (error) {
	console.error('Notify server transfer succeeded error!' + error);
	return ;
      }
    });
}


// This function is based on `ssh`,
// so make sure you have all hosts held other hosts' pubkey
exports.transfer = function(cmd) {
  var rsync_cmd = 'rsync -vhP ' + cmd.from_path + ' ' + cmd.to + ':' + cmd.to_path;

  var child = exec(rsync_cmd, function (error, stdout, stderr) {
    if (error != null ) {
      console.error('exec error: ' + error);
      notify_server_when_transfer_failed(error);

    } else if (stderr.length != 0) {
      console.error('exec error: ' + stderr);
      notify_server_when_transfer_failed(stderr);

    } else {
      notify_server_when_transfer_succeeded(stdout);
    }
  });

}
