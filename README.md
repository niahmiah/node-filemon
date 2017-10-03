# filemon

[![Greenkeeper badge](https://badges.greenkeeper.io/niahmiah/node-filemon.svg)](https://greenkeeper.io/)
filemon emits an event containing data for files it is configured to watch.

### Usage:

```
var Filemon = require('./index');
var filemon = new Filemon({
  files: [
  '/proc/vmstat'
  ],
  schedule: '0 * * * * *' // first second of every minute
});

filemon.on('data', function(data){
  console.log('data:',data);
});

filemon.start();
```

### Output:
```
{
  "/proc/vmstat": "...contents of file"
}
 ```
