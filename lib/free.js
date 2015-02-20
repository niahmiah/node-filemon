'use strict';
var shell = require('shelljs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var meminfo = '/proc/meminfo';
var fs = require('fs');        
fs.exists(meminfo, function( exists ) {        
    if(!exists) { throw new Error('this requires /proc/meminfo'); }    
});

function Free(options){
  this.interval = options.interval;
  this.timer = null;
}

util.inherits(Free, EventEmitter);

Free.prototype.start = function(){
  var self = this;
  self.stop();
  self.timer = setInterval(function(){
    self.fetchData();
  }, self.interval);
  self.timer.unref();
};

Free.prototype.stop = function(){
  var self = this;
  if(self.timer){
    clearInterval(self.timer);
    self.timer = null;
  }
};

Free.prototype.fetchData = function(){
  var self = this;
  var free = shell.exec('cat '+meminfo, {async: true, silent: true});
  free.stdout.on('data', function(data){
    var lines = data.split('\n');
    var freeJSON = {};
    lines.forEach(function(line){
      var d = line.split(/\s+/);
      if(d[0]){
        var val = d[1];
        if(d[2]){
          val = val+' '+d[2]
        }
        freeJSON[d[0]] = d[1];
      }
    });

    self.emit('free', freeJSON);
  });
};

module.exports = Free;