'use strict';
var shell = require('shelljs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

if(!shell.which('iostat')){
  throw new Error('hwmon requires iostat');
}

function Hwmon(options){
  this.interval = options.interval;
  this.timer = null;
}

util.inherits(Hwmon, EventEmitter);

Hwmon.prototype.start = function(){
  var self = this;
  self.timer = setInterval(function(){
    self.fetchData();
  }, self.interval);
  self.timer.unref();
}

Hwmon.prototype.stop = function(){
  clearInterval(this.timer);
  this.timer = null;
}

Hwmon.prototype.fetchData = function(){
  var self = this;
  var stats = false;
  var sysInfo;
  var iostat = shell.exec('iostat', {async: true, silent: true});
  iostat.stdout.on('data', function(data){
    var lines = data.split('\n');
    if(!stats){
      sysInfo = lines[0];
      var isLinux = (sysInfo.indexOf('Linux') > -1);
      if(!isLinux){
        throw new Error('hwmon only works on Linux at this time.');
      }
      stats = true;
    }else{
      var cpuHeaders = lines[0];
      var cpuMetrics = lines[1];
      var devHeaders = lines[3];
      var devMetrics = [];
      var devMetricNum = 0;
      for(var i = 4; i < lines.length; i++){
        if(lines[i].length){
          devMetrics[devMetricNum] = lines[i];
          devMetricNum++;
        }
      }

      cpuHeaders = cpuHeaders.split(/\s+/);
      cpuMetrics = cpuMetrics.split(/\s+/);
      devHeaders = devHeaders.split(/\s+/);
      for(var i=0;i<devMetrics.length;i++){
        devMetrics[i] = devMetrics[i].split(/\s+/);
      }
   
      var iostatJSON = {};
      iostatJSON[cpuHeaders[0]] = {};
      for(var i=1; i<cpuHeaders.length; i++){
        iostatJSON[cpuHeaders[0]][cpuHeaders[i]] = cpuMetrics[i];
      }
      iostatJSON.devices = {};
      for(var i=0; i<devMetrics.length; i++){
        iostatJSON.devices[devMetrics[i][0]] = {};
        for(var j=0; j<devMetrics[i].length; j++){
          if(j>0) iostatJSON.devices[devMetrics[i][0]][devHeaders[j]] = devMetrics[i][j]
        }
      }
      
      self.emit('iostat', iostatJSON);
    }
  });
}

module.exports = Hwmon;