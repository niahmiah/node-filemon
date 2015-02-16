'use strict';
var Watcher = require('../index');

var files = [
  '/proc/cpuinfo',
  '/proc/diskstats', // contains disk statistics
  '/proc/loadavg',
  '/proc/meminfo',
  '/proc/stat', // contains system statistics
  '/proc/uptime', // contains system uptime
  '/proc/version',
  '/proc/vmstat'
];

var watcher = new Watcher({
  schedule: '*/5 * * * * *',
  files: files
});

watcher.on('data', function(data){
  console.log('data:', data);
});

watcher.start();

setTimeout(function(){
  watcher.stop();
}, 25000);
