# hwmon
hwmon is a hardware monitor written for node.js systems running on Linux.

The current version is simply a wrapper around the 'free' and 'iostat' commands on Linux, that returns the output in JSON format.

### Usage: 

```
var Hwmon = require('./index');
var hwmon = new Hwmon({interval: 2000});

hwmon.on('iostat', function(data){
  console.log('iostat',data);
});

hwmon.on('free', function(data){
  console.log('free',data);
});

hwmon.start();
```

### Output:
```
free { mem:
   { total: 4048032,
     used: 233772,
     free: 3814260,
     shared: 420,
     buffers: 20768,
     cached: 109580 },
  swap: { total: 4191228, used: 0, free: 4191228 } }
  
iostat { 'avg-cpu:':
   { '%user': 0.13,
     '%nice': 0,
     '%system': 0.25,
     '%iowait': 0,
     '%steal': 0,
     '%idle': 99.62 },
  devices: { sda: { tps: 0, 'kB_read/s': 0, 'kB_wrtn/s': 0, kB_read: 0, kB_wrtn: 0 } } }
 
 ```