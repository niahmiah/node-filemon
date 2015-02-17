'use strict';
var shell = require('shelljs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

if(!shell.which('free')){
  throw new Error('hwmon requires free');
}

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
  var free = shell.exec('free -o', {async: true, silent: true});
  free.stdout.on('data', function(data){
    var lines = data.split('\n');
    var headers = lines[0].split(/\s+/);
    var mem = lines[1].split(/\s+/);
    var swap = lines[2].split(/\s+/);

    var freeJSON = {
      mem: {},
      swap: {}
    };

    for(var i=1; i<headers.length; i++){
      freeJSON.mem[headers[i]] = parseInt(mem[i]);
      if(swap[i]){
        freeJSON.swap[headers[i]] = parseInt(swap[i]);
      }
    }

    self.emit('free', freeJSON);
  });
};

module.exports = Free;