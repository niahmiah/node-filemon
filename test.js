var Hwmon = require('./index');
var hwmon = new Hwmon({interval: 2000});

hwmon.on('iostat', function(data){
  console.log(data);
});

hwmon.start();

setTimeout(function(){
  hwmon.stop();
},5000);

