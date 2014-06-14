var os=require('os');
var ifaces=os.networkInterfaces();


//This function extremely fragile!
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

