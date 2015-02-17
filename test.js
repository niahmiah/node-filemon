var Hwmon = require('./index');
var hwmon = new Hwmon({interval: 2000});

hwmon.on('iostat', function(data){
  console.log('iostat',data);
});

hwmon.on('free', function(data){
  console.log('free',data);
});

hwmon.start();

setTimeout(function(){
  hwmon.stop();
},5000);

