# hwmon
hwmon is a hardware monitor written for node.js systems running on Linux.

The current version is simply a wrapper around the iostat command on Linux, that returns the output in JSON format.

### Usage: 

```
var Hwmon = require('./index');
var hwmon = new Hwmon({interval: 2000});

hwmon.on('iostat', function(data){
  console.log(data);
});

hwmon.start();
```

### Output:
```
{ 
  'avg-cpu:': {
     '%user': '0.08',
     '%nice': '0.00',
     '%system': '0.13',
     '%iowait': '0.00',
     '%steal': '0.00',
     '%idle': '99.79' 
   },
   devices: { 
     sda: { 
       tps: '0.61',
       'kB_read/s': '7.40',
       'kB_wrtn/s': '4.01',
       'kB_read': '81191',
       'kB_wrtn': '44008' 
     } 
   } 
}
```