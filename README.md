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
